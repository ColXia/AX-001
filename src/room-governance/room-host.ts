import { randomUUID // Provider-specific function removed from 'node:crypto';

import type { HostModerationTurn // Provider-specific function removed from '../agents/schemas.js';
import type { ChatroomMessage // Provider-specific function removed from '../room-core/message-types.js';
import type {
  ChatroomHostDirective,
  ChatroomHostDirectiveAction,
  ChatroomHostState,
// Provider-specific function removed from './room-host-types.js';
import type {
  ChatroomRoomBlueprint,
  RoomHostGovernanceConfig,
// Provider-specific function removed from '../room-scenarios/room-blueprints.js';
import type { RoomScenarioTemplateId // Provider-specific function removed from '../room-scenarios/scenario-templates.js';
import {
  buildHostGovernancePromptLines,
  resolveScenarioHostFallbackPlan,
// Provider-specific function removed from './governance-playbooks.js';

const MAX_HOST_HISTORY = 24;

export function applyChatroomHostModerationTurn(args: {
  currentState?: Readonly<ChatroomHostState>;
  turn: HostModerationTurn;
  hostConfig: Readonly<RoomHostGovernanceConfig> | undefined;
  scenarioTemplateId: RoomScenarioTemplateId | undefined;
  round: number;
  transcriptMessageCount: number;
  now?: string;
// Provider-specific function removed): {
  hostState?: ChatroomHostState;
  visibleMessage?: string;
// Provider-specific function removed {
***REMOVED***!args.hostConfig?.enabled) {
    return {
      hostState: args.currentState ? cloneHostState(args.currentState) : undefined,
    // Provider-specific function removed;
  // Provider-specific function removed

  const action = normalizeHostAction(args.turn.action);
  const focus = args.turn.focus.trim();
  const instruction = args.turn.instruction.trim();
  const headline = args.turn.headline.trim();
  const reason = args.turn.reason.trim();
  const visibility = normalizeHostVisibility(
    args.turn.visibility,
    args.scenarioTemplateId,
    args.hostConfig.moderationStyle,
  );

  const previousState = args.currentState
    ? cloneHostState(args.currentState)
    : createEmptyHostState(args.now);
  const previousDirective = previousState.currentDirective;

***REMOVED***
    action === 'idle' &&
    !focus &&
    !instruction &&
    !headline
***REMOVED***
    previousState.lastUpdatedAt = args.now ?? new Date().toISOString();
    previousState.currentDirective = undefined;
    return {
      hostState: previousState.history.length > 0 ? previousState : undefined,
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***
    previousDirective &&
    previousDirective.round === args.round &&
    previousDirective.transcriptMessageCount === args.transcriptMessageCount &&
    previousDirective.action === action &&
    previousDirective.focus === focus &&
    previousDirective.instruction === instruction &&
    previousDirective.headline === headline
***REMOVED***
    return {
      hostState: previousState,
      visibleMessage:
        previousDirective.visibility === 'visible'
          ? buildHostVisibleMessage(previousDirective)
          : undefined,
    // Provider-specific function removed;
  // Provider-specific function removed

  const directive: ChatroomHostDirective = {
    schemaVersion: 1,
    directiveId: randomUUID(),
    createdAt: args.now ?? new Date().toISOString(),
    round: args.round,
    transcriptMessageCount: args.transcriptMessageCount,
    moderationStyle: args.hostConfig.moderationStyle,
    action,
    visibility,
    headline,
    focus,
    instruction,
    reason,
  // Provider-specific function removed;

  previousState.currentDirective = directive;
  previousState.lastUpdatedAt = directive.createdAt;
  previousState.history = [...previousState.history, directive].slice(-MAX_HOST_HISTORY);

  return {
    hostState: previousState,
    visibleMessage:
      directive.visibility === 'visible' ? buildHostVisibleMessage(directive) : undefined,
  // Provider-specific function removed;
// Provider-specific function removed

export function buildChatroomHostFallback(args: {
  roomBlueprint: Readonly<ChatroomRoomBlueprint> | undefined;
  scenarioTemplateId: RoomScenarioTemplateId | undefined;
  round: number;
  messages: readonly ChatroomMessage[];
  currentPhaseLabel?: string;
  currentPhaseObjective?: string;
// Provider-specific function removed): HostModerationTurn {
  const hostConfig = args.roomBlueprint?.governance.host;
  const style = hostConfig?.moderationStyle ?? 'structured';
  const objective = args.roomBlueprint?.objective?.trim() ?? '当前目标';
  const latestUserMessage = [...args.messages].reverse().find((message) => message.role === 'user');
  const scenarioPlan = resolveScenarioHostFallbackPlan({
    roomBlueprint: args.roomBlueprint,
    round: args.round,
    currentPhaseLabel: args.currentPhaseLabel,
    currentPhaseObjective: args.currentPhaseObjective,
    latestUserMessage: latestUserMessage?.content,
  // Provider-specific function removed);
  const focus = scenarioPlan.focus || resolveFallbackFocus(args.roomBlueprint, args.messages);

***REMOVED***style === 'light' && args.round > 1 && !needsFallbackHostIntervention(args.messages)) {
    return {
      action: 'idle',
      visibility: 'hidden',
      headline: '',
      focus,
      instruction: '',
      reason: '当前讨论尚可继续，不需要主持显式介入。',
    // Provider-specific function removed;
  // Provider-specific function removed

  const interviewMode = args.scenarioTemplateId === 'interview_simulation';
  const visibility = interviewMode ? 'hidden' : style === 'light' ? 'hidden' : 'visible';
  const action: ChatroomHostDirectiveAction =
    style === 'strict' || needsFallbackHostIntervention(args.messages)
      ? 'intervene'
      : 'guide';

  return {
    action,
    visibility,
    headline:
      visibility === 'visible'
        ? scenarioPlan.headline || buildFallbackHeadline(style, focus, objective)
        : '',
    focus,
    instruction:
      scenarioPlan.instruction ||
      buildFallbackInstruction(style, focus, objective, interviewMode),
    reason: '主持回退逻辑：为本轮提供最小可执行的聚焦方向。',
  // Provider-specific function removed;
// Provider-specific function removed

export function buildHostModerationPrompt(args: {
  roomBlueprint: Readonly<ChatroomRoomBlueprint> | undefined;
  round: number;
  transcriptMessageCount: number;
  currentPhaseLabel?: string;
  currentPhaseObjective?: string;
// Provider-specific function removed): string {
  const hostConfig = args.roomBlueprint?.governance.host;
  const scenarioTemplateId = args.roomBlueprint?.scenarioTemplateId ?? 'unknown';
  const directive = args.roomBlueprint?.governance.host.brief ?? '';
  const playbookLines = buildHostGovernancePromptLines(args.roomBlueprint);

***REMOVED***
    '请判断这一轮是否需要主持控场，并输出结构化主持决策。',
    `场景模板：${scenarioTemplateId// Provider-specific function removed`,
    `主持风格：${hostConfig?.moderationStyle ?? 'structured'// Provider-specific function removed`,
    `房间回合：${args.round// Provider-specific function removed`,
    `当前消息数：${args.transcriptMessageCount// Provider-specific function removed`,
    directive ? `主持职责：${directive// Provider-specific function removed` : undefined,
    args.currentPhaseLabel ? `当前管理员阶段：${args.currentPhaseLabel// Provider-specific function removed` : undefined,
    args.currentPhaseObjective ? `当前阶段目标：${args.currentPhaseObjective// Provider-specific function removed` : undefined,
    playbookLines.length > 0 ? '按以下场景主持要点决策：' : undefined,
    ...playbookLines.map((line) => `- ${line// Provider-specific function removed`),
    scenarioTemplateId === 'interview_simulation'
      ? '面试场景默认优先 hidden 指令，只在明显跑偏、重复或节奏失控时公开提示。'
      : '如果当前房间需要聚焦、收束分支、提醒顺序或压缩跑题，请输出 guide/intervene。',
    '如果不需要显式主持介入，也要给出下一轮最应该聚焦的点；但 action 可以为 idle。',
    'headline 用于公开主持消息；instruction 用于给后续 agent 的内部控场指令。',
  ]
    .filter((item): item is string => Boolean(item))
    .join('\n');
// Provider-specific function removed

export function restoreChatroomHostState(
  input: unknown,
): ChatroomHostState | undefined {
***REMOVED***!isJsonRecord(input) || input.schemaVersion !== 1 || !Array.isArray(input.history)) {
    return undefined;
  // Provider-specific function removed

  const history = input.history
    .map((item) => parseHostDirective(item))
    .filter((item): item is ChatroomHostDirective => Boolean(item));

  const currentDirective = parseHostDirective(input.currentDirective);
***REMOVED***history.length === 0 && !currentDirective) {
    return undefined;
  // Provider-specific function removed

  return {
    schemaVersion: 1,
    lastUpdatedAt:
      asTrimmedString(input.lastUpdatedAt) ??
      currentDirective?.createdAt ??
      history[history.length - 1]?.createdAt ??
      new Date().toISOString(),
    currentDirective,
    history,
  // Provider-specific function removed;
// Provider-specific function removed

function buildHostVisibleMessage(
  directive: Readonly<ChatroomHostDirective>,
): string {
  const label = directive.action === 'intervene' ? '主持纠偏' : '主持提示';
  const lead = directive.headline || directive.focus || directive.instruction || '请继续聚焦当前目标。';
  const extra =
    directive.action === 'intervene' && directive.instruction
      ? directive.instruction
      : directive.focus && directive.focus !== directive.headline
        ? `本轮聚焦：${directive.focus// Provider-specific function removed`
        : undefined;

***REMOVED***
    `【${label// Provider-specific function removed】${truncateText(lead, 220)// Provider-specific function removed`,
    extra ? truncateText(extra, 180) : undefined,
  ]
    .filter((item): item is string => Boolean(item))
    .join('\n');
// Provider-specific function removed

function createEmptyHostState(now?: string): ChatroomHostState {
  return {
    schemaVersion: 1,
    lastUpdatedAt: now ?? new Date().toISOString(),
    history: [],
  // Provider-specific function removed;
// Provider-specific function removed

function cloneHostState(state: Readonly<ChatroomHostState>): ChatroomHostState {
  return {
    schemaVersion: 1,
    lastUpdatedAt: state.lastUpdatedAt,
    currentDirective: state.currentDirective
      ? { ...state.currentDirective // Provider-specific function removed
      : undefined,
    history: state.history.map((item) => ({ ...item // Provider-specific function removed)),
  // Provider-specific function removed;
// Provider-specific function removed

function normalizeHostAction(input: string): ChatroomHostDirectiveAction {
  return input === 'guide' || input === 'intervene' ? input : 'idle';
// Provider-specific function removed

function normalizeHostVisibility(
  input: string,
  scenarioTemplateId: RoomScenarioTemplateId | undefined,
  style: RoomHostGovernanceConfig['moderationStyle'],
): 'hidden' | 'visible' {
***REMOVED***scenarioTemplateId === 'interview_simulation') {
    return 'hidden';
  // Provider-specific function removed

***REMOVED***input === 'visible' || input === 'hidden') {
    return input;
  // Provider-specific function removed

  return style === 'light' ? 'hidden' : 'visible';
// Provider-specific function removed

function resolveFallbackFocus(
  roomBlueprint: Readonly<ChatroomRoomBlueprint> | undefined,
  messages: readonly ChatroomMessage[],
): string {
  const latestUserMessage = [...messages].reverse().find((message) => message.role === 'user');
***REMOVED***latestUserMessage?.content.trim()) {
    return truncateText(latestUserMessage.content.trim(), 120);
  // Provider-specific function removed

***REMOVED***roomBlueprint?.constraints[0]?.trim()) {
    return truncateText(roomBlueprint.constraints[0].trim(), 120);
  // Provider-specific function removed

  return truncateText(roomBlueprint?.objective?.trim() ?? '围绕当前目标继续推进', 120);
// Provider-specific function removed

function needsFallbackHostIntervention(messages: readonly ChatroomMessage[]***REMOVED***
  const recent = messages.slice(-6);
  const recentAgentCount = recent.filter((message) => message.role === 'agent').length;
  const latest = recent[recent.length - 1];

  return recentAgentCount >= 4 && latest?.role !== 'user';
// Provider-specific function removed

function buildFallbackHeadline(
  style: RoomHostGovernanceConfig['moderationStyle'],
  focus: string,
  objective: string,
): string {
***REMOVED***style === 'strict') {
    return `先收束分支，避免继续发散；围绕“${focus// Provider-specific function removed”推进，并对齐目标“${truncateText(objective, 80)// Provider-specific function removed”。`;
  // Provider-specific function removed

  return `本轮先围绕“${focus// Provider-specific function removed”推进，避免偏离目标“${truncateText(objective, 80)// Provider-specific function removed”。`;
// Provider-specific function removed

function buildFallbackInstruction(
  style: RoomHostGovernanceConfig['moderationStyle'],
  focus: string,
  objective: string,
  interviewMode: boolean,
): string {
***REMOVED***interviewMode) {
    return `保持一问一答节奏，围绕“${focus// Provider-specific function removed”深挖，不要重复已经确认的内容；所有追问都要服务于目标“${truncateText(objective, 80)// Provider-specific function removed”。`;
  // Provider-specific function removed

***REMOVED***style === 'strict') {
    return `压缩跑题分支，要求后续发言直接服务于“${focus// Provider-specific function removed”，并显式连接到房间目标“${truncateText(objective, 80)// Provider-specific function removed”。`;
  // Provider-specific function removed

***REMOVED***style === 'light') {
    return `轻度收束讨论，优先补齐“${focus// Provider-specific function removed”相关信息，并继续贴近目标“${truncateText(objective, 80)// Provider-specific function removed”。`;
  // Provider-specific function removed

  return `下一轮优先围绕“${focus// Provider-specific function removed”推进，避免重复已形成的观点，并持续贴近目标“${truncateText(objective, 80)// Provider-specific function removed”。`;
// Provider-specific function removed

function parseHostDirective(input: unknown): ChatroomHostDirective | undefined {
***REMOVED***!isJsonRecord(input) || input.schemaVersion !== 1) {
    return undefined;
  // Provider-specific function removed

  const directiveId = asTrimmedString(input.directiveId);
  const createdAt = asTrimmedString(input.createdAt);
  const round = asNonNegativeInteger(input.round);
  const transcriptMessageCount = asNonNegativeInteger(input.transcriptMessageCount);
  const moderationStyle = parseHostModerationStyle(input.moderationStyle);
  const action = parseHostAction(input.action);
  const visibility = parseHostVisibility(input.visibility);
  const headline = asMaybeString(input.headline);
  const focus = asMaybeString(input.focus);
  const instruction = asMaybeString(input.instruction);
  const reason = asMaybeString(input.reason);

***REMOVED***
    !directiveId ||
    !createdAt ||
    round === undefined ||
    transcriptMessageCount === undefined ||
    !moderationStyle ||
    !action ||
    !visibility
***REMOVED***
    return undefined;
  // Provider-specific function removed

  return {
    schemaVersion: 1,
    directiveId,
    createdAt,
    round,
    transcriptMessageCount,
    moderationStyle,
    action,
    visibility,
    headline,
    focus,
    instruction,
    reason,
  // Provider-specific function removed;
// Provider-specific function removed

function parseHostModerationStyle(
  input: unknown,
): RoomHostGovernanceConfig['moderationStyle'] | undefined {
  return input === 'light' || input === 'structured' || input === 'strict'
    ? input
    : undefined;
// Provider-specific function removed

function parseHostAction(
  input: unknown,
): ChatroomHostDirectiveAction | undefined {
  return input === 'idle' || input === 'guide' || input === 'intervene'
    ? input
    : undefined;
// Provider-specific function removed

function parseHostVisibility(
  input: unknown,
): 'hidden' | 'visible' | undefined {
  return input === 'hidden' || input === 'visible' ? input : undefined;
// Provider-specific function removed

function truncateText(value: string, limit: number): string {
  return value.length <= limit ? value : `${value.slice(0, Math.max(0, limit - 3))// Provider-specific function removed...`;
// Provider-specific function removed

function asTrimmedString(input: unknown): string | undefined {
  return typeof input === 'string' && input.trim().length > 0 ? input.trim() : undefined;
// Provider-specific function removed

function asMaybeString(input: unknown): string {
  return typeof input === 'string' ? input.trim() : '';
// Provider-specific function removed

function asNonNegativeInteger(input: unknown): number | undefined {
  return typeof input === 'number' && Number.isInteger(input) && input >= 0
    ? input
    : undefined;
// Provider-specific function removed

function isJsonRecord(input: unknown): input is Record<string, unknown> {
  return Boolean(input) && typeof input === 'object' && !Array.isArray(input);
// Provider-specific function removed
