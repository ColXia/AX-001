# Desktop Frontend Policy

## Status

**Effective**: 2026-05-18
**Version**: 1.0.0
**Status**: ✅ Production Policy

This document defines the frontend policy for AX-001.

## Decision

**Supported Frontend**: Tauri Desktop Application only

AX-001 uses the Tauri desktop application as the only supported interactive frontend. The local HTTP server remains part of the desktop app runtime (Tauri loads the workspace from it), but users should not open the browser UI directly.

**This is a hard product direction**:
- Do NOT introduce browser-first frontend
- Do NOT revive TUI as product interface
- Do NOT split room interactions across multiple UI surfaces
- All user-facing operations belong in the desktop workspace

## Supported Entry Point

```bash
npm run app:tauri
```

This starts the Tauri desktop application with the room workspace.

## Internal Surfaces (Not for Users)

**Allowed for internal/debug use**:
- CLI workflow commands (automation, regression, scripted runs)
- HTTP server (desktop shell host/API process)
- Static `web/chatroom/*` modules (desktop workspace implementation)

**NOT allowed**:
- Adding standalone browser UI
- Adding `web/room-platform/*` or other browser-first directories
- Documenting `npm run web:chatroom` as user-facing command
- Building room features only in CLI
- Creating separate frontend designs per scenario

## Room Management Scope

The desktop workspace owns these operations:
- Room browsing and filtering
- Room creation (all scenarios)
- Room continuation (send messages)
- Room deletion and archiving
- Queue control (pause/resume)
- Checkpoint resume
- Runtime inspection
- Agent thread viewing

- list and select rooms
- create rooms
- create custom roleplay rooms from role cards
- send human messages
- pause/resume queues
- clear pending messages
- stop active runs
- resume checkpoints
- clone/delete rooms
- inspect participants, pending messages, turns, summaries, and runtime state

## Development Guardrails

Before touching frontend code, check this file and the following rule:

`Tauri desktop application -> local HTTP host/API -> room-app services -> room runtime`

The supported frontend path is `npm run app:tauri`. All other user interaction paths
are compatibility or debugging surfaces.

If a future task appears to require a new WebUI, first convert that requirement into
a Tauri desktop workspace change. If a future task appears to require a CLI
feature, first implement the equivalent desktop operation and only then consider
whether a non-interactive CLI helper is needed.
