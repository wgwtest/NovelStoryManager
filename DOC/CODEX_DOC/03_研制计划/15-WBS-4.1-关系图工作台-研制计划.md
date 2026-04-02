# WBS 4.1 关系图工作台

## 基本信息

- `WBS` 编号：`WBS 4.1`
- 上级节点：`WBS 4`
- 当前状态：`待人工验收`

## 前置条件

- `WBS 2.1` 已完成项目底座实施。

## 后续节点

- `WBS 5.1` 多轨编排视图

## 工作目标

- 让 `Graph` 标签从占位入口升级为可渲染节点、关系边和布局保存的关系图工作台。

## 工作内容

- 建立对象和关系到图数据的投影链路。
- 实现节点与关系边渲染、局部子图查看、缩放和平移。
- 实现布局保存与重新加载。
- 补齐前后端测试与回归。

## 实施方式

- 按“图数据投影 -> 图工作台交互 -> 保存链路 -> 测试与回归”的顺序推进。
- 历史细化计划已归档到 [06-WBS-L2-WBS-4.1-关系图工作台计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/06_过程文档/02_历史计划/06-WBS-L2-WBS-4.1-关系图工作台计划.md)。

## 成果物

- `apps/web/src/lib/project-graph.ts`
- `apps/web/src/components/GraphView.tsx`
- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `apps/web/src/api/projects.ts`
- `apps/web/src/styles.css`
- `apps/service/src/app.ts`
- `apps/service/src/app.test.ts`
- `apps/service/src/lib/project-store.ts`
- `fixtures/projects/sample-novel/views/graph-layouts.json`
- 本文件

## 时间安排

- 当前以 GitHub Project 中的 `Start Date` 与 `Target Date` 为准。

## 验收方法

- 运行 `npm run test --workspace @novelstory/web`，预期退出码为 `0`。
- 运行 `npm run test --workspace @novelstory/service`，预期退出码为 `0`。
- 运行 `npm run typecheck`、`npm run test`、`npm run build`，预期退出码均为 `0`。
- 启动应用后，人工核验 `Graph` 标签可渲染节点和关系边、可以查看局部子图、布局修改后可重新加载。

## 证据链接

- [2026-04-02-180538-WBS-4.1-关系图工作台验收清单.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/05_测试文档/02_验收清单/2026-04-02-180538-WBS-4.1-关系图工作台验收清单.md)
- [2026-04-02-180538-WBS-4.1-关系图工作台自测.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/05_测试文档/01_自测报告/2026-04-02-180538-WBS-4.1-关系图工作台自测.md)
- [2026-04-02-180538-WBS-4.1-关系图工作台交接.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/06_过程文档/01_会话交接/2026-04-02-180538-WBS-4.1-关系图工作台交接.md)
