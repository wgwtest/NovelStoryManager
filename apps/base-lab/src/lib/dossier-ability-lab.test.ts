import { describe, expect, it } from "vitest";

import {
  buildAuditQueue,
  collectBacklinks,
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
});
