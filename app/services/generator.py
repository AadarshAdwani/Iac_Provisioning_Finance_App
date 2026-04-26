from crewai import Agent, Task, Crew, LLM

import os

# 1. Use the EXACT model ID: groq/llama-3.1-8b-instant
# 2. Ensure NO SPACES are in the model string
# 3. Explicitly pass the provider if initialization fails
llm = LLM(
    model="groq/llama-3.1-8b-instant", 
    api_key=os.getenv("GROQ_API_KEY"),
)

def generate_response(text: str, intent: str, urgency: str, entities: dict):
    agent = Agent(
        role="Finance Support Assistant",
        goal="Generate short, helpful responses for finance users",
        backstory="You are an AI assistant in a finance app helping users resolve issues quickly.",
        llm=llm,
        verbose=False
    )

    task = Task(
        description=f"""
        User message: "{text}"
        Intent: {intent}
        Urgency: {urgency}
        Data: {entities}

        Instructions:
        - Max 2-3 lines
        - No greetings (no Dear, Hello)
        - No placeholders
        - Be direct, professional, helpful
        """,
        expected_output="Short helpful response",
        agent=agent
    )

    crew = Crew(
        agents=[agent],
        tasks=[task],
        verbose=False
    )

    result = crew.kickoff()
    return str(result).strip()