'use client';

import React from 'react';

export default function Sidebar({ onAddNode }: { onAddNode: () => void}) {
    return (
        <aside className="p-4 bg-gray-900 text-white h-full w-48 flex flex-col items-center gap-4 border-r border-gray-700">
            <h2 className="text-lg font-semibold">Sidebar</h2>
            <button
                onClick={onAddNode}
                className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md text-sm"
            >
                Add Node
            </button>
        </aside>
    );
}