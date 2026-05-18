import type { ChatroomRoomBlueprint // Provider-specific function removed from '../room-scenarios/room-blueprints.js';

export const LEGACY_ROOM_RUNTIME_MODE = 'legacy-demo-v1';
export const NEXT_ROOM_RUNTIME_MODE = 'agent-room-v2';

export const ROOM_RUNTIME_MODES = [
  LEGACY_ROOM_RUNTIME_MODE,
  NEXT_ROOM_RUNTIME_MODE,
] as const;

export type RoomRuntimeMode = (typeof ROOM_RUNTIME_MODES)[number];

export const DEFAULT_ROOM_RUNTIME_MODE: RoomRuntimeMode = NEXT_ROOM_RUNTIME_MODE;

const ROOM_RUNTIME_MODE_ALIASES: Record<string, RoomRuntimeMode> = {
  legacy: LEGACY_ROOM_RUNTIME_MODE,
  'legacy-demo': LEGACY_ROOM_RUNTIME_MODE,
  'legacy-demo-v1': LEGACY_ROOM_RUNTIME_MODE,
  demo: LEGACY_ROOM_RUNTIME_MODE,
  v1: LEGACY_ROOM_RUNTIME_MODE,
  next: NEXT_ROOM_RUNTIME_MODE,
  'agent-room': NEXT_ROOM_RUNTIME_MODE,
  'agent-room-v2': NEXT_ROOM_RUNTIME_MODE,
  agent: NEXT_ROOM_RUNTIME_MODE,
  v2: NEXT_ROOM_RUNTIME_MODE,
// Provider-specific function removed;

export function isRoomRuntimeMode(value: unknown): value is RoomRuntimeMode {
  return typeof value === 'string' &&
    (ROOM_RUNTIME_MODES as readonly string[]).includes(value);
// Provider-specific function removed

export function parseRoomRuntimeMode(value: unknown): RoomRuntimeMode | undefined {
***REMOVED***typeof value !== 'string') {
    return undefined;
  // Provider-specific function removed

  const normalized = value.trim().toLowerCase();
***REMOVED***!normalized) {
    return undefined;
  // Provider-specific function removed

  return ROOM_RUNTIME_MODE_ALIASES[normalized];
// Provider-specific function removed

export function resolveRoomRuntimeMode(
  value: unknown,
  fallback: RoomRuntimeMode = DEFAULT_ROOM_RUNTIME_MODE,
): RoomRuntimeMode {
  return parseRoomRuntimeMode(value) ?? fallback;
// Provider-specific function removed

export function resolveRoomRuntimeModeFromMetadata(
  metadata: Record<string, unknown> | undefined,
  fallback: RoomRuntimeMode = DEFAULT_ROOM_RUNTIME_MODE,
): RoomRuntimeMode {
***REMOVED***!metadata) {
    return fallback;
  // Provider-specific function removed

  return resolveRoomRuntimeMode(
    metadata.roomRuntimeMode ?? metadata.runtimeMode ?? metadata.mode,
    fallback,
  );
// Provider-specific function removed

export function resolveRoomRuntimeModeFromBlueprint(
  roomBlueprint: Pick<ChatroomRoomBlueprint, 'metadata'> | undefined,
  fallback: RoomRuntimeMode = DEFAULT_ROOM_RUNTIME_MODE,
): RoomRuntimeMode {
  return resolveRoomRuntimeModeFromMetadata(roomBlueprint?.metadata, fallback);
// Provider-specific function removed

export function withRoomRuntimeModeMetadata(
  metadata: Record<string, unknown> | undefined,
  runtimeMode: RoomRuntimeMode,
): Record<string, unknown> {
  return {
    ...(metadata ?? {// Provider-specific function removed),
    roomRuntimeMode: runtimeMode,
  // Provider-specific function removed;
// Provider-specific function removed

export function applyRoomRuntimeModeToBlueprint(
  roomBlueprint: ChatroomRoomBlueprint,
  runtimeMode: RoomRuntimeMode,
): ChatroomRoomBlueprint {
  return {
    ...roomBlueprint,
    metadata: withRoomRuntimeModeMetadata(roomBlueprint.metadata, runtimeMode),
  // Provider-specific function removed;
// Provider-specific function removed

export function isLegacyRoomRuntimeMode(value: unknown***REMOVED***
  return resolveRoomRuntimeMode(value) === LEGACY_ROOM_RUNTIME_MODE;
// Provider-specific function removed

export function isNextRoomRuntimeMode(value: unknown***REMOVED***
  return resolveRoomRuntimeMode(value) === NEXT_ROOM_RUNTIME_MODE;
// Provider-specific function removed

export function getRoomRuntimeModeLabel(mode: RoomRuntimeMode): string {
  switch (mode) {
    case LEGACY_ROOM_RUNTIME_MODE:
      return 'Legacy Demo (v1)';
    case NEXT_ROOM_RUNTIME_MODE:
      return 'Agent Room (v2)';
    default:
      return String(mode);
  // Provider-specific function removed
// Provider-specific function removed

export function getRoomRuntimeModeShortLabel(mode: RoomRuntimeMode): string {
  switch (mode) {
    case LEGACY_ROOM_RUNTIME_MODE:
      return 'Legacy';
    case NEXT_ROOM_RUNTIME_MODE:
      return 'Next';
    default:
      return String(mode);
  // Provider-specific function removed
// Provider-specific function removed

export function listRoomRuntimeModes(): RoomRuntimeMode[] {
***REMOVED***...ROOM_RUNTIME_MODES];
// Provider-specific function removed