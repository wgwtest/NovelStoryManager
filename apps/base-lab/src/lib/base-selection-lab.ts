import { createCanvasViewport, type CanvasViewport } from "@novelstory/view-core";

export type LabPortKind = "input" | "output";

export type LabNode = {
  accent: string;
  category: string;
  id: string;
  inputs: string[];
  label: string;
  outputs: string[];
  status: string;
};

export type LabEdge = {
  id: string;
  label: string;
  sourceId: string;
  sourcePort: string;
  targetId: string;
  targetPort: string;
};

export type Position = {
  x: number;
  y: number;
};

export type PendingEdge = {
  currentX: number;
  currentY: number;
  sourceId: string;
  sourcePort: string;
};

export type StageState = CanvasViewport & {
  edges: LabEdge[];
  nextEdgeId: number;
  pendingEdge: PendingEdge | null;
  positions: Record<string, Position>;
  selectedNodeId: string;
};

export type PortHandle = {
  kind: LabPortKind;
  nodeId: string;
  portName: string;
};

export const nodeWidth = 228;
export const nodeHeight = 138;
export const headerHeight = 36;
export const portStartOffset = 62;
export const portRowHeight = 28;
export const portRadius = 6;

export const labNodes: LabNode[] = [
  {
    accent: "#375d8f",
    category: "Scene",
    id: "scene-entry",
    inputs: ["enter", "context"],
    label: "Scene Entry",
    outputs: ["lead", "token"],
    status: "Stable"
  },
  {
    accent: "#8a5936",
    category: "Event",
    id: "detect-token",
    inputs: ["trigger", "evidence"],
    label: "Detect Token",
    outputs: ["clue", "state"],
    status: "Dragged"
  },
  {
    accent: "#2f6f63",
    category: "Clue",
    id: "reveal-clue",
    inputs: ["input", "memory"],
    label: "Reveal Clue",
    outputs: ["branch", "focus"],
    status: "Selectable"
  },
  {
    accent: "#86503c",
    category: "Arc",
    id: "trigger-arc",
    inputs: ["signal", "link"],
    label: "Trigger Arc",
    outputs: ["result", "echo"],
    status: "Observe"
  }
];

const defaultLabEdges: LabEdge[] = [
  {
    id: "edge-scene-token",
    label: "lead",
    sourceId: "scene-entry",
    sourcePort: "lead",
    targetId: "detect-token",
    targetPort: "trigger"
  },
  {
    id: "edge-token-clue",
    label: "clue",
    sourceId: "detect-token",
    sourcePort: "clue",
    targetId: "reveal-clue",
    targetPort: "input"
  },
  {
    id: "edge-clue-arc",
    label: "branch",
    sourceId: "reveal-clue",
    sourcePort: "branch",
    targetId: "trigger-arc",
    targetPort: "signal"
  }
];

const initialPositions: Record<string, Position> = {
  "detect-token": {
    x: 372,
    y: 198
  },
  "reveal-clue": {
    x: 688,
    y: 122
  },
  "scene-entry": {
    x: 88,
    y: 92
  },
  "trigger-arc": {
    x: 716,
    y: 352
  }
};

export function createStageState(): StageState {
  return {
    ...createCanvasViewport({
      canvasHeight: 620,
      canvasWidth: 1080,
      offsetX: 32,
      offsetY: 28,
      zoom: 1
    }),
    edges: structuredClone(defaultLabEdges),
    nextEdgeId: 1,
    pendingEdge: null,
    positions: structuredClone(initialPositions),
    selectedNodeId: "detect-token"
  };
}

export function getNodeById(nodeId: string): LabNode {
  const node = labNodes.find((item) => item.id === nodeId);

  if (!node) {
    throw new Error(`Unknown lab node: ${nodeId}`);
  }

  return node;
}

export function getNodePosition(stageState: StageState, nodeId: string): Position {
  const position = stageState.positions[nodeId];

  if (!position) {
    throw new Error(`Unknown node position: ${nodeId}`);
  }

  return position;
}

export function getSelectedCoordinates(stageState: StageState): string {
  const position = getNodePosition(stageState, stageState.selectedNodeId);

  return `${Math.round(position.x)}, ${Math.round(position.y)}`;
}

export function getPortY(position: Position, index: number): number {
  return position.y + portStartOffset + index * portRowHeight;
}

function getPortIndex(node: LabNode, kind: LabPortKind, portName: string): number {
  const ports = kind === "input" ? node.inputs : node.outputs;
  const index = ports.indexOf(portName);

  if (index < 0) {
    throw new Error(`Unknown ${kind} port ${portName} on ${node.id}`);
  }

  return index;
}

export function getPortAnchor(
  stageState: StageState,
  nodeId: string,
  kind: LabPortKind,
  portName: string
): Position {
  const node = getNodeById(nodeId);
  const position = getNodePosition(stageState, nodeId);
  const index = getPortIndex(node, kind, portName);

  return {
    x: kind === "input" ? position.x + 10 : position.x + nodeWidth - 10,
    y: getPortY(position, index)
  };
}

export function getEdgePoints(stageState: StageState, edge: LabEdge) {
  const source = getPortAnchor(stageState, edge.sourceId, "output", edge.sourcePort);
  const target = getPortAnchor(stageState, edge.targetId, "input", edge.targetPort);

  return {
    x1: source.x,
    x2: target.x,
    y1: source.y,
    y2: target.y
  };
}

export function getPendingEdgePoints(stageState: StageState) {
  if (!stageState.pendingEdge) {
    return null;
  }

  const source = getPortAnchor(
    stageState,
    stageState.pendingEdge.sourceId,
    "output",
    stageState.pendingEdge.sourcePort
  );

  return {
    x1: source.x,
    x2: stageState.pendingEdge.currentX,
    y1: source.y,
    y2: stageState.pendingEdge.currentY
  };
}

export function resolveStagePoint(
  stageState: StageState,
  bounds: DOMRect | Pick<DOMRect, "left" | "top">,
  clientX: number,
  clientY: number
): Position {
  return {
    x: (clientX - bounds.left - stageState.offsetX) / stageState.zoom,
    y: (clientY - bounds.top - stageState.offsetY) / stageState.zoom
  };
}

export function findHitNodeId(stageState: StageState, point: Position): string | null {
  const orderedNodes = [...labNodes].reverse();

  for (const node of orderedNodes) {
    const position = getNodePosition(stageState, node.id);

    if (
      point.x >= position.x &&
      point.x <= position.x + nodeWidth &&
      point.y >= position.y &&
      point.y <= position.y + nodeHeight
    ) {
      return node.id;
    }
  }

  return null;
}

export function findPortHandle(
  stageState: StageState,
  point: Position,
  kind?: LabPortKind
): PortHandle | null {
  const orderedNodes = [...labNodes].reverse();
  const kinds = kind ? [kind] : ["output", "input"] satisfies LabPortKind[];

  for (const node of orderedNodes) {
    for (const currentKind of kinds) {
      const ports = currentKind === "input" ? node.inputs : node.outputs;

      for (const portName of ports) {
        const anchor = getPortAnchor(stageState, node.id, currentKind, portName);
        const dx = point.x - anchor.x;
        const dy = point.y - anchor.y;

        if (Math.sqrt(dx * dx + dy * dy) <= portRadius + 6) {
          return {
            kind: currentKind,
            nodeId: node.id,
            portName
          };
        }
      }
    }
  }

  return null;
}

export function startPendingEdge(
  stageState: StageState,
  input: {
    currentX: number;
    currentY: number;
    sourceId: string;
    sourcePort: string;
  }
): StageState {
  return {
    ...stageState,
    pendingEdge: {
      currentX: input.currentX,
      currentY: input.currentY,
      sourceId: input.sourceId,
      sourcePort: input.sourcePort
    }
  };
}

export function updatePendingEdge(
  stageState: StageState,
  input: {
    currentX: number;
    currentY: number;
  }
): StageState {
  if (!stageState.pendingEdge) {
    return stageState;
  }

  return {
    ...stageState,
    pendingEdge: {
      ...stageState.pendingEdge,
      currentX: input.currentX,
      currentY: input.currentY
    }
  };
}

export function clearPendingEdge(stageState: StageState): StageState {
  if (!stageState.pendingEdge) {
    return stageState;
  }

  return {
    ...stageState,
    pendingEdge: null
  };
}

export function connectPendingEdge(
  stageState: StageState,
  input: {
    targetId: string;
    targetPort: string;
  }
): StageState {
  const pendingEdge = stageState.pendingEdge;

  if (!pendingEdge) {
    return stageState;
  }

  const duplicate = stageState.edges.some((edge) =>
    edge.sourceId === pendingEdge.sourceId &&
    edge.sourcePort === pendingEdge.sourcePort &&
    edge.targetId === input.targetId &&
    edge.targetPort === input.targetPort
  );

  if (duplicate) {
    return clearPendingEdge(stageState);
  }

  return {
    ...stageState,
    edges: [
      ...stageState.edges,
      {
        id: `edge-user-${stageState.nextEdgeId}`,
        label: pendingEdge.sourcePort,
        sourceId: pendingEdge.sourceId,
        sourcePort: pendingEdge.sourcePort,
        targetId: input.targetId,
        targetPort: input.targetPort
      }
    ],
    nextEdgeId: stageState.nextEdgeId + 1,
    pendingEdge: null
  };
}
