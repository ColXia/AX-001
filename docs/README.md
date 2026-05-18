# AX-001 Documentation Index

> **Last Updated**: 2026-05-16

## Active Documents

### Core Architecture

- **[room-core-architecture.md](room-core-architecture.md)** - ✅ Canonical architecture for the room-centric platform
- **[development-tasks.md](development-tasks.md)** - ✅ Active implementation roadmap (updated 2026-05-16)
- **[database-schema.md](database-schema.md)** - ✅ SQLite schema reference
- **[workflow-state-machine.md](workflow-state-machine.md)** - ✅ Workflow step sequence and state transitions

### Frontend & Desktop

- **[frontend-architecture.md](frontend-architecture.md)** - ✅ Desktop workspace module map (updated 2026-05-16)
- **[desktop-frontend-policy.md](desktop-frontend-policy.md)** - ✅ Frontend direction policy

### API Documentation

- **[web-api.md](web-api.md)** - ✅ HTTP REST API reference (updated 2026-05-16)
- **[tauri-api-reference.md](tauri-api-reference.md)** - ✅ Tauri API reference (NEW 2026-05-16)

### Tauri Desktop Application

- **[tauri-architecture-plan.md](tauri-architecture-plan.md)** - ✅ Architecture design
- **[tauri-api-reference.md](tauri-api-reference.md)** - ✅ Complete API documentation
- **[tauri-environment-fix-summary.md](tauri-environment-fix-summary.md)** - ✅ Environment setup guide (NEW 2026-05-16)
- **[tauri-migration-final-report.md](tauri-migration-final-report.md)** - ✅ Migration status (updated 2026-05-16)

### Configuration & Deployment

- **[configuration-reference.md](configuration-reference.md)** - ✅ Full config field documentation
- **[deployment.md](deployment.md)** - ✅ Deployment and operations guide

### Agents & Scenarios

- **[agent-profiles.md](agent-profiles.md)** - ✅ Agent profiles and interview templates
- **[roleplay-room-development-plan.md](roleplay-room-development-plan.md)** - ✅ Roleplay roadmap

### Development Tools

- **[course-submission-guide.md](course-submission-guide.md)** - ✅ Course submission guide
- **[checkpoint-regression-playbook.md](checkpoint-regression-playbook.md)** - ✅ Regression workflow

### Documentation Management

- **[documentation-review-report.md](documentation-review-report.md)** - ✅ Documentation audit report (NEW 2026-05-16)

## Historical Planning Documents

Historical planning documents that no longer define the active architecture:

- **[room-architecture-next-phase-plan.md](room-architecture-next-phase-plan.md)** - ℹ️ Next-phase plan (completed)
- **[room-architecture-batch1-breakdown.md](room-architecture-batch1-breakdown.md)** - ℹ️ Batch 1 plan (completed)
- **[room-architecture-batch2-start-plan.md](room-architecture-batch2-start-plan.md)** - ℹ️ Batch 2 plan (completed)
- **[room-architecture-pr1-slice-a-checklist.md](room-architecture-pr1-slice-a-checklist.md)** - ℹ️ PR checklist (completed)
- **[architecture-boundary-audit.md](architecture-boundary-audit.md)** - ℹ️ Boundary audit (completed 2026-05-11)
- **[chatroom-discussion-refactor-plan.md](chatroom-discussion-refactor-plan.md)** - ℹ️ Refactor plan (completed 2026-05-11)
- **[frontend-base-design.md](frontend-base-design.md)** - ℹ️ Frontend design (completed 2026-05-11)

## Archive

Historical documents moved to archive:

- **[archive/](archive/)** - Archived Tauri migration documents
  - `tauri-migration-progress.md` - Migration progress (completed)
  - `tauri-testing-plan.md` - Testing plan (completed)
  - `tauri-quick-start.md` - Quick start (superseded)

Historical timestamped regression outputs:

- **[regression-reports/archive/](regression-reports/archive/)** - Archived regression reports

## Terminology

Use these terms consistently across docs:

- `Room`: durable workspace
- `Main Session`: room's shared long-lived public conversation
- `Execution Run`: one bounded run that advances a room
- `Agent Thread`: one agent's durable private continuity in a room
- `Workflow`: the engine that advances room state

## Document Status Legend

- ✅ **Active**: Current, accurate, actively maintained
- ℹ️ **Historical**: Completed work, kept for reference
- 📦 **Archived**: Moved to archive directory

---

**Review cycle**: Monthly
**Next review**: 2026-06-16
