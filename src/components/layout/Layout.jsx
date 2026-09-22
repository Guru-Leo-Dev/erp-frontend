import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const TITLES = [
  { prefix: '/customers', title: 'Customers' },
  { prefix: '/vendors', title: 'Vendors' },
  { prefix: '/sales-orders', title: 'Sales Orders' },
  { prefix: '/purchase-orders', title: 'Purchase Orders' },
  { prefix: '/shipments', title: 'Shipping' },
  { prefix: '/invoices', title: 'Invoices' },
  { prefix: '/items', title: 'Items' },
  { prefix: '/stores', title: 'Stores' },
];

function getTitle(pathname) {
  if (pathname === '/') return 'Dashboard';
  const match = TITLES.find((t) => pathname.startsWith(t.prefix));
  return match ? match.title : 'Ledgerline';
}

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="app-main">
        <Topbar title={getTitle(location.pathname)} onMenuClick={() => setMenuOpen(true)} />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
