import test from 'node:test';
import assert from 'node:assert/strict';

import type { InterviewSummary // Provider-specific function removed from '../agents/schemas.js';
import type { ChatroomState, ResolvedInterviewTurnPlan // Provider-specific function removed from './chatroom-discussion.js';
import {
  continueChatroomWorkflow,
  createInitialChatroomState,
  runChatroomWorkflow,
  resolveInterviewTurnPlanFallback,
// Provider-specific function removed from './chatroom-discussion.js';
import type { AgentRuntime // Provider-specific function removed from '../core/agent-runtime.js';
import { WorkflowRuntime // Provider-specific function removed from '../core/workflow.js';
import { buildRoomScenarioArtifactBundle // Provider-specific function removed from '../room-scenarios/scenario-artifacts.js';
import {
  assessInterviewAnswerCoverage,
  classifyInterviewCandidateTurnMessage,
  countConsecutiveInadequateCandidateAnswers,
  countConsecutiveRepeatedCandidateAnswers,
  countInterviewCandidateReplies,
  inferInterviewStatusFromMessages,
// Provider-specific function removed from './interview-room-utils.js';
import {
  resolveInterviewCandidateControlPlan,
  resolveInterviewStatusFromState,
// Provider-specific function removed from './interview-room-controller.js';
import { INTERVIEW_DEMO_ROOM_TITLE, createChatroomRoomBlueprint // Provider-specific function removed from '../room-scenarios/room-blueprints.js';
import type { ChatroomMessage // Provider-specific function removed from './chatroom-types.js';

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
    createdAt: '2026-04-10T00:00:00.000Z',
  // Provider-specific function removed;
// Provider-specific function removed

function buildInterviewState(args: {
  targetRole?: string;
  focusAreas?: string[];
  messages: ChatroomMessage[];
  summaryEnabled?: boolean;
  recorderUpdateMode?: 'final_only' | 'stage_checkpoints' | 'continuous';
// Provider-specific function removed): ChatroomState {
  const roomBlueprint = createChatroomRoomBlueprint({
    scenarioTemplateId: 'interview_simulation',
    roomType: 'expert_discussion',
    topic: args.targetRole ?? 'Backend Engineer',
    objective: 'Run an interview simulation.',
    speakerIds: ['interview-hr', 'interview-technical', 'interview-manager', 'interview-observer'],
    metadata: {
      scenario: {
        targetRole: args.targetRole,
        focusAreas: args.focusAreas ?? [],
      // Provider-specific function removed,
    // Provider-specific function removed,
    runtimeConfig: {
      summaryEnabled: args.summaryEnabled ?? false,
    // Provider-specific function removed,
    governance: args.recorderUpdateMode
      ? {
          recorder: {
            enabled: true,
            updateMode: args.recorderUpdateMode,
          // Provider-specific function removed,
        // Provider-specific function removed
      : undefined,
  // Provider-specific function removed);

  return {
    roomType: roomBlueprint.roomType,
    scenarioTemplateId: roomBlueprint.scenarioTemplateId,
    roomBlueprint,
    topic: roomBlueprint.topic,
    objective: roomBlueprint.objective,
    constraints: roomBlueprint.constraints,
    speakerIds: [...roomBlueprint.speakerIds],
    messages: args.messages,
  // Provider-specific function removed;
// Provider-specific function removed

function buildCompletedInterviewState(): ChatroomState {
  const roomBlueprint = createChatroomRoomBlueprint({
    scenarioTemplateId: 'interview_simulation',
    roomType: 'expert_discussion',
    topic: 'Backend Engineer',
    objective: 'Run an interview simulation.',
    speakerIds: ['interview-hr', 'interview-technical', 'interview-manager', 'interview-observer'],
    metadata: {
      scenario: {
        targetRole: 'Backend Engineer',
        focusAreas: ['distributed systems', 'ownership', 'cross-team alignment'],
      // Provider-specific function removed,
    // Provider-specific function removed,
    runtimeConfig: {
      summaryEnabled: true,
    // Provider-specific function removed,
  // Provider-specific function removed);

  return {
    roomType: roomBlueprint.roomType,
    scenarioTemplateId: roomBlueprint.scenarioTemplateId,
    roomBlueprint,
    topic: roomBlueprint.topic,
    objective: roomBlueprint.objective,
    constraints: roomBlueprint.constraints,
    speakerIds: [...roomBlueprint.speakerIds],
    messages: [
      message({
        id: 'a1',
        role: 'agent',
        authorId: 'interview-hr',
        authorName: 'HR',
        round: 1,
        content: 'Please introduce yourself and highlight one backend project you led recently.',
      // Provider-specific function removed),
      message({
        id: 'u1',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 1,
        content: 'I led a payment and inventory reliability rewrite for a commerce platform and owned the rollout with the backend team.',
      // Provider-specific function removed),
      message({
        id: 'a2',
        role: 'agent',
        authorId: 'interview-hr',
        authorName: 'HR',
        round: 2,
        content: 'Why are you exploring this role now, and what part of the scope fits you best?',
      // Provider-specific function removed),
      message({
        id: 'u2',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 2,
        content: 'I want a role with broader ownership, and this backend scope fits because I enjoy stabilizing critical transaction paths.',
      // Provider-specific function removed),
      message({
        id: 'a3',
        role: 'agent',
        authorId: 'interview-technical',
        authorName: 'Tech',
        round: 3,
        content: 'Walk me through a real consistency incident and include the latency or failure-rate numbers you used to decide the rollback.',
      // Provider-specific function removed),
      message({
        id: 'u3',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 3,
        content: 'We saw payment P99 rise from 180ms to 420ms and retry failures climb to 3.6%, so I paused the rollout, switched traffic back within 8 minutes, and used outbox plus idempotent consumers to recover the backlog.',
      // Provider-specific function removed),
      message({
        id: 'a4',
        role: 'agent',
        authorId: 'interview-observer',
        authorName: 'Observer',
        round: 4,
        content: 'How did you align the inventory, payment, and support teams when they disagreed on the rollback threshold?',
      // Provider-specific function removed),
      message({
        id: 'u4',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 4,
        content: 'I aligned inventory, payment, and support around one incident checklist, made the owner and SLA explicit, and used failed orders plus compensation backlog as the shared decision guardrail.',
      // Provider-specific function removed),
      message({
        id: 'a5',
        role: 'agent',
        authorId: 'interview-manager',
        authorName: 'Manager',
        round: 5,
        content: 'If the same incident happened again with higher revenue impact, how would you decide between customer experience and strict data consistency?',
      // Provider-specific function removed),
      message({
        id: 'u5',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 5,
        content: 'I would protect payment success and final inventory correctness first, then trade off non-critical notifications because the recovery cost is lower than letting order state drift spread.',
      // Provider-specific function removed),
      message({
        id: 'a6',
        role: 'agent',
        authorId: 'interview-hr',
        authorName: 'HR',
        round: 6,
        content: 'Last question: what do you want to know about the role, and is there anything else you want us to understand about your fit?',
      // Provider-specific function removed),
      message({
        id: 'u6',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 6,
        content: 'I am most interested in how you measure success in the first six months, because I want a role where I can own critical reliability metrics end to end.',
      // Provider-specific function removed),
    ],
  // Provider-specific function removed;
// Provider-specific function removed

function buildInterviewSummaryOutput(
  overrides: Partial<InterviewSummary> = {// Provider-specific function removed,
): InterviewSummary {
  return {
    executiveSummary: 'The candidate completed the interview with solid evidence across the core topics.',
    interviewStatus: 'complete',
    currentStage: 'Wrap-up',
    interviewReadiness: 'strong',
    overallScore: 82,
    strengths: ['Used a concrete production incident with measurable outcomes.'],
    weaknesses: ['Some follow-up metrics could still be more specific.'],
    missedQuestions: [],
    suggestedAnswerImprovements: ['Add a tighter before/after comparison for the main metrics.'],
    followUpQuestions: ['If needed, probe deeper on rollback decision criteria.'],
    recommendedNextActions: ['Proceed to the next interview round.'],
    competencyScores: [{
      dimension: 'Technical Depth',
      score: 4,
      evidence: ['Explained incident response, rollback, and recovery design.'],
      risks: ['Could add more quantitative trade-off detail.'],
    // Provider-specific function removed],
    confidence: 0.78,
    questionLog: [{
      questionId: 'q-1',
      interviewerRole: 'technical_interviewer',
      interviewerName: 'Tech',
      round: 1,
      stage: 'technical_deep_dive',
      question: 'Describe a real production incident you handled.',
      candidateAnswer: 'I rolled back within minutes and recovered the backlog safely.',
      isAdequate: true,
      evidenceGaps: [],
    // Provider-specific function removed],
    feedbackItems: [{
      feedbackId: 'feedback-1',
      relatedQuestionId: 'q-1',
      dimension: 'Technical Depth',
      suggestion: 'Add the exact latency and failure-rate deltas next time.',
      severity: 'medium',
    // Provider-specific function removed],
    ...overrides,
  // Provider-specific function removed;
// Provider-specific function removed

function expectAsk(plan: ResolvedInterviewTurnPlan): Extract<ResolvedInterviewTurnPlan, { kind: 'ask' // Provider-specific function removed> {
  assert.equal(plan.kind, 'ask');
  return plan;
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
    workflowRuntime: new WorkflowRuntime<ChatroomState, any>(fakeRuntime),
  // Provider-specific function removed;
// Provider-specific function removed

test('countInterviewCandidateReplies ignores clarification turns', () => {
  const messages = [
    message({ id: 'a1', role: 'agent', authorId: 'interview-hr', authorName: 'HR', round: 1, content: 'Please introduce yourself.' // Provider-specific function removed),
    message({ id: 'u1', role: 'user', authorId: 'user', authorName: 'Candidate', round: 1, content: 'I worked on a payments platform and led the API redesign.' // Provider-specific function removed),
    message({ id: 'a2', role: 'agent', authorId: 'interview-technical', authorName: 'Tech', round: 2, content: 'How did you handle database consistency?' // Provider-specific function removed),
    message({ id: 'u2', role: 'user', authorId: 'user', authorName: 'Candidate', round: 2, content: 'Can you clarify whether you mean write consistency or cross-service consistency?' // Provider-specific function removed),
    message({ id: 'a3', role: 'agent', authorId: 'interview-technical', authorName: 'Tech', round: 3, content: 'Focus on cross-service consistency.' // Provider-specific function removed),
    message({ id: 'u3', role: 'user', authorId: 'user', authorName: 'Candidate', round: 3, content: 'We used idempotent events and reconciliation jobs to handle cross-service drift.' // Provider-specific function removed),
  ];

  assert.equal(countInterviewCandidateReplies(messages), 2);
// Provider-specific function removed);

test('initial interview state starts in opening phase', () => {
  const roomBlueprint = createChatroomRoomBlueprint({
    scenarioTemplateId: 'interview_simulation',
    roomType: 'expert_discussion',
    topic: 'Backend Engineer',
    objective: 'Run an interview simulation.',
    speakerIds: ['interview-hr', 'interview-technical', 'interview-manager', 'interview-observer'],
    runtimeConfig: {
      summaryEnabled: false,
    // Provider-specific function removed,
  // Provider-specific function removed);

  const state = createInitialChatroomState({
    roomBlueprint,
    topic: roomBlueprint.topic,
    objective: roomBlueprint.objective,
  // Provider-specific function removed);

  assert.equal(state.interviewCurrentPhase, 'opening');
// Provider-specific function removed);

test('new interview room creation posts the opening interviewer question before waiting', async () => {
  const roomBlueprint = createChatroomRoomBlueprint({
    scenarioTemplateId: 'interview_simulation',
    roomType: 'expert_discussion',
    topic: 'Backend Engineer',
    objective: 'Run an interview simulation.',
    speakerIds: ['interview-hr', 'interview-technical', 'interview-manager', 'interview-observer'],
    runtimeConfig: {
      summaryEnabled: false,
    // Provider-specific function removed,
  // Provider-specific function removed);
  const { workflowRuntime, calls // Provider-specific function removed = createFakeWorkflowRuntime({
    'chatroom-room-admin': [{
      action: 'idle',
      visibility: 'hidden',
      phaseLabel: 'Opening',
      phaseObjective: 'Let HR ask the first question.',
      eventLabel: '',
      eventMessage: '',
      instruction: 'HR should open the interview with a self-introduction prompt.',
      reason: 'test',
      participantAdditions: [],
    // Provider-specific function removed],
    'chatroom-host': [{
      action: 'idle',
      visibility: 'hidden',
      headline: '',
      focus: 'opening question',
      instruction: 'Keep the room in one-question-at-a-time mode.',
      reason: 'test',
    // Provider-specific function removed],
    'interview-hr': ['Please introduce yourself briefly and highlight the most relevant project you led recently.'],
  // Provider-specific function removed);

  const result = await runChatroomWorkflow(workflowRuntime, {
    roomBlueprint,
    topic: roomBlueprint.topic,
    objective: roomBlueprint.objective,
    summaryEnabled: false,
  // Provider-specific function removed);

  const openingQuestion = result.state.messages.find((item) => item.role === 'agent');
  assert(openingQuestion);
  assert.equal(openingQuestion.authorId, 'interview-hr');
  assert.equal(result.state.interviewCurrentPhase, 'opening');
  assert.equal(result.state.interviewPendingCandidateReply?.speakerId, 'interview-hr');
  assert.equal(result.state.interviewPendingCandidateReply?.promptMessageId, openingQuestion.id);
  assert.equal(result.state.interviewPendingCandidateReply?.responseMode, 'new_question');
  assert(!calls.includes('interview-turn-planner'));
// Provider-specific function removed);

test('in-progress interview does not emit a final summary before the room reaches terminal state', async () => {
  const roomBlueprint = createChatroomRoomBlueprint({
    scenarioTemplateId: 'interview_simulation',
    roomType: 'expert_discussion',
    topic: 'Backend Engineer',
    objective: 'Run an interview simulation.',
    speakerIds: ['interview-hr', 'interview-technical', 'interview-manager', 'interview-observer'],
    runtimeConfig: {
      summaryEnabled: true,
    // Provider-specific function removed,
    governance: {
      recorder: {
        enabled: false,
      // Provider-specific function removed,
    // Provider-specific function removed,
  // Provider-specific function removed);
  const { workflowRuntime, calls // Provider-specific function removed = createFakeWorkflowRuntime({
    'chatroom-room-admin': [{
      action: 'idle',
      visibility: 'hidden',
      phaseLabel: 'Opening',
      phaseObjective: 'Let HR ask the first question.',
      eventLabel: '',
      eventMessage: '',
      instruction: 'HR should open the interview with a self-introduction prompt.',
      reason: 'test',
      participantAdditions: [],
    // Provider-specific function removed],
    'chatroom-host': [{
      action: 'idle',
      visibility: 'hidden',
      headline: '',
      focus: 'opening question',
      instruction: 'Keep the room in one-question-at-a-time mode.',
      reason: 'test',
    // Provider-specific function removed],
    'interview-hr': ['Please introduce yourself briefly and highlight the most relevant project you led recently.'],
  // Provider-specific function removed);

  const result = await runChatroomWorkflow(workflowRuntime, {
    roomBlueprint,
    topic: roomBlueprint.topic,
    objective: roomBlueprint.objective,
    summaryEnabled: true,
  // Provider-specific function removed);

  assert.equal(calls.includes('interview-summary'), false);
  assert.equal(result.state.finalSummary, undefined);
  assert.equal(result.state.messages.some((item) => item.role === 'summary'), false);
// Provider-specific function removed);

test('interview demo room creation uses fast-path governance and opening question', async () => {
  const roomBlueprint = createChatroomRoomBlueprint({
    scenarioTemplateId: 'interview_simulation',
    roomType: 'expert_discussion',
    title: 'Interview Demo',
    topic: '计算机类通用岗位（不预设方向） interview demo',
    objective: 'Run a minimal live interview demo where the human user answers directly in the browser.',
    speakerIds: ['interview-hr', 'interview-technical', 'interview-manager', 'interview-observer'],
    metadata: {
      scenario: {
        targetRole: '计算机类通用岗位',
      // Provider-specific function removed,
    // Provider-specific function removed,
    runtimeConfig: {
      summaryEnabled: false,
    // Provider-specific function removed,
  // Provider-specific function removed);
  const { workflowRuntime, calls // Provider-specific function removed = createFakeWorkflowRuntime({// Provider-specific function removed);

  const result = await runChatroomWorkflow(workflowRuntime, {
    roomBlueprint,
    topic: roomBlueprint.topic,
    objective: roomBlueprint.objective,
    summaryEnabled: false,
  // Provider-specific function removed);

  const openingQuestion = result.state.messages.find((item) => item.role === 'agent');
  assert(openingQuestion);
  assert.equal(openingQuestion.authorId, 'interview-hr');
  assert.match(openingQuestion.content, /自我介绍/u);
  assert.equal(result.state.interviewPendingCandidateReply?.speakerId, 'interview-hr');
  assert.deepEqual(calls, []);
// Provider-specific function removed);

test('interview recorder checkpoint timeout does not block the next waiting state', async () => {
  const roomBlueprint = createChatroomRoomBlueprint({
    scenarioTemplateId: 'interview_simulation',
    roomType: 'expert_discussion',
    topic: 'Backend Engineer',
    objective: 'Run an interview simulation.',
    speakerIds: ['interview-hr', 'interview-technical', 'interview-manager', 'interview-observer'],
    runtimeConfig: {
      summaryEnabled: false,
    // Provider-specific function removed,
    governance: {
      recorder: {
        enabled: true,
        updateMode: 'continuous',
      // Provider-specific function removed,
    // Provider-specific function removed,
  // Provider-specific function removed);
  const { workflowRuntime, calls // Provider-specific function removed = createFakeWorkflowRuntime({
    'chatroom-room-admin': [{
      action: 'idle',
      visibility: 'hidden',
      phaseLabel: 'Opening',
      phaseObjective: 'Let HR ask the first question.',
      eventLabel: '',
      eventMessage: '',
      instruction: 'HR should open the interview with a self-introduction prompt.',
      reason: 'test',
      participantAdditions: [],
    // Provider-specific function removed],
    'chatroom-host': [{
      action: 'idle',
      visibility: 'hidden',
      headline: '',
      focus: 'opening question',
      instruction: 'Keep the room in one-question-at-a-time mode.',
      reason: 'test',
    // Provider-specific function removed],
    'interview-hr': ['Please introduce yourself briefly and highlight the most relevant backend project you owned recently.'],
    'interview-summary': [new Error('recorder timeout')],
  // Provider-specific function removed);

  const result = await runChatroomWorkflow(workflowRuntime, {
    roomBlueprint,
    topic: roomBlueprint.topic,
    objective: roomBlueprint.objective,
    summaryEnabled: false,
  // Provider-specific function removed);

  const openingQuestion = result.state.messages.find((item) => item.authorId === 'interview-hr');
  assert(openingQuestion);
  assert.equal(result.state.interviewPendingCandidateReply?.promptMessageId, openingQuestion.id);
  assert.equal(result.state.interviewPendingCandidateReply?.speakerId, 'interview-hr');
  assert(calls.includes('interview-summary'));
  const recorderTrace = result.trace.find((item) => item.stepId === 'chat-round-1-recorder-checkpoint');
  assert(recorderTrace);
  assert.equal(recorderTrace.status, 'partial');
  assert.equal(result.state.finalSummary, undefined);
// Provider-specific function removed);

test('interview demo continue keeps governance on fast-path but still lets interviewer LLM ask the next question', async () => {
  const roomBlueprint = createChatroomRoomBlueprint({
    scenarioTemplateId: 'interview_simulation',
    roomType: 'expert_discussion',
    title: 'Interview Demo',
    topic: '计算机类通用岗位（不预设方向） interview demo',
    objective: 'Run a minimal live interview demo where the human user answers directly in the browser.',
    speakerIds: ['interview-hr', 'interview-technical', 'interview-manager', 'interview-observer'],
    metadata: {
      scenario: {
        targetRole: '计算机类通用岗位',
      // Provider-specific function removed,
    // Provider-specific function removed,
    runtimeConfig: {
      summaryEnabled: false,
    // Provider-specific function removed,
  // Provider-specific function removed);
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
      content: '你好，我是今天的 HR 面试官。先请你做一个简短自我介绍，可以包括你的专业背景、目前的就读阶段，以及你做过的项目、课程实践或实习经历。如果你对 计算机类通用岗位 方向有偏好，也可以一起说明。',
    // Provider-specific function removed),
    message({
      id: 'u1',
      role: 'user',
      authorId: 'user',
      authorName: 'Candidate',
      round: 1,
      content: '我是计算机本科应届生，最近主要做过课程项目和一段后端实习。',
    // Provider-specific function removed),
  );
  previousState.interviewCurrentPhase = 'opening';
  previousState.interviewPendingCandidateReply = undefined;

  const { workflowRuntime, calls // Provider-specific function removed = createFakeWorkflowRuntime({
    'interview-turn-planner': [{
      nextAction: 'ask',
      currentStage: 'opening',
      currentStageLabel: 'opening',
      speakerRole: 'hr_interviewer',
      stageObjective: 'HR follow-up question.',
      questionGoal: 'Get more details on backend实习.',
      handoffReason: 'Demo继续HR follow-up',
      responseMode: 'new_question',
      candidateMessageType: 'answer',
      evidenceStatus: 'adequate',
      confidence: 0.9,
    // Provider-specific function removed],
    'interview-hr': ['你刚才提到有一段后端实习，挑一个你参与度最高的任务，讲讲你具体负责了什么。'],
  // Provider-specific function removed);

  const result = await continueChatroomWorkflow(workflowRuntime, previousState, {
    additionalRounds: 1,
  // Provider-specific function removed);

  const newMessages = result.state.messages.slice(previousState.messages.length);
  assert.deepEqual(
    newMessages.map((item) => item.authorId),
    ['interview-hr'],
  );
  assert.deepEqual(calls, ['interview-hr']);
  assert.equal(result.state.interviewCurrentPhase, 'hr_followup');
  assert.equal(result.state.interviewPendingCandidateReply?.speakerId, 'interview-hr');
// Provider-specific function removed);

test('interview demo keeps repeated ordinary answers on the active interviewer thread', async () => {
  const roomBlueprint = createChatroomRoomBlueprint({
    scenarioTemplateId: 'interview_simulation',
    roomType: 'expert_discussion',
    title: INTERVIEW_DEMO_ROOM_TITLE,
    topic: '计算机类通用岗位 interview demo',
    objective: 'Run a minimal live interview demo where the human user answers directly in the browser.',
    speakerIds: ['interview-hr', 'interview-technical', 'interview-manager', 'interview-observer'],
    metadata: {
      scenario: {
        targetRole: '计算机类通用岗位',
      // Provider-specific function removed,
    // Provider-specific function removed,
    runtimeConfig: {
      summaryEnabled: false,
    // Provider-specific function removed,
  // Provider-specific function removed);
  const repeatedAnswer = '我做了三年后端，最近主导过支付与库存链路重构。';
  const previousState: ChatroomState = {
    roomType: roomBlueprint.roomType,
    scenarioTemplateId: roomBlueprint.scenarioTemplateId,
    roomBlueprint,
    topic: roomBlueprint.topic,
    objective: roomBlueprint.objective,
    constraints: roomBlueprint.constraints,
    speakerIds: [...roomBlueprint.speakerIds],
    messages: [
      message({ id: 'a1', role: 'agent', authorId: 'interview-hr', authorName: 'HR', round: 1, content: '请先做一个简短自我介绍。' // Provider-specific function removed),
      message({ id: 'u1', role: 'user', authorId: 'user', authorName: 'Candidate', round: 1, content: repeatedAnswer // Provider-specific function removed),
      message({ id: 'a2', role: 'agent', authorId: 'interview-technical', authorName: 'Tech', round: 2, content: '讲一个你处理过的一致性故障。' // Provider-specific function removed),
    ],
    interviewCurrentPhase: 'technical',
  // Provider-specific function removed;

  const { workflowRuntime, calls // Provider-specific function removed = createFakeWorkflowRuntime({
    'chatroom-room-admin': [{
      action: 'request_answer_retry',
      visibility: 'hidden',
      phaseLabel: '技术深挖',
      phaseObjective: '把故障案例讲具体',
      eventLabel: '',
      eventMessage: '',
      targetSpeakerId: 'interview-technical',
      targetPromptMessageId: 'a2',
      responseMode: 'clarify',
      instruction: '请先把上一问缩窄到一个真实故障的时间线，再等待候选人补答。',
      reason: '候选人重复了上一轮回答，需要面试官主动缩窄问题。',
      participantAdditions: [],
    // Provider-specific function removed],
    'interview-technical': ['先聚焦一个真实线上故障：不要再讲经历概览，请按“故障现象-定位-恢复”三步说明。'],
  // Provider-specific function removed);

  const result = await continueChatroomWorkflow(workflowRuntime, previousState, {
    additionalRounds: 1,
    humanMessage: repeatedAnswer,
    humanAuthorName: 'Candidate',
  // Provider-specific function removed);

  const newMessages = result.state.messages.slice(previousState.messages.length);
  assert.equal(calls.includes('interview-turn-planner'), false);
  assert.deepEqual(
    newMessages.map((item) => item.authorId),
    ['user-candidate', 'interview-technical'],
  );
  assert.equal(calls.includes('interview-turn-planner'), false);
  assert.equal(result.state.interviewCurrentPhase, 'technical');
  assert.equal(result.state.interviewPendingCandidateReply?.speakerId, 'interview-technical');
  assert.equal(result.state.interviewPendingCandidateReply?.responseMode, 'clarify');
// Provider-specific function removed);

test('interview demo keeps ordinary off-topic answers on the active interviewer thread', async () => {
  const roomBlueprint = createChatroomRoomBlueprint({
    scenarioTemplateId: 'interview_simulation',
    roomType: 'expert_discussion',
    title: INTERVIEW_DEMO_ROOM_TITLE,
    topic: '计算机类通用岗位 interview demo',
    objective: 'Run a minimal live interview demo where the human user answers directly in the browser.',
    speakerIds: ['interview-hr', 'interview-technical', 'interview-manager', 'interview-observer'],
    runtimeConfig: {
      summaryEnabled: false,
    // Provider-specific function removed,
  // Provider-specific function removed);
  const offTopicAnswer = '我是计算机本科应届生，最近主要做过课程项目和一段后端实习。';
  const previousState: ChatroomState = {
    roomType: roomBlueprint.roomType,
    scenarioTemplateId: roomBlueprint.scenarioTemplateId,
    roomBlueprint,
    topic: roomBlueprint.topic,
    objective: roomBlueprint.objective,
    constraints: roomBlueprint.constraints,
    speakerIds: [...roomBlueprint.speakerIds],
    messages: [
      message({ id: 'a1', role: 'agent', authorId: 'interview-technical', authorName: 'Tech', round: 1, content: '讲一个你处理过的一次真实线上故障，按时间线说明现象、定位和恢复。' // Provider-specific function removed),
    ],
  // Provider-specific function removed;

const { workflowRuntime, calls // Provider-specific function removed = createFakeWorkflowRuntime({
    'chatroom-room-admin': [{
      action: 'request_answer_retry',
      visibility: 'hidden',
      phaseLabel: '技术深挖',
      phaseObjective: '拉回到具体故障案例',
      eventLabel: '',
      eventMessage: '',
      targetSpeakerId: 'interview-technical',
      targetPromptMessageId: 'a1',
      responseMode: 'new_question',
      instruction: '候选人没有直接回答上一问，请把问题拉回到一个真实线上故障，并要求按时间线回答。',
      reason: '候选人回答偏题，没有正面覆盖故障案例问题。',
      participantAdditions: [],
    // Provider-specific function removed],
    'interview-turn-planner': [{
      nextAction: 'ask',
      currentStage: 'technical_deep_dive',
      currentStageLabel: '技术深挖',
      speakerRole: 'technical_interviewer',
      stageObjective: '拉回到具体故障案例',
      questionGoal: '要求候选人按时间线讲一个真实线上故障',
      handoffReason: 'Off-topic answer, stay on technical thread',
      responseMode: 'new_question',
      candidateMessageType: 'repeated_answer',
      evidenceStatus: 'inadequate',
      confidence: 0.85,
    // Provider-specific function removed],
    'interview-technical': ['先不要继续做背景介绍，请只讲一个你亲自处理过的真实线上故障，按"现象-定位-恢复"展开。'],
  // Provider-specific function removed);

  const result = await continueChatroomWorkflow(workflowRuntime, previousState, {
    additionalRounds: 1,
    humanMessage: offTopicAnswer,
    humanAuthorName: 'Candidate',
  // Provider-specific function removed);

  const newMessages = result.state.messages.slice(previousState.messages.length);
  assert.equal(calls.includes('chatroom-room-admin'), false);
  assert.deepEqual(
    newMessages.map((item) => item.authorId),
    ['user-candidate', 'interview-technical'],
  );
  assert.equal(calls.includes('interview-turn-planner'), false);
  assert.equal(result.state.interviewPendingCandidateReply?.speakerId, 'interview-technical');
  assert.equal(result.state.interviewPendingCandidateReply?.responseMode, 'new_question');
// Provider-specific function removed);

test('room admin hold_interview keeps the room waiting during pause/reconnect incidents', async () => {
  const roomBlueprint = createChatroomRoomBlueprint({
    scenarioTemplateId: 'interview_simulation',
    roomType: 'expert_discussion',
    title: INTERVIEW_DEMO_ROOM_TITLE,
    topic: '计算机类通用岗位 interview demo',
    objective: 'Run a minimal live interview demo where the human user answers directly in the browser.',
    speakerIds: ['interview-hr', 'interview-technical', 'interview-manager', 'interview-observer'],
    runtimeConfig: {
      summaryEnabled: false,
    // Provider-specific function removed,
  // Provider-specific function removed);
  const previousState: ChatroomState = {
    roomType: roomBlueprint.roomType,
    scenarioTemplateId: roomBlueprint.scenarioTemplateId,
    roomBlueprint,
    topic: roomBlueprint.topic,
    objective: roomBlueprint.objective,
    constraints: roomBlueprint.constraints,
    speakerIds: [...roomBlueprint.speakerIds],
    messages: [
      message({ id: 'a1', role: 'agent', authorId: 'interview-technical', authorName: 'Tech', round: 1, content: '讲一个你处理过的一次真实线上故障。' // Provider-specific function removed),
    ],
  // Provider-specific function removed;

  const { workflowRuntime, calls // Provider-specific function removed = createFakeWorkflowRuntime({
    'chatroom-room-admin': [{
      action: 'hold_interview',
      visibility: 'hidden',
      phaseLabel: '',
      phaseObjective: '',
      eventLabel: '',
      eventMessage: '',
      targetSpeakerId: '',
      targetPromptMessageId: '',
      responseMode: 'new_question',
      instruction: '候选人正在恢复网络连接，当前保持等待，不继续追问。',
      reason: '候选人请求暂停并恢复连接。',
      participantAdditions: [],
    // Provider-specific function removed],
  // Provider-specific function removed);

  const result = await continueChatroomWorkflow(workflowRuntime, previousState, {
    additionalRounds: 1,
    humanMessage: '稍等一下，我网络断了一下，马上重新连上。',
    humanAuthorName: 'Candidate',
  // Provider-specific function removed);

  assert(calls.includes('chatroom-room-admin'));
  assert.equal(calls.includes('interview-turn-planner'), false);
  assert.equal(calls.includes('interview-technical'), false);
  assert.equal(result.state.interviewConsecutiveWaitCount, 1);
  assert.equal(result.state.interviewPendingCandidateReply?.promptMessageId, 'a1');
  assert.equal(result.state.interviewPendingCandidateReply?.speakerId, 'interview-technical');
// Provider-specific function removed);

test.skip('room admin complete_interview can persist aborted terminal state', async () => {
  const roomBlueprint = createChatroomRoomBlueprint({
    scenarioTemplateId: 'interview_simulation',
    roomType: 'expert_discussion',
    title: INTERVIEW_DEMO_ROOM_TITLE,
    topic: '璁＄畻鏈虹被閫氱敤宀椾綅 interview demo',
    objective: 'Run a minimal live interview demo where the human user answers directly in the browser.',
    speakerIds: ['interview-hr', 'interview-technical', 'interview-manager', 'interview-observer'],
    runtimeConfig: {
      summaryEnabled: false,
    // Provider-specific function removed,
  // Provider-specific function removed);
  const previousState: ChatroomState = {
    roomType: roomBlueprint.roomType,
    scenarioTemplateId: roomBlueprint.scenarioTemplateId,
    roomBlueprint,
    topic: roomBlueprint.topic,
    objective: roomBlueprint.objective,
    constraints: roomBlueprint.constraints,
    speakerIds: [...roomBlueprint.speakerIds],
    messages: [
      message({ id: 'a1', role: 'agent', authorId: 'interview-technical', authorName: 'Tech', round: 1, content: '璁蹭竴涓綘澶勭悊杩囩殑涓€娆＄湡瀹炵嚎涓婃晠闅溿€?' // Provider-specific function removed),
    ],
  // Provider-specific function removed;

  previousState.roomAdminState = {
    schemaVersion: 1,
    lastUpdatedAt: '2026-04-15T00:00:00.000Z',
    currentDirective: {
      schemaVersion: 1,
      directiveId: 'admin-abort-1',
      createdAt: '2026-04-15T00:00:00.000Z',
      round: 2,
      transcriptMessageCount: 1,
      interventionStyle: 'on_demand',
      action: 'complete_interview',
      visibility: 'hidden',
      phaseLabel: '',
      phaseObjective: '',
      eventLabel: '',
      eventMessage: '',
      targetSpeakerId: '',
      targetPromptMessageId: '',
      responseMode: 'new_question',
      terminalStatus: 'aborted',
      instruction: 'Abort the interview now.',
      reason: 'The room-admin determined the interview should abort early.',
      participantAdditions: [],
    // Provider-specific function removed,
    history: [],
  // Provider-specific function removed;

  const { workflowRuntime, calls // Provider-specific function removed = createFakeWorkflowRuntime({
    'chatroom-room-admin': [{
      action: 'complete_interview',
      visibility: 'hidden',
      phaseLabel: '',
      phaseObjective: '',
      eventLabel: '',
      eventMessage: '',
      targetSpeakerId: '',
      targetPromptMessageId: '',
      responseMode: 'new_question',
      terminalStatus: 'aborted',
      instruction: '鍊欓€変汉鏄庣‘琛ㄧず涓嶆兂缁х画锛岀洿鎺ョ粨鏉熼潰璇曘€?',
      reason: 'The room-admin determined the interview should abort early.',
      participantAdditions: [],
    // Provider-specific function removed],
  // Provider-specific function removed);

  const result = await continueChatroomWorkflow(workflowRuntime, previousState, {
    additionalRounds: 1,
    humanMessage: '鎴戜箣鍓嶅仛杩囦竴涓紦瀛樹笌鏀粯鐩稿叧鐨勯」鐩€?',
    humanAuthorName: 'Candidate',
  // Provider-specific function removed);

  assert.equal(calls.includes('interview-turn-planner'), false);
  assert.equal(calls.includes('interview-technical'), false);
  assert.equal(result.state.interviewCurrentPhase, 'complete');
  assert.equal(result.state.interviewTerminalStatus, 'aborted');
  assert.equal(resolveInterviewStatusFromState(result.state), 'aborted');
// Provider-specific function removed);

test('interview final summary timeout falls back to a structured evaluation and readable artifact', async () => {
  const previousState = buildCompletedInterviewState();
  previousState.interviewCurrentPhase = 'complete';
  previousState.interviewPendingCandidateReply = undefined;
  const { workflowRuntime // Provider-specific function removed = createFakeWorkflowRuntime({
    'chatroom-room-admin': [{
      action: 'idle',
      visibility: 'hidden',
      phaseLabel: 'Wrap-up',
      phaseObjective: 'Move to final synthesis.',
      eventLabel: '',
      eventMessage: '',
      instruction: 'No more interviewer turns are needed.',
      reason: 'test',
      participantAdditions: [],
    // Provider-specific function removed],
    'chatroom-host': [{
      action: 'idle',
      visibility: 'hidden',
      headline: '',
      focus: 'summary',
      instruction: 'Proceed to final synthesis without another interviewer message.',
      reason: 'test',
    // Provider-specific function removed],
    'interview-turn-planner': [new Error('force heuristic complete')],
    'interview-summary': [new Error('summary timeout')],
  // Provider-specific function removed);

  const result = await continueChatroomWorkflow(workflowRuntime, previousState, {
    additionalRounds: 1,
  // Provider-specific function removed);

  assert.equal(result.state.interviewCurrentPhase, 'complete');
  assert(result.state.finalSummary);
  assert('overallScore' in result.state.finalSummary);
  assert('competencyScores' in result.state.finalSummary);
  const summary = result.state.finalSummary;
  assert.equal(summary.interviewStatus, 'complete');
  assert(summary.overallScore > 0);
  assert(summary.strengths.length > 0);
  assert(summary.weaknesses.length > 0);
  assert(summary.recommendedNextActions.length > 0);
  assert(summary.competencyScores.length > 0);
  assert(summary.questionLog.length >= 6);
  assert.match(summary.executiveSummary, /转录|面试|transcript/i);
  const summaryTrace = result.trace.find((item) => item.stepId === 'chatroom-summary');
  assert(summaryTrace);
  assert.equal(summaryTrace.status, 'partial');

  const artifact = buildRoomScenarioArtifactBundle(result.state, {
    generatedAt: '2026-04-13T12:00:00.000Z',
  // Provider-specific function removed);
  assert(artifact);
  const payload = artifact.payload as {
    overallScore: number;
    strengths: string[];
    concerns: string[];
    recommendedNextSteps: string[];
  // Provider-specific function removed;
  assert.equal(payload.overallScore, summary.overallScore);
  assert(payload.strengths.length > 0);
  assert(payload.concerns.length > 0);
  assert(payload.recommendedNextSteps.length > 0);
  assert.match(artifact.markdown, /## Strengths/);
  assert.match(artifact.markdown, /## Recommended Next Steps/);
// Provider-specific function removed);

test('final interview summary keeps aborted terminal status when the room already ended abnormally', async () => {
  const previousState = buildCompletedInterviewState();
  previousState.interviewCurrentPhase = 'complete';
  previousState.interviewPendingCandidateReply = undefined;
  previousState.interviewTerminalStatus = 'aborted';
  const llmSummary = buildInterviewSummaryOutput({
    executiveSummary: 'The candidate completed the interview successfully.',
    interviewStatus: 'complete',
    recommendedNextActions: ['Proceed to the final decision round.'],
  // Provider-specific function removed);
  const { workflowRuntime // Provider-specific function removed = createFakeWorkflowRuntime({
    'chatroom-room-admin': [{
      action: 'idle',
      visibility: 'hidden',
      phaseLabel: 'Wrap-up',
      phaseObjective: 'Move to final synthesis.',
      eventLabel: '',
      eventMessage: '',
      instruction: 'No more interviewer turns are needed.',
      reason: 'test',
      participantAdditions: [],
    // Provider-specific function removed],
    'chatroom-host': [{
      action: 'idle',
      visibility: 'hidden',
      headline: '',
      focus: 'summary',
      instruction: 'Proceed to final synthesis without another interviewer message.',
      reason: 'test',
    // Provider-specific function removed],
    'interview-turn-planner': [new Error('force heuristic complete')],
    'interview-summary': [llmSummary],
  // Provider-specific function removed);

  const result = await continueChatroomWorkflow(workflowRuntime, previousState, {
    additionalRounds: 1,
  // Provider-specific function removed);

  assert.equal(result.state.interviewTerminalStatus, 'aborted');
  assert(result.state.finalSummary);
  assert('interviewStatus' in result.state.finalSummary);
  const summary = result.state.finalSummary as InterviewSummary;
  assert.equal(summary.interviewStatus, 'aborted');
  assert.notEqual(summary.executiveSummary, llmSummary.executiveSummary);
  assert.notDeepEqual(summary.recommendedNextActions, llmSummary.recommendedNextActions);
  assert(summary.questionLog.length > 0);
  assert.equal(resolveInterviewStatusFromState(result.state), 'aborted');
// Provider-specific function removed);

test('heuristic final summary folds repaired answers and removes stale pending concerns on complete', async () => {
  const previousState = buildInterviewState({
    targetRole: 'Senior Backend Engineer',
    summaryEnabled: true,
    messages: [
      message({
        id: 'a1',
        role: 'agent',
        authorId: 'interview-hr',
        authorName: 'HR',
        round: 1,
        content: '你好，很高兴开始这场面试。请先做个自我介绍，重点说说你目前负责的后端系统，以及你对数据一致性和可靠性的关注点。',
      // Provider-specific function removed),
      message({
        id: 'u1',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 1,
        content: '???????????????????????? 1.8 ? QPS????????????',
      // Provider-specific function removed),
      message({
        id: 'a2',
        role: 'agent',
        authorId: 'interview-technical',
        authorName: 'Tech',
        round: 2,
        content:
          '我注意到你的回答似乎有编码问题，能否请你重新用中文完整回答一下：你目前负责的后端系统主要处理什么业务？系统的整体架构是怎样的？在数据一致性和可靠性方面，你具体采取了哪些关键设计？',
      // Provider-specific function removed),
      message({
        id: 'u2',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 2,
        content:
          '我目前负责电商交易后端，覆盖订单、支付、库存和对账链路。整体上是订单、支付、库存三个核心服务加消息总线和补偿任务，关键链路都做了幂等键、outbox 和对账补偿，保证支付成功后库存和订单状态最终一致。',
      // Provider-specific function removed),
      message({
        id: 'a3',
        role: 'agent',
        authorId: 'interview-technical',
        authorName: 'Tech',
        round: 3,
        content: '请结合一次线上事故，给出你触发回滚时看的错误率、延迟和补偿积压阈值。',
      // Provider-specific function removed),
      message({
        id: 'u3',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 3,
        content:
          '那次我看到支付链路错误率从 0.7% 拉到 4.1%，订单 P99 从 220ms 升到 680ms，补偿队列积压超过 1.5 万笔后就触发回滚，并在 6 分钟内切回旧链路。',
      // Provider-specific function removed),
      message({
        id: 'a4',
        role: 'agent',
        authorId: 'interview-observer',
        authorName: 'Observer',
        round: 4,
        content: '库存、支付和客服意见不一致时，你是怎么对齐的？如果有人反对回滚你怎么处理？',
      // Provider-specific function removed),
      message({
        id: 'u4',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 4,
        content:
          '我先把库存超卖、支付成功率和客服工单量放进同一份事故面板，对齐库存、支付、客服三个 owner 的止损线；如果有人反对回滚，我会把阈值和责任边界讲清楚，先按预设 SLA 执行，再在复盘里补策略调整。',
      // Provider-specific function removed),
      message({
        id: 'a5',
        role: 'agent',
        authorId: 'interview-manager',
        authorName: 'Manager',
        round: 5,
        content: '如果业务方强调转化率，你如何在用户体验和数据一致性之间取舍？',
      // Provider-specific function removed),
      message({
        id: 'u5',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 5,
        content:
          '我会优先守住支付成功和库存最终一致，因为坏账和错单的恢复成本更高；在这个前提下，再通过限流、降级和延迟非关键通知去守体验，而不是为了短期转化放大对账风险。',
      // Provider-specific function removed),
      message({
        id: 'a6',
        role: 'agent',
        authorId: 'interview-hr',
        authorName: 'HR',
        round: 6,
        content: '最后一个问题：你为什么想来这个岗位？这个机会最吸引你的部分是什么？',
      // Provider-specific function removed),
      message({
        id: 'u6',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 6,
        content:
          '我想做更复杂的交易稳定性治理，这个岗位正好能把架构演进和业务 owner 结合起来，而且你们看重核心交易链路的稳定性，这和我过去几年的经验高度匹配。',
      // Provider-specific function removed),
    ],
  // Provider-specific function removed);
  previousState.interviewCurrentPhase = 'complete';
  previousState.interviewPendingCandidateReply = undefined;
  previousState.recorderState = {
    schemaVersion: 1,
    lastUpdatedAt: '2026-04-10T00:00:00.000Z',
    entries: [
      {
        schemaVersion: 1,
        checkpointId: 'cp-stale',
        createdAt: '2026-04-10T00:00:00.000Z',
        round: 11,
        transcriptMessageCount: previousState.messages.length,
        updateMode: 'stage_checkpoints',
        summaryKind: 'interview',
        headline: 'Stale checkpoint',
        highlights: ['候选人已经给出若干有效回答。'],
        concerns: [
          '候选人尚未回答 HR 的自我介绍问题，缺少对负责后端系统、数据一致性与可靠性关注点的描述',
          '最后一个 interviewer 问题仍待候选人补答，当前证据尚未闭环。',
        ],
        nextSteps: [
          '先把当前问题直接回答完整，再补充背景和延展信息。',
          '继续等待候选人回复当前问题，不要提前切换到新的 interviewer。',
        ],
        artifactFocus: ['backend'],
        publishedToRoom: false,
        interviewStatus: 'in_progress',
        currentStage: 'HR wrap-up',
      // Provider-specific function removed,
    ],
  // Provider-specific function removed;

  const { workflowRuntime // Provider-specific function removed = createFakeWorkflowRuntime({
    'chatroom-room-admin': [{
      action: 'idle',
      visibility: 'hidden',
      phaseLabel: 'Wrap-up',
      phaseObjective: 'Move to final synthesis.',
      eventLabel: '',
      eventMessage: '',
      instruction: 'No more interviewer turns are needed.',
      reason: 'test',
      participantAdditions: [],
    // Provider-specific function removed],
    'chatroom-host': [{
      action: 'idle',
      visibility: 'hidden',
      headline: '',
      focus: 'summary',
      instruction: 'Proceed to final synthesis without another interviewer message.',
      reason: 'test',
    // Provider-specific function removed],
    'interview-turn-planner': [new Error('force heuristic complete')],
    'interview-summary': [new Error('summary timeout')],
  // Provider-specific function removed);

  const result = await continueChatroomWorkflow(workflowRuntime, previousState, {
    additionalRounds: 1,
  // Provider-specific function removed);

  assert(result.state.finalSummary);
  assert('interviewStatus' in result.state.finalSummary);
  const summary = result.state.finalSummary as InterviewSummary;
  assert.equal(summary.interviewStatus, 'complete');
  assert.equal(summary.questionLog.some((item) => /编码问题/u.test(item.question)), false);
  assert.equal(summary.missedQuestions.some((item) => /编码问题/u.test(item)), false);
  assert.equal(summary.followUpQuestions.some((item) => /编码问题/u.test(item)), false);
  assert.equal(
    summary.weaknesses.some((item) => /尚未回答|待候选人补答|未闭环/u.test(item)),
    false,
  );
  assert.equal(
    summary.recommendedNextActions.some((item) => /等待候选人/u.test(item)),
    false,
  );

  const repairedOpening = summary.questionLog.find((item) => item.question.includes('自我介绍'));
  assert(repairedOpening);
  assert.match(repairedOpening.candidateAnswer ?? '', /订单|支付|库存/u);
  assert.equal((repairedOpening.candidateAnswer ?? '').includes('????'), false);
  assert.equal(
    repairedOpening.evidenceGaps.includes('没有正面回应 interviewer 的核心问题。'),
    false,
  );

  const artifact = buildRoomScenarioArtifactBundle(result.state, {
    generatedAt: '2026-04-13T12:00:00.000Z',
  // Provider-specific function removed);
  assert(artifact);
  assert.equal(/编码问题|尚未回答|待候选人补答|未闭环/u.test(artifact.markdown), false);
// Provider-specific function removed);

test('interview continue keeps host and handoff notes out of the public transcript', async () => {
  const previousState = buildInterviewState({
    messages: [
      message({ id: 'a1', role: 'agent', authorId: 'interview-hr', authorName: 'HR', round: 1, content: '请先做一个简短自我介绍，并说明你最近主导的后端项目。' // Provider-specific function removed),
      message({ id: 'u1', role: 'user', authorId: 'user', authorName: 'Candidate', round: 1, content: '我做了三年后端，最近主导过支付与库存链路重构。' // Provider-specific function removed),
    ],
  // Provider-specific function removed);
  const { workflowRuntime, calls // Provider-specific function removed = createFakeWorkflowRuntime({
    'interview-turn-planner': [new Error('fallback to heuristic planner')],
    'chatroom-host': [{
      action: 'guide',
      visibility: 'visible',
      headline: '主持公开提示',
      focus: '继续围绕上一题追问',
      instruction: '保持单问单答节奏。',
      reason: 'test',
    // Provider-specific function removed],
    'interview-panel-handoff': ['请技术面试官继续围绕一致性故障深入追问。'],
    'interview-technical': ['你刚才提到支付与库存链路，请挑一个真实线上故障，按时间线说明你怎么定位和恢复。'],
  // Provider-specific function removed);

  const result = await continueChatroomWorkflow(workflowRuntime, previousState, {
    additionalRounds: 1,
  // Provider-specific function removed);

  const newMessages = result.state.messages.slice(previousState.messages.length);
  assert.deepEqual(
    newMessages.map((item) => item.authorId),
    ['interview-technical'],
  );
  assert(calls.includes('chatroom-host'));
  assert(calls.includes('interview-panel-handoff'));
  assert(!newMessages.some((item) => item.authorId === 'chatroom-host'));
  assert.equal(result.state.interviewPendingCandidateReply?.speakerId, 'interview-technical');
  assert.equal(result.state.interviewPendingCandidateReply?.promptMessageId, newMessages[0]?.id);
  assert.equal(result.state.interviewPendingCandidateReply?.responseMode, 'new_question');
  assert.equal(result.state.interviewInternalNotes?.length, 1);
  assert.equal(result.state.interviewInternalNotes?.[0]?.kind, 'panel_handoff');
  assert.equal(result.state.interviewInternalNotes?.[0]?.authorId, 'interview-hr');
  assert.equal(result.state.interviewInternalNotes?.[0]?.targetSpeakerId, 'interview-technical');
// Provider-specific function removed);

test('interview continue keeps panel discussion notes internal before manager handoff', async () => {
  const previousState = buildInterviewState({
    messages: [
      message({ id: 'a1', role: 'agent', authorId: 'interview-hr', authorName: 'HR', round: 1, content: '请做一个简短自我介绍。' // Provider-specific function removed),
      message({ id: 'u1', role: 'user', authorId: 'user', authorName: 'Candidate', round: 1, content: '我做了三年后端，主导过交易链路项目。' // Provider-specific function removed),
      message({ id: 'a2', role: 'agent', authorId: 'interview-technical', authorName: 'Tech', round: 2, content: '讲一个你处理过的一致性故障。' // Provider-specific function removed),
      message({ id: 'u2', role: 'user', authorId: 'user', authorName: 'Candidate', round: 2, content: '我用 outbox、幂等和补偿把支付与库存对齐。' // Provider-specific function removed),
      message({ id: 'a3', role: 'agent', authorId: 'interview-technical', authorName: 'Tech', round: 3, content: '具体说说最难的一次回滚决策。' // Provider-specific function removed),
      message({ id: 'u3', role: 'user', authorId: 'user', authorName: 'Candidate', round: 3, content: '我根据失败率和队列积压判断先止损，再做分批回滚。' // Provider-specific function removed),
      message({ id: 'a4', role: 'agent', authorId: 'interview-technical', authorName: 'Tech', round: 4, content: '如果补偿队列持续积压，你会怎么降级，先保什么指标？' // Provider-specific function removed),
      message({ id: 'u4', role: 'user', authorId: 'user', authorName: 'Candidate', round: 4, content: '我会先保支付成功率和库存最终一致，暂停非关键通知与营销事件，把补偿链路单独限流并提升对账频率。' // Provider-specific function removed),
      message({ id: 'a5', role: 'agent', authorId: 'interview-observer', authorName: 'Observer', round: 5, content: '你如何和库存、支付团队对齐这个方案？' // Provider-specific function removed),
      message({ id: 'u5', role: 'user', authorId: 'user', authorName: 'Candidate', round: 5, content: '库存团队担心超卖，支付团队担心主链路时延，我先把双方目标拆开，再用失败率、补偿积压和回滚阈值做同一份 SLA，对齐责任边界，最后推动两个负责人接受先灰度再收紧规则。' // Provider-specific function removed),
    ],
  // Provider-specific function removed);
  const { workflowRuntime, calls // Provider-specific function removed = createFakeWorkflowRuntime({
    'interview-turn-planner': [new Error('fallback to heuristic planner')],
    'chatroom-host': [{
      action: 'guide',
      visibility: 'visible',
      headline: '主持公开提示',
      focus: '转入经理轮',
      instruction: '只让当前面试官发言。',
      reason: 'test',
    // Provider-specific function removed],
    'interview-panel-discussion': ['建议经理聚焦跨团队博弈、owner 边界和推进方式。'],
    'interview-manager': ['如果库存团队坚持不同意这个方案，你会怎么推进，最终由谁拍板？'],
  // Provider-specific function removed);

  const result = await continueChatroomWorkflow(workflowRuntime, previousState, {
    additionalRounds: 1,
  // Provider-specific function removed);

  const newMessages = result.state.messages.slice(previousState.messages.length);
  assert.deepEqual(
    newMessages.map((item) => item.authorId),
    ['interview-manager'],
  );
  assert(calls.includes('chatroom-host'));
  assert(calls.includes('interview-panel-discussion'));
  assert(!calls.includes('interview-panel-handoff'));
  assert(!newMessages.some((item) => item.authorId === 'chatroom-host'));
  assert.equal(result.state.interviewInternalNotes?.length, 1);
  assert.equal(result.state.interviewInternalNotes?.[0]?.kind, 'panel_discussion');
  assert.equal(result.state.interviewInternalNotes?.[0]?.authorId, 'interview-observer');
  assert.equal(result.state.interviewInternalNotes?.[0]?.targetSpeakerId, 'interview-manager');
// Provider-specific function removed);

test('interviewer collaboration markers are hidden from the candidate transcript and persisted internally', async () => {
  const previousState = buildInterviewState({
    messages: [
      message({
        id: 'a1',
        role: 'agent',
        authorId: 'interview-hr',
        authorName: 'HR',
        round: 1,
        content: '请先做一个简短自我介绍，并说明最近最有代表性的后端项目。',
      // Provider-specific function removed),
      message({
        id: 'u1',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 1,
        content: '我做过三年后端，最近主导过支付链路改造。',
      // Provider-specific function removed),
    ],
  // Provider-specific function removed);
  previousState.interviewCurrentPhase = 'opening';
  previousState.interviewPendingCandidateReply = undefined;

  const { workflowRuntime // Provider-specific function removed = createFakeWorkflowRuntime({
    'interview-hr': [
      '你刚才提到支付链路改造，请挑一个你亲自负责的关键决策讲清楚。【协作|风险提醒|澄清重试:候选人目前只给了项目名，没有讲清自己的边界和判断依据。】',
    ],
    'interview-technical': [
      '你刚才提到支付链路改造，请挑一个你亲自负责的关键决策讲清楚。【协作|风险提醒|澄清重试:候选人目前只给了项目名，没有讲清自己的边界和判断依据。】',
    ],
  // Provider-specific function removed);

  const result = await continueChatroomWorkflow(workflowRuntime, previousState, {
    additionalRounds: 1,
  // Provider-specific function removed);

  const newMessages = result.state.messages.slice(previousState.messages.length);
  assert.equal(newMessages.length, 1);
  assert.equal(
    newMessages[0]?.content.includes('【协作:'),
    false,
  );
  assert.match(
    newMessages[0]?.content ?? '',
    /关键决策/u,
  );
  assert.equal(result.state.interviewInternalNotes?.length, 1);
  assert.equal(result.state.interviewInternalNotes?.[0]?.kind, 'speaker_collaboration');
  assert.equal(result.state.interviewInternalNotes?.[0]?.authorId, newMessages[0]?.authorId);
  assert.deepEqual(result.state.interviewInternalNotes?.[0]?.signalTags, [
    'risk_alert',
    'retry_with_clarify',
  ]);
  assert.match(
    result.state.interviewInternalNotes?.[0]?.content ?? '',
    /边界和判断依据/u,
  );
// Provider-specific function removed);

test('long technical answers mentioning pause-like words still count as answers', () => {
  const kind = classifyInterviewCandidateTurnMessage(
    message({
      id: 'u-pause-false-positive',
      role: 'user',
      authorId: 'user',
      authorName: 'Candidate',
      round: 5,
      content:
        '我们做了一个降级开关，如果 Kafka 长时间异常，会暂停部分非关键事件，比如营销和通知，只保留订单、库存、支付这些关键事件，避免 outbox 无限堆积把数据库拖垮。',
    // Provider-specific function removed),
  );

  assert.equal(kind, 'answer');
// Provider-specific function removed);

test('answer coverage marks quantitative prompts as insufficient when numbers are missing', () => {
  const coverage = assessInterviewAnswerCoverage({
    previousPrompt: message({
      id: 'a-quant',
      role: 'agent',
      authorId: 'interview-technical',
      authorName: 'Tech',
      round: 3,
      content:
        '请直接回答：改造前峰值 RT 大概是多少毫秒，失败重试率是多少？改造后分别降到了什么量级？',
    // Provider-specific function removed),
    candidateMessage: message({
      id: 'u-quant-miss',
      role: 'user',
      authorId: 'user',
      authorName: 'Candidate',
      round: 3,
      content:
        '我们当时主要用 outbox、幂等和补偿任务来稳住一致性，架构上做了不少拆分。',
    // Provider-specific function removed),
  // Provider-specific function removed);

  assert.ok(coverage);
  assert.equal(coverage?.isAdequate, false);
  assert.equal(coverage?.missingCategory, 'quantitative');
// Provider-specific function removed);

test('answer coverage treats corrupted placeholder text as an invalid response', () => {
  const coverage = assessInterviewAnswerCoverage({
    previousPrompt: message({
      id: 'a-corrupt',
      role: 'agent',
      authorId: 'interview-hr',
      authorName: 'HR',
      round: 1,
      content: '请先做个自我介绍，重点说说你负责的后端系统。',
    // Provider-specific function removed),
    candidateMessage: message({
      id: 'u-corrupt',
      role: 'user',
      authorId: 'user',
      authorName: 'Candidate',
      round: 1,
      content: '???????????????????? 1.8 ? QPS????????????',
    // Provider-specific function removed),
  // Provider-specific function removed);

  assert.ok(coverage);
  assert.equal(coverage?.isAdequate, false);
  assert.equal(coverage?.missingCategory, 'direct_response');
// Provider-specific function removed);

test('answer coverage marks cross-team manager prompts as insufficient when coordination details are missing', () => {
  const coverage = assessInterviewAnswerCoverage({
    previousPrompt: message({
      id: 'a-manager',
      role: 'agent',
      authorId: 'interview-manager',
      authorName: 'Manager',
      round: 6,
      content:
        '这些改动涉及库存团队、支付团队甚至客服侧的配合，你是怎么推动这些跨团队对齐的？对方如果觉得做不到，你怎么处理？',
    // Provider-specific function removed),
    candidateMessage: message({
      id: 'u-manager-miss',
      role: 'user',
      authorId: 'user',
      authorName: 'Candidate',
      round: 6,
      content:
        '这个 tradeoff 是我主动推动的，因为当时业务目标是先稳住成功率和转化，所以我们先保稳定性和吞吐。',
    // Provider-specific function removed),
  // Provider-specific function removed);

  assert.ok(coverage);
  assert.equal(coverage?.isAdequate, false);
  assert.equal(coverage?.missingCategory, 'collaboration');
// Provider-specific function removed);

test('answer coverage accepts candidate questions during HR wrap-up', () => {
  const coverage = assessInterviewAnswerCoverage({
    previousPrompt: message({
      id: 'a-wrap',
      role: 'agent',
      authorId: 'interview-hr',
      authorName: 'HR',
      round: 7,
      content: '如果你有任何想问我们的问题，也可以一起提出来。',
    // Provider-specific function removed),
    candidateMessage: message({
      id: 'u-wrap',
      role: 'user',
      authorId: 'user',
      authorName: 'Candidate',
      round: 7,
      content: '我想了解团队怎么划分业务需求和基础能力建设的优先级？',
    // Provider-specific function removed),
  // Provider-specific function removed);

  assert.ok(coverage);
  assert.equal(coverage?.isAdequate, true);
// Provider-specific function removed);

test('wrap-up no-question replies without punctuation still count as answers', () => {
  const previousPrompt = message({
    id: 'a-wrap-none',
    role: 'agent',
    authorId: 'interview-hr',
    authorName: 'HR',
    round: 7,
    content: '如果你有任何想问我们的，也可以一起提出来。',
  // Provider-specific function removed);
  const candidateMessage = message({
    id: 'u-wrap-none',
    role: 'user',
    authorId: 'user',
    authorName: 'Candidate',
    round: 7,
    content: '暂时没有问题',
  // Provider-specific function removed);

  assert.equal(
    classifyInterviewCandidateTurnMessage(candidateMessage, previousPrompt),
    'answer',
  );
  const coverage = assessInterviewAnswerCoverage({
    previousPrompt,
    candidateMessage,
  // Provider-specific function removed);
  assert.ok(coverage);
  assert.equal(coverage?.isAdequate, true);
// Provider-specific function removed);

test('weak answers still count as answers and trigger follow-up coverage', () => {
  const previousPrompt = message({
    id: 'a-weak',
    role: 'agent',
    authorId: 'interview-technical',
    authorName: 'Tech',
    round: 3,
    content: '为什么你当时会这样权衡？',
  // Provider-specific function removed);
  const candidateMessage = message({
    id: 'u-weak',
    role: 'user',
    authorId: 'user',
    authorName: 'Candidate',
    round: 3,
    content: '这个我不知道',
  // Provider-specific function removed);

  assert.equal(
    classifyInterviewCandidateTurnMessage(candidateMessage, previousPrompt),
    'answer',
  );
  const coverage = assessInterviewAnswerCoverage({
    previousPrompt,
    candidateMessage,
  // Provider-specific function removed);
  assert.ok(coverage);
  assert.equal(coverage?.isAdequate, false);
  assert.equal(coverage?.missingCategory, 'direct_response');
// Provider-specific function removed);

test('fallback planner keeps the same interviewer on clarification requests', () => {
  const state = buildInterviewState({
    messages: [
      message({ id: 'a1', role: 'agent', authorId: 'interview-hr', authorName: 'HR', round: 1, content: 'Please introduce yourself.' // Provider-specific function removed),
      message({ id: 'u1', role: 'user', authorId: 'user', authorName: 'Candidate', round: 1, content: 'I have three years of backend experience working on billing services.' // Provider-specific function removed),
      message({ id: 'a2', role: 'agent', authorId: 'interview-technical', authorName: 'Tech', round: 2, content: 'Walk me through a real consistency failure you handled in production.' // Provider-specific function removed),
      message({ id: 'u2', role: 'user', authorId: 'user', authorName: 'Candidate', round: 2, content: 'Could you clarify whether you want the incident timeline or the technical fix first?' // Provider-specific function removed),
    ],
  // Provider-specific function removed);

  const plan = expectAsk(resolveInterviewTurnPlanFallback(state));
  assert.equal(plan.responseMode, 'clarify');
  assert.equal(plan.speakerId, 'interview-technical');
  assert.equal(plan.phase, 'technical_deep_dive');
// Provider-specific function removed);

test('fallback planner does not regress below the recorded interview phase', () => {
  const state = buildInterviewState({
    messages: [
      message({ id: 'a1', role: 'agent', authorId: 'interview-hr', authorName: 'HR', round: 1, content: 'Please introduce yourself.' // Provider-specific function removed),
      message({ id: 'u1', role: 'user', authorId: 'user', authorName: 'Candidate', round: 1, content: 'I led backend services for orders and payments.' // Provider-specific function removed),
    ],
  // Provider-specific function removed);
  state.interviewCurrentPhase = 'manager';

  const plan = expectAsk(resolveInterviewTurnPlanFallback(state));
  assert.equal(plan.phase, 'manager_round');
  assert.equal(plan.speakerId, 'interview-manager');
// Provider-specific function removed);

test('fallback planner lifts opening phase to hr follow-up after the first valid answer', () => {
  const state = buildInterviewState({
    messages: [
      message({ id: 'a1', role: 'agent', authorId: 'interview-hr', authorName: 'HR', round: 1, content: 'Please introduce yourself.' // Provider-specific function removed),
      message({ id: 'u1', role: 'user', authorId: 'user', authorName: 'Candidate', round: 1, content: 'I spent three years on backend systems and recently led a payments migration.' // Provider-specific function removed),
    ],
  // Provider-specific function removed);
  state.interviewCurrentPhase = 'opening';

  const plan = expectAsk(resolveInterviewTurnPlanFallback(state));
  assert.notEqual(plan.phase, 'opening');
  assert.ok([
    'hr_followup',
    'technical_deep_dive',
    'observer_followup',
    'manager_round',
    'hr_wrap_up',
  ].includes(plan.phase));
// Provider-specific function removed);

test('planner output cannot regress below the recorded interview phase during continue', async () => {
  const previousState = buildInterviewState({
    messages: [
      message({ id: 'a1', role: 'agent', authorId: 'interview-hr', authorName: 'HR', round: 1, content: 'Please introduce yourself.' // Provider-specific function removed),
      message({ id: 'u1', role: 'user', authorId: 'user', authorName: 'Candidate', round: 1, content: 'I led backend services for orders and payments.' // Provider-specific function removed),
    ],
  // Provider-specific function removed);
  previousState.interviewCurrentPhase = 'technical';

  const { workflowRuntime, calls // Provider-specific function removed = createFakeWorkflowRuntime({
    'interview-turn-planner': [{
      nextAction: 'ask',
      currentStage: 'opening',
      currentStageLabel: 'opening self-introduction',
      speakerRole: 'hr_interviewer',
      stageObjective: 'Go back to the introduction.',
      questionGoal: 'Repeat the opening question.',
      handoffReason: 'regression test',
      responseMode: 'new_question',
      candidateMessageType: 'answer',
      evidenceStatus: 'adequate',
      confidence: 0.95,
    // Provider-specific function removed],
    'chatroom-host': [{
      action: 'guide',
      visibility: 'hidden',
      headline: '',
      focus: 'keep the interview moving',
      instruction: 'Only one interviewer should speak.',
      reason: 'test',
    // Provider-specific function removed],
    'interview-panel-handoff': ['Technical interviewer takes over from HR.'],
    'interview-technical': ['Tell me about a production consistency failure you resolved.'],
  // Provider-specific function removed);

  const result = await continueChatroomWorkflow(workflowRuntime, previousState, {
    additionalRounds: 1,
  // Provider-specific function removed);

  const newMessages = result.state.messages.slice(previousState.messages.length);
  assert(calls.includes('interview-turn-planner'));
  assert.deepEqual(
    newMessages.map((item) => item.authorId),
    ['interview-technical'],
  );
  assert.equal(result.state.interviewCurrentPhase, 'technical');
// Provider-specific function removed);

test('interview continue forces completion after three consecutive wait rounds', async () => {
  const workflow = createFakeWorkflowRuntime({// Provider-specific function removed);
  let currentState = buildInterviewState({
    messages: [
      message({ id: 'a1', role: 'agent', authorId: 'interview-hr', authorName: 'HR', round: 1, content: 'Please introduce yourself.' // Provider-specific function removed),
    ],
  // Provider-specific function removed);

  for (let index = 0; index < 3; index += 1) {
    const result = await continueChatroomWorkflow(workflow.workflowRuntime, currentState, {
      additionalRounds: 1,
      humanMessage: '稍等一下，我这边网络还没恢复。',
      humanAuthorName: 'Candidate',
    // Provider-specific function removed);
    currentState = result.state;
  // Provider-specific function removed

  assert.equal(currentState.interviewCurrentPhase, 'complete');
  assert.equal(currentState.interviewConsecutiveWaitCount, 0);
  assert.equal(currentState.messages.length, 4);
  assert.equal(workflow.calls.includes('interview-turn-planner'), false);
// Provider-specific function removed);

test('interview continue keeps pending reply state when the candidate pauses', async () => {
  const workflow = createFakeWorkflowRuntime({// Provider-specific function removed);
  const currentState = buildInterviewState({
    messages: [
      message({ id: 'a1', role: 'agent', authorId: 'interview-technical', authorName: 'Tech', round: 1, content: '先按时间线展开你最难的一次线上事故。' // Provider-specific function removed),
    ],
  // Provider-specific function removed);
  currentState.interviewPendingCandidateReply = {
    promptMessageId: 'a1',
    speakerId: 'interview-technical',
    round: 1,
    responseMode: 'new_question',
  // Provider-specific function removed;

  const result = await continueChatroomWorkflow(workflow.workflowRuntime, currentState, {
    additionalRounds: 1,
    humanMessage: '稍等一下，我网络有点问题',
    humanAuthorName: 'Candidate',
  // Provider-specific function removed);

  assert.equal(result.state.interviewPendingCandidateReply?.promptMessageId, 'a1');
  assert.equal(result.state.interviewPendingCandidateReply?.speakerId, 'interview-technical');
  assert.equal(result.state.interviewPendingCandidateReply?.responseMode, 'new_question');
// Provider-specific function removed);

test('interview continue tracks silent waits and auto-completes after repeated no-reply turns', async () => {
  const workflow = createFakeWorkflowRuntime({// Provider-specific function removed);
  const currentState = buildInterviewState({
    messages: [
      message({
        id: 'a1',
        role: 'agent',
        authorId: 'interview-technical',
        authorName: 'Tech',
        round: 1,
        content: '先按时间线展开你最难的一次线上事故，我只听事实和你的决策',
      // Provider-specific function removed),
    ],
  // Provider-specific function removed);
  currentState.interviewPendingCandidateReply = {
    promptMessageId: 'a1',
    speakerId: 'interview-technical',
    round: 1,
    responseMode: 'new_question',
  // Provider-specific function removed;

  const waitingResult = await continueChatroomWorkflow(workflow.workflowRuntime, currentState, {
    additionalRounds: 1,
  // Provider-specific function removed);

  assert.equal(waitingResult.state.messages.length, currentState.messages.length);
  assert.equal(waitingResult.state.interviewCurrentPhase, 'technical');
  assert.equal(waitingResult.state.interviewConsecutiveWaitCount, 1);
  assert.equal(waitingResult.state.interviewPendingCandidateReply?.promptMessageId, 'a1');
  assert.equal(waitingResult.state.interviewPendingCandidateReply?.speakerId, 'interview-technical');
  assert.equal(workflow.calls.includes('interview-turn-planner'), false);

  const secondResult = await continueChatroomWorkflow(workflow.workflowRuntime, waitingResult.state, {
    additionalRounds: 1,
  // Provider-specific function removed);

  assert.equal(secondResult.state.interviewConsecutiveWaitCount, 2);
  assert.equal(secondResult.state.interviewPendingCandidateReply?.promptMessageId, 'a1');

  const finalResult = await continueChatroomWorkflow(workflow.workflowRuntime, secondResult.state, {
    additionalRounds: 1,
  // Provider-specific function removed);

  assert.equal(finalResult.state.interviewCurrentPhase, 'complete');
  assert.equal(finalResult.state.interviewPendingCandidateReply, undefined);
  assert.equal(finalResult.state.interviewConsecutiveWaitCount, 0);
  assert.equal(finalResult.state.interviewTerminalStatus, 'aborted');
  assert.equal(resolveInterviewStatusFromState(finalResult.state), 'aborted');
// Provider-specific function removed);

test('interview continue completes immediately when the candidate explicitly ends the interview', async () => {
  const workflow = createFakeWorkflowRuntime({// Provider-specific function removed);
  const currentState = buildInterviewState({
    messages: [
      message({ id: 'a1', role: 'agent', authorId: 'interview-hr', authorName: 'HR', round: 1, content: 'Please introduce yourself.' // Provider-specific function removed),
    ],
  // Provider-specific function removed);

  const result = await continueChatroomWorkflow(workflow.workflowRuntime, currentState, {
    additionalRounds: 1,
    humanMessage: '今天先到这里吧',
    humanAuthorName: 'Candidate',
  // Provider-specific function removed);

  assert.equal(result.state.interviewCurrentPhase, 'complete');
  assert.equal(workflow.calls.includes('interview-turn-planner'), false);
  assert.deepEqual(
    result.state.messages.slice(currentState.messages.length).map((item) => item.role),
    ['user'],
  );
// Provider-specific function removed);

test('fallback planner keeps the same interviewer when the latest answer misses requested numbers', () => {
  const state = buildInterviewState({
    messages: [
      message({ id: 'a1', role: 'agent', authorId: 'interview-hr', authorName: 'HR', round: 1, content: 'Please introduce yourself.' // Provider-specific function removed),
      message({ id: 'u1', role: 'user', authorId: 'user', authorName: 'Candidate', round: 1, content: 'I led backend services for orders and payments.' // Provider-specific function removed),
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
    ],
  // Provider-specific function removed);

  const plan = expectAsk(resolveInterviewTurnPlanFallback(state));
  assert.equal(plan.speakerId, 'interview-technical');
  assert.equal(plan.phase, 'technical_deep_dive');
  assert.match(plan.focus, /数字|量化/);
// Provider-specific function removed);

test('fallback planner honors collaboration retry notes before switching to the manager round', () => {
  const state = buildInterviewState({
    messages: [
      message({ id: 'a1', role: 'agent', authorId: 'interview-hr', authorName: 'HR', round: 1, content: '请先做一个简短自我介绍。' // Provider-specific function removed),
      message({ id: 'u1', role: 'user', authorId: 'user', authorName: 'Candidate', round: 1, content: '我是计算机本科生，做过课程项目和一次后端实习。' // Provider-specific function removed),
      message({ id: 'a2', role: 'agent', authorId: 'interview-technical', authorName: 'Tech', round: 2, content: '讲一个你亲自定位并解决的问题。' // Provider-specific function removed),
      message({ id: 'u2', role: 'user', authorId: 'user', authorName: 'Candidate', round: 2, content: '我主要做过课程项目里的接口和排错。' // Provider-specific function removed),
      message({ id: 'a3', role: 'agent', authorId: 'interview-technical', authorName: 'Tech', round: 3, content: '请换成一个具体问题，说明现象、定位过程和结果。' // Provider-specific function removed),
      message({ id: 'u3', role: 'user', authorId: 'user', authorName: 'Candidate', round: 3, content: '有一次接口超时，但我讲得还不够清楚。' // Provider-specific function removed),
      message({ id: 'a4', role: 'agent', authorId: 'interview-technical', authorName: 'Tech', round: 4, content: '那你继续讲清楚是怎么定位到根因的。' // Provider-specific function removed),
      message({ id: 'u4', role: 'user', authorId: 'user', authorName: 'Candidate', round: 4, content: '我有点紧张，可能需要你把问题再缩小一点。' // Provider-specific function removed),
    ],
  // Provider-specific function removed);
  state.roomBlueprint!.title = INTERVIEW_DEMO_ROOM_TITLE;
  state.interviewInternalNotes = [
    {
      schemaVersion: 1,
      noteId: 'n-retry-1',
      kind: 'speaker_collaboration',
      createdAt: '2026-04-10T00:00:00.000Z',
      round: 4,
      authorId: 'interview-observer',
      authorName: 'Observer',
      targetSpeakerId: 'interview-technical',
      targetSpeakerName: 'Tech',
      phaseLabel: 'technical_deep_dive',
      content: '候选人偏新人而且有点紧张，先让技术面试官围绕当前问题更友好地缩窄和澄清，不要立刻切到综合追问。',
    // Provider-specific function removed,
  ];

  const plan = expectAsk(resolveInterviewTurnPlanFallback(state));
  assert.equal(plan.speakerId, 'interview-technical');
  assert.equal(plan.phase, 'technical_deep_dive');
  assert.equal(plan.responseMode, 'clarify');
  assert.match(plan.focus, /Keep the same evidence thread/i);
  assert.match(plan.focus, /narrow the question first/i);
// Provider-specific function removed);

test('fallback planner does not leave manager round when cross-team answer is still missing', () => {
  const state = buildInterviewState({
    messages: [
      message({ id: 'a1', role: 'agent', authorId: 'interview-hr', authorName: 'HR', round: 1, content: 'Please introduce yourself.' // Provider-specific function removed),
      message({ id: 'u1', role: 'user', authorId: 'user', authorName: 'Candidate', round: 1, content: 'I led backend work for payments and orders.' // Provider-specific function removed),
      message({ id: 'a2', role: 'agent', authorId: 'interview-technical', authorName: 'Tech', round: 2, content: 'What consistency strategy did you use?' // Provider-specific function removed),
      message({ id: 'u2', role: 'user', authorId: 'user', authorName: 'Candidate', round: 2, content: 'We used outbox, idempotency keys, and compensation tasks.' // Provider-specific function removed),
      message({ id: 'a3', role: 'agent', authorId: 'interview-observer', authorName: 'Observer', round: 3, content: 'What was the hardest production incident?' // Provider-specific function removed),
      message({ id: 'u3', role: 'user', authorId: 'user', authorName: 'Candidate', round: 3, content: 'A queue backlog delayed stock release and caused a short oversell window.' // Provider-specific function removed),
      message({
        id: 'a4',
        role: 'agent',
        authorId: 'interview-manager',
        authorName: 'Manager',
        round: 4,
        content:
          '这些改动涉及库存团队、支付团队甚至客服侧的配合，你是怎么推动这些跨团队对齐的？对方如果觉得做不到，你怎么处理？',
      // Provider-specific function removed),
      message({
        id: 'u4',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 4,
        content:
          '这个 tradeoff 是我主动推动的，因为业务目标是先稳住成功率和转化，所以我们先保稳定性和吞吐。',
      // Provider-specific function removed),
    ],
  // Provider-specific function removed);

  const plan = expectAsk(resolveInterviewTurnPlanFallback(state));
  assert.equal(plan.speakerId, 'interview-manager');
  assert.equal(plan.phase, 'manager_round');
  assert.match(plan.focus, /跨团队|owner|协商|推动/);
// Provider-specific function removed);

test('inferInterviewStatusFromMessages stays in progress when a new interviewer question is still pending', () => {
  const messages: ChatroomMessage[] = [];
  for (let round = 1; round <= 6; round += 1) {
    messages.push(
      message({
        id: `a${round// Provider-specific function removed`,
        role: 'agent',
        authorId: round < 3 ? 'interview-hr' : round < 5 ? 'interview-technical' : 'interview-manager',
        authorName: 'Interviewer',
        round,
        content: `Question ${round// Provider-specific function removed`,
      // Provider-specific function removed),
    );
    messages.push(
      message({
        id: `u${round// Provider-specific function removed`,
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round,
        content: `Answer ${round// Provider-specific function removed: I handled the situation with specific tradeoffs and measurable results.`,
      // Provider-specific function removed),
    );
  // Provider-specific function removed
  messages.push(
    message({
      id: 'a7',
      role: 'agent',
      authorId: 'interview-hr',
      authorName: 'HR',
      round: 7,
      content: 'Do you have any questions for us before we close?',
    // Provider-specific function removed),
  );

  assert.equal(inferInterviewStatusFromMessages(messages), 'in_progress');
// Provider-specific function removed);

test('product interview room uses product-specific panel labels', () => {
  const blueprint = createChatroomRoomBlueprint({
    scenarioTemplateId: 'interview_simulation',
    roomType: 'expert_discussion',
    topic: 'Product Manager',
    objective: 'Run a realistic PM interview.',
    speakerIds: ['interview-hr', 'interview-technical', 'interview-manager', 'interview-observer'],
    metadata: {
      scenario: {
        targetRole: 'Product Manager',
        focusAreas: ['metrics', 'prioritization'],
      // Provider-specific function removed,
    // Provider-specific function removed,
  // Provider-specific function removed);

  const productSlot = blueprint.participantSlots.find((slot) => slot.slotId === 'technical-interviewer');
  assert.ok(productSlot);
  assert.equal(productSlot?.label, 'Product Case Interviewer');
  assert.match(productSlot?.description ?? '', /product thinking|metrics|prioritization/i);
// Provider-specific function removed);

test('product fallback deep-dive focus does not fall back to backend wording', () => {
  const state = buildInterviewState({
    targetRole: 'Product Manager',
    focusAreas: ['metrics', 'prioritization'],
    messages: [
      message({ id: 'a1', role: 'agent', authorId: 'interview-hr', authorName: 'HR', round: 1, content: 'Please introduce yourself.' // Provider-specific function removed),
      message({ id: 'u1', role: 'user', authorId: 'user', authorName: 'Candidate', round: 1, content: 'I led growth experiments for a B2B product and owned the onboarding roadmap.' // Provider-specific function removed),
    ],
  // Provider-specific function removed);

  const plan = expectAsk(resolveInterviewTurnPlanFallback(state));
  assert.equal(plan.phase, 'technical_deep_dive');
  assert.match(plan.focus, /user problem|product|metrics|prioritization/i);
  assert.doesNotMatch(plan.focus, /database|consistency|backend/i);
// Provider-specific function removed);

test('repeated identical candidate answers are classified as repeated_answer', () => {
  const previousPrompt = message({
    id: 'a1',
    role: 'agent',
    authorId: 'interview-technical',
    authorName: 'Tech',
    round: 2,
    content: '讲一个你处理过的一致性故障。',
  // Provider-specific function removed);
  const candidateAnswer = '我做了三年后端，最近主导过支付与库存链路重构。';
  const previousAnswers = [
    message({ id: 'u0', role: 'user', authorId: 'user', authorName: 'Candidate', round: 1, content: candidateAnswer // Provider-specific function removed),
  ];
  const currentMessage = message({
    id: 'u1',
    role: 'user',
    authorId: 'user',
    authorName: 'Candidate',
    round: 2,
    content: candidateAnswer,
  // Provider-specific function removed);

  assert.equal(
    classifyInterviewCandidateTurnMessage(currentMessage, previousPrompt, previousAnswers),
    'repeated_answer',
  );
// Provider-specific function removed);

test('different candidate answers are not classified as repeated_answer', () => {
  const previousPrompt = message({
    id: 'a1',
    role: 'agent',
    authorId: 'interview-technical',
    authorName: 'Tech',
    round: 2,
    content: '讲一个你处理过的一致性故障。',
  // Provider-specific function removed);
  const previousAnswers = [
    message({ id: 'u0', role: 'user', authorId: 'user', authorName: 'Candidate', round: 1, content: '我做了三年后端，最近主导过支付与库存链路重构。' // Provider-specific function removed),
  ];
  const currentMessage = message({
    id: 'u1',
    role: 'user',
    authorId: 'user',
    authorName: 'Candidate',
    round: 2,
    content: '那次我看到支付链路错误率从 0.7% 拉到 4.1%，订单 P99 从 220ms 升到 680ms。',
  // Provider-specific function removed);

  assert.equal(
    classifyInterviewCandidateTurnMessage(currentMessage, previousPrompt, previousAnswers),
    'answer',
  );
// Provider-specific function removed);

test('short repeated answers are not classified as repeated_answer', () => {
  const previousPrompt = message({
    id: 'a1',
    role: 'agent',
    authorId: 'interview-hr',
    authorName: 'HR',
    round: 2,
    content: '你还有什么想问的吗？',
  // Provider-specific function removed);
  const previousAnswers = [
    message({ id: 'u0', role: 'user', authorId: 'user', authorName: 'Candidate', round: 1, content: '没有了' // Provider-specific function removed),
  ];
  const currentMessage = message({
    id: 'u1',
    role: 'user',
    authorId: 'user',
    authorName: 'Candidate',
    round: 2,
    content: '没有了',
  // Provider-specific function removed);

  const kind = classifyInterviewCandidateTurnMessage(currentMessage, previousPrompt, previousAnswers);
  assert.notEqual(kind, 'repeated_answer');
// Provider-specific function removed);

test('repeated_answer control plan returns wait for first repeat and complete after 3 repeats', () => {
  const resolveStageLabel = () => 'Technical Deep Dive';

  const waitPlan = resolveInterviewCandidateControlPlan({
    candidateReplyCount: 2,
    stageCounts: { hr: 1, technical: 1, observer: 0, manager: 0 // Provider-specific function removed,
    latestCandidateTurnKind: 'repeated_answer',
    latestQuestionMessage: message({
      id: 'a1',
      role: 'agent',
      authorId: 'interview-technical',
      authorName: 'Tech',
      round: 2,
      content: '讲一个你处理过的一致性故障。',
    // Provider-specific function removed),
    resolveStageLabel,
    repeatedAnswerCount: 1,
  // Provider-specific function removed);
  assert.equal(waitPlan?.kind, 'wait');

  const completePlan = resolveInterviewCandidateControlPlan({
    candidateReplyCount: 4,
    stageCounts: { hr: 1, technical: 2, observer: 0, manager: 0 // Provider-specific function removed,
    latestCandidateTurnKind: 'repeated_answer',
    latestQuestionMessage: message({
      id: 'a2',
      role: 'agent',
      authorId: 'interview-technical',
      authorName: 'Tech',
      round: 4,
      content: '请直接回答上一问。',
    // Provider-specific function removed),
    resolveStageLabel,
    repeatedAnswerCount: 3,
  // Provider-specific function removed);
  assert.equal(completePlan?.kind, 'complete');
  assert.equal(completePlan?.terminalStatus, 'aborted');
// Provider-specific function removed);

test('withdraw_request control plan resolves to aborted completion', () => {
  const plan = resolveInterviewCandidateControlPlan({
    candidateReplyCount: 2,
    stageCounts: { hr: 1, technical: 1, observer: 0, manager: 0 // Provider-specific function removed,
    latestCandidateTurnKind: 'withdraw_request',
    latestQuestionMessage: message({
      id: 'a1',
      role: 'agent',
      authorId: 'interview-technical',
      authorName: 'Tech',
      round: 2,
      content: '璁蹭竴涓綘澶勭悊杩囩殑鐪熷疄鏁呴殰銆?',
    // Provider-specific function removed),
    resolveStageLabel: () => 'Technical Deep Dive',
  // Provider-specific function removed);

  assert.deepEqual(plan, {
    kind: 'complete',
    reason: 'The candidate explicitly asked to end the interview, so the room should stop and move to synthesis.',
    terminalStatus: 'aborted',
  // Provider-specific function removed);
// Provider-specific function removed);

test('countConsecutiveRepeatedCandidateAnswers only counts the repeated tail', () => {
  const repeatedAnswer = '我做了三年后端，最近主导过支付与库存链路重构。';
  const messages = [
    message({ id: 'a1', role: 'agent', authorId: 'interview-hr', authorName: 'HR', round: 1, content: '请先做一个简短自我介绍。' // Provider-specific function removed),
    message({ id: 'u1', role: 'user', authorId: 'user', authorName: 'Candidate', round: 1, content: repeatedAnswer // Provider-specific function removed),
    message({ id: 'a2', role: 'agent', authorId: 'interview-technical', authorName: 'Tech', round: 2, content: '讲一个你处理过的一致性故障。' // Provider-specific function removed),
    message({ id: 'u2', role: 'user', authorId: 'user', authorName: 'Candidate', round: 2, content: repeatedAnswer // Provider-specific function removed),
    message({ id: 'a3', role: 'agent', authorId: 'interview-technical', authorName: 'Tech', round: 3, content: '请不要概述经历，直接讲故障时间线。' // Provider-specific function removed),
    message({ id: 'u3', role: 'user', authorId: 'user', authorName: 'Candidate', round: 3, content: repeatedAnswer // Provider-specific function removed),
  ];

  assert.equal(countConsecutiveRepeatedCandidateAnswers(messages), 2);
// Provider-specific function removed);

test('fallback planner completes after three repeated answers in a row', () => {
  const repeatedAnswer = '我做了三年后端，最近主导过支付与库存链路重构。';
  const state = buildInterviewState({
    messages: [
      message({ id: 'a1', role: 'agent', authorId: 'interview-hr', authorName: 'HR', round: 1, content: '请先做一个简短自我介绍。' // Provider-specific function removed),
      message({ id: 'u1', role: 'user', authorId: 'user', authorName: 'Candidate', round: 1, content: repeatedAnswer // Provider-specific function removed),
      message({ id: 'a2', role: 'agent', authorId: 'interview-technical', authorName: 'Tech', round: 2, content: '讲一个你处理过的一致性故障。' // Provider-specific function removed),
      message({ id: 'u2', role: 'user', authorId: 'user', authorName: 'Candidate', round: 2, content: repeatedAnswer // Provider-specific function removed),
      message({ id: 'a3', role: 'agent', authorId: 'interview-technical', authorName: 'Tech', round: 3, content: '请直接回答上一问。' // Provider-specific function removed),
      message({ id: 'u3', role: 'user', authorId: 'user', authorName: 'Candidate', round: 3, content: repeatedAnswer // Provider-specific function removed),
      message({ id: 'a4', role: 'agent', authorId: 'interview-technical', authorName: 'Tech', round: 4, content: '还是围绕真实故障回答。' // Provider-specific function removed),
      message({ id: 'u4', role: 'user', authorId: 'user', authorName: 'Candidate', round: 4, content: repeatedAnswer // Provider-specific function removed),
    ],
  // Provider-specific function removed);
  state.interviewCurrentPhase = 'technical';

  const plan = resolveInterviewTurnPlanFallback(state);
  assert.equal(plan.kind, 'complete');
// Provider-specific function removed);
