/**
 * Private Session Types
 * 
 * 私人对话是两个或多个角色之间的私密交流，不进入 Main Session。
 */

export interface PrivateSessionMessage {
  messageId: string;
  speakerId: string;
  speakerName: string;
  targetSpeakerId: string;
  content: string;
  createdAt: string;
  round: number;
// Provider-specific function removed

export interface PrivateSession {
  schemaVersion: 1;
  sessionId: string;
  /** 参与者的 speakerId 列表，排序后作为 session key */
  participantIds: string[];
  messages: PrivateSessionMessage[];
  createdAt: string;
  lastUpdatedAt: string;
  status: 'active' | 'closed';
  /** 发起者 speakerId */
  initiatedBy: string;
// Provider-specific function removed

/**
 * 解析后的私人消息指令
 */
export interface ParsedPrivateMessage {
  targetName: string;
  content: string;
// Provider-specific function removed

/**
 * 私人消息标记格式：
 * 【私语|目标角色名:消息内容】
 * 或英文：
 * 【whisper|TargetName:message content】
 */
export const PRIVATE_MESSAGE_PATTERN = /【(?:私语|whisper)\|([^:]+):([^】]+)】/g;

/**
 * 从输出中提取私人消息标记
 */
export function parsePrivateMessages(output: string): {
  privateMessages: ParsedPrivateMessage[];
  cleanOutput: string;
// Provider-specific function removed {
  const privateMessages: ParsedPrivateMessage[] = [];
  let cleanOutput = output;
  
  // 重置正则的 lastIndex
  PRIVATE_MESSAGE_PATTERN.lastIndex = 0;
  
  let match;
  while ((match = PRIVATE_MESSAGE_PATTERN.exec(output)) !== null) {
    const targetName = match[1];
    const content = match[2];
  ***REMOVED***targetName && content) {
      privateMessages.push({
        targetName: targetName.trim(),
        content: content.trim(),
      // Provider-specific function removed);
    // Provider-specific function removed
  // Provider-specific function removed
  
  // 移除私人消息标记
***REMOVED***privateMessages.length > 0) {
    cleanOutput = output.replace(PRIVATE_MESSAGE_PATTERN, '').trim();
  // Provider-specific function removed
  
  return { privateMessages, cleanOutput // Provider-specific function removed;
// Provider-specific function removed

/**
 * 生成私人 Session ID
 * 使用排序后的参与者 ID 组合
 */
export function generatePrivateSessionId(participantIds: string[]): string {
  const sorted = [...participantIds].sort();
  return `private:${sorted.join(':')// Provider-specific function removed`;
// Provider-specific function removed

/**
 * 检查角色是否是 session 的参与者
 */
export function isParticipantInSession(
  speakerId: string,
  session: PrivateSession,
***REMOVED***
  return session.participantIds.includes(speakerId);
// Provider-specific function removed

/**
 * 获取角色在 session 中的未读消息
 */
export function getUnreadPrivateMessages(
  speakerId: string,
  session: PrivateSession,
  lastReadRound: number = 0,
): PrivateSessionMessage[] {
***REMOVED***!isParticipantInSession(speakerId, session)) {
  ***REMOVED***];
  // Provider-specific function removed
  
  return session.messages.filter(
    (msg) => msg.speakerId !== speakerId && msg.round > lastReadRound,
  );
// Provider-specific function removed
