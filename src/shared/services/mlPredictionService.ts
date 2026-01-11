import { VitalReading, HealthInsight, UserProfile } from '@/shared/types';
import { supabase } from '@/integrations/supabase/client';

export type MLModel = 'xgboost';

export interface MLPredictionResult extends HealthInsight {
  prediction: number;
  probability: number;
  model: string;
  features?: {
    age: number;
    bmi: number;
    systolic: number;
    diastolic: number;
    heartRate: number;
    gender: string;
  };
  mlGenerated: boolean;
  version: string;
}

/**
 * ML-powered hypertension risk prediction service
 * 
 * Uses trained XGBoost model to predict hypertension risk 
 * based on vital readings and user profile.
 * 
 * Model was trained on the AfyaBand hypertension dataset with
 * features: Age, BMI, Systolic_BP, Diastolic_BP, Heart_Rate, Gender
 */
export const predictHypertensionRisk = async (
  readings: VitalReading[],
  userProfile?: UserProfile
): Promise<MLPredictionResult> => {
  if (readings.length === 0) {
    return {
      status: 'normal',
      summary: 'No readings available for prediction.',
      recommendation: 'Connect your wristband to start monitoring.',
      timestamp: Date.now(),
      riskScore: 0,
      factors: [],
      prediction: 0,
      probability: 0,
      model: 'none',
      mlGenerated: false,
      version: '1.0.0'
    };
  }

  try {
    const { data, error } = await supabase.functions.invoke('ml-predict', {
      body: { 
        readings,
        userProfile
      }
    });

    if (error) {
      console.error('ML prediction error:', error);
      throw new Error(error.message);
    }

    return {
      status: data.status || 'normal',
      summary: data.summary || 'Prediction complete.',
      recommendation: data.recommendation || 'Continue monitoring.',
      timestamp: data.timestamp || Date.now(),
      riskScore: data.riskScore ?? 0,
      factors: data.factors || [],
      insights: data.insights,
      prediction: data.prediction,
      probability: data.probability,
      model: data.model,
      features: data.features,
      mlGenerated: data.mlGenerated ?? true,
      version: data.version || '1.0.0'
    };
  } catch (err) {
    console.error('Failed to get ML prediction:', err);
    
    // Return basic fallback prediction
    return getFallbackPrediction(readings);
  }
};

/**
 * Fallback prediction when ML service is unavailable
 * Uses simplified rule-based logic
 */
function getFallbackPrediction(readings: VitalReading[]): MLPredictionResult {
  const avgSys = readings.reduce((sum, r) => sum + r.systolic, 0) / readings.length;
  const avgDia = readings.reduce((sum, r) => sum + r.diastolic, 0) / readings.length;
  const avgHR = readings.reduce((sum, r) => sum + r.heartRate, 0) / readings.length;

  // Simple probability calculation based on BP thresholds
  let probability = 0.2;
  const factors: string[] = [];

  if (avgSys >= 180 || avgDia >= 120) {
    probability = 0.95;
    factors.push('Hypertensive crisis');
  } else if (avgSys >= 140 || avgDia >= 90) {
    probability = 0.75;
    factors.push('Stage 2 hypertension');
  } else if (avgSys >= 130 || avgDia >= 80) {
    probability = 0.55;
    factors.push('Stage 1 hypertension');
  } else if (avgSys >= 120) {
    probability = 0.35;
    factors.push('Elevated blood pressure');
  } else {
    factors.push('Normal blood pressure');
  }

  if (avgHR > 100) {
    probability = Math.min(probability + 0.1, 1);
    factors.push('Elevated heart rate');
  }

  const riskScore = Math.round(probability * 100);
  const prediction = probability >= 0.5 ? 1 : 0;

  let status: 'normal' | 'warning' | 'critical' = 'normal';
  let summary = '';
  let recommendation = '';

  if (probability >= 0.75) {
    status = 'critical';
    summary = `High hypertension risk (${riskScore}%).`;
    recommendation = 'Consult a healthcare provider immediately.';
  } else if (probability >= 0.5) {
    status = 'warning';
    summary = `Elevated hypertension risk (${riskScore}%).`;
    recommendation = 'Consider scheduling a health checkup.';
  } else {
    status = 'normal';
    summary = `Low hypertension risk (${riskScore}%).`;
    recommendation = 'Continue maintaining your healthy lifestyle.';
  }

  return {
    status,
    summary,
    recommendation,
    timestamp: Date.now(),
    riskScore,
    factors,
    prediction,
    probability,
    model: 'fallback',
    mlGenerated: false,
    version: '1.0.0',
    insights: 'Fallback prediction - ML service unavailable.'
  };
}
