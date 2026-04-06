import type { ObjectTypeName } from "@novelstory/schema";

import characters from "../../../../fixtures/projects/sample-novel/objects/characters.json" with { type: "json" };
import manifest from "../../../../fixtures/projects/sample-novel/manifest.json" with { type: "json" };
import relations from "../../../../fixtures/projects/sample-novel/objects/relations.json" with { type: "json" };
import schemaVersion from "../../../../fixtures/projects/sample-novel/schema-version.json" with { type: "json" };
import savedFilters from "../../../../fixtures/projects/sample-novel/views/saved-filters.json" with { type: "json" };

import { getObjectTypeLabel } from "./dossier-ability-lab.js";

export type DossierDesignCard = {
  summary: string;
  title: string;
};

export type DossierObjectTypeCard = {
  objectType: ObjectTypeName;
  reason: string;
  title: string;
};

export type DossierLinkPattern = {
  field: string;
  reason: string;
  source: string;
  target: string;
};

export type DossierSpecEntry = {
  content: string;
  description: string;
  path: string;
  title: string;
};

export const dossierDesignGoals: DossierDesignCard[] = [
  {
    title: "为什么要做卷宗",
    summary:
      "卷宗不是另一张表单页，而是对象事实核对入口。它把事实、引用、缺失字段和审校状态收拢到同一工作面。"
  },
  {
    title: "为什么当前先做独立页",
    summary:
      "真实数据还不完整，先在 BaseLab 用样例项目和模拟状态验证成立性，能避免主工作台壳层干扰判断。"
  },
  {
    title: "卷宗和其他视图怎么分工",
    summary:
      "卷宗负责事实和档案，蓝图负责关系推演，剪辑负责多轨编排，场景负责空间调度。它们共享模型，不共享视图实现。"
  },
  {
    title: "卷宗是不是可编辑",
    summary:
      "卷宗不是只读资料页。它是事实层的读写混合工作面，可以直接编辑字段、引用和关系，但不负责轨道编排或场景摆位。"
  }
];

export const dossierPanelChecklist: DossierDesignCard[] = [
  {
    title: "左侧对象库",
    summary: "常驻对象类型切换、搜索筛选和已保存过滤器入口。"
  },
  {
    title: "中央卷宗正文",
    summary: "集中展示对象摘要、核心字段、引用跳转和回查结果。"
  },
  {
    title: "右侧检查器",
    summary: "提供高频字段与引用字段编辑，不替代中央卷宗的阅读与核对职责。"
  },
  {
    title: "底部审校队列",
    summary: "明确告诉用户缺什么字段，而不是只给出一个抽象异常状态。"
  },
  {
    title: "关系档案与出场记录",
    summary: "补足对象之间的独立关系对象、共同事件和章节切片投影，让卷宗既能查档，也能改档。"
  }
];

export const dossierObjectTypeCards: DossierObjectTypeCard[] = [
  {
    objectType: "characters",
    title: "人物",
    reason: "人物承载身份、所属势力和当前境界，是卷宗核对最频繁的事实入口。"
  },
  {
    objectType: "factions",
    title: "宗门",
    reason: "宗门用于解释人物归属、地点控制和主线势力冲突，不能被人物字段内联替代。"
  },
  {
    objectType: "locations",
    title: "地点",
    reason: "地点是事件发生空间，也是后续场景调度工作面的空间真源。"
  },
  {
    objectType: "items",
    title: "物品",
    reason: "物品是独立证据对象，通常会被人物、事件和线索反复引用。"
  },
  {
    objectType: "realm-systems",
    title: "体系",
    reason: "体系把境界规则抽成独立真源，避免每个角色各自维护一套修炼口径。"
  },
  {
    objectType: "events",
    title: "事件",
    reason: "事件连接人物、地点和主线，是蓝图推演与剪辑编排的关键桥梁。"
  },
  {
    objectType: "relations",
    title: "关系",
    reason: "关系把 source/target 独立建模，便于长期维护人物关系与组织关系。"
  },
  {
    objectType: "clues",
    title: "线索",
    reason: "线索记录揭示条件和关联对象，是事实管理向剧情推进过渡的桥。"
  },
  {
    objectType: "arcs",
    title: "主线",
    reason: "主线用于收拢关键事件和关键对象，让卷宗能追溯更高层的剧情骨架。"
  }
];

export const dossierLinkPatterns: DossierLinkPattern[] = [
  {
    source: "人物",
    field: "factionRefs",
    target: "宗门",
    reason: "从人物卷宗直接追到归属势力，验证档案事实不是孤立字段。"
  },
  {
    source: "事件",
    field: "participantRefs / locationRefs",
    target: "人物 / 地点",
    reason: "让事件能回查参与者和发生空间，为后续蓝图与场景视图提供共用真源。"
  },
  {
    source: "关系",
    field: "sourceRef / targetRef",
    target: "对象",
    reason: "关系对象独立存在，卷宗必须能直接解释一条关系是如何连接两个对象的。"
  },
  {
    source: "线索",
    field: "objectRefs",
    target: "对象",
    reason: "线索依附对象网络存在，卷宗要能说明一条线索对应哪些事实载体。"
  },
  {
    source: "主线",
    field: "eventRefs / objectRefs",
    target: "事件 / 对象",
    reason: "主线不是纯文字摘要，而是对关键事件和关键对象的高层收束。"
  }
];

export const dossierSpecPrinciples: DossierDesignCard[] = [
  {
    title: "objects/*.json",
    summary: "存对象事实。人物、宗门、地点、物品、体系、事件、关系、线索、主线都属于对象真源。"
  },
  {
    title: "views/*.json",
    summary: "存观察状态。过滤器、布局、轨道预设、章节切片都属于视图状态，不写回对象事实。"
  },
  {
    title: "样例验证约束",
    summary: "BaseLab 可以用 sample-novel 做样例，但样例结构必须遵守正式对象真源和视图状态分层。"
  }
];

export const dossierSpecEntries: DossierSpecEntry[] = [
  {
    title: "项目清单",
    path: "fixtures/projects/sample-novel/manifest.json",
    description: "定义项目编号、标题和本项目启用的对象类型列表。",
    content: JSON.stringify(manifest, null, 2)
  },
  {
    title: "Schema 版本",
    path: "fixtures/projects/sample-novel/schema-version.json",
    description: "样例数据结构版本，用于导入导出与兼容性判断。",
    content: JSON.stringify(schemaVersion, null, 2)
  },
  {
    title: "人物对象样例",
    path: "fixtures/projects/sample-novel/objects/characters.json",
    description: "展示人物卷宗需要的核心字段、引用字段和补录字段。",
    content: JSON.stringify(characters[0], null, 2)
  },
  {
    title: "关系对象样例",
    path: "fixtures/projects/sample-novel/objects/relations.json",
    description: "展示 source/target 双端引用如何以独立关系对象表达。",
    content: JSON.stringify(relations[0], null, 2)
  },
  {
    title: "视图状态样例",
    path: "fixtures/projects/sample-novel/views/saved-filters.json",
    description: "展示卷宗当前筛选和已保存过滤器为什么属于 views 层。",
    content: JSON.stringify(savedFilters[0], null, 2)
  }
];

export function getDossierObjectTypeSummary(): string {
  return manifest.objectTypes
    .map((objectType) => getObjectTypeLabel(objectType as ObjectTypeName))
    .join(" / ");
}
