import { randomUUID // Provider-specific function removed from 'node:crypto';
import type { ChatroomMessage // Provider-specific function removed from './message-types.js';
import type { PrivateSession // Provider-specific function removed from './private-session-types.js';

export type RoleplayCharacterStatus = 'active' | 'dormant' | 'exited';

export interface RoleplayCharacterMemory {
  observations: string[];
  pendingIntents: string[];
  establishedFacts: string[];
  decisions: string[];
  relationships: Map<string, { score: number; summary: string // Provider-specific function removed>;
// Provider-specific function removed

export interface RoleplayCharacter {
  characterId: string;
  name: string;
  instruction: string;
  publicDescription: string;
  status: RoleplayCharacterStatus;
  priority: 'high' | 'normal' | 'low';
  talkativeness: number;
  memory: RoleplayCharacterMemory;
  agentThreadId: string;
  lastActiveRound: number;
  consecutiveSilentRounds: number;
  activatedAt?: string;
  deactivatedAt?: string;
// Provider-specific function removed

export interface RoleplayScene {
  setting: string;
  atmosphere: string;
  currentBeat?: string;
// Provider-specific function removed

export interface RoleplayRoomState {
  roomId: string;
  mainSessionId: string;
  topic: string;
  objective: string;
  scene: RoleplayScene;
  characters: Map<string, RoleplayCharacter>;
  messages: ChatroomMessage[];
  privateSessions: Map<string, PrivateSession>;
  privateSessionLastReadRound: Map<string, number>;
  currentRound: number;
  createdAt: string;
  updatedAt: string;
// Provider-specific function removed

export interface RoleplayRoomConfig {
  topic: string;
  objective: string;
  scene: RoleplayScene;
  characters: RoleplayCharacter[];
// Provider-specific function removed

export function createInitialRoleplayCharacterMemory(): RoleplayCharacterMemory {
  return {
    observations: [],
    pendingIntents: [],
    establishedFacts: [],
    decisions: [],
    relationships: new Map(),
  // Provider-specific function removed;
// Provider-specific function removed

export function createRoleplayCharacter(input: {
  id: string;
  name: string;
  instruction: string;
  publicDescription: string;
  priority?: 'high' | 'normal' | 'low';
  talkativeness?: number;
  initialMemory?: Partial<RoleplayCharacterMemory>;
  initialRelationships?: Array<{ targetId: string; score: number; summary: string // Provider-specific function removed>;
// Provider-specific function removed): RoleplayCharacter {
  const memory = createInitialRoleplayCharacterMemory();
  
***REMOVED***input.initialMemory) {
    memory.observations = input.initialMemory.observations ?? [];
    memory.pendingIntents = input.initialMemory.pendingIntents ?? [];
    memory.establishedFacts = input.initialMemory.establishedFacts ?? [];
    memory.decisions = input.initialMemory.decisions ?? [];
  // Provider-specific function removed
  
***REMOVED***input.initialRelationships) {
    for (const rel of input.initialRelationships) {
      memory.relationships.set(rel.targetId, {
        score: rel.score,
        summary: rel.summary,
      // Provider-specific function removed);
    // Provider-specific function removed
  // Provider-specific function removed
  
  return {
    characterId: input.id,
    name: input.name,
    instruction: input.instruction,
    publicDescription: input.publicDescription,
    status: 'active',
    priority: input.priority ?? 'normal',
    talkativeness: input.talkativeness ?? 0.5,
    memory,
    agentThreadId: `thread-${input.id// Provider-specific function removed`,
    lastActiveRound: 0,
    consecutiveSilentRounds: 0,
  // Provider-specific function removed;
// Provider-specific function removed

export function createRoleplayRoomState(config: RoleplayRoomConfig): RoleplayRoomState {
  const now = new Date().toISOString();
  const roomId = randomUUID();
  const mainSessionId = randomUUID();
  
  const characters = new Map<string, RoleplayCharacter>();
  for (const character of config.characters) {
    characters.set(character.characterId, character);
  // Provider-specific function removed
  
  return {
    roomId,
    mainSessionId,
    topic: config.topic,
    objective: config.objective,
    scene: config.scene,
    characters,
    messages: [],
    privateSessions: new Map(),
    privateSessionLastReadRound: new Map(),
    currentRound: 0,
    createdAt: now,
    updatedAt: now,
  // Provider-specific function removed;
// Provider-specific function removed

export function getActiveCharacters(state: RoleplayRoomState): RoleplayCharacter[] {
  return Array.from(state.characters.values()).filter(c => c.status === 'active');
// Provider-specific function removed

export function getDormantCharacters(state: RoleplayRoomState): RoleplayCharacter[] {
  return Array.from(state.characters.values()).filter(c => c.status === 'dormant');
// Provider-specific function removed

export function activateCharacter(
  state: RoleplayRoomState,
  characterId: string,
  round: number
): RoleplayRoomState {
  const character = state.characters.get(characterId);
***REMOVED***!character) return state;
  
  const updated = new Map(state.characters);
  updated.set(characterId, {
    ...character,
    status: 'active',
    activatedAt: new Date().toISOString(),
    deactivatedAt: undefined,
    lastActiveRound: round,
    consecutiveSilentRounds: 0,
  // Provider-specific function removed);
  
  return {
    ...state,
    characters: updated,
    updatedAt: new Date().toISOString(),
  // Provider-specific function removed;
// Provider-specific function removed

export function deactivateCharacter(
  state: RoleplayRoomState,
  characterId: string,
  reason: 'self_initiated' | 'host_initiated' | 'scene_change'
): RoleplayRoomState {
  const character = state.characters.get(characterId);
***REMOVED***!character) return state;
  
  const updated = new Map(state.characters);
  updated.set(characterId, {
    ...character,
    status: 'dormant',
    deactivatedAt: new Date().toISOString(),
  // Provider-specific function removed);
  
  return {
    ...state,
    characters: updated,
    updatedAt: new Date().toISOString(),
  // Provider-specific function removed;
// Provider-specific function removed

export function addMessageToState(
  state: RoleplayRoomState,
  message: Omit<ChatroomMessage, 'id' | 'createdAt'>
): RoleplayRoomState {
  const newMessage: ChatroomMessage = {
    ...message,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  // Provider-specific function removed;
  
  return {
    ...state,
    messages: [...state.messages, newMessage],
    updatedAt: new Date().toISOString(),
  // Provider-specific function removed;
// Provider-specific function removed

export function updateCharacterMemory(
  state: RoleplayRoomState,
  characterId: string,
  updates: {
    observation?: string;
    fact?: string;
    decision?: string;
    intent?: string;
  // Provider-specific function removed
): RoleplayRoomState {
  const character = state.characters.get(characterId);
***REMOVED***!character) return state;
  
  const memory = { ...character.memory // Provider-specific function removed;
  
***REMOVED***updates.observation) {
    memory.observations = [...memory.observations, updates.observation].slice(-10);
  // Provider-specific function removed
***REMOVED***updates.fact) {
    memory.establishedFacts = [...memory.establishedFacts, updates.fact];
  // Provider-specific function removed
***REMOVED***updates.decision) {
    memory.decisions = [...memory.decisions, updates.decision].slice(-20);
  // Provider-specific function removed
***REMOVED***updates.intent) {
    memory.pendingIntents = [...memory.pendingIntents, updates.intent].slice(-5);
  // Provider-specific function removed
  
  const updated = new Map(state.characters);
  updated.set(characterId, {
    ...character,
    memory,
  // Provider-specific function removed);
  
  return {
    ...state,
    characters: updated,
    updatedAt: new Date().toISOString(),
  // Provider-specific function removed;
// Provider-specific function removed

export function updateCharacterRelationship(
  state: RoleplayRoomState,
  characterId: string,
  targetId: string,
  delta: number,
  summary?: string
): RoleplayRoomState {
  const character = state.characters.get(characterId);
***REMOVED***!character) return state;
  
  const relationships = new Map(character.memory.relationships);
  const existing = relationships.get(targetId);
  
***REMOVED***existing) {
    relationships.set(targetId, {
      score: Math.max(-10, Math.min(10, existing.score + delta)),
      summary: summary ?? existing.summary,
    // Provider-specific function removed);
  // Provider-specific function removed else {
    relationships.set(targetId, {
      score: Math.max(-10, Math.min(10, delta)),
      summary: summary ?? '',
    // Provider-specific function removed);
  // Provider-specific function removed
  
  const updated = new Map(state.characters);
  updated.set(characterId, {
    ...character,
    memory: {
      ...character.memory,
      relationships,
    // Provider-specific function removed,
  // Provider-specific function removed);
  
  return {
    ...state,
    characters: updated,
    updatedAt: new Date().toISOString(),
  // Provider-specific function removed;
// Provider-specific function removed

export function incrementRound(state: RoleplayRoomState): RoleplayRoomState {
  return {
    ...state,
    currentRound: state.currentRound + 1,
    updatedAt: new Date().toISOString(),
  // Provider-specific function removed;
// Provider-specific function removed

export function recordCharacterTurn(
  state: RoleplayRoomState,
  characterId: string,
  spoke: boolean,
  round: number
): RoleplayRoomState {
  const character = state.characters.get(characterId);
***REMOVED***!character) return state;
  
  const updated = new Map(state.characters);
  updated.set(characterId, {
    ...character,
    lastActiveRound: round,
    consecutiveSilentRounds: spoke ? 0 : character.consecutiveSilentRounds + 1,
  // Provider-specific function removed);
  
  return {
    ...state,
    characters: updated,
    updatedAt: new Date().toISOString(),
  // Provider-specific function removed;
// Provider-specific function removed
