import { randomUUID // Provider-specific function removed from 'node:crypto';

import type {
  ChatroomFinalSummary,
  InterviewFeedbackItem,
  InterviewQuestionLog,
  InterviewSummary,
  InterviewTurnPlan,
  RoomKernelTurn,
// Provider-specific function removed from '../agents/schemas.js';
import {
  chatroomRoomAdminProfile,
  chatroomHostModerationProfile,
  chatroomRoomKernelProfile,
  chatroomSummaryProfile,
  createCustomRoleplaySpeakerProfiles,
  interviewPanelDiscussionProfile,
  interviewPanelHandoffProfile,
  interviewTurnPlannerProfile,
  interviewSummaryProfile,
  resolveChatroomSpeakerProfiles,
  roleplaySummaryProfile,
// Provider-specific function removed from '../agents/chatroom-profiles.js';
import type { AgentProfile // Provider-specific function removed from '../core/agent-profile.js';
import type { AgentRunTelemetry // Provider-specific function removed from '../core/agent-runtime.js';
import { createExecutionSignal // Provider-specific function removed from '../core/execution-control.js';
import {
  WorkflowRuntime,
  agentStep,
  parallelStep,
  type WorkflowExecuteOptions,
  type WorkflowDefinition,
  type WorkflowExecutionContext,
  type WorkflowStep,
// Provider-specific function removed from '../core/workflow.js';
import {
  DEFAULT_CHATROOM_ROOM_TYPE,
  type ChatroomRoomTypeId,
  resolveChatroomRoomType,
// Provider-specific function removed from './chatroom-room-types.js';
import {
  INTERVIEW_DEMO_ROOM_TITLE,
  type ChatroomRoomBlueprint,
  ensureChatroomRoomBlueprint,
  formatRoomBlueprintGovernanceSummary,
  resolveBlueprintSpeakerIds,
// Provider-specific function removed from './room-blueprints.js';
import {
  chatroomSpeakerPolicyHook,
  chatroomSummaryPolicyHook,
// Provider-specific function removed from './chatroom-policy-hooks.js';
import {
  applyChatroomRoomAdminTurn,
  buildInterviewInternalCollaborationPromptLines,
  buildInterviewRoomAdminIncidentSnapshot,
  buildChatroomRoomAdminFallback,
  buildRoomAdminPrompt,
  resolveInterviewRoomAdminControl,
  summarizeInterviewInternalCollaboration,
  type InterviewRoomAdminProgressSnapshot,
// Provider-specific function removed from '../room-governance/room-admin.js';
import { buildChatroomAgentThreadState, extractScratchMemoryFromOutput // Provider-specific function removed from './chatroom-agent-thread-state.js';
import { getChatroomParticipantBinding // Provider-specific function removed from '../room-storage/participant-repository.js';
import {
  applyChatroomHostModerationTurn,
  buildChatroomHostFallback,
  buildHostModerationPrompt,
// Provider-specific function removed from '../room-governance/room-host.js';
import {
  createCustomRoleplayTemplates,
  createInitialRoleplaySceneState,
  getRoleplaySpeakerRuntimeContext,
  rebuildRoleplaySceneState,
  type RoleplayCharacterTemplate,
  type RoleplaySceneState,
  updateRoleplaySceneState,
// Provider-specific function removed from './chatroom-roleplay-state.js';
import type { RoleplayCharacterCard // Provider-specific function removed from '../room-scenarios/roleplay/roleplay-characters.js';
import { createChatroomRecorderUpdate // Provider-specific function removed from '../room-governance/room-recorder.js';
import {
  type InterviewAskPhase,
  type InterviewPendingCandidateReplyState,
  type InterviewPhaseState,
  type ResolvedInterviewTurnPlan as ControllerResolvedInterviewTurnPlan,
  type InterviewStageCounts,
  collectInterviewStageCounts,
  compareInterviewPhaseState,
  createInterviewPendingCandidateReplyState,
  findLatestConversationMessage,
  getInterviewSummaryFromState,
  isInterviewWaitingForCandidateReply,
  mapInterviewAskPhaseToStatePhase,
  resolveLatestInterviewQuestionMessage,
  resolveInterviewCandidateControlPlan as resolveInterviewCandidateControlPlanFromController,
  resolveInterviewInsufficientAnswerPlan as resolveInterviewInsufficientAnswerPlanFromController,
  resolveInterviewStatusFromState,
  resolveInterviewPendingResponseMode,
  resolveMinimumInterviewPhaseState,
  resolveTrackedInterviewPendingCandidateReplyState,
  resolveTrackedInterviewPhaseState,
// Provider-specific function removed from './interview-room-controller.js';
import {
  assessInterviewAnswerCoverage,
  assessLatestInterviewCandidateAnswerCoverage,
  countConsecutiveNonResponsiveCandidateTurns,
  countConsecutiveInadequateCandidateAnswers,
  type InterviewAnswerCoverageAssessment,
  classifyInterviewCandidateTurnMessage,
  countConsecutiveRefusalCandidateTurns,
  countConsecutiveRepeatedCandidateAnswers,
  countInterviewCandidateReplies,
  detectRepeatedCandidateAnswer,
  findLatestInterviewCandidateAnswer,
  getLatestInterviewCandidateTurnState,
  hasInterviewEvasiveAnswerSignal,
  hasInterviewWeakAnswerSignal,
  INTERVIEW_HANDOFF_PREFIX,
  INTERVIEW_PANEL_DISCUSSION_PREFIX,
  inferInterviewStatusFromMessages,
  isInterviewMetaContent,
  looksLikeCorruptedInterviewText,
  MIN_CANDIDATE_REPLIES_FOR_COMPLETION,
  type InterviewCandidateTurnKind,
// Provider-specific function removed from './interview-room-utils.js';
import { buildChatContextWindow // Provider-specific function removed from './chatroom-retrieval.js';
import {
  buildInterviewSpeakerExecutionPromptLines,
  buildInterviewTransitionPromptLines,
  buildRoomSpeakerExecutionPromptLines,
// Provider-specific function removed from './room-speaker-playbooks.js';
import {
  resolveInterviewInternalSignalTags,
// Provider-specific function removed from './interview-internal-notes.js';
import {
  parseInterviewScoreDimensionsFromConstraints,
  resolveInterviewScoreTemplate,
// Provider-specific function removed from './interview-score-templates.js';
import type {
  ChatroomAgentContext,
  ChatroomHostDirective,
  ChatroomInterviewInternalNote,
  ChatroomRoomAdminState,
  ChatroomHostState,
  ChatroomRoomKernelState,
  ChatroomMessage,
  ChatroomRecorderState,
// Provider-specific function removed from './chatroom-types.js';
import {
  LEGACY_ROOM_RUNTIME_MODE,
  isLegacyRoomRuntimeMode,
  isNextRoomRuntimeMode,
  resolveRoomRuntimeModeFromBlueprint,
  type RoomRuntimeMode,
// Provider-specific function removed from './room-runtime-mode.js';

const DEFAULT_CHATROOM_ROUNDS = 2;

/**
 * Maximum consecutive 'wait' results from the interview planner before
 * forcing a partial completion. Prevents the interview from getting
 * permanently stuck when the candidate stops giving valid answers.
 */
const MAX_INTERVIEW_CONSECUTIVE_WAITS = 3;
const MAX_INTERVIEW_INTERNAL_NOTES_IN_STATE = 48;
const MAX_INTERVIEW_INTERNAL_NOTES_IN_CONTEXT = 10;
const SUMMARY_AGENT_TIMEOUT_MS = 90_000;
const INTERVIEW_FINAL_SUMMARY_AGENT_TIMEOUT_MS = 180_000;
const INTERVIEW_FINAL_SUMMARY_MAX_TIMEOUT_RETRIES = 1;
const INTERVIEW_COMPLETION_CLOSING_TIMEOUT_MS = 30_000;
const GOVERNANCE_AGENT_MAX_STRUCTURED_RETRIES = 1;
const INTERVIEW_COMPLETE_SCORE_DEFAULT_CAP = 88;
const INTERVIEW_COMPLETE_SCORE_STRONG_CAP = 90;
const INTERVIEW_COMPLETE_SCORE_EXCEPTIONAL_CAP = 92;
const HEURISTIC_INTERVIEW_QUANTITATIVE_PATTERNS = [
  /\d+(?:\.\d+)?\s*(?:ms|s|sec|seconds?|minutes?|hours?|%|percent|qps|rps|p\d+)/iu,
  /数据|指标|量化|百分比|毫秒|秒级|分钟级|小时级|成功率|失败率|比例|提升|下降/u,
];
const HEURISTIC_INTERVIEW_COLLABORATION_PATTERNS = [
  /cross-functional|cross team|stakeholder|alignment|align|owner|inventory|payment|support|business/i,
  /跨团队|协作|对齐|推进|推动|owner|库存|支付|客服|业务|团队/u,
];
const HEURISTIC_INTERVIEW_REASONING_PATTERNS = [
  /because|therefore|trade[- ]?off|reason|decision|judge|judgment|evaluate|evaluation/i,
  /因为|所以|因此|取舍|权衡|判断|评估|决策|依据/u,
];
const HEURISTIC_INTERVIEW_EXAMPLE_PATTERNS = [
  /for example|for instance|one time|once we|incident|outage|rollback|retrospective|case/i,
  /举例|案例|当时|那次|故障|回滚|复盘|有一次/u,
];
const HEURISTIC_INTERVIEW_MOTIVATION_PATTERNS = [
  /motivation|why this role|why us|interested in|want to|career|learn more/i,
  /动机|岗位匹配|为什么想来|想做|看重|想了解|职业/u,
];
const HEURISTIC_INTERVIEW_OWNERSHIP_PATTERNS = [
  /ownership|owner|drive|rollback|threshold|sla|guardrail/i,
  /负责|owner|推进|回滚|阈值|止损|SLA|兜底/u,
];
const HEURISTIC_INTERVIEW_REPAIR_PROMPT_PATTERNS = [
  /encoding issue|garbled|corrupt(?:ed)?|mojibake/i,
  /编码问题|乱码|显示异常|转码/u,
];

type HeuristicInterviewGapCategory = NonNullable<
  InterviewAnswerCoverageAssessment['missingCategory']
>;

interface HeuristicInterviewQuestionReview {
  prompt: ChatroomMessage;
  answer?: ChatroomMessage;
  turnKind?: InterviewCandidateTurnKind;
  coverage?: InterviewAnswerCoverageAssessment;
  stageLabel: string;
// Provider-specific function removed

interface HeuristicInterviewSignalCounts {
  quantitative: number;
  collaboration: number;
  reasoning: number;
  example: number;
  motivation: number;
  ownership: number;
// Provider-specific function removed

export interface ChatroomState {
  roomType: ChatroomRoomTypeId;
  scenarioTemplateId?: ChatroomRoomBlueprint['scenarioTemplateId'];
  roomBlueprint?: ChatroomRoomBlueprint;
  topic: string;
  objective: string;
  constraints: string[];
  speakerIds: string[];
  messages: ChatroomMessage[];
  roleplayScene?: RoleplaySceneState;
  customCharacters?: RoleplayCharacterCard[];
  customRoleplayTemplates?: Map<string, RoleplayCharacterTemplate>;
  finalSummary?: ChatroomFinalSummary;
  roomKernelState?: ChatroomRoomKernelState;
  roomAdminState?: ChatroomRoomAdminState;
  hostState?: ChatroomHostState;
  recorderState?: ChatroomRecorderState;
  maxReplyCharacters?: number;
  /** Tracks consecutive interview planner 'wait' results to detect stuck state. */
  interviewConsecutiveWaitCount?: number;
  /** Explicit interview phase marker. Once set, the planner must respect this
   *  as a hard constraint and cannot regress to an earlier phase. */
  interviewCurrentPhase?: InterviewPhaseState;
  /** Explicit interview pending-reply marker for strict one-question-at-a-time flow control. */
  interviewPendingCandidateReply?: InterviewPendingCandidateReplyState;
  /** Hidden collaboration notes shared across interviewer/admin/planner contexts. */
  interviewInternalNotes?: ChatroomInterviewInternalNote[];
  /** Explicit terminal marker for exceptional interview closure paths. */
  interviewTerminalStatus?: Extract<InterviewSummary['interviewStatus'], 'aborted'>;
// Provider-specific function removed

export interface ChatroomRunInput {
  roomId?: string;
  roomType?: ChatroomRoomTypeId;
  roomBlueprint?: ChatroomRoomBlueprint;
  topic: string;
  objective: string;
  constraints?: string[];
  rounds?: number;
  speakerIds?: string[];
  parallelBatchSize?: number;
  customCharacters?: RoleplayCharacterCard[];
  customRoleplayTemplates?: Map<string, RoleplayCharacterTemplate>;
  maxReplyCharacters?: number;
  summaryEnabled?: boolean;
// Provider-specific function removed

export interface ChatroomResumeInput {
  roomId?: string;
  additionalRounds?: number;
  humanMessage?: string;
  humanAuthorName?: string;
  parallelBatchSize?: number;
// Provider-specific function removed

export interface ChatroomWorkflowDefinitionInput {
  roomId?: string;
  roomType: ChatroomRoomTypeId;
  roomBlueprint?: ChatroomRoomBlueprint;
  startRound: number;
  rounds: number;
  speakerIds: string[];
  parallelBatchSize?: number;
  customCharacters?: RoleplayCharacterCard[];
  customRoleplayTemplates?: Map<string, RoleplayCharacterTemplate>;
  summaryEnabled?: boolean;
// Provider-specific function removed

export function createInitialChatroomState(input: ChatroomRunInput): ChatroomState {
  const roomBlueprint = ensureChatroomRoomBlueprint(input.roomBlueprint, {
    roomType: input.roomType,
    topic: input.topic,
    objective: input.objective,
    constraints: input.constraints,
    speakerIds: input.speakerIds,
    parallelBatchSize: input.parallelBatchSize,
    customCharacters: input.customCharacters,
    maxReplyCharacters: input.maxReplyCharacters,
    summaryEnabled: input.summaryEnabled,
  // Provider-specific function removed);
  const roomType = roomBlueprint.roomType;
  const roomTypeSpec = resolveChatroomRoomType(roomType);
  const constraints = [...roomBlueprint.constraints];
  const speakerIds = resolveBlueprintSpeakerIds(roomBlueprint);
  const customCharacters =
    roomBlueprint.customCharacters && roomBlueprint.customCharacters.length > 0
      ? structuredClone(roomBlueprint.customCharacters)
      : undefined;
  const customRoleplayTemplates = resolveCustomRoleplayTemplates({
    roomType,
    customCharacters,
    customRoleplayTemplates: input.customRoleplayTemplates,
  // Provider-specific function removed);
  const state: ChatroomState = {
    roomType,
    scenarioTemplateId: roomBlueprint.scenarioTemplateId,
    roomBlueprint,
    topic: roomBlueprint.topic,
    objective: roomBlueprint.objective,
    constraints,
    speakerIds,
    messages: [],
    customCharacters,
    customRoleplayTemplates,
    maxReplyCharacters: roomBlueprint.runtimeConfig.maxReplyCharacters,
    roleplayScene:
      roomTypeSpec.behavior === 'roleplay'
        ? createInitialRoleplaySceneState({
            topic: roomBlueprint.topic,
            objective: roomBlueprint.objective,
            speakerIds,
            constraints,
            customTemplates: customRoleplayTemplates,
          // Provider-specific function removed)
        : undefined,
    interviewCurrentPhase: isInterviewScenario(roomBlueprint) ? 'opening' : undefined,
  // Provider-specific function removed;

  appendChatroomMessage(state, {
    role: 'system',
    authorId: 'system',
    authorName: 'System',
    round: 0,
    content: buildInitialSystemMessage(roomBlueprint, roomTypeSpec),
  // Provider-specific function removed);
  appendChatroomMessage(state, {
    role: 'user',
    authorId: 'user',
    authorName: resolvePrimaryHumanParticipantLabel(roomBlueprint),
    round: 0,
    content: buildInitialUserSeedMessage(roomBlueprint, roomTypeSpec),
  // Provider-specific function removed);

  return state;
// Provider-specific function removed

export async function runChatroomWorkflow(
  workflowRuntime: WorkflowRuntime<ChatroomState, ChatroomAgentContext>,
  input: ChatroomRunInput,
  options: WorkflowExecuteOptions<ChatroomState> = {// Provider-specific function removed,
) {
  const initialState = createInitialChatroomState(input);
  const rounds = resolveRequestedChatroomRounds(
    initialState.roomBlueprint,
    input.rounds ?? DEFAULT_CHATROOM_ROUNDS,
  );

  return workflowRuntime.execute(
    createChatroomWorkflow({
      roomId: input.roomId,
      roomType: initialState.roomType,
      roomBlueprint: initialState.roomBlueprint,
      startRound: 1,
      rounds,
      speakerIds: initialState.speakerIds,
      parallelBatchSize: input.parallelBatchSize,
      customCharacters: initialState.customCharacters,
      customRoleplayTemplates: initialState.customRoleplayTemplates,
      summaryEnabled: initialState.roomBlueprint?.runtimeConfig.summaryEnabled,
    // Provider-specific function removed),
    initialState,
    options,
  );
// Provider-specific function removed

export async function continueChatroomWorkflow(
  workflowRuntime: WorkflowRuntime<ChatroomState, ChatroomAgentContext>,
  previousState: ChatroomState,
  input: ChatroomResumeInput = {// Provider-specific function removed,
  options: WorkflowExecuteOptions<ChatroomState> = {// Provider-specific function removed,
) {
  const state = structuredClone(previousState);
  state.roomBlueprint = ensureChatroomRoomBlueprint(state.roomBlueprint, {
    roomType: state.roomType,
    topic: state.topic,
    objective: state.objective,
    constraints: state.constraints,
    speakerIds: state.speakerIds,
    customCharacters: state.customCharacters,
    maxReplyCharacters: state.maxReplyCharacters,
    summaryEnabled: state.roomBlueprint?.runtimeConfig.summaryEnabled,
  // Provider-specific function removed);
  state.scenarioTemplateId = state.roomBlueprint.scenarioTemplateId;
  state.roomType = state.roomBlueprint.roomType;
  state.topic = state.roomBlueprint.topic;
  state.objective = state.roomBlueprint.objective;
  state.constraints = [...state.roomBlueprint.constraints];
  state.speakerIds = resolveBlueprintSpeakerIds(state.roomBlueprint);
  state.customCharacters =
    state.roomBlueprint.customCharacters && state.roomBlueprint.customCharacters.length > 0
      ? structuredClone(state.roomBlueprint.customCharacters)
      : undefined;
  state.customRoleplayTemplates = resolveCustomRoleplayTemplates({
    roomType: state.roomType,
    customCharacters: state.customCharacters,
    customRoleplayTemplates: state.customRoleplayTemplates,
  // Provider-specific function removed);
  state.maxReplyCharacters = state.roomBlueprint.runtimeConfig.maxReplyCharacters;
  state.interviewCurrentPhase = isInterviewScenario(state.roomBlueprint)
    ? resolveTrackedInterviewPhaseState(state)
    : undefined;
  state.interviewPendingCandidateReply = isInterviewScenario(state.roomBlueprint)
    ? resolveTrackedInterviewPendingCandidateReplyState(state)
    : undefined;
  const startRound = getNextChatroomRound(state.messages);

***REMOVED***input.humanMessage?.trim()) {
    const authorName =
      input.humanAuthorName?.trim() || resolvePrimaryHumanParticipantLabel(state.roomBlueprint);
    appendChatroomMessage(state, {
      role: 'user',
      authorId: createParticipantAuthorId(authorName, 'user'),
      authorName,
      round: startRound,
      content: input.humanMessage,
    // Provider-specific function removed);
  ***REMOVED***isInterviewScenario(state.roomBlueprint)) {
      state.interviewPendingCandidateReply = undefined;
      state.interviewTerminalStatus = undefined;
    // Provider-specific function removed
  // Provider-specific function removed

  state.finalSummary = undefined;
  const rounds = resolveRequestedChatroomRounds(
    state.roomBlueprint,
    input.additionalRounds ?? 1,
  );

  return workflowRuntime.execute(
    createChatroomWorkflow({
      roomId: input.roomId,
      roomType: state.roomType,
      roomBlueprint: state.roomBlueprint,
      startRound,
      rounds,
      speakerIds: state.speakerIds,
      parallelBatchSize: input.parallelBatchSize,
      customCharacters: state.customCharacters,
      customRoleplayTemplates: state.customRoleplayTemplates,
      summaryEnabled: state.roomBlueprint.runtimeConfig.summaryEnabled,
    // Provider-specific function removed),
    state,
    options,
  );
// Provider-specific function removed

export function createChatroomWorkflow(
  args: ChatroomWorkflowDefinitionInput,
): WorkflowDefinition<ChatroomState, ChatroomAgentContext> {
  const steps = [];
  const roomBlueprint = args.roomBlueprint;
  const runtimeMode = resolveRoomRuntimeModeFromBlueprint(roomBlueprint);
  const roomType = roomBlueprint?.roomType ?? args.roomType;
  const roomTypeSpec = resolveChatroomRoomType(roomType);
  const scenarioTemplateId = roomBlueprint?.scenarioTemplateId;
  const speakerIds = roomBlueprint ? resolveBlueprintSpeakerIds(roomBlueprint) : [...args.speakerIds];
  const customCharacters = roomBlueprint?.customCharacters ?? args.customCharacters;
  const speakers =
    customCharacters && customCharacters.length > 0 && roomTypeSpec.behavior === 'roleplay'
      ? createCustomRoleplaySpeakerProfiles(customCharacters)
      : resolveChatroomSpeakerProfiles(speakerIds, customCharacters);
  const parallelBatchSize = isInterviewScenario(roomBlueprint)
    ? 1
    : resolveChatroomParallelBatchSize(
        args.parallelBatchSize,
        speakers.length,
      );

***REMOVED***isInterviewScenario(roomBlueprint)) {
    for (let offset = 0; offset < args.rounds; offset += 1) {
      const round = args.startRound + offset;
    ***REMOVED***isNextRoomRuntimeMode(runtimeMode)) {
        steps.push(createRoomKernelStep({
          id: `chat-round-${round// Provider-specific function removed-room-kernel`,
          round,
          roomId: args.roomId,
          runtimeMode,
        // Provider-specific function removed));
      // Provider-specific function removed
    ***REMOVED***roomBlueprint?.governance.roomAdmin.enabled) {
      ***REMOVED***roomBlueprint?.governance.host.enabled) {
          steps.push(createInterviewGovernanceParallelStep({
            id: `chat-round-${round// Provider-specific function removed-governance`,
            round,
            roomId: args.roomId,
          // Provider-specific function removed));
        // Provider-specific function removed else {
          steps.push(createRoomAdminStep({
            id: `chat-round-${round// Provider-specific function removed-room-admin`,
            round,
            roomId: args.roomId,
          // Provider-specific function removed));
        // Provider-specific function removed
      // Provider-specific function removed else if (roomBlueprint?.governance.host.enabled) {
        steps.push(createHostModerationStep({
          id: `chat-round-${round// Provider-specific function removed-host`,
          round,
          roomId: args.roomId,
          roomType,
        // Provider-specific function removed));
      // Provider-specific function removed
      steps.push(
        createInterviewRoundStep({
          id: `chat-round-${round// Provider-specific function removed-interview`,
          round,
          roomId: args.roomId,
          speakers,
        // Provider-specific function removed),
      );
      // Add mid-round recorder checkpoint for interview continuous / stage_checkpoints modes.
      const interviewRecorderMode = roomBlueprint?.governance.recorder.updateMode;
    ***REMOVED***
        roomBlueprint?.governance.recorder.enabled &&
        (interviewRecorderMode === 'continuous' || interviewRecorderMode === 'stage_checkpoints')
    ***REMOVED***
        const recorderProfile = interviewSummaryProfile;
        steps.push(
          createNonBlockingScenarioSummaryStep({
            id: `chat-round-${round// Provider-specific function removed-recorder-checkpoint`,
            profile: recorderProfile,
            roomTypeSpec,
            scenarioTemplateId,
            roomId: args.roomId,
            round,
            mode: 'checkpoint',
          // Provider-specific function removed),
        );
      // Provider-specific function removed
    // Provider-specific function removed
  // Provider-specific function removed else {
    for (let offset = 0; offset < args.rounds; offset += 1) {
      const round = args.startRound + offset;
    ***REMOVED***isNextRoomRuntimeMode(runtimeMode)) {
        steps.push(createRoomKernelStep({
          id: `chat-round-${round// Provider-specific function removed-room-kernel`,
          round,
          roomId: args.roomId,
          runtimeMode,
        // Provider-specific function removed));
      // Provider-specific function removed
    ***REMOVED***roomBlueprint?.governance.roomAdmin.enabled) {
        steps.push(createRoomAdminStep({
          id: `chat-round-${round// Provider-specific function removed-room-admin`,
          round,
          roomId: args.roomId,
        // Provider-specific function removed));
      // Provider-specific function removed
    ***REMOVED***roomBlueprint?.governance.host.enabled) {
        steps.push(createHostModerationStep({
          id: `chat-round-${round// Provider-specific function removed-host`,
          round,
          roomId: args.roomId,
          roomType,
        // Provider-specific function removed));
      // Provider-specific function removed
      const speakerBatches = chunkSpeakers(speakers, parallelBatchSize);
      for (const [batchIndex, batch] of speakerBatches.entries()) {
      ***REMOVED***batch.length === 1) {
          const speaker = batch[0]!;
          steps.push(
            agentStep({
              id: `chat-round-${round// Provider-specific function removed-${speaker.id// Provider-specific function removed`,
              profile: speaker,
              buildInput: (state) =>
                buildRoomSpeakerTurnPrompt(roomTypeSpec, round, state, speaker, args.roomId),
              buildContext: createSpeakerContextBuilder(round, speaker, args.roomId),
              policyHooks: [chatroomSpeakerPolicyHook],
              maxTurns: 6,
              apply: ({ state, output // Provider-specific function removed) => {
                const { cleanOutput // Provider-specific function removed = extractScratchMemoryFromOutput(output);
                appendChatroomMessage(state, {
                  role: 'agent',
                  authorId: speaker.id,
                  authorName: resolveSpeakerDisplayName(state, args.roomId, speaker),
                  round,
                  content: cleanOutput,
                // Provider-specific function removed);
              // Provider-specific function removed,
            // Provider-specific function removed),
          );
          continue;
        // Provider-specific function removed

        steps.push(
          parallelStep<ChatroomState, ChatroomAgentContext>({
            id: `chat-round-${round// Provider-specific function removed-batch-${batchIndex + 1// Provider-specific function removed`,
            branches: batch.map((speaker) => ({
              id: speaker.id,
              profile: speaker,
              buildInput: (state) =>
                buildRoomSpeakerTurnPrompt(roomTypeSpec, round, state, speaker, args.roomId),
              buildContext: ({ state, workflowId, stepId // Provider-specific function removed) =>
                createChatroomContext({
                  state,
                  workflowId,
                  stepId,
                  round,
                  roomId: args.roomId,
                  speaker,
                  transcriptMessages: state.messages,
                // Provider-specific function removed),
              policyHooks: [chatroomSpeakerPolicyHook],
              maxTurns: 6,
            // Provider-specific function removed)),
            merge: ({ state, outputs // Provider-specific function removed) => {
              for (const speaker of batch) {
                const output = outputs.find((item) => item.branchId === speaker.id)?.output;
              ***REMOVED***typeof output !== 'string') {
                  continue;
                // Provider-specific function removed

                const { cleanOutput // Provider-specific function removed = extractScratchMemoryFromOutput(output);
                appendChatroomMessage(state, {
                  role: 'agent',
                  authorId: speaker.id,
                  authorName: resolveSpeakerDisplayName(state, args.roomId, speaker),
                  round,
                  content: cleanOutput,
                // Provider-specific function removed);
              // Provider-specific function removed
            // Provider-specific function removed,
          // Provider-specific function removed),
        );
      // Provider-specific function removed
      // Add mid-round recorder checkpoint for continuous / stage_checkpoints modes.
      const recorderUpdateMode = roomBlueprint?.governance.recorder.updateMode;
    ***REMOVED***
        roomBlueprint?.governance.recorder.enabled &&
        (recorderUpdateMode === 'continuous' || recorderUpdateMode === 'stage_checkpoints')
    ***REMOVED***
        const recorderProfile = resolveChatroomSummaryProfile(scenarioTemplateId, roomTypeSpec.behavior);
        steps.push(
          createNonBlockingScenarioSummaryStep({
            id: `chat-round-${round// Provider-specific function removed-recorder-checkpoint`,
            profile: recorderProfile,
            roomTypeSpec,
            scenarioTemplateId,
            roomId: args.roomId,
            round,
            mode: 'checkpoint',
          // Provider-specific function removed),
        );
      // Provider-specific function removed
    // Provider-specific function removed
  // Provider-specific function removed

  const effectiveSummaryEnabled =
    args.summaryEnabled ??
    roomBlueprint?.runtimeConfig.summaryEnabled ??
    roomTypeSpec.summaryEnabled;

***REMOVED***effectiveSummaryEnabled) {
    const summaryRound = args.startRound + args.rounds;
    const summaryProfile = resolveChatroomSummaryProfile(
      scenarioTemplateId,
      roomTypeSpec.behavior,
    );
    steps.push(
      createNonBlockingScenarioSummaryStep({
        id: 'chatroom-summary',
        profile: summaryProfile,
        roomTypeSpec,
        scenarioTemplateId,
        roomId: args.roomId,
        round: summaryRound,
        mode: 'final',
      // Provider-specific function removed),
    );
  // Provider-specific function removed

  return {
    id: 'chatroom',
    name: 'Chatroom Discussion Workflow',
    steps,
  // Provider-specific function removed;
// Provider-specific function removed

function createNonBlockingScenarioSummaryStep(args: {
  id: string;
  profile: AgentProfile<ChatroomAgentContext, any>;
  roomTypeSpec: ReturnType<typeof resolveChatroomRoomType>;
  scenarioTemplateId: ChatroomRoomBlueprint['scenarioTemplateId'] | undefined;
  roomId?: string;
  round: number;
  mode: 'checkpoint' | 'final';
// Provider-specific function removed): WorkflowStep<ChatroomState, ChatroomAgentContext> {
  return {
    id: args.id,
    kind: 'custom',
    agentIds: [args.profile.id],
    async execute(context) {
      const stateBefore = context.sharedState.readSnapshot();
      const startedAt = new Date().toISOString();
    ***REMOVED***
        args.scenarioTemplateId === 'interview_simulation' &&
        args.mode === 'final' &&
        !shouldRunFinalInterviewSummary(stateBefore.state)
    ***REMOVED***
        context.trace.push({
          stepId: args.id,
          kind: 'custom',
          agentIds: [args.profile.id],
          startedAt,
          endedAt: new Date().toISOString(),
          stateVersionBefore: stateBefore.version,
          stateVersionAfter: stateBefore.version,
          inputPreview: 'final interview summary skipped until the room reaches a terminal state',
          output: [],
          status: 'completed',
        // Provider-specific function removed);
        return;
      // Provider-specific function removed

      const input = buildSummaryPromptForScenario(
        args.roomTypeSpec,
        args.scenarioTemplateId,
        stateBefore.state,
      );
      const summaryContext = createSummaryContextBuilder(
        args.round,
        args.profile,
        args.roomId,
      )({
        state: stateBefore.state,
        workflowId: context.workflowId,
        stepId: args.id,
      // Provider-specific function removed);
      try {
        let runResult:
          | Awaited<ReturnType<typeof context.agentRuntime.runDetailed>>
          | undefined;
        let lastError: unknown;
        let attemptCount = 0;

        while (!runResult) {
          const summaryExecution = createExecutionSignal({
            parentSignal: context.signal,
            timeoutMs: resolveScenarioSummaryTimeoutMs(args.scenarioTemplateId, args.mode),
            scope: 'agent',
            targetId: args.profile.id,
            abortMessage: `Summary agent "${args.profile.id// Provider-specific function removed" was aborted.`,
          // Provider-specific function removed);

          try {
            runResult = await context.agentRuntime.runDetailed(args.profile, input, {
              context: summaryContext,
              maxTurns: 6,
              signal: summaryExecution.signal,
              policyHooks: [chatroomSummaryPolicyHook],
            // Provider-specific function removed);
          // Provider-specific function removed catch (error) {
            lastError = error;
          ***REMOVED***
              !shouldRetryScenarioSummaryRun({
                scenarioTemplateId: args.scenarioTemplateId,
                mode: args.mode,
                attemptCount,
                error,
              // Provider-specific function removed)
          ***REMOVED***
              break;
            // Provider-specific function removed
            attemptCount += 1;
            continue;
          // Provider-specific function removed finally {
            summaryExecution.cleanup();
          // Provider-specific function removed
        // Provider-specific function removed

      ***REMOVED***!runResult) {
          throw lastError instanceof Error ? lastError : new Error(String(lastError ?? 'Summary generation failed.'));
        // Provider-specific function removed

        const endedAt = new Date().toISOString();
        const mutation = context.sharedState.mutate((state) => {
          applyScenarioSummaryOutputToState({
            state,
            output: runResult.output as ChatroomFinalSummary,
            scenarioTemplateId: args.scenarioTemplateId,
            profile: args.profile,
            round: args.round,
            mode: args.mode,
          // Provider-specific function removed);
        // Provider-specific function removed, {
          expectedVersion: stateBefore.version,
          label: args.id,
        // Provider-specific function removed);

        context.trace.push({
          stepId: args.id,
          kind: 'custom',
          agentIds: [args.profile.id],
          startedAt,
          endedAt,
          stateVersionBefore: stateBefore.version,
          stateVersionAfter: mutation.version,
          inputPreview: input,
          output: [
            {
              profileId: args.profile.id,
              output: runResult.output,
              usage: runResult.usage,
              guardrails: runResult.guardrails,
              telemetry: runResult.telemetry,
              startedAt,
              endedAt,
              status: 'completed',
            // Provider-specific function removed,
          ],
          status: 'completed',
        // Provider-specific function removed);
        return;
      // Provider-specific function removed catch (error) {
        const endedAt = new Date().toISOString();
        const fallbackSummary =
          args.mode === 'final'
            ? createFallbackScenarioSummary(args.scenarioTemplateId, stateBefore.state)
            : undefined;
        const mutation = context.sharedState.mutate((state) => {
        ***REMOVED***fallbackSummary) {
            applyScenarioSummaryFallbackToState({
              state,
              fallbackSummary,
              scenarioTemplateId: args.scenarioTemplateId,
              profile: args.profile,
              round: args.round,
            // Provider-specific function removed);
          // Provider-specific function removed
        // Provider-specific function removed, {
          expectedVersion: stateBefore.version,
          label: args.id,
        // Provider-specific function removed);

        context.trace.push({
          stepId: args.id,
          kind: 'custom',
          agentIds: [args.profile.id],
          startedAt,
          endedAt,
          stateVersionBefore: stateBefore.version,
          stateVersionAfter: mutation.version,
          inputPreview: input,
          output: [
            {
              profileId: args.profile.id,
              output: fallbackSummary,
              startedAt,
              endedAt,
              status:
                fallbackSummary
                  ? 'completed'
                  : isAbortError(error)
                    ? 'cancelled'
                    : 'failed',
              error: fallbackSummary ? undefined : formatStepError(error),
            // Provider-specific function removed,
          ],
          status: 'partial',
          error: formatStepError(error),
        // Provider-specific function removed);
        return;
      // Provider-specific function removed
    // Provider-specific function removed,
  // Provider-specific function removed;
// Provider-specific function removed

function applyScenarioSummaryOutputToState(args: {
  state: ChatroomState;
  output: ChatroomFinalSummary;
  scenarioTemplateId: ChatroomRoomBlueprint['scenarioTemplateId'] | undefined;
  profile: AgentProfile<ChatroomAgentContext, any>;
  round: number;
  mode: 'checkpoint' | 'final';
// Provider-specific function removed): void {
  const normalizedOutput = normalizeScenarioSummaryOutput(
    args.scenarioTemplateId,
    args.state,
    args.output,
  );
***REMOVED***args.mode === 'final') {
    args.state.finalSummary = normalizedOutput;
  // Provider-specific function removed

  const recorderUpdate = createChatroomRecorderUpdate({
    currentState: args.state.recorderState,
    summary: normalizedOutput,
    governance: args.state.roomBlueprint?.governance,
    scenarioTemplateId: args.scenarioTemplateId,
    round: args.round,
    transcriptMessageCount: args.state.messages.length,
  // Provider-specific function removed);
  args.state.recorderState = recorderUpdate.recorderState;
  const summaryContent =
    args.mode === 'final'
      ? recorderUpdate.visibleMessage ??
        (shouldPublishSummaryMessage(args.scenarioTemplateId, normalizedOutput)
          ? resolveSummaryHeadline(normalizedOutput)
          : undefined)
      : recorderUpdate.visibleMessage;
***REMOVED***summaryContent) {
    appendChatroomMessage(args.state, {
      role: 'summary',
      authorId: args.profile.id,
      authorName: args.profile.name,
      round: args.round,
      content: summaryContent,
    // Provider-specific function removed);
  // Provider-specific function removed
// Provider-specific function removed

function applyScenarioSummaryFallbackToState(args: {
  state: ChatroomState;
  fallbackSummary: ChatroomFinalSummary;
  scenarioTemplateId: ChatroomRoomBlueprint['scenarioTemplateId'] | undefined;
  profile: AgentProfile<ChatroomAgentContext, any>;
  round: number;
// Provider-specific function removed): void {
  applyScenarioSummaryOutputToState({
    state: args.state,
    output: args.fallbackSummary,
    scenarioTemplateId: args.scenarioTemplateId,
    profile: args.profile,
    round: args.round,
    mode: 'final',
  // Provider-specific function removed);
// Provider-specific function removed

function createSpeakerContextBuilder(
  round: number,
  speaker: AgentProfile<ChatroomAgentContext, 'text'>,
  roomId?: string,
): (args: {
  state: Readonly<ChatroomState>;
  workflowId: string;
  stepId: string;
// Provider-specific function removed) => ChatroomAgentContext {
  return ({ state, workflowId, stepId // Provider-specific function removed) =>
    createChatroomContext({
      state,
      workflowId,
      stepId,
      roomId,
      round,
      speaker,
      transcriptMessages: state.messages,
    // Provider-specific function removed);
// Provider-specific function removed

function createSummaryContextBuilder(
  round: number,
  summaryProfile: AgentProfile<ChatroomAgentContext, any>,
  roomId?: string,
): (args: {
  state: Readonly<ChatroomState>;
  workflowId: string;
  stepId: string;
// Provider-specific function removed) => ChatroomAgentContext {
  return ({ state, workflowId, stepId // Provider-specific function removed) =>
    createChatroomContext({
      state,
      workflowId,
      stepId,
      roomId,
      round,
      speaker: summaryProfile,
      transcriptMessages: state.messages,
    // Provider-specific function removed);
// Provider-specific function removed

function createChatroomContext(args: {
  state: Readonly<ChatroomState>;
  workflowId: string;
  stepId: string;
  roomId?: string;
  round: number;
  speaker: AgentProfile<ChatroomAgentContext, any>;
  transcriptMessages: ChatroomMessage[];
// Provider-specific function removed): ChatroomAgentContext {
  const contextWindow = buildChatContextWindow({
    messages: args.transcriptMessages,
    topic: args.state.topic,
    objective: args.state.objective,
    constraints: args.state.constraints,
    speakerRole: args.speaker.description,
    currentRound: args.round,
  // Provider-specific function removed);
  const participantBinding = args.roomId
    ? getChatroomParticipantBinding(args.roomId, args.speaker.id)
    : null;
  const speakerThreadState = buildChatroomAgentThreadState({
    stableKey: args.speaker.id,
    displayName:
      participantBinding?.participant.displayName ?? args.speaker.name,
    participantType: isSummaryProfileId(args.speaker.id) ? 'summary' : 'agent',
    messages: args.transcriptMessages,
    previousMemoryState: participantBinding?.thread?.memoryState,
    lastReadSequenceNo: participantBinding?.thread?.lastMessageSequenceNo,
    currentRound: args.round,
  // Provider-specific function removed);

  return {
    workflowId: args.workflowId,
    stepId: args.stepId,
    roomId: args.roomId,
    roomBlueprintId: args.state.roomBlueprint?.blueprintId,
    scenarioTemplateId:
      args.state.roomBlueprint?.scenarioTemplateId ?? args.state.scenarioTemplateId,
    roomType: args.state.roomType,
    roomBehavior: resolveChatroomRoomType(args.state.roomType).behavior,
    roomRuntimeMode: resolveRoomRuntimeModeFromBlueprint(args.state.roomBlueprint),
    round: args.round,
    topic: args.state.topic,
    objective: args.state.objective,
    constraints: [...args.state.constraints],
    roomParticipantSlots: args.state.roomBlueprint?.participantSlots
      ? structuredClone(args.state.roomBlueprint.participantSlots)
      : undefined,
    roomGovernance: args.state.roomBlueprint?.governance
      ? structuredClone(args.state.roomBlueprint.governance)
      : undefined,
    roomKernelDirective: args.state.roomKernelState?.currentDirective
      ? structuredClone(args.state.roomKernelState.currentDirective)
      : undefined,
    roomAdminDirective: args.state.roomAdminState?.currentDirective
      ? structuredClone(args.state.roomAdminState.currentDirective)
      : undefined,
    roomHostDirective: args.state.hostState?.currentDirective
      ? structuredClone(args.state.hostState.currentDirective)
      : undefined,
    speakerId: args.speaker.id,
    speakerName:
      participantBinding?.participant.displayName ??
      resolveSpeakerDisplayName(args.state, args.roomId, args.speaker),
    speakerRole:
      participantBinding?.participant.roleLabel ??
      resolveSpeakerRole(args.state, args.speaker),
    speakerParticipantId: participantBinding?.participant.participantId,
    speakerParticipantRoleLabel: participantBinding?.participant.roleLabel,
    speakerIdentitySnapshot: participantBinding?.participant.identitySnapshot,
    speakerThreadId: participantBinding?.thread?.agentThreadId,
    speakerThreadStatus: participantBinding?.thread?.status,
    speakerThreadMemory:
      participantBinding?.thread?.memoryState?.messageCount ===
      speakerThreadState.memoryState.messageCount
        ? participantBinding.thread.memoryState
        : speakerThreadState.memoryState,
    speakerThreadSummary: {
      ...(participantBinding?.thread?.summaryState ?? {// Provider-specific function removed),
      ...speakerThreadState.summaryState,
    // Provider-specific function removed,
    speakerThreadLastReadSequenceNo: participantBinding?.thread?.lastMessageSequenceNo,
    messageCount: args.state.messages.length,
    recentMessages: contextWindow.recentMessages,
    relevantMessages: contextWindow.relevantMessages,
    transcriptMessages: [...args.transcriptMessages],
    interviewInternalNotes: selectInterviewInternalNotesForContext({
      state: args.state,
      speakerId: args.speaker.id,
    // Provider-specific function removed),
    roleplayScene: args.state.roleplayScene
      ? structuredClone(args.state.roleplayScene)
      : undefined,
    roleplaySpeaker: getRoleplaySpeakerRuntimeContext(args.state.roleplayScene, args.speaker.id),
    customCharacters: args.state.customCharacters
      ? structuredClone(args.state.customCharacters)
      : undefined,
    maxReplyCharacters: args.state.maxReplyCharacters ?? resolveChatroomRoomType(args.state.roomType).maxReplyCharacters,
    roomBlueprint: args.state.roomBlueprint ? structuredClone(args.state.roomBlueprint) : undefined,
  // Provider-specific function removed;
// Provider-specific function removed

function appendInterviewInternalNote(
  state: ChatroomState,
  note: Omit<ChatroomInterviewInternalNote, 'schemaVersion' | 'noteId'>,
): void {
  const content = note.content.trim();
***REMOVED***!content) {
    return;
  // Provider-specific function removed

  const nextNote: ChatroomInterviewInternalNote = {
    schemaVersion: 1,
    noteId: randomUUID(),
    ...note,
    signalTags: resolveInterviewInternalSignalTags({
      kind: note.kind,
      content,
      existingTags: note.signalTags,
    // Provider-specific function removed),
    content,
  // Provider-specific function removed;

  state.interviewInternalNotes = [
    ...(state.interviewInternalNotes ?? []),
    nextNote,
  ].slice(-MAX_INTERVIEW_INTERNAL_NOTES_IN_STATE);
// Provider-specific function removed

function selectInterviewInternalNotesForContext(args: {
  state: Readonly<ChatroomState>;
  speakerId: string;
// Provider-specific function removed): ChatroomInterviewInternalNote[] | undefined {
  const notes = args.state.interviewInternalNotes ?? [];
***REMOVED***notes.length === 0) {
    return undefined;
  // Provider-specific function removed

  const selected = new Map<string, ChatroomInterviewInternalNote>();
  const reverseNotes = [...notes].reverse();

  for (const note of reverseNotes) {
  ***REMOVED***note.authorId === args.speakerId || note.targetSpeakerId === args.speakerId) {
      selected.set(note.noteId, note);
    // Provider-specific function removed
  ***REMOVED***selected.size >= MAX_INTERVIEW_INTERNAL_NOTES_IN_CONTEXT) {
      break;
    // Provider-specific function removed
  // Provider-specific function removed

***REMOVED***selected.size < MAX_INTERVIEW_INTERNAL_NOTES_IN_CONTEXT) {
    for (const note of reverseNotes) {
    ***REMOVED***!note.targetSpeakerId) {
        selected.set(note.noteId, note);
      // Provider-specific function removed
    ***REMOVED***selected.size >= MAX_INTERVIEW_INTERNAL_NOTES_IN_CONTEXT) {
        break;
      // Provider-specific function removed
    // Provider-specific function removed
  // Provider-specific function removed

***REMOVED***selected.size < MAX_INTERVIEW_INTERNAL_NOTES_IN_CONTEXT) {
    for (const note of reverseNotes) {
      selected.set(note.noteId, note);
    ***REMOVED***selected.size >= MAX_INTERVIEW_INTERNAL_NOTES_IN_CONTEXT) {
        break;
      // Provider-specific function removed
    // Provider-specific function removed
  // Provider-specific function removed

***REMOVED***...selected.values()].reverse().map((note) => structuredClone(note));
// Provider-specific function removed

function isInterviewDemoBlueprint(
  roomBlueprint: Readonly<ChatroomRoomBlueprint> | undefined,
***REMOVED***
  return roomBlueprint?.title === INTERVIEW_DEMO_ROOM_TITLE &&
    roomBlueprint.scenarioTemplateId === 'interview_simulation' &&
    isLegacyRoomRuntimeMode(resolveRoomRuntimeModeFromBlueprint(roomBlueprint));
// Provider-specific function removed

function shouldUseInterviewDemoRoomAdminAgent(args: {
  state: Readonly<ChatroomState>;
  incidentSnapshot: ReturnType<typeof buildInterviewRoomAdminIncidentSnapshot>;
  collaborationSummary: ReturnType<typeof summarizeInterviewInternalCollaboration>;
// Provider-specific function removed***REMOVED***
  const candidateReplyCount = countInterviewCandidateReplies(args.state.messages);
  const stageCounts = collectInterviewStageCounts(args.state.messages);

***REMOVED***args.incidentSnapshot?.recommendedAction) {
    return true;
  // Provider-specific function removed

***REMOVED***args.collaborationSummary?.collaborationRecommendedActionHint) {
    return true;
  // Provider-specific function removed

  return candidateReplyCount >= 3 &&
    (stageCounts.technical >= 2 || stageCounts.manager >= 1 || stageCounts.observer >= 1);
// Provider-specific function removed

function buildInterviewRoomAdminProgressSnapshot(
  state: Readonly<ChatroomState>,
): InterviewRoomAdminProgressSnapshot {
  const latestAnswerCoverage = assessLatestInterviewCandidateAnswerCoverage(state.messages);
  const pendingCandidateReply = resolveTrackedInterviewPendingCandidateReplyState(state);
  const latestQuestionMessage = resolveLatestInterviewQuestionMessage(state.messages);

  return {
    candidateReplyCount: countInterviewCandidateReplies(state.messages),
    stageCounts: collectInterviewStageCounts(state.messages),
    trackedPhase: resolveTrackedInterviewPhaseState(state),
    minimumPhase: resolveMinimumInterviewPhaseState(state),
    interviewStatus: resolveInterviewStatusFromState(state),
    waitingForCandidate: Boolean(pendingCandidateReply),
    latestQuestionSpeakerId: latestQuestionMessage?.authorId,
    latestAnswerAdequate: latestAnswerCoverage?.isAdequate,
    latestAnswerMissingCategory: latestAnswerCoverage?.missingCategory,
  // Provider-specific function removed;
// Provider-specific function removed

function buildInterviewDemoOpeningQuestion(args: {
  state: Readonly<ChatroomState>;
  speaker: AgentProfile<ChatroomAgentContext, 'text'>;
// Provider-specific function removed): string {
  const speakerLabel =
    resolveBlueprintSpeakerLabel(args.state.roomBlueprint, args.speaker.id) ??
    args.speaker.name;
  const scenario = getScenarioMetadata(args.state);
  const targetRole = asOptionalString(scenario?.targetRole) ?? args.state.topic;
  const focusAreas = resolveInterviewFocusAreas(args.state);
  const introScope =
    focusAreas.length > 0
      ? '你的专业背景、目前的就读阶段，以及一个最能代表你能力的课程、项目或实习经历'
      : '你的专业背景、目前的就读阶段，以及你做过的项目、课程实践或实习经历';

  return `你好，我是今天的${speakerLabel// Provider-specific function removed。先请你做一个简短自我介绍，可以包括${introScope// Provider-specific function removed。如果你对 ${targetRole// Provider-specific function removed 方向有偏好，也可以一起说明。`;
// Provider-specific function removed

function buildInitialSystemMessage(
  roomBlueprint: Readonly<ChatroomRoomBlueprint>,
  roomTypeSpec: ReturnType<typeof resolveChatroomRoomType>,
): string {
***REMOVED***!isInterviewScenario(roomBlueprint)) {
    return appendGovernanceSystemMessage(
      roomTypeSpec.buildSystemMessage(),
      roomBlueprint,
    );
  // Provider-specific function removed

  return appendGovernanceSystemMessage(
    [
      '这是一个可实际使用的模拟面试房间。',
      isInterviewDemoBlueprint(roomBlueprint)
        ? '房间中的人类参与者是候选人，Agent 参与者依次承担 HR、技术面、综合能力追问和观察补充追问职责。'
        : '房间中的人类参与者是候选人，Agent 参与者依次承担 HR、技术面、经理面和观察补充追问职责。',
      '面试官每次只推进一个阶段，提出一个主问题后等待候选人回答，再进入下一轮。',
      '当面试官切换时，允许出现一条很短的面试官交接消息，用来说明已获得的信号和下一步要补的缺口。',
      '问题必须根据目标岗位方向调整：后端、前端、算法、产品等岗位不能套用同一套追问模板。',
      '所有评估都必须基于候选人已经说出的证据，信息不足时要保守判断。',
      isInterviewDemoBlueprint(roomBlueprint)
        ? '这是 demo 验证场景，允许面试官基于候选人现场回答动态调整追问，不要机械执行固定题单。'
        : undefined,
      '统一使用简体中文。',
    ].join('\n'),
    roomBlueprint,
  );
// Provider-specific function removed

function appendGovernanceSystemMessage(
  baseMessage: string,
  roomBlueprint: Readonly<ChatroomRoomBlueprint>,
): string {
  const governanceSummary = formatRoomBlueprintGovernanceSummary(
    roomBlueprint.governance,
  );

***REMOVED***
    baseMessage,
    '',
    `Room governance: ${governanceSummary// Provider-specific function removed.`,
    `Room admin brief: ${roomBlueprint.governance.roomAdmin.brief// Provider-specific function removed`,
    `Host brief: ${roomBlueprint.governance.host.brief// Provider-specific function removed`,
    `Recorder brief: ${roomBlueprint.governance.recorder.brief// Provider-specific function removed`,
  ].join('\n');
// Provider-specific function removed

export function buildRoomSpeakerTurnPrompt(
  roomTypeSpec: ReturnType<typeof resolveChatroomRoomType>,
  round: number,
  state: Readonly<ChatroomState>,
  speaker: AgentProfile<ChatroomAgentContext, 'text'>,
  roomId?: string,
): string {
  const base = roomTypeSpec.buildSpeakerTurnPrompt(round);
  const roomAdminDirective = state.roomAdminState?.currentDirective;
  const hostDirective = state.hostState?.currentDirective;
  const scenarioLines = buildRoomSpeakerExecutionPromptLines({
    roomBlueprint: state.roomBlueprint,
    round,
    speakerName: resolveSpeakerDisplayName(state, roomId, speaker),
    speakerRole: resolveSpeakerRole(state, speaker),
    currentPhaseLabel: state.roomAdminState?.currentPhaseLabel,
    currentPhaseObjective: state.roomAdminState?.currentPhaseObjective,
    currentBeat: state.roleplayScene?.currentBeat,
    latestEvent: state.roleplayScene?.latestEvent,
  // Provider-specific function removed);

***REMOVED***
    base,
    scenarioLines.length > 0 ? '' : undefined,
    scenarioLines.length > 0 ? 'Scenario execution guidance:' : undefined,
    ...scenarioLines.map((line) => `- ${line// Provider-specific function removed`),
    roomAdminDirective?.instruction
      ? `Room admin guidance: ${roomAdminDirective.instruction// Provider-specific function removed`
      : undefined,
    ...buildHostGuidanceLines(hostDirective),
    'Output requirements:',
    '1. Post exactly one room message.',
    `2. Keep the final message under ${state.maxReplyCharacters ?? roomTypeSpec.maxReplyCharacters// Provider-specific function removed characters.`,
    '3. Prefer 2-4 compact sentences and push only one main decision, risk, or action.',
  ]
    .filter((item): item is string => Boolean(item))
    .join('\n');
// Provider-specific function removed

function buildHostGuidanceLines(
  hostDirective: Readonly<ChatroomHostDirective> | undefined,
): string[] {
***REMOVED***!hostDirective?.focus && !hostDirective?.instruction) {
  ***REMOVED***];
  // Provider-specific function removed

***REMOVED***
    'Host guidance:',
    hostDirective.focus ? `Focus: ${hostDirective.focus// Provider-specific function removed` : undefined,
    hostDirective.instruction ? `Instruction: ${hostDirective.instruction// Provider-specific function removed` : undefined,
  ].filter((item): item is string => Boolean(item));
// Provider-specific function removed

function buildInitialUserSeedMessage(
  roomBlueprint: Readonly<ChatroomRoomBlueprint>,
  roomTypeSpec: ReturnType<typeof resolveChatroomRoomType>,
): string {
***REMOVED***!isInterviewScenario(roomBlueprint)) {
    return roomTypeSpec.buildSeedUserMessage({
      topic: roomBlueprint.topic,
      objective: roomBlueprint.objective,
      constraints: roomBlueprint.constraints,
    // Provider-specific function removed);
  // Provider-specific function removed

  const scenario = roomBlueprint.metadata?.scenario;
  const scenarioRecord =
    scenario && typeof scenario === 'object' && !Array.isArray(scenario)
      ? (scenario as Record<string, unknown>)
      : undefined;
  const focusAreas = roomBlueprint.constraints
    .map((item) => {
      const match = /^focus areas:\s*(.+)$/i.exec(item);
      return match?.[1];
    // Provider-specific function removed)
    .filter((item): item is string => Boolean(item));

***REMOVED***isInterviewDemoBlueprint(roomBlueprint)) {
  ***REMOVED***
      '我是一名计算机本科学生，专业背景符合本场面试要求。',
      '这场 demo 不预设具体岗位方向，请按真实面试节奏逐步提问。',
      focusAreas.length > 0 ? `可以重点了解：${focusAreas.join('；')// Provider-specific function removed` : undefined,
      '后续我会像真实候选人一样，逐步回答专业基础、项目经历和综合能力相关问题。',
      '统一使用简体中文。',
    ]
      .filter((item): item is string => Boolean(item))
      .join('\n');
  // Provider-specific function removed

***REMOVED***
    `你现在以候选人身份加入这场模拟面试。`,
    `目标岗位：${asOptionalString(scenarioRecord?.targetRole) ?? roomBlueprint.topic// Provider-specific function removed`,
    asOptionalString(scenarioRecord?.targetLevel)
      ? `目标级别：${asOptionalString(scenarioRecord?.targetLevel)// Provider-specific function removed`
      : undefined,
    `面试目标：${roomBlueprint.objective// Provider-specific function removed`,
    focusAreas.length > 0 ? `重点考察：${focusAreas.join('；')// Provider-specific function removed` : undefined,
    '请像真实候选人一样回答问题：先给结论，再讲背景、行动、结果和数据。',
    '统一使用简体中文。',
  ]
    .filter((item): item is string => Boolean(item))
    .join('\n');
// Provider-specific function removed

function createInterviewRoundStep(args: {
  id: string;
  round: number;
  roomId?: string;
  speakers: readonly AgentProfile<ChatroomAgentContext, 'text'>[];
// Provider-specific function removed): WorkflowStep<ChatroomState, ChatroomAgentContext> {
  const speakerById = new Map(args.speakers.map((speaker) => [speaker.id, speaker] as const));

  return {
    id: args.id,
    kind: 'custom' as const,
    agentIds: args.speakers.map((speaker) => speaker.id),
    async execute(context: WorkflowExecutionContext<ChatroomState, ChatroomAgentContext>) {
      const stateBefore = context.sharedState.readSnapshot();
      const startedAt = new Date().toISOString();
      const roomAdminPlan = resolveInterviewRoomAdminControlPlan({
        state: stateBefore.state,
        round: args.round,
      // Provider-specific function removed);
      const planResult = roomAdminPlan
        ? {
            source: 'room_admin' as const,
            plan: roomAdminPlan,
          // Provider-specific function removed
        : await planInterviewNextTurn({
            state: stateBefore.state,
            workflowId: context.workflowId,
            stepId: `${args.id// Provider-specific function removed-planner`,
            roomId: args.roomId,
            round: args.round,
            runtime: context.agentRuntime,
            signal: context.signal,
          // Provider-specific function removed);
      const plan = planResult.plan;

      // Track consecutive waits to detect stuck interview state.
    ***REMOVED***plan.kind === 'wait') {
        const currentCount = stateBefore.state.interviewConsecutiveWaitCount ?? 0;
        const nextCount = currentCount + 1;
      ***REMOVED***nextCount >= MAX_INTERVIEW_CONSECUTIVE_WAITS) {
          // Force partial completion: treat as 'complete' with aborted status.
          const mutation = context.sharedState.mutate((draft) => {
            draft.interviewConsecutiveWaitCount = 0;
            draft.interviewCurrentPhase = 'complete';
            draft.interviewPendingCandidateReply = undefined;
            draft.interviewTerminalStatus = 'aborted';
          ***REMOVED***draft.finalSummary && 'interviewStatus' in draft.finalSummary) {
              draft.finalSummary.interviewStatus = 'aborted';
            // Provider-specific function removed
          // Provider-specific function removed, {
            expectedVersion: stateBefore.version,
            label: args.id,
          // Provider-specific function removed);
          context.trace.push({
            stepId: args.id,
            kind: 'custom',
            agentIds: [],
            startedAt,
            endedAt: new Date().toISOString(),
            stateVersionBefore: stateBefore.version,
            stateVersionAfter: mutation.version,
            inputPreview: `forced_complete: Interview stuck after ${nextCount// Provider-specific function removed consecutive waits. ${plan.reason// Provider-specific function removed`,
            output: [],
            status: 'completed',
          // Provider-specific function removed);
          return;
        // Provider-specific function removed
        const mutation = context.sharedState.mutate((draft) => {
          draft.interviewConsecutiveWaitCount = nextCount;
          const latestQuestionMessage = resolveLatestInterviewQuestionMessage(draft.messages);
          draft.interviewPendingCandidateReply = latestQuestionMessage
            ? createInterviewPendingCandidateReplyState(
              latestQuestionMessage,
              resolveInterviewPendingResponseMode(draft.messages),
            )
            : undefined;
        // Provider-specific function removed, {
          expectedVersion: stateBefore.version,
          label: args.id,
        // Provider-specific function removed);
        context.trace.push({
          stepId: args.id,
          kind: 'custom',
          agentIds: [],
          startedAt,
          endedAt: new Date().toISOString(),
          stateVersionBefore: stateBefore.version,
          stateVersionAfter: mutation.version,
          inputPreview: `${planResult.source// Provider-specific function removed: ${plan.reason// Provider-specific function removed`,
          output: [],
          status: 'completed',
        // Provider-specific function removed);
        return;
      // Provider-specific function removed

    ***REMOVED***plan.kind === 'complete') {
        const closingTurn = resolveInterviewCompletionClosingTurn({
          state: stateBefore.state,
          speakerById,
        // Provider-specific function removed);
        let closingMessage: string | undefined;
        let closingOutput:
          | Awaited<ReturnType<typeof context.agentRuntime.runDetailed>>
          | undefined;
        let closingError: unknown;

      ***REMOVED***closingTurn) {
          const closingContext = createChatroomContext({
            state: stateBefore.state,
            workflowId: context.workflowId,
            stepId: `${args.id// Provider-specific function removed-closing`,
            roomId: args.roomId,
            round: args.round,
            speaker: closingTurn.speaker,
            transcriptMessages: stateBefore.state.messages,
          // Provider-specific function removed);
          const closingExecution = createExecutionSignal({
            parentSignal: context.signal,
            timeoutMs: INTERVIEW_COMPLETION_CLOSING_TIMEOUT_MS,
            scope: 'agent',
            targetId: closingTurn.speaker.id,
            abortMessage: `Interview closing agent "${closingTurn.speaker.id// Provider-specific function removed" was aborted.`,
          // Provider-specific function removed);

          try {
            closingOutput = await context.agentRuntime.runDetailed(
              closingTurn.speaker,
              closingTurn.prompt,
              {
                context: closingContext,
                maxTurns: 4,
                signal: closingExecution.signal,
                policyHooks: [chatroomSpeakerPolicyHook],
              // Provider-specific function removed,
            );
            closingMessage = extractScratchMemoryFromOutput(closingOutput.output as string).cleanOutput;
          // Provider-specific function removed catch (error) {
            closingError = error;
          ***REMOVED***!isAbortError(error)) {
              closingMessage = closingTurn.fallbackMessage;
            // Provider-specific function removed
          // Provider-specific function removed finally {
            closingExecution.cleanup();
          // Provider-specific function removed
        // Provider-specific function removed

        const mutation = context.sharedState.mutate((draft) => {
        ***REMOVED***closingTurn && closingMessage) {
            appendChatroomMessage(draft, {
              role: 'agent',
              authorId: closingTurn.speaker.id,
              authorName: resolveSpeakerDisplayName(draft, args.roomId, closingTurn.speaker),
              round: args.round,
              content: closingMessage,
            // Provider-specific function removed);
          // Provider-specific function removed
          draft.interviewConsecutiveWaitCount = 0;
          draft.interviewCurrentPhase = 'complete';
          draft.interviewPendingCandidateReply = undefined;
          draft.interviewTerminalStatus =
            plan.terminalStatus === 'aborted' ? 'aborted' : undefined;
        ***REMOVED***
            plan.terminalStatus === 'aborted' &&
            draft.finalSummary &&
            'interviewStatus' in draft.finalSummary
        ***REMOVED***
            draft.finalSummary.interviewStatus = 'aborted';
          // Provider-specific function removed
        // Provider-specific function removed, {
          expectedVersion: stateBefore.version,
          label: args.id,
        // Provider-specific function removed);
        context.trace.push({
          stepId: args.id,
          kind: 'custom',
          agentIds: closingTurn ? [closingTurn.speaker.id] : [],
          startedAt,
          endedAt: new Date().toISOString(),
          stateVersionBefore: stateBefore.version,
          stateVersionAfter: mutation.version,
          inputPreview: `${planResult.source// Provider-specific function removed: ${plan.reason// Provider-specific function removed`,
          output: closingTurn && closingMessage
            ? [{
                profileId: closingTurn.speaker.id,
                output: closingMessage,
                usage: closingOutput?.usage,
                guardrails: closingOutput?.guardrails,
                telemetry: closingOutput?.telemetry,
                startedAt,
                endedAt: new Date().toISOString(),
                status: closingError ? 'completed' : 'completed',
                error: closingError ? formatStepError(closingError) : undefined,
              // Provider-specific function removed]
            : [],
          status: closingError ? 'partial' : 'completed',
          error: closingError ? formatStepError(closingError) : undefined,
        // Provider-specific function removed);
        return;
      // Provider-specific function removed

      const speaker = speakerById.get(plan.speakerId);
    ***REMOVED***!speaker) {
        throw new Error(`Missing interview speaker "${plan.speakerId// Provider-specific function removed" for plan "${plan.phase// Provider-specific function removed".`);
      // Provider-specific function removed

    ***REMOVED***
        isInterviewDemoBlueprint(stateBefore.state.roomBlueprint) &&
        plan.phase === 'opening' &&
        plan.responseMode === 'new_question' &&
        countInterviewCandidateReplies(stateBefore.state.messages) === 0
    ***REMOVED***
        const endedAt = new Date().toISOString();
        const openingQuestion = buildInterviewDemoOpeningQuestion({
          state: stateBefore.state,
          speaker,
        // Provider-specific function removed);
        const mutation = context.sharedState.mutate((state) => {
          state.interviewConsecutiveWaitCount = 0;
          state.interviewTerminalStatus = undefined;
          state.interviewCurrentPhase = 'opening';
          const postedMessage = appendChatroomMessage(state, {
            role: 'agent',
            authorId: speaker.id,
            authorName: resolveSpeakerDisplayName(state, args.roomId, speaker),
            round: args.round,
            content: openingQuestion,
          // Provider-specific function removed);
          state.interviewPendingCandidateReply = createInterviewPendingCandidateReplyState(
            postedMessage,
            'new_question',
          );
        // Provider-specific function removed, {
          expectedVersion: stateBefore.version,
          label: args.id,
        // Provider-specific function removed);

        context.trace.push({
          stepId: args.id,
          kind: 'custom',
          agentIds: [speaker.id],
          startedAt,
          endedAt,
          stateVersionBefore: stateBefore.version,
          stateVersionAfter: mutation.version,
          inputPreview: 'heuristic demo opening question',
          output: [{
            profileId: speaker.id,
            output: openingQuestion,
            startedAt,
            endedAt,
            status: 'completed',
            planner: {
              currentStage: plan.phase,
              currentStageLabel: plan.stageLabel,
              reason: 'Demo opening uses a fast-path opener so the room can become interactive immediately.',
            // Provider-specific function removed,
          // Provider-specific function removed],
          status: 'completed',
        // Provider-specific function removed);
        return;
      // Provider-specific function removed

      const previousQuestionMessage = resolveLatestInterviewQuestionMessage(
        stateBefore.state.messages,
      );
      const handoffSpeaker =
        previousQuestionMessage &&
        previousQuestionMessage.authorId !== plan.speakerId
          ? speakerById.get(previousQuestionMessage.authorId)
          : undefined;
      const panelDiscussionSpeaker = resolveInterviewPanelDiscussionSpeaker({
        state: stateBefore.state,
        speakers: args.speakers,
        nextSpeakerId: plan.speakerId,
        fallbackSpeakerId: handoffSpeaker?.id,
      // Provider-specific function removed);
      const baseInput = buildInterviewSpeakerTurnPrompt(plan, stateBefore.state);
      let input = baseInput;
      const agentContext = createChatroomContext({
        state: stateBefore.state,
        workflowId: context.workflowId,
        stepId: args.id,
        roomId: args.roomId,
        round: args.round,
        speaker,
        transcriptMessages: stateBefore.state.messages,
      // Provider-specific function removed);

      try {
        let panelDiscussionResult:
          | {
              speaker: AgentProfile<ChatroomAgentContext, 'text'>;
              output: string;
              usage: unknown;
              guardrails: unknown;
              telemetry: unknown;
              startedAt: string;
              endedAt: string;
            // Provider-specific function removed
          | undefined;
        let handoffResult:
          | {
              speaker: AgentProfile<ChatroomAgentContext, 'text'>;
              output: string;
              usage: unknown;
              guardrails: unknown;
              telemetry: unknown;
              startedAt: string;
              endedAt: string;
            // Provider-specific function removed
          | undefined;

      ***REMOVED***
          panelDiscussionSpeaker &&
          previousQuestionMessage &&
          shouldEmitInterviewPanelDiscussion({
            state: stateBefore.state,
            plan,
            nextSpeakerId: plan.speakerId,
          // Provider-specific function removed)
      ***REMOVED***
          try {
            const discussionStartedAt = new Date().toISOString();
            const discussionContext = createChatroomContext({
              state: stateBefore.state,
              workflowId: context.workflowId,
              stepId: `${args.id// Provider-specific function removed-panel-discussion`,
              roomId: args.roomId,
              round: args.round,
              speaker: panelDiscussionSpeaker,
              transcriptMessages: stateBefore.state.messages,
            // Provider-specific function removed);
            const discussionRunResult = await context.agentRuntime.runDetailed(
              interviewPanelDiscussionProfile,
              buildInterviewPanelDiscussionPrompt({
                state: stateBefore.state,
                discussionSpeaker: panelDiscussionSpeaker,
                nextSpeaker: speaker,
                plan,
                previousQuestionMessage,
              // Provider-specific function removed),
              {
                context: discussionContext,
                maxTurns: 4,
                signal: context.signal,
                policyHooks: [chatroomSpeakerPolicyHook],
              // Provider-specific function removed,
            );
            panelDiscussionResult = {
              speaker: panelDiscussionSpeaker,
              output: normalizeInterviewPanelDiscussionMessage(discussionRunResult.output),
              usage: discussionRunResult.usage,
              guardrails: discussionRunResult.guardrails,
              telemetry: discussionRunResult.telemetry,
              startedAt: discussionStartedAt,
              endedAt: new Date().toISOString(),
            // Provider-specific function removed;
          // Provider-specific function removed catch (error) {
          ***REMOVED***isAbortError(error)) {
              throw error;
            // Provider-specific function removed
          // Provider-specific function removed
        // Provider-specific function removed

      ***REMOVED***
          !panelDiscussionResult &&
          handoffSpeaker &&
          previousQuestionMessage &&
          shouldEmitInterviewPanelHandoff({
            state: stateBefore.state,
            nextSpeakerId: plan.speakerId,
          // Provider-specific function removed)
      ***REMOVED***
          try {
            const handoffStartedAt = new Date().toISOString();
            const handoffContext = createChatroomContext({
              state: stateBefore.state,
              workflowId: context.workflowId,
              stepId: `${args.id// Provider-specific function removed-handoff`,
              roomId: args.roomId,
              round: args.round,
              speaker: handoffSpeaker,
              transcriptMessages: stateBefore.state.messages,
            // Provider-specific function removed);
            const handoffRunResult = await context.agentRuntime.runDetailed(
              interviewPanelHandoffProfile,
              buildInterviewPanelHandoffPrompt({
                state: stateBefore.state,
                handoffSpeaker,
                nextSpeaker: speaker,
                plan,
                previousQuestionMessage,
              // Provider-specific function removed),
              {
                context: handoffContext,
                maxTurns: 4,
                signal: context.signal,
                policyHooks: [chatroomSpeakerPolicyHook],
              // Provider-specific function removed,
            );
            handoffResult = {
              speaker: handoffSpeaker,
              output: normalizeInterviewPanelHandoffMessage(handoffRunResult.output),
              usage: handoffRunResult.usage,
              guardrails: handoffRunResult.guardrails,
              telemetry: handoffRunResult.telemetry,
              startedAt: handoffStartedAt,
              endedAt: new Date().toISOString(),
            // Provider-specific function removed;
          // Provider-specific function removed catch (error) {
          ***REMOVED***isAbortError(error)) {
              throw error;
            // Provider-specific function removed
          // Provider-specific function removed
        // Provider-specific function removed

        input = applyInterviewTransitionNotesToPrompt(
          baseInput,
          collectInterviewTransitionNotes(panelDiscussionResult, handoffResult),
        );
        const runResult = await context.agentRuntime.runDetailed(speaker, input, {
          context: agentContext,
          maxTurns: 6,
          signal: context.signal,
          policyHooks: [chatroomSpeakerPolicyHook],
        // Provider-specific function removed);
        const extractedOutput = extractScratchMemoryFromOutput(runResult.output);
        const interviewPhaseLabel = mapInterviewAskPhaseToStatePhase(plan.phase);
        const endedAt = new Date().toISOString();
        const mutation = context.sharedState.mutate((state) => {
          state.interviewConsecutiveWaitCount = 0;
          state.interviewTerminalStatus = undefined;
          state.interviewCurrentPhase = interviewPhaseLabel;
          const postedMessage = appendChatroomMessage(state, {
            role: 'agent',
            authorId: speaker.id,
            authorName: resolveSpeakerDisplayName(state, args.roomId, speaker),
            round: args.round,
            content: extractedOutput.cleanOutput,
          // Provider-specific function removed);
          state.interviewPendingCandidateReply = createInterviewPendingCandidateReplyState(
            postedMessage,
            plan.responseMode,
          );
        ***REMOVED***panelDiscussionResult) {
            appendInterviewInternalNote(state, {
              kind: 'panel_discussion',
              createdAt: panelDiscussionResult.endedAt,
              round: args.round,
              authorId: panelDiscussionResult.speaker.id,
              authorName: panelDiscussionResult.speaker.name,
              phaseLabel: interviewPhaseLabel,
              targetSpeakerId: speaker.id,
              targetSpeakerName: speaker.name,
              content: panelDiscussionResult.output,
            // Provider-specific function removed);
          // Provider-specific function removed
        ***REMOVED***handoffResult) {
            appendInterviewInternalNote(state, {
              kind: 'panel_handoff',
              createdAt: handoffResult.endedAt,
              round: args.round,
              authorId: handoffResult.speaker.id,
              authorName: handoffResult.speaker.name,
              phaseLabel: interviewPhaseLabel,
              targetSpeakerId: speaker.id,
              targetSpeakerName: speaker.name,
              content: handoffResult.output,
            // Provider-specific function removed);
          // Provider-specific function removed
          const structuredCollaborationNotes: Array<
            Pick<ChatroomInterviewInternalNote, 'content' | 'signalTags'>
          > =
            extractedOutput.structuredCollaborationNotes.length > 0
              ? extractedOutput.structuredCollaborationNotes
              : extractedOutput.collaborationNotes.map((note) => ({
                  content: note,
                // Provider-specific function removed));
          for (const note of structuredCollaborationNotes) {
            appendInterviewInternalNote(state, {
              kind: 'speaker_collaboration',
              createdAt: endedAt,
              round: args.round,
              authorId: speaker.id,
              authorName: resolveSpeakerDisplayName(state, args.roomId, speaker),
              phaseLabel: interviewPhaseLabel,
              signalTags: note.signalTags,
              content: note.content,
            // Provider-specific function removed);
          // Provider-specific function removed
        // Provider-specific function removed, {
          expectedVersion: stateBefore.version,
          label: args.id,
        // Provider-specific function removed);

        context.trace.push({
          stepId: args.id,
          kind: 'custom',
          agentIds: [speaker.id],
          startedAt,
          endedAt,
          stateVersionBefore: stateBefore.version,
          stateVersionAfter: mutation.version,
          inputPreview: `${planResult.source// Provider-specific function removed: ${input// Provider-specific function removed`,
          output: [
            ...(panelDiscussionResult
              ? [{
                  profileId: panelDiscussionResult.speaker.id,
                  output: panelDiscussionResult.output,
                  usage: panelDiscussionResult.usage,
                  guardrails: panelDiscussionResult.guardrails,
                  telemetry: panelDiscussionResult.telemetry,
                  startedAt: panelDiscussionResult.startedAt,
                  endedAt: panelDiscussionResult.endedAt,
                  status: 'completed',
                  planner: {
                    currentStage: 'panel_discussion',
                    currentStageLabel: '面试官讨论',
                    reason: `在 ${speaker.name// Provider-specific function removed 发问前做一次 panel 协作讨论。`,
                  // Provider-specific function removed,
                // Provider-specific function removed]
              : []),
            ...(handoffResult
              ? [{
                  profileId: handoffResult.speaker.id,
                  output: handoffResult.output,
                  usage: handoffResult.usage,
                  guardrails: handoffResult.guardrails,
                  telemetry: handoffResult.telemetry,
                  startedAt: handoffResult.startedAt,
                  endedAt: handoffResult.endedAt,
                  status: 'completed',
                  planner: {
                    currentStage: 'panel_handoff',
                    currentStageLabel: '面试官交接',
                    reason: `从 ${handoffResult.speaker.name// Provider-specific function removed 交接到 ${speaker.name// Provider-specific function removed。`,
                  // Provider-specific function removed,
                // Provider-specific function removed]
              : []),
            {
              profileId: speaker.id,
              output: extractedOutput.cleanOutput,
              usage: runResult.usage,
              guardrails: runResult.guardrails,
              telemetry: runResult.telemetry,
              startedAt,
              endedAt,
              status: 'completed',
              planner: {
                currentStage: plan.phase,
                currentStageLabel: plan.stageLabel,
                reason: plan.reason,
              // Provider-specific function removed,
            // Provider-specific function removed,
          ],
          status: 'completed',
        // Provider-specific function removed);
      // Provider-specific function removed catch (error) {
        context.trace.push({
          stepId: args.id,
          kind: 'custom',
          agentIds: [speaker.id],
          startedAt,
          endedAt: new Date().toISOString(),
          stateVersionBefore: stateBefore.version,
          stateVersionAfter: stateBefore.version,
          inputPreview: `${planResult.source// Provider-specific function removed: ${input// Provider-specific function removed`,
          output: [
            {
              profileId: speaker.id,
              startedAt,
              endedAt: new Date().toISOString(),
              status: isAbortError(error) ? 'cancelled' : 'failed',
              error: formatStepError(error),
            // Provider-specific function removed,
          ],
          status: isAbortError(error) ? 'cancelled' : 'failed',
          error: formatStepError(error),
        // Provider-specific function removed);
        throw error;
      // Provider-specific function removed
    // Provider-specific function removed,
  // Provider-specific function removed;
// Provider-specific function removed

function isInterviewScenario(
  roomBlueprint: Readonly<ChatroomRoomBlueprint> | undefined,
***REMOVED***
  return roomBlueprint?.scenarioTemplateId === 'interview_simulation';
// Provider-specific function removed

function resolveRequestedChatroomRounds(
  roomBlueprint: Readonly<ChatroomRoomBlueprint> | undefined,
  requestedRounds: number,
): number {
  return isInterviewScenario(roomBlueprint) ? 1 : requestedRounds;
// Provider-specific function removed

function isInterviewTerminalAgentMessage(content: string***REMOVED***
  return /面试(?:正式)?结束|面试终止|房间进入关闭状态|不再接受候选人发言|立即进入最终fit评估|最终fit评估|最终评估报告/u
    .test(content);
// Provider-specific function removed

function resolveChatroomSummaryProfile(
  scenarioTemplateId: ChatroomRoomBlueprint['scenarioTemplateId'] | undefined,
  roomBehavior: ReturnType<typeof resolveChatroomRoomType>['behavior'],
): AgentProfile<ChatroomAgentContext, any> {
***REMOVED***scenarioTemplateId === 'interview_simulation') {
    return interviewSummaryProfile;
  // Provider-specific function removed

***REMOVED***roomBehavior === 'roleplay') {
    return roleplaySummaryProfile;
  // Provider-specific function removed

  return chatroomSummaryProfile;
// Provider-specific function removed

function buildSummaryPromptForScenario(
  roomTypeSpec: ReturnType<typeof resolveChatroomRoomType>,
  scenarioTemplateId: ChatroomRoomBlueprint['scenarioTemplateId'] | undefined,
  state?: Readonly<ChatroomState>,
): string {
***REMOVED***scenarioTemplateId === 'interview_simulation') {
    const scoringGuide = state ? resolveInterviewScoringGuide(state) : undefined;
  ***REMOVED***
      'Read the full interview transcript from runtime context.',
      'Produce the structured interview evaluation in Simplified Chinese.',
      scoringGuide
        ? `Use the interview score template "${scoringGuide.templateLabel// Provider-specific function removed" (${scoringGuide.templateId// Provider-specific function removed).`
        : undefined,
      scoringGuide && scoringGuide.dimensions.length > 0
        ? `Align competencyScores to these preferred dimensions when possible: ${scoringGuide.dimensions.join('、')// Provider-specific function removed.`
        : undefined,
      'If the candidate has not completed enough rounds yet, mark the status as opening or in_progress and score conservatively.',
      'Keep the output concise and provider-safe: usually 3-5 items per list, and no more than 6 competency scores.',
    ]
      .filter((item): item is string => Boolean(item))
      .join(' ');
  // Provider-specific function removed

***REMOVED***roomTypeSpec.behavior === 'roleplay') {
    return '请阅读完整角色扮演聊天记录，输出叙事性总结。使用简体中文。';
  // Provider-specific function removed

  return roomTypeSpec.buildSummaryPrompt();
// Provider-specific function removed

function shouldRunFinalInterviewSummary(state: Readonly<ChatroomState>***REMOVED***
  const interviewStatus = resolveInterviewStatusFromState(state);
  return interviewStatus === 'complete' || interviewStatus === 'aborted';
// Provider-specific function removed

function resolveScenarioSummaryTimeoutMs(
  scenarioTemplateId: ChatroomRoomBlueprint['scenarioTemplateId'] | undefined,
  mode: 'checkpoint' | 'final',
): number {
***REMOVED***scenarioTemplateId === 'interview_simulation' && mode === 'final') {
    return INTERVIEW_FINAL_SUMMARY_AGENT_TIMEOUT_MS;
  // Provider-specific function removed

  return SUMMARY_AGENT_TIMEOUT_MS;
// Provider-specific function removed

function shouldRetryScenarioSummaryRun(args: {
  scenarioTemplateId: ChatroomRoomBlueprint['scenarioTemplateId'] | undefined;
  mode: 'checkpoint' | 'final';
  attemptCount: number;
  error: unknown;
// Provider-specific function removed***REMOVED***
  return args.scenarioTemplateId === 'interview_simulation' &&
    args.mode === 'final' &&
    args.attemptCount < INTERVIEW_FINAL_SUMMARY_MAX_TIMEOUT_RETRIES &&
    isExecutionTimeoutError(args.error);
// Provider-specific function removed

function resolveSummaryHeadline(output: unknown): string {
***REMOVED***output && typeof output === 'object' && !Array.isArray(output)) {
    const record = output as Record<string, unknown>;
  ***REMOVED***typeof record.executiveSummary === 'string' && record.executiveSummary.trim()) {
      return record.executiveSummary.trim();
    // Provider-specific function removed
  ***REMOVED***typeof record.narrativeSummary === 'string' && record.narrativeSummary.trim()) {
      return record.narrativeSummary.trim();
    // Provider-specific function removed
  // Provider-specific function removed

  return String(output ?? '').trim();
// Provider-specific function removed

function shouldPublishSummaryMessage(
  scenarioTemplateId: ChatroomRoomBlueprint['scenarioTemplateId'] | undefined,
  output: unknown,
***REMOVED***
***REMOVED***scenarioTemplateId !== 'interview_simulation') {
    return true;
  // Provider-specific function removed

***REMOVED***output && typeof output === 'object' && !Array.isArray(output)) {
    const record = output as Record<string, unknown>;
    return record.interviewStatus === 'complete'
      || record.interviewStatus === 'aborted';
  // Provider-specific function removed

  return false;
// Provider-specific function removed

function normalizeScenarioSummaryOutput(
  scenarioTemplateId: ChatroomRoomBlueprint['scenarioTemplateId'] | undefined,
  state: Readonly<ChatroomState>,
  output: ChatroomFinalSummary,
): ChatroomFinalSummary {
***REMOVED***
    scenarioTemplateId !== 'interview_simulation' ||
    !isInterviewSummaryOutputRecord(output)
***REMOVED***
    return output;
  // Provider-specific function removed

  let normalized = output;
  const roomInterviewStatus = resolveInterviewStatusFromState(state);

***REMOVED***
    roomInterviewStatus === 'aborted' &&
    normalized.interviewStatus !== 'aborted'
***REMOVED***
    const fallback = createFallbackInterviewSummary(state);
    normalized = {
      ...normalized,
      interviewStatus: 'aborted' as const,
      executiveSummary: fallback.executiveSummary,
      currentStage: normalized.currentStage || fallback.currentStage,
      recommendedNextActions:
        fallback.recommendedNextActions.length > 0
          ? fallback.recommendedNextActions
          : normalized.recommendedNextActions,
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***
    normalized.interviewStatus === 'complete' &&
    roomInterviewStatus !== 'complete' &&
    roomInterviewStatus !== 'aborted' &&
    isInterviewWaitingForCandidateReply(state)
***REMOVED***
    normalized = {
      ...normalized,
      interviewStatus: 'in_progress' as const,
    // Provider-specific function removed;
  // Provider-specific function removed

  return calibrateInterviewSummaryOutput(normalized, state);
// Provider-specific function removed

function isInterviewSummaryOutputRecord(output: unknown): output is InterviewSummary {
  return Boolean(
    output &&
      typeof output === 'object' &&
      !Array.isArray(output) &&
      'interviewStatus' in output &&
      'currentStage' in output,
  );
// Provider-specific function removed

function createFallbackScenarioSummary(
  scenarioTemplateId: ChatroomRoomBlueprint['scenarioTemplateId'] | undefined,
  state: Readonly<ChatroomState>,
): ChatroomFinalSummary | undefined {
***REMOVED***scenarioTemplateId !== 'interview_simulation') {
    return undefined;
  // Provider-specific function removed

  return createFallbackInterviewSummary(state);
// Provider-specific function removed

function createFallbackInterviewSummary(
  state: Readonly<ChatroomState>,
): InterviewSummary {
  const existing = getInterviewSummaryFromState(state);
  const status = resolveInterviewStatusFromState(state);
  const track = resolveInterviewTrack(state);
  const phase = resolveTrackedInterviewPhaseState(state);
  const preferFreshHeuristic =
    status === 'complete' || status === 'aborted';
  const stageLabel = status === 'complete'
    ? resolveInterviewPhaseStateLabel(phase, track)
    : existing?.currentStage ?? resolveInterviewPhaseStateLabel(phase, track);
  const latestQuestion = resolveLatestInterviewQuestionMessage(state.messages);
  const candidateReplyCount = countInterviewCandidateReplies(state.messages);
  const waitingForCandidate =
    status !== 'complete' &&
    status !== 'aborted' &&
    isInterviewWaitingForCandidateReply(state);
  const heuristic = buildHeuristicInterviewFallbackSummary({
    state,
    status,
    stageLabel,
    track,
    latestQuestion,
    candidateReplyCount,
    waitingForCandidate,
  // Provider-specific function removed);
  const nextAction = heuristic.recommendedNextActions[0] ??
    (waitingForCandidate
      ? 'Continue waiting for the candidate to answer the current interviewer question.'
      : status === 'complete'
        ? 'Review the final interview report and outcome.'
        : status === 'aborted'
          ? 'Review why the interview ended early and restart only after the blocker is clear.'
        : 'Continue the next interview turn based on the latest evidence.');
  const executiveSummary =
    !preferFreshHeuristic &&
    typeof existing?.executiveSummary === 'string' &&
    existing.executiveSummary.trim()
      ? existing.executiveSummary.trim()
      : heuristic.executiveSummary;

  return calibrateInterviewSummaryOutput({
    executiveSummary,
    interviewStatus: status,
    currentStage: stageLabel,
    interviewReadiness:
      !preferFreshHeuristic && existing?.interviewReadiness
        ? existing.interviewReadiness
        : heuristic.interviewReadiness,
    overallScore:
      !preferFreshHeuristic &&
      typeof existing?.overallScore === 'number' &&
      existing.overallScore > 0
        ? existing.overallScore
        : heuristic.overallScore,
    strengths:
      !preferFreshHeuristic && existing?.strengths && existing.strengths.length > 0
        ? existing.strengths
        : heuristic.strengths,
    weaknesses:
      !preferFreshHeuristic && existing?.weaknesses && existing.weaknesses.length > 0
        ? existing.weaknesses
        : heuristic.weaknesses,
    missedQuestions:
      !preferFreshHeuristic && existing?.missedQuestions && existing.missedQuestions.length > 0
        ? existing.missedQuestions
        : heuristic.missedQuestions,
    suggestedAnswerImprovements:
      !preferFreshHeuristic &&
      existing?.suggestedAnswerImprovements &&
      existing.suggestedAnswerImprovements.length > 0
        ? existing.suggestedAnswerImprovements
        : heuristic.suggestedAnswerImprovements,
    followUpQuestions:
      !preferFreshHeuristic && existing?.followUpQuestions && existing.followUpQuestions.length > 0
        ? existing.followUpQuestions
        : heuristic.followUpQuestions,
    recommendedNextActions:
      !preferFreshHeuristic &&
      existing?.recommendedNextActions &&
      existing.recommendedNextActions.length > 0
        ? existing.recommendedNextActions
        : [nextAction, ...heuristic.recommendedNextActions.slice(1)],
    competencyScores:
      !preferFreshHeuristic && existing?.competencyScores && existing.competencyScores.length > 0
        ? existing.competencyScores
        : heuristic.competencyScores,
    confidence:
      !preferFreshHeuristic && typeof existing?.confidence === 'number'
        ? existing.confidence
        : heuristic.confidence,
    questionLog:
      !preferFreshHeuristic && existing?.questionLog && existing.questionLog.length > 0
        ? existing.questionLog
        : heuristic.questionLog,
    feedbackItems:
      !preferFreshHeuristic && existing?.feedbackItems && existing.feedbackItems.length > 0
        ? existing.feedbackItems
        : heuristic.feedbackItems,
  // Provider-specific function removed, state);
// Provider-specific function removed

interface InterviewSummaryCalibrationSnapshot {
  candidateReplyCount: number;
  reviewCount: number;
  adequateAnswerCount: number;
  unansweredQuestionCount: number;
  gapCounts: Record<HeuristicInterviewGapCategory, number>;
  signalCounts: HeuristicInterviewSignalCounts;
  totalGapCount: number;
// Provider-specific function removed

function calibrateInterviewSummaryOutput(
  summary: InterviewSummary,
  state: Readonly<ChatroomState>,
): InterviewSummary {
  const snapshot = collectInterviewSummaryCalibrationSnapshot(state);
  const scoreCeiling = resolveInterviewSummaryScoreCeiling({
    status: summary.interviewStatus,
    ...snapshot,
  // Provider-specific function removed);
  const evidencePenalty = computeInterviewSummaryEvidencePenalty({
    status: summary.interviewStatus,
    ...snapshot,
  // Provider-specific function removed);
  const calibratedScore = clampNumber(
    Math.min(summary.overallScore, scoreCeiling) - evidencePenalty,
    0,
    100,
  );
  const competencyScoreCap = resolveInterviewCompetencyScoreCap({
    status: summary.interviewStatus,
    overallScore: calibratedScore,
    reviewCount: snapshot.reviewCount,
    totalGapCount: snapshot.totalGapCount,
  // Provider-specific function removed);
  const confidenceCap = resolveInterviewConfidenceCap({
    status: summary.interviewStatus,
    reviewCount: snapshot.reviewCount,
    totalGapCount: snapshot.totalGapCount,
    signalCounts: snapshot.signalCounts,
  // Provider-specific function removed);
  const calibrationWeakness = buildInterviewScoreCalibrationWeakness({
    scoreCeiling,
    evidencePenalty,
    status: summary.interviewStatus,
  // Provider-specific function removed);
  const calibrationNextAction = buildInterviewScoreCalibrationNextAction({
    scoreCeiling,
    evidencePenalty,
    status: summary.interviewStatus,
  // Provider-specific function removed);
  const calibratedReadiness = resolveHeuristicInterviewReadiness({
    status: summary.interviewStatus,
    overallScore: calibratedScore,
    adequateAnswerCount: snapshot.adequateAnswerCount,
    reviewCount: snapshot.reviewCount,
    gapCounts: snapshot.gapCounts,
  // Provider-specific function removed);
  const calibratedExecutiveSummary =
    calibratedScore === summary.overallScore
      ? summary.executiveSummary
      : summary.executiveSummary.replace(/\d+\s*\/\s*100/gu, `${calibratedScore// Provider-specific function removed/100`);

  return {
    ...summary,
    executiveSummary: calibratedExecutiveSummary,
    interviewReadiness: calibratedReadiness,
    overallScore: calibratedScore,
    weaknesses: calibrationWeakness
      ? dedupeStrings([...summary.weaknesses, calibrationWeakness]).slice(0, 4)
      : summary.weaknesses,
    recommendedNextActions: calibrationNextAction
      ? dedupeStrings([calibrationNextAction, ...summary.recommendedNextActions]).slice(0, 4)
      : summary.recommendedNextActions,
    competencyScores: summary.competencyScores.map((item) => ({
      ...item,
      score: clampNumber(item.score, 1, competencyScoreCap),
    // Provider-specific function removed)),
    confidence: clampDecimal(Math.min(summary.confidence, confidenceCap), 0, 1, 2),
  // Provider-specific function removed;
// Provider-specific function removed

function collectInterviewSummaryCalibrationSnapshot(
  state: Readonly<ChatroomState>,
): InterviewSummaryCalibrationSnapshot {
  const track = resolveInterviewTrack(state);
  const reviews = collectInterviewQuestionReviews({
    messages: state.messages,
    track,
  // Provider-specific function removed);
  const adequateAnswerCount = reviews.filter((item) => item.coverage?.isAdequate).length;
  const unansweredQuestionCount = reviews.filter((item) => !item.answer).length;
  const gapCounts = countHeuristicInterviewGapCategories(reviews);

  return {
    candidateReplyCount: countInterviewCandidateReplies(state.messages),
    reviewCount: reviews.length,
    adequateAnswerCount,
    unansweredQuestionCount,
    gapCounts,
    signalCounts: countHeuristicInterviewSignals(reviews),
    totalGapCount: Object.values(gapCounts).reduce((sum, value) => sum + value, 0),
  // Provider-specific function removed;
// Provider-specific function removed

function resolveInterviewSummaryScoreCeiling(args: {
  status: InterviewSummary['interviewStatus'];
  candidateReplyCount: number;
  reviewCount: number;
  adequateAnswerCount: number;
  unansweredQuestionCount: number;
  gapCounts: Record<HeuristicInterviewGapCategory, number>;
  signalCounts: HeuristicInterviewSignalCounts;
  totalGapCount: number;
// Provider-specific function removed): number {
***REMOVED***args.candidateReplyCount === 0 || args.reviewCount === 0) {
    return 0;
  // Provider-specific function removed

***REMOVED***args.status === 'opening') {
    return 35;
  // Provider-specific function removed

***REMOVED***args.status !== 'complete') {
    return 72;
  // Provider-specific function removed

  let ceiling = INTERVIEW_COMPLETE_SCORE_DEFAULT_CAP;
  const adequateRatio = args.adequateAnswerCount / Math.max(1, args.reviewCount);
  const hasFullSignalCoverage =
    args.signalCounts.quantitative > 0 &&
    args.signalCounts.collaboration > 0 &&
    args.signalCounts.reasoning > 0 &&
    args.signalCounts.example > 0;
  const hasExceptionalCoverage =
    hasFullSignalCoverage &&
    args.signalCounts.motivation > 0 &&
    args.signalCounts.ownership > 0;

***REMOVED***args.reviewCount < 4) {
    ceiling = Math.min(ceiling, 78);
  // Provider-specific function removed
***REMOVED***args.candidateReplyCount < MIN_CANDIDATE_REPLIES_FOR_COMPLETION) {
    ceiling = Math.min(ceiling, 85);
  // Provider-specific function removed
***REMOVED***args.unansweredQuestionCount > 0 || args.gapCounts.direct_response > 0) {
    ceiling = Math.min(ceiling, 74);
  // Provider-specific function removed
***REMOVED***args.totalGapCount >= 2) {
    ceiling = Math.min(ceiling, 80);
  // Provider-specific function removed
***REMOVED***args.signalCounts.quantitative === 0) {
    ceiling = Math.min(ceiling, 82);
  // Provider-specific function removed
***REMOVED***args.signalCounts.collaboration === 0) {
    ceiling = Math.min(ceiling, 82);
  // Provider-specific function removed
***REMOVED***args.signalCounts.motivation === 0) {
    ceiling = Math.min(ceiling, 84);
  // Provider-specific function removed
***REMOVED***adequateRatio < 0.6) {
    ceiling = Math.min(ceiling, 76);
  // Provider-specific function removed

***REMOVED***
    args.candidateReplyCount >= MIN_CANDIDATE_REPLIES_FOR_COMPLETION &&
    adequateRatio >= 0.75 &&
    args.totalGapCount === 0 &&
    hasFullSignalCoverage
***REMOVED***
    ceiling = Math.max(ceiling, INTERVIEW_COMPLETE_SCORE_STRONG_CAP);
  // Provider-specific function removed

***REMOVED***
    args.reviewCount >= 5 &&
    args.candidateReplyCount >= MIN_CANDIDATE_REPLIES_FOR_COMPLETION + 1 &&
    adequateRatio >= 0.8 &&
    args.totalGapCount === 0 &&
    hasExceptionalCoverage
***REMOVED***
    ceiling = Math.max(ceiling, INTERVIEW_COMPLETE_SCORE_EXCEPTIONAL_CAP);
  // Provider-specific function removed

  return clampNumber(ceiling, 0, 100);
// Provider-specific function removed

function computeInterviewSummaryEvidencePenalty(args: {
  status: InterviewSummary['interviewStatus'];
  candidateReplyCount: number;
  reviewCount: number;
  adequateAnswerCount: number;
  unansweredQuestionCount: number;
  gapCounts: Record<HeuristicInterviewGapCategory, number>;
  signalCounts: HeuristicInterviewSignalCounts;
// Provider-specific function removed): number {
***REMOVED***args.candidateReplyCount === 0 || args.reviewCount === 0) {
    return 0;
  // Provider-specific function removed

  let penalty = 0;
***REMOVED***args.status === 'complete' && args.candidateReplyCount < MIN_CANDIDATE_REPLIES_FOR_COMPLETION) {
    penalty += 2;
  // Provider-specific function removed
***REMOVED***args.status === 'complete' && args.signalCounts.quantitative === 0) {
    penalty += 2;
  // Provider-specific function removed
***REMOVED***args.status === 'complete' && args.signalCounts.collaboration === 0) {
    penalty += 2;
  // Provider-specific function removed
***REMOVED***args.status === 'complete' && args.gapCounts.motivation > 0) {
    penalty += 1;
  // Provider-specific function removed

  penalty += Math.min(args.gapCounts.direct_response, 2) * 4;
  penalty += Math.min(args.gapCounts.quantitative, 2) * 3;
  penalty += Math.min(args.gapCounts.collaboration, 2) * 3;
  penalty += Math.min(args.gapCounts.reasoning, 2) * 2;
  penalty += Math.min(args.gapCounts.example, 2) * 2;
  penalty += Math.min(args.gapCounts.motivation, 2) * 2;
  penalty += Math.min(args.unansweredQuestionCount, 2) * 4;

***REMOVED***args.adequateAnswerCount < Math.ceil(args.reviewCount * 0.6)) {
    penalty += 3;
  // Provider-specific function removed

  return clampNumber(penalty, 0, 16);
// Provider-specific function removed

function resolveInterviewCompetencyScoreCap(args: {
  status: InterviewSummary['interviewStatus'];
  overallScore: number;
  reviewCount: number;
  totalGapCount: number;
// Provider-specific function removed): number {
***REMOVED***
    args.status === 'complete' &&
    args.overallScore >= 88 &&
    args.reviewCount >= 5 &&
    args.totalGapCount === 0
***REMOVED***
    return 5;
  // Provider-specific function removed
***REMOVED***args.overallScore >= 72) {
    return 4;
  // Provider-specific function removed
***REMOVED***args.overallScore >= 55) {
    return 3;
  // Provider-specific function removed
  return 2;
// Provider-specific function removed

function resolveInterviewConfidenceCap(args: {
  status: InterviewSummary['interviewStatus'];
  reviewCount: number;
  totalGapCount: number;
  signalCounts: HeuristicInterviewSignalCounts;
// Provider-specific function removed): number {
  let cap = args.status === 'complete' ? 0.78 : 0.68;
***REMOVED***args.reviewCount < 4) {
    cap -= 0.06;
  // Provider-specific function removed
***REMOVED***args.totalGapCount > 0) {
    cap -= 0.05;
  // Provider-specific function removed
***REMOVED***args.signalCounts.quantitative === 0 || args.signalCounts.collaboration === 0) {
    cap -= 0.03;
  // Provider-specific function removed
  return clampDecimal(cap, 0.22, 0.82, 2);
// Provider-specific function removed

function buildInterviewScoreCalibrationWeakness(args: {
  scoreCeiling: number;
  evidencePenalty: number;
  status: InterviewSummary['interviewStatus'];
// Provider-specific function removed): string | undefined {
***REMOVED***args.status !== 'complete' || (args.scoreCeiling >= 90 && args.evidencePenalty === 0)) {
    return undefined;
  // Provider-specific function removed
***REMOVED***args.evidencePenalty < 4 && args.scoreCeiling >= INTERVIEW_COMPLETE_SCORE_DEFAULT_CAP) {
    return undefined;
  // Provider-specific function removed

  return '当前评分已按证据密度做保守校准；若要给出更高判断，还需要更多跨轮次、可量化、可追问的直接证据。';
// Provider-specific function removed

function buildInterviewScoreCalibrationNextAction(args: {
  scoreCeiling: number;
  evidencePenalty: number;
  status: InterviewSummary['interviewStatus'];
// Provider-specific function removed): string | undefined {
***REMOVED***args.status !== 'complete' || (args.scoreCeiling >= 90 && args.evidencePenalty === 0)) {
    return undefined;
  // Provider-specific function removed

  return '如用于正式面试反馈，建议结合原始逐轮 transcript 复核关键证据，并补一轮贴近岗位场景的 case 验证。';
// Provider-specific function removed

function buildHeuristicInterviewFallbackSummary(args: {
  state: Readonly<ChatroomState>;
  status: InterviewSummary['interviewStatus'];
  stageLabel: string;
  track: InterviewTrack;
  latestQuestion: ChatroomMessage | undefined;
  candidateReplyCount: number;
  waitingForCandidate: boolean;
// Provider-specific function removed): Omit<InterviewSummary, 'interviewStatus' | 'currentStage'> {
  const reviews = collectInterviewQuestionReviews({
    messages: args.state.messages,
    track: args.track,
  // Provider-specific function removed);
  const recorderSignals = collectInterviewRecorderSignals(args.state.recorderState);
  const recorderConcerns =
    args.status === 'complete' ? [] : recorderSignals.concerns;
  const recorderNextSteps =
    args.status === 'complete' ? [] : recorderSignals.nextSteps;
  const gapCounts = countHeuristicInterviewGapCategories(reviews);
  const signalCounts = countHeuristicInterviewSignals(reviews);
  const adequateAnswerCount = reviews.filter((item) => item.coverage?.isAdequate).length;
  const unansweredQuestionCount = reviews.filter((item) => !item.answer).length;
  const overallScore = computeHeuristicInterviewOverallScore({
    status: args.status,
    candidateReplyCount: args.candidateReplyCount,
    adequateAnswerCount,
    unansweredQuestionCount,
    gapCounts,
    signalCounts,
  // Provider-specific function removed);
  const strengths = buildHeuristicInterviewStrengths({
    adequateAnswerCount,
    candidateReplyCount: args.candidateReplyCount,
    recorderHighlights: recorderSignals.highlights,
    signalCounts,
  // Provider-specific function removed);
  const weaknesses = buildHeuristicInterviewWeaknesses({
    gapCounts,
    recorderConcerns,
    waitingForCandidate: args.waitingForCandidate,
    latestQuestion: args.latestQuestion,
  // Provider-specific function removed);
  const missedQuestions = buildHeuristicInterviewMissedQuestions({
    reviews,
    latestQuestion: args.latestQuestion,
    waitingForCandidate: args.waitingForCandidate,
  // Provider-specific function removed);
  const suggestedAnswerImprovements = buildHeuristicInterviewImprovements({
    gapCounts,
    recorderNextSteps,
    waitingForCandidate: args.waitingForCandidate,
  // Provider-specific function removed);
  const followUpQuestions = buildHeuristicInterviewFollowUpQuestions({
    reviews,
    latestQuestion: args.latestQuestion,
    waitingForCandidate: args.waitingForCandidate,
  // Provider-specific function removed);
  const recommendedNextActions = buildHeuristicInterviewNextActions({
    status: args.status,
    waitingForCandidate: args.waitingForCandidate,
    overallScore,
    gapCounts,
    recorderNextSteps,
  // Provider-specific function removed);
  const questionLog = buildHeuristicInterviewQuestionLog(reviews);
  const feedbackItems = buildHeuristicInterviewFeedbackItems(reviews);
  const scoringGuide = resolveInterviewScoringGuide(args.state);
  const confidence = computeHeuristicInterviewConfidence({
    candidateReplyCount: args.candidateReplyCount,
    adequateAnswerCount,
    reviewCount: reviews.length,
    unansweredQuestionCount,
  // Provider-specific function removed);
  const interviewReadiness = resolveHeuristicInterviewReadiness({
    status: args.status,
    overallScore,
    adequateAnswerCount,
    reviewCount: reviews.length,
    gapCounts,
  // Provider-specific function removed);
  const competencyScores = buildHeuristicInterviewCompetencyScores({
    dimensions: scoringGuide.dimensions,
    reviews,
    recorderHighlights: recorderSignals.highlights,
    gapCounts,
    status: args.status,
    candidateReplyCount: args.candidateReplyCount,
    adequateAnswerCount,
  // Provider-specific function removed);
  const roleLabel = asOptionalString(getScenarioMetadata(args.state)?.targetRole) ?? args.state.topic;
  const executiveSummary = buildHeuristicInterviewExecutiveSummary({
    roleLabel,
    stageLabel: args.stageLabel,
    status: args.status,
    overallScore,
    strengths,
    weaknesses,
    waitingForCandidate: args.waitingForCandidate,
  // Provider-specific function removed);

  return {
    executiveSummary,
    interviewReadiness,
    overallScore,
    strengths,
    weaknesses,
    missedQuestions,
    suggestedAnswerImprovements,
    followUpQuestions,
    recommendedNextActions,
    competencyScores,
    confidence,
    questionLog,
    feedbackItems,
  // Provider-specific function removed;
// Provider-specific function removed

function collectInterviewQuestionReviews(args: {
  messages: readonly ChatroomMessage[];
  track: InterviewTrack;
// Provider-specific function removed): HeuristicInterviewQuestionReview[] {
  const reviews: HeuristicInterviewQuestionReview[] = [];
  let managerPromptSeen = false;

  for (let index = 0; index < args.messages.length; index += 1) {
    const prompt = args.messages[index];
  ***REMOVED***
      !prompt ||
      prompt.role !== 'agent' ||
      prompt.round <= 0 ||
      isInterviewMetaContent(prompt.content)
  ***REMOVED***
      continue;
    // Provider-specific function removed

    let answer: ChatroomMessage | undefined;
    let turnKind: InterviewCandidateTurnKind | undefined;
    let coverage: InterviewAnswerCoverageAssessment | undefined;
    let fallbackUser: ChatroomMessage | undefined;
    let fallbackKind: InterviewCandidateTurnKind | undefined;

    for (let nextIndex = index + 1; nextIndex < args.messages.length; nextIndex += 1) {
      const nextMessage = args.messages[nextIndex];
    ***REMOVED***!nextMessage) {
        continue;
      // Provider-specific function removed

    ***REMOVED***
        nextMessage.role === 'agent' &&
        nextMessage.round > 0 &&
        !isInterviewMetaContent(nextMessage.content)
    ***REMOVED***
        break;
      // Provider-specific function removed

    ***REMOVED***nextMessage.role !== 'user' || nextMessage.round <= 0) {
        continue;
      // Provider-specific function removed

      const nextKind = classifyInterviewCandidateTurnMessage(nextMessage, prompt);
    ***REMOVED***nextKind === 'answer' || nextKind === 'withdraw_request') {
        answer = nextMessage;
        turnKind = nextKind;
        coverage = assessInterviewAnswerCoverage({
          candidateMessage: nextMessage,
          previousPrompt: prompt,
        // Provider-specific function removed);
        break;
      // Provider-specific function removed

    ***REMOVED***!fallbackUser) {
        fallbackUser = nextMessage;
        fallbackKind = nextKind;
      // Provider-specific function removed
    // Provider-specific function removed

  ***REMOVED***!answer && fallbackUser) {
      answer = fallbackUser;
      turnKind = fallbackKind;
      coverage = assessInterviewAnswerCoverage({
        candidateMessage: fallbackUser,
        previousPrompt: prompt,
      // Provider-specific function removed);
    // Provider-specific function removed

  ***REMOVED***isHeuristicInterviewRepairPrompt(prompt.content)) {
      const repairableReview = findLatestRepairableInterviewReview(reviews);
    ***REMOVED***repairableReview && (answer || coverage)) {
        const repairedCoverage = answer
          ? assessInterviewAnswerCoverage({
              candidateMessage: answer,
              previousPrompt: repairableReview.prompt,
            // Provider-specific function removed)
          : coverage;
        repairableReview.answer = answer;
        repairableReview.turnKind = turnKind;
        repairableReview.coverage = repairedCoverage;
        continue;
      // Provider-specific function removed
    // Provider-specific function removed

    reviews.push({
      prompt,
      answer,
      turnKind,
      coverage,
      stageLabel: resolveInterviewQuestionReviewStageLabel({
        prompt,
        track: args.track,
        managerPromptSeen,
      // Provider-specific function removed),
    // Provider-specific function removed);

  ***REMOVED***prompt.authorId === 'interview-manager') {
      managerPromptSeen = true;
    // Provider-specific function removed
  // Provider-specific function removed

  return reviews;
// Provider-specific function removed

function isHeuristicInterviewRepairPrompt(value: string***REMOVED***
  return matchesAnyPattern(value, HEURISTIC_INTERVIEW_REPAIR_PROMPT_PATTERNS);
// Provider-specific function removed

function findLatestRepairableInterviewReview(
  reviews: HeuristicInterviewQuestionReview[],
): HeuristicInterviewQuestionReview | undefined {
  for (let index = reviews.length - 1; index >= 0; index -= 1) {
    const review = reviews[index];
  ***REMOVED***!review) {
      continue;
    // Provider-specific function removed

  ***REMOVED***!review.answer) {
      return review;
    // Provider-specific function removed

  ***REMOVED***review.coverage?.isAdequate === false) {
      return review;
    // Provider-specific function removed

  ***REMOVED***looksLikeCorruptedInterviewText(review.answer.content)) {
      return review;
    // Provider-specific function removed
  // Provider-specific function removed

  return undefined;
// Provider-specific function removed

function resolveInterviewQuestionReviewStageLabel(args: {
  prompt: ChatroomMessage;
  track: InterviewTrack;
  managerPromptSeen: boolean;
// Provider-specific function removed): string {
  switch (args.prompt.authorId) {
    case 'interview-technical':
      return resolveInterviewStageLabel('technical_deep_dive', args.track);
    case 'interview-observer':
      return resolveInterviewStageLabel('observer_followup', args.track);
    case 'interview-manager':
      return resolveInterviewStageLabel('manager_round', args.track);
    case 'interview-hr':
      return args.managerPromptSeen
        ? resolveInterviewStageLabel('hr_wrap_up', args.track)
        : args.prompt.round <= 1
          ? resolveInterviewStageLabel('opening', args.track)
          : resolveInterviewStageLabel('hr_followup', args.track);
    default:
      return resolveInterviewStageLabel('technical_deep_dive', args.track);
  // Provider-specific function removed
// Provider-specific function removed

function collectInterviewRecorderSignals(
  recorderState: Readonly<ChatroomRecorderState> | undefined,
): {
  highlights: string[];
  concerns: string[];
  nextSteps: string[];
// Provider-specific function removed {
  const entries =
    recorderState?.entries
      ?.filter((entry) => entry.summaryKind === 'interview')
      .slice()
      .reverse() ?? [];

  return {
    highlights: dedupeStrings(entries.flatMap((entry) => entry.highlights)).slice(0, 4),
    concerns: dedupeStrings(entries.flatMap((entry) => entry.concerns)).slice(0, 4),
    nextSteps: dedupeStrings(entries.flatMap((entry) => entry.nextSteps)).slice(0, 4),
  // Provider-specific function removed;
// Provider-specific function removed

function countHeuristicInterviewGapCategories(
  reviews: readonly HeuristicInterviewQuestionReview[],
): Record<HeuristicInterviewGapCategory, number> {
  const counts: Record<HeuristicInterviewGapCategory, number> = {
    quantitative: 0,
    collaboration: 0,
    motivation: 0,
    reasoning: 0,
    example: 0,
    direct_response: 0,
  // Provider-specific function removed;

  for (const review of reviews) {
    const category =
      review.coverage?.missingCategory ??
      (!review.answer ? 'direct_response' : undefined);
  ***REMOVED***!category) {
      continue;
    // Provider-specific function removed

    counts[category] += 1;
  // Provider-specific function removed

  return counts;
// Provider-specific function removed

function countHeuristicInterviewSignals(
  reviews: readonly HeuristicInterviewQuestionReview[],
): HeuristicInterviewSignalCounts {
  const answers = reviews
    .filter(
      (item) =>
        item.answer &&
        item.turnKind === 'answer' &&
        !looksLikeCorruptedInterviewText(item.answer.content),
    )
    .map((item) => item.answer!.content);

  return {
    quantitative: countMatchingSignalTexts(answers, HEURISTIC_INTERVIEW_QUANTITATIVE_PATTERNS),
    collaboration: countMatchingSignalTexts(answers, HEURISTIC_INTERVIEW_COLLABORATION_PATTERNS),
    reasoning: countMatchingSignalTexts(answers, HEURISTIC_INTERVIEW_REASONING_PATTERNS),
    example: countMatchingSignalTexts(answers, HEURISTIC_INTERVIEW_EXAMPLE_PATTERNS),
    motivation: countMatchingSignalTexts(answers, HEURISTIC_INTERVIEW_MOTIVATION_PATTERNS),
    ownership: countMatchingSignalTexts(answers, HEURISTIC_INTERVIEW_OWNERSHIP_PATTERNS),
  // Provider-specific function removed;
// Provider-specific function removed

function countMatchingSignalTexts(
  values: readonly string[],
  patterns: readonly RegExp[],
): number {
  return values.filter((value) => matchesAnyPattern(value, patterns)).length;
// Provider-specific function removed

function matchesAnyPattern(value: string, patterns: readonly RegExp[]***REMOVED***
  return patterns.some((pattern) => pattern.test(value));
// Provider-specific function removed

function buildHeuristicInterviewStrengths(args: {
  adequateAnswerCount: number;
  candidateReplyCount: number;
  recorderHighlights: readonly string[];
  signalCounts: HeuristicInterviewSignalCounts;
// Provider-specific function removed): string[] {
  const derived: string[] = [];

***REMOVED***args.adequateAnswerCount >= Math.max(2, Math.ceil(args.candidateReplyCount / 2))) {
    derived.push('大多数问题都能保持直接作答，整体表达相对稳定。');
  // Provider-specific function removed
***REMOVED***args.signalCounts.quantitative > 0) {
    derived.push('部分回答给出了数字、指标或前后对比，具备一定量化意识。');
  // Provider-specific function removed
***REMOVED***args.signalCounts.collaboration > 0) {
    derived.push('能描述跨团队对齐或推进过程，说明具备协作推动意识。');
  // Provider-specific function removed
***REMOVED***args.signalCounts.reasoning > 0) {
    derived.push('回答里有判断依据和取舍逻辑，而不仅仅是结论。');
  // Provider-specific function removed
***REMOVED***args.signalCounts.example > 0) {
    derived.push('能够结合真实项目或故障场景举例，证据不完全停留在抽象层。');
  // Provider-specific function removed
***REMOVED***args.signalCounts.ownership > 0) {
    derived.push('对 owner、风险阈值或回滚兜底有明确表达，体现了一定 owner 意识。');
  // Provider-specific function removed
***REMOVED***derived.length === 0 && args.candidateReplyCount > 0) {
    derived.push('候选人已完成若干有效回答，具备继续评估的基础。');
  // Provider-specific function removed

  return dedupeStrings([...args.recorderHighlights, ...derived]).slice(0, 4);
// Provider-specific function removed

function buildHeuristicInterviewWeaknesses(args: {
  gapCounts: Record<HeuristicInterviewGapCategory, number>;
  recorderConcerns: readonly string[];
  waitingForCandidate: boolean;
  latestQuestion: ChatroomMessage | undefined;
// Provider-specific function removed): string[] {
  const derived: string[] = [];

***REMOVED***args.gapCounts.quantitative > 0) {
    derived.push('多处回答缺少数字、比例或结果量化，证据颗粒度还不够。');
  // Provider-specific function removed
***REMOVED***args.gapCounts.collaboration > 0) {
    derived.push('跨团队对齐、阻力处理或 owner 推进细节还需要更具体。');
  // Provider-specific function removed
***REMOVED***args.gapCounts.reasoning > 0) {
    derived.push('部分回答给了结论，但判断依据和取舍展开不足。');
  // Provider-specific function removed
***REMOVED***args.gapCounts.example > 0) {
    derived.push('个别问题缺少完整案例或场景化说明，复盘深度还不够。');
  // Provider-specific function removed
***REMOVED***args.gapCounts.motivation > 0) {
    derived.push('求职动机、岗位匹配或候选人反问表达仍偏泛。');
  // Provider-specific function removed
***REMOVED***args.gapCounts.direct_response > 0) {
    derived.push('个别轮次没有正面回应原问题，导致 interviewer 需要继续追问。');
  // Provider-specific function removed
***REMOVED***args.waitingForCandidate && args.latestQuestion) {
    derived.push('最后一个 interviewer 问题仍待候选人补答，当前证据尚未闭环。');
  // Provider-specific function removed
***REMOVED***derived.length === 0 && args.recorderConcerns.length === 0) {
    derived.push('仍建议结合原始 transcript 做一次人工复核，确认评分和结论边界。');
  // Provider-specific function removed

  return dedupeStrings([...args.recorderConcerns, ...derived]).slice(0, 4);
// Provider-specific function removed

function buildHeuristicInterviewMissedQuestions(args: {
  reviews: readonly HeuristicInterviewQuestionReview[];
  latestQuestion: ChatroomMessage | undefined;
  waitingForCandidate: boolean;
// Provider-specific function removed): string[] {
  return dedupeStrings([
    ...args.reviews
      .filter((item) => !item.answer || item.coverage?.isAdequate === false)
      .map((item) => truncateText(item.prompt.content, 160)),
    ...(args.waitingForCandidate && args.latestQuestion
      ? [truncateText(args.latestQuestion.content, 160)]
      : []),
  ]).slice(0, 4);
// Provider-specific function removed

function buildHeuristicInterviewImprovements(args: {
  gapCounts: Record<HeuristicInterviewGapCategory, number>;
  recorderNextSteps: readonly string[];
  waitingForCandidate: boolean;
// Provider-specific function removed): string[] {
  const improvements: string[] = [];

***REMOVED***args.waitingForCandidate) {
    improvements.push('先把当前问题直接回答完整，再补充背景和延展信息。');
  // Provider-specific function removed
***REMOVED***args.gapCounts.quantitative > 0) {
    improvements.push('关键结果尽量补成数字、比例或前后对比，不要只说“有提升”。');
  // Provider-specific function removed
***REMOVED***args.gapCounts.collaboration > 0) {
    improvements.push('明确说清和哪些团队对齐、对方阻力是什么、你如何推动达成共识。');
  // Provider-specific function removed
***REMOVED***args.gapCounts.reasoning > 0) {
    improvements.push('回答时先给结论，再补充判断依据、边界条件和取舍逻辑。');
  // Provider-specific function removed
***REMOVED***args.gapCounts.example > 0) {
    improvements.push('把关键案例补成“背景-动作-结果-复盘”四段式表达。');
  // Provider-specific function removed
***REMOVED***args.gapCounts.motivation > 0) {
    improvements.push('把求职动机、岗位匹配和想加入该团队的原因讲得更具体。');
  // Provider-specific function removed
***REMOVED***args.gapCounts.direct_response > 0) {
    improvements.push('遇到追问时先正面回应 interviewer 的核心问题，再展开说明。');
  // Provider-specific function removed

  return dedupeStrings([...improvements, ...args.recorderNextSteps]).slice(0, 4);
// Provider-specific function removed

function buildHeuristicInterviewFollowUpQuestions(args: {
  reviews: readonly HeuristicInterviewQuestionReview[];
  latestQuestion: ChatroomMessage | undefined;
  waitingForCandidate: boolean;
// Provider-specific function removed): string[] {
  return dedupeStrings([
    ...(args.waitingForCandidate && args.latestQuestion
      ? [truncateText(args.latestQuestion.content, 160)]
      : []),
    ...args.reviews
      .filter((item) => item.coverage?.isAdequate === false)
      .map((item) => truncateText(item.prompt.content, 160)),
  ]).slice(0, 4);
// Provider-specific function removed

function buildHeuristicInterviewNextActions(args: {
  status: InterviewSummary['interviewStatus'];
  waitingForCandidate: boolean;
  overallScore: number;
  gapCounts: Record<HeuristicInterviewGapCategory, number>;
  recorderNextSteps: readonly string[];
// Provider-specific function removed): string[] {
  const actions: string[] = [];

***REMOVED***args.waitingForCandidate) {
    actions.push('继续等待候选人回复当前问题，不要提前切换到新的 interviewer。');
  // Provider-specific function removed else if (args.status === 'complete') {
    actions.push(
      args.overallScore >= 75
        ? '可进入下一轮更贴近岗位场景的 case / 复试验证。'
        : '在推进下一轮前，先补齐最关键的证据缺口并复核岗位匹配度。',
    );
  // Provider-specific function removed else if (args.status === 'aborted') {
    actions.push('先复盘面试为何提前终止，并在重新开始前确认候选人是否愿意继续。');
  // Provider-specific function removed else {
    actions.push('继续当前阶段，优先补齐最关键的证据缺口。');
  // Provider-specific function removed

***REMOVED***args.gapCounts.quantitative > 0) {
    actions.push('后续追问要明确要求数字、比例和前后对比结果。');
  // Provider-specific function removed
***REMOVED***args.gapCounts.collaboration > 0) {
    actions.push('继续追问跨团队对齐对象、阻力处理方式和 owner 决策边界。');
  // Provider-specific function removed
***REMOVED***args.gapCounts.reasoning > 0 || args.gapCounts.example > 0) {
    actions.push('要求候选人用“背景-动作-结果-复盘”讲完整案例。');
  // Provider-specific function removed
***REMOVED***args.gapCounts.motivation > 0) {
    actions.push('补问求职动机、岗位匹配和候选人对团队的反问。');
  // Provider-specific function removed

  return dedupeStrings([...actions, ...args.recorderNextSteps]).slice(0, 4);
// Provider-specific function removed

function buildHeuristicInterviewQuestionLog(
  reviews: readonly HeuristicInterviewQuestionReview[],
): InterviewQuestionLog[] {
  return reviews.map((review) => ({
    questionId: review.prompt.id,
    interviewerRole: resolveInterviewerRoleLabel(review.prompt.authorId),
    interviewerName: review.prompt.authorName,
    round: review.prompt.round,
    stage: review.stageLabel,
    question: review.prompt.content,
    candidateAnswer: review.answer?.content,
    isAdequate: review.coverage?.isAdequate ?? false,
    evidenceGaps:
      review.coverage?.isAdequate === false && review.coverage.missingCategory
        ? [describeInterviewGap(review.coverage.missingCategory)]
        : !review.answer
          ? ['该问题还没有拿到有效回答。']
          : [],
  // Provider-specific function removed));
// Provider-specific function removed

function buildHeuristicInterviewFeedbackItems(
  reviews: readonly HeuristicInterviewQuestionReview[],
): InterviewFeedbackItem[] {
  const feedback: InterviewFeedbackItem[] = [];

  for (const review of reviews) {
  ***REMOVED***review.coverage?.isAdequate) {
      continue;
    // Provider-specific function removed

    const category =
      review.coverage?.missingCategory ??
      (!review.answer ? 'direct_response' : undefined);
  ***REMOVED***!category) {
      continue;
    // Provider-specific function removed

    feedback.push({
      feedbackId: `feedback-${review.prompt.id// Provider-specific function removed`,
      relatedQuestionId: review.prompt.id,
      dimension: resolveInterviewFeedbackDimension(category),
      suggestion: describeInterviewGapImprovement(category),
      alternativeDirection: `优先回到第 ${review.prompt.round// Provider-specific function removed 轮问题：${truncateText(review.prompt.content, 90)// Provider-specific function removed`,
      severity:
        category === 'direct_response'
          ? 'high'
          : category === 'quantitative' || category === 'collaboration'
            ? 'medium'
            : 'low',
    // Provider-specific function removed);

  ***REMOVED***feedback.length >= 4) {
      break;
    // Provider-specific function removed
  // Provider-specific function removed

  return feedback;
// Provider-specific function removed

function buildHeuristicInterviewCompetencyScores(args: {
  dimensions: readonly string[];
  reviews: readonly HeuristicInterviewQuestionReview[];
  recorderHighlights: readonly string[];
  gapCounts: Record<HeuristicInterviewGapCategory, number>;
  status: InterviewSummary['interviewStatus'];
  candidateReplyCount: number;
  adequateAnswerCount: number;
// Provider-specific function removed): InterviewSummary['competencyScores'] {
  const defaultEvidence = dedupeStrings([
    ...args.recorderHighlights,
    ...args.reviews
      .filter((review) => review.answer && review.coverage?.isAdequate)
      .map((review) => `第 ${review.prompt.round// Provider-specific function removed 轮：${truncateText(review.answer!.content, 80)// Provider-specific function removed`),
  ]);

  return args.dimensions.slice(0, 6).map((dimension) => {
    const focusCategories = inferHeuristicDimensionFocusCategories(dimension);
    const relevantPositiveReviews = args.reviews.filter((review) =>
      review.answer &&
      review.coverage?.isAdequate &&
      reviewMatchesHeuristicDimension(review, focusCategories)
    );
    const relevantNegativeReviews = args.reviews.filter((review) =>
      (!review.answer || review.coverage?.isAdequate === false) &&
      reviewMatchesHeuristicDimension(review, focusCategories)
    );
    const evidence = dedupeStrings([
      ...relevantPositiveReviews.map((review) =>
        `第 ${review.prompt.round// Provider-specific function removed 轮：${truncateText(review.answer!.content, 80)// Provider-specific function removed`),
      ...(relevantPositiveReviews.length === 0 ? defaultEvidence.slice(0, 1) : []),
    ]).slice(0, 2);
    const risks = dedupeStrings([
      ...relevantNegativeReviews.map((review) =>
        review.coverage?.missingCategory
          ? describeInterviewGapRisk(review.coverage.missingCategory)
          : `第 ${review.prompt.round// Provider-specific function removed 轮问题还缺少完整证据。`),
      ...(relevantNegativeReviews.length === 0 && evidence.length === 0
        ? ['当前 transcript 中该维度的直接证据仍偏少。']
        : []),
    ]).slice(0, 2);

    let score = 1;
  ***REMOVED***args.candidateReplyCount >= 1) {
      score += 1;
    // Provider-specific function removed
  ***REMOVED***args.adequateAnswerCount >= Math.max(1, Math.floor(args.reviews.length / 2))) {
      score += 1;
    // Provider-specific function removed
  ***REMOVED***evidence.length > 0) {
      score += 1;
    // Provider-specific function removed
  ***REMOVED***
      args.status === 'complete' &&
      args.adequateAnswerCount >= Math.max(3, Math.ceil(args.reviews.length * 0.6))
  ***REMOVED***
      score += 1;
    // Provider-specific function removed
  ***REMOVED***relevantNegativeReviews.length > 0) {
      score -= 1;
    // Provider-specific function removed
  ***REMOVED***focusCategories.some((category) => args.gapCounts[category] > 0)) {
      score -= 1;
    // Provider-specific function removed

    return {
      dimension,
      score: clampNumber(score, 1, 5),
      evidence,
      risks,
    // Provider-specific function removed;
  // Provider-specific function removed);
// Provider-specific function removed

function inferHeuristicDimensionFocusCategories(
  dimension: string,
): HeuristicInterviewGapCategory[] {
  const categories: HeuristicInterviewGapCategory[] = [];

***REMOVED***matchesAnyPattern(dimension, HEURISTIC_INTERVIEW_QUANTITATIVE_PATTERNS)) {
    categories.push('quantitative');
  // Provider-specific function removed
***REMOVED***matchesAnyPattern(dimension, HEURISTIC_INTERVIEW_COLLABORATION_PATTERNS)) {
    categories.push('collaboration');
  // Provider-specific function removed
***REMOVED***matchesAnyPattern(dimension, HEURISTIC_INTERVIEW_MOTIVATION_PATTERNS)) {
    categories.push('motivation');
  // Provider-specific function removed
***REMOVED***matchesAnyPattern(dimension, HEURISTIC_INTERVIEW_REASONING_PATTERNS)) {
    categories.push('reasoning');
  // Provider-specific function removed
***REMOVED***matchesAnyPattern(dimension, HEURISTIC_INTERVIEW_EXAMPLE_PATTERNS)) {
    categories.push('example');
  // Provider-specific function removed

  return categories.length > 0
    ? dedupeStrings(categories) as HeuristicInterviewGapCategory[]
    : ['reasoning'];
// Provider-specific function removed

function reviewMatchesHeuristicDimension(
  review: HeuristicInterviewQuestionReview,
  categories: readonly HeuristicInterviewGapCategory[],
***REMOVED***
***REMOVED***categories.length === 0) {
    return true;
  // Provider-specific function removed

  const combined = `${review.prompt.content// Provider-specific function removed
${review.answer?.content ?? ''// Provider-specific function removed`;
  return categories.some((category) => matchesHeuristicInterviewCategory(combined, category));
// Provider-specific function removed

function matchesHeuristicInterviewCategory(
  value: string,
  category: HeuristicInterviewGapCategory,
***REMOVED***
  switch (category) {
    case 'quantitative':
      return matchesAnyPattern(value, HEURISTIC_INTERVIEW_QUANTITATIVE_PATTERNS);
    case 'collaboration':
      return matchesAnyPattern(value, HEURISTIC_INTERVIEW_COLLABORATION_PATTERNS);
    case 'motivation':
      return matchesAnyPattern(value, HEURISTIC_INTERVIEW_MOTIVATION_PATTERNS);
    case 'example':
      return matchesAnyPattern(value, HEURISTIC_INTERVIEW_EXAMPLE_PATTERNS);
    case 'reasoning':
    case 'direct_response':
    default:
      return matchesAnyPattern(value, HEURISTIC_INTERVIEW_REASONING_PATTERNS);
  // Provider-specific function removed
// Provider-specific function removed

function computeHeuristicInterviewOverallScore(args: {
  status: InterviewSummary['interviewStatus'];
  candidateReplyCount: number;
  adequateAnswerCount: number;
  unansweredQuestionCount: number;
  gapCounts: Record<HeuristicInterviewGapCategory, number>;
  signalCounts: HeuristicInterviewSignalCounts;
// Provider-specific function removed): number {
***REMOVED***args.candidateReplyCount === 0) {
    return 0;
  // Provider-specific function removed

  let score =
    12 +
    args.candidateReplyCount * 5 +
    args.adequateAnswerCount * 5 +
    Math.min(args.signalCounts.quantitative, 2) * 4 +
    Math.min(args.signalCounts.collaboration, 2) * 4 +
    Math.min(args.signalCounts.reasoning, 2) * 3 +
    Math.min(args.signalCounts.example, 2) * 3 +
    Math.min(args.signalCounts.motivation, 1) * 2 +
    Math.min(args.signalCounts.ownership, 2) * 2;

  score -= args.gapCounts.direct_response * 8;
  score -= args.gapCounts.quantitative * 6;
  score -= args.gapCounts.collaboration * 5;
  score -= args.gapCounts.reasoning * 4;
  score -= args.gapCounts.example * 4;
  score -= args.gapCounts.motivation * 3;
  score -= args.unansweredQuestionCount * 6;

***REMOVED***args.status === 'opening') {
    score = Math.min(score, 35);
  // Provider-specific function removed else if (args.status !== 'complete') {
    score = Math.min(score, 78);
  // Provider-specific function removed

  return clampNumber(Math.round(score), 0, 100);
// Provider-specific function removed

function computeHeuristicInterviewConfidence(args: {
  candidateReplyCount: number;
  adequateAnswerCount: number;
  reviewCount: number;
  unansweredQuestionCount: number;
// Provider-specific function removed): number {
***REMOVED***args.candidateReplyCount === 0 || args.reviewCount === 0) {
    return 0;
  // Provider-specific function removed

  const adequateRatio = args.adequateAnswerCount / Math.max(1, args.reviewCount);
  const confidence =
    0.22 +
    Math.min(args.candidateReplyCount, 6) * 0.07 +
    adequateRatio * 0.12 -
    args.unansweredQuestionCount * 0.04;

  return clampDecimal(confidence, 0.18, 0.82, 2);
// Provider-specific function removed

function resolveHeuristicInterviewReadiness(args: {
  status: InterviewSummary['interviewStatus'];
  overallScore: number;
  adequateAnswerCount: number;
  reviewCount: number;
  gapCounts: Record<HeuristicInterviewGapCategory, number>;
// Provider-specific function removed): InterviewSummary['interviewReadiness'] {
***REMOVED***args.status === 'opening' || args.reviewCount === 0) {
    return 'insufficient_signal';
  // Provider-specific function removed

  const totalGapCount = Object.values(args.gapCounts).reduce((sum, value) => sum + value, 0);
***REMOVED***
    args.overallScore >= 80 &&
    args.adequateAnswerCount >= Math.max(3, Math.ceil(args.reviewCount * 0.6)) &&
    totalGapCount <= 1
***REMOVED***
    return 'strong';
  // Provider-specific function removed

***REMOVED***
    args.overallScore >= 60 &&
    args.adequateAnswerCount >= Math.max(2, Math.floor(args.reviewCount / 2))
***REMOVED***
    return 'mixed';
  // Provider-specific function removed

  return 'needs_more_evidence';
// Provider-specific function removed

function buildHeuristicInterviewExecutiveSummary(args: {
  roleLabel: string;
  stageLabel: string;
  status: InterviewSummary['interviewStatus'];
  overallScore: number;
  strengths: readonly string[];
  weaknesses: readonly string[];
  waitingForCandidate: boolean;
// Provider-specific function removed): string {
  const topStrength = truncateText(args.strengths[0] ?? '已完成基础问答', 60);
  const topWeakness = truncateText(args.weaknesses[0] ?? '仍需继续补证', 60);

***REMOVED***args.status === 'complete') {
    return `候选人已完成 ${args.roleLabel// Provider-specific function removed 面试，基于已落库转录的启发式评估暂给 ${args.overallScore// Provider-specific function removed/100 分。当前亮点是：${topStrength// Provider-specific function removed；主要短板是：${topWeakness// Provider-specific function removed。由于结构化 recorder 未在时限内返回，这份总结由 transcript 与 checkpoint 自动汇总生成。`;
  // Provider-specific function removed

***REMOVED***args.status === 'aborted') {
    return `面试已在 ${args.stageLabel// Provider-specific function removed 提前终止，系统基于已落库转录给出暂评 ${args.overallScore// Provider-specific function removed/100 分。当前已观察到的亮点是：${topStrength// Provider-specific function removed；主要风险是：${topWeakness// Provider-specific function removed。由于结构化 recorder 未在时限内返回，这份总结由 transcript 与 checkpoint 自动汇总生成。`;
  // Provider-specific function removed

***REMOVED***args.waitingForCandidate) {
    return `面试目前停在 ${args.stageLabel// Provider-specific function removed，系统仍在等待候选人回复当前问题。基于已有转录的暂评约为 ${args.overallScore// Provider-specific function removed/100 分，已观察到：${topStrength// Provider-specific function removed；但同时 ${topWeakness// Provider-specific function removed。由于结构化 recorder 超时，以下结论为启发式结果。`;
  // Provider-specific function removed

  return `面试正在 ${args.stageLabel// Provider-specific function removed 继续推进，基于当前转录的启发式评估暂给 ${args.overallScore// Provider-specific function removed/100 分。已观察到：${topStrength// Provider-specific function removed；仍需补强：${topWeakness// Provider-specific function removed。由于结构化 recorder 未及时完成，以下为基于 transcript 的临时总结。`;
// Provider-specific function removed

function resolveInterviewerRoleLabel(authorId: string): string {
  switch (authorId) {
    case 'interview-hr':
      return 'hr_interviewer';
    case 'interview-technical':
      return 'technical_interviewer';
    case 'interview-manager':
      return 'manager_interviewer';
    case 'interview-observer':
      return 'panel_observer';
    default:
      return 'interviewer';
  // Provider-specific function removed
// Provider-specific function removed

function describeInterviewGap(category: HeuristicInterviewGapCategory): string {
  switch (category) {
    case 'quantitative':
      return '缺少数字、比例或量化结果。';
    case 'collaboration':
      return '缺少跨团队对齐、阻力处理或 owner 推进细节。';
    case 'motivation':
      return '求职动机、岗位匹配或候选人反问表达不足。';
    case 'reasoning':
      return '判断依据、取舍逻辑或决策过程展开不足。';
    case 'example':
      return '缺少完整案例、场景复盘或具体过程。';
    case 'direct_response':
    default:
      return '没有正面回应 interviewer 的核心问题。';
  // Provider-specific function removed
// Provider-specific function removed

function describeInterviewGapImprovement(category: HeuristicInterviewGapCategory): string {
  switch (category) {
    case 'quantitative':
      return '把关键结果补成数字、比例或前后对比，便于 interviewer 判断影响。';
    case 'collaboration':
      return '明确说明和哪些团队对齐、阻力是什么、你如何推动达成共识。';
    case 'motivation':
      return '更具体地讲清求职动机、岗位匹配和你最想加入的原因。';
    case 'reasoning':
      return '先给结论，再补充判断依据、边界条件和取舍逻辑。';
    case 'example':
      return '补一个完整案例，覆盖背景、动作、结果和复盘。';
    case 'direct_response':
    default:
      return '先正面回答当前问题，再补充背景和延展信息。';
  // Provider-specific function removed
// Provider-specific function removed

function describeInterviewGapRisk(category: HeuristicInterviewGapCategory): string {
  switch (category) {
    case 'quantitative':
      return '量化结果仍需补到数字或比例级别。';
    case 'collaboration':
      return '跨团队推进和 owner 边界仍需继续补证。';
    case 'motivation':
      return '岗位匹配和求职动机信号仍偏弱。';
    case 'reasoning':
      return '决策依据和取舍逻辑还不够完整。';
    case 'example':
      return '案例和复盘深度仍不足以支撑稳定判断。';
    case 'direct_response':
    default:
      return '仍有问题没有得到直接回应。';
  // Provider-specific function removed
// Provider-specific function removed

function resolveInterviewFeedbackDimension(
  category: HeuristicInterviewGapCategory,
): string {
  switch (category) {
    case 'quantitative':
      return 'quantitative_evidence';
    case 'collaboration':
      return 'cross_team_execution';
    case 'motivation':
      return 'role_fit';
    case 'reasoning':
      return 'decision_reasoning';
    case 'example':
      return 'case_depth';
    case 'direct_response':
    default:
      return 'direct_response';
  // Provider-specific function removed
// Provider-specific function removed

function clampNumber(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
// Provider-specific function removed

function clampDecimal(value: number, min: number, max: number, digits: number): number {
  return Number(clampNumber(value, min, max).toFixed(digits));
// Provider-specific function removed

export type ResolvedInterviewTurnPlan = ControllerResolvedInterviewTurnPlan;

function resolveInterviewPhaseStateLabel(
  phase: InterviewPhaseState,
  track: InterviewTrack,
): string {
***REMOVED***phase === 'complete') {
    return 'complete';
  // Provider-specific function removed

  return resolveInterviewStageLabel(
    phase === 'opening'
      ? 'opening'
      : phase === 'hr_followup'
        ? 'hr_followup'
        : phase === 'technical'
          ? 'technical_deep_dive'
          : phase === 'observer'
            ? 'observer_followup'
            : phase === 'manager'
              ? 'manager_round'
              : 'hr_wrap_up',
    track,
  );
// Provider-specific function removed

function resolveInterviewClarificationResponseMode(
  state: Readonly<ChatroomState>,
  speakerId: string,
  preferredMode: Extract<ResolvedInterviewTurnPlan, { kind: 'ask' // Provider-specific function removed>['responseMode'] = 'new_question',
): Extract<ResolvedInterviewTurnPlan, { kind: 'ask' // Provider-specific function removed>['responseMode'] {
***REMOVED***preferredMode !== 'clarify') {
    return 'new_question';
  // Provider-specific function removed

  const latestCandidateTurn = getLatestInterviewCandidateTurnState(state.messages);
***REMOVED***
    latestCandidateTurn.kind !== 'clarify_request' &&
    latestCandidateTurn.kind !== 'repeat_request'
***REMOVED***
    return 'new_question';
  // Provider-specific function removed

  return resolveLatestInterviewQuestionMessage(state.messages)?.authorId === speakerId
    ? 'clarify'
    : 'new_question';
// Provider-specific function removed

function buildInterviewPlanForStatePhase(args: {
  state: Readonly<ChatroomState>;
  phase: Exclude<InterviewPhaseState, 'complete'>;
  preferredResponseMode?: Extract<ResolvedInterviewTurnPlan, { kind: 'ask' // Provider-specific function removed>['responseMode'];
// Provider-specific function removed): Extract<ResolvedInterviewTurnPlan, { kind: 'ask' // Provider-specific function removed> {
  const track = resolveInterviewTrack(args.state);
  const interviewSummary = getInterviewSummaryFromState(args.state);
  const stageCounts = collectInterviewStageCounts(args.state.messages);

  switch (args.phase) {
    case 'opening': {
      const speakerId =
        resolveInterviewSpeakerId(args.state.roomBlueprint, 'hr_interviewer', 0) ??
        args.state.speakerIds[0] ??
        'interview-hr';
      return {
        kind: 'ask',
        phase: 'opening',
        stageLabel: resolveInterviewStageLabel('opening', track),
        speakerId,
        focus: 'Ask for a realistic opening self-introduction that sets up later follow-up questions.',
        reason: 'The interview has just started and needs an opening question.',
        responseMode: 'new_question',
      // Provider-specific function removed;
    // Provider-specific function removed
    case 'hr_followup': {
      const speakerId =
        resolveInterviewSpeakerId(args.state.roomBlueprint, 'hr_interviewer', 0) ??
        args.state.speakerIds[0] ??
        'interview-hr';
      return {
        kind: 'ask',
        phase: 'hr_followup',
        stageLabel: resolveInterviewStageLabel('hr_followup', track),
        speakerId,
        focus: buildInterviewFocusFromSummary(
          interviewSummary,
          HR_INTERVIEW_KEYWORDS,
          'Close the highest-value hiring-signal gap around motivation, resume consistency, role fit, or communication.',
        ),
        reason:
          stageCounts.hr <= 1
            ? 'The interview must move into the HR follow-up stage after the opening answer.'
            : 'The interview should stay in the HR follow-up stage until the key hiring-signal gaps are closed.',
        responseMode: resolveInterviewClarificationResponseMode(
          args.state,
          speakerId,
          args.preferredResponseMode,
        ),
      // Provider-specific function removed;
    // Provider-specific function removed
    case 'technical': {
      const speakerId =
        resolveInterviewSpeakerId(args.state.roomBlueprint, 'technical_interviewer', 1) ??
        args.state.speakerIds[1] ??
        'interview-technical';
      return {
        kind: 'ask',
        phase: 'technical_deep_dive',
        stageLabel: resolveInterviewStageLabel('technical_deep_dive', track),
        speakerId,
        focus: buildInterviewFocusFromSummary(
          interviewSummary,
          TECHNICAL_INTERVIEW_KEYWORDS,
          resolveInterviewTrackTechnicalFocus(track, stageCounts.technical),
        ),
        reason:
          stageCounts.technical === 0
            ? 'The interview must move into the technical deep-dive stage now.'
            : 'The interview should stay in the technical deep-dive stage until the core evidence is complete.',
        responseMode: resolveInterviewClarificationResponseMode(
          args.state,
          speakerId,
          args.preferredResponseMode,
        ),
      // Provider-specific function removed;
    // Provider-specific function removed
    case 'observer': {
      const speakerId =
        resolveInterviewSpeakerId(args.state.roomBlueprint, 'panel_observer', 3) ??
        args.state.speakerIds[3] ??
        'interview-observer';
      return {
        kind: 'ask',
        phase: 'observer_followup',
        stageLabel: resolveInterviewStageLabel('observer_followup', track),
        speakerId,
        focus: buildInterviewFocusFromSummary(
          interviewSummary,
          OBSERVER_INTERVIEW_KEYWORDS,
          resolveInterviewTrackObserverFocus(track),
        ),
        reason: 'The interview should stay in observer follow-up until the sharpest remaining evidence gap is closed.',
        responseMode: resolveInterviewClarificationResponseMode(
          args.state,
          speakerId,
          args.preferredResponseMode,
        ),
      // Provider-specific function removed;
    // Provider-specific function removed
    case 'manager': {
      const speakerId =
        resolveInterviewSpeakerId(args.state.roomBlueprint, 'manager_interviewer', 2) ??
        args.state.speakerIds[2] ??
        'interview-manager';
      return {
        kind: 'ask',
        phase: 'manager_round',
        stageLabel: resolveInterviewStageLabel('manager_round', track),
        speakerId,
        focus: buildInterviewFocusFromSummary(
          interviewSummary,
          MANAGER_INTERVIEW_KEYWORDS,
          resolveInterviewTrackManagerFocus(track, stageCounts.manager),
        ),
        reason:
          stageCounts.manager === 0
            ? isInterviewDemoBlueprint(args.state.roomBlueprint)
              ? 'The interview should add one comprehensive follow-up after the core evidence is in place.'
              : 'The interview must move into the manager round after the core evidence is in place.'
            : isInterviewDemoBlueprint(args.state.roomBlueprint)
              ? 'The interview should stay in the comprehensive follow-up stage until judgment and collaboration signals are complete.'
              : 'The interview should stay in the manager round until ownership and prioritization signals are complete.',
        responseMode: resolveInterviewClarificationResponseMode(
          args.state,
          speakerId,
          args.preferredResponseMode,
        ),
      // Provider-specific function removed;
    // Provider-specific function removed
    case 'hr_wrapup': {
      const speakerId =
        resolveInterviewSpeakerId(args.state.roomBlueprint, 'hr_interviewer', 0) ??
        args.state.speakerIds[0] ??
        'interview-hr';
      return {
        kind: 'ask',
        phase: 'hr_wrap_up',
        stageLabel: resolveInterviewStageLabel('hr_wrap_up', track),
        speakerId,
        focus: buildInterviewFocusFromSummary(
          interviewSummary,
          HR_INTERVIEW_KEYWORDS,
          'Close the interview with motivation, role fit, and candidate questions in one concise wrap-up prompt.',
        ),
        reason: 'The interview should close with motivation, role fit, and space for candidate questions.',
        responseMode: resolveInterviewClarificationResponseMode(
          args.state,
          speakerId,
          args.preferredResponseMode,
        ),
      // Provider-specific function removed;
    // Provider-specific function removed
  // Provider-specific function removed
// Provider-specific function removed

function enforceInterviewPhaseFloorOnPlan(args: {
  state: Readonly<ChatroomState>;
  plan: ResolvedInterviewTurnPlan;
  fallbackPlan?: ResolvedInterviewTurnPlan;
// Provider-specific function removed): ResolvedInterviewTurnPlan {
  const minimumPhase = resolveMinimumInterviewPhaseState(args.state);
***REMOVED***minimumPhase === 'complete') {
    return args.plan.kind === 'complete'
      ? args.plan
      : {
          kind: 'complete',
          reason: 'The interview phase is already complete and should move to summary.',
          terminalStatus:
            resolveInterviewStatusFromState(args.state) === 'aborted'
              ? 'aborted'
              : 'complete',
        // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***args.plan.kind !== 'ask') {
    return args.plan;
  // Provider-specific function removed

  const planPhase = mapInterviewAskPhaseToStatePhase(args.plan.phase);
***REMOVED***compareInterviewPhaseState(planPhase, minimumPhase) >= 0) {
    return args.plan;
  // Provider-specific function removed

***REMOVED***args.fallbackPlan?.kind === 'ask') {
    const fallbackPhase = mapInterviewAskPhaseToStatePhase(args.fallbackPlan.phase);
  ***REMOVED***compareInterviewPhaseState(fallbackPhase, minimumPhase) >= 0) {
      return args.fallbackPlan;
    // Provider-specific function removed
  // Provider-specific function removed

  return buildInterviewPlanForStatePhase({
    state: args.state,
    phase: minimumPhase,
    preferredResponseMode: args.plan.responseMode,
  // Provider-specific function removed);
// Provider-specific function removed

function resolveInterviewRoomAdminControlPlan(args: {
  state: Readonly<ChatroomState>;
  round: number;
// Provider-specific function removed): ResolvedInterviewTurnPlan | undefined {
  const control = resolveInterviewRoomAdminControl({
    directive: args.state.roomAdminState?.currentDirective,
    round: args.round,
    messages: args.state.messages,
    roomBlueprint: args.state.roomBlueprint,
    speakerIds: args.state.speakerIds,
    trackedPhase: resolveTrackedInterviewPhaseState(args.state),
    minimumPhase: resolveMinimumInterviewPhaseState(args.state),
  // Provider-specific function removed);
***REMOVED***!control) {
    return undefined;
  // Provider-specific function removed

***REMOVED***control.kind !== 'ask') {
    return control;
  // Provider-specific function removed

  const track = resolveInterviewTrack(args.state);
  return enforceInterviewPhaseFloorOnPlan({
    state: args.state,
    plan: {
      ...control,
      stageLabel: resolveInterviewStageLabel(control.phase, track),
    // Provider-specific function removed,
  // Provider-specific function removed);
// Provider-specific function removed


async function planInterviewNextTurn(args: {
  state: Readonly<ChatroomState>;
  workflowId: string;
  stepId: string;
  roomId?: string;
  round: number;
  runtime: WorkflowExecutionContext<ChatroomState, ChatroomAgentContext>['agentRuntime'];
  signal?: AbortSignal;
// Provider-specific function removed): Promise<{
  source: 'planner' | 'heuristic';
  plan: ResolvedInterviewTurnPlan;
// Provider-specific function removed> {
  const fallbackPlan = resolveInterviewTurnPlanFallback(args.state);
  const latestCandidateTurn = getLatestInterviewCandidateTurnState(args.state.messages);
***REMOVED***
    latestCandidateTurn.kind === 'withdraw_request' ||
    shouldShortCircuitInterviewPlanner(args.state, fallbackPlan)
***REMOVED***
    return {
      source: 'heuristic',
      plan: fallbackPlan,
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***isInterviewDemoBlueprint(args.state.roomBlueprint)) {
    return {
      source: 'heuristic',
      plan: fallbackPlan,
    // Provider-specific function removed;
  // Provider-specific function removed

  try {
    const context = createChatroomContext({
      state: args.state,
      workflowId: args.workflowId,
      stepId: args.stepId,
      roomId: args.roomId,
      round: args.round,
      speaker: interviewTurnPlannerProfile,
      transcriptMessages: args.state.messages,
    // Provider-specific function removed);
    const plannerInput = buildInterviewPlannerPrompt(args.state, fallbackPlan);
    const result = await args.runtime.runDetailed(interviewTurnPlannerProfile, plannerInput, {
      context,
      maxTurns: 6,
      signal: args.signal,
      policyHooks: [chatroomSummaryPolicyHook],
    // Provider-specific function removed);

    return {
      source: 'planner',
      plan: maybeApplyInterviewCollaborationHintsToPlan({
        state: args.state,
        plan: enforceInterviewPhaseFloorOnPlan({
          state: args.state,
          plan: normalizeInterviewTurnPlan(args.state, result.output, fallbackPlan),
          fallbackPlan,
        // Provider-specific function removed),
        candidateReplyCount: countInterviewCandidateReplies(args.state.messages),
        stageCounts: collectInterviewStageCounts(args.state.messages),
        track: resolveInterviewTrack(args.state),
        latestConversationMessage: findLatestConversationMessage(args.state.messages),
        latestCandidateTurn: getLatestInterviewCandidateTurnState(args.state.messages),
        latestQuestionMessage: resolveLatestInterviewQuestionMessage(args.state.messages),
        latestAnswerCoverage: assessLatestInterviewCandidateAnswerCoverage(args.state.messages),
        collaborationSummary: resolveInterviewCollaborationSummary(args.state),
      // Provider-specific function removed),
    // Provider-specific function removed;
  // Provider-specific function removed catch {
    return {
      source: 'heuristic',
      plan: fallbackPlan,
    // Provider-specific function removed;
  // Provider-specific function removed
// Provider-specific function removed

export function buildInterviewPlannerPrompt(
  state: Readonly<ChatroomState>,
  fallbackPlan: ResolvedInterviewTurnPlan,
): string {
  const totalCandidateReplies = countInterviewCandidateReplies(state.messages);
  const latestCandidateTurn = getLatestInterviewCandidateTurnState(state.messages);
  const latestCandidateReply = findLatestInterviewCandidateAnswer(state.messages);
  const stageCounts = collectInterviewStageCounts(state.messages);
  const interviewSummary = getInterviewSummaryFromState(state);
  const latestInterviewerQuestion = resolveLatestInterviewQuestionMessage(state.messages);
  const unresolvedSignals = buildInterviewSummarySignals(interviewSummary);
  const track = resolveInterviewTrack(state);
  const scoringGuide = resolveInterviewScoringGuide(state);
  const roomAdminDirective = state.roomAdminState?.currentDirective;
  const hostDirective = state.hostState?.currentDirective;
  const latestAnswerCoverage = assessLatestInterviewCandidateAnswerCoverage(state.messages);
  const trackedPhase = resolveTrackedInterviewPhaseState(state);
  const minimumPhase = resolveMinimumInterviewPhaseState(state);
  const collaborationLines = buildInterviewPlannerCollaborationGuidanceLines(
    resolveInterviewCollaborationSummary(state),
  );

***REMOVED***
    'Plan the next move for this interview room.',
    `Track: ${resolveInterviewTrackLabel(track)// Provider-specific function removed`,
    `Track focus: ${buildInterviewTrackPlannerGuidance(track)// Provider-specific function removed`,
    `Recorded interview phase: ${resolveInterviewPhaseStateLabel(trackedPhase, track)// Provider-specific function removed`,
    `Minimum allowed next phase: ${resolveInterviewPhaseStateLabel(minimumPhase, track)// Provider-specific function removed`,
    `Score template: ${scoringGuide.templateLabel// Provider-specific function removed (${scoringGuide.templateId// Provider-specific function removed)`,
    scoringGuide.dimensions.length > 0
      ? `Score dimensions: ${scoringGuide.dimensions.join(' | ')// Provider-specific function removed`
      : undefined,
    `Candidate valid replies: ${totalCandidateReplies// Provider-specific function removed`,
    `HR turns: ${stageCounts.hr// Provider-specific function removed`,
    `Technical turns: ${stageCounts.technical// Provider-specific function removed`,
    `Observer turns: ${stageCounts.observer// Provider-specific function removed`,
    `Manager turns: ${stageCounts.manager// Provider-specific function removed`,
    interviewSummary
      ? `Structured summary: status=${interviewSummary.interviewStatus// Provider-specific function removed; stage=${interviewSummary.currentStage// Provider-specific function removed; readiness=${interviewSummary.interviewReadiness// Provider-specific function removed; score=${interviewSummary.overallScore// Provider-specific function removed; confidence=${interviewSummary.confidence// Provider-specific function removed`
      : 'No structured summary is available yet. Stay conservative.',
    unresolvedSignals.length > 0
      ? `Open evidence gaps: ${unresolvedSignals.join(' | ')// Provider-specific function removed`
      : 'No explicit evidence gaps are recorded yet.',
    latestAnswerCoverage
      ? `Latest answer coverage: ${latestAnswerCoverage.isAdequate ? 'adequate' : `insufficient (${latestAnswerCoverage.missingCategory ?? 'unknown'// Provider-specific function removed)`// Provider-specific function removed`
      : undefined,
    latestAnswerCoverage?.followUpFocus
      ? `Latest answer missing point: ${latestAnswerCoverage.followUpFocus// Provider-specific function removed`
      : undefined,
    roomAdminDirective?.phaseLabel ? `Governance phase: ${roomAdminDirective.phaseLabel// Provider-specific function removed` : undefined,
    roomAdminDirective?.phaseObjective
      ? `Governance objective: ${roomAdminDirective.phaseObjective// Provider-specific function removed`
      : undefined,
    roomAdminDirective?.instruction
      ? `Room admin guidance: ${roomAdminDirective.instruction// Provider-specific function removed`
      : undefined,
    ...buildHostGuidanceLines(hostDirective),
    collaborationLines.length > 0 ? 'Recent interviewer internal collaboration:' : undefined,
    ...collaborationLines.map((line) => `- ${line// Provider-specific function removed`),
    latestInterviewerQuestion
      ? `Latest interviewer prompt: ${latestInterviewerQuestion.authorName// Provider-specific function removed - ${truncateText(latestInterviewerQuestion.content, 220)// Provider-specific function removed`
      : 'No prior interviewer prompt is available.',
    latestCandidateTurn.message
      ? `Latest candidate turn type: ${resolveCandidateTurnKindLabel(latestCandidateTurn.kind)// Provider-specific function removed | ${truncateText(latestCandidateTurn.message.content, 260)// Provider-specific function removed`
      : 'There is no recent candidate turn yet.',
    latestCandidateReply
      ? `Latest valid answer: ${truncateText(latestCandidateReply.content, 400)// Provider-specific function removed`
      : 'The candidate has not produced a valid answer yet.',
    `Fallback reference: ${fallbackPlan.kind === 'ask' ? `${fallbackPlan.stageLabel// Provider-specific function removed / ${fallbackPlan.focus// Provider-specific function removed` : fallbackPlan.reason// Provider-specific function removed`,
    'Base your decision only on the existing transcript.',
    'Do not move backwards to an earlier phase than the minimum allowed next phase.',
    'If the candidate asked for clarification, repetition, or a pause, prefer wait or clarify instead of advancing the stage.',
    'If core evidence is still thin, keep the same interviewer on the thread.',
    isInterviewDemoBlueprint(state.roomBlueprint)
      ? 'Demo mode: you may skip observer or comprehensive follow-up stages when the evidence is already sufficient, and you may keep technical probing longer when the latest answers still leave meaningful gaps.'
      : undefined,
    isInterviewDemoBlueprint(state.roomBlueprint)
      ? 'Favor a natural interview conversation over mechanically touching every named stage.'
      : undefined,
    'If the main stages are complete and the evidence is strong enough, you may finish.',
    'Return a structured planner object.',
  ]
    .filter((item): item is string => Boolean(item))
    .join('\n');
// Provider-specific function removed

function resolveInterviewDemoProgressionPlan(args: {
  state: Readonly<ChatroomState>;
  candidateReplyCount: number;
  stageCounts: InterviewStageCounts;
  track: InterviewTrack;
  latestConversationMessage: ChatroomMessage | undefined;
  latestCandidateTurn: ReturnType<typeof getLatestInterviewCandidateTurnState>;
  latestQuestionMessage: ChatroomMessage | undefined;
  latestAnswerCoverage?: InterviewAnswerCoverageAssessment;
  collaborationSummary: ReturnType<typeof summarizeInterviewInternalCollaboration>;
// Provider-specific function removed): ResolvedInterviewTurnPlan | undefined {
***REMOVED***!isInterviewDemoBlueprint(args.state.roomBlueprint)) {
    return undefined;
  // Provider-specific function removed

***REMOVED***
    args.latestConversationMessage?.role !== 'user' ||
    args.latestCandidateTurn.kind !== 'answer' ||
    !args.latestCandidateTurn.message ||
    !args.latestQuestionMessage
***REMOVED***
    return undefined;
  // Provider-specific function removed

  const latestAnswer = args.latestCandidateTurn.message.content;
***REMOVED***hasInterviewEvasiveAnswerSignal(latestAnswer)) {
    return undefined;
  // Provider-specific function removed

  const supportiveCandidate =
    args.collaborationSummary?.collaborationSuggestedTone === 'supportive' ||
    hasInterviewWeakAnswerSignal(latestAnswer);
  const latestSpeakerId = args.latestQuestionMessage.authorId;

***REMOVED***
    latestSpeakerId === 'interview-hr' &&
    args.stageCounts.manager >= 1 &&
    args.candidateReplyCount >= MIN_CANDIDATE_REPLIES_FOR_COMPLETION
***REMOVED***
    return {
      kind: 'complete',
      reason: 'The demo interview has already collected enough signal and can close cleanly after the HR wrap-up answer.',
      terminalStatus: 'complete',
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***latestSpeakerId === 'interview-manager' && args.stageCounts.manager >= 1) {
  ***REMOVED***args.candidateReplyCount >= MIN_CANDIDATE_REPLIES_FOR_COMPLETION) {
      return {
        kind: 'complete',
        reason: 'The demo interview already covered the manager lane and has enough signal to finish without another retry loop.',
        terminalStatus: 'complete',
      // Provider-specific function removed;
    // Provider-specific function removed

  ***REMOVED***args.candidateReplyCount >= 5) {
      return buildFollowUpPlanForSpeaker({
        speakerId: 'interview-hr',
        candidateReplyCount: args.candidateReplyCount,
        stageCounts: args.stageCounts,
        track: args.track,
        focus: 'Close with one concise HR wrap-up on role preference, motivation, onboarding expectations, and any final candidate question.',
        reason: 'The demo interview should move into a concise HR wrap-up instead of continuing a low-yield manager retry loop.',
        responseMode: 'new_question',
      // Provider-specific function removed);
    // Provider-specific function removed
  // Provider-specific function removed

***REMOVED***
    latestSpeakerId === 'interview-technical' &&
    args.stageCounts.manager === 0 &&
    args.stageCounts.technical >= 2 &&
    args.candidateReplyCount >= 4 &&
    (supportiveCandidate || args.latestAnswerCoverage?.isAdequate === false)
***REMOVED***
    return buildFollowUpPlanForSpeaker({
      speakerId: 'interview-manager',
      candidateReplyCount: args.candidateReplyCount,
      stageCounts: args.stageCounts,
      track: args.track,
      focus: supportiveCandidate
        ? 'Assess learning ability, ownership boundary, prioritization, and teamwork using one honest student-scale example if needed.'
        : 'Assess ownership, prioritization, and cross-team judgment now that the technical lane has enough demo signal.',
      reason: supportiveCandidate
        ? 'The technical lane already established the candidate experience level, so the demo should switch to manager-style judgment instead of drilling deeper.'
        : 'The demo has enough technical signal to hand off into a manager-style judgment round.',
      responseMode: 'new_question',
    // Provider-specific function removed);
  // Provider-specific function removed

  return undefined;
// Provider-specific function removed

export function resolveInterviewTurnPlanFallback(
  state: Readonly<ChatroomState>,
): ResolvedInterviewTurnPlan {
  const candidateReplyCount = countInterviewCandidateReplies(state.messages);
  const latestConversationMessage = findLatestConversationMessage(state.messages);
  const latestCandidateTurn = getLatestInterviewCandidateTurnState(state.messages);
  const stageCounts = collectInterviewStageCounts(state.messages);
  const interviewSummary = getInterviewSummaryFromState(state);
  const track = resolveInterviewTrack(state);
  const latestQuestionMessage = resolveLatestInterviewQuestionMessage(state.messages);
  const latestAnswerCoverage = assessLatestInterviewCandidateAnswerCoverage(state.messages);
  const consecutiveInadequateAnswerCount = latestQuestionMessage?.authorId
    ? countConsecutiveInadequateCandidateAnswers(state.messages, {
        speakerId: latestQuestionMessage.authorId,
      // Provider-specific function removed)
    : 0;
  const repeatedAnswerCount = countConsecutiveRepeatedCandidateAnswers(state.messages);
  const collaborationSummary = resolveInterviewCollaborationSummary(state);
  const resolveStageLabel = (phase: InterviewAskPhase) =>
    resolveInterviewStageLabel(phase, track);
  const candidateControlPlan = resolveInterviewCandidateControlPlanFromController({
    candidateReplyCount,
    stageCounts,
    latestCandidateTurnKind: latestCandidateTurn.kind,
    latestQuestionMessage,
    resolveStageLabel,
    repeatedAnswerCount,
  // Provider-specific function removed);
***REMOVED***candidateControlPlan) {
    return maybeApplyInterviewCollaborationHintsToPlan({
      state,
      plan: enforceInterviewPhaseFloorOnPlan({
        state,
        plan: candidateControlPlan,
      // Provider-specific function removed),
      candidateReplyCount,
      stageCounts,
      track,
      latestConversationMessage,
      latestCandidateTurn,
      latestQuestionMessage,
      latestAnswerCoverage,
      collaborationSummary,
    // Provider-specific function removed);
  // Provider-specific function removed

***REMOVED***
    latestConversationMessage?.role !== 'user' &&
    isInterviewWaitingForCandidateReply(state)
***REMOVED***
    return {
      kind: 'wait',
      reason: 'The interview is waiting for the candidate to reply before the next interviewer turn.',
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***candidateReplyCount === 0) {
    return maybeApplyInterviewCollaborationHintsToPlan({
      state,
      plan: enforceInterviewPhaseFloorOnPlan({
        state,
        plan: {
          kind: 'ask',
          phase: 'opening',
          stageLabel: resolveInterviewStageLabel('opening', track),
          speakerId:
            resolveInterviewSpeakerId(state.roomBlueprint, 'hr_interviewer', 0) ??
            state.speakerIds[0] ??
            'interview-hr',
          focus: 'Ask for a realistic opening self-introduction that sets up later follow-up questions.',
          reason: 'The interview has just started and needs an opening question.',
          responseMode: 'new_question',
        // Provider-specific function removed,
      // Provider-specific function removed),
      candidateReplyCount,
      stageCounts,
      track,
      latestConversationMessage,
      latestCandidateTurn,
      latestQuestionMessage,
      latestAnswerCoverage,
      collaborationSummary,
    // Provider-specific function removed);
  // Provider-specific function removed

***REMOVED***latestConversationMessage?.role !== 'user') {
    return {
      kind: 'wait',
      reason: 'The interview is waiting for the candidate to reply before the next interviewer turn.',
    // Provider-specific function removed;
  // Provider-specific function removed

  const demoProgressionPlan = resolveInterviewDemoProgressionPlan({
    state,
    candidateReplyCount,
    stageCounts,
    track,
    latestConversationMessage,
    latestCandidateTurn,
    latestQuestionMessage,
    latestAnswerCoverage,
    collaborationSummary,
  // Provider-specific function removed);
***REMOVED***demoProgressionPlan) {
    return maybeApplyInterviewCollaborationHintsToPlan({
      state,
      plan:
        demoProgressionPlan.kind === 'ask'
          ? enforceInterviewPhaseFloorOnPlan({
              state,
              plan: demoProgressionPlan,
            // Provider-specific function removed)
          : demoProgressionPlan,
      candidateReplyCount,
      stageCounts,
      track,
      latestConversationMessage,
      latestCandidateTurn,
      latestQuestionMessage,
      latestAnswerCoverage,
      collaborationSummary,
    // Provider-specific function removed);
  // Provider-specific function removed

  const insufficientAnswerPlan = resolveInterviewInsufficientAnswerPlan({
    state,
    candidateReplyCount,
    stageCounts,
    track,
    latestCandidateTurn,
    latestQuestionMessage,
  // Provider-specific function removed);
***REMOVED***insufficientAnswerPlan) {
    return maybeApplyInterviewCollaborationHintsToPlan({
      state,
      plan: enforceInterviewPhaseFloorOnPlan({
        state,
        plan: insufficientAnswerPlan,
      // Provider-specific function removed),
      candidateReplyCount,
      stageCounts,
      track,
      latestConversationMessage,
      latestCandidateTurn,
      latestQuestionMessage,
      latestAnswerCoverage,
      collaborationSummary,
    // Provider-specific function removed);
  // Provider-specific function removed

***REMOVED***
    shouldAskHrFollowup({
      roomBlueprint: state.roomBlueprint,
      candidateReplyCount,
      stageCounts,
      interviewSummary,
    // Provider-specific function removed)
***REMOVED***
    return maybeApplyInterviewCollaborationHintsToPlan({
      state,
      plan: enforceInterviewPhaseFloorOnPlan({
        state,
        plan: {
          kind: 'ask',
          phase: 'hr_followup',
          stageLabel: resolveInterviewStageLabel('hr_followup', track),
          speakerId:
            resolveInterviewSpeakerId(state.roomBlueprint, 'hr_interviewer', 0) ??
            state.speakerIds[0] ??
            'interview-hr',
          focus: buildInterviewFocusFromSummary(
            interviewSummary,
            HR_INTERVIEW_KEYWORDS,
            'Close the highest-value hiring-signal gap around motivation, resume consistency, role fit, or communication.',
          ),
          reason: 'The introduction still has hiring-signal gaps that HR should close before handoff.',
          responseMode: 'new_question',
        // Provider-specific function removed,
      // Provider-specific function removed),
      candidateReplyCount,
      stageCounts,
      track,
      latestConversationMessage,
      latestCandidateTurn,
      latestQuestionMessage,
      latestAnswerCoverage,
      collaborationSummary,
    // Provider-specific function removed);
  // Provider-specific function removed

***REMOVED***
    shouldContinueTechnicalDeepDive({
      roomBlueprint: state.roomBlueprint,
      candidateReplyCount,
      stageCounts,
      interviewSummary,
    // Provider-specific function removed)
***REMOVED***
    return maybeApplyInterviewCollaborationHintsToPlan({
      state,
      plan: enforceInterviewPhaseFloorOnPlan({
        state,
        plan: {
          kind: 'ask',
          phase: 'technical_deep_dive',
          stageLabel: resolveInterviewStageLabel('technical_deep_dive', track),
          speakerId:
            resolveInterviewSpeakerId(state.roomBlueprint, 'technical_interviewer', 1) ??
            state.speakerIds[1] ??
            'interview-technical',
          focus: buildInterviewFocusFromSummary(
            interviewSummary,
            TECHNICAL_INTERVIEW_KEYWORDS,
            resolveInterviewTrackTechnicalFocus(track, stageCounts.technical),
          ),
          reason:
            stageCounts.technical < MIN_TECHNICAL_INTERVIEW_ROUNDS
              ? 'The technical interviewer should build a minimally reliable evidence base.'
              : 'The technical interviewer should continue because the technical evidence is still thin.',
          responseMode: 'new_question',
        // Provider-specific function removed,
      // Provider-specific function removed),
      candidateReplyCount,
      stageCounts,
      track,
      latestConversationMessage,
      latestCandidateTurn,
      latestQuestionMessage,
      latestAnswerCoverage,
      collaborationSummary,
    // Provider-specific function removed);
  // Provider-specific function removed

***REMOVED***
    shouldUseObserverFollowup({
      roomBlueprint: state.roomBlueprint,
      candidateReplyCount,
      stageCounts,
      interviewSummary,
    // Provider-specific function removed)
***REMOVED***
    return maybeApplyInterviewCollaborationHintsToPlan({
      state,
      plan: enforceInterviewPhaseFloorOnPlan({
        state,
        plan: {
          kind: 'ask',
          phase: 'observer_followup',
          stageLabel: resolveInterviewStageLabel('observer_followup', track),
          speakerId:
            resolveInterviewSpeakerId(state.roomBlueprint, 'panel_observer', 3) ??
            state.speakerIds[3] ??
            'interview-observer',
          focus: buildInterviewFocusFromSummary(
            interviewSummary,
            OBSERVER_INTERVIEW_KEYWORDS,
            resolveInterviewTrackObserverFocus(track),
          ),
          reason: 'The panel observer should close the most important evidence gap before the manager round.',
          responseMode: 'new_question',
        // Provider-specific function removed,
      // Provider-specific function removed),
      candidateReplyCount,
      stageCounts,
      track,
      latestConversationMessage,
      latestCandidateTurn,
      latestQuestionMessage,
      latestAnswerCoverage,
      collaborationSummary,
    // Provider-specific function removed);
  // Provider-specific function removed

***REMOVED***
    shouldAskManagerRound({
      roomBlueprint: state.roomBlueprint,
      candidateReplyCount,
      stageCounts,
      interviewSummary,
    // Provider-specific function removed)
***REMOVED***
    return maybeApplyInterviewCollaborationHintsToPlan({
      state,
      plan: enforceInterviewPhaseFloorOnPlan({
        state,
        plan: {
          kind: 'ask',
          phase: 'manager_round',
          stageLabel: resolveInterviewStageLabel('manager_round', track),
          speakerId:
            resolveInterviewSpeakerId(state.roomBlueprint, 'manager_interviewer', 2) ??
            state.speakerIds[2] ??
            'interview-manager',
          focus: buildInterviewFocusFromSummary(
            interviewSummary,
            MANAGER_INTERVIEW_KEYWORDS,
            resolveInterviewTrackManagerFocus(track, stageCounts.manager),
          ),
          reason:
            stageCounts.manager === 0
              ? isInterviewDemoBlueprint(state.roomBlueprint)
                ? 'The interview should add one comprehensive follow-up after the core technical evidence is in place.'
                : 'The interview should move to the hiring-manager perspective after core technical evidence is in place.'
              : isInterviewDemoBlueprint(state.roomBlueprint)
                ? 'The comprehensive interviewer should continue because growth, judgment, or collaboration signal is still incomplete.'
                : 'The hiring manager should continue because leadership and prioritization signal is still incomplete.',
          responseMode: 'new_question',
        // Provider-specific function removed,
      // Provider-specific function removed),
      candidateReplyCount,
      stageCounts,
      track,
      latestConversationMessage,
      latestCandidateTurn,
      latestQuestionMessage,
      latestAnswerCoverage,
      collaborationSummary,
    // Provider-specific function removed);
  // Provider-specific function removed

***REMOVED***
    shouldAskHrWrapUp({
      roomBlueprint: state.roomBlueprint,
      candidateReplyCount,
      stageCounts,
      interviewSummary,
    // Provider-specific function removed)
***REMOVED***
    return maybeApplyInterviewCollaborationHintsToPlan({
      state,
      plan: enforceInterviewPhaseFloorOnPlan({
        state,
        plan: {
          kind: 'ask',
          phase: 'hr_wrap_up',
          stageLabel: resolveInterviewStageLabel('hr_wrap_up', track),
          speakerId:
            resolveInterviewSpeakerId(state.roomBlueprint, 'hr_interviewer', 0) ??
            state.speakerIds[0] ??
            'interview-hr',
          focus: buildInterviewFocusFromSummary(
            interviewSummary,
            HR_INTERVIEW_KEYWORDS,
            'Close the interview with motivation, role fit, and candidate questions in one concise wrap-up prompt.',
          ),
          reason: 'The interview should close with motivation, room for candidate questions, and final fit signal.',
          responseMode: 'new_question',
        // Provider-specific function removed,
      // Provider-specific function removed),
      candidateReplyCount,
      stageCounts,
      track,
      latestConversationMessage,
      latestCandidateTurn,
      latestQuestionMessage,
      latestAnswerCoverage,
      collaborationSummary,
    // Provider-specific function removed);
  // Provider-specific function removed

  return {
    kind: 'complete',
    reason: 'The candidate has completed the planned interview stages. Recorder synthesis can run now.',
    terminalStatus: 'complete',
  // Provider-specific function removed;
// Provider-specific function removed

function shouldShortCircuitInterviewPlanner(
  state: Readonly<ChatroomState>,
  plan: ResolvedInterviewTurnPlan,
***REMOVED***
***REMOVED***plan.kind === 'wait' || (plan.kind === 'ask' && plan.responseMode === 'clarify')) {
    return true;
  // Provider-specific function removed

***REMOVED***plan.kind !== 'ask' || plan.phase !== 'opening') {
    return false;
  // Provider-specific function removed

  return (
    countInterviewCandidateReplies(state.messages) === 0 &&
    !resolveLatestInterviewQuestionMessage(state.messages)
  );
// Provider-specific function removed

function resolveInterviewCollaborationSummary(
  state: Readonly<ChatroomState>,
): ReturnType<typeof summarizeInterviewInternalCollaboration> {
  return summarizeInterviewInternalCollaboration({
    messages: state.messages,
    interviewInternalNotes: state.interviewInternalNotes,
    interviewPendingCandidateReply: state.interviewPendingCandidateReply,
  // Provider-specific function removed);
// Provider-specific function removed

function buildInterviewPlannerCollaborationGuidanceLines(
  summary: ReturnType<typeof summarizeInterviewInternalCollaboration>,
): string[] {
***REMOVED***!summary) {
  ***REMOVED***];
  // Provider-specific function removed

***REMOVED***
    ...buildInterviewInternalCollaborationPromptLines(summary),
    summary.collaborationSuggestedTone === 'supportive'
      ? 'Planner rule: if the candidate still shows some useful signal but appears junior, nervous, or inexperienced, prefer a narrower guided follow-up on the same evidence thread before switching stages.'
      : undefined,
    summary.collaborationRecommendedActionHint === 'request_answer_retry'
      ? `Planner rule: recent interviewer notes recommend one more retry on the active evidence thread${summary.collaborationRecommendedResponseModeHint === 'clarify' ? ' with clarification or narrowing first' : ''// Provider-specific function removed before handing off.`
      : undefined,
    summary.collaborationRecommendedActionHint === 'complete_interview'
      ? 'Planner rule: treat early-close collaboration notes as a caution signal, not an automatic finish; only finish when the transcript also shows the room has enough evidence or no longer produces meaningful new signal.'
      : undefined,
  ].filter((item): item is string => Boolean(item));
// Provider-specific function removed

function buildInterviewSpeakerCollaborationGuidanceLines(args: {
  summary: ReturnType<typeof summarizeInterviewInternalCollaboration>;
  responseMode: Extract<ResolvedInterviewTurnPlan, { kind: 'ask' // Provider-specific function removed>['responseMode'];
// Provider-specific function removed): string[] {
***REMOVED***!args.summary) {
  ***REMOVED***];
  // Provider-specific function removed

***REMOVED***
    ...buildInterviewInternalCollaborationPromptLines(args.summary),
    args.summary.collaborationSuggestedTone === 'supportive'
      ? 'Interviewer style: keep the tone supportive and structured. If needed, anchor the follow-up to one smaller-scope example such as one coursework project, internship subtask, bug fix, or one decision the candidate personally made.'
      : undefined,
    args.summary.collaborationRecommendedActionHint === 'request_answer_retry' &&
    args.responseMode === 'clarify'
      ? 'Retry mode: stay on the same evidence thread, restate or narrow the current question first, and tell the candidate exactly which missing point to answer next.'
      : undefined,
    args.summary.collaborationRecommendedActionHint === 'request_answer_retry' &&
    args.responseMode === 'new_question'
      ? 'Retry mode: stay on the same evidence thread, but you may switch to a smaller and more concrete angle if that helps the candidate answer directly.'
      : undefined,
    args.summary.collaborationRecommendedActionHint === 'complete_interview'
      ? 'If this turn still produces no new signal, keep the question short and focused instead of opening a broad new topic.'
      : undefined,
  ].filter((item): item is string => Boolean(item));
// Provider-specific function removed

function buildInterviewCollaborationRetryFocus(args: {
  summary: NonNullable<ReturnType<typeof summarizeInterviewInternalCollaboration>>;
  latestAnswerCoverage?: InterviewAnswerCoverageAssessment;
// Provider-specific function removed): string {
  const rawFocus = args.latestAnswerCoverage?.followUpFocus?.trim();
  const baseFocus =
    rawFocus && /keep the same evidence thread/i.test(rawFocus)
      ? rawFocus
      : rawFocus
        ? `Keep the same evidence thread and narrow the question first. ${rawFocus// Provider-specific function removed`
        : 'Keep the same evidence thread and narrow the question first, then pull the candidate back to one concrete missing point before changing topics.';
  const retrySuffix =
    args.summary.collaborationSuggestedTone === 'supportive'
      ? 'If needed, allow one coursework, internship, or junior-scope example, but require the candidate to state their own action, decision, and result clearly.'
      : args.summary.collaborationRecommendedResponseModeHint === 'clarify'
        ? 'Restate or narrow the question before expecting a direct answer.'
        : 'Ask for one direct missing fact before changing topics.';
  return appendInterviewPlanFocus(baseFocus, retrySuffix);
// Provider-specific function removed

function buildInterviewCollaborationFocusSuffix(args: {
  summary: NonNullable<ReturnType<typeof summarizeInterviewInternalCollaboration>>;
  responseMode: Extract<ResolvedInterviewTurnPlan, { kind: 'ask' // Provider-specific function removed>['responseMode'];
// Provider-specific function removed): string | undefined {
***REMOVED***args.summary.collaborationRecommendedActionHint === 'request_answer_retry') {
  ***REMOVED***args.responseMode === 'clarify') {
      return 'Keep the same evidence thread, narrow the question first, and make the candidate fill the exact missing point before moving on.';
    // Provider-specific function removed

    return args.summary.collaborationSuggestedTone === 'supportive'
      ? 'Stay on the same evidence thread and use a smaller, more candidate-owned example if that helps them answer directly.'
      : 'Stay on the same evidence thread and ask for one concrete missing fact directly.';
  // Provider-specific function removed

***REMOVED***args.summary.collaborationSuggestedTone === 'supportive') {
    return 'Keep the tone supportive and structured, and let the candidate answer from one smaller-scope example if it still reveals real evidence.';
  // Provider-specific function removed

  return undefined;
// Provider-specific function removed

function appendInterviewPlanFocus(baseFocus: string, suffix: string | undefined): string {
***REMOVED***!suffix) {
    return baseFocus;
  // Provider-specific function removed

  const normalizedBase = baseFocus.trim();
  return normalizedBase.toLowerCase().includes(suffix.toLowerCase())
    ? normalizedBase
    : `${normalizedBase// Provider-specific function removed ${suffix// Provider-specific function removed`.trim();
// Provider-specific function removed

function maybeApplyInterviewCollaborationHintsToPlan(args: {
  state: Readonly<ChatroomState>;
  plan: ResolvedInterviewTurnPlan;
  candidateReplyCount: number;
  stageCounts: InterviewStageCounts;
  track: InterviewTrack;
  latestConversationMessage: ChatroomMessage | undefined;
  latestCandidateTurn: ReturnType<typeof getLatestInterviewCandidateTurnState>;
  latestQuestionMessage: ChatroomMessage | undefined;
  latestAnswerCoverage?: InterviewAnswerCoverageAssessment;
  collaborationSummary: ReturnType<typeof summarizeInterviewInternalCollaboration>;
// Provider-specific function removed): ResolvedInterviewTurnPlan {
***REMOVED***!args.collaborationSummary || args.plan.kind !== 'ask') {
    return args.plan;
  // Provider-specific function removed

  const summary = args.collaborationSummary;
  const latestUserTurnJustHappened = args.latestConversationMessage?.role === 'user';
  const shouldForceSameThreadRetry =
    summary.collaborationRecommendedActionHint === 'request_answer_retry' &&
    latestUserTurnJustHappened &&
    args.latestCandidateTurn.message &&
    args.latestQuestionMessage &&
    args.latestQuestionMessage.authorId !== args.plan.speakerId &&
    (
      args.latestCandidateTurn.kind !== 'answer' ||
      args.latestAnswerCoverage?.isAdequate === false ||
      summary.collaborationRecommendedResponseModeHint === 'clarify'
    );

***REMOVED***shouldForceSameThreadRetry && args.latestQuestionMessage) {
    return buildFollowUpPlanForSpeaker({
      speakerId: args.latestQuestionMessage.authorId,
      candidateReplyCount: args.candidateReplyCount,
      stageCounts: args.stageCounts,
      track: args.track,
      focus: buildInterviewCollaborationRetryFocus({
        summary,
        latestAnswerCoverage: args.latestAnswerCoverage,
      // Provider-specific function removed),
      reason:
        'Recent interviewer collaboration notes recommend keeping the same evidence thread and adjusting the follow-up style before switching stages.',
      responseMode:
        summary.collaborationRecommendedResponseModeHint ??
        args.plan.responseMode,
    // Provider-specific function removed);
  // Provider-specific function removed

  const canAdjustCurrentAsk =
    summary.collaborationRecommendedActionHint === 'request_answer_retry' ||
    summary.collaborationSuggestedTone === 'supportive';
***REMOVED***!canAdjustCurrentAsk) {
    return args.plan;
  // Provider-specific function removed

  const effectiveResponseMode =
    summary.collaborationRecommendedActionHint === 'request_answer_retry' &&
    latestUserTurnJustHappened &&
    args.latestQuestionMessage?.authorId === args.plan.speakerId
      ? summary.collaborationRecommendedResponseModeHint ?? args.plan.responseMode
      : args.plan.responseMode;
  const adjustedFocus = appendInterviewPlanFocus(
    args.plan.focus,
    buildInterviewCollaborationFocusSuffix({
      summary,
      responseMode: effectiveResponseMode,
    // Provider-specific function removed),
  );

***REMOVED***
    adjustedFocus === args.plan.focus &&
    effectiveResponseMode === args.plan.responseMode
***REMOVED***
    return args.plan;
  // Provider-specific function removed

  return {
    ...args.plan,
    focus: adjustedFocus,
    responseMode: effectiveResponseMode,
  // Provider-specific function removed;
// Provider-specific function removed

function resolveCandidateTurnKindLabel(kind: InterviewCandidateTurnKind | undefined): string {
  switch (kind) {
    case 'answer':
      return 'answer';
    case 'clarify_request':
      return 'clarify_request';
    case 'repeat_request':
      return 'repeat_request';
    case 'pause_request':
      return 'pause_request';
    case 'refusal_request':
      return 'refusal_request';
    case 'withdraw_request':
      return 'withdraw_request';
    case 'other':
      return 'other';
    default:
      return 'unknown';
  // Provider-specific function removed
// Provider-specific function removed

function resolveInterviewCandidateControlPlan(args: {
  state: Readonly<ChatroomState>;
  candidateReplyCount: number;
  stageCounts: InterviewStageCounts;
  track: InterviewTrack;
  latestCandidateTurnKind: InterviewCandidateTurnKind | undefined;
  latestQuestionMessage: ChatroomMessage | undefined;
// Provider-specific function removed): ResolvedInterviewTurnPlan | undefined {
***REMOVED***args.latestCandidateTurnKind === 'withdraw_request') {
    return {
      kind: 'complete',
      reason: 'The candidate explicitly asked to end the interview, so the room should stop and move to synthesis.',
      terminalStatus: 'aborted',
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***args.latestCandidateTurnKind === 'pause_request') {
    return {
      kind: 'wait',
      reason: 'The candidate asked to pause or reported a temporary issue, so the interview should wait instead of advancing.',
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***
    args.latestCandidateTurnKind !== 'clarify_request' &&
    args.latestCandidateTurnKind !== 'repeat_request'
***REMOVED***
    return undefined;
  // Provider-specific function removed

  const latestQuestionMessage = args.latestQuestionMessage;
***REMOVED***!latestQuestionMessage) {
    return {
      kind: 'wait',
      reason: 'The candidate asked for clarification, but there is no outstanding interviewer question to clarify.',
    // Provider-specific function removed;
  // Provider-specific function removed

  return buildClarificationPlanForSpeaker({
    speakerId: latestQuestionMessage.authorId,
    candidateReplyCount: args.candidateReplyCount,
    stageCounts: args.stageCounts,
    track: args.track,
    repeatRequest: args.latestCandidateTurnKind === 'repeat_request',
  // Provider-specific function removed);
// Provider-specific function removed

function buildClarificationPlanForSpeaker(args: {
  speakerId: string;
  candidateReplyCount: number;
  stageCounts: InterviewStageCounts;
  track: InterviewTrack;
  repeatRequest: boolean;
// Provider-specific function removed): ResolvedInterviewTurnPlan {
  const commonFocus = args.repeatRequest
    ? 'Briefly restate the last question in a shorter, clearer way, then wait for the candidate answer.'
    : 'Briefly clarify the intent and scope of the last question, then wait for the candidate answer.';

  return buildFollowUpPlanForSpeaker({
    speakerId: args.speakerId,
    candidateReplyCount: args.candidateReplyCount,
    stageCounts: args.stageCounts,
    track: args.track,
    focus: commonFocus,
    reason: 'The candidate requested clarification, so the same interviewer should restate the current question.',
    responseMode: 'clarify',
  // Provider-specific function removed);
// Provider-specific function removed

function buildFollowUpPlanForSpeaker(args: {
  speakerId: string;
  candidateReplyCount: number;
  stageCounts: InterviewStageCounts;
  track: InterviewTrack;
  focus: string;
  reason: string;
  responseMode: Extract<ResolvedInterviewTurnPlan, { kind: 'ask' // Provider-specific function removed>['responseMode'];
// Provider-specific function removed): ResolvedInterviewTurnPlan {
  const hrPhase =
    args.candidateReplyCount === 0
      ? 'opening'
      : args.stageCounts.manager > 0
        ? 'hr_wrap_up'
        : 'hr_followup';

  switch (args.speakerId) {
    case 'interview-hr':
      return {
        kind: 'ask',
        phase: hrPhase,
        stageLabel: resolveInterviewStageLabel(hrPhase, args.track),
        speakerId: args.speakerId,
        focus: args.focus,
        reason: args.reason,
        responseMode: args.responseMode,
      // Provider-specific function removed;
    case 'interview-observer':
      return {
        kind: 'ask',
        phase: 'observer_followup',
        stageLabel: resolveInterviewStageLabel('observer_followup', args.track),
        speakerId: args.speakerId,
        focus: args.focus,
        reason: args.reason,
        responseMode: args.responseMode,
      // Provider-specific function removed;
    case 'interview-manager':
      return {
        kind: 'ask',
        phase: 'manager_round',
        stageLabel: resolveInterviewStageLabel('manager_round', args.track),
        speakerId: args.speakerId,
        focus: args.focus,
        reason: args.reason,
        responseMode: args.responseMode,
      // Provider-specific function removed;
    case 'interview-technical':
    default:
      return {
        kind: 'ask',
        phase: 'technical_deep_dive',
        stageLabel: resolveInterviewStageLabel('technical_deep_dive', args.track),
        speakerId: args.speakerId,
        focus: args.focus,
        reason: args.reason,
        responseMode: args.responseMode,
      // Provider-specific function removed;
  // Provider-specific function removed
// Provider-specific function removed

function resolveInterviewInsufficientAnswerPlan(args: {
  state: Readonly<ChatroomState>;
  candidateReplyCount: number;
  stageCounts: InterviewStageCounts;
  track: InterviewTrack;
  latestCandidateTurn: ReturnType<typeof getLatestInterviewCandidateTurnState>;
  latestQuestionMessage: ChatroomMessage | undefined;
// Provider-specific function removed): ResolvedInterviewTurnPlan | undefined {
***REMOVED***!args.latestCandidateTurn.message || args.latestCandidateTurn.kind !== 'answer') {
    return undefined;
  // Provider-specific function removed

  const coverage = assessLatestInterviewCandidateAnswerCoverage(args.state.messages);
***REMOVED***!coverage || coverage.isAdequate || !args.latestQuestionMessage) {
    return undefined;
  // Provider-specific function removed

  return buildFollowUpPlanForSpeaker({
    speakerId: args.latestQuestionMessage.authorId,
    candidateReplyCount: args.candidateReplyCount,
    stageCounts: args.stageCounts,
    track: args.track,
    focus:
      coverage.followUpFocus ??
      '先把上一问缺失的关键点直接回答清楚，不要切换到新话题。',
    reason:
      'The candidate responded, but the reply did not directly cover the key point the current interviewer asked for.',
    responseMode: 'new_question',
  // Provider-specific function removed);
// Provider-specific function removed

function resolveInterviewCompletionClosingTurn(args: {
  state: Readonly<ChatroomState>;
  speakerById: ReadonlyMap<string, AgentProfile<ChatroomAgentContext, 'text'>>;
// Provider-specific function removed): {
  speaker: AgentProfile<ChatroomAgentContext, 'text'>;
  prompt: string;
  fallbackMessage: string;
// Provider-specific function removed | undefined {
***REMOVED***resolveInterviewStatusFromState(args.state) === 'aborted') {
    return undefined;
  // Provider-specific function removed

  const latestCandidateTurn = getLatestInterviewCandidateTurnState(args.state.messages);
  const latestQuestionMessage = resolveLatestInterviewQuestionMessage(args.state.messages);
***REMOVED***
    latestCandidateTurn.kind !== 'answer' ||
    !latestCandidateTurn.message ||
    !latestQuestionMessage ||
    latestQuestionMessage.authorId !== 'interview-hr'
***REMOVED***
    return undefined;
  // Provider-specific function removed

  const trackedPhase = resolveTrackedInterviewPhaseState(args.state);
***REMOVED***trackedPhase !== 'hr_wrapup' && trackedPhase !== 'complete') {
    return undefined;
  // Provider-specific function removed

  const speaker =
    args.speakerById.get(latestQuestionMessage.authorId) ??
    args.speakerById.get(
      resolveInterviewSpeakerId(args.state.roomBlueprint, 'hr_interviewer', 0) ?? 'interview-hr',
    );
***REMOVED***!speaker) {
    return undefined;
  // Provider-specific function removed

  return {
    speaker,
    prompt: buildInterviewCompletionClosingPrompt({
      state: args.state,
      speaker,
      latestQuestionMessage,
      latestCandidateMessage: latestCandidateTurn.message,
    // Provider-specific function removed),
    fallbackMessage: buildFallbackInterviewCompletionClosingMessage({
      latestCandidateMessage: latestCandidateTurn.message,
    // Provider-specific function removed),
  // Provider-specific function removed;
// Provider-specific function removed

function buildInterviewCompletionClosingPrompt(args: {
  state: Readonly<ChatroomState>;
  speaker: AgentProfile<ChatroomAgentContext, 'text'>;
  latestQuestionMessage: ChatroomMessage;
  latestCandidateMessage: ChatroomMessage;
// Provider-specific function removed): string {
  const scenario = getScenarioMetadata(args.state);
  const candidateName =
    asOptionalString(scenario?.candidateName) ??
    resolvePrimaryHumanParticipantLabel(args.state.roomBlueprint);
  const targetRole = asOptionalString(scenario?.targetRole) ?? args.state.topic;

***REMOVED***
    `You are ${args.speaker.name// Provider-specific function removed and the interview is ending now.`,
    `Candidate: ${candidateName// Provider-specific function removed.`,
    `Target role: ${targetRole// Provider-specific function removed.`,
    `Latest closing question: ${truncateText(args.latestQuestionMessage.content, 220)// Provider-specific function removed`,
    `Latest candidate answer: ${truncateText(args.latestCandidateMessage.content, 320)// Provider-specific function removed`,
    'Write exactly one short closing room message in Simplified Chinese.',
    'Acknowledge the candidate response and close the interview politely.',
    'Do not ask a new question.',
    'If the candidate asked about salary, remote policy, process, or other company specifics, reply conservatively and say the recruiting team can follow up later. Do not invent commitments.',
    `Keep the message under ${args.state.maxReplyCharacters ?? 220// Provider-specific function removed characters and prefer 1-2 compact sentences.`,
  ].join('\n');
// Provider-specific function removed

function buildFallbackInterviewCompletionClosingMessage(args: {
  latestCandidateMessage: ChatroomMessage;
// Provider-specific function removed): string {
  const askedFollowupQuestion = /[?？]/u.test(args.latestCandidateMessage.content);
***REMOVED***askedFollowupQuestion) {
    return '感谢你的回答，也谢谢你的提问。今天的面试就到这里，关于你提到的岗位细节我们会由招聘同事后续与你同步。';
  // Provider-specific function removed

  return '感谢你的回答和分享，今天的面试就到这里。后续结果会由招聘团队与您沟通。';
// Provider-specific function removed

export function buildInterviewSpeakerTurnPrompt(
  plan: Extract<ResolvedInterviewTurnPlan, { kind: 'ask' // Provider-specific function removed>,
  state: Readonly<ChatroomState>,
): string {
  const scenario = getScenarioMetadata(state);
  const focusAreas = resolveInterviewFocusAreas(state);
  const candidateName =
    asOptionalString(scenario?.candidateName) ?? resolvePrimaryHumanParticipantLabel(state.roomBlueprint);
  const targetRole = asOptionalString(scenario?.targetRole) ?? state.topic;
  const targetLevel = asOptionalString(scenario?.targetLevel);
  const latestCandidateTurn = getLatestInterviewCandidateTurnState(state.messages);
  const latestCandidateReply = findLatestInterviewCandidateAnswer(state.messages);
  const latestInterviewerQuestion = resolveLatestInterviewQuestionMessage(state.messages);
  const interviewSummary = getInterviewSummaryFromState(state);
  const track = resolveInterviewTrack(state);
  const scoringGuide = resolveInterviewScoringGuide(state);
  const stageGuidance = resolveInterviewStageExecutionGuidance(plan.phase, track);
  const unresolvedSignals = buildInterviewSummarySignals(interviewSummary);
  const roomAdminDirective = state.roomAdminState?.currentDirective;
  const hostDirective = state.hostState?.currentDirective;
  const collaborationSummary = resolveInterviewCollaborationSummary(state);
  const collaborationLines = buildInterviewSpeakerCollaborationGuidanceLines({
    summary: collaborationSummary,
    responseMode:
      collaborationSummary?.collaborationRecommendedActionHint === 'request_answer_retry' &&
      collaborationSummary.collaborationRecommendedResponseModeHint
        ? collaborationSummary.collaborationRecommendedResponseModeHint
        : plan.responseMode,
  // Provider-specific function removed);
  const continuityMode: 'opening' | 'same_interviewer_followup' | 'handoff' | 'clarify' =
    plan.responseMode === 'clarify'
      ? 'clarify'
      : !latestInterviewerQuestion
        ? 'opening'
        : latestInterviewerQuestion.authorId === plan.speakerId
          ? 'same_interviewer_followup'
          : 'handoff';
  const scenarioExecutionLines = buildInterviewSpeakerExecutionPromptLines({
    roomBlueprint: state.roomBlueprint,
    speakerName: resolveBlueprintSpeakerLabel(state.roomBlueprint, plan.speakerId) ?? plan.speakerId,
    stageLabel: plan.stageLabel,
    phase: plan.phase,
    responseMode: plan.responseMode,
    continuityMode,
    currentPhaseLabel: state.roomAdminState?.currentPhaseLabel,
    currentPhaseObjective: state.roomAdminState?.currentPhaseObjective,
  // Provider-specific function removed);

***REMOVED***
    `Current stage: ${plan.stageLabel// Provider-specific function removed`,
    `Track: ${resolveInterviewTrackLabel(track)// Provider-specific function removed`,
    `Candidate: ${candidateName// Provider-specific function removed`,
    `Target role: ${targetRole// Provider-specific function removed${targetLevel ? ` / ${targetLevel// Provider-specific function removed` : ''// Provider-specific function removed`,
    isInterviewDemoBlueprint(state.roomBlueprint)
      ? 'Demo mode: stay adaptive and conversational. Use the latest candidate answer to decide the next best question instead of following a rigid interview script.'
      : undefined,
    focusAreas.length > 0 ? `Focus areas: ${focusAreas.join(', ')// Provider-specific function removed` : undefined,
    `Score template: ${scoringGuide.templateLabel// Provider-specific function removed (${scoringGuide.templateId// Provider-specific function removed)`,
    scoringGuide.dimensions.length > 0
      ? `Score dimensions to probe: ${scoringGuide.dimensions.join(', ')// Provider-specific function removed`
      : undefined,
    interviewSummary
      ? `Structured summary: status=${interviewSummary.interviewStatus// Provider-specific function removed; stage=${interviewSummary.currentStage// Provider-specific function removed; readiness=${interviewSummary.interviewReadiness// Provider-specific function removed; score=${interviewSummary.overallScore// Provider-specific function removed`
      : undefined,
    unresolvedSignals.length > 0
      ? `Open evidence gaps: ${unresolvedSignals.join(' | ')// Provider-specific function removed`
      : undefined,
    roomAdminDirective?.instruction
      ? `Room admin guidance: ${roomAdminDirective.instruction// Provider-specific function removed`
      : undefined,
    ...buildHostGuidanceLines(hostDirective),
    collaborationLines.length > 0 ? 'Internal collaboration guidance:' : undefined,
    ...collaborationLines.map((line) => `- ${line// Provider-specific function removed`),
    scenarioExecutionLines.length > 0 ? 'Scenario execution guidance:' : undefined,
    ...scenarioExecutionLines.map((line) => `- ${line// Provider-specific function removed`),
    `Turn objective: ${plan.focus// Provider-specific function removed`,
    stageGuidance,
    latestCandidateTurn.message
      ? `Latest candidate turn type: ${resolveCandidateTurnKindLabel(latestCandidateTurn.kind)// Provider-specific function removed | ${truncateText(latestCandidateTurn.message.content, 220)// Provider-specific function removed`
      : undefined,
    latestInterviewerQuestion && latestInterviewerQuestion.authorId !== plan.speakerId
      ? `You are continuing from another interviewer. Previous prompt: ${latestInterviewerQuestion.authorName// Provider-specific function removed - ${truncateText(latestInterviewerQuestion.content, 220)// Provider-specific function removed`
      : undefined,
    plan.responseMode === 'clarify'
      ? 'The candidate asked for clarification or repetition. First restate or narrow the current question in 1-2 sentences; do not jump to a new topic.'
      : undefined,
    latestCandidateReply
      ? `Build on the latest valid answer instead of restarting: ${truncateText(latestCandidateReply.content, 280)// Provider-specific function removed`
      : 'This is before the first substantive answer. Ask a natural opening question.',
    'Output requirements:',
    '1. Send exactly one interviewer message.',
    '2. Default to one main question. At most add one short clarification clause.',
    '3. Keep it realistic, specific, and evaluable.',
    '4. If you are taking over from another interviewer, visibly continue the thread.',
    '5. Keep the final message concise and under the room character limit.',
    `6. Hard limit: ${state.maxReplyCharacters ?? 1000// Provider-specific function removed characters.`,
    '7. Use Simplified Chinese.',
  ]
    .filter((item): item is string => Boolean(item))
    .join('\n');
// Provider-specific function removed

function createRoomKernelStep(args: {
  id: string;
  round: number;
  roomId?: string;
  runtimeMode: RoomRuntimeMode;
// Provider-specific function removed): WorkflowStep<ChatroomState, ChatroomAgentContext> {
  return {
    id: args.id,
    kind: 'custom',
    agentIds: [chatroomRoomKernelProfile.id],
    async execute(context) {
      const stateBefore = context.sharedState.readSnapshot();
      const startedAt = new Date().toISOString();
      const runtimeMode = resolveRoomRuntimeModeFromBlueprint(
        stateBefore.state.roomBlueprint,
        args.runtimeMode,
      );

    ***REMOVED***!isNextRoomRuntimeMode(runtimeMode)) {
        context.trace.push({
          stepId: args.id,
          kind: 'custom',
          agentIds: [],
          startedAt,
          endedAt: new Date().toISOString(),
          stateVersionBefore: stateBefore.version,
          stateVersionAfter: stateBefore.version,
          inputPreview: 'room kernel disabled for legacy runtime',
          output: [],
          status: 'completed',
        // Provider-specific function removed);
        return;
      // Provider-specific function removed

      const agentContext = createChatroomContext({
        state: stateBefore.state,
        workflowId: context.workflowId,
        stepId: args.id,
        roomId: args.roomId,
        round: args.round,
        speaker: chatroomRoomKernelProfile,
        transcriptMessages: stateBefore.state.messages,
      // Provider-specific function removed);

      let output: RoomKernelTurn;
      let usage: Record<string, unknown> | undefined;
      let guardrails: unknown;
      let telemetry: AgentRunTelemetry | undefined;
      let inputPreview = '';

      try {
        const input = buildRoomKernelPrompt({
          state: stateBefore.state,
          round: args.round,
          runtimeMode,
        // Provider-specific function removed);
        inputPreview = input;
        const runResult = await context.agentRuntime.runDetailed(
          chatroomRoomKernelProfile,
          input,
          {
            context: agentContext,
            maxTurns: 6,
            signal: context.signal,
            policyHooks: [chatroomSummaryPolicyHook],
          // Provider-specific function removed,
        );
        output = runResult.output;
        usage = runResult.usage;
        guardrails = runResult.guardrails;
        telemetry = runResult.telemetry;
      // Provider-specific function removed catch {
        output = buildChatroomRoomKernelFallback({
          state: stateBefore.state,
          round: args.round,
          runtimeMode,
        // Provider-specific function removed);
        inputPreview = 'fallback room kernel analysis';
      // Provider-specific function removed

      const endedAt = new Date().toISOString();
      const mutation = context.sharedState.mutate((state) => {
        const directive = createRoomKernelDirective({
          state,
          turn: output,
          round: args.round,
          runtimeMode,
          now: endedAt,
        // Provider-specific function removed);
        state.roomKernelState = {
          schemaVersion: 1,
          lastUpdatedAt: endedAt,
          currentDirective: directive,
          history: directive
            ? [directive, ...(state.roomKernelState?.history ?? [])].slice(0, 16)
            : [...(state.roomKernelState?.history ?? [])],
        // Provider-specific function removed;
      // Provider-specific function removed, {
        expectedVersion: stateBefore.version,
        label: args.id,
      // Provider-specific function removed);

      context.trace.push({
        stepId: args.id,
        kind: 'custom',
        agentIds: [chatroomRoomKernelProfile.id],
        startedAt,
        endedAt,
        stateVersionBefore: stateBefore.version,
        stateVersionAfter: mutation.version,
        inputPreview,
        output: [{
          profileId: chatroomRoomKernelProfile.id,
          output,
          usage,
          telemetry,
          startedAt,
          endedAt,
          status: 'completed',
        // Provider-specific function removed],
        usage,
        guardrails,
        telemetry,
        status: 'completed',
      // Provider-specific function removed);
    // Provider-specific function removed,
  // Provider-specific function removed;
// Provider-specific function removed

export function buildRoomKernelPrompt(args: {
  state: Readonly<ChatroomState>;
  round: number;
  runtimeMode: RoomRuntimeMode;
// Provider-specific function removed): string {
  const interviewSummary = getInterviewSummaryFromState(args.state);
  const latestQuestion = resolveLatestInterviewQuestionMessage(args.state.messages);
  const latestCandidateTurn = getLatestInterviewCandidateTurnState(args.state.messages);
  const stageCounts = isInterviewScenario(args.state.roomBlueprint)
    ? collectInterviewStageCounts(args.state.messages)
    : undefined;
  const collaborationLines =
    args.state.roomBlueprint?.scenarioTemplateId === 'interview_simulation'
      ? buildInterviewInternalCollaborationPromptLines(
          summarizeInterviewInternalCollaboration({
            messages: args.state.messages,
            interviewInternalNotes: args.state.interviewInternalNotes,
            interviewPendingCandidateReply: args.state.interviewPendingCandidateReply,
          // Provider-specific function removed),
        )
      : [];

***REMOVED***
    '你正在为 room kernel 生成一份当前回合的房间态势判断。',
    `Runtime mode: ${args.runtimeMode// Provider-specific function removed`,
    `Scenario: ${args.state.roomBlueprint?.scenarioTemplateId ?? args.state.roomType// Provider-specific function removed`,
    `Round: ${args.round// Provider-specific function removed`,
    `Current phase: ${resolveRoomKernelPhaseLabel(args.state)// Provider-specific function removed`,
    args.state.interviewPendingCandidateReply
      ? `Pending reply: yes | prompt=${args.state.interviewPendingCandidateReply.promptMessageId// Provider-specific function removed`
      : 'Pending reply: no',
    latestQuestion
      ? `Latest question: ${latestQuestion.authorName// Provider-specific function removed | ${truncateText(latestQuestion.content, 220)// Provider-specific function removed`
      : 'Latest question: none',
    latestCandidateTurn.message
      ? `Latest candidate turn: ${latestCandidateTurn.kind// Provider-specific function removed | ${truncateText(latestCandidateTurn.message.content, 220)// Provider-specific function removed`
      : `Latest candidate turn: ${latestCandidateTurn.kind// Provider-specific function removed`,
    interviewSummary
      ? `Interview summary: status=${interviewSummary.interviewStatus// Provider-specific function removed; stage=${interviewSummary.currentStage// Provider-specific function removed; readiness=${interviewSummary.interviewReadiness// Provider-specific function removed; score=${interviewSummary.overallScore// Provider-specific function removed`
      : undefined,
    stageCounts
      ? `Stage counts: hr=${stageCounts.hr// Provider-specific function removed; technical=${stageCounts.technical// Provider-specific function removed; manager=${stageCounts.manager// Provider-specific function removed; observer=${stageCounts.observer// Provider-specific function removed`
      : undefined,
    args.state.roomAdminState?.currentDirective
      ? `Room admin directive: ${args.state.roomAdminState.currentDirective.action// Provider-specific function removed | ${args.state.roomAdminState.currentDirective.reason || args.state.roomAdminState.currentDirective.instruction || '-'// Provider-specific function removed`
      : 'Room admin directive: none',
    args.state.hostState?.currentDirective
      ? `Host directive: ${args.state.hostState.currentDirective.action// Provider-specific function removed | ${args.state.hostState.currentDirective.focus || args.state.hostState.currentDirective.instruction || '-'// Provider-specific function removed`
      : 'Host directive: none',
    collaborationLines.length > 0 ? 'Recent interviewer internal collaboration:' : undefined,
    ...collaborationLines.map((line) => `- ${line// Provider-specific function removed`),
    'Decision rules:',
    '1. Favor observe when the room is healthy.',
    '2. Use guide_room_admin when the room needs intervention but can still continue after adjustment.',
    '3. Use hold when the correct move is to wait instead of pushing a new turn.',
    '4. Use terminate_interview only when continuing would no longer be meaningful.',
    '5. Be conservative and concise.',
  ]
    .filter((item): item is string => Boolean(item))
    .join('\n');
// Provider-specific function removed

export function buildChatroomRoomKernelFallback(args: {
  state: Readonly<ChatroomState>;
  round: number;
  runtimeMode: RoomRuntimeMode;
// Provider-specific function removed): RoomKernelTurn {
  const latestQuestion = resolveLatestInterviewQuestionMessage(args.state.messages);
  const latestCandidateTurn = getLatestInterviewCandidateTurnState(args.state.messages);
  const repeatedAnswerCount = countConsecutiveRepeatedCandidateAnswers(args.state.messages);
  const nonResponsiveCount = countConsecutiveNonResponsiveCandidateTurns(args.state.messages);
  const refusalCount = countConsecutiveRefusalCandidateTurns(args.state.messages);
  const inadequateAnswerCount = countConsecutiveInadequateCandidateAnswers(args.state.messages);
  const collaborationSummary =
    args.state.roomBlueprint?.scenarioTemplateId === 'interview_simulation'
      ? summarizeInterviewInternalCollaboration({
          messages: args.state.messages,
          interviewInternalNotes: args.state.interviewInternalNotes,
          interviewPendingCandidateReply: args.state.interviewPendingCandidateReply,
        // Provider-specific function removed)
      : undefined;

***REMOVED***args.state.interviewTerminalStatus === 'aborted') {
    return {
      action: 'terminate_interview',
      phaseLabel: resolveRoomKernelPhaseLabel(args.state),
      summary: '房间已经进入异常终止态，建议结束当前面试。',
      blockers: ['当前房间已处于 aborted 状态。'],
      recommendedInstruction: '结束本场面试并给出中止说明。',
      shouldEscalateRoomAdmin: true,
      targetSpeakerId: latestQuestion?.authorId ?? '',
      targetPromptMessageId: latestQuestion?.id ?? '',
      confidence: 0.72,
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***args.state.interviewPendingCandidateReply) {
    const shouldEscalatePendingThread =
      latestCandidateTurn.kind === 'pause_request' ||
      latestCandidateTurn.kind === 'refusal_request' ||
      (latestCandidateTurn.kind === 'other' && Boolean(latestQuestion?.authorId));
    const pendingSummary =
      latestCandidateTurn.kind === 'pause_request'
        ? 'The candidate asked to pause or recover the connection, so room-admin judgment is needed before the interview continues.'
        : latestCandidateTurn.kind === 'refusal_request'
          ? 'The candidate refused the active interview question, so room-admin should decide whether to retry once or terminate the interview.'
          : latestCandidateTurn.kind === 'other' && latestQuestion?.authorId
            ? 'The candidate did not address the active interview question directly, so room-admin should decide whether to restate the thread or terminate the interview.'
            : 'The interview is still waiting on the candidate reply for the active question and should not advance yet.';
    const pendingBlockers =
      latestCandidateTurn.kind === 'pause_request'
        ? ['candidate requested a pause or reconnection window']
        : latestCandidateTurn.kind === 'refusal_request'
          ? ['candidate refused the active question']
          : latestCandidateTurn.kind === 'other' && latestQuestion?.authorId
            ? ['candidate stayed non-responsive to the active question']
            : ['the active interviewer question is still waiting for a candidate reply'];
    const pendingInstruction =
      latestCandidateTurn.kind === 'pause_request'
        ? 'Let room-admin decide whether to keep waiting or close the interview if the candidate cannot recover soon.'
        : latestCandidateTurn.kind === 'refusal_request'
          ? 'Ask room-admin to decide whether the interviewer should retry once from a narrower angle or terminate the interview.'
          : latestCandidateTurn.kind === 'other' && latestQuestion?.authorId
            ? 'Ask room-admin to decide whether the interviewer should restate the same question or terminate the interview if the candidate remains off-topic.'
            : 'Keep the room waiting on the active question instead of advancing to a new stage.';
    const guidedPendingSummary =
      collaborationSummary?.collaborationRecommendedActionHint === 'complete_interview' &&
      shouldEscalatePendingThread
        ? 'Internal interviewer collaboration notes say the room may no longer be getting new evidence on the active thread, so room-admin should decide whether to close instead of forcing another loop.'
        : pendingSummary;
    const guidedPendingBlockers =
      collaborationSummary?.collaborationRecommendedActionHint === 'complete_interview' &&
      shouldEscalatePendingThread
        ? [...pendingBlockers, 'internal collaboration notes say the room is not gaining new evidence']
        : pendingBlockers;
    const guidedPendingInstruction =
      collaborationSummary?.collaborationRecommendedActionHint === 'complete_interview' &&
      shouldEscalatePendingThread
        ? 'Ask room-admin whether one final guided retry is still worthwhile; otherwise close the interview cleanly instead of repeating the same thread again.'
        : collaborationSummary?.collaborationSuggestedTone === 'supportive' &&
            shouldEscalatePendingThread
          ? latestCandidateTurn.kind === 'pause_request'
            ? 'Ask room-admin to keep the room waiting and leave the interviewer thread intact until the candidate can recover.'
            : 'Ask room-admin to let the same interviewer restate the question in a more guided way, accept a smaller-scope example, and keep the same evidence thread.'
          : pendingInstruction;

    return {
      action: shouldEscalatePendingThread ? 'guide_room_admin' : 'hold',
      phaseLabel: resolveRoomKernelPhaseLabel(args.state),
      summary: guidedPendingSummary,
      blockers: guidedPendingBlockers,
      recommendedInstruction: guidedPendingInstruction,
      shouldEscalateRoomAdmin: shouldEscalatePendingThread,
      targetSpeakerId: latestQuestion?.authorId ?? '',
      targetPromptMessageId: latestQuestion?.id ?? '',
      confidence: latestCandidateTurn.kind === 'pause_request' ? 0.78 : shouldEscalatePendingThread ? 0.74 : 0.6,
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***repeatedAnswerCount >= 2 || inadequateAnswerCount >= 2) {
    const loopSummary =
      collaborationSummary?.collaborationRecommendedActionHint === 'complete_interview'
        ? '候选人连续多轮重复或低信息量回答，且内部协作已提示没有新增证据，建议房间管理员评估是否直接收束。'
        : collaborationSummary?.collaborationSuggestedTone === 'supportive'
          ? '候选人连续多轮回答仍不充分，内部协作提示应改用更友好的引导式追问。'
          : '候选人连续多轮重复或低信息量回答，建议房间管理员介入纠偏。';
    const loopInstruction =
      collaborationSummary?.collaborationRecommendedActionHint === 'complete_interview'
        ? 'Recent interviewer collaboration notes already say the room is stuck with no new evidence. Ask room-admin whether the interview should close now instead of forcing another retry loop.'
        : collaborationSummary?.collaborationSuggestedTone === 'supportive'
          ? 'Let the same interviewer break the question into smaller steps, use a friendlier guided follow-up, and accept a coursework-scale or junior-scope example if it still answers the active evidence thread.'
          : '让当前面试官缩窄问题范围或换一个更具体的切入口。';
    return {
      action: 'guide_room_admin',
      phaseLabel: resolveRoomKernelPhaseLabel(args.state),
      summary: loopSummary,
      blockers: [
        repeatedAnswerCount >= 2 ? '连续重复回答。' : '',
        inadequateAnswerCount >= 2 ? '连续低信息量回答。' : '',
      ].filter((item): item is string => Boolean(item)),
      recommendedInstruction: loopInstruction,
      shouldEscalateRoomAdmin: true,
      targetSpeakerId: latestQuestion?.authorId ?? '',
      targetPromptMessageId: latestQuestion?.id ?? '',
      confidence: 0.68,
    // Provider-specific function removed;
  // Provider-specific function removed

  return {
    action: 'observe',
    phaseLabel: resolveRoomKernelPhaseLabel(args.state),
    summary: '房间当前仍可自然推进，暂不需要额外介入。',
    blockers: [],
    recommendedInstruction: '',
    shouldEscalateRoomAdmin: false,
    targetSpeakerId: '',
    targetPromptMessageId: '',
    confidence: 0.51,
  // Provider-specific function removed;
// Provider-specific function removed

function createRoomKernelDirective(args: {
  state: Readonly<ChatroomState>;
  turn: RoomKernelTurn;
  round: number;
  runtimeMode: RoomRuntimeMode;
  now: string;
// Provider-specific function removed): NonNullable<ChatroomRoomKernelState['currentDirective']> {
  return {
    schemaVersion: 1,
    directiveId: randomUUID(),
    createdAt: args.now,
    round: args.round,
    transcriptMessageCount: args.state.messages.length,
    runtimeMode: args.runtimeMode,
    action: args.turn.action,
    phaseLabel: args.turn.phaseLabel.trim(),
    summary: args.turn.summary.trim(),
    blockers: args.turn.blockers
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 6),
    recommendedInstruction: args.turn.recommendedInstruction.trim(),
    shouldEscalateRoomAdmin: args.turn.shouldEscalateRoomAdmin,
    targetSpeakerId: args.turn.targetSpeakerId.trim(),
    targetPromptMessageId: args.turn.targetPromptMessageId.trim(),
    confidence: args.turn.confidence,
  // Provider-specific function removed;
// Provider-specific function removed

function resolveRoomKernelPhaseLabel(state: Readonly<ChatroomState>): string {
  return state.roomAdminState?.currentPhaseLabel ??
    state.interviewCurrentPhase ??
    (state.roomBlueprint?.scenarioTemplateId === 'interview_simulation'
      ? 'interview_in_progress'
      : 'room_in_progress');
// Provider-specific function removed

function buildGovernanceAgentRunOptions(args: {
  context: ChatroomAgentContext;
  signal?: AbortSignal;
  timeoutMs?: number;
// Provider-specific function removed) {
  return {
    context: args.context,
    maxTurns: 6,
    signal: args.signal,
    timeoutMs: args.timeoutMs,
    maxStructuredOutputRetries: GOVERNANCE_AGENT_MAX_STRUCTURED_RETRIES,
    policyHooks: [chatroomSummaryPolicyHook],
  // Provider-specific function removed;
// Provider-specific function removed

function createRoomAdminStep(args: {
  id: string;
  round: number;
  roomId?: string;
// Provider-specific function removed): WorkflowStep<ChatroomState, ChatroomAgentContext> {
  return {
    id: args.id,
    kind: 'custom',
    agentIds: [chatroomRoomAdminProfile.id],
    async execute(context) {
      const stateBefore = context.sharedState.readSnapshot();
      const roomBlueprint = stateBefore.state.roomBlueprint;
      const adminConfig = roomBlueprint?.governance.roomAdmin;
      const startedAt = new Date().toISOString();
    ***REMOVED***!adminConfig?.enabled) {
        context.trace.push({
          stepId: args.id,
          kind: 'custom',
          agentIds: [],
          startedAt,
          endedAt: new Date().toISOString(),
          stateVersionBefore: stateBefore.version,
          stateVersionAfter: stateBefore.version,
          inputPreview: 'room admin disabled',
          output: [],
          status: 'completed',
        // Provider-specific function removed);
        return;
      // Provider-specific function removed

      const agentContext = createChatroomContext({
        state: stateBefore.state,
        workflowId: context.workflowId,
        stepId: args.id,
        roomId: args.roomId,
        round: args.round,
        speaker: chatroomRoomAdminProfile,
        transcriptMessages: stateBefore.state.messages,
      // Provider-specific function removed);

      let output;
      let usage: Record<string, unknown> | undefined;
      let guardrails: unknown;
      let telemetry: AgentRunTelemetry | undefined;
      let inputPreview = '';
      const runtimeMode = resolveRoomRuntimeModeFromBlueprint(roomBlueprint);
      const interviewIncidentSnapshot =
        roomBlueprint?.scenarioTemplateId === 'interview_simulation'
          ? buildInterviewRoomAdminIncidentSnapshot({
              messages: stateBefore.state.messages,
              interviewPendingCandidateReply: stateBefore.state.interviewPendingCandidateReply,
              interviewConsecutiveWaitCount: stateBefore.state.interviewConsecutiveWaitCount,
            // Provider-specific function removed)
          : undefined;
      const collaborationSummary =
        roomBlueprint?.scenarioTemplateId === 'interview_simulation'
          ? summarizeInterviewInternalCollaboration({
              messages: stateBefore.state.messages,
              interviewInternalNotes: stateBefore.state.interviewInternalNotes,
              interviewPendingCandidateReply: stateBefore.state.interviewPendingCandidateReply,
            // Provider-specific function removed)
          : undefined;
      const interviewProgressSnapshot =
        roomBlueprint?.scenarioTemplateId === 'interview_simulation'
          ? buildInterviewRoomAdminProgressSnapshot(stateBefore.state)
          : undefined;

    ***REMOVED***
        isInterviewDemoBlueprint(roomBlueprint) &&
        !shouldUseInterviewDemoRoomAdminAgent({
          state: stateBefore.state,
          incidentSnapshot: interviewIncidentSnapshot,
          collaborationSummary,
        // Provider-specific function removed)
    ***REMOVED***
        output = buildChatroomRoomAdminFallback({
          roomBlueprint,
          runtimeMode,
          round: args.round,
          messages: stateBefore.state.messages,
          roomKernelDirective: stateBefore.state.roomKernelState?.currentDirective,
          interviewInternalNotes: stateBefore.state.interviewInternalNotes,
          interviewPendingCandidateReply: stateBefore.state.interviewPendingCandidateReply,
          interviewConsecutiveWaitCount: stateBefore.state.interviewConsecutiveWaitCount,
        // Provider-specific function removed);
        inputPreview = 'heuristic demo room admin moderation';
      // Provider-specific function removed else {
        try {
          const input = buildRoomAdminPrompt({
            roomBlueprint,
            runtimeMode,
            round: args.round,
            transcriptMessageCount: stateBefore.state.messages.length,
            currentPhaseLabel: stateBefore.state.roomAdminState?.currentPhaseLabel,
            currentPhaseObjective: stateBefore.state.roomAdminState?.currentPhaseObjective,
            roomKernelDirective: stateBefore.state.roomKernelState?.currentDirective,
            incidentSnapshot: interviewIncidentSnapshot,
            progressSnapshot: interviewProgressSnapshot,
            collaborationSummary,
          // Provider-specific function removed);
          inputPreview = input;
          const runResult = await context.agentRuntime.runDetailed(
            chatroomRoomAdminProfile,
            input,
            buildGovernanceAgentRunOptions({
              context: agentContext,
              signal: context.signal,
            // Provider-specific function removed),
          );
          output = runResult.output;
          usage = runResult.usage;
          guardrails = runResult.guardrails;
          telemetry = runResult.telemetry;
        // Provider-specific function removed catch {
          output = buildChatroomRoomAdminFallback({
            roomBlueprint,
            runtimeMode,
            round: args.round,
            messages: stateBefore.state.messages,
            roomKernelDirective: stateBefore.state.roomKernelState?.currentDirective,
            interviewInternalNotes: stateBefore.state.interviewInternalNotes,
            interviewPendingCandidateReply: stateBefore.state.interviewPendingCandidateReply,
            interviewConsecutiveWaitCount: stateBefore.state.interviewConsecutiveWaitCount,
          // Provider-specific function removed);
          inputPreview = 'fallback room admin moderation';
        // Provider-specific function removed
      // Provider-specific function removed

      const endedAt = new Date().toISOString();
      const mutation = context.sharedState.mutate((state) => {
        const applied = applyChatroomRoomAdminTurn({
          currentState: state.roomAdminState,
          turn: output,
          adminConfig: state.roomBlueprint?.governance.roomAdmin,
          scenarioTemplateId: state.roomBlueprint?.scenarioTemplateId,
          round: args.round,
          transcriptMessageCount: state.messages.length,
          now: endedAt,
        // Provider-specific function removed);
        state.roomAdminState = applied.roomAdminState;
      ***REMOVED***applied.roomAdminState?.currentPhaseLabel && state.roleplayScene) {
          state.roleplayScene.currentBeat = applied.roomAdminState.currentPhaseLabel;
        // Provider-specific function removed
      ***REMOVED***
          applied.roomAdminState?.currentDirective?.eventMessage &&
          state.roleplayScene
      ***REMOVED***
          state.roleplayScene.latestEvent = applied.roomAdminState.currentDirective.eventMessage;
          state.roleplayScene.activeThreads = [
            applied.roomAdminState.currentDirective.eventLabel ||
              applied.roomAdminState.currentDirective.phaseLabel,
            ...state.roleplayScene.activeThreads,
          ]
            .map((item) => item.trim())
            .filter(Boolean)
            .slice(0, 6);
        // Provider-specific function removed
        applyRoomAdminParticipantAdditions(state, applied.participantAdditions);
      ***REMOVED***applied.visibleMessage) {
          appendChatroomMessage(state, {
            role: 'agent',
            authorId: chatroomRoomAdminProfile.id,
            authorName: resolveRoomAdminDisplayName(state.roomBlueprint),
            round: args.round,
            content: applied.visibleMessage,
          // Provider-specific function removed);
        // Provider-specific function removed
      // Provider-specific function removed, {
        expectedVersion: stateBefore.version,
        label: args.id,
      // Provider-specific function removed);

      context.trace.push({
        stepId: args.id,
        kind: 'custom',
        agentIds: [chatroomRoomAdminProfile.id],
        startedAt,
        endedAt,
        stateVersionBefore: stateBefore.version,
        stateVersionAfter: mutation.version,
        inputPreview,
        output: [{
          profileId: chatroomRoomAdminProfile.id,
          output,
          usage,
          telemetry,
          startedAt,
          endedAt,
          status: 'completed',
        // Provider-specific function removed],
        usage,
        guardrails,
        telemetry,
        status: 'completed',
      // Provider-specific function removed);
    // Provider-specific function removed,
  // Provider-specific function removed;
// Provider-specific function removed

function createHostModerationStep(args: {
  id: string;
  round: number;
  roomId?: string;
  roomType: ChatroomRoomTypeId;
// Provider-specific function removed): WorkflowStep<ChatroomState, ChatroomAgentContext> {
  return {
    id: args.id,
    kind: 'custom',
    agentIds: [chatroomHostModerationProfile.id],
    async execute(context) {
      const stateBefore = context.sharedState.readSnapshot();
      const roomBlueprint = stateBefore.state.roomBlueprint;
      const hostConfig = roomBlueprint?.governance.host;
      const startedAt = new Date().toISOString();
    ***REMOVED***!hostConfig?.enabled) {
        context.trace.push({
          stepId: args.id,
          kind: 'custom',
          agentIds: [],
          startedAt,
          endedAt: new Date().toISOString(),
          stateVersionBefore: stateBefore.version,
          stateVersionAfter: stateBefore.version,
          inputPreview: 'host disabled',
          output: [],
          status: 'completed',
        // Provider-specific function removed);
        return;
      // Provider-specific function removed

      const agentContext = createChatroomContext({
        state: stateBefore.state,
        workflowId: context.workflowId,
        stepId: args.id,
        roomId: args.roomId,
        round: args.round,
        speaker: chatroomHostModerationProfile,
        transcriptMessages: stateBefore.state.messages,
      // Provider-specific function removed);

      let output;
      let usage: Record<string, unknown> | undefined;
      let guardrails: unknown;
      let telemetry: AgentRunTelemetry | undefined;
      let inputPreview = '';

    ***REMOVED***isInterviewDemoBlueprint(roomBlueprint)) {
        output = buildChatroomHostFallback({
          roomBlueprint,
          scenarioTemplateId: roomBlueprint?.scenarioTemplateId,
          round: args.round,
          messages: stateBefore.state.messages,
          currentPhaseLabel: stateBefore.state.roomAdminState?.currentPhaseLabel,
          currentPhaseObjective: stateBefore.state.roomAdminState?.currentPhaseObjective,
        // Provider-specific function removed);
        inputPreview = 'heuristic demo host moderation';
      // Provider-specific function removed else {
        try {
          const input = buildHostModerationPrompt({
            roomBlueprint,
            round: args.round,
            transcriptMessageCount: stateBefore.state.messages.length,
            currentPhaseLabel: stateBefore.state.roomAdminState?.currentPhaseLabel,
            currentPhaseObjective: stateBefore.state.roomAdminState?.currentPhaseObjective,
          // Provider-specific function removed);
          inputPreview = input;
          const runResult = await context.agentRuntime.runDetailed(
            chatroomHostModerationProfile,
            input,
            buildGovernanceAgentRunOptions({
              context: agentContext,
              signal: context.signal,
            // Provider-specific function removed),
          );
          output = runResult.output;
          usage = runResult.usage;
          guardrails = runResult.guardrails;
          telemetry = runResult.telemetry;
        // Provider-specific function removed catch {
          output = buildChatroomHostFallback({
            roomBlueprint,
            scenarioTemplateId: roomBlueprint?.scenarioTemplateId,
            round: args.round,
            messages: stateBefore.state.messages,
            currentPhaseLabel: stateBefore.state.roomAdminState?.currentPhaseLabel,
            currentPhaseObjective: stateBefore.state.roomAdminState?.currentPhaseObjective,
          // Provider-specific function removed);
          inputPreview = 'fallback host moderation';
        // Provider-specific function removed
      // Provider-specific function removed

      const endedAt = new Date().toISOString();
      const mutation = context.sharedState.mutate((state) => {
        const applied = applyChatroomHostModerationTurn({
          currentState: state.hostState,
          turn: output,
          hostConfig: state.roomBlueprint?.governance.host,
          scenarioTemplateId: state.roomBlueprint?.scenarioTemplateId,
          round: args.round,
          transcriptMessageCount: state.messages.length,
          now: endedAt,
        // Provider-specific function removed);
        state.hostState = applied.hostState;
      ***REMOVED***applied.visibleMessage) {
          appendChatroomMessage(state, {
            role: 'agent',
            authorId: chatroomHostModerationProfile.id,
            authorName: resolveRoomHostDisplayName(state.roomBlueprint),
            round: args.round,
            content: applied.visibleMessage,
          // Provider-specific function removed);
        // Provider-specific function removed
      // Provider-specific function removed, {
        expectedVersion: stateBefore.version,
        label: args.id,
      // Provider-specific function removed);

      context.trace.push({
        stepId: args.id,
        kind: 'custom',
        agentIds: [chatroomHostModerationProfile.id],
        startedAt,
        endedAt,
        stateVersionBefore: stateBefore.version,
        stateVersionAfter: mutation.version,
        inputPreview,
        output: [{
          profileId: chatroomHostModerationProfile.id,
          output,
          usage,
          telemetry,
          startedAt,
          endedAt,
          status: 'completed',
        // Provider-specific function removed],
        usage,
        guardrails,
        telemetry,
        status: 'completed',
      // Provider-specific function removed);
    // Provider-specific function removed,
  // Provider-specific function removed;
// Provider-specific function removed

function createInterviewGovernanceParallelStep(args: {
  id: string;
  round: number;
  roomId?: string;
// Provider-specific function removed): WorkflowStep<ChatroomState, ChatroomAgentContext> {
  return {
    id: args.id,
    kind: 'custom',
    agentIds: [chatroomRoomAdminProfile.id, chatroomHostModerationProfile.id],
    async execute(context) {
      const stateBefore = context.sharedState.readSnapshot();
      const roomBlueprint = stateBefore.state.roomBlueprint;
      const adminConfig = roomBlueprint?.governance.roomAdmin;
      const hostConfig = roomBlueprint?.governance.host;
      const startedAt = new Date().toISOString();

    ***REMOVED***!adminConfig?.enabled && !hostConfig?.enabled) {
        context.trace.push({
          stepId: args.id,
          kind: 'custom',
          agentIds: [],
          startedAt,
          endedAt: new Date().toISOString(),
          stateVersionBefore: stateBefore.version,
          stateVersionAfter: stateBefore.version,
          inputPreview: 'interview governance disabled',
          output: [],
          status: 'completed',
        // Provider-specific function removed);
        return;
      // Provider-specific function removed

      const runtimeMode = resolveRoomRuntimeModeFromBlueprint(roomBlueprint);
      const interviewIncidentSnapshot =
        roomBlueprint?.scenarioTemplateId === 'interview_simulation'
          ? buildInterviewRoomAdminIncidentSnapshot({
              messages: stateBefore.state.messages,
              interviewPendingCandidateReply: stateBefore.state.interviewPendingCandidateReply,
              interviewConsecutiveWaitCount: stateBefore.state.interviewConsecutiveWaitCount,
            // Provider-specific function removed)
          : undefined;
      const collaborationSummary =
        roomBlueprint?.scenarioTemplateId === 'interview_simulation'
          ? summarizeInterviewInternalCollaboration({
              messages: stateBefore.state.messages,
              interviewInternalNotes: stateBefore.state.interviewInternalNotes,
              interviewPendingCandidateReply: stateBefore.state.interviewPendingCandidateReply,
            // Provider-specific function removed)
          : undefined;
      const interviewProgressSnapshot =
        roomBlueprint?.scenarioTemplateId === 'interview_simulation'
          ? buildInterviewRoomAdminProgressSnapshot(stateBefore.state)
          : undefined;

      const roomAdminContext = createChatroomContext({
        state: stateBefore.state,
        workflowId: context.workflowId,
        stepId: `${args.id// Provider-specific function removed-room-admin`,
        roomId: args.roomId,
        round: args.round,
        speaker: chatroomRoomAdminProfile,
        transcriptMessages: stateBefore.state.messages,
      // Provider-specific function removed);
      const hostContext = createChatroomContext({
        state: stateBefore.state,
        workflowId: context.workflowId,
        stepId: `${args.id// Provider-specific function removed-host`,
        roomId: args.roomId,
        round: args.round,
        speaker: chatroomHostModerationProfile,
        transcriptMessages: stateBefore.state.messages,
      // Provider-specific function removed);

      const roomAdminTask = (async () => {
        let output;
        let usage: Record<string, unknown> | undefined;
        let telemetry: AgentRunTelemetry | undefined;
        let inputPreview = '';
        const branchStartedAt = new Date().toISOString();

      ***REMOVED***!adminConfig?.enabled) {
          return {
            enabled: false,
            output: undefined,
            usage,
            telemetry,
            inputPreview: 'room admin disabled',
            startedAt: branchStartedAt,
            endedAt: new Date().toISOString(),
          // Provider-specific function removed;
        // Provider-specific function removed

      ***REMOVED***
          isInterviewDemoBlueprint(roomBlueprint) &&
          !shouldUseInterviewDemoRoomAdminAgent({
            state: stateBefore.state,
            incidentSnapshot: interviewIncidentSnapshot,
            collaborationSummary,
          // Provider-specific function removed)
      ***REMOVED***
          output = buildChatroomRoomAdminFallback({
            roomBlueprint,
            runtimeMode,
            round: args.round,
            messages: stateBefore.state.messages,
            roomKernelDirective: stateBefore.state.roomKernelState?.currentDirective,
            interviewInternalNotes: stateBefore.state.interviewInternalNotes,
            interviewPendingCandidateReply: stateBefore.state.interviewPendingCandidateReply,
            interviewConsecutiveWaitCount: stateBefore.state.interviewConsecutiveWaitCount,
          // Provider-specific function removed);
          inputPreview = 'heuristic demo room admin moderation';
        // Provider-specific function removed else {
          try {
            const input = buildRoomAdminPrompt({
              roomBlueprint,
              runtimeMode,
              round: args.round,
              transcriptMessageCount: stateBefore.state.messages.length,
              currentPhaseLabel: stateBefore.state.roomAdminState?.currentPhaseLabel,
              currentPhaseObjective: stateBefore.state.roomAdminState?.currentPhaseObjective,
              roomKernelDirective: stateBefore.state.roomKernelState?.currentDirective,
              incidentSnapshot: interviewIncidentSnapshot,
              progressSnapshot: interviewProgressSnapshot,
              collaborationSummary,
            // Provider-specific function removed);
            inputPreview = input;
            const runResult = await context.agentRuntime.runDetailed(
              chatroomRoomAdminProfile,
              input,
              buildGovernanceAgentRunOptions({
                context: roomAdminContext,
                signal: context.signal,
              // Provider-specific function removed),
            );
            output = runResult.output;
            usage = runResult.usage;
            telemetry = runResult.telemetry;
          // Provider-specific function removed catch {
            output = buildChatroomRoomAdminFallback({
              roomBlueprint,
              runtimeMode,
              round: args.round,
              messages: stateBefore.state.messages,
              roomKernelDirective: stateBefore.state.roomKernelState?.currentDirective,
              interviewInternalNotes: stateBefore.state.interviewInternalNotes,
              interviewPendingCandidateReply: stateBefore.state.interviewPendingCandidateReply,
              interviewConsecutiveWaitCount: stateBefore.state.interviewConsecutiveWaitCount,
            // Provider-specific function removed);
            inputPreview = 'fallback room admin moderation';
          // Provider-specific function removed
        // Provider-specific function removed

        return {
          enabled: true,
          output,
          usage,
          telemetry,
          inputPreview,
          startedAt: branchStartedAt,
          endedAt: new Date().toISOString(),
        // Provider-specific function removed;
      // Provider-specific function removed)();

      const hostTask = (async () => {
        let output;
        let usage: Record<string, unknown> | undefined;
        let telemetry: AgentRunTelemetry | undefined;
        let inputPreview = '';
        const branchStartedAt = new Date().toISOString();

      ***REMOVED***!hostConfig?.enabled) {
          return {
            enabled: false,
            output: undefined,
            usage,
            telemetry,
            inputPreview: 'host disabled',
            startedAt: branchStartedAt,
            endedAt: new Date().toISOString(),
          // Provider-specific function removed;
        // Provider-specific function removed

      ***REMOVED***isInterviewDemoBlueprint(roomBlueprint)) {
          output = buildChatroomHostFallback({
            roomBlueprint,
            scenarioTemplateId: roomBlueprint?.scenarioTemplateId,
            round: args.round,
            messages: stateBefore.state.messages,
            currentPhaseLabel: stateBefore.state.roomAdminState?.currentPhaseLabel,
            currentPhaseObjective: stateBefore.state.roomAdminState?.currentPhaseObjective,
          // Provider-specific function removed);
          inputPreview = 'heuristic demo host moderation';
        // Provider-specific function removed else {
          try {
            const input = buildHostModerationPrompt({
              roomBlueprint,
              round: args.round,
              transcriptMessageCount: stateBefore.state.messages.length,
              currentPhaseLabel: stateBefore.state.roomAdminState?.currentPhaseLabel,
              currentPhaseObjective: stateBefore.state.roomAdminState?.currentPhaseObjective,
            // Provider-specific function removed);
            inputPreview = input;
            const runResult = await context.agentRuntime.runDetailed(
              chatroomHostModerationProfile,
              input,
              buildGovernanceAgentRunOptions({
                context: hostContext,
                signal: context.signal,
              // Provider-specific function removed),
            );
            output = runResult.output;
            usage = runResult.usage;
            telemetry = runResult.telemetry;
          // Provider-specific function removed catch {
            output = buildChatroomHostFallback({
              roomBlueprint,
              scenarioTemplateId: roomBlueprint?.scenarioTemplateId,
              round: args.round,
              messages: stateBefore.state.messages,
              currentPhaseLabel: stateBefore.state.roomAdminState?.currentPhaseLabel,
              currentPhaseObjective: stateBefore.state.roomAdminState?.currentPhaseObjective,
            // Provider-specific function removed);
            inputPreview = 'fallback host moderation';
          // Provider-specific function removed
        // Provider-specific function removed

        return {
          enabled: true,
          output,
          usage,
          telemetry,
          inputPreview,
          startedAt: branchStartedAt,
          endedAt: new Date().toISOString(),
        // Provider-specific function removed;
      // Provider-specific function removed)();

      const [roomAdminResult, hostResult] = await Promise.all([roomAdminTask, hostTask]);
      const endedAt = new Date().toISOString();
      const mutation = context.sharedState.mutate((state) => {
      ***REMOVED***roomAdminResult.enabled && roomAdminResult.output) {
          const appliedRoomAdmin = applyChatroomRoomAdminTurn({
            currentState: state.roomAdminState,
            turn: roomAdminResult.output,
            adminConfig: state.roomBlueprint?.governance.roomAdmin,
            scenarioTemplateId: state.roomBlueprint?.scenarioTemplateId,
            round: args.round,
            transcriptMessageCount: state.messages.length,
            now: roomAdminResult.endedAt,
          // Provider-specific function removed);
          state.roomAdminState = appliedRoomAdmin.roomAdminState;
        ***REMOVED***appliedRoomAdmin.roomAdminState?.currentPhaseLabel && state.roleplayScene) {
            state.roleplayScene.currentBeat = appliedRoomAdmin.roomAdminState.currentPhaseLabel;
          // Provider-specific function removed
        ***REMOVED***
            appliedRoomAdmin.roomAdminState?.currentDirective?.eventMessage &&
            state.roleplayScene
        ***REMOVED***
            state.roleplayScene.latestEvent =
              appliedRoomAdmin.roomAdminState.currentDirective.eventMessage;
            state.roleplayScene.activeThreads = [
              appliedRoomAdmin.roomAdminState.currentDirective.eventLabel ||
                appliedRoomAdmin.roomAdminState.currentDirective.phaseLabel,
              ...state.roleplayScene.activeThreads,
            ]
              .map((item) => item.trim())
              .filter(Boolean)
              .slice(0, 6);
          // Provider-specific function removed
          applyRoomAdminParticipantAdditions(state, appliedRoomAdmin.participantAdditions);
        ***REMOVED***appliedRoomAdmin.visibleMessage) {
            appendChatroomMessage(state, {
              role: 'agent',
              authorId: chatroomRoomAdminProfile.id,
              authorName: resolveRoomAdminDisplayName(state.roomBlueprint),
              round: args.round,
              content: appliedRoomAdmin.visibleMessage,
            // Provider-specific function removed);
          // Provider-specific function removed
        // Provider-specific function removed

      ***REMOVED***hostResult.enabled && hostResult.output) {
          const appliedHost = applyChatroomHostModerationTurn({
            currentState: state.hostState,
            turn: hostResult.output,
            hostConfig: state.roomBlueprint?.governance.host,
            scenarioTemplateId: state.roomBlueprint?.scenarioTemplateId,
            round: args.round,
            transcriptMessageCount: state.messages.length,
            now: hostResult.endedAt,
          // Provider-specific function removed);
          state.hostState = appliedHost.hostState;
        ***REMOVED***appliedHost.visibleMessage) {
            appendChatroomMessage(state, {
              role: 'agent',
              authorId: chatroomHostModerationProfile.id,
              authorName: resolveRoomHostDisplayName(state.roomBlueprint),
              round: args.round,
              content: appliedHost.visibleMessage,
            // Provider-specific function removed);
          // Provider-specific function removed
        // Provider-specific function removed
      // Provider-specific function removed, {
        expectedVersion: stateBefore.version,
        label: args.id,
      // Provider-specific function removed);

      context.trace.push({
        stepId: args.id,
        kind: 'custom',
        agentIds: [chatroomRoomAdminProfile.id, chatroomHostModerationProfile.id],
        startedAt,
        endedAt,
        stateVersionBefore: stateBefore.version,
        stateVersionAfter: mutation.version,
        inputPreview: [
          roomAdminResult.enabled ? `room-admin: ${roomAdminResult.inputPreview// Provider-specific function removed` : undefined,
          hostResult.enabled ? `host: ${hostResult.inputPreview// Provider-specific function removed` : undefined,
        ]
          .filter((item): item is string => Boolean(item))
          .join('\n\n'),
        output: [
          ...(roomAdminResult.enabled && roomAdminResult.output !== undefined
            ? [{
                profileId: chatroomRoomAdminProfile.id,
                output: roomAdminResult.output,
                usage: roomAdminResult.usage,
                telemetry: roomAdminResult.telemetry,
                startedAt: roomAdminResult.startedAt,
                endedAt: roomAdminResult.endedAt,
                status: 'completed' as const,
              // Provider-specific function removed]
            : []),
          ...(hostResult.enabled && hostResult.output !== undefined
            ? [{
                profileId: chatroomHostModerationProfile.id,
                output: hostResult.output,
                usage: hostResult.usage,
                telemetry: hostResult.telemetry,
                startedAt: hostResult.startedAt,
                endedAt: hostResult.endedAt,
                status: 'completed' as const,
              // Provider-specific function removed]
            : []),
        ],
        status: 'completed',
      // Provider-specific function removed);
    // Provider-specific function removed,
  // Provider-specific function removed;
// Provider-specific function removed

export function applyRoomAdminParticipantAdditions(
  state: ChatroomState,
  additions: ReadonlyArray<{ name: string; instruction: string // Provider-specific function removed>,
): void {
***REMOVED***additions.length === 0 || !state.roomBlueprint) {
    return;
  // Provider-specific function removed

  const participantMode = resolveParticipantAdditionMode(
    state.roomBlueprint.scenarioTemplateId,
  );
***REMOVED***!participantMode) {
    console.warn(
      `[chatroom] Ignored room-admin participant additions for scenario "${state.roomBlueprint.scenarioTemplateId// Provider-specific function removed".`,
    );
    return;
  // Provider-specific function removed

  const existing = state.customCharacters
    ? [...state.customCharacters]
    : state.roomBlueprint.customCharacters
      ? structuredClone(state.roomBlueprint.customCharacters)
      : [];
  const existingNames = new Set(existing.map((item) => item.name.trim().toLowerCase()));
  const speakerIds = [...state.speakerIds];
  const newSpeakerIds: string[] = [];
  let changed = false;

  for (const addition of additions) {
    const name = addition.name.trim();
  ***REMOVED***!name || existingNames.has(name.toLowerCase())) {
      continue;
    // Provider-specific function removed
    existing.push({
      name,
      instruction: addition.instruction.trim(),
    // Provider-specific function removed);
    const speakerId =
      participantMode === 'roleplay'
        ? `custom-rp-${existing.length - 1// Provider-specific function removed`
        : participantMode === 'interview'
          ? `interviewer-${existing.length - 1// Provider-specific function removed`
          : `custom-room-${existing.length - 1// Provider-specific function removed`;
  ***REMOVED***!speakerIds.includes(speakerId)) {
      speakerIds.push(speakerId);
      newSpeakerIds.push(speakerId);
    // Provider-specific function removed
    existingNames.add(name.toLowerCase());
    changed = true;
  // Provider-specific function removed

***REMOVED***!changed) {
    return;
  // Provider-specific function removed

  const customTemplates = createCustomRoleplayTemplates(existing);
  state.customCharacters = existing;
  state.customRoleplayTemplates = customTemplates;
  state.speakerIds = speakerIds;
  state.roomBlueprint.customCharacters = structuredClone(existing);
  state.roomBlueprint.speakerIds = [...speakerIds];

  const existingSpeakerIds = new Set(
    state.roomBlueprint.participantSlots
      .filter((slot) => slot.participantType === 'agent' && slot.speakerId)
      .map((slot) => slot.speakerId!),
  );
  for (const speakerId of newSpeakerIds) {
    const prefix =
      participantMode === 'roleplay'
        ? 'custom-rp-'
        : participantMode === 'interview'
          ? 'interviewer-'
          : 'custom-room-';
    const customIndex = Number.parseInt(speakerId.replace(prefix, ''), 10);
  ***REMOVED***existingSpeakerIds.has(speakerId)) {
      continue;
    // Provider-specific function removed

    state.roomBlueprint.participantSlots.push({
      slotId: buildAddedParticipantSlotId(state.roomBlueprint.scenarioTemplateId, customIndex),
      label: existing[customIndex]!.name,
      description: existing[customIndex]!.instruction || buildAddedParticipantDescription(participantMode),
      participantType: 'agent',
      occupancy: 'required',
      speakerId,
      profileId: speakerId,
      metadata: {
        role:
          participantMode === 'roleplay'
            ? 'cast_member'
            : participantMode === 'interview'
              ? 'interviewer'
              : 'guest_participant',
        custom: true,
      // Provider-specific function removed,
    // Provider-specific function removed);
  // Provider-specific function removed

***REMOVED***participantMode === 'roleplay') {
    state.roleplayScene = rebuildRoleplaySceneState({
      topic: state.roomBlueprint.topic,
      objective: state.roomBlueprint.objective,
      constraints: state.roomBlueprint.constraints,
      speakerIds,
      messages: state.messages,
      customTemplates,
    // Provider-specific function removed);
  // Provider-specific function removed
// Provider-specific function removed

function resolveParticipantAdditionMode(
  scenarioTemplateId: ChatroomRoomBlueprint['scenarioTemplateId'] | undefined,
): 'roleplay' | 'discussion' | 'interview' | undefined {
  switch (scenarioTemplateId) {
    case 'roleplay_scene':
    case 'murder_mystery':
      return 'roleplay';
    case 'expert_discussion':
    case 'brainstorm_workshop':
    case 'project_development_discussion':
    case 'report_seminar':
      return 'discussion';
    case 'interview_simulation':
      return 'interview';
    default:
      return undefined;
  // Provider-specific function removed
// Provider-specific function removed

function buildAddedParticipantSlotId(
  scenarioTemplateId: ChatroomRoomBlueprint['scenarioTemplateId'],
  customIndex: number,
): string {
  switch (scenarioTemplateId) {
    case 'murder_mystery':
      return `mystery-cast-${customIndex + 1// Provider-specific function removed`;
    case 'roleplay_scene':
      return `roleplay-cast-${customIndex + 1// Provider-specific function removed`;
    case 'interview_simulation':
      return `interviewer-${customIndex + 1// Provider-specific function removed`;
    case 'brainstorm_workshop':
      return `brainstorm-guest-${customIndex + 1// Provider-specific function removed`;
    case 'project_development_discussion':
      return `project-guest-${customIndex + 1// Provider-specific function removed`;
    case 'report_seminar':
      return `seminar-guest-${customIndex + 1// Provider-specific function removed`;
    case 'expert_discussion':
    default:
      return `discussion-guest-${customIndex + 1// Provider-specific function removed`;
  // Provider-specific function removed
// Provider-specific function removed

function buildAddedParticipantDescription(
  participantMode: 'roleplay' | 'discussion' | 'interview',
): string {
  switch (participantMode) {
    case 'roleplay':
      return 'Roleplay cast member.';
    case 'interview':
      return 'Interviewer agent.';
    case 'discussion':
      return 'Additional discussion participant.';
  // Provider-specific function removed
// Provider-specific function removed

function resolveRoomAdminDisplayName(
  roomBlueprint: Readonly<ChatroomRoomBlueprint> | undefined,
): string {
  return roomBlueprint?.participantSlots.find(
    (slot) =>
      slot.participantType === 'agent' &&
      (slot.metadata?.role === 'game_master' || slot.metadata?.role === 'moderator'),
  )?.label ?? '房间管理员';
// Provider-specific function removed

function resolveRoomHostDisplayName(
  roomBlueprint: Readonly<ChatroomRoomBlueprint> | undefined,
): string {
  return roomBlueprint?.participantSlots.find(
    (slot) =>
      slot.participantType === 'agent' &&
      (slot.metadata?.role === 'host' || slot.metadata?.role === 'moderator'),
  )?.label ?? '房间主持';
// Provider-specific function removed

function normalizeInterviewTurnPlan(
  state: Readonly<ChatroomState>,
  plannerOutput: InterviewTurnPlan,
  fallbackPlan: ResolvedInterviewTurnPlan,
): ResolvedInterviewTurnPlan {
  const candidateReplyCount = countInterviewCandidateReplies(state.messages);
  const latestCandidateTurn = getLatestInterviewCandidateTurnState(state.messages);
  const stageCounts = collectInterviewStageCounts(state.messages);
  const interviewSummary = getInterviewSummaryFromState(state);
  const track = resolveInterviewTrack(state);
  const latestAnswerCoverage = assessLatestInterviewCandidateAnswerCoverage(state.messages);

***REMOVED***plannerOutput.nextAction === 'finish') {
  ***REMOVED***
      (latestAnswerCoverage && !latestAnswerCoverage.isAdequate) ||
      !canPlannerFinishInterview({
        roomBlueprint: state.roomBlueprint,
        candidateReplyCount,
        stageCounts,
        interviewSummary,
      // Provider-specific function removed)
  ***REMOVED***
      return fallbackPlan;
    // Provider-specific function removed

    return {
      kind: 'complete',
      reason: plannerOutput.handoffReason || plannerOutput.stageObjective || 'The interview has enough signal to close.',
      terminalStatus: 'complete',
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***plannerOutput.nextAction === 'wait') {
    return {
      kind: 'wait',
      reason: plannerOutput.handoffReason || plannerOutput.stageObjective || fallbackPlan.reason,
    // Provider-specific function removed;
  // Provider-specific function removed

  const speakerRole = plannerOutput.speakerRole;
***REMOVED***!speakerRole) {
    return fallbackPlan;
  // Provider-specific function removed

  const roleToFallbackIndex: Record<
    NonNullable<InterviewTurnPlan['speakerRole']>,
    number
  > = {
    hr_interviewer: 0,
    technical_interviewer: 1,
    manager_interviewer: 2,
    panel_observer: 3,
  // Provider-specific function removed;
  const roleToPhase: Record<
    NonNullable<InterviewTurnPlan['speakerRole']>,
    Extract<ResolvedInterviewTurnPlan, { kind: 'ask' // Provider-specific function removed>['phase']
  > = {
    hr_interviewer:
      plannerOutput.currentStage === 'opening'
        ? 'opening'
        : plannerOutput.currentStage === 'hr_followup'
          ? 'hr_followup'
          : 'hr_wrap_up',
    technical_interviewer: 'technical_deep_dive',
    manager_interviewer: 'manager_round',
    panel_observer: 'observer_followup',
  // Provider-specific function removed;
  const normalizedPlan: ResolvedInterviewTurnPlan = {
    kind: 'ask',
    phase: roleToPhase[speakerRole],
    stageLabel: normalizeInterviewPlannerStageLabel({
      track,
      phase: roleToPhase[speakerRole],
      currentStageLabel: plannerOutput.currentStageLabel,
    // Provider-specific function removed),
    speakerId: (
      resolveInterviewSpeakerId(
        state.roomBlueprint,
        speakerRole,
        roleToFallbackIndex[speakerRole],
      ) ??
      (fallbackPlan.kind === 'ask'
        ? fallbackPlan.speakerId
        : state.speakerIds[roleToFallbackIndex[speakerRole]] ?? 'interview-technical')
    ),
    focus: plannerOutput.questionGoal || plannerOutput.stageObjective,
    reason: plannerOutput.handoffReason || plannerOutput.stageObjective,
    responseMode:
      plannerOutput.responseMode === 'clarify' &&
      (latestCandidateTurn.kind === 'clarify_request' ||
        latestCandidateTurn.kind === 'repeat_request')
        ? 'clarify'
        : 'new_question',
  // Provider-specific function removed;

***REMOVED***
    (latestAnswerCoverage && !latestAnswerCoverage.isAdequate) ||
    !isPlannerAskActionAllowed({
      plan: normalizedPlan,
      roomBlueprint: state.roomBlueprint,
      candidateReplyCount,
      stageCounts,
      interviewSummary,
    // Provider-specific function removed)
***REMOVED***
    return fallbackPlan;
  // Provider-specific function removed

  return normalizedPlan;
// Provider-specific function removed

function resolveInterviewSpeakerId(
  roomBlueprint: Readonly<ChatroomRoomBlueprint> | undefined,
  role: string,
  fallbackIndex: number,
): string | undefined {
  return (
    roomBlueprint?.participantSlots.find(
      (slot) => slot.participantType === 'agent' && slot.metadata?.role === role,
    )?.speakerId ??
    roomBlueprint?.speakerIds[fallbackIndex]
  );
// Provider-specific function removed

type InterviewTrack =
  | 'backend'
  | 'frontend'
  | 'algorithm'
  | 'product'
  | 'general';

const MIN_TECHNICAL_INTERVIEW_ROUNDS = 3;
const MAX_TECHNICAL_INTERVIEW_ROUNDS = 5;
const MAX_MANAGER_INTERVIEW_ROUNDS = 2;

const TECHNICAL_INTERVIEW_KEYWORDS = [
  'technical',
  'architecture',
  'system',
  'performance',
  'database',
  'consistency',
  'concurrency',
  'failure',
  'debug',
  'engineering',
  '技术',
  '架构',
  '系统',
  '性能',
  '数据库',
  '一致性',
  '并发',
  '故障',
  '排障',
  '工程',
  'tradeoff',
];

const HR_INTERVIEW_KEYWORDS = [
  'motivation',
  'resume',
  'fit',
  'communication',
  'career',
  'why join',
  '动机',
  '履历',
  '匹配',
  '沟通',
  '求职',
];

const MANAGER_INTERVIEW_KEYWORDS = [
  'ownership',
  'priority',
  'collaboration',
  'decision',
  'business',
  'risk',
  '管理',
  '优先级',
  '协作',
  '推动',
  '业务',
  '风险',
];

const OBSERVER_INTERVIEW_KEYWORDS = [
  'metric',
  'evidence',
  'boundary',
  'blind spot',
  'conflict',
  'detail',
  '量化',
  '指标',
  '边界',
  '盲区',
  '矛盾',
  '细节',
  '追问',
];

function resolveInterviewTrack(state: Readonly<ChatroomState>): InterviewTrack {
  const scenario = getScenarioMetadata(state);
  const targetRole = asOptionalString(scenario?.targetRole);
  const focusAreas = resolveInterviewFocusAreas(state);
  return classifyInterviewTrack(targetRole, focusAreas);
// Provider-specific function removed

function classifyInterviewTrack(
  targetRole: string | undefined,
  focusAreas: readonly string[],
): InterviewTrack {
  const roleText = `${targetRole ?? ''// Provider-specific function removed\n${focusAreas.join('\n')// Provider-specific function removed`.toLowerCase();

***REMOVED***matchesInterviewTrack(roleText, [
    'product manager',
    'product owner',
    'pm',
    '产品经理',
    '增长产品',
  ])) {
    return 'product';
  // Provider-specific function removed

***REMOVED***matchesInterviewTrack(roleText, [
    'frontend',
    'front-end',
    'react',
    'vue',
    'web',
    '前端',
    'h5',
  ])) {
    return 'frontend';
  // Provider-specific function removed

***REMOVED***matchesInterviewTrack(roleText, [
    'algorithm',
    'machine learning',
    'ml',
    'ranking',
    'recommendation',
    '算法',
    '推荐',
    '搜索',
    '模型',
  ])) {
    return 'algorithm';
  // Provider-specific function removed

***REMOVED***matchesInterviewTrack(roleText, [
    'backend',
    'server',
    'platform',
    'infra',
    'java',
    'golang',
    'go',
    'python',
    '后端',
    '服务端',
    '数据库',
    '架构',
  ])) {
    return 'backend';
  // Provider-specific function removed

  return 'general';
// Provider-specific function removed

function matchesInterviewTrack(haystack: string, keywords: readonly string[]***REMOVED***
  return keywords.some((keyword) => haystack.includes(keyword.toLowerCase()));
// Provider-specific function removed

function resolveInterviewTrackLabel(track: InterviewTrack): string {
  switch (track) {
    case 'backend':
      return 'backend engineering';
    case 'frontend':
      return 'frontend engineering';
    case 'algorithm':
      return 'algorithm / ML';
    case 'product':
      return 'product management';
    default:
      return 'general role';
  // Provider-specific function removed
// Provider-specific function removed

function buildInterviewTrackPlannerGuidance(track: InterviewTrack): string {
  switch (track) {
    case 'backend':
      return 'Focus on architecture, data consistency, failures, observability, and engineering quality.';
    case 'frontend':
      return 'Focus on rendering performance, state management, UX tradeoffs, compatibility, and frontend engineering.';
    case 'algorithm':
      return 'Focus on problem framing, data and features, metrics, experiments, and online/offline tradeoffs.';
    case 'product':
      return 'Focus on user problem definition, prioritization, metrics, validation, and cross-functional delivery.';
    default:
      return 'Focus on domain depth, problem solving, tradeoffs, collaboration, and outcome ownership.';
  // Provider-specific function removed
// Provider-specific function removed

function resolveInterviewStageLabel(
  phase: Extract<ResolvedInterviewTurnPlan, { kind: 'ask' // Provider-specific function removed>['phase'],
  track: InterviewTrack,
): string {
  switch (phase) {
    case 'opening':
      return 'opening self-introduction';
    case 'hr_followup':
      return 'HR follow-up';
    case 'technical_deep_dive':
      switch (track) {
        case 'frontend':
          return 'frontend deep dive';
        case 'algorithm':
          return 'algorithm deep dive';
        case 'product':
          return 'product case deep dive';
        case 'backend':
          return 'technical deep dive';
        default:
          return 'domain deep dive';
      // Provider-specific function removed
    case 'observer_followup':
      return 'observer follow-up';
    case 'manager_round':
      switch (track) {
        case 'product':
          return 'business / manager round';
        case 'backend':
        case 'frontend':
        case 'algorithm':
          return 'manager round';
        default:
          return 'comprehensive follow-up';
      // Provider-specific function removed
    case 'hr_wrap_up':
      return 'HR wrap-up';
    default:
      return 'interview stage';
  // Provider-specific function removed
// Provider-specific function removed

function normalizeInterviewPlannerStageLabel(args: {
  track: InterviewTrack;
  phase: Extract<ResolvedInterviewTurnPlan, { kind: 'ask' // Provider-specific function removed>['phase'];
  currentStageLabel: string;
// Provider-specific function removed): string {
  const trimmed = args.currentStageLabel.trim();
***REMOVED***!trimmed) {
    return resolveInterviewStageLabel(args.phase, args.track);
  // Provider-specific function removed

***REMOVED***
    args.phase === 'technical_deep_dive' &&
    (args.track === 'frontend' || args.track === 'algorithm' || args.track === 'product')
***REMOVED***
    return resolveInterviewStageLabel(args.phase, args.track);
  // Provider-specific function removed

  return trimmed;
// Provider-specific function removed

function resolveInterviewTrackTechnicalFocus(
  track: InterviewTrack,
  technicalRounds: number,
): string {
***REMOVED***technicalRounds === 0) {
    switch (track) {
      case 'backend':
        return 'Ask about architecture, data flow, consistency, reliability, or a concrete failure case from the candidate project.';
      case 'frontend':
        return 'Ask about a real UI flow, performance, state, compatibility, or frontend engineering decisions from the candidate project.';
      case 'algorithm':
        return 'Ask about modeling, features, data, metrics, experiments, or online serving decisions from the candidate project.';
      case 'product':
        return 'Ask about the user problem, product framing, prioritization, metrics, and execution choices from a real product case.';
      default:
        return 'Ask one concrete domain question based on the candidate project instead of a broad checklist.';
    // Provider-specific function removed
  // Provider-specific function removed

  switch (track) {
    case 'backend':
      return 'Continue on tradeoffs, consistency, failure handling, observability, rollback, and engineering governance details.';
    case 'frontend':
      return 'Continue on performance, state consistency, error handling, testing, compatibility, and UX tradeoffs.';
    case 'algorithm':
      return 'Continue on sample construction, metrics interpretation, experiments, online results, and cost-latency tradeoffs.';
    case 'product':
      return 'Continue on prioritization, metrics loops, validation method, failure retrospectives, and product-delivery collaboration.';
    default:
      return 'Continue on implementation detail, tradeoffs, failure cases, and retrospective depth.';
  // Provider-specific function removed
// Provider-specific function removed

function resolveInterviewTrackObserverFocus(track: InterviewTrack): string {
  switch (track) {
    case 'backend':
      return 'Close the sharpest backend evidence gap around consistency, boundaries, failure recovery, or measurable results.';
    case 'frontend':
      return 'Close the sharpest frontend evidence gap around metrics, compatibility, observability, UX impact, or error handling.';
    case 'algorithm':
      return 'Close the sharpest algorithm evidence gap around data quality, metric meaning, experiment design, or online risk.';
    case 'product':
      return 'Close the sharpest product evidence gap around user value, metric definition, validation method, or cross-team execution.';
    default:
      return 'Close the sharpest remaining evidence gap with one precise follow-up question.';
  // Provider-specific function removed
// Provider-specific function removed

function resolveInterviewTrackManagerFocus(
  track: InterviewTrack,
  managerRounds: number,
): string {
***REMOVED***managerRounds === 0) {
    switch (track) {
      case 'backend':
        return 'Shift to ownership, prioritization of stability work, cross-team alignment, and business-risk judgment.';
      case 'frontend':
        return 'Shift to experience vs delivery tradeoffs, cross-team alignment, and influence without authority.';
      case 'algorithm':
        return 'Shift to effect-vs-cost tradeoffs, experiment risk control, and product-business alignment.';
      case 'product':
        return 'Shift to roadmap tradeoffs, resource negotiation, KPI ownership, and stakeholder management.';
      default:
        return 'Shift to learning agility, collaboration, ownership, prioritization, and real-world judgment without assuming formal management experience.';
    // Provider-specific function removed
  // Provider-specific function removed

    switch (track) {
      case 'backend':
        return 'Probe real manager-round situations such as incident prioritization, cross-team friction, and long-term vs short-term tradeoffs.';
      case 'frontend':
        return 'Probe real manager-round situations such as UX goals vs deadlines, alignment friction, and governance investment choices.';
      case 'algorithm':
        return 'Probe real manager-round situations such as effect vs latency/cost conflicts, failed experiments, and stakeholder pressure.';
      case 'product':
        return 'Probe real manager-round situations such as resource allocation conflicts, KPI accountability, and delivery blockers.';
      default:
        return 'Probe concrete situations around collaboration, prioritization, learning under pressure, tradeoff judgment, and growth potential.';
    // Provider-specific function removed
  // Provider-specific function removed

function buildInterviewSummarySignals(summary: InterviewSummary | undefined): string[] {
***REMOVED***!summary) {
  ***REMOVED***];
  // Provider-specific function removed

  const signals = [
    ...summary.missedQuestions,
    ...summary.followUpQuestions,
    ...summary.weaknesses,
    ...summary.suggestedAnswerImprovements,
    ...summary.competencyScores.flatMap((item) => item.risks),
  ]
    .map((item) => item.trim())
    .filter(Boolean);

  return dedupeStrings(signals).slice(0, 4);
// Provider-specific function removed

function buildInterviewFocusFromSummary(
  summary: InterviewSummary | undefined,
  keywords: readonly string[],
  fallbackFocus: string,
): string {
  const matchedSignal = pickInterviewSignal(summary, keywords);
  return matchedSignal
    ? `Continue around this unresolved point: ${matchedSignal// Provider-specific function removed`
    : fallbackFocus;
// Provider-specific function removed

function pickInterviewSignal(
  summary: InterviewSummary | undefined,
  keywords: readonly string[],
): string | undefined {
***REMOVED***!summary) {
    return undefined;
  // Provider-specific function removed

  const candidates = [
    ...summary.followUpQuestions,
    ...summary.missedQuestions,
    ...summary.weaknesses,
    ...summary.suggestedAnswerImprovements,
    ...summary.competencyScores.flatMap((item) => item.risks),
  ];
  const keywordSet = keywords.map((item) => item.toLowerCase());

  for (const candidate of candidates) {
    const normalized = candidate.toLowerCase();
  ***REMOVED***keywordSet.some((keyword) => normalized.includes(keyword))) {
      return candidate.trim();
    // Provider-specific function removed
  // Provider-specific function removed

  return undefined;
// Provider-specific function removed

function shouldAskHrFollowup(args: {
  roomBlueprint: Readonly<ChatroomRoomBlueprint> | undefined;
  candidateReplyCount: number;
  stageCounts: InterviewStageCounts;
  interviewSummary: InterviewSummary | undefined;
// Provider-specific function removed***REMOVED***
***REMOVED***isInterviewDemoBlueprint(args.roomBlueprint)) {
  ***REMOVED***
      args.candidateReplyCount !== 1 ||
      args.stageCounts.hr >= 2 ||
      args.stageCounts.technical > 0
  ***REMOVED***
      return false;
    // Provider-specific function removed

  ***REMOVED***!args.interviewSummary) {
      return true;
    // Provider-specific function removed

    return summaryMatchesKeywords(args.interviewSummary, HR_INTERVIEW_KEYWORDS) ||
      args.interviewSummary.interviewReadiness === 'insufficient_signal';
  // Provider-specific function removed

  return args.candidateReplyCount === 1 &&
    args.stageCounts.hr < 2 &&
    args.stageCounts.technical === 0 &&
    summaryMatchesKeywords(args.interviewSummary, HR_INTERVIEW_KEYWORDS);
// Provider-specific function removed

function shouldContinueTechnicalDeepDive(args: {
  roomBlueprint: Readonly<ChatroomRoomBlueprint> | undefined;
  candidateReplyCount: number;
  stageCounts: InterviewStageCounts;
  interviewSummary: InterviewSummary | undefined;
// Provider-specific function removed***REMOVED***
  const isInterviewDemo = isInterviewDemoBlueprint(args.roomBlueprint);
  const minTechnicalRounds = isInterviewDemo ? 1 : MIN_TECHNICAL_INTERVIEW_ROUNDS;
  const maxTechnicalRounds = isInterviewDemo ? 4 : MAX_TECHNICAL_INTERVIEW_ROUNDS;

***REMOVED***args.stageCounts.technical < minTechnicalRounds) {
    return true;
  // Provider-specific function removed

***REMOVED***args.stageCounts.technical >= maxTechnicalRounds) {
    return false;
  // Provider-specific function removed

***REMOVED***
    isInterviewDemo &&
    args.interviewSummary?.interviewReadiness === 'strong' &&
    args.stageCounts.technical >= 2 &&
    !summaryMatchesKeywords(args.interviewSummary, TECHNICAL_INTERVIEW_KEYWORDS)
***REMOVED***
    return false;
  // Provider-specific function removed

***REMOVED***
    args.stageCounts.manager === 0 &&
    args.candidateReplyCount <= (isInterviewDemo ? 6 : 5)
***REMOVED***
    return summaryMatchesKeywords(args.interviewSummary, TECHNICAL_INTERVIEW_KEYWORDS) ||
      args.interviewSummary?.interviewReadiness === 'insufficient_signal' ||
      args.interviewSummary?.interviewReadiness === 'needs_more_evidence' ||
      (isInterviewDemo &&
        args.stageCounts.technical < 2 &&
        args.interviewSummary?.interviewReadiness !== 'strong');
  // Provider-specific function removed

  return false;
// Provider-specific function removed

function shouldUseObserverFollowup(args: {
  roomBlueprint: Readonly<ChatroomRoomBlueprint> | undefined;
  candidateReplyCount: number;
  stageCounts: InterviewStageCounts;
  interviewSummary: InterviewSummary | undefined;
// Provider-specific function removed***REMOVED***
  const isInterviewDemo = isInterviewDemoBlueprint(args.roomBlueprint);
***REMOVED***args.stageCounts.observer > 0 || args.candidateReplyCount < (isInterviewDemo ? 2 : 3)) {
    return false;
  // Provider-specific function removed

***REMOVED***isInterviewDemo) {
    return summaryMatchesKeywords(args.interviewSummary, OBSERVER_INTERVIEW_KEYWORDS) ||
      buildInterviewSummarySignals(args.interviewSummary).length >= 2;
  // Provider-specific function removed

  return summaryMatchesKeywords(args.interviewSummary, OBSERVER_INTERVIEW_KEYWORDS) ||
    buildInterviewSummarySignals(args.interviewSummary).length > 0;
// Provider-specific function removed

function shouldAskManagerRound(args: {
  roomBlueprint: Readonly<ChatroomRoomBlueprint> | undefined;
  candidateReplyCount: number;
  stageCounts: InterviewStageCounts;
  interviewSummary: InterviewSummary | undefined;
// Provider-specific function removed***REMOVED***
  const isInterviewDemo = isInterviewDemoBlueprint(args.roomBlueprint);
  const maxManagerRounds = isInterviewDemo ? 1 : MAX_MANAGER_INTERVIEW_ROUNDS;
  const openSignals = buildInterviewSummarySignals(args.interviewSummary).length;
***REMOVED***args.stageCounts.manager >= maxManagerRounds) {
    return false;
  // Provider-specific function removed

***REMOVED***isInterviewDemo) {
  ***REMOVED***args.stageCounts.manager === 0) {
    ***REMOVED***
        args.candidateReplyCount < 3 ||
        args.stageCounts.technical < 1 ||
        args.interviewSummary?.interviewStatus === 'opening'
    ***REMOVED***
        return false;
      // Provider-specific function removed

      const hasStableTechnicalThread = args.stageCounts.technical >= 2;
      return summaryMatchesKeywords(args.interviewSummary, MANAGER_INTERVIEW_KEYWORDS) ||
        openSignals >= 2 ||
        hasStableTechnicalThread ||
        (args.candidateReplyCount >= 4 &&
          args.interviewSummary?.interviewReadiness !== 'strong');
    // Provider-specific function removed

    return args.candidateReplyCount >= 4 &&
      summaryMatchesKeywords(args.interviewSummary, MANAGER_INTERVIEW_KEYWORDS) &&
      (args.interviewSummary?.interviewReadiness === 'needs_more_evidence' ||
        openSignals >= 2);
  // Provider-specific function removed

***REMOVED***args.stageCounts.manager === 0) {
    return args.candidateReplyCount >= 4 &&
      args.stageCounts.technical >= MIN_TECHNICAL_INTERVIEW_ROUNDS &&
      args.interviewSummary?.interviewStatus !== 'opening';
  // Provider-specific function removed

  return args.candidateReplyCount >= 5 &&
    summaryMatchesKeywords(args.interviewSummary, MANAGER_INTERVIEW_KEYWORDS);
// Provider-specific function removed

function shouldAskHrWrapUp(args: {
  roomBlueprint: Readonly<ChatroomRoomBlueprint> | undefined;
  candidateReplyCount: number;
  stageCounts: InterviewStageCounts;
  interviewSummary: InterviewSummary | undefined;
// Provider-specific function removed***REMOVED***
***REMOVED***isInterviewDemoBlueprint(args.roomBlueprint)) {
    const openSignals = buildInterviewSummarySignals(args.interviewSummary).length;
    return args.stageCounts.hr < 3 &&
      args.candidateReplyCount >= 3 &&
      args.candidateReplyCount < MIN_CANDIDATE_REPLIES_FOR_COMPLETION &&
      args.stageCounts.technical >= 1 &&
      (
        args.stageCounts.manager >= 1 ||
        args.interviewSummary?.interviewReadiness === 'strong' ||
        (args.interviewSummary?.interviewReadiness === 'mixed' && openSignals <= 1)
      );
  // Provider-specific function removed

  return args.stageCounts.hr < 2 &&
    args.stageCounts.manager >= 1 &&
    args.candidateReplyCount >= 5;
// Provider-specific function removed

function canPlannerFinishInterview(args: {
  roomBlueprint: Readonly<ChatroomRoomBlueprint> | undefined;
  candidateReplyCount: number;
  stageCounts: InterviewStageCounts;
  interviewSummary: InterviewSummary | undefined;
// Provider-specific function removed***REMOVED***
***REMOVED***isInterviewDemoBlueprint(args.roomBlueprint)) {
    const openSignals = buildInterviewSummarySignals(args.interviewSummary).length;
    const hasDedicatedWrapUpRound = args.stageCounts.hr >= 3;
    return (args.candidateReplyCount >= MIN_CANDIDATE_REPLIES_FOR_COMPLETION || hasDedicatedWrapUpRound) &&
      args.stageCounts.hr >= 1 &&
      args.stageCounts.technical >= 1 &&
      (args.stageCounts.observer >= 1 || args.stageCounts.manager >= 1) &&
      args.interviewSummary?.interviewStatus !== 'opening' &&
      args.interviewSummary?.interviewReadiness !== 'insufficient_signal' &&
      (
        args.interviewSummary?.interviewReadiness === 'strong' ||
        (
          args.candidateReplyCount >= 6 &&
          args.interviewSummary?.interviewReadiness === 'mixed' &&
          openSignals <= 1
        ) ||
        (
          args.candidateReplyCount >= 6 &&
          openSignals === 0 &&
          args.stageCounts.manager >= 1
        )
      );
  // Provider-specific function removed

  return args.candidateReplyCount >= MIN_CANDIDATE_REPLIES_FOR_COMPLETION &&
    args.stageCounts.hr >= 2 &&
    args.stageCounts.technical >= MIN_TECHNICAL_INTERVIEW_ROUNDS &&
    args.stageCounts.manager >= 1 &&
    args.interviewSummary?.interviewStatus !== 'opening' &&
    args.interviewSummary?.interviewReadiness !== 'insufficient_signal';
// Provider-specific function removed

function isPlannerAskActionAllowed(args: {
  plan: Extract<ResolvedInterviewTurnPlan, { kind: 'ask' // Provider-specific function removed>;
  roomBlueprint: Readonly<ChatroomRoomBlueprint> | undefined;
  candidateReplyCount: number;
  stageCounts: InterviewStageCounts;
  interviewSummary: InterviewSummary | undefined;
// Provider-specific function removed***REMOVED***
***REMOVED***args.plan.responseMode === 'clarify') {
    return true;
  // Provider-specific function removed

  switch (args.plan.phase) {
    case 'opening':
      return args.candidateReplyCount === 0;
    case 'hr_followup':
      return shouldAskHrFollowup(args);
    case 'technical_deep_dive':
      return shouldContinueTechnicalDeepDive(args);
    case 'observer_followup':
      return shouldUseObserverFollowup(args);
    case 'manager_round':
      return shouldAskManagerRound(args);
    case 'hr_wrap_up':
      return shouldAskHrWrapUp(args);
    default:
      return true;
  // Provider-specific function removed
// Provider-specific function removed

function summaryMatchesKeywords(
  summary: InterviewSummary | undefined,
  keywords: readonly string[],
***REMOVED***
***REMOVED***!summary) {
    return false;
  // Provider-specific function removed

  const haystack = [
    summary.currentStage,
    ...summary.strengths,
    ...summary.weaknesses,
    ...summary.missedQuestions,
    ...summary.followUpQuestions,
    ...summary.suggestedAnswerImprovements,
    ...summary.recommendedNextActions,
    ...summary.competencyScores.flatMap((item) => [
      item.dimension,
      ...item.evidence,
      ...item.risks,
    ]),
  ]
    .join('\n')
    .toLowerCase();

  return keywords.some((keyword) => haystack.includes(keyword.toLowerCase()));
// Provider-specific function removed

function resolveInterviewStageExecutionGuidance(
  phase: Extract<ResolvedInterviewTurnPlan, { kind: 'ask' // Provider-specific function removed>['phase'],
  track: InterviewTrack,
): string {
  switch (phase) {
    case 'opening':
      return 'Ask a natural opening question and let the candidate introduce themselves briefly.';
    case 'hr_followup':
      return 'Ask one short HR-style follow-up focused on motivation, consistency, or fit.';
    case 'technical_deep_dive':
    ***REMOVED***track === 'product') {
        return 'This is a product-case deep dive. Continue from the candidate answer and probe user problem, tradeoffs, metrics, and execution.';
      // Provider-specific function removed
    ***REMOVED***track === 'frontend') {
        return 'This is a frontend deep dive. Continue from the candidate answer and probe performance, state, UX, and engineering.';
      // Provider-specific function removed
    ***REMOVED***track === 'algorithm') {
        return 'This is an algorithm deep dive. Continue from the candidate answer and probe modeling, data, metrics, experiments, and serving.';
      // Provider-specific function removed
      return 'This is a domain deep dive. Continue from the candidate answer and probe specific implementation details and tradeoffs.';
    case 'observer_followup':
      return 'Ask one surgical follow-up that closes the most important evidence gap.';
    case 'manager_round':
    ***REMOVED***track === 'product') {
        return 'Shift into a business or manager-style question around roadmap tradeoffs, stakeholder management, and execution ownership.';
      // Provider-specific function removed
    ***REMOVED***track === 'backend' || track === 'frontend' || track === 'algorithm') {
        return 'Shift into a manager-style question around ownership, prioritization, collaboration, and business judgment.';
      // Provider-specific function removed
      return 'Shift into a comprehensive follow-up around learning agility, collaboration, ownership, prioritization, and judgment.';
    case 'hr_wrap_up':
      return 'Close the interview with motivation, role fit, and space for candidate questions.';
    default:
      return '';
  // Provider-specific function removed
// Provider-specific function removed

function shouldEmitInterviewPanelDiscussion(args: {
  state: Readonly<ChatroomState>;
  plan: Extract<ResolvedInterviewTurnPlan, { kind: 'ask' // Provider-specific function removed>;
  nextSpeakerId: string;
// Provider-specific function removed***REMOVED***
  const candidateReplyCount = countInterviewCandidateReplies(args.state.messages);
***REMOVED***candidateReplyCount < 3 || args.plan.responseMode === 'clarify') {
    return false;
  // Provider-specific function removed

***REMOVED***
    args.plan.phase !== 'observer_followup' &&
    args.plan.phase !== 'manager_round' &&
    args.plan.phase !== 'hr_wrap_up'
***REMOVED***
    return false;
  // Provider-specific function removed

  const latestQuestionMessage = resolveLatestInterviewQuestionMessage(args.state.messages);
  return Boolean(
    latestQuestionMessage &&
      latestQuestionMessage.authorId !== args.nextSpeakerId &&
      !hasInterviewPanelDiscussionAfterMessage(args.state.messages, latestQuestionMessage.id),
  );
// Provider-specific function removed

function resolveInterviewPanelDiscussionSpeaker(args: {
  state: Readonly<ChatroomState>;
  speakers: readonly AgentProfile<ChatroomAgentContext, 'text'>[];
  nextSpeakerId: string;
  fallbackSpeakerId?: string;
// Provider-specific function removed): AgentProfile<ChatroomAgentContext, 'text'> | undefined {
  const observerSpeakerId =
    resolveInterviewSpeakerId(args.state.roomBlueprint, 'panel_observer', 3) ??
    args.speakers[3]?.id;

***REMOVED***observerSpeakerId && observerSpeakerId !== args.nextSpeakerId) {
    return args.speakers.find((speaker) => speaker.id === observerSpeakerId);
  // Provider-specific function removed

***REMOVED***args.fallbackSpeakerId && args.fallbackSpeakerId !== args.nextSpeakerId) {
    return args.speakers.find((speaker) => speaker.id === args.fallbackSpeakerId);
  // Provider-specific function removed

  return args.speakers.find((speaker) => speaker.id !== args.nextSpeakerId);
// Provider-specific function removed

function buildInterviewPanelDiscussionPrompt(args: {
  state: Readonly<ChatroomState>;
  discussionSpeaker: AgentProfile<ChatroomAgentContext, 'text'>;
  nextSpeaker: AgentProfile<ChatroomAgentContext, 'text'>;
  plan: Extract<ResolvedInterviewTurnPlan, { kind: 'ask' // Provider-specific function removed>;
  previousQuestionMessage: ChatroomMessage;
// Provider-specific function removed): string {
  const latestCandidateReply = findLatestInterviewCandidateAnswer(args.state.messages);
  const interviewSummary = getInterviewSummaryFromState(args.state);
  const unresolvedSignals = buildInterviewSummarySignals(interviewSummary);
  const track = resolveInterviewTrack(args.state);
  const transitionLines = buildInterviewTransitionPromptLines({
    roomBlueprint: args.state.roomBlueprint,
    nextStageLabel: args.plan.stageLabel,
    nextQuestionGoal: args.plan.focus,
    currentPhaseLabel: args.state.roomAdminState?.currentPhaseLabel,
    currentPhaseObjective: args.state.roomAdminState?.currentPhaseObjective,
    transitionKind: 'panel_discussion',
  // Provider-specific function removed);

***REMOVED***
    `You are ${args.discussionSpeaker.name// Provider-specific function removed speaking briefly before ${args.nextSpeaker.name// Provider-specific function removed.`,
    `Track: ${resolveInterviewTrackLabel(track)// Provider-specific function removed`,
    `Current focus: ${buildInterviewTrackPlannerGuidance(track)// Provider-specific function removed`,
    `Next stage: ${args.plan.stageLabel// Provider-specific function removed`,
    `Next question goal: ${args.plan.focus// Provider-specific function removed`,
    `Previous question: ${truncateText(args.previousQuestionMessage.content, 220)// Provider-specific function removed`,
    latestCandidateReply
      ? `Latest valid answer: ${truncateText(latestCandidateReply.content, 260)// Provider-specific function removed`
      : 'There is no recent valid answer.',
    unresolvedSignals.length > 0
      ? `Open evidence gaps: ${unresolvedSignals.join(' | ')// Provider-specific function removed`
      : 'If no gap is explicit, infer the single best point to verify next.',
    transitionLines.length > 0 ? 'Execution guidance:' : undefined,
    ...transitionLines.map((line) => `- ${line// Provider-specific function removed`),
    `Write one short internal transition note starting with "${INTERVIEW_PANEL_DISCUSSION_PREFIX// Provider-specific function removed".`,
    'This note is for internal interviewer coordination only and is not shown to the candidate.',
    'Do not ask the candidate a direct question in this message.',
    'Use Simplified Chinese.',
  ]
    .filter((item): item is string => Boolean(item))
    .join('\n');
// Provider-specific function removed

function normalizeInterviewPanelDiscussionMessage(value: string): string {
  const trimmed = value.trim();
***REMOVED***!trimmed) {
    return INTERVIEW_PANEL_DISCUSSION_PREFIX;
  // Provider-specific function removed

  const normalized = trimmed.startsWith(INTERVIEW_PANEL_DISCUSSION_PREFIX)
    ? trimmed
    : `${INTERVIEW_PANEL_DISCUSSION_PREFIX// Provider-specific function removed${trimmed.startsWith('：') || trimmed.startsWith(':') ? '' : ' '// Provider-specific function removed${trimmed// Provider-specific function removed`;

  return truncateText(normalized, 260);
// Provider-specific function removed

function shouldEmitInterviewPanelHandoff(args: {
  state: Readonly<ChatroomState>;
  nextSpeakerId: string;
// Provider-specific function removed***REMOVED***
  const latestQuestionMessage = resolveLatestInterviewQuestionMessage(args.state.messages);
  return Boolean(
    latestQuestionMessage &&
      !isInterviewPanelHandoffMessage(latestQuestionMessage) &&
      latestQuestionMessage.authorId !== args.nextSpeakerId,
  );
// Provider-specific function removed

function buildInterviewPanelHandoffPrompt(args: {
  state: Readonly<ChatroomState>;
  handoffSpeaker: AgentProfile<ChatroomAgentContext, 'text'>;
  nextSpeaker: AgentProfile<ChatroomAgentContext, 'text'>;
  plan: Extract<ResolvedInterviewTurnPlan, { kind: 'ask' // Provider-specific function removed>;
  previousQuestionMessage: ChatroomMessage;
// Provider-specific function removed): string {
  const latestCandidateReply = findLatestInterviewCandidateAnswer(args.state.messages);
  const interviewSummary = getInterviewSummaryFromState(args.state);
  const unresolvedSignals = buildInterviewSummarySignals(interviewSummary);
  const track = resolveInterviewTrack(args.state);
  const transitionLines = buildInterviewTransitionPromptLines({
    roomBlueprint: args.state.roomBlueprint,
    nextStageLabel: args.plan.stageLabel,
    nextQuestionGoal: args.plan.focus,
    currentPhaseLabel: args.state.roomAdminState?.currentPhaseLabel,
    currentPhaseObjective: args.state.roomAdminState?.currentPhaseObjective,
    transitionKind: 'handoff',
  // Provider-specific function removed);

***REMOVED***
    `You are ${args.handoffSpeaker.name// Provider-specific function removed handing off to ${args.nextSpeaker.name// Provider-specific function removed.`,
    `Track: ${resolveInterviewTrackLabel(track)// Provider-specific function removed`,
    `Current focus: ${buildInterviewTrackPlannerGuidance(track)// Provider-specific function removed`,
    `Next stage: ${args.plan.stageLabel// Provider-specific function removed`,
    `Next question goal: ${args.plan.focus// Provider-specific function removed`,
    `Previous question: ${truncateText(args.previousQuestionMessage.content, 220)// Provider-specific function removed`,
    latestCandidateReply
      ? `Latest valid answer: ${truncateText(latestCandidateReply.content, 260)// Provider-specific function removed`
      : 'There is no recent valid answer.',
    unresolvedSignals.length > 0
      ? `Open evidence gaps: ${unresolvedSignals.join(' | ')// Provider-specific function removed`
      : 'If no gap is explicit, infer the single best unresolved point.',
    transitionLines.length > 0 ? 'Execution guidance:' : undefined,
    ...transitionLines.map((line) => `- ${line// Provider-specific function removed`),
    `Write one short internal handoff note starting with "${INTERVIEW_HANDOFF_PREFIX// Provider-specific function removed".`,
    'This note is for internal interviewer coordination only and is not shown to the candidate.',
    'Do not ask the candidate a direct question in this message.',
    'Use Simplified Chinese.',
  ]
    .filter((item): item is string => Boolean(item))
    .join('\n');
// Provider-specific function removed

function normalizeInterviewPanelHandoffMessage(value: string): string {
  const trimmed = value.trim();
***REMOVED***!trimmed) {
    return INTERVIEW_HANDOFF_PREFIX;
  // Provider-specific function removed

  const normalized = trimmed.startsWith(INTERVIEW_HANDOFF_PREFIX)
    ? trimmed
    : `${INTERVIEW_HANDOFF_PREFIX// Provider-specific function removed${trimmed.startsWith('：') || trimmed.startsWith(':') ? '' : ' '// Provider-specific function removed${trimmed// Provider-specific function removed`;

  return truncateText(normalized, 260);
// Provider-specific function removed

function collectInterviewTransitionNotes(
  panelDiscussionResult:
    | {
        speaker: AgentProfile<ChatroomAgentContext, 'text'>;
        output: string;
      // Provider-specific function removed
    | undefined,
  handoffResult:
    | {
        speaker: AgentProfile<ChatroomAgentContext, 'text'>;
        output: string;
      // Provider-specific function removed
    | undefined,
): string[] {
***REMOVED***
    panelDiscussionResult?.output?.trim(),
    handoffResult?.output?.trim(),
  ]
    .filter((item): item is string => Boolean(item));
// Provider-specific function removed

function applyInterviewTransitionNotesToPrompt(
  baseInput: string,
  notes: readonly string[],
): string {
***REMOVED***notes.length === 0) {
    return baseInput;
  // Provider-specific function removed

***REMOVED***
    baseInput,
    '',
    'Internal transition notes:',
    ...notes.map((note) => `- ${note// Provider-specific function removed`),
    'Use these notes as hidden coordination context only. Do not expose them directly to the candidate.',
  ].join('\n');
// Provider-specific function removed

function isInterviewPanelHandoffMessage(
  message: Pick<ChatroomMessage, 'content'> | undefined,
***REMOVED***
  return Boolean(message && message.content.trim().startsWith(INTERVIEW_HANDOFF_PREFIX));
// Provider-specific function removed

function isInterviewPanelDiscussionMessage(
  message: Pick<ChatroomMessage, 'content'> | undefined,
***REMOVED***
  return Boolean(
    message && message.content.trim().startsWith(INTERVIEW_PANEL_DISCUSSION_PREFIX),
  );
// Provider-specific function removed

function hasInterviewPanelDiscussionAfterMessage(
  messages: readonly ChatroomMessage[],
  messageId: string,
***REMOVED***
  const startIndex = messages.findIndex((message) => message.id === messageId);
***REMOVED***startIndex === -1) {
    return false;
  // Provider-specific function removed

  for (let index = startIndex + 1; index < messages.length; index += 1) {
    const message = messages[index];
  ***REMOVED***!message || message.role !== 'agent') {
      continue;
    // Provider-specific function removed
  ***REMOVED***isInterviewPanelDiscussionMessage(message)) {
      return true;
    // Provider-specific function removed
  ***REMOVED***!isInterviewMetaContent(message.content)) {
      return false;
    // Provider-specific function removed
  // Provider-specific function removed

  return false;
// Provider-specific function removed

function dedupeStrings(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const deduped: string[] = [];

  for (const value of values) {
    const normalized = value.trim();
  ***REMOVED***!normalized || seen.has(normalized)) {
      continue;
    // Provider-specific function removed

    seen.add(normalized);
    deduped.push(normalized);
  // Provider-specific function removed

  return deduped;
// Provider-specific function removed

function getScenarioMetadata(
  state: Readonly<ChatroomState>,
): Record<string, unknown> | undefined {
  const scenario = state.roomBlueprint?.metadata?.scenario;
  return scenario && typeof scenario === 'object' && !Array.isArray(scenario)
    ? (scenario as Record<string, unknown>)
    : undefined;
// Provider-specific function removed

function resolveInterviewFocusAreas(state: Readonly<ChatroomState>): string[] {
  const scenario = getScenarioMetadata(state);
  const direct = scenario?.focusAreas;
***REMOVED***Array.isArray(direct)) {
    return direct
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter(Boolean);
  // Provider-specific function removed

  for (const constraint of state.constraints) {
    const match = /^focus areas:\s*(.+)$/i.exec(constraint);
  ***REMOVED***!match) {
      continue;
    // Provider-specific function removed

    return match[1]!
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  // Provider-specific function removed

***REMOVED***];
// Provider-specific function removed

function resolveInterviewScoringGuide(state: Readonly<ChatroomState>) {
  const scenario = getScenarioMetadata(state);
  const targetRole = asOptionalString(scenario?.targetRole) ?? state.topic;
  const focusAreas = resolveInterviewFocusAreas(state);
  const scoreDimensions = [
    ...asStringArray(scenario?.scoreDimensions),
    ...parseInterviewScoreDimensionsFromConstraints(state.constraints),
  ];

  return resolveInterviewScoreTemplate({
    targetRole,
    focusAreas,
    constraints: state.constraints,
    scoreTemplateId: asOptionalString(scenario?.scoreTemplateId),
    scoreDimensions,
  // Provider-specific function removed);
// Provider-specific function removed

function asOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
// Provider-specific function removed

function asStringArray(value: unknown): string[] {
***REMOVED***!Array.isArray(value)) {
  ***REMOVED***];
  // Provider-specific function removed

  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean);
// Provider-specific function removed

function truncateText(value: string, limit: number): string {
***REMOVED***value.length <= limit) {
    return value;
  // Provider-specific function removed

  return `${value.slice(0, Math.max(0, limit - 3))// Provider-specific function removed...`;
// Provider-specific function removed

function isSummaryProfileId(profileId: string***REMOVED***
  return profileId === chatroomSummaryProfile.id ||
    profileId === interviewSummaryProfile.id ||
    profileId === roleplaySummaryProfile.id;
// Provider-specific function removed

function isAbortError(error: unknown***REMOVED***
  return error instanceof Error && error.name === 'ExecutionAbortedError';
// Provider-specific function removed

function isExecutionTimeoutError(error: unknown***REMOVED***
  return error instanceof Error && error.name === 'ExecutionTimeoutError';
// Provider-specific function removed

function formatStepError(error: unknown): string {
***REMOVED***error instanceof Error) {
    return error.stack ?? error.message;
  // Provider-specific function removed

  return String(error);
// Provider-specific function removed

function appendChatroomMessage(
  state: ChatroomState,
  input: {
    role: ChatroomMessage['role'];
    authorId: string;
    authorName: string;
    round: number;
    content: string;
  // Provider-specific function removed,
): ChatroomMessage {
  const message = createChatroomMessage(input);
  state.messages.push(message);
  state.roleplayScene = updateRoleplaySceneState(state.roleplayScene, message);
  return message;
// Provider-specific function removed

function createChatroomMessage(input: {
  role: ChatroomMessage['role'];
  authorId: string;
  authorName: string;
  round: number;
  content: string;
// Provider-specific function removed): ChatroomMessage {
  return {
    id: randomUUID(),
    role: input.role,
    authorId: input.authorId,
    authorName: input.authorName,
    round: input.round,
    createdAt: new Date().toISOString(),
    content: input.content.trim(),
  // Provider-specific function removed;
// Provider-specific function removed

function resolveSpeakerIds(
  roomType: ChatroomRoomTypeId,
  speakerIds: readonly string[] | undefined,
): string[] {
  const roomTypeSpec = resolveChatroomRoomType(roomType);
  const ids =
    speakerIds && speakerIds.length > 0 ? speakerIds : roomTypeSpec.defaultSpeakerIds;

***REMOVED***...ids];
// Provider-specific function removed

function resolveCustomRoleplayTemplates(args: {
  roomType: ChatroomRoomTypeId;
  customCharacters: Array<{ name: string; instruction: string // Provider-specific function removed> | undefined;
  customRoleplayTemplates: Map<string, RoleplayCharacterTemplate> | undefined;
// Provider-specific function removed): Map<string, RoleplayCharacterTemplate> | undefined {
***REMOVED***args.customRoleplayTemplates && args.customRoleplayTemplates.size > 0) {
    return args.customRoleplayTemplates;
  // Provider-specific function removed

***REMOVED***
    resolveChatroomRoomType(args.roomType).behavior !== 'roleplay' ||
    !args.customCharacters ||
    args.customCharacters.length === 0
***REMOVED***
    return undefined;
  // Provider-specific function removed

  return createCustomRoleplayTemplates(args.customCharacters);
// Provider-specific function removed

function chunkSpeakers(
  speakers: readonly AgentProfile<ChatroomAgentContext, 'text'>[],
  batchSize: number,
): Array<AgentProfile<ChatroomAgentContext, 'text'>[]> {
  const batches: Array<AgentProfile<ChatroomAgentContext, 'text'>[]> = [];
  for (let index = 0; index < speakers.length; index += batchSize) {
    batches.push(speakers.slice(index, index + batchSize));
  // Provider-specific function removed

  return batches;
// Provider-specific function removed

export function resolveChatroomParallelBatchSize(
  batchSize: number | undefined,
  speakerCount: number,
): number {
***REMOVED***!batchSize || batchSize < 1) {
    return Math.min(4, Math.max(1, speakerCount));
  // Provider-specific function removed

  return Math.min(Math.max(1, batchSize), Math.max(1, speakerCount));
// Provider-specific function removed

function createParticipantAuthorId(name: string, fallback: string): string {
  const normalized = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return normalized ? `user-${normalized// Provider-specific function removed` : fallback;
// Provider-specific function removed

function resolveSpeakerDisplayName(
  state: Readonly<ChatroomState>,
  roomId: string | undefined,
  speaker: AgentProfile<ChatroomAgentContext, any>,
): string {
  return roomId
    ? getChatroomParticipantBinding(roomId, speaker.id)?.participant.displayName ??
        resolveBlueprintSpeakerLabel(state.roomBlueprint, speaker.id) ??
        speaker.name
    : resolveBlueprintSpeakerLabel(state.roomBlueprint, speaker.id) ?? speaker.name;
// Provider-specific function removed

function resolveSpeakerRole(
  state: Readonly<ChatroomState>,
  speaker: AgentProfile<ChatroomAgentContext, any>,
): string {
  return resolveBlueprintSpeakerDescription(state.roomBlueprint, speaker.id) ?? speaker.description;
// Provider-specific function removed

function resolveBlueprintSpeakerLabel(
  roomBlueprint: ChatroomRoomBlueprint | undefined,
  speakerId: string,
): string | undefined {
  return roomBlueprint?.participantSlots.find((slot) => slot.speakerId === speakerId)?.label;
// Provider-specific function removed

function resolveBlueprintSpeakerDescription(
  roomBlueprint: ChatroomRoomBlueprint | undefined,
  speakerId: string,
): string | undefined {
  return roomBlueprint?.participantSlots.find((slot) => slot.speakerId === speakerId)?.description;
// Provider-specific function removed

function resolvePrimaryHumanParticipantLabel(
  roomBlueprint: ChatroomRoomBlueprint | undefined,
): string {
  return roomBlueprint?.participantSlots.find((slot) => slot.participantType === 'human')?.label ?? 'User';
// Provider-specific function removed

export function getNextChatroomRound(messages: readonly ChatroomMessage[]): number {
  let maxRound = 0;
  for (const message of messages) {
  ***REMOVED***message.role === 'agent' || message.role === 'user' || message.role === 'summary') {
      maxRound = Math.max(maxRound, message.round);
    // Provider-specific function removed
  // Provider-specific function removed

  return maxRound + 1;
// Provider-specific function removed
