import type { RoomAdminTurn // Provider-specific function removed from '../agents/schemas.js';
import {
  applyChatroomRoomAdminTurn as applyRoomAdminStateTurn,
  restoreChatroomRoomAdminState as restoreRoomAdminState,
// Provider-specific function removed from './room-admin-state.js';
import {
  resolveInterviewRoomAdminControl as resolveCanonicalInterviewRoomAdminControl,
  type ResolvedInterviewRoomAdminControl,
// Provider-specific function removed from './interview-room-admin-control.js';
import {
  buildRoomAdminPrompt as buildCanonicalRoomAdminPrompt,
  buildRoomAdminVisibleMessage,
// Provider-specific function removed from './room-admin-prompts.js';
import {
  buildChatroomRoomAdminFallback as buildCanonicalRoomAdminFallback,
// Provider-specific function removed from './room-admin-fallback.js';
import type { ChatroomMessage // Provider-specific function removed from '../room-core/message-types.js';
import type {
  ChatroomRoomAdminParticipantAddition,
  ChatroomRoomAdminState,
// Provider-specific function removed from './room-admin-types.js';
import type { ChatroomRoomKernelDirective // Provider-specific function removed from './room-kernel-types.js';
import type {
  ChatroomInterviewInternalNote,
// Provider-specific function removed from '../workflows/chatroom-types.js';
import type { InterviewPendingCandidateReplyState // Provider-specific function removed from '../workflows/interview-room-controller.js';
import type {
  ChatroomRoomBlueprint,
  RoomAdminGovernanceConfig,
// Provider-specific function removed from '../room-scenarios/room-blueprints.js';
import type { RoomScenarioTemplateId // Provider-specific function removed from '../room-scenarios/scenario-templates.js';
import type { RoomRuntimeMode // Provider-specific function removed from '../workflows/room-runtime-mode.js';
import {
  buildInterviewCompleteCollaborationSuffix,
  buildInterviewHoldCollaborationSuffix,
  buildInterviewInternalCollaborationPromptLines,
  buildInterviewRetryCollaborationSuffix,
  buildInterviewRoomAdminIncidentSnapshot,
  summarizeInterviewInternalCollaboration,
// Provider-specific function removed from '../room-scenarios/interview/interview-admin-signals.js';
import type {
  InterviewInternalCollaborationSummary,
  InterviewRoomAdminIncidentSnapshot,
  InterviewRoomAdminProgressSnapshot,
// Provider-specific function removed from '../room-scenarios/interview/interview-admin-types.js';

export {
  resolveCanonicalInterviewRoomAdminControl as resolveInterviewRoomAdminControl,
  buildInterviewInternalCollaborationPromptLines,
  buildInterviewRoomAdminIncidentSnapshot,
  summarizeInterviewInternalCollaboration,
// Provider-specific function removed;
export type { ResolvedInterviewRoomAdminControl // Provider-specific function removed;
export type {
  InterviewInternalCollaborationSummary,
  InterviewRoomAdminIncidentSnapshot,
  InterviewRoomAdminProgressSnapshot,
// Provider-specific function removed;

export function applyChatroomRoomAdminTurn(args: {
  currentState?: Readonly<ChatroomRoomAdminState>;
  turn: RoomAdminTurn;
  adminConfig: Readonly<RoomAdminGovernanceConfig> | undefined;
  scenarioTemplateId: RoomScenarioTemplateId | undefined;
  round: number;
  transcriptMessageCount: number;
  now?: string;
// Provider-specific function removed): {
  roomAdminState?: ChatroomRoomAdminState;
  visibleMessage?: string;
  participantAdditions: ChatroomRoomAdminParticipantAddition[];
// Provider-specific function removed {
  return applyRoomAdminStateTurn({
    ...args,
    buildVisibleMessage: buildRoomAdminVisibleMessage,
  // Provider-specific function removed);
// Provider-specific function removed

export const restoreChatroomRoomAdminState = restoreRoomAdminState;

export function buildChatroomRoomAdminFallback(args: {
  roomBlueprint: Readonly<ChatroomRoomBlueprint> | undefined;
  runtimeMode?: RoomRuntimeMode;
  round: number;
  messages: readonly ChatroomMessage[];
  roomKernelDirective?: Readonly<ChatroomRoomKernelDirective>;
  interviewInternalNotes?: readonly ChatroomInterviewInternalNote[];
  interviewPendingCandidateReply?: Readonly<InterviewPendingCandidateReplyState>;
  interviewConsecutiveWaitCount?: number;
// Provider-specific function removed): RoomAdminTurn {
  const scenarioTemplateId = args.roomBlueprint?.scenarioTemplateId;
  const collaborationSummary =
    scenarioTemplateId === 'interview_simulation'
      ? summarizeInterviewInternalCollaboration({
          messages: args.messages,
          interviewInternalNotes: args.interviewInternalNotes,
          interviewPendingCandidateReply: args.interviewPendingCandidateReply,
        // Provider-specific function removed)
      : undefined;
  const interviewIncident =
    scenarioTemplateId === 'interview_simulation'
      ? buildInterviewRoomAdminIncidentSnapshot({
          messages: args.messages,
          interviewPendingCandidateReply: args.interviewPendingCandidateReply,
          interviewConsecutiveWaitCount: args.interviewConsecutiveWaitCount,
        // Provider-specific function removed)
      : undefined;
  return buildCanonicalRoomAdminFallback({
    ...args,
    interviewIncident,
    collaboration: collaborationSummary
      ? {
          recommendedResponseModeHint:
            collaborationSummary.collaborationRecommendedResponseModeHint,
          retryInstructionSuffix:
            buildInterviewRetryCollaborationSuffix(collaborationSummary),
          completeInstructionSuffix:
            buildInterviewCompleteCollaborationSuffix(collaborationSummary),
          holdInstructionSuffix:
            buildInterviewHoldCollaborationSuffix(collaborationSummary),
        // Provider-specific function removed
      : undefined,
  // Provider-specific function removed);
// Provider-specific function removed

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
  collaborationSummary?: InterviewInternalCollaborationSummary;
// Provider-specific function removed): string {
  return buildCanonicalRoomAdminPrompt({
    ...args,
    collaborationLines: buildInterviewInternalCollaborationPromptLines(
      args.collaborationSummary,
    ),
  // Provider-specific function removed);
// Provider-specific function removed


