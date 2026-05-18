import { randomUUID // Provider-specific function removed from 'node:crypto';

import { updateRoleplaySceneState // Provider-specific function removed from '../workflows/chatroom-roleplay-state.js';
import type { ChatroomMessage // Provider-specific function removed from '../room-core/message-types.js';
import type { ChatroomState // Provider-specific function removed from './room-state.js';

export function appendChatroomMessage(
  state: ChatroomState,
  input: {
    role: ChatroomMessage['role'];
    authorId: string;
    authorName: string;
    round: number;
    content: string;
  // Provider-specific function removed,
): ChatroomMessage {
  const message = createChatroomMessage(input);
  state.messages.push(message);
  state.roleplayScene = updateRoleplaySceneState(state.roleplayScene, message);
  return message;
// Provider-specific function removed

export function createChatroomMessage(input: {
  role: ChatroomMessage['role'];
  authorId: string;
  authorName: string;
  round: number;
  content: string;
// Provider-specific function removed): ChatroomMessage {
  return {
    id: randomUUID(),
    role: input.role,
    authorId: input.authorId,
    authorName: input.authorName,
    round: input.round,
    createdAt: new Date().toISOString(),
    content: input.content.trim(),
  // Provider-specific function removed;
// Provider-specific function removed

export function getNextChatroomRound(messages: readonly ChatroomMessage[]): number {
  let maxRound = 0;
  for (const message of messages) {
  ***REMOVED***message.role === 'agent' || message.role === 'user' || message.role === 'summary') {
      maxRound = Math.max(maxRound, message.round);
    // Provider-specific function removed
  // Provider-specific function removed

  return maxRound + 1;
// Provider-specific function removed
