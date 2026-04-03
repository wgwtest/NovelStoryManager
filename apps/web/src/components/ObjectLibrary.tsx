import type { ObjectTypeName, ProjectData, StoryObject } from "@novelstory/schema";

import { getObjectDisplayName } from "../lib/object-display.js";

type ObjectLibraryProps = {
  activeObjectType: ObjectTypeName;
  filterQuery: string;
  filteredCount: number;
  items: StoryObject[];
  onCreateObject: () => void;
  onChangeFilterQuery: (value: string) => void;
  project: ProjectData;
  selectedObjectId: string;
  onSelectObject: (objectId: string) => void;
  onSelectObjectType: (objectType: ObjectTypeName) => void;
};

export default function ObjectLibrary(props: ObjectLibraryProps) {
  const totalCount = props.project.objects[props.activeObjectType].length;

  return (
    <aside className="panel object-library">
      <div className="panel-header">
        <h2>Object Library</h2>
        <span>{props.filteredCount} / {totalCount} items</span>
      </div>

      <div className="object-library-actions">
        <button className="toolbar-button toolbar-button-primary" onClick={props.onCreateObject} type="button">
          Create Object
        </button>
      </div>

      <div className="object-type-list" aria-label="Object types">
        {props.project.manifest.objectTypes.map((objectType) => (
          <button
            key={objectType}
            className={
              objectType === props.activeObjectType
                ? "type-chip type-chip-active"
                : "type-chip"
            }
            onClick={() => props.onSelectObjectType(objectType)}
            type="button"
          >
            {objectType}
          </button>
        ))}
      </div>

      <label className="object-filter">
        Filter Objects
        <input
          autoComplete="off"
          aria-label="Filter Objects"
          onChange={(event) => props.onChangeFilterQuery(event.target.value)}
          placeholder="Search current type"
          type="text"
          value={props.filterQuery}
        />
      </label>

      <div className="object-list">
        {props.items.map((item) => (
          <button
            aria-label={getObjectDisplayName(item)}
            key={item.id}
            className={
              item.id === props.selectedObjectId
                ? "object-row object-row-active"
                : "object-row"
            }
            onClick={() => props.onSelectObject(item.id)}
            type="button"
          >
            <strong>{getObjectDisplayName(item)}</strong>
            <span>{item.id}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
