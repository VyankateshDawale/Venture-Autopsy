'use client';

import { ReactFlow, Background, Controls, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useInvestigationStore } from '@/lib/store';
import { useEffect } from 'react';
import { BrainCircuit, CheckCircle2, Loader2 } from 'lucide-react';

const AgentNode = ({ data }: { data: any }) => {
  const isAnalyzing = data.status === 'analyzing';
  const isCompleted = data.status === 'completed';

  return (
    <div className={`px-4 py-3 rounded-lg border-2 shadow-lg bg-slate-900 flex flex-col items-center gap-2 w-48 transition-all duration-300 ${
      isAnalyzing ? 'border-indigo-500 shadow-indigo-500/20' : 
      isCompleted ? 'border-emerald-500 shadow-emerald-500/10' : 
      'border-slate-700'
    }`}>
      <div className="flex items-center gap-2">
        {isAnalyzing ? (
          <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
        ) : isCompleted ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        ) : (
          <BrainCircuit className="w-5 h-5 text-slate-500" />
        )}
        <span className="font-bold text-slate-200 text-sm">{data.label}</span>
      </div>
      <span className="text-xs text-slate-400 uppercase tracking-widest">{data.role}</span>
    </div>
  );
};

const nodeTypes = {
  agentNode: AgentNode,
};

export function AgentNetwork() {
  const nodes = useInvestigationStore(state => state.nodes);
  const edges = useInvestigationStore(state => state.edges);
  const setNodes = useInvestigationStore(state => state.setNodes);

  // Initialize central nodes
  useEffect(() => {
    if (nodes.length === 0) {
      setNodes([
        {
          id: 'orchestrator',
          position: { x: 400, y: 50 },
          data: { label: 'LangGraph Orchestrator', role: 'System', status: 'completed' },
          type: 'agentNode'
        },
        {
          id: 'shared-context',
          position: { x: 400, y: 450 },
          data: { label: 'Investigation State', role: 'Database', status: 'idle' },
          type: 'agentNode'
        }
      ]);
    }
  }, [nodes.length, setNodes]);

  return (
    <div className="w-full h-full">
      <ReactFlow 
        nodes={nodes} 
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        className="bg-slate-950"
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#334155" gap={24} size={2} />
        <Controls className="bg-slate-800 border-slate-700 fill-slate-300" />
      </ReactFlow>
    </div>
  );
}
