'use client';

import React from 'react';
import './Sidebar.css'; // We'll create this file next

export default function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="sidebar">
      <h3 className="sidebar-title">Add Nodes</h3>

      <div
        className="sidebar-item"
        onDragStart={(event) => onDragStart(event, 'actor')}
        draggable
      >
        Actor
      </div>

      <div
        className="sidebar-item"
        onDragStart={(event) => onDragStart(event, 'usecase')}
        draggable
      >
        Use Case
      </div>

      <div
        className="sidebar-item"
        onDragStart={(event) => onDragStart(event, 'boundary')}
        draggable
      >
        System Boundary
      </div>
    </aside>
  );
}