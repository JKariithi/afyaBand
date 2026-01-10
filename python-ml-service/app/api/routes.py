"""
API Routes for the ML Prediction Service
"""

from fastapi import APIRouter, HTTPException

from app.models.predictor import model_predictor
from app.services.health_analyzer import health_analyzer
from app.schemas.health import (
    PredictionRequest,
    PredictionResponse,
    HealthCheckResponse,
    ServiceInfoResponse,
)

router = APIRouter()


@router.get("/", response_model=ServiceInfoResponse)
async def root():
    """Service info endpoint"""
    return ServiceInfoResponse(
        service="AfyaBand ML Prediction Service",
        status="running",
        models_loaded=model_predictor.get_available_models()
    )


@router.get("/health", response_model=HealthCheckResponse)
async def health_check():
    """Health check for deployment platforms"""
    return HealthCheckResponse(status="healthy")


@router.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    """
    Make hypertension risk prediction using trained ML models.
    
    - **readings**: List of vital sign readings from the wristband
    - **userProfile**: Optional user demographics for enhanced prediction
    - **model**: Which model to use ('random_forest' or 'xgboost')
    """
    model_name = request.model.lower()
    
    if model_name not in ["random_forest", "xgboost"]:
        raise HTTPException(
            status_code=400, 
            detail=f"Unknown model: {model_name}. Use 'random_forest' or 'xgboost'."
        )
    
    if not model_predictor.is_model_available(model_name):
        raise HTTPException(
            status_code=503,
            detail=f"{model_name} model not loaded. Please ensure model files are present."
        )
    
    try:
        # Make prediction
        prediction, probability = model_predictor.predict(
            model_name, 
            request.readings, 
            request.userProfile
        )
        
        # Interpret results
        result = health_analyzer.interpret_prediction(prediction, probability)
        insights = health_analyzer.generate_insights(model_name)
        
        return PredictionResponse(
            status=result["status"],
            summary=result["summary"],
            recommendation=result["recommendation"],
            riskScore=result["riskScore"],
            factors=result["factors"],
            insights=insights,
            modelUsed=model_name,
            confidence=probability * 100 if probability else None
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


@router.post("/predict/ensemble")
async def predict_ensemble(request: PredictionRequest):
    """
    Make prediction using both models and return ensemble result.
    
    Combines predictions from Random Forest and XGBoost models
    for improved accuracy and confidence.
    """
    available_models = model_predictor.get_available_models()
    
    if not any(available_models.values()):
        raise HTTPException(
            status_code=503, 
            detail="No models available for prediction"
        )
    
    try:
        # Get ensemble prediction
        ensemble_result = model_predictor.predict_ensemble(
            request.readings, 
            request.userProfile
        )
        
        ensemble_probability = ensemble_result["ensemble_probability"]
        
        # Interpret ensemble result
        prediction = 1 if ensemble_probability and ensemble_probability > 0.5 else 0
        result = health_analyzer.interpret_prediction(prediction, ensemble_probability)
        insights = health_analyzer.generate_ensemble_insights()
        
        return {
            **result,
            "insights": insights,
            "modelUsed": "ensemble",
            "individualResults": ensemble_result["individual_results"],
            "confidence": ensemble_probability * 100 if ensemble_probability else None
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
