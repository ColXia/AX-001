import { DatabaseSync // Provider-specific function removed from 'node:sqlite';

import type { AgentRuntime // Provider-specific function removed from '../core/agent-runtime.js';
import type { WorkflowTraceRecord, WorkflowResult // Provider-specific function removed from '../core/workflow.js';
import {
  applyLongTermMemoryCompression,
  buildChatroomAgentThreadState,
  extractScratchMemoryFromOutput,
// Provider-specific function removed from '../workflows/chatroom-agent-thread-state.js';
import type { ChatroomState // Provider-specific function removed from '../workflows/chatroom-discussion.js';
import {
  type ChatroomRoomTypeId,
// Provider-specific function removed from '../workflows/chatroom-room-types.js';
import type {
  ChatroomAgentThreadRecord,
  ChatroomExecutionRunRecord,
  ChatroomParticipantRecord,
// Provider-specific function removed from './chatroom-storage-types.js';
import {
  ensureChatroomRoomBlueprint,
  resolveBlueprintSpeakerIds,
  type ChatroomRoomBlueprint,
// Provider-specific function removed from '../room-scenarios/room-blueprints.js';
import type {
  ChatroomAgentThreadMemoryState,
  ChatroomMessage,
// Provider-specific function removed from '../workflows/chatroom-types.js';
import {
  buildAgentThreadLookup,
  buildChatroomAgentTurnRecords,
  buildParticipantLookup,
  ensureAgentThreadForParticipant,
  listRoomAgentThreadsRaw,
  listRoomParticipantsRaw,
  type PersistedAgentTurnMessageLink,
// Provider-specific function removed from './agent-thread-support.js';
import { ensureParticipantForStoredMessage // Provider-specific function removed from './participant-support.js';
import { mapAgentThreadRow, mapParticipantRow // Provider-specific function removed from './row-mappers.js';
import { serializeJsonRecord, serializeJsonValue, serializeRoomState // Provider-specific function removed from './serializers.js';

export interface ExecutionRunPersistencePlan {
  roomBlueprint: ChatroomRoomBlueprint;
  speakerIds: string[];
  startedAt: string;
  endedAt: string;
  newMessages: ChatroomMessage[];
  summaryJson: string;
// Provider-specific function removed

export function createExecutionRunPersistencePlan(args: {
  result: WorkflowResult<ChatroomState>;
  baseMessageCount: number;
// Provider-specific function removed): ExecutionRunPersistencePlan {
  const roomBlueprint = ensureChatroomRoomBlueprint(args.result.state.roomBlueprint, {
    roomType: args.result.state.roomType,
    topic: args.result.state.topic,
    objective: args.result.state.objective,
    constraints: args.result.state.constraints,
    speakerIds: args.result.state.speakerIds,
    customCharacters: args.result.state.customCharacters,
    maxReplyCharacters: args.result.state.maxReplyCharacters,
  // Provider-specific function removed);

  return {
    roomBlueprint,
    speakerIds: resolveBlueprintSpeakerIds(roomBlueprint),
    startedAt: args.result.trace[0]?.startedAt ?? new Date().toISOString(),
    endedAt:
      args.result.trace[args.result.trace.length - 1]?.endedAt ?? new Date().toISOString(),
    newMessages: args.result.state.messages.slice(args.baseMessageCount),
    summaryJson: JSON.stringify(args.result.state.finalSummary ?? null),
  // Provider-specific function removed;
// Provider-specific function removed

export async function prepareExecutionRunCompressedMemoryStates(args: {
  db: DatabaseSync;
  roomId: string;
  endedAt: string;
  allMessages: readonly ChatroomMessage[];
  runtime?: AgentRuntime;
// Provider-specific function removed): Promise<Map<string, ChatroomAgentThreadMemoryState>> {
  const compressedMemoryStates = new Map<string, ChatroomAgentThreadMemoryState>();
***REMOVED***!args.runtime) {
    return compressedMemoryStates;
  // Provider-specific function removed

  const preParticipants = listRoomParticipantsRaw(args.db, args.roomId).map((row) =>
    mapParticipantRow(row),
  );
  const preThreads = listRoomAgentThreadsRaw(args.db, args.roomId).map((row) =>
    mapAgentThreadRow(row),
  );
  const preParticipantById = new Map(preParticipants.map((participant) => [
    participant.participantId,
    participant,
  ]));

  for (const threadRow of preThreads) {
    const existingMemory = threadRow.memoryState;
  ***REMOVED***!existingMemory?.longTermMemory) {
      continue;
    // Provider-specific function removed

    const participant = preParticipantById.get(threadRow.participantId);
  ***REMOVED***!participant) {
      continue;
    // Provider-specific function removed

    const derivedCheck = buildChatroomAgentThreadState({
      stableKey: participant.stableKey,
      displayName: participant.displayName,
      participantType: participant.participantType === 'summary' ? 'summary' : 'agent',
      messages: args.allMessages,
      derivedAt: args.endedAt,
      lastReadSequenceNo: threadRow.lastMessageSequenceNo,
      previousMemoryState: existingMemory,
      currentRound: existingMemory.lastRound,
    // Provider-specific function removed);

  ***REMOVED***!derivedCheck.needsCompression) {
      continue;
    // Provider-specific function removed

    try {
      const compressed = await applyLongTermMemoryCompression({
        memoryState: derivedCheck.memoryState,
        runtime: args.runtime,
      // Provider-specific function removed);
      compressedMemoryStates.set(threadRow.agentThreadId, compressed);
    // Provider-specific function removed catch {
      // Graceful degradation: skip compression for this thread.
    // Provider-specific function removed
  // Provider-specific function removed

  return compressedMemoryStates;
// Provider-specific function removed

export function persistStoredExecutionRun(args: {
  db: DatabaseSync;
  roomId: string;
  mainSessionId: string;
  rounds: number;
  baseMessageCount: number;
  result: WorkflowResult<ChatroomState>;
  plan: ExecutionRunPersistencePlan;
  compressedMemoryStates: ReadonlyMap<string, ChatroomAgentThreadMemoryState>;
  status?: ChatroomExecutionRunRecord['status'];
  errorText?: string;
  artifactDirectory?: string;
  resumedFromRunId?: string;
  humanAuthorName?: string;
  humanMessage?: string;
// Provider-specific function removed): void {
  args.db.exec('BEGIN');
  try {
    args.db.prepare(
      `
        INSERT INTO chatroom_execution_runs (
          execution_run_id,
          room_id,
          main_session_id,
          status,
          resumed_from_run_id,
          started_at,
          ended_at,
          rounds,
          base_message_count,
          new_message_count,
          human_author_name,
          human_message,
          artifact_directory,
          summary_json,
          error_text
        ) VALUES (
          :executionRunId,
          :roomId,
          :mainSessionId,
          :status,
          :resumedFromRunId,
          :startedAt,
          :endedAt,
          :rounds,
          :baseMessageCount,
          :newMessageCount,
          :humanAuthorName,
          :humanMessage,
          :artifactDirectory,
          :summaryJson,
          :errorText
        )
      `,
    ).run({
      executionRunId: args.result.runId,
      roomId: args.roomId,
      mainSessionId: args.mainSessionId,
      status: args.status ?? 'completed',
      resumedFromRunId: args.resumedFromRunId ?? null,
      startedAt: args.plan.startedAt,
      endedAt: args.plan.endedAt,
      rounds: args.rounds,
      baseMessageCount: args.baseMessageCount,
      newMessageCount: args.plan.newMessages.length,
      humanAuthorName: args.humanAuthorName ?? null,
      humanMessage: args.humanMessage ?? null,
      artifactDirectory: args.artifactDirectory ?? null,
      summaryJson: args.plan.summaryJson,
      errorText: args.errorText ?? null,
    // Provider-specific function removed);

    const participantMap = buildParticipantLookup(
      listRoomParticipantsRaw(args.db, args.roomId).map((row) => mapParticipantRow(row)),
    );
    const threadMap = buildAgentThreadLookup(
      listRoomAgentThreadsRaw(args.db, args.roomId).map((row) => mapAgentThreadRow(row)),
    );
    const { persistedAgentMessages, touchedThreadUpdates // Provider-specific function removed = persistExecutionRunMessages({
      db: args.db,
      roomId: args.roomId,
      roomType: args.result.state.roomType,
      mainSessionId: args.mainSessionId,
      executionRunId: args.result.runId,
      baseMessageCount: args.baseMessageCount,
      newMessages: args.plan.newMessages,
      participantMap,
      threadMap,
    // Provider-specific function removed);

    updateExecutionRunAgentThreads({
      db: args.db,
      executionRunId: args.result.runId,
      endedAt: args.plan.endedAt,
      newMessages: args.plan.newMessages,
      allMessages: args.result.state.messages,
      threadMap,
      touchedThreadUpdates,
      compressedMemoryStates: args.compressedMemoryStates,
    // Provider-specific function removed);

    persistExecutionRunAgentTurns({
      db: args.db,
      roomId: args.roomId,
      executionRunId: args.result.runId,
      trace: args.result.trace,
      persistedAgentMessages,
      participantMap,
      threadMap,
    // Provider-specific function removed);

    updateStoredRoomAfterExecutionRun({
      db: args.db,
      roomId: args.roomId,
      executionRunId: args.result.runId,
      updatedAt: args.plan.endedAt,
      summaryJson: args.plan.summaryJson,
      roomBlueprint: args.plan.roomBlueprint,
      speakerIds: args.plan.speakerIds,
      state: args.result.state,
    // Provider-specific function removed);

    upsertMainSessionAfterExecutionRun({
      db: args.db,
      mainSessionId: args.mainSessionId,
      roomId: args.roomId,
      startedAt: args.plan.startedAt,
      updatedAt: args.plan.endedAt,
      executionRunId: args.result.runId,
      messageCount: args.baseMessageCount + args.plan.newMessages.length,
      summaryJson: args.plan.summaryJson,
    // Provider-specific function removed);

    args.db.exec('COMMIT');
  // Provider-specific function removed catch (error) {
    args.db.exec('ROLLBACK');
    throw error;
  // Provider-specific function removed
// Provider-specific function removed

export interface TouchedAgentThreadUpdate {
  participant: ChatroomParticipantRecord;
  lastMessageSequenceNo: number;
// Provider-specific function removed

export function persistExecutionRunMessages(args: {
  db: DatabaseSync;
  roomId: string;
  roomType: ChatroomRoomTypeId;
  mainSessionId: string;
  executionRunId: string;
  baseMessageCount: number;
  newMessages: readonly ChatroomMessage[];
  participantMap: Map<string, ChatroomParticipantRecord>;
  threadMap: Map<string, ChatroomAgentThreadRecord>;
// Provider-specific function removed): {
  persistedAgentMessages: PersistedAgentTurnMessageLink[];
  touchedThreadUpdates: Map<string, TouchedAgentThreadUpdate>;
// Provider-specific function removed {
  const insertMessage = args.db.prepare(
    `
      INSERT INTO chatroom_messages (
        message_id,
        room_id,
        main_session_id,
        execution_run_id,
        participant_id,
        agent_thread_id,
        sequence_no,
        round,
        role,
        author_id,
        author_name,
        created_at,
        content
      ) VALUES (
        :messageId,
        :roomId,
        :mainSessionId,
        :executionRunId,
        :participantId,
        :agentThreadId,
        :sequenceNo,
        :round,
        :role,
        :authorId,
        :authorName,
        :createdAt,
        :content
      )
    `,
  );

  const persistedAgentMessages: PersistedAgentTurnMessageLink[] = [];
  const touchedThreadUpdates = new Map<string, TouchedAgentThreadUpdate>();
  let sequenceNo = args.baseMessageCount + 1;

  for (const message of args.newMessages) {
    const participant = ensureParticipantForStoredMessage(args.db, {
      roomId: args.roomId,
      roomType: args.roomType,
      message,
      participantMap: args.participantMap,
      updatedAt: message.createdAt,
    // Provider-specific function removed);
    const agentThreadId = ensureAgentThreadForParticipant(args.db, {
      roomId: args.roomId,
      participant,
      threadMap: args.threadMap,
      updatedAt: message.createdAt,
    // Provider-specific function removed);

    insertMessage.run({
      messageId: message.id,
      roomId: args.roomId,
      mainSessionId: args.mainSessionId,
      executionRunId: args.executionRunId,
      participantId: participant.participantId,
      agentThreadId: agentThreadId ?? null,
      sequenceNo,
      round: message.round,
      role: message.role,
      authorId: message.authorId,
      authorName: message.authorName,
      createdAt: message.createdAt,
      content: message.content,
    // Provider-specific function removed);

  ***REMOVED***agentThreadId) {
      touchedThreadUpdates.set(agentThreadId, {
        participant,
        lastMessageSequenceNo: sequenceNo,
      // Provider-specific function removed);
    ***REMOVED***message.role === 'agent' || message.role === 'summary') {
        persistedAgentMessages.push({
          messageId: message.id,
          participantId: participant.participantId,
          agentThreadId,
          sequenceNo,
          round: message.round,
          authorId: message.authorId,
          role: message.role,
        // Provider-specific function removed);
      // Provider-specific function removed
    // Provider-specific function removed

    sequenceNo += 1;
  // Provider-specific function removed

  return {
    persistedAgentMessages,
    touchedThreadUpdates,
  // Provider-specific function removed;
// Provider-specific function removed

export function updateExecutionRunAgentThreads(args: {
  db: DatabaseSync;
  executionRunId: string;
  endedAt: string;
  newMessages: readonly ChatroomMessage[];
  allMessages: readonly ChatroomMessage[];
  threadMap: ReadonlyMap<string, ChatroomAgentThreadRecord>;
  touchedThreadUpdates: ReadonlyMap<string, TouchedAgentThreadUpdate>;
  compressedMemoryStates: ReadonlyMap<string, ChatroomAgentThreadMemoryState>;
// Provider-specific function removed): void {
  for (const [agentThreadId, update] of args.touchedThreadUpdates) {
    const existingThread = args.threadMap.get(update.participant.participantId);
    const agentNewMessages = args.newMessages.filter(
      (message) => message.authorId === update.participant.stableKey,
    );
    const scratchUpdates = extractScratchUpdatesFromMessages(agentNewMessages);
    const currentRound =
      update.lastMessageSequenceNo > 0
        ? (args.allMessages
            .filter((message) => message.authorId === update.participant.stableKey)
            .slice(-1)[0]?.round ?? 0)
        : 0;
    const preCompressed = args.compressedMemoryStates.get(agentThreadId);
    const derivedThreadState = preCompressed
      ? {
          memoryState: preCompressed,
          summaryState: buildChatroomAgentThreadState({
            stableKey: update.participant.stableKey,
            displayName: update.participant.displayName,
            participantType:
              update.participant.participantType === 'summary' ? 'summary' : 'agent',
            messages: args.allMessages,
            derivedAt: args.endedAt,
            lastReadSequenceNo: update.lastMessageSequenceNo,
            previousMemoryState: existingThread?.memoryState ?? undefined,
            currentRound,
            newScratchObservations: scratchUpdates.observations,
            newScratchPendingIntents: scratchUpdates.pendingIntents,
          // Provider-specific function removed).summaryState,
          needsCompression: false,
        // Provider-specific function removed
      : buildChatroomAgentThreadState({
          stableKey: update.participant.stableKey,
          displayName: update.participant.displayName,
          participantType:
            update.participant.participantType === 'summary' ? 'summary' : 'agent',
          messages: args.allMessages,
          derivedAt: args.endedAt,
          lastReadSequenceNo: update.lastMessageSequenceNo,
          previousMemoryState: existingThread?.memoryState ?? undefined,
          currentRound,
          newScratchObservations: scratchUpdates.observations,
          newScratchPendingIntents: scratchUpdates.pendingIntents,
        // Provider-specific function removed);

    args.db
      .prepare(
        `
          UPDATE chatroom_agent_threads
          SET
            last_message_sequence_no = :lastMessageSequenceNo,
            last_execution_run_id = :lastExecutionRunId,
            memory_state_json = :memoryStateJson,
            summary_state_json = :summaryStateJson,
            updated_at = :updatedAt
          WHERE agent_thread_id = :agentThreadId
        `,
      )
      .run({
        agentThreadId,
        lastMessageSequenceNo: update.lastMessageSequenceNo,
        lastExecutionRunId: args.executionRunId,
        memoryStateJson: serializeJsonRecord(derivedThreadState.memoryState),
        summaryStateJson: serializeJsonRecord(derivedThreadState.summaryState),
        updatedAt: args.endedAt,
      // Provider-specific function removed);
  // Provider-specific function removed
// Provider-specific function removed

export function persistExecutionRunAgentTurns(args: {
  db: DatabaseSync;
  roomId: string;
  executionRunId: string;
  trace: readonly WorkflowTraceRecord[];
  persistedAgentMessages: readonly PersistedAgentTurnMessageLink[];
  participantMap: ReadonlyMap<string, ChatroomParticipantRecord>;
  threadMap: ReadonlyMap<string, ChatroomAgentThreadRecord>;
// Provider-specific function removed): void {
  const insertAgentTurn = args.db.prepare(
    `
      INSERT INTO chatroom_agent_turns (
        agent_turn_id,
        room_id,
        execution_run_id,
        participant_id,
        agent_thread_id,
        message_id,
        message_sequence_no,
        step_id,
        step_kind,
        branch_id,
        profile_id,
        round,
        status,
        started_at,
        ended_at,
        input_preview,
        output_text,
        output_json,
        usage_json,
        telemetry_json,
        error_text
      ) VALUES (
        :agentTurnId,
        :roomId,
        :executionRunId,
        :participantId,
        :agentThreadId,
        :messageId,
        :messageSequenceNo,
        :stepId,
        :stepKind,
        :branchId,
        :profileId,
        :round,
        :status,
        :startedAt,
        :endedAt,
        :inputPreview,
        :outputText,
        :outputJson,
        :usageJson,
        :telemetryJson,
        :errorText
      )
    `,
  );

  for (const turn of buildChatroomAgentTurnRecords({
    roomId: args.roomId,
    executionRunId: args.executionRunId,
    trace: args.trace,
    persistedAgentMessages: args.persistedAgentMessages,
    participantMap: args.participantMap,
    threadMap: args.threadMap,
  // Provider-specific function removed)) {
    insertAgentTurn.run({
      agentTurnId: turn.agentTurnId,
      roomId: turn.roomId,
      executionRunId: turn.executionRunId,
      participantId: turn.participantId,
      agentThreadId: turn.agentThreadId,
      messageId: turn.messageId ?? null,
      messageSequenceNo: turn.messageSequenceNo ?? null,
      stepId: turn.stepId,
      stepKind: turn.stepKind,
      branchId: turn.branchId ?? null,
      profileId: turn.profileId,
      round: turn.round ?? null,
      status: turn.status,
      startedAt: turn.startedAt,
      endedAt: turn.endedAt,
      inputPreview: turn.inputPreview ?? null,
      outputText: turn.outputText ?? null,
      outputJson: serializeJsonValue(turn.outputJson),
      usageJson: serializeJsonValue(turn.usage),
      telemetryJson: serializeJsonValue(turn.telemetry),
      errorText: turn.errorText ?? null,
    // Provider-specific function removed);
  // Provider-specific function removed
// Provider-specific function removed

export function upsertMainSessionAfterExecutionRun(args: {
  db: DatabaseSync;
  mainSessionId: string;
  roomId: string;
  startedAt: string;
  updatedAt: string;
  executionRunId: string;
  messageCount: number;
  summaryJson: string;
// Provider-specific function removed): void {
  const mainSessionUpdated = args.db
    .prepare(
      `
        UPDATE chatroom_main_sessions
        SET
          updated_at = :updatedAt,
          last_execution_run_id = :lastExecutionRunId,
          message_count = :messageCount,
          summary_json = :summaryJson
        WHERE main_session_id = :mainSessionId
      `,
    )
    .run({
      mainSessionId: args.mainSessionId,
      updatedAt: args.updatedAt,
      lastExecutionRunId: args.executionRunId,
      messageCount: args.messageCount,
      summaryJson: args.summaryJson,
    // Provider-specific function removed);

***REMOVED***(mainSessionUpdated.changes ?? 0) !== 0) {
    return;
  // Provider-specific function removed

  args.db
    .prepare(
      `
        INSERT INTO chatroom_main_sessions (
          main_session_id,
          room_id,
          started_at,
          updated_at,
          last_execution_run_id,
          message_count,
          summary_json
        ) VALUES (
          :mainSessionId,
          :roomId,
          :startedAt,
          :updatedAt,
          :lastExecutionRunId,
          :messageCount,
          :summaryJson
        )
      `,
    )
    .run({
      mainSessionId: args.mainSessionId,
      roomId: args.roomId,
      startedAt: args.startedAt,
      updatedAt: args.updatedAt,
      lastExecutionRunId: args.executionRunId,
      messageCount: args.messageCount,
      summaryJson: args.summaryJson,
    // Provider-specific function removed);

  args.db
    .prepare(
      `
        UPDATE chatroom_rooms
        SET main_session_id = :mainSessionId
        WHERE room_id = :roomId
      `,
    )
    .run({
      mainSessionId: args.mainSessionId,
      roomId: args.roomId,
    // Provider-specific function removed);
// Provider-specific function removed

function extractScratchUpdatesFromMessages(messages: readonly ChatroomMessage[]): {
  observations: string[];
  pendingIntents: string[];
// Provider-specific function removed {
  const observations: string[] = [];
  const pendingIntents: string[] = [];

  for (const message of messages) {
    const extracted = extractScratchMemoryFromOutput(message.content);
    observations.push(...extracted.observations);
    pendingIntents.push(...extracted.pendingIntents);
  // Provider-specific function removed

  return { observations, pendingIntents // Provider-specific function removed;
// Provider-specific function removed

function updateStoredRoomAfterExecutionRun(args: {
  db: DatabaseSync;
  roomId: string;
  executionRunId: string;
  updatedAt: string;
  summaryJson: string;
  roomBlueprint: ChatroomRoomBlueprint;
  speakerIds: readonly string[];
  state: ChatroomState;
// Provider-specific function removed): void {
  args.db.prepare(
    `
      UPDATE chatroom_rooms
      SET
        updated_at = :updatedAt,
        last_execution_run_id = :lastExecutionRunId,
        last_summary_json = :lastSummaryJson,
        speaker_ids_json = :speakerIdsJson,
        room_blueprint_json = :roomBlueprintJson,
        room_state_json = :roomStateJson,
        room_type = :roomType
      WHERE room_id = :roomId
    `,
  ).run({
    updatedAt: args.updatedAt,
    lastExecutionRunId: args.executionRunId,
    lastSummaryJson: args.summaryJson,
    speakerIdsJson: JSON.stringify(args.speakerIds),
    roomBlueprintJson: JSON.stringify(args.roomBlueprint),
    roomStateJson: serializeRoomState(args.state),
    roomType: args.roomBlueprint.roomType,
    roomId: args.roomId,
  // Provider-specific function removed);
// Provider-specific function removed
