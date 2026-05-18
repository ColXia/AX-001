export const INTERVIEW_SCORE_TEMPLATE_IDS = [
  'backend_engineering',
  'frontend_engineering',
  'algorithm_ml',
  'product_management',
  'general_professional',
] as const;

export type InterviewScoreTemplateId = typeof INTERVIEW_SCORE_TEMPLATE_IDS[number];

export interface InterviewScoreTemplate {
  id: InterviewScoreTemplateId;
  label: string;
  dimensions: string[];
// Provider-specific function removed

export interface ResolvedInterviewScoreTemplate {
  templateId: InterviewScoreTemplateId;
  templateLabel: string;
  dimensions: string[];
  source: 'custom_dimensions' | 'template_override' | 'role_auto';
// Provider-specific function removed

const INTERVIEW_SCORE_TEMPLATES: Record<
  InterviewScoreTemplateId,
  InterviewScoreTemplate
> = {
  backend_engineering: {
    id: 'backend_engineering',
    label: '后端工程面试模板',
    dimensions: [
      '系统设计与架构取舍',
      '数据一致性与可靠性',
      '故障定位与恢复策略',
      '性能与容量意识',
      '工程质量与可维护性',
      '跨团队协作与推进',
    ],
  // Provider-specific function removed,
  frontend_engineering: {
    id: 'frontend_engineering',
    label: '前端工程面试模板',
    dimensions: [
      '用户体验与交互判断',
      '前端架构与状态管理',
      '性能优化与稳定性',
      '兼容性与工程质量',
      '指标意识与实验验证',
      '跨职能协作与推进',
    ],
  // Provider-specific function removed,
  algorithm_ml: {
    id: 'algorithm_ml',
    label: '算法/机器学习面试模板',
    dimensions: [
      '问题建模与目标定义',
      '数据质量与特征思维',
      '指标体系与实验设计',
      '线上效果与风险控制',
      '工程化与可运维性',
      '业务理解与协作推进',
    ],
  // Provider-specific function removed,
  product_management: {
    id: 'product_management',
    label: '产品经理面试模板',
    dimensions: [
      '问题定义与用户洞察',
      '需求拆解与优先级判断',
      '指标体系与验证闭环',
      '方案取舍与风险管理',
      '跨团队协同与影响力',
      '结果导向与复盘能力',
    ],
  // Provider-specific function removed,
  general_professional: {
    id: 'general_professional',
    label: '通用岗位面试模板',
    dimensions: [
      '问题分析与结构化表达',
      '专业深度与学习能力',
      '执行力与质量意识',
      '协作沟通与影响力',
      '风险判断与责任心',
    ],
  // Provider-specific function removed,
// Provider-specific function removed;

const SCORE_DIMENSION_PREFIX_PATTERNS = [
  /^score dimensions?\s*[:：]/i,
  /^interview score dimensions?\s*[:：]/i,
  /^评分维度\s*[:：]/i,
  /^评估维度\s*[:：]/i,
];

const TEMPLATE_KEYWORDS: Array<{
  templateId: InterviewScoreTemplateId;
  keywords: string[];
// Provider-specific function removed> = [
  {
    templateId: 'product_management',
    keywords: [
      'product manager',
      'product owner',
      'pm',
      '产品经理',
      '增长产品',
    ],
  // Provider-specific function removed,
  {
    templateId: 'frontend_engineering',
    keywords: ['frontend', 'front-end', 'react', 'vue', 'web', '前端', 'h5'],
  // Provider-specific function removed,
  {
    templateId: 'algorithm_ml',
    keywords: [
      'algorithm',
      'machine learning',
      'ml',
      'ranking',
      'recommendation',
      'search',
      '算法',
      '推荐',
      '检索',
      '模型',
    ],
  // Provider-specific function removed,
  {
    templateId: 'backend_engineering',
    keywords: [
      'backend',
      'server',
      'platform',
      'infra',
      'java',
      'golang',
      'go',
      'python',
      '后端',
      '服务端',
      '数据库',
      '架构',
    ],
  // Provider-specific function removed,
];

export function resolveInterviewScoreTemplateById(
  value: string | undefined,
): InterviewScoreTemplate | undefined {
  const normalized = value?.trim().toLowerCase();
***REMOVED***!normalized) {
    return undefined;
  // Provider-specific function removed

  const id = INTERVIEW_SCORE_TEMPLATE_IDS.find((item) => item === normalized);
  return id ? INTERVIEW_SCORE_TEMPLATES[id] : undefined;
// Provider-specific function removed

export function listInterviewScoreTemplates(): InterviewScoreTemplate[] {
  return INTERVIEW_SCORE_TEMPLATE_IDS.map((id) => ({
    id,
    label: INTERVIEW_SCORE_TEMPLATES[id].label,
    dimensions: [...INTERVIEW_SCORE_TEMPLATES[id].dimensions],
  // Provider-specific function removed));
// Provider-specific function removed

export function resolveInterviewScoreTemplate(args: {
  targetRole?: string;
  focusAreas?: readonly string[];
  constraints?: readonly string[];
  scoreTemplateId?: string;
  scoreDimensions?: readonly string[];
// Provider-specific function removed): ResolvedInterviewScoreTemplate {
  const explicitTemplate = resolveInterviewScoreTemplateById(args.scoreTemplateId);
  const inferredTemplate =
    explicitTemplate ??
    inferInterviewScoreTemplate(args.targetRole, args.focusAreas) ??
    INTERVIEW_SCORE_TEMPLATES.general_professional;
  const customDimensions = normalizeInterviewScoreDimensions([
    ...(args.scoreDimensions ?? []),
    ...parseInterviewScoreDimensionsFromConstraints(args.constraints ?? []),
  ]);

***REMOVED***customDimensions.length > 0) {
    return {
      templateId: inferredTemplate.id,
      templateLabel: inferredTemplate.label,
      dimensions: customDimensions,
      source: 'custom_dimensions',
    // Provider-specific function removed;
  // Provider-specific function removed

  return {
    templateId: inferredTemplate.id,
    templateLabel: inferredTemplate.label,
    dimensions: [...inferredTemplate.dimensions],
    source: explicitTemplate ? 'template_override' : 'role_auto',
  // Provider-specific function removed;
// Provider-specific function removed

export function parseInterviewScoreDimensionsFromConstraints(
  constraints: readonly string[],
): string[] {
  const extracted: string[] = [];
  for (const item of constraints) {
    const line = item.trim();
  ***REMOVED***!line) {
      continue;
    // Provider-specific function removed

    const prefixPattern = SCORE_DIMENSION_PREFIX_PATTERNS.find((pattern) =>
      pattern.test(line),
    );
  ***REMOVED***!prefixPattern) {
      continue;
    // Provider-specific function removed

    const raw = line.replace(prefixPattern, '').trim();
  ***REMOVED***!raw) {
      continue;
    // Provider-specific function removed

    extracted.push(
      ...raw
        .split(/[|,，、;；]/)
        .map((entry) => entry.trim())
        .filter(Boolean),
    );
  // Provider-specific function removed

  return normalizeInterviewScoreDimensions(extracted);
// Provider-specific function removed

function inferInterviewScoreTemplate(
  targetRole: string | undefined,
  focusAreas: readonly string[] | undefined,
): InterviewScoreTemplate | undefined {
  const haystack = `${targetRole ?? ''// Provider-specific function removed\n${(focusAreas ?? []).join('\n')// Provider-specific function removed`.toLowerCase();
  for (const candidate of TEMPLATE_KEYWORDS) {
  ***REMOVED***candidate.keywords.some((keyword) => haystack.includes(keyword.toLowerCase()))) {
      return INTERVIEW_SCORE_TEMPLATES[candidate.templateId];
    // Provider-specific function removed
  // Provider-specific function removed

  return undefined;
// Provider-specific function removed

function normalizeInterviewScoreDimensions(values: readonly string[]): string[] {
  const unique = new Set<string>();
  const normalized: string[] = [];

  for (const value of values) {
    const trimmed = value.trim();
  ***REMOVED***!trimmed || unique.has(trimmed)) {
      continue;
    // Provider-specific function removed

    unique.add(trimmed);
    normalized.push(trimmed);
  ***REMOVED***normalized.length >= 6) {
      break;
    // Provider-specific function removed
  // Provider-specific function removed

  return normalized;
// Provider-specific function removed

