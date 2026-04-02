import { useEffect, useState } from 'react';

interface MetricCellProps {
  label: string;
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

export function MetricCell({ label, value, unit, accent = 'default' }: MetricCellProps) {
  const isNumeric = typeof value === 'number';
  const [displayed, setDisplayed] = useState(isNumeric ? 0 : value);

  useEffect(() => {
    if (!isNumeric) return;
    const target = value as number;
    const duration = 1200;
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = target % 1 !== 0
        ? parseFloat((eased * target).toFixed(1))
        : Math.round(eased * target);
      setDisplayed(current);
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, isNumeric]);

  return (
    <div className="metric-cell">
      <div className="metric-cell__label">{label}</div>
      <div className="metric-cell__value" style={{ color: accentColors[accent] }}>
        {displayed}
        {unit && <span className="metric-cell__unit">{unit}</span>}
      </div>
    </div>
  );
}
