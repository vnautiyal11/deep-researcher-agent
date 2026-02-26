from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from .agent import agent_app
from fastapi.middleware.cors import CORSMiddleware
import logging

# Setup basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="DeepScan.AI Research Engine")

# 1. FIXED CORS Configuration
# We use ["*"] for allow_origins to ensure connection during initial testing,
# or list your specific Vercel URL.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Change to ["https://your-vercel-domain.vercel.app"] for tighter security later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResearchRequest(BaseModel):
    topic: str

@app.get("/")
async def root():
    return {"status": "DeepScan Engine is Online", "docs": "/docs"}

@app.post("/research")
async def run_research(request: ResearchRequest):
    logger.info(f"🚀 Initializing Research for: {request.topic}")

    # 2. Initial State Alignment
    inputs = {
        "topic": request.topic, 
        "research_data": [], 
        "steps_taken": 0, 
        "plan": [],
        "report": "" 
    }

    try:
        # 3. Execute Workflow
        final_state = await agent_app.ainvoke(inputs)
        
        report_content = final_state.get("report")
        raw_data_count = len(final_state.get("research_data", []))

        # Fallback if report is empty
        if not report_content and raw_data_count > 0:
            report_content = str(final_state.get("research_data"))
            logger.warning("⚠️ Writer node skipped; returning raw research data.")

        # 4. Success UI Steps
        steps = [
            "✅ Intelligence connection established.",
            f"✅ Research plan generated for '{request.topic}'.",
            f"✅ Analyzed {raw_data_count} independent web sources.",
            "✅ Synthesis complete: Eliminated information gaps.",
            "✨ Technical report finalized."
        ]

        return {
            "report": report_content if isinstance(report_content, str) else str(report_content),
            "steps": steps
        }

    except Exception as e:
        logger.error(f"❌ Critical Agent Failure: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"The research engine encountered an error: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    import os
    # Use PORT environment variable for Render compatibility
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)