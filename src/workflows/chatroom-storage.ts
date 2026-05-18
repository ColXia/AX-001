import { existsSync, mkdirSync, readFileSync, writeFileSync // Provider-specific function removed from 'node:fs';
import { resolve // Provider-specific function removed from 'node:path';

import { z // Provider-specific function removed from 'zod';

import { chatroomFinalSummarySchema // Provider-specific function removed from '../agents/schemas.js';
import type { WorkflowResult // Provider-specific function removed from '../core/workflow.js';
import {
  CHATROOM_ROOM_TYPE_IDS,
  DEFAULT_CHATROOM_ROOM_TYPE,
  resolveChatroomRoomType,
// Provider-specific function removed from './chatroom-room-types.js';
import { formatChatTranscript // Provider-specific function removed from './chatroom-format.js';
import {
  createCustomRoleplayTemplates,
  rebuildRoleplaySceneState,
// Provider-specific function removed from './chatroom-roleplay-state.js';
import {
  parseChatroomRoomBlueprint,
  resolveBlueprintSpeakerIds,
// Provider-specific function removed from '../room-scenarios/room-blueprints.js';
import {
  normalizeRoleplayCharacterCards,
  type RoleplayCharacterCard,
// Provider-specific function removed from '../room-scenarios/roleplay/roleplay-characters.js';
import {
  buildRoomScenarioArtifactBundle,
// Provider-specific function removed from '../room-scenarios/scenario-artifacts.js';
import type { ChatroomState // Provider-specific function removed from './chatroom-discussion.js';

const legacySpeakerIds = ['moderator-chat', 'strategy-chat', 'risk-chat'];

const chatroomMessageSchema = z.object({
  id: z.string().min(1),
  role: z.enum(['system', 'user', 'agent', 'summary']),
  authorId: z.string().min(1),
  authorName: z.string().min(1),
  participantId: z.string().min(1).optional(),
  agentThreadId: z.string().min(1).optional(),
  round: z.number().int().min(0),
  createdAt: z.string().min(1),
  content: z.string(),
// Provider-specific function removed);

const roleplayRelationshipStateSchema = z.object({
  targetSpeakerId: z.string().min(1),
  targetName: z.string().min(1),
  score: z.number().int().min(-3).max(3),
  summary: z.string().min(1),
// Provider-specific function removed);

const roleplayCharacterStateSchema = z.object({
  speakerId: z.string().min(1),
  displayName: z.string().min(1),
  archetype: z.string().min(1),
  publicStatus: z.string().min(1),
  currentGoal: z.string().min(1),
  privateNotes: z.array(z.string()).default([]),
  relationships: z.array(roleplayRelationshipStateSchema).default([]),
// Provider-specific function removed);

const roleplaySceneStateSchema = z.object({
  locationLabel: z.string().min(1),
  atmosphere: z.string().min(1),
  currentBeat: z.string().min(1),
  latestEvent: z.string().min(1),
  latestUserIntent: z.string().min(1).optional(),
  activeThreads: z.array(z.string()).default([]),
  cast: z.array(roleplayCharacterStateSchema).default([]),
// Provider-specific function removed);

const customCharacterRelationshipSchema = z.object({
  targetCharacterId: z.string().min(1).optional(),
  targetName: z.string().min(1).optional(),
  summary: z.string().min(1),
  score: z.number().int().min(-3).max(3).optional(),
// Provider-specific function removed);

const customCharacterSchema = z.object({
  characterId: z.string().min(1).optional(),
  name: z.string().min(1),
  instruction: z.string(),
  publicDescription: z.string().min(1).optional(),
  privateNotes: z.array(z.string()).optional(),
  relationships: z.array(customCharacterRelationshipSchema).optional(),
  initialGoal: z.string().min(1).optional(),
// Provider-specific function removed);

const recorderCheckpointSchema = z.object({
  schemaVersion: z.literal(1),
  checkpointId: z.string().min(1),
  createdAt: z.string().min(1),
  round: z.number().int().min(0),
  transcriptMessageCount: z.number().int().min(0),
  updateMode: z.enum(['final_only', 'stage_checkpoints', 'continuous']),
  summaryKind: z.enum(['analysis', 'interview', 'roleplay']),
  headline: z.string().min(1),
  highlights: z.array(z.string()).default([]),
  concerns: z.array(z.string()).default([]),
  nextSteps: z.array(z.string()).default([]),
  artifactFocus: z.array(z.string()).default([]),
  publishedToRoom: z.boolean(),
  interviewStatus: z.enum(['opening', 'in_progress', 'complete', 'aborted']).optional(),
  currentStage: z.string().min(1).optional(),
// Provider-specific function removed);

const recorderStateSchema = z.object({
  schemaVersion: z.literal(1),
  lastUpdatedAt: z.string().min(1),
  entries: z.array(recorderCheckpointSchema).default([]),
// Provider-specific function removed);

const hostDirectiveSchema = z.object({
  schemaVersion: z.literal(1),
  directiveId: z.string().min(1),
  createdAt: z.string().min(1),
  round: z.number().int().min(0),
  transcriptMessageCount: z.number().int().min(0),
  moderationStyle: z.enum(['light', 'structured', 'strict']),
  action: z.enum(['idle', 'guide', 'intervene']),
  visibility: z.enum(['hidden', 'visible']),
  headline: z.string(),
  focus: z.string(),
  instruction: z.string(),
  reason: z.string(),
// Provider-specific function removed);

const hostStateSchema = z.object({
  schemaVersion: z.literal(1),
  lastUpdatedAt: z.string().min(1),
  currentDirective: hostDirectiveSchema.optional(),
  history: z.array(hostDirectiveSchema).default([]),
// Provider-specific function removed);

const roomAdminParticipantAdditionSchema = z.object({
  name: z.string().min(1),
  instruction: z.string(),
// Provider-specific function removed);

const roomAdminDirectiveSchema = z.object({
  schemaVersion: z.literal(1),
  directiveId: z.string().min(1),
  createdAt: z.string().min(1),
  round: z.number().int().min(0),
  transcriptMessageCount: z.number().int().min(0),
  interventionStyle: z.enum(['on_demand', 'proactive']),
  action: z.enum([
    'idle',
    'set_phase',
    'inject_event',
    'set_phase_and_event',
    'hold_interview',
    'request_answer_retry',
    'complete_interview',
  ]),
  visibility: z.enum(['hidden', 'visible']),
  phaseLabel: z.string(),
  phaseObjective: z.string(),
  eventLabel: z.string(),
  eventMessage: z.string(),
  targetSpeakerId: z.string().default(''),
  targetPromptMessageId: z.string().default(''),
  responseMode: z.enum(['new_question', 'clarify']).default('new_question'),
  terminalStatus: z.enum(['complete', 'aborted']).optional(),
  instruction: z.string(),
  reason: z.string(),
  participantAdditions: z.array(roomAdminParticipantAdditionSchema).default([]),
// Provider-specific function removed);

const roomAdminStateSchema = z.object({
  schemaVersion: z.literal(1),
  lastUpdatedAt: z.string().min(1),
  currentDirective: roomAdminDirectiveSchema.optional(),
  currentPhaseLabel: z.string().optional(),
  currentPhaseObjective: z.string().optional(),
  history: z.array(roomAdminDirectiveSchema).default([]),
// Provider-specific function removed);

const interviewInternalNoteSchema = z.object({
  schemaVersion: z.literal(1),
  noteId: z.string().min(1),
  kind: z.enum(['panel_discussion', 'panel_handoff', 'speaker_collaboration']),
  createdAt: z.string().min(1),
  round: z.number().int().min(0),
  authorId: z.string().min(1),
  authorName: z.string().min(1),
  phaseLabel: z.string().optional(),
  targetSpeakerId: z.string().optional(),
  targetSpeakerName: z.string().optional(),
  signalTags: z
    .array(
      z.enum([
        'supportive_guidance',
        'risk_alert',
        'suggest_close',
        'suggest_handoff',
        'retry_same_thread',
        'retry_with_clarify',
        'retry_new_angle',
      ]),
    )
    .optional(),
  content: z.string().min(1),
// Provider-specific function removed);

const interviewPendingCandidateReplySchema = z.object({
  promptMessageId: z.string().min(1),
  speakerId: z.string().min(1),
  round: z.number().int().min(0),
  responseMode: z.enum(['new_question', 'clarify']),
// Provider-specific function removed);

const chatroomStateSchema = z.object({
  roomType: z.enum(CHATROOM_ROOM_TYPE_IDS).default(DEFAULT_CHATROOM_ROOM_TYPE),
  scenarioTemplateId: z.string().min(1).optional(),
  roomBlueprint: z.unknown().optional(),
  topic: z.string().min(1),
  objective: z.string().min(1),
  constraints: z.array(z.string()).default([]),
  speakerIds: z.array(z.string()).default(legacySpeakerIds),
  messages: z.array(chatroomMessageSchema),
  roleplayScene: roleplaySceneStateSchema.optional(),
  customCharacters: z.array(customCharacterSchema).optional(),
  finalSummary: chatroomFinalSummarySchema.optional(),
  roomAdminState: roomAdminStateSchema.optional(),
  hostState: hostStateSchema.optional(),
  recorderState: recorderStateSchema.optional(),
  maxReplyCharacters: z.number().int().positive().optional(),
  interviewConsecutiveWaitCount: z.number().int().min(0).optional(),
  interviewCurrentPhase: z.enum(['opening', 'hr_followup', 'technical', 'observer', 'manager', 'hr_wrapup', 'complete']).optional(),
  interviewPendingCandidateReply: interviewPendingCandidateReplySchema.optional(),
  interviewInternalNotes: z.array(interviewInternalNoteSchema).optional(),
  interviewTerminalStatus: z.enum(['aborted']).optional(),
// Provider-specific function removed);

export interface ChatroomArtifactPaths {
  directory: string;
  metadataPath: string;
  blueprintPath: string;
  statePath: string;
  tracePath: string;
  transcriptPath: string;
  summaryPath: string;
  scenarioArtifactJsonPath?: string;
  scenarioArtifactMarkdownPath?: string;
// Provider-specific function removed

export function saveChatroomArtifacts(
  result: WorkflowResult<ChatroomState>,
  options: {
    roomId?: string;
    mainSessionId?: string;
    executionRunId?: string;
    resumedFromRunId?: string;
  // Provider-specific function removed = {// Provider-specific function removed,
): ChatroomArtifactPaths {
  const directory = resolve(process.cwd(), 'runs', 'chatroom', result.runId);
  mkdirSync(directory, { recursive: true // Provider-specific function removed);

  const metadataPath = resolve(directory, 'metadata.json');
  const blueprintPath = resolve(directory, 'blueprint.json');
  const statePath = resolve(directory, 'state.json');
  const tracePath = resolve(directory, 'trace.json');
  const transcriptPath = resolve(directory, 'transcript.md');
  const summaryPath = resolve(directory, 'summary.json');
  const savedAt = new Date().toISOString();
  const scenarioArtifact = buildRoomScenarioArtifactBundle(result.state, {
    generatedAt: savedAt,
  // Provider-specific function removed);
  const scenarioArtifactJsonPath = scenarioArtifact
    ? resolve(directory, scenarioArtifact.jsonFileName)
    : undefined;
  const scenarioArtifactMarkdownPath = scenarioArtifact
    ? resolve(directory, scenarioArtifact.markdownFileName)
    : undefined;

  const metadata = {
    runId: result.runId,
    executionRunId: options.executionRunId ?? result.runId,
    roomId: options.roomId ?? null,
    mainSessionId: options.mainSessionId ?? null,
    roomType: result.state.roomType,
    workflowId: result.workflowId,
    topic: result.state.topic,
    objective: result.state.objective,
    scenarioTemplateId: result.state.roomBlueprint?.scenarioTemplateId ?? null,
    scenarioArtifactType: scenarioArtifact?.artifactType ?? null,
    blueprintId: result.state.roomBlueprint?.blueprintId ?? null,
    messageCount: result.state.messages.length,
    savedAt,
    resumedFromRunId: options.resumedFromRunId ?? null,
  // Provider-specific function removed;

  writeJson(metadataPath, metadata);
  writeJson(blueprintPath, result.state.roomBlueprint ?? null);
  writeJson(statePath, result.state);
  writeJson(tracePath, result.trace);
  writeFileSync(transcriptPath, buildTranscriptMarkdown(result.state), 'utf8');
  writeJson(summaryPath, result.state.finalSummary ?? null);
***REMOVED***scenarioArtifact && scenarioArtifactJsonPath && scenarioArtifactMarkdownPath) {
    writeJson(scenarioArtifactJsonPath, scenarioArtifact.payload);
    writeFileSync(scenarioArtifactMarkdownPath, scenarioArtifact.markdown, 'utf8');
  // Provider-specific function removed

  return {
    directory,
    metadataPath,
    blueprintPath,
    statePath,
    tracePath,
    transcriptPath,
    summaryPath,
    scenarioArtifactJsonPath,
    scenarioArtifactMarkdownPath,
  // Provider-specific function removed;
// Provider-specific function removed

export function loadChatroomState(runId: string): ChatroomState {
  const statePath = resolve(process.cwd(), 'runs', 'chatroom', runId, 'state.json');
***REMOVED***!existsSync(statePath)) {
    throw new Error(
      `Chatroom state not found for run "${runId// Provider-specific function removed". Expected file at ${statePath// Provider-specific function removed.`,
    );
  // Provider-specific function removed

  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(statePath, 'utf8')) as unknown;
  // Provider-specific function removed catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to parse saved chatroom state from ${statePath// Provider-specific function removed: ${message// Provider-specific function removed`);
  // Provider-specific function removed

  const state = chatroomStateSchema.parse(parsed);
  const roomBlueprint = parseChatroomRoomBlueprint(state.roomBlueprint);
  const customCharacters = normalizeCustomCharacters(
    roomBlueprint?.customCharacters ?? state.customCharacters,
  );
  const speakerIds =
    roomBlueprint
      ? resolveBlueprintSpeakerIds(roomBlueprint)
      : state.speakerIds.length > 0
      ? state.speakerIds
      : [...resolveChatroomRoomType(state.roomType).defaultSpeakerIds];
  const customRoleplayTemplates =
    customCharacters.length > 0
      ? createCustomRoleplayTemplates(customCharacters)
      : undefined;

  return {
    ...state,
    roomType: roomBlueprint?.roomType ?? state.roomType,
    scenarioTemplateId: roomBlueprint?.scenarioTemplateId,
    roomBlueprint: roomBlueprint ?? undefined,
    topic: roomBlueprint?.topic ?? state.topic,
    objective: roomBlueprint?.objective ?? state.objective,
    constraints: roomBlueprint ? [...roomBlueprint.constraints] : state.constraints,
    speakerIds,
    customCharacters: customCharacters.length > 0 ? customCharacters : undefined,
    customRoleplayTemplates,
    roleplayScene:
      resolveChatroomRoomType(roomBlueprint?.roomType ?? state.roomType).behavior === 'roleplay'
        ? state.messages.length === 0 && state.roleplayScene
          ? state.roleplayScene
          :
          rebuildRoleplaySceneState({
            topic: roomBlueprint?.topic ?? state.topic,
            objective: roomBlueprint?.objective ?? state.objective,
            constraints: roomBlueprint?.constraints ?? state.constraints,
            speakerIds,
            messages: state.messages,
            customTemplates: customRoleplayTemplates,
          // Provider-specific function removed)
        : undefined,
    roomAdminState: state.roomAdminState,
    hostState: state.hostState,
    recorderState: state.recorderState,
    maxReplyCharacters:
      roomBlueprint?.runtimeConfig.maxReplyCharacters ?? state.maxReplyCharacters,
    interviewConsecutiveWaitCount: state.interviewConsecutiveWaitCount,
    interviewCurrentPhase: state.interviewCurrentPhase,
    interviewPendingCandidateReply: state.interviewPendingCandidateReply,
    interviewInternalNotes: state.interviewInternalNotes,
    interviewTerminalStatus: state.interviewTerminalStatus,
  // Provider-specific function removed;
// Provider-specific function removed

function writeJson(path: string, value: unknown): void {
  writeFileSync(path, `${JSON.stringify(value, null, 2)// Provider-specific function removed\n`, 'utf8');
// Provider-specific function removed

function buildTranscriptMarkdown(state: Readonly<ChatroomState>): string {
***REMOVED***
    '# Chatroom Transcript',
    '',
    `- Room Type: ${state.roomType// Provider-specific function removed`,
    state.roomBlueprint
      ? `- Scenario Template: ${state.roomBlueprint.scenarioTemplateId// Provider-specific function removed`
      : undefined,
    state.roomBlueprint ? `- Blueprint ID: ${state.roomBlueprint.blueprintId// Provider-specific function removed` : undefined,
    `- Topic: ${state.topic// Provider-specific function removed`,
    `- Objective: ${state.objective// Provider-specific function removed`,
    state.constraints.length > 0
      ? `- Constraints: ${state.constraints.join(' | ')// Provider-specific function removed`
      : '- Constraints: None provided',
    `- Speakers: ${state.speakerIds.join(', ')// Provider-specific function removed`,
    '',
    '## Messages',
    '',
    formatChatTranscript(state.messages),
    '',
    '## Room State',
    '',
    state.roleplayScene ? JSON.stringify({ roleplayScene: state.roleplayScene // Provider-specific function removed, null, 2) : 'null',
    '',
    '## Final Summary',
    '',
    state.finalSummary ? JSON.stringify(state.finalSummary, null, 2) : 'null',
    '',
    '## Room Admin State',
    '',
    state.roomAdminState ? JSON.stringify(state.roomAdminState, null, 2) : 'null',
    '',
    '## Host State',
    '',
    state.hostState ? JSON.stringify(state.hostState, null, 2) : 'null',
    '',
    '## Recorder State',
    '',
    state.recorderState ? JSON.stringify(state.recorderState, null, 2) : 'null',
    '',
    '## Interview Internal Notes',
    '',
    state.interviewInternalNotes
      ? JSON.stringify(state.interviewInternalNotes, null, 2)
      : 'null',
    '',
    '## Interview Terminal Status',
    '',
    state.interviewTerminalStatus ? JSON.stringify(state.interviewTerminalStatus) : 'null',
    '',
  ].filter((line): line is string => typeof line === 'string').join('\n');
// Provider-specific function removed

function normalizeCustomCharacters(
  value: RoleplayCharacterCard[] | undefined,
): RoleplayCharacterCard[] {
  return normalizeRoleplayCharacterCards(value);
// Provider-specific function removed
