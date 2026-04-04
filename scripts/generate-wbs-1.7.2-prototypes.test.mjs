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

const EXPECTED_PAGE_LEADS = {
  overview: "总工作台先回答“当前世界模型覆盖到哪里”。",
  knowledge: "知识库页只负责结构化真值和规格化字段，不承接正文写作。",
  graph: "关系图页强调对象、事件与线索的依赖流向和因果链。",
  tracks: "轨道页强调多时间线、多空间线和观察切片的并行排布。",
  focus: "对象库与检查器页强调左侧对象导航和右侧详情联动，而不是中区炫技。"
};

const EXPECTED_SUITES = [
  {
    directory: "01_卷宗案台型",
    name: "卷宗案台型",
    markers: ["卷宗目录", "字段矩阵", "记录详情抽屉"]
  },
  {
    directory: "02_档案阅览型",
    name: "档案阅览型",
    markers: ["档案索引架", "引文页框", "参考脚注列"]
  },
  {
    directory: "03_蓝图推演型",
    name: "蓝图推演型",
    markers: ["蓝图总线", "推演节点", "端口规则板"]
  },
  {
    directory: "04_剧情弧矩阵型",
    name: "剧情弧矩阵型",
    markers: ["剧情弧矩阵", "角色交叉轴", "事件覆盖格"]
  },
  {
    directory: "05_剪辑编排型",
    name: "剪辑编排型",
    markers: ["编排时间尺", "轨道头矩阵", "待排事件篮"]
  },
  {
    directory: "06_场景调度型",
    name: "场景调度型",
    markers: ["场景舞台图", "地点调度层", "空间切换条"]
  },
  {
    directory: "07_双镜对读型",
    name: "双镜对读型",
    markers: ["双镜对读台", "左右对照窗", "差异摘要带"]
  },
  {
    directory: "08_切片汇编型",
    name: "切片汇编型",
    markers: ["切片汇编台", "片段编排列", "输出装配栏"]
  }
];

test("generatePrototypeAssets creates eight WBS 1.7.2 suite folders with complete Pencil sources", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "novelstory-wbs-1.7.2-"));
  const {
    PAGE_DEFINITIONS,
    SUITE_DEFINITIONS,
    generatePrototypeAssets
  } = await import(new URL("./generate-wbs-1.7.2-prototypes.mjs", import.meta.url));

  assert.equal(SUITE_DEFINITIONS.length, 8);
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

    const pageNames = [];

    for (const page of PAGE_DEFINITIONS) {
      const pageRaw = await readFile(path.join(suiteDir, page.fileName), "utf8");
      const pageDoc = JSON.parse(pageRaw);
      const topFrame = pageDoc.children[0];
      const serialized = JSON.stringify(topFrame);

      assert.equal(pageDoc.version, "2.10");
      assert.equal(pageDoc.children.length, 1);
      assert.equal(topFrame.name, page.title);
      assert.match(serialized, /知识编辑器/);
      assert.match(serialized, /对象库/);
      assert.match(serialized, /检查器/);
      assert.match(serialized, /知识库/);
      assert.match(serialized, /关系图/);
      assert.match(serialized, /轨道/);
      assert.match(serialized, new RegExp(EXPECTED_PAGE_LEADS[page.key]));
      pageNames.push(topFrame.name);
    }

    assert.equal(new Set(pageNames).size, PAGE_DEFINITIONS.length);

    const overviewRaw = await readFile(path.join(suiteDir, "01-总工作台总览.pen"), "utf8");
    const overview = JSON.parse(overviewRaw);
    const overviewSerialized = JSON.stringify(overview.children[0]);
    for (const marker of suite.markers) {
      assert.match(overviewSerialized, new RegExp(marker));
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
