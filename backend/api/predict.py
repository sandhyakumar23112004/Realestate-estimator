from fastapi import APIRouter
from pydantic import BaseModel
import torch
import numpy as np
import joblib
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models.fusion_model import PriceMLP

router = APIRouter()

# Load model + scaler + features
MODEL_PATH = os.path.join(os.path.dirname(__file__), '../models/price_mlp.pt')
SCALER_PATH = os.path.join(os.path.dirname(__file__), '../models/scaler.pkl')
FEATURES_PATH = os.path.join(os.path.dirname(__file__), '../models/features.pkl')

scaler = joblib.load(SCALER_PATH)
features = joblib.load(FEATURES_PATH)

model = PriceMLP(input_dim=len(features))
model.load_state_dict(torch.load(MODEL_PATH, map_location='cpu'))
model.eval()

# Input schema
class PropertyInput(BaseModel):
    OverallQual: float = 7
    GrLivArea: float = 1500
    GarageCars: float = 2
    TotalBsmtSF: float = 800
    FullBath: float = 2
    YearBuilt: float = 2000
    TotalSF: float = 2300
    TotalBath: float = 2.5
    HouseAge: float = 20
    IsRemodeled: float = 0
    LotArea: float = 8000
    OverallCond: float = 5

@router.post("/predict")
def predict_price(data: PropertyInput):
    # Prepare input
    input_data = np.array([[
        data.OverallQual, data.GrLivArea, data.GarageCars,
        data.TotalBsmtSF, data.FullBath, data.YearBuilt,
        data.TotalSF, data.TotalBath, data.HouseAge,
        data.IsRemodeled, data.LotArea, data.OverallCond
    ]])

    # Scale
    input_scaled = scaler.transform(input_data)
    input_tensor = torch.FloatTensor(input_scaled)

    # Predict
    with torch.no_grad():
        log_price = model(input_tensor).item()

    price = np.exp(log_price)
    low = price * 0.90
    high = price * 1.10

    return {
        "estimated_price": round(price),
        "price_range_low": round(low),
        "price_range_high": round(high),
        "formatted": f"${price:,.0f}",
        "range": f"${low:,.0f} – ${high:,.0f}"
    }