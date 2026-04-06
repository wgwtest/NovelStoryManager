import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import DossierAbilityLab from "./DossierAbilityLab.js";

describe("DossierAbilityLab", () => {
  it("shows the dossier review layer by default and switches into the validation workspace", async () => {
    const user = userEvent.setup();

    render(<DossierAbilityLab onBack={() => {}} />);

    expect(screen.getByRole("heading", { name: "卷宗设计思路" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "打开样例数据规范" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "卷宗目录" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "工作面验证" }));

    expect(await screen.findByRole("heading", { name: "卷宗目录" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "审校队列" })).toBeInTheDocument();
  });

  it("shows sample schema guidance with object and view source examples", async () => {
    const user = userEvent.setup();

    render(<DossierAbilityLab onBack={() => {}} />);

    await user.click(screen.getByRole("tab", { name: "样例规范" }));

    expect(await screen.findByRole("heading", { name: "样例数据格式规范" })).toBeInTheDocument();
    expect(screen.getByText("objects/*.json")).toBeInTheDocument();
    expect(screen.getByText("views/*.json")).toBeInTheDocument();
    expect(screen.getByText("fixtures/projects/sample-novel/manifest.json")).toBeInTheDocument();
    expect(screen.getByText("fixtures/projects/sample-novel/objects/characters.json")).toBeInTheDocument();
    expect(screen.getByText("fixtures/projects/sample-novel/views/saved-filters.json")).toBeInTheDocument();
  });

  it("auto-selects the first filtered dossier when the keyword narrows the list", async () => {
    const user = userEvent.setup();

    render(<DossierAbilityLab onBack={() => {}} />);
    await user.click(screen.getByRole("tab", { name: "工作面验证" }));

    const filterInput = screen.getByLabelText("筛选关键词");

    await user.clear(filterInput);
    await user.type(filterInput, "林");

    expect(await screen.findByRole("heading", { name: "林晚" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "林晚" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "苏玄" })).not.toBeInTheDocument();
  });

  it("switches object types and auto-selects the first dossier in that type", async () => {
    const user = userEvent.setup();

    render(<DossierAbilityLab onBack={() => {}} />);
    await user.click(screen.getByRole("tab", { name: "工作面验证" }));

    await user.click(screen.getByRole("button", { name: "宗门" }));

    expect(await screen.findByRole("heading", { name: "青云宗" })).toBeInTheDocument();
    expect(screen.getByText("北境中等宗门，擅长剑诀与风雷法。")).toBeInTheDocument();
  });

  it("renders the sample dossier workspace with filters, current object and audit queue", async () => {
    const user = userEvent.setup();

    render(<DossierAbilityLab onBack={() => {}} />);

    await user.click(screen.getByRole("tab", { name: "工作面验证" }));

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
    await user.click(screen.getByRole("tab", { name: "工作面验证" }));

    await user.click(screen.getByRole("button", { name: "打开 青云宗 卷宗" }));

    expect(await screen.findByRole("heading", { name: "青云宗" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "返回上一卷" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "返回上一卷" }));

    expect(screen.getByRole("heading", { name: "苏玄" })).toBeInTheDocument();
  });

  it("jumps through backlink entries back to the source dossier", async () => {
    const user = userEvent.setup();

    render(<DossierAbilityLab onBack={() => {}} />);
    await user.click(screen.getByRole("tab", { name: "工作面验证" }));

    await user.click(screen.getByRole("button", { name: "打开 青云宗 卷宗" }));
    await user.click(screen.getByRole("button", { name: "回查 苏玄 卷宗" }));

    expect(await screen.findByRole("heading", { name: "苏玄" })).toBeInTheDocument();
    expect(screen.getByText("寒门出身的少年修士，正在青云宗外门求存。")).toBeInTheDocument();
  });

  it("opens incomplete objects from the audit queue", async () => {
    const user = userEvent.setup();

    render(<DossierAbilityLab onBack={() => {}} />);
    await user.click(screen.getByRole("tab", { name: "工作面验证" }));

    await user.click(screen.getByRole("button", { name: /新角色3/ }));

    expect(await screen.findByRole("heading", { name: "新角色3" })).toBeInTheDocument();
    expect(screen.getByText("待补录摘要")).toBeInTheDocument();
    expect(
      screen.getByText("待补录字段：Summary / Identity / Faction / Realm State")
    ).toBeInTheDocument();
  });

  it("shows inspector group sections for the active dossier", async () => {
    const user = userEvent.setup();

    render(<DossierAbilityLab onBack={() => {}} />);

    await user.click(screen.getByRole("tab", { name: "工作面验证" }));

    expect(screen.getByRole("heading", { name: "Core Fields" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Additional Fields" })).toBeInTheDocument();
    expect(screen.getByText("Id")).toBeInTheDocument();
    expect(screen.getByLabelText("Summary")).toBeInTheDocument();
    expect(screen.getByText("char_suxuan", { selector: "code" })).toBeInTheDocument();
  });

  it("applies inspector edits to the local sample model", async () => {
    const user = userEvent.setup();

    render(<DossierAbilityLab onBack={() => {}} />);
    await user.click(screen.getByRole("tab", { name: "工作面验证" }));

    const summaryInput = screen.getByLabelText("Summary");

    await user.clear(summaryInput);
    await user.type(summaryInput, "已经在卷宗页改写");
    await user.click(screen.getByRole("button", { name: "应用到本页样例" }));

    expect(screen.getByText("已经在卷宗页改写")).toBeInTheDocument();
    expect(screen.getByText("已应用到本页样例")).toBeInTheDocument();
  });
});
