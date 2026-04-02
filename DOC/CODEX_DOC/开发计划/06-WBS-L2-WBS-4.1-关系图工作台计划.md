# WBS 4.1 关系图工作台计划

## 目标

在当前对象库和知识库基础上，交付首个可用的 Graph 工作台，形成“对象事实投影为图 -> 聚焦局部子图 -> 调整布局 -> 保存到视图文件”的最小闭环。

## 本节点必须交付的成果物

1. 图数据投影与布局补全：
   - `apps/web/src/lib/project-graph.ts`
2. Graph 视图组件：
   - `apps/web/src/components/GraphView.tsx`
3. 页面接线与保存入口：
   - `apps/web/src/App.tsx`
   - `apps/web/src/api/projects.ts`
4. 服务端持久化链路：
   - `apps/service/src/app.ts`
   - `apps/service/src/lib/project-store.ts`
5. 回归测试：
   - `apps/web/src/App.test.tsx`
   - `apps/service/src/app.test.ts`
6. 样式与样例视图文件：
   - `apps/web/src/styles.css`
   - `fixtures/projects/sample-novel/views/graph-layouts.json`

## 实施分块

### A. 图数据投影

1. 从对象集合生成图节点。
2. 从 `relations` 集合和 `*Ref/*Refs` 字段派生关系边。
3. 为没有保存过坐标的节点补齐默认布局。

### B. 图工作台交互

1. 在 Graph tab 渲染节点和关系边。
2. 提供 `Focus Selection`，只显示当前选中对象及其直接相邻节点。
3. 支持节点拖拽，拖拽只改布局草稿，不改对象事实。

### C. 保存链路

1. 前端调用独立的图布局保存接口。
2. 服务端只更新 `views/graph-layouts.json`。
3. 保存后重新载入时，布局保持一致。

### D. 测试与回归

1. 增加 Graph 渲染与局部子图测试。
2. 增加布局保存前后端测试。
3. 补跑根工作区类型检查、测试和构建。

## 强制测试矩阵

1. Graph 渲染：
   - Graph tab 中可以看到 `苏玄`、`林晚`、`青云宗` 等节点与关系边。
2. 局部子图：
   - 选中 `苏玄` 后启用 `Focus Selection`，未连通的 `离线线索` 应从当前画布隐藏。
3. 布局保存：
   - 拖动 `苏玄` 节点后点击 `Save Layout`，前端请求体中的坐标发生变化，服务端会把新坐标写回 `views/graph-layouts.json`。
4. 工作区回归：
   - `npm run test --workspace @novelstory/service`
   - `npm run test --workspace @novelstory/web`
   - `npm run typecheck`
   - `npm run test`
   - `npm run build`
   - 上述命令全部退出码为 `0`。

## 非目标

1. 不在本节点实现关系边创建、修改或删除。
2. 不在本节点实现自动布局算法。
3. 不在本节点实现 Tracks 视图。
4. 不在本节点实现章节观察输出。
