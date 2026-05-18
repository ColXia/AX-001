import type { ChatroomRoomLeaseRecord // Provider-specific function removed from './chatroom-storage-types.js';

export class ChatroomRoomBusyError extends Error {
  roomId: string;
  activeLease: ChatroomRoomLeaseRecord;

  constructor(activeLease: ChatroomRoomLeaseRecord) {
    super(
      `Room "${activeLease.roomId// Provider-specific function removed" is already being processed by another execution run (acquired ${activeLease.acquiredAt// Provider-specific function removed, expires ${activeLease.expiresAt// Provider-specific function removed).`,
    );
    this.name = 'ChatroomRoomBusyError';
    this.roomId = activeLease.roomId;
    this.activeLease = activeLease;
  // Provider-specific function removed
// Provider-specific function removed

export function isChatroomRoomBusyError(error: unknown): error is ChatroomRoomBusyError {
  return error instanceof ChatroomRoomBusyError;
// Provider-specific function removed
