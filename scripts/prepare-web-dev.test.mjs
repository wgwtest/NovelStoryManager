import assert from "node:assert/strict";
import { access, mkdir, mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

test("resetViteCache removes a stale vite cache directory before web dev starts", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "novelstory-web-dev-"));
  const viteDepsDir = path.join(tempDir, "node_modules", ".vite", "deps");

  await mkdir(viteDepsDir, {
    recursive: true
  });
  await writeFile(path.join(viteDepsDir, "_metadata.json"), "{}\n", "utf8");

  const { resetViteCache } = await import(new URL("./prepare-web-dev.mjs", import.meta.url));

  await resetViteCache(tempDir);

  await assert.rejects(async () => access(path.join(tempDir, "node_modules", ".vite")));
});
