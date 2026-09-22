import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import StatStrip from '../components/common/StatStrip';
import StatusBadge from '../components/common/StatusBadge';
import EmptyState from '../components/common/EmptyState';
import { formatCurrency, formatDate } from '../utils/format';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([api.dashboard.stats(), api.customers.list()])
      .then(([s, c]) => {
        setStats(s);
        setCustomers(c);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const customerName = useMemo(() => {
    const map = new Map(customers.map((c) => [c.id, c.company || c.name]));
    return (id) => map.get(id) || 'Unknown customer';
  }, [customers]);

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <div>
            <h1>Dashboard</h1>
            <p>Loading your business overview…</p>
          </div>
        </div>
        <div className="table-wrap">
          {[...Array(4)].map((_, i) => (
            <div className="skeleton-row" key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="page-header">
          <h1>Dashboard</h1>
        </div>
        <div className="error-banner">
          {error}
          {error.includes('Database file not found') && (
            <> — run <code>npm run seed</code> in the backend project, then refresh.</>
          )}
        </div>
      </div>
    );
  }

  const tiles = [
    { label: 'Revenue collected', value: formatCurrency(stats.revenue) },
    { label: 'Outstanding balance', value: formatCurrency(stats.outstanding), tone: stats.outstanding > 0 ? 'warn' : undefined },
    { label: 'Sales orders', value: stats.counts.salesOrders },
    { label: 'Purchase orders', value: stats.counts.purchaseOrders },
    { label: 'Pending shipments', value: stats.pendingShipmentsCount },
    { label: 'Low stock items', value: stats.lowStockCount, tone: stats.lowStockCount > 0 ? 'danger' : undefined },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Here's how the business is running right now.</p>
        </div>
      </div>

      <StatStrip stats={tiles} />

      <div className="dashboard-grid">
        <div className="panel">
          <div className="section-title">
            <span>Recent sales orders</span>
            <Link to="/sales-orders" className="btn btn-ghost btn-sm">
              View all
            </Link>
          </div>
          {stats.recentSalesOrders.length === 0 ? (
            <EmptyState title="No sales orders yet" message="They'll show up here once created." />
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th className="num">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentSalesOrders.map((o) => (
                    <tr key={o.id}>
                      <td className="cell-primary">{o.orderNumber}</td>
                      <td>{customerName(o.customerId)}</td>
                      <td>
                        <StatusBadge status={o.status} />
                      </td>
                      <td className="num">{formatCurrency(o.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="panel">
          <div className="section-title">
            <span>Recent invoices</span>
            <Link to="/invoices" className="btn btn-ghost btn-sm">
              View all
            </Link>
          </div>
          {stats.recentInvoices.length === 0 ? (
            <EmptyState title="No invoices yet" message="They'll show up here once created." />
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Due</th>
                    <th>Status</th>
                    <th className="num">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentInvoices.map((inv) => (
                    <tr key={inv.id}>
                      <td className="cell-primary">{inv.invoiceNumber}</td>
                      <td className="cell-muted">{formatDate(inv.dueDate)}</td>
                      <td>
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="num">{formatCurrency(inv.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {stats.lowStockItems.length > 0 && (
        <div className="panel mt-16">
          <div className="section-title">
            <span>Low stock items</span>
            <Link to="/items" className="btn btn-ghost btn-sm">
              View all
            </Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>SKU</th>
                  <th className="num">On hand</th>
                  <th className="num">Reorder level</th>
                </tr>
              </thead>
              <tbody>
                {stats.lowStockItems.map((item) => (
                  <tr key={item.id}>
                    <td className="cell-primary">{item.name}</td>
                    <td className="cell-muted">{item.sku}</td>
                    <td className="num">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="num">{item.reorderLevel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
