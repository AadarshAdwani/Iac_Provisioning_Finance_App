from fastapi import APIRouter, HTTPException
import logging

# Ensure these paths match your folder structure (app/services/...)
from app.services.classifier import classify_text
from app.services.ner import extract_entities
from app.services.generator import generate_response

# Set up logging to debug entity extraction in the terminal
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/triage")
async def triage(request: dict):
    try:
        # 1. Extract and validate input
        text = request.get("message")
        if not text:
            raise HTTPException(status_code=400, detail="Message is required")

        logger.info(f"Incoming Request: {text}")

        # 2. Classify Intent and Urgency
        # This calls your Groq/Llama-3.1 model
        classification = classify_text(text)
        logger.info(f"Classification Result: {classification}")

        # 3. Extract Entities (Amount, Date, TXN ID)
        # This calls your Regex/spaCy logic in ner.py
        entities = extract_entities(text)
        logger.info(f"Extracted Entities: {entities}")

        # 4. Generate AI Response
        # Passes the context to the generator agent
        reply = generate_response(
            text=text,
            intent=classification.get("intent", "query"),
            urgency=classification.get("urgency", "normal"),
            entities=entities
        )

        # 5. Return Unified Response
        return {
            "status": "success",
            "classification": classification,
            "entities": entities,
            "reply": reply
        }

    except Exception as e:
        logger.error(f"Error in triage pipeline: {str(e)}")
        return {
            "status": "error",
            "error": str(e)
        }