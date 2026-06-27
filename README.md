# Venture Autopsy

Venture Autopsy is a multi-agent due diligence platform where specialized AI agents investigate startups, repositories, and enterprise proposals, recruit experts, resolve conflicts, simulate failures, and generate executive investment recommendations.

## Features

*   **Multi-Agent Orchestration**: A dynamic team of AI agents, each with specialized roles (e.g., Financial Analyst, Technical Reviewer, Market Researcher).
*   **Real-Time Dashboard**: See investigations unfold in real-time with WebSockets.
*   **Graph Visualization**: View how agents connect and interact using an interactive node graph.
*   **Timeline Feed**: A live feed of the events, findings, and discussions from the agents.
*   **Automated Reporting**: At the end of an investigation, an executive summary report is automatically generated based on the agents' findings.

## Tech Stack

### Frontend
*   **Next.js** (App Router)
*   **TypeScript**
*   **Tailwind CSS** (for styling)
*   **Zustand** (for state management)
*   **Framer Motion** (for animations)
*   **Lucide React** (icons)
*   **Axios** (API requests)

### Backend
*   **FastAPI** (Python web framework)
*   **Pydantic** (Data validation)
*   **Google Gemini API** (LLM provider)
*   **Supabase** (PostgreSQL Database & Vector Store)
*   **GitHub API** (For code/repository analysis)
*   **WebSockets** (Real-time updates)

## Setup and Installation

### Prerequisites
*   Node.js (v18+)
*   Python (3.10+)
*   Supabase Account
*   Google Gemini API Key
*   GitHub Personal Access Token (for repo analysis)

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install the Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set up your environment variables. Copy `.env.example` to `.env` and fill in your keys:
   ```bash
   # .env
   GEMINI_API_KEY="your-gemini-key"
   GITHUB_TOKEN="your-github-token"
   SUPABASE_URL="your-supabase-url"
   SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-key"
   APP_MODE="production"
   ```
4. Run the FastAPI development server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install Node.js dependencies:
   ```bash
   npm install
   ```
3. Set up the environment variables. Create a `.env.local` file:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_WS_URL=ws://localhost:8000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

*   **Frontend**: Easily deployable on [Vercel](https://vercel.com/) by setting the `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_WS_URL` environment variables to your production backend URL.
*   **Backend**: Can be deployed on services like [Railway](https://railway.app/) or Render using the included `Procfile` and `railway.json`.

## License

MIT
