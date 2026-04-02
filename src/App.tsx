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
const statusColor = { active: green, standby: gold, engaged: red, offline: '#666' } as const;

function useClock() {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );
  useEffect(() => {
    const id = setInterval(() =>
      setTime(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })),
    1000);
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

  const handleUnitClick = useCallback((unit: EvaUnit) => setModalUnit(unit), []);
  const conditionColor = metrics.condition === 'RED' ? red : gold;

  // Grid: 15 cols × 8 rows at cellSize=68
  // Layout: centered zones of adjacent cells that merge visually

  return (
    <EvaThemeProvider variant="nerv">
      <div className="app-root">
        <ScanlineOverlay opacity={0.03} animated fixed />

        <HexDashboard
          cellSize={68}
          gap={4}
          gapDistribution="left"
          gapDistributionVertical="top"
          atmosphere
          zones={{
            top: (
              <HudHeader scanlines>
                <HudHeader.Title subtitle="ネルフ作戦本部">NERV OPERATIONS</HudHeader.Title>
                <HudHeader.Status>
                  <span style={{ marginRight: '1.5rem' }}>
                    <span style={{ opacity: 0.4, marginRight: '0.4rem', fontSize: '0.6rem' }}>CONDITION</span>
                    <span style={{ color: conditionColor, fontWeight: 700 }}>{metrics.condition}</span>
                  </span>
                  <span style={{ marginRight: '1.5rem', fontVariantNumeric: 'tabular-nums' }}>
                    <span style={{ opacity: 0.4, marginRight: '0.4rem', fontSize: '0.6rem' }}>OP TIME</span>
                    <span style={{ fontWeight: 700 }}>{metrics.operationTime}</span>
                  </span>
                  <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                    <span style={{ opacity: 0.4, marginRight: '0.4rem', fontSize: '0.6rem' }}>CLOCK</span>
                    <span style={{ fontWeight: 700 }}>{clock}</span>
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
                  <div style={{ fontSize: '0.45rem', opacity: 0.2, textAlign: 'center', lineHeight: 1.6 }}>
                    GOD&apos;S IN HIS HEAVEN<br/>ALL&apos;S RIGHT WITH<br/>THE WORLD
                  </div>
                </HudSidebar.Footer>
              </HudSidebar>
            ),
            overlay: alertVisible ? (
              <HudAlert severity="warning" title="ANGEL DETECTED — PATTERN BLUE" titleJa="使徒感知 — パターン青" onDismiss={() => setAlertVisible(false)} autoDismiss={15000}>
                7th Angel identified at 2.4km — all units engage
              </HudAlert>
            ) : null,
          }}
        >

          {/* ═══════════════════════════════════════════════════════
              ZONE A: EVA UNITS — Row 0, cols 1-3-5 (merged area)
              Three adjacent cells form a visual unit status strip
              ═══════════════════════════════════════════════════════ */}
          {evaUnits.map((unit, i) => (
            <HexCell
              key={unit.id}
              col={1 + i * 2}
              row={0}
              state={unit.status === 'engaged' ? 'warning' : unit.status === 'active' ? 'active' : 'default'}
              interactive
              onClick={() => handleUnitClick(unit)}
            >
              <div className="eva-card">
                <div className="eva-card__name">{unit.name}</div>
                <div className="eva-card__status" style={{ color: statusColor[unit.status] }}>
                  {unit.status.toUpperCase()}
                </div>
                <div className="eva-card__sync">
                  <span style={{ color: unit.syncRate >= 90 ? green : unit.syncRate >= 70 ? gold : red }}>
                    {unit.syncRate}%
                  </span>
                </div>
              </div>
            </HexCell>
          ))}
          {/* Sync rate detail cells flanking the EVA cards (row 0) */}
          <HexCell col={0} row={0}>
            <div className="metric"><div className="metric__value" style={{ color: green, fontSize: '1rem' }}>{evaUnits[0].pilot.split(' ')[0]}</div><div className="metric__label">PILOT 01</div></div>
          </HexCell>
          <HexCell col={2} row={0}>
            <div className="metric"><div className="metric__value" style={{ color: gold, fontSize: '1rem' }}>{evaUnits[1].pilot.split(' ')[0]}</div><div className="metric__label">PILOT 00</div></div>
          </HexCell>
          <HexCell col={4} row={0}>
            <div className="metric"><div className="metric__value" style={{ color: red, fontSize: '1rem' }}>{evaUnits[2].pilot.split(' ')[0]}</div><div className="metric__label">PILOT 02</div></div>
          </HexCell>
          <HexCell col={6} row={0}>
            <div className="metric"><div className="metric__value" style={{ color: green }}>3/3</div><div className="metric__label">DEPLOYED</div></div>
          </HexCell>

          {/* ═══════════════════════════════════════════════════════
              ZONE B: METRICS — Row 1, cols 0-5 (tight strip)
              Adjacent cells create a continuous metrics bar
              ═══════════════════════════════════════════════════════ */}
          <HexCell col={0} row={1}>
            <div className="metric"><div className="metric__value" style={{ color: green }}>{metrics.atFieldStrength}%</div><div className="metric__label">AT FIELD</div></div>
          </HexCell>
          <HexCell col={1} row={1}>
            <div className="metric"><div className="metric__value" style={{ color: gold }}>{metrics.avgSyncRate}%</div><div className="metric__label">AVG SYNC</div></div>
          </HexCell>
          <HexCell col={2} row={1}>
            <div className="metric"><div className="metric__value" style={{ color: red }}>{metrics.angelDistance}</div><div className="metric__label">DIST KM</div></div>
          </HexCell>
          <HexCell col={3} row={1} state="warning">
            <WarningHex level="warning" label="DAMAGE" labelJa="損傷">
              <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{metrics.totalDamage}%</div>
            </WarningHex>
          </HexCell>
          <HexCell col={4} row={1}>
            <div className="metric"><div className="metric__value" style={{ color: green }}>{metrics.totalTests}</div><div className="metric__label">PWR SEC</div></div>
          </HexCell>
          <HexCell col={5} row={1}>
            <div className="countdown-wrap">
              <CountdownTimer seconds={272} format="mm:ss" label="限界" labelSub="POWER" warningThreshold={120} criticalThreshold={30} autoStart />
            </div>
          </HexCell>

          {/* ═══════════════════════════════════════════════════════
              ZONE C: MAGI SYSTEM — Row 2-3, cols 7-11
              MAGI panels clustered together as a decision block
              ═══════════════════════════════════════════════════════ */}
          <HexCell col={7} row={0}>
            <MagiPanel system={magiVotes[0].system} vote={magiVotes[0].vote} syncRate={magiVotes[0].confidence} label={magiVotes[0].label} />
          </HexCell>
          <HexCell col={8} row={0}>
            <MagiPanel system={magiVotes[1].system} vote={magiVotes[1].vote} syncRate={magiVotes[1].confidence} label={magiVotes[1].label} />
          </HexCell>
          <HexCell col={9} row={0}>
            <MagiPanel system={magiVotes[2].system} vote={magiVotes[2].vote} syncRate={magiVotes[2].confidence} label={magiVotes[2].label} />
          </HexCell>
          <HexCell col={7} row={1}>
            <MagiConsole
              votes={{ melchior: 'approve', balthasar: 'approve', caspar: 'deny' }}
              syncRates={{ melchior: 94.7, balthasar: 91.2, caspar: 67.8 }}
              title="VERDICT"
              titleJa="判定"
            />
          </HexCell>
          <HexCell col={8} row={1}>
            <div className="metric"><div className="metric__value" style={{ color: green, fontSize: '0.8rem' }}>2-1</div><div className="metric__label">MAJORITY</div></div>
          </HexCell>

          {/* ═══════════════════════════════════════════════════════
              ZONE D: WEAPONS — Row 2, cols 0-5
              Equipment strip adjacent to metrics
              ═══════════════════════════════════════════════════════ */}
          {evaUnits.map((unit, i) => (
            <HexCell key={`wpn-${unit.id}`} col={i * 2} row={2}>
              <div className="metric">
                <div className="metric__value" style={{ fontSize: '0.65rem', color: gold, lineHeight: 1.3 }}>{unit.weapons[0]}</div>
                <div className="metric__label">{unit.name}</div>
              </div>
            </HexCell>
          ))}
          {evaUnits.map((unit, i) => (
            <HexCell key={`dmg-${unit.id}`} col={i * 2 + 1} row={2}>
              <div className="metric">
                <div className="metric__value" style={{ fontSize: '1rem', color: unit.damage > 0 ? red : green }}>{unit.damage}%</div>
                <div className="metric__label">DMG</div>
              </div>
            </HexCell>
          ))}

          {/* ═══════════════════════════════════════════════════════
              ZONE E: SYSTEMS — Row 3, cols 0-5
              Status indicators as a continuous strip
              ═══════════════════════════════════════════════════════ */}
          {systemStatuses.map((sys, i) => (
            <HexCell key={sys.id} col={i} row={3} state={sys.operational ? 'default' : 'warning'}>
              <HudTooltip content={`${sys.name}: ${sys.operational ? 'ONLINE' : 'OFFLINE'}`}>
                <div className="sys-status">
                  <div className="sys-status__icon" style={{ color: sys.operational ? green : red }}>
                    {sys.operational ? '●' : '✗'}
                  </div>
                  <div className="sys-status__name">{sys.name}</div>
                </div>
              </HudTooltip>
            </HexCell>
          ))}

          {/* ═══════════════════════════════════════════════════════
              ZONE F: TACTICAL — Row 2-3, cols 7-10
              Additional tactical data in the MAGI area
              ═══════════════════════════════════════════════════════ */}
          <HexCell col={7} row={2}>
            <div className="metric"><div className="metric__value" style={{ color: red, fontSize: '1rem' }}>7th</div><div className="metric__label">ANGEL</div></div>
          </HexCell>
          <HexCell col={8} row={2}>
            <div className="metric"><div className="metric__value" style={{ color: gold, fontSize: '0.9rem' }}>BLUE</div><div className="metric__label">PATTERN</div></div>
          </HexCell>
          <HexCell col={9} row={2}>
            <div className="metric"><div className="metric__value" style={{ color: red }}>{metrics.angelDistance}</div><div className="metric__label">CLOSING</div></div>
          </HexCell>
          <HexCell col={7} row={3}>
            <div className="metric"><div className="metric__value" style={{ color: green, fontSize: '0.8rem' }}>NERV-1</div><div className="metric__label">BRANCH</div></div>
          </HexCell>
          <HexCell col={8} row={3}>
            <div className="metric"><div className="metric__value" style={{ color: gold, fontSize: '0.8rem' }}>GEO</div><div className="metric__label">FRONT</div></div>
          </HexCell>

        </HexDashboard>

        <EvaUnitModal unit={modalUnit} open={modalUnit !== null} onClose={() => setModalUnit(null)} />
        <ActivityDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      </div>
    </EvaThemeProvider>
  );
}
