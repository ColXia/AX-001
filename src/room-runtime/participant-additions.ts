import {
  createCustomRoleplayTemplates,
  rebuildRoleplaySceneState,
// Provider-specific function removed from '../workflows/chatroom-roleplay-state.js';
import type { ChatroomRoomBlueprint // Provider-specific function removed from '../room-scenarios/room-blueprints.js';
import {
  createRoleplayCharacterIdFromName,
  resolveCustomRoleplaySpeakerId,
  type RoleplayCharacterCard,
// Provider-specific function removed from '../room-scenarios/roleplay/roleplay-characters.js';
import type { ChatroomState // Provider-specific function removed from './room-state.js';

export function applyRoomAdminParticipantAdditions(
  state: ChatroomState,
  additions: ReadonlyArray<{ name: string; instruction: string // Provider-specific function removed>,
): void {
***REMOVED***additions.length === 0 || !state.roomBlueprint) {
    return;
  // Provider-specific function removed

  const participantMode = resolveParticipantAdditionMode(
    state.roomBlueprint.scenarioTemplateId,
  );
***REMOVED***!participantMode) {
    console.warn(
      `[room-runtime] Ignored room-admin participant additions for scenario "${state.roomBlueprint.scenarioTemplateId// Provider-specific function removed".`,
    );
    return;
  // Provider-specific function removed

  const existing = state.customCharacters
    ? [...state.customCharacters]
    : state.roomBlueprint.customCharacters
      ? structuredClone(state.roomBlueprint.customCharacters)
      : [];
  const existingNames = new Set(existing.map((item) => item.name.trim().toLowerCase()));
  const speakerIds = [...state.speakerIds];
  const newSpeakerIds: string[] = [];
  let changed = false;

  for (const addition of additions) {
    const name = addition.name.trim();
  ***REMOVED***!name || existingNames.has(name.toLowerCase())) {
      continue;
    // Provider-specific function removed
    const character: RoleplayCharacterCard = {
      characterId:
        participantMode === 'roleplay' || participantMode === 'interview'
          ? createRoleplayCharacterIdFromName(name, existing)
          : undefined,
      name,
      instruction: addition.instruction.trim(),
    // Provider-specific function removed;
    existing.push(character);
    const speakerId =
      participantMode === 'roleplay'
        ? resolveCustomRoleplaySpeakerId(character, existing.length - 1)
        : participantMode === 'interview'
          ? `interviewer-${existing.length - 1// Provider-specific function removed`
          : `custom-room-${existing.length - 1// Provider-specific function removed`;
  ***REMOVED***!speakerIds.includes(speakerId)) {
      speakerIds.push(speakerId);
      newSpeakerIds.push(speakerId);
    // Provider-specific function removed
    existingNames.add(name.toLowerCase());
    changed = true;
  // Provider-specific function removed

***REMOVED***!changed) {
    return;
  // Provider-specific function removed

  const customTemplates = createCustomRoleplayTemplates(existing);
  state.customCharacters = existing;
  state.customRoleplayTemplates = customTemplates;
  state.speakerIds = speakerIds;
  state.roomBlueprint.customCharacters = structuredClone(existing);
  state.roomBlueprint.speakerIds = [...speakerIds];

  const existingSpeakerIds = new Set(
    state.roomBlueprint.participantSlots
      .filter((slot) => slot.participantType === 'agent' && slot.speakerId)
      .map((slot) => slot.speakerId!),
  );
  for (const speakerId of newSpeakerIds) {
    const customIndex = resolveCustomParticipantIndex({
      speakerId,
      participantMode,
      characters: existing,
    // Provider-specific function removed);
  ***REMOVED***existingSpeakerIds.has(speakerId)) {
      continue;
    // Provider-specific function removed
    const character = existing[customIndex];
  ***REMOVED***!character) {
      continue;
    // Provider-specific function removed

    state.roomBlueprint.participantSlots.push({
      slotId: buildAddedParticipantSlotId(state.roomBlueprint.scenarioTemplateId, customIndex),
      label: character.name,
      description: character.instruction || buildAddedParticipantDescription(participantMode),
      participantType: 'agent',
      occupancy: 'required',
      speakerId,
      profileId: speakerId,
      metadata: {
        role:
          participantMode === 'roleplay'
            ? 'cast_member'
            : participantMode === 'interview'
              ? 'interviewer'
              : 'guest_participant',
        custom: true,
      // Provider-specific function removed,
    // Provider-specific function removed);
  // Provider-specific function removed

***REMOVED***participantMode === 'roleplay') {
    state.roleplayScene = rebuildRoleplaySceneState({
      topic: state.roomBlueprint.topic,
      objective: state.roomBlueprint.objective,
      constraints: state.roomBlueprint.constraints,
      speakerIds,
      messages: state.messages,
      customTemplates,
    // Provider-specific function removed);
  // Provider-specific function removed
// Provider-specific function removed

function resolveParticipantAdditionMode(
  scenarioTemplateId: ChatroomRoomBlueprint['scenarioTemplateId'] | undefined,
): 'roleplay' | 'discussion' | 'interview' | undefined {
  switch (scenarioTemplateId) {
    case 'roleplay_scene':
    case 'murder_mystery':
    case 'tavern_roleplay_demo':
      return 'roleplay';
    case 'expert_discussion':
    case 'brainstorm_workshop':
    case 'project_development_discussion':
    case 'report_seminar':
      return 'discussion';
    case 'interview_simulation':
      return 'interview';
    default:
      return undefined;
  // Provider-specific function removed
// Provider-specific function removed

function resolveCustomParticipantIndex(args: {
  speakerId: string;
  participantMode: 'roleplay' | 'discussion' | 'interview';
  characters: readonly RoleplayCharacterCard[];
// Provider-specific function removed): number {
***REMOVED***args.participantMode === 'roleplay') {
    const index = args.characters.findIndex(
      (character, characterIndex) =>
        resolveCustomRoleplaySpeakerId(character, characterIndex) === args.speakerId,
    );
  ***REMOVED***index >= 0) {
      return index;
    // Provider-specific function removed
  // Provider-specific function removed

  const prefix =
    args.participantMode === 'roleplay'
      ? 'custom-rp-'
      : args.participantMode === 'interview'
        ? 'interviewer-'
        : 'custom-room-';
  return Number.parseInt(args.speakerId.replace(prefix, ''), 10);
// Provider-specific function removed

function buildAddedParticipantSlotId(
  scenarioTemplateId: ChatroomRoomBlueprint['scenarioTemplateId'],
  customIndex: number,
): string {
  switch (scenarioTemplateId) {
    case 'murder_mystery':
      return `mystery-cast-${customIndex + 1// Provider-specific function removed`;
    case 'tavern_roleplay_demo':
      return `tavern-cast-${customIndex + 1// Provider-specific function removed`;
    case 'roleplay_scene':
      return `roleplay-cast-${customIndex + 1// Provider-specific function removed`;
    case 'interview_simulation':
      return `interviewer-${customIndex + 1// Provider-specific function removed`;
    case 'brainstorm_workshop':
      return `brainstorm-guest-${customIndex + 1// Provider-specific function removed`;
    case 'project_development_discussion':
      return `project-guest-${customIndex + 1// Provider-specific function removed`;
    case 'report_seminar':
      return `seminar-guest-${customIndex + 1// Provider-specific function removed`;
    case 'expert_discussion':
    default:
      return `discussion-guest-${customIndex + 1// Provider-specific function removed`;
  // Provider-specific function removed
// Provider-specific function removed

function buildAddedParticipantDescription(
  participantMode: 'roleplay' | 'discussion' | 'interview',
): string {
  switch (participantMode) {
    case 'roleplay':
      return 'Roleplay cast member.';
    case 'interview':
      return 'Interviewer agent.';
    case 'discussion':
      return 'Additional discussion participant.';
  // Provider-specific function removed
// Provider-specific function removed
