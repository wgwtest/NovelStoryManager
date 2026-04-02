# WBS 5.1 多轨编排视图

## 基本信息

- `WBS` 编号：`WBS 5.1`
- 上级节点：`WBS 5`
- 当前状态：`待人工验收`

## 前置条件

- `WBS 2.1` 已完成项目底座实施。
- `WBS 4.1` 已完成关系图工作台首版。

## 后续节点

- `WBS 6.1` 观察输出层

## 工作目标

- 让 `Tracks` 标签具备多轨编排、换轨重排和预设保存能力，同时不污染对象事实文件。

## 工作内容

- 实现轨道分组和事件块投影。
- 实现入轨、换轨、排序和可视化编排交互。
- 实现预设保存与重新加载。
- 补齐前后端测试与回归。

## 实施方式

- 按“轨道分组与事件投影 -> 轨道交互 -> 预设保存链路 -> 测试与回归”的顺序推进。
- 历史细化计划已归档到 [07-WBS-L2-WBS-5.1-多轨编排视图计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/06_过程文档/02_历史计划/07-WBS-L2-WBS-5.1-多轨编排视图计划.md)。

## 成果物

- `apps/web/src/lib/project-tracks.ts`
- `apps/web/src/components/TracksView.tsx`
- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `apps/web/src/api/projects.ts`
- `apps/web/src/styles.css`
- `apps/service/src/app.ts`
- `apps/service/src/app.test.ts`
- `apps/service/src/lib/project-store.ts`
- `fixtures/projects/sample-novel/views/track-presets.json`
- 本文件

## 时间安排

- 当前以 GitHub Project 中的 `Start Date` 与 `Target Date` 为准。

## 验收方法

- 运行 `npm run test --workspace @novelstory/service`，预期退出码为 `0`。
- 运行 `npm run test --workspace @novelstory/web`，预期退出码为 `0`。
- 运行 `npm run typecheck`、`npm run test`、`npm run build`，预期退出码均为 `0`。
- 启动应用后，人工核验 `Tracks` 标签可切换轨道分组方式、事件块可展示并进行编排、预设可保存并重新加载，且编排结果不会直接改写对象事实文件。

## 证据链接

- [2026-04-02-181817-WBS-5.1-多轨编排视图验收清单.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/05_测试文档/02_验收清单/2026-04-02-181817-WBS-5.1-多轨编排视图验收清单.md)
- [2026-04-02-181817-WBS-5.1-多轨编排视图自测.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/05_测试文档/01_自测报告/2026-04-02-181817-WBS-5.1-多轨编排视图自测.md)
- [2026-04-02-181817-WBS-5.1-多轨编排视图交接.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/06_过程文档/01_会话交接/2026-04-02-181817-WBS-5.1-多轨编排视图交接.md)
