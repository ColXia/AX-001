import type { InterviewAnswerCoverageAssessment // Provider-specific function removed from './interview-room-utils.js';
import type { InterviewCandidateTurnKind // Provider-specific function removed from './interview-room-utils.js';
import type { ChatroomMessage // Provider-specific function removed from '../../room-core/message-types.js';

export const MAX_INTERVIEW_CONSECUTIVE_WAITS = 3;
export const MAX_INTERVIEW_INTERNAL_NOTES_IN_STATE = 48;
export const INTERVIEW_FINAL_SUMMARY_AGENT_TIMEOUT_MS = 180_000;
export const INTERVIEW_FINAL_SUMMARY_MAX_TIMEOUT_RETRIES = 1;
export const INTERVIEW_COMPLETION_CLOSING_TIMEOUT_MS = 30_000;
export const INTERVIEW_COMPLETE_SCORE_DEFAULT_CAP = 88;
export const INTERVIEW_COMPLETE_SCORE_STRONG_CAP = 90;
export const INTERVIEW_COMPLETE_SCORE_EXCEPTIONAL_CAP = 92;

export const HEURISTIC_INTERVIEW_QUANTITATIVE_PATTERNS = [
  /\d+(?:\.\d+)?\s*(?:ms|s|sec|seconds?|minutes?|hours?|%|percent|qps|rps|p\d+)/iu,
  /数据|指标|量化|百分比|毫秒|秒级|分钟级|小时级|成功率|失败率|比例|提升|下降/u,
];

export const HEURISTIC_INTERVIEW_COLLABORATION_PATTERNS = [
  /cross-functional|cross team|stakeholder|alignment|align|owner|inventory|payment|support|business/i,
  /跨团队|协作|对齐|推进|推动|owner|库存|支付|客服|业务|团队/u,
];

export const HEURISTIC_INTERVIEW_REASONING_PATTERNS = [
  /because|therefore|trade[- ]?off|reason|decision|judge|judgment|evaluate|evaluation/i,
  /因为|所以|因此|取舍|权衡|判断|评估|决策|依据/u,
];

export const HEURISTIC_INTERVIEW_EXAMPLE_PATTERNS = [
  /for example|for instance|one time|once we|incident|outage|rollback|retrospective|case/i,
  /举例|案例|当时|那次|故障|回滚|复盘|有一次/u,
];

export const HEURISTIC_INTERVIEW_MOTIVATION_PATTERNS = [
  /motivation|why this role|why us|interested in|want to|career|learn more/i,
  /动机|岗位匹配|为什么想来|想做|看重|想了解|职业/u,
];

export const HEURISTIC_INTERVIEW_OWNERSHIP_PATTERNS = [
  /ownership|owner|drive|rollback|threshold|sla|guardrail/i,
  /负责|owner|推进|回滚|阈值|止损|SLA|兜底/u,
];

export const HEURISTIC_INTERVIEW_REPAIR_PROMPT_PATTERNS = [
  /encoding issue|garbled|corrupt(?:ed)?|mojibake/i,
  /编码问题|乱码|显示异常|转码/u,
];

export type HeuristicInterviewGapCategory = NonNullable<
  InterviewAnswerCoverageAssessment['missingCategory']
>;

export interface HeuristicInterviewQuestionReview {
  prompt: ChatroomMessage;
  answer?: ChatroomMessage;
  turnKind?: InterviewCandidateTurnKind;
  coverage?: InterviewAnswerCoverageAssessment;
  stageLabel: string;
// Provider-specific function removed

export interface HeuristicInterviewSignalCounts {
  quantitative: number;
  collaboration: number;
  reasoning: number;
  example: number;
  motivation: number;
  ownership: number;
// Provider-specific function removed

export interface InterviewSummaryCalibrationSnapshot {
  candidateReplyCount: number;
  reviewCount: number;
  adequateAnswerCount: number;
  unansweredQuestionCount: number;
  gapCounts: Record<HeuristicInterviewGapCategory, number>;
  signalCounts: HeuristicInterviewSignalCounts;
  totalGapCount: number;
// Provider-specific function removed