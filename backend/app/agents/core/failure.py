import json
import uuid
from app.agents.base import BaseAgent
from app.agents.prompts import FAILURE_SIMULATION_PROMPT

class FailureSimulationAgent(BaseAgent):
    """Red Team Failure Simulator Agent."""
    
    async def analyze(self, investigation_id: str, input_data: dict, shared_context: list[dict], agent_verdicts: list[dict] = None) -> dict:
        
        # Fetch findings from DB
        findings_res = self.db.table("findings").select("*").eq("investigation_id", investigation_id).execute()
        db_findings = findings_res.data or []
        
        # Build prompt context
        context = {
            "findings": db_findings,
            "shared_context": shared_context,
            "agent_verdicts": agent_verdicts or []
        }
        
        messages = [
            {"role": "system", "content": FAILURE_SIMULATION_PROMPT},
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
        failure_scenarios = result.get("failure_scenarios", [])
        mitigations = result.get("mitigations", [])
        risk_summary = result.get("risk_summary", "Failure simulation complete.")
        survival_probability = result.get("survival_probability", 50)
        
        await self._emit_timeline_event(
            investigation_id, 
            "Failure Simulation Complete", 
            f"Simulated {len(failure_scenarios)} scenarios. Survival Prob: {survival_probability}%.",
            event_type="failure_simulation",
            agent_id=agent_id
        )
        
        await self._update_status(investigation_id, agent_id, "completed")
        
        return {
            "failure_simulation": {
                "scenarios": failure_scenarios,
                "mitigations": mitigations,
                "risk_summary": risk_summary,
                "survival_probability": survival_probability,
                "provider": "Gemini"
            }
        }
