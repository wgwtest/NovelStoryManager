import { rm } from "node:fs/promises";
import path from "node:path";

export async function resetViteCache(appDir) {
  const viteCachePath = path.resolve(appDir, "node_modules", ".vite");

  await rm(viteCachePath, {
    force: true,
    recursive: true
  });
}

if (import.meta.url === new URL(process.argv[1], "file:").href) {
  const appDir = process.argv[2] ?? ".";

  await resetViteCache(appDir);
}
