import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.predict import router as predict_router
from api.chat import router as chat_router

app = FastAPI(
    title="Real Estate Price Estimator API",
    description="AI-powered property price prediction",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_router, prefix="/api")
app.include_router(chat_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Real Estate Price Estimator API is running!"}

@app.get("/health")
def health():
    return {"status": "healthy"}