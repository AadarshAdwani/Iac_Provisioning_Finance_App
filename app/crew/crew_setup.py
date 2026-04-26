from crewai import Crew
from app.crew.tasks import classification_task, ner_task, response_task

crew = Crew(
    agents=[
        classification_task.agent,
        ner_task.agent,
        response_task.agent
    ],
    tasks=[
        classification_task,
        ner_task,
        response_task
    ],
    verbose=True
)