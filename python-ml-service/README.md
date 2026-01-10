# AfyaBand ML Prediction Service

A FastAPI microservice that loads trained Random Forest and XGBoost models for hypertension risk prediction.

## Setup

### 1. Add Your Model Files

Copy your trained models from the `machine-learning` branch:

```bash
mkdir models
cp /path/to/random_forest_model.pkl models/
cp /path/to/xgboost_model.pkl models/
```

### 2. Local Development

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the service
python main.py
```

The service will be available at `http://localhost:8000`

### 3. Test the API

```bash
# Health check
curl http://localhost:8000/

# Make a prediction
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "readings": [
      {"heartRate": 75, "systolic": 130, "diastolic": 85, "timestamp": 1704067200000}
    ],
    "userProfile": {"age": 45, "gender": "male", "bmi": 26.5},
    "model": "random_forest"
  }'
```

## Deploy to Railway

1. Create a [Railway](https://railway.app) account
2. Create a new project → "Deploy from GitHub repo"
3. Connect your repository and select the `python-ml-service` directory
4. Railway will auto-detect Python and deploy

Or use Railway CLI:

```bash
railway login
railway init
railway up
```

## Deploy to Render

1. Create a [Render](https://render.com) account
2. New → Web Service → Connect your GitHub repo
3. Set:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

## Deploy to Fly.io

```bash
flyctl launch
flyctl deploy
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Service info and model status |
| `/health` | GET | Health check |
| `/predict` | POST | Single model prediction |
| `/predict/ensemble` | POST | Ensemble prediction (both models) |

## Important Notes

### Feature Engineering

The `calculate_features()` function in `main.py` needs to match the features your models were trained on. Check your `notebooks/models.ipynb` to see the exact feature order and update accordingly.

### Model Compatibility

Ensure scikit-learn and xgboost versions match what was used for training. If you get pickle errors, you may need to retrain with compatible versions.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 8000 |

## After Deployment

Once deployed, update your edge function with the service URL:

```
ML_SERVICE_URL=https://your-service.railway.app
```
