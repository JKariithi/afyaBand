"""
Pydantic schemas for health-related data validation
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class VitalReading(BaseModel):
    """A single vital sign reading from the wristband"""
    heartRate: float = Field(..., description="Heart rate in BPM")
    systolic: float = Field(..., description="Systolic blood pressure in mmHg")
    diastolic: float = Field(..., description="Diastolic blood pressure in mmHg")
    timestamp: int = Field(..., description="Unix timestamp of the reading")


class UserProfile(BaseModel):
    """Optional user profile for enhanced predictions"""
    age: Optional[int] = Field(None, ge=0, le=150, description="User age in years")
    gender: Optional[str] = Field(None, description="User gender (male/female)")
    bmi: Optional[float] = Field(None, ge=10, le=100, description="Body Mass Index")
    weight: Optional[float] = Field(None, ge=20, le=500, description="Weight in kg")
    height: Optional[float] = Field(None, ge=50, le=300, description="Height in cm")


class PredictionRequest(BaseModel):
    """Request body for prediction endpoints"""
    readings: List[VitalReading] = Field(..., min_length=1, description="List of vital readings")
    userProfile: Optional[UserProfile] = Field(None, description="Optional user profile data")
    model: str = Field("random_forest", description="Model to use: 'random_forest' or 'xgboost'")


class PredictionResponse(BaseModel):
    """Response from prediction endpoints"""
    status: str = Field(..., description="Health status: normal, warning, or critical")
    summary: str = Field(..., description="Human-readable summary")
    recommendation: str = Field(..., description="Action recommendations")
    riskScore: float = Field(..., ge=0, le=100, description="Risk score percentage")
    factors: List[str] = Field(..., description="Contributing risk factors")
    insights: str = Field(..., description="Additional insights from the model")
    modelUsed: str = Field(..., description="Which model made the prediction")
    confidence: Optional[float] = Field(None, description="Prediction confidence percentage")


class EnsembleResponse(PredictionResponse):
    """Extended response for ensemble predictions"""
    individualResults: Dict[str, Any] = Field(..., description="Results from each individual model")


class HealthCheckResponse(BaseModel):
    """Response for health check endpoint"""
    status: str = "healthy"


class ServiceInfoResponse(BaseModel):
    """Response for service info endpoint"""
    service: str
    status: str
    models_loaded: Dict[str, bool]
