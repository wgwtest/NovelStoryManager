import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import DossierAbilityLab from "./DossierAbilityLab.js";

describe("DossierAbilityLab", () => {
  it("switches object types and auto-selects the first dossier in that type", async () => {
    const user = userEvent.setup();

    render(<DossierAbilityLab onBack={() => {}} />);

    await user.click(screen.getByRole("button", { name: "宗门" }));

    expect(await screen.findByRole("heading", { name: "青云宗" })).toBeInTheDocument();
    expect(screen.getByText("北境中等宗门，擅长剑诀与风雷法。")).toBeInTheDocument();
  });

  it("renders the sample dossier workspace with filters, current object and audit queue", () => {
    render(<DossierAbilityLab onBack={() => {}} />);

    expect(screen.getByRole("heading", { name: "卷宗目录" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "主角相关" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "苏玄" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "苏玄" })).toBeInTheDocument();
    expect(
      screen.getByText("寒门出身的少年修士，正在青云宗外门求存。")
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "审校队列" })).toBeInTheDocument();
    expect(screen.getByText("新角色3")).toBeInTheDocument();
  });

  it("jumps to a referenced dossier and returns to the previous dossier", async () => {
    const user = userEvent.setup();

    render(<DossierAbilityLab onBack={() => {}} />);

    await user.click(screen.getByRole("button", { name: "打开 青云宗 卷宗" }));

    expect(await screen.findByRole("heading", { name: "青云宗" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "返回上一卷" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "返回上一卷" }));

    expect(screen.getByRole("heading", { name: "苏玄" })).toBeInTheDocument();
  });

  it("applies inspector edits to the local sample model", async () => {
    const user = userEvent.setup();

    render(<DossierAbilityLab onBack={() => {}} />);

    const summaryInput = screen.getByLabelText("Summary");

    await user.clear(summaryInput);
    await user.type(summaryInput, "已经在卷宗页改写");
    await user.click(screen.getByRole("button", { name: "应用到本页样例" }));

    expect(screen.getByText("已经在卷宗页改写")).toBeInTheDocument();
    expect(screen.getByText("已应用到本页样例")).toBeInTheDocument();
  });
});
