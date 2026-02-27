# DeepScan.AI — Autonomous Deep Research Agent

An AI-powered research engine that autonomously searches the web, synthesizes multiple sources, and generates comprehensive technical reports — all from a single query.

🌐 **Live App:** [deep-researcher-multiagent.vercel.app](https://deep-researcher-multiagent.vercel.app)
⚙️ **API:** [deepscan-2mrc.onrender.com](https://deepscan-2mrc.onrender.com)

---

## How It Works

1. You enter a research topic
2. The AI agent generates a research plan
3. It autonomously searches and scrapes multiple web sources
4. It synthesizes the data and eliminates information gaps
5. A structured Markdown report is returned in the UI

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | FastAPI, Python |
| AI Agent | LangGraph, LangChain |
| Deployment | Vercel (frontend), Render (backend) |

---

## Project Structure

```
deep-researcher-agent/
├── backend/
│   ├── app/
│   │   ├── agent.py        # LangGraph agent workflow
│   │   ├── main.py         # FastAPI server
│   │   ├── schema.py       # Pydantic models
│   │   └── tools.py        # Web search & scraping tools
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env
└── frontend/
    ├── app/
    │   ├── page.tsx         # Main page
    │   └── layout.tsx
    └── components/
        ├── ResearchForm.tsx  # Search input
        ├── AgentTerminal.tsx # Live step tracker
        └── ReportViewer.tsx  # Markdown report renderer
```

---

## Running Locally

### Prerequisites
- Python 3.10+
- Node.js 18+
- API keys for your LLM and search provider (set in `backend/.env`)

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create `backend/.env`:
```
OPENAI_API_KEY=your_key_here
TAVILY_API_KEY=your_key_here   # or whichever search API you use
```

Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Deployment

### Backend → Render
- Connect your GitHub repo to [Render](https://render.com)
- Set root directory to `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Add your environment variables in Render's dashboard

> **Note:** The free tier spins down after 15 min of inactivity. The first request may take 30–60 seconds to wake up. Use [UptimeRobot](https://uptimerobot.com) (free) to keep it alive.

### Frontend → Vercel
- Connect your GitHub repo to [Vercel](https://vercel.com)
- Set root directory to `frontend`
- Add environment variable: `NEXT_PUBLIC_API_URL=https://your-render-url.onrender.com`
- Vercel auto-deploys on every push to `main`

---

## API Reference

### `POST /research`

**Request:**
```json
{ "topic": "your research topic here" }
```

**Response:**
```json
{
  "report": "## Full Markdown Report...",
  "steps": [
    "✅ Intelligence connection established.",
    "✅ Research plan generated.",
    "✅ Analyzed 5 independent web sources.",
    "✅ Synthesis complete.",
    "✨ Technical report finalized."
  ]
}
```

### `GET /`
Health check — returns engine status.

---
Screenshots:
<img width="1898" height="770" alt="image" src="https://github.com/user-attachments/assets/b3387e90-1084-49d6-b330-5d04b6a15013" />
<img width="1251" height="660" alt="image" src="https://github.com/user-attachments/assets/813b7c3d-67ea-4545-8b44-10f46d277fda" />
<img width="1227" height="630" alt="image" src="https://github.com/user-attachments/assets/7b49ca8c-51d6-4ea7-83fc-63debeeab2cc" />

## License

MIT
