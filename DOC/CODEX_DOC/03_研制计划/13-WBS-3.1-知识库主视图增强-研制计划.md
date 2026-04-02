# WBS 3.1 知识库主视图增强

## 基本信息

- `WBS` 编号：`WBS 3.1`
- 上级节点：`WBS 3`
- 当前状态：`待人工验收`

## 前置条件

- `WBS 2.1` 已完成知识库基础壳层和对象库侧栏。

## 后续节点

- `WBS 6.1` 观察输出层

## 工作目标

- 让知识库主视图从“能打开”升级到“能筛选、能分组编辑、能引用跳转”的可用状态。

## 工作内容

- 增加对象类型切换与筛选。
- 为检查器提供 `Core Fields / References` 分组展示。
- 支持从引用字段跳转到目标对象并切换当前类型。
- 补齐前端测试与回归用例。

## 实施方式

- 按“类型筛选 -> 检查器字段分组 -> 对象引用跳转 -> 回归测试”的顺序实施。
- 历史细化计划已归档到 [05-WBS-L2-WBS-3.1-知识库主视图增强计划.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/06_过程文档/02_历史计划/05-WBS-L2-WBS-3.1-知识库主视图增强计划.md)。

## 成果物

- `apps/web/src/components/ObjectLibrary.tsx`
- `apps/web/src/components/KnowledgeView.tsx`
- `apps/web/src/components/ObjectInspector.tsx`
- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `apps/web/src/styles.css`
- 本文件

## 时间安排

- 当前以 GitHub Project 中的 `Start Date` 与 `Target Date` 为准。

## 验收方法

- 运行 `npm run test --workspace @novelstory/web`，预期退出码为 `0`。
- 运行 `npm run typecheck`、`npm run test`、`npm run build`，预期退出码均为 `0`。
- 启动前端后，人工核验可以按对象类型切换并筛选，详情区具备 `Core Fields / References` 分组展示，并可从角色对象点击引用跳转到目标对象。

## 证据链接

- [2026-04-02-160046-WBS-3.1-知识库主视图增强验收清单.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/05_测试文档/02_验收清单/2026-04-02-160046-WBS-3.1-知识库主视图增强验收清单.md)
- [2026-04-02-160046-WBS-3.1-知识库主视图增强自测.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/05_测试文档/01_自测报告/2026-04-02-160046-WBS-3.1-知识库主视图增强自测.md)
- [2026-04-02-160046-WBS-3.1-知识库主视图增强交接.md](/home/wgw/CodexProject/NovelStoryManager/DOC/CODEX_DOC/06_过程文档/01_会话交接/2026-04-02-160046-WBS-3.1-知识库主视图增强交接.md)
