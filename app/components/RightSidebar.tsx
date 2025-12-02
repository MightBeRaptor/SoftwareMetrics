'use client';

import React from 'react';
import { downloadJSON } from "@/app/components/utils/downloadJSON";
import './Sidebar.css';

interface MisuseCase {
  relatedUseCase: string;
  threatType: string;
  cwe: string;
  capec: string;
  description: string;
  mitigations: string[];
}

interface RightSidebarProps {
  aiResponse: { misuseCases: MisuseCase[] } | null;
  isLoading: boolean;
}

export default function RightSidebar({ aiResponse, isLoading }: RightSidebarProps) {
  return (
    <aside
      style={{
        width: '300px',
        padding: '10px',
        borderLeft: '1px solid #ccc',
        background: '#f5f5f5',
        color: 'black',
        overflowY: 'auto',
      }}
    >
      
      {aiResponse && (
        <button onClick={() => downloadJSON(aiResponse)} className="sidebar-button">
          Download JSON
        </button>
      )}

      <h3>AI Analysis</h3>

      {isLoading ? (
        <p><i>Analyzing diagram…</i></p>
      ) : !aiResponse || aiResponse.misuseCases.length === 0 ? (
        <p>No misuse cases detected.</p>
      ) : (
        <div>
          {aiResponse.misuseCases.map((mc, idx) => (
            <div
              key={idx}
              style={{
                border: '1px solid #ddd',
                borderRadius: '6px',
                padding: '8px',
                marginBottom: '10px',
                background: '#fff',
              }}
            >
              <p><strong>Related Use Case:</strong> {mc.relatedUseCase}</p>
              <p><strong>Threat Type:</strong> {mc.threatType}</p>
              <p><strong>CWE:</strong> {mc.cwe}</p>
              <p><strong>CAPEC:</strong> {mc.capec}</p>
              <p><strong>Description:</strong> {mc.description}</p>
              <p><strong>Mitigations:</strong></p>
              <ul>
                {mc.mitigations.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
