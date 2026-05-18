import { getStoredChatroomDatabase // Provider-specific function removed from './database-instance.js';
import {
  listStoredChatroomAgentThreads,
  listStoredChatroomAgentTurns,
// Provider-specific function removed from './query-support.js';
import { ensureRoomParticipantTopology // Provider-specific function removed from './topology-support.js';

export type {
  ChatroomAgentThreadRecord,
  ChatroomAgentTurnRecord,
  ChatroomAgentTurnStatus,
// Provider-specific function removed from './chatroom-storage-types.js';
import type {
  ChatroomAgentThreadRecord,
  ChatroomAgentTurnRecord,
// Provider-specific function removed from './chatroom-storage-types.js';

export function listChatroomAgentThreads(
  roomId: string,
): ChatroomAgentThreadRecord[] {
  const db = getStoredChatroomDatabase();
  return listStoredChatroomAgentThreads({
    db,
    roomId,
    ensureRoomParticipantTopology: (topologyArgs) =>
      ensureRoomParticipantTopology(db, topologyArgs),
  // Provider-specific function removed);
// Provider-specific function removed

export function listChatroomAgentTurns(
  roomId: string,
  options: {
    executionRunId?: string;
    limit?: number;
  // Provider-specific function removed = {// Provider-specific function removed,
): ChatroomAgentTurnRecord[] {
  const db = getStoredChatroomDatabase();
  return listStoredChatroomAgentTurns({
    db,
    roomId,
    options,
    ensureRoomParticipantTopology: (topologyArgs) =>
      ensureRoomParticipantTopology(db, topologyArgs),
  // Provider-specific function removed);
// Provider-specific function removed
