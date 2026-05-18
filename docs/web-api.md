# Desktop Host/API Reference

> **Status**: ✅ Active - Production Ready
> **Server**: `src/web/chatroom-web.ts`
> **Static workspace modules**: `web/chatroom/`
> **Default port**: `3030`
> **User start command**: `npm run app:room`
> **Internal/debug host command**: `npm run web:chatroom`

## Overview

The local host is a Node.js HTTP server used by the Electron desktop shell. It serves:

1. A REST API under `/api/*`
2. Static desktop workspace assets from `web/chatroom/`

This server is not the supported product frontend by itself. Users and demos should start the Electron desktop workspace with:

```bash
npm run app:room
```

Direct `npm run web:chatroom` runs are allowed for API/static-host debugging, regression support, or internal development only. Do not document it as the interactive user workflow.

## Alternative: Tauri Desktop Application

AX-001 also provides a Tauri-based desktop application with a Rust backend. The Tauri app offers the same functionality through native API calls instead of HTTP requests.

**Key differences:**
- **Performance**: Tauri uses native `invoke` calls (no HTTP overhead)
- **Backend**: Rust with embedded SQLite (no separate server process)
- **API**: Same endpoints exposed as Tauri commands
- **Documentation**: See `docs/tauri-api-reference.md` for details

**Start Tauri app:**
```bash
npm run web:chatroom  # Terminal 1: frontend server
npm run app:tauri     # Terminal 2: Tauri app
```

All API responses use `Content-Type: application/json; charset=utf-8`. Request bodies are limited to 1 MB.

Error responses follow this shape:

```json
{
  "error": true,
  "statusCode": 400,
  "message": "Error description."
// Provider-specific function removed
```

## Endpoints

### `GET /api/meta`

Returns platform metadata: available room types, interview score templates.

**Response:**

```json
{
  "generatedAt": "2026-04-12T10:00:00.000Z",
  "defaultRoomType": "expert_discussion",
  "providerWarning": null,
  "roomTypes": [
    {
      "id": "expert_discussion",
      "label": "专家讨论",
      "shortLabel": "专家",
      "recommendedSpeakerCount": 12,
      "minSpeakerCount": 10,
      "maxSpeakerCount": 18
    // Provider-specific function removed,
    {
      "id": "roleplay_scene",
      "label": "角色扮演",
      "shortLabel": "角色",
      "recommendedSpeakerCount": 4,
      "minSpeakerCount": 3,
      "maxSpeakerCount": 5
    // Provider-specific function removed
  ],
  "interviewScoreTemplates": [
    { "id": "backend_engineering", "label": "后端工程" // Provider-specific function removed,
    { "id": "frontend_engineering", "label": "前端工程" // Provider-specific function removed,
    { "id": "algorithm_ml", "label": "算法/机器学习" // Provider-specific function removed,
    { "id": "product_management", "label": "产品管理" // Provider-specific function removed,
    { "id": "general_professional", "label": "通用专业" // Provider-specific function removed
  ]
// Provider-specific function removed
```

`providerWarning` is `null` for normal providers. When the configured provider sits on a compatibility-risk endpoint, it contains a human-readable advisory that the desktop workspace can surface before room creation.

---

### `GET /api/rooms`

List rooms with overview data.

**Query Parameters:**

| Param | Type | Default | Description |
|---|---|---|---|
| `limit` | integer | 48 | Maximum rooms to return |

**Response:**

```json
{
  "generatedAt": "2026-04-12T10:00:00.000Z",
  "rooms": [
    {
      "roomId": "uuid",
      "roomType": "expert_discussion",
      "roomTypeLabel": "专家讨论",
      "roomTypeShortLabel": "专家",
      "mainSessionId": "uuid",
      "scenarioTemplateId": null,
      "topic": "...",
      "objective": "...",
      "createdAt": "2026-04-12T10:00:00.000Z",
      "updatedAt": "2026-04-12T10:30:00.000Z",
      "speakerCount": 12,
      "messageCount": 47,
      "runCount": 3,
      "latestRunStatus": "completed",
      "latestExecutionRunId": "uuid",
      "liveStatus": null,
      "liveExecutionRunId": null,
      "queuePaused": false,
      "queuePauseReason": null,
      "pendingCount": 0,
      "resumableCheckpointId": null,
      "status": "idle",
      "hasFinalSummary": true,
      "governanceSummary": "..."
    // Provider-specific function removed
  ]
// Provider-specific function removed
```

**Room `status` values:** `idle`, `running`, `starting`, `paused`, `failed`

---

### `POST /api/rooms`

Create a new room. Two modes: **manual** (default) and **admin** (conversational planning).

#### Manual Mode

**Request:**

```json
{
  "topic": "AI safety governance",
  "objective": "Analyze global regulatory trends",
  "roomType": "expert_discussion",
  "speakerCount": 12,
  "scoreTemplateId": "backend_engineering",
  "scoreDimensions": ["系统设计", "数据一致性"]
// Provider-specific function removed
```

| Field | Type | Required | Description |
|---|---|---|---|
| `topic` | string | YES | Room topic |
| `objective` | string | YES | Room objective |
| `roomType` | string | NO | Default: `expert_discussion` |
| `speakerCount` | integer | NO | Default: room type's recommended count |
| `scoreTemplateId` | string | NO | Interview score template ID (triggers `interview_simulation`) |
| `scoreDimensions` | string[] | NO | Custom score dimensions for interview |

**Important Notes:**

1. **Room Types vs Scenario Templates**: `roomType` must be one of the valid room types returned by `/api/meta` (e.g., `expert_discussion`, `roleplay_scene`). Scenario templates (like `interview_simulation`) are internal and should not be used as `roomType`.

2. **Interview Simulation**: To create an interview simulation room, use `roomType: "expert_discussion"` and provide either `scoreTemplateId` or `scoreDimensions`. This triggers the `interview_simulation` scenario template internally.

**Interview Simulation Examples:**

```json
{
  "topic": "Backend Engineer Interview",
  "objective": "Complete a backend engineering interview simulation",
  "roomType": "expert_discussion",
  "scoreTemplateId": "backend_engineering"
// Provider-specific function removed
```

```json
{
  "topic": "Custom Interview",
  "objective": "Simulate a custom interview",
  "roomType": "expert_discussion",
  "scoreDimensions": ["System Design", "Data Consistency", "Failure Recovery"]
// Provider-specific function removed
```

**Available Interview Score Templates:**
- `backend_engineering` - Backend Engineering
- `frontend_engineering` - Frontend Engineering
- `algorithm_ml` - Algorithm/Machine Learning
- `product_management` - Product Management
- `general_professional` - General Professional

**Response (success):**

```json
{
  "status": "created",
  "roomId": "uuid",
  "note": "房间 abc123 已创建。",
  "artifactDirectory": "runs/chatroom/<run-id>"
// Provider-specific function removed
```

**Errors:**
- `400` — Missing topic/objective, invalid score template, speaker count out of range

#### Admin Mode

**Request:**

```json
{
  "mode": "admin",
  "adminRequest": "I want to simulate a backend engineering interview",
  "conversation": [
    { "role": "user", "content": "..." // Provider-specific function removed,
    { "role": "assistant", "content": "..." // Provider-specific function removed
  ]
// Provider-specific function removed
```

| Field | Type | Required | Description |
|---|---|---|---|
| `mode` | string | YES | Must be `"admin"` |
| `adminRequest` | string | YES | User's natural language request |
| `conversation` | array | NO | Prior conversation turns for multi-turn planning |

**Response (needs clarification):**

```json
{
  "status": "needs_clarification",
  "note": "What role are you interviewing for?",
  "conversation": [
    { "role": "user", "content": "I want to simulate a backend engineering interview" // Provider-specific function removed,
    { "role": "assistant", "content": "What role are you interviewing for?" // Provider-specific function removed
  ]
// Provider-specific function removed
```

**Response (ready):**

```json
{
  "status": "ready",
  "note": "Plan confirmed. Creating room...",
  "roomBlueprint": { ... // Provider-specific function removed,
  "conversation": [ ... ]
// Provider-specific function removed
```

---

### `GET /api/rooms/:roomId`

Get full room detail including state, messages, participants, threads, turns, and pending messages.

**Response:**

```json
{
  "generatedAt": "2026-04-12T10:00:00.000Z",
  "room": {
    "roomId": "uuid",
    "mainSessionId": "uuid",
    "roomType": "expert_discussion",
    "topic": "...",
    "objective": "...",
    "constraints": [],
    "speakerIds": ["speaker-1", "speaker-2"],
    "createdAt": "...",
    "updatedAt": "...",
    "governanceSummary": "..."
  // Provider-specific function removed,
  "mainSession": {
    "mainSessionId": "uuid",
    "roomId": "uuid",
    "startedAt": "...",
    "updatedAt": "...",
    "messageCount": 47,
    "summary": null
  // Provider-specific function removed,
  "overview": { "...same as room list item..." // Provider-specific function removed,
  "stateSource": "persisted",
  "currentState": { "...ChatroomState..." // Provider-specific function removed,
  "live": null,
  "latestRun": { "...ChatroomExecutionRunRecord..." // Provider-specific function removed,
  "runs": [ "...up to 16 execution runs..." ],
  "participants": [ "...ChatroomParticipantRecord..." ],
  "threads": [ "...ChatroomAgentThreadRecord..." ],
  "agentTurns": [ "...up to 48 agent turns..." ],
  "pendingMessages": [ "...up to 24 pending/processing/failed messages..." ],
  "queuePaused": false,
  "queuePauseReason": null,
  "queuePauseAt": null,
  "resumableCheckpoint": null
// Provider-specific function removed
```

**`stateSource`**: `"live"` if a live snapshot is available and fresher than persisted state; `"persisted"` otherwise.

**Errors:**
- `404` — Room not found

---

### `DELETE /api/rooms/:roomId`

Delete a room and all associated data (messages, runs, participants, threads, turns, pending messages, live snapshot, artifacts).

**Response:**

```json
{
  "deleted": true,
  "note": "Deleted room abc123.",
  "result": {
    "roomId": "uuid",
    "existed": true,
    "deletedRunCount": 3,
    "deletedMessageCount": 47,
    "deletedPendingMessageCount": 0
  // Provider-specific function removed
// Provider-specific function removed
```

**Errors:**
- `409` — Cannot delete while room is running (`starting` or `running` live status)

---

### `POST /api/rooms/:roomId/messages`

Enqueue a human message into the room's pending queue. If the room is idle, the message is processed almost immediately; if a run is active, it waits until the run finishes.

**Request:**

```json
{
  "authorName": "Product Owner",
  "content": "What about the cost implications?"
// Provider-specific function removed
```

| Field | Type | Required | Description |
|---|---|---|---|
| `authorName` | string | NO | Default: `"User"` |
| `content` | string | YES | Message content (must not be empty) |

**Response:**

```json
{
  "note": "已收到 Product Owner 的消息。",
  "pendingMessage": {
    "pendingMessageId": "uuid",
    "roomId": "uuid",
    "authorName": "Product Owner",
    "content": "What about the cost implications?",
    "status": "pending",
    "createdAt": "2026-04-12T10:00:00.000Z"
  // Provider-specific function removed
// Provider-specific function removed
```

**Errors:**
- `400` — Content is empty
- `404` — Room not found

---

### `POST /api/rooms/:roomId/queue`

Pause or resume the room's message processing queue.

**Request (pause):**

```json
{ "paused": true // Provider-specific function removed
```

**Request (resume):**

```json
{ "paused": false // Provider-specific function removed
```

**Response (paused):**

```json
{
  "paused": true,
  "note": "房间 abc123 已暂停。"
// Provider-specific function removed
```

**Response (resumed):**

```json
{
  "paused": false,
  "note": "房间 abc123 已恢复。"
// Provider-specific function removed
```

---

### `POST /api/rooms/:roomId/stop`

Request an active execution run to stop. The run's abort controller is triggered, and the pending message (if any) is released back to the queue.

**Request:**

```json
{
  "executionRunId": "uuid"
// Provider-specific function removed
```

| Field | Type | Required | Description |
|---|---|---|---|
| `executionRunId` | string | NO | Specific run to stop; if omitted, stops the room's current active run |

**Response:**

```json
{
  "stopped": true,
  "executionRunId": "uuid",
  "note": "Stop request sent."
// Provider-specific function removed
```

---

### `POST /api/rooms/:roomId/pending/clear`

Clear pending and/or failed messages from the room's queue.

**Request:**

```json
{
  "includeFailed": true,
  "includeProcessing": false
// Provider-specific function removed
```

| Field | Type | Default | Description |
|---|---|---|---|
| `includeFailed` | boolean | `true` | Also clear failed messages |
| `includeProcessing` | boolean | `false` | Also clear processing messages (only allowed when room is not running) |

**Response:**

```json
{
  "cleared": 3,
  "note": "已清理 3 条排队消息。"
// Provider-specific function removed
```

**Errors:**
- `409` — Cannot clear processing messages while room is running

---

### `POST /api/rooms/:roomId/resume-checkpoint`

Resume a room from a failed checkpoint.

**Request:**

```json
{
  "checkpointId": "uuid"
// Provider-specific function removed
```

| Field | Type | Required | Description |
|---|---|---|---|
| `checkpointId` | string | NO | Specific checkpoint to resume; if omitted, uses the latest resumable checkpoint |

**Response:**

```json
{
  "note": "已从 abc123 继续运行。",
  "roomId": "uuid",
  "executionRunId": "uuid",
  "artifactDirectory": "runs/chatroom/<run-id>"
// Provider-specific function removed
```

**Errors:**
- `404` — No resumable checkpoint found

---

### `GET /*` (Desktop Workspace Static Assets)

Serves the desktop workspace modules from `web/chatroom/`. Unknown paths fall back to `index.html` for SPA-style routing used by the local host.

Content types:
- `.html` → `text/html; charset=utf-8`
- `.js` → `application/javascript; charset=utf-8`
- `.css` → `text/css; charset=utf-8`
- `.json` → `application/json; charset=utf-8`
- `.png` / `.jpg` / `.gif` / `.svg` → appropriate image types

## Live Updates

The desktop workspace uses **polling** (not SSE/WebSocket) to get live updates:

1. The backend writes a live snapshot to `data/chatroom-live/<room-id>.json` during active runs
2. The desktop workspace polls `GET /api/rooms/:roomId` at a regular interval
3. The response includes `stateSource: "live"` when a live snapshot is fresher than persisted state
4. When the run completes, the live snapshot is no longer preferred

## Queue Processing

The server runs a background queue pump (`pumpQueues`) every 1 second:

1. Scans all rooms for pending messages
2. For each room with pending messages:
   - Checks if the room queue is paused → skip
   - Checks if the room is already being processed → skip
   - Checks if a live run is active → skip
   - Claims the next pending message
   - Executes a 1-round chatroom workflow with the human message
   - On success: marks the pending message as `completed`
   - On abort: releases the pending message back to `pending`
   - On busy: releases the pending message back to `pending`
   - On error: marks the pending message as `failed`

## Run Control

Active runs are tracked by both `executionRunId` and `roomId`. The server monitors stop requests every 350ms during active runs. When a stop is detected, the run's `AbortController` is triggered, causing an `ExecutionAbortedError`.

Room leases (`chatroom_room_leases`) prevent concurrent execution runs on the same room. If a lease already exists and hasn't expired, a `ChatroomRoomBusyError` is thrown.
