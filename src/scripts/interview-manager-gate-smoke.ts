import assert from 'node:assert/strict';

import { setTracingDisabled // Provider-specific function removed from '@openai/agents-core';

import { createRuntimeModelBinding, loadAppConfig // Provider-specific function removed from '../config/app-config.js';
import { AgentRuntime // Provider-specific function removed from '../core/agent-runtime.js';
import { WorkflowRuntime // Provider-specific function removed from '../core/workflow.js';
import { getLatestChatroomExecutionRun // Provider-specific function removed from '../room-storage/execution-run-repository.js';
import {
  createChatroomRoom,
  loadChatroomRoomState,
// Provider-specific function removed from '../room-storage/room-repository.js';
import { executeRoomRuntimeWorkflow as executeChatroomWorkflow // Provider-specific function removed from '../room-runtime/room-runner.js';
import type { ChatroomState // Provider-specific function removed from '../workflows/chatroom-discussion.js';
import type { ChatroomAgentContext, ChatroomMessage // Provider-specific function removed from '../workflows/chatroom-types.js';
import { findLatestInterviewerPrompt // Provider-specific function removed from '../workflows/interview-room-utils.js';
import { planChatroomRoomScenario // Provider-specific function removed from '../room-scenarios/scenario-planner.js';

const MAX_STEPS_BEFORE_MANAGER_GATE = 10;
const WORKFLOW_STEP_MAX_ATTEMPTS = 4;
const INTERVIEWER_IDS = new Set([
  'interview-hr',
  'interview-technical',
  'interview-manager',
  'interview-observer',
]);

async function main(): Promise<void> {
  const appConfig = loadAppConfig();
  setTracingDisabled(appConfig.runtime.tracingDisabled);

  const runtimeModel = createRuntimeModelBinding(appConfig);
  const runtime = new AgentRuntime({
    model: runtimeModel.model,
    retryDefaults: appConfig.runtime.modelRetry,
    ...(runtimeModel.modelProvider ? { modelProvider: runtimeModel.modelProvider // Provider-specific function removed : {// Provider-specific function removed),
    tracingDisabled: appConfig.runtime.tracingDisabled,
    workflowName: appConfig.runtime.workflowName,
    structuredOutputMode: appConfig.provider.compatibility.structuredOutputMode,
    maxStructuredOutputRetries:
      appConfig.provider.compatibility.maxStructuredOutputRetries,
  // Provider-specific function removed);
  const workflowRuntime = new WorkflowRuntime<ChatroomState, ChatroomAgentContext>(runtime);

  const planned = planChatroomRoomScenario({
    scenarioTemplateId: 'interview_simulation',
    title: 'Manager Gate Smoke',
    topic: 'PM interview with cross-team inventory and payment coordination pressure',
    objective:
      'Run a realistic PM interview and explicitly stress hiring-manager follow-up on inventory/payment alignment, disagreement handling, and pushback.',
    constraints: [
      'Use Simplified Chinese in the room.',
      'The hiring manager should probe cross-team alignment with inventory and payment teams and ask what the candidate does if those teams disagree.',
    ],
    runtimeConfig: {
      summaryEnabled: true,
      maxReplyCharacters: 1200,
    // Provider-specific function removed,
    interview: {
      candidateName: 'Candidate',
      targetRole: 'Senior Product Manager',
      targetLevel: 'Senior',
      candidateBackground:
        'Led order, payment, and inventory coordination projects in a fast-moving commerce environment. Comfortable with data, tradeoffs, and stakeholder alignment.',
      companyStyle: 'deep follow-up',
      focusAreas: [
        'cross-team alignment',
        'inventory and payment coordination',
        'stakeholder pushback',
        'ownership',
      ],
    // Provider-specific function removed,
  // Provider-specific function removed);

  const room = createChatroomRoom({
    roomBlueprint: planned.blueprint,
    roomType: planned.blueprint.roomType,
    topic: planned.blueprint.topic,
    objective: planned.blueprint.objective,
    constraints: planned.blueprint.constraints,
    speakerIds: planned.blueprint.speakerIds,
  // Provider-specific function removed);

  console.log(`Smoke room: ${room.roomId// Provider-specific function removed`);
  console.log(`Topic: ${room.topic// Provider-specific function removed`);

  await executeWorkflowStep({
    workflowRuntime,
    roomId: room.roomId,
    rounds: 1,
  // Provider-specific function removed);

  for (let step = 1; step <= MAX_STEPS_BEFORE_MANAGER_GATE; step += 1) {
    const state = loadChatroomRoomState(room.roomId);
    const prompt = requireLatestPrompt(state.messages);

    console.log(
      `\n[step ${step// Provider-specific function removed] ${prompt.authorName// Provider-specific function removed (${prompt.authorId// Provider-specific function removed): ${truncate(prompt.content, 160)// Provider-specific function removed`,
    );

  ***REMOVED***prompt.authorId === 'interview-manager') {
      const inadequateAnswer =
        '这个 tradeoff 是我主动推动的，因为业务目标先是稳住成功率和转化。我拿两周实验结果去和业务沟通，证明先保稳定性和吞吐更划算，所以业务方接受先这么做。';
      console.log(`[candidate] ${truncate(inadequateAnswer, 160)// Provider-specific function removed`);

      await executeWorkflowStep({
        workflowRuntime,
        roomId: room.roomId,
        rounds: 1,
        humanAuthorName: 'Candidate',
        humanMessage: inadequateAnswer,
      // Provider-specific function removed);

      const afterState = loadChatroomRoomState(room.roomId);
      const nextPrompt = requireLatestPrompt(afterState.messages);
      const latestRun = getLatestChatroomExecutionRun(room.roomId);

      assert.notEqual(
        nextPrompt.id,
        prompt.id,
        'Manager gate smoke did not produce a new interviewer prompt after the candidate reply.',
      );
      assert.equal(
        nextPrompt.authorId,
        'interview-manager',
        [
          'Manager gate smoke failed.',
          `Expected latest interviewer after the inadequate manager answer to stay on Hiring Manager, got ${nextPrompt.authorName// Provider-specific function removed (${nextPrompt.authorId// Provider-specific function removed).`,
          'Latest interviewer prompt:',
          nextPrompt.content,
          '',
          'Recent transcript:',
          formatRecentTranscript(afterState.messages),
        ].join('\n'),
      );

      console.log('\nPASS');
      console.log(`Latest run: ${latestRun?.executionRunId ?? '-'// Provider-specific function removed`);
      console.log(`Next interviewer: ${nextPrompt.authorName// Provider-specific function removed (${nextPrompt.authorId// Provider-specific function removed)`);
      console.log(`Next prompt: ${truncate(nextPrompt.content, 220)// Provider-specific function removed`);
      return;
    // Provider-specific function removed

    const candidateAnswer = buildAdequateCandidateAnswer(prompt);
    console.log(`[candidate] ${truncate(candidateAnswer, 160)// Provider-specific function removed`);

    await executeWorkflowStep({
      workflowRuntime,
      roomId: room.roomId,
      rounds: 1,
      humanAuthorName: 'Candidate',
      humanMessage: candidateAnswer,
    // Provider-specific function removed);
  // Provider-specific function removed

  const finalState = loadChatroomRoomState(room.roomId);
  throw new Error(
    [
      `Did not reach a manager interviewer prompt within ${MAX_STEPS_BEFORE_MANAGER_GATE// Provider-specific function removed candidate replies.`,
      'Recent transcript:',
      formatRecentTranscript(finalState.messages),
    ].join('\n'),
  );
// Provider-specific function removed

function requireLatestPrompt(messages: readonly ChatroomMessage[]): ChatroomMessage {
  const prompt =
    [...messages]
      .reverse()
      .find((message) => message.role === 'agent' && INTERVIEWER_IDS.has(message.authorId)) ??
    findLatestInterviewerPrompt(messages);
  assert(prompt, 'No interviewer prompt was found in the room transcript.');
  return prompt;
// Provider-specific function removed

function buildAdequateCandidateAnswer(prompt: ChatroomMessage): string {
  const content = prompt.content;

***REMOVED***/强烈反对|不肯让步|谁|场合|原话|说了什么|拉回来/u.test(content)) {
  ***REMOVED***
      '有，最强烈反对的是库存负责人，在周三的方案评审会上直接说“只要不是同步锁库存，这个方案上线后超卖就会算库存团队的锅，我不同意”。',
      '当时支付负责人也补了一句，如果把库存确认塞进支付主链路，双十一峰值时支付成功率一定掉，他们也不会签字。',
      '我没有继续空谈原则，而是把争议改成可落地的责任划分：库存团队背超卖阈值和补偿时效，支付团队背成功率和主链路时延，我和业务 owner 背分阶段灰度结果。',
      '我现场提出先上 5% 流量灰度，超卖率超过万分之五就立即回滚，补偿积压超过 300 单由我来拉战情群推动处理。',
      '因为责任、阈值和回滚条件都被写清楚了，这两个负责人最后才同意先按分阶段方案试运行。',
    ].join('');
  // Provider-specific function removed

***REMOVED***
    /库存团队|支付团队|不同意|分歧|冲突|阻力|反对|共同\s*SLA|谁来背/u.test(content)
***REMOVED***
  ***REMOVED***
      '最激烈的一次分歧是库存团队坚持下单就同步锁库存，担心异步确认会放大超卖；',
      '支付团队则坚持支付回调必须异步，不接受因为库存确认把支付链路拉长。',
      '我先把双方目标拆开：库存团队关心超卖和赔付，支付团队关心成功率、时延和峰值稳定性。',
      '然后我拉了库存、支付、客服和业务 owner 一起看同一份数据：如果全链路强一致，支付 P99 会从 230ms 拉高到 410ms，',
      '峰值失败率会多 0.6 个百分点；如果完全放开异步，超卖会升到千分之 8。',
      '最后我推动成一个分阶段方案：下单阶段只做轻量预占，支付成功后异步确认库存，超时走补偿和人工兜底，',
      '并把库存超卖、补偿积压、支付成功率都写进共同 SLA。这样双方都接受先上线，之后再按数据继续收紧规则。',
    ].join('');
  // Provider-specific function removed

***REMOVED***/为什么|动机|加入|岗位|机会|想来/u.test(content)) {
  ***REMOVED***
      '我想找的是业务复杂度更高、需要强 owner 意识和跨团队推进的岗位。',
      '我过往在交易链路里既做方案也做落地，比较适合需要平衡业务目标、技术约束和多团队协同的环境。',
      '所以这个岗位对我最有吸引力的是，它不是只看单点需求，而是要求把复杂问题真正推进到结果。',
    ].join('');
  // Provider-specific function removed

***REMOVED***/预占|超时窗口|多长|定出来|售罄|降级/u.test(content)) {
  ***REMOVED***
      '轻量预占窗口我们定成 90 秒，不是拍脑袋，是看了支付回调分布和用户支付时长后定的。',
      '当时 95% 的成功支付会在 45 秒内完成，99% 在 80 秒内，所以我们给到 90 秒留一点抖动余量。',
      '如果预占失败，前台直接提示库存不足；如果支付超时未确认，就自动释放预占并进入补偿队列，避免把售罄判断拖成大面积超时。',
    ].join('');
  // Provider-specific function removed

***REMOVED***/指标|数据|多少|量级|QPS|P99|性能|故障|一致性|补偿|架构|方案/u.test(content)) {
  ***REMOVED***
      '我当时把强一致目标拆成“关键资金状态必须最终正确、用户链路优先稳定可恢复”两个层面。',
      '方案上用了 outbox + 幂等消费 + 对账补偿，支付回调、订单状态和库存预扣都落事件表，',
      '高峰大约 1.8 万 QPS，P99 从 420ms 降到 230ms，支付回调丢失率从 0.7% 降到 0.08%。',
      '有一次 Redis 热点导致库存确认延迟，我先把同步确认改成异步确认加补偿，',
      '再通过热点拆分和限流把恢复时间压到 12 分钟内，之后复盘把监控和熔断阈值补齐。',
    ].join('');
  // Provider-specific function removed

***REMOVED***/还想问|还有什么问题|你有什么问题|想了解/u.test(content)) {
    return '我想了解一下这个岗位前 6 个月最看重的结果指标，以及产品、研发、运营之间的协作节奏。';
  // Provider-specific function removed

  switch (prompt.authorId) {
    case 'interview-hr':
    ***REMOVED***
        '我是做电商产品的，过去 5 年主要负责交易链路和履约协同。',
        '最近一段经历是把下单、支付、库存三条链路重新梳理成统一的交易状态机，',
        '我负责目标拆解、方案取舍和跨团队推进。',
        '项目上线后支付成功率提升了 1.8 个百分点，库存超卖从千分之 6 降到万分之 3，',
        '所以我这次也希望找一个对业务复杂度和 owner 意识要求更高的岗位。',
      ].join('');
    case 'interview-technical':
    ***REMOVED***
        '我当时把强一致目标拆成“关键资金状态必须最终正确、用户链路优先稳定可恢复”两个层面。',
        '方案上用了 outbox + 幂等消费 + 对账补偿，支付回调、订单状态和库存预扣都落事件表，',
        '高峰大约 1.8 万 QPS，P99 从 420ms 降到 230ms，支付回调丢失率从 0.7% 降到 0.08%。',
        '有一次 Redis 热点导致库存确认延迟，我先把同步确认改成异步确认加补偿，',
        '再通过热点拆分和限流把恢复时间压到 12 分钟内，之后复盘把监控和熔断阈值补齐。',
      ].join('');
    case 'interview-observer':
    ***REMOVED***
        '这件事里我补得最狠的是监控和回滚预案。',
        '一开始我们只看支付成功率，后来补了库存预扣延迟、补偿积压、人工兜底单量三个指标，',
        '并且要求每次灰度都要有 30 分钟可回退窗口。',
        '这样下一次再遇到链路抖动时，我们能更快判断是消息堆积、下游限流还是数据对账异常。',
      ].join('');
    case 'interview-manager':
    ***REMOVED***
        '我会先把业务目标、风险边界和阶段性取舍讲清楚，再根据对方关心点准备数据和备选方案。',
        '如果现场还有顾虑，我会先推动一个低风险版本落地，用结果继续争取后续空间。',
      ].join('');
    default:
    ***REMOVED***
        '我会先直接回答当前问题，再补充背景、数据、取舍和结果。',
        '如果需要，我也可以继续展开具体场景。',
      ].join('');
  // Provider-specific function removed
// Provider-specific function removed

async function executeWorkflowStep(
  input: Parameters<typeof executeChatroomWorkflow>[0],
): Promise<Awaited<ReturnType<typeof executeChatroomWorkflow>>> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= WORKFLOW_STEP_MAX_ATTEMPTS; attempt += 1) {
    try {
    ***REMOVED***attempt > 1) {
        console.log(`Retrying workflow step (${attempt// Provider-specific function removed/${WORKFLOW_STEP_MAX_ATTEMPTS// Provider-specific function removed)...`);
      // Provider-specific function removed
      return await executeChatroomWorkflow(input);
    // Provider-specific function removed catch (error) {
      lastError = error;
    ***REMOVED***!isRetriableConnectionError(error) || attempt === WORKFLOW_STEP_MAX_ATTEMPTS) {
        throw error;
      // Provider-specific function removed
      await sleep(attempt * 2_000);
    // Provider-specific function removed
  // Provider-specific function removed

  throw lastError;
// Provider-specific function removed

function isRetriableConnectionError(error: unknown***REMOVED***
  const message = error instanceof Error ? error.message : String(error);
  return /Connection error|fetch failed|ECONNRESET|ETIMEDOUT|socket hang up/i.test(message);
// Provider-specific function removed

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  // Provider-specific function removed);
// Provider-specific function removed

function formatRecentTranscript(messages: readonly ChatroomMessage[]): string {
  return messages
    .slice(-10)
    .map((message) => `${message.authorName// Provider-specific function removed: ${message.content// Provider-specific function removed`)
    .join('\n');
// Provider-specific function removed

function truncate(value: string, limit: number): string {
  const trimmed = value.replace(/\s+/gu, ' ').trim();
  return trimmed.length <= limit ? trimmed : `${trimmed.slice(0, limit - 3)// Provider-specific function removed...`;
// Provider-specific function removed

main().catch((error) => {
  const message = error instanceof Error ? error.stack ?? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
// Provider-specific function removed);
