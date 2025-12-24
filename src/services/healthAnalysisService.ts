import { VitalReading, HealthInsight } from '@/types';

/**
 * Simulated health analysis service
 * In production, this would call a backend API with AI capabilities
 */
export const analyzeVitals = async (recentReadings: VitalReading[]): Promise<HealthInsight> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (recentReadings.length === 0) {
    return {
      status: 'normal',
      summary: 'No readings available yet.',
      recommendation: 'Connect your wristband to start monitoring.',
      timestamp: Date.now()
    };
  }

  // Calculate averages from recent readings
  const avgHR = recentReadings.reduce((sum, r) => sum + r.heartRate, 0) / recentReadings.length;
  const avgSys = recentReadings.reduce((sum, r) => sum + r.systolic, 0) / recentReadings.length;
  const avgDia = recentReadings.reduce((sum, r) => sum + r.diastolic, 0) / recentReadings.length;

  // Determine status based on readings
  let status: 'normal' | 'warning' | 'critical' = 'normal';
  let summary = '';
  let recommendation = '';

  // Blood pressure analysis
  if (avgSys >= 180 || avgDia >= 120) {
    status = 'critical';
    summary = 'Blood pressure is critically elevated. Immediate attention recommended.';
    recommendation = 'Stop physical activity, sit or lie down, and contact a healthcare provider immediately.';
  } else if (avgSys >= 140 || avgDia >= 90) {
    status = 'warning';
    summary = 'Blood pressure is elevated above normal range.';
    recommendation = 'Consider resting and avoiding caffeine. Monitor closely and consult a doctor if persistent.';
  } else if (avgSys < 90 || avgDia < 60) {
    status = 'warning';
    summary = 'Blood pressure appears lower than typical range.';
    recommendation = 'Stay hydrated and avoid standing up too quickly. Consult a doctor if you feel dizzy.';
  }

  // Heart rate analysis
  if (avgHR > 100) {
    if (status === 'normal') {
      status = 'warning';
      summary = 'Heart rate is elevated above resting range.';
      recommendation = 'If not exercising, consider relaxation techniques. Stay hydrated.';
    }
  } else if (avgHR < 50) {
    if (status === 'normal') {
      status = 'warning';
      summary = 'Heart rate is lower than typical resting range.';
      recommendation = 'This may be normal for athletes, but consult a doctor if you experience symptoms.';
    }
  }

  // Default normal status
  if (status === 'normal') {
    summary = 'All vital signs are within healthy ranges. Your cardiovascular metrics look stable.';
    recommendation = 'Continue your healthy lifestyle. Stay active and maintain proper hydration.';
  }

  return {
    status,
    summary,
    recommendation,
    timestamp: Date.now()
  };
};
