'use client';

import React from 'react';

const nodeTypes = [
  { type: 'default', label: 'Default Node' },
  { type: 'input', label: 'Input Node' },
  { type: 'output', label: 'Output Node' },
];

export default function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="p-4 bg-gray-900 text-white h-full w-48 flex flex-col gap-3 border-r border-gray-700">
      <h2 className="text-lg font-semibold mb-2">Nodes</h2>
      {nodeTypes.map((node) => (
        <div
          key={node.type}
          onDragStart={(e) => onDragStart(e, node.type)}
          draggable
          className="cursor-grab select-none bg-gray-800 hover:bg-gray-700 text-center rounded-md py-2 px-2 text-sm"
        >
          {node.label}
        </div>
      ))}
      <p className="text-xs text-gray-400 mt-4">
        Drag a node type onto the canvas.
      </p>
    </aside>
  );
}
