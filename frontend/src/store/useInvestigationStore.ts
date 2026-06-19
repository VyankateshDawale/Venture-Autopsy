import { create } from 'zustand';

interface InvestigationState {
  investigationId: string | null;
  status: string;
  progress: number;
  report: any | null;
  agents: Record<string, any>;
  events: any[];
  timelineEvents: any[];
  findings: any[];
  sharedContext: any[];
  nodes: any[];
  edges: any[];
  ws: WebSocket | null;

  setInvestigationId: (id: string | null) => void;
  setNodes: (nodes: any[]) => void;
  setEdges: (edges: any[]) => void;
  connectWebSocket: (id: string) => void;
  disconnectWebSocket: () => void;
  reset: () => void;
}

const initialState = {
  investigationId: null,
  status: 'pending',
  progress: 0,
  report: null,
  agents: {},
  events: [],
  timelineEvents: [],
  findings: [],
  sharedContext: [],
  nodes: [],
  edges: [],
  ws: null,
};

export const useInvestigationStore = create<InvestigationState>((set, get) => ({
  ...initialState,

  setInvestigationId: (id) => set({ investigationId: id }),
  
  setNodes: (nodes) => set({ nodes }),
  
  setEdges: (edges) => set({ edges }),

  connectWebSocket: (id) => {
    // Prevent duplicate connection
    const currentWs = get().ws;
    if (currentWs && (currentWs.readyState === WebSocket.OPEN || currentWs.readyState === WebSocket.CONNECTING)) {
      return;
    }

    if (currentWs) {
      currentWs.close();
    }

    const host = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';
    const wsUrl = `${host.replace(/^http/, 'ws')}/ws/investigation/${id}`;
    
    console.log(`Connecting to WebSocket: ${wsUrl}`);
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (messageEvent) => {
      try {
        const data = JSON.parse(messageEvent.data);
        if (data.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong' }));
          return;
        }

        const currentEvents = get().events;
        const currentTimelineEvents = get().timelineEvents;
        const currentFindings = get().findings;
        const currentAgents = get().agents;
        const currentSharedContext = get().sharedContext;

        if (data.type === 'investigation_progress') {
          set({
            status: data.payload.status || get().status,
            progress: typeof data.payload.progress === 'number' ? data.payload.progress : get().progress,
          });
        } else if (data.type === 'agent_status') {
          const agentId = data.payload.agent_id;
          if (agentId) {
            set({
              agents: {
                ...currentAgents,
                [agentId]: {
                  ...currentAgents[agentId],
                  ...data.payload,
                  id: agentId,
                  type: data.payload.agent_type || currentAgents[agentId]?.type,
                  name: data.payload.name || currentAgents[agentId]?.name,
                },
              },
            });
          }
        } else if (data.type === 'timeline_event') {
          const newEvent = {
            id: data.id,
            type: data.type,
            timestamp: data.timestamp,
            payload: data.payload,
          };
          set({
            events: [...currentEvents, newEvent],
            timelineEvents: [...currentTimelineEvents, newEvent],
          });
        } else if (data.type === 'finding') {
          const newFinding = {
            id: data.id,
            type: data.type,
            timestamp: data.timestamp,
            payload: data.payload,
          };
          set({
            findings: [...currentFindings, newFinding],
          });
        } else if (data.type === 'shared_context') {
          set({
            sharedContext: [...currentSharedContext, data.payload],
          });
        }
      } catch (err) {
        console.error('Error handling WebSocket message:', err);
      }
    };

    ws.onerror = (err) => {
      if (ws.readyState === WebSocket.CLOSING || ws.readyState === WebSocket.CLOSED) {
        return;
      }
      console.error('WebSocket error:', err);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    set({ ws });
  },

  disconnectWebSocket: () => {
    const ws = get().ws;
    if (ws) {
      ws.close();
      set({ ws: null });
    }
  },

  reset: () => {
    const ws = get().ws;
    if (ws) {
      ws.close();
    }
    set({ ...initialState });
  },
}));
