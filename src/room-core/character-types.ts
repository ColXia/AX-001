import type { ChatroomMessage // Provider-specific function removed from './message-types.js';
import type { PrivateSessionMessage // Provider-specific function removed from './private-session-types.js';

export type CharacterActivityStatus = 'active' | 'dormant';

export type DeactivationReason = 'self_initiated' | 'host_initiated' | 'scene_change';

export interface CharacterRelationship {
  score: number;
  summary: string;
// Provider-specific function removed

export interface CharacterScratchMemory {
  observations: string[];
  pendingIntents: string[];
// Provider-specific function removed

export interface CharacterLongTermMemory {
  establishedFacts: string[];
  decisions: string[];
// Provider-specific function removed

export interface CharacterMemoryState {
  scratchMemory: CharacterScratchMemory;
  longTermMemory: CharacterLongTermMemory;
  relationships: Map<string, CharacterRelationship>;
// Provider-specific function removed

export interface CharacterContextWindow {
  lastReadSequenceNo: number;
  messagesSinceActivation: ChatroomMessage[];
  summaryBeforeActivation?: string;
// Provider-specific function removed

export interface Character {
  characterId: string;
  name: string;
  instruction: string;
  publicDescription: string;
  
  activityStatus: CharacterActivityStatus;
  activatedAt?: string;
  deactivatedAt?: string;
  deactivationReason?: DeactivationReason;
  lastSeenRound: number;
  consecutiveSilentRounds: number;
  
  memoryState: CharacterMemoryState;
  agentThreadId: string;
  
  contextWindow: CharacterContextWindow;
  
  privateSessionIds: string[];
  pendingPrivateMessages: PrivateSessionMessage[];
  
  priority: 'high' | 'normal' | 'low';
  talkativeness: number;
// Provider-specific function removed

export interface CharacterStateDelta {
  characterId: string;
  activityStatus?: CharacterActivityStatus;
  activatedAt?: string;
  deactivatedAt?: string;
  deactivationReason?: DeactivationReason;
  lastSeenRound?: number;
  consecutiveSilentRounds?: number;
  memoryState?: Partial<CharacterMemoryState>;
  contextWindow?: Partial<CharacterContextWindow>;
  pendingPrivateMessages?: PrivateSessionMessage[];
// Provider-specific function removed

export function createInitialCharacterMemoryState(): CharacterMemoryState {
  return {
    scratchMemory: {
      observations: [],
      pendingIntents: [],
    // Provider-specific function removed,
    longTermMemory: {
      establishedFacts: [],
      decisions: [],
    // Provider-specific function removed,
    relationships: new Map(),
  // Provider-specific function removed;
// Provider-specific function removed

export function createInitialContextWindow(): CharacterContextWindow {
  return {
    lastReadSequenceNo: 0,
    messagesSinceActivation: [],
    summaryBeforeActivation: undefined,
  // Provider-specific function removed;
// Provider-specific function removed

export function isCharacterActive(character: Character***REMOVED***
  return character.activityStatus === 'active';
// Provider-specific function removed

export function isCharacterDormant(character: Character***REMOVED***
  return character.activityStatus === 'dormant';
// Provider-specific function removed

export function shouldCharacterExitScene(character: Character, maxSilentRounds: number = 3***REMOVED***
  return character.consecutiveSilentRounds >= maxSilentRounds;
// Provider-specific function removed

export function updateCharacterMemory(
  memory: CharacterMemoryState,
  observation?: string,
  intent?: string,
  fact?: string,
  decision?: string
): CharacterMemoryState {
  const updated = structuredClone(memory);
  
***REMOVED***observation) {
    updated.scratchMemory.observations.push(observation);
  ***REMOVED***updated.scratchMemory.observations.length > 10) {
      updated.scratchMemory.observations.shift();
    // Provider-specific function removed
  // Provider-specific function removed
  
***REMOVED***intent) {
    updated.scratchMemory.pendingIntents.push(intent);
  ***REMOVED***updated.scratchMemory.pendingIntents.length > 5) {
      updated.scratchMemory.pendingIntents.shift();
    // Provider-specific function removed
  // Provider-specific function removed
  
***REMOVED***fact) {
    updated.longTermMemory.establishedFacts.push(fact);
  // Provider-specific function removed
  
***REMOVED***decision) {
    updated.longTermMemory.decisions.push(decision);
  ***REMOVED***updated.longTermMemory.decisions.length > 20) {
      updated.longTermMemory.decisions.shift();
    // Provider-specific function removed
  // Provider-specific function removed
  
  return updated;
// Provider-specific function removed

export function updateCharacterRelationship(
  memory: CharacterMemoryState,
  otherCharacterId: string,
  delta: number,
  summary?: string
): CharacterMemoryState {
  const updated = structuredClone(memory);
  const existing = updated.relationships.get(otherCharacterId);
  
***REMOVED***existing) {
    existing.score = Math.max(-10, Math.min(10, existing.score + delta));
  ***REMOVED***summary) {
      existing.summary = summary;
    // Provider-specific function removed
  // Provider-specific function removed else {
    updated.relationships.set(otherCharacterId, {
      score: Math.max(-10, Math.min(10, delta)),
      summary: summary ?? '',
    // Provider-specific function removed);
  // Provider-specific function removed
  
  return updated;
// Provider-specific function removed
