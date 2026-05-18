import assert from 'node:assert/strict';
import test from 'node:test';

import type { ChatroomRoomBlueprint // Provider-specific function removed from '../room-scenarios/room-blueprints.js';
import {
  applyChatroomHostModerationTurn,
  buildChatroomHostFallback,
  buildHostModerationPrompt,
  restoreChatroomHostState,
// Provider-specific function removed from '../room-governance/room-host.js';

function createBlueprint(
  scenarioTemplateId: ChatroomRoomBlueprint['scenarioTemplateId'],
  moderationStyle: ChatroomRoomBlueprint['governance']['host']['moderationStyle'],
): ChatroomRoomBlueprint {
  return {
    version: 1,
    blueprintId: 'bp-1',
    scenarioTemplateId,
    roomType: scenarioTemplateId === 'roleplay_scene' ? 'roleplay_scene' : 'expert_discussion',
    title: '测试房间',
    topic: '测试主题',
    objective: '聚焦关键目标',
    constraints: ['先处理核心分歧'],
    speakerIds: ['moderator-chat', 'strategy-chat'],
    participantSlots: [],
    runtimeConfig: {
      summaryEnabled: true,
      maxReplyCharacters: 800,
    // Provider-specific function removed,
    governance: {
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
        moderationStyle,
        brief: 'host',
      // Provider-specific function removed,
      recorder: {
        enabled: true,
        updateMode: 'stage_checkpoints',
        artifactFocus: ['summary'],
        brief: 'recorder',
      // Provider-specific function removed,
    // Provider-specific function removed,
  // Provider-specific function removed;
// Provider-specific function removed

test('structured host moderation creates visible host note and persistent directive', () => {
  const result = applyChatroomHostModerationTurn({
    turn: {
      action: 'guide',
      visibility: 'visible',
      headline: '先围绕缓存一致性继续推进。',
      focus: '缓存一致性',
      instruction: '下一轮优先收束缓存一致性与降级方案。',
      reason: '前面分支太多，需要先收束。',
    // Provider-specific function removed,
    hostConfig: createBlueprint('project_development_discussion', 'structured').governance.host,
    scenarioTemplateId: 'project_development_discussion',
    round: 2,
    transcriptMessageCount: 6,
    now: '2026-04-11T09:00:00.000Z',
  // Provider-specific function removed);

  assert.ok(result.hostState);
  assert.equal(result.hostState?.history.length, 1);
  assert.equal(result.hostState?.currentDirective?.focus, '缓存一致性');
  assert.match(result.visibleMessage ?? '', /主持提示/);
// Provider-specific function removed);

test('interview host moderation is normalized to hidden by default', () => {
  const result = applyChatroomHostModerationTurn({
    turn: {
      action: 'guide',
      visibility: 'hidden',
      headline: '不要重复已经回答过的内容。',
      focus: '继续围绕系统设计深挖',
      instruction: '保持一问一答，继续围绕系统设计细节追问。',
      reason: '面试节奏需要保持稳定。',
    // Provider-specific function removed,
    hostConfig: createBlueprint('interview_simulation', 'structured').governance.host,
    scenarioTemplateId: 'interview_simulation',
    round: 3,
    transcriptMessageCount: 8,
    now: '2026-04-11T09:10:00.000Z',
  // Provider-specific function removed);

  assert.ok(result.hostState);
  assert.equal(result.hostState?.currentDirective?.visibility, 'hidden');
  assert.equal(result.visibleMessage, undefined);
// Provider-specific function removed);

test('host fallback stays hidden for light rooms when discussion is healthy', () => {
  const blueprint = createBlueprint('expert_discussion', 'light');
  const fallback = buildChatroomHostFallback({
    roomBlueprint: blueprint,
    scenarioTemplateId: blueprint.scenarioTemplateId,
    round: 2,
    messages: [
      {
        id: 'm1',
        role: 'user',
        authorId: 'user',
        authorName: 'User',
        round: 1,
        createdAt: '2026-04-11T09:20:00.000Z',
        content: '我想先讨论缓存方案。',
      // Provider-specific function removed,
      {
        id: 'm2',
        role: 'agent',
        authorId: 'strategy-chat',
        authorName: '策略',
        round: 1,
        createdAt: '2026-04-11T09:21:00.000Z',
        content: '先看读写比例。',
      // Provider-specific function removed,
    ],
  // Provider-specific function removed);

  assert.equal(fallback.action, 'idle');
  assert.equal(fallback.visibility, 'hidden');
// Provider-specific function removed);

test('host fallback reuses current room admin phase objective as focus', () => {
  const blueprint = createBlueprint('project_development_discussion', 'structured');
  const fallback = buildChatroomHostFallback({
    roomBlueprint: blueprint,
    scenarioTemplateId: blueprint.scenarioTemplateId,
    round: 3,
    messages: [],
    currentPhaseLabel: '落地计划',
    currentPhaseObjective: '收束结论、行动项、owner 与下一步验证。',
  // Provider-specific function removed);

  assert.equal(fallback.focus, '收束结论、行动项、owner 与下一步验证。');
  assert.match(fallback.instruction, /当前阶段目标/);
// Provider-specific function removed);

test('host moderation prompt includes scenario playbook and current phase', () => {
  const blueprint = createBlueprint('project_development_discussion', 'structured');
  const prompt = buildHostModerationPrompt({
    roomBlueprint: blueprint,
    round: 2,
    transcriptMessageCount: 5,
    currentPhaseLabel: '方案比较',
    currentPhaseObjective: '比较主要方案分支，找出真正影响决策的取舍点。',
  // Provider-specific function removed);

  assert.match(prompt, /当前管理员阶段：方案比较/);
  assert.match(prompt, /当前阶段目标：比较主要方案分支/);
  assert.match(prompt, /按以下场景主持要点决策/);
// Provider-specific function removed);

test('restore host state keeps valid directives', () => {
  const restored = restoreChatroomHostState({
    schemaVersion: 1,
    lastUpdatedAt: '2026-04-11T09:30:00.000Z',
    currentDirective: {
      schemaVersion: 1,
      directiveId: 'host-1',
      createdAt: '2026-04-11T09:30:00.000Z',
      round: 2,
      transcriptMessageCount: 10,
      moderationStyle: 'strict',
      action: 'intervene',
      visibility: 'visible',
      headline: '先停止发散，回到目标。',
      focus: '回到目标',
      instruction: '后续发言必须直接回答目标问题。',
      reason: '房间已经明显跑题。',
    // Provider-specific function removed,
    history: [
      {
        schemaVersion: 1,
        directiveId: 'host-1',
        createdAt: '2026-04-11T09:30:00.000Z',
        round: 2,
        transcriptMessageCount: 10,
        moderationStyle: 'strict',
        action: 'intervene',
        visibility: 'visible',
        headline: '先停止发散，回到目标。',
        focus: '回到目标',
        instruction: '后续发言必须直接回答目标问题。',
        reason: '房间已经明显跑题。',
      // Provider-specific function removed,
      {
        schemaVersion: 1,
        directiveId: '',
      // Provider-specific function removed,
    ],
  // Provider-specific function removed);

  assert.ok(restored);
  assert.equal(restored?.history.length, 1);
  assert.equal(restored?.currentDirective?.directiveId, 'host-1');
// Provider-specific function removed);
