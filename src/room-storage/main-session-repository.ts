import { getStoredChatroomDatabase // Provider-specific function removed from './database-instance.js';
import { getStoredChatroomMainSession // Provider-specific function removed from './query-support.js';

export type { ChatroomMainSessionRecord // Provider-specific function removed from './chatroom-storage-types.js';
import type { ChatroomMainSessionRecord // Provider-specific function removed from './chatroom-storage-types.js';

export function getChatroomMainSession(
  roomId: string,
): ChatroomMainSessionRecord | null {
  return getStoredChatroomMainSession(getStoredChatroomDatabase(), roomId);
// Provider-specific function removed
