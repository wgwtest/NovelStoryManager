# NovelStoryManager 文档索引

## 当前状态

1. 当前活动文档根：`DOC/CODEX_DOC/`
2. 当前活动链路：`WBS 0 -> WBS 2 -> WBS 2.1`
3. 当前阶段状态：`待用户确认`
4. 当前主线目标：以 `#8 -> #10 -> #2` 为主线推进 M1 项目底座实施
5. GitHub Project：<https://github.com/users/wgwtest/projects/3>

## Project 树读取规则

1. 根节点使用 `WBS 0` 总纲 issue 承载整体研发路线
2. 一级模块使用 `WBS 1` 到 `WBS 6` 父 issue 承载并列能力分块
3. 可直接执行的实现任务使用叶子 issue，挂在对应父节点下
4. 只有不存在稳定父子关系的任务，才允许在同层并列

## 阅读顺序

1. [00-本地工程策略映射.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/00-本地工程策略映射.md)
2. [00-工程总体分析.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/00-工程总体分析.md)
3. [01-WBS-L0-NovelStoryManager-研发总纲.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/01-WBS-L0-NovelStoryManager-研发总纲.md)
4. [02-WBS-L1-WBS-1.1-项目启动与M1前置规划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/02-WBS-L1-WBS-1.1-项目启动与M1前置规划.md)
5. [2026-03-30-小说剧情管理器设计稿.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/设计稿/2026-03-30-小说剧情管理器设计稿.md)
6. [03-WBS-L2-WBS-2.1-M1-项目底座实施计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/开发计划/03-WBS-L2-WBS-2.1-M1-项目底座实施计划.md)
7. GitHub Project Roadmap: <https://github.com/users/wgwtest/projects/3>

## 协作规则

1. 先读最新稳定计划和设计稿，再进入实现。
2. 稳定计划按 WBS 节点命名，不使用“当前阶段计划”作为稳定文件名。
3. 里程碑 `M1 / M2 / M3 / M4` 仅作为验证门，不作为顶层分解轴。
4. 用户未明确验收前，阶段状态只记为 `待人工验收` 或 `待用户确认`。
5. 验收、自测、交接文档分别进入固定目录，不散落在文档根。
6. GitHub Project 如存在父子结构，必须优先按 WBS 树组织，不使用扁平 issue 列表代替分解关系。

## 目录说明

1. `设计稿/`：稳定设计文档
2. `契约草案/`：执行契约与任务草案
3. `开发计划/`：详细实施计划与历史计划归档
4. `自测报告/`：实现后的验证记录
5. `会话交接/`：多轮会话交接记录
6. `验收清单/`：人工验收清单
7. `验收记录/`：人工验收过程记录
8. `验收结论/`：阶段验收结论
