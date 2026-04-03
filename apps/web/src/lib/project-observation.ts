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
  },
  {
    value: "chapter",
    label: "Chapter"
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
  relatedCharacters: string[];
  relatedLocations: string[];
  relatedArcs: string[];
  summary?: string;
  text?: string;
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
  chapter: {
    objectType: "events"
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
        eventCards: [],
        relatedCharacters: [],
        relatedLocations: [],
        relatedArcs: []
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
      eventCards: eventCardsBySliceId.get(item.id) ?? [],
      relatedCharacters: [],
      relatedLocations: [],
      relatedArcs: []
    }));
}

function buildChapterObservationSlices(project: ProjectData): ObservationSlice[] {
  const eventById = new Map(project.objects.events.map((event) => [
    event.id,
    event
  ]));
  const characterById = new Map(project.objects.characters.map((character) => [
    character.id,
    character
  ]));
  const locationById = new Map(project.objects.locations.map((location) => [
    location.id,
    location
  ]));
  const arcById = new Map(project.objects.arcs.map((arc) => [
    arc.id,
    arc
  ]));

  return [...project.views["chapter-slices"]]
    .sort((left, right) => left.order - right.order)
    .map((slice) => {
      const events = slice.eventRefs
        .map((eventId) => eventById.get(eventId))
        .filter((event): event is ProjectData["objects"]["events"][number] => Boolean(event));
      const relatedCharacterNames = new Set<string>();
      const relatedLocationNames = new Set<string>();
      const relatedArcNames = new Set<string>();

      slice.focusObjectRefs.forEach((objectId) => {
        const character = characterById.get(objectId);
        const location = locationById.get(objectId);
        const arc = arcById.get(objectId);

        if (character) {
          relatedCharacterNames.add(getObjectDisplayName(character));
        }

        if (location) {
          relatedLocationNames.add(getObjectDisplayName(location));
        }

        if (arc) {
          relatedArcNames.add(getObjectDisplayName(arc));
        }
      });

      events.forEach((event) => {
        event.participantRefs.forEach((characterId) => {
          const character = characterById.get(characterId);

          if (character) {
            relatedCharacterNames.add(getObjectDisplayName(character));
          }
        });

        event.locationRefs.forEach((locationId) => {
          const location = locationById.get(locationId);

          if (location) {
            relatedLocationNames.add(getObjectDisplayName(location));
          }
        });

        event.arcRefs.forEach((arcId) => {
          const arc = arcById.get(arcId);

          if (arc) {
            relatedArcNames.add(getObjectDisplayName(arc));
          }
        });
      });

      return {
        id: slice.id,
        label: slice.title,
        objectType: "events" as const,
        eventCards: events.map((event) => createEventCard(event)),
        relatedCharacters: [...relatedCharacterNames],
        relatedLocations: [...relatedLocationNames],
        relatedArcs: [...relatedArcNames],
        summary: slice.summary,
        text: slice.text
      };
    });
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
    : mode === "chapter"
      ? buildChapterObservationSlices(project)
      : buildObjectObservationSlices(project, mode);

  return {
    chapterDimension: {
      title: "Chapter Management",
      description: "Structured chapter slices derived from the current world model."
    },
    slices
  };
}
