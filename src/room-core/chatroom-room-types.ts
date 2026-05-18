import {
  createAnalysisRoomType,
  createRoleplayRoomType,
// Provider-specific function removed from './chatroom-room-type-templates.js';

export const CHATROOM_ROOM_TYPE_IDS = [
  'expert_discussion',
  'brainstorm_workshop',
  'project_discussion',
  'report_seminar',
  'roleplay_scene',
] as const;

export type ChatroomRoomTypeId = (typeof CHATROOM_ROOM_TYPE_IDS)[number];

export const CHATROOM_ROOM_BEHAVIOR_IDS = ['analysis', 'roleplay'] as const;

export type ChatroomRoomBehaviorId = (typeof CHATROOM_ROOM_BEHAVIOR_IDS)[number];

export const CHATROOM_SPEAKER_PRESET_IDS = ['expert_panel', 'roleplay_cast'] as const;

export type ChatroomSpeakerPresetId = (typeof CHATROOM_SPEAKER_PRESET_IDS)[number];

export interface ChatroomRoomTypeSeedInput {
  topic: string;
  objective: string;
  constraints: readonly string[];
// Provider-specific function removed

export interface ChatroomRoomTypeSpec {
  id: ChatroomRoomTypeId;
  behavior: ChatroomRoomBehaviorId;
  speakerPreset: ChatroomSpeakerPresetId;
  label: string;
  shortLabel: string;
  description: string;
  summaryEnabled: boolean;
  minSpeakerCount: number;
  maxSpeakerCount: number;
  recommendedSpeakerCount: number;
  defaultSpeakerIds: readonly string[];
  buildSystemMessage(): string;
  buildSeedUserMessage(input: ChatroomRoomTypeSeedInput): string;
  buildSpeakerTurnPrompt(round: number): string;
  buildSummaryPrompt(): string;
  maxReplyCharacters: number;
// Provider-specific function removed

export const DEFAULT_CHATROOM_ROOM_TYPE: ChatroomRoomTypeId = 'expert_discussion';

const expertDiscussionDefaultSpeakerIds = [
  'moderator-chat',
  'strategy-chat',
  'risk-chat',
  'product-chat',
  'research-chat',
  'systems-chat',
  'implementation-chat',
  'ux-chat',
  'data-chat',
  'ops-chat',
  'security-chat',
  'qa-chat',
] as const;

const brainstormWorkshopDefaultSpeakerIds = [
  'moderator-chat',
  'strategy-chat',
  'product-chat',
  'research-chat',
  'implementation-chat',
  'ux-chat',
  'customer-chat',
  'skeptic-chat',
] as const;

const projectDiscussionDefaultSpeakerIds = [
  'moderator-chat',
  'strategy-chat',
  'implementation-chat',
  'systems-chat',
  'ops-chat',
  'qa-chat',
] as const;

const reportSeminarDefaultSpeakerIds = [
  'moderator-chat',
  'research-chat',
  'data-chat',
  'strategy-chat',
  'risk-chat',
  'ux-chat',
] as const;

const roleplayDefaultSpeakerIds = [
  'scene-host-rp',
  'lin-lan-rp',
  'shen-yan-rp',
  'a-jiu-rp',
] as const;

const expertDiscussionRoomType = createAnalysisRoomType({
  id: 'expert_discussion',
  label: 'Expert Discussion',
  shortLabel: 'Expert',
  description:
    'Structured multi-agent expert discussion focused on analysis, critique, convergence, and summary.',
  speakerPreset: 'expert_panel',
  minSpeakerCount: 10,
  maxSpeakerCount: 18,
  recommendedSpeakerCount: 12,
  defaultSpeakerIds: expertDiscussionDefaultSpeakerIds,
  systemDirectives: [
    'The room is created for structured multi-agent analysis.',
    'Participants should stay analytical, reference prior messages when useful, and keep the discussion moving forward.',
  ],
  seedDirectives: [
    'Collaborate in the room and drive toward a practical, executable conclusion.',
    'Prefer Simplified Chinese throughout the discussion.',
  ],
  turnDirectives: [
    'Post one useful message to the shared chatroom.',
    'Use Simplified Chinese, advance the discussion, and avoid repeating what is already obvious.',
  ],
  maxReplyCharacters: 900,
// Provider-specific function removed);

const brainstormWorkshopRoomType = createAnalysisRoomType({
  id: 'brainstorm_workshop',
  label: 'Brainstorm Workshop',
  shortLabel: 'Ideas',
  description:
    'A multi-agent ideation room that explores multiple directions first, then clusters and sharpens promising concepts.',
  speakerPreset: 'expert_panel',
  minSpeakerCount: 6,
  maxSpeakerCount: 12,
  recommendedSpeakerCount: 8,
  defaultSpeakerIds: brainstormWorkshopDefaultSpeakerIds,
  topicLabel: 'Challenge',
  objectiveLabel: 'Desired outcome',
  systemDirectives: [
    'The room is created for structured brainstorming and concept generation.',
    'Participants should expand the solution space, combine ideas, stress-test novelty, and avoid premature convergence.',
  ],
  seedDirectives: [
    'Generate multiple distinct angles before narrowing down.',
    'Build on each other, surface surprising options, and keep the room in Simplified Chinese.',
  ],
  turnDirectives: [
    'Post one useful idea, combination, reframing, or critique to the shared chatroom.',
    'Use Simplified Chinese, keep it concrete, and do not jump straight to a final answer too early.',
  ],
  maxReplyCharacters: 900,
  summaryDirectives: [
    'Read the full brainstorming room discussion from runtime context.',
    'Produce a final structured summary in Simplified Chinese.',
    'Highlight promising directions, risky ideas worth parking, and the next experiments or prototypes to try.',
  ],
// Provider-specific function removed);

const projectDiscussionRoomType = createAnalysisRoomType({
  id: 'project_discussion',
  label: 'Project Discussion',
  shortLabel: 'Project',
  description:
    'A focused project development discussion where specialists track decisions, action items, and blockers across rounds.',
  speakerPreset: 'expert_panel',
  minSpeakerCount: 4,
  maxSpeakerCount: 10,
  recommendedSpeakerCount: 6,
  defaultSpeakerIds: projectDiscussionDefaultSpeakerIds,
  topicLabel: 'Project',
  objectiveLabel: 'Goal for this discussion',
  systemDirectives: [
    'This room is a project development discussion.',
    'Participants should surface decisions, track action items, identify blockers, and keep the project moving forward.',
  ],
  seedDirectives: [
    'Focus on concrete decisions and next steps.',
    'Use Simplified Chinese, keep the discussion actionable.',
  ],
  turnDirectives: [
    'Post one actionable message: a decision proposal, blocker alert, status update, or clarification.',
    'Use Simplified Chinese, stay concrete, and avoid repeating what is already decided.',
  ],
  summaryDirectives: [
    'Read the full project discussion from runtime context.',
    'Produce a final structured summary in Simplified Chinese.',
    'Highlight decisions made, open action items, blockers, and next steps.',
  ],
// Provider-specific function removed);

const reportSeminarRoomType = createAnalysisRoomType({
  id: 'report_seminar',
  label: 'Report Seminar',
  shortLabel: 'Seminar',
  description:
    'A structured review seminar where presenters share findings and reviewers provide critique, synthesis, and recommendations.',
  speakerPreset: 'expert_panel',
  minSpeakerCount: 4,
  maxSpeakerCount: 10,
  recommendedSpeakerCount: 6,
  defaultSpeakerIds: reportSeminarDefaultSpeakerIds,
  topicLabel: 'Report',
  objectiveLabel: 'Review objective',
  systemDirectives: [
    'This room is a structured report seminar.',
    'Presenters share findings; reviewers critique, identify gaps, and synthesize recommendations.',
  ],
  seedDirectives: [
    'Review the report critically, identify strengths and gaps.',
    'Use Simplified Chinese, provide constructive and specific feedback.',
  ],
  turnDirectives: [
    'Post one review contribution: a critique, gap identification, supporting evidence, or synthesis point.',
    'Use Simplified Chinese, be specific, and reference the report content.',
  ],
  summaryDirectives: [
    'Read the full seminar discussion from runtime context.',
    'Produce a final structured summary in Simplified Chinese.',
    'Highlight key findings, critical gaps, consensus points, and actionable recommendations.',
  ],
// Provider-specific function removed);

const roleplaySceneRoomType = createRoleplayRoomType({
  id: 'roleplay_scene',
  label: 'Roleplay Scene',
  shortLabel: 'RP',
  description:
    'A live multi-character roleplay room where agents stay in character, react to the user, and move the scene forward through dialogue.',
  speakerPreset: 'roleplay_cast',
  minSpeakerCount: 3,
  maxSpeakerCount: 12,
  recommendedSpeakerCount: 4,
  defaultSpeakerIds: roleplayDefaultSpeakerIds,
  systemDirectives: [
    'This room is a live in-character roleplay scene.',
    'Participants must stay in character, react like people inside the world, and keep the scene alive through dialogue, emotion, and small actions.',
  ],
  seedDirectives: [
    'Stay in character.',
    'Treat the room as a real shared scene, not an analysis exercise.',
    'If the user speaks, react as if they are inside the scene with you.',
  ],
  turnDirectives: [
    'Post exactly one in-character message to the shared room.',
    'Use Simplified Chinese, avoid analysis, and move the scene with dialogue, mood, or a small action.',
  ],
  maxReplyCharacters: 2000,
// Provider-specific function removed);

const roomTypes = [
  expertDiscussionRoomType,
  brainstormWorkshopRoomType,
  projectDiscussionRoomType,
  reportSeminarRoomType,
  roleplaySceneRoomType,
] as const;

const roomTypeById = new Map(roomTypes.map((spec) => [spec.id, spec] as const));

export function listChatroomRoomTypes(): ChatroomRoomTypeSpec[] {
***REMOVED***...roomTypes];
// Provider-specific function removed

export function getChatroomRoomTypeLabel(
  roomType: ChatroomRoomTypeId | string | undefined,
): string {
  return resolveChatroomRoomType(roomType).label;
// Provider-specific function removed

export function getChatroomRoomTypeShortLabel(
  roomType: ChatroomRoomTypeId | string | undefined,
): string {
  return resolveChatroomRoomType(roomType).shortLabel;
// Provider-specific function removed

export function parseChatroomRoomType(value: string | undefined): ChatroomRoomTypeId | undefined {
  const normalized = value?.trim();
***REMOVED***!normalized) {
    return undefined;
  // Provider-specific function removed

***REMOVED***!roomTypeById.has(normalized as ChatroomRoomTypeId)) {
    throw new Error(
      `Invalid room type "${value// Provider-specific function removed". Expected one of: ${CHATROOM_ROOM_TYPE_IDS.join(', ')// Provider-specific function removed.`,
    );
  // Provider-specific function removed

  return normalized as ChatroomRoomTypeId;
// Provider-specific function removed

export function resolveChatroomRoomType(
  roomType: ChatroomRoomTypeId | string | undefined,
): ChatroomRoomTypeSpec {
  const normalized = normalizeChatroomRoomType(roomType);
  return roomTypeById.get(normalized) ?? expertDiscussionRoomType;
// Provider-specific function removed

export function normalizeChatroomRoomType(
  roomType: ChatroomRoomTypeId | string | undefined,
): ChatroomRoomTypeId {
  return roomTypeById.has(roomType as ChatroomRoomTypeId)
    ? (roomType as ChatroomRoomTypeId)
    : DEFAULT_CHATROOM_ROOM_TYPE;
// Provider-specific function removed
