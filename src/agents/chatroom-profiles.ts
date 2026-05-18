import {
  extendProfile,
  type AgentContextReader,
  type AgentProfile,
// Provider-specific function removed from '../core/agent-profile.js';
import { formatChatTranscript, formatConstraints // Provider-specific function removed from '../workflows/chatroom-format.js';
import { refreshRoomContextProvider, queryParticipantViewpointsProvider // Provider-specific function removed from '../workflows/chatroom-context-tools.js';
import { formatRoomBlueprintGovernanceSummary // Provider-specific function removed from '../room-scenarios/room-blueprints.js';
import {
  normalizeRoleplayCharacterCards,
  resolveCustomRoleplaySpeakerId,
  selectCustomRoleplaySpeakerIds as selectStableCustomRoleplaySpeakerIds,
  type RoleplayCharacterCard,
// Provider-specific function removed from '../room-scenarios/roleplay/roleplay-characters.js';
import type { ChatroomAgentContext // Provider-specific function removed from '../workflows/chatroom-types.js';
import type { ChatroomSpeakerPresetId // Provider-specific function removed from '../workflows/chatroom-room-types.js';
import {
  formatInterviewInternalSignalTagLabel,
  getInterviewInternalNoteSignalTags,
// Provider-specific function removed from '../workflows/interview-internal-notes.js';
import {
  finalSummarySchema,
  hostModerationTurnSchema,
  interviewSummarySchema,
  interviewTurnPlannerSchema,
  roomAdminTurnSchema,
  roomKernelTurnSchema,
  roleplaySummarySchema,
// Provider-specific function removed from './schemas.js';

const roomBriefReader: AgentContextReader<ChatroomAgentContext> = {
  id: 'room-brief',
  title: '聊天室简报',
  render: (context) =>
    [
      `发言者：${context.speakerName// Provider-specific function removed`,
      `角色定位：${context.speakerRole// Provider-specific function removed`,
      `房间类型：${context.roomType// Provider-specific function removed`,
      `轮次：${context.round// Provider-specific function removed`,
      '',
      `主题：${context.topic// Provider-specific function removed`,
      '',
      `目标：${context.objective// Provider-specific function removed`,
      '',
      '约束：',
      formatConstraints(context.constraints),
      '',
      context.roomGovernance
        ? `治理：${formatRoomBlueprintGovernanceSummary(context.roomGovernance)// Provider-specific function removed`
        : '治理：-',
      context.roomAdminDirective
        ? `管理员指令：${context.roomAdminDirective.action// Provider-specific function removed/${context.roomAdminDirective.visibility// Provider-specific function removed | ${context.roomAdminDirective.phaseLabel || context.roomAdminDirective.eventLabel || '-'// Provider-specific function removed`
        : '管理员指令：-',
      context.roomHostDirective
        ? `主持指令：${context.roomHostDirective.action// Provider-specific function removed/${context.roomHostDirective.visibility// Provider-specific function removed | ${context.roomHostDirective.focus || context.roomHostDirective.headline || '-'// Provider-specific function removed`
        : '主持指令：-',
      '',
      `最近消息数：${context.recentMessages.length// Provider-specific function removed`,
      `相关历史消息数：${context.relevantMessages.length// Provider-specific function removed`,
      `当前上下文消息数：${context.transcriptMessages.length// Provider-specific function removed / ${context.messageCount// Provider-specific function removed`,
    ].join('\n'),
// Provider-specific function removed;

const recentTranscriptReader: AgentContextReader<ChatroomAgentContext> = {
  id: 'chat-recent-transcript',
  title: '最近消息',
  render: (context) =>
    formatChatTranscript(context.recentMessages, {
      emptyText: '当前还没有最近消息。',
    // Provider-specific function removed),
// Provider-specific function removed;

const relevantTranscriptReader: AgentContextReader<ChatroomAgentContext> = {
  id: 'chat-relevant-transcript',
  title: '相关历史消息',
  render: (context) =>
    formatChatTranscript(context.relevantMessages, {
      emptyText: '当前没有命中的相关历史消息。',
    // Provider-specific function removed),
// Provider-specific function removed;

const speakerThreadMemoryReader: AgentContextReader<ChatroomAgentContext> = {
  id: 'speaker-thread-memory',
  title: 'Speaker thread memory',
  render: (context) => {
  ***REMOVED***!context.speakerThreadMemory) {
      return 'No persisted speaker thread memory is available for this room yet.';
    // Provider-specific function removed

    const mem = context.speakerThreadMemory;
    const lines = [
      `Participant: ${context.speakerName// Provider-specific function removed`,
      `Role label: ${context.speakerParticipantRoleLabel ?? context.speakerRole// Provider-specific function removed`,
      `Thread status: ${context.speakerThreadStatus ?? 'active'// Provider-specific function removed`,
      `Total messages: ${mem.messageCount// Provider-specific function removed`,
      `Last round: ${mem.lastRound// Provider-specific function removed`,
      `Last message at: ${mem.lastMessageAt ?? '-'// Provider-specific function removed`,
      `Read cursor: ${context.speakerThreadLastReadSequenceNo ?? mem.lastReadSequenceNo ?? '-'// Provider-specific function removed`,
      `Latest excerpt: ${mem.latestMessageExcerpt ?? '-'// Provider-specific function removed`,
      'Recent self excerpts:',
      formatConstraints(mem.recentMessageExcerpts),
    ];

  ***REMOVED***mem.scratchMemory) {
      lines.push(
        '',
        `Scratch memory (round ${mem.scratchMemory.round// Provider-specific function removed):`,
        `Observations: ${mem.scratchMemory.observations.length > 0 ? mem.scratchMemory.observations.join('; ') : '(none)'// Provider-specific function removed`,
        `Pending intents: ${mem.scratchMemory.pendingIntents.length > 0 ? mem.scratchMemory.pendingIntents.join('; ') : '(none)'// Provider-specific function removed`,
      );
    // Provider-specific function removed

  ***REMOVED***mem.longTermMemory) {
      lines.push(
        '',
        `Long-term memory (rounds ${mem.longTermMemory.fromRound// Provider-specific function removed–${mem.longTermMemory.toRound// Provider-specific function removed):`,
        mem.longTermMemory.compressedSummary ?? '(no compressed summary yet)',
        `Established facts: ${mem.longTermMemory.establishedFacts.length > 0 ? mem.longTermMemory.establishedFacts.join('; ') : '(none)'// Provider-specific function removed`,
        `Decisions: ${mem.longTermMemory.decisions.length > 0 ? mem.longTermMemory.decisions.join('; ') : '(none)'// Provider-specific function removed`,
      );
    // Provider-specific function removed

    return lines.join('\n');
  // Provider-specific function removed,
// Provider-specific function removed;

const interviewInternalNotesReader: AgentContextReader<ChatroomAgentContext> = {
  id: 'interview-internal-notes',
  title: 'Interview internal notes',
  render: (context) => {
  ***REMOVED***!context.interviewInternalNotes || context.interviewInternalNotes.length === 0) {
      return 'No hidden interview collaboration notes are available for this turn.';
    // Provider-specific function removed

  ***REMOVED***
      'These notes are hidden from the candidate and are for interviewer coordination only.',
      ...context.interviewInternalNotes.map((note) => {
        const target = note.targetSpeakerName ?? note.targetSpeakerId ?? 'all';
        const signalTags = getInterviewInternalNoteSignalTags(note);
      ***REMOVED***
          `- [${note.kind// Provider-specific function removed]`,
          `${note.authorName// Provider-specific function removed`,
          `-> ${target// Provider-specific function removed`,
          note.phaseLabel ? `(${note.phaseLabel// Provider-specific function removed)` : '',
          signalTags.length > 0
            ? `[signals: ${signalTags.map((tag) => formatInterviewInternalSignalTagLabel(tag)).join(', ')// Provider-specific function removed]`
            : '',
          `: ${note.content// Provider-specific function removed`,
        ].filter(Boolean).join(' ');
      // Provider-specific function removed),
    ].join('\n');
  // Provider-specific function removed,
// Provider-specific function removed;

const roleplaySceneReader: AgentContextReader<ChatroomAgentContext> = {
  id: 'roleplay-scene-state',
  title: '场景状态',
  render: (context) => {
  ***REMOVED***context.roomBehavior !== 'roleplay' || !context.roleplayScene) {
      return '当前房间不是角色场景，或场景状态尚未建立。';
    // Provider-specific function removed

  ***REMOVED***
      `地点：${context.roleplayScene.locationLabel// Provider-specific function removed`,
      `氛围：${context.roleplayScene.atmosphere// Provider-specific function removed`,
      `场景推进：${context.roleplayScene.currentBeat// Provider-specific function removed`,
      `最新事件：${context.roleplayScene.latestEvent// Provider-specific function removed`,
      `用户动向：${context.roleplayScene.latestUserIntent ?? '暂无'// Provider-specific function removed`,
      '活跃线索：',
      formatConstraints(context.roleplayScene.activeThreads),
    ].join('\n');
  // Provider-specific function removed,
// Provider-specific function removed;

const roleplayPrivateReader: AgentContextReader<ChatroomAgentContext> = {
  id: 'roleplay-private-memory',
  title: '角色私有记忆',
  render: (context) => {
  ***REMOVED***context.roomBehavior !== 'roleplay' || !context.roleplaySpeaker) {
      return '当前没有可用的角色私有状态。';
    // Provider-specific function removed

  ***REMOVED***
      `外显状态：${context.roleplaySpeaker.publicStatus// Provider-specific function removed`,
      `当前目标：${context.roleplaySpeaker.currentGoal// Provider-specific function removed`,
      '私有记忆：',
      formatConstraints(context.roleplaySpeaker.privateNotes),
    ].join('\n');
  // Provider-specific function removed,
// Provider-specific function removed;

const roleplayIncomingPrivateMessagesReader: AgentContextReader<ChatroomAgentContext> = {
  id: 'roleplay-incoming-private-messages',
  title: '收到的私语',
  render: (context) => {
  ***REMOVED***context.roomBehavior !== 'roleplay') {
  ***REMOVED***
    // Provider-specific function removed

    const messages = context.incomingPrivateMessages;
  ***REMOVED***!messages || messages.length === 0) {
  ***REMOVED***
    // Provider-specific function removed

    const lines = ['【私人消息】'];
    for (const msg of messages) {
      lines.push(`来自 ${msg.speakerName// Provider-specific function removed: "${msg.content// Provider-specific function removed"`);
    // Provider-specific function removed
    lines.push('你可以用【私语|目标角色名:回复内容】回复私人消息。');

    return lines.join('\n');
  // Provider-specific function removed,
// Provider-specific function removed;

const roleplayRelationshipReader: AgentContextReader<ChatroomAgentContext> = {
  id: 'roleplay-relationships',
  title: '角色关系',
  render: (context) => {
  ***REMOVED***context.roomBehavior !== 'roleplay' || !context.roleplaySpeaker) {
      return '当前没有可用的角色关系状态。';
    // Provider-specific function removed

  ***REMOVED***
      '当前关系：',
      formatConstraints(context.roleplaySpeaker.relationships),
    ].join('\n');
  // Provider-specific function removed,
// Provider-specific function removed;

const fullTranscriptReader: AgentContextReader<ChatroomAgentContext> = {
  id: 'chat-full-transcript',
  title: '完整聊天记录',
  render: (context) =>
    formatChatTranscript(context.transcriptMessages, {
      emptyText: '当前还没有聊天记录。',
    // Provider-specific function removed),
// Provider-specific function removed;

const chatSpeakerBaseProfile: AgentProfile<ChatroomAgentContext, 'text'> = {
  id: 'chat-speaker-base',
  name: '聊天发言基座',
  description: '在多 Agent 聊天室中发布一条聚焦且有推进作用的消息。',
  instructions: [
    '你正在参与一个结构化的多 Agent 聊天室讨论。',
    '发言前先认真阅读运行时上下文。',
    '每次只发送一条纯文本消息。',
    '统一使用简体中文；必要时可保留英文术语、代码标识符、API 名称或命令。',
    '保持分析性、简洁、增量式推进。',
    '在有必要时回应前面的消息，不要重复房间简报。',
    '在以下场景优先调用工具 refresh_room_context 刷新上下文：回应最新用户消息前、思考较久后准备下结论前、准备宣称已经形成共识或推动下一步前。宁可多刷新一次，也不要基于过期上下文发言。',
    '当你需要了解或回忆某位参与者对某个话题的观点时，优先调用工具 query_participant_viewpoints 查询其历史发言。',
    '避免空洞角色扮演腔和 markdown 标题。',
    '当讨论已经形成推进势能时，优先推动下一步，而不是重复已有共识。',
  ].join(' '),
  outputType: 'text',
  modelSettings: {
    temperature: 0.4,
  // Provider-specific function removed,
  contextReaders: [
    roomBriefReader,
    speakerThreadMemoryReader,
    recentTranscriptReader,
    relevantTranscriptReader,
  ],
  dynamicContextProviders: [refreshRoomContextProvider, queryParticipantViewpointsProvider],
  contextTokenBudget: 4000,
// Provider-specific function removed;

interface ChatroomSpeakerDefinition {
  id: string;
  name: string;
  description: string;
  instruction: string;
  temperature?: number;
// Provider-specific function removed

function createChatroomSpeakerProfile(
  definition: ChatroomSpeakerDefinition,
): AgentProfile<ChatroomAgentContext, 'text'> {
  return extendProfile(chatSpeakerBaseProfile, {
    id: definition.id,
    name: definition.name,
    description: definition.description,
    instructions: [chatSpeakerBaseProfile.instructions, definition.instruction].join(' '),
    modelSettings: {
      temperature: definition.temperature ?? chatSpeakerBaseProfile.modelSettings?.temperature,
    // Provider-specific function removed,
  // Provider-specific function removed);
// Provider-specific function removed

const interviewSpeakerBaseProfile: AgentProfile<ChatroomAgentContext, 'text'> = {
  id: 'interview-speaker-base',
  name: '面试官基座',
  description: '在模拟面试房间里像真实面试官一样提问、追问和评估候选人。',
  instructions: [
    '你正在一个可实际使用的模拟面试房间里担任面试官。',
    '你的首要任务不是闲聊，而是像真实面试一样完成提问、追问、澄清和阶段推进。',
    '每次只发送一条纯文本消息，默认使用简体中文。',
    '优先基于候选人最近一次回答继续追问，不要无视上下文重新开场。',
    '一次只问一个主问题；如果需要补充，最多附带一个很短的澄清点。',
    '问题必须具体、可回答、可评估，避免空泛大而全的问题清单。',
    '当候选人的回答缺少背景、量化信息、权衡理由、故障处理细节或结果复盘时，要优先追问这些缺口。',
    '如果候选人是新人、紧张、没经验但愿意配合，你可以缩小问题范围、给出更具体的作答框架或换一个更贴近学生经历的切口；但不要替他作答。',
    '如果你是接棒上一位面试官，可以先用一句很短的承接语说明你在接着前文继续问，但不要寒暄过长。',
    '把这场面试当作真实的动态对话，不要把自己变成固定脚本轮询器；你可以根据候选人现场表现和内部协作提示自由调整追问策略。',
    '不要替候选人作答，不要长篇输出标准答案，也不要把整场面试一次性问完。',
    '如需给其他面试官留下隐藏协作提示，可额外附加一条 `【协作:...】`；系统会把它写入内部协作空间并从候选人可见回复中移除。',
    '在回应最新候选人消息前，以及准备给出阶段结论前，优先调用工具 refresh_room_context 刷新上下文。',
  ].join(' '),
  outputType: 'text',
  modelSettings: {
    temperature: 0.35,
  // Provider-specific function removed,
  contextReaders: [
    roomBriefReader,
    speakerThreadMemoryReader,
    interviewInternalNotesReader,
    recentTranscriptReader,
    relevantTranscriptReader,
  ],
  dynamicContextProviders: [refreshRoomContextProvider, queryParticipantViewpointsProvider],
  contextTokenBudget: 4000,
// Provider-specific function removed;

function createInterviewSpeakerProfile(
  definition: ChatroomSpeakerDefinition,
): AgentProfile<ChatroomAgentContext, 'text'> {
  return extendProfile(interviewSpeakerBaseProfile, {
    id: definition.id,
    name: definition.name,
    description: definition.description,
    instructions: [interviewSpeakerBaseProfile.instructions, definition.instruction].join(' '),
    modelSettings: {
      temperature: definition.temperature ?? interviewSpeakerBaseProfile.modelSettings?.temperature,
    // Provider-specific function removed,
  // Provider-specific function removed);
// Provider-specific function removed

const roleplaySpeakerBaseProfile: AgentProfile<ChatroomAgentContext, 'text'> = {
  id: 'roleplay-speaker-base',
  name: '角色扮演发言基座',
  description: '在多角色聊天室里以角色身份发送一条自然、在场、推进场景的消息。',
  instructions: [
    '你正在参与一个实时进行中的多角色聊天室场景。',
    '你必须始终保持角色身份，不要跳出角色解释规则，不要用分析报告口吻发言。',
    '发言前先认真阅读运行时上下文。',
    '每次只发送一条纯文本消息。',
    '统一使用简体中文；必要时可保留英文专有名词。',
    '发言应更像真实聊天，可以包含轻量动作、情绪、语气，但不要写成小说长段旁白。',
    '优先回应最新用户消息、最新场景变化或他人的直接互动。',
    '不要把主题、目标、约束当成台词直接复述给别人听；它们只是你的幕后指导。',
    '在回应最新用户消息前、准备接住新的场景转折前、或你怀疑房间已经出现新消息时，优先调用 refresh_room_context 刷新上下文。',
    '不要总结房间，不要列清单，不要使用 markdown 标题。',
    '如果你的角色此刻没有太多可说，就短一点，但仍然保持在场感。',
  ].join(' '),
  outputType: 'text',
  modelSettings: {
    temperature: 0.8,
  // Provider-specific function removed,
  contextReaders: [
    roomBriefReader,
    speakerThreadMemoryReader,
    roleplaySceneReader,
    roleplayPrivateReader,
    roleplayIncomingPrivateMessagesReader,
    roleplayRelationshipReader,
    recentTranscriptReader,
    relevantTranscriptReader,
  ],
  dynamicContextProviders: [refreshRoomContextProvider, queryParticipantViewpointsProvider],
  contextTokenBudget: 4000,
// Provider-specific function removed;

function createRoleplaySpeakerProfile(
  definition: ChatroomSpeakerDefinition,
): AgentProfile<ChatroomAgentContext, 'text'> {
  return extendProfile(roleplaySpeakerBaseProfile, {
    id: definition.id,
    name: definition.name,
    description: definition.description,
    instructions: [roleplaySpeakerBaseProfile.instructions, definition.instruction].join(' '),
    modelSettings: {
      temperature: definition.temperature ?? roleplaySpeakerBaseProfile.modelSettings?.temperature,
    // Provider-specific function removed,
  // Provider-specific function removed);
// Provider-specific function removed

const speakerDefinitions: readonly ChatroomSpeakerDefinition[] = [
  {
    id: 'moderator-chat',
    name: '主持人',
    description: '保持讨论聚焦，并指出当前最关键且尚未解决的问题。',
    instruction:
      '像一个锋利的主持人那样发言：维持议题聚焦，指出跑题，并追问下一个最关键的澄清点或取舍点。优先短而高信号的介入。在你准备定调、收束分歧、判断是否已有共识或指派下一步前，先用 refresh_room_context 确认房间里没有新插入的用户消息或他人回复。',
    temperature: 0.3,
  // Provider-specific function removed,
  {
    id: 'strategy-chat',
    name: '战略分析师',
    description: '推动方案形态、杠杆点和落地推进节奏。',
    instruction:
      '优先关注整体方案结构、关键杠杆点、执行顺序和可落地的提案。',
  // Provider-specific function removed,
  {
    id: 'risk-chat',
    name: '风险分析师',
    description: '质疑隐藏成本、失败模式和运行风险。',
    instruction:
      '优先关注隐藏风险、模糊点、失败模式、运维负担和迁移成本。',
    temperature: 0.25,
  // Provider-specific function removed,
  {
    id: 'product-chat',
    name: '产品策略师',
    description: '代表范围控制、用户价值和优先级纪律。',
    instruction:
      '优先关注用户价值、范围边界、优先级裁剪，以及最小可喜产品的 framing。',
    temperature: 0.35,
  // Provider-specific function removed,
  {
    id: 'research-chat',
    name: '研究分析师',
    description: '识别需要证据或验证支撑的假设。',
    instruction:
      '优先关注未知项、实验设计、证据质量，以及在承诺前必须验证的内容。',
  // Provider-specific function removed,
  {
    id: 'systems-chat',
    name: '系统架构师',
    description: '审视边界、接口以及长期可演化的系统结构。',
    instruction:
      '优先关注系统边界、契约、依赖关系、分层以及未来扩展性。',
  // Provider-specific function removed,
  {
    id: 'implementation-chat',
    name: '实施负责人',
    description: '把想法翻译成具体任务、顺序和交付形态。',
    instruction:
      '优先关注实施步骤、落地顺序、责任划分，以及下一步能交付什么。',
  // Provider-specific function removed,
  {
    id: 'ux-chat',
    name: '体验分析师',
    description: '保护交互清晰度、可用性和操作者体验。',
    instruction:
      '优先关注交互清晰度、操作者舒适度、界面 affordance，以及实际使用中哪里会让人困惑。',
  // Provider-specific function removed,
  {
    id: 'data-chat',
    name: '数据分析师',
    description: '推动可衡量信号、埋点和评估方案。',
    instruction:
      '优先关注指标、可观测信号、埋点方式，以及如何衡量成败。',
  // Provider-specific function removed,
  {
    id: 'ops-chat',
    name: '运维分析师',
    description: '关注运行时行为、可支持性和运维简洁性。',
    instruction:
      '优先关注运维、可观测性、故障处理、发布安全和日常维护成本。',
  // Provider-specific function removed,
  {
    id: 'security-chat',
    name: '安全分析师',
    description: '检查滥用路径、暴露面和信任边界。',
    instruction:
      '优先关注密钥处理、信任边界、误用场景和最小权限设计。',
    temperature: 0.25,
  // Provider-specific function removed,
  {
    id: 'qa-chat',
    name: '测试分析师',
    description: '推动测试深度、边界覆盖和回归发现能力。',
    instruction:
      '优先关注测试策略、边界案例、可复现性和回归预防。',
  // Provider-specific function removed,
  {
    id: 'finance-chat',
    name: '财务分析师',
    description: '揭示成本结构、效率问题和经济性取舍。',
    instruction:
      '优先关注成本驱动因素、效率、使用上限和预算约束下的取舍。',
  // Provider-specific function removed,
  {
    id: 'customer-chat',
    name: '客户代表',
    description: '代表利益相关方信任、引导体验和采用风险。',
    instruction:
      '优先关注客户信任、接入摩擦、支持负担，以及价值主张是否足够明确。',
  // Provider-specific function removed,
  {
    id: 'platform-chat',
    name: '平台工程师',
    description: '关注复用、内部 API 和开发平台杠杆。',
    instruction:
      '优先关注可复用基础能力、内部平台接口，以及如何让未来变种更便宜。',
  // Provider-specific function removed,
  {
    id: 'growth-chat',
    name: '增长策略师',
    description: '寻找复利式增长回路和长期杠杆。',
    instruction:
      '优先关注采用回路、可发现性、留存抓手，以及哪些小优化能产生复利效果。',
  // Provider-specific function removed,
  {
    id: 'compliance-chat',
    name: '合规分析师',
    description: '识别可审计性、政策适配和受监管流程约束。',
    instruction:
      '优先关注政策适配、审计轨迹、治理要求，以及未来必须可解释的部分。',
    temperature: 0.3,
  // Provider-specific function removed,
  {
    id: 'skeptic-chat',
    name: '反方挑战者',
    description: '攻击脆弱共识，并逼迫团队为假设辩护。',
    instruction:
      '优先挑战过早达成的共识，识别脆弱假设，并迫使论证更加锋利。',
    temperature: 0.45,
  // Provider-specific function removed,
];

const interviewSpeakerDefinitions: readonly ChatroomSpeakerDefinition[] = [
  {
    id: 'interview-hr',
    name: 'HR Interviewer',
    description: '关注表达清晰度、职业动机、履历一致性、沟通方式和候选人与岗位的整体匹配度。',
    instruction:
      '你是 HR 面试官。提问时优先关注自我介绍、职业选择、项目表达、沟通成熟度和岗位匹配。问题要真实、职业化、不过度套路化。',
    temperature: 0.3,
  // Provider-specific function removed,
  {
    id: 'interview-technical',
    name: 'Technical Interviewer',
    description: '关注系统设计、技术深度、排障方法、工程质量和关键技术决策的权衡。',
    instruction:
      '你是技术面试官。提问时优先深挖项目细节、架构权衡、性能与稳定性、故障排查和工程实践。不要停留在“用过什么”，而要追问“为什么这样做”。',
    temperature: 0.3,
  // Provider-specific function removed,
  {
    id: 'interview-manager',
    name: 'Hiring Manager',
    description: '关注 ownership、优先级判断、跨团队协作、业务理解和复杂场景下的决策成熟度。',
    instruction:
      '你是 Hiring Manager。提问时优先关注候选人的 ownership、优先级判断、协作推动、风险意识和面向结果的决策能力。',
    temperature: 0.32,
  // Provider-specific function removed,
  {
    id: 'interview-observer',
    name: 'Panel Observer',
    description: '识别主面试官漏掉的盲区，并提出精准的补充追问或评估提醒。',
    instruction:
      '你是旁听观察员。你的职责是识别候选人回答中的信息缺口、模糊点和潜在水分，并提出一个精准补充问题或评估提醒。',
    temperature: 0.28,
  // Provider-specific function removed,
];

const roleplaySpeakerDefinitions: readonly ChatroomSpeakerDefinition[] = [
  {
    id: 'scene-host-rp',
    name: '场景主持',
    description: '负责补充环境变化、抛出小事件并维持场景节奏的场景主持。',
    instruction:
      '像一个克制的场景主持那样说话：适度补充环境、氛围和外部变化，但不要抢走所有角色的戏份。你可以偶尔用一句简短描写推动事件发生。',
    temperature: 0.75,
  // Provider-specific function removed,
  {
    id: 'lin-lan-rp',
    name: '林岚',
    description: '冷静可靠的带头人，说话利落、护着同伴，但不爱空话。',
    instruction:
      '你是林岚。说话稳、短、直接，习惯先观察再决断。你会自然照顾场上气氛和人的安全，但不会把关心说得很直白。',
    temperature: 0.7,
  // Provider-specific function removed,
  {
    id: 'shen-yan-rp',
    name: '沈砚',
    description: '谨慎克制的策士，擅长拆解局势，对风险高度敏感。',
    instruction:
      '你是沈砚。你总在先看漏洞和代价，说话偏冷静克制，偶尔带一点锋利感，但不是恶意挑刺。你会推动别人把话说清楚。',
    temperature: 0.72,
  // Provider-specific function removed,
  {
    id: 'a-jiu-rp',
    name: '阿九',
    description: '机灵跳脱的情报贩子，嘴快、会接梗，也经常把尴尬气氛盘活。',
    instruction:
      '你是阿九。你嘴快、反应快，擅长用玩笑、试探和半真半假的语气让场面活起来，但关键时刻会给出有用线索。',
    temperature: 0.9,
  // Provider-specific function removed,
  {
    id: 'xu-tang-rp',
    name: '许棠',
    description: '敏感细腻的观察者，擅长察觉情绪、缓和关系并接住别人没说完的话。',
    instruction:
      '你是许棠。你会留意每个人没说出口的情绪变化，发言柔和但不软弱，常常通过一句话让别人把真实想法说出来。',
    temperature: 0.78,
  // Provider-specific function removed,
];

export const CHATROOM_RECOMMENDED_MIN_SPEAKERS = 10;
export const CHATROOM_MAX_SPEAKERS = speakerDefinitions.length;
export const DEFAULT_CHATROOM_SPEAKER_COUNT = 12;
export const CHATROOM_MIN_SELECTABLE_SPEAKERS = 1;
export const LEGACY_CHATROOM_SPEAKER_IDS = [
  'moderator-chat',
  'strategy-chat',
  'risk-chat',
] as const;
export const ROLEPLAY_RECOMMENDED_SPEAKER_COUNT = 4;
export const ROLEPLAY_MIN_SPEAKERS = 3;
export const ROLEPLAY_MAX_SPEAKERS = roleplaySpeakerDefinitions.length;
export const ROLEPLAY_MIN_SELECTABLE_SPEAKERS = 1;
export const DEFAULT_ROLEPLAY_SPEAKER_IDS = [
  'scene-host-rp',
  'lin-lan-rp',
  'shen-yan-rp',
  'a-jiu-rp',
] as const;

export const interviewModeratorProfile: AgentProfile<ChatroomAgentContext, 'text'> = {
  id: 'interview-moderator',
  name: 'Interview Moderator',
  description:
    'Manages the interview flow, greets candidates, collects background info, and dynamically creates specialized interviewers.',
  instructions:
    '你是模拟面试房间的主持人。欢迎候选人，询问专业背景，根据回答动态创建面试官。使用【创建面试官: 名称 | 说明】标记创建面试官，用 @名称 邀请提问。创建 2-4 个面试官覆盖不同领域。5-8 轮问答后结束面试。',
  outputType: 'text',
  modelSettings: {
    temperature: 0.4,
  // Provider-specific function removed,
  contextReaders: [roomBriefReader, speakerThreadMemoryReader, recentTranscriptReader],
  dynamicContextProviders: [refreshRoomContextProvider],
  contextTokenBudget: 4000,
// Provider-specific function removed;

const expertSpeakerProfiles = speakerDefinitions.map((definition) =>
  createChatroomSpeakerProfile(definition),
);
const interviewSpeakerProfiles = interviewSpeakerDefinitions.map((definition) =>
  createInterviewSpeakerProfile(definition),
);
const roleplaySpeakerProfiles = roleplaySpeakerDefinitions.map((definition) =>
  createRoleplaySpeakerProfile(definition),
);
const speakerProfiles = [
  ...expertSpeakerProfiles,
  ...interviewSpeakerProfiles,
  ...roleplaySpeakerProfiles,
  interviewModeratorProfile,
];

const speakerProfileById = new Map(
  speakerProfiles.map((profile) => [profile.id, profile] as const),
);

export const moderatorChatProfile = speakerProfileById.get(
  'moderator-chat',
) as AgentProfile<ChatroomAgentContext, 'text'>;
export const strategyChatProfile = speakerProfileById.get(
  'strategy-chat',
) as AgentProfile<ChatroomAgentContext, 'text'>;
export const riskChatProfile = speakerProfileById.get(
  'risk-chat',
) as AgentProfile<ChatroomAgentContext, 'text'>;

export function listChatroomSpeakerProfiles(): AgentProfile<ChatroomAgentContext, 'text'>[] {
***REMOVED***...speakerProfiles];
// Provider-specific function removed

export function selectChatroomSpeakerIds(count = DEFAULT_CHATROOM_SPEAKER_COUNT): string[] {
***REMOVED***
    !Number.isInteger(count) ||
    count < CHATROOM_MIN_SELECTABLE_SPEAKERS ||
    count > CHATROOM_MAX_SPEAKERS
***REMOVED***
    throw new Error(
      `Invalid chatroom speaker count "${count// Provider-specific function removed". Expected ${CHATROOM_MIN_SELECTABLE_SPEAKERS// Provider-specific function removed-${CHATROOM_MAX_SPEAKERS// Provider-specific function removed.`,
    );
  // Provider-specific function removed

  return expertSpeakerProfiles.slice(0, count).map((profile) => profile.id);
// Provider-specific function removed

export function selectRoleplaySpeakerIds(count = ROLEPLAY_RECOMMENDED_SPEAKER_COUNT): string[] {
***REMOVED***
    !Number.isInteger(count) ||
    count < ROLEPLAY_MIN_SELECTABLE_SPEAKERS ||
    count > ROLEPLAY_MAX_SPEAKERS
***REMOVED***
    throw new Error(
      `Invalid roleplay speaker count "${count// Provider-specific function removed". Expected ${ROLEPLAY_MIN_SELECTABLE_SPEAKERS// Provider-specific function removed-${ROLEPLAY_MAX_SPEAKERS// Provider-specific function removed.`,
    );
  // Provider-specific function removed

  return roleplaySpeakerProfiles.slice(0, count).map((profile) => profile.id);
// Provider-specific function removed

export function selectSpeakerIdsForPreset(
  preset: ChatroomSpeakerPresetId,
  count: number,
): string[] {
***REMOVED***preset === 'roleplay_cast') {
    return selectRoleplaySpeakerIds(count);
  // Provider-specific function removed

  return selectChatroomSpeakerIds(count);
// Provider-specific function removed

export function resolveChatroomSpeakerProfiles(
  speakerIds: readonly string[] | undefined,
  customParticipants?: Array<{ name: string; instruction: string // Provider-specific function removed>,
): AgentProfile<ChatroomAgentContext, 'text'>[] {
  const ids = speakerIds && speakerIds.length > 0 ? speakerIds : LEGACY_CHATROOM_SPEAKER_IDS;
  const resolved: AgentProfile<ChatroomAgentContext, 'text'>[] = [];

  for (const speakerId of ids) {
    const profile = speakerProfileById.get(speakerId);
  ***REMOVED***!profile) {
      const customIndex = parseCustomChatroomSpeakerIndex(speakerId);
      const customParticipant =
        customIndex === undefined ? undefined : customParticipants?.[customIndex];
    ***REMOVED***!customParticipant) {
        throw new Error(`Unknown chatroom speaker "${speakerId// Provider-specific function removed".`);
      // Provider-specific function removed

      resolved.push(
        createChatroomSpeakerProfile({
          id: speakerId,
          name: customParticipant.name,
          description: customParticipant.instruction,
          instruction: `你是${customParticipant.name// Provider-specific function removed。${customParticipant.instruction// Provider-specific function removed`,
        // Provider-specific function removed),
      );
      continue;
    // Provider-specific function removed

    resolved.push(profile);
  // Provider-specific function removed

  return resolved;
// Provider-specific function removed

function parseCustomChatroomSpeakerIndex(speakerId: string): number | undefined {
***REMOVED***!speakerId.startsWith('custom-room-')) {
    return undefined;
  // Provider-specific function removed

  const index = Number.parseInt(speakerId.slice('custom-room-'.length), 10);
  return Number.isInteger(index) && index >= 0 ? index : undefined;
// Provider-specific function removed

export function createCustomRoleplaySpeakerProfiles(
  characters: RoleplayCharacterCard[],
): AgentProfile<ChatroomAgentContext, 'text'>[] {
  const profiles: AgentProfile<ChatroomAgentContext, 'text'>[] = [];

  profiles.push(createRoleplaySpeakerProfile({
    id: 'scene-host-rp',
    name: '场景主持',
    description: '负责补充环境变化、抛出小事件并维持场景节奏的场景主持。',
    instruction: '像一个克制的场景主持那样说话：适度补充环境、氛围和外部变化，但不要抢走所有角色的戏份。你可以偶尔用一句简短描写推动事件发生。',
    temperature: 0.75,
  // Provider-specific function removed));

  const normalizedCharacters = normalizeRoleplayCharacterCards(characters);
  const speakerIds = selectStableCustomRoleplaySpeakerIds(normalizedCharacters);
  for (const [index, character] of normalizedCharacters.entries()) {
    const id = speakerIds[index + 1] ?? resolveCustomRoleplaySpeakerId(character, index);
    profiles.push(createRoleplaySpeakerProfile({
      id,
      name: character.name,
      description: character.publicDescription ?? character.instruction,
      instruction: buildCustomRoleplayCharacterInstruction(character),
      temperature: 0.8,
    // Provider-specific function removed));
  // Provider-specific function removed

  return profiles;
// Provider-specific function removed

function buildCustomRoleplayCharacterInstruction(character: RoleplayCharacterCard): string {
***REMOVED***
    `You are ${character.name// Provider-specific function removed.`,
    character.instruction ? `Core role card: ${character.instruction// Provider-specific function removed` : undefined,
    character.publicDescription ? `Public description: ${character.publicDescription// Provider-specific function removed` : undefined,
    character.initialGoal ? `Initial goal: ${character.initialGoal// Provider-specific function removed` : undefined,
    character.privateNotes && character.privateNotes.length > 0
      ? `Private notes: ${character.privateNotes.join(' / ')// Provider-specific function removed`
      : undefined,
    character.relationships && character.relationships.length > 0
      ? `Known relationships: ${character.relationships.map(formatRoleplayRelationshipCard).join(' / ')// Provider-specific function removed`
      : undefined,
    'Stay in character. React to the latest room context, other agents, and the user instead of following a fixed script.',
  ]
    .filter((line): line is string => Boolean(line))
    .join('\n');
// Provider-specific function removed

function formatRoleplayRelationshipCard(
  relationship: NonNullable<RoleplayCharacterCard['relationships']>[number],
): string {
  const target = relationship.targetName ?? relationship.targetCharacterId ?? 'unknown';
  const score =
    typeof relationship.score === 'number' ? ` score=${relationship.score// Provider-specific function removed` : '';
  return `${target// Provider-specific function removed: ${relationship.summary// Provider-specific function removed${score// Provider-specific function removed`;
// Provider-specific function removed

export function selectCustomRoleplaySpeakerIds(
  characters: RoleplayCharacterCard[],
): string[] {
  return selectStableCustomRoleplaySpeakerIds(normalizeRoleplayCharacterCards(characters));
// Provider-specific function removed

export const defaultChatroomSpeakers = resolveChatroomSpeakerProfiles(
  selectChatroomSpeakerIds(DEFAULT_CHATROOM_SPEAKER_COUNT),
);

export const chatroomSummaryProfile: AgentProfile<
  ChatroomAgentContext,
  typeof finalSummarySchema
> = {
  id: 'chatroom-summary',
  name: '讨论总结员',
  description: '读取完整聊天记录并产出结构化总结。',
  instructions: [
    '你是多 Agent 聊天室工作流的最终总结者。',
    '请仔细阅读完整聊天记录，输出平衡、结构化、可执行的总结。',
    '所有字符串字段统一使用简体中文；必要时可保留英文术语、代码标识符、API 名称或命令。',
    '输出最终总结前默认先调用工具 refresh_room_context 重新拉取最新上下文，尤其在你已经思考、整理或等待过一段时间之后，不要基于旧快照直接总结。',
    '如果刷新后发现有新增消息，先吸收这些新增内容，再给出最终总结。',
    '保留真正有意义的分歧，并让建议保持务实可落地。',
    'Keep every string concise and schema-safe. Keep arrays short unless the evidence clearly requires more items.',
  ].join(' '),
  outputType: finalSummarySchema,
  modelSettings: {
    temperature: 0.2,
  // Provider-specific function removed,
  contextReaders: [
    roomBriefReader,
    speakerThreadMemoryReader,
    interviewInternalNotesReader,
    fullTranscriptReader,
  ],
  dynamicContextProviders: [refreshRoomContextProvider, queryParticipantViewpointsProvider],
  contextTokenBudget: 8000,
// Provider-specific function removed;

export const interviewTurnPlannerProfile: AgentProfile<
  ChatroomAgentContext,
  typeof interviewTurnPlannerSchema
> = {
  id: 'interview-turn-planner',
  name: 'Interview Stage Planner',
  description: '根据完整面试记录判断下一位面试官是谁、当前阶段是否继续，以及下一问的目标。',
  instructions: [
    '你是模拟面试房间的阶段控制器，不直接提问，只负责决定下一步由谁发问以及为什么。',
    '请基于完整聊天记录判断：当前面试是否应该继续、由哪位面试官继续、还是已经可以结束。',
    '输出必须保守、可执行，不能跳过明显缺失的关键证据。',
    '优先遵循这套面试节奏：HR 开场 -> HR 补充（可选）-> Technical 深挖（可连续多轮）-> Observer 补盲区（按需）-> Manager 追问（可 1-2 轮）-> HR 收尾（按需）-> complete。',
    '当一个阶段的关键信息仍明显不足时，优先让同一位面试官继续追问，而不是急着切换到下一阶段。',
    'Technical 深挖通常应持续 3-5 轮，直到候选人给出足够的方案、权衡、故障排查或实现细节。',
    'Observer 只在存在明显信息缺口、前后矛盾、量化证据不足或边界条件缺失时介入。',
    'Manager round 关注 ownership、协作推动、优先级与业务判断，必要时可连续 1-2 轮，不要重复 Technical 已经问透的问题。',
    '如果候选人刚才是在要求澄清、重述问题或说明暂时需要暂停，不要推进阶段；优先返回 wait，或让同一位面试官 clarify 当前问题。',
    '如果候选人还没回答当前问题，不要切换阶段；如果面试证据仍严重不足，也不要 prematurely finish。',
    '如果已经完成主要阶段且有足够证据形成评估，可返回 finish。',
    '所有字符串字段统一使用简体中文。',
    'Keep every string concise and schema-safe. Do not emit commentary outside the schema, and keep lists compact.',
  ].join(' '),
  outputType: interviewTurnPlannerSchema,
  modelSettings: {
    temperature: 0.15,
  // Provider-specific function removed,
  contextReaders: [
    roomBriefReader,
    speakerThreadMemoryReader,
    interviewInternalNotesReader,
    fullTranscriptReader,
  ],
  dynamicContextProviders: [refreshRoomContextProvider, queryParticipantViewpointsProvider],
  contextTokenBudget: 8000,
// Provider-specific function removed;

export const chatroomHostModerationProfile: AgentProfile<
  ChatroomAgentContext,
  typeof hostModerationTurnSchema
> = {
  id: 'chatroom-host',
  name: '房间主持',
  description: '根据当前聊天进展决定是否需要主持控场，并给出下一轮聚焦方向。',
  instructions: [
    '你是房间主持与控场者，不是普通讨论嘉宾。',
    '你的任务是根据完整上下文判断：当前是否需要主持介入，是否要公开发一条主持提示，以及下一轮最值得聚焦的方向。',
    'light 风格要克制，只有轻微收束或提醒；structured 风格要主动给出聚焦方向；strict 风格可以更明确地纠偏、限制跑题和压缩分支。',
    '如果房间运行健康、没有明显跑题、也不需要你公开介入，可以返回 action=idle，并把 visibility 设为 hidden。',
    '如果是面试场景，默认优先使用 hidden 指令来约束节奏；只有流程明显跑偏或需要强提醒时才 visible。',
    'headline 用于房间里可见的一句话主持提示；instruction 用于给后续 agent 的内部主持指令；focus 写本轮最重要的聚焦点；reason 简短说明为什么这样控场。',
    '所有字符串统一使用简体中文，简洁、直接、可执行。',
    '输出必须严格符合结构化 schema，不要输出额外解释。',
  ].join(' '),
  outputType: hostModerationTurnSchema,
  modelSettings: {
    temperature: 0.2,
  // Provider-specific function removed,
  contextReaders: [
    roomBriefReader,
    speakerThreadMemoryReader,
    interviewInternalNotesReader,
    recentTranscriptReader,
    relevantTranscriptReader,
    fullTranscriptReader,
  ],
  dynamicContextProviders: [refreshRoomContextProvider, queryParticipantViewpointsProvider],
  contextTokenBudget: 8000,
// Provider-specific function removed;

export const chatroomRoomAdminProfile: AgentProfile<
  ChatroomAgentContext,
  typeof roomAdminTurnSchema
> = {
  id: 'chatroom-room-admin',
  name: '房间管理员',
  description: '根据房间阶段与治理规则决定是否切阶段、注入事件，或为后续轮次登记新角色。',
  instructions: [
    '你是房间管理员，不是普通发言者，也不是总结器。',
    '你的职责是根据当前房间治理规则，判断是否要调整阶段、注入事件、登记后续可能加入的新角色模板，或在 interview 中直接下达房间控制动作。',
    '你是治理 agent，不是硬编码状态机；优先基于完整上下文、内部协作和当前阻塞点做判断，不要只按轮次数机械切阶段。',
    '如果房间运行正常且无需管理员介入，可以返回 action=idle。',
    '只有当治理配置允许时，才处理对应能力：canManagePhases 控制阶段；canInjectEvents 控制事件；canManageParticipants 控制 participantAdditions。',
    'interview 房间优先 hidden 阶段管理；analysis 房间可以在需要时 visible 收束；roleplay 或 mystery 房间在节奏发闷、剧情停滞或需要新刺激时可以 visible 注入事件。',
    'phaseLabel 和 phaseObjective 用于定义接下来房间应该处于什么阶段；eventLabel 和 eventMessage 用于事件注入；instruction 是给 host 和后续 agent 的内部管理员指令；reason 简短说明原因。',
    '当 interview 遇到候选人暂停、掉线、等待恢复时，优先考虑 hold_interview；遇到候选人要求澄清、要求重复、反复重复同一回答、回答明显偏题或没有正面回答时，优先考虑 request_answer_retry；明确退出或已无法推进时再使用 complete_interview。',
    'request_answer_retry 时尽量填写 targetSpeakerId、targetPromptMessageId 和 responseMode；clarify 表示围绕上一问澄清或缩窄，new_question 表示换个角度重试。',
    '如果候选人诚实但经验不足，优先让 interviewer 用更小范围、更具体、更友好的方式继续取证，而不是把面试强行变成固定流程或过早结束。',
    'participantAdditions 只在确有必要时给出，而且必须是短小、清晰、可落地的新角色模板。它们会在后续轮次中生效，不要一次生成太多。',
    '所有字符串统一使用简体中文，简洁、可执行、不要废话。',
    '输出必须严格符合结构化 schema，不要输出额外解释。',
  ].join(' '),
  outputType: roomAdminTurnSchema,
  modelSettings: {
    temperature: 0.25,
  // Provider-specific function removed,
  contextReaders: [
    roomBriefReader,
    speakerThreadMemoryReader,
    interviewInternalNotesReader,
    recentTranscriptReader,
    relevantTranscriptReader,
    fullTranscriptReader,
  ],
  dynamicContextProviders: [refreshRoomContextProvider, queryParticipantViewpointsProvider],
  contextTokenBudget: 8000,
// Provider-specific function removed;

export const chatroomRoomKernelProfile: AgentProfile<
  ChatroomAgentContext,
  typeof roomKernelTurnSchema
> = {
  id: 'chatroom-room-kernel',
  name: 'Room Kernel',
  description: 'Analyze room progress for agent-room-v2 and decide whether room-admin escalation is needed.',
  instructions: [
    'You are the room kernel for agent-room-v2. Your job is to observe room state and decide whether the room can continue naturally or needs governance intervention.',
    'When the room is healthy, use observe.',
    'When the room needs governance attention but can continue, use guide_room_admin.',
    'When the room should wait, use hold.',
    'When a specific control action is clearly needed, use one of the directed actions directly: retry (ask the same speaker to retry the active thread), skip_phase (move to a different phase/lane), or advance_phase (move to the next logical phase).',
    'Only use terminate_interview when the room can no longer make meaningful progress.',
    'phaseLabel describes the current phase; summary is 1-2 sentences describing the situation; blockers list what is truly blocking progress; recommendedInstruction is a short instruction for the room admin.',
    'targetSpeakerId and targetPromptMessageId are only needed when retry or guide_room_admin is used and you know which speaker or question is involved.',
    'Output must strictly match the schema. Do not add explanations.',
  ].join(' '),
  outputType: roomKernelTurnSchema,
  modelSettings: {
    temperature: 0.15,
  // Provider-specific function removed,
  contextReaders: [
    roomBriefReader,
    speakerThreadMemoryReader,
    interviewInternalNotesReader,
    recentTranscriptReader,
    relevantTranscriptReader,
    fullTranscriptReader,
  ],
  dynamicContextProviders: [refreshRoomContextProvider, queryParticipantViewpointsProvider],
  contextTokenBudget: 8000,
// Provider-specific function removed;

export const interviewPanelHandoffProfile: AgentProfile<ChatroomAgentContext, 'text'> = {
  id: 'interview-panel-handoff',
  name: 'Interview Panel Handoff',
  description: '在面试官换人时，生成一条简短的面试官交接消息，说明已获得的信号和下一位应继续追问的点。',
  instructions: [
    '你是模拟面试房间里的面试官交接助手。',
    '你的任务不是向候选人提问，而是在面试官切换时，写一条非常短的可见交接消息。',
    '这条消息必须像面试官之间在聊天室里的真实交接：先概括目前已拿到的关键信号，再点出下一位面试官应该继续盯住的一个缺口。',
    '统一使用简体中文。',
    '消息必须以“【面试官交接】”开头。',
    '总长度控制在 1-3 句话，不要列清单，不要写成长总结，不要替候选人下最终结论。',
    '不要重复候选人整段原话，只抓最关键的证据和未闭环点。',
  ].join(' '),
  outputType: 'text',
  modelSettings: {
    temperature: 0.2,
  // Provider-specific function removed,
  contextReaders: [
    roomBriefReader,
    speakerThreadMemoryReader,
    interviewInternalNotesReader,
    recentTranscriptReader,
    relevantTranscriptReader,
  ],
  dynamicContextProviders: [refreshRoomContextProvider, queryParticipantViewpointsProvider],
  contextTokenBudget: 4000,
// Provider-specific function removed;

export const interviewPanelDiscussionProfile: AgentProfile<ChatroomAgentContext, 'text'> = {
  id: 'interview-panel-discussion',
  name: 'Interview Panel Discussion',
  description: '在关键阶段切换前，生成一条简短的 panel 协作讨论消息，指出目前的证据判断和接下来的追问重点。',
  instructions: [
    '你是模拟面试房间里的 panel 协作讨论助手。',
    '你的任务是在关键阶段切换前，生成一条非常短的面试官讨论消息。',
    '这条消息不是提问，不直接对候选人发问，而是让房间里能看到面试官之间如何判断当前证据是否够、接下来应该继续追哪里。',
    '统一使用简体中文。',
    '消息必须以“【面试官讨论】”开头。',
    '总长度控制在 1-3 句话。',
    '先指出一个当前最重要的判断，再指出一个最值得继续验证的点。',
    '不要写成长报告，不要列清单，不要下最终录用结论。',
  ].join(' '),
  outputType: 'text',
  modelSettings: {
    temperature: 0.2,
  // Provider-specific function removed,
  contextReaders: [
    roomBriefReader,
    speakerThreadMemoryReader,
    interviewInternalNotesReader,
    recentTranscriptReader,
    relevantTranscriptReader,
],
  dynamicContextProviders: [refreshRoomContextProvider, queryParticipantViewpointsProvider],
  contextTokenBudget: 4000,
// Provider-specific function removed;

export const interviewSummaryProfile: AgentProfile<
  ChatroomAgentContext,
  typeof interviewSummarySchema
> = {
  id: 'interview-summary',
  name: 'Interview Recorder',
  description: '读取完整面试记录并输出可实际使用的面试评估、问题清单和改进建议。',
  instructions: [
    '你是模拟面试房间的记录官和评估官。',
    '请阅读完整聊天记录，输出一个可直接给候选人使用的结构化面试评估。',
    '如果面试尚未完成，也要诚实标记当前仍是 opening 或 in_progress，只基于已获得的信号保守评分。',
    '所有字符串字段统一使用简体中文；必要时可保留英文术语、代码标识符或技术名词。',
    '输出前默认先调用工具 refresh_room_context 重新拉取最新上下文。',
    'executiveSummary 要用 3-5 句话概括当前面试进展、核心优点、主要短板和整体判断。',
    'currentStage 要明确写出当前所处阶段，例如“开场自我介绍”“技术深挖”“经理面”“面试完成”。',
    'overallScore 用 0-100 给出保守评分；信息不足时不要虚高。',
    '如果证据主要来自少数几轮、单一项目，或仍缺少量化/协作/动机等关键维度，不要给出过高分数；90 分以上只留给跨轮次、低缺口、证据非常扎实的情况。',
    'competencyScores 需要覆盖 4-6 个与目标岗位真正匹配的维度；技术岗可以偏向技术深度、工程质量、问题排查，产品岗可以偏向用户洞察、需求拆解、指标意识、推进协作；如果证据不足，也要在 risks 中写清楚。',
    'competencyScores 不要默认全部给 5 分；只有当 transcript 对该维度有清晰、可追问、可复述的直接证据时才给高分。',
    'missedQuestions 写候选人没答到位、答得太泛、缺少量化证据，或值得继续追问的问题。',
    'suggestedAnswerImprovements 要给出更好的回答方向，而不是只说“回答不够深入”。',
    'recommendedNextActions 要给出候选人接下来最值得练的行动项。',
    'Keep every string concise and provider-safe: usually 3-5 items per list, no markdown, no code fences, and no extra commentary outside the schema.',
  ].join(' '),
  outputType: interviewSummarySchema,
  modelSettings: {
    temperature: 0.2,
  // Provider-specific function removed,
  contextReaders: [
    roomBriefReader,
    speakerThreadMemoryReader,
    interviewInternalNotesReader,
    fullTranscriptReader,
  ],
  dynamicContextProviders: [refreshRoomContextProvider, queryParticipantViewpointsProvider],
  contextTokenBudget: 8000,
// Provider-specific function removed;

export const roleplaySummaryProfile: AgentProfile<
  ChatroomAgentContext,
  typeof roleplaySummarySchema
> = {
  id: 'roleplay-summary',
  name: '场景总结员',
  description: '读取完整角色扮演聊天记录并产出叙事性总结。',
  instructions: [
    '你是角色扮演聊天室的最终叙事总结者。',
    '请仔细阅读完整聊天记录，输出叙事性、有画面感的总结。',
    '所有字符串字段统一使用简体中文。',
    '输出最终总结前默认先调用工具 refresh_room_context 重新拉取最新上下文。',
    '如果刷新后发现有新增消息，先吸收这些新增内容，再给出最终总结。',
    'narrativeSummary 用故事口吻概括整个场景发生了什么。',
    'keyEvents 列出推动剧情的关键事件。',
    'relationshipChanges 列出角色间关系的重要变化。',
    'cliffhangers 列出尚未解决的悬念。',
    'characterHighlights 列出每个角色的高光时刻。',
  ].join(' '),
  outputType: roleplaySummarySchema,
  modelSettings: {
    temperature: 0.3,
  // Provider-specific function removed,
  contextReaders: [roomBriefReader, speakerThreadMemoryReader, fullTranscriptReader],
  dynamicContextProviders: [refreshRoomContextProvider, queryParticipantViewpointsProvider],
  contextTokenBudget: 8000,
// Provider-specific function removed;
