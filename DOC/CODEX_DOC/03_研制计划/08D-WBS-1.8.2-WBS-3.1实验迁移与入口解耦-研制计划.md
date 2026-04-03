# WBS 1.8.2 WBS 3.1实验迁移与入口解耦

## 基本信息

- `WBS` 编号：`WBS 1.8.2`
- 上级节点：`WBS 1.8`
- 当前状态：`待人工验收`

## 前置条件

- `WBS 1.8.1` 已建立 `BaseLab` 独立应用壳和实验注册机制。
- 当前 `WBS 3.1` 基座对比实验仍位于 `apps/web` 中。

## 后续节点

- `WBS 3.1` 交互画布与渲染基座选型
- 后续新增的其他 `BaseLab` 实验节点

## 工作目标

- 将现有 `WBS 3.1` 基座对比实验正式迁入 `BaseLab`，并从主工作台中移除验证入口，使实验层与产品层完成入口解耦。

## 工作内容

- 把 `WBS 3.1` 基座对比实验组件与样式迁入 `apps/base-lab/`。
- 更新 `apps/web`，移除 `WBS 3.1 Base Lab` 入口和相关页面切换逻辑。
- 更新 `WBS 3.1` 的文档、成果物和验收路径，使其指向 `BaseLab` 独立应用。
- 通过测试验证主工作台三视图行为未被回归影响。

## 实施方式

- 先在 `apps/base-lab` 中保留现有实验视觉与交互能力。
- 再从 `apps/web` 删除入口，避免出现双入口并存。
- 同轮同步修正文档和 GitHub issue 中的成果物路径与验收方法。

## 成果物

- `DOC/CODEX_DOC/03_研制计划/08D-WBS-1.8.2-WBS-3.1实验迁移与入口解耦-研制计划.md`
- `DOC/CODEX_DOC/03_研制计划/13-WBS-3.1-交互画布与渲染基座选型-研制计划.md`
- `DOC/CODEX_DOC/02_设计说明/2026-04-03-WBS-3.1-交互画布与渲染基座选型.md`
- `apps/base-lab/src/components/BaseSelectionLab.tsx`
- `apps/base-lab/src/styles.css`
- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `apps/web/src/styles.css`

## 时间安排

- 当前计划窗口：`2026-04-03` 到 `2026-04-04`

## 证据链接

- `DOC/CODEX_DOC/05_测试文档/01_自测报告/2026-04-03-155844-WBS-1.8.2-WBS-3.1实验迁移与入口解耦自测报告.md`
- `DOC/CODEX_DOC/05_测试文档/02_验收清单/2026-04-03-155844-WBS-1.8.2-WBS-3.1实验迁移与入口解耦验收清单.md`
- `DOC/CODEX_DOC/06_过程文档/01_会话交接/2026-04-03-155844-WBS-1.8.2-WBS-3.1实验迁移与入口解耦交接.md`

## 验收方法

- 运行 `npm run test --workspace @novelstory/base-lab`，预期退出码为 `0`，且 `WBS 3.1` 实验测试通过。
- 运行 `npm run test --workspace @novelstory/web -- src/App.test.tsx`，预期退出码为 `0`。
- 运行 `npm run build --workspace @novelstory/web`，预期退出码为 `0`。
- 人工启动 `npm run dev:web` 后，主工作台顶层不再出现 `WBS 3.1 Base Lab` 入口。
- 人工启动 `npm run dev:base-lab` 后，`WBS 3.1` 基座对比实验仍可正常打开并展示三种对比画布。
