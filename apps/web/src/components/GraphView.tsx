import { useEffect, useState } from "react";

import type { ObjectTypeName, ProjectData } from "@novelstory/schema";

import {
  buildGraphData,
  ensureGraphLayout,
  filterGraphBySelection,
  type GraphLayoutDraft
} from "../lib/project-graph.js";

type GraphViewProps = {
  isSavingLayout: boolean;
  onSaveLayout: (layout: GraphLayoutDraft) => void;
  onSelectObject: (objectType: ObjectTypeName, objectId: string) => void;
  project: ProjectData;
  selectedObjectId: string;
};

type DragState = {
  nodeId: string;
  originX: number;
  originY: number;
  startX: number;
  startY: number;
} | null;

const nodeWidth = 148;
const nodeHeight = 56;

export default function GraphView(props: GraphViewProps) {
  const graph = buildGraphData(props.project);
  const [focusSelection, setFocusSelection] = useState(false);
  const [layoutDraft, setLayoutDraft] = useState<GraphLayoutDraft>(() =>
    ensureGraphLayout(props.project, graph.nodes)
  );
  const [dragState, setDragState] = useState<DragState>(null);

  useEffect(() => {
    setLayoutDraft(ensureGraphLayout(props.project, buildGraphData(props.project).nodes));
  }, [props.project]);

  useEffect(() => {
    if (!dragState) {
      return;
    }

    const activeDrag = dragState;

    function handlePointerMove(event: PointerEvent) {
      setLayoutDraft((current) => ({
        ...current,
        positions: {
          ...current.positions,
          [activeDrag.nodeId]: {
            x: activeDrag.originX + event.clientX - activeDrag.startX,
            y: activeDrag.originY + event.clientY - activeDrag.startY
          }
        }
      }));
    }

    function handlePointerUp() {
      setDragState(null);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [dragState]);

  const visibleGraph = filterGraphBySelection({
    edges: graph.edges,
    focusSelection,
    nodes: graph.nodes,
    selectedObjectId: props.selectedObjectId
  });

  return (
    <section className="panel graph-view">
      <div className="panel-header">
        <h2>Graph</h2>
        <span>
          {visibleGraph.nodes.length} nodes / {visibleGraph.edges.length} edges
        </span>
      </div>

      <div className="graph-toolbar">
        <button
          aria-pressed={focusSelection}
          className={focusSelection ? "toolbar-button toolbar-button-active" : "toolbar-button"}
          onClick={() => setFocusSelection((current) => !current)}
          type="button"
        >
          Focus Selection
        </button>

        <button
          className="toolbar-button toolbar-button-primary"
          disabled={props.isSavingLayout}
          onClick={() => props.onSaveLayout(layoutDraft)}
          type="button"
        >
          Save Layout
        </button>
      </div>

      <div className="graph-canvas" role="region" aria-label="Graph Canvas">
        <svg className="graph-edges" aria-hidden="true">
          {visibleGraph.edges.map((edge) => {
            const source = layoutDraft.positions[edge.sourceId];
            const target = layoutDraft.positions[edge.targetId];

            if (!source || !target) {
              return null;
            }

            const x1 = source.x + nodeWidth / 2;
            const y1 = source.y + nodeHeight / 2;
            const x2 = target.x + nodeWidth / 2;
            const y2 = target.y + nodeHeight / 2;

            return (
              <g className={`graph-edge graph-edge-${edge.kind}`} key={edge.id}>
                <line x1={x1} x2={x2} y1={y1} y2={y2} />
                <text x={(x1 + x2) / 2} y={(y1 + y2) / 2}>
                  {edge.label}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="graph-nodes">
          {visibleGraph.nodes.map((node) => {
            const position = layoutDraft.positions[node.id] ?? {
              x: 0,
              y: 0
            };

            return (
              <button
                aria-label={node.label}
                className={
                  node.id === props.selectedObjectId
                    ? "graph-node graph-node-active"
                    : "graph-node"
                }
                key={node.id}
                onClick={() => props.onSelectObject(node.objectType, node.id)}
                onPointerDown={(event) => {
                  event.preventDefault();
                  setDragState({
                    nodeId: node.id,
                    originX: position.x,
                    originY: position.y,
                    startX: event.clientX,
                    startY: event.clientY
                  });
                }}
                style={{
                  left: `${position.x}px`,
                  top: `${position.y}px`
                }}
                type="button"
              >
                <strong>{node.label}</strong>
                <span>{node.objectType}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
