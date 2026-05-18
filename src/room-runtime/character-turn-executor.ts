import type { Character, CharacterMemoryState // Provider-specific function removed from '../room-core/character-types.js';
import type { ChatroomState // Provider-specific function removed from './room-state.js';
import type { ChatroomMessage // Provider-specific function removed from '../room-core/message-types.js';
import type { AgentDecision, AgentTurnResult, AgentJudgeOutput // Provider-specific function removed from '../room-core/agent-decision-types.js';
import type { PrivateSessionMessage // Provider-specific function removed from '../room-core/private-session-types.js';
import { randomUUID // Provider-specific function removed from 'node:crypto';

export interface CharacterContext {
  recentMessages: ChatroomMessage[];
  messagesSinceActivation: ChatroomMessage[];
  summaryBeforeActivation?: string;
  privateMessages: PrivateSessionMessage[];
  memoryState: CharacterMemoryState;
// Provider-specific function removed

export interface CharacterTurnConfig {
  character: Character;
  context: CharacterContext;
  state: ChatroomState;
  round: number;
  agentId: string;
// Provider-specific function removed

export interface CharacterTurnResult {
  characterId: string;
  decision: AgentJudgeOutput;
  turnResult?: AgentTurnResult;
  latencyMs: number;
  error?: string;
// Provider-specific function removed

export function buildCharacterContext(
  character: Character,
  state: ChatroomState,
  windowSize: number = 20
): CharacterContext {
  const windowStart = Math.max(0, state.messages.length - windowSize);
  const recentMessages = state.messages.slice(windowStart);
  
  const activationRound = character.activatedAt
    ? parseInt(character.activatedAt.split('-')[0] ?? '0', 10)
    : 0;
  
  const messagesSinceActivation = state.messages.filter(
    (m: ChatroomMessage) => m.round >= activationRound
  );
  
  const pendingPrivate: PrivateSessionMessage[] = [];
***REMOVED***state.privateSessions) {
    for (const session of state.privateSessions.values()) {
    ***REMOVED***session.participantIds.includes(character.characterId)) {
        const lastRead = state.privateSessionLastReadRound?.get(character.characterId) ?? 0;
        for (const msg of session.messages) {
        ***REMOVED***msg.round > lastRead && msg.speakerId !== character.characterId) {
            pendingPrivate.push(msg);
          // Provider-specific function removed
        // Provider-specific function removed
      // Provider-specific function removed
    // Provider-specific function removed
  // Provider-specific function removed
  
  return {
    recentMessages,
    messagesSinceActivation,
    summaryBeforeActivation: character.contextWindow.summaryBeforeActivation,
    privateMessages: pendingPrivate,
    memoryState: character.memoryState,
  // Provider-specific function removed;
// Provider-specific function removed

export async function executeCharacterTurn(
  config: CharacterTurnConfig
): Promise<CharacterTurnResult> {
  const startTime = Date.now();
  
  try {
    const judgeOutput: AgentJudgeOutput = {
      decision: 'stay_silent',
      reasoning: 'Character turn execution not yet integrated with AgentRuntime',
      urgency: 0,
      attention: [],
    // Provider-specific function removed;
    
    const now = new Date().toISOString();
    const decision: AgentDecision = {
      round: config.round,
      timestamp: now,
      decision: judgeOutput.decision,
      reasoning: judgeOutput.reasoning,
      urgency: judgeOutput.urgency,
      attention: judgeOutput.attention,
    // Provider-specific function removed;
    
    const turnResult: AgentTurnResult = {
      speakerId: config.character.characterId,
      speakerName: config.character.name,
      round: config.round,
      decision,
      internalNotes: [],
    // Provider-specific function removed;
    
    const latencyMs = Date.now() - startTime;
    
    return {
      characterId: config.character.characterId,
      decision: judgeOutput,
      turnResult,
      latencyMs,
    // Provider-specific function removed;
  // Provider-specific function removed catch (error) {
    const latencyMs = Date.now() - startTime;
    
    return {
      characterId: config.character.characterId,
      decision: {
        decision: 'stay_silent',
        reasoning: `Error during turn execution: ${error// Provider-specific function removed`,
        urgency: 0,
        attention: [],
      // Provider-specific function removed,
      latencyMs,
      error: String(error),
    // Provider-specific function removed;
  // Provider-specific function removed
// Provider-specific function removed

export function applyCharacterTurnResult(
  character: Character,
  result: CharacterTurnResult,
  state: ChatroomState,
  round: number
): { character: Character; state: ChatroomState // Provider-specific function removed {
  const updatedCharacter = { ...character // Provider-specific function removed;
  
  updatedCharacter.lastSeenRound = round;
  
***REMOVED***result.decision.decision === 'stay_silent') {
    updatedCharacter.consecutiveSilentRounds += 1;
  // Provider-specific function removed else {
    updatedCharacter.consecutiveSilentRounds = 0;
  // Provider-specific function removed
  
***REMOVED***result.turnResult?.publicMessage) {
    const newMessage: ChatroomMessage = {
      id: randomUUID(),
      role: 'agent',
      authorId: character.characterId,
      authorName: character.name,
      round,
      createdAt: new Date().toISOString(),
      content: result.turnResult.publicMessage,
    // Provider-specific function removed;
    
    state = {
      ...state,
      messages: [...state.messages, newMessage],
    // Provider-specific function removed;
  // Provider-specific function removed
  
***REMOVED***result.turnResult?.privateMessages && result.turnResult.privateMessages.length > 0) {
  ***REMOVED***!state.privateSessions) {
      state.privateSessions = new Map();
    // Provider-specific function removed
    
    for (const pm of result.turnResult.privateMessages) {
      const sessionId = `private:${[character.characterId, pm.targetSpeakerId].sort().join(':')// Provider-specific function removed`;
      let session = state.privateSessions.get(sessionId);
      
    ***REMOVED***!session) {
        session = {
          schemaVersion: 1,
          sessionId,
          participantIds: [character.characterId, pm.targetSpeakerId].sort(),
          messages: [],
          createdAt: new Date().toISOString(),
          lastUpdatedAt: new Date().toISOString(),
          status: 'active',
          initiatedBy: character.characterId,
        // Provider-specific function removed;
        state.privateSessions.set(sessionId, session);
      // Provider-specific function removed
      
      const privateMsg: PrivateSessionMessage = {
        messageId: randomUUID(),
        speakerId: character.characterId,
        speakerName: character.name,
        targetSpeakerId: pm.targetSpeakerId,
        content: pm.content,
        createdAt: new Date().toISOString(),
        round,
      // Provider-specific function removed;
      
      session.messages.push(privateMsg);
      session.lastUpdatedAt = new Date().toISOString();
    // Provider-specific function removed
  // Provider-specific function removed
  
***REMOVED***result.turnResult?.internalNotes && result.turnResult.internalNotes.length > 0) {
    const observations = result.turnResult.internalNotes
      .filter(n => n.type === 'observation')
      .map(n => n.content);
    
  ***REMOVED***observations.length > 0) {
      updatedCharacter.memoryState = updateMemoryFromObservations(
        updatedCharacter.memoryState,
        observations
      );
    // Provider-specific function removed
  // Provider-specific function removed
  
  return { character: updatedCharacter, state // Provider-specific function removed;
// Provider-specific function removed

function updateMemoryFromObservations(
  memory: CharacterMemoryState,
  observations: string[]
): CharacterMemoryState {
  const updated = structuredClone(memory);
  
  updated.scratchMemory.observations = [
    ...updated.scratchMemory.observations.slice(-5),
    ...observations,
  ].slice(-10);
  
  return updated;
// Provider-specific function removed

export function shouldCharacterActivate(
  character: Character,
  newPrivateMessages: PrivateSessionMessage[]
***REMOVED***
***REMOVED***character.activityStatus === 'active') {
    return false;
  // Provider-specific function removed
  
***REMOVED***newPrivateMessages.length === 0) {
    return false;
  // Provider-specific function removed
  
  const content = newPrivateMessages.map((m: PrivateSessionMessage) => m.content).join(' ');
  
  const urgentKeywords = /紧急|危险|救命|快|重要/;
  const inviteKeywords = /来|进来|一起|加入/;
  const mentionPattern = new RegExp(character.name, 'i');
  
***REMOVED***urgentKeywords.test(content)) {
    return true;
  // Provider-specific function removed
  
***REMOVED***inviteKeywords.test(content)) {
    return true;
  // Provider-specific function removed
  
***REMOVED***mentionPattern.test(content)) {
    return true;
  // Provider-specific function removed
  
  return false;
// Provider-specific function removed

export function activateCharacter(
  character: Character,
  round: number,
  reason: string
): Character {
  return {
    ...character,
    activityStatus: 'active',
    activatedAt: `${round// Provider-specific function removed-${Date.now()// Provider-specific function removed`,
    deactivatedAt: undefined,
    deactivationReason: undefined,
    consecutiveSilentRounds: 0,
    contextWindow: {
      ...character.contextWindow,
      messagesSinceActivation: [],
      summaryBeforeActivation: reason,
    // Provider-specific function removed,
  // Provider-specific function removed;
// Provider-specific function removed

export function deactivateCharacter(
  character: Character,
  round: number,
  reason: 'self_initiated' | 'host_initiated' | 'scene_change'
): Character {
  return {
    ...character,
    activityStatus: 'dormant',
    deactivatedAt: `${round// Provider-specific function removed-${Date.now()// Provider-specific function removed`,
    deactivationReason: reason,
  // Provider-specific function removed;
// Provider-specific function removed
