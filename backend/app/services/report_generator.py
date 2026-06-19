import uuid
import json
from app.models.report import (
    CompiledReport, AgentFinding, Opportunity, Risk, SpecialistFinding, 
    ConflictResolutionSection, ConflictArgument, ExecutiveDecisionSection, 
    FailureScenario, MitigationStrategy, FinalScorecard
)
from app.agents.state import InvestigationState

class ReportCompiler:
    """Deterministic compiler that structures InvestigationState into a final report."""
    
    def __init__(self, db):
        self.db = db
    
    async def compile_report(self, investigation_id: str, state: InvestigationState) -> CompiledReport:
        # 1. Executive Summary & 7. Executive Decision
        exec_report = state.get("report", {})
        executive_summary = exec_report.get("executive_summary", "No executive summary provided.")
        exec_decision = ExecutiveDecisionSection(
            approval_status=exec_report.get("approval_status", "review"),
            decision_rationale=exec_report.get("decision_rationale", ""),
            confidence=state.get("agent_verdicts", [{}])[-1].get("confidence", 0.5) if state.get("agent_verdicts") else 0.5
        )
        
        # 2-5. Findings, Opportunities, Risks, Specialist Findings
        agent_findings = []
        opportunities = []
        risks = []
        specialist_findings = []
        
        for f in state.get("findings", []):
            cat = f.get("category")
            if cat == "opportunity":
                opportunities.append(Opportunity(
                    agent_type=f.get("agent_type", "unknown"),
                    title=f.get("title", ""),
                    description=f.get("description", ""),
                    severity=f.get("severity", "medium")
                ))
            elif cat == "risk":
                risks.append(Risk(
                    agent_type=f.get("agent_type", "unknown"),
                    title=f.get("title", ""),
                    description=f.get("description", ""),
                    severity=f.get("severity", "medium")
                ))
            elif cat == "expert_finding":
                specialist_findings.append(SpecialistFinding(
                    domain=f.get("agent_type", "specialist"),
                    topic=f.get("title", ""),
                    finding=f.get("description", "")
                ))
            else:
                agent_findings.append(AgentFinding(
                    agent_type=f.get("agent_type", "unknown"),
                    topic=f.get("title", ""),
                    description=f.get("description", "")
                ))
                
        # 6. Conflict Resolution
        conflicts = []
        resolution_verdict = state.get("resolution_verdict")
        if state.get("conflicts"):
            for c in state.get("conflicts", []):
                conflicts.append(ConflictResolutionSection(
                    topic=c.get("topic", "Conflict"),
                    description=c.get("description", ""),
                    supporting_arguments=[], 
                    opposing_arguments=[],
                    resolution_verdict=resolution_verdict or "review",
                    resolution_reasoning=state.get("resolution_reasoning", "")
                ))
                
        # 8-9. Failure Scenarios and Mitigations
        failure_sim = exec_report.get("failure_simulation", {})
        scenarios = []
        mitigations = []
        
        for fs in failure_sim.get("scenarios", []):
            scenarios.append(FailureScenario(
                scenario=fs.get("scenario", ""),
                cause=fs.get("cause", ""),
                impact=fs.get("impact", "medium"),
                probability=fs.get("probability", 0.5)
            ))
            
        for m in failure_sim.get("mitigations", []):
            mitigations.append(MitigationStrategy(
                scenario=m.get("scenario", ""),
                strategy=m.get("strategy", "")
            ))
            
        # 10. Final Scorecard
        scorecard = FinalScorecard(
            final_score=exec_report.get("final_score", 0),
            survival_probability=failure_sim.get("survival_probability", 50),
            risk_summary=failure_sim.get("risk_summary", "Review complete.")
        )
        
        # Assemble Final Report
        report_id = uuid.uuid4()
        compiled_report = CompiledReport(
            id=report_id,
            investigation_id=uuid.UUID(investigation_id) if isinstance(investigation_id, str) else investigation_id,
            executive_summary=executive_summary,
            agent_findings=agent_findings,
            opportunities=opportunities,
            risks=risks,
            specialist_findings=specialist_findings,
            conflicts=conflicts,
            executive_decision=exec_decision,
            failure_scenarios=scenarios,
            mitigation_strategies=mitigations,
            scorecard=scorecard
        )
        
        # Persist to DB
        self.db.table("reports").insert(json.loads(compiled_report.model_dump_json())).execute()
        
        # Update investigation status
        self.db.table("investigations").update({"status": "completed", "progress": 100}).eq("id", investigation_id).execute()
        
        return compiled_report
