import { z } from "zod";

export const objectTypeNames = [
  "characters",
  "factions",
  "locations",
  "items",
  "realm-systems",
  "events",
  "relations",
  "clues",
  "arcs"
] as const;

export const viewFileNames = [
  "graph-layouts",
  "track-presets",
  "saved-filters"
] as const;

export const supportedSchemaVersions = [
  "1.0.0"
] as const;

export const supportedBundleVersions = [
  "1.0.0"
] as const;

export const objectTypeNameSchema = z.enum(objectTypeNames);
export const viewFileNameSchema = z.enum(viewFileNames);

const nonEmptyString = z.string().min(1);
const stringListSchema = z.array(nonEmptyString).default([]);
const refListSchema = z.array(nonEmptyString).default([]);

function ensureSupportedVersion(
  version: string,
  supportedVersions: readonly string[],
  label: string,
  ctx: z.RefinementCtx
): void {
  if (!supportedVersions.includes(version)) {
    ctx.addIssue({
      code: "custom",
      message: `Unsupported ${label}: ${version}`
    });
  }
}

function createEmptyObjectCollectionsInput() {
  return {
    characters: [],
    factions: [],
    locations: [],
    items: [],
    "realm-systems": [],
    events: [],
    relations: [],
    clues: [],
    arcs: []
  };
}

function createEmptyViewCollectionsInput() {
  return {
    "graph-layouts": [],
    "track-presets": [],
    "saved-filters": []
  };
}

function createTypeIdSetMap(): Record<ObjectTypeName, Set<string>> {
  return {
    characters: new Set<string>(),
    factions: new Set<string>(),
    locations: new Set<string>(),
    items: new Set<string>(),
    "realm-systems": new Set<string>(),
    events: new Set<string>(),
    relations: new Set<string>(),
    clues: new Set<string>(),
    arcs: new Set<string>()
  };
}

function addDuplicateIdIssues(input: {
  collections: Partial<Record<ObjectTypeName, Array<{ id: string }> | undefined>>;
  ctx: z.RefinementCtx;
  rootPath: string[];
}): void {
  const globalOwnerById = new Map<string, ObjectTypeName>();

  for (const objectType of objectTypeNames) {
    const collection = input.collections[objectType];

    if (!collection) {
      continue;
    }

    const idsInCollection = new Set<string>();

    collection.forEach((item, index) => {
      if (idsInCollection.has(item.id)) {
        input.ctx.addIssue({
          code: "custom",
          message: `Found duplicate object id ${item.id} in ${objectType}.`,
          path: [
            ...input.rootPath,
            objectType,
            index,
            "id"
          ]
        });
        return;
      }

      idsInCollection.add(item.id);

      const previousOwner = globalOwnerById.get(item.id);

      if (previousOwner) {
        input.ctx.addIssue({
          code: "custom",
          message:
            `Found duplicate object id ${item.id} across ${previousOwner} and ${objectType}.`,
          path: [
            ...input.rootPath,
            objectType,
            index,
            "id"
          ]
        });
        return;
      }

      globalOwnerById.set(item.id, objectType);
    });
  }
}

function addMissingRefIssue(input: {
  ref: string;
  messagePrefix: string;
  path: Array<string | number>;
  allowedIds: Set<string>;
  ctx: z.RefinementCtx;
}): void {
  if (input.allowedIds.has(input.ref)) {
    return;
  }

  input.ctx.addIssue({
    code: "custom",
    message: `${input.messagePrefix} ${input.ref}.`,
    path: input.path
  });
}

const baseNamedObjectSchema = z.object({
  id: nonEmptyString,
  name: nonEmptyString,
  aliases: stringListSchema,
  tags: stringListSchema,
  summary: z.string().default("")
});

export const characterSchema = baseNamedObjectSchema.extend({
  status: z.string().default("active"),
  identity: z.string().default(""),
  factionRefs: refListSchema,
  realmState: z.string().default(""),
  notes: z.string().default("")
});

export const factionSchema = baseNamedObjectSchema.extend({
  type: z.string().default("faction"),
  parentFactionRef: z.string().optional(),
  goal: z.string().default(""),
  status: z.string().default("active"),
  locationRefs: refListSchema
});

export const locationSchema = baseNamedObjectSchema.extend({
  type: z.string().default("location"),
  parentLocationRef: z.string().optional(),
  controllerRef: z.string().optional(),
  traits: stringListSchema,
  status: z.string().default("active")
});

export const itemSchema = baseNamedObjectSchema.extend({
  type: z.string().default("item"),
  ownerRef: z.string().optional(),
  origin: z.string().default(""),
  status: z.string().default("active"),
  traits: stringListSchema
});

export const realmSystemSchema = z.object({
  id: nonEmptyString,
  name: nonEmptyString,
  type: z.string().default("realm-system"),
  summary: z.string().default(""),
  levels: stringListSchema,
  rules: stringListSchema,
  tags: stringListSchema
});

export const eventSchema = baseNamedObjectSchema.extend({
  type: z.string().default("event"),
  participantRefs: refListSchema,
  locationRefs: refListSchema,
  factionRefs: refListSchema,
  itemRefs: refListSchema,
  timeAnchor: z.string().default(""),
  preconditions: stringListSchema,
  results: stringListSchema,
  arcRefs: refListSchema,
  clueRefs: refListSchema
});

export const relationSchema = z.object({
  id: nonEmptyString,
  type: nonEmptyString,
  sourceRef: nonEmptyString,
  targetRef: nonEmptyString,
  direction: z.enum([
    "forward",
    "bidirectional"
  ]).default("forward"),
  strength: z.number().min(0).max(1).default(0.5),
  startAnchor: z.string().default(""),
  endAnchor: z.string().default(""),
  summary: z.string().default(""),
  tags: stringListSchema
});

export const clueSchema = z.object({
  id: nonEmptyString,
  name: nonEmptyString,
  summary: z.string().default(""),
  status: z.string().default("hidden"),
  objectRefs: refListSchema,
  eventRefs: refListSchema,
  revealCondition: z.string().default(""),
  tags: stringListSchema
});

export const arcSchema = z.object({
  id: nonEmptyString,
  name: nonEmptyString,
  summary: z.string().default(""),
  status: z.string().default("active"),
  eventRefs: refListSchema,
  objectRefs: refListSchema,
  tags: stringListSchema
});

export const graphLayoutSchema = z.object({
  id: nonEmptyString,
  name: nonEmptyString,
  positions: z.record(
    nonEmptyString,
    z.object({
      x: z.number(),
      y: z.number()
    })
  ),
  zoom: z.number().positive().default(1)
});

export const trackPresetSchema = z.object({
  id: nonEmptyString,
  name: nonEmptyString,
  grouping: z.string().default("character"),
  laneOrder: stringListSchema,
  zoom: z.number().positive().default(1)
});

export const savedFilterSchema = z.object({
  id: nonEmptyString,
  name: nonEmptyString,
  objectType: objectTypeNameSchema,
  query: z.string().default(""),
  tags: stringListSchema
});

export const projectManifestSchema = z.object({
  projectId: nonEmptyString,
  title: nonEmptyString,
  description: z.string().default(""),
  objectTypes: z.array(objectTypeNameSchema).default([...objectTypeNames])
});

export const schemaVersionSchema = z.object({
  version: nonEmptyString.superRefine((version, ctx) => {
    ensureSupportedVersion(
      version,
      supportedSchemaVersions,
      "schema version",
      ctx
    );
  })
});

export const objectCollectionsSchema = z.object({
  characters: z.array(characterSchema),
  factions: z.array(factionSchema),
  locations: z.array(locationSchema),
  items: z.array(itemSchema),
  "realm-systems": z.array(realmSystemSchema),
  events: z.array(eventSchema),
  relations: z.array(relationSchema),
  clues: z.array(clueSchema),
  arcs: z.array(arcSchema)
});

export const viewCollectionsSchema = z.object({
  "graph-layouts": z.array(graphLayoutSchema),
  "track-presets": z.array(trackPresetSchema),
  "saved-filters": z.array(savedFilterSchema)
});

function validateProjectData(
  project: z.infer<typeof projectDataSchemaBase>,
  ctx: z.RefinementCtx
): void {
  addDuplicateIdIssues({
    collections: project.objects,
    ctx,
    rootPath: [
      "objects"
    ]
  });

  const idsByType = createTypeIdSetMap();
  const allObjectIds = new Set<string>();

  for (const objectType of objectTypeNames) {
    for (const item of project.objects[objectType]) {
      idsByType[objectType].add(item.id);
      allObjectIds.add(item.id);
    }
  }

  project.objects.characters.forEach((character, index) => {
    character.factionRefs.forEach((ref, refIndex) => {
      addMissingRefIssue({
        ref,
        messagePrefix: "Broken reference in characters.factionRefs:",
        path: [
          "objects",
          "characters",
          index,
          "factionRefs",
          refIndex
        ],
        allowedIds: idsByType.factions,
        ctx
      });
    });
  });

  project.objects.factions.forEach((faction, index) => {
    if (faction.parentFactionRef) {
      addMissingRefIssue({
        ref: faction.parentFactionRef,
        messagePrefix: "Broken reference in factions.parentFactionRef:",
        path: [
          "objects",
          "factions",
          index,
          "parentFactionRef"
        ],
        allowedIds: idsByType.factions,
        ctx
      });
    }

    faction.locationRefs.forEach((ref, refIndex) => {
      addMissingRefIssue({
        ref,
        messagePrefix: "Broken reference in factions.locationRefs:",
        path: [
          "objects",
          "factions",
          index,
          "locationRefs",
          refIndex
        ],
        allowedIds: idsByType.locations,
        ctx
      });
    });
  });

  project.objects.locations.forEach((location, index) => {
    if (location.parentLocationRef) {
      addMissingRefIssue({
        ref: location.parentLocationRef,
        messagePrefix: "Broken reference in locations.parentLocationRef:",
        path: [
          "objects",
          "locations",
          index,
          "parentLocationRef"
        ],
        allowedIds: idsByType.locations,
        ctx
      });
    }

    if (location.controllerRef) {
      addMissingRefIssue({
        ref: location.controllerRef,
        messagePrefix: "Broken reference in locations.controllerRef:",
        path: [
          "objects",
          "locations",
          index,
          "controllerRef"
        ],
        allowedIds: idsByType.factions,
        ctx
      });
    }
  });

  project.objects.items.forEach((item, index) => {
    if (item.ownerRef) {
      addMissingRefIssue({
        ref: item.ownerRef,
        messagePrefix: "Broken reference in items.ownerRef:",
        path: [
          "objects",
          "items",
          index,
          "ownerRef"
        ],
        allowedIds: allObjectIds,
        ctx
      });
    }
  });

  project.objects.events.forEach((event, index) => {
    event.participantRefs.forEach((ref, refIndex) => {
      addMissingRefIssue({
        ref,
        messagePrefix: "Broken reference in events.participantRefs:",
        path: [
          "objects",
          "events",
          index,
          "participantRefs",
          refIndex
        ],
        allowedIds: allObjectIds,
        ctx
      });
    });

    event.locationRefs.forEach((ref, refIndex) => {
      addMissingRefIssue({
        ref,
        messagePrefix: "Broken reference in events.locationRefs:",
        path: [
          "objects",
          "events",
          index,
          "locationRefs",
          refIndex
        ],
        allowedIds: idsByType.locations,
        ctx
      });
    });

    event.factionRefs.forEach((ref, refIndex) => {
      addMissingRefIssue({
        ref,
        messagePrefix: "Broken reference in events.factionRefs:",
        path: [
          "objects",
          "events",
          index,
          "factionRefs",
          refIndex
        ],
        allowedIds: idsByType.factions,
        ctx
      });
    });

    event.itemRefs.forEach((ref, refIndex) => {
      addMissingRefIssue({
        ref,
        messagePrefix: "Broken reference in events.itemRefs:",
        path: [
          "objects",
          "events",
          index,
          "itemRefs",
          refIndex
        ],
        allowedIds: idsByType.items,
        ctx
      });
    });

    event.arcRefs.forEach((ref, refIndex) => {
      addMissingRefIssue({
        ref,
        messagePrefix: "Broken reference in events.arcRefs:",
        path: [
          "objects",
          "events",
          index,
          "arcRefs",
          refIndex
        ],
        allowedIds: idsByType.arcs,
        ctx
      });
    });

    event.clueRefs.forEach((ref, refIndex) => {
      addMissingRefIssue({
        ref,
        messagePrefix: "Broken reference in events.clueRefs:",
        path: [
          "objects",
          "events",
          index,
          "clueRefs",
          refIndex
        ],
        allowedIds: idsByType.clues,
        ctx
      });
    });
  });

  project.objects.relations.forEach((relation, index) => {
    addMissingRefIssue({
      ref: relation.sourceRef,
      messagePrefix: "Broken reference in relations.sourceRef:",
      path: [
        "objects",
        "relations",
        index,
        "sourceRef"
      ],
      allowedIds: allObjectIds,
      ctx
    });

    addMissingRefIssue({
      ref: relation.targetRef,
      messagePrefix: "Broken reference in relations.targetRef:",
      path: [
        "objects",
        "relations",
        index,
        "targetRef"
      ],
      allowedIds: allObjectIds,
      ctx
    });
  });

  project.objects.clues.forEach((clue, index) => {
    clue.objectRefs.forEach((ref, refIndex) => {
      addMissingRefIssue({
        ref,
        messagePrefix: "Broken reference in clues.objectRefs:",
        path: [
          "objects",
          "clues",
          index,
          "objectRefs",
          refIndex
        ],
        allowedIds: allObjectIds,
        ctx
      });
    });

    clue.eventRefs.forEach((ref, refIndex) => {
      addMissingRefIssue({
        ref,
        messagePrefix: "Broken reference in clues.eventRefs:",
        path: [
          "objects",
          "clues",
          index,
          "eventRefs",
          refIndex
        ],
        allowedIds: idsByType.events,
        ctx
      });
    });
  });

  project.objects.arcs.forEach((arc, index) => {
    arc.eventRefs.forEach((ref, refIndex) => {
      addMissingRefIssue({
        ref,
        messagePrefix: "Broken reference in arcs.eventRefs:",
        path: [
          "objects",
          "arcs",
          index,
          "eventRefs",
          refIndex
        ],
        allowedIds: idsByType.events,
        ctx
      });
    });

    arc.objectRefs.forEach((ref, refIndex) => {
      addMissingRefIssue({
        ref,
        messagePrefix: "Broken reference in arcs.objectRefs:",
        path: [
          "objects",
          "arcs",
          index,
          "objectRefs",
          refIndex
        ],
        allowedIds: allObjectIds,
        ctx
      });
    });
  });

  project.views["graph-layouts"].forEach((layout, index) => {
    for (const objectId of Object.keys(layout.positions)) {
      addMissingRefIssue({
        ref: objectId,
        messagePrefix: "Broken reference in graph-layouts.positions:",
        path: [
          "views",
          "graph-layouts",
          index,
          "positions",
          objectId
        ],
        allowedIds: allObjectIds,
        ctx
      });
    }
  });

  project.views["track-presets"].forEach((preset, index) => {
    preset.laneOrder.forEach((ref, refIndex) => {
      addMissingRefIssue({
        ref,
        messagePrefix: "Broken reference in track-presets.laneOrder:",
        path: [
          "views",
          "track-presets",
          index,
          "laneOrder",
          refIndex
        ],
        allowedIds: allObjectIds,
        ctx
      });
    });
  });
}

const projectDataSchemaBase = z.object({
  manifest: projectManifestSchema,
  schemaVersion: schemaVersionSchema,
  objects: objectCollectionsSchema,
  views: viewCollectionsSchema
});

export const projectDataSchema = projectDataSchemaBase.superRefine(
  (project, ctx) => {
    validateProjectData(project, ctx);
  }
);

const objectBatchCollectionsSchema = z.object({
  characters: z.array(characterSchema).optional(),
  factions: z.array(factionSchema).optional(),
  locations: z.array(locationSchema).optional(),
  items: z.array(itemSchema).optional(),
  "realm-systems": z.array(realmSystemSchema).optional(),
  events: z.array(eventSchema).optional(),
  relations: z.array(relationSchema).optional(),
  clues: z.array(clueSchema).optional(),
  arcs: z.array(arcSchema).optional()
}).strict();

const bundleExportMetaSchema = z.object({
  sourceProjectId: nonEmptyString,
  exportedAt: z.string().datetime()
});

const bundleVersionSchema = nonEmptyString.superRefine((version, ctx) => {
  ensureSupportedVersion(
    version,
    supportedBundleVersions,
    "bundle version",
    ctx
  );
});

export const projectBundleSchema = z.object({
  bundleType: z.literal("project-bundle"),
  bundleVersion: bundleVersionSchema,
  exportMeta: bundleExportMetaSchema,
  project: projectDataSchema
}).superRefine((bundle, ctx) => {
  if (bundle.exportMeta.sourceProjectId !== bundle.project.manifest.projectId) {
    ctx.addIssue({
      code: "custom",
      message:
        "Project bundle sourceProjectId must match project.manifest.projectId.",
      path: [
        "exportMeta",
        "sourceProjectId"
      ]
    });
  }
});

export const objectBatchSchema = z.object({
  bundleType: z.literal("object-batch"),
  bundleVersion: bundleVersionSchema,
  exportMeta: bundleExportMetaSchema,
  scope: z.object({
    targetProjectId: nonEmptyString,
    objectTypes: z.array(objectTypeNameSchema).min(1)
  }).superRefine((scope, ctx) => {
    const ids = new Set<string>();

    scope.objectTypes.forEach((objectType, index) => {
      if (ids.has(objectType)) {
        ctx.addIssue({
          code: "custom",
          message: `Found duplicate object type ${objectType} in object batch scope.`,
          path: [
            "objectTypes",
            index
          ]
        });
        return;
      }

      ids.add(objectType);
    });
  }),
  objects: objectBatchCollectionsSchema
}).superRefine((batch, ctx) => {
  const objectKeys = Object.keys(batch.objects) as ObjectTypeName[];

  if (objectKeys.length === 0) {
    ctx.addIssue({
      code: "custom",
      message: "Object batch must include at least one object collection.",
      path: [
        "objects"
      ]
    });
  }

  batch.scope.objectTypes.forEach((objectType) => {
    if (!(objectType in batch.objects)) {
      ctx.addIssue({
        code: "custom",
        message: `Object batch scope declares ${objectType} but objects.${objectType} is missing.`,
        path: [
          "objects",
          objectType
        ]
      });
    }
  });

  objectKeys.forEach((objectType) => {
    if (!batch.scope.objectTypes.includes(objectType)) {
      ctx.addIssue({
        code: "custom",
        message: `Object batch objects.${objectType} is not declared in scope.objectTypes.`,
        path: [
          "objects",
          objectType
        ]
      });
    }
  });

  addDuplicateIdIssues({
    collections: batch.objects,
    ctx,
    rootPath: [
      "objects"
    ]
  });
});

export const collectionSchemaByType = {
  characters: characterSchema,
  factions: factionSchema,
  locations: locationSchema,
  items: itemSchema,
  "realm-systems": realmSystemSchema,
  events: eventSchema,
  relations: relationSchema,
  clues: clueSchema,
  arcs: arcSchema
} as const;

export type ObjectTypeName = z.infer<typeof objectTypeNameSchema>;
export type ViewFileName = z.infer<typeof viewFileNameSchema>;
export type Character = z.infer<typeof characterSchema>;
export type Faction = z.infer<typeof factionSchema>;
export type Location = z.infer<typeof locationSchema>;
export type Item = z.infer<typeof itemSchema>;
export type RealmSystem = z.infer<typeof realmSystemSchema>;
export type Event = z.infer<typeof eventSchema>;
export type Relation = z.infer<typeof relationSchema>;
export type Clue = z.infer<typeof clueSchema>;
export type Arc = z.infer<typeof arcSchema>;
export type ProjectManifest = z.infer<typeof projectManifestSchema>;
export type SchemaVersion = z.infer<typeof schemaVersionSchema>;
export type ObjectCollections = z.infer<typeof objectCollectionsSchema>;
export type ViewCollections = z.infer<typeof viewCollectionsSchema>;
export type PartialObjectCollections = z.infer<typeof objectBatchCollectionsSchema>;
export type ProjectData = z.infer<typeof projectDataSchema>;
export type ProjectBundle = z.infer<typeof projectBundleSchema>;
export type ObjectBatch = z.infer<typeof objectBatchSchema>;

export type StoryObject =
  | Character
  | Faction
  | Location
  | Item
  | RealmSystem
  | Event
  | Relation
  | Clue
  | Arc;

export function createEmptyProjectData(input: {
  projectId: string;
  title: string;
  description?: string | undefined;
}): ProjectData {
  return projectDataSchema.parse({
    manifest: {
      projectId: input.projectId,
      title: input.title,
      description: input.description ?? "",
      objectTypes: [...objectTypeNames]
    },
    schemaVersion: {
      version: supportedSchemaVersions[0]
    },
    objects: createEmptyObjectCollectionsInput(),
    views: createEmptyViewCollectionsInput()
  });
}

export function createProjectBundle(input: {
  project: ProjectData;
  sourceProjectId?: string | undefined;
  exportedAt?: string | undefined;
}): ProjectBundle {
  return projectBundleSchema.parse({
    bundleType: "project-bundle",
    bundleVersion: supportedBundleVersions[0],
    exportMeta: {
      sourceProjectId:
        input.sourceProjectId ?? input.project.manifest.projectId,
      exportedAt: input.exportedAt ?? new Date().toISOString()
    },
    project: input.project
  });
}

export function createObjectBatch(input: {
  targetProjectId: string;
  sourceProjectId: string;
  objectTypes: ObjectTypeName[];
  objects: PartialObjectCollections;
  exportedAt?: string | undefined;
}): ObjectBatch {
  return objectBatchSchema.parse({
    bundleType: "object-batch",
    bundleVersion: supportedBundleVersions[0],
    exportMeta: {
      sourceProjectId: input.sourceProjectId,
      exportedAt: input.exportedAt ?? new Date().toISOString()
    },
    scope: {
      targetProjectId: input.targetProjectId,
      objectTypes: input.objectTypes
    },
    objects: input.objects
  });
}

export function createEmptyObjectCollections(): ObjectCollections {
  return objectCollectionsSchema.parse(createEmptyObjectCollectionsInput());
}

export function createEmptyViewCollections(): ViewCollections {
  return viewCollectionsSchema.parse(createEmptyViewCollectionsInput());
}

export function parseProjectData(input: unknown): ProjectData {
  return projectDataSchema.parse(input);
}

export function parseProjectBundle(input: unknown): ProjectBundle {
  return projectBundleSchema.parse(input);
}

export function parseObjectBatch(input: unknown): ObjectBatch {
  return objectBatchSchema.parse(input);
}
