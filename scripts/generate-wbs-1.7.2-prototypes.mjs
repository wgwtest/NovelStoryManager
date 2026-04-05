import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

export function resolveDefaultOutputRoot() {
  return fileURLToPath(
    new URL("../DOC/CODEX_DOC/04_研发文档/03_原型图/WBS-1.7.2/", import.meta.url)
  );
}

const DEFAULT_OUTPUT_ROOT = resolveDefaultOutputRoot();
const PROJECT_CONTEXT = "青云劫火录";
const PRODUCT_TITLE = "知识编辑器";
const TAB_LABELS = ["卷宗", "蓝图推演", "剪辑编排", "场景调度"];

export const SUITE_DEFINITIONS = [
  {
    fileStem: "01-卷宗工作面",
    name: "卷宗工作面",
    tabLabel: "卷宗",
    accent: "#2358C9",
    accentSoft: "#DDE7FF",
    border: "#D7E0EC",
    canvas: "#F4F7FB",
    panel: "#FFFFFF",
    text: "#15202B",
    muted: "#66758A",
    markers: ["卷宗目录", "卷宗摘要", "对象审校"],
    summary: "把对象建模收束为卷宗整理问题，强调目录、摘要页和审校动作。",
    mode: "dossier"
  },
  {
    fileStem: "02-蓝图推演工作面",
    name: "蓝图推演工作面",
    tabLabel: "蓝图推演",
    accent: "#0E6BA8",
    accentSoft: "#D9ECF9",
    border: "#D5E0EA",
    canvas: "#F3F8FB",
    panel: "#FFFFFF",
    text: "#172430",
    muted: "#657786",
    markers: ["蓝图总线", "推演节点", "依赖回路"],
    summary: "把世界模型收束为依赖推演问题，强调主总线、关键节点和回路判断。",
    mode: "blueprint"
  },
  {
    fileStem: "03-剪辑编排工作面",
    name: "剪辑编排工作面",
    tabLabel: "剪辑编排",
    accent: "#C96A1B",
    accentSoft: "#F7E5D8",
    border: "#E4D8CD",
    canvas: "#F8F5F1",
    panel: "#FFFFFF",
    text: "#2B2117",
    muted: "#7C6B59",
    markers: ["编排时间尺", "片段篮", "编排层"],
    summary: "把时间和观察组织收束为剪辑编排问题，强调时间尺、片段篮和并行编排层。",
    mode: "editing"
  },
  {
    fileStem: "04-场景调度工作面",
    name: "场景调度工作面",
    tabLabel: "场景调度",
    accent: "#2C7A57",
    accentSoft: "#DDEEE5",
    border: "#D8E3DC",
    canvas: "#F4F8F5",
    panel: "#FFFFFF",
    text: "#1E2C24",
    muted: "#6D7C73",
    markers: ["场景舞台图", "地点调度", "空间切换"],
    summary: "把世界观察收束为空间调度问题，强调主舞台、地点切换和场景流转。",
    mode: "stage"
  }
];

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
  ["柳云澜", "人物", "卷宗已对齐"],
  ["焚天盟", "势力", "交叉引用 6 处"],
  ["赤霄古城", "地点", "空间跳转高频"],
  ["劫火印", "物品", "绑定主角事件"],
  ["劫火入世", "剧情弧", "观察中"]
];

function idFactory(prefix) {
  let counter = 0;
  return () => `${prefix}${(counter++).toString(36)}`;
}

function frame(id, props, children = []) {
  return {
    type: "frame",
    id,
    ...props,
    ...(children.length > 0 ? { children } : {})
  };
}

function rectangle(id, props) {
  return {
    type: "rectangle",
    id,
    ...props
  };
}

function text(id, content, props) {
  return {
    type: "text",
    id,
    content,
    fontFamily: "Inter",
    fill: "#17212B",
    fontSize: 16,
    ...props
  };
}

function line(id, props) {
  return {
    type: "line",
    id,
    ...props
  };
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

function tag(idGen, suite, content, x, y, active = false) {
  return frame(
    idGen(),
    {
      x,
      y,
      width: active ? 118 : 110,
      height: 34,
      cornerRadius: 18,
      fill: active ? suite.accent : "#F2F4F7",
      stroke: makeStroke(active ? suite.accent : suite.border)
    },
    [
      text(idGen(), content, {
        x: 18,
        y: 9,
        fontSize: 13,
        fontWeight: "700",
        fill: active ? "#FFFFFF" : suite.text
      })
    ]
  );
}

function card(idGen, suite, title, x, y, width, height, children = []) {
  return frame(
    idGen(),
    {
      x,
      y,
      width,
      height,
      cornerRadius: 18,
      fill: suite.panel,
      stroke: makeStroke(suite.border)
    },
    [
      text(idGen(), title, {
        x: 18,
        y: 16,
        fontSize: 16,
        fontWeight: "700",
        fill: suite.text
      }),
      ...children
    ]
  );
}

function statCard(idGen, suite, title, value, x, y) {
  return frame(
    idGen(),
    {
      x,
      y,
      width: 212,
      height: 92,
      cornerRadius: 18,
      fill: "#FFFFFF",
      stroke: makeStroke(suite.border)
    },
    [
      text(idGen(), title, {
        x: 16,
        y: 16,
        fontSize: 13,
        fontWeight: "600",
        fill: suite.muted
      }),
      text(idGen(), value, {
        x: 16,
        y: 42,
        fontSize: 26,
        fontWeight: "700",
        fill: suite.text
      })
    ]
  );
}

function buildTopBar(idGen, suite) {
  const tabChildren = TAB_LABELS.map((label, index) =>
    tag(idGen, suite, label, 500 + index * 126, 26, label === suite.tabLabel)
  );

  return frame(
    idGen(),
    {
      x: 0,
      y: 0,
      width: 1760,
      height: 84,
      fill: "#FFFFFF",
      stroke: makeStroke(suite.border, "bottom")
    },
    [
      text(idGen(), PRODUCT_TITLE, {
        x: 24,
        y: 18,
        fontSize: 24,
        fontWeight: "700",
        fill: suite.text
      }),
      text(idGen(), `当前项目 · ${PROJECT_CONTEXT}`, {
        x: 24,
        y: 50,
        fontSize: 13,
        fontWeight: "500",
        fill: suite.muted
      }),
      ...tabChildren,
      text(idGen(), "本轮只保留 4 个核心工作面", {
        x: 1370,
        y: 30,
        fontSize: 13,
        fontWeight: "600",
        fill: suite.muted
      })
    ]
  );
}

function buildObjectLibrary(idGen, suite) {
  const categoryChildren = OBJECT_CATEGORIES.map((label, index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);

    return frame(
      idGen(),
      {
        x: 18 + col * 88,
        y: 120 + row * 42,
        width: 78,
        height: 30,
        cornerRadius: 15,
        fill: index === 0 ? suite.accentSoft : "#F5F7FA",
        stroke: makeStroke(index === 0 ? suite.accent : suite.border)
      },
      [
        text(idGen(), label, {
          x: 18,
          y: 8,
          fontSize: 12,
          fontWeight: "600",
          fill: suite.text
        })
      ]
    );
  });

  const objectChildren = OBJECT_ROWS.flatMap((row, index) => {
    const y = 280 + index * 94;

    return [
      frame(
        idGen(),
        {
          x: 18,
          y,
          width: 264,
          height: 80,
          cornerRadius: 16,
          fill: index === 0 ? suite.accentSoft : "#FFFFFF",
          stroke: makeStroke(index === 0 ? suite.accent : suite.border)
        },
        [
          text(idGen(), row[0], {
            x: 16,
            y: 14,
            fontSize: 15,
            fontWeight: "700",
            fill: suite.text
          }),
          text(idGen(), row[1], {
            x: 16,
            y: 40,
            fontSize: 12,
            fontWeight: "600",
            fill: suite.muted
          }),
          text(idGen(), row[2], {
            x: 16,
            y: 58,
            fontSize: 12,
            fontWeight: "500",
            fill: suite.muted
          })
        ]
      )
    ];
  });

  return frame(
    idGen(),
    {
      x: 20,
      y: 104,
      width: 300,
      height: 956,
      cornerRadius: 22,
      fill: "#FFFFFF",
      stroke: makeStroke(suite.border)
    },
    [
      text(idGen(), "对象库", {
        x: 18,
        y: 18,
        fontSize: 18,
        fontWeight: "700",
        fill: suite.text
      }),
      rectangle(idGen(), {
        x: 18,
        y: 54,
        width: 264,
        height: 42,
        cornerRadius: 14,
        fill: "#F7F9FC",
        stroke: makeStroke(suite.border)
      }),
      text(idGen(), "搜索对象、卷宗、地点、事件", {
        x: 18,
        y: 67,
        fontSize: 13,
        fontWeight: "500",
        fill: suite.muted
      }),
      ...categoryChildren,
      text(idGen(), "当前对象", {
        x: 18,
        y: 252,
        fontSize: 13,
        fontWeight: "700",
        fill: suite.muted
      }),
      ...objectChildren
    ]
  );
}

function buildInspector(idGen, suite) {
  const markerRows = suite.markers.map((label, index) =>
    text(idGen(), `0${index + 1}  ${label}`, {
      x: 18,
      y: 188 + index * 26,
      fontSize: 13,
      fontWeight: "600",
      fill: suite.text
    })
  );

  return frame(
    idGen(),
    {
      x: 1400,
      y: 104,
      width: 340,
      height: 956,
      cornerRadius: 22,
      fill: "#FFFFFF",
      stroke: makeStroke(suite.border)
    },
    [
      text(idGen(), "检查器", {
        x: 18,
        y: 18,
        fontSize: 18,
        fontWeight: "700",
        fill: suite.text
      }),
      text(idGen(), "当前核心图说明", {
        x: 18,
        y: 58,
        fontSize: 13,
        fontWeight: "700",
        fill: suite.muted
      }),
      text(idGen(), "当前只保留 1 张核心图，用来把这一类工作面的主结构讲清楚。", {
        x: 18,
        y: 82,
        width: 292,
        fontSize: 13,
        lineHeight: 19,
        fontWeight: "500",
        fill: suite.text
      }),
      text(idGen(), "本图重点", {
        x: 18,
        y: 160,
        fontSize: 13,
        fontWeight: "700",
        fill: suite.muted
      }),
      ...markerRows,
      card(idGen, suite, "本轮判断", 18, 286, 304, 146, [
        text(idGen(), suite.summary, {
          x: 18,
          y: 44,
          width: 264,
          fontSize: 13,
          lineHeight: 19,
          fontWeight: "500",
          fill: suite.text
        }),
        text(idGen(), "页面主结构已从旧的三页切换为四个工作面。", {
          x: 18,
          y: 106,
          width: 264,
          fontSize: 12,
          lineHeight: 18,
          fontWeight: "500",
          fill: suite.muted
        })
      ]),
      card(idGen, suite, "当前选中对象", 18, 452, 304, 184, [
        text(idGen(), "柳云澜", {
          x: 18,
          y: 44,
          fontSize: 17,
          fontWeight: "700",
          fill: suite.text
        }),
        text(idGen(), "人物 · 核心观察对象", {
          x: 18,
          y: 70,
          fontSize: 12,
          fontWeight: "600",
          fill: suite.muted
        }),
        text(idGen(), "关联卷宗：3 份", {
          x: 18,
          y: 108,
          fontSize: 13,
          fontWeight: "500",
          fill: suite.text
        }),
        text(idGen(), "关联场景：赤霄古城 / 焚火殿 / 地脉裂隙", {
          x: 18,
          y: 132,
          width: 264,
          fontSize: 12,
          lineHeight: 17,
          fontWeight: "500",
          fill: suite.muted
        })
      ])
    ]
  );
}

function buildDossierPanel(idGen, suite) {
  return frame(
    idGen(),
    {
      x: 340,
      y: 104,
      width: 1040,
      height: 956,
      cornerRadius: 22,
      fill: "#FFFFFF",
      stroke: makeStroke(suite.border)
    },
    [
      text(idGen(), "卷宗工作面", {
        x: 24,
        y: 20,
        fontSize: 24,
        fontWeight: "700",
        fill: suite.text
      }),
      text(idGen(), "把对象建模收束为卷宗整理、摘要收口和审校确认三步。", {
        x: 24,
        y: 54,
        fontSize: 14,
        fontWeight: "500",
        fill: suite.muted
      }),
      statCard(idGen, suite, "已开卷宗", "24", 24, 96),
      statCard(idGen, suite, "待审字段", "18", 248, 96),
      statCard(idGen, suite, "待确认引用", "09", 472, 96),
      card(idGen, suite, "卷宗目录", 24, 214, 272, 682, [
        text(idGen(), "01  柳云澜人物卷", { x: 18, y: 52, fontSize: 14, fontWeight: "700", fill: suite.text }),
        text(idGen(), "02  焚天盟势力卷", { x: 18, y: 88, fontSize: 14, fontWeight: "600", fill: suite.text }),
        text(idGen(), "03  赤霄古城地点卷", { x: 18, y: 124, fontSize: 14, fontWeight: "600", fill: suite.text }),
        text(idGen(), "04  劫火印物品卷", { x: 18, y: 160, fontSize: 14, fontWeight: "600", fill: suite.text }),
        text(idGen(), "卷宗列表只保留结构入口，不再铺 5 张不同页面。", {
          x: 18,
          y: 218,
          width: 236,
          fontSize: 12,
          lineHeight: 18,
          fontWeight: "500",
          fill: suite.muted
        })
      ]),
      card(idGen, suite, "卷宗摘要", 318, 214, 378, 682, [
        text(idGen(), "对象名称：柳云澜", { x: 18, y: 52, fontSize: 18, fontWeight: "700", fill: suite.text }),
        text(idGen(), "角色定位：火脉异变的主承载体", { x: 18, y: 86, fontSize: 13, fontWeight: "500", fill: suite.text }),
        text(idGen(), "当前摘要只保留你需要一眼读懂的字段，不再堆“字段矩阵”整页。", {
          x: 18,
          y: 124,
          width: 342,
          fontSize: 13,
          lineHeight: 19,
          fontWeight: "500",
          fill: suite.text
        }),
        text(idGen(), "关键绑定", { x: 18, y: 198, fontSize: 13, fontWeight: "700", fill: suite.muted }),
        text(idGen(), "· 劫火印", { x: 18, y: 226, fontSize: 13, fontWeight: "500", fill: suite.text }),
        text(idGen(), "· 赤霄古城", { x: 18, y: 250, fontSize: 13, fontWeight: "500", fill: suite.text }),
        text(idGen(), "· 劫火入世剧情弧", { x: 18, y: 274, fontSize: 13, fontWeight: "500", fill: suite.text })
      ]),
      card(idGen, suite, "对象审校", 718, 214, 298, 682, [
        text(idGen(), "审校清单", { x: 18, y: 52, fontSize: 14, fontWeight: "700", fill: suite.text }),
        text(idGen(), "1. 名称与别称一致", { x: 18, y: 86, fontSize: 13, fontWeight: "500", fill: suite.text }),
        text(idGen(), "2. 绑定事件已建立", { x: 18, y: 112, fontSize: 13, fontWeight: "500", fill: suite.text }),
        text(idGen(), "3. 关联地点已标注", { x: 18, y: 138, fontSize: 13, fontWeight: "500", fill: suite.text }),
        text(idGen(), "4. 输出切片引用可追踪", { x: 18, y: 164, fontSize: 13, fontWeight: "500", fill: suite.text }),
        text(idGen(), "当前工作面不是再展开成“摘要页 / 审校页 / 详情页”三张图，而是合并到一张主图内讲清。", {
          x: 18,
          y: 228,
          width: 262,
          fontSize: 12,
          lineHeight: 18,
          fontWeight: "500",
          fill: suite.muted
        })
      ])
    ]
  );
}

function buildBlueprintPanel(idGen, suite) {
  return frame(
    idGen(),
    {
      x: 340,
      y: 104,
      width: 1040,
      height: 956,
      cornerRadius: 22,
      fill: "#FFFFFF",
      stroke: makeStroke(suite.border)
    },
    [
      text(idGen(), "蓝图推演工作面", {
        x: 24,
        y: 20,
        fontSize: 24,
        fontWeight: "700",
        fill: suite.text
      }),
      text(idGen(), "这张图只保留推演主总线，不再拆成多页去解释同一套节点语言。", {
        x: 24,
        y: 54,
        fontSize: 14,
        fontWeight: "500",
        fill: suite.muted
      }),
      card(idGen, suite, "蓝图总线", 24, 98, 708, 812, [
        rectangle(idGen(), {
          x: 18,
          y: 52,
          width: 672,
          height: 724,
          cornerRadius: 18,
          fill: "#F8FBFD",
          stroke: makeStroke(suite.border)
        }),
        frame(
          idGen(),
          {
            x: 58,
            y: 120,
            width: 170,
            height: 94,
            cornerRadius: 18,
            fill: suite.accentSoft,
            stroke: makeStroke(suite.accent)
          },
          [
            text(idGen(), "推演节点 · 柳云澜", {
              x: 16,
              y: 18,
              fontSize: 15,
              fontWeight: "700",
              fill: suite.text
            }),
            text(idGen(), "对象起点", {
              x: 16,
              y: 52,
              fontSize: 12,
              fontWeight: "500",
              fill: suite.muted
            })
          ]
        ),
        frame(
          idGen(),
          {
            x: 292,
            y: 266,
            width: 188,
            height: 94,
            cornerRadius: 18,
            fill: "#FFFFFF",
            stroke: makeStroke(suite.accent)
          },
          [
            text(idGen(), "推演节点 · 劫火印", {
              x: 16,
              y: 18,
              fontSize: 15,
              fontWeight: "700",
              fill: suite.text
            }),
            text(idGen(), "关键绑定物", {
              x: 16,
              y: 52,
              fontSize: 12,
              fontWeight: "500",
              fill: suite.muted
            })
          ]
        ),
        frame(
          idGen(),
          {
            x: 508,
            y: 474,
            width: 150,
            height: 94,
            cornerRadius: 18,
            fill: "#FFFFFF",
            stroke: makeStroke(suite.accent)
          },
          [
            text(idGen(), "依赖回路", {
              x: 16,
              y: 18,
              fontSize: 15,
              fontWeight: "700",
              fill: suite.text
            }),
            text(idGen(), "触发事件链", {
              x: 16,
              y: 52,
              fontSize: 12,
              fontWeight: "500",
              fill: suite.muted
            })
          ]
        ),
        line(idGen(), {
          x: 228,
          y: 168,
          width: 80,
          height: 96,
          stroke: {
            thickness: 3,
            fill: suite.accent
          }
        }),
        line(idGen(), {
          x: 478,
          y: 360,
          width: 54,
          height: 116,
          stroke: {
            thickness: 3,
            fill: suite.accent
          }
        })
      ]),
      card(idGen, suite, "规则注板", 754, 98, 262, 812, [
        text(idGen(), "推演顺序", { x: 18, y: 52, fontSize: 14, fontWeight: "700", fill: suite.text }),
        text(idGen(), "1. 先定对象起点", { x: 18, y: 82, fontSize: 13, fontWeight: "500", fill: suite.text }),
        text(idGen(), "2. 再接关键绑定物", { x: 18, y: 108, fontSize: 13, fontWeight: "500", fill: suite.text }),
        text(idGen(), "3. 最后找依赖回路", { x: 18, y: 134, fontSize: 13, fontWeight: "500", fill: suite.text }),
        text(idGen(), "本轮不再把节点语言拆散到另一张页面里解释。", {
          x: 18,
          y: 190,
          width: 226,
          fontSize: 12,
          lineHeight: 18,
          fontWeight: "500",
          fill: suite.muted
        })
      ])
    ]
  );
}

function buildEditingPanel(idGen, suite) {
  const clipChildren = [
    [132, 96, 198, "主线铺垫"],
    [360, 96, 156, "火印失控"],
    [184, 176, 220, "古城回闪"],
    [446, 176, 162, "地脉异动"],
    [96, 256, 174, "观测切片 A"],
    [320, 256, 248, "观测切片 B"]
  ].map(([x, y, width, label]) =>
    frame(
      idGen(),
      {
        x,
        y,
        width,
        height: 54,
        cornerRadius: 14,
        fill: suite.accentSoft,
        stroke: makeStroke(suite.accent)
      },
      [
        text(idGen(), label, {
          x: 14,
          y: 18,
          fontSize: 13,
          fontWeight: "700",
          fill: suite.text
        })
      ]
    )
  );

  return frame(
    idGen(),
    {
      x: 340,
      y: 104,
      width: 1040,
      height: 956,
      cornerRadius: 22,
      fill: "#FFFFFF",
      stroke: makeStroke(suite.border)
    },
    [
      text(idGen(), "剪辑编排工作面", {
        x: 24,
        y: 20,
        fontSize: 24,
        fontWeight: "700",
        fill: suite.text
      }),
      text(idGen(), "把时间、片段和并行排布都压到同一张主图里讲清，不再回到旧的页级拆分。", {
        x: 24,
        y: 54,
        fontSize: 14,
        fontWeight: "500",
        fill: suite.muted
      }),
      card(idGen, suite, "编排时间尺", 24, 98, 992, 120, [
        text(idGen(), "T-12", { x: 20, y: 58, fontSize: 13, fontWeight: "700", fill: suite.text }),
        text(idGen(), "T-08", { x: 188, y: 58, fontSize: 13, fontWeight: "700", fill: suite.text }),
        text(idGen(), "T-04", { x: 356, y: 58, fontSize: 13, fontWeight: "700", fill: suite.text }),
        text(idGen(), "T+00", { x: 524, y: 58, fontSize: 13, fontWeight: "700", fill: suite.text }),
        text(idGen(), "T+04", { x: 692, y: 58, fontSize: 13, fontWeight: "700", fill: suite.text }),
        text(idGen(), "T+08", { x: 860, y: 58, fontSize: 13, fontWeight: "700", fill: suite.text })
      ]),
      card(idGen, suite, "编排层", 24, 238, 720, 658, [
        rectangle(idGen(), {
          x: 18,
          y: 60,
          width: 684,
          height: 570,
          cornerRadius: 16,
          fill: "#FCFAF7",
          stroke: makeStroke(suite.border)
        }),
        text(idGen(), "主线层", { x: 18, y: 92, fontSize: 13, fontWeight: "700", fill: suite.muted }),
        text(idGen(), "观察层", { x: 18, y: 172, fontSize: 13, fontWeight: "700", fill: suite.muted }),
        text(idGen(), "回闪层", { x: 18, y: 252, fontSize: 13, fontWeight: "700", fill: suite.muted }),
        ...clipChildren
      ]),
      card(idGen, suite, "片段篮", 766, 238, 250, 658, [
        text(idGen(), "待排片段", { x: 18, y: 52, fontSize: 14, fontWeight: "700", fill: suite.text }),
        text(idGen(), "· 劫火印第一次异动", { x: 18, y: 88, fontSize: 13, fontWeight: "500", fill: suite.text }),
        text(idGen(), "· 赤霄古城夜巡", { x: 18, y: 114, fontSize: 13, fontWeight: "500", fill: suite.text }),
        text(idGen(), "· 焚天盟议事", { x: 18, y: 140, fontSize: 13, fontWeight: "500", fill: suite.text }),
        text(idGen(), "这一张图只讲清“怎么编排”，不再额外拆出旧的多页结构。", {
          x: 18,
          y: 204,
          width: 214,
          fontSize: 12,
          lineHeight: 18,
          fontWeight: "500",
          fill: suite.muted
        })
      ])
    ]
  );
}

function buildStagePanel(idGen, suite) {
  return frame(
    idGen(),
    {
      x: 340,
      y: 104,
      width: 1040,
      height: 956,
      cornerRadius: 22,
      fill: "#FFFFFF",
      stroke: makeStroke(suite.border)
    },
    [
      text(idGen(), "场景调度工作面", {
        x: 24,
        y: 20,
        fontSize: 24,
        fontWeight: "700",
        fill: suite.text
      }),
      text(idGen(), "把空间线和场景切换收束成一张主图，重点回答“谁在什么地方切到哪里”。", {
        x: 24,
        y: 54,
        fontSize: 14,
        fontWeight: "500",
        fill: suite.muted
      }),
      card(idGen, suite, "场景舞台图", 24, 98, 630, 812, [
        rectangle(idGen(), {
          x: 18,
          y: 52,
          width: 594,
          height: 724,
          cornerRadius: 18,
          fill: "#F8FBF9",
          stroke: makeStroke(suite.border)
        }),
        frame(
          idGen(),
          {
            x: 60,
            y: 108,
            width: 164,
            height: 104,
            cornerRadius: 18,
            fill: suite.accentSoft,
            stroke: makeStroke(suite.accent)
          },
          [
            text(idGen(), "赤霄古城", {
              x: 18,
              y: 18,
              fontSize: 16,
              fontWeight: "700",
              fill: suite.text
            }),
            text(idGen(), "主舞台", {
              x: 18,
              y: 54,
              fontSize: 12,
              fontWeight: "500",
              fill: suite.muted
            })
          ]
        ),
        frame(
          idGen(),
          {
            x: 324,
            y: 246,
            width: 156,
            height: 104,
            cornerRadius: 18,
            fill: "#FFFFFF",
            stroke: makeStroke(suite.accent)
          },
          [
            text(idGen(), "焚火殿", {
              x: 18,
              y: 18,
              fontSize: 16,
              fontWeight: "700",
              fill: suite.text
            }),
            text(idGen(), "次级场", {
              x: 18,
              y: 54,
              fontSize: 12,
              fontWeight: "500",
              fill: suite.muted
            })
          ]
        ),
        frame(
          idGen(),
          {
            x: 182,
            y: 470,
            width: 186,
            height: 104,
            cornerRadius: 18,
            fill: "#FFFFFF",
            stroke: makeStroke(suite.accent)
          },
          [
            text(idGen(), "地脉裂隙", {
              x: 18,
              y: 18,
              fontSize: 16,
              fontWeight: "700",
              fill: suite.text
            }),
            text(idGen(), "切换终点", {
              x: 18,
              y: 54,
              fontSize: 12,
              fontWeight: "500",
              fill: suite.muted
            })
          ]
        ),
        line(idGen(), {
          x: 224,
          y: 160,
          width: 118,
          height: 90,
          stroke: {
            thickness: 3,
            fill: suite.accent
          }
        }),
        line(idGen(), {
          x: 334,
          y: 350,
          width: -78,
          height: 126,
          stroke: {
            thickness: 3,
            fill: suite.accent
          }
        })
      ]),
      card(idGen, suite, "地点调度", 676, 98, 340, 386, [
        text(idGen(), "当前驻留", { x: 18, y: 52, fontSize: 14, fontWeight: "700", fill: suite.text }),
        text(idGen(), "· 柳云澜 -> 赤霄古城", { x: 18, y: 86, fontSize: 13, fontWeight: "500", fill: suite.text }),
        text(idGen(), "· 焚天盟 -> 焚火殿", { x: 18, y: 112, fontSize: 13, fontWeight: "500", fill: suite.text }),
        text(idGen(), "· 劫火印 -> 地脉裂隙", { x: 18, y: 138, fontSize: 13, fontWeight: "500", fill: suite.text })
      ]),
      card(idGen, suite, "空间切换", 676, 504, 340, 406, [
        text(idGen(), "切换顺序", { x: 18, y: 52, fontSize: 14, fontWeight: "700", fill: suite.text }),
        text(idGen(), "1. 古城夜巡", { x: 18, y: 86, fontSize: 13, fontWeight: "500", fill: suite.text }),
        text(idGen(), "2. 焚火殿议事", { x: 18, y: 112, fontSize: 13, fontWeight: "500", fill: suite.text }),
        text(idGen(), "3. 地脉裂隙爆发", { x: 18, y: 138, fontSize: 13, fontWeight: "500", fill: suite.text }),
        text(idGen(), "这一张图只解释空间调度主结构，不再分裂成旧的页级表达。", {
          x: 18,
          y: 202,
          width: 304,
          fontSize: 12,
          lineHeight: 18,
          fontWeight: "500",
          fill: suite.muted
        })
      ])
    ]
  );
}

function buildWorkspaceFrame(suite) {
  const idGen = idFactory(suite.fileStem.slice(0, 3).toLowerCase());
  const mainPanelBuilders = {
    dossier: buildDossierPanel,
    blueprint: buildBlueprintPanel,
    editing: buildEditingPanel,
    stage: buildStagePanel
  };

  return frame(
    idGen(),
    {
      x: 40,
      y: 40,
      name: suite.name,
      width: 1760,
      height: 1080,
      clip: true,
      cornerRadius: 28,
      fill: suite.canvas
    },
    [
      buildTopBar(idGen, suite),
      buildObjectLibrary(idGen, suite),
      mainPanelBuilders[suite.mode](idGen, suite),
      buildInspector(idGen, suite)
    ]
  );
}

function buildPrototypeDoc(suite) {
  return {
    version: "2.10",
    children: [buildWorkspaceFrame(suite)]
  };
}

function buildNote(suite) {
  const markerLines = suite.markers.map((marker, index) => `${index + 1}. ${marker}`).join("\n");

  return `# ${suite.name} 方案说明

## 当前定位

当前只保留 1 张核心图，用来把 \`${suite.name}\` 这类工作面的主结构讲清楚。

## 产品语义

- 产品名统一为 \`${PRODUCT_TITLE}\`
- 项目上下文只保留 \`${PROJECT_CONTEXT}\`
- 顶层工作面改为：卷宗 / 蓝图推演 / 剪辑编排 / 场景调度
- 不再沿用旧的三页拆分方式

## 本图重点

${markerLines}

## 说明

${suite.summary}
`;
}

function getGeneratedFileNames() {
  return SUITE_DEFINITIONS.flatMap((suite) => [
    `${suite.fileStem}.pen`,
    `${suite.fileStem}.png`,
    `${suite.fileStem}-方案说明.md`
  ]);
}

export async function generatePrototypeAssets(options = {}) {
  const outputRoot = path.resolve(options.outputRoot ?? DEFAULT_OUTPUT_ROOT);
  const generatedFileNames = new Set(getGeneratedFileNames());

  await mkdir(outputRoot, {
    recursive: true
  });
  const rootEntries = await readdir(outputRoot, {
    withFileTypes: true
  });

  for (const entry of rootEntries) {
    const entryPath = path.join(outputRoot, entry.name);

    if (entry.isDirectory()) {
      await rm(entryPath, {
        force: true,
        recursive: true
      });
      continue;
    }

    if (generatedFileNames.has(entry.name)) {
      await rm(entryPath, {
        force: true
      });
    }
  }

  for (const suite of SUITE_DEFINITIONS) {
    const doc = buildPrototypeDoc(suite);

    await writeFile(
      path.join(outputRoot, `${suite.fileStem}.pen`),
      `${JSON.stringify(doc, null, 2)}\n`,
      "utf8"
    );
    await writeFile(
      path.join(outputRoot, `${suite.fileStem}-方案说明.md`),
      buildNote(suite),
      "utf8"
    );
  }

  return outputRoot;
}

if (import.meta.url === new URL(process.argv[1], "file:").href) {
  const outputRoot = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_OUTPUT_ROOT;
  await generatePrototypeAssets({
    outputRoot
  });
  process.stdout.write(`WBS 1.7.2 prototype sources written to ${outputRoot}\n`);
}
