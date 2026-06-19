"use client";

import { motion } from "framer-motion";
import { useCallback } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Position,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const initialNodes = [
  {
    id: "1",
    type: "input",
    data: { label: "1. Submit Proposal" },
    position: { x: 0, y: 150 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    style: { backgroundColor: '#111827', color: '#ffffff', borderColor: '#06b6d4', borderRadius: '8px', padding: '10px 20px', fontWeight: 'bold' }
  },
  {
    id: "2",
    data: { label: "2. Agent Investigation" },
    position: { x: 250, y: 150 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    style: { backgroundColor: '#111827', color: '#ffffff', borderColor: '#3b82f6', borderRadius: '8px', padding: '10px 20px', fontWeight: 'bold' }
  },
  {
    id: "3",
    data: { label: "3. Specialist Recruitment" },
    position: { x: 500, y: 50 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    style: { backgroundColor: '#111827', color: '#ffffff', borderColor: '#a855f7', borderRadius: '8px', padding: '10px 20px', fontWeight: 'bold' }
  },
  {
    id: "4",
    data: { label: "4. Conflict Resolution" },
    position: { x: 500, y: 250 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    style: { backgroundColor: '#111827', color: '#ffffff', borderColor: '#f59e0b', borderRadius: '8px', padding: '10px 20px', fontWeight: 'bold' }
  },
  {
    id: "5",
    data: { label: "5. Executive Review" },
    position: { x: 750, y: 150 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    style: { backgroundColor: '#111827', color: '#ffffff', borderColor: '#6366f1', borderRadius: '8px', padding: '10px 20px', fontWeight: 'bold' }
  },
  {
    id: "6",
    data: { label: "6. Failure Simulation" },
    position: { x: 1000, y: 150 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    style: { backgroundColor: '#111827', color: '#ffffff', borderColor: '#ef4444', borderRadius: '8px', padding: '10px 20px', fontWeight: 'bold' }
  },
  {
    id: "7",
    type: "output",
    data: { label: "7. Final Verdict" },
    position: { x: 1250, y: 150 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    style: { backgroundColor: '#111827', color: '#22c55e', borderColor: '#22c55e', borderRadius: '8px', padding: '10px 20px', fontWeight: 'bold' }
  },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2", animated: true, style: { stroke: "#fff" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#fff" } },
  { id: "e2-3", source: "2", target: "3", animated: true, style: { stroke: "#fff" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#fff" } },
  { id: "e2-4", source: "2", target: "4", animated: true, style: { stroke: "#fff" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#fff" } },
  { id: "e3-5", source: "3", target: "5", animated: true, style: { stroke: "#fff" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#fff" } },
  { id: "e4-5", source: "4", target: "5", animated: true, style: { stroke: "#fff" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#fff" } },
  { id: "e5-6", source: "5", target: "6", animated: true, style: { stroke: "#fff" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#fff" } },
  { id: "e6-7", source: "6", target: "7", animated: true, style: { stroke: "#22c55e", strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#22c55e" } },
];

export function HowItWorksSection() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <section className="py-24 relative bg-gray-950 border-t border-b border-white/5">
      <div className="container px-4 md:px-6 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl">
            A fully autonomous, multi-stage due diligence pipeline driven by specialized AI agents.
          </p>
        </motion.div>
      </div>

      <div className="w-full h-[500px] relative">
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-gray-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-gray-950 to-transparent z-10 pointer-events-none" />
        
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          proOptions={{ hideAttribution: true }}
          className="bg-gray-950"
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
        >
          <Background color="#333" gap={16} />
          <Controls className="fill-white [&>button]:bg-gray-800 [&>button]:border-gray-700 [&>button]:hover:bg-gray-700" />
        </ReactFlow>
      </div>
    </section>
  );
}
