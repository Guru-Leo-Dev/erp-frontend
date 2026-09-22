import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../api/client';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import StatusBadge from '../components/common/StatusBadge';
import { IconPlus, IconSearch, IconEdit, IconTrash } from '../components/common/icons';
import { formatCurrency, formatDate } from '../utils/format';

function emptyForm() {
  return {
    salesOrderId: '',
    customerId: '',
    invoiceDate: new Date().toISOString().slice(0, 10),
    dueDate: '',
    subtotal: 0,
    tax: 0,
    total: 0,
    amountPaid: 0,
    notes: '',
  };
}

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [salesOrders, setSalesOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [modalMode, setModalMode] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const isFirstRun = useRef(true);

  useEffect(() => {
    api.salesOrders.list().then(setSalesOrders).catch(() => setSalesOrders([]));
    api.customers.list().then(setCustomers).catch(() => setCustomers([]));
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    api.invoices
      .list({ search, status: statusFilter })
      .then(setInvoices)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter]);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      load();
      return;
    }
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter]);

  const customerName = useMemo(() => {
    const map = new Map(customers.map((c) => [c.id, c.company || c.name]));
    return (id) => map.get(id) || 'Unknown customer';
  }, [customers]);

  const orderNumber = useMemo(() => {
    const map = new Map(salesOrders.map((o) => [o.id, o.orderNumber]));
    return (id) => map.get(id) || '—';
  }, [salesOrders]);

  function openCreate() {
    setFormData(emptyForm());
    setEditingId(null);
    setFormError('');
    setModalMode('create');
  }

  function openEdit(inv) {
    setFormData({
      salesOrderId: inv.salesOrderId || '',
      customerId: inv.customerId,
      invoiceDate: inv.invoiceDate,
      dueDate: inv.dueDate || '',
      subtotal: inv.subtotal,
      tax: inv.tax,
      total: inv.total,
      amountPaid: inv.amountPaid,
      notes: inv.notes || '',
    });
    setEditingId(inv.id);
    setFormError('');
    setModalMode('edit');
  }

  function handleOrderSelect(orderId) {
    const order = salesOrders.find((o) => o.id === orderId);
    setFormData((p) => ({
      ...p,
      salesOrderId: orderId,
      customerId: order ? order.customerId : p.customerId,
      subtotal: order ? order.subtotal : p.subtotal,
      tax: order ? order.tax : p.tax,
      total: order ? order.total : p.total,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.customerId) {
      setFormError('Select a sales order (or customer) to bill.');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      const payload = {
        salesOrderId: formData.salesOrderId || null,
        customerId: formData.customerId,
        invoiceDate: formData.invoiceDate,
        dueDate: formData.dueDate,
        subtotal: Number(formData.subtotal),
        tax: Number(formData.tax),
        total: Number(formData.total),
        amountPaid: Number(formData.amountPaid),
        notes: formData.notes,
      };
      if (editingId) await api.invoices.update(editingId, payload);
      else await api.invoices.create(payload);
      setModalMode(null);
      load();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await api.invoices.remove(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } catch (err) {
      setError(err.message);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Invoices</h1>
          <p>Bill customers and record payments as they come in.</p>
        </div>
        <div className="page-actions">
          <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            {['Unpaid', 'Partial', 'Paid', 'Overdue'].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <div className="search-input-wrap">
            <IconSearch />
            <input
              type="search"
              placeholder="Search invoice #…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="button" className="btn btn-primary" onClick={openCreate}>
            <IconPlus /> New Invoice
          </button>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="table-wrap">
          {[...Array(5)].map((_, i) => (
            <div className="skeleton-row" key={i} />
          ))}
        </div>
      ) : invoices.length === 0 ? (
        <EmptyState
          title="No invoices yet"
          message="Bill a customer for a sales order to start tracking payments."
          action={
            <button type="button" className="btn btn-primary" onClick={openCreate}>
              <IconPlus /> New Invoice
            </button>
          }
        />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Customer</th>
                <th>Order</th>
                <th>Due date</th>
                <th>Status</th>
                <th className="num">Total</th>
                <th className="num">Balance</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="cell-primary">{inv.invoiceNumber}</td>
                  <td>{customerName(inv.customerId)}</td>
                  <td className="cell-muted">{orderNumber(inv.salesOrderId)}</td>
                  <td className="cell-muted">{formatDate(inv.dueDate)}</td>
                  <td>
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="num">{formatCurrency(inv.total)}</td>
                  <td className="num">{formatCurrency(Number(inv.total) - Number(inv.amountPaid))}</td>
                  <td>
                    <div className="row-actions">
                      <button type="button" className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(inv)} aria-label="Edit">
                        <IconEdit />
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-icon btn-sm"
                        onClick={() => setDeleteTarget(inv)}
                        aria-label="Delete"
                      >
                        <IconTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalMode && (
        <Modal
          title={modalMode === 'create' ? 'New Invoice' : 'Edit Invoice'}
          onClose={() => setModalMode(null)}
          footer={
            <>
              <button type="button" className="btn btn-outline" onClick={() => setModalMode(null)} disabled={saving}>
                Cancel
              </button>
              <button type="submit" form="invoice-form" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save invoice'}
              </button>
            </>
          }
        >
          <form id="invoice-form" onSubmit={handleSubmit}>
            {formError && <div className="error-banner">{formError}</div>}
            <div className="form-grid">
              <div className="field" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="inv-order">Sales order</label>
                <select id="inv-order" value={formData.salesOrderId} onChange={(e) => handleOrderSelect(e.target.value)}>
                  <option value="">No linked order</option>
                  {salesOrders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.orderNumber} — {customerName(o.customerId)}
                    </option>
                  ))}
                </select>
                <span className="hint">Selecting an order fills in the customer and amounts below.</span>
              </div>
              <div className="field">
                <label htmlFor="inv-customer">Customer *</label>
                <select
                  id="inv-customer"
                  value={formData.customerId}
                  required
                  onChange={(e) => setFormData((p) => ({ ...p, customerId: e.target.value }))}
                >
                  <option value="">Select customer…</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.company || c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div />
              <div className="field">
                <label htmlFor="inv-date">Invoice date</label>
                <input
                  id="inv-date"
                  type="date"
                  value={formData.invoiceDate}
                  onChange={(e) => setFormData((p) => ({ ...p, invoiceDate: e.target.value }))}
                />
              </div>
              <div className="field">
                <label htmlFor="inv-due">Due date</label>
                <input
                  id="inv-due"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData((p) => ({ ...p, dueDate: e.target.value }))}
                />
              </div>
              <div className="field">
                <label htmlFor="inv-subtotal">Subtotal</label>
                <input
                  id="inv-subtotal"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.subtotal}
                  onChange={(e) => setFormData((p) => ({ ...p, subtotal: e.target.value }))}
                />
              </div>
              <div className="field">
                <label htmlFor="inv-tax">Tax</label>
                <input
                  id="inv-tax"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.tax}
                  onChange={(e) => setFormData((p) => ({ ...p, tax: e.target.value }))}
                />
              </div>
              <div className="field">
                <label htmlFor="inv-total">Total</label>
                <input
                  id="inv-total"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.total}
                  onChange={(e) => setFormData((p) => ({ ...p, total: e.target.value }))}
                />
              </div>
              <div className="field">
                <label htmlFor="inv-paid">Amount paid</label>
                <input
                  id="inv-paid"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amountPaid}
                  onChange={(e) => setFormData((p) => ({ ...p, amountPaid: e.target.value }))}
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="inv-notes">Notes</label>
              <textarea
                id="inv-notes"
                value={formData.notes}
                onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
              />
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete invoice?"
          message={`This will permanently remove ${deleteTarget.invoiceNumber}. This can't be undone.`}
          busy={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
