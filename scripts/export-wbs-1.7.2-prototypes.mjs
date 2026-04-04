import { copyFile, mkdtemp, readdir, readFile, rm, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

import { resolveDefaultOutputRoot } from "./generate-wbs-1.7.2-prototypes.mjs";

const PENCIL_BIN = "/home/wgw/.npm-global/bin/pencil";

async function walkPenFiles(rootDir) {
  const entries = await readdir(rootDir, {
    withFileTypes: true
  });
  const penFiles = [];

  for (const entry of entries) {
    const entryPath = path.join(rootDir, entry.name);

    if (entry.isDirectory()) {
      penFiles.push(...(await walkPenFiles(entryPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".pen")) {
      penFiles.push(entryPath);
    }
  }

  return penFiles.sort();
}

export async function collectExportJobs(rootDir = resolveDefaultOutputRoot()) {
  const penFiles = await walkPenFiles(path.resolve(rootDir));

  return penFiles.map((penPath) => ({
    penPath,
    pngPath: penPath.replace(/\.pen$/u, ".png")
  }));
}

export async function replaceFileSafely(sourcePath, targetPath) {
  await rm(targetPath, {
    force: true
  });
  await copyFile(sourcePath, targetPath);
  await rm(sourcePath, {
    force: true
  });
}

async function readTopFrameId(penPath) {
  const raw = await readFile(penPath, "utf8");
  const doc = JSON.parse(raw);
  const topFrameId = doc.children?.[0]?.id;

  if (!topFrameId) {
    throw new Error(`No top-level frame id found in ${penPath}`);
  }

  return topFrameId;
}

async function runPencilExport(penPath, frameId, exportDir) {
  const commands = `export_nodes({ nodeIds: ["${frameId}"], outputDir: "${exportDir}" })\nexit()\n`;

  await new Promise((resolve, reject) => {
    const child = spawn(
      PENCIL_BIN,
      ["interactive", "-i", penPath, "-o", penPath],
      {
        stdio: ["pipe", "pipe", "pipe"]
      }
    );

    let stderr = "";

    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Pencil export failed for ${penPath} with code ${code}: ${stderr}`));
    });

    child.stdin.end(commands);
  });
}

export async function exportPrototypePngs(rootDir = resolveDefaultOutputRoot()) {
  const jobs = await collectExportJobs(rootDir);

  for (const job of jobs) {
    const frameId = await readTopFrameId(job.penPath);
    const tempDir = await mkdtemp(path.join(os.tmpdir(), "novelstory-wbs-1.7.2-export-"));
    const tempPngPath = path.join(tempDir, `${frameId}.png`);

    try {
      await runPencilExport(job.penPath, frameId, tempDir);
      await replaceFileSafely(tempPngPath, job.pngPath);
    } finally {
      await rm(tempDir, {
        force: true,
        recursive: true
      });
    }
  }

  return jobs;
}

if (import.meta.url === new URL(process.argv[1], "file:").href) {
  const rootDir = process.argv[2] ? path.resolve(process.argv[2]) : resolveDefaultOutputRoot();
  const stats = await stat(rootDir);

  if (!stats.isDirectory()) {
    throw new Error(`Export root is not a directory: ${rootDir}`);
  }

  const jobs = await exportPrototypePngs(rootDir);
  process.stdout.write(`Exported ${jobs.length} PNG files under ${rootDir}\n`);
}
