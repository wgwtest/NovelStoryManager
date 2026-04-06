import { useEffect, useMemo, useState } from "react";

import type { ObjectTypeName, ProjectData, StoryObject } from "@novelstory/schema";

import { DossierReviewDeck, DossierSpecDeck } from "./DossierReviewDeck.js";
import {
  buildAuditQueue,
  buildDraftObject,
  buildInspectorFields,
  collectObjectAppearances,
  collectObjectRelationEntries,
  collectBacklinks,
  collectRelationContext,
  collectReferenceLinks,
  createRelationInProject,
  createSampleProjectData,
  formatFieldValue,
  getRelationTargetOptions,
  getDossierObjectTypeOptions,
  getFilteredObjects,
  getObjectDisplayName,
  getObjectTypeLabel,
  getSavedFilters,
  mergeObjectIntoProject,
  parseDraftFieldValue,
  resolveObjectReference,
  type EditableObject
} from "../lib/dossier-ability-lab.js";

type DossierAbilityLabProps = {
  onBack: () => void;
};

type DossierSelection = {
  objectId: string;
  objectType: ObjectTypeName;
};

type DossierLabMode = "review" | "spec" | "workbench";

type RelationComposerState = {
  direction: "bidirectional" | "forward";
  endAnchor: string;
  startAnchor: string;
  strength: string;
  summary: string;
  tags: string;
  targetRef: string;
  type: string;
};

function getInitialProject(): ProjectData {
  return createSampleProjectData();
}

function getFirstObjectId(project: ProjectData, objectType: ObjectTypeName): string {
  return (project.objects[objectType] as StoryObject[])[0]?.id ?? "";
}

function createRelationComposerState(targetRef = ""): RelationComposerState {
  return {
    direction: "forward",
    endAnchor: "",
    startAnchor: "",
    strength: "0.5",
    summary: "",
    tags: "",
    targetRef,
    type: "关系"
  };
}

function toReferenceIds(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.length > 0);
  }

  if (typeof value === "string" && value.length > 0) {
    return [value];
  }

  return [];
}

export default function DossierAbilityLab(props: DossierAbilityLabProps) {
  const [project, setProject] = useState<ProjectData>(() => getInitialProject());
  const [activeMode, setActiveMode] = useState<DossierLabMode>("review");
  const [activeObjectType, setActiveObjectType] = useState<ObjectTypeName>("characters");
  const [selectedObjectId, setSelectedObjectId] = useState("char_suxuan");
  const [activeFilterId, setActiveFilterId] = useState("filter-main-cast");
  const [filterQuery, setFilterQuery] = useState("苏");
  const [history, setHistory] = useState<DossierSelection[]>([]);
  const [draftObject, setDraftObject] = useState<EditableObject | null>(() =>
    buildDraftObject(getInitialProject(), "characters", "char_suxuan")
  );
  const [applyState, setApplyState] = useState("Mock Data");

  const savedFilters = useMemo(() => getSavedFilters(project), [project]);
  const objectTypeOptions = useMemo(() => getDossierObjectTypeOptions(), []);
  const filteredObjects = useMemo(
    () => getFilteredObjects(project, activeObjectType, filterQuery),
    [project, activeObjectType, filterQuery]
  );
  const activeObject = useMemo(() => {
    const currentCollection = project.objects[activeObjectType] as StoryObject[];
    const selectedObject =
      currentCollection.find((item) => item.id === selectedObjectId) ?? null;
    const isSelectedObjectVisible = selectedObject
      ? filteredObjects.some((item) => item.id === selectedObject.id)
      : false;

    return (
      (isSelectedObjectVisible ? selectedObject : null) ??
      filteredObjects[0] ??
      selectedObject ??
      currentCollection[0] ??
      null
    );
  }, [project, activeObjectType, selectedObjectId, filteredObjects]);

  const referenceLinks = useMemo(
    () => (activeObject ? collectReferenceLinks(project, activeObject) : []),
    [project, activeObject]
  );
  const relationEntries = useMemo(
    () => (activeObject ? collectObjectRelationEntries(project, activeObject.id) : []),
    [project, activeObject]
  );
  const appearanceEntries = useMemo(
    () => (activeObject ? collectObjectAppearances(project, activeObject.id) : []),
    [project, activeObject]
  );
  const relationContext = useMemo(
    () =>
      activeObjectType === "relations" && activeObject
        ? collectRelationContext(project, activeObject.id)
        : null,
    [project, activeObject, activeObjectType]
  );
  const backlinks = useMemo(
    () => (activeObject ? collectBacklinks(project, activeObject.id) : []),
    [project, activeObject]
  );
  const auditQueue = useMemo(() => buildAuditQueue(project), [project]);
  const activeAuditItem = useMemo(
    () =>
      activeObject
        ? auditQueue.find(
            (item) =>
              item.objectId === activeObject.id && item.objectType === activeObjectType
          ) ?? null
        : null,
    [auditQueue, activeObject, activeObjectType]
  );
  const inspectorSections = useMemo(
    () => (draftObject ? buildInspectorFields(draftObject) : null),
    [draftObject]
  );
  const relationTargetOptions = useMemo(
    () => (activeObject ? getRelationTargetOptions(project, activeObject.id) : []),
    [project, activeObject]
  );
  const [relationComposer, setRelationComposer] = useState<RelationComposerState>(() =>
    createRelationComposerState(
      getRelationTargetOptions(getInitialProject(), "char_suxuan")[0]?.objectId ?? ""
    )
  );

  useEffect(() => {
    if (activeObject && activeObject.id !== selectedObjectId) {
      setSelectedObjectId(activeObject.id);
    }
  }, [activeObject, selectedObjectId]);

  useEffect(() => {
    if (!activeObject) {
      setDraftObject(null);
      return;
    }

    setDraftObject(buildDraftObject(project, activeObjectType, activeObject.id));
  }, [project, activeObjectType, activeObject]);

  useEffect(() => {
    if (!activeObject || activeObjectType === "relations") {
      setRelationComposer(createRelationComposerState(""));
      return;
    }

    setRelationComposer((current) => {
      const nextTarget =
        relationTargetOptions.find((option) => option.objectId === current.targetRef)?.objectId ??
        relationTargetOptions[0]?.objectId ??
        "";

      return {
        ...current,
        targetRef: nextTarget
      };
    });
  }, [activeObject, activeObjectType, relationTargetOptions]);

  function handleObjectTypeChange(nextType: ObjectTypeName) {
    setActiveObjectType(nextType);
    setActiveFilterId("");
    setFilterQuery("");
    setSelectedObjectId(getFirstObjectId(project, nextType));
    setHistory([]);
    setApplyState("Mock Data");
  }

  function handleSavedFilter(filterId: string) {
    const filter = savedFilters.find((item) => item.id === filterId);

    if (!filter) {
      return;
    }

    const firstMatch =
      getFilteredObjects(project, filter.objectType, filter.query)[0]?.id ??
      getFirstObjectId(project, filter.objectType);

    setActiveFilterId(filter.id);
    setActiveObjectType(filter.objectType);
    setFilterQuery(filter.query);
    setSelectedObjectId(firstMatch);
    setHistory([]);
    setApplyState("Mock Data");
  }

  function handleOpenDossier(selection: DossierSelection, pushHistory: boolean) {
    if (pushHistory && activeObject) {
      setHistory((current) => [
        ...current,
        {
          objectId: activeObject.id,
          objectType: activeObjectType
        }
      ]);
    }

    setActiveObjectType(selection.objectType);
    setSelectedObjectId(selection.objectId);
    setActiveFilterId("");
    setFilterQuery("");
    setApplyState("Mock Data");
  }

  function handleReturnToPrevious() {
    const previousSelection = history.at(-1);

    if (!previousSelection) {
      return;
    }

    setHistory((current) => current.slice(0, -1));
    setActiveObjectType(previousSelection.objectType);
    setSelectedObjectId(previousSelection.objectId);
    setActiveFilterId("");
    setFilterQuery("");
    setApplyState("Mock Data");
  }

  function handleDraftChange(field: string, value: string) {
    setDraftObject((current) =>
      current
        ? {
            ...current,
            [field]: parseDraftFieldValue(current[field], value)
          }
        : null
    );
    setApplyState("未保存样例改写");
  }

  function handleApplyDraft() {
    if (!draftObject) {
      return;
    }

    const nextProject = mergeObjectIntoProject(project, activeObjectType, draftObject);

    setProject(nextProject);
    setApplyState("已应用到本页样例");
  }

  function handleRelationComposerChange(
    field: keyof RelationComposerState,
    value: string
  ) {
    setRelationComposer((current) => ({
      ...current,
      [field]: value
    }));
    setApplyState("未保存样例改写");
  }

  function handleCreateRelation() {
    if (!activeObject || activeObjectType === "relations" || !relationComposer.targetRef) {
      return;
    }

    const strength = Number(relationComposer.strength);
    const {
      project: nextProject,
      relationId
    } = createRelationInProject(project, {
      direction: relationComposer.direction,
      endAnchor: relationComposer.endAnchor,
      sourceRef: activeObject.id,
      startAnchor: relationComposer.startAnchor,
      strength: Number.isFinite(strength) ? strength : 0.5,
      summary: relationComposer.summary,
      tags: relationComposer.tags
        .split(/[\n,]/)
        .map((item) => item.trim())
        .filter(Boolean),
      targetRef: relationComposer.targetRef,
      type: relationComposer.type
    });

    setProject(nextProject);
    setRelationComposer(
      createRelationComposerState(
        relationTargetOptions.find((item) => item.objectId !== relationComposer.targetRef)?.objectId ??
          relationTargetOptions[0]?.objectId ??
          ""
      )
    );
    handleOpenDossier(
      {
        objectId: relationId,
        objectType: "relations"
      },
      true
    );
    setApplyState("已新建关系草案");
  }

  const activeObjectRecord = activeObject as (Record<string, unknown> & StoryObject) | null;
  const activeTagCount = Array.isArray(activeObjectRecord?.tags)
    ? activeObjectRecord.tags.length
    : 0;
  const activeFactionCount = toReferenceIds(activeObjectRecord?.factionRefs).length;

  const modeStatus =
    activeMode === "workbench"
      ? applyState
      : activeMode === "review"
        ? "Design Review"
        : "Schema Review";

  return (
    <div className="app-shell dossier-lab-shell">
      <header className="topbar dossier-lab-header">
        <div>
          <h1>WBS 4.1 卷宗独立验证</h1>
          <p>先审阅卷宗设计与样例规范，再进入 BaseLab 工作面验证，避免只看到操作结果却看不到设计前提。</p>
        </div>

        <div className="topbar-actions">
          <div className="status-pill" aria-live="polite">
            {modeStatus}
          </div>
          <button className="toolbar-button" onClick={props.onBack} type="button">
            Back to BaseLab
          </button>
        </div>
      </header>

      <div className="tab-strip dossier-mode-strip" role="tablist" aria-label="卷宗独立验证层级">
        <button
          aria-selected={activeMode === "review"}
          className={activeMode === "review" ? "tab-button tab-button-active" : "tab-button"}
          onClick={() => setActiveMode("review")}
          role="tab"
          type="button"
        >
          设计说明
        </button>
        <button
          aria-selected={activeMode === "spec"}
          className={activeMode === "spec" ? "tab-button tab-button-active" : "tab-button"}
          onClick={() => setActiveMode("spec")}
          role="tab"
          type="button"
        >
          样例规范
        </button>
        <button
          aria-selected={activeMode === "workbench"}
          className={activeMode === "workbench" ? "tab-button tab-button-active" : "tab-button"}
          onClick={() => setActiveMode("workbench")}
          role="tab"
          type="button"
        >
          工作面验证
        </button>
      </div>

      {activeMode === "review" ? (
        <DossierReviewDeck
          onOpenSpec={() => setActiveMode("spec")}
          onOpenWorkbench={() => setActiveMode("workbench")}
        />
      ) : null}

      {activeMode === "spec" ? (
        <DossierSpecDeck
          onOpenSpec={() => setActiveMode("spec")}
          onOpenWorkbench={() => setActiveMode("workbench")}
        />
      ) : null}

      {activeMode === "workbench" ? (
        <main className="dossier-lab-layout">
        <section className="panel dossier-directory-panel">
          <div className="panel-header">
            <h2>卷宗目录</h2>
            <span>{getObjectTypeLabel(activeObjectType)}</span>
          </div>

          <div className="dossier-panel-scroll">
            <section className="dossier-directory-section">
              <h3>对象分类</h3>
              <div className="dossier-chip-row">
                {objectTypeOptions.map((option) => (
                  <button
                    className={
                      option.objectType === activeObjectType
                        ? "toolbar-button toolbar-button-active"
                        : "toolbar-button"
                    }
                    key={option.objectType}
                    onClick={() => handleObjectTypeChange(option.objectType)}
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </section>

            <section className="dossier-directory-section">
              <h3>已保存筛选</h3>
              <div className="dossier-chip-row">
                {savedFilters.map((filter) => (
                  <button
                    className={
                      filter.id === activeFilterId
                        ? "toolbar-button toolbar-button-active"
                        : "toolbar-button"
                    }
                    key={filter.id}
                    onClick={() => handleSavedFilter(filter.id)}
                    type="button"
                  >
                    {filter.name}
                  </button>
                ))}
              </div>
            </section>

            <label className="dossier-filter-input">
              <span>筛选关键词</span>
              <input
                onChange={(event) => {
                  setFilterQuery(event.target.value);
                  setActiveFilterId("");
                }}
                placeholder="按名称、标签、摘要过滤"
                type="text"
                value={filterQuery}
              />
            </label>

            <div className="dossier-object-list">
              {filteredObjects.map((item) => (
                <button
                  aria-label={getObjectDisplayName(item)}
                  className={
                    item.id === activeObject?.id
                      ? "dossier-object-button dossier-object-button-active"
                      : "dossier-object-button"
                  }
                  key={item.id}
                  onClick={() =>
                    setSelectedObjectId(item.id)
                  }
                  type="button"
                >
                  <strong>{getObjectDisplayName(item)}</strong>
                  <span>{item.id}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="dossier-main-stack">
          <article className="panel dossier-content-panel">
            <div className="panel-header">
              <h2>卷宗正文</h2>
              {history.length > 0 ? (
                <button className="toolbar-button" onClick={handleReturnToPrevious} type="button">
                  返回上一卷
                </button>
              ) : (
                <span>{activeObject ? activeObject.id : "No object"}</span>
              )}
            </div>

            {activeObject ? (
              <div className="dossier-panel-scroll dossier-body">
                <section className="dossier-hero">
                  <p className="dossier-kicker">{getObjectTypeLabel(activeObjectType)}</p>
                  <h2>{getObjectDisplayName(activeObject)}</h2>
                  <p className="dossier-summary">
                    {formatFieldValue((activeObject as Record<string, unknown>).summary) || "待补录摘要"}
                  </p>
                </section>

                <section className="dossier-fact-grid">
                  <article className="dossier-fact-card">
                    <h3>身份与状态</h3>
                    <dl>
                      <div>
                        <dt>ID</dt>
                        <dd>{activeObject.id}</dd>
                      </div>
                      <div>
                        <dt>Status</dt>
                        <dd>{formatFieldValue(activeObjectRecord?.status)}</dd>
                      </div>
                      <div>
                        <dt>Identity</dt>
                        <dd>{formatFieldValue(activeObjectRecord?.identity) || "待补录身份"}</dd>
                      </div>
                      <div>
                        <dt>Tags</dt>
                        <dd>{formatFieldValue(activeObjectRecord?.tags) || "暂无标签"}</dd>
                      </div>
                      <div>
                        <dt>Tag Count</dt>
                        <dd>{activeTagCount}</dd>
                      </div>
                      <div>
                        <dt>Faction Count</dt>
                        <dd>{activeFactionCount}</dd>
                      </div>
                    </dl>
                  </article>

                  <article className="dossier-fact-card">
                    <h3>补录提示</h3>
                    <p className="dossier-inline-note">
                      当前页聚焦事实核对、引用跳转与字段补录，不承担主工作台壳层联动。
                    </p>
                    <p className="dossier-inline-note">
                      {activeAuditItem
                        ? `待补录字段：${activeAuditItem.missingFields.join(" / ")}`
                        : "当前对象缺失字段已补齐，可继续核对引用链。"}
                    </p>
                    <p className="dossier-inline-note">
                      卷宗在这里既承担事实查询，也承担字段、引用与关系的直接编辑；但轨道、场景编排仍留给其他视图处理。
                    </p>
                  </article>
                </section>

                {activeObjectType !== "relations" ? (
                  <section className="dossier-reference-section">
                    <div className="dossier-section-header">
                      <h3>关系档案</h3>
                      <span>{relationEntries.length} 项</span>
                    </div>

                    {relationEntries.length > 0 ? (
                      <div className="dossier-record-list">
                        {relationEntries.map((entry) => (
                          <article className="dossier-record-card" key={entry.relationId}>
                            <div className="dossier-record-headline">
                              <strong>{entry.relationType}</strong>
                              <span>
                                {entry.counterpartyName} · 强度 {entry.strength.toFixed(2)}
                              </span>
                            </div>
                            <p>{entry.relationSummary || "待补录关系摘要"}</p>
                            <p className="dossier-inline-note">
                              方向：{entry.direction} · 起点：{entry.startAnchor || "未标注"} ·
                              标签：{entry.relationTags.join(" / ") || "暂无标签"}
                            </p>
                            <p className="dossier-inline-note">
                              共同出场：
                              {entry.sharedAppearances.length > 0
                                ? entry.sharedAppearances
                                    .map((item) => item.eventName)
                                    .join(" / ")
                                : " 暂无共同事件"}
                            </p>
                            <div className="dossier-record-actions">
                              <button
                                className="toolbar-button"
                                onClick={() =>
                                  handleOpenDossier(
                                    {
                                      objectId: entry.relationId,
                                      objectType: "relations"
                                    },
                                    true
                                  )
                                }
                                type="button"
                              >
                                打开关系卷宗
                              </button>
                              <button
                                className="toolbar-button"
                                onClick={() =>
                                  handleOpenDossier(
                                    {
                                      objectId: entry.counterpartyId,
                                      objectType: entry.counterpartyType
                                    },
                                    true
                                  )
                                }
                                type="button"
                              >
                                打开 {entry.counterpartyName} 卷宗
                              </button>
                            </div>
                          </article>
                        ))}
                      </div>
                    ) : (
                      <p className="dossier-empty">当前对象还没有独立关系对象，可在右侧创建新的关系草案。</p>
                    )}
                  </section>
                ) : null}

                {activeObjectType === "relations" && relationContext ? (
                  <section className="dossier-reference-section">
                    <div className="dossier-section-header">
                      <h3>关系语境</h3>
                      <span>{relationContext.sharedAppearances.length} 项共同出场</span>
                    </div>

                    <div className="dossier-record-list">
                      <article className="dossier-record-card">
                        <div className="dossier-record-headline">
                          <strong>
                            {relationContext.sourceName} ↔ {relationContext.targetName}
                          </strong>
                          <span>关系对象 {relationContext.relationId}</span>
                        </div>
                        <p className="dossier-inline-note">
                          这条关系不是只读说明，它本身就是独立对象，可以编辑 source / target /
                          summary / strength / 标签。
                        </p>
                        <div className="dossier-record-actions">
                          <button
                            className="toolbar-button"
                            onClick={() =>
                              handleOpenDossier(
                                {
                                  objectId: relationContext.sourceId,
                                  objectType: relationContext.sourceType
                                },
                                true
                              )
                            }
                            type="button"
                          >
                            打开 {relationContext.sourceName} 卷宗
                          </button>
                          <button
                            className="toolbar-button"
                            onClick={() =>
                              handleOpenDossier(
                                {
                                  objectId: relationContext.targetId,
                                  objectType: relationContext.targetType
                                },
                                true
                              )
                            }
                            type="button"
                          >
                            打开 {relationContext.targetName} 卷宗
                          </button>
                        </div>
                      </article>
                    </div>
                  </section>
                ) : null}

                <section className="dossier-reference-section">
                  <div className="dossier-section-header">
                    <h3>出场记录</h3>
                    <span>{appearanceEntries.length} 项</span>
                  </div>

                  {appearanceEntries.length > 0 ? (
                    <div className="dossier-record-list">
                      {appearanceEntries.map((entry) => (
                        <article className="dossier-record-card" key={entry.eventId}>
                          <div className="dossier-record-headline">
                            <strong>{entry.eventName}</strong>
                            <span>{entry.timeAnchor || "未标注时间锚点"}</span>
                          </div>
                          <p>{entry.eventSummary || "待补录事件摘要"}</p>
                          <p className="dossier-inline-note">
                            出场角色：{entry.roleLabels.join(" / ")}
                          </p>
                          <p className="dossier-inline-note">
                            章节切片：
                            {entry.sliceTitles.length > 0
                              ? entry.sliceTitles.join(" / ")
                              : " 当前未投影到章节切片"}
                          </p>
                          <div className="dossier-record-actions">
                            <button
                              className="toolbar-button"
                              onClick={() =>
                                handleOpenDossier(
                                  {
                                    objectId: entry.eventId,
                                    objectType: "events"
                                  },
                                  true
                                )
                              }
                              type="button"
                            >
                              打开 {entry.eventName} 卷宗
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p className="dossier-empty">当前对象还没有事件出场记录，后续可继续补录事件与章节切片。</p>
                  )}
                </section>

                <section className="dossier-reference-section">
                  <div className="dossier-section-header">
                    <h3>引用跳转</h3>
                    <span>{referenceLinks.length} 项</span>
                  </div>

                  {referenceLinks.length > 0 ? (
                    <div className="dossier-reference-list">
                      {referenceLinks.map((link) => (
                        <button
                          aria-label={`打开 ${link.targetName} 卷宗`}
                          className="dossier-reference-button"
                          key={`${link.field}-${link.objectId}`}
                          onClick={() =>
                            handleOpenDossier(
                              {
                                objectId: link.objectId,
                                objectType: link.objectType
                              },
                              true
                            )
                          }
                          type="button"
                        >
                          <strong>打开 {link.targetName} 卷宗</strong>
                          <span>{link.field}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="dossier-empty">当前对象没有可跳转引用。</p>
                  )}
                </section>

                <section className="dossier-reference-section">
                  <div className="dossier-section-header">
                    <h3>引用回查</h3>
                    <span>{backlinks.length} 项</span>
                  </div>

                  {backlinks.length > 0 ? (
                    <div className="dossier-reference-list">
                      {backlinks.map((link) => (
                        <button
                          aria-label={`回查 ${link.sourceName} 卷宗`}
                          className="dossier-reference-button dossier-reference-button-secondary"
                          key={`${link.objectId}-${link.field}`}
                          onClick={() =>
                            handleOpenDossier(
                              {
                                objectId: link.objectId,
                                objectType: link.objectType
                              },
                              true
                            )
                          }
                          type="button"
                        >
                          <strong>回查 {link.sourceName} 卷宗</strong>
                          <span>{link.field}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="dossier-empty">当前对象暂无来源回查。</p>
                  )}
                </section>
              </div>
            ) : null}
          </article>

          <section className="panel dossier-audit-panel">
            <div className="panel-header">
              <h2>审校队列</h2>
              <span>{auditQueue.length} 项待核对</span>
            </div>

            <div className="dossier-panel-scroll">
              <div className="dossier-audit-list">
                {auditQueue.map((item) => (
                  <button
                    className="dossier-audit-item"
                    key={item.objectId}
                    onClick={() =>
                      handleOpenDossier(
                        {
                          objectId: item.objectId,
                          objectType: item.objectType
                        },
                        false
                      )
                    }
                    type="button"
                  >
                    <strong>{item.objectName}</strong>
                    <span>{getObjectTypeLabel(item.objectType)}</span>
                    <p>缺失字段：{item.missingFields.join(" / ")}</p>
                  </button>
                ))}
              </div>
            </div>
          </section>
        </section>

        <aside className="panel dossier-inspector-panel">
          <div className="panel-header">
            <h2>检查器</h2>
            <span>{activeObject?.id ?? "No selection"}</span>
          </div>

          {draftObject && inspectorSections ? (
            <form
              className="dossier-panel-scroll dossier-inspector-form"
              onSubmit={(event) => {
                event.preventDefault();
                handleApplyDraft();
              }}
            >
              <section className="dossier-inspector-section">
                <h3>Core Fields</h3>
                <div className="dossier-field-list">
                  {inspectorSections.coreFields.map((field) =>
                    field.inputKind === "readonly" ? (
                      <div className="dossier-readonly-field" key={field.key}>
                        <span>{field.label}</span>
                        <code>{formatFieldValue(field.value)}</code>
                      </div>
                    ) : field.inputKind === "textarea" ? (
                      <label key={field.key}>
                        <span>{field.label}</span>
                        <textarea
                          name={field.key}
                          onChange={(event) => handleDraftChange(field.key, event.target.value)}
                          value={formatFieldValue(field.value)}
                        />
                      </label>
                    ) : (
                      <label key={field.key}>
                        <span>{field.label}</span>
                        <input
                          name={field.key}
                          onChange={(event) => handleDraftChange(field.key, event.target.value)}
                          step={field.inputKind === "number" ? "any" : undefined}
                          type={field.inputKind === "number" ? "number" : "text"}
                          value={formatFieldValue(field.value)}
                        />
                      </label>
                    )
                  )}
                </div>
              </section>

              {inspectorSections.additionalFields.length > 0 ? (
                <section className="dossier-inspector-section">
                  <h3>Additional Fields</h3>
                  <div className="dossier-field-list">
                    {inspectorSections.additionalFields.map((field) =>
                      field.inputKind === "textarea" ? (
                        <label key={field.key}>
                          <span>{field.label}</span>
                          <textarea
                            name={field.key}
                            onChange={(event) => handleDraftChange(field.key, event.target.value)}
                            value={formatFieldValue(field.value)}
                          />
                        </label>
                      ) : (
                        <label key={field.key}>
                          <span>{field.label}</span>
                          <input
                            name={field.key}
                            onChange={(event) => handleDraftChange(field.key, event.target.value)}
                            step={field.inputKind === "number" ? "any" : undefined}
                            type={field.inputKind === "number" ? "number" : "text"}
                            value={formatFieldValue(field.value)}
                          />
                        </label>
                      )
                    )}
                  </div>
                </section>
              ) : null}

              {inspectorSections.referenceFields.length > 0 ? (
                <section className="dossier-inspector-section">
                  <h3>Reference Fields</h3>
                  <div className="dossier-field-list">
                    {inspectorSections.referenceFields.map((field) => {
                      const resolvedTargets = toReferenceIds(field.value).flatMap((objectId) => {
                        const resolved = resolveObjectReference(project, objectId);

                        if (!resolved) {
                          return [];
                        }

                        return [
                          {
                            objectId,
                            objectType: resolved.objectType,
                            label: `${getObjectTypeLabel(resolved.objectType)} · ${getObjectDisplayName(
                              resolved.object
                            )}`
                          }
                        ];
                      });

                      return field.inputKind === "textarea" ? (
                        <div className="dossier-reference-editor" key={field.key}>
                          <label>
                            <span>{field.label}</span>
                            <textarea
                              name={field.key}
                              onChange={(event) => handleDraftChange(field.key, event.target.value)}
                              value={formatFieldValue(field.value)}
                            />
                          </label>
                          {resolvedTargets.length > 0 ? (
                            <div className="reference-chip-list">
                              {resolvedTargets.map((target) => (
                                <button
                                  className="reference-chip"
                                  key={`${field.key}-${target.objectId}`}
                                  onClick={() =>
                                    handleOpenDossier(
                                      {
                                        objectId: target.objectId,
                                        objectType: target.objectType
                                      },
                                      true
                                    )
                                  }
                                  type="button"
                                >
                                  {target.label}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <p className="dossier-empty">当前字段暂无已解析引用。</p>
                          )}
                        </div>
                      ) : (
                        <div className="dossier-reference-editor" key={field.key}>
                          <label>
                            <span>{field.label}</span>
                            <input
                              name={field.key}
                              onChange={(event) => handleDraftChange(field.key, event.target.value)}
                              type="text"
                              value={formatFieldValue(field.value)}
                            />
                          </label>
                          {resolvedTargets.length > 0 ? (
                            <div className="reference-chip-list">
                              {resolvedTargets.map((target) => (
                                <button
                                  className="reference-chip"
                                  key={`${field.key}-${target.objectId}`}
                                  onClick={() =>
                                    handleOpenDossier(
                                      {
                                        objectId: target.objectId,
                                        objectType: target.objectType
                                      },
                                      true
                                    )
                                  }
                                  type="button"
                                >
                                  {target.label}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <p className="dossier-empty">当前字段暂无已解析引用。</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              ) : null}

              {activeObject && activeObjectType !== "relations" ? (
                <section className="dossier-inspector-section">
                  <h3>关系草拟</h3>
                  <div className="dossier-field-list">
                    <label>
                      <span>Target Object</span>
                      <select
                        name="relation-target"
                        onChange={(event) =>
                          handleRelationComposerChange("targetRef", event.target.value)
                        }
                        value={relationComposer.targetRef}
                      >
                        {relationTargetOptions.map((option) => (
                          <option key={option.objectId} value={option.objectId}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      <span>Relation Type</span>
                      <input
                        name="relation-type"
                        onChange={(event) => handleRelationComposerChange("type", event.target.value)}
                        type="text"
                        value={relationComposer.type}
                      />
                    </label>
                    <label>
                      <span>Direction</span>
                      <select
                        name="relation-direction"
                        onChange={(event) =>
                          handleRelationComposerChange(
                            "direction",
                            event.target.value as RelationComposerState["direction"]
                          )
                        }
                        value={relationComposer.direction}
                      >
                        <option value="forward">forward</option>
                        <option value="bidirectional">bidirectional</option>
                      </select>
                    </label>
                    <label>
                      <span>Strength</span>
                      <input
                        max="1"
                        min="0"
                        name="relation-strength"
                        onChange={(event) =>
                          handleRelationComposerChange("strength", event.target.value)
                        }
                        step="0.05"
                        type="number"
                        value={relationComposer.strength}
                      />
                    </label>
                    <label>
                      <span>Start Anchor</span>
                      <input
                        name="relation-start-anchor"
                        onChange={(event) =>
                          handleRelationComposerChange("startAnchor", event.target.value)
                        }
                        type="text"
                        value={relationComposer.startAnchor}
                      />
                    </label>
                    <label>
                      <span>End Anchor</span>
                      <input
                        name="relation-end-anchor"
                        onChange={(event) =>
                          handleRelationComposerChange("endAnchor", event.target.value)
                        }
                        type="text"
                        value={relationComposer.endAnchor}
                      />
                    </label>
                    <label>
                      <span>Relation Tags</span>
                      <input
                        name="relation-tags"
                        onChange={(event) => handleRelationComposerChange("tags", event.target.value)}
                        placeholder="人物关系,宗门往来"
                        type="text"
                        value={relationComposer.tags}
                      />
                    </label>
                    <label>
                      <span>Relation Summary</span>
                      <textarea
                        name="relation-summary"
                        onChange={(event) =>
                          handleRelationComposerChange("summary", event.target.value)
                        }
                        value={relationComposer.summary}
                      />
                    </label>
                    <button
                      className="toolbar-button"
                      onClick={handleCreateRelation}
                      type="button"
                    >
                      新建关系草案并打开卷宗
                    </button>
                  </div>
                </section>
              ) : null}

              <div className="dossier-inspector-actions">
                <button className="toolbar-button toolbar-button-primary" type="submit">
                  应用到本页样例
                </button>
              </div>
            </form>
          ) : null}
        </aside>
        </main>
      ) : null}
    </div>
  );
}
