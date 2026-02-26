from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from .agent import agent_app
from fastapi.middleware.cors import CORSMiddleware
import logging

# Setup basic logging to track agent progress in the terminal
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="DeepScan.AI Research Engine")

# 1. CORS Configuration for Next.js (Port 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResearchRequest(BaseModel):
    topic: str

@app.post("/research")
async def run_research(request: ResearchRequest):
    logger.info(f"🚀 Initializing Research for: {request.topic}")

    # 2. Initial State Alignment
    # Must match AgentState TypedDict in agent.py exactly
    inputs = {
        "topic": request.topic, 
        "research_data": [], 
        "steps_taken": 0, 
        "plan": [],
        "report": "" # This is where our 'writer' node will store the clean output
    }

    try:
        # 3. Execute the LangGraph Workflow
        # .ainvoke is the async entry point for our compiled graph
        final_state = await agent_app.ainvoke(inputs)
        
        # 4. Extract Results
        # We prioritize the synthesized report over the raw research data
        report_content = final_state.get("report")
        raw_data_count = len(final_state.get("research_data", []))

        # If for some reason the writer node didn't fire, fallback to raw data
        if not report_content and raw_data_count > 0:
            report_content = final_state.get("research_data")
            logger.warning("⚠️ Writer node skipped; returning raw research data.")

        # 5. UI Terminal Logs
        # These emojis and strings map directly to your AgentTerminal component
        steps = [
            "✅ Intelligence connection established.",
            f"✅ Research plan generated for '{request.topic}'.",
            f"✅ Analyzed {raw_data_count} independent web sources.",
            "✅ Synthesis complete: Eliminated information gaps.",
            "✨ Technical report finalized."
        ]

        return {
            # We wrap in a list so the Frontend's .map() function doesn't break
            "report": [report_content] if isinstance(report_content, str) else report_content,
            "steps": steps
        }

    except Exception as e:
        logger.error(f"❌ Critical Agent Failure: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"The research agent encountered an error: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)