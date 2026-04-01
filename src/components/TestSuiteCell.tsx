import type { TestSuite } from '../data/mockData';

interface TestSuiteCellProps {
  suite: TestSuite;
  onClick: (suite: TestSuite) => void;
}

const trendIcon = { up: '▲', down: '▼', stable: '●' } as const;
const trendColor = { up: 'var(--eva-hex-active, #0f0)', down: 'var(--eva-crimson, #f00)', stable: 'var(--eva-border, #666)' } as const;

export function TestSuiteCell({ suite, onClick }: TestSuiteCellProps) {
  const passRate = ((suite.passed / suite.total) * 100).toFixed(1);
  const barWidth = `${(suite.passed / suite.total) * 100}%`;
  const failWidth = `${(suite.failed / suite.total) * 100}%`;

  return (
    <div className="suite-cell" onClick={() => onClick(suite)}>
      <div className="suite-cell__header">
        <span className="suite-cell__name">{suite.name}</span>
        <span className="suite-cell__name-ja">{suite.nameJa}</span>
      </div>
      <div className="suite-cell__stats">
        <span className="suite-cell__ratio">{suite.passed}/{suite.total}</span>
        <span className="suite-cell__label">PASS</span>
      </div>
      <div className="suite-cell__bar">
        <div className="suite-cell__bar-pass" style={{ width: barWidth }} />
        <div className="suite-cell__bar-fail" style={{ width: failWidth }} />
      </div>
      <div className="suite-cell__footer">
        <span className="suite-cell__rate">{passRate}%</span>
        <span className="suite-cell__trend" style={{ color: trendColor[suite.trend] }}>
          {trendIcon[suite.trend]} {suite.trend.toUpperCase()}
        </span>
        <span className="suite-cell__duration">{suite.duration}</span>
      </div>
    </div>
  );
}
