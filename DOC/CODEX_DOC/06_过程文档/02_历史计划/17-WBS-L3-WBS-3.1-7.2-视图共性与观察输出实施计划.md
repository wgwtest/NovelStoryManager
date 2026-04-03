# 视图共性与观察输出 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 完成 `WBS 2.2` 修订、`WBS 3-6` 共性层与三视图能力增强，并交付 `WBS 7.2` 观察输出编码。

**Architecture:** 复用现有文件化项目与三视图壳层，补齐共享视口状态、对象创建与关系创建接口、章节切片视图状态和观察输出派生逻辑。对象真源继续落在 `objects/*.json`，视图与章节观察状态继续落在 `views/*.json`。

**Tech Stack:** `TypeScript`, `Zod`, `Fastify`, `React`, `Vitest`

---

### Task 1: 数据规范修订与样例扩展

**Files:**
- Modify: `packages/schema/src/index.ts`
- Modify: `packages/schema/src/index.test.ts`
- Modify: `apps/service/src/lib/project-store.ts`
- Modify: `apps/service/src/app.ts`
- Modify: `apps/service/src/app.test.ts`
- Create: `fixtures/import-export/project-bundles/sample-rich-project.json`
- Modify: `fixtures/projects/sample-novel/views/*.json`

- [ ] 先写失败测试，覆盖新视图文件和高覆盖样例数据
- [ ] 让 schema 支持章节切片与共享视口字段
- [ ] 让 service 能读写新增视图状态

### Task 2: 三视图共性层

**Files:**
- Create: `apps/web/src/lib/view-canvas.ts`
- Create: `apps/web/src/lib/view-canvas.test.ts`
- Modify: `apps/web/src/lib/project-graph.ts`
- Modify: `apps/web/src/lib/project-tracks.ts`

- [ ] 先写失败测试，覆盖共享缩放、平移、坐标换算
- [ ] 抽出图与轨道共享视口工具
- [ ] 让图与轨道都使用统一视口状态

### Task 3: 知识库与对象创建

**Files:**
- Modify: `apps/service/src/app.ts`
- Modify: `apps/service/src/lib/project-store.ts`
- Modify: `apps/web/src/api/projects.ts`
- Modify: `apps/web/src/App.tsx`
- Modify: `apps/web/src/components/ObjectLibrary.tsx`
- Modify: `apps/web/src/components/ObjectInspector.tsx`
- Modify: `apps/web/src/App.test.tsx`

- [ ] 先写失败测试，覆盖创建对象与引用跳转
- [ ] 实现对象创建接口和前端入口
- [ ] 修正知识库检查器分区与滚动问题

### Task 4: 关系图能力增强

**Files:**
- Modify: `apps/web/src/components/GraphView.tsx`
- Modify: `apps/web/src/lib/project-graph.ts`
- Modify: `apps/web/src/styles.css`
- Modify: `apps/service/src/app.ts`
- Modify: `apps/service/src/lib/project-store.ts`

- [ ] 先写失败测试，覆盖创建节点、创建边、坐标显示、画布配置
- [ ] 实现图工具栏、连线模式、坐标显示和视口控制
- [ ] 将图布局保存到视图状态

### Task 5: 多轨能力增强

**Files:**
- Modify: `apps/web/src/components/TracksView.tsx`
- Modify: `apps/web/src/lib/project-tracks.ts`
- Modify: `apps/web/src/styles.css`
- Modify: `apps/service/src/app.ts`
- Modify: `apps/service/src/lib/project-store.ts`

- [ ] 先写失败测试，覆盖轨道视口、事件块换轨和预设保存
- [ ] 实现多轨画布、时间锚点、换轨与视口控制
- [ ] 保持对象真源与预设状态分离

### Task 6: 观察输出与章节切片

**Files:**
- Modify: `apps/web/src/lib/project-observation.ts`
- Modify: `apps/web/src/components/TracksView.tsx`
- Modify: `apps/web/src/api/projects.ts`
- Modify: `apps/service/src/app.ts`
- Modify: `apps/service/src/lib/project-store.ts`
- Modify: `apps/web/src/App.test.tsx`

- [ ] 先写失败测试，覆盖章节观察模式、章节文本保存和相关人物展示
- [ ] 实现章节切片读取与保存
- [ ] 实现章节观察卡片和章节编辑区

### Task 7: 端到端验证与证据更新

**Files:**
- Modify: `DOC/CODEX_DOC/05_测试文档/01_自测报告/`
- Modify: `DOC/CODEX_DOC/05_测试文档/02_验收清单/`
- Modify: `DOC/CODEX_DOC/06_过程文档/01_会话交接/`

- [ ] 运行 schema、service、web、typecheck、build 全量验证
- [ ] 更新本轮自测报告
- [ ] 生成面向用户的人工验收清单
