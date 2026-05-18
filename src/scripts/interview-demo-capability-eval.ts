import { continueChatroomWorkflow, runChatroomWorkflow, type ChatroomState // Provider-specific function removed from '../workflows/chatroom-discussion.js';
import type { AgentRuntime // Provider-specific function removed from '../core/agent-runtime.js';
import { WorkflowRuntime // Provider-specific function removed from '../core/workflow.js';
import type { ChatroomAgentContext, ChatroomMessage // Provider-specific function removed from '../workflows/chatroom-types.js';
import {
  collectInterviewStageCounts,
  resolveInterviewStatusFromState,
// Provider-specific function removed from '../workflows/interview-room-controller.js';
import {
  countInterviewCandidateReplies,
  countConsecutiveRepeatedCandidateAnswers,
  classifyInterviewCandidateTurnMessage,
// Provider-specific function removed from '../workflows/interview-room-utils.js';
import { INTERVIEW_DEMO_ROOM_TITLE, createChatroomRoomBlueprint // Provider-specific function removed from '../room-scenarios/room-blueprints.js';

type FakeOutputQueues = Record<string, Array<unknown | Error>>;
type LiveRoomAdminExpectation = 'required' | 'forbidden' | 'optional';
type CaseExpectation =
  | {
      outcome: 'complete';
      minValidReplies?: number;
      liveRoomAdmin?: LiveRoomAdminExpectation;
      allowUnusedTurns?: boolean;
    // Provider-specific function removed
  | {
      outcome: 'error';
      errorPattern: RegExp;
      liveRoomAdmin?: LiveRoomAdminExpectation;
    // Provider-specific function removed;

interface CandidateTurnScript {
  label: string;
  humanMessage?: string;
// Provider-specific function removed

interface EvalCase {
  id: string;
  title: string;
  category: 'persona' | 'anomaly';
  objective: string;
  outputs: FakeOutputQueues;
  turns: CandidateTurnScript[];
  expectation: CaseExpectation;
// Provider-specific function removed

interface TurnExecutionLog {
  label: string;
  humanMessage?: string;
  newMessages: string[];
  phase: string;
  pending: string;
  validReplies: number;
  repeatedAnswers: number;
// Provider-specific function removed

interface EvalCaseResult {
  id: string;
  title: string;
  category: EvalCase['category'];
  objective: string;
  verdict: 'PASS' | 'WARN' | 'FAIL';
  outcome: 'complete' | 'waiting' | 'error';
  finalPhase: string;
  pending: string;
  interviewStatus: string;
  validReplies: number;
  repeatedAnswers: number;
  stageCounts: ReturnType<typeof collectInterviewStageCounts>;
  liveRoomAdminCalls: number;
  runtimeCallSequence: string[];
  executedTurns: number;
  unusedTurns: number;
  error?: string;
  turnLogs: TurnExecutionLog[];
  transcriptTail: string[];
// Provider-specific function removed

function createFakeWorkflowRuntime(outputs: FakeOutputQueues) {
  const calls: string[] = [];
  const fakeRuntime = {
    async runDetailed(profile: { id: string // Provider-specific function removed) {
      calls.push(profile.id);
      const queue = outputs[profile.id];
    ***REMOVED***!queue || queue.length === 0) {
        throw new Error(`No fake output queued for ${profile.id// Provider-specific function removed`);
      // Provider-specific function removed

      const next = queue.shift();
    ***REMOVED***next instanceof Error) {
        throw next;
      // Provider-specific function removed

      return { output: next // Provider-specific function removed;
    // Provider-specific function removed,
  // Provider-specific function removed as unknown as AgentRuntime;

  return {
    calls,
    workflowRuntime: new WorkflowRuntime<ChatroomState, ChatroomAgentContext>(fakeRuntime),
  // Provider-specific function removed;
// Provider-specific function removed

function createDemoRoomBlueprint() {
  return createChatroomRoomBlueprint({
    scenarioTemplateId: 'interview_simulation',
    roomType: 'expert_discussion',
    title: INTERVIEW_DEMO_ROOM_TITLE,
    topic: '计算机本科通用面试 demo',
    objective: 'Run a minimal live interview demo where the human user answers directly in the browser.',
    speakerIds: ['interview-hr', 'interview-technical', 'interview-manager', 'interview-observer'],
    metadata: {
      scenario: {
        targetRole: '计算机本科相关岗位',
      // Provider-specific function removed,
    // Provider-specific function removed,
    runtimeConfig: {
      summaryEnabled: false,
    // Provider-specific function removed,
  // Provider-specific function removed);
// Provider-specific function removed

function createBaseOutputs(overrides: FakeOutputQueues = {// Provider-specific function removed): FakeOutputQueues {
  const base: FakeOutputQueues = {
    'interview-hr': [
      '你刚才提到了项目或实习，挑一个你参与度最高的经历，具体说说你亲自负责了什么，以及最后带来了什么结果。',
      '最后请讲讲你为什么想做这个方向，以及如果加入团队，你最希望优先承担什么类型的工作。',
      '我再补一个收尾问题：如果入职前三个月只能证明一件事，你最想证明什么？',
    ],
    'interview-technical': [
      '讲一个你亲自处理过的系统问题，按现象、定位、修复、结果展开，并尽量给出关键数据。',
      '把刚才的内容再收束一下，重点说你真正动手做的排查和判断，不要只讲背景。',
      '如果同类问题再次发生但业务量更大，你会优先保什么、放弃什么？为什么？',
      '如果只能补一项长期机制来避免再次发生，你会先补什么？',
      '请直接回答上一问里缺失的关键信息，尤其是你的判断依据和最终结果。',
      '再具体一点，别泛泛而谈，请只讲一次你亲自参与的真实问题和最后结果。',
      '如果你经验有限，也请直接说明你当时具体做了哪一步、看了什么指标、学到了什么。',
      '把答案压缩成三段：现象、你的动作、结果，不要跳到别的话题。',
      '如果这次还要继续追问，我最想知道的是你实际拍板或亲手改动的那一部分。',
    ],
    'interview-manager': [
      '如果产品、测试和后端对方案意见不一致，你会怎样推动形成决定，最后由谁拍板？',
      '如果团队资源有限、业务又很着急，你会怎样排序并向相关方解释取舍？',
    ],
    'interview-observer': [
      '我从协作角度追问一句：你是怎么让其他同学或其他团队接受你的方案的？',
    ],
  // Provider-specific function removed;

  return {
    ...base,
    ...Object.fromEntries(
      Object.entries(overrides).map(([key, value]) => [key, [...value]]),
    ),
  // Provider-specific function removed;
// Provider-specific function removed

function createRoomAdminDirective(input: {
  action: 'hold_interview' | 'request_answer_retry' | 'complete_interview';
  instruction: string;
  reason: string;
  targetSpeakerId?: string;
  responseMode?: 'clarify' | 'new_question';
// Provider-specific function removed): Record<string, unknown> {
  return {
    action: input.action,
    visibility: 'hidden',
    phaseLabel: '',
    phaseObjective: '',
    eventLabel: '',
    eventMessage: '',
    targetSpeakerId: input.targetSpeakerId ?? '',
    targetPromptMessageId: '',
    responseMode: input.responseMode ?? 'new_question',
    instruction: input.instruction,
    reason: input.reason,
    participantAdditions: [],
  // Provider-specific function removed;
// Provider-specific function removed

function truncateText(text: string, maxLength = 72): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
***REMOVED***normalized.length <= maxLength) {
    return normalized;
  // Provider-specific function removed

  return `${normalized.slice(0, Math.max(0, maxLength - 1))// Provider-specific function removed…`;
// Provider-specific function removed

function formatMessageLine(message: ChatroomMessage): string {
  return `${message.authorName// Provider-specific function removed[${message.authorId// Provider-specific function removed]: ${truncateText(message.content)// Provider-specific function removed`;
// Provider-specific function removed

function formatPending(state: Readonly<ChatroomState>): string {
  const pending = state.interviewPendingCandidateReply;
***REMOVED***!pending) {
    return 'none';
  // Provider-specific function removed

  return `${pending.speakerId// Provider-specific function removed / ${pending.responseMode// Provider-specific function removed / round ${pending.round// Provider-specific function removed`;
// Provider-specific function removed

function summarizeTranscriptTail(messages: readonly ChatroomMessage[]): string[] {
  return messages
    .filter((message) => (message.role === 'agent' || message.role === 'user') && message.round > 0)
    .slice(-8)
    .map(formatMessageLine);
// Provider-specific function removed

function buildVerdict(args: {
  expectation: CaseExpectation;
  result: Omit<EvalCaseResult, 'verdict'>;
// Provider-specific function removed): EvalCaseResult['verdict'] {
  const { expectation, result // Provider-specific function removed = args;
  const liveRoomAdminCheck =
    expectation.liveRoomAdmin === 'required'
      ? result.liveRoomAdminCalls > 0
      : expectation.liveRoomAdmin === 'forbidden'
        ? result.liveRoomAdminCalls === 0
        : true;

***REMOVED***expectation.outcome === 'error') {
  ***REMOVED***
      result.outcome === 'error' &&
      result.error &&
      expectation.errorPattern.test(result.error) &&
      liveRoomAdminCheck
  ***REMOVED***
      return 'PASS';
    // Provider-specific function removed
    return 'FAIL';
  // Provider-specific function removed

***REMOVED***result.outcome !== 'complete' || result.finalPhase !== 'complete' || !liveRoomAdminCheck) {
    return 'FAIL';
  // Provider-specific function removed

***REMOVED***
    expectation.minValidReplies &&
    result.validReplies < expectation.minValidReplies
***REMOVED***
    return 'WARN';
  // Provider-specific function removed

***REMOVED***!expectation.allowUnusedTurns && result.unusedTurns > 0) {
    return 'WARN';
  // Provider-specific function removed

  return 'PASS';
// Provider-specific function removed

async function runEvalCase(testCase: EvalCase): Promise<EvalCaseResult> {
  const roomBlueprint = createDemoRoomBlueprint();
  const { calls, workflowRuntime // Provider-specific function removed = createFakeWorkflowRuntime(
    structuredClone(testCase.outputs),
  );

  const started = await runChatroomWorkflow(workflowRuntime, {
    roomBlueprint,
    topic: roomBlueprint.topic,
    objective: roomBlueprint.objective,
    summaryEnabled: false,
  // Provider-specific function removed);

  let currentState = structuredClone(started.state);
  const turnLogs: TurnExecutionLog[] = [];
  let executedTurns = 0;
  let errorText: string | undefined;

  for (const turn of testCase.turns) {
  ***REMOVED***currentState.interviewCurrentPhase === 'complete' && !currentState.interviewPendingCandidateReply) {
      break;
    // Provider-specific function removed

    const beforeMessageCount = currentState.messages.length;
    try {
      const result = await continueChatroomWorkflow(workflowRuntime, currentState, {
        additionalRounds: 1,
        humanMessage: turn.humanMessage,
        humanAuthorName: 'Candidate',
      // Provider-specific function removed);
      currentState = structuredClone(result.state);
      executedTurns += 1;

      const newMessages = currentState.messages.slice(beforeMessageCount);
      turnLogs.push({
        label: turn.label,
        humanMessage: turn.humanMessage,
        newMessages: newMessages.map(formatMessageLine),
        phase: currentState.interviewCurrentPhase ?? 'unknown',
        pending: formatPending(currentState),
        validReplies: countInterviewCandidateReplies(currentState.messages),
        repeatedAnswers: countConsecutiveRepeatedCandidateAnswers(currentState.messages),
      // Provider-specific function removed);
    // Provider-specific function removed catch (error) {
      executedTurns += 1;
      errorText = error instanceof Error ? error.message : String(error);
      turnLogs.push({
        label: turn.label,
        humanMessage: turn.humanMessage,
        newMessages: [],
        phase: currentState.interviewCurrentPhase ?? 'unknown',
        pending: formatPending(currentState),
        validReplies: countInterviewCandidateReplies(currentState.messages),
        repeatedAnswers: countConsecutiveRepeatedCandidateAnswers(currentState.messages),
      // Provider-specific function removed);
      break;
    // Provider-specific function removed
  // Provider-specific function removed

  const outcome: EvalCaseResult['outcome'] =
    errorText
      ? 'error'
      : currentState.interviewCurrentPhase === 'complete'
        ? 'complete'
        : 'waiting';
  const stageCounts = collectInterviewStageCounts(currentState.messages);
  const baseResult = {
    id: testCase.id,
    title: testCase.title,
    category: testCase.category,
    objective: testCase.objective,
    outcome,
    finalPhase: currentState.interviewCurrentPhase ?? 'unknown',
    pending: formatPending(currentState),
    interviewStatus: resolveInterviewStatusFromState(currentState),
    validReplies: countInterviewCandidateReplies(currentState.messages),
    repeatedAnswers: countConsecutiveRepeatedCandidateAnswers(currentState.messages),
    stageCounts,
    liveRoomAdminCalls: calls.filter((item) => item === 'chatroom-room-admin').length,
    runtimeCallSequence: [...calls],
    executedTurns,
    unusedTurns: testCase.turns.length - executedTurns,
    error: errorText,
    turnLogs,
    transcriptTail: summarizeTranscriptTail(currentState.messages),
  // Provider-specific function removed;

  return {
    ...baseResult,
    verdict: buildVerdict({
      expectation: testCase.expectation,
      result: baseResult,
    // Provider-specific function removed),
  // Provider-specific function removed;
// Provider-specific function removed

function printCaseResult(result: EvalCaseResult): void {
  console.log(`\n=== ${result.id// Provider-specific function removed | ${result.title// Provider-specific function removed ===`);
  console.log(`类别: ${result.category// Provider-specific function removed`);
  console.log(`目标: ${result.objective// Provider-specific function removed`);
  console.log(`结论: ${result.verdict// Provider-specific function removed`);
  console.log(`结果: ${result.outcome// Provider-specific function removed`);
  console.log(`最终 phase: ${result.finalPhase// Provider-specific function removed`);
  console.log(`当前 pending: ${result.pending// Provider-specific function removed`);
  console.log(`interviewStatus: ${result.interviewStatus// Provider-specific function removed`);
  console.log(`有效回答数: ${result.validReplies// Provider-specific function removed`);
  console.log(`连续重复回答数: ${result.repeatedAnswers// Provider-specific function removed`);
  console.log(
    `阶段计数: HR=${result.stageCounts.hr// Provider-specific function removed, Technical=${result.stageCounts.technical// Provider-specific function removed, Observer=${result.stageCounts.observer// Provider-specific function removed, Manager=${result.stageCounts.manager// Provider-specific function removed`,
  );
  console.log(`live room-admin 调用次数: ${result.liveRoomAdminCalls// Provider-specific function removed`);
  console.log(`runtime 调用序列: ${result.runtimeCallSequence.length > 0 ? result.runtimeCallSequence.join(' -> ') : '(none)'// Provider-specific function removed`);
  console.log(`已执行候选人轮次: ${result.executedTurns// Provider-specific function removed`);
  console.log(`未用到的预设轮次: ${result.unusedTurns// Provider-specific function removed`);
***REMOVED***result.error) {
    console.log(`错误: ${result.error// Provider-specific function removed`);
  // Provider-specific function removed

***REMOVED***result.turnLogs.length > 0) {
    console.log('轮次摘要:');
    for (const log of result.turnLogs) {
      const turnKind = log.humanMessage
        ? classifyInterviewCandidateTurnMessage({
            role: 'user',
            round: 1,
            content: log.humanMessage,
          // Provider-specific function removed)
        : 'no_message';
      console.log(
        `- ${log.label// Provider-specific function removed | kind=${turnKind// Provider-specific function removed | phase=${log.phase// Provider-specific function removed | pending=${log.pending// Provider-specific function removed | validReplies=${log.validReplies// Provider-specific function removed`,
      );
      for (const line of log.newMessages) {
        console.log(`  ${line// Provider-specific function removed`);
      // Provider-specific function removed
    // Provider-specific function removed
  // Provider-specific function removed

***REMOVED***result.transcriptTail.length > 0) {
    console.log('尾部 transcript:');
    for (const line of result.transcriptTail) {
      console.log(`- ${line// Provider-specific function removed`);
    // Provider-specific function removed
  // Provider-specific function removed
// Provider-specific function removed

function buildEvalCases(): EvalCase[] {
  const evasiveAnswer = '我觉得自己学习能力强、适应快，也愿意配合团队，具体细节暂时不方便展开。';

***REMOVED***
    {
      id: 'persona-strong-normal',
      title: '正常强候选人',
      category: 'persona',
      objective: '验证标准强回答能否走完完整 demo 面试流程。',
      outputs: createBaseOutputs(),
      turns: [
        {
          label: '自我介绍',
          humanMessage:
            '你好，我是计算机本科大四学生，最近主要做后端开发和分布式系统相关课程项目，也做过电商后端实习。',
        // Provider-specific function removed,
        {
          label: 'HR 追问',
          humanMessage:
            '我参与度最高的是校园交易平台项目，我负责订单、库存和消息补偿链路，做完之后下单成功率从 93% 提到了 98%。',
        // Provider-specific function removed,
        {
          label: '技术深挖 1',
          humanMessage:
            '一次高峰期订单确认接口 P99 从 180ms 涨到 620ms，错误率到 4.1%。我先通过日志和链路追踪定位到库存锁竞争和重试放大，再把热点商品改成分段锁并关闭同步回写，30 分钟内把 P99 拉回到 240ms。',
        // Provider-specific function removed,
        {
          label: '技术深挖 2',
          humanMessage:
            '如果流量再翻倍，我会先保下单成功率和库存最终一致，临时降级推荐和营销通知，只保留核心事务链路，并用队列堆积、超时率和补偿延迟做止损阈值。',
        // Provider-specific function removed,
        {
          label: '经理面',
          humanMessage:
            '如果产品、测试和后端意见不一致，我会先把必须达成和可以延后的目标拆开，再拿错误率、回滚成本和用户影响范围做共同依据，必要时由值班 owner 拍板。',
        // Provider-specific function removed,
        {
          label: '收尾',
          humanMessage:
            '我想了解进入团队前三个月最看重哪些结果；补充一点是我更适合需要主动推进和把问题落地的后端岗位。',
        // Provider-specific function removed,
      ],
      expectation: {
        outcome: 'complete',
        minValidReplies: 6,
        liveRoomAdmin: 'forbidden',
      // Provider-specific function removed,
    // Provider-specific function removed,
    {
      id: 'persona-weak-honest',
      title: '没学好但诚实配合的候选人',
      category: 'persona',
      objective: '验证弱回答但愿意配合时，流程是否仍可推进到结束。',
      outputs: createBaseOutputs(),
      turns: [
        {
          label: '自我介绍',
          humanMessage:
            '我是计算机本科应届生，项目经验不算多，主要做过课程作业和一个短期后端实习，现在希望从基础岗位开始积累。',
        // Provider-specific function removed,
        {
          label: 'HR 追问',
          humanMessage:
            '我参与最多的是宿舍报修系统，主要负责 Spring Boot 接口和 MySQL 表设计，复杂场景经验还比较少。',
        // Provider-specific function removed,
        {
          label: '技术深挖 1',
          humanMessage:
            '我遇到过一次接口很慢，开始我不知道怎么查，后来在学长帮助下看监控，发现是数据库连接池满了。',
        // Provider-specific function removed,
        {
          label: '技术深挖 2',
          humanMessage:
            '后来我把连接池从 20 调到 50，同时把一个全表查询改成按索引查，接口从大概 2 秒降到 600 毫秒左右，但我还没有独立处理过更复杂的线上事故。',
        // Provider-specific function removed,
        {
          label: '经理面',
          humanMessage:
            '如果出现分歧，我会先把我确认过的事实列出来，自己拿不准的地方会及时找更有经验的人确认，不会为了表现硬推进。',
        // Provider-specific function removed,
        {
          label: '收尾',
          humanMessage:
            '我现在更希望有系统带教和规范流程，如果能从基础后端开发做起，我会比较踏实，也愿意把基础补扎实。',
        // Provider-specific function removed,
        {
          label: '技术补答 3',
          humanMessage:
            '如果业务量更大，我会先保证核心提交流程可用，把统计和通知先降级，并优先盯超时率和错误率，先把最影响用户主流程的问题压住。',
        // Provider-specific function removed,
        {
          label: '经理补答',
          humanMessage:
            '如果资源有限，我会先完成最影响用户主流程的部分，再把风险和我暂时没有把握的地方提前说清楚，避免团队误判。',
        // Provider-specific function removed,
        {
          label: '最终补充',
          humanMessage:
            '我知道自己经验还浅，但我愿意把基础补齐，也愿意从规范开发、问题排查和稳定交付这种基本功开始做扎实。',
        // Provider-specific function removed,
      ],
      expectation: {
        outcome: 'complete',
        minValidReplies: 6,
        liveRoomAdmin: 'forbidden',
        allowUnusedTurns: true,
      // Provider-specific function removed,
    // Provider-specific function removed,
    {
      id: 'persona-evasive-terminate',
      title: '能力可能够但明显回避作答的候选人',
      category: 'persona',
      objective: '验证候选人连续答非所问/回避时，room-admin 是否能接管并终止流程。',
      outputs: createBaseOutputs({
        'chatroom-room-admin': [
          createRoomAdminDirective({
            action: 'request_answer_retry',
            targetSpeakerId: 'interview-technical',
            responseMode: 'clarify',
            instruction: '先不要继续讲泛泛而谈的优势，请把问题收束到一个真实案例，要求候选人直接回答。',
            reason: '候选人没有正面回答技术问题，需要同一位面试官缩窄提问重试。',
          // Provider-specific function removed),
          createRoomAdminDirective({
            action: 'request_answer_retry',
            targetSpeakerId: 'interview-technical',
            responseMode: 'new_question',
            instruction: '候选人仍在回避，请换个更具体的切入口，让他直接给出亲历案例和结果。',
            reason: '候选人再次重复泛化回答，流程仍未得到有效信息。',
          // Provider-specific function removed),
          createRoomAdminDirective({
            action: 'complete_interview',
            instruction: '候选人连续回避作答，结束本次面试并进入收束。',
            reason: '连续三次重复或回避回答后，流程已经无法继续推进。',
          // Provider-specific function removed),
        ],
      // Provider-specific function removed),
      turns: [
        {
          label: '自我介绍',
          humanMessage:
            '我是计算机本科学生，也做过几段项目和实习，整体适应能力比较强，比较关注平台和成长空间。',
        // Provider-specific function removed,
        {
          label: 'HR 追问',
          humanMessage:
            '我在项目里都能比较快上手，团队评价我执行力和配合度都不错。',
        // Provider-specific function removed,
        {
          label: '技术回避 1',
          humanMessage: evasiveAnswer,
        // Provider-specific function removed,
        {
          label: '技术回避 2',
          humanMessage: evasiveAnswer,
        // Provider-specific function removed,
        {
          label: '技术回避 3',
          humanMessage: evasiveAnswer,
        // Provider-specific function removed,
      ],
      expectation: {
        outcome: 'complete',
        liveRoomAdmin: 'required',
        allowUnusedTurns: true,
      // Provider-specific function removed,
    // Provider-specific function removed,
    {
      id: 'persona-average-positive',
      title: '态度好但水平一般的候选人',
      category: 'persona',
      objective: '验证普通但配合的候选人是否能正常完成 interview demo。',
      outputs: createBaseOutputs(),
      turns: [
        {
          label: '自我介绍',
          humanMessage:
            '我是计算机本科大四学生，做过实验室系统和课程项目，主要偏 Java 后端，工程体量不算特别大，但我能从需求跟到上线。',
        // Provider-specific function removed,
        {
          label: 'HR 追问',
          humanMessage:
            '我做得最多的是实验室预约系统，负责登录、预约冲突校验和部分部署脚本，虽然项目不大，但我从需求到上线都跟过。',
        // Provider-specific function removed,
        {
          label: '技术深挖 1',
          humanMessage:
            '有一次预约高峰时 Redis 缓存过期，很多请求直接打到数据库，接口耗时涨到 900 毫秒左右。我先做限流，再把热点 key 提前续期，同时把一条慢 SQL 单独优化。',
        // Provider-specific function removed,
        {
          label: '技术深挖 2',
          humanMessage:
            '如果同类问题再来，我会先保预约提交和取消两个核心动作，统计页面先降级，因为对用户主流程影响最小。',
        // Provider-specific function removed,
        {
          label: '经理面',
          humanMessage:
            '如果和其他同学意见不一致，我会先确认共同目标，再把方案拆成可验证的小步骤，用数据和回滚预案减少争论。',
        // Provider-specific function removed,
        {
          label: '收尾',
          humanMessage:
            '我想了解你们更看重候选人的学习速度还是已有经验；我虽然不是最强的，但执行和配合会比较稳定。',
        // Provider-specific function removed,
        {
          label: '经理补答',
          humanMessage:
            '如果资源有限，我会先保主流程和稳定性相关项，把体验优化延后，并明确告诉相关方为什么这么排以及怎么回滚。',
        // Provider-specific function removed,
        {
          label: '最终补充',
          humanMessage:
            '如果有机会加入，我希望先在稳定交付和问题闭环上拿结果，再逐步承担更复杂的模块。',
        // Provider-specific function removed,
      ],
      expectation: {
        outcome: 'complete',
        minValidReplies: 6,
        liveRoomAdmin: 'forbidden',
        allowUnusedTurns: true,
      // Provider-specific function removed,
    // Provider-specific function removed,
    {
      id: 'anomaly-clarify-recovery',
      title: '候选人请求澄清后继续',
      category: 'anomaly',
      objective: '验证 clarify 路径是否能让同一位面试官重述问题，并在之后继续正常流程。',
      outputs: createBaseOutputs({
        'interview-technical': [
          '讲一个你亲自处理过的后端问题，重点说现象、定位和恢复。',
          '我更想听你当时的排查过程和判断依据，先聚焦你亲自做了什么，再补结果。',
          '如果同类问题再次发生但影响更大，你会先保什么？',
        ],
      // Provider-specific function removed),
      turns: [
        {
          label: '自我介绍',
          humanMessage:
            '我是计算机本科学生，最近主要做订单系统和缓存一致性相关项目，也做过一段后端实习，希望找偏后端稳定性方向的岗位。',
        // Provider-specific function removed,
        {
          label: 'HR 追问',
          humanMessage:
            '我参与度最高的是课程里的订单系统重构，我负责接口改造、数据库表调整和消息重试逻辑，也因为我更想做后端稳定性方向，所以对线上排障和一致性最感兴趣。',
        // Provider-specific function removed,
        {
          label: '请求澄清',
          humanMessage:
            '这里更想听我当时的排查过程，还是更想听最后怎么修？',
        // Provider-specific function removed,
        {
          label: '澄清后作答',
          humanMessage:
            '那我先说排查过程。当时超时率先涨到 3% 左右，我先看日志和监控，确认是库存服务重试放大，再把重试策略收紧并补了幂等校验，最后把错误率降回到 0.4%。',
        // Provider-specific function removed,
        {
          label: '后续回答 1',
          humanMessage:
            '如果再发生同类问题，我会先保下单和库存一致，通知类功能先降级，避免核心链路继续放大故障。',
        // Provider-specific function removed,
        {
          label: '后续回答 2',
          humanMessage:
            '如果进入团队，我会优先证明自己能把问题查清楚并稳定交付，而不是只停留在会写代码。',
        // Provider-specific function removed,
        {
          label: '经理补答',
          humanMessage:
            '如果意见不一致，我会先对齐目标和风险边界，再用数据、回滚预案和 owner 机制推进决策，避免大家各说各话。',
        // Provider-specific function removed,
        {
          label: '最终补充',
          humanMessage:
            '如果加入团队，我希望优先证明自己能稳定交付并把线上问题追到闭环。',
        // Provider-specific function removed,
      ],
      expectation: {
        outcome: 'complete',
        minValidReplies: 5,
        liveRoomAdmin: 'forbidden',
        allowUnusedTurns: true,
      // Provider-specific function removed,
    // Provider-specific function removed,
    {
      id: 'anomaly-pause-resume',
      title: '候选人暂停后恢复继续',
      category: 'anomaly',
      objective: '验证 pause/reconnect 是否会先 hold，再在恢复后继续完成面试。',
      outputs: createBaseOutputs({
        'chatroom-room-admin': [
          createRoomAdminDirective({
            action: 'hold_interview',
            instruction: '候选人暂时掉线，先保持等待，不要继续追问。',
            reason: '候选人明确请求暂停并表示稍后恢复连接。',
          // Provider-specific function removed),
        ],
      // Provider-specific function removed),
      turns: [
        {
          label: '自我介绍',
          humanMessage:
            '我是计算机本科学生，主要做过后端课程项目和一次电商方向的实习，对服务稳定性和数据一致性比较感兴趣。',
        // Provider-specific function removed,
        {
          label: 'HR 追问',
          humanMessage:
            '我参与最多的是一个订单服务项目，负责接口设计、缓存、消息补偿和上线后的问题跟踪。',
        // Provider-specific function removed,
        {
          label: '网络中断',
          humanMessage:
            '稍等一下，我这边网络刚刚卡住了，我重新连一下。',
        // Provider-specific function removed,
        {
          label: '恢复后作答 1',
          humanMessage:
            '我恢复好了。一次订单超时问题里，接口 P99 从 210ms 涨到 580ms，我通过链路追踪定位到库存锁竞争，再把热点数据拆分并调整重试策略，半小时内把 P99 拉回到 260ms。',
        // Provider-specific function removed,
        {
          label: '恢复后作答 2',
          humanMessage:
            '如果问题再次发生但业务更大，我会优先保支付成功率和库存最终一致，非核心通知先降级，再用队列堆积和超时率做止损。',
        // Provider-specific function removed,
        {
          label: '经理面',
          humanMessage:
            '遇到跨团队分歧时，我会先把共同目标和风险边界写清楚，再用数据和回滚方案推动达成一致。',
        // Provider-specific function removed,
        {
          label: '收尾',
          humanMessage:
            '如果加入团队，我希望优先承担能真正对稳定性指标负责的工作，也想了解你们如何衡量新人前三个月的表现。',
        // Provider-specific function removed,
      ],
      expectation: {
        outcome: 'complete',
        minValidReplies: 6,
        liveRoomAdmin: 'required',
        allowUnusedTurns: true,
      // Provider-specific function removed,
    // Provider-specific function removed,
    {
      id: 'anomaly-withdraw-early',
      title: '候选人中途明确退出',
      category: 'anomaly',
      objective: '验证候选人主动结束面试时，流程是否会立即收束。',
      outputs: createBaseOutputs({
        'chatroom-room-admin': [
          createRoomAdminDirective({
            action: 'complete_interview',
            instruction: '候选人明确表示要结束本次面试，直接收束。',
            reason: '出现明确 withdraw 请求，不应继续推进后续问题。',
          // Provider-specific function removed),
        ],
      // Provider-specific function removed),
      turns: [
        {
          label: '自我介绍',
          humanMessage:
            '我是计算机本科学生，最近主要在做 Java 后端项目，也在准备秋招。',
        // Provider-specific function removed,
        {
          label: 'HR 追问',
          humanMessage:
            '我参与过一个课程项目和一次短实习，主要做接口开发和简单部署。',
        // Provider-specific function removed,
        {
          label: '主动退出',
          humanMessage:
            '今天先到这里吧，我想结束这次面试。',
        // Provider-specific function removed,
      ],
      expectation: {
        outcome: 'complete',
        liveRoomAdmin: 'required',
        allowUnusedTurns: true,
      // Provider-specific function removed,
    // Provider-specific function removed,
    {
      id: 'anomaly-silence-boundary',
      title: '候选人完全静默不答',
      category: 'anomaly',
      objective: '验证当前 demo 在完全没有用户输入时的真实边界。',
      outputs: createBaseOutputs(),
      turns: [
        {
          label: '不发言直接继续',
        // Provider-specific function removed,
      ],
      expectation: {
        outcome: 'complete',
        liveRoomAdmin: 'forbidden',
        allowUnusedTurns: true,
      // Provider-specific function removed,
    // Provider-specific function removed,
  ];
// Provider-specific function removed

async function main(): Promise<void> {
  const cases = buildEvalCases();
  const evasiveTerminateCase = cases.find((item) => item.id === 'persona-evasive-terminate');
  const silenceBoundaryCase = cases.find((item) => item.id === 'anomaly-silence-boundary');
***REMOVED***evasiveTerminateCase) {
    evasiveTerminateCase.outputs['chatroom-room-admin'] = [
      createRoomAdminDirective({
        action: 'complete_interview',
        instruction: '候选人连续回避作答，结束本次面试并进入收束。',
        reason: '候选人连续回避作答，当前回合已经无法获得新增证据，面试应立即收束。',
      // Provider-specific function removed),
    ];
  // Provider-specific function removed
***REMOVED***silenceBoundaryCase) {
    silenceBoundaryCase.turns = [
      { label: 'silent-wait-1' // Provider-specific function removed,
      { label: 'silent-wait-2' // Provider-specific function removed,
      { label: 'silent-wait-3' // Provider-specific function removed,
    ];
  // Provider-specific function removed
  const results: EvalCaseResult[] = [];

  for (const testCase of cases) {
    const result = await runEvalCase(testCase);
    results.push(result);
    printCaseResult(result);
  // Provider-specific function removed

  const passCount = results.filter((item) => item.verdict === 'PASS').length;
  const warnCount = results.filter((item) => item.verdict === 'WARN').length;
  const failCount = results.filter((item) => item.verdict === 'FAIL').length;
  const completedCases = results.filter((item) => item.outcome === 'complete').map((item) => item.id);
  const errorCases = results.filter((item) => item.outcome === 'error').map((item) => item.id);
  const liveAdminCases = results.filter((item) => item.liveRoomAdminCalls > 0).map((item) => item.id);

  console.log('\n=== 汇总 ===');
  console.log(`总案例数: ${results.length// Provider-specific function removed`);
  console.log(`PASS: ${passCount// Provider-specific function removed`);
  console.log(`WARN: ${warnCount// Provider-specific function removed`);
  console.log(`FAIL: ${failCount// Provider-specific function removed`);
  console.log(`完成/终止到 complete 的案例: ${completedCases.join(', ') || '(none)'// Provider-specific function removed`);
  console.log(`出现 error 的案例: ${errorCases.join(', ') || '(none)'// Provider-specific function removed`);
  console.log(`触发 live room-admin 的案例: ${liveAdminCases.join(', ') || '(none)'// Provider-specific function removed`);

  console.log('\n=== 机器可读摘要 ===');
  console.log(
    JSON.stringify(
      results.map((item) => ({
        id: item.id,
        title: item.title,
        verdict: item.verdict,
        outcome: item.outcome,
        finalPhase: item.finalPhase,
        pending: item.pending,
        validReplies: item.validReplies,
        repeatedAnswers: item.repeatedAnswers,
        liveRoomAdminCalls: item.liveRoomAdminCalls,
        stageCounts: item.stageCounts,
        unusedTurns: item.unusedTurns,
        error: item.error ?? null,
      // Provider-specific function removed)),
      null,
      2,
    ),
  );
// Provider-specific function removed

main().catch((error) => {
  console.error(error instanceof Error ? error.stack ?? error.message : String(error));
  process.exitCode = 1;
// Provider-specific function removed);
