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
  { name: 'name', label: 'Contact name', required: true, placeholder: 'Grace Kim' },
  { name: 'company', label: 'Company', placeholder: 'Apex Components Ltd.' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'grace@apex.com' },
  { name: 'phone', label: 'Phone', type: 'tel', placeholder: '555-020-0000' },
  { name: 'address', label: 'Street address', fullWidth: true },
  { name: 'city', label: 'City' },
  { name: 'state', label: 'State / Province' },
  { name: 'zip', label: 'ZIP / Postal code' },
  { name: 'country', label: 'Country' },
];

export default function Vendors() {
  return (
    <EntityManager
      title="Vendors"
      subtitle="Everyone you buy from."
      api={api.vendors}
      columns={columns}
      fields={fields}
      searchPlaceholder="Search vendors…"
      emptyTitle="No vendors yet"
      emptyMessage="Add a vendor to start logging purchase orders against them."
    />
  );
}
