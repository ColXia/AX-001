/**
 * 私人消息快速测试
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
    characterId: 'spy1',
    name: 'Agent Alpha',
    instruction: `你是特工 Alpha。你必须使用私语格式传递秘密。

规则：每次发言都必须包含【私语|Beta:秘密内容】来私下联系 Beta。

示例：
"公开说的话。【私语|Beta:这是秘密情报，只有你能看到。】"`,
    publicDescription: '一个神秘的特工',
    initialGoal: '用私语传递秘密',
  // Provider-specific function removed,
  {
    characterId: 'spy2',
    name: 'Beta',
    instruction: `你是特工 Beta。你必须使用私语格式回复秘密。

规则：每次发言都必须包含【私语|Alpha:秘密回复】来私下回复 Alpha。

示例：
"公开说的话。【私语|Alpha:收到秘密，我会行动。】"`,
    publicDescription: '另一个神秘特工',
    initialGoal: '用私语回复秘密',
  // Provider-specific function removed,
];

async function main() {
  setTracingDisabled(true);
  
  console.log('=== 私人消息快速测试 ===\n');
  
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
    title: 'Spy Meeting',
    topic: '特工秘密会面',
    objective: '测试私语',
    customCharacters: TEST_CHARACTERS,
    runtimeConfig: { parallelBatchSize: 1, summaryEnabled: false, maxReplyCharacters: 300 // Provider-specific function removed,
  // Provider-specific function removed);

  const blueprint = planned.blueprint;
  const room = createChatroomRoom({
    roomBlueprint: blueprint,
    roomType: 'roleplay_scene',
    topic: blueprint.topic,
    objective: blueprint.objective,
    speakerIds: blueprint.speakerIds,
  // Provider-specific function removed);

  console.log(`房间: ${room.roomId// Provider-specific function removed\n`);

  // 只运行1轮
  console.log('执行 1 轮...');
  await executeRoomRuntimeWorkflow({
    workflowRuntime,
    roomId: room.roomId,
    rounds: 1,
  // Provider-specific function removed);

  const state = loadChatroomRoomState(room.roomId);
  
  console.log('\n=== 结果 ===');
  console.log(`公开消息: ${state?.messages.length ?? 0// Provider-specific function removed`);
  const sessions = state?.privateSessions;
  console.log(`私人会话: ${sessions?.size ?? 0// Provider-specific function removed`);
  
***REMOVED***sessions) {
    for (const [id, session] of sessions) {
      console.log(`\n会话: ${id// Provider-specific function removed`);
      for (const msg of session.messages) {
        console.log(`  ${msg.speakerName// Provider-specific function removed -> ${msg.targetSpeakerId// Provider-specific function removed: "${msg.content// Provider-specific function removed"`);
      // Provider-specific function removed
    // Provider-specific function removed
  // Provider-specific function removed
  
  console.log('\n公开消息内容:');
  for (const msg of state?.messages ?? []) {
  ***REMOVED***!msg.authorName?.includes('主持')) {
      console.log(`  ${msg.authorName// Provider-specific function removed: ${msg.content?.slice(0, 100)// Provider-specific function removed...`);
    // Provider-specific function removed
  // Provider-specific function removed
// Provider-specific function removed

main().catch(console.error);
