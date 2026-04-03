import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  chapterSliceSchema,
  createObjectBatch,
  createProjectBundle,
  collectionSchemaByType,
  createEmptyProjectData,
  graphLayoutSchema,
  objectTypeNames,
  parseObjectBatch,
  parseProjectBundle,
  parseProjectData,
  trackPresetSchema,
  viewFileNames,
  type ObjectBatch,
  type ObjectTypeName,
  type PartialObjectCollections,
  type ProjectData,
  type ProjectBundle,
  type StoryObject
} from "@novelstory/schema";

function formatJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

async function readJsonFile(filePath: string): Promise<unknown> {
  return JSON.parse(await readFile(filePath, "utf8")) as unknown;
}

async function writeJsonFile(filePath: string, value: unknown): Promise<void> {
  await writeFile(filePath, formatJson(value), "utf8");
}

function objectFilePath(projectPath: string, objectType: ObjectTypeName): string {
  return path.join(projectPath, "objects", `${objectType}.json`);
}

function viewFilePath(
  projectPath: string,
  viewFileName: (typeof viewFileNames)[number]
): string {
  return path.join(projectPath, "views", `${viewFileName}.json`);
}

export class ProjectStoreValidationError extends Error {}

const objectIdPrefixByType: Record<ObjectTypeName, string> = {
  characters: "char",
  factions: "faction",
  locations: "loc",
  items: "item",
  "realm-systems": "realm",
  events: "event",
  relations: "rel",
  clues: "clue",
  arcs: "arc"
};

function buildNextObjectId(
  collection: Array<{ id: string }>,
  objectType: ObjectTypeName
): string {
  const prefix = objectIdPrefixByType[objectType];
  let counter = collection.length + 1;

  while (true) {
    const candidate = `${prefix}_new_${String(counter).padStart(3, "0")}`;

    if (!collection.some((item) => item.id === candidate)) {
      return candidate;
    }

    counter += 1;
  }
}

function getAnyExistingObjectId(project: ProjectData): string | undefined {
  for (const objectType of objectTypeNames) {
    const first = project.objects[objectType][0];

    if (first) {
      return first.id;
    }
  }

  return undefined;
}

function createDefaultObjectSeed(
  project: ProjectData,
  objectType: ObjectTypeName,
  id: string,
  index: number
): Record<string, unknown> {
  const fallbackRef = getAnyExistingObjectId(project);

  switch (objectType) {
    case "characters":
      return {
        id,
        name: `新角色${index}`,
        aliases: [],
        tags: [],
        summary: "",
        status: "active",
        identity: "",
        factionRefs: [],
        realmState: "",
        notes: ""
      };
    case "factions":
      return {
        id,
        name: `新势力${index}`,
        aliases: [],
        tags: [],
        summary: "",
        type: "faction",
        goal: "",
        status: "active",
        locationRefs: []
      };
    case "locations":
      return {
        id,
        name: `新地点${index}`,
        aliases: [],
        tags: [],
        summary: "",
        type: "location",
        traits: [],
        status: "active"
      };
    case "items":
      return {
        id,
        name: `新物品${index}`,
        aliases: [],
        tags: [],
        summary: "",
        type: "item",
        origin: "",
        status: "active",
        traits: []
      };
    case "realm-systems":
      return {
        id,
        name: `新体系${index}`,
        type: "realm-system",
        summary: "",
        levels: [],
        rules: [],
        tags: []
      };
    case "events":
      return {
        id,
        name: `新事件${index}`,
        aliases: [],
        tags: [],
        summary: "",
        type: "event",
        participantRefs: [],
        locationRefs: [],
        factionRefs: [],
        itemRefs: [],
        timeAnchor: "",
        preconditions: [],
        results: [],
        arcRefs: [],
        clueRefs: []
      };
    case "relations":
      return {
        id,
        type: "association",
        sourceRef: fallbackRef ?? "char_suxuan",
        targetRef: fallbackRef ?? "char_suxuan",
        direction: "forward",
        strength: 0.5,
        startAnchor: "",
        endAnchor: "",
        summary: "",
        tags: []
      };
    case "clues":
      return {
        id,
        name: `新线索${index}`,
        summary: "",
        status: "hidden",
        objectRefs: [],
        eventRefs: [],
        revealCondition: "",
        tags: []
      };
    case "arcs":
      return {
        id,
        name: `新剧情线${index}`,
        summary: "",
        status: "active",
        eventRefs: [],
        objectRefs: [],
        tags: []
      };
  }
}

function setProjectCollection<TObjectType extends ObjectTypeName>(
  collections: ProjectData["objects"],
  objectType: TObjectType,
  value: ProjectData["objects"][TObjectType]
): void {
  collections[objectType] = value;
}

function setBatchCollection<TObjectType extends ObjectTypeName>(
  collections: PartialObjectCollections,
  objectType: TObjectType,
  value: ProjectData["objects"][TObjectType]
): void {
  collections[objectType] = value;
}

function mergeCollectionForObjectType<TObjectType extends ObjectTypeName>(
  project: ProjectData,
  batch: ObjectBatch,
  objectType: TObjectType
): ProjectData["objects"][TObjectType] {
  const incomingCollection = batch.objects[objectType];

  if (!incomingCollection) {
    return project.objects[objectType];
  }

  return mergeCollectionById(
    project.objects[objectType] as Array<{ id: string }>,
    incomingCollection as Array<{ id: string }>
  ) as ProjectData["objects"][TObjectType];
}

function mergeCollectionById<T extends { id: string }>(
  existing: T[],
  incoming: T[]
): T[] {
  const incomingById = new Map(incoming.map((item) => [
    item.id,
    item
  ]));
  const existingIds = new Set(existing.map((item) => item.id));

  const merged = existing.map((item) => incomingById.get(item.id) ?? item);
  const appended = incoming.filter((item) => !existingIds.has(item.id));

  return [
    ...merged,
    ...appended
  ];
}

function mergeObjectBatchIntoProject(
  project: ProjectData,
  batch: ObjectBatch
): ProjectData {
  const nextObjects: ProjectData["objects"] = {
    ...project.objects
  };

  for (const objectType of objectTypeNames) {
    setProjectCollection(
      nextObjects,
      objectType,
      mergeCollectionForObjectType(project, batch, objectType)
    );
  }

  return parseProjectData({
    ...project,
    objects: nextObjects
  });
}

export async function loadProject(projectPath: string): Promise<ProjectData> {
  const manifest = await readJsonFile(path.join(projectPath, "manifest.json"));
  const schemaVersion = await readJsonFile(
    path.join(projectPath, "schema-version.json")
  );

  const objectEntries = await Promise.all(
    objectTypeNames.map(async (objectType) => [
      objectType,
      await readJsonFile(objectFilePath(projectPath, objectType))
    ])
  );
  const viewEntries = await Promise.all(
    viewFileNames.map(async (viewFileName) => [
      viewFileName,
      await readJsonFile(viewFilePath(projectPath, viewFileName))
    ])
  );

  return parseProjectData({
    manifest,
    schemaVersion,
    objects: Object.fromEntries(objectEntries),
    views: Object.fromEntries(viewEntries)
  });
}

export async function saveProject(
  projectPath: string,
  project: ProjectData
): Promise<void> {
  await mkdir(path.join(projectPath, "objects"), { recursive: true });
  await mkdir(path.join(projectPath, "views"), { recursive: true });

  await writeJsonFile(path.join(projectPath, "manifest.json"), project.manifest);
  await writeJsonFile(
    path.join(projectPath, "schema-version.json"),
    project.schemaVersion
  );

  await Promise.all(
    objectTypeNames.map((objectType) =>
      writeJsonFile(objectFilePath(projectPath, objectType), project.objects[objectType])
    )
  );
  await Promise.all(
    viewFileNames.map((viewFileName) =>
      writeJsonFile(viewFilePath(projectPath, viewFileName), project.views[viewFileName])
    )
  );
}

export async function createProject(input: {
  projectPath: string;
  projectId: string;
  title: string;
  description?: string | undefined;
}): Promise<ProjectData> {
  const project = createEmptyProjectData({
    projectId: input.projectId,
    title: input.title,
    description: input.description
  });

  await saveProject(input.projectPath, project);
  return project;
}

export async function exportProjectBundle(
  projectPath: string
): Promise<ProjectBundle> {
  const project = await loadProject(projectPath);

  return createProjectBundle({
    project
  });
}

export async function importProjectBundle(input: {
  projectPath: string;
  bundle: unknown;
}): Promise<ProjectData> {
  const parsed = parseProjectBundle(input.bundle);

  await saveProject(input.projectPath, parsed.project);

  return parsed.project;
}

export async function exportObjectBatch(input: {
  projectPath: string;
  objectTypes: ObjectTypeName[];
}): Promise<ObjectBatch> {
  const project = await loadProject(input.projectPath);
  const objects: PartialObjectCollections = {};

  for (const objectType of input.objectTypes) {
    setBatchCollection(objects, objectType, project.objects[objectType]);
  }

  return createObjectBatch({
    targetProjectId: project.manifest.projectId,
    sourceProjectId: project.manifest.projectId,
    objectTypes: input.objectTypes,
    objects
  });
}

export async function importObjectBatch(input: {
  projectPath: string;
  bundle: unknown;
}): Promise<ProjectData> {
  const project = await loadProject(input.projectPath);
  const batch = parseObjectBatch(input.bundle);

  if (batch.scope.targetProjectId !== project.manifest.projectId) {
    throw new ProjectStoreValidationError(
      `Object batch target project ${batch.scope.targetProjectId} does not match ${project.manifest.projectId}.`
    );
  }

  const nextProject = mergeObjectBatchIntoProject(project, batch);

  await saveProject(input.projectPath, nextProject);

  return nextProject;
}

export async function updateObject(input: {
  projectPath: string;
  objectType: ObjectTypeName;
  objectId: string;
  changes: Record<string, unknown>;
}): Promise<StoryObject> {
  const project = await loadProject(input.projectPath);
  const collection = project.objects[input.objectType];
  const index = collection.findIndex((item) => item.id === input.objectId);

  if (index === -1) {
    throw new Error(
      `Object ${input.objectId} was not found in ${input.objectType}.`
    );
  }

  const schema = collectionSchemaByType[input.objectType];
  const updatedObject = schema.parse({
    ...collection[index],
    ...input.changes
  }) as StoryObject;

  const nextCollection = collection.map((item, itemIndex) =>
    itemIndex === index ? updatedObject : item
  );

  await writeJsonFile(objectFilePath(input.projectPath, input.objectType), nextCollection);

  return updatedObject;
}

export async function createObject(input: {
  projectPath: string;
  objectType: ObjectTypeName;
  seed?: Record<string, unknown>;
}): Promise<StoryObject> {
  const project = await loadProject(input.projectPath);
  const collection = project.objects[input.objectType];
  const nextId = buildNextObjectId(collection, input.objectType);
  const schema = collectionSchemaByType[input.objectType];
  const nextObject = schema.parse({
    ...createDefaultObjectSeed(
      project,
      input.objectType,
      nextId,
      collection.length + 1
    ),
    ...(input.seed ?? {}),
    id: String((input.seed as { id?: string } | undefined)?.id ?? nextId)
  }) as StoryObject;

  await writeJsonFile(objectFilePath(input.projectPath, input.objectType), [
    ...collection,
    nextObject
  ]);

  return nextObject;
}

export async function updateGraphLayout(input: {
  projectPath: string;
  layout: ProjectData["views"]["graph-layouts"][number];
}): Promise<ProjectData["views"]["graph-layouts"][number]> {
  const project = await loadProject(input.projectPath);
  const nextLayout = graphLayoutSchema.parse(input.layout);
  const existingLayouts = project.views["graph-layouts"];
  const index = existingLayouts.findIndex((layout) => layout.id === nextLayout.id);
  const nextLayouts = index === -1
    ? [
        ...existingLayouts,
        nextLayout
      ]
    : existingLayouts.map((layout, layoutIndex) =>
        layoutIndex === index ? nextLayout : layout
      );

  const nextProject = parseProjectData({
    ...project,
    views: {
      ...project.views,
      "graph-layouts": nextLayouts
    }
  });

  await writeJsonFile(
    viewFilePath(input.projectPath, "graph-layouts"),
    nextProject.views["graph-layouts"]
  );

  return nextLayout;
}

export async function updateTrackPreset(input: {
  projectPath: string;
  preset: ProjectData["views"]["track-presets"][number];
}): Promise<ProjectData["views"]["track-presets"][number]> {
  const project = await loadProject(input.projectPath);
  const nextPreset = trackPresetSchema.parse(input.preset);
  const existingPresets = project.views["track-presets"];
  const index = existingPresets.findIndex((preset) => preset.id === nextPreset.id);
  const nextPresets = index === -1
    ? [
        ...existingPresets,
        nextPreset
      ]
    : existingPresets.map((preset, presetIndex) =>
        presetIndex === index ? nextPreset : preset
      );

  const nextProject = parseProjectData({
    ...project,
    views: {
      ...project.views,
      "track-presets": nextPresets
    }
  });

  await writeJsonFile(
    viewFilePath(input.projectPath, "track-presets"),
    nextProject.views["track-presets"]
  );

  return nextPreset;
}

export async function updateChapterSlice(input: {
  projectPath: string;
  slice: ProjectData["views"]["chapter-slices"][number];
}): Promise<ProjectData["views"]["chapter-slices"][number]> {
  const project = await loadProject(input.projectPath);
  const nextSlice = chapterSliceSchema.parse(input.slice);
  const existingSlices = project.views["chapter-slices"];
  const index = existingSlices.findIndex((slice) => slice.id === nextSlice.id);
  const nextSlices = index === -1
    ? [
        ...existingSlices,
        nextSlice
      ]
    : existingSlices.map((slice, sliceIndex) =>
        sliceIndex === index ? nextSlice : slice
      );

  const nextProject = parseProjectData({
    ...project,
    views: {
      ...project.views,
      "chapter-slices": nextSlices
    }
  });

  await writeJsonFile(
    viewFilePath(input.projectPath, "chapter-slices"),
    nextProject.views["chapter-slices"]
  );

  return nextSlice;
}
