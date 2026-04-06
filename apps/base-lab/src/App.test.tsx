import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import App from "./App.js";

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

describe("BaseLab app", () => {
  it("shows the experiment registry with ready and planned entries", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "BaseLab" })).toBeInTheDocument();
    expect(screen.getByText("WBS 3.1 基座对比验证")).toBeInTheDocument();
    expect(screen.getByText("WBS 4.1 卷宗独立验证")).toBeInTheDocument();
    expect(screen.getByText("WBS 5.1 关系图蓝图节点实验")).toBeInTheDocument();
    expect(screen.getByText("WBS 6.1 多轨块表达实验")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "打开 WBS 3.1 基座对比验证" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "打开 WBS 4.1 卷宗独立验证" })
    ).toBeInTheDocument();
  });

  it("opens the WBS 3.1 lab and returns to the registry", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(
      screen.getByRole("button", { name: "打开 WBS 3.1 基座对比验证" })
    );

    expect(
      await screen.findByRole("heading", { name: "WBS 3.1 基座对比验证" })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Back to BaseLab" }));

    expect(screen.getByRole("heading", { name: "BaseLab" })).toBeInTheDocument();
  });

  it("opens the WBS 4.1 dossier lab and returns to the registry", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(
      screen.getByRole("button", { name: "打开 WBS 4.1 卷宗独立验证" })
    );

    expect(
      await screen.findByRole("heading", { name: "WBS 4.1 卷宗独立验证" })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "卷宗设计思路" })).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "工作面验证" }));

    expect(await screen.findByRole("heading", { name: "卷宗目录" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Back to BaseLab" }));

    expect(screen.getByRole("heading", { name: "BaseLab" })).toBeInTheDocument();
  });
});
