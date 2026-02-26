import os
from typing import Annotated, List, TypedDict
from langgraph.graph import StateGraph, START, END
from langchain_groq import ChatGroq
from langchain_community.tools.tavily_search import TavilySearchResults
from dotenv import load_dotenv

load_dotenv()

class AgentState(TypedDict):
    topic: str
    plan: List[str]
    research_data: List[str]
    report: str # This will hold our final clean Markdown
    steps_taken: int

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0.2, # Lower temperature for more factual, stable writing
    groq_api_key=os.getenv("GROQ_API_KEY")
)

search_tool = TavilySearchResults(max_results=3)

# --- NODES ---

def plan_node(state: AgentState):
    queries = [
        f"current technical status and developments of {state['topic']} in 2026", 
        f"future outlook and strategic predictions for {state['topic']} 2026-2030"
    ]
    return {"plan": queries, "steps_taken": 1}

def research_node(state: AgentState):
    # Determine which query to run based on steps_taken
    idx = state['steps_taken'] - 1
    if idx >= len(state['plan']):
        return state

    query = state['plan'][idx]
    results = search_tool.invoke(query)
    
    # Extract clean content strings
    new_data = [r['content'] for r in results if 'content' in r]
    
    return {
        "research_data": state.get('research_data', []) + new_data, 
        "steps_taken": state['steps_taken'] + 1
    }

def writer_node(state: AgentState):
    """The Synthesis Pass: This removes the 'gaps' and 'gibberish'"""
    
    # We feed the raw data back into the LLM to write a cohesive report
    raw_context = "\n\n".join(state['research_data'])
    
    prompt = f"""
    You are a Senior Technical Analyst. Using the following raw research data, 
    write a comprehensive, SEAMLESS, and professional report on '{state['topic']}'.

    RAW DATA:
    {raw_context}

    STRICT WRITING RULES:
    1. NO GAPS: Do not use [...] or ellipses. Write in full, connected paragraphs.
    2. STRUCTURE: Use Markdown headers (##), bold text for emphasis, and tables for any numerical data.
    3. TONE: Professional, analytical, and forward-looking (2026 focus).
    4. FLOW: Bridge different research points with logical transitions.
    """
    
    response = llm.invoke(prompt)
    
    # We return the content of the LLM response as the 'report'
    return {"report": response.content}

# --- LOGIC ---

def should_continue(state: AgentState):
    if state['steps_taken'] > len(state['plan']):
        return "writer" # Go to synthesis after research is done
    return "research"

# --- BUILD GRAPH ---

workflow = StateGraph(AgentState)

workflow.add_node("planner", plan_node)
workflow.add_node("researcher", research_node)
workflow.add_node("writer", writer_node) # New node!

workflow.set_entry_point("planner")
workflow.add_edge("planner", "researcher")

workflow.add_conditional_edges(
    "researcher", 
    should_continue, 
    {
        "writer": "writer",
        "research": "researcher"
    }
)

workflow.add_edge("writer", END) # Final step

agent_app = workflow.compile()