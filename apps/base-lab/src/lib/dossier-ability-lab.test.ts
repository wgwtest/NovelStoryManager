import { describe, expect, it } from "vitest";

import {
  buildAuditQueue,
  buildInspectorFields,
  collectObjectAppearances,
  collectObjectRelationEntries,
  collectBacklinks,
  createRelationInProject,
  createSampleProjectData,
  mergeObjectIntoProject
} from "./dossier-ability-lab.js";

describe("dossier ability lab helpers", () => {
  it("builds an audit queue for incomplete sample objects", () => {
    const project = createSampleProjectData();
    const queue = buildAuditQueue(project);
    const firstQueueItem = queue[0];

    expect(firstQueueItem).toBeDefined();
    expect(firstQueueItem).toMatchObject({
      objectId: "char_new_003",
      objectType: "characters"
    });
    expect(firstQueueItem?.missingFields).toContain("Summary");
  });

  it("collects backlinks for the active dossier object", () => {
    const project = createSampleProjectData();
    const backlinks = collectBacklinks(project, "faction_qingyun");

    expect(backlinks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "Faction",
          objectId: "char_suxuan",
          objectType: "characters",
          sourceName: "苏玄"
        })
      ])
    );
  });

  it("splits inspector fields into core, additional and reference groups", () => {
    const project = createSampleProjectData();
    const sections = buildInspectorFields(project.objects.characters[0]!);

    expect(sections.coreFields.map((field) => field.key)).toEqual([
      "id",
      "name",
      "summary",
      "tags",
      "status"
    ]);
    expect(sections.referenceFields.map((field) => field.key)).toContain("factionRefs");
    expect(sections.additionalFields.map((field) => field.key)).toContain("identity");
  });

  it("collects relation archive entries and shared appearances for an object", () => {
    const project = createSampleProjectData();
    const relationEntries = collectObjectRelationEntries(project, "char_suxuan");
    const firstEntry = relationEntries[0];

    expect(firstEntry).toBeDefined();
    expect(firstEntry).toMatchObject({
      counterpartyId: "char_linwan",
      counterpartyName: "林晚",
      relationType: "mentor"
    });
    expect(firstEntry?.sharedAppearances[0]).toMatchObject({
      eventId: "event_trial-valley",
      eventName: "试炼谷夺令"
    });
    expect(firstEntry?.sharedAppearances[0]?.sliceTitles).toContain("第一章 残火令现");
  });

  it("collects appearance records for active objects", () => {
    const project = createSampleProjectData();
    const appearances = collectObjectAppearances(project, "char_suxuan");

    expect(appearances[0]).toMatchObject({
      eventId: "event_trial-valley",
      eventName: "试炼谷夺令"
    });
    expect(appearances[0]?.roleLabels).toContain("Participant");
    expect(appearances[0]?.sliceTitles).toContain("第一章 残火令现");
  });

  it("merges local inspector edits back into the sample project", () => {
    const project = createSampleProjectData();
    const character = project.objects.characters[0];

    expect(character).toBeDefined();

    const nextProject = mergeObjectIntoProject(project, "characters", {
      ...character!,
      summary: "本地卷宗编辑结果"
    });

    expect(nextProject.objects.characters[0]?.summary).toBe("本地卷宗编辑结果");
    expect(project.objects.characters[0]?.summary).toBe(
      "寒门出身的少年修士，正在青云宗外门求存。"
    );
  });

  it("creates a new relation object and keeps the existing sample project immutable", () => {
    const project = createSampleProjectData();
    const next = createRelationInProject(project, {
      direction: "bidirectional",
      endAnchor: "",
      sourceRef: "char_suxuan",
      startAnchor: "卷一-中期",
      strength: 0.64,
      summary: "苏玄与新角色3开始形成同盟。",
      tags: ["人物关系", "临时同盟"],
      targetRef: "char_new_003",
      type: "ally"
    });

    expect(next.project.objects.relations).toHaveLength(project.objects.relations.length + 1);
    expect(next.project.objects.relations.at(-1)).toMatchObject({
      id: next.relationId,
      sourceRef: "char_suxuan",
      targetRef: "char_new_003",
      type: "ally"
    });
    expect(project.objects.relations).toHaveLength(1);
  });
});
