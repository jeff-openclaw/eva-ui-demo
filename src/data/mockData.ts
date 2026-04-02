// NERV Operations Dashboard — Mock Data

export interface EvaUnit {
  id: string;
  name: string;
  nameJa: string;
  pilot: string;
  pilotJa: string;
  status: 'active' | 'standby' | 'engaged' | 'offline';
  syncRate: number;
  powerRemaining: number; // seconds
  damage: number; // percentage
  atFieldStrength: number;
  weapons: string[];
  armor: string;
  notes: string;
}

export interface SystemStatus {
  id: string;
  name: string;
  operational: boolean;
}

export interface MagiVote {
  system: 'melchior' | 'balthasar' | 'caspar';
  vote: 'approve' | 'deny';
  label: string;
  labelJa: string;
  confidence: number;
}

export interface OperationLogEntry {
  id: string;
  type: 'deploy' | 'alert' | 'damage' | 'system' | 'comms' | 'magi';
  message: string;
  timestamp: string;
  severity: 'info' | 'caution' | 'warning' | 'critical';
}

export const evaUnits: EvaUnit[] = [
  {
    id: 'eva-01',
    name: 'EVA-01',
    nameJa: '初号機',
    pilot: 'Shinji Ikari',
    pilotJa: '碇シンジ',
    status: 'active',
    syncRate: 94.2,
    powerRemaining: 272, // 4:32
    damage: 7,
    atFieldStrength: 91.4,
    weapons: ['Progressive Knife', 'Pallet Rifle'],
    armor: 'Type-D Equipment',
    notes: 'Primary combat unit. Sync rate stable.',
  },
  {
    id: 'eva-00',
    name: 'EVA-00',
    nameJa: '零号機',
    pilot: 'Rei Ayanami',
    pilotJa: '綾波レイ',
    status: 'standby',
    syncRate: 99.1,
    powerRemaining: 300, // 5:00
    damage: 0,
    atFieldStrength: 95.0,
    weapons: ['Positron Rifle', 'Shield'],
    armor: 'Standard',
    notes: 'Reserve unit. Ready for deployment.',
  },
  {
    id: 'eva-02',
    name: 'EVA-02',
    nameJa: '弐号機',
    pilot: 'Asuka Langley',
    pilotJa: '惣流・アスカ・ラングレー',
    status: 'engaged',
    syncRate: 78.4,
    powerRemaining: 147, // 2:27
    damage: 23,
    atFieldStrength: 72.1,
    weapons: ['Sonic Glaive', 'Spike Launcher'],
    armor: 'Type-B Equipment',
    notes: 'Under heavy fire. Left arm armor compromised.',
  },
];

export const magiVotes: MagiVote[] = [
  { system: 'melchior', vote: 'approve', label: 'TACTICAL ASSESSMENT', labelJa: '戦術評価', confidence: 94.7 },
  { system: 'balthasar', vote: 'approve', label: 'THREAT ANALYSIS', labelJa: '脅威分析', confidence: 91.2 },
  { system: 'caspar', vote: 'deny', label: 'RISK CALCULATION', labelJa: 'リスク計算', confidence: 67.8 },
];

export const systemStatuses: SystemStatus[] = [
  { id: 'comms', name: 'COMMS', operational: true },
  { id: 'weapons', name: 'WEAPONS', operational: true },
  { id: 'umbilical', name: 'UMBILICAL', operational: false },
  { id: 'shields', name: 'SHIELDS', operational: true },
  { id: 'ejection', name: 'EJECTION', operational: true },
  { id: 's2-engine', name: 'S² ENGINE', operational: true },
];

export const operationLog: OperationLogEntry[] = [
  { id: 'op01', type: 'alert', message: 'PATTERN BLUE confirmed — Angel classification: 7th', timestamp: '13:42:08', severity: 'critical' },
  { id: 'op02', type: 'deploy', message: 'EVA-01 launched — Pilot Ikari engaged', timestamp: '13:42:15', severity: 'info' },
  { id: 'op03', type: 'deploy', message: 'EVA-02 launched — Pilot Langley engaged', timestamp: '13:42:18', severity: 'info' },
  { id: 'op04', type: 'magi', message: 'MAGI operation vote: APPROVED (2-1) — CASPAR dissent logged', timestamp: '13:42:22', severity: 'caution' },
  { id: 'op05', type: 'system', message: 'Umbilical cable severed — EVA-02 on internal power', timestamp: '13:43:01', severity: 'warning' },
  { id: 'op06', type: 'comms', message: 'AT Field interference detected — adjusting comms frequency', timestamp: '13:43:15', severity: 'caution' },
  { id: 'op07', type: 'damage', message: 'EVA-02 hit — left arm armor compromised (23% total damage)', timestamp: '13:43:42', severity: 'warning' },
  { id: 'op08', type: 'system', message: 'AT Field neutralization at 72.1% — Angel barrier weakening', timestamp: '13:44:01', severity: 'info' },
  { id: 'op09', type: 'comms', message: 'Pilot Langley sync rate dropping — 78.4% and falling', timestamp: '13:44:18', severity: 'caution' },
  { id: 'op10', type: 'system', message: 'EVA-00 on standby — deployment authorized if needed', timestamp: '13:44:30', severity: 'info' },
  { id: 'op11', type: 'alert', message: 'Angel accelerating — distance closing: 2.4km', timestamp: '13:44:45', severity: 'warning' },
  { id: 'op12', type: 'magi', message: 'CASPAR recommends tactical retreat — overruled by command', timestamp: '13:45:02', severity: 'caution' },
  { id: 'op13', type: 'damage', message: 'EVA-01 minor damage — 7% — pilot unharmed', timestamp: '13:45:15', severity: 'info' },
  { id: 'op14', type: 'system', message: 'Power alert: EVA-02 below 3 minutes internal power', timestamp: '13:45:30', severity: 'warning' },
  { id: 'op15', type: 'comms', message: 'Command: All units maintain formation. EVA-00 prepare for launch.', timestamp: '13:45:45', severity: 'info' },
  { id: 'op16', type: 'alert', message: 'Angel core detected — coordinates transmitted to all units', timestamp: '13:46:00', severity: 'critical' },
];

export interface PilotRosterEntry {
  pilot: string;
  unit: string;
  sync: number;
  status: 'active' | 'standby' | 'engaged' | 'offline';
}

export const pilotRoster: PilotRosterEntry[] = [
  { pilot: 'Ikari', unit: '01', sync: 94.2, status: 'active' },
  { pilot: 'Ayanami', unit: '00', sync: 99.1, status: 'standby' },
  { pilot: 'Langley', unit: '02', sync: 78.4, status: 'engaged' },
];

// Aggregate metrics
export const metrics = {
  atFieldStrength: 87.3,
  avgSyncRate: 90.6,
  angelDistance: 2.4,
  totalDamage: 23,
  operationTime: '00:03:52',
  condition: 'RED' as const,
};
