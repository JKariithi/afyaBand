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
  riskScore?: number;
  factors?: string[];
  insights?: string;
  aiGenerated?: boolean;
}

export interface UserProfile {
  age?: number;
  gender?: 'male' | 'female' | 'other';
  bmi?: number;
  weight?: number;
  height?: number;
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
