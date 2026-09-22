import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../api/client';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import StatusBadge from '../components/common/StatusBadge';
import LineItemsEditor from '../components/common/LineItemsEditor';
import { IconPlus, IconSearch, IconEdit, IconTrash } from '../components/common/icons';
import { formatCurrency, formatDate } from '../utils/format';

const STATUSES = ['Draft', 'Ordered', 'Received', 'Cancelled'];

function emptyForm() {
  return {
    vendorId: '',
    orderDate: new Date().toISOString().slice(0, 10),
    status: 'Draft',
    taxRate: 5,
    notes: '',
    lines: [{ itemId: '', quantity: 1, unitPrice: 0 }],
  };
}

export default function PurchaseOrders() {
  const [orders, setOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [items, setItems] = useState([]);
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
    api.vendors.list().then(setVendors).catch(() => setVendors([]));
    api.items.list().then(setItems).catch(() => setItems([]));
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    api.purchaseOrders
      .list({ search, status: statusFilter })
      .then(setOrders)
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

  const vendorName = useMemo(() => {
    const map = new Map(vendors.map((v) => [v.id, v.company || v.name]));
    return (id) => map.get(id) || 'Unknown vendor';
  }, [vendors]);

  function openCreate() {
    setFormData(emptyForm());
    setEditingId(null);
    setFormError('');
    setModalMode('create');
  }

  function openEdit(order) {
    setFormData({
      vendorId: order.vendorId,
      orderDate: order.orderDate,
      status: order.status,
      taxRate: order.taxRate ?? 0,
      notes: order.notes || '',
      lines: order.items.map((li) => ({ itemId: li.itemId, quantity: li.quantity, unitPrice: li.unitPrice })),
    });
    setEditingId(order.id);
    setFormError('');
    setModalMode('edit');
  }

  const { subtotal, tax, total } = useMemo(() => {
    const st = formData.lines.reduce((sum, l) => sum + Number(l.quantity || 0) * Number(l.unitPrice || 0), 0);
    const t = st * (Number(formData.taxRate || 0) / 100);
    return { subtotal: st, tax: t, total: st + t };
  }, [formData.lines, formData.taxRate]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.vendorId) {
      setFormError('Please choose a vendor.');
      return;
    }
    if (!formData.lines.length || formData.lines.some((l) => !l.itemId)) {
      setFormError('Every line needs an item selected.');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      const payload = {
        vendorId: formData.vendorId,
        orderDate: formData.orderDate,
        status: formData.status,
        taxRate: Number(formData.taxRate),
        notes: formData.notes,
        items: formData.lines.map((l) => ({
          itemId: l.itemId,
          quantity: Number(l.quantity),
          unitPrice: Number(l.unitPrice),
        })),
      };
      if (editingId) await api.purchaseOrders.update(editingId, payload);
      else await api.purchaseOrders.create(payload);
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
      await api.purchaseOrders.remove(deleteTarget.id);
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
          <h1>Purchase Orders</h1>
          <p>Orders placed with your vendors. Marking one “Received” restocks its items.</p>
        </div>
        <div className="page-actions">
          <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <div className="search-input-wrap">
            <IconSearch />
            <input
              type="search"
              placeholder="Search order #…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="button" className="btn btn-primary" onClick={openCreate}>
            <IconPlus /> New Purchase Order
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
      ) : orders.length === 0 ? (
        <EmptyState
          title="No purchase orders yet"
          message="Create a purchase order to start restocking items from your vendors."
          action={
            <button type="button" className="btn btn-primary" onClick={openCreate}>
              <IconPlus /> New Purchase Order
            </button>
          }
        />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Vendor</th>
                <th>Date</th>
                <th>Status</th>
                <th className="num">Total</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="cell-primary">{o.orderNumber}</td>
                  <td>{vendorName(o.vendorId)}</td>
                  <td className="cell-muted">{formatDate(o.orderDate)}</td>
                  <td>
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="num">{formatCurrency(o.total)}</td>
                  <td>
                    <div className="row-actions">
                      <button type="button" className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(o)} aria-label="Edit">
                        <IconEdit />
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-icon btn-sm"
                        onClick={() => setDeleteTarget(o)}
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
          title={modalMode === 'create' ? 'New Purchase Order' : 'Edit Purchase Order'}
          onClose={() => setModalMode(null)}
          footer={
            <>
              <button type="button" className="btn btn-outline" onClick={() => setModalMode(null)} disabled={saving}>
                Cancel
              </button>
              <button type="submit" form="purchase-order-form" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save order'}
              </button>
            </>
          }
        >
          <form id="purchase-order-form" onSubmit={handleSubmit}>
            {formError && <div className="error-banner">{formError}</div>}
            <div className="form-grid">
              <div className="field">
                <label htmlFor="po-vendor">Vendor *</label>
                <select
                  id="po-vendor"
                  value={formData.vendorId}
                  required
                  onChange={(e) => setFormData((p) => ({ ...p, vendorId: e.target.value }))}
                >
                  <option value="">Select vendor…</option>
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.company || v.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="po-date">Order date</label>
                <input
                  id="po-date"
                  type="date"
                  value={formData.orderDate}
                  onChange={(e) => setFormData((p) => ({ ...p, orderDate: e.target.value }))}
                />
              </div>
              <div className="field">
                <label htmlFor="po-status">Status</label>
                <select
                  id="po-status"
                  value={formData.status}
                  onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="po-tax">Tax rate (%)</label>
                <input
                  id="po-tax"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.taxRate}
                  onChange={(e) => setFormData((p) => ({ ...p, taxRate: e.target.value }))}
                />
              </div>
            </div>

            <div className="field">
              <label>Line items</label>
              <LineItemsEditor
                items={items}
                lines={formData.lines}
                priceField="cost"
                onChange={(lines) => setFormData((p) => ({ ...p, lines }))}
              />
            </div>

            <div className="order-totals">
              <div className="row">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="row">
                <span>Tax</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="row total">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="field" style={{ marginTop: 14 }}>
              <label htmlFor="po-notes">Notes</label>
              <textarea
                id="po-notes"
                value={formData.notes}
                onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
              />
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete purchase order?"
          message={`This will permanently remove ${deleteTarget.orderNumber}. This can't be undone.`}
          busy={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
