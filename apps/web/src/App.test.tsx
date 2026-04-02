import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import App from "./App.js";

const sampleProjectResponse = {
  projectPath: "/tmp/sample-novel",
  project: {
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
          tags: [
            "主角"
          ],
          summary: "寒门出身的少年修士",
          status: "active",
          identity: "外门弟子",
          factionRefs: [
            "faction_qingyun"
          ],
          realmState: "炼气境",
          notes: ""
        },
        {
          id: "char_linwan",
          name: "林晚",
          aliases: [],
          tags: [
            "配角",
            "丹修"
          ],
          summary: "善于炼丹与情报搜集的内门弟子",
          status: "active",
          identity: "内门弟子",
          factionRefs: [
            "faction_qingyun"
          ],
          realmState: "筑基境",
          notes: ""
        }
      ],
      factions: [
        {
          id: "faction_qingyun",
          name: "青云宗",
          aliases: [],
          tags: [
            "宗门"
          ],
          summary: "北境中等宗门",
          type: "sect",
          goal: "守住北境灵脉",
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
          tags: [
            "宗门驻地"
          ],
          summary: "青云宗主峰",
          type: "mountain-sect",
          controllerRef: "faction_qingyun",
          traits: [
            "风雷灵脉"
          ],
          status: "active"
        }
      ],
      items: [
        {
          id: "item_fire-token",
          name: "残火令",
          aliases: [],
          tags: [
            "线索物品"
          ],
          summary: "残破令牌",
          type: "token",
          ownerRef: "char_suxuan",
          origin: "外门试炼谷",
          status: "active",
          traits: [
            "微弱火灵波动"
          ]
        }
      ],
      "realm-systems": [],
      events: [
        {
          id: "event_trial-valley",
          name: "试炼谷夺令",
          aliases: [],
          tags: [
            "主线事件"
          ],
          summary: "苏玄在试炼谷意外得到残火令",
          type: "discovery",
          participantRefs: [
            "char_suxuan",
            "char_linwan"
          ],
          locationRefs: [
            "loc_qingyun_peak"
          ],
          factionRefs: [
            "faction_qingyun"
          ],
          itemRefs: [
            "item_fire-token"
          ],
          timeAnchor: "卷一-早期",
          preconditions: [
            "外门试炼开始"
          ],
          results: [
            "苏玄获得残火令"
          ],
          arcRefs: [
            "arc_fire-vein"
          ],
          clueRefs: []
        }
      ],
      relations: [
        {
          id: "rel_linwan-guides-suxuan",
          type: "mentor",
          sourceRef: "char_linwan",
          targetRef: "char_suxuan",
          direction: "forward",
          strength: 0.72,
          startAnchor: "卷一-早期",
          endAnchor: "",
          summary: "林晚在试炼前后多次照应苏玄",
          tags: [
            "人物关系"
          ]
        }
      ],
      clues: [
        {
          id: "clue_hidden-note",
          name: "离线线索",
          summary: "与当前主角线暂未连通的旁支线索",
          status: "hidden",
          objectRefs: [],
          eventRefs: [],
          revealCondition: "未触发",
          tags: [
            "旁支"
          ]
        }
      ],
      arcs: [
        {
          id: "arc_fire-vein",
          name: "隐火灵脉主线",
          summary: "围绕残火令展开的主线剧情",
          status: "active",
          eventRefs: [
            "event_trial-valley"
          ],
          objectRefs: [
            "char_suxuan",
            "item_fire-token",
            "loc_qingyun_peak"
          ],
          tags: [
            "主线"
          ]
        }
      ]
    },
    views: {
      "graph-layouts": [
        {
          id: "default-graph",
          name: "默认关系图",
          positions: {
            char_suxuan: {
              x: 120,
              y: 80
            },
            char_linwan: {
              x: 360,
              y: 120
            },
            faction_qingyun: {
              x: 250,
              y: 260
            },
            "item_fire-token": {
              x: 470,
              y: 220
            },
            "event_trial-valley": {
              x: 520,
              y: 60
            },
            "clue_hidden-note": {
              x: 640,
              y: 320
            }
          },
          zoom: 1
        }
      ],
      "track-presets": [
        {
          id: "default-tracks",
          name: "默认轨道预设",
          grouping: "character",
          laneOrder: [
            "char_suxuan",
            "char_linwan"
          ],
          zoom: 1
        }
      ],
      "saved-filters": []
    }
  }
};

describe("App", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);

        if (url.endsWith("/api/projects/sample")) {
          return new Response(JSON.stringify(sampleProjectResponse), {
            status: 200
          });
        }

        if (url.endsWith("/api/projects/object") && init?.method === "PATCH") {
          const payload = JSON.parse(String(init.body));

          return new Response(
            JSON.stringify({
              object: {
                ...sampleProjectResponse.project.objects.characters[0],
                ...payload.changes
              }
            }),
            {
              status: 200
            }
          );
        }

        if (url.endsWith("/api/projects/graph-layout") && init?.method === "PATCH") {
          const payload = JSON.parse(String(init.body));

          return new Response(
            JSON.stringify({
              layout: payload.layout
            }),
            {
              status: 200
            }
          );
        }

        if (url.endsWith("/api/projects/track-preset") && init?.method === "PATCH") {
          const payload = JSON.parse(String(init.body));

          return new Response(
            JSON.stringify({
              preset: payload.preset
            }),
            {
              status: 200
            }
          );
        }

        return new Response("not found", {
          status: 404
        });
      })
    );
  });

  it("renders the shell with object library and knowledge view", async () => {
    render(<App />);

    expect(screen.getByText("Object Library")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Knowledge" })).toBeInTheDocument();

    await screen.findByRole("button", { name: "苏玄" });
    expect(screen.getByText("Sample Novel")).toBeInTheDocument();
  });

  it("filters the active object type list and table", async () => {
    render(<App />);

    await screen.findByRole("button", { name: "苏玄" });
    fireEvent.change(screen.getByLabelText("Filter Objects"), {
      target: {
        value: "林"
      }
    });

    await waitFor(() =>
      expect(screen.queryByRole("button", { name: "苏玄" })).not.toBeInTheDocument()
    );
    expect(screen.getByRole("button", { name: "林晚" })).toBeInTheDocument();
    expect(screen.getByLabelText("Summary")).toHaveValue("善于炼丹与情报搜集的内门弟子");
  });

  it("saves edited object fields through the inspector", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(await screen.findByRole("button", { name: "苏玄" }));
    const summary = await screen.findByLabelText("Summary");

    fireEvent.change(summary, {
      target: {
        value: "已经在前端修改"
      }
    });
    expect(screen.getByLabelText("Summary")).toHaveValue("已经在前端修改");
    await user.click(screen.getByRole("button", { name: "Save Object" }));

    await waitFor(() =>
      expect(screen.getByDisplayValue("已经在前端修改")).toBeInTheDocument()
    );
  });

  it("renders graph and tracks workspaces from the tab strip", async () => {
    const user = userEvent.setup();

    render(<App />);

    await screen.findByRole("button", { name: "苏玄" });
    await user.click(screen.getByRole("tab", { name: "Graph" }));
    expect(await screen.findByRole("region", { name: "Graph Canvas" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save Layout" })).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Tracks" }));
    expect(await screen.findByRole("region", { name: "Tracks Workspace" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save Preset" })).toBeInTheDocument();
  });

  it("renders graph nodes and supports focus-on-selection filtering", async () => {
    const user = userEvent.setup();

    render(<App />);

    await screen.findByRole("button", { name: "苏玄" });
    await user.click(screen.getByRole("tab", { name: "Graph" }));

    const graphCanvas = await screen.findByRole("region", { name: "Graph Canvas" });

    expect(within(graphCanvas).getByRole("button", { name: "离线线索" })).toBeInTheDocument();
    expect(within(graphCanvas).getByRole("button", { name: "青云宗" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Focus Selection" }));

    await waitFor(() =>
      expect(within(graphCanvas).queryByRole("button", { name: "离线线索" })).not.toBeInTheDocument()
    );
    expect(within(graphCanvas).getByRole("button", { name: "苏玄" })).toBeInTheDocument();
    expect(within(graphCanvas).getByRole("button", { name: "青云宗" })).toBeInTheDocument();
  });

  it("saves graph layout changes after dragging a node", async () => {
    const user = userEvent.setup();

    render(<App />);

    await screen.findByRole("button", { name: "苏玄" });
    await user.click(screen.getByRole("tab", { name: "Graph" }));

    const graphCanvas = await screen.findByRole("region", { name: "Graph Canvas" });
    const node = within(graphCanvas).getByRole("button", { name: "苏玄" });
    fireEvent.pointerDown(node, {
      clientX: 120,
      clientY: 80
    });
    fireEvent.pointerMove(window, {
      clientX: 180,
      clientY: 140
    });
    fireEvent.pointerUp(window, {
      clientX: 180,
      clientY: 140
    });

    await user.click(screen.getByRole("button", { name: "Save Layout" }));

    await waitFor(() =>
      expect(screen.getByText("Graph layout saved.")).toBeInTheDocument()
    );

    const graphLayoutRequest = vi
      .mocked(fetch)
      .mock.calls.find(
        ([input, init]) =>
          String(input).endsWith("/api/projects/graph-layout") &&
          init?.method === "PATCH"
      );

    expect(graphLayoutRequest).toBeDefined();

    const payload = JSON.parse(String(graphLayoutRequest?.[1]?.body)) as {
      layout: {
        positions: Record<string, { x: number; y: number }>;
      };
    };

    const suxuanPosition = payload.layout.positions.char_suxuan;

    expect(suxuanPosition).toBeDefined();

    if (!suxuanPosition) {
      throw new Error("Missing graph position for char_suxuan.");
    }

    expect(suxuanPosition.x).toBeGreaterThan(120);
    expect(suxuanPosition.y).toBeGreaterThan(80);
  });

  it("renders tracks lanes, switches grouping, and shows event cards", async () => {
    const user = userEvent.setup();

    render(<App />);

    await screen.findByRole("button", { name: "苏玄" });
    await user.click(screen.getByRole("tab", { name: "Tracks" }));

    const tracksWorkspace = await screen.findByRole("region", {
      name: "Tracks Workspace"
    });

    expect(screen.getByText("默认轨道预设")).toBeInTheDocument();

    const characterLane = within(tracksWorkspace).getByRole("region", {
      name: "Track Lane 苏玄"
    });
    expect(within(characterLane).getByText("试炼谷夺令")).toBeInTheDocument();
    expect(within(characterLane).getByText("卷一-早期")).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("Track Grouping"), "location");

    await waitFor(() =>
      expect(
        within(tracksWorkspace).getByRole("region", {
          name: "Track Lane 青云峰"
        })
      ).toBeInTheDocument()
    );

    const locationLane = within(tracksWorkspace).getByRole("region", {
      name: "Track Lane 青云峰"
    });
    expect(within(locationLane).getByText("试炼谷夺令")).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("Track Grouping"), "arc");

    await waitFor(() =>
      expect(
        within(tracksWorkspace).getByRole("region", {
          name: "Track Lane 隐火灵脉主线"
        })
      ).toBeInTheDocument()
    );
  });

  it("saves track preset changes after reordering lanes", async () => {
    const user = userEvent.setup();

    render(<App />);

    await screen.findByRole("button", { name: "苏玄" });
    await user.click(screen.getByRole("tab", { name: "Tracks" }));

    const tracksWorkspace = await screen.findByRole("region", {
      name: "Tracks Workspace"
    });

    const firstLane = within(tracksWorkspace).getByRole("region", {
      name: "Track Lane 苏玄"
    });
    await user.click(within(firstLane).getByRole("button", { name: "Move Down" }));

    expect(
      within(tracksWorkspace)
        .getAllByRole("heading", {
          level: 3
        })
        .map((heading) => heading.textContent)
    ).toEqual([
      "林晚",
      "苏玄"
    ]);

    await user.click(screen.getByRole("button", { name: "Save Preset" }));

    await waitFor(() =>
      expect(screen.getByText("Track preset saved.")).toBeInTheDocument()
    );

    const trackPresetRequest = vi
      .mocked(fetch)
      .mock.calls.find(
        ([input, init]) =>
          String(input).endsWith("/api/projects/track-preset") &&
          init?.method === "PATCH"
      );

    expect(trackPresetRequest).toBeDefined();

    const payload = JSON.parse(String(trackPresetRequest?.[1]?.body)) as {
      preset: {
        grouping: string;
        laneOrder: string[];
      };
    };

    expect(payload.preset.grouping).toBe("character");
    expect(payload.preset.laneOrder.slice(0, 2)).toEqual([
      "char_linwan",
      "char_suxuan"
    ]);
  });

  it("renders derived observation slices inside tracks and reserves chapter output", async () => {
    const user = userEvent.setup();

    render(<App />);

    await screen.findByRole("button", { name: "苏玄" });
    await user.click(screen.getByRole("tab", { name: "Tracks" }));

    const observationWorkspace = await screen.findByRole("region", {
      name: "Observation Workspace"
    });

    expect(within(observationWorkspace).getByRole("heading", { name: "卷一-早期" })).toBeInTheDocument();
    expect(within(observationWorkspace).getByText("试炼谷夺令")).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("Observation Mode"), "character");

    await waitFor(() =>
      expect(
        within(observationWorkspace).getByRole("heading", { name: "苏玄" })
      ).toBeInTheDocument()
    );

    await user.selectOptions(screen.getByLabelText("Observation Mode"), "location");

    await waitFor(() =>
      expect(
        within(observationWorkspace).getByRole("heading", { name: "青云峰" })
      ).toBeInTheDocument()
    );

    await user.selectOptions(screen.getByLabelText("Observation Mode"), "arc");

    await waitFor(() =>
      expect(
        within(observationWorkspace).getByRole("heading", { name: "隐火灵脉主线" })
      ).toBeInTheDocument()
    );

    expect(screen.getByRole("heading", { name: "Chapter Dimension" })).toBeInTheDocument();
    expect(
      screen.getByText("Reserved for future structured chapter slices.")
    ).toBeInTheDocument();
  });

  it("groups inspector fields and supports reference jumps", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(await screen.findByRole("button", { name: "苏玄" }));

    expect(screen.getByRole("heading", { name: "Core Fields" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "References" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "青云宗" }));

    await waitFor(() =>
      expect(screen.getByDisplayValue("青云宗")).toBeInTheDocument()
    );
    expect(screen.getByLabelText("Summary")).toHaveValue("北境中等宗门");
  });
});
