import { setTracingDisabled // Provider-specific function removed from '@openai/agents-core';
import { loadAppConfig, createRuntimeModelBinding // Provider-specific function removed from '../config/app-config.js';
import { AgentRuntime // Provider-specific function removed from '../core/agent-runtime.js';
import type { RoleplayRoomState, RoleplayCharacter // Provider-specific function removed from '../room-core/roleplay-room-state.js';
import type { Character // Provider-specific function removed from '../room-core/character-types.js';
import {
  getActiveCharacters,
  incrementRound,
  recordCharacterTurn,
  addMessageToState,
  updateCharacterMemory,
// Provider-specific function removed from '../room-core/roleplay-room-state.js';
import { AgentPool // Provider-specific function removed from '../room-runtime/agent-pool.js';
import {
  createInitialSequence,
  getCharactersInOrder,
  type ExecutionSequence,
// Provider-specific function removed from '../room-core/execution-sequence-types.js';
import type { ChatroomMessage // Provider-specific function removed from '../room-core/message-types.js';

function toCharacterType(c: RoleplayCharacter): Character {
  return {
    characterId: c.characterId,
    name: c.name,
    instruction: c.instruction,
    publicDescription: c.publicDescription,
    activityStatus: c.status === 'active' ? 'active' : 'dormant',
    lastSeenRound: c.lastActiveRound,
    consecutiveSilentRounds: c.consecutiveSilentRounds,
    memoryState: {
      scratchMemory: {
        observations: c.memory.observations,
        pendingIntents: c.memory.pendingIntents,
      // Provider-specific function removed,
      longTermMemory: {
        establishedFacts: c.memory.establishedFacts,
        decisions: c.memory.decisions,
      // Provider-specific function removed,
      relationships: c.memory.relationships,
    // Provider-specific function removed,
    agentThreadId: c.agentThreadId,
    contextWindow: {
      lastReadSequenceNo: 0,
      messagesSinceActivation: [],
    // Provider-specific function removed,
    privateSessionIds: [],
    pendingPrivateMessages: [],
    priority: c.priority,
    talkativeness: c.talkativeness,
  // Provider-specific function removed;
// Provider-specific function removed

export interface RoleplayExecutionConfig {
  maxConcurrency?: number;
  charactersPerAgent?: number;
  contextWindowSize?: number;
  maxSilentRounds?: number;
// Provider-specific function removed

const DEFAULT_CONFIG: RoleplayExecutionConfig = {
  maxConcurrency: 4,
  charactersPerAgent: 3,
  contextWindowSize: 15,
  maxSilentRounds: 3,
// Provider-specific function removed;

export interface RoleplayExecutionResult {
  state: RoleplayRoomState;
  roundResults: Array<{
    round: number;
    messages: ChatroomMessage[];
    characterStats: Map<string, { spoke: boolean; latencyMs: number // Provider-specific function removed>;
  // Provider-specific function removed>;
  duration: number;
// Provider-specific function removed

export class RoleplayRoomExecutor {
  private config: RoleplayExecutionConfig;
  private agentPool: AgentPool;
  private agentRuntime: AgentRuntime;
  
  constructor(config: Partial<RoleplayExecutionConfig> = {// Provider-specific function removed) {
    setTracingDisabled(true);
    
    this.config = { ...DEFAULT_CONFIG, ...config // Provider-specific function removed;
    
    const appConfig = loadAppConfig();
    const runtimeModel = createRuntimeModelBinding(appConfig);
    
    this.agentRuntime = new AgentRuntime({
      model: runtimeModel.model,
      retryDefaults: appConfig.runtime.modelRetry,
      ...(runtimeModel.modelProvider ? { modelProvider: runtimeModel.modelProvider // Provider-specific function removed : {// Provider-specific function removed),
      tracingDisabled: appConfig.runtime.tracingDisabled,
      workflowName: appConfig.runtime.workflowName,
    // Provider-specific function removed);
    
    this.agentPool = new AgentPool({
      maxConcurrency: this.config.maxConcurrency!,
      minAgents: 1,
      maxAgents: this.config.maxConcurrency!,
      charactersPerAgent: this.config.charactersPerAgent!,
    // Provider-specific function removed);
  // Provider-specific function removed
  
  async executeRounds(
    state: RoleplayRoomState,
    rounds: number,
    onRoundComplete?: (round: number, messages: ChatroomMessage[]) => void
  ): Promise<RoleplayExecutionResult> {
    const startTime = Date.now();
    const roundResults: RoleplayExecutionResult['roundResults'] = [];
    
    for (let i = 0; i < rounds; i++) {
      const roundResult = await this.executeRound(state);
      roundResults.push(roundResult);
      
    ***REMOVED***onRoundComplete) {
        onRoundComplete(roundResult.round, roundResult.messages);
      // Provider-specific function removed
      
      const activeCount = getActiveCharacters(state).length;
    ***REMOVED***activeCount === 0) {
        break;
      // Provider-specific function removed
    // Provider-specific function removed
    
    const duration = Date.now() - startTime;
    
    return {
      state,
      roundResults,
      duration,
    // Provider-specific function removed;
  // Provider-specific function removed
  
  private async executeRound(state: RoleplayRoomState): Promise<{
    round: number;
    messages: ChatroomMessage[];
    characterStats: Map<string, { spoke: boolean; latencyMs: number // Provider-specific function removed>;
  // Provider-specific function removed> {
    const newState = incrementRound(state);
    Object.assign(state, newState);
    
    const round = state.currentRound;
    const activeCharacters = getActiveCharacters(state);
    
  ***REMOVED***activeCharacters.length === 0) {
      return {
        round,
        messages: [],
        characterStats: new Map(),
      // Provider-specific function removed;
    // Provider-specific function removed
    
    const sequence = createInitialSequence(
      activeCharacters.map(toCharacterType),
      round
    );
    
    const plan = this.agentPool.assignCharacters(
      activeCharacters.map(toCharacterType),
      sequence,
      round
    );
    
    const characterStats = new Map<string, { spoke: boolean; latencyMs: number // Provider-specific function removed>();
    const roundMessages: ChatroomMessage[] = [];
    
    for (const assignment of plan.assignments) {
      for (const characterId of assignment.characterIds) {
        const character = state.characters.get(characterId);
      ***REMOVED***!character) continue;
        
        const result = await this.executeCharacterTurn(state, character);
        
        characterStats.set(characterId, {
          spoke: result.spoke,
          latencyMs: result.latencyMs,
        // Provider-specific function removed);
        
      ***REMOVED***result.message) {
          roundMessages.push(result.message);
          const newState = addMessageToState(state, {
            round,
            role: 'agent',
            authorId: characterId,
            authorName: character.name,
            content: result.message.content,
          // Provider-specific function removed);
          Object.assign(state, newState);
        // Provider-specific function removed
        
        const updatedState = recordCharacterTurn(state, characterId, result.spoke, round);
        Object.assign(state, updatedState);
        
      ***REMOVED***result.observation) {
          const memState = updateCharacterMemory(state, characterId, {
            observation: result.observation,
          // Provider-specific function removed);
          Object.assign(state, memState);
        // Provider-specific function removed
      // Provider-specific function removed
    // Provider-specific function removed
    
    return {
      round,
      messages: roundMessages,
      characterStats,
    // Provider-specific function removed;
  // Provider-specific function removed
  
  private async executeCharacterTurn(
    state: RoleplayRoomState,
    character: RoleplayCharacter
  ): Promise<{
    spoke: boolean;
    message?: ChatroomMessage;
    observation?: string;
    latencyMs: number;
  // Provider-specific function removed> {
    const startTime = Date.now();
    
    try {
      const recentMessages = state.messages
        .slice(-this.config.contextWindowSize!)
        .map(m => `[${m.authorName// Provider-specific function removed]: ${m.content// Provider-specific function removed`)
        .join('\n\n');
      
      const memoryContext = [
        '## 你的记忆',
        `观察: ${character.memory.observations.slice(-5).join('; ') || '无'// Provider-specific function removed`,
        `已知事实: ${character.memory.establishedFacts.slice(-5).join('; ') || '无'// Provider-specific function removed`,
      ].join('\n');
      
      const relationshipContext = Array.from(character.memory.relationships.entries())
        .map(([id, rel]) => `- ${id// Provider-specific function removed: ${rel.summary// Provider-specific function removed (好感度: ${rel.score// Provider-specific function removed)`)
        .join('\n');
      
      const prompt = `## 场景
${state.scene.setting// Provider-specific function removed
氛围: ${state.scene.atmosphere// Provider-specific function removed
${state.scene.currentBeat ? `当前节拍: ${state.scene.currentBeat// Provider-specific function removed` : ''// Provider-specific function removed

## 话题与目标
话题: ${state.topic// Provider-specific function removed
目标: ${state.objective// Provider-specific function removed

## 当前对话
${recentMessages || '（场景刚开始）'// Provider-specific function removed

${memoryContext// Provider-specific function removed

## 你与其他人的关系
${relationshipContext || '（暂无特殊关系）'// Provider-specific function removed

## 你的身份
你是${character.name// Provider-specific function removed。
${character.instruction// Provider-specific function removed

## 任务
根据你的性格和当前场景，决定是否要说话或行动。
- 如果说话，直接输出你的台词，不要加引号或其他标记。
- 如果不说话，输出【沉默】。

现在做出反应：`;

      const profile = {
        id: character.characterId,
        name: character.name,
        description: character.publicDescription,
        instructions: character.instruction,
        outputType: 'text' as const,
      // Provider-specific function removed;
      
      const response = await this.agentRuntime.run(profile, prompt);
      const output = typeof response === 'string' ? response : String(response);
      
      const latencyMs = Date.now() - startTime;
      const isSilent = output.includes('【沉默】') || output.trim().length < 3;
      
    ***REMOVED***!isSilent) {
        const cleanOutput = output.replace(/【沉默】/g, '').trim();
        
      ***REMOVED***cleanOutput.length > 0) {
          return {
            spoke: true,
            message: {
              id: '',
              round: state.currentRound,
              role: 'agent',
              authorId: character.characterId,
              authorName: character.name,
              content: cleanOutput,
              createdAt: new Date().toISOString(),
            // Provider-specific function removed,
            observation: `${character.name// Provider-specific function removed在场景中发言`,
            latencyMs,
          // Provider-specific function removed;
        // Provider-specific function removed
      // Provider-specific function removed
      
      return {
        spoke: false,
        latencyMs,
      // Provider-specific function removed;
      
    // Provider-specific function removed catch (error) {
      const latencyMs = Date.now() - startTime;
      console.error(`${character.name// Provider-specific function removed 执行出错: ${error// Provider-specific function removed`);
      return {
        spoke: false,
        latencyMs,
      // Provider-specific function removed;
    // Provider-specific function removed
  // Provider-specific function removed
  
  getStats(): {
    agentPool: ReturnType<AgentPool['getStats']>;
  // Provider-specific function removed {
    return {
      agentPool: this.agentPool.getStats(),
    // Provider-specific function removed;
  // Provider-specific function removed
// Provider-specific function removed
