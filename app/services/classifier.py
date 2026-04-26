from crewai import Agent, Task, Crew, LLM
import os
import json
import re



# 1. Use the EXACT model ID: groq/llama-3.1-8b-instant
# 2. Ensure NO SPACES are in the model string
# 3. Explicitly pass the provider if initialization fails
llm = LLM(
    model="groq/llama-3.1-8b-instant", 
    api_key=os.getenv("GROQ_API_KEY"),
)

def classify_text(text: str):
    classifier_agent = Agent(
        role="Finance Query Classifier",
        goal="Classify user messages into intent and urgency accurately",
        backstory="Expert in financial support classification.",
        llm=llm,
        verbose=False
    )

    task = Task(
        description=f"""
        Analyze the message: "{text}"

        STRICT RULES:
        - Output ONLY valid JSON
        - No explanation, no extra text

        Format:
        {{
            "intent": "complaint | query | fraud_report | request | update_request",
            "urgency": "low | normal | high"
        }}
        """,
        expected_output="Strict JSON only",
        agent=classifier_agent
    )

    crew = Crew(
        agents=[classifier_agent],
        tasks=[task],
        verbose=False
    )

    result = crew.kickoff()
    
    # Extract string from CrewOutput object
    result_str = str(result)

    try:
        json_match = re.search(r"\{.*\}", result_str, re.DOTALL)
        parsed = json.loads(json_match.group())

        valid_intents = ["complaint", "query", "fraud_report", "request", "update_request"]
        valid_urgency = ["low", "normal", "high"]

        if parsed.get("intent") not in valid_intents:
            parsed["intent"] = "query"
        if parsed.get("urgency") not in valid_urgency:
            parsed["urgency"] = "normal"

        return parsed
    except:
        return {"intent": "query", "urgency": "normal"}