export type DeviceType = 'Temperature' | 'Pressure' | 'Voltage';
export type DeviceStatus = 'Normal' | 'Warning' | 'Critical';
export type EventLevel = 'INFO' | 'WARNING' | 'CRITICAL';

export interface SensorData {
  deviceId: string;
  type: DeviceType;
  value: number;
  unit: string;
  timestamp: number;
  status: DeviceStatus;
  version: number;
}

export interface FaultEvent {
  id: string;
  version: number;
  deviceId: string;
  type: string;
  level: EventLevel;
  source: string;
  message: string;
  timestamp: number;
  acknowledged?: boolean;
}

export interface SystemState {
  devices: SensorData[];
  faults: FaultEvent[];
  uptime: number;
}
