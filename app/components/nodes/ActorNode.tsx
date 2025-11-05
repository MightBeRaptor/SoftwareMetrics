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
    <div className="flex flex-col items-center text-black">
      {/* Stick Figure */}
      <div className="relative flex flex-col items-center">
        <div className="w-6 h-6 border border-black rounded-full" />
        <div className="w-px h-8 bg-black" />
        <div className="flex justify-between w-10">
          <div className="w-px h-4 bg-black rotate-45" />
          <div className="w-px h-4 bg-black -rotate-45" />
        </div>
        <div className="flex justify-between w-4 mt-[-2px]">
          <div className="w-px h-4 bg-black" />
          <div className="w-px h-4 bg-black" />
        </div>
      </div>

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