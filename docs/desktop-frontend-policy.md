# Desktop Frontend Policy

## Decision

AX-001 uses the Tauri desktop application as the only supported interactive frontend.

The local HTTP server remains part of the desktop app runtime because Tauri loads
the room workspace from it, but users and demos should not be directed to open the
browser UI directly.

This is a hard product direction. Do not introduce a new browser-first frontend,
revive the TUI as a product interface, or split future room interactions across
multiple UI surfaces. If an operation needs to be user-facing, put it in the
desktop workspace.

## Supported Entry Point

```powershell
npm run app:tauri
```

Starts the Tauri desktop application with the room workspace.

## Internal Interaction Surfaces

- Browser-opened room UI is not a product frontend. The web server is treated as an
  internal desktop-shell host/API layer.
- Future roleplay, discussion, and room-management work should target the desktop
  workspace first.

Allowed uses of internal surfaces:

- CLI workflow commands may stay for automation, regression, and scripted runs.
- The raw HTTP server may stay as the desktop shell host/API process.
- Static `web/chatroom/*` modules may stay as the desktop workspace implementation.

Not allowed:

- adding a new standalone browser UI
- adding `web/room-platform/*` or another web directory as a browser-first product
  unless it is explicitly loaded by the Tauri desktop application
- documenting `npm run web:chatroom` as the user-facing start command
- building custom roleplay, discussion, or room management features only in CLI
- creating separate frontend designs for each scenario

## Room Management Scope

The desktop room workspace should own the room operations previously spread across
CLI and browser workflows:

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
