import json
import uuid
from app.agents.base import BaseAgent
from app.agents.prompts import SPECIALIST_AGENT_PROMPT, SPECIALIST_PROMPT_TEMPLATES

class SpecialistAgent(BaseAgent):
    """Unified specialist agent that dynamically adapts based on domain."""
    
    def __init__(self, domain: str, provider_router, band_adapter, db, event_bus):
        # Fallback to generic expert if domain is unknown
        persona = SPECIALIST_PROMPT_TEMPLATES.get(domain, SPECIALIST_PROMPT_TEMPLATES["generic"].format(domain=domain))
        
        # Format the final prompt
        self.specialist_prompt = SPECIALIST_AGENT_PROMPT.format(persona_prompt=persona, domain=domain)
        self.domain = domain
        
        super().__init__(
            agent_type=f"specialist_{domain}",
            name=f"{domain.title()} Expert",
            role=f"{domain.title()} Subject Matter Expert",
            gemini_service=gemini_service,
            band_adapter=band_adapter,
            db=db,
            event_bus=event_bus
        )

    async def analyze(self, investigation_id: str, input_data: dict, shared_context: list[dict], agent_verdicts: list[dict] = None) -> dict:
        
        # Build context
        context_str = json.dumps({
            "shared_context": shared_context,
            "core_agent_verdicts": agent_verdicts or []
        })
        
        # Build prompt
        messages = [
            {"role": "system", "content": self.specialist_prompt},
            {"role": "user", "content": f"Input Data: {json.dumps(input_data)}\nContext: {context_str}"}
        ]
        
        # Analyze using Featherless as specified for specialists previously, or general provider
        # We will use 'featherless' as default for specialists as per Phase 7 previous config, or fallback to 'gemini'
        # To be safe, we'll use 'gemini' since it's the default robust model or lookup config. Let's hardcode 'gemini' for now 
        # or use the provider_router default. Actually, in Phase 4 we used "gemini" for the generic expert.
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
        reasoning = result.get("summary", f"Expert analysis complete for {self.domain}.")
        opportunities = result.get("opportunities", [])
        risks = result.get("risks", [])
        expert_findings = result.get("expert_findings", [])
        
        # Emit findings
        for opp in opportunities:
            await self._emit_finding(investigation_id, agent_id, "opportunity", opp.get("severity", "medium"), f"[{self.domain.upper()}] {opp.get('title', '')}", opp.get("description", ""))
        for rsk in risks:
            await self._emit_finding(investigation_id, agent_id, "risk", rsk.get("severity", "medium"), f"[{self.domain.upper()}] {rsk.get('title', '')}", rsk.get("description", ""))
            
        for ef in expert_findings:
            await self._emit_finding(investigation_id, agent_id, "expert_finding", "high", f"[{self.domain.upper()}] {ef.get('topic')}", ef.get("finding", ""))
            
        await self._update_status(investigation_id, agent_id, "completed")
        
        # Emitting recruitment timeline event
        await self._emit_timeline_event(investigation_id, "specialist_recruited", f"Recruited {self.name} for domain analysis.")
        
        # Format for State update
        return {
            "opportunities": opportunities,
            "risks": risks,
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
