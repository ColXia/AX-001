# AX-001

**Status**: Production Ready (v1.0.0)

Room-centric multi-agent interaction platform built on the OpenAI Agents SDK.

## Overview

AX-001 is a production-ready multi-agent platform where **Room** is the primary product object. Each room hosts a persistent shared conversation (Main Session) where multiple AI agents collaborate while maintaining their own private memory (Agent Threads).

### Key Features

- **Room-Centric Architecture**: Room as the top-level ownership boundary
- **Persistent Main Session**: One durable shared conversation per room
- **Agent Thread Memory**: Each agent maintains private continuity
- **Workflow Engine**: Orchestrates room state advancement
- **Scenario Templates**: Roleplay, expert discussion, interview simulation
- **Tauri Desktop**: Native desktop application (no Electron)
- **SQLite Persistence**: Complete data persistence
- **Chinese Localization**: Full Chinese interface
- **Geometric Design**: Clean linear design style

### Test Status

- **Phase 1** (Basic Functions): 100% passed
- **Phase 2** (Scenarios): 100% passed
- **Overall**: 5/5 tests passed

See [docs/test-report-final.md](docs/test-report-final.md) for details.

## Core Concepts

- **Room**: Durable workspace and ownership boundary
- **Main Session**: Room's persistent shared public conversation
- **Execution Run**: One bounded operational advancement
- **Agent Thread**: Agent's durable private continuity in a room
- **Workflow**: Execution engine that advances room state
- **Scenario Template**: Reusable room family definition
- **Room Blueprint**: Concrete room configuration

`session` and `execution run` are distinct concepts — do not collapse them.

See [docs/room-core-architecture.md](docs/room-core-architecture.md) for canonical architecture.

## Tech Stack

- **Language**: TypeScript, ES2022, strict mode, ESM
- **Runtime**: Node.js with `tsx` for dev, `tsc` for build
- **Agent SDK**: `@openai/agents-core` and `@openai/agents-openai`
- **Validation**: Zod v4
- **Persistence**: SQLite via `node:sqlite` / `DatabaseSync`
- **Desktop**: Tauri 2.x application (Rust backend)
- **Internal API**: Raw Node.js HTTP server (no Express/Hono)
- **Frontend**: `web/chatroom/*` modules (loaded by Tauri, not standalone)

## Frontend Policy

**Supported Frontend**: Tauri Desktop Application only

```bash
npm run app:tauri
```

Browser-based Web UI is deprecated. The local HTTP server and `web/chatroom/*` modules are internal implementation details for the desktop shell, not a standalone product.

See [docs/desktop-frontend-policy.md](docs/desktop-frontend-policy.md) for details.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Provider

Edit `config/runtime.config.local.json`:

```json
{
  "provider": {
    "type": "openai-compatible",
    "baseURL": "https://your-provider.example.com/v1",
    "apiKey": "your_api_key",
    "model": "your-model-name",
    "apiMode": "chat_completions"
  // Provider-specific function removed
// Provider-specific function removed
```

Use `config/runtime.config.example.json` as a template.

### 3. Start Desktop App

```bash
npm run app:tauri
```

## Desktop App Usage

### Create a Room

1. Click the "+ 新建" button in the left panel
2. Select room type:
   - **角色扮演 (Roleplay)**: Multi-character roleplay scene
   - **专家讨论 (Expert Discussion)**: Expert panel discussion
   - **头脑风暴 (Brainstorm)**: Collaborative ideation
3. Fill in topic, objective, and constraints
4. Click create

### Use a Room

1. Select a room from the list
2. Type your message in the composer
3. Press Enter or click send
4. Watch agents respond in character

### Room Types

| Type | Label | Recommended Agents | Description |
|------|-------|-------------------|-------------|
| `roleplay_scene` | 角色扮演 | 3-5 | Multi-character roleplay with AI characters |
| `expert_discussion` | 专家讨论 | 10-18 | Expert panel discussion |
| `brainstorm_workshop` | 头脑风暴 | 6-12 | Collaborative ideation workshop |
| `project_discussion` | 项目讨论 | 4-10 | Project development discussion |
| `report_seminar` | 报告研讨会 | 4-10 | Report review seminar |

### Interview Simulation

To create an interview room, use `roomType: "expert_discussion"` with interview parameters:

```json
{
  "roomType": "expert_discussion",
  "topic": "Backend Engineer Interview",
  "objective": "Complete backend engineering interview",
  "scoreTemplateId": "backend_engineering",
  "scoreDimensions": ["System Design", "Data Consistency"]
// Provider-specific function removed
```

Available score templates:
- `backend_engineering`
- `frontend_engineering`
- `algorithm_ml`
- `product_management`
- `general_professional`

## Project Structure

```
src/
  room-core/        # Core room concepts and types
  room-runtime/     # Runtime execution engine
  room-storage/     # SQLite persistence layer
  room-governance/  # Governance roles (admin, host, recorder)
  room-scenarios/   # Scenario templates and planning
  room-app/         # Application-facing services
  web/              # Desktop host/API server
  agents/           # Agent profiles and schemas
  config/           # Config loader and validation
  core/             # AgentRuntime and WorkflowRuntime
  workflows/        # Legacy workflow surfaces
  scripts/          # Regression and smoke-test scripts
src-tauri/          # Tauri desktop application
web/chatroom/       # Frontend workspace modules
config/             # Runtime config template
data/               # SQLite DB and live snapshots (gitignored)
docs/               # Architecture and development docs
tools/              # Shell launch scripts
```

## Code Conventions

- ESM only: `"type": "module"` in `package.json`; use `.js` extensions in TS imports.
- Strict TypeScript: keep `strict: true` and `noUncheckedIndexedAccess: true`.
- Zod validates structured outputs and config.
- Complex SQLite values are JSON TEXT; validate in TypeScript, not only in SQL.
- Active runs write live snapshots under `data/chatroom-live/<room-id>.json`.
- UI modules are projection/control layers for the desktop workspace; do not put runtime policy there.
- HTTP handlers should continue moving toward focused `room-app` services instead of calling deep workflow/storage internals.

## Runtime Patterns

### Agent Execution Flow

1. `AgentRuntime` creates OpenAI Agents SDK agents.
2. `WorkflowRuntime` orchestrates multi-step workflows with `agentStep` and `parallelStep`.
3. Each step has a profile, input builder, context builder, optional policy hooks, and apply function.
4. Policy hooks run before/after agent execution.
5. Structured output repair follows the configured fallback chain.

### Room Lifecycle

1. Room is created from scenario template plus blueprint.
2. Main session is initialized.
3. User/system message enters the pending queue.
4. Workflow claims the message and starts an execution run.
5. Governance roles and speaker agents advance the room.
6. State, artifacts, participants, turns, and summaries persist.

### Context Strategy

Agents receive a `recent + relevant` room context:

- Recent messages preserve local continuity.
- Older relevant messages can be retrieved for longer conversations.
- `refresh_room_context` lets agents pull a fresher room snapshot mid-turn.
- Roleplay characters keep memory through room participant / agent-thread identity, not through the provider/model instance.

## Commands

```bash
npm install
npm run build
npm run typecheck
npm run test
npm run app:tauri
npm run build:tauri
npm run workflow:chatroom
npm run workflow:discussion
npm run workflow:parallel
npm run demo:tavern
npm run regression:all
```

Internal/debug only:

```bash
npm run web:chatroom
npm run web:chatroom:next
npm run web:chatroom:legacy
```

## Configuration

### Provider Configuration

```json
{
  "provider": {
    "type": "openai-compatible",
    "baseURL": "https://api.example.com/v1",
    "apiKey": "your_key",
    "model": "model-name",
    "apiMode": "chat_completions",
    "compatibility": {
      "structuredOutputMode": "tool",
      "maxStructuredOutputRetries": 2
    // Provider-specific function removed
  // Provider-specific function removed
// Provider-specific function removed
```

### Runtime Configuration

```json
{
  "runtime": {
    "tracingDisabled": true,
    "chatroom": {
      "speakerCount": 12,
      "parallelBatchSize": 4
    // Provider-specific function removed
  // Provider-specific function removed
// Provider-specific function removed
```

### Retry Configuration

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

## Testing

- Unit tests: `src/**/*.test.ts`, run with `npm test`.
- Type checking: `npm run typecheck`.
- Regression scripts: `src/scripts/`, run through `npm run regression:*`.
- Smoke test: `npm run app:interview -- --smoke-test`.

## Documentation

### Architecture

- [Room Core Architecture](docs/room-core-architecture.md) - Canonical architecture
- [Frontend Architecture](docs/frontend-architecture.md) - Desktop workspace design
- [Database Schema](docs/database-schema.md) - SQLite schema reference
- [Web API Reference](docs/web-api.md) - REST API documentation

### Development

- [Development Tasks](docs/development-tasks.md) - Project roadmap
- [Configuration Reference](docs/configuration-reference.md) - Config documentation
- [Deployment Guide](docs/deployment.md) - Deployment instructions

### Testing

- [Test Plan](docs/test-plan.md) - Comprehensive test plan
- [Test Report](docs/test-report-final.md) - Final test results

### Project Status

- [Project Status](docs/PROJECT-STATUS.md) - Current project status

## Troubleshooting

### Configuration Error

1. Check `config/runtime.config.local.json` exists
2. Verify `provider.apiKey` is set correctly
3. Ensure `provider.baseURL` is a valid URL

### Room Won't Load

1. Check the browser console for errors
2. Verify the API server is running (`http://127.0.0.1:3030/api/meta`)
3. Check database file exists (`data/chatroom.sqlite`)

### Agent Not Responding

1. Check provider configuration
2. Verify API key has sufficient quota
3. Check network connectivity

## CLI Usage (Optional)

For non-interactive workflow runs:

```bash
# Expert discussion
npm run workflow:chatroom -- \
  --room-type "expert_discussion" \
  --topic "AI in software development" \
  --objective "Discuss from multiple expert perspectives" \
  --speakers 12 \
  --rounds 1

# Roleplay scene
npm run workflow:chatroom -- \
  --room-type "roleplay_scene" \
  --topic "午夜酒馆重逢" \
  --objective "让角色围绕一封旧信展开对话" \
  --speakers 4 \
  --rounds 1

# Continue existing room
npm run workflow:chatroom -- \
  --room "room-id" \
  --message "Follow-up message" \
  --rounds 1
```

## Notes

- **Provider Compatibility**: Use `"apiMode": "chat_completions"` for most OpenAI-compatible providers
- **Structured Output**: `"structuredOutputMode": "tool"` is safer for providers with weak native JSON support
- **Speaker Count**: `expert_discussion` works best with 10-18 agents; `roleplay_scene` with 3-5 agents
- **Parallel Execution**: `parallelBatchSize: 4` balances concurrency and interactivity
- **Context Strategy**: Agents use `recent + relevant` context for long conversations
- **Persistence**: All room data persists in SQLite; artifacts export to `runs/chatroom/<run-id>/`

## License

This project is private and not licensed for external use.

---

**Version**: 1.0.0 | **Release Date**: 2026-05-18 | **Status**: Production Ready