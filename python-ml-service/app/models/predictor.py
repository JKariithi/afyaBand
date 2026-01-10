"""
ML Model Predictor
Handles loading and inference for Random Forest and XGBoost models
"""

import os
import pickle
import numpy as np
from typing import Optional, List, Dict, Any, Tuple

from app.core.config import settings
from app.schemas.health import VitalReading, UserProfile


class ModelPredictor:
    """Manages ML models for hypertension risk prediction"""
    
    def __init__(self):
        self.models: Dict[str, Any] = {
            "random_forest": None,
            "xgboost": None
        }
        self._loaded = False
    
    def load_models(self) -> Dict[str, bool]:
        """Load trained models from pickle files"""
        load_status = {}
        
        # Load Random Forest model
        rf_path = os.path.join(settings.MODELS_DIR, settings.RANDOM_FOREST_MODEL)
        load_status["random_forest"] = self._load_single_model("random_forest", rf_path)
        
        # Load XGBoost model
        xgb_path = os.path.join(settings.MODELS_DIR, settings.XGBOOST_MODEL)
        load_status["xgboost"] = self._load_single_model("xgboost", xgb_path)
        
        self._loaded = True
        return load_status
    
    def _load_single_model(self, name: str, path: str) -> bool:
        """Load a single model from pickle file"""
        try:
            if os.path.exists(path):
                with open(path, "rb") as f:
                    self.models[name] = pickle.load(f)
                print(f"✓ {name.replace('_', ' ').title()} model loaded from {path}")
                return True
            else:
                print(f"⚠ {name.replace('_', ' ').title()} model not found at: {path}")
                return False
        except Exception as e:
            print(f"Error loading {name} model: {e}")
            return False
    
    def is_model_available(self, model_name: str) -> bool:
        """Check if a specific model is loaded and available"""
        return model_name in self.models and self.models[model_name] is not None
    
    def get_available_models(self) -> Dict[str, bool]:
        """Get status of all models"""
        return {name: model is not None for name, model in self.models.items()}
    
    def calculate_features(
        self, 
        readings: List[VitalReading], 
        profile: Optional[UserProfile] = None
    ) -> np.ndarray:
        """
        Extract features from vital readings for model prediction.
        
        Features extracted:
        - Average, max, min heart rate and variability
        - Average, max systolic and diastolic blood pressure
        - Pulse pressure
        - User demographics (age, BMI, gender)
        """
        if not readings:
            raise ValueError("No readings provided")
        
        # Extract values from readings
        heart_rates = [r.heartRate for r in readings]
        systolics = [r.systolic for r in readings]
        diastolics = [r.diastolic for r in readings]
        
        # Calculate feature statistics
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
            "age": profile.age if profile and profile.age else settings.DEFAULT_AGE,
            "bmi": profile.bmi if profile and profile.bmi else settings.DEFAULT_BMI,
            "gender_male": 1 if profile and profile.gender and profile.gender.lower() == "male" else 0,
        }
        
        # Return as numpy array
        # NOTE: Adjust feature order to match your model's training!
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
    
    def predict(
        self, 
        model_name: str, 
        readings: List[VitalReading], 
        profile: Optional[UserProfile] = None
    ) -> Tuple[float, Optional[float]]:
        """
        Make prediction using specified model.
        
        Returns:
            Tuple of (prediction, probability)
        """
        if not self.is_model_available(model_name):
            raise ValueError(f"Model '{model_name}' not available")
        
        model = self.models[model_name]
        features = self.calculate_features(readings, profile)
        
        # Make prediction
        prediction = model.predict(features)[0]
        
        # Get probability if available
        probability = None
        if hasattr(model, "predict_proba"):
            proba = model.predict_proba(features)[0]
            probability = proba[1] if len(proba) > 1 else proba[0]
        
        return float(prediction), probability
    
    def predict_ensemble(
        self, 
        readings: List[VitalReading], 
        profile: Optional[UserProfile] = None
    ) -> Dict[str, Any]:
        """
        Make predictions using all available models and combine results.
        
        Returns:
            Dictionary with individual results and ensemble probability
        """
        results = {}
        
        for model_name in self.models:
            if not self.is_model_available(model_name):
                continue
            
            try:
                prediction, probability = self.predict(model_name, readings, profile)
                results[model_name] = {
                    "prediction": int(prediction),
                    "probability": float(probability) if probability else None
                }
            except Exception as e:
                results[model_name] = {"error": str(e)}
        
        # Calculate ensemble probability
        probabilities = [
            r["probability"] 
            for r in results.values() 
            if "probability" in r and r["probability"] is not None
        ]
        ensemble_probability = float(np.mean(probabilities)) if probabilities else None
        
        return {
            "individual_results": results,
            "ensemble_probability": ensemble_probability
        }


# Global predictor instance
model_predictor = ModelPredictor()
