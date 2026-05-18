import type { InterviewSummary // Provider-specific function removed from '../agents/schemas.js';
import type { AgentProfile // Provider-specific function removed from '../core/agent-profile.js';
import { AgentRuntime // Provider-specific function removed from '../core/agent-runtime.js';
import { WorkflowRuntime // Provider-specific function removed from '../core/workflow.js';
import type { ChatroomState // Provider-specific function removed from '../workflows/chatroom-discussion.js';
import { listChatroomAgentTurns // Provider-specific function removed from '../room-storage/agent-thread-repository.js';
import {
  getLatestChatroomExecutionRun,
  listChatroomExecutionRuns,
// Provider-specific function removed from '../room-storage/execution-run-repository.js';
import {
  createChatroomRoom,
  loadChatroomRoomState,
// Provider-specific function removed from '../room-storage/room-repository.js';
import { executeRoomRuntimeWorkflow as executeChatroomWorkflow // Provider-specific function removed from '../room-runtime/room-runner.js';
import type { ChatroomAgentContext, ChatroomMessage // Provider-specific function removed from '../workflows/chatroom-types.js';
import { planChatroomRoomScenario // Provider-specific function removed from '../room-scenarios/scenario-planner.js';

const INTERVIEWER_IDS = new Set([
  'interview-hr',
  'interview-technical',
  'interview-manager',
  'interview-observer',
]);

const INTERVIEW_PROMPTER_IDS = new Set([
  ...INTERVIEWER_IDS,
  'chatroom-host',
]);

const WORKFLOW_STEP_MAX_ATTEMPTS = 4;
const MAX_INTERVIEW_CANDIDATE_TURNS = 10;
const PRESSURE_CANDIDATE_MAX_CONTEXT_MESSAGES = 8;

const pressureInterviewCandidateProfile: AgentProfile<object, 'text'> = {
  id: 'pressure-interview-candidate',
  name: 'Pressure Interview Candidate',
  description: 'Simulates one realistic interview candidate for stress and workflow validation.',
  instructions: [
    '你现在扮演一次真实模拟面试中的候选人。',
    '候选人背景固定：6 年电商产品经验，最近两年主导交易链路、支付、库存、补偿协同；核心项目是把下单、支付、库存、补偿重构成统一交易状态机。',
    '候选人曾推动异步库存确认、outbox、幂等消费、对账补偿、灰度发布；典型指标包括支付成功率提升、超卖下降、补偿处理时长下降。',
    '请严格围绕“最新面试问题”直接作答，不要写元话术，不要复述“我会先回答”之类的框架句。',
    '如果面试官指出你重复或回避，你必须显式改正并直接回答新问题。',
    '如果问题要求动机、取舍、判断依据或个人驱动力，就回答“为什么这样做”；如果问题要求数据、口径、阈值或团队分歧，就给出具体数字和角色。',
    '允许合理补充一致的项目细节，但必须与既有对话保持一致。',
    '统一使用简体中文，控制在 4-6 句、900 字以内，像真实候选人回答，不要列 markdown 清单。',
  ].join(' '),
  outputType: 'text',
  modelSettings: {
    temperature: 0.3,
  // Provider-specific function removed,
// Provider-specific function removed;

export interface InterviewPressureScenarioExtra {
  finalSummaryPresent: boolean;
  interviewStatus: InterviewSummary['interviewStatus'] | null;
  currentStage: string | null;
  interviewReadiness: InterviewSummary['interviewReadiness'] | null;
  overallScore: number | null;
  interviewerStagesSeen: string[];
  competencyDimensions: Array<{
    dimension: string;
    score: number;
  // Provider-specific function removed>;
// Provider-specific function removed

export interface InterviewPressureScenarioResult {
  label: 'complex_interview_room';
  roomId: string;
  scenarioTemplateId: string | undefined;
  speakerCount: number;
  workflowRunCount: number;
  completedRunCount: number;
  failedRunCount: number;
  agentTurnCount: number;
  messageCount: number;
  wallTimeMs: number;
  averageWallMsPerAgentTurn: number;
  connectionRetryCount: number;
  latestRunStatus: string | undefined;
  latestArtifactDirectory: string | undefined;
  extra: InterviewPressureScenarioExtra;
// Provider-specific function removed

export async function runInterviewPressureScenario(args: {
  workflowRuntime: WorkflowRuntime<ChatroomState, ChatroomAgentContext>;
  agentRuntime: AgentRuntime;
// Provider-specific function removed): Promise<InterviewPressureScenarioResult> {
  const planned = planChatroomRoomScenario({
    scenarioTemplateId: 'interview_simulation',
    title: 'Interview Pressure Room',
    topic: 'Senior product interview on inventory, payment, rollback, and cross-team pushback',
    objective:
      'Run a realistic, high-pressure product interview with deep follow-up on data validation, disagreement handling, rollback thresholds, and final fit evaluation.',
    constraints: [
      'Use Simplified Chinese in the room.',
      'Keep the interview realistic and evidence-driven.',
      'Push for concrete numbers, named stakeholders, and rollout thresholds.',
    ],
    runtimeConfig: {
      summaryEnabled: true,
      maxReplyCharacters: 1000,
    // Provider-specific function removed,
    interview: {
      candidateName: 'Candidate',
      targetRole: 'Senior Product Manager',
      targetLevel: 'Senior',
      candidateBackground:
        'Led order, payment, inventory, and fulfillment coordination in a large commerce platform.',
      companyStyle: 'deep follow-up',
      focusAreas: [
        'cross-team alignment',
        'data source validation',
        'rollback threshold judgment',
        'ownership under disagreement',
        'candidate motivation',
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

  console.log(`\n[interview] room=${room.roomId// Provider-specific function removed`);
  const startedAt = Date.now();
  let workflowRunCount = 0;
  let connectionRetryCount = 0;

  connectionRetryCount += await executeWorkflowStep(
    {
      workflowRuntime: args.workflowRuntime,
      roomId: room.roomId,
      rounds: 1,
    // Provider-specific function removed,
    'interview:opening',
  );
  workflowRunCount += 1;

  for (let turn = 1; turn <= MAX_INTERVIEW_CANDIDATE_TURNS; turn += 1) {
    const state = loadChatroomRoomState(room.roomId);
  ***REMOVED***isCompletedInterviewSummary(state.finalSummary)) {
      break;
    // Provider-specific function removed

    const prompt = requireLatestInterviewPrompt(state.messages);
    const answer = await generateInterviewCandidateAnswer({
      agentRuntime: args.agentRuntime,
      state,
      prompt,
      turn,
    // Provider-specific function removed);

    console.log(
      `[interview turn ${turn// Provider-specific function removed] ${prompt.authorName// Provider-specific function removed (${prompt.authorId// Provider-specific function removed) -> ${truncate(
        prompt.content,
        120,
      )// Provider-specific function removed`,
    );

    connectionRetryCount += await executeWorkflowStep(
      {
        workflowRuntime: args.workflowRuntime,
        roomId: room.roomId,
        rounds: 1,
        humanAuthorName: 'Candidate',
        humanMessage: answer,
      // Provider-specific function removed,
      `interview:turn-${turn// Provider-specific function removed`,
    );
    workflowRunCount += 1;

  ***REMOVED***isCompletedInterviewSummary(loadChatroomRoomState(room.roomId).finalSummary)) {
      break;
    // Provider-specific function removed
  // Provider-specific function removed

  const finalState = loadChatroomRoomState(room.roomId);
  const runs = listChatroomExecutionRuns(room.roomId, 32);
  const agentTurns = listChatroomAgentTurns(room.roomId, {
    limit: 256,
  // Provider-specific function removed);
  const latestRun = getLatestChatroomExecutionRun(room.roomId);
  const summary = isInterviewSummary(finalState.finalSummary)
    ? finalState.finalSummary
    : undefined;
  const wallTimeMs = Date.now() - startedAt;

  return {
    label: 'complex_interview_room',
    roomId: room.roomId,
    scenarioTemplateId: finalState.roomBlueprint?.scenarioTemplateId,
    speakerCount: finalState.speakerIds.length,
    workflowRunCount,
    completedRunCount: runs.filter((run) => run.status === 'completed').length,
    failedRunCount: runs.filter((run) => run.status === 'failed').length,
    agentTurnCount: agentTurns.length,
    messageCount: finalState.messages.length,
    wallTimeMs,
    averageWallMsPerAgentTurn:
      agentTurns.length > 0 ? Math.round(wallTimeMs / agentTurns.length) : 0,
    connectionRetryCount,
    latestRunStatus: latestRun?.status,
    latestArtifactDirectory: latestRun?.artifactDirectory,
    extra: {
      finalSummaryPresent: Boolean(finalState.finalSummary),
      interviewStatus: summary?.interviewStatus ?? null,
      currentStage: summary?.currentStage ?? null,
      interviewReadiness: summary?.interviewReadiness ?? null,
      overallScore: summary?.overallScore ?? null,
      interviewerStagesSeen: [
        ...new Set(
          finalState.messages
            .filter((message) => message.role === 'agent' && INTERVIEWER_IDS.has(message.authorId))
            .map((message) => message.authorId),
        ),
      ],
      competencyDimensions:
        summary?.competencyScores.map((item) => ({
          dimension: item.dimension,
          score: item.score,
        // Provider-specific function removed)) ?? [],
    // Provider-specific function removed,
  // Provider-specific function removed;
// Provider-specific function removed

async function generateInterviewCandidateAnswer(args: {
  agentRuntime: AgentRuntime;
  state: Readonly<ChatroomState>;
  prompt: ChatroomMessage;
  turn: number;
// Provider-specific function removed): Promise<string> {
  const recentMessages = args.state.messages.slice(-PRESSURE_CANDIDATE_MAX_CONTEXT_MESSAGES);
  const previousCandidateAnswers = args.state.messages
    .filter((message) => message.role === 'user')
    .slice(-2)
    .map((message, index) => `Earlier answer ${index + 1// Provider-specific function removed: ${message.content// Provider-specific function removed`);
  const input = [
    `Turn: ${args.turn// Provider-specific function removed`,
    'Recent transcript:',
    ...recentMessages.map((message) =>
      `${message.authorName// Provider-specific function removed [${message.role// Provider-specific function removed/${message.authorId// Provider-specific function removed]: ${truncate(message.content, 320)// Provider-specific function removed`),
    'Latest question to answer now:',
    `${args.prompt.authorName// Provider-specific function removed: ${args.prompt.content// Provider-specific function removed`,
    previousCandidateAnswers.length > 0
      ? `Avoid repeating these earlier answers unless the latest question explicitly asks for the same information:\n${previousCandidateAnswers.join('\n')// Provider-specific function removed`
      : undefined,
    'Answer the latest question directly. If the interviewer asks multiple sub-questions, answer each one in order. If the host says you repeated yourself, explicitly correct course and answer the missing point.',
  ]
    .filter((item): item is string => Boolean(item))
    .join('\n');

  try {
    const result = await args.agentRuntime.runDetailed(
      pressureInterviewCandidateProfile,
      input,
      {
        maxTurns: 4,
      // Provider-specific function removed,
    );
    const output = typeof result.output === 'string'
      ? result.output.trim()
      : String(result.output ?? '').trim();
  ***REMOVED***output) {
      return output;
    // Provider-specific function removed
  // Provider-specific function removed catch (error) {
  ***REMOVED***!isRetriableConnectionError(error)) {
      console.warn(
        `[interview candidate fallback] dynamic answer generation failed: ${
          error instanceof Error ? error.message : String(error)
        // Provider-specific function removed`,
      );
    // Provider-specific function removed
  // Provider-specific function removed

  return buildInterviewCandidateAnswer(args.prompt);
// Provider-specific function removed

async function executeWorkflowStep(
  input: Parameters<typeof executeChatroomWorkflow>[0],
  label: string,
): Promise<number> {
  let retryCount = 0;
  let lastError: unknown;

  for (let attempt = 1; attempt <= WORKFLOW_STEP_MAX_ATTEMPTS; attempt += 1) {
    try {
    ***REMOVED***attempt > 1) {
        console.log(`[retry] ${label// Provider-specific function removed attempt ${attempt// Provider-specific function removed/${WORKFLOW_STEP_MAX_ATTEMPTS// Provider-specific function removed`);
      // Provider-specific function removed
      await executeChatroomWorkflow(input);
      return retryCount;
    // Provider-specific function removed catch (error) {
      lastError = error;
    ***REMOVED***!isRetriableConnectionError(error) || attempt === WORKFLOW_STEP_MAX_ATTEMPTS) {
        throw error;
      // Provider-specific function removed
      retryCount += 1;
      await sleep(attempt * 2_000);
    // Provider-specific function removed
  // Provider-specific function removed

  throw lastError;
// Provider-specific function removed

function requireLatestInterviewPrompt(messages: readonly ChatroomMessage[]): ChatroomMessage {
  const prompt = [...messages]
    .reverse()
    .find((message) => message.role === 'agent' && INTERVIEW_PROMPTER_IDS.has(message.authorId));

***REMOVED***!prompt) {
    throw new Error('No interview prompt was found in the latest transcript.');
  // Provider-specific function removed

  return prompt;
// Provider-specific function removed

function buildInterviewCandidateAnswer(prompt: ChatroomMessage): string {
  const content = normalizeInterviewPrompt(prompt.content);

***REMOVED***
    /主导过的.*库存|主导过的.*支付|核心产品决策案例|核心问题是什么.*做了什么决策.*结果如何|选["“]?库存["”]?或["“]?支付/u
      .test(content)
***REMOVED***
  ***REMOVED***
      '我选支付链路这个案例。',
      '当时的核心问题是大促峰值下支付成功了，但库存确认和补偿链路不稳定，导致部分订单支付成功后才发现库存不足，商家赔付和客服投诉都很高。',
      '我做的核心决策是把下单、支付、库存、补偿重构成统一交易状态机，支付成功后异步确认库存，并补上 outbox、幂等消费和对账补偿机制。',
      '结果是支付成功率提升 1.8 个百分点，库存超卖从千分之六降到万分之三，补偿处理时长从 45 分钟降到 8 分钟。',
    ].join('');
  // Provider-specific function removed

***REMOVED***/成功率的分母|重复发起|自动重试|基线周期|上线前多长时间/u.test(content)) {
  ***REMOVED***
      '支付成功率我按支付单维度来算，分母是进入支付网关并拿到明确终态的支付单总数，不把前端重复点击直接当成多笔成功机会。',
      '如果同一用户因为超时重试生成了新的支付单，我会按新的支付单计入；如果只是同一支付单在网关内部重试，不会重复计分母。',
      '基线周期我取上线前连续 14 天，同样避开大促主峰值日，再和灰度期 7 天做同口径对比。',
      '归因上还是那套分阶段灰度加同期对照，把渠道切换、活动流量和风控策略调整单独拆出去，最后才得到 1.3% 的架构直接贡献。',
    ].join('');
  // Provider-specific function removed

***REMOVED***/超卖/u.test(content) && /基线数据|怎么来的|全量订单|采样|时间窗口|多周期|谁提供|原始数据/u.test(content)) {
  ***REMOVED***
      '千分之六这组基线不是采样，是近 3 次大促期间的全量支付成功订单对账后算出来的均值。',
      '时间窗口我取的是每次大促主峰值前后各 12 小时，再按同口径汇总成多周期基线，避免只看单场活动带来的偶然波动。',
      '原始数据由库存履约团队提供对账明细，支付侧补充成功订单总量，我这边再把两边数据拉到统一看板做口径校验。',
      '所以后面的万分之三不是随手抓的监控点，而是用同一套全量对账逻辑复算出来的上线后结果。',
    ].join('');
  // Provider-specific function removed

***REMOVED***/自我介绍|介绍一下自己|简要介绍一下自己|先介绍一下你自己/u.test(content)) {
  ***REMOVED***
      '我做电商产品 6 年，最近两年主要负责交易链路和履约协同。',
      '最近一个核心项目是把下单、支付、库存和补偿流程重构成统一交易状态机，',
      '我负责目标拆解、关键取舍、跨团队推进和灰度上线。',
      '项目上线后支付成功率提升 1.8 个百分点，库存超卖从千分之 6 降到万分之 3。',
    ].join('');
  // Provider-specific function removed

***REMOVED***
    /超卖(?:指标|率|数据)?.*(?:定义|口径|分子|分母)|超卖率具体是怎么定义|订单维度|SKU维度|同一SKU|发生超卖的SKU|实时监控|T\+1|对账|统计逻辑|可售为负|占库/u
      .test(content)
***REMOVED***
  ***REMOVED***
      '超卖我按订单维度来定义，不按 SKU 维度。',
      '分子是支付成功后库存确认失败、最终进入补偿或退款的超卖订单数，分母是灰度范围内的支付成功订单总数。',
      '我不用 SKU 维度做主口径，是因为业务真正承担赔付和客服压力的是订单，而不是单个 SKU 的波动次数。',
      '这两个数都来自同一套 T+1 对账口径，实时监控只做告警，不拿来当最终复盘口径；上线前的千分之六和上线后的万分之三用的是同一套统计逻辑。',
      '归因上我复用了同一套灰度对照组，但额外补了一层热点 SKU 拆分，避免把单个爆款的抢购波动误判成方案整体问题。',
      '最后看到整体超卖从千分之六降到万分之三，其中核心改善来自支付后异步确认加补偿闭环，而不是单纯流量回落。',
    ].join('');
  // Provider-specific function removed

***REMOVED***/利益相关方|至少3个|姓名|角色|具名|对接人/u.test(content) && /回滚阈值|全量回退/u.test(content)) {
  ***REMOVED***
      '我直接说人和阈值。',
      '当时我对接最深的三个角色是：库存技术负责人、支付通道产品经理、商家运营负责人；如果要补第四个，就是客服流程 owner。',
      '库存负责人盯超卖和释放时效，支付产品经理盯成功率和主链路时延，商家运营负责人盯大促赔付和商家投诉，客服 owner 盯补偿单量和人工兜底压力。',
      '回滚阈值我定了两条红线：超卖率超过万分之五且持续 15 分钟，或者补偿积压超过 300 单且 10 分钟内下不去，就触发全量回退。',
      '如果只是局部热点 SKU 抖动，我会先做定向限流和补偿修复，不会立刻把整个方案回退。',
    ].join('');
  // Provider-specific function removed

***REMOVED***
    /归因|排除同期变量|AB实验|A\/B|对照组|差分法|灰度期间|确认.+带来的|不是其他变量/u.test(
      content,
    )
***REMOVED***
  ***REMOVED***
      '这块我用的不是严格随机 AB，而是“分阶段灰度 + 同期对照组 + 差分校验”。',
      '我们先把新状态机灰到 10% 的商家和流量桶，同时保留同渠道、同活动类型、同客群结构的老链路作为对照组，连续看了 7 天。',
      '核心比较的是支付成功率、支付 P99 和库存补偿单量，再把大促活动流量和支付渠道切换带来的波动单独拆掉。',
      '最后看到整体成功率提升 1.8 个百分点，其中能稳定归因到状态机重构的大约是 1.3 个百分点，剩下 0.5 个百分点来自同期渠道优化，所以我对外会把 1.8% 说成“整体结果”，把 1.3% 说成“架构改造直接贡献”。',
    ].join('');
  // Provider-specific function removed

***REMOVED***/为什么要主动推动|为什么选择推动|为什么决定把整条链路重构推到底|主动揽了风险|内在动机|为什么选择扛这个风险/u.test(content)) {
  ***REMOVED***
      '我当时坚持推动整条链路重构，不是因为想做一个大项目，而是因为我之前亲历过一次大促超卖事故，局部修补最后把压力全部转嫁给客服、商家和运营，业务代价非常高。',
      '我判断那个阶段的问题已经不是单点优化能解决的了，如果只补某一个环节，下一次流量上来还是会在别的节点爆掉，所以必须把下单、支付、库存、补偿放到一套统一状态机里重新梳理。',
      '说白了，我愿意扛这个风险，是因为我更在意把根因解决掉，而不是继续做表面上更安全、但半年后一定还会出事的局部优化。',
    ].join('');
  // Provider-specific function removed

***REMOVED***/为什么想来|离开现在的团队|离职|看新机会|动机|岗位|下一份工作|看重什么/u.test(content)) {
  ***REMOVED***
      '我想换到一个业务复杂度更高、对 owner 意识要求更强的岗位，而不是继续停留在相对单点的优化型工作里。',
      '我下一份工作最看重三点：一是问题复杂度足够高，二是产品能真正推动跨团队结果，三是团队愿意用数据和复盘来做决策。',
      '如果方便的话，我也想了解这个岗位前 6 个月最重要的结果指标是什么，以及产品、研发、运营之间的协作节奏是怎样的。',
    ].join('');
  // Provider-specific function removed

***REMOVED***/强烈反对|不肯让步|谁|场合|原话|说了什么|拉回来/u.test(content)) {
  ***REMOVED***
      '有，最强烈反对的是库存负责人，在周会里直接说“只要不是同步锁库存，超卖算谁的锅？”',
      '支付负责人也明确表态，不能为了库存确认把支付主链路拖慢。',
      '我没有继续空谈原则，而是把争议改成责任和阈值：库存团队背超卖阈值和补偿时效，支付团队背成功率和主链路时延，',
      '我和业务 owner 背灰度结果。',
      '同时我提出 5% 灰度，超卖率超过万分之五立即回滚，补偿积压超过 300 单我负责拉战情群推进兜底，所以两边才同意先试运行。',
    ].join('');
  // Provider-specific function removed

***REMOVED***/库存团队|支付团队|分歧|冲突|协同|对齐|不同意|推动|owner/u.test(content)) {
  ***REMOVED***
      '最大分歧发生在库存团队和支付团队之间。',
      '库存团队坚持下单就同步锁库存，担心异步确认会放大超卖；支付团队则坚持支付回调必须异步，不接受因为库存确认把支付主链路拉长。',
      '我先把双方目标拆开，再把库存、支付、客服和业务 owner 拉到同一张数据表上讨论，明确如果全链路强一致，支付 P99 会从 230ms 拉到 410ms；如果完全放开异步，超卖会上到千分之 8。',
      '最后我推动成分阶段方案：下单阶段轻量预占，支付成功后异步确认库存，超时走补偿和人工兜底，并把库存超卖、补偿积压、支付成功率写进共同 SLA，双方才接受灰度上线。',
    ].join('');
  // Provider-specific function removed

***REMOVED***/回滚|阈值|触发|全量回退|红线|谁有权拍板|谁来背|拍板|继续扛/u.test(content)) {
  ***REMOVED***
      '我会看三个信号一起拍板：超卖率、补偿积压量、支付成功率。',
      '当时我定的红线是超卖率超过万分之五且持续 15 分钟，或者补偿积压超过 300 单且 10 分钟内下不去，就立即回滚。',
      '如果只是轻微抖动但支付成功率稳定，我会先修补偿逻辑，不会直接把整个方案推翻。',
      '共同 SLA 上，库存团队背超卖和释放时效，支付团队背成功率和回调稳定性，我作为 owner 背是否回滚和跨团队升级。',
    ].join('');
  // Provider-specific function removed

***REMOVED***/利益相关方|关键利益相关方|对接的/u.test(content)) {
  ***REMOVED***
      '我对接最深的四个角色分别是库存技术负责人、支付通道产品经理、商家运营负责人和客服流程 owner。',
      '库存负责人关心超卖和释放时效，支付产品经理关心成功率和主链路时延，商家运营负责人关心赔付和商家体验，客服 owner 关心补偿单量和工单压力。',
      '我每周会把这四方拉到同一张指标看板上，确保大家围绕同一套数据做取舍，而不是各说各话。',
    ].join('');
  // Provider-specific function removed

***REMOVED***/数据来源|怎么得出来|怎么得到|口径|压测|历史数据|验证/u.test(content)) {
  ***REMOVED***
      '这两个数字不是拍脑袋出来的。',
      '支付 P99 的变化来自双十一前的压测和线上历史回放，压测里把库存确认从异步改成同步后，',
      '主链路 P99 从 230ms 拉到了 410ms；超卖率千分之 8 则是拿近 3 次大促的库存争抢数据回放，',
      '按最坏并发条件估算出来的上界。',
      '库存和支付一开始都质疑口径，所以我把埋点定义、样本窗口和回放脚本都公开，让两个团队一起签字确认同一份数据。',
    ].join('');
  // Provider-specific function removed

***REMOVED***
    '我会先直接回答问题，再补充背景、数据、取舍和结果。',
    '如果你愿意，我可以继续把具体场景展开到角色分工和指标阈值。',
  ].join('');
// Provider-specific function removed

function normalizeInterviewPrompt(value: string): string {
  return value
    .replace(/\*+/gu, '')
    .replace(/\s+/gu, ' ')
    .trim();
// Provider-specific function removed

function isInterviewSummary(value: unknown): value is InterviewSummary {
  return value !== null && typeof value === 'object' && !Array.isArray(value) &&
    'overallScore' in value && 'interviewStatus' in value;
// Provider-specific function removed

function isCompletedInterviewSummary(value: unknown): value is InterviewSummary {
  return isInterviewSummary(value) && value.interviewStatus === 'complete';
// Provider-specific function removed

function isRetriableConnectionError(error: unknown***REMOVED***
  const message = error instanceof Error ? error.message : String(error);
  return /Connection error|fetch failed|ECONNRESET|ETIMEDOUT|socket hang up/i.test(message);
// Provider-specific function removed

function truncate(value: string, limit: number): string {
  const normalized = value.replace(/\s+/gu, ' ').trim();
  return normalized.length <= limit
    ? normalized
    : `${normalized.slice(0, Math.max(0, limit - 3))// Provider-specific function removed...`;
// Provider-specific function removed

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  // Provider-specific function removed);
// Provider-specific function removed
