import {
  INTERVIEW_SCORE_TEMPLATE_IDS,
  resolveInterviewScoreTemplateById,
// Provider-specific function removed from './interview/interview-score-templates.js';
import {
  resolveChatroomRoomType,
  type ChatroomRoomTypeId,
  type ChatroomRoomTypeSpec,
// Provider-specific function removed from '../room-core/chatroom-room-types.js';
import { planChatroomRoomScenario // Provider-specific function removed from './scenario-planner.js';
import type { ChatroomRoomBlueprint // Provider-specific function removed from './room-blueprints.js';

export type ChatroomManualCreateValidationErrorCode =
  | 'invalid_score_template'
  | 'invalid_speaker_count';

export class ChatroomManualCreateValidationError extends Error {
  readonly code: ChatroomManualCreateValidationErrorCode;
  readonly details: Record<string, unknown>;

  constructor(
    code: ChatroomManualCreateValidationErrorCode,
    message: string,
    details: Record<string, unknown>,
***REMOVED***
    super(message);
    this.name = 'ChatroomManualCreateValidationError';
    this.code = code;
    this.details = details;
  // Provider-specific function removed
// Provider-specific function removed

export interface ResolveChatroomManualCreatePlanInput {
  topic: string;
  objective: string;
  roomType: ChatroomRoomTypeId;
  speakerCount: number;
  scoreTemplateId?: string;
  scoreDimensions?: readonly unknown[];
// Provider-specific function removed

interface DirectChatroomManualCreatePlan {
  mode: 'direct';
  roomType: ChatroomRoomTypeId;
  roomTypeSpec: ChatroomRoomTypeSpec;
  speakerCount: number;
// Provider-specific function removed

interface InterviewScenarioManualCreatePlan {
  mode: 'interview_scenario';
  roomBlueprint: ChatroomRoomBlueprint;
  notes: string[];
  scoreTemplateId?: string;
  scoreDimensions: string[];
// Provider-specific function removed

export type ResolvedChatroomManualCreatePlan =
  | DirectChatroomManualCreatePlan
  | InterviewScenarioManualCreatePlan;

export function resolveChatroomManualCreatePlan(
  input: ResolveChatroomManualCreatePlanInput,
): ResolvedChatroomManualCreatePlan {
  const normalizedScoreTemplateId = normalizeOptionalLowercase(input.scoreTemplateId);
  const normalizedScoreDimensions = normalizeStringList(input.scoreDimensions ?? []);
  const shouldUseInterviewScenario =
    Boolean(normalizedScoreTemplateId) || normalizedScoreDimensions.length > 0;

***REMOVED***
    normalizedScoreTemplateId &&
    !resolveInterviewScoreTemplateById(normalizedScoreTemplateId)
***REMOVED***
    throw new ChatroomManualCreateValidationError(
      'invalid_score_template',
      `Unknown interview score template "${normalizedScoreTemplateId// Provider-specific function removed". Available: ${INTERVIEW_SCORE_TEMPLATE_IDS.join(', ')// Provider-specific function removed.`,
      {
        scoreTemplateId: normalizedScoreTemplateId,
        availableTemplateIds: [...INTERVIEW_SCORE_TEMPLATE_IDS],
      // Provider-specific function removed,
    );
  // Provider-specific function removed

***REMOVED***shouldUseInterviewScenario) {
    const planning = planChatroomRoomScenario({
      scenarioTemplateId: 'interview_simulation',
      topic: input.topic,
      objective: input.objective,
      interview: {
        scoreTemplateId: normalizedScoreTemplateId,
        scoreDimensions:
          normalizedScoreDimensions.length > 0
            ? normalizedScoreDimensions
            : undefined,
      // Provider-specific function removed,
    // Provider-specific function removed);
    return {
      mode: 'interview_scenario',
      roomBlueprint: planning.blueprint,
      notes: planning.notes,
      scoreTemplateId: normalizedScoreTemplateId,
      scoreDimensions: normalizedScoreDimensions,
    // Provider-specific function removed;
  // Provider-specific function removed

  const roomTypeSpec = resolveChatroomRoomType(input.roomType);
***REMOVED***
    input.speakerCount < roomTypeSpec.minSpeakerCount ||
    input.speakerCount > roomTypeSpec.maxSpeakerCount
***REMOVED***
    throw new ChatroomManualCreateValidationError(
      'invalid_speaker_count',
      `Invalid speakers "${input.speakerCount// Provider-specific function removed" for room type "${roomTypeSpec.id// Provider-specific function removed". Expected ${roomTypeSpec.minSpeakerCount// Provider-specific function removed-${roomTypeSpec.maxSpeakerCount// Provider-specific function removed.`,
      {
        roomType: roomTypeSpec.id,
        speakerCount: input.speakerCount,
        minSpeakerCount: roomTypeSpec.minSpeakerCount,
        maxSpeakerCount: roomTypeSpec.maxSpeakerCount,
      // Provider-specific function removed,
    );
  // Provider-specific function removed

  return {
    mode: 'direct',
    roomType: roomTypeSpec.id,
    roomTypeSpec,
    speakerCount: input.speakerCount,
  // Provider-specific function removed;
// Provider-specific function removed

function normalizeOptionalLowercase(value: string | undefined): string | undefined {
  const normalized = value?.trim().toLowerCase();
  return normalized && normalized.length > 0 ? normalized : undefined;
// Provider-specific function removed

function normalizeStringList(value: readonly unknown[]): string[] {
  const unique = new Set<string>();
  for (const item of value) {
  ***REMOVED***typeof item !== 'string') {
      continue;
    // Provider-specific function removed
    const normalized = item.trim();
  ***REMOVED***normalized.length > 0) {
      unique.add(normalized);
    // Provider-specific function removed
  // Provider-specific function removed
***REMOVED***...unique];
// Provider-specific function removed
