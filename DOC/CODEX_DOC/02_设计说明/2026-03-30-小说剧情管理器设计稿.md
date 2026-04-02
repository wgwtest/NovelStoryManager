# 小说剧情管理器设计稿

## Summary

Novel Story Manager is a Web application for managing the structured plot model of a single novel project. It is not an AI writing assistant and does not depend on chapter text to build the world model. Its core job is to maintain a file-backed project knowledge base, let the author edit model objects directly, and provide multiple derived views such as a knowledge view, relationship graph, and multi-track arrangement view.

The product is designed around three ideas:

1. The object library is the source of truth.
2. Events and relations are the dynamic backbone of the story model.
3. Chapters, timelines, and other outputs are observation dimensions derived from the model rather than the model itself.

## Product Positioning

### What this product is

This product is a structured plot modeler for a single novel project.

It exists to help an author:

1. Manage structured objects such as characters, factions, locations, items, realm systems, events, clues, and arcs.
2. Build and inspect explicit links between those objects.
3. Slice and observe the current world model from different perspectives without rewriting the underlying facts.

### What this product is not

This product does not:

1. Perform AI understanding of chapter text.
2. Require chapters to exist before modeling can begin.
3. Treat a single linear timeline as the only narrative backbone.

The intended workflow is that external agents or scripts can generate normalized data according to the project schema, and this application imports, edits, validates, visualizes, and exports that structured data.

## Scope

### In scope for the first product phase

1. Single novel project only.
2. File-backed project storage.
3. A persistent object library in the left sidebar.
4. Three loosely coupled primary views:
   1. Knowledge view
   2. Relationship graph view
   3. Track view
5. Structured editing of objects, relations, and events.
6. View-specific layouts and presets stored separately from model facts.
7. Import and export for project data files.

### Explicitly out of scope for the first product phase

1. AI parsing or extraction from text.
2. Built-in chapter text editor.
3. Multi-project world sharing.
4. Collaboration and multi-user sync.
5. Database-first storage.

## Core Modeling Principles

### Objects are primary

All durable story knowledge should first exist as structured objects instead of being trapped in free-form documents. For example, a cultivation breakthrough should resolve into a character, an event, a location, a faction context, and a state change instead of remaining only as prose.

### Relations are explicit

Links such as bloodline, mentorship, allegiance, hostility, ownership, control, and causal dependence must be represented as editable structured edges.

### State changes happen through events

Important changes such as realm advancement, item ownership transfer, loyalty shifts, location control changes, or clue revelation should be expressed through events instead of silently mutating object profiles.

### Views are derived

Relationship graphs, track layouts, future chapter slices, and various reports are all observation layers derived from model facts. They should not redefine the facts unless the user explicitly chooses to change the underlying objects or events.

## Core Domain Objects

The first stable schema should define these nine top-level object types.

### Character

Represents a person-level actor in the story.

Recommended fields:

1. `id`
2. `name`
3. `aliases`
4. `tags`
5. `summary`
6. `status`
7. `identity`
8. `factionRefs`
9. `realmState`
10. `notes`

### Faction

Represents organizations, sects, families, kingdoms, alliances, or hidden groups.

Recommended fields:

1. `id`
2. `name`
3. `aliases`
4. `type`
5. `tags`
6. `summary`
7. `parentFactionRef`
8. `goal`
9. `status`
10. `locationRefs`

### Location

Represents places and place hierarchies, from worlds down to rooms or caves.

Recommended fields:

1. `id`
2. `name`
3. `aliases`
4. `type`
5. `tags`
6. `summary`
7. `parentLocationRef`
8. `controllerRef`
9. `traits`
10. `status`

### Item

Represents items, treasures, techniques, medicines, or other possessable resources. This stays unified in the first version instead of being split into many subclasses.

Recommended fields:

1. `id`
2. `name`
3. `aliases`
4. `type`
5. `tags`
6. `summary`
7. `ownerRef`
8. `origin`
9. `status`
10. `traits`

### RealmSystem

Represents cultivation systems, power stages, or progression frameworks.

Recommended fields:

1. `id`
2. `name`
3. `type`
4. `summary`
5. `levels`
6. `rules`
7. `tags`

### Event

Represents dynamic change and progression. Event is the most important dynamic object in the system.

Recommended fields:

1. `id`
2. `name`
3. `type`
4. `summary`
5. `participantRefs`
6. `locationRefs`
7. `factionRefs`
8. `itemRefs`
9. `timeAnchor`
10. `preconditions`
11. `results`
12. `arcRefs`
13. `clueRefs`
14. `tags`

### Relation

Represents explicit edges between any two objects.

Recommended fields:

1. `id`
2. `type`
3. `sourceRef`
4. `targetRef`
5. `direction`
6. `strength`
7. `startAnchor`
8. `endAnchor`
9. `summary`
10. `tags`

### Clue

Represents foreshadowing, secrets, hidden truths, unresolved hints, or revealable information.

Recommended fields:

1. `id`
2. `name`
3. `summary`
4. `status`
5. `objectRefs`
6. `eventRefs`
7. `revealCondition`
8. `tags`

### Arc

Represents a story line, causal chain, or thematic progression.

Recommended fields:

1. `id`
2. `name`
3. `summary`
4. `status`
5. `eventRefs`
6. `objectRefs`
7. `tags`

## Why timeline is not the foundation

The system must support multiple ordering and observation logics at the same time:

1. Objective in-world time
2. Character knowledge order
3. Reader presentation order
4. Space-based parallel progression
5. Faction-based progression
6. Arc-based progression

Because these orderings can conflict, the product should not make a single timeline the primary source of truth. The source of truth should remain:

1. Objects
2. Events
3. Connections between them

The timeline or track experience is therefore a derived arrangement view over the event network.

## Information Architecture

### Left sidebar: Object library

The object library stays persistent on the left side of the application.

It serves as:

1. The global navigation area for object types
2. The universal search entry point
3. The stable access point to the project source of truth

The left sidebar should remain visible regardless of which main view is open.

### Main work area: three independent views

The main area should provide three independent but connected tabs.

#### Knowledge view

Primary purpose:

1. Field editing
2. Object details
3. Filtering
4. Batch maintenance
5. Cross-reference browsing

This is the main source-truth editing interface.

#### Relationship graph view

Primary purpose:

1. Visualize local or global object networks
2. Create and edit relations
3. Rearrange node layouts
4. Inspect connection density and missing links

This view is for structure inspection and graph editing, not for heavy field editing.

#### Track view

Primary purpose:

1. Arrange events into tracks by observation dimension
2. Compare parallel progression
3. Explore sequence and overlap
4. Save track presets for recurring analysis

This view must support multiple grouping strategies, including:

1. By location
2. By arc
3. By character perspective
4. By faction

## Track View Rules

### A track is a view container, not a domain object

Tracks should not become first-class story facts. They are containers in a view used to arrange event blocks or object references.

### Grouping is switchable

The same event set can be rendered under different track strategies without changing the underlying facts.

### Fact order and display order are separate

Dragging in track view should, by default, change arrangement in the current view rather than silently rewriting object truth. If the user explicitly chooses to update event order or time anchors, that should be a separate action with clear intent.

This separation protects the model from accidental corruption caused by exploratory rearrangement.

## Storage Model

The project should be stored as files on disk. This is a product decision, not a temporary implementation shortcut.

### Project directory

Each novel is a standalone project directory.

Recommended structure:

```text
NovelProject/
  manifest.json
  schema-version.json
  objects/
    characters.json
    factions.json
    locations.json
    items.json
    realm-systems.json
    events.json
    relations.json
    clues.json
    arcs.json
  views/
    graph-layouts.json
    track-presets.json
    saved-filters.json
  imports/
  exports/
```

### File classes

There are two different categories of persisted files.

#### Object fact files

These are the true project data files. They hold story facts and normalized model objects.

#### View state files

These hold graph layouts, track presets, filters, and other workspace state. They must remain separate from story facts.

This separation is required so that graph layouts and track arrangements do not pollute the actual knowledge model.

## Import and Export Strategy

The product must treat schema definition and data exchange as first-class capabilities.

### Internal project schema

The application maintains a stable project schema for long-term file persistence.

### Public import schema

External agents, scripts, or tools should be able to generate structured files that match the expected schema and import them into the project.

### Export forms

The first version should support:

1. Full project export
2. Object-type export

This keeps the system compatible with the user's preferred workflow: generate structured data outside the tool, then import and continue editing inside the tool.

## Technical Architecture

### Frontend

A Web single-page application handles:

1. Object library UI
2. Knowledge view
3. Relationship graph view
4. Track view
5. Project navigation
6. Import and export flows

### Local service layer

A lightweight local service handles:

1. Project open and save
2. File read and write
3. Schema validation
4. Import and export execution

Its role is infrastructure support rather than core domain ownership.

### No database in the first version

The first version should not introduce a database-first persistence model.

Reasons:

1. File-backed projects better support import and export.
2. External tools can generate files directly.
3. Local backup and version control are simpler.
4. Single-project isolation maps naturally to directories.
5. Schema migration can be handled explicitly through file versions.

If future scale requires indexing or caching, an internal acceleration layer can be added later without changing the file-based project truth model.

## Non-Goals

The following are deliberately deferred:

1. Shared world knowledge across multiple novels
2. Built-in chapter writing environment
3. Automatic extraction from prose
4. Real-time collaboration
5. Large-scale plugin ecosystem

## Risks and Constraints

### Schema sprawl

If too many top-level object types or special-case fields are introduced early, the product will become hard to maintain. The first schema should stay disciplined around the nine primary object types.

### Overloaded event model

If events absorb too many unrelated responsibilities, they become vague and unstable. Events should stay focused on dynamic change and participation.

### View-state confusion

If graph layout state or track arrangement state is written into object truth files, the data model will become noisy and harder to export reliably.

### Import fragility

If field names and schema expectations change casually, external agent-generated data will break. The first public schema must stabilize early and evolve through explicit versioning.

## Roadmap

### Milestone 1: Project foundation

Deliver:

1. Project creation and open flow
2. File-backed object library
3. Schema validation
4. Persistent left sidebar object library
5. Usable knowledge view

### Milestone 2: Relationship graph workspace

Deliver:

1. Graph rendering
2. Node and edge editing
3. Local subgraph exploration
4. Saved graph layouts
5. Navigation between object library and graph

### Milestone 3: Track view

Deliver:

1. Multi-track arrangement
2. Grouping by location, arc, perspective, or faction
3. Track presets
4. Event block drag interactions
5. Clear separation between arrangement changes and fact edits

### Milestone 4: Observation outputs

Deliver:

1. Time slice output
2. Character slice output
3. Location slice output
4. Arc slice output
5. The architectural foundation for later chapter-based observation views

## Acceptance Criteria For The Design

This design is successful if the implementation can satisfy the following:

1. A single novel project can be stored entirely as files in a project directory.
2. The object library stays persistent and authoritative across all main views.
3. Knowledge view, graph view, and track view can operate independently while writing back to the same project truth model.
4. Object facts remain separate from view state.
5. External agents can create importable structured files without relying on built-in AI features.
6. Future chapter slicing can be added as a derived observation layer without redesigning the storage model.

## Recommended Next Step

The next step is to write an implementation plan for Milestone 1 only. Milestones 2 through 4 should remain as planned future phases instead of being merged into a single oversized build.
