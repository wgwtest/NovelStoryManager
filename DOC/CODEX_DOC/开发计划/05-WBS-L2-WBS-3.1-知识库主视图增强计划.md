# WBS 3.1 知识库主视图增强计划

## 目标

在 `WBS 2.1` 已完成的知识库基础版上，补齐对象筛选、检查器字段分组和对象引用跳转三条主交互链路，并用前端测试锁住行为。

## 本节点必须交付的成果物

1. 前端状态收口：
   - `apps/web/src/App.tsx`
2. 对象库视图：
   - `apps/web/src/components/ObjectLibrary.tsx`
3. 知识表视图：
   - `apps/web/src/components/KnowledgeView.tsx`
4. 检查器视图：
   - `apps/web/src/components/ObjectInspector.tsx`
5. 前端回归测试：
   - `apps/web/src/App.test.tsx`
6. 样式补齐：
   - `apps/web/src/styles.css`

## 实施分块

### A. 当前类型筛选

1. 在对象库增加当前类型筛选输入框。
2. 让左侧对象列表与中间知识表共享同一份过滤结果。
3. 当过滤结果排除当前选中对象时，自动切到过滤结果中的首个对象。

### B. 检查器字段分组

1. 固定 `Core Fields` 分组承载主编辑字段。
2. 把非引用字段中的剩余内容放入 `Additional Fields`。
3. 把 `Ref / Refs` 字段统一归类到 `References`。

### C. 对象引用跳转

1. 在检查器中解析 `Ref / Refs` 字段对应的目标对象。
2. 点击引用项后，切换左侧对象类型、当前选中对象和中间知识表。
3. 跳转时清空当前筛选词，避免目标对象被旧过滤条件隐藏。

### D. 前端测试与回归

1. 增加当前类型过滤测试。
2. 增加字段分组与引用跳转测试。
3. 补跑根工作区类型检查、测试和构建。

## 强制测试矩阵

1. 当前类型过滤：
   - 角色列表输入 `林` 后，只保留 `林晚`，同时知识表同步收敛。
2. 检查器分组：
   - 角色检查器必须出现 `Core Fields` 和 `References` 标题。
3. 引用跳转：
   - 点击 `苏玄 -> 青云宗` 引用后，检查器必须展示 `青云宗` 和 `北境中等宗门`。
4. 工作区回归：
   - `npm run typecheck / test / build` 全部退出码为 `0`。

## 验证命令

1. `npm run test --workspace @novelstory/web`
2. `npm run typecheck`
3. `npm run test`
4. `npm run build`

预期：

1. 上述命令全部退出码为 `0`。
2. `@novelstory/web` 的前端用例总数为 `5`，全部通过。
3. 根工作区回归同时覆盖 `@novelstory/service`、`@novelstory/web`、`@novelstory/schema`。

## 非目标

1. 不在本节点实现 Graph 视图。
2. 不在本节点实现 Tracks 视图。
3. 不在本节点实现章节观察输出。
4. 不在本节点扩展后端 API。
