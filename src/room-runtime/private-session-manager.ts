/**
 * Private Session Manager
 * 
 * 处理私人对话的创建、追加和查询
 */

import { randomUUID // Provider-specific function removed from 'node:crypto';
import type { PrivateSession, PrivateSessionMessage, ParsedPrivateMessage // Provider-specific function removed from '../room-core/private-session-types.js';
import {
  parsePrivateMessages,
  generatePrivateSessionId,
// Provider-specific function removed from '../room-core/private-session-types.js';
import type { ChatroomState // Provider-specific function removed from '../room-runtime/room-state.js';
import type { RoleplayCharacterCard // Provider-specific function removed from '../room-scenarios/roleplay/roleplay-characters.js';

/**
 * 处理角色输出中的私人消息
 * 返回清理后的输出和创建的私人消息
 */
export function processPrivateMessagesInOutput(args: {
  output: string;
  speakerId: string;
  speakerName: string;
  state: ChatroomState;
  round: number;
  customCharacters?: RoleplayCharacterCard[];
  now: string;
// Provider-specific function removed): {
  cleanOutput: string;
  privateMessagesCreated: PrivateSessionMessage[];
// Provider-specific function removed {
  const { privateMessages, cleanOutput // Provider-specific function removed = parsePrivateMessages(args.output);
  
***REMOVED***privateMessages.length === 0) {
    return { cleanOutput: args.output, privateMessagesCreated: [] // Provider-specific function removed;
  // Provider-specific function removed
  
  const privateMessagesCreated: PrivateSessionMessage[] = [];
  
  for (const parsed of privateMessages) {
    const targetSpeakerId = resolveTargetSpeakerId({
      targetName: parsed.targetName,
      speakerId: args.speakerId,
      customCharacters: args.customCharacters,
      state: args.state,
    // Provider-specific function removed);
    
  ***REMOVED***!targetSpeakerId) {
      continue;
    // Provider-specific function removed
    
    const sessionId = generatePrivateSessionId([args.speakerId, targetSpeakerId]);
    
    const message: PrivateSessionMessage = {
      messageId: randomUUID(),
      speakerId: args.speakerId,
      speakerName: args.speakerName,
      targetSpeakerId,
      content: parsed.content,
      createdAt: args.now,
      round: args.round,
    // Provider-specific function removed;
    
    privateMessagesCreated.push(message);
  // Provider-specific function removed
  
  return { cleanOutput, privateMessagesCreated // Provider-specific function removed;
// Provider-specific function removed

/**
 * 将私人消息添加到 state
 */
export function addPrivateMessagesToState(args: {
  state: ChatroomState;
  privateMessages: PrivateSessionMessage[];
  speakerId: string;
  customCharacters?: RoleplayCharacterCard[];
  now: string;
// Provider-specific function removed): void {
***REMOVED***args.privateMessages.length === 0) {
    return;
  // Provider-specific function removed
  
***REMOVED***!args.state.privateSessions) {
    args.state.privateSessions = new Map();
  // Provider-specific function removed
  
  for (const message of args.privateMessages) {
    const targetSpeakerId = message.targetSpeakerId;
    
  ***REMOVED***!targetSpeakerId) {
      continue;
    // Provider-specific function removed
    
    const sessionId = generatePrivateSessionId([args.speakerId, targetSpeakerId]);
    let session = args.state.privateSessions.get(sessionId);
    
  ***REMOVED***!session) {
      session = {
        schemaVersion: 1,
        sessionId,
        participantIds: [args.speakerId, targetSpeakerId].sort(),
        messages: [],
        createdAt: args.now,
        lastUpdatedAt: args.now,
        status: 'active',
        initiatedBy: args.speakerId,
      // Provider-specific function removed;
      args.state.privateSessions.set(sessionId, session);
    // Provider-specific function removed
    
    session.messages.push(message);
    session.lastUpdatedAt = args.now;
  // Provider-specific function removed
// Provider-specific function removed

/**
 * 根据目标名称解析目标角色的 speakerId
 */
function resolveTargetSpeakerId(args: {
  targetName: string;
  speakerId: string;
  customCharacters?: RoleplayCharacterCard[];
  state: ChatroomState;
// Provider-specific function removed): string | null {
  const targetNameLower = args.targetName.toLowerCase().trim();
  
***REMOVED***!args.customCharacters || args.customCharacters.length === 0) {
***REMOVED***
  // Provider-specific function removed
  
  for (const char of args.customCharacters) {
    const charId = char.characterId?.toLowerCase() || '';
    const charName = char.name.toLowerCase();
    
  ***REMOVED***
      charName.includes(targetNameLower) ||
      targetNameLower.includes(charName) ||
      charId.includes(targetNameLower) ||
      targetNameLower.includes(charId)
  ***REMOVED***
      return `custom-rp-${char.characterId// Provider-specific function removed`;
    // Provider-specific function removed
  // Provider-specific function removed
  
  return null;
// Provider-specific function removed

/**
 * 获取角色收到的未读私人消息
 */
export function getIncomingPrivateMessages(args: {
  speakerId: string;
  state: ChatroomState;
// Provider-specific function removed): PrivateSessionMessage[] {
***REMOVED***!args.state.privateSessions) {
  ***REMOVED***];
  // Provider-specific function removed
  
  const lastReadRound = args.state.privateSessionLastReadRound?.get(args.speakerId) ?? 0;
  const incoming: PrivateSessionMessage[] = [];
  
  for (const session of args.state.privateSessions.values()) {
  ***REMOVED***!session.participantIds.includes(args.speakerId)) {
      continue;
    // Provider-specific function removed
    
    for (const msg of session.messages) {
    ***REMOVED***msg.speakerId !== args.speakerId && msg.round > lastReadRound) {
        incoming.push(msg);
      // Provider-specific function removed
    // Provider-specific function removed
  // Provider-specific function removed
  
  return incoming.sort((a, b) => a.round - b.round);
// Provider-specific function removed

/**
 * 标记私人消息为已读
 */
export function markPrivateMessagesAsRead(args: {
  speakerId: string;
  state: ChatroomState;
  round: number;
// Provider-specific function removed): void {
***REMOVED***!args.state.privateSessionLastReadRound) {
    args.state.privateSessionLastReadRound = new Map();
  // Provider-specific function removed
  
  args.state.privateSessionLastReadRound.set(args.speakerId, args.round);
// Provider-specific function removed

/**
 * 构建私人消息的 prompt 提示
 */
export function buildPrivateMessagesPrompt(args: {
  speakerId: string;
  state: ChatroomState;
// Provider-specific function removed): string[] {
  const messages = getIncomingPrivateMessages(args);
  
***REMOVED***messages.length === 0) {
  ***REMOVED***];
  // Provider-specific function removed
  
  const lines: string[] = ['【私人消息】'];
  
  for (const msg of messages) {
    lines.push(`来自 ${msg.speakerName// Provider-specific function removed: "${msg.content// Provider-specific function removed"`);
  // Provider-specific function removed
  
  lines.push('你可以用【私语|目标角色名:回复内容】回复私人消息。');
  
  return lines;
// Provider-specific function removed
