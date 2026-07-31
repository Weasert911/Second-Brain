from core.llm import ask

def critique_content(step_name, content, style_guide=""):
    prompt = f"""
Critique this YouTube {step_name}.

Focus on:
- curiosity
- emotional tension
- retention
- pacing
- alignment with style: {style_guide}

Return JSON only:
{{
  "score": 0-10,
  "critique": "detailed feedback",
  "improvements": ["list of specific changes"]
}}
"""
    response = ask(f"{prompt}\n\nCONTENT:\n{content}", max_tokens=500)
    
    # Clean JSON
    if "```json" in response:
        response = response.split("```json")[1].split("```")[0].strip()
    elif "```" in response:
        response = response.split("```")[1].split("```")[0].strip()
        
    import json
    try:
        return json.loads(response)
    except:
        return {"score": 5, "critique": "Error parsing critique", "improvements": []}
