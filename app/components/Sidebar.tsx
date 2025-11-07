import React from 'react';
import './Sidebar.css';

interface SidebarProps {
  onExport: () => void;
  onSendToAI: () => void;
}

export default function Sidebar({ onExport, onSendToAI }: SidebarProps) {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="sidebar">
      <h3 className="sidebar-title">Add Nodes</h3>

      <div
        className="dndnode actor"
        draggable
        onDragStart={(event) => onDragStart(event, 'actor')}
      >
        Actor
      </div>

      <div
        className="dndnode usecase"
        draggable
        onDragStart={(event) => onDragStart(event, 'usecase')}
      >
        Use Case
      </div>

      <div
        className="dndnode boundary"
        draggable
        onDragStart={(event) => onDragStart(event, 'boundary')}
      >
        System Boundary
      </div>

      <hr />

      <button onClick={onExport} className="sidebar-btn">Export JSON</button>
      <button onClick={onSendToAI} className="sidebar-btn">Send to AI</button>
    </aside>
  );
}
