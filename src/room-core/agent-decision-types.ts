/**
 * Agent Decision Types
 * 
 * 定义 Agent 在 Turn Lifecycle 中的决策类型
 */

export type AgentDecisionType = 'respond' | 'stay_silent' | 'private_only';

export interface AgentDecision {
  round: number;
  timestamp: string;
  decision: AgentDecisionType;
  reasoning: string;
  urgency: number;
  attention: string[];
  shouldRespondTo?: string;
  targetForPrivate?: string;
// Provider-specific function removed

export type InternalNoteType = 'observation' | 'judgment' | 'silence_reason' | 'private_thought';

export interface AgentInternalNote {
  noteId: string;
  round: number;
  timestamp: string;
  type: InternalNoteType;
  content: string;
  relatedMessageId?: string;
// Provider-specific function removed

export type AttentionLevel = 'high' | 'medium' | 'low';

export interface AttentionEntry {
  round: number;
  messageAuthorId: string;
  messageSummary: string;
  attentionLevel: AttentionLevel;
// Provider-specific function removed

export interface AgentTurnExecutionConfig {
  mode: 'sequential' | 'parallel_judge';
  observationWindow: number;
  silenceThreshold: number;
  enableInternalNotes: boolean;
// Provider-specific function removed

export const DEFAULT_AGENT_TURN_CONFIG: AgentTurnExecutionConfig = {
  mode: 'sequential',
  observationWindow: 10,
  silenceThreshold: 0.3,
  enableInternalNotes: true,
// Provider-specific function removed;

export interface AgentJudgeOutput {
  decision: AgentDecisionType;
  reasoning: string;
  urgency: number;
  attention: string[];
  shouldRespondTo?: string;
  targetForPrivate?: string;
// Provider-specific function removed

export interface AgentObserveResult {
  recentMessages: Array<{
    authorId: string;
    authorName: string;
    content: string;
    round: number;
  // Provider-specific function removed>;
  incomingPrivateMessages: Array<{
    speakerName: string;
    content: string;
  // Provider-specific function removed>;
  agentMemory: {
    scratchMemory?: string[];
    longTermMemory?: string[];
    establishedFacts?: string[];
  // Provider-specific function removed;
  agentIdentity: {
    name: string;
    role: string;
    currentGoal?: string;
    publicStatus?: string;
  // Provider-specific function removed;
  sceneContext?: {
    setting?: string;
    atmosphere?: string;
    currentBeat?: string;
  // Provider-specific function removed;
// Provider-specific function removed

export interface AgentTurnResult {
  speakerId: string;
  speakerName: string;
  round: number;
  decision: AgentDecision;
  publicMessage?: string;
  privateMessages?: Array<{
    targetSpeakerId: string;
    content: string;
  // Provider-specific function removed>;
  internalNotes: AgentInternalNote[];
// Provider-specific function removed
