import type { ChatroomFinalSummary, InterviewSummary // Provider-specific function removed from '../../agents/schemas.js';
import type { ChatroomMessage // Provider-specific function removed from '../../room-core/message-types.js';
import {
  type InterviewAnswerCoverageAssessment,
  type InterviewCandidateTurnKind,
  countInterviewCandidateReplies,
  findLatestInterviewerPrompt,
  findLatestInterviewerPromptBeforeMessage,
  getLatestInterviewCandidateTurnState,
  inferInterviewStatusFromMessages,
  isInterviewMetaContent,
  MIN_CANDIDATE_REPLIES_FOR_COMPLETION,
// Provider-specific function removed from './interview-room-utils.js';

export type InterviewPhaseState =
  | 'opening'
  | 'hr_followup'
  | 'technical'
  | 'observer'
  | 'manager'
  | 'hr_wrapup'
  | 'complete';

export type InterviewAskPhase =
  | 'opening'
  | 'hr_followup'
  | 'technical_deep_dive'
  | 'observer_followup'
  | 'manager_round'
  | 'hr_wrap_up';

export type InterviewPendingCandidateReplyResponseMode = 'new_question' | 'clarify';
export type InterviewCompletionStatus = Extract<
  InterviewSummary['interviewStatus'],
  'complete' | 'aborted'
>;

export type InterviewPendingCandidateReplyState = {
  promptMessageId: string;
  speakerId: string;
  round: number;
  responseMode: InterviewPendingCandidateReplyResponseMode;
// Provider-specific function removed;

export type ResolvedInterviewTurnPlan =
  | {
      kind: 'ask';
      phase: InterviewAskPhase;
      stageLabel: string;
      speakerId: string;
      focus: string;
      reason: string;
      responseMode: InterviewPendingCandidateReplyResponseMode;
    // Provider-specific function removed
  | {
      kind: 'wait';
      reason: string;
    // Provider-specific function removed
  | {
      kind: 'complete';
      reason: string;
      terminalStatus: InterviewCompletionStatus;
    // Provider-specific function removed;

export type ResolvedInterviewAskTurnPlan = Extract<ResolvedInterviewTurnPlan, { kind: 'ask' // Provider-specific function removed>;

export interface InterviewStageCounts {
  hr: number;
  technical: number;
  observer: number;
  manager: number;
// Provider-specific function removed

export interface InterviewControllerStateSnapshot {
  messages: readonly ChatroomMessage[];
  finalSummary?: ChatroomFinalSummary;
  interviewCurrentPhase?: InterviewPhaseState;
  interviewPendingCandidateReply?: InterviewPendingCandidateReplyState;
  interviewTerminalStatus?: Extract<InterviewSummary['interviewStatus'], 'aborted'>;
// Provider-specific function removed

export type InterviewStageLabelResolver = (phase: InterviewAskPhase) => string;

const INTERVIEW_PHASE_ORDER: readonly InterviewPhaseState[] = [
  'opening',
  'hr_followup',
  'technical',
  'observer',
  'manager',
  'hr_wrapup',
  'complete',
];

const INTERVIEW_ASK_PHASE_TO_STATE_PHASE: Record<
  InterviewAskPhase,
  Exclude<InterviewPhaseState, 'complete'>
> = {
  opening: 'opening',
  hr_followup: 'hr_followup',
  technical_deep_dive: 'technical',
  observer_followup: 'observer',
  manager_round: 'manager',
  hr_wrap_up: 'hr_wrapup',
// Provider-specific function removed;

function normalizeInterviewPhaseStateValue(value: unknown): InterviewPhaseState | undefined {
  switch (value) {
    case 'opening':
    case 'hr_followup':
    case 'complete':
      return value;
    case 'technical':
    case 'technical_deep_dive':
      return 'technical';
    case 'observer':
    case 'observer_followup':
      return 'observer';
    case 'manager':
    case 'manager_round':
      return 'manager';
    case 'hr_wrapup':
    case 'hr_wrap_up':
      return 'hr_wrapup';
    default:
      return undefined;
  // Provider-specific function removed
// Provider-specific function removed

export function isInterviewWaitingForCandidateReply(
  state: Readonly<InterviewControllerStateSnapshot>,
***REMOVED***
  return Boolean(resolveTrackedInterviewPendingCandidateReplyState(state));
// Provider-specific function removed

export function mapInterviewAskPhaseToStatePhase(
  phase: InterviewAskPhase,
): Exclude<InterviewPhaseState, 'complete'> {
  return INTERVIEW_ASK_PHASE_TO_STATE_PHASE[phase];
// Provider-specific function removed

export function compareInterviewPhaseState(left: InterviewPhaseState, right: InterviewPhaseState): number {
  return INTERVIEW_PHASE_ORDER.indexOf(left) - INTERVIEW_PHASE_ORDER.indexOf(right);
// Provider-specific function removed

export function resolveTrackedInterviewPhaseState(
  state: Readonly<InterviewControllerStateSnapshot>,
): InterviewPhaseState {
  const explicitPhase = normalizeInterviewPhaseStateValue(state.interviewCurrentPhase);
***REMOVED***explicitPhase) {
    return explicitPhase;
  // Provider-specific function removed

  const interviewSummary = getInterviewSummaryFromState(state);
***REMOVED***interviewSummary?.interviewStatus === 'complete') {
    return 'complete';
  // Provider-specific function removed

  const summaryPhase = normalizeInterviewPhaseStateValue(interviewSummary?.currentStage);
***REMOVED***summaryPhase) {
    return summaryPhase;
  // Provider-specific function removed

  const latestQuestionMessage = resolveLatestInterviewQuestionMessage(state.messages);
  const stageCounts = collectInterviewStageCounts(state.messages);
  const candidateReplyCount = countInterviewCandidateReplies(state.messages);

***REMOVED***latestQuestionMessage?.authorId === 'interview-hr' && stageCounts.manager > 0) {
    return 'hr_wrapup';
  // Provider-specific function removed
***REMOVED***stageCounts.manager > 0) {
    return 'manager';
  // Provider-specific function removed
***REMOVED***stageCounts.observer > 0) {
    return 'observer';
  // Provider-specific function removed
***REMOVED***stageCounts.technical > 0) {
    return 'technical';
  // Provider-specific function removed
***REMOVED***stageCounts.hr > 0 && candidateReplyCount > 0) {
    return 'hr_followup';
  // Provider-specific function removed

  return 'opening';
// Provider-specific function removed

export function resolveInterviewStatusFromState(
  state: Readonly<InterviewControllerStateSnapshot>,
): InterviewSummary['interviewStatus'] {
***REMOVED***state.interviewTerminalStatus === 'aborted') {
    return 'aborted';
  // Provider-specific function removed

  const interviewSummary = getInterviewSummaryFromState(state);
***REMOVED***interviewSummary?.interviewStatus === 'aborted') {
    return 'aborted';
  // Provider-specific function removed

  const explicitPhase = normalizeInterviewPhaseStateValue(state.interviewCurrentPhase);
***REMOVED***explicitPhase === 'complete' && !state.interviewPendingCandidateReply) {
    return 'complete';
  // Provider-specific function removed

  const pendingCandidateReply = resolveTrackedInterviewPendingCandidateReplyState(state);
***REMOVED***interviewSummary?.interviewStatus === 'complete') {
    return pendingCandidateReply ? 'in_progress' : 'complete';
  // Provider-specific function removed

***REMOVED***interviewSummary?.interviewStatus) {
    return interviewSummary.interviewStatus;
  // Provider-specific function removed

  return inferInterviewStatusFromMessages(state.messages);
// Provider-specific function removed

export function resolveTrackedInterviewPendingCandidateReplyState(
  state: Readonly<InterviewControllerStateSnapshot>,
): InterviewPendingCandidateReplyState | undefined {
  const explicitPhase = normalizeInterviewPhaseStateValue(state.interviewCurrentPhase);
  const interviewSummary = getInterviewSummaryFromState(state);
***REMOVED***
    explicitPhase === 'complete' ||
    state.interviewTerminalStatus === 'aborted' ||
    interviewSummary?.interviewStatus === 'complete' ||
    interviewSummary?.interviewStatus === 'aborted'
***REMOVED***
    return undefined;
  // Provider-specific function removed

  const latestQuestionMessage = resolveLatestInterviewQuestionMessage(state.messages);
***REMOVED***!latestQuestionMessage || isInterviewTerminalAgentMessage(latestQuestionMessage.content)) {
    return undefined;
  // Provider-specific function removed

  const explicitPending = state.interviewPendingCandidateReply;
***REMOVED***
    explicitPending &&
    explicitPending.promptMessageId === latestQuestionMessage.id &&
    explicitPending.speakerId === latestQuestionMessage.authorId
***REMOVED***
    return explicitPending;
  // Provider-specific function removed

  const latestConversationMessage = findLatestConversationMessage(state.messages);
***REMOVED***!latestConversationMessage) {
    return undefined;
  // Provider-specific function removed

***REMOVED***
    latestConversationMessage.role === 'agent' &&
    isInterviewTerminalAgentMessage(latestConversationMessage.content)
***REMOVED***
    return undefined;
  // Provider-specific function removed

***REMOVED***latestConversationMessage.role === 'user') {
    return createInterviewPendingCandidateReplyState(
      latestQuestionMessage,
      resolveInterviewPendingResponseMode(state.messages),
    );
  // Provider-specific function removed

  return undefined;
// Provider-specific function removed

export function resolveMinimumInterviewPhaseState(
  state: Readonly<InterviewControllerStateSnapshot>,
): InterviewPhaseState {
  const explicitPhase = normalizeInterviewPhaseStateValue(state.interviewCurrentPhase);
***REMOVED***explicitPhase) {
    return explicitPhase;
  // Provider-specific function removed

  const interviewSummary = getInterviewSummaryFromState(state);
***REMOVED***interviewSummary?.interviewStatus === 'complete') {
    return 'complete';
  // Provider-specific function removed

  return 'opening';
// Provider-specific function removed

export function createInterviewPendingCandidateReplyState(
  questionMessage: ChatroomMessage,
  responseMode: InterviewPendingCandidateReplyResponseMode,
): InterviewPendingCandidateReplyState {
  return {
    promptMessageId: questionMessage.id,
    speakerId: questionMessage.authorId,
    round: questionMessage.round,
    responseMode,
  // Provider-specific function removed;
// Provider-specific function removed

export function resolveLatestInterviewQuestionMessage(
  messages: readonly ChatroomMessage[],
): ChatroomMessage | undefined {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const message = messages[i];
  ***REMOVED***
      message &&
      message.role === 'agent' &&
      message.authorId.startsWith('interview-') &&
      !isInterviewMetaContent(message.content) &&
      !isInterviewTerminalAgentMessage(message.content)
  ***REMOVED***
      return message;
    // Provider-specific function removed
  // Provider-specific function removed
  return undefined;
// Provider-specific function removed

export function resolveInterviewPendingResponseMode(
  messages: readonly ChatroomMessage[],
): InterviewPendingCandidateReplyResponseMode {
  return 'new_question';
// Provider-specific function removed

export function collectInterviewStageCounts(
  messages: readonly ChatroomMessage[],
): InterviewStageCounts {
  const counts: InterviewStageCounts = {
    hr: 0,
    technical: 0,
    observer: 0,
    manager: 0,
  // Provider-specific function removed;

  for (const message of messages) {
  ***REMOVED***
      message.role === 'agent' &&
      message.authorId.startsWith('interview-') &&
      !isInterviewMetaContent(message.content) &&
      !isInterviewTerminalAgentMessage(message.content)
  ***REMOVED***
    ***REMOVED***message.authorId === 'interview-hr') {
        counts.hr += 1;
      // Provider-specific function removed else if (message.authorId === 'interview-technical') {
        counts.technical += 1;
      // Provider-specific function removed else if (message.authorId === 'interview-observer') {
        counts.observer += 1;
      // Provider-specific function removed else if (message.authorId === 'interview-manager') {
        counts.manager += 1;
      // Provider-specific function removed
    // Provider-specific function removed
  // Provider-specific function removed

  return counts;
// Provider-specific function removed

export function resolveInterviewCandidateControlPlan(args: {
  candidateReplyCount: number;
  stageCounts: InterviewStageCounts;
  latestCandidateTurnKind: InterviewCandidateTurnKind | undefined;
  latestQuestionMessage: ChatroomMessage | undefined;
  resolveStageLabel: InterviewStageLabelResolver;
  repeatedAnswerCount?: number;
// Provider-specific function removed): ResolvedInterviewTurnPlan | undefined {
  switch (args.latestCandidateTurnKind) {
    case 'withdraw_request':
      return {
        kind: 'complete',
        reason: 'The candidate explicitly asked to end the interview, so the room should stop and move to synthesis.',
        terminalStatus: 'aborted',
      // Provider-specific function removed;
    case 'pause_request':
      return {
        kind: 'wait',
        reason: 'Candidate requested a pause or reconnection window.',
      // Provider-specific function removed;
    case 'clarify_request':
    ***REMOVED***!args.latestQuestionMessage) {
        return undefined;
      // Provider-specific function removed
      return {
        kind: 'ask',
        phase: mapInterviewAskPhaseFromSpeakerId(args.latestQuestionMessage.authorId),
        stageLabel: args.resolveStageLabel(mapInterviewAskPhaseFromSpeakerId(args.latestQuestionMessage.authorId)),
        speakerId: args.latestQuestionMessage.authorId,
        focus: 'Please clarify the question for the candidate.',
        reason: 'Candidate asked for clarification.',
        responseMode: 'clarify',
      // Provider-specific function removed;
    case 'repeat_request':
    ***REMOVED***!args.latestQuestionMessage) {
        return undefined;
      // Provider-specific function removed
      return {
        kind: 'ask',
        phase: mapInterviewAskPhaseFromSpeakerId(args.latestQuestionMessage.authorId),
        stageLabel: args.resolveStageLabel(mapInterviewAskPhaseFromSpeakerId(args.latestQuestionMessage.authorId)),
        speakerId: args.latestQuestionMessage.authorId,
        focus: 'Please repeat or clarify the last question.',
        reason: 'Candidate asked to repeat the question.',
        responseMode: 'clarify',
      // Provider-specific function removed;
    case 'repeated_answer':
    ***REMOVED***(args.repeatedAnswerCount ?? 0) >= 2) {
        return {
          kind: 'complete',
          reason: 'The candidate has repeated the same answer enough times that the interview cannot make progress and should end.',
          terminalStatus: 'aborted',
        // Provider-specific function removed;
      // Provider-specific function removed
      return {
        kind: 'wait',
        reason: 'Candidate repeated the same answer. Waiting for a different response.',
      // Provider-specific function removed;
    case 'other':
      return undefined;
    default:
      return undefined;
  // Provider-specific function removed
// Provider-specific function removed

export type InterviewAnswerCoverageAssessmentFromTest = {
  isAdequate: boolean;
  missingCategory?: string;
  followUpFocus?: string;
// Provider-specific function removed;

export type InterviewCandidateTurnFromTest = {
  message: ChatroomMessage | undefined;
  kind: 'answer' | 'other';
// Provider-specific function removed;

export function resolveInterviewInsufficientAnswerPlan(args: {
  candidateReplyCount: number;
  stageCounts: InterviewStageCounts;
  latestCandidateTurn: InterviewCandidateTurnFromTest;
  latestQuestionMessage: ChatroomMessage | undefined;
  latestAnswerCoverage?: InterviewAnswerCoverageAssessmentFromTest;
  consecutiveInadequateAnswerCount: number;
  resolveStageLabel: InterviewStageLabelResolver;
// Provider-specific function removed): ResolvedInterviewTurnPlan | undefined {
***REMOVED***!args.latestCandidateTurn.message || args.latestCandidateTurn.kind !== 'answer') {
    return undefined;
  // Provider-specific function removed

***REMOVED***!args.latestAnswerCoverage || args.latestAnswerCoverage.isAdequate || !args.latestQuestionMessage) {
    return undefined;
  // Provider-specific function removed

***REMOVED***args.consecutiveInadequateAnswerCount >= 2) {
    return undefined;
  // Provider-specific function removed

***REMOVED***args.candidateReplyCount >= 6) {
    return undefined;
  // Provider-specific function removed

  return {
    kind: 'ask',
    phase: mapInterviewAskPhaseFromSpeakerId(args.latestQuestionMessage.authorId),
    stageLabel: args.resolveStageLabel(mapInterviewAskPhaseFromSpeakerId(args.latestQuestionMessage.authorId)),
    speakerId: args.latestQuestionMessage.authorId,
    focus: args.latestAnswerCoverage.followUpFocus ?? 'Ask for more specific details.',
    reason: args.latestAnswerCoverage.missingCategory
      ? `Candidate answer missing ${args.latestAnswerCoverage.missingCategory// Provider-specific function removed details.`
      : 'Candidate answer was insufficient.',
    responseMode: 'new_question',
  // Provider-specific function removed;
// Provider-specific function removed

function mapInterviewAskPhaseFromSpeakerId(speakerId: string): InterviewAskPhase {
***REMOVED***speakerId === 'interview-hr') {
    return 'hr_followup';
  // Provider-specific function removed
***REMOVED***speakerId === 'interview-technical') {
    return 'technical_deep_dive';
  // Provider-specific function removed
***REMOVED***speakerId === 'interview-observer') {
    return 'observer_followup';
  // Provider-specific function removed
***REMOVED***speakerId === 'interview-manager') {
    return 'manager_round';
  // Provider-specific function removed
  return 'hr_followup';
// Provider-specific function removed

function resolveInterviewStageLabelFromSpeakerId(speakerId: string): string {
***REMOVED***speakerId === 'interview-hr') {
    return 'HR Follow-up';
  // Provider-specific function removed
***REMOVED***speakerId === 'interview-technical') {
    return 'Technical Deep Dive';
  // Provider-specific function removed
***REMOVED***speakerId === 'interview-observer') {
    return 'Observer Follow-up';
  // Provider-specific function removed
***REMOVED***speakerId === 'interview-manager') {
    return 'Manager Round';
  // Provider-specific function removed
  return 'Interview';
// Provider-specific function removed

export function getInterviewSummaryFromState(
  state: Readonly<InterviewControllerStateSnapshot>,
): InterviewSummary | undefined {
***REMOVED***state.finalSummary && 'interviewStatus' in state.finalSummary) {
    return state.finalSummary as InterviewSummary;
  // Provider-specific function removed
  return undefined;
// Provider-specific function removed

export function findLatestConversationMessage(
  messages: readonly ChatroomMessage[],
): ChatroomMessage | undefined {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const message = messages[i];
  ***REMOVED***message && (message.role === 'user' || message.role === 'agent')) {
    ***REMOVED***
        message.role === 'agent' &&
        (isInterviewMetaContent(message.content) || isInterviewTerminalAgentMessage(message.content))
    ***REMOVED***
        continue;
      // Provider-specific function removed
      return message;
    // Provider-specific function removed
  // Provider-specific function removed
  return undefined;
// Provider-specific function removed

function isInterviewTerminalAgentMessage(content: string***REMOVED***
  const normalized = content.trim().toLowerCase();
  return (
    normalized.includes('面试结束') ||
    normalized.includes('感谢参加') ||
    normalized.includes('thank you for') ||
    normalized.includes('interview complete') ||
    normalized.includes('今天的面试到此结束')
  );
// Provider-specific function removed