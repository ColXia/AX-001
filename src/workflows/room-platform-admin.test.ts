import assert from 'node:assert/strict';
import test from 'node:test';

import { AgentRuntime // Provider-specific function removed from '../core/agent-runtime.js';
import {
  advanceRoomPlanningWithPlatformAdmin,
  createPlatformAdminConversationState,
// Provider-specific function removed from '../room-app/room-platform-admin.js';

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

function createRuntime(outputs: unknown[]): AgentRuntime {
  const runtime = new AgentRuntime({
    structuredOutputMode: 'tool',
    maxStructuredOutputRetries: 0,
    model: 'test-model',
    modelProvider: {// Provider-specific function removed as never,
  // Provider-specific function removed);
  let callIndex = 0;

  (runtime as unknown as { runner: { run: () => Promise<unknown> // Provider-specific function removed // Provider-specific function removed).runner = {
    run: async () => createRunnerResult(outputs[callIndex++]),
  // Provider-specific function removed;

  return runtime;
// Provider-specific function removed

test('platform admin conversation asks for clarification before creating a room', async () => {
  const runtime = createRuntime([
    {
      status: 'needs_clarification',
      assistantMessage:
        '我可以先按面试房来规划，但还需要两个关键信息：目标岗位是什么？重点想练哪些面试方向？',
      summary: 'Need the target role and the main focus areas before finalizing the room.',
      tentativeScenarioTemplateId: 'interview_simulation',
      assumptions: ['The user wants an interview practice room.'],
      followUpQuestions: ['目标岗位是什么？', '重点想练哪些面试方向？'],
    // Provider-specific function removed,
  ]);

  const result = await advanceRoomPlanningWithPlatformAdmin(runtime, {
    userMessage: '我想做一次模拟面试',
  // Provider-specific function removed);

  assert.equal(result.status, 'needs_clarification');
  assert.equal(result.tentativeScenarioTemplateId, 'interview_simulation');
  assert.deepEqual(result.followUpQuestions, ['目标岗位是什么？', '重点想练哪些面试方向？']);
  assert.equal(result.conversation.turns.length, 2);
  assert.equal(result.conversation.turns[0]?.role, 'user');
  assert.equal(result.conversation.turns[1]?.role, 'assistant');
  assert.equal(result.conversation.followUpRoundCount, 1);
  assert.deepEqual(result.conversation.assumptions, [
    'The user wants an interview practice room.',
  ]);
// Provider-specific function removed);

test('platform admin conversation finalizes a blueprint after follow-up answers arrive', async () => {
  const runtime = createRuntime([
    {
      status: 'ready',
      assistantMessage: '信息已经够了，我会为你创建一个后端面试模拟房。',
      roomPlan: {
        summary: 'Create a backend interview simulation room focused on system design and databases.',
        scenarioTemplateId: 'interview_simulation',
        title: '后端面试模拟房',
        topic: '中级后端工程师模拟面试',
        objective: '模拟一次真实后端工程师面试，并在结束后给出问题清单与改进建议。',
        constraints: ['使用简体中文'],
        customCharacters: [],
        runtimeConfig: {
          summaryEnabled: true,
          maxReplyCharacters: 1200,
        // Provider-specific function removed,
        governance: {
          roomAdmin: {
            enabled: true,
            interventionStyle: 'on_demand',
            canManagePhases: true,
          // Provider-specific function removed,
          recorder: {
            updateMode: 'continuous',
            artifactFocus: ['candidate evidence', 'handoff notes'],
          // Provider-specific function removed,
        // Provider-specific function removed,
        interview: {
          candidateName: '候选人',
          targetRole: '后端工程师',
          candidateBackground: '3 年后端开发经验，做过订单与支付系统。',
          targetLevel: '中级',
          companyStyle: '深度追问',
          focusAreas: ['系统设计', '数据库', '并发'],
        // Provider-specific function removed,
        assumptions: [],
        followUpQuestions: [],
      // Provider-specific function removed,
    // Provider-specific function removed,
  ]);

  const conversation = createPlatformAdminConversationState({
    request: '我想做一次模拟面试',
  // Provider-specific function removed);
  conversation.pendingQuestions = ['目标岗位是什么？', '重点想练哪些面试方向？'];
  conversation.followUpRoundCount = 1;
  conversation.turns = [
    {
      role: 'user',
      content: '我想做一次模拟面试',
      createdAt: '2026-04-11T00:00:00.000Z',
    // Provider-specific function removed,
    {
      role: 'assistant',
      content: '请告诉我目标岗位和重点方向。',
      createdAt: '2026-04-11T00:00:01.000Z',
    // Provider-specific function removed,
  ];

  const result = await advanceRoomPlanningWithPlatformAdmin(runtime, {
    conversation,
    userMessage: '岗位是后端工程师，重点想练系统设计、数据库和并发。',
    runtimeConfig: {
      parallelBatchSize: 4,
    // Provider-specific function removed,
  // Provider-specific function removed);

  assert.equal(result.status, 'ready');
  assert.equal(result.adminPlan.scenarioTemplateId, 'interview_simulation');
  assert.equal(result.blueprint.scenarioTemplateId, 'interview_simulation');
  assert.equal(result.blueprint.title, '后端面试模拟房');
  assert.equal(result.blueprint.runtimeConfig.maxReplyCharacters, 1200);
  assert.equal(result.blueprint.governance.roomAdmin.enabled, true);
  assert.equal(result.blueprint.governance.roomAdmin.interventionStyle, 'on_demand');
  assert.equal(result.blueprint.governance.roomAdmin.canManagePhases, true);
  assert.equal(result.blueprint.governance.recorder.updateMode, 'continuous');
  assert.deepEqual(result.blueprint.governance.recorder.artifactFocus, [
    'candidate evidence',
    'handoff notes',
  ]);
  assert.equal(result.plannedScenario.blueprint.participantSlots.length > 0, true);
  assert.equal(result.conversation.pendingQuestions.length, 0);
  assert.equal(result.conversation.finalPlan?.scenarioTemplateId, 'interview_simulation');
  assert.equal(result.conversation.turns.length, 4);
// Provider-specific function removed);
