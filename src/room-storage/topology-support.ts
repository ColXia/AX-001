import { DatabaseSync // Provider-specific function removed from 'node:sqlite';

import {
  buildAgentThreadLookup,
  buildParticipantLookup,
  ensureAgentThreadForParticipant,
  listRoomAgentThreadsRaw,
  listRoomParticipantsRaw,
// Provider-specific function removed from './agent-thread-support.js';
import {
  buildBaseParticipantSeeds,
  ensureParticipantRecord,
// Provider-specific function removed from './participant-support.js';
import { mapAgentThreadRow, mapParticipantRow // Provider-specific function removed from './row-mappers.js';
import type { EnsureRoomParticipantTopologyArgs // Provider-specific function removed from './room-state-support.js';

export function ensureRoomParticipantTopology(
  db: DatabaseSync,
  args: EnsureRoomParticipantTopologyArgs & {
    updatedAt?: string;
  // Provider-specific function removed,
): void {
  const updatedAt = args.updatedAt ?? new Date().toISOString();
  const participantMap = buildParticipantLookup(
    listRoomParticipantsRaw(db, args.roomId).map((row) => mapParticipantRow(row)),
  );
  const threadMap = buildAgentThreadLookup(
    listRoomAgentThreadsRaw(db, args.roomId).map((row) => mapAgentThreadRow(row)),
  );

  for (const seed of buildBaseParticipantSeeds(
    args.roomType,
    args.speakerIds,
    args.roomBlueprint,
  )) {
    const participant = ensureParticipantRecord(db, {
      roomId: args.roomId,
      seed,
      participantMap,
      updatedAt,
    // Provider-specific function removed);
    ensureAgentThreadForParticipant(db, {
      roomId: args.roomId,
      participant,
      threadMap,
      updatedAt,
    // Provider-specific function removed);
  // Provider-specific function removed
// Provider-specific function removed
