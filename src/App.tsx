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

const statusColor = {
  active: green,
  standby: gold,
  engaged: red,
  offline: '#666',
} as const;

function useClock() {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
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
          cellSize={100}
          gap={5}
          gapDistribution="left"
          gapDistributionVertical="top"
          atmosphere
          zones={{
            top: (
              <HudHeader scanlines>
                <HudHeader.Title subtitle="ネルフ作戦本部">NERV OPERATIONS</HudHeader.Title>
                <HudHeader.Status>
                  <span style={{ marginRight: '1.5rem' }}>
                    <span style={{ opacity: 0.4, marginRight: '0.5rem', fontSize: '0.65rem' }}>CONDITION</span>
                    <span style={{ color: conditionColor, fontWeight: 700 }}>{metrics.condition}</span>
                  </span>
                  <span style={{ marginRight: '1.5rem', fontVariantNumeric: 'tabular-nums' }}>
                    <span style={{ opacity: 0.4, marginRight: '0.5rem', fontSize: '0.65rem' }}>OP TIME</span>
                    <span style={{ fontWeight: 700 }}>{metrics.operationTime}</span>
                  </span>
                  <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                    <span style={{ opacity: 0.4, marginRight: '0.5rem', fontSize: '0.65rem' }}>CLOCK</span>
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
                  <div style={{ fontSize: '0.5rem', opacity: 0.25, textAlign: 'center', lineHeight: 1.6 }}>
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

          {/* ═══ ROW 0: EVA Unit Status Cards (cols 0,3,6 — lg=2x2) ═══ */}
          {evaUnits.map((unit, i) => (
            <HexCell
              key={unit.id}
              col={i * 3}
              row={0}
              size="lg"
              state={unit.status === 'engaged' ? 'warning' : unit.status === 'active' ? 'active' : 'default'}
              interactive
              onClick={() => handleUnitClick(unit)}
            >
              <div className="eva-card">
                <div className="eva-card__name">{unit.name}</div>
                <div className="eva-card__status" style={{ color: statusColor[unit.status] }}>
                  {unit.status.toUpperCase()}
                </div>
                <div className="eva-card__pilot">{unit.pilot}</div>
                <div className="eva-card__sync">
                  <span style={{ color: unit.syncRate >= 90 ? green : unit.syncRate >= 70 ? gold : red }}>
                    {unit.syncRate}%
                  </span>
                  <span className="eva-card__sync-label"> SYNC</span>
                </div>
              </div>
            </HexCell>
          ))}

          {/* ═══ ROW 2: Key Metrics ═══ */}
          {/* ═══ ROW 2: Key Metrics (spread across cols 0-8) ═══ */}
          <HexCell col={1} row={2}>
            <div className="metric">
              <div className="metric__value" style={{ color: green }}>{metrics.atFieldStrength}%</div>
              <div className="metric__label">AT FIELD</div>
            </div>
          </HexCell>

          <HexCell col={3} row={2}>
            <div className="metric">
              <div className="metric__value" style={{ color: gold }}>{metrics.avgSyncRate}%</div>
              <div className="metric__label">AVG SYNC</div>
            </div>
          </HexCell>

          <HexCell col={5} row={2}>
            <WarningHex level={metrics.totalDamage >= 20 ? 'warning' : 'caution'} label="DAMAGE" labelJa="損傷">
              <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{metrics.totalDamage}%</div>
            </WarningHex>
          </HexCell>

          <HexCell col={7} row={2}>
            <div className="countdown-wrap">
              <CountdownTimer
                seconds={272}
                format="mm:ss"
                label="活動限界"
                labelSub="POWER"
                warningThreshold={120}
                criticalThreshold={30}
                autoStart
              />
            </div>
          </HexCell>

          {/* ═══ ROW 3-4: MAGI Voting (lg cells, spread) ═══ */}
          <HexCell col={0} row={3} size="lg">
            <MagiPanel system={magiVotes[0].system} vote={magiVotes[0].vote} syncRate={magiVotes[0].confidence} label={magiVotes[0].label} />
          </HexCell>
          <HexCell col={3} row={3} size="lg">
            <MagiPanel system={magiVotes[1].system} vote={magiVotes[1].vote} syncRate={magiVotes[1].confidence} label={magiVotes[1].label} />
          </HexCell>
          <HexCell col={6} row={3} size="lg">
            <MagiPanel system={magiVotes[2].system} vote={magiVotes[2].vote} syncRate={magiVotes[2].confidence} label={magiVotes[2].label} />
          </HexCell>

          <HexCell col={2} row={5} size="lg">
            <MagiConsole
              votes={{ melchior: 'approve', balthasar: 'approve', caspar: 'deny' }}
              syncRates={{ melchior: 94.7, balthasar: 91.2, caspar: 67.8 }}
              title="VERDICT"
              titleJa="判定"
            />
          </HexCell>

          {/* ═══ ROW 5: System Status ═══ */}
          {systemStatuses.map((sys, i) => (
            <HexCell key={sys.id} col={i + 1} row={7} state={sys.operational ? 'default' : 'warning'}>
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

        </HexDashboard>

        <EvaUnitModal unit={modalUnit} open={modalUnit !== null} onClose={() => setModalUnit(null)} />
        <ActivityDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      </div>
    </EvaThemeProvider>
  );
}
