// Mock data for TestRail-style dashboard

export interface TestSuite {
  id: string;
  name: string;
  nameJa: string;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: string;
  lastRun: string;
  trend: 'up' | 'down' | 'stable';
}

export interface TestResult {
  id: string;
  name: string;
  suite: string;
  status: 'pass' | 'fail' | 'skip';
  duration: string;
  timestamp: string;
}

export interface FlakyTest {
  id: string;
  name: string;
  suite: string;
  flakyRate: number;
  lastFlake: string;
}

export interface ActivityEntry {
  id: string;
  type: 'run_complete' | 'test_failed' | 'suite_added' | 'flaky_detected' | 'config_changed';
  message: string;
  timestamp: string;
  severity: 'info' | 'caution' | 'warning' | 'critical';
}

export const testSuites: TestSuite[] = [
  {
    id: 'api',
    name: 'API Tests',
    nameJa: 'API テスト',
    total: 150,
    passed: 142,
    failed: 5,
    skipped: 3,
    duration: '3m 47s',
    lastRun: '2026-04-01T08:30:00Z',
    trend: 'up',
  },
  {
    id: 'ui',
    name: 'UI Tests',
    nameJa: 'UI テスト',
    total: 95,
    passed: 89,
    failed: 4,
    skipped: 2,
    duration: '5m 12s',
    lastRun: '2026-04-01T08:30:00Z',
    trend: 'stable',
  },
  {
    id: 'integration',
    name: 'Integration Tests',
    nameJa: '統合テスト',
    total: 80,
    passed: 67,
    failed: 10,
    skipped: 3,
    duration: '4m 10s',
    lastRun: '2026-04-01T08:30:00Z',
    trend: 'down',
  },
];

export const recentResults: TestResult[] = [
  { id: 'r1', name: 'GET /users returns 200', suite: 'API', status: 'pass', duration: '120ms', timestamp: '08:30:12' },
  { id: 'r2', name: 'Login form validation', suite: 'UI', status: 'pass', duration: '1.4s', timestamp: '08:30:08' },
  { id: 'r3', name: 'POST /orders timeout', suite: 'API', status: 'fail', duration: '5.0s', timestamp: '08:29:55' },
  { id: 'r4', name: 'Dashboard renders', suite: 'UI', status: 'pass', duration: '890ms', timestamp: '08:29:50' },
  { id: 'r5', name: 'DB migration check', suite: 'Integration', status: 'fail', duration: '3.2s', timestamp: '08:29:42' },
  { id: 'r6', name: 'Auth token refresh', suite: 'API', status: 'pass', duration: '210ms', timestamp: '08:29:38' },
  { id: 'r7', name: 'Sidebar navigation', suite: 'UI', status: 'skip', duration: '—', timestamp: '08:29:30' },
  { id: 'r8', name: 'Cache invalidation', suite: 'Integration', status: 'pass', duration: '1.8s', timestamp: '08:29:25' },
];

export const flakyTests: FlakyTest[] = [
  { id: 'f1', name: 'WebSocket reconnect', suite: 'Integration', flakyRate: 23, lastFlake: '08:15:00' },
  { id: 'f2', name: 'File upload race', suite: 'API', flakyRate: 15, lastFlake: '07:45:00' },
  { id: 'f3', name: 'Animation timing', suite: 'UI', flakyRate: 11, lastFlake: '08:22:00' },
];

export const activityLog: ActivityEntry[] = [
  { id: 'a1', type: 'run_complete', message: 'Test run #1247 completed — 298/325 passed', timestamp: '08:30:15', severity: 'info' },
  { id: 'a2', type: 'flaky_detected', message: 'Flaky test detected: WebSocket reconnect (23% failure rate)', timestamp: '08:15:00', severity: 'caution' },
  { id: 'a3', type: 'test_failed', message: 'POST /orders timeout — exceeded 5s threshold', timestamp: '08:29:55', severity: 'warning' },
  { id: 'a4', type: 'test_failed', message: 'DB migration check failed — schema mismatch', timestamp: '08:29:42', severity: 'critical' },
  { id: 'a5', type: 'suite_added', message: 'New test added to API suite: PATCH /users/:id', timestamp: '07:00:00', severity: 'info' },
  { id: 'a6', type: 'config_changed', message: 'Timeout threshold updated: 3s → 5s for integration tests', timestamp: '06:45:00', severity: 'info' },
  { id: 'a7', type: 'run_complete', message: 'Test run #1246 completed — 301/325 passed', timestamp: '06:30:00', severity: 'info' },
  { id: 'a8', type: 'flaky_detected', message: 'Flaky test detected: File upload race (15% failure rate)', timestamp: '05:45:00', severity: 'caution' },
];

// Aggregate metrics
export const metrics = {
  totalTests: 325,
  passRate: 91.7,
  avgDuration: '4m 23s',
  flakyCount: 3,
  totalRuns: 1247,
  failedTests: 19,
};
