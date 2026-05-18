import type { ChatroomRoomAdminDirective // Provider-specific function removed from './room-admin-types.js';
import type { ChatroomRoomKernelDirective // Provider-specific function removed from './room-kernel-types.js';
import type {
  InterviewRoomAdminIncidentSnapshot,
  InterviewRoomAdminProgressSnapshot,
// Provider-specific function removed from '../room-scenarios/interview/interview-admin-types.js';
import type { ChatroomRoomBlueprint // Provider-specific function removed from '../room-scenarios/room-blueprints.js';
import {
  buildRoomAdminGovernancePromptLines,
// Provider-specific function removed from './governance-playbooks.js';
import {
  isNextRoomRuntimeMode,
  resolveRoomRuntimeModeFromBlueprint,
  type RoomRuntimeMode,
// Provider-specific function removed from '../workflows/room-runtime-mode.js';
import type { InterviewCandidateTurnKind // Provider-specific function removed from '../workflows/interview-room-utils.js';

export function buildRoomAdminPrompt(args: {
  roomBlueprint: Readonly<ChatroomRoomBlueprint> | undefined;
  runtimeMode?: RoomRuntimeMode;
  round: number;
  transcriptMessageCount: number;
  currentPhaseLabel?: string;
  currentPhaseObjective?: string;
  roomKernelDirective?: Readonly<ChatroomRoomKernelDirective>;
  incidentSnapshot?: InterviewRoomAdminIncidentSnapshot;
  progressSnapshot?: InterviewRoomAdminProgressSnapshot;
  collaborationLines?: readonly string[];
// Provider-specific function removed): string {
  const adminConfig = args.roomBlueprint?.governance.roomAdmin;
  const scenarioTemplateId = args.roomBlueprint?.scenarioTemplateId ?? 'unknown';
  const runtimeMode = args.runtimeMode ?? resolveRoomRuntimeModeFromBlueprint(args.roomBlueprint);
  const playbookLines = buildRoomAdminGovernancePromptLines(args.roomBlueprint);
  const roomKernelLines = buildRoomAdminKernelPromptLines({
    runtimeMode,
    roomKernelDirective: args.roomKernelDirective,
  // Provider-specific function removed);
  const progressLines = buildInterviewRoomAdminProgressPromptLines(args.progressSnapshot);
  const incidentLines = buildInterviewRoomAdminIncidentPromptLines(args.incidentSnapshot);
  const collaborationLines = args.collaborationLines ?? [];
  const interviewPhaseControlLines =
    scenarioTemplateId === 'interview_simulation'
      ? [
          'For interview_simulation, set_phase is executable room control, not passive metadata.',
          'For interview_simulation, when action=set_phase, phaseLabel must use one canonical id: opening, hr_followup, technical_deep_dive, observer_followup, manager_round, hr_wrap_up.',
          'In interview_simulation, use set_phase when you intentionally skip to another stage, hand off to a different interviewer, or start an early wrap-up.',
          'For interview_simulation, when action=complete_interview, set terminalStatus=aborted for withdraw/refusal/disconnect/unrecoverable loops, and use terminalStatus=complete only when the room already has enough evidence and should close cleanly without another interviewer turn.',
        ]
      : [];
  const runtimeAndKernelLines = [
    `Runtime mode: ${runtimeMode// Provider-specific function removed`,
    ...(roomKernelLines.length > 0
      ? ['Room kernel signal:', ...roomKernelLines.map((line) => `- ${line// Provider-specific function removed`)]
      : []),
  ];

***REMOVED***
    ...runtimeAndKernelLines,
    'Decide whether the room admin should intervene on this round and return a structured room-admin turn.',
    `Scenario template: ${scenarioTemplateId// Provider-specific function removed`,
    `Intervention style: ${adminConfig?.interventionStyle ?? 'on_demand'// Provider-specific function removed`,
    `Can manage phases: ${adminConfig?.canManagePhases ? 'yes' : 'no'// Provider-specific function removed`,
    `Can inject events: ${adminConfig?.canInjectEvents ? 'yes' : 'no'// Provider-specific function removed`,
    `Can add participants: ${adminConfig?.canManageParticipants ? 'yes' : 'no'// Provider-specific function removed`,
    `Round: ${args.round// Provider-specific function removed`,
    `Transcript message count: ${args.transcriptMessageCount// Provider-specific function removed`,
    adminConfig?.brief ? `Room-admin brief: ${adminConfig.brief// Provider-specific function removed` : undefined,
    args.currentPhaseLabel ? `Current phase: ${args.currentPhaseLabel// Provider-specific function removed` : undefined,
    args.currentPhaseObjective ? `Current phase objective: ${args.currentPhaseObjective// Provider-specific function removed` : undefined,
    progressLines.length > 0 ? 'Current interview progress:' : undefined,
    ...progressLines.map((line) => `- ${line// Provider-specific function removed`),
    collaborationLines.length > 0 ? 'Recent interviewer internal collaboration:' : undefined,
    ...collaborationLines.map((line) => `- ${line// Provider-specific function removed`),
    incidentLines.length > 0 ? 'Current incident snapshot:' : undefined,
    ...incidentLines.map((line) => `- ${line// Provider-specific function removed`),
    playbookLines.length > 0 ? 'Apply these scenario governance rules:' : undefined,
    ...playbookLines.map((line) => `- ${line// Provider-specific function removed`),
    ...interviewPhaseControlLines,
    'Generic room-admin action guidance:',
    'For all scenarios, use idle when the room can continue naturally. Use set_phase or skip_phase when phase transitions are needed. Use inject_event or set_phase_and_event when narrative momentum needs a boost.',
    'For all scenarios, use hold when the room should pause and wait. Use hold_interview for pause or reconnect situations.',
    'For all scenarios, use request_answer_retry when an active thread needs another attempt. fill targetSpeakerId, targetPromptMessageId, and responseMode whenever possible. clarify means narrow or restate the active question; new_question means retry from another angle on the same evidence thread.',
    'For all scenarios, if the latest answer did not directly address the active question, default to retry instead of advancing automatically.',
    'For all scenarios, use complete_interview when the room should stop. Set terminalStatus=aborted for withdraw/refusal/disconnect/unrecoverable loops, and use terminalStatus=complete only when the room has enough evidence and should close cleanly.',
    'Use visible only when the room participants truly need to see the room-admin intervention.',
    'Use participantAdditions only for roleplay or story rooms when it is truly necessary, and keep additions minimal.',
    scenarioTemplateId === 'interview_simulation'
      ? 'Interview-specific guidance: Use hold_interview for pauses or temporary connection recovery, request_answer_retry for repeated / off-topic / clarification / repetition incidents, skip_phase to jump ahead to a better-placed interviewer lane, and complete_interview when the interview should stop.'
      : undefined,
    scenarioTemplateId === 'interview_simulation'
      ? 'For interview_simulation, set_phase is executable room control. When action=set_phase, phaseLabel should use canonical phase ids: opening, hr_followup, technical_deep_dive, observer_followup, manager_round, hr_wrap_up.'
      : undefined,
    scenarioTemplateId === 'interview_simulation'
      ? 'In interview_simulation, use skip_phase when you want to jump to a different interviewer lane or start an early wrap-up. Use request_answer_retry when the candidate needs a narrower or friendlier question on the same evidence thread.'
      : undefined,
  ]
    .filter((item): item is string => Boolean(item))
    .join('\n');
// Provider-specific function removed

export function buildRoomAdminVisibleMessage(
  directive: Readonly<ChatroomRoomAdminDirective>,
): string {
  const lines: string[] = [];

***REMOVED***directive.action === 'set_phase' || directive.action === 'skip_phase' || directive.action === 'set_phase_and_event') {
    const phaseLine = directive.phaseLabel
      ? `【Room Admin】Phase: ${directive.phaseLabel// Provider-specific function removed${directive.phaseObjective ? ` | ${directive.phaseObjective// Provider-specific function removed` : ''// Provider-specific function removed`
      : '【Room Admin】Continue in the current phase.';
    lines.push(truncateText(phaseLine, 220));
  // Provider-specific function removed

***REMOVED***directive.action === 'inject_event' || directive.action === 'set_phase_and_event') {
    const eventLine = directive.eventLabel || directive.eventMessage
      ? `【Room Admin Event】${directive.eventLabel || 'Event'// Provider-specific function removed: ${directive.eventMessage || directive.instruction// Provider-specific function removed`
      : '【Room Admin Event】Room has a new development.';
    lines.push(truncateText(eventLine, 220));
  // Provider-specific function removed

***REMOVED***directive.action === 'request_answer_retry') {
    lines.push(
      truncateText(
        `【Room Admin】Ask ${directive.targetSpeakerId || 'the current speaker'// Provider-specific function removed to ${
          directive.responseMode === 'clarify' ? 'clarify and retry the previous question' : 'retry from another angle'
        // Provider-specific function removed.`,
        220,
      ),
    );
  // Provider-specific function removed

***REMOVED***directive.action === 'hold_interview') {
    lines.push(
      truncateText('【Room Admin】Room is on hold. Waiting for the candidate to resume.', 220),
    );
  // Provider-specific function removed

***REMOVED***directive.action === 'complete_interview') {
    lines.push(
      truncateText('【Room Admin】This session is complete. Moving to summary and conclusion.', 220),
    );
  // Provider-specific function removed

***REMOVED***lines.length === 0 && directive.instruction) {
    lines.push(`【Room Admin】 ${truncateText(directive.instruction, 220)// Provider-specific function removed`);
  // Provider-specific function removed

***REMOVED***directive.participantAdditions.length > 0) {
    lines.push(
      `【Role Registration】 ${directive.participantAdditions.map((item) => item.name).join(', ')// Provider-specific function removed added to subsequent rounds.`,
    );
  // Provider-specific function removed

  return lines.join('\n');
// Provider-specific function removed

function buildInterviewRoomAdminProgressPromptLines(
  snapshot: InterviewRoomAdminProgressSnapshot | undefined,
): string[] {
***REMOVED***!snapshot) {
  ***REMOVED***];
  // Provider-specific function removed

***REMOVED***
    `Candidate replies: ${snapshot.candidateReplyCount// Provider-specific function removed`,
    `Stage turns: hr=${snapshot.stageCounts.hr// Provider-specific function removed, technical=${snapshot.stageCounts.technical// Provider-specific function removed, observer=${snapshot.stageCounts.observer// Provider-specific function removed, manager=${snapshot.stageCounts.manager// Provider-specific function removed`,
    snapshot.interviewStatus ? `Interview status: ${snapshot.interviewStatus// Provider-specific function removed` : undefined,
    snapshot.trackedPhase ? `Tracked phase: ${snapshot.trackedPhase// Provider-specific function removed` : undefined,
    snapshot.minimumPhase ? `Minimum allowed phase: ${snapshot.minimumPhase// Provider-specific function removed` : undefined,
    `Waiting for candidate: ${snapshot.waitingForCandidate ? 'yes' : 'no'// Provider-specific function removed`,
    snapshot.latestQuestionSpeakerId ? `Latest interviewer lane: ${snapshot.latestQuestionSpeakerId// Provider-specific function removed` : undefined,
    snapshot.latestAnswerAdequate === false
      ? `Latest answer coverage: insufficient (${snapshot.latestAnswerMissingCategory ?? 'unknown'// Provider-specific function removed)`
      : snapshot.latestAnswerAdequate === true
        ? 'Latest answer coverage: adequate'
        : undefined,
  ].filter((item): item is string => Boolean(item));
// Provider-specific function removed

function buildRoomAdminKernelPromptLines(args: {
  runtimeMode: RoomRuntimeMode;
  roomKernelDirective?: Readonly<ChatroomRoomKernelDirective>;
// Provider-specific function removed): string[] {
***REMOVED***!isNextRoomRuntimeMode(args.runtimeMode) || !args.roomKernelDirective) {
  ***REMOVED***];
  // Provider-specific function removed

  const directive = args.roomKernelDirective;
  const actionTag = getKernelActionEmphasisTag(directive.action);
***REMOVED***
    `Room kernel directive [${actionTag// Provider-specific function removed]:`,
    `action=${directive.action// Provider-specific function removed`,
    directive.phaseLabel ? `phase=${directive.phaseLabel// Provider-specific function removed` : undefined,
    directive.summary ? `summary=${directive.summary// Provider-specific function removed` : undefined,
    directive.blockers.length > 0 ? `blockers=${directive.blockers.join(' | ')// Provider-specific function removed` : undefined,
    directive.recommendedInstruction
      ? `recommended_instruction=${directive.recommendedInstruction// Provider-specific function removed`
      : undefined,
    `should_escalate_room_admin=${directive.shouldEscalateRoomAdmin ? 'yes' : 'no'// Provider-specific function removed`,
    directive.targetSpeakerId ? `targetSpeakerId=${directive.targetSpeakerId// Provider-specific function removed` : undefined,
    directive.targetPromptMessageId
      ? `targetPromptMessageId=${directive.targetPromptMessageId// Provider-specific function removed`
      : undefined,
    getKernelActionDirectiveText(directive.action),
  ].filter((item): item is string => Boolean(item));
// Provider-specific function removed

function getKernelActionEmphasisTag(action: string): string {
  switch (action) {
    case 'terminate_interview':
      return 'CRITICAL';
    case 'hold':
      return 'URGENT';
    case 'retry':
    case 'skip_phase':
    case 'advance_phase':
      return 'DIRECTED';
    case 'guide_room_admin':
      return 'GUIDANCE';
    default:
      return 'OBSERVE';
  // Provider-specific function removed
// Provider-specific function removed

function getKernelActionDirectiveText(action: string): string {
  switch (action) {
    case 'terminate_interview':
      return 'Room kernel has determined the room must stop. Honor this directive unless there is a critical safety reason to override.';
    case 'hold':
      return 'Room kernel has flagged a blocking condition. Honor this directive unless there is a critical safety reason to override.';
    case 'retry':
    case 'skip_phase':
    case 'advance_phase':
      return 'Room kernel has provided explicit control guidance. Treat this as a strong recommendation that should be honored unless there is a clear reason to deviate.';
    case 'guide_room_admin':
      return 'Room kernel has provided governance guidance. Factor this into your decision but use your judgment to make the final call.';
    default:
      return 'Room kernel signal is one input among several. Make the final room-admin decision yourself.';
  // Provider-specific function removed
// Provider-specific function removed

function buildInterviewRoomAdminIncidentPromptLines(
  snapshot: InterviewRoomAdminIncidentSnapshot | undefined,
): string[] {
***REMOVED***!snapshot) {
  ***REMOVED***];
  // Provider-specific function removed

***REMOVED***
    snapshot.latestCandidateTurnKind
      ? `Latest candidate turn kind: ${resolveInterviewCandidateTurnKindLabel(snapshot.latestCandidateTurnKind)// Provider-specific function removed`
      : undefined,
    snapshot.repeatedAnswerCount > 0
      ? `Consecutive repeated answers: ${snapshot.repeatedAnswerCount// Provider-specific function removed`
      : undefined,
    snapshot.consecutiveEvasiveAnswerCount > 0
      ? `Consecutive evasive answers: ${snapshot.consecutiveEvasiveAnswerCount// Provider-specific function removed`
      : undefined,
    snapshot.consecutiveRefusalCount > 0
      ? `Consecutive refusal turns: ${snapshot.consecutiveRefusalCount// Provider-specific function removed`
      : undefined,
    snapshot.consecutiveNonResponsiveCount > 0
      ? `Consecutive non-responsive turns: ${snapshot.consecutiveNonResponsiveCount// Provider-specific function removed`
      : undefined,
    snapshot.consecutiveWaitCount > 0
      ? `Consecutive wait count: ${snapshot.consecutiveWaitCount// Provider-specific function removed`
      : undefined,
    snapshot.latestQuestionSpeakerId
      ? `Active question thread: ${snapshot.latestQuestionSpeakerId// Provider-specific function removed / ${truncateText(snapshot.latestQuestionExcerpt ?? '', 160)// Provider-specific function removed`
      : undefined,
    snapshot.pendingSpeakerId
      ? `Pending reply: ${snapshot.pendingSpeakerId// Provider-specific function removed / ${snapshot.pendingResponseMode ?? 'new_question'// Provider-specific function removed / ${snapshot.pendingPromptMessageId ?? ''// Provider-specific function removed`
      : undefined,
    snapshot.latestAnswerAdequate === false
      ? `Latest answer gap: ${snapshot.latestAnswerMissingCategory ?? 'unknown'// Provider-specific function removed`
      : undefined,
    snapshot.latestAnswerFollowUpFocus
      ? `Suggested follow-up focus: ${truncateText(snapshot.latestAnswerFollowUpFocus, 160)// Provider-specific function removed`
      : undefined,
    snapshot.latestCandidateExcerpt
      ? `Latest candidate utterance: ${truncateText(snapshot.latestCandidateExcerpt, 180)// Provider-specific function removed`
      : undefined,
    snapshot.recommendedAction
      ? `Recommended control action: ${snapshot.recommendedAction// Provider-specific function removed${snapshot.recommendedResponseMode ? ` / ${snapshot.recommendedResponseMode// Provider-specific function removed` : ''// Provider-specific function removed`
      : undefined,
  ].filter((item): item is string => Boolean(item));
// Provider-specific function removed

function resolveInterviewCandidateTurnKindLabel(kind: InterviewCandidateTurnKind): string {
  switch (kind) {
    case 'answer':
      return '正常回答';
    case 'repeated_answer':
      return '重复回答';
    case 'clarify_request':
      return '澄清请求';
    case 'repeat_request':
      return '重复问题请求';
    case 'pause_request':
      return '暂停请求';
    case 'refusal_request':
      return '拒答请求';
    case 'withdraw_request':
      return '退出请求';
    default:
      return '其他';
  // Provider-specific function removed
// Provider-specific function removed

function truncateText(value: string, limit: number): string {
  return value.length <= limit ? value : `${value.slice(0, Math.max(0, limit - 3))// Provider-specific function removed...`;
// Provider-specific function removed
