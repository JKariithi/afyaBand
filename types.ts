export interface VitalReading {
  timestamp: number;
  heartRate: number; // bpm
  systolic: number; // mmHg
  diastolic: number; // mmHg
}

export interface HealthInsight {
  status: 'normal' | 'warning' | 'critical';
  summary: string;
  recommendation: string;
  timestamp: number;
}

export enum ConnectionStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  ERROR = 'ERROR'
}

export enum TabView {
  DASHBOARD = 'DASHBOARD',
  HISTORY = 'HISTORY',
  SETTINGS = 'SETTINGS'
}