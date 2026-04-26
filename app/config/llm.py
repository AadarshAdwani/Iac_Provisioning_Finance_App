from crewai import LLM
import os

# Ensure your key is loaded
api_key = os.getenv("GROQ_API_KEY")

# ✅ NO 'set_env', NO 'base_url', NO spaces in model name
llm = LLM(
    model="groq/llama-3.1-8b-instant",
    api_key=api_key,
    temperature=0.1
)