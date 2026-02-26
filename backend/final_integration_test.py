import os
import sys
from dotenv import load_dotenv

# Add current directory to path so it can find 'app'
sys.path.append(os.getcwd())

from app.agent import agent_app

def run_full_system_check():
    print("🚀 STARTING FULL SYSTEM DIAGNOSTIC (Groq + LangGraph + Tavily)\n")
    
    # 1. Check Environment Variables
    load_dotenv()
    keys = ["GROQ_API_KEY", "TAVILY_API_KEY"]
    for key in keys:
        if not os.getenv(key):
            print(f"❌ MISSING: {key} is not set in .env")
            return
    print("✅ Environment Variables Loaded.")

    # 2. Define a Test Topic
    test_topic = "Advancements in Solid State Batteries 2026"
    print(f"📡 Initializing Agent for Topic: '{test_topic}'...")

    initial_state = {
        "topic": test_topic,
        "plan": [],
        "research_data": [],
        "steps_taken": 0,
        "report": ""
    }

    try:
        # 3. Run the actual LangGraph Agent
        print("🤖 Agent is thinking and searching (this may take 10-15 seconds)...")
        final_state = agent_app.invoke(initial_state)

        # 4. Validate Output
        if final_state.get("research_data"):
            print(f"\n✅ SUCCESS: Agent completed {final_state['steps_taken']} steps.")
            print(f"📊 Data Points Found: {len(final_state['research_data'])}")
            print("-" * 30)
            print("SAMPLE FINDING:")
            print(final_state['research_data'][0][:200] + "...")
            print("-" * 30)
        else:
            print("⚠️ WARNING: Agent finished but no research data was collected.")

    except Exception as e:
        print(f"❌ SYSTEM CRASH: {str(e)}")
        print("\nTIP: Ensure you ran 'pip install langchain-groq' and your keys are valid.")

if __name__ == "__main__":
    run_full_system_check()