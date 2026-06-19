"""Technical Agent implementation."""

import json
import uuid
from app.agents.base import BaseAgent
from app.agents.prompts import TECHNICAL_AGENT_PROMPT

class TechnicalAgent(BaseAgent):
    async def analyze(self, investigation_id: str, input_data: dict, shared_context: list[dict]) -> dict:
        
        # Build prompt
        messages = [
            {"role": "system", "content": TECHNICAL_AGENT_PROMPT},
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
        reasoning = result.get("summary", "Technical analysis complete.")
        opportunities = result.get("opportunities", [])
        risks = result.get("risks", [])
        architecture_findings = result.get("architecture_findings", [])
        technical_debt = result.get("technical_debt", [])
        dependency_risks = result.get("dependency_risks", [])
        scalability_concerns = result.get("scalability_concerns", [])
        
        specialist_requests = []
        if result.get("needs_specialist") and result.get("specialist_type"):
            specialist_requests.append({
                "needs_specialist": True,
                "specialist_type": result.get("specialist_type"),
                "reason": "Technical Agent identified infrastructure or security risk requiring specialist."
            })
            
        # Emit findings
        for opp in opportunities:
            await self._emit_finding(investigation_id, agent_id, "opportunity", opp.get("severity", "medium"), opp.get("title", ""), opp.get("description", ""))
        for rsk in risks:
            await self._emit_finding(investigation_id, agent_id, "risk", rsk.get("severity", "medium"), rsk.get("title", ""), rsk.get("description", ""))
            
        for arch in architecture_findings:
            await self._emit_finding(investigation_id, agent_id, "architecture", "info", f"Architecture: {arch.get('component')}", arch.get("finding", ""))
        for debt in technical_debt:
            await self._emit_finding(investigation_id, agent_id, "tech_debt", "high", f"Tech Debt: {debt.get('area')}", debt.get("description", ""))
        for dep in dependency_risks:
            await self._emit_finding(investigation_id, agent_id, "dependency", "high", f"Dependency Risk: {dep.get('dependency')}", dep.get("risk", ""))
        for scale in scalability_concerns:
            await self._emit_finding(investigation_id, agent_id, "scalability", "critical", f"Scalability Bottleneck: {scale.get('bottleneck')}", scale.get("impact", ""))
            
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
