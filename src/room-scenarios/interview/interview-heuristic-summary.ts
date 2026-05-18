import type { InterviewSummary, InterviewQuestionLog, InterviewFeedbackItem // Provider-specific function removed from '../../agents/schemas.js';
import type { ChatroomMessage // Provider-specific function removed from '../../room-core/message-types.js';
import type { ChatroomRecorderState // Provider-specific function removed from '../../room-governance/room-recorder-types.js';
import type { ChatroomState // Provider-specific function removed from '../../room-runtime/room-state.js';
import type {
  HeuristicInterviewGapCategory,
  HeuristicInterviewQuestionReview,
  HeuristicInterviewSignalCounts,
// Provider-specific function removed from './interview-summary-types.js';
import {
  HEURISTIC_INTERVIEW_QUANTITATIVE_PATTERNS,
  HEURISTIC_INTERVIEW_COLLABORATION_PATTERNS,
  HEURISTIC_INTERVIEW_REASONING_PATTERNS,
  HEURISTIC_INTERVIEW_EXAMPLE_PATTERNS,
  HEURISTIC_INTERVIEW_MOTIVATION_PATTERNS,
  HEURISTIC_INTERVIEW_OWNERSHIP_PATTERNS,
  HEURISTIC_INTERVIEW_REPAIR_PROMPT_PATTERNS,
// Provider-specific function removed from './interview-summary-types.js';
import type { InterviewTrack // Provider-specific function removed from './interview-track-types.js';
import type { InterviewAnswerCoverageAssessment, InterviewCandidateTurnKind // Provider-specific function removed from './interview-room-utils.js';
import {
  isInterviewMetaContent,
  classifyInterviewCandidateTurnMessage,
  assessInterviewAnswerCoverage,
  looksLikeCorruptedInterviewText,
// Provider-specific function removed from './interview-room-utils.js';

export function buildHeuristicInterviewFallbackSummary(args: {
  state: Readonly<ChatroomState>;
  status: InterviewSummary['interviewStatus'];
  stageLabel: string;
  track: InterviewTrack;
  latestQuestion: ChatroomMessage | undefined;
  candidateReplyCount: number;
  waitingForCandidate: boolean;
// Provider-specific function removed): Omit<InterviewSummary, 'interviewStatus' | 'currentStage'> {
  const reviews = collectInterviewQuestionReviews({
    messages: args.state.messages,
    track: args.track,
  // Provider-specific function removed);
  const recorderSignals = collectInterviewRecorderSignals(args.state.recorderState);
  const recorderConcerns =
    args.status === 'complete' ? [] : recorderSignals.concerns;
  const recorderNextSteps =
    args.status === 'complete' ? [] : recorderSignals.nextSteps;
  const gapCounts = countHeuristicInterviewGapCategories(reviews);
  const signalCounts = countHeuristicInterviewSignals(reviews);
  const adequateAnswerCount = reviews.filter((item) => item.coverage?.isAdequate).length;
  const unansweredQuestionCount = reviews.filter((item) => !item.answer).length;
  const overallScore = computeHeuristicInterviewOverallScore({
    status: args.status,
    candidateReplyCount: args.candidateReplyCount,
    adequateAnswerCount,
    unansweredQuestionCount,
    gapCounts,
    signalCounts,
  // Provider-specific function removed);
  const strengths = buildHeuristicInterviewStrengths({
    adequateAnswerCount,
    candidateReplyCount: args.candidateReplyCount,
    recorderHighlights: recorderSignals.highlights,
    signalCounts,
  // Provider-specific function removed);
  const weaknesses = buildHeuristicInterviewWeaknesses({
    gapCounts,
    recorderConcerns,
    waitingForCandidate: args.waitingForCandidate,
    latestQuestion: args.latestQuestion,
  // Provider-specific function removed);
  const missedQuestions = buildHeuristicInterviewMissedQuestions({
    reviews,
    latestQuestion: args.latestQuestion,
    waitingForCandidate: args.waitingForCandidate,
  // Provider-specific function removed);
  const suggestedAnswerImprovements = buildHeuristicInterviewImprovements({
    gapCounts,
    recorderNextSteps,
    waitingForCandidate: args.waitingForCandidate,
  // Provider-specific function removed);
  const followUpQuestions = buildHeuristicInterviewFollowUpQuestions({
    reviews,
    latestQuestion: args.latestQuestion,
    waitingForCandidate: args.waitingForCandidate,
  // Provider-specific function removed);
  const recommendedNextActions = buildHeuristicInterviewNextActions({
    status: args.status,
    waitingForCandidate: args.waitingForCandidate,
    overallScore,
    gapCounts,
    recorderNextSteps,
  // Provider-specific function removed);
  const questionLog = buildHeuristicInterviewQuestionLog(reviews);
  const feedbackItems = buildHeuristicInterviewFeedbackItems(reviews);
  const scoringGuide = resolveInterviewScoringGuide(args.state);
  const confidence = computeHeuristicInterviewConfidence({
    candidateReplyCount: args.candidateReplyCount,
    adequateAnswerCount,
    reviewCount: reviews.length,
    unansweredQuestionCount,
  // Provider-specific function removed);
  const interviewReadiness = resolveHeuristicInterviewReadiness({
    status: args.status,
    overallScore,
    adequateAnswerCount,
    reviewCount: reviews.length,
    gapCounts,
  // Provider-specific function removed);
  const competencyScores = buildHeuristicInterviewCompetencyScores({
    dimensions: scoringGuide.dimensions,
    reviews,
    recorderHighlights: recorderSignals.highlights,
    gapCounts,
    status: args.status,
    candidateReplyCount: args.candidateReplyCount,
    adequateAnswerCount,
  // Provider-specific function removed);
  const roleLabel = asOptionalString(getScenarioMetadata(args.state)?.targetRole) ?? args.state.topic;
  const executiveSummary = buildHeuristicInterviewExecutiveSummary({
    roleLabel,
    stageLabel: args.stageLabel,
    status: args.status,
    overallScore,
    strengths,
    weaknesses,
    waitingForCandidate: args.waitingForCandidate,
  // Provider-specific function removed);

  return {
    executiveSummary,
    interviewReadiness,
    overallScore,
    strengths,
    weaknesses,
    missedQuestions,
    suggestedAnswerImprovements,
    followUpQuestions,
    recommendedNextActions,
    competencyScores,
    confidence,
    questionLog,
    feedbackItems,
  // Provider-specific function removed;
// Provider-specific function removed

export function collectInterviewQuestionReviews(args: {
  messages: readonly ChatroomMessage[];
  track: InterviewTrack;
// Provider-specific function removed): HeuristicInterviewQuestionReview[] {
  const reviews: HeuristicInterviewQuestionReview[] = [];
  let managerPromptSeen = false;

  for (let index = 0; index < args.messages.length; index += 1) {
    const prompt = args.messages[index];
  ***REMOVED***
      !prompt ||
      prompt.role !== 'agent' ||
      prompt.round <= 0 ||
      isInterviewMetaContent(prompt.content)
  ***REMOVED***
      continue;
    // Provider-specific function removed

    let answer: ChatroomMessage | undefined;
    let turnKind: InterviewCandidateTurnKind | undefined;
    let coverage: InterviewAnswerCoverageAssessment | undefined;
    let fallbackUser: ChatroomMessage | undefined;
    let fallbackKind: InterviewCandidateTurnKind | undefined;

    for (let nextIndex = index + 1; nextIndex < args.messages.length; nextIndex += 1) {
      const nextMessage = args.messages[nextIndex];
    ***REMOVED***!nextMessage) {
        continue;
      // Provider-specific function removed

    ***REMOVED***
        nextMessage.role === 'agent' &&
        nextMessage.round > 0 &&
        !isInterviewMetaContent(nextMessage.content)
    ***REMOVED***
        break;
      // Provider-specific function removed

    ***REMOVED***nextMessage.role !== 'user' || nextMessage.round <= 0) {
        continue;
      // Provider-specific function removed

      const nextKind = classifyInterviewCandidateTurnMessage(nextMessage, prompt);
    ***REMOVED***nextKind === 'answer' || nextKind === 'withdraw_request') {
        answer = nextMessage;
        turnKind = nextKind;
        coverage = assessInterviewAnswerCoverage({
          candidateMessage: nextMessage,
          previousPrompt: prompt,
        // Provider-specific function removed);
        break;
      // Provider-specific function removed

    ***REMOVED***!fallbackUser) {
        fallbackUser = nextMessage;
        fallbackKind = nextKind;
      // Provider-specific function removed
    // Provider-specific function removed

  ***REMOVED***!answer && fallbackUser) {
      answer = fallbackUser;
      turnKind = fallbackKind;
      coverage = assessInterviewAnswerCoverage({
        candidateMessage: fallbackUser,
        previousPrompt: prompt,
      // Provider-specific function removed);
    // Provider-specific function removed

  ***REMOVED***isHeuristicInterviewRepairPrompt(prompt.content)) {
      const repairableReview = findLatestRepairableInterviewReview(reviews);
    ***REMOVED***repairableReview && (answer || coverage)) {
        const repairedCoverage = answer
          ? assessInterviewAnswerCoverage({
              candidateMessage: answer,
              previousPrompt: repairableReview.prompt,
            // Provider-specific function removed)
          : coverage;
        repairableReview.answer = answer;
        repairableReview.turnKind = turnKind;
        repairableReview.coverage = repairedCoverage;
        continue;
      // Provider-specific function removed
    // Provider-specific function removed

    reviews.push({
      prompt,
      answer,
      turnKind,
      coverage,
      stageLabel: resolveInterviewQuestionReviewStageLabel({
        prompt,
        track: args.track,
        managerPromptSeen,
      // Provider-specific function removed),
    // Provider-specific function removed);

  ***REMOVED***prompt.authorId === 'interview-manager') {
      managerPromptSeen = true;
    // Provider-specific function removed
  // Provider-specific function removed

  return reviews;
// Provider-specific function removed

export function isHeuristicInterviewRepairPrompt(value: string***REMOVED***
  return matchesAnyPattern(value, HEURISTIC_INTERVIEW_REPAIR_PROMPT_PATTERNS);
// Provider-specific function removed

export function findLatestRepairableInterviewReview(
  reviews: HeuristicInterviewQuestionReview[],
): HeuristicInterviewQuestionReview | undefined {
  for (let index = reviews.length - 1; index >= 0; index -= 1) {
    const review = reviews[index];
  ***REMOVED***!review) {
      continue;
    // Provider-specific function removed

  ***REMOVED***!review.answer) {
      return review;
    // Provider-specific function removed

  ***REMOVED***review.coverage?.isAdequate === false) {
      return review;
    // Provider-specific function removed

  ***REMOVED***looksLikeCorruptedInterviewText(review.answer.content)) {
      return review;
    // Provider-specific function removed
  // Provider-specific function removed

  return undefined;
// Provider-specific function removed

export function resolveInterviewQuestionReviewStageLabel(args: {
  prompt: ChatroomMessage;
  track: InterviewTrack;
  managerPromptSeen: boolean;
// Provider-specific function removed): string {
  switch (args.prompt.authorId) {
    case 'interview-technical':
      return resolveInterviewStageLabel('technical_deep_dive', args.track);
    case 'interview-observer':
      return resolveInterviewStageLabel('observer_followup', args.track);
    case 'interview-manager':
      return resolveInterviewStageLabel('manager_round', args.track);
    case 'interview-hr':
      return args.managerPromptSeen
        ? resolveInterviewStageLabel('hr_wrap_up', args.track)
        : args.prompt.round <= 1
          ? resolveInterviewStageLabel('opening', args.track)
          : resolveInterviewStageLabel('hr_followup', args.track);
    default:
      return resolveInterviewStageLabel('technical_deep_dive', args.track);
  // Provider-specific function removed
// Provider-specific function removed

export function collectInterviewRecorderSignals(
  recorderState: Readonly<ChatroomRecorderState> | undefined,
): {
  highlights: string[];
  concerns: string[];
  nextSteps: string[];
// Provider-specific function removed {
  const entries =
    recorderState?.entries
      ?.filter((entry) => entry.summaryKind === 'interview')
      .slice()
      .reverse() ?? [];

  return {
    highlights: dedupeStrings(entries.flatMap((entry) => entry.highlights)).slice(0, 4),
    concerns: dedupeStrings(entries.flatMap((entry) => entry.concerns)).slice(0, 4),
    nextSteps: dedupeStrings(entries.flatMap((entry) => entry.nextSteps)).slice(0, 4),
  // Provider-specific function removed;
// Provider-specific function removed

export function countHeuristicInterviewGapCategories(
  reviews: readonly HeuristicInterviewQuestionReview[],
): Record<HeuristicInterviewGapCategory, number> {
  const counts: Record<HeuristicInterviewGapCategory, number> = {
    quantitative: 0,
    collaboration: 0,
    motivation: 0,
    reasoning: 0,
    example: 0,
    direct_response: 0,
  // Provider-specific function removed;

  for (const review of reviews) {
    const category =
      review.coverage?.missingCategory ??
      (!review.answer ? 'direct_response' : undefined);
  ***REMOVED***!category) {
      continue;
    // Provider-specific function removed

    counts[category] += 1;
  // Provider-specific function removed

  return counts;
// Provider-specific function removed

export function countHeuristicInterviewSignals(
  reviews: readonly HeuristicInterviewQuestionReview[],
): HeuristicInterviewSignalCounts {
  const answers = reviews
    .filter(
      (item) =>
        item.answer &&
        item.turnKind === 'answer' &&
        !looksLikeCorruptedInterviewText(item.answer.content),
    )
    .map((item) => item.answer!.content);

  return {
    quantitative: countMatchingSignalTexts(answers, HEURISTIC_INTERVIEW_QUANTITATIVE_PATTERNS),
    collaboration: countMatchingSignalTexts(answers, HEURISTIC_INTERVIEW_COLLABORATION_PATTERNS),
    reasoning: countMatchingSignalTexts(answers, HEURISTIC_INTERVIEW_REASONING_PATTERNS),
    example: countMatchingSignalTexts(answers, HEURISTIC_INTERVIEW_EXAMPLE_PATTERNS),
    motivation: countMatchingSignalTexts(answers, HEURISTIC_INTERVIEW_MOTIVATION_PATTERNS),
    ownership: countMatchingSignalTexts(answers, HEURISTIC_INTERVIEW_OWNERSHIP_PATTERNS),
  // Provider-specific function removed;
// Provider-specific function removed

export function buildHeuristicInterviewStrengths(args: {
  adequateAnswerCount: number;
  candidateReplyCount: number;
  recorderHighlights: readonly string[];
  signalCounts: HeuristicInterviewSignalCounts;
// Provider-specific function removed): string[] {
  const derived: string[] = [];

***REMOVED***args.adequateAnswerCount >= Math.max(2, Math.ceil(args.candidateReplyCount / 2))) {
    derived.push('大多数问题都能保持直接作答，整体表达相对稳定。');
  // Provider-specific function removed
***REMOVED***args.signalCounts.quantitative > 0) {
    derived.push('部分回答给出了数字、指标或前后对比，具备一定量化意识。');
  // Provider-specific function removed
***REMOVED***args.signalCounts.collaboration > 0) {
    derived.push('能描述跨团队对齐或推进过程，说明具备协作推动意识。');
  // Provider-specific function removed
***REMOVED***args.signalCounts.reasoning > 0) {
    derived.push('回答里有判断依据和取舍逻辑，而不仅仅是结论。');
  // Provider-specific function removed
***REMOVED***args.signalCounts.example > 0) {
    derived.push('能够结合真实项目或故障场景举例，证据不完全停留在抽象层。');
  // Provider-specific function removed
***REMOVED***args.signalCounts.ownership > 0) {
    derived.push('对 owner、风险阈值或回滚兜底有明确表达，体现了一定 owner 意识。');
  // Provider-specific function removed
***REMOVED***derived.length === 0 && args.candidateReplyCount > 0) {
    derived.push('候选人已完成若干有效回答，具备继续评估的基础。');
  // Provider-specific function removed

  return dedupeStrings([...args.recorderHighlights, ...derived]).slice(0, 4);
// Provider-specific function removed

export function buildHeuristicInterviewWeaknesses(args: {
  gapCounts: Record<HeuristicInterviewGapCategory, number>;
  recorderConcerns: readonly string[];
  waitingForCandidate: boolean;
  latestQuestion: ChatroomMessage | undefined;
// Provider-specific function removed): string[] {
  const derived: string[] = [];

***REMOVED***args.gapCounts.quantitative > 0) {
    derived.push('多处回答缺少数字、比例或结果量化，证据颗粒度还不够。');
  // Provider-specific function removed
***REMOVED***args.gapCounts.collaboration > 0) {
    derived.push('跨团队对齐、阻力处理或 owner 推进细节还需要更具体。');
  // Provider-specific function removed
***REMOVED***args.gapCounts.reasoning > 0) {
    derived.push('部分回答给了结论，但判断依据和取舍展开不足。');
  // Provider-specific function removed
***REMOVED***args.gapCounts.example > 0) {
    derived.push('个别问题缺少完整案例或场景化说明，复盘深度还不够。');
  // Provider-specific function removed
***REMOVED***args.gapCounts.motivation > 0) {
    derived.push('求职动机、岗位匹配或候选人反问表达仍偏泛。');
  // Provider-specific function removed
***REMOVED***args.gapCounts.direct_response > 0) {
    derived.push('个别轮次没有正面回应原问题，导致 interviewer 需要继续追问。');
  // Provider-specific function removed
***REMOVED***args.waitingForCandidate && args.latestQuestion) {
    derived.push('最后一个 interviewer 问题仍待候选人补答，当前证据尚未闭环。');
  // Provider-specific function removed
***REMOVED***derived.length === 0 && args.recorderConcerns.length === 0) {
    derived.push('仍建议结合原始 transcript 做一次人工复核，确认评分和结论边界。');
  // Provider-specific function removed

  return dedupeStrings([...args.recorderConcerns, ...derived]).slice(0, 4);
// Provider-specific function removed

export function buildHeuristicInterviewMissedQuestions(args: {
  reviews: readonly HeuristicInterviewQuestionReview[];
  latestQuestion: ChatroomMessage | undefined;
  waitingForCandidate: boolean;
// Provider-specific function removed): string[] {
  return dedupeStrings([
    ...args.reviews
      .filter((item) => !item.answer || item.coverage?.isAdequate === false)
      .map((item) => truncateText(item.prompt.content, 160)),
    ...(args.waitingForCandidate && args.latestQuestion
      ? [truncateText(args.latestQuestion.content, 160)]
      : []),
  ]).slice(0, 4);
// Provider-specific function removed

export function buildHeuristicInterviewImprovements(args: {
  gapCounts: Record<HeuristicInterviewGapCategory, number>;
  recorderNextSteps: readonly string[];
  waitingForCandidate: boolean;
// Provider-specific function removed): string[] {
  const improvements: string[] = [];

***REMOVED***args.waitingForCandidate) {
    improvements.push('先把当前问题直接回答完整，再补充背景和延展信息。');
  // Provider-specific function removed
***REMOVED***args.gapCounts.quantitative > 0) {
    improvements.push('关键结果尽量补成数字、比例或前后对比，不要只说"有提升"。');
  // Provider-specific function removed
***REMOVED***args.gapCounts.collaboration > 0) {
    improvements.push('明确说清和哪些团队对齐、对方阻力是什么、你如何推动达成共识。');
  // Provider-specific function removed
***REMOVED***args.gapCounts.reasoning > 0) {
    improvements.push('回答时先给结论，再补充判断依据、边界条件和取舍逻辑。');
  // Provider-specific function removed
***REMOVED***args.gapCounts.example > 0) {
    improvements.push('把关键案例补成"背景-动作-结果-复盘"四段式表达。');
  // Provider-specific function removed
***REMOVED***args.gapCounts.motivation > 0) {
    improvements.push('把求职动机、岗位匹配和想加入该团队的原因讲得更具体。');
  // Provider-specific function removed
***REMOVED***args.gapCounts.direct_response > 0) {
    improvements.push('遇到追问时先正面回应 interviewer 的核心问题，再展开说明。');
  // Provider-specific function removed

  return dedupeStrings([...improvements, ...args.recorderNextSteps]).slice(0, 4);
// Provider-specific function removed

export function buildHeuristicInterviewFollowUpQuestions(args: {
  reviews: readonly HeuristicInterviewQuestionReview[];
  latestQuestion: ChatroomMessage | undefined;
  waitingForCandidate: boolean;
// Provider-specific function removed): string[] {
  return dedupeStrings([
    ...(args.waitingForCandidate && args.latestQuestion
      ? [truncateText(args.latestQuestion.content, 160)]
      : []),
    ...args.reviews
      .filter((item) => item.coverage?.isAdequate === false)
      .map((item) => truncateText(item.prompt.content, 160)),
  ]).slice(0, 4);
// Provider-specific function removed

export function buildHeuristicInterviewNextActions(args: {
  status: InterviewSummary['interviewStatus'];
  waitingForCandidate: boolean;
  overallScore: number;
  gapCounts: Record<HeuristicInterviewGapCategory, number>;
  recorderNextSteps: readonly string[];
// Provider-specific function removed): string[] {
  const actions: string[] = [];

***REMOVED***args.waitingForCandidate) {
    actions.push('继续等待候选人回复当前问题，不要提前切换到新的 interviewer。');
  // Provider-specific function removed else if (args.status === 'complete') {
    actions.push(
      args.overallScore >= 75
        ? '可进入下一轮更贴近岗位场景的 case / 复试验证。'
        : '在推进下一轮前，先补齐最关键的证据缺口并复核岗位匹配度。',
    );
  // Provider-specific function removed else if (args.status === 'aborted') {
    actions.push('先复盘面试为何提前终止，并在重新开始前确认候选人是否愿意继续。');
  // Provider-specific function removed else {
    actions.push('继续当前阶段，优先补齐最关键的证据缺口。');
  // Provider-specific function removed

***REMOVED***args.gapCounts.quantitative > 0) {
    actions.push('后续追问要明确要求数字、比例和前后对比结果。');
  // Provider-specific function removed
***REMOVED***args.gapCounts.collaboration > 0) {
    actions.push('继续追问跨团队对齐对象、阻力处理方式和 owner 决策边界。');
  // Provider-specific function removed
***REMOVED***args.gapCounts.reasoning > 0 || args.gapCounts.example > 0) {
    actions.push('要求候选人用"背景-动作-结果-复盘"讲完整案例。');
  // Provider-specific function removed
***REMOVED***args.gapCounts.motivation > 0) {
    actions.push('补问求职动机、岗位匹配和候选人对团队的反问。');
  // Provider-specific function removed

  return dedupeStrings([...actions, ...args.recorderNextSteps]).slice(0, 4);
// Provider-specific function removed

export function buildHeuristicInterviewQuestionLog(
  reviews: readonly HeuristicInterviewQuestionReview[],
): InterviewQuestionLog[] {
  return reviews.map((review) => ({
    questionId: review.prompt.id,
    interviewerRole: resolveInterviewerRoleLabel(review.prompt.authorId),
    interviewerName: review.prompt.authorName,
    round: review.prompt.round,
    stage: review.stageLabel,
    question: review.prompt.content,
    candidateAnswer: review.answer?.content,
    isAdequate: review.coverage?.isAdequate ?? false,
    evidenceGaps:
      review.coverage?.isAdequate === false && review.coverage.missingCategory
        ? [describeInterviewGap(review.coverage.missingCategory)]
        : !review.answer
          ? ['该问题还没有拿到有效回答。']
          : [],
  // Provider-specific function removed));
// Provider-specific function removed

export function buildHeuristicInterviewFeedbackItems(
  reviews: readonly HeuristicInterviewQuestionReview[],
): InterviewFeedbackItem[] {
  const feedback: InterviewFeedbackItem[] = [];

  for (const review of reviews) {
  ***REMOVED***review.coverage?.isAdequate) {
      continue;
    // Provider-specific function removed

    const category =
      review.coverage?.missingCategory ??
      (!review.answer ? 'direct_response' : undefined);
  ***REMOVED***!category) {
      continue;
    // Provider-specific function removed

    feedback.push({
      feedbackId: `feedback-${review.prompt.id// Provider-specific function removed`,
      relatedQuestionId: review.prompt.id,
      dimension: resolveInterviewFeedbackDimension(category),
      suggestion: describeInterviewGapImprovement(category),
      alternativeDirection: `优先回到第 ${review.prompt.round// Provider-specific function removed 轮问题：${truncateText(review.prompt.content, 90)// Provider-specific function removed`,
      severity:
        category === 'direct_response'
          ? 'high'
          : category === 'quantitative' || category === 'collaboration'
            ? 'medium'
            : 'low',
    // Provider-specific function removed);

  ***REMOVED***feedback.length >= 4) {
      break;
    // Provider-specific function removed
  // Provider-specific function removed

  return feedback;
// Provider-specific function removed

export function buildHeuristicInterviewCompetencyScores(args: {
  dimensions: readonly string[];
  reviews: readonly HeuristicInterviewQuestionReview[];
  recorderHighlights: readonly string[];
  gapCounts: Record<HeuristicInterviewGapCategory, number>;
  status: InterviewSummary['interviewStatus'];
  candidateReplyCount: number;
  adequateAnswerCount: number;
// Provider-specific function removed): InterviewSummary['competencyScores'] {
  const defaultEvidence = dedupeStrings([
    ...args.recorderHighlights,
    ...args.reviews
      .filter((review) => review.answer && review.coverage?.isAdequate)
      .map((review) => `第 ${review.prompt.round// Provider-specific function removed 轮：${truncateText(review.answer!.content, 80)// Provider-specific function removed`),
  ]);

  return args.dimensions.slice(0, 6).map((dimension) => {
    const focusCategories = inferHeuristicDimensionFocusCategories(dimension);
    const relevantPositiveReviews = args.reviews.filter((review) =>
      review.answer &&
      review.coverage?.isAdequate &&
      reviewMatchesHeuristicDimension(review, focusCategories)
    );
    const relevantNegativeReviews = args.reviews.filter((review) =>
      (!review.answer || review.coverage?.isAdequate === false) &&
      reviewMatchesHeuristicDimension(review, focusCategories)
    );
    const evidence = dedupeStrings([
      ...relevantPositiveReviews.map((review) =>
        `第 ${review.prompt.round// Provider-specific function removed 轮：${truncateText(review.answer!.content, 80)// Provider-specific function removed`),
      ...(relevantPositiveReviews.length === 0 ? defaultEvidence.slice(0, 1) : []),
    ]).slice(0, 2);
    const risks = dedupeStrings([
      ...relevantNegativeReviews.map((review) =>
        review.coverage?.missingCategory
          ? describeInterviewGapRisk(review.coverage.missingCategory)
          : `第 ${review.prompt.round// Provider-specific function removed 轮问题还缺少完整证据。`),
      ...(relevantNegativeReviews.length === 0 && evidence.length === 0
        ? ['当前 transcript 中该维度的直接证据仍偏少。']
        : []),
    ]).slice(0, 2);

    let score = 1;
  ***REMOVED***args.candidateReplyCount >= 1) {
      score += 1;
    // Provider-specific function removed
  ***REMOVED***args.adequateAnswerCount >= Math.max(1, Math.floor(args.reviews.length / 2))) {
      score += 1;
    // Provider-specific function removed
  ***REMOVED***evidence.length > 0) {
      score += 1;
    // Provider-specific function removed
  ***REMOVED***
      args.status === 'complete' &&
      args.adequateAnswerCount >= Math.max(3, Math.ceil(args.reviews.length * 0.6))
  ***REMOVED***
      score += 1;
    // Provider-specific function removed
  ***REMOVED***relevantNegativeReviews.length > 0) {
      score -= 1;
    // Provider-specific function removed
  ***REMOVED***focusCategories.some((category) => args.gapCounts[category] > 0)) {
      score -= 1;
    // Provider-specific function removed

    return {
      dimension,
      score: clampNumber(score, 1, 5),
      evidence,
      risks,
    // Provider-specific function removed;
  // Provider-specific function removed);
// Provider-specific function removed

export function computeHeuristicInterviewOverallScore(args: {
  status: InterviewSummary['interviewStatus'];
  candidateReplyCount: number;
  adequateAnswerCount: number;
  unansweredQuestionCount: number;
  gapCounts: Record<HeuristicInterviewGapCategory, number>;
  signalCounts: HeuristicInterviewSignalCounts;
// Provider-specific function removed): number {
***REMOVED***args.candidateReplyCount === 0) {
    return 0;
  // Provider-specific function removed

  let score =
    12 +
    args.candidateReplyCount * 5 +
    args.adequateAnswerCount * 5 +
    Math.min(args.signalCounts.quantitative, 2) * 4 +
    Math.min(args.signalCounts.collaboration, 2) * 4 +
    Math.min(args.signalCounts.reasoning, 2) * 3 +
    Math.min(args.signalCounts.example, 2) * 3 +
    Math.min(args.signalCounts.motivation, 1) * 2 +
    Math.min(args.signalCounts.ownership, 2) * 2;

  score -= args.gapCounts.direct_response * 8;
  score -= args.gapCounts.quantitative * 6;
  score -= args.gapCounts.collaboration * 5;
  score -= args.gapCounts.reasoning * 4;
  score -= args.gapCounts.example * 4;
  score -= args.gapCounts.motivation * 3;
  score -= args.unansweredQuestionCount * 6;

***REMOVED***args.status === 'opening') {
    score = Math.min(score, 35);
  // Provider-specific function removed else if (args.status !== 'complete') {
    score = Math.min(score, 78);
  // Provider-specific function removed

  return clampNumber(Math.round(score), 0, 100);
// Provider-specific function removed

export function computeHeuristicInterviewConfidence(args: {
  candidateReplyCount: number;
  adequateAnswerCount: number;
  reviewCount: number;
  unansweredQuestionCount: number;
// Provider-specific function removed): number {
***REMOVED***args.candidateReplyCount === 0 || args.reviewCount === 0) {
    return 0;
  // Provider-specific function removed

  const adequateRatio = args.adequateAnswerCount / Math.max(1, args.reviewCount);
  const confidence =
    0.22 +
    Math.min(args.candidateReplyCount, 6) * 0.07 +
    adequateRatio * 0.12 -
    args.unansweredQuestionCount * 0.04;

  return clampDecimal(confidence, 0.18, 0.82, 2);
// Provider-specific function removed

export function resolveHeuristicInterviewReadiness(args: {
  status: InterviewSummary['interviewStatus'];
  overallScore: number;
  adequateAnswerCount: number;
  reviewCount: number;
  gapCounts: Record<HeuristicInterviewGapCategory, number>;
// Provider-specific function removed): InterviewSummary['interviewReadiness'] {
***REMOVED***args.status === 'opening' || args.reviewCount === 0) {
    return 'insufficient_signal';
  // Provider-specific function removed

  const totalGapCount = Object.values(args.gapCounts).reduce((sum, value) => sum + value, 0);
***REMOVED***
    args.overallScore >= 80 &&
    args.adequateAnswerCount >= Math.max(3, Math.ceil(args.reviewCount * 0.6)) &&
    totalGapCount <= 1
***REMOVED***
    return 'strong';
  // Provider-specific function removed

***REMOVED***
    args.overallScore >= 60 &&
    args.adequateAnswerCount >= Math.max(2, Math.floor(args.reviewCount / 2))
***REMOVED***
    return 'mixed';
  // Provider-specific function removed

  return 'needs_more_evidence';
// Provider-specific function removed

export function buildHeuristicInterviewExecutiveSummary(args: {
  roleLabel: string;
  stageLabel: string;
  status: InterviewSummary['interviewStatus'];
  overallScore: number;
  strengths: readonly string[];
  weaknesses: readonly string[];
  waitingForCandidate: boolean;
// Provider-specific function removed): string {
  const topStrength = truncateText(args.strengths[0] ?? '已完成基础问答', 60);
  const topWeakness = truncateText(args.weaknesses[0] ?? '仍需继续补证', 60);

***REMOVED***args.status === 'complete') {
    return `候选人已完成 ${args.roleLabel// Provider-specific function removed 面试，基于已落库转录的启发式评估暂给 ${args.overallScore// Provider-specific function removed/100 分。当前亮点是：${topStrength// Provider-specific function removed；主要短板是：${topWeakness// Provider-specific function removed。由于结构化 recorder 未在时限内返回，这份总结由 transcript 与 checkpoint 自动汇总生成。`;
  // Provider-specific function removed

***REMOVED***args.status === 'aborted') {
    return `面试已在 ${args.stageLabel// Provider-specific function removed 提前终止，系统基于已落库转录给出暂评 ${args.overallScore// Provider-specific function removed/100 分。当前已观察到的亮点是：${topStrength// Provider-specific function removed；主要风险是：${topWeakness// Provider-specific function removed。由于结构化 recorder 未在时限内返回，这份总结由 transcript 与 checkpoint 自动汇总生成。`;
  // Provider-specific function removed

***REMOVED***args.waitingForCandidate) {
    return `面试目前停在 ${args.stageLabel// Provider-specific function removed，系统仍在等待候选人回复当前问题。基于已有转录的暂评约为 ${args.overallScore// Provider-specific function removed/100 分，已观察到：${topStrength// Provider-specific function removed；但同时 ${topWeakness// Provider-specific function removed。由于结构化 recorder 超时，以下结论为启发式结果。`;
  // Provider-specific function removed

  return `面试正在 ${args.stageLabel// Provider-specific function removed 继续推进，基于当前转录的启发式评估暂给 ${args.overallScore// Provider-specific function removed/100 分。已观察到：${topStrength// Provider-specific function removed；仍需补强：${topWeakness// Provider-specific function removed。由于结构化 recorder 未及时完成，以下为基于 transcript 的临时总结。`;
// Provider-specific function removed

export function resolveInterviewerRoleLabel(authorId: string): string {
  switch (authorId) {
    case 'interview-hr':
      return 'hr_interviewer';
    case 'interview-technical':
      return 'technical_interviewer';
    case 'interview-manager':
      return 'manager_interviewer';
    case 'interview-observer':
      return 'panel_observer';
    default:
      return 'interviewer';
  // Provider-specific function removed
// Provider-specific function removed

function countMatchingSignalTexts(
  values: readonly string[],
  patterns: readonly RegExp[],
): number {
  return values.filter((value) => matchesAnyPattern(value, patterns)).length;
// Provider-specific function removed

function matchesAnyPattern(value: string, patterns: readonly RegExp[]***REMOVED***
  return patterns.some((pattern) => pattern.test(value));
// Provider-specific function removed

function inferHeuristicDimensionFocusCategories(
  dimension: string,
): HeuristicInterviewGapCategory[] {
  const categories: HeuristicInterviewGapCategory[] = [];

***REMOVED***matchesAnyPattern(dimension, HEURISTIC_INTERVIEW_QUANTITATIVE_PATTERNS)) {
    categories.push('quantitative');
  // Provider-specific function removed
***REMOVED***matchesAnyPattern(dimension, HEURISTIC_INTERVIEW_COLLABORATION_PATTERNS)) {
    categories.push('collaboration');
  // Provider-specific function removed
***REMOVED***matchesAnyPattern(dimension, HEURISTIC_INTERVIEW_MOTIVATION_PATTERNS)) {
    categories.push('motivation');
  // Provider-specific function removed
***REMOVED***matchesAnyPattern(dimension, HEURISTIC_INTERVIEW_REASONING_PATTERNS)) {
    categories.push('reasoning');
  // Provider-specific function removed
***REMOVED***matchesAnyPattern(dimension, HEURISTIC_INTERVIEW_EXAMPLE_PATTERNS)) {
    categories.push('example');
  // Provider-specific function removed

  return categories.length > 0
    ? dedupeStrings(categories) as HeuristicInterviewGapCategory[]
    : ['reasoning'];
// Provider-specific function removed

function reviewMatchesHeuristicDimension(
  review: HeuristicInterviewQuestionReview,
  categories: readonly HeuristicInterviewGapCategory[],
***REMOVED***
***REMOVED***categories.length === 0) {
    return true;
  // Provider-specific function removed

  const combined = `${review.prompt.content// Provider-specific function removed
${review.answer?.content ?? ''// Provider-specific function removed`;
  return categories.some((category) => matchesHeuristicInterviewCategory(combined, category));
// Provider-specific function removed

function matchesHeuristicInterviewCategory(
  value: string,
  category: HeuristicInterviewGapCategory,
***REMOVED***
  switch (category) {
    case 'quantitative':
      return matchesAnyPattern(value, HEURISTIC_INTERVIEW_QUANTITATIVE_PATTERNS);
    case 'collaboration':
      return matchesAnyPattern(value, HEURISTIC_INTERVIEW_COLLABORATION_PATTERNS);
    case 'motivation':
      return matchesAnyPattern(value, HEURISTIC_INTERVIEW_MOTIVATION_PATTERNS);
    case 'example':
      return matchesAnyPattern(value, HEURISTIC_INTERVIEW_EXAMPLE_PATTERNS);
    case 'reasoning':
    case 'direct_response':
    default:
      return matchesAnyPattern(value, HEURISTIC_INTERVIEW_REASONING_PATTERNS);
  // Provider-specific function removed
// Provider-specific function removed

function dedupeStrings(values: readonly string[]): string[] {
***REMOVED***...new Set(values)];
// Provider-specific function removed

function truncateText(value: string, limit: number): string {
***REMOVED***value.length <= limit) {
    return value;
  // Provider-specific function removed
  return value.slice(0, limit);
// Provider-specific function removed

function clampNumber(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
// Provider-specific function removed

function clampDecimal(value: number, min: number, max: number, decimals: number): number {
  const clamped = Math.max(min, Math.min(max, value));
  return Number(clamped.toFixed(decimals));
// Provider-specific function removed

function asOptionalString(value: unknown): string | undefined {
***REMOVED***typeof value !== 'string') {
    return undefined;
  // Provider-specific function removed
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
// Provider-specific function removed

function describeInterviewGap(category: HeuristicInterviewGapCategory): string {
  switch (category) {
    case 'quantitative':
      return '缺少量化数据或具体指标。';
    case 'collaboration':
      return '跨团队协作细节不足。';
    case 'motivation':
      return '求职动机或岗位匹配表达偏泛。';
    case 'reasoning':
      return '判断依据或取舍逻辑不够清晰。';
    case 'example':
      return '缺少完整案例或场景说明。';
    case 'direct_response':
      return '未正面回应原问题。';
    default:
      return '证据不够充分。';
  // Provider-specific function removed
// Provider-specific function removed

function describeInterviewGapImprovement(category: HeuristicInterviewGapCategory): string {
  switch (category) {
    case 'quantitative':
      return '建议补充数字、比例或前后对比结果。';
    case 'collaboration':
      return '建议说明跨团队对齐对象、阻力和推动方式。';
    case 'motivation':
      return '建议更具体地表达求职动机和岗位匹配。';
    case 'reasoning':
      return '建议补充判断依据和取舍逻辑。';
    case 'example':
      return '建议用完整案例说明背景、动作和结果。';
    case 'direct_response':
      return '建议先正面回应核心问题再展开。';
    default:
      return '建议补充更具体的证据。';
  // Provider-specific function removed
// Provider-specific function removed

function describeInterviewGapRisk(category: HeuristicInterviewGapCategory): string {
  switch (category) {
    case 'quantitative':
      return '量化意识可能偏弱，需要进一步验证。';
    case 'collaboration':
      return '跨团队协作经验可能有限。';
    case 'motivation':
      return '求职动机可能不够明确。';
    case 'reasoning':
      return '判断依据可能不够清晰。';
    case 'example':
      return '案例经验可能不够丰富。';
    case 'direct_response':
      return '可能存在回避或答非所问的风险。';
    default:
      return '该维度证据仍需补强。';
  // Provider-specific function removed
// Provider-specific function removed

function resolveInterviewFeedbackDimension(category: HeuristicInterviewGapCategory): string {
  switch (category) {
    case 'quantitative':
      return '量化意识';
    case 'collaboration':
      return '协作能力';
    case 'motivation':
      return '求职动机';
    case 'reasoning':
      return '判断能力';
    case 'example':
      return '案例表达';
    case 'direct_response':
      return '回答质量';
    default:
      return '综合评估';
  // Provider-specific function removed
// Provider-specific function removed

function resolveInterviewScoringGuide(state: Readonly<ChatroomState>): {
  templateId: string;
  templateLabel: string;
  dimensions: string[];
// Provider-specific function removed {
  const templateId = asOptionalString(state.roomBlueprint?.metadata?.interviewScoreTemplateId) ?? 'general_professional';
  const templateLabel = templateId === 'general_professional' ? '通用岗位面试模板' : templateId;
  const dimensions = Array.isArray(state.roomBlueprint?.metadata?.interviewScoreDimensions)
    ? (state.roomBlueprint!.metadata!.interviewScoreDimensions as string[])
    : ['问题分析与结构化表达', '专业深度与学习能力', '执行力与质量意识', '协作沟通与影响力', '风险判断与责任心'];
  return { templateId, templateLabel, dimensions // Provider-specific function removed;
// Provider-specific function removed

function getScenarioMetadata(state: Readonly<ChatroomState>): Record<string, unknown> | undefined {
  const metadata = state.roomBlueprint?.metadata;
***REMOVED***!metadata || typeof metadata !== 'object') {
    return undefined;
  // Provider-specific function removed
  return metadata as Record<string, unknown>;
// Provider-specific function removed

function resolveInterviewStageLabel(phase: string, track: InterviewTrack): string {
  const trackLabel = track === 'demo' ? 'Demo' : 'Standard';
  switch (phase) {
    case 'opening':
      return `开场 (${trackLabel// Provider-specific function removed)`;
    case 'hr_followup':
    case 'hr_follow_up':
      return `HR 追问 (${trackLabel// Provider-specific function removed)`;
    case 'technical_deep_dive':
      return `技术深挖 (${trackLabel// Provider-specific function removed)`;
    case 'observer_followup':
      return `观察员追问 (${trackLabel// Provider-specific function removed)`;
    case 'manager_round':
      return `经理轮 (${trackLabel// Provider-specific function removed)`;
    case 'hr_wrap_up':
      return `HR 收尾 (${trackLabel// Provider-specific function removed)`;
    default:
      return `${phase// Provider-specific function removed (${trackLabel// Provider-specific function removed)`;
  // Provider-specific function removed
// Provider-specific function removed
