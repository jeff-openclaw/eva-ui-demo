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
  runHistory: ('pass' | 'fail' | 'mixed')[];
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
    lastRun: '08:30:00',
    trend: 'up',
    runHistory: ['pass', 'pass', 'pass', 'mixed', 'pass', 'pass', 'fail', 'pass', 'pass', 'pass'],
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
    lastRun: '08:30:00',
    trend: 'stable',
    runHistory: ['pass', 'pass', 'mixed', 'pass', 'pass', 'pass', 'pass', 'mixed', 'pass', 'pass'],
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
    lastRun: '08:30:00',
    trend: 'down',
    runHistory: ['mixed', 'fail', 'pass', 'fail', 'mixed', 'pass', 'fail', 'mixed', 'fail', 'mixed'],
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
  { id: 'a01', type: 'run_complete', message: 'Test run #1247 completed — 298/325 passed', timestamp: '08:30:15', severity: 'info' },
  { id: 'a02', type: 'test_failed', message: 'FAIL  POST /orders timeout — exceeded 5s threshold', timestamp: '08:29:55', severity: 'warning' },
  { id: 'a03', type: 'test_failed', message: 'FAIL  DB migration check — schema mismatch on users table', timestamp: '08:29:42', severity: 'critical' },
  { id: 'a04', type: 'flaky_detected', message: 'FLAKY WebSocket reconnect — 23% failure rate over 50 runs', timestamp: '08:15:00', severity: 'caution' },
  { id: 'a05', type: 'run_complete', message: 'Test run #1246 completed — 301/325 passed', timestamp: '08:10:22', severity: 'info' },
  { id: 'a06', type: 'test_failed', message: 'FAIL  File upload race condition — intermittent 500', timestamp: '08:05:11', severity: 'warning' },
  { id: 'a07', type: 'suite_added', message: 'NEW   PATCH /users/:id added to API suite', timestamp: '07:00:00', severity: 'info' },
  { id: 'a08', type: 'config_changed', message: 'CFG   Timeout threshold updated: 3s → 5s for integration', timestamp: '06:45:00', severity: 'info' },
  { id: 'a09', type: 'run_complete', message: 'Test run #1245 completed — 305/325 passed', timestamp: '06:30:00', severity: 'info' },
  { id: 'a10', type: 'flaky_detected', message: 'FLAKY File upload race — 15% failure rate over 40 runs', timestamp: '05:45:00', severity: 'caution' },
  { id: 'a11', type: 'run_complete', message: 'Test run #1244 completed — 310/325 passed', timestamp: '04:30:00', severity: 'info' },
  { id: 'a12', type: 'test_failed', message: 'FAIL  Animation timing assert — off by 32ms', timestamp: '04:22:18', severity: 'warning' },
  { id: 'a13', type: 'config_changed', message: 'CFG   Parallel workers increased: 4 → 8', timestamp: '03:00:00', severity: 'info' },
  { id: 'a14', type: 'run_complete', message: 'Test run #1243 completed — 312/325 passed', timestamp: '02:30:00', severity: 'info' },
  { id: 'a15', type: 'suite_added', message: 'NEW   WebSocket reconnect stress test added', timestamp: '01:15:00', severity: 'info' },
  { id: 'a16', type: 'run_complete', message: 'Test run #1242 completed — 308/325 passed', timestamp: '00:30:00', severity: 'info' },
];

// Aggregate metrics
export const metrics = {
  totalTests: 325,
  passRate: 91.7,
  avgDuration: '4m 23s',
  flakyCount: 3,
  totalRuns: 1247,
  failedTests: 19,
  passTarget: 95,
  totalTarget: 400,
  durationTarget: '3m 00s',
};
