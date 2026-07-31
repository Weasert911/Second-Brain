import React from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';

interface VisualizerProps {
  elements: any[];
}

const VisualizerPane: React.FC<VisualizerProps> = ({ elements }) => {
  if (elements.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <div className="text-lg font-medium">No visualization data</div>
          <div className="text-sm">Generate a visualization to see execution flow</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <ReactFlow elements={elements} fitView>
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default VisualizerPane;
