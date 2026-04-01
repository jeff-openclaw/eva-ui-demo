import type { TestResult } from '../data/mockData';

interface ResultCellProps {
  result: TestResult;
  onClick: (result: TestResult) => void;
}

const statusIcon = { pass: '●', fail: '✕', skip: '○' } as const;
const statusColor = {
  pass: 'var(--eva-hex-active, #0f0)',
  fail: 'var(--eva-crimson, #f00)',
  skip: 'var(--eva-border, #666)',
} as const;

export function ResultCell({ result, onClick }: ResultCellProps) {
  return (
    <div className="result-cell" onClick={() => onClick(result)}>
      <div className="result-cell__icon" style={{ color: statusColor[result.status] }}>
        {statusIcon[result.status]}
      </div>
      <div className="result-cell__name">{result.name}</div>
      <div className="result-cell__meta">
        <span>{result.suite}</span>
        <span>{result.duration}</span>
      </div>
    </div>
  );
}
