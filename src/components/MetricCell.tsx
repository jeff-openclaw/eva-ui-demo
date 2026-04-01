import { useEffect, useState } from 'react';

interface MetricCellProps {
  label: string;
  labelJa: string;
  value: string | number;
  unit?: string;
  accent?: 'default' | 'success' | 'danger' | 'warn';
  progress?: number; // 0-100
}

const accentColors = {
  default: 'var(--eva-border, #f80)',
  success: 'var(--eva-hex-active, #0f0)',
  danger: 'var(--eva-crimson, #f00)',
  warn: '#ff0',
} as const;

export function MetricCell({ label, labelJa, value, unit, accent = 'default', progress }: MetricCellProps) {
  const isNumeric = typeof value === 'number';
  const [displayed, setDisplayed] = useState(isNumeric ? 0 : value);

  // Tick-up animation for numeric values
  useEffect(() => {
    if (!isNumeric) return;
    const target = value as number;
    const duration = 1200;
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      // ease-out
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
      <div className="metric-cell__label-ja">{labelJa}</div>
      <div className="metric-cell__value" style={{ color: accentColors[accent] }}>
        {displayed}
        {unit && <span className="metric-cell__unit">{unit}</span>}
      </div>
      {progress !== undefined && (
        <div className="metric-cell__progress">
          <div
            className="metric-cell__progress-fill"
            style={{
              width: `${Math.min(progress, 100)}%`,
              background: accentColors[accent],
            }}
          />
        </div>
      )}
    </div>
  );
}
