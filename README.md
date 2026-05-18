# AX-001

Room-centric multi-agent interaction platform built on the OpenAI Agents SDK.

## Status

The project currently ships:

- a reusable `AgentRuntime`
- a reusable `WorkflowRuntime`
- profile-based agent variants
- reusable `contextReaders` for injecting persistent runtime context into agent instructions
- three workflow templates: `chatroom`, `discussion`, and `parallel`
- SQLite-backed room persistence under `data/chatroom.sqlite`
- one durable room-level conversation plus historical execution records for chatroom rooms
- artifact exports for every chatroom execution under `runs/chatroom/<run-id>/`
- an Electron desktop workspace as the only supported interactive frontend
- structured outputs via `zod`
- local JSON config for OpenAI-compatible providers
- a compatibility path that submits structured outputs through tools for providers with weak native JSON support

## Architecture Docs

Current source-of-truth docs:

- `docs/room-core-architecture.md` — canonical architecture
- `docs/development-tasks.md` — active roadmap
- `docs/database-schema.md` — SQLite schema reference
- `docs/web-api.md` — REST API endpoint reference
- `docs/workflow-state-machine.md` — workflow step sequence and state transitions
- `docs/configuration-reference.md` — full config field documentation
- `docs/desktop-frontend-policy.md` — mandatory frontend direction and deprecated surfaces
- `docs/frontend-architecture.md` — desktop-hosted workspace module map and data flow
- `docs/agent-profiles.md` — agent profiles and interview score templates
- `docs/deployment.md` — deployment and operations guide
- `docs/README.md` — docs index

## Model Provider Config

This project now loads model provider settings from:

- `config/runtime.config.local.json`

An example file is included:

- `config/runtime.config.example.json`

The default local template is also created for you, so you can edit it directly.

## Model Retry Config

Default model-request retry now lives in `AgentRuntime`, and you can override it through
`runtime.modelRetry` in `config/runtime.config.local.json`.

Example:

```json
{
  "runtime": {
    "modelRetry": {
      "maxRetries": 3,
      "useProviderSuggested": true,
      "retryNetworkErrors": true,
      "respectRetryAfter": true,
      "retryHttpStatuses": [408, 409, 429, 500, 502, 503, 504],
      "backoff": {
        "initialDelayMs": 500,
        "maxDelayMs": 4000,
        "multiplier": 2,
        "jitter": true
      // Provider-specific function removed
    // Provider-specific function removed
  // Provider-specific function removed
// Provider-specific function removed
```

This is useful for OpenAI-compatible providers that occasionally drop connections under load.

## Quick Start

1. Edit `config/runtime.config.local.json`
2. Fill in your OpenAI-compatible provider settings
3. Run:

```bash
npm install
npm run app:room
```

This opens the Electron desktop room workspace.

### Alternative: Tauri Desktop App

AX-001 also supports a Tauri-based desktop application (Rust backend):

```bash
# Start frontend server
npm run web:chatroom

# In another terminal, start Tauri app
npm run app:tauri
```

For more details, see `docs/tauri-architecture-plan.md`.

### Desktop App Usage

1. **Create a room**: Click the "+ 新建" button in the left panel
2. **Select room type**: Choose from roleplay, interview, or discussion
3. **Fill in details**: Enter topic, objective, and constraints
4. **Start chatting**: Select a room from the list and use the composer to send messages

### Room Types

- **roleplay_scene**: Multi-character roleplay with AI characters
- **interview_simulation**: Mock interview with multiple interviewers
- **expert_discussion**: Expert panel discussion

### Troubleshooting

If you see a configuration error on startup:
1. Check `config/runtime.config.local.json` exists
2. Verify `provider.apiKey` is set correctly
3. Ensure `provider.baseURL` is a valid URL

For the preserved interview fallback:

```bash
npm run app:interview
```

For non-interactive CLI workflow runs, you can still use:

```bash
npm run workflow:chatroom -- --topic "your topic" --objective "your objective" --rounds "2"
```

Or:

```bash
npm run workflow:discussion -- --topic "your topic" --objective "your objective"
```

Or:

```bash
npm run workflow:parallel -- --topic "your topic" --objective "your objective"
```

Optional constraints:

```bash
npm run workflow:discussion -- --topic "your topic" --objective "your objective" --constraints "constraint A|constraint B"
```

For the chatroom workflow:

```bash
npm run workflow:chatroom -- --topic "your topic" --objective "your objective" --constraints "constraint A|constraint B" --rounds "2"
```

Room types:

- `expert_discussion` - the default analysis / expert panel room
- `roleplay_scene` - a live in-character multi-agent scene room

To start a larger room with 10-18 speaker agents:

```bash
npm run workflow:chatroom -- --topic "your topic" --objective "your objective" --rounds "1" --speakers "12"
```

To start a roleplay scene room:

```bash
npm run workflow:chatroom -- --room-type "roleplay_scene" --topic "午夜码头重逢" --objective "让角色围绕一封突然出现的旧信展开对话" --constraints "保持角色感|不要出戏|用户可以随时插话" --speakers "4" --rounds "1"
```

To start the ready-to-run tavern roleplay demo:

```bash
npm run demo:tavern
```

Each tavern NPC is created from a stable role card. Its `characterId` maps to a
stable room participant / agent thread, so local role memory is preserved by the
room rather than by the model provider instance.

To run an interview room with a score template (or custom score dimensions):

```bash
npm run workflow:chatroom -- --scenario-template "interview_simulation" --scenario-json "{\"interview\":{\"targetRole\":\"Backend Engineer\",\"scoreTemplateId\":\"backend_engineering\",\"scoreDimensions\":[\"系统设计与架构取舍\",\"数据一致性与可靠性\",\"故障定位与恢复策略\"]// Provider-specific function removed// Provider-specific function removed" --topic "Backend interview" --objective "Simulate a realistic backend interview and produce a scorecard."
```

To continue an existing room's main session with a new human message:

```bash
npm run workflow:chatroom -- --room "room-id" --message "your follow-up" --rounds "1"
```

Optional room author label:

```bash
npm run workflow:chatroom -- --room "room-id" --message "your follow-up" --author "Product Owner" --rounds "1"
```

Legacy execution-artifact resume is still available:

```bash
npm run workflow:chatroom -- --resume "previous-run-id" --message "your follow-up" --rounds "1"
```

## Frontend Policy

Interactive room usage must go through the Electron desktop workspace:

```bash
npm run app:room
```

Do not add new interactive features to the old TUI or to a browser-opened Web UI.
Those surfaces are deprecated. The local HTTP server and `web/chatroom/*` assets are
kept only as the desktop shell host/API implementation.

For the preserved interview fallback, use:

```bash
npm run app:interview
```

See `docs/desktop-frontend-policy.md` before doing any frontend work.

## Config Shape

```json
{
  "provider": {
    "type": "openai-compatible",
    "baseURL": "https://your-provider.example.com/v1",
    "apiKey": "your_api_key",
    "model": "your-model-name",
    "apiMode": "chat_completions",
    "compatibility": {
      "structuredOutputMode": "tool",
      "maxStructuredOutputRetries": 2
    // Provider-specific function removed
  // Provider-specific function removed,
  "runtime": {
    "tracingDisabled": true,
    "workflowName": "ax-001-analysis",
    "chatroom": {
      "speakerCount": 12,
      "parallelBatchSize": 4
    // Provider-specific function removed
  // Provider-specific function removed
// Provider-specific function removed
```

## Notes

- For most OpenAI-compatible providers, start with `"apiMode": "chat_completions"`.
- Switch to `"responses"` only if your provider actually supports the OpenAI Responses API.
- `"structuredOutputMode": "tool"` is the safer default for many OpenAI-compatible providers because it avoids relying on native structured output parsing.
- If your provider fully supports native structured outputs, you can switch `"structuredOutputMode"` back to `"native"`.
- `runtime.chatroom.speakerCount` controls the default roster size for new `expert_discussion` rooms. This project ships an 18-agent expert roster and recommends staying in the `10-18` range there.
- `chatroom` rooms are now typed. The first built-in room types are `expert_discussion` and `roleplay_scene`.
- `expert_discussion` keeps the old analysis-oriented workflow and works best with `10-18` speakers.
- `roleplay_scene` is a minimal in-character scene mode and currently works best with `3-5` speakers.
- `runtime.chatroom.parallelBatchSize` controls how many speaker agents are executed in parallel inside each chat round. The default `4` keeps the room interactive while still using provider concurrency.
- Interview scenario planning now supports role-aware score templates plus optional custom score dimensions via `scenario-json.interview.scoreTemplateId` and `scenario-json.interview.scoreDimensions`. Built-in template ids: `backend_engineering`, `frontend_engineering`, `algorithm_ml`, `product_management`, `general_professional`.
- Desktop room creation and the underlying `/api/rooms` creation endpoint both accept optional `scoreTemplateId` / `scoreDimensions`; once provided, creation is routed through `interview_simulation` planning to keep scoring metadata consistent in runtime + artifacts.
- `"tracingDisabled": true` disables both per-run tracing and the SDK's global tracing provider, which keeps local runs free of exporter/debug noise.
- The `chatroom` workflow keeps a persistent transcript in workflow state and now also persists room history to SQLite, so later executions can continue the same room-level conversation.
- Agents read chatroom state through `contextReaders`, then post in ordered parallel batches so larger 10-18 agent rooms stay practical without losing the chatroom feel.
- Chatroom agents now also have a dynamic `refresh_room_context` tool, so they can pull a fresher room snapshot mid-turn instead of relying only on the step-start context injection.
- Chatroom speaker agents use a `recent + relevant` context strategy: recent messages keep local continuity, while older relevant messages can be pulled back into the prompt when the chat gets longer.
- Every chatroom execution writes `metadata.json`, `state.json`, `trace.json`, `summary.json`, and `transcript.md` to `runs/chatroom/<run-id>/`.
- `metadata.json` now includes `roomId`, execution lineage, and the persisted identifiers needed to keep the SQLite room store and exported artifacts aligned.
- `npm run tui:chatroom` is deprecated and intentionally redirects users to `npm run app:room`. Do not rebuild interactive product work on the TUI.
- Desktop room workspace now owns room browsing, creation, continuation, queue control, checkpoint resume, run stop, deletion, and runtime inspection.
- The local HTTP server and `web/chatroom/*` modules remain because the Electron desktop workspace loads them internally. Do not document them as a separate browser product.
- Room read/unread state is now persisted in `data/chatroom-browser-state.json`, so `[NEW]` room badges survive desktop restarts.
- Browser metadata in `data/chatroom-browser-state.json` now also persists archived rooms, hidden rooms, hide-test-room mode, and the current browser filter/sort preferences.
- Room deletion from the browser now clears the SQLite room record and cascaded run/message queue data, then removes the room's `data/chatroom-live/<room-id>.json` snapshot plus saved `runs/chatroom/<run-id>/` artifact folders when they are inside the workspace.
- The browser top strip now exposes compact state tags for filter, sort, search query, test-room visibility, and current batch-mark count; matching rooms and fields surface `[HIT]` badges so search results stand out immediately.
- Human messages entered from the desktop workspace are stored in a SQLite pending queue first. If the room is idle they are processed almost immediately; if a run is already active they wait until that run finishes, then trigger a one-round continuation.
