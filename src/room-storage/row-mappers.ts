import type { AgentRunTelemetry // Provider-specific function removed from '../core/agent-runtime.js';
import type { WorkflowTraceRecord // Provider-specific function removed from '../core/workflow.js';
import {
  parseFinalSummary,
  parseJsonRecord,
  parseJsonValue,
  parseRoomType,
  parseSpeakerIds,
  parseStringArray,
  resolveStoredRoomBlueprint,
// Provider-specific function removed from './serializers.js';
import { resolveBlueprintSpeakerIds // Provider-specific function removed from '../room-scenarios/room-blueprints.js';
import type {
  ChatroomAgentThreadRecord,
  ChatroomAgentTurnRecord,
  ChatroomAgentTurnStatus,
  ChatroomExecutionRunRecord,
  ChatroomMainSessionRecord,
  ChatroomParticipantRecord,
  ChatroomParticipantType,
  ChatroomPendingMessageRecord,
  ChatroomPendingMessageStatus,
  ChatroomRoomListItem,
  ChatroomRoomRecord,
// Provider-specific function removed from './chatroom-storage-types.js';
import type {
  ChatroomAgentThreadMemoryState,
  ChatroomAgentThreadSummaryState,
  ChatroomMessage,
// Provider-specific function removed from '../workflows/chatroom-types.js';

export interface RoomRow {
  room_id: string;
  main_session_id?: string | null;
  room_type: string | null;
  topic: string;
  objective: string;
  constraints_json: string;
  speaker_ids_json: string | null;
  room_blueprint_json: string | null;
  room_state_json: string | null;
  created_at: string;
  updated_at: string;
  last_execution_run_id: string | null;
  last_summary_json: string | null;
  message_count?: number;
  run_count?: number;
// Provider-specific function removed

export interface ExecutionRunRow {
  execution_run_id: string;
  room_id: string;
  main_session_id: string | null;
  status: ChatroomExecutionRunRecord['status'] | null;
  resumed_from_run_id: string | null;
  started_at: string;
  ended_at: string;
  rounds: number;
  base_message_count: number;
  new_message_count: number;
  human_author_name: string | null;
  human_message: string | null;
  artifact_directory: string | null;
  summary_json: string | null;
  error_text: string | null;
// Provider-specific function removed

export interface MainSessionRow {
  main_session_id: string;
  room_id: string;
  started_at: string;
  updated_at: string;
  last_execution_run_id: string | null;
  message_count: number;
  summary_json: string | null;
// Provider-specific function removed

export interface MessageRow {
  message_id: string;
  room_id: string;
  main_session_id: string | null;
  execution_run_id: string;
  participant_id: string | null;
  agent_thread_id: string | null;
  sequence_no: number;
  round: number;
  role: ChatroomMessage['role'];
  author_id: string;
  author_name: string;
  created_at: string;
  content: string;
// Provider-specific function removed

export interface PendingMessageRow {
  pending_message_id: string;
  room_id: string;
  author_name: string;
  content: string;
  status: ChatroomPendingMessageStatus;
  created_at: string;
  claimed_at: string | null;
  processed_execution_run_id: string | null;
  error_text: string | null;
// Provider-specific function removed

export interface ParticipantRow {
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

export interface AgentThreadRow {
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

export interface AgentTurnRow {
  agent_turn_id: string;
  room_id: string;
  execution_run_id: string;
  participant_id: string;
  agent_thread_id: string;
  message_id: string | null;
  message_sequence_no: number | null;
  step_id: string;
  step_kind: WorkflowTraceRecord['kind'];
  branch_id: string | null;
  profile_id: string;
  round: number | null;
  status: ChatroomAgentTurnStatus;
  started_at: string;
  ended_at: string;
  input_preview: string | null;
  output_text: string | null;
  output_json: string | null;
  usage_json: string | null;
  telemetry_json: string | null;
  error_text: string | null;
  participant_stable_key?: string | null;
  participant_display_name?: string | null;
  participant_type?: ChatroomParticipantType | null;
// Provider-specific function removed

export function mapRoomRow(row: RoomRow): ChatroomRoomRecord {
  const roomType = parseRoomType(row.room_type);
  const constraints = parseStringArray(row.constraints_json);
  const speakerIds = parseSpeakerIds(row.speaker_ids_json, roomType);
  const roomBlueprint = resolveStoredRoomBlueprint({
    roomType,
    topic: row.topic,
    objective: row.objective,
    constraints,
    speakerIds,
    roomBlueprintJson: row.room_blueprint_json,
  // Provider-specific function removed);

  return {
    roomId: row.room_id,
    mainSessionId: row.main_session_id ?? undefined,
    roomType: roomBlueprint.roomType,
    scenarioTemplateId: roomBlueprint.scenarioTemplateId,
    roomBlueprint,
    topic: roomBlueprint.topic,
    objective: roomBlueprint.objective,
    constraints: [...roomBlueprint.constraints],
    speakerIds: resolveBlueprintSpeakerIds(roomBlueprint),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastExecutionRunId: row.last_execution_run_id ?? undefined,
  // Provider-specific function removed;
// Provider-specific function removed

export function mapRoomListRow(row: RoomRow): ChatroomRoomListItem {
  return {
    ...mapRoomRow(row),
    messageCount: row.message_count ?? 0,
    runCount: row.run_count ?? 0,
    lastSummaryPreview: extractSummaryPreview(row.last_summary_json),
  // Provider-specific function removed;
// Provider-specific function removed

export function mapExecutionRunRow(row: ExecutionRunRow): ChatroomExecutionRunRecord {
  return {
    executionRunId: row.execution_run_id,
    roomId: row.room_id,
    mainSessionId: row.main_session_id ?? undefined,
    status: row.status ?? 'completed',
    resumedFromRunId: row.resumed_from_run_id ?? undefined,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    rounds: row.rounds,
    baseMessageCount: row.base_message_count,
    newMessageCount: row.new_message_count,
    humanAuthorName: row.human_author_name ?? undefined,
    humanMessage: row.human_message ?? undefined,
    artifactDirectory: row.artifact_directory ?? undefined,
    errorText: row.error_text ?? undefined,
  // Provider-specific function removed;
// Provider-specific function removed

export function mapMainSessionRow(row: MainSessionRow): ChatroomMainSessionRecord {
  return {
    mainSessionId: row.main_session_id,
    roomId: row.room_id,
    startedAt: row.started_at,
    updatedAt: row.updated_at,
    lastExecutionRunId: row.last_execution_run_id ?? undefined,
    messageCount: row.message_count,
    summary: parseFinalSummary(row.summary_json),
  // Provider-specific function removed;
// Provider-specific function removed

export function mapMessageRow(row: MessageRow): ChatroomMessage {
  return {
    id: row.message_id,
    role: row.role,
    authorId: row.author_id,
    authorName: row.author_name,
    participantId: row.participant_id ?? undefined,
    agentThreadId: row.agent_thread_id ?? undefined,
    round: row.round,
    createdAt: row.created_at,
    content: row.content,
  // Provider-specific function removed;
// Provider-specific function removed

export function mapParticipantRow(row: ParticipantRow): ChatroomParticipantRecord {
  return {
    participantId: row.participant_id,
    roomId: row.room_id,
    participantType: row.participant_type,
    stableKey: row.stable_key,
    profileId: row.profile_id ?? undefined,
    displayName: row.display_name,
    roleLabel: row.role_label ?? undefined,
    identitySnapshot: parseJsonRecord(row.identity_snapshot_json),
    state: parseJsonRecord(row.state_json),
    joinedAt: row.joined_at,
    updatedAt: row.updated_at,
    archivedAt: row.archived_at ?? undefined,
  // Provider-specific function removed;
// Provider-specific function removed

export function mapAgentThreadRow(row: AgentThreadRow): ChatroomAgentThreadRecord {
  return {
    agentThreadId: row.agent_thread_id,
    roomId: row.room_id,
    participantId: row.participant_id,
    status: row.status,
    providerRefs: parseJsonRecord(row.provider_refs_json),
    memoryState: parseJsonRecord(row.memory_state_json) as
      | ChatroomAgentThreadMemoryState
      | undefined,
    summaryState: parseJsonRecord(row.summary_state_json) as
      | ChatroomAgentThreadSummaryState
      | undefined,
    lastMessageSequenceNo: row.last_message_sequence_no ?? undefined,
    lastExecutionRunId: row.last_execution_run_id ?? undefined,
    version: row.version,
    updatedAt: row.updated_at,
  // Provider-specific function removed;
// Provider-specific function removed

export function mapAgentTurnRow(row: AgentTurnRow): ChatroomAgentTurnRecord {
  return {
    agentTurnId: row.agent_turn_id,
    roomId: row.room_id,
    executionRunId: row.execution_run_id,
    participantId: row.participant_id,
    participantStableKey: row.participant_stable_key ?? undefined,
    participantDisplayName: row.participant_display_name ?? undefined,
    participantType: row.participant_type ?? undefined,
    agentThreadId: row.agent_thread_id,
    messageId: row.message_id ?? undefined,
    messageSequenceNo: row.message_sequence_no ?? undefined,
    stepId: row.step_id,
    stepKind: row.step_kind,
    branchId: row.branch_id ?? undefined,
    profileId: row.profile_id,
    round: row.round ?? undefined,
    status: row.status,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    inputPreview: row.input_preview ?? undefined,
    outputText: row.output_text ?? undefined,
    outputJson: parseJsonValue(row.output_json),
    usage: parseJsonValue(row.usage_json) as Record<string, unknown> | undefined,
    telemetry: parseJsonValue(row.telemetry_json) as AgentRunTelemetry | undefined,
    errorText: row.error_text ?? undefined,
  // Provider-specific function removed;
// Provider-specific function removed

export function mapPendingMessageRow(row: PendingMessageRow): ChatroomPendingMessageRecord {
  return {
    pendingMessageId: row.pending_message_id,
    roomId: row.room_id,
    authorName: row.author_name,
    content: row.content,
    status: row.status,
    createdAt: row.created_at,
    claimedAt: row.claimed_at ?? undefined,
    processedExecutionRunId: row.processed_execution_run_id ?? undefined,
    errorText: row.error_text ?? undefined,
  // Provider-specific function removed;
// Provider-specific function removed

function extractSummaryPreview(input: string | null): string | undefined {
  const summary = parseFinalSummary(input);
***REMOVED***!summary) {
    return undefined;
  // Provider-specific function removed

  return 'executiveSummary' in summary
    ? summary.executiveSummary
    : summary.narrativeSummary;
// Provider-specific function removed
