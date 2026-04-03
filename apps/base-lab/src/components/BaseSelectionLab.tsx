import { useEffect, useRef, useState, type CSSProperties } from "react";

import {
  panCanvasViewportFromOrigin,
  resizeCanvasViewport,
  zoomCanvasViewport,
} from "@novelstory/view-core";
import {
  clearPendingEdge,
  connectPendingEdge,
  createStageState,
  findHitNodeId,
  findPortHandle,
  getEdgePoints,
  getNodeById,
  getNodePosition,
  getPendingEdgePoints,
  getPortAnchor,
  getPortTone,
  getSelectedCoordinates,
  headerHeight,
  labNodes,
  nodeHeight,
  nodeWidth,
  portRadius,
  resolveStagePoint,
  setHoveredPort,
  startPendingEdge,
  updatePendingEdge,
  type LabPortKind,
  type PortHandle,
  type Position,
  type PortTone,
  type StageState
} from "../lib/base-selection-lab.js";

type BaseSelectionLabProps = {
  onBack: () => void;
};

type DragState =
  | {
      kind: "canvas";
      originOffsetX: number;
      originOffsetY: number;
      startX: number;
      startY: number;
    }
  | {
      kind: "edge";
      stageBounds: {
        left: number;
        top: number;
      };
    }
  | {
      kind: "node";
      nodeId: string;
      originX: number;
      originY: number;
      startX: number;
      startY: number;
    }
  | null;

const domCssObservations = [
  "节点与端口保留 DOM 语义，按钮、文本和可访问性最直白。",
  "边只能用旋转条带近似，线条层次和交叉表达明显吃亏。",
  "更适合作为低复杂度工作台，不适合承担最终关系图主方案。"
];

const domSvgObservations = [
  "DOM 节点与 SVG 边天然分层，节点编辑和连线表达更平衡。",
  "对 `chrome mcp` 仍保留较好语义，节点与工具按钮都能直接定位。",
  "这是当前暂定主推荐，但需要用户通过本页进行最终视觉确认。"
];

const canvasObservations = [
  "视觉一体化潜力高，节点与边都可统一绘制，密度表现更强。",
  "节点、端口和标签不会自然进入可访问性树，自动化只能退回坐标语义。",
  "更适合作为后续性能型候选，而不是当前第一版主交互层。"
];

function createPortHandle(
  kind: LabPortKind,
  nodeId: string,
  portName: string
): PortHandle {
  return {
    kind,
    nodeId,
    portName
  };
}

function getCanvasPortAppearance(
  kind: LabPortKind,
  tone: PortTone
): {
  dotFill: string;
  dotRadius: number;
  dotStroke: string;
  haloFill: string | null;
  haloRadius: number;
  labelFill: string;
} {
  const baseFill = kind === "input" ? "#efe3ca" : "#d9ebdf";

  switch (tone) {
    case "hover":
      return {
        dotFill: "#eef4fb",
        dotRadius: portRadius + 0.5,
        dotStroke: "#375d8f",
        haloFill: "rgba(55, 93, 143, 0.16)",
        haloRadius: portRadius + 5,
        labelFill: "#294a69"
      };
    case "source":
      return {
        dotFill: "#f7dfd2",
        dotRadius: portRadius + 1,
        dotStroke: "#ad5c2c",
        haloFill: "rgba(173, 92, 44, 0.2)",
        haloRadius: portRadius + 7,
        labelFill: "#874621"
      };
    case "target":
      return {
        dotFill: "#e4f1ec",
        dotRadius: portRadius + 1,
        dotStroke: "#214e47",
        haloFill: "rgba(33, 78, 71, 0.2)",
        haloRadius: portRadius + 7,
        labelFill: "#214e47"
      };
    default:
      return {
        dotFill: baseFill,
        dotRadius: portRadius,
        dotStroke: kind === "input" ? "rgba(111, 88, 49, 0.42)" : "rgba(33, 78, 71, 0.4)",
        haloFill: null,
        haloRadius: 0,
        labelFill: "#3e463f"
      };
  }
}

function getLineStyle(points: {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}) {
  const {
    x1,
    x2,
    y1,
    y2
  } = points;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  return {
    labelX: x1 + dx / 2,
    labelY: y1 + dy / 2,
    length,
    left: x1,
    top: y1,
    transform: `rotate(${angle}deg)`
  };
}

function getBezierPath(points: {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}): string {
  const {
    x1,
    x2,
    y1,
    y2
  } = points;
  const bend = Math.max(72, Math.abs(x2 - x1) * 0.35);

  return `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`;
}

function useInteractiveStageState() {
  const [stageState, setStageState] = useState<StageState>(() => createStageState());
  const [dragState, setDragState] = useState<DragState>(null);

  useEffect(() => {
    if (!dragState) {
      return;
    }

    const activeDrag = dragState;

    function handlePointerMove(event: PointerEvent) {
      setStageState((current) => {
        if (activeDrag.kind === "canvas") {
          return panCanvasViewportFromOrigin(current, {
            deltaX: event.clientX - activeDrag.startX,
            deltaY: event.clientY - activeDrag.startY,
            originOffsetX: activeDrag.originOffsetX,
            originOffsetY: activeDrag.originOffsetY
          });
        }

        if (activeDrag.kind === "edge") {
          const point = resolveStagePoint(
            current,
            activeDrag.stageBounds,
            event.clientX,
            event.clientY
          );

          return updatePendingEdge(current, {
            currentX: point.x,
            currentY: point.y
          });
        }

        return {
          ...current,
          positions: {
            ...current.positions,
            [activeDrag.nodeId]: {
              x: activeDrag.originX + (event.clientX - activeDrag.startX) / current.zoom,
              y: activeDrag.originY + (event.clientY - activeDrag.startY) / current.zoom
            }
          }
        };
      });
    }

    function handlePointerUp() {
      if (activeDrag.kind === "edge") {
        setStageState((current) => clearPendingEdge(current));
      }

      setDragState(null);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [dragState]);

  return {
    dragState,
    setDragState,
    setStageState,
    stageState
  };
}

type DomStageProps = {
  edgeMode: "css" | "svg";
  observations: string[];
  regionLabel: string;
  stageTitle: string;
  summary: string;
};

function DomStage(props: DomStageProps) {
  const regionRef = useRef<HTMLDivElement | null>(null);
  const {
    dragState,
    setDragState,
    setStageState,
    stageState
  } = useInteractiveStageState();
  const pendingPoints = getPendingEdgePoints(stageState);

  return (
    <article className="base-lab-card">
      <div className="base-lab-card-header">
        <div>
          <p className="base-lab-card-kicker">{props.edgeMode === "css" ? "Pure DOM bias" : "Hybrid bias"}</p>
          <h3>{props.stageTitle}</h3>
        </div>
        <span className="base-lab-card-badge">
          {props.edgeMode === "css" ? "语义强 / 线弱" : "平衡推荐"}
        </span>
      </div>

      <p className="base-lab-card-summary">{props.summary}</p>

      <div className="graph-toolbar base-lab-toolbar">
        <button
          className="toolbar-button"
          onClick={() =>
            setStageState((current) => zoomCanvasViewport(current, current.zoom - 0.1))
          }
          type="button"
        >
          Zoom Out
        </button>

        <button
          className="toolbar-button"
          onClick={() =>
            setStageState((current) => zoomCanvasViewport(current, current.zoom + 0.1))
          }
          type="button"
        >
          Zoom In
        </button>

        <label className="canvas-size-field">
          Canvas Width
          <input
            onChange={(event) =>
              setStageState((current) =>
                resizeCanvasViewport(current, {
                  canvasWidth: Number(event.target.value),
                  canvasHeight: current.canvasHeight
                })
              )
            }
            type="number"
            value={stageState.canvasWidth}
          />
        </label>

        <label className="canvas-size-field">
          Canvas Height
          <input
            onChange={(event) =>
              setStageState((current) =>
                resizeCanvasViewport(current, {
                  canvasWidth: current.canvasWidth,
                  canvasHeight: Number(event.target.value)
                })
              )
            }
            type="number"
            value={stageState.canvasHeight}
          />
        </label>
      </div>

      <div className="graph-meta base-lab-meta">
        <span>Selected: {getNodeById(stageState.selectedNodeId).label}</span>
        <span>Coordinates: {getSelectedCoordinates(stageState)}</span>
        <span>Zoom: {stageState.zoom.toFixed(1)}x</span>
      </div>

      <div
        aria-label={props.regionLabel}
        className="base-lab-stage"
        onPointerDown={(event) => {
          setStageState((current) => setHoveredPort(current, null));
          setDragState({
            kind: "canvas",
            originOffsetX: stageState.offsetX,
            originOffsetY: stageState.offsetY,
            startX: event.clientX,
            startY: event.clientY
          });
        }}
        onPointerLeave={() => {
          setStageState((current) => setHoveredPort(current, null));
        }}
        onPointerMove={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect();
          const {
            clientX,
            clientY
          } = event;

          setStageState((current) => {
            if (dragState && dragState.kind !== "edge") {
              return setHoveredPort(current, null);
            }

            const point = resolveStagePoint(
              current,
              bounds,
              clientX,
              clientY
            );

            return setHoveredPort(
              current,
              findPortHandle(current, point, dragState?.kind === "edge" ? "input" : undefined)
            );
          });
        }}
        ref={regionRef}
        role="region"
      >
        <div
          className="base-lab-stage-inner"
          style={{
            height: `${stageState.canvasHeight}px`,
            transform: `translate(${stageState.offsetX}px, ${stageState.offsetY}px) scale(${stageState.zoom})`,
            width: `${stageState.canvasWidth}px`
          }}
        >
          {props.edgeMode === "svg" ? (
            <svg aria-hidden="true" className="base-lab-svg-layer">
              {stageState.edges.map((edge) => {
                const points = getEdgePoints(stageState, edge);

                return (
                  <g className="base-lab-svg-edge" key={edge.id}>
                    <path d={getBezierPath(points)} />
                    <text x={(points.x1 + points.x2) / 2} y={(points.y1 + points.y2) / 2 - 8}>
                      {edge.label}
                    </text>
                  </g>
                );
              })}
              {pendingPoints ? (
                <g className="base-lab-svg-edge base-lab-svg-edge-preview">
                  <path d={getBezierPath(pendingPoints)} />
                </g>
              ) : null}
            </svg>
          ) : (
            <div aria-hidden="true" className="base-lab-css-edge-layer">
              {stageState.edges.map((edge) => {
                const edgeStyle = getLineStyle(getEdgePoints(stageState, edge));

                return (
                  <div
                    className="base-lab-css-edge"
                    key={edge.id}
                    style={{
                      left: `${edgeStyle.left}px`,
                      top: `${edgeStyle.top}px`,
                      width: `${edgeStyle.length}px`,
                      transform: edgeStyle.transform
                    }}
                  >
                    <span
                      className="base-lab-css-edge-label"
                      style={{
                        left: `${edgeStyle.length / 2}px`
                      }}
                    >
                      {edge.label}
                    </span>
                  </div>
                );
              })}
              {pendingPoints ? (
                <div
                  className="base-lab-css-edge base-lab-css-edge-preview"
                  style={{
                    left: `${getLineStyle(pendingPoints).left}px`,
                    top: `${getLineStyle(pendingPoints).top}px`,
                    width: `${getLineStyle(pendingPoints).length}px`,
                    transform: getLineStyle(pendingPoints).transform
                  }}
                />
              ) : null}
            </div>
          )}

          <div className="base-lab-node-layer">
            {labNodes.map((node) => {
              const position = getNodePosition(stageState, node.id);
              const isSelected = node.id === stageState.selectedNodeId;

              return (
                <div
                  aria-label={node.label}
                  className={isSelected ? "base-lab-node base-lab-node-active" : "base-lab-node"}
                  key={node.id}
                  onClick={() =>
                    setStageState((current) =>
                      setHoveredPort(
                        {
                          ...current,
                          selectedNodeId: node.id
                        },
                        null
                      )
                    )
                  }
                  onPointerDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setStageState((current) =>
                      setHoveredPort(
                        {
                          ...current,
                          selectedNodeId: node.id
                        },
                        null
                      )
                    );
                    setDragState({
                      kind: "node",
                      nodeId: node.id,
                      originX: position.x,
                      originY: position.y,
                      startX: event.clientX,
                      startY: event.clientY
                    });
                  }}
                  role="button"
                  style={{
                    "--lab-accent": node.accent,
                    left: `${position.x}px`,
                    top: `${position.y}px`
                  } as CSSProperties}
                  tabIndex={0}
                >
                  <div className="base-lab-node-header">
                    <strong>{node.label}</strong>
                    <span>{node.category}</span>
                  </div>

                  <div className="base-lab-node-body">
                    <div className="base-lab-port-column">
                      {node.inputs.map((port) => {
                        const handle = createPortHandle("input", node.id, port);
                        const tone = getPortTone(stageState, handle);

                        return (
                          <button
                            aria-label={`${node.label} input ${port}`}
                            className="base-lab-port-row base-lab-port-button"
                            data-port-tone={tone}
                            key={`${node.id}-${port}-input`}
                            onBlur={() => {
                              setStageState((current) => setHoveredPort(current, null));
                            }}
                            onFocus={() => {
                              setStageState((current) => setHoveredPort(current, handle));
                            }}
                            onPointerDown={(event) => {
                              event.stopPropagation();
                              setStageState((current) => setHoveredPort(current, handle));
                            }}
                            onPointerUp={(event) => {
                              if (dragState?.kind !== "edge") {
                                return;
                              }

                              event.preventDefault();
                              event.stopPropagation();
                              setStageState((current) =>
                                connectPendingEdge(current, {
                                  targetId: node.id,
                                  targetPort: port
                                })
                              );
                              setDragState(null);
                            }}
                            type="button"
                          >
                            <span className="base-lab-port-dot" />
                            <span>{port}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="base-lab-node-core">
                      <span>Viewport linked</span>
                      <span>Drag or wire</span>
                    </div>

                    <div className="base-lab-port-column base-lab-port-column-output">
                      {node.outputs.map((port) => {
                        const handle = createPortHandle("output", node.id, port);
                        const tone = getPortTone(stageState, handle);

                        return (
                          <button
                            aria-label={`${node.label} output ${port}`}
                            className="base-lab-port-row base-lab-port-button base-lab-port-button-output"
                            data-port-tone={tone}
                            key={`${node.id}-${port}-output`}
                            onBlur={() => {
                              setStageState((current) => setHoveredPort(current, null));
                            }}
                            onFocus={() => {
                              setStageState((current) => setHoveredPort(current, handle));
                            }}
                            onPointerDown={(event) => {
                              const bounds = regionRef.current?.getBoundingClientRect();

                              if (!bounds) {
                                return;
                              }

                              event.preventDefault();
                              event.stopPropagation();
                              const point = resolveStagePoint(
                                stageState,
                                bounds,
                                event.clientX,
                                event.clientY
                              );
                              setStageState((current) =>
                                startPendingEdge(
                                  setHoveredPort(
                                    {
                                      ...current,
                                      selectedNodeId: node.id
                                    },
                                    handle
                                  ),
                                  {
                                    currentX: point.x,
                                    currentY: point.y,
                                    sourceId: node.id,
                                    sourcePort: port
                                  }
                                )
                              );
                              setDragState({
                                kind: "edge",
                                stageBounds: {
                                  left: bounds.left,
                                  top: bounds.top
                                }
                              });
                            }}
                            type="button"
                          >
                            <span>{port}</span>
                            <span className="base-lab-port-dot" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="base-lab-node-footer">
                    <span>{node.status}</span>
                    <span>{Math.round(position.x)}, {Math.round(position.y)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ul className="base-lab-observation-list">
        {props.observations.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

function CanvasStage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const {
    dragState,
    setDragState,
    setStageState,
    stageState
  } = useInteractiveStageState();
  const pendingPoints = getPendingEdgePoints(stageState);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.round(stageState.canvasWidth * ratio);
    canvas.height = Math.round(stageState.canvasHeight * ratio);
    canvas.style.width = `${stageState.canvasWidth}px`;
    canvas.style.height = `${stageState.canvasHeight}px`;

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.scale(ratio, ratio);

    context.fillStyle = "#fbf7ef";
    context.fillRect(0, 0, stageState.canvasWidth, stageState.canvasHeight);

    context.strokeStyle = "rgba(44, 41, 37, 0.08)";
    context.lineWidth = 1;

    for (let x = 0; x < stageState.canvasWidth; x += 28) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, stageState.canvasHeight);
      context.stroke();
    }

    for (let y = 0; y < stageState.canvasHeight; y += 28) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(stageState.canvasWidth, y);
      context.stroke();
    }

    context.save();
    context.translate(stageState.offsetX, stageState.offsetY);
    context.scale(stageState.zoom, stageState.zoom);

    for (const edge of stageState.edges) {
      const points = getEdgePoints(stageState, edge);
      const bend = Math.max(72, Math.abs(points.x2 - points.x1) * 0.35);

      context.beginPath();
      context.moveTo(points.x1, points.y1);
      context.bezierCurveTo(
        points.x1 + bend,
        points.y1,
        points.x2 - bend,
        points.y2,
        points.x2,
        points.y2
      );
      context.strokeStyle = "rgba(42, 88, 99, 0.78)";
      context.lineWidth = 3;
      context.stroke();

      context.fillStyle = "#31414f";
      context.font = "12px Noto Sans SC, sans-serif";
      context.fillText(
        edge.label,
        (points.x1 + points.x2) / 2 - 10,
        (points.y1 + points.y2) / 2 - 10
      );
    }

    if (pendingPoints) {
      const bend = Math.max(72, Math.abs(pendingPoints.x2 - pendingPoints.x1) * 0.35);

      context.beginPath();
      context.moveTo(pendingPoints.x1, pendingPoints.y1);
      context.bezierCurveTo(
        pendingPoints.x1 + bend,
        pendingPoints.y1,
        pendingPoints.x2 - bend,
        pendingPoints.y2,
        pendingPoints.x2,
        pendingPoints.y2
      );
      context.strokeStyle = "rgba(173, 92, 44, 0.72)";
      context.lineWidth = 2.5;
      context.stroke();
    }

    for (const node of labNodes) {
      const position = getNodePosition(stageState, node.id);
      const selected = stageState.selectedNodeId === node.id;

      context.fillStyle = "#fffaf0";
      context.strokeStyle = selected ? "#214e47" : "rgba(34, 31, 29, 0.16)";
      context.lineWidth = selected ? 3 : 1.5;
      context.beginPath();
      context.roundRect(position.x, position.y, nodeWidth, nodeHeight, 18);
      context.fill();
      context.stroke();

      context.fillStyle = node.accent;
      context.beginPath();
      context.roundRect(position.x, position.y, nodeWidth, headerHeight, 18);
      context.fill();

      context.fillStyle = "#f7f3ea";
      context.font = "600 13px Noto Sans SC, sans-serif";
      context.fillText(node.label, position.x + 14, position.y + 22);
      context.font = "12px Noto Sans SC, sans-serif";
      context.fillText(node.category, position.x + nodeWidth - 62, position.y + 22);

      context.fillStyle = "#3e463f";
      context.font = "12px Noto Sans SC, sans-serif";
      node.inputs.forEach((port) => {
        const anchor = getPortAnchor(stageState, node.id, "input", port);
        const tone = getPortTone(stageState, createPortHandle("input", node.id, port));
        const appearance = getCanvasPortAppearance("input", tone);

        if (appearance.haloFill) {
          context.beginPath();
          context.fillStyle = appearance.haloFill;
          context.arc(anchor.x, anchor.y, appearance.haloRadius, 0, Math.PI * 2);
          context.fill();
        }

        context.beginPath();
        context.fillStyle = appearance.dotFill;
        context.strokeStyle = appearance.dotStroke;
        context.lineWidth = tone === "idle" ? 1.5 : 2.5;
        context.arc(anchor.x, anchor.y, appearance.dotRadius, 0, Math.PI * 2);
        context.fill();
        context.stroke();
        context.fillStyle = appearance.labelFill;
        context.fillText(port, position.x + 22, anchor.y + 4);
      });

      node.outputs.forEach((port) => {
        const anchor = getPortAnchor(stageState, node.id, "output", port);
        const textWidth = context.measureText(port).width;
        const tone = getPortTone(stageState, createPortHandle("output", node.id, port));
        const appearance = getCanvasPortAppearance("output", tone);

        if (appearance.haloFill) {
          context.beginPath();
          context.fillStyle = appearance.haloFill;
          context.arc(anchor.x, anchor.y, appearance.haloRadius, 0, Math.PI * 2);
          context.fill();
        }

        context.beginPath();
        context.fillStyle = appearance.dotFill;
        context.strokeStyle = appearance.dotStroke;
        context.lineWidth = tone === "idle" ? 1.5 : 2.5;
        context.arc(anchor.x, anchor.y, appearance.dotRadius, 0, Math.PI * 2);
        context.fill();
        context.stroke();
        context.fillStyle = appearance.labelFill;
        context.fillText(port, position.x + nodeWidth - textWidth - 22, anchor.y + 4);
      });

      context.fillStyle = "#6c6254";
      context.fillText(
        `${node.status} / ${Math.round(position.x)}, ${Math.round(position.y)}`,
        position.x + 14,
        position.y + nodeHeight - 14
      );
    }

    context.restore();
  }, [stageState]);

  return (
    <article className="base-lab-card">
      <div className="base-lab-card-header">
        <div>
          <p className="base-lab-card-kicker">Bitmap bias</p>
          <h3>Canvas</h3>
        </div>
        <span className="base-lab-card-badge">视觉强 / 语义弱</span>
      </div>

      <p className="base-lab-card-summary">
        把节点、边和热点统一绘制在位图层里，便于观察视觉密度，但刻意保留其自动化与语义代价。
      </p>

      <div className="graph-toolbar base-lab-toolbar">
        <button
          className="toolbar-button"
          onClick={() =>
            setStageState((current) => zoomCanvasViewport(current, current.zoom - 0.1))
          }
          type="button"
        >
          Zoom Out
        </button>

        <button
          className="toolbar-button"
          onClick={() =>
            setStageState((current) => zoomCanvasViewport(current, current.zoom + 0.1))
          }
          type="button"
        >
          Zoom In
        </button>

        <label className="canvas-size-field">
          Canvas Width
          <input
            onChange={(event) =>
              setStageState((current) =>
                resizeCanvasViewport(current, {
                  canvasWidth: Number(event.target.value),
                  canvasHeight: current.canvasHeight
                })
              )
            }
            type="number"
            value={stageState.canvasWidth}
          />
        </label>

        <label className="canvas-size-field">
          Canvas Height
          <input
            onChange={(event) =>
              setStageState((current) =>
                resizeCanvasViewport(current, {
                  canvasWidth: current.canvasWidth,
                  canvasHeight: Number(event.target.value)
                })
              )
            }
            type="number"
            value={stageState.canvasHeight}
          />
        </label>
      </div>

      <div className="graph-meta base-lab-meta">
        <span>Selected: {getNodeById(stageState.selectedNodeId).label}</span>
        <span>Coordinates: {getSelectedCoordinates(stageState)}</span>
        <span>Zoom: {stageState.zoom.toFixed(1)}x</span>
      </div>

      <div
        aria-label="Canvas 验证画布"
        className="base-lab-stage"
        role="region"
      >
        <canvas
          className="base-lab-canvas-surface"
          onPointerDown={(event) => {
            const bounds = event.currentTarget.getBoundingClientRect();
            const point = resolveStagePoint(stageState, bounds, event.clientX, event.clientY);
            const outputHandle = findPortHandle(stageState, point, "output");

            if (outputHandle) {
              setStageState((current) =>
                startPendingEdge(
                  setHoveredPort(
                    {
                      ...current,
                      selectedNodeId: outputHandle.nodeId
                    },
                    outputHandle
                  ),
                  {
                    currentX: point.x,
                    currentY: point.y,
                    sourceId: outputHandle.nodeId,
                    sourcePort: outputHandle.portName
                  }
                )
              );
              setDragState({
                kind: "edge",
                stageBounds: {
                  left: bounds.left,
                  top: bounds.top
                }
              });
              return;
            }

            const hitNodeId = findHitNodeId(stageState, point);

            if (hitNodeId) {
              const position = getNodePosition(stageState, hitNodeId);

              setStageState((current) =>
                setHoveredPort(
                  {
                    ...current,
                    selectedNodeId: hitNodeId
                  },
                  null
                )
              );
              setDragState({
                kind: "node",
                nodeId: hitNodeId,
                originX: position.x,
                originY: position.y,
                startX: event.clientX,
                startY: event.clientY
              });
              return;
            }

            setStageState((current) => setHoveredPort(current, null));
            setDragState({
              kind: "canvas",
              originOffsetX: stageState.offsetX,
              originOffsetY: stageState.offsetY,
              startX: event.clientX,
              startY: event.clientY
            });
          }}
          onPointerLeave={() => {
            setStageState((current) => setHoveredPort(current, null));
          }}
          onPointerMove={(event) => {
            const bounds = event.currentTarget.getBoundingClientRect();
            const {
              clientX,
              clientY
            } = event;

            setStageState((current) => {
              if (dragState && dragState.kind !== "edge") {
                return setHoveredPort(current, null);
              }

              const point = resolveStagePoint(
                current,
                bounds,
                clientX,
                clientY
              );

              return setHoveredPort(
                current,
                findPortHandle(current, point, dragState?.kind === "edge" ? "input" : undefined)
              );
            });
          }}
          onPointerUp={(event) => {
            if (dragState?.kind !== "edge") {
              return;
            }

            const bounds = event.currentTarget.getBoundingClientRect();
            const point = resolveStagePoint(stageState, bounds, event.clientX, event.clientY);
            const inputHandle = findPortHandle(stageState, point, "input");

            if (!inputHandle) {
              return;
            }

            setStageState((current) =>
              connectPendingEdge(current, {
                targetId: inputHandle.nodeId,
                targetPort: inputHandle.portName
              })
            );
            setDragState(null);
          }}
          ref={canvasRef}
        />
      </div>

      <ul className="base-lab-observation-list">
        {canvasObservations.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

export default function BaseSelectionLab(props: BaseSelectionLabProps) {
  return (
    <section className="panel base-lab-shell">
      <div className="panel-header base-lab-header">
        <div>
          <p className="base-lab-eyebrow">WBS 3.1</p>
          <h2>WBS 3.1 基座对比验证</h2>
          <p className="base-lab-intro">
            使用同一批节点、同一套拖拽与视口指标，对比 `DOM + CSS`、`DOM + SVG`
            与 `Canvas` 三种典型方案。当前结论不再只来自文档，而是允许你直接看验证面后拍板。
          </p>
        </div>

        <button className="toolbar-button toolbar-button-primary" onClick={props.onBack} type="button">
          Back to BaseLab
        </button>
      </div>

      <div className="base-lab-scoreboard">
        <div className="base-lab-score-item">
          <strong>统一任务</strong>
          <span>节点拖拽 / 画布平移 / 缩放 / 画布尺寸配置 / 坐标观察</span>
        </div>
        <div className="base-lab-score-item">
          <strong>对比重点</strong>
          <span>线条表达、端口清晰度、节点信息密度、`chrome mcp` 语义可见性</span>
        </div>
        <div className="base-lab-score-item">
          <strong>当前暂定推荐</strong>
          <span>`DOM + SVG`，但以本页人工观感与交互确认结果为准</span>
        </div>
      </div>

      <div className="base-lab-grid">
        <DomStage
          edgeMode="css"
          observations={domCssObservations}
          regionLabel="DOM + CSS 验证画布"
          stageTitle="DOM + CSS"
          summary="保留尽量纯的 DOM 结构，边用旋转条带近似，观察语义优势与边表达上限。"
        />
        <DomStage
          edgeMode="svg"
          observations={domSvgObservations}
          regionLabel="DOM + SVG 验证画布"
          stageTitle="DOM + SVG"
          summary="节点仍是 DOM，可直接点击与定位；边转到 SVG 层，用于观察表达力与可测性的平衡。"
        />
        <CanvasStage />
      </div>
    </section>
  );
}
