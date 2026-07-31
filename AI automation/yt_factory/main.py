import os
import datetime
from core.pipeline import TopicStep, TitleStep, HookStep, ScriptStep, SceneStep, ThumbnailStep
from core.state import load_state, save_state, update_step

def save_final_output(project_id, state):
    output_dir = f"yt_factory/output/{project_id}"
    os.makedirs(output_dir, exist_ok=True)
    
    for step_name, data in state.items():
        if data["selected"]:
            filename = f"{step_name}.txt"
            if step_name == "scenes":
                filename = "scenes.json"
            
            with open(f"{output_dir}/{filename}", "w", encoding="utf-8") as f:
                f.write(data["selected"])
    
    print(f"\nFinal output saved to {output_dir}")

def run_pipeline(project_id=None, form="long"):
    if project_id is None:
        # Generate a new unique project_id based on timestamp
        project_id = datetime.datetime.now().strftime("video_%Y%m%d_%H%M%S")
    
    print(f"\n--- Truly Dan Creative OS | {project_id} ({form}-form) ---")
    
    # Initial Project Control
    choice = input("[r] Resume | [s] Start Fresh | [q] Quit\n> ").lower()
    if choice == 's':
        save_state({
            "topic": {"approved": False, "current_version": 0, "selected": None},
            "title": {"approved": False, "current_version": 0, "selected": None},
            "hook": {"approved": False, "current_version": 0, "selected": None},
            "script": {"approved": False, "current_version": 0, "selected": None},
            "scenes": {"approved": False, "current_version": 0, "selected": None},
            "thumbnail": {"approved": False, "current_version": 0, "selected": None},
        }, project_id=project_id)
        print("Project reset.")
    elif choice == 'q':
        return

    steps = [
        TopicStep(),
        TitleStep(),
        HookStep(),
        ScriptStep(),
        SceneStep(),
        ThumbnailStep()
    ]
    
    context = ""
    idx = 0
    while idx < len(steps):
        step = steps[idx]
        result = step.run(context, project_id=project_id, form=form)
        
        if result == "BACK":
            idx = max(0, idx - 1)
            # Unapprove the step we are going back to
            update_step(steps[idx].name, approved=False, project_id=project_id)
            print(f"Going back to {steps[idx].name}...")
        else:
            context = result
            idx += 1
    
    state = load_state(project_id)
    save_final_output(project_id, state)
    print("\nPipeline complete!")

if __name__ == "__main__":
    # For CLI testing, we can ask for project_id and form
    pid = input("Project ID (press Enter for new): ").strip()
    if not pid:
        pid = None
    f = input("Form [long/short] (default long): ").strip().lower()
    if not f:
        f = "long"
    
    run_pipeline(project_id=pid if pid else None, form=f)
