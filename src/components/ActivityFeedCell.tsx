import { useEffect, useRef } from 'react';
import type { ActivityEntry } from '../data/mockData';

interface ActivityFeedCellProps {
  entries: ActivityEntry[];
}

const severityColor: Record<ActivityEntry['severity'], string> = {
  info: 'var(--eva-hex-active, #0f0)',
  caution: '#ff0',
  warning: 'var(--eva-border, #f80)',
  critical: 'var(--eva-crimson, #f00)',
};

const statusBadge: Record<ActivityEntry['type'], { text: string; color: string }> = {
  run_complete: { text: 'DONE', color: 'var(--eva-hex-active, #0f0)' },
  test_failed: { text: 'FAIL', color: 'var(--eva-crimson, #f00)' },
  suite_added: { text: ' NEW', color: '#0af' },
  flaky_detected: { text: 'FLKY', color: '#ff0' },
  config_changed: { text: ' CFG', color: 'var(--eva-border, #f80)' },
};

export function ActivityFeedCell({ entries }: ActivityFeedCellProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Auto-scroll to bottom
    el.scrollTop = el.scrollHeight;
  }, [entries.length]);

  // Simulate auto-scroll animation on mount
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = 0;
    let frame: number;
    const scroll = () => {
      if (el.scrollTop < el.scrollHeight - el.clientHeight) {
        el.scrollTop += 1.5;
        frame = requestAnimationFrame(scroll);
      }
    };
    // Delay start for effect
    const timeout = setTimeout(() => {
      frame = requestAnimationFrame(scroll);
    }, 600);
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="activity-feed">
      <div className="activity-feed__header">
        <span className="activity-feed__title">ACTIVITY LOG</span>
        <span className="activity-feed__title-ja">アクティビティログ</span>
      </div>
      <div className="activity-feed__scroll" ref={scrollRef}>
        {entries.map((entry, i) => {
          const badge = statusBadge[entry.type];
          return (
            <div key={entry.id} className="activity-feed__line" style={{ animationDelay: `${i * 80}ms` }}>
              <span className="activity-feed__ts" style={{ color: severityColor[entry.severity] }}>
                {entry.timestamp}
              </span>
              <span
                className="activity-feed__badge"
                style={{ color: badge.color, borderColor: badge.color }}
              >
                {badge.text}
              </span>
              <span className="activity-feed__msg">{entry.message}</span>
            </div>
          );
        })}
        <div className="activity-feed__cursor">_</div>
      </div>
    </div>
  );
}
