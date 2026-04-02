# WBS 5.1 多轨编排视图计划

## 目标

在不改写对象事实文件的前提下，交付首个可用的 Tracks 工作台，支持按角色、地点、势力、剧情线等维度组织事件，调整轨道顺序，并将轨道预设保存到独立视图文件。

## 本节点必须交付的成果物

1. 轨道数据投影与分组策略：
   - `apps/web/src/lib/project-tracks.ts`
2. Tracks 视图组件：
   - `apps/web/src/components/TracksView.tsx`
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
   - `fixtures/projects/sample-novel/views/track-presets.json`

## 实施分块

### A. 轨道分组与事件投影

1. 从事件对象构建事件块。
2. 根据预设分组维度，把事件块投影到角色、地点、势力、剧情线等轨道。
3. 为无归属对象提供兜底轨道，避免事件丢失。

### B. Tracks 工作台交互

1. 在 Tracks tab 渲染轨道工具栏和轨道列表。
2. 支持切换分组策略并即时刷新轨道。
3. 支持对轨道顺序进行轻量编排，首版只改视图预设，不改事件事实。

### C. 预设保存链路

1. 提供轨道预设保存接口。
2. 保存内容只进入 `views/track-presets.json`。
3. 支持重新加载当前预设。

### D. 测试与回归

1. 增加 Tracks 分组切换测试。
2. 增加轨道顺序保存前后端测试。
3. 验证保存轨道预设时不会改写 `objects/events.json`。

## 强制测试矩阵

1. 分组切换：
   - Tracks tab 默认显示一个轨道预设，并可在 `character / location / faction / arc` 间切换。
2. 事件块展示：
   - `试炼谷夺令` 能在对应轨道中展示，且显示时间锚点。
3. 轨道编排：
   - 调整轨道顺序后点击保存，保存结果能重新加载。
4. 事实与视图分离：
   - 轨道保存仅写入 `views/track-presets.json`，不改写 `objects/events.json`。
5. 工作区回归：
   - `npm run test --workspace @novelstory/service`
   - `npm run test --workspace @novelstory/web`
   - `npm run typecheck`
   - `npm run test`
   - `npm run build`
   - 上述命令全部退出码为 `0`。

## 非目标

1. 不在本节点实现任意事件块拖入任意轨道的事实改写。
2. 不在本节点实现章节观察输出。
3. 不在本节点实现复杂时间缩放或冲突检测。
