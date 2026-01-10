"""
Application configuration settings
"""

import os
from typing import List


class Settings:
    """Application settings loaded from environment variables"""
    
    # App info
    APP_NAME: str = "AfyaBand ML Service"
    APP_DESCRIPTION: str = "Hypertension risk prediction using trained ML models"
    APP_VERSION: str = "1.0.0"
    
    # Server settings
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8000))
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    
    # CORS settings
    CORS_ORIGINS: List[str] = ["*"]
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: List[str] = ["*"]
    CORS_ALLOW_HEADERS: List[str] = ["*"]
    
    # Model paths
    MODELS_DIR: str = os.getenv("MODELS_DIR", os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "ml_models"))
    RANDOM_FOREST_MODEL: str = "random_forest_model.pkl"
    XGBOOST_MODEL: str = "xgboost_model.pkl"
    
    # Default values for missing user profile data
    DEFAULT_AGE: int = 45
    DEFAULT_BMI: float = 25.0
    
    # Risk thresholds
    CRITICAL_THRESHOLD: float = 70.0
    WARNING_THRESHOLD: float = 40.0


settings = Settings()
