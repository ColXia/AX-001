import type { ChatroomMessage // Provider-specific function removed from '../room-core/message-types.js';
import type { ChatroomRoomAdminDirective // Provider-specific function removed from './room-admin-types.js';
import { resolveRoomAdminTerminalStatus // Provider-specific function removed from './room-admin-state.js';
import type {
  InterviewAskPhase,
  InterviewPendingCandidateReplyState,
  InterviewPhaseState,
  ResolvedInterviewTurnPlan as InterviewControllerResolvedInterviewTurnPlan,
// Provider-specific function removed from '../workflows/interview-room-controller.js';
import { resolveLatestInterviewQuestionMessage // Provider-specific function removed from '../workflows/interview-room-controller.js';
import type { ChatroomRoomBlueprint // Provider-specific function removed from '../room-scenarios/room-blueprints.js';
import {
  countInterviewCandidateReplies,
  getLatestInterviewCandidateTurnState,
  hasInterviewEvasiveAnswerSignal,
  MIN_CANDIDATE_REPLIES_FOR_COMPLETION,
// Provider-specific function removed from '../workflows/interview-room-utils.js';

const DEFAULT_ROOM_ADMIN_CLARIFY_RETRY_FOCUS =
  'Clarify or narrow the previous question first, then wait for the candidate to answer directly.';
const DEFAULT_ROOM_ADMIN_NEW_ANGLE_RETRY_FOCUS =
  'Retry the same evidence thread from a more concrete angle and require the candidate to fill the missing information directly.';

export type ResolvedInterviewRoomAdminControl =
  | Extract<InterviewControllerResolvedInterviewTurnPlan, { kind: 'wait' // Provider-specific function removed>
  | Extract<InterviewControllerResolvedInterviewTurnPlan, { kind: 'complete' // Provider-specific function removed>
  | {
      kind: 'ask';
      phase: InterviewAskPhase;
      speakerId: string;
      focus: string;
      reason: string;
      responseMode: InterviewPendingCandidateReplyState['responseMode'];
    // Provider-specific function removed;

export function resolveInterviewRoomAdminControl(args: {
  directive?: Readonly<ChatroomRoomAdminDirective>;
  round: number;
  messages: readonly ChatroomMessage[];
  roomBlueprint?: Readonly<ChatroomRoomBlueprint>;
  speakerIds: readonly string[];
  trackedPhase: InterviewPhaseState;
  minimumPhase: InterviewPhaseState;
// Provider-specific function removed): ResolvedInterviewRoomAdminControl | undefined {
  const directive = args.directive;
***REMOVED***!directive || directive.round !== args.round) {
    return undefined;
  // Provider-specific function removed

***REMOVED***directive.action === 'complete_interview') {
    const terminalStatus = resolveInterviewRoomAdminCompletionTerminalStatus({
      directive,
      messages: args.messages,
      trackedPhase: args.trackedPhase,
      minimumPhase: args.minimumPhase,
    // Provider-specific function removed);

    return {
      kind: 'complete',
      reason:
        directive.reason ||
        directive.instruction ||
        'Room admin determined that the interview should stop now.',
      terminalStatus,
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***directive.action === 'hold_interview') {
    return {
      kind: 'wait',
      reason:
        directive.reason ||
        directive.instruction ||
        'Room admin determined that the interview should stay on hold for now.',
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***directive.action === 'set_phase' || directive.action === 'skip_phase') {
    const phase = resolveInterviewAskPhaseFromDirectivePhaseLabel(directive.phaseLabel);
  ***REMOVED***!phase) {
      return undefined;
    // Provider-specific function removed

    return {
      kind: 'ask',
      phase,
      speakerId:
        resolveInterviewSpeakerIdForPhase({
          roomBlueprint: args.roomBlueprint,
          speakerIds: args.speakerIds,
          phase,
        // Provider-specific function removed) ?? resolveInterviewFallbackSpeakerId(args.speakerIds),
      focus:
        directive.phaseObjective ||
        directive.instruction ||
        buildInterviewPhaseControlFocus(phase),
      reason:
        directive.reason ||
        (directive.action === 'skip_phase'
          ? `Room admin skipped ahead to the ${phase// Provider-specific function removed stage.`
          : `Room admin moved the interview into the ${phase// Provider-specific function removed stage.`),
      responseMode: 'new_question',
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***directive.action !== 'request_answer_retry') {
    return undefined;
  // Provider-specific function removed

  const latestQuestionMessage = resolveLatestInterviewQuestionMessage(args.messages);
  const requestedSpeakerId = directive.targetSpeakerId.trim();
  const speakerId = args.speakerIds.includes(requestedSpeakerId)
    ? requestedSpeakerId
    : latestQuestionMessage?.authorId;
***REMOVED***!speakerId) {
    return undefined;
  // Provider-specific function removed

  return {
    kind: 'ask',
    phase: resolveInterviewAskPhaseForSpeakerId({
      roomBlueprint: args.roomBlueprint,
      speakerIds: args.speakerIds,
      speakerId,
      trackedPhase: args.trackedPhase,
      minimumPhase: args.minimumPhase,
    // Provider-specific function removed),
    speakerId,
    focus: directive.instruction || resolveInterviewRoomAdminRetryFocus(directive.responseMode),
    reason:
      directive.reason ||
      `Room admin requested ${
        directive.responseMode === 'clarify' ? 'a clarification retry' : 'a new-angle retry'
      // Provider-specific function removed for the active interview thread.`,
    responseMode: directive.responseMode,
  // Provider-specific function removed;
// Provider-specific function removed

function resolveInterviewRoomAdminCompletionTerminalStatus(args: {
  directive: Readonly<ChatroomRoomAdminDirective>;
  messages: readonly ChatroomMessage[];
  trackedPhase: InterviewPhaseState;
  minimumPhase: InterviewPhaseState;
// Provider-specific function removed): 'complete' | 'aborted' {
***REMOVED***args.directive.terminalStatus) {
    return resolveRoomAdminTerminalStatus(args.directive.terminalStatus, 'aborted');
  // Provider-specific function removed

  const latestCandidateTurn = getLatestInterviewCandidateTurnState(args.messages);
***REMOVED***
    latestCandidateTurn.kind === 'withdraw_request' ||
    latestCandidateTurn.kind === 'refusal_request' ||
    latestCandidateTurn.kind === 'pause_request' ||
    latestCandidateTurn.kind === 'repeated_answer' ||
    latestCandidateTurn.kind === 'other'
***REMOVED***
    return 'aborted';
  // Provider-specific function removed

  const candidateReplyCount = countInterviewCandidateReplies(args.messages);
  const latestQuestionMessage = resolveLatestInterviewQuestionMessage(args.messages);
  const latestAnswerLooksEvasive = Boolean(
    latestCandidateTurn.message &&
      hasInterviewEvasiveAnswerSignal(latestCandidateTurn.message.content),
  );
***REMOVED***latestCandidateTurn.kind === 'answer' && latestAnswerLooksEvasive) {
    return 'aborted';
  // Provider-specific function removed

***REMOVED***
    latestCandidateTurn.kind === 'answer' &&
    candidateReplyCount >= MIN_CANDIDATE_REPLIES_FOR_COMPLETION &&
    !latestAnswerLooksEvasive
***REMOVED***
    return 'complete';
  // Provider-specific function removed

***REMOVED***
    latestCandidateTurn.kind === 'answer' &&
    candidateReplyCount >= 5 &&
    latestQuestionMessage?.authorId === 'interview-hr' &&
    !latestAnswerLooksEvasive
***REMOVED***
    return 'complete';
  // Provider-specific function removed

***REMOVED***
    candidateReplyCount >= MIN_CANDIDATE_REPLIES_FOR_COMPLETION &&
    (latestQuestionMessage?.authorId === 'interview-hr' ||
      args.trackedPhase === 'manager' ||
      args.trackedPhase === 'hr_wrapup' ||
      args.minimumPhase === 'manager' ||
      args.minimumPhase === 'hr_wrapup')
***REMOVED***
    return 'complete';
  // Provider-specific function removed

  return 'aborted';
// Provider-specific function removed

function resolveInterviewAskPhaseForSpeakerId(args: {
  roomBlueprint?: Readonly<ChatroomRoomBlueprint>;
  speakerIds: readonly string[];
  speakerId: string;
  trackedPhase: InterviewPhaseState;
  minimumPhase: InterviewPhaseState;
// Provider-specific function removed): InterviewAskPhase {
  const hrSpeakerId =
    args.speakerIds[0] ??
    resolveInterviewSpeakerId(args.roomBlueprint, 'hr_interviewer', 0) ??
    'interview-hr';
  const technicalSpeakerId =
    args.speakerIds[1] ??
    resolveInterviewSpeakerId(args.roomBlueprint, 'technical_interviewer', 1) ??
    'interview-technical';
  const managerSpeakerId =
    args.speakerIds[2] ??
    resolveInterviewSpeakerId(args.roomBlueprint, 'manager_interviewer', 2) ??
    'interview-manager';
  const observerSpeakerId =
    args.speakerIds[3] ??
    resolveInterviewSpeakerId(args.roomBlueprint, 'panel_observer', 3) ??
    'interview-observer';

***REMOVED***args.speakerId === technicalSpeakerId) {
    return 'technical_deep_dive';
  // Provider-specific function removed
***REMOVED***args.speakerId === managerSpeakerId) {
    return 'manager_round';
  // Provider-specific function removed
***REMOVED***args.speakerId === observerSpeakerId) {
    return 'observer_followup';
  // Provider-specific function removed
***REMOVED***args.speakerId === hrSpeakerId) {
    return args.trackedPhase === 'opening'
      ? 'opening'
      : args.trackedPhase === 'hr_wrapup'
        ? 'hr_wrap_up'
        : 'hr_followup';
  // Provider-specific function removed

  return mapInterviewPhaseStateToAskPhase(args.minimumPhase);
// Provider-specific function removed

function resolveInterviewAskPhaseFromDirectivePhaseLabel(
  phaseLabel: string,
): InterviewAskPhase | undefined {
  const normalized = phaseLabel.trim().toLowerCase();
***REMOVED***!normalized) {
    return undefined;
  // Provider-specific function removed

  switch (normalized) {
    case 'opening':
    case 'opening_self_introduction':
      return 'opening';
    case 'hr_followup':
    case 'hr followup':
    case 'hr follow-up':
      return 'hr_followup';
    case 'technical':
    case 'technical_deep_dive':
    case 'technical deep dive':
      return 'technical_deep_dive';
    case 'observer':
    case 'observer_followup':
    case 'observer followup':
    case 'observer follow-up':
      return 'observer_followup';
    case 'manager':
    case 'manager_round':
    case 'manager round':
      return 'manager_round';
    case 'hr_wrapup':
    case 'hr_wrap_up':
    case 'hr wrap up':
    case 'wrap_up':
    case 'wrap up':
      return 'hr_wrap_up';
    default:
    ***REMOVED***normalized.includes('technical')) {
        return 'technical_deep_dive';
      // Provider-specific function removed
    ***REMOVED***normalized.includes('observer')) {
        return 'observer_followup';
      // Provider-specific function removed
    ***REMOVED***normalized.includes('manager')) {
        return 'manager_round';
      // Provider-specific function removed
    ***REMOVED***normalized.includes('wrap')) {
        return 'hr_wrap_up';
      // Provider-specific function removed
    ***REMOVED***normalized.includes('opening')) {
        return 'opening';
      // Provider-specific function removed
    ***REMOVED***normalized.includes('hr')) {
        return 'hr_followup';
      // Provider-specific function removed
      return undefined;
  // Provider-specific function removed
// Provider-specific function removed

function resolveInterviewSpeakerIdForPhase(args: {
  roomBlueprint?: Readonly<ChatroomRoomBlueprint>;
  speakerIds: readonly string[];
  phase: InterviewAskPhase;
// Provider-specific function removed): string | undefined {
  switch (args.phase) {
    case 'technical_deep_dive':
      return (
        args.speakerIds[1] ??
        resolveInterviewSpeakerId(args.roomBlueprint, 'technical_interviewer', 1) ??
        'interview-technical'
      );
    case 'observer_followup':
      return (
        args.speakerIds[3] ??
        resolveInterviewSpeakerId(args.roomBlueprint, 'panel_observer', 3) ??
        'interview-observer'
      );
    case 'manager_round':
      return (
        args.speakerIds[2] ??
        resolveInterviewSpeakerId(args.roomBlueprint, 'manager_interviewer', 2) ??
        'interview-manager'
      );
    case 'opening':
    case 'hr_followup':
    case 'hr_wrap_up':
    default:
      return (
        args.speakerIds[0] ??
        resolveInterviewSpeakerId(args.roomBlueprint, 'hr_interviewer', 0) ??
        'interview-hr'
      );
  // Provider-specific function removed
// Provider-specific function removed

function resolveInterviewFallbackSpeakerId(speakerIds: readonly string[]): string {
  return speakerIds[0] ?? speakerIds[1] ?? speakerIds[2] ?? speakerIds[3] ?? 'interview-hr';
// Provider-specific function removed

function buildInterviewPhaseControlFocus(phase: InterviewAskPhase): string {
  switch (phase) {
    case 'opening':
      return 'Ask a concise opening question and let the candidate establish context for later follow-up.';
    case 'hr_followup':
      return 'Stay on hiring-signal follow-up around motivation, communication, resume consistency, or role fit.';
    case 'technical_deep_dive':
      return 'Stay on the technical evidence thread and close the most important implementation or tradeoff gap.';
    case 'observer_followup':
      return 'Use one precise observer follow-up to close the sharpest remaining evidence gap.';
    case 'manager_round':
      return 'Move to a manager-style question around ownership, prioritization, tradeoffs, and collaboration.';
    case 'hr_wrap_up':
      return 'Wrap up the interview with motivation, role fit, and space for the candidate to ask final questions.';
    default:
      return 'Advance the interview to the requested stage and continue with one focused question.';
  // Provider-specific function removed
// Provider-specific function removed

function mapInterviewPhaseStateToAskPhase(phase: InterviewPhaseState): InterviewAskPhase {
  switch (phase) {
    case 'opening':
      return 'opening';
    case 'technical':
      return 'technical_deep_dive';
    case 'observer':
      return 'observer_followup';
    case 'manager':
      return 'manager_round';
    case 'hr_wrapup':
    case 'complete':
      return 'hr_wrap_up';
    case 'hr_followup':
    default:
      return 'hr_followup';
  // Provider-specific function removed
// Provider-specific function removed

function resolveInterviewRoomAdminRetryFocus(
  responseMode: InterviewPendingCandidateReplyState['responseMode'],
): string {
  return responseMode === 'clarify'
    ? DEFAULT_ROOM_ADMIN_CLARIFY_RETRY_FOCUS
    : DEFAULT_ROOM_ADMIN_NEW_ANGLE_RETRY_FOCUS;
// Provider-specific function removed

function resolveInterviewSpeakerId(
  roomBlueprint: Readonly<ChatroomRoomBlueprint> | undefined,
  role: string,
  fallbackIndex: number,
): string | undefined {
  return (
    roomBlueprint?.participantSlots.find(
      (slot) => slot.participantType === 'agent' && slot.metadata?.role === role,
    )?.speakerId ?? roomBlueprint?.speakerIds[fallbackIndex]
  );
// Provider-specific function removed
