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
  ScanlineOverlay,
} from 'eva-ui';

import { testSuites, metrics, flakyTests, activityLog } from './data/mockData';
import type { TestSuite } from './data/mockData';
import { TestSuiteCell } from './components/TestSuiteCell';
import { MetricCell } from './components/MetricCell';
import { SuiteModal } from './components/SuiteModal';
import { ActivityDrawer } from './components/ActivityDrawer';
import { ActivityFeedCell } from './components/ActivityFeedCell';

type NavItem = 'dashboard' | 'suites' | 'runs' | 'reports' | 'settings';

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
          cellSize={80}
          gap={7}
          gapDistribution="left"
          gapDistributionVertical="top"
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
          {/* ═══ ROW 0: Test Suite Cells (large) — hero row ═══ */}
          <HexCell col={0} row={0} size="lg" state="active" interactive onClick={() => handleSuiteClick(testSuites[0])}>
            <HudTooltip content={<span>API Tests — {testSuites[0].passed}/{testSuites[0].total} passing<br/>Duration: {testSuites[0].duration}</span>}>
              <div style={{ width: '100%', height: '100%' }}>
                <TestSuiteCell suite={testSuites[0]} onClick={handleSuiteClick} />
              </div>
            </HudTooltip>
          </HexCell>

          <HexCell col={3} row={0} size="lg" state="active" interactive onClick={() => handleSuiteClick(testSuites[1])}>
            <HudTooltip content={<span>UI Tests — {testSuites[1].passed}/{testSuites[1].total} passing<br/>Duration: {testSuites[1].duration}</span>}>
              <div style={{ width: '100%', height: '100%' }}>
                <TestSuiteCell suite={testSuites[1]} onClick={handleSuiteClick} />
              </div>
            </HudTooltip>
          </HexCell>

          <HexCell col={6} row={0} size="lg" state="warning" interactive onClick={() => handleSuiteClick(testSuites[2])}>
            <HudTooltip content={<span>Integration — {testSuites[2].passed}/{testSuites[2].total} passing<br/>Duration: {testSuites[2].duration}</span>}>
              <div style={{ width: '100%', height: '100%' }}>
                <TestSuiteCell suite={testSuites[2]} onClick={handleSuiteClick} />
              </div>
            </HudTooltip>
          </HexCell>

          {/* ═══ ROW 2: Metric Cells (medium) ═══ */}
          <HexCell col={0} row={2} size="md">
            <HudTooltip content={`Target: ${metrics.totalTarget} tests`}>
              <div style={{ width: '100%', height: '100%' }}>
                <MetricCell
                  label="TOTAL TESTS"
                  labelJa="テスト総数"
                  value={metrics.totalTests}
                  accent="default"
                  progress={(metrics.totalTests / metrics.totalTarget) * 100}
                />
              </div>
            </HudTooltip>
          </HexCell>

          <HexCell col={2} row={2} size="md">
            <HudTooltip content={`Target: ${metrics.passTarget}%`}>
              <div style={{ width: '100%', height: '100%' }}>
                <MetricCell
                  label="PASS RATE"
                  labelJa="合格率"
                  value={metrics.passRate}
                  unit="%"
                  accent="success"
                  progress={(metrics.passRate / metrics.passTarget) * 100}
                />
              </div>
            </HudTooltip>
          </HexCell>

          <HexCell col={4} row={2} size="md">
            <HudTooltip content={`Target: ${metrics.durationTarget}`}>
              <div style={{ width: '100%', height: '100%' }}>
                <MetricCell label="AVG DURATION" labelJa="平均時間" value={metrics.avgDuration} accent="default" />
              </div>
            </HudTooltip>
          </HexCell>

          <HexCell col={6} row={2} size="md">
            <HudTooltip content={flakyTests.map(f => `${f.name} (${f.flakyRate}%)`).join(', ')}>
              <div style={{ width: '100%', height: '100%' }}>
                <MetricCell label="FLAKY TESTS" labelJa="不安定テスト" value={metrics.flakyCount} accent="warn" />
              </div>
            </HudTooltip>
          </HexCell>

          <HexCell col={8} row={2} size="md">
            <HudTooltip content={`${metrics.failedTests} tests failed in the latest run`}>
              <div style={{ width: '100%', height: '100%' }}>
                <MetricCell label="FAILED" labelJa="失敗" value={metrics.failedTests} accent="danger" />
              </div>
            </HudTooltip>
          </HexCell>

          {/* ═══ ROW 3: MAGI Voting Panels + Console + Countdown ═══ */}
          <HexCell col={0} row={3} size="md">
            <MagiPanel system="melchior" vote="approve" syncRate={94.7} label="AUTH SUITE" />
          </HexCell>

          <HexCell col={2} row={3} size="md">
            <MagiPanel system="balthasar" vote="approve" syncRate={93.7} label="UI SUITE" />
          </HexCell>

          <HexCell col={4} row={3} size="md">
            <MagiPanel system="caspar" vote="deny" syncRate={67.2} label="INTEG SUITE" />
          </HexCell>

          <HexCell col={6} row={3} size="md">
            <MagiConsole
              votes={{ melchior: 'approve', balthasar: 'approve', caspar: 'deny' }}
              syncRates={{ melchior: 94.7, balthasar: 93.7, caspar: 67.2 }}
              title="BUILD VERDICT"
              titleJa="ビルド判定"
            />
          </HexCell>

          <HexCell col={8} row={3} size="md">
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

          {/* ═══ ROW 4: Activity Feed ═══ */}
          <HexCell col={0} row={4} size="lg" interactive onClick={() => setDrawerOpen(true)}>
            <div className="activity-feed-wrapper">
              <ActivityFeedCell entries={activityLog} />
            </div>
          </HexCell>
        </HexDashboard>

        {/* Overlays */}
        <SuiteModal suite={modalSuite} open={modalSuite !== null} onClose={() => setModalSuite(null)} />
        <ActivityDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      </div>
    </EvaThemeProvider>
  );
}
