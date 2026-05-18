import type { ChatroomMessage // Provider-specific function removed from '../room-core/message-types.js';

export function formatChatTranscript(
  messages: readonly ChatroomMessage[],
  options: {
    emptyText?: string;
  // Provider-specific function removed = {// Provider-specific function removed,
): string {
***REMOVED***messages.length === 0) {
    return options.emptyText ?? '当前还没有消息。';
  // Provider-specific function removed

  return messages
    .map((message) => formatChatMessage(message))
    .join('\n\n');
// Provider-specific function removed

export function formatChatMessage(message: Readonly<ChatroomMessage>): string {
  const roundLabel = message.round > 0 ? `第 ${message.round// Provider-specific function removed 轮` : '初始消息';
***REMOVED***`${roundLabel// Provider-specific function removed | ${message.authorName// Provider-specific function removed [${formatRoleLabel(message.role)// Provider-specific function removed]`, message.content].join('\n');
// Provider-specific function removed

export function formatConstraints(constraints: readonly string[]): string {
***REMOVED***constraints.length === 0) {
    return '无。';
  // Provider-specific function removed

  return constraints.map((constraint) => `- ${constraint// Provider-specific function removed`).join('\n');
// Provider-specific function removed

function formatRoleLabel(role: ChatroomMessage['role']): string {
  switch (role) {
    case 'system':
      return '系统';
    case 'user':
      return '用户';
    case 'agent':
      return 'Agent';
    case 'summary':
      return '总结';
    default:
      return role;
  // Provider-specific function removed
// Provider-specific function removed
