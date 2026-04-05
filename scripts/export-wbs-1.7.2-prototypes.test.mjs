import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { access, mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);

async function inspectPngWithPython(pngPath) {
  const script = `
from PIL import Image
import json
import sys

img = Image.open(sys.argv[1]).convert("RGB")
points = []
for gy in range(6):
    for gx in range(8):
        x = int((gx + 0.5) * img.width / 8)
        y = int((gy + 0.5) * img.height / 6)
        points.append(img.getpixel((x, y)))

print(json.dumps({
    "width": img.width,
    "height": img.height,
    "uniqueColors": len(set(points)),
    "center": img.getpixel((img.width // 2, img.height // 2))
}))
`.trim();
  const { stdout } = await execFileAsync("python3", ["-c", script, pngPath]);

  return JSON.parse(stdout);
}

test("collectExportJobs finds .pen files and maps them to same-directory png targets", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "novelstory-wbs-1.7.2-export-"));
  await mkdir(tempDir, {
    recursive: true
  });
  await writeFile(path.join(tempDir, "01-总工作台总览.pen"), "{\n  \"version\": \"2.10\",\n  \"children\": []\n}\n", "utf8");
  await writeFile(path.join(tempDir, "02-知识库页.pen"), "{\n  \"version\": \"2.10\",\n  \"children\": []\n}\n", "utf8");
  await writeFile(path.join(tempDir, "02-知识库页-方案说明.md"), "# note\n", "utf8");

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

test("exportPrototypePngs outputs visually populated core workface screenshots", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "novelstory-wbs-1.7.2-render-"));
  const { generatePrototypeAssets } = await import(
    new URL("./generate-wbs-1.7.2-prototypes.mjs", import.meta.url)
  );
  const { exportPrototypePngs } = await import(
    new URL("./export-wbs-1.7.2-prototypes.mjs", import.meta.url)
  );

  await generatePrototypeAssets({
    outputRoot: tempDir
  });
  await exportPrototypePngs(tempDir);

  const pngPath = path.join(tempDir, "01-卷宗工作面.png");
  const stats = await inspectPngWithPython(pngPath);

  assert.equal(stats.width > 1000, true);
  assert.equal(stats.height > 600, true);
  assert.equal(stats.uniqueColors >= 4, true);
  assert.notDeepEqual(stats.center, [244, 247, 251]);
});
