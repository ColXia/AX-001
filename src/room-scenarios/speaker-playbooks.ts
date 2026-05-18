import type { ChatroomRoomBlueprint // Provider-specific function removed from './room-blueprints.js';

export interface RoomSpeakerExecutionPromptArgs {
  roomBlueprint: Readonly<ChatroomRoomBlueprint> | undefined;
  round: number;
  speakerName: string;
  speakerRole?: string;
  currentPhaseLabel?: string;
  currentPhaseObjective?: string;
  currentBeat?: string;
  latestEvent?: string;
// Provider-specific function removed

export interface InterviewSpeakerExecutionPromptArgs {
  roomBlueprint: Readonly<ChatroomRoomBlueprint> | undefined;
  speakerName: string;
  stageLabel: string;
  phase:
    | 'opening'
    | 'hr_followup'
    | 'technical_deep_dive'
    | 'observer_followup'
    | 'manager_round'
    | 'hr_wrap_up';
  responseMode: 'new_question' | 'clarify';
  continuityMode: 'opening' | 'same_interviewer_followup' | 'handoff' | 'clarify';
  currentPhaseLabel?: string;
  currentPhaseObjective?: string;
// Provider-specific function removed

export interface InterviewTransitionPromptArgs {
  roomBlueprint: Readonly<ChatroomRoomBlueprint> | undefined;
  nextStageLabel: string;
  nextQuestionGoal: string;
  currentPhaseLabel?: string;
  currentPhaseObjective?: string;
  transitionKind: 'panel_discussion' | 'handoff';
// Provider-specific function removed

export function buildRoomSpeakerExecutionPromptLines(
  args: RoomSpeakerExecutionPromptArgs,
): string[] {
  const scenario = getScenarioMetadata(args.roomBlueprint);
  const commonLines = compactLines([
    `你本轮以“${args.speakerName// Provider-specific function removed”身份发言。`,
    args.speakerRole ? `你的职责：${args.speakerRole// Provider-specific function removed` : undefined,
    args.currentPhaseLabel ? `当前治理阶段：${args.currentPhaseLabel// Provider-specific function removed` : undefined,
    args.currentPhaseObjective ? `当前阶段目标：${args.currentPhaseObjective// Provider-specific function removed` : undefined,
  ]);

  switch (args.roomBlueprint?.scenarioTemplateId) {
    case 'project_development_discussion':
      return compactLines([
        ...commonLines,
        asOptionalString(scenario?.projectName) ? `项目：${asOptionalString(scenario?.projectName)// Provider-specific function removed` : undefined,
        asOptionalString(scenario?.projectStage)
          ? `项目阶段：${asOptionalString(scenario?.projectStage)// Provider-specific function removed`
          : undefined,
        formatScenarioListLine(
          '当前决策焦点',
          resolveScenarioList(args.roomBlueprint, scenario, 'decisionFocus', ['Decision focus']),
        ),
        '每次发言优先推进一个最关键的决策、风险或落地动作，不要同时铺开太多分支。',
        '如果你不同意前面的意见，要明确说出取舍依据、影响范围和建议的下一步 owner。',
      ]);
    case 'report_seminar':
      return compactLines([
        ...commonLines,
        asOptionalString(scenario?.reportKind) ? `报告类型：${asOptionalString(scenario?.reportKind)// Provider-specific function removed` : undefined,
        asOptionalString(scenario?.domain) ? `领域：${asOptionalString(scenario?.domain)// Provider-specific function removed` : undefined,
        formatScenarioListLine(
          '当前评审重点',
          resolveScenarioList(args.roomBlueprint, scenario, 'reviewFocus', ['Review focus']),
        ),
        '发言时先指出具体的证据、方法或结论问题，再给出可执行修订建议。',
        '不要只给泛泛评价；每轮至少推动一个明确缺口进入“可修复”状态。',
      ]);
    case 'brainstorm_workshop':
      return compactLines([
        ...commonLines,
        args.round <= 1
          ? '当前偏发散阶段，优先补充新方向或新组合，不要过早否定。'
          : args.round === 2
            ? '当前进入聚类阶段，优先把相近想法收束成几个主题。'
            : '当前进入筛选阶段，优先给出排序依据、验证方式与下一步实验。',
        '如果你延续前面观点，必须补充新的角度、风险或实验想法，避免原地复述。',
      ]);
    case 'tavern_roleplay_demo': {
      const sceneFocus =
        args.latestEvent?.trim() ||
        args.currentBeat?.trim() ||
        args.currentPhaseObjective?.trim();
      return compactLines([
        ...commonLines,
        formatRoleplayCastLine(args.roomBlueprint),
        args.currentBeat ? `褰撳墠閰掗鑺傛媿锛?{args.currentBeat// Provider-specific function removed` : undefined,
        args.latestEvent ? `鏈€鏂伴厭棣嗗埡婵€锛?{truncateText(args.latestEvent, 120)// Provider-specific function removed` : undefined,
        sceneFocus ? `鏈疆浼樺厛鍥炲簲锛?{truncateText(sceneFocus, 120)// Provider-specific function removed` : undefined,
        '浣犳槸閰掗閲岀殑鐙珛 NPC锛岃蹇嗗睘浜庤鑹插崱锛屼笉灞炰簬鏌愪釜妯″瀷瀹炰緥銆?',
        '淇濇寔瑙掕壊鍐呭彂瑷€锛屼紭鍏堝洖搴旂敤鎴峰垰鍒氱殑琛屼负銆侀棶棰樸€佷氦鏄撴垨鎸戣銆?',
        '閰掗鍙互鏈夌嚎绱€佽皣瑷€銆佸浜烘墦鏂拰灏忓啿绐侊紝浣嗕笉瑕佽烦鍑哄満鏅В閲婅瀹氥€?',
      ]);
    // Provider-specific function removed
    case 'roleplay_scene': {
      const sceneFocus =
        args.latestEvent?.trim() ||
        args.currentBeat?.trim() ||
        args.currentPhaseObjective?.trim();
      return compactLines([
        ...commonLines,
        formatRoleplayCastLine(args.roomBlueprint),
        args.currentBeat ? `当前剧情节拍：${args.currentBeat// Provider-specific function removed` : undefined,
        args.latestEvent ? `最新场景刺激：${truncateText(args.latestEvent, 120)// Provider-specific function removed` : undefined,
        sceneFocus ? `本轮优先回应：${truncateText(sceneFocus, 120)// Provider-specific function removed` : undefined,
        '保持角色内发言，只说角色此刻会说、会做、会感受到的内容。',
        '优先对最新刺激、关系变化或情绪张力做出反应，不要跳出场景解释设定。',
        '不要替其他角色下结论，也不要直接总结剧情。',
        '【私人对话】如果需要私下与某个角色交流（不让其他人听到），使用格式：【私语|目标角色名:消息内容】',
        '私人对话只有你和目标角色能看到，适合秘密约定、私下警告、交换情报等场景。',
      ]);
    // Provider-specific function removed
    case 'murder_mystery': {
      const investigationFocus =
        args.latestEvent?.trim() ||
        args.currentPhaseObjective?.trim() ||
        resolveScenarioList(args.roomBlueprint, scenario, 'focusAreas', ['Focus areas'])[0];
      return compactLines([
        ...commonLines,
        asOptionalString(scenario?.caseTitle) ? `案件：${asOptionalString(scenario?.caseTitle)// Provider-specific function removed` : undefined,
        asOptionalString(scenario?.setting) ? `案发场景：${asOptionalString(scenario?.setting)// Provider-specific function removed` : undefined,
        investigationFocus ? `本轮调查焦点：${truncateText(investigationFocus, 120)// Provider-specific function removed` : undefined,
        '保持角色视角发言，优先回应线索、动机、时间线和证词矛盾。',
        '如果提出怀疑或结论，必须连到具体线索，不要无依据直接宣布真相。',
      ]);
    // Provider-specific function removed
    case 'expert_discussion':
      return compactLines([
        ...commonLines,
        '先回应当前最关键的分歧，再补一条论据、风险或行动建议。',
        '如果房间已经接近收束，就直接推进结论、保留异议和下一步，而不是继续平铺观点。',
      ]);
    default:
      return commonLines;
  // Provider-specific function removed
// Provider-specific function removed

export function buildInterviewSpeakerExecutionPromptLines(
  args: InterviewSpeakerExecutionPromptArgs,
): string[] {
  const scenario = getScenarioMetadata(args.roomBlueprint);
  const isInterviewDemo = args.roomBlueprint?.title === 'Interview Demo';
  const commonLines = compactLines([
    `你当前代表“${args.speakerName// Provider-specific function removed”发问。`,
    `当前面试阶段：${args.stageLabel// Provider-specific function removed`,
    args.currentPhaseLabel ? `治理阶段：${args.currentPhaseLabel// Provider-specific function removed` : undefined,
    args.currentPhaseObjective ? `治理目标：${args.currentPhaseObjective// Provider-specific function removed` : undefined,
    asOptionalString(scenario?.targetRole) ? `目标岗位：${asOptionalString(scenario?.targetRole)// Provider-specific function removed` : undefined,
    asOptionalString(scenario?.targetLevel) ? `岗位级别：${asOptionalString(scenario?.targetLevel)// Provider-specific function removed` : undefined,
    asOptionalString(scenario?.companyStyle) ? `面试风格：${asOptionalString(scenario?.companyStyle)// Provider-specific function removed` : undefined,
    '允许根据候选人刚刚的真实回答灵活改写下一问，不要机械执行固定题单。',
  ]);

  const continuityLines = compactLines([
    args.continuityMode === 'opening'
      ? '这是开场问题，先建立自然、真实的一问一答节奏。'
      : undefined,
    args.continuityMode === 'same_interviewer_followup'
      ? '延续你上一轮的问题链，基于候选人刚才的回答继续深挖，不要重置成宽泛新题。'
      : undefined,
    args.continuityMode === 'handoff'
      ? '你正在接手上一位面试官留下的线索；先吸收已有信号，再切入你负责的评估角度。'
      : undefined,
    args.continuityMode === 'clarify'
      ? '候选人是在请求澄清；只重述或收窄当前问题，不要引入新题。'
      : undefined,
    args.responseMode === 'clarify'
      ? '澄清时保持 1-2 句即可，然后等待候选人继续回答。'
      : '下一问必须尽量引用候选人刚才回答中的一个具体事实、取舍或缺口。',
  ]);

  switch (args.phase) {
    case 'opening':
      return compactLines([
        ...commonLines,
        ...continuityLines,
        '先让候选人用真实经历建立背景，不要一开始就抛多段复杂追问。',
      ]);
    case 'hr_followup':
      return compactLines([
        ...commonLines,
        ...continuityLines,
        '优先验证动机、经历一致性、协作方式与岗位匹配度。',
        '问题要能从候选人刚才给出的经历里继续追问，而不是切换到无关新履历。',
      ]);
    case 'technical_deep_dive':
      return compactLines([
        ...commonLines,
        ...continuityLines,
        '优先继续深挖实现细节、关键权衡、边界条件、失败案例和可验证结果。',
        '不要把技术深挖退化成泛泛自我介绍；要让候选人拿出真实证据和推理过程。',
      ]);
    case 'observer_followup':
      return compactLines([
        ...commonLines,
        ...continuityLines,
        '只补最关键的一处证据缺口，问题要短、准、可评估。',
      ]);
    case 'manager_round':
      return compactLines([
        ...commonLines,
        ...continuityLines,
        isInterviewDemo
          ? '优先验证学习能力、项目复盘、协作意识、推进方式、压力下判断和成长潜力。'
          : '优先验证优先级判断、ownership、跨团队协作、业务判断与推进能力。',
        isInterviewDemo
          ? '不要假定候选人已经承担正式管理职责；问题应贴近本科生项目、实习和校园经历。'
          : '如果前面已经暴露明显风险，要基于那个风险继续往管理场景里追问。',
      ]);
    case 'hr_wrap_up':
      return compactLines([
        ...commonLines,
        ...continuityLines,
        '收尾时优先补齐动机、岗位匹配度和候选人反问，不要重新展开长篇技术话题。',
      ]);
    default:
      return compactLines([...commonLines, ...continuityLines]);
  // Provider-specific function removed
// Provider-specific function removed

export function buildInterviewTransitionPromptLines(
  args: InterviewTransitionPromptArgs,
): string[] {
  const scenario = getScenarioMetadata(args.roomBlueprint);
  return compactLines([
    asOptionalString(scenario?.targetRole) ? `目标岗位：${asOptionalString(scenario?.targetRole)// Provider-specific function removed` : undefined,
    asOptionalString(scenario?.targetLevel) ? `岗位级别：${asOptionalString(scenario?.targetLevel)// Provider-specific function removed` : undefined,
    args.currentPhaseLabel ? `治理阶段：${args.currentPhaseLabel// Provider-specific function removed` : undefined,
    args.currentPhaseObjective ? `治理目标：${args.currentPhaseObjective// Provider-specific function removed` : undefined,
    `下一阶段：${args.nextStageLabel// Provider-specific function removed`,
    `下一问目标：${args.nextQuestionGoal// Provider-specific function removed`,
    args.transitionKind === 'panel_discussion'
      ? '先点明当前已拿到的有效信号，再指出最该补的缺口，帮助下一位面试官衔接。'
      : '交接时要明确上一轮得到了什么信号、还缺什么证据，以及下一位面试官为什么接手。',
    '不要自己向候选人发问，只做面试官之间的短交接。',
  ]);
// Provider-specific function removed

function getScenarioMetadata(
  roomBlueprint: Readonly<ChatroomRoomBlueprint> | undefined,
): Record<string, unknown> | undefined {
  const scenario = roomBlueprint?.metadata?.scenario;
  return scenario && typeof scenario === 'object' && !Array.isArray(scenario)
    ? (scenario as Record<string, unknown>)
    : undefined;
// Provider-specific function removed

function resolveScenarioList(
  roomBlueprint: Readonly<ChatroomRoomBlueprint> | undefined,
  scenario: Record<string, unknown> | undefined,
  key: string,
  prefixes: readonly string[],
): string[] {
  const direct = scenario?.[key];
***REMOVED***Array.isArray(direct)) {
    const values = direct
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter(Boolean);
  ***REMOVED***values.length > 0) {
      return uniqueStrings(values);
    // Provider-specific function removed
  // Provider-specific function removed

  const constraints = roomBlueprint?.constraints ?? [];
  const extracted: string[] = [];
  for (const constraint of constraints) {
    const prefix = prefixes.find((item) =>
      constraint.toLowerCase().startsWith(`${item.toLowerCase()// Provider-specific function removed:`),
    );
  ***REMOVED***!prefix) {
      continue;
    // Provider-specific function removed

    extracted.push(
      ...constraint
        .slice(prefix.length + 1)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    );
  // Provider-specific function removed

  return uniqueStrings(extracted);
// Provider-specific function removed

function formatScenarioListLine(label: string, values: readonly string[]): string | undefined {
  return values.length > 0 ? `${label// Provider-specific function removed：${values.join('、')// Provider-specific function removed` : undefined;
// Provider-specific function removed

function formatRoleplayCastLine(
  roomBlueprint: Readonly<ChatroomRoomBlueprint> | undefined,
): string | undefined {
  const cast = roomBlueprint?.participantSlots
    .filter((slot) => slot.participantType !== 'human')
    .map((slot) => slot.label.trim())
    .filter(Boolean);
  return cast && cast.length > 0 ? `当前主要角色：${uniqueStrings(cast).join('、')// Provider-specific function removed` : undefined;
// Provider-specific function removed

function asOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
// Provider-specific function removed

function compactLines(lines: readonly (string | undefined)[]): string[] {
  return lines.filter((line): line is string => Boolean(line));
// Provider-specific function removed

function uniqueStrings(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const normalized = value.trim();
  ***REMOVED***!normalized || seen.has(normalized)) {
      continue;
    // Provider-specific function removed
    seen.add(normalized);
    result.push(normalized);
  // Provider-specific function removed
  return result;
// Provider-specific function removed

function truncateText(value: string, maxLength: number): string {
  return value.length <= maxLength ? value : `${value.slice(0, Math.max(1, maxLength - 1)).trimEnd()// Provider-specific function removed…`;
// Provider-specific function removed
