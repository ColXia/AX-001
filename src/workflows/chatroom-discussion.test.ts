import assert from 'node:assert/strict';
import test from 'node:test';

import { resolveChatroomSpeakerProfiles // Provider-specific function removed from '../agents/chatroom-profiles.js';
import {
  applyRoomAdminParticipantAdditions,
  buildChatroomRoomKernelFallback,
  buildInterviewPlannerPrompt,
  buildInterviewSpeakerTurnPrompt,
  buildRoomKernelPrompt,
  buildRoomSpeakerTurnPrompt,
  createChatroomWorkflow,
  createInitialChatroomState,
// Provider-specific function removed from './chatroom-discussion.js';
import { resolveChatroomRoomType // Provider-specific function removed from './chatroom-room-types.js';
import {
  INTERVIEW_DEMO_ROOM_TITLE,
  createChatroomRoomBlueprint,
// Provider-specific function removed from '../room-scenarios/room-blueprints.js';
import { applyRoomRuntimeModeToBlueprint // Provider-specific function removed from './room-runtime-mode.js';

function buildStateForScenario(
  scenarioTemplateId: Parameters<typeof createChatroomRoomBlueprint>[0]['scenarioTemplateId'],
  args: {
    roomType?: Parameters<typeof createChatroomRoomBlueprint>[0]['roomType'];
    topic: string;
    objective: string;
  // Provider-specific function removed,
) {
  const blueprint = createChatroomRoomBlueprint({
    scenarioTemplateId,
    roomType: args.roomType,
    topic: args.topic,
    objective: args.objective,
  // Provider-specific function removed);

  return createInitialChatroomState({
    roomBlueprint: blueprint,
    topic: blueprint.topic,
    objective: blueprint.objective,
  // Provider-specific function removed);
// Provider-specific function removed

test('buildRoomSpeakerTurnPrompt includes host focus alongside instruction', () => {
  const state = buildStateForScenario('expert_discussion', {
    topic: '缓存一致性',
    objective: '确定上线前的风险兜底方案',
  // Provider-specific function removed);
  state.hostState = {
    schemaVersion: 1,
    lastUpdatedAt: '2026-04-13T00:00:00.000Z',
    currentDirective: {
      schemaVersion: 1,
      directiveId: 'host-1',
      createdAt: '2026-04-13T00:00:00.000Z',
      round: 1,
      transcriptMessageCount: state.messages.length,
      moderationStyle: 'structured',
      action: 'guide',
      visibility: 'hidden',
      headline: '先回到关键阻塞项',
      focus: '回到关键阻塞项',
      instruction: '下一轮必须先回答风险和回滚条件。',
      reason: '讨论开始发散了。',
    // Provider-specific function removed,
    history: [],
  // Provider-specific function removed;

  const speaker = resolveChatroomSpeakerProfiles(state.speakerIds)[0]!;
  const prompt = buildRoomSpeakerTurnPrompt(
    resolveChatroomRoomType(state.roomType),
    1,
    state,
    speaker,
  );

  assert.match(prompt, /Host guidance:/);
  assert.match(prompt, /Focus: 回到关键阻塞项/);
  assert.match(prompt, /Instruction: 下一轮必须先回答风险和回滚条件/);
// Provider-specific function removed);

test('applyRoomAdminParticipantAdditions supports project discussion rooms', () => {
  const state = buildStateForScenario('project_development_discussion', {
    roomType: 'project_discussion',
    topic: '支付链路重构',
    objective: '补齐上线前的决策与风险清单',
  // Provider-specific function removed);

  applyRoomAdminParticipantAdditions(state, [
    {
      name: 'Security Reviewer',
      instruction: '从上线风险、权限边界与回滚预案角度补充意见。',
    // Provider-specific function removed,
  ]);

  assert.ok(state.customCharacters);
  assert.equal(state.customCharacters?.length, 1);
  assert.ok(state.speakerIds.includes('custom-room-0'));
  assert.ok(
    state.roomBlueprint?.participantSlots.some(
      (slot) => slot.profileId === 'custom-room-0' && slot.label === 'Security Reviewer',
    ),
  );

  const speakers = resolveChatroomSpeakerProfiles(state.speakerIds, state.customCharacters);
  assert.equal(speakers.at(-1)?.id, 'custom-room-0');
  assert.equal(speakers.at(-1)?.name, 'Security Reviewer');
// Provider-specific function removed);

test('applyRoomAdminParticipantAdditions supports murder mystery cast additions', () => {
  const state = buildStateForScenario('murder_mystery', {
    roomType: 'roleplay_scene',
    topic: '午夜图书馆案件',
    objective: '围绕线索、嫌疑人与矛盾证词推进推理。',
  // Provider-specific function removed);

  applyRoomAdminParticipantAdditions(state, [
    {
      name: 'Archivist Witness',
      instruction: '掌握借阅记录，但只会在追问时间线矛盾时透露关键信息。',
    // Provider-specific function removed,
  ]);

  assert.ok(state.customCharacters);
  assert.equal(state.customCharacters?.length, 1);
  const character = state.customCharacters?.[0];
  const expectedSpeakerId = character?.characterId
    ? `custom-rp-${character.characterId// Provider-specific function removed`
    : 'custom-rp-0';
  assert.ok(state.speakerIds.includes(expectedSpeakerId), `Expected ${expectedSpeakerId// Provider-specific function removed in ${state.speakerIds.join(', ')// Provider-specific function removed`);
  assert.ok(
    state.roomBlueprint?.participantSlots.some(
      (slot) => slot.profileId === expectedSpeakerId && slot.slotId === 'mystery-cast-1',
    ),
  );
  assert.ok(
    state.roleplayScene?.cast.some((character) => character.speakerId === expectedSpeakerId),
  );
// Provider-specific function removed);

test('applyRoomAdminParticipantAdditions supports interview room interviewer additions', () => {
  const state = buildStateForScenario('interview_simulation', {
    topic: 'Backend Engineer',
    objective: 'Run a realistic backend interview.',
  // Provider-specific function removed);

  applyRoomAdminParticipantAdditions(state, [
    {
      name: 'System Design Interviewer',
      instruction: 'Focus on distributed systems and scalability questions.',
    // Provider-specific function removed,
  ]);

  assert.ok(state.customCharacters);
  assert.equal(state.customCharacters?.length, 1);
  const character = state.customCharacters?.[0];
  const expectedSpeakerId = character?.characterId
    ? `interviewer-${character.characterId// Provider-specific function removed`
    : 'interviewer-0';
  assert.ok(state.speakerIds.includes(expectedSpeakerId), `Expected ${expectedSpeakerId// Provider-specific function removed in ${state.speakerIds.join(', ')// Provider-specific function removed`);
  assert.ok(
    state.roomBlueprint?.participantSlots.some(
      (slot) => slot.profileId === expectedSpeakerId && slot.metadata?.role === 'interviewer',
    ),
  );
// Provider-specific function removed);

test('createChatroomWorkflow adds room kernel only for next runtime', () => {
  const legacyBlueprint = createChatroomRoomBlueprint({
    scenarioTemplateId: 'interview_simulation',
    title: INTERVIEW_DEMO_ROOM_TITLE,
    topic: 'General interview demo',
    objective: 'Run a realistic interview demo.',
  // Provider-specific function removed);
  const nextBlueprint = applyRoomRuntimeModeToBlueprint(
    legacyBlueprint,
    'agent-room-v2',
  );

  const legacyWorkflow = createChatroomWorkflow({
    roomType: legacyBlueprint.roomType,
    roomBlueprint: legacyBlueprint,
    startRound: 1,
    rounds: 1,
    speakerIds: legacyBlueprint.speakerIds,
  // Provider-specific function removed);
  const nextWorkflow = createChatroomWorkflow({
    roomType: nextBlueprint.roomType,
    roomBlueprint: nextBlueprint,
    startRound: 1,
    rounds: 1,
    speakerIds: nextBlueprint.speakerIds,
  // Provider-specific function removed);

  assert.equal(
    legacyWorkflow.steps.some((step) => step.id.includes('room-kernel')),
    false,
  );
  assert.equal(
    nextWorkflow.steps.some((step) => step.id.includes('room-kernel')),
    true,
  );
// Provider-specific function removed);

test('buildRoomKernelPrompt surfaces recent internal collaboration notes', () => {
  const state = buildStateForScenario('interview_simulation', {
    topic: 'Backend Engineer',
    objective: 'Run a realistic backend interview.',
  // Provider-specific function removed);
  state.messages.push(
    {
      id: 'a1',
      role: 'agent',
      authorId: 'interview-technical',
      authorName: 'Technical Interviewer',
      round: 2,
      createdAt: '2026-04-15T00:00:00.000Z',
      content: 'Please describe one concrete debugging issue you handled.',
    // Provider-specific function removed,
    {
      id: 'u1',
      role: 'user',
      authorId: 'user',
      authorName: 'Candidate',
      round: 2,
      createdAt: '2026-04-15T00:01:00.000Z',
      content: 'I mostly have coursework examples and need a bit of help structuring the answer.',
    // Provider-specific function removed,
  );
  state.interviewInternalNotes = [
    {
      schemaVersion: 1,
      noteId: 'n1',
      kind: 'panel_handoff',
      createdAt: '2026-04-15T00:01:30.000Z',
      round: 2,
      authorId: 'interview-hr',
      authorName: 'HR Interviewer',
      targetSpeakerId: 'interview-technical',
      targetSpeakerName: 'Technical Interviewer',
      phaseLabel: 'technical_deep_dive',
      content: '候选人偏新人而且有点紧张，下一轮请更友好地缩窄问题。',
    // Provider-specific function removed,
  ];

  const prompt = buildRoomKernelPrompt({
    state,
    round: 3,
    runtimeMode: 'agent-room-v2',
  // Provider-specific function removed);

  assert.match(prompt, /Recent interviewer internal collaboration:/);
  assert.match(prompt, /Internal note: panel handoff \| HR Interviewer -> Technical Interviewer/);
  assert.match(prompt, /Collaboration action hint: request_answer_retry \/ clarify/);
// Provider-specific function removed);

test('buildInterviewPlannerPrompt surfaces collaboration guidance for same-thread retry', () => {
  const state = buildStateForScenario('interview_simulation', {
    topic: 'Backend Engineer',
    objective: 'Run a realistic backend interview.',
  // Provider-specific function removed);
  state.messages.push(
    {
      id: 'a1',
      role: 'agent',
      authorId: 'interview-technical',
      authorName: 'Technical Interviewer',
      round: 2,
      createdAt: '2026-04-15T00:00:00.000Z',
      content: 'Please describe one concrete debugging issue you handled.',
    // Provider-specific function removed,
    {
      id: 'u1',
      role: 'user',
      authorId: 'user',
      authorName: 'Candidate',
      round: 2,
      createdAt: '2026-04-15T00:01:00.000Z',
      content: 'I mainly have coursework examples and need a bit more guidance to structure the answer.',
    // Provider-specific function removed,
  );
  state.interviewInternalNotes = [
    {
      schemaVersion: 1,
      noteId: 'n-plan-1',
      kind: 'speaker_collaboration',
      createdAt: '2026-04-15T00:01:30.000Z',
      round: 2,
      authorId: 'interview-observer',
      authorName: 'Observer',
      targetSpeakerId: 'interview-technical',
      targetSpeakerName: 'Technical Interviewer',
      phaseLabel: 'technical_deep_dive',
      content: '候选人偏新人而且有点紧张，先更友好地缩窄问题并给一点结构，再决定是否换阶段。',
    // Provider-specific function removed,
  ];

  const prompt = buildInterviewPlannerPrompt(state, {
    kind: 'ask',
    phase: 'manager_round',
    stageLabel: '综合追问',
    speakerId: 'interview-manager',
    focus: 'Probe ownership and collaboration.',
    reason: 'Fallback',
    responseMode: 'new_question',
  // Provider-specific function removed);

  assert.match(prompt, /Recent interviewer internal collaboration:/);
  assert.match(prompt, /Planner rule: if the candidate still shows some useful signal/i);
  assert.match(prompt, /Planner rule: recent interviewer notes recommend one more retry/i);
// Provider-specific function removed);

test('buildInterviewSpeakerTurnPrompt surfaces supportive collaboration guidance', () => {
  const state = buildStateForScenario('interview_simulation', {
    topic: 'Backend Engineer',
    objective: 'Run a realistic backend interview.',
  // Provider-specific function removed);
  state.messages.push(
    {
      id: 'a1',
      role: 'agent',
      authorId: 'interview-technical',
      authorName: 'Technical Interviewer',
      round: 2,
      createdAt: '2026-04-15T00:00:00.000Z',
      content: 'Please describe one concrete debugging issue you handled.',
    // Provider-specific function removed,
    {
      id: 'u1',
      role: 'user',
      authorId: 'user',
      authorName: 'Candidate',
      round: 2,
      createdAt: '2026-04-15T00:01:00.000Z',
      content: 'I mainly have coursework examples and need a bit more guidance to structure the answer.',
    // Provider-specific function removed,
  );
  state.interviewInternalNotes = [
    {
      schemaVersion: 1,
      noteId: 'n-speaker-1',
      kind: 'panel_handoff',
      createdAt: '2026-04-15T00:01:30.000Z',
      round: 2,
      authorId: 'interview-hr',
      authorName: 'HR Interviewer',
      targetSpeakerId: 'interview-technical',
      targetSpeakerName: 'Technical Interviewer',
      phaseLabel: 'technical_deep_dive',
      content: '候选人偏新人且有点紧张，请沿着当前问题更友好地重述，并接受一个课程级别的具体例子。',
    // Provider-specific function removed,
  ];

  const prompt = buildInterviewSpeakerTurnPrompt({
    kind: 'ask',
    phase: 'technical_deep_dive',
    stageLabel: '技术深挖',
    speakerId: 'interview-technical',
    focus: 'Keep the same evidence thread and ask for one concrete missing point.',
    reason: 'Follow-up',
    responseMode: 'clarify',
  // Provider-specific function removed, state);

  assert.match(prompt, /Internal collaboration guidance:/);
  assert.match(prompt, /Interviewer style: keep the tone supportive and structured\./);
  assert.match(prompt, /Retry mode: stay on the same evidence thread, restate or narrow the current question first/i);
// Provider-specific function removed);

test('room kernel fallback uses internal collaboration notes to recommend guided retry', () => {
  const state = buildStateForScenario('interview_simulation', {
    topic: 'Backend Engineer',
    objective: 'Run a realistic backend interview.',
  // Provider-specific function removed);
  state.messages.push(
    {
      id: 'a1',
      role: 'agent',
      authorId: 'interview-technical',
      authorName: 'Technical Interviewer',
      round: 2,
      createdAt: '2026-04-15T00:00:00.000Z',
      content: 'Please describe one concrete production incident you handled.',
    // Provider-specific function removed,
    {
      id: 'u1',
      role: 'user',
      authorId: 'user',
      authorName: 'Candidate',
      round: 2,
      createdAt: '2026-04-15T00:01:00.000Z',
      content: 'I mostly did course projects.',
    // Provider-specific function removed,
  );
  state.interviewPendingCandidateReply = {
    speakerId: 'interview-technical',
    promptMessageId: 'a1',
    round: 2,
    responseMode: 'new_question',
  // Provider-specific function removed;
  state.interviewInternalNotes = [
    {
      schemaVersion: 1,
      noteId: 'n2',
      kind: 'speaker_collaboration',
      createdAt: '2026-04-15T00:01:30.000Z',
      round: 2,
      authorId: 'interview-observer',
      authorName: 'Observer',
      targetSpeakerId: 'interview-technical',
      targetSpeakerName: 'Technical Interviewer',
      phaseLabel: 'technical_deep_dive',
      content: '候选人像新人，先更友好地重述问题并接受课程级别示例。',
    // Provider-specific function removed,
  ];

  const fallback = buildChatroomRoomKernelFallback({
    state,
    round: 3,
    runtimeMode: 'agent-room-v2',
  // Provider-specific function removed);

  assert.equal(fallback.action, 'guide_room_admin');
  assert.match(fallback.recommendedInstruction, /more guided way/i);
  assert.match(fallback.recommendedInstruction, /smaller-scope example/i);
// Provider-specific function removed);
