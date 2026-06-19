"""Conflict detection and resolution service."""

import json
import uuid
from app.agents.base import BaseAgent
from app.services.gemini import GeminiService
from app.agents.prompts import CONFLICT_RESOLUTION_PROMPT

class ConflictResolver:
    VERDICT_SCORES = {
        'strong_approve': 5,
        'approve': 4,
        'conditional_approve': 3,
        'neutral': 2,
        'reject': 1,
        'strong_reject': 0
    }

    @classmethod
    def detect_conflicts(cls, agent_verdicts: list[dict]) -> list[dict]:
        """Detect conflicts if verdicts diverge by more than 2 levels."""
        if not agent_verdicts:
            return []
            
        scores = [(av["agent_type"], cls.VERDICT_SCORES.get(av["verdict"], 2)) for av in agent_verdicts]
        if not scores:
            return []
            
        max_score = max(scores, key=lambda x: x[1])
        min_score = min(scores, key=lambda x: x[1])
        
        conflicts = []
        if (max_score[1] - min_score[1]) > 2:
            conflicts.append({
                "topic": "Fundamental Verdict Divergence",
                "description": f"Significant disagreement between {max_score[0]} (positive) and {min_score[0]} (negative).",
                "participants": [
                    {"agent_type": max_score[0], "position": "positive"},
                    {"agent_type": min_score[0], "position": "negative"}
                ]
            })
        return conflicts

class ConflictResolverAgent(BaseAgent):
    """Agent wrapper for conflict resolution."""
    async def analyze(self, investigation_id: str, input_data: dict, shared_context: list[dict], agent_verdicts: list[dict] = None) -> dict:
        
        conflicts = ConflictResolver.detect_conflicts(agent_verdicts)
        if not conflicts:
            await self._update_status(investigation_id, agent_id, "completed")
            return {}
            
        # For simplicity, resolve the first conflict
        conflict = conflicts[0]
        
        messages = [
            {"role": "system", "content": CONFLICT_RESOLUTION_PROMPT},
            {"role": "user", "content": f"Conflict Topic: {conflict.get('topic')}\nDescription: {conflict.get('description')}\nParticipants: {conflict.get('participants')}"}
        ]
        
        # Emit analyzing status BEFORE LLM call
        
        agent_id = str(uuid.uuid4())
        
        await self._update_status(investigation_id, agent_id, "analyzing")
        
        result = await self.gemini_service.complete_json(model="gemini-flash-lite-latest", messages=messages)
        
        resolution_verdict = result.get("resolution_verdict", "review")
        resolution_reasoning = result.get("resolution_reasoning", "Compromise reached.")
        confidence = result.get("confidence", 0.5)
        
        await self._emit_timeline_event(
            investigation_id=investigation_id,
            title="Conflict Resolved",
            description=f"Resolved conflict: {conflict.get('topic')}",
            event_type="resolution",
            agent_id=agent_id
        )
        
        await self._update_status(investigation_id, agent_id, "completed")
        
        return {
            "agent_verdicts": [{
                "agent_id": agent_id,
                "agent_type": self.name,
                "verdict": resolution_verdict,
                "confidence": confidence,
                "reasoning": resolution_reasoning,
                "provider": "Gemini"
            }]
        }
