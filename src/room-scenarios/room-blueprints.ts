import { randomUUID // Provider-specific function removed from 'node:crypto';

import { selectCustomRoleplaySpeakerIds // Provider-specific function removed from '../agents/chatroom-profiles.js';
import {
  normalizeRoleplayCharacterCards,
  type RoleplayCharacterCard,
// Provider-specific function removed from './roleplay/roleplay-characters.js';
import {
  DEFAULT_CHATROOM_ROOM_TYPE,
  type ChatroomRoomTypeId,
  resolveChatroomRoomType,
// Provider-specific function removed from '../workflows/chatroom-room-types.js';
import {
  ROOM_SCENARIO_TEMPLATE_IDS,
  type RoomParticipantSlot,
  type RoomScenarioTemplateId,
  resolveRoomScenarioTemplate,
  resolveRoomScenarioTemplateForRoomType,
// Provider-specific function removed from './scenario-templates.js';

export const INTERVIEW_DEMO_ROOM_TITLE = 'Interview Demo';

export interface RoomBlueprintRuntimeConfig {
  parallelBatchSize?: number;
  summaryEnabled: boolean;
  maxReplyCharacters: number;
// Provider-specific function removed

export type RoomAdminInterventionStyle = 'on_demand' | 'proactive';
export type RoomHostModerationStyle = 'light' | 'structured' | 'strict';
export type RoomRecorderUpdateMode =
  | 'final_only'
  | 'stage_checkpoints'
  | 'continuous';

export interface RoomAdminGovernanceConfig {
  enabled: boolean;
  interventionStyle: RoomAdminInterventionStyle;
  canManageParticipants: boolean;
  canManagePhases: boolean;
  canInjectEvents: boolean;
  brief: string;
// Provider-specific function removed

export interface RoomHostGovernanceConfig {
  enabled: boolean;
  moderationStyle: RoomHostModerationStyle;
  brief: string;
// Provider-specific function removed

export interface RoomRecorderGovernanceConfig {
  enabled: boolean;
  updateMode: RoomRecorderUpdateMode;
  artifactFocus: string[];
  brief: string;
// Provider-specific function removed

export interface RoomBlueprintGovernanceConfig {
  roomAdmin: RoomAdminGovernanceConfig;
  host: RoomHostGovernanceConfig;
  recorder: RoomRecorderGovernanceConfig;
// Provider-specific function removed

export interface RoomBlueprintGovernancePatch {
  roomAdmin?: Partial<RoomAdminGovernanceConfig>;
  host?: Partial<RoomHostGovernanceConfig>;
  recorder?: Partial<RoomRecorderGovernanceConfig>;
// Provider-specific function removed

export interface ChatroomRoomBlueprint {
  version: 1;
  blueprintId: string;
  scenarioTemplateId: RoomScenarioTemplateId;
  roomType: ChatroomRoomTypeId;
  title: string;
  topic: string;
  objective: string;
  constraints: string[];
  speakerIds: string[];
  participantSlots: RoomParticipantSlot[];
  runtimeConfig: RoomBlueprintRuntimeConfig;
  governance: RoomBlueprintGovernanceConfig;
  customCharacters?: RoleplayCharacterCard[];
  metadata?: Record<string, unknown>;
// Provider-specific function removed

export interface LegacyChatroomRoomBlueprintInput {
  roomType?: ChatroomRoomTypeId;
  topic: string;
  objective: string;
  constraints?: string[];
  speakerIds?: string[];
  parallelBatchSize?: number;
  customCharacters?: RoleplayCharacterCard[];
  maxReplyCharacters?: number;
  summaryEnabled?: boolean;
  governance?: RoomBlueprintGovernancePatch;
  metadata?: Record<string, unknown>;
// Provider-specific function removed

export interface CreateChatroomRoomBlueprintInput {
  scenarioTemplateId: RoomScenarioTemplateId;
  roomType?: ChatroomRoomTypeId;
  title?: string;
  topic: string;
  objective: string;
  constraints?: string[];
  speakerIds?: string[];
  participantSlots?: RoomParticipantSlot[];
  runtimeConfig?: Partial<RoomBlueprintRuntimeConfig>;
  governance?: RoomBlueprintGovernancePatch;
  customCharacters?: RoleplayCharacterCard[];
  metadata?: Record<string, unknown>;
// Provider-specific function removed

export function resolveDefaultScenarioMaxReplyCharacters(
  scenarioTemplateId: RoomScenarioTemplateId,
): number {
  switch (scenarioTemplateId) {
    case 'interview_simulation':
      return 1000;
    case 'project_development_discussion':
      return 1400;
    case 'report_seminar':
      return 1200;
    case 'brainstorm_workshop':
      return 1200;
    case 'murder_mystery':
      return 1800;
    case 'tavern_roleplay_demo':
      return 1800;
    case 'roleplay_scene':
      return 2000;
    case 'expert_discussion':
    default:
      return 1000;
  // Provider-specific function removed
// Provider-specific function removed

export function createChatroomRoomBlueprint(
  input: CreateChatroomRoomBlueprintInput,
): ChatroomRoomBlueprint {
  const scenarioTemplate = resolveRoomScenarioTemplate(input.scenarioTemplateId);
  const roomType =
    input.roomType ??
    scenarioTemplate.defaultRoomType ??
    DEFAULT_CHATROOM_ROOM_TYPE;
  const roomTypeSpec = resolveChatroomRoomType(roomType);
  const customCharacters = normalizeCustomCharacters(input.customCharacters);
  const speakerIds =
    roomTypeSpec.behavior === 'roleplay' && customCharacters.length > 0
      ? selectCustomRoleplaySpeakerIds(customCharacters)
      : resolveLegacySpeakerIds(roomType, input.speakerIds);
  const runtimeConfig: RoomBlueprintRuntimeConfig = {
    parallelBatchSize: input.runtimeConfig?.parallelBatchSize,
    summaryEnabled:
      input.runtimeConfig?.summaryEnabled ?? roomTypeSpec.summaryEnabled,
    maxReplyCharacters:
      input.runtimeConfig?.maxReplyCharacters ??
      resolveDefaultScenarioMaxReplyCharacters(scenarioTemplate.id),
  // Provider-specific function removed;
  const governance = resolveRoomBlueprintGovernanceConfig({
    scenarioTemplateId: scenarioTemplate.id,
    roomType,
    summaryEnabled: runtimeConfig.summaryEnabled,
    patch: input.governance,
  // Provider-specific function removed);

  return {
    version: 1,
    blueprintId: randomUUID(),
    scenarioTemplateId: scenarioTemplate.id,
    roomType,
    title: buildBlueprintTitle({
      scenarioTemplateId: scenarioTemplate.id,
      title: input.title,
      topic: input.topic,
    // Provider-specific function removed),
    topic: input.topic,
    objective: input.objective,
    constraints: [...(input.constraints ?? [])],
    speakerIds,
    participantSlots:
      input.participantSlots && input.participantSlots.length > 0
        ? structuredClone(input.participantSlots)
        : scenarioTemplate.buildParticipantSlots?.({
            speakerIds,
            includeSummarySlot: runtimeConfig.summaryEnabled,
            customCharacters,
            topic: input.topic,
            objective: input.objective,
            constraints: input.constraints ?? [],
            metadata: isJsonRecord(input.metadata) ? structuredClone(input.metadata) : undefined,
          // Provider-specific function removed) ?? [],
    runtimeConfig,
    governance,
    customCharacters: customCharacters.length > 0 ? customCharacters : undefined,
    metadata: isJsonRecord(input.metadata) ? structuredClone(input.metadata) : undefined,
  // Provider-specific function removed;
// Provider-specific function removed

export function createChatroomRoomBlueprintFromLegacyInput(
  input: LegacyChatroomRoomBlueprintInput,
): ChatroomRoomBlueprint {
  const roomType = input.roomType ?? DEFAULT_CHATROOM_ROOM_TYPE;
  const scenarioTemplate = resolveRoomScenarioTemplateForRoomType(roomType);

  return createChatroomRoomBlueprint({
    scenarioTemplateId: scenarioTemplate.id,
    roomType,
    topic: input.topic,
    objective: input.objective,
    constraints: input.constraints,
    speakerIds: input.speakerIds,
    runtimeConfig: {
      parallelBatchSize: input.parallelBatchSize,
      summaryEnabled: input.summaryEnabled,
      maxReplyCharacters: input.maxReplyCharacters,
    // Provider-specific function removed,
    governance: input.governance,
    customCharacters: input.customCharacters,
    metadata: {
      source: 'legacy_chatroom',
      ...(input.metadata ?? {// Provider-specific function removed),
    // Provider-specific function removed,
  // Provider-specific function removed);
// Provider-specific function removed

export function parseChatroomRoomBlueprint(
  input: unknown,
): ChatroomRoomBlueprint | undefined {
***REMOVED***!isJsonRecord(input)) {
    return undefined;
  // Provider-specific function removed

***REMOVED***input.version !== 1) {
    return undefined;
  // Provider-specific function removed

  const blueprintId = asTrimmedString(input.blueprintId);
  const scenarioTemplateId = parseScenarioTemplateId(input.scenarioTemplateId);
  const roomType = asTrimmedString(input.roomType) as ChatroomRoomTypeId | undefined;
  const title = asTrimmedString(input.title);
  const topic = asTrimmedString(input.topic);
  const objective = asTrimmedString(input.objective);

***REMOVED***!blueprintId || !scenarioTemplateId || !roomType || !title || !topic || !objective) {
    return undefined;
  // Provider-specific function removed

  const participantSlots = parseParticipantSlots(input.participantSlots);
  const runtimeConfig = parseRuntimeConfig(input.runtimeConfig);
***REMOVED***!runtimeConfig) {
    return undefined;
  // Provider-specific function removed
  const governance = parseGovernanceConfig(input.governance);
***REMOVED***!governance) {
    return undefined;
  // Provider-specific function removed

  return {
    version: 1,
    blueprintId,
    scenarioTemplateId,
    roomType,
    title,
    topic,
    objective,
    constraints: parseStringArray(input.constraints),
    speakerIds: parseStringArray(input.speakerIds),
    participantSlots,
    runtimeConfig,
    governance,
    customCharacters: parseCustomCharacters(input.customCharacters),
    metadata: isJsonRecord(input.metadata) ? structuredClone(input.metadata) : undefined,
  // Provider-specific function removed;
// Provider-specific function removed

export function cloneChatroomRoomBlueprint(
  blueprint: Readonly<ChatroomRoomBlueprint>,
): ChatroomRoomBlueprint {
  return structuredClone(blueprint);
// Provider-specific function removed

export function resolveBlueprintSpeakerIds(
  blueprint: Readonly<ChatroomRoomBlueprint>,
): string[] {
***REMOVED***blueprint.speakerIds.length > 0) {
  ***REMOVED***...blueprint.speakerIds];
  // Provider-specific function removed

  return blueprint.participantSlots
    .filter((slot) => slot.participantType === 'agent' && slot.speakerId)
    .map((slot) => slot.speakerId!);
// Provider-specific function removed

export function ensureChatroomRoomBlueprint(
  blueprint: ChatroomRoomBlueprint | undefined,
  legacyInput: LegacyChatroomRoomBlueprintInput,
): ChatroomRoomBlueprint {
  return blueprint ? cloneChatroomRoomBlueprint(blueprint) : createChatroomRoomBlueprintFromLegacyInput(legacyInput);
// Provider-specific function removed

export function formatRoomBlueprintGovernanceSummary(
  governance: Readonly<RoomBlueprintGovernanceConfig> | undefined,
): string {
***REMOVED***!governance) {
    return 'admin:off | host:off | recorder:off';
  // Provider-specific function removed

***REMOVED***
    governance.roomAdmin.enabled
      ? `admin:${governance.roomAdmin.interventionStyle// Provider-specific function removed`
      : 'admin:off',
    governance.host.enabled
      ? `host:${governance.host.moderationStyle// Provider-specific function removed`
      : 'host:off',
    governance.recorder.enabled
      ? `recorder:${governance.recorder.updateMode// Provider-specific function removed`
      : 'recorder:off',
  ].join(' | ');
// Provider-specific function removed

function buildBlueprintTitle(args: {
  scenarioTemplateId: RoomScenarioTemplateId;
  title?: string;
  topic: string;
// Provider-specific function removed): string {
  const explicitTitle = args.title?.trim();
***REMOVED***explicitTitle) {
    return explicitTitle;
  // Provider-specific function removed

  const topic = args.topic.trim();
***REMOVED***topic.length > 0) {
    return topic;
  // Provider-specific function removed

  return resolveRoomScenarioTemplate(args.scenarioTemplateId).label;
// Provider-specific function removed

function resolveLegacySpeakerIds(
  roomType: ChatroomRoomTypeId,
  speakerIds: readonly string[] | undefined,
): string[] {
***REMOVED***speakerIds && speakerIds.length > 0) {
  ***REMOVED***...speakerIds];
  // Provider-specific function removed

***REMOVED***...resolveChatroomRoomType(roomType).defaultSpeakerIds];
// Provider-specific function removed

function normalizeCustomCharacters(
  input: RoleplayCharacterCard[] | undefined,
): RoleplayCharacterCard[] {
  return normalizeRoleplayCharacterCards(input);
// Provider-specific function removed

function parseParticipantSlots(input: unknown): RoomParticipantSlot[] {
***REMOVED***!Array.isArray(input)) {
  ***REMOVED***];
  // Provider-specific function removed

  const slots: RoomParticipantSlot[] = [];
  for (const item of input) {
  ***REMOVED***!isJsonRecord(item)) {
      continue;
    // Provider-specific function removed

    const slotId = asTrimmedString(item.slotId);
    const label = asTrimmedString(item.label);
    const description = asTrimmedString(item.description) ?? '';
    const participantType = parseParticipantType(item.participantType);
    const occupancy = parseOccupancy(item.occupancy);
  ***REMOVED***!slotId || !label || !participantType || !occupancy) {
      continue;
    // Provider-specific function removed

    slots.push({
      slotId,
      label,
      description,
      participantType,
      occupancy,
      speakerId: asTrimmedString(item.speakerId),
      profileId: asTrimmedString(item.profileId),
      metadata: isJsonRecord(item.metadata) ? structuredClone(item.metadata) : undefined,
    // Provider-specific function removed);
  // Provider-specific function removed

  return slots;
// Provider-specific function removed

function parseRuntimeConfig(input: unknown): RoomBlueprintRuntimeConfig | undefined {
***REMOVED***!isJsonRecord(input)) {
    return undefined;
  // Provider-specific function removed

  const summaryEnabled = typeof input.summaryEnabled === 'boolean' ? input.summaryEnabled : undefined;
  const maxReplyCharacters = asPositiveInteger(input.maxReplyCharacters);
***REMOVED***summaryEnabled === undefined || maxReplyCharacters === undefined) {
    return undefined;
  // Provider-specific function removed

  return {
    parallelBatchSize: asPositiveInteger(input.parallelBatchSize),
    summaryEnabled,
    maxReplyCharacters,
  // Provider-specific function removed;
// Provider-specific function removed

function parseGovernanceConfig(input: unknown): RoomBlueprintGovernanceConfig | undefined {
***REMOVED***!isJsonRecord(input)) {
    return undefined;
  // Provider-specific function removed

  const roomAdmin = parseRoomAdminGovernanceConfig(input.roomAdmin);
  const host = parseRoomHostGovernanceConfig(input.host);
  const recorder = parseRoomRecorderGovernanceConfig(input.recorder);
***REMOVED***!roomAdmin || !host || !recorder) {
    return undefined;
  // Provider-specific function removed

  return {
    roomAdmin,
    host,
    recorder,
  // Provider-specific function removed;
// Provider-specific function removed

function parseScenarioTemplateId(input: unknown): RoomScenarioTemplateId | undefined {
  return typeof input === 'string' &&
    (ROOM_SCENARIO_TEMPLATE_IDS as readonly string[]).includes(input)
    ? (input as RoomScenarioTemplateId)
    : undefined;
// Provider-specific function removed

function parseParticipantType(input: unknown): RoomParticipantSlot['participantType'] | undefined {
  return input === 'human' || input === 'agent' || input === 'system' || input === 'summary'
    ? input
    : undefined;
// Provider-specific function removed

function parseOccupancy(input: unknown): RoomParticipantSlot['occupancy'] | undefined {
  return input === 'required' || input === 'optional' ? input : undefined;
// Provider-specific function removed

function parseCustomCharacters(input: unknown): RoleplayCharacterCard[] | undefined {
***REMOVED***!Array.isArray(input)) {
    return undefined;
  // Provider-specific function removed

  const characters: RoleplayCharacterCard[] = [];
  for (const item of input) {
  ***REMOVED***!isJsonRecord(item)) {
      continue;
    // Provider-specific function removed

    const name = asTrimmedString(item.name);
  ***REMOVED***!name) {
      continue;
    // Provider-specific function removed

    characters.push({
      characterId: asTrimmedString(item.characterId),
      name,
      instruction: asTrimmedString(item.instruction) ?? '',
      publicDescription: asTrimmedString(item.publicDescription),
      privateNotes: parseStringArray(item.privateNotes),
      relationships: parseCustomCharacterRelationships(item.relationships),
      initialGoal: asTrimmedString(item.initialGoal),
    // Provider-specific function removed);
  // Provider-specific function removed

  const normalized = normalizeRoleplayCharacterCards(characters);
  return normalized.length > 0 ? normalized : undefined;
// Provider-specific function removed

function parseCustomCharacterRelationships(
  input: unknown,
): NonNullable<RoleplayCharacterCard['relationships']> {
***REMOVED***!Array.isArray(input)) {
  ***REMOVED***];
  // Provider-specific function removed

  const relationships: NonNullable<RoleplayCharacterCard['relationships']> = [];
  for (const item of input) {
  ***REMOVED***!isJsonRecord(item)) {
      continue;
    // Provider-specific function removed

    const summary = asTrimmedString(item.summary);
  ***REMOVED***!summary) {
      continue;
    // Provider-specific function removed

    relationships.push({
      targetCharacterId: asTrimmedString(item.targetCharacterId),
      targetName: asTrimmedString(item.targetName),
      summary,
      score: asRelationshipScore(item.score),
    // Provider-specific function removed);
  // Provider-specific function removed

  return relationships;
// Provider-specific function removed

function resolveRoomBlueprintGovernanceConfig(args: {
  scenarioTemplateId: RoomScenarioTemplateId;
  roomType: ChatroomRoomTypeId;
  summaryEnabled: boolean;
  patch?: RoomBlueprintGovernancePatch;
// Provider-specific function removed): RoomBlueprintGovernanceConfig {
  const defaults = createDefaultRoomBlueprintGovernanceConfig(args);

  return {
    roomAdmin: {
      ...defaults.roomAdmin,
      ...sanitizeRoomAdminGovernancePatch(args.patch?.roomAdmin),
    // Provider-specific function removed,
    host: {
      ...defaults.host,
      ...sanitizeRoomHostGovernancePatch(args.patch?.host),
    // Provider-specific function removed,
    recorder: {
      ...defaults.recorder,
      ...sanitizeRoomRecorderGovernancePatch(args.patch?.recorder),
      artifactFocus:
        sanitizeRoomRecorderGovernancePatch(args.patch?.recorder).artifactFocus ??
        defaults.recorder.artifactFocus,
    // Provider-specific function removed,
  // Provider-specific function removed;
// Provider-specific function removed

function createDefaultRoomBlueprintGovernanceConfig(args: {
  scenarioTemplateId: RoomScenarioTemplateId;
  roomType: ChatroomRoomTypeId;
  summaryEnabled: boolean;
// Provider-specific function removed): RoomBlueprintGovernanceConfig {
  const recorderDisabled = {
    enabled: false,
    updateMode: 'final_only' as const,
    artifactFocus: [] as string[],
    brief: 'Recorder output is disabled for this room.',
  // Provider-specific function removed;

  switch (args.scenarioTemplateId) {
    case 'interview_simulation':
      return {
        roomAdmin: {
          enabled: true,
          interventionStyle: 'on_demand',
          canManageParticipants: false,
          canManagePhases: true,
          canInjectEvents: false,
          brief:
            'Keeps the interview flow on track and can rebalance pacing if the room stalls.',
        // Provider-specific function removed,
        host: {
          enabled: true,
          moderationStyle: 'structured',
          brief:
            'Enforces orderly handoff between interviewers and keeps one focused question active at a time.',
        // Provider-specific function removed,
        recorder: args.summaryEnabled
          ? {
              enabled: true,
              updateMode: 'stage_checkpoints',
              artifactFocus: [
                'candidate evidence',
                'strengths',
                'risks',
                'missed questions',
                'next steps',
              ],
              brief:
                'Tracks evidence throughout the interview and produces the final evaluation bundle.',
            // Provider-specific function removed
          : recorderDisabled,
      // Provider-specific function removed;
    case 'project_development_discussion':
      return {
        roomAdmin: {
          enabled: true,
          interventionStyle: 'on_demand',
          canManageParticipants: false,
          canManagePhases: true,
          canInjectEvents: false,
          brief:
            'Keeps the discussion decision-oriented and can rebalance the room if it drifts.',
        // Provider-specific function removed,
        host: {
          enabled: true,
          moderationStyle: 'structured',
          brief:
            'Keeps the project discussion aligned to decision points, risks, and implementation tradeoffs.',
        // Provider-specific function removed,
        recorder: args.summaryEnabled
          ? {
              enabled: true,
              updateMode: 'stage_checkpoints',
              artifactFocus: ['decisions', 'risks', 'open questions', 'action items'],
              brief:
                'Collects decisions and unresolved issues during the room and emits a project review report.',
            // Provider-specific function removed
          : recorderDisabled,
      // Provider-specific function removed;
    case 'report_seminar':
      return {
        roomAdmin: {
          enabled: true,
          interventionStyle: 'on_demand',
          canManageParticipants: false,
          canManagePhases: true,
          canInjectEvents: false,
          brief:
            'Keeps the seminar in review mode and can tighten the structure when critique becomes diffuse.',
        // Provider-specific function removed,
        host: {
          enabled: true,
          moderationStyle: 'strict',
          brief:
            'Maintains presenter-reviewer order and keeps the room moving through critique and revision guidance.',
        // Provider-specific function removed,
        recorder: args.summaryEnabled
          ? {
              enabled: true,
              updateMode: 'stage_checkpoints',
              artifactFocus: ['key findings', 'objections', 'evidence gaps', 'revision guidance'],
              brief:
                'Maintains seminar notes and produces the final review report.',
            // Provider-specific function removed
          : recorderDisabled,
      // Provider-specific function removed;
    case 'murder_mystery':
      return {
        roomAdmin: {
          enabled: true,
          interventionStyle: 'proactive',
          canManageParticipants: true,
          canManagePhases: true,
          canInjectEvents: true,
          brief:
            'Acts as a game-master style governance layer that can introduce clues, phase shifts, and cast changes.',
        // Provider-specific function removed,
        host: {
          enabled: true,
          moderationStyle: 'structured',
          brief:
            'Keeps the investigation legible and steers the room between questioning, deduction, and escalation beats.',
        // Provider-specific function removed,
        recorder: args.summaryEnabled
          ? {
              enabled: true,
              updateMode: 'stage_checkpoints',
              artifactFocus: ['clues', 'suspicions', 'contradictions', 'open leads'],
              brief:
                'Tracks the evolving case board and prepares the deduction recap.',
            // Provider-specific function removed
          : recorderDisabled,
      // Provider-specific function removed;
    case 'tavern_roleplay_demo':
      return {
        roomAdmin: {
          enabled: true,
          interventionStyle: 'proactive',
          canManageParticipants: true,
          canManagePhases: true,
          canInjectEvents: true,
          brief:
            'Acts as a light tavern keeper/game-master layer that can inject rumors, arrivals, weather, and social pressure without taking over character agency.',
        // Provider-specific function removed,
        host: {
          enabled: true,
          moderationStyle: 'light',
          brief:
            'Keeps the tavern scene legible, responsive to the user, and grounded in each NPC role card.',
        // Provider-specific function removed,
        recorder: args.summaryEnabled
          ? {
              enabled: true,
              updateMode: 'final_only',
              artifactFocus: ['key moments', 'npc memory hooks', 'relationship shifts', 'open rumors'],
              brief:
                'Produces a tavern scene recap and preserves hooks for future roleplay sessions.',
            // Provider-specific function removed
          : recorderDisabled,
      // Provider-specific function removed;
    case 'roleplay_scene':
      return {
        roomAdmin: {
          enabled: true,
          interventionStyle: 'proactive',
          canManageParticipants: true,
          canManagePhases: true,
          canInjectEvents: true,
          brief:
            'Can resize the cast, shift the scene beat, and inject events when the roleplay needs new momentum.',
        // Provider-specific function removed,
        host: {
          enabled: true,
          moderationStyle: 'light',
          brief:
            'Keeps the roleplay scene coherent without over-constraining freeform character interaction.',
        // Provider-specific function removed,
        recorder: args.summaryEnabled
          ? {
              enabled: true,
              updateMode: 'final_only',
              artifactFocus: ['key moments', 'relationship shifts', 'open threads'],
              brief:
                'Produces a recap after the scene if recap mode is enabled.',
            // Provider-specific function removed
          : recorderDisabled,
      // Provider-specific function removed;
    case 'brainstorm_workshop':
      return {
        roomAdmin: {
          enabled: false,
          interventionStyle: 'on_demand',
          canManageParticipants: false,
          canManagePhases: false,
          canInjectEvents: false,
          brief: 'No dedicated room admin by default.',
        // Provider-specific function removed,
        host: {
          enabled: true,
          moderationStyle: 'light',
          brief:
            'Keeps brainstorming expansive first, then gently pulls the room toward clustering and prioritization.',
        // Provider-specific function removed,
        recorder: args.summaryEnabled
          ? {
              enabled: true,
              updateMode: 'final_only',
              artifactFocus: ['promising directions', 'risky ideas', 'next experiments'],
              brief:
                'Captures the strongest idea clusters and recommended follow-up experiments.',
            // Provider-specific function removed
          : recorderDisabled,
      // Provider-specific function removed;
    case 'expert_discussion':
    default:
      return {
        roomAdmin: {
          enabled: false,
          interventionStyle: 'on_demand',
          canManageParticipants: false,
          canManagePhases: false,
          canInjectEvents: false,
          brief: 'No dedicated room admin by default.',
        // Provider-specific function removed,
        host: {
          enabled: true,
          moderationStyle: 'structured',
          brief:
            'Keeps the room analytical, focused, and moving toward convergence.',
        // Provider-specific function removed,
        recorder: args.summaryEnabled
          ? {
              enabled: true,
              updateMode: 'final_only',
              artifactFocus: ['summary', 'highlights', 'concerns', 'next steps'],
              brief:
                'Produces the final structured room summary at the end of the run.',
            // Provider-specific function removed
          : recorderDisabled,
      // Provider-specific function removed;
  // Provider-specific function removed
// Provider-specific function removed

function sanitizeRoomAdminGovernancePatch(
  patch: Partial<RoomAdminGovernanceConfig> | undefined,
): Partial<RoomAdminGovernanceConfig> {
***REMOVED***!patch) {
    return {// Provider-specific function removed;
  // Provider-specific function removed

  return {
    enabled: typeof patch.enabled === 'boolean' ? patch.enabled : undefined,
    interventionStyle: isRoomAdminInterventionStyle(patch.interventionStyle)
      ? patch.interventionStyle
      : undefined,
    canManageParticipants:
      typeof patch.canManageParticipants === 'boolean'
        ? patch.canManageParticipants
        : undefined,
    canManagePhases:
      typeof patch.canManagePhases === 'boolean' ? patch.canManagePhases : undefined,
    canInjectEvents:
      typeof patch.canInjectEvents === 'boolean' ? patch.canInjectEvents : undefined,
    brief: asTrimmedString(patch.brief),
  // Provider-specific function removed;
// Provider-specific function removed

function sanitizeRoomHostGovernancePatch(
  patch: Partial<RoomHostGovernanceConfig> | undefined,
): Partial<RoomHostGovernanceConfig> {
***REMOVED***!patch) {
    return {// Provider-specific function removed;
  // Provider-specific function removed

  return {
    enabled: typeof patch.enabled === 'boolean' ? patch.enabled : undefined,
    moderationStyle: isRoomHostModerationStyle(patch.moderationStyle)
      ? patch.moderationStyle
      : undefined,
    brief: asTrimmedString(patch.brief),
  // Provider-specific function removed;
// Provider-specific function removed

function sanitizeRoomRecorderGovernancePatch(
  patch: Partial<RoomRecorderGovernanceConfig> | undefined,
): Partial<RoomRecorderGovernanceConfig> {
***REMOVED***!patch) {
    return {// Provider-specific function removed;
  // Provider-specific function removed

  return {
    enabled: typeof patch.enabled === 'boolean' ? patch.enabled : undefined,
    updateMode: isRoomRecorderUpdateMode(patch.updateMode)
      ? patch.updateMode
      : undefined,
    artifactFocus: Array.isArray(patch.artifactFocus)
      ? parseStringArray(patch.artifactFocus)
      : undefined,
    brief: asTrimmedString(patch.brief),
  // Provider-specific function removed;
// Provider-specific function removed

function parseRoomAdminGovernanceConfig(
  input: unknown,
): RoomAdminGovernanceConfig | undefined {
***REMOVED***!isJsonRecord(input)) {
    return undefined;
  // Provider-specific function removed

  const enabled = typeof input.enabled === 'boolean' ? input.enabled : undefined;
  const interventionStyle = isRoomAdminInterventionStyle(input.interventionStyle)
    ? input.interventionStyle
    : undefined;
  const canManageParticipants =
    typeof input.canManageParticipants === 'boolean'
      ? input.canManageParticipants
      : undefined;
  const canManagePhases =
    typeof input.canManagePhases === 'boolean' ? input.canManagePhases : undefined;
  const canInjectEvents =
    typeof input.canInjectEvents === 'boolean' ? input.canInjectEvents : undefined;
  const brief = asTrimmedString(input.brief);
***REMOVED***
    enabled === undefined ||
    !interventionStyle ||
    canManageParticipants === undefined ||
    canManagePhases === undefined ||
    canInjectEvents === undefined ||
    !brief
***REMOVED***
    return undefined;
  // Provider-specific function removed

  return {
    enabled,
    interventionStyle,
    canManageParticipants,
    canManagePhases,
    canInjectEvents,
    brief,
  // Provider-specific function removed;
// Provider-specific function removed

function parseRoomHostGovernanceConfig(
  input: unknown,
): RoomHostGovernanceConfig | undefined {
***REMOVED***!isJsonRecord(input)) {
    return undefined;
  // Provider-specific function removed

  const enabled = typeof input.enabled === 'boolean' ? input.enabled : undefined;
  const moderationStyle = isRoomHostModerationStyle(input.moderationStyle)
    ? input.moderationStyle
    : undefined;
  const brief = asTrimmedString(input.brief);
***REMOVED***enabled === undefined || !moderationStyle || !brief) {
    return undefined;
  // Provider-specific function removed

  return {
    enabled,
    moderationStyle,
    brief,
  // Provider-specific function removed;
// Provider-specific function removed

function parseRoomRecorderGovernanceConfig(
  input: unknown,
): RoomRecorderGovernanceConfig | undefined {
***REMOVED***!isJsonRecord(input)) {
    return undefined;
  // Provider-specific function removed

  const enabled = typeof input.enabled === 'boolean' ? input.enabled : undefined;
  const updateMode = isRoomRecorderUpdateMode(input.updateMode)
    ? input.updateMode
    : undefined;
  const brief = asTrimmedString(input.brief);
***REMOVED***enabled === undefined || !updateMode || !brief) {
    return undefined;
  // Provider-specific function removed

  return {
    enabled,
    updateMode,
    artifactFocus: parseStringArray(input.artifactFocus),
    brief,
  // Provider-specific function removed;
// Provider-specific function removed

function isRoomAdminInterventionStyle(
  input: unknown,
): input is RoomAdminInterventionStyle {
  return input === 'on_demand' || input === 'proactive';
// Provider-specific function removed

function isRoomHostModerationStyle(
  input: unknown,
): input is RoomHostModerationStyle {
  return input === 'light' || input === 'structured' || input === 'strict';
// Provider-specific function removed

function isRoomRecorderUpdateMode(
  input: unknown,
): input is RoomRecorderUpdateMode {
  return (
    input === 'final_only' ||
    input === 'stage_checkpoints' ||
    input === 'continuous'
  );
// Provider-specific function removed

function parseStringArray(input: unknown): string[] {
***REMOVED***!Array.isArray(input)) {
  ***REMOVED***];
  // Provider-specific function removed

  return input
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean);
// Provider-specific function removed

function asTrimmedString(input: unknown): string | undefined {
  return typeof input === 'string' && input.trim().length > 0 ? input.trim() : undefined;
// Provider-specific function removed

function asPositiveInteger(input: unknown): number | undefined {
  return typeof input === 'number' && Number.isInteger(input) && input > 0
    ? input
    : undefined;
// Provider-specific function removed

function asRelationshipScore(input: unknown): number | undefined {
  return typeof input === 'number' && Number.isFinite(input)
    ? Math.min(3, Math.max(-3, Math.round(input)))
    : undefined;
// Provider-specific function removed

function isJsonRecord(input: unknown): input is Record<string, unknown> {
  return Boolean(input) && typeof input === 'object' && !Array.isArray(input);
// Provider-specific function removed
