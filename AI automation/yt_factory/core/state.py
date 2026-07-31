import json
import os

def get_state_path(project_id):
    return f"yt_factory/projects/{project_id}/state.json"

def load_state(project_id="default"):
    state_path = get_state_path(project_id)
    if os.path.exists(state_path):
        with open(state_path, "r") as f:
            return json.load(f)
    return {
        "config": {"form": "long"},
        "topic": {"approved": False, "current_version": 0, "selected": None},
        "title": {"approved": False, "current_version": 0, "selected": None},
        "hook": {"approved": False, "current_version": 0, "selected": None},
        "script": {"approved": False, "current_version": 0, "selected": None},
        "scenes": {"approved": False, "current_version": 0, "selected": None},
        "thumbnail": {"approved": False, "current_version": 0, "selected": None},
    }

def save_state(state, project_id="default"):
    state_path = get_state_path(project_id)
    os.makedirs(os.path.dirname(state_path), exist_ok=True)
    with open(state_path, "w") as f:
        json.dump(state, f, indent=2)

def update_step(step_name, approved=None, selected=None, project_id="default"):
    state = load_state(project_id)
    if approved is not None:
        state[step_name]["approved"] = approved
    if selected is not None:
        state[step_name]["selected"] = selected
        state[step_name]["current_version"] = state[step_name]["current_version"] + 1
    save_state(state, project_id)
