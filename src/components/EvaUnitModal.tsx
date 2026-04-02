import { HudModal, HazardStripes } from 'eva-ui';
import type { EvaUnit } from '../data/mockData';

interface EvaUnitModalProps {
  unit: EvaUnit | null;
  open: boolean;
  onClose: () => void;
}

const statusColor = {
  active: '#0f0',
  standby: '#f5c842',
  engaged: '#ff3b3b',
  offline: '#666',
} as const;

const statusLabel = {
  active: 'ACTIVE',
  standby: 'STANDBY',
  engaged: 'ENGAGED',
  offline: 'OFFLINE',
} as const;

const stat: React.CSSProperties = {
  textAlign: 'center',
};
const statLabel: React.CSSProperties = {
  fontSize: '0.65rem',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  opacity: 0.5,
  marginBottom: '0.25rem',
};
const statValue: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 700,
  fontVariantNumeric: 'tabular-nums',
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function EvaUnitModal({ unit, open, onClose }: EvaUnitModalProps) {
  if (!unit) return null;

  const isCritical = unit.damage >= 20 || unit.status === 'engaged';

  return (
    <HudModal
      open={open}
      onClose={onClose}
      title={`${unit.name} — ${unit.nameJa}`}
      titleJa={unit.pilotJa}
      maxWidth={560}
      berserk={isCritical}
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <span style={{ opacity: 0.5, fontSize: '0.75rem' }}>
            STATUS: <span style={{ color: statusColor[unit.status] }}>{statusLabel[unit.status]}</span>
          </span>
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
            Dismiss
          </button>
        </div>
      }
    >
      <HazardStripes height={3} animated />

      {/* Pilot info */}
      <div style={{ margin: '1rem 0 0.5rem', fontSize: '0.85rem' }}>
        <span style={{ opacity: 0.5, marginRight: '0.5rem' }}>PILOT:</span>
        <strong>{unit.pilot}</strong>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', margin: '1rem 0' }}>
        <div style={stat}>
          <div style={statLabel}>SYNC RATE</div>
          <div style={{ ...statValue, color: unit.syncRate >= 90 ? '#0f0' : unit.syncRate >= 70 ? '#f5c842' : '#ff3b3b' }}>
            {unit.syncRate}%
          </div>
        </div>
        <div style={stat}>
          <div style={statLabel}>DAMAGE</div>
          <div style={{ ...statValue, color: unit.damage >= 20 ? '#ff3b3b' : unit.damage >= 10 ? '#f5c842' : '#0f0' }}>
            {unit.damage}%
          </div>
        </div>
        <div style={stat}>
          <div style={statLabel}>AT FIELD</div>
          <div style={{ ...statValue, color: unit.atFieldStrength >= 85 ? '#0f0' : '#f5c842' }}>
            {unit.atFieldStrength}%
          </div>
        </div>
        <div style={stat}>
          <div style={statLabel}>POWER</div>
          <div style={{ ...statValue, color: unit.powerRemaining < 120 ? '#ff3b3b' : unit.powerRemaining < 180 ? '#f5c842' : '#0f0' }}>
            {formatTime(unit.powerRemaining)}
          </div>
        </div>
      </div>

      {/* Damage bar */}
      <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6, marginBottom: '0.4rem' }}>
        Hull Integrity
      </div>
      <div style={{ display: 'flex', width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden', margin: '0 0 1rem' }}>
        <div style={{ width: `${100 - unit.damage}%`, height: '100%', background: unit.damage >= 20 ? '#ff3b3b' : '#0f0', transition: 'width 0.6s ease' }} />
      </div>

      <HazardStripes height={2} />

      {/* Equipment */}
      <div style={{ marginTop: '1rem' }}>
        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6, marginBottom: '0.5rem' }}>
          Equipment
        </div>
        <div style={{ fontSize: '0.85rem', marginBottom: '0.3rem' }}>
          <span style={{ opacity: 0.5, marginRight: '0.5rem' }}>ARMOR:</span>{unit.armor}
        </div>
        {unit.weapons.map((w, i) => (
          <div key={i} style={{ display: 'flex', padding: '0.3rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem' }}>
            <span style={{ color: '#f5c842', marginRight: '0.5rem' }}>▸</span>
            {w}
          </div>
        ))}
      </div>

      {/* Notes */}
      <div style={{ marginTop: '1rem', fontSize: '0.8rem', opacity: 0.6, fontStyle: 'italic' }}>
        {unit.notes}
      </div>
    </HudModal>
  );
}
