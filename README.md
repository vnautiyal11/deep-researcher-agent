🧠 System Architecture
The agent follows a Stateful Graph workflow:Planner Node: Analyzes the user query and generates N specific search research targets.
Researcher Node: Executes concurrent searches via Tavily, collecting raw data and citations.
Synthesizer Node: Performs a "Reasoning Pass" using Llama 3.3 to cross-reference data and remove contradictions.
Writer Node: Formats the final state into a professional Markdown report.

🚀 Getting Started
1. Clone & Install Backend
cd backend
python -m venv venv
source venv/bin/activate  # venv\Scripts\activate on Windows
pip install -r requirements.txt

2. Environment Setup
Create a .env file in the backend folder:
Code snippet
GROQ_API_KEY=your_gsk_key
TAVILY_API_KEY=your_tvly_key


3. Launch the System
Backend:
uvicorn app.main:app --reload --port 8000

Frontend:
cd frontend
npm install
npm run dev

✨ Key Features
Real-Time Terminal: A live execution log showing the agent's "chain of thought" as it works.

Adaptive UI: Full Dark/Light mode support with a modern Glassmorphism aesthetic.

Markdown Reports: Beautifully rendered research findings with bold headers and technical lists.

Stateful Memory: Uses LangGraph to ensure the agent doesn't repeat searches and covers all planned topics.

📈 Future Roadmap
[ ] PDF Export: Allow users to download research as formatted documents.

[ ] Multi-Source Verification: Integration with ArXiv and PubMed for academic validation.

[ ] Human-in-the-loop: Ability for users to approve the search plan before execution.