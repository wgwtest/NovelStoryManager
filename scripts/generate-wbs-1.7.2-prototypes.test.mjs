import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const EXPECTED_PAGE_FILES = [
  "01-总工作台总览.pen",
  "02-知识库页.pen",
  "03-关系图页.pen",
  "04-轨道页.pen",
  "05-对象库与检查器.pen",
  "方案说明.md"
];

const EXPECTED_SUITES = [
  {
    directory: "01_卷宗案台型",
    name: "卷宗案台型",
    markers: ["卷宗目录", "字段矩阵", "记录详情抽屉"]
  },
  {
    directory: "02_筹划墙型",
    name: "筹划墙型",
    markers: ["筹划墙画布", "灵感便签", "素材归堆区"]
  },
  {
    directory: "03_蓝图推演型",
    name: "蓝图推演型",
    markers: ["蓝图总线", "推演节点", "端口规则板"]
  },
  {
    directory: "04_剪辑编排型",
    name: "剪辑编排型",
    markers: ["编排时间尺", "轨道头矩阵", "待排事件篮"]
  },
  {
    directory: "05_总控指挥型",
    name: "总控指挥型",
    markers: ["全局覆盖总览", "联动监视窗", "输出切片指挥板"]
  }
];

test("generatePrototypeAssets creates five WBS 1.7.2 suite folders with complete Pencil sources", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "novelstory-wbs-1.7.2-"));
  const {
    PAGE_DEFINITIONS,
    SUITE_DEFINITIONS,
    generatePrototypeAssets
  } = await import(new URL("./generate-wbs-1.7.2-prototypes.mjs", import.meta.url));

  assert.equal(SUITE_DEFINITIONS.length, 5);
  assert.equal(PAGE_DEFINITIONS.length, 5);
  assert.deepEqual(
    SUITE_DEFINITIONS.map((suite) => ({
      directory: suite.directory,
      name: suite.name
    })),
    EXPECTED_SUITES.map((suite) => ({
      directory: suite.directory,
      name: suite.name
    }))
  );

  await generatePrototypeAssets({
    outputRoot: tempDir
  });

  for (const suite of EXPECTED_SUITES) {
    const suiteDir = path.join(tempDir, suite.directory);
    const files = await readdir(suiteDir);

    assert.deepEqual(files.sort(), EXPECTED_PAGE_FILES);

    const overviewRaw = await readFile(path.join(suiteDir, "01-总工作台总览.pen"), "utf8");
    const overview = JSON.parse(overviewRaw);
    const topFrame = overview.children[0];

    assert.equal(overview.version, "2.10");
    assert.equal(overview.children.length, 1);
    assert.match(topFrame.name, /总工作台总览/);

    const serialized = JSON.stringify(topFrame);
    assert.match(serialized, /知识编辑器/);
    assert.match(serialized, /对象库/);
    assert.match(serialized, /检查器/);
    assert.match(serialized, /知识库/);
    assert.match(serialized, /关系图/);
    assert.match(serialized, /轨道/);
    for (const marker of suite.markers) {
      assert.match(serialized, new RegExp(marker));
    }

    const noteRaw = await readFile(path.join(suiteDir, "方案说明.md"), "utf8");
    assert.match(noteRaw, new RegExp(suite.name));
    assert.match(noteRaw, /知识编辑器/);
    assert.match(noteRaw, /青云劫火录/);
    for (const marker of suite.markers) {
      assert.match(noteRaw, new RegExp(marker));
    }
  }
});

test("default output root resolves to the readable WBS 1.7.2 prototype directory", async () => {
  const { resolveDefaultOutputRoot } = await import(
    new URL("./generate-wbs-1.7.2-prototypes.mjs", import.meta.url)
  );

  assert.match(resolveDefaultOutputRoot(), /DOC\/CODEX_DOC\/04_研发文档\/03_原型图\/WBS-1\.7\.2\/?$/);
});
