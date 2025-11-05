'use client';

import React from 'react';
import { Handle, Position } from 'reactflow';

export default function UseCaseNode({ data }: { data: { label: string } }) {
  return (
    <div className="flex items-center justify-center rounded-full border border-gray-700 bg-white w-32 h-16 text-sm text-gray-800">
      <span>{data.label}</span>
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  );
}
