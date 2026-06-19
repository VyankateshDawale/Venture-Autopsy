import { useCallback, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import AgentNode from './AgentNode';
import { useInvestigationStore } from '@/store/useInvestigationStore';

const nodeTypes = {
  agent: AgentNode,
};

export default function AgentGraph() {
  const { agents } = useInvestigationStore();
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);

  // Transform store agents into React Flow nodes
  useEffect(() => {
    const agentList = Object.values(agents);
    if (agentList.length === 0) return;

    // Simple layout strategy for now: orchestrator at top, core agents in middle, specialists below
    const newNodes: any[] = [];
    const newEdges: any[] = [];

    // Add Orchestrator (Implicit)
    newNodes.push({
      id: 'orchestrator',
      type: 'agent',
      position: { x: 400, y: 50 },
      data: {
        label: 'Orchestrator',
        role: 'Coordinator',
        status: 'analyzing',
        provider: 'System'
      }
    });

    const coreAgents = agentList.filter(a => !a.type.includes('specialist') && a.type !== 'conflict_resolution' && a.type !== 'executive_review');
    const specialistAgents = agentList.filter(a => a.type.includes('specialist'));
    const resolutionAgents = agentList.filter(a => a.type === 'conflict_resolution' || a.type === 'executive_review');

    // Layout Core Agents
    coreAgents.forEach((agent, i) => {
      const spacing = 250;
      const startX = 400 - ((coreAgents.length - 1) * spacing) / 2;
      
      newNodes.push({
        id: agent.id,
        type: 'agent',
        position: { x: startX + (i * spacing), y: 200 },
        data: {
          label: agent.name,
          role: agent.role,
          status: agent.status,
          provider: agent.provider
        }
      });

      newEdges.push({
        id: `orch-${agent.id}`,
        source: 'orchestrator',
        target: agent.id,
        animated: agent.status === 'analyzing',
        style: { stroke: '#475569' },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#475569' }
      });
    });

    // Layout Specialists
    specialistAgents.forEach((agent, i) => {
      const spacing = 250;
      const startX = 400 - ((specialistAgents.length - 1) * spacing) / 2;
      
      newNodes.push({
        id: agent.id,
        type: 'agent',
        position: { x: startX + (i * spacing), y: 350 },
        data: {
          label: agent.name,
          role: agent.role,
          status: agent.status,
          provider: agent.provider
        }
      });

      newEdges.push({
        id: `orch-${agent.id}`,
        source: 'orchestrator',
        target: agent.id,
        animated: agent.status === 'analyzing',
        style: { stroke: '#8b5cf6' },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' }
      });
    });

    // Layout Resolution Agents
    resolutionAgents.forEach((agent, i) => {
      newNodes.push({
        id: agent.id,
        type: 'agent',
        position: { x: 400, y: 500 + (i * 150) },
        data: {
          label: agent.name,
          role: agent.role,
          status: agent.status,
          provider: agent.provider
        }
      });

      newEdges.push({
        id: `orch-${agent.id}`,
        source: 'orchestrator',
        target: agent.id,
        animated: agent.status === 'analyzing',
        style: { stroke: '#f59e0b' },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' }
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [agents, setNodes, setEdges]);

  return (
    <div className="w-full h-full bg-slate-950/50 rounded-xl border border-white/5 overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        className="bg-transparent"
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={2} color="#1e293b" />
        <Controls className="!bg-slate-900 !border-slate-800 !fill-slate-400" />
      </ReactFlow>
    </div>
  );
}
