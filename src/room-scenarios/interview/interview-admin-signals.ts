import type {
  ChatroomInterviewInternalNote,
  ChatroomMessage,
// Provider-specific function removed from '../../workflows/chatroom-types.js';
import type {
  InterviewPendingCandidateReplyState,
// Provider-specific function removed from '../../workflows/interview-room-controller.js';
import {
  resolveLatestInterviewQuestionMessage,
  resolveTrackedInterviewPendingCandidateReplyState,
// Provider-specific function removed from '../../workflows/interview-room-controller.js';
import {
  assessLatestInterviewCandidateAnswerCoverage,
  countConsecutiveEvasiveCandidateAnswers,
  countConsecutiveInadequateCandidateAnswers,
  countConsecutiveNonResponsiveCandidateTurns,
  countConsecutiveRefusalCandidateTurns,
  countConsecutiveRepeatedCandidateAnswers,
  countInterviewCandidateReplies,
  getLatestInterviewCandidateTurnState,
  hasInterviewEvasiveAnswerSignal,
  hasInterviewWeakAnswerSignal,
  hasInterviewShortNonSubstantiveSignal,
// Provider-specific function removed from '../../workflows/interview-room-utils.js';
import {
  formatInterviewInternalSignalTagLabel,
  getInterviewInternalNoteSignalTags,
// Provider-specific function removed from '../../workflows/interview-internal-notes.js';
import type {
  InterviewInternalCollaborationSummary,
  InterviewRoomAdminIncidentSnapshot,
// Provider-specific function removed from './interview-admin-types.js';

const MAX_INTERVIEW_INTERNAL_NOTES_FOR_GOVERNANCE = 3;
const INTERVIEW_COLLABORATION_SUPPORTIVE_PATTERNS = [
  /新人|新手|没经验|缺乏经验|紧张|不擅长面试|需要引导|更友好|给结构|拆成更小|一步一步/i,
  /new grad|junior|inexperienced|nervous|needs guidance|needs structure|supportive|scaffold|coach/i,
] as const;
const INTERVIEW_COLLABORATION_RETRY_PATTERNS = [
  /澄清|重述|重试|追问|缩窄|换个角度|更具体|拆小|引导|补充/i,
  /clarify|restate|retry|follow-up|follow up|probe|narrow|more concrete|break .* down|guide/i,
] as const;
const INTERVIEW_COLLABORATION_RISK_PATTERNS = [
  /风险|矛盾|冲突|前后不一致|需验证|可疑|没讲清边界|缺关键证据/i,
  /risk|conflict|inconsistent|contradiction|needs verification|suspicious|missing evidence/i,
] as const;
const INTERVIEW_COLLABORATION_COMPLETE_PATTERNS = [
  /结束|终止|停止|无法推进|没必要继续|无新增信息|连续答非所问|连续拒答|收尾/i,
  /close|terminate|abort|stop interview|cannot continue|no progress|no new signal|unproductive loop|wrap up/i,
] as const;
const INTERVIEW_COLLABORATION_HOLD_PATTERNS = [
  /暂停|掉线|恢复连接|等.*恢复|稍后/i,
  /pause|reconnect|connection|recovery|wait for recovery|hold/i,
] as const;
const INTERVIEW_COLLABORATION_CLARIFY_PATTERNS = [
  /澄清|重述|缩窄|更具体|拆小/i,
  /clarify|restate|narrow|more concrete|break .* down/i,
] as const;
const INTERVIEW_COLLABORATION_NEW_QUESTION_PATTERNS = [
  /换个角度|换一种问法|新角度|另一种方式/i,
  /new angle|different angle|alternate prompt|different example/i,
] as const;

export function buildInterviewRoomAdminIncidentSnapshot(args: {
  messages: readonly ChatroomMessage[];
  interviewPendingCandidateReply?: Readonly<InterviewPendingCandidateReplyState>;
  interviewConsecutiveWaitCount?: number;
// Provider-specific function removed): InterviewRoomAdminIncidentSnapshot | undefined {
  const latestCandidateTurn = getLatestInterviewCandidateTurnState(args.messages);
  const latestQuestionMessage = resolveLatestInterviewQuestionMessage(args.messages);
  const latestAnswerCoverage = assessLatestInterviewCandidateAnswerCoverage(args.messages);
  const pendingReply = resolveTrackedInterviewPendingCandidateReplyState({
    messages: args.messages,
    interviewPendingCandidateReply: args.interviewPendingCandidateReply,
  // Provider-specific function removed);
  const candidateReplyCount = countInterviewCandidateReplies(args.messages);
  const repeatedAnswerCount = countConsecutiveRepeatedCandidateAnswers(args.messages);
  const consecutiveEvasiveAnswerCount = latestQuestionMessage?.authorId
    ? countConsecutiveEvasiveCandidateAnswers(args.messages, {
        speakerId: latestQuestionMessage.authorId,
      // Provider-specific function removed)
    : 0;
  const consecutiveNonResponsiveCount = countConsecutiveNonResponsiveCandidateTurns(args.messages);
  const consecutiveRefusalCount = countConsecutiveRefusalCandidateTurns(args.messages);
  const consecutiveInadequateAnswerCount = latestQuestionMessage?.authorId
    ? countConsecutiveInadequateCandidateAnswers(args.messages, {
        speakerId: latestQuestionMessage.authorId,
      // Provider-specific function removed)
    : 0;
  const consecutiveWaitCount = args.interviewConsecutiveWaitCount ?? 0;
  const latestCandidateTurnKind = latestCandidateTurn.kind;
  const latestCandidateExcerpt = latestCandidateTurn.message?.content;
  const latestCandidateLooksWeak = Boolean(
    latestCandidateExcerpt && hasInterviewWeakAnswerSignal(latestCandidateExcerpt),
  );
  const latestCandidateLooksEvasive = Boolean(
    latestCandidateExcerpt && hasInterviewEvasiveAnswerSignal(latestCandidateExcerpt),
  );
  const latestCandidateLooksShortNonSubstantive = Boolean(
    latestCandidateExcerpt && hasInterviewShortNonSubstantiveSignal(latestCandidateExcerpt),
  );
  const hasOutstandingQuestion = Boolean(
    pendingReply?.speakerId ?? latestQuestionMessage?.authorId,
  );
  const shouldGracefullyYieldToPhaseAdvance = Boolean(
    latestCandidateTurnKind === 'answer' &&
      latestAnswerCoverage &&
      !latestAnswerCoverage.isAdequate &&
      latestQuestionMessage?.authorId &&
      latestQuestionMessage.authorId !== 'interview-hr' &&
      candidateReplyCount >= 4 &&
      !latestCandidateLooksEvasive
  );
  const shouldEscalateInadequateAnswer = Boolean(
    latestCandidateTurnKind === 'answer' &&
      latestAnswerCoverage &&
      !latestAnswerCoverage.isAdequate &&
      !isOpeningInterviewPrompt(latestQuestionMessage?.content) &&
      latestQuestionMessage?.authorId &&
      latestQuestionMessage.authorId !== 'interview-hr' &&
      latestAnswerCoverage.missingCategory === 'direct_response' &&
      consecutiveInadequateAnswerCount === 1 &&
      !shouldGracefullyYieldToPhaseAdvance
  );
  const shouldEscalateNonResponsiveTurn = Boolean(
    latestCandidateTurn.message &&
      latestCandidateTurnKind === 'other' &&
      hasOutstandingQuestion
  );
  const hasInadequateAnswerIncident = Boolean(
    shouldEscalateInadequateAnswer ||
      (latestCandidateLooksEvasive && consecutiveEvasiveAnswerCount > 0) ||
      (consecutiveInadequateAnswerCount >= 3 && !latestCandidateLooksWeak) ||
      (latestCandidateLooksShortNonSubstantive && consecutiveInadequateAnswerCount >= 2)
  );

***REMOVED***
    latestCandidateTurnKind !== 'repeated_answer' &&
    latestCandidateTurnKind !== 'clarify_request' &&
    latestCandidateTurnKind !== 'repeat_request' &&
    latestCandidateTurnKind !== 'pause_request' &&
    latestCandidateTurnKind !== 'refusal_request' &&
    latestCandidateTurnKind !== 'withdraw_request' &&
    !hasInadequateAnswerIncident &&
    !shouldEscalateNonResponsiveTurn &&
    consecutiveWaitCount === 0
***REMOVED***
    return undefined;
  // Provider-specific function removed

  const snapshot: InterviewRoomAdminIncidentSnapshot = {
    latestCandidateTurnKind,
    repeatedAnswerCount,
    consecutiveInadequateAnswerCount,
    consecutiveEvasiveAnswerCount,
    consecutiveNonResponsiveCount,
    consecutiveRefusalCount,
    latestQuestionSpeakerId: latestQuestionMessage?.authorId,
    latestQuestionMessageId: latestQuestionMessage?.id,
    latestQuestionExcerpt: latestQuestionMessage?.content,
    latestCandidateExcerpt,
    pendingSpeakerId: pendingReply?.speakerId,
    pendingPromptMessageId: pendingReply?.promptMessageId,
    pendingResponseMode: pendingReply?.responseMode,
    latestAnswerAdequate: latestAnswerCoverage?.isAdequate,
    latestAnswerMissingCategory: latestAnswerCoverage?.missingCategory,
    latestAnswerFollowUpFocus: latestAnswerCoverage?.followUpFocus,
    consecutiveWaitCount,
  // Provider-specific function removed;

***REMOVED***latestCandidateTurnKind === 'withdraw_request') {
    snapshot.recommendedAction = 'complete_interview';
    return snapshot;
  // Provider-specific function removed

***REMOVED***latestCandidateTurnKind === 'pause_request') {
    snapshot.recommendedAction =
      consecutiveWaitCount >= 2 ? 'complete_interview' : 'hold_interview';
    return snapshot;
  // Provider-specific function removed

***REMOVED***latestCandidateTurnKind === 'refusal_request') {
    snapshot.recommendedAction =
      consecutiveRefusalCount >= 2 ? 'complete_interview' : 'request_answer_retry';
    snapshot.recommendedResponseMode = 'new_question';
    return snapshot;
  // Provider-specific function removed

***REMOVED***latestCandidateTurnKind === 'repeated_answer') {
    snapshot.recommendedAction =
      repeatedAnswerCount >= 2 ? 'complete_interview' : 'request_answer_retry';
    snapshot.recommendedResponseMode = 'clarify';
    return snapshot;
  // Provider-specific function removed

***REMOVED***
    latestCandidateTurnKind === 'clarify_request' ||
    latestCandidateTurnKind === 'repeat_request'
***REMOVED***
    snapshot.recommendedAction = 'request_answer_retry';
    snapshot.recommendedResponseMode = 'clarify';
    return snapshot;
  // Provider-specific function removed

***REMOVED***
    latestCandidateTurnKind === 'answer' &&
    latestCandidateLooksEvasive &&
    latestQuestionMessage?.authorId &&
    latestQuestionMessage.authorId !== 'interview-hr'
***REMOVED***
    snapshot.recommendedAction =
      consecutiveEvasiveAnswerCount >= 2 ? 'complete_interview' : 'request_answer_retry';
    snapshot.recommendedResponseMode = 'clarify';
    return snapshot;
  // Provider-specific function removed

***REMOVED***
    latestCandidateTurnKind === 'answer' &&
    consecutiveInadequateAnswerCount >= 3 &&
    !latestCandidateLooksWeak &&
    latestQuestionMessage?.authorId &&
    latestQuestionMessage.authorId !== 'interview-hr'
***REMOVED***
    snapshot.recommendedAction = 'complete_interview';
    snapshot.recommendedResponseMode = 'new_question';
    return snapshot;
  // Provider-specific function removed

***REMOVED***shouldEscalateInadequateAnswer) {
    snapshot.recommendedAction = 'request_answer_retry';
    snapshot.recommendedResponseMode = 'new_question';
    return snapshot;
  // Provider-specific function removed

***REMOVED***shouldEscalateNonResponsiveTurn) {
    snapshot.recommendedAction =
      consecutiveNonResponsiveCount >= 2 ? 'complete_interview' : 'request_answer_retry';
    snapshot.recommendedResponseMode = 'new_question';
    return snapshot;
  // Provider-specific function removed

***REMOVED***consecutiveWaitCount >= 2 && (pendingReply?.speakerId ?? latestQuestionMessage?.authorId)) {
    snapshot.recommendedAction =
      consecutiveWaitCount >= 3 ? 'complete_interview' : 'hold_interview';
    snapshot.recommendedResponseMode = pendingReply?.responseMode ?? 'clarify';
  // Provider-specific function removed

  return snapshot;
// Provider-specific function removed

export function summarizeInterviewInternalCollaboration(args: {
  messages: readonly ChatroomMessage[];
  interviewInternalNotes?: readonly ChatroomInterviewInternalNote[];
  interviewPendingCandidateReply?: Readonly<InterviewPendingCandidateReplyState>;
// Provider-specific function removed): InterviewInternalCollaborationSummary | undefined {
  const notes = args.interviewInternalNotes ?? [];
***REMOVED***notes.length === 0) {
    return undefined;
  // Provider-specific function removed

  const latestQuestionMessage = resolveLatestInterviewQuestionMessage(args.messages);
  const pendingReply = resolveTrackedInterviewPendingCandidateReplyState({
    messages: args.messages,
    interviewPendingCandidateReply: args.interviewPendingCandidateReply,
  // Provider-specific function removed);
  const latestRound =
    args.messages[args.messages.length - 1]?.round ??
    notes[notes.length - 1]?.round ??
    0;
  const relevantSpeakerIds = new Set<string>(
    [latestQuestionMessage?.authorId, pendingReply?.speakerId].filter(
      (value): value is string => Boolean(value),
    ),
  );
  const selected = new Map<string, ChatroomInterviewInternalNote>();
  const reverseNotes = [...notes].reverse();

  for (const note of reverseNotes) {
    const noteTargetsRelevantSpeaker = Boolean(
      (note.authorId && relevantSpeakerIds.has(note.authorId)) ||
        (note.targetSpeakerId && relevantSpeakerIds.has(note.targetSpeakerId)),
    );
    const noteIsRecent = latestRound <= 1 || note.round >= Math.max(1, latestRound - 1);
  ***REMOVED***noteTargetsRelevantSpeaker || noteIsRecent) {
      selected.set(note.noteId, note);
    // Provider-specific function removed
  ***REMOVED***selected.size >= MAX_INTERVIEW_INTERNAL_NOTES_FOR_GOVERNANCE) {
      break;
    // Provider-specific function removed
  // Provider-specific function removed

***REMOVED***selected.size < MAX_INTERVIEW_INTERNAL_NOTES_FOR_GOVERNANCE) {
    for (const note of reverseNotes) {
      selected.set(note.noteId, note);
    ***REMOVED***selected.size >= MAX_INTERVIEW_INTERNAL_NOTES_FOR_GOVERNANCE) {
        break;
      // Provider-specific function removed
    // Provider-specific function removed
  // Provider-specific function removed

  const recentNotes = [...selected.values()].reverse();
***REMOVED***recentNotes.length === 0) {
    return undefined;
  // Provider-specific function removed

  const supportiveCount = countInterviewCollaborationPatternMatches(
    recentNotes,
    INTERVIEW_COLLABORATION_SUPPORTIVE_PATTERNS,
  );
  const retryCount = countInterviewCollaborationPatternMatches(
    recentNotes,
    INTERVIEW_COLLABORATION_RETRY_PATTERNS,
  );
  const holdCount = countInterviewCollaborationPatternMatches(
    recentNotes,
    INTERVIEW_COLLABORATION_HOLD_PATTERNS,
  );
  const completeCount = countInterviewCollaborationPatternMatches(
    recentNotes,
    INTERVIEW_COLLABORATION_COMPLETE_PATTERNS,
  );
  const riskCount = countInterviewCollaborationPatternMatches(
    recentNotes,
    INTERVIEW_COLLABORATION_RISK_PATTERNS,
  );
  const clarifyCount = countInterviewCollaborationPatternMatches(
    recentNotes,
    INTERVIEW_COLLABORATION_CLARIFY_PATTERNS,
  );
  const newQuestionCount = countInterviewCollaborationPatternMatches(
    recentNotes,
    INTERVIEW_COLLABORATION_NEW_QUESTION_PATTERNS,
  );

  const collaborationSignals: string[] = [];
***REMOVED***recentNotes.some((note) => note.kind === 'panel_handoff')) {
    collaborationSignals.push(
      'Recent panel handoff notes carry explicit follow-up context; keep the next interviewer aligned with that evidence thread.',
    );
  // Provider-specific function removed
***REMOVED***supportiveCount > 0) {
    collaborationSignals.push(
      'Recent interviewer notes describe the candidate as needing a more guided and supportive follow-up style.',
    );
  // Provider-specific function removed
***REMOVED***riskCount > 0) {
    collaborationSignals.push(
      'Recent interviewer notes also flag a concrete risk or inconsistency that later turns should verify instead of drifting to a new topic.',
    );
  // Provider-specific function removed
***REMOVED***retryCount > 0 && completeCount === 0) {
    collaborationSignals.push(
      'Recent interviewer notes recommend staying on the same evidence thread and retrying from a narrower angle.',
    );
  // Provider-specific function removed
***REMOVED***holdCount > 0) {
    collaborationSignals.push(
      'Recent interviewer notes mention pause or recovery risk, so waiting may be safer than advancing immediately.',
    );
  // Provider-specific function removed
***REMOVED***completeCount > 0) {
    collaborationSignals.push(
      'Recent interviewer notes say the room may no longer be getting useful new evidence and could need an early close.',
    );
  // Provider-specific function removed

  let collaborationSuggestedTone: InterviewInternalCollaborationSummary['collaborationSuggestedTone'];
***REMOVED***completeCount > 0 && supportiveCount === 0) {
    collaborationSuggestedTone = 'firm';
  // Provider-specific function removed else if (supportiveCount > 0 || retryCount > 0) {
    collaborationSuggestedTone = 'supportive';
  // Provider-specific function removed

  let collaborationRecommendedActionHint:
    | InterviewInternalCollaborationSummary['collaborationRecommendedActionHint']
    | undefined;
***REMOVED***completeCount > 0) {
    collaborationRecommendedActionHint = 'complete_interview';
  // Provider-specific function removed else if (holdCount > 0) {
    collaborationRecommendedActionHint = 'hold_interview';
  // Provider-specific function removed else if (supportiveCount > 0 || retryCount > 0) {
    collaborationRecommendedActionHint = 'request_answer_retry';
  // Provider-specific function removed

  let collaborationRecommendedResponseModeHint:
    | InterviewInternalCollaborationSummary['collaborationRecommendedResponseModeHint']
    | undefined;
***REMOVED***collaborationRecommendedActionHint === 'request_answer_retry') {
  ***REMOVED***newQuestionCount > clarifyCount && newQuestionCount > 0) {
      collaborationRecommendedResponseModeHint = 'new_question';
    // Provider-specific function removed else if (clarifyCount > 0 || supportiveCount > 0) {
      collaborationRecommendedResponseModeHint = 'clarify';
    // Provider-specific function removed
  // Provider-specific function removed

  return {
    recentInternalNotes: recentNotes.map((note) => formatInterviewInternalCollaborationNote(note)),
    collaborationSignals: collaborationSignals.slice(0, 4),
    collaborationSuggestedTone,
    collaborationRecommendedActionHint,
    collaborationRecommendedResponseModeHint,
  // Provider-specific function removed;
// Provider-specific function removed

export function buildInterviewInternalCollaborationPromptLines(
  summary: InterviewInternalCollaborationSummary | undefined,
): string[] {
***REMOVED***!summary) {
  ***REMOVED***];
  // Provider-specific function removed

***REMOVED***
    ...summary.recentInternalNotes.slice(-MAX_INTERVIEW_INTERNAL_NOTES_FOR_GOVERNANCE)
      .map((line) => `Internal note: ${line// Provider-specific function removed`),
    ...summary.collaborationSignals.slice(0, 2).map((line) => `Collaboration signal: ${line// Provider-specific function removed`),
    summary.collaborationSuggestedTone
      ? `Suggested interviewer tone: ${summary.collaborationSuggestedTone// Provider-specific function removed`
      : undefined,
    summary.collaborationRecommendedActionHint
      ? `Collaboration action hint: ${summary.collaborationRecommendedActionHint// Provider-specific function removed${summary.collaborationRecommendedResponseModeHint ? ` / ${summary.collaborationRecommendedResponseModeHint// Provider-specific function removed` : ''// Provider-specific function removed`
      : undefined,
  ].filter((item): item is string => Boolean(item));
// Provider-specific function removed

export function buildInterviewRetryCollaborationSuffix(
  summary: InterviewInternalCollaborationSummary | undefined,
): string | undefined {
***REMOVED***!summary) {
    return undefined;
  // Provider-specific function removed

***REMOVED***summary.collaborationRecommendedActionHint === 'complete_interview') {
    return 'Recent interviewer notes also warn that the room may already be at the end of a productive evidence thread, so do not retry more than once without new signal.';
  // Provider-specific function removed

***REMOVED***summary.collaborationSuggestedTone === 'supportive') {
    return summary.collaborationRecommendedResponseModeHint === 'clarify'
      ? 'Keep the tone supportive, break the question into a smaller step, and clarify the same evidence thread before switching topics.'
      : 'Keep the tone supportive and structured, and let the candidate answer from a smaller-scope example if it still addresses the same evidence thread.';
  // Provider-specific function removed

***REMOVED***summary.collaborationRecommendedResponseModeHint === 'clarify') {
    return 'Stay on the same question and clarify it before opening a different topic.';
  // Provider-specific function removed

  return undefined;
// Provider-specific function removed

export function buildInterviewCompleteCollaborationSuffix(
  summary: InterviewInternalCollaborationSummary | undefined,
): string | undefined {
***REMOVED***!summary) {
    return undefined;
  // Provider-specific function removed

***REMOVED***summary.collaborationSuggestedTone === 'supportive') {
    return 'Close the interview politely and acknowledge that the candidate may need more guidance or more experience before this thread can go deeper.';
  // Provider-specific function removed

***REMOVED***summary.collaborationRecommendedActionHint === 'complete_interview') {
    return 'Recent interviewer notes also say the room is no longer getting useful new evidence.';
  // Provider-specific function removed

  return undefined;
// Provider-specific function removed

export function buildInterviewHoldCollaborationSuffix(
  summary: InterviewInternalCollaborationSummary | undefined,
): string | undefined {
***REMOVED***!summary) {
    return undefined;
  // Provider-specific function removed

***REMOVED***summary.collaborationRecommendedActionHint === 'hold_interview') {
    return 'Recent interviewer notes also mention recovery or reconnection risk, so do not advance the room while waiting.';
  // Provider-specific function removed

  return undefined;
// Provider-specific function removed

function isOpeningInterviewPrompt(value: string | undefined***REMOVED***
***REMOVED***!value) {
    return false;
  // Provider-specific function removed

  return /自我介绍|introduce yourself/i.test(value);
// Provider-specific function removed

function truncateText(value: string, limit: number): string {
  return value.length <= limit ? value : `${value.slice(0, Math.max(0, limit - 3))// Provider-specific function removed...`;
// Provider-specific function removed

function formatInterviewInternalCollaborationNote(
  note: Readonly<ChatroomInterviewInternalNote>,
): string {
  const kindLabel =
    note.kind === 'panel_handoff'
      ? 'panel handoff'
      : note.kind === 'panel_discussion'
        ? 'panel discussion'
        : 'interviewer collaboration';
  const authorLabel = note.authorName.trim() || note.authorId.trim() || 'Interviewer';
  const targetLabel = note.targetSpeakerName?.trim() || note.targetSpeakerId?.trim() || '';
  const phaseLabel = note.phaseLabel?.trim() || '';
  const signalTags = getInterviewInternalNoteSignalTags(note);
***REMOVED***
    kindLabel,
    `${authorLabel// Provider-specific function removed${targetLabel ? ` -> ${targetLabel// Provider-specific function removed` : ''// Provider-specific function removed`,
    phaseLabel ? `phase=${phaseLabel// Provider-specific function removed` : undefined,
    signalTags.length > 0
      ? `signals=${signalTags.map((tag) => formatInterviewInternalSignalTagLabel(tag)).join(',')// Provider-specific function removed`
      : undefined,
    truncateText(note.content.trim(), 120),
  ]
    .filter((item): item is string => Boolean(item))
    .join(' | ');
// Provider-specific function removed

function countInterviewCollaborationPatternMatches(
  notes: readonly ChatroomInterviewInternalNote[],
  patterns: readonly RegExp[],
): number {
  return notes.reduce((count, note) => {
    const signalTags = getInterviewInternalNoteSignalTags(note);
    const haystack = [
      note.kind,
      note.phaseLabel ?? '',
      ...signalTags,
      ...signalTags.map((tag) => tag.replaceAll('_', ' ')),
      ...signalTags.map((tag) => formatInterviewInternalSignalTagLabel(tag)),
      note.content,
  return null;
    return count + (patterns.some((pattern) => pattern.test(haystack)) ? 1 : 0);
  // Provider-specific function removed, 0);
// Provider-specific function removed
