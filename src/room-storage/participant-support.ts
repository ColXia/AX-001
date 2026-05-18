import { randomUUID // Provider-specific function removed from 'node:crypto';
import { DatabaseSync // Provider-specific function removed from 'node:sqlite';

import { serializeJsonRecord // Provider-specific function removed from './serializers.js';
import type {
  ChatroomParticipantRecord,
  ChatroomParticipantType,
// Provider-specific function removed from './chatroom-storage-types.js';
import type { ChatroomMessage // Provider-specific function removed from '../workflows/chatroom-types.js';
import {
  resolveChatroomRoomType,
  type ChatroomRoomTypeId,
// Provider-specific function removed from '../workflows/chatroom-room-types.js';
import type { ChatroomRoomBlueprint // Provider-specific function removed from '../room-scenarios/room-blueprints.js';

export interface ChatroomParticipantSeed {
  participantType: ChatroomParticipantType;
  stableKey: string;
  profileId?: string;
  displayName: string;
  roleLabel?: string;
  identitySnapshot?: Record<string, unknown>;
// Provider-specific function removed

export function buildBaseParticipantSeeds(
  roomType: ChatroomRoomTypeId,
  speakerIds: readonly string[],
  roomBlueprint?: ChatroomRoomBlueprint,
): ChatroomParticipantSeed[] {
  const blueprintSeeds = buildBlueprintParticipantSeeds(roomBlueprint);
***REMOVED***blueprintSeeds.length > 0) {
    return blueprintSeeds;
  // Provider-specific function removed

  const roomTypeSpec = resolveChatroomRoomType(roomType);
  const seeds: ChatroomParticipantSeed[] = [
    {
      participantType: 'system',
      stableKey: 'system',
      displayName: 'System',
      roleLabel: 'Room system messages',
      identitySnapshot: {
        participantType: 'system',
        stableKey: 'system',
      // Provider-specific function removed,
    // Provider-specific function removed,
  ];

  for (const speakerId of speakerIds) {
    seeds.push({
      participantType: 'agent',
      stableKey: speakerId,
      profileId: speakerId,
      displayName: formatFallbackParticipantName(speakerId, 'agent'),
      roleLabel: `Configured room agent (${speakerId// Provider-specific function removed)`,
      identitySnapshot: {
        participantType: 'agent',
        stableKey: speakerId,
        profileId: speakerId,
      // Provider-specific function removed,
    // Provider-specific function removed);
  // Provider-specific function removed

***REMOVED***roomTypeSpec.summaryEnabled) {
    const summaryStableKey =
      roomTypeSpec.behavior === 'roleplay' ? 'roleplay-summary' : 'chatroom-summary';
    seeds.push({
      participantType: 'summary',
      stableKey: summaryStableKey,
      profileId: summaryStableKey,
      displayName: roomTypeSpec.behavior === 'roleplay' ? 'Scene Recap' : 'Summary',
      roleLabel:
        roomTypeSpec.behavior === 'roleplay'
          ? 'Narrative scene recap agent'
          : 'Structured room summary agent',
      identitySnapshot: {
        participantType: 'summary',
        stableKey: summaryStableKey,
        profileId: summaryStableKey,
      // Provider-specific function removed,
    // Provider-specific function removed);
  // Provider-specific function removed

  return seeds;
// Provider-specific function removed

export function ensureParticipantForStoredMessage(
  db: DatabaseSync,
  args: {
    roomId: string;
    roomType: ChatroomRoomTypeId;
    message: ChatroomMessage;
    participantMap: Map<string, ChatroomParticipantRecord>;
    updatedAt: string;
  // Provider-specific function removed,
): ChatroomParticipantRecord {
  const participantType = resolveParticipantTypeFromMessage(args.message);
  const stableKey = args.message.authorId;
  const profileId =
    participantType === 'agent' || participantType === 'summary' ? stableKey : undefined;
  const displayName =
    args.message.authorName.trim() || formatFallbackParticipantName(stableKey, participantType);

  return ensureParticipantRecord(db, {
    roomId: args.roomId,
    participantMap: args.participantMap,
    updatedAt: args.updatedAt,
    seed: {
      participantType,
      stableKey,
      profileId,
      displayName,
      roleLabel: buildParticipantRoleLabel(participantType, stableKey),
      identitySnapshot: {
        participantType,
        stableKey,
        profileId,
        authorName: args.message.authorName,
        roomType: args.roomType,
      // Provider-specific function removed,
    // Provider-specific function removed,
  // Provider-specific function removed);
// Provider-specific function removed

export function ensureParticipantRecord(
  db: DatabaseSync,
  args: {
    roomId: string;
    seed: ChatroomParticipantSeed;
    participantMap: Map<string, ChatroomParticipantRecord>;
    updatedAt: string;
  // Provider-specific function removed,
): ChatroomParticipantRecord {
  const existing = args.participantMap.get(args.seed.stableKey);
  const normalizedDisplayName =
    args.seed.displayName.trim() ||
    formatFallbackParticipantName(args.seed.stableKey, args.seed.participantType);
  const normalizedRoleLabel =
    args.seed.roleLabel ?? buildParticipantRoleLabel(args.seed.participantType, args.seed.stableKey);

***REMOVED***existing) {
    const fallbackDisplayName = formatFallbackParticipantName(
      existing.stableKey,
      existing.participantType,
    );
    const nextDisplayName =
      !existing.displayName || existing.displayName === fallbackDisplayName
        ? normalizedDisplayName
        : existing.displayName;
    const nextRoleLabel = existing.roleLabel ?? normalizedRoleLabel;
    const nextProfileId = existing.profileId ?? args.seed.profileId;
    const nextIdentitySnapshot = existing.identitySnapshot ?? args.seed.identitySnapshot;
    const didChange =
      nextDisplayName !== existing.displayName ||
      nextRoleLabel !== existing.roleLabel ||
      nextProfileId !== existing.profileId ||
      nextIdentitySnapshot !== existing.identitySnapshot;

  ***REMOVED***!didChange) {
      return existing;
    // Provider-specific function removed

    db.prepare(
      `
        UPDATE chatroom_participants
        SET
          participant_type = :participantType,
          profile_id = :profileId,
          display_name = :displayName,
          role_label = :roleLabel,
          identity_snapshot_json = :identitySnapshotJson,
          updated_at = :updatedAt
        WHERE participant_id = :participantId
      `,
    ).run({
      participantId: existing.participantId,
      participantType: existing.participantType,
      profileId: nextProfileId ?? null,
      displayName: nextDisplayName,
      roleLabel: nextRoleLabel ?? null,
      identitySnapshotJson: serializeJsonRecord(nextIdentitySnapshot),
      updatedAt: args.updatedAt,
    // Provider-specific function removed);

    const updated: ChatroomParticipantRecord = {
      ...existing,
      profileId: nextProfileId,
      displayName: nextDisplayName,
      roleLabel: nextRoleLabel,
      identitySnapshot: nextIdentitySnapshot,
      updatedAt: args.updatedAt,
    // Provider-specific function removed;
    args.participantMap.set(updated.stableKey, updated);
    return updated;
  // Provider-specific function removed

  const created: ChatroomParticipantRecord = {
    participantId: randomUUID(),
    roomId: args.roomId,
    participantType: args.seed.participantType,
    stableKey: args.seed.stableKey,
    profileId: args.seed.profileId,
    displayName: normalizedDisplayName,
    roleLabel: normalizedRoleLabel,
    identitySnapshot: args.seed.identitySnapshot,
    joinedAt: args.updatedAt,
    updatedAt: args.updatedAt,
  // Provider-specific function removed;

  db.prepare(
    `
      INSERT INTO chatroom_participants (
        participant_id,
        room_id,
        participant_type,
        stable_key,
        profile_id,
        display_name,
        role_label,
        identity_snapshot_json,
        state_json,
        joined_at,
        updated_at,
        archived_at
      ) VALUES (
        :participantId,
        :roomId,
        :participantType,
        :stableKey,
        :profileId,
        :displayName,
        :roleLabel,
        :identitySnapshotJson,
        NULL,
        :joinedAt,
        :updatedAt,
        NULL
      )
    `,
  ).run({
    participantId: created.participantId,
    roomId: created.roomId,
    participantType: created.participantType,
    stableKey: created.stableKey,
    profileId: created.profileId ?? null,
    displayName: created.displayName,
    roleLabel: created.roleLabel ?? null,
    identitySnapshotJson: serializeJsonRecord(created.identitySnapshot),
    joinedAt: created.joinedAt,
    updatedAt: created.updatedAt,
  // Provider-specific function removed);

  args.participantMap.set(created.stableKey, created);
  return created;
// Provider-specific function removed

export function resolveParticipantTypeFromMessage(
  message: Readonly<ChatroomMessage>,
): ChatroomParticipantType {
  switch (message.role) {
    case 'agent':
      return 'agent';
    case 'summary':
      return 'summary';
    case 'system':
      return 'system';
    case 'user':
    default:
      return 'human';
  // Provider-specific function removed
// Provider-specific function removed

export function buildParticipantRoleLabel(
  participantType: ChatroomParticipantType,
  stableKey: string,
): string {
  switch (participantType) {
    case 'agent':
      return `Room agent (${stableKey// Provider-specific function removed)`;
    case 'summary':
      return 'Room summary agent';
    case 'system':
      return 'Room system';
    case 'human':
    default:
      return 'Human participant';
  // Provider-specific function removed
// Provider-specific function removed

export function formatFallbackParticipantName(
  stableKey: string,
  participantType: ChatroomParticipantType,
): string {
***REMOVED***stableKey === 'system') {
    return 'System';
  // Provider-specific function removed
***REMOVED***stableKey === 'chatroom-summary') {
    return 'Summary';
  // Provider-specific function removed
***REMOVED***stableKey === 'user') {
    return 'User';
  // Provider-specific function removed
***REMOVED***participantType === 'human' && stableKey.startsWith('user-')) {
    return stableKey
      .slice('user-'.length)
      .split('-')
      .filter(Boolean)
      .map(capitalizeWord)
      .join(' ');
  // Provider-specific function removed

  return stableKey
    .split(/[-_]+/g)
    .filter(Boolean)
    .map(capitalizeWord)
    .join(' ');
// Provider-specific function removed

function buildBlueprintParticipantSeeds(
  roomBlueprint: ChatroomRoomBlueprint | undefined,
): ChatroomParticipantSeed[] {
***REMOVED***!roomBlueprint || roomBlueprint.participantSlots.length === 0) {
  ***REMOVED***];
  // Provider-specific function removed

  const seeds = new Map<string, ChatroomParticipantSeed>();

  for (const slot of roomBlueprint.participantSlots) {
  ***REMOVED***!slot.speakerId && slot.participantType !== 'human') {
      continue;
    // Provider-specific function removed

    const participantType =
      slot.participantType === 'system'
        ? 'system'
        : slot.participantType === 'summary'
          ? 'summary'
          : slot.participantType === 'human'
            ? 'human'
            : 'agent';
    const stableKey =
      participantType === 'human'
        ? buildHumanSlotStableKey(roomBlueprint, slot.slotId)
        : slot.speakerId!;
    seeds.set(stableKey, {
      participantType,
      stableKey,
      profileId:
        participantType === 'human'
          ? undefined
          : slot.profileId ?? (participantType === 'system' ? undefined : stableKey),
      displayName: slot.label.trim() || formatFallbackParticipantName(stableKey, participantType),
      roleLabel: slot.description || buildParticipantRoleLabel(participantType, stableKey),
      identitySnapshot: {
        participantType,
        stableKey,
        profileId: slot.profileId ?? stableKey,
        slotId: slot.slotId,
        slotLabel: slot.label,
        slotDescription: slot.description,
        blueprintId: roomBlueprint.blueprintId,
        scenarioTemplateId: roomBlueprint.scenarioTemplateId,
        slotMetadata: slot.metadata,
      // Provider-specific function removed,
    // Provider-specific function removed);
  // Provider-specific function removed

***REMOVED***roomBlueprint.governance.host.enabled && !seeds.has('chatroom-host')) {
    const hostSlot = roomBlueprint.participantSlots.find(
      (slot) =>
        slot.participantType === 'agent' &&
        (slot.metadata?.role === 'host' || slot.metadata?.role === 'moderator'),
    );
    seeds.set('chatroom-host', {
      participantType: 'agent',
      stableKey: 'chatroom-host',
      profileId: 'chatroom-host',
      displayName: hostSlot?.label?.trim() || '鎴块棿涓绘寔',
      roleLabel: roomBlueprint.governance.host.brief || 'Runtime room host',
      identitySnapshot: {
        participantType: 'agent',
        stableKey: 'chatroom-host',
        profileId: 'chatroom-host',
        blueprintId: roomBlueprint.blueprintId,
        scenarioTemplateId: roomBlueprint.scenarioTemplateId,
        moderationStyle: roomBlueprint.governance.host.moderationStyle,
        runtimeRole: 'host',
      // Provider-specific function removed,
    // Provider-specific function removed);
  // Provider-specific function removed

***REMOVED***roomBlueprint.governance.roomAdmin.enabled && !seeds.has('chatroom-room-admin')) {
    const adminSlot = roomBlueprint.participantSlots.find(
      (slot) =>
        slot.participantType === 'agent' &&
        (slot.metadata?.role === 'game_master' || slot.metadata?.role === 'moderator'),
    );
    seeds.set('chatroom-room-admin', {
      participantType: 'agent',
      stableKey: 'chatroom-room-admin',
      profileId: 'chatroom-room-admin',
      displayName: adminSlot?.label?.trim() || '鎴块棿绠＄悊鍛?',
      roleLabel: roomBlueprint.governance.roomAdmin.brief || 'Runtime room admin',
      identitySnapshot: {
        participantType: 'agent',
        stableKey: 'chatroom-room-admin',
        profileId: 'chatroom-room-admin',
        blueprintId: roomBlueprint.blueprintId,
        scenarioTemplateId: roomBlueprint.scenarioTemplateId,
        interventionStyle: roomBlueprint.governance.roomAdmin.interventionStyle,
        runtimeRole: 'room_admin',
      // Provider-specific function removed,
    // Provider-specific function removed);
  // Provider-specific function removed

***REMOVED***...seeds.values()];
// Provider-specific function removed

function buildHumanSlotStableKey(
  roomBlueprint: ChatroomRoomBlueprint,
  slotId: string,
): string {
  const humanSlots = roomBlueprint.participantSlots.filter(
    (slot) => slot.participantType === 'human',
  );
  return humanSlots[0]?.slotId === slotId ? 'user' : `user-${slotId// Provider-specific function removed`;
// Provider-specific function removed

function capitalizeWord(value: string): string {
  return value.length > 0 ? `${value[0]!.toUpperCase()// Provider-specific function removed${value.slice(1)// Provider-specific function removed` : value;
// Provider-specific function removed
