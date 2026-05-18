import type { AgentContextReader, AgentProfile // Provider-specific function removed from '../core/agent-profile.js';
import {
  platformAdminConversationTurnSchema,
  platformAdminRoomPlanSchema,
// Provider-specific function removed from './schemas.js';

interface PlatformAdminBaseContext {
  userBrief: string;
  hardConstraints: string[];
  planningMode: 'single_turn_room_planning' | 'multi_turn_room_planning';
// Provider-specific function removed

export interface PlatformAdminContext extends PlatformAdminBaseContext {
  planningMode: 'single_turn_room_planning';
// Provider-specific function removed

export interface PlatformAdminConversationContext
  extends PlatformAdminBaseContext {
  planningMode: 'multi_turn_room_planning';
  followUpRoundCount: number;
  pendingQuestions: string[];
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
  // Provider-specific function removed>;
// Provider-specific function removed

const requestReader: AgentContextReader<PlatformAdminBaseContext> = {
  id: 'platform-admin-request',
  title: 'User Request',
  render: (context) =>
    [
      `Brief: ${context.userBrief// Provider-specific function removed`,
      context.hardConstraints.length > 0
        ? `Hard constraints: ${context.hardConstraints.join(' | ')// Provider-specific function removed`
        : 'Hard constraints: none',
      `Planning mode: ${context.planningMode// Provider-specific function removed`,
    ].join('\n'),
// Provider-specific function removed;

const templateCatalogReader: AgentContextReader<PlatformAdminBaseContext> = {
  id: 'platform-admin-template-catalog',
  title: 'Supported Scenario Templates',
  render: () =>
    [
      '- interview_simulation: mock interview room with candidate, interview panel, and recorder',
      '- project_development_discussion: project review room with product, architect, engineer, critic, and recorder',
      '- report_seminar: report or paper seminar room with presenter, reviewers, and recorder',
      '- roleplay_scene: freeform roleplay room with user actor and dynamic cast',
      '- murder_mystery: deduction-oriented roleplay room with investigator and cast',
      '- brainstorm_workshop: idea generation room',
      '- expert_discussion: generic structured analysis room',
    ].join('\n'),
// Provider-specific function removed;

const conversationHistoryReader: AgentContextReader<PlatformAdminConversationContext> = {
  id: 'platform-admin-conversation-history',
  title: 'Conversation History',
  render: (context) => {
  ***REMOVED***context.conversationHistory.length === 0) {
      return 'No conversation history yet.';
    // Provider-specific function removed

    return context.conversationHistory
      .map((message, index) => {
        const label = message.role === 'assistant' ? 'Assistant' : 'User';
        return `${index + 1// Provider-specific function removed. ${label// Provider-specific function removed: ${message.content// Provider-specific function removed`;
      // Provider-specific function removed)
      .join('\n');
  // Provider-specific function removed,
// Provider-specific function removed;

const clarificationStateReader: AgentContextReader<PlatformAdminConversationContext> = {
  id: 'platform-admin-clarification-state',
  title: 'Clarification State',
  render: (context) =>
    [
      `Clarification rounds so far: ${context.followUpRoundCount// Provider-specific function removed`,
      context.pendingQuestions.length > 0
        ? `Pending questions: ${context.pendingQuestions.join(' | ')// Provider-specific function removed`
        : 'Pending questions: none',
    ].join('\n'),
// Provider-specific function removed;

export const platformAdminRoomPlannerProfile: AgentProfile<
  PlatformAdminContext,
  typeof platformAdminRoomPlanSchema
> = {
  id: 'platform-admin-room-planner',
  name: 'Platform Admin',
  description: 'Converts a natural-language room request into a structured scenario plan.',
  instructions: [
    'You are the AX-001 platform admin agent.',
    'Convert the user request into one room plan that can be created immediately.',
    'Choose exactly one supported scenario template and return output that matches the schema.',
    'Prefer a best-effort, buildable plan instead of refusing when details are missing.',
    'Put missing details into assumptions and followUpQuestions.',
    'Use concise Simplified Chinese in natural-language string fields unless the user clearly requested another language.',
    'Make title feel like a room title, topic feel like the room topic, and objective feel like the room objective.',
    'Keep constraints limited to items that actually affect room setup or room behavior.',
    'For interview_simulation, when the user gives a specific evaluation rubric, fill interview.scoreTemplateId or interview.scoreDimensions accordingly.',
    'If the request clearly maps to interview, project discussion, report seminar, tavern roleplay, general roleplay, or murder mystery, prefer the matching template.',
    'For roleplay_scene and murder_mystery, extract character ideas into customCharacters when the user implies named roles or identities.',
    'When a roleplay character has a stable identity, set customCharacters.characterId as a short ASCII slug and preserve goals, private notes, and relationships when the user provides them.',
    'Only set runtimeConfig fields when there is a concrete reason to override defaults.',
    'Only set governance fields when the user clearly wants stronger room admin, host, or recorder behavior than the scenario default.',
    'Do not output markdown. Do not explain the schema. Do not return fields outside the schema.',
    'Keep every string concise and schema-safe. Keep arrays short unless the request clearly needs more items.',
  ].join(' '),
  outputType: platformAdminRoomPlanSchema,
  modelSettings: {
    temperature: 0.2,
  // Provider-specific function removed,
  contextReaders: [requestReader, templateCatalogReader],
// Provider-specific function removed;

export const platformAdminConversationProfile: AgentProfile<
  PlatformAdminConversationContext,
  typeof platformAdminConversationTurnSchema
> = {
  id: 'platform-admin-conversation',
  name: 'Platform Admin Clarifier',
  description:
    'Runs a multi-turn room-planning conversation, asking for clarification only when it materially improves room creation.',
  instructions: [
    'You are the AX-001 platform admin agent in multi-turn room planning mode.',
    'Your job is to either ask concise follow-up questions or finalize one room plan that can be created immediately.',
    'Use status="needs_clarification" only when the missing information would materially change the scenario choice, participant composition, or room objective.',
    'When asking for clarification, ask at most 3 short, concrete questions in one assistant message.',
    'When enough information exists, use status="ready" and return a complete roomPlan.',
    'Prefer buildable plans over perfect completeness.',
    'If the user already answered enough in previous turns, stop asking and finalize.',
    'Carry forward hard constraints and prior answers instead of asking the same thing again.',
    'For interview_simulation, only set interview.scoreTemplateId or interview.scoreDimensions when the user explicitly indicates how they want candidate evaluation to be scored.',
    'Use roomPlan.governance only when the user clearly asked for stronger admin, host, or recorder behavior than the default scenario policy.',
    'Use concise Simplified Chinese in assistantMessage and natural-language room fields unless the user clearly requested another language.',
    'Do not output markdown. Do not explain the schema. Do not return fields outside the schema.',
  ].join(' '),
  outputType: platformAdminConversationTurnSchema,
  modelSettings: {
    temperature: 0.2,
  // Provider-specific function removed,
  contextReaders: [
    requestReader,
    clarificationStateReader,
    conversationHistoryReader,
    templateCatalogReader,
  ],
// Provider-specific function removed;
