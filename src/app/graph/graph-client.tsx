"use client";

import { useCallback, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export function GraphClient({ initialNodes, initialEdges }: { initialNodes: any[], initialEdges: any[] }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        colorMode="dark"
        style={{ background: 'transparent' }}
      >
        <Controls />
        <MiniMap zoomable pannable nodeColor={(n) => {
          if (n.style?.background) return n.style.background as string;
          return '#000';
        }} />
        <Background gap={24} size={1} color="rgba(255,255,255,0.12)" />
      </ReactFlow>
    </div>
  );
}
