import { useCallback, useEffect, useRef, useState } from 'react';
import Modal from './Modal';
import ConfirmDialog from './ConfirmDialog';
import EmptyState from './EmptyState';
import { IconPlus, IconSearch, IconEdit, IconTrash } from './icons';

function initialFormState(fields) {
  const state = {};
  fields.forEach((f) => {
    state[f.name] = f.type === 'checkbox' ? f.default ?? false : f.default ?? '';
  });
  return state;
}

// Generic CRUD screen: search + table + create/edit drawer + delete confirm.
// Used for Customers, Vendors, Stores and Items — modules whose only real
// complexity is "a list of fields", not multi-entity business logic.
export default function EntityManager({
  title,
  subtitle,
  singularLabel,
  api,
  columns,
  fields,
  searchPlaceholder = 'Search…',
  newLabel,
  emptyTitle = 'No records yet',
  emptyMessage = 'Get started by adding your first record.',
  filters = [],
  onDataChange,
}) {
  const singular = singularLabel || title.replace(/s$/, '');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [modalMode, setModalMode] = useState(null); // null | 'create' | 'edit'
  const [formData, setFormData] = useState(() => initialFormState(fields));
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const isFirstRun = useRef(true);

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    api
      .list({ search, ...filterValues })
      .then((data) => {
        setItems(data);
        onDataChange?.(data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, JSON.stringify(filterValues)]);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      load();
      return;
    }
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, JSON.stringify(filterValues)]);

  function openCreate() {
    setFormData(initialFormState(fields));
    setEditingId(null);
    setFormError('');
    setModalMode('create');
  }

  function openEdit(row) {
    const state = initialFormState(fields);
    fields.forEach((f) => {
      state[f.name] = row[f.name] ?? state[f.name];
    });
    setFormData(state);
    setEditingId(row.id);
    setFormError('');
    setModalMode('edit');
  }

  function handleChange(name, value) {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      const payload = { ...formData };
      fields.forEach((f) => {
        if (f.type === 'number') {
          payload[f.name] = payload[f.name] === '' ? 0 : Number(payload[f.name]);
        }
      });
      if (editingId) await api.update(editingId, payload);
      else await api.create(payload);
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
      await api.remove(deleteTarget.id);
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
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <div className="page-actions">
          {filters.map((f) => (
            <select
              key={f.name}
              className="filter-select"
              value={filterValues[f.name] || ''}
              onChange={(e) => setFilterValues((prev) => ({ ...prev, [f.name]: e.target.value }))}
            >
              <option value="">{f.label}</option>
              {f.options.map((opt) => (
                <option key={opt.value ?? opt} value={opt.value ?? opt}>
                  {opt.label ?? opt}
                </option>
              ))}
            </select>
          ))}
          <div className="search-input-wrap">
            <IconSearch />
            <input
              type="search"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="button" className="btn btn-primary" onClick={openCreate}>
            <IconPlus /> {newLabel || `New ${singular}`}
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
      ) : items.length === 0 ? (
        <EmptyState
          title={emptyTitle}
          message={emptyMessage}
          action={
            <button type="button" className="btn btn-primary" onClick={openCreate}>
              <IconPlus /> {newLabel || `New ${singular}`}
            </button>
          }
        />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c.key} className={c.align === 'right' ? 'num' : undefined}>
                    {c.label}
                  </th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.id}>
                  {columns.map((c) => (
                    <td key={c.key} className={c.align === 'right' ? 'num' : undefined}>
                      {c.render ? c.render(row) : row[c.key]}
                    </td>
                  ))}
                  <td>
                    <div className="row-actions">
                      <button
                        type="button"
                        className="btn btn-ghost btn-icon btn-sm"
                        onClick={() => openEdit(row)}
                        aria-label={`Edit ${row.name || row.title || singular}`}
                      >
                        <IconEdit />
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-icon btn-sm"
                        onClick={() => setDeleteTarget(row)}
                        aria-label={`Delete ${row.name || row.title || singular}`}
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
          title={modalMode === 'create' ? newLabel || `New ${singular}` : `Edit ${singular}`}
          onClose={() => setModalMode(null)}
          footer={
            <>
              <button type="button" className="btn btn-outline" onClick={() => setModalMode(null)} disabled={saving}>
                Cancel
              </button>
              <button type="submit" form="entity-form" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </>
          }
        >
          <form id="entity-form" onSubmit={handleSubmit}>
            {formError && <div className="error-banner">{formError}</div>}
            <div className="form-grid">
              {fields.map((f) => (
                <div
                  className={`field${f.type === 'checkbox' ? ' checkbox-field' : ''}`}
                  key={f.name}
                  style={f.fullWidth ? { gridColumn: '1 / -1' } : undefined}
                >
                  {f.type === 'checkbox' ? (
                    <>
                      <input
                        type="checkbox"
                        id={f.name}
                        checked={!!formData[f.name]}
                        onChange={(e) => handleChange(f.name, e.target.checked)}
                      />
                      <label htmlFor={f.name}>{f.label}</label>
                    </>
                  ) : (
                    <>
                      <label htmlFor={f.name}>
                        {f.label}
                        {f.required ? ' *' : ''}
                      </label>
                      {f.type === 'textarea' ? (
                        <textarea
                          id={f.name}
                          value={formData[f.name]}
                          required={f.required}
                          placeholder={f.placeholder}
                          onChange={(e) => handleChange(f.name, e.target.value)}
                        />
                      ) : f.type === 'select' ? (
                        <select
                          id={f.name}
                          value={formData[f.name]}
                          required={f.required}
                          onChange={(e) => handleChange(f.name, e.target.value)}
                        >
                          <option value="">Select…</option>
                          {f.options.map((opt) => (
                            <option key={opt.value ?? opt} value={opt.value ?? opt}>
                              {opt.label ?? opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          id={f.name}
                          type={f.type || 'text'}
                          step={f.step}
                          min={f.min}
                          value={formData[f.name]}
                          required={f.required}
                          placeholder={f.placeholder}
                          onChange={(e) => handleChange(f.name, e.target.value)}
                        />
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title={`Delete ${singular}?`}
          message="This can't be undone. This will permanently remove this record."
          busy={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
