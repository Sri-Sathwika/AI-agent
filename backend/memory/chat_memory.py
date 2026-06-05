from langchain_core.messages import (
    HumanMessage,
    AIMessage
)

session_store = {}


def get_session_history(session_id: str):
    if session_id not in session_store:
        session_store[session_id] = []

    return session_store[session_id]


def add_user_message(
    session_id: str,
    message: str
):
    history = get_session_history(session_id)

    history.append(
        HumanMessage(content=message)
    )


def add_ai_message(
    session_id: str,
    message: str
):
    history = get_session_history(session_id)

    history.append(
        AIMessage(content=message)
    )