import { useState, useCallback, useEffect } from 'react';
import {
  EvaThemeProvider,
  HexDashboard,
  HexCell,
  HudHeader,
  HudSidebar,
  HudAlert,
  HudTooltip,
  MagiPanel,
  MagiConsole,
  CountdownTimer,
  WarningHex,
  ScanlineOverlay,
} from 'eva-ui';

import { evaUnits, magiVotes, systemStatuses, metrics } from './data/mockData';
import type { EvaUnit } from './data/mockData';
import { EvaUnitModal } from './components/EvaUnitModal';
import { ActivityDrawer } from './components/ActivityDrawer';

type NavItem = 'operations' | 'eva-units' | 'pilots' | 'at-field' | 'magi' | 'systems';

const gold = '#f5c842';
const green = '#0f0';
const red = '#ff3b3b';
const dim = 'rgba(255,255,255,0.35)';

const bigNum: React.CSSProperties = {
  fontSize: '2.4rem',
  fontWeight: 800,
  lineHeight: 1,
  letterSpacing: '0.04em',
  fontVariantNumeric: 'tabular-nums',
};

const cellLabel: React.CSSProperties = {
  fontSize: '0.6rem',
  fontWeight: 600,
  letterSpacing: '0.14em',
  color: dim,
  marginTop: '0.4rem',
};

const statusColor = {
  active: green,
  standby: gold,
  engaged: red,
  offline: '#666',
} as const;

function useClock() {
  const [time, setTime] = useState(() => {
    const d = new Date();
    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  });
  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date();
      setTime(d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const [activeNav, setActiveNav] = useState<NavItem>('operations');
  const [modalUnit, setModalUnit] = useState<EvaUnit | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [alertVisible, setAlertVisible] = useState(true);
  const clock = useClock();

  const handleUnitClick = useCallback((unit: EvaUnit) => {
    setModalUnit(unit);
  }, []);

  const conditionColor = metrics.condition === 'RED' ? red : gold;

  return (
    <EvaThemeProvider variant="nerv">
      <div className="app-root">
        <ScanlineOverlay opacity={0.03} animated fixed />

        <HexDashboard
          layout="masonry"
          cellSize={72}
          gap={4}
          atmosphere
          zones={{
            top: (
              <HudHeader scanlines>
                <HudHeader.Title subtitle="ネルフ作戦本部">
                  NERV OPERATIONS
                </HudHeader.Title>
                <HudHeader.Status>
                  <span style={{ marginRight: '1.5rem' }}>
                    <span style={{ opacity: 0.4, marginRight: '0.5rem', fontSize: '0.65rem' }}>CONDITION</span>
                    <span style={{ color: conditionColor, fontWeight: 700, letterSpacing: '0.08em' }}>{metrics.condition}</span>
                  </span>
                  <span style={{ marginRight: '1.5rem', fontVariantNumeric: 'tabular-nums' }}>
                    <span style={{ opacity: 0.4, marginRight: '0.5rem', fontSize: '0.65rem' }}>OP TIME</span>
                    <span style={{ fontWeight: 700, letterSpacing: '0.08em' }}>{metrics.operationTime}</span>
                  </span>
                  <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                    <span style={{ opacity: 0.4, marginRight: '0.5rem', fontSize: '0.65rem' }}>CLOCK</span>
                    <span style={{ fontWeight: 700, letterSpacing: '0.08em' }}>{clock}</span>
                  </span>
                </HudHeader.Status>
              </HudHeader>
            ),
            left: (
              <HudSidebar position="left" hazardAccent scanlines>
                <HudSidebar.Logo>NERV</HudSidebar.Logo>
                <HudSidebar.Nav>
                  <HudSidebar.NavItem label="Operations" active={activeNav === 'operations'} onClick={() => setActiveNav('operations')} />
                  <HudSidebar.NavItem label="Eva Units" active={activeNav === 'eva-units'} onClick={() => setActiveNav('eva-units')} />
                  <HudSidebar.NavItem label="Pilots" active={activeNav === 'pilots'} onClick={() => setActiveNav('pilots')} />
                  <HudSidebar.Section label="Tactical" />
                  <HudSidebar.NavItem label="AT Field" active={activeNav === 'at-field'} onClick={() => setActiveNav('at-field')} />
                  <HudSidebar.NavItem label="MAGI" active={activeNav === 'magi'} onClick={() => setActiveNav('magi')} />
                  <HudSidebar.NavItem label="Op Log" onClick={() => setDrawerOpen(true)} />
                  <HudSidebar.Section label="System" />
                  <HudSidebar.NavItem label="Systems" active={activeNav === 'systems'} onClick={() => setActiveNav('systems')} />
                </HudSidebar.Nav>
                <HudSidebar.Footer>
                  <div style={{ fontSize: '0.55rem', opacity: 0.3, textAlign: 'center', lineHeight: 1.6 }}>
                    GOD&apos;S IN HIS HEAVEN<br />
                    ALL&apos;S RIGHT WITH<br />
                    THE WORLD
                  </div>
                </HudSidebar.Footer>
              </HudSidebar>
            ),
            overlay: alertVisible ? (
              <HudAlert
                severity="warning"
                title="ANGEL DETECTED — PATTERN BLUE"
                titleJa="使徒感知 — パターン青"
                onDismiss={() => setAlertVisible(false)}
                autoDismiss={15000}
              >
                7th Angel identified at 2.4km — all units engage
              </HudAlert>
            ) : null,
          }}
        >

          {/* ═══ Priority 0: EVA Unit Hero Cards (lg) ═══ */}
          {evaUnits.map((unit) => (
            <HexCell
              key={unit.id}
              size="lg"
              priority={0}
              state={unit.status === 'engaged' ? 'warning' : unit.status === 'active' ? 'active' : 'default'}
              interactive
              onClick={() => handleUnitClick(unit)}
            >
              <HudTooltip content={`${unit.pilot} — Sync ${unit.syncRate}% — Power ${Math.floor(unit.powerRemaining / 60)}:${String(unit.powerRemaining % 60).padStart(2, '0')}`}>
                <div className="eva-cell">
                  <div className="eva-cell__name">{unit.nameJa}</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.06em' }}>{unit.name}</div>
                  <div className="eva-cell__status" style={{ color: statusColor[unit.status] }}>
                    {unit.status.toUpperCase()}
                  </div>
                  <div className="eva-cell__pilot">{unit.pilot}</div>
                  <div className="eva-cell__sync">
                    SYNC {unit.syncRate}%
                    {unit.damage > 0 && (
                      <span style={{ color: unit.damage >= 20 ? red : gold, marginLeft: '0.5rem' }}>
                        DMG {unit.damage}%
                      </span>
                    )}
                  </div>
                </div>
              </HudTooltip>
            </HexCell>
          ))}

          {/* ═══ Priority 1: MAGI Voting (md) ═══ */}
          {magiVotes.map((mv) => (
            <HexCell key={mv.system} size="md" priority={1}>
              <MagiPanel
                system={mv.system}
                vote={mv.vote}
                syncRate={mv.confidence}
                label={mv.label}
              />
            </HexCell>
          ))}

          <HexCell size="md" priority={1}>
            <MagiConsole
              votes={{ melchior: 'approve', balthasar: 'approve', caspar: 'deny' }}
              syncRates={{ melchior: 94.7, balthasar: 91.2, caspar: 67.8 }}
              title="OPERATION STATUS"
              titleJa="作戦状態"
            />
          </HexCell>

          {/* ═══ Priority 2: Key Metrics (md) ═══ */}
          <HexCell size="md" priority={2}>
            <HudTooltip content="Combined AT Field neutralization strength">
              <div className="metric-cell">
                <div className="metric-cell__value" style={{ color: green }}>{metrics.atFieldStrength}%</div>
                <div className="metric-cell__label">AT FIELD</div>
              </div>
            </HudTooltip>
          </HexCell>

          <HexCell size="md" priority={2}>
            <HudTooltip content="Average across all active pilots">
              <div className="metric-cell">
                <div className="metric-cell__value" style={{ color: gold }}>{metrics.avgSyncRate}%</div>
                <div className="metric-cell__label">SYNC RATE</div>
              </div>
            </HudTooltip>
          </HexCell>

          <HexCell size="md" priority={2}>
            <HudTooltip content="Distance to Angel core — closing">
              <div className="metric-cell">
                <div className="metric-cell__value" style={{ color: red }}>{metrics.angelDistance}km</div>
                <div className="metric-cell__label">ANGEL DISTANCE</div>
              </div>
            </HudTooltip>
          </HexCell>

          <HexCell size="md" priority={2} state="warning">
            <WarningHex level="warning" label={`${metrics.totalDamage}% DAMAGE`} labelJa="損傷" />
          </HexCell>

          <HexCell size="md" priority={2}>
            <div className="countdown-wrapper">
              <CountdownTimer
                seconds={272}
                format="mm:ss"
                label="活動限界"
                labelSub="EVA-01 POWER"
                warningThreshold={120}
                criticalThreshold={30}
                autoStart
              />
            </div>
          </HexCell>

          {/* ═══ Priority 3: System Status Indicators (sm) ═══ */}
          {systemStatuses.map((sys) => (
            <HexCell
              key={sys.id}
              size="sm"
              priority={3}
              state={sys.operational ? 'active' : 'warning'}
            >
              <HudTooltip content={`${sys.name}: ${sys.operational ? 'OPERATIONAL' : 'OFFLINE'}`}>
                <div className="system-cell">
                  <div className="system-cell__icon" style={{ color: sys.operational ? green : red }}>
                    {sys.operational ? '✓' : '✗'}
                  </div>
                  <div className="system-cell__name">{sys.name}</div>
                </div>
              </HudTooltip>
            </HexCell>
          ))}

        </HexDashboard>

        {/* Overlays */}
        <EvaUnitModal unit={modalUnit} open={modalUnit !== null} onClose={() => setModalUnit(null)} />
        <ActivityDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      </div>
    </EvaThemeProvider>
  );
}
