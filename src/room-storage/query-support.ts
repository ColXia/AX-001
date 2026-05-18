import { DatabaseSync // Provider-specific function removed from 'node:sqlite';

import {
  listRoomAgentThreadsRaw,
  listRoomParticipantsRaw,
// Provider-specific function removed from './agent-thread-support.js';
import {
  mapAgentThreadRow,
  mapAgentTurnRow,
  mapExecutionRunRow,
  mapMainSessionRow,
  mapParticipantRow,
  mapRoomListRow,
  mapRoomRow,
  type ExecutionRunRow,
  type MainSessionRow,
  type RoomRow,
  type AgentTurnRow,
  type ParticipantRow,
// Provider-specific function removed from './row-mappers.js';
import {
  getRoomRow,
  type EnsureRoomParticipantTopologyArgs,
// Provider-specific function removed from './room-state-support.js';
import type {
  ChatroomAgentThreadRecord,
  ChatroomAgentTurnRecord,
  ChatroomExecutionRunRecord,
  ChatroomMainSessionRecord,
  ChatroomParticipantRecord,
  ChatroomRoomListItem,
  ChatroomRoomRecord,
// Provider-specific function removed from './chatroom-storage-types.js';

export function getStoredChatroomMainSession(
  db: DatabaseSync,
  roomId: string,
): ChatroomMainSessionRecord | null {
  const room = getRoomRow(db, roomId);
***REMOVED***!room) {
***REMOVED***
  // Provider-specific function removed

  const row = db
    .prepare(
      `
        SELECT
          main_session_id,
          room_id,
          started_at,
          updated_at,
          last_execution_run_id,
          message_count,
          summary_json
        FROM chatroom_main_sessions
        WHERE room_id = ?
      `,
    )
    .get(roomId) as MainSessionRow | undefined;

***REMOVED***row) {
    return mapMainSessionRow(row);
  // Provider-specific function removed

  const fallbackMainSessionId = room.main_session_id?.trim();
***REMOVED***!fallbackMainSessionId) {
***REMOVED***
  // Provider-specific function removed

  const fallback = db
    .prepare(
      `
        SELECT
          main_session_id,
          room_id,
          started_at,
          updated_at,
          last_execution_run_id,
          message_count,
          summary_json
        FROM chatroom_main_sessions
        WHERE main_session_id = ?
      `,
    )
    .get(fallbackMainSessionId) as MainSessionRow | undefined;

  return fallback ? mapMainSessionRow(fallback) : null;
// Provider-specific function removed

export function listStoredChatroomRooms(
  db: DatabaseSync,
  limit = 24,
): ChatroomRoomListItem[] {
  const rooms = db
    .prepare(
      `
        SELECT
          room.room_id,
          room.main_session_id,
          room.room_type,
          room.topic,
          room.objective,
          room.constraints_json,
          room.speaker_ids_json,
          room.room_blueprint_json,
          room.room_state_json,
          room.created_at,
          room.updated_at,
          room.last_execution_run_id,
          room.last_summary_json,
          (
            SELECT COALESCE(main_session.message_count, 0)
            FROM chatroom_main_sessions AS main_session
            WHERE main_session.room_id = room.room_id
          ) AS message_count,
          (
            SELECT COUNT(*)
            FROM chatroom_execution_runs AS run
            WHERE run.room_id = room.room_id
          ) AS run_count
        FROM chatroom_rooms AS room
        ORDER BY room.updated_at DESC
        LIMIT ?
      `,
    )
    .all(limit) as unknown as RoomRow[];

  return rooms.map((room) => mapRoomListRow(room));
// Provider-specific function removed

export function listStoredChatroomExecutionRuns(
  db: DatabaseSync,
  roomId: string,
  limit = 8,
): ChatroomExecutionRunRecord[] {
  const runs = db
    .prepare(
      `
        SELECT
          execution_run_id,
          room_id,
          main_session_id,
          status,
          resumed_from_run_id,
          started_at,
          ended_at,
          rounds,
          base_message_count,
          new_message_count,
          human_author_name,
          human_message,
          artifact_directory,
          summary_json,
          error_text
        FROM chatroom_execution_runs
        WHERE room_id = ?
        ORDER BY started_at DESC
        LIMIT ?
      `,
    )
    .all(roomId, limit) as unknown as ExecutionRunRow[];

  return runs.map((run) => mapExecutionRunRow(run));
// Provider-specific function removed

export function resolveStoredRoomIdForExecutionRun(
  db: DatabaseSync,
  executionRunId: string,
): string | null {
  const row = db
    .prepare(
      `
        SELECT room_id
        FROM chatroom_execution_runs
        WHERE execution_run_id = ?
      `,
    )
    .get(executionRunId) as { room_id: string // Provider-specific function removed | undefined;

  return row?.room_id ?? null;
// Provider-specific function removed

export function listStoredChatroomParticipants(args: {
  db: DatabaseSync;
  roomId: string;
  ensureRoomParticipantTopology: (args: EnsureRoomParticipantTopologyArgs) => void;
// Provider-specific function removed): ChatroomParticipantRecord[] {
***REMOVED***!getStoredRoomForTopology(args)) {
  ***REMOVED***];
  // Provider-specific function removed

  return listRoomParticipantsRaw(args.db, args.roomId)
    .map((row) => mapParticipantRow(row));
// Provider-specific function removed

export function listStoredChatroomAgentThreads(args: {
  db: DatabaseSync;
  roomId: string;
  ensureRoomParticipantTopology: (args: EnsureRoomParticipantTopologyArgs) => void;
// Provider-specific function removed): ChatroomAgentThreadRecord[] {
***REMOVED***!getStoredRoomForTopology(args)) {
  ***REMOVED***];
  // Provider-specific function removed

  return listRoomAgentThreadsRaw(args.db, args.roomId)
    .map((row) => mapAgentThreadRow(row));
// Provider-specific function removed

export function listStoredChatroomAgentTurns(args: {
  db: DatabaseSync;
  roomId: string;
  options?: {
    executionRunId?: string;
    limit?: number;
  // Provider-specific function removed;
  ensureRoomParticipantTopology: (args: EnsureRoomParticipantTopologyArgs) => void;
// Provider-specific function removed): ChatroomAgentTurnRecord[] {
***REMOVED***!getStoredRoomForTopology(args)) {
  ***REMOVED***];
  // Provider-specific function removed

  const limit = Math.max(1, args.options?.limit ?? 64);
  const rows = args.options?.executionRunId
    ? (args.db
        .prepare(
          `
            SELECT
              turn.agent_turn_id,
              turn.room_id,
              turn.execution_run_id,
              turn.participant_id,
              turn.agent_thread_id,
              turn.message_id,
              turn.message_sequence_no,
              turn.step_id,
              turn.step_kind,
              turn.branch_id,
              turn.profile_id,
              turn.round,
              turn.status,
              turn.started_at,
              turn.ended_at,
              turn.input_preview,
              turn.output_text,
              turn.output_json,
              turn.usage_json,
              turn.telemetry_json,
              turn.error_text,
              participant.stable_key AS participant_stable_key,
              participant.display_name AS participant_display_name,
              participant.participant_type AS participant_type
            FROM chatroom_agent_turns AS turn
            JOIN chatroom_participants AS participant
              ON participant.participant_id = turn.participant_id
            WHERE turn.room_id = ?
              AND turn.execution_run_id = ?
            ORDER BY turn.started_at DESC, turn.agent_turn_id DESC
            LIMIT ?
          `,
        )
        .all(args.roomId, args.options.executionRunId, limit) as unknown as AgentTurnRow[])
    : (args.db
        .prepare(
          `
            SELECT
              turn.agent_turn_id,
              turn.room_id,
              turn.execution_run_id,
              turn.participant_id,
              turn.agent_thread_id,
              turn.message_id,
              turn.message_sequence_no,
              turn.step_id,
              turn.step_kind,
              turn.branch_id,
              turn.profile_id,
              turn.round,
              turn.status,
              turn.started_at,
              turn.ended_at,
              turn.input_preview,
              turn.output_text,
              turn.output_json,
              turn.usage_json,
              turn.telemetry_json,
              turn.error_text,
              participant.stable_key AS participant_stable_key,
              participant.display_name AS participant_display_name,
              participant.participant_type AS participant_type
            FROM chatroom_agent_turns AS turn
            JOIN chatroom_participants AS participant
              ON participant.participant_id = turn.participant_id
            WHERE turn.room_id = ?
            ORDER BY turn.started_at DESC, turn.agent_turn_id DESC
            LIMIT ?
          `,
        )
        .all(args.roomId, limit) as unknown as AgentTurnRow[]);

  return rows.map((row) => mapAgentTurnRow(row));
// Provider-specific function removed

export function getStoredChatroomParticipantBinding(args: {
  db: DatabaseSync;
  roomId: string;
  stableKey: string;
  ensureRoomParticipantTopology: (args: EnsureRoomParticipantTopologyArgs) => void;
// Provider-specific function removed): 
  | {
      participant: ChatroomParticipantRecord;
      thread?: ChatroomAgentThreadRecord;
    // Provider-specific function removed
  | null {
***REMOVED***!getStoredRoomForTopology(args)) {
***REMOVED***
  // Provider-specific function removed

  const participantRow = args.db
    .prepare(
      `
        SELECT
          participant_id,
          room_id,
          participant_type,
          stable_key,
          profile_id,
          display_name,
          role_label,
          identity_snapshot_json,
          state_json,
          joined_at,
          updated_at,
          archived_at
        FROM chatroom_participants
        WHERE room_id = ?
          AND stable_key = ?
        LIMIT 1
      `,
    )
    .get(args.roomId, args.stableKey) as ParticipantRow | undefined;

***REMOVED***!participantRow) {
***REMOVED***
  // Provider-specific function removed

  const participant = mapParticipantRow(participantRow);
  const threadRow = listRoomAgentThreadsRaw(args.db, args.roomId).find(
    (row) => row.participant_id === participant.participantId,
  );

  return {
    participant,
    thread: threadRow ? mapAgentThreadRow(threadRow) : undefined,
  // Provider-specific function removed;
// Provider-specific function removed

function getStoredRoomForTopology(args: {
  db: DatabaseSync;
  roomId: string;
  ensureRoomParticipantTopology: (args: EnsureRoomParticipantTopologyArgs) => void;
// Provider-specific function removed): ChatroomRoomRecord | null {
  const roomRow = getRoomRow(args.db, args.roomId);
***REMOVED***!roomRow) {
***REMOVED***
  // Provider-specific function removed

  const room = mapRoomRow(roomRow);
  args.ensureRoomParticipantTopology({
    roomId: args.roomId,
    roomType: room.roomType,
    speakerIds: room.speakerIds,
    roomBlueprint: room.roomBlueprint,
  // Provider-specific function removed);
  return room;
// Provider-specific function removed
