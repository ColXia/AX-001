import type { ChatroomFinalSummary // Provider-specific function removed from '../agents/schemas.js';
import type { AgentRunTelemetry // Provider-specific function removed from '../core/agent-runtime.js';
import type { WorkflowTraceRecord // Provider-specific function removed from '../core/workflow.js';
import type {
  ChatroomRoomTypeId,
// Provider-specific function removed from '../workflows/chatroom-room-types.js';
import type { ChatroomRoomBlueprint // Provider-specific function removed from '../room-scenarios/room-blueprints.js';
import type {
  ChatroomAgentThreadMemoryState,
  ChatroomAgentThreadSummaryState,
// Provider-specific function removed from '../workflows/chatroom-types.js';

export interface ChatroomRoomRecord {
  roomId: string;
  mainSessionId?: string;
  roomType: ChatroomRoomTypeId;
  scenarioTemplateId?: ChatroomRoomBlueprint['scenarioTemplateId'];
  roomBlueprint?: ChatroomRoomBlueprint;
  topic: string;
  objective: string;
  constraints: string[];
  speakerIds: string[];
  createdAt: string;
  updatedAt: string;
  lastExecutionRunId?: string;
// Provider-specific function removed

export interface ChatroomRoomListItem extends ChatroomRoomRecord {
  messageCount: number;
  runCount: number;
  lastSummaryPreview?: string;
// Provider-specific function removed

export interface ChatroomExecutionRunRecord {
  executionRunId: string;
  roomId: string;
  mainSessionId?: string;
  status: 'completed' | 'failed' | 'cancelled';
  resumedFromRunId?: string;
  startedAt: string;
  endedAt: string;
  rounds: number;
  baseMessageCount: number;
  newMessageCount: number;
  humanAuthorName?: string;
  humanMessage?: string;
  artifactDirectory?: string;
  errorText?: string;
// Provider-specific function removed

export interface ChatroomMainSessionRecord {
  mainSessionId: string;
  roomId: string;
  startedAt: string;
  updatedAt: string;
  lastExecutionRunId?: string;
  messageCount: number;
  summary?: ChatroomFinalSummary;
// Provider-specific function removed

export type ChatroomParticipantType = 'agent' | 'human' | 'system' | 'summary';

export interface ChatroomParticipantRecord {
  participantId: string;
  roomId: string;
  participantType: ChatroomParticipantType;
  stableKey: string;
  profileId?: string;
  displayName: string;
  roleLabel?: string;
  identitySnapshot?: Record<string, unknown>;
  state?: Record<string, unknown>;
  joinedAt: string;
  updatedAt: string;
  archivedAt?: string;
// Provider-specific function removed

export interface ChatroomAgentThreadRecord {
  agentThreadId: string;
  roomId: string;
  participantId: string;
  status: 'active' | 'paused' | 'errored';
  providerRefs?: Record<string, unknown>;
  memoryState?: ChatroomAgentThreadMemoryState;
  summaryState?: ChatroomAgentThreadSummaryState;
  lastMessageSequenceNo?: number;
  lastExecutionRunId?: string;
  version: number;
  updatedAt: string;
// Provider-specific function removed

export type ChatroomAgentTurnStatus = 'completed' | 'failed' | 'cancelled';

export interface ChatroomAgentTurnRecord {
  agentTurnId: string;
  roomId: string;
  executionRunId: string;
  participantId: string;
  participantStableKey?: string;
  participantDisplayName?: string;
  participantType?: ChatroomParticipantType;
  agentThreadId: string;
  messageId?: string;
  messageSequenceNo?: number;
  stepId: string;
  stepKind: WorkflowTraceRecord['kind'];
  branchId?: string;
  profileId: string;
  round?: number;
  status: ChatroomAgentTurnStatus;
  startedAt: string;
  endedAt: string;
  inputPreview?: string;
  outputText?: string;
  outputJson?: unknown;
  usage?: Record<string, unknown>;
  telemetry?: AgentRunTelemetry;
  errorText?: string;
// Provider-specific function removed

export type ChatroomPendingMessageStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed';

export interface ChatroomPendingMessageRecord {
  pendingMessageId: string;
  roomId: string;
  authorName: string;
  content: string;
  status: ChatroomPendingMessageStatus;
  createdAt: string;
  claimedAt?: string;
  processedExecutionRunId?: string;
  errorText?: string;
// Provider-specific function removed

export interface ChatroomRoomLeaseRecord {
  roomId: string;
  leaseToken: string;
  holderLabel?: string;
  acquiredAt: string;
  expiresAt: string;
// Provider-specific function removed

export interface DeleteChatroomRoomResult {
  roomId: string;
  existed: boolean;
  deletedRunCount: number;
  deletedMessageCount: number;
  deletedPendingMessageCount: number;
  deletedArtifactDirectoryCount: number;
  deletedLiveSnapshot: boolean;
  skippedArtifactDirectories: string[];
  cleanupWarnings: string[];
// Provider-specific function removed

export interface CloneChatroomRoomResult {
  roomId: string;
  clonedFromRoomId: string;
// Provider-specific function removed
