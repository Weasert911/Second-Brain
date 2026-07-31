import json
import os

STYLE_FILE = "yt_factory/style.json"
BRAND_FILE = "yt_factory/brand_profile.json"
CHARACTER_FILE = "yt_factory/main_character.json"

def load_style():
    if os.path.exists(STYLE_FILE):
        with open(STYLE_FILE, "r") as f:
            return json.load(f)
    return {}

def load_brand():
    if os.path.exists(BRAND_FILE):
        with open(BRAND_FILE, "r") as f:
            return json.load(f)
    return {}

def load_character():
    if os.path.exists(CHARACTER_FILE):
        with open(CHARACTER_FILE, "r") as f:
            return json.load(f)
    return {}

def get_style_prompt():
    style = load_style()
    brand = load_brand()
    char = load_character()
    
    char_visuals = char.get('visuals', {})
    char_desc = f"{char_visuals.get('style', '')}, {char_visuals.get('clothing', '')}, {char_visuals.get('eyes', '')}, {char_visuals.get('expression', '')}"

    return f"""
Brand: {brand.get('channel_name', 'Unknown')}
Identity: {brand.get('identity', 'N/A')}
Main Character: {char.get('name', 'Unknown')} ({char_desc})
Tone: {', '.join(brand.get('tone', []) + style.get('tone', []))}
Visual Style: {', '.join(brand.get('visual_style', []))}
Avoid: {', '.join(brand.get('avoid', []) + style.get('avoid', []))}
Patterns: {', '.join(style.get('hook_patterns', []))}
"""


