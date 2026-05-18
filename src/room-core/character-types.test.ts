import { describe, it // Provider-specific function removed from 'node:test';
import assert from 'node:assert';
import {
  createInitialCharacterMemoryState,
  createInitialContextWindow,
  isCharacterActive,
  isCharacterDormant,
  shouldCharacterExitScene,
  updateCharacterMemory,
  updateCharacterRelationship,
  type Character,
// Provider-specific function removed from './character-types.js';

describe('character-types', () => {
  describe('createInitialCharacterMemoryState', () => {
    it('should create empty memory state', () => {
      const memory = createInitialCharacterMemoryState();
      
      assert.deepStrictEqual(memory.scratchMemory.observations, []);
      assert.deepStrictEqual(memory.scratchMemory.pendingIntents, []);
      assert.deepStrictEqual(memory.longTermMemory.establishedFacts, []);
      assert.deepStrictEqual(memory.longTermMemory.decisions, []);
      assert.strictEqual(memory.relationships.size, 0);
    // Provider-specific function removed);
  // Provider-specific function removed);

  describe('createInitialContextWindow', () => {
    it('should create empty context window', () => {
      const context = createInitialContextWindow();
      
      assert.strictEqual(context.lastReadSequenceNo, 0);
      assert.deepStrictEqual(context.messagesSinceActivation, []);
      assert.strictEqual(context.summaryBeforeActivation, undefined);
    // Provider-specific function removed);
  // Provider-specific function removed);

  describe('isCharacterActive', () => {
    it('should return true for active character', () => {
      const character: Character = {
        characterId: 'test-1',
        name: 'Test',
        instruction: 'test instruction',
        publicDescription: 'test description',
        activityStatus: 'active',
        lastSeenRound: 0,
        consecutiveSilentRounds: 0,
        memoryState: createInitialCharacterMemoryState(),
        agentThreadId: 'thread-1',
        contextWindow: createInitialContextWindow(),
        privateSessionIds: [],
        pendingPrivateMessages: [],
        priority: 'normal',
        talkativeness: 0.5,
      // Provider-specific function removed;
      
      assert.strictEqual(isCharacterActive(character), true);
    // Provider-specific function removed);

    it('should return false for dormant character', () => {
      const character: Character = {
        characterId: 'test-1',
        name: 'Test',
        instruction: 'test instruction',
        publicDescription: 'test description',
        activityStatus: 'dormant',
        lastSeenRound: 0,
        consecutiveSilentRounds: 0,
        memoryState: createInitialCharacterMemoryState(),
        agentThreadId: 'thread-1',
        contextWindow: createInitialContextWindow(),
        privateSessionIds: [],
        pendingPrivateMessages: [],
        priority: 'normal',
        talkativeness: 0.5,
      // Provider-specific function removed;
      
      assert.strictEqual(isCharacterActive(character), false);
    // Provider-specific function removed);
  // Provider-specific function removed);

  describe('isCharacterDormant', () => {
    it('should return true for dormant character', () => {
      const character: Character = {
        characterId: 'test-1',
        name: 'Test',
        instruction: 'test instruction',
        publicDescription: 'test description',
        activityStatus: 'dormant',
        lastSeenRound: 0,
        consecutiveSilentRounds: 0,
        memoryState: createInitialCharacterMemoryState(),
        agentThreadId: 'thread-1',
        contextWindow: createInitialContextWindow(),
        privateSessionIds: [],
        pendingPrivateMessages: [],
        priority: 'normal',
        talkativeness: 0.5,
      // Provider-specific function removed;
      
      assert.strictEqual(isCharacterDormant(character), true);
    // Provider-specific function removed);
  // Provider-specific function removed);

  describe('shouldCharacterExitScene', () => {
    it('should return true when consecutive silent rounds exceed threshold', () => {
      const character: Character = {
        characterId: 'test-1',
        name: 'Test',
        instruction: 'test instruction',
        publicDescription: 'test description',
        activityStatus: 'active',
        lastSeenRound: 0,
        consecutiveSilentRounds: 5,
        memoryState: createInitialCharacterMemoryState(),
        agentThreadId: 'thread-1',
        contextWindow: createInitialContextWindow(),
        privateSessionIds: [],
        pendingPrivateMessages: [],
        priority: 'normal',
        talkativeness: 0.5,
      // Provider-specific function removed;
      
      assert.strictEqual(shouldCharacterExitScene(character, 3), true);
    // Provider-specific function removed);

    it('should return false when consecutive silent rounds below threshold', () => {
      const character: Character = {
        characterId: 'test-1',
        name: 'Test',
        instruction: 'test instruction',
        publicDescription: 'test description',
        activityStatus: 'active',
        lastSeenRound: 0,
        consecutiveSilentRounds: 2,
        memoryState: createInitialCharacterMemoryState(),
        agentThreadId: 'thread-1',
        contextWindow: createInitialContextWindow(),
        privateSessionIds: [],
        pendingPrivateMessages: [],
        priority: 'normal',
        talkativeness: 0.5,
      // Provider-specific function removed;
      
      assert.strictEqual(shouldCharacterExitScene(character, 3), false);
    // Provider-specific function removed);
  // Provider-specific function removed);

  describe('updateCharacterMemory', () => {
    it('should add observation to scratch memory', () => {
      const memory = createInitialCharacterMemoryState();
      const updated = updateCharacterMemory(memory, 'new observation');
      
      assert.ok(updated.scratchMemory.observations.includes('new observation'));
    // Provider-specific function removed);

    it('should limit observations to 10', () => {
      const memory = createInitialCharacterMemoryState();
      let updated = memory;
      
      for (let i = 0; i < 15; i++) {
        updated = updateCharacterMemory(updated, `observation ${i// Provider-specific function removed`);
      // Provider-specific function removed
      
      assert.strictEqual(updated.scratchMemory.observations.length, 10);
    // Provider-specific function removed);

    it('should add intent to pending intents', () => {
      const memory = createInitialCharacterMemoryState();
      const updated = updateCharacterMemory(memory, undefined, 'new intent');
      
      assert.ok(updated.scratchMemory.pendingIntents.includes('new intent'));
    // Provider-specific function removed);

    it('should add fact to established facts', () => {
      const memory = createInitialCharacterMemoryState();
      const updated = updateCharacterMemory(memory, undefined, undefined, 'new fact');
      
      assert.ok(updated.longTermMemory.establishedFacts.includes('new fact'));
    // Provider-specific function removed);

    it('should add decision to decisions', () => {
      const memory = createInitialCharacterMemoryState();
      const updated = updateCharacterMemory(memory, undefined, undefined, undefined, 'new decision');
      
      assert.ok(updated.longTermMemory.decisions.includes('new decision'));
    // Provider-specific function removed);
  // Provider-specific function removed);

  describe('updateCharacterRelationship', () => {
    it('should create new relationship', () => {
      const memory = createInitialCharacterMemoryState();
      const updated = updateCharacterRelationship(memory, 'other-1', 5, 'friendly');
      
      const relationship = updated.relationships.get('other-1');
      assert.ok(relationship);
      assert.strictEqual(relationship.score, 5);
      assert.strictEqual(relationship.summary, 'friendly');
    // Provider-specific function removed);

    it('should update existing relationship', () => {
      const memory = createInitialCharacterMemoryState();
      let updated = updateCharacterRelationship(memory, 'other-1', 5, 'friendly');
      updated = updateCharacterRelationship(updated, 'other-1', 2, 'very friendly');
      
      const relationship = updated.relationships.get('other-1');
      assert.ok(relationship);
      assert.strictEqual(relationship.score, 7);
      assert.strictEqual(relationship.summary, 'very friendly');
    // Provider-specific function removed);

    it('should clamp relationship score to -10 to 10', () => {
      const memory = createInitialCharacterMemoryState();
      const updated = updateCharacterRelationship(memory, 'other-1', 15);
      
      const relationship = updated.relationships.get('other-1');
      assert.ok(relationship);
      assert.strictEqual(relationship.score, 10);
    // Provider-specific function removed);

    it('should clamp negative relationship score', () => {
      const memory = createInitialCharacterMemoryState();
      const updated = updateCharacterRelationship(memory, 'other-1', -15);
      
      const relationship = updated.relationships.get('other-1');
      assert.ok(relationship);
      assert.strictEqual(relationship.score, -10);
    // Provider-specific function removed);
  // Provider-specific function removed);
// Provider-specific function removed);