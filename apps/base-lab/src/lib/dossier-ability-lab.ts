import {
  objectTypeNames,
  projectDataSchema,
  type ObjectTypeName,
  type ProjectData,
  type StoryObject
} from "@novelstory/schema";

import arcs from "../../../../fixtures/projects/sample-novel/objects/arcs.json" with { type: "json" };
import characters from "../../../../fixtures/projects/sample-novel/objects/characters.json" with { type: "json" };
import clues from "../../../../fixtures/projects/sample-novel/objects/clues.json" with { type: "json" };
import events from "../../../../fixtures/projects/sample-novel/objects/events.json" with { type: "json" };
import factions from "../../../../fixtures/projects/sample-novel/objects/factions.json" with { type: "json" };
import items from "../../../../fixtures/projects/sample-novel/objects/items.json" with { type: "json" };
import locations from "../../../../fixtures/projects/sample-novel/objects/locations.json" with { type: "json" };
import realmSystems from "../../../../fixtures/projects/sample-novel/objects/realm-systems.json" with { type: "json" };
import relations from "../../../../fixtures/projects/sample-novel/objects/relations.json" with { type: "json" };
import manifest from "../../../../fixtures/projects/sample-novel/manifest.json" with { type: "json" };
import schemaVersion from "../../../../fixtures/projects/sample-novel/schema-version.json" with { type: "json" };
import chapterSlices from "../../../../fixtures/projects/sample-novel/views/chapter-slices.json" with { type: "json" };
import graphLayouts from "../../../../fixtures/projects/sample-novel/views/graph-layouts.json" with { type: "json" };
import savedFilters from "../../../../fixtures/projects/sample-novel/views/saved-filters.json" with { type: "json" };
import trackPresets from "../../../../fixtures/projects/sample-novel/views/track-presets.json" with { type: "json" };

export type EditableObject = StoryObject & Record<string, unknown>;

export type DossierReferenceLink = {
  field: string;
  objectId: string;
  objectType: ObjectTypeName;
  targetName: string;
};

export type DossierBacklink = {
  field: string;
  objectId: string;
  objectType: ObjectTypeName;
  sourceName: string;
};

export type DossierAuditItem = {
  missingFields: string[];
  objectId: string;
  objectName: string;
  objectType: ObjectTypeName;
};

export type InspectorField = {
  inputKind: "number" | "readonly" | "text" | "textarea";
  key: string;
  label: string;
  value: unknown;
};

export type InspectorSections = {
  additionalFields: InspectorField[];
  coreFields: InspectorField[];
  referenceFields: InspectorField[];
};

export type SavedFilter = ProjectData["views"]["saved-filters"][number];

export type DossierAppearanceEntry = {
  eventId: string;
  eventName: string;
  eventSummary: string;
  roleLabels: string[];
  sliceTitles: string[];
  timeAnchor: string;
};

export type DossierSharedAppearance = {
  eventId: string;
  eventName: string;
  leftRoleLabels: string[];
  rightRoleLabels: string[];
  sliceTitles: string[];
  timeAnchor: string;
};

export type DossierRelationEntry = {
  counterpartyId: string;
  counterpartyName: string;
  counterpartyType: ObjectTypeName;
  direction: "bidirectional" | "forward";
  relationId: string;
  relationSummary: string;
  relationTags: string[];
  relationType: string;
  sharedAppearances: DossierSharedAppearance[];
  startAnchor: string;
  strength: number;
};

export type DossierRelationContext = {
  relationId: string;
  sourceId: string;
  sourceName: string;
  sourceType: ObjectTypeName;
  targetId: string;
  targetName: string;
  targetType: ObjectTypeName;
  sharedAppearances: DossierSharedAppearance[];
};

export type RelationTargetOption = {
  label: string;
  objectId: string;
  objectType: ObjectTypeName;
};

export type CreateRelationInput = {
  direction: "bidirectional" | "forward";
  endAnchor: string;
  sourceRef: string;
  startAnchor: string;
  strength: number;
  summary: string;
  tags: string[];
  targetRef: string;
  type: string;
};

const sampleProjectTemplate = projectDataSchema.parse({
  manifest,
  schemaVersion,
  objects: {
    arcs,
    characters,
    clues,
    events,
    factions,
    items,
    locations,
    relations,
    "realm-systems": realmSystems
  },
  views: {
    "chapter-slices": chapterSlices,
    "graph-layouts": graphLayouts,
    "saved-filters": savedFilters,
    "track-presets": trackPresets
  }
});

const coreFieldOrder = [
  "id",
  "name",
  "summary",
  "tags",
  "status"
] as const;

const objectTypeLabels: Record<ObjectTypeName, string> = {
  arcs: "主线",
  characters: "人物",
  clues: "线索",
  events: "事件",
  factions: "宗门",
  items: "物品",
  locations: "地点",
  relations: "关系",
  "realm-systems": "体系"
};

const auditFieldRules: Record<ObjectTypeName, Array<{ key: string; label: string }>> = {
  arcs: [
    { key: "summary", label: "Summary" },
    { key: "eventRefs", label: "Event" },
    { key: "objectRefs", label: "Object" }
  ],
  characters: [
    { key: "summary", label: "Summary" },
    { key: "identity", label: "Identity" },
    { key: "factionRefs", label: "Faction" },
    { key: "realmState", label: "Realm State" }
  ],
  clues: [
    { key: "summary", label: "Summary" },
    { key: "objectRefs", label: "Object" },
    { key: "revealCondition", label: "Reveal Condition" }
  ],
  events: [
    { key: "summary", label: "Summary" },
    { key: "participantRefs", label: "Participant" },
    { key: "locationRefs", label: "Location" },
    { key: "timeAnchor", label: "Time Anchor" }
  ],
  factions: [
    { key: "summary", label: "Summary" },
    { key: "goal", label: "Goal" },
    { key: "locationRefs", label: "Location" }
  ],
  items: [
    { key: "summary", label: "Summary" },
    { key: "ownerRef", label: "Owner" },
    { key: "origin", label: "Origin" }
  ],
  locations: [
    { key: "summary", label: "Summary" },
    { key: "controllerRef", label: "Controller" },
    { key: "traits", label: "Traits" }
  ],
  relations: [
    { key: "summary", label: "Summary" },
    { key: "sourceRef", label: "Source" },
    { key: "targetRef", label: "Target" }
  ],
  "realm-systems": [
    { key: "summary", label: "Summary" },
    { key: "levels", label: "Levels" },
    { key: "rules", label: "Rules" }
  ]
};

function collectSearchableValues(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) => collectSearchableValues(item));
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return [
      String(value)
    ];
  }

  return [];
}

function toReferenceIds(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.length > 0);
  }

  if (typeof value === "string" && value.length > 0) {
    return [
      value
    ];
  }

  return [];
}

function hasMeaningfulValue(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  return value !== undefined && value !== null;
}

function isReferenceField(field: string): boolean {
  return field.endsWith("Ref") || field.endsWith("Refs");
}

function getInputKind(field: string, value: unknown): InspectorField["inputKind"] {
  if (field === "id") {
    return "readonly";
  }

  if (Array.isArray(value)) {
    return "textarea";
  }

  if (typeof value === "number") {
    return "number";
  }

  if (field === "notes") {
    return "textarea";
  }

  return "text";
}

export function getObjectDisplayName(item: StoryObject): string {
  if ("sourceRef" in item && "targetRef" in item) {
    const relationRecord = item as unknown as {
      sourceRef: string;
      targetRef: string;
      type: string;
    };

    return `${relationRecord.type} · ${relationRecord.sourceRef} -> ${relationRecord.targetRef}`;
  }

  if ("name" in item) {
    return item.name;
  }

  return "";
}

export function getObjectTypeLabel(objectType: ObjectTypeName): string {
  return objectTypeLabels[objectType];
}

export function getDossierObjectTypeOptions(): Array<{
  label: string;
  objectType: ObjectTypeName;
}> {
  return objectTypeNames.map((objectType) => ({
    label: getObjectTypeLabel(objectType),
    objectType
  }));
}

export function formatFieldLabel(field: string): string {
  return field
    .replace(/Refs?$/, "")
    .replace(/-/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatFieldValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (value === undefined || value === null) {
    return "";
  }

  return String(value);
}

export function createSampleProjectData(): ProjectData {
  return structuredClone(sampleProjectTemplate);
}

export function buildDraftObject(
  project: ProjectData,
  objectType: ObjectTypeName,
  objectId: string
): EditableObject | null {
  const found = (project.objects[objectType] as StoryObject[]).find(
    (item) => item.id === objectId
  );

  return found ? structuredClone(found) as EditableObject : null;
}

export function matchesObjectFilter(item: StoryObject, query: string): boolean {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  const searchableText = [
    getObjectDisplayName(item),
    ...Object.values(item).flatMap((value) => collectSearchableValues(value))
  ]
    .join(" ")
    .toLocaleLowerCase();

  return searchableText.includes(normalizedQuery);
}

export function parseDraftFieldValue(currentValue: unknown, value: string): unknown {
  if (Array.isArray(currentValue)) {
    return value
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof currentValue === "number") {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : currentValue;
  }

  return value;
}

export function resolveObjectReference(
  project: ProjectData,
  objectId: string
): {
  object: StoryObject;
  objectType: ObjectTypeName;
} | null {
  for (const objectType of objectTypeNames) {
    const found = (project.objects[objectType] as StoryObject[]).find(
      (item) => item.id === objectId
    );

    if (found) {
      return {
        object: found,
        objectType
      };
    }
  }

  return null;
}

export function getFilteredObjects(
  project: ProjectData,
  objectType: ObjectTypeName,
  query: string
): StoryObject[] {
  return (project.objects[objectType] as StoryObject[]).filter((item) =>
    matchesObjectFilter(item, query)
  );
}

export function getSavedFilters(project: ProjectData): SavedFilter[] {
  return project.views["saved-filters"];
}

export function collectReferenceLinks(
  project: ProjectData,
  item: StoryObject
): DossierReferenceLink[] {
  return Object.entries(item).flatMap(([field, value]) => {
    if (!isReferenceField(field)) {
      return [];
    }

    return toReferenceIds(value).flatMap((objectId) => {
      const resolved = resolveObjectReference(project, objectId);

      if (!resolved) {
        return [];
      }

      return [
        {
          field: formatFieldLabel(field),
          objectId,
          objectType: resolved.objectType,
          targetName: getObjectDisplayName(resolved.object)
        }
      ];
    });
  });
}

export function collectBacklinks(
  project: ProjectData,
  targetObjectId: string
): DossierBacklink[] {
  const backlinks: DossierBacklink[] = [];

  for (const objectType of objectTypeNames) {
    for (const item of project.objects[objectType] as StoryObject[]) {
      for (const [field, value] of Object.entries(item)) {
        if (!isReferenceField(field)) {
          continue;
        }

        if (!toReferenceIds(value).includes(targetObjectId)) {
          continue;
        }

        backlinks.push({
          field: formatFieldLabel(field),
          objectId: item.id,
          objectType,
          sourceName: getObjectDisplayName(item)
        });
      }
    }
  }

  return backlinks;
}

export function buildAuditQueue(project: ProjectData): DossierAuditItem[] {
  const queue: DossierAuditItem[] = [];

  for (const objectType of objectTypeNames) {
    for (const item of project.objects[objectType] as StoryObject[]) {
      const missingFields = auditFieldRules[objectType]
        .filter((rule) => !hasMeaningfulValue((item as Record<string, unknown>)[rule.key]))
        .map((rule) => rule.label);

      if (missingFields.length === 0) {
        continue;
      }

      queue.push({
        missingFields,
        objectId: item.id,
        objectName: getObjectDisplayName(item),
        objectType
      });
    }
  }

  return queue.sort((left, right) => {
    if (right.missingFields.length !== left.missingFields.length) {
      return right.missingFields.length - left.missingFields.length;
    }

    return left.objectName.localeCompare(right.objectName, "zh-Hans-CN");
  });
}

export function buildInspectorFields(draftObject: EditableObject): InspectorSections {
  const coreFields: InspectorField[] = [];
  const additionalFields: InspectorField[] = [];
  const referenceFields: InspectorField[] = [];

  for (const [field, value] of Object.entries(draftObject)) {
    const nextField: InspectorField = {
      inputKind: getInputKind(field, value),
      key: field,
      label: formatFieldLabel(field),
      value
    };

    if (isReferenceField(field)) {
      referenceFields.push(nextField);
      continue;
    }

    if (coreFieldOrder.includes(field as (typeof coreFieldOrder)[number])) {
      coreFields.push(nextField);
      continue;
    }

    additionalFields.push(nextField);
  }

  coreFields.sort(
    (left, right) =>
      coreFieldOrder.indexOf(left.key as (typeof coreFieldOrder)[number]) -
      coreFieldOrder.indexOf(right.key as (typeof coreFieldOrder)[number])
  );

  additionalFields.sort((left, right) =>
    left.label.localeCompare(right.label, "en")
  );
  referenceFields.sort((left, right) =>
    left.label.localeCompare(right.label, "en")
  );

  return {
    additionalFields,
    coreFields,
    referenceFields
  };
}

function collectEventRoleLabels(event: ProjectData["objects"]["events"][number], objectId: string) {
  return Object.entries(event)
    .filter(([field, value]) => isReferenceField(field) && toReferenceIds(value).includes(objectId))
    .map(([field]) => formatFieldLabel(field));
}

function collectSliceTitlesForEvent(
  project: ProjectData,
  eventId: string,
  relatedObjectIds: string[]
): string[] {
  return project.views["chapter-slices"]
    .filter((slice) => {
      if (slice.eventRefs.includes(eventId)) {
        return true;
      }

      return relatedObjectIds.every((objectId) => slice.focusObjectRefs.includes(objectId));
    })
    .map((slice) => slice.title);
}

export function collectObjectAppearances(
  project: ProjectData,
  objectId: string
): DossierAppearanceEntry[] {
  return project.objects.events
    .flatMap((event) => {
      const roleLabels = collectEventRoleLabels(event, objectId);

      if (roleLabels.length === 0) {
        return [];
      }

      return [
        {
          eventId: event.id,
          eventName: event.name,
          eventSummary: event.summary,
          roleLabels,
          sliceTitles: collectSliceTitlesForEvent(project, event.id, [objectId]),
          timeAnchor: event.timeAnchor
        }
      ];
    })
    .sort((left, right) => left.eventName.localeCompare(right.eventName, "zh-Hans-CN"));
}

function collectSharedAppearances(
  project: ProjectData,
  leftObjectId: string,
  rightObjectId: string
): DossierSharedAppearance[] {
  return project.objects.events
    .flatMap((event) => {
      const leftRoleLabels = collectEventRoleLabels(event, leftObjectId);
      const rightRoleLabels = collectEventRoleLabels(event, rightObjectId);

      if (leftRoleLabels.length === 0 || rightRoleLabels.length === 0) {
        return [];
      }

      return [
        {
          eventId: event.id,
          eventName: event.name,
          leftRoleLabels,
          rightRoleLabels,
          sliceTitles: collectSliceTitlesForEvent(project, event.id, [
            leftObjectId,
            rightObjectId
          ]),
          timeAnchor: event.timeAnchor
        }
      ];
    })
    .sort((left, right) => left.eventName.localeCompare(right.eventName, "zh-Hans-CN"));
}

export function collectObjectRelationEntries(
  project: ProjectData,
  objectId: string
): DossierRelationEntry[] {
  return project.objects.relations
    .flatMap((relation) => {
      if (relation.sourceRef !== objectId && relation.targetRef !== objectId) {
        return [];
      }

      const counterpartyId =
        relation.sourceRef === objectId ? relation.targetRef : relation.sourceRef;
      const resolvedCounterparty = resolveObjectReference(project, counterpartyId);

      if (!resolvedCounterparty) {
        return [];
      }

      return [
        {
          counterpartyId,
          counterpartyName: getObjectDisplayName(resolvedCounterparty.object),
          counterpartyType: resolvedCounterparty.objectType,
          direction: relation.direction,
          relationId: relation.id,
          relationSummary: relation.summary,
          relationTags: relation.tags,
          relationType: relation.type,
          sharedAppearances: collectSharedAppearances(project, objectId, counterpartyId),
          startAnchor: relation.startAnchor,
          strength: relation.strength
        }
      ];
    })
    .sort((left, right) => left.counterpartyName.localeCompare(right.counterpartyName, "zh-Hans-CN"));
}

export function collectRelationContext(
  project: ProjectData,
  relationId: string
): DossierRelationContext | null {
  const relation = project.objects.relations.find((item) => item.id === relationId);

  if (!relation) {
    return null;
  }

  const source = resolveObjectReference(project, relation.sourceRef);
  const target = resolveObjectReference(project, relation.targetRef);

  if (!source || !target) {
    return null;
  }

  return {
    relationId,
    sourceId: relation.sourceRef,
    sourceName: getObjectDisplayName(source.object),
    sourceType: source.objectType,
    targetId: relation.targetRef,
    targetName: getObjectDisplayName(target.object),
    targetType: target.objectType,
    sharedAppearances: collectSharedAppearances(project, relation.sourceRef, relation.targetRef)
  };
}

export function getRelationTargetOptions(
  project: ProjectData,
  sourceObjectId: string
): RelationTargetOption[] {
  const options: RelationTargetOption[] = [];

  for (const objectType of objectTypeNames) {
    if (objectType === "relations") {
      continue;
    }

    for (const item of project.objects[objectType] as StoryObject[]) {
      if (item.id === sourceObjectId) {
        continue;
      }

      options.push({
        label: `[${getObjectTypeLabel(objectType)}] ${getObjectDisplayName(item)}`,
        objectId: item.id,
        objectType
      });
    }
  }

  return options.sort((left, right) => left.label.localeCompare(right.label, "zh-Hans-CN"));
}

function sanitizeIdSegment(value: string) {
  return value
    .trim()
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
}

export function createRelationInProject(
  project: ProjectData,
  input: CreateRelationInput
): {
  project: ProjectData;
  relationId: string;
} {
  const typeSegment = sanitizeIdSegment(input.type) || "relation";
  const sourceSegment = sanitizeIdSegment(input.sourceRef) || "source";
  const targetSegment = sanitizeIdSegment(input.targetRef) || "target";
  const baseId = `rel_${typeSegment}-${sourceSegment}-${targetSegment}`;
  const occupiedIds = new Set(project.objects.relations.map((item) => item.id));
  let relationId = baseId;
  let suffix = 2;

  while (occupiedIds.has(relationId)) {
    relationId = `${baseId}-${suffix}`;
    suffix += 1;
  }

  const nextProject = mergeObjectIntoProject(project, "relations", {
    direction: input.direction,
    endAnchor: input.endAnchor.trim(),
    id: relationId,
    sourceRef: input.sourceRef,
    startAnchor: input.startAnchor.trim(),
    strength: Math.max(0, Math.min(1, input.strength)),
    summary: input.summary.trim(),
    tags: input.tags.filter(Boolean),
    targetRef: input.targetRef,
    type: input.type.trim() || "relation"
  });

  return {
    project: nextProject,
    relationId
  };
}

export function mergeObjectIntoProject(
  project: ProjectData,
  objectType: ObjectTypeName,
  object: StoryObject
): ProjectData {
  const currentCollection = project.objects[objectType] as StoryObject[];
  const nextCollection = currentCollection.some((item) => item.id === object.id)
    ? currentCollection.map((item) => (item.id === object.id ? object : item))
    : [
        ...currentCollection,
        object
      ];

  return projectDataSchema.parse({
    ...project,
    objects: {
      ...project.objects,
      [objectType]: nextCollection
    }
  });
}
