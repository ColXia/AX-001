# Roleplay Room Development Plan

## Purpose

This document tracks the roleplay-room product slice after the room architecture
work returned to the generic `Room` container model.

The immediate delivery goal is a small, usable tavern demo. The larger goal is a
custom roleplay room where users can define role cards, assign independent agents,
and let those agents interact through the same room container, main session,
execution runs, and durable agent-thread memory used by the rest of AX-001.

## Design Decision: Role Memory Ownership

Role memory is owned by the room participant / agent thread, not by the model
provider instance.

Practical meaning:

- `characterId` is the stable identity of a role card.
- `characterId` resolves to a stable speaker id such as `custom-rp-tavern-keeper`.
- The stable speaker id binds to the participant slot and agent thread inside the room.
- The LLM model is the actor used to produce a turn, but it is not the memory owner.
- A role card can be reassigned to a different provider/model later without losing
  local room memory as long as its room participant/thread identity is preserved.

This keeps the architecture aligned with the core AX-001 rule:

`Room` is the durable container; agents/roles are participants inside it.

## Phase 1: Tavern Roleplay Demo

Status: implemented as the first custom roleplay sub-room scenario.

Scenario id:

- `tavern_roleplay_demo`

Runtime base:

- `roleplay_scene`

Default role cards:

- `tavern-keeper`
- `tavern-mercenary`
- `tavern-minstrel`
- `tavern-mage`

What this phase provides:

- a ready-to-run tavern scenario template
- stable role-card speaker ids generated from `characterId`
- a scene host plus independent NPC agent participants
- roleplay-specific governance defaults
- roleplay recap artifact routing
- speaker playbook guidance that keeps NPCs in character
- scenario planner support for tavern / inn / adventure intent
- CLI support for launching the scenario directly

Run command:

```powershell
npm run demo:tavern
```

Equivalent explicit command:

```powershell
npm run workflow:chatroom -- --scenario-template "tavern_roleplay_demo" --rounds "1"
```

Optional custom role-card shorthand:

```powershell
npm run workflow:chatroom -- --room-type "roleplay_scene" --characters "guard=Captain Rook:keeps order and distrusts strangers|healer=Iven:gentle healer with secret local knowledge" --topic "Village Inn" --objective "Let the user enter the inn and interact naturally." --rounds "1"
```

## Phase 1 Acceptance

The tavern demo is considered acceptable when:

- the scenario appears in the active template list
- the scenario can create a room without requiring manual `topic/objective`
- default tavern roles use stable `custom-rp-*` speaker ids
- roleplay scene state can rebuild from transcript history
- the first implementation does not couple roleplay behavior back into interview-only code
- full TypeScript checks and unit tests pass

## Phase 2: Full Custom Roleplay Room

Goal:

Allow a user to create a custom roleplay room from role cards, scene settings, and
optional governance rules, without hardcoding the content into a single demo.

Planned role-card schema:

```ts
interface RoleplayCharacterCard {
  characterId?: string;
  name: string;
  instruction: string;
  publicDescription?: string;
  privateNotes?: string;
  relationships?: Array<{
    targetCharacterId: string;
    summary: string;
  // Provider-specific function removed>;
  initialGoal?: string;
// Provider-specific function removed
```

Status update as of 2026-04-28:

- base schema fields are implemented in `RoleplayCharacterCard`
- duplicate explicit `characterId` values are normalized so two roles do not share
  the same room-local agent-thread memory
- role-card `publicDescription`, `privateNotes`, `relationships`, and `initialGoal`
  are injected into custom roleplay speaker profiles and roleplay scene templates
- platform-admin planning and stored artifact schemas accept the richer role-card
  fields
- CLI / scenario JSON paths can preserve richer role-card fields when supplied as JSON
- `src/room-app/roleplay-room-service.ts` now provides `planCustomRoleplayRoom()`
  as the app-service planning boundary for future desktop/API/CLI custom roleplay
  creation
- Desktop-hosted room creation and the underlying API now accept
  `mode: "custom_roleplay"` or `mode: "roleplay"` through `POST /api/rooms`,
  then plan and start the room through the same app-service boundary
- The supported interactive entry is the Electron desktop workspace, not a separate
  browser UI. Run `npm run app:room`, open the create dialog, choose the roleplay
  tab, and edit the role-card JSON there.

Planned capabilities:

- create room from a set of role cards
- edit role cards before room creation
- preserve stable role identity by `characterId`
- assign an agent/model binding per role later without changing room memory ownership
- support user-as-character and user-as-observer modes
- show cast, scene state, and recent internal role memory in a room-safe way
- add/import role cards through the desktop workspace and API first; keep CLI for
  scripted automation, not as the primary interactive frontend

## Phase 2 Development Tasks

1. Extend the role-card schema beyond `name/instruction`. Done for the base fields:
   `characterId`, `publicDescription`, `privateNotes`, `relationships`, and
   `initialGoal`.
2. Add scenario planning input for generic custom roleplay rooms.
3. Add validation for duplicate/invalid `characterId` values. Base normalization is
   implemented; UI/API should still surface a user-facing warning later.
4. Add room-blueprint metadata for roleplay scene setting, user mode, and scene tone.
5. Add app-service creation helpers so desktop/API/CLI callers do not construct
   custom roleplay rooms directly.
   Base planning helper is implemented; persistence/run wiring can be layered onto
   this service next.
6. Add persistence tests for character identity, participant identity, and agent-thread continuity.
7. Add desktop/API creation flow after the service contract is stable.

Base desktop/API creation is implemented through the room workspace and
`POST /api/rooms`.

Example payload:

```json
{
  "mode": "custom_roleplay",
  "title": "Roadside Inn",
  "topic": "A stormy night at the border-town inn",
  "scene": {
    "setting": "A border-town inn during a thunderstorm.",
    "openingSituation": "A traveler enters while two locals argue about a missing courier.",
    "atmosphere": "warm, suspicious, tense",
    "userMode": "actor"
  // Provider-specific function removed,
  "customCharacters": [
    {
      "characterId": "innkeeper",
      "name": "Mara",
      "instruction": "Runs the inn and remembers every rumor.",
      "publicDescription": "Warm tavern keeper with guarded eyes.",
      "privateNotes": [
        "Knows the missing courier passed before midnight."
      ],
      "initialGoal": "Find out whether the traveler saw the courier."
    // Provider-specific function removed,
    {
      "characterId": "guard",
      "name": "Rook",
      "instruction": "Keeps order and distrusts strangers.",
      "relationships": [
        {
          "targetCharacterId": "innkeeper",
          "summary": "Trusts Mara but worries she hides too much.",
          "score": 1
        // Provider-specific function removed
      ]
    // Provider-specific function removed
  ]
// Provider-specific function removed
```

## Non-Goals For The Tavern Slice

The tavern demo is intentionally small. It does not yet need:

- nested room containers
- a complete visual role-card editor
- cross-room long-term character memory
- user account scoped character libraries
- advanced game-master rule systems

Those belong to later custom roleplay product work.
