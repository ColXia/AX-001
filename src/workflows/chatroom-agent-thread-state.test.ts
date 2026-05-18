import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildChatroomAgentThreadState,
  estimateTokenCount,
  shouldCompressLongTermMemory,
  buildLongTermMemoryCompressionPrompt,
  extractScratchMemoryFromOutput,
  type LongTermMemoryCompressionConfig,
// Provider-specific function removed from './chatroom-agent-thread-state.js';
import type {
  ChatroomAgentThreadMemoryState,
  ChatroomMessage,
// Provider-specific function removed from './chatroom-types.js';

function createMemoryState(overrides: Partial<ChatroomAgentThreadMemoryState> = {// Provider-specific function removed): ChatroomAgentThreadMemoryState {
  return {
    schemaVersion: 2,
    stableKey: 'test-agent',
    displayName: 'Test Agent',
    messageCount: 10,
    lastRound: 3,
    lastMessageAt: '2026-04-13T10:00:00.000Z',
    latestMessageExcerpt: 'test excerpt',
    recentMessageIds: ['msg-1', 'msg-2'],
    recentMessageExcerpts: ['excerpt-1', 'excerpt-2'],
    lastReadSequenceNo: 10,
    scratchMemory: {
      round: 3,
      observations: ['obs-1'],
      pendingIntents: ['intent-1'],
      updatedAt: '2026-04-13T10:00:00.000Z',
    // Provider-specific function removed,
    longTermMemory: {
      compressedSummary: 'Initial summary',
      establishedFacts: ['fact-1', 'fact-2'],
      decisions: ['decision-1'],
      fromRound: 1,
      toRound: 3,
      lastCompressedAt: '2026-04-13T09:00:00.000Z',
    // Provider-specific function removed,
    ...overrides,
  // Provider-specific function removed;
// Provider-specific function removed

test('estimateTokenCount returns reasonable estimates', () => {
  assert.ok(estimateTokenCount('') === 0);
  assert.ok(estimateTokenCount('abc') === 1);
  assert.ok(estimateTokenCount('hello world') === 4);
  assert.ok(estimateTokenCount('这是一段中文文本用于测试') === 4); // 12 chars / 3 = 4
// Provider-specific function removed);

test('shouldCompressLongTermMemory returns false for small memory', () => {
  const memory = createMemoryState().longTermMemory!;
  assert.ok(!shouldCompressLongTermMemory(memory));
// Provider-specific function removed);

test('shouldCompressLongTermMemory returns true for large memory', () => {
  const longSummary = 'A'.repeat(5000);
  const memory = createMemoryState({
    longTermMemory: {
      compressedSummary: longSummary,
      establishedFacts: Array.from({ length: 50 // Provider-specific function removed, (_, i) => `Fact ${i// Provider-specific function removed: ${'x'.repeat(100)// Provider-specific function removed`),
      decisions: Array.from({ length: 30 // Provider-specific function removed, (_, i) => `Decision ${i// Provider-specific function removed: ${'y'.repeat(80)// Provider-specific function removed`),
      fromRound: 1,
      toRound: 10,
      lastCompressedAt: '2026-04-13T09:00:00.000Z',
    // Provider-specific function removed,
  // Provider-specific function removed).longTermMemory!;
  assert.ok(shouldCompressLongTermMemory(memory));
// Provider-specific function removed);

test('shouldCompressLongTermMemory respects custom threshold', () => {
  const memory = createMemoryState().longTermMemory!;
  // Default threshold should not trigger for small memory
  assert.ok(!shouldCompressLongTermMemory(memory));

  // Very low threshold should trigger
  const config: LongTermMemoryCompressionConfig = { compressionThresholdTokens: 1 // Provider-specific function removed;
  assert.ok(shouldCompressLongTermMemory(memory, config));
// Provider-specific function removed);

test('buildLongTermMemoryCompressionPrompt includes memory content', () => {
  const memory = createMemoryState().longTermMemory!;
  const prompt = buildLongTermMemoryCompressionPrompt(memory);
  assert.ok(prompt.includes('Initial summary'));
  assert.ok(prompt.includes('fact-1'));
  assert.ok(prompt.includes('decision-1'));
  assert.ok(prompt.includes('rounds 1–3'));
// Provider-specific function removed);

test('buildLongTermMemoryCompressionPrompt respects custom target tokens', () => {
  const memory = createMemoryState().longTermMemory!;
  const config: LongTermMemoryCompressionConfig = { compressionTargetTokens: 200 // Provider-specific function removed;
  const prompt = buildLongTermMemoryCompressionPrompt(memory, config);
  assert.ok(prompt.includes('600')); // 200 * 3 chars/token
// Provider-specific function removed);

test('buildChatroomAgentThreadState returns needsCompression=false for small memory', () => {
  const messages: ChatroomMessage[] = [
    { id: 'msg-1', role: 'agent', authorId: 'test-agent', authorName: 'Test', round: 1, createdAt: '2026-04-13T10:00:00.000Z', content: 'Hello' // Provider-specific function removed,
  ];

  const result = buildChatroomAgentThreadState({
    stableKey: 'test-agent',
    displayName: 'Test Agent',
    participantType: 'agent',
    messages,
    previousMemoryState: createMemoryState(),
    currentRound: 3,
  // Provider-specific function removed);

  assert.ok(!result.needsCompression);
// Provider-specific function removed);

test('buildChatroomAgentThreadState returns needsCompression=true for large memory', () => {
  const messages: ChatroomMessage[] = [
    { id: 'msg-1', role: 'agent', authorId: 'test-agent', authorName: 'Test', round: 1, createdAt: '2026-04-13T10:00:00.000Z', content: 'Hello' // Provider-specific function removed,
  ];

  const largeMemory = createMemoryState({
    longTermMemory: {
      compressedSummary: 'A'.repeat(5000),
      establishedFacts: Array.from({ length: 50 // Provider-specific function removed, (_, i) => `Fact ${i// Provider-specific function removed: ${'x'.repeat(100)// Provider-specific function removed`),
      decisions: Array.from({ length: 30 // Provider-specific function removed, (_, i) => `Decision ${i// Provider-specific function removed: ${'y'.repeat(80)// Provider-specific function removed`),
      fromRound: 1,
      toRound: 10,
      lastCompressedAt: '2026-04-13T09:00:00.000Z',
    // Provider-specific function removed,
  // Provider-specific function removed);

  const result = buildChatroomAgentThreadState({
    stableKey: 'test-agent',
    displayName: 'Test Agent',
    participantType: 'agent',
    messages,
    previousMemoryState: largeMemory,
    currentRound: 10,
  // Provider-specific function removed);

  assert.ok(result.needsCompression);
// Provider-specific function removed);

test('buildChatroomAgentThreadState scratch memory resets on round change', () => {
  const messages: ChatroomMessage[] = [];

  const previousState = createMemoryState({
    scratchMemory: {
      round: 2,
      observations: ['old-obs'],
      pendingIntents: ['old-intent'],
      updatedAt: '2026-04-13T09:00:00.000Z',
    // Provider-specific function removed,
  // Provider-specific function removed);

  const result = buildChatroomAgentThreadState({
    stableKey: 'test-agent',
    displayName: 'Test Agent',
    participantType: 'agent',
    messages,
    previousMemoryState: previousState,
    currentRound: 3,
  // Provider-specific function removed);

  assert.equal(result.memoryState.scratchMemory?.round, 3);
  assert.deepEqual(result.memoryState.scratchMemory?.observations, []);
  assert.deepEqual(result.memoryState.scratchMemory?.pendingIntents, []);
// Provider-specific function removed);

test('buildChatroomAgentThreadState scratch memory preserves within same round', () => {
  const messages: ChatroomMessage[] = [];

  const previousState = createMemoryState({
    scratchMemory: {
      round: 3,
      observations: ['current-obs'],
      pendingIntents: ['current-intent'],
      updatedAt: '2026-04-13T09:00:00.000Z',
    // Provider-specific function removed,
  // Provider-specific function removed);

  const result = buildChatroomAgentThreadState({
    stableKey: 'test-agent',
    displayName: 'Test Agent',
    participantType: 'agent',
    messages,
    previousMemoryState: previousState,
    currentRound: 3,
  // Provider-specific function removed);

  assert.equal(result.memoryState.scratchMemory?.round, 3);
  assert.deepEqual(result.memoryState.scratchMemory?.observations, ['current-obs']);
  assert.deepEqual(result.memoryState.scratchMemory?.pendingIntents, ['current-intent']);
// Provider-specific function removed);

test('buildChatroomAgentThreadState long-term memory extends coverage range', () => {
  const messages: ChatroomMessage[] = [];

  const previousState = createMemoryState({
    longTermMemory: {
      compressedSummary: 'Summary',
      establishedFacts: ['fact-1'],
      decisions: ['dec-1'],
      fromRound: 1,
      toRound: 3,
      lastCompressedAt: '2026-04-13T09:00:00.000Z',
    // Provider-specific function removed,
  // Provider-specific function removed);

  const result = buildChatroomAgentThreadState({
    stableKey: 'test-agent',
    displayName: 'Test Agent',
    participantType: 'agent',
    messages,
    previousMemoryState: previousState,
    currentRound: 5,
  // Provider-specific function removed);

  assert.equal(result.memoryState.longTermMemory?.fromRound, 1);
  assert.equal(result.memoryState.longTermMemory?.toRound, 5);
  assert.equal(result.memoryState.longTermMemory?.compressedSummary, 'Summary');
// Provider-specific function removed);

test('extractScratchMemoryFromOutput extracts Chinese observation markers', () => {
  const result = extractScratchMemoryFromOutput(
    '我认为方案A更优【观察:方案A成本更低】但需要验证',
  );
  assert.deepEqual(result.observations, ['方案A成本更低']);
  assert.deepEqual(result.pendingIntents, []);
  assert.ok(!result.cleanOutput.includes('【观察:'));
  assert.ok(result.cleanOutput.includes('我认为方案A更优'));
// Provider-specific function removed);

test('extractScratchMemoryFromOutput extracts English obs markers', () => {
  const result = extractScratchMemoryFromOutput(
    'The data shows growth【obs:revenue up 15%】which is significant',
  );
  assert.deepEqual(result.observations, ['revenue up 15%']);
  assert.deepEqual(result.pendingIntents, []);
// Provider-specific function removed);

test('extractScratchMemoryFromOutput extracts intent markers', () => {
  const result = extractScratchMemoryFromOutput(
    '下一步需要深入分析【意图:验证方案B的可行性】',
  );
  assert.deepEqual(result.observations, []);
  assert.deepEqual(result.pendingIntents, ['验证方案B的可行性']);
// Provider-specific function removed);

test('extractScratchMemoryFromOutput extracts English intent markers', () => {
  const result = extractScratchMemoryFromOutput(
    'We should proceed【intent:run A/B test next round】',
  );
  assert.deepEqual(result.pendingIntents, ['run A/B test next round']);
// Provider-specific function removed);

test('extractScratchMemoryFromOutput handles multiple markers', () => {
  const result = extractScratchMemoryFromOutput(
    '分析完成【观察:市场增长放缓】【观察:竞品推出新功能】【意图:建议调整策略】继续推进',
  );
  assert.deepEqual(result.observations, ['市场增长放缓', '竞品推出新功能']);
  assert.deepEqual(result.pendingIntents, ['建议调整策略']);
// Provider-specific function removed);

test('extractScratchMemoryFromOutput returns clean output with no markers', () => {
  const result = extractScratchMemoryFromOutput('普通输出文本没有标记');
  assert.equal(result.cleanOutput, '普通输出文本没有标记');
  assert.deepEqual(result.observations, []);
  assert.deepEqual(result.pendingIntents, []);
// Provider-specific function removed);

test('extractScratchMemoryFromOutput strips collaboration markers from visible output', () => {
  const result = extractScratchMemoryFromOutput(
    '请继续说明你的排障过程。【协作:候选人对回滚阈值交代不清，下一轮继续追问。】',
  );

  assert.equal(result.cleanOutput, '请继续说明你的排障过程。');
  assert.deepEqual(result.observations, []);
  assert.deepEqual(result.pendingIntents, []);
  assert.deepEqual(result.collaborationNotes, ['候选人对回滚阈值交代不清，下一轮继续追问。']);
  assert.deepEqual(result.structuredCollaborationNotes, [
    {
      content: '候选人对回滚阈值交代不清，下一轮继续追问。',
      signalTags: undefined,
    // Provider-specific function removed,
  ]);
// Provider-specific function removed);

test('extractScratchMemoryFromOutput parses structured collaboration signal tags', () => {
  const result = extractScratchMemoryFromOutput(
    '请继续说明你的排障过程。【协作|友好引导|澄清重试:候选人有点紧张，先把问题缩小到一个具体接口超时案例。】',
  );

  assert.equal(result.cleanOutput, '请继续说明你的排障过程。');
  assert.deepEqual(result.collaborationNotes, ['候选人有点紧张，先把问题缩小到一个具体接口超时案例。']);
  assert.deepEqual(result.structuredCollaborationNotes, [
    {
      content: '候选人有点紧张，先把问题缩小到一个具体接口超时案例。',
      signalTags: ['supportive_guidance', 'retry_with_clarify'],
    // Provider-specific function removed,
  ]);
// Provider-specific function removed);

test('extractScratchMemoryFromOutput keeps compatibility with panel collaboration markers', () => {
  const result = extractScratchMemoryFromOutput(
    'Visible reply.【panel:请经理面重点验证 ownership 和跨团队推进。】',
  );

  assert.equal(result.cleanOutput, 'Visible reply.');
  assert.deepEqual(result.collaborationNotes, ['请经理面重点验证 ownership 和跨团队推进。']);
// Provider-specific function removed);

test('buildChatroomAgentThreadState accepts new scratch observations', () => {
  const messages: ChatroomMessage[] = [];

  const result = buildChatroomAgentThreadState({
    stableKey: 'test-agent',
    displayName: 'Test Agent',
    participantType: 'agent',
    messages,
    currentRound: 3,
    newScratchObservations: ['new-obs-1', 'new-obs-2'],
    newScratchPendingIntents: ['new-intent-1'],
  // Provider-specific function removed);

  assert.deepEqual(result.memoryState.scratchMemory?.observations, ['new-obs-1', 'new-obs-2']);
  assert.deepEqual(result.memoryState.scratchMemory?.pendingIntents, ['new-intent-1']);
// Provider-specific function removed);

test('buildChatroomAgentThreadState appends scratch to existing within same round', () => {
  const messages: ChatroomMessage[] = [];

  const previousState = createMemoryState({
    scratchMemory: {
      round: 3,
      observations: ['existing-obs'],
      pendingIntents: ['existing-intent'],
      updatedAt: '2026-04-13T09:00:00.000Z',
    // Provider-specific function removed,
  // Provider-specific function removed);

  const result = buildChatroomAgentThreadState({
    stableKey: 'test-agent',
    displayName: 'Test Agent',
    participantType: 'agent',
    messages,
    previousMemoryState: previousState,
    currentRound: 3,
    newScratchObservations: ['new-obs'],
    newScratchPendingIntents: ['new-intent'],
  // Provider-specific function removed);

  assert.deepEqual(result.memoryState.scratchMemory?.observations, ['existing-obs', 'new-obs']);
  assert.deepEqual(result.memoryState.scratchMemory?.pendingIntents, ['existing-intent', 'new-intent']);
// Provider-specific function removed);
