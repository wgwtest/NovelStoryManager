import { useEffect, useMemo, useState } from "react";

import type { ObjectTypeName, ProjectData, StoryObject } from "@novelstory/schema";

import { DossierReviewDeck, DossierSpecDeck } from "./DossierReviewDeck.js";
import {
  buildAuditQueue,
  buildDraftObject,
  buildInspectorFields,
  collectBacklinks,
  collectReferenceLinks,
  createSampleProjectData,
  formatFieldValue,
  getDossierObjectTypeOptions,
  getFilteredObjects,
  getObjectDisplayName,
  getObjectTypeLabel,
  getSavedFilters,
  mergeObjectIntoProject,
  parseDraftFieldValue,
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

function getInitialProject(): ProjectData {
  return createSampleProjectData();
}

function getFirstObjectId(project: ProjectData, objectType: ObjectTypeName): string {
  return (project.objects[objectType] as StoryObject[])[0]?.id ?? "";
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
                        <dd>{formatFieldValue((activeObject as Record<string, unknown>).status)}</dd>
                      </div>
                      <div>
                        <dt>Tags</dt>
                        <dd>{formatFieldValue((activeObject as Record<string, unknown>).tags)}</dd>
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
                  </article>
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
