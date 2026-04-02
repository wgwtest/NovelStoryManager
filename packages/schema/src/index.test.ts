import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";

import {
  parseObjectBatch,
  parseProjectBundle,
  parseProjectData,
  projectDataSchema,
  type ProjectData
} from "./index.js";

async function readJsonFixture(relativePath: string): Promise<unknown> {
  const raw = await readFile(
    new URL(`../../../fixtures/${relativePath}`, import.meta.url),
    "utf8"
  );

  return JSON.parse(raw) as unknown;
}

async function readProjectFixture(): Promise<ProjectData> {
  const manifest = await readJsonFixture("projects/sample-novel/manifest.json");
  const schemaVersion = await readJsonFixture(
    "projects/sample-novel/schema-version.json"
  );

  const objects = {
    characters: await readJsonFixture("projects/sample-novel/objects/characters.json"),
    factions: await readJsonFixture("projects/sample-novel/objects/factions.json"),
    locations: await readJsonFixture("projects/sample-novel/objects/locations.json"),
    items: await readJsonFixture("projects/sample-novel/objects/items.json"),
    "realm-systems": await readJsonFixture(
      "projects/sample-novel/objects/realm-systems.json"
    ),
    events: await readJsonFixture("projects/sample-novel/objects/events.json"),
    relations: await readJsonFixture("projects/sample-novel/objects/relations.json"),
    clues: await readJsonFixture("projects/sample-novel/objects/clues.json"),
    arcs: await readJsonFixture("projects/sample-novel/objects/arcs.json")
  };

  const views = {
    "graph-layouts": await readJsonFixture(
      "projects/sample-novel/views/graph-layouts.json"
    ),
    "track-presets": await readJsonFixture(
      "projects/sample-novel/views/track-presets.json"
    ),
    "saved-filters": await readJsonFixture(
      "projects/sample-novel/views/saved-filters.json"
    )
  };

  return parseProjectData({
    manifest,
    schemaVersion,
    objects,
    views
  });
}

describe("projectDataSchema", () => {
  it("accepts the sample file-backed novel project payload", async () => {
    const parsed = await readProjectFixture();

    expect(parsed.objects.characters[0]?.id).toBe("char_suxuan");
    expect(parsed.views["graph-layouts"][0]?.id).toBe("default-graph");
  });

  it("rejects a relation without source and target refs", () => {
    expect(() =>
      projectDataSchema.parse({
        manifest: {
          projectId: "bad-project",
          title: "Bad Project",
          objectTypes: [
            "characters",
            "factions",
            "locations",
            "items",
            "realm-systems",
            "events",
            "relations",
            "clues",
            "arcs"
          ]
        },
        schemaVersion: {
          version: "1.0.0"
        },
        objects: {
          characters: [],
          factions: [],
          locations: [],
          items: [],
          "realm-systems": [],
          events: [],
          relations: [
            {
              id: "rel_1",
              type: "mentor"
            }
          ],
          clues: [],
          arcs: []
        },
        views: {
          "graph-layouts": [],
          "track-presets": [],
          "saved-filters": []
        }
      })
    ).toThrowError();
  });

  it("rejects duplicate object ids inside a collection", async () => {
    const project = await readProjectFixture();

    expect(() =>
      parseProjectData({
        ...project,
        objects: {
          ...project.objects,
          characters: [
            ...project.objects.characters,
            {
              ...project.objects.characters[0],
              summary: "重复对象"
            }
          ]
        }
      })
    ).toThrowError(/duplicate/i);
  });

  it("rejects broken references inside project data", async () => {
    const project = await readProjectFixture();

    expect(() =>
      parseProjectData({
        ...project,
        objects: {
          ...project.objects,
          relations: [
            {
              ...project.objects.relations[0],
              sourceRef: "char_missing"
            }
          ]
        }
      })
    ).toThrowError(/char_missing/i);
  });
});

describe("project bundle schema", () => {
  it("accepts a valid project bundle fixture", async () => {
    const bundle = parseProjectBundle(
      await readJsonFixture(
        "import-export/project-bundles/valid-sample-project.json"
      )
    );

    expect(bundle.project.manifest.projectId).toBe("sample-novel");
  });

  it("rejects a project bundle with a missing manifest", async () => {
    await expect(async () =>
      parseProjectBundle(
        await readJsonFixture(
          "import-export/project-bundles/invalid-missing-manifest.json"
        )
      )
    ).rejects.toThrowError();
  });

  it("rejects a project bundle with broken references", async () => {
    await expect(async () =>
      parseProjectBundle(
        await readJsonFixture(
          "import-export/project-bundles/invalid-broken-reference.json"
        )
      )
    ).rejects.toThrowError(/char_missing/i);
  });

  it("rejects a project bundle with an unsupported bundle version", async () => {
    await expect(async () =>
      parseProjectBundle(
        await readJsonFixture(
          "import-export/project-bundles/invalid-unsupported-version.json"
        )
      )
    ).rejects.toThrowError(/bundle version/i);
  });
});

describe("object batch schema", () => {
  it("accepts a valid object batch fixture", async () => {
    const batch = parseObjectBatch(
      await readJsonFixture(
        "import-export/object-batches/valid-character-batch.json"
      )
    );

    expect(batch.scope.objectTypes).toEqual([
      "characters"
    ]);
    expect(batch.objects.characters?.[0]?.id).toBe("char_hemu");
  });
});
