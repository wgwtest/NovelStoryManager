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
      { label: "Airtable Record Detail", url: "https://support.airtable.com/docs/es/airtable-interface-layout-record-detail" },
      { label: "Scrivener Corkboard", url: "https://www.literatureandlatte.com/learn-and-support/video-tutorials/organising-5-get-to-know-the-corkboard" }
    ]
  },
  {
    directory: "02_档案阅览型",
    name: "档案阅览型",
    mode: "archive",
    accent: "#355C7D",
    accentSoft: "#DDE8F3",
    accentStrong: "#25405B",
    canvas: "#F4F7FA",
    workspace: "#F8FBFD",
    panel: "#FFFFFF",
    panelAlt: "#F1F6FA",
    border: "#D7E0E8",
    subtle: "#E7EEF4",
    text: "#1A2731",
    muted: "#6C7B86",
    leftWidth: 292,
    rightWidth: 334,
    topBarHeight: 80,
    markers: ["档案索引架", "引文页框", "参考脚注列"],
    summary: "把世界模型当作可检索资料来查阅和校读，强调索引、正文页框和脚注引用。",
    references: [
      { label: "Airtable Interface Designer", url: "https://support.airtable.com/v1/docs/getting-started-with-airtable-interface-designer" },
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
    directory: "04_剧情弧矩阵型",
    name: "剧情弧矩阵型",
    mode: "matrix",
    accent: "#7D4D9E",
    accentSoft: "#E9DDF5",
    accentStrong: "#5D3979",
    canvas: "#F7F4FB",
    workspace: "#FBF8FE",
    panel: "#FFFFFF",
    panelAlt: "#F5F0FA",
    border: "#E1D6EE",
    subtle: "#EEE6F6",
    text: "#2C1E38",
    muted: "#7A6887",
    leftWidth: 290,
    rightWidth: 334,
    topBarHeight: 80,
    markers: ["剧情弧矩阵", "角色交叉轴", "事件覆盖格"],
    summary: "把人物、事件、线索和剧情弧投到同一矩阵里，强调交叉覆盖与空白区域。",
    references: [
      { label: "Miro Matrix / Mapping", url: "https://help.miro.com/hc/en-us/articles/20185235301650-Timeline" },
      { label: "Notion Databases", url: "https://www.notion.com/help/timelines" }
    ]
  },
  {
    directory: "05_剪辑编排型",
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
    directory: "06_场景调度型",
    name: "场景调度型",
    mode: "stage",
    accent: "#2E7D5B",
    accentSoft: "#DDEFE6",
    accentStrong: "#235F46",
    canvas: "#F4F8F6",
    workspace: "#F9FCFA",
    panel: "#FFFFFF",
    panelAlt: "#F1F7F3",
    border: "#D7E3DC",
    subtle: "#E7EFEA",
    text: "#1C2E25",
    muted: "#6B7C72",
    leftWidth: 290,
    rightWidth: 332,
    topBarHeight: 80,
    markers: ["场景舞台图", "地点调度层", "空间切换条"],
    summary: "把空间线和场景切换当作调度问题处理，强调地点层、舞台图和空间跳切。",
    references: [
      { label: "Miro Space Planning", url: "https://help.miro.com/hc/en-us/articles/20185235301650-Timeline" },
      { label: "Obsidian Canvas", url: "https://obsidian.md/canvas" }
    ]
  },
  {
    directory: "07_双镜对读型",
    name: "双镜对读型",
    mode: "compare",
    accent: "#9A4C4C",
    accentSoft: "#F3DEDE",
    accentStrong: "#7B3B3B",
    canvas: "#F9F5F5",
    workspace: "#FCFAFA",
    panel: "#FFFFFF",
    panelAlt: "#F7F0F0",
    border: "#E5D8D8",
    subtle: "#EFE6E6",
    text: "#2B1E1E",
    muted: "#7B6868",
    leftWidth: 292,
    rightWidth: 334,
    topBarHeight: 80,
    markers: ["双镜对读台", "左右对照窗", "差异摘要带"],
    summary: "把两条对象链、两个视角切片或两组关系图放到同一台面上对照阅读。",
    references: [
      { label: "Airtable Detail Comparison", url: "https://support.airtable.com/docs/es/airtable-interface-layout-record-detail" },
      { label: "Notion Comparison Layouts", url: "https://www.notion.com/help/timelines" }
    ]
  },
  {
    directory: "08_切片汇编型",
    name: "切片汇编型",
    mode: "assembly",
    accent: "#006B6B",
    accentSoft: "#D7EEEE",
    accentStrong: "#004F4F",
    canvas: "#F2F8F8",
    workspace: "#F8FBFB",
    panel: "#FFFFFF",
    panelAlt: "#EDF5F5",
    border: "#D6E3E3",
    subtle: "#E6EFEF",
    text: "#172828",
    muted: "#677878",
    leftWidth: 292,
    rightWidth: 336,
    topBarHeight: 80,
    markers: ["切片汇编台", "片段编排列", "输出装配栏"],
    summary: "把观察切片、事件片段和引用对象装配成可交付的输出包，但仍不把章节当作建模前提。",
    references: [
      { label: "Aeon Timeline Story Arcs", url: "https://www.aeontimeline.com/" },
      { label: "Notion Timelines", url: "https://www.notion.com/help/timelines" }
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

function makeStroke(fill, side) {
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
      stroke: options.stroke ?? makeStroke(suite.border),
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
      stroke: makeStroke(active ? suite.accent : suite.border)
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
      stroke: makeStroke(active ? suite.accent : suite.border)
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

function buildTopBar(idGen, suite, page) {
  return frame(
    idGen(),
    {
      name: "顶部栏",
      width: "fill_container",
      height: suite.topBarHeight,
      fill: suite.panel,
      stroke: makeStroke(suite.border, "bottom"),
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
      stroke: makeStroke(suite.border, "right"),
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
            stroke: makeStroke(suite.border)
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
              stroke: makeStroke(index === 0 ? suite.accent : suite.border)
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
      stroke: makeStroke(suite.border, "left"),
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
              stroke: makeStroke(suite.border)
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
    extraPills.length === 0
      ? text(idGen(), " ", { fontSize: 1, opacity: 0 })
      : frame(
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
              stroke: makeStroke(suite.border)
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
  const headers = {
    overview: ["对象", "建模状态", "引用切片", "最近改动"],
    knowledge: ["字段", "值", "来源", "审校"],
    graph: ["关系", "起点", "终点", "影响"],
    tracks: ["事件", "所在轨", "时间", "输出切片"],
    focus: ["视角", "覆盖事件", "覆盖关系", "覆盖轨道"]
  };
  const rows = {
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
    frame(
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
          width: 250,
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
            buildTableCard(idGen, suite, "字段矩阵", headers[page.key], rows[page.key]),
            statCard(idGen, suite, "卷宗审校进度", page.key === "focus" ? "89%" : "76%", "卷宗工作流会优先暴露缺字段和缺引用对象。")
          ]
        ),
        card(idGen, suite, "记录详情抽屉", [
          text(idGen(), "记录详情抽屉", {
            fontSize: 15,
            fontWeight: "700",
            fill: suite.text
          }),
          ...INSPECTOR_DATA[page.key].basics.map(([left, right]) => infoRow(idGen, suite, left, right)),
          text(idGen(), "抽屉承载当前记录主内容；右侧检查器只承载跨视图辅助信息。", {
            fontSize: 12,
            fill: suite.muted,
            width: "fill_container",
            textGrowth: "fixed-width"
          })
        ], {
          width: 320
        })
      ]
    )
  ];
}

function buildArchiveLayout(idGen, suite, page) {
  const quoteByPage = {
    overview: "当前世界模型已可被卷宗化查阅，但还缺少若干脚注回指。",
    knowledge: "本页以资料页框展示对象正文、标签、出处与脚注，而不是表格后台。",
    graph: "关系图页在这一套中被降为附录型资料页，重点是图谱说明和引用脚注。",
    tracks: "轨道页在这一套中更像时间附录，用注释化材料解释切片顺序。",
    focus: "对象库与检查器页在这一套中重点体现“索引 -> 阅览 -> 脚注”三步流程。"
  };

  return [
    buildSuiteIntro(idGen, suite, page, ["资料阅览", "索引检索", "脚注引用"]),
    frame(
      idGen(),
      {
        layout: "horizontal",
        width: "fill_container",
        gap: 14
      },
      [
        statCard(idGen, suite, "已建档案页", "86", "每个对象都可以被投成可检索档案页。"),
        statCard(idGen, suite, "脚注回指", page.key === "graph" ? "19" : "14", "脚注用于解释对象、关系和切片的出处。"),
        statCard(idGen, suite, "待归档资料", page.key === "tracks" ? "07" : "05", "尚未进入索引架的对象需要先完成规格化。")
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
        card(idGen, suite, "档案索引架", [
          text(idGen(), "档案索引架", {
            fontSize: 15,
            fontWeight: "700",
            fill: suite.text
          }),
          ...[
            "主角人物索引",
            "核心势力索引",
            "关键事件索引",
            "线索与物品索引",
            "剧情弧附录索引"
          ].map((title, index) => listRow(idGen, suite, title, "可跳入阅览页框", index === 0))
        ], {
          width: 248,
          gap: 8
        }),
        card(idGen, suite, "引文页框", [
          text(idGen(), "引文页框", {
            fontSize: 15,
            fontWeight: "700",
            fill: suite.text
          }),
          frame(
            idGen(),
            {
              width: "fill_container",
              height: 340,
              layout: "vertical",
              gap: 14,
              padding: [18, 18],
              cornerRadius: 16,
              fill: suite.workspace,
              stroke: makeStroke(suite.border)
            },
            [
              text(idGen(), "柳云澜", {
                fontSize: 22,
                fontWeight: "700",
                fill: suite.text
              }),
              text(idGen(), quoteByPage[page.key], {
                fontSize: 13,
                fill: suite.text,
                width: "fill_container",
                textGrowth: "fixed-width"
              }),
              ...[
                "【资料摘录】当前对象已与劫火印、北陵渡口伏击和青崖城夜审建立回指。",
                "【规格化键】character.liuyunlan",
                "【引用范围】知识库 / 关系图 / 轨道 / 切片输出"
              ].map((line) =>
                text(idGen(), line, {
                  fontSize: 12,
                  fill: suite.muted,
                  width: "fill_container",
                  textGrowth: "fixed-width"
                })
              )
            ]
          )
        ], {
          width: "fill_container",
          gap: 12
        }),
        card(idGen, suite, "参考脚注列", [
          text(idGen(), "参考脚注列", {
            fontSize: 15,
            fontWeight: "700",
            fill: suite.text
          }),
          ...[
            "脚注 01：首次出现于第一卷第一章。",
            "脚注 02：与赤霄盟追查链直接相连。",
            "脚注 03：第 12 日切片中承担关键观察位。",
            "脚注 04：在关系图中连接劫火印和天衡司密令。"
          ].map((line, index) => listRow(idGen, suite, `脚注 ${index + 1}`, line, index === 0))
        ], {
          width: 320,
          gap: 8
        })
      ]
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
      stroke: makeStroke(suite.accent),
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
  const titles = {
    overview: ["柳云澜", "北陵渡口伏击", "劫火印", "赤霄盟", "地脉异动"],
    knowledge: ["人物规格", "线索规格", "事件规格", "势力规格", "轨道规格"],
    graph: ["上游因果", "主冲突节点", "并行边", "后续事件", "权重校正"],
    tracks: ["事件切片", "观察切片", "轨道映射", "输出投影", "时间锚点"],
    focus: ["当前对象", "关联关系", "绑定切片", "后续风险", "回指来源"]
  }[page.key];

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
      [
        card(idGen, suite, "蓝图总线", [
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
              stroke: makeStroke(suite.border),
              clip: true
            },
            [
              rectangle(idGen(), { x: 190, y: 126, width: 188, height: 4, fill: suite.accent, cornerRadius: 999 }),
              rectangle(idGen(), { x: 376, y: 130, width: 4, height: 118, fill: suite.accent, cornerRadius: 999 }),
              rectangle(idGen(), { x: 380, y: 245, width: 214, height: 4, fill: suite.accent, cornerRadius: 999 }),
              rectangle(idGen(), { x: 590, y: 248, width: 4, height: 125, fill: suite.accent, cornerRadius: 999 }),
              rectangle(idGen(), { x: 594, y: 372, width: 198, height: 4, fill: suite.accent, cornerRadius: 999 }),
              blueprintNode(idGen, suite, 42, 84, titles[0], "上游输入或主规格入口。"),
              blueprintNode(idGen, suite, 382, 84, titles[1], "当前主冲突或规则节点。", 212),
              blueprintNode(idGen, suite, 620, 206, titles[2], "中继状态或关键线索。"),
              blueprintNode(idGen, suite, 846, 330, titles[3], "下游势力或后续事件。", 194),
              blueprintNode(idGen, suite, 1018, 114, titles[4], "权重校正或轨道投影。", 184)
            ]
          )
        ], {
          gap: 14
        }),
        card(idGen, suite, "端口规则板", [
          text(idGen(), "端口规则板", {
            fontSize: 15,
            fontWeight: "700",
            fill: suite.text
          }),
          ...[
            ["蓝端口", "对象输入 / 事件前置"],
            ["青端口", "关系中继 / 状态变化"],
            ["灰端口", "观察说明 / 非阻塞信息"],
            ["橙端口", "输出到轨道或切片"],
            ["高亮", "鼠标聚焦时显示可连接提示"]
          ].map(([left, right]) => infoRow(idGen, suite, left, right)),
          text(idGen(), "这块板只解释图规则，不承接对象详情；对象详情仍交给右侧检查器。", {
            fontSize: 12,
            fill: suite.muted,
            width: "fill_container",
            textGrowth: "fixed-width"
          })
        ], {
          width: 320
        })
      ]
    )
  ];
}

function buildMatrixLayout(idGen, suite, page) {
  const columns = page.key === "knowledge"
    ? ["人物", "势力", "地点", "物品", "事件"]
    : page.key === "graph"
      ? ["主冲突", "师承线", "势力线", "线索线", "后续支线"]
      : page.key === "tracks"
        ? ["第 10 日", "第 11 日", "第 12 日", "第 13 日", "第 14 日"]
        : ["柳云澜", "沈照雪", "赤霄盟", "劫火印", "天衡司"];
  const rows = page.key === "focus"
    ? ["劫火入世", "地脉异动", "天衡司追捕", "赤霄伏线"]
    : ["主弧", "支弧 A", "支弧 B", "伏笔弧"];

  const grid = frame(
    idGen(),
    {
      layout: "vertical",
      width: "fill_container",
      gap: 8
    },
    [
      frame(
        idGen(),
        {
          layout: "horizontal",
          width: "fill_container",
          gap: 8
        },
        [
          frame(idGen(), { width: 150, height: 36 }),
          ...columns.map((col) =>
            frame(
              idGen(),
              {
                width: "fill_container",
                height: 36,
                layout: "horizontal",
                alignItems: "center",
                padding: [8, 10],
                cornerRadius: 12,
                fill: suite.panelAlt
              },
              [
                text(idGen(), col, {
                  fontSize: 12,
                  fontWeight: "700",
                  fill: suite.text
                })
              ]
            )
          )
        ]
      ),
      ...rows.map((row, rowIndex) =>
        frame(
          idGen(),
          {
            layout: "horizontal",
            width: "fill_container",
            gap: 8
          },
          [
            frame(
              idGen(),
              {
                width: 150,
                height: 70,
                layout: "horizontal",
                alignItems: "center",
                padding: [8, 10],
                cornerRadius: 12,
                fill: suite.panelAlt
              },
              [
                text(idGen(), row, {
                  fontSize: 12,
                  fontWeight: "700",
                  fill: suite.text
                })
              ]
            ),
            ...columns.map((col, colIndex) =>
              frame(
                idGen(),
                {
                  width: "fill_container",
                  height: 70,
                  layout: "vertical",
                  gap: 6,
                  padding: [8, 10],
                  cornerRadius: 12,
                  fill: (rowIndex + colIndex) % 2 === 0 ? suite.panel : suite.panelAlt,
                  stroke: makeStroke((rowIndex + colIndex) % 3 === 0 ? suite.accent : suite.border)
                },
                [
                  text(idGen(), "事件覆盖格", {
                    fontSize: 11,
                    fontWeight: "700",
                    fill: (rowIndex + colIndex) % 3 === 0 ? suite.accentStrong : suite.muted
                  }),
                  text(idGen(), `${row} × ${col}`, {
                    fontSize: 12,
                    fill: suite.text,
                    width: "fill_container",
                    textGrowth: "fixed-width"
                  })
                ]
              )
            )
          ]
        )
      )
    ]
  );

  return [
    buildSuiteIntro(idGen, suite, page, ["矩阵分析", "弧线覆盖", "空白暴露"]),
    frame(
      idGen(),
      {
        layout: "horizontal",
        width: "fill_container",
        gap: 14
      },
      [
        statCard(idGen, suite, "剧情弧矩阵", "04", "核心剧情弧和角色群被压到一个观察平面里。"),
        statCard(idGen, suite, "角色交叉轴", page.key === "knowledge" ? "05" : "08", "交叉轴负责暴露角色与剧情弧的联动密度。"),
        statCard(idGen, suite, "空白格", page.key === "graph" ? "06" : "09", "空白格提示仍未被模型覆盖的关系或切片。")
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
        card(idGen, suite, "剧情弧矩阵", [
          text(idGen(), "剧情弧矩阵", {
            fontSize: 15,
            fontWeight: "700",
            fill: suite.text
          }),
          grid
        ], {
          width: "fill_container",
          gap: 12
        }),
        frame(
          idGen(),
          {
            layout: "vertical",
            width: 320,
            gap: 14
          },
          [
            card(idGen, suite, "角色交叉轴", [
              text(idGen(), "角色交叉轴", {
                fontSize: 15,
                fontWeight: "700",
                fill: suite.text
              }),
              ...["柳云澜", "沈照雪", "赤霄盟", "天衡司"].map((item, index) =>
                listRow(idGen, suite, item, "可投影到剧情弧矩阵", index === 0)
              )
            ], {
              gap: 8
            }),
            card(idGen, suite, "事件覆盖格", [
              text(idGen(), "事件覆盖格", {
                fontSize: 15,
                fontWeight: "700",
                fill: suite.text
              }),
              text(idGen(), "本格用于解释矩阵中为何存在空白、为何存在高密度交叉。", {
                fontSize: 12,
                fill: suite.muted,
                width: "fill_container",
                textGrowth: "fixed-width"
              }),
              ...[
                ["北陵渡口伏击", "命中主弧与冲突列"],
                ["劫火印现身", "命中线索列与观察列"],
                ["地脉异动", "命中后续支线列"]
              ].map(([left, right]) => infoRow(idGen, suite, left, right))
            ])
          ]
        )
      ]
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
          stroke: makeStroke(suite.border),
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
        statCard(idGen, suite, "观察切片", "11", "章节或切片只是观察结果，不是世界模型本体。"),
        statCard(idGen, suite, "待排事件", page.key === "focus" ? "04" : "07", "待排事件篮吸纳还没落轨的对象变化。")
      ]
    ),
    card(idGen, suite, "编排时间尺", [
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
    ]),
    card(idGen, suite, "轨道头矩阵", [
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
    }),
    card(idGen, suite, "待排事件篮", [
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
    })
  ];
}

function buildStageLayout(idGen, suite, page) {
  const stageTitle = page.key === "tracks" ? "场景舞台图 · 空间线排布" : "场景舞台图";
  const zoneLabels = ["青崖城", "北陵渡口", "赤霄暗线", "荒山古道"];

  return [
    buildSuiteIntro(idGen, suite, page, ["空间调度", "地点层", "场景切换"]),
    frame(
      idGen(),
      {
        layout: "horizontal",
        width: "fill_container",
        gap: 14
      },
      [
        statCard(idGen, suite, "场景舞台图", "04", "当前项目的高频主舞台被抽成空间层。"),
        statCard(idGen, suite, "地点调度层", page.key === "tracks" ? "07" : "05", "每层都可以承载并行事件和观察切片。"),
        statCard(idGen, suite, "空间跳切", "06", "不同地点之间的跳切需要可解释。")
      ]
    ),
    card(idGen, suite, stageTitle, [
      text(idGen(), stageTitle, {
        fontSize: 15,
        fontWeight: "700",
        fill: suite.text
      }),
      card(idGen, suite, "空间切换条", [
        text(idGen(), "空间切换条", {
          fontSize: 12,
          fontWeight: "700",
          fill: suite.text
        }),
        frame(
          idGen(),
          {
            layout: "horizontal",
            gap: 8
          },
          zoneLabels.map((label, index) => pill(idGen, suite, label, index === 1))
        )
      ], {
        fill: suite.workspace
      }),
      frame(
        idGen(),
        {
          width: "fill_container",
          height: 430,
          layout: "none",
          fill: suite.workspace,
          cornerRadius: 18,
          stroke: makeStroke(suite.border),
          clip: true
        },
        [
          rectangle(idGen(), { x: 36, y: 46, width: 260, height: 120, fill: "#E0F2FE", cornerRadius: 18, stroke: makeStroke("#8CD0F6") }),
          rectangle(idGen(), { x: 352, y: 62, width: 290, height: 140, fill: "#E8F8D2", cornerRadius: 18, stroke: makeStroke("#AEDC66") }),
          rectangle(idGen(), { x: 686, y: 40, width: 236, height: 110, fill: "#FDE2E2", cornerRadius: 18, stroke: makeStroke("#F2A5A5") }),
          rectangle(idGen(), { x: 192, y: 248, width: 340, height: 132, fill: "#F5E8FF", cornerRadius: 18, stroke: makeStroke("#D1A9FF") }),
          rectangle(idGen(), { x: 574, y: 252, width: 254, height: 124, fill: "#FFF2D8", cornerRadius: 18, stroke: makeStroke("#F2C97D") }),
          rectangle(idGen(), { x: 284, y: 146, width: 120, height: 4, fill: suite.accent, cornerRadius: 999 }),
          rectangle(idGen(), { x: 528, y: 184, width: 160, height: 4, fill: suite.accent, cornerRadius: 999, rotation: 20 }),
          rectangle(idGen(), { x: 460, y: 316, width: 120, height: 4, fill: suite.accent, cornerRadius: 999, rotation: -20 }),
          text(idGen(), "地点调度层", { x: 58, y: 56, fontSize: 13, fontWeight: "700", fill: suite.accentStrong }),
          text(idGen(), "青崖城", { x: 60, y: 86, fontSize: 16, fontWeight: "700", fill: suite.text }),
          text(idGen(), "北陵渡口", { x: 372, y: 96, fontSize: 16, fontWeight: "700", fill: suite.text }),
          text(idGen(), "赤霄暗线", { x: 706, y: 70, fontSize: 16, fontWeight: "700", fill: suite.text }),
          text(idGen(), "观察切换层", { x: 214, y: 258, fontSize: 13, fontWeight: "700", fill: suite.accentStrong }),
          text(idGen(), "柳云澜 / 沈照雪双视角交叠", { x: 214, y: 290, fontSize: 14, fontWeight: "700", fill: suite.text }),
          text(idGen(), "荒山古道撤离线", { x: 594, y: 286, fontSize: 16, fontWeight: "700", fill: suite.text })
        ]
      )
    ], {
      gap: 12
    })
  ];
}

function buildCompareLayout(idGen, suite, page) {
  const titles = {
    overview: ["柳云澜链路", "沈照雪链路"],
    knowledge: ["对象真值", "切片输出"],
    graph: ["主关系图", "支关系图"],
    tracks: ["主时间轨", "观察轨"],
    focus: ["当前对象", "关联对象"]
  }[page.key];

  return [
    buildSuiteIntro(idGen, suite, page, ["双镜对读", "左右对照", "差异提炼"]),
    frame(
      idGen(),
      {
        layout: "horizontal",
        width: "fill_container",
        gap: 14
      },
      [
        statCard(idGen, suite, "双镜对读台", "02", "任何一次比较都必须明确左右两侧对象。"),
        statCard(idGen, suite, "差异点", page.key === "graph" ? "11" : "07", "差异点用于解释为何需要两镜并看。"),
        statCard(idGen, suite, "共识点", "05", "共识点决定哪些信息可以沉到检查器。")
      ]
    ),
    card(idGen, suite, "双镜对读台", [
      text(idGen(), "双镜对读台", {
        fontSize: 15,
        fontWeight: "700",
        fill: suite.text
      }),
      card(idGen, suite, "差异摘要带", [
        text(idGen(), "差异摘要带", {
          fontSize: 12,
          fontWeight: "700",
          fill: suite.text
        }),
        text(idGen(), "左侧更偏对象真值，右侧更偏观察结果；本带只总结差异，不重复正文。", {
          fontSize: 12,
          fill: suite.muted,
          width: "fill_container",
          textGrowth: "fixed-width"
        })
      ], {
        fill: suite.workspace
      }),
      frame(
        idGen(),
        {
          layout: "horizontal",
          width: "fill_container",
          gap: 14
        },
        [0, 1].map((index) =>
          card(idGen, suite, "左右对照窗", [
            text(idGen(), "左右对照窗", {
              fontSize: 12,
              fontWeight: "700",
              fill: suite.accentStrong
            }),
            text(idGen(), titles[index], {
              fontSize: 17,
              fontWeight: "700",
              fill: suite.text
            }),
            ...[
              "对象入口：柳云澜 / 沈照雪",
              page.key === "graph" ? "关系密度：主线 / 支线" : "引用切片：S-12 / S-14",
              page.key === "tracks" ? "轨道密度：重 / 轻" : "当前观察：主 / 侧"
            ].map((line) =>
              text(idGen(), line, {
                fontSize: 12,
                fill: suite.muted,
                width: "fill_container",
                textGrowth: "fixed-width"
              })
            )
          ], {
            width: "fill_container",
            height: 360
          })
        )
      )
    ], {
      gap: 12
    })
  ];
}

function buildAssemblyLayout(idGen, suite, page) {
  return [
    buildSuiteIntro(idGen, suite, page, ["切片装配", "输出汇编", "片段回指"]),
    frame(
      idGen(),
      {
        layout: "horizontal",
        width: "fill_container",
        gap: 14
      },
      [
        statCard(idGen, suite, "切片汇编台", "12", "切片并不是世界模型本体，而是观察层的可消费片段。"),
        statCard(idGen, suite, "待装配片段", page.key === "focus" ? "04" : "09", "每个片段都应保留回指对象。"),
        statCard(idGen, suite, "输出装配栏", "03", "用于组织一批可投向章节或观察层的结果。")
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
        card(idGen, suite, "切片汇编台", [
          text(idGen(), "切片汇编台", {
            fontSize: 15,
            fontWeight: "700",
            fill: suite.text
          }),
          frame(
            idGen(),
            {
              layout: "vertical",
              width: "fill_container",
              gap: 10
            },
            [
              ...[
                ["片段 A", "柳云澜视角进入北陵渡口", true],
                ["片段 B", "劫火印现身引爆冲突", false],
                ["片段 C", "沈照雪获得异质线索", false],
                ["片段 D", page.key === "tracks" ? "插入第 14 日观察切片" : "插入后续观察输出", false]
              ].map(([title, meta, active]) => listRow(idGen, suite, title, meta, active))
            ]
          )
        ], {
          width: 360,
          gap: 10
        }),
        card(idGen, suite, "片段编排列", [
          text(idGen(), "片段编排列", {
            fontSize: 15,
            fontWeight: "700",
            fill: suite.text
          }),
          ...[
            ["1", "片段 A -> 主视角开场"],
            ["2", "片段 B -> 主冲突抬升"],
            ["3", "片段 C -> 侧视角回补"],
            ["4", "片段 D -> 输出转场"]
          ].map(([left, right]) => infoRow(idGen, suite, left, right))
        ], {
          width: "fill_container"
        }),
        card(idGen, suite, "输出装配栏", [
          text(idGen(), "输出装配栏", {
            fontSize: 15,
            fontWeight: "700",
            fill: suite.text
          }),
          ...[
            "目标输出：T-12-A / 北陵渡口伏击",
            "并行输出：S-14 / 沈照雪观察",
            "回指对象：柳云澜、劫火印、赤霄盟",
            "回指轨道：主时间轨 / 观察轨"
          ].map((line) =>
            text(idGen(), line, {
              fontSize: 12,
              fill: suite.muted,
              width: "fill_container",
              textGrowth: "fixed-width"
            })
          )
        ], {
          width: 320
        })
      ]
    )
  ];
}

function buildCenter(idGen, suite, page) {
  const builders = {
    dossier: buildDossierLayout,
    archive: buildArchiveLayout,
    blueprint: buildBlueprintLayout,
    matrix: buildMatrixLayout,
    timeline: buildTimelineLayout,
    stage: buildStageLayout,
    compare: buildCompareLayout,
    assembly: buildAssemblyLayout
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
  const referenceLines = suite.references.map((item) => `- [${item.label}](${item.url})`).join("\n");

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
4. \`${suite.name}\` 的目标不是换色，而是改变用户处理对象、关系、轨道与切片的方式。

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
