import { HudDrawer, HazardStripes } from 'eva-ui';
import { activityLog } from '../data/mockData';

interface ActivityDrawerProps {
  open: boolean;
  onClose: () => void;
}

const severityColor = {
  info: 'var(--eva-hex-active, #0f0)',
  caution: '#ff0',
  warning: 'var(--eva-border, #f80)',
  critical: 'var(--eva-crimson, #f00)',
} as const;

const typeIcon = {
  run_complete: '▶',
  test_failed: '✕',
  suite_added: '+',
  flaky_detected: '⚡',
  config_changed: '⚙',
} as const;

export function ActivityDrawer({ open, onClose }: ActivityDrawerProps) {
  return (
    <HudDrawer open={open} onClose={onClose} position="right" size={380}>
      <div style={{ padding: '1.5rem 1rem' }}>
        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.25rem' }}>
          Recent Activity
        </div>
        <div style={{ fontSize: '0.6rem', opacity: 0.4, marginBottom: '1rem' }}>
          最近のアクティビティ
        </div>

        <HazardStripes height={3} animated />

        <div style={{ marginTop: '1rem' }}>
          {activityLog.map((entry) => (
            <div
              key={entry.id}
              style={{
                display: 'flex',
                gap: '0.75rem',
                padding: '0.6rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <span
                style={{
                  color: severityColor[entry.severity],
                  flexShrink: 0,
                  fontSize: '0.9rem',
                  width: '1rem',
                  textAlign: 'center',
                }}
              >
                {typeIcon[entry.type]}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>{entry.message}</div>
                <div style={{ fontSize: '0.65rem', opacity: 0.4, marginTop: '0.2rem' }}>{entry.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </HudDrawer>
  );
}
