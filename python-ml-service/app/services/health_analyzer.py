"""
Health Analysis Service
Interprets ML predictions into actionable health insights
"""

from typing import Optional, Dict, Any, List

from app.core.config import settings


class HealthAnalyzer:
    """Converts ML predictions to human-readable health assessments"""
    
    def interpret_prediction(
        self, 
        prediction: float, 
        probability: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Convert model prediction to human-readable health assessment.
        
        Args:
            prediction: Raw model prediction (0 or 1 for binary classification)
            probability: Optional probability score from model
            
        Returns:
            Dictionary with status, summary, recommendation, risk score, and factors
        """
        # Calculate risk score
        if probability is not None:
            risk_score = probability * 100
        else:
            risk_score = prediction * 100
        
        # Classify based on thresholds
        if risk_score >= settings.CRITICAL_THRESHOLD:
            return self._critical_assessment(risk_score)
        elif risk_score >= settings.WARNING_THRESHOLD:
            return self._warning_assessment(risk_score)
        else:
            return self._normal_assessment(risk_score)
    
    def _critical_assessment(self, risk_score: float) -> Dict[str, Any]:
        """Generate critical health assessment"""
        return {
            "status": "critical",
            "summary": "High risk of hypertension detected. Immediate attention recommended.",
            "recommendation": (
                "Please consult a healthcare provider as soon as possible. "
                "Avoid strenuous activity and monitor your blood pressure closely."
            ),
            "riskScore": min(risk_score, 100),
            "factors": [
                "Elevated blood pressure pattern",
                "High cardiovascular risk indicators"
            ]
        }
    
    def _warning_assessment(self, risk_score: float) -> Dict[str, Any]:
        """Generate warning health assessment"""
        return {
            "status": "warning",
            "summary": "Moderate risk indicators present. Lifestyle modifications recommended.",
            "recommendation": (
                "Consider reducing salt intake, increasing physical activity, and managing stress. "
                "Schedule a check-up with your doctor."
            ),
            "riskScore": risk_score,
            "factors": [
                "Borderline blood pressure",
                "Risk factors present"
            ]
        }
    
    def _normal_assessment(self, risk_score: float) -> Dict[str, Any]:
        """Generate normal health assessment"""
        return {
            "status": "normal",
            "summary": "Vital signs are within healthy ranges. Low hypertension risk.",
            "recommendation": (
                "Continue maintaining a healthy lifestyle with regular exercise and balanced diet."
            ),
            "riskScore": risk_score,
            "factors": [
                "Normal blood pressure",
                "Healthy heart rate patterns"
            ]
        }
    
    def generate_insights(self, model_name: str) -> str:
        """Generate model-specific insights text"""
        model_display = model_name.replace("_", " ").title()
        return f"Prediction made using {model_display} model trained on hypertension dataset."
    
    def generate_ensemble_insights(self) -> str:
        """Generate insights for ensemble predictions"""
        return "Ensemble prediction combining Random Forest and XGBoost models for improved accuracy."


# Global analyzer instance
health_analyzer = HealthAnalyzer()
