import type { TestSuite } from '../data/mockData';

interface TestSuiteCellProps {
  suite: TestSuite;
  onClick: (suite: TestSuite) => void;
}

const trendIcon = { up: '▲', down: '▼', stable: '―' } as const;
const trendColor = {
  up: 'var(--eva-hex-active, #0f0)',
  down: 'var(--eva-crimson, #f00)',
  stable: 'var(--eva-border, #666)',
} as const;

export function TestSuiteCell({ suite, onClick }: TestSuiteCellProps) {
  const passRate = ((suite.passed / suite.total) * 100).toFixed(1);

  return (
    <div className="suite-cell" onClick={() => onClick(suite)}>
      <div className="suite-cell__name">{suite.name}</div>
      <div className="suite-cell__rate">
        {passRate}
        <span className="suite-cell__unit">%</span>
        <span className="suite-cell__trend" style={{ color: trendColor[suite.trend] }}>
          {trendIcon[suite.trend]}
        </span>
      </div>
    </div>
  );
}
