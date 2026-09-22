import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import EntityManager from '../components/common/EntityManager';
import { formatCurrency } from '../utils/format';

export default function Items() {
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.stores.list().then(setStores).catch(() => setStores([]));
    api.items.categories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const storeName = useMemo(() => {
    const map = new Map(stores.map((s) => [s.id, s.name]));
    return (id) => map.get(id) || '—';
  }, [stores]);

  const columns = useMemo(
    () => [
      {
        key: 'name',
        label: 'Item',
        render: (row) => (
          <div>
            <div className="cell-primary">{row.name}</div>
            <div className="sub">{row.sku}</div>
          </div>
        ),
      },
      { key: 'category', label: 'Category' },
      { key: 'storeId', label: 'Store', render: (row) => storeName(row.storeId) },
      {
        key: 'quantity',
        label: 'On hand',
        align: 'right',
        render: (row) => (
          <span className={Number(row.quantity) <= Number(row.reorderLevel) ? 'status status--warning' : undefined}>
            {row.quantity} {row.unit}
          </span>
        ),
      },
      { key: 'price', label: 'Price', align: 'right', render: (row) => formatCurrency(row.price) },
      { key: 'cost', label: 'Cost', align: 'right', render: (row) => formatCurrency(row.cost) },
    ],
    [storeName]
  );

  const fields = useMemo(
    () => [
      { name: 'name', label: 'Item name', required: true, placeholder: 'Cordless Drill 18V' },
      { name: 'sku', label: 'SKU', required: true, placeholder: 'SKU-1001' },
      { name: 'category', label: 'Category', placeholder: 'Power Tools' },
      { name: 'unit', label: 'Unit', placeholder: 'unit / box / roll…' },
      {
        name: 'storeId',
        label: 'Store',
        type: 'select',
        options: stores.map((s) => ({ value: s.id, label: s.name })),
      },
      { name: 'price', label: 'Sell price', type: 'number', step: '0.01', min: 0, default: 0 },
      { name: 'cost', label: 'Unit cost', type: 'number', step: '0.01', min: 0, default: 0 },
      { name: 'quantity', label: 'Quantity on hand', type: 'number', min: 0, default: 0 },
      { name: 'reorderLevel', label: 'Reorder level', type: 'number', min: 0, default: 0 },
      { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    ],
    [stores]
  );

  const filters = useMemo(
    () => [
      { name: 'category', label: 'All categories', options: categories },
      { name: 'lowStock', label: 'All stock levels', options: [{ value: 'true', label: 'Low stock only' }] },
    ],
    [categories]
  );

  return (
    <EntityManager
      title="Items"
      subtitle="Products and materials tracked across your stores."
      api={api.items}
      columns={columns}
      fields={fields}
      filters={filters}
      searchPlaceholder="Search items…"
      emptyTitle="No items yet"
      emptyMessage="Add an item to start building sales and purchase orders."
    />
  );
}
