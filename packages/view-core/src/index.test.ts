import { describe, expect, it } from "vitest";

import {
  clampCanvasZoom,
  createCanvasViewport,
  panCanvasViewport,
  resizeCanvasViewport,
  zoomCanvasViewport
} from "./index.js";

describe("view-core viewport helpers", () => {
  it("creates a normalized viewport with defaults", () => {
    expect(createCanvasViewport()).toEqual({
      canvasHeight: 800,
      canvasWidth: 1200,
      offsetX: 0,
      offsetY: 0,
      zoom: 1
    });
  });

  it("clamps zoom into the supported range", () => {
    expect(clampCanvasZoom(0.1)).toBe(0.4);
    expect(clampCanvasZoom(1.75)).toBe(1.75);
    expect(clampCanvasZoom(4)).toBe(2.5);
  });

  it("supports pan, resize and zoom updates", () => {
    const viewport = createCanvasViewport();
    const panned = panCanvasViewport(viewport, {
      deltaX: 24,
      deltaY: -12
    });
    const resized = resizeCanvasViewport(panned, {
      canvasHeight: 420,
      canvasWidth: 320
    });
    const zoomed = zoomCanvasViewport(resized, 0.1);

    expect(panned.offsetX).toBe(24);
    expect(panned.offsetY).toBe(-12);
    expect(resized.canvasWidth).toBe(640);
    expect(resized.canvasHeight).toBe(480);
    expect(zoomed.zoom).toBe(0.4);
  });
});
