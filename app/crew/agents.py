from crewai import Agent
from config.llm import llm

classification_agent = Agent(
    role="Finance Classifier",
    goal="Classify the intent and urgency of a finance message. Output ONLY raw JSON, no markdown.",
    backstory="Expert in financial issue detection. You always respond with raw JSON only.",
    llm=llm,
    verbose=False,
)

ner_agent = Agent(
    role="NER Specialist",
    goal="Extract amount, date, and transaction ID from a finance message. Output ONLY raw JSON, no markdown.",
    backstory="Expert in extracting financial entities from text. You always respond with raw JSON only.",
    llm=llm,
    verbose=False,
)

response_agent = Agent(
    role="Finance Assistant",
    goal="Generate short helpful finance responses using actual values from the message.",
    backstory="Customer support assistant who always uses specific details from the customer's message.",
    llm=llm,
    verbose=False,
)