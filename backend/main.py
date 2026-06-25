"""Venture Autopsy — FastAPI Backend Entry Point."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api.routes import investigations, agents, reports, websocket


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown lifecycle."""
    # Startup
    print("========================================")
    if settings.APP_MODE == "mock":
        print("[ MOCK MODE ]")
        print("Running with simulated backend services.")
    else:
        print("[ LIVE MODE ]")
        print("Running with real API integrations.")
    print("========================================")
    print("Venture Autopsy backend starting...")
    print(f"   Supabase: {settings.SUPABASE_URL[:40]}...")
    yield
    # Shutdown
    print("Venture Autopsy backend shutting down...")


app = FastAPI(
    title="Venture Autopsy",
    description="Multi-Agent Enterprise Due Diligence Platform",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(investigations.router, prefix="/api", tags=["Investigations"])
app.include_router(agents.router, prefix="/api", tags=["Agents"])
app.include_router(reports.router, prefix="/api", tags=["Reports"])
app.include_router(websocket.router, tags=["WebSocket"])


@app.get("/health")
async def health():
    return {"status": "healthy", "service": "venture-autopsy"}
