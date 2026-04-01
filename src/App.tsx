import { useState, useCallback } from 'react';
import {
  EvaThemeProvider,
  HexDashboard,
  HexCell,
  HudHeader,
  HudSidebar,
  HudAlert,
  HudTooltip,
  MagiPanel,
  WarningHex,
  CountdownTimer,
  HazardStripes,
  ScanlineOverlay,
} from 'eva-ui';

import { testSuites, metrics, recentResults, flakyTests } from './data/mockData';
import type { TestSuite, TestResult } from './data/mockData';
import { TestSuiteCell } from './components/TestSuiteCell';
import { MetricCell } from './components/MetricCell';
import { ResultCell } from './components/ResultCell';
import { SuiteModal } from './components/SuiteModal';
import { ActivityDrawer } from './components/ActivityDrawer';

type NavItem = 'dashboard' | 'suites' | 'runs' | 'reports' | 'settings';

export default function App() {
  const [activeNav, setActiveNav] = useState<NavItem>('dashboard');
  const [modalSuite, setModalSuite] = useState<TestSuite | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [alertVisible, setAlertVisible] = useState(true);

  const handleSuiteClick = useCallback((suite: TestSuite) => {
    setModalSuite(suite);
  }, []);

  const handleResultClick = useCallback((_result: TestResult) => {
    setDrawerOpen(true);
  }, []);

  return (
    <EvaThemeProvider variant="nerv">
      <div className="app-root">
        <ScanlineOverlay opacity={0.03} animated fixed />

        <HexDashboard
          cellSize={44}
          gap={4}
          gapDistribution="left"
          gapDistributionVertical="top"
          zones={{
            top: (
              <HudHeader>
                <HudHeader.Title subtitle="テスト司令センター">
                  TEST COMMAND CENTER
                </HudHeader.Title>
                <HudHeader.Status>
                  <span style={{ marginRight: '1.5rem' }}>
                    <span style={{ opacity: 0.5, marginRight: '0.5rem' }}>PASS RATE</span>
                    <span style={{ color: 'var(--eva-hex-active, #0f0)', fontWeight: 700 }}>{metrics.passRate}%</span>
                  </span>
                  <span>
                    <span style={{ opacity: 0.5, marginRight: '0.5rem' }}>TESTS</span>
                    <span style={{ fontWeight: 700 }}>{metrics.totalTests}</span>
                  </span>
                </HudHeader.Status>
              </HudHeader>
            ),
            left: (
              <HudSidebar position="left" hazardAccent>
                <HudSidebar.Logo>EVA-QA</HudSidebar.Logo>
                <HudSidebar.Nav>
                  <HudSidebar.NavItem label="Dashboard" active={activeNav === 'dashboard'} onClick={() => setActiveNav('dashboard')} />
                  <HudSidebar.NavItem label="Test Suites" active={activeNav === 'suites'} onClick={() => setActiveNav('suites')} />
                  <HudSidebar.NavItem label="Test Runs" active={activeNav === 'runs'} onClick={() => setActiveNav('runs')} />
                  <HudSidebar.NavItem label="Reports" active={activeNav === 'reports'} onClick={() => setActiveNav('reports')} />
                  <HudSidebar.Section label="System" />
                  <HudSidebar.NavItem label="Settings" active={activeNav === 'settings'} onClick={() => setActiveNav('settings')} />
                </HudSidebar.Nav>
                <HudSidebar.Footer>
                  <div style={{ fontSize: '0.6rem', opacity: 0.3, textAlign: 'center' }}>
                    RUN #{metrics.totalRuns}
                    <br />
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
          {/* Row 0: Three test suite cells (large) styled as MagiPanels */}
          <HexCell col={0} row={0} size="lg" state="active" interactive onClick={() => handleSuiteClick(testSuites[0])}>
            <HudTooltip content={<span>API Tests — {testSuites[0].passed}/{testSuites[0].total} passing<br/>Duration: {testSuites[0].duration}</span>}>
              <div style={{ width: '100%', height: '100%' }}>
                <TestSuiteCell suite={testSuites[0]} onClick={handleSuiteClick} />
              </div>
            </HudTooltip>
          </HexCell>

          <HexCell col={2} row={0} size="lg" state="active" interactive onClick={() => handleSuiteClick(testSuites[1])}>
            <HudTooltip content={<span>UI Tests — {testSuites[1].passed}/{testSuites[1].total} passing<br/>Duration: {testSuites[1].duration}</span>}>
              <div style={{ width: '100%', height: '100%' }}>
                <TestSuiteCell suite={testSuites[1]} onClick={handleSuiteClick} />
              </div>
            </HudTooltip>
          </HexCell>

          <HexCell col={4} row={0} size="lg" state="warning" interactive onClick={() => handleSuiteClick(testSuites[2])}>
            <HudTooltip content={<span>Integration Tests — {testSuites[2].passed}/{testSuites[2].total} passing<br/>Duration: {testSuites[2].duration}</span>}>
              <div style={{ width: '100%', height: '100%' }}>
                <TestSuiteCell suite={testSuites[2]} onClick={handleSuiteClick} />
              </div>
            </HudTooltip>
          </HexCell>

          {/* Row 2: Metric cells (medium) */}
          <HexCell col={0} row={2} size="md">
            <HudTooltip content="Total across all 3 suites">
              <div style={{ width: '100%', height: '100%' }}>
                <MetricCell label="TOTAL TESTS" labelJa="テスト総数" value={metrics.totalTests} accent="default" />
              </div>
            </HudTooltip>
          </HexCell>

          <HexCell col={1} row={2} size="md">
            <HudTooltip content="Percentage of tests passing across all suites">
              <div style={{ width: '100%', height: '100%' }}>
                <MetricCell label="PASS RATE" labelJa="合格率" value={metrics.passRate} unit="%" accent="success" />
              </div>
            </HudTooltip>
          </HexCell>

          <HexCell col={2} row={2} size="md">
            <HudTooltip content="Average test suite execution time">
              <div style={{ width: '100%', height: '100%' }}>
                <MetricCell label="AVG DURATION" labelJa="平均時間" value={metrics.avgDuration} accent="default" />
              </div>
            </HudTooltip>
          </HexCell>

          <HexCell col={3} row={2} size="md">
            <HudTooltip content={flakyTests.map(f => `${f.name} (${f.flakyRate}%)`).join(', ')}>
              <div style={{ width: '100%', height: '100%' }}>
                <MetricCell label="FLAKY TESTS" labelJa="不安定テスト" value={metrics.flakyCount} accent="warn" />
              </div>
            </HudTooltip>
          </HexCell>

          <HexCell col={4} row={2} size="md">
            <HudTooltip content={`${metrics.failedTests} tests failed in the latest run`}>
              <div style={{ width: '100%', height: '100%' }}>
                <MetricCell label="FAILED" labelJa="失敗" value={metrics.failedTests} accent="danger" />
              </div>
            </HudTooltip>
          </HexCell>

          {/* Row 3: Recent results (small cells) */}
          {recentResults.slice(0, 5).map((result, i) => (
            <HexCell key={result.id} col={i} row={3} size="sm" interactive onClick={() => handleResultClick(result)}>
              <ResultCell result={result} onClick={handleResultClick} />
            </HexCell>
          ))}

          {/* Row 4: MAGI panels + Warning + Countdown */}
          <HexCell col={0} row={4} size="lg">
            <MagiPanel
              system="melchior"
              vote="approve"
              syncRate={94.7}
              label="API SUITE"
            />
          </HexCell>

          <HexCell col={2} row={4} size="md" state="warning">
            <WarningHex level="warning" label="INTEGRATION" labelJa="統合テスト">
              <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>10</div>
            </WarningHex>
          </HexCell>

          <HexCell col={3} row={4} size="md">
            <WarningHex level="caution" label="FLAKY" labelJa="不安定">
              <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>3</div>
            </WarningHex>
          </HexCell>

          <HexCell col={4} row={4} size="lg">
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

          {/* Row 6: More results + activity trigger */}
          {recentResults.slice(5).map((result, i) => (
            <HexCell key={result.id} col={i} row={6} size="sm" interactive onClick={() => handleResultClick(result)}>
              <ResultCell result={result} onClick={handleResultClick} />
            </HexCell>
          ))}

          <HexCell col={3} row={6} size="md" interactive onClick={() => setDrawerOpen(true)}>
            <div className="activity-trigger">
              <HazardStripes height={2} animated speed={10} />
              <div className="activity-trigger__label">VIEW ACTIVITY</div>
              <div className="activity-trigger__label-ja">アクティビティ表示</div>
              <div className="activity-trigger__count">{metrics.totalRuns} runs</div>
            </div>
          </HexCell>

          <HexCell col={4} row={6} size="md">
            <MagiPanel
              system="caspar"
              vote="deny"
              syncRate={67.2}
              label="INTEG SUITE"
            />
          </HexCell>
        </HexDashboard>

        {/* Overlays */}
        <SuiteModal suite={modalSuite} open={modalSuite !== null} onClose={() => setModalSuite(null)} />
        <ActivityDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      </div>
    </EvaThemeProvider>
  );
}
