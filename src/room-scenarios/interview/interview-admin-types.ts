import type {
  InterviewPendingCandidateReplyState,
  InterviewPhaseState,
// Provider-specific function removed from '../../workflows/interview-room-controller.js';
import type {
  InterviewAnswerCoverageAssessment,
  InterviewCandidateTurnKind,
// Provider-specific function removed from '../../workflows/interview-room-utils.js';

export interface InterviewRoomAdminIncidentSnapshot {
  latestCandidateTurnKind?: InterviewCandidateTurnKind;
  repeatedAnswerCount: number;
  consecutiveInadequateAnswerCount: number;
  consecutiveEvasiveAnswerCount: number;
  consecutiveNonResponsiveCount: number;
  consecutiveRefusalCount: number;
  latestQuestionSpeakerId?: string;
  latestQuestionMessageId?: string;
  latestQuestionExcerpt?: string;
  latestCandidateExcerpt?: string;
  pendingSpeakerId?: string;
  pendingPromptMessageId?: string;
  pendingResponseMode?: InterviewPendingCandidateReplyState['responseMode'];
  latestAnswerAdequate?: boolean;
  latestAnswerMissingCategory?: InterviewAnswerCoverageAssessment['missingCategory'];
  latestAnswerFollowUpFocus?: string;
  consecutiveWaitCount: number;
  recommendedAction?: 'hold_interview' | 'request_answer_retry' | 'complete_interview';
  recommendedResponseMode?: InterviewPendingCandidateReplyState['responseMode'];
// Provider-specific function removed

export interface InterviewRoomAdminProgressSnapshot {
  candidateReplyCount: number;
  stageCounts: {
    hr: number;
    technical: number;
    observer: number;
    manager: number;
  // Provider-specific function removed;
  trackedPhase?: InterviewPhaseState;
  minimumPhase?: InterviewPhaseState;
  interviewStatus?: 'opening' | 'in_progress' | 'complete' | 'aborted';
  waitingForCandidate: boolean;
  latestQuestionSpeakerId?: string;
  latestAnswerAdequate?: boolean;
  latestAnswerMissingCategory?: InterviewAnswerCoverageAssessment['missingCategory'];
// Provider-specific function removed

export interface InterviewInternalCollaborationSummary {
  recentInternalNotes: string[];
  collaborationSignals: string[];
  collaborationSuggestedTone?: 'supportive' | 'firm';
  collaborationRecommendedActionHint?:
    | 'hold_interview'
    | 'request_answer_retry'
    | 'complete_interview';
  collaborationRecommendedResponseModeHint?: InterviewPendingCandidateReplyState['responseMode'];
// Provider-specific function removed
