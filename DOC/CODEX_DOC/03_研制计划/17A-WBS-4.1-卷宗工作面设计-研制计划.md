# WBS 4.1 卷宗工作面设计

## 基本信息

- `WBS` 编号：`WBS 4.1`
- 上级节点：`WBS 4`
- 当前状态：`开发中`

## 前置条件

- `WBS 3` 已冻结多视图共性机制。
- `WBS 4` 已明确多视图共享模型与严格解耦约束。

## 后续节点

- `WBS 4.1.1` 卷宗要素设计
- `WBS 4.1.2` 卷宗能力验证
- `WBS 4.1.3` 卷宗功能验证
- `WBS 4.1.4` 卷宗样式验证

## 工作目标

- 交付卷宗工作面的父级设计说明与实施分支，明确卷宗为什么存在、靠哪些数据驱动，以及它为什么不能被蓝图、编排或场景页替代。
- 重点保证卷宗浏览、字段核对、卷间引用跳转和上下文检查能力稳定落位。

## 工作内容

- 先解释“卷宗”这一命名对应的产品语义和工作面职责。
- 定义卷宗与对象真源、过滤状态和引用回查状态之间的数据边界。
- 先定义卷宗目录、卷宗摘要、审校队列和引用回查的页面要素与信息密度。
- 再验证对象筛选、卷宗切换、字段编辑、引用跳转等基础能力。
- 再做完整功能回归和样式收敛。

## 实施方式

- 按“要素设计 -> 能力验证 -> 功能验证 -> 样式验证”的顺序推进。
- 当前已暴露的“卷宗摘要密度不足、引用回查不直观、审校状态不够可见”等问题，放入 `WBS 4.1.2-4.1.4` 解决，不再作为已通过事项留存。

## 成果物

- [WBS-4.1-卷宗工作面设计.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/02_设计说明/WBS-4.1-卷宗工作面设计.md)
- [WBS-4.1.1-卷宗工作面要素设计.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/02_设计说明/WBS-4.1.1-卷宗工作面要素设计.md)
- [18-WBS-4.1.1-卷宗要素设计-研制计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/03_研制计划/18-WBS-4.1.1-卷宗要素设计-研制计划.md)
- [19-WBS-4.1.2-卷宗能力验证-研制计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/03_研制计划/19-WBS-4.1.2-卷宗能力验证-研制计划.md)
- [20-WBS-4.1.3-卷宗功能验证-研制计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/03_研制计划/20-WBS-4.1.3-卷宗功能验证-研制计划.md)
- [21-WBS-4.1.4-卷宗样式验证-研制计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/03_研制计划/21-WBS-4.1.4-卷宗样式验证-研制计划.md)

## 时间安排

- 当前以 GitHub Project 中的 `Start Date` 与 `Target Date` 为准。

## 验收方法

- 人工核验本节点已拆成四个具体子节点，且每个子节点都能看出“设计 / 能力 / 功能 / 样式”的分工。
- 人工核验 [WBS-4.1-卷宗工作面设计.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/02_设计说明/WBS-4.1-卷宗工作面设计.md) 已明确写出工作面目的、命名原因、数据来源、页面结构和与其他工作面的边界。
- 人工核验当前已知问题已被映射到具体子节点，而不是停留在笼统的“增强”表述里。
