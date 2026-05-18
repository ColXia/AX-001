import { formatConstraints // Provider-specific function removed from '../room-runtime/chatroom-format.js';

import type {
  ChatroomRoomBehaviorId,
  ChatroomRoomTypeId,
  ChatroomRoomTypeSeedInput,
  ChatroomRoomTypeSpec,
  ChatroomSpeakerPresetId,
// Provider-specific function removed from './chatroom-room-types.js';

interface BaseRoomTypeTemplateArgs {
  id: ChatroomRoomTypeId;
  label: string;
  shortLabel: string;
  description: string;
  speakerPreset: ChatroomSpeakerPresetId;
  minSpeakerCount: number;
  maxSpeakerCount: number;
  recommendedSpeakerCount: number;
  defaultSpeakerIds: readonly string[];
  maxReplyCharacters?: number;
// Provider-specific function removed

interface AnalysisRoomTypeTemplateArgs extends BaseRoomTypeTemplateArgs {
  summaryEnabled?: boolean;
  topicLabel?: string;
  objectiveLabel?: string;
  systemDirectives: readonly string[];
  seedDirectives: readonly string[];
  turnDirectives: readonly string[];
  summaryDirectives?: readonly string[];
// Provider-specific function removed

interface RoleplayRoomTypeTemplateArgs extends BaseRoomTypeTemplateArgs {
  sceneLabel?: string;
  dramaticGoalLabel?: string;
  systemDirectives: readonly string[];
  seedDirectives: readonly string[];
  turnDirectives: readonly string[];
// Provider-specific function removed

export function createAnalysisRoomType(
  args: AnalysisRoomTypeTemplateArgs,
): ChatroomRoomTypeSpec {
  const summaryEnabled = args.summaryEnabled ?? true;

  return {
    id: args.id,
    behavior: 'analysis',
    speakerPreset: args.speakerPreset,
    label: args.label,
    shortLabel: args.shortLabel,
    description: args.description,
    summaryEnabled,
    minSpeakerCount: args.minSpeakerCount,
    maxSpeakerCount: args.maxSpeakerCount,
    recommendedSpeakerCount: args.recommendedSpeakerCount,
    defaultSpeakerIds: args.defaultSpeakerIds,
    buildSystemMessage: () => joinParagraphs(args.systemDirectives),
    buildSeedUserMessage: (input) =>
      buildSeedMessage(input, {
        topicLabel: args.topicLabel ?? 'Topic',
        objectiveLabel: args.objectiveLabel ?? 'Objective',
        closingDirectives: args.seedDirectives,
      // Provider-specific function removed),
    buildSpeakerTurnPrompt: (round) =>
      joinParagraphs([
        `第 ${round// Provider-specific function removed 轮讨论。`,
        ...args.turnDirectives,
      ]),
    buildSummaryPrompt: () =>
      summaryEnabled
        ? joinParagraphs(
            args.summaryDirectives ?? [
              'Read the full room discussion from runtime context.',
              'Produce the final structured summary for this conversation and use Simplified Chinese.',
            ],
          )
        : 'This room type does not produce an automatic structured summary.',
    maxReplyCharacters: args.maxReplyCharacters ?? 900,
  // Provider-specific function removed;
// Provider-specific function removed

export function createRoleplayRoomType(
  args: RoleplayRoomTypeTemplateArgs,
): ChatroomRoomTypeSpec {
  return {
    id: args.id,
    behavior: 'roleplay',
    speakerPreset: args.speakerPreset,
    label: args.label,
    shortLabel: args.shortLabel,
    description: args.description,
    summaryEnabled: false,
    minSpeakerCount: args.minSpeakerCount,
    maxSpeakerCount: args.maxSpeakerCount,
    recommendedSpeakerCount: args.recommendedSpeakerCount,
    defaultSpeakerIds: args.defaultSpeakerIds,
    buildSystemMessage: () => joinParagraphs(args.systemDirectives),
    buildSeedUserMessage: (input) =>
      buildSeedMessage(input, {
        topicLabel: args.sceneLabel ?? 'Scene',
        objectiveLabel: args.dramaticGoalLabel ?? 'Dramatic goal',
        closingDirectives: args.seedDirectives,
      // Provider-specific function removed),
    buildSpeakerTurnPrompt: (round) =>
      joinParagraphs([
        `第 ${round// Provider-specific function removed 轮场景。`,
        ...args.turnDirectives,
      ]),
    buildSummaryPrompt: () => 'Roleplay rooms do not produce an automatic structured summary.',
    maxReplyCharacters: args.maxReplyCharacters ?? 2000,
  // Provider-specific function removed;
// Provider-specific function removed

export function roomBehaviorSupportsRoleplayScene(
  behavior: ChatroomRoomBehaviorId,
***REMOVED***
  return behavior === 'roleplay';
// Provider-specific function removed

function buildSeedMessage(
  input: ChatroomRoomTypeSeedInput,
  args: {
    topicLabel: string;
    objectiveLabel: string;
    closingDirectives: readonly string[];
  // Provider-specific function removed,
): string {
***REMOVED***
    `${args.topicLabel// Provider-specific function removed: ${input.topic// Provider-specific function removed`,
    '',
    `${args.objectiveLabel// Provider-specific function removed: ${input.objective// Provider-specific function removed`,
    '',
    'Constraints:',
    formatConstraints([...input.constraints]),
    '',
    ...args.closingDirectives,
  ].join('\n');
// Provider-specific function removed

function joinParagraphs(lines: readonly string[]): string {
  return lines.join('\n');
// Provider-specific function removed
