import assert from 'node:assert/strict';
import test from 'node:test';

import type { InterviewSummary // Provider-specific function removed from '../agents/schemas.js';
import type { ChatroomState // Provider-specific function removed from './chatroom-discussion.js';
import type {
  ChatroomHostState,
  ChatroomMessage,
  ChatroomRecorderState,
  ChatroomRoomAdminState,
// Provider-specific function removed from './chatroom-types.js';
import {
  createChatroomRoomBlueprint,
// Provider-specific function removed from '../room-scenarios/room-blueprints.js';
import {
  buildRoomScenarioArtifactBundle,
// Provider-specific function removed from '../room-scenarios/scenario-artifacts.js';
import {
  INTERVIEW_HANDOFF_PREFIX,
// Provider-specific function removed from './interview-room-utils.js';

function createMessage(
  overrides: Partial<ChatroomMessage> & Pick<ChatroomMessage, 'id' | 'role' | 'authorId' | 'authorName' | 'round' | 'content'>,
): ChatroomMessage {
  return {
    createdAt: `2026-04-11T08:0${Math.min(overrides.round, 9)// Provider-specific function removed:00.000Z`,
    ...overrides,
  // Provider-specific function removed;
// Provider-specific function removed

function createInterviewSummary(
  overrides: Partial<InterviewSummary> = {// Provider-specific function removed,
): InterviewSummary {
  return {
    executiveSummary: '候选人业务理解和跨团队推动意识较强，但部分技术证据仍需继续补足。',
    interviewStatus: 'complete',
    currentStage: '面试完成',
    interviewReadiness: 'mixed',
    overallScore: 81,
    strengths: ['能讲清跨团队分歧与推进方式', '有较好的 owner 意识'],
    weaknesses: ['技术数据来源解释还不够扎实'],
    missedQuestions: ['没有完整展开容量估算过程'],
    suggestedAnswerImprovements: ['补充压测方法、容量推算和回滚阈值'],
    followUpQuestions: ['如果库存和支付都拒绝你的方案，你会如何升级处理？'],
    recommendedNextActions: ['补一轮更深的技术追问', '结合岗位要求优化案例表达'],
    competencyScores: [
      {
        dimension: 'cross_team_alignment',
        score: 4,
        evidence: ['能说明库存、支付、业务之间的目标冲突'],
        risks: ['量化证据还可更细'],
      // Provider-specific function removed,
      {
        dimension: 'ownership',
        score: 4,
        evidence: ['能提出阈值、SLA 和回滚标准'],
        risks: [],
      // Provider-specific function removed,
    ],
    confidence: 0.78,
    questionLog: [],
    feedbackItems: [],
    ...overrides,
  // Provider-specific function removed;
// Provider-specific function removed

function createRoomAdminState(): ChatroomRoomAdminState {
  return {
    schemaVersion: 1,
    lastUpdatedAt: '2026-04-11T08:12:00.000Z',
    currentPhaseLabel: '经理深挖',
    currentPhaseObjective: '确认候选人的 owner 判断与跨团队推进方式',
    history: [
      {
        schemaVersion: 1,
        directiveId: 'admin-1',
        createdAt: '2026-04-11T08:12:00.000Z',
        round: 5,
        transcriptMessageCount: 9,
        interventionStyle: 'on_demand',
        action: 'set_phase',
        visibility: 'hidden',
        phaseLabel: '经理深挖',
        phaseObjective: '确认候选人的 owner 判断与跨团队推进方式',
        eventLabel: '',
        eventMessage: '',
        targetSpeakerId: '',
        targetPromptMessageId: '',
        responseMode: 'new_question',
        instruction: '继续围绕 rollback threshold 和共同 SLA owner 追问。',
        reason: '技术证据已有基础，需要从管理视角继续取证。',
        participantAdditions: [],
      // Provider-specific function removed,
    ],
  // Provider-specific function removed;
// Provider-specific function removed

function createHostState(): ChatroomHostState {
  return {
    schemaVersion: 1,
    lastUpdatedAt: '2026-04-11T08:10:00.000Z',
    history: [
      {
        schemaVersion: 1,
        directiveId: 'host-1',
        createdAt: '2026-04-11T08:10:00.000Z',
        round: 4,
        transcriptMessageCount: 7,
        moderationStyle: 'structured',
        action: 'guide',
        visibility: 'hidden',
        headline: '聚焦问题',
        focus: '要求候选人正面回应关键数字来源',
        instruction: '避免泛泛而谈，要求逐项回答。',
        reason: '候选人出现答非所问趋势。',
      // Provider-specific function removed,
    ],
  // Provider-specific function removed;
// Provider-specific function removed

function createRecorderState(): ChatroomRecorderState {
  return {
    schemaVersion: 1,
    lastUpdatedAt: '2026-04-11T08:18:00.000Z',
    entries: [
      {
        schemaVersion: 1,
        checkpointId: 'rec-1',
        createdAt: '2026-04-11T08:18:00.000Z',
        round: 7,
        transcriptMessageCount: 13,
        updateMode: 'continuous',
        summaryKind: 'interview',
        headline: '候选人完成核心面试链路，但技术量化依据还需补足。',
        highlights: ['经理轮追问已形成明确取证'],
        concerns: ['部分技术追问仍有证据缺口'],
        nextSteps: ['补充容量估算和压测方法'],
        artifactFocus: ['candidate evidence', 'handoff notes'],
        publishedToRoom: true,
        interviewStatus: 'complete',
        currentStage: '面试完成',
      // Provider-specific function removed,
    ],
  // Provider-specific function removed;
// Provider-specific function removed

function createInterviewState(
  overrides: Partial<ChatroomState> = {// Provider-specific function removed,
): ChatroomState {
  const blueprint = createChatroomRoomBlueprint({
    scenarioTemplateId: 'interview_simulation',
    title: 'Senior PM Interview Demo',
    topic: 'Senior PM interview about inventory and payment coordination',
    objective: 'Run a realistic interview and finish with a useful report.',
    constraints: ['Use Simplified Chinese in the room.'],
    metadata: {
      scenario: {
        candidateName: 'Candidate',
        targetRole: 'Senior Product Manager',
        targetLevel: 'Senior',
        candidateBackground: 'Led order, payment, and inventory projects in commerce.',
        companyStyle: 'deep follow-up',
        focusAreas: ['cross-team alignment', 'tradeoff judgment', 'ownership'],
      // Provider-specific function removed,
    // Provider-specific function removed,
  // Provider-specific function removed);

  return {
    roomType: blueprint.roomType,
    scenarioTemplateId: blueprint.scenarioTemplateId,
    roomBlueprint: blueprint,
    topic: blueprint.topic,
    objective: blueprint.objective,
    constraints: [...blueprint.constraints],
    speakerIds: [...blueprint.speakerIds],
    messages: [
      createMessage({
        id: 'm-system',
        role: 'system',
        authorId: 'system',
        authorName: 'System',
        round: 0,
        content: 'Room created.',
      // Provider-specific function removed),
      createMessage({
        id: 'm-user-seed',
        role: 'user',
        authorId: 'candidate',
        authorName: 'Candidate',
        round: 0,
        content: 'I am ready for the interview.',
      // Provider-specific function removed),
      createMessage({
        id: 'm-hr-1',
        role: 'agent',
        authorId: 'interview-hr',
        authorName: 'HR Interviewer',
        round: 1,
        content: '请先做一个简短自我介绍，重点讲讲你最近的跨团队项目经历。',
      // Provider-specific function removed),
      createMessage({
        id: 'm-user-1',
        role: 'user',
        authorId: 'candidate',
        authorName: 'Candidate',
        round: 1,
        content: '我最近负责了一个交易状态机项目，需要协调库存、支付和业务团队。',
      // Provider-specific function removed),
      createMessage({
        id: 'm-tech-1',
        role: 'agent',
        authorId: 'interview-technical',
        authorName: 'Product Case Interviewer',
        round: 2,
        content: '支付 P99 从 230ms 到 410ms 这两个数字是怎么得出来的？',
      // Provider-specific function removed),
      createMessage({
        id: 'm-user-2',
        role: 'user',
        authorId: 'candidate',
        authorName: 'Candidate',
        round: 2,
        content: '来自压测和历史数据回放，两边团队都确认过口径。',
      // Provider-specific function removed),
      createMessage({
        id: 'm-meta',
        role: 'agent',
        authorId: 'interview-observer',
        authorName: 'Panel Observer',
        round: 3,
        content: `${INTERVIEW_HANDOFF_PREFIX// Provider-specific function removed 下一位面试官继续追问 owner 判断和共同 SLA。`,
      // Provider-specific function removed),
      createMessage({
        id: 'm-manager-1',
        role: 'agent',
        authorId: 'interview-manager',
        authorName: 'Business Hiring Manager',
        round: 4,
        content: '如果库存超卖率跑到千分之 5，你按什么标准决定回滚还是继续扛？',
      // Provider-specific function removed),
      createMessage({
        id: 'm-user-3',
        role: 'user',
        authorId: 'candidate',
        authorName: 'Candidate',
        round: 4,
        content: '我会看超卖阈值、补偿积压和支付成功率，超过回滚阈值就立即回滚。',
      // Provider-specific function removed),
      createMessage({
        id: 'm-hr-2',
        role: 'agent',
        authorId: 'interview-hr',
        authorName: 'HR Interviewer',
        round: 5,
        content: '最后一个问题：你为什么想来这个岗位？你还有什么想问我们的？',
      // Provider-specific function removed),
      createMessage({
        id: 'm-user-4',
        role: 'user',
        authorId: 'candidate',
        authorName: 'Candidate',
        round: 5,
        content: '我想找一个更需要 owner 意识的岗位，也想了解这个岗位前六个月最重要的结果指标。',
      // Provider-specific function removed),
    ],
    finalSummary: createInterviewSummary(),
    roomAdminState: createRoomAdminState(),
    hostState: createHostState(),
    recorderState: createRecorderState(),
    maxReplyCharacters: blueprint.runtimeConfig.maxReplyCharacters,
    ...overrides,
  // Provider-specific function removed;
// Provider-specific function removed

test('interview scenario artifact bundle preserves report fields needed for demo output', () => {
  const state = createInterviewState();
  const artifact = buildRoomScenarioArtifactBundle(state, {
    generatedAt: '2026-04-11T09:00:00.000Z',
  // Provider-specific function removed);

  assert(artifact);
  assert.equal(artifact.artifactType, 'interview_report');
  assert.equal(artifact.jsonFileName, 'scenario-report.json');
  assert.equal(artifact.markdownFileName, 'scenario-report.md');
  assert.equal(artifact.payload.scenarioTemplateId, 'interview_simulation');
  assert.equal(artifact.payload.roomTitle, 'Senior PM Interview Demo');
  assert.equal(
    (artifact.payload.candidate as { targetRole?: string // Provider-specific function removed).targetRole,
    'Senior Product Manager',
  );
  assert.deepEqual(artifact.payload.focusAreas, [
    'cross-team alignment',
    'tradeoff judgment',
    'ownership',
  ]);
  assert.equal(artifact.payload.scoreTemplateId, 'product_management');
  assert.deepEqual(artifact.payload.scoreDimensions, [
    '问题定义与用户洞察',
    '需求拆解与优先级判断',
    '指标体系与验证闭环',
    '方案取舍与风险管理',
    '跨团队协同与影响力',
    '结果导向与复盘能力',
  ]);
  assert.equal(artifact.payload.interviewStatus, 'complete');
  assert.equal(artifact.payload.overallScore, 81);
  assert.deepEqual(artifact.payload.missedQuestions, ['没有完整展开容量估算过程']);
  assert.deepEqual(artifact.payload.followUpQuestions, [
    '如果库存和支付都拒绝你的方案，你会如何升级处理？',
  ]);
  assert.deepEqual(artifact.payload.transcriptStats, {
    rounds: 5,
    messageCount: 11,
    agentMessageCount: 5,
    humanMessageCount: 5,
  // Provider-specific function removed);

  const interviewerQuestions = artifact.payload.interviewerQuestions as string[];
  assert.equal(interviewerQuestions.length, 4);
  assert.match(interviewerQuestions[0] ?? '', /自我介绍/);
  assert.match(interviewerQuestions[1] ?? '', /230ms/);
  assert.match(interviewerQuestions[2] ?? '', /千分之 5/);
  assert.match(interviewerQuestions[3] ?? '', /为什么想来/);

  assert.match(artifact.markdown, /# Interview Report/);
  assert.match(artifact.markdown, /## Recorder Summary/);
  assert.match(artifact.markdown, /## Strengths/);
  assert.match(artifact.markdown, /## Missed Questions/);
  assert.match(artifact.markdown, /## Follow-up Questions/);
  assert.match(artifact.markdown, /## Room Admin Timeline/);
  assert.match(artifact.markdown, /## Host Timeline/);
  assert.match(artifact.markdown, /## Recorder Timeline/);
// Provider-specific function removed);

test('interview scenario artifact infers in-progress status when summary is not ready yet', () => {
  const state = createInterviewState({
    messages: [
      createMessage({
        id: 'a1',
        role: 'agent',
        authorId: 'interview-hr',
        authorName: 'HR Interviewer',
        round: 1,
        content: '请先介绍一下自己。',
      // Provider-specific function removed),
      createMessage({
        id: 'u1',
        role: 'user',
        authorId: 'candidate',
        authorName: 'Candidate',
        round: 1,
        content: '我做过交易链路产品。',
      // Provider-specific function removed),
      createMessage({
        id: 'a2',
        role: 'agent',
        authorId: 'interview-technical',
        authorName: 'Product Case Interviewer',
        round: 2,
        content: '讲一个你处理一致性问题的真实案例。',
      // Provider-specific function removed),
    ],
    finalSummary: undefined,
    roomAdminState: undefined,
    hostState: undefined,
    recorderState: undefined,
  // Provider-specific function removed);

  const artifact = buildRoomScenarioArtifactBundle(state, {
    generatedAt: '2026-04-11T09:30:00.000Z',
  // Provider-specific function removed);

  assert(artifact);
  assert.equal(artifact.payload.interviewStatus, 'in_progress');
  assert.equal(artifact.payload.overallScore, 0);
  assert.equal(artifact.payload.recorderSummary, '');
  assert.deepEqual(artifact.payload.missedQuestions, []);
  assert.deepEqual(artifact.payload.followUpQuestions, []);
  assert.match(artifact.markdown, /Interview Status: in_progress/);
// Provider-specific function removed);
