import {
  objectTypeNames,
  type ObjectTypeName,
  type ProjectData,
  type StoryObject
} from "@novelstory/schema";

import { getObjectDisplayName } from "../lib/object-display.js";

type EditableObject = StoryObject & Record<string, unknown>;

type ObjectInspectorProps = {
  draftObject: EditableObject | null;
  isSaving: boolean;
  project: ProjectData | null;
  onDraftChange: (field: string, value: string) => void;
  onJumpToReference: (objectType: ObjectTypeName, objectId: string) => void;
  onSaveObject: () => void;
};

type InspectorField = {
  key: string;
  label: string;
  inputKind: "readonly" | "text" | "textarea" | "number";
  value: unknown;
};

type ReferenceField = {
  key: string;
  label: string;
  targets: Array<{
    id: string;
    objectType: ObjectTypeName | null;
    displayName: string;
  }>;
};

const coreFieldOrder = [
  "id",
  "name",
  "summary",
  "tags",
  "status"
] as const;

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

function formatFieldValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (value === undefined || value === null) {
    return "";
  }

  return String(value);
}

function getInputKind(field: string, value: unknown): InspectorField["inputKind"] {
  if (field === "id") {
    return "readonly";
  }

  if (typeof value === "number") {
    return "number";
  }

  if (field === "summary" || field === "notes") {
    return "textarea";
  }

  return "text";
}

function resolveObjectReference(project: ProjectData, objectId: string): {
  objectType: ObjectTypeName;
  object: StoryObject;
} | null {
  for (const objectType of objectTypeNames) {
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

function buildInspectorSections(
  draftObject: EditableObject,
  project: ProjectData | null
): {
  coreFields: InspectorField[];
  additionalFields: InspectorField[];
  referenceFields: ReferenceField[];
} {
  const coreFields: InspectorField[] = [];
  const additionalFields: InspectorField[] = [];
  const referenceFields: ReferenceField[] = [];

  for (const [field, value] of Object.entries(draftObject)) {
    if (isReferenceField(field)) {
      const refIds = Array.isArray(value)
        ? value.filter((item): item is string => typeof item === "string" && item.length > 0)
        : typeof value === "string" && value.length > 0
          ? [value]
          : [];

      if (refIds.length > 0) {
        referenceFields.push({
          key: field,
          label: formatFieldLabel(field),
          targets: refIds.map((refId) => {
            const resolved = project ? resolveObjectReference(project, refId) : null;

            return {
              id: refId,
              objectType: resolved?.objectType ?? null,
              displayName: resolved ? getObjectDisplayName(resolved.object) : refId
            };
          })
        });
      }

      continue;
    }

    const nextField: InspectorField = {
      key: field,
      label: formatFieldLabel(field),
      inputKind: getInputKind(field, value),
      value
    };

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

  return {
    coreFields,
    additionalFields,
    referenceFields
  };
}

function renderInputField(
  field: InspectorField,
  onDraftChange: (field: string, value: string) => void
) {
  if (field.inputKind === "readonly") {
    return (
      <div className="inspector-readonly-field" key={field.key}>
        <span>{field.label}</span>
        <code>{formatFieldValue(field.value)}</code>
      </div>
    );
  }

  if (field.inputKind === "textarea") {
    return (
      <label key={field.key}>
        {field.label}
        <textarea
          autoComplete="off"
          name={field.key}
          onChange={(event) => onDraftChange(field.key, event.target.value)}
          value={formatFieldValue(field.value)}
        />
      </label>
    );
  }

  return (
    <label key={field.key}>
      {field.label}
      <input
        autoComplete="off"
        name={field.key}
        onChange={(event) => onDraftChange(field.key, event.target.value)}
        step={field.inputKind === "number" ? "any" : undefined}
        type={field.inputKind === "number" ? "number" : "text"}
        value={formatFieldValue(field.value)}
      />
    </label>
  );
}

export default function ObjectInspector(props: ObjectInspectorProps) {
  const sections = props.draftObject
    ? buildInspectorSections(props.draftObject, props.project)
    : null;

  return (
    <aside className="panel inspector">
      <div className="panel-header">
        <h2>Inspector</h2>
        <span>{props.draftObject?.id ?? "No selection"}</span>
      </div>

      {props.draftObject && sections ? (
        <form
          autoComplete="off"
          className="inspector-form"
          onSubmit={(event) => {
            event.preventDefault();
            props.onSaveObject();
          }}
        >
          <section className="inspector-section">
            <h3>Core Fields</h3>
            <div className="inspector-field-list">
              {sections.coreFields.map((field) =>
                renderInputField(field, props.onDraftChange)
              )}
            </div>
          </section>

          {sections.additionalFields.length > 0 ? (
            <section className="inspector-section">
              <h3>Additional Fields</h3>
              <div className="inspector-field-list">
                {sections.additionalFields.map((field) =>
                  renderInputField(field, props.onDraftChange)
                )}
              </div>
            </section>
          ) : null}

          <section className="inspector-section">
            <h3>References</h3>
            {sections.referenceFields.length > 0 ? (
              <div className="reference-field-list">
                {sections.referenceFields.map((field) => (
                  <div className="reference-field-group" key={field.key}>
                    <span className="reference-field-label">{field.label}</span>
                    <div className="reference-chip-list">
                      {field.targets.map((target) =>
                        target.objectType ? (
                          <button
                            className="reference-chip"
                            key={`${field.key}-${target.id}`}
                            onClick={() =>
                              props.onJumpToReference(target.objectType!, target.id)
                            }
                            type="button"
                          >
                            {target.displayName}
                          </button>
                        ) : (
                          <span
                            className="reference-chip reference-chip-broken"
                            key={`${field.key}-${target.id}`}
                          >
                            {target.displayName}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="inspector-section-empty">No references.</p>
            )}
          </section>

          <button disabled={props.isSaving} type="submit">
            Save Object
          </button>
        </form>
      ) : (
        <p>Select an object from the left library to inspect it.</p>
      )}
    </aside>
  );
}
