import { useEffect, useRef, useState, type CSSProperties } from "react";

import {
  createCanvasViewport,
  panCanvasViewport,
  resizeCanvasViewport,
  zoomCanvasViewport,
  type CanvasViewport
} from "../lib/view-canvas.js";

type BaseSelectionLabProps = {
  onBack: () => void;
};

type LabNode = {
  accent: string;
  category: string;
  id: string;
  inputs: string[];
  label: string;
  outputs: string[];
  status: string;
};

type LabEdge = {
  id: string;
  label: string;
  sourceId: string;
  targetId: string;
};

type Position = {
  x: number;
  y: number;
};

type StageState = CanvasViewport & {
  positions: Record<string, Position>;
  selectedNodeId: string;
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
      kind: "node";
      nodeId: string;
      originX: number;
      originY: number;
      startX: number;
      startY: number;
    }
  | null;

const nodeWidth = 228;
const nodeHeight = 138;
const headerHeight = 36;
const portStartOffset = 62;
const portRowHeight = 28;
const portRadius = 6;

const labNodes: LabNode[] = [
  {
    accent: "#375d8f",
    category: "Scene",
    id: "scene-entry",
    inputs: [
      "enter",
      "context"
    ],
    label: "Scene Entry",
    outputs: [
      "lead",
      "token"
    ],
    status: "Stable"
  },
  {
    accent: "#8a5936",
    category: "Event",
    id: "detect-token",
    inputs: [
      "trigger",
      "evidence"
    ],
    label: "Detect Token",
    outputs: [
      "clue",
      "state"
    ],
    status: "Dragged"
  },
  {
    accent: "#2f6f63",
    category: "Clue",
    id: "reveal-clue",
    inputs: [
      "input",
      "memory"
    ],
    label: "Reveal Clue",
    outputs: [
      "branch",
      "focus"
    ],
    status: "Selectable"
  },
  {
    accent: "#86503c",
    category: "Arc",
    id: "trigger-arc",
    inputs: [
      "signal",
      "link"
    ],
    label: "Trigger Arc",
    outputs: [
      "result",
      "echo"
    ],
    status: "Observe"
  }
];

const labEdges: LabEdge[] = [
  {
    id: "edge-scene-token",
    label: "lead",
    sourceId: "scene-entry",
    targetId: "detect-token"
  },
  {
    id: "edge-token-clue",
    label: "clue",
    sourceId: "detect-token",
    targetId: "reveal-clue"
  },
  {
    id: "edge-clue-arc",
    label: "branch",
    sourceId: "reveal-clue",
    targetId: "trigger-arc"
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

function createStageState(): StageState {
  return {
    ...createCanvasViewport({
      canvasHeight: 620,
      canvasWidth: 1080,
      offsetX: 32,
      offsetY: 28,
      zoom: 1
    }),
    positions: structuredClone(initialPositions),
    selectedNodeId: "detect-token"
  };
}

function getNodeById(nodeId: string): LabNode {
  const node = labNodes.find((item) => item.id === nodeId);

  if (!node) {
    throw new Error(`Unknown lab node: ${nodeId}`);
  }

  return node;
}

function getSelectedCoordinates(stageState: StageState): string {
  const position = getNodePosition(stageState, stageState.selectedNodeId);

  return `${Math.round(position.x)}, ${Math.round(position.y)}`;
}

function getNodePosition(stageState: StageState, nodeId: string): Position {
  const position = stageState.positions[nodeId];

  if (!position) {
    throw new Error(`Unknown node position: ${nodeId}`);
  }

  return position;
}

function getPortY(position: Position, index: number): number {
  return position.y + portStartOffset + index * portRowHeight;
}

function getEdgePoints(stageState: StageState, edge: LabEdge) {
  const sourceNode = getNodeById(edge.sourceId);
  const targetNode = getNodeById(edge.targetId);
  const sourcePosition = getNodePosition(stageState, edge.sourceId);
  const targetPosition = getNodePosition(stageState, edge.targetId);

  const sourceIndex = Math.min(sourceNode.outputs.length - 1, 0);
  const targetIndex = Math.min(targetNode.inputs.length - 1, 0);

  return {
    x1: sourcePosition.x + nodeWidth - 12,
    x2: targetPosition.x + 12,
    y1: getPortY(sourcePosition, sourceIndex),
    y2: getPortY(targetPosition, targetIndex)
  };
}

function getEdgeLineStyle(stageState: StageState, edge: LabEdge) {
  const {
    x1,
    x2,
    y1,
    y2
  } = getEdgePoints(stageState, edge);
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

function getBezierPath(stageState: StageState, edge: LabEdge): string {
  const {
    x1,
    x2,
    y1,
    y2
  } = getEdgePoints(stageState, edge);
  const bend = Math.max(72, Math.abs(x2 - x1) * 0.35);

  return `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`;
}

function resolveStagePoint(
  stageState: StageState,
  bounds: DOMRect,
  clientX: number,
  clientY: number
): Position {
  return {
    x: (clientX - bounds.left - stageState.offsetX) / stageState.zoom,
    y: (clientY - bounds.top - stageState.offsetY) / stageState.zoom
  };
}

function findHitNodeId(stageState: StageState, point: Position): string | null {
  const orderedNodes = [
    ...labNodes
  ].reverse();

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
          return panCanvasViewport(current, {
            deltaX: event.clientX - activeDrag.startX - activeDrag.originOffsetX,
            deltaY: event.clientY - activeDrag.startY - activeDrag.originOffsetY
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
  const {
    setDragState,
    setStageState,
    stageState
  } = useInteractiveStageState();

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
          setDragState({
            kind: "canvas",
            originOffsetX: stageState.offsetX,
            originOffsetY: stageState.offsetY,
            startX: event.clientX,
            startY: event.clientY
          });
        }}
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
              {labEdges.map((edge) => {
                const {
                  x1,
                  x2,
                  y1,
                  y2
                } = getEdgePoints(stageState, edge);

                return (
                  <g className="base-lab-svg-edge" key={edge.id}>
                    <path d={getBezierPath(stageState, edge)} />
                    <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 8}>
                      {edge.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          ) : (
            <div aria-hidden="true" className="base-lab-css-edge-layer">
              {labEdges.map((edge) => {
                const edgeStyle = getEdgeLineStyle(stageState, edge);

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
            </div>
          )}

          <div className="base-lab-node-layer">
            {labNodes.map((node) => {
              const position = getNodePosition(stageState, node.id);
              const isSelected = node.id === stageState.selectedNodeId;

              return (
                <button
                  aria-label={node.label}
                  className={isSelected ? "base-lab-node base-lab-node-active" : "base-lab-node"}
                  key={node.id}
                  onClick={() =>
                    setStageState((current) => ({
                      ...current,
                      selectedNodeId: node.id
                    }))
                  }
                  onPointerDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setStageState((current) => ({
                      ...current,
                      selectedNodeId: node.id
                    }));
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
                    "--lab-accent": node.accent,
                    left: `${position.x}px`,
                    top: `${position.y}px`
                  } as CSSProperties}
                  type="button"
                >
                  <div className="base-lab-node-header">
                    <strong>{node.label}</strong>
                    <span>{node.category}</span>
                  </div>

                  <div className="base-lab-node-body">
                    <div className="base-lab-port-column">
                      {node.inputs.map((port) => (
                        <div className="base-lab-port-row" key={`${node.id}-${port}-input`}>
                          <span className="base-lab-port-dot" />
                          <span>{port}</span>
                        </div>
                      ))}
                    </div>

                    <div className="base-lab-node-core">
                      <span>Viewport linked</span>
                      <span>Drag to compare</span>
                    </div>

                    <div className="base-lab-port-column base-lab-port-column-output">
                      {node.outputs.map((port) => (
                        <div className="base-lab-port-row" key={`${node.id}-${port}-output`}>
                          <span>{port}</span>
                          <span className="base-lab-port-dot" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="base-lab-node-footer">
                    <span>{node.status}</span>
                    <span>{Math.round(position.x)}, {Math.round(position.y)}</span>
                  </div>
                </button>
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
    setDragState,
    setStageState,
    stageState
  } = useInteractiveStageState();

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

    for (const edge of labEdges) {
      const {
        x1,
        x2,
        y1,
        y2
      } = getEdgePoints(stageState, edge);
      const bend = Math.max(72, Math.abs(x2 - x1) * 0.35);

      context.beginPath();
      context.moveTo(x1, y1);
      context.bezierCurveTo(x1 + bend, y1, x2 - bend, y2, x2, y2);
      context.strokeStyle = "rgba(42, 88, 99, 0.78)";
      context.lineWidth = 3;
      context.stroke();

      context.fillStyle = "#31414f";
      context.font = "12px Noto Sans SC, sans-serif";
      context.fillText(edge.label, (x1 + x2) / 2 - 10, (y1 + y2) / 2 - 10);
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
      node.inputs.forEach((port, index) => {
        const portY = getPortY(position, index);
        context.beginPath();
        context.fillStyle = "#efe3ca";
        context.arc(position.x + 10, portY, portRadius, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = "#3e463f";
        context.fillText(port, position.x + 22, portY + 4);
      });

      node.outputs.forEach((port, index) => {
        const portY = getPortY(position, index);
        const textWidth = context.measureText(port).width;
        context.beginPath();
        context.fillStyle = "#d9ebdf";
        context.arc(position.x + nodeWidth - 10, portY, portRadius, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = "#3e463f";
        context.fillText(port, position.x + nodeWidth - textWidth - 22, portY + 4);
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
            const hitNodeId = findHitNodeId(stageState, point);

            if (hitNodeId) {
              const position = getNodePosition(stageState, hitNodeId);

              setStageState((current) => ({
                ...current,
                selectedNodeId: hitNodeId
              }));
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

            setDragState({
              kind: "canvas",
              originOffsetX: stageState.offsetX,
              originOffsetY: stageState.offsetY,
              startX: event.clientX,
              startY: event.clientY
            });
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
          Back to Workbench
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
