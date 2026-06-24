import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from parent .env file
parent_env = Path(__file__).resolve().parent.parent / ".env"
if parent_env.exists():
    load_dotenv(parent_env)

# Monkeypatch EventManager.register_events_from_module to fix getstream.models startswith error
import vision_agents.core.events.manager

def patched_register(self, module, prefix='', ignore_not_compatible=True):
    for name, class_ in module.__dict__.items():
        if name.endswith("Event"):
            t = getattr(class_, "type", "")
            if t is None:
                t = ""
            if not prefix or t.startswith(prefix):
                self.register(class_, ignore_not_compatible=ignore_not_compatible)
                self._modules.setdefault(module.__name__, []).append(class_)

vision_agents.core.events.manager.EventManager.register_events_from_module = patched_register

# Import vision-agents modules
from vision_agents.core import Agent, Runner, User
from vision_agents.core.agents import AgentLauncher
from vision_agents.plugins import getstream, openai

async def create_agent(**kwargs) -> Agent:
    # Set default/fallback system prompt
    instructions = (
        "You're Sofia, a warm, energetic, and encouraging AI language teacher. "
        "Speak mostly English, and teach the target language through English. "
        "Use short, natural sentences with contractions and gentle encouragement. "
        "Keep your replies to one or two conversational sentences, and never use markdown, bullets, or asterisks."
    )
    
    # Initialize OpenAI Realtime LLM with a voice and send_video disabled for voice-only interaction
    llm = openai.Realtime(voice="alloy", send_video=False)
    
    # Initialize Stream transport
    edge = getstream.Edge()
    
    # Set up Agent user
    agent_user = User(name="AI Teacher", id="ai-teacher")
    
    # Create the agent instance
    return Agent(
        edge=edge,
        llm=llm,
        agent_user=agent_user,
        instructions=instructions
    )

async def join_call(agent: Agent, call_type: str, call_id: str, **kwargs) -> None:
    print(f"Agent starting connection for call: {call_type}/{call_id}")
    call = await agent.create_call(call_type, call_id)
    
    target_language = "the selected language"
    teacher_name = "Sofia"
    lesson_title = "Language Practice"
    ai_teacher_prompt = ""
    goals = []
    vocabulary = []
    phrases = []
    
    # Query call custom metadata to determine dynamic context (language, user name, etc.)
    try:
        call_details = await call.get()
        custom = getattr(call_details.call, "custom", {}) or {}
        language_id = custom.get("languageId", "")
        language_name = custom.get("languageName", "")
        lesson_id = custom.get("lessonId", "")
        lesson_title = custom.get("lessonTitle", "Language Practice")
        user_name = custom.get("userName", "Student")
        goals = custom.get("goals", [])
        vocabulary = custom.get("vocabulary", [])
        phrases = custom.get("phrases", [])
        ai_teacher_prompt = custom.get("aiTeacherPrompt", "")
        
        # Map languageId to name as fallback
        lang_map = {
            'es': 'Spanish',
            'fr': 'French',
            'ja': 'Japanese',
            'ko': 'Korean',
            'de': 'German',
            'zh': 'Chinese'
        }
        if language_name:
            target_language = language_name
        elif language_id in lang_map:
            target_language = lang_map[language_id]
            
        print(f"Dynamic Context: Language={target_language}, Lesson={lesson_id} ({lesson_title}), User={user_name}")
    except Exception as e:
        print(f"Could not retrieve call custom metadata: {e}")
        
    # Format metadata lists for LLM consumption
    goals_text = "\n".join([f"- {g}" for g in goals]) if goals else "None"
    
    vocab_items = []
    for v in vocabulary:
        if isinstance(v, dict):
            word = v.get("word", "")
            trans = v.get("translation", "")
            pron = f" (pronounced: {v.get('pronunciation', '')})" if v.get("pronunciation") else ""
            vocab_items.append(f"- {word}: {trans}{pron}")
        else:
            vocab_items.append(f"- {v}")
    vocab_text = "\n".join(vocab_items) if vocab_items else "None"
    
    phrases_items = []
    for p in phrases:
        if isinstance(p, dict):
            phrase = p.get("phrase", "")
            trans = p.get("translation", "")
            pron = f" (pronounced: {p.get('pronunciation', '')})" if p.get("pronunciation") else ""
            phrases_items.append(f"- {phrase}: {trans}{pron}")
        else:
            phrases_items.append(f"- {p}")
    phrases_text = "\n".join(phrases_items) if phrases_items else "None"
        
    # Configure dynamic system prompt for voice-first experience
    system_prompt = (
        f"You are {teacher_name}, a warm, human, energetic, and lesson-focused AI language teacher. "
        f"You mostly speak English and teach {target_language} through English. "
        f"We are teaching the lesson: '{lesson_title}'.\n\n"
    )
    
    if ai_teacher_prompt:
        system_prompt += f"Teacher Guidelines:\n{ai_teacher_prompt}\n\n"
        
    system_prompt += (
        f"Lesson Goals:\n{goals_text}\n\n"
        f"Vocabulary to practice:\n{vocab_text}\n\n"
        f"Phrases to practice:\n{phrases_text}\n\n"
        "Act like a real-world language teacher for this specific lesson. "
        "Stay strictly within the lesson's goals, vocabulary, phrases, and context. Do not teach unrelated topics or switch to other languages.\n"
        "Always speak mostly English, introducing target-language words slowly with translations. "
        "Use short, natural sentences with contractions and gentle encouragement. "
        "Listen to the user's response, adapt your next explanation accordingly, and ask the student to repeat or try again.\n"
        "Keep replies to one or two conversational sentences (under 30 words). "
        "Crucial: Never use markdown formatting, bullets, bolding, or asterisks. Keep the speech clean, warm, and natural."
    )
    
    # Set instructions on agent and LLM
    agent.instructions = system_prompt
    if hasattr(agent.llm, "set_instructions"):
        agent.llm.set_instructions(system_prompt)
        
    # Join and run agent lifecycle
    async with agent.join(call):
        print(f"Agent joined call successfully: {call_type}/{call_id}")
        await agent.finish()
    print(f"Agent finished call: {call_type}/{call_id}")

if __name__ == "__main__":
    launcher = AgentLauncher(create_agent=create_agent, join_call=join_call)
    runner = Runner(launcher)
    runner.cli()
