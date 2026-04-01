interface MetricCellProps {
  label: string;
  labelJa: string;
  value: string | number;
  unit?: string;
  accent?: 'default' | 'success' | 'danger' | 'warn';
}

const accentColors = {
  default: 'var(--eva-border, #f80)',
  success: 'var(--eva-hex-active, #0f0)',
  danger: 'var(--eva-crimson, #f00)',
  warn: '#ff0',
} as const;

export function MetricCell({ label, labelJa, value, unit, accent = 'default' }: MetricCellProps) {
  return (
    <div className="metric-cell">
      <div className="metric-cell__label">{label}</div>
      <div className="metric-cell__label-ja">{labelJa}</div>
      <div className="metric-cell__value" style={{ color: accentColors[accent] }}>
        {value}
        {unit && <span className="metric-cell__unit">{unit}</span>}
      </div>
    </div>
  );
}
