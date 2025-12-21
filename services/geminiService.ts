import { GoogleGenAI, Type } from "@google/genai";
import { VitalReading, HealthInsight } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeVitals = async (recentReadings: VitalReading[]): Promise<HealthInsight> => {
  if (!apiKey) {
    return {
      status: 'warning',
      summary: 'API Key missing',
      recommendation: 'Please configure your Gemini API Key to receive insights.',
      timestamp: Date.now()
    };
  }

  // Downsample if too many readings to save tokens, keep last 20
  const dataPayload = recentReadings.slice(-20);

  const prompt = `
    Act as an advanced medical AI assistant for a wristband wearable.
    Analyze the following time-series data of Heart Rate (HR) and Blood Pressure (BP - Systolic/Diastolic).
    
    Data (Last 20 seconds):
    ${JSON.stringify(dataPayload)}

    Provide a real-time assessment.
    1. Determine status: 'normal', 'warning' (e.g. slight elevation), or 'critical' (hypertensive crisis or dangerous arrhythmia).
    2. Provide a 1-sentence summary of the current trend.
    3. Provide a short, actionable recommendation for the user.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, enum: ['normal', 'warning', 'critical'] },
            summary: { type: Type.STRING },
            recommendation: { type: Type.STRING }
          },
          required: ['status', 'summary', 'recommendation']
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    
    return {
      status: result.status || 'normal',
      summary: result.summary || 'Vitals are stable.',
      recommendation: result.recommendation || 'Continue monitoring.',
      timestamp: Date.now()
    };

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return {
      status: 'warning',
      summary: 'Analysis temporarily unavailable.',
      recommendation: 'Check connection.',
      timestamp: Date.now()
    };
  }
};