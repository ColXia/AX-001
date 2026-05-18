/**
 * 简化版角色扮演记忆测试
 * 4个角色，5轮，串行执行
 */

import { resolve // Provider-specific function removed from 'node:path';
import { mkdirSync, writeFileSync // Provider-specific function removed from 'node:fs';
import { setTracingDisabled // Provider-specific function removed from '@openai/agents-core';
import { AgentRuntime // Provider-specific function removed from '../core/agent-runtime.js';
import { WorkflowRuntime // Provider-specific function removed from '../core/workflow.js';
import { loadAppConfig, createRuntimeModelBinding // Provider-specific function removed from '../config/app-config.js';
import type { ChatroomState // Provider-specific function removed from '../room-runtime/room-state.js';
import type { ChatroomAgentContext // Provider-specific function removed from '../room-runtime/agent-context.js';
import { createChatroomRoom, loadChatroomRoomState // Provider-specific function removed from '../room-storage/room-repository.js';
import { getChatroomParticipantBinding // Provider-specific function removed from '../room-storage/participant-repository.js';
import { executeRoomRuntimeWorkflow // Provider-specific function removed from '../room-runtime/room-runner.js';
import { planCustomRoleplayRoom // Provider-specific function removed from '../room-app/roleplay-room-service.js';
import type { RoleplayCharacterCard // Provider-specific function removed from '../room-scenarios/roleplay/roleplay-characters.js';

// 简化为4个角色
const SIMPLE_CHARACTERS: RoleplayCharacterCard[] = [
  {
    characterId: 'innkeeper',
    name: 'Mara the Innkeeper',
    instruction: `You are Mara, the owner of the Rusty Lantern inn. You are warm but observant. 
You know all the local gossip and can read people well. 
Speak in a friendly, slightly mysterious way. Keep your responses short (2-3 sentences).`,
    publicDescription: 'A warm but observant innkeeper who knows everyone\'s secrets.',
    initialGoal: 'Welcome guests and watch for anything unusual.',
  // Provider-specific function removed,
  {
    characterId: 'guard',
    name: 'Captain Rook',
    instruction: `You are Captain Rook, the town guard. You are suspicious of strangers and protective of the town.
You speak in short, direct sentences. You are watching for trouble.
Keep your responses short (2-3 sentences).`,
    publicDescription: 'A stern guard captain who distrusts outsiders.',
    initialGoal: 'Watch the guests and ensure no trouble starts.',
  // Provider-specific function removed,
  {
    characterId: 'merchant',
    name: 'Greed the Merchant',
    instruction: `You are a traveling merchant named Greed. You are always looking for profit.
You speak enthusiastically about trade and goods.
Keep your responses short (2-3 sentences).`,
    publicDescription: 'A traveling merchant always looking for a deal.',
    initialGoal: 'Find customers and make some sales.',
  // Provider-specific function removed,
  {
    characterId: 'stranger',
    name: 'The Mysterious Stranger',
    instruction: `You are a mysterious stranger in a dark cloak. You speak in riddles and hints.
You seem to know more than you let on.
Keep your responses short (2-3 sentences).`,
    publicDescription: 'A hooded figure who arrived with the storm.',
    initialGoal: 'Observe and wait for the right moment.',
  // Provider-specific function removed,
];

async function runSimpleTest() {
  console.log('=== Simple Roleplay Memory Test ===\n');
  
  const config = loadAppConfig();
  setTracingDisabled(config.runtime.tracingDisabled);
  
  const runtimeModel = createRuntimeModelBinding(config);
  const agentRuntime = new AgentRuntime({
    model: runtimeModel.model,
    retryDefaults: config.runtime.modelRetry,
    ...(runtimeModel.modelProvider ? { modelProvider: runtimeModel.modelProvider // Provider-specific function removed : {// Provider-specific function removed),
    tracingDisabled: config.runtime.tracingDisabled,
    workflowName: config.runtime.workflowName,
    structuredOutputMode: config.provider.compatibility.structuredOutputMode,
    maxStructuredOutputRetries: config.provider.compatibility.maxStructuredOutputRetries,
  // Provider-specific function removed);
  const workflowRuntime = new WorkflowRuntime<ChatroomState, ChatroomAgentContext>(agentRuntime);

  console.log('Creating room with 4 characters...');
  const planned = planCustomRoleplayRoom({
    title: 'The Rusty Lantern',
    topic: 'A stormy night at a roadside inn',
    objective: 'Test roleplay memory with 4 characters over 5 rounds',
    scene: {
      setting: 'A small inn on a stormy night. The fire crackles in the hearth.',
      openingSituation: 'Four people are gathered in the common room as rain hammers the windows.',
      atmosphere: 'cozy, mysterious, tense',
      userMode: 'observer',
    // Provider-specific function removed,
    customCharacters: SIMPLE_CHARACTERS,
    runtimeConfig: {
      parallelBatchSize: 1,  // 串行执行，避免API限流
      summaryEnabled: false,
      maxReplyCharacters: 500,  // 减少输出长度
    // Provider-specific function removed,
  // Provider-specific function removed);

  const blueprint = planned.blueprint;
  console.log(`Speakers: ${blueprint.speakerIds.join(', ')// Provider-specific function removed\n`);

  const room = createChatroomRoom({
    roomBlueprint: blueprint,
    roomType: 'roleplay_scene',
    topic: blueprint.topic,
    objective: blueprint.objective,
    speakerIds: blueprint.speakerIds,
  // Provider-specific function removed);

  console.log(`Room ID: ${room.roomId// Provider-specific function removed\n`);

  const rounds = 5;
  const startTime = Date.now();

  for (let round = 1; round <= rounds; round++) {
    console.log(`--- Round ${round// Provider-specific function removed/${rounds// Provider-specific function removed ---`);
    const roundStart = Date.now();
    
    try {
      await executeRoomRuntimeWorkflow({
        workflowRuntime,
        roomId: room.roomId,
        rounds: 1,
      // Provider-specific function removed);
    // Provider-specific function removed catch (error) {
      console.error(`  Error in round ${round// Provider-specific function removed:`, error);
      break;
    // Provider-specific function removed

    const roundElapsed = Date.now() - roundStart;
    const state = loadChatroomRoomState(room.roomId);
    const roundMessages = state.messages.filter(m => m.round === round);
    console.log(`  Messages: ${roundMessages.length// Provider-specific function removed, Time: ${(roundElapsed / 1000).toFixed(1)// Provider-specific function removeds`);
    
    // 打印角色发言
    for (const msg of roundMessages) {
    ***REMOVED***msg.authorId.startsWith('custom-rp-')) {
        const preview = msg.content.substring(0, 80).replace(/\n/g, ' ');
        console.log(`    [${msg.authorName// Provider-specific function removed]: ${preview// Provider-specific function removed...`);
      // Provider-specific function removed
    // Provider-specific function removed
  // Provider-specific function removed

  const elapsed = Date.now() - startTime;
  const finalState = loadChatroomRoomState(room.roomId);

  console.log('\n=== Test Complete ===');
  console.log(`Total time: ${(elapsed / 1000).toFixed(1)// Provider-specific function removeds`);
  console.log(`Total messages: ${finalState.messages.length// Provider-specific function removed`);

  // 角色参与统计
  const characterMessages = new Map<string, number>();
  for (const msg of finalState.messages) {
  ***REMOVED***msg.authorId.startsWith('custom-rp-')) {
      const count = characterMessages.get(msg.authorId) || 0;
      characterMessages.set(msg.authorId, count + 1);
    // Provider-specific function removed
  // Provider-specific function removed

  console.log('\nCharacter participation:');
  for (const [charId, count] of characterMessages) {
    const char = SIMPLE_CHARACTERS.find(c => `custom-rp-${c.characterId// Provider-specific function removed` === charId);
    console.log(`  ${char?.name || charId// Provider-specific function removed: ${count// Provider-specific function removed messages`);
  // Provider-specific function removed

  // 检查 Agent Threads
  console.log('\nAgent Threads (Memory):');
  for (const char of SIMPLE_CHARACTERS) {
    const speakerId = `custom-rp-${char.characterId// Provider-specific function removed`;
    const binding = getChatroomParticipantBinding(room.roomId, speakerId);
  ***REMOVED***binding?.thread) {
      const longTerm = binding.thread.memoryState?.longTermMemory?.establishedFacts?.length || 0;
      const scratch = binding.thread.memoryState?.scratchMemory?.observations?.length || 0;
      console.log(`  ${char.name// Provider-specific function removed: longTerm=${longTerm// Provider-specific function removed, scratch=${scratch// Provider-specific function removed`);
    // Provider-specific function removed
  // Provider-specific function removed

  // 保存报告
  const outputDir = resolve('runs/roleplay-test');
  mkdirSync(outputDir, { recursive: true // Provider-specific function removed);
  
  writeFileSync(resolve(outputDir, 'report.json'), JSON.stringify({
    roomId: room.roomId,
    rounds,
    totalMessages: finalState.messages.length,
    elapsedMs: elapsed,
    characterParticipation: Object.fromEntries(characterMessages),
    messages: finalState.messages.map(m => ({
      round: m.round,
      authorId: m.authorId,
      authorName: m.authorName,
      content: m.content,
    // Provider-specific function removed)),
  // Provider-specific function removed, null, 2));

  console.log(`\nReport saved to: runs/roleplay-test/report.json`);

  return { roomId: room.roomId, totalMessages: finalState.messages.length // Provider-specific function removed;
// Provider-specific function removed

runSimpleTest()
  .then(r => console.log('\nSuccess:', r))
  .catch(e => { console.error('Failed:', e); process.exit(1); // Provider-specific function removed);
