import { randomUUID // Provider-specific function removed from 'node:crypto';

import type {
  ChatroomFinalSummary,
  FinalSummary,
  InterviewSummary,
// Provider-specific function removed from '../agents/schemas.js';
import type {
  RoomBlueprintGovernanceConfig,
  RoomRecorderUpdateMode,
// Provider-specific function removed from '../room-scenarios/room-blueprints.js';
import type {
  ChatroomRecorderCheckpoint,
  ChatroomRecorderState,
  ChatroomRecorderSummaryKind,
// Provider-specific function removed from './room-recorder-types.js';
import type { RoomScenarioTemplateId // Provider-specific function removed from '../room-scenarios/scenario-templates.js';

const MAX_RECORDER_CHECKPOINTS = 24;

export function createChatroomRecorderUpdate(args: {
  currentState?: Readonly<ChatroomRecorderState>;
  summary: ChatroomFinalSummary | undefined;
  governance: Readonly<RoomBlueprintGovernanceConfig> | undefined;
  scenarioTemplateId: RoomScenarioTemplateId | undefined;
  round: number;
  transcriptMessageCount: number;
  now?: string;
// Provider-specific function removed): {
  recorderState?: ChatroomRecorderState;
  visibleMessage?: string;
// Provider-specific function removed {
  const recorderConfig = args.governance?.recorder;
***REMOVED***!recorderConfig?.enabled || !args.summary) {
    return {
      recorderState: args.currentState ? structuredClone(args.currentState) : undefined,
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***
    !shouldPersistRecorderCheckpoint(
      recorderConfig.updateMode,
      args.scenarioTemplateId,
      args.summary,
    )
***REMOVED***
    return {
      recorderState: args.currentState ? structuredClone(args.currentState) : undefined,
    // Provider-specific function removed;
  // Provider-specific function removed

  const digest = summarizeRecorderOutput(args.summary);
***REMOVED***!digest.headline) {
    return {
      recorderState: args.currentState ? structuredClone(args.currentState) : undefined,
    // Provider-specific function removed;
  // Provider-specific function removed

  const previousState = args.currentState
    ? {
        schemaVersion: 1 as const,
        lastUpdatedAt: args.currentState.lastUpdatedAt,
        entries: [...args.currentState.entries],
      // Provider-specific function removed
    : createEmptyRecorderState(args.now);
  const previousEntry = previousState.entries[previousState.entries.length - 1];

***REMOVED***
    previousEntry &&
    previousEntry.transcriptMessageCount === args.transcriptMessageCount &&
    previousEntry.round === args.round &&
    previousEntry.headline === digest.headline
***REMOVED***
    return {
      recorderState: previousState,
      visibleMessage:
        recorderConfig.updateMode === 'continuous'
          ? buildRecorderVisibleMessage(previousEntry)
          : undefined,
    // Provider-specific function removed;
  // Provider-specific function removed

  const publishedToRoom = recorderConfig.updateMode === 'continuous';
  const checkpoint: ChatroomRecorderCheckpoint = {
    schemaVersion: 1,
    checkpointId: randomUUID(),
    createdAt: args.now ?? new Date().toISOString(),
    round: args.round,
    transcriptMessageCount: args.transcriptMessageCount,
    updateMode: recorderConfig.updateMode,
    summaryKind: digest.summaryKind,
    headline: digest.headline,
    highlights: digest.highlights,
    concerns: digest.concerns,
    nextSteps: digest.nextSteps,
    artifactFocus: [...recorderConfig.artifactFocus],
    publishedToRoom,
    interviewStatus: digest.interviewStatus,
    currentStage: digest.currentStage,
  // Provider-specific function removed;

  previousState.entries = [...previousState.entries, checkpoint].slice(
    -MAX_RECORDER_CHECKPOINTS,
  );
  previousState.lastUpdatedAt = checkpoint.createdAt;

  return {
    recorderState: previousState,
    visibleMessage: publishedToRoom ? buildRecorderVisibleMessage(checkpoint) : undefined,
  // Provider-specific function removed;
// Provider-specific function removed

export function restoreChatroomRecorderState(
  input: unknown,
): ChatroomRecorderState | undefined {
***REMOVED***!isJsonRecord(input) || input.schemaVersion !== 1 || !Array.isArray(input.entries)) {
    return undefined;
  // Provider-specific function removed

  const entries = input.entries
    .map((item) => parseRecorderCheckpoint(item))
    .filter((item): item is ChatroomRecorderCheckpoint => Boolean(item));
***REMOVED***entries.length === 0) {
    return undefined;
  // Provider-specific function removed

  return {
    schemaVersion: 1,
    lastUpdatedAt:
      asTrimmedString(input.lastUpdatedAt) ?? entries[entries.length - 1]!.createdAt,
    entries,
  // Provider-specific function removed;
// Provider-specific function removed

function createEmptyRecorderState(now?: string): ChatroomRecorderState {
  return {
    schemaVersion: 1,
    lastUpdatedAt: now ?? new Date().toISOString(),
    entries: [],
  // Provider-specific function removed;
// Provider-specific function removed

function shouldPersistRecorderCheckpoint(
  updateMode: RoomRecorderUpdateMode,
  scenarioTemplateId: RoomScenarioTemplateId | undefined,
  summary: ChatroomFinalSummary,
***REMOVED***
***REMOVED***updateMode === 'continuous' || updateMode === 'stage_checkpoints') {
    return true;
  // Provider-specific function removed

***REMOVED***
    updateMode === 'final_only' &&
    scenarioTemplateId === 'interview_simulation' &&
    isInterviewSummary(summary)
***REMOVED***
    return summary.interviewStatus === 'complete';
  // Provider-specific function removed

  return true;
// Provider-specific function removed

function summarizeRecorderOutput(summary: ChatroomFinalSummary): {
  summaryKind: ChatroomRecorderSummaryKind;
  headline: string;
  highlights: string[];
  concerns: string[];
  nextSteps: string[];
  interviewStatus?: InterviewSummary['interviewStatus'];
  currentStage?: string;
// Provider-specific function removed {
***REMOVED***isInterviewSummary(summary)) {
    return {
      summaryKind: 'interview',
      headline: summary.executiveSummary.trim(),
      highlights: takeUniqueStrings(summary.strengths).slice(0, 4),
      concerns: takeUniqueStrings([
        ...summary.weaknesses,
        ...summary.missedQuestions,
      ]).slice(0, 4),
      nextSteps: takeUniqueStrings([
        ...summary.suggestedAnswerImprovements,
        ...summary.followUpQuestions,
        ...summary.recommendedNextActions,
      ]).slice(0, 4),
      interviewStatus: summary.interviewStatus,
      currentStage: summary.currentStage.trim(),
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***isAnalysisSummary(summary)) {
    return {
      summaryKind: 'analysis',
      headline: summary.executiveSummary.trim(),
      highlights: takeUniqueStrings(summary.consensus).slice(0, 4),
      concerns: takeUniqueStrings(summary.remainingDisagreements).slice(0, 4),
      nextSteps: takeUniqueStrings(summary.recommendedNextActions).slice(0, 4),
    // Provider-specific function removed;
  // Provider-specific function removed

  return {
    summaryKind: 'roleplay',
    headline: summary.narrativeSummary.trim(),
    highlights: takeUniqueStrings([
      ...summary.keyEvents,
      ...summary.characterHighlights,
    ]).slice(0, 4),
    concerns: takeUniqueStrings([
      ...summary.cliffhangers,
      ...summary.relationshipChanges,
    ]).slice(0, 4),
    nextSteps: takeUniqueStrings(summary.cliffhangers).slice(0, 4),
  // Provider-specific function removed;
// Provider-specific function removed

function buildRecorderVisibleMessage(
  checkpoint: Readonly<ChatroomRecorderCheckpoint>,
): string {
***REMOVED***checkpoint.summaryKind === 'interview') {
  ***REMOVED***
      `【记录员阶段纪要】阶段：${checkpoint.currentStage ?? '-'// Provider-specific function removed；状态：${formatInterviewStatusLabel(checkpoint.interviewStatus)// Provider-specific function removed。${truncateText(checkpoint.headline, 220)// Provider-specific function removed`,
      checkpoint.highlights[0]
        ? `亮点：${truncateText(checkpoint.highlights[0], 140)// Provider-specific function removed`
        : undefined,
      checkpoint.concerns[0]
        ? `待补：${truncateText(checkpoint.concerns[0], 140)// Provider-specific function removed`
        : checkpoint.nextSteps[0]
          ? `建议：${truncateText(checkpoint.nextSteps[0], 140)// Provider-specific function removed`
          : undefined,
    ]
      .filter((item): item is string => Boolean(item))
      .join('\n');
  // Provider-specific function removed

***REMOVED***checkpoint.summaryKind === 'analysis') {
  ***REMOVED***
      `【记录员更新】${truncateText(checkpoint.headline, 220)// Provider-specific function removed`,
      checkpoint.highlights[0]
        ? `共识：${truncateText(checkpoint.highlights[0], 140)// Provider-specific function removed`
        : undefined,
      checkpoint.concerns[0]
        ? `风险：${truncateText(checkpoint.concerns[0], 140)// Provider-specific function removed`
        : checkpoint.nextSteps[0]
          ? `建议：${truncateText(checkpoint.nextSteps[0], 140)// Provider-specific function removed`
          : undefined,
    ]
      .filter((item): item is string => Boolean(item))
      .join('\n');
  // Provider-specific function removed

***REMOVED***
    `【场景记录】${truncateText(checkpoint.headline, 220)// Provider-specific function removed`,
    checkpoint.highlights[0]
      ? `关键进展：${truncateText(checkpoint.highlights[0], 140)// Provider-specific function removed`
      : undefined,
    checkpoint.concerns[0]
      ? `悬念：${truncateText(checkpoint.concerns[0], 140)// Provider-specific function removed`
      : checkpoint.nextSteps[0]
        ? `后续：${truncateText(checkpoint.nextSteps[0], 140)// Provider-specific function removed`
        : undefined,
  ]
    .filter((item): item is string => Boolean(item))
    .join('\n');
// Provider-specific function removed

function parseRecorderCheckpoint(
  input: unknown,
): ChatroomRecorderCheckpoint | undefined {
***REMOVED***!isJsonRecord(input) || input.schemaVersion !== 1) {
    return undefined;
  // Provider-specific function removed

  const checkpointId = asTrimmedString(input.checkpointId);
  const createdAt = asTrimmedString(input.createdAt);
  const round = asNonNegativeInteger(input.round);
  const transcriptMessageCount = asNonNegativeInteger(input.transcriptMessageCount);
  const updateMode = parseRecorderUpdateMode(input.updateMode);
  const summaryKind = parseRecorderSummaryKind(input.summaryKind);
  const headline = asTrimmedString(input.headline);
***REMOVED***
    !checkpointId ||
    !createdAt ||
    round === undefined ||
    transcriptMessageCount === undefined ||
    !updateMode ||
    !summaryKind ||
    !headline
***REMOVED***
    return undefined;
  // Provider-specific function removed

  const interviewStatus = parseInterviewStatus(input.interviewStatus);
  const currentStage = asTrimmedString(input.currentStage);

  return {
    schemaVersion: 1,
    checkpointId,
    createdAt,
    round,
    transcriptMessageCount,
    updateMode,
    summaryKind,
    headline,
    highlights: parseStringArray(input.highlights),
    concerns: parseStringArray(input.concerns),
    nextSteps: parseStringArray(input.nextSteps),
    artifactFocus: parseStringArray(input.artifactFocus),
    publishedToRoom: typeof input.publishedToRoom === 'boolean' ? input.publishedToRoom : false,
    interviewStatus,
    currentStage,
  // Provider-specific function removed;
// Provider-specific function removed

function isInterviewSummary(summary: ChatroomFinalSummary): summary is InterviewSummary {
  return 'competencyScores' in summary;
// Provider-specific function removed

function isAnalysisSummary(summary: ChatroomFinalSummary): summary is FinalSummary {
  return 'consensus' in summary;
// Provider-specific function removed

function parseRecorderUpdateMode(input: unknown): RoomRecorderUpdateMode | undefined {
  return input === 'final_only' ||
    input === 'stage_checkpoints' ||
    input === 'continuous'
    ? input
    : undefined;
// Provider-specific function removed

function parseRecorderSummaryKind(
  input: unknown,
): ChatroomRecorderSummaryKind | undefined {
  return input === 'analysis' || input === 'interview' || input === 'roleplay'
    ? input
    : undefined;
// Provider-specific function removed

function parseInterviewStatus(
  input: unknown,
): InterviewSummary['interviewStatus'] | undefined {
  return input === 'opening' || input === 'in_progress' || input === 'complete' || input === 'aborted'
    ? input
    : undefined;
// Provider-specific function removed

function formatInterviewStatusLabel(
  status: InterviewSummary['interviewStatus'] | undefined,
): string {
  switch (status) {
    case 'opening':
      return '开场';
    case 'in_progress':
      return '进行中';
    case 'complete':
      return '已完成';
    case 'aborted':
      return '异常终止';
    default:
      return '-';
  // Provider-specific function removed
// Provider-specific function removed

function takeUniqueStrings(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const trimmed = value.trim();
  ***REMOVED***!trimmed || seen.has(trimmed)) {
      continue;
    // Provider-specific function removed
    seen.add(trimmed);
    result.push(trimmed);
  // Provider-specific function removed

  return result;
// Provider-specific function removed

function parseStringArray(input: unknown): string[] {
***REMOVED***!Array.isArray(input)) {
  ***REMOVED***];
  // Provider-specific function removed

  return input
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean);
// Provider-specific function removed

function truncateText(value: string, limit: number): string {
  return value.length <= limit ? value : `${value.slice(0, Math.max(0, limit - 3))// Provider-specific function removed...`;
// Provider-specific function removed

function asTrimmedString(input: unknown): string | undefined {
  return typeof input === 'string' && input.trim().length > 0 ? input.trim() : undefined;
// Provider-specific function removed

function asNonNegativeInteger(input: unknown): number | undefined {
  return typeof input === 'number' && Number.isInteger(input) && input >= 0
    ? input
    : undefined;
// Provider-specific function removed

function isJsonRecord(input: unknown): input is Record<string, unknown> {
  return Boolean(input) && typeof input === 'object' && !Array.isArray(input);
// Provider-specific function removed
