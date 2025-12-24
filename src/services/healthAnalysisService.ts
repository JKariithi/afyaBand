import { VitalReading, HealthInsight, UserProfile } from '@/types';
import { supabase } from '@/integrations/supabase/client';

/**
 * AI-powered health analysis service
 * Uses Lovable AI via edge function for intelligent hypertension risk assessment
 */
export const analyzeVitals = async (
  recentReadings: VitalReading[], 
  userProfile?: UserProfile
): Promise<HealthInsight> => {
  if (recentReadings.length === 0) {
    return {
      status: 'normal',
      summary: 'No readings available yet.',
      recommendation: 'Connect your wristband to start monitoring.',
      timestamp: Date.now(),
      riskScore: 0,
      factors: [],
      aiGenerated: false
    };
  }

  try {
    const { data, error } = await supabase.functions.invoke('health-analysis', {
      body: { 
        readings: recentReadings,
        userProfile 
      }
    });

    if (error) {
      console.error('Edge function error:', error);
      return getFallbackAnalysis(recentReadings);
    }

    // Handle rate limit or payment errors with fallback
    if (data.fallback) {
      console.warn('Using fallback analysis:', data.error);
      return {
        ...data.fallback,
        timestamp: Date.now()
      };
    }

    return {
      status: data.status || 'normal',
      summary: data.summary || 'Analysis complete.',
      recommendation: data.recommendation || 'Continue monitoring.',
      timestamp: data.timestamp || Date.now(),
      riskScore: data.riskScore,
      factors: data.factors,
      insights: data.insights,
      aiGenerated: data.aiGenerated ?? true
    };
  } catch (err) {
    console.error('Failed to analyze vitals:', err);
    return getFallbackAnalysis(recentReadings);
  }
};

/**
 * Fallback analysis when API is unavailable
 * Based on ML model logic from the hypertension dataset analysis
 */
function getFallbackAnalysis(readings: VitalReading[]): HealthInsight {
  const avgHR = readings.reduce((sum, r) => sum + r.heartRate, 0) / readings.length;
  const avgSys = readings.reduce((sum, r) => sum + r.systolic, 0) / readings.length;
  const avgDia = readings.reduce((sum, r) => sum + r.diastolic, 0) / readings.length;

  let status: 'normal' | 'warning' | 'critical' = 'normal';
  let summary = '';
  let recommendation = '';
  let riskScore = 20;
  const factors: string[] = [];

  // Blood pressure analysis
  if (avgSys >= 180 || avgDia >= 120) {
    status = 'critical';
    summary = 'Blood pressure is critically elevated. Immediate attention recommended.';
    recommendation = 'Stop physical activity, sit or lie down, and contact a healthcare provider immediately.';
    riskScore = 95;
    factors.push('Hypertensive crisis');
  } else if (avgSys >= 140 || avgDia >= 90) {
    status = 'warning';
    summary = 'Blood pressure is elevated above normal range.';
    recommendation = 'Consider resting and avoiding caffeine. Monitor closely and consult a doctor if persistent.';
    riskScore = 70;
    factors.push('Stage 2 hypertension');
  } else if (avgSys >= 130 || avgDia >= 80) {
    status = 'warning';
    summary = 'Blood pressure is in the elevated range.';
    recommendation = 'Lifestyle modifications recommended: reduce salt, exercise regularly.';
    riskScore = 50;
    factors.push('Elevated blood pressure');
  } else if (avgSys < 90 || avgDia < 60) {
    status = 'warning';
    summary = 'Blood pressure appears lower than typical range.';
    recommendation = 'Stay hydrated and avoid standing up too quickly.';
    riskScore = 40;
    factors.push('Low blood pressure');
  }

  // Heart rate analysis
  if (avgHR > 100) {
    if (status === 'normal') {
      status = 'warning';
      summary = 'Heart rate is elevated above resting range.';
      recommendation = 'If not exercising, consider relaxation techniques.';
    }
    riskScore = Math.min(riskScore + 15, 100);
    factors.push('Elevated heart rate');
  } else if (avgHR < 50) {
    if (status === 'normal') {
      status = 'warning';
      summary = 'Heart rate is lower than typical resting range.';
      recommendation = 'This may be normal for athletes.';
    }
    factors.push('Low heart rate');
  }

  // Default normal status
  if (status === 'normal') {
    summary = 'All vital signs are within healthy ranges.';
    recommendation = 'Continue your healthy lifestyle. Stay active and hydrated.';
    factors.push('Normal blood pressure', 'Normal heart rate');
  }

  return {
    status,
    summary,
    recommendation,
    timestamp: Date.now(),
    riskScore,
    factors,
    insights: 'Basic analysis - AI temporarily unavailable.',
    aiGenerated: false
  };
}
