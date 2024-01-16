import { Node, Edge } from "reactflow";

export const nodes: Node[] = [
  {
    id: "A",
    position: { x: 0, y: 0 },
    data: {
      expanded: true,
      test: 'test'

    },
  },
 

];

export const edges: Edge[] = [
  {
    id: "A->B",
    source: "A",
    target: "B",
  },
  {
    id: "A->C",
    source: "A",
    target: "C",
  },
  {
    id: "B->E",
    source: "B",
    target: "E",
  },
  {
    id: "C->F",
    source: "C",
    target: "F",
  },
  {
    id: "D->G",
    source: "D",
    target: "G",
  },
  {
    id: "D->H",
    source: "D",
    target: "H",
  },
];
