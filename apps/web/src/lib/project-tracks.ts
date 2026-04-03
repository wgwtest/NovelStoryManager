import type {
  Event,
  ObjectTypeName,
  ProjectData
} from "@novelstory/schema";

import { getObjectDisplayName } from "./object-display.js";
import { createCanvasViewport } from "./view-canvas.js";

export const trackGroupingOptions = [
  {
    value: "character",
    label: "Character"
  },
  {
    value: "location",
    label: "Location"
  },
  {
    value: "faction",
    label: "Faction"
  },
  {
    value: "arc",
    label: "Arc"
  }
] as const;

export type TrackGrouping = (typeof trackGroupingOptions)[number]["value"];
export type TrackPresetDraft = ProjectData["views"]["track-presets"][number];

export type TrackEventCard = {
  id: string;
  label: string;
  objectType: "events";
  summary: string;
  timeAnchor: string;
  timeIndex: number;
};

export type TrackLane = {
  id: string;
  label: string;
  objectType: Exclude<ObjectTypeName, "relations">;
  eventCards: TrackEventCard[];
  persistable: boolean;
};

type TrackGroupingConfig = {
  laneObjectType: "characters" | "locations" | "factions" | "arcs";
  laneObjectLabel: Exclude<ObjectTypeName, "relations">;
  pickLaneRefs: (event: ProjectData["objects"]["events"][number]) => string[];
};

const fallbackLaneId = "__unassigned__";

const trackGroupingConfigByValue: Record<TrackGrouping, TrackGroupingConfig> = {
  arc: {
    laneObjectType: "arcs",
    laneObjectLabel: "arcs",
    pickLaneRefs: (event) => event.arcRefs
  },
  character: {
    laneObjectType: "characters",
    laneObjectLabel: "characters",
    pickLaneRefs: (event) => event.participantRefs
  },
  faction: {
    laneObjectType: "factions",
    laneObjectLabel: "factions",
    pickLaneRefs: (event) => event.factionRefs
  },
  location: {
    laneObjectType: "locations",
    laneObjectLabel: "locations",
    pickLaneRefs: (event) => event.locationRefs
  }
};

function isTrackGrouping(value: string): value is TrackGrouping {
  return trackGroupingOptions.some((option) => option.value === value);
}

function createDefaultTrackPreset(): TrackPresetDraft {
  return {
    id: "default-tracks",
    name: "默认轨道预设",
    grouping: "character",
    laneOrder: [],
    ...createCanvasViewport()
  };
}

function getTrackGroupingConfig(grouping: string): TrackGroupingConfig {
  return trackGroupingConfigByValue[
    isTrackGrouping(grouping) ? grouping : "character"
  ];
}

function getLaneObjects(
  project: ProjectData,
  grouping: string
): Array<{
  id: string;
  label: string;
}> {
  const config = getTrackGroupingConfig(grouping);

  return project.objects[config.laneObjectType].map((item) => ({
    id: item.id,
    label: getObjectDisplayName(item)
  }));
}

function normalizeLaneOrder(
  project: ProjectData,
  grouping: string,
  laneOrder: string[]
): string[] {
  const laneIds = getLaneObjects(project, grouping).map((lane) => lane.id);
  const allowedIds = new Set(laneIds);
  const seen = new Set<string>();
  const normalized = laneOrder.filter((laneId) => {
    if (!allowedIds.has(laneId) || seen.has(laneId)) {
      return false;
    }

    seen.add(laneId);
    return true;
  });

  laneIds.forEach((laneId) => {
    if (!seen.has(laneId)) {
      normalized.push(laneId);
    }
  });

  return normalized;
}

function normalizeTrackPreset(
  project: ProjectData,
  preset: TrackPresetDraft
): TrackPresetDraft {
  const grouping = isTrackGrouping(preset.grouping)
    ? preset.grouping
    : "character";

  return {
    ...preset,
    grouping,
    laneOrder: normalizeLaneOrder(project, grouping, preset.laneOrder)
  };
}

export function ensureTrackPreset(
  project: ProjectData,
  presetId?: string
): TrackPresetDraft {
  const existingPreset = presetId
    ? project.views["track-presets"].find((preset) => preset.id === presetId)
    : project.views["track-presets"][0];
  const basePreset = existingPreset ?? createDefaultTrackPreset();

  return normalizeTrackPreset(project, basePreset);
}

export function updateTrackPresetGrouping(
  project: ProjectData,
  preset: TrackPresetDraft,
  grouping: TrackGrouping
): TrackPresetDraft {
  return normalizeTrackPreset(project, {
    ...preset,
    grouping
  });
}

export function buildTrackData(
  project: ProjectData,
  preset: TrackPresetDraft
): {
  eventPlacements: number;
  lanes: TrackLane[];
  preset: TrackPresetDraft;
  timelineAnchors: string[];
} {
  const normalizedPreset = normalizeTrackPreset(project, preset);
  const normalizedViewport = createCanvasViewport(normalizedPreset);
  const config = getTrackGroupingConfig(normalizedPreset.grouping);
  const laneObjects = getLaneObjects(project, normalizedPreset.grouping);
  const timelineAnchors = Array.from(
    new Set(
      project.objects.events.map((event) => event.timeAnchor || "未标注时间")
    )
  );
  const laneMap = new Map<string, TrackLane>(
    laneObjects.map((lane) => [
      lane.id,
      {
        id: lane.id,
        label: lane.label,
        objectType: config.laneObjectLabel,
        eventCards: [],
        persistable: true
      }
    ])
  );
  let hasFallbackLane = false;

  project.objects.events.forEach((event) => {
    const laneIds = config.pickLaneRefs(event).filter((laneId) => laneMap.has(laneId));
    const targetLaneIds = laneIds.length > 0
      ? laneIds
      : [
          fallbackLaneId
        ];

    targetLaneIds.forEach((laneId) => {
      if (!laneMap.has(laneId)) {
        hasFallbackLane = true;
        laneMap.set(laneId, {
          id: laneId,
          label: "未分组事件",
          objectType: "events",
          eventCards: [],
          persistable: false
        });
      }

      laneMap.get(laneId)?.eventCards.push({
        id: event.id,
        label: event.name,
        objectType: "events",
        summary: event.summary,
        timeAnchor: event.timeAnchor,
        timeIndex: Math.max(
          timelineAnchors.indexOf(event.timeAnchor || "未标注时间"),
          0
        )
      });
    });
  });

  const orderedLaneIds = [
    ...normalizedPreset.laneOrder,
    ...(hasFallbackLane ? [fallbackLaneId] : [])
  ];
  const lanes = orderedLaneIds
    .map((laneId) => laneMap.get(laneId))
    .filter((lane): lane is TrackLane => Boolean(lane));
  const eventPlacements = lanes.reduce(
    (count, lane) => count + lane.eventCards.length,
    0
  );

  return {
    eventPlacements,
    lanes,
    preset: {
      ...normalizedPreset,
      ...normalizedViewport
    },
    timelineAnchors
  };
}

export function buildEventPatchForLaneDrop(input: {
  event: Event;
  grouping: TrackGrouping;
  sourceLaneId?: string;
  targetLaneId: string;
}): Partial<Event> {
  function replaceLaneRef(refs: string[]): string[] {
    const nextRefs = refs.filter((ref) => ref !== input.sourceLaneId);

    if (!nextRefs.includes(input.targetLaneId)) {
      nextRefs.unshift(input.targetLaneId);
    }

    return nextRefs;
  }

  switch (input.grouping) {
    case "character":
      return {
        participantRefs: replaceLaneRef(input.event.participantRefs)
      };
    case "location":
      return {
        locationRefs: replaceLaneRef(input.event.locationRefs)
      };
    case "faction":
      return {
        factionRefs: replaceLaneRef(input.event.factionRefs)
      };
    case "arc":
      return {
        arcRefs: replaceLaneRef(input.event.arcRefs)
      };
  }
}
