# WBS 6.1 观察输出层

## 基本信息

- `WBS` 编号：`WBS 6.1`
- 上级节点：`WBS 6`
- 当前状态：`待人工验收`

## 前置条件

- `WBS 2.1` 已完成项目底座实施。
- `WBS 5.1` 已完成多轨编排视图首版。

## 后续节点

- 后续可承接章节维度、更多观察预设和更细粒度导出能力。

## 工作目标

- 让系统能够基于当前世界模型和轨道编排结果，生成时间、人物、地点、剧情线四类切片输出。

## 工作内容

- 实现派生观察接口。
- 在 `Tracks` 视图中加入观察面板。
- 为未来章节维度预留承接位，但不把章节写回底层建模依赖。
- 补齐测试与回归。

## 实施方式

- 按“派生观察接口 -> Tracks 内观察面板 -> 章节维度预留位 -> 测试与回归”的顺序推进。
- 历史细化计划已归档到 [08-WBS-L2-WBS-6.1-观察输出层计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/06_过程文档/02_历史计划/08-WBS-L2-WBS-6.1-观察输出层计划.md)。

## 成果物

- `apps/web/src/lib/project-observation.ts`
- `apps/web/src/components/TracksView.tsx`
- `apps/web/src/App.test.tsx`
- `apps/web/src/styles.css`
- 本文件

## 时间安排

- 当前以 GitHub Project 中的 `Start Date` 与 `Target Date` 为准。

## 验收方法

- 运行 `npm run test --workspace @novelstory/web`，预期退出码为 `0`。
- 运行 `npm run typecheck`、`npm run test`、`npm run build`，预期退出码均为 `0`。
- 启动应用后，人工核验可生成时间、人物、地点、剧情线四类切片，输出结果不会直接改写对象事实文件，章节相关入口仅作为观察维度承接。

## 证据链接

- [2026-04-02-190401-WBS-6.1-观察输出层验收清单.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/05_测试文档/02_验收清单/2026-04-02-190401-WBS-6.1-观察输出层验收清单.md)
- [2026-04-02-190401-WBS-6.1-观察输出层自测.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/05_测试文档/01_自测报告/2026-04-02-190401-WBS-6.1-观察输出层自测.md)
- [2026-04-02-190401-WBS-6.1-观察输出层交接.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/06_过程文档/01_会话交接/2026-04-02-190401-WBS-6.1-观察输出层交接.md)
