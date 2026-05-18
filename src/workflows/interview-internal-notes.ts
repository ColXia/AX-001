import type {
  ChatroomInterviewInternalNote,
  ChatroomInterviewInternalNoteKind,
  ChatroomInterviewInternalSignalTag,
// Provider-specific function removed from './chatroom-types.js';

export const INTERVIEW_INTERNAL_SIGNAL_TAGS = [
  'supportive_guidance',
  'risk_alert',
  'suggest_close',
  'suggest_handoff',
  'retry_same_thread',
  'retry_with_clarify',
  'retry_new_angle',
] as const satisfies readonly ChatroomInterviewInternalSignalTag[];

const SIGNAL_TAG_ALIASES: Readonly<Record<string, ChatroomInterviewInternalSignalTag>> = {
  supportive_guidance: 'supportive_guidance',
  supportive: 'supportive_guidance',
  guidance: 'supportive_guidance',
  guided: 'supportive_guidance',
  supportive_guided: 'supportive_guidance',
  friendly_guidance: 'supportive_guidance',
  friendly: 'supportive_guidance',
  coach: 'supportive_guidance',
  coaching: 'supportive_guidance',
  友好引导: 'supportive_guidance',
  引导: 'supportive_guidance',
  友好: 'supportive_guidance',
  支持式引导: 'supportive_guidance',
  新人友好: 'supportive_guidance',

  risk_alert: 'risk_alert',
  risk: 'risk_alert',
  alert: 'risk_alert',
  warning: 'risk_alert',
  风险提醒: 'risk_alert',
  风险: 'risk_alert',
  预警: 'risk_alert',
  警示: 'risk_alert',

  suggest_close: 'suggest_close',
  close: 'suggest_close',
  wrap_up: 'suggest_close',
  wrapup: 'suggest_close',
  stop: 'suggest_close',
  terminate: 'suggest_close',
  建议收束: 'suggest_close',
  收束: 'suggest_close',
  建议结束: 'suggest_close',
  结束: 'suggest_close',
  收尾: 'suggest_close',

  suggest_handoff: 'suggest_handoff',
  handoff: 'suggest_handoff',
  transfer: 'suggest_handoff',
  route: 'suggest_handoff',
  建议换人: 'suggest_handoff',
  换人: 'suggest_handoff',
  交接: 'suggest_handoff',
  转交: 'suggest_handoff',

  retry_same_thread: 'retry_same_thread',
  retry: 'retry_same_thread',
  same_thread: 'retry_same_thread',
  keep_thread: 'retry_same_thread',
  继续追问: 'retry_same_thread',
  同线程重试: 'retry_same_thread',
  保持线程: 'retry_same_thread',
  围绕当前问题: 'retry_same_thread',

  retry_with_clarify: 'retry_with_clarify',
  clarify: 'retry_with_clarify',
  narrow: 'retry_with_clarify',
  restate: 'retry_with_clarify',
  澄清重试: 'retry_with_clarify',
  澄清: 'retry_with_clarify',
  缩窄: 'retry_with_clarify',
  重述: 'retry_with_clarify',

  retry_new_angle: 'retry_new_angle',
  new_angle: 'retry_new_angle',
  alternate: 'retry_new_angle',
  reframe: 'retry_new_angle',
  换角度重试: 'retry_new_angle',
  换角度: 'retry_new_angle',
  换个问法: 'retry_new_angle',
  新角度: 'retry_new_angle',
// Provider-specific function removed;

const SUPPORTIVE_PATTERNS = [
  /新人|新手|没经验|缺乏经验|紧张|不擅长面试|更友好|给结构|一步一步|拆成更小|引导/u,
  /junior|new grad|inexperienced|nervous|friendly|supportive|guided|scaffold|coach/i,
] as const;
const RISK_PATTERNS = [
  /风险|矛盾|冲突|前后不一致|需验证|可疑|没讲清边界|缺关键证据/u,
  /risk|conflict|inconsistent|contradiction|needs verification|suspicious|missing evidence/i,
] as const;
const CLOSE_PATTERNS = [
  /结束|收尾|收束|无法推进|没必要继续|无新增信息|终止/u,
  /close|wrap up|terminate|cannot continue|no progress|no new signal|end interview/i,
] as const;
const HANDOFF_PATTERNS = [
  /换人|交给|转给|请.*面|交接|下一位面试官/u,
  /handoff|hand off|switch interviewer|pass to|next interviewer/i,
] as const;
const RETRY_PATTERNS = [
  /继续追问|继续围绕|保持同一线程|别换话题|拉回主线/u,
  /retry|follow up|same thread|stay on the same thread|same evidence thread/i,
] as const;
const CLARIFY_PATTERNS = [
  /澄清|重述|缩窄|更具体|拆小/u,
  /clarify|restate|narrow|more concrete|break .* down/i,
] as const;
const NEW_ANGLE_PATTERNS = [
  /换个角度|换一种问法|另一种方式|新角度/u,
  /new angle|different angle|alternate prompt|reframe/i,
] as const;

export function normalizeInterviewInternalSignalTag(
  value: string,
): ChatroomInterviewInternalSignalTag | undefined {
  const normalized = value.trim().toLowerCase();
***REMOVED***!normalized) {
    return undefined;
  // Provider-specific function removed

  return SIGNAL_TAG_ALIASES[normalized] ?? SIGNAL_TAG_ALIASES[value.trim()] ?? undefined;
// Provider-specific function removed

export function dedupeInterviewInternalSignalTags(
  tags: readonly ChatroomInterviewInternalSignalTag[],
): ChatroomInterviewInternalSignalTag[] {
***REMOVED***...new Set(tags)];
// Provider-specific function removed

export function parseInterviewInternalSignalTagSpec(
  tagSpec: string | undefined,
): ChatroomInterviewInternalSignalTag[] {
***REMOVED***!tagSpec) {
  ***REMOVED***];
  // Provider-specific function removed

  return dedupeInterviewInternalSignalTags(
    tagSpec
      .split('|')
      .flatMap((chunk) => chunk.split(','))
      .map((chunk) => normalizeInterviewInternalSignalTag(chunk))
      .filter((value): value is ChatroomInterviewInternalSignalTag => Boolean(value)),
  );
// Provider-specific function removed

export function inferInterviewInternalSignalTags(args: {
  kind?: ChatroomInterviewInternalNoteKind;
  content: string;
// Provider-specific function removed): ChatroomInterviewInternalSignalTag[] {
  const haystack = `${args.kind ?? ''// Provider-specific function removed ${args.content// Provider-specific function removed`.trim();
  const tags: ChatroomInterviewInternalSignalTag[] = [];

***REMOVED***args.kind === 'panel_handoff') {
    tags.push('suggest_handoff');
  // Provider-specific function removed

***REMOVED***matchesAnyPattern(haystack, SUPPORTIVE_PATTERNS)) {
    tags.push('supportive_guidance');
  // Provider-specific function removed
***REMOVED***matchesAnyPattern(haystack, RISK_PATTERNS)) {
    tags.push('risk_alert');
  // Provider-specific function removed
***REMOVED***matchesAnyPattern(haystack, CLOSE_PATTERNS)) {
    tags.push('suggest_close');
  // Provider-specific function removed
***REMOVED***matchesAnyPattern(haystack, HANDOFF_PATTERNS)) {
    tags.push('suggest_handoff');
  // Provider-specific function removed
***REMOVED***matchesAnyPattern(haystack, RETRY_PATTERNS)) {
    tags.push('retry_same_thread');
  // Provider-specific function removed
***REMOVED***matchesAnyPattern(haystack, CLARIFY_PATTERNS)) {
    tags.push('retry_with_clarify');
  // Provider-specific function removed
***REMOVED***matchesAnyPattern(haystack, NEW_ANGLE_PATTERNS)) {
    tags.push('retry_new_angle');
  // Provider-specific function removed

  return dedupeInterviewInternalSignalTags(tags);
// Provider-specific function removed

export function resolveInterviewInternalSignalTags(args: {
  kind?: ChatroomInterviewInternalNoteKind;
  content: string;
  explicitTagSpec?: string;
  existingTags?: readonly ChatroomInterviewInternalSignalTag[];
// Provider-specific function removed): ChatroomInterviewInternalSignalTag[] | undefined {
  const tags = dedupeInterviewInternalSignalTags([
    ...(args.existingTags ?? []),
    ...parseInterviewInternalSignalTagSpec(args.explicitTagSpec),
    ...inferInterviewInternalSignalTags({
      kind: args.kind,
      content: args.content,
    // Provider-specific function removed),
  ]);
  return tags.length > 0 ? tags : undefined;
// Provider-specific function removed

export function getInterviewInternalNoteSignalTags(
  note: Readonly<ChatroomInterviewInternalNote>,
): ChatroomInterviewInternalSignalTag[] {
  return (
    resolveInterviewInternalSignalTags({
      kind: note.kind,
      content: note.content,
      existingTags: note.signalTags,
    // Provider-specific function removed) ?? []
  );
// Provider-specific function removed

export function formatInterviewInternalSignalTagLabel(
  tag: ChatroomInterviewInternalSignalTag,
): string {
  switch (tag) {
    case 'supportive_guidance':
      return '友好引导';
    case 'risk_alert':
      return '风险提醒';
    case 'suggest_close':
      return '建议收束';
    case 'suggest_handoff':
      return '建议换人';
    case 'retry_same_thread':
      return '同线程追问';
    case 'retry_with_clarify':
      return '澄清重试';
    case 'retry_new_angle':
      return '换角度重试';
    default:
      return tag;
  // Provider-specific function removed
// Provider-specific function removed

function matchesAnyPattern(value: string, patterns: readonly RegExp[]***REMOVED***
  return patterns.some((pattern) => pattern.test(value));
// Provider-specific function removed
