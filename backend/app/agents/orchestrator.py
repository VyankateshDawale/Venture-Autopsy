"""LangGraph orchestrator for Venture Autopsy."""

import asyncio
from langgraph.graph import StateGraph, END
from app.agents.state import InvestigationState
from app.agents.registry import AgentRegistry
from app.services.report_generator import ReportCompiler

async def initialize_investigation(state: InvestigationState) -> InvestigationState:
    from app.api.deps import get_event_bus
    event_bus = get_event_bus()
    investigation_id = state.get("investigation_id")
    
    await event_bus.emit(investigation_id, "timeline_event", {
        "event_type": "system",
        "title": "Investigation Started",
        "description": "Orchestration Pipeline Initialized. Spawning core agents."
    })
    
    return {"status": "initializing", "progress": 5}

async def join_core_agents(state: InvestigationState) -> InvestigationState:
    return {"status": "agents_joining", "progress": 10}

async def _run_agent(agent_type: str, state: InvestigationState) -> dict:
    from app.api.deps import get_supabase, get_event_bus
    from app.services.gemini import GeminiService
    
    db = get_supabase()
    gemini_service = GeminiService()
    event_bus = get_event_bus()
    
    agent = AgentRegistry.create_agent(agent_type, gemini_service, db, event_bus)
    return await agent.analyze(
        state.get("investigation_id"),
        state.get("input_data", {}),
        state.get("shared_context", [])
    )

async def investment_analysis(state: InvestigationState) -> InvestigationState:
    return await _run_agent("investment", state)

async def market_analysis(state: InvestigationState) -> InvestigationState:
    return await _run_agent("market", state)

async def technical_analysis(state: InvestigationState) -> InvestigationState:
    return await _run_agent("technical", state)

async def risk_analysis(state: InvestigationState) -> InvestigationState:
    return await _run_agent("risk", state)

async def execution_analysis(state: InvestigationState) -> InvestigationState:
    return await _run_agent("execution", state)

async def collect_results(state: InvestigationState) -> InvestigationState:
    return {"status": "analyzing", "progress": 70}

def check_specialist_needs(state: InvestigationState) -> str:
    if state.get("specialist_requests"):
        return "recruit_specialists"
    return "detect_conflicts"

async def recruit_specialists(state: InvestigationState) -> InvestigationState:
    requests = state.get("specialist_requests", [])
    unique_domains = set()
    for req in requests:
        if isinstance(req, dict) and req.get("needs_specialist"):
            domain = req.get("specialist_type")
            if domain:
                unique_domains.add(domain)
                
    return {
        "status": "recruiting_specialists", 
        "progress": 75,
        "active_specialist_domains": list(unique_domains)
    }

async def specialist_analysis(state: InvestigationState) -> InvestigationState:
    from app.api.deps import get_supabase, get_event_bus
    from app.services.gemini import GeminiService
    
    db = get_supabase()
    gemini_service = GeminiService()
    event_bus = get_event_bus()
    
    domains = state.get("active_specialist_domains", [])
    if not domains:
        return {"progress": 80}
        
    specialists = []
    for domain in domains:
        agent = AgentRegistry.create_specialist(domain, gemini_service, db, event_bus)
        specialists.append(agent)
        
    investigation_id = state.get("investigation_id")
    input_data = state.get("input_data", {})
    shared_context = state.get("shared_context", [])
    agent_verdicts = state.get("agent_verdicts", [])
    
    results = await asyncio.gather(
        *[agent.analyze(investigation_id, input_data, shared_context, agent_verdicts) for agent in specialists],
        return_exceptions=True
    )
    
    valid_results = [r for r in results if isinstance(r, dict)]
    
    return {
        "progress": 80,
        "specialist_results": valid_results
    }

async def collect_specialist_results(state: InvestigationState) -> InvestigationState:
    results = state.get("specialist_results", [])
    all_findings = state.get("findings", [])
    all_verdicts = state.get("agent_verdicts", [])
    
    for res in results:
        if "findings" in res:
            all_findings.extend(res["findings"])
        if "agent_verdicts" in res:
            all_verdicts.extend(res["agent_verdicts"])
            
    return {
        "status": "specialist_analysis_complete",
        "progress": 85,
        "findings": all_findings,
        "agent_verdicts": all_verdicts
    }

async def detect_conflicts(state: InvestigationState) -> InvestigationState:
    from app.services.conflict_resolution import ConflictResolver
    conflicts = ConflictResolver.detect_conflicts(state.get("agent_verdicts", []))
    return {"conflicts": conflicts}

def route_conflicts(state: InvestigationState) -> str:
    if state.get("conflicts"):
        return "resolve_conflicts"
    return "executive_review"

async def resolve_conflicts(state: InvestigationState) -> InvestigationState:
    from app.api.deps import get_supabase, get_event_bus
    from app.services.gemini import GeminiService
    
    db = get_supabase()
    gemini_service = GeminiService()
    event_bus = get_event_bus()
    investigation_id = state.get("investigation_id")
    
    agent = AgentRegistry.create_agent("conflict_resolution", gemini_service, db, event_bus)
    
    res = await agent.analyze(
        investigation_id,
        state.get("input_data", {}),
        state.get("shared_context", []),
        state.get("agent_verdicts", [])
    )
    
    return {"progress": 90, **res}

async def executive_review(state: InvestigationState) -> InvestigationState:
    from app.api.deps import get_supabase, get_event_bus
    from app.services.gemini import GeminiService
    
    db = get_supabase()
    gemini_service = GeminiService()
    event_bus = get_event_bus()
    
    agent = AgentRegistry.create_agent("executive_review", gemini_service, db, event_bus)
    
    res = await agent.analyze(
        state.get("investigation_id"),
        state.get("input_data", {}),
        state.get("shared_context", []),
        state.get("agent_verdicts", [])
    )
    return {"progress": 95, **res}

async def simulate_failures(state: InvestigationState) -> InvestigationState:
    from app.api.deps import get_supabase, get_event_bus
    from app.services.gemini import GeminiService
    
    db = get_supabase()
    gemini_service = GeminiService()
    event_bus = get_event_bus()
    
    agent = AgentRegistry.create_agent("failure_simulation", gemini_service, db, event_bus)
    
    res = await agent.analyze(
        state.get("investigation_id"),
        state.get("input_data", {}),
        state.get("shared_context", []),
        state.get("agent_verdicts", [])
    )
    return {"progress": 98, **res}

async def generate_report(state: InvestigationState) -> InvestigationState:
    from app.api.deps import get_supabase, get_event_bus
    db = get_supabase()
    event_bus = get_event_bus()
    
    compiler = ReportCompiler(db)
    investigation_id = state.get("investigation_id")
    
    report_data = await compiler.compile_report(investigation_id, state)
    
    await event_bus.emit(investigation_id, "timeline_event", {
        "event_type": "success",
        "title": "Investigation Completed",
        "description": "All agents have finished. The final report is ready."
    })
    
    return {"status": "completed", "progress": 100}

# Build graph
workflow = StateGraph(InvestigationState)

workflow.add_node("initialize", initialize_investigation)
workflow.add_node("join_core_agents", join_core_agents)
workflow.add_node("investment_analysis", investment_analysis)
workflow.add_node("market_analysis", market_analysis)
workflow.add_node("technical_analysis", technical_analysis)
workflow.add_node("risk_analysis", risk_analysis)
workflow.add_node("execution_analysis", execution_analysis)
workflow.add_node("collect_results", collect_results)
workflow.add_node("recruit_specialists", recruit_specialists)
workflow.add_node("specialist_analysis", specialist_analysis)
workflow.add_node("collect_specialist_results", collect_specialist_results)
workflow.add_node("detect_conflicts", detect_conflicts)
workflow.add_node("resolve_conflicts", resolve_conflicts)
workflow.add_node("executive_review", executive_review)
workflow.add_node("simulate_failures", simulate_failures)
workflow.add_node("generate_report", generate_report)

workflow.set_entry_point("initialize")
workflow.add_edge("initialize", "join_core_agents")

# Fan-out
workflow.add_edge("join_core_agents", "investment_analysis")
workflow.add_edge("join_core_agents", "market_analysis")
workflow.add_edge("join_core_agents", "technical_analysis")
workflow.add_edge("join_core_agents", "risk_analysis")
workflow.add_edge("join_core_agents", "execution_analysis")

# Fan-in
workflow.add_edge("investment_analysis", "collect_results")
workflow.add_edge("market_analysis", "collect_results")
workflow.add_edge("technical_analysis", "collect_results")
workflow.add_edge("risk_analysis", "collect_results")
workflow.add_edge("execution_analysis", "collect_results")

# Conditional: Specialists
workflow.add_conditional_edges("collect_results", check_specialist_needs)
workflow.add_edge("recruit_specialists", "specialist_analysis")
workflow.add_edge("specialist_analysis", "collect_specialist_results")
workflow.add_edge("collect_specialist_results", "detect_conflicts")

# Conditional: Conflicts
workflow.add_conditional_edges("detect_conflicts", route_conflicts)
workflow.add_edge("resolve_conflicts", "executive_review")

# End flow
workflow.add_edge("executive_review", "simulate_failures")
workflow.add_edge("simulate_failures", "generate_report")
workflow.add_edge("generate_report", END)

orchestrator_graph = workflow.compile()

async def run_investigation(
    investigation_id: str,
    db,
    gemini_service,
    event_bus
) -> None:
    with open("orchestrator_debug.log", "a") as f:
        f.write(f"\\n--- Starting investigation {investigation_id} ---\\n")
        try:
            from app.services.investigation_service import get_investigation_service
            f.write("Imported get_investigation_service\\n")
            
            investigation = get_investigation_service().get_investigation(investigation_id)
            f.write("Got investigation from DB\\n")
            input_data = investigation.get("input_data", {})
            
            initial_state = {
                "investigation_id": investigation_id,
                "input_data": input_data,
                "status": "started",
                "progress": 0,
                "findings": [],
                "risks": [],
                "opportunities": [],
                "agent_verdicts": [],
                "shared_context": [],
                "specialist_requests": [],
                "conflicts": [],
                "report_id": None
            }
            
            f.write("Starting orchestrator.astream()...\\n")
            async for output in orchestrator_graph.astream(initial_state):
                f.write(f"Graph Output: {list(output.keys())}\\n")
                for node_name, state_update in output.items():
                    if isinstance(state_update, dict) and "status" in state_update:
                        await event_bus.emit(investigation_id, "investigation_progress", {
                            "status": state_update.get("status"),
                            "progress": state_update.get("progress", 0)
                        })
                
            f.write("Orchestrator finished astream().\\n")
                
        except Exception as e:
            import traceback
            tb = traceback.format_exc()
            f.write(f"Orchestrator crashed:\\n{tb}\\n")
            await event_bus.emit(investigation_id, "timeline_event", {
                "event_type": "error",
                "title": "Investigation Failed",
                "description": f"Orchestrator encountered a fatal error: {str(e)}"
            })
