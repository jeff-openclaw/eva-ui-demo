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

const dotColor = {
  pass: 'var(--eva-hex-active, #0f0)',
  fail: 'var(--eva-crimson, #f00)',
  mixed: '#ff0',
} as const;

export function TestSuiteCell({ suite, onClick }: TestSuiteCellProps) {
  const passRate = ((suite.passed / suite.total) * 100).toFixed(1);
  const passW = (suite.passed / suite.total) * 100;
  const failW = (suite.failed / suite.total) * 100;
  const skipW = (suite.skipped / suite.total) * 100;

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

      {/* Stacked bar: pass / fail / skip */}
      <div className="suite-cell__bar">
        <div className="suite-cell__bar-pass" style={{ width: `${passW}%` }} />
        <div className="suite-cell__bar-fail" style={{ width: `${failW}%` }} />
        <div className="suite-cell__bar-skip" style={{ width: `${skipW}%` }} />
      </div>

      <div className="suite-cell__footer">
        <span className="suite-cell__rate">
          {passRate}%
          <span className="suite-cell__trend" style={{ color: trendColor[suite.trend] }}>
            {' '}{trendIcon[suite.trend]}
          </span>
        </span>
        <span className="suite-cell__last-run">
          <span className="suite-cell__clock">⏱</span> {suite.lastRun}
        </span>
      </div>

      {/* Run history dots */}
      <div className="suite-cell__dots">
        {suite.runHistory.map((r, i) => (
          <span
            key={i}
            className="suite-cell__dot"
            style={{ background: dotColor[r] }}
            title={`Run ${i + 1}: ${r}`}
          />
        ))}
      </div>
    </div>
  );
}
