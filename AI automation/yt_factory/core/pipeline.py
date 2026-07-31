import os
from core.llm import ask
from core.critic import critique_content
from core.style import get_style_prompt
from core.memory import get_memory_prompt, save_to_memory
from core.state import load_state, update_step

class PipelineStep:
    def __init__(self, name, prompt_template, memory_category=None):
        self.name = name
        self.prompt_template = prompt_template
        self.memory_category = memory_category

    def generate(self, context, previous_content=None, suggestion=None, **kwargs):
        style_prompt = get_style_prompt()
        memory_prompt = get_memory_prompt(self.memory_category) if self.memory_category else ""
        
        prompt_parts = [style_prompt, self.prompt_template, f"Context: {context}", memory_prompt]
        
        if previous_content:
            prompt_parts.append(f"\nPREVIOUS OUTPUT:\n{previous_content}")
        
        if suggestion:
            prompt_parts.append(f"\nUSER FEEDBACK CONSTRAINTS:\n{suggestion}\n\nSTRICT RULE:\nYou must apply all constraints. Treat them as requirements, not suggestions.")
        
        full_prompt = "\n".join(filter(None, prompt_parts))
        
        print(f"DEBUG: ask is {ask}")
        content = ask(full_prompt, **kwargs)
        return content

    def run(self, context, project_id="default", form="long"):
        state = load_state(project_id)
        if state[self.name]["approved"]:
            print(f"Step {self.name} already approved. Skipping.")
            return state[self.name]["selected"]

        previous_content = None
        last_suggestion = None

        while True:
            print(f"\n--- Generating {self.name} ---")
            content = self.generate(context, previous_content=previous_content, suggestion=last_suggestion, form=form)
            
            # Critique
            print(f"Critiquing {self.name}...")
            critique = critique_content(self.name, content, get_style_prompt())
            print(f"Score: {critique['score']}/10")
            print(f"Feedback: {critique['critique']}")

            # Review Loop
            decision, value = self.review(content, critique)
            
            if decision == 'approve':
                if self.memory_category:
                    save_to_memory(self.memory_category, value)
                
                update_step(self.name, approved=True, selected=value, project_id=project_id)
                return value
            elif decision == 'regenerate':
                previous_content = content
                last_suggestion = value
                # loop continues
            elif decision == 'edit':
                if self.memory_category:
                    save_to_memory(self.memory_category, value)
                update_step(self.name, approved=True, selected=value, project_id=project_id)
                return value
            elif decision == 'back':
                return "BACK"
            elif decision == 'quit':
                os._exit(0)

    def review(self, content, critique):
        print("\n" + "-"*30)
        print(f" {self.name.upper()} | Score: {critique['score']}/10")
        print("-"*30)
        print(f"CRITIQUE: {critique['critique']}")
        print("-" * 10)
        print(content)
        print("-"*30)

        while True:
            choice = input("\n[y] approve | [n] regenerate | [e] edit | [b] back | [q] quit\n> ").lower()
            if choice == 'y':
                return 'approve', content
            elif choice == 'n':
                suggestion = input("\nWhat should change? (or press enter to skip suggestion)\n> ")
                return 'regenerate', suggestion
            elif choice == 'e':
                edited = input("\nPaste edited version:\n")
                return 'edit', edited
            elif choice == 'b':
                return 'back', None
            elif choice == 'q':
                os._exit(0)

class TopicStep(PipelineStep):
    def __init__(self):
        super().__init__("topic", "Generate one emotionally provocative psychology video idea. Focus on 'quietly dangerous observations' about human behavior. Avoid generic self-improvement.", "high_performing_topics")

class TitleStep(PipelineStep):
    def __init__(self):
        super().__init__("title", "Generate 5 clickable YouTube titles. Style: Short, direct, emotionally loaded. Examples: 'Why People Stop Respecting You', 'The Most Dangerous Type of Loneliness'.", "high_performing_titles")

class HookStep(PipelineStep):
    def __init__(self):
        super().__init__("hook", "Write a 15 second hook. This is the most critical part of the video. It must be fast-paced, emotionally sharp, and create immediate tension. Avoid generic intros.", "high_performing_hooks")

class ScriptStep(PipelineStep):
    def __init__(self):
        super().__init__("script", "Write a YouTube psychology script. Tone: cold, observational, detached analysis. Focus on documenting hidden human behavior. Style: conversational, sharp, cinematic, concise.", "high_performing_scripts")
    
    def generate(self, context, previous_content=None, suggestion=None, **kwargs):
        form = kwargs.get("form", "long")
        form_instruction = "\nFORM: " + ("Short-form (under 60 seconds)" if form == "short" else "Long-form (2 minutes)")
        
        # We need to modify the prompt. Since the prompt is in __init__, we can't easily change it here without overriding.
        # Instead, I'll append the form instruction to the prompt.
        
        style_prompt = get_style_prompt()
        memory_prompt = get_memory_prompt(self.memory_category) if self.memory_category else ""
        
        prompt_parts = [style_prompt, self.prompt_template, f"Context: {context}", memory_prompt, form_instruction]
        
        if previous_content:
            prompt_parts.append(f"\nPREVIOUS OUTPUT:\n{previous_content}")
        
        if suggestion:
            prompt_parts.append(f"\nUSER FEEDBACK CONSTRAINTS:\n{suggestion}\n\nSTRICT RULE:\nYou must apply all constraints. Treat them as requirements, not suggestions.")
        
        full_prompt = "\n".join(filter(None, prompt_parts))
        
        return ask(full_prompt, max_tokens=1000 if form == "long" else 400)

class SceneStep(PipelineStep):
    def __init__(self):
        super().__init__("scenes", "Break the script into 10 simple MS Paint style scenes. Return JSON only: [ { \"scene\":1, \"visual\":\"\", \"caption\":\"\" } ]")
    
    def generate(self, context, previous_content=None, suggestion=None, **kwargs):
        content = super().generate(context, previous_content=previous_content, suggestion=suggestion, **kwargs)
        
        # Clean JSON
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
        return content

class ThumbnailStep(PipelineStep):

    def __init__(self):
        super().__init__("thumbnail", "Generate minimalist thumbnail concept. Style: white background, black doodle character, red highlight, 3 word text.")
