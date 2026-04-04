import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

export function resolveDefaultOutputRoot() {
  return fileURLToPath(
    new URL("../DOC/CODEX_DOC/04_研发文档/03_原型图/WBS-1.7.2/", import.meta.url)
  );
}

const DEFAULT_OUTPUT_ROOT = resolveDefaultOutputRoot();

export const PAGE_DEFINITIONS = [
  {
    key: "overview",
    title: "总工作台总览",
    fileName: "01-总工作台总览.pen",
    pngName: "01-总工作台总览.png",
    selectedTab: "知识库"
  },
  {
    key: "knowledge",
    title: "知识库页",
    fileName: "02-知识库页.pen",
    pngName: "02-知识库页.png",
    selectedTab: "知识库"
  },
  {
    key: "graph",
    title: "关系图页",
    fileName: "03-关系图页.pen",
    pngName: "03-关系图页.png",
    selectedTab: "关系图"
  },
  {
    key: "tracks",
    title: "轨道页",
    fileName: "04-轨道页.pen",
    pngName: "04-轨道页.png",
    selectedTab: "轨道"
  },
  {
    key: "focus",
    title: "对象库与检查器",
    fileName: "05-对象库与检查器.pen",
    pngName: "05-对象库与检查器.png",
    selectedTab: "知识库"
  }
];

export const SUITE_DEFINITIONS = [
  {
    directory: "01_卷宗案台型",
    name: "卷宗案台型",
    mode: "dossier",
    accent: "#2457C5",
    accentSoft: "#D8E4FF",
    accentStrong: "#173B8A",
    canvas: "#F4F6FA",
    workspace: "#F8FAFD",
    panel: "#FFFFFF",
    panelAlt: "#F5F8FC",
    border: "#D6DEE8",
    subtle: "#E8EEF5",
    text: "#17212B",
    muted: "#66758A",
    leftWidth: 292,
    rightWidth: 336,
    topBarHeight: 80,
    markers: ["卷宗目录", "字段矩阵", "记录详情抽屉"],
    summary: "把对象建模当作卷宗整理工作，主工作区强调记录索引、字段矩阵和详情抽屉。",
    references: [
      { label: "Airtable Interface / Record Detail", url: "https://support.airtable.com/docs/es/airtable-interface-layout-record-detail" },
      { label: "Scrivener Corkboard", url: "https://www.literatureandlatte.com/learn-and-support/video-tutorials/organising-5-get-to-know-the-corkboard" }
    ]
  },
  {
    directory: "02_筹划墙型",
    name: "筹划墙型",
    mode: "wall",
    accent: "#A0492E",
    accentSoft: "#F7E0D6",
    accentStrong: "#7A3320",
    canvas: "#F7F4F1",
    workspace: "#FBF8F5",
    panel: "#FFFDFB",
    panelAlt: "#F8F1EC",
    border: "#E5D8CC",
    subtle: "#F1E6DE",
    text: "#2A1E18",
    muted: "#7A6A62",
    leftWidth: 292,
    rightWidth: 320,
    topBarHeight: 82,
    markers: ["筹划墙画布", "灵感便签", "素材归堆区"],
    summary: "把剧情组织还原成拖拽筹划墙，中区是大画布，左侧对象库更像素材仓。",
    references: [
      { label: "Milanote Visual Boards", url: "https://milanote.com/templates/product-management/kanban-board" },
      { label: "Obsidian Canvas", url: "https://obsidian.md/canvas" }
    ]
  },
  {
    directory: "03_蓝图推演型",
    name: "蓝图推演型",
    mode: "blueprint",
    accent: "#0E6BA8",
    accentSoft: "#D7ECFA",
    accentStrong: "#0C4D78",
    canvas: "#F2F7FB",
    workspace: "#F7FBFE",
    panel: "#FFFFFF",
    panelAlt: "#EDF5FB",
    border: "#D4E3EE",
    subtle: "#E6F0F7",
    text: "#132432",
    muted: "#617485",
    leftWidth: 284,
    rightWidth: 334,
    topBarHeight: 80,
    markers: ["蓝图总线", "推演节点", "端口规则板"],
    summary: "把对象与关系当作可推演的图结构，中区主角是蓝图总线与节点依赖。",
    references: [
      { label: "Unreal Blueprint Editor", url: "https://dev.epicgames.com/documentation/fr-fr/unreal-engine/blueprints-visual-scripting-editor-user-interface-for-level-blueprints-in-unreal-engine" },
      { label: "Obsidian Graph", url: "https://obsidian.md/help/plugins/graph" }
    ]
  },
  {
    directory: "04_剪辑编排型",
    name: "剪辑编排型",
    mode: "timeline",
    accent: "#D06A1A",
    accentSoft: "#FCE7D4",
    accentStrong: "#9B4B12",
    canvas: "#F7F4F0",
    workspace: "#FCF9F5",
    panel: "#FFFFFF",
    panelAlt: "#FAF2E9",
    border: "#E6DACA",
    subtle: "#F2E7DA",
    text: "#2B2117",
    muted: "#7E6B58",
    leftWidth: 288,
    rightWidth: 332,
    topBarHeight: 78,
    markers: ["编排时间尺", "轨道头矩阵", "待排事件篮"],
    summary: "把故事切片当作剪辑素材来编排，强调多轨时间尺、轨道头和待排事件篮。",
    references: [
      { label: "Aeon Timeline", url: "https://www.aeontimeline.com/" },
      { label: "Miro Timeline", url: "https://help.miro.com/hc/en-us/articles/20185235301650-Timeline" },
      { label: "DaVinci Resolve Fairlight", url: "https://www.blackmagicdesign.com/products/davinciresolve/fairlight" }
    ]
  },
  {
    directory: "05_总控指挥型",
    name: "总控指挥型",
    mode: "command",
    accent: "#0A6C6F",
    accentSoft: "#D6EFF0",
    accentStrong: "#0A4E51",
    canvas: "#F2F7F7",
    workspace: "#F7FBFB",
    panel: "#FFFFFF",
    panelAlt: "#EDF5F5",
    border: "#D4E4E4",
    subtle: "#E4F0F0",
    text: "#162628",
    muted: "#65787B",
    leftWidth: 290,
    rightWidth: 338,
    topBarHeight: 80,
    markers: ["全局覆盖总览", "联动监视窗", "输出切片指挥板"],
    summary: "把三主视图统一收拢到一个总控工作面，重点检查覆盖、联动和输出切片。",
    references: [
      { label: "Notion Timelines", url: "https://www.notion.com/help/timelines" },
      { label: "Airtable Interface Designer", url: "https://support.airtable.com/v1/docs/getting-started-with-airtable-interface-designer" }
    ]
  }
];

const OBJECT_CATEGORIES = [
  ["人物", 24],
  ["势力", 11],
  ["地点", 18],
  ["物品", 13],
  ["境界体系", 7],
  ["事件", 26],
  ["关系", 31],
  ["线索", 14],
  ["剧情弧", 9]
];

const OBJECT_LISTS = {
  overview: [
    ["柳云澜", "人物 / 主视角"],
    ["赤霄盟", "势力 / 对立阵营"],
    ["北陵渡口伏击", "事件 / 主冲突"],
    ["劫火印", "物品 / 核心线索"],
    ["劫火入世", "剧情弧 / 主弧"]
  ],
  knowledge: [
    ["柳云澜", "人物 / 化炁中段"],
    ["沈照雪", "人物 / 天衡司"],
    ["青冥火典", "物品 / 禁卷"],
    ["天衡司", "势力 / 官署"],
    ["青崖城", "地点 / 第一卷主场景"]
  ],
  graph: [
    ["柳云澜", "人物 / 关系中心"],
    ["赤霄盟", "势力 / 被追查"],
    ["北陵渡口伏击", "事件 / 触发节点"],
    ["劫火印", "线索 / 流向不明"],
    ["天衡司密令", "线索 / 官方牵引"]
  ],
  tracks: [
    ["北陵渡口伏击", "事件 / 第 12 日"],
    ["地脉异动", "事件 / 第 13 日"],
    ["柳云澜观察切片", "观察 / 主视角"],
    ["沈照雪观察切片", "观察 / 侧视角"],
    ["劫火印现身", "事件 / 第 14 日"]
  ],
  focus: [
    ["柳云澜", "人物 / 当前对象"],
    ["劫火入世", "剧情弧 / 绑定"],
    ["青冥火典", "物品 / 关联资源"],
    ["天衡司", "势力 / 约束方"],
    ["青崖城", "地点 / 主要舞台"]
  ]
};

const INSPECTOR_DATA = {
  overview: {
    title: "柳云澜",
    type: "人物",
    status: "已建模",
    basics: [
      ["身份", "散修 / 主视角"],
      ["当前境界", "化炁中段"],
      ["首次出现", "第一卷 第一章"]
    ],
    links: [
      "关联事件：北陵渡口伏击、青崖城夜审",
      "关联剧情弧：劫火入世",
      "引用切片：S-12、S-14"
    ]
  },
  knowledge: {
    title: "劫火印",
    type: "线索",
    status: "字段审校中",
    basics: [
      ["线索级别", "主线核心"],
      ["载体", "器物"],
      ["当前状态", "去向未知"]
    ],
    links: [
      "绑定人物：柳云澜",
      "绑定势力：赤霄盟、天衡司",
      "绑定轨道：第 12 日 / 第 14 日"
    ]
  },
  graph: {
    title: "柳云澜 -> 赤霄盟",
    type: "关系",
    status: "图谱已连线",
    basics: [
      ["关系类型", "追查 / 对立"],
      ["触发事件", "北陵渡口伏击"],
      ["权重", "0.82"]
    ],
    links: [
      "上游：天衡司密令",
      "下游：青崖城夜审",
      "并行边：柳云澜 -> 劫火印"
    ]
  },
  tracks: {
    title: "北陵渡口伏击",
    type: "事件",
    status: "轨道已排布",
    basics: [
      ["开始时刻", "第 12 日 / 戌时"],
      ["作用轨道", "主时间、地点、观察"],
      ["观察切片", "柳云澜 / 沈照雪"]
    ],
    links: [
      "前置事件：密令下发",
      "后续事件：地脉异动",
      "章节输出：T-12-A"
    ]
  },
  focus: {
    title: "劫火入世",
    type: "剧情弧",
    status: "对象审阅中",
    basics: [
      ["阶段", "铺垫 - 爆发前夜"],
      ["主角绑定", "柳云澜"],
      ["核心资源", "劫火印 / 青冥火典"]
    ],
    links: [
      "覆盖事件：6 个",
      "覆盖关系：12 条",
      "覆盖切片：17 段"
    ]
  }
};

const PAGE_LEADS = {
  overview: "总工作台先回答“当前世界模型覆盖到哪里”。",
  knowledge: "知识库页只负责结构化真值和规格化字段，不承接正文写作。",
  graph: "关系图页强调对象、事件与线索的依赖流向和因果链。",
  tracks: "轨道页强调多时间线、多空间线和观察切片的并行排布。",
  focus: "对象库与检查器页强调左侧对象导航和右侧详情联动，而不是中区炫技。"
};

function idFactory(prefix) {
  let counter = 0;
  return () => `${prefix}${(counter++).toString(36)}`;
}

function stroke(fill, side) {
  if (!side) {
    return {
      thickness: 1,
      fill
    };
  }

  return {
    thickness: {
      [side]: 1
    },
    fill
  };
}

function frame(id, props, children = []) {
  const node = {
    type: "frame",
    id,
    ...props
  };

  if (children.length > 0) {
    node.children = children;
  }

  return node;
}

function rectangle(id, props) {
  return {
    type: "rectangle",
    id,
    ...props
  };
}

function ellipse(id, props) {
  return {
    type: "ellipse",
    id,
    ...props
  };
}

function text(id, content, props = {}) {
  return {
    type: "text",
    id,
    content,
    fontFamily: "Inter",
    fontSize: 14,
    fontWeight: "500",
    fill: "#17212B",
    ...props
  };
}

function card(idGen, suite, name, children, options = {}) {
  return frame(
    idGen(),
    {
      name,
      layout: "vertical",
      gap: options.gap ?? 12,
      width: options.width ?? "fill_container",
      height: options.height,
      fill: options.fill ?? suite.panel,
      cornerRadius: options.cornerRadius ?? 18,
      padding: options.padding ?? [16, 16, 16, 16],
      stroke: options.stroke ?? stroke(suite.border),
      clip: options.clip ?? false
    },
    children
  );
}

function pill(idGen, suite, label, active = false) {
  return frame(
    idGen(),
    {
      layout: "horizontal",
      width: "fit_content",
      height: "fit_content",
      padding: [7, 12],
      cornerRadius: 999,
      fill: active ? suite.accentSoft : suite.panelAlt,
      stroke: stroke(active ? suite.accent : suite.border)
    },
    [
      text(idGen(), label, {
        fontSize: 12,
        fontWeight: "700",
        fill: active ? suite.accentStrong : suite.muted
      })
    ]
  );
}

function dot(idGen, fill) {
  return ellipse(idGen(), {
    width: 10,
    height: 10,
    fill
  });
}

function statCard(idGen, suite, title, value, note) {
  return card(idGen, suite, `${title}卡片`, [
    text(idGen(), title, {
      fontSize: 12,
      fill: suite.muted
    }),
    text(idGen(), value, {
      fontSize: 28,
      fontWeight: "700",
      fill: suite.text
    }),
    text(idGen(), note, {
      fontSize: 12,
      fill: suite.muted,
      width: "fill_container",
      textGrowth: "fixed-width"
    })
  ], {
    gap: 8
  });
}

function infoRow(idGen, suite, left, right) {
  return frame(
    idGen(),
    {
      layout: "horizontal",
      width: "fill_container",
      justifyContent: "space_between",
      alignItems: "center"
    },
    [
      text(idGen(), left, {
        fontSize: 12,
        fill: suite.muted
      }),
      text(idGen(), right, {
        fontSize: 12,
        fontWeight: "700",
        fill: suite.text
      })
    ]
  );
}

function listRow(idGen, suite, title, meta, active = false) {
  return frame(
    idGen(),
    {
      layout: "vertical",
      width: "fill_container",
      gap: 4,
      padding: [10, 12],
      cornerRadius: 12,
      fill: active ? suite.panelAlt : suite.panel,
      stroke: stroke(active ? suite.accent : suite.border)
    },
    [
      text(idGen(), title, {
        fontSize: 13,
        fontWeight: "700",
        fill: suite.text
      }),
      text(idGen(), meta, {
        fontSize: 11,
        fill: suite.muted
      })
    ]
  );
}

function buildTopBar(idGen, suite, page) {
  return frame(
    idGen(),
    {
      name: "顶部栏",
      width: "fill_container",
      height: suite.topBarHeight,
      fill: suite.panel,
      stroke: stroke(suite.border, "bottom"),
      layout: "horizontal",
      justifyContent: "space_between",
      alignItems: "center",
      padding: [18, 24]
    },
    [
      frame(
        idGen(),
        {
          layout: "vertical",
          gap: 4
        },
        [
          text(idGen(), "知识编辑器", {
            fontSize: 22,
            fontWeight: "700",
            fill: suite.text
          }),
          text(idGen(), `项目 / 青云劫火录 · ${suite.name} · ${page.title}`, {
            fontSize: 12,
            fill: suite.muted
          })
        ]
      ),
      frame(
        idGen(),
        {
          layout: "horizontal",
          gap: 10,
          alignItems: "center"
        },
        [
          pill(idGen, suite, "导入"),
          pill(idGen, suite, "导出"),
          pill(idGen, suite, "已保存", true)
        ]
      )
    ]
  );
}

function buildSidebar(idGen, suite, page) {
  return frame(
    idGen(),
    {
      name: "对象库列",
      width: suite.leftWidth,
      height: "fill_container",
      fill: suite.panel,
      stroke: stroke(suite.border, "right"),
      layout: "vertical",
      gap: 14,
      padding: [16, 16],
      clip: true
    },
    [
      text(idGen(), "对象库", {
        fontSize: 16,
        fontWeight: "700",
        fill: suite.text
      }),
      card(idGen, suite, "搜索区", [
        text(idGen(), "搜索对象、规格化键、标签", {
          fontSize: 12,
          fill: suite.muted
        }),
        frame(
          idGen(),
          {
            layout: "horizontal",
            width: "fill_container",
            padding: [10, 12],
            cornerRadius: 14,
            fill: suite.panelAlt,
            stroke: stroke(suite.border)
          },
          [
            text(idGen(), "输入对象名或关系键", {
              fontSize: 12,
              fill: suite.muted
            })
          ]
        )
      ], {
        gap: 10
      }),
      card(idGen, suite, "分类区", [
        text(idGen(), "分类", {
          fontSize: 12,
          fontWeight: "700",
          fill: suite.muted
        }),
        ...OBJECT_CATEGORIES.map(([label, count], index) =>
          frame(
            idGen(),
            {
              layout: "horizontal",
              width: "fill_container",
              justifyContent: "space_between",
              alignItems: "center",
              padding: [8, 10],
              cornerRadius: 12,
              fill: index === 0 ? suite.accentSoft : suite.panelAlt,
              stroke: stroke(index === 0 ? suite.accent : suite.border)
            },
            [
              text(idGen(), label, {
                fontSize: 12,
                fontWeight: index === 0 ? "700" : "600",
                fill: index === 0 ? suite.accentStrong : suite.text
              }),
              text(idGen(), `${count}`, {
                fontSize: 12,
                fontWeight: "700",
                fill: index === 0 ? suite.accentStrong : suite.muted
              })
            ]
          )
        )
      ], {
        gap: 8
      }),
      card(idGen, suite, "动作区", [
        infoRow(idGen, suite, "已建模对象", "153"),
        frame(
          idGen(),
          {
            layout: "horizontal",
            gap: 8
          },
          [pill(idGen, suite, "新建对象", true), pill(idGen, suite, "批量导入")]
        )
      ], {
        gap: 10
      }),
      card(idGen, suite, "对象列表", [
        text(idGen(), "列表", {
          fontSize: 12,
          fontWeight: "700",
          fill: suite.muted
        }),
        ...OBJECT_LISTS[page.key].map(([title, meta], index) =>
          listRow(idGen, suite, title, meta, index === 0)
        )
      ], {
        gap: 8,
        height: "fill_container"
      })
    ]
  );
}

function buildTabs(idGen, suite, selectedTab) {
  return frame(
    idGen(),
    {
      name: "标签栏",
      layout: "horizontal",
      gap: 10,
      width: "fill_container",
      alignItems: "center"
    },
    ["知识库", "关系图", "轨道"].map((label) => pill(idGen, suite, label, label === selectedTab))
  );
}

function buildInspector(idGen, suite, page) {
  const data = INSPECTOR_DATA[page.key];

  return frame(
    idGen(),
    {
      name: "检查器列",
      width: suite.rightWidth,
      height: "fill_container",
      fill: suite.panel,
      stroke: stroke(suite.border, "left"),
      layout: "vertical",
      gap: 14,
      padding: [16, 16],
      clip: true
    },
    [
      text(idGen(), "检查器", {
        fontSize: 16,
        fontWeight: "700",
        fill: suite.text
      }),
      card(idGen, suite, "对象摘要", [
        frame(
          idGen(),
          {
            layout: "horizontal",
            width: "fill_container",
            justifyContent: "space_between",
            alignItems: "center"
          },
          [
            text(idGen(), data.title, {
              fontSize: 18,
              fontWeight: "700",
              fill: suite.text
            }),
            pill(idGen, suite, data.type, true)
          ]
        ),
        text(idGen(), data.status, {
          fontSize: 12,
          fill: suite.muted
        })
      ]),
      card(idGen, suite, "基础字段", [
        text(idGen(), "基础字段", {
          fontSize: 12,
          fontWeight: "700",
          fill: suite.muted
        }),
        ...data.basics.map(([left, right]) => infoRow(idGen, suite, left, right))
      ]),
      card(idGen, suite, "引用与跳转", [
        text(idGen(), "引用与跳转", {
          fontSize: 12,
          fontWeight: "700",
          fill: suite.muted
        }),
        ...data.links.map((item) =>
          frame(
            idGen(),
            {
              layout: "horizontal",
              width: "fill_container",
              gap: 8,
              alignItems: "center",
              padding: [8, 10],
              cornerRadius: 12,
              fill: suite.panelAlt,
              stroke: stroke(suite.border)
            },
            [
              dot(idGen, suite.accent),
              text(idGen(), item, {
                fontSize: 12,
                fill: suite.text,
                width: "fill_container",
                textGrowth: "fixed-width"
              })
            ]
          )
        )
      ], {
        gap: 8
      }),
      card(idGen, suite, "视图提示", [
        text(idGen(), PAGE_LEADS[page.key], {
          fontSize: 12,
          fill: suite.text,
          width: "fill_container",
          textGrowth: "fixed-width"
        }),
        text(idGen(), `当前套系：${suite.name}`, {
          fontSize: 12,
          fill: suite.muted
        })
      ])
    ]
  );
}

function buildSuiteIntro(idGen, suite, page, extraPills = []) {
  return card(idGen, suite, "视图导语", [
    text(idGen(), `${suite.name} · ${page.title}`, {
      fontSize: 20,
      fontWeight: "700",
      fill: suite.text
    }),
    text(idGen(), `${suite.summary}${PAGE_LEADS[page.key]}`, {
      fontSize: 13,
      fill: suite.muted,
      width: "fill_container",
      textGrowth: "fixed-width"
    }),
    frame(
      idGen(),
      {
        layout: "horizontal",
        gap: 8,
        alignItems: "center"
      },
      extraPills.map((label, index) => pill(idGen, suite, label, index === 0))
    )
  ], {
    gap: 10
  });
}

function buildTableCard(idGen, suite, title, headers, rows) {
  return card(idGen, suite, title, [
    text(idGen(), title, {
      fontSize: 15,
      fontWeight: "700",
      fill: suite.text
    }),
    frame(
      idGen(),
      {
        layout: "vertical",
        gap: 8,
        width: "fill_container"
      },
      [
        frame(
          idGen(),
          {
            layout: "horizontal",
            width: "fill_container",
            padding: [8, 10],
            cornerRadius: 12,
            fill: suite.panelAlt
          },
          headers.map((header, index) =>
            frame(
              idGen(),
              {
                layout: "horizontal",
                width: index === 0 ? 180 : "fill_container"
              },
              [
                text(idGen(), header, {
                  fontSize: 12,
                  fontWeight: "700",
                  fill: suite.muted
                })
              ]
            )
          )
        ),
        ...rows.map((row) =>
          frame(
            idGen(),
            {
              layout: "horizontal",
              width: "fill_container",
              padding: [8, 10],
              cornerRadius: 12,
              fill: suite.panel,
              stroke: stroke(suite.border)
            },
            row.map((cell, index) =>
              frame(
                idGen(),
                {
                  layout: "horizontal",
                  width: index === 0 ? 180 : "fill_container"
                },
                [
                  text(idGen(), cell, {
                    fontSize: 12,
                    fontWeight: index === 0 ? "700" : "500",
                    fill: suite.text
                  })
                ]
              )
            )
          )
        )
      ]
    )
  ], {
    gap: 12
  });
}

function buildDossierLayout(idGen, suite, page) {
  const drawerTitle = page.key === "focus" ? "记录详情抽屉 · 深度展开" : "记录详情抽屉";
  const headersByPage = {
    overview: ["对象", "建模状态", "引用切片", "最近改动"],
    knowledge: ["字段", "值", "来源", "审校"],
    graph: ["关系", "起点", "终点", "影响"],
    tracks: ["事件", "所在轨", "时间", "输出切片"],
    focus: ["视角", "覆盖事件", "覆盖关系", "覆盖轨道"]
  };
  const rowsByPage = {
    overview: [
      ["柳云澜", "已完成", "S-12 / S-14", "刚刚"],
      ["赤霄盟", "待补关系", "S-09", "8 分钟前"],
      ["劫火印", "待补来源", "S-12 / S-16", "12 分钟前"]
    ],
    knowledge: [
      ["境界", "化炁中段", "人物字段", "已审"],
      ["阵营", "暂不归属", "人物字段", "已审"],
      ["持有线索", "劫火印", "物品引用", "待复核"]
    ],
    graph: [
      ["追查", "赤霄盟", "柳云澜", "主冲突"],
      ["师承", "无名旧卷", "柳云澜", "背景"],
      ["争夺", "天衡司", "劫火印", "高"]
    ],
    tracks: [
      ["北陵渡口伏击", "主时间轨", "第 12 日", "T-12-A"],
      ["地脉异动", "支线轨", "第 13 日", "T-13-B"],
      ["劫火印现身", "线索轨", "第 14 日", "T-14-C"]
    ],
    focus: [
      ["柳云澜", "6", "12", "17"],
      ["沈照雪", "4", "8", "9"],
      ["赤霄盟", "5", "10", "11"]
    ]
  };

  const mainStack = frame(
    idGen(),
    {
      layout: "horizontal",
      width: "fill_container",
      gap: 14
    },
    [
      card(idGen, suite, "卷宗目录", [
        text(idGen(), "卷宗目录", {
          fontSize: 15,
          fontWeight: "700",
          fill: suite.text
        }),
        ...OBJECT_LISTS[page.key].map(([title, meta], index) =>
          listRow(idGen, suite, title, meta, index === 0)
        )
      ], {
        width: 260,
        gap: 8
      }),
      frame(
        idGen(),
        {
          layout: "vertical",
          width: "fill_container",
          gap: 14
        },
        [
          buildTableCard(idGen, suite, "字段矩阵", headersByPage[page.key], rowsByPage[page.key]),
          page.key === "tracks"
            ? card(idGen, suite, "卷宗时间索引", [
                text(idGen(), "按卷宗追踪每个对象穿过哪些轨道。", {
                  fontSize: 12,
                  fill: suite.muted
                }),
                ...[
                  ["柳云澜", "主时间轨 / 观察轨 / 地点轨"],
                  ["劫火印", "线索轨 / 冲突轨"],
                  ["赤霄盟", "势力轨 / 冲突轨"]
                ].map(([left, right]) => infoRow(idGen, suite, left, right))
              ])
            : statCard(idGen, suite, "卷宗审校进度", page.key === "focus" ? "89%" : "76%", "卷宗工作流会优先暴露缺字段和缺引用对象。")
        ]
      ),
      card(idGen, suite, drawerTitle, [
        text(idGen(), drawerTitle, {
          fontSize: 15,
          fontWeight: "700",
          fill: suite.text
        }),
        ...INSPECTOR_DATA[page.key].basics.map(([left, right]) => infoRow(idGen, suite, left, right)),
        text(idGen(), "当前抽屉与右侧检查器不同：抽屉承载当前记录主内容，检查器承载跨视图辅助信息。", {
          fontSize: 12,
          fill: suite.muted,
          width: "fill_container",
          textGrowth: "fixed-width"
        })
      ], {
        width: page.key === "focus" ? 360 : 320
      })
    ]
  );

  return [
    buildSuiteIntro(idGen, suite, page, ["卷宗视角", "字段审校", "引用追踪"]),
    frame(
      idGen(),
      {
        layout: "horizontal",
        width: "fill_container",
        gap: 14
      },
      [
        statCard(idGen, suite, "已建卷宗", "153", "对象库不是写作页，而是项目对象卷宗库。"),
        statCard(idGen, suite, "待补字段", page.key === "knowledge" ? "09" : "12", "字段矩阵直接暴露缺项，便于人工补建模。"),
        statCard(idGen, suite, "待补引用", page.key === "graph" ? "17" : "08", "关系和切片都回指卷宗记录。")
      ]
    ),
    mainStack
  ];
}

function wallNote(idGen, suite, x, y, title, body, fill, rotation = 0) {
  return frame(
    idGen(),
    {
      x,
      y,
      width: 180,
      height: "fit_content",
      layout: "vertical",
      gap: 8,
      padding: [12, 12],
      cornerRadius: 16,
      fill,
      rotation,
      effect: {
        type: "shadow",
        shadowType: "outer",
        offset: { x: 0, y: 10 },
        blur: 18,
        color: "#00000014"
      }
    },
    [
      text(idGen(), "灵感便签", {
        fontSize: 11,
        fontWeight: "700",
        fill: suite.accentStrong
      }),
      text(idGen(), title, {
        fontSize: 14,
        fontWeight: "700",
        fill: suite.text
      }),
      text(idGen(), body, {
        fontSize: 12,
        fill: suite.text,
        width: "fill_container",
        textGrowth: "fixed-width"
      })
    ]
  );
}

function buildWallLayout(idGen, suite, page) {
  const canvasLabels = {
    overview: ["开局火种", "追查压力", "飞升代价"],
    knowledge: ["人物群", "物品群", "线索群"],
    graph: ["因果团簇", "追查团簇", "伏笔团簇"],
    tracks: ["第 12 日", "第 13 日", "第 14 日"],
    focus: ["当前对象", "关联资源", "待补抽象"]
  };

  const board = card(idGen, suite, "筹划墙画布", [
    text(idGen(), "筹划墙画布", {
      fontSize: 16,
      fontWeight: "700",
      fill: suite.text
    }),
    frame(
      idGen(),
      {
        width: "fill_container",
        height: 560,
        layout: "none",
        fill: suite.workspace,
        cornerRadius: 18,
        stroke: stroke(suite.border),
        clip: true
      },
      [
        ...canvasLabels[page.key].map((label, index) =>
          frame(
            idGen(),
            {
              x: 30 + index * 250,
              y: 20,
              width: 220,
              height: 34,
              layout: "horizontal",
              alignItems: "center",
              padding: [8, 12],
              cornerRadius: 999,
              fill: suite.panelAlt,
              stroke: stroke(suite.border)
            },
            [
              text(idGen(), label, {
                fontSize: 12,
                fontWeight: "700",
                fill: suite.text
              })
            ]
          )
        ),
        rectangle(idGen(), {
          x: 220,
          y: 164,
          width: 152,
          height: 4,
          fill: suite.accent,
          rotation: -8,
          cornerRadius: 999
        }),
        rectangle(idGen(), {
          x: 489,
          y: 266,
          width: 138,
          height: 4,
          fill: suite.accent,
          rotation: 6,
          cornerRadius: 999
        }),
        wallNote(idGen, suite, 48, 84, "柳云澜追查链", "主角必须同时承受天衡司与赤霄盟双向压力。", "#FFF4B8", -3),
        wallNote(idGen, suite, 290, 134, page.key === "graph" ? "因果改写点" : "北陵渡口伏击", page.key === "tracks" ? "放入第 12 日主冲突轨。" : "这是当前所有冲突串联的第一爆点。", "#D8F6FF", 2),
        wallNote(idGen, suite, 542, 244, page.key === "focus" ? "当前对象补抽象" : "劫火印流向", "谁拿到它，谁就重写后续所有关系。", "#FDE2F1", -2),
        wallNote(idGen, suite, 210, 332, "观察切片", "沈照雪视角必须看到不同于柳云澜的证据。", "#E1F7D6", 4),
        wallNote(idGen, suite, 630, 82, "境界体系冲突", "每次境界跃迁都要拉动势力压力。", "#E8E2FF", -1)
      ]
    )
  ], {
    gap: 14
  });

  const tray = card(idGen, suite, "素材归堆区", [
    text(idGen(), "素材归堆区", {
      fontSize: 15,
      fontWeight: "700",
      fill: suite.text
    }),
    frame(
      idGen(),
      {
        layout: "horizontal",
        gap: 8
      },
      [pill(idGen, suite, "人物卡", true), pill(idGen, suite, "事件卡"), pill(idGen, suite, "关系卡")]
    ),
    ...[
      ["赤霄盟", "势力素材 / 可拖入画布"],
      ["天衡司密令", "线索素材 / 可形成因果卡"],
      ["地脉异动", "事件素材 / 可拖入时间群组"]
    ].map(([title, meta], index) => listRow(idGen, suite, title, meta, index === 0))
  ], {
    width: 350,
    gap: 8
  });

  return [
    buildSuiteIntro(idGen, suite, page, ["筹划墙", "自由拖拽", "卡片归堆"]),
    frame(
      idGen(),
      {
        layout: "horizontal",
        width: "fill_container",
        gap: 14
      },
      [
        statCard(idGen, suite, "当前墙面群组", page.key === "overview" ? "03" : "05", "每个群组代表一段剧情组织假设。"),
        statCard(idGen, suite, "可拖素材", "42", "对象库持续作为素材源头，不由墙面反向持有数据。"),
        statCard(idGen, suite, "待归堆便签", page.key === "focus" ? "07" : "11", "灵感便签只表达组织，不替代真实对象数据。")
      ]
    ),
    frame(
      idGen(),
      {
        layout: "horizontal",
        width: "fill_container",
        gap: 14
      },
      [board, tray]
    )
  ];
}

function blueprintNode(idGen, suite, x, y, title, meta, width = 190) {
  return frame(
    idGen(),
    {
      x,
      y,
      width,
      height: "fit_content",
      layout: "vertical",
      gap: 8,
      padding: [12, 12],
      cornerRadius: 16,
      fill: suite.panel,
      stroke: stroke(suite.accent),
      effect: {
        type: "shadow",
        shadowType: "outer",
        offset: { x: 0, y: 10 },
        blur: 20,
        color: "#0F172A14"
      }
    },
    [
      text(idGen(), "推演节点", {
        fontSize: 11,
        fontWeight: "700",
        fill: suite.accentStrong
      }),
      text(idGen(), title, {
        fontSize: 14,
        fontWeight: "700",
        fill: suite.text
      }),
      text(idGen(), meta, {
        fontSize: 12,
        fill: suite.muted,
        width: "fill_container",
        textGrowth: "fixed-width"
      }),
      frame(
        idGen(),
        {
          layout: "horizontal",
          width: "fill_container",
          justifyContent: "space_between",
          alignItems: "center"
        },
        [
          frame(
            idGen(),
            {
              layout: "horizontal",
              gap: 8,
              alignItems: "center"
            },
            [dot(idGen, suite.accent), text(idGen(), "输入", { fontSize: 11, fill: suite.muted })]
          ),
          frame(
            idGen(),
            {
              layout: "horizontal",
              gap: 8,
              alignItems: "center"
            },
            [text(idGen(), "输出", { fontSize: 11, fill: suite.muted }), dot(idGen, suite.accent)]
          )
        ]
      )
    ]
  );
}

function buildBlueprintLayout(idGen, suite, page) {
  const nodeTitles = {
    overview: ["柳云澜", "北陵渡口伏击", "劫火印", "赤霄盟"],
    knowledge: ["人物规格", "线索规格", "事件规格", "势力规格"],
    graph: ["上游因果", "主冲突节点", "并行边", "后续事件"],
    tracks: ["事件切片", "观察切片", "轨道映射", "输出投影"],
    focus: ["当前对象", "关联关系", "绑定切片", "后续风险"]
  };

  const bus = card(idGen, suite, "蓝图总线", [
    text(idGen(), "蓝图总线", {
      fontSize: 16,
      fontWeight: "700",
      fill: suite.text
    }),
    frame(
      idGen(),
      {
        width: "fill_container",
        height: 560,
        layout: "none",
        fill: suite.workspace,
        cornerRadius: 18,
        stroke: stroke(suite.border),
        clip: true
      },
      [
        rectangle(idGen(), {
          x: 222,
          y: 118,
          width: 178,
          height: 4,
          fill: suite.accent,
          cornerRadius: 999
        }),
        rectangle(idGen(), {
          x: 397,
          y: 121,
          width: 4,
          height: 114,
          fill: suite.accent,
          cornerRadius: 999
        }),
        rectangle(idGen(), {
          x: 401,
          y: 232,
          width: 210,
          height: 4,
          fill: suite.accent,
          cornerRadius: 999
        }),
        rectangle(idGen(), {
          x: 608,
          y: 236,
          width: 4,
          height: 120,
          fill: suite.accent,
          cornerRadius: 999
        }),
        blueprintNode(idGen, suite, 44, 74, nodeTitles[page.key][0], "主视角或主规格输入。"),
        blueprintNode(idGen, suite, 400, 74, nodeTitles[page.key][1], "中继推演或当前主冲突。", 206),
        blueprintNode(idGen, suite, 640, 194, nodeTitles[page.key][2], "向下游派生影响。"),
        blueprintNode(idGen, suite, 884, 314, nodeTitles[page.key][3], "承接并行或后续传播。", 204)
      ]
    )
  ], {
    gap: 14
  });

  const rules = card(idGen, suite, "端口规则板", [
    text(idGen(), "端口规则板", {
      fontSize: 15,
      fontWeight: "700",
      fill: suite.text
    }),
    ...[
      ["蓝端口", "对象输入 / 事件前置"],
      ["青端口", "关系中继 / 状态变化"],
      ["灰端口", "观察说明 / 非阻塞信息"],
      ["橙端口", "输出到轨道或切片"]
    ].map(([left, right]) => infoRow(idGen, suite, left, right)),
    text(idGen(), "这块板只解释图规则，不承担对象详情；对象详情仍交给右侧检查器。", {
      fontSize: 12,
      fill: suite.muted,
      width: "fill_container",
      textGrowth: "fixed-width"
    })
  ], {
    width: 320
  });

  return [
    buildSuiteIntro(idGen, suite, page, ["蓝图总线", "端口吸附", "依赖推演"]),
    frame(
      idGen(),
      {
        layout: "horizontal",
        width: "fill_container",
        gap: 14
      },
      [
        statCard(idGen, suite, "主节点", page.key === "graph" ? "23" : "17", "主要节点必须有稳定输入和输出含义。"),
        statCard(idGen, suite, "待补边", "09", "没有方向和端口语义的边不允许直接入图。"),
        statCard(idGen, suite, "图到轨投影", page.key === "tracks" ? "12" : "07", "关系推演最终要落回轨道或切片。")
      ]
    ),
    frame(
      idGen(),
      {
        layout: "horizontal",
        width: "fill_container",
        gap: 14
      },
      [bus, rules]
    )
  ];
}

function trackBlock(idGen, fill, x, title, note, width = 150, textFill = "#17212B") {
  return frame(
    idGen(),
    {
      x,
      y: 10,
      width,
      height: 42,
      layout: "vertical",
      gap: 4,
      padding: [7, 10],
      cornerRadius: 12,
      fill
    },
    [
      text(idGen(), title, {
        fontSize: 12,
        fontWeight: "700",
        fill: textFill
      }),
      text(idGen(), note, {
        fontSize: 11,
        fill: textFill
      })
    ]
  );
}

function buildTrackRow(idGen, suite, title, blocks) {
  return frame(
    idGen(),
    {
      layout: "horizontal",
      width: "fill_container",
      gap: 12,
      alignItems: "center"
    },
    [
      frame(
        idGen(),
        {
          width: 190,
          layout: "vertical",
          gap: 4
        },
        [
          text(idGen(), title, {
            fontSize: 13,
            fontWeight: "700",
            fill: suite.text
          }),
          text(idGen(), "多重轨道并行", {
            fontSize: 11,
            fill: suite.muted
          })
        ]
      ),
      frame(
        idGen(),
        {
          width: "fill_container",
          height: 62,
          layout: "none",
          fill: suite.workspace,
          cornerRadius: 14,
          stroke: stroke(suite.border),
          clip: true
        },
        [
          ...Array.from({ length: 7 }, (_, index) =>
            rectangle(idGen(), {
              x: index * 100,
              y: 0,
              width: 1,
              height: 62,
              fill: suite.border
            })
          ),
          ...blocks
        ]
      )
    ]
  );
}

function buildTimelineLayout(idGen, suite, page) {
  const timeScale = card(idGen, suite, "编排时间尺", [
    text(idGen(), "编排时间尺", {
      fontSize: 15,
      fontWeight: "700",
      fill: suite.text
    }),
    frame(
      idGen(),
      {
        layout: "horizontal",
        width: "fill_container",
        justifyContent: "space_between"
      },
      ["第 10 日", "第 11 日", "第 12 日", "第 13 日", "第 14 日", "第 15 日", "第 16 日"].map((label) =>
        text(idGen(), label, {
          fontSize: 12,
          fontWeight: "700",
          fill: suite.muted
        })
      )
    )
  ]);

  const matrix = card(idGen, suite, "轨道头矩阵", [
    text(idGen(), "轨道头矩阵", {
      fontSize: 15,
      fontWeight: "700",
      fill: suite.text
    }),
    buildTrackRow(idGen, suite, "主时间轨", [
      trackBlock(idGen, suite.accentSoft, 208, "密令下发", "前置事件", 130, suite.accentStrong),
      trackBlock(idGen, "#FFE2D8", 410, "北陵渡口伏击", "主冲突", 184)
    ]),
    buildTrackRow(idGen, suite, "地点轨", [
      trackBlock(idGen, "#DFF2FF", 420, "北陵渡口", "场景活跃", 150),
      trackBlock(idGen, "#E8F8D2", 610, "青崖城", "后续追查", 160)
    ]),
    buildTrackRow(idGen, suite, "观察轨", [
      trackBlock(idGen, suite.panelAlt, 394, "柳云澜", "主视角", 126),
      trackBlock(idGen, "#F3E8FF", 530, "沈照雪", "侧视角", 136)
    ]),
    buildTrackRow(idGen, suite, page.key === "tracks" ? "切片输出轨" : "伏笔轨", [
      trackBlock(idGen, "#FFF1B8", 252, "劫火印现身", "线索锚点", 154),
      trackBlock(idGen, suite.accentSoft, 640, page.key === "focus" ? "对象切片" : "地脉异动", page.key === "focus" ? "输出观察" : "后续引爆", 150, suite.accentStrong)
    ])
  ], {
    gap: 12
  });

  const basket = card(idGen, suite, "待排事件篮", [
    text(idGen(), "待排事件篮", {
      fontSize: 15,
      fontWeight: "700",
      fill: suite.text
    }),
    frame(
      idGen(),
      {
        layout: "horizontal",
        gap: 8,
        width: "fill_container"
      },
      [
        listRow(idGen, suite, "天衡司追捕令", "待放入主时间轨", true),
        listRow(idGen, suite, "赤霄盟暗桩暴露", "待放入势力轨"),
        listRow(idGen, suite, page.key === "focus" ? "柳云澜独白切片" : "青崖城搜捕", page.key === "focus" ? "待放入观察轨" : "待放入地点轨")
      ]
    )
  ], {
    gap: 12
  });

  return [
    buildSuiteIntro(idGen, suite, page, ["多轨编排", "观察切片", "时间尺"]),
    frame(
      idGen(),
      {
        layout: "horizontal",
        width: "fill_container",
        gap: 14
      },
      [
        statCard(idGen, suite, "主轨事件", page.key === "tracks" ? "18" : "14", "主冲突必须在时间尺上连续可追踪。"),
        statCard(idGen, suite, "观察切片", "11", "章节或切片只是一种观察输出，不是世界模型本体。"),
        statCard(idGen, suite, "待排事件", page.key === "focus" ? "04" : "07", "待排事件篮吸纳还没落轨的对象变化。")
      ]
    ),
    timeScale,
    matrix,
    basket
  ];
}

function miniWindow(idGen, suite, title, lines, accentLabel) {
  return card(idGen, suite, "联动监视窗", [
    frame(
      idGen(),
      {
        layout: "horizontal",
        width: "fill_container",
        justifyContent: "space_between",
        alignItems: "center"
      },
      [
        text(idGen(), "联动监视窗", {
          fontSize: 12,
          fontWeight: "700",
          fill: suite.accentStrong
        }),
        pill(idGen, suite, accentLabel, true)
      ]
    ),
    text(idGen(), title, {
      fontSize: 15,
      fontWeight: "700",
      fill: suite.text
    }),
    ...lines.map((line) =>
      text(idGen(), line, {
        fontSize: 12,
        fill: suite.muted,
        width: "fill_container",
        textGrowth: "fixed-width"
      })
    )
  ], {
    gap: 8
  });
}

function buildCommandLayout(idGen, suite, page) {
  const windowsByPage = {
    overview: [
      ["知识库覆盖", ["人物 24 / 势力 11 / 事件 26", "字段缺失主要集中在线索与剧情弧。"]],
      ["关系图监视", ["主冲突链已形成 23 条关键边。", "还有 9 条边没有稳定方向。"]],
      ["轨道覆盖", ["第 12 日到第 16 日覆盖最密集。", "仍有 7 个事件待排轨。"]],
      ["章节切片输出", ["观察切片已覆盖 17 段。", "主时间线仍有 2 处断层。"]]
    ],
    knowledge: [
      ["字段审校", ["当前对象字段矩阵中 9 项待补。"]],
      ["规格化检查", ["规格化键没有冲突。"]],
      ["引用一致性", ["2 条物品引用需要复核。"]],
      ["输出落点", ["字段变更会影响 4 处切片。"]]
    ],
    graph: [
      ["主冲突推演", ["图谱显示追查链压力正在上升。"]],
      ["边权漂移", ["3 条边权低于阈值。"]],
      ["支线分叉", ["地脉异动可能形成新分支。"]],
      ["输出风险", ["第 14 日切片可能失衡。"]]
    ],
    tracks: [
      ["主时间带", ["第 12 日到第 14 日拥挤，需要拆轨。"]],
      ["观察切片", ["沈照雪视角仍偏弱。"]],
      ["地点并行", ["青崖城与北陵渡口存在交叠。"]],
      ["输出排序", ["切片 T-14-C 与 T-14-D 顺序待定。"]]
    ],
    focus: [
      ["当前对象联动", ["劫火入世已覆盖事件 6 个。"]],
      ["关系热度", ["核心冲突边权 0.82。"]],
      ["轨道投影", ["主时间轨与观察轨存在双落点。"]],
      ["输出策略", ["适合拆成双视角切片输出。"]]
    ]
  };

  return [
    buildSuiteIntro(idGen, suite, page, ["全局总控", "联动监视", "切片输出"]),
    frame(
      idGen(),
      {
        layout: "horizontal",
        width: "fill_container",
        gap: 14
      },
      [
        statCard(idGen, suite, "全局覆盖总览", page.key === "overview" ? "81%" : "76%", "覆盖率不是写作进度，而是世界模型可观测程度。"),
        statCard(idGen, suite, "跨视图联动", "3 / 3", "知识库、关系图、轨道需要能互相追跳。"),
        statCard(idGen, suite, "待补输出", page.key === "focus" ? "03" : "06", "输出切片只是一层观察结果。")
      ]
    ),
    frame(
      idGen(),
      {
        layout: "horizontal",
        width: "fill_container",
        gap: 14
      },
      [
        frame(
          idGen(),
          {
            layout: "vertical",
            width: "fill_container",
            gap: 14
          },
          [
            text(idGen(), "全局覆盖总览", {
              fontSize: 16,
              fontWeight: "700",
              fill: suite.text
            }),
            frame(
              idGen(),
              {
                layout: "horizontal",
                width: "fill_container",
                gap: 14
              },
              windowsByPage[page.key].slice(0, 2).map(([title, lines]) =>
                miniWindow(idGen, suite, title, lines, page.selectedTab)
              )
            ),
            frame(
              idGen(),
              {
                layout: "horizontal",
                width: "fill_container",
                gap: 14
              },
              windowsByPage[page.key].slice(2).map(([title, lines]) =>
                miniWindow(idGen, suite, title, lines, "联动")
              )
            )
          ]
        ),
        card(idGen, suite, "输出切片指挥板", [
          text(idGen(), "输出切片指挥板", {
            fontSize: 15,
            fontWeight: "700",
            fill: suite.text
          }),
          ...[
            ["主输出", "T-12-A / 北陵渡口伏击"],
            ["并行输出", "T-14-C / 劫火印现身"],
            ["观察输出", "S-14 / 沈照雪视角"],
            ["风险提示", "主时间轨仍有 2 处空洞"]
          ].map(([left, right]) => infoRow(idGen, suite, left, right)),
          text(idGen(), "这块板的职责不是写章节，而是统筹哪些切片已经可以被观察层消费。", {
            fontSize: 12,
            fill: suite.muted,
            width: "fill_container",
            textGrowth: "fixed-width"
          })
        ], {
          width: 340
        })
      ]
    )
  ];
}

function buildCenter(idGen, suite, page) {
  const builders = {
    dossier: buildDossierLayout,
    wall: buildWallLayout,
    blueprint: buildBlueprintLayout,
    timeline: buildTimelineLayout,
    command: buildCommandLayout
  };

  return frame(
    idGen(),
    {
      name: "主视图区",
      width: "fill_container",
      height: "fill_container",
      fill: suite.workspace,
      layout: "vertical",
      gap: 14,
      padding: [18, 18]
    },
    [
      buildTabs(idGen, suite, page.selectedTab),
      ...builders[suite.mode](idGen, suite, page)
    ]
  );
}

function buildScreenDocument(suite, page) {
  const nextId = idFactory(`${suite.mode.slice(0, 3)}${page.key.slice(0, 2)}`);

  return {
    version: "2.10",
    children: [
      frame(
        nextId(),
        {
          x: 80,
          y: 80,
          name: page.title,
          width: 1600,
          height: 1000,
          clip: true,
          cornerRadius: 24,
          fill: suite.canvas,
          layout: "vertical"
        },
        [
          buildTopBar(nextId, suite, page),
          frame(
            nextId(),
            {
              name: "主体区",
              width: "fill_container",
              height: "fill_container",
              fill: suite.workspace,
              layout: "horizontal"
            },
            [
              buildSidebar(nextId, suite, page),
              buildCenter(nextId, suite, page),
              buildInspector(nextId, suite, page)
            ]
          )
        ]
      )
    ]
  };
}

function buildSuiteNote(suite) {
  const pageLines = PAGE_DEFINITIONS.map(
    (page) => `- \`${page.fileName}\` / \`${page.pngName}\`：${page.title}`
  ).join("\n");
  const markerLines = suite.markers.map((marker) => `- \`${marker}\``).join("\n");
  const referenceLines = suite.references
    .map((item) => `- [${item.label}](${item.url})`)
    .join("\n");

  return `# ${suite.name} 方案说明

## 套系定位

${suite.summary}

## 结构性标记

${markerLines}

## 外部参照

${referenceLines}

## 设计转译

1. 产品标题统一使用 \`知识编辑器\`，项目 \`青云劫火录\` 只做上下文。
2. 左侧对象库保持长期驻留，但中区主工作面的隐喻完全围绕 \`${suite.name}\` 重构。
3. 右侧检查器只承载当前对象的辅助详情，不替代中区主工作流。
4. \`${suite.name}\` 的目标不是换色，而是改变用户处理对象、关系、轨道与输出切片的方式。

## 页面清单

${pageLines}
`;
}

async function clearSuiteDirectories(outputRoot) {
  const entries = await readdir(outputRoot, {
    withFileTypes: true
  });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      await rm(path.join(outputRoot, entry.name), {
        recursive: true,
        force: true
      });
    }
  }
}

export async function generatePrototypeAssets(options = {}) {
  const outputRoot = path.resolve(options.outputRoot ?? DEFAULT_OUTPUT_ROOT);

  await mkdir(outputRoot, {
    recursive: true
  });
  await clearSuiteDirectories(outputRoot);

  for (const suite of SUITE_DEFINITIONS) {
    const suiteDir = path.join(outputRoot, suite.directory);

    await mkdir(suiteDir, {
      recursive: true
    });

    for (const page of PAGE_DEFINITIONS) {
      const doc = buildScreenDocument(suite, page);

      await writeFile(
        path.join(suiteDir, page.fileName),
        `${JSON.stringify(doc, null, 2)}\n`,
        "utf8"
      );
    }

    await writeFile(path.join(suiteDir, "方案说明.md"), `${buildSuiteNote(suite)}\n`, "utf8");
  }

  return {
    outputRoot
  };
}

if (import.meta.url === new URL(process.argv[1], "file:").href) {
  await generatePrototypeAssets();
  process.stdout.write(`WBS 1.7.2 prototype sources written to ${DEFAULT_OUTPUT_ROOT}\n`);
}
