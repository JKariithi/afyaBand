import { VitalReading } from '@/shared/types';

/**
 * Simulates a continuous stream of data from a hardware device.
 * In a real backend, this would likely be a WebSocket connection or MQTT subscription.
 */
export class MockWristbandService {
  private intervalId: number | null = null;
  private listeners: ((data: VitalReading) => void)[] = [];

  // Base vitals for simulation
  private currentHR = 72;
  private currentSys = 120;
  private currentDia = 80;

  // Simulate device connection
  connect(onData: (data: VitalReading) => void): void {
    this.listeners.push(onData);

    if (this.intervalId) return;

    this.intervalId = window.setInterval(() => {
      this.generateReading();
    }, 1000); // 1Hz sample rate
  }

  disconnect(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.listeners = [];
  }

  private generateReading() {
    // Add random noise to simulate real sensor data
    const hrNoise = Math.floor(Math.random() * 5) - 2;
    const sysNoise = Math.floor(Math.random() * 4) - 2;
    const diaNoise = Math.floor(Math.random() * 3) - 1;

    // Randomly drift the baseline to simulate activity changes or stress
    if (Math.random() > 0.9) this.currentHR += (Math.random() > 0.5 ? 2 : -2);
    if (Math.random() > 0.95) this.currentSys += (Math.random() > 0.5 ? 2 : -2);
    if (Math.random() > 0.95) this.currentDia += (Math.random() > 0.5 ? 1 : -1);

    // Clamp values to realistic physiological limits
    this.currentHR = Math.max(45, Math.min(180, this.currentHR + hrNoise));
    this.currentSys = Math.max(90, Math.min(190, this.currentSys + sysNoise));
    this.currentDia = Math.max(60, Math.min(120, this.currentDia + diaNoise));

    const reading: VitalReading = {
      timestamp: Date.now(),
      heartRate: Math.round(this.currentHR),
      systolic: Math.round(this.currentSys),
      diastolic: Math.round(this.currentDia)
    };

    this.notifyListeners(reading);
  }

  private notifyListeners(data: VitalReading) {
    this.listeners.forEach(listener => listener(data));
  }
}

export const deviceService = new MockWristbandService();
