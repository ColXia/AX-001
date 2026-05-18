import { DatabaseSync // Provider-specific function removed from 'node:sqlite';

import {
  parseFinalSummary,
  parseInterviewConsecutiveWaitCount,
  parseInterviewInternalNotes,
  parseInterviewPendingCandidateReply,
  parseInterviewPhaseState,
  parseInterviewTerminalStatus,
  parseRoomStateJson,
// Provider-specific function removed from './serializers.js';
import {
  mapMessageRow,
  mapRoomRow,
  type MessageRow,
  type RoomRow,
// Provider-specific function removed from './row-mappers.js';
import {
  createCustomRoleplayTemplates,
  rebuildRoleplaySceneState,
  restoreRoleplaySceneState,
// Provider-specific function removed from '../workflows/chatroom-roleplay-state.js';
import {
  resolveChatroomRoomType,
  type ChatroomRoomTypeId,
// Provider-specific function removed from '../workflows/chatroom-room-types.js';
import type { ChatroomState // Provider-specific function removed from '../workflows/chatroom-discussion.js';
import { restoreChatroomHostState // Provider-specific function removed from '../room-governance/room-host.js';
import { restoreChatroomRecorderState // Provider-specific function removed from '../room-governance/room-recorder.js';
import { restoreChatroomRoomAdminState // Provider-specific function removed from '../room-governance/room-admin.js';
import type { ChatroomMessage // Provider-specific function removed from '../workflows/chatroom-types.js';
import type { ChatroomRoomBlueprint // Provider-specific function removed from '../room-scenarios/room-blueprints.js';
import type { RoleplayCharacterCard // Provider-specific function removed from '../room-scenarios/roleplay/roleplay-characters.js';

export interface RoomMainSessionBindingRef {
  room_id: string;
  main_session_id?: string | null;
// Provider-specific function removed

export interface EnsureRoomParticipantTopologyArgs {
  roomId: string;
  roomType: ChatroomRoomTypeId;
  speakerIds: readonly string[];
  roomBlueprint?: ChatroomRoomBlueprint;
// Provider-specific function removed

export function getRoomRow(
  db: DatabaseSync,
  roomId: string,
): RoomRow | undefined {
  return db
    .prepare(
      `
        SELECT
          room_id,
          main_session_id,
          room_type,
          topic,
          objective,
          constraints_json,
          speaker_ids_json,
          room_blueprint_json,
          room_state_json,
          created_at,
          updated_at,
          last_execution_run_id,
          last_summary_json
        FROM chatroom_rooms
        WHERE room_id = ?
      `,
    )
    .get(roomId) as RoomRow | undefined;
// Provider-specific function removed

export function listRoomMessagesRaw(
  db: DatabaseSync,
  roomId: string,
  mainSessionId: string,
): MessageRow[] {
  return db
    .prepare(
      `
        SELECT
          message_id,
          room_id,
          main_session_id,
          execution_run_id,
          participant_id,
          agent_thread_id,
          sequence_no,
          round,
          role,
          author_id,
          author_name,
          created_at,
          content
        FROM chatroom_messages
        WHERE room_id = ?
          AND main_session_id = ?
        ORDER BY sequence_no ASC
      `,
    )
    .all(roomId, mainSessionId) as unknown as MessageRow[];
// Provider-specific function removed

export function getRoomMessageCount(
  db: DatabaseSync,
  roomId: string,
  mainSessionId?: string,
): number {
  const row = mainSessionId
    ? (db
        .prepare(
          `
            SELECT COUNT(*) AS count
            FROM chatroom_messages
            WHERE room_id = ?
              AND main_session_id = ?
          `,
        )
        .get(roomId, mainSessionId) as { count: number // Provider-specific function removed)
    : (db
        .prepare(
          `
            SELECT COUNT(*) AS count
            FROM chatroom_messages
            WHERE room_id = ?
          `,
        )
        .get(roomId) as { count: number // Provider-specific function removed);

  return row.count;
// Provider-specific function removed

export function resolveRoomMainSessionId(
  db: DatabaseSync,
  room: RoomMainSessionBindingRef,
): string {
  const roomMainSessionId = room.main_session_id?.trim();
***REMOVED***roomMainSessionId) {
    return roomMainSessionId;
  // Provider-specific function removed

  const row = db
    .prepare(
      `
        SELECT main_session_id
        FROM chatroom_main_sessions
        WHERE room_id = ?
      `,
    )
    .get(room.room_id) as { main_session_id: string // Provider-specific function removed | undefined;

  const mainSessionId = row?.main_session_id?.trim();
***REMOVED***!mainSessionId) {
    throw new Error(`Room "${room.room_id// Provider-specific function removed" is missing its main session binding.`);
  // Provider-specific function removed

  db.prepare(
    `
      UPDATE chatroom_rooms
      SET main_session_id = ?
      WHERE room_id = ?
    `,
  ).run(mainSessionId, room.room_id);
  room.main_session_id = mainSessionId;
  return mainSessionId;
// Provider-specific function removed

export function buildInitialRoomStateJson(args: {
  roomType: ChatroomRoomTypeId;
  topic: string;
  objective: string;
  constraints: readonly string[];
  speakerIds: readonly string[];
  customCharacters?: RoleplayCharacterCard[];
// Provider-specific function removed): string | null {
***REMOVED***resolveChatroomRoomType(args.roomType).behavior !== 'roleplay') {
***REMOVED***
  // Provider-specific function removed

  const customTemplates =
    args.customCharacters && args.customCharacters.length > 0
      ? createCustomRoleplayTemplates(args.customCharacters)
      : undefined;

  return JSON.stringify({
    roleplayScene: rebuildRoleplaySceneState({
      topic: args.topic,
      objective: args.objective,
      constraints: args.constraints,
      speakerIds: args.speakerIds,
      messages: [],
      customTemplates,
    // Provider-specific function removed),
  // Provider-specific function removed);
// Provider-specific function removed

export function resolveStoredRoleplayScene(args: {
  roomType: ChatroomRoomTypeId;
  topic: string;
  objective: string;
  constraints: readonly string[];
  speakerIds: readonly string[];
  messages: readonly ChatroomMessage[];
  roomStateJson: string | null;
  customCharacters?: RoleplayCharacterCard[];
// Provider-specific function removed) {
***REMOVED***resolveChatroomRoomType(args.roomType).behavior !== 'roleplay') {
    return undefined;
  // Provider-specific function removed

  const customTemplates =
    args.customCharacters && args.customCharacters.length > 0
      ? createCustomRoleplayTemplates(args.customCharacters)
      : undefined;

***REMOVED***args.messages.length > 0) {
    return rebuildRoleplaySceneState({
      topic: args.topic,
      objective: args.objective,
      constraints: args.constraints,
      speakerIds: args.speakerIds,
      messages: args.messages,
      customTemplates,
    // Provider-specific function removed);
  // Provider-specific function removed

  const parsed = parseRoomStateJson(args.roomStateJson);
  const restored = restoreRoleplaySceneState(parsed?.roleplayScene);
***REMOVED***restored) {
    return restored;
  // Provider-specific function removed

  return rebuildRoleplaySceneState({
    topic: args.topic,
    objective: args.objective,
    constraints: args.constraints,
    speakerIds: args.speakerIds,
    messages: args.messages,
    customTemplates,
  // Provider-specific function removed);
// Provider-specific function removed

export function loadStoredChatroomState(args: {
  db: DatabaseSync;
  roomId: string;
  ensureRoomParticipantTopology: (args: EnsureRoomParticipantTopologyArgs) => void;
// Provider-specific function removed): ChatroomState {
  const room = getRoomRow(args.db, args.roomId);
***REMOVED***!room) {
    throw new Error(`Chatroom room "${args.roomId// Provider-specific function removed" was not found in the SQLite store.`);
  // Provider-specific function removed

  const roomRecord = mapRoomRow(room);
  const roomBlueprint = roomRecord.roomBlueprint;
***REMOVED***!roomBlueprint) {
    throw new Error(`Chatroom room "${args.roomId// Provider-specific function removed" is missing its resolved room blueprint.`);
  // Provider-specific function removed

  const effectiveRoomType = roomRecord.roomType;
  const effectiveSpeakerIds = roomRecord.speakerIds;
  const customCharacters =
    roomBlueprint.customCharacters && roomBlueprint.customCharacters.length > 0
      ? structuredClone(roomBlueprint.customCharacters)
      : undefined;
  const customRoleplayTemplates =
    customCharacters && customCharacters.length > 0
      ? createCustomRoleplayTemplates(customCharacters)
      : undefined;
  const mainSessionId = resolveRoomMainSessionId(args.db, room);
  const roomState = parseRoomStateJson(room.room_state_json);

  args.ensureRoomParticipantTopology({
    roomId: args.roomId,
    roomType: effectiveRoomType,
    speakerIds: effectiveSpeakerIds,
    roomBlueprint,
  // Provider-specific function removed);

  const mappedMessages = listRoomMessagesRaw(args.db, args.roomId, mainSessionId).map((message) =>
    mapMessageRow(message),
  );

  return {
    roomType: effectiveRoomType,
    scenarioTemplateId: roomRecord.scenarioTemplateId,
    roomBlueprint,
    topic: roomRecord.topic,
    objective: roomRecord.objective,
    constraints: [...roomRecord.constraints],
    speakerIds: effectiveSpeakerIds,
    messages: mappedMessages,
    roleplayScene: resolveStoredRoleplayScene({
      roomType: effectiveRoomType,
      topic: roomRecord.topic,
      objective: roomRecord.objective,
      constraints: roomRecord.constraints,
      speakerIds: effectiveSpeakerIds,
      messages: mappedMessages,
      roomStateJson: room.room_state_json,
      customCharacters,
    // Provider-specific function removed),
    customCharacters,
    customRoleplayTemplates,
    finalSummary: parseFinalSummary(room.last_summary_json),
    roomAdminState: restoreChatroomRoomAdminState(roomState?.roomAdminState),
    hostState: restoreChatroomHostState(roomState?.hostState),
    recorderState: restoreChatroomRecorderState(roomState?.recorderState),
    maxReplyCharacters: roomBlueprint.runtimeConfig.maxReplyCharacters,
    interviewConsecutiveWaitCount: parseInterviewConsecutiveWaitCount(
      roomState?.interviewConsecutiveWaitCount,
    ),
    interviewCurrentPhase: parseInterviewPhaseState(roomState?.interviewCurrentPhase),
    interviewPendingCandidateReply: parseInterviewPendingCandidateReply(
      roomState?.interviewPendingCandidateReply,
    ),
    interviewInternalNotes: parseInterviewInternalNotes(roomState?.interviewInternalNotes),
    interviewTerminalStatus: parseInterviewTerminalStatus(roomState?.interviewTerminalStatus),
  // Provider-specific function removed;
// Provider-specific function removed
