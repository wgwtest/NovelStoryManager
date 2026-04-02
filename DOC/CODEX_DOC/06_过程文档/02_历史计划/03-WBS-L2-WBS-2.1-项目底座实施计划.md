# WBS 2.1 Project Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first runnable project foundation of NovelStoryManager with file-backed single-project storage, a validated schema package, a local service for project create/open/save, and a usable knowledge view with a persistent object library.

**Architecture:** Use one npm workspace repository with three focused packages: a shared schema package, a Fastify local service, and a Vite React web client. The service owns file-system reads and writes plus schema validation, while the client renders the persistent left sidebar, workbench tabs, and knowledge view against HTTP endpoints. View state and object facts stay in separate files from the start.

**Tech Stack:** npm workspaces, TypeScript, React, Vite, Fastify, Zod, react-resizable-panels, Vitest, React Testing Library, Node.js `fs/promises`

**Upstream docs:**

1. `DOC/CODEX_DOC/02_设计说明/2026-04-01-WBS-1.2-信息架构与页面分解.md`
2. `DOC/CODEX_DOC/02_设计说明/2026-04-01-WBS-1.3-低保真原型设计.md`
3. `DOC/CODEX_DOC/02_设计说明/2026-04-01-WBS-1.4-高风险交互原型验证.md`
4. `DOC/CODEX_DOC/02_设计说明/2026-04-01-WBS-1.5-技术方案选型.md`

---

## Scope Lock

This plan covers `WBS 2.1` only.

Included in `WBS 2.1`:

1. Repo workspace bootstrap
2. Schema v1 and sample project fixture
3. Local service for project create/open/read/save
4. Persistent object library sidebar
5. Knowledge view with generic object list and detail editing
6. Placeholder tabs for graph view and track view

Explicitly excluded from `WBS 2.1`:

1. Relationship graph rendering
2. Track view drag interactions
3. Chapter text management
4. Built-in AI features
5. Cross-project world sharing

## File Map

### Root

- Create: `/home/wgw/CodexProject/NovelStoryManager/.gitignore`
- Create: `/home/wgw/CodexProject/NovelStoryManager/package.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/tsconfig.base.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/README.md`
- Create: `/home/wgw/CodexProject/NovelStoryManager/scripts/workspace-smoke.test.mjs`

### Shared schema package

- Create: `/home/wgw/CodexProject/NovelStoryManager/packages/schema/package.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/packages/schema/tsconfig.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/packages/schema/src/index.ts`
- Create: `/home/wgw/CodexProject/NovelStoryManager/packages/schema/src/index.test.ts`

### Service package

- Create: `/home/wgw/CodexProject/NovelStoryManager/apps/service/package.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/apps/service/tsconfig.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/apps/service/src/app.ts`
- Create: `/home/wgw/CodexProject/NovelStoryManager/apps/service/src/server.ts`
- Create: `/home/wgw/CodexProject/NovelStoryManager/apps/service/src/lib/project-store.ts`
- Create: `/home/wgw/CodexProject/NovelStoryManager/apps/service/src/app.test.ts`

### Web package

- Create: `/home/wgw/CodexProject/NovelStoryManager/apps/web/package.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/apps/web/tsconfig.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/apps/web/vite.config.ts`
- Create: `/home/wgw/CodexProject/NovelStoryManager/apps/web/src/main.tsx`
- Create: `/home/wgw/CodexProject/NovelStoryManager/apps/web/src/App.tsx`
- Create: `/home/wgw/CodexProject/NovelStoryManager/apps/web/src/App.test.tsx`
- Create: `/home/wgw/CodexProject/NovelStoryManager/apps/web/src/api/projects.ts`
- Create: `/home/wgw/CodexProject/NovelStoryManager/apps/web/src/components/ObjectLibrary.tsx`
- Create: `/home/wgw/CodexProject/NovelStoryManager/apps/web/src/components/KnowledgeView.tsx`
- Create: `/home/wgw/CodexProject/NovelStoryManager/apps/web/src/styles.css`
- Create: `/home/wgw/CodexProject/NovelStoryManager/apps/web/src/test/setup.ts`

### Sample fixture project

- Create: `/home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/manifest.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/schema-version.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/objects/characters.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/objects/factions.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/objects/locations.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/objects/items.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/objects/realm-systems.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/objects/events.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/objects/relations.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/objects/clues.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/objects/arcs.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/views/graph-layouts.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/views/track-presets.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/views/saved-filters.json`

## Task 1: Bootstrap npm workspace and baseline scripts

**Files:**
- Create: `/home/wgw/CodexProject/NovelStoryManager/.gitignore`
- Create: `/home/wgw/CodexProject/NovelStoryManager/package.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/tsconfig.base.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/scripts/workspace-smoke.test.mjs`
- Create: `/home/wgw/CodexProject/NovelStoryManager/apps/web/package.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/apps/service/package.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/packages/schema/package.json`

- [ ] **Step 1: Write the failing workspace smoke test**

```js
// /home/wgw/CodexProject/NovelStoryManager/scripts/workspace-smoke.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("workspace package.json declares all required workspaces", async () => {
  const raw = await readFile(new URL("../package.json", import.meta.url), "utf8");
  const pkg = JSON.parse(raw);

  assert.deepEqual(pkg.workspaces, ["apps/*", "packages/*"]);
  assert.equal(pkg.private, true);
  assert.equal(typeof pkg.scripts.typecheck, "string");
  assert.equal(typeof pkg.scripts.test, "string");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/workspace-smoke.test.mjs`
Expected: FAIL with `ENOENT` for `/home/wgw/CodexProject/NovelStoryManager/package.json`

- [ ] **Step 3: Write the minimal workspace bootstrap**

```json
// /home/wgw/CodexProject/NovelStoryManager/package.json
{
  "name": "novel-story-manager",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev:web": "npm run dev --workspace @novelstory/web",
    "dev:service": "npm run dev --workspace @novelstory/service",
    "build": "npm run build --workspaces",
    "typecheck": "npm run typecheck --workspaces",
    "test": "npm run test --workspaces"
  }
}
```

```gitignore
# /home/wgw/CodexProject/NovelStoryManager/.gitignore
node_modules/
dist/
.vite/
.DS_Store
*.log
tmp/
```

```json
// /home/wgw/CodexProject/NovelStoryManager/apps/web/package.json
{
  "name": "@novelstory/web",
  "private": true,
  "type": "module",
  "dependencies": {
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.5.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@types/react": "^19.1.2",
    "@types/react-dom": "^19.1.2",
    "jsdom": "^26.1.0",
    "typescript": "^5.8.3",
    "vite": "^6.3.5",
    "vitest": "^3.2.4"
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc -p tsconfig.json && vite build",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "test": "vitest run"
  }
}
```

```json
// /home/wgw/CodexProject/NovelStoryManager/apps/service/package.json
{
  "name": "@novelstory/service",
  "private": true,
  "type": "module",
  "dependencies": {
    "@novelstory/schema": "file:../../packages/schema",
    "fastify": "^5.2.1"
  },
  "devDependencies": {
    "@types/node": "^24.0.12",
    "tsx": "^4.20.3",
    "typescript": "^5.8.3",
    "vitest": "^3.2.4"
  },
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc -p tsconfig.json",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "test": "vitest run"
  }
}
```

```json
// /home/wgw/CodexProject/NovelStoryManager/packages/schema/package.json
{
  "name": "@novelstory/schema",
  "private": true,
  "type": "module",
  "dependencies": {
    "zod": "^3.24.4"
  },
  "devDependencies": {
    "typescript": "^5.8.3",
    "vitest": "^3.2.4"
  },
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "test": "vitest run"
  }
}
```

```json
// /home/wgw/CodexProject/NovelStoryManager/tsconfig.base.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  }
}
```

- [ ] **Step 4: Run workspace smoke test and install dependencies**

Run: `node --test scripts/workspace-smoke.test.mjs && npm install`
Expected: PASS for the smoke test, followed by a completed `npm install` with a generated `package-lock.json`

- [ ] **Step 5: Commit**

```bash
git add .gitignore package.json package-lock.json tsconfig.base.json scripts/workspace-smoke.test.mjs apps/web/package.json apps/service/package.json packages/schema/package.json
git commit -m "chore: bootstrap npm workspace"
```

## Task 2: Define schema v1 and sample project fixture

**Files:**
- Create: `/home/wgw/CodexProject/NovelStoryManager/packages/schema/tsconfig.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/packages/schema/src/index.ts`
- Create: `/home/wgw/CodexProject/NovelStoryManager/packages/schema/src/index.test.ts`
- Create: `/home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/manifest.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/schema-version.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/objects/characters.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/objects/factions.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/objects/locations.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/objects/items.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/objects/realm-systems.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/objects/events.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/objects/relations.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/objects/clues.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/objects/arcs.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/views/graph-layouts.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/views/track-presets.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/views/saved-filters.json`
- Test: `/home/wgw/CodexProject/NovelStoryManager/packages/schema/src/index.test.ts`

- [ ] **Step 1: Write the failing schema tests**

```ts
// /home/wgw/CodexProject/NovelStoryManager/packages/schema/src/index.test.ts
import { describe, expect, it } from "vitest";
import {
  collectionNames,
  createEmptyProjectBundle,
  parseProjectBundle
} from "./index";

describe("schema package", () => {
  it("creates an empty project bundle with all required collections", () => {
    const bundle = createEmptyProjectBundle({
      projectId: "novel-sample",
      title: "示例小说"
    });

    expect(bundle.manifest.projectId).toBe("novel-sample");
    expect(Object.keys(bundle.objects)).toEqual(collectionNames);
    expect(bundle.views.trackPresets).toEqual([]);
  });

  it("rejects an event without a time anchor object", () => {
    expect(() =>
      parseProjectBundle({
        manifest: {
          projectId: "broken",
          title: "Broken",
          schemaVersion: "1.0.0"
        },
        objects: {
          characters: [],
          factions: [],
          locations: [],
          items: [],
          realmSystems: [],
          events: [{ id: "event-1", name: "无效事件", type: "plot" }],
          relations: [],
          clues: [],
          arcs: []
        },
        views: {
          graphLayouts: [],
          trackPresets: [],
          savedFilters: []
        }
      })
    ).toThrowError(/timeAnchor/);
  });
});
```

- [ ] **Step 2: Run the schema tests to verify they fail**

Run: `npm run test --workspace @novelstory/schema`
Expected: FAIL with `Cannot find module './index'`

- [ ] **Step 3: Implement the schema package and fixture project**

```ts
// /home/wgw/CodexProject/NovelStoryManager/packages/schema/src/index.ts
import { z } from "zod";

export const collectionNames = [
  "characters",
  "factions",
  "locations",
  "items",
  "realmSystems",
  "events",
  "relations",
  "clues",
  "arcs"
] as const;

const referenceArray = z.array(z.string()).default([]);

const baseObjectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  summary: z.string().default(""),
  tags: z.array(z.string()).default([])
});

const characterSchema = baseObjectSchema.extend({
  aliases: z.array(z.string()).default([]),
  status: z.string().default("draft"),
  identity: z.string().default(""),
  factionRefs: referenceArray,
  realmState: z.string().default(""),
  notes: z.string().default("")
});

const factionSchema = baseObjectSchema.extend({
  aliases: z.array(z.string()).default([]),
  type: z.string().default("sect"),
  parentFactionRef: z.string().nullable().default(null),
  goal: z.string().default(""),
  status: z.string().default("active"),
  locationRefs: referenceArray
});

const locationSchema = baseObjectSchema.extend({
  aliases: z.array(z.string()).default([]),
  type: z.string().default("region"),
  parentLocationRef: z.string().nullable().default(null),
  controllerRef: z.string().nullable().default(null),
  traits: z.array(z.string()).default([]),
  status: z.string().default("known")
});

const itemSchema = baseObjectSchema.extend({
  aliases: z.array(z.string()).default([]),
  type: z.string().default("artifact"),
  ownerRef: z.string().nullable().default(null),
  origin: z.string().default(""),
  status: z.string().default("available"),
  traits: z.array(z.string()).default([])
});

const realmSystemSchema = baseObjectSchema.extend({
  type: z.string().default("cultivation"),
  levels: z.array(z.string()).default([]),
  rules: z.array(z.string()).default([])
});

const eventSchema = baseObjectSchema.extend({
  type: z.string().default("plot"),
  participantRefs: referenceArray,
  locationRefs: referenceArray,
  factionRefs: referenceArray,
  itemRefs: referenceArray,
  timeAnchor: z.object({
    order: z.number().int().nonnegative(),
    label: z.string().min(1)
  }),
  preconditions: z.array(z.string()).default([]),
  results: z.array(z.string()).default([]),
  arcRefs: referenceArray,
  clueRefs: referenceArray
});

const relationSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  sourceRef: z.string().min(1),
  targetRef: z.string().min(1),
  direction: z.enum(["directed", "undirected"]).default("directed"),
  strength: z.number().int().min(1).max(5).default(3),
  startAnchor: z.string().nullable().default(null),
  endAnchor: z.string().nullable().default(null),
  summary: z.string().default(""),
  tags: z.array(z.string()).default([])
});

const clueSchema = baseObjectSchema.extend({
  status: z.enum(["hidden", "revealed", "discarded"]).default("hidden"),
  objectRefs: referenceArray,
  eventRefs: referenceArray,
  revealCondition: z.string().default("")
});

const arcSchema = baseObjectSchema.extend({
  status: z.enum(["draft", "active", "closed"]).default("draft"),
  eventRefs: referenceArray,
  objectRefs: referenceArray
});

export const projectBundleSchema = z.object({
  manifest: z.object({
    projectId: z.string().min(1),
    title: z.string().min(1),
    schemaVersion: z.literal("1.0.0")
  }),
  objects: z.object({
    characters: z.array(characterSchema),
    factions: z.array(factionSchema),
    locations: z.array(locationSchema),
    items: z.array(itemSchema),
    realmSystems: z.array(realmSystemSchema),
    events: z.array(eventSchema),
    relations: z.array(relationSchema),
    clues: z.array(clueSchema),
    arcs: z.array(arcSchema)
  }),
  views: z.object({
    graphLayouts: z.array(z.record(z.string(), z.unknown())),
    trackPresets: z.array(z.record(z.string(), z.unknown())),
    savedFilters: z.array(z.record(z.string(), z.unknown()))
  })
});

export type ProjectBundle = z.infer<typeof projectBundleSchema>;

export function parseProjectBundle(input: unknown): ProjectBundle {
  return projectBundleSchema.parse(input);
}

export function createEmptyProjectBundle(input: {
  projectId: string;
  title: string;
}): ProjectBundle {
  return parseProjectBundle({
    manifest: {
      projectId: input.projectId,
      title: input.title,
      schemaVersion: "1.0.0"
    },
    objects: {
      characters: [],
      factions: [],
      locations: [],
      items: [],
      realmSystems: [],
      events: [],
      relations: [],
      clues: [],
      arcs: []
    },
    views: {
      graphLayouts: [],
      trackPresets: [],
      savedFilters: []
    }
  });
}
```

```json
// /home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/manifest.json
{
  "projectId": "sample-novel",
  "title": "青岚山门录",
  "schemaVersion": "1.0.0"
}
```

```json
// /home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/schema-version.json
{
  "version": "1.0.0"
}
```

```json
// /home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/objects/characters.json
[
  {
    "id": "char-linxuan",
    "name": "林玄",
    "aliases": ["林师兄"],
    "summary": "故事主角，青岚宗真传弟子。",
    "tags": ["主角", "剑修"],
    "status": "active",
    "identity": "青岚宗真传",
    "factionRefs": ["faction-qinglan"],
    "realmState": "金丹初期",
    "notes": ""
  }
]
```

```json
// /home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/objects/factions.json
[
  {
    "id": "faction-qinglan",
    "name": "青岚宗",
    "aliases": [],
    "type": "sect",
    "summary": "云州名门正宗之一。",
    "tags": ["宗门"],
    "parentFactionRef": null,
    "goal": "稳固云州地位",
    "status": "active",
    "locationRefs": ["loc-qinglan-gate"]
  }
]
```

```json
// /home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/objects/locations.json
[
  {
    "id": "loc-qinglan-gate",
    "name": "青岚山门",
    "aliases": [],
    "type": "sect-base",
    "summary": "青岚宗主山门。",
    "tags": ["宗门驻地"],
    "parentLocationRef": null,
    "controllerRef": "faction-qinglan",
    "traits": ["护山大阵"],
    "status": "known"
  }
]
```

```json
// /home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/objects/items.json
[]
```

```json
// /home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/objects/realm-systems.json
[
  {
    "id": "realm-main",
    "name": "青岚主修体系",
    "summary": "以炼气、筑基、金丹为基础的修行体系。",
    "tags": ["修行体系"],
    "type": "cultivation",
    "levels": ["炼气", "筑基", "金丹", "元婴"],
    "rules": ["每一大境界需突破瓶颈"]
  }
]
```

```json
// /home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/objects/events.json
[
  {
    "id": "event-outer-test",
    "name": "外门试炼",
    "summary": "林玄通过入宗后的第一次大型试炼。",
    "tags": ["试炼"],
    "type": "plot",
    "participantRefs": ["char-linxuan"],
    "locationRefs": ["loc-qinglan-gate"],
    "factionRefs": ["faction-qinglan"],
    "itemRefs": [],
    "timeAnchor": {
      "order": 1,
      "label": "入宗后第一个月"
    },
    "preconditions": [],
    "results": ["获得内门资格"],
    "arcRefs": ["arc-rise"],
    "clueRefs": []
  }
]
```

```json
// /home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/objects/relations.json
[
  {
    "id": "rel-linxuan-qinglan",
    "type": "belongs-to",
    "sourceRef": "char-linxuan",
    "targetRef": "faction-qinglan",
    "direction": "directed",
    "strength": 4,
    "startAnchor": "入宗",
    "endAnchor": null,
    "summary": "林玄当前隶属于青岚宗。",
    "tags": ["隶属"]
  }
]
```

```json
// /home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/objects/clues.json
[]
```

```json
// /home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/objects/arcs.json
[
  {
    "id": "arc-rise",
    "name": "崛起线",
    "summary": "林玄从入宗到站稳脚跟的主线。",
    "tags": ["主线"],
    "status": "active",
    "eventRefs": ["event-outer-test"],
    "objectRefs": ["char-linxuan", "faction-qinglan"]
  }
]
```

```json
// /home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/views/graph-layouts.json
[]
```

```json
// /home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/views/track-presets.json
[]
```

```json
// /home/wgw/CodexProject/NovelStoryManager/fixtures/projects/sample-novel/views/saved-filters.json
[]
```

```json
// /home/wgw/CodexProject/NovelStoryManager/packages/schema/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

- [ ] **Step 4: Run the schema tests to verify they pass**

Run: `npm run test --workspace @novelstory/schema`
Expected: PASS with `2 passed`

- [ ] **Step 5: Commit**

```bash
git add packages/schema fixtures/projects/sample-novel
git commit -m "feat: add project schema and sample fixture"
```

## Task 3: Build the local project service for create, open, read, and save

**Files:**
- Create: `/home/wgw/CodexProject/NovelStoryManager/apps/service/tsconfig.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/apps/service/src/app.ts`
- Create: `/home/wgw/CodexProject/NovelStoryManager/apps/service/src/server.ts`
- Create: `/home/wgw/CodexProject/NovelStoryManager/apps/service/src/lib/project-store.ts`
- Create: `/home/wgw/CodexProject/NovelStoryManager/apps/service/src/app.test.ts`
- Test: `/home/wgw/CodexProject/NovelStoryManager/apps/service/src/app.test.ts`

- [ ] **Step 1: Write the failing service tests**

```ts
// /home/wgw/CodexProject/NovelStoryManager/apps/service/src/app.test.ts
import { mkdtemp, cp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { buildApp } from "./app";

describe("project service", () => {
  let projectRoot = "";

  beforeEach(async () => {
    projectRoot = await mkdtemp(join(tmpdir(), "novel-story-manager-"));
    await cp(new URL("../../../../fixtures/projects/sample-novel/", import.meta.url), join(projectRoot, "sample-novel"), {
      recursive: true
    });
  });

  afterEach(async () => {
    await rm(projectRoot, { recursive: true, force: true });
  });

  it("opens a sample project and returns sidebar counts", async () => {
    const app = buildApp();

    const response = await app.inject({
      method: "POST",
      url: "/api/projects/open",
      payload: {
        projectPath: join(projectRoot, "sample-novel")
      }
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().manifest.title).toBe("青岚山门录");
    expect(response.json().counts.characters).toBe(1);
  });

  it("saves a character collection back to disk after validation", async () => {
    const app = buildApp();

    const openResponse = await app.inject({
      method: "POST",
      url: "/api/projects/open",
      payload: {
        projectPath: join(projectRoot, "sample-novel")
      }
    });

    const { projectId } = openResponse.json();

    const saveResponse = await app.inject({
      method: "PUT",
      url: `/api/projects/${projectId}/objects/characters`,
      payload: {
        items: [
          {
            id: "char-linxuan",
            name: "林玄",
            aliases: ["林师兄"],
            summary: "更新后的摘要",
            tags: ["主角", "剑修"],
            status: "active",
            identity: "青岚宗真传",
            factionRefs: ["faction-qinglan"],
            realmState: "金丹初期",
            notes: ""
          }
        ]
      }
    });

    expect(saveResponse.statusCode).toBe(200);

    const raw = await readFile(
      join(projectRoot, "sample-novel", "objects", "characters.json"),
      "utf8"
    );

    expect(raw).toContain("更新后的摘要");
  });
});
```

- [ ] **Step 2: Run the service tests to verify they fail**

Run: `npm run test --workspace @novelstory/service`
Expected: FAIL with `Cannot find module './app'`

- [ ] **Step 3: Implement the service app and project store**

```ts
// /home/wgw/CodexProject/NovelStoryManager/apps/service/src/lib/project-store.ts
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  collectionNames,
  createEmptyProjectBundle,
  parseProjectBundle,
  type ProjectBundle
} from "@novelstory/schema";

const collectionFileMap = {
  characters: "characters.json",
  factions: "factions.json",
  locations: "locations.json",
  items: "items.json",
  realmSystems: "realm-systems.json",
  events: "events.json",
  relations: "relations.json",
  clues: "clues.json",
  arcs: "arcs.json"
} as const;

type CollectionName = keyof typeof collectionFileMap;

export class ProjectStore {
  private readonly openProjects = new Map<string, string>();

  async openProject(projectPath: string) {
    const bundle = await this.readBundle(projectPath);
    this.openProjects.set(bundle.manifest.projectId, projectPath);

    return {
      projectId: bundle.manifest.projectId,
      manifest: bundle.manifest,
      counts: Object.fromEntries(
        collectionNames.map((name) => [name, bundle.objects[name].length])
      )
    };
  }

  async createProject(input: { parentDir: string; projectSlug: string; title: string }) {
    const projectPath = join(input.parentDir, input.projectSlug);
    const bundle = createEmptyProjectBundle({
      projectId: input.projectSlug,
      title: input.title
    });

    await mkdir(join(projectPath, "objects"), { recursive: true });
    await mkdir(join(projectPath, "views"), { recursive: true });
    await this.writeBundle(projectPath, bundle);

    this.openProjects.set(bundle.manifest.projectId, projectPath);
    return this.openProject(projectPath);
  }

  async readCollection(projectId: string, collectionName: CollectionName) {
    const bundle = await this.readBundle(this.requireProjectPath(projectId));
    return bundle.objects[collectionName];
  }

  async saveCollection(projectId: string, collectionName: CollectionName, items: unknown[]) {
    const projectPath = this.requireProjectPath(projectId);
    const bundle = await this.readBundle(projectPath);
    const nextBundle = parseProjectBundle({
      ...bundle,
      objects: {
        ...bundle.objects,
        [collectionName]: items
      }
    });

    await writeFile(
      join(projectPath, "objects", collectionFileMap[collectionName]),
      JSON.stringify(nextBundle.objects[collectionName], null, 2) + "\n",
      "utf8"
    );

    return {
      saved: true,
      count: nextBundle.objects[collectionName].length
    };
  }

  private requireProjectPath(projectId: string) {
    const projectPath = this.openProjects.get(projectId);
    if (!projectPath) {
      throw new Error(`Project not open: ${projectId}`);
    }
    return projectPath;
  }

  private async readBundle(projectPath: string): Promise<ProjectBundle> {
    const manifest = JSON.parse(await readFile(join(projectPath, "manifest.json"), "utf8"));
    const objects = {
      characters: JSON.parse(await readFile(join(projectPath, "objects", "characters.json"), "utf8")),
      factions: JSON.parse(await readFile(join(projectPath, "objects", "factions.json"), "utf8")),
      locations: JSON.parse(await readFile(join(projectPath, "objects", "locations.json"), "utf8")),
      items: JSON.parse(await readFile(join(projectPath, "objects", "items.json"), "utf8")),
      realmSystems: JSON.parse(await readFile(join(projectPath, "objects", "realm-systems.json"), "utf8")),
      events: JSON.parse(await readFile(join(projectPath, "objects", "events.json"), "utf8")),
      relations: JSON.parse(await readFile(join(projectPath, "objects", "relations.json"), "utf8")),
      clues: JSON.parse(await readFile(join(projectPath, "objects", "clues.json"), "utf8")),
      arcs: JSON.parse(await readFile(join(projectPath, "objects", "arcs.json"), "utf8"))
    };
    const views = {
      graphLayouts: JSON.parse(await readFile(join(projectPath, "views", "graph-layouts.json"), "utf8")),
      trackPresets: JSON.parse(await readFile(join(projectPath, "views", "track-presets.json"), "utf8")),
      savedFilters: JSON.parse(await readFile(join(projectPath, "views", "saved-filters.json"), "utf8"))
    };

    return parseProjectBundle({ manifest, objects, views });
  }

  private async writeBundle(projectPath: string, bundle: ProjectBundle) {
    await writeFile(join(projectPath, "manifest.json"), JSON.stringify(bundle.manifest, null, 2) + "\n", "utf8");
    await writeFile(join(projectPath, "schema-version.json"), JSON.stringify({ version: "1.0.0" }, null, 2) + "\n", "utf8");

    for (const name of collectionNames) {
      const fileName = collectionFileMap[name];
      await writeFile(join(projectPath, "objects", fileName), JSON.stringify(bundle.objects[name], null, 2) + "\n", "utf8");
    }

    await writeFile(join(projectPath, "views", "graph-layouts.json"), JSON.stringify(bundle.views.graphLayouts, null, 2) + "\n", "utf8");
    await writeFile(join(projectPath, "views", "track-presets.json"), JSON.stringify(bundle.views.trackPresets, null, 2) + "\n", "utf8");
    await writeFile(join(projectPath, "views", "saved-filters.json"), JSON.stringify(bundle.views.savedFilters, null, 2) + "\n", "utf8");
  }
}
```

```ts
// /home/wgw/CodexProject/NovelStoryManager/apps/service/src/app.ts
import Fastify from "fastify";
import { collectionNames } from "@novelstory/schema";
import { ProjectStore } from "./lib/project-store";

type CollectionName = (typeof collectionNames)[number];

export function buildApp() {
  const app = Fastify({ logger: false });
  const store = new ProjectStore();

  app.post("/api/projects/open", async (request) => {
    const body = request.body as { projectPath: string };
    return store.openProject(body.projectPath);
  });

  app.post("/api/projects/create", async (request) => {
    const body = request.body as {
      parentDir: string;
      projectSlug: string;
      title: string;
    };
    return store.createProject(body);
  });

  app.get("/api/projects/:projectId/objects/:collectionName", async (request) => {
    const params = request.params as {
      projectId: string;
      collectionName: CollectionName;
    };
    return {
      items: await store.readCollection(params.projectId, params.collectionName)
    };
  });

  app.put("/api/projects/:projectId/objects/:collectionName", async (request) => {
    const params = request.params as { projectId: string; collectionName: CollectionName };
    const body = request.body as { items: unknown[] };
    return store.saveCollection(params.projectId, params.collectionName, body.items);
  });

  return app;
}
```

```json
// /home/wgw/CodexProject/NovelStoryManager/apps/service/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

```ts
// /home/wgw/CodexProject/NovelStoryManager/apps/service/src/server.ts
import { buildApp } from "./app";

const app = buildApp();

app.listen({
  host: "127.0.0.1",
  port: 4318
}).catch((error) => {
  app.log.error(error);
  process.exit(1);
});
```

- [ ] **Step 4: Run the service tests to verify they pass**

Run: `npm run test --workspace @novelstory/service`
Expected: PASS with `2 passed`

- [ ] **Step 5: Commit**

```bash
git add apps/service
git commit -m "feat: add local project service"
```

## Task 4: Build the web shell with persistent object library and knowledge view

**Files:**
- Create: `/home/wgw/CodexProject/NovelStoryManager/apps/web/tsconfig.json`
- Create: `/home/wgw/CodexProject/NovelStoryManager/apps/web/vite.config.ts`
- Create: `/home/wgw/CodexProject/NovelStoryManager/apps/web/src/main.tsx`
- Create: `/home/wgw/CodexProject/NovelStoryManager/apps/web/src/App.tsx`
- Create: `/home/wgw/CodexProject/NovelStoryManager/apps/web/src/App.test.tsx`
- Create: `/home/wgw/CodexProject/NovelStoryManager/apps/web/src/api/projects.ts`
- Create: `/home/wgw/CodexProject/NovelStoryManager/apps/web/src/components/ObjectLibrary.tsx`
- Create: `/home/wgw/CodexProject/NovelStoryManager/apps/web/src/components/KnowledgeView.tsx`
- Create: `/home/wgw/CodexProject/NovelStoryManager/apps/web/src/styles.css`
- Create: `/home/wgw/CodexProject/NovelStoryManager/apps/web/src/test/setup.ts`
- Test: `/home/wgw/CodexProject/NovelStoryManager/apps/web/src/App.test.tsx`

- [ ] **Step 1: Write the failing UI tests**

```tsx
// /home/wgw/CodexProject/NovelStoryManager/apps/web/src/App.test.tsx
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

const fetchMock = vi.fn();
globalThis.fetch = fetchMock as typeof fetch;

beforeEach(() => {
  fetchMock.mockReset();
});

describe("App", () => {
  it("renders the persistent object library and loads characters into the knowledge view", async () => {
    fetchMock
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            projectId: "sample-novel",
            manifest: { title: "青岚山门录" },
            counts: {
              characters: 1,
              factions: 1,
              locations: 1,
              items: 0,
              realmSystems: 1,
              events: 1,
              relations: 1,
              clues: 0,
              arcs: 1
            }
          })
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            items: [
              {
                id: "char-linxuan",
                name: "林玄",
                summary: "故事主角，青岚宗真传弟子。",
                tags: ["主角", "剑修"],
                status: "active",
                identity: "青岚宗真传",
                realmState: "金丹初期"
              }
            ]
          })
        )
      );

    render(<App />);

    fireEvent.change(screen.getByLabelText("Project Path"), {
      target: { value: "/tmp/sample-novel" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Open Project" }));

    expect(await screen.findByText("对象库")).toBeInTheDocument();
    expect(await screen.findByText("林玄")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Knowledge" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("edits a selected object and saves the collection", async () => {
    fetchMock
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            projectId: "sample-novel",
            manifest: { title: "青岚山门录" },
            counts: {
              characters: 1,
              factions: 0,
              locations: 0,
              items: 0,
              realmSystems: 0,
              events: 0,
              relations: 0,
              clues: 0,
              arcs: 0
            }
          })
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            items: [
              {
                id: "char-linxuan",
                name: "林玄",
                summary: "旧摘要",
                tags: ["主角"],
                status: "active",
                identity: "青岚宗真传",
                realmState: "金丹初期"
              }
            ]
          })
        )
      )
      .mockResolvedValueOnce(new Response(JSON.stringify({ saved: true, count: 1 })));

    render(<App />);

    fireEvent.change(screen.getByLabelText("Project Path"), {
      target: { value: "/tmp/sample-novel" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Open Project" }));
    fireEvent.click(await screen.findByText("林玄"));
    fireEvent.change(screen.getByLabelText("Summary"), {
      target: { value: "更新后的摘要" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Save Collection" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenLastCalledWith(
        "/api/projects/sample-novel/objects/characters",
        expect.objectContaining({ method: "PUT" })
      );
    });
  });
});
```

- [ ] **Step 2: Run the UI tests to verify they fail**

Run: `npm run test --workspace @novelstory/web`
Expected: FAIL with `Cannot find module './App'`

- [ ] **Step 3: Implement the app shell, API client, and knowledge view**

```ts
// /home/wgw/CodexProject/NovelStoryManager/apps/web/src/api/projects.ts
export async function openProject(projectPath: string) {
  const response = await fetch("/api/projects/open", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectPath })
  });
  return response.json();
}

export async function createProject(input: {
  parentDir: string;
  projectSlug: string;
  title: string;
}) {
  const response = await fetch("/api/projects/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });
  return response.json();
}

export async function loadCollection(projectId: string, collectionName: string) {
  const response = await fetch(`/api/projects/${projectId}/objects/${collectionName}`);
  return response.json();
}

export async function saveCollection(projectId: string, collectionName: string, items: unknown[]) {
  const response = await fetch(`/api/projects/${projectId}/objects/${collectionName}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items })
  });
  return response.json();
}
```

```tsx
// /home/wgw/CodexProject/NovelStoryManager/apps/web/src/components/ObjectLibrary.tsx
type Counts = Record<string, number>;

export function ObjectLibrary(props: {
  counts: Counts;
  activeCollection: string;
  onSelectCollection: (collectionName: string) => void;
}) {
  return (
    <aside className="sidebar">
      <h2>对象库</h2>
      <ul>
        {Object.entries(props.counts).map(([name, count]) => (
          <li key={name}>
            <button
              className={name === props.activeCollection ? "active" : ""}
              onClick={() => props.onSelectCollection(name)}
            >
              {name} ({count})
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
```

```tsx
// /home/wgw/CodexProject/NovelStoryManager/apps/web/src/components/KnowledgeView.tsx
type StoryObject = Record<string, unknown> & { id: string; name: string };

export function KnowledgeView(props: {
  items: StoryObject[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onChange: (nextItem: StoryObject) => void;
  onSave: () => void;
}) {
  const selectedItem = props.items.find((item) => item.id === props.selectedId) ?? null;

  return (
    <section className="knowledge-view">
      <div className="object-list">
        {props.items.map((item) => (
          <button key={item.id} onClick={() => props.onSelect(item.id)}>
            {item.name}
          </button>
        ))}
      </div>
      <div className="detail-panel">
        {selectedItem ? (
          <>
            <label>
              Name
              <input
                value={String(selectedItem.name ?? "")}
                onChange={(event) =>
                  props.onChange({ ...selectedItem, name: event.target.value })
                }
              />
            </label>
            <label>
              Summary
              <textarea
                aria-label="Summary"
                value={String(selectedItem.summary ?? "")}
                onChange={(event) =>
                  props.onChange({ ...selectedItem, summary: event.target.value })
                }
              />
            </label>
            <button onClick={props.onSave}>Save Collection</button>
          </>
        ) : (
          <p>请选择左侧对象开始编辑。</p>
        )}
      </div>
    </section>
  );
}
```

```tsx
// /home/wgw/CodexProject/NovelStoryManager/apps/web/src/App.tsx
import { useState } from "react";
import { loadCollection, openProject, saveCollection } from "./api/projects";
import { KnowledgeView } from "./components/KnowledgeView";
import { ObjectLibrary } from "./components/ObjectLibrary";
import "./styles.css";

type OpenResult = {
  projectId: string;
  manifest: { title: string };
  counts: Record<string, number>;
};

type StoryObject = Record<string, unknown> & { id: string; name: string };

export default function App() {
  const [projectPath, setProjectPath] = useState("");
  const [project, setProject] = useState<OpenResult | null>(null);
  const [activeCollection, setActiveCollection] = useState("characters");
  const [items, setItems] = useState<StoryObject[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"Knowledge" | "Graph" | "Tracks">("Knowledge");

  async function handleOpenProject() {
    const nextProject = await openProject(projectPath);
    setProject(nextProject);
    const collectionResult = await loadCollection(nextProject.projectId, "characters");
    setItems(collectionResult.items);
    setSelectedId(collectionResult.items[0]?.id ?? null);
  }

  async function handleSelectCollection(collectionName: string) {
    if (!project) return;
    setActiveCollection(collectionName);
    const collectionResult = await loadCollection(project.projectId, collectionName);
    setItems(collectionResult.items);
    setSelectedId(collectionResult.items[0]?.id ?? null);
  }

  async function handleSave() {
    if (!project) return;
    await saveCollection(project.projectId, activeCollection, items);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <label>
          Project Path
          <input value={projectPath} onChange={(event) => setProjectPath(event.target.value)} />
        </label>
        <button onClick={handleOpenProject}>Open Project</button>
        <div className="tabs">
          {["Knowledge", "Graph", "Tracks"].map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab as "Knowledge" | "Graph" | "Tracks")}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <main className="workspace">
        {project ? (
          <>
            <ObjectLibrary
              counts={project.counts}
              activeCollection={activeCollection}
              onSelectCollection={handleSelectCollection}
            />
            {activeTab === "Knowledge" ? (
              <KnowledgeView
                items={items}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onChange={(nextItem) =>
                  setItems((current) =>
                    current.map((item) => (item.id === nextItem.id ? nextItem : item))
                  )
                }
                onSave={handleSave}
              />
            ) : (
              <section className="placeholder">
                {activeTab} view is planned for later milestones.
              </section>
            )}
          </>
        ) : (
          <section className="empty-state">先打开一个小说项目。</section>
        )}
      </main>
    </div>
  );
}
```

```json
// /home/wgw/CodexProject/NovelStoryManager/apps/web/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "types": ["vitest/globals", "@testing-library/jest-dom"],
    "baseUrl": "."
  },
  "include": ["src", "vite.config.ts"]
}
```

```ts
// /home/wgw/CodexProject/NovelStoryManager/apps/web/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4173,
    proxy: {
      "/api": "http://127.0.0.1:4318"
    }
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts"
  }
});
```

```tsx
// /home/wgw/CodexProject/NovelStoryManager/apps/web/src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

```ts
// /home/wgw/CodexProject/NovelStoryManager/apps/web/src/test/setup.ts
import "@testing-library/jest-dom/vitest";
```

```css
/* /home/wgw/CodexProject/NovelStoryManager/apps/web/src/styles.css */
body {
  margin: 0;
  font-family: "Noto Sans SC", sans-serif;
  background: #f3f5f8;
  color: #1f2937;
}

.app-shell {
  min-height: 100vh;
}

.topbar {
  display: flex;
  gap: 12px;
  align-items: end;
  padding: 16px;
  border-bottom: 1px solid #d7dde5;
  background: #ffffff;
}

.workspace {
  display: grid;
  grid-template-columns: 280px 1fr;
  min-height: calc(100vh - 73px);
}

.sidebar {
  border-right: 1px solid #d7dde5;
  padding: 16px;
  background: #fbfcfd;
}

.knowledge-view {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 16px;
  padding: 16px;
}
```

- [ ] **Step 4: Run the UI tests and typecheck**

Run: `npm run test --workspace @novelstory/web && npm run typecheck --workspace @novelstory/web`
Expected: PASS with `2 passed`, then `tsc` exits with code `0`

- [ ] **Step 5: Commit**

```bash
git add apps/web
git commit -m "feat: add knowledge view shell"
```

## Task 5: Wire the create-project UI flow and add developer startup docs

**Files:**
- Modify: `/home/wgw/CodexProject/NovelStoryManager/apps/web/src/App.test.tsx`
- Modify: `/home/wgw/CodexProject/NovelStoryManager/apps/web/src/App.tsx`
- Create: `/home/wgw/CodexProject/NovelStoryManager/README.md`
- Test: `/home/wgw/CodexProject/NovelStoryManager/apps/web/src/App.test.tsx`

- [ ] **Step 1: Add the failing UI test for create-project flow**

```tsx
// Add to /home/wgw/CodexProject/NovelStoryManager/apps/web/src/App.test.tsx
it("creates a new project from the header form", async () => {
  fetchMock.mockResolvedValueOnce(
    new Response(
      JSON.stringify({
        projectId: "brand-new-novel",
        manifest: { title: "新建小说" },
        counts: {
          characters: 0,
          factions: 0,
          locations: 0,
          items: 0,
          realmSystems: 0,
          events: 0,
          relations: 0,
          clues: 0,
          arcs: 0
        }
      })
    )
  );

  render(<App />);

  fireEvent.change(screen.getByLabelText("Project Parent Dir"), {
    target: { value: "/tmp" }
  });
  fireEvent.change(screen.getByLabelText("Project Slug"), {
    target: { value: "brand-new-novel" }
  });
  fireEvent.change(screen.getByLabelText("Project Title"), {
    target: { value: "新建小说" }
  });
  fireEvent.click(screen.getByRole("button", { name: "Create Project" }));

  await waitFor(() => {
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/projects/create",
      expect.objectContaining({ method: "POST" })
    );
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test --workspace @novelstory/web`
Expected: FAIL because the `Create Project` form fields and button handler do not exist yet

- [ ] **Step 3: Implement create-project flow and root developer README**

```tsx
// Add to /home/wgw/CodexProject/NovelStoryManager/apps/web/src/App.tsx
import { createProject, loadCollection, openProject, saveCollection } from "./api/projects";

const [createParentDir, setCreateParentDir] = useState("");
const [createSlug, setCreateSlug] = useState("");
const [createTitle, setCreateTitle] = useState("");

async function handleCreateProject() {
  const nextProject = await createProject({
    parentDir: createParentDir,
    projectSlug: createSlug,
    title: createTitle
  });
  setProject(nextProject);
  setActiveCollection("characters");
  setItems([]);
  setSelectedId(null);
}
```

```tsx
// Add inside the <header className="topbar"> block in /home/wgw/CodexProject/NovelStoryManager/apps/web/src/App.tsx
<label>
  Project Parent Dir
  <input value={createParentDir} onChange={(event) => setCreateParentDir(event.target.value)} />
</label>
<label>
  Project Slug
  <input value={createSlug} onChange={(event) => setCreateSlug(event.target.value)} />
</label>
<label>
  Project Title
  <input value={createTitle} onChange={(event) => setCreateTitle(event.target.value)} />
</label>
<button onClick={handleCreateProject}>Create Project</button>
```

```md
<!-- /home/wgw/CodexProject/NovelStoryManager/README.md -->
# NovelStoryManager

## Project foundation startup

1. Install dependencies with `npm install`
2. Start the local service with `npm run dev:service`
3. Start the web app with `npm run dev:web`
4. Open the sample fixture project at `fixtures/projects/sample-novel`

## Current milestone

This repository currently targets `WBS 2.1`: file-backed single-project storage and the knowledge view shell.
```

- [ ] **Step 4: Run the full project foundation verification**

Run: `npm run test && npm run typecheck`
Expected: PASS across all workspaces with no failing tests and no TypeScript errors

Run: `npm run dev:service`
Expected: Fastify service listens on `http://127.0.0.1:4318`

Run: `npm run dev:web`
Expected: Vite starts and prints a local browser URL

- [ ] **Step 5: Commit**

```bash
git add README.md apps/web/src/App.tsx apps/web/src/App.test.tsx
git commit -m "feat: finish m1 project foundation flow"
```

## Validation Checklist

After all tasks are complete, rerun these commands in order:

1. `node --test scripts/workspace-smoke.test.mjs`
2. `npm run test --workspace @novelstory/schema`
3. `npm run test --workspace @novelstory/service`
4. `npm run test --workspace @novelstory/web`
5. `npm run test`
6. `npm run typecheck`

Expected result:

1. All tests pass
2. Workspace commands run from repo root
3. Opening `fixtures/projects/sample-novel` shows a persistent left object library
4. Editing an object in the knowledge view persists back to the matching JSON file
5. Graph and track tabs are visible but remain placeholder-only in `WBS 2.1`

## Spec Coverage Check

This plan covers the approved design as follows:

1. File-backed single-novel project: Tasks 2 and 3
2. Schema validation and import-ready normalized data: Tasks 2 and 3
3. Persistent left object library: Task 4
4. Knowledge view as the primary work area: Task 4
5. Project create/open/save flow: Tasks 3 and 5
6. Graph and track views deferred but structurally acknowledged: Task 4 placeholders and Scope Lock exclusions

No graph implementation or track implementation is included in this plan.
