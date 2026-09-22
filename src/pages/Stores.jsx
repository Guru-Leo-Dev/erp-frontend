import { api } from '../api/client';
import EntityManager from '../components/common/EntityManager';

const columns = [
  {
    key: 'name',
    label: 'Store',
    render: (row) => (
      <div>
        <div className="cell-primary">{row.name}</div>
        <div className="sub">{row.code}</div>
      </div>
    ),
  },
  {
    key: 'city',
    label: 'Location',
    render: (row) => [row.address, row.city].filter(Boolean).join(', ') || '—',
  },
  { key: 'manager', label: 'Manager' },
  { key: 'phone', label: 'Phone' },
  {
    key: 'isActive',
    label: 'Status',
    render: (row) => (
      <span className={`status status--${row.isActive ? 'success' : 'neutral'}`}>
        {row.isActive ? 'Active' : 'Inactive'}
      </span>
    ),
  },
];

const fields = [
  { name: 'name', label: 'Store name', required: true, placeholder: 'Main Warehouse' },
  { name: 'code', label: 'Code', required: true, placeholder: 'WH-01' },
  { name: 'manager', label: 'Manager' },
  { name: 'phone', label: 'Phone', type: 'tel' },
  { name: 'address', label: 'Street address', fullWidth: true },
  { name: 'city', label: 'City', fullWidth: true },
  { name: 'isActive', label: 'Store is active', type: 'checkbox', default: true, fullWidth: true },
];

export default function Stores() {
  return (
    <EntityManager
      title="Stores"
      subtitle="Warehouses and retail locations that hold inventory."
      api={api.stores}
      columns={columns}
      fields={fields}
      searchPlaceholder="Search stores…"
      emptyTitle="No stores yet"
      emptyMessage="Add a warehouse or retail location to start assigning stock to it."
    />
  );
}
