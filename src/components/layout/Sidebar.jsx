import { NavLink } from 'react-router-dom';
import {
  IconDashboard,
  IconCustomers,
  IconVendors,
  IconItems,
  IconStores,
  IconSales,
  IconPurchase,
  IconShipping,
  IconInvoice,
  IconClose,
} from '../common/icons';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: IconDashboard, end: true },
  { to: '/customers', label: 'Customers', icon: IconCustomers, group: 'Contacts' },
  { to: '/vendors', label: 'Vendors', icon: IconVendors, group: 'Contacts' },
  { to: '/sales-orders', label: 'Sales Orders', icon: IconSales, group: 'Operations' },
  { to: '/purchase-orders', label: 'Purchase Orders', icon: IconPurchase, group: 'Operations' },
  { to: '/shipments', label: 'Shipping', icon: IconShipping, group: 'Operations' },
  { to: '/invoices', label: 'Invoices', icon: IconInvoice, group: 'Operations' },
  { to: '/items', label: 'Items', icon: IconItems, group: 'Inventory' },
  { to: '/stores', label: 'Stores', icon: IconStores, group: 'Inventory' },
];

export default function Sidebar({ open, onClose }) {
  let lastGroup = null;

  return (
    <>
      {open && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className="sidebar" data-open={open}>
        <div className="sidebar-brand">
          <div>
            <div className="wordmark">Ledgerline</div>
            <div className="tagline">Business operations suite</div>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-icon sidebar-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            <IconClose />
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {NAV_ITEMS.map((item) => {
              const showGroupLabel = item.group && item.group !== lastGroup;
              lastGroup = item.group || lastGroup;
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  {showGroupLabel && <div className="nav-group-label">{item.group}</div>}
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                    onClick={onClose}
                  >
                    <Icon />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">Ledgerline ERP · v1.0</div>
      </aside>
    </>
  );
}
