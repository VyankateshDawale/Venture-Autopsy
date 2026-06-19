"""Execution Agent implementation."""

import json
import uuid
from app.agents.base import BaseAgent
from app.agents.prompts import EXECUTION_AGENT_PROMPT

class ExecutionAgent(BaseAgent):
    async def analyze(self, investigation_id: str, input_data: dict, shared_context: list[dict]) -> dict:
        
        # Build prompt
        messages = [
            {"role": "system", "content": EXECUTION_AGENT_PROMPT},
            {"role": "user", "content": f"Input Data: {json.dumps(input_data)}\nShared Context: {json.dumps(shared_context)}"}
        ]
        
        # Analyze
        # Emit analyzing status BEFORE LLM call
        agent_id = str(uuid.uuid4())
        await self._update_status(investigation_id, agent_id, "analyzing")
        result = await self.gemini_service.complete_json(
            model="gemini-flash-lite-latest",
            messages=messages
        )
        
        # Extract and validate fields
        verdict = result.get("recommendation", "review")
        confidence = result.get("confidence", 0.5)
        reasoning = result.get("summary", "Execution analysis complete.")
        opportunities = result.get("opportunities", [])
        risks = result.get("risks", [])
        resource_requirements = result.get("resource_requirements", [])
        execution_challenges = result.get("execution_challenges", [])
        infrastructure_requirements = result.get("infrastructure_requirements", [])
        
        specialist_requests = []
        if result.get("needs_specialist") and result.get("specialist_type"):
            specialist_requests.append({
                "needs_specialist": True,
                "specialist_type": result.get("specialist_type"),
                "reason": "Execution Agent identified domain complexity requiring specialist."
            })
            
        # Emit findings
        for opp in opportunities:
            await self._emit_finding(investigation_id, agent_id, "opportunity", opp.get("severity", "medium"), opp.get("title", ""), opp.get("description", ""))
        for rsk in risks:
            await self._emit_finding(investigation_id, agent_id, "risk", rsk.get("severity", "medium"), rsk.get("title", ""), rsk.get("description", ""))
            
        for res in resource_requirements:
            await self._emit_finding(investigation_id, agent_id, "resource", "info", f"Resource: {res.get('resource')}", res.get("justification", ""))
        for chal in execution_challenges:
            await self._emit_finding(investigation_id, agent_id, "challenge", "high", f"Challenge: {chal.get('challenge')}", chal.get("impact", ""))
        for infra in infrastructure_requirements:
            await self._emit_finding(investigation_id, agent_id, "infrastructure", "high", f"Infra Req: {infra.get('requirement')}", f"Cost Estimate: {infra.get('cost_estimate', '')}")
            
        await self._update_status(investigation_id, agent_id, "completed")
        
        # Format for State update
        return {
            "opportunities": opportunities,
            "risks": risks,
            "specialist_requests": specialist_requests,
            "agent_verdicts": [{
                "agent_id": agent_id,
                "agent_type": self.name,
                "verdict": verdict,
                "confidence": confidence,
                "reasoning": reasoning
            ,
                "provider": "Gemini"
            }]
        }
