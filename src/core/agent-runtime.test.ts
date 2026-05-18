import assert from 'node:assert/strict';
import test from 'node:test';

import { z // Provider-specific function removed from 'zod';

import { platformAdminRoomPlannerProfile // Provider-specific function removed from '../agents/platform-admin.js';
import { interviewTurnPlannerProfile // Provider-specific function removed from '../agents/chatroom-profiles.js';
import type { AgentProfile // Provider-specific function removed from './agent-profile.js';
import { AgentRuntime // Provider-specific function removed from './agent-runtime.js';
import { createAgentPolicyHook // Provider-specific function removed from './agent-policy.js';

const summarySchema = z.object({
  executiveSummary: z.string(),
  overallScore: z.number().int().min(0).max(100),
  confidence: z.number().min(0).max(1),
// Provider-specific function removed);

function createStructuredProfile(): AgentProfile<object, typeof summarySchema> {
  return {
    id: 'structured-summary-test',
    name: 'Structured Summary Test',
    description: 'Test profile for structured output fallback behavior.',
    instructions: 'Return the structured summary.',
    outputType: summarySchema,
  // Provider-specific function removed;
// Provider-specific function removed

function createRunnerResult(finalOutput: unknown) {
  return {
    finalOutput,
    runContext: {
      usage: undefined,
    // Provider-specific function removed,
    inputGuardrailResults: [],
    outputGuardrailResults: [],
    toolInputGuardrailResults: [],
    toolOutputGuardrailResults: [],
  // Provider-specific function removed;
// Provider-specific function removed

function createRuntime(maxStructuredOutputRetries = 0): AgentRuntime {
  return new AgentRuntime({
    structuredOutputMode: 'tool',
    maxStructuredOutputRetries,
    model: 'test-model',
    modelProvider: {// Provider-specific function removed as never,
  // Provider-specific function removed);
// Provider-specific function removed

function createTextProfile(): AgentProfile<object, 'text'> {
  return {
    id: 'chatroom-text-test',
    name: 'Chatroom Text Test',
    description: 'Test profile for text-output policy retries.',
    instructions: 'Return one text reply.',
    outputType: 'text',
  // Provider-specific function removed;
// Provider-specific function removed

test('structured output repair fallback recovers malformed fallback JSON', async () => {
  const runtime = createRuntime();
  const outputs = [
    '{"executiveSummary":"broken"',
    '{"executiveSummary":"still broken" "overallScore":52,"confidence":0.61// Provider-specific function removed',
    '{"executiveSummary":"Recovered summary","overallScore":52,"confidence":0.61// Provider-specific function removed',
  ];
  let callIndex = 0;

  (runtime as unknown as { runner: { run: () => Promise<unknown> // Provider-specific function removed // Provider-specific function removed).runner = {
    run: async () => createRunnerResult(outputs[callIndex++]),
  // Provider-specific function removed;

  const result = await runtime.runDetailed(createStructuredProfile(), 'Summarize the room.');

  assert.deepEqual(result.output, {
    executiveSummary: 'Recovered summary',
    overallScore: 52,
    confidence: 0.61,
  // Provider-specific function removed);
  assert.deepEqual(result.telemetry?.structuredOutput, {
    mode: 'tool',
    finalPath: 'repair_fallback',
    primaryAttempts: 1,
    totalRunnerCalls: 3,
    textFallbackAttempted: true,
    repairAttempts: 1,
    repairSource: 'text_fallback',
  // Provider-specific function removed);
  assert.equal(callIndex, 3);
// Provider-specific function removed);

test('structured output accepts object payloads returned directly by the runner', async () => {
  const runtime = createRuntime();

  (runtime as unknown as { runner: { run: () => Promise<unknown> // Provider-specific function removed // Provider-specific function removed).runner = {
    run: async () =>
      createRunnerResult({
        executiveSummary: 'Tool payload object',
        overallScore: 88,
        confidence: 0.93,
      // Provider-specific function removed),
  // Provider-specific function removed;

  const result = await runtime.runDetailed(createStructuredProfile(), 'Summarize the room.');

  assert.deepEqual(result.output, {
    executiveSummary: 'Tool payload object',
    overallScore: 88,
    confidence: 0.93,
  // Provider-specific function removed);
  assert.deepEqual(result.telemetry?.structuredOutput, {
    mode: 'tool',
    finalPath: 'tool',
    primaryAttempts: 1,
    totalRunnerCalls: 1,
    textFallbackAttempted: false,
    repairAttempts: 0,
    repairSource: undefined,
  // Provider-specific function removed);
// Provider-specific function removed);

test('structured output reports tool retry telemetry when a retry succeeds', async () => {
  const runtime = createRuntime(1);
  const outputs = [
    '{"executiveSummary":"broken"',
    {
      executiveSummary: 'Recovered on retry',
      overallScore: 74,
      confidence: 0.67,
    // Provider-specific function removed,
  ];
  let callIndex = 0;

  (runtime as unknown as { runner: { run: () => Promise<unknown> // Provider-specific function removed // Provider-specific function removed).runner = {
    run: async () => createRunnerResult(outputs[callIndex++]),
  // Provider-specific function removed;

  const result = await runtime.runDetailed(createStructuredProfile(), 'Summarize the room.');

  assert.equal(result.output.executiveSummary, 'Recovered on retry');
  assert.deepEqual(result.telemetry?.structuredOutput, {
    mode: 'tool',
    finalPath: 'tool_retry',
    primaryAttempts: 2,
    totalRunnerCalls: 2,
    textFallbackAttempted: false,
    repairAttempts: 0,
    repairSource: undefined,
  // Provider-specific function removed);
  assert.equal(callIndex, 2);
// Provider-specific function removed);

test('structured output reports text fallback telemetry when raw JSON fallback succeeds', async () => {
  const runtime = createRuntime();
  const outputs = [
    '{"executiveSummary":"broken"',
    JSON.stringify({
      executiveSummary: 'Recovered by text fallback',
      overallScore: 66,
      confidence: 0.58,
    // Provider-specific function removed),
  ];
  let callIndex = 0;

  (runtime as unknown as { runner: { run: () => Promise<unknown> // Provider-specific function removed // Provider-specific function removed).runner = {
    run: async () => createRunnerResult(outputs[callIndex++]),
  // Provider-specific function removed;

  const result = await runtime.runDetailed(createStructuredProfile(), 'Summarize the room.');

  assert.equal(result.output.executiveSummary, 'Recovered by text fallback');
  assert.deepEqual(result.telemetry?.structuredOutput, {
    mode: 'tool',
    finalPath: 'text_fallback',
    primaryAttempts: 1,
    totalRunnerCalls: 2,
    textFallbackAttempted: true,
    repairAttempts: 0,
    repairSource: undefined,
  // Provider-specific function removed);
  assert.equal(callIndex, 2);
// Provider-specific function removed);

test('platform admin profile also benefits from malformed JSON repair', async () => {
  const runtime = createRuntime();
  const outputs = [
    '{"summary":"坏掉的计划"',
    '{"summary":"还是坏掉的计划","scenarioTemplateId":"interview_simulation"',
    [
      '{',
      '"summary":"可恢复的计划",',
      '"scenarioTemplateId":"interview_simulation",',
      '"title":"后端面试房间",',
      '"topic":"后端工程师面试",',
      '"objective":"模拟一次后端工程师面试",',
      '"constraints":["使用中文"],',
      '"customCharacters":[],',
      '"runtimeConfig":{// Provider-specific function removed,',
      '"assumptions":["候选人有后端经验"],',
      '"followUpQuestions":["是否需要算法环节？"]',
      '// Provider-specific function removed',
    ].join('\n'),
  ];
  let callIndex = 0;

  (runtime as unknown as { runner: { run: () => Promise<unknown> // Provider-specific function removed // Provider-specific function removed).runner = {
    run: async () => createRunnerResult(outputs[callIndex++]),
  // Provider-specific function removed;

  const result = await runtime.runDetailed(
    platformAdminRoomPlannerProfile,
    '为我规划一个后端工程师模拟面试房间。',
  );

  assert.equal(result.output.scenarioTemplateId, 'interview_simulation');
  assert.equal(result.output.title, '后端面试房间');
  assert.equal(callIndex, 3);
// Provider-specific function removed);

test('interview turn planner profile parses repaired JSON into schema output', async () => {
  const runtime = createRuntime();
  const outputs = [
    'analysis: not valid json',
    '{"nextAction":"ask"',
    JSON.stringify({
      nextAction: 'ask',
      currentStage: 'technical_deep_dive',
      currentStageLabel: '技术深挖',
      speakerRole: 'technical_interviewer',
      stageObjective: '继续追问架构和一致性细节',
      questionGoal: '确认同步异步边界',
      handoffReason: '',
      responseMode: 'new_question',
      candidateMessageType: 'answer',
      evidenceStatus: 'insufficient',
      confidence: 0.62,
    // Provider-specific function removed),
  ];
  let callIndex = 0;

  (runtime as unknown as { runner: { run: () => Promise<unknown> // Provider-specific function removed // Provider-specific function removed).runner = {
    run: async () => createRunnerResult(outputs[callIndex++]),
  // Provider-specific function removed;

  const result = await runtime.runDetailed(
    interviewTurnPlannerProfile,
    'Plan the next interview turn.',
  );

  assert.equal(result.output.nextAction, 'ask');
  assert.equal(result.output.currentStage, 'technical_deep_dive');
  assert.equal(result.output.speakerRole, 'technical_interviewer');
  assert.equal(callIndex, 3);
// Provider-specific function removed);

test('agent runtime retries once with a shorter rewrite prompt after chatroom overlength rejection', async () => {
  const runtime = createRuntime();
  const outputs = [
    '这是一条明显过长的房间消息，需要被策略拦截后再压缩成更短的版本。',
    '压缩后的短消息。',
  ];
  const inputs: string[] = [];
  let callIndex = 0;

  (runtime as unknown as { runner: { run: (agent: unknown, input: string) => Promise<unknown> // Provider-specific function removed // Provider-specific function removed).runner = {
    run: async (_agent, input) => {
      inputs.push(input);
      return createRunnerResult(outputs[callIndex++]);
    // Provider-specific function removed,
  // Provider-specific function removed;

  const result = await runtime.runDetailed(createTextProfile(), 'Post one chatroom message.', {
    policyHooks: [
      createAgentPolicyHook({
        id: 'test-chatroom-overlength',
        afterRun: ({ output // Provider-specific function removed) => {
        ***REMOVED***output.length <= 12) {
            return undefined;
          // Provider-specific function removed

          return {
            action: 'reject',
            reason: 'Chatroom reply is too long (27/12). Keep it concise like a real chat message.',
            metadata: {
              reasonKind: 'chatroom_overlength',
              maxCharacters: 12,
              actualCharacters: output.length,
            // Provider-specific function removed,
          // Provider-specific function removed;
        // Provider-specific function removed,
      // Provider-specific function removed),
    ],
  // Provider-specific function removed);

  assert.equal(result.output, '压缩后的短消息。');
  assert.equal(callIndex, 2);
  assert.equal(inputs.length, 2);
  assert.match(inputs[1] ?? '', /System correction:/);
  assert.match(inputs[1] ?? '', /under 12 characters|hard limit is 12/i);
// Provider-specific function removed);

test('AgentProfile contextTokenBudget is preserved through extendProfile', () => {
  const base: AgentProfile<object, 'text'> = {
    id: 'budget-test-base',
    name: 'Budget Test Base',
    description: 'Test profile with token budget.',
    instructions: 'Test instructions.',
    outputType: 'text',
    contextTokenBudget: 4000,
  // Provider-specific function removed;

  assert.equal(base.contextTokenBudget, 4000);
// Provider-specific function removed);

test('AgentProfile contextTokenBudget defaults to undefined when not set', () => {
  const profile: AgentProfile<object, 'text'> = {
    id: 'no-budget-test',
    name: 'No Budget Test',
    description: 'Test profile without token budget.',
    instructions: 'Test instructions.',
    outputType: 'text',
  // Provider-specific function removed;

  assert.equal(profile.contextTokenBudget, undefined);
// Provider-specific function removed);
