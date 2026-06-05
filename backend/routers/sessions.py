# routers/sessions.py

from fastapi import APIRouter
from memory.chat_memory import session_store

router = APIRouter()

@router.get("/")
async def get_sessions():

    sessions = []

    for session_id, messages in session_store.items():

        title = "New Chat"

        for msg in messages:
            if msg.__class__.__name__ == "HumanMessage":
                title = msg.content[:40]
                break

        sessions.append({
            "id": session_id,
            "title": title
        })

    return sessions