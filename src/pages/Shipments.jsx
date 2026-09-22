import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import EntityManager from '../components/common/EntityManager';
import StatusBadge from '../components/common/StatusBadge';
import { formatDate } from '../utils/format';

const STATUSES = ['Pending', 'Shipped', 'In Transit', 'Delivered', 'Cancelled'];

export default function Shipments() {
  const [salesOrders, setSalesOrders] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    api.salesOrders.list().then(setSalesOrders).catch(() => setSalesOrders([]));
    api.customers.list().then(setCustomers).catch(() => setCustomers([]));
  }, []);

  const orderLabel = useMemo(() => {
    const customerMap = new Map(customers.map((c) => [c.id, c.company || c.name]));
    const map = new Map(
      salesOrders.map((o) => [o.id, `${o.orderNumber} — ${customerMap.get(o.customerId) || 'Unknown'}`])
    );
    return (id) => map.get(id) || 'Unlinked order';
  }, [salesOrders, customers]);

  const columns = useMemo(
    () => [
      {
        key: 'shipmentNumber',
        label: 'Shipment',
        render: (row) => (
          <div>
            <div className="cell-primary">{row.shipmentNumber}</div>
            <div className="sub">{orderLabel(row.salesOrderId)}</div>
          </div>
        ),
      },
      { key: 'carrier', label: 'Carrier' },
      { key: 'trackingNumber', label: 'Tracking #' },
      { key: 'shipDate', label: 'Ship date', render: (row) => formatDate(row.shipDate) },
      { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    ],
    [orderLabel]
  );

  const fields = useMemo(
    () => [
      {
        name: 'salesOrderId',
        label: 'Sales order',
        type: 'select',
        required: true,
        fullWidth: true,
        options: salesOrders.map((o) => ({
          value: o.id,
          label: `${o.orderNumber} — ${customers.find((c) => c.id === o.customerId)?.company || customers.find((c) => c.id === o.customerId)?.name || 'Unknown'}`,
        })),
      },
      { name: 'carrier', label: 'Carrier', placeholder: 'FedEx, UPS, DHL…' },
      { name: 'trackingNumber', label: 'Tracking number' },
      { name: 'shipDate', label: 'Ship date', type: 'date' },
      { name: 'estimatedDelivery', label: 'Estimated delivery', type: 'date' },
      { name: 'status', label: 'Status', type: 'select', options: STATUSES, default: 'Pending' },
      { name: 'shippingAddress', label: 'Shipping address', type: 'textarea', fullWidth: true },
      { name: 'notes', label: 'Notes', type: 'textarea', fullWidth: true },
    ],
    [salesOrders, customers]
  );

  return (
    <EntityManager
      title="Shipping"
      subtitle="Track outbound shipments against sales orders."
      singularLabel="Shipment"
      api={api.shipments}
      columns={columns}
      fields={fields}
      filters={[{ name: 'status', label: 'All statuses', options: STATUSES }]}
      searchPlaceholder="Search tracking #…"
      emptyTitle="No shipments yet"
      emptyMessage="Log a shipment once a sales order is ready to go out the door."
    />
  );
}
