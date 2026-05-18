import { randomUUID // Provider-specific function removed from 'node:crypto';

import {
  platformAdminConversationProfile,
  platformAdminRoomPlannerProfile,
// Provider-specific function removed from '../agents/platform-admin.js';
import type {
  PlatformAdminConversationTurn,
  PlatformAdminRoomPlan,
// Provider-specific function removed from '../agents/schemas.js';
import type { AgentRuntime // Provider-specific function removed from '../core/agent-runtime.js';
import type { ChatroomRoomBlueprint // Provider-specific function removed from '../room-scenarios/room-blueprints.js';
import {
  planChatroomRoomScenario,
  type PlannedRoomScenario,
  type RoomScenarioPlanningInput,
// Provider-specific function removed from '../room-scenarios/scenario-planner.js';

export interface PlatformAdminRoomPlanningInput {
  request: string;
  hardConstraints?: string[];
  runtimeConfig?: {
    parallelBatchSize?: number;
    summaryEnabled?: boolean;
    maxReplyCharacters?: number;
  // Provider-specific function removed;
// Provider-specific function removed

export interface PlatformAdminRoomPlanningResult {
  adminPlan: PlatformAdminRoomPlan;
  blueprint: ChatroomRoomBlueprint;
  plannedScenario: PlannedRoomScenario;
  usage?: Record<string, unknown>;
// Provider-specific function removed

export interface PlatformAdminConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
// Provider-specific function removed

export interface PlatformAdminConversationState {
  version: 1;
  conversationId: string;
  request: string;
  hardConstraints: string[];
  turns: PlatformAdminConversationMessage[];
  pendingQuestions: string[];
  followUpRoundCount: number;
  assumptions: string[];
  tentativeScenarioTemplateId?: PlatformAdminRoomPlan['scenarioTemplateId'];
  finalPlan?: PlatformAdminRoomPlan;
  createdAt: string;
  updatedAt: string;
// Provider-specific function removed

export interface PlatformAdminConversationInput {
  conversation?: PlatformAdminConversationState;
  userMessage: string;
  hardConstraints?: string[];
  runtimeConfig?: PlatformAdminRoomPlanningInput['runtimeConfig'];
// Provider-specific function removed

export type PlatformAdminConversationResult =
  | {
      status: 'needs_clarification';
      conversation: PlatformAdminConversationState;
      assistantMessage: string;
      summary: string;
      followUpQuestions: string[];
      assumptions: string[];
      tentativeScenarioTemplateId?: PlatformAdminRoomPlan['scenarioTemplateId'];
      usage?: Record<string, unknown>;
    // Provider-specific function removed
  | {
      status: 'ready';
      conversation: PlatformAdminConversationState;
      assistantMessage: string;
      adminPlan: PlatformAdminRoomPlan;
      blueprint: ChatroomRoomBlueprint;
      plannedScenario: PlannedRoomScenario;
      usage?: Record<string, unknown>;
    // Provider-specific function removed;

export async function planRoomWithPlatformAdmin(
  agentRuntime: AgentRuntime,
  input: PlatformAdminRoomPlanningInput,
): Promise<PlatformAdminRoomPlanningResult> {
  const request = input.request.trim();
***REMOVED***!request) {
    throw new Error('platform admin request must not be empty.');
  // Provider-specific function removed

  const runResult = await agentRuntime.runDetailed(
    platformAdminRoomPlannerProfile,
    buildPlatformAdminPrompt(request),
    {
      context: {
        userBrief: request,
        hardConstraints: [...(input.hardConstraints ?? [])],
        planningMode: 'single_turn_room_planning',
      // Provider-specific function removed,
      maxTurns: 6,
    // Provider-specific function removed,
  );

  return finalizePlatformAdminPlan(runResult.output, input, runResult.usage);
// Provider-specific function removed

export function createPlatformAdminConversationState(input: {
  request: string;
  hardConstraints?: string[];
// Provider-specific function removed): PlatformAdminConversationState {
  const request = input.request.trim();
***REMOVED***!request) {
    throw new Error('platform admin request must not be empty.');
  // Provider-specific function removed

  const timestamp = new Date().toISOString();
  return {
    version: 1,
    conversationId: randomUUID(),
    request,
    hardConstraints: normalizeStringArray(input.hardConstraints),
    turns: [],
    pendingQuestions: [],
    followUpRoundCount: 0,
    assumptions: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  // Provider-specific function removed;
// Provider-specific function removed

export async function advanceRoomPlanningWithPlatformAdmin(
  agentRuntime: AgentRuntime,
  input: PlatformAdminConversationInput,
): Promise<PlatformAdminConversationResult> {
  const userMessage = input.userMessage.trim();
***REMOVED***!userMessage) {
    throw new Error('platform admin message must not be empty.');
  // Provider-specific function removed

  const conversation = input.conversation
    ? structuredClone(input.conversation)
    : createPlatformAdminConversationState({
        request: userMessage,
        hardConstraints: input.hardConstraints,
      // Provider-specific function removed);
***REMOVED***conversation.version !== 1) {
    throw new Error(`Unsupported platform admin conversation version "${conversation.version// Provider-specific function removed".`);
  // Provider-specific function removed

***REMOVED***!input.conversation && input.hardConstraints) {
    conversation.hardConstraints = normalizeStringArray(input.hardConstraints);
  // Provider-specific function removed

  conversation.turns.push({
    role: 'user',
    content: userMessage,
    createdAt: new Date().toISOString(),
  // Provider-specific function removed);
  conversation.updatedAt = new Date().toISOString();

  const runResult = await agentRuntime.runDetailed(
    platformAdminConversationProfile,
    buildPlatformAdminConversationPrompt(conversation, userMessage),
    {
      context: {
        userBrief: conversation.request,
        hardConstraints: [...conversation.hardConstraints],
        planningMode: 'multi_turn_room_planning',
        followUpRoundCount: conversation.followUpRoundCount,
        pendingQuestions: [...conversation.pendingQuestions],
        conversationHistory: conversation.turns.map((turn) => ({
          role: turn.role,
          content: turn.content,
        // Provider-specific function removed)),
      // Provider-specific function removed,
      maxTurns: 6,
    // Provider-specific function removed,
  );

  return applyPlatformAdminConversationTurn({
    conversation,
    turn: runResult.output,
    runtimeConfig: input.runtimeConfig,
    usage: runResult.usage,
  // Provider-specific function removed);
// Provider-specific function removed

function applyPlatformAdminConversationTurn(args: {
  conversation: PlatformAdminConversationState;
  turn: PlatformAdminConversationTurn;
  runtimeConfig?: PlatformAdminRoomPlanningInput['runtimeConfig'];
  usage?: Record<string, unknown>;
// Provider-specific function removed): PlatformAdminConversationResult {
  const assistantMessage = args.turn.assistantMessage.trim();
  args.conversation.turns.push({
    role: 'assistant',
    content: assistantMessage,
    createdAt: new Date().toISOString(),
  // Provider-specific function removed);
  args.conversation.updatedAt = new Date().toISOString();

***REMOVED***args.turn.status === 'needs_clarification') {
  ***REMOVED***args.turn.followUpQuestions.length === 0) {
      throw new Error(
        'Platform admin clarification turn must include at least one follow-up question.',
      );
    // Provider-specific function removed

    args.conversation.pendingQuestions = normalizeStringArray(args.turn.followUpQuestions);
    args.conversation.followUpRoundCount += 1;
    args.conversation.assumptions = mergeUniqueStrings(
      args.conversation.assumptions,
      args.turn.assumptions,
    );
    args.conversation.tentativeScenarioTemplateId =
      args.turn.tentativeScenarioTemplateId;

    return {
      status: 'needs_clarification',
      conversation: args.conversation,
      assistantMessage,
      summary: args.turn.summary,
      followUpQuestions: [...args.conversation.pendingQuestions],
      assumptions: [...args.conversation.assumptions],
      tentativeScenarioTemplateId: args.turn.tentativeScenarioTemplateId,
      usage: args.usage,
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***!args.turn.roomPlan) {
    throw new Error('Platform admin ready turn must include a roomPlan.');
  // Provider-specific function removed

  args.conversation.pendingQuestions = [];
  args.conversation.assumptions = mergeUniqueStrings(
    args.conversation.assumptions,
    args.turn.roomPlan.assumptions,
  );
  args.conversation.tentativeScenarioTemplateId =
    args.turn.roomPlan.scenarioTemplateId;
  args.conversation.finalPlan = structuredClone(args.turn.roomPlan);

  const finalized = finalizePlatformAdminPlan(
    args.turn.roomPlan,
    {
      request: args.conversation.request,
      hardConstraints: args.conversation.hardConstraints,
      runtimeConfig: args.runtimeConfig,
    // Provider-specific function removed,
    args.usage,
  );

  args.conversation.finalPlan = structuredClone(finalized.adminPlan);
  args.conversation.updatedAt = new Date().toISOString();

  return {
    status: 'ready',
    conversation: args.conversation,
    assistantMessage,
    adminPlan: finalized.adminPlan,
    blueprint: finalized.blueprint,
    plannedScenario: finalized.plannedScenario,
    usage: finalized.usage,
  // Provider-specific function removed;
// Provider-specific function removed

function finalizePlatformAdminPlan(
  adminPlan: PlatformAdminRoomPlan,
  input: PlatformAdminRoomPlanningInput,
  usage?: Record<string, unknown>,
): PlatformAdminRoomPlanningResult {
  const planningInput = convertAdminPlanToScenarioPlanningInput(adminPlan, input);
  const plannedScenario = planChatroomRoomScenario(planningInput);

  return {
    adminPlan,
    blueprint: plannedScenario.blueprint,
    plannedScenario: {
      blueprint: plannedScenario.blueprint,
      notes: [
        `Platform admin chose scenario "${adminPlan.scenarioTemplateId// Provider-specific function removed".`,
        ...plannedScenario.notes,
      ],
    // Provider-specific function removed,
    usage,
  // Provider-specific function removed;
// Provider-specific function removed

function buildPlatformAdminPrompt(request: string): string {
***REMOVED***
    'Plan one room that can be created immediately from the following user request.',
    'Choose the most suitable scenario template, then fill title, topic, objective, constraints, and any template-specific fields.',
    'If information is incomplete, still return a best-effort plan and record the gaps in assumptions and followUpQuestions.',
    '',
    '[User brief]',
    request,
  ].join('\n');
// Provider-specific function removed

function buildPlatformAdminConversationPrompt(
  conversation: Readonly<PlatformAdminConversationState>,
  latestUserMessage: string,
): string {
  const lines = [
    'Continue the room-planning conversation.',
    'Decide whether you still need clarification or can finalize the room now.',
    conversation.followUpRoundCount > 0
      ? 'Avoid repeating questions that were already asked unless the user left a critical gap unresolved.'
      : 'This is the first planning turn.',
    conversation.followUpRoundCount >= 2
      ? 'You already had multiple clarification chances. Unless a missing detail would break room creation, finalize now.'
      : 'Ask follow-up questions only when they materially improve room setup.',
    'If you need clarification, ask at most 3 short questions in one assistant message.',
    'If enough information exists, finalize with a buildable room plan.',
    '',
    '[Latest user message]',
    latestUserMessage,
  ];

***REMOVED***conversation.pendingQuestions.length > 0) {
    lines.push('', '[Pending questions to resolve]', ...conversation.pendingQuestions);
  // Provider-specific function removed

  return lines.join('\n');
// Provider-specific function removed

function convertAdminPlanToScenarioPlanningInput(
  plan: PlatformAdminRoomPlan,
  input: PlatformAdminRoomPlanningInput,
): RoomScenarioPlanningInput {
  const base = {
    scenarioTemplateId: plan.scenarioTemplateId,
    title: plan.title,
    topic: plan.topic,
    objective: plan.objective,
    constraints: [...plan.constraints, ...(input.hardConstraints ?? [])],
    runtimeConfig: {
      parallelBatchSize: input.runtimeConfig?.parallelBatchSize,
      summaryEnabled:
        input.runtimeConfig?.summaryEnabled ?? plan.runtimeConfig.summaryEnabled,
      maxReplyCharacters:
        input.runtimeConfig?.maxReplyCharacters ?? plan.runtimeConfig.maxReplyCharacters,
    // Provider-specific function removed,
    governance: plan.governance,
    metadata: {
      source: 'platform_admin',
      adminSummary: plan.summary,
      assumptions: [...plan.assumptions],
      followUpQuestions: [...plan.followUpQuestions],
      request: input.request,
    // Provider-specific function removed,
  // Provider-specific function removed;

  switch (plan.scenarioTemplateId) {
    case 'interview_simulation':
      return {
        ...base,
        scenarioTemplateId: plan.scenarioTemplateId,
        interview: plan.interview,
      // Provider-specific function removed;
    case 'project_development_discussion':
      return {
        ...base,
        scenarioTemplateId: plan.scenarioTemplateId,
        project: plan.project,
      // Provider-specific function removed;
    case 'report_seminar':
      return {
        ...base,
        scenarioTemplateId: plan.scenarioTemplateId,
        report: plan.report,
      // Provider-specific function removed;
    case 'murder_mystery':
      return {
        ...base,
        scenarioTemplateId: plan.scenarioTemplateId,
        customCharacters:
          plan.customCharacters.length > 0 ? plan.customCharacters : undefined,
        mystery: plan.mystery,
      // Provider-specific function removed;
    case 'tavern_roleplay_demo':
      return {
        ...base,
        scenarioTemplateId: plan.scenarioTemplateId,
        customCharacters:
          plan.customCharacters.length > 0 ? plan.customCharacters : undefined,
      // Provider-specific function removed;
    case 'roleplay_scene':
      return {
        ...base,
        scenarioTemplateId: plan.scenarioTemplateId,
        customCharacters:
          plan.customCharacters.length > 0 ? plan.customCharacters : undefined,
      // Provider-specific function removed;
    case 'brainstorm_workshop':
    case 'expert_discussion':
      return {
        ...base,
        scenarioTemplateId: plan.scenarioTemplateId,
      // Provider-specific function removed;
  // Provider-specific function removed
// Provider-specific function removed

function normalizeStringArray(values: readonly string[] | undefined): string[] {
  return takeUniqueStrings(values ?? []);
// Provider-specific function removed

function mergeUniqueStrings(
  existing: readonly string[],
  next: readonly string[],
): string[] {
  return takeUniqueStrings([...existing, ...next]);
// Provider-specific function removed

function takeUniqueStrings(values: readonly string[]): string[] {
  const unique = new Set<string>();
  const normalized: string[] = [];

  for (const value of values) {
    const trimmed = value.trim();
  ***REMOVED***!trimmed || unique.has(trimmed)) {
      continue;
    // Provider-specific function removed

    unique.add(trimmed);
    normalized.push(trimmed);
  // Provider-specific function removed

  return normalized;
// Provider-specific function removed
