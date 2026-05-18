/**
 * Agent Turn Lifecycle 演示脚本
 * 
 * 测试 Observe → Judge → Act → Update 模式
 */

import { setTracingDisabled // Provider-specific function removed from '@openai/agents-core';
import { loadAppConfig, createRuntimeModelBinding // Provider-specific function removed from '../config/app-config.js';
import { AgentRuntime // Provider-specific function removed from '../core/agent-runtime.js';
import type { AgentProfile // Provider-specific function removed from '../core/agent-profile.js';
import type { ChatroomState // Provider-specific function removed from '../room-runtime/room-state.js';
import type { ChatroomAgentContext // Provider-specific function removed from '../room-runtime/agent-context.js';
import { planCustomRoleplayRoom // Provider-specific function removed from '../room-app/roleplay-room-service.js';
import { createChatroomRoom, loadChatroomRoomState // Provider-specific function removed from '../room-storage/room-repository.js';
import { executeLifecycleWorkflow // Provider-specific function removed from '../workflows/chatroom-lifecycle-runner.js';
import type { RoleplayCharacterCard // Provider-specific function removed from '../room-scenarios/roleplay/roleplay-characters.js';

const TEST_CHARACTERS: RoleplayCharacterCard[] = [
  {
    characterId: 'alice',
    name: 'Alice',
    instruction: `你是 Alice，一个安静的观察者。

你的性格：
- 话少，只在重要时刻发言
- 善于观察和思考
- 只在有人直接问你，或话题与你相关时才回应

大多数时候你会选择保持沉默，在心里默默观察。`,
    publicDescription: '一个安静的女子，总是在观察。',
    initialGoal: '观察并思考，只在必要时发言。',
  // Provider-specific function removed,
  {
    characterId: 'bob',
    name: 'Bob',
    instruction: `你是 Bob，一个健谈的社交者。

你的性格：
- 话多，喜欢参与讨论
- 对任何话题都有兴趣
- 经常主动发言

你会积极参与对话，很少保持沉默。`,
    publicDescription: '一个健谈的男子，喜欢社交。',
    initialGoal: '积极参与对话，分享想法。',
  // Provider-specific function removed,
  {
    characterId: 'charlie',
    name: 'Charlie',
    instruction: `你是 Charlie，一个只在被问到时才回答的人。

你的性格：
- 被动，只回应直接针对你的问题
- 对其他话题不感兴趣
- 回答简短直接

你只在有人叫你的名字或直接问你时才发言。`,
    publicDescription: '一个沉默的男子，只回答问题。',
    initialGoal: '等待别人直接问问题。',
  // Provider-specific function removed,
];

async function main() {
  setTracingDisabled(true);
  
  console.log('========================================');
  console.log('   Agent Turn Lifecycle 演示测试');
  console.log('========================================\n');
  
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

  console.log('【测试配置】');
  console.log(`  模型: ${config.provider.model// Provider-specific function removed`);
  console.log(`  角色: ${TEST_CHARACTERS.map(c => c.name).join(', ')// Provider-specific function removed`);
  console.log(`  执行模式: 串行 (Observe → Judge → Act → Update)`);
  console.log('');

  const planned = planCustomRoleplayRoom({
    title: 'Cafe Conversation',
    topic: '三个性格不同的人在咖啡馆',
    objective: '测试 Agent Turn Lifecycle',
    scene: {
      setting: '一个安静的咖啡馆，午后的阳光透过窗户。',
      openingSituation: 'Alice、Bob 和 Charlie 刚刚坐下。',
      atmosphere: '轻松、安静',
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
  const room = createChatroomRoom({
    roomBlueprint: blueprint,
    roomType: 'roleplay_scene',
    topic: blueprint.topic,
    objective: blueprint.objective,
    speakerIds: blueprint.speakerIds,
  // Provider-specific function removed);

  console.log(`房间 ID: ${room.roomId// Provider-specific function removed\n`);

  // 创建 speaker profiles
  const speakers: AgentProfile<ChatroomAgentContext, 'text'>[] = TEST_CHARACTERS.map(char => {
    const speakerId = `custom-rp-${char.characterId// Provider-specific function removed`;
    return {
      id: speakerId,
      name: char.name,
      description: char.instruction,
      instructions: char.instruction,
      outputType: 'text' as const,
      modelSettings: { temperature: 0.7 // Provider-specific function removed,
    // Provider-specific function removed;
  // Provider-specific function removed);

  // 加载初始状态
  let state = loadChatroomRoomState(room.roomId);
***REMOVED***!state) {
    console.error('无法加载房间状态');
    return;
  // Provider-specific function removed

  // 添加初始用户消息
  state.messages.push({
    id: 'init-1',
    role: 'user',
    authorId: 'narrator',
    authorName: '旁白',
    round: 0,
    createdAt: new Date().toISOString(),
    content: '阳光洒进咖啡馆，三个人坐在角落的桌子旁。Bob 看起来很想聊天。',
  // Provider-specific function removed);

  console.log('开始执行 Lifecycle 模式...\n');
  console.log('----------------------------------------');

  const startTime = Date.now();
  const rounds = 2;

  state = await executeLifecycleWorkflow({
    agentRuntime,
    state,
    startRound: 1,
    rounds,
    speakers,
    roomId: room.roomId,
    customCharacters: TEST_CHARACTERS,
    config: {
      mode: 'sequential',
      silenceThreshold: 0.3,
      enableInternalNotes: true,
    // Provider-specific function removed,
    onRoundComplete: (round, currentState) => {
      console.log(`\n[Round ${round// Provider-specific function removed 完成]`);
      console.log(`  公开消息: ${currentState.messages.length// Provider-specific function removed`);
    // Provider-specific function removed,
  // Provider-specific function removed);

  const elapsed = Date.now() - startTime;

  console.log('\n========================================');
  console.log('           测试结果报告');
  console.log('========================================\n');

  console.log('【基本统计】');
  console.log(`  总运行时间: ${(elapsed / 1000).toFixed(1)// Provider-specific function removed 秒`);
  console.log(`  公开消息数: ${state.messages.length// Provider-specific function removed`);
  const sessions = state.privateSessions;
  console.log(`  私人会话数: ${sessions?.size ?? 0// Provider-specific function removed`);
  console.log('');

  // 分析每个角色的发言情况
  console.log('【角色发言分析】');
  const speakerStats = new Map<string, { responded: number; silent: number // Provider-specific function removed>();
  
  for (const char of TEST_CHARACTERS) {
    const speakerId = `custom-rp-${char.characterId// Provider-specific function removed`;
    const msgCount = state.messages.filter(m => m.authorId === speakerId).length;
    speakerStats.set(char.name, { responded: msgCount, silent: rounds - msgCount // Provider-specific function removed);
    console.log(`  ${char.name// Provider-specific function removed:`);
    console.log(`    - 发言次数: ${msgCount// Provider-specific function removed`);
    console.log(`    - 沉默次数: ${rounds - msgCount// Provider-specific function removed`);
  // Provider-specific function removed
  console.log('');

  // 显示公开消息
  console.log('【公开消息记录】');
  for (const msg of state.messages) {
    const author = msg.authorName || msg.authorId;
    const contentPreview = msg.content?.slice(0, 60) || '';
    console.log(`  [R${msg.round// Provider-specific function removed] ${author// Provider-specific function removed: ${contentPreview// Provider-specific function removed...`);
  // Provider-specific function removed

  console.log('\n========================================');
  console.log('           测试结论');
  console.log('========================================\n');

  // 验证不同性格的行为差异
  const aliceStats = speakerStats.get('Alice');
  const bobStats = speakerStats.get('Bob');
  const charlieStats = speakerStats.get('Charlie');

***REMOVED***bobStats && aliceStats && bobStats.responded > aliceStats.responded) {
    console.log('✅ Bob (健谈) 比 Alice (安静) 发言更多');
  // Provider-specific function removed

***REMOVED***aliceStats && aliceStats.responded <= 1) {
    console.log('✅ Alice (安静) 大部分时间保持沉默');
  // Provider-specific function removed

***REMOVED***charlieStats && charlieStats.responded <= 1) {
    console.log('✅ Charlie (被动) 只在被问时发言');
  // Provider-specific function removed

  console.log('\nAgent Turn Lifecycle 功能验证完成！');
// Provider-specific function removed

main().catch(console.error);
