import { describe, expect, it } from "vitest";

import {
  clampCanvasZoom,
  createCanvasViewport,
  panCanvasViewport,
  resizeCanvasViewport
} from "./view-canvas.js";

describe("view canvas helpers", () => {
  it("creates a viewport with stable defaults", () => {
    expect(createCanvasViewport()).toEqual({
      canvasHeight: 800,
      canvasWidth: 1200,
      offsetX: 0,
      offsetY: 0,
      zoom: 1
    });
  });

  it("clamps zoom into the supported range", () => {
    expect(clampCanvasZoom(0.01)).toBe(0.4);
    expect(clampCanvasZoom(4)).toBe(2.5);
    expect(clampCanvasZoom(1.25)).toBe(1.25);
  });

  it("applies pan and resize updates without mutating the original object", () => {
    const viewport = createCanvasViewport();
    const panned = panCanvasViewport(viewport, {
      deltaX: 24,
      deltaY: -18
    });
    const resized = resizeCanvasViewport(panned, {
      canvasWidth: 1600,
      canvasHeight: 900
    });

    expect(viewport.offsetX).toBe(0);
    expect(panned).toMatchObject({
      offsetX: 24,
      offsetY: -18
    });
    expect(resized).toMatchObject({
      canvasWidth: 1600,
      canvasHeight: 900,
      offsetX: 24,
      offsetY: -18
    });
  });
});
