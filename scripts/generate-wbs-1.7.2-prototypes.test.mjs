import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, readdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const EXPECTED_WORKSPACES = [
  {
    fileStem: "01-卷宗工作面",
    name: "卷宗工作面",
    markers: ["卷宗目录", "卷宗摘要", "对象审校"]
  },
  {
    fileStem: "02-蓝图推演工作面",
    name: "蓝图推演工作面",
    markers: ["蓝图总线", "推演节点", "依赖回路"]
  },
  {
    fileStem: "03-剪辑编排工作面",
    name: "剪辑编排工作面",
    markers: ["编排时间尺", "片段篮", "编排层"]
  },
  {
    fileStem: "04-场景调度工作面",
    name: "场景调度工作面",
    markers: ["场景舞台图", "地点调度", "空间切换"]
  }
];

test("generatePrototypeAssets creates four flat WBS 1.7.2 source bundles at the root", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "novelstory-wbs-1.7.2-"));
  const { SUITE_DEFINITIONS, generatePrototypeAssets } = await import(
    new URL("./generate-wbs-1.7.2-prototypes.mjs", import.meta.url)
  );

  assert.equal(SUITE_DEFINITIONS.length, 4);
  assert.deepEqual(
    SUITE_DEFINITIONS.map((suite) => ({
      fileStem: suite.fileStem,
      name: suite.name
    })),
    EXPECTED_WORKSPACES.map((suite) => ({
      fileStem: suite.fileStem,
      name: suite.name
    }))
  );

  await generatePrototypeAssets({
    outputRoot: tempDir
  });

  const rootEntries = await readdir(tempDir);
  assert.deepEqual(
    rootEntries.sort(),
    EXPECTED_WORKSPACES.flatMap((suite) => [
      `${suite.fileStem}.pen`,
      `${suite.fileStem}-方案说明.md`
    ]).sort()
  );

  for (const suite of EXPECTED_WORKSPACES) {
    const workspaceRaw = await readFile(path.join(tempDir, `${suite.fileStem}.pen`), "utf8");
    const workspaceDoc = JSON.parse(workspaceRaw);
    const topFrame = workspaceDoc.children[0];
    const serialized = JSON.stringify(topFrame);

    assert.equal(workspaceDoc.version, "2.10");
    assert.equal(workspaceDoc.children.length, 1);
    assert.equal(topFrame.name, suite.name);
    assert.match(serialized, /知识编辑器/);
    assert.match(serialized, /对象库/);
    assert.match(serialized, /检查器/);

    for (const label of ["卷宗", "蓝图推演", "剪辑编排", "场景调度"]) {
      assert.match(serialized, new RegExp(label));
    }

    for (const oldLabel of ["知识库", "关系图", "轨道"]) {
      assert.doesNotMatch(serialized, new RegExp(oldLabel));
    }

    for (const marker of suite.markers) {
      assert.match(serialized, new RegExp(marker));
    }

    const noteRaw = await readFile(path.join(tempDir, `${suite.fileStem}-方案说明.md`), "utf8");
    assert.match(noteRaw, new RegExp(suite.name));
    assert.match(noteRaw, /当前只保留 1 张核心图/);
    assert.match(noteRaw, /知识编辑器/);
    for (const marker of suite.markers) {
      assert.match(noteRaw, new RegExp(marker));
    }
  }
});

test("generatePrototypeAssets preserves root-level companion docs while replacing generated prototype assets", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "novelstory-wbs-1.7.2-preserve-"));
  const { generatePrototypeAssets } = await import(
    new URL("./generate-wbs-1.7.2-prototypes.mjs", import.meta.url)
  );
  const guidePath = path.join(tempDir, "WBS-1.7.2-原型稿执行说明.md");
  const legacyDir = path.join(tempDir, "99_遗留方案");
  const stalePen = path.join(tempDir, "01-卷宗工作面.pen");
  const stalePng = path.join(tempDir, "01-卷宗工作面.png");

  await writeFile(guidePath, "# keep\n", "utf8");
  await mkdir(legacyDir, {
    recursive: true
  });
  await writeFile(path.join(legacyDir, "stale.pen"), "{}", "utf8");
  await writeFile(stalePen, "{}\n", "utf8");
  await writeFile(stalePng, "old-png\n", "utf8");

  await generatePrototypeAssets({
    outputRoot: tempDir
  });

  assert.equal(await readFile(guidePath, "utf8"), "# keep\n");

  const rootEntries = await readdir(tempDir);
  assert(rootEntries.includes("WBS-1.7.2-原型稿执行说明.md"));
  assert(!rootEntries.includes("99_遗留方案"));
  assert(rootEntries.includes("01-卷宗工作面.pen"));
  assert(!rootEntries.includes("01-卷宗工作面.png"));
});

test("default output root resolves to the readable WBS 1.7.2 prototype directory", async () => {
  const { resolveDefaultOutputRoot } = await import(
    new URL("./generate-wbs-1.7.2-prototypes.mjs", import.meta.url)
  );

  assert.match(resolveDefaultOutputRoot(), /DOC\/CODEX_DOC\/04_研发文档\/03_原型图\/WBS-1\.7\.2\/?$/);
});
