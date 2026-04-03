import { useEffect, useState } from "react";

import type { ObjectTypeName, ProjectData } from "@novelstory/schema";
import {
  panCanvasViewport,
  resizeCanvasViewport,
  zoomCanvasViewport
} from "@novelstory/view-core";

import {
  buildObservationData,
  observationModeOptions,
  type ObservationMode
} from "../lib/project-observation.js";
import {
  buildEventPatchForLaneDrop,
  buildTrackData,
  ensureTrackPreset,
  trackGroupingOptions,
  updateTrackPresetGrouping,
  type TrackGrouping,
  type TrackPresetDraft
} from "../lib/project-tracks.js";

type TracksViewProps = {
  isSavingChapterSlice: boolean;
  isSavingPreset: boolean;
  onCreateEvent: () => void;
  onMoveEvent: (
    eventId: string,
    changes: Partial<ProjectData["objects"]["events"][number]>
  ) => void;
  onSaveChapterSlice: (slice: ProjectData["views"]["chapter-slices"][number]) => void;
  onSavePreset: (preset: TrackPresetDraft) => void;
  onSelectObject: (objectType: ObjectTypeName, objectId: string) => void;
  project: ProjectData;
  selectedObjectId: string;
};

export default function TracksView(props: TracksViewProps) {
  const [presetDraft, setPresetDraft] = useState<TrackPresetDraft>(() =>
    ensureTrackPreset(props.project)
  );
  const [observationMode, setObservationMode] = useState<ObservationMode>("time");
  const [selectedChapterId, setSelectedChapterId] = useState(
    props.project.views["chapter-slices"][0]?.id ?? ""
  );
  const [chapterDraft, setChapterDraft] = useState(
    props.project.views["chapter-slices"][0] ?? null
  );

  useEffect(() => {
    setPresetDraft((current) => ensureTrackPreset(props.project, current.id));
  }, [props.project]);

  useEffect(() => {
    const nextChapter = props.project.views["chapter-slices"].find(
      (slice) => slice.id === selectedChapterId
    ) ?? props.project.views["chapter-slices"][0] ?? null;

    setSelectedChapterId(nextChapter?.id ?? "");
    setChapterDraft(nextChapter);
  }, [props.project, selectedChapterId]);

  const trackData = buildTrackData(props.project, presetDraft);
  const observationData = buildObservationData(props.project, observationMode);

  function moveLane(laneId: string, direction: -1 | 1) {
    const currentIndex = trackData.preset.laneOrder.findIndex((item) => item === laneId);
    const targetIndex = currentIndex + direction;

    if (
      currentIndex === -1 ||
      targetIndex < 0 ||
      targetIndex >= trackData.preset.laneOrder.length
    ) {
      return;
    }

    const nextLaneOrder = [...trackData.preset.laneOrder];
    const swappedLaneId = nextLaneOrder[targetIndex];

    if (!swappedLaneId) {
      return;
    }

    nextLaneOrder[targetIndex] = laneId;
    nextLaneOrder[currentIndex] = swappedLaneId;

    setPresetDraft((current) => ({
      ...current,
      laneOrder: nextLaneOrder
    }));
  }

  return (
    <section className="panel tracks-view">
      <div className="panel-header">
        <h2>Tracks</h2>
        <span>
          {trackData.lanes.length} lanes / {trackData.eventPlacements} placements
        </span>
      </div>

      <div className="tracks-toolbar">
        <button className="toolbar-button" onClick={props.onCreateEvent} type="button">
          Create Event
        </button>

        <label className="tracks-grouping-field">
          Track Grouping
          <select
            aria-label="Track Grouping"
            onChange={(event) =>
              setPresetDraft((current) =>
                updateTrackPresetGrouping(
                  props.project,
                  current,
                  event.target.value as TrackGrouping
                )
              )
            }
            value={trackData.preset.grouping}
          >
            {trackGroupingOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="tracks-grouping-field">
          Observation Mode
          <select
            aria-label="Observation Mode"
            onChange={(event) =>
              setObservationMode(event.target.value as ObservationMode)
            }
            value={observationMode}
          >
            {observationModeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <span className="tracks-preset-name">{trackData.preset.name}</span>

        <button
          className="toolbar-button"
          onClick={() =>
            setPresetDraft((current) => zoomCanvasViewport(current, current.zoom - 0.1))
          }
          type="button"
        >
          Zoom Out
        </button>

        <button
          className="toolbar-button"
          onClick={() =>
            setPresetDraft((current) => zoomCanvasViewport(current, current.zoom + 0.1))
          }
          type="button"
        >
          Zoom In
        </button>

        <label className="canvas-size-field">
          Canvas Width
          <input
            onChange={(event) =>
              setPresetDraft((current) =>
                resizeCanvasViewport(current, {
                  canvasWidth: Number(event.target.value),
                  canvasHeight: current.canvasHeight
                })
              )
            }
            type="number"
            value={trackData.preset.canvasWidth}
          />
        </label>

        <label className="canvas-size-field">
          Canvas Height
          <input
            onChange={(event) =>
              setPresetDraft((current) =>
                resizeCanvasViewport(current, {
                  canvasWidth: current.canvasWidth,
                  canvasHeight: Number(event.target.value)
                })
              )
            }
            type="number"
            value={trackData.preset.canvasHeight}
          />
        </label>

        <button
          className="toolbar-button"
          onClick={() =>
            setPresetDraft(ensureTrackPreset(props.project, trackData.preset.id))
          }
          type="button"
        >
          Reload Preset
        </button>

        <button
          className="toolbar-button toolbar-button-primary"
          disabled={props.isSavingPreset}
          onClick={() => props.onSavePreset(trackData.preset)}
          type="button"
        >
          Save Preset
        </button>
      </div>

      <div
        className="tracks-workspace"
        onWheel={(event) => {
          if (!event.shiftKey) {
            return;
          }

          event.preventDefault();
          setPresetDraft((current) =>
            panCanvasViewport(current, {
              deltaX: -event.deltaX,
              deltaY: -event.deltaY
            })
          );
        }}
        role="region"
        aria-label="Tracks Workspace"
      >
        <div
          className="tracks-stage"
          style={{
            height: `${trackData.preset.canvasHeight}px`,
            transform: `translate(${trackData.preset.offsetX}px, ${trackData.preset.offsetY}px) scale(${trackData.preset.zoom})`,
            width: `${trackData.preset.canvasWidth}px`
          }}
        >
          <div className="tracks-timeline">
            {trackData.timelineAnchors.map((anchor) => (
              <span className="timeline-anchor" key={anchor}>
                {anchor}
              </span>
            ))}
          </div>

          {trackData.lanes.map((lane, index) => {
          const isPersistableLane =
            lane.persistable && trackData.preset.laneOrder.includes(lane.id);

          return (
            <section
              aria-label={`Track Lane ${lane.label}`}
              className="track-lane"
              data-lane-id={lane.id}
              key={lane.id}
              onDragOver={(event) => {
                event.preventDefault();
              }}
              onDrop={(event) => {
                event.preventDefault();
                const eventId = event.dataTransfer.getData("text/plain");
                const sourceLaneId =
                  event.dataTransfer.getData("application/x-novelstory-lane") ||
                  undefined;
                const droppedEvent = props.project.objects.events.find(
                  (item) => item.id === eventId
                );

                if (!droppedEvent) {
                  return;
                }

                if (lane.persistable && lane.id !== sourceLaneId) {
                  props.onMoveEvent(
                    droppedEvent.id,
                    buildEventPatchForLaneDrop({
                      event: droppedEvent,
                      grouping: trackData.preset.grouping as TrackGrouping,
                      ...(sourceLaneId ? { sourceLaneId } : {}),
                      targetLaneId: lane.id
                    })
                  );
                }

                props.onSelectObject("events", droppedEvent.id);
              }}
              role="region"
            >
              <div className="track-lane-header">
                <div className="track-lane-title">
                  <h3>{lane.label}</h3>
                  <span>{lane.objectType}</span>
                </div>

                <div className="track-lane-actions">
                  {lane.objectType !== "events" ? (
                    <button
                      className="track-lane-select"
                      onClick={() => props.onSelectObject(lane.objectType, lane.id)}
                      type="button"
                    >
                      Open
                    </button>
                  ) : null}

                  <button
                    className="track-lane-move"
                    disabled={!isPersistableLane || index === 0}
                    onClick={() => moveLane(lane.id, -1)}
                    type="button"
                  >
                    Move Up
                  </button>

                  <button
                    className="track-lane-move"
                    disabled={
                      !isPersistableLane ||
                      index >= trackData.preset.laneOrder.length - 1
                    }
                    onClick={() => moveLane(lane.id, 1)}
                    type="button"
                  >
                    Move Down
                  </button>
                </div>
              </div>

              {lane.eventCards.length > 0 ? (
                <div className="track-event-list">
                  {lane.eventCards.map((eventCard) => (
                    <button
                      className={
                        eventCard.id === props.selectedObjectId
                          ? "track-event-card track-event-card-active"
                          : "track-event-card"
                      }
                      draggable
                      key={`${lane.id}:${eventCard.id}`}
                      onDragStart={(event) => {
                        event.dataTransfer.setData("text/plain", eventCard.id);
                        event.dataTransfer.setData(
                          "application/x-novelstory-lane",
                          lane.id
                        );
                      }}
                      onClick={() =>
                        props.onSelectObject(eventCard.objectType, eventCard.id)
                      }
                      type="button"
                    >
                      <strong>{eventCard.label}</strong>
                      <span className="track-event-meta">{eventCard.timeAnchor || "未标注时间"}</span>
                      <span className="track-event-meta">
                        T{eventCard.timeIndex + 1}
                      </span>
                      <span className="track-event-summary">{eventCard.summary}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="track-empty">No events in this lane.</p>
              )}
            </section>
          );
          })}
        </div>
      </div>

      <section className="observation-panel">
        <div className="panel-header">
          <h2>Observation Output</h2>
          <span>{observationData.slices.length} slices</span>
        </div>

        <div
          className="observation-workspace"
          role="region"
          aria-label="Observation Workspace"
        >
          {observationData.slices.length > 0 ? (
            observationData.slices.map((slice) => (
              <section
                aria-label={`Observation Slice ${slice.label}`}
                className="observation-slice"
                key={`${observationMode}:${slice.id}`}
                role="region"
              >
                <div className="observation-slice-header">
                  <div className="track-lane-title">
                    <h3>{slice.label}</h3>
                    <span>{slice.eventCards.length} events</span>
                  </div>

                  {slice.objectType !== "events" ? (
                    <button
                      className="track-lane-select"
                      onClick={() => props.onSelectObject(slice.objectType, slice.id)}
                      type="button"
                    >
                      Open
                    </button>
                  ) : null}
                </div>

                <div className="track-event-list">
                  {slice.eventCards.map((eventCard) => (
                    <button
                      className={
                        eventCard.id === props.selectedObjectId
                          ? "track-event-card track-event-card-active"
                          : "track-event-card"
                      }
                      key={`${slice.id}:${eventCard.id}`}
                      onClick={() =>
                        props.onSelectObject(eventCard.objectType, eventCard.id)
                      }
                      type="button"
                    >
                      <strong>{eventCard.label}</strong>
                      <span className="track-event-meta">{eventCard.timeAnchor || "未标注时间"}</span>
                      <span className="track-event-summary">{eventCard.summary}</span>
                    </button>
                  ))}
                </div>

                {slice.relatedCharacters.length > 0 ? (
                  <div className="observation-related-group">
                    <strong>Characters</strong>
                    <div className="observation-related-list">
                      {slice.relatedCharacters.map((name) => (
                        <span className="reference-chip" key={`${slice.id}:character:${name}`}>
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {slice.relatedLocations.length > 0 ? (
                  <div className="observation-related-group">
                    <strong>Locations</strong>
                    <div className="observation-related-list">
                      {slice.relatedLocations.map((name) => (
                        <span className="reference-chip" key={`${slice.id}:location:${name}`}>
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {slice.relatedArcs.length > 0 ? (
                  <div className="observation-related-group">
                    <strong>Arcs</strong>
                    <div className="observation-related-list">
                      {slice.relatedArcs.map((name) => (
                        <span className="reference-chip" key={`${slice.id}:arc:${name}`}>
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {slice.summary ? (
                  <p className="track-event-summary">{slice.summary}</p>
                ) : null}
              </section>
            ))
          ) : (
            <p className="track-empty">No observation slices available.</p>
          )}
        </div>

        <section className="chapter-dimension-placeholder">
          <h3>{observationData.chapterDimension.title}</h3>
          <p>{observationData.chapterDimension.description}</p>

          {observationMode === "chapter" && chapterDraft ? (
            <div className="chapter-editor">
              <label>
                Chapter Summary
                <input
                  onChange={(event) =>
                    setChapterDraft((current) =>
                      current
                        ? {
                            ...current,
                            summary: event.target.value
                          }
                        : current
                    )
                  }
                  type="text"
                  value={chapterDraft.summary}
                />
              </label>

              <label>
                Chapter Text
                <textarea
                  aria-label="Chapter Text"
                  onChange={(event) =>
                    setChapterDraft((current) =>
                      current
                        ? {
                            ...current,
                            text: event.target.value
                          }
                        : current
                    )
                  }
                  value={chapterDraft.text}
                />
              </label>

              <button
                className="toolbar-button toolbar-button-primary"
                disabled={props.isSavingChapterSlice}
                onClick={() => props.onSaveChapterSlice(chapterDraft)}
                type="button"
              >
                Save Chapter
              </button>
            </div>
          ) : null}
        </section>
      </section>
    </section>
  );
}
