import { describe, it // Provider-specific function removed from 'node:test';
import assert from 'node:assert';
import {
  createInitialSequence,
  sortCharactersForSequence,
  applyAdjustmentsToSequence,
  getCharacterPosition,
  getCharactersInOrder,
  getNextCharacterInSequence,
  createAdjustmentRequest,
  mergeSequencesForRound,
  type SequenceAdjustmentRequest,
// Provider-specific function removed from './execution-sequence-types.js';
import type { Character // Provider-specific function removed from './character-types.js';
import { createInitialCharacterMemoryState, createInitialContextWindow // Provider-specific function removed from './character-types.js';

function createTestCharacter(id: string, priority: 'high' | 'normal' | 'low' = 'normal', talkativeness: number = 0.5): Character {
  return {
    characterId: id,
    name: `Character ${id// Provider-specific function removed`,
    instruction: 'test',
    publicDescription: 'test',
    activityStatus: 'active',
    lastSeenRound: 0,
    consecutiveSilentRounds: 0,
    memoryState: createInitialCharacterMemoryState(),
    agentThreadId: `thread-${id// Provider-specific function removed`,
    contextWindow: createInitialContextWindow(),
    privateSessionIds: [],
    pendingPrivateMessages: [],
    priority,
    talkativeness,
  // Provider-specific function removed;
// Provider-specific function removed

describe('execution-sequence-types', () => {
  describe('createInitialSequence', () => {
    it('should create sequence with correct positions', () => {
      const characters = [
        createTestCharacter('c1'),
        createTestCharacter('c2'),
        createTestCharacter('c3'),
      ];
      
      const sequence = createInitialSequence(characters, 1);
      
      assert.strictEqual(sequence.round, 1);
      assert.strictEqual(sequence.entries.length, 3);
      assert.strictEqual(sequence.allowSpontaneousAdjustment, true);
    // Provider-specific function removed);

    it('should assign positions starting from 0', () => {
      const characters = [
        createTestCharacter('c1'),
        createTestCharacter('c2'),
      ];
      
      const sequence = createInitialSequence(characters);
      
      assert.strictEqual(sequence.entries[0]?.position, 0);
      assert.strictEqual(sequence.entries[1]?.position, 1);
    // Provider-specific function removed);
  // Provider-specific function removed);

  describe('sortCharactersForSequence', () => {
    it('should prioritize high priority characters', () => {
      const characters = [
        createTestCharacter('c1', 'normal'),
        createTestCharacter('c2', 'high'),
        createTestCharacter('c3', 'low'),
      ];
      
      const sorted = sortCharactersForSequence(characters);
      
      assert.strictEqual(sorted[0]?.characterId, 'c2');
      assert.strictEqual(sorted[1]?.characterId, 'c1');
      assert.strictEqual(sorted[2]?.characterId, 'c3');
    // Provider-specific function removed);

    it('should sort by talkativeness for same priority', () => {
      const characters = [
        createTestCharacter('c1', 'normal', 0.3),
        createTestCharacter('c2', 'normal', 0.7),
        createTestCharacter('c3', 'normal', 0.5),
      ];
      
      const sorted = sortCharactersForSequence(characters);
      
      assert.strictEqual(sorted[0]?.characterId, 'c2');
      assert.strictEqual(sorted[1]?.characterId, 'c3');
      assert.strictEqual(sorted[2]?.characterId, 'c1');
    // Provider-specific function removed);
  // Provider-specific function removed);

  describe('applyAdjustmentsToSequence', () => {
    it('should apply single adjustment', () => {
      const characters = [
        createTestCharacter('c1'),
        createTestCharacter('c2'),
        createTestCharacter('c3'),
      ];
      
      const sequence = createInitialSequence(characters);
      const adjustment: SequenceAdjustmentRequest = {
        characterId: 'c3',
        requestedPosition: 'next',
        reason: 'Need to respond immediately',
        urgency: 'high',
      // Provider-specific function removed;
      
      const adjusted = applyAdjustmentsToSequence(sequence, [adjustment]);
      
      assert.strictEqual(adjusted.entries[0]?.characterId, 'c3');
    // Provider-specific function removed);

    it('should apply multiple adjustments in urgency order', () => {
      const characters = [
        createTestCharacter('c1'),
        createTestCharacter('c2'),
        createTestCharacter('c3'),
        createTestCharacter('c4'),
      ];
      
      const sequence = createInitialSequence(characters);
      const adjustments: SequenceAdjustmentRequest[] = [
        {
          characterId: 'c3',
          requestedPosition: 1,
          reason: 'Low urgency',
          urgency: 'low',
        // Provider-specific function removed,
        {
          characterId: 'c4',
          requestedPosition: 0,
          reason: 'High urgency',
          urgency: 'high',
        // Provider-specific function removed,
      ];
      
      const adjusted = applyAdjustmentsToSequence(sequence, adjustments);
      
      assert.strictEqual(adjusted.entries[0]?.characterId, 'c4');
      assert.strictEqual(adjusted.entries[1]?.characterId, 'c3');
    // Provider-specific function removed);

    it('should return unchanged sequence for empty adjustments', () => {
      const characters = [createTestCharacter('c1')];
      const sequence = createInitialSequence(characters);
      
      const adjusted = applyAdjustmentsToSequence(sequence, []);
      
      assert.deepStrictEqual(adjusted, sequence);
    // Provider-specific function removed);
  // Provider-specific function removed);

  describe('getCharacterPosition', () => {
    it('should return correct position', () => {
      const characters = [
        createTestCharacter('c1'),
        createTestCharacter('c2'),
      ];
      
      const sequence = createInitialSequence(characters);
      
      assert.strictEqual(getCharacterPosition(sequence, 'c1'), 0);
      assert.strictEqual(getCharacterPosition(sequence, 'c2'), 1);
    // Provider-specific function removed);

    it('should return -1 for unknown character', () => {
      const characters = [createTestCharacter('c1')];
      const sequence = createInitialSequence(characters);
      
      assert.strictEqual(getCharacterPosition(sequence, 'unknown'), -1);
    // Provider-specific function removed);
  // Provider-specific function removed);

  describe('getCharactersInOrder', () => {
    it('should return character ids in position order', () => {
      const characters = [
        createTestCharacter('c1'),
        createTestCharacter('c2'),
        createTestCharacter('c3'),
      ];
      
      const sequence = createInitialSequence(characters);
      const order = getCharactersInOrder(sequence);
      
      assert.deepStrictEqual(order, ['c1', 'c2', 'c3']);
    // Provider-specific function removed);
  // Provider-specific function removed);

  describe('getNextCharacterInSequence', () => {
    it('should return next character', () => {
      const characters = [
        createTestCharacter('c1'),
        createTestCharacter('c2'),
        createTestCharacter('c3'),
      ];
      
      const sequence = createInitialSequence(characters);
      
      assert.strictEqual(getNextCharacterInSequence(sequence, 'c1'), 'c2');
      assert.strictEqual(getNextCharacterInSequence(sequence, 'c2'), 'c3');
    // Provider-specific function removed);

    it('should return null for last character', () => {
      const characters = [
        createTestCharacter('c1'),
        createTestCharacter('c2'),
      ];
      
      const sequence = createInitialSequence(characters);
      
      assert.strictEqual(getNextCharacterInSequence(sequence, 'c2'), null);
    // Provider-specific function removed);

    it('should return null for unknown character', () => {
      const characters = [createTestCharacter('c1')];
      const sequence = createInitialSequence(characters);
      
      assert.strictEqual(getNextCharacterInSequence(sequence, 'unknown'), null);
    // Provider-specific function removed);
  // Provider-specific function removed);

  describe('createAdjustmentRequest', () => {
    it('should create request with default values', () => {
      const request = createAdjustmentRequest('c1', 'test reason');
      
      assert.strictEqual(request.characterId, 'c1');
      assert.strictEqual(request.reason, 'test reason');
      assert.strictEqual(request.urgency, 'medium');
      assert.strictEqual(request.requestedPosition, 'next');
    // Provider-specific function removed);

    it('should create request with custom values', () => {
      const request = createAdjustmentRequest('c1', 'test reason', 'high', 'last');
      
      assert.strictEqual(request.urgency, 'high');
      assert.strictEqual(request.requestedPosition, 'last');
    // Provider-specific function removed);
  // Provider-specific function removed);

  describe('mergeSequencesForRound', () => {
    it('should keep existing order for kept characters', () => {
      const characters = [
        createTestCharacter('c1'),
        createTestCharacter('c2'),
        createTestCharacter('c3'),
      ];
      
      const previous = createInitialSequence(characters, 1);
      const activeIds = ['c1', 'c3'];
      
      const merged = mergeSequencesForRound(previous, activeIds, 2);
      
      assert.strictEqual(merged.round, 2);
      assert.deepStrictEqual(getCharactersInOrder(merged), ['c1', 'c3']);
    // Provider-specific function removed);

    it('should add new characters at end', () => {
      const characters = [
        createTestCharacter('c1'),
        createTestCharacter('c2'),
      ];
      
      const previous = createInitialSequence(characters, 1);
      const activeIds = ['c1', 'c2', 'c3'];
      
      const merged = mergeSequencesForRound(previous, activeIds, 2);
      
      assert.deepStrictEqual(getCharactersInOrder(merged), ['c1', 'c2', 'c3']);
    // Provider-specific function removed);

    it('should remove inactive characters', () => {
      const characters = [
        createTestCharacter('c1'),
        createTestCharacter('c2'),
        createTestCharacter('c3'),
      ];
      
      const previous = createInitialSequence(characters, 1);
      const activeIds = ['c1'];
      
      const merged = mergeSequencesForRound(previous, activeIds, 2);
      
      assert.strictEqual(merged.entries.length, 1);
      assert.strictEqual(merged.entries[0]?.characterId, 'c1');
    // Provider-specific function removed);
  // Provider-specific function removed);
// Provider-specific function removed);