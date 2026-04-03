import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import BaseSelectionLab from "./BaseSelectionLab.js";

function createCanvasContextStub(): CanvasRenderingContext2D {
  return {
    arc: vi.fn(),
    beginPath: vi.fn(),
    bezierCurveTo: vi.fn(),
    clearRect: vi.fn(),
    fill: vi.fn(),
    fillRect: vi.fn(),
    fillText: vi.fn(),
    lineTo: vi.fn(),
    measureText: vi.fn((text: string) => ({
      width: text.length * 7
    })),
    moveTo: vi.fn(),
    restore: vi.fn(),
    roundRect: vi.fn(),
    save: vi.fn(),
    scale: vi.fn(),
    setTransform: vi.fn(),
    stroke: vi.fn(),
    translate: vi.fn()
  } as unknown as CanvasRenderingContext2D;
}

beforeEach(() => {
  vi.restoreAllMocks();
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(() =>
    createCanvasContextStub()
  );
});

describe("BaseSelectionLab", () => {
  it("pans the DOM stage from the original offset without drift", () => {
    const { container } = render(<BaseSelectionLab onBack={() => {}} />);
    const region = screen.getByRole("region", { name: "DOM + CSS 验证画布" });
    const stageInner = container.querySelector(".base-lab-stage-inner");

    expect(stageInner).not.toBeNull();
    expect(stageInner?.getAttribute("style")).toContain("translate(32px, 28px) scale(1)");

    fireEvent.pointerDown(region, {
      clientX: 100,
      clientY: 100
    });
    fireEvent.pointerMove(window, {
      clientX: 240,
      clientY: 160
    });
    fireEvent.pointerUp(window, {
      clientX: 240,
      clientY: 160
    });

    expect(stageInner?.getAttribute("style")).toContain("translate(172px, 88px) scale(1)");
  });

  it("adds a new SVG edge after dragging from an output port to an input port", () => {
    const { container } = render(<BaseSelectionLab onBack={() => {}} />);
    const svgRegion = screen.getByRole("region", { name: "DOM + SVG 验证画布" });

    expect(container.querySelectorAll(".base-lab-svg-edge")).toHaveLength(3);

    fireEvent.pointerDown(within(svgRegion).getByRole("button", { name: "Detect Token output state" }), {
      clientX: 590,
      clientY: 288
    });
    fireEvent.pointerMove(window, {
      clientX: 726,
      clientY: 414
    });
    fireEvent.pointerUp(within(svgRegion).getByRole("button", { name: "Trigger Arc input signal" }), {
      clientX: 726,
      clientY: 414
    });

    expect(container.querySelectorAll(".base-lab-svg-edge")).toHaveLength(4);
  });
});
