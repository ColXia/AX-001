# Desktop Workspace Frontend Architecture

> Source: `web/chatroom/`
> Desktop shell: `tools/interview-demo-shell.cjs`
> Room entry: `npm run app:room`
> Interview fallback entry: `npm run app:interview`

## Frontend Policy

AX-001 has one supported interactive frontend: the Electron desktop shell.

The files under `web/chatroom/` are still important, but they are not a standalone
browser product. They are static workspace modules loaded by Electron through the
local HTTP host. Future user-facing room work must be implemented as desktop
workspace behavior and routed through `room-app` services.

Do not add or document a separate browser-opened Web UI as a product path. Do not
revive the old TUI as an interactive product path.

Canonical user entries:

```bash
npm run app:room
npm run app:interview
```

Allowed internal/debug entries:

```bash
npm run web:chatroom
npm run web:chatroom:next
npm run web:chatroom:legacy
```

Those internal commands are for hosting the API/static assets, regression support,
and debugging only. They must not become the documented user workflow.

## Overview

The room workspace is a desktop-hosted single-page workspace:

- Left panel: room browser, filters, and room selection.
- Center panel: shared room conversation, message input, and primary actions.
- Right panel: runtime status, participants, pending queue, turns, and summary.

The workspace communicates with the local backend through REST API polling. There
is no WebSocket/SSE dependency in the active workspace path.

## Runtime Shape

```text
Electron desktop shell
  -> local HTTP host/API
    -> static workspace modules in web/chatroom/
    -> REST API under /api/*
      -> room-app services
        -> room runtime / room governance / room storage
```

This dependency direction is intentional. UI modules should not call deep workflow
or storage internals directly; route handlers should continue moving toward
focused `room-app` service facades.

## Entry Files

The desktop shell selects the workspace mode:

| Mode | Command | Runtime | Loaded workspace |
| --- | --- | --- | --- |
| Room workspace | `npm run app:room` | `agent-room-v2` | `web/chatroom/main.html` |
| Interview fallback | `npm run app:interview` | `legacy-demo-v1` | `web/chatroom/index.html` |

The interview fallback is preserved for demo/course safety. It is not the base for
new generic room products.

## Module Map

```text
app.js                         composition root, boot, polling
  room-runtime-controller.js   runtime facade: sync and actions
    room-sync.js               API communication through fetch
    room-actions.js            send, pause, stop, delete, checkpoint, queue actions
  room-view-controller.js      rendering coordinator
    room-browser.js            room list, rail, filters, search
    room-detail.js             room detail panels and message rendering
  create-controller.js         create-flow facade
    create-dialog.js           manual, admin, and roleplay creation logic
  layout-controller.js         three-panel layout and resize behavior
  ui-state-controller.js       hints, button busy state, room card menus
  event-bindings.js            DOM event wiring
  meta-renderer.js             metadata dropdowns and labels
  ui-formatters.js             pure formatting helpers
  ui-helpers.js                DOM helpers, scrolling, textarea sizing
  storage-utils.js             localStorage and URL query helpers
```

## Module Responsibilities

### `app.js`

Composition root. It collects DOM elements, creates shared workspace state,
instantiates controllers, boots metadata/room loading, and starts polling.

### `room-sync.js`

Owns fetch calls to `/api/*`, including:

- `GET /api/meta`
- `GET /api/rooms`
- `GET /api/rooms/:roomId`

It also updates online/offline indicators for the desktop workspace.

### `room-actions.js`

Owns user-triggered room operations:

| Action | API endpoint |
| --- | --- |
| Send message | `POST /api/rooms/:id/messages` |
| Pause/resume queue | `POST /api/rooms/:id/queue` |
| Resume checkpoint | `POST /api/rooms/:id/resume-checkpoint` |
| Stop run | `POST /api/rooms/:id/stop` |
| Clear pending messages | `POST /api/rooms/:id/pending/clear` |
| Delete room | `DELETE /api/rooms/:id` |

### `create-dialog.js`

Owns room creation flows inside the desktop workspace:

- Manual room creation.
- Admin-agent conversational planning.
- Custom roleplay room creation from role-card JSON.

New scenario creation UX should extend this desktop create flow or a successor
desktop workspace module, not a separate WebUI/TUI flow.

### `room-view-controller.js`, `room-browser.js`, `room-detail.js`

Own rendering of room lists and the selected room details. These modules should
remain UI projection layers; they should not contain room runtime policy.

### `layout-controller.js`

Owns panel sizing, visibility toggles, and responsive desktop layout. Any future
room-management panels should be integrated here instead of creating another
frontend surface.

## Data Flow

```text
user action
  -> event-bindings.js
  -> room-actions.js
  -> REST API
  -> room-app service
  -> room runtime / storage
  -> REST response
  -> room-sync.js refresh
  -> room-view-controller.js render
```

Live updates use polling:

| Interval | Action | Purpose |
| --- | --- | --- |
| 1200 ms | refresh selected room | active room updates |
| 2000 ms | refresh room list | browser and status updates |

## Development Guardrails

- Treat `web/chatroom/*` as desktop workspace implementation files.
- Do not document `npm run web:chatroom` as the product start command.
- Do not add product-only features to the deprecated TUI.
- Do not create scenario-specific standalone frontends.
- Route user-facing room operations through the desktop workspace and `room-app`.
- Keep the interview fallback available, but do not build new generic room work on
  `interview-demo.js`.

See `docs/desktop-frontend-policy.md` before frontend work.
