from crewai import Task
from app.crew.agents import classification_agent, ner_agent, response_agent

classification_task = Task(
    description="Classify intent and urgency from text. Return JSON.",
    agent=classification_agent
)

ner_task = Task(
    description="Extract amount, date, transaction_id. Return JSON.",
    agent=ner_agent
)

response_task = Task(
    description="Generate short response using classification + entities",
    agent=response_agent
)