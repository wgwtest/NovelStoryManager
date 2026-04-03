import { useEffect, useState } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";

import type { ObjectTypeName, ProjectData, StoryObject } from "@novelstory/schema";

import {
  createProjectObject,
  fetchSampleProject,
  saveChapterSlice,
  saveGraphLayout,
  saveProjectObject,
  saveTrackPreset,
  type LoadedProject
} from "./api/projects.js";
import GraphView from "./components/GraphView.js";
import ObjectInspector from "./components/ObjectInspector.js";
import KnowledgeView from "./components/KnowledgeView.js";
import ObjectLibrary from "./components/ObjectLibrary.js";
import TracksView from "./components/TracksView.js";
import { getObjectDisplayName } from "./lib/object-display.js";

type AppTab = "Knowledge" | "Graph" | "Tracks";
type EditableObject = StoryObject & Record<string, unknown>;

function buildDraftObject(
  project: ProjectData,
  objectType: ObjectTypeName,
  objectId: string
): EditableObject | null {
  const found = project.objects[objectType].find((item) => item.id === objectId);

  if (!found) {
    return null;
  }

  return { ...found };
}

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

function matchesObjectFilter(item: StoryObject, query: string): boolean {
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

function parseDraftFieldValue(currentValue: unknown, value: string): unknown {
  if (Array.isArray(currentValue)) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof currentValue === "number") {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : currentValue;
  }

  return value;
}

function mergeObjectIntoProject(
  loadedProject: LoadedProject,
  objectType: ObjectTypeName,
  object: StoryObject
): LoadedProject {
  const currentCollection = loadedProject.project.objects[objectType] as StoryObject[];
  const nextCollection = currentCollection.some((item) => item.id === object.id)
    ? currentCollection.map((item) => (item.id === object.id ? object : item))
    : [
        ...currentCollection,
        object
      ];

  return {
    ...loadedProject,
    project: {
      ...loadedProject.project,
      objects: {
        ...loadedProject.project.objects,
        [objectType]: nextCollection
      }
    }
  } as LoadedProject;
}

export default function App() {
  const [loadedProject, setLoadedProject] = useState<LoadedProject | null>(null);
  const [activeTab, setActiveTab] = useState<AppTab>("Knowledge");
  const [activeObjectType, setActiveObjectType] =
    useState<ObjectTypeName>("characters");
  const [objectFilterQuery, setObjectFilterQuery] = useState("");
  const [selectedObjectId, setSelectedObjectId] = useState("");
  const [draftObject, setDraftObject] = useState<EditableObject | null>(null);
  const [statusMessage, setStatusMessage] = useState("Loading sample project...");
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingGraphLayout, setIsSavingGraphLayout] = useState(false);
  const [isSavingTrackPreset, setIsSavingTrackPreset] = useState(false);
  const [isSavingChapterSlice, setIsSavingChapterSlice] = useState(false);

  const filteredObjects = loadedProject
    ? loadedProject.project.objects[activeObjectType].filter((item) =>
        matchesObjectFilter(item, objectFilterQuery)
      )
    : [];

  useEffect(() => {
    let cancelled = false;

    async function loadProject() {
      try {
        const project = await fetchSampleProject();

        if (cancelled) {
          return;
        }

        const firstObject = project.project.objects.characters[0];

        setLoadedProject(project);
        setSelectedObjectId(firstObject?.id ?? "");
        setDraftObject(
          firstObject ? ({ ...firstObject } as EditableObject) : null
        );
        setStatusMessage("Sample project loaded.");
      } catch (error) {
        setStatusMessage(
          error instanceof Error ? error.message : "Failed to load project."
        );
      }
    }

    void loadProject();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!loadedProject) {
      return;
    }

    if (!selectedObjectId) {
      setDraftObject(null);
      return;
    }

    setDraftObject(buildDraftObject(loadedProject.project, activeObjectType, selectedObjectId));
  }, [activeObjectType, loadedProject, selectedObjectId]);

  useEffect(() => {
    if (!loadedProject) {
      return;
    }

    if (filteredObjects.some((item) => item.id === selectedObjectId)) {
      return;
    }

    const nextObjectId = filteredObjects[0]?.id ?? "";
    setSelectedObjectId(nextObjectId);

    if (!nextObjectId) {
      setDraftObject(null);
    }
  }, [filteredObjects, loadedProject, selectedObjectId]);

  function handleSelectObjectType(objectType: ObjectTypeName) {
    setObjectFilterQuery("");
    setActiveObjectType(objectType);
    setActiveTab("Knowledge");
  }

  function handleSelectObject(objectId: string) {
    if (!loadedProject) {
      return;
    }

    setSelectedObjectId(objectId);
    setDraftObject(buildDraftObject(loadedProject.project, activeObjectType, objectId));
  }

  function handleDraftChange(field: string, value: string) {
    setDraftObject((current) =>
      current
        ? {
            ...current,
            [field]: parseDraftFieldValue(current[field], value)
          }
        : current
    );
  }

  function handleJumpToReference(objectType: ObjectTypeName, objectId: string) {
    setObjectFilterQuery("");
    setActiveTab("Knowledge");
    setActiveObjectType(objectType);
    setSelectedObjectId(objectId);
  }

  function handleSelectGraphObject(objectType: ObjectTypeName, objectId: string) {
    if (!loadedProject) {
      return;
    }

    setObjectFilterQuery("");
    setActiveObjectType(objectType);
    setSelectedObjectId(objectId);
    setDraftObject(buildDraftObject(loadedProject.project, objectType, objectId));
  }

  async function handleSaveObject() {
    if (!loadedProject || !draftObject) {
      return;
    }

    const submittedDraft = draftObject;

    setIsSaving(true);
    setStatusMessage("Saving object...");

    try {
      const savedObject = await saveProjectObject({
        projectPath: loadedProject.projectPath,
        objectType: activeObjectType,
        objectId: submittedDraft.id,
        changes: submittedDraft
      });
      const mergedObject = {
        ...submittedDraft,
        ...(savedObject as Record<string, unknown>)
      } as EditableObject;

      const nextProject: LoadedProject = {
        ...loadedProject,
        project: {
          ...loadedProject.project,
          objects: {
            ...loadedProject.project.objects,
            [activeObjectType]: loadedProject.project.objects[activeObjectType].map(
              (item) => (item.id === mergedObject.id ? mergedObject : item)
            )
          }
        }
      };

      setLoadedProject(nextProject);
      setDraftObject(mergedObject);
      setStatusMessage("Object saved.");
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Failed to save object."
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleCreateObject(objectTypeOverride?: ObjectTypeName) {
    if (!loadedProject) {
      return;
    }

    const targetObjectType = objectTypeOverride ?? activeObjectType;

    setIsSaving(true);
    setStatusMessage("Creating object...");

    try {
      const object = await createProjectObject({
        projectPath: loadedProject.projectPath,
        objectType: targetObjectType
      });
      const createdObject = object as EditableObject;
      const nextProject = mergeObjectIntoProject(
        loadedProject,
        targetObjectType,
        createdObject
      );

      setActiveObjectType(targetObjectType);
      setLoadedProject(nextProject);
      setSelectedObjectId(createdObject.id);
      setDraftObject(createdObject);
      setStatusMessage("Object created.");
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Failed to create object."
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSaveGraphLayout(
    layout: ProjectData["views"]["graph-layouts"][number]
  ) {
    if (!loadedProject) {
      return;
    }

    setIsSavingGraphLayout(true);
    setStatusMessage("Saving graph layout...");

    try {
      const savedLayout = await saveGraphLayout({
        projectPath: loadedProject.projectPath,
        layout
      });
      const existingLayouts = loadedProject.project.views["graph-layouts"];
      const layoutIndex = existingLayouts.findIndex(
        (item) => item.id === savedLayout.id
      );
      const nextLayouts = layoutIndex === -1
        ? [
            ...existingLayouts,
            savedLayout
          ]
        : existingLayouts.map((item, index) =>
            index === layoutIndex ? savedLayout : item
          );

      setLoadedProject({
        ...loadedProject,
        project: {
          ...loadedProject.project,
          views: {
            ...loadedProject.project.views,
            "graph-layouts": nextLayouts
          }
        }
      });
      setStatusMessage("Graph layout saved.");
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Failed to save graph layout."
      );
    } finally {
      setIsSavingGraphLayout(false);
    }
  }

  async function handleMoveEvent(
    eventId: string,
    changes: Partial<ProjectData["objects"]["events"][number]>
  ) {
    if (!loadedProject) {
      return;
    }

    setStatusMessage("Moving event...");

    try {
      const savedEvent = await saveProjectObject({
        projectPath: loadedProject.projectPath,
        objectType: "events",
        objectId: eventId,
        changes
      });
      const nextProject = mergeObjectIntoProject(loadedProject, "events", savedEvent);

      setActiveObjectType("events");
      setLoadedProject(nextProject);
      setSelectedObjectId(savedEvent.id);
      setDraftObject(savedEvent as EditableObject);
      setStatusMessage("Event moved.");
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Failed to move event."
      );
    }
  }

  async function handleSaveTrackPreset(
    preset: ProjectData["views"]["track-presets"][number]
  ) {
    if (!loadedProject) {
      return;
    }

    setIsSavingTrackPreset(true);
    setStatusMessage("Saving track preset...");

    try {
      const savedPreset = await saveTrackPreset({
        projectPath: loadedProject.projectPath,
        preset
      });
      const existingPresets = loadedProject.project.views["track-presets"];
      const presetIndex = existingPresets.findIndex((item) => item.id === savedPreset.id);
      const nextPresets = presetIndex === -1
        ? [
            ...existingPresets,
            savedPreset
          ]
        : existingPresets.map((item, index) =>
            index === presetIndex ? savedPreset : item
          );

      setLoadedProject({
        ...loadedProject,
        project: {
          ...loadedProject.project,
          views: {
            ...loadedProject.project.views,
            "track-presets": nextPresets
          }
        }
      });
      setStatusMessage("Track preset saved.");
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Failed to save track preset."
      );
    } finally {
      setIsSavingTrackPreset(false);
    }
  }

  async function handleCreateRelation(targetObjectId: string) {
    if (!loadedProject || !selectedObjectId || selectedObjectId === targetObjectId) {
      return;
    }

    setStatusMessage("Creating graph relation...");

    try {
      const object = await createProjectObject({
        projectPath: loadedProject.projectPath,
        objectType: "relations",
        seed: {
          type: "association",
          sourceRef: selectedObjectId,
          targetRef: targetObjectId,
          summary: "由关系图创建"
        }
      });

      setLoadedProject({
        ...loadedProject,
        project: {
          ...loadedProject.project,
          objects: {
            ...loadedProject.project.objects,
            relations: [
              ...loadedProject.project.objects.relations,
              object as ProjectData["objects"]["relations"][number]
            ]
          }
        }
      });
      setStatusMessage("Graph relation created.");
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Failed to create graph relation."
      );
    }
  }

  async function handleSaveChapterSlice(
    slice: ProjectData["views"]["chapter-slices"][number]
  ) {
    if (!loadedProject) {
      return;
    }

    setIsSavingChapterSlice(true);
    setStatusMessage("Saving chapter slice...");

    try {
      const savedSlice = await saveChapterSlice({
        projectPath: loadedProject.projectPath,
        slice
      });
      const existingSlices = loadedProject.project.views["chapter-slices"];
      const sliceIndex = existingSlices.findIndex((item) => item.id === savedSlice.id);
      const nextSlices = sliceIndex === -1
        ? [
            ...existingSlices,
            savedSlice
          ]
        : existingSlices.map((item, index) =>
            index === sliceIndex ? savedSlice : item
          );

      setLoadedProject({
        ...loadedProject,
        project: {
          ...loadedProject.project,
          views: {
            ...loadedProject.project.views,
            "chapter-slices": nextSlices
          }
        }
      });
      setStatusMessage("Chapter slice saved.");
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Failed to save chapter slice."
      );
    } finally {
      setIsSavingChapterSlice(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>{loadedProject?.project.manifest.title ?? "NovelStoryManager"}</h1>
          <p>Single-project, file-backed story model workbench.</p>
        </div>

        <div className="topbar-actions">
          <div className="status-pill" aria-live="polite">
            {statusMessage}
          </div>
        </div>
      </header>

      <nav className="tab-strip" aria-label="Workbench tabs" role="tablist">
        {(["Knowledge", "Graph", "Tracks"] as AppTab[]).map((tab) => (
          <button
            key={tab}
            aria-selected={activeTab === tab}
            className={activeTab === tab ? "tab-button tab-button-active" : "tab-button"}
            onClick={() => setActiveTab(tab)}
            role="tab"
            type="button"
          >
            {tab}
          </button>
        ))}
      </nav>

      <Group id="novel-story-manager-shell" orientation="horizontal">
        <Panel defaultSize={22} minSize={18}>
          {loadedProject ? (
            <ObjectLibrary
              activeObjectType={activeObjectType}
              filterQuery={objectFilterQuery}
              filteredCount={filteredObjects.length}
              items={filteredObjects}
              onCreateObject={() => {
                void handleCreateObject();
              }}
              onChangeFilterQuery={setObjectFilterQuery}
              onSelectObject={handleSelectObject}
              onSelectObjectType={handleSelectObjectType}
              project={loadedProject.project}
              selectedObjectId={selectedObjectId}
            />
          ) : (
            <aside className="panel object-library">
              <div className="panel-header">
                <h2>Object Library</h2>
              </div>
            </aside>
          )}
        </Panel>

        <Separator className="resize-handle" />

        <Panel defaultSize={48} minSize={35}>
          {loadedProject && activeTab === "Knowledge" ? (
            <KnowledgeView
              activeObjectType={activeObjectType}
              items={filteredObjects}
              onSelectObject={handleSelectObject}
              selectedObjectId={selectedObjectId}
            />
          ) : loadedProject && activeTab === "Graph" ? (
            <GraphView
              activeObjectType={activeObjectType}
              isSavingLayout={isSavingGraphLayout}
              onCreateObject={() => {
                void handleCreateObject();
              }}
              onCreateRelation={(targetObjectId) => {
                void handleCreateRelation(targetObjectId);
              }}
              onSaveLayout={(layout) => {
                void handleSaveGraphLayout(layout);
              }}
              onSelectObject={handleSelectGraphObject}
              project={loadedProject.project}
              selectedObjectId={selectedObjectId}
            />
          ) : loadedProject && activeTab === "Tracks" ? (
            <TracksView
              isSavingPreset={isSavingTrackPreset}
              isSavingChapterSlice={isSavingChapterSlice}
              onCreateEvent={() => {
                void handleCreateObject("events");
              }}
              onMoveEvent={(eventId, changes) => {
                void handleMoveEvent(eventId, changes);
              }}
              onSaveChapterSlice={(slice) => {
                void handleSaveChapterSlice(slice);
              }}
              onSavePreset={(preset) => {
                void handleSaveTrackPreset(preset);
              }}
              onSelectObject={handleSelectGraphObject}
              project={loadedProject.project}
              selectedObjectId={selectedObjectId}
            />
          ) : (
            <section className="panel placeholder-panel">
              <div className="panel-header">
                <h2>{activeTab}</h2>
              </div>
              <p>
                {activeTab} view will be implemented in a later WBS node.
              </p>
            </section>
          )}
        </Panel>

        <Separator className="resize-handle" />

        <Panel defaultSize={30} minSize={24}>
          <ObjectInspector
            draftObject={draftObject}
            isSaving={isSaving}
            onDraftChange={handleDraftChange}
            onJumpToReference={handleJumpToReference}
            onSaveObject={() => {
              void handleSaveObject();
            }}
            project={loadedProject?.project ?? null}
          />
        </Panel>
      </Group>
    </div>
  );
}
