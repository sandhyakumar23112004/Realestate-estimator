from fastapi import APIRouter
from pydantic import BaseModel
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage
from dotenv import load_dotenv
import os

load_dotenv(os.path.join(os.path.dirname(__file__), '../../.env'))

router = APIRouter()

# Initialize Groq LLM
llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model_name="llama-3.3-70b-versatile",
    temperature=0.7
)

SYSTEM_PROMPT = """You are an expert real estate advisor AI assistant. 
You help users understand property prices, market trends, and investment decisions.
You have deep knowledge of real estate markets, property valuation, and investment strategies.
Keep responses concise, helpful, and professional.
When discussing prices, always mention that estimates are based on historical data.
"""

class ChatInput(BaseModel):
    message: str
    context: dict = {}

@router.post("/chat")
def chat(data: ChatInput):
    # Build context string if prediction was made
    context_str = ""
    if data.context:
        context_str = f"""
        Current property being analyzed:
        - Estimated Price: {data.context.get('estimated_price', 'N/A')}
        - Price Range: {data.context.get('range', 'N/A')}
        - Overall Quality: {data.context.get('OverallQual', 'N/A')}
        - Living Area: {data.context.get('GrLivArea', 'N/A')} sqft
        - Year Built: {data.context.get('YearBuilt', 'N/A')}
        """

    messages = [
        SystemMessage(content=SYSTEM_PROMPT + context_str),
        HumanMessage(content=data.message)
    ]

    response = llm.invoke(messages)

    return {
        "response": response.content,
        "model": "llama3-70b-8192"
    }