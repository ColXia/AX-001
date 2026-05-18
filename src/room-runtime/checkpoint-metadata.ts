import type { WorkflowCheckpointRecord // Provider-specific function removed from '../core/workflow-checkpoints.js';
import {
  normalizeChatroomRoomType,
  type ChatroomRoomTypeId,
// Provider-specific function removed from '../workflows/chatroom-room-types.js';
import type { ChatroomState // Provider-specific function removed from './room-state.js';
import { resolveChatroomParallelBatchSize // Provider-specific function removed from './runtime-support.js';

export type ChatroomExecutionMode =
  | 'new-room'
  | 'room-continue'
  | 'artifact-resume'
  | 'checkpoint-resume';

export interface ChatroomCheckpointMetadata {
  mode: ChatroomExecutionMode;
  roomId?: string;
  roomType: ChatroomRoomTypeId;
  roomBlueprintId?: string;
  scenarioTemplateId?: string;
  topic: string;
  objective: string;
  constraints: string[];
  startRound: number;
  rounds: number;
  speakerIds: string[];
  parallelBatchSize: number;
  baseMessageCount: number;
  resumedFromRunId?: string;
  resumeRunId?: string;
  humanAuthorName?: string;
  humanMessage?: string;
  pendingMessageId?: string;
// Provider-specific function removed

export function buildChatroomCheckpointMetadata(
  metadata: ChatroomCheckpointMetadata,
): Record<string, unknown> {
  const record: Record<string, unknown> = {
    mode: metadata.mode,
    roomType: metadata.roomType,
    topic: metadata.topic,
    objective: metadata.objective,
    constraints: [...metadata.constraints],
    startRound: metadata.startRound,
    rounds: metadata.rounds,
    speakerIds: [...metadata.speakerIds],
    parallelBatchSize: metadata.parallelBatchSize,
    baseMessageCount: metadata.baseMessageCount,
  // Provider-specific function removed;

***REMOVED***metadata.roomId) {
    record.roomId = metadata.roomId;
  // Provider-specific function removed
***REMOVED***metadata.roomBlueprintId) {
    record.roomBlueprintId = metadata.roomBlueprintId;
  // Provider-specific function removed
***REMOVED***metadata.scenarioTemplateId) {
    record.scenarioTemplateId = metadata.scenarioTemplateId;
  // Provider-specific function removed
***REMOVED***metadata.resumedFromRunId) {
    record.resumedFromRunId = metadata.resumedFromRunId;
  // Provider-specific function removed
***REMOVED***metadata.resumeRunId) {
    record.resumeRunId = metadata.resumeRunId;
  // Provider-specific function removed
***REMOVED***metadata.humanAuthorName) {
    record.humanAuthorName = metadata.humanAuthorName;
  // Provider-specific function removed
***REMOVED***metadata.humanMessage) {
    record.humanMessage = metadata.humanMessage;
  // Provider-specific function removed
***REMOVED***metadata.pendingMessageId) {
    record.pendingMessageId = metadata.pendingMessageId;
  // Provider-specific function removed

  return record;
// Provider-specific function removed

export function parseChatroomCheckpointMetadata(
  checkpoint: WorkflowCheckpointRecord<ChatroomState>,
): ChatroomCheckpointMetadata {
  const metadata = checkpoint.metadata ?? {// Provider-specific function removed;
  const startRound = normalizePositiveInteger(metadata.startRound);
  const rounds = normalizePositiveInteger(metadata.rounds);
  const baseMessageCount = normalizeNonNegativeInteger(metadata.baseMessageCount);
***REMOVED***!startRound || !rounds || baseMessageCount === undefined) {
    throw new Error(
      [
        `Checkpoint "${checkpoint.checkpointId// Provider-specific function removed" is missing required chatroom resume metadata.`,
        'This usually means it was created before room-linked checkpoint resume support landed.',
      ].join(' '),
    );
  // Provider-specific function removed

  const speakerIds =
    normalizeStringArray(metadata.speakerIds) ?? [...checkpoint.state.speakerIds];

  return {
    mode:
      normalizeChatroomExecutionMode(metadata.mode) ??
      inferCheckpointMode(checkpoint, metadata),
    roomId: normalizeOptionalString(metadata.roomId),
    roomType: normalizeChatroomRoomType(
      normalizeOptionalString(metadata.roomType) ?? checkpoint.state.roomType,
    ),
    roomBlueprintId:
      normalizeOptionalString(metadata.roomBlueprintId) ??
      checkpoint.state.roomBlueprint?.blueprintId,
    scenarioTemplateId:
      normalizeOptionalString(metadata.scenarioTemplateId) ??
      checkpoint.state.roomBlueprint?.scenarioTemplateId,
    topic: normalizeOptionalString(metadata.topic) ?? checkpoint.state.topic,
    objective: normalizeOptionalString(metadata.objective) ?? checkpoint.state.objective,
    constraints:
      normalizeStringArray(metadata.constraints) ?? [...checkpoint.state.constraints],
    startRound,
    rounds,
    speakerIds,
    parallelBatchSize:
      normalizePositiveInteger(metadata.parallelBatchSize) ??
      resolveChatroomParallelBatchSize(undefined, speakerIds.length),
    baseMessageCount,
    resumedFromRunId: normalizeOptionalString(metadata.resumedFromRunId),
    resumeRunId: normalizeOptionalString(metadata.resumeRunId),
    humanAuthorName: normalizeOptionalString(metadata.humanAuthorName),
    humanMessage: normalizeOptionalString(metadata.humanMessage),
    pendingMessageId: normalizeOptionalString(metadata.pendingMessageId),
  // Provider-specific function removed;
// Provider-specific function removed

function inferCheckpointMode(
  checkpoint: WorkflowCheckpointRecord<ChatroomState>,
  metadata: Record<string, unknown>,
): ChatroomExecutionMode {
***REMOVED***normalizeOptionalString(metadata.resumeRunId)) {
    return 'artifact-resume';
  // Provider-specific function removed
***REMOVED***normalizeOptionalString(metadata.roomId) && checkpoint.state.messages.length > 2) {
    return 'room-continue';
  // Provider-specific function removed
  return 'new-room';
// Provider-specific function removed

function normalizeOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
// Provider-specific function removed

function normalizeStringArray(value: unknown): string[] | undefined {
***REMOVED***!Array.isArray(value)) {
    return undefined;
  // Provider-specific function removed

  const normalized = value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean);
  return normalized.length > 0 ? normalized : [];
// Provider-specific function removed

function normalizePositiveInteger(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isInteger(value) && value > 0
    ? value
    : undefined;
// Provider-specific function removed

function normalizeNonNegativeInteger(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0
    ? value
    : undefined;
// Provider-specific function removed

function normalizeChatroomExecutionMode(value: unknown): ChatroomExecutionMode | undefined {
  return value === 'new-room' ||
    value === 'room-continue' ||
    value === 'artifact-resume' ||
    value === 'checkpoint-resume'
    ? value
    : undefined;
// Provider-specific function removed
