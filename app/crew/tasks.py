from crewai import Task
from crew.agents import classification_agent, ner_agent, response_agent

classification_task = Task(
    description="""
    Classify the user's finance message below.

    MESSAGE: {message}

    STRICT RULES:
    - Output ONLY valid JSON, no extra text, no markdown fences

    {{
      "intent": "complaint | query | fraud_report | request | update_request",
      "urgency": "low | normal | high"
    }}
    """,
    expected_output='Valid JSON with intent and urgency fields only',
    agent=classification_agent,
)

ner_task = Task(
    description="""
    Extract financial entities from the user's message below.

    MESSAGE: {message}

    STRICT RULES:
    - Output ONLY valid JSON, no extra text, no markdown fences
    - If a field is not found, use null

    {{
      "amount": <number or null>,
      "date": "<string or null>",
      "transaction_id": "<string or null>"
    }}
    """,
    expected_output='Valid JSON with amount, date, and transaction_id fields only',
    agent=ner_agent,
)

response_task = Task(
    description="""
    The user sent this finance message: {message}

    Using the classification and extracted entities from previous tasks,
    generate a short professional response.

    RULES:
    - Max 2-3 lines
    - No greetings
    - No placeholders like [date] or [amount] — use the actual values
    - Be direct and helpful
    - Acknowledge the specific details (amount, date, transaction ID) if present
    """,
    expected_output='Short helpful 2-3 line finance response',
    agent=response_agent,
    context=[classification_task, ner_task],
)