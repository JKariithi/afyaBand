# AfyaBand ML Prediction Service

A Python microservice that loads trained Random Forest and XGBoost models for hypertension risk prediction.

## Project Structure

```
python-ml-service/
├── app/
│   ├── __init__.py           # Package initialization
│   ├── main.py               # FastAPI application entry point
│   ├── api/
│   │   ├── __init__.py
│   │   └── routes.py         # API endpoint definitions
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py         # Application configuration
│   ├── models/
│   │   ├── __init__.py
│   │   └── predictor.py      # ML model loading & prediction
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── health.py         # Pydantic request/response schemas
│   └── services/
│       ├── __init__.py
│       └── health_analyzer.py # Health insight interpretation
├── ml_models/                 # Place your .pkl model files here
│   └── .gitkeep
├── Dockerfile
├── requirements.txt
└── README.md
```

## Setup

### 1. Add Your Model Files

Copy your trained models to the `ml_models/` directory:
- `random_forest_model.pkl`
- `xgboost_model.pkl`

### 2. Install Dependencies

```bash
cd python-ml-service
pip install -r requirements.txt
```

### 3. Run Locally

```bash
# From the python-ml-service directory
python -m app.main

# Or using uvicorn directly
uvicorn app.main:app --reload --port 8000
```

## API Endpoints

### GET `/`
Service info and model status

### GET `/health`
Health check for deployment platforms

### POST `/predict`
Single model prediction

```json
{
  "readings": [
    {"heartRate": 75, "systolic": 130, "diastolic": 85, "timestamp": 1234567890}
  ],
  "userProfile": {"age": 45, "gender": "male", "bmi": 26.5},
  "model": "random_forest"
}
```

### POST `/predict/ensemble`
Combined prediction from all available models

## Deployment

### Docker

```bash
docker build -t afyaband-ml .
docker run -p 8000:8000 afyaband-ml
```

### Railway / Render / Fly.io

1. Push this directory to a Git repository
2. Connect to your deployment platform
3. Set the root directory to `python-ml-service`
4. The platform will auto-detect the Dockerfile

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 8000 | Server port |
| `HOST` | 0.0.0.0 | Server host |
| `DEBUG` | false | Enable debug mode |
| `MODELS_DIR` | ./ml_models | Path to model files |

## Feature Engineering

The predictor extracts these features from vital readings:

- `avg_systolic` - Average systolic blood pressure
- `avg_diastolic` - Average diastolic blood pressure  
- `avg_heart_rate` - Average heart rate
- `age` - User age (default: 45)
- `bmi` - Body Mass Index (default: 25.0)
- `gender_male` - Gender encoding (1 for male, 0 for female)
- `pulse_pressure` - Systolic minus diastolic
- `hr_variability` - Heart rate standard deviation

**Important**: Adjust the feature order in `app/models/predictor.py` to match your model's training!

## Integration with Edge Function

Once deployed, add your service URL to the Lovable project secrets as `ML_SERVICE_URL`, then update the edge function to call your Python service.