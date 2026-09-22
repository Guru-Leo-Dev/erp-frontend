import { formatCurrency } from '../../utils/format';
import { IconPlus, IconTrash } from './icons';

// `priceField` picks which item attribute (sell price vs. cost) is used to
// pre-fill a line's unit price when an item is selected.
export default function LineItemsEditor({ items, lines, onChange, priceField = 'price' }) {
  function updateLine(index, patch) {
    const next = lines.map((line, i) => (i === index ? { ...line, ...patch } : line));
    onChange(next);
  }

  function addLine() {
    onChange([...lines, { itemId: '', quantity: 1, unitPrice: 0 }]);
  }

  function removeLine(index) {
    onChange(lines.filter((_, i) => i !== index));
  }

  function handleItemSelect(index, itemId) {
    const item = items.find((i) => i.id === itemId);
    updateLine(index, {
      itemId,
      unitPrice: item ? Number(item[priceField]) : 0,
    });
  }

  const total = lines.reduce((sum, l) => sum + Number(l.quantity || 0) * Number(l.unitPrice || 0), 0);

  return (
    <div>
      <table className="lineitem-table">
        <thead>
          <tr>
            <th style={{ width: '42%' }}>Item</th>
            <th style={{ width: '18%' }}>Qty</th>
            <th style={{ width: '22%' }}>Unit price</th>
            <th style={{ width: '14%' }}>Total</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {lines.map((line, index) => (
            <tr key={index}>
              <td>
                <select value={line.itemId} onChange={(e) => handleItemSelect(index, e.target.value)} required>
                  <option value="">Select item…</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.sku})
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="number"
                  min="1"
                  value={line.quantity}
                  onChange={(e) => updateLine(index, { quantity: e.target.value })}
                  required
                />
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={line.unitPrice}
                  onChange={(e) => updateLine(index, { unitPrice: e.target.value })}
                  required
                />
              </td>
              <td className="lineitem-total">
                {formatCurrency(Number(line.quantity || 0) * Number(line.unitPrice || 0))}
              </td>
              <td>
                <button
                  type="button"
                  className="lineitem-remove"
                  onClick={() => removeLine(index)}
                  aria-label="Remove line"
                  disabled={lines.length === 1}
                >
                  <IconTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" className="btn btn-outline btn-sm" onClick={addLine}>
        <IconPlus /> Add line
      </button>
      <div className="order-totals">
        <div className="row total">
          <span>Line items subtotal</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
