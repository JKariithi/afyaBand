"""
AfyaBand ML Prediction Service
Loads trained Random Forest and XGBoost models for hypertension risk prediction
"""

import os
import pickle
import numpy as np
from typing import Optional, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="AfyaBand ML Service",
    description="Hypertension risk prediction using trained ML models",
    version="1.0.0"
)

# Enable CORS for edge function calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model storage
models = {
    "random_forest": None,
    "xgboost": None
}

# Load models on startup
@app.on_event("startup")
async def load_models():
    """Load trained models from pickle files"""
    models_dir = os.path.join(os.path.dirname(__file__), "models")
    
    try:
        rf_path = os.path.join(models_dir, "random_forest_model.pkl")
        if os.path.exists(rf_path):
            with open(rf_path, "rb") as f:
                models["random_forest"] = pickle.load(f)
            print("✓ Random Forest model loaded")
        else:
            print("⚠ Random Forest model not found at:", rf_path)
    except Exception as e:
        print(f"Error loading Random Forest model: {e}")

    try:
        xgb_path = os.path.join(models_dir, "xgboost_model.pkl")
        if os.path.exists(xgb_path):
            with open(xgb_path, "rb") as f:
                models["xgboost"] = pickle.load(f)
            print("✓ XGBoost model loaded")
        else:
            print("⚠ XGBoost model not found at:", xgb_path)
    except Exception as e:
        print(f"Error loading XGBoost model: {e}")


class VitalReading(BaseModel):
    heartRate: float
    systolic: float
    diastolic: float
    timestamp: int


class UserProfile(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    bmi: Optional[float] = None
    weight: Optional[float] = None
    height: Optional[float] = None


class PredictionRequest(BaseModel):
    readings: List[VitalReading]
    userProfile: Optional[UserProfile] = None
    model: str = "random_forest"  # or "xgboost"


class PredictionResponse(BaseModel):
    status: str  # normal, warning, critical
    summary: str
    recommendation: str
    riskScore: float
    factors: List[str]
    insights: str
    modelUsed: str
    confidence: Optional[float] = None


def calculate_features(readings: List[VitalReading], profile: Optional[UserProfile]) -> np.ndarray:
    """
    Extract features from vital readings for model prediction.
    Adjust these based on your actual model's expected features!
    """
    if not readings:
        raise ValueError("No readings provided")
    
    # Calculate statistics from readings
    heart_rates = [r.heartRate for r in readings]
    systolics = [r.systolic for r in readings]
    diastolics = [r.diastolic for r in readings]
    
    features = {
        "avg_heart_rate": np.mean(heart_rates),
        "max_heart_rate": np.max(heart_rates),
        "min_heart_rate": np.min(heart_rates),
        "hr_variability": np.std(heart_rates),
        "avg_systolic": np.mean(systolics),
        "max_systolic": np.max(systolics),
        "avg_diastolic": np.mean(diastolics),
        "max_diastolic": np.max(diastolics),
        "pulse_pressure": np.mean(systolics) - np.mean(diastolics),
        "age": profile.age if profile and profile.age else 45,  # default
        "bmi": profile.bmi if profile and profile.bmi else 25.0,  # default
        "gender_male": 1 if profile and profile.gender and profile.gender.lower() == "male" else 0,
    }
    
    # Return as numpy array - ADJUST ORDER based on your model's training!
    # This is a placeholder - you'll need to match your model's feature order
    feature_array = np.array([
        features["avg_systolic"],
        features["avg_diastolic"],
        features["avg_heart_rate"],
        features["age"],
        features["bmi"],
        features["gender_male"],
        features["pulse_pressure"],
        features["hr_variability"],
    ]).reshape(1, -1)
    
    return feature_array


def interpret_prediction(prediction: float, probability: Optional[float] = None) -> dict:
    """
    Convert model prediction to human-readable health assessment
    """
    # Assuming binary classification: 0 = no hypertension, 1 = hypertension
    if probability is not None:
        risk_score = probability * 100
    else:
        risk_score = prediction * 100
    
    if risk_score >= 70:
        return {
            "status": "critical",
            "summary": "High risk of hypertension detected. Immediate attention recommended.",
            "recommendation": "Please consult a healthcare provider as soon as possible. Avoid strenuous activity and monitor your blood pressure closely.",
            "riskScore": min(risk_score, 100),
            "factors": ["Elevated blood pressure pattern", "High cardiovascular risk indicators"]
        }
    elif risk_score >= 40:
        return {
            "status": "warning",
            "summary": "Moderate risk indicators present. Lifestyle modifications recommended.",
            "recommendation": "Consider reducing salt intake, increasing physical activity, and managing stress. Schedule a check-up with your doctor.",
            "riskScore": risk_score,
            "factors": ["Borderline blood pressure", "Risk factors present"]
        }
    else:
        return {
            "status": "normal",
            "summary": "Vital signs are within healthy ranges. Low hypertension risk.",
            "recommendation": "Continue maintaining a healthy lifestyle with regular exercise and balanced diet.",
            "riskScore": risk_score,
            "factors": ["Normal blood pressure", "Healthy heart rate patterns"]
        }


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "AfyaBand ML Prediction Service",
        "status": "running",
        "models_loaded": {
            "random_forest": models["random_forest"] is not None,
            "xgboost": models["xgboost"] is not None
        }
    }


@app.get("/health")
async def health_check():
    """Health check for deployment platforms"""
    return {"status": "healthy"}


@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    """
    Make hypertension risk prediction using trained ML models
    """
    model_name = request.model.lower()
    
    if model_name not in models:
        raise HTTPException(status_code=400, detail=f"Unknown model: {model_name}")
    
    model = models[model_name]
    if model is None:
        raise HTTPException(
            status_code=503, 
            detail=f"{model_name} model not loaded. Please ensure model files are present."
        )
    
    try:
        # Extract features from readings
        features = calculate_features(request.readings, request.userProfile)
        
        # Make prediction
        prediction = model.predict(features)[0]
        
        # Get probability if available
        probability = None
        if hasattr(model, "predict_proba"):
            proba = model.predict_proba(features)[0]
            probability = proba[1] if len(proba) > 1 else proba[0]
        
        # Interpret results
        result = interpret_prediction(prediction, probability)
        
        return PredictionResponse(
            status=result["status"],
            summary=result["summary"],
            recommendation=result["recommendation"],
            riskScore=result["riskScore"],
            factors=result["factors"],
            insights=f"Prediction made using {model_name.replace('_', ' ').title()} model trained on hypertension dataset.",
            modelUsed=model_name,
            confidence=probability * 100 if probability else None
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


@app.post("/predict/ensemble")
async def predict_ensemble(request: PredictionRequest):
    """
    Make prediction using both models and return ensemble result
    """
    results = {}
    
    for model_name, model in models.items():
        if model is None:
            continue
        
        try:
            features = calculate_features(request.readings, request.userProfile)
            prediction = model.predict(features)[0]
            
            probability = None
            if hasattr(model, "predict_proba"):
                proba = model.predict_proba(features)[0]
                probability = proba[1] if len(proba) > 1 else proba[0]
            
            results[model_name] = {
                "prediction": int(prediction),
                "probability": float(probability) if probability else None
            }
        except Exception as e:
            results[model_name] = {"error": str(e)}
    
    if not results:
        raise HTTPException(status_code=503, detail="No models available for prediction")
    
    # Calculate ensemble probability (average of available)
    probabilities = [r["probability"] for r in results.values() if "probability" in r and r["probability"] is not None]
    ensemble_probability = np.mean(probabilities) if probabilities else None
    
    result = interpret_prediction(1 if ensemble_probability and ensemble_probability > 0.5 else 0, ensemble_probability)
    
    return {
        **result,
        "insights": "Ensemble prediction combining Random Forest and XGBoost models for improved accuracy.",
        "modelUsed": "ensemble",
        "individualResults": results,
        "confidence": ensemble_probability * 100 if ensemble_probability else None
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
