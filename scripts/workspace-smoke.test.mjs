import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

test("workspace package.json declares the required workspaces and scripts", async () => {
  const raw = await readFile(new URL("../package.json", import.meta.url), "utf8");
  const pkg = JSON.parse(raw);

  assert.equal(pkg.name, "novel-story-manager");
  assert.equal(pkg.private, true);
  assert.deepEqual(pkg.workspaces, ["apps/*", "packages/*"]);
  assert.equal(typeof pkg.scripts["dev:web"], "string");
  assert.equal(typeof pkg.scripts["dev:service"], "string");
  assert.equal(typeof pkg.scripts.typecheck, "string");
  assert.equal(typeof pkg.scripts.test, "string");
});
