from fastapi import APIRouter
from pydantic import BaseModel
from agents.rag_agent import rag_agent
from langchain_core.messages import HumanMessage
from memory.chat_memory import (
    get_session_history,
    add_user_message,
    add_ai_message
)

router = APIRouter()

# @router.get("/")
# def chat_test():
#     return {"message":"Chat router works"}

class ChatRequest(BaseModel):
    session_id:str
    message:str

@router.post("/")
async def chat(request: ChatRequest):
    add_user_message(
    request.session_id,
    request.message
)
    messages = get_session_history(
    request.session_id
)
    print("\n=== SESSION HISTORY ===")

    for msg in messages:
        print(type(msg).__name__, ":", msg.content[:100])
    result = rag_agent.invoke(
    {
        "messages": messages
    }
)
    last_message = result["messages"][-1]

    if isinstance(last_message.content, list):
        answer = ""

        for item in last_message.content:
            if isinstance(item, dict) and item.get("type") == "text":
                answer += item.get("text", "")

    else:
        answer = str(last_message.content)
    print(type(answer))
    print(answer)   
    add_ai_message(
    request.session_id,
    answer
)

    return {
    "answer": answer,
    "sources":result.get("sources",[])
}