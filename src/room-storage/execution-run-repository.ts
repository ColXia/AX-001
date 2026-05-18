import type { AgentRuntime // Provider-specific function removed from '../core/agent-runtime.js';
import type { WorkflowResult // Provider-specific function removed from '../core/workflow.js';
import type { ChatroomState // Provider-specific function removed from '../workflows/chatroom-discussion.js';
import { getStoredChatroomDatabase // Provider-specific function removed from './database-instance.js';
import {
  createExecutionRunPersistencePlan,
  persistStoredExecutionRun,
  prepareExecutionRunCompressedMemoryStates,
// Provider-specific function removed from './execution-run-support.js';
import {
  listStoredChatroomExecutionRuns,
  resolveStoredRoomIdForExecutionRun,
// Provider-specific function removed from './query-support.js';
import {
  getRoomMessageCount,
  getRoomRow,
  resolveRoomMainSessionId,
// Provider-specific function removed from './room-state-support.js';
import { ensureRoomParticipantTopology // Provider-specific function removed from './topology-support.js';

export type { ChatroomExecutionRunRecord // Provider-specific function removed from './chatroom-storage-types.js';
import type { ChatroomExecutionRunRecord // Provider-specific function removed from './chatroom-storage-types.js';

export interface PersistChatroomExecutionRunArgs {
  roomId: string;
  rounds: number;
  baseMessageCount: number;
  result: WorkflowResult<ChatroomState>;
  status?: ChatroomExecutionRunRecord['status'];
  errorText?: string;
  artifactDirectory?: string;
  resumedFromRunId?: string;
  humanAuthorName?: string;
  humanMessage?: string;
  runtime?: AgentRuntime;
// Provider-specific function removed

export function listChatroomExecutionRuns(
  roomId: string,
  limit = 8,
): ChatroomExecutionRunRecord[] {
  return listStoredChatroomExecutionRuns(getStoredChatroomDatabase(), roomId, limit);
// Provider-specific function removed

export function getLatestChatroomExecutionRun(
  roomId: string,
): ChatroomExecutionRunRecord | null {
  return listChatroomExecutionRuns(roomId, 1)[0] ?? null;
// Provider-specific function removed

export function resolveRoomIdForExecutionRun(
  executionRunId: string,
): string | null {
  return resolveStoredRoomIdForExecutionRun(getStoredChatroomDatabase(), executionRunId);
// Provider-specific function removed

export async function persistChatroomExecutionRun(
  args: PersistChatroomExecutionRunArgs,
): Promise<ChatroomExecutionRunRecord> {
  const db = getStoredChatroomDatabase();
  const room = getRoomRow(db, args.roomId);
***REMOVED***!room) {
    throw new Error(`Chatroom room "${args.roomId// Provider-specific function removed" was not found in the SQLite store.`);
  // Provider-specific function removed

  const mainSessionId = resolveRoomMainSessionId(db, room);
  const status = args.status ?? 'completed';
  const plan = createExecutionRunPersistencePlan({
    result: args.result,
    baseMessageCount: args.baseMessageCount,
  // Provider-specific function removed);
  ensureRoomParticipantTopology(db, {
    roomId: args.roomId,
    roomType: plan.roomBlueprint.roomType,
    speakerIds: plan.speakerIds,
    roomBlueprint: plan.roomBlueprint,
  // Provider-specific function removed);

  const currentCount = getRoomMessageCount(db, args.roomId, mainSessionId);
***REMOVED***currentCount !== args.baseMessageCount) {
    throw new Error(
      [
        `Room "${args.roomId// Provider-specific function removed" changed while persisting this execution run.`,
        `Expected ${args.baseMessageCount// Provider-specific function removed, found ${currentCount// Provider-specific function removed.`,
        'This usually means another process continued the same room concurrently.',
      ].join(' '),
    );
  // Provider-specific function removed

  const compressedMemoryStates = await prepareExecutionRunCompressedMemoryStates({
    db,
    roomId: args.roomId,
    endedAt: plan.endedAt,
    allMessages: args.result.state.messages,
    runtime: args.runtime,
  // Provider-specific function removed);

  persistStoredExecutionRun({
    db,
    roomId: args.roomId,
    mainSessionId,
    rounds: args.rounds,
    baseMessageCount: args.baseMessageCount,
    result: args.result,
    plan,
    compressedMemoryStates,
    status,
    errorText: args.errorText,
    artifactDirectory: args.artifactDirectory,
    resumedFromRunId: args.resumedFromRunId,
    humanAuthorName: args.humanAuthorName,
    humanMessage: args.humanMessage,
  // Provider-specific function removed);

  return {
    executionRunId: args.result.runId,
    roomId: args.roomId,
    mainSessionId,
    status,
    resumedFromRunId: args.resumedFromRunId,
    startedAt: plan.startedAt,
    endedAt: plan.endedAt,
    rounds: args.rounds,
    baseMessageCount: args.baseMessageCount,
    newMessageCount: plan.newMessages.length,
    humanAuthorName: args.humanAuthorName,
    humanMessage: args.humanMessage,
    artifactDirectory: args.artifactDirectory,
    errorText: args.errorText,
  // Provider-specific function removed;
// Provider-specific function removed
