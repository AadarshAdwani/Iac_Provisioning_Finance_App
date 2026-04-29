from crewai import Crew
from app.crew.agents import classification_agent, ner_agent, response_agent
from app.crew.tasks import classification_task, ner_task, response_task

crew = Crew(
    agents=[
        classification_agent,
        ner_agent,
        response_agent
    ],
    tasks=[
        classification_task,
        ner_task,
        response_task
    ],
    verbose=True
)