import type {
  ChapterSlice,
  ObjectTypeName,
  ProjectData,
  StoryObject
} from "@novelstory/schema";

export type LoadedProject = {
  projectPath: string;
  project: ProjectData;
};

async function parseJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(await response.text());
  }

  return (await response.json()) as T;
}

export async function fetchSampleProject(): Promise<LoadedProject> {
  return parseJsonResponse<LoadedProject>(await fetch("/api/projects/sample"));
}

export async function saveProjectObject(input: {
  projectPath: string;
  objectType: ObjectTypeName;
  objectId: string;
  changes: Record<string, unknown>;
}): Promise<StoryObject> {
  const response = await fetch("/api/projects/object", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });
  const payload = await parseJsonResponse<{ object: StoryObject }>(response);

  return payload.object;
}

export async function createProjectObject(input: {
  projectPath: string;
  objectType: ObjectTypeName;
  seed?: Record<string, unknown>;
}): Promise<StoryObject> {
  const response = await fetch("/api/projects/object", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });
  const payload = await parseJsonResponse<{ object: StoryObject }>(response);

  return payload.object;
}

export async function saveGraphLayout(input: {
  projectPath: string;
  layout: ProjectData["views"]["graph-layouts"][number];
}): Promise<ProjectData["views"]["graph-layouts"][number]> {
  const response = await fetch("/api/projects/graph-layout", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });
  const payload = await parseJsonResponse<{
    layout: ProjectData["views"]["graph-layouts"][number];
  }>(response);

  return payload.layout;
}

export async function saveTrackPreset(input: {
  projectPath: string;
  preset: ProjectData["views"]["track-presets"][number];
}): Promise<ProjectData["views"]["track-presets"][number]> {
  const response = await fetch("/api/projects/track-preset", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });
  const payload = await parseJsonResponse<{
    preset: ProjectData["views"]["track-presets"][number];
  }>(response);

  return payload.preset;
}

export async function saveChapterSlice(input: {
  projectPath: string;
  slice: ChapterSlice;
}): Promise<ChapterSlice> {
  const response = await fetch("/api/projects/chapter-slice", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });
  const payload = await parseJsonResponse<{
    slice: ChapterSlice;
  }>(response);

  return payload.slice;
}
