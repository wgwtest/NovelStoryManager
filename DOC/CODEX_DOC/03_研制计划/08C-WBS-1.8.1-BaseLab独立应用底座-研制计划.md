# WBS 1.8.1 BaseLab独立应用底座

## 基本信息

- `WBS` 编号：`WBS 1.8.1`
- 上级节点：`WBS 1.8`
- 当前状态：`待人工验收`

## 前置条件

- `WBS 1.8` 已完成 `BaseLab` 工具化方案设计。
- 已确认推荐路线为“同仓库独立应用 `apps/base-lab/`”。

## 后续节点

- `WBS 1.8.2` WBS 3.1实验迁移与入口解耦

## 工作目标

- 在当前 monorepo 中建立独立的 `BaseLab` 应用壳，使技术验证工作拥有独立入口、独立脚本、独立测试和统一实验注册机制，而不再依附主工作台入口。

## 工作内容

- 新增 `apps/base-lab/` workspace，并接入 `Vite + React + Vitest`。
- 建立 `BaseLab` 首页、实验列表和最小路由切换。
- 建立实验注册表，至少能挂载首个 `WBS 3.1` 基座对比实验。
- 补齐根脚本、workspace 自检和独立应用测试。
- 抽出主应用与 `BaseLab` 均可复用的低层视口工具。

## 实施方式

- 先用测试锁定：
  - 根脚本已新增 `dev:base-lab`
  - `BaseLab` 首页可展示实验入口
  - 点击入口可进入实验页面，再返回入口页
- 共享边界只抽低层公共工具，不把 `apps/web` 页面级组件直接挪成共享模块。
- 本节点只负责独立应用底座，不负责清理 `apps/web` 中旧入口。

## 成果物

- `DOC/CODEX_DOC/03_研制计划/08C-WBS-1.8.1-BaseLab独立应用底座-研制计划.md`
- `packages/view-core/package.json`
- `packages/view-core/src/index.ts`
- `packages/view-core/src/index.test.ts`
- `apps/base-lab/package.json`
- `apps/base-lab/src/App.tsx`
- `apps/base-lab/src/App.test.tsx`
- `apps/base-lab/src/components/BaseSelectionLab.tsx`
- `scripts/workspace-smoke.test.mjs`
- `package.json`

## 时间安排

- 当前计划窗口：`2026-04-03` 到 `2026-04-04`

## 证据链接

- `DOC/CODEX_DOC/05_测试文档/01_自测报告/2026-04-03-155844-WBS-1.8.1-BaseLab独立应用底座自测报告.md`
- `DOC/CODEX_DOC/05_测试文档/02_验收清单/2026-04-03-155844-WBS-1.8.1-BaseLab独立应用底座验收清单.md`
- `DOC/CODEX_DOC/06_过程文档/01_会话交接/2026-04-03-155844-WBS-1.8.1-BaseLab独立应用底座交接.md`

## 验收方法

- 运行 `node --test scripts/workspace-smoke.test.mjs`，预期退出码为 `0`，且断言通过新增 `dev:base-lab` 脚本。
- 运行 `npm run test --workspace @novelstory/view-core`，预期退出码为 `0`。
- 运行 `npm run test --workspace @novelstory/base-lab`，预期退出码为 `0`。
- 运行 `npm run build --workspace @novelstory/base-lab`，预期退出码为 `0`。
- 人工启动 `npm run dev:base-lab` 后，首页应出现 `BaseLab` 标题和实验入口卡片；点击 `WBS 3.1` 对应入口后，应进入独立实验页。
