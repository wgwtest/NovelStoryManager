import { describe, expect, it } from "vitest";

import { parseProjectData } from "@novelstory/schema";

import { buildObservationData } from "./project-observation.js";

function buildProjectFixture() {
  return parseProjectData({
    manifest: {
      projectId: "sample-novel",
      title: "Sample Novel",
      objectTypes: [
        "characters",
        "factions",
        "locations",
        "items",
        "realm-systems",
        "events",
        "relations",
        "clues",
        "arcs"
      ]
    },
    schemaVersion: {
      version: "1.0.0"
    },
    objects: {
      characters: [
        {
          id: "char_suxuan",
          name: "苏玄",
          aliases: [],
          tags: [],
          summary: "主角",
          status: "active",
          identity: "",
          factionRefs: [
            "faction_qingyun"
          ],
          realmState: "",
          notes: ""
        }
      ],
      factions: [
        {
          id: "faction_qingyun",
          name: "青云宗",
          aliases: [],
          tags: [],
          summary: "",
          type: "sect",
          goal: "",
          status: "active",
          locationRefs: [
            "loc_qingyun_peak"
          ]
        }
      ],
      locations: [
        {
          id: "loc_qingyun_peak",
          name: "青云峰",
          aliases: [],
          tags: [],
          summary: "",
          type: "mountain-sect",
          controllerRef: "faction_qingyun",
          traits: [],
          status: "active"
        }
      ],
      items: [],
      "realm-systems": [],
      events: [
        {
          id: "event_trial-valley",
          name: "试炼谷夺令",
          aliases: [],
          tags: [],
          summary: "事件",
          type: "discovery",
          participantRefs: [
            "char_suxuan"
          ],
          locationRefs: [
            "loc_qingyun_peak"
          ],
          factionRefs: [
            "faction_qingyun"
          ],
          itemRefs: [],
          timeAnchor: "卷一-早期",
          preconditions: [],
          results: [],
          arcRefs: [
            "arc_hidden-fire"
          ],
          clueRefs: []
        }
      ],
      relations: [],
      clues: [],
      arcs: [
        {
          id: "arc_hidden-fire",
          name: "隐火主线",
          summary: "围绕残火令展开",
          status: "active",
          eventRefs: [
            "event_trial-valley"
          ],
          objectRefs: [
            "char_suxuan",
            "loc_qingyun_peak"
          ],
          tags: []
        }
      ]
    },
    views: {
      "graph-layouts": [],
      "track-presets": [],
      "chapter-slices": [
        {
          id: "chapter-001",
          title: "第一章",
          summary: "摘要",
          text: "正文",
          sourceMode: "time",
          eventRefs: [
            "event_trial-valley"
          ],
          focusObjectRefs: [
            "char_suxuan"
          ],
          order: 1
        }
      ],
      "saved-filters": []
    }
  });
}

describe("buildObservationData", () => {
  it("builds chapter observation slices with derived related characters", () => {
    const observation = buildObservationData(buildProjectFixture(), "chapter");

    expect(observation.slices[0]).toMatchObject({
      id: "chapter-001",
      label: "第一章"
    });
    expect(observation.chapterDimension.title).toBe("Chapter Management");
    expect(observation.slices[0]?.relatedCharacters).toContain("苏玄");
    expect(observation.slices[0]?.relatedLocations).toContain("青云峰");
    expect(observation.slices[0]?.relatedArcs).toContain("隐火主线");
    expect(observation.slices[0]?.eventCards[0]?.label).toBe("试炼谷夺令");
  });
});
