"use client";

import { useEffect, useState, use, useRef } from "react";
import { useInvestigationStore } from "@/store/useInvestigationStore";
import { investigationApi } from "@/lib/api";
import AgentGraph from "@/components/Network/AgentGraph";
import TimelineFeed from "@/components/Dashboard/TimelineFeed";
import SharedContextPanel from "@/components/Dashboard/SharedContextPanel";
import ExecutiveSummary from "@/components/Dashboard/ExecutiveSummary";
import { Activity, ShieldAlert, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ReactFlowProvider } from "@xyflow/react";

export default function InvestigationDashboard({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const { setInvestigationId, connectWebSocket, disconnectWebSocket, status, progress, report } = useInvestigationStore();

  const hasStarted = useRef(false);

  useEffect(() => {
    useInvestigationStore.getState().reset();
    setInvestigationId(id);
    connectWebSocket(id);
    
    // Fetch investigation to check status. If pending, start it.
    investigationApi.getInvestigation(id)
      .then(data => {
        useInvestigationStore.setState({ status: data.status });
        if (data.status === 'pending' && !hasStarted.current) {
          hasStarted.current = true;
          // Delay start by 1s to guarantee WebSocket is fully connected 
          // so we don't miss the initial "Investigation Started" event.
          setTimeout(() => {
            investigationApi.start(id).catch(console.error);
          }, 1000);
        }
      })
      .catch(console.error);

    return () => {
      disconnectWebSocket();
    };
  }, [id, setInvestigationId, connectWebSocket, disconnectWebSocket]);

  useEffect(() => {
    if (status === 'completed' && !report) {
      // Fetch the final report once complete
      investigationApi.getReport(id).then(data => {
        useInvestigationStore.setState({ report: data });
      }).catch(err => console.error("Failed to fetch report:", err));

      // Fetch historical data to populate the dashboard UI
      Promise.all([
        investigationApi.getAgents(id),
        investigationApi.getTimeline(id),
        investigationApi.getContext(id)
      ]).then(([agentsData, timelineData, contextData]) => {
        const agentsMap: Record<string, any> = {};
        agentsData.forEach((a: any) => {
           agentsMap[a.id] = { ...a, type: a.agent_type, name: a.agent_name };
        });
        useInvestigationStore.setState({ 
          agents: agentsMap,
          events: timelineData.reverse().map((t: any) => ({ ...t, type: t.event_type })),
          sharedContext: contextData
        });
      }).catch(console.error);
    }
  }, [status, report, id]);

  return (
    <div className="min-h-screen bg-black text-slate-200 flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-white/10 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 -ml-2 rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-indigo-500" />
              Investigation Command Center
            </h1>
            <p className="text-xs text-slate-400 font-mono">ID: {id}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">System Status</p>
              <p className="text-sm font-medium text-emerald-400 capitalize flex items-center gap-2 justify-end">
                {status === 'completed' ? 'Completed' : 'Analyzing'}
                {status !== 'completed' && <Activity className="w-4 h-4 animate-pulse" />}
              </p>
            </div>
          </div>
          
          <div className="w-32 bg-slate-900 rounded-full h-2 overflow-hidden border border-white/5">
            <div 
              className="bg-indigo-500 h-full rounded-full transition-all duration-1000 ease-in-out" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 p-6 grid grid-cols-12 gap-6 relative">
        
        {/* Left Column: Timeline & Context */}
        <div className="col-span-3 flex flex-col gap-6 sticky top-24 h-[calc(100vh-8rem)]">
          <div className="flex-1 min-h-0">
            <TimelineFeed />
          </div>
          <div className="flex-1 min-h-0">
            <SharedContextPanel />
          </div>
        </div>

        {/* Center/Right: Network Graph & Report */}
        <div className="col-span-9 flex flex-col gap-6">
          <div className="h-[500px] shrink-0 rounded-xl overflow-hidden border border-white/5 bg-slate-950/40 relative">
            <ReactFlowProvider>
              <AgentGraph />
            </ReactFlowProvider>
            
            {/* Overlay Title */}
            <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur border border-white/10 px-4 py-2 rounded-lg z-10 pointer-events-none">
              <h2 className="text-sm font-bold text-white tracking-wider uppercase">Live Agent Network</h2>
              <p className="text-xs text-slate-400 mt-0.5">Real-time LLM Orchestration</p>
            </div>
          </div>

          <div className="">
            <ExecutiveSummary />
          </div>
        </div>

      </main>
    </div>
  );
}
