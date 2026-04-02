import { useState, useCallback, useEffect } from 'react';
import {
  EvaThemeProvider,
  HexDashboard,
  HexCell,
  HudHeader,
  HudSidebar,
  HudAlert,
  MagiPanel,
  MagiConsole,
  CountdownTimer,
  ScanlineOverlay,
  hexGroupPositions,
} from 'eva-ui';

import { evaUnits, magiVotes, metrics } from './data/mockData';
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

function evaClusterCells(unit: EvaUnit, centerCol: number, centerRow: number, onUnitClick: (unit: EvaUnit) => void) {
  const cells = hexGroupPositions('hex-7', centerCol, centerRow);
  const centerState = unit.status === 'engaged' ? 'warning' : unit.status === 'active' ? 'active' : 'default';

  const ringData = [
    { value: `${unit.syncRate}%`, label: 'SYNC', color: unit.syncRate >= 90 ? green : unit.syncRate >= 70 ? gold : red },
    { value: unit.weapons[0], label: 'WEAPON', color: gold, small: true },
    { value: `${unit.damage}%`, label: 'DAMAGE', color: unit.damage > 10 ? red : unit.damage > 0 ? gold : green },
    { value: formatPower(unit.powerRemaining), label: 'POWER', color: unit.powerRemaining < 180 ? red : gold },
    { value: `${unit.atFieldStrength}%`, label: 'AT FIELD', color: unit.atFieldStrength >= 85 ? green : gold },
    { value: unit.pilot.split(' ')[0], label: 'PILOT', color: '#fff' },
  ];

  return [
    <HexCell
      key={`${unit.id}-center`}
      col={cells[0].col}
      row={cells[0].row}
      state={centerState}
      interactive
      onClick={() => onUnitClick(unit)}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.5rem', opacity: 0.5, letterSpacing: '0.15em' }}>{unit.nameJa}</div>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.15rem' }}>{unit.name}</div>
        <div style={{ fontSize: '1.1rem', fontWeight: 900, color: statusColor[unit.status], letterSpacing: '0.15em' }}>
          {unit.status.toUpperCase()}
        </div>
      </div>
    </HexCell>,
    ...ringData.map((data, i) => {
      const cell = cells[i + 1];
      return (
        <HexCell key={`${unit.id}-ring-${i}`} col={cell.col} row={cell.row} state="default">
          <div className="metric">
            <div className="metric__value" style={{ color: data.color, fontSize: data.small ? '0.55rem' : '0.85rem' }}>
              {data.value}
            </div>
            <div className="metric__label">{data.label}</div>
          </div>
        </HexCell>
      );
    }),
  ];
}

function magiClusterCells(centerCol: number, centerRow: number) {
  const cells = hexGroupPositions('hex-7', centerCol, centerRow);

  const tacticalData = [
    { value: 'BLUE', label: 'PATTERN', color: gold },
    { value: '7th', label: 'ANGEL', color: red },
    { value: `${metrics.angelDistance}km`, label: 'DISTANCE', color: red },
  ];

  return [
    <HexCell key="magi-center" col={cells[0].col} row={cells[0].row} state="active">
      <MagiConsole
        votes={{ melchior: 'approve', balthasar: 'approve', caspar: 'deny' }}
        syncRates={{ melchior: 94.7, balthasar: 91.2, caspar: 67.8 }}
        title="VERDICT"
        titleJa="判定"
      />
    </HexCell>,
    ...magiVotes.map((vote, i) => (
      <HexCell key={`magi-${vote.system}`} col={cells[i + 1].col} row={cells[i + 1].row} state="default">
        <MagiPanel system={vote.system} vote={vote.vote} syncRate={vote.confidence} label={vote.label} />
      </HexCell>
    )),
    ...tacticalData.map((data, i) => (
      <HexCell key={`tac-${i}`} col={cells[i + 4].col} row={cells[i + 4].row} state="default">
        <div className="metric">
          <div className="metric__value" style={{ color: data.color, fontSize: '0.85rem' }}>{data.value}</div>
          <div className="metric__label">{data.label}</div>
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

  return (
    <EvaThemeProvider variant="nerv">
      <div className="app-root">
        <ScanlineOverlay opacity={0.03} animated fixed />

        <HexDashboard
          cellSize={44}
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

          {/* ═══ EVA-01 cluster: col=3, row=2 ═══ */}
          {evaClusterCells(evaUnits[0], 3, 2, handleUnitClick)}

          {/* ═══ EVA-00 cluster: col=7, row=2 ═══ */}
          {evaClusterCells(evaUnits[1], 7, 2, handleUnitClick)}

          {/* ═══ EVA-02 cluster: col=11, row=2 ═══ */}
          {evaClusterCells(evaUnits[2], 11, 2, handleUnitClick)}

          {/* ═══ MAGI cluster: col=7, row=5 ═══ */}
          {magiClusterCells(7, 5)}

        </HexDashboard>

        <EvaUnitModal unit={modalUnit} open={modalUnit !== null} onClose={() => setModalUnit(null)} />
        <ActivityDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      </div>
    </EvaThemeProvider>
  );
}
