import { describe, it // Provider-specific function removed from 'node:test';
import assert from 'node:assert';
import {
  DEFAULT_AGENT_POOL_CONFIG,
  createAgentInstance,
  isAgentAvailable,
  isAgentBusy,
  resetAgentForNewRound,
  assignCharacterToAgent,
  startAgentWork,
  completeAgentWork,
  finishAgentRound,
  setAgentError,
  computeOptimalAgentCount,
  distributeCharactersToAgents,
  createAssignmentPlan,
  type AgentInstance,
  type AgentPoolConfig,
// Provider-specific function removed from './agent-pool-types.js';
import type { Character // Provider-specific function removed from './character-types.js';
import { createInitialCharacterMemoryState, createInitialContextWindow // Provider-specific function removed from './character-types.js';

function createTestCharacter(id: string, active: boolean = true): Character {
  return {
    characterId: id,
    name: `Character ${id// Provider-specific function removed`,
    instruction: 'test',
    publicDescription: 'test',
    activityStatus: active ? 'active' : 'dormant',
    lastSeenRound: 0,
    consecutiveSilentRounds: 0,
    memoryState: createInitialCharacterMemoryState(),
    agentThreadId: `thread-${id// Provider-specific function removed`,
    contextWindow: createInitialContextWindow(),
    privateSessionIds: [],
    pendingPrivateMessages: [],
    priority: 'normal',
    talkativeness: 0.5,
  // Provider-specific function removed;
// Provider-specific function removed

describe('agent-pool-types', () => {
  describe('DEFAULT_AGENT_POOL_CONFIG', () => {
    it('should have sensible defaults', () => {
      assert.strictEqual(DEFAULT_AGENT_POOL_CONFIG.maxConcurrency, 4);
      assert.strictEqual(DEFAULT_AGENT_POOL_CONFIG.minAgents, 1);
      assert.strictEqual(DEFAULT_AGENT_POOL_CONFIG.maxAgents, 10);
      assert.strictEqual(DEFAULT_AGENT_POOL_CONFIG.charactersPerAgent, 3);
    // Provider-specific function removed);
  // Provider-specific function removed);

  describe('createAgentInstance', () => {
    it('should create agent with correct id', () => {
      const agent = createAgentInstance('test-agent-1');
      
      assert.strictEqual(agent.agentId, 'test-agent-1');
      assert.strictEqual(agent.status, 'idle');
      assert.deepStrictEqual(agent.assignedCharacterIds, []);
      assert.deepStrictEqual(agent.completedCharacterIds, []);
      assert.strictEqual(agent.totalTurnsExecuted, 0);
    // Provider-specific function removed);
  // Provider-specific function removed);

  describe('isAgentAvailable', () => {
    it('should return true for idle agent', () => {
      const agent = createAgentInstance('test-1');
      assert.strictEqual(isAgentAvailable(agent), true);
    // Provider-specific function removed);

    it('should return false for busy agent', () => {
      const agent: AgentInstance = {
        ...createAgentInstance('test-1'),
        status: 'busy',
      // Provider-specific function removed;
      assert.strictEqual(isAgentAvailable(agent), false);
    // Provider-specific function removed);

    it('should return false for error agent', () => {
      const agent: AgentInstance = {
        ...createAgentInstance('test-1'),
        status: 'error',
      // Provider-specific function removed;
      assert.strictEqual(isAgentAvailable(agent), false);
    // Provider-specific function removed);
  // Provider-specific function removed);

  describe('isAgentBusy', () => {
    it('should return true for busy agent', () => {
      const agent: AgentInstance = {
        ...createAgentInstance('test-1'),
        status: 'busy',
      // Provider-specific function removed;
      assert.strictEqual(isAgentBusy(agent), true);
    // Provider-specific function removed);

    it('should return false for idle agent', () => {
      const agent = createAgentInstance('test-1');
      assert.strictEqual(isAgentBusy(agent), false);
    // Provider-specific function removed);
  // Provider-specific function removed);

  describe('resetAgentForNewRound', () => {
    it('should clear assignments', () => {
      let agent = createAgentInstance('test-1');
      agent = assignCharacterToAgent(agent, 'char-1');
      agent = startAgentWork(agent, 'char-1');
      
      const reset = resetAgentForNewRound(agent);
      
      assert.deepStrictEqual(reset.assignedCharacterIds, []);
      assert.strictEqual(reset.currentCharacterId, undefined);
      assert.deepStrictEqual(reset.completedCharacterIds, []);
    // Provider-specific function removed);
  // Provider-specific function removed);

  describe('assignCharacterToAgent', () => {
    it('should add character to assigned list', () => {
      const agent = createAgentInstance('test-1');
      const updated = assignCharacterToAgent(agent, 'char-1');
      
      assert.ok(updated.assignedCharacterIds.includes('char-1'));
    // Provider-specific function removed);

    it('should add multiple characters', () => {
      let agent = createAgentInstance('test-1');
      agent = assignCharacterToAgent(agent, 'char-1');
      agent = assignCharacterToAgent(agent, 'char-2');
      
      assert.deepStrictEqual(agent.assignedCharacterIds, ['char-1', 'char-2']);
    // Provider-specific function removed);
  // Provider-specific function removed);

  describe('startAgentWork', () => {
    it('should set agent to busy', () => {
      const agent = createAgentInstance('test-1');
      const working = startAgentWork(agent, 'char-1');
      
      assert.strictEqual(working.status, 'busy');
      assert.strictEqual(working.currentCharacterId, 'char-1');
    // Provider-specific function removed);
  // Provider-specific function removed);

  describe('completeAgentWork', () => {
    it('should add to completed list and update latency', () => {
      let agent = createAgentInstance('test-1');
      agent = startAgentWork(agent, 'char-1');
      
      const completed = completeAgentWork(agent, 'char-1', 1000);
      
      assert.ok(completed.completedCharacterIds.includes('char-1'));
      assert.strictEqual(completed.currentCharacterId, undefined);
      assert.strictEqual(completed.totalTurnsExecuted, 1);
      assert.strictEqual(completed.averageLatencyMs, 1000);
    // Provider-specific function removed);

    it('should calculate average latency correctly', () => {
      let agent = createAgentInstance('test-1');
      agent = completeAgentWork(agent, 'char-1', 1000);
      agent = completeAgentWork(agent, 'char-2', 2000);
      
      assert.strictEqual(agent.totalTurnsExecuted, 2);
      assert.strictEqual(agent.averageLatencyMs, 1500);
    // Provider-specific function removed);
  // Provider-specific function removed);

  describe('finishAgentRound', () => {
    it('should set status to idle when all completed', () => {
      let agent = createAgentInstance('test-1');
      agent = assignCharacterToAgent(agent, 'char-1');
      agent = startAgentWork(agent, 'char-1');
      agent = completeAgentWork(agent, 'char-1', 1000);
      
      const finished = finishAgentRound(agent);
      
      assert.strictEqual(finished.status, 'idle');
    // Provider-specific function removed);
  // Provider-specific function removed);

  describe('setAgentError', () => {
    it('should set error status and message', () => {
      const agent = createAgentInstance('test-1');
      const errored = setAgentError(agent, 'Something went wrong');
      
      assert.strictEqual(errored.status, 'error');
      assert.strictEqual(errored.lastError, 'Something went wrong');
    // Provider-specific function removed);
  // Provider-specific function removed);

  describe('computeOptimalAgentCount', () => {
    it('should return minAgents when no characters', () => {
      const config: AgentPoolConfig = { ...DEFAULT_AGENT_POOL_CONFIG, minAgents: 2 // Provider-specific function removed;
      assert.strictEqual(computeOptimalAgentCount(0, config), 2);
    // Provider-specific function removed);

    it('should compute based on characters per agent', () => {
      const count = computeOptimalAgentCount(10, DEFAULT_AGENT_POOL_CONFIG);
      assert.strictEqual(count, 4);
    // Provider-specific function removed);

    it('should not exceed maxConcurrency', () => {
      const config: AgentPoolConfig = { ...DEFAULT_AGENT_POOL_CONFIG, maxConcurrency: 2 // Provider-specific function removed;
      const count = computeOptimalAgentCount(10, config);
      assert.strictEqual(count, 2);
    // Provider-specific function removed);

    it('should not exceed maxAgents', () => {
      const config: AgentPoolConfig = { ...DEFAULT_AGENT_POOL_CONFIG, maxAgents: 3 // Provider-specific function removed;
      const count = computeOptimalAgentCount(20, config);
      assert.strictEqual(count, 3);
    // Provider-specific function removed);
  // Provider-specific function removed);

  describe('distributeCharactersToAgents', () => {
    it('should distribute evenly', () => {
      const characterIds = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];
      const distributions = distributeCharactersToAgents(characterIds, 3);
      
      assert.strictEqual(distributions.length, 3);
      assert.deepStrictEqual(distributions[0], ['c1', 'c4']);
      assert.deepStrictEqual(distributions[1], ['c2', 'c5']);
      assert.deepStrictEqual(distributions[2], ['c3', 'c6']);
    // Provider-specific function removed);

    it('should handle uneven distribution', () => {
      const characterIds = ['c1', 'c2', 'c3', 'c4', 'c5'];
      const distributions = distributeCharactersToAgents(characterIds, 3);
      
      assert.strictEqual(distributions.length, 3);
      assert.strictEqual(distributions[0]?.length, 2);
      assert.strictEqual(distributions[1]?.length, 2);
      assert.strictEqual(distributions[2]?.length, 1);
    // Provider-specific function removed);

    it('should return empty array for zero agents', () => {
      const distributions = distributeCharactersToAgents(['c1', 'c2'], 0);
      assert.deepStrictEqual(distributions, []);
    // Provider-specific function removed);
  // Provider-specific function removed);

  describe('createAssignmentPlan', () => {
    it('should create plan with correct assignments', () => {
      const characters = [
        createTestCharacter('c1'),
        createTestCharacter('c2'),
        createTestCharacter('c3'),
      ];
      const agents = [
        createAgentInstance('a1'),
        createAgentInstance('a2'),
      ];
      
      const plan = createAssignmentPlan(characters, agents, 1);
      
      assert.strictEqual(plan.round, 1);
      assert.strictEqual(plan.totalCharacters, 3);
      assert.strictEqual(plan.totalAgents, 2);
      assert.strictEqual(plan.assignments.length, 2);
    // Provider-specific function removed);

    it('should only include active characters', () => {
      const characters = [
        createTestCharacter('c1', true),
        createTestCharacter('c2', false),
        createTestCharacter('c3', true),
      ];
      const agents = [createAgentInstance('a1')];
      
      const plan = createAssignmentPlan(characters, agents, 1);
      
      assert.strictEqual(plan.totalCharacters, 2);
    // Provider-specific function removed);
  // Provider-specific function removed);
// Provider-specific function removed);