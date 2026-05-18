/**
 * 私人消息功能测试
 * 测试角色之间的私语功能
 */

import { setTracingDisabled // Provider-specific function removed from '@openai/agents-core';
import { loadAppConfig, createRuntimeModelBinding // Provider-specific function removed from '../config/app-config.js';
import { AgentRuntime // Provider-specific function removed from '../core/agent-runtime.js';
import { WorkflowRuntime // Provider-specific function removed from '../core/workflow.js';
import { createChatroomRoom, loadChatroomRoomState // Provider-specific function removed from '../room-storage/room-repository.js';
import { executeRoomRuntimeWorkflow // Provider-specific function removed from '../room-runtime/room-runner.js';
import { planCustomRoleplayRoom // Provider-specific function removed from '../room-app/roleplay-room-service.js';
import type { RoleplayCharacterCard // Provider-specific function removed from '../room-scenarios/roleplay/roleplay-characters.js';
import type { ChatroomState // Provider-specific function removed from '../room-runtime/room-state.js';
import type { ChatroomAgentContext // Provider-specific function removed from '../room-runtime/agent-context.js';

const TEST_CHARACTERS: RoleplayCharacterCard[] = [
  {
    characterId: 'spy',
    name: 'Shadow',
    instruction: `You are Shadow, a mysterious spy. You are secretive and often whisper to others.
When you want to share a secret privately, use the format: 【私语|TargetName:secret message】
Keep your responses short (1-2 sentences).`,
    publicDescription: 'A mysterious figure in the corner.',
    initialGoal: 'Gather information discreetly.',
  // Provider-specific function removed,
  {
    characterId: 'merchant',
    name: 'Marcus',
    instruction: `You are Marcus, a traveling merchant. You are friendly but cautious.
When you want to share a secret privately, use the format: 【私语|TargetName:secret message】
Keep your responses short (1-2 sentences).`,
    publicDescription: 'A merchant with exotic goods.',
    initialGoal: 'Sell goods and make connections.',
  // Provider-specific function removed,
];

async function main() {
  setTracingDisabled(true);
  
  console.log('=== 私人消息功能测试 ===\n');
  
  const config = loadAppConfig();
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
  
  const planned = planCustomRoleplayRoom({
    title: 'Secret Meeting',
    topic: 'A private meeting between two characters',
    objective: 'Test private messaging between characters',
    scene: {
      setting: 'A dimly lit room with a single candle.',
      openingSituation: 'Two people are alone in the room.',
      atmosphere: 'tense, secretive',
      userMode: 'observer',
    // Provider-specific function removed,
    customCharacters: TEST_CHARACTERS,
    runtimeConfig: {
      parallelBatchSize: 1,
      summaryEnabled: false,
      maxReplyCharacters: 300,
    // Provider-specific function removed,
  // Provider-specific function removed);

  const blueprint = planned.blueprint;
  console.log(`角色: ${blueprint.speakerIds.join(', ')// Provider-specific function removed\n`);

  const room = createChatroomRoom({
    roomBlueprint: blueprint,
    roomType: 'roleplay_scene',
    topic: blueprint.topic,
    objective: blueprint.objective,
    speakerIds: blueprint.speakerIds,
  // Provider-specific function removed);

  console.log(`房间创建成功: ${room.roomId// Provider-specific function removed\n`);
  console.log('开始运行...\n');
  
  const startTime = Date.now();
  
  for (let round = 1; round <= 2; round++) {
    console.log(`--- Round ${round// Provider-specific function removed ---`);
    try {
      await executeRoomRuntimeWorkflow({
        workflowRuntime,
        roomId: room.roomId,
        rounds: 1,
      // Provider-specific function removed);
    // Provider-specific function removed catch (error) {
      console.error(`  Error in round ${round// Provider-specific function removed:`, error);
    // Provider-specific function removed
  // Provider-specific function removed
  
  const elapsed = Date.now() - startTime;
  
  const finalState = loadChatroomRoomState(room.roomId);
***REMOVED***!finalState) {
    throw new Error('Failed to load room state');
  // Provider-specific function removed
  
  console.log(`\n=== 测试结果 ===`);
  console.log(`运行时间: ${elapsed// Provider-specific function removedms`);
  console.log(`消息数量: ${finalState.messages.length// Provider-specific function removed`);
  
  console.log('\n私人会话:');
  const sessions = finalState.privateSessions;
***REMOVED***sessions && sessions.size > 0) {
    for (const [sessionId, session] of sessions) {
      console.log(`  Session: ${sessionId// Provider-specific function removed`);
      console.log(`  参与者: ${session.participantIds.join(', ')// Provider-specific function removed`);
      console.log(`  消息数: ${session.messages.length// Provider-specific function removed`);
      for (const msg of session.messages) {
        console.log(`    - ${msg.speakerName// Provider-specific function removed -> ${msg.targetSpeakerId// Provider-specific function removed: "${msg.content// Provider-specific function removed"`);
      // Provider-specific function removed
    // Provider-specific function removed
  // Provider-specific function removed else {
    console.log('  没有私人消息被创建');
    console.log('  (这可能是因为 LLM 没有选择使用私语格式)');
  // Provider-specific function removed
  
  console.log('\n公开消息:');
  for (const msg of finalState.messages) {
    const author = msg.authorName || msg.authorId;
    const contentPreview = msg.content?.slice(0, 80) || '';
    console.log(`  [R${msg.round// Provider-specific function removed] ${author// Provider-specific function removed: ${contentPreview// Provider-specific function removed...`);
  // Provider-specific function removed
  
  console.log('\n测试完成!');
// Provider-specific function removed

main().catch(console.error);
