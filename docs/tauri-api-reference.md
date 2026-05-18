# Tauri API Reference

> **Status**: ✅ Active - Production Ready (95% complete)
> **Last Updated**: 2026-05-16
> **Architecture**: `docs/tauri-architecture-plan.md`

## Overview

AX-001 provides a Tauri-based desktop application with a Rust backend. The application uses Tauri's `invoke` mechanism for frontend-backend communication, offering the same functionality as the HTTP REST API but with native performance.

## API Adapter Pattern

The frontend uses a unified API adapter (`web/chatroom/api-adapter.js`) that automatically detects the runtime environment:

```javascript
const IS_TAURI = typeof window !== 'undefined' && window.__TAURI__;

async function apiCall(command, params = {// Provider-specific function removed) {
  ***REMOVED***IS_TAURI) {
        // Tauri environment: use invoke
        return await window.__TAURI__.invoke(command, params);
    // Provider-specific function removed else {
        // HTTP environment: use fetch
        const response = await fetch(`/api/${command.replace('_', '/')// Provider-specific function removed`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' // Provider-specific function removed,
            body: JSON.stringify(params)
        // Provider-specific function removed);
        return await response.json();
    // Provider-specific function removed
// Provider-specific function removed
```

This allows the same frontend code to work in both Tauri desktop and browser/HTTP environments.

---

## Implemented Commands

### 1. Metadata

#### `get_meta`

Get runtime metadata and mode information.

**Parameters**: None

**Returns**:
```typescript
{
  ok: boolean,
  runtimeMode: "agent-room-v2" | "legacy-demo-v1"
// Provider-specific function removed
```

**Example**:
```javascript
const meta = await apiCall('get_meta');
console.log(meta.runtimeMode); // "agent-room-v2"
```

---

### 2. Room Operations

#### `get_rooms`

List all rooms with summary information.

**Parameters**: None

**Returns**:
```typescript
Array<RoomSummary> where RoomSummary = {
  id: string,
  topic: string,
  status: "idle" | "running" | "paused" | "completed",
  scenario_template: string,
  created_at: number,  // Unix timestamp (milliseconds)
  updated_at: number,
  has_pending: boolean,
  is_running: boolean,
  message_count: number
// Provider-specific function removed
```

**Example**:
```javascript
const rooms = await apiCall('get_rooms');
rooms.forEach(room => {
  console.log(`${room.topic// Provider-specific function removed (${room.status// Provider-specific function removed)`);
// Provider-specific function removed);
```

---

#### `get_room`

Get detailed information for a specific room.

**Parameters**:
```typescript
{
  room_id: string
// Provider-specific function removed
```

**Returns**:
```typescript
{
  ok: boolean,
  room: Room | null
// Provider-specific function removed
```

Where `Room` includes all fields from `RoomSummary` plus:
```typescript
{
  objective: string,
  constraints: string | null,
  main_session_id: string,
  room_type: string | null,
  scenario_json: string | null
// Provider-specific function removed
```

**Example**:
```javascript
const result = await apiCall('get_room', { room_id: 'room-123' // Provider-specific function removed);
if (result.ok) {
  console.log(result.room.objective);
// Provider-specific function removed
```

---

#### `create_room`

Create a new room.

**Parameters**:
```typescript
{
  scenario_template: string,
  topic: string,
  objective: string,
  constraints?: string,
  room_type?: string,
  scenario_json?: string,
  speakers?: number
// Provider-specific function removed
```

**Returns**:
```typescript
{
  ok: boolean,
  room: Room
// Provider-specific function removed
```

**Example**:
```javascript
const result = await apiCall('create_room', {
  scenario_template: 'roleplay_scene',
  topic: '酒馆奇遇',
  objective: '角色扮演酒馆场景',
  speakers: 4
// Provider-specific function removed);
```

---

#### `delete_room`

Delete a room and all associated data.

**Parameters**:
```typescript
{
  room_id: string
// Provider-specific function removed
```

**Returns**:
```typescript
{
  ok: boolean
// Provider-specific function removed
```

**Example**:
```javascript
await apiCall('delete_room', { room_id: 'room-123' // Provider-specific function removed);
```

---

### 3. Message Operations

#### `send_message`

Send a message to a room's pending queue.

**Parameters**:
```typescript
{
  room_id: string,
  content: string,
  author?: string
// Provider-specific function removed
```

**Returns**:
```typescript
{
  ok: boolean,
  message_id: string
// Provider-specific function removed
```

**Example**:
```javascript
await apiCall('send_message', {
  room_id: 'room-123',
  content: '你好，请问有什么需要帮助的？',
  author: '用户'
// Provider-specific function removed);
```

---

#### `get_pending_messages`

Get all pending messages for a room.

**Parameters**:
```typescript
{
  room_id: string
// Provider-specific function removed
```

**Returns**:
```typescript
Array<{
  id: string,
  room_id: string,
  content: string,
  author: string,
  created_at: number,
  status: "pending" | "processing" | "completed" | "failed"
// Provider-specific function removed>
```

**Example**:
```javascript
const pending = await apiCall('get_pending_messages', { room_id: 'room-123' // Provider-specific function removed);
console.log(`${pending.length// Provider-specific function removed messages pending`);
```

---

#### `clear_pending_messages`

Clear all pending messages for a room.

**Parameters**:
```typescript
{
  room_id: string
// Provider-specific function removed
```

**Returns**:
```typescript
{
  ok: boolean,
  cleared_count: number
// Provider-specific function removed
```

**Example**:
```javascript
const result = await apiCall('clear_pending_messages', { room_id: 'room-123' // Provider-specific function removed);
console.log(`Cleared ${result.cleared_count// Provider-specific function removed messages`);
```

---

## Not Yet Implemented

The following commands are planned but not yet implemented in the Tauri backend:

### Runtime Control APIs

#### `toggle_queue` (TODO)

Pause or resume the message queue for a room.

**Parameters**:
```typescript
{
  room_id: string,
  paused: boolean
// Provider-specific function removed
```

**Status**: ⏳ Not implemented

---

#### `stop_run` (TODO)

Stop an active execution run.

**Parameters**:
```typescript
{
  room_id: string
// Provider-specific function removed
```

**Status**: ⏳ Not implemented

---

#### `resume_checkpoint` (TODO)

Resume from a checkpoint.

**Parameters**:
```typescript
{
  room_id: string,
  checkpoint_id: string
// Provider-specific function removed
```

**Status**: ⏳ Not implemented

---

## HTTP API Mapping

For reference, here's the mapping between Tauri commands and HTTP REST API endpoints:

| Tauri Command | HTTP Endpoint | Method |
| --- | --- | --- |
| `get_meta` | `/api/meta` | GET |
| `get_rooms` | `/api/rooms` | GET |
| `get_room` | `/api/rooms/:id` | GET |
| `create_room` | `/api/rooms` | POST |
| `delete_room` | `/api/rooms/:id` | DELETE |
| `send_message` | `/api/rooms/:id/messages` | POST |
| `get_pending_messages` | `/api/rooms/:id/pending` | GET |
| `clear_pending_messages` | `/api/rooms/:id/pending` | DELETE |

See `docs/web-api.md` for detailed HTTP API documentation.

---

## Error Handling

All commands return errors in a consistent format:

```typescript
{
  ok: false,
  error: string
// Provider-specific function removed
```

In Tauri environment, errors are thrown as exceptions. In HTTP environment, they're returned in the response body.

**Example error handling**:
```javascript
try {
  const result = await apiCall('get_room', { room_id: 'invalid-id' // Provider-specific function removed);
***REMOVED***!result.ok) {
    console.error('Error:', result.error);
  // Provider-specific function removed
// Provider-specific function removed catch (error) {
  console.error('API call failed:', error);
// Provider-specific function removed
```

---

## Database Location

The Tauri application stores its SQLite database in the platform-specific application data directory:

- **Windows**: `%APPDATA%/com.ax001.desktop/chatroom.sqlite`
- **macOS**: `~/Library/Application Support/com.ax001.desktop/chatroom.sqlite`
- **Linux**: `~/.local/share/com.ax001.desktop/chatroom.sqlite`

The database is initialized automatically on first launch with the following tables:
- `rooms`
- `messages`
- `participants`
- `pending_messages`

See `docs/database-schema.md` for schema details.

---

## Development Workflow

### Starting the Application

```bash
# Terminal 1: Start frontend server
npm run web:chatroom

# Terminal 2: Start Tauri app
npm run app:tauri
```

### Building for Production

```bash
npm run build:tauri
```

This generates platform-specific installers in `src-tauri/target/release/bundle/`.

---

## Debugging

### Enable DevTools

The Tauri app includes devtools in development mode. Press `F12` to open the WebKit developer tools.

### View Logs

Application logs are written to:
- **Console**: Visible in the terminal running `npm run app:tauri`
- **DevTools Console**: Press F12 in the app window

### Rust Backend Debugging

Add logging in Rust handlers:
```rust
log::info!("API called: {// Provider-specific function removed", command_name);
log::error!("Error: {:?// Provider-specific function removed", error);
```

---

## Performance Considerations

- **Tauri invoke** is faster than HTTP fetch (no network overhead)
- **SQLite** is embedded in the Rust backend (no external database server)
- **Memory usage**: ~36MB for the desktop process
- **Binary size**: ~17MB for the executable

---

## Security

- **CSP**: Disabled in development, should be configured for production
- **Sandbox**: Tauri runs in a sandboxed environment
- **File access**: Limited to application data directory
- **Network**: Only localhost connections in dev mode

---

## Known Issues

1. **Runtime control APIs missing**: `toggle_queue`, `stop_run`, `resume_checkpoint` not yet implemented
2. **Unused imports warnings**: Minor warnings in Rust code (can be auto-fixed with `cargo fix`)
3. **Frontend refresh**: May need manual F5 refresh after file changes

---

## Future Enhancements

1. Complete runtime control APIs
2. Add WebSocket/SSE for real-time updates
3. Implement room cloning and checkpoint management
4. Add offline mode support
5. Optimize bundle size with code splitting

---

**See Also**:
- `docs/tauri-architecture-plan.md` - Architecture design
- `docs/tauri-environment-fix-summary.md` - Environment setup guide
- `docs/web-api.md` - HTTP REST API reference
- `docs/database-schema.md` - Database schema