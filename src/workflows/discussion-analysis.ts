import type { CritiqueMemo, AnalystMemo, FinalSummary // Provider-specific function removed from '../agents/schemas.js';
import {
  riskAnalystProfile,
  riskCriticProfile,
  strategyAnalystProfile,
  synthesizerProfile,
  type WorkflowAgentContext,
// Provider-specific function removed from '../agents/profiles.js';
import {
  WorkflowRuntime,
  agentStep,
  parallelStep,
  type WorkflowExecuteOptions,
  type WorkflowDefinition,
// Provider-specific function removed from '../core/workflow.js';

export interface AgentArtifact<TOutput> {
  profileId: string;
  stepId: string;
  output: TOutput;
// Provider-specific function removed

export interface DiscussionState {
  topic: string;
  objective: string;
  constraints: string[];
  analystMemos: AgentArtifact<AnalystMemo>[];
  critiqueMemos: AgentArtifact<CritiqueMemo>[];
  finalSummary?: FinalSummary;
// Provider-specific function removed

export function createInitialDiscussionState(input: {
  topic: string;
  objective: string;
  constraints?: string[];
// Provider-specific function removed): DiscussionState {
  return {
    topic: input.topic,
    objective: input.objective,
    constraints: input.constraints ?? [],
    analystMemos: [],
    critiqueMemos: [],
  // Provider-specific function removed;
// Provider-specific function removed

export function createDiscussionWorkflow(): WorkflowDefinition<
  DiscussionState,
  WorkflowAgentContext
> {
  return {
    id: 'discussion',
    name: 'Discussion Analysis Workflow',
    steps: [
      agentStep({
        id: 'initial-analysis',
        profile: strategyAnalystProfile,
        buildInput: (state) =>
          createAnalysisPrompt(
            state,
            'Produce the first-pass structured analysis for this topic.',
          ),
        buildContext: createContextBuilder('initial-analysis'),
        maxTurns: 6,
        apply: ({ state, output // Provider-specific function removed) => {
          state.analystMemos.push({
            profileId: strategyAnalystProfile.id,
            stepId: 'initial-analysis',
            output,
          // Provider-specific function removed);
        // Provider-specific function removed,
      // Provider-specific function removed),
      agentStep({
        id: 'critique',
        profile: riskCriticProfile,
        buildInput: (state) =>
          createCritiquePrompt(
            state,
            'Review the existing analysis and challenge what is weak or under-evidenced.',
          ),
        buildContext: createContextBuilder('critique'),
        maxTurns: 6,
        apply: ({ state, output // Provider-specific function removed) => {
          state.critiqueMemos.push({
            profileId: riskCriticProfile.id,
            stepId: 'critique',
            output,
          // Provider-specific function removed);
        // Provider-specific function removed,
      // Provider-specific function removed),
      agentStep({
        id: 'summary',
        profile: synthesizerProfile,
        buildInput: (state) =>
          createSummaryPrompt(
            state,
            'Synthesize the discussion into a balanced recommendation.',
          ),
        buildContext: createContextBuilder('summary'),
        maxTurns: 6,
        apply: ({ state, output // Provider-specific function removed) => {
          state.finalSummary = output;
        // Provider-specific function removed,
      // Provider-specific function removed),
    ],
  // Provider-specific function removed;
// Provider-specific function removed

export function createParallelWorkflow(): WorkflowDefinition<
  DiscussionState,
  WorkflowAgentContext
> {
  return {
    id: 'parallel',
    name: 'Parallel Analysis Workflow',
    steps: [
      parallelStep({
        id: 'parallel-analysis',
        branches: [
          {
            id: 'strategy-branch',
            profile: strategyAnalystProfile,
            buildInput: (state) =>
              createAnalysisPrompt(
                state,
                'Analyze this topic from the perspective of strategic upside and leverage.',
              ),
            buildContext: createParallelContextBuilder('parallel-analysis', 'strategy-branch'),
            maxTurns: 6,
          // Provider-specific function removed,
          {
            id: 'risk-branch',
            profile: riskAnalystProfile,
            buildInput: (state) =>
              createAnalysisPrompt(
                state,
                'Analyze this topic from the perspective of failure modes, cost, and uncertainty.',
              ),
            buildContext: createParallelContextBuilder('parallel-analysis', 'risk-branch'),
            maxTurns: 6,
          // Provider-specific function removed,
        ],
        merge: ({ state, outputs // Provider-specific function removed) => {
          for (const item of outputs) {
            state.analystMemos.push({
              profileId: item.profileId,
              stepId: item.branchId,
              output: item.output as AnalystMemo,
            // Provider-specific function removed);
          // Provider-specific function removed
        // Provider-specific function removed,
      // Provider-specific function removed),
      agentStep({
        id: 'cross-critique',
        profile: riskCriticProfile,
        buildInput: (state) =>
          createCritiquePrompt(
            state,
            'Cross-check the parallel analysis outputs and point out the biggest unresolved gaps.',
          ),
        buildContext: createContextBuilder('cross-critique'),
        maxTurns: 6,
        apply: ({ state, output // Provider-specific function removed) => {
          state.critiqueMemos.push({
            profileId: riskCriticProfile.id,
            stepId: 'cross-critique',
            output,
          // Provider-specific function removed);
        // Provider-specific function removed,
      // Provider-specific function removed),
      agentStep({
        id: 'parallel-summary',
        profile: synthesizerProfile,
        buildInput: (state) =>
          createSummaryPrompt(
            state,
            'Combine the parallel viewpoints into one practical summary with clear next steps.',
          ),
        buildContext: createContextBuilder('parallel-summary'),
        maxTurns: 6,
        apply: ({ state, output // Provider-specific function removed) => {
          state.finalSummary = output;
        // Provider-specific function removed,
      // Provider-specific function removed),
    ],
  // Provider-specific function removed;
// Provider-specific function removed

export async function runDiscussionWorkflow(
  workflowRuntime: WorkflowRuntime<DiscussionState, WorkflowAgentContext>,
  workflowId: 'discussion' | 'parallel',
  input: {
    topic?: string;
    objective?: string;
    constraints?: string[];
  // Provider-specific function removed,
  options: WorkflowExecuteOptions<DiscussionState> = {// Provider-specific function removed,
) {
  const initialState = createInitialDiscussionState({
    topic: input.topic ?? '',
    objective: input.objective ?? '',
    constraints: input.constraints,
  // Provider-specific function removed);
  const definition =
    workflowId === 'parallel'
      ? createParallelWorkflow()
      : createDiscussionWorkflow();

  return workflowRuntime.execute(definition, initialState, options);
// Provider-specific function removed

function createAnalysisPrompt(
  state: Readonly<DiscussionState>,
  task: string,
): string {
***REMOVED***
    'Task:',
    task,
    '',
    'Topic:',
    state.topic,
    '',
    'Objective:',
    state.objective,
    '',
    'Constraints:',
    state.constraints.length > 0 ? state.constraints.join('\n- ') : 'None provided',
    '',
    'Shared state:',
    serializeState(state),
  ].join('\n');
// Provider-specific function removed

function createCritiquePrompt(
  state: Readonly<DiscussionState>,
  task: string,
): string {
***REMOVED***
    'Task:',
    task,
    '',
    'Topic:',
    state.topic,
    '',
    'Objective:',
    state.objective,
    '',
    'Current discussion state:',
    serializeState(state),
  ].join('\n');
// Provider-specific function removed

function createSummaryPrompt(
  state: Readonly<DiscussionState>,
  task: string,
): string {
***REMOVED***
    'Task:',
    task,
    '',
    'You are concluding a multi-agent discussion.',
    'Read the full state carefully and preserve meaningful disagreements.',
    '',
    'Current discussion state:',
    serializeState(state),
  ].join('\n');
// Provider-specific function removed

function createContextBuilder(
  stepId: string,
): (args: {
  state: Readonly<DiscussionState>;
  workflowId: string;
  stepId: string;
// Provider-specific function removed) => WorkflowAgentContext {
  return ({ state, workflowId // Provider-specific function removed) => ({
    workflowId,
    stepId,
    stateSnapshot: serializeState(state),
  // Provider-specific function removed);
// Provider-specific function removed

function createParallelContextBuilder(
  stepId: string,
  branchId: string,
): (args: {
  state: Readonly<DiscussionState>;
  workflowId: string;
  stepId: string;
  branchId: string;
// Provider-specific function removed) => WorkflowAgentContext {
  return ({ state, workflowId // Provider-specific function removed) => ({
    workflowId,
    stepId,
    branchId,
    stateSnapshot: serializeState(state),
  // Provider-specific function removed);
// Provider-specific function removed

function serializeState(state: Readonly<DiscussionState>): string {
  return JSON.stringify(state, null, 2);
// Provider-specific function removed
