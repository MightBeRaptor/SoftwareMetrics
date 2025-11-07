'use client';

import React, { useCallback, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import Sidebar from './Sidebar';
import AISidebar from './AISidebar';
import ActorNode from './nodes/ActorNode';
import UseCaseNode from './nodes/UseCaseNode';
import SystemBoundaryNode from './nodes/SystemBoundaryNode';
import LabeledEdge from './edges/LabeledEdge';
import { generateUseCaseJSON } from './utils/exportJSON';
import { sendDiagramToOllama } from './utils/sendToOllama';

const nodeTypes = {
  actor: ActorNode,
  usecase: UseCaseNode,
  boundary: SystemBoundaryNode,
};

const edgeTypes = {
  labeled: LabeledEdge,
};

export default function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const onLabelChange = (id: string, label: string) => {
    setEdges((eds) =>
      eds.map((e) => (e.id === id ? { ...e, data: { ...e.data, label } } : e))
    );
  };

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'labeled',
            data: { label: '<<association>>', onLabelChange },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const bounds = (event.target as HTMLElement).getBoundingClientRect();
      const position = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      };

      const newNode: Node = {
        id: `${+new Date()}`,
        type,
        position,
        data: { label: `${type === 'actor' ? 'Actor' : 'Use Case'}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const handleExport = () => {
    const json = generateUseCaseJSON(nodes, edges);
    console.log(json);
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'use_case_diagram.json';
    a.click();
  };

  const handleSendToAI = async () => {
    const json = generateUseCaseJSON(nodes, edges);
    setLoading(true);
    setAnalysis(null);
    try {
      const response = await sendDiagramToOllama(json);
      const parsed = JSON.parse(response);
      setAnalysis(parsed);
    } catch (err) {
      console.error('AI response error:', err);
      setAnalysis({ error: 'Invalid or unexpected AI response' });
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', height: '90vh', width: '100%' }}>
      <Sidebar onExport={handleExport} onSendToAI={handleSendToAI} />
      <div style={{ flex: 1, height: '100%' }} onDrop={onDrop} onDragOver={onDragOver}>
        <ReactFlow
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          style={{ backgroundColor: 'white' }}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background/>
        </ReactFlow>
      </div>
      <AISidebar analysis={analysis} loading={loading} />
    </div>
  );
}