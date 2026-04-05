import { copyFile, mkdtemp, readdir, rm, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { pathToFileURL } from "node:url";

import {
  SUITE_DEFINITIONS,
  resolveDefaultOutputRoot
} from "./generate-wbs-1.7.2-prototypes.mjs";

const CHROME_BIN = process.env.GOOGLE_CHROME_BIN ?? "/usr/bin/google-chrome";
const PRODUCT_TITLE = "知识编辑器";
const PROJECT_CONTEXT = "青云劫火录";
const TAB_LABELS = ["卷宗", "蓝图推演", "剪辑编排", "场景调度"];
const OBJECT_CATEGORIES = [
  "人物",
  "势力",
  "地点",
  "物品",
  "境界体系",
  "事件",
  "关系",
  "线索",
  "剧情弧"
];
const OBJECT_ROWS = [
  ["柳云澜", "人物", "卷宗缺 2 项字段"],
  ["焚天盟", "势力", "绑定 6 条事件链"],
  ["赤霄古城", "地点", "场景切换高频"],
  ["劫火印", "物品", "被 3 个工作面引用"],
  ["劫火入世", "剧情弧", "主线推进中"]
];

const SUITE_RENDER_DATA = {
  dossier: {
    stats: [
      ["已建卷宗", "24"],
      ["待审字段", "18"],
      ["引用冲突", "06"]
    ],
    inspectorSummary: "当前图把对象建模收束成卷宗整理、卷内核对和审校收口三段工作。",
    inspectorChecks: ["卷宗目录", "摘要正文", "审校队列", "引用回查"],
    inspectorMeta: [
      ["当前对象", "柳云澜 / 人物"],
      ["卷宗状态", "待补关系字段"],
      ["关联地点", "赤霄古城 / 地脉裂隙"]
    ],
    main: {
      sections: [
        {
          title: "卷宗目录",
          body: `
            <div class="stack-list">
              <div class="stack-row stack-row-active"><span>01 柳云澜人物卷</span><b>进行中</b></div>
              <div class="stack-row"><span>02 焚天盟势力卷</span><b>待审校</b></div>
              <div class="stack-row"><span>03 赤霄古城地点卷</span><b>已核对</b></div>
              <div class="stack-row"><span>04 劫火印物品卷</span><b>冲突 1</b></div>
              <div class="stack-row"><span>05 劫火入世剧情弧卷</span><b>缺回查</b></div>
            </div>
            <div class="callout">
              <strong>当前判断</strong>
              <span>目录不再拆成多页，而是在同一张核心图内承担选卷、切卷和状态总览。</span>
            </div>
          `
        },
        {
          title: "卷宗摘要",
          body: `
            <div class="detail-card">
              <h4>柳云澜</h4>
              <p>火脉异变承载体，当前正处于“劫火印绑定失控”的关键观察段。</p>
              <div class="detail-grid">
                <div><span>角色定位</span><b>主观察对象</b></div>
                <div><span>首次出现</span><b>赤霄古城夜巡</b></div>
                <div><span>绑定物</span><b>劫火印</b></div>
                <div><span>关系主轴</span><b>焚天盟 / 地脉裂隙</b></div>
              </div>
            </div>
            <div class="chip-group">
              <span class="chip chip-accent">卷内摘要</span>
              <span class="chip">人物关系</span>
              <span class="chip">地点牵引</span>
              <span class="chip">章节引用</span>
            </div>
            <ul class="bullet-list">
              <li>异常来源先锁定到物品绑定，再追事件链。</li>
              <li>摘要区优先放“能快速判断对象状态”的字段。</li>
              <li>章节文本不是建模真源，只记录观察引用。</li>
            </ul>
          `
        },
        {
          title: "审校队列",
          body: `
            <div class="checklist">
              <div class="check-item done"><span>别名与主名统一</span><b>通过</b></div>
              <div class="check-item done"><span>绑定事件完整</span><b>通过</b></div>
              <div class="check-item pending"><span>跨卷引用回查</span><b>待处理</b></div>
              <div class="check-item pending"><span>观察输出映射</span><b>待处理</b></div>
            </div>
            <div class="mini-table">
              <div><span>最近修改</span><b>角色定位</b></div>
              <div><span>修改人</span><b>wgw2</b></div>
              <div><span>建议动作</span><b>补地点线索</b></div>
            </div>
          `
        }
      ]
    }
  },
  blueprint: {
    stats: [
      ["推演节点", "17"],
      ["依赖边", "31"],
      ["回路告警", "02"]
    ],
    inspectorSummary: "蓝图推演图不做抽象装饰，重点把节点因果、触发条件和回路风险讲清楚。",
    inspectorChecks: ["起点对象", "事件触发", "资源绑定", "回路告警"],
    inspectorMeta: [
      ["当前节点", "柳云澜 / 起点"],
      ["主回路", "劫火印 -> 古城异动"],
      ["高风险边", "焚天盟介入链"]
    ],
    main: {
      board: {
        nodes: [
          { left: 44, top: 70, width: 210, title: "柳云澜", subtitle: "对象起点", tone: "accent" },
          { left: 324, top: 46, width: 230, title: "劫火印绑定", subtitle: "物品依赖", tone: "plain" },
          { left: 664, top: 120, width: 220, title: "赤霄古城异动", subtitle: "地点触发", tone: "plain" },
          { left: 212, top: 292, width: 260, title: "焚天盟追索", subtitle: "势力介入", tone: "plain" },
          { left: 562, top: 362, width: 260, title: "地脉裂隙爆发", subtitle: "事件结点", tone: "warning" }
        ],
        edges: [
          { left: 220, top: 122, width: 126, rotate: 8 },
          { left: 528, top: 126, width: 150, rotate: 18 },
          { left: 410, top: 132, width: 44, rotate: 84 },
          { left: 420, top: 326, width: 164, rotate: 24 },
          { left: 700, top: 226, width: 58, rotate: 88 }
        ],
        notes: [
          ["主线总线", "柳云澜 -> 劫火印 -> 古城异动 -> 裂隙爆发"],
          ["当前回路", "焚天盟追索会反向加剧劫火印失控"],
          ["待补条件", "是否需要地点锚点才能触发裂隙"]
        ]
      }
    }
  },
  editing: {
    stats: [
      ["编排层", "04"],
      ["待排片段", "11"],
      ["冲突切片", "03"]
    ],
    inspectorSummary: "剪辑编排图直接贴近剪辑软件心智，时间尺、轨道层和片段篮必须同屏可读。",
    inspectorChecks: ["时间尺", "主线层", "观察层", "片段篮"],
    inspectorMeta: [
      ["当前片段", "古城夜巡"],
      ["锚点时间", "T+00"],
      ["推荐换轨", "观察层 -> 主线层"]
    ],
    main: {
      tracks: [
        ["主线层", [
          [56, 0, 250, "夜巡铺垫"],
          [372, 0, 200, "劫火印异动"],
          [620, 0, 238, "焚天盟追索"]
        ]],
        ["观察层", [
          [148, 0, 188, "人物观察切片"],
          [414, 0, 244, "地点切片：古城城门"],
          [708, 0, 168, "物品特写"]
        ]],
        ["回闪层", [
          [94, 0, 214, "三年前火脉事故"],
          [486, 0, 210, "旧卷宗补证"]
        ]],
        ["空间层", [
          [286, 0, 224, "焚火殿转场"],
          [618, 0, 214, "地脉裂隙切换"]
        ]]
      ],
      basket: [
        "劫火印第一次共鸣",
        "焚天盟夜间调兵",
        "赤霄古城门禁封锁",
        "裂隙底部观察记录"
      ]
    }
  },
  stage: {
    stats: [
      ["场景节点", "09"],
      ["切换线", "14"],
      ["驻留角色", "07"]
    ],
    inspectorSummary: "场景调度图回答“谁在什么地方、沿什么顺序切换到哪里”，重点是空间组织。",
    inspectorChecks: ["主舞台", "次级场", "切换顺序", "驻留对象"],
    inspectorMeta: [
      ["当前地点", "赤霄古城"],
      ["下一跳", "焚火殿"],
      ["切换风险", "地脉裂隙未封口"]
    ],
    main: {
      nodes: [
        { left: 52, top: 82, width: 232, title: "赤霄古城", subtitle: "主舞台 / 夜巡起点", tone: "accent" },
        { left: 400, top: 116, width: 208, title: "焚火殿", subtitle: "议事场 / 势力节点", tone: "plain" },
        { left: 258, top: 392, width: 232, title: "地脉裂隙", subtitle: "爆发场 / 终点", tone: "warning" }
      ],
      edges: [
        { left: 274, top: 156, width: 140, rotate: 12 },
        { left: 466, top: 264, width: 110, rotate: 112 }
      ],
      schedule: [
        ["柳云澜", "赤霄古城", "夜巡 -> 追火"],
        ["焚天盟", "焚火殿", "议事 -> 出动"],
        ["劫火印", "地脉裂隙", "绑定 -> 爆发"],
        ["旁观者章节", "城门外", "观测切片"]
      ]
    }
  }
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function walkPenFiles(rootDir) {
  const entries = await readdir(rootDir, {
    withFileTypes: true
  });
  const penFiles = [];

  for (const entry of entries) {
    const entryPath = path.join(rootDir, entry.name);

    if (entry.isDirectory()) {
      penFiles.push(...(await walkPenFiles(entryPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".pen")) {
      penFiles.push(entryPath);
    }
  }

  return penFiles.sort();
}

export async function collectExportJobs(rootDir = resolveDefaultOutputRoot()) {
  const penFiles = await walkPenFiles(path.resolve(rootDir));

  return penFiles.map((penPath) => ({
    penPath,
    pngPath: penPath.replace(/\.pen$/u, ".png")
  }));
}

export async function replaceFileSafely(sourcePath, targetPath) {
  await rm(targetPath, {
    force: true
  });
  await copyFile(sourcePath, targetPath);
  await rm(sourcePath, {
    force: true
  });
}

function renderSidebarHtml(suite) {
  const categoryHtml = OBJECT_CATEGORIES.map(
    (label, index) =>
      `<span class="category-pill${index === 0 ? " category-pill-active" : ""}">${escapeHtml(label)}</span>`
  ).join("");
  const rowsHtml = OBJECT_ROWS.map(
    ([name, type, state], index) => `
      <div class="object-row${index === 0 ? " object-row-active" : ""}">
        <div>
          <strong>${escapeHtml(name)}</strong>
          <span>${escapeHtml(type)}</span>
        </div>
        <b>${escapeHtml(state)}</b>
      </div>
    `
  ).join("");

  return `
    <aside class="panel sidebar">
      <div class="panel-title">对象库</div>
      <div class="search-box">搜索对象、卷宗、地点、事件</div>
      <div class="category-grid">${categoryHtml}</div>
      <div class="sidebar-caption">当前对象</div>
      <div class="object-list">${rowsHtml}</div>
    </aside>
  `;
}

function renderInspectorHtml(suite) {
  const renderData = SUITE_RENDER_DATA[suite.mode];
  const checksHtml = renderData.inspectorChecks
    .map((item, index) => `<div class="inspector-check"><span>0${index + 1}</span><b>${escapeHtml(item)}</b></div>`)
    .join("");
  const metaHtml = renderData.inspectorMeta
    .map(([label, value]) => `<div class="inspector-meta-row"><span>${escapeHtml(label)}</span><b>${escapeHtml(value)}</b></div>`)
    .join("");

  return `
    <aside class="panel inspector">
      <div class="panel-title">检查器</div>
      <section class="inspector-block">
        <div class="block-label">当前核心图说明</div>
        <p>${escapeHtml(renderData.inspectorSummary)}</p>
      </section>
      <section class="inspector-block">
        <div class="block-label">本图重点</div>
        <div class="inspector-checks">${checksHtml}</div>
      </section>
      <section class="inspector-card">
        <div class="block-label">当前选中对象</div>
        ${metaHtml}
      </section>
      <section class="inspector-card">
        <div class="block-label">当前判断</div>
        <p>${escapeHtml(suite.summary)}</p>
      </section>
    </aside>
  `;
}

function renderStatsHtml(suite) {
  const renderData = SUITE_RENDER_DATA[suite.mode];

  return renderData.stats
    .map(
      ([label, value]) => `
        <div class="stat-card">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value)}</strong>
        </div>
      `
    )
    .join("");
}

function renderDossierMainHtml(suite) {
  const renderData = SUITE_RENDER_DATA[suite.mode];
  const sectionsHtml = renderData.main.sections
    .map(
      (section) => `
        <section class="content-card">
          <h3>${escapeHtml(section.title)}</h3>
          ${section.body}
        </section>
      `
    )
    .join("");

  return `
    <main class="panel main-panel">
      <header class="main-header">
        <div>
          <h1>${escapeHtml(suite.name)}</h1>
          <p>围绕卷宗整理、卷内阅读和审校收口组织对象建模，不再拆成多页去讲同一种工作语言。</p>
        </div>
      </header>
      <section class="stats-row">${renderStatsHtml(suite)}</section>
      <section class="three-col">${sectionsHtml}</section>
    </main>
  `;
}

function renderBlueprintMainHtml(suite) {
  const renderData = SUITE_RENDER_DATA[suite.mode];
  const nodesHtml = renderData.main.board.nodes
    .map(
      (node) => `
        <div class="flow-node flow-node-${escapeHtml(node.tone)}" style="left:${node.left}px;top:${node.top}px;width:${node.width}px;">
          <strong>${escapeHtml(node.title)}</strong>
          <span>${escapeHtml(node.subtitle)}</span>
        </div>
      `
    )
    .join("");
  const edgesHtml = renderData.main.board.edges
    .map(
      (edge) => `
        <div class="flow-edge" style="left:${edge.left}px;top:${edge.top}px;width:${edge.width}px;transform:rotate(${edge.rotate}deg);"></div>
      `
    )
    .join("");
  const notesHtml = renderData.main.board.notes
    .map(
      ([label, value]) => `
        <div class="mini-table-row">
          <span>${escapeHtml(label)}</span>
          <b>${escapeHtml(value)}</b>
        </div>
      `
    )
    .join("");

  return `
    <main class="panel main-panel">
      <header class="main-header">
        <div>
          <h1>${escapeHtml(suite.name)}</h1>
          <p>蓝图推演页把对象、物品、地点和事件因果统一铺在一条主总线上，重点暴露回路和依赖方向。</p>
        </div>
      </header>
      <section class="stats-row">${renderStatsHtml(suite)}</section>
      <section class="split-layout">
        <section class="content-card content-card-wide">
          <h3>推演画板</h3>
          <div class="flow-board">
            ${nodesHtml}
            ${edgesHtml}
            <div class="flow-badge" style="left:544px;top:308px;">回路告警</div>
          </div>
        </section>
        <section class="content-card content-card-side">
          <h3>规则注板</h3>
          <div class="mini-table">${notesHtml}</div>
          <div class="callout">
            <strong>当前判断</strong>
            <span>蓝图页不是“装饰性关系图”，而是为后续可拖拽、可连线、可验证的推演画布准备表达模型。</span>
          </div>
        </section>
      </section>
    </main>
  `;
}

function renderEditingMainHtml(suite) {
  const renderData = SUITE_RENDER_DATA[suite.mode];
  const rulerHtml = ["T-12", "T-08", "T-04", "T+00", "T+04", "T+08", "T+12"]
    .map((label) => `<span>${escapeHtml(label)}</span>`)
    .join("");
  const tracksHtml = renderData.main.tracks
    .map(
      ([label, clips]) => `
        <div class="track-row">
          <div class="track-label">${escapeHtml(label)}</div>
          <div class="track-lane">
            ${clips
              .map(
                ([left, top, width, title]) => `
                  <div class="track-clip" style="left:${left}px;top:${top}px;width:${width}px;">
                    ${escapeHtml(title)}
                  </div>
                `
              )
              .join("")}
          </div>
        </div>
      `
    )
    .join("");
  const basketHtml = renderData.main.basket
    .map((item) => `<div class="basket-item">${escapeHtml(item)}</div>`)
    .join("");

  return `
    <main class="panel main-panel">
      <header class="main-header">
        <div>
          <h1>${escapeHtml(suite.name)}</h1>
          <p>剪辑编排页直接模拟时间尺和多轨心智，让切片放置、换轨和冲突判断一眼可见。</p>
        </div>
      </header>
      <section class="stats-row">${renderStatsHtml(suite)}</section>
      <section class="timeline-ruler">${rulerHtml}</section>
      <section class="split-layout">
        <section class="content-card content-card-wide">
          <h3>编排层</h3>
          <div class="track-stack">${tracksHtml}</div>
        </section>
        <section class="content-card content-card-side">
          <h3>片段篮</h3>
          <div class="basket-list">${basketHtml}</div>
          <div class="callout">
            <strong>当前判断</strong>
            <span>本页只讲“如何编排”，不再回到旧的页级拆分和表格式陈列。</span>
          </div>
        </section>
      </section>
    </main>
  `;
}

function renderStageMainHtml(suite) {
  const renderData = SUITE_RENDER_DATA[suite.mode];
  const nodesHtml = renderData.main.nodes
    .map(
      (node) => `
        <div class="stage-node stage-node-${escapeHtml(node.tone)}" style="left:${node.left}px;top:${node.top}px;width:${node.width}px;">
          <strong>${escapeHtml(node.title)}</strong>
          <span>${escapeHtml(node.subtitle)}</span>
        </div>
      `
    )
    .join("");
  const edgesHtml = renderData.main.edges
    .map(
      (edge) => `
        <div class="flow-edge" style="left:${edge.left}px;top:${edge.top}px;width:${edge.width}px;transform:rotate(${edge.rotate}deg);"></div>
      `
    )
    .join("");
  const scheduleHtml = renderData.main.schedule
    .map(
      ([role, location, flow]) => `
        <div class="mini-table-row">
          <span>${escapeHtml(role)}</span>
          <b>${escapeHtml(location)}</b>
          <em>${escapeHtml(flow)}</em>
        </div>
      `
    )
    .join("");

  return `
    <main class="panel main-panel">
      <header class="main-header">
        <div>
          <h1>${escapeHtml(suite.name)}</h1>
          <p>场景调度页围绕空间舞台、驻留对象和转场顺序展开，不把空间线退化成时间清单。</p>
        </div>
      </header>
      <section class="stats-row">${renderStatsHtml(suite)}</section>
      <section class="split-layout">
        <section class="content-card content-card-wide">
          <h3>场景舞台图</h3>
          <div class="stage-board">
            ${nodesHtml}
            ${edgesHtml}
            <div class="flow-badge flow-badge-green" style="left:576px;top:322px;">转场线</div>
          </div>
        </section>
        <section class="content-card content-card-side">
          <h3>地点调度</h3>
          <div class="mini-table">${scheduleHtml}</div>
          <div class="callout">
            <strong>当前判断</strong>
            <span>空间线独立成页后，地点切换、场景占用和角色驻留关系能直观看到，不再被时间轴吞掉。</span>
          </div>
        </section>
      </section>
    </main>
  `;
}

const MAIN_RENDERERS = {
  blueprint: renderBlueprintMainHtml,
  dossier: renderDossierMainHtml,
  editing: renderEditingMainHtml,
  stage: renderStageMainHtml
};

export function buildPrototypeHtml(suite) {
  const mainHtml = MAIN_RENDERERS[suite.mode](suite);
  const tabsHtml = TAB_LABELS.map(
    (label) => `<span class="tab-pill${label === suite.tabLabel ? " tab-pill-active" : ""}">${escapeHtml(label)}</span>`
  ).join("");

  return `
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(suite.name)}</title>
    <style>
      :root {
        --accent: ${suite.accent};
        --accent-soft: ${suite.accentSoft};
        --border: ${suite.border};
        --canvas: ${suite.canvas};
        --panel: ${suite.panel};
        --text: ${suite.text};
        --muted: ${suite.muted};
      }
      * { box-sizing: border-box; }
      html, body {
        margin: 0;
        width: 1760px;
        height: 1080px;
        overflow: hidden;
        background: var(--canvas);
        color: var(--text);
        font-family: "Noto Sans SC", "Source Han Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif;
      }
      body {
        padding: 24px;
      }
      .workspace {
        width: 1712px;
        height: 1032px;
        border-radius: 28px;
        overflow: hidden;
        background: var(--canvas);
        border: 1px solid #dfe7f0;
        box-shadow: 0 16px 48px rgba(15, 23, 42, 0.08);
      }
      .topbar {
        height: 86px;
        display: grid;
        grid-template-columns: 420px 1fr 250px;
        align-items: center;
        gap: 20px;
        padding: 0 24px;
        background: #fff;
        border-bottom: 1px solid var(--border);
      }
      .brand h2 {
        margin: 0;
        font-size: 28px;
        line-height: 1;
      }
      .brand p {
        margin: 10px 0 0;
        color: var(--muted);
        font-size: 13px;
      }
      .tabbar {
        display: flex;
        gap: 12px;
        justify-content: center;
      }
      .tab-pill {
        min-width: 112px;
        padding: 10px 18px;
        border-radius: 999px;
        background: #f2f4f7;
        border: 1px solid var(--border);
        text-align: center;
        font-size: 14px;
        font-weight: 700;
      }
      .tab-pill-active {
        background: var(--accent);
        color: #fff;
        border-color: var(--accent);
      }
      .top-note {
        color: var(--muted);
        font-size: 13px;
        text-align: right;
        font-weight: 600;
      }
      .content-grid {
        display: grid;
        grid-template-columns: 300px 1fr 340px;
        gap: 20px;
        padding: 20px;
        height: calc(100% - 86px);
      }
      .panel {
        background: #fff;
        border: 1px solid var(--border);
        border-radius: 24px;
      }
      .sidebar,
      .inspector {
        padding: 18px;
      }
      .panel-title {
        font-size: 20px;
        font-weight: 800;
        margin-bottom: 16px;
      }
      .search-box {
        height: 44px;
        border-radius: 14px;
        background: #f7f9fc;
        border: 1px solid var(--border);
        color: var(--muted);
        display: flex;
        align-items: center;
        padding: 0 14px;
        font-size: 13px;
      }
      .category-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 14px;
      }
      .category-pill {
        min-width: 74px;
        padding: 8px 12px;
        border-radius: 999px;
        border: 1px solid var(--border);
        background: #f6f8fb;
        font-size: 12px;
        font-weight: 700;
        text-align: center;
      }
      .category-pill-active {
        background: var(--accent-soft);
        border-color: var(--accent);
      }
      .sidebar-caption,
      .block-label {
        margin-top: 18px;
        margin-bottom: 10px;
        color: var(--muted);
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.04em;
      }
      .object-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .object-row {
        padding: 14px;
        border-radius: 18px;
        border: 1px solid var(--border);
        display: grid;
        gap: 6px;
        background: #fff;
      }
      .object-row-active {
        background: var(--accent-soft);
        border-color: var(--accent);
      }
      .object-row strong {
        display: block;
        font-size: 15px;
      }
      .object-row span,
      .object-row b {
        font-size: 12px;
        color: var(--muted);
      }
      .main-panel {
        padding: 24px;
      }
      .main-header h1 {
        margin: 0;
        font-size: 28px;
      }
      .main-header p {
        margin: 10px 0 0;
        font-size: 14px;
        color: var(--muted);
        max-width: 860px;
        line-height: 1.55;
      }
      .stats-row {
        margin-top: 20px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 14px;
      }
      .stat-card {
        background: #fff;
        border: 1px solid var(--border);
        border-radius: 18px;
        padding: 16px 18px;
      }
      .stat-card span {
        display: block;
        color: var(--muted);
        font-size: 12px;
        font-weight: 700;
      }
      .stat-card strong {
        display: block;
        margin-top: 8px;
        font-size: 30px;
      }
      .three-col {
        display: grid;
        grid-template-columns: 280px 1fr 310px;
        gap: 18px;
        margin-top: 18px;
        height: 760px;
      }
      .split-layout {
        display: grid;
        grid-template-columns: 1fr 310px;
        gap: 18px;
        margin-top: 18px;
        height: 760px;
      }
      .content-card {
        border: 1px solid var(--border);
        border-radius: 22px;
        background: #fff;
        padding: 18px;
        overflow: hidden;
      }
      .content-card h3 {
        margin: 0 0 14px;
        font-size: 18px;
      }
      .content-card-wide {
        height: 100%;
      }
      .content-card-side {
        height: 100%;
      }
      .stack-list,
      .checklist,
      .basket-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .stack-row,
      .check-item,
      .basket-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        padding: 12px 14px;
        border-radius: 14px;
        border: 1px solid var(--border);
        background: #fafbfd;
        font-size: 13px;
      }
      .stack-row-active {
        background: var(--accent-soft);
        border-color: var(--accent);
      }
      .stack-row b,
      .check-item b {
        color: var(--accent);
      }
      .check-item.pending b {
        color: #c46a17;
      }
      .check-item.done b {
        color: #2f7a57;
      }
      .callout {
        margin-top: 16px;
        padding: 14px;
        border-radius: 16px;
        background: #f7f9fc;
        border: 1px dashed var(--border);
        display: grid;
        gap: 8px;
        font-size: 13px;
        line-height: 1.6;
      }
      .callout strong {
        font-size: 12px;
        letter-spacing: 0.04em;
      }
      .detail-card {
        border: 1px solid var(--border);
        border-radius: 18px;
        padding: 16px;
        background: #fbfcfe;
      }
      .detail-card h4 {
        margin: 0;
        font-size: 22px;
      }
      .detail-card p {
        margin: 10px 0 0;
        color: var(--muted);
        line-height: 1.6;
        font-size: 13px;
      }
      .detail-grid {
        margin-top: 16px;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }
      .detail-grid div {
        padding: 12px;
        border-radius: 14px;
        background: #fff;
        border: 1px solid var(--border);
      }
      .detail-grid span,
      .mini-table-row span,
      .inspector-meta-row span {
        display: block;
        color: var(--muted);
        font-size: 12px;
        font-weight: 700;
      }
      .detail-grid b,
      .mini-table-row b,
      .inspector-meta-row b {
        display: block;
        margin-top: 6px;
        font-size: 14px;
      }
      .chip-group {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 16px;
      }
      .chip {
        padding: 8px 12px;
        border-radius: 999px;
        border: 1px solid var(--border);
        background: #fff;
        font-size: 12px;
        font-weight: 700;
      }
      .chip-accent {
        background: var(--accent-soft);
        border-color: var(--accent);
      }
      .bullet-list {
        margin: 16px 0 0;
        padding-left: 18px;
        display: grid;
        gap: 10px;
        font-size: 13px;
        line-height: 1.6;
      }
      .mini-table {
        display: grid;
        gap: 10px;
      }
      .mini-table-row,
      .inspector-meta-row {
        padding: 12px 14px;
        border-radius: 16px;
        border: 1px solid var(--border);
        background: #fbfcfe;
      }
      .mini-table-row em {
        display: block;
        margin-top: 4px;
        color: var(--muted);
        font-size: 12px;
        font-style: normal;
      }
      .flow-board,
      .stage-board {
        position: relative;
        height: 100%;
        border-radius: 18px;
        background:
          linear-gradient(180deg, rgba(255,255,255,0.9), rgba(247,249,252,0.96)),
          radial-gradient(circle at 20% 20%, var(--accent-soft), transparent 38%);
        border: 1px solid var(--border);
        overflow: hidden;
      }
      .flow-node,
      .stage-node {
        position: absolute;
        min-height: 88px;
        padding: 16px;
        border-radius: 20px;
        border: 1px solid var(--accent);
        background: #fff;
        box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
      }
      .flow-node-accent,
      .stage-node-accent {
        background: var(--accent-soft);
      }
      .flow-node-warning,
      .stage-node-warning {
        border-color: #c46a17;
        background: #fff7ef;
      }
      .flow-node strong,
      .stage-node strong {
        display: block;
        font-size: 16px;
      }
      .flow-node span,
      .stage-node span {
        display: block;
        margin-top: 8px;
        color: var(--muted);
        font-size: 12px;
      }
      .flow-edge {
        position: absolute;
        height: 3px;
        background: linear-gradient(90deg, var(--accent), rgba(255,255,255,0));
        transform-origin: left center;
        border-radius: 999px;
      }
      .flow-badge {
        position: absolute;
        padding: 8px 14px;
        border-radius: 999px;
        background: rgba(196, 106, 23, 0.14);
        color: #8f4b12;
        font-size: 12px;
        font-weight: 800;
      }
      .flow-badge-green {
        background: rgba(47, 122, 87, 0.14);
        color: #215a40;
      }
      .timeline-ruler {
        margin-top: 18px;
        padding: 14px 18px;
        border-radius: 18px;
        border: 1px solid var(--border);
        background: #fff;
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 10px;
        font-size: 12px;
        font-weight: 800;
        color: var(--muted);
      }
      .track-stack {
        margin-top: 8px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .track-row {
        display: grid;
        grid-template-columns: 90px 1fr;
        gap: 14px;
        align-items: start;
      }
      .track-label {
        padding-top: 14px;
        font-size: 12px;
        color: var(--muted);
        font-weight: 800;
      }
      .track-lane {
        position: relative;
        height: 72px;
        border-radius: 16px;
        border: 1px solid var(--border);
        background: repeating-linear-gradient(
          90deg,
          #fbfcfe 0,
          #fbfcfe 110px,
          #f1f5f9 110px,
          #f1f5f9 111px
        );
      }
      .track-clip {
        position: absolute;
        top: 9px;
        height: 54px;
        padding: 0 14px;
        display: flex;
        align-items: center;
        border-radius: 14px;
        border: 1px solid var(--accent);
        background: var(--accent-soft);
        font-size: 13px;
        font-weight: 700;
      }
      .inspector-block p,
      .inspector-card p {
        margin: 0;
        font-size: 13px;
        line-height: 1.7;
      }
      .inspector-checks {
        display: grid;
        gap: 10px;
      }
      .inspector-check {
        padding: 12px 14px;
        border-radius: 14px;
        border: 1px solid var(--border);
        background: #fbfcfe;
      }
      .inspector-check span {
        color: var(--muted);
        font-size: 11px;
        font-weight: 800;
      }
      .inspector-check b {
        display: block;
        margin-top: 6px;
        font-size: 14px;
      }
      .inspector-card {
        margin-top: 18px;
        padding: 16px;
        border-radius: 18px;
        border: 1px solid var(--border);
        background: #fff;
      }
    </style>
  </head>
  <body>
    <div class="workspace">
      <div class="topbar">
        <div class="brand">
          <h2>${escapeHtml(PRODUCT_TITLE)}</h2>
          <p>当前项目 · ${escapeHtml(PROJECT_CONTEXT)}</p>
        </div>
        <div class="tabbar">${tabsHtml}</div>
        <div class="top-note">本轮只保留 4 个核心工作面</div>
      </div>
      <div class="content-grid">
        ${renderSidebarHtml(suite)}
        ${mainHtml}
        ${renderInspectorHtml(suite)}
      </div>
    </div>
  </body>
</html>
  `.trim();
}

function resolveSuiteByPath(penPath) {
  const suiteDirectory = path.basename(path.dirname(penPath));
  const suite = SUITE_DEFINITIONS.find((item) => item.directory === suiteDirectory);

  if (!suite) {
    throw new Error(`No suite definition found for ${penPath}`);
  }

  return suite;
}

async function renderPngWithChrome(html, targetPath) {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "novelstory-wbs-1.7.2-html-"));
  const htmlPath = path.join(tempDir, "prototype.html");
  const tempPngPath = path.join(tempDir, "prototype.png");

  try {
    await writeFile(htmlPath, `${html}\n`, "utf8");

    await new Promise((resolve, reject) => {
      const child = spawn(
        CHROME_BIN,
        [
          "--headless=new",
          "--disable-gpu",
          "--hide-scrollbars",
          "--no-sandbox",
          "--run-all-compositor-stages-before-draw",
          "--force-device-scale-factor=2",
          "--window-size=1760,1080",
          `--screenshot=${tempPngPath}`,
          pathToFileURL(htmlPath).href
        ],
        {
          stdio: ["ignore", "pipe", "pipe"]
        }
      );

      let stderr = "";
      child.stderr.on("data", (chunk) => {
        stderr += String(chunk);
      });
      child.on("error", reject);
      child.on("close", (code) => {
        if (code === 0) {
          resolve();
          return;
        }

        reject(new Error(`Chrome screenshot failed with code ${code}: ${stderr}`));
      });
    });

    await replaceFileSafely(tempPngPath, targetPath);
  } finally {
    await rm(tempDir, {
      force: true,
      recursive: true
    });
  }
}

export async function exportPrototypePngs(rootDir = resolveDefaultOutputRoot()) {
  const jobs = await collectExportJobs(rootDir);

  for (const job of jobs) {
    const suite = resolveSuiteByPath(job.penPath);
    const html = buildPrototypeHtml(suite);

    await renderPngWithChrome(html, job.pngPath);
  }

  return jobs;
}

if (import.meta.url === new URL(process.argv[1], "file:").href) {
  const rootDir = process.argv[2] ? path.resolve(process.argv[2]) : resolveDefaultOutputRoot();
  const stats = await stat(rootDir);

  if (!stats.isDirectory()) {
    throw new Error(`Export root is not a directory: ${rootDir}`);
  }

  const jobs = await exportPrototypePngs(rootDir);
  process.stdout.write(`Exported ${jobs.length} PNG files under ${rootDir}\n`);
}
