import json
import uuid
from app.agents.base import BaseAgent
from app.agents.prompts import EXECUTIVE_REVIEW_PROMPT

class ExecutiveAgent(BaseAgent):
    """Executive Review Agent to synthesize the final decision."""
    
    # Intentionally omitted __init__ to inherit from BaseAgent
    # BaseAgent takes: agent_type, name, role, gemini_service, db, event_bus

    async def analyze(self, investigation_id: str, input_data: dict, shared_context: list[dict], agent_verdicts: list[dict] = None) -> dict:
        # In orchestrator.py, the call is: await agent.analyze(investigation_id, state.get("input_data"), state.get("shared_context"), state.get("agent_verdicts"))
        # But wait, orchestrator.py in Phase 9 was changed to:
        # res = await agent.analyze(state.get("investigation_id"), state.get("input_data"), state.get("shared_context"), state.get("agent_verdicts"))
        # So we just take input_data, shared_context, agent_verdicts and we should get other state stuff if needed.
        # Wait, the prompt needs findings, risks, opportunities! 
        # Actually I can fetch them from the DB if they aren't passed, but orchestrator doesn't pass the full state anymore.
        # Let me just use the DB to get findings.
        
        # Fetch findings from DB
        findings_res = self.db.table("findings").select("*").eq("investigation_id", investigation_id).execute()
        db_findings = findings_res.data or []
        
        # Build prompt context
        context = {
            "input_data": input_data,
            "shared_context": shared_context,
            "findings": db_findings,
            "agent_verdicts": agent_verdicts or []
        }
        
        messages = [
            {"role": "system", "content": EXECUTIVE_REVIEW_PROMPT},
            {"role": "user", "content": f"Full Investigation State Context:\n{json.dumps(context)}"}
        ]
        
        # Analyze
        # Emit analyzing status BEFORE LLM call
        agent_id = str(uuid.uuid4())
        await self._update_status(investigation_id, agent_id, "analyzing")
        result = await self.gemini_service.complete_json(
            model="gemini-flash-lite-latest",
            messages=messages
        )
        
        # Extract fields
        verdict = result.get("approval_status", "review")
        confidence = result.get("confidence", 0.5)
        reasoning = result.get("decision_rationale", "Final decision reached.")
        executive_summary = result.get("executive_summary", "")
        
        await self._emit_timeline_event(
            investigation_id, 
            "Executive Review Complete", 
            f"Verdict: {verdict.upper()}",
            event_type="executive_decision",
            agent_id=agent_id
        )
        
        await self._update_status(investigation_id, agent_id, "completed")
        
        # Update State
        return {
            "agent_verdicts": [{
                "agent_id": agent_id,
                "agent_type": self.name,
                "verdict": verdict,
                "confidence": confidence,
                "reasoning": reasoning,
                "provider": "Gemini"
            }],
            "report": {
                "executive_summary": executive_summary,
                "key_opportunities": result.get("key_opportunities", []),
                "key_risks": result.get("key_risks", []),
                "final_score": result.get("final_score", 0),
                "approval_status": verdict,
                "decision_rationale": reasoning
            }
        }
