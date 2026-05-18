import type {
  ChatroomFinalSummary,
// Provider-specific function removed from '../agents/schemas.js';
import { chatroomFinalSummarySchema // Provider-specific function removed from '../agents/schemas.js';
import type { ChatroomState // Provider-specific function removed from '../room-runtime/room-state.js';
import { normalizeInterviewInternalSignalTag // Provider-specific function removed from '../workflows/interview-internal-notes.js';
import {
  normalizeChatroomRoomType,
  resolveChatroomRoomType,
  type ChatroomRoomTypeId,
// Provider-specific function removed from '../workflows/chatroom-room-types.js';
import {
  createChatroomRoomBlueprintFromLegacyInput,
  parseChatroomRoomBlueprint,
  type ChatroomRoomBlueprint,
// Provider-specific function removed from '../room-scenarios/room-blueprints.js';
import type { ChatroomInterviewInternalNote // Provider-specific function removed from '../workflows/chatroom-types.js';

export interface StoredRoomStateJson {
  roleplayScene?: unknown;
  roomAdminState?: unknown;
  hostState?: unknown;
  recorderState?: unknown;
  interviewConsecutiveWaitCount?: unknown;
  interviewCurrentPhase?: unknown;
  interviewPendingCandidateReply?: unknown;
  interviewInternalNotes?: unknown;
  interviewTerminalStatus?: unknown;
// Provider-specific function removed

export function parseStringArray(input: string): string[] {
  try {
    const parsed = JSON.parse(input) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string')
      : [];
  // Provider-specific function removed catch {
  ***REMOVED***];
  // Provider-specific function removed
// Provider-specific function removed

function resolveRoomSpeakerIds(
  roomType: ChatroomRoomTypeId,
  speakerIds: readonly string[] | undefined,
): string[] {
***REMOVED***speakerIds && speakerIds.length > 0) {
  ***REMOVED***...speakerIds];
  // Provider-specific function removed

***REMOVED***...resolveChatroomRoomType(roomType).defaultSpeakerIds];
// Provider-specific function removed

export function parseSpeakerIds(
  input: string | null,
  roomType: ChatroomRoomTypeId,
): string[] {
  const parsed = input ? parseStringArray(input) : [];
  return parsed.length > 0 ? parsed : resolveRoomSpeakerIds(roomType, undefined);
// Provider-specific function removed

export function parseRoomType(input: string | null): ChatroomRoomTypeId {
  return normalizeChatroomRoomType(input ?? undefined);
// Provider-specific function removed

export function parseFinalSummary(
  input: string | null,
): ChatroomFinalSummary | undefined {
***REMOVED***!input) {
    return undefined;
  // Provider-specific function removed

  try {
    const parsed = JSON.parse(input) as unknown;
    const result = chatroomFinalSummarySchema.safeParse(parsed);
    return result.success ? result.data : undefined;
  // Provider-specific function removed catch {
    return undefined;
  // Provider-specific function removed
// Provider-specific function removed

export function parseJsonRecord(
  input: string | null,
): Record<string, unknown> | undefined {
  const parsed = parseJsonValue(input);
  return isJsonRecord(parsed) ? parsed : undefined;
// Provider-specific function removed

export function parseJsonValue(input: string | null): unknown {
***REMOVED***!input) {
    return undefined;
  // Provider-specific function removed

  try {
    return JSON.parse(input) as unknown;
  // Provider-specific function removed catch {
    return undefined;
  // Provider-specific function removed
// Provider-specific function removed

export function serializeJsonRecord(input: object | undefined): string | null {
  return input ? JSON.stringify(input) : null;
// Provider-specific function removed

export function serializeJsonValue(input: unknown): string | null {
  return input === undefined ? null : JSON.stringify(input);
// Provider-specific function removed

export function isJsonRecord(input: unknown): input is Record<string, unknown> {
  return Boolean(input) && typeof input === 'object' && !Array.isArray(input);
// Provider-specific function removed

export function serializeRoomState(state: Readonly<ChatroomState>): string | null {
***REMOVED***
    !state.roleplayScene &&
    !state.roomAdminState &&
    !state.hostState &&
    !state.recorderState &&
    state.interviewConsecutiveWaitCount === undefined &&
    !state.interviewCurrentPhase &&
    !state.interviewPendingCandidateReply &&
    !state.interviewInternalNotes?.length &&
    !state.interviewTerminalStatus
***REMOVED***
***REMOVED***
  // Provider-specific function removed

  return JSON.stringify({
    roleplayScene: state.roleplayScene,
    roomAdminState: state.roomAdminState,
    hostState: state.hostState,
    recorderState: state.recorderState,
    interviewConsecutiveWaitCount: state.interviewConsecutiveWaitCount,
    interviewCurrentPhase: state.interviewCurrentPhase,
    interviewPendingCandidateReply: state.interviewPendingCandidateReply,
    interviewInternalNotes: state.interviewInternalNotes,
    interviewTerminalStatus: state.interviewTerminalStatus,
  // Provider-specific function removed);
// Provider-specific function removed

export function parseRoomStateJson(
  input: string | null,
): StoredRoomStateJson | undefined {
***REMOVED***!input) {
    return undefined;
  // Provider-specific function removed

  try {
    const parsed = JSON.parse(input) as unknown;
  ***REMOVED***!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return undefined;
    // Provider-specific function removed

    return parsed as StoredRoomStateJson;
  // Provider-specific function removed catch {
    return undefined;
  // Provider-specific function removed
// Provider-specific function removed

export function parseInterviewConsecutiveWaitCount(
  input: unknown,
): number | undefined {
  return typeof input === 'number' && Number.isInteger(input) && input >= 0
    ? input
    : undefined;
// Provider-specific function removed

export function parseInterviewPhaseState(
  input: unknown,
): ChatroomState['interviewCurrentPhase'] | undefined {
  switch (input) {
    case 'opening':
    case 'hr_followup':
    case 'technical':
    case 'observer':
    case 'manager':
    case 'hr_wrapup':
    case 'complete':
      return input;
    default:
      return undefined;
  // Provider-specific function removed
// Provider-specific function removed

export function parseInterviewPendingCandidateReply(
  input: unknown,
): ChatroomState['interviewPendingCandidateReply'] | undefined {
***REMOVED***!input || typeof input !== 'object' || Array.isArray(input)) {
    return undefined;
  // Provider-specific function removed

  const value = input as Record<string, unknown>;
***REMOVED***
    typeof value.promptMessageId !== 'string' ||
    typeof value.speakerId !== 'string' ||
    typeof value.round !== 'number' ||
    !Number.isInteger(value.round) ||
    value.round < 0 ||
    (value.responseMode !== 'new_question' && value.responseMode !== 'clarify')
***REMOVED***
    return undefined;
  // Provider-specific function removed

  return {
    promptMessageId: value.promptMessageId,
    speakerId: value.speakerId,
    round: value.round,
    responseMode: value.responseMode,
  // Provider-specific function removed;
// Provider-specific function removed

export function parseInterviewInternalNotes(
  input: unknown,
): ChatroomInterviewInternalNote[] | undefined {
***REMOVED***!Array.isArray(input) || input.length === 0) {
    return undefined;
  // Provider-specific function removed

  const notes: ChatroomInterviewInternalNote[] = [];
  for (const item of input) {
  ***REMOVED***!item || typeof item !== 'object' || Array.isArray(item)) {
      continue;
    // Provider-specific function removed

    const value = item as Record<string, unknown>;
  ***REMOVED***
      value.schemaVersion !== 1 ||
      typeof value.noteId !== 'string' ||
      typeof value.createdAt !== 'string' ||
      typeof value.round !== 'number' ||
      !Number.isInteger(value.round) ||
      value.round < 0 ||
      typeof value.authorId !== 'string' ||
      typeof value.authorName !== 'string' ||
      typeof value.content !== 'string'
  ***REMOVED***
      continue;
    // Provider-specific function removed

  ***REMOVED***
      value.kind !== 'panel_discussion' &&
      value.kind !== 'panel_handoff' &&
      value.kind !== 'speaker_collaboration'
  ***REMOVED***
      continue;
    // Provider-specific function removed

    notes.push({
      schemaVersion: 1,
      noteId: value.noteId,
      kind: value.kind,
      createdAt: value.createdAt,
      round: value.round,
      authorId: value.authorId,
      authorName: value.authorName,
      phaseLabel: typeof value.phaseLabel === 'string' ? value.phaseLabel : undefined,
      targetSpeakerId:
        typeof value.targetSpeakerId === 'string' ? value.targetSpeakerId : undefined,
      targetSpeakerName:
        typeof value.targetSpeakerName === 'string' ? value.targetSpeakerName : undefined,
      signalTags: Array.isArray(value.signalTags)
        ? value.signalTags
            .map((item) =>
              typeof item === 'string' ? normalizeInterviewInternalSignalTag(item) : undefined,
            )
            .filter((item): item is NonNullable<typeof item> => Boolean(item))
        : undefined,
      content: value.content,
    // Provider-specific function removed);
  // Provider-specific function removed

  return notes.length > 0 ? notes : undefined;
// Provider-specific function removed

export function parseInterviewTerminalStatus(
  input: unknown,
): ChatroomState['interviewTerminalStatus'] | undefined {
  return input === 'aborted' ? 'aborted' : undefined;
// Provider-specific function removed

export function parseRoomBlueprintJson(
  input: string | null,
): ChatroomRoomBlueprint | undefined {
  return parseChatroomRoomBlueprint(parseJsonValue(input));
// Provider-specific function removed

export function resolveStoredRoomBlueprint(args: {
  roomType: ChatroomRoomTypeId;
  topic: string;
  objective: string;
  constraints: readonly string[];
  speakerIds: readonly string[];
  roomBlueprintJson: string | null;
// Provider-specific function removed): ChatroomRoomBlueprint {
  return (
    parseRoomBlueprintJson(args.roomBlueprintJson) ??
    createChatroomRoomBlueprintFromLegacyInput({
      roomType: args.roomType,
      topic: args.topic,
      objective: args.objective,
      constraints: [...args.constraints],
      speakerIds: [...args.speakerIds],
    // Provider-specific function removed)
  );
// Provider-specific function removed
