# Eva-UI Demo — TestRail Dashboard

## What This Is
A showcase demo app for the Eva-UI component library. It's a TestRail-style test management dashboard built entirely with Eva-UI components. No backend — all mock data. Deployed to GitHub Pages.

## Purpose
Demonstrate that Eva-UI can build a real, functional dashboard with:
- HexDashboard layout with zones (sidebar, header, content)
- HexCells of different sizes containing real content
- All HUD chrome components in use (header, sidebar, modal, drawer, alerts, tooltips)
- Eva-specific components (MagiPanel as test suite status, WarningHex for failures, CountdownTimer for deadlines)
- Theme system working end-to-end

## Tech Stack
- React 18 + TypeScript + Vite
- Eva-UI (local dependency: `../eva-ui`)
- No router needed — single page dashboard
- No backend — hardcoded mock data
- Deploy to GitHub Pages

## Design
The dashboard should look like a NERV command center monitoring test suites instead of Eva units:

### Layout
- **HexDashboard** fills the viewport
- **Top zone (HudHeader):** "TEST COMMAND CENTER" with Japanese subtitle, system status showing "XX% PASS RATE"
- **Left zone (HudSidebar):** Navigation — Dashboard, Test Suites, Test Runs, Reports, Settings
- **Grid interior:** Mix of hex cells showing:
  - 3 large cells (lg): Test suite status panels styled like MagiPanel (e.g., "API Tests: 142/150 PASS", "UI Tests: 89/95 PASS", "Integration: 67/80 PASS")
  - Medium cells: Key metrics (total tests, pass rate %, avg duration, flaky test count)
  - Small cells: Recent test results (pass/fail indicators)
  - 1-2 WarningHex cells for failing suites
  - 1 CountdownTimer for "Next scheduled run"
- **Overlay zone:** A HudAlert showing "3 FLAKY TESTS DETECTED" (caution severity)

### Mock Data
Hardcode realistic test data:
- 3 test suites (API, UI, Integration) with pass/fail/skip counts
- Recent test runs with timestamps and results
- Metrics: total tests ~325, pass rate ~91.7%, avg duration 4m 23s
- A couple of flaky tests flagged

### Interactions
- Clicking a test suite cell opens a HudModal with suite details
- Sidebar nav items highlight on click (can just swap active state, no routing)
- HudDrawer opens from right with "Recent Activity" log when clicking a cell
- HudTooltip on hover over metric cells showing breakdown

## Build & Deploy
```bash
npm run build           # Vite build
npm run deploy          # gh-pages to GitHub Pages
```

## File Structure
```
src/
  App.tsx               # Main app — HexDashboard with all zones
  data/
    mockData.ts         # All hardcoded test data
  components/
    TestSuiteCell.tsx    # Large hex cell for a test suite (like MagiPanel)
    MetricCell.tsx       # Medium hex cell for a key metric
    ResultCell.tsx       # Small hex cell for pass/fail indicator
    SuiteModal.tsx       # HudModal with suite details
    ActivityDrawer.tsx   # HudDrawer with recent activity
  main.tsx              # Entry point
  index.css             # Minimal global styles
```
