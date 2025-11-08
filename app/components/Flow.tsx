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
import RightSidebar from './RightSidebar';
import ActorNode from './nodes/ActorNode';
import UseCaseNode from './nodes/UseCaseNode';
import SystemBoundaryNode from './nodes/SystemBoundaryNode';
import LabeledEdge from './edges/LabeledEdge';
import { generateUseCaseJSON } from './utils/exportJSON';
import { sendDiagramToOllama } from './utils/sendToOllama';

// Node and edge types
const nodeTypes = { actor: ActorNode, usecase: UseCaseNode, boundary: SystemBoundaryNode };
const edgeTypes = { labeled: LabeledEdge };

// Interfaces for AI response
interface MisuseCase {
  relatedUseCase: string;
  threatType: string;
  cwe: string;
  capec: string;
  description: string;
  mitigations: string[];
}

interface AIResponse {
  misuseCases: MisuseCase[];
}

export default function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onLabelChange = (id: string, label: string) => {
    setEdges((eds) =>
      eds.map((e) => (e.id === id ? { ...e, data: { ...e.data, label } } : e))
    );
  };

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      setEdges((eds) =>
        addEdge(
          { ...params, type: 'labeled', data: { label: '<<association>>', onLabelChange } },
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
      const position = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };

      const newNode: Node = {
        id: `${+new Date()}`,
        type,
        position,
        data: {
          label: `${type === 'actor' ? 'Actor' : type === 'boundary' ? 'System' : 'Use Case'}`,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  // Send JSON to Ollama and get AI analysis
  const handleSendToAI = async () => {
  setIsLoading(true);
  setAiResponse(null);

  try {
    // Generate diagram JSON
    const json = generateUseCaseJSON(nodes, edges);
    if (!json || typeof json !== 'object') {
      throw new Error('Failed to generate valid diagram JSON');
    }

    // Send JSON to Ollama
    const response = await sendDiagramToOllama(json);

    // Validate AI response structure
    if (!response || !Array.isArray(response.misuseCases)) {
      throw new Error('Invalid response format from AI');
    }

    // Ensure each misuseCase has required fields
    const safeResponse: AIResponse = {
      misuseCases: response.misuseCases.map((mc: any) => ({
        relatedUseCase: mc.relatedUseCase ?? 'Unknown',
        threatType: mc.threatType ?? 'Unknown',
        cwe: mc.cwe ?? 'N/A',
        capec: mc.capec ?? 'N/A',
        description: mc.description ?? 'No description provided',
        mitigations: Array.isArray(mc.mitigations) ? mc.mitigations : [],
      })),
    };

    setAiResponse(safeResponse);
  } catch (error: any) {
    console.error('Error sending diagram to AI:', error);
    setAiResponse({
      misuseCases: [
        {
          relatedUseCase: 'N/A',
          threatType: 'Error',
          cwe: 'N/A',
          capec: 'N/A',
          description: error.message || 'Unknown error',
          mitigations: [],
        },
      ],
    });
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div style={{ display: 'flex', height: '90vh', width: '100%' }}>
      <Sidebar onExport={handleSendToAI} isLoading={isLoading}/>

      <div style={{ flex: 1 }} onDrop={onDrop} onDragOver={onDragOver}>
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
          <Background color="#000000" />
        </ReactFlow>
      </div>

      <RightSidebar aiResponse={aiResponse} isLoading={isLoading} />
    </div>
  );
}
