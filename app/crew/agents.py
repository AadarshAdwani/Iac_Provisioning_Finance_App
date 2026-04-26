from crewai import Agent
from app.config.llm import llm

classification_agent = Agent(
    role="Finance Classifier",
    goal="Classify intent and urgency",
    backstory="Expert in financial issue detection",
    llm=llm
)

ner_agent = Agent(
    role="NER Specialist",
    goal="Extract amount, date, transaction ID",
    backstory="Expert in extracting financial entities",
    llm=llm
)

response_agent = Agent(
    role="Finance Assistant",
    goal="Generate short helpful responses",
    backstory="Customer support assistant",
    llm=llm
)