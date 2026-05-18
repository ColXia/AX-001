/**
 * Agent Turn Lifecycle
 * 
 * 实现 Agent 的 Observe → Judge → Act → Update 生命周期
 */

import { randomUUID // Provider-specific function removed from 'node:crypto';
import type { AgentRuntime // Provider-specific function removed from '../core/agent-runtime.js';
import type { AgentProfile // Provider-specific function removed from '../core/agent-profile.js';
import type { ChatroomState // Provider-specific function removed from './room-state.js';
import type { ChatroomAgentContext // Provider-specific function removed from './agent-context.js';
import type { ChatroomMessage // Provider-specific function removed from '../room-core/message-types.js';
import {
  type AgentDecision,
  type AgentInternalNote,
  type AgentJudgeOutput,
  type AgentObserveResult,
  type AgentTurnResult,
  type AgentTurnExecutionConfig,
  DEFAULT_AGENT_TURN_CONFIG,
// Provider-specific function removed from '../room-core/agent-decision-types.js';
import { createAgentJudgeProfile // Provider-specific function removed from '../agents/agent-judge-profile.js';
import { agentJudgeSchema // Provider-specific function removed from '../agents/schemas.js';
import { processPrivateMessagesInOutput // Provider-specific function removed from './private-session-manager.js';
import { extractScratchMemoryFromOutput // Provider-specific function removed from '../workflows/chatroom-agent-thread-state.js';
import type { RoleplayCharacterCard // Provider-specific function removed from '../room-scenarios/roleplay/roleplay-characters.js';

export function buildObserveResult(args: {
  state: ChatroomState;
  speakerId: string;
  speakerName: string;
  speakerRole: string;
  config: AgentTurnExecutionConfig;
// Provider-specific function removed): AgentObserveResult {
  const { state, speakerId, config // Provider-specific function removed = args;

  const recentMessages = state.messages
    .slice(-config.observationWindow)
    .map(m => ({
      authorId: m.authorId,
      authorName: m.authorName || m.authorId,
      content: m.content || '',
      round: m.round,
    // Provider-specific function removed));

  const incomingPrivateMessages: AgentObserveResult['incomingPrivateMessages'] = [];
***REMOVED***state.privateSessions) {
    const lastReadRound = state.privateSessionLastReadRound?.get(speakerId) ?? 0;
    for (const session of state.privateSessions.values()) {
    ***REMOVED***!session.participantIds.includes(speakerId)) continue;
      for (const msg of session.messages) {
      ***REMOVED***msg.speakerId !== speakerId && msg.round > lastReadRound) {
          incomingPrivateMessages.push({
            speakerName: msg.speakerName,
            content: msg.content,
          // Provider-specific function removed);
        // Provider-specific function removed
      // Provider-specific function removed
    // Provider-specific function removed
  // Provider-specific function removed

  const roleplaySpeaker = state.roleplayScene?.cast.find(c => c.speakerId === speakerId);

  return {
    recentMessages,
    incomingPrivateMessages,
    agentMemory: {
      scratchMemory: [],
      longTermMemory: [],
    // Provider-specific function removed,
    agentIdentity: {
      name: args.speakerName,
      role: args.speakerRole,
      currentGoal: roleplaySpeaker?.currentGoal,
      publicStatus: roleplaySpeaker?.publicStatus,
    // Provider-specific function removed,
    sceneContext: state.roleplayScene ? {
      setting: undefined,
      atmosphere: undefined,
      currentBeat: undefined,
    // Provider-specific function removed : undefined,
  // Provider-specific function removed;
// Provider-specific function removed

export async function executeJudgePhase(args: {
  agentRuntime: AgentRuntime;
  speakerId: string;
  speakerName: string;
  speakerRole: string;
  context: ChatroomAgentContext;
// Provider-specific function removed): Promise<AgentJudgeOutput> {
  const judgeProfile = createAgentJudgeProfile(args.speakerId, args.speakerName);

  const result = await args.agentRuntime.run(judgeProfile, '请判断是否需要回应。', {
    context: args.context,
  // Provider-specific function removed);

  return result as AgentJudgeOutput;
// Provider-specific function removed

export async function executeRespondPhase(args: {
  agentRuntime: AgentRuntime;
  speakerProfile: AgentProfile<ChatroomAgentContext, 'text'>;
  judgeOutput: AgentJudgeOutput;
  context: ChatroomAgentContext;
// Provider-specific function removed): Promise<string> {
  const promptLines = [
    `你决定要回应。`,
    `原因: ${args.judgeOutput.reasoning// Provider-specific function removed`,
    '',
    '请生成你的回应。保持角色性格，回应要自然、简洁。',
  ];

***REMOVED***args.judgeOutput.shouldRespondTo) {
    promptLines.push(`你要回应的内容: ${args.judgeOutput.shouldRespondTo// Provider-specific function removed`);
  // Provider-specific function removed

  const result = await args.agentRuntime.run(args.speakerProfile, promptLines.join('\n'), {
    context: args.context,
  // Provider-specific function removed);

  return result as string;
// Provider-specific function removed

export function createInternalNote(args: {
  round: number;
  type: AgentInternalNote['type'];
  content: string;
  relatedMessageId?: string;
// Provider-specific function removed): AgentInternalNote {
  return {
    noteId: randomUUID(),
    round: args.round,
    timestamp: new Date().toISOString(),
    type: args.type,
    content: args.content,
    relatedMessageId: args.relatedMessageId,
  // Provider-specific function removed;
// Provider-specific function removed

export function createDecision(args: {
  round: number;
  judgeOutput: AgentJudgeOutput;
// Provider-specific function removed): AgentDecision {
  return {
    round: args.round,
    timestamp: new Date().toISOString(),
    decision: args.judgeOutput.decision,
    reasoning: args.judgeOutput.reasoning,
    urgency: args.judgeOutput.urgency,
    attention: args.judgeOutput.attention,
    shouldRespondTo: args.judgeOutput.shouldRespondTo,
    targetForPrivate: args.judgeOutput.targetForPrivate,
  // Provider-specific function removed;
// Provider-specific function removed

export async function executeAgentTurnLifecycle(args: {
  agentRuntime: AgentRuntime;
  state: ChatroomState;
  speakerProfile: AgentProfile<ChatroomAgentContext, 'text'>;
  speakerId: string;
  speakerName: string;
  speakerRole: string;
  round: number;
  context: ChatroomAgentContext;
  customCharacters?: RoleplayCharacterCard[];
  config?: Partial<AgentTurnExecutionConfig>;
// Provider-specific function removed): Promise<AgentTurnResult> {
  const config = { ...DEFAULT_AGENT_TURN_CONFIG, ...args.config // Provider-specific function removed;
  const internalNotes: AgentInternalNote[] = [];

  // Phase 1: Observe
  const observeResult = buildObserveResult({
    state: args.state,
    speakerId: args.speakerId,
    speakerName: args.speakerName,
    speakerRole: args.speakerRole,
    config,
  // Provider-specific function removed);

***REMOVED***config.enableInternalNotes) {
    const observationNote = createInternalNote({
      round: args.round,
      type: 'observation',
      content: `观察到 ${observeResult.recentMessages.length// Provider-specific function removed 条消息，${observeResult.incomingPrivateMessages.length// Provider-specific function removed 条私人消息`,
    // Provider-specific function removed);
    internalNotes.push(observationNote);
  // Provider-specific function removed

  // Phase 2: Judge
  const judgeOutput = await executeJudgePhase({
    agentRuntime: args.agentRuntime,
    speakerId: args.speakerId,
    speakerName: args.speakerName,
    speakerRole: args.speakerRole,
    context: args.context,
  // Provider-specific function removed);

  const decision = createDecision({
    round: args.round,
    judgeOutput,
  // Provider-specific function removed);

***REMOVED***config.enableInternalNotes) {
    const judgmentNote = createInternalNote({
      round: args.round,
      type: 'judgment',
      content: `决策: ${judgeOutput.decision// Provider-specific function removed，原因: ${judgeOutput.reasoning// Provider-specific function removed，紧迫度: ${judgeOutput.urgency// Provider-specific function removed`,
    // Provider-specific function removed);
    internalNotes.push(judgmentNote);
  // Provider-specific function removed

  // Phase 3: Act
  let publicMessage: string | undefined;
  let privateMessages: AgentTurnResult['privateMessages'];

***REMOVED***judgeOutput.decision === 'respond' && judgeOutput.urgency >= config.silenceThreshold) {
    const rawOutput = await executeRespondPhase({
      agentRuntime: args.agentRuntime,
      speakerProfile: args.speakerProfile,
      judgeOutput,
      context: args.context,
    // Provider-specific function removed);

    const now = new Date().toISOString();
    const { cleanOutput: cleanOutputAfterPrivate, privateMessagesCreated // Provider-specific function removed = processPrivateMessagesInOutput({
      output: rawOutput,
      speakerId: args.speakerId,
      speakerName: args.speakerName,
      state: args.state,
      round: args.round,
      customCharacters: args.customCharacters,
      now,
    // Provider-specific function removed);

    const { cleanOutput // Provider-specific function removed = extractScratchMemoryFromOutput(cleanOutputAfterPrivate);

  ***REMOVED***cleanOutput.trim()) {
      publicMessage = cleanOutput;
    // Provider-specific function removed

  ***REMOVED***privateMessagesCreated.length > 0) {
      privateMessages = privateMessagesCreated.map(m => ({
        targetSpeakerId: m.targetSpeakerId,
        content: m.content,
      // Provider-specific function removed));
    // Provider-specific function removed
  // Provider-specific function removed else if (judgeOutput.decision === 'stay_silent') {
  ***REMOVED***config.enableInternalNotes) {
      const silenceNote = createInternalNote({
        round: args.round,
        type: 'silence_reason',
        content: `保持沉默: ${judgeOutput.reasoning// Provider-specific function removed`,
      // Provider-specific function removed);
      internalNotes.push(silenceNote);
    // Provider-specific function removed
  // Provider-specific function removed

  return {
    speakerId: args.speakerId,
    speakerName: args.speakerName,
    round: args.round,
    decision,
    publicMessage,
    privateMessages,
    internalNotes,
  // Provider-specific function removed;
// Provider-specific function removed

export function applyTurnResultToState(args: {
  state: ChatroomState;
  turnResult: AgentTurnResult;
  customCharacters?: RoleplayCharacterCard[];
// Provider-specific function removed): void {
  const { state, turnResult // Provider-specific function removed = args;
  const now = new Date().toISOString();

  // 追加公开消息
***REMOVED***turnResult.publicMessage) {
    state.messages.push({
      id: randomUUID(),
      role: 'agent',
      authorId: turnResult.speakerId,
      authorName: turnResult.speakerName,
      round: turnResult.round,
      createdAt: now,
      content: turnResult.publicMessage,
    // Provider-specific function removed);
  // Provider-specific function removed

  // 追加私人消息
***REMOVED***turnResult.privateMessages && turnResult.privateMessages.length > 0) {
  ***REMOVED***!state.privateSessions) {
      state.privateSessions = new Map();
    // Provider-specific function removed

    for (const pm of turnResult.privateMessages) {
      const sessionId = `private:${[turnResult.speakerId, pm.targetSpeakerId].sort().join(':')// Provider-specific function removed`;
      let session = state.privateSessions.get(sessionId);

    ***REMOVED***!session) {
        session = {
          schemaVersion: 1,
          sessionId,
          participantIds: [turnResult.speakerId, pm.targetSpeakerId].sort(),
          messages: [],
          createdAt: now,
          lastUpdatedAt: now,
          status: 'active',
          initiatedBy: turnResult.speakerId,
        // Provider-specific function removed;
        state.privateSessions.set(sessionId, session);
      // Provider-specific function removed

      session.messages.push({
        messageId: randomUUID(),
        speakerId: turnResult.speakerId,
        speakerName: turnResult.speakerName,
        targetSpeakerId: pm.targetSpeakerId,
        content: pm.content,
        createdAt: now,
        round: turnResult.round,
      // Provider-specific function removed);
      session.lastUpdatedAt = now;
    // Provider-specific function removed
  // Provider-specific function removed

  // TODO: 追加 internalNotes 到 Agent Thread
  // 这需要在 Agent Thread 存储中添加 internalNotes 字段
// Provider-specific function removed
