'use client';

import React, { useState, useCallback } from 'react';
import { NodeProps, useReactFlow } from 'reactflow';

export default function SystemBoundaryNode({ id, data }: NodeProps) {
  const { setNodes } = useReactFlow();
  const [label, setLabel] = useState(data.label || 'System');
  const [editing, setEditing] = useState(false);

  const handleBlur = useCallback(() => {
    setEditing(false);
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, label } } : node
      )
    );
  }, [id, label, setNodes]);

  return (
    <div
      className="border-2 border-black bg-transparent rounded-sm relative"
      style={{
        width: data.width || 400,
        height: data.height || 300,
        zIndex: 0, // keep behind other nodes
      }}
    >
      <div className="absolute top-1 left-2 text-black text-sm bg-white px-1">
        {editing ? (
          <input
            autoFocus
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
            className="bg-transparent border-none outline-none w-32"
          />
        ) : (
          <span
            className="cursor-text select-none"
            onDoubleClick={() => setEditing(true)}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
