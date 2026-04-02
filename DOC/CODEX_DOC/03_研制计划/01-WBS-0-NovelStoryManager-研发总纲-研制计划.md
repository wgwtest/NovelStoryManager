# WBS 0 NovelStoryManager 研发总纲

## 基本信息

- `WBS` 编号：`WBS 0`
- 上级节点：无
- 当前状态：`开发中`

## 前置条件

- 已确认项目产品边界、文档根目录和 `WBS` 树管理方式。

## 后续节点

- `WBS 1` 需求与方案
- `WBS 2` 核心对象模型与文件化项目
- `WBS 3` 知识库主视图
- `WBS 4` 关系图工作台
- `WBS 5` 多轨编排视图
- `WBS 6` 观察输出层

## 工作目标

- 维护整个项目的顶层 `WBS` 树、当前主线和状态同步规则，让 GitHub Project、GitHub Issue 和本地文档始终表达同一条研发路线。

## 工作内容

- 维护 `WBS 1` 到 `WBS 6` 作为顶层直接子节点。
- 维护当前主线在 `README`、本文件和 GitHub Project 中的一致性。
- 在用户明确给出“通过 / 已确认 / 验收通过”后，同步更新节点状态。

## 实施方式

- 顶层导航只使用 `WBS` 树。
- 任务先后通过 `Depends On` 表达。
- 时间安排通过 GitHub Project 中的 `Start Date` 与 `Target Date` 表达。
- 本地 `03_研制计划/` 只保留单节点单文档，负责补充说明每个节点的前置条件、后续节点、实施方式和验收方法。

## 当前主线

- 当前活动链路：`WBS 0 -> WBS 6 -> WBS 6.1`
- 当前主线目标：在保持 `WBS 2.2`、`WBS 3.1`、`WBS 4.1`、`WBS 5.1` 待人工验收的同时，完成 `WBS 6.1` 观察输出层首版闭环。
- 当前阶段状态：`待人工验收`

## 成果物

- `DOC/CODEX_DOC/README.md`
- `DOC/CODEX_DOC/00-本地工程策略映射.md`
- 本文件
- GitHub Project `NovelStoryManager Delivery Roadmap`

## 时间安排

- 顶层时间安排以 GitHub Project 中各节点的 `Start Date` 与 `Target Date` 为准。

## 验收方法

- 人工核验 GitHub Project 中根节点可以继续下钻到当前叶子节点。
- 人工核验本文件中存在顶层分解和当前主线。
- 人工核验 `README` 中的阅读顺序与当前活动链路已同步。
