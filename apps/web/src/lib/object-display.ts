import type { StoryObject } from "@novelstory/schema";

export function getObjectDisplayName(item: StoryObject): string {
  if ("name" in item) {
    return item.name;
  }

  return item.type;
}
