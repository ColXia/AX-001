import { extendProfile, type AgentProfile // Provider-specific function removed from '../core/agent-profile.js';
import {
  analystMemoSchema,
  critiqueMemoSchema,
  finalSummarySchema,
// Provider-specific function removed from './schemas.js';

export interface WorkflowAgentContext {
  workflowId: string;
  stepId: string;
  branchId?: string;
  stateSnapshot: string;
// Provider-specific function removed

const analystBaseProfile: AgentProfile<WorkflowAgentContext, typeof analystMemoSchema> = {
  id: 'analyst-base',
  name: 'Analyst Base',
  description: 'Produces a structured analysis memo for a topic.',
  instructions: [
    'You are an analysis specialist inside a multi-agent workflow.',
    'Focus on reasoning, decomposition, tradeoffs and practical next steps.',
    'Return only information that can fit the requested structured schema.',
    'Keep every string concise and keep arrays short unless the evidence truly requires more items.',
    'Do not roleplay socially; behave like a rigorous working analyst.',
  ].join(' '),
  outputType: analystMemoSchema,
  modelSettings: {
    temperature: 0.3,
  // Provider-specific function removed,
// Provider-specific function removed;

export const strategyAnalystProfile: AgentProfile<
  WorkflowAgentContext,
  typeof analystMemoSchema
> = extendProfile(analystBaseProfile, {
  id: 'strategy-analyst',
  name: 'Strategy Analyst',
  description: 'Focuses on opportunity, leverage, and solution shape.',
  instructions: [
    analystBaseProfile.instructions,
    'Prioritize business leverage, strategic upside, and execution sequencing.',
  ].join(' '),
// Provider-specific function removed);

export const riskAnalystProfile: AgentProfile<
  WorkflowAgentContext,
  typeof analystMemoSchema
> = extendProfile(analystBaseProfile, {
  id: 'risk-analyst',
  name: 'Risk Analyst',
  description: 'Focuses on failure modes, uncertainty, and hidden cost.',
  instructions: [
    analystBaseProfile.instructions,
    'Bias toward operational risk, edge cases, cost, maintenance burden, and failure modes.',
  ].join(' '),
// Provider-specific function removed);

export const riskCriticProfile: AgentProfile<
  WorkflowAgentContext,
  typeof critiqueMemoSchema
> = {
  id: 'risk-critic',
  name: 'Risk Critic',
  description: 'Challenges weak assumptions and identifies missing evidence.',
  instructions: [
    'You are a critic in a multi-agent analysis workflow.',
    'Your job is to attack weak reasoning, expose assumptions, and call out missing evidence.',
    'Be direct, concrete, and constructive.',
    'Return only structured critique output.',
    'Keep every string concise and keep arrays short unless the evidence truly requires more items.',
  ].join(' '),
  outputType: critiqueMemoSchema,
  modelSettings: {
    temperature: 0.2,
  // Provider-specific function removed,
// Provider-specific function removed;

export const synthesizerProfile: AgentProfile<
  WorkflowAgentContext,
  typeof finalSummarySchema
> = {
  id: 'synthesizer',
  name: 'Synthesizer',
  description: 'Converges multiple agent outputs into a practical summary.',
  instructions: [
    'You are the final synthesis agent in a multi-agent workflow.',
    'You must consolidate discussion outputs into a balanced summary.',
    'Preserve disagreements when they matter; do not flatten uncertainty.',
    'Return only structured summary output.',
    'Keep every string concise and keep arrays short unless the evidence truly requires more items.',
  ].join(' '),
  outputType: finalSummarySchema,
  modelSettings: {
    temperature: 0.2,
  // Provider-specific function removed,
// Provider-specific function removed;

export const defaultProfiles = [
  strategyAnalystProfile,
  riskAnalystProfile,
  riskCriticProfile,
  synthesizerProfile,
] as const;
