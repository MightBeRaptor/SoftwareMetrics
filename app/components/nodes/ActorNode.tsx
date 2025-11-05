'use client';

import React from "react";
import { Handle, Position } from 'reactflow';

export default function ActorNode({ data}: { data: { label: string} }){
    return(
        <div className="flex flex-col items-center text-sm text-gray-800">
        {/* Stick figure body */}
        <div className="flex flex-col items-center justify-center">
            <div className="w-6 h-6 rounded-full border border-gray-700 bg-white" />
            <div className="w-[1px] h-8 bg-gray-700" />
            <div className="flex gap-4">
            <div className="w-4 h-[1px] bg-gray-700" />
            <div className="w-4 h-[1px] bg-gray-700" />
            </div>
            <div className="w-[1px] h-6 bg-gray-700" />
            <div className="flex gap-2">
            <div className="w-3 h-[1px] bg-gray-700" />
            <div className="w-3 h-[1px] bg-gray-700" />
            </div>
        </div>
        <span className="mt-2 text-xs">{data.label}</span>

        {/* Optional handles for connecting edges */}
        <Handle type="source" position={Position.Right} />
        <Handle type="target" position={Position.Left} />
        </div>
    );
}