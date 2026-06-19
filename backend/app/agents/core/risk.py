"""Risk Agent implementation."""

import json
import uuid
from app.agents.base import BaseAgent
from app.agents.prompts import RISK_AGENT_PROMPT

class RiskAgent(BaseAgent):
    async def analyze(self, investigation_id: str, input_data: dict, shared_context: list[dict]) -> dict:
        
        # Build prompt
        messages = [
            {"role": "system", "content": RISK_AGENT_PROMPT},
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
        reasoning = result.get("summary", "Risk analysis complete.")
        opportunities = result.get("opportunities", [])
        risks = result.get("risks", [])
        compliance_issues = result.get("compliance_issues", [])
        security_concerns = result.get("security_concerns", [])
        
        specialist_requests = []
        if result.get("needs_specialist") and result.get("specialist_type"):
            specialist_requests.append({
                "needs_specialist": True,
                "specialist_type": result.get("specialist_type"),
                "reason": "Risk Agent identified domain-specific risk requiring specialist."
            })
            
        # Emit all findings
        for opp in opportunities:
            await self._emit_finding(investigation_id, agent_id, "opportunity", opp.get("severity", "medium"), opp.get("title", ""), opp.get("description", ""))
        for rsk in risks:
            await self._emit_finding(investigation_id, agent_id, "risk", rsk.get("severity", "medium"), rsk.get("title", ""), rsk.get("description", ""))
        for comp in compliance_issues:
            await self._emit_finding(investigation_id, agent_id, "compliance", "high", f"Compliance Issue: {comp.get('framework')}", comp.get("description", ""))
        for sec in security_concerns:
            await self._emit_finding(investigation_id, agent_id, "security", "critical", f"Security Concern: {sec.get('vulnerability')}", sec.get("description", ""))
            
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
