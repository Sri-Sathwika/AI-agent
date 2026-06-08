print("RAG START")

from typing import TypedDict,Annotated,Sequence
from langgraph.graph import StateGraph,START,END
from vectorstore.chroma_manager import get_retriever
print("AFTER RETRIEVER IMPORT")
from langchain_google_genai import ChatGoogleGenerativeAI
print("AFTER FEMINI IMPORT")
from langchain_core.messages import BaseMessage,SystemMessage,HumanMessage,ToolMessage
from langchain_core.tools import tool
from operator import add as add_messages
from dotenv import load_dotenv
load_dotenv()

llm=ChatGoogleGenerativeAI(model="gemini-2.5-flash-lite",temperature=0)

@tool
def retriever_tool(query: str):
    """Search uploaded documents and return relevant chunks with sources."""
    retriever = get_retriever()

    docs = retriever.invoke(query)

    if not docs:
        return {
            "context": "No relevant information found.",
            "sources": []
        }

    sources = []
    chunks = []

    for doc in docs:

        source = doc.metadata.get(
            "source",
            "Unknown Source"
        )

        page = doc.metadata.get(
            "page",
            0
        )

        chunk = doc.page_content

        chunks.append(
            f"""
Source: {source}
Page: {page}

{chunk}
"""
        )

        sources.append({
            "source": source,
            "page": page,
            "content": chunk
        })

    return {
        "context": "\n\n".join(chunks),
        "sources": sources
    }


tools = [retriever_tool]

llm = llm.bind_tools(tools)

class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]


def should_continue(state: AgentState):
    """Check if the last message contains tool calls."""
    result = state['messages'][-1]
    return hasattr(result, 'tool_calls') and len(result.tool_calls) > 0



system_prompt = """
You are an expert research assistant.

Use ONLY information
present in retrieved documents.

Rules:

1. Give detailed answers.

2. Use bullet points.

3. Mention document names.

4. Mention page numbers.

5. Summarize all relevant chunks.

6. If information is found,
do not say "I don't know".

7. Use markdown formatting.

8. End every answer with:

Sources:
- document name (page)
"""

tools_dict = {our_tool.name: our_tool for our_tool in tools} # Creating a dictionary of our tools

# LLM Agent
def call_llm(state: AgentState) -> AgentState:
    """Function to call the LLM with the current state."""
    messages = list(state['messages'])
    messages = [SystemMessage(content=system_prompt)] + messages
    message = llm.invoke(messages)
    return {'messages': [message]}


# Retriever Agent
def take_action(state: AgentState) -> AgentState:
    """Execute tool calls from the LLM's response."""

    tool_calls = state["messages"][-1].tool_calls

    results = []

    for t in tool_calls:

        print(
            f"Calling Tool: {t['name']} with query: "
            f"{t['args'].get('query', 'No query provided')}"
        )

        if t["name"] not in tools_dict:

            result = (
                "Incorrect Tool Name. "
                "Please retry with a valid tool."
            )

        else:

            result = tools_dict[
                t["name"]
            ].invoke(
                t["args"].get(
                    "query",
                    ""
                )
            )

            print(
                f"Result length: {len(str(result))}"
            )

        results.append(
            ToolMessage(
                tool_call_id=t["id"],
                name=t["name"],
                content=str(result)
            )
        )

    print(
        "Tools Execution Complete. Back to the model!"
    )

    return {
        "messages": results
    }


graph = StateGraph(AgentState)
graph.add_node("llm", call_llm)
graph.add_node("retriever_agent", take_action)

graph.add_conditional_edges(
    "llm",
    should_continue,
    {True: "retriever_agent", False: END}
)
graph.add_edge("retriever_agent", "llm")
graph.set_entry_point("llm")

rag_agent = graph.compile()

print("RAG END")

def running_agent():
    print("\n=== RAG AGENT===")

    while True:
        user_input = input("\nWhat is your question: ")
        if user_input.lower() in ['exit', 'quit']:
            break

        messages = [HumanMessage(content=user_input)] # converts back to a HumanMessage type

        result = rag_agent.invoke({"messages": messages})

        print("\n=== ANSWER ===")
        print(result['messages'][-1].content)


# running_agent()