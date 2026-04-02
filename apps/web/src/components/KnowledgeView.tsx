import type { ObjectTypeName, StoryObject } from "@novelstory/schema";

import { getObjectDisplayName } from "../lib/object-display.js";

type KnowledgeViewProps = {
  activeObjectType: ObjectTypeName;
  items: StoryObject[];
  selectedObjectId: string;
  onSelectObject: (objectId: string) => void;
};

export default function KnowledgeView(props: KnowledgeViewProps) {
  return (
    <section className="panel knowledge-view">
      <div className="panel-header">
        <h2>Knowledge</h2>
        <span>{props.activeObjectType}</span>
      </div>

      <table className="knowledge-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Summary</th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>
          {props.items.map((item) => (
            <tr
              key={item.id}
              className={
                item.id === props.selectedObjectId ? "table-row-active" : undefined
              }
              onClick={() => props.onSelectObject(item.id)}
            >
              <td>{item.id}</td>
              <td>{getObjectDisplayName(item)}</td>
              <td>{item.summary}</td>
              <td>{item.tags.join(", ")}</td>
            </tr>
          ))}

          {props.items.length === 0 ? (
            <tr>
              <td className="knowledge-empty" colSpan={4}>
                No objects match the current filter.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </section>
  );
}
