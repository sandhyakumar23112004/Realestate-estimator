# Real Estate Price Estimator

AI-powered property price prediction with a chatbot assistant.

**Live Demo:** https://melodious-monstera-b9bfc8.netlify.app

---

## What it does

- Predicts property prices using a PyTorch deep learning model
- Gives a price range with confidence interval
- AI chatbot answers real estate questions using Groq LLM
- Full-stack web app with React frontend and FastAPI backend

---

## Tech Stack

| Layer      | Technology                            |
| ---------- | ------------------------------------- |
| ML Model   | PyTorch (MLP Neural Network)          |
| Backend    | FastAPI + Python                      |
| AI Chatbot | LangChain + Groq (Llama 3)            |
| Frontend   | React.js                              |
| Deployment | Render (backend) + Netlify (frontend) |

---

## Model Performance

- Dataset: Kaggle House Prices (1460 samples, 81 features)
- RMSE: $55,253
- Log RMSE: 0.34

---

## Features

- Property price prediction from 12 key features
- Price range estimation (±10% confidence)
- AI chatbot with real estate expertise
- Context-aware responses based on current prediction
- Responsive dark UI

---

## Run Locally

### Backend

```bash
conda create -n realestate python=3.10
conda activate realestate
pip install -r requirements.txt
cd backend
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## Project Structure

realestate-estimator/
├── backend/
│ ├── main.py
│ ├── api/
│ │ ├── predict.py
│ │ └── chat.py
│ └── models/
│ └── fusion_model.py
├── frontend/
│ └── src/
│ └── App.js
├── notebooks/
│ └── eda.ipynb
└── data/

---

## Author

Sandhya Kumar — [GitHub](https://github.com/sandhyakumar23112004)
