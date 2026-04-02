# NovelStoryManager 文档索引

## 当前状态

1. 当前活动文档根：`DOC/CODEX_DOC/`
2. 当前活动链路：`WBS 0 -> WBS 6 -> WBS 6.1`
3. 当前阶段状态：`待人工验收`
4. 当前主线目标：`WBS 6.1` 已进入待人工验收，当前主线已覆盖三主视图与首版观察输出层
5. GitHub Project：<https://github.com/users/wgwtest/projects/3>

## Project 树读取规则

1. 根节点使用 `WBS 0` 总纲 issue 承载整体研发路线
2. 一级模块使用 `WBS 1` 到 `WBS 6` 父 issue 承载并列能力分块
3. 可直接执行的实现任务使用叶子 issue，挂在对应父节点下
4. 只有不存在稳定父子关系的任务，才允许在同层并列
5. 父节点与叶子节点名称都应概括、易懂，避免使用信息量不足的抽象词

## 推进规则

1. 主导航轴只使用 `WBS` 树，不再额外维护里程碑轴
2. 任务先后通过 `Depends On` 表达
3. 时间规划通过 `Start Date` 和 `Target Date` 表达
4. 当前主线应当能够从根节点一路下钻到叶子节点
5. 里程碑字段仅在用户明确要求时才可恢复，不作为默认结构

## Project 字段规则

1. 常驻字段只保留：`Status`、`Work Type`、`Start Date`、`Target Date`
2. 树关系优先通过原生父 issue / 子 issue 表达
3. 依赖关系优先写入 issue 契约正文
4. 用户明确给出“通过 / 已确认 / 验收通过”后，必须在同一轮把对应节点的 `Status` 同步到 GitHub Project

## Issue 契约规则

1. 每个 WBS issue 都必须至少写清：`工作目标`、`工作内容`、`潜在难点`、`Depends On`、`成果物`、`验收方法`、`当前状态`、`上级节点`
2. 文档类 issue 的 `验收方法` 应写成人工核验文件和条目的方法
3. 代码类 issue 的 `验收方法` 应写成命令、步骤和预期结果
4. `WBS` 叶子节点名称必须直接体现业务对象、规范对象或实现对象，避免使用信息量不足的抽象词
5. 数据规范、文件规范、导入导出类 issue 的 `成果物` 必须至少同时点名：规范正文路径、实现文件路径、测试夹具路径
6. 数据规范、文件规范、导入导出类 issue 的 `验收方法` 必须至少覆盖：正样例、反样例、往返一致性测试
7. 不再使用空泛的 `验收入口 / 验收标准` 组合

## 文档分工规则

1. `WBS` 节点说明页用于记录节点定位、状态、完成标准和正文入口，不重复承载完整正文内容
2. `设计稿/` 中的专题文档才是需求、方案、模型等正文成果物
3. 当同一 `WBS` 同时存在节点说明页和正文时，issue 的 `成果物` 优先写正文，不把节点说明页和正文并列成同级交付物
4. 当前已经显式命名为“节点说明”的本地 `WBS` 文档，应默认按导航文档理解，而不是正文成果物
5. 对强交互工作台，技术方案选型必须以后续原型目标和交互验证为输入，不允许绕过原型直接冻结交互栈
6. 当某个 `WBS` 节点的主要价值是“规范本身”时，应优先把 `设计稿/` 下的规范正文作为主要成果物，而不是只保留抽象 issue 标题

## 阅读顺序

1. [00-本地工程策略映射.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/00-本地工程策略映射.md)
2. [00-工程总体分析.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/00-工程总体分析.md)
3. [01-WBS-L0-NovelStoryManager-研发总纲节点说明.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/01-WBS-L0-NovelStoryManager-研发总纲节点说明.md)
4. [02-WBS-L1-WBS-1.1-产品边界确认与文档归档节点说明.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/02-WBS-L1-WBS-1.1-产品边界确认与文档归档节点说明.md)
5. [03-WBS-L1-WBS-1.2-信息架构与页面分解节点说明.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/03-WBS-L1-WBS-1.2-信息架构与页面分解节点说明.md)
6. [2026-04-01-WBS-1.2-信息架构与页面分解.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/设计稿/2026-04-01-WBS-1.2-信息架构与页面分解.md)
7. [04-WBS-L1-WBS-1.3-低保真原型设计节点说明.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/04-WBS-L1-WBS-1.3-低保真原型设计节点说明.md)
8. [2026-04-01-WBS-1.3-低保真原型设计.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/设计稿/2026-04-01-WBS-1.3-低保真原型设计.md)
9. [05-WBS-L1-WBS-1.4-高风险交互原型验证节点说明.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/05-WBS-L1-WBS-1.4-高风险交互原型验证节点说明.md)
10. [2026-04-01-WBS-1.4-高风险交互原型验证.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/设计稿/2026-04-01-WBS-1.4-高风险交互原型验证.md)
11. [06-WBS-L1-WBS-1.5-技术方案选型节点说明.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/06-WBS-L1-WBS-1.5-技术方案选型节点说明.md)
12. [2026-04-01-WBS-1.5-技术方案选型.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/设计稿/2026-04-01-WBS-1.5-技术方案选型.md)
13. [07-WBS-L1-WBS-1.6-初始任务拆解与时间规划节点说明.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/07-WBS-L1-WBS-1.6-初始任务拆解与时间规划节点说明.md)
14. [03-WBS-L2-WBS-2.1-项目底座实施计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/开发计划/03-WBS-L2-WBS-2.1-项目底座实施计划.md)
15. [2026-04-02-WBS-2.2-项目数据规范与导入导出规范.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/设计稿/2026-04-02-WBS-2.2-项目数据规范与导入导出规范.md)
16. [04-WBS-L2-WBS-2.2-数据规范与导入导出规范计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/开发计划/04-WBS-L2-WBS-2.2-数据规范与导入导出规范计划.md)
17. [05-WBS-L2-WBS-3.1-知识库主视图增强计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/开发计划/05-WBS-L2-WBS-3.1-知识库主视图增强计划.md)
18. [06-WBS-L2-WBS-4.1-关系图工作台计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/开发计划/06-WBS-L2-WBS-4.1-关系图工作台计划.md)
19. [07-WBS-L2-WBS-5.1-多轨编排视图计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/开发计划/07-WBS-L2-WBS-5.1-多轨编排视图计划.md)
20. [08-WBS-L2-WBS-6.1-观察输出层计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/开发计划/08-WBS-L2-WBS-6.1-观察输出层计划.md)
21. [2026-03-30-小说剧情管理器设计稿.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/设计稿/2026-03-30-小说剧情管理器设计稿.md)
22. GitHub Project Roadmap: <https://github.com/users/wgwtest/projects/3>

## 协作规则

1. 先读最新稳定计划和设计稿，再进入实现。
2. 稳定计划按 WBS 节点命名，不使用“当前阶段计划”作为稳定文件名。
3. 用户未明确验收前，阶段状态只记为 `待人工验收` 或 `待用户确认`。
4. 验收、自测、交接文档分别进入固定目录，不散落在文档根。
5. GitHub Project 如存在父子结构，必须优先按 WBS 树组织，不使用扁平 issue 列表代替分解关系。
6. 信息架构、原型、技术选型、任务拆解都应先在 `WBS 1` 收敛，再进入实现节点。
7. 如果用户已在聊天或文稿评阅中明确判定“通过”，必须同步更新 Project、issue 契约和本地状态文本，不允许只改一层。

## 目录说明

1. `设计稿/`：稳定设计文档
2. `契约草案/`：执行契约与任务草案
3. `开发计划/`：详细实施计划与历史计划归档
4. `自测报告/`：实现后的验证记录
5. `会话交接/`：多轮会话交接记录
6. `验收清单/`：人工验收清单
7. `验收记录/`：人工验收过程记录
8. `验收结论/`：阶段验收结论
