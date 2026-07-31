import os
from pathlib import Path
from groq import Groq
from dotenv import load_dotenv

# Load .env from the project root (one level up from core/)
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

client = Groq(
    api_key=os.getenv("GROQ_API_KEY"),
)

FAST_MODEL = os.getenv("MODEL_FAST")
SCRIPT_MODEL = os.getenv("MODEL_SCRIPT")

def ask(
    prompt,
    system="Be concise.",
    model=None,
    temp=0.7,
    max_tokens=300,
    **kwargs
):
    response = client.chat.completions.create(
        model=model or FAST_MODEL,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": prompt}
        ],
        temperature=temp,
        max_tokens=max_tokens
    )

    return response.choices[0].message.content
