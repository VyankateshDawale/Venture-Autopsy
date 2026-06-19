"""Market Agent implementation."""

import json
import uuid
from app.agents.base import BaseAgent
from app.agents.prompts import MARKET_AGENT_PROMPT

class MarketAgent(BaseAgent):
    async def analyze(self, investigation_id: str, input_data: dict, shared_context: list[dict]) -> dict:
        
        # Build prompt
        messages = [
            {"role": "system", "content": MARKET_AGENT_PROMPT},
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
        reasoning = result.get("summary", "Market analysis complete.")
        opportunities = result.get("opportunities", [])
        risks = result.get("risks", [])
        competitors = result.get("competitors", [])
        
        specialist_requests = []
        if result.get("needs_specialist") and result.get("specialist_type"):
            specialist_requests.append({
                "needs_specialist": True,
                "specialist_type": result.get("specialist_type"),
                "reason": "Market Agent requested domain expertise."
            })
            
        # Emit risks and opportunities
        for opp in opportunities:
            await self._emit_finding(
                investigation_id, agent_id, "opportunity", opp.get("severity", "medium"), opp.get("title", ""), opp.get("description", "")
            )
        for rsk in risks:
            await self._emit_finding(
                investigation_id, agent_id, "risk", rsk.get("severity", "medium"), rsk.get("title", ""), rsk.get("description", "")
            )
            
        # Save competitors to DB as findings or generic metadata
        for comp in competitors:
            await self._emit_finding(
                investigation_id, agent_id, "competitor", comp.get("threat_level", "medium"), f"Competitor: {comp.get('name')}", comp.get("differentiation", "")
            )
            
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
