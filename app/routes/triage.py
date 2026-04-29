# app/routes/triage.py
from fastapi import APIRouter, HTTPException
import logging
import json
import re
from crew.crew_setup import crew

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

def safe_parse_json(text: str) -> dict:
    if not text:
        return {}
    
    try:
        # 1. Strip markdown fences (```json ... ``` or ``` ... ```)
        cleaned = re.sub(r"```(?:json)?\s*", "", text).replace("```", "").strip()
        
        # 2. Try direct parse
        return json.loads(cleaned)
    except Exception:
        pass

    try:
        # 3. Find first { ... } block (handles leading/trailing prose)
        match = re.search(r"\{.*?\}", text, re.DOTALL)
        if match:
            return json.loads(match.group())
    except Exception:
        pass

    try:
        # 4. Find outermost { ... } block (handles nested JSON)
        start = text.index("{")
        end = text.rindex("}") + 1
        return json.loads(text[start:end])
    except Exception:
        pass

    logger.warning(f"Could not parse JSON from: {repr(text)}")
    return {}


@router.post("/triage")
async def triage(request: dict):
    try:
        text = request.get("message")
        if not text:
            raise HTTPException(status_code=400, detail="Message is required")

        logger.info(f"Incoming Request: {text}")

        result = crew.kickoff(inputs={"message": text})

        tasks = result.tasks_output

        classification = {}
        entities = {}
        reply = ""

        if len(tasks) >= 1:
            logger.info(f"Raw classifier output: {repr(tasks[0].raw)}")
            classification = safe_parse_json(tasks[0].raw)

        if len(tasks) >= 2:
            logger.info(f"Raw NER output: {repr(tasks[1].raw)}")
            entities = safe_parse_json(tasks[1].raw)

        if len(tasks) >= 3:
            logger.info(f"Raw reply output: {repr(tasks[2].raw)}")
            reply = tasks[2].raw.strip()
        else:
            reply = result.raw.strip()

        logger.info(f"Parsed classification: {classification}")
        logger.info(f"Parsed entities: {entities}")
        logger.info(f"Parsed reply: {reply}")

        # Normalise amount — model sometimes returns string like "2000" or 2000
        amount = entities.get("amount")
        if amount is not None:
            amount = str(amount) if not isinstance(amount, str) else amount

        return {
            "status": "success",
            "classification": {
                "intent": classification.get("intent", "unknown"),
                "urgency": classification.get("urgency", "normal"),
            },
            "entities": {
                "amount": amount,
                "date": entities.get("date"),
                "transaction_id": entities.get("transaction_id"),
            },
            "reply": reply,
        }

    except Exception as e:
        logger.error(f"Error in triage pipeline: {str(e)}", exc_info=True)
        return {
            "status": "error",
            "error": str(e)
        }