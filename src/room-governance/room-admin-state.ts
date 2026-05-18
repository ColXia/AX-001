import { randomUUID // Provider-specific function removed from 'node:crypto';

import type { RoomAdminTurn // Provider-specific function removed from '../agents/schemas.js';
import type {
  ChatroomRoomAdminDirective,
  ChatroomRoomAdminParticipantAddition,
  ChatroomRoomAdminState,
// Provider-specific function removed from './room-admin-types.js';
import type { RoomAdminGovernanceConfig // Provider-specific function removed from '../room-scenarios/room-blueprints.js';
import type { RoomScenarioTemplateId // Provider-specific function removed from '../room-scenarios/scenario-templates.js';

const MAX_ROOM_ADMIN_HISTORY = 24;
const MAX_PARTICIPANT_ADDITIONS = 3;

export function applyChatroomRoomAdminTurn(args: {
  currentState?: Readonly<ChatroomRoomAdminState>;
  turn: RoomAdminTurn;
  adminConfig: Readonly<RoomAdminGovernanceConfig> | undefined;
  scenarioTemplateId: RoomScenarioTemplateId | undefined;
  round: number;
  transcriptMessageCount: number;
  now?: string;
  buildVisibleMessage?: (directive: Readonly<ChatroomRoomAdminDirective>) => string;
// Provider-specific function removed): {
  roomAdminState?: ChatroomRoomAdminState;
  visibleMessage?: string;
  participantAdditions: ChatroomRoomAdminParticipantAddition[];
// Provider-specific function removed {
***REMOVED***!args.adminConfig?.enabled) {
    return {
      roomAdminState: args.currentState ? cloneRoomAdminState(args.currentState) : undefined,
      participantAdditions: [],
    // Provider-specific function removed;
  // Provider-specific function removed

  const action = normalizeRoomAdminAction(asMaybeString(args.turn.action));
  const phaseLabel = args.adminConfig.canManagePhases ? asMaybeString(args.turn.phaseLabel) : '';
  const phaseObjective = args.adminConfig.canManagePhases
    ? asMaybeString(args.turn.phaseObjective)
    : '';
  const eventLabel = args.adminConfig.canInjectEvents ? asMaybeString(args.turn.eventLabel) : '';
  const eventMessage = args.adminConfig.canInjectEvents
    ? asMaybeString(args.turn.eventMessage)
    : '';
  const targetSpeakerId =
    action === 'request_answer_retry' ? asMaybeString(args.turn.targetSpeakerId) : '';
  const targetPromptMessageId =
    action === 'request_answer_retry' ? asMaybeString(args.turn.targetPromptMessageId) : '';
  const responseMode =
    action === 'request_answer_retry'
      ? normalizeRoomAdminResponseMode(asMaybeString(args.turn.responseMode))
      : 'new_question';
  const terminalStatus =
    action === 'complete_interview'
      ? parseRoomAdminTerminalStatus(asMaybeString(args.turn.terminalStatus))
      : undefined;
  const instruction = asMaybeString(args.turn.instruction);
  const reason = asMaybeString(args.turn.reason);
  const visibility = normalizeRoomAdminVisibility(
    asMaybeString(args.turn.visibility),
    args.scenarioTemplateId,
    args.adminConfig.interventionStyle,
  );
  const participantAdditions = args.adminConfig.canManageParticipants
    ? normalizeParticipantAdditions(
        Array.isArray(args.turn.participantAdditions) ? args.turn.participantAdditions : [],
      )
    : [];

  const previousState = args.currentState
    ? cloneRoomAdminState(args.currentState)
    : createEmptyRoomAdminState(args.now);
  const previousDirective = previousState.currentDirective;

***REMOVED***
    action === 'idle' &&
    !phaseLabel &&
    !phaseObjective &&
    !eventLabel &&
    !eventMessage &&
    !targetSpeakerId &&
    !targetPromptMessageId &&
    !instruction &&
    participantAdditions.length === 0
***REMOVED***
    previousState.lastUpdatedAt = args.now ?? new Date().toISOString();
    previousState.currentDirective = undefined;
    return {
      roomAdminState:
        previousState.history.length > 0 ||
        previousState.currentPhaseLabel ||
        previousState.currentPhaseObjective
          ? previousState
          : undefined,
      participantAdditions: [],
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***
    previousDirective &&
    previousDirective.round === args.round &&
    previousDirective.transcriptMessageCount === args.transcriptMessageCount &&
    previousDirective.action === action &&
    previousDirective.phaseLabel === phaseLabel &&
    previousDirective.phaseObjective === phaseObjective &&
    previousDirective.eventLabel === eventLabel &&
    previousDirective.eventMessage === eventMessage &&
    previousDirective.targetSpeakerId === targetSpeakerId &&
    previousDirective.targetPromptMessageId === targetPromptMessageId &&
    previousDirective.responseMode === responseMode &&
    previousDirective.terminalStatus === terminalStatus &&
    previousDirective.instruction === instruction &&
    sameParticipantAdditions(previousDirective.participantAdditions, participantAdditions)
***REMOVED***
    return {
      roomAdminState: previousState,
      visibleMessage:
        previousDirective.visibility === 'visible'
          ? args.buildVisibleMessage?.(previousDirective)
          : undefined,
      participantAdditions,
    // Provider-specific function removed;
  // Provider-specific function removed

  const directive: ChatroomRoomAdminDirective = {
    schemaVersion: 1,
    directiveId: randomUUID(),
    createdAt: args.now ?? new Date().toISOString(),
    round: args.round,
    transcriptMessageCount: args.transcriptMessageCount,
    interventionStyle: args.adminConfig.interventionStyle,
    action,
    visibility,
    phaseLabel,
    phaseObjective,
    eventLabel,
    eventMessage,
    targetSpeakerId,
    targetPromptMessageId,
    responseMode,
    terminalStatus,
    instruction,
    reason,
    participantAdditions,
  // Provider-specific function removed;

  previousState.currentDirective = directive;
  previousState.lastUpdatedAt = directive.createdAt;
***REMOVED***phaseLabel) {
    previousState.currentPhaseLabel = phaseLabel;
  // Provider-specific function removed
***REMOVED***phaseObjective) {
    previousState.currentPhaseObjective = phaseObjective;
  // Provider-specific function removed
  previousState.history = [...previousState.history, directive].slice(-MAX_ROOM_ADMIN_HISTORY);

  return {
    roomAdminState: previousState,
    visibleMessage:
      directive.visibility === 'visible' ? args.buildVisibleMessage?.(directive) : undefined,
    participantAdditions,
  // Provider-specific function removed;
// Provider-specific function removed

export function restoreChatroomRoomAdminState(
  input: unknown,
): ChatroomRoomAdminState | undefined {
***REMOVED***!isJsonRecord(input) || input.schemaVersion !== 1 || !Array.isArray(input.history)) {
    return undefined;
  // Provider-specific function removed

  const history = input.history
    .map((item) => parseRoomAdminDirective(item))
    .filter((item): item is ChatroomRoomAdminDirective => Boolean(item));
  const currentDirective = parseRoomAdminDirective(input.currentDirective);

***REMOVED***history.length === 0 && !currentDirective) {
    return undefined;
  // Provider-specific function removed

  return {
    schemaVersion: 1,
    lastUpdatedAt:
      asTrimmedString(input.lastUpdatedAt) ??
      currentDirective?.createdAt ??
      history[history.length - 1]?.createdAt ??
      new Date().toISOString(),
    currentDirective,
    currentPhaseLabel: asTrimmedString(input.currentPhaseLabel) ?? currentDirective?.phaseLabel,
    currentPhaseObjective:
      asTrimmedString(input.currentPhaseObjective) ?? currentDirective?.phaseObjective,
    history,
  // Provider-specific function removed;
// Provider-specific function removed

export function createEmptyRoomAdminState(now?: string): ChatroomRoomAdminState {
  return {
    schemaVersion: 1,
    lastUpdatedAt: now ?? new Date().toISOString(),
    history: [],
  // Provider-specific function removed;
// Provider-specific function removed

export function cloneRoomAdminState(
  state: Readonly<ChatroomRoomAdminState>,
): ChatroomRoomAdminState {
  return {
    schemaVersion: 1,
    lastUpdatedAt: state.lastUpdatedAt,
    currentDirective: state.currentDirective ? cloneDirective(state.currentDirective) : undefined,
    currentPhaseLabel: state.currentPhaseLabel,
    currentPhaseObjective: state.currentPhaseObjective,
    history: state.history.map((item) => cloneDirective(item)),
  // Provider-specific function removed;
// Provider-specific function removed

export function cloneDirective(
  directive: Readonly<ChatroomRoomAdminDirective>,
): ChatroomRoomAdminDirective {
  return {
    ...directive,
    participantAdditions: directive.participantAdditions.map((item) => ({ ...item // Provider-specific function removed)),
  // Provider-specific function removed;
// Provider-specific function removed

export function normalizeRoomAdminAction(
  input: string,
): ChatroomRoomAdminDirective['action'] {
  return input === 'set_phase' ||
    input === 'inject_event' ||
    input === 'set_phase_and_event' ||
    input === 'hold_interview' ||
    input === 'skip_phase' ||
    input === 'request_answer_retry' ||
    input === 'complete_interview'
    ? input
    : 'idle';
// Provider-specific function removed

export function normalizeRoomAdminResponseMode(
  input: string,
): ChatroomRoomAdminDirective['responseMode'] {
  return input === 'clarify' ? 'clarify' : 'new_question';
// Provider-specific function removed

export function parseRoomAdminTerminalStatus(
  input: string,
): 'complete' | 'aborted' | undefined {
  return input === 'complete' || input === 'aborted' ? input : undefined;
// Provider-specific function removed

export function resolveRoomAdminTerminalStatus(
  input: ChatroomRoomAdminDirective['terminalStatus'],
  fallback: 'complete' | 'aborted',
): 'complete' | 'aborted' {
  return input === 'complete' || input === 'aborted' ? input : fallback;
// Provider-specific function removed

export function normalizeRoomAdminVisibility(
  input: string,
  scenarioTemplateId: RoomScenarioTemplateId | undefined,
  interventionStyle: RoomAdminGovernanceConfig['interventionStyle'],
): 'hidden' | 'visible' {
***REMOVED***scenarioTemplateId === 'interview_simulation') {
    return 'hidden';
  // Provider-specific function removed
***REMOVED***input === 'hidden' || input === 'visible') {
    return input;
  // Provider-specific function removed
  return interventionStyle === 'proactive' ? 'visible' : 'hidden';
// Provider-specific function removed

export function normalizeParticipantAdditions(
  additions: readonly { name: string; instruction: string // Provider-specific function removed[],
): ChatroomRoomAdminParticipantAddition[] {
  const unique = new Set<string>();
  const normalized: ChatroomRoomAdminParticipantAddition[] = [];

  for (const item of additions) {
    const name = item.name.trim();
    const instruction = item.instruction.trim();
  ***REMOVED***!name) {
      continue;
    // Provider-specific function removed
    const key = name.toLowerCase();
  ***REMOVED***unique.has(key)) {
      continue;
    // Provider-specific function removed
    unique.add(key);
    normalized.push({
      name,
      instruction,
    // Provider-specific function removed);
  ***REMOVED***normalized.length >= MAX_PARTICIPANT_ADDITIONS) {
      break;
    // Provider-specific function removed
  // Provider-specific function removed

  return normalized;
// Provider-specific function removed

export function sameParticipantAdditions(
  left: readonly ChatroomRoomAdminParticipantAddition[],
  right: readonly ChatroomRoomAdminParticipantAddition[],
***REMOVED***
  return JSON.stringify(left) === JSON.stringify(right);
// Provider-specific function removed

export function parseRoomAdminDirective(
  input: unknown,
): ChatroomRoomAdminDirective | undefined {
***REMOVED***!isJsonRecord(input) || input.schemaVersion !== 1) {
    return undefined;
  // Provider-specific function removed

  const directiveId = asTrimmedString(input.directiveId);
  const createdAt = asTrimmedString(input.createdAt);
  const round = asNonNegativeInteger(input.round);
  const transcriptMessageCount = asNonNegativeInteger(input.transcriptMessageCount);
  const interventionStyle = parseInterventionStyle(input.interventionStyle);
  const action = parseAction(input.action);
  const visibility = parseVisibility(input.visibility);
***REMOVED***
    !directiveId ||
    !createdAt ||
    round === undefined ||
    transcriptMessageCount === undefined ||
    !interventionStyle ||
    !action ||
    !visibility
***REMOVED***
    return undefined;
  // Provider-specific function removed

  return {
    schemaVersion: 1,
    directiveId,
    createdAt,
    round,
    transcriptMessageCount,
    interventionStyle,
    action,
    visibility,
    phaseLabel: asMaybeString(input.phaseLabel),
    phaseObjective: asMaybeString(input.phaseObjective),
    eventLabel: asMaybeString(input.eventLabel),
    eventMessage: asMaybeString(input.eventMessage),
    targetSpeakerId: asMaybeString(input.targetSpeakerId),
    targetPromptMessageId: asMaybeString(input.targetPromptMessageId),
    responseMode: normalizeRoomAdminResponseMode(asMaybeString(input.responseMode)),
    terminalStatus:
      action === 'complete_interview'
        ? parseRoomAdminTerminalStatus(asMaybeString(input.terminalStatus))
        : undefined,
    instruction: asMaybeString(input.instruction),
    reason: asMaybeString(input.reason),
    participantAdditions: normalizeParticipantAdditions(
      Array.isArray(input.participantAdditions)
        ? input.participantAdditions
            .filter((item): item is { name: string; instruction: string // Provider-specific function removed => isJsonRecord(item))
            .map((item) => ({
              name: asMaybeString(item.name),
              instruction: asMaybeString(item.instruction),
            // Provider-specific function removed))
        : [],
    ),
  // Provider-specific function removed;
// Provider-specific function removed

export function parseInterventionStyle(
  input: unknown,
): RoomAdminGovernanceConfig['interventionStyle'] | undefined {
  return input === 'on_demand' || input === 'proactive' ? input : undefined;
// Provider-specific function removed

export function parseAction(
  input: unknown,
): ChatroomRoomAdminDirective['action'] | undefined {
  return input === 'idle' ||
    input === 'set_phase' ||
    input === 'inject_event' ||
    input === 'set_phase_and_event' ||
    input === 'hold_interview' ||
    input === 'request_answer_retry' ||
    input === 'complete_interview'
    ? input
    : undefined;
// Provider-specific function removed

export function parseVisibility(
  input: unknown,
): 'hidden' | 'visible' | undefined {
  return input === 'hidden' || input === 'visible' ? input : undefined;
// Provider-specific function removed

export function asTrimmedString(input: unknown): string | undefined {
  return typeof input === 'string' && input.trim().length > 0 ? input.trim() : undefined;
// Provider-specific function removed

export function asMaybeString(input: unknown): string {
  return typeof input === 'string' ? input.trim() : '';
// Provider-specific function removed

export function asNonNegativeInteger(input: unknown): number | undefined {
  return typeof input === 'number' && Number.isInteger(input) && input >= 0
    ? input
    : undefined;
// Provider-specific function removed

export function isJsonRecord(input: unknown): input is Record<string, unknown> {
  return Boolean(input) && typeof input === 'object' && !Array.isArray(input);
// Provider-specific function removed
