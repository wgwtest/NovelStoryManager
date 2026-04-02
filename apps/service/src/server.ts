import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildApp } from "./app.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const sampleProjectPath = path.resolve(
  currentDir,
  "../../../fixtures/projects/sample-novel"
);

const app = buildApp({ sampleProjectPath });

const port = Number(process.env.PORT ?? "3001");

app
  .listen({
    host: "127.0.0.1",
    port
  })
  .then(() => {
    console.log(`NovelStoryManager service listening on http://127.0.0.1:${port}`);
  })
  .catch(async (error) => {
    console.error(error);
    await app.close();
    process.exit(1);
  });
