import {
  INTERVIEW_DEMO_ROOM_TITLE,
  type ChatroomRoomBlueprint,
  ensureChatroomRoomBlueprint,
  formatRoomBlueprintGovernanceSummary,
  resolveBlueprintSpeakerIds,
// Provider-specific function removed from '../room-scenarios/room-blueprints.js';
import type { RoleplayCharacterCard // Provider-specific function removed from '../room-scenarios/roleplay/roleplay-characters.js';
import {
  type ChatroomRoomTypeId,
  resolveChatroomRoomType,
// Provider-specific function removed from '../workflows/chatroom-room-types.js';
import {
  createCustomRoleplayTemplates,
  createInitialRoleplaySceneState,
  type RoleplayCharacterTemplate,
// Provider-specific function removed from '../workflows/chatroom-roleplay-state.js';
import {
  isLegacyRoomRuntimeMode,
  resolveRoomRuntimeModeFromBlueprint,
// Provider-specific function removed from '../workflows/room-runtime-mode.js';
import type { ChatroomRunInput, ChatroomState // Provider-specific function removed from './room-state.js';
import { appendChatroomMessage // Provider-specific function removed from './messages.js';

export function createInitialChatroomState(input: ChatroomRunInput): ChatroomState {
  const roomBlueprint = ensureChatroomRoomBlueprint(input.roomBlueprint, {
    roomType: input.roomType,
    topic: input.topic,
    objective: input.objective,
    constraints: input.constraints,
    speakerIds: input.speakerIds,
    parallelBatchSize: input.parallelBatchSize,
    customCharacters: input.customCharacters,
    maxReplyCharacters: input.maxReplyCharacters,
    summaryEnabled: input.summaryEnabled,
  // Provider-specific function removed);
  const roomType = roomBlueprint.roomType;
  const roomTypeSpec = resolveChatroomRoomType(roomType);
  const constraints = [...roomBlueprint.constraints];
  const speakerIds = resolveBlueprintSpeakerIds(roomBlueprint);
  const customCharacters =
    roomBlueprint.customCharacters && roomBlueprint.customCharacters.length > 0
      ? structuredClone(roomBlueprint.customCharacters)
      : undefined;
  const customRoleplayTemplates = resolveCustomRoleplayTemplates({
    roomType,
    customCharacters,
    customRoleplayTemplates: input.customRoleplayTemplates,
  // Provider-specific function removed);
  const state: ChatroomState = {
    roomType,
    scenarioTemplateId: roomBlueprint.scenarioTemplateId,
    runtimeMode: resolveRoomRuntimeModeFromBlueprint(roomBlueprint),
    roomBlueprint,
    topic: roomBlueprint.topic,
    objective: roomBlueprint.objective,
    constraints,
    speakerIds,
    messages: [],
    customCharacters,
    customRoleplayTemplates,
    maxReplyCharacters: roomBlueprint.runtimeConfig.maxReplyCharacters,
    roleplayScene:
      roomTypeSpec.behavior === 'roleplay'
        ? createInitialRoleplaySceneState({
            topic: roomBlueprint.topic,
            objective: roomBlueprint.objective,
            speakerIds,
            constraints,
            customTemplates: customRoleplayTemplates,
          // Provider-specific function removed)
        : undefined,
    interviewCurrentPhase: isInterviewScenario(roomBlueprint) ? 'opening' : undefined,
  // Provider-specific function removed;

  appendChatroomMessage(state, {
    role: 'system',
    authorId: 'system',
    authorName: 'System',
    round: 0,
    content: buildInitialSystemMessage(roomBlueprint, roomTypeSpec),
  // Provider-specific function removed);
  appendChatroomMessage(state, {
    role: 'user',
    authorId: 'user',
    authorName: resolvePrimaryHumanParticipantLabel(roomBlueprint),
    round: 0,
    content: buildInitialUserSeedMessage(roomBlueprint, roomTypeSpec),
  // Provider-specific function removed);

  return state;
// Provider-specific function removed

export function isInterviewDemoBlueprint(
  roomBlueprint: Readonly<ChatroomRoomBlueprint> | undefined,
***REMOVED***
  return roomBlueprint?.title === INTERVIEW_DEMO_ROOM_TITLE &&
    roomBlueprint.scenarioTemplateId === 'interview_simulation' &&
    isLegacyRoomRuntimeMode(resolveRoomRuntimeModeFromBlueprint(roomBlueprint));
// Provider-specific function removed

export function buildInitialSystemMessage(
  roomBlueprint: Readonly<ChatroomRoomBlueprint>,
  roomTypeSpec: ReturnType<typeof resolveChatroomRoomType>,
): string {
***REMOVED***!isInterviewScenario(roomBlueprint)) {
    return appendGovernanceSystemMessage(
      roomTypeSpec.buildSystemMessage(),
      roomBlueprint,
    );
  // Provider-specific function removed

  return appendGovernanceSystemMessage(
    [
      '这是一个可实际使用的模拟面试房间。',
      isInterviewDemoBlueprint(roomBlueprint)
        ? '房间中的人类参与者是候选人，Agent 参与者依次承担 HR、技术面、综合能力追问和观察补充追问职责。'
        : '房间中的人类参与者是候选人，Agent 参与者依次承担 HR、技术面、经理面和观察补充追问职责。',
      '面试官每次只推进一个阶段，提出一个主问题后等待候选人回答，再进入下一轮。',
      '当面试官切换时，允许出现一条很短的面试官交接消息，用来说明已获得的信号和下一步要补的缺口。',
      '问题必须根据目标岗位方向调整：后端、前端、算法、产品等岗位不能套用同一套追问模板。',
      '所有评估都必须基于候选人已经说出的证据，信息不足时要保守判断。',
      isInterviewDemoBlueprint(roomBlueprint)
        ? '这是 demo 验证场景，允许面试官基于候选人现场回答动态调整追问，不要机械执行固定题单。'
        : undefined,
      '统一使用简体中文。',
    ].join('\n'),
    roomBlueprint,
  );
// Provider-specific function removed

export function appendGovernanceSystemMessage(
  baseMessage: string,
  roomBlueprint: Readonly<ChatroomRoomBlueprint>,
): string {
  const governanceSummary = formatRoomBlueprintGovernanceSummary(
    roomBlueprint.governance,
  );

***REMOVED***
    baseMessage,
    '',
    `Room governance: ${governanceSummary// Provider-specific function removed.`,
    `Room admin brief: ${roomBlueprint.governance.roomAdmin.brief// Provider-specific function removed`,
    `Host brief: ${roomBlueprint.governance.host.brief// Provider-specific function removed`,
    `Recorder brief: ${roomBlueprint.governance.recorder.brief// Provider-specific function removed`,
  ].join('\n');
// Provider-specific function removed

export function buildInitialUserSeedMessage(
  roomBlueprint: Readonly<ChatroomRoomBlueprint>,
  roomTypeSpec: ReturnType<typeof resolveChatroomRoomType>,
): string {
***REMOVED***!isInterviewScenario(roomBlueprint)) {
    return roomTypeSpec.buildSeedUserMessage({
      topic: roomBlueprint.topic,
      objective: roomBlueprint.objective,
      constraints: roomBlueprint.constraints,
    // Provider-specific function removed);
  // Provider-specific function removed

  const scenario = roomBlueprint.metadata?.scenario;
  const scenarioRecord =
    scenario && typeof scenario === 'object' && !Array.isArray(scenario)
      ? (scenario as Record<string, unknown>)
      : undefined;
  const focusAreas = roomBlueprint.constraints
    .map((item) => {
      const match = /^focus areas:\s*(.+)$/i.exec(item);
      return match?.[1];
    // Provider-specific function removed)
    .filter((item): item is string => Boolean(item));

***REMOVED***isInterviewDemoBlueprint(roomBlueprint)) {
  ***REMOVED***
      '我是一名计算机本科学生，专业背景符合本场面试要求。',
      '这场 demo 不预设具体岗位方向，请按真实面试节奏逐步提问。',
      focusAreas.length > 0 ? `可以重点了解：${focusAreas.join('；')// Provider-specific function removed` : undefined,
      '后续我会像真实候选人一样，逐步回答专业基础、项目经历和综合能力相关问题。',
      '统一使用简体中文。',
    ]
      .filter((item): item is string => Boolean(item))
      .join('\n');
  // Provider-specific function removed

***REMOVED***
    `你现在以候选人身份加入这场模拟面试。`,
    `目标岗位：${asOptionalString(scenarioRecord?.targetRole) ?? roomBlueprint.topic// Provider-specific function removed`,
    asOptionalString(scenarioRecord?.targetLevel)
      ? `目标级别：${asOptionalString(scenarioRecord?.targetLevel)// Provider-specific function removed`
      : undefined,
    `面试目标：${roomBlueprint.objective// Provider-specific function removed`,
    focusAreas.length > 0 ? `重点考察：${focusAreas.join('；')// Provider-specific function removed` : undefined,
    '请像真实候选人一样回答问题：先给结论，再讲背景、行动、结果和数据。',
    '统一使用简体中文。',
  ]
    .filter((item): item is string => Boolean(item))
    .join('\n');
// Provider-specific function removed

export function isInterviewScenario(
  roomBlueprint: Readonly<ChatroomRoomBlueprint> | undefined,
***REMOVED***
  return roomBlueprint?.scenarioTemplateId === 'interview_simulation';
// Provider-specific function removed

export function resolveRequestedChatroomRounds(
  roomBlueprint: Readonly<ChatroomRoomBlueprint> | undefined,
  requestedRounds: number,
): number {
  return isInterviewScenario(roomBlueprint) ? 1 : requestedRounds;
// Provider-specific function removed

export function resolveCustomRoleplayTemplates(args: {
  roomType: ChatroomRoomTypeId;
  customCharacters: RoleplayCharacterCard[] | undefined;
  customRoleplayTemplates: Map<string, RoleplayCharacterTemplate> | undefined;
// Provider-specific function removed): Map<string, RoleplayCharacterTemplate> | undefined {
***REMOVED***args.customRoleplayTemplates && args.customRoleplayTemplates.size > 0) {
    return args.customRoleplayTemplates;
  // Provider-specific function removed

***REMOVED***
    resolveChatroomRoomType(args.roomType).behavior !== 'roleplay' ||
    !args.customCharacters ||
    args.customCharacters.length === 0
***REMOVED***
    return undefined;
  // Provider-specific function removed

  return createCustomRoleplayTemplates(args.customCharacters);
// Provider-specific function removed

export function resolvePrimaryHumanParticipantLabel(
  roomBlueprint: ChatroomRoomBlueprint | undefined,
): string {
  return roomBlueprint?.participantSlots.find((slot) => slot.participantType === 'human')?.label ?? 'User';
// Provider-specific function removed

function asOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
// Provider-specific function removed
