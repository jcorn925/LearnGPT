import React, { useState, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from 'reactflow';
import Dagre from '@dagrejs/dagre';

import 'reactflow/dist/style.css';

// Assuming initialNodes and initialEdges are defined elsewhere
import { initialNodes, initialEdges } from './nodes-edges';

const dagreGraph = new Dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => dagreGraph.setNode(node.id, { width: 100, height: 50 }));
  edges.forEach((edge) => dagreGraph.setEdge(edge.source, edge.target));

  Dagre.layout(dagreGraph);

  return nodes.map((node) => ({
    ...node,
    position: dagreGraph.node(node.id),
  }));
};

const LayoutFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeCount, setNodeCount] = useState(nodes.length);
  const { fitView } = useReactFlow();

  const addNode = useCallback(() => {
    const newNodeId = `d${nodeCount + 1}`;
    const newNode = {
      id: newNodeId,
      data: { label: `Node ${nodeCount + 1}` },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };
    setNodes((nds) => nds.concat(newNode));
    setNodeCount(nodeCount + 1);
  }, [nodeCount, setNodes]);

  const onLayout = useCallback(
    (direction) => {
      const layoutedNodes = getLayoutedElements(nodes, edges, direction);
      setNodes([...layoutedNodes]);
      fitView();
    },
    [nodes, edges, setNodes, fitView]
  );

  return (
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      >
        <Panel position="top-right">
          <button onClick={() => onLayout('TB')}>Vertical Layout</button>
          <button onClick={() => onLayout('LR')}>Horizontal Layout</button>
          <button onClick={addNode}>Add Node</button>
        </Panel>
      </ReactFlow>
  );
};

export default LayoutFlow;
