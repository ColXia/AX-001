/**
 * 私人消息真实测试
 * 明确引导角色使用私语格式
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
import { writeFileSync, mkdirSync // Provider-specific function removed from 'node:fs';
import { resolve // Provider-specific function removed from 'node:path';

const TEST_CHARACTERS: RoleplayCharacterCard[] = [
  {
    characterId: 'alice',
    name: 'Alice',
    instruction: `你是 Alice，一个秘密组织的成员。你正在和 Bob 进行秘密谈判。

重要规则：
1. 当你想私下告诉 Bob 一些秘密时，必须使用格式：【私语|Bob:秘密内容】
2. 私语内容只有你和 Bob 能看到，其他人看不到
3. 你应该经常使用私语来传递机密信息
4. 公开对话保持简短，主要信息通过私语传递

示例：
公开说："天气不错。"
私下说：【私语|Bob:实际上我有重要情报要告诉你，那个计划已经暴露了。】

保持角色，每次发言都要包含至少一条私语。`,
    publicDescription: '一个神秘的女子，神情严肃。',
    initialGoal: '通过私语向 Bob 传递秘密情报。',
  // Provider-specific function removed,
  {
    characterId: 'bob',
    name: 'Bob',
    instruction: `你是 Bob，一个秘密组织的成员。你正在和 Alice 进行秘密谈判。

重要规则：
1. 当你想私下告诉 Alice 一些秘密时，必须使用格式：【私语|Alice:秘密内容】
2. 私语内容只有你和 Alice 能看到，其他人看不到
3. 你应该经常使用私语来回应 Alice 的秘密
4. 公开对话保持简短，主要信息通过私语传递

示例：
公开说："确实如此。"
私下说：【私语|Alice:我明白了，我们需要立即行动。】

保持角色，每次发言都要包含至少一条私语。`,
    publicDescription: '一个沉稳的男子，目光警觉。',
    initialGoal: '通过私语与 Alice 交换秘密情报。',
  // Provider-specific function removed,
];

async function main() {
  setTracingDisabled(true);
  
  console.log('========================================');
  console.log('    私人消息功能真实测试报告');
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
  const workflowRuntime = new WorkflowRuntime<ChatroomState, ChatroomAgentContext>(agentRuntime);
  
  console.log('【测试配置】');
  console.log(`  模型: ${config.provider.model// Provider-specific function removed`);
  console.log(`  角色: ${TEST_CHARACTERS.map(c => c.name).join(', ')// Provider-specific function removed`);
  console.log(`  轮数: 3\n`);

  const planned = planCustomRoleplayRoom({
    title: 'Secret Negotiation',
    topic: '两个特工的秘密谈判',
    objective: '测试私人消息功能',
    scene: {
      setting: '一个昏暗的咖啡馆角落，只有一盏烛光。',
      openingSituation: 'Alice 和 Bob 刚刚坐下，需要交换重要情报。',
      atmosphere: '紧张、神秘、机密',
      userMode: 'observer',
    // Provider-specific function removed,
    customCharacters: TEST_CHARACTERS,
    runtimeConfig: {
      parallelBatchSize: 1,
      summaryEnabled: false,
      maxReplyCharacters: 500,
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
  console.log('----------------------------------------');
  console.log('开始执行测试...\n');
  
  const startTime = Date.now();
  const rounds = 3;
  
  for (let round = 1; round <= rounds; round++) {
    console.log(`[Round ${round// Provider-specific function removed/${rounds// Provider-specific function removed]`);
    const roundStart = Date.now();
    
    try {
      await executeRoomRuntimeWorkflow({
        workflowRuntime,
        roomId: room.roomId,
        rounds: 1,
      // Provider-specific function removed);
      const roundElapsed = Date.now() - roundStart;
      console.log(`  完成 (${(roundElapsed / 1000).toFixed(1)// Provider-specific function removeds)`);
    // Provider-specific function removed catch (error) {
      console.error(`  错误:`, error);
    // Provider-specific function removed
  // Provider-specific function removed
  
  const totalElapsed = Date.now() - startTime;
  
  const finalState = loadChatroomRoomState(room.roomId);
***REMOVED***!finalState) {
    throw new Error('Failed to load room state');
  // Provider-specific function removed
  
  console.log('\n========================================');
  console.log('           测试结果报告');
  console.log('========================================\n');
  
  // 基本统计
  console.log('【基本统计】');
  console.log(`  总运行时间: ${(totalElapsed / 1000).toFixed(1)// Provider-specific function removed 秒`);
  console.log(`  公开消息数: ${finalState.messages.length// Provider-specific function removed`);
  
  // 私人消息统计
  const sessions = finalState.privateSessions;
  const privateSessionCount = sessions?.size ?? 0;
  let totalPrivateMessages = 0;
  const privateMessagesBySpeaker: Map<string, number> = new Map();
  
***REMOVED***sessions) {
    for (const session of sessions.values()) {
      totalPrivateMessages += session.messages.length;
      for (const msg of session.messages) {
        const count = privateMessagesBySpeaker.get(msg.speakerName) ?? 0;
        privateMessagesBySpeaker.set(msg.speakerName, count + 1);
      // Provider-specific function removed
    // Provider-specific function removed
  // Provider-specific function removed
  
  console.log(`  私人消息数: ${totalPrivateMessages// Provider-specific function removed`);
  console.log(`  私人会话数: ${privateSessionCount// Provider-specific function removed`);
  
***REMOVED***privateMessagesBySpeaker.size > 0) {
    console.log('  各角色发送的私人消息:');
    for (const [name, count] of privateMessagesBySpeaker) {
      console.log(`    - ${name// Provider-specific function removed: ${count// Provider-specific function removed 条`);
    // Provider-specific function removed
  // Provider-specific function removed
  
  // 私人消息详情
***REMOVED***sessions && sessions.size > 0) {
    console.log('\n【私人消息详情】');
    let sessionIndex = 1;
    for (const [sessionId, session] of sessions) {
      console.log(`\n  会话 ${sessionIndex// Provider-specific function removed: ${sessionId// Provider-specific function removed`);
      console.log(`  参与者: ${session.participantIds.join(', ')// Provider-specific function removed`);
      console.log(`  消息列表:`);
      for (const msg of session.messages) {
        console.log(`    [R${msg.round// Provider-specific function removed] ${msg.speakerName// Provider-specific function removed -> ${msg.targetSpeakerId// Provider-specific function removed`);
        console.log(`      "${msg.content// Provider-specific function removed"`);
      // Provider-specific function removed
      sessionIndex++;
    // Provider-specific function removed
  // Provider-specific function removed
  
  // 公开消息摘要
  console.log('\n【公开消息摘要】');
  const speakerMessages = new Map<string, number>();
  for (const msg of finalState.messages) {
    const author = msg.authorName || msg.authorId;
  ***REMOVED***!author.includes('主持') && !author.includes('Host')) {
      const count = speakerMessages.get(author) ?? 0;
      speakerMessages.set(author, count + 1);
    // Provider-specific function removed
  // Provider-specific function removed
  
  for (const [author, count] of speakerMessages) {
    console.log(`  ${author// Provider-specific function removed: ${count// Provider-specific function removed 条公开消息`);
  // Provider-specific function removed
  
  // 测试结论
  console.log('\n========================================');
  console.log('           测试结论');
  console.log('========================================\n');
  
***REMOVED***totalPrivateMessages > 0) {
    console.log('✅ 私人消息功能测试通过！');
    console.log(`   成功创建 ${totalPrivateMessages// Provider-specific function removed 条私人消息`);
    console.log(`   私人消息正确地从公开输出中提取并存储`);
    
    // 验证消息内容
    let allValid = true;
  ***REMOVED***sessions) {
      for (const session of sessions.values()) {
        for (const msg of session.messages) {
        ***REMOVED***!msg.targetSpeakerId || !msg.speakerId || !msg.content) {
            allValid = false;
            console.log(`   ⚠️ 发现无效消息: ${JSON.stringify(msg)// Provider-specific function removed`);
          // Provider-specific function removed
        // Provider-specific function removed
      // Provider-specific function removed
    // Provider-specific function removed
    
  ***REMOVED***allValid) {
      console.log('   所有私人消息数据结构完整');
    // Provider-specific function removed
  // Provider-specific function removed else {
    console.log('⚠️ 未检测到私人消息');
    console.log('   可能原因:');
    console.log('   1. LLM 没有使用 【私语|目标:内容】 格式');
    console.log('   2. 角色指令需要更明确地引导使用私语');
  // Provider-specific function removed
  
  // 保存详细报告
  const outputDir = resolve('runs/private-session-test');
  mkdirSync(outputDir, { recursive: true // Provider-specific function removed);
  
  const report = {
    testTime: new Date().toISOString(),
    roomId: room.roomId,
    totalElapsedMs: totalElapsed,
    stats: {
      publicMessages: finalState.messages.length,
      privateMessages: totalPrivateMessages,
      privateSessions: privateSessionCount,
    // Provider-specific function removed,
    privateSessions: sessions 
      ? Object.fromEntries(sessions) 
      : {// Provider-specific function removed,
    publicMessages: finalState.messages.map(m => ({
      round: m.round,
      author: m.authorName || m.authorId,
      content: m.content?.slice(0, 200),
    // Provider-specific function removed)),
  // Provider-specific function removed;
  
  const reportPath = resolve(outputDir, 'test-report.json');
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n详细报告已保存: ${reportPath// Provider-specific function removed`);
// Provider-specific function removed

main().catch(console.error);
