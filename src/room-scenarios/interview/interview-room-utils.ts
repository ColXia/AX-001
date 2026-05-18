import type { InterviewSummary // Provider-specific function removed from '../../agents/schemas.js';
import type { ChatroomMessage // Provider-specific function removed from '../../room-core/message-types.js';

export type InterviewCandidateTurnKind =
  | 'answer'
  | 'repeated_answer'
  | 'clarify_request'
  | 'repeat_request'
  | 'pause_request'
  | 'refusal_request'
  | 'withdraw_request'
  | 'other';

export interface InterviewAnswerCoverageAssessment {
  isAdequate: boolean;
  missingCategory?:
    | 'quantitative'
    | 'collaboration'
    | 'motivation'
    | 'reasoning'
    | 'example'
    | 'direct_response';
  followUpFocus?: string;
// Provider-specific function removed

export const INTERVIEW_PANEL_DISCUSSION_PREFIX = '【面试官讨论】';
export const INTERVIEW_HANDOFF_PREFIX = '【面试官交接】';
export const MIN_CANDIDATE_REPLIES_FOR_COMPLETION = 6;
const MAX_REPEATED_ANSWER_LOOKBACK = 3;

const INTERVIEW_REPEAT_PATTERNS = [
  /say that again/i,
  /repeat (that|the question)/i,
  /restate (that|the question)/i,
  /can you repeat/i,
  /再说一遍/u,
  /重复一下/u,
  /重述一下/u,
  /重新说一遍/u,
  /没听清/u,
  /没听懂/u,
  /没太听清/u,
  /刚才的问题/u,
];

const INTERVIEW_PAUSE_PATTERNS = [
  /give me a moment/i,
  /one moment/i,
  /hold on/i,
  /let me reconnect/i,
  /connection issue/i,
  /network issue/i,
  /稍等/u,
  /等一下/u,
  /暂停/u,
  /先停/u,
  /稍后/u,
  /一会儿/u,
  /网络/u,
  /断线/u,
  /卡住/u,
  /掉线/u,
  /重新连接/u,
  /先处理/u,
];

const INTERVIEW_WITHDRAW_PATTERNS = [
  /withdraw(?: from)?(?: the)? interview/i,
  /end(?: the)? interview/i,
  /stop(?: the)? interview/i,
  /cancel(?: the)? interview/i,
  /I(?: want to)? stop here/i,
  /I have to leave now/i,
  /先到这里吧/u,
  /今天先到这里吧/u,
  /今天先到这吧/u,
  /今天就到这里吧/u,
  /先结束吧/u,
  /结束面试/u,
  /不继续了/u,
  /我先退出/u,
];

const INTERVIEW_CLARIFY_PATTERNS = [
  /can you clarify/i,
  /could you clarify/i,
  /do you mean/i,
  /are you asking/i,
  /which one do you mean/i,
  /what do you mean by/i,
  /should i focus on/i,
  /具体是指/u,
  /这里的.+是指/u,
  /这里说的.+是/u,
  /能具体/u,
  /可以具体/u,
  /能否具体/u,
  /展开一下/u,
  /澄清一下/u,
  /确认一下/u,
  /是让我/u,
  /是要我/u,
  /你说的.+是什么意思/u,
  /从.+角度/u,
  /更想听/u,
  /更偏向/u,
];

const INTERVIEW_REFUSAL_PATTERNS = [
  /prefer not to answer/i,
  /i'?d rather not answer/i,
  /would rather not answer/i,
  /don't want to answer/i,
  /do not want to answer/i,
  /skip this question/i,
  /can't answer that/i,
  /cannot answer that/i,
  /can't share that/i,
  /cannot share that/i,
  /not comfortable answering/i,
  /that's confidential/i,
  /under nda/i,
  /不方便回答/u,
  /不太方便说/u,
  /这个不能说/u,
  /这个不能回答/u,
  /先跳过这个问题/u,
  /跳过这个问题/u,
  /我不想回答/u,
  /不方便透露/u,
  /不能透露/u,
  /涉及保密/u,
  /保密协议/u,
];

const INTERVIEW_ANSWER_PATTERNS = [
  /我负责/u,
  /我做过/u,
  /我会先/u,
  /我通常/u,
  /我当时/u,
  /我后来/u,
  /我们/u,
  /项目/u,
  /方案/u,
  /实现/u,
  /排查/u,
  /结果/u,
  /指标/u,
  /数据/u,
  /\d+/u,
];

const INTERVIEW_CANDIDATE_QUESTION_PATTERNS = [
  /我想了解/u,
  /我想问/u,
  /我比较想知道/u,
  /想确认一下/u,
  /请问/u,
];

const INTERVIEW_WEAK_ANSWER_PATTERNS = [
  /I don't know/i,
  /I'm not sure/i,
  /not sure/i,
  /I haven't done that/i,
  /I've never done that/i,
  /no experience with/i,
  /不知道/u,
  /不太清楚/u,
  /不确定/u,
  /没做过/u,
  /没有做过/u,
  /没接触过/u,
  /没有经验/u,
  /还行吧|凑合|差不多|一般般|也就那样|就这样/i,
  /whatever|doesn't matter|doesn't matter to me|any is fine|都可以|无所谓/i,
];

const INTERVIEW_EVASIVE_ANSWER_PATTERNS = [
  /anyway|something like that|whatever works|just get it working|details? (?:are|is) fuzzy|don\'t really remember|used the default config|didn\'t really go deep|mainly to get it working/i,
  /\u53cd\u6b63|\u5dee\u4e0d\u591a|\u5927\u6982\u5c31\u662f|\u5177\u4f53.*\u8bb0\u4e0d\u6e05|\u8bb0\u4e0d\u592a\u6e05|\u6ca1\u4ec0\u4e48\u7279\u522b|\u4e3b\u8981\u770b\u9700\u6c42|\u9ed8\u8ba4\u914d\u7f6e|\u6ca1\u592a\u6df1\u5165|\u6ca1\u7ec6\u60f3|\u5148\u628a\u529f\u80fd\u8dd1\u901a|\u4e00\u822c\u5c31\u662f\u770b\u770b\u65e5\u5fd7|\u901a\u5e38\u4e5f\u5c31\u662f.*\u57fa\u7840/u,
  /也许|可能|大概|应该吧|说不定|估计|或许/i,
  /这个.*问题|good question|it depends|hard to say|很难说|不好说|看情况/i,
] as const;

const INTERVIEW_SHORT_NON_SUBSTANTIVE_PATTERNS = [
  /^[。、，,\s]{0,10// Provider-specific function removed$/,
  /^(?:嗯|哦|啊|呃|ok|okay|yeah|yes|no|对|是|行|好吧){1,3// Provider-specific function removed[。\s]*$/i,
  /^(?:没什么|没啥|没啥特别|没啥大不了的){1,2// Provider-specific function removed/i,
] as const;

const INTERVIEW_QUANTITATIVE_PROMPT_PATTERNS = [
  /多少/u,
  /百分比/u,
  /占比/u,
  /量级/u,
  /指标/u,
  /数据/u,
  /数值/u,
  /毫秒/u,
  /秒级/u,
  /分钟级/u,
  /p\d+/i,
  /\brt\b/i,
  /\bqps\b/i,
  /成功率/u,
  /失败率/u,
  /重试率/u,
  /多少个/u,
  /多少笔/u,
  /几笔/u,
  /几单/u,
  /\bsku\b/i,
  /\bauc\b/i,
  /\bndcg\b/i,
  /\ba\/b\b/i,
];

const INTERVIEW_COLLABORATION_PROMPT_PATTERNS = [
  /跨团队/u,
  /对齐/u,
  /协作/u,
  /协商/u,
  /协调/u,
  /推动/u,
  /库存团队/u,
  /支付团队/u,
  /客服/u,
  /owner/u,
  /谁.*定/u,
  /如果.*做不到/u,
  /阻力/u,
];

const INTERVIEW_COLLABORATION_RESISTANCE_PROMPT_PATTERNS = [
  /如果.*不同意/u,
  /如果.*做不到/u,
  /阻力/u,
  /反对/u,
  /分歧/u,
  /怎么处理/u,
];

const INTERVIEW_MOTIVATION_PROMPT_PATTERNS = [
  /驱动力/u,
  /为什么看新机会/u,
  /发展空间/u,
  /看重/u,
  /特别看重/u,
  /目标岗位/u,
  /想问我们/u,
  /团队规模/u,
  /技术栈方向/u,
  /业务阶段/u,
];

const INTERVIEW_REASONING_PROMPT_PATTERNS = [
  /为什么/u,
  /如何/u,
  /怎么/u,
  /取舍/u,
  /权衡/u,
  /评估/u,
  /判断/u,
  /边界/u,
  /说服/u,
  /处理/u,
  /决策/u,
];

const INTERVIEW_EXAMPLE_PROMPT_PATTERNS = [
  /举例/u,
  /案例/u,
  /故障/u,
  /表现/u,
  /经历/u,
  /发生/u,
  /场景/u,
];

const INTERVIEW_COLLABORATION_ANSWER_PATTERNS = [
  /沟通/u,
  /对齐/u,
  /协调/u,
  /协商/u,
  /拉齐/u,
  /复盘/u,
  /会议/u,
  /owner/u,
  /库存团队/u,
  /支付团队/u,
  /客服/u,
  /业务方/u,
  /达成/u,
  /共识/u,
  /和.+团队/u,
];

const INTERVIEW_COLLABORATION_RESISTANCE_ANSWER_PATTERNS = [
  /如果/u,
  /不同意/u,
  /做不到/u,
  /阻力/u,
  /分歧/u,
  /分阶段/u,
  /备选/u,
  /兜底/u,
  /让步/u,
  /协商/u,
  /拉齐/u,
  /再推进/u,
];

const INTERVIEW_MOTIVATION_ANSWER_PATTERNS = [
  /希望/u,
  /想做/u,
  /看重/u,
  /关心/u,
  /驱动力/u,
  /机会/u,
  /平台化/u,
  /owner/u,
  /团队/u,
  /技术栈/u,
  /业务阶段/u,
];

const INTERVIEW_REASONING_ANSWER_PATTERNS = [
  /因为/u,
  /所以/u,
  /因此/u,
  /先/u,
  /然后/u,
  /为了/u,
  /权衡/u,
  /取舍/u,
  /决定/u,
  /判断/u,
  /说服/u,
  /推动/u,
  /处理/u,
  /评估/u,
];

const INTERVIEW_EXAMPLE_ANSWER_PATTERNS = [
  /有一次/u,
  /当时/u,
  /后来/u,
  /那次/u,
  /出现/u,
  /导致/u,
  /最后/u,
  /复盘/u,
  /补偿/u,
];

const INTERVIEW_INVITE_CANDIDATE_QUESTION_PATTERNS = [
  /还有什么想问/u,
  /有什么想问/u,
  /有什么问题/u,
  /你还有问题吗/u,
  /你想了解什么/u,
  /想问我们/u,
  /都可以提出来/u,
  /一起提出来/u,
  /可以反问/u,
  /反问/u,
];

const INTERVIEW_NO_QUESTION_PATTERNS = [
  /no questions?/i,
  /nothing else/i,
  /that's all/i,
  /all good/i,
  /没有问题了?/u,
  /没什么想问/u,
  /暂时没有/u,
  /先没有/u,
  /没有了/u,
  /不用了谢谢/u,
];

export function isInterviewMetaContent(value: string***REMOVED***
  const trimmed = value.trim();
  return trimmed.startsWith(INTERVIEW_HANDOFF_PREFIX) ||
    trimmed.startsWith(INTERVIEW_PANEL_DISCUSSION_PREFIX);
// Provider-specific function removed

export function findLatestInterviewerPrompt(
  messages: readonly ChatroomMessage[],
): ChatroomMessage | undefined {
  return findLatestInterviewerPromptBeforeMessage(messages);
// Provider-specific function removed

export function findLatestInterviewerPromptBeforeMessage(
  messages: readonly ChatroomMessage[],
  messageId?: string,
): ChatroomMessage | undefined {
  const startIndex = messageId
    ? messages.findIndex((message) => message.id === messageId) - 1
    : messages.length - 1;

  for (let index = startIndex; index >= 0; index -= 1) {
    const message = messages[index];
  ***REMOVED***message?.role === 'agent' && !isInterviewMetaContent(message.content)) {
      return message;
    // Provider-specific function removed
  // Provider-specific function removed

  return undefined;
// Provider-specific function removed

export function classifyInterviewCandidateTurnMessage(
  message: Pick<ChatroomMessage, 'role' | 'round' | 'content'> | undefined,
  previousPrompt?: Pick<ChatroomMessage, 'content'>,
  previousCandidateAnswers?: readonly Pick<ChatroomMessage, 'role' | 'content'>[],
): InterviewCandidateTurnKind | undefined {
***REMOVED***!message || message.role !== 'user' || message.round <= 0) {
    return undefined;
  // Provider-specific function removed

  const trimmed = message.content.trim();
***REMOVED***!trimmed) {
    return 'other';
  // Provider-specific function removed

  const looksQuestion = /[?\uFF1F]/u.test(trimmed);
  const hasAnswerSignal = matchesAnyPattern(trimmed, INTERVIEW_ANSWER_PATTERNS);
  const hasWeakAnswerSignal = hasInterviewWeakAnswerSignal(trimmed);

***REMOVED***looksLikeInterviewWithdrawRequest(trimmed)) {
    return 'withdraw_request';
  // Provider-specific function removed

***REMOVED***looksLikeInterviewPauseRequest(trimmed, hasAnswerSignal || hasWeakAnswerSignal)) {
    return 'pause_request';
  // Provider-specific function removed

***REMOVED***matchesAnyPattern(trimmed, INTERVIEW_REPEAT_PATTERNS)) {
    return 'repeat_request';
  // Provider-specific function removed

***REMOVED***
    invitesCandidateQuestion(previousPrompt?.content) &&
    (hasInterviewNoQuestionSignal(trimmed) ||
      /[?\uFF1F]/u.test(trimmed) ||
      matchesAnyPattern(trimmed, INTERVIEW_CANDIDATE_QUESTION_PATTERNS))
***REMOVED***
    return 'answer';
  // Provider-specific function removed

***REMOVED***
    matchesAnyPattern(trimmed, INTERVIEW_CLARIFY_PATTERNS) &&
    (!hasAnswerSignal || looksQuestion || trimmed.length <= 120)
***REMOVED***
    return 'clarify_request';
  // Provider-specific function removed

***REMOVED***looksQuestion && !hasAnswerSignal && trimmed.length <= 80) {
    return 'clarify_request';
  // Provider-specific function removed

***REMOVED***matchesAnyPattern(trimmed, INTERVIEW_REFUSAL_PATTERNS)) {
    return 'refusal_request';
  // Provider-specific function removed

***REMOVED***
    previousCandidateAnswers &&
    detectRepeatedCandidateAnswer(trimmed, previousCandidateAnswers)
***REMOVED***
    return 'repeated_answer';
  // Provider-specific function removed

***REMOVED***
    hasAnswerSignal ||
    hasWeakAnswerSignal ||
    trimmed.length >= 32 ||
    /[\uFF0C\u3002\uFF1B\uFF1A]/u.test(trimmed)
***REMOVED***
    return 'answer';
  // Provider-specific function removed

  return 'other';
// Provider-specific function removed

export function detectRepeatedCandidateAnswer(
  currentAnswer: string,
  previousCandidateAnswers: readonly Pick<ChatroomMessage, 'role' | 'content'>[],
***REMOVED***
  const normalizedCurrent = normalizeAnswerForComparison(currentAnswer);
***REMOVED***!normalizedCurrent || normalizedCurrent.length < 16) {
    return false;
  // Provider-specific function removed

  const recentAnswers = previousCandidateAnswers
    .filter((message) => message.role === 'user')
    .slice(-MAX_REPEATED_ANSWER_LOOKBACK);

  let consecutiveRepeats = 0;
  for (let index = recentAnswers.length - 1; index >= 0; index -= 1) {
    const previousAnswer = recentAnswers[index];
  ***REMOVED***!previousAnswer) {
      break;
    // Provider-specific function removed
    const normalizedPrevious = normalizeAnswerForComparison(previousAnswer.content);
  ***REMOVED***normalizedPrevious === normalizedCurrent) {
      consecutiveRepeats += 1;
    // Provider-specific function removed else {
      break;
    // Provider-specific function removed
  // Provider-specific function removed

  return consecutiveRepeats >= 1;
// Provider-specific function removed

function normalizeAnswerForComparison(value: string): string {
  return value
    .replace(/\s+/gu, ' ')
    .replace(/[，。；：！？、""''（）【】《》]/gu, '')
    .trim()
    .toLowerCase();
// Provider-specific function removed

export function looksLikeCorruptedInterviewText(value: string***REMOVED***
  const trimmed = value.trim();
***REMOVED***!trimmed) {
    return false;
  // Provider-specific function removed

***REMOVED***trimmed.includes('\uFFFD')) {
    return true;
  // Provider-specific function removed

  const placeholderMatches = trimmed.match(/[?？]/gu) ?? [];
***REMOVED***placeholderMatches.length === 0) {
    return false;
  // Provider-specific function removed

  const placeholderRatio = placeholderMatches.length / trimmed.length;
***REMOVED***placeholderRatio >= 0.35 && placeholderMatches.length >= 8) {
    return true;
  // Provider-specific function removed

  const repeatedPlaceholderCount = (trimmed.match(/[?？]{4,// Provider-specific function removed/gu) ?? []).length;
***REMOVED***repeatedPlaceholderCount === 0) {
    return false;
  // Provider-specific function removed

  const readableTokenCount = (trimmed.match(/[A-Za-z0-9\u4E00-\u9FFF]/gu) ?? []).length;
  return placeholderMatches.length >= 6 && readableTokenCount <= placeholderMatches.length * 2;
// Provider-specific function removed

function looksLikeInterviewPauseRequest(
  trimmed: string,
  hasAnswerSignal: boolean,
***REMOVED***
***REMOVED***!matchesAnyPattern(trimmed, INTERVIEW_PAUSE_PATTERNS)) {
    return false;
  // Provider-specific function removed

  // Long technical answers can mention pause-like words as part of a design choice.
***REMOVED***hasAnswerSignal && trimmed.length > 48) {
    return false;
  // Provider-specific function removed

  return true;
// Provider-specific function removed

export function getLatestInterviewCandidateTurnState(
  messages: readonly ChatroomMessage[],
): {
  message?: ChatroomMessage;
  kind?: InterviewCandidateTurnKind;
  previousPrompt?: ChatroomMessage;
// Provider-specific function removed {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
  ***REMOVED***!message || message.role !== 'user' || message.round <= 0) {
      continue;
    // Provider-specific function removed

    const previousPrompt = findLatestInterviewerPromptBeforeMessage(messages, message.id);
    return {
      message,
      kind: classifyInterviewCandidateTurnMessage(message, previousPrompt, messages.slice(0, index)),
      previousPrompt,
    // Provider-specific function removed;
  // Provider-specific function removed

  return {// Provider-specific function removed;
// Provider-specific function removed

export function findLatestInterviewCandidateAnswer(
  messages: readonly ChatroomMessage[],
): ChatroomMessage | undefined {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
  ***REMOVED***!message || message.role !== 'user' || message.round <= 0) {
      continue;
    // Provider-specific function removed

    const previousPrompt = findLatestInterviewerPromptBeforeMessage(messages, message.id);
  ***REMOVED***classifyInterviewCandidateTurnMessage(message, previousPrompt, messages.slice(0, index)) === 'answer') {
      return message;
    // Provider-specific function removed
  // Provider-specific function removed

  return undefined;
// Provider-specific function removed

export function countInterviewCandidateReplies(
  messages: readonly ChatroomMessage[],
): number {
  let count = 0;

  for (let index = 0; index < messages.length; index += 1) {
    const message = messages[index];
  ***REMOVED***!message || message.role !== 'user' || message.round <= 0) {
      continue;
    // Provider-specific function removed

    const previousPrompt = findLatestInterviewerPromptBeforeMessage(messages, message.id);
  ***REMOVED***classifyInterviewCandidateTurnMessage(message, previousPrompt, messages.slice(0, index)) === 'answer') {
      count += 1;
    // Provider-specific function removed
  // Provider-specific function removed

  return count;
// Provider-specific function removed

export function countConsecutiveRepeatedCandidateAnswers(
  messages: readonly ChatroomMessage[],
): number {
  let count = 0;

  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
  ***REMOVED***!message || message.role !== 'user' || message.round <= 0) {
      continue;
    // Provider-specific function removed

    const previousPrompt = findLatestInterviewerPromptBeforeMessage(messages, message.id);
  ***REMOVED***
      classifyInterviewCandidateTurnMessage(message, previousPrompt, messages.slice(0, index)) !==
      'repeated_answer'
  ***REMOVED***
      break;
    // Provider-specific function removed

    count += 1;
  // Provider-specific function removed

  return count;
// Provider-specific function removed

export function countConsecutiveCandidateTurnsByKind(
  messages: readonly ChatroomMessage[],
  kinds: readonly InterviewCandidateTurnKind[],
): number {
  const accepted = new Set<InterviewCandidateTurnKind>(kinds);
  let count = 0;

  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
  ***REMOVED***!message || message.role !== 'user' || message.round <= 0) {
      continue;
    // Provider-specific function removed

    const previousPrompt = findLatestInterviewerPromptBeforeMessage(messages, message.id);
    const kind = classifyInterviewCandidateTurnMessage(
      message,
      previousPrompt,
      messages.slice(0, index),
    );
  ***REMOVED***!kind || !accepted.has(kind)) {
      break;
    // Provider-specific function removed

    count += 1;
  // Provider-specific function removed

  return count;
// Provider-specific function removed

export function countConsecutiveRefusalCandidateTurns(
  messages: readonly ChatroomMessage[],
): number {
  return countConsecutiveCandidateTurnsByKind(messages, ['refusal_request']);
// Provider-specific function removed

export function countConsecutiveNonResponsiveCandidateTurns(
  messages: readonly ChatroomMessage[],
): number {
  return countConsecutiveCandidateTurnsByKind(messages, ['other']);
// Provider-specific function removed

export function countConsecutiveEvasiveCandidateAnswers(
  messages: readonly ChatroomMessage[],
  options: {
    speakerId?: string;
  // Provider-specific function removed = {// Provider-specific function removed,
): number {
  let count = 0;

  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
  ***REMOVED***!message || message.role !== 'user' || message.round <= 0) {
      continue;
    // Provider-specific function removed

    const previousPrompt = findLatestInterviewerPromptBeforeMessage(messages, message.id);
  ***REMOVED***!previousPrompt) {
      break;
    // Provider-specific function removed

  ***REMOVED***options.speakerId && previousPrompt.authorId !== options.speakerId) {
      break;
    // Provider-specific function removed

  ***REMOVED***
      classifyInterviewCandidateTurnMessage(message, previousPrompt, messages.slice(0, index)) !==
      'answer'
  ***REMOVED***
      break;
    // Provider-specific function removed

  ***REMOVED***!hasInterviewEvasiveAnswerSignal(message.content)) {
      break;
    // Provider-specific function removed

    count += 1;
  // Provider-specific function removed

  return count;
// Provider-specific function removed

export function countConsecutiveInadequateCandidateAnswers(
  messages: readonly ChatroomMessage[],
  options: {
    speakerId?: string;
  // Provider-specific function removed = {// Provider-specific function removed,
): number {
  let count = 0;

  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
  ***REMOVED***!message || message.role !== 'user' || message.round <= 0) {
      continue;
    // Provider-specific function removed

    const previousPrompt = findLatestInterviewerPromptBeforeMessage(messages, message.id);
  ***REMOVED***!previousPrompt) {
      break;
    // Provider-specific function removed

  ***REMOVED***options.speakerId && previousPrompt.authorId !== options.speakerId) {
      break;
    // Provider-specific function removed

  ***REMOVED***
      classifyInterviewCandidateTurnMessage(message, previousPrompt, messages.slice(0, index)) !==
      'answer'
  ***REMOVED***
      break;
    // Provider-specific function removed

    const coverage = assessInterviewAnswerCoverage({
      candidateMessage: message,
      previousPrompt,
    // Provider-specific function removed);
  ***REMOVED***!coverage || coverage.isAdequate) {
      break;
    // Provider-specific function removed

    count += 1;
  // Provider-specific function removed

  return count;
// Provider-specific function removed

export function assessInterviewAnswerCoverage(args: {
  candidateMessage: Pick<ChatroomMessage, 'content' | 'role' | 'round'> | undefined;
  previousPrompt: Pick<ChatroomMessage, 'content'> | undefined;
// Provider-specific function removed): InterviewAnswerCoverageAssessment | undefined {
***REMOVED***!args.candidateMessage || !args.previousPrompt) {
    return undefined;
  // Provider-specific function removed

  const turnKind = classifyInterviewCandidateTurnMessage(
    args.candidateMessage,
    args.previousPrompt,
  );
***REMOVED***turnKind !== 'answer') {
    return {
      isAdequate: false,
      missingCategory: 'direct_response',
      followUpFocus: '请先直接回应上一问的核心问题，再继续展开。',
    // Provider-specific function removed;
  // Provider-specific function removed

  const prompt = args.previousPrompt.content.trim();
  const answer = args.candidateMessage.content.trim();
***REMOVED***!prompt || !answer) {
    return {
      isAdequate: false,
      missingCategory: 'direct_response',
      followUpFocus: '请先直接回答上一问，不要绕开问题。',
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***looksLikeCorruptedInterviewText(answer)) {
    return {
      isAdequate: false,
      missingCategory: 'direct_response',
      followUpFocus: '检测到回答可能存在编码或转录损坏，请重新用清晰中文完整回答上一问。',
    // Provider-specific function removed;
  // Provider-specific function removed

  const needsQuantitative = matchesAnyPattern(prompt, INTERVIEW_QUANTITATIVE_PROMPT_PATTERNS);
  const needsCollaboration = matchesAnyPattern(prompt, INTERVIEW_COLLABORATION_PROMPT_PATTERNS);
  const needsMotivation = matchesAnyPattern(prompt, INTERVIEW_MOTIVATION_PROMPT_PATTERNS);
  const needsExample = matchesAnyPattern(prompt, INTERVIEW_EXAMPLE_PROMPT_PATTERNS);
  const needsReasoning =
    !needsCollaboration && matchesAnyPattern(prompt, INTERVIEW_REASONING_PROMPT_PATTERNS);
  const invitesQuestion = invitesCandidateQuestion(prompt);
  const weakAnswer = hasInterviewWeakAnswerSignal(answer);

***REMOVED***
    invitesQuestion &&
    !needsQuantitative &&
    !needsCollaboration &&
    !needsMotivation &&
    !needsExample &&
    !needsReasoning
***REMOVED***
    return { isAdequate: true // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***
    invitesQuestion &&
    hasInterviewNoQuestionSignal(answer) &&
    !needsQuantitative &&
    !needsCollaboration &&
    !needsExample &&
    !needsReasoning
***REMOVED***
    return { isAdequate: true // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***weakAnswer && !invitesQuestion) {
    return {
      isAdequate: false,
      missingCategory: 'direct_response',
      followUpFocus: '如果这部分你确实没有直接经验，请先明确边界，再补充你会如何分析、取舍或推进。',
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***needsQuantitative && !hasQuantitativeAnswerSignal(answer)) {
    return {
      isAdequate: false,
      missingCategory: 'quantitative',
      followUpFocus: '先直接补齐上一问要求的数字、比例或量化结果，不要换新话题。',
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***needsCollaboration && !matchesAnyPattern(answer, INTERVIEW_COLLABORATION_ANSWER_PATTERNS)) {
    return {
      isAdequate: false,
      missingCategory: 'collaboration',
      followUpFocus: '先补跨团队对齐、协商阻力和 owner 推进细节，说明你具体怎么推动事情落地。',
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***
    needsCollaboration &&
    !hasInterviewTeamAlignmentCoverage({
      prompt,
      answer,
    // Provider-specific function removed)
***REMOVED***
    return {
      isAdequate: false,
      missingCategory: 'collaboration',
      followUpFocus: '上一问点名了具体协作对象或阻力处理方式，请补清你和哪些团队对齐、有人反对时你怎么推进。',
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***needsMotivation && !matchesAnyPattern(answer, INTERVIEW_MOTIVATION_ANSWER_PATTERNS)) {
    return {
      isAdequate: false,
      missingCategory: 'motivation',
      followUpFocus: '先直接回答你的求职驱动力、岗位偏好或想了解团队的重点，不要回到前面的技术话题。',
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***
    needsExample &&
    !matchesAnyPattern(answer, INTERVIEW_EXAMPLE_ANSWER_PATTERNS) &&
    answer.length < 80
***REMOVED***
    return {
      isAdequate: false,
      missingCategory: 'example',
      followUpFocus: '先补一个具体经历、故障或处理场景，把过程说具体。',
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***
    needsReasoning &&
    !matchesAnyPattern(answer, INTERVIEW_REASONING_ANSWER_PATTERNS) &&
    answer.length < 80
***REMOVED***
    return {
      isAdequate: false,
      missingCategory: 'reasoning',
      followUpFocus: '先解释你的判断依据、取舍逻辑和具体处理方式，再继续展开。',
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***
    invitesQuestion &&
    !(
      hasInterviewNoQuestionSignal(answer) ||
      /[?\uFF1F]/u.test(answer) ||
      matchesAnyPattern(answer, INTERVIEW_CANDIDATE_QUESTION_PATTERNS)
    )
***REMOVED***
    return {
      isAdequate: false,
      missingCategory: 'direct_response',
      followUpFocus: '如果你有想问面试官的问题，请直接提出来；如果没有，也请明确说明。',
    // Provider-specific function removed;
  // Provider-specific function removed

  return { isAdequate: true // Provider-specific function removed;
// Provider-specific function removed

export function assessLatestInterviewCandidateAnswerCoverage(
  messages: readonly ChatroomMessage[],
): InterviewAnswerCoverageAssessment | undefined {
  const latestTurn = getLatestInterviewCandidateTurnState(messages);
***REMOVED***!latestTurn.message || latestTurn.kind !== 'answer') {
    return undefined;
  // Provider-specific function removed

  return assessInterviewAnswerCoverage({
    candidateMessage: latestTurn.message,
    previousPrompt: latestTurn.previousPrompt,
  // Provider-specific function removed);
// Provider-specific function removed

export function inferInterviewStatusFromMessages(
  messages: readonly ChatroomMessage[],
): InterviewSummary['interviewStatus'] {
  const candidateReplyCount = countInterviewCandidateReplies(messages);
***REMOVED***candidateReplyCount === 0) {
    return 'opening';
  // Provider-specific function removed

***REMOVED***candidateReplyCount < MIN_CANDIDATE_REPLIES_FOR_COMPLETION) {
    return 'in_progress';
  // Provider-specific function removed

  const latestConversationMessage = findLatestConversationMessage(messages);
***REMOVED***latestConversationMessage?.role === 'agent') {
    return 'in_progress';
  // Provider-specific function removed

  const latestTurn = getLatestInterviewCandidateTurnState(messages);
***REMOVED***latestTurn.message?.id) {
    return latestTurn.kind === 'answer' || latestTurn.kind === 'withdraw_request'
      ? 'complete'
      : 'in_progress';
  // Provider-specific function removed

  return findLatestInterviewerPrompt(messages) ? 'in_progress' : 'complete';
// Provider-specific function removed

export function inferInterviewStageFromMessages(messages: readonly ChatroomMessage[]): string {
  const candidateReplyCount = countInterviewCandidateReplies(messages);

  switch (candidateReplyCount) {
    case 0:
      return '开场自我介绍';
    case 1:
      return '技术/专业深挖';
    case 2:
    case 3:
      return '补充追问';
    case 4:
    case 5:
      return '经理面与收尾';
    default:
      return inferInterviewStatusFromMessages(messages) === 'complete'
        ? '面试完成'
        : '面试进行中';
  // Provider-specific function removed
// Provider-specific function removed

function invitesCandidateQuestion(value: string | undefined***REMOVED***
  return Boolean(value && matchesAnyPattern(value, INTERVIEW_INVITE_CANDIDATE_QUESTION_PATTERNS));
// Provider-specific function removed

function matchesAnyPattern(value: string, patterns: readonly RegExp[]***REMOVED***
  return patterns.some((pattern) => pattern.test(value));
// Provider-specific function removed

function hasQuantitativeAnswerSignal(value: string***REMOVED***
  const numericMatches = value.match(/\d+(?:\.\d+)?/gu) ?? [];
  return numericMatches.length >= 2 ||
    /(?:\d+(?:\.\d+)?)\s*(?:ms|秒|毫秒|分钟|小时|%|个百分点|个|笔|单|qps)/iu.test(value) ||
    /\bp\d+\b/i.test(value) ||
    /\bsku\b/i.test(value) ||
    /秒级|分钟级|毫秒级/u.test(value);
// Provider-specific function removed

function hasInterviewTeamAlignmentCoverage(args: {
  prompt: string;
  answer: string;
// Provider-specific function removed***REMOVED***
  const promptTeams = extractInterviewCoordinationEntities(args.prompt);
  const answerTeams = extractInterviewCoordinationEntities(args.answer);
  const mentionsGenericCrossTeam = /跨团队|相关团队|上下游|多方/u.test(args.answer);
  const promptNeedsSpecificTeams = promptTeams.some((team) => team !== 'business');
***REMOVED***
    promptNeedsSpecificTeams &&
    !promptTeams.some((team) => answerTeams.includes(team)) &&
    !mentionsGenericCrossTeam
***REMOVED***
    return false;
  // Provider-specific function removed

***REMOVED***
    matchesAnyPattern(args.prompt, INTERVIEW_COLLABORATION_RESISTANCE_PROMPT_PATTERNS) &&
    !matchesAnyPattern(args.answer, INTERVIEW_COLLABORATION_RESISTANCE_ANSWER_PATTERNS)
***REMOVED***
    return false;
  // Provider-specific function removed

  return true;
// Provider-specific function removed

function looksLikeInterviewWithdrawRequest(trimmed: string***REMOVED***
  return matchesAnyPattern(trimmed, INTERVIEW_WITHDRAW_PATTERNS);
// Provider-specific function removed

export function hasInterviewWeakAnswerSignal(value: string***REMOVED***
  return matchesAnyPattern(value, INTERVIEW_WEAK_ANSWER_PATTERNS);
// Provider-specific function removed

export function hasInterviewEvasiveAnswerSignal(value: string***REMOVED***
  return matchesAnyPattern(value, INTERVIEW_EVASIVE_ANSWER_PATTERNS);
// Provider-specific function removed

export function hasInterviewShortNonSubstantiveSignal(value: string***REMOVED***
  return matchesAnyPattern(value, INTERVIEW_SHORT_NON_SUBSTANTIVE_PATTERNS);
// Provider-specific function removed

function hasInterviewNoQuestionSignal(value: string***REMOVED***
  return matchesAnyPattern(value, INTERVIEW_NO_QUESTION_PATTERNS);
// Provider-specific function removed

function extractInterviewCoordinationEntities(value: string): string[] {
  const entities: string[] = [];
***REMOVED***/库存团队|库存侧|库存/u.test(value)) {
    entities.push('inventory');
  // Provider-specific function removed
***REMOVED***/支付团队|支付侧|支付/u.test(value)) {
    entities.push('payment');
  // Provider-specific function removed
***REMOVED***/客服|客服侧/u.test(value)) {
    entities.push('customer_support');
  // Provider-specific function removed
***REMOVED***/业务方|业务侧|业务团队/u.test(value)) {
    entities.push('business');
  // Provider-specific function removed
  return entities;
// Provider-specific function removed

function findLatestConversationMessage(
  messages: readonly ChatroomMessage[],
): ChatroomMessage | undefined {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
  ***REMOVED***message?.role === 'user' || message?.role === 'agent') {
      return message;
    // Provider-specific function removed
  // Provider-specific function removed

  return undefined;
// Provider-specific function removed
