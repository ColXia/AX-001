import { mkdirSync // Provider-specific function removed from 'node:fs';
import { resolve // Provider-specific function removed from 'node:path';
import { DatabaseSync // Provider-specific function removed from 'node:sqlite';

import {
  ensureChatroomAgentTurnColumn,
  ensureChatroomExecutionRunColumn,
  ensureChatroomExecutionRunMainSessionBindings,
  ensureChatroomMainSessions,
  ensureChatroomMessageColumn,
  ensureChatroomMessageMainSessionBindings,
  ensureChatroomRoomColumn,
  migrateLegacySessionSchemaToExecutionRunSchema,
// Provider-specific function removed from './schema.js';

export function openInitializedChatroomDatabase(args: {
  rootDir: string;
  legacySpeakerIds: readonly string[];
  defaultRoomType: string;
// Provider-specific function removed): DatabaseSync {
  const directory = resolve(args.rootDir, 'data');
  mkdirSync(directory, { recursive: true // Provider-specific function removed);

  const db = new DatabaseSync(resolve(directory, 'chatroom.sqlite'), {
    timeout: 5_000,
  // Provider-specific function removed);

  initializeChatroomDatabase(db, args);
  return db;
// Provider-specific function removed

function initializeChatroomDatabase(
  db: DatabaseSync,
  args: {
    legacySpeakerIds: readonly string[];
    defaultRoomType: string;
  // Provider-specific function removed,
): void {
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec('PRAGMA busy_timeout = 5000;');

  migrateLegacySessionSchemaToExecutionRunSchema(db);
  db.exec(`
    CREATE TABLE IF NOT EXISTS chatroom_rooms (
      room_id TEXT PRIMARY KEY,
      main_session_id TEXT,
      room_type TEXT NOT NULL,
      topic TEXT NOT NULL,
      objective TEXT NOT NULL,
      constraints_json TEXT NOT NULL,
      speaker_ids_json TEXT NOT NULL,
      room_blueprint_json TEXT,
      room_state_json TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      last_execution_run_id TEXT,
      last_summary_json TEXT
    ) STRICT;

    CREATE TABLE IF NOT EXISTS chatroom_execution_runs (
      execution_run_id TEXT PRIMARY KEY,
      room_id TEXT NOT NULL,
      main_session_id TEXT,
      status TEXT NOT NULL CHECK (status IN ('completed', 'failed', 'cancelled')),
      resumed_from_run_id TEXT,
      started_at TEXT NOT NULL,
      ended_at TEXT NOT NULL,
      rounds INTEGER NOT NULL,
      base_message_count INTEGER NOT NULL,
      new_message_count INTEGER NOT NULL,
      human_author_name TEXT,
      human_message TEXT,
      artifact_directory TEXT,
      summary_json TEXT,
      error_text TEXT,
      FOREIGN KEY (room_id) REFERENCES chatroom_rooms(room_id) ON DELETE CASCADE,
      FOREIGN KEY (resumed_from_run_id) REFERENCES chatroom_execution_runs(execution_run_id) ON DELETE SET NULL
    ) STRICT;

    CREATE TABLE IF NOT EXISTS chatroom_main_sessions (
      main_session_id TEXT PRIMARY KEY,
      room_id TEXT NOT NULL UNIQUE,
      started_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      last_execution_run_id TEXT,
      message_count INTEGER NOT NULL,
      summary_json TEXT,
      FOREIGN KEY (room_id) REFERENCES chatroom_rooms(room_id) ON DELETE CASCADE
    ) STRICT;

    CREATE INDEX IF NOT EXISTS idx_chatroom_main_sessions_room_updated
      ON chatroom_main_sessions (room_id, updated_at DESC);

    CREATE TABLE IF NOT EXISTS chatroom_participants (
      participant_id TEXT PRIMARY KEY,
      room_id TEXT NOT NULL,
      participant_type TEXT NOT NULL CHECK (participant_type IN ('agent', 'human', 'system', 'summary')),
      stable_key TEXT NOT NULL,
      profile_id TEXT,
      display_name TEXT NOT NULL,
      role_label TEXT,
      identity_snapshot_json TEXT,
      state_json TEXT,
      joined_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      archived_at TEXT,
      FOREIGN KEY (room_id) REFERENCES chatroom_rooms(room_id) ON DELETE CASCADE,
      UNIQUE (room_id, stable_key)
    ) STRICT;

    CREATE INDEX IF NOT EXISTS idx_chatroom_participants_room_joined
      ON chatroom_participants (room_id, joined_at ASC);

    CREATE TABLE IF NOT EXISTS chatroom_agent_threads (
      agent_thread_id TEXT PRIMARY KEY,
      room_id TEXT NOT NULL,
      participant_id TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('active', 'paused', 'errored')),
      provider_refs_json TEXT,
      memory_state_json TEXT,
      summary_state_json TEXT,
      last_message_sequence_no INTEGER,
      last_execution_run_id TEXT,
      version INTEGER NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (room_id) REFERENCES chatroom_rooms(room_id) ON DELETE CASCADE,
      FOREIGN KEY (participant_id) REFERENCES chatroom_participants(participant_id) ON DELETE CASCADE,
      FOREIGN KEY (last_execution_run_id) REFERENCES chatroom_execution_runs(execution_run_id) ON DELETE SET NULL,
      UNIQUE (room_id, participant_id)
    ) STRICT;

    CREATE INDEX IF NOT EXISTS idx_chatroom_agent_threads_room_updated
      ON chatroom_agent_threads (room_id, updated_at DESC);

    CREATE TABLE IF NOT EXISTS chatroom_agent_turns (
      agent_turn_id TEXT PRIMARY KEY,
      room_id TEXT NOT NULL,
      execution_run_id TEXT NOT NULL,
      participant_id TEXT NOT NULL,
      agent_thread_id TEXT NOT NULL,
      message_id TEXT,
      message_sequence_no INTEGER,
      step_id TEXT NOT NULL,
      step_kind TEXT NOT NULL CHECK (step_kind IN ('agent', 'parallel', 'custom')),
      branch_id TEXT,
      profile_id TEXT NOT NULL,
      round INTEGER,
      status TEXT NOT NULL CHECK (status IN ('completed', 'failed', 'cancelled')),
      started_at TEXT NOT NULL,
      ended_at TEXT NOT NULL,
      input_preview TEXT,
      output_text TEXT,
      output_json TEXT,
      usage_json TEXT,
      telemetry_json TEXT,
      error_text TEXT,
      FOREIGN KEY (room_id) REFERENCES chatroom_rooms(room_id) ON DELETE CASCADE,
      FOREIGN KEY (execution_run_id) REFERENCES chatroom_execution_runs(execution_run_id) ON DELETE CASCADE,
      FOREIGN KEY (participant_id) REFERENCES chatroom_participants(participant_id) ON DELETE CASCADE,
      FOREIGN KEY (agent_thread_id) REFERENCES chatroom_agent_threads(agent_thread_id) ON DELETE CASCADE,
      FOREIGN KEY (message_id) REFERENCES chatroom_messages(message_id) ON DELETE SET NULL,
      UNIQUE (execution_run_id, step_id, profile_id)
    ) STRICT;

    CREATE INDEX IF NOT EXISTS idx_chatroom_agent_turns_room_started
      ON chatroom_agent_turns (room_id, started_at DESC);

    CREATE INDEX IF NOT EXISTS idx_chatroom_agent_turns_thread_started
      ON chatroom_agent_turns (agent_thread_id, started_at DESC);

    CREATE TABLE IF NOT EXISTS chatroom_messages (
      message_id TEXT PRIMARY KEY,
      room_id TEXT NOT NULL,
      main_session_id TEXT,
      execution_run_id TEXT NOT NULL,
      participant_id TEXT,
      agent_thread_id TEXT,
      sequence_no INTEGER NOT NULL,
      round INTEGER NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('system', 'user', 'agent', 'summary')),
      author_id TEXT NOT NULL,
      author_name TEXT NOT NULL,
      created_at TEXT NOT NULL,
      content TEXT NOT NULL,
      FOREIGN KEY (room_id) REFERENCES chatroom_rooms(room_id) ON DELETE CASCADE,
      FOREIGN KEY (execution_run_id) REFERENCES chatroom_execution_runs(execution_run_id) ON DELETE CASCADE,
      FOREIGN KEY (participant_id) REFERENCES chatroom_participants(participant_id) ON DELETE SET NULL,
      FOREIGN KEY (agent_thread_id) REFERENCES chatroom_agent_threads(agent_thread_id) ON DELETE SET NULL,
      UNIQUE (room_id, sequence_no)
    ) STRICT;

    CREATE INDEX IF NOT EXISTS idx_chatroom_messages_room_sequence
      ON chatroom_messages (room_id, sequence_no);

    CREATE INDEX IF NOT EXISTS idx_chatroom_execution_runs_room_started
      ON chatroom_execution_runs (room_id, started_at DESC);

    CREATE TABLE IF NOT EXISTS chatroom_pending_messages (
      pending_message_id TEXT PRIMARY KEY,
      room_id TEXT NOT NULL,
      author_name TEXT NOT NULL,
      content TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
      created_at TEXT NOT NULL,
      claimed_at TEXT,
      processed_execution_run_id TEXT,
      error_text TEXT,
      FOREIGN KEY (room_id) REFERENCES chatroom_rooms(room_id) ON DELETE CASCADE,
      FOREIGN KEY (processed_execution_run_id) REFERENCES chatroom_execution_runs(execution_run_id) ON DELETE SET NULL
    ) STRICT;

    CREATE INDEX IF NOT EXISTS idx_chatroom_pending_room_status_created
      ON chatroom_pending_messages (room_id, status, created_at);

    CREATE TABLE IF NOT EXISTS chatroom_room_leases (
      room_id TEXT PRIMARY KEY,
      lease_token TEXT NOT NULL,
      holder_label TEXT,
      acquired_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      FOREIGN KEY (room_id) REFERENCES chatroom_rooms(room_id) ON DELETE CASCADE
    ) STRICT;
  `);

  ensureChatroomRoomColumn(db, 'speaker_ids_json', 'TEXT');
  ensureChatroomRoomColumn(db, 'room_type', 'TEXT');
  ensureChatroomRoomColumn(db, 'room_blueprint_json', 'TEXT');
  ensureChatroomRoomColumn(db, 'room_state_json', 'TEXT');
  ensureChatroomRoomColumn(db, 'main_session_id', 'TEXT');
  ensureChatroomRoomColumn(db, 'last_execution_run_id', 'TEXT');
  ensureChatroomExecutionRunColumn(db, 'main_session_id', 'TEXT');
  ensureChatroomExecutionRunColumn(db, 'status', 'TEXT');
  ensureChatroomExecutionRunColumn(db, 'error_text', 'TEXT');
  ensureChatroomMessageColumn(db, 'main_session_id', 'TEXT');
  ensureChatroomMessageColumn(db, 'participant_id', 'TEXT');
  ensureChatroomMessageColumn(db, 'agent_thread_id', 'TEXT');
  ensureChatroomAgentTurnColumn(db, 'telemetry_json', 'TEXT');

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_chatroom_execution_runs_main_session_started
      ON chatroom_execution_runs (main_session_id, started_at DESC);
    CREATE INDEX IF NOT EXISTS idx_chatroom_messages_main_session_sequence
      ON chatroom_messages (main_session_id, sequence_no);
  `);

  db.prepare(
    `
      UPDATE chatroom_rooms
      SET speaker_ids_json = ?
      WHERE speaker_ids_json IS NULL
        OR TRIM(speaker_ids_json) = ''
    `,
  ).run(JSON.stringify(args.legacySpeakerIds));

  db.prepare(
    `
      UPDATE chatroom_rooms
      SET room_type = ?
      WHERE room_type IS NULL
         OR TRIM(room_type) = ''
    `,
  ).run(args.defaultRoomType);

  db.prepare(
    `
      UPDATE chatroom_execution_runs
      SET status = 'completed'
      WHERE status IS NULL
         OR TRIM(status) = ''
    `,
  ).run();

  ensureChatroomMainSessions(db);
  ensureChatroomExecutionRunMainSessionBindings(db);
  ensureChatroomMessageMainSessionBindings(db);
// Provider-specific function removed
