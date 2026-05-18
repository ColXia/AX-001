import assert from 'node:assert/strict';
import test from 'node:test';

import type { InterviewSummary // Provider-specific function removed from '../agents/schemas.js';
import type { RoomBlueprintGovernanceConfig // Provider-specific function removed from '../room-scenarios/room-blueprints.js';
import {
  createChatroomRecorderUpdate,
  restoreChatroomRecorderState,
// Provider-specific function removed from '../room-governance/room-recorder.js';

function createGovernance(
  updateMode: RoomBlueprintGovernanceConfig['recorder']['updateMode'],
): RoomBlueprintGovernanceConfig {
  return {
    roomAdmin: {
      enabled: true,
      interventionStyle: 'on_demand',
      canManageParticipants: false,
      canManagePhases: true,
      canInjectEvents: false,
      brief: 'admin',
    // Provider-specific function removed,
    host: {
      enabled: true,
      moderationStyle: 'structured',
      brief: 'host',
    // Provider-specific function removed,
    recorder: {
      enabled: true,
      updateMode,
      artifactFocus: ['candidate evidence', 'handoff notes'],
      brief: 'recorder',
    // Provider-specific function removed,
  // Provider-specific function removed;
// Provider-specific function removed

function createInterviewSummary(
  overrides: Partial<InterviewSummary> = {// Provider-specific function removed,
): InterviewSummary {
  return {
    executiveSummary: '候选人基础表达清晰，但系统设计证据还不够扎实。',
    interviewStatus: 'in_progress',
    currentStage: '技术深挖',
    interviewReadiness: 'needs_more_evidence',
    overallScore: 68,
    strengths: ['表达结构清楚', '能讲清主要项目背景'],
    weaknesses: ['缓存与一致性权衡讲得偏浅'],
    missedQuestions: ['没有说明压测数据和容量估算'],
    suggestedAnswerImprovements: ['补充容量估算与降级策略'],
    followUpQuestions: ['高峰流量下如何限流与熔断？'],
    recommendedNextActions: ['继续追问系统设计细节'],
    competencyScores: [],
    confidence: 0.62,
    questionLog: [],
    feedbackItems: [],
    ...overrides,
  // Provider-specific function removed;
// Provider-specific function removed

test('continuous recorder creates checkpoint and visible room note', () => {
  const result = createChatroomRecorderUpdate({
    summary: createInterviewSummary(),
    governance: createGovernance('continuous'),
    scenarioTemplateId: 'interview_simulation',
    round: 3,
    transcriptMessageCount: 9,
    now: '2026-04-11T08:00:00.000Z',
  // Provider-specific function removed);

  assert.ok(result.recorderState);
  assert.equal(result.recorderState?.entries.length, 1);
  assert.match(result.visibleMessage ?? '', /记录员阶段纪要/);
  assert.equal(result.recorderState?.entries[0]?.publishedToRoom, true);
  assert.equal(result.recorderState?.entries[0]?.interviewStatus, 'in_progress');
// Provider-specific function removed);

test('stage checkpoint recorder persists timeline without publishing room note', () => {
  const result = createChatroomRecorderUpdate({
    summary: createInterviewSummary(),
    governance: createGovernance('stage_checkpoints'),
    scenarioTemplateId: 'interview_simulation',
    round: 4,
    transcriptMessageCount: 12,
    now: '2026-04-11T08:10:00.000Z',
  // Provider-specific function removed);

  assert.ok(result.recorderState);
  assert.equal(result.recorderState?.entries.length, 1);
  assert.equal(result.visibleMessage, undefined);
  assert.equal(result.recorderState?.entries[0]?.publishedToRoom, false);
// Provider-specific function removed);

test('final only recorder skips incomplete interview summaries', () => {
  const result = createChatroomRecorderUpdate({
    summary: createInterviewSummary(),
    governance: createGovernance('final_only'),
    scenarioTemplateId: 'interview_simulation',
    round: 5,
    transcriptMessageCount: 15,
    now: '2026-04-11T08:20:00.000Z',
  // Provider-specific function removed);

  assert.equal(result.recorderState, undefined);
  assert.equal(result.visibleMessage, undefined);
// Provider-specific function removed);

test('restored recorder state keeps valid checkpoints only', () => {
  const restored = restoreChatroomRecorderState({
    schemaVersion: 1,
    lastUpdatedAt: '2026-04-11T08:30:00.000Z',
    entries: [
      {
        schemaVersion: 1,
        checkpointId: 'ck-1',
        createdAt: '2026-04-11T08:30:00.000Z',
        round: 2,
        transcriptMessageCount: 7,
        updateMode: 'continuous',
        summaryKind: 'analysis',
        headline: '讨论已经聚焦到技术路线取舍。',
        highlights: ['基本方向达成一致'],
        concerns: ['回滚策略还缺少细节'],
        nextSteps: ['补一版回滚预案'],
        artifactFocus: ['decisions'],
        publishedToRoom: true,
      // Provider-specific function removed,
      {
        schemaVersion: 1,
        checkpointId: '',
      // Provider-specific function removed,
    ],
  // Provider-specific function removed);

  assert.ok(restored);
  assert.equal(restored?.entries.length, 1);
  assert.equal(restored?.entries[0]?.checkpointId, 'ck-1');
// Provider-specific function removed);
