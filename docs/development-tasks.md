# AX-001 Development Tasks

## Current Active Implementation

As of 2026-04-15, the active product slice has moved to the agent-room runtime upgrade track.

- Task: Task 25 agent-room runtime upgrade
- Status: in progress
- Goal: preserve the current interview demo as a stable legacy deliverable while opening a new `agent-room-v2` runtime where room progression is increasingly decided by LLM agents and the room container mainly executes / guards / persists those decisions

### Current Slice

- introduce explicit room runtime modes:
  `legacy-demo-v1` for the stable course/demo fallback and `agent-room-v2` for ongoing upgrades
- make web entrypoints, room creation, room metadata, and demo-room retention runtime-mode aware
- keep the current interview demo launch path pinned to `legacy`
- add a new `next` launcher and runtime metadata so both versions can coexist during development
- land the first `room kernel` step for `agent-room-v2` as the precursor to fuller agent-led orchestration
- centralize interview room-admin control translation in `room-governance` so `chatroom-discussion.ts` becomes thin execution glue
- extend interview anomaly handling so refusal-to-answer and off-topic/non-responsive replies are recognized as room-admin incidents instead of falling through as generic turns
- document the phased upgrade plan in `docs/agent-room-upgrade-plan.md`
- start the interview-panel collaboration track so interviewer agents can leave durable hidden notes for each other instead of relying only on transient prompt glue
- persist room-scoped `interviewInternalNotes` and inject them back into interviewer / planner / room-admin / room-kernel contexts
- allow interviewer turns to emit hidden `【协作:...】` markers that are stripped from candidate-visible output and stored as internal collaboration notes
- upgrade hidden collaboration markers so interviewer turns can also emit structured tags such as `【协作|友好引导|澄清重试:...】`, with the parsed `signalTags` persisted for later planner/admin/kernel use

### Current Runtime Note

- 2026-05-16 Tauri desktop application migration completed:
  - Visual Studio Enterprise 18 with MSVC 14.51.36231 configured
  - Rust 1.95.0 (MSVC toolchain) installed and working
  - Complete Rust backend implementation with SQLite via SQLx
  - All models implement `sqlx::FromRow` trait for database queries
  - API handlers for room CRUD and message operations
  - Frontend API adapter for seamless Tauri/HTTP environment detection
  - Application compiles and runs successfully (ax001-desktop.exe, 17MB)
  - Database initializes correctly under `%APPDATA%/com.ax001.desktop/`
  - Documentation: `docs/tauri-architecture-plan.md`, `docs/tauri-environment-fix-summary.md`
  - Status: 95% complete, missing runtime control APIs (toggle_queue, stop_run, resume_checkpoint)
- 2026-05-11 frontend base platform integration completed:
  - `web/chatroom/base/base-styles.css`: complete base CSS with variables, app shell, panels, components
  - `web/chatroom/base/base-app.js`: frontend base core class with plugin registration
  - `web/chatroom/base/plugin-interface.js`: RoomPlugin interface definition
  - `web/chatroom/plugins/interview/interview-plugin.js`: interview room plugin with phase tracking
  - `web/chatroom/plugins/roleplay/roleplay-plugin.js`: roleplay room plugin with character management
  - `web/chatroom/plugins/interview/interview-styles.css`: interview-specific styles
  - `web/chatroom/plugins/roleplay/roleplay-styles.css`: roleplay-specific styles
  - `web/chatroom/main.js`: main entry point that registers plugins and initializes BaseApp
  - `web/chatroom/main.html`: new frontend base platform HTML
  - Electron shell updated to use `main.html` for room mode
- 2026-04-28 room-platform boundary correction is underway: generic scenario templates,
  scenario planning, scenario artifacts, and speaker playbooks now live under
  `src/room-scenarios`; platform-admin room planning now lives under `src/room-app`;
  old `src/workflows/room-*` paths remain compatibility re-exports.
- 2026-04-28 room blueprint creation/parsing/cloning and governance defaults now live
  under `src/room-scenarios/room-blueprints.ts`; `src/workflows/room-blueprints.ts`
  remains a compatibility re-export.
- 2026-04-28 room-admin facade moved to `src/room-governance/room-admin.ts`;
  `src/workflows/chatroom-room-admin.ts` remains a compatibility re-export.
- 2026-04-28 host moderation moved to `src/room-governance/room-host.ts`;
  `src/workflows/chatroom-host.ts` remains a compatibility re-export.
- 2026-04-28 recorder checkpoint execution and restore logic moved to
  `src/room-governance/room-recorder.ts`; `src/workflows/chatroom-recorder.ts`
  remains a compatibility re-export.
- 2026-04-28 canonical room execution entrypoints have been introduced:
  `src/room-runtime/room-runner.ts` exposes the runtime-facing runner facade and
  `src/room-app/room-runtime-service.ts` exposes the app-facing service facade.
  Web and CLI execution now call through `room-app`, while regression/support
  scripts call through `room-runtime`.
- 2026-04-28 Web and CLI storage-facing room operations now enter through
  `src/room-app/room-service.ts` instead of importing `room-storage` repositories
  directly, creating a safer app boundary for later room create/list/recovery services.
- 2026-04-28 runner infrastructure extraction continued: room lease renewal lives in
  `src/room-runtime/room-lease.ts`, workflow observer/captured-run helpers live in
  `src/room-runtime/runtime-support.ts`, and checkpoint metadata parsing/building
  lives in `src/room-runtime/checkpoint-metadata.ts`.
- 2026-04-28 murder mystery is now exposed as an active basic scenario template using
  the roleplay runtime plus proactive room-admin clue/event/phase governance.
- 2026-04-28 tavern roleplay demo is now exposed as the first custom roleplay
  sub-room scenario (`tavern_roleplay_demo`). Role cards use stable `characterId`
  values that bind to stable speaker ids and room-local agent-thread memory, so
  memory belongs to the room participant rather than the provider/model instance.
- 2026-04-28 the roleplay room follow-up plan now lives in
  `docs/roleplay-room-development-plan.md`: tavern demo is the small demo-ready
  slice, and the later custom roleplay room will expand role cards, creation
  services, and desktop/API editing after the architecture contract stays stable.
- 2026-04-28 custom roleplay role cards now support richer local-memory seed fields:
  stable `characterId`, `publicDescription`, `privateNotes`, `relationships`, and
  `initialGoal`. These fields feed independent roleplay agent profiles and
  roleplay scene state, while the room participant/thread remains the memory owner.
- 2026-04-28 custom roleplay room planning now has an app-service boundary:
  `src/room-app/roleplay-room-service.ts` exposes `planCustomRoleplayRoom()` so
  future desktop/API/CLI flows can create roleplay rooms through `room-app` instead of
  hand-building scenario blueprints.
- 2026-04-28 desktop-hosted room creation and the underlying API can now create a
  custom roleplay room through `POST /api/rooms` with `mode: "custom_roleplay"` /
  `mode: "roleplay"`, role cards, and scene metadata; the handler uses the
  `room-app` roleplay planning service and immediately starts the first execution
  run.
- 2026-04-28 frontend direction has been consolidated: Electron desktop shell is now
  the only supported interactive frontend. `npm run app:room` opens the room
  workspace on `agent-room-v2`, `npm run app:interview` preserves the legacy
  interview fallback, and TUI/browser-opened interaction is deprecated in
  `docs/desktop-frontend-policy.md`.
- 2026-04-28 room-admin participant additions moved out of `chatroom-discussion.ts`
  into `src/room-runtime/participant-additions.ts`, with regression coverage for
  project discussion and murder mystery additions.
- 2026-04-27 room-storage repository boundaries are now the real persistence entry points: `chatroom-db.ts` has been reduced to a compatibility re-export barrel, the SQLite singleton lives in `room-storage/database-instance.ts`, and storage record contracts live in `room-storage/chatroom-storage-types.ts`.
- 2026-04-16 the interview-panel collaboration base slice is in progress: panel discussion, handoff, and interviewer-authored hidden collaboration notes are being upgraded from transient prompt context into durable room-state memory.
- 2026-04-16 the intended responsibility split remains unchanged: interviewer agents own interview reasoning, while room-admin / room-kernel stay focused on governance, escalation, and control.
- 2026-04-17 room-admin prompts and fallback controls now explicitly consume recent `interviewInternalNotes`, including supportive-tone hints, retry/hold/close hints, and recent handoff context instead of relying only on raw transcript anomalies.
- 2026-04-17 room-kernel prompts and fallback analysis now explicitly surface recent interviewer collaboration notes, so kernel-to-admin escalation can reflect panel guidance such as "guide the candidate more gently" or "this thread is no longer producing new evidence".
- 2026-04-17 interviewer speaker prompts and planner prompts/fallback now also consume collaboration summaries, so the active interviewer can ask more guided, smaller-scope follow-up questions for nervous/junior candidates instead of leaving all adaptation to admin/kernel after the fact.
- 2026-04-17 hidden interviewer collaboration markers now support tagged forms like `【协作|友好引导|澄清重试:...】`; note persistence keeps `signalTags`, and room-admin summary logic can consume those tags even when the free-text note itself is vague.
- 2026-04-15 the current interview demo is now being preserved as an explicit legacy desktop runtime instead of being silently coupled to ongoing architecture refactors.
- 2026-04-15 demo-room pruning must now stay scoped to runtime mode so new `agent-room-v2` rooms do not delete the stable fallback demo rooms.
- 2026-04-15 the first `room kernel` slice is intended to be additive and non-destructive: it observes and records structured room-level judgments before those judgments begin to directly drive runtime control.
- 2026-04-15 interview retry / hold / terminate directive translation is now being pulled into `room-admin`, reducing workflow-owned semantics in the `agent-room-v2` path.
- 2026-04-15 refusal-to-answer plus off-topic/non-responsive candidate turns now enter the same room-admin incident path as repeated answers and pauses, and next-runtime room-kernel escalation also recognizes those pending-thread anomalies.
- 2026-04-15 room-admin prompt text and incident snapshots now explicitly surface refusal / non-responsive counts and active-question context, so the next-runtime governance agent receives clearer room-level evidence instead of only generic wait/retry wording.
- 2026-04-15 interview `set_phase` in `agent-room-v2` is now becoming an executable room-admin primitive: the directive can actively hand off to another interviewer, skip forward, or enter wrap-up instead of acting as passive phase metadata only.
- 2026-04-15 interview `complete_interview` now carries richer terminal semantics in the upgrade track: room-admin can mark a clean finish versus an aborted stop, and aborted terminal status is now persisted in room state/storage instead of being flattened into a generic normal completion.
- 2026-04-13 after rotating to a supported service key, fresh interview-room creation works again.
- 2026-04-13 the opening-turn gap is fixed: a fresh interview room now posts the first HR question deterministically instead of letting the planner drift into `wait`, and the persisted room state keeps `interviewCurrentPhase` plus `interviewPendingCandidateReply`.
- 2026-04-13 a full demo interview can now run to terminal state without being blocked by a hanging recorder step; summary/checkpoint generation is fail-open, and the fallback final report now derives heuristic scoring, strengths/weaknesses, competency scores, question log, and next-step guidance from the transcript when the structured recorder times out.
- 2026-04-13 regression coverage now explicitly protects recorder-checkpoint timeout fail-open behavior plus final-summary timeout fallback output for interview `scenario-report` artifacts; keep watching live provider-backed report quality, but the main room-completion path is no longer blocked on recorder latency.
- Provider-specific error diagnostics should be abstracted into a pluggable adapter layer.

### Previous Slice

- Task 24 interview controller productization is now treated as completed for this document.
- The extracted controller helpers remain the stable base for the new runtime split rather than the active top-level backlog item.

## Active Follow-Up Track

As of 2026-04-13, the room-core roadmap remains complete, but a focused follow-up track is now active for interview-room control semantics.

- Follow-up track: interview control semantics hardening
- Status: completed
- Goal: close realistic interview interruption / weak-answer / wrap-up handling gaps without reopening the room-core roadmap

### Delivered In The Current Follow-Up Batch

- explicit candidate withdraw / end-interview intent handling in the interview controller
- weak-answer recognition for short replies such as "I don't know" / "没做过"
- wrap-up acceptance for "no more questions" style candidate replies
- explicit pending-reply state for strict one-question-at-a-time interview flow control
- targeted regression coverage for the new interview control branches

### Follow-Up Scope

1. Candidate control intents

- Add explicit handling for "end interview / withdraw / stop here" style candidate turns.
- Keep room shutdown decisions in workflow state control, not free-form speaker output.

2. Weak-answer semantics

- Treat short but valid replies such as "I don't know", "I haven't done that", and "not sure" as real candidate turns.
- Route them into follow-up logic instead of dropping them as `other`.

3. Wrap-up semantics

- Accept "no more questions" style candidate replies during HR wrap-up as a valid close-out branch.

4. Pending-question state

- Replace or reduce prompt-wording heuristics for "waiting for candidate reply" with explicit state in a later batch.

## Current Status

As of 2026-04-13, the room-centric core roadmap tracked by this document is complete.

- Current refactor execution track: completed
- Phase 1-6: completed
- No active implementation item remains in this roadmap

This file is now a clean status record for the completed room-core track, not an active backlog.

## Product Posture

AX-001 is a room-centric multi-agent interaction platform.

Canonical product model:

- `Room` = durable workspace
- `Main Session` = room's durable shared public conversation
- `Execution Run` = one bounded advancement of that room
- `Agent Thread` = one agent's durable private continuity inside the room
- `Workflow` = the execution engine that advances room state

Canonical architecture reference:

- `docs/room-core-architecture.md`

## What Is Already In Place

The current codebase already provides:

- room-scoped persistence
- durable main-session reconstruction
- execution-run based workflow advancement
- room participants and agent threads
- private agent memory continuity
- live desktop room observation through the local host/API
- scenario planning and room blueprint generation
- governance roles (`room admin`, `host`, `recorder`)
- checkpoint / resume support

## Historical Gaps Now Closed

The following gaps were the reason this roadmap existed. They are now considered closed for this track.

### 1. Main Session Explicitness

Resolved outcome:

- one authoritative main session per room
- execution runs advance that same public lane
- persisted messages and artifacts are linked back to the room/main-session model

### 2. Execution Semantics And Terminology

Resolved outcome:

- operational "runs" use execution-run wording
- repository terminology now aligns with the canonical room model
- audit surfaces distinguish room, main session, execution run, and agent thread

### 3. Agent Thread Continuity

Resolved outcome:

- durable per-agent thread memory
- read cursor support
- scratch memory + compressed long-term memory separation
- deterministic memory refresh boundaries

### 4. Governance Roles As Core Objects

Resolved outcome:

- governance roles have durable participant/thread identity
- allowed actions are config-gated
- directives are replayable and auditable

### 5. Scenario Control Plane

Resolved outcome:

- conversational planning flow exists
- room blueprints can be created from user intent
- room cloning / relaunch is supported
- controlled post-create mutation exists

## Completed Roadmap

### Current Refactor Execution Track - COMPLETED

Delivered results:

- shared room-create planning across the desktop host/API and CLI automation paths
- desktop workspace composition cleanup so `web/chatroom/app.js` is thin orchestration glue
- extraction of runtime sync, actions, layout, UI helpers, and fetch/sync helpers into focused modules
- authoritative main-session reconstruction across runtime/storage
- execution-run terminology cleanup across persistence and observability

### Phase 1. Formalize `Room > Main Session > Execution Run` - COMPLETED

Delivered:

- one authoritative main session per room
- multiple execution runs can advance the same room
- retries/checkpoints stay bound to execution runs

### Phase 2. Strengthen Agent Thread Memory - COMPLETED

Delivered:

- per-agent read cursors
- scratch memory
- compressed long-term memory
- standardized private-memory injection

### Phase 3. Promote Governance Roles To Room-Core Concepts - COMPLETED

Delivered:

- durable governance participants
- explicit allowed actions
- auditable governance-triggered mutations

### Phase 4. Build The Room Control Plane - COMPLETED

Delivered:

- platform-admin conversational planning
- room blueprint generation
- room cloning and relaunch from stored blueprints

### Phase 5. Make Interview Simulation Production-Ready - COMPLETED

Delivered:

- stronger multi-round interviewer continuity
- recorder outputs suitable for demo/review
- structured `InterviewQuestionLog`
- structured `InterviewFeedbackItem`

### Phase 6. Expand Scenario Products On The Same Core - COMPLETED

Delivered:

- `project_discussion`
- `report_seminar`
- shared room core reused through templates, blueprints, governance, and workflow policy

## Follow-Up Rule

This roadmap should not be reopened for small maintenance work.

If new product goals appear, create one of the following:

- a new roadmap document for the next product phase
- a dedicated refactor plan for a new architecture track
- a separate fix plan for a new defect batch

## Terminology Rules Going Forward

Keep the following terminology stable in code and docs:

- `Room` = durable workspace
- `Main Session` = room's continuous shared public conversation
- `Execution Run` = bounded operational advancement of a room
- `Agent Thread` = one agent's durable private continuity inside a room
- `Workflow` = execution engine that advances room state

Avoid collapsing these concepts back into one overloaded term.
