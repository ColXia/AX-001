import assert from 'node:assert/strict';
import test from 'node:test';

import {
  applyChatroomRoomAdminTurn,
  buildChatroomRoomAdminFallback,
  buildRoomAdminPrompt,
  resolveInterviewRoomAdminControl,
  restoreChatroomRoomAdminState,
  summarizeInterviewInternalCollaboration,
// Provider-specific function removed from '../room-governance/room-admin.js';
import { createChatroomRoomBlueprint, type ChatroomRoomBlueprint // Provider-specific function removed from '../room-scenarios/room-blueprints.js';
import type {
  ChatroomInterviewInternalNote,
  ChatroomRoomAdminDirective,
// Provider-specific function removed from './chatroom-types.js';

function createBlueprint(
  scenarioTemplateId: ChatroomRoomBlueprint['scenarioTemplateId'],
): ChatroomRoomBlueprint {
  const roleplayScenario = scenarioTemplateId === 'roleplay_scene';

  return createChatroomRoomBlueprint({
    scenarioTemplateId,
    topic: roleplayScenario ? 'Suspicious visitor' : 'General room test',
    objective: roleplayScenario
      ? 'Keep the roleplay moving with clear scene changes.'
      : 'Move the room toward a clearer next step.',
    runtimeConfig: {
      summaryEnabled: true,
      maxReplyCharacters: 900,
    // Provider-specific function removed,
    governance: {
      roomAdmin: {
        enabled: true,
        interventionStyle: roleplayScenario ? 'proactive' : 'on_demand',
        canManageParticipants: roleplayScenario,
        canManagePhases: true,
        canInjectEvents: roleplayScenario,
        brief: 'admin',
      // Provider-specific function removed,
      host: {
        enabled: true,
        moderationStyle: 'structured',
        brief: 'host',
      // Provider-specific function removed,
      recorder: {
        enabled: true,
        updateMode: 'stage_checkpoints',
        artifactFocus: ['summary'],
        brief: 'recorder',
      // Provider-specific function removed,
    // Provider-specific function removed,
  // Provider-specific function removed);
// Provider-specific function removed

function msg(args: {
  id: string;
  role: 'user' | 'agent';
  authorId: string;
  authorName: string;
  round: number;
  content: string;
  createdAt?: string;
// Provider-specific function removed) {
  return {
    ...args,
    createdAt: args.createdAt ?? '2026-04-15T00:00:00.000Z',
  // Provider-specific function removed;
// Provider-specific function removed

function roomAdminDirective(
  overrides: Partial<ChatroomRoomAdminDirective> = {// Provider-specific function removed,
): ChatroomRoomAdminDirective {
  return {
    schemaVersion: 1,
    directiveId: 'admin-1',
    createdAt: '2026-04-15T00:00:00.000Z',
    round: 4,
    transcriptMessageCount: 8,
    interventionStyle: 'on_demand',
    action: 'request_answer_retry',
    visibility: 'hidden',
    phaseLabel: '',
    phaseObjective: '',
    eventLabel: '',
    eventMessage: '',
    targetSpeakerId: '',
    targetPromptMessageId: '',
    responseMode: 'clarify',
    instruction: '',
    reason: '',
    participantAdditions: [],
    ...overrides,
  // Provider-specific function removed;
// Provider-specific function removed

function internalNote(
  overrides: Partial<ChatroomInterviewInternalNote> & {
    kind: ChatroomInterviewInternalNote['kind'];
    authorId: string;
    authorName: string;
    content: string;
  // Provider-specific function removed,
): ChatroomInterviewInternalNote {
  return {
    schemaVersion: 1,
    noteId: overrides.noteId ?? `note-${Math.random().toString(16).slice(2, 8)// Provider-specific function removed`,
    kind: overrides.kind,
    createdAt: overrides.createdAt ?? '2026-04-15T00:00:00.000Z',
    round: overrides.round ?? 3,
    authorId: overrides.authorId,
    authorName: overrides.authorName,
    phaseLabel: overrides.phaseLabel,
    targetSpeakerId: overrides.targetSpeakerId,
    targetSpeakerName: overrides.targetSpeakerName,
    signalTags: overrides.signalTags,
    content: overrides.content,
  // Provider-specific function removed;
// Provider-specific function removed

const INTERVIEW_SPEAKER_IDS = [
  'interview-hr',
  'interview-technical',
  'interview-manager',
  'interview-observer',
] as const;

test('room admin can persist phase and visible event directives', () => {
  const roleplayBlueprint = createBlueprint('roleplay_scene');

  const result = applyChatroomRoomAdminTurn({
    turn: {
      action: 'set_phase_and_event',
      visibility: 'visible',
      phaseLabel: 'Scene shift',
      phaseObjective: 'Make the cast react to a new disturbance.',
      eventLabel: 'Door knock',
      eventMessage: 'A sudden knock interrupts the room.',
      targetSpeakerId: '',
      targetPromptMessageId: '',
      responseMode: 'new_question',
      instruction: 'Have the cast respond to the interruption before returning to the prior thread.',
      reason: 'The roleplay has stalled and needs a new stimulus.',
      participantAdditions: [
        {
          name: 'Late Visitor',
          instruction: 'Bring a short but meaningful new clue into the room.',
        // Provider-specific function removed,
      ],
    // Provider-specific function removed,
    adminConfig: roleplayBlueprint.governance.roomAdmin,
    scenarioTemplateId: 'roleplay_scene',
    round: 2,
    transcriptMessageCount: 7,
    now: '2026-04-15T00:00:00.000Z',
  // Provider-specific function removed);

  assert.ok(result.roomAdminState);
  assert.equal(result.roomAdminState?.history.length, 1);
  assert.equal(result.roomAdminState?.currentPhaseLabel, 'Scene shift');
  assert.equal(result.participantAdditions.length, 1);
  assert.notEqual(result.visibleMessage, undefined);
// Provider-specific function removed);

test('interview room admin is normalized to hidden phase control', () => {
  const result = applyChatroomRoomAdminTurn({
    turn: {
      action: 'set_phase',
      visibility: 'visible',
      phaseLabel: 'Technical deep dive',
      phaseObjective: 'Continue verifying the candidate through one concrete line of questioning.',
      eventLabel: '',
      eventMessage: '',
      targetSpeakerId: '',
      targetPromptMessageId: '',
      responseMode: 'new_question',
      instruction: 'Stay on the same thread and keep probing.',
      reason: 'The interview should remain internally moderated.',
      participantAdditions: [],
    // Provider-specific function removed,
    adminConfig: createBlueprint('interview_simulation').governance.roomAdmin,
    scenarioTemplateId: 'interview_simulation',
    round: 3,
    transcriptMessageCount: 8,
    now: '2026-04-15T00:10:00.000Z',
  // Provider-specific function removed);

  assert.ok(result.roomAdminState);
  assert.equal(result.roomAdminState?.currentDirective?.visibility, 'hidden');
  assert.equal(result.visibleMessage, undefined);
// Provider-specific function removed);

test('interview room admin preserves omitted completion terminal status for later inference', () => {
  const result = applyChatroomRoomAdminTurn({
    turn: {
      action: 'complete_interview',
      visibility: 'hidden',
      phaseLabel: '',
      phaseObjective: '',
      eventLabel: '',
      eventMessage: '',
      targetSpeakerId: '',
      targetPromptMessageId: '',
      responseMode: 'new_question',
      instruction: 'Stop the interview now.',
      reason: 'The room admin wants central control to infer the final completion type.',
      participantAdditions: [],
    // Provider-specific function removed,
    adminConfig: createBlueprint('interview_simulation').governance.roomAdmin,
    scenarioTemplateId: 'interview_simulation',
    round: 3,
    transcriptMessageCount: 6,
    now: '2026-04-15T00:00:00.000Z',
  // Provider-specific function removed);

  assert.equal(result.roomAdminState?.currentDirective?.terminalStatus, undefined);
// Provider-specific function removed);

test('room admin fallback injects visible event for stalled roleplay rooms', () => {
  const fallback = buildChatroomRoomAdminFallback({
    roomBlueprint: createBlueprint('roleplay_scene'),
    round: 3,
    messages: [
      msg({
        id: 'm1',
        role: 'user',
        authorId: 'user',
        authorName: 'User',
        round: 1,
        content: 'continue',
      // Provider-specific function removed),
      msg({
        id: 'm2',
        role: 'agent',
        authorId: 'lin-lan-rp',
        authorName: 'Lin',
        round: 2,
        content: 'I stay quiet for a moment.',
      // Provider-specific function removed),
      msg({
        id: 'm3',
        role: 'agent',
        authorId: 'shen-yan-rp',
        authorName: 'Shen',
        round: 2,
        content: 'Nothing changes in the room.',
      // Provider-specific function removed),
      msg({
        id: 'm4',
        role: 'agent',
        authorId: 'a-jiu-rp',
        authorName: 'Ajiu',
        round: 2,
        content: 'The scene has gone still.',
      // Provider-specific function removed),
    ],
  // Provider-specific function removed);

  assert.equal(fallback.action, 'set_phase_and_event');
  assert.equal(fallback.visibility, 'visible');
  assert.notEqual(fallback.eventLabel, '');
  assert.notEqual(fallback.eventMessage, '');
// Provider-specific function removed);

test('interview room admin fallback requests retry for repeated answers', () => {
  const fallback = buildChatroomRoomAdminFallback({
    roomBlueprint: createBlueprint('interview_simulation'),
    round: 4,
    messages: [
      msg({
        id: 'a1',
        role: 'agent',
        authorId: 'interview-technical',
        authorName: 'Tech',
        round: 2,
        content: 'Please describe one real consistency failure you handled.',
      // Provider-specific function removed),
      msg({
        id: 'u1',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 2,
        content: 'I worked on payment and inventory projects.',
      // Provider-specific function removed),
      msg({
        id: 'a2',
        role: 'agent',
        authorId: 'interview-technical',
        authorName: 'Tech',
        round: 3,
        content: 'Please answer with one concrete production incident you personally handled.',
      // Provider-specific function removed),
      msg({
        id: 'u2',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 3,
        content: 'I worked on payment and inventory projects.',
      // Provider-specific function removed),
    ],
  // Provider-specific function removed);

  assert.equal(fallback.action, 'request_answer_retry');
  assert.equal(fallback.visibility, 'hidden');
  assert.equal(fallback.targetSpeakerId, 'interview-technical');
  assert.equal(fallback.targetPromptMessageId, 'a2');
  assert.equal(fallback.responseMode, 'clarify');
// Provider-specific function removed);

test('interview room admin fallback completes after the third identical answer in a row', () => {
  const fallback = buildChatroomRoomAdminFallback({
    roomBlueprint: createBlueprint('interview_simulation'),
    round: 5,
    messages: [
      msg({
        id: 'a1',
        role: 'agent',
        authorId: 'interview-technical',
        authorName: 'Tech',
        round: 2,
        content: 'Name one real production problem you diagnosed yourself.',
      // Provider-specific function removed),
      msg({
        id: 'u1',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 2,
        content: 'I worked on payment and inventory projects.',
      // Provider-specific function removed),
      msg({
        id: 'a2',
        role: 'agent',
        authorId: 'interview-technical',
        authorName: 'Tech',
        round: 3,
        content: 'Please answer with the symptom, root cause, and result.',
      // Provider-specific function removed),
      msg({
        id: 'u2',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 3,
        content: 'I worked on payment and inventory projects.',
      // Provider-specific function removed),
      msg({
        id: 'a3',
        role: 'agent',
        authorId: 'interview-technical',
        authorName: 'Tech',
        round: 4,
        content: 'Still the same question: give one concrete incident and outcome.',
      // Provider-specific function removed),
      msg({
        id: 'u3',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 4,
        content: 'I worked on payment and inventory projects.',
      // Provider-specific function removed),
    ],
  // Provider-specific function removed);

  assert.equal(fallback.action, 'complete_interview');
  assert.equal(fallback.visibility, 'hidden');
  assert.equal(fallback.terminalStatus, 'aborted');
// Provider-specific function removed);

test('interview room admin fallback holds when candidate asks to pause', () => {
  const fallback = buildChatroomRoomAdminFallback({
    roomBlueprint: createBlueprint('interview_simulation'),
    round: 3,
    messages: [
      msg({
        id: 'a1',
        role: 'agent',
        authorId: 'interview-technical',
        authorName: 'Tech',
        round: 2,
        content: 'Please describe one real debugging case.',
      // Provider-specific function removed),
      msg({
        id: 'u1',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 2,
        content: 'Please wait, I have a network issue and need a moment.',
      // Provider-specific function removed),
    ],
  // Provider-specific function removed);

  assert.equal(fallback.action, 'hold_interview');
  assert.equal(fallback.visibility, 'hidden');
// Provider-specific function removed);

test('interview room admin fallback requests retry when candidate refuses the active question', () => {
  const fallback = buildChatroomRoomAdminFallback({
    roomBlueprint: createBlueprint('interview_simulation'),
    round: 3,
    messages: [
      msg({
        id: 'a1',
        role: 'agent',
        authorId: 'interview-technical',
        authorName: 'Tech',
        round: 2,
        content: 'Please describe one production incident you handled personally.',
      // Provider-specific function removed),
      msg({
        id: 'u1',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 2,
        content: "I'd rather not answer that because it is confidential.",
      // Provider-specific function removed),
    ],
  // Provider-specific function removed);

  assert.equal(fallback.action, 'request_answer_retry');
  assert.equal(fallback.visibility, 'hidden');
  assert.equal(fallback.targetSpeakerId, 'interview-technical');
  assert.equal(fallback.responseMode, 'new_question');
// Provider-specific function removed);

test('interview room admin fallback completes after repeated refusal to answer', () => {
  const fallback = buildChatroomRoomAdminFallback({
    roomBlueprint: createBlueprint('interview_simulation'),
    round: 4,
    messages: [
      msg({
        id: 'a1',
        role: 'agent',
        authorId: 'interview-technical',
        authorName: 'Tech',
        round: 2,
        content: 'Please describe one production incident you handled personally.',
      // Provider-specific function removed),
      msg({
        id: 'u1',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 2,
        content: "I'd rather not answer that because it is confidential.",
      // Provider-specific function removed),
      msg({
        id: 'a2',
        role: 'agent',
        authorId: 'interview-technical',
        authorName: 'Tech',
        round: 3,
        content: 'Then answer from a sanitized angle without naming the company or system.',
      // Provider-specific function removed),
      msg({
        id: 'u2',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 3,
        content: 'I still prefer not to answer that.',
      // Provider-specific function removed),
    ],
  // Provider-specific function removed);

  assert.equal(fallback.action, 'complete_interview');
  assert.equal(fallback.visibility, 'hidden');
  assert.equal(fallback.terminalStatus, 'aborted');
// Provider-specific function removed);

test('interview room admin fallback retries when candidate goes off topic instead of answering', () => {
  const fallback = buildChatroomRoomAdminFallback({
    roomBlueprint: createBlueprint('interview_simulation'),
    round: 3,
    messages: [
      msg({
        id: 'a1',
        role: 'agent',
        authorId: 'interview-technical',
        authorName: 'Tech',
        round: 2,
        content: 'How did you locate the root cause of the cache inconsistency?',
      // Provider-specific function removed),
      msg({
        id: 'u1',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 2,
        content: 'Nice weather today.',
      // Provider-specific function removed),
    ],
  // Provider-specific function removed);

  assert.equal(fallback.action, 'request_answer_retry');
  assert.equal(fallback.visibility, 'hidden');
  assert.equal(fallback.targetSpeakerId, 'interview-technical');
  assert.equal(fallback.responseMode, 'new_question');
// Provider-specific function removed);

test('room admin interview control resolves complete directives centrally', () => {
  const control = resolveInterviewRoomAdminControl({
    directive: roomAdminDirective({
      action: 'complete_interview',
      reason: 'Candidate asked to end the interview.',
    // Provider-specific function removed),
    round: 4,
    messages: [],
    roomBlueprint: createBlueprint('interview_simulation'),
    speakerIds: INTERVIEW_SPEAKER_IDS,
    trackedPhase: 'technical',
    minimumPhase: 'technical',
  // Provider-specific function removed);

  assert.deepEqual(control, {
    kind: 'complete',
    reason: 'Candidate asked to end the interview.',
    terminalStatus: 'aborted',
  // Provider-specific function removed);
// Provider-specific function removed);

test('room admin interview control keeps explicit clean-complete terminal status', () => {
  const control = resolveInterviewRoomAdminControl({
    directive: roomAdminDirective({
      action: 'complete_interview',
      terminalStatus: 'complete',
      reason: 'The panel already has enough evidence and can close without another turn.',
    // Provider-specific function removed),
    round: 4,
    messages: [],
    roomBlueprint: createBlueprint('interview_simulation'),
    speakerIds: INTERVIEW_SPEAKER_IDS,
    trackedPhase: 'manager',
    minimumPhase: 'manager',
  // Provider-specific function removed);

  assert.deepEqual(control, {
    kind: 'complete',
    reason: 'The panel already has enough evidence and can close without another turn.',
    terminalStatus: 'complete',
  // Provider-specific function removed);
// Provider-specific function removed);

test('room admin interview control infers clean completion after enough cooperative answers', () => {
  const control = resolveInterviewRoomAdminControl({
    directive: roomAdminDirective({
      action: 'complete_interview',
      round: 7,
      responseMode: 'new_question',
      reason: 'The room can close after collecting enough evidence.',
    // Provider-specific function removed),
    round: 7,
    messages: [
      msg({ id: 'q1', role: 'agent', authorId: 'interview-hr', authorName: 'HR', round: 1, content: 'Please introduce yourself.' // Provider-specific function removed),
      msg({ id: 'a1', role: 'user', authorId: 'candidate', authorName: 'Candidate', round: 1, content: 'I am a computer science senior with backend internship experience.' // Provider-specific function removed),
      msg({ id: 'q2', role: 'agent', authorId: 'interview-technical', authorName: 'Tech', round: 2, content: 'Tell me about one debugging case.' // Provider-specific function removed),
      msg({ id: 'a2', role: 'user', authorId: 'candidate', authorName: 'Candidate', round: 2, content: 'I traced an order oversell issue with logs and metrics.' // Provider-specific function removed),
      msg({ id: 'q3', role: 'agent', authorId: 'interview-technical', authorName: 'Tech', round: 3, content: 'How did you fix it?' // Provider-specific function removed),
      msg({ id: 'a3', role: 'user', authorId: 'candidate', authorName: 'Candidate', round: 3, content: 'I used Redis stock deduction plus async persistence with verification.' // Provider-specific function removed),
      msg({ id: 'q4', role: 'agent', authorId: 'interview-manager', authorName: 'Manager', round: 4, content: 'How did you align with teammates?' // Provider-specific function removed),
      msg({ id: 'a4', role: 'user', authorId: 'candidate', authorName: 'Candidate', round: 4, content: 'I shared the data, aligned with QA, and drove the fix validation.' // Provider-specific function removed),
      msg({ id: 'q5', role: 'agent', authorId: 'interview-manager', authorName: 'Manager', round: 5, content: 'What tradeoff did you choose?' // Provider-specific function removed),
      msg({ id: 'a5', role: 'user', authorId: 'candidate', authorName: 'Candidate', round: 5, content: 'I accepted slight async delay to keep throughput and consistency stable.' // Provider-specific function removed),
      msg({ id: 'q6', role: 'agent', authorId: 'interview-hr', authorName: 'HR', round: 6, content: 'What do you expect from the role?' // Provider-specific function removed),
      msg({ id: 'a6', role: 'user', authorId: 'candidate', authorName: 'Candidate', round: 6, content: 'I want mentorship, ownership, and steady backend growth opportunities.' // Provider-specific function removed),
    ],
    roomBlueprint: createBlueprint('interview_simulation'),
    speakerIds: INTERVIEW_SPEAKER_IDS,
    trackedPhase: 'hr_wrapup',
    minimumPhase: 'hr_wrapup',
  // Provider-specific function removed);

  assert.deepEqual(control, {
    kind: 'complete',
    reason: 'The room can close after collecting enough evidence.',
    terminalStatus: 'complete',
  // Provider-specific function removed);
// Provider-specific function removed);

test('room admin interview control treats a five-answer HR wrap-up close as a clean completion', () => {
  const control = resolveInterviewRoomAdminControl({
    directive: roomAdminDirective({
      action: 'complete_interview',
      round: 6,
      responseMode: 'new_question',
      reason: 'The room can stop after the wrap-up answer.',
    // Provider-specific function removed),
    round: 6,
    messages: [
      msg({ id: 'q1', role: 'agent', authorId: 'interview-hr', authorName: 'HR', round: 1, content: 'Please introduce yourself.' // Provider-specific function removed),
      msg({ id: 'a1', role: 'user', authorId: 'candidate', authorName: 'Candidate', round: 1, content: 'I am a backend-oriented student with one campus project.' // Provider-specific function removed),
      msg({ id: 'q2', role: 'agent', authorId: 'interview-technical', authorName: 'Tech', round: 2, content: 'Tell me about your project.' // Provider-specific function removed),
      msg({ id: 'a2', role: 'user', authorId: 'candidate', authorName: 'Candidate', round: 2, content: 'I built a reservation system with Spring Boot and MySQL.' // Provider-specific function removed),
      msg({ id: 'q3', role: 'agent', authorId: 'interview-technical', authorName: 'Tech', round: 3, content: 'How did you handle conflicts?' // Provider-specific function removed),
      msg({ id: 'a3', role: 'user', authorId: 'candidate', authorName: 'Candidate', round: 3, content: 'I relied on a unique index and then read more about locks.' // Provider-specific function removed),
      msg({ id: 'q4', role: 'agent', authorId: 'interview-manager', authorName: 'Manager', round: 4, content: 'How do you learn missing topics?' // Provider-specific function removed),
      msg({ id: 'a4', role: 'user', authorId: 'candidate', authorName: 'Candidate', round: 4, content: 'I write notes, reproduce issues, and ask for review when stuck.' // Provider-specific function removed),
      msg({ id: 'q5', role: 'agent', authorId: 'interview-hr', authorName: 'HR', round: 5, content: 'What do you expect from the role?' // Provider-specific function removed),
      msg({ id: 'a5', role: 'user', authorId: 'candidate', authorName: 'Candidate', round: 5, content: 'I hope to learn in a structured team and grow into a reliable backend engineer.' // Provider-specific function removed),
    ],
    roomBlueprint: createBlueprint('interview_simulation'),
    speakerIds: INTERVIEW_SPEAKER_IDS,
    trackedPhase: 'hr_wrapup',
    minimumPhase: 'hr_wrapup',
  // Provider-specific function removed);

  assert.deepEqual(control, {
    kind: 'complete',
    reason: 'The room can stop after the wrap-up answer.',
    terminalStatus: 'complete',
  // Provider-specific function removed);
// Provider-specific function removed);

test('room admin interview control preserves an explicit clean completion from the manager lane', () => {
  const control = resolveInterviewRoomAdminControl({
    directive: roomAdminDirective({
      action: 'complete_interview',
      round: 5,
      phaseLabel: 'manager_round',
      reason: 'The manager lane already has enough evidence.',
      terminalStatus: 'complete',
    // Provider-specific function removed),
    round: 5,
    messages: [
      msg({ id: 'q1', role: 'agent', authorId: 'interview-hr', authorName: 'HR', round: 1, content: '请先简单介绍你的教育背景、项目经历，以及为什么选择后端开发。' // Provider-specific function removed),
      msg({ id: 'a1', role: 'user', authorId: 'candidate', authorName: 'Candidate', round: 1, content: '我是计算机专业的大四学生，做过电商订单系统课程设计，也有一段后端实习，主要处理订单状态流转和缓存一致性。我喜欢在真实业务里解决高并发和数据一致性问题，所以希望继续做后端。' // Provider-specific function removed),
      msg({ id: 'q2', role: 'agent', authorId: 'interview-technical', authorName: 'Tech', round: 2, content: '你在实习里遇到过什么缓存一致性难题？用了什么方案？' // Provider-specific function removed),
      msg({ id: 'a2', role: 'user', authorId: 'candidate', authorName: 'Candidate', round: 2, content: '我遇到过秒杀场景库存扣减后缓存未及时删除的问题，导致用户重复下单。我用了删除缓存加消息队列兜底的方案，并通过监控堆积情况观察一致性。' // Provider-specific function removed),
      msg({ id: 'q3', role: 'agent', authorId: 'interview-technical', authorName: 'Tech', round: 3, content: '消息队列在幂等和重试上怎么设计，才能避免重复扣减？' // Provider-specific function removed),
      msg({ id: 'a3', role: 'user', authorId: 'candidate', authorName: 'Candidate', round: 3, content: '我在业务层按订单号做幂等校验，只有第一次消费才执行库存扣减。失败会进入重试队列，超过阈值再告警人工介入，避免重复扣减或者漏处理。' // Provider-specific function removed),
      msg({ id: 'q4', role: 'agent', authorId: 'interview-manager', authorName: 'Manager', round: 4, content: '你是怎么权衡延迟时间和消息堆积风险的？又如何和团队同步这个判断？' // Provider-specific function removed),
      msg({ id: 'a4', role: 'user', authorId: 'candidate', authorName: 'Candidate', round: 4, content: '我把延迟时间控制在业务可接受的几秒级，同时重点盯待处理消息数和消费速率。发现堆积异常时我会先整理监控截图和日志，再和导师、运维、测试一起确认是锁竞争还是下游故障，然后再决定是否调大重试间隔或回滚方案。' // Provider-specific function removed),
    ],
    roomBlueprint: createBlueprint('interview_simulation'),
    speakerIds: INTERVIEW_SPEAKER_IDS,
    trackedPhase: 'manager',
    minimumPhase: 'manager',
  // Provider-specific function removed);

  assert.deepEqual(control, {
    kind: 'complete',
    reason: 'The manager lane already has enough evidence.',
    terminalStatus: 'complete',
  // Provider-specific function removed);
// Provider-specific function removed);

test('room admin interview control keeps an evasive clean-close request as aborted', () => {
  const control = resolveInterviewRoomAdminControl({
    directive: roomAdminDirective({
      action: 'complete_interview',
      round: 7,
      phaseLabel: 'hr_wrap_up',
      reason: 'The room can stop now.',
    // Provider-specific function removed),
    round: 7,
    messages: [
      msg({ id: 'q1', role: 'agent', authorId: 'interview-hr', authorName: 'HR', round: 1, content: 'Intro.' // Provider-specific function removed),
      msg({ id: 'a1', role: 'user', authorId: 'candidate', authorName: 'Candidate', round: 1, content: 'I have seen backend courses and want to try this direction.' // Provider-specific function removed),
      msg({ id: 'q2', role: 'agent', authorId: 'interview-technical', authorName: 'Tech', round: 2, content: 'What did you implement?' // Provider-specific function removed),
      msg({ id: 'a2', role: 'user', authorId: 'candidate', authorName: 'Candidate', round: 2, content: 'I mainly used Spring Boot to get the feature working.' // Provider-specific function removed),
      msg({ id: 'q3', role: 'agent', authorId: 'interview-technical', authorName: 'Tech', round: 3, content: 'How did you design the data model?' // Provider-specific function removed),
      msg({ id: 'a3', role: 'user', authorId: 'candidate', authorName: 'Candidate', round: 3, content: 'I used the default config and did not really go deep into the schema.' // Provider-specific function removed),
      msg({ id: 'q4', role: 'agent', authorId: 'interview-manager', authorName: 'Manager', round: 4, content: 'How would you debug a slow query?' // Provider-specific function removed),
      msg({ id: 'a4', role: 'user', authorId: 'candidate', authorName: 'Candidate', round: 4, content: 'Generally I would just look at the logs and see if it is some basic config issue.' // Provider-specific function removed),
      msg({ id: 'q5', role: 'agent', authorId: 'interview-hr', authorName: 'HR', round: 5, content: 'What do you want from the role?' // Provider-specific function removed),
      msg({ id: 'a5', role: 'user', authorId: 'candidate', authorName: 'Candidate', round: 5, content: 'I mainly want a place to try things out, and the specific details are fuzzy right now.' // Provider-specific function removed),
    ],
    roomBlueprint: createBlueprint('interview_simulation'),
    speakerIds: INTERVIEW_SPEAKER_IDS,
    trackedPhase: 'hr_wrapup',
    minimumPhase: 'hr_wrapup',
  // Provider-specific function removed);

  assert.deepEqual(control, {
    kind: 'complete',
    reason: 'The room can stop now.',
    terminalStatus: 'aborted',
  // Provider-specific function removed);
// Provider-specific function removed);

test('room admin interview control preserves an explicit manager follow-up directive', () => {
  const control = resolveInterviewRoomAdminControl({
    directive: roomAdminDirective({
      action: 'set_phase',
      phaseLabel: 'manager_round',
      phaseObjective: 'Keep the manager lane moving.',
      instruction: 'Ask another manager follow-up.',
      round: 7,
    // Provider-specific function removed),
    round: 7,
    messages: [
      msg({ id: 'q1', role: 'agent', authorId: 'interview-hr', authorName: 'HR', round: 1, content: 'Intro.' // Provider-specific function removed),
      msg({ id: 'a1', role: 'user', authorId: 'candidate', authorName: 'Candidate', round: 1, content: 'Backend student with internship.' // Provider-specific function removed),
      msg({ id: 'q2', role: 'agent', authorId: 'interview-technical', authorName: 'Tech', round: 2, content: 'Technical case?' // Provider-specific function removed),
      msg({ id: 'a2', role: 'user', authorId: 'candidate', authorName: 'Candidate', round: 2, content: 'I debugged oversell with logs.' // Provider-specific function removed),
      msg({ id: 'q3', role: 'agent', authorId: 'interview-technical', authorName: 'Tech', round: 3, content: 'How did you mitigate it?' // Provider-specific function removed),
      msg({ id: 'a3', role: 'user', authorId: 'candidate', authorName: 'Candidate', round: 3, content: 'I used Redis, Lua, and pressure tests.' // Provider-specific function removed),
      msg({ id: 'q4', role: 'agent', authorId: 'interview-manager', authorName: 'Manager', round: 4, content: 'How did you align teammates?' // Provider-specific function removed),
      msg({ id: 'a4', role: 'user', authorId: 'candidate', authorName: 'Candidate', round: 4, content: 'I shared findings and drove the plan.' // Provider-specific function removed),
      msg({ id: 'q5', role: 'agent', authorId: 'interview-manager', authorName: 'Manager', round: 5, content: 'What tradeoff did you make?' // Provider-specific function removed),
      msg({ id: 'a5', role: 'user', authorId: 'candidate', authorName: 'Candidate', round: 5, content: 'I traded slight delay for higher consistency.' // Provider-specific function removed),
      msg({ id: 'q6', role: 'agent', authorId: 'interview-manager', authorName: 'Manager', round: 6, content: 'Why was that acceptable?' // Provider-specific function removed),
      msg({ id: 'a6', role: 'user', authorId: 'candidate', authorName: 'Candidate', round: 6, content: 'It preserved user experience while keeping inventory accurate.' // Provider-specific function removed),
    ],
    roomBlueprint: createBlueprint('interview_simulation'),
    speakerIds: INTERVIEW_SPEAKER_IDS,
    trackedPhase: 'manager',
    minimumPhase: 'manager',
  // Provider-specific function removed);

  assert.deepEqual(control, {
    kind: 'ask',
    phase: 'manager_round',
    speakerId: 'interview-manager',
    focus: 'Keep the manager lane moving.',
    reason: 'Room admin moved the interview into the manager_round stage.',
    responseMode: 'new_question',
  // Provider-specific function removed);
// Provider-specific function removed);

test('room admin interview control keeps an explicit HR retry directive instead of auto-aborting', () => {
  const control = resolveInterviewRoomAdminControl({
    directive: roomAdminDirective({
      action: 'request_answer_retry',
      responseMode: 'clarify',
      round: 5,
      targetSpeakerId: 'interview-hr',
      targetPromptMessageId: 'q4',
    // Provider-specific function removed),
    round: 5,
    messages: [
      msg({ id: 'q1', role: 'agent', authorId: 'interview-hr', authorName: 'HR', round: 1, content: 'Introduce yourself.' // Provider-specific function removed),
      msg({ id: 'a1', role: 'user', authorId: 'candidate', authorName: 'Candidate', round: 1, content: 'I study computer science and like backend work.' // Provider-specific function removed),
      msg({ id: 'q2', role: 'agent', authorId: 'interview-hr', authorName: 'HR', round: 2, content: 'Which project stands out most?' // Provider-specific function removed),
      msg({ id: 'a2', role: 'user', authorId: 'candidate', authorName: 'Candidate', round: 2, content: 'A concurrency course project with locking.' // Provider-specific function removed),
      msg({ id: 'q3', role: 'agent', authorId: 'interview-hr', authorName: 'HR', round: 3, content: 'What response-time improvement did you measure?' // Provider-specific function removed),
      msg({ id: 'a3', role: 'user', authorId: 'candidate', authorName: 'Candidate', round: 3, content: 'It was something like much faster, but I do not really remember the details.' // Provider-specific function removed),
      msg({ id: 'q4', role: 'agent', authorId: 'interview-hr', authorName: 'HR', round: 4, content: 'What was the approximate latency before and after?' // Provider-specific function removed),
      msg({ id: 'a4', role: 'user', authorId: 'candidate', authorName: 'Candidate', round: 4, content: 'Anyway it was basically okay afterwards, and the specific numbers are fuzzy now.' // Provider-specific function removed),
    ],
    roomBlueprint: createBlueprint('interview_simulation'),
    speakerIds: INTERVIEW_SPEAKER_IDS,
    trackedPhase: 'hr_followup',
    minimumPhase: 'hr_followup',
  // Provider-specific function removed);

  assert.deepEqual(control, {
    kind: 'ask',
    phase: 'hr_followup',
    speakerId: 'interview-hr',
    focus: 'Clarify or narrow the previous question first, then wait for the candidate to answer directly.',
    reason: 'Room admin requested a clarification retry for the active interview thread.',
    responseMode: 'clarify',
  // Provider-specific function removed);
// Provider-specific function removed);

test('room admin interview control resolves hold directives centrally', () => {
  const control = resolveInterviewRoomAdminControl({
    directive: roomAdminDirective({
      action: 'hold_interview',
      instruction: 'Wait for the candidate to recover the connection.',
    // Provider-specific function removed),
    round: 4,
    messages: [],
    roomBlueprint: createBlueprint('interview_simulation'),
    speakerIds: INTERVIEW_SPEAKER_IDS,
    trackedPhase: 'technical',
    minimumPhase: 'technical',
  // Provider-specific function removed);

  assert.deepEqual(control, {
    kind: 'wait',
    reason: 'Wait for the candidate to recover the connection.',
  // Provider-specific function removed);
// Provider-specific function removed);

test('room admin interview control infers clarify retry from the active interviewer thread', () => {
  const control = resolveInterviewRoomAdminControl({
    directive: roomAdminDirective({
      action: 'request_answer_retry',
      responseMode: 'clarify',
    // Provider-specific function removed),
    round: 4,
    messages: [
      msg({
        id: 'a2',
        role: 'agent',
        authorId: 'interview-technical',
        authorName: 'Tech',
        round: 3,
        content: 'Please give one concrete debugging case.',
      // Provider-specific function removed),
    ],
    roomBlueprint: createBlueprint('interview_simulation'),
    speakerIds: INTERVIEW_SPEAKER_IDS,
    trackedPhase: 'technical',
    minimumPhase: 'technical',
  // Provider-specific function removed);

  assert.deepEqual(control, {
    kind: 'ask',
    phase: 'technical_deep_dive',
    speakerId: 'interview-technical',
    focus:
      'Clarify or narrow the previous question first, then wait for the candidate to answer directly.',
    reason: 'Room admin requested a clarification retry for the active interview thread.',
    responseMode: 'clarify',
  // Provider-specific function removed);
// Provider-specific function removed);

test('room admin interview control converts hr wrap-up phase directives into ask control', () => {
  const control = resolveInterviewRoomAdminControl({
    directive: roomAdminDirective({
      action: 'set_phase',
      phaseLabel: 'hr_wrap_up',
      phaseObjective: 'Close the interview and invite final candidate questions.',
      reason: 'The room should move into a deliberate wrap-up.',
    // Provider-specific function removed),
    round: 4,
    messages: [],
    roomBlueprint: createBlueprint('interview_simulation'),
    speakerIds: INTERVIEW_SPEAKER_IDS,
    trackedPhase: 'technical',
    minimumPhase: 'technical',
  // Provider-specific function removed);

  assert.deepEqual(control, {
    kind: 'ask',
    phase: 'hr_wrap_up',
    speakerId: 'interview-hr',
    focus: 'Close the interview and invite final candidate questions.',
    reason: 'The room should move into a deliberate wrap-up.',
    responseMode: 'new_question',
  // Provider-specific function removed);
// Provider-specific function removed);

test('room admin interview control converts manager phase directives into ask control', () => {
  const control = resolveInterviewRoomAdminControl({
    directive: roomAdminDirective({
      action: 'set_phase',
      phaseLabel: 'manager_round',
      instruction: 'Hand off to the manager for an ownership and prioritization question.',
    // Provider-specific function removed),
    round: 4,
    messages: [],
    roomBlueprint: createBlueprint('interview_simulation'),
    speakerIds: INTERVIEW_SPEAKER_IDS,
    trackedPhase: 'technical',
    minimumPhase: 'technical',
  // Provider-specific function removed);

  assert.deepEqual(control, {
    kind: 'ask',
    phase: 'manager_round',
    speakerId: 'interview-manager',
    focus: 'Hand off to the manager for an ownership and prioritization question.',
    reason: 'Room admin moved the interview into the manager_round stage.',
    responseMode: 'new_question',
  // Provider-specific function removed);
// Provider-specific function removed);

test('room admin interview control ignores unknown phase directives', () => {
  const control = resolveInterviewRoomAdminControl({
    directive: roomAdminDirective({
      action: 'set_phase',
      phaseLabel: 'unknown_phase_label',
    // Provider-specific function removed),
    round: 4,
    messages: [],
    roomBlueprint: createBlueprint('interview_simulation'),
    speakerIds: INTERVIEW_SPEAKER_IDS,
    trackedPhase: 'technical',
    minimumPhase: 'technical',
  // Provider-specific function removed);

  assert.equal(control, undefined);
// Provider-specific function removed);

test('room admin interview control keeps targeted retries on the requested speaker lane', () => {
  const control = resolveInterviewRoomAdminControl({
    directive: roomAdminDirective({
      action: 'request_answer_retry',
      targetSpeakerId: 'interview-manager',
      responseMode: 'new_question',
      instruction: 'Retry from a decision tradeoff angle.',
      reason: 'The answer stayed too generic.',
    // Provider-specific function removed),
    round: 4,
    messages: [],
    roomBlueprint: createBlueprint('interview_simulation'),
    speakerIds: INTERVIEW_SPEAKER_IDS,
    trackedPhase: 'manager',
    minimumPhase: 'manager',
  // Provider-specific function removed);

  assert.deepEqual(control, {
    kind: 'ask',
    phase: 'manager_round',
    speakerId: 'interview-manager',
    focus: 'Retry from a decision tradeoff angle.',
    reason: 'The answer stayed too generic.',
    responseMode: 'new_question',
  // Provider-specific function removed);
// Provider-specific function removed);

test('room admin interview control falls back to the latest interviewer when retry target is a candidate label', () => {
  const control = resolveInterviewRoomAdminControl({
    directive: roomAdminDirective({
      action: 'request_answer_retry',
      targetSpeakerId: 'Candidate',
      responseMode: 'new_question',
      instruction: 'Guide the candidate to answer with de-identified details.',
      reason: 'The first refusal should stay on the active interviewer lane.',
    // Provider-specific function removed),
    round: 4,
    messages: [
      msg({
        id: 'a2',
        role: 'agent',
        authorId: 'interview-hr',
        authorName: 'HR',
        round: 3,
        content: 'Please introduce yourself briefly and mention one project.',
      // Provider-specific function removed),
      msg({
        id: 'u2',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 3,
        content: 'I would rather not share that.',
      // Provider-specific function removed),
    ],
    roomBlueprint: createBlueprint('interview_simulation'),
    speakerIds: INTERVIEW_SPEAKER_IDS,
    trackedPhase: 'opening',
    minimumPhase: 'opening',
  // Provider-specific function removed);

  assert.deepEqual(control, {
    kind: 'ask',
    phase: 'opening',
    speakerId: 'interview-hr',
    focus: 'Guide the candidate to answer with de-identified details.',
    reason: 'The first refusal should stay on the active interviewer lane.',
    responseMode: 'new_question',
  // Provider-specific function removed);
// Provider-specific function removed);

test('room admin interview control preserves an explicit retry even after repeated refusals', () => {
  const control = resolveInterviewRoomAdminControl({
    directive: roomAdminDirective({
      action: 'request_answer_retry',
      targetSpeakerId: 'Candidate',
      responseMode: 'new_question',
      instruction: 'Try a lower-pressure opening prompt.',
      reason: 'The candidate is still refusing to answer the opening question.',
    // Provider-specific function removed),
    round: 4,
    messages: [
      msg({
        id: 'a1',
        role: 'agent',
        authorId: 'interview-hr',
        authorName: 'HR',
        round: 2,
        content: 'Please introduce yourself briefly.',
      // Provider-specific function removed),
      msg({
        id: 'u1',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 2,
        content: "I'd rather not answer that because it is confidential.",
      // Provider-specific function removed),
      msg({
        id: 'a2',
        role: 'agent',
        authorId: 'interview-hr',
        authorName: 'HR',
        round: 3,
        content: 'Then please share only your field of study.',
      // Provider-specific function removed),
      msg({
        id: 'u2',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 3,
        content: 'I still prefer not to answer that.',
      // Provider-specific function removed),
    ],
    roomBlueprint: createBlueprint('interview_simulation'),
    speakerIds: INTERVIEW_SPEAKER_IDS,
    trackedPhase: 'opening',
    minimumPhase: 'opening',
  // Provider-specific function removed);

  assert.deepEqual(control, {
    kind: 'ask',
    phase: 'opening',
    speakerId: 'interview-hr',
    focus: 'Try a lower-pressure opening prompt.',
    reason: 'The candidate is still refusing to answer the opening question.',
    responseMode: 'new_question',
  // Provider-specific function removed);
// Provider-specific function removed);

test('room admin interview control returns undefined when retry directives have no active speaker', () => {
  const control = resolveInterviewRoomAdminControl({
    directive: roomAdminDirective({
      action: 'request_answer_retry',
      targetSpeakerId: '',
    // Provider-specific function removed),
    round: 4,
    messages: [],
    roomBlueprint: createBlueprint('interview_simulation'),
    speakerIds: INTERVIEW_SPEAKER_IDS,
    trackedPhase: 'technical',
    minimumPhase: 'technical',
  // Provider-specific function removed);

  assert.equal(control, undefined);
// Provider-specific function removed);

test('next runtime room admin fallback respects room-kernel terminate signal', () => {
  const fallback = buildChatroomRoomAdminFallback({
    roomBlueprint: createBlueprint('interview_simulation'),
    runtimeMode: 'agent-room-v2',
    round: 4,
    messages: [],
    roomKernelDirective: {
      schemaVersion: 1,
      directiveId: 'kernel-1',
      createdAt: '2026-04-15T00:00:00.000Z',
      round: 4,
      transcriptMessageCount: 8,
      runtimeMode: 'agent-room-v2',
      action: 'terminate_interview',
      phaseLabel: 'technical_deep_dive',
      summary: 'Interview is stuck in an unproductive loop and should be closed.',
      blockers: ['no new useful signal can be obtained'],
      recommendedInstruction: 'Close the interview and move into summary generation.',
      shouldEscalateRoomAdmin: true,
      targetSpeakerId: '',
      targetPromptMessageId: '',
      confidence: 0.82,
    // Provider-specific function removed,
  // Provider-specific function removed);

  assert.equal(fallback.action, 'complete_interview');
  assert.equal(fallback.visibility, 'hidden');
  assert.equal(fallback.terminalStatus, 'aborted');
// Provider-specific function removed);

test('next runtime room admin fallback converts room-kernel guide signal into retry', () => {
  const fallback = buildChatroomRoomAdminFallback({
    roomBlueprint: createBlueprint('interview_simulation'),
    runtimeMode: 'agent-room-v2',
    round: 4,
    messages: [
      msg({
        id: 'a2',
        role: 'agent',
        authorId: 'interview-technical',
        authorName: 'Tech',
        round: 3,
        content: 'Please give one concrete debugging case.',
      // Provider-specific function removed),
      msg({
        id: 'u2',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 3,
        content: 'I have done many projects.',
      // Provider-specific function removed),
    ],
    roomKernelDirective: {
      schemaVersion: 1,
      directiveId: 'kernel-2',
      createdAt: '2026-04-15T00:03:00.000Z',
      round: 4,
      transcriptMessageCount: 10,
      runtimeMode: 'agent-room-v2',
      action: 'guide_room_admin',
      phaseLabel: 'technical_deep_dive',
      summary: 'The answer is too vague and the question should be narrowed.',
      blockers: ['candidate answer is vague'],
      recommendedInstruction: 'Ask the same interviewer to narrow the question and continue probing.',
      shouldEscalateRoomAdmin: true,
      targetSpeakerId: 'interview-technical',
      targetPromptMessageId: 'a2',
      confidence: 0.75,
    // Provider-specific function removed,
  // Provider-specific function removed);

  assert.equal(fallback.action, 'request_answer_retry');
  assert.equal(fallback.targetSpeakerId, 'interview-technical');
  assert.equal(fallback.targetPromptMessageId, 'a2');
// Provider-specific function removed);

test('next runtime room admin fallback handles kernel retry action directly', () => {
  const fallback = buildChatroomRoomAdminFallback({
    roomBlueprint: createBlueprint('interview_simulation'),
    runtimeMode: 'agent-room-v2',
    round: 4,
    messages: [
      msg({
        id: 'a1',
        role: 'agent',
        authorId: 'interview-technical',
        authorName: 'Tech',
        round: 3,
        content: 'Describe one production incident.',
      // Provider-specific function removed),
      msg({
        id: 'u1',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 3,
        content: 'I did some projects.',
      // Provider-specific function removed),
    ],
    roomKernelDirective: {
      schemaVersion: 1,
      directiveId: 'kernel-retry-1',
      createdAt: '2026-04-15T00:05:00.000Z',
      round: 4,
      transcriptMessageCount: 8,
      runtimeMode: 'agent-room-v2',
      action: 'retry',
      phaseLabel: 'technical_deep_dive',
      summary: 'Candidate gave vague answer, retry on same thread.',
      blockers: [],
      recommendedInstruction: 'Ask candidate to provide a specific incident with timeline.',
      shouldEscalateRoomAdmin: true,
      targetSpeakerId: 'interview-technical',
      targetPromptMessageId: 'a1',
      confidence: 0.8,
    // Provider-specific function removed,
  // Provider-specific function removed);

  assert.equal(fallback.action, 'request_answer_retry');
  assert.equal(fallback.targetSpeakerId, 'interview-technical');
  assert.equal(fallback.targetPromptMessageId, 'a1');
  assert.equal(fallback.reason, 'Candidate gave vague answer, retry on same thread.');
// Provider-specific function removed);

test('next runtime room admin fallback handles kernel skip_phase action directly', () => {
  const fallback = buildChatroomRoomAdminFallback({
    roomBlueprint: createBlueprint('interview_simulation'),
    runtimeMode: 'agent-room-v2',
    round: 5,
    messages: [
      msg({
        id: 'a1',
        role: 'agent',
        authorId: 'interview-technical',
        authorName: 'Tech',
        round: 4,
        content: 'Describe one incident.',
      // Provider-specific function removed),
      msg({
        id: 'u1',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 4,
        content: 'I have no production experience.',
      // Provider-specific function removed),
    ],
    roomKernelDirective: {
      schemaVersion: 1,
      directiveId: 'kernel-skip-1',
      createdAt: '2026-04-15T00:06:00.000Z',
      round: 5,
      transcriptMessageCount: 10,
      runtimeMode: 'agent-room-v2',
      action: 'skip_phase',
      phaseLabel: 'manager_round',
      summary: 'Technical thread exhausted, skip to manager for different evidence thread.',
      blockers: [],
      recommendedInstruction: 'Move to manager round for cross-team alignment check.',
      shouldEscalateRoomAdmin: true,
      targetSpeakerId: 'interview-manager',
      targetPromptMessageId: '',
      confidence: 0.75,
    // Provider-specific function removed,
  // Provider-specific function removed);

  assert.equal(fallback.action, 'skip_phase');
  assert.equal(fallback.phaseLabel, 'manager_round');
  assert.equal(fallback.targetSpeakerId, 'interview-manager');
// Provider-specific function removed);

test('next runtime room admin fallback handles kernel advance_phase action directly', () => {
  const fallback = buildChatroomRoomAdminFallback({
    roomBlueprint: createBlueprint('interview_simulation'),
    runtimeMode: 'agent-room-v2',
    round: 6,
    messages: [
      msg({
        id: 'a1',
        role: 'agent',
        authorId: 'interview-technical',
        authorName: 'Tech',
        round: 5,
        content: 'Any cross-team coordination experience?',
      // Provider-specific function removed),
      msg({
        id: 'u1',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 5,
        content: 'Led a team project with frontend and backend.',
      // Provider-specific function removed),
    ],
    roomKernelDirective: {
      schemaVersion: 1,
      directiveId: 'kernel-advance-1',
      createdAt: '2026-04-15T00:07:00.000Z',
      round: 6,
      transcriptMessageCount: 14,
      runtimeMode: 'agent-room-v2',
      action: 'advance_phase',
      phaseLabel: 'hr_wrap_up',
      summary: 'Enough evidence collected, advance to wrap-up.',
      blockers: [],
      recommendedInstruction: 'Close the interview with HR wrap-up.',
      shouldEscalateRoomAdmin: true,
      targetSpeakerId: '',
      targetPromptMessageId: '',
      confidence: 0.82,
    // Provider-specific function removed,
  // Provider-specific function removed);

  assert.equal(fallback.action, 'set_phase');
  assert.equal(fallback.phaseLabel, 'hr_wrap_up');
// Provider-specific function removed);

test('internal collaboration summary surfaces supportive retry guidance', () => {
  const summary = summarizeInterviewInternalCollaboration({
    messages: [
      msg({
        id: 'a1',
        role: 'agent',
        authorId: 'interview-technical',
        authorName: 'Tech',
        round: 2,
        content: 'Please describe one concrete debugging issue you handled.',
      // Provider-specific function removed),
      msg({
        id: 'u1',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 2,
        content: 'I mostly learned this in coursework and need a bit of guidance to structure the answer.',
      // Provider-specific function removed),
    ],
    interviewInternalNotes: [
      internalNote({
        noteId: 'n1',
        kind: 'panel_handoff',
        authorId: 'interview-hr',
        authorName: 'HR',
        targetSpeakerId: 'interview-technical',
        targetSpeakerName: 'Tech',
        content: '候选人像新人而且有点紧张，下一轮请更友好地缩窄问题并给一点结构。',
      // Provider-specific function removed),
      internalNote({
        noteId: 'n2',
        kind: 'speaker_collaboration',
        authorId: 'interview-observer',
        authorName: 'Observer',
        targetSpeakerId: 'interview-technical',
        targetSpeakerName: 'Tech',
        content: '先澄清当前问题，不要直接换话题。',
      // Provider-specific function removed),
    ],
  // Provider-specific function removed);

  assert.ok(summary);
  assert.equal(summary?.collaborationSuggestedTone, 'supportive');
  assert.equal(summary?.collaborationRecommendedActionHint, 'request_answer_retry');
  assert.equal(summary?.collaborationRecommendedResponseModeHint, 'clarify');
  assert.equal(summary?.recentInternalNotes.length, 2);
  assert.match(summary?.collaborationSignals.join('\n') ?? '', /supportive follow-up style/i);
// Provider-specific function removed);

test('internal collaboration summary keeps only the highest-value recent governance notes', () => {
  const summary = summarizeInterviewInternalCollaboration({
    messages: [
      msg({
        id: 'a1',
        role: 'agent',
        authorId: 'interview-technical',
        authorName: 'Tech',
        round: 5,
        content: 'Please explain the exact rollback condition.',
      // Provider-specific function removed),
    ],
    interviewInternalNotes: [
      internalNote({
        noteId: 'n1',
        kind: 'panel_discussion',
        authorId: 'interview-hr',
        authorName: 'HR',
        targetSpeakerId: 'interview-technical',
        targetSpeakerName: 'Tech',
        round: 3,
        content: '先确认候选人是否真的参与过这个链路，不要直接跳结论。',
      // Provider-specific function removed),
      internalNote({
        noteId: 'n2',
        kind: 'panel_handoff',
        authorId: 'interview-observer',
        authorName: 'Observer',
        targetSpeakerId: 'interview-technical',
        targetSpeakerName: 'Tech',
        round: 4,
        content: '候选人有点紧张，追问时缩小范围，但继续留在同一证据线程。',
      // Provider-specific function removed),
      internalNote({
        noteId: 'n3',
        kind: 'speaker_collaboration',
        authorId: 'interview-manager',
        authorName: 'Manager',
        targetSpeakerId: 'interview-technical',
        targetSpeakerName: 'Tech',
        round: 5,
        content: '重点核实是否有量化结果和上线后的验证闭环。',
      // Provider-specific function removed),
      internalNote({
        noteId: 'n4',
        kind: 'panel_discussion',
        authorId: 'interview-hr',
        authorName: 'HR',
        targetSpeakerId: 'interview-technical',
        targetSpeakerName: 'Tech',
        round: 5,
        content: '如果还拿不到新证据，就不要再把房间拖进低收益循环。',
      // Provider-specific function removed),
    ],
  // Provider-specific function removed);

  assert.ok(summary);
  assert.equal(summary?.recentInternalNotes.length, 3);
  assert.equal(summary?.recentInternalNotes.some((item) => item.includes('先确认候选人是否真的参与过')), false);
// Provider-specific function removed);

test('internal collaboration summary respects structured signal tags even with vague note text', () => {
  const summary = summarizeInterviewInternalCollaboration({
    messages: [
      msg({
        id: 'a1',
        role: 'agent',
        authorId: 'interview-technical',
        authorName: 'Tech',
        round: 4,
        content: 'Walk me through how you validated the design decision.',
      // Provider-specific function removed),
      msg({
        id: 'u1',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 4,
        content: 'I am not sure how to frame it yet.',
      // Provider-specific function removed),
    ],
    interviewInternalNotes: [
      internalNote({
        noteId: 'n-structured-1',
        kind: 'speaker_collaboration',
        authorId: 'interview-technical',
        authorName: 'Tech',
        round: 4,
        signalTags: ['risk_alert', 'suggest_close'],
        content: 'Keep monitoring this.',
      // Provider-specific function removed),
    ],
  // Provider-specific function removed);

  assert.ok(summary);
  assert.equal(summary?.collaborationSuggestedTone, 'firm');
  assert.equal(summary?.collaborationRecommendedActionHint, 'complete_interview');
  assert.match(
    summary?.collaborationSignals.join('\n') ?? '',
    /concrete risk or inconsistency/i,
  );
  assert.match(
    summary?.collaborationSignals.join('\n') ?? '',
    /could need an early close/i,
  );
  assert.match(summary?.recentInternalNotes[0] ?? '', /signals=/i);
// Provider-specific function removed);

test('room admin fallback uses internal collaboration notes to keep retries guided and supportive', () => {
  const fallback = buildChatroomRoomAdminFallback({
    roomBlueprint: createBlueprint('interview_simulation'),
    round: 4,
    messages: [
      msg({
        id: 'a1',
        role: 'agent',
        authorId: 'interview-technical',
        authorName: 'Tech',
        round: 2,
        content: 'Please describe one real consistency incident you handled.',
      // Provider-specific function removed),
      msg({
        id: 'u1',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 2,
        content: 'I mainly worked on course projects.',
      // Provider-specific function removed),
      msg({
        id: 'a2',
        role: 'agent',
        authorId: 'interview-technical',
        authorName: 'Tech',
        round: 3,
        content: 'Please answer with one concrete incident and the outcome.',
      // Provider-specific function removed),
      msg({
        id: 'u2',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 3,
        content: 'I mainly worked on course projects.',
      // Provider-specific function removed),
    ],
    interviewInternalNotes: [
      internalNote({
        noteId: 'n3',
        kind: 'panel_handoff',
        authorId: 'interview-hr',
        authorName: 'HR',
        targetSpeakerId: 'interview-technical',
        targetSpeakerName: 'Tech',
        content: '候选人是新人，重试时请更友好一点，先澄清再继续。',
      // Provider-specific function removed),
    ],
  // Provider-specific function removed);

  assert.equal(fallback.action, 'request_answer_retry');
  assert.equal(fallback.responseMode, 'clarify');
  assert.match(fallback.instruction, /Keep the tone supportive/i);
// Provider-specific function removed);

test('room admin prompt surfaces internal collaboration summary explicitly', () => {
  const prompt = buildRoomAdminPrompt({
    roomBlueprint: createBlueprint('interview_simulation'),
    runtimeMode: 'agent-room-v2',
    round: 5,
    transcriptMessageCount: 12,
    collaborationSummary: {
      recentInternalNotes: [
        'panel handoff | HR -> Tech | phase=technical_deep_dive | Candidate is junior and needs a narrower question.',
      ],
      collaborationSignals: [
        'Recent interviewer notes describe the candidate as needing a more guided and supportive follow-up style.',
      ],
      collaborationSuggestedTone: 'supportive',
      collaborationRecommendedActionHint: 'request_answer_retry',
      collaborationRecommendedResponseModeHint: 'clarify',
    // Provider-specific function removed,
  // Provider-specific function removed);

  assert.match(prompt, /Recent interviewer internal collaboration:/);
  assert.match(prompt, /Internal note: panel handoff \| HR -> Tech/);
  assert.match(prompt, /Collaboration signal:/);
  assert.match(prompt, /Collaboration action hint: request_answer_retry \/ clarify/);
// Provider-specific function removed);

test('room admin prompt surfaces room-kernel signal in next runtime', () => {
  const prompt = buildRoomAdminPrompt({
    roomBlueprint: createBlueprint('project_development_discussion'),
    runtimeMode: 'agent-room-v2',
    round: 2,
    transcriptMessageCount: 6,
    currentPhaseLabel: 'decision framing',
    currentPhaseObjective: 'narrow the active decision before moving on',
    roomKernelDirective: {
      schemaVersion: 1,
      directiveId: 'kernel-4',
      createdAt: '2026-04-15T00:06:00.000Z',
      round: 2,
      transcriptMessageCount: 6,
      runtimeMode: 'agent-room-v2',
      action: 'guide_room_admin',
      phaseLabel: 'decision framing',
      summary: 'Room drifted and needs a tighter decision frame.',
      blockers: ['scope is too broad'],
      recommendedInstruction: 'Constrain the next turn to one concrete decision.',
      shouldEscalateRoomAdmin: true,
      targetSpeakerId: '',
      targetPromptMessageId: '',
      confidence: 0.73,
    // Provider-specific function removed,
  // Provider-specific function removed);

  assert.match(prompt, /Runtime mode: agent-room-v2/);
  assert.match(prompt, /Room kernel signal:/);
  assert.match(prompt, /action=guide_room_admin/);
  assert.match(
    prompt,
    /recommended_instruction=Constrain the next turn to one concrete decision\./,
  );
// Provider-specific function removed);

test('room admin prompt surfaces refusal and non-responsive incident details', () => {
  const prompt = buildRoomAdminPrompt({
    roomBlueprint: createBlueprint('interview_simulation'),
    runtimeMode: 'agent-room-v2',
    round: 5,
    transcriptMessageCount: 12,
    roomKernelDirective: undefined,
    incidentSnapshot: {
      latestCandidateTurnKind: 'refusal_request',
      repeatedAnswerCount: 0,
      consecutiveInadequateAnswerCount: 0,
      consecutiveEvasiveAnswerCount: 0,
      consecutiveNonResponsiveCount: 1,
      consecutiveRefusalCount: 2,
      latestQuestionSpeakerId: 'interview-technical',
      latestQuestionMessageId: 'a2',
      latestQuestionExcerpt: 'Please walk through the root cause and rollback.',
      latestCandidateExcerpt: 'I would rather not answer that.',
      pendingSpeakerId: 'interview-technical',
      pendingPromptMessageId: 'a2',
      pendingResponseMode: 'new_question',
      latestAnswerAdequate: false,
      latestAnswerMissingCategory: 'direct_response',
      latestAnswerFollowUpFocus: 'Retry once from a sanitized angle without sensitive details.',
      consecutiveWaitCount: 0,
      recommendedAction: 'complete_interview',
      recommendedResponseMode: 'new_question',
    // Provider-specific function removed,
  // Provider-specific function removed);

  assert.match(prompt, /Latest candidate turn kind:/);
  assert.match(prompt, /Consecutive refusal turns: 2/);
  assert.match(prompt, /Consecutive non-responsive turns: 1/);
  assert.match(prompt, /Recommended control action: complete_interview \/ new_question/);
// Provider-specific function removed);

test('room admin prompt instructs interview set_phase canonical phase ids and handoff usage', () => {
  const prompt = buildRoomAdminPrompt({
    roomBlueprint: createBlueprint('interview_simulation'),
    runtimeMode: 'agent-room-v2',
    round: 5,
    transcriptMessageCount: 12,
  // Provider-specific function removed);

  assert.match(prompt, /phaseLabel must use one canonical id/);
  assert.match(
    prompt,
    /opening, hr_followup, technical_deep_dive, observer_followup, manager_round, hr_wrap_up/,
  );
  assert.match(prompt, /skip to another stage, hand off to a different interviewer/);
  assert.match(prompt, /terminalStatus=aborted/);
  assert.match(prompt, /terminalStatus=complete/);
// Provider-specific function removed);

test('restore room admin state keeps valid directives only', () => {
  const restored = restoreChatroomRoomAdminState({
    schemaVersion: 1,
    lastUpdatedAt: '2026-04-15T00:30:00.000Z',
    currentPhaseLabel: 'tradeoff review',
    currentDirective: {
      schemaVersion: 1,
      directiveId: 'admin-1',
      createdAt: '2026-04-15T00:30:00.000Z',
      round: 2,
      transcriptMessageCount: 6,
      interventionStyle: 'on_demand',
      action: 'set_phase',
      visibility: 'visible',
      phaseLabel: 'tradeoff review',
      phaseObjective: 'compare the main tradeoffs clearly',
      eventLabel: '',
      eventMessage: '',
      targetSpeakerId: '',
      targetPromptMessageId: '',
      responseMode: 'new_question',
      instruction: 'Keep the next turn focused on tradeoffs.',
      reason: 'The room needs a tighter decision frame.',
      participantAdditions: [],
    // Provider-specific function removed,
    history: [
      {
        schemaVersion: 1,
        directiveId: 'admin-1',
        createdAt: '2026-04-15T00:30:00.000Z',
        round: 2,
        transcriptMessageCount: 6,
        interventionStyle: 'on_demand',
        action: 'set_phase',
        visibility: 'visible',
        phaseLabel: 'tradeoff review',
        phaseObjective: 'compare the main tradeoffs clearly',
        eventLabel: '',
        eventMessage: '',
        targetSpeakerId: '',
        targetPromptMessageId: '',
        responseMode: 'new_question',
        instruction: 'Keep the next turn focused on tradeoffs.',
        reason: 'The room needs a tighter decision frame.',
        participantAdditions: [],
      // Provider-specific function removed,
      {
        schemaVersion: 1,
        directiveId: '',
      // Provider-specific function removed,
    ],
  // Provider-specific function removed);

  assert.ok(restored);
  assert.equal(restored?.history.length, 1);
  assert.equal(restored?.currentDirective?.directiveId, 'admin-1');
// Provider-specific function removed);
