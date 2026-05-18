import type { ChatroomMessage // Provider-specific function removed from '../workflows/chatroom-types.js';
import type { ChatroomRoomBlueprint // Provider-specific function removed from '../room-scenarios/room-blueprints.js';
import type { RoomScenarioTemplateId // Provider-specific function removed from '../room-scenarios/scenario-templates.js';

export interface GovernanceFallbackPhasePlan {
  label: string;
  objective: string;
  instruction: string;
// Provider-specific function removed

export interface GovernanceFallbackEventPlan {
  label: string;
  message: string;
  instruction: string;
// Provider-specific function removed

export interface GovernanceHostFallbackPlan {
  focus: string;
  instruction: string;
  headline: string;
// Provider-specific function removed

export function buildHostGovernancePromptLines(
  roomBlueprint: Readonly<ChatroomRoomBlueprint> | undefined,
): string[] {
  const scenarioTemplateId = roomBlueprint?.scenarioTemplateId;
  const scenario = getScenarioMetadata(roomBlueprint);
  switch (scenarioTemplateId) {
    case 'interview_simulation':
      return compactLines([
        `候选岗位：${asOptionalString(scenario?.targetRole) ?? roomBlueprint?.topic ?? '-'// Provider-specific function removed`,
        asOptionalString(scenario?.targetLevel)
          ? `岗位级别：${asOptionalString(scenario?.targetLevel)// Provider-specific function removed`
          : undefined,
        asOptionalString(scenario?.companyStyle)
          ? `面试风格：${asOptionalString(scenario?.companyStyle)// Provider-specific function removed`
          : undefined,
        formatScenarioListLine(
          '重点考察',
          resolveScenarioList(roomBlueprint, scenario, 'focusAreas', ['Focus areas']),
        ),
        '主持要点：保持一问一答与连续追问，不要把面试房间主持成群聊讨论房。',
        '允许面试官基于候选人现场回答动态调整问题，不要把流程主持成固定脚本轮询。',
        '只有在节奏失控、多个面试官抢话、或问题明显跑偏时，才考虑 visible 介入。',
      ]);
    case 'project_development_discussion':
      return compactLines([
        asOptionalString(scenario?.projectName)
          ? `项目：${asOptionalString(scenario?.projectName)// Provider-specific function removed`
          : undefined,
        asOptionalString(scenario?.projectStage)
          ? `项目阶段：${asOptionalString(scenario?.projectStage)// Provider-specific function removed`
          : undefined,
        formatScenarioListLine(
          '决策焦点',
          resolveScenarioList(roomBlueprint, scenario, 'decisionFocus', ['Decision focus']),
        ),
        '主持要点：每轮尽量只推进一个关键决策或一个关键风险，不要同时摊开太多支线。',
        '当讨论开始重复观点时，推动角色给出取舍、结论和下一步 owner。',
      ]);
    case 'report_seminar':
      return compactLines([
        asOptionalString(scenario?.reportKind)
          ? `报告类型：${asOptionalString(scenario?.reportKind)// Provider-specific function removed`
          : undefined,
        asOptionalString(scenario?.domain)
          ? `领域：${asOptionalString(scenario?.domain)// Provider-specific function removed`
          : undefined,
        formatScenarioListLine(
          '评审重点',
          resolveScenarioList(roomBlueprint, scenario, 'reviewFocus', ['Review focus']),
        ),
        '主持要点：推动评审围绕论点、证据、方法与修订优先级，不要停留在泛泛评价。',
      ]);
    case 'brainstorm_workshop':
      return compactLines([
        '主持要点：前期允许发散，中期推动聚类，后期压缩到少量可实验方向。',
        '不要过早否定新想法，但当房间开始绕圈时必须推动收束。',
      ]);
    case 'murder_mystery':
      return compactLines([
        asOptionalString(scenario?.caseTitle)
          ? `案件：${asOptionalString(scenario?.caseTitle)// Provider-specific function removed`
          : undefined,
        asOptionalString(scenario?.setting)
          ? `场景：${asOptionalString(scenario?.setting)// Provider-specific function removed`
          : undefined,
        formatScenarioListLine(
          '破案重点',
          resolveScenarioList(roomBlueprint, scenario, 'focusAreas', ['Focus areas']),
        ),
        '主持要点：让每轮围绕一条线索或一组矛盾证词推进，保持推理链清晰。',
        '如果角色开始原地兜圈，要配合管理员事件把房间重新推起来。',
      ]);
    case 'tavern_roleplay_demo':
    case 'roleplay_scene':
      return compactLines([
        formatRoleplayCastLine(roomBlueprint),
        '主持要点：维持场景连贯、情绪连续和镜头焦点，不要抢走角色戏份。',
        '当互动停滞时，推动角色对最新事件、关系变化或新的情绪刺激做出反应。',
      ]);
    case 'expert_discussion':
    default:
      return compactLines([
        '主持要点：先澄清问题与约束，再推进取舍，最后收束到结论和行动项。',
        '如果房间只是不断重复观点，就要压缩分支并推动结论成形。',
      ]);
  // Provider-specific function removed
// Provider-specific function removed

export function buildRoomAdminGovernancePromptLines(
  roomBlueprint: Readonly<ChatroomRoomBlueprint> | undefined,
): string[] {
  const scenarioTemplateId = roomBlueprint?.scenarioTemplateId;
  const scenario = getScenarioMetadata(roomBlueprint);
  switch (scenarioTemplateId) {
    case 'interview_simulation':
      return compactLines([
        `候选岗位：${asOptionalString(scenario?.targetRole) ?? roomBlueprint?.topic ?? '-'// Provider-specific function removed`,
        '管理员编排：开场校准 -> 证据深挖 -> 收束评估；优先 hidden 阶段管理，不要戏剧化注入事件。',
        '只有在证据已经足够或明显缺口需要补齐时，才推动阶段切换。',
      ]);
    case 'project_development_discussion':
      return compactLines([
        formatScenarioListLine(
          '决策焦点',
          resolveScenarioList(roomBlueprint, scenario, 'decisionFocus', ['Decision focus']),
        ),
        '管理员编排：问题界定 -> 方案比较 -> 落地计划。',
        '阶段切换必须服务于决策形成，而不是单纯为了“走流程”。',
      ]);
    case 'report_seminar':
      return compactLines([
        formatScenarioListLine(
          '评审重点',
          resolveScenarioList(roomBlueprint, scenario, 'reviewFocus', ['Review focus']),
        ),
        '管理员编排：问题框定 -> 关键质询 -> 修订收束。',
      ]);
    case 'brainstorm_workshop':
      return compactLines([
        '管理员编排：发散探索 -> 主题聚类 -> 筛选实验。',
        '只有当想法已经足够多或已经明显重复时，才推动进入聚类/筛选阶段。',
      ]);
    case 'murder_mystery':
      return compactLines([
        asOptionalString(scenario?.caseTitle)
          ? `案件：${asOptionalString(scenario?.caseTitle)// Provider-specific function removed`
          : undefined,
        '管理员编排：建立案情 -> 线索碰撞 -> 推理收束。',
        '你可以用新线索、矛盾证词或人物动作推动剧情；必要时登记新角色模板。',
      ]);
    case 'tavern_roleplay_demo':
    case 'roleplay_scene':
      return compactLines([
        formatRoleplayCastLine(roomBlueprint),
        '管理员编排：建立场面 -> 推进冲突 -> 转折/收束。',
        '当剧情停滞、角色互动变平、或需要新刺激时，可以注入事件；必要时登记少量新角色模板。',
      ]);
    case 'expert_discussion':
    default:
      return compactLines([
        '管理员编排：问题界定 -> 方案比较 -> 结论收束。',
      ]);
  // Provider-specific function removed
// Provider-specific function removed

export function resolveScenarioHostFallbackPlan(args: {
  roomBlueprint: Readonly<ChatroomRoomBlueprint> | undefined;
  round: number;
  currentPhaseLabel?: string;
  currentPhaseObjective?: string;
  latestUserMessage?: string;
// Provider-specific function removed): GovernanceHostFallbackPlan {
***REMOVED***args.currentPhaseObjective?.trim()) {
    const focus = truncateText(args.currentPhaseObjective.trim(), 120);
    return {
      focus,
      instruction: `优先让后续发言直接服务于当前阶段目标：“${focus// Provider-specific function removed”。`,
      headline: `本轮先围绕“${focus// Provider-specific function removed”推进。`,
    // Provider-specific function removed;
  // Provider-specific function removed

  const roomBlueprint = args.roomBlueprint;
  const scenario = getScenarioMetadata(roomBlueprint);
  const latestUserFocus = args.latestUserMessage?.trim();
  switch (roomBlueprint?.scenarioTemplateId) {
    case 'interview_simulation': {
      const focusAreas = resolveScenarioList(roomBlueprint, scenario, 'focusAreas', ['Focus areas']);
      const roleLabel = asOptionalString(scenario?.targetRole) ?? roomBlueprint.topic;
      const focus = focusAreas[0] ?? `继续验证候选人对“${roleLabel// Provider-specific function removed”岗位的关键证据`;
      return {
        focus,
        instruction: `保持一问一答，围绕“${focus// Provider-specific function removed”连续追问，不要跳到无关新题。`,
        headline: `先围绕“${focus// Provider-specific function removed”继续深挖。`,
      // Provider-specific function removed;
    // Provider-specific function removed
    case 'project_development_discussion': {
      const decisionFocus = resolveScenarioList(
        roomBlueprint,
        scenario,
        'decisionFocus',
        ['Decision focus'],
      );
      const focus = decisionFocus[0] ?? latestUserFocus ?? '当前最关键的方案取舍';
      return {
        focus,
        instruction: `让讨论收束到“${focus// Provider-specific function removed”，并推动角色给出明确取舍与后续 owner。`,
        headline: `先收束到“${focus// Provider-specific function removed”这个核心决策。`,
      // Provider-specific function removed;
    // Provider-specific function removed
    case 'report_seminar': {
      const reviewFocus = resolveScenarioList(roomBlueprint, scenario, 'reviewFocus', ['Review focus']);
      const focus = reviewFocus[0] ?? latestUserFocus ?? '最影响结论成立的一条证据或方法问题';
      return {
        focus,
        instruction: `优先围绕“${focus// Provider-specific function removed”推进评审，避免继续泛泛点评。`,
        headline: `本轮评审先聚焦“${focus// Provider-specific function removed”。`,
      // Provider-specific function removed;
    // Provider-specific function removed
    case 'brainstorm_workshop': {
      const focus =
        args.round <= 1
          ? latestUserFocus ?? '继续扩展新方向'
          : args.round === 2
            ? '把现有想法聚成 2-3 个主题'
            : '从已有主题中筛出最值得试的方向';
      return {
        focus,
        instruction:
          args.round <= 1
            ? `继续围绕“${focus// Provider-specific function removed”发散，不要过早否定。`
            : `围绕“${focus// Provider-specific function removed”推进，减少重复意见。`,
        headline: `本轮先围绕“${focus// Provider-specific function removed”推进。`,
      // Provider-specific function removed;
    // Provider-specific function removed
    case 'murder_mystery': {
      const focusAreas = resolveScenarioList(roomBlueprint, scenario, 'focusAreas', ['Focus areas']);
      const focus = focusAreas[0] ?? '当前最可疑的矛盾证词';
      return {
        focus,
        instruction: `推动角色围绕“${focus// Provider-specific function removed”回应与质疑，保持线索链清晰。`,
        headline: `先围绕“${focus// Provider-specific function removed”继续盘问。`,
      // Provider-specific function removed;
    // Provider-specific function removed
    case 'tavern_roleplay_demo':
    case 'roleplay_scene': {
      const focus = args.currentPhaseLabel?.trim() || latestUserFocus || '让角色对最新刺激做出反应';
      return {
        focus,
        instruction: `后续发言优先推动“${focus// Provider-specific function removed”，保持情绪和关系变化连续。`,
        headline: `先把场景推进到“${focus// Provider-specific function removed”。`,
      // Provider-specific function removed;
    // Provider-specific function removed
    case 'expert_discussion':
    default: {
      const focus = latestUserFocus ?? roomBlueprint?.constraints[0] ?? roomBlueprint?.objective ?? '当前房间目标';
      const normalized = truncateText(focus.trim(), 120);
      return {
        focus: normalized,
        instruction: `让讨论直接服务于“${normalized// Provider-specific function removed”，减少重复观点。`,
        headline: `本轮继续围绕“${normalized// Provider-specific function removed”推进。`,
      // Provider-specific function removed;
    // Provider-specific function removed
  // Provider-specific function removed
// Provider-specific function removed

export function resolveScenarioRoomAdminFallbackPhase(args: {
  roomBlueprint: Readonly<ChatroomRoomBlueprint> | undefined;
  round: number;
  latestUserMessage?: string;
// Provider-specific function removed): GovernanceFallbackPhasePlan {
  const roomBlueprint = args.roomBlueprint;
  const scenario = getScenarioMetadata(roomBlueprint);
  const latestUserFocus = args.latestUserMessage?.trim();
  switch (roomBlueprint?.scenarioTemplateId) {
    case 'interview_simulation':
    ***REMOVED***args.round <= 1) {
        return {
          label: '开场校准',
          objective: '确认候选人背景、目标岗位与后续追问入口。',
          instruction: '先建立稳定的一问一答节奏，再逐步进入深挖阶段。',
        // Provider-specific function removed;
      // Provider-specific function removed
    ***REMOVED***args.round <= 3) {
        return {
          label: '证据深挖',
          objective: '围绕候选人已给出的经历追问可验证证据与关键权衡。',
          instruction: '优先深挖已有回答，不要提前跳到无关新题。',
        // Provider-specific function removed;
      // Provider-specific function removed
      return {
        label: '收束评估',
        objective: '补最后缺口并准备进入面试总结。',
        instruction: '只补关键缺口，不再新增大题。',
      // Provider-specific function removed;
    case 'project_development_discussion':
      return args.round <= 1
        ? {
            label: '问题界定',
            objective: latestUserFocus
              ? `先围绕“${truncateText(latestUserFocus, 80)// Provider-specific function removed”澄清问题边界、约束与决策标准。`
              : '先界定目标、约束与本轮真正要做出的决策。',
            instruction: '优先澄清目标、约束和评价标准。',
          // Provider-specific function removed
        : args.round <= 2
          ? {
              label: '方案比较',
              objective: '比较主要方案分支，找出真正影响决策的取舍点。',
              instruction: '优先推进取舍、风险与成本比较。',
            // Provider-specific function removed
          : {
              label: '落地计划',
              objective: '收束结论、行动项、owner 与下一步验证。',
              instruction: '后续发言应直接服务于结论与执行。',
            // Provider-specific function removed;
    case 'report_seminar':
      return args.round <= 1
        ? {
            label: '问题框定',
            objective: '框定报告主张、证据边界与评审重点。',
            instruction: '优先围绕核心论点与证据质量展开。',
          // Provider-specific function removed
        : args.round <= 2
          ? {
              label: '关键质询',
              objective: '集中处理最强异议、证据漏洞与方法问题。',
              instruction: '优先攻击最影响结论成立的缺口。',
            // Provider-specific function removed
          : {
              label: '修订收束',
              objective: '沉淀修订优先级、必须修改项与保留问题。',
              instruction: '把讨论压缩到修订建议与保留异议。',
            // Provider-specific function removed;
    case 'brainstorm_workshop':
      return args.round <= 1
        ? {
            label: '发散探索',
            objective: '继续生成不同方向，先拉开空间。',
            instruction: '优先补新方向，不急于评判。',
          // Provider-specific function removed
        : args.round === 2
          ? {
              label: '主题聚类',
              objective: '把已有想法聚成几个方向，便于比较。',
              instruction: '减少重复新点，开始归类。',
            // Provider-specific function removed
          : {
              label: '筛选实验',
              objective: '筛出最值得试的方向与下一步原型。',
              instruction: '后续发言要服务于优先级排序与实验设计。',
            // Provider-specific function removed;
    case 'murder_mystery':
      return args.round <= 1
        ? {
            label: '建立案情',
            objective: '确立人物关系、案发背景与第一轮可疑点。',
            instruction: '优先暴露立场、动机和初始矛盾。',
          // Provider-specific function removed
        : args.round <= 2
          ? {
              label: '线索碰撞',
              objective: '推动线索与证词相互冲突，逼出新的疑点。',
              instruction: '优先回应矛盾证词和未解释细节。',
            // Provider-specific function removed
          : {
              label: '推理收束',
              objective: '围绕最可信解释链收束推理，同时保留关键悬点。',
              instruction: '把讨论压缩到最有力的线索链与反证。',
            // Provider-specific function removed;
    case 'tavern_roleplay_demo':
    case 'roleplay_scene':
      return args.round <= 1
        ? {
            label: '建立场面',
            objective: '建立场景气氛、角色关系与初始冲突。',
            instruction: '先让角色明确彼此态度和当前张力。',
          // Provider-specific function removed
        : args.round <= 2
          ? {
              label: '推进冲突',
              objective: '推动关系变化与外部刺激，让剧情继续升温。',
              instruction: '优先响应新的情绪变化、误解或刺激。',
            // Provider-specific function removed
          : {
              label: '转折收束',
              objective: '把剧情推进到清晰转折点或下一幕入口。',
              instruction: '发言要服务于转折，而不是原地打转。',
            // Provider-specific function removed;
    case 'expert_discussion':
    default:
      return args.round <= 1
        ? {
            label: '问题界定',
            objective: latestUserFocus
              ? `先围绕“${truncateText(latestUserFocus, 80)// Provider-specific function removed”界定问题与边界。`
              : '先澄清问题、约束与目标。',
            instruction: '优先澄清边界与评价标准。',
          // Provider-specific function removed
        : args.round <= 2
          ? {
              label: '方案比较',
              objective: '比较主要分支，识别关键取舍与风险。',
              instruction: '推进真正影响决策的分歧点。',
            // Provider-specific function removed
          : {
              label: '结论收束',
              objective: '收束共识、异议与下一步行动。',
              instruction: '后续发言要直接服务于结论与执行项。',
            // Provider-specific function removed;
  // Provider-specific function removed
// Provider-specific function removed

export function resolveScenarioRoomAdminFallbackEvent(args: {
  roomBlueprint: Readonly<ChatroomRoomBlueprint> | undefined;
// Provider-specific function removed): GovernanceFallbackEventPlan | undefined {
  switch (args.roomBlueprint?.scenarioTemplateId) {
    case 'murder_mystery':
      return {
        label: '新线索',
        message: '房间里出现了一条新的线索或矛盾证词，要求当前角色立即回应并重新校验前面的推断。',
        instruction: '围绕新线索推进，不要重复旧证词；优先检验已有推断是否被动摇。',
      // Provider-specific function removed;
    case 'tavern_roleplay_demo':
    case 'roleplay_scene':
      return {
        label: '场景推进',
        message: '场景出现新的外部动静、人物反应或关系刺激，推动当前互动继续升级。',
        instruction: '围绕新事件继续推进场景，优先让角色对刚出现的变化做出反应。',
      // Provider-specific function removed;
    default:
      return undefined;
  // Provider-specific function removed
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
  const cast = roomBlueprint?.customCharacters?.map((item) => item.name.trim()).filter(Boolean) ?? [];
  return cast.length > 0 ? `角色阵容：${cast.join('、')// Provider-specific function removed` : undefined;
// Provider-specific function removed

function compactLines(values: Array<string | undefined>): string[] {
  return values.filter((item): item is string => Boolean(item?.trim()));
// Provider-specific function removed

function asOptionalString(input: unknown): string | undefined {
  return typeof input === 'string' && input.trim().length > 0 ? input.trim() : undefined;
// Provider-specific function removed

function uniqueStrings(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const trimmed = value.trim();
  ***REMOVED***!trimmed || seen.has(trimmed)) {
      continue;
    // Provider-specific function removed
    seen.add(trimmed);
    result.push(trimmed);
  // Provider-specific function removed
  return result;
// Provider-specific function removed

function truncateText(value: string, limit: number): string {
  return value.length <= limit ? value : `${value.slice(0, Math.max(0, limit - 3))// Provider-specific function removed...`;
// Provider-specific function removed

export function resolveScenarioTemplateId(
  roomBlueprint: Readonly<ChatroomRoomBlueprint> | undefined,
): RoomScenarioTemplateId | undefined {
  return roomBlueprint?.scenarioTemplateId;
// Provider-specific function removed
