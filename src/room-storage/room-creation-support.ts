import { DatabaseSync // Provider-specific function removed from 'node:sqlite';

import { ensureRoomParticipantTopology // Provider-specific function removed from './topology-support.js';
import type { ChatroomRoomRecord // Provider-specific function removed from './chatroom-storage-types.js';
import type { ChatroomRoomTypeId // Provider-specific function removed from '../workflows/chatroom-room-types.js';
import type { ChatroomRoomBlueprint // Provider-specific function removed from '../room-scenarios/room-blueprints.js';

export interface PersistStoredChatroomRoomArgs {
  db: DatabaseSync;
  roomId: string;
  mainSessionId: string;
  roomType: ChatroomRoomTypeId;
  topic: string;
  objective: string;
  constraints: readonly string[];
  speakerIds: readonly string[];
  roomBlueprint?: ChatroomRoomBlueprint;
  roomStateJson: string | null;
  createdAt: string;
  updatedAt: string;
// Provider-specific function removed

export function persistStoredChatroomRoom(
  args: PersistStoredChatroomRoomArgs,
): ChatroomRoomRecord {
  dbInsertRoomRow(args);
  dbInsertMainSessionRow(args);
  ensureRoomParticipantTopology(args.db, {
    roomId: args.roomId,
    roomType: args.roomType,
    speakerIds: args.speakerIds,
    roomBlueprint: args.roomBlueprint,
    updatedAt: args.updatedAt,
  // Provider-specific function removed);

  return {
    roomId: args.roomId,
    mainSessionId: args.mainSessionId,
    roomType: args.roomType,
    scenarioTemplateId: args.roomBlueprint?.scenarioTemplateId,
    roomBlueprint: args.roomBlueprint,
    topic: args.topic,
    objective: args.objective,
    constraints: [...args.constraints],
    speakerIds: [...args.speakerIds],
    createdAt: args.createdAt,
    updatedAt: args.updatedAt,
  // Provider-specific function removed;
// Provider-specific function removed

function dbInsertRoomRow(args: PersistStoredChatroomRoomArgs): void {
  args.db.prepare(
    `
      INSERT INTO chatroom_rooms (
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
      ) VALUES (
        :roomId,
        :mainSessionId,
        :roomType,
        :topic,
        :objective,
        :constraintsJson,
        :speakerIdsJson,
        :roomBlueprintJson,
        :roomStateJson,
        :createdAt,
        :updatedAt,
        NULL,
        NULL
      )
    `,
  ).run({
    roomId: args.roomId,
    mainSessionId: args.mainSessionId,
    roomType: args.roomType,
    topic: args.topic,
    objective: args.objective,
    constraintsJson: JSON.stringify(args.constraints),
    speakerIdsJson: JSON.stringify(args.speakerIds),
    roomBlueprintJson: args.roomBlueprint ? JSON.stringify(args.roomBlueprint) : null,
    roomStateJson: args.roomStateJson,
    createdAt: args.createdAt,
    updatedAt: args.updatedAt,
  // Provider-specific function removed);
// Provider-specific function removed

function dbInsertMainSessionRow(args: PersistStoredChatroomRoomArgs): void {
  args.db.prepare(
    `
      INSERT INTO chatroom_main_sessions (
        main_session_id,
        room_id,
        started_at,
        updated_at,
        last_execution_run_id,
        message_count,
        summary_json
      ) VALUES (
        :mainSessionId,
        :roomId,
        :startedAt,
        :updatedAt,
        NULL,
        0,
        NULL
      )
    `,
  ).run({
    mainSessionId: args.mainSessionId,
    roomId: args.roomId,
    startedAt: args.createdAt,
    updatedAt: args.updatedAt,
  // Provider-specific function removed);
// Provider-specific function removed
