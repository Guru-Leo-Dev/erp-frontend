import { api } from '../api/client';
import EntityManager from '../components/common/EntityManager';
import { initials } from '../utils/format';

const columns = [
  {
    key: 'name',
    label: 'Contact',
    render: (row) => (
      <div className="name-cell">
        <span className="chip">{initials(row.name)}</span>
        <div>
          <div className="cell-primary">{row.name}</div>
          <div className="sub">{row.company}</div>
        </div>
      </div>
    ),
  },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  {
    key: 'city',
    label: 'Location',
    render: (row) => [row.city, row.state].filter(Boolean).join(', ') || '—',
  },
];

const fields = [
  { name: 'name', label: 'Contact name', required: true, placeholder: 'Jane Doe' },
  { name: 'company', label: 'Company', placeholder: 'Acme Inc.' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'jane@acme.com' },
  { name: 'phone', label: 'Phone', type: 'tel', placeholder: '555-010-0000' },
  { name: 'address', label: 'Street address', fullWidth: true },
  { name: 'city', label: 'City' },
  { name: 'state', label: 'State / Province' },
  { name: 'zip', label: 'ZIP / Postal code' },
  { name: 'country', label: 'Country' },
];

export default function Customers() {
  return (
    <EntityManager
      title="Customers"
      subtitle="Everyone you sell to."
      api={api.customers}
      columns={columns}
      fields={fields}
      searchPlaceholder="Search customers…"
      emptyTitle="No customers yet"
      emptyMessage="Add a customer to start creating sales orders and invoices for them."
    />
  );
}
