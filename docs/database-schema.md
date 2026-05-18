# Database Schema

> Persistence layer: `src/room-storage/*`
> Compatibility entry: `src/workflows/chatroom-db.ts`
> Database file: `data/chatroom.sqlite`
> Driver: `node:sqlite` (`DatabaseSync`)

## Overview

AX-001 uses a single SQLite database to persist all room-centric data. The schema follows the canonical architecture defined in `docs/room-core-architecture.md`:

- **Room** is the top-level ownership boundary
- **Main Session** is the durable shared conversation per room
- **Execution Run** is one bounded operational advancement
- **Agent Thread** is per-agent persistent private state
- **Message** belongs to both a room and a main session

All tables use `STRICT` mode. JSON columns store serialized objects (not validated at the SQLite level; validation happens in the TypeScript layer via Zod).

## Entity-Relationship Diagram

```
chatroom_rooms (1)
  ├── (1) chatroom_main_sessions
  ├── (N) chatroom_execution_runs
  ├── (N) chatroom_participants
  │     └── (1) chatroom_agent_threads
  ├── (N) chatroom_messages
  ├── (N) chatroom_agent_turns
  ├── (N) chatroom_pending_messages
  └── (1) chatroom_room_leases
```

## Tables

### `chatroom_rooms`

The durable workspace record. Top-level ownership boundary for all room data.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `room_id` | TEXT | NO (PK) | UUID primary key |
| `main_session_id` | TEXT | YES | FK to `chatroom_main_sessions.main_session_id` |
| `room_type` | TEXT | NO | Room type identifier: `expert_discussion`, `roleplay_scene`, `interview_simulation` |
| `topic` | TEXT | NO | Room topic/title |
| `objective` | TEXT | NO | Room objective |
| `constraints_json` | TEXT | NO | JSON array of constraint strings |
| `speaker_ids_json` | TEXT | NO | JSON array of speaker ID strings |
| `room_blueprint_json` | TEXT | YES | Serialized `ChatroomRoomBlueprint` object |
| `room_state_json` | TEXT | YES | Serialized room runtime state snapshot |
| `created_at` | TEXT | NO | ISO 8601 timestamp |
| `updated_at` | TEXT | NO | ISO 8601 timestamp |
| `last_execution_run_id` | TEXT | YES | FK to `chatroom_execution_runs.execution_run_id` |
| `last_summary_json` | TEXT | YES | Serialized `ChatroomFinalSummary` |

**Migration notes:** `speaker_ids_json`, `room_type`, `room_blueprint_json`, `room_state_json`, `main_session_id`, `last_execution_run_id` were added via `ALTER TABLE` migrations. Older rooms may have `NULL` for these columns.

---

### `chatroom_main_sessions`

The persistent shared public conversation per room. One-to-one with `chatroom_rooms`.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `main_session_id` | TEXT | NO (PK) | UUID primary key |
| `room_id` | TEXT | NO (UNIQUE) | FK to `chatroom_rooms.room_id`, ON DELETE CASCADE |
| `started_at` | TEXT | NO | ISO 8601 timestamp |
| `updated_at` | TEXT | NO | ISO 8601 timestamp |
| `last_execution_run_id` | TEXT | YES | FK to `chatroom_execution_runs.execution_run_id` |
| `message_count` | INTEGER | NO | Total message count in this session |
| `summary_json` | TEXT | YES | Serialized `ChatroomFinalSummary` |

**Index:** `idx_chatroom_main_sessions_room_updated` on `(room_id, updated_at DESC)`

---

### `chatroom_execution_runs`

Bounded operational records that advance a room. Multiple runs can advance the same main session.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `execution_run_id` | TEXT | NO (PK) | UUID primary key |
| `room_id` | TEXT | NO | FK to `chatroom_rooms.room_id`, ON DELETE CASCADE |
| `main_session_id` | TEXT | YES | FK to `chatroom_main_sessions.main_session_id` |
| `status` | TEXT | NO | `completed`, `failed`, or `cancelled` (CHECK constraint) |
| `resumed_from_run_id` | TEXT | YES | FK to self; set when this run is a checkpoint resume |
| `started_at` | TEXT | NO | ISO 8601 timestamp |
| `ended_at` | TEXT | NO | ISO 8601 timestamp |
| `rounds` | INTEGER | NO | Number of chat rounds in this run |
| `base_message_count` | INTEGER | NO | Messages in the room before this run started |
| `new_message_count` | INTEGER | NO | Messages added by this run |
| `human_author_name` | TEXT | YES | Author label of the human message that triggered this run |
| `human_message` | TEXT | YES | Human message content that triggered this run |
| `artifact_directory` | TEXT | YES | Path to `runs/chatroom/<run-id>/` artifact directory |
| `summary_json` | TEXT | YES | Serialized run summary |
| `error_text` | TEXT | YES | Error details if `status = 'failed'` |

**Indexes:**
- `idx_chatroom_execution_runs_room_started` on `(room_id, started_at DESC)`
- `idx_chatroom_execution_runs_main_session_started` on `(main_session_id, started_at DESC)`

**Self-reference:** `resumed_from_run_id` creates a chain: a resumed run points back to the failed run it recovered from.

---

### `chatroom_participants`

Visible actors inside a room. Includes agents, humans, system participants, and summary roles.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `participant_id` | TEXT | NO (PK) | UUID primary key |
| `room_id` | TEXT | NO | FK to `chatroom_rooms.room_id`, ON DELETE CASCADE |
| `participant_type` | TEXT | NO | `agent`, `human`, `system`, or `summary` (CHECK constraint) |
| `stable_key` | TEXT | NO | Stable identifier within the room (e.g., speaker ID, `human`, `system`) |
| `profile_id` | TEXT | YES | Agent profile ID (for agent participants) |
| `display_name` | TEXT | NO | Human-readable name shown in UI |
| `role_label` | TEXT | YES | Role label (e.g., `HR Interviewer`, `Technical Lead`) |
| `identity_snapshot_json` | TEXT | YES | Serialized identity snapshot at join time |
| `state_json` | TEXT | YES | Serialized participant-specific state |
| `joined_at` | TEXT | NO | ISO 8601 timestamp |
| `updated_at` | TEXT | NO | ISO 8601 timestamp |
| `archived_at` | TEXT | YES | ISO 8601 timestamp when archived |

**Unique constraint:** `(room_id, stable_key)` — one stable key per room.

**Index:** `idx_chatroom_participants_room_joined` on `(room_id, joined_at ASC)`

---

### `chatroom_agent_threads`

Per-agent durable private continuity inside a room. One-to-one with `chatroom_participants` (for agent-type participants).

| Column | Type | Nullable | Description |
|---|---|---|---|
| `agent_thread_id` | TEXT | NO (PK) | UUID primary key |
| `room_id` | TEXT | NO | FK to `chatroom_rooms.room_id`, ON DELETE CASCADE |
| `participant_id` | TEXT | NO | FK to `chatroom_participants.participant_id`, ON DELETE CASCADE |
| `status` | TEXT | NO | `active`, `paused`, or `errored` (CHECK constraint) |
| `provider_refs_json` | TEXT | YES | Serialized provider/model binding metadata |
| `memory_state_json` | TEXT | YES | Serialized `ChatroomAgentThreadMemoryState` (short-term working memory) |
| `summary_state_json` | TEXT | YES | Serialized `ChatroomAgentThreadSummaryState` (compressed long-term memory) |
| `last_message_sequence_no` | INTEGER | YES | Read cursor: last message sequence number this agent has processed |
| `last_execution_run_id` | TEXT | YES | FK to `chatroom_execution_runs.execution_run_id`, ON DELETE SET NULL |
| `version` | INTEGER | NO | Optimistic concurrency version counter |
| `updated_at` | TEXT | NO | ISO 8601 timestamp |

**Unique constraint:** `(room_id, participant_id)` — one thread per agent per room.

**Index:** `idx_chatroom_agent_threads_room_updated` on `(room_id, updated_at DESC)`

---

### `chatroom_agent_turns`

Individual agent turn records within an execution run. Provides detailed telemetry and audit trail.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `agent_turn_id` | TEXT | NO (PK) | UUID primary key |
| `room_id` | TEXT | NO | FK to `chatroom_rooms.room_id`, ON DELETE CASCADE |
| `execution_run_id` | TEXT | NO | FK to `chatroom_execution_runs.execution_run_id`, ON DELETE CASCADE |
| `participant_id` | TEXT | NO | FK to `chatroom_participants.participant_id`, ON DELETE CASCADE |
| `agent_thread_id` | TEXT | NO | FK to `chatroom_agent_threads.agent_thread_id`, ON DELETE CASCADE |
| `message_id` | TEXT | YES | FK to `chatroom_messages.message_id`, ON DELETE SET NULL |
| `message_sequence_no` | INTEGER | YES | Sequence number of the produced message |
| `step_id` | TEXT | NO | Workflow step identifier |
| `step_kind` | TEXT | NO | `agent`, `parallel`, or `custom` (CHECK constraint) |
| `branch_id` | TEXT | YES | Branch identifier within a parallel step |
| `profile_id` | TEXT | NO | Agent profile ID used for this turn |
| `round` | INTEGER | YES | Chat round number |
| `status` | TEXT | NO | `completed`, `failed`, or `cancelled` (CHECK constraint) |
| `started_at` | TEXT | NO | ISO 8601 timestamp |
| `ended_at` | TEXT | NO | ISO 8601 timestamp |
| `input_preview` | TEXT | YES | Truncated preview of the input prompt |
| `output_text` | TEXT | YES | Agent's text output |
| `output_json` | TEXT | YES | Agent's structured output (if applicable) |
| `usage_json` | TEXT | YES | Token usage statistics |
| `telemetry_json` | TEXT | YES | Serialized `AgentRunTelemetry` (retry count, repair path, etc.) |
| `error_text` | TEXT | YES | Error details if `status = 'failed'` |

**Unique constraint:** `(execution_run_id, step_id, profile_id)` — one turn per step per profile per run.

**Indexes:**
- `idx_chatroom_agent_turns_room_started` on `(room_id, started_at DESC)`
- `idx_chatroom_agent_turns_thread_started` on `(agent_thread_id, started_at DESC)`

---

### `chatroom_messages`

All messages in the room's shared conversation. Messages belong to both a room and a main session.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `message_id` | TEXT | NO (PK) | UUID primary key |
| `room_id` | TEXT | NO | FK to `chatroom_rooms.room_id`, ON DELETE CASCADE |
| `main_session_id` | TEXT | YES | FK to `chatroom_main_sessions.main_session_id` |
| `execution_run_id` | TEXT | NO | FK to `chatroom_execution_runs.execution_run_id`, ON DELETE CASCADE |
| `participant_id` | TEXT | YES | FK to `chatroom_participants.participant_id`, ON DELETE SET NULL |
| `agent_thread_id` | TEXT | YES | FK to `chatroom_agent_threads.agent_thread_id`, ON DELETE SET NULL |
| `sequence_no` | INTEGER | NO | Monotonic sequence number within the room |
| `round` | INTEGER | NO | Chat round number |
| `role` | TEXT | NO | `system`, `user`, `agent`, or `summary` (CHECK constraint) |
| `author_id` | TEXT | NO | Stable author identifier (speaker ID, `human`, etc.) |
| `author_name` | TEXT | NO | Human-readable author name |
| `created_at` | TEXT | NO | ISO 8601 timestamp |
| `content` | TEXT | NO | Message content text |

**Unique constraint:** `(room_id, sequence_no)` — strictly monotonic per room.

**Indexes:**
- `idx_chatroom_messages_room_sequence` on `(room_id, sequence_no)`
- `idx_chatroom_messages_main_session_sequence` on `(main_session_id, sequence_no)`

---

### `chatroom_pending_messages`

Human messages waiting to be processed. Acts as a queue between user input and execution runs.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `pending_message_id` | TEXT | NO (PK) | UUID primary key |
| `room_id` | TEXT | NO | FK to `chatroom_rooms.room_id`, ON DELETE CASCADE |
| `author_name` | TEXT | NO | Human-readable author name |
| `content` | TEXT | NO | Message content |
| `status` | TEXT | NO | `pending`, `processing`, `completed`, or `failed` (CHECK constraint) |
| `created_at` | TEXT | NO | ISO 8601 timestamp |
| `claimed_at` | TEXT | YES | When the message was claimed for processing |
| `processed_execution_run_id` | TEXT | YES | FK to `chatroom_execution_runs.execution_run_id`, ON DELETE SET NULL |
| `error_text` | TEXT | YES | Error details if `status = 'failed'` |

**Index:** `idx_chatroom_pending_room_status_created` on `(room_id, status, created_at)`

**Lifecycle:** `pending` → `processing` → `completed` / `failed`. The Web server's queue pump (`pumpQueues`) claims pending messages and triggers execution runs.

---

### `chatroom_room_leases`

Mutex mechanism to prevent concurrent execution runs on the same room.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `room_id` | TEXT | NO (PK) | FK to `chatroom_rooms.room_id`, ON DELETE CASCADE |
| `lease_token` | TEXT | NO | Unique token identifying the current lease holder |
| `holder_label` | TEXT | YES | Human-readable label for the lease holder |
| `acquired_at` | TEXT | NO | ISO 8601 timestamp when lease was acquired |
| `expires_at` | TEXT | NO | ISO 8601 timestamp when lease expires |

**Usage:** Before starting an execution run, the system acquires a lease. If a lease already exists and has not expired, a `ChatroomRoomBusyError` is thrown. Leases are released when the run completes or fails.

## Cascade Delete Behavior

When a room is deleted via `deleteChatroomRoom()`:

1. `chatroom_room_leases` — deleted (CASCADE)
2. `chatroom_pending_messages` — deleted (CASCADE)
3. `chatroom_agent_turns` — deleted (CASCADE)
4. `chatroom_messages` — deleted (CASCADE)
5. `chatroom_agent_threads` — deleted (CASCADE)
6. `chatroom_participants` — deleted (CASCADE)
7. `chatroom_main_sessions` — deleted (CASCADE)
8. `chatroom_execution_runs` — deleted (CASCADE)
9. `chatroom_rooms` — deleted
10. Live snapshot file `data/chatroom-live/<room-id>.json` — removed
11. Artifact directories `runs/chatroom/<run-id>/` — removed (if inside workspace)

## Key TypeScript Interfaces

The TypeScript interfaces in `src/room-storage/chatroom-storage-types.ts` provide the
typed view of these tables. `src/workflows/chatroom-db.ts` re-exports them for older
imports.

| Interface | Table |
|---|---|
| `ChatroomRoomRecord` | `chatroom_rooms` |
| `ChatroomMainSessionRecord` | `chatroom_main_sessions` |
| `ChatroomExecutionRunRecord` | `chatroom_execution_runs` |
| `ChatroomParticipantRecord` | `chatroom_participants` |
| `ChatroomAgentThreadRecord` | `chatroom_agent_threads` |
| `ChatroomAgentTurnRecord` | `chatroom_agent_turns` |
| `ChatroomPendingMessageRecord` | `chatroom_pending_messages` |
| `ChatroomRoomLeaseRecord` | `chatroom_room_leases` |

`ChatroomRoomListItem` extends `ChatroomRoomRecord` with computed fields (`messageCount`, `runCount`, `lastSummaryPreview`) from joined queries.
