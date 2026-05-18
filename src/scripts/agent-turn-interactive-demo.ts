/**
 * Agent Turn Lifecycle 互动测试
 * 
 * 测试角色之间的互动和回应行为
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
    characterId: 'talker',
    name: '小明',
    instruction: `你是小明，一个非常健谈的人。

性格：
- 非常喜欢聊天，几乎任何话题都想参与
- 看到别人说话就想回应
- 紧迫度通常在 0.7-1.0

你几乎总是选择 respond，很少保持沉默。`,
    publicDescription: '一个健谈的人',
    initialGoal: '积极参与对话',
  // Provider-specific function removed,
  {
    characterId: 'shy',
    name: '小红',
    instruction: `你是小红，一个害羞的人。

性格：
- 只在有人直接叫你的名字时才回应
- 其他时候保持沉默
- 紧迫度通常在 0.1-0.3，除非被直接点名

你大部分时间选择 stay_silent。`,
    publicDescription: '一个害羞的人',
    initialGoal: '等待被点名',
  // Provider-specific function removed,
];

async function main() {
  setTracingDisabled(true);
  
  console.log('========================================');
  console.log('   Agent Turn Lifecycle 互动测试');
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
  console.log(`  角色: 小明 (健谈), 小红 (害羞)`);
  console.log('');

  const planned = planCustomRoleplayRoom({
    title: 'Chat Room',
    topic: '聊天室',
    objective: '测试互动行为',
    customCharacters: TEST_CHARACTERS,
    runtimeConfig: {
      parallelBatchSize: 1,
      summaryEnabled: false,
      maxReplyCharacters: 200,
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

  // 创建 speaker profiles
  const speakers: AgentProfile<ChatroomAgentContext, 'text'>[] = TEST_CHARACTERS.map(char => ({
    id: `custom-rp-${char.characterId// Provider-specific function removed`,
    name: char.name,
    description: char.instruction,
    instructions: char.instruction,
    outputType: 'text' as const,
    modelSettings: { temperature: 0.7 // Provider-specific function removed,
  // Provider-specific function removed));

  let state = loadChatroomRoomState(room.roomId);
***REMOVED***!state) {
    console.error('无法加载房间状态');
    return;
  // Provider-specific function removed

  // 场景 1: 旁白开场
  state.messages.push({
    id: 'scene-1',
    role: 'user',
    authorId: 'narrator',
    authorName: '旁白',
    round: 0,
    createdAt: new Date().toISOString(),
    content: '小明和小红坐在咖啡馆里。',
  // Provider-specific function removed);

  console.log('【场景 1】旁白开场');
  console.log('  旁白: 小明和小红坐在咖啡馆里。\n');

  state = await executeLifecycleWorkflow({
    agentRuntime,
    state,
    startRound: 1,
    rounds: 1,
    speakers,
    roomId: room.roomId,
    customCharacters: TEST_CHARACTERS,
  // Provider-specific function removed);

  // 显示结果
  console.log('【Round 1 结果】');
  for (const msg of state.messages.filter(m => m.round === 1)) {
    console.log(`  ${msg.authorName// Provider-specific function removed: ${msg.content?.slice(0, 80)// Provider-specific function removed...`);
  // Provider-specific function removed

  // 场景 2: 有人直接叫小红
  state.messages.push({
    id: 'scene-2',
    role: 'user',
    authorId: 'narrator',
    authorName: '旁白',
    round: 1,
    createdAt: new Date().toISOString(),
    content: '小明转向小红，问道："小红，你觉得今天天气怎么样？"',
  // Provider-specific function removed);

  console.log('\n【场景 2】小明直接问小红');
  console.log('  旁白: 小明转向小红，问道："小红，你觉得今天天气怎么样？"\n');

  state = await executeLifecycleWorkflow({
    agentRuntime,
    state,
    startRound: 2,
    rounds: 1,
    speakers,
    roomId: room.roomId,
    customCharacters: TEST_CHARACTERS,
  // Provider-specific function removed);

  console.log('【Round 2 结果】');
  for (const msg of state.messages.filter(m => m.round === 2)) {
    console.log(`  ${msg.authorName// Provider-specific function removed: ${msg.content?.slice(0, 80)// Provider-specific function removed...`);
  // Provider-specific function removed

  console.log('\n========================================');
  console.log('           测试结论');
  console.log('========================================\n');

  const xiaomingMessages = state.messages.filter(m => m.authorId === 'custom-rp-talker').length;
  const xiaohongMessages = state.messages.filter(m => m.authorId === 'custom-rp-shy').length;

  console.log(`小明发言次数: ${xiaomingMessages// Provider-specific function removed`);
  console.log(`小红发言次数: ${xiaohongMessages// Provider-specific function removed`);

***REMOVED***xiaomingMessages > xiaohongMessages) {
    console.log('\n✅ 小明 (健谈) 比小红 (害羞) 发言更多');
  // Provider-specific function removed

  console.log('\nAgent Turn Lifecycle 功能验证完成！');
// Provider-specific function removed

main().catch(console.error);
