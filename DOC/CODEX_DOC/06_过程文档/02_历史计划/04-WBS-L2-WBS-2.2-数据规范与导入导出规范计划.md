# WBS 2.2 数据规范与导入导出规范计划

## 目标

把 `WBS 2.1` 已完成的多文件项目底座，收紧成一套可被外部结构化数据稳定对接的数据规范与导入导出规范，并用硬测试锁住规范边界。

## 本节点必须交付的成果物

1. 规范正文：
   - `DOC/CODEX_DOC/04_研发文档/01_数据规范/2026-04-02-WBS-2.2-项目数据规范与导入导出规范.md`
2. 规范实现：
   - `packages/schema/src/index.ts`
   - `apps/service/src/lib/project-store.ts`
   - `apps/service/src/app.ts`
3. 自动化测试：
   - `packages/schema/src/index.test.ts`
   - `apps/service/src/app.test.ts`
4. 测试夹具：
   - `fixtures/import-export/project-bundles/valid-sample-project.json`
   - `fixtures/import-export/project-bundles/invalid-missing-manifest.json`
   - `fixtures/import-export/project-bundles/invalid-broken-reference.json`
   - `fixtures/import-export/project-bundles/invalid-unsupported-version.json`
   - `fixtures/import-export/object-batches/valid-character-batch.json`
   - `fixtures/import-export/object-batches/invalid-missing-dependency.json`

## 实施分块

### A. 规范正文落盘

1. 固定内部项目目录结构。
2. 固定项目级 bundle 结构。
3. 固定对象级 bundle 结构。
4. 固定版本字段和失败规则。

### B. Schema 层实现

1. 为项目级 bundle 增加独立 schema。
2. 为对象级 bundle 增加独立 schema。
3. 补充对象唯一性和引用一致性校验。
4. 输出稳定的解析入口，供 service 层复用。

### C. Service 层实现

1. 支持“项目目录 -> 项目级 bundle”导出。
2. 支持“项目级 bundle -> 项目目录”导入。
3. 支持“对象级 bundle -> 目标项目”导入校验。
4. 保持对象事实与视图状态分文件存储，不把 bundle 结构直接当内部真源。

### D. 夹具与回归测试

1. 为项目级 bundle 提供至少 1 个正样例、3 个反样例。
2. 为对象级 bundle 提供至少 1 个正样例、1 个反样例。
3. 为服务层提供至少 1 条项目往返一致性测试。
4. 为服务层提供至少 1 条对象级导入失败测试。

## 强制测试矩阵

1. 正样例解析：
   - `valid-sample-project.json` 能通过 schema 校验。
2. 缺字段失败：
   - `invalid-missing-manifest.json` 必须因为根字段缺失而失败。
3. 坏引用失败：
   - `invalid-broken-reference.json` 必须因为坏引用而失败。
4. 版本不兼容失败：
   - `invalid-unsupported-version.json` 必须因为版本不受支持而失败。
5. 对象级依赖缺失失败：
   - `invalid-missing-dependency.json` 必须因为 batch 引用未满足而失败。
6. 项目往返一致性：
   - 样例项目目录导出为项目级 bundle，再重新导入到临时目录，再次导出后，应保持语义一致。
7. 对象级导入边界：
   - 对象级 bundle 只能改动声明的对象集合，不得顺手写入未声明集合。

## 验证命令

1. `npm run test --workspace @novelstory/schema`
2. `npm run test --workspace @novelstory/service`
3. `npm run test`

预期：

1. 上述命令全部退出码为 `0`。
2. schema 测试报告中可见正样例、反样例和版本失败用例。
3. service 测试报告中可见至少 1 条往返一致性测试。

## 非目标

1. 不在本节点实现 Graph / Tracks 的交互细节。
2. 不在本节点实现章节观察输出。
3. 不在本节点实现自动迁移旧版本项目。
