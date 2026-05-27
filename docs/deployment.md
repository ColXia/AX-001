# Deployment and Operations

> Current state: local development only, no Docker/CI/CD configured

## Local Development

### Prerequisites

- Node.js (version supporting `node:sqlite` and ES2022)
- npm

### Setup

```bash
npm install
```

### Configuration

1. Copy the example config:
   ```bash
   cp config/runtime.config.example.json config/runtime.config.local.json
   ```
2. Edit `config/runtime.config.local.json` with your provider settings

See `docs/configuration-reference.md` for all config fields.

### Running

```bash
# Build TypeScript
npm run build

# Type-check without emit
npm run typecheck

# Run tests
npm run test

# CLI workflow
npm run workflow:chatroom -- --topic "..." --objective "..." --rounds 2

# Supported interactive desktop workspace
npm run app:room

# Preserved interview fallback desktop mode
npm run app:interview
```

Internal/debug host command:

```bash
npm run web:chatroom
```

`npm run web:chatroom` starts the local HTTP host/API used by the desktop shell.
It is not the supported user-facing product frontend. `npm run tui:chatroom` is
deprecated and intentionally redirects users to `npm run app:room`.

## Data Directories

| Directory | Purpose | Gitignored |
|---|---|---|
| `data/chatroom.sqlite` | Room persistence database | Yes |
| `data/chatroom-live/` | Live snapshots during active runs | Yes |
| `data/chatroom-control/` | Run control signals | Yes |
| `data/workflow-checkpoints/` | Checkpoint files for resume | Yes |
| `data/chatroom-browser-state.json` | Desktop room browser state persistence | Yes |
| `runs/chatroom/` | Execution run artifacts | Yes |
| `tmp/` | Temporary files | Yes |

**Important:** All data directories are gitignored. Production deployments must ensure these directories exist and are persisted across restarts.

## Artifact Output

Each execution run produces artifacts under `runs/chatroom/<run-id>/`:

| File | Description |
|---|---|
| `metadata.json` | Run metadata (roomId, execution lineage, main session linkage) |
| `state.json` | Final ChatroomState snapshot |
| `trace.json` | Step-by-step execution trace |
| `summary.json` | Structured summary output |
| `transcript.md` | Human-readable transcript |

## Production Considerations

### Database

- SQLite database at `data/chatroom.sqlite`
- Uses `STRICT` mode for all tables
- No WAL mode configured (consider enabling for concurrent read/write)
- No automated backups configured
- No migration tooling — schema changes are applied via `ALTER TABLE` + `CREATE INDEX IF NOT EXISTS`

### Concurrency

- Room leases (`chatroom_room_leases`) prevent concurrent execution runs on the same room
- Local desktop host/API uses a single-process queue pump (1s interval) to process pending messages
- No horizontal scaling support — only one server process should write to the database

### Monitoring

- No structured logging or metrics export
- No health check endpoint
- Server online/offline status is shown in the desktop workspace via polling success/failure
- Run status is tracked in `chatroom_execution_runs.status` (`completed`, `failed`, `cancelled`)

### Security

- API key stored in `config/runtime.config.local.json` (gitignored, but on disk in plaintext)
- No authentication on the local desktop host API — all endpoints are unauthenticated
- No CORS configuration — the local host serves desktop workspace assets directly
- JSON body limit: 1 MB
- Path traversal protection on static asset serving

### Missing Infrastructure

The following are not yet configured and would be needed for production deployment:

| Item | Status | Notes |
|---|---|---|
| Docker/Dockerfile | Not created | Needed for containerized deployment |
| CI/CD pipeline | Not configured | No GitHub Actions, GitLab CI, etc. |
| Process manager | Not configured | Consider pm2 or systemd for production |
| Reverse proxy | Not configured | Consider nginx for TLS termination |
| TLS/HTTPS | Not configured | Server runs HTTP on port 3030 |
| Authentication | Not implemented | All API endpoints are open |
| Database backups | Not automated | Manual sqlite3 backup or filesystem snapshots |
| Log aggregation | Not configured | Console output only |
| Metrics/monitoring | Not configured | No Prometheus, Grafana, etc. |
| Horizontal scaling | Not supported | Single-process, SQLite-bound |

## Docker Deployment (Recommended Setup)

A production Docker setup for the internal host/API would look like:

```dockerfile
FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY dist/ dist/
COPY web/ web/
COPY config/runtime.config.example.json config/runtime.config.example.json
EXPOSE 3030
CMD ["node", "dist/web/chatroom-web.js"]
```

Key considerations:
- Build TypeScript in CI, copy `dist/` into the image
- Mount `data/` and `runs/` as volumes for persistence
- Mount `config/runtime.config.local.json` as a secret or volume
- Use `--init` for proper signal handling
- Keep the product-facing interactive surface in the Electron desktop workspace;
  do not turn this host into a separate browser-first Web UI.

## Regression Testing

See `docs/checkpoint-regression-playbook.md` for the full regression workflow.

```bash
# Full regression suite
npm run regression:all

# Individual regression scripts
npm run regression:checkpoint-resume
npm run regression:repair-checkpoint-resume
npm run regression:interview-complete
npm run regression:discussion-complete
```

Reports are generated at:
- `docs/regression-reports/latest.md`
- `docs/regression-reports/regression-report-YYYYMMDD-HHMMSS.md`
