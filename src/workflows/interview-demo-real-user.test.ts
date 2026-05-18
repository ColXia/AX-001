import test from 'node:test';
import assert from 'node:assert/strict';

import type { AgentRuntime // Provider-specific function removed from '../core/agent-runtime.js';
import { WorkflowRuntime // Provider-specific function removed from '../core/workflow.js';
import {
  continueChatroomWorkflow,
  createInitialChatroomState,
  type ChatroomState,
// Provider-specific function removed from './chatroom-discussion.js';
import { buildInterviewRoomAdminIncidentSnapshot // Provider-specific function removed from '../room-governance/room-admin.js';
import {
  countConsecutiveInadequateCandidateAnswers,
  type InterviewCandidateTurnKind,
// Provider-specific function removed from './interview-room-utils.js';
import { INTERVIEW_DEMO_ROOM_TITLE, createChatroomRoomBlueprint // Provider-specific function removed from '../room-scenarios/room-blueprints.js';
import type { ChatroomAgentContext, ChatroomMessage // Provider-specific function removed from './chatroom-types.js';

function message(input: {
  id: string;
  role: ChatroomMessage['role'];
  authorId: string;
  authorName: string;
  round: number;
  content: string;
// Provider-specific function removed): ChatroomMessage {
  return {
    ...input,
    createdAt: '2026-04-15T00:00:00.000Z',
  // Provider-specific function removed;
// Provider-specific function removed

function createDemoBlueprint() {
  return createChatroomRoomBlueprint({
    scenarioTemplateId: 'interview_simulation',
    roomType: 'expert_discussion',
    title: INTERVIEW_DEMO_ROOM_TITLE,
    topic: '计算机本科通用面试 demo',
    objective: 'Run a minimal live interview demo where the human user answers directly in the browser.',
    speakerIds: ['interview-hr', 'interview-technical', 'interview-manager', 'interview-observer'],
    metadata: {
      scenario: {
        targetRole: '计算机本科相关岗位',
      // Provider-specific function removed,
    // Provider-specific function removed,
    runtimeConfig: {
      summaryEnabled: false,
    // Provider-specific function removed,
  // Provider-specific function removed);
// Provider-specific function removed

function createFakeWorkflowRuntime(outputs: Record<string, Array<unknown | Error>>) {
  const calls: string[] = [];
  const fakeRuntime = {
    async runDetailed(profile: { id: string // Provider-specific function removed) {
      calls.push(profile.id);
      const queue = outputs[profile.id];
    ***REMOVED***!queue || queue.length === 0) {
        throw new Error(`No fake output queued for ${profile.id// Provider-specific function removed`);
      // Provider-specific function removed

      const next = queue.shift();
    ***REMOVED***next instanceof Error) {
        throw next;
      // Provider-specific function removed

      return { output: next // Provider-specific function removed;
    // Provider-specific function removed,
  // Provider-specific function removed as unknown as AgentRuntime;

  return {
    calls,
    workflowRuntime: new WorkflowRuntime<ChatroomState, ChatroomAgentContext>(fakeRuntime),
  // Provider-specific function removed;
// Provider-specific function removed

test('countConsecutiveInadequateCandidateAnswers only counts the inadequate tail for one interviewer', () => {
  const technicalTailMessages = [
    message({
      id: 'a1',
      role: 'agent',
      authorId: 'interview-hr',
      authorName: 'HR',
      round: 1,
      content: 'Please introduce yourself briefly.',
    // Provider-specific function removed),
    message({
      id: 'u1',
      role: 'user',
      authorId: 'user',
      authorName: 'Candidate',
      round: 1,
      content: 'I am a CS student and have done some backend coursework.',
    // Provider-specific function removed),
    message({
      id: 'a2',
      role: 'agent',
      authorId: 'interview-technical',
      authorName: 'Tech',
      round: 2,
      content:
        '请直接回答：改造前峰值 RT 大概是多少毫秒，失败重试率是多少？改造后分别降到了什么量级？',
    // Provider-specific function removed),
    message({
      id: 'u2',
      role: 'user',
      authorId: 'user',
      authorName: 'Candidate',
      round: 2,
      content:
        '我们当时主要用 outbox、幂等和补偿任务来稳住一致性，架构上做了不少拆分。',
    // Provider-specific function removed),
    message({
      id: 'a3',
      role: 'agent',
      authorId: 'interview-technical',
      authorName: 'Tech',
      round: 3,
      content:
        '这些改动涉及库存团队、支付团队甚至客服侧的配合，你是怎么推动这些跨团队对齐的？对方如果觉得做不到，你怎么处理？',
    // Provider-specific function removed),
    message({
      id: 'u3',
      role: 'user',
      authorId: 'user',
      authorName: 'Candidate',
      round: 3,
      content:
        '这个 tradeoff 是我主动推动的，因为当时业务目标是先稳住成功率和转化，所以我们先保稳定性和吞吐。',
    // Provider-specific function removed),
  ];
  const messages = [
    ...technicalTailMessages,
    message({
      id: 'a4',
      role: 'agent',
      authorId: 'interview-manager',
      authorName: 'Manager',
      round: 4,
      content: 'How would you handle disagreement inside the team?',
    // Provider-specific function removed),
    message({
      id: 'u4',
      role: 'user',
      authorId: 'user',
      authorName: 'Candidate',
      round: 4,
      content: 'I would align on goals and risk first, then use rollback plans and data to move the team to a decision.',
    // Provider-specific function removed),
  ];

  assert.equal(
    countConsecutiveInadequateCandidateAnswers(technicalTailMessages, {
      speakerId: 'interview-technical',
    // Provider-specific function removed),
    2,
  );
  assert.equal(
    countConsecutiveInadequateCandidateAnswers(messages, {
      speakerId: 'interview-technical',
    // Provider-specific function removed),
    0,
  );
  assert.equal(
    countConsecutiveInadequateCandidateAnswers(messages, {
      speakerId: 'interview-manager',
    // Provider-specific function removed),
    0,
  );
// Provider-specific function removed);

test('room admin incident snapshot does not escalate ordinary HR inadequacy or repeated inadequate technical tails', () => {
  const hrMessages = [
    message({
      id: 'a1',
      role: 'agent',
      authorId: 'interview-hr',
      authorName: 'HR',
      round: 1,
      content: 'Why are you interested in this role?',
    // Provider-specific function removed),
    message({
      id: 'u1',
      role: 'user',
      authorId: 'user',
      authorName: 'Candidate',
      round: 1,
      content: 'I have done some projects and want to keep learning.',
    // Provider-specific function removed),
  ];
  assert.equal(
    buildInterviewRoomAdminIncidentSnapshot({
      messages: hrMessages,
    // Provider-specific function removed),
    undefined,
  );

  const technicalMessages = [
    message({
      id: 'a1',
      role: 'agent',
      authorId: 'interview-technical',
      authorName: 'Tech',
      round: 1,
      content: 'Describe one real production issue you personally diagnosed and resolved.',
    // Provider-specific function removed),
    message({
      id: 'u1',
      role: 'user',
      authorId: 'user',
      authorName: 'Candidate',
      round: 1,
      content: 'I am still learning and do not have much independent production experience yet.',
    // Provider-specific function removed),
    message({
      id: 'a2',
      role: 'agent',
      authorId: 'interview-technical',
      authorName: 'Tech',
      round: 2,
      content: 'Please answer directly with one concrete incident and the final result.',
    // Provider-specific function removed),
    message({
      id: 'u2',
      role: 'user',
      authorId: 'user',
      authorName: 'Candidate',
      round: 2,
      content: 'I have not handled that kind of issue on my own yet, and would first ask a senior teammate to walk through it with me.',
    // Provider-specific function removed),
  ];
  const snapshot = buildInterviewRoomAdminIncidentSnapshot({
    messages: technicalMessages,
  // Provider-specific function removed);

  assert.equal(snapshot, undefined);
// Provider-specific function removed);

test('room admin incident snapshot aborts repeated evasive technical answers', () => {
  const snapshot = buildInterviewRoomAdminIncidentSnapshot({
    messages: [
      message({
        id: 'a1',
        role: 'agent',
        authorId: 'interview-technical',
        authorName: 'Tech',
        round: 1,
        content: 'Please describe one concrete debugging issue you handled personally.',
      // Provider-specific function removed),
      message({
        id: 'u1',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 1,
        content: "Anyway, I mostly followed the usual flow and don't really remember the details.",
      // Provider-specific function removed),
      message({
        id: 'a2',
        role: 'agent',
        authorId: 'interview-technical',
        authorName: 'Tech',
        round: 2,
        content: 'Please stay on the same question and give the symptom, action, and result.',
      // Provider-specific function removed),
      message({
        id: 'u2',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 2,
        content: 'Something like that happened before, but I do not really remember the details.',
      // Provider-specific function removed),
    ],
  // Provider-specific function removed);

  assert.equal(snapshot?.recommendedAction, 'complete_interview');
  assert.equal(snapshot?.consecutiveEvasiveAnswerCount, 2);
// Provider-specific function removed);

test('demo workflow can move on after repeated inadequate technical answers instead of looping on room admin retries', async () => {
  const roomBlueprint = createDemoBlueprint();
  const previousState = createInitialChatroomState({
    roomBlueprint,
    topic: roomBlueprint.topic,
    objective: roomBlueprint.objective,
  // Provider-specific function removed);
  previousState.messages.push(
    message({
      id: 'a1',
      role: 'agent',
      authorId: 'interview-hr',
      authorName: 'HR',
      round: 1,
      content: 'Please introduce yourself briefly.',
    // Provider-specific function removed),
    message({
      id: 'u1',
      role: 'user',
      authorId: 'user',
      authorName: 'Candidate',
      round: 1,
      content: 'I am a CS student and have done some backend coursework.',
    // Provider-specific function removed),
    message({
      id: 'a2',
      role: 'agent',
      authorId: 'interview-hr',
      authorName: 'HR',
      round: 2,
      content: 'Which project did you contribute to most directly?',
    // Provider-specific function removed),
    message({
      id: 'u2',
      role: 'user',
      authorId: 'user',
      authorName: 'Candidate',
      round: 2,
      content: 'I mostly worked on a campus booking system and some Java APIs.',
    // Provider-specific function removed),
    message({
      id: 'a3',
      role: 'agent',
      authorId: 'interview-technical',
      authorName: 'Tech',
      round: 3,
      content: 'Describe one real production issue you personally diagnosed and resolved.',
    // Provider-specific function removed),
    message({
      id: 'u3',
      role: 'user',
      authorId: 'user',
      authorName: 'Candidate',
      round: 3,
      content: 'I am still learning and do not have much independent production experience yet.',
    // Provider-specific function removed),
    message({
      id: 'a4',
      role: 'agent',
      authorId: 'interview-technical',
      authorName: 'Tech',
      round: 4,
      content: 'Please answer directly with one concrete incident and the final result.',
    // Provider-specific function removed),
    message({
      id: 'u4',
      role: 'user',
      authorId: 'user',
      authorName: 'Candidate',
      round: 4,
      content: 'I have not handled that kind of issue on my own yet, and would first ask a senior teammate to walk through it with me.',
    // Provider-specific function removed),
  );
  previousState.interviewCurrentPhase = 'technical';
  previousState.interviewPendingCandidateReply = undefined;

  const { workflowRuntime, calls // Provider-specific function removed = createFakeWorkflowRuntime({
    'chatroom-room-admin': [
      {
        action: 'set_phase',
        visibility: 'hidden',
        phaseLabel: 'manager_round',
        phaseObjective: 'Assess learning ability, prioritization, and teamwork from the candidate current experience level.',
        eventLabel: '',
        eventMessage: '',
        targetSpeakerId: '',
        targetPromptMessageId: '',
        responseMode: 'new_question',
        terminalStatus: undefined,
        instruction: 'Hand off to the manager and stop drilling the same technical thread.',
        reason: 'The technical lane already established the candidate experience boundary for the demo.',
        participantAdditions: [],
      // Provider-specific function removed,
    ],
    'interview-panel-discussion': ['??????????????????????'],
    'interview-panel-handoff': ['?????????????????????'],
    'interview-manager': ['?????????????????????????????'],
  // Provider-specific function removed);

  const result = await continueChatroomWorkflow(workflowRuntime, previousState, {
    additionalRounds: 1,
  // Provider-specific function removed);

  const newMessages = result.state.messages.slice(previousState.messages.length);
  assert.equal(calls.includes('chatroom-room-admin'), true);
  assert.equal(newMessages.some((item) => item.authorId === 'interview-manager'), true);
  assert.equal(result.state.interviewCurrentPhase, 'manager');
  assert.equal(result.state.interviewPendingCandidateReply?.speakerId, 'interview-manager');
// Provider-specific function removed);

test('demo workflow adds a manager round after a clarified technical answer instead of ending early', async () => {
  const roomBlueprint = createDemoBlueprint();
  const previousState = createInitialChatroomState({
    roomBlueprint,
    topic: roomBlueprint.topic,
    objective: roomBlueprint.objective,
  // Provider-specific function removed);
  previousState.messages.push(
    message({
      id: 'a1',
      role: 'agent',
      authorId: 'interview-hr',
      authorName: 'HR',
      round: 1,
      content: 'Please introduce yourself briefly.',
    // Provider-specific function removed),
    message({
      id: 'u1',
      role: 'user',
      authorId: 'user',
      authorName: 'Candidate',
      round: 1,
      content: 'I am a CS student focused on backend reliability and consistency.',
    // Provider-specific function removed),
    message({
      id: 'a2',
      role: 'agent',
      authorId: 'interview-hr',
      authorName: 'HR',
      round: 2,
      content: 'Which project did you contribute to most directly?',
    // Provider-specific function removed),
    message({
      id: 'u2',
      role: 'user',
      authorId: 'user',
      authorName: 'Candidate',
      round: 2,
      content: 'I spent most of my time on an order service refactor and retry pipeline cleanup.',
    // Provider-specific function removed),
    message({
      id: 'a3',
      role: 'agent',
      authorId: 'interview-technical',
      authorName: 'Tech',
      round: 3,
      content: 'Describe one backend incident you personally diagnosed and recovered.',
    // Provider-specific function removed),
    message({
      id: 'u3',
      role: 'user',
      authorId: 'user',
      authorName: 'Candidate',
      round: 3,
      content: 'Do you want the diagnosis path first, or the final fix first?',
    // Provider-specific function removed),
    message({
      id: 'a4',
      role: 'agent',
      authorId: 'interview-technical',
      authorName: 'Tech',
      round: 4,
      content: 'Start with the diagnosis path and your own judgment, then cover the result.',
    // Provider-specific function removed),
    message({
      id: 'u4',
      role: 'user',
      authorId: 'user',
      authorName: 'Candidate',
      round: 4,
      content:
        'The timeout rate first rose to 3%. I checked logs and tracing, confirmed retry amplification in the inventory service, then tightened retry policy and added an idempotency check. The error rate dropped back below 0.5%.',
    // Provider-specific function removed),
  );
  previousState.interviewCurrentPhase = 'technical';
  previousState.interviewPendingCandidateReply = undefined;

  const { workflowRuntime // Provider-specific function removed = createFakeWorkflowRuntime({
    'interview-panel-discussion': ['建议下一轮由经理确认候选人的取舍与协作判断。'],
    'interview-panel-handoff': ['请经理继续追问资源有限时的优先级和沟通方式。'],
    'interview-manager': ['If time and resources were tight, what would you protect first and how would you explain the tradeoff?'],
  // Provider-specific function removed);

  const result = await continueChatroomWorkflow(workflowRuntime, previousState, {
    additionalRounds: 1,
  // Provider-specific function removed);

  const newMessages = result.state.messages.slice(previousState.messages.length);
  assert.equal(newMessages.some((item) => item.authorId === 'interview-manager'), true);
  assert.equal(result.state.interviewCurrentPhase, 'manager');
  assert.equal(result.state.interviewPendingCandidateReply?.speakerId, 'interview-manager');
// Provider-specific function removed);

test('demo workflow adds an hr wrap-up turn before finishing a strong five-reply interview', async () => {
  const roomBlueprint = createDemoBlueprint();
  const previousState = createInitialChatroomState({
    roomBlueprint,
    topic: roomBlueprint.topic,
    objective: roomBlueprint.objective,
  // Provider-specific function removed);
  previousState.messages.push(
    message({
      id: 'a1',
      role: 'agent',
      authorId: 'interview-hr',
      authorName: 'HR',
      round: 1,
      content: 'Please introduce yourself briefly.',
    // Provider-specific function removed),
    message({
      id: 'u1',
      role: 'user',
      authorId: 'user',
      authorName: 'Candidate',
      round: 1,
      content: 'I am a CS student with backend internship and distributed systems coursework.',
    // Provider-specific function removed),
    message({
      id: 'a2',
      role: 'agent',
      authorId: 'interview-hr',
      authorName: 'HR',
      round: 2,
      content: 'Which project did you contribute to most directly?',
    // Provider-specific function removed),
    message({
      id: 'u2',
      role: 'user',
      authorId: 'user',
      authorName: 'Candidate',
      round: 2,
      content: 'I owned the order, inventory, and compensation path in a campus marketplace project.',
    // Provider-specific function removed),
    message({
      id: 'a3',
      role: 'agent',
      authorId: 'interview-technical',
      authorName: 'Tech',
      round: 3,
      content: 'Describe one real system issue you personally diagnosed and resolved.',
    // Provider-specific function removed),
    message({
      id: 'u3',
      role: 'user',
      authorId: 'user',
      authorName: 'Candidate',
      round: 3,
      content:
        'At peak traffic the order confirmation API P99 rose from 180ms to 620ms and errors hit 4.1%. I used logs and tracing to isolate lock contention and retry amplification, then sharded the hot inventory path and brought P99 back to 240ms.',
    // Provider-specific function removed),
    message({
      id: 'a4',
      role: 'agent',
      authorId: 'interview-technical',
      authorName: 'Tech',
      round: 4,
      content: 'If traffic doubled again, what would you protect first and what would you temporarily downgrade?',
    // Provider-specific function removed),
    message({
      id: 'u4',
      role: 'user',
      authorId: 'user',
      authorName: 'Candidate',
      round: 4,
      content:
        'I would protect order success rate and inventory consistency first, then degrade recommendation and notification paths while watching queue depth and timeout rate.',
    // Provider-specific function removed),
    message({
      id: 'a5',
      role: 'agent',
      authorId: 'interview-manager',
      authorName: 'Manager',
      round: 5,
      content: 'When product, QA, and backend disagree, how do you drive a decision and who makes the final call?',
    // Provider-specific function removed),
    message({
      id: 'u5',
      role: 'user',
      authorId: 'user',
      authorName: 'Candidate',
      round: 5,
      content:
        'I separate must-have goals from deferrable ones, align everyone on user impact and rollback cost, then ask the owning decision-maker to call the final tradeoff.',
    // Provider-specific function removed),
  );
  previousState.interviewCurrentPhase = 'manager';
  previousState.interviewPendingCandidateReply = undefined;

  const { workflowRuntime // Provider-specific function removed = createFakeWorkflowRuntime({
    'interview-panel-discussion': ['建议 HR 用一轮简短收尾确认岗位意向和候选人问题。'],
    'interview-panel-handoff': ['请 HR 收尾，补齐动机、岗位偏好和候选人提问。'],
    'interview-hr': ['Before we wrap up, what kind of backend role are you targeting most, and do you have any questions for us?'],
  // Provider-specific function removed);

  const result = await continueChatroomWorkflow(workflowRuntime, previousState, {
    additionalRounds: 1,
  // Provider-specific function removed);

  const newMessages = result.state.messages.slice(previousState.messages.length);
  assert.equal(newMessages.some((item) => item.authorId === 'interview-hr'), true);
  assert.equal(result.state.interviewCurrentPhase, 'hr_wrapup');
  assert.equal(result.state.interviewPendingCandidateReply?.speakerId, 'interview-hr');
// Provider-specific function removed);

test('demo workflow can close cleanly after the hr wrap-up answer', async () => {
  const roomBlueprint = createDemoBlueprint();
  const previousState = createInitialChatroomState({
    roomBlueprint,
    topic: roomBlueprint.topic,
    objective: roomBlueprint.objective,
  // Provider-specific function removed);
  previousState.messages.push(
    message({
      id: 'a1',
      role: 'agent',
      authorId: 'interview-hr',
      authorName: 'HR',
      round: 1,
      content: 'Please introduce yourself briefly.',
    // Provider-specific function removed),
    message({
      id: 'u1',
      role: 'user',
      authorId: 'user',
      authorName: 'Candidate',
      round: 1,
      content: 'I am a CS student focused on backend development.',
    // Provider-specific function removed),
    message({
      id: 'a2',
      role: 'agent',
      authorId: 'interview-hr',
      authorName: 'HR',
      round: 2,
      content: 'Which project did you contribute to most directly?',
    // Provider-specific function removed),
    message({
      id: 'u2',
      role: 'user',
      authorId: 'user',
      authorName: 'Candidate',
      round: 2,
      content: 'I mainly worked on a campus booking system and some Java APIs.',
    // Provider-specific function removed),
    message({
      id: 'a3',
      role: 'agent',
      authorId: 'interview-technical',
      authorName: 'Tech',
      round: 3,
      content: 'Describe one backend issue you diagnosed and resolved.',
    // Provider-specific function removed),
    message({
      id: 'u3',
      role: 'user',
      authorId: 'user',
      authorName: 'Candidate',
      round: 3,
      content: 'I traced a timeout spike to a slow SQL query and added an index to bring latency back down.',
    // Provider-specific function removed),
    message({
      id: 'a4',
      role: 'agent',
      authorId: 'interview-technical',
      authorName: 'Tech',
      round: 4,
      content: 'If traffic doubled, what would you protect first?',
    // Provider-specific function removed),
    message({
      id: 'u4',
      role: 'user',
      authorId: 'user',
      authorName: 'Candidate',
      round: 4,
      content: 'I would protect order success rate first and temporarily degrade less critical paths.',
    // Provider-specific function removed),
    message({
      id: 'a5',
      role: 'agent',
      authorId: 'interview-manager',
      authorName: 'Manager',
      round: 5,
      content: 'When teammates disagree, how do you drive a decision?',
    // Provider-specific function removed),
    message({
      id: 'u5',
      role: 'user',
      authorId: 'user',
      authorName: 'Candidate',
      round: 5,
      content: 'I align on goals, user impact, and rollback cost, then ask the owner to make the final call.',
    // Provider-specific function removed),
    message({
      id: 'a6',
      role: 'agent',
      authorId: 'interview-hr',
      authorName: 'HR',
      round: 6,
      content: 'Before we wrap up, what role are you targeting most and do you have any questions for us?',
    // Provider-specific function removed),
    message({
      id: 'u6',
      role: 'user',
      authorId: 'user',
      authorName: 'Candidate',
      round: 6,
      content: 'I am targeting a backend role focused on reliability and I do not have more questions right now.',
    // Provider-specific function removed),
  );
  previousState.interviewCurrentPhase = 'hr_wrapup';
  previousState.interviewPendingCandidateReply = undefined;

  const { workflowRuntime, calls // Provider-specific function removed = createFakeWorkflowRuntime({
    'chatroom-room-admin': [
      {
        action: 'complete_interview',
        visibility: 'hidden',
        phaseLabel: '',
        phaseObjective: '',
        eventLabel: '',
        eventMessage: '',
        targetSpeakerId: '',
        targetPromptMessageId: '',
        responseMode: 'new_question',
        terminalStatus: 'complete',
        instruction: 'The room already has enough signal and can close now.',
        reason: 'The candidate already answered the HR wrap-up question clearly.',
        participantAdditions: [],
      // Provider-specific function removed,
    ],
    'interview-hr': [
      'Thank you for the thoughtful answers and for your questions. We will let the recruiting team follow up on the role details after today.',
    ],
  // Provider-specific function removed);

  const result = await continueChatroomWorkflow(workflowRuntime, previousState, {
    additionalRounds: 1,
  // Provider-specific function removed);

  assert.equal(calls.includes('chatroom-room-admin'), true);
  assert.equal(calls.includes('interview-hr'), true);
  assert.equal(result.state.interviewCurrentPhase, 'complete');
  assert.equal(result.state.interviewPendingCandidateReply, undefined);
  assert.equal(result.state.messages.length, previousState.messages.length + 1);
  const closingMessage = result.state.messages.at(-1);
  assert(closingMessage);
  assert.equal(closingMessage.authorId, 'interview-hr');
// Provider-specific function removed);
