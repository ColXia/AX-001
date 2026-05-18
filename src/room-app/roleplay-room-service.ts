import { DatabaseSync // Provider-specific function removed from 'node:sqlite';
import { getStoredChatroomDatabase // Provider-specific function removed from '../room-storage/database-instance.js';
import {
  ensureRoleplayTables,
  persistRoleplayRoom,
  loadRoleplayRoom,
  deleteRoleplayRoom,
  listRoleplayRooms,
// Provider-specific function removed from '../room-storage/roleplay-room-repository.js';
import {
  createRoleplayRoomState,
  createRoleplayCharacter,
  type RoleplayRoomState,
  type RoleplayCharacter,
  type RoleplayScene,
  type RoleplayRoomConfig,
// Provider-specific function removed from '../room-core/roleplay-room-state.js';
import { RoleplayRoomExecutor, type RoleplayExecutionConfig // Provider-specific function removed from '../room-runtime/roleplay-room-executor.js';
import {
  createChatroomRoomBlueprint,
  type ChatroomRoomBlueprint,
  type RoomBlueprintRuntimeConfig,
// Provider-specific function removed from '../room-scenarios/room-blueprints.js';
import type { RoleplayCharacterCard // Provider-specific function removed from '../room-scenarios/roleplay/roleplay-characters.js';

export interface CustomRoleplayRoomPlan {
  blueprint: ChatroomRoomBlueprint;
// Provider-specific function removed

export function planCustomRoleplayRoom(input: {
  title?: string;
  topic: string;
  objective: string;
  constraints?: string[];
  scene?: {
    setting?: string;
    openingSituation?: string;
    atmosphere?: string;
    userMode?: 'observer' | 'participant' | 'actor';
  // Provider-specific function removed;
  setting?: string;
  openingSituation?: string;
  atmosphere?: string;
  userMode?: 'observer' | 'participant' | 'actor';
  customCharacters: RoleplayCharacterCard[];
  runtimeConfig?: Partial<RoomBlueprintRuntimeConfig>;
// Provider-specific function removed): CustomRoleplayRoomPlan {
  const blueprint = createChatroomRoomBlueprint({
    scenarioTemplateId: 'roleplay_scene',
    title: input.title ?? input.topic,
    topic: input.topic,
    objective: input.objective,
    constraints: input.constraints,
    customCharacters: input.customCharacters,
    runtimeConfig: {
      parallelBatchSize: input.runtimeConfig?.parallelBatchSize ?? 1,
      summaryEnabled: input.runtimeConfig?.summaryEnabled ?? true,
      maxReplyCharacters: input.runtimeConfig?.maxReplyCharacters ?? 500,
    // Provider-specific function removed,
  // Provider-specific function removed);
  
  return { blueprint // Provider-specific function removed;
// Provider-specific function removed

export interface CreateRoleplayRoomInput {
  topic: string;
  objective: string;
  scene: RoleplayScene;
  characters: Array<{
    id: string;
    name: string;
    instruction: string;
    publicDescription: string;
    priority?: 'high' | 'normal' | 'low';
    talkativeness?: number;
    initialMemory?: {
      observations?: string[];
      facts?: string[];
      decisions?: string[];
    // Provider-specific function removed;
    initialRelationships?: Array<{
      targetId: string;
      score: number;
      summary: string;
    // Provider-specific function removed>;
  // Provider-specific function removed>;
// Provider-specific function removed

export interface ExecuteRoleplayRoomInput {
  roomId: string;
  rounds: number;
  config?: Partial<RoleplayExecutionConfig>;
// Provider-specific function removed

export interface RoleplayRoomSummary {
  roomId: string;
  topic: string;
  currentRound: number;
  characterCount: number;
  activeCharacterCount: number;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
// Provider-specific function removed

export class RoleplayRoomService {
  private db: DatabaseSync;
  
  constructor() {
    this.db = getStoredChatroomDatabase();
    ensureRoleplayTables(this.db);
  // Provider-specific function removed
  
  createRoom(input: CreateRoleplayRoomInput): RoleplayRoomState {
    const characters: RoleplayCharacter[] = input.characters.map(charInput =>
      createRoleplayCharacter({
        id: charInput.id,
        name: charInput.name,
        instruction: charInput.instruction,
        publicDescription: charInput.publicDescription,
        priority: charInput.priority,
        talkativeness: charInput.talkativeness,
        initialMemory: charInput.initialMemory,
        initialRelationships: charInput.initialRelationships,
      // Provider-specific function removed)
    );
    
    const config: RoleplayRoomConfig = {
      topic: input.topic,
      objective: input.objective,
      scene: input.scene,
      characters,
    // Provider-specific function removed;
    
    const state = createRoleplayRoomState(config);
    persistRoleplayRoom(this.db, state);
    
    return state;
  // Provider-specific function removed
  
  getRoom(roomId: string): RoleplayRoomState | null {
    return loadRoleplayRoom(this.db, roomId);
  // Provider-specific function removed
  
  deleteRoom(roomId: string): void {
    deleteRoleplayRoom(this.db, roomId);
  // Provider-specific function removed
  
  listRooms(): RoleplayRoomSummary[] {
    const rooms = listRoleplayRooms(this.db);
    
    return rooms.map(room => {
      const state = this.getRoom(room.roomId);
      const activeCount = state
        ? Array.from(state.characters.values()).filter(c => c.status === 'active').length
        : 0;
      
      return {
        roomId: room.roomId,
        topic: room.topic,
        currentRound: room.currentRound,
        characterCount: room.characterCount,
        activeCharacterCount: activeCount,
        messageCount: state?.messages.length ?? 0,
        createdAt: room.createdAt,
        updatedAt: room.updatedAt,
      // Provider-specific function removed;
    // Provider-specific function removed);
  // Provider-specific function removed
  
  async executeRoom(input: ExecuteRoleplayRoomInput): Promise<{
    state: RoleplayRoomState;
    duration: number;
    messageCount: number;
  // Provider-specific function removed> {
    const state = this.getRoom(input.roomId);
  ***REMOVED***!state) {
      throw new Error(`Room "${input.roomId// Provider-specific function removed" not found`);
    // Provider-specific function removed
    
    const executor = new RoleplayRoomExecutor(input.config);
    
    const result = await executor.executeRounds(state, input.rounds, (round, messages) => {
      console.log(`Round ${round// Provider-specific function removed completed: ${messages.length// Provider-specific function removed messages`);
    // Provider-specific function removed);
    
    persistRoleplayRoom(this.db, result.state);
    
    return {
      state: result.state,
      duration: result.duration,
      messageCount: result.state.messages.length,
    // Provider-specific function removed;
  // Provider-specific function removed
  
  async continueRoom(roomId: string, additionalRounds: number): Promise<{
    state: RoleplayRoomState;
    duration: number;
    newMessageCount: number;
  // Provider-specific function removed> {
    const state = this.getRoom(roomId);
  ***REMOVED***!state) {
      throw new Error(`Room "${roomId// Provider-specific function removed" not found`);
    // Provider-specific function removed
    
    const executor = new RoleplayRoomExecutor();
    const initialMessageCount = state.messages.length;
    
    const result = await executor.executeRounds(state, additionalRounds);
    
    persistRoleplayRoom(this.db, result.state);
    
    return {
      state: result.state,
      duration: result.duration,
      newMessageCount: result.state.messages.length - initialMessageCount,
    // Provider-specific function removed;
  // Provider-specific function removed
  
  addCharacter(roomId: string, characterInput: CreateRoleplayRoomInput['characters'][0]): RoleplayRoomState | null {
    const state = this.getRoom(roomId);
  ***REMOVED***!state) return null;
    
    const character = createRoleplayCharacter({
      id: characterInput.id,
      name: characterInput.name,
      instruction: characterInput.instruction,
      publicDescription: characterInput.publicDescription,
      priority: characterInput.priority,
      talkativeness: characterInput.talkativeness,
      initialMemory: characterInput.initialMemory,
      initialRelationships: characterInput.initialRelationships,
    // Provider-specific function removed);
    
    state.characters.set(character.characterId, character);
    persistRoleplayRoom(this.db, state);
    
    return state;
  // Provider-specific function removed
  
  removeCharacter(roomId: string, characterId: string): RoleplayRoomState | null {
    const state = this.getRoom(roomId);
  ***REMOVED***!state) return null;
    
    state.characters.delete(characterId);
    persistRoleplayRoom(this.db, state);
    
    return state;
  // Provider-specific function removed
  
  activateCharacter(roomId: string, characterId: string): RoleplayRoomState | null {
    const state = this.getRoom(roomId);
  ***REMOVED***!state) return null;
    
    const character = state.characters.get(characterId);
  ***REMOVED***!character) return null;
    
    character.status = 'active';
    character.activatedAt = new Date().toISOString();
    character.consecutiveSilentRounds = 0;
    
    persistRoleplayRoom(this.db, state);
    return state;
  // Provider-specific function removed
  
  deactivateCharacter(roomId: string, characterId: string): RoleplayRoomState | null {
    const state = this.getRoom(roomId);
  ***REMOVED***!state) return null;
    
    const character = state.characters.get(characterId);
  ***REMOVED***!character) return null;
    
    character.status = 'dormant';
    character.deactivatedAt = new Date().toISOString();
    
    persistRoleplayRoom(this.db, state);
    return state;
  // Provider-specific function removed
  
  getCharacter(roomId: string, characterId: string): RoleplayCharacter | null {
    const state = this.getRoom(roomId);
  ***REMOVED***!state) return null;
    
    return state.characters.get(characterId) ?? null;
  // Provider-specific function removed
  
  getMessages(roomId: string, limit?: number): RoleplayRoomState['messages'] {
    const state = this.getRoom(roomId);
  ***REMOVED***!state) return [];
    
  ***REMOVED***limit) {
      return state.messages.slice(-limit);
    // Provider-specific function removed
    
    return state.messages;
  // Provider-specific function removed
// Provider-specific function removed