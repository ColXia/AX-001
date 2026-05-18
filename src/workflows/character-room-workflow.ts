import type { Character, CharacterStateDelta // Provider-specific function removed from '../room-core/character-types.js';
import type { AgentPoolConfig, AssignmentPlan // Provider-specific function removed from '../room-core/agent-pool-types.js';
import type { ExecutionSequence, SequenceAdjustmentRequest // Provider-specific function removed from '../room-core/execution-sequence-types.js';
import type { ChatroomMessage // Provider-specific function removed from '../room-core/message-types.js';
import type { PrivateSessionMessage // Provider-specific function removed from '../room-core/private-session-types.js';
import { AgentPool // Provider-specific function removed from '../room-runtime/agent-pool.js';
import {
  buildCharacterContext,
  executeCharacterTurn,
  applyCharacterTurnResult,
  activateCharacter,
// Provider-specific function removed from '../room-runtime/character-turn-executor.js';
import {
  checkDormantCharacters,
  getCharactersToActivate,
// Provider-specific function removed from '../room-runtime/dormant-character-checker.js';
import {
  createInitialSequence,
  applyAdjustmentsToSequence,
  mergeSequencesForRound,
  getCharactersInOrder,
  createAdjustmentRequest,
// Provider-specific function removed from '../room-core/execution-sequence-types.js';
import type { ChatroomState // Provider-specific function removed from '../room-runtime/room-state.js';

export interface CharacterRoomConfig {
  characters: Character[];
  initialState: ChatroomState;
  agentPoolConfig?: Partial<AgentPoolConfig>;
  maxRounds: number;
// Provider-specific function removed

export interface CharacterRoomState {
  characters: Map<string, Character>;
  chatroomState: ChatroomState;
  agentPool: AgentPool;
  currentSequence: ExecutionSequence;
  currentRound: number;
  pendingAdjustments: SequenceAdjustmentRequest[];
// Provider-specific function removed

export interface RoundResult {
  round: number;
  messages: ChatroomMessage[];
  characterUpdates: CharacterStateDelta[];
  dormantCheckSummary: {
    totalChecked: number;
    toActivate: number;
    toKeepDormant: number;
  // Provider-specific function removed;
  agentPoolStats: {
    totalAgents: number;
    totalTurnsExecuted: number;
    averageLatencyMs: number;
  // Provider-specific function removed;
// Provider-specific function removed

export class CharacterRoomWorkflow {
  private state: CharacterRoomState;

  constructor(config: CharacterRoomConfig) {
    const characterMap = new Map(
      config.characters.map(c => [c.characterId, c])
    );
    
    const agentPool = new AgentPool(config.agentPoolConfig);
    
    const activeCharacters = config.characters.filter(c => c.activityStatus === 'active');
    const initialSequence = createInitialSequence(activeCharacters, 1);
    
    this.state = {
      characters: characterMap,
      chatroomState: config.initialState,
      agentPool,
      currentSequence: initialSequence,
      currentRound: 0,
      pendingAdjustments: [],
    // Provider-specific function removed;
  // Provider-specific function removed

  getState(): CharacterRoomState {
    return this.state;
  // Provider-specific function removed

  getCharacter(characterId: string): Character | undefined {
    return this.state.characters.get(characterId);
  // Provider-specific function removed

  getActiveCharacters(): Character[] {
    return Array.from(this.state.characters.values()).filter(
      c => c.activityStatus === 'active'
    );
  // Provider-specific function removed

  getDormantCharacters(): Character[] {
    return Array.from(this.state.characters.values()).filter(
      c => c.activityStatus === 'dormant'
    );
  // Provider-specific function removed

  async executeRound(): Promise<RoundResult> {
    this.state.currentRound += 1;
    const round = this.state.currentRound;
    
    const activeCharacters = this.getActiveCharacters();
    
  ***REMOVED***activeCharacters.length === 0) {
      return this.createEmptyRoundResult(round);
    // Provider-specific function removed
    
    const sequence = mergeSequencesForRound(
      this.state.currentSequence,
      activeCharacters.map(c => c.characterId),
      round
    );
    
  ***REMOVED***this.state.pendingAdjustments.length > 0) {
      this.state.currentSequence = applyAdjustmentsToSequence(
        sequence,
        this.state.pendingAdjustments
      );
      this.state.pendingAdjustments = [];
    // Provider-specific function removed else {
      this.state.currentSequence = sequence;
    // Provider-specific function removed
    
    const plan = this.state.agentPool.assignCharacters(
      Array.from(this.state.characters.values()),
      this.state.currentSequence,
      round
    );
    
    const characterUpdates: CharacterStateDelta[] = [];
    
    await this.executePlan(plan, characterUpdates);
    
    const dormantResults = checkDormantCharacters({
      characters: Array.from(this.state.characters.values()),
      round,
    // Provider-specific function removed);
    
    const toActivate = getCharactersToActivate(
      new Map(dormantResults.map((r: { characterId: string; shouldActivate: boolean // Provider-specific function removed) => [r.characterId, r]))
    );
    
    for (const characterId of toActivate) {
      const character = this.state.characters.get(characterId);
    ***REMOVED***character) {
        const activated = activateCharacter(character, round, 'Private message trigger');
        this.state.characters.set(characterId, activated);
        characterUpdates.push({
          characterId,
          activityStatus: 'active',
          activatedAt: activated.activatedAt,
        // Provider-specific function removed);
      // Provider-specific function removed
    // Provider-specific function removed
    
    const dormantCheckSummary = {
      totalChecked: dormantResults.length,
      toActivate: toActivate.length,
      toKeepDormant: dormantResults.length - toActivate.length,
    // Provider-specific function removed;
    
    return {
      round,
      messages: this.state.chatroomState.messages,
      characterUpdates,
      dormantCheckSummary,
      agentPoolStats: this.state.agentPool.getStats(),
    // Provider-specific function removed;
  // Provider-specific function removed

  private async executePlan(
    plan: AssignmentPlan,
    characterUpdates: CharacterStateDelta[]
  ): Promise<void> {
    const executionPromises = plan.assignments.map(assignment =>
      this.executeAgentAssignment(assignment, characterUpdates)
    );
    
    await Promise.all(executionPromises);
  // Provider-specific function removed

  private async executeAgentAssignment(
    assignment: AssignmentPlan['assignments'][0],
    characterUpdates: CharacterStateDelta[]
  ): Promise<void> {
    const firstCharacterId = assignment.characterIds[0];
  ***REMOVED***!firstCharacterId) {
      return;
    // Provider-specific function removed
    
    this.state.agentPool.setAgentBusy(assignment.agentId, firstCharacterId);
    
    for (const characterId of assignment.characterIds) {
      const character = this.state.characters.get(characterId);
    ***REMOVED***!character) {
        continue;
      // Provider-specific function removed
      
      const context = buildCharacterContext(character, this.state.chatroomState);
      
      const startTime = Date.now();
      const result = await executeCharacterTurn({
        character,
        context,
        state: this.state.chatroomState,
        round: this.state.currentRound,
        agentId: assignment.agentId,
      // Provider-specific function removed);
      const latencyMs = Date.now() - startTime;
      
      this.state.agentPool.completeAgentWork(assignment.agentId, characterId, latencyMs);
      
      const { character: updatedCharacter, state: updatedState // Provider-specific function removed =
        applyCharacterTurnResult(character, result, this.state.chatroomState, this.state.currentRound);
      
      this.state.characters.set(characterId, updatedCharacter);
      this.state.chatroomState = updatedState;
      
      characterUpdates.push({
        characterId,
        lastSeenRound: this.state.currentRound,
        consecutiveSilentRounds: updatedCharacter.consecutiveSilentRounds,
      // Provider-specific function removed);
      
    ***REMOVED***result.decision.decision === 'stay_silent') {
        characterUpdates.push({
          characterId,
          consecutiveSilentRounds: updatedCharacter.consecutiveSilentRounds,
        // Provider-specific function removed);
      // Provider-specific function removed
    // Provider-specific function removed
    
    this.state.agentPool.releaseAgent(assignment.agentId);
  // Provider-specific function removed

  private createEmptyRoundResult(round: number): RoundResult {
    return {
      round,
      messages: this.state.chatroomState.messages,
      characterUpdates: [],
      dormantCheckSummary: {
        totalChecked: 0,
        toActivate: 0,
        toKeepDormant: 0,
      // Provider-specific function removed,
      agentPoolStats: this.state.agentPool.getStats(),
    // Provider-specific function removed;
  // Provider-specific function removed

  async executeMultipleRounds(count: number): Promise<RoundResult[]> {
    const results: RoundResult[] = [];
    
    for (let i = 0; i < count; i++) {
      const result = await this.executeRound();
      results.push(result);
      
      const activeCount = this.getActiveCharacters().length;
    ***REMOVED***activeCount === 0) {
        break;
      // Provider-specific function removed
    // Provider-specific function removed
    
    return results;
  // Provider-specific function removed

  addCharacter(character: Character): void {
    this.state.characters.set(character.characterId, character);
  // Provider-specific function removed

  removeCharacter(characterId: string): void {
    this.state.characters.delete(characterId);
  // Provider-specific function removed

  updateCharacter(characterId: string, delta: CharacterStateDelta): void {
    const character = this.state.characters.get(characterId);
  ***REMOVED***!character) {
      return;
    // Provider-specific function removed
    
    const updated: Character = {
      ...character,
      ...delta,
      memoryState: delta.memoryState
        ? { ...character.memoryState, ...delta.memoryState // Provider-specific function removed
        : character.memoryState,
      contextWindow: delta.contextWindow
        ? { ...character.contextWindow, ...delta.contextWindow // Provider-specific function removed
        : character.contextWindow,
      pendingPrivateMessages: delta.pendingPrivateMessages ?? character.pendingPrivateMessages,
    // Provider-specific function removed;
    
    this.state.characters.set(characterId, updated);
  // Provider-specific function removed

  addPrivateMessage(
    characterId: string,
    message: { speakerId: string; speakerName: string; content: string // Provider-specific function removed
  ): void {
    const character = this.state.characters.get(characterId);
  ***REMOVED***!character) {
      return;
    // Provider-specific function removed
    
    const privateMessage: PrivateSessionMessage = {
      messageId: `pm-${Date.now()// Provider-specific function removed`,
      speakerId: message.speakerId,
      speakerName: message.speakerName,
      targetSpeakerId: characterId,
      content: message.content,
      createdAt: new Date().toISOString(),
      round: this.state.currentRound,
    // Provider-specific function removed;
    
    this.updateCharacter(characterId, {
      characterId,
      pendingPrivateMessages: [...character.pendingPrivateMessages, privateMessage],
    // Provider-specific function removed as CharacterStateDelta);
  // Provider-specific function removed

  getExecutionOrder(): string[] {
    return getCharactersInOrder(this.state.currentSequence);
  // Provider-specific function removed

  getCurrentRound(): number {
    return this.state.currentRound;
  // Provider-specific function removed
// Provider-specific function removed
