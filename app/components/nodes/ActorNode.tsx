'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';

export default function ActorNode({ id, data }: NodeProps) {
  const { setNodes } = useReactFlow();
  const [label, setLabel] = useState(data.label || 'Actor');
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
    setLabel(data.label || 'Actor');
  }, [data.label]);

  return (
    <div className="flex flex-col items-center text-black bg-transparent">
      {/* Stick Figure */}
      <svg width="40" height="80" viewBox="0 0 40 80">
        {/* Head */}
        <circle cx="20" cy="10" r="8" stroke="black" fill="white" strokeWidth="1" />
        {/* Body */}
        <line x1="20" y1="18" x2="20" y2="45" stroke="black" strokeWidth="1" />
        {/* Arms */}
        <line x1="5" y1="25" x2="35" y2="25" stroke="black" strokeWidth="1" />
        {/* Legs */}
        <line x1="20" y1="45" x2="8" y2="70" stroke="black" strokeWidth="1" />
        <line x1="20" y1="45" x2="32" y2="70" stroke="black" strokeWidth="1" />
      </svg>

      {/* Editable Label */}
      {editing ? (
        <input
          autoFocus
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
          className="mt-1 text-sm text-center bg-transparent border-none outline-none w-20"
        />
      ) : (
        <span
          className="mt-1 text-sm cursor-text select-none"
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
