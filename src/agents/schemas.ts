import { z // Provider-specific function removed from 'zod';

export const analystMemoSchema = z.object({
  thesis: z.string(),
  supportingPoints: z.array(z.string()).min(2),
  assumptions: z.array(z.string()).default([]),
  openQuestions: z.array(z.string()).default([]),
  confidence: z.number().min(0).max(1),
// Provider-specific function removed);

export const critiqueMemoSchema = z.object({
  verdict: z.string(),
  weaknesses: z.array(z.string()).min(1),
  missingEvidence: z.array(z.string()).default([]),
  counterArguments: z.array(z.string()).default([]),
  recommendedRevisions: z.array(z.string()).default([]),
// Provider-specific function removed);

export const finalSummarySchema = z.object({
  executiveSummary: z.string(),
  consensus: z.array(z.string()).default([]),
  remainingDisagreements: z.array(z.string()).default([]),
  recommendedNextActions: z.array(z.string()).default([]),
  confidence: z.number().min(0).max(1),
// Provider-specific function removed);

export const interviewCompetencyScoreSchema = z.object({
  dimension: z.string(),
  score: z.number().min(1).max(5),
  evidence: z.array(z.string()).default([]),
  risks: z.array(z.string()).default([]),
// Provider-specific function removed);

export const interviewQuestionLogSchema = z.object({
  questionId: z.string(),
  interviewerRole: z.string(),
  interviewerName: z.string(),
  round: z.number(),
  stage: z.string(),
  question: z.string(),
  candidateAnswer: z.string().optional(),
  isAdequate: z.boolean().optional(),
  evidenceGaps: z.array(z.string()).default([]),
// Provider-specific function removed);

export const interviewFeedbackItemSchema = z.object({
  feedbackId: z.string(),
  relatedQuestionId: z.string().optional(),
  dimension: z.string().optional(),
  suggestion: z.string(),
  alternativeDirection: z.string().optional(),
  severity: z.enum(['low', 'medium', 'high']).default('medium'),
// Provider-specific function removed);

export const interviewSummarySchema = z.object({
  executiveSummary: z.string(),
  interviewStatus: z.enum(['opening', 'in_progress', 'complete', 'aborted']),
  currentStage: z.string(),
  interviewReadiness: z.enum([
    'insufficient_signal',
    'needs_more_evidence',
    'mixed',
    'strong',
  ]),
  overallScore: z.number().int().min(0).max(100),
  strengths: z.array(z.string()).default([]),
  weaknesses: z.array(z.string()).default([]),
  missedQuestions: z.array(z.string()).default([]),
  suggestedAnswerImprovements: z.array(z.string()).default([]),
  followUpQuestions: z.array(z.string()).default([]),
  recommendedNextActions: z.array(z.string()).default([]),
  competencyScores: z.array(interviewCompetencyScoreSchema).default([]),
  confidence: z.number().min(0).max(1),
  questionLog: z.array(interviewQuestionLogSchema).default([]),
  feedbackItems: z.array(interviewFeedbackItemSchema).default([]),
// Provider-specific function removed);

export const interviewTurnPlannerSchema = z.object({
  nextAction: z.enum(['ask', 'finish', 'wait']),
  currentStage: z.enum([
    'opening',
    'hr_followup',
    'technical_deep_dive',
    'observer_followup',
    'manager_round',
    'hr_wrap_up',
    'candidate_clarification',
    'paused',
    'complete',
  ]),
  currentStageLabel: z.string(),
  speakerRole: z
    .enum([
      'hr_interviewer',
      'technical_interviewer',
      'panel_observer',
      'manager_interviewer',
    ])
    .optional(),
  stageObjective: z.string(),
  questionGoal: z.string().default(''),
  handoffReason: z.string().default(''),
  responseMode: z.enum(['new_question', 'clarify', 'wait']).default('new_question'),
  candidateMessageType: z
    .enum(['answer', 'repeated_answer', 'clarify_request', 'repeat_request', 'pause_request', 'withdraw_request', 'other'])
    .optional(),
  evidenceStatus: z.enum(['insufficient', 'adequate']).default('insufficient'),
  confidence: z.number().min(0).max(1),
// Provider-specific function removed);

export const roleplaySummarySchema = z.object({
  narrativeSummary: z.string(),
  keyEvents: z.array(z.string()).default([]),
  relationshipChanges: z.array(z.string()).default([]),
  cliffhangers: z.array(z.string()).default([]),
  characterHighlights: z.array(z.string()).default([]),
// Provider-specific function removed);

export const hostModerationTurnSchema = z.object({
  action: z.enum(['idle', 'guide', 'intervene']),
  visibility: z.enum(['hidden', 'visible']).default('hidden'),
  headline: z.string().default(''),
  focus: z.string().default(''),
  instruction: z.string().default(''),
  reason: z.string().default(''),
// Provider-specific function removed);

export const roomAdminTurnSchema = z.object({
  action: z.enum([
    'idle',
    'set_phase',
    'inject_event',
    'set_phase_and_event',
    'hold_interview',
    'skip_phase',
    'request_answer_retry',
    'complete_interview',
  ]),
  visibility: z.enum(['hidden', 'visible']).default('hidden'),
  phaseLabel: z.string().default(''),
  phaseObjective: z.string().default(''),
  eventLabel: z.string().default(''),
  eventMessage: z.string().default(''),
  targetSpeakerId: z.string().default(''),
  targetPromptMessageId: z.string().default(''),
  responseMode: z.enum(['new_question', 'clarify']).default('new_question'),
  terminalStatus: z.enum(['complete', 'aborted']).optional(),
  instruction: z.string().default(''),
  reason: z.string().default(''),
  participantAdditions: z.array(
    z.object({
      name: z.string().min(1),
      instruction: z.string().default(''),
    // Provider-specific function removed),
  ).default([]),
// Provider-specific function removed);

export const roomKernelTurnSchema = z.object({
  action: z.enum([
    'observe',
    'guide_room_admin',
    'hold',
    'terminate_interview',
    'retry',
    'skip_phase',
    'advance_phase',
  ]).default('observe'),
  phaseLabel: z.string().default(''),
  summary: z.string().default(''),
  blockers: z.array(z.string()).default([]),
  recommendedInstruction: z.string().default(''),
  shouldEscalateRoomAdmin: z.boolean().default(false),
  targetSpeakerId: z.string().default(''),
  targetPromptMessageId: z.string().default(''),
  confidence: z.number().min(0).max(1),
// Provider-specific function removed);

export const chatroomFinalSummarySchema = z.union([
  interviewSummarySchema,
  roleplaySummarySchema,
  finalSummarySchema,
]);

const roomScenarioTemplateIdSchema = z.enum([
  'expert_discussion',
  'brainstorm_workshop',
  'roleplay_scene',
  'interview_simulation',
  'project_development_discussion',
  'report_seminar',
  'murder_mystery',
  'tavern_roleplay_demo',
]);

const roomCustomCharacterRelationshipSchema = z.object({
  targetCharacterId: z.string().optional(),
  targetName: z.string().optional(),
  summary: z.string().min(1),
  score: z.number().int().min(-3).max(3).optional(),
// Provider-specific function removed);

const roomCustomCharacterSchema = z.object({
  characterId: z.string().optional(),
  name: z.string().min(1),
  instruction: z.string().default(''),
  publicDescription: z.string().optional(),
  privateNotes: z.array(z.string()).default([]),
  relationships: z.array(roomCustomCharacterRelationshipSchema).default([]),
  initialGoal: z.string().optional(),
// Provider-specific function removed);

const roomRuntimeConfigPatchSchema = z.object({
  summaryEnabled: z.boolean().optional(),
  maxReplyCharacters: z.number().int().positive().optional(),
// Provider-specific function removed);

const roomGovernancePatchSchema = z.object({
  roomAdmin: z.object({
    enabled: z.boolean().optional(),
    interventionStyle: z.enum(['on_demand', 'proactive']).optional(),
    canManageParticipants: z.boolean().optional(),
    canManagePhases: z.boolean().optional(),
    canInjectEvents: z.boolean().optional(),
    brief: z.string().optional(),
  // Provider-specific function removed).optional(),
  host: z.object({
    enabled: z.boolean().optional(),
    moderationStyle: z.enum(['light', 'structured', 'strict']).optional(),
    brief: z.string().optional(),
  // Provider-specific function removed).optional(),
  recorder: z.object({
    enabled: z.boolean().optional(),
    updateMode: z.enum(['final_only', 'stage_checkpoints', 'continuous']).optional(),
    artifactFocus: z.array(z.string()).default([]),
    brief: z.string().optional(),
  // Provider-specific function removed).optional(),
// Provider-specific function removed);

export const platformAdminRoomPlanSchema = z.object({
  summary: z.string().min(1),
  scenarioTemplateId: roomScenarioTemplateIdSchema,
  title: z.string().min(1),
  topic: z.string().min(1),
  objective: z.string().min(1),
  constraints: z.array(z.string()).default([]),
  customCharacters: z.array(roomCustomCharacterSchema).default([]),
  runtimeConfig: roomRuntimeConfigPatchSchema.default({// Provider-specific function removed),
  governance: roomGovernancePatchSchema.default({// Provider-specific function removed),
  interview: z.object({
    candidateName: z.string().optional(),
    targetRole: z.string().optional(),
    candidateBackground: z.string().optional(),
    targetLevel: z.string().optional(),
    companyStyle: z.string().optional(),
    focusAreas: z.array(z.string()).default([]),
    scoreTemplateId: z.string().optional(),
    scoreDimensions: z.array(z.string()).default([]),
  // Provider-specific function removed).optional(),
  project: z.object({
    projectName: z.string().optional(),
    projectStage: z.enum(['discovery', 'planning', 'implementation', 'review']).optional(),
    teamContext: z.string().optional(),
    decisionFocus: z.array(z.string()).default([]),
  // Provider-specific function removed).optional(),
  report: z.object({
    reportKind: z.string().optional(),
    presenterName: z.string().optional(),
    domain: z.string().optional(),
    reviewFocus: z.array(z.string()).default([]),
  // Provider-specific function removed).optional(),
  mystery: z.object({
    caseTitle: z.string().optional(),
    setting: z.string().optional(),
    victimProfile: z.string().optional(),
    focusAreas: z.array(z.string()).default([]),
  // Provider-specific function removed).optional(),
  assumptions: z.array(z.string()).default([]),
  followUpQuestions: z.array(z.string()).default([]),
// Provider-specific function removed);

export const platformAdminConversationTurnSchema = z.object({
  status: z.enum(['needs_clarification', 'ready']),
  assistantMessage: z.string().min(1),
  summary: z.string().default(''),
  tentativeScenarioTemplateId: roomScenarioTemplateIdSchema.optional(),
  assumptions: z.array(z.string()).default([]),
  followUpQuestions: z.array(z.string()).max(3).default([]),
  roomPlan: platformAdminRoomPlanSchema.optional(),
// Provider-specific function removed);

export type AnalystMemo = z.infer<typeof analystMemoSchema>;
export type CritiqueMemo = z.infer<typeof critiqueMemoSchema>;
export type FinalSummary = z.infer<typeof finalSummarySchema>;
export type InterviewQuestionLog = z.infer<typeof interviewQuestionLogSchema>;
export type InterviewFeedbackItem = z.infer<typeof interviewFeedbackItemSchema>;
export type InterviewSummary = z.infer<typeof interviewSummarySchema>;
export type InterviewTurnPlan = z.infer<typeof interviewTurnPlannerSchema>;
export type RoleplaySummary = z.infer<typeof roleplaySummarySchema>;
export type HostModerationTurn = z.infer<typeof hostModerationTurnSchema>;
export type RoomAdminTurn = z.infer<typeof roomAdminTurnSchema>;
export type RoomKernelTurn = z.infer<typeof roomKernelTurnSchema>;
export type ChatroomFinalSummary = z.infer<typeof chatroomFinalSummarySchema>;
export type PlatformAdminRoomPlan = z.infer<typeof platformAdminRoomPlanSchema>;
export type PlatformAdminConversationTurn = z.infer<
  typeof platformAdminConversationTurnSchema
>;

export const agentJudgeSchema = z.object({
  decision: z.enum(['respond', 'stay_silent', 'private_only'])
    .describe('是否要回应'),
  reasoning: z.string()
    .describe('为什么做这个决定'),
  urgency: z.number().min(0).max(1)
    .describe('回应紧迫度，0=完全不急，1=必须立即回应'),
  attention: z.array(z.string())
    .describe('注意到了什么'),
  shouldRespondTo: z.string().optional()
    .describe('要回应的消息内容摘要'),
  targetForPrivate: z.string().optional()
    .describe('如果是 private_only，目标角色名'),
// Provider-specific function removed);

export type AgentJudgeOutput = z.infer<typeof agentJudgeSchema>;
