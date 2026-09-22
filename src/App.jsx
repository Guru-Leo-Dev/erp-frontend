import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Vendors from './pages/Vendors';
import Items from './pages/Items';
import Stores from './pages/Stores';
import SalesOrders from './pages/SalesOrders';
import PurchaseOrders from './pages/PurchaseOrders';
import Shipments from './pages/Shipments';
import Invoices from './pages/Invoices';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/items" element={<Items />} />
            <Route path="/stores" element={<Stores />} />
            <Route path="/sales-orders" element={<SalesOrders />} />
            <Route path="/purchase-orders" element={<PurchaseOrders />} />
            <Route path="/shipments" element={<Shipments />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
