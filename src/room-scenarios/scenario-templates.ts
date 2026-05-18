import { resolveChatroomSpeakerProfiles // Provider-specific function removed from '../agents/chatroom-profiles.js';
import {
  normalizeRoleplayCharacterCards,
  selectCustomRoleplaySpeakerIds,
  type RoleplayCharacterCard,
// Provider-specific function removed from './roleplay/roleplay-characters.js';
import type { ChatroomRoomTypeId // Provider-specific function removed from '../workflows/chatroom-room-types.js';

export const ROOM_SCENARIO_TEMPLATE_IDS = [
  'expert_discussion',
  'brainstorm_workshop',
  'roleplay_scene',
  'tavern_roleplay_demo',
  'interview_simulation',
  'free_interview',
  'project_development_discussion',
  'report_seminar',
  'murder_mystery',
] as const;

export type RoomScenarioTemplateId = (typeof ROOM_SCENARIO_TEMPLATE_IDS)[number];

export const ROOM_SCENARIO_CATEGORIES = [
  'discussion',
  'interview',
  'seminar',
  'roleplay',
  'game',
] as const;

export type RoomScenarioCategory = (typeof ROOM_SCENARIO_CATEGORIES)[number];

export const ROOM_PARTICIPANT_SLOT_PARTICIPANT_TYPES = [
  'human',
  'agent',
  'system',
  'summary',
] as const;

export type RoomParticipantSlotParticipantType =
  (typeof ROOM_PARTICIPANT_SLOT_PARTICIPANT_TYPES)[number];

export const ROOM_PARTICIPANT_SLOT_OCCUPANCIES = ['required', 'optional'] as const;

export type RoomParticipantSlotOccupancy =
  (typeof ROOM_PARTICIPANT_SLOT_OCCUPANCIES)[number];

export interface RoomParticipantSlot {
  slotId: string;
  label: string;
  description: string;
  participantType: RoomParticipantSlotParticipantType;
  occupancy: RoomParticipantSlotOccupancy;
  speakerId?: string;
  profileId?: string;
  metadata?: Record<string, unknown>;
// Provider-specific function removed

export interface RoomScenarioTemplateBuildArgs {
  speakerIds: readonly string[];
  includeSummarySlot: boolean;
  customCharacters?: RoleplayCharacterCard[];
  topic?: string;
  objective?: string;
  constraints?: readonly string[];
  metadata?: Record<string, unknown>;
// Provider-specific function removed

export interface RoomScenarioTemplate {
  id: RoomScenarioTemplateId;
  label: string;
  category: RoomScenarioCategory;
  description: string;
  availability: 'active' | 'planned';
  defaultRoomType?: ChatroomRoomTypeId;
  buildParticipantSlots?: (args: RoomScenarioTemplateBuildArgs) => RoomParticipantSlot[];
// Provider-specific function removed

const templates: RoomScenarioTemplate[] = [
  {
    id: 'expert_discussion',
    label: 'Expert Discussion',
    category: 'discussion',
    description:
      'A structured multi-agent discussion room with a user requester, expert panel, and summary role.',
    availability: 'active',
    defaultRoomType: 'expert_discussion',
    buildParticipantSlots: ({ speakerIds, includeSummarySlot // Provider-specific function removed) =>
      buildDiscussionSlots({
        userLabel: 'Requester',
        speakerIds,
        includeSummarySlot,
      // Provider-specific function removed),
  // Provider-specific function removed,
  {
    id: 'brainstorm_workshop',
    label: 'Brainstorm Workshop',
    category: 'discussion',
    description:
      'A collaborative idea room with a user requester, ideation agents, and an optional summary role.',
    availability: 'active',
    defaultRoomType: 'brainstorm_workshop',
    buildParticipantSlots: ({ speakerIds, includeSummarySlot // Provider-specific function removed) =>
      buildDiscussionSlots({
        userLabel: 'Requester',
        speakerIds,
        includeSummarySlot,
      // Provider-specific function removed),
  // Provider-specific function removed,
  {
    id: 'roleplay_scene',
    label: 'Roleplay Scene',
    category: 'roleplay',
    description:
      'A live in-room scene with a user actor, cast members, and optional recap support.',
    availability: 'active',
    defaultRoomType: 'roleplay_scene',
    buildParticipantSlots: ({ speakerIds, includeSummarySlot, customCharacters // Provider-specific function removed) =>
      buildRoleplaySlots({
        speakerIds,
        includeSummarySlot,
        customCharacters,
      // Provider-specific function removed),
  // Provider-specific function removed,
  {
    id: 'tavern_roleplay_demo',
    label: 'Tavern Roleplay Demo',
    category: 'roleplay',
    description:
      'A ready-to-run tavern sub-room demo with stable role cards, a scene host, and in-character NPC agents.',
    availability: 'active',
    defaultRoomType: 'roleplay_scene',
    buildParticipantSlots: ({ speakerIds, includeSummarySlot, customCharacters // Provider-specific function removed) =>
      buildRoleplaySlots({
        speakerIds,
        includeSummarySlot,
        customCharacters,
      // Provider-specific function removed),
  // Provider-specific function removed,
  {
    id: 'interview_simulation',
    label: 'Interview Simulation (Legacy)',
    category: 'interview',
    description:
      'Legacy interview template with fixed phases. Use free_interview for new interviews.',
    availability: 'active',
    defaultRoomType: 'expert_discussion',
    buildParticipantSlots: ({ speakerIds, includeSummarySlot, topic, constraints, metadata // Provider-specific function removed) =>
      buildInterviewSlots({
        speakerIds,
        includeSummarySlot,
        topic,
        constraints,
        metadata,
      // Provider-specific function removed),
  // Provider-specific function removed,
  {
    id: 'free_interview',
    label: 'Free Interview',
    category: 'interview',
    description:
      'A flexible interview room where the moderator dynamically creates interviewers based on candidate background.',
    availability: 'active',
    defaultRoomType: 'expert_discussion',
    buildParticipantSlots: ({ speakerIds, includeSummarySlot // Provider-specific function removed) =>
      buildFreeInterviewSlots({
        speakerIds,
        includeSummarySlot,
      // Provider-specific function removed),
  // Provider-specific function removed,
  {
    id: 'project_development_discussion',
    label: 'Project Development Discussion',
    category: 'discussion',
    description:
      'A planned room template for project review, design debate, and delivery planning.',
    availability: 'active',
    defaultRoomType: 'project_discussion',
    buildParticipantSlots: ({ speakerIds, includeSummarySlot // Provider-specific function removed) =>
      buildProjectDiscussionSlots({
        speakerIds,
        includeSummarySlot,
      // Provider-specific function removed),
  // Provider-specific function removed,
  {
    id: 'report_seminar',
    label: 'Report Seminar',
    category: 'seminar',
    description:
      'A planned room template for presentations, critiques, and structured report review.',
    availability: 'active',
    defaultRoomType: 'report_seminar',
    buildParticipantSlots: ({ speakerIds, includeSummarySlot // Provider-specific function removed) =>
      buildReportSeminarSlots({
        speakerIds,
        includeSummarySlot,
      // Provider-specific function removed),
  // Provider-specific function removed,
  {
    id: 'murder_mystery',
    label: 'Murder Mystery',
    category: 'game',
    description:
      'A deduction-oriented roleplay room with a game master, suspect cast, clue pressure, and case-board recap.',
    availability: 'active',
    defaultRoomType: 'roleplay_scene',
    buildParticipantSlots: ({ speakerIds, includeSummarySlot, customCharacters // Provider-specific function removed) =>
      buildMysterySlots({
        speakerIds,
        includeSummarySlot,
        customCharacters,
      // Provider-specific function removed),
  // Provider-specific function removed,
];

const templateById = new Map(templates.map((template) => [template.id, template] as const));
const templateIdByRoomType = new Map<ChatroomRoomTypeId, RoomScenarioTemplateId>([
  ['expert_discussion', 'expert_discussion'],
  ['brainstorm_workshop', 'brainstorm_workshop'],
  ['project_discussion', 'project_development_discussion'],
  ['report_seminar', 'report_seminar'],
  ['roleplay_scene', 'roleplay_scene'],
]);

export function listRoomScenarioTemplates(): RoomScenarioTemplate[] {
  return templates.filter((template) => template.availability !== 'planned');
// Provider-specific function removed

export function listRoomScenarioTemplateIds(): RoomScenarioTemplateId[] {
  return listRoomScenarioTemplates().map((template) => template.id);
// Provider-specific function removed

export function parseRoomScenarioTemplateId(
  value: string | undefined,
): RoomScenarioTemplateId | undefined {
  const normalized = value?.trim();
  return normalized &&
    (ROOM_SCENARIO_TEMPLATE_IDS as readonly string[]).includes(normalized)
    ? (normalized as RoomScenarioTemplateId)
    : undefined;
// Provider-specific function removed

export function resolveRoomScenarioTemplate(
  id: RoomScenarioTemplateId | string | undefined,
): RoomScenarioTemplate {
  const template = id ? templateById.get(id as RoomScenarioTemplateId) : undefined;
***REMOVED***!template) {
    return templateById.get('expert_discussion')!;
  // Provider-specific function removed

  return template;
// Provider-specific function removed

export function resolveRoomScenarioTemplateForRoomType(
  roomType: ChatroomRoomTypeId,
): RoomScenarioTemplate {
  return resolveRoomScenarioTemplate(templateIdByRoomType.get(roomType));
// Provider-specific function removed

function buildDiscussionSlots(args: {
  userLabel: string;
  speakerIds: readonly string[];
  includeSummarySlot: boolean;
// Provider-specific function removed): RoomParticipantSlot[] {
  const profiles = resolveChatroomSpeakerProfiles(args.speakerIds);
  const slots: RoomParticipantSlot[] = [
    {
      slotId: 'system',
      label: 'System',
      description: 'Owns room-level system messages and room bootstrap directives.',
      participantType: 'system',
      occupancy: 'required',
      speakerId: 'system',
      metadata: {
        role: 'system',
      // Provider-specific function removed,
    // Provider-specific function removed,
    {
      slotId: 'requester',
      label: args.userLabel,
      description: 'The human participant who brings the topic and can speak during the room.',
      participantType: 'human',
      occupancy: 'required',
      metadata: {
        role: 'user',
      // Provider-specific function removed,
    // Provider-specific function removed,
    ...profiles.map((profile, index) => ({
      slotId: `speaker-${index + 1// Provider-specific function removed`,
      label: profile.name,
      description: profile.description,
      participantType: 'agent' as const,
      occupancy: 'required' as const,
      speakerId: profile.id,
      profileId: profile.id,
      metadata: {
        role: 'speaker',
      // Provider-specific function removed,
    // Provider-specific function removed)),
  ];

***REMOVED***args.includeSummarySlot) {
    slots.push({
      slotId: 'summary',
      label: 'Summary',
      description: 'Produces the structured room summary after the discussion ends.',
      participantType: 'summary',
      occupancy: 'required',
      speakerId: 'chatroom-summary',
      profileId: 'chatroom-summary',
      metadata: {
        role: 'summary',
      // Provider-specific function removed,
    // Provider-specific function removed);
  // Provider-specific function removed

  return slots;
// Provider-specific function removed

function buildRoleplaySlots(args: {
  speakerIds: readonly string[];
  includeSummarySlot: boolean;
  customCharacters?: RoleplayCharacterCard[];
// Provider-specific function removed): RoomParticipantSlot[] {
  const slots: RoomParticipantSlot[] = [
    {
      slotId: 'system',
      label: 'System',
      description: 'Owns room bootstrap directives and room-level system messages.',
      participantType: 'system',
      occupancy: 'required',
      speakerId: 'system',
      metadata: {
        role: 'system',
      // Provider-specific function removed,
    // Provider-specific function removed,
    {
      slotId: 'user-actor',
      label: 'User Actor',
      description: 'The human participant who enters the scene as an in-room actor.',
      participantType: 'human',
      occupancy: 'required',
      metadata: {
        role: 'user_actor',
      // Provider-specific function removed,
    // Provider-specific function removed,
  ];

  const customCharacters = normalizeCustomCharacters(args.customCharacters);
***REMOVED***customCharacters.length > 0) {
    const generatedSpeakerIds = selectCustomRoleplaySpeakerIds(customCharacters);
    slots.push({
      slotId: 'scene-host',
      label: 'Scene Host',
      description: 'Keeps the scene moving with light environmental beats while the cast stays in character.',
      participantType: 'agent',
      occupancy: 'required',
      speakerId: generatedSpeakerIds[0]!,
      profileId: generatedSpeakerIds[0]!,
      metadata: {
        role: 'scene_host',
        custom: true,
      // Provider-specific function removed,
    // Provider-specific function removed);
    for (const [index, character] of customCharacters.entries()) {
      slots.push({
        slotId: `character-${index + 1// Provider-specific function removed`,
        label: character.name,
        description: character.instruction || 'Custom roleplay character.',
        participantType: 'agent',
        occupancy: 'required',
        speakerId: generatedSpeakerIds[index + 1]!,
        profileId: generatedSpeakerIds[index + 1]!,
        metadata: {
          role: 'character',
          custom: true,
          ...(character.characterId ? { characterId: character.characterId // Provider-specific function removed : {// Provider-specific function removed),
        // Provider-specific function removed,
      // Provider-specific function removed);
    // Provider-specific function removed
  // Provider-specific function removed else {
    const profiles = resolveChatroomSpeakerProfiles(args.speakerIds);
    for (const [index, profile] of profiles.entries()) {
      slots.push({
        slotId: `character-${index + 1// Provider-specific function removed`,
        label: profile.name,
        description: profile.description,
        participantType: 'agent',
        occupancy: 'required',
        speakerId: profile.id,
        profileId: profile.id,
        metadata: {
          role: 'character',
        // Provider-specific function removed,
      // Provider-specific function removed);
    // Provider-specific function removed
  // Provider-specific function removed

***REMOVED***args.includeSummarySlot) {
    slots.push({
      slotId: 'scene-recap',
      label: 'Scene Recap',
      description: 'Produces a narrative recap of the scene when recap mode is enabled.',
      participantType: 'summary',
      occupancy: 'optional',
      speakerId: 'roleplay-summary',
      profileId: 'roleplay-summary',
      metadata: {
        role: 'summary',
      // Provider-specific function removed,
    // Provider-specific function removed);
  // Provider-specific function removed

  return slots;
// Provider-specific function removed

function buildInterviewSlots(args: {
  speakerIds: readonly string[];
  includeSummarySlot: boolean;
  topic?: string;
  constraints?: readonly string[];
  metadata?: Record<string, unknown>;
// Provider-specific function removed): RoomParticipantSlot[] {
  const slotSeeds = resolveInterviewSlotSeeds(args);

  const slots: RoomParticipantSlot[] = [
    {
      slotId: 'system',
      label: 'System',
      description: 'Owns room bootstrap directives and room-level system messages.',
      participantType: 'system',
      occupancy: 'required',
      speakerId: 'system',
      metadata: {
        role: 'system',
      // Provider-specific function removed,
    // Provider-specific function removed,
    {
      slotId: 'candidate',
      label: 'Candidate',
      description: 'The human participant being interviewed in this room.',
      participantType: 'human',
      occupancy: 'required',
      metadata: {
        role: 'candidate',
      // Provider-specific function removed,
    // Provider-specific function removed,
  ];

  for (const [index, speakerId] of args.speakerIds.entries()) {
    const seed = slotSeeds[index] ?? {
      slotId: `panel-${index + 1// Provider-specific function removed`,
      label: `Interview Panel ${index + 1// Provider-specific function removed`,
      description: 'Additional interviewer slot for follow-up questions and alternate evaluation angles.',
      role: 'panel_interviewer',
    // Provider-specific function removed;
    slots.push({
      slotId: seed.slotId,
      label: seed.label,
      description: seed.description,
      participantType: 'agent',
      occupancy: 'required',
      speakerId,
      profileId: speakerId,
      metadata: {
        role: seed.role,
      // Provider-specific function removed,
    // Provider-specific function removed);
  // Provider-specific function removed

***REMOVED***args.includeSummarySlot) {
    slots.push({
      slotId: 'interview-recorder',
      label: 'Interview Recorder',
      description: 'Produces the final feedback summary, problem list, and practice suggestions.',
      participantType: 'summary',
      occupancy: 'required',
      speakerId: 'interview-summary',
      profileId: 'interview-summary',
      metadata: {
        role: 'recorder',
      // Provider-specific function removed,
    // Provider-specific function removed);
  // Provider-specific function removed

  return slots;
// Provider-specific function removed

function buildFreeInterviewSlots(args: {
  speakerIds: readonly string[];
  includeSummarySlot: boolean;
// Provider-specific function removed): RoomParticipantSlot[] {
  const slots: RoomParticipantSlot[] = [
    {
      slotId: 'system',
      label: 'System',
      description: 'Owns room bootstrap directives and room-level system messages.',
      participantType: 'system',
      occupancy: 'required',
      speakerId: 'system',
      metadata: {
        role: 'system',
      // Provider-specific function removed,
    // Provider-specific function removed,
    {
      slotId: 'candidate',
      label: 'Candidate',
      description: 'The human participant being interviewed in this room.',
      participantType: 'human',
      occupancy: 'required',
      metadata: {
        role: 'candidate',
      // Provider-specific function removed,
    // Provider-specific function removed,
    {
      slotId: 'interview-moderator',
      label: 'Interview Moderator',
      description:
        'Manages the interview flow, greets the candidate, asks about background, and dynamically creates specialized interviewers based on candidate profile.',
      participantType: 'agent',
      occupancy: 'required',
      speakerId: 'interview-moderator',
      profileId: 'interview-moderator',
      metadata: {
        role: 'moderator',
      // Provider-specific function removed,
    // Provider-specific function removed,
  ];

***REMOVED***args.includeSummarySlot) {
    slots.push({
      slotId: 'interview-recorder',
      label: 'Interview Recorder',
      description: 'Produces the final feedback summary, problem list, and practice suggestions.',
      participantType: 'summary',
      occupancy: 'required',
      speakerId: 'interview-summary',
      profileId: 'interview-summary',
      metadata: {
        role: 'recorder',
      // Provider-specific function removed,
    // Provider-specific function removed);
  // Provider-specific function removed

  return slots;
// Provider-specific function removed

function resolveInterviewSlotSeeds(args: {
  topic?: string;
  constraints?: readonly string[];
  metadata?: Record<string, unknown>;
// Provider-specific function removed): Array<{
  slotId: string;
  label: string;
  description: string;
  role: string;
// Provider-specific function removed> {
  const track = classifyInterviewTemplateTrack(args);

***REMOVED***track === 'product') {
  ***REMOVED***
      {
        slotId: 'hr-interviewer',
        label: 'HR Interviewer',
        description: 'Explores motivation, communication, resume consistency, and role fit.',
        role: 'hr_interviewer',
      // Provider-specific function removed,
      {
        slotId: 'technical-interviewer',
        label: 'Product Case Interviewer',
        description: 'Evaluates product thinking, user insight, prioritization, metrics, and delivery tradeoffs.',
        role: 'technical_interviewer',
      // Provider-specific function removed,
      {
        slotId: 'hiring-manager',
        label: 'Business Hiring Manager',
        description: 'Assesses ownership, stakeholder alignment, roadmap judgment, and outcome accountability.',
        role: 'manager_interviewer',
      // Provider-specific function removed,
      {
        slotId: 'panel-observer',
        label: 'Cross-functional Observer',
        description: 'Adds targeted follow-ups on gaps around validation, execution, and cross-team blind spots.',
        role: 'panel_observer',
      // Provider-specific function removed,
    ];
  // Provider-specific function removed

***REMOVED***track === 'frontend') {
  ***REMOVED***
      {
        slotId: 'hr-interviewer',
        label: 'HR Interviewer',
        description: 'Explores motivation, communication, resume consistency, and general fit.',
        role: 'hr_interviewer',
      // Provider-specific function removed,
      {
        slotId: 'technical-interviewer',
        label: 'Frontend Interviewer',
        description: 'Evaluates frontend depth, performance, UX tradeoffs, compatibility, and engineering quality.',
        role: 'technical_interviewer',
      // Provider-specific function removed,
      {
        slotId: 'hiring-manager',
        label: 'Engineering Manager',
        description: 'Assesses ownership, prioritization, collaboration maturity, and delivery judgment.',
        role: 'manager_interviewer',
      // Provider-specific function removed,
      {
        slotId: 'panel-observer',
        label: 'Panel Observer',
        description: 'Adds targeted follow-up questions and highlights blind spots the main panel missed.',
        role: 'panel_observer',
      // Provider-specific function removed,
    ];
  // Provider-specific function removed

***REMOVED***track === 'algorithm') {
  ***REMOVED***
      {
        slotId: 'hr-interviewer',
        label: 'HR Interviewer',
        description: 'Explores motivation, communication, resume consistency, and general fit.',
        role: 'hr_interviewer',
      // Provider-specific function removed,
      {
        slotId: 'technical-interviewer',
        label: 'Algorithm Interviewer',
        description: 'Evaluates modeling depth, data and metrics reasoning, experiments, and online tradeoffs.',
        role: 'technical_interviewer',
      // Provider-specific function removed,
      {
        slotId: 'hiring-manager',
        label: 'Hiring Manager',
        description: 'Assesses ownership, prioritization, collaboration maturity, and delivery judgment.',
        role: 'manager_interviewer',
      // Provider-specific function removed,
      {
        slotId: 'panel-observer',
        label: 'Panel Observer',
        description: 'Adds targeted follow-up questions and highlights blind spots the main panel missed.',
        role: 'panel_observer',
      // Provider-specific function removed,
    ];
  // Provider-specific function removed

***REMOVED***
    {
      slotId: 'hr-interviewer',
      label: 'HR Interviewer',
      description: 'Explores motivation, communication, resume consistency, and general fit.',
      role: 'hr_interviewer',
    // Provider-specific function removed,
    {
      slotId: 'technical-interviewer',
      label: track === 'general' ? 'Domain Interviewer' : 'Technical Interviewer',
      description:
        track === 'general'
          ? 'Evaluates domain depth, problem-solving quality, tradeoffs, and execution detail.'
          : 'Evaluates technical depth, tradeoffs, debugging, and problem-solving quality.',
      role: 'technical_interviewer',
    // Provider-specific function removed,
    {
      slotId: 'hiring-manager',
      label: 'Hiring Manager',
      description: 'Assesses ownership, decision-making, prioritization, and collaboration maturity.',
      role: 'manager_interviewer',
    // Provider-specific function removed,
    {
      slotId: 'panel-observer',
      label: 'Panel Observer',
      description: 'Adds targeted follow-up questions and highlights blind spots the main panel missed.',
      role: 'panel_observer',
    // Provider-specific function removed,
  ];
// Provider-specific function removed

function classifyInterviewTemplateTrack(args: {
  topic?: string;
  constraints?: readonly string[];
  metadata?: Record<string, unknown>;
// Provider-specific function removed): 'backend' | 'frontend' | 'algorithm' | 'product' | 'general' {
  const scenario = asRecord(args.metadata?.scenario);
  const targetRole = asOptionalString(scenario?.targetRole) ?? args.topic ?? '';
  const focusAreas = resolveInterviewTemplateFocusAreas(args.constraints, scenario);
  const haystack = `${targetRole// Provider-specific function removed\n${focusAreas.join('\n')// Provider-specific function removed`.toLowerCase();

***REMOVED***matchesInterviewTemplateTrack(haystack, ['product manager', 'product owner', 'pm', '产品经理'])) {
    return 'product';
  // Provider-specific function removed
***REMOVED***matchesInterviewTemplateTrack(haystack, ['frontend', 'front-end', 'react', 'vue', 'web', '前端'])) {
    return 'frontend';
  // Provider-specific function removed
***REMOVED***matchesInterviewTemplateTrack(haystack, ['algorithm', 'machine learning', 'ml', 'ranking', 'recommendation', '算法', '模型'])) {
    return 'algorithm';
  // Provider-specific function removed
***REMOVED***matchesInterviewTemplateTrack(haystack, ['backend', 'server', 'platform', 'infra', 'java', 'python', 'go', '后端', '服务端'])) {
    return 'backend';
  // Provider-specific function removed

  return 'general';
// Provider-specific function removed

function resolveInterviewTemplateFocusAreas(
  constraints: readonly string[] | undefined,
  scenario: Record<string, unknown> | undefined,
): string[] {
  const direct = scenario?.focusAreas;
***REMOVED***Array.isArray(direct)) {
    return direct
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter(Boolean);
  // Provider-specific function removed

  const resolved: string[] = [];
  for (const constraint of constraints ?? []) {
    const match = /^focus areas:\s*(.+)$/i.exec(constraint);
  ***REMOVED***!match) {
      continue;
    // Provider-specific function removed

    resolved.push(
      ...match[1]!
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    );
  // Provider-specific function removed

  return resolved;
// Provider-specific function removed

function matchesInterviewTemplateTrack(haystack: string, keywords: readonly string[]***REMOVED***
  return keywords.some((keyword) => haystack.includes(keyword.toLowerCase()));
// Provider-specific function removed

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
// Provider-specific function removed

function asOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
// Provider-specific function removed

function buildProjectDiscussionSlots(args: {
  speakerIds: readonly string[];
  includeSummarySlot: boolean;
// Provider-specific function removed): RoomParticipantSlot[] {
  const slotSeeds = [
    {
      slotId: 'moderator',
      label: 'Moderator',
      description: 'Keeps the project discussion focused and drives the room toward decisions.',
      role: 'moderator',
    // Provider-specific function removed,
    {
      slotId: 'product-lead',
      label: 'Product Lead',
      description: 'Represents user value, scope discipline, and product strategy.',
      role: 'product_lead',
    // Provider-specific function removed,
    {
      slotId: 'architect',
      label: 'Architect',
      description: 'Examines architecture boundaries, system contracts, and long-term technical shape.',
      role: 'architect',
    // Provider-specific function removed,
    {
      slotId: 'engineer',
      label: 'Engineer',
      description: 'Turns ideas into implementation plans, milestones, and delivery tradeoffs.',
      role: 'engineer',
    // Provider-specific function removed,
    {
      slotId: 'researcher',
      label: 'Researcher',
      description: 'Surfaces evidence gaps, assumptions, and questions that still need validation.',
      role: 'researcher',
    // Provider-specific function removed,
    {
      slotId: 'critic',
      label: 'Critic',
      description: 'Challenges premature consensus and exposes hidden delivery or product risk.',
      role: 'critic',
    // Provider-specific function removed,
  ] as const;

  const slots: RoomParticipantSlot[] = [
    {
      slotId: 'system',
      label: 'System',
      description: 'Owns room bootstrap directives and room-level system messages.',
      participantType: 'system',
      occupancy: 'required',
      speakerId: 'system',
      metadata: {
        role: 'system',
      // Provider-specific function removed,
    // Provider-specific function removed,
    {
      slotId: 'project-owner',
      label: 'Project Owner',
      description: 'The human participant asking the room to review or advance a project decision.',
      participantType: 'human',
      occupancy: 'required',
      metadata: {
        role: 'project_owner',
      // Provider-specific function removed,
    // Provider-specific function removed,
  ];

  for (const [index, speakerId] of args.speakerIds.entries()) {
    const seed = slotSeeds[index] ?? {
      slotId: `reviewer-${index + 1// Provider-specific function removed`,
      label: `Project Reviewer ${index + 1// Provider-specific function removed`,
      description: 'Additional project discussion role that contributes analysis and objections.',
      role: 'reviewer',
    // Provider-specific function removed;
    slots.push({
      slotId: seed.slotId,
      label: seed.label,
      description: seed.description,
      participantType: 'agent',
      occupancy: 'required',
      speakerId,
      profileId: speakerId,
      metadata: {
        role: seed.role,
      // Provider-specific function removed,
    // Provider-specific function removed);
  // Provider-specific function removed

***REMOVED***args.includeSummarySlot) {
    slots.push({
      slotId: 'project-recorder',
      label: 'Project Recorder',
      description: 'Produces a decision log, risk summary, and implementation follow-up after the room.',
      participantType: 'summary',
      occupancy: 'required',
      speakerId: 'chatroom-summary',
      profileId: 'chatroom-summary',
      metadata: {
        role: 'recorder',
      // Provider-specific function removed,
    // Provider-specific function removed);
  // Provider-specific function removed

  return slots;
// Provider-specific function removed

function buildReportSeminarSlots(args: {
  speakerIds: readonly string[];
  includeSummarySlot: boolean;
// Provider-specific function removed): RoomParticipantSlot[] {
  const slotSeeds = [
    {
      slotId: 'critic',
      label: 'Critic',
      description: 'Raises objections, weak arguments, and places where the report overclaims.',
      role: 'critic',
    // Provider-specific function removed,
    {
      slotId: 'domain-expert',
      label: 'Domain Expert',
      description: 'Evaluates subject-matter validity, framing, and practical relevance.',
      role: 'domain_expert',
    // Provider-specific function removed,
    {
      slotId: 'methodology-reviewer',
      label: 'Methodology Reviewer',
      description: 'Examines evidence quality, methods, and whether conclusions are supported.',
      role: 'methodology_reviewer',
    // Provider-specific function removed,
    {
      slotId: 'seminar-host',
      label: 'Seminar Host',
      description: 'Keeps the review structured and asks for clarifications when needed.',
      role: 'host',
    // Provider-specific function removed,
  ] as const;

  const slots: RoomParticipantSlot[] = [
    {
      slotId: 'system',
      label: 'System',
      description: 'Owns room bootstrap directives and room-level system messages.',
      participantType: 'system',
      occupancy: 'required',
      speakerId: 'system',
      metadata: {
        role: 'system',
      // Provider-specific function removed,
    // Provider-specific function removed,
    {
      slotId: 'presenter',
      label: 'Presenter',
      description: 'The human participant presenting a report, research note, or analysis draft.',
      participantType: 'human',
      occupancy: 'required',
      metadata: {
        role: 'presenter',
      // Provider-specific function removed,
    // Provider-specific function removed,
  ];

  for (const [index, speakerId] of args.speakerIds.entries()) {
    const seed = slotSeeds[index] ?? {
      slotId: `reviewer-${index + 1// Provider-specific function removed`,
      label: `Seminar Reviewer ${index + 1// Provider-specific function removed`,
      description: 'Additional seminar reviewer slot for domain or evidence critique.',
      role: 'reviewer',
    // Provider-specific function removed;
    slots.push({
      slotId: seed.slotId,
      label: seed.label,
      description: seed.description,
      participantType: 'agent',
      occupancy: 'required',
      speakerId,
      profileId: speakerId,
      metadata: {
        role: seed.role,
      // Provider-specific function removed,
    // Provider-specific function removed);
  // Provider-specific function removed

***REMOVED***args.includeSummarySlot) {
    slots.push({
      slotId: 'seminar-recorder',
      label: 'Seminar Recorder',
      description: 'Produces a review digest with key findings, objections, and revision guidance.',
      participantType: 'summary',
      occupancy: 'required',
      speakerId: 'chatroom-summary',
      profileId: 'chatroom-summary',
      metadata: {
        role: 'recorder',
      // Provider-specific function removed,
    // Provider-specific function removed);
  // Provider-specific function removed

  return slots;
// Provider-specific function removed

function buildMysterySlots(args: {
  speakerIds: readonly string[];
  includeSummarySlot: boolean;
  customCharacters?: RoleplayCharacterCard[];
// Provider-specific function removed): RoomParticipantSlot[] {
  const slots: RoomParticipantSlot[] = [
    {
      slotId: 'system',
      label: 'System',
      description: 'Owns room bootstrap directives and room-level system messages.',
      participantType: 'system',
      occupancy: 'required',
      speakerId: 'system',
      metadata: {
        role: 'system',
      // Provider-specific function removed,
    // Provider-specific function removed,
    {
      slotId: 'lead-investigator',
      label: 'Lead Investigator',
      description: 'The human participant asking questions, collecting clues, and steering the deduction.',
      participantType: 'human',
      occupancy: 'required',
      metadata: {
        role: 'lead_investigator',
      // Provider-specific function removed,
    // Provider-specific function removed,
  ];

  const customCharacters = normalizeCustomCharacters(args.customCharacters);
***REMOVED***customCharacters.length > 0) {
    const generatedSpeakerIds = selectCustomRoleplaySpeakerIds(customCharacters);
    slots.push({
      slotId: 'game-master',
      label: 'Game Master',
      description: 'Controls scene pressure, clue timing, and event injection without replacing the cast.',
      participantType: 'agent',
      occupancy: 'required',
      speakerId: generatedSpeakerIds[0]!,
      profileId: generatedSpeakerIds[0]!,
      metadata: {
        role: 'game_master',
        custom: true,
      // Provider-specific function removed,
    // Provider-specific function removed);
    for (const [index, character] of customCharacters.entries()) {
      slots.push({
        slotId: `mystery-cast-${index + 1// Provider-specific function removed`,
        label: character.name,
        description: character.instruction || 'Mystery room cast member.',
        participantType: 'agent',
        occupancy: 'required',
        speakerId: generatedSpeakerIds[index + 1]!,
        profileId: generatedSpeakerIds[index + 1]!,
        metadata: {
          role: index === 0 ? 'game_master' : 'cast_member',
          custom: true,
        // Provider-specific function removed,
      // Provider-specific function removed);
    // Provider-specific function removed
  // Provider-specific function removed else {
    const slotSeeds = [
      {
        slotId: 'game-master',
        label: 'Game Master',
        description: 'Controls the mystery scene, reveals new events, and keeps the room moving.',
        role: 'game_master',
      // Provider-specific function removed,
      {
        slotId: 'prime-suspect',
        label: 'Prime Suspect',
        description: 'Carries suspicious behavior, partial truths, and pressure under questioning.',
        role: 'suspect',
      // Provider-specific function removed,
      {
        slotId: 'witness',
        label: 'Witness',
        description: 'Provides observations, incomplete recollections, and soft contradictions.',
        role: 'witness',
      // Provider-specific function removed,
      {
        slotId: 'analyst',
        label: 'Case Analyst',
        description: 'Tracks clue consistency and points out tensions in the evolving story.',
        role: 'analyst',
      // Provider-specific function removed,
    ] as const;

    for (const [index, speakerId] of args.speakerIds.entries()) {
      const seed = slotSeeds[index] ?? {
        slotId: `cast-${index + 1// Provider-specific function removed`,
        label: `Mystery Cast ${index + 1// Provider-specific function removed`,
        description: 'Additional mystery room role that can add clues, motives, or contradictory testimony.',
        role: 'cast_member',
      // Provider-specific function removed;
      slots.push({
        slotId: seed.slotId,
        label: seed.label,
        description: seed.description,
        participantType: 'agent',
        occupancy: 'required',
        speakerId,
        profileId: speakerId,
        metadata: {
          role: seed.role,
        // Provider-specific function removed,
      // Provider-specific function removed);
    // Provider-specific function removed
  // Provider-specific function removed

***REMOVED***args.includeSummarySlot) {
    slots.push({
      slotId: 'case-board',
      label: 'Case Board',
      description: 'Produces a structured recap of clues, suspicion shifts, and unresolved questions.',
      participantType: 'summary',
      occupancy: 'required',
      speakerId: 'roleplay-summary',
      profileId: 'roleplay-summary',
      metadata: {
        role: 'case_board',
      // Provider-specific function removed,
    // Provider-specific function removed);
  // Provider-specific function removed

  return slots;
// Provider-specific function removed

function normalizeCustomCharacters(
  value: RoleplayCharacterCard[] | undefined,
): RoleplayCharacterCard[] {
  return normalizeRoleplayCharacterCards(value);
// Provider-specific function removed
