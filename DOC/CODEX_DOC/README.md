# NovelStoryManager 文档索引

## 当前状态

1. 当前活动文档根：`DOC/CODEX_DOC/`
2. 当前活动链路：`WBS 0 -> WBS 1 -> WBS 1.7 -> WBS 1.7.2`
3. 当前阶段状态：`WBS 1.7 已按最新评论切换为 Pencil + Codex 直接协同设计路线，开发中；WBS 1.7.1 已完成人工验收；WBS 1.7.2 已根据 issue #43 最新评阅收束为四张核心工作面，并完成原稿、导出图、GitHub issue 和任务树同步，待人工验收；WBS 1.8 方案待人工验收；WBS 1.8.1 已自测通过待人工验收；WBS 1.8.2 已完成拖拽稳定性、动态连线与端口高亮提示自测，待人工验收；WBS 3.1 仍待人工验收`
4. 当前主线目标：维持 `WBS 1.7.2` 四张核心工作面与 `WBS 4` 视图树同步结果，等待人工验收
5. GitHub Project：<https://github.com/users/wgwtest/projects/3>

## 文档组织原则

1. `CODEX_DOC` 根目录只保留索引与核心配置文档：`README.md`、`00-本地工程策略映射.md`
2. `01_需求分析/` 用于产品边界、总体分析和需求收敛
3. `02_设计说明/` 平铺存放总体设计、信息架构、原型、交互验证和技术方案正文
4. `03_研制计划/` 用于平铺存放每个 `WBS` 节点的单一计划文档
5. `04_研发文档/` 用于数据结构、导入导出规范、关键业务流程文档和原型稿归档
6. `05_测试文档/` 用于自测报告、验收清单、验收记录和验收结论
7. `06_过程文档/` 用于会话交接等过程性归档

## Project 树读取规则

1. 根节点使用 `WBS 0` 总纲 issue 承载整体研发路线
2. 一级模块使用 `WBS 1` 到 `WBS 7` 父 issue 承载并列能力分块
3. `WBS 3` 固定用于多视图共性机制，`WBS 4` 固定用于视图设计，再下挂知识库、关系图、多轨三个执行分支
4. 可直接执行的实现任务使用叶子 issue，挂在对应父节点下
5. 只有不存在稳定父子关系的任务，才允许在同层并列
6. 父节点与叶子节点名称都应概括、易懂，避免使用信息量不足的抽象词

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
6. 数据规范、文件规范、导入导出类 issue 的 `成果物` 必须至少包含 1 个小型但字段覆盖尽量全面的样例数据文件
7. 数据规范、文件规范、导入导出类 issue 的 `验收方法` 必须至少覆盖：正样例、反样例、往返一致性测试
8. 用户人工验收清单只保留用户可观察动作和文档核验动作，不再写入读代码动作或 `npm` 命令
9. 开发者命令验证、单元测试、构建结果统一进入 `01_自测报告/`
10. 不再使用空泛的 `验收入口 / 验收标准` 组合

## 命名约束

1. `CODEX_DOC` 一级目录使用固定顺序前缀：`01_` 到 `06_`
2. 已存在二级目录的分类目录，同样使用固定顺序前缀
3. 文件名保持业务语义，不因目录编号而重复追加序号
4. 后续新增同层目录时，必须先确认顺序位再创建目录
5. 如果在已稳定序列中插入补充节点，为避免大面积历史链接失效，可在前一序号后追加字母后缀，例如 `08A-WBS-...`
6. `02_设计说明/` 下的稳定设计正文默认以 `WBS-节点编号-主题.md` 命名，不在文件名前保留日期
7. 无法直接归属具体节点的总设计稿，也应优先挂到最贴近的 `WBS` 编号下，避免同层出现“日期稿”和 `WBS` 稿并存

## 文档分工规则

1. `03_研制计划/` 采用“一节点一文档”规则，每个节点文档都要写清前置条件、后续节点、工作目标、工作内容、实施方式、成果物、时间安排和验收方法
2. `01_需求分析/` 用于收敛产品边界、需求约束和总体分析
3. `02_设计说明/` 平铺存放界面结构、交互方案、原型验证和技术选型等稳定设计正文，不为单文件主题额外套子目录
4. `04_研发文档/` 用于数据规范、关键业务流程、导入导出规范和原型稿等研发正文
5. `06_过程文档/02_历史计划/` 用于归档旧版详细实施计划或拆分前文档，不再占用当前计划主目录
6. `06_过程文档/03_验收意见处理/` 用于存放验收意见归类、原因判断和计划重排分析
7. 对强交互工作台，技术方案选型必须以后续原型目标和交互验证为输入，不允许绕过原型直接冻结交互栈
8. 多视图分支必须先经过 `WBS 3` 共性层，再进入 `WBS 4` 视图设计下各自的“要素设计 / 能力验证 / 功能验证 / 样式验证”
9. 当某个 `WBS` 节点的主要价值是“规范本身”时，应优先把 `研发文档/` 下的规范正文作为主要成果物，而不是只保留抽象 issue 标题

## 阅读顺序

1. [00-本地工程策略映射.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/00-本地工程策略映射.md)
2. [00-工程总体分析.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/01_需求分析/00-工程总体分析.md)
3. [WBS-1.1-小说剧情管理器设计稿.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/02_设计说明/WBS-1.1-小说剧情管理器设计稿.md)
4. [01-WBS-0-NovelStoryManager-研发总纲-研制计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/03_研制计划/01-WBS-0-NovelStoryManager-研发总纲-研制计划.md)
5. [02-WBS-1-需求与方案-研制计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/03_研制计划/02-WBS-1-需求与方案-研制计划.md)
6. [03-WBS-1.1-产品边界确认与文档归档-研制计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/03_研制计划/03-WBS-1.1-产品边界确认与文档归档-研制计划.md)
7. [WBS-1.2-信息架构与页面分解.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/02_设计说明/WBS-1.2-信息架构与页面分解.md)
8. [04-WBS-1.2-信息架构与页面分解-研制计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/03_研制计划/04-WBS-1.2-信息架构与页面分解-研制计划.md)
9. [WBS-1.3-低保真原型设计.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/02_设计说明/WBS-1.3-低保真原型设计.md)
10. [05-WBS-1.3-低保真原型设计-研制计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/03_研制计划/05-WBS-1.3-低保真原型设计-研制计划.md)
11. [WBS-1.4-高风险交互原型验证.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/02_设计说明/WBS-1.4-高风险交互原型验证.md)
12. [06-WBS-1.4-高风险交互原型验证-研制计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/03_研制计划/06-WBS-1.4-高风险交互原型验证-研制计划.md)
13. [WBS-1.5-技术方案选型.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/02_设计说明/WBS-1.5-技术方案选型.md)
14. [07-WBS-1.5-技术方案选型-研制计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/03_研制计划/07-WBS-1.5-技术方案选型-研制计划.md)
15. [08-WBS-1.6-初始任务拆解与时间规划-研制计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/03_研制计划/08-WBS-1.6-初始任务拆解与时间规划-研制计划.md)
16. [WBS-1.7-中高保真原型设计与生成方案.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/02_设计说明/WBS-1.7-中高保真原型设计与生成方案.md)
17. [08A-WBS-1.7-中高保真原型设计与生成方案-研制计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/03_研制计划/08A-WBS-1.7-中高保真原型设计与生成方案-研制计划.md)
18. [WBS-1.7.1-中高保真原型草稿方案细化.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/02_设计说明/WBS-1.7.1-中高保真原型草稿方案细化.md)
19. [08A1-WBS-1.7.1-中高保真原型草稿方案细化-研制计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/03_研制计划/08A1-WBS-1.7.1-中高保真原型草稿方案细化-研制计划.md)
20. [WBS-1.7.2-Pencil截面图与页面设计稿说明.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/02_设计说明/WBS-1.7.2-Pencil截面图与页面设计稿说明.md)
21. [08A2-WBS-1.7.2-Pencil截面图与页面设计稿-研制计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/03_研制计划/08A2-WBS-1.7.2-Pencil截面图与页面设计稿-研制计划.md)
22. [WBS-1.8-BaseLab验证工具构建方案.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/02_设计说明/WBS-1.8-BaseLab验证工具构建方案.md)
23. [08B-WBS-1.8-BaseLab验证工具构建方案-研制计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/03_研制计划/08B-WBS-1.8-BaseLab验证工具构建方案-研制计划.md)
24. [08C-WBS-1.8.1-BaseLab独立应用底座-研制计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/03_研制计划/08C-WBS-1.8.1-BaseLab独立应用底座-研制计划.md)
25. [08D-WBS-1.8.2-WBS-3.1实验迁移与入口解耦-研制计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/03_研制计划/08D-WBS-1.8.2-WBS-3.1实验迁移与入口解耦-研制计划.md)
26. [10-WBS-2.1-项目底座实施-研制计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/03_研制计划/10-WBS-2.1-项目底座实施-研制计划.md)
27. [2026-04-02-WBS-2.2-项目数据规范与导入导出规范.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/04_研发文档/01_数据规范/2026-04-02-WBS-2.2-项目数据规范与导入导出规范.md)
28. [11-WBS-2.2-数据规范与导入导出规范-研制计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/03_研制计划/11-WBS-2.2-数据规范与导入导出规范-研制计划.md)
29. [12-WBS-3-多视图共性机制-研制计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/03_研制计划/12-WBS-3-多视图共性机制-研制计划.md)
30. [13-WBS-3.1-交互画布与渲染基座选型-研制计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/03_研制计划/13-WBS-3.1-交互画布与渲染基座选型-研制计划.md)
31. [17-WBS-4-视图设计-研制计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/03_研制计划/17-WBS-4-视图设计-研制计划.md)
32. [17A-WBS-4.1-知识库视图设计-研制计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/03_研制计划/17A-WBS-4.1-知识库视图设计-研制计划.md)
33. [22-WBS-4.2-关系图视图设计-研制计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/03_研制计划/22-WBS-4.2-关系图视图设计-研制计划.md)
34. [27-WBS-4.3-多轨编排视图设计-研制计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/03_研制计划/27-WBS-4.3-多轨编排视图设计-研制计划.md)
35. [32-WBS-7-观察输出层-研制计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/03_研制计划/32-WBS-7-观察输出层-研制计划.md)
36. [2026-04-03-010206-验收意见与计划重排分析.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/06_过程文档/03_验收意见处理/2026-04-03-010206-验收意见与计划重排分析.md)
37. [2026-04-03-094110-GitHub评论优化分析.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/06_过程文档/03_验收意见处理/2026-04-03-094110-GitHub评论优化分析.md)
38. [2026-04-03-142806-WBS-3.1-BaseLab工具化评论处理.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/06_过程文档/03_验收意见处理/2026-04-03-142806-WBS-3.1-BaseLab工具化评论处理.md)
39. [2026-04-03-153822-WBS-1.8-子节点拆分与实施启动分析.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/06_过程文档/03_验收意见处理/2026-04-03-153822-WBS-1.8-子节点拆分与实施启动分析.md)
40. [2026-04-03-171351-WBS-1.8.2-拖拽与动态连线验收意见处理.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/06_过程文档/03_验收意见处理/2026-04-03-171351-WBS-1.8.2-拖拽与动态连线验收意见处理.md)
41. [2026-04-03-172623-WBS-1.8.2-拖拽与动态连线修正交接.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/06_过程文档/01_会话交接/2026-04-03-172623-WBS-1.8.2-拖拽与动态连线修正交接.md)
42. [2026-04-03-223557-WBS-1.7-Pencil设计稿建议分析.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/06_过程文档/03_验收意见处理/2026-04-03-223557-WBS-1.7-Pencil设计稿建议分析.md)
43. [2026-04-04-003541-WBS-1.7-口述评论转写与Pencil直设路线分析.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/06_过程文档/03_验收意见处理/2026-04-04-003541-WBS-1.7-口述评论转写与Pencil直设路线分析.md)
44. GitHub Project Roadmap: <https://github.com/users/wgwtest/projects/3>

## 协作规则

1. 先读 `00-本地工程策略映射.md`，再读与当前任务相关的 `01_需求分析/`、`02_设计说明/`、`03_研制计划/`
2. 稳定计划按 WBS 节点命名，不使用“当前阶段计划”作为稳定文件名
3. 用户未明确验收前，阶段状态只记为 `待人工验收` 或 `待用户确认`
4. 验收、自测、交接文档分别进入固定目录，不散落在文档根
5. GitHub Project 如存在父子结构，必须优先按 WBS 树组织，不使用扁平 issue 列表代替分解关系
6. 信息架构、原型、技术选型、任务拆解都应先在 `WBS 1` 收敛，再进入实现节点
7. 如果用户已在聊天或文稿评阅中明确判定“通过”，必须同步更新 Project、issue 契约和本地状态文本，不允许只改一层
8. 默认直接在 `main` 分支推进和提交；只有用户明确要求隔离分支，或当前改动需要高风险隔离试验时，才建立功能分支
9. GitHub Issue / Project 中引用仓库文件时，只写仓库相对路径；本地目录结构一旦调整，必须同轮同步这些路径，不保留旧目录名或 `/home/...` 绝对路径
10. 收到验收批注意见后，必须先形成 `06_过程文档/03_验收意见处理/` 文档，再决定改计划还是改代码
11. 已验收节点如因新增评阅意见需要补子节点，优先新增补充节点，不回改已稳定节点编号

## 目录说明

1. 文档根：`README.md`、`00-本地工程策略映射.md`
2. `01_需求分析/`：需求边界、总体分析、需求收敛文档
3. `02_设计说明/`：直接存放总体设计、信息架构、原型设计、交互验证、技术方案等设计正文
4. `03_研制计划/`：平铺的 `WBS` 节点文档，一节点一文件，文件名统一以 `-研制计划.md` 结尾
5. `04_研发文档/`：当前下设 `01_数据规范/`、`03_原型图/`，后续可按稳定主题继续扩展
6. `05_测试文档/`：下设 `01_自测报告/`、`02_验收清单/`、`03_验收记录/`、`04_验收结论/`
7. `06_过程文档/`：当前下设 `01_会话交接/`、`02_历史计划/`、`03_验收意见处理/`
