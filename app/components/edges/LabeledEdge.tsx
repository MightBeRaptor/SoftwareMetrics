'use client';

import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  EdgeProps,
} from 'reactflow';

export default function LabeledEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style = {},
  markerEnd,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 10,
            padding: '2px 4px',
            background: 'white',
            border: '1px solid #888',
            borderRadius: '4px',
            pointerEvents: 'all',
            color: 'black',
            fontWeight: 500,
          }}
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => {
            if (data?.onLabelChange) data.onLabelChange(id, e.target.textContent || '');
          }}
        >
          {data?.label || ''}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
