import { useEffect, useState } from "react";

import type { ObjectTypeName, ProjectData } from "@novelstory/schema";

import {
  buildGraphConnectionState,
  buildGraphData,
  ensureGraphLayout,
  filterGraphBySelection,
  type GraphLayoutDraft
} from "../lib/project-graph.js";
import {
  panCanvasViewport,
  resizeCanvasViewport,
  zoomCanvasViewport
} from "../lib/view-canvas.js";

type GraphViewProps = {
  activeObjectType: ObjectTypeName;
  isSavingLayout: boolean;
  onCreateObject: () => void;
  onCreateRelation: (targetObjectId: string) => void;
  onSaveLayout: (layout: GraphLayoutDraft) => void;
  onSelectObject: (objectType: ObjectTypeName, objectId: string) => void;
  project: ProjectData;
  selectedObjectId: string;
};

type DragState = {
  kind: "node" | "canvas";
  nodeId?: string;
  originOffsetX?: number;
  originOffsetY?: number;
  originX?: number;
  originY?: number;
  startX: number;
  startY: number;
} | null;

const nodeWidth = 148;
const nodeHeight = 56;

export default function GraphView(props: GraphViewProps) {
  const graph = buildGraphData(props.project);
  const connectedNodeIds = buildGraphConnectionState({
    edges: graph.edges,
    selectedObjectId: props.selectedObjectId
  });
  const [focusSelection, setFocusSelection] = useState(false);
  const [linkMode, setLinkMode] = useState(false);
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
      setLayoutDraft((current) => {
        if (activeDrag.kind === "canvas") {
          return panCanvasViewport(current, {
            deltaX: event.clientX - activeDrag.startX - (activeDrag.originOffsetX ?? 0),
            deltaY: event.clientY - activeDrag.startY - (activeDrag.originOffsetY ?? 0)
          });
        }

        return {
          ...current,
          positions: {
            ...current.positions,
            [activeDrag.nodeId!]: {
              x: (activeDrag.originX ?? 0) + event.clientX - activeDrag.startX,
              y: (activeDrag.originY ?? 0) + event.clientY - activeDrag.startY
            }
          }
        };
      });
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
  const selectedPosition = props.selectedObjectId
    ? layoutDraft.positions[props.selectedObjectId]
    : undefined;

  return (
    <section className="panel graph-view">
      <div className="panel-header">
        <h2>Graph</h2>
        <span>
          {visibleGraph.nodes.length} nodes / {visibleGraph.edges.length} edges
        </span>
      </div>

      <div className="graph-toolbar">
        <button className="toolbar-button" onClick={props.onCreateObject} type="button">
          Create Node
        </button>

        <button
          aria-pressed={focusSelection}
          className={focusSelection ? "toolbar-button toolbar-button-active" : "toolbar-button"}
          onClick={() => setFocusSelection((current) => !current)}
          type="button"
        >
          Focus Selection
        </button>

        <button
          aria-pressed={linkMode}
          className={linkMode ? "toolbar-button toolbar-button-active" : "toolbar-button"}
          onClick={() => setLinkMode((current) => !current)}
          type="button"
        >
          Draw Edge
        </button>

        <button
          className="toolbar-button"
          onClick={() =>
            setLayoutDraft((current) => zoomCanvasViewport(current, current.zoom - 0.1))
          }
          type="button"
        >
          Zoom Out
        </button>

        <button
          className="toolbar-button"
          onClick={() =>
            setLayoutDraft((current) => zoomCanvasViewport(current, current.zoom + 0.1))
          }
          type="button"
        >
          Zoom In
        </button>

        <label className="canvas-size-field">
          Canvas Width
          <input
            onChange={(event) =>
              setLayoutDraft((current) =>
                resizeCanvasViewport(current, {
                  canvasWidth: Number(event.target.value),
                  canvasHeight: current.canvasHeight
                })
              )
            }
            type="number"
            value={layoutDraft.canvasWidth}
          />
        </label>

        <label className="canvas-size-field">
          Canvas Height
          <input
            onChange={(event) =>
              setLayoutDraft((current) =>
                resizeCanvasViewport(current, {
                  canvasWidth: current.canvasWidth,
                  canvasHeight: Number(event.target.value)
                })
              )
            }
            type="number"
            value={layoutDraft.canvasHeight}
          />
        </label>

        <button
          className="toolbar-button toolbar-button-primary"
          disabled={props.isSavingLayout}
          onClick={() => props.onSaveLayout(layoutDraft)}
          type="button"
        >
          Save Layout
        </button>
      </div>

      <div className="graph-meta">
        <span>Active Type: {props.activeObjectType}</span>
        <span>
          Selected Coordinates: {selectedPosition ? `${Math.round(selectedPosition.x)}, ${Math.round(selectedPosition.y)}` : "n/a"}
        </span>
      </div>

      <div
        className="graph-canvas"
        onPointerDown={(event) => {
          if (event.target !== event.currentTarget) {
            return;
          }

          setDragState({
            kind: "canvas",
            originOffsetX: layoutDraft.offsetX,
            originOffsetY: layoutDraft.offsetY,
            startX: event.clientX,
            startY: event.clientY
          });
        }}
        role="region"
        aria-label="Graph Canvas"
      >
        <div
          className="graph-stage"
          style={{
            height: `${layoutDraft.canvasHeight}px`,
            transform: `translate(${layoutDraft.offsetX}px, ${layoutDraft.offsetY}px) scale(${layoutDraft.zoom})`,
            width: `${layoutDraft.canvasWidth}px`
          }}
        >
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
                      : connectedNodeIds.has(node.id)
                        ? "graph-node graph-node-connected"
                        : "graph-node"
                  }
                  key={node.id}
                  onClick={() => {
                    if (linkMode && props.selectedObjectId) {
                      props.onCreateRelation(node.id);
                      setLinkMode(false);
                      return;
                    }

                    props.onSelectObject(node.objectType, node.id);
                  }}
                  onPointerDown={(event) => {
                    event.preventDefault();
                    setDragState({
                      kind: "node",
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
                  <small>{connectedNodeIds.has(node.id) ? "linked" : "unlinked"}</small>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
