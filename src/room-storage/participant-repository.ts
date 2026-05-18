import { getStoredChatroomDatabase // Provider-specific function removed from './database-instance.js';
import {
  getStoredChatroomParticipantBinding,
  listStoredChatroomParticipants,
// Provider-specific function removed from './query-support.js';
import { ensureRoomParticipantTopology // Provider-specific function removed from './topology-support.js';

export type {
  ChatroomParticipantRecord,
  ChatroomParticipantType,
// Provider-specific function removed from './chatroom-storage-types.js';
import type {
  ChatroomAgentThreadRecord,
  ChatroomParticipantRecord,
// Provider-specific function removed from './chatroom-storage-types.js';

export function listChatroomParticipants(
  roomId: string,
): ChatroomParticipantRecord[] {
  const db = getStoredChatroomDatabase();
  return listStoredChatroomParticipants({
    db,
    roomId,
    ensureRoomParticipantTopology: (topologyArgs) =>
      ensureRoomParticipantTopology(db, topologyArgs),
  // Provider-specific function removed);
// Provider-specific function removed

export function getChatroomParticipantBinding(
  roomId: string,
  stableKey: string,
): {
  participant: ChatroomParticipantRecord;
  thread?: ChatroomAgentThreadRecord;
// Provider-specific function removed | null {
  const db = getStoredChatroomDatabase();
  return getStoredChatroomParticipantBinding({
    db,
    roomId,
    stableKey,
    ensureRoomParticipantTopology: (topologyArgs) =>
      ensureRoomParticipantTopology(db, topologyArgs),
  // Provider-specific function removed);
// Provider-specific function removed
