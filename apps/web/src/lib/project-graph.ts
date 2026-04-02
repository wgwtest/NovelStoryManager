import {
  objectTypeNames,
  type ObjectTypeName,
  type ProjectData,
  type StoryObject
} from "@novelstory/schema";

import { getObjectDisplayName } from "./object-display.js";

export type GraphNode = {
  id: string;
  label: string;
  objectType: Exclude<ObjectTypeName, "relations">;
  object: StoryObject;
};

export type GraphEdge = {
  id: string;
  sourceId: string;
  targetId: string;
  label: string;
  kind: "relation" | "reference";
};

export type GraphLayoutDraft = ProjectData["views"]["graph-layouts"][number];

const graphNodeObjectTypes = objectTypeNames.filter(
  (objectType) => objectType !== "relations"
) as Array<Exclude<ObjectTypeName, "relations">>;

function isReferenceField(field: string): boolean {
  return field.endsWith("Ref") || field.endsWith("Refs");
}

function formatFieldLabel(field: string): string {
  return field
    .replace(/Refs?$/, "")
    .replace(/-/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}

export function resolveGraphObject(
  project: ProjectData,
  objectId: string
): {
  objectType: Exclude<ObjectTypeName, "relations">;
  object: StoryObject;
} | null {
  for (const objectType of graphNodeObjectTypes) {
    const found = project.objects[objectType].find((item) => item.id === objectId);

    if (found) {
      return {
        objectType,
        object: found
      };
    }
  }

  return null;
}

export function buildGraphData(project: ProjectData): {
  nodes: GraphNode[];
  edges: GraphEdge[];
} {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  for (const objectType of graphNodeObjectTypes) {
    for (const item of project.objects[objectType]) {
      nodes.push({
        id: item.id,
        label: getObjectDisplayName(item),
        objectType,
        object: item
      });

      for (const [field, value] of Object.entries(item)) {
        if (!isReferenceField(field)) {
          continue;
        }

        const targetIds = Array.isArray(value)
          ? value.filter(
              (targetId): targetId is string =>
                typeof targetId === "string" && targetId.length > 0
            )
          : typeof value === "string" && value.length > 0
            ? [
                value
              ]
            : [];

        for (const targetId of targetIds) {
          const target = resolveGraphObject(project, targetId);

          if (!target) {
            continue;
          }

          edges.push({
            id: `${item.id}:${field}:${targetId}`,
            sourceId: item.id,
            targetId,
            label: formatFieldLabel(field),
            kind: "reference"
          });
        }
      }
    }
  }

  for (const relation of project.objects.relations) {
    const source = resolveGraphObject(project, relation.sourceRef);
    const target = resolveGraphObject(project, relation.targetRef);

    if (!source || !target) {
      continue;
    }

    edges.push({
      id: relation.id,
      sourceId: relation.sourceRef,
      targetId: relation.targetRef,
      label: relation.type,
      kind: "relation"
    });
  }

  return {
    nodes,
    edges
  };
}

export function ensureGraphLayout(
  project: ProjectData,
  nodes: GraphNode[]
): GraphLayoutDraft {
  const baseLayout = project.views["graph-layouts"][0] ?? {
    id: "default-graph",
    name: "默认关系图",
    positions: {},
    zoom: 1
  };

  const positions = {
    ...baseLayout.positions
  };

  nodes.forEach((node, index) => {
    if (positions[node.id]) {
      return;
    }

    positions[node.id] = {
      x: 80 + (index % 4) * 180,
      y: 80 + Math.floor(index / 4) * 120
    };
  });

  return {
    ...baseLayout,
    positions
  };
}

export function filterGraphBySelection(input: {
  edges: GraphEdge[];
  focusSelection: boolean;
  nodes: GraphNode[];
  selectedObjectId: string;
}): {
  edges: GraphEdge[];
  nodes: GraphNode[];
} {
  if (!input.focusSelection || !input.selectedObjectId) {
    return {
      edges: input.edges,
      nodes: input.nodes
    };
  }

  const visibleNodeIds = new Set<string>([
    input.selectedObjectId
  ]);

  input.edges.forEach((edge) => {
    if (
      edge.sourceId === input.selectedObjectId ||
      edge.targetId === input.selectedObjectId
    ) {
      visibleNodeIds.add(edge.sourceId);
      visibleNodeIds.add(edge.targetId);
    }
  });

  return {
    nodes: input.nodes.filter((node) => visibleNodeIds.has(node.id)),
    edges: input.edges.filter(
      (edge) =>
        visibleNodeIds.has(edge.sourceId) && visibleNodeIds.has(edge.targetId)
    )
  };
}
