import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VitalReading {
  heartRate: number;
  systolic: number;
  diastolic: number;
  timestamp: number;
}

interface UserProfile {
  age?: number;
  gender?: string;
  bmi?: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { readings, userProfile } = await req.json() as { 
      readings: VitalReading[]; 
      userProfile?: UserProfile 
    };
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!readings || readings.length === 0) {
      return new Response(JSON.stringify({
        status: 'normal',
        summary: 'No readings available yet.',
        recommendation: 'Connect your wristband to start monitoring.',
        riskScore: 0,
        factors: [],
        timestamp: Date.now()
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Calculate statistics from readings
    const avgHR = readings.reduce((sum, r) => sum + r.heartRate, 0) / readings.length;
    const avgSystolic = readings.reduce((sum, r) => sum + r.systolic, 0) / readings.length;
    const avgDiastolic = readings.reduce((sum, r) => sum + r.diastolic, 0) / readings.length;
    
    const maxHR = Math.max(...readings.map(r => r.heartRate));
    const minHR = Math.min(...readings.map(r => r.heartRate));
    const maxSystolic = Math.max(...readings.map(r => r.systolic));
    const maxDiastolic = Math.max(...readings.map(r => r.diastolic));
    
    // Calculate variability
    const hrVariability = maxHR - minHR;

    // Build context for AI analysis based on ML model insights
    const systemPrompt = `You are an AI health analyst for the AfyaBand wristband device. Your role is to analyze vital signs data and provide health insights focused on hypertension risk assessment.

You are trained on health data patterns similar to populations in African countries, considering:
- Blood pressure classifications (Normal: <120/80, Elevated: 120-129/<80, High Stage 1: 130-139/80-89, High Stage 2: ≥140/≥90, Crisis: >180/>120)
- Heart rate patterns and their correlation with cardiovascular health
- BMI categories and their impact on hypertension risk

Your analysis should be:
1. Clear and actionable for non-medical users
2. Focused on prevention and lifestyle recommendations
3. Appropriately urgent when critical values are detected
4. Culturally sensitive and practical for the target population

Always provide your response in the following JSON format:
{
  "status": "normal" | "warning" | "critical",
  "summary": "Brief 1-2 sentence assessment",
  "recommendation": "Specific actionable advice",
  "riskScore": number between 0-100,
  "factors": ["array of contributing risk factors"],
  "insights": "Additional detailed insights for the user"
}`;

    const userMessage = `Analyze the following vital signs data:

**Recent Readings Summary:**
- Average Heart Rate: ${avgHR.toFixed(1)} BPM (range: ${minHR}-${maxHR})
- Average Systolic BP: ${avgSystolic.toFixed(1)} mmHg (max: ${maxSystolic})
- Average Diastolic BP: ${avgDiastolic.toFixed(1)} mmHg (max: ${maxDiastolic})
- Heart Rate Variability: ${hrVariability.toFixed(1)} BPM
- Number of readings: ${readings.length}
- Monitoring duration: ${((readings[readings.length - 1].timestamp - readings[0].timestamp) / 1000 / 60).toFixed(1)} minutes

${userProfile ? `**User Profile:**
- Age: ${userProfile.age || 'Unknown'}
- Gender: ${userProfile.gender || 'Unknown'}
- BMI: ${userProfile.bmi || 'Unknown'}` : '**User Profile:** Not provided'}

Please provide a comprehensive health assessment focusing on hypertension risk.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        return new Response(JSON.stringify({ 
          error: "Rate limits exceeded, please try again later.",
          fallback: getFallbackAnalysis(avgHR, avgSystolic, avgDiastolic)
        }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        console.error("Payment required");
        return new Response(JSON.stringify({ 
          error: "AI service unavailable. Using basic analysis.",
          fallback: getFallbackAnalysis(avgHR, avgSystolic, avgDiastolic)
        }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      // Return fallback analysis
      return new Response(JSON.stringify(getFallbackAnalysis(avgHR, avgSystolic, avgDiastolic)), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const aiContent = data.choices?.[0]?.message?.content;
    
    if (!aiContent) {
      console.error("No content in AI response");
      return new Response(JSON.stringify(getFallbackAnalysis(avgHR, avgSystolic, avgDiastolic)), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const parsedAnalysis = JSON.parse(aiContent);
    
    return new Response(JSON.stringify({
      ...parsedAnalysis,
      timestamp: Date.now(),
      aiGenerated: true
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Health analysis error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error",
      ...getFallbackAnalysis(80, 120, 80)
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

// Fallback analysis when AI is unavailable - based on the ML model's logic
function getFallbackAnalysis(avgHR: number, avgSystolic: number, avgDiastolic: number) {
  let status: 'normal' | 'warning' | 'critical' = 'normal';
  let summary = '';
  let recommendation = '';
  let riskScore = 20;
  const factors: string[] = [];

  // Blood pressure analysis based on ML model categories
  if (avgSystolic >= 180 || avgDiastolic >= 120) {
    status = 'critical';
    summary = 'Blood pressure is critically elevated. Immediate attention recommended.';
    recommendation = 'Stop physical activity, sit or lie down, and contact a healthcare provider immediately.';
    riskScore = 95;
    factors.push('Hypertensive crisis');
  } else if (avgSystolic >= 140 || avgDiastolic >= 90) {
    status = 'warning';
    summary = 'Blood pressure indicates Stage 2 hypertension.';
    recommendation = 'Consider resting and avoiding caffeine. Monitor closely and consult a doctor if persistent.';
    riskScore = 70;
    factors.push('Stage 2 hypertension');
  } else if (avgSystolic >= 130 || avgDiastolic >= 80) {
    status = 'warning';
    summary = 'Blood pressure is elevated (Stage 1 hypertension range).';
    recommendation = 'Lifestyle modifications recommended: reduce salt intake, exercise regularly, manage stress.';
    riskScore = 50;
    factors.push('Stage 1 hypertension');
  } else if (avgSystolic < 90 || avgDiastolic < 60) {
    status = 'warning';
    summary = 'Blood pressure appears lower than typical range.';
    recommendation = 'Stay hydrated and avoid standing up too quickly. Consult a doctor if you feel dizzy.';
    riskScore = 40;
    factors.push('Low blood pressure');
  }

  // Heart rate analysis
  if (avgHR > 100) {
    if (status === 'normal') {
      status = 'warning';
      summary = 'Heart rate is elevated above resting range.';
      recommendation = 'If not exercising, consider relaxation techniques. Stay hydrated.';
    }
    riskScore = Math.min(riskScore + 15, 100);
    factors.push('Elevated heart rate');
  } else if (avgHR < 50) {
    if (status === 'normal') {
      status = 'warning';
      summary = 'Heart rate is lower than typical resting range.';
      recommendation = 'This may be normal for athletes, but consult a doctor if you experience symptoms.';
    }
    riskScore = Math.min(riskScore + 10, 100);
    factors.push('Low heart rate');
  }

  // Default normal status
  if (status === 'normal') {
    summary = 'All vital signs are within healthy ranges. Your cardiovascular metrics look stable.';
    recommendation = 'Continue your healthy lifestyle. Stay active and maintain proper hydration.';
    factors.push('Normal blood pressure', 'Normal heart rate');
  }

  return {
    status,
    summary,
    recommendation,
    riskScore,
    factors,
    insights: 'Analysis based on standard cardiovascular health guidelines.',
    timestamp: Date.now(),
    aiGenerated: false
  };
}
