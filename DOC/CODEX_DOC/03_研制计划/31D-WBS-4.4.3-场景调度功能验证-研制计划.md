# WBS 4.4.3 场景调度功能验证

## 基本信息

- `WBS` 编号：`WBS 4.4.3`
- 上级节点：`WBS 4.4`
- 当前状态：`待开发`

## 前置条件

- `WBS 4.4.2` 已完成场景调度基础能力验证。

## 后续节点

- `WBS 4.4.4` 场景调度样式验证
- `WBS 7` 观察输出层

## 工作目标

- 用完整场景验证场景调度工作面已经能承担地点组织、驻留对象管理和空间切换观察，而不是只通过单点能力测试。

## 工作内容

- 验证多地点、多场景切换和多对象驻留的完整业务路径。
- 验证对象库、场景调度页和检查器之间的数据联动。
- 验证保存、加载和示例项目回放。

## 实施方式

- 使用 `sample-novel` 项目中的地点、人物、事件样例做完整路径验证。
- 验证必须包含至少 1 个空间冲突样例和 1 个正常切换样例。

## 成果物

- `apps/web/src/components/StageView.tsx`
- `apps/web/src/lib/project-stage.ts`
- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `apps/web/src/styles.css`
- `fixtures/projects/sample-novel/objects/locations.json`

## 时间安排

- 当前以 GitHub Project 中的 `Start Date` 与 `Target Date` 为准。

## 验收方法

- 查看对应自测报告，确认已覆盖前端测试、构建结果和示例数据回放。
- 启动应用后，人工核验 `sample-novel` 中至少 1 条空间切换链路和 1 条冲突提示链路都可观察。
