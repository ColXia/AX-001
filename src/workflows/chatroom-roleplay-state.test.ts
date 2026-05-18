import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createCustomRoleplayTemplates,
  createInitialRoleplaySceneState,
  rebuildRoleplaySceneState,
  updateRoleplaySceneState,
// Provider-specific function removed from './chatroom-roleplay-state.js';
import type { ChatroomMessage // Provider-specific function removed from './chatroom-types.js';

test('custom roleplay templates use stable character ids when provided', () => {
  const customTemplates = createCustomRoleplayTemplates([
    {
      characterId: 'tavern-keeper',
      name: 'Mara',
      instruction: 'Keeps the tavern and remembers every rumor.',
    // Provider-specific function removed,
  ]);

  assert.ok(customTemplates.has('scene-host-rp'));
  assert.ok(customTemplates.has('custom-rp-tavern-keeper'));
  assert.equal(customTemplates.get('custom-rp-tavern-keeper')?.displayName, 'Mara');
// Provider-specific function removed);

test('custom roleplay templates preserve role-card goals, notes, and relationships', () => {
  const customTemplates = createCustomRoleplayTemplates([
    {
      characterId: 'keeper',
      name: 'Mara',
      instruction: 'Keeps the tavern and remembers every rumor.',
      publicDescription: 'Warm tavern keeper with guarded eyes.',
      privateNotes: ['Knows the missing caravan passed before midnight.'],
      initialGoal: 'Learn whether the traveler saw the missing caravan.',
      relationships: [
        {
          targetCharacterId: 'guard',
          summary: 'Trusts Rook to keep order when trouble starts.',
          score: 2,
        // Provider-specific function removed,
      ],
    // Provider-specific function removed,
    {
      characterId: 'guard',
      name: 'Rook',
      instruction: 'Keeps a hand near the sword and watches strangers.',
    // Provider-specific function removed,
  ]);

  const keeper = customTemplates.get('custom-rp-keeper');
  assert.ok(keeper);
  assert.equal(keeper.currentGoal, 'Learn whether the traveler saw the missing caravan.');
  assert.ok(
    keeper.privateNotes.includes('Knows the missing caravan passed before midnight.'),
  );
  assert.equal(keeper.relationships[0]?.targetSpeakerId, 'custom-rp-guard');
  assert.equal(keeper.relationships[0]?.summary, 'Trusts Rook to keep order when trouble starts.');
  assert.equal(keeper.relationships[0]?.score, 2);
// Provider-specific function removed);

function buildScene() {
  const customTemplates = createCustomRoleplayTemplates([
    { name: 'Lin', instruction: '表面冷静，实际一直在判断谁更危险。' // Provider-specific function removed,
    { name: 'Shen', instruction: '说话谨慎，习惯先把漏洞问出来。' // Provider-specific function removed,
  ]);

  return {
    customTemplates,
    scene: createInitialRoleplaySceneState({
      topic: '雨夜车站',
      objective: '把冲突推进到下一轮试探',
      constraints: ['不要过早摊牌'],
      speakerIds: ['custom-rp-0', 'custom-rp-1'],
      customTemplates,
    // Provider-specific function removed),
  // Provider-specific function removed;
// Provider-specific function removed

function buildMessage(args: {
  id: string;
  role: ChatroomMessage['role'];
  round: number;
  authorId: string;
  authorName: string;
  content: string;
// Provider-specific function removed): ChatroomMessage {
  return {
    id: args.id,
    role: args.role,
    authorId: args.authorId,
    authorName: args.authorName,
    round: args.round,
    content: args.content,
    createdAt: '2026-04-13T00:00:00.000Z',
  // Provider-specific function removed;
// Provider-specific function removed

function getSpeakerGoal(scene: ReturnType<typeof createInitialRoleplaySceneState>, speakerId: string): string {
  const speaker = scene.cast.find((item) => item.speakerId === speakerId);
  assert.ok(speaker, `expected speaker ${speakerId// Provider-specific function removed`);
  return speaker.currentGoal;
// Provider-specific function removed

test('roleplay scene updates current goal when the speaker states a new sub-goal', () => {
  const { scene // Provider-specific function removed = buildScene();
  const next = updateRoleplaySceneState(
    scene,
    buildMessage({
      id: 'm1',
      role: 'agent',
      round: 1,
      authorId: 'custom-rp-0',
      authorName: 'Lin',
      content: 'Lin压低声音说，先确认这封信是谁送来的，再决定要不要让 Shen 知道。',
    // Provider-specific function removed),
  );

  assert.ok(next);
  assert.equal(getSpeakerGoal(next, 'custom-rp-0'), '先确认这封信是谁送来的');
// Provider-specific function removed);

test('roleplay scene keeps the prior goal when the line does not introduce a pivot', () => {
  const { scene // Provider-specific function removed = buildScene();
  const previousGoal = getSpeakerGoal(scene, 'custom-rp-0');
  const next = updateRoleplaySceneState(
    scene,
    buildMessage({
      id: 'm2',
      role: 'agent',
      round: 1,
      authorId: 'custom-rp-0',
      authorName: 'Lin',
      content: 'Lin抬眼看了 Shen 一下，没有立刻接话，只是把信折好收回袖口。',
    // Provider-specific function removed),
  );

  assert.ok(next);
  assert.equal(getSpeakerGoal(next, 'custom-rp-0'), previousGoal);
// Provider-specific function removed);

test('roleplay scene pivots current goal when relationship pressure turns hostile', () => {
  const { scene // Provider-specific function removed = buildScene();
  const next = updateRoleplaySceneState(
    scene,
    buildMessage({
      id: 'm3',
      role: 'agent',
      round: 2,
      authorId: 'custom-rp-0',
      authorName: 'Lin',
      content: 'Shen还在逼问，Lin只是冷冷看着他，把信塞回口袋，不肯再多说。',
    // Provider-specific function removed),
  );

  assert.ok(next);
  assert.equal(getSpeakerGoal(next, 'custom-rp-0'), '防着Shen，别让对方继续逼近底牌');
// Provider-specific function removed);

test('rebuildRoleplaySceneState replays the same goal evolution from transcript history', () => {
  const { customTemplates // Provider-specific function removed = buildScene();
  const rebuilt = rebuildRoleplaySceneState({
    topic: '雨夜车站',
    objective: '把冲突推进到下一轮试探',
    constraints: ['不要过早摊牌'],
    speakerIds: ['custom-rp-0', 'custom-rp-1'],
    customTemplates,
    messages: [
      buildMessage({
        id: 'u1',
        role: 'user',
        round: 1,
        authorId: 'user',
        authorName: 'User',
        content: '这封信到底是谁送来的？',
      // Provider-specific function removed),
      buildMessage({
        id: 'm4',
        role: 'agent',
        round: 2,
        authorId: 'custom-rp-0',
        authorName: 'Lin',
        content: 'Lin低声说，先确认这封信是谁送来的，再决定要不要让 Shen 知道。',
      // Provider-specific function removed),
    ],
  // Provider-specific function removed);

  assert.equal(getSpeakerGoal(rebuilt, 'custom-rp-0'), '先确认这封信是谁送来的');
// Provider-specific function removed);
