import { useMemo, useState } from "react";

import BaseSelectionLab from "./components/BaseSelectionLab.js";
import DossierAbilityLab from "./components/DossierAbilityLab.js";

type LabStatus = "planned" | "ready";

type LabEntry = {
  id: string;
  purpose: string;
  status: LabStatus;
  summary: string;
  targetWbs: string;
  title: string;
};

const labEntries: LabEntry[] = [
  {
    id: "wbs-4.1-dossier-ability",
    purpose:
      "先审阅卷宗设计思路与样例数据规范，再用样例项目和模拟视图状态验证目录、正文、引用回查、审校队列和检查器联动。",
    status: "ready",
    summary: "卷宗审阅说明 + 能力/功能/样式联合验证",
    targetWbs: "WBS 4.1",
    title: "WBS 4.1 卷宗独立验证"
  },
  {
    id: "wbs-3.1-base-selection",
    purpose: "对比 DOM + CSS、DOM + SVG、Canvas 三类基座表现，作为首个迁移实验。",
    status: "ready",
    summary: "交互画布与渲染基座选型",
    targetWbs: "WBS 3.1",
    title: "WBS 3.1 基座对比验证"
  },
  {
    id: "wbs-5.1-blueprint-node",
    purpose: "验证蓝图式节点头、输入输出端口、吸附点和连线反馈。",
    status: "planned",
    summary: "关系图蓝图节点实验",
    targetWbs: "WBS 5.1",
    title: "WBS 5.1 关系图蓝图节点实验"
  },
  {
    id: "wbs-6.1-track-density",
    purpose: "验证轨道头、时间尺、块密度与缩放行为。",
    status: "planned",
    summary: "多轨块表达实验",
    targetWbs: "WBS 6.1",
    title: "WBS 6.1 多轨块表达实验"
  }
];

function getStatusLabel(status: LabStatus): string {
  return status === "ready" ? "Ready" : "Planned";
}

export default function App() {
  const [activeLabId, setActiveLabId] = useState<string | null>(null);
  const activeLab = useMemo(
    () => labEntries.find((entry) => entry.id === activeLabId) ?? null,
    [activeLabId]
  );

  if (activeLab?.id === "wbs-3.1-base-selection") {
    return <BaseSelectionLab onBack={() => setActiveLabId(null)} />;
  }

  if (activeLab?.id === "wbs-4.1-dossier-ability") {
    return <DossierAbilityLab onBack={() => setActiveLabId(null)} />;
  }

  const readyCount = labEntries.filter((entry) => entry.status === "ready").length;

  return (
    <div className="app-shell lab-home-shell">
      <header className="topbar lab-home-header">
        <div>
          <h1>BaseLab</h1>
          <p>Independent validation workspace for cross-node rendering and interaction experiments.</p>
        </div>

        <div className="topbar-actions">
          <div className="status-pill" aria-live="polite">
            {readyCount} Ready / {labEntries.length - readyCount} Planned
          </div>
        </div>
      </header>

      <main className="lab-card-grid">
        {labEntries.map((entry) => (
          <article className="lab-card" key={entry.id}>
            <div className="lab-card-header">
              <span className="lab-card-wbs">{entry.targetWbs}</span>
              <span
                className={
                  entry.status === "ready"
                    ? "lab-card-status lab-card-status-ready"
                    : "lab-card-status"
                }
              >
                {getStatusLabel(entry.status)}
              </span>
            </div>
            <h2>{entry.title}</h2>
            <p className="lab-card-summary">{entry.summary}</p>
            <p className="lab-card-purpose">{entry.purpose}</p>
            <button
              className="toolbar-button toolbar-button-primary"
              disabled={entry.status !== "ready"}
              onClick={() => setActiveLabId(entry.id)}
              type="button"
            >
              {entry.status === "ready" ? `打开 ${entry.title}` : "等待后续节点"}
            </button>
          </article>
        ))}
      </main>
    </div>
  );
}
