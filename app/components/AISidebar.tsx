'use client';
import React from 'react';
import './Sidebar.css'; // reuse same styles or make a new CSS file

interface AISidebarProps {
  analysis: any;
  loading: boolean;
}

export default function AISidebar({ analysis, loading }: AISidebarProps) {
  return (
    <aside className="sidebar" style={{ borderLeft: '1px solid #ccc' }}>
      <h3 className="sidebar-title">AI Analysis</h3>

      {loading && <p>Analyzing diagram...</p>}

      {!loading && !analysis && <p>No analysis yet.</p>}

      {!loading && analysis && (
        <div className="ai-output">
          {analysis.misuseCases?.map((misuse: any, idx: number) => (
            <div key={idx} className="misuse-case">
              <h4>{misuse.relatedUseCase}</h4>
              <p><b>Threat Type:</b> {misuse.threatType}</p>
              <p><b>Description:</b> {misuse.description}</p>
              <p><b>CWE:</b> {misuse.cwe}</p>
              <p><b>CAPEC:</b> {misuse.capec}</p>
              <p><b>Mitigations:</b></p>
              <ul>
                {misuse.mitigations.map((m: string, i: number) => (
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
