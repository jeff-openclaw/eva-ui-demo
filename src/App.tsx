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
  hexGroupPositions,
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

function formatPower(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// ── EVA Unit hex-7 cluster ──
// Center: status, Ring: pilot/sync/weapon/damage/power/AT
function evaClusterCells(unit: EvaUnit, centerCol: number, centerRow: number, onUnitClick: (u: EvaUnit) => void) {
  const cells = hexGroupPositions('hex-7', centerCol, centerRow);
  const cs = unit.status === 'engaged' ? 'warning' : unit.status === 'active' ? 'active' : 'default';

  const ring: { v: string; l: string; c: string; s?: boolean }[] = [
    { v: `${unit.syncRate}%`, l: 'SYNC', c: unit.syncRate >= 90 ? green : unit.syncRate >= 70 ? gold : red },
    { v: unit.weapons[0], l: 'WEAPON', c: gold, s: true },
    { v: `${unit.damage}%`, l: 'DAMAGE', c: unit.damage > 10 ? red : unit.damage > 0 ? gold : green },
    { v: formatPower(unit.powerRemaining), l: 'POWER', c: unit.powerRemaining < 180 ? red : gold },
    { v: `${unit.atFieldStrength}%`, l: 'AT FIELD', c: unit.atFieldStrength >= 85 ? green : gold },
    { v: unit.pilot.split(' ')[0], l: 'PILOT', c: '#fff' },
  ];

  return [
    <HexCell key={`${unit.id}-c`} col={cells[0].col} row={cells[0].row} state={cs as 'active' | 'warning' | 'default'} interactive onClick={() => onUnitClick(unit)}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.45rem', opacity: 0.4, letterSpacing: '0.15em' }}>{unit.nameJa}</div>
        <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 2 }}>{unit.name}</div>
        <div style={{ fontSize: '1.3rem', fontWeight: 900, color: statusColor[unit.status], letterSpacing: '0.15em' }}>
          {unit.status.toUpperCase()}
        </div>
      </div>
    </HexCell>,
    ...ring.map((d, i) => (
      <HexCell key={`${unit.id}-r${i}`} col={cells[i + 1].col} row={cells[i + 1].row}>
        <div className="metric">
          <div className="metric__value" style={{ color: d.c, fontSize: d.s ? '0.5rem' : '0.9rem' }}>{d.v}</div>
          <div className="metric__label">{d.l}</div>
        </div>
      </HexCell>
    )),
  ];
}

// ── MAGI hex-7 cluster ──
function magiClusterCells(centerCol: number, centerRow: number) {
  const cells = hexGroupPositions('hex-7', centerCol, centerRow);
  const tac = [
    { v: 'BLUE', l: 'PATTERN', c: gold },
    { v: '7th', l: 'ANGEL', c: red },
    { v: `${metrics.angelDistance}km`, l: 'DIST', c: red },
  ];

  return [
    <HexCell key="magi-c" col={cells[0].col} row={cells[0].row} state="active">
      <MagiConsole
        votes={{ melchior: 'approve', balthasar: 'approve', caspar: 'deny' }}
        syncRates={{ melchior: 94.7, balthasar: 91.2, caspar: 67.8 }}
        title="VERDICT"
        titleJa="判定"
      />
    </HexCell>,
    ...magiVotes.map((v, i) => (
      <HexCell key={`magi-${v.system}`} col={cells[i + 1].col} row={cells[i + 1].row}>
        <MagiPanel system={v.system} vote={v.vote} syncRate={v.confidence} label={v.label} />
      </HexCell>
    )),
    ...tac.map((d, i) => (
      <HexCell key={`tac-${i}`} col={cells[i + 4].col} row={cells[i + 4].row}>
        <div className="metric">
          <div className="metric__value" style={{ color: d.c, fontSize: '0.9rem' }}>{d.v}</div>
          <div className="metric__label">{d.l}</div>
        </div>
      </HexCell>
    )),
  ];
}

export default function App() {
  const [activeNav, setActiveNav] = useState<NavItem>('operations');
  const [modalUnit, setModalUnit] = useState<EvaUnit | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [alertVisible, setAlertVisible] = useState(true);
  const clock = useClock();

  const handleUnitClick = useCallback((unit: EvaUnit) => setModalUnit(unit), []);
  const conditionColor = metrics.condition === 'RED' ? red : gold;

  // cellSize=58, gap=3 → ~17 cols × ~10 rows
  // hex-7 spans 3 cols × 3 rows
  // Layout:
  //   Row 1-3: EVA-01 @(2,2), EVA-00 @(7,2), EVA-02 @(12,2) — 3 clusters across
  //   Row 4: metrics strip (cols 0-11)
  //   Row 5-7: MAGI @(3,6), Systems @(8,6), Tactical @(12,6)

  return (
    <EvaThemeProvider variant="nerv">
      <div className="app-root">
        <ScanlineOverlay opacity={0.03} animated fixed />

        <HexDashboard
          cellSize={58}
          gap={3}
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
              </HudSidebar>
            ),
            overlay: alertVisible ? (
              <HudAlert severity="warning" title="ANGEL DETECTED — PATTERN BLUE" titleJa="使徒感知 — パターン青" onDismiss={() => setAlertVisible(false)} autoDismiss={15000}>
                7th Angel identified at 2.4km — all units engage
              </HudAlert>
            ) : null,
          }}
        >

          {/* ═══ ROW 1-3: Three EVA hex-7 clusters ═══ */}
          {evaClusterCells(evaUnits[0], 2, 1, handleUnitClick)}
          {evaClusterCells(evaUnits[1], 7, 1, handleUnitClick)}
          {evaClusterCells(evaUnits[2], 12, 1, handleUnitClick)}

          {/* ═══ ROW 3: Metrics strip between EVA clusters and MAGI ═══ */}
          <HexCell col={0} row={3}>
            <div className="metric"><div className="metric__value" style={{ color: green }}>{metrics.atFieldStrength}%</div><div className="metric__label">AT FIELD</div></div>
          </HexCell>
          <HexCell col={2} row={3}>
            <div className="metric"><div className="metric__value" style={{ color: gold }}>{metrics.avgSyncRate}%</div><div className="metric__label">AVG SYNC</div></div>
          </HexCell>
          <HexCell col={4} row={3} state="warning">
            <WarningHex level="warning" label="DAMAGE" labelJa="損傷">
              <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{metrics.totalDamage}%</div>
            </WarningHex>
          </HexCell>
          <HexCell col={5} row={3}>
            <div className="countdown-wrap">
              <CountdownTimer seconds={272} format="mm:ss" label="限界" labelSub="POWER" warningThreshold={120} criticalThreshold={30} autoStart />
            </div>
          </HexCell>
          <HexCell col={9} row={3}>
            <div className="metric"><div className="metric__value" style={{ color: red }}>{metrics.angelDistance}km</div><div className="metric__label">ANGEL DIST</div></div>
          </HexCell>
          <HexCell col={11} row={3}>
            <div className="metric"><div className="metric__value" style={{ color: green }}>3/3</div><div className="metric__label">DEPLOYED</div></div>
          </HexCell>
          <HexCell col={13} row={3}>
            <div className="metric"><div className="metric__value" style={{ color: gold, fontSize: '0.8rem' }}>BLUE</div><div className="metric__label">PATTERN</div></div>
          </HexCell>

          {/* ═══ ROW 4-6: MAGI cluster (left) ═══ */}
          {magiClusterCells(3, 5)}

          {/* ═══ ROW 4-6: System Status cluster (right) ═══ */}
          {(() => {
            const sysCells = hexGroupPositions('hex-7', 10, 5);
            return [
              <HexCell key="sys-center" col={sysCells[0].col} row={sysCells[0].row} state="active">
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.45rem', opacity: 0.4, letterSpacing: '0.15em' }}>システム状態</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em' }}>SYSTEMS</div>
                  <div style={{ fontSize: '1rem', fontWeight: 900, color: green, marginTop: 2 }}>
                    {systemStatuses.filter(s => s.operational).length}/{systemStatuses.length}
                  </div>
                </div>
              </HexCell>,
              ...systemStatuses.map((sys, i) => (
                <HexCell key={`sys-${sys.id}`} col={sysCells[i + 1].col} row={sysCells[i + 1].row} state={sys.operational ? 'default' : 'warning'}>
                  <HudTooltip content={`${sys.name}: ${sys.operational ? 'ONLINE' : 'OFFLINE'}`}>
                    <div className="sys-status">
                      <div className="sys-status__icon" style={{ color: sys.operational ? green : red, fontSize: '1.2rem' }}>
                        {sys.operational ? '●' : '✗'}
                      </div>
                      <div className="sys-status__name">{sys.name}</div>
                    </div>
                  </HudTooltip>
                </HexCell>
              )),
            ];
          })()}

        </HexDashboard>

        <EvaUnitModal unit={modalUnit} open={modalUnit !== null} onClose={() => setModalUnit(null)} />
        <ActivityDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      </div>
    </EvaThemeProvider>
  );
}
