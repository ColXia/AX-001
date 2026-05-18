import { mkdirSync, writeFileSync // Provider-specific function removed from 'node:fs';
import { resolve // Provider-specific function removed from 'node:path';

import { setTracingDisabled // Provider-specific function removed from '@openai/agents-core';

import type { InterviewSummary // Provider-specific function removed from '../agents/schemas.js';
import { createRuntimeModelBinding, loadAppConfig // Provider-specific function removed from '../config/app-config.js';
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
import type {
  ChatroomAgentContext,
  ChatroomInterviewInternalSignalTag,
  ChatroomMessage,
// Provider-specific function removed from '../workflows/chatroom-types.js';
import {
  classifyInterviewCandidateTurnMessage,
  countConsecutiveRepeatedCandidateAnswers,
  countInterviewCandidateReplies,
  findLatestInterviewerPrompt,
// Provider-specific function removed from '../workflows/interview-room-utils.js';
import { resolveInterviewStatusFromState // Provider-specific function removed from '../workflows/interview-room-controller.js';
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
const CANDIDATE_GENERATION_MAX_ATTEMPTS = 4;
const MAX_INTERVIEW_CANDIDATE_TURNS = 8;
const CANDIDATE_MAX_CONTEXT_MESSAGES = 6;
const TRANSCRIPT_TAIL_LIMIT = 10;
const INTERNAL_NOTE_TAIL_LIMIT = 6;

interface CandidatePersona {
  id: string;
  title: string;
  description: string;
  expectedOutcome: 'complete' | 'aborted';
  candidateBackground: string;
  guidance: string[];
// Provider-specific function removed

interface PersonaRunResult {
  personaId: string;
  title: string;
  description: string;
  expectedOutcome: CandidatePersona['expectedOutcome'];
  actualOutcome: 'complete' | 'aborted' | 'max_turns' | 'error';
  roomId: string;
  latestRunStatus: string | undefined;
  completedRunCount: number;
  failedRunCount: number;
  workflowRunCount: number;
  connectionRetryCount: number;
  candidateGenerationRetryCount: number;
  messageCount: number;
  candidateAnswerCount: number;
  repeatedAnswerTailCount: number;
  interviewerStagesSeen: string[];
  finalSummaryPresent: boolean;
  interviewStatus: InterviewSummary['interviewStatus'] | null;
  currentStage: string | null;
  interviewReadiness: InterviewSummary['interviewReadiness'] | null;
  overallScore: number | null;
  competencyScores: Array<{ dimension: string; score: number // Provider-specific function removed>;
  roomAdminCallCount: number;
  hostCallCount: number;
  recorderCallCount: number;
  roomAdminActions: string[];
  hostActions: string[];
  internalSignalCounts: Record<string, number>;
  transcriptTail: string[];
  internalNoteTail: string[];
  latestPromptTrail: string[];
  error?: string;
// Provider-specific function removed

const PERSONAS: CandidatePersona[] = [
  {
    id: 'strong_normal',
    title: '正常发挥的强样本',
    description: '项目经历完整、表达清楚、能给具体数据和自己的判断。',
    expectedOutcome: 'complete',
    candidateBackground:
      '计算机本科大四，做过后端课程项目和一段电商后端实习，对订单、库存、缓存一致性和问题排查有真实经历。',
    guidance: [
      '你现在扮演一位真实的计算机本科求职者，目标是完成一场后端/通用计算机岗位面试。',
      '你的风格是：直接回答、信息完整、愿意给出具体项目细节、指标、排查动作、取舍理由和最后结果。',
      '当问题要求项目经历时，优先使用你做过的订单/库存/缓存/接口性能优化案例；不要编造成资深工程师，但可以体现本科生里较强的一面。',
      '当问题要求协作或动机时，强调你会主动推进、能对齐目标、能复盘、希望在真实业务环境里成长。',
      '统一使用简体中文，像真实面试者说话，不要使用 markdown 列表。',
    ],
  // Provider-specific function removed,
  {
    id: 'weak_honest',
    title: '没学好但诚实配合',
    description: '经验偏浅，但不装懂，愿意承认不会并尽量给出自己做过的内容。',
    expectedOutcome: 'complete',
    candidateBackground:
      '计算机本科应届生，做过课程作业、实验室系统和短期实习，基础尚可，但复杂系统经验有限。',
    guidance: [
      '你现在扮演一位真实的计算机本科求职者，基础一般、经验偏浅，但态度诚实且配合。',
      '你的风格是：先直接回答，再明确说出哪些部分是你亲手做的、哪些部分是同学或带教帮助完成的。',
      '如果问题超出你的真实经验，不要硬编；可以承认经验不足，但要补充你学到了什么、下次会怎么做、你能承担什么基础工作。',
      '你仍然想认真完成整场面试，所以不要消极终止，也不要一直说不知道。',
      '统一使用简体中文，保持口语化和真实感。',
    ],
  // Provider-specific function removed,
  {
    id: 'evasive_perfunctory',
    title: '能力可能够但明显敷衍',
    description: '更关心平台和机会，回答泛泛而谈、回避细节，测试 room-admin 是否能识别并终止。',
    expectedOutcome: 'aborted',
    candidateBackground:
      '计算机本科生，有一些项目和实习经历，但这次面试投入度不高，更像在试探机会，不太愿意展开细节。',
    guidance: [
      '你现在扮演一位真实但明显比较敷衍的求职者。',
      '你的风格是：大多数问题只给泛化回答，强调学习能力、适应力、平台机会、执行力，不主动给出具体数字、排查步骤或明确案例。',
      '如果面试官连续追问细节，你仍然尽量回避，最多笼统地说自己做过类似事情，但不要真正展开关键证据。',
      '不要主动退出面试，也不要故意说乱码；要像现实里“能聊但不愿认真答”的候选人。',
      '统一使用简体中文，保持礼貌但敷衍。',
    ],
  // Provider-specific function removed,
  {
    id: 'positive_average',
    title: '态度好但水平一般',
    description: '愿意配合，表达较稳，但深度和亮点一般。',
    expectedOutcome: 'complete',
    candidateBackground:
      '计算机本科大四，做过实验室预约系统、课程项目和基础后端开发，配合度高，学习态度好，但项目复杂度中等。',
    guidance: [
      '你现在扮演一位态度好、配合度高、但整体水平中等的本科候选人。',
      '你的风格是：愿意回答所有问题，能给出项目案例，但深度有限，指标不一定很多，思考比较朴素。',
      '当被追问时，尽量补充真实动作和取舍，但不要突然表现成非常强的资深选手。',
      '动机部分要体现认真、稳定、愿意学习和配合团队。',
      '统一使用简体中文，保持自然、真诚。',
    ],
  // Provider-specific function removed,
];

async function main(): Promise<void> {
  const appConfig = loadAppConfig();
  setTracingDisabled(appConfig.runtime.tracingDisabled);
  const selectedPersonas = resolveSelectedPersonas(PERSONAS);

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

  const startedAt = Date.now();
  const results: PersonaRunResult[] = [];
  const stamp = createTimestamp();
  const outputDirectory = resolve(process.cwd(), 'runs');
  mkdirSync(outputDirectory, { recursive: true // Provider-specific function removed);

  for (const persona of selectedPersonas) {
    console.log(`\n=== Running persona: ${persona.id// Provider-specific function removed | ${persona.title// Provider-specific function removed ===`);
    try {
      const result = await runPersonaScenario({
        persona,
        agentRuntime: runtime,
        workflowRuntime,
      // Provider-specific function removed);
      results.push(result);
      printPersonaResult(result);
    // Provider-specific function removed catch (error) {
      const message = error instanceof Error ? error.stack ?? error.message : String(error);
      console.error(`[persona ${persona.id// Provider-specific function removed] ${message// Provider-specific function removed`);
      results.push({
        personaId: persona.id,
        title: persona.title,
        description: persona.description,
        expectedOutcome: persona.expectedOutcome,
        actualOutcome: 'error',
        roomId: '-',
        latestRunStatus: undefined,
        completedRunCount: 0,
        failedRunCount: 0,
        workflowRunCount: 0,
        connectionRetryCount: 0,
        candidateGenerationRetryCount: 0,
        messageCount: 0,
        candidateAnswerCount: 0,
        repeatedAnswerTailCount: 0,
        interviewerStagesSeen: [],
        finalSummaryPresent: false,
        interviewStatus: null,
        currentStage: null,
        interviewReadiness: null,
        overallScore: null,
        competencyScores: [],
        roomAdminCallCount: 0,
        hostCallCount: 0,
        recorderCallCount: 0,
        roomAdminActions: [],
        hostActions: [],
        internalSignalCounts: {// Provider-specific function removed,
        transcriptTail: [],
        internalNoteTail: [],
        latestPromptTrail: [],
        error: message,
      // Provider-specific function removed);
    // Provider-specific function removed

    persistReports({
      outputDirectory,
      stamp,
      providerModel: appConfig.provider.model,
      startedAt,
      results,
    // Provider-specific function removed);
  // Provider-specific function removed

  const durationMs = Date.now() - startedAt;
  const { jsonPath, mdPath, report // Provider-specific function removed = persistReports({
    outputDirectory,
    stamp,
    providerModel: appConfig.provider.model,
    startedAt,
    results,
  // Provider-specific function removed);

  console.log('\n=== Final summary ===');
  console.log(`Model: ${appConfig.provider.model// Provider-specific function removed`);
  console.log(`Duration: ${Math.round(durationMs / 1000)// Provider-specific function removeds`);
  console.log(`JSON report: ${jsonPath// Provider-specific function removed`);
  console.log(`Markdown report: ${mdPath// Provider-specific function removed`);
  console.log(JSON.stringify(report.summary, null, 2));
// Provider-specific function removed

async function runPersonaScenario(args: {
  persona: CandidatePersona;
  agentRuntime: AgentRuntime;
  workflowRuntime: WorkflowRuntime<ChatroomState, ChatroomAgentContext>;
// Provider-specific function removed): Promise<PersonaRunResult> {
  const planned = planChatroomRoomScenario({
    scenarioTemplateId: 'interview_simulation',
    title: `Interview Demo Eval - ${args.persona.title// Provider-specific function removed`,
    topic: '计算机本科相关岗位面试 Demo',
    objective:
      'Run a realistic undergraduate interview demo with multiple interviewers, dynamic follow-up, and room-level handling for abnormal candidate behavior.',
    constraints: [
      'Use Simplified Chinese in the room.',
      'Keep the interview realistic for a computer-science undergraduate candidate.',
      'Focus on project evidence, troubleshooting, collaboration, motivation, and learning ability.',
      'If the candidate experience is shallow but cooperative, guide toward concrete student-level evidence instead of assuming senior production ownership.',
    ],
    runtimeConfig: {
      summaryEnabled: false,
      maxReplyCharacters: 1000,
    // Provider-specific function removed,
    governance: {
      host: {
        enabled: false,
        moderationStyle: 'structured',
        brief: 'Disabled for persona regression to reduce overhead and focus on interviewer-room-admin behavior.',
      // Provider-specific function removed,
      recorder: {
        enabled: false,
        updateMode: 'final_only',
        artifactFocus: [],
        brief: 'Disabled for persona regression; results are collected by the harness.',
      // Provider-specific function removed,
      roomAdmin: {
        enabled: true,
        interventionStyle: 'on_demand',
        canManageParticipants: false,
        canManagePhases: true,
        canInjectEvents: false,
        brief: 'Keeps the interview on track and terminates or retries when the candidate behavior blocks progress.',
      // Provider-specific function removed,
    // Provider-specific function removed,
    interview: {
      candidateName: 'Candidate',
      targetRole: '计算机本科相关岗位',
      targetLevel: '校招 / 初级',
      candidateBackground: args.persona.candidateBackground,
      companyStyle: 'supportive but evidence-driven',
      focusAreas: [
        '项目经历',
        '后端基础',
        '问题排查',
        '协作与沟通',
        '学习能力',
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

  console.log(`[room] ${room.roomId// Provider-specific function removed`);

  let workflowRunCount = 0;
  let connectionRetryCount = 0;
  let candidateGenerationRetryCount = 0;

  connectionRetryCount += await executeWorkflowStep(
    {
      workflowRuntime: args.workflowRuntime,
      roomId: room.roomId,
      rounds: 1,
    // Provider-specific function removed,
    `${args.persona.id// Provider-specific function removed:opening`,
  );
  workflowRunCount += 1;

  const promptTrail: string[] = [];

  for (let turn = 1; turn <= MAX_INTERVIEW_CANDIDATE_TURNS; turn += 1) {
    const state = loadChatroomRoomState(room.roomId);
  ***REMOVED***isFinishedInterview(state)) {
      break;
    // Provider-specific function removed

    const prompt = requireLatestInterviewPrompt(state.messages);
    promptTrail.push(`${prompt.authorName// Provider-specific function removed[${prompt.authorId// Provider-specific function removed]: ${truncate(prompt.content, 140)// Provider-specific function removed`);
    console.log(
      `[turn ${turn// Provider-specific function removed] ${prompt.authorName// Provider-specific function removed (${prompt.authorId// Provider-specific function removed) -> ${truncate(prompt.content, 120)// Provider-specific function removed`,
    );

    const answerResult = await generateInterviewCandidateAnswer({
      agentRuntime: args.agentRuntime,
      persona: args.persona,
      state,
      prompt,
      turn,
    // Provider-specific function removed);
    candidateGenerationRetryCount += answerResult.retryCount;

    console.log(`[candidate] ${truncate(answerResult.answer, 160)// Provider-specific function removed`);

    connectionRetryCount += await executeWorkflowStep(
      {
        workflowRuntime: args.workflowRuntime,
        roomId: room.roomId,
        rounds: 1,
        humanAuthorName: 'Candidate',
        humanMessage: answerResult.answer,
      // Provider-specific function removed,
      `${args.persona.id// Provider-specific function removed:turn-${turn// Provider-specific function removed`,
    );
    workflowRunCount += 1;

  ***REMOVED***isFinishedInterview(loadChatroomRoomState(room.roomId))) {
      break;
    // Provider-specific function removed
  // Provider-specific function removed

  const finalState = loadChatroomRoomState(room.roomId);
  const runs = listChatroomExecutionRuns(room.roomId, 64);
  const latestRun = getLatestChatroomExecutionRun(room.roomId);
  const agentTurns = listChatroomAgentTurns(room.roomId, { limit: 512 // Provider-specific function removed);
  const summary = isInterviewSummary(finalState.finalSummary)
    ? finalState.finalSummary
    : undefined;
  const resolvedInterviewStatus = resolveInterviewStatusFromState(finalState);
  const roomAdminActions =
    finalState.roomAdminState?.history.map((directive) => directive.action) ?? [];
  const hostActions =
    finalState.hostState?.history.map((directive) => directive.action) ?? [];
  const interviewerStagesSeen = [
    ...new Set(
      finalState.messages
        .filter((message) => message.role === 'agent' && INTERVIEWER_IDS.has(message.authorId))
        .map((message) => message.authorId),
    ),
  ];

  return {
    personaId: args.persona.id,
    title: args.persona.title,
    description: args.persona.description,
    expectedOutcome: args.persona.expectedOutcome,
    actualOutcome: resolveActualOutcome(finalState),
    roomId: room.roomId,
    latestRunStatus: latestRun?.status,
    completedRunCount: runs.filter((run) => run.status === 'completed').length,
    failedRunCount: runs.filter((run) => run.status === 'failed').length,
    workflowRunCount,
    connectionRetryCount,
    candidateGenerationRetryCount,
    messageCount: finalState.messages.length,
    candidateAnswerCount: countInterviewCandidateReplies(finalState.messages),
    repeatedAnswerTailCount: countConsecutiveRepeatedCandidateAnswers(finalState.messages),
    interviewerStagesSeen,
    finalSummaryPresent: Boolean(finalState.finalSummary),
    interviewStatus: summary?.interviewStatus ?? resolvedInterviewStatus,
    currentStage: summary?.currentStage ?? finalState.interviewCurrentPhase ?? null,
    interviewReadiness: summary?.interviewReadiness ?? null,
    overallScore: summary?.overallScore ?? null,
    competencyScores:
      summary?.competencyScores.map((item) => ({
        dimension: item.dimension,
        score: item.score,
      // Provider-specific function removed)) ?? [],
    roomAdminCallCount: agentTurns.filter((turn) => turn.profileId === 'chatroom-room-admin').length,
    hostCallCount: agentTurns.filter((turn) => turn.profileId === 'chatroom-host').length,
    recorderCallCount: agentTurns.filter((turn) => turn.profileId === 'chatroom-recorder').length,
    roomAdminActions,
    hostActions,
    internalSignalCounts: collectInternalSignalCounts(finalState),
    transcriptTail: summarizeTranscriptTail(finalState.messages),
    internalNoteTail:
      finalState.interviewInternalNotes
        ?.slice(-INTERNAL_NOTE_TAIL_LIMIT)
        .map((note) => {
          const tags =
            note.signalTags && note.signalTags.length > 0
              ? ` [${note.signalTags.join(', ')// Provider-specific function removed]`
              : '';
          return `${note.authorName// Provider-specific function removed[${note.authorId// Provider-specific function removed]${tags// Provider-specific function removed: ${truncate(note.content, 140)// Provider-specific function removed`;
        // Provider-specific function removed) ?? [],
    latestPromptTrail: promptTrail.slice(-TRANSCRIPT_TAIL_LIMIT),
  // Provider-specific function removed;
// Provider-specific function removed

async function generateInterviewCandidateAnswer(args: {
  agentRuntime: AgentRuntime;
  persona: CandidatePersona;
  state: Readonly<ChatroomState>;
  prompt: ChatroomMessage;
  turn: number;
// Provider-specific function removed): Promise<{ answer: string; retryCount: number // Provider-specific function removed> {
  const profile = {
    id: `persona-${args.persona.id// Provider-specific function removed`,
    name: `Persona ${args.persona.title// Provider-specific function removed`,
    description: args.persona.description,
    instructions: [
      ...args.persona.guidance,
      `候选人背景：${args.persona.candidateBackground// Provider-specific function removed`,
      '严格围绕“最新问题”直接作答；如果上一轮被指出答非所问，就要继续保持本 persona 的行为方式，但仍然回应对方刚刚的问题。',
      '回答长度控制在 3-6 句，尽量像真实口语，不要输出标题，不要说“作为候选人/根据设定”。',
    ].join(' '),
    outputType: 'text' as const,
    modelSettings: {
      temperature: args.persona.id === 'evasive_perfunctory' ? 0.6 : 0.35,
    // Provider-specific function removed,
  // Provider-specific function removed;

  const recentMessages = args.state.messages.slice(-CANDIDATE_MAX_CONTEXT_MESSAGES);
  const previousCandidateAnswers = args.state.messages
    .filter((message) => message.role === 'user' && message.round > 0)
    .slice(-2)
    .map((message, index) => `Earlier answer ${index + 1// Provider-specific function removed: ${message.content// Provider-specific function removed`);

  const input = [
    `Turn: ${args.turn// Provider-specific function removed`,
    `Persona: ${args.persona.title// Provider-specific function removed`,
    'Recent transcript:',
    ...recentMessages.map((message) =>
      `${message.authorName// Provider-specific function removed [${message.role// Provider-specific function removed/${message.authorId// Provider-specific function removed]: ${truncate(message.content, 300)// Provider-specific function removed`),
    'Latest question to answer now:',
    `${args.prompt.authorName// Provider-specific function removed: ${args.prompt.content// Provider-specific function removed`,
    previousCandidateAnswers.length > 0
      ? `Avoid blindly repeating these earlier answers unless the latest question asks for the same evidence:\n${previousCandidateAnswers.join('\n')// Provider-specific function removed`
      : undefined,
    'Answer only the latest question.',
  ]
    .filter((item): item is string => Boolean(item))
    .join('\n');

  let retryCount = 0;
  let lastError: unknown;

  for (let attempt = 1; attempt <= CANDIDATE_GENERATION_MAX_ATTEMPTS; attempt += 1) {
    try {
    ***REMOVED***attempt > 1) {
        console.log(`[retry] candidate-generation ${args.persona.id// Provider-specific function removed attempt ${attempt// Provider-specific function removed/${CANDIDATE_GENERATION_MAX_ATTEMPTS// Provider-specific function removed`);
      // Provider-specific function removed
      const result = await args.agentRuntime.runDetailed(
        profile,
        input,
        {
          maxTurns: 4,
        // Provider-specific function removed,
      );
      const output =
        typeof result.output === 'string'
          ? result.output.trim()
          : String(result.output ?? '').trim();
    ***REMOVED***output) {
        return {
          answer: output,
          retryCount,
        // Provider-specific function removed;
      // Provider-specific function removed
      lastError = new Error('Candidate generation returned empty output.');
    // Provider-specific function removed catch (error) {
      lastError = error;
    ***REMOVED***!isRetriableConnectionError(error) || attempt === CANDIDATE_GENERATION_MAX_ATTEMPTS) {
        break;
      // Provider-specific function removed
      retryCount += 1;
      await sleep(attempt * 2_000);
    // Provider-specific function removed
  // Provider-specific function removed

  throw lastError instanceof Error ? lastError : new Error(String(lastError));
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
  const prompt =
    [...messages]
      .reverse()
      .find((message) => message.role === 'agent' && INTERVIEW_PROMPTER_IDS.has(message.authorId)) ??
    findLatestInterviewerPrompt(messages);

***REMOVED***!prompt) {
    throw new Error('No interview prompt was found in the transcript.');
  // Provider-specific function removed

  return prompt;
// Provider-specific function removed

function isFinishedInterview(state: Readonly<ChatroomState>***REMOVED***
***REMOVED***state.interviewCurrentPhase === 'complete' && !state.interviewPendingCandidateReply) {
    return true;
  // Provider-specific function removed

  const resolvedStatus = resolveInterviewStatusFromState(state);
***REMOVED***
    (resolvedStatus === 'complete' || resolvedStatus === 'aborted') &&
    !state.interviewPendingCandidateReply
***REMOVED***
    return true;
  // Provider-specific function removed

  const summary = state.finalSummary;
  return isInterviewSummary(summary) &&
    (summary.interviewStatus === 'complete' || summary.interviewStatus === 'aborted');
// Provider-specific function removed

function resolveActualOutcome(
  state: Readonly<ChatroomState>,
): PersonaRunResult['actualOutcome'] {
  const resolvedStatus = resolveInterviewStatusFromState(state);
***REMOVED***resolvedStatus === 'complete') {
    return 'complete';
  // Provider-specific function removed
***REMOVED***resolvedStatus === 'aborted') {
    return 'aborted';
  // Provider-specific function removed

  const summary = state.finalSummary;
***REMOVED***isInterviewSummary(summary)) {
  ***REMOVED***summary.interviewStatus === 'complete') {
      return 'complete';
    // Provider-specific function removed
  ***REMOVED***summary.interviewStatus === 'aborted') {
      return 'aborted';
    // Provider-specific function removed
  // Provider-specific function removed

***REMOVED***state.interviewCurrentPhase === 'complete' && !state.interviewPendingCandidateReply) {
    return 'complete';
  // Provider-specific function removed

  return 'max_turns';
// Provider-specific function removed

function collectInternalSignalCounts(state: Readonly<ChatroomState>): Record<string, number> {
  const counts = new Map<ChatroomInterviewInternalSignalTag, number>();

  for (const note of state.interviewInternalNotes ?? []) {
    for (const tag of note.signalTags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    // Provider-specific function removed
  // Provider-specific function removed

  return Object.fromEntries(
    [...counts.entries()].sort((left, right) => right[1] - left[1]),
  );
// Provider-specific function removed

function summarizeTranscriptTail(messages: readonly ChatroomMessage[]): string[] {
  return messages
    .filter((message) => (message.role === 'agent' || message.role === 'user') && message.round > 0)
    .slice(-TRANSCRIPT_TAIL_LIMIT)
    .map((message) => {
      const kind =
        message.role === 'user'
          ? classifyInterviewCandidateTurnMessage(message)
          : undefined;
      return `${message.authorName// Provider-specific function removed[${message.authorId// Provider-specific function removed]${kind ? `/${kind// Provider-specific function removed` : ''// Provider-specific function removed: ${truncate(message.content, 160)// Provider-specific function removed`;
    // Provider-specific function removed);
// Provider-specific function removed

function buildMachineReadableReport(args: {
  generatedAt: string;
  durationMs: number;
  providerModel: string;
  results: PersonaRunResult[];
// Provider-specific function removed) {
  const completed = args.results.filter((item) => item.actualOutcome === 'complete').length;
  const aborted = args.results.filter((item) => item.actualOutcome === 'aborted').length;
  const errors = args.results.filter((item) => item.actualOutcome === 'error').length;
  const maxTurns = args.results.filter((item) => item.actualOutcome === 'max_turns').length;
  const matchedExpectation = args.results.filter(
    (item) => item.actualOutcome === item.expectedOutcome,
  ).length;

  return {
    generatedAt: args.generatedAt,
    providerModel: args.providerModel,
    durationMs: args.durationMs,
    summary: {
      totalCases: args.results.length,
      completed,
      aborted,
      maxTurns,
      errors,
      matchedExpectation,
    // Provider-specific function removed,
    cases: args.results,
  // Provider-specific function removed;
// Provider-specific function removed

function persistReports(args: {
  outputDirectory: string;
  stamp: string;
  providerModel: string;
  startedAt: number;
  results: PersonaRunResult[];
// Provider-specific function removed): {
  jsonPath: string;
  mdPath: string;
  report: ReturnType<typeof buildMachineReadableReport>;
// Provider-specific function removed {
  const durationMs = Date.now() - args.startedAt;
  const report = buildMachineReadableReport({
    generatedAt: new Date().toISOString(),
    durationMs,
    providerModel: args.providerModel,
    results: args.results,
  // Provider-specific function removed);
  const markdown = buildMarkdownReport({
    generatedAt: new Date().toISOString(),
    durationMs,
    providerModel: args.providerModel,
    results: args.results,
  // Provider-specific function removed);
  const jsonPath = resolve(args.outputDirectory, `interview-demo-persona-eval-${args.stamp// Provider-specific function removed.json`);
  const mdPath = resolve(args.outputDirectory, `interview-demo-persona-eval-${args.stamp// Provider-specific function removed.md`);
  writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)// Provider-specific function removed\n`, 'utf8');
  writeFileSync(mdPath, markdown, 'utf8');
  return {
    jsonPath,
    mdPath,
    report,
  // Provider-specific function removed;
// Provider-specific function removed

function buildMarkdownReport(args: {
  generatedAt: string;
  durationMs: number;
  providerModel: string;
  results: PersonaRunResult[];
// Provider-specific function removed): string {
  const lines: string[] = [];
  lines.push('# Interview Demo 四类候选人完整流程测试');
  lines.push('');
  lines.push(`- 生成时间: ${args.generatedAt// Provider-specific function removed`);
  lines.push(`- 模型: ${args.providerModel// Provider-specific function removed`);
  lines.push(`- 总耗时: ${Math.round(args.durationMs / 1000)// Provider-specific function removed 秒`);
  lines.push(`- 案例数: ${args.results.length// Provider-specific function removed`);
  lines.push('');

  for (const result of args.results) {
    lines.push(`## ${result.title// Provider-specific function removed (${result.personaId// Provider-specific function removed)`);
    lines.push('');
    lines.push(`- 画像: ${result.description// Provider-specific function removed`);
    lines.push(`- 预期结果: ${result.expectedOutcome// Provider-specific function removed`);
    lines.push(`- 实际结果: ${result.actualOutcome// Provider-specific function removed`);
    lines.push(`- roomId: ${result.roomId// Provider-specific function removed`);
    lines.push(`- latestRunStatus: ${result.latestRunStatus ?? '-'// Provider-specific function removed`);
    lines.push(`- interviewStatus: ${result.interviewStatus ?? '-'// Provider-specific function removed`);
    lines.push(`- currentStage: ${result.currentStage ?? '-'// Provider-specific function removed`);
    lines.push(`- interviewReadiness: ${result.interviewReadiness ?? '-'// Provider-specific function removed`);
    lines.push(`- overallScore: ${result.overallScore ?? '-'// Provider-specific function removed`);
    lines.push(`- candidateAnswerCount: ${result.candidateAnswerCount// Provider-specific function removed`);
    lines.push(`- repeatedAnswerTailCount: ${result.repeatedAnswerTailCount// Provider-specific function removed`);
    lines.push(`- interviewerStagesSeen: ${result.interviewerStagesSeen.join(', ') || '-'// Provider-specific function removed`);
    lines.push(`- roomAdminCallCount: ${result.roomAdminCallCount// Provider-specific function removed`);
    lines.push(`- hostCallCount: ${result.hostCallCount// Provider-specific function removed`);
    lines.push(`- recorderCallCount: ${result.recorderCallCount// Provider-specific function removed`);
    lines.push(`- roomAdminActions: ${result.roomAdminActions.join(', ') || '-'// Provider-specific function removed`);
    lines.push(`- hostActions: ${result.hostActions.join(', ') || '-'// Provider-specific function removed`);
    lines.push(
      `- internalSignals: ${formatKeyValuePairs(result.internalSignalCounts) || '-'// Provider-specific function removed`,
    );
    lines.push(
      `- competencyScores: ${result.competencyScores.map((item) => `${item.dimension// Provider-specific function removed:${item.score// Provider-specific function removed`).join(', ') || '-'// Provider-specific function removed`,
    );
  ***REMOVED***result.error) {
      lines.push(`- error: ${result.error// Provider-specific function removed`);
    // Provider-specific function removed
    lines.push('');
    lines.push('### 最新问题轨迹');
    lines.push('');
    for (const line of result.latestPromptTrail) {
      lines.push(`- ${line// Provider-specific function removed`);
    // Provider-specific function removed
  ***REMOVED***result.latestPromptTrail.length === 0) {
      lines.push('- (none)');
    // Provider-specific function removed
    lines.push('');
    lines.push('### Transcript Tail');
    lines.push('');
    for (const line of result.transcriptTail) {
      lines.push(`- ${line// Provider-specific function removed`);
    // Provider-specific function removed
  ***REMOVED***result.transcriptTail.length === 0) {
      lines.push('- (none)');
    // Provider-specific function removed
    lines.push('');
    lines.push('### 内部协作尾部记录');
    lines.push('');
    for (const line of result.internalNoteTail) {
      lines.push(`- ${line// Provider-specific function removed`);
    // Provider-specific function removed
  ***REMOVED***result.internalNoteTail.length === 0) {
      lines.push('- (none)');
    // Provider-specific function removed
    lines.push('');
  // Provider-specific function removed

  return `${lines.join('\n')// Provider-specific function removed\n`;
// Provider-specific function removed

function formatKeyValuePairs(values: Record<string, number>): string {
  const entries = Object.entries(values);
***REMOVED***entries.length === 0) {
    return '';
  // Provider-specific function removed

  return entries
    .map(([key, value]) => `${key// Provider-specific function removed:${value// Provider-specific function removed`)
    .join(', ');
// Provider-specific function removed

function printPersonaResult(result: PersonaRunResult): void {
  console.log(`Outcome: ${result.actualOutcome// Provider-specific function removed (expected ${result.expectedOutcome// Provider-specific function removed)`);
  console.log(`Interview status: ${result.interviewStatus ?? '-'// Provider-specific function removed | readiness: ${result.interviewReadiness ?? '-'// Provider-specific function removed`);
  console.log(`Score: ${result.overallScore ?? '-'// Provider-specific function removed | candidate answers: ${result.candidateAnswerCount// Provider-specific function removed`);
  console.log(`Stages: ${result.interviewerStagesSeen.join(', ') || '-'// Provider-specific function removed`);
  console.log(`Room-admin calls: ${result.roomAdminCallCount// Provider-specific function removed | host calls: ${result.hostCallCount// Provider-specific function removed`);
***REMOVED***result.internalNoteTail.length > 0) {
    console.log('Internal notes tail:');
    for (const line of result.internalNoteTail) {
      console.log(`- ${line// Provider-specific function removed`);
    // Provider-specific function removed
  // Provider-specific function removed
// Provider-specific function removed

function isInterviewSummary(value: unknown): value is InterviewSummary {
  return value !== null && typeof value === 'object' && !Array.isArray(value) &&
    'overallScore' in value && 'interviewStatus' in value;
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

function createTimestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, '-');
// Provider-specific function removed

function resolveSelectedPersonas(personas: readonly CandidatePersona[]): CandidatePersona[] {
  const cliArgs = process.argv.slice(2);
  const rawPersonaIds =
    readOptionValue(cliArgs, '--persona') ??
    readOptionValue(cliArgs, '--personas') ??
    process.env.INTERVIEW_PERSONA_IDS;

***REMOVED***!rawPersonaIds) {
  ***REMOVED***...personas];
  // Provider-specific function removed

  const requested = new Set(
    rawPersonaIds
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
  );
  const selected = personas.filter((persona) => requested.has(persona.id));

***REMOVED***selected.length === 0) {
    throw new Error(
      `No persona matched "${rawPersonaIds// Provider-specific function removed". Available ids: ${personas.map((item) => item.id).join(', ')// Provider-specific function removed`,
    );
  // Provider-specific function removed

  return selected;
// Provider-specific function removed

function readOptionValue(args: readonly string[], option: string): string | undefined {
  for (const arg of args) {
  ***REMOVED***arg.startsWith(`${option// Provider-specific function removed=`)) {
      return arg.slice(option.length + 1);
    // Provider-specific function removed
  // Provider-specific function removed

  return undefined;
// Provider-specific function removed

main().catch((error) => {
  console.error(error instanceof Error ? error.stack ?? error.message : String(error));
  process.exitCode = 1;
// Provider-specific function removed);
