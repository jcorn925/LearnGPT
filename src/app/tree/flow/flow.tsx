"use client"

import { useCallback, useState } from 'react';
import ReactFlow, {
  applyEdgeChanges,
  applyNodeChanges,
  ReactFlowProvider,
  MiniMap,
  Background,
  OnNodesChange,
  OnEdgesChange,
  NodeMouseHandler,
  Node,
  Edge,
} from 'reactflow';

import { useControls } from 'leva';

import CustomNode from '@/components/tree-flow/CustomNode';
import {
  nodes as initialNodes,
  edges as initialEdges,
} from '.././initialElements';
import useAnimatedNodes from '@/components/tree-flow/hooks/useAnimatedNodes';
import useExpandCollapse from '@/components/tree-flow/hooks/useExpandCollapse';

import 'reactflow/dist/style.css';
import styles from '../../styles/styles.module.css';

const proOptions = { account: 'paid-pro', hideAttribution: true };

const nodeTypes = {
  custom: CustomNode,
};

type ExpandCollapseExampleProps = {
  treeWidth?: number;
  treeHeight?: number;
  animationDuration?: number;
};

function ReactFlowPro({
  treeWidth = 400,
  treeHeight = 500,
  animationDuration = 300,
}: ExpandCollapseExampleProps = {}) {
  
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const { nodes: visibleNodes, edges: visibleEdges } = useExpandCollapse(
    nodes,
    edges,
    { treeWidth, treeHeight }
  );
  const { nodes: animatedNodes } = useAnimatedNodes(visibleNodes, {
    animationDuration,
  });

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === node.id) {
            return {
              ...n,
              data: { ...n.data, expanded: !n.data.expanded },
            };
          }

          return n;
        })
      );
    },
    [setNodes]
  );

  return (
    <ReactFlow
      fitView
      nodes={animatedNodes}
      edges={visibleEdges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      // onNodeClick={onNodeClick}
      proOptions={proOptions}
      nodeTypes={nodeTypes}
      nodesDraggable={false}
      nodesConnectable={false}
      className={styles.viewport}
      zoomOnDoubleClick={false}
      elementsSelectable={true}
    >
      <Background />
      <MiniMap />
    </ReactFlow>
  );
}

function ReactFlowPage() {

  const levaProps = useControls({
    treeWidth: {
      value: 600,
      min: 0,
      max: 1200,
    },
    treeHeight: {
      value: 1200,
      min: 0,
      max: 1200,
    },
    animationDuration: {
      value: 300,
      min: 0,
      max: 600,
    },
  });

  return (
    <ReactFlowProvider>
      <ReactFlowPro {...levaProps} />
    </ReactFlowProvider>
  );
}

export default ReactFlowPage;
