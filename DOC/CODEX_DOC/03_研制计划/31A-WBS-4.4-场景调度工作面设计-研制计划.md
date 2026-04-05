# WBS 4.4 场景调度工作面设计

## 基本信息

- `WBS` 编号：`WBS 4.4`
- 上级节点：`WBS 4`
- 当前状态：`开发中`

## 前置条件

- `WBS 3` 已冻结多视图共性机制。
- `WBS 1.7.2` 已冻结场景调度核心原型图。
- `WBS 4` 已明确多视图共享模型与严格解耦约束。

## 后续节点

- `WBS 4.4.1` 场景调度要素设计
- `WBS 4.4.2` 场景调度能力验证
- `WBS 4.4.3` 场景调度功能验证
- `WBS 4.4.4` 场景调度样式验证
- `WBS 7` 观察输出层

## 工作目标

- 交付场景调度工作面的父级设计说明与实施分支，明确它为什么必须独立于时间编排和卷宗事实页。
- 重点证明空间组织能力真实存在，而不是把地点信息塞回时间轴或卷宗页。

## 工作内容

- 先解释场景调度对地点对象、驻留对象和空间布局状态的读取边界。
- 先解释场景舞台图、调度表、切换顺序和冲突提示为何必须并存。
- 先定义场景舞台图、地点调度表、空间切换顺序和驻留对象提示的页面要素。
- 再验证地点节点拖拽、切换线、驻留对象联动和冲突提示等基础能力。
- 再做完整功能回归和样式收敛。

## 实施方式

- 按“要素设计 -> 能力验证 -> 功能验证 -> 样式验证”的顺序推进。
- 页面表达必须优先突出空间组织，不回退成另一种时间清单。

## 成果物

- [WBS-4.4-场景调度工作面设计.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/02_设计说明/WBS-4.4-场景调度工作面设计.md)
- [WBS-4.4.1-场景调度工作面要素设计.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/02_设计说明/WBS-4.4.1-场景调度工作面要素设计.md)
- [31B-WBS-4.4.1-场景调度要素设计-研制计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/03_研制计划/31B-WBS-4.4.1-场景调度要素设计-研制计划.md)
- [31C-WBS-4.4.2-场景调度能力验证-研制计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/03_研制计划/31C-WBS-4.4.2-场景调度能力验证-研制计划.md)
- [31D-WBS-4.4.3-场景调度功能验证-研制计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/03_研制计划/31D-WBS-4.4.3-场景调度功能验证-研制计划.md)
- [31E-WBS-4.4.4-场景调度样式验证-研制计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/03_研制计划/31E-WBS-4.4.4-场景调度样式验证-研制计划.md)

## 时间安排

- 当前以 GitHub Project 中的 `Start Date` 与 `Target Date` 为准。

## 验收方法

- 人工核验场景调度父节点已拆成四个具体子节点。
- 人工核验 [WBS-4.4-场景调度工作面设计.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/02_设计说明/WBS-4.4-场景调度工作面设计.md) 已明确写出工作面目的、命名原因、数据来源、页面结构和与其他工作面的边界。
- 人工核验 `WBS 4.4.2` 与 `WBS 4.4.3` 已显式覆盖地点节点、切换线、驻留对象和空间冲突等可观察能力。
