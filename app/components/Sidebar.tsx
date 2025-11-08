'use client';

import React from 'react';
import './Sidebar.css';

interface SidebarProps {
  onExport: () => void;
  isLoading?: boolean;
}

export default function Sidebar({ onExport, isLoading = false }: SidebarProps) {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="sidebar">
      <h3 className="sidebar-title">Add Nodes</h3>

      <div
        className="sidebar-item"
        draggable
        onDragStart={(e) => onDragStart(e, 'actor')}
      >
        Actor
      </div>

      <div
        className="sidebar-item"
        draggable
        onDragStart={(e) => onDragStart(e, 'usecase')}
      >
        Use Case
      </div>

      <div
        className="sidebar-item"
        draggable
        onDragStart={(e) => onDragStart(e, 'boundary')}
      >
        System Boundary
      </div>

      <button
        className="sidebar-button"
        onClick={onExport}
        disabled={isLoading}
      >
        {isLoading ? 'Analyzing…' : 'Send to AI'}
      </button>
    </aside>
  );
}

