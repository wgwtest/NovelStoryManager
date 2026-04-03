import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { cp } from "node:fs/promises";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { buildApp } from "./app.js";

const sampleProjectPath = path.resolve(
  process.cwd(),
  "../../fixtures/projects/sample-novel"
);

async function readFixtureJson(relativePath: string): Promise<unknown> {
  const raw = await readFile(
    path.resolve(process.cwd(), "../../fixtures", relativePath),
    "utf8"
  );

  return JSON.parse(raw) as unknown;
}

describe("buildApp", () => {
  let workingDir: string;

  beforeEach(async () => {
    workingDir = await mkdtemp(path.join(tmpdir(), "novel-story-manager-"));
    await cp(sampleProjectPath, path.join(workingDir, "sample-novel"), {
      recursive: true
    });
  });

  afterEach(async () => {
    if (!workingDir) {
      return;
    }
  });

  it("loads the sample project through the HTTP api", async () => {
    const app = buildApp({
      sampleProjectPath: path.join(workingDir, "sample-novel")
    });

    const response = await app.inject({
      method: "GET",
      url: "/api/projects/sample"
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().project.manifest.projectId).toBe("sample-novel");

    await app.close();
  });

  it("persists an edited object back to the project files", async () => {
    const app = buildApp({
      sampleProjectPath: path.join(workingDir, "sample-novel")
    });

    const response = await app.inject({
      method: "PATCH",
      url: "/api/projects/object",
      payload: {
        projectPath: path.join(workingDir, "sample-novel"),
        objectType: "characters",
        objectId: "char_suxuan",
        changes: {
          summary: "已被服务层修改"
        }
      }
    });

    expect(response.statusCode).toBe(200);

    const raw = await readFile(
      path.join(workingDir, "sample-novel", "objects", "characters.json"),
      "utf8"
    );
    const collection = JSON.parse(raw) as Array<{ id: string; summary: string }>;

    expect(collection.find((item) => item.id === "char_suxuan")?.summary).toBe(
      "已被服务层修改"
    );

    await app.close();
  });

  it("creates a new object in the requested collection", async () => {
    const app = buildApp({
      sampleProjectPath: path.join(workingDir, "sample-novel")
    });

    const response = await app.inject({
      method: "POST",
      url: "/api/projects/object",
      payload: {
        projectPath: path.join(workingDir, "sample-novel"),
        objectType: "characters",
        seed: {
          name: "顾明川",
          summary: "新建角色"
        }
      }
    });

    expect(response.statusCode).toBe(201);
    expect(response.json().object.name).toBe("顾明川");

    const raw = await readFile(
      path.join(workingDir, "sample-novel", "objects", "characters.json"),
      "utf8"
    );
    const collection = JSON.parse(raw) as Array<{ id: string; name: string }>;

    expect(collection.some((item) => item.name === "顾明川")).toBe(true);

    await app.close();
  });

  it("creates a relation object for graph edge editing", async () => {
    const app = buildApp({
      sampleProjectPath: path.join(workingDir, "sample-novel")
    });

    const response = await app.inject({
      method: "POST",
      url: "/api/projects/object",
      payload: {
        projectPath: path.join(workingDir, "sample-novel"),
        objectType: "relations",
        seed: {
          type: "alliance",
          sourceRef: "char_suxuan",
          targetRef: "char_linwan",
          summary: "新建关系"
        }
      }
    });

    expect(response.statusCode).toBe(201);
    expect(response.json().object.type).toBe("alliance");

    const raw = await readFile(
      path.join(workingDir, "sample-novel", "objects", "relations.json"),
      "utf8"
    );
    const collection = JSON.parse(raw) as Array<{
      sourceRef: string;
      targetRef: string;
      type: string;
    }>;

    expect(
      collection.some(
        (item) =>
          item.sourceRef === "char_suxuan" &&
          item.targetRef === "char_linwan" &&
          item.type === "alliance"
      )
    ).toBe(true);

    await app.close();
  });

  it("creates a new empty project on disk", async () => {
    const app = buildApp({
      sampleProjectPath: path.join(workingDir, "sample-novel")
    });

    const projectPath = path.join(workingDir, "new-project");
    const response = await app.inject({
      method: "POST",
      url: "/api/projects/create",
      payload: {
        projectPath,
        projectId: "new-project",
        title: "新项目"
      }
    });

    expect(response.statusCode).toBe(201);

    const manifest = JSON.parse(
      await readFile(path.join(projectPath, "manifest.json"), "utf8")
    ) as { projectId: string; title: string };

    expect(manifest.projectId).toBe("new-project");
    expect(manifest.title).toBe("新项目");

    await app.close();
  });

  it("exports and reimports a project bundle without semantic drift", async () => {
    const app = buildApp({
      sampleProjectPath: path.join(workingDir, "sample-novel")
    });

    const exportResponse = await app.inject({
      method: "POST",
      url: "/api/projects/export",
      payload: {
        projectPath: path.join(workingDir, "sample-novel")
      }
    });

    expect(exportResponse.statusCode).toBe(200);

    const importProjectPath = path.join(workingDir, "imported-project");
    const importResponse = await app.inject({
      method: "POST",
      url: "/api/projects/import",
      payload: {
        projectPath: importProjectPath,
        bundle: exportResponse.json().bundle
      }
    });

    expect(importResponse.statusCode).toBe(201);

    const reExportResponse = await app.inject({
      method: "POST",
      url: "/api/projects/export",
      payload: {
        projectPath: importProjectPath
      }
    });

    expect(reExportResponse.statusCode).toBe(200);
    expect(reExportResponse.json().bundle.project).toEqual(
      exportResponse.json().bundle.project
    );

    await app.close();
  });

  it("exports requested object collections as an object batch", async () => {
    const app = buildApp({
      sampleProjectPath: path.join(workingDir, "sample-novel")
    });

    const response = await app.inject({
      method: "POST",
      url: "/api/projects/object-batch/export",
      payload: {
        projectPath: path.join(workingDir, "sample-novel"),
        objectTypes: [
          "characters"
        ]
      }
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().bundle.scope.objectTypes).toEqual([
      "characters"
    ]);
    expect(response.json().bundle.objects.characters).toHaveLength(2);
    expect("factions" in response.json().bundle.objects).toBe(false);

    await app.close();
  });

  it("imports a valid object batch and only updates declared collections", async () => {
    const app = buildApp({
      sampleProjectPath: path.join(workingDir, "sample-novel")
    });

    const batch = await readFixtureJson(
      "import-export/object-batches/valid-character-batch.json"
    );
    const response = await app.inject({
      method: "POST",
      url: "/api/projects/object-batch/import",
      payload: {
        projectPath: path.join(workingDir, "sample-novel"),
        bundle: batch
      }
    });

    expect(response.statusCode).toBe(200);

    const characters = JSON.parse(
      await readFile(
        path.join(workingDir, "sample-novel", "objects", "characters.json"),
        "utf8"
      )
    ) as Array<{ id: string }>;
    const factions = JSON.parse(
      await readFile(
        path.join(workingDir, "sample-novel", "objects", "factions.json"),
        "utf8"
      )
    ) as Array<{ id: string }>;

    expect(characters.some((item) => item.id === "char_hemu")).toBe(true);
    expect(factions).toHaveLength(1);

    await app.close();
  });

  it("rejects an object batch with unresolved dependencies", async () => {
    const app = buildApp({
      sampleProjectPath: path.join(workingDir, "sample-novel")
    });

    const batch = await readFixtureJson(
      "import-export/object-batches/invalid-missing-dependency.json"
    );
    const response = await app.inject({
      method: "POST",
      url: "/api/projects/object-batch/import",
      payload: {
        projectPath: path.join(workingDir, "sample-novel"),
        bundle: batch
      }
    });

    expect(response.statusCode).toBe(400);
    expect(response.json().message).toMatch(/faction_missing/i);

    await app.close();
  });

  it("persists an edited graph layout back to the view files", async () => {
    const app = buildApp({
      sampleProjectPath: path.join(workingDir, "sample-novel")
    });

    const response = await app.inject({
      method: "PATCH",
      url: "/api/projects/graph-layout",
      payload: {
        projectPath: path.join(workingDir, "sample-novel"),
        layout: {
          id: "default-graph",
          name: "默认关系图",
          positions: {
            char_suxuan: {
              x: 210,
              y: 160
            },
            char_linwan: {
              x: 360,
              y: 120
            }
          },
          zoom: 1
        }
      }
    });

    expect(response.statusCode).toBe(200);

    const raw = await readFile(
      path.join(workingDir, "sample-novel", "views", "graph-layouts.json"),
      "utf8"
    );
    const layouts = JSON.parse(raw) as Array<{
      id: string;
      positions: Record<string, { x: number; y: number }>;
    }>;

    expect(
      layouts.find((layout) => layout.id === "default-graph")?.positions.char_suxuan
    ).toEqual({
      x: 210,
      y: 160
    });

    await app.close();
  });

  it("persists an edited track preset without mutating event objects", async () => {
    const app = buildApp({
      sampleProjectPath: path.join(workingDir, "sample-novel")
    });

    const eventsBefore = await readFile(
      path.join(workingDir, "sample-novel", "objects", "events.json"),
      "utf8"
    );

    const response = await app.inject({
      method: "PATCH",
      url: "/api/projects/track-preset",
      payload: {
        projectPath: path.join(workingDir, "sample-novel"),
        preset: {
          id: "default-tracks",
          name: "默认轨道预设",
          grouping: "arc",
          laneOrder: [
            "arc_fire-vein"
          ],
          zoom: 1
        }
      }
    });

    expect(response.statusCode).toBe(200);

    const raw = await readFile(
      path.join(workingDir, "sample-novel", "views", "track-presets.json"),
      "utf8"
    );
    const presets = JSON.parse(raw) as Array<{
      id: string;
      grouping: string;
      laneOrder: string[];
    }>;

    expect(presets.find((preset) => preset.id === "default-tracks")).toMatchObject({
      id: "default-tracks",
      grouping: "arc",
      laneOrder: [
        "arc_fire-vein"
      ],
      name: "默认轨道预设",
      zoom: 1
    });

    const eventsAfter = await readFile(
      path.join(workingDir, "sample-novel", "objects", "events.json"),
      "utf8"
    );
    expect(eventsAfter).toBe(eventsBefore);

    await app.close();
  });

  it("persists an edited chapter slice back to the view files", async () => {
    const app = buildApp({
      sampleProjectPath: path.join(workingDir, "sample-novel")
    });

    const response = await app.inject({
      method: "PATCH",
      url: "/api/projects/chapter-slice",
      payload: {
        projectPath: path.join(workingDir, "sample-novel"),
        slice: {
          id: "chapter-001",
          title: "第一章 残火令现",
          summary: "修订版摘要",
          text: "修订版章节正文",
          sourceMode: "time",
          eventRefs: [
            "event_trial-valley"
          ],
          focusObjectRefs: [
            "char_suxuan",
            "char_linwan"
          ],
          order: 1
        }
      }
    });

    expect(response.statusCode).toBe(200);

    const raw = await readFile(
      path.join(workingDir, "sample-novel", "views", "chapter-slices.json"),
      "utf8"
    );
    const slices = JSON.parse(raw) as Array<{ id: string; text: string; summary: string }>;

    expect(
      slices.find((slice) => slice.id === "chapter-001")
    ).toMatchObject({
      summary: "修订版摘要",
      text: "修订版章节正文"
    });

    await app.close();
  });
});
