import assert from "node:assert/strict";
import { access, mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

test("collectExportJobs finds .pen files and maps them to same-directory png targets", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "novelstory-wbs-1.7.2-export-"));
  const suiteDir = path.join(tempDir, "01_编目工作台型");

  await mkdir(suiteDir, {
    recursive: true
  });
  await writeFile(path.join(suiteDir, "01-总工作台总览.pen"), "{\n  \"version\": \"2.10\",\n  \"children\": []\n}\n", "utf8");
  await writeFile(path.join(suiteDir, "02-知识库页.pen"), "{\n  \"version\": \"2.10\",\n  \"children\": []\n}\n", "utf8");
  await writeFile(path.join(suiteDir, "方案说明.md"), "# note\n", "utf8");

  const { collectExportJobs } = await import(
    new URL("./export-wbs-1.7.2-prototypes.mjs", import.meta.url)
  );

  const jobs = await collectExportJobs(tempDir);

  assert.deepEqual(
    jobs.map((job) => path.basename(job.penPath)),
    ["01-总工作台总览.pen", "02-知识库页.pen"]
  );
  assert.deepEqual(
    jobs.map((job) => path.basename(job.pngPath)),
    ["01-总工作台总览.png", "02-知识库页.png"]
  );
});

test("replaceFileSafely copies source content into target and removes source", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "novelstory-wbs-1.7.2-move-"));
  const sourcePath = path.join(tempDir, "source.png");
  const targetDir = path.join(tempDir, "nested");
  const targetPath = path.join(targetDir, "target.png");

  await mkdir(targetDir, {
    recursive: true
  });
  await writeFile(sourcePath, "png-bytes\n", "utf8");

  const { replaceFileSafely } = await import(
    new URL("./export-wbs-1.7.2-prototypes.mjs", import.meta.url)
  );

  await replaceFileSafely(sourcePath, targetPath);

  await assert.doesNotReject(() => access(targetPath));
  await assert.rejects(() => access(sourcePath));
});
