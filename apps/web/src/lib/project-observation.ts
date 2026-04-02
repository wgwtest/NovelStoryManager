import type {
  ObjectTypeName,
  ProjectData
} from "@novelstory/schema";

import { getObjectDisplayName } from "./object-display.js";

export const observationModeOptions = [
  {
    value: "time",
    label: "Time"
  },
  {
    value: "character",
    label: "Character"
  },
  {
    value: "location",
    label: "Location"
  },
  {
    value: "arc",
    label: "Arc"
  }
] as const;

export type ObservationMode = (typeof observationModeOptions)[number]["value"];

export type ObservationEventCard = {
  id: string;
  label: string;
  objectType: "events";
  summary: string;
  timeAnchor: string;
};

export type ObservationSlice = {
  id: string;
  label: string;
  objectType: Exclude<ObjectTypeName, "relations">;
  eventCards: ObservationEventCard[];
};

type ObservationConfig = {
  collectionType?: "characters" | "locations" | "arcs";
  defaultLabel?: string;
  objectType: Exclude<ObjectTypeName, "relations">;
  pickRefs?: (event: ProjectData["objects"]["events"][number]) => string[];
};

const observationConfigByMode: Record<ObservationMode, ObservationConfig> = {
  arc: {
    collectionType: "arcs",
    objectType: "arcs",
    pickRefs: (event) => event.arcRefs
  },
  character: {
    collectionType: "characters",
    objectType: "characters",
    pickRefs: (event) => event.participantRefs
  },
  location: {
    collectionType: "locations",
    objectType: "locations",
    pickRefs: (event) => event.locationRefs
  },
  time: {
    defaultLabel: "未标注时间",
    objectType: "events"
  }
};

function createEventCard(
  event: ProjectData["objects"]["events"][number]
): ObservationEventCard {
  return {
    id: event.id,
    label: event.name,
    objectType: "events",
    summary: event.summary,
    timeAnchor: event.timeAnchor
  };
}

function buildTimeObservationSlices(project: ProjectData): ObservationSlice[] {
  const slicesById = new Map<string, ObservationSlice>();
  const sliceOrder: string[] = [];

  project.objects.events.forEach((event) => {
    const sliceId = event.timeAnchor || "__time_unassigned__";

    if (!slicesById.has(sliceId)) {
      sliceOrder.push(sliceId);
      slicesById.set(sliceId, {
        id: sliceId,
        label: event.timeAnchor || observationConfigByMode.time.defaultLabel || "未标注时间",
        objectType: "events",
        eventCards: []
      });
    }

    slicesById.get(sliceId)?.eventCards.push(createEventCard(event));
  });

  return sliceOrder
    .map((sliceId) => slicesById.get(sliceId))
    .filter((slice): slice is ObservationSlice => Boolean(slice));
}

function buildObjectObservationSlices(
  project: ProjectData,
  mode: Exclude<ObservationMode, "time">
): ObservationSlice[] {
  const config = observationConfigByMode[mode];

  if (!config.collectionType || !config.pickRefs) {
    return [];
  }

  const eventCardsBySliceId = new Map<string, ObservationEventCard[]>();

  project.objects.events.forEach((event) => {
    config.pickRefs?.(event).forEach((ref) => {
      const currentEventCards = eventCardsBySliceId.get(ref) ?? [];

      currentEventCards.push(createEventCard(event));
      eventCardsBySliceId.set(ref, currentEventCards);
    });
  });

  return project.objects[config.collectionType]
    .filter((item) => (eventCardsBySliceId.get(item.id)?.length ?? 0) > 0)
    .map((item) => ({
      id: item.id,
      label: getObjectDisplayName(item),
      objectType: config.objectType,
      eventCards: eventCardsBySliceId.get(item.id) ?? []
    }));
}

export function buildObservationData(
  project: ProjectData,
  mode: ObservationMode
): {
  chapterDimension: {
    title: string;
    description: string;
  };
  slices: ObservationSlice[];
} {
  const slices = mode === "time"
    ? buildTimeObservationSlices(project)
    : buildObjectObservationSlices(project, mode);

  return {
    chapterDimension: {
      title: "Chapter Dimension",
      description: "Reserved for future structured chapter slices."
    },
    slices
  };
}
