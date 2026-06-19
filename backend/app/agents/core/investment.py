"""Investment Agent implementation."""

import json
import uuid
from app.agents.base import BaseAgent
from app.agents.prompts import INVESTMENT_AGENT_PROMPT

class InvestmentAgent(BaseAgent):
    async def analyze(self, investigation_id: str, input_data: dict, shared_context: list[dict]) -> dict:
        
        
        # Build prompt
        messages = [
            {"role": "system", "content": INVESTMENT_AGENT_PROMPT},
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
        
        # Extract fields matching new strict schema
        verdict = result.get("verdict", "neutral")
        confidence = result.get("confidence", 0.5)
        reasoning = result.get("reasoning", "Analysis complete.")
        findings = result.get("findings", [])
        specialist_requests = result.get("specialist_requests", [])
        
        # 2. Emit each finding individually
        for f in findings:
            await self._emit_finding(
                investigation_id=investigation_id,
                agent_id=agent_id,
                category=f.get("category", "finding"),
                severity=f.get("severity", "medium"),
                title=f.get("title", "Investment Finding"),
                description=f.get("description", "")
            )
            
        await self._update_status(investigation_id, agent_id, "completed")
        
        # Format for State update
        return {
            "findings": findings,
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
