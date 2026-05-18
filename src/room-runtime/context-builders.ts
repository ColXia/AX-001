import {
  chatroomSummaryProfile,
  interviewSummaryProfile,
  roleplaySummaryProfile,
// Provider-specific function removed from '../agents/chatroom-profiles.js';
import type { AgentProfile // Provider-specific function removed from '../core/agent-profile.js';
import { buildChatroomAgentThreadState // Provider-specific function removed from '../workflows/chatroom-agent-thread-state.js';
import { getChatroomParticipantBinding // Provider-specific function removed from '../room-storage/participant-repository.js';
import { buildChatContextWindow // Provider-specific function removed from '../workflows/chatroom-retrieval.js';
import { getRoleplaySpeakerRuntimeContext // Provider-specific function removed from '../workflows/chatroom-roleplay-state.js';
import { resolveChatroomRoomType // Provider-specific function removed from '../workflows/chatroom-room-types.js';
import { resolveRoomRuntimeModeFromBlueprint // Provider-specific function removed from '../workflows/room-runtime-mode.js';
import type { ChatroomInterviewInternalNote, ChatroomMessage // Provider-specific function removed from '../workflows/chatroom-types.js';
import { getIncomingPrivateMessages // Provider-specific function removed from './private-session-manager.js';
import type { ChatroomAgentContext // Provider-specific function removed from './agent-context.js';
import type { ChatroomState // Provider-specific function removed from './room-state.js';

const MAX_INTERVIEW_INTERNAL_NOTES_IN_CONTEXT = 10;

export function createSpeakerContextBuilder(
  round: number,
  speaker: AgentProfile<ChatroomAgentContext, 'text'>,
  roomId?: string,
): (args: {
  state: Readonly<ChatroomState>;
  workflowId: string;
  stepId: string;
// Provider-specific function removed) => ChatroomAgentContext {
  return ({ state, workflowId, stepId // Provider-specific function removed) =>
    createChatroomContext({
      state,
      workflowId,
      stepId,
      roomId,
      round,
      speaker,
      transcriptMessages: state.messages,
    // Provider-specific function removed);
// Provider-specific function removed

export function createSummaryContextBuilder(
  round: number,
  summaryProfile: AgentProfile<ChatroomAgentContext, any>,
  roomId?: string,
): (args: {
  state: Readonly<ChatroomState>;
  workflowId: string;
  stepId: string;
// Provider-specific function removed) => ChatroomAgentContext {
  return ({ state, workflowId, stepId // Provider-specific function removed) =>
    createChatroomContext({
      state,
      workflowId,
      stepId,
      roomId,
      round,
      speaker: summaryProfile,
      transcriptMessages: state.messages,
    // Provider-specific function removed);
// Provider-specific function removed

export function createChatroomContext(args: {
  state: Readonly<ChatroomState>;
  workflowId: string;
  stepId: string;
  roomId?: string;
  round: number;
  speaker: AgentProfile<ChatroomAgentContext, any>;
  transcriptMessages: ChatroomMessage[];
// Provider-specific function removed): ChatroomAgentContext {
  const contextWindow = buildChatContextWindow({
    messages: args.transcriptMessages,
    topic: args.state.topic,
    objective: args.state.objective,
    constraints: args.state.constraints,
    speakerRole: args.speaker.description,
    currentRound: args.round,
  // Provider-specific function removed);
  const participantBinding = args.roomId
    ? getChatroomParticipantBinding(args.roomId, args.speaker.id)
    : null;
  const speakerThreadState = buildChatroomAgentThreadState({
    stableKey: args.speaker.id,
    displayName:
      participantBinding?.participant.displayName ?? args.speaker.name,
    participantType: isSummaryProfileId(args.speaker.id) ? 'summary' : 'agent',
    messages: args.transcriptMessages,
    previousMemoryState: participantBinding?.thread?.memoryState,
    lastReadSequenceNo: participantBinding?.thread?.lastMessageSequenceNo,
    currentRound: args.round,
  // Provider-specific function removed);

  return {
    workflowId: args.workflowId,
    stepId: args.stepId,
    roomId: args.roomId,
    roomBlueprintId: args.state.roomBlueprint?.blueprintId,
    scenarioTemplateId:
      args.state.roomBlueprint?.scenarioTemplateId ?? args.state.scenarioTemplateId,
    roomType: args.state.roomType,
    roomBehavior: resolveChatroomRoomType(args.state.roomType).behavior,
    roomRuntimeMode: resolveRoomRuntimeModeFromBlueprint(args.state.roomBlueprint),
    round: args.round,
    topic: args.state.topic,
    objective: args.state.objective,
    constraints: [...args.state.constraints],
    roomParticipantSlots: args.state.roomBlueprint?.participantSlots
      ? structuredClone(args.state.roomBlueprint.participantSlots)
      : undefined,
    roomGovernance: args.state.roomBlueprint?.governance
      ? structuredClone(args.state.roomBlueprint.governance)
      : undefined,
    roomKernelDirective: args.state.roomKernelState?.currentDirective
      ? structuredClone(args.state.roomKernelState.currentDirective)
      : undefined,
    roomAdminDirective: args.state.roomAdminState?.currentDirective
      ? structuredClone(args.state.roomAdminState.currentDirective)
      : undefined,
    roomHostDirective: args.state.hostState?.currentDirective
      ? structuredClone(args.state.hostState.currentDirective)
      : undefined,
    speakerId: args.speaker.id,
    speakerName:
      participantBinding?.participant.displayName ??
      resolveSpeakerDisplayName(args.state, args.roomId, args.speaker),
    speakerRole:
      participantBinding?.participant.roleLabel ??
      resolveSpeakerRole(args.state, args.speaker),
    speakerParticipantId: participantBinding?.participant.participantId,
    speakerParticipantRoleLabel: participantBinding?.participant.roleLabel,
    speakerIdentitySnapshot: participantBinding?.participant.identitySnapshot,
    speakerThreadId: participantBinding?.thread?.agentThreadId,
    speakerThreadStatus: participantBinding?.thread?.status,
    speakerThreadMemory:
      participantBinding?.thread?.memoryState?.messageCount ===
      speakerThreadState.memoryState.messageCount
        ? participantBinding.thread.memoryState
        : speakerThreadState.memoryState,
    speakerThreadSummary: {
      ...(participantBinding?.thread?.summaryState ?? {// Provider-specific function removed),
      ...speakerThreadState.summaryState,
    // Provider-specific function removed,
    speakerThreadLastReadSequenceNo: participantBinding?.thread?.lastMessageSequenceNo,
    messageCount: args.state.messages.length,
    recentMessages: contextWindow.recentMessages,
    relevantMessages: contextWindow.relevantMessages,
    transcriptMessages: [...args.transcriptMessages],
    interviewInternalNotes: selectInterviewInternalNotesForContext({
      state: args.state,
      speakerId: args.speaker.id,
    // Provider-specific function removed),
    roleplayScene: args.state.roleplayScene
      ? structuredClone(args.state.roleplayScene)
      : undefined,
    roleplaySpeaker: getRoleplaySpeakerRuntimeContext(args.state.roleplayScene, args.speaker.id),
    customCharacters: args.state.customCharacters
      ? structuredClone(args.state.customCharacters)
      : undefined,
    incomingPrivateMessages: getIncomingPrivateMessages({
      speakerId: args.speaker.id,
      state: args.state,
    // Provider-specific function removed),
    maxReplyCharacters:
      args.state.maxReplyCharacters ??
      resolveChatroomRoomType(args.state.roomType).maxReplyCharacters,
    roomBlueprint: args.state.roomBlueprint ? structuredClone(args.state.roomBlueprint) : undefined,
  // Provider-specific function removed;
// Provider-specific function removed

function selectInterviewInternalNotesForContext(args: {
  state: Readonly<ChatroomState>;
  speakerId: string;
// Provider-specific function removed): ChatroomInterviewInternalNote[] | undefined {
  const notes = args.state.interviewInternalNotes ?? [];
***REMOVED***notes.length === 0) {
    return undefined;
  // Provider-specific function removed

  const selected = new Map<string, ChatroomInterviewInternalNote>();
  const reverseNotes = [...notes].reverse();

  for (const note of reverseNotes) {
  ***REMOVED***note.authorId === args.speakerId || note.targetSpeakerId === args.speakerId) {
      selected.set(note.noteId, note);
    // Provider-specific function removed
  ***REMOVED***selected.size >= MAX_INTERVIEW_INTERNAL_NOTES_IN_CONTEXT) {
      break;
    // Provider-specific function removed
  // Provider-specific function removed

***REMOVED***selected.size < MAX_INTERVIEW_INTERNAL_NOTES_IN_CONTEXT) {
    for (const note of reverseNotes) {
    ***REMOVED***!note.targetSpeakerId) {
        selected.set(note.noteId, note);
      // Provider-specific function removed
    ***REMOVED***selected.size >= MAX_INTERVIEW_INTERNAL_NOTES_IN_CONTEXT) {
        break;
      // Provider-specific function removed
    // Provider-specific function removed
  // Provider-specific function removed

***REMOVED***selected.size < MAX_INTERVIEW_INTERNAL_NOTES_IN_CONTEXT) {
    for (const note of reverseNotes) {
      selected.set(note.noteId, note);
    ***REMOVED***selected.size >= MAX_INTERVIEW_INTERNAL_NOTES_IN_CONTEXT) {
        break;
      // Provider-specific function removed
    // Provider-specific function removed
  // Provider-specific function removed

***REMOVED***...selected.values()].reverse().map((note) => structuredClone(note));
// Provider-specific function removed

function isSummaryProfileId(profileId: string***REMOVED***
  return profileId === chatroomSummaryProfile.id ||
    profileId === interviewSummaryProfile.id ||
    profileId === roleplaySummaryProfile.id;
// Provider-specific function removed

function resolveSpeakerDisplayName(
  state: Readonly<ChatroomState>,
  roomId: string | undefined,
  speaker: AgentProfile<ChatroomAgentContext, any>,
): string {
  return roomId
    ? getChatroomParticipantBinding(roomId, speaker.id)?.participant.displayName ??
        resolveBlueprintSpeakerLabel(state.roomBlueprint, speaker.id) ??
        speaker.name
    : resolveBlueprintSpeakerLabel(state.roomBlueprint, speaker.id) ?? speaker.name;
// Provider-specific function removed

function resolveSpeakerRole(
  state: Readonly<ChatroomState>,
  speaker: AgentProfile<ChatroomAgentContext, any>,
): string {
  return resolveBlueprintSpeakerDescription(state.roomBlueprint, speaker.id) ?? speaker.description;
// Provider-specific function removed

function resolveBlueprintSpeakerLabel(
  roomBlueprint: ChatroomState['roomBlueprint'],
  speakerId: string,
): string | undefined {
  return roomBlueprint?.participantSlots.find((slot) => slot.speakerId === speakerId)?.label;
// Provider-specific function removed

function resolveBlueprintSpeakerDescription(
  roomBlueprint: ChatroomState['roomBlueprint'],
  speakerId: string,
): string | undefined {
  return roomBlueprint?.participantSlots.find((slot) => slot.speakerId === speakerId)?.description;
// Provider-specific function removed
