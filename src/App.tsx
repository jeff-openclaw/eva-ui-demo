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

import { testSuites, metrics, recentResults, flakyTests } from './data/mockData';
import type { TestSuite } from './data/mockData';
import { SuiteModal } from './components/SuiteModal';
import { ActivityDrawer } from './components/ActivityDrawer';

type NavItem = 'dashboard' | 'suites' | 'runs' | 'reports' | 'settings';

const gold = '#f5c842';
const dim = 'rgba(255,255,255,0.35)';

const bigNum: React.CSSProperties = {
  fontSize: '2.4rem',
  fontWeight: 800,
  color: gold,
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

const suiteCard: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  cursor: 'pointer',
  gap: '0.25rem',
};

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

function passRate(suite: TestSuite) {
  return ((suite.passed / suite.total) * 100).toFixed(1);
}

export default function App() {
  const [activeNav, setActiveNav] = useState<NavItem>('dashboard');
  const [modalSuite, setModalSuite] = useState<TestSuite | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [alertVisible, setAlertVisible] = useState(true);
  const clock = useClock();

  const handleSuiteClick = useCallback((suite: TestSuite) => {
    setModalSuite(suite);
  }, []);

  return (
    <EvaThemeProvider variant="nerv">
      <div className="app-root">
        <ScanlineOverlay opacity={0.03} animated fixed />

        <HexDashboard
          layout="masonry"
          cellSize={72}
          gap={6}
          atmosphere
          zones={{
            top: (
              <HudHeader scanlines>
                <HudHeader.Title subtitle="テスト司令センター">
                  TEST COMMAND CENTER
                </HudHeader.Title>
                <HudHeader.Status>
                  <span style={{ marginRight: '1.5rem', fontVariantNumeric: 'tabular-nums' }}>
                    <span style={{ opacity: 0.4, marginRight: '0.5rem', fontSize: '0.65rem' }}>CLOCK</span>
                    <span style={{ fontWeight: 700, letterSpacing: '0.08em' }}>{clock}</span>
                  </span>
                  <span style={{ marginRight: '1.5rem' }}>
                    <span style={{ opacity: 0.4, marginRight: '0.5rem', fontSize: '0.65rem' }}>PASS RATE</span>
                    <span style={{ color: 'var(--eva-hex-active, #0f0)', fontWeight: 700 }}>{metrics.passRate}%</span>
                  </span>
                  <span>
                    <span style={{ opacity: 0.4, marginRight: '0.5rem', fontSize: '0.65rem' }}>TESTS</span>
                    <span style={{ fontWeight: 700 }}>{metrics.totalTests}</span>
                  </span>
                </HudHeader.Status>
              </HudHeader>
            ),
            left: (
              <HudSidebar position="left" hazardAccent scanlines>
                <HudSidebar.Logo>EVA-QA</HudSidebar.Logo>
                <HudSidebar.Nav>
                  <HudSidebar.NavItem label="Dashboard" active={activeNav === 'dashboard'} onClick={() => setActiveNav('dashboard')} />
                  <HudSidebar.NavItem label="Test Suites" active={activeNav === 'suites'} onClick={() => setActiveNav('suites')} />
                  <HudSidebar.NavItem label="Test Runs" active={activeNav === 'runs'} onClick={() => setActiveNav('runs')} />
                  <HudSidebar.Section label="Analysis" />
                  <HudSidebar.NavItem label="Reports" active={activeNav === 'reports'} onClick={() => setActiveNav('reports')} />
                  <HudSidebar.NavItem label="Activity Log" onClick={() => setDrawerOpen(true)} />
                  <HudSidebar.Section label="System" />
                  <HudSidebar.NavItem label="Settings" active={activeNav === 'settings'} onClick={() => setActiveNav('settings')} />
                </HudSidebar.Nav>
                <HudSidebar.Footer>
                  <div style={{ fontSize: '0.55rem', opacity: 0.3, textAlign: 'center', lineHeight: 1.6 }}>
                    RUN #{metrics.totalRuns}<br />
                    v2.4.1
                  </div>
                </HudSidebar.Footer>
              </HudSidebar>
            ),
            overlay: alertVisible ? (
              <HudAlert
                severity="caution"
                title="FLAKY TESTS DETECTED"
                titleJa="不安定テスト検出"
                onDismiss={() => setAlertVisible(false)}
                autoDismiss={12000}
              >
                {flakyTests.length} flaky tests identified — highest failure rate: {flakyTests[0].flakyRate}%
              </HudAlert>
            ) : null,
          }}
        >

          {/* ═══ Priority 0: Hero Metrics (lg) ═══ */}
          <HexCell size="lg" priority={0}>
            <HudTooltip content={`Target: ${metrics.passTarget}%`}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                <div style={bigNum}>{metrics.passRate}%</div>
                <div style={cellLabel}>PASS RATE</div>
              </div>
            </HudTooltip>
          </HexCell>

          <HexCell size="lg" priority={0}>
            <HudTooltip content={`Target: ${metrics.totalTarget} tests`}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                <div style={bigNum}>{metrics.totalTests}</div>
                <div style={cellLabel}>TOTAL TESTS</div>
              </div>
            </HudTooltip>
          </HexCell>

          <HexCell size="lg" priority={0} state="warning">
            <HudTooltip content={`${metrics.failedTests} tests failed in the latest run`}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                <div style={{ ...bigNum, color: '#ff3b3b' }}>{metrics.failedTests}</div>
                <div style={cellLabel}>FAILED</div>
              </div>
            </HudTooltip>
          </HexCell>

          {/* ═══ Priority 1: MAGI Voting Panels (lg) ═══ */}
          <HexCell size="lg" priority={1}>
            <MagiPanel system="melchior" vote="approve" syncRate={94.7} label="AUTH SUITE" />
          </HexCell>

          <HexCell size="lg" priority={1}>
            <MagiPanel system="balthasar" vote="approve" syncRate={93.7} label="UI SUITE" />
          </HexCell>

          <HexCell size="lg" priority={1}>
            <MagiPanel system="caspar" vote="deny" syncRate={67.2} label="INTEG SUITE" />
          </HexCell>

          {/* ═══ Priority 2: Suite Summaries (lg, interactive) ═══ */}
          {testSuites.map((suite) => (
            <HexCell
              key={suite.id}
              size="lg"
              priority={2}
              state={suite.trend === 'down' ? 'warning' : 'active'}
              interactive
              onClick={() => handleSuiteClick(suite)}
            >
              <HudTooltip content={`${suite.passed}/${suite.total} passing — ${suite.duration}`}>
                <div style={suiteCard}>
                  <div style={{ fontSize: '0.55rem', letterSpacing: '0.12em', color: dim }}>{suite.nameJa}</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.06em' }}>{suite.name}</div>
                  <div style={{ ...bigNum, fontSize: '1.8rem' }}>{passRate(suite)}%</div>
                  <div style={{ fontSize: '0.55rem', color: dim }}>
                    {suite.passed} pass · {suite.failed} fail · {suite.skipped} skip
                  </div>
                </div>
              </HudTooltip>
            </HexCell>
          ))}

          {/* ═══ Priority 3: Secondary Info (md) ═══ */}
          <HexCell size="md" priority={3}>
            <HudTooltip content={flakyTests.map(f => `${f.name} (${f.flakyRate}%)`).join(', ')}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                <div style={{ ...bigNum, fontSize: '1.6rem', color: '#ffa500' }}>{metrics.flakyCount}</div>
                <div style={cellLabel}>FLAKY</div>
              </div>
            </HudTooltip>
          </HexCell>

          <HexCell size="md" priority={3}>
            <HudTooltip content={`Target: ${metrics.durationTarget}`}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                <div style={{ ...bigNum, fontSize: '1.2rem' }}>{metrics.avgDuration}</div>
                <div style={cellLabel}>AVG DURATION</div>
              </div>
            </HudTooltip>
          </HexCell>

          <HexCell size="md" priority={3}>
            <div className="countdown-wrapper">
              <CountdownTimer
                seconds={1423}
                format="mm:ss"
                label="次回テスト実行"
                labelSub="NEXT SCHEDULED RUN"
                warningThreshold={300}
                criticalThreshold={60}
                autoStart
              />
            </div>
          </HexCell>

          <HexCell size="md" priority={3}>
            <MagiConsole
              votes={{ melchior: 'approve', balthasar: 'approve', caspar: 'deny' }}
              syncRates={{ melchior: 94.7, balthasar: 93.7, caspar: 67.2 }}
              title="BUILD VERDICT"
              titleJa="ビルド判定"
            />
          </HexCell>

          <HexCell size="md" priority={3} state="warning">
            <WarningHex level="warning" label={`${metrics.failedTests} FAILED`} labelJa="失敗" />
          </HexCell>

          {/* ═══ Priority 4: Recent Result Status Dots (sm) ═══ */}
          {recentResults.map((r) => (
            <HexCell
              key={r.id}
              size="sm"
              priority={4}
              state={r.status === 'fail' ? 'warning' : r.status === 'pass' ? 'active' : 'default'}
            >
              <HudTooltip content={`${r.name} — ${r.duration}`}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  gap: '0.15rem',
                }}>
                  <div style={{
                    fontSize: '0.9rem',
                  }}>
                    {r.status === 'pass' ? '✓' : r.status === 'fail' ? '✗' : '—'}
                  </div>
                  <div style={{
                    fontSize: '0.4rem',
                    letterSpacing: '0.08em',
                    color: dim,
                    textAlign: 'center',
                    lineHeight: 1.2,
                    maxWidth: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    padding: '0 0.15rem',
                  }}>
                    {r.suite}
                  </div>
                </div>
              </HudTooltip>
            </HexCell>
          ))}

        </HexDashboard>

        {/* Overlays */}
        <SuiteModal suite={modalSuite} open={modalSuite !== null} onClose={() => setModalSuite(null)} />
        <ActivityDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      </div>
    </EvaThemeProvider>
  );
}
