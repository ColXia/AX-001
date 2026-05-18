import { randomUUID // Provider-specific function removed from 'node:crypto';
import { DatabaseSync // Provider-specific function removed from 'node:sqlite';

import type { AgentRunTelemetry // Provider-specific function removed from '../core/agent-runtime.js';
import type { WorkflowTraceRecord // Provider-specific function removed from '../core/workflow.js';
import { isJsonRecord // Provider-specific function removed from './serializers.js';
import type {
  ChatroomAgentThreadRecord,
  ChatroomAgentTurnRecord,
  ChatroomAgentTurnStatus,
  ChatroomParticipantRecord,
  ChatroomParticipantType,
// Provider-specific function removed from './chatroom-storage-types.js';

export interface PersistedAgentTurnMessageLink {
  messageId: string;
  participantId: string;
  agentThreadId: string;
  sequenceNo: number;
  round: number;
  authorId: string;
  role: 'system' | 'user' | 'agent' | 'summary';
// Provider-specific function removed

interface ParsedAgentTraceOutput {
  branchId?: string;
  profileId: string;
  output?: unknown;
  usage?: Record<string, unknown>;
  telemetry?: AgentRunTelemetry;
  startedAt?: string;
  endedAt?: string;
  status: ChatroomAgentTurnStatus;
  error?: string;
// Provider-specific function removed

export interface ParticipantQueryRow {
  participant_id: string;
  room_id: string;
  participant_type: ChatroomParticipantType;
  stable_key: string;
  profile_id: string | null;
  display_name: string;
  role_label: string | null;
  identity_snapshot_json: string | null;
  state_json: string | null;
  joined_at: string;
  updated_at: string;
  archived_at: string | null;
// Provider-specific function removed

export interface AgentThreadQueryRow {
  agent_thread_id: string;
  room_id: string;
  participant_id: string;
  status: ChatroomAgentThreadRecord['status'];
  provider_refs_json: string | null;
  memory_state_json: string | null;
  summary_state_json: string | null;
  last_message_sequence_no: number | null;
  last_execution_run_id: string | null;
  version: number;
  updated_at: string;
// Provider-specific function removed

export function buildParticipantLookup(
  participants: readonly ChatroomParticipantRecord[],
): Map<string, ChatroomParticipantRecord> {
  return new Map(participants.map((participant) => [participant.stableKey, participant]));
// Provider-specific function removed

export function buildAgentThreadLookup(
  threads: readonly ChatroomAgentThreadRecord[],
): Map<string, ChatroomAgentThreadRecord> {
  return new Map(threads.map((thread) => [thread.participantId, thread]));
// Provider-specific function removed

export function listRoomParticipantsRaw(
  db: DatabaseSync,
  roomId: string,
): ParticipantQueryRow[] {
  return db
    .prepare(
      `
        SELECT
          participant_id,
          room_id,
          participant_type,
          stable_key,
          profile_id,
          display_name,
          role_label,
          identity_snapshot_json,
          state_json,
          joined_at,
          updated_at,
          archived_at
        FROM chatroom_participants
        WHERE room_id = ?
      `,
    )
    .all(roomId) as unknown as ParticipantQueryRow[];
// Provider-specific function removed

export function listRoomAgentThreadsRaw(
  db: DatabaseSync,
  roomId: string,
): AgentThreadQueryRow[] {
  return db
    .prepare(
      `
        SELECT
          agent_thread_id,
          room_id,
          participant_id,
          status,
          provider_refs_json,
          memory_state_json,
          summary_state_json,
          last_message_sequence_no,
          last_execution_run_id,
          version,
          updated_at
        FROM chatroom_agent_threads
        WHERE room_id = ?
      `,
    )
    .all(roomId) as unknown as AgentThreadQueryRow[];
// Provider-specific function removed

export function ensureAgentThreadForParticipant(
  db: DatabaseSync,
  args: {
    roomId: string;
    participant: ChatroomParticipantRecord;
    threadMap: Map<string, ChatroomAgentThreadRecord>;
    updatedAt: string;
  // Provider-specific function removed,
): string | undefined {
***REMOVED***
    args.participant.participantType !== 'agent' &&
    args.participant.participantType !== 'summary'
***REMOVED***
    return undefined;
  // Provider-specific function removed

  const existing = args.threadMap.get(args.participant.participantId);
***REMOVED***existing) {
    return existing.agentThreadId;
  // Provider-specific function removed

  const created: ChatroomAgentThreadRecord = {
    agentThreadId: randomUUID(),
    roomId: args.roomId,
    participantId: args.participant.participantId,
    status: 'active',
    version: 1,
    updatedAt: args.updatedAt,
  // Provider-specific function removed;

  db.prepare(
    `
      INSERT INTO chatroom_agent_threads (
        agent_thread_id,
        room_id,
        participant_id,
        status,
        provider_refs_json,
        memory_state_json,
        summary_state_json,
        last_message_sequence_no,
        last_execution_run_id,
        version,
        updated_at
      ) VALUES (
        :agentThreadId,
        :roomId,
        :participantId,
        :status,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        :version,
        :updatedAt
      )
    `,
  ).run({
    agentThreadId: created.agentThreadId,
    roomId: created.roomId,
    participantId: created.participantId,
    status: created.status,
    version: created.version,
    updatedAt: created.updatedAt,
  // Provider-specific function removed);

  args.threadMap.set(created.participantId, created);
  return created.agentThreadId;
// Provider-specific function removed

export function parseAgentTurnStatus(value: unknown): ChatroomAgentTurnStatus {
  return value === 'failed' || value === 'cancelled' ? value : 'completed';
// Provider-specific function removed

export function buildChatroomAgentTurnRecords(args: {
  roomId: string;
  executionRunId: string;
  trace: readonly WorkflowTraceRecord[];
  persistedAgentMessages: readonly PersistedAgentTurnMessageLink[];
  participantMap: ReadonlyMap<string, ChatroomParticipantRecord>;
  threadMap: ReadonlyMap<string, ChatroomAgentThreadRecord>;
// Provider-specific function removed): ChatroomAgentTurnRecord[] {
  const records: ChatroomAgentTurnRecord[] = [];
  let messageIndex = 0;

  for (const trace of args.trace) {
  ***REMOVED***trace.kind === 'parallel' || trace.kind === 'custom') {
      const branchInputPreviewMap =
        trace.kind === 'parallel'
          ? buildParallelInputPreviewMap(trace.inputPreview)
          : new Map<string, string>();
      const outputs =
        trace.kind === 'parallel'
          ? parseParallelTraceOutputs(trace.output)
          : parseCustomTraceOutputs(trace.output);
      const traceStatus = trace.status ?? 'completed';
      for (const output of outputs) {
        const binding = resolveOptionalAgentTurnBinding(
          output.profileId,
          args.participantMap,
          args.threadMap,
        );
      ***REMOVED***!binding) {
          const nextPersistedMessage = args.persistedAgentMessages[messageIndex];
        ***REMOVED***nextPersistedMessage?.authorId === output.profileId) {
            throw new Error(
              [
                `Chatroom trace/message mismatch for synthetic profile "${output.profileId// Provider-specific function removed".`,
                'A persisted message was found, but no room participant/thread binding exists.',
              ].join(' '),
            );
          // Provider-specific function removed
          continue;
        // Provider-specific function removed
        const persistedMessage =
          (traceStatus === 'completed' || traceStatus === 'partial') &&
          output.status === 'completed'
            ? maybeConsumePersistedAgentMessage(
                args.persistedAgentMessages,
                messageIndex,
                output.profileId,
                `parallel trace "${trace.stepId// Provider-specific function removed" branch "${output.branchId// Provider-specific function removed"`,
              )
            : undefined;
      ***REMOVED***persistedMessage) {
          messageIndex += 1;
        // Provider-specific function removed

        records.push({
          agentTurnId: randomUUID(),
          roomId: args.roomId,
          executionRunId: args.executionRunId,
          participantId: binding.participant.participantId,
          participantStableKey: binding.participant.stableKey,
          participantDisplayName: binding.participant.displayName,
          participantType: binding.participant.participantType,
          agentThreadId: binding.thread.agentThreadId,
          messageId: persistedMessage?.messageId,
          messageSequenceNo: persistedMessage?.sequenceNo,
          stepId: trace.stepId,
          stepKind: trace.kind,
          branchId: output.branchId,
          profileId: output.profileId,
          round: persistedMessage?.round ?? inferRoundFromStepId(trace.stepId),
          status: output.status,
          startedAt: output.startedAt ?? trace.startedAt,
          endedAt: output.endedAt ?? trace.endedAt,
          inputPreview:
            trace.kind === 'parallel'
              ? (output.branchId ? branchInputPreviewMap.get(output.branchId) : undefined)
              : trace.inputPreview,
          outputText:
            output.output !== undefined && typeof output.output === 'string'
              ? output.output
              : undefined,
          outputJson:
            output.output !== undefined && typeof output.output !== 'string'
              ? output.output
              : undefined,
          usage: output.usage,
          telemetry: output.telemetry,
          errorText: output.error,
        // Provider-specific function removed);
      // Provider-specific function removed
      continue;
    // Provider-specific function removed

  ***REMOVED***trace.kind !== 'agent') {
      continue;
    // Provider-specific function removed

    const profileId = trace.agentIds?.[0];
  ***REMOVED***!profileId) {
      continue;
    // Provider-specific function removed
    const binding = resolveAgentTurnBinding(
      profileId,
      args.participantMap,
      args.threadMap,
    );
    const traceStatus = trace.status ?? 'completed';
    const persistedMessage =
      traceStatus === 'completed'
        ? maybeConsumePersistedAgentMessage(
            args.persistedAgentMessages,
            messageIndex,
            profileId,
            `agent trace "${trace.stepId// Provider-specific function removed"`,
          )
        : undefined;
  ***REMOVED***persistedMessage) {
      messageIndex += 1;
    // Provider-specific function removed

    records.push({
      agentTurnId: randomUUID(),
      roomId: args.roomId,
      executionRunId: args.executionRunId,
      participantId: binding.participant.participantId,
      participantStableKey: binding.participant.stableKey,
      participantDisplayName: binding.participant.displayName,
      participantType: binding.participant.participantType,
      agentThreadId: binding.thread.agentThreadId,
      messageId: persistedMessage?.messageId,
      messageSequenceNo: persistedMessage?.sequenceNo,
      stepId: trace.stepId,
      stepKind: trace.kind,
      profileId,
      round: persistedMessage?.round ?? inferRoundFromStepId(trace.stepId),
      status: parseAgentTurnStatus(traceStatus),
      startedAt: trace.startedAt,
      endedAt: trace.endedAt,
      inputPreview: trace.inputPreview,
      outputText: typeof trace.output === 'string' ? trace.output : undefined,
      outputJson: typeof trace.output === 'string' ? undefined : trace.output,
      usage: trace.usage,
      telemetry: trace.telemetry,
      errorText: trace.error,
    // Provider-specific function removed);
  // Provider-specific function removed

***REMOVED***messageIndex !== args.persistedAgentMessages.length) {
    throw new Error(
      [
        `Persisted chatroom agent message count mismatch for execution run "${args.executionRunId// Provider-specific function removed".`,
        `Matched ${messageIndex// Provider-specific function removed, found ${args.persistedAgentMessages.length// Provider-specific function removed.`,
      ].join(' '),
    );
  // Provider-specific function removed

  return records;
// Provider-specific function removed

function parseParallelTraceOutputs(output: unknown): ParsedAgentTraceOutput[] {
***REMOVED***!Array.isArray(output)) {
    throw new Error('Parallel chatroom trace is missing branch outputs.');
  // Provider-specific function removed

  return output.map((item, index) => {
  ***REMOVED***!item || typeof item !== 'object' || Array.isArray(item)) {
      throw new Error(`Invalid parallel chatroom trace output at index ${index// Provider-specific function removed.`);
    // Provider-specific function removed

    const record = item as Record<string, unknown>;
    const branchId = typeof record.branchId === 'string' ? record.branchId : undefined;
    const profileId = typeof record.profileId === 'string' ? record.profileId : undefined;
  ***REMOVED***!branchId || !profileId) {
      throw new Error(`Parallel chatroom trace output at index ${index// Provider-specific function removed is missing identifiers.`);
    // Provider-specific function removed

    return {
      branchId,
      profileId,
      output: record.output,
      usage: isJsonRecord(record.usage) ? record.usage : undefined,
      telemetry: isJsonRecord(record.telemetry)
        ? (record.telemetry as AgentRunTelemetry)
        : undefined,
      startedAt: typeof record.startedAt === 'string' ? record.startedAt : undefined,
      endedAt: typeof record.endedAt === 'string' ? record.endedAt : undefined,
      status: parseAgentTurnStatus(record.status),
      error: typeof record.error === 'string' ? record.error : undefined,
    // Provider-specific function removed;
  // Provider-specific function removed);
// Provider-specific function removed

function parseCustomTraceOutputs(output: unknown): ParsedAgentTraceOutput[] {
***REMOVED***!Array.isArray(output)) {
    throw new Error('Custom chatroom trace is missing outputs.');
  // Provider-specific function removed

  return output.map((item, index) => {
  ***REMOVED***!item || typeof item !== 'object' || Array.isArray(item)) {
      throw new Error(`Invalid custom chatroom trace output at index ${index// Provider-specific function removed.`);
    // Provider-specific function removed

    const record = item as Record<string, unknown>;
    const profileId = typeof record.profileId === 'string' ? record.profileId : undefined;
  ***REMOVED***!profileId) {
      throw new Error(`Custom chatroom trace output at index ${index// Provider-specific function removed is missing profileId.`);
    // Provider-specific function removed

    return {
      profileId,
      output: record.output,
      usage: isJsonRecord(record.usage) ? record.usage : undefined,
      telemetry: isJsonRecord(record.telemetry)
        ? (record.telemetry as AgentRunTelemetry)
        : undefined,
      startedAt: typeof record.startedAt === 'string' ? record.startedAt : undefined,
      endedAt: typeof record.endedAt === 'string' ? record.endedAt : undefined,
      status: parseAgentTurnStatus(record.status),
      error: typeof record.error === 'string' ? record.error : undefined,
    // Provider-specific function removed;
  // Provider-specific function removed);
// Provider-specific function removed

function resolveAgentTurnBinding(
  profileId: string,
  participantMap: ReadonlyMap<string, ChatroomParticipantRecord>,
  threadMap: ReadonlyMap<string, ChatroomAgentThreadRecord>,
): {
  participant: ChatroomParticipantRecord;
  thread: ChatroomAgentThreadRecord;
// Provider-specific function removed {
  const participant = participantMap.get(profileId);
***REMOVED***!participant) {
    throw new Error(`Missing chatroom participant for turn profile "${profileId// Provider-specific function removed".`);
  // Provider-specific function removed

  const thread = threadMap.get(participant.participantId);
***REMOVED***!thread) {
    throw new Error(`Missing chatroom agent thread for turn profile "${profileId// Provider-specific function removed".`);
  // Provider-specific function removed

  return {
    participant,
    thread,
  // Provider-specific function removed;
// Provider-specific function removed

function resolveOptionalAgentTurnBinding(
  profileId: string,
  participantMap: ReadonlyMap<string, ChatroomParticipantRecord>,
  threadMap: ReadonlyMap<string, ChatroomAgentThreadRecord>,
):
  | {
      participant: ChatroomParticipantRecord;
      thread: ChatroomAgentThreadRecord;
    // Provider-specific function removed
  | undefined {
  const participant = participantMap.get(profileId);
***REMOVED***!participant) {
    return undefined;
  // Provider-specific function removed

  const thread = threadMap.get(participant.participantId);
***REMOVED***!thread) {
    throw new Error(`Missing chatroom agent thread for turn profile "${profileId// Provider-specific function removed".`);
  // Provider-specific function removed

  return {
    participant,
    thread,
  // Provider-specific function removed;
// Provider-specific function removed

function maybeConsumePersistedAgentMessage(
  persistedAgentMessages: readonly PersistedAgentTurnMessageLink[],
  index: number,
  profileId: string,
  _traceLabel: string,
): PersistedAgentTurnMessageLink | undefined {
  const persistedMessage = persistedAgentMessages[index];
***REMOVED***!persistedMessage) {
    return undefined;
  // Provider-specific function removed

***REMOVED***persistedMessage.authorId !== profileId) {
    return undefined;
  // Provider-specific function removed

  return persistedMessage;
// Provider-specific function removed

function buildParallelInputPreviewMap(inputPreview: string | undefined): Map<string, string> {
  const map = new Map<string, string>();
***REMOVED***!inputPreview) {
    return map;
  // Provider-specific function removed

  for (const line of inputPreview.split('\n')) {
    const separatorIndex = line.indexOf(': ');
  ***REMOVED***separatorIndex <= 0) {
      continue;
    // Provider-specific function removed

    const branchId = line.slice(0, separatorIndex);
    const preview = line.slice(separatorIndex + 2).trim();
  ***REMOVED***!branchId || !preview) {
      continue;
    // Provider-specific function removed

    map.set(branchId, preview);
  // Provider-specific function removed

  return map;
// Provider-specific function removed

function inferRoundFromStepId(stepId: string): number | undefined {
  const match = /^chat-round-(\d+)/.exec(stepId);
***REMOVED***!match) {
    return undefined;
  // Provider-specific function removed

  const round = Number.parseInt(match[1] ?? '', 10);
  return Number.isInteger(round) ? round : undefined;
// Provider-specific function removed
