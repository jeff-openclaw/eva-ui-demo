import { HudModal, HazardStripes } from 'eva-ui';
import type { TestSuite } from '../data/mockData';
import { recentResults } from '../data/mockData';

interface SuiteModalProps {
  suite: TestSuite | null;
  open: boolean;
  onClose: () => void;
}

const statusIcon = { pass: '●', fail: '✕', skip: '○' } as const;
const statusColor = {
  pass: 'var(--eva-hex-active, #0f0)',
  fail: 'var(--eva-crimson, #f00)',
  skip: 'var(--eva-border, #666)',
} as const;

const dotColor = {
  pass: 'var(--eva-hex-active, #0f0)',
  fail: 'var(--eva-crimson, #f00)',
  mixed: '#ff0',
} as const;

const trendLabel = { up: '▲ Improving', down: '▼ Declining', stable: '― Stable' } as const;
const trendColor = {
  up: 'var(--eva-hex-active, #0f0)',
  down: 'var(--eva-crimson, #f00)',
  stable: 'var(--eva-border, #666)',
} as const;

export function SuiteModal({ suite, open, onClose }: SuiteModalProps) {
  if (!suite) return null;

  const passRate = ((suite.passed / suite.total) * 100).toFixed(1);
  const passW = (suite.passed / suite.total) * 100;
  const failW = (suite.failed / suite.total) * 100;
  const skipW = (suite.skipped / suite.total) * 100;
  const suiteResults = recentResults.filter(
    (r) => r.suite.toLowerCase() === suite.name.split(' ')[0].toLowerCase()
  );
  const isCritical = suite.failed >= 10;

  return (
    <HudModal
      open={open}
      onClose={onClose}
      title={suite.name}
      titleJa={suite.nameJa}
      maxWidth={560}
      berserk={isCritical}
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <span style={{ opacity: 0.5, fontSize: '0.75rem' }}>Last run: {suite.lastRun}</span>
          <button
            onClick={onClose}
            style={{
              background: 'var(--eva-hex-active, #f80)',
              color: '#000',
              border: 'none',
              padding: '0.4rem 1.2rem',
              fontFamily: 'inherit',
              fontWeight: 700,
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Close
          </button>
        </div>
      }
    >
      <HazardStripes height={3} animated />

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', margin: '1rem 0' }}>
        <div className="modal-stat">
          <div className="modal-stat__label">TOTAL</div>
          <div className="modal-stat__value">{suite.total}</div>
        </div>
        <div className="modal-stat">
          <div className="modal-stat__label">PASSED</div>
          <div className="modal-stat__value" style={{ color: 'var(--eva-hex-active, #0f0)' }}>{suite.passed}</div>
        </div>
        <div className="modal-stat">
          <div className="modal-stat__label">FAILED</div>
          <div className="modal-stat__value" style={{ color: 'var(--eva-crimson, #f00)' }}>{suite.failed}</div>
        </div>
        <div className="modal-stat">
          <div className="modal-stat__label">SKIPPED</div>
          <div className="modal-stat__value" style={{ color: 'var(--eva-border, #666)' }}>{suite.skipped}</div>
        </div>
      </div>

      {/* Pass rate + duration + trend */}
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0.5rem 0 1rem', fontSize: '0.85rem' }}>
        <span>Pass Rate: <strong>{passRate}%</strong></span>
        <span>Duration: <strong>{suite.duration}</strong></span>
        <span style={{ color: trendColor[suite.trend] }}>{trendLabel[suite.trend]}</span>
      </div>

      {/* Stacked bar */}
      <div style={{ display: 'flex', width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden', margin: '0.5rem 0' }}>
        <div style={{ width: `${passW}%`, height: '100%', background: 'var(--eva-hex-active, #0f0)', transition: 'width 0.6s ease' }} />
        <div style={{ width: `${failW}%`, height: '100%', background: 'var(--eva-crimson, #f00)', transition: 'width 0.6s ease' }} />
        <div style={{ width: `${skipW}%`, height: '100%', background: 'var(--eva-border, #666)', transition: 'width 0.6s ease' }} />
      </div>
      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.65rem', opacity: 0.5, marginBottom: '1rem' }}>
        <span>■ Pass {suite.passed}</span>
        <span style={{ color: 'var(--eva-crimson, #f00)' }}>■ Fail {suite.failed}</span>
        <span style={{ color: 'var(--eva-border, #666)' }}>■ Skip {suite.skipped}</span>
      </div>

      {/* Run history dots */}
      <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6, marginBottom: '0.4rem' }}>
        Run History
      </div>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '1rem' }}>
        {suite.runHistory.map((r, i) => (
          <span
            key={i}
            title={`Run ${i + 1}: ${r}`}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: dotColor[r],
              opacity: 0.85,
              display: 'inline-block',
            }}
          />
        ))}
      </div>

      <HazardStripes height={2} />

      {/* Recent results */}
      <div style={{ marginTop: '1rem' }}>
        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6, marginBottom: '0.5rem' }}>
          Recent Results
        </div>
        {suiteResults.length === 0 && (
          <div style={{ opacity: 0.4, fontStyle: 'italic' }}>No recent results for this suite</div>
        )}
        {suiteResults.map((r) => (
          <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem' }}>
            <span>
              <span style={{ color: statusColor[r.status], marginRight: '0.5rem' }}>{statusIcon[r.status]}</span>
              {r.name}
            </span>
            <span style={{ opacity: 0.5 }}>{r.duration}</span>
          </div>
        ))}
      </div>
    </HudModal>
  );
}
