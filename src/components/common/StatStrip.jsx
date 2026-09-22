export default function StatStrip({ stats }) {
  return (
    <div className="stat-strip">
      {stats.map((s) => (
        <div className={`stat-tile${s.tone ? ` ${s.tone}` : ''}`} key={s.label}>
          <div className="stat-value">{s.value}</div>
          <div className="stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
