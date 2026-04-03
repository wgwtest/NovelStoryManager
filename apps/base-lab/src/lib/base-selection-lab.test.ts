import { describe, expect, it } from "vitest";

import {
  connectPendingEdge,
  createStageState,
  findPortHandle,
  getNodePosition,
  getPendingEdgePoints,
  startPendingEdge,
  updatePendingEdge,
  type Position
} from "./base-selection-lab.js";

function expectPortHandle(point: Position) {
  const handle = findPortHandle(createStageState(), point);

  expect(handle).not.toBeNull();

  return handle;
}

describe("base selection lab stage helpers", () => {
  it("detects output and input port hit areas for connection dragging", () => {
    const stageState = createStageState();
    const scenePosition = getNodePosition(stageState, "scene-entry");
    const triggerArcPosition = getNodePosition(stageState, "trigger-arc");

    expectPortHandle({
      x: scenePosition.x + 218,
      y: scenePosition.y + 62
    });

    expectPortHandle({
      x: triggerArcPosition.x + 10,
      y: triggerArcPosition.y + 62
    });
  });

  it("creates a new edge after dragging from an output port to an input port", () => {
    const stageState = createStageState();
    const triggerArcPosition = getNodePosition(stageState, "trigger-arc");
    const dragging = updatePendingEdge(
      startPendingEdge(stageState, {
        currentX: 610,
        currentY: 254,
        sourceId: "detect-token",
        sourcePort: "state"
      }),
      {
        currentX: triggerArcPosition.x + 10,
        currentY: triggerArcPosition.y + 62
      }
    );

    expect(getPendingEdgePoints(dragging)).toEqual({
      x1: 590,
      x2: triggerArcPosition.x + 10,
      y1: 288,
      y2: triggerArcPosition.y + 62
    });

    const connected = connectPendingEdge(dragging, {
      targetId: "trigger-arc",
      targetPort: "signal"
    });

    expect(connected.pendingEdge).toBeNull();
    expect(connected.edges).toHaveLength(4);
    expect(connected.edges.at(-1)).toMatchObject({
      label: "state",
      sourceId: "detect-token",
      sourcePort: "state",
      targetId: "trigger-arc",
      targetPort: "signal"
    });
  });
});
