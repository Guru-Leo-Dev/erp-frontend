const TONE_MAP = {
  // sales / purchase order statuses
  Draft: 'neutral',
  Confirmed: 'info',
  Ordered: 'info',
  Shipped: 'info',
  Received: 'success',
  Completed: 'success',
  Delivered: 'success',
  'In Transit': 'info',
  Pending: 'warning',
  Cancelled: 'danger',
  // invoice statuses
  Paid: 'success',
  Partial: 'warning',
  Unpaid: 'neutral',
  Overdue: 'danger',
};

export default function StatusBadge({ status }) {
  const tone = TONE_MAP[status] || 'neutral';
  return <span className={`status status--${tone}`}>{status}</span>;
}
