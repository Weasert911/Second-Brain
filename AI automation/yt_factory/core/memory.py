import json
import os

MEMORY_FILE = "yt_factory/memory.json"

def load_memory():
    if os.path.exists(MEMORY_FILE):
        with open(MEMORY_FILE, "r") as f:
            return json.load(f)
    return {"high_performing_hooks": [], "high_performing_titles": [], "high_performing_scripts": []}

def save_to_memory(category, content):
    memory = load_memory()
    if category in memory:
        memory[category].append(content)
        with open(MEMORY_FILE, "w") as f:
            json.dump(memory, f, indent=2)

def get_memory_prompt(category):
    memory = load_memory()
    examples = memory.get(category, [])
    if not examples:
        return ""
    return f"\n\nSuccessful examples for reference:\n" + "\n".join([f"- {ex}" for ex in examples])
