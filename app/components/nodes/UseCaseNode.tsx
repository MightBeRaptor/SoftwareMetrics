'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';

export default function UseCaseNode({ id, data }: NodeProps) {
  const { setNodes } = useReactFlow();
  const [label, setLabel] = useState(data.label || 'Use Case');
  const [editing, setEditing] = useState(false);

  const handleBlur = useCallback(() => {
    setEditing(false);
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, label } } : node
      )
    );
  }, [id, label, setNodes]);

  useEffect(() => {
    setLabel(data.label || 'Use Case');
  }, [data.label]);

  return (
    <div className="flex items-center justify-center rounded-full border border-gray-700 bg-white w-32 h-16 text-sm text-gray-800">
      {editing ? (
        <input
          autoFocus
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
          className="w-full h-full text-center bg-transparent border-none outline-none text-black"
        />
      ) : (
        <span
          className="cursor-text select-none text-black"
          onDoubleClick={() => setEditing(true)}
        >
          {label}
        </span>
      )}
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  );
}