import type { RoomAdminTurn // Provider-specific function removed from '../agents/schemas.js';
import type { ChatroomMessage // Provider-specific function removed from '../room-core/message-types.js';
import type { ChatroomRoomKernelDirective // Provider-specific function removed from './room-kernel-types.js';
import type {
  ChatroomRoomBlueprint,
// Provider-specific function removed from '../room-scenarios/room-blueprints.js';
import {
  resolveScenarioRoomAdminFallbackEvent,
  resolveScenarioRoomAdminFallbackPhase,
// Provider-specific function removed from './governance-playbooks.js';
import {
  isNextRoomRuntimeMode,
  resolveRoomRuntimeModeFromBlueprint,
  type RoomRuntimeMode,
// Provider-specific function removed from '../workflows/room-runtime-mode.js';
import type { InterviewRoomAdminIncidentSnapshot // Provider-specific function removed from '../room-scenarios/interview/interview-admin-types.js';

export interface RoomAdminFallbackCollaborationContext {
  recommendedResponseModeHint?: 'new_question' | 'clarify';
  retryInstructionSuffix?: string;
  completeInstructionSuffix?: string;
  holdInstructionSuffix?: string;
// Provider-specific function removed

export function buildChatroomRoomAdminFallback(args: {
  roomBlueprint: Readonly<ChatroomRoomBlueprint> | undefined;
  runtimeMode?: RoomRuntimeMode;
  round: number;
  messages: readonly ChatroomMessage[];
  roomKernelDirective?: Readonly<ChatroomRoomKernelDirective>;
  interviewIncident?: InterviewRoomAdminIncidentSnapshot;
  collaboration?: Readonly<RoomAdminFallbackCollaborationContext>;
// Provider-specific function removed): RoomAdminTurn {
  const adminConfig = args.roomBlueprint?.governance.roomAdmin;
  const scenarioTemplateId = args.roomBlueprint?.scenarioTemplateId;
  const runtimeMode = args.runtimeMode ?? resolveRoomRuntimeModeFromBlueprint(args.roomBlueprint);
  const latestUserMessage = [...args.messages].reverse().find((item) => item.role === 'user');

***REMOVED***!adminConfig?.enabled) {
    return {
      action: 'idle',
      visibility: 'hidden',
      phaseLabel: '',
      phaseObjective: '',
      eventLabel: '',
      eventMessage: '',
      targetSpeakerId: '',
      targetPromptMessageId: '',
      responseMode: 'new_question',
      terminalStatus: undefined,
      instruction: '',
      reason: '',
      participantAdditions: [],
    // Provider-specific function removed;
  // Provider-specific function removed

  const kernelDrivenTurn = resolveRoomKernelDrivenRoomAdminTurn({
    roomBlueprint: args.roomBlueprint,
    runtimeMode,
    roomKernelDirective: args.roomKernelDirective,
    interviewIncident: args.interviewIncident,
    collaboration: args.collaboration,
  // Provider-specific function removed);
***REMOVED***kernelDrivenTurn) {
    return kernelDrivenTurn;
  // Provider-specific function removed

  const genericControl = resolveGenericRoomAdminControl({
    scenarioTemplateId,
    messages: args.messages,
    interviewIncident: args.interviewIncident,
    collaboration: args.collaboration,
  // Provider-specific function removed);
***REMOVED***genericControl) {
    return genericControl;
  // Provider-specific function removed

***REMOVED***scenarioTemplateId === 'interview_simulation' && args.interviewIncident) {
    return buildInterviewIncidentFallback(args.interviewIncident, args.collaboration);
  // Provider-specific function removed

  const phase = resolveScenarioRoomAdminFallbackPhase({
    roomBlueprint: args.roomBlueprint,
    round: args.round,
    latestUserMessage: latestUserMessage?.content,
  // Provider-specific function removed);
  const fallbackEvent = resolveScenarioRoomAdminFallbackEvent({
    roomBlueprint: args.roomBlueprint,
  // Provider-specific function removed);

***REMOVED***
    scenarioTemplateId &&
    fallbackEvent &&
    adminConfig.canInjectEvents &&
    args.round >= 2 &&
    shouldInjectFallbackEvent(args.messages)
***REMOVED***
    return {
      action: adminConfig.canManagePhases ? 'set_phase_and_event' : 'inject_event',
      visibility: 'visible',
      phaseLabel: adminConfig.canManagePhases ? phase.label : '',
      phaseObjective: adminConfig.canManagePhases ? phase.objective : '',
      eventLabel: fallbackEvent.label,
      eventMessage: fallbackEvent.message,
      targetSpeakerId: '',
      targetPromptMessageId: '',
      responseMode: 'new_question',
      instruction: fallbackEvent.instruction,
      reason: '剧情房间节奏趋于停滞，需要管理员注入事件重新驱动互动。',
      participantAdditions: [],
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***adminConfig.canManagePhases) {
    return {
      action: 'set_phase',
      visibility: scenarioTemplateId === 'interview_simulation' ? 'hidden' : 'visible',
      phaseLabel: phase.label,
      phaseObjective: phase.objective,
      eventLabel: '',
      eventMessage: '',
      targetSpeakerId: '',
      targetPromptMessageId: '',
      responseMode: 'new_question',
      instruction: phase.instruction,
      reason: '管理员回退逻辑：为当前回合提供一个可执行的阶段目标。',
      participantAdditions: [],
    // Provider-specific function removed;
  // Provider-specific function removed

  return {
    action: 'idle',
    visibility: 'hidden',
    phaseLabel: '',
    phaseObjective: '',
    eventLabel: '',
    eventMessage: '',
    targetSpeakerId: '',
    targetPromptMessageId: '',
    responseMode: 'new_question',
    instruction: '',
    reason: '当前不需要管理员显式介入。',
    participantAdditions: [],
  // Provider-specific function removed;
// Provider-specific function removed

export function resolveRoomKernelDrivenRoomAdminTurn(args: {
  roomBlueprint: Readonly<ChatroomRoomBlueprint> | undefined;
  runtimeMode: RoomRuntimeMode;
  roomKernelDirective?: Readonly<ChatroomRoomKernelDirective>;
  interviewIncident?: InterviewRoomAdminIncidentSnapshot;
  collaboration?: Readonly<RoomAdminFallbackCollaborationContext>;
// Provider-specific function removed): RoomAdminTurn | undefined {
***REMOVED***!isNextRoomRuntimeMode(args.runtimeMode) || !args.roomKernelDirective) {
    return undefined;
  // Provider-specific function removed

  const directive = args.roomKernelDirective;
  const scenarioTemplateId = args.roomBlueprint?.scenarioTemplateId;
  const effectiveAction =
    directive.action === 'observe' && directive.shouldEscalateRoomAdmin
      ? 'guide_room_admin'
      : directive.action;

***REMOVED***effectiveAction === 'observe' && !directive.shouldEscalateRoomAdmin) {
    return undefined;
  // Provider-specific function removed

  const baseInstruction =
    directive.recommendedInstruction.trim() ||
    directive.summary.trim() ||
    'Room kernel requested room-admin intervention.';
  const baseReason =
    directive.summary.trim() ||
    directive.recommendedInstruction.trim() ||
    'Room kernel requested room-admin intervention.';

***REMOVED***effectiveAction === 'terminate_interview') {
    return {
      action: 'complete_interview',
      visibility: 'hidden',
      phaseLabel: '',
      phaseObjective: '',
      eventLabel: '',
      eventMessage: '',
      targetSpeakerId: '',
      targetPromptMessageId: '',
      responseMode: 'new_question',
      terminalStatus: 'aborted',
      instruction: appendInstructionSuffix(
        baseInstruction,
        args.collaboration?.completeInstructionSuffix,
      ),
      reason: baseReason,
      participantAdditions: [],
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***effectiveAction === 'hold') {
    return {
      action: 'hold_interview',
      visibility: 'hidden',
      phaseLabel: '',
      phaseObjective: '',
      eventLabel: '',
      eventMessage: '',
      targetSpeakerId: '',
      targetPromptMessageId: '',
      responseMode: 'new_question',
      instruction: appendInstructionSuffix(
        baseInstruction,
        args.collaboration?.holdInstructionSuffix,
      ),
      reason: baseReason,
      participantAdditions: [],
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***effectiveAction === 'retry') {
    return {
      action: 'request_answer_retry',
      visibility: 'hidden',
      phaseLabel: '',
      phaseObjective: '',
      eventLabel: '',
      eventMessage: '',
      targetSpeakerId: directive.targetSpeakerId.trim(),
      targetPromptMessageId: directive.targetPromptMessageId.trim(),
      responseMode: 'new_question',
      instruction: baseInstruction,
      reason: baseReason,
      participantAdditions: [],
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***effectiveAction === 'skip_phase') {
    return {
      action: 'skip_phase',
      visibility: 'hidden',
      phaseLabel: directive.phaseLabel.trim(),
      phaseObjective: directive.summary.trim(),
      eventLabel: '',
      eventMessage: '',
      targetSpeakerId: directive.targetSpeakerId.trim(),
      targetPromptMessageId: '',
      responseMode: 'new_question',
      instruction: baseInstruction,
      reason: baseReason,
      participantAdditions: [],
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***effectiveAction === 'advance_phase') {
    return {
      action: 'set_phase',
      visibility: 'hidden',
      phaseLabel: directive.phaseLabel.trim(),
      phaseObjective: directive.summary.trim(),
      eventLabel: '',
      eventMessage: '',
      targetSpeakerId: '',
      targetPromptMessageId: '',
      responseMode: 'new_question',
      instruction: baseInstruction,
      reason: baseReason,
      participantAdditions: [],
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***effectiveAction !== 'guide_room_admin') {
    return undefined;
  // Provider-specific function removed

***REMOVED***scenarioTemplateId === 'interview_simulation') {
    const targetSpeakerId =
      directive.targetSpeakerId.trim() ||
      args.interviewIncident?.pendingSpeakerId ||
      args.interviewIncident?.latestQuestionSpeakerId ||
      '';
    const targetPromptMessageId =
      directive.targetPromptMessageId.trim() ||
      args.interviewIncident?.pendingPromptMessageId ||
      args.interviewIncident?.latestQuestionMessageId ||
      '';
    const responseMode =
      args.collaboration?.recommendedResponseModeHint ??
      args.interviewIncident?.recommendedResponseMode ??
      (args.interviewIncident?.latestCandidateTurnKind === 'clarify_request' ||
      args.interviewIncident?.latestCandidateTurnKind === 'repeat_request'
        ? 'clarify'
        : 'new_question');

    return {
      action: 'request_answer_retry',
      visibility: 'hidden',
      phaseLabel: '',
      phaseObjective: '',
      eventLabel: '',
      eventMessage: '',
      targetSpeakerId,
      targetPromptMessageId,
      responseMode,
      instruction: appendInstructionSuffix(
        baseInstruction,
        args.collaboration?.retryInstructionSuffix,
      ),
      reason: baseReason,
      participantAdditions: [],
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***directive.phaseLabel.trim()) {
    return {
      action: 'set_phase',
      visibility: 'hidden',
      phaseLabel: directive.phaseLabel.trim(),
      phaseObjective: directive.summary.trim(),
      eventLabel: '',
      eventMessage: '',
      targetSpeakerId: '',
      targetPromptMessageId: '',
      responseMode: 'new_question',
      instruction: baseInstruction,
      reason: baseReason,
      participantAdditions: [],
    // Provider-specific function removed;
  // Provider-specific function removed

  return undefined;
// Provider-specific function removed

export function shouldInjectFallbackEvent(messages: readonly ChatroomMessage[]***REMOVED***
  const recent = messages.slice(-5);
  const recentUserCount = recent.filter((item) => item.role === 'user').length;
  return recent.length >= 3 && recentUserCount <= 1;
// Provider-specific function removed

export function buildInterviewFallbackRetryInstruction(
  snapshot: InterviewRoomAdminIncidentSnapshot,
  retryInstructionSuffix?: string,
): string {
***REMOVED***snapshot.latestAnswerFollowUpFocus) {
    return appendInstructionSuffix(snapshot.latestAnswerFollowUpFocus, retryInstructionSuffix);
  // Provider-specific function removed

***REMOVED***snapshot.latestCandidateTurnKind === 'refusal_request') {
    return appendInstructionSuffix(
      'The candidate refused to answer the current question. Retry once from a narrower or safer angle, and keep the same evidence thread.',
      retryInstructionSuffix,
    );
  // Provider-specific function removed

***REMOVED***snapshot.latestCandidateTurnKind === 'other') {
    return appendInstructionSuffix(
      'The candidate did not address the active question directly. Pull the conversation back to the same question and ask for a direct answer.',
      retryInstructionSuffix,
    );
  // Provider-specific function removed

  switch (snapshot.latestCandidateTurnKind) {
    case 'clarify_request':
      return appendInstructionSuffix(
        '候选人要求澄清，请由原提问面试官先缩窄或澄清上一问，再继续收集证据。',
        retryInstructionSuffix,
      );
    case 'repeat_request':
      return appendInstructionSuffix(
        '候选人要求重复问题，请由原提问面试官先重述上一问，再等待候选人补答。',
        retryInstructionSuffix,
      );
    case 'repeated_answer':
      return appendInstructionSuffix(
        '候选人重复了上一轮回答，请由原提问面试官缩窄问题或换一个切入口，要求其直接补充缺失信息。',
        retryInstructionSuffix,
      );
    default:
      return appendInstructionSuffix(
        '请由当前负责的面试官围绕上一问重试一次，不要切到无关新话题。',
        retryInstructionSuffix,
      );
  // Provider-specific function removed
// Provider-specific function removed

export function buildInterviewFallbackRetryReason(
  snapshot: InterviewRoomAdminIncidentSnapshot,
): string {
***REMOVED***snapshot.latestCandidateTurnKind === 'refusal_request') {
    return snapshot.consecutiveRefusalCount >= 2
      ? 'The candidate has refused to answer the active thread multiple times, so the interview can no longer make useful progress.'
      : 'The candidate refused the active question, so the interviewer should retry once from a narrower or safer angle.';
  // Provider-specific function removed

***REMOVED***snapshot.latestCandidateTurnKind === 'other') {
    return snapshot.consecutiveNonResponsiveCount >= 2
      ? 'The candidate has stayed non-responsive to the active question across multiple turns, so the interview should stop instead of looping.'
      : 'The candidate did not answer the active question directly, so the interviewer should pull the thread back before moving on.';
  // Provider-specific function removed

***REMOVED***snapshot.latestAnswerAdequate === false) {
    return '候选人最新回答没有正面覆盖上一问，需要面试官拉回主线并补齐证据。';
  // Provider-specific function removed

  switch (snapshot.latestCandidateTurnKind) {
    case 'clarify_request':
      return '候选人要求澄清当前问题。';
    case 'repeat_request':
      return '候选人要求重复当前问题。';
    case 'repeated_answer':
      return snapshot.repeatedAnswerCount >= 2
        ? '候选人已连续重复回答，需要面试官主动换一个表达方式重试。'
        : '候选人重复了上一轮回答，需要面试官收窄问题。';
    default:
      return '当前面试线程需要管理员安排一次重试。';
  // Provider-specific function removed
// Provider-specific function removed

export function buildInterviewFallbackCompleteInstruction(
  snapshot: InterviewRoomAdminIncidentSnapshot,
  completeInstructionSuffix?: string,
): string {
***REMOVED***snapshot.latestCandidateTurnKind === 'withdraw_request') {
    return appendInstructionSuffix(
      'The candidate explicitly chose to end the interview, so the room should stop asking follow-up questions and move into final synthesis.',
      completeInstructionSuffix,
    );
  // Provider-specific function removed

***REMOVED***snapshot.latestCandidateTurnKind === 'refusal_request') {
    return appendInstructionSuffix(
      'The candidate has refused the active evidence thread multiple times. End the interview instead of forcing another retry.',
      completeInstructionSuffix,
    );
  // Provider-specific function removed

***REMOVED***snapshot.latestCandidateTurnKind === 'other') {
    return appendInstructionSuffix(
      'The candidate stayed non-responsive to the active question across multiple turns. End the interview instead of looping on the same thread.',
      completeInstructionSuffix,
    );
  // Provider-specific function removed

  return appendInstructionSuffix(
    'The candidate is no longer producing useful new evidence on the active question thread, so the interview should end and move into final synthesis.',
    completeInstructionSuffix,
  );
// Provider-specific function removed

export function buildInterviewFallbackCompleteReason(
  snapshot: InterviewRoomAdminIncidentSnapshot,
): string {
***REMOVED***snapshot.latestCandidateTurnKind === 'withdraw_request') {
    return 'The candidate explicitly asked to end the interview.';
  // Provider-specific function removed

***REMOVED***snapshot.latestCandidateTurnKind === 'refusal_request') {
    return 'The candidate repeatedly refused to answer the active thread, so the interview can no longer make meaningful progress.';
  // Provider-specific function removed

***REMOVED***snapshot.latestCandidateTurnKind === 'other') {
    return 'The candidate stayed off-topic or non-responsive across multiple turns, so the interview can no longer make meaningful progress.';
  // Provider-specific function removed

  return 'The candidate kept repeating or failing to advance the active thread, so the interview can no longer make meaningful progress.';
// Provider-specific function removed

export function buildInterviewFallbackHoldInstruction(
  snapshot: InterviewRoomAdminIncidentSnapshot,
  holdInstructionSuffix?: string,
): string {
***REMOVED***snapshot.consecutiveWaitCount >= 2) {
    return appendInstructionSuffix(
      '候选人已多次表示需要暂停或恢复连接，当前先保持等待，不继续追问。若再次无法恢复，可考虑结束本轮面试。',
      holdInstructionSuffix,
    );
  // Provider-specific function removed

  return appendInstructionSuffix(
    '候选人表示需要暂停或恢复连接，当前保持等待，继续保留上一问的 pending reply。',
    holdInstructionSuffix,
  );
// Provider-specific function removed

export function buildInterviewFallbackHoldReason(
  snapshot: InterviewRoomAdminIncidentSnapshot,
): string {
***REMOVED***snapshot.consecutiveWaitCount >= 2) {
    return '候选人持续处于暂停/重连状态，房间先保持等待。';
  // Provider-specific function removed

  return '候选人请求暂停或恢复连接。';
// Provider-specific function removed

function appendInstructionSuffix(base: string, suffix: string | undefined): string {
  return suffix ? `${base// Provider-specific function removed ${suffix// Provider-specific function removed` : base;
// Provider-specific function removed

function resolveGenericRoomAdminControl(args: {
  scenarioTemplateId: string | undefined;
  messages: readonly ChatroomMessage[];
  interviewIncident?: InterviewRoomAdminIncidentSnapshot;
  collaboration?: Readonly<RoomAdminFallbackCollaborationContext>;
// Provider-specific function removed): RoomAdminTurn | undefined {
  const { scenarioTemplateId, messages, interviewIncident, collaboration // Provider-specific function removed = args;
  const isInterviewScenario = scenarioTemplateId === 'interview_simulation';

***REMOVED***!interviewIncident?.recommendedAction) {
    return undefined;
  // Provider-specific function removed

  const action = interviewIncident.recommendedAction;

***REMOVED***action === 'hold_interview') {
    return {
      action: 'hold_interview',
      visibility: 'hidden',
      phaseLabel: '',
      phaseObjective: '',
      eventLabel: '',
      eventMessage: '',
      targetSpeakerId: '',
      targetPromptMessageId: '',
      responseMode: 'new_question',
      terminalStatus: undefined,
      instruction: collaboration?.holdInstructionSuffix ?? 'Room should hold and wait.',
      reason: isInterviewScenario
        ? 'Interview scenario: hold for pause or reconnect.'
        : 'Room should hold and wait.',
      participantAdditions: [],
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***action === 'request_answer_retry') {
    const targetSpeakerId =
      interviewIncident.pendingSpeakerId ??
      interviewIncident.latestQuestionSpeakerId ??
      '';
    const targetPromptMessageId =
      interviewIncident.pendingPromptMessageId ??
      interviewIncident.latestQuestionMessageId ??
      '';

    return {
      action: 'request_answer_retry',
      visibility: 'hidden',
      phaseLabel: '',
      phaseObjective: '',
      eventLabel: '',
      eventMessage: '',
      targetSpeakerId,
      targetPromptMessageId,
      responseMode:
        collaboration?.recommendedResponseModeHint ??
        interviewIncident.recommendedResponseMode ??
        'new_question',
      terminalStatus: undefined,
      instruction: collaboration?.retryInstructionSuffix ?? 'Retry the active thread.',
      reason: isInterviewScenario
        ? 'Interview scenario: retry request from incident detection.'
        : 'Room should retry the active thread.',
      participantAdditions: [],
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***action === 'complete_interview') {
    return {
      action: 'complete_interview',
      visibility: 'hidden',
      phaseLabel: '',
      phaseObjective: '',
      eventLabel: '',
      eventMessage: '',
      targetSpeakerId: '',
      targetPromptMessageId: '',
      responseMode: 'new_question',
      terminalStatus: 'aborted',
      instruction: collaboration?.completeInstructionSuffix ?? 'Room should complete.',
      reason: isInterviewScenario
        ? 'Interview scenario: complete from incident detection.'
        : 'Room should complete.',
      participantAdditions: [],
    // Provider-specific function removed;
  // Provider-specific function removed

  return undefined;
// Provider-specific function removed

function buildInterviewIncidentFallback(
  incident: InterviewRoomAdminIncidentSnapshot,
  collaboration?: Readonly<RoomAdminFallbackCollaborationContext>,
): RoomAdminTurn {
  const turn = resolveGenericRoomAdminControl({
    scenarioTemplateId: 'interview_simulation',
    messages: [],
    interviewIncident: incident,
    collaboration,
  // Provider-specific function removed);

***REMOVED***turn) {
    return turn;
  // Provider-specific function removed

  return {
    action: 'idle',
    visibility: 'hidden',
    phaseLabel: '',
    phaseObjective: '',
    eventLabel: '',
    eventMessage: '',
    targetSpeakerId: '',
    targetPromptMessageId: '',
    responseMode: 'new_question',
    terminalStatus: undefined,
    instruction: '',
    reason: 'Interview incident detected but no generic action matched.',
    participantAdditions: [],
  // Provider-specific function removed;
// Provider-specific function removed
