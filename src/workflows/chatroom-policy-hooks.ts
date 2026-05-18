import { createAgentPolicyHook // Provider-specific function removed from '../core/agent-policy.js';
import type { ChatroomAgentContext // Provider-specific function removed from './chatroom-types.js';

const structuredOutputToolNamePattern = /^submit_[a-z0-9_]+_output$/;

export const chatroomSpeakerPolicyHook = createAgentPolicyHook<
  ChatroomAgentContext,
  'text'
>({
  id: 'chatroom-speaker-policy',
  beforeRun: ({ context // Provider-specific function removed) => {
  ***REMOVED***context?.speakerThreadStatus === 'paused') {
      return {
        action: 'reject',
        reason: `Speaker "${context.speakerName// Provider-specific function removed" is paused in this room and cannot post right now.`,
      // Provider-specific function removed;
    // Provider-specific function removed

  ***REMOVED***context?.speakerThreadStatus === 'errored') {
      return {
        action: 'reject',
        reason: `Speaker "${context.speakerName// Provider-specific function removed" is marked errored in this room and must stay silent until reset.`,
      // Provider-specific function removed;
    // Provider-specific function removed

    return undefined;
  // Provider-specific function removed,
  afterRun: ({ context, output // Provider-specific function removed) => {
    const content = typeof output === 'string' ? output.trim() : '';
  ***REMOVED***!content) {
      return {
        action: 'reject',
        reason: 'Chatroom speakers must return one non-empty text message.',
      // Provider-specific function removed;
    // Provider-specific function removed

    const maxCharacters = context?.maxReplyCharacters ?? (context?.roomBehavior === 'roleplay' ? 2000 : 900);
  ***REMOVED***content.length > maxCharacters) {
      return {
        action: 'reject',
        reason: `Chatroom reply is too long (${content.length// Provider-specific function removed/${maxCharacters// Provider-specific function removed). Keep it concise like a real chat message.`,
        metadata: {
          reasonKind: 'chatroom_overlength',
          maxCharacters,
          actualCharacters: content.length,
        // Provider-specific function removed,
      // Provider-specific function removed;
    // Provider-specific function removed

    return undefined;
  // Provider-specific function removed,
  beforeToolCall: ({ toolName // Provider-specific function removed) => {
  ***REMOVED***isAllowedChatroomTool(toolName)) {
      return undefined;
    // Provider-specific function removed

    return {
      action: 'reject',
      enforcement: 'soft',
      reason:
        'This chatroom turn only allows room-context refresh or structured-output submission tools.',
    // Provider-specific function removed;
  // Provider-specific function removed,
// Provider-specific function removed);

export const chatroomSummaryPolicyHook = createAgentPolicyHook<
  ChatroomAgentContext,
  any
>({
  id: 'chatroom-summary-policy',
  beforeRun: ({ context // Provider-specific function removed) => {
  ***REMOVED***context?.speakerThreadStatus === 'paused') {
      return {
        action: 'reject',
        reason: `Summary participant "${context.speakerName// Provider-specific function removed" is paused in this room and cannot post right now.`,
      // Provider-specific function removed;
    // Provider-specific function removed

    return undefined;
  // Provider-specific function removed,
  beforeToolCall: ({ toolName // Provider-specific function removed) => {
  ***REMOVED***isAllowedChatroomTool(toolName)) {
      return undefined;
    // Provider-specific function removed

    return {
      action: 'reject',
      enforcement: 'soft',
      reason:
        'This summary turn only allows room-context refresh or structured-output submission tools.',
    // Provider-specific function removed;
  // Provider-specific function removed,
// Provider-specific function removed);

function isAllowedChatroomTool(toolName: string***REMOVED***
  return toolName === 'refresh_room_context' || structuredOutputToolNamePattern.test(toolName);
// Provider-specific function removed
