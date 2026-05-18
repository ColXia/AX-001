import { randomUUID // Provider-specific function removed from 'node:crypto';

import type { AgentOutputType // Provider-specific function removed from '@openai/agents-core';

import type { AgentPolicyHook // Provider-specific function removed from './agent-policy.js';
import type { AgentProfile, ResolvedProfileOutput // Provider-specific function removed from './agent-profile.js';
import {
  AgentRuntime,
  type AgentRunResult,
  type AgentRunTelemetry,
// Provider-specific function removed from './agent-runtime.js';
import {
  ExecutionAbortedError,
  createExecutionSignal,
  throwIfAborted,
// Provider-specific function removed from './execution-control.js';
import { SharedState // Provider-specific function removed from './shared-state.js';
import type {
  WorkflowCheckpointRecord,
  WorkflowCheckpointStatus,
  WorkflowCheckpointStore,
// Provider-specific function removed from './workflow-checkpoints.js';

export interface WorkflowTraceRecord {
  stepId: string;
  kind: 'agent' | 'parallel' | 'custom';
  agentIds?: string[];
  startedAt: string;
  endedAt: string;
  stateVersionBefore?: number;
  stateVersionAfter?: number;
  inputPreview?: string;
  output?: unknown;
  usage?: Record<string, unknown>;
  guardrails?: unknown;
  telemetry?: AgentRunTelemetry;
  status?: 'completed' | 'partial' | 'failed' | 'cancelled';
  error?: string;
// Provider-specific function removed

export interface WorkflowExecutionContext<TState extends object, TContext extends object> {
  runId: string;
  workflowId: string;
  sharedState: SharedState<TState>;
  agentRuntime: AgentRuntime;
  trace: WorkflowTraceRecord[];
  signal?: AbortSignal;
// Provider-specific function removed

export interface WorkflowObserverEvent<TState extends object> {
  observedAt: string;
  runId: string;
  workflowId: string;
  stateVersion: number;
  state: Readonly<TState>;
  trace: WorkflowTraceRecord[];
// Provider-specific function removed

export interface WorkflowStepObserverEvent<TState extends object>
  extends WorkflowObserverEvent<TState> {
  stepId: string;
  stepKind: WorkflowStep<any, any>['kind'];
  agentIds?: string[];
// Provider-specific function removed

export interface WorkflowStepCompletedObserverEvent<TState extends object>
  extends WorkflowStepObserverEvent<TState> {
  stepTrace: WorkflowTraceRecord;
// Provider-specific function removed

export interface WorkflowRunFailedObserverEvent<TState extends object>
  extends WorkflowObserverEvent<TState> {
  currentStepId?: string;
  error: unknown;
// Provider-specific function removed

export interface WorkflowObserver<TState extends object> {
  onRunStarted?: (event: WorkflowObserverEvent<TState>) => void;
  onStepStarted?: (event: WorkflowStepObserverEvent<TState>) => void;
  onStepCompleted?: (event: WorkflowStepCompletedObserverEvent<TState>) => void;
  onRunCompleted?: (event: WorkflowObserverEvent<TState>) => void;
  onRunFailed?: (event: WorkflowRunFailedObserverEvent<TState>) => void;
// Provider-specific function removed

export interface WorkflowExecuteOptions<TState extends object> {
  observer?: WorkflowObserver<TState>;
  signal?: AbortSignal;
  timeoutMs?: number;
  stepTimeoutMs?: number;
  checkpointStore?: WorkflowCheckpointStore<TState>;
  resumeCheckpointId?: string;
  checkpointMetadata?: Record<string, unknown>;
// Provider-specific function removed

export interface WorkflowStep<TState extends object, TContext extends object> {
  id: string;
  kind: 'agent' | 'parallel' | 'custom';
  agentIds?: string[];
  timeoutMs?: number;
  execute(context: WorkflowExecutionContext<TState, TContext>): Promise<void>;
// Provider-specific function removed

export interface WorkflowDefinition<TState extends object, TContext extends object> {
  id: string;
  name: string;
  steps: WorkflowStep<TState, TContext>[];
// Provider-specific function removed

export interface WorkflowResult<TState extends object> {
  runId: string;
  workflowId: string;
  stateVersion: number;
  state: Readonly<TState>;
  trace: WorkflowTraceRecord[];
// Provider-specific function removed

export interface AgentStepOptions<
  TState extends object,
  TContext extends object,
  TOutput extends AgentOutputType,
> {
  id: string;
  profile: AgentProfile<TContext, TOutput>;
  buildInput: (state: Readonly<TState>) => string;
  buildContext?: (args: {
    state: Readonly<TState>;
    workflowId: string;
    stepId: string;
  // Provider-specific function removed) => TContext;
  policyHooks?:
    | AgentPolicyHook<TContext, TOutput>[]
    | ((args: {
        state: Readonly<TState>;
        workflowId: string;
        stepId: string;
      // Provider-specific function removed) => AgentPolicyHook<TContext, TOutput>[]);
  maxTurns?: number;
  timeoutMs?: number;
  apply: (args: {
    state: TState;
    output: ResolvedProfileOutput<TOutput>;
  // Provider-specific function removed) => void;
// Provider-specific function removed

export interface ParallelBranch<
  TState extends object,
  TContext extends object,
  TOutput extends AgentOutputType,
> {
  id: string;
  profile: AgentProfile<TContext, TOutput>;
  buildInput: (state: Readonly<TState>) => string;
  buildContext?: (args: {
    state: Readonly<TState>;
    workflowId: string;
    stepId: string;
    branchId: string;
  // Provider-specific function removed) => TContext;
  policyHooks?:
    | AgentPolicyHook<TContext, any>[]
    | ((args: {
        state: Readonly<TState>;
        workflowId: string;
        stepId: string;
        branchId: string;
      // Provider-specific function removed) => AgentPolicyHook<TContext, any>[]);
  maxTurns?: number;
  timeoutMs?: number;
// Provider-specific function removed

export interface ParallelStepOptions<TState extends object, TContext extends object> {
  id: string;
  branches: ParallelBranch<TState, TContext, any>[];
  timeoutMs?: number;
  failurePolicy?: ParallelFailurePolicy | ParallelFailurePolicyMode;
  merge: (args: {
    state: TState;
    outputs: Array<{
      branchId: string;
      profileId: string;
      output: unknown;
    // Provider-specific function removed>;
    failures: ParallelFailureRecord[];
  // Provider-specific function removed) => void;
// Provider-specific function removed

export type ParallelFailurePolicyMode = 'fail' | 'continue';

export interface ParallelFailurePolicy {
  mode: ParallelFailurePolicyMode;
  minSuccessfulBranches?: number;
// Provider-specific function removed

export interface ParallelFailureRecord {
  branchId: string;
  profileId: string;
  status: 'failed' | 'cancelled';
  startedAt: string;
  endedAt: string;
  inputPreview: string;
  error: unknown;
  errorText: string;
// Provider-specific function removed

export function agentStep<
  TState extends object,
  TContext extends object,
  TOutput extends AgentOutputType,
>(options: AgentStepOptions<TState, TContext, TOutput>): WorkflowStep<TState, TContext> {
  return {
    id: options.id,
    kind: 'agent',
    agentIds: [options.profile.id],
    timeoutMs: options.timeoutMs,
    async execute(context) {
      const stateBefore = context.sharedState.readSnapshot();
      const input = options.buildInput(stateBefore.state);
      const agentContext = options.buildContext?.({
        state: stateBefore.state,
        workflowId: context.workflowId,
        stepId: options.id,
      // Provider-specific function removed);
      const policyHooks = resolveAgentStepPolicyHooks(options.policyHooks, {
        state: stateBefore.state,
        workflowId: context.workflowId,
        stepId: options.id,
      // Provider-specific function removed);
      const startedAt = new Date().toISOString();
      let runResult: AgentRunResult<TOutput> | undefined;
      let stateVersionAfter = stateBefore.version;

      try {
        runResult = await context.agentRuntime.runDetailed(options.profile, input, {
          context: agentContext,
          maxTurns: options.maxTurns,
          signal: context.signal,
          policyHooks,
        // Provider-specific function removed);
        const endedAt = new Date().toISOString();
        const output = runResult.output;

        const mutation = context.sharedState.mutate((state) => {
          options.apply({
            state,
            output,
          // Provider-specific function removed);
        // Provider-specific function removed, {
          expectedVersion: stateBefore.version,
          label: options.id,
        // Provider-specific function removed);
        stateVersionAfter = mutation.version;

        context.trace.push({
          stepId: options.id,
          kind: 'agent',
          agentIds: [options.profile.id],
          startedAt,
          endedAt,
          stateVersionBefore: stateBefore.version,
          stateVersionAfter,
          inputPreview: previewText(input),
          output,
          usage: runResult.usage,
          guardrails: runResult.guardrails,
          telemetry: runResult.telemetry,
          status: 'completed',
        // Provider-specific function removed);
      // Provider-specific function removed catch (error) {
        context.trace.push({
          stepId: options.id,
          kind: 'agent',
          agentIds: [options.profile.id],
          startedAt,
          endedAt: new Date().toISOString(),
          stateVersionBefore: stateBefore.version,
          stateVersionAfter,
          inputPreview: previewText(input),
          output: runResult?.output,
          usage: runResult?.usage,
          guardrails: runResult?.guardrails,
          telemetry: runResult?.telemetry,
          status: classifyTraceFailureStatus(error),
          error: formatTraceError(error),
        // Provider-specific function removed);
        throw error;
      // Provider-specific function removed
    // Provider-specific function removed,
  // Provider-specific function removed;
// Provider-specific function removed

export function parallelStep<TState extends object, TContext extends object>(
  options: ParallelStepOptions<TState, TContext>,
): WorkflowStep<TState, TContext> {
  return {
    id: options.id,
    kind: 'parallel',
    agentIds: options.branches.map((branch) => branch.profile.id),
    timeoutMs: options.timeoutMs,
    async execute(context) {
      const stateBefore = context.sharedState.readSnapshot();
      const startedAt = new Date().toISOString();
      const failurePolicy = resolveParallelFailurePolicy(
        options.failurePolicy,
        options.branches.length,
      );
      let stateVersionAfter = stateBefore.version;
      const outputs = await Promise.all(
        options.branches.map(async (branch) => {
          const input = branch.buildInput(stateBefore.state);
          const branchContext = branch.buildContext?.({
            state: stateBefore.state,
            workflowId: context.workflowId,
            stepId: options.id,
            branchId: branch.id,
          // Provider-specific function removed);
          const policyHooks = resolveParallelBranchPolicyHooks(branch.policyHooks, {
            state: stateBefore.state,
            workflowId: context.workflowId,
            stepId: options.id,
            branchId: branch.id,
          // Provider-specific function removed);
          const branchStartedAt = new Date().toISOString();
          try {
            const runResult = await context.agentRuntime.runDetailed(branch.profile, input, {
              context: branchContext,
              maxTurns: branch.maxTurns,
              signal: context.signal,
              timeoutMs: branch.timeoutMs,
              policyHooks,
            // Provider-specific function removed);

            return {
              branchId: branch.id,
              profileId: branch.profile.id,
              input,
              output: runResult.output,
              usage: runResult.usage,
              guardrails: runResult.guardrails,
              telemetry: runResult.telemetry,
              startedAt: branchStartedAt,
              endedAt: new Date().toISOString(),
              status: 'completed' as const,
            // Provider-specific function removed;
          // Provider-specific function removed catch (error) {
            return {
              branchId: branch.id,
              profileId: branch.profile.id,
              input,
              startedAt: branchStartedAt,
              endedAt: new Date().toISOString(),
              status: classifyTraceFailureStatus(error),
              error,
            // Provider-specific function removed;
          // Provider-specific function removed
        // Provider-specific function removed),
      );
      const failedOutputs = outputs
        .filter((output) => output.status !== 'completed')
        .map((output) => ({
          branchId: output.branchId,
          profileId: output.profileId,
          status: output.status,
          startedAt: output.startedAt,
          endedAt: output.endedAt,
          inputPreview: previewText(output.input),
          error: output.error,
          errorText: formatTraceError(output.error),
        // Provider-specific function removed));
      const successfulOutputs = outputs.filter(
        (output): output is Extract<(typeof outputs)[number], { status: 'completed' // Provider-specific function removed> =>
          output.status === 'completed',
      );

      try {
      ***REMOVED***failedOutputs.length > 0) {
        ***REMOVED***
            failurePolicy.mode === 'fail' ||
            successfulOutputs.length < failurePolicy.minSuccessfulBranches
        ***REMOVED***
            throw buildParallelStepFailureError(
              options.id,
              successfulOutputs.length,
              options.branches.length,
              failedOutputs,
              failurePolicy,
            );
          // Provider-specific function removed
        // Provider-specific function removed

        const mutation = context.sharedState.mutate((state) => {
          options.merge({
            state,
            outputs: successfulOutputs.map(({ branchId, profileId, output // Provider-specific function removed) => ({
              branchId,
              profileId,
              output,
            // Provider-specific function removed)),
            failures: failedOutputs,
          // Provider-specific function removed);
        // Provider-specific function removed, {
          expectedVersion: stateBefore.version,
          label: options.id,
        // Provider-specific function removed);
        stateVersionAfter = mutation.version;

        context.trace.push({
          stepId: options.id,
          kind: 'parallel',
          agentIds: options.branches.map((branch) => branch.profile.id),
          startedAt,
          endedAt: new Date().toISOString(),
          stateVersionBefore: stateBefore.version,
          stateVersionAfter,
          inputPreview: outputs.map((item) => `${item.branchId// Provider-specific function removed: ${previewText(item.input)// Provider-specific function removed`).join('\n'),
          output: outputs.map(
            ({
              branchId,
              profileId,
              output,
              usage,
              guardrails,
              telemetry,
              startedAt,
              endedAt,
              status,
            // Provider-specific function removed) => ({
              branchId,
              profileId,
              output,
              usage,
              guardrails,
              telemetry,
              startedAt,
              endedAt,
              status,
            // Provider-specific function removed),
          ),
          status: failedOutputs.length > 0 ? 'partial' : 'completed',
        // Provider-specific function removed);
      // Provider-specific function removed catch (error) {
        context.trace.push({
          stepId: options.id,
          kind: 'parallel',
          agentIds: options.branches.map((branch) => branch.profile.id),
          startedAt,
          endedAt: new Date().toISOString(),
          stateVersionBefore: stateBefore.version,
          stateVersionAfter,
          inputPreview: outputs.map((item) => `${item.branchId// Provider-specific function removed: ${previewText(item.input)// Provider-specific function removed`).join('\n'),
          output: outputs.map((item) => ({
            branchId: item.branchId,
            profileId: item.profileId,
            ...(item.status === 'completed'
              ? {
                  output: item.output,
                  usage: item.usage,
                  guardrails: item.guardrails,
                  telemetry: item.telemetry,
                // Provider-specific function removed
              : {// Provider-specific function removed),
            startedAt: item.startedAt,
            endedAt: item.endedAt,
            status: item.status,
            ...(item.status === 'completed' ? {// Provider-specific function removed : { error: formatTraceError(item.error) // Provider-specific function removed),
          // Provider-specific function removed)),
          status: classifyTraceFailureStatus(error),
          error: formatTraceError(error),
        // Provider-specific function removed);
        throw error;
      // Provider-specific function removed
    // Provider-specific function removed,
  // Provider-specific function removed;
// Provider-specific function removed

export class WorkflowRuntime<TState extends object, TContext extends object> {
  constructor(private readonly agentRuntime: AgentRuntime) {// Provider-specific function removed

  get runtime(): AgentRuntime {
    return this.agentRuntime;
  // Provider-specific function removed

  async execute(
    definition: WorkflowDefinition<TState, TContext>,
    initialState: TState,
    options: WorkflowExecuteOptions<TState> = {// Provider-specific function removed,
  ): Promise<WorkflowResult<TState>> {
    const resumedCheckpoint =
      options.resumeCheckpointId && options.checkpointStore
        ? loadResumedCheckpoint(options.checkpointStore, options.resumeCheckpointId, definition.id)
        : undefined;
  ***REMOVED***options.resumeCheckpointId && !options.checkpointStore) {
      throw new Error('resumeCheckpointId requires checkpointStore to be provided.');
    // Provider-specific function removed
  ***REMOVED***resumedCheckpoint?.status === 'completed') {
      throw new Error(
        `Checkpoint "${resumedCheckpoint.checkpointId// Provider-specific function removed" already completed and does not need resuming.`,
      );
    // Provider-specific function removed

    const runId = randomUUID();
    const runStartedAt = new Date().toISOString();
    const sharedState = new SharedState(
      resumedCheckpoint ? structuredClone(resumedCheckpoint.state) : initialState,
      {
        initialVersion: resumedCheckpoint?.stateVersion,
      // Provider-specific function removed,
    );
    const trace: WorkflowTraceRecord[] = resumedCheckpoint
      ? structuredClone(resumedCheckpoint.trace)
      : [];
    const completedStepIds = new Set(resumedCheckpoint?.completedStepIds ?? []);
    validateCheckpointAgainstDefinition(resumedCheckpoint, definition);
    const stepOrder = definition.steps.map((step) => step.id);
    const runExecution = createExecutionSignal({
      parentSignal: options.signal,
      timeoutMs: options.timeoutMs,
      scope: 'workflow',
      targetId: definition.id,
      abortMessage: `Workflow "${definition.id// Provider-specific function removed" was aborted.`,
    // Provider-specific function removed);

    const context: WorkflowExecutionContext<TState, TContext> = {
      runId,
      workflowId: definition.id,
      sharedState,
      agentRuntime: this.agentRuntime,
      trace,
      signal: runExecution.signal,
    // Provider-specific function removed;
    let currentStep: WorkflowStep<TState, TContext> | undefined;
    const persistCheckpoint = (args: {
      status: WorkflowCheckpointStatus;
      currentStepId?: string;
      error?: unknown;
      completedAt?: string;
    // Provider-specific function removed) => {
    ***REMOVED***!options.checkpointStore) {
        return;
      // Provider-specific function removed

      options.checkpointStore.save(
        createCheckpointRecord({
          checkpointId: runId,
          runId,
          definition,
          status: args.status,
          startedAt: runStartedAt,
          updatedAt: new Date().toISOString(),
          completedAt: args.completedAt,
          currentStepId: args.currentStepId,
          completedStepIds: [...completedStepIds],
          resumedFromCheckpointId: resumedCheckpoint?.checkpointId,
          metadata: mergeCheckpointMetadata(
            resumedCheckpoint?.metadata,
            options.checkpointMetadata,
          ),
          state: sharedState.read(),
          stateVersion: sharedState.getVersion(),
          trace,
          error: args.error,
          stepOrder,
        // Provider-specific function removed),
      );
    // Provider-specific function removed;

    try {
      throwIfAborted(runExecution.signal, {
        scope: 'workflow',
        targetId: definition.id,
        abortMessage: `Workflow "${definition.id// Provider-specific function removed" was aborted.`,
      // Provider-specific function removed);

      options.observer?.onRunStarted?.(
        createObserverEvent({
          runId,
          workflowId: definition.id,
          sharedState,
          trace,
        // Provider-specific function removed),
      );
      persistCheckpoint({
        status: 'running',
        currentStepId: findNextPendingStepId(definition.steps, completedStepIds),
      // Provider-specific function removed);

      for (const step of definition.steps) {
      ***REMOVED***completedStepIds.has(step.id)) {
          continue;
        // Provider-specific function removed

        currentStep = step;
        throwIfAborted(runExecution.signal, {
          scope: 'workflow',
          targetId: definition.id,
          abortMessage: `Workflow "${definition.id// Provider-specific function removed" was aborted.`,
        // Provider-specific function removed);

        options.observer?.onStepStarted?.(
          createObserverStepEvent({
            runId,
            workflowId: definition.id,
            sharedState,
            trace,
            step,
          // Provider-specific function removed),
        );
        persistCheckpoint({
          status: 'running',
          currentStepId: step.id,
        // Provider-specific function removed);

        const stepExecution = createExecutionSignal({
          parentSignal: runExecution.signal,
          timeoutMs: step.timeoutMs ?? options.stepTimeoutMs,
          scope: 'step',
          targetId: step.id,
          abortMessage: `Workflow step "${step.id// Provider-specific function removed" was aborted.`,
        // Provider-specific function removed);

        try {
          await step.execute({
            ...context,
            signal: stepExecution.signal,
          // Provider-specific function removed);
          throwIfAborted(stepExecution.signal, {
            scope: 'step',
            targetId: step.id,
            abortMessage: `Workflow step "${step.id// Provider-specific function removed" was aborted.`,
          // Provider-specific function removed);
        // Provider-specific function removed catch (error) {
        ***REMOVED***stepExecution.signal?.aborted) {
            throwIfAborted(stepExecution.signal, {
              scope: 'step',
              targetId: step.id,
              abortMessage: `Workflow step "${step.id// Provider-specific function removed" was aborted.`,
            // Provider-specific function removed);
          // Provider-specific function removed

          throw error;
        // Provider-specific function removed finally {
          stepExecution.cleanup();
        // Provider-specific function removed

        options.observer?.onStepCompleted?.(
          createObserverStepCompletedEvent({
            runId,
            workflowId: definition.id,
            sharedState,
            trace,
            step,
          // Provider-specific function removed),
        );
        completedStepIds.add(step.id);
        persistCheckpoint({
          status: 'running',
          currentStepId: findNextPendingStepId(definition.steps, completedStepIds),
        // Provider-specific function removed);
      // Provider-specific function removed
      const result = {
        runId,
        workflowId: definition.id,
        stateVersion: sharedState.getVersion(),
        state: sharedState.read(),
        trace,
      // Provider-specific function removed;

      options.observer?.onRunCompleted?.(
        createObserverEvent({
          runId,
          workflowId: definition.id,
          sharedState,
          trace,
        // Provider-specific function removed),
      );
      persistCheckpoint({
        status: 'completed',
        completedAt: new Date().toISOString(),
      // Provider-specific function removed);

      return result;
    // Provider-specific function removed catch (error) {
      persistCheckpoint({
        status: classifyCheckpointFailureStatus(error),
        currentStepId: currentStep?.id,
        error,
        completedAt: new Date().toISOString(),
      // Provider-specific function removed);
      options.observer?.onRunFailed?.({
        ...createObserverEvent({
          runId,
          workflowId: definition.id,
          sharedState,
          trace,
        // Provider-specific function removed),
        currentStepId: currentStep?.id,
        error,
      // Provider-specific function removed);
      throw error;
    // Provider-specific function removed finally {
      runExecution.cleanup();
    // Provider-specific function removed
  // Provider-specific function removed
// Provider-specific function removed

function previewText(value: string, limit = 240): string {
  const normalized = value.replace(/\s+/g, ' ').trim();
***REMOVED***normalized.length <= limit) {
    return normalized;
  // Provider-specific function removed

  return `${normalized.slice(0, limit)// Provider-specific function removed...`;
// Provider-specific function removed

function classifyTraceFailureStatus(error: unknown): 'failed' | 'cancelled' {
  return isCancellationError(error) ? 'cancelled' : 'failed';
// Provider-specific function removed

function formatTraceError(error: unknown): string {
***REMOVED***error instanceof Error) {
    return error.stack ?? error.message;
  // Provider-specific function removed

  return String(error);
// Provider-specific function removed

function resolveParallelFailurePolicy(
  policy: ParallelFailurePolicy | ParallelFailurePolicyMode | undefined,
  branchCount: number,
): Required<ParallelFailurePolicy> {
***REMOVED***!policy) {
    return {
      mode: 'fail',
      minSuccessfulBranches: branchCount,
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***typeof policy === 'string') {
    return {
      mode: policy,
      minSuccessfulBranches: policy === 'continue' ? 1 : branchCount,
    // Provider-specific function removed;
  // Provider-specific function removed

  return {
    mode: policy.mode,
    minSuccessfulBranches:
      policy.mode === 'continue'
        ? Math.min(
            branchCount,
            Math.max(1, policy.minSuccessfulBranches ?? 1),
          )
        : branchCount,
  // Provider-specific function removed;
// Provider-specific function removed

function buildParallelStepFailureError(
  stepId: string,
  successfulBranchCount: number,
  branchCount: number,
  failures: readonly ParallelFailureRecord[],
  policy: Required<ParallelFailurePolicy>,
): unknown {
***REMOVED***policy.mode === 'fail') {
    return failures[0]?.error ?? new Error(`Parallel step "${stepId// Provider-specific function removed" failed.`);
  // Provider-specific function removed

  return new Error(
    [
      `Parallel step "${stepId// Provider-specific function removed" requires at least ${policy.minSuccessfulBranches// Provider-specific function removed successful branch(es),`,
      `but only ${successfulBranchCount// Provider-specific function removed/${branchCount// Provider-specific function removed completed.`,
      failures[0] ? `First branch failure: ${failures[0].errorText// Provider-specific function removed` : '',
    ]
      .filter(Boolean)
      .join(' '),
    {
      cause: failures[0]?.error,
    // Provider-specific function removed,
  );
// Provider-specific function removed

function isCancellationError(error: unknown***REMOVED***
***REMOVED***error instanceof ExecutionAbortedError) {
    return true;
  // Provider-specific function removed

***REMOVED***error instanceof AggregateError) {
    return error.errors.some((entry) => isCancellationError(entry));
  // Provider-specific function removed

***REMOVED***error instanceof Error && 'cause' in error) {
    return isCancellationError((error as Error & { cause?: unknown // Provider-specific function removed).cause);
  // Provider-specific function removed

  return false;
// Provider-specific function removed

function mergeCheckpointMetadata(
  ...records: Array<Record<string, unknown> | undefined>
): Record<string, unknown> | undefined {
  const merged = Object.assign({// Provider-specific function removed, ...records.filter(Boolean));
  return Object.keys(merged).length > 0 ? merged : undefined;
// Provider-specific function removed

function classifyCheckpointFailureStatus(error: unknown): WorkflowCheckpointStatus {
  return error instanceof Error && error.name === 'ExecutionAbortedError'
    ? 'cancelled'
    : 'failed';
// Provider-specific function removed

function loadResumedCheckpoint<TState extends object>(
  store: WorkflowCheckpointStore<TState>,
  checkpointId: string,
  workflowId: string,
): WorkflowCheckpointRecord<TState> {
  const record = store.load(checkpointId, workflowId) ?? store.load(checkpointId);
***REMOVED***!record) {
    throw new Error(`Checkpoint "${checkpointId// Provider-specific function removed" was not found for workflow "${workflowId// Provider-specific function removed".`);
  // Provider-specific function removed

  return record;
// Provider-specific function removed

function validateCheckpointAgainstDefinition<TState extends object, TContext extends object>(
  checkpoint: WorkflowCheckpointRecord<TState> | undefined,
  definition: WorkflowDefinition<TState, TContext>,
): void {
***REMOVED***!checkpoint) {
    return;
  // Provider-specific function removed

***REMOVED***checkpoint.workflowId !== definition.id) {
    throw new Error(
      `Checkpoint "${checkpoint.checkpointId// Provider-specific function removed" belongs to workflow "${checkpoint.workflowId// Provider-specific function removed", not "${definition.id// Provider-specific function removed".`,
    );
  // Provider-specific function removed

  const knownStepIds = new Set(definition.steps.map((step) => step.id));
  const unknownStepIds = checkpoint.completedStepIds.filter((stepId) => !knownStepIds.has(stepId));
***REMOVED***unknownStepIds.length > 0) {
    throw new Error(
      `Checkpoint "${checkpoint.checkpointId// Provider-specific function removed" contains completed steps that do not exist in the current definition: ${unknownStepIds.join(', ')// Provider-specific function removed.`,
    );
  // Provider-specific function removed
// Provider-specific function removed

function createCheckpointRecord<TState extends object, TContext extends object>(args: {
  checkpointId: string;
  runId: string;
  definition: WorkflowDefinition<TState, TContext>;
  status: WorkflowCheckpointStatus;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
  currentStepId?: string;
  completedStepIds: string[];
  resumedFromCheckpointId?: string;
  metadata?: Record<string, unknown>;
  state: Readonly<TState>;
  stateVersion: number;
  trace: WorkflowTraceRecord[];
  error?: unknown;
  stepOrder: string[];
// Provider-specific function removed): WorkflowCheckpointRecord<TState> {
  return {
    checkpointId: args.checkpointId,
    runId: args.runId,
    workflowId: args.definition.id,
    workflowName: args.definition.name,
    status: args.status,
    startedAt: args.startedAt,
    updatedAt: args.updatedAt,
    completedAt: args.completedAt,
    currentStepId: args.currentStepId,
    stepOrder: [...args.stepOrder],
    completedStepIds: [...args.completedStepIds],
    resumedFromCheckpointId: args.resumedFromCheckpointId,
    metadata: args.metadata ? structuredClone(args.metadata) : undefined,
    state: structuredClone(args.state),
    stateVersion: args.stateVersion,
    trace: structuredClone(args.trace),
    error: args.error ? serializeCheckpointError(args.error) : undefined,
  // Provider-specific function removed;
// Provider-specific function removed

function findNextPendingStepId<TState extends object, TContext extends object>(
  steps: readonly WorkflowStep<TState, TContext>[],
  completedStepIds: ReadonlySet<string>,
): string | undefined {
  return steps.find((step) => !completedStepIds.has(step.id))?.id;
// Provider-specific function removed

function serializeCheckpointError(error: unknown): {
  name?: string;
  message: string;
  stack?: string;
// Provider-specific function removed {
***REMOVED***error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    // Provider-specific function removed;
  // Provider-specific function removed

  return {
    message: String(error),
  // Provider-specific function removed;
// Provider-specific function removed

function createObserverEvent<TState extends object>(args: {
  runId: string;
  workflowId: string;
  sharedState: SharedState<TState>;
  trace: WorkflowTraceRecord[];
// Provider-specific function removed): WorkflowObserverEvent<TState> {
  return {
    observedAt: new Date().toISOString(),
    runId: args.runId,
    workflowId: args.workflowId,
    stateVersion: args.sharedState.getVersion(),
    state: structuredClone(args.sharedState.read()),
    trace: structuredClone(args.trace),
  // Provider-specific function removed;
// Provider-specific function removed

function resolveAgentStepPolicyHooks<
  TState extends object,
  TContext extends object,
  TOutput extends AgentOutputType,
>(
  policyHooks:
    | AgentPolicyHook<TContext, TOutput>[]
    | ((args: {
        state: Readonly<TState>;
        workflowId: string;
        stepId: string;
      // Provider-specific function removed) => AgentPolicyHook<TContext, TOutput>[])
    | undefined,
  args: {
    state: Readonly<TState>;
    workflowId: string;
    stepId: string;
  // Provider-specific function removed,
): AgentPolicyHook<TContext, TOutput>[] {
***REMOVED***!policyHooks) {
  ***REMOVED***];
  // Provider-specific function removed

  return typeof policyHooks === 'function' ? policyHooks(args) : [...policyHooks];
// Provider-specific function removed

function resolveParallelBranchPolicyHooks<
  TState extends object,
  TContext extends object,
>(
  policyHooks:
    | AgentPolicyHook<TContext, any>[]
    | ((args: {
        state: Readonly<TState>;
        workflowId: string;
        stepId: string;
        branchId: string;
      // Provider-specific function removed) => AgentPolicyHook<TContext, any>[])
    | undefined,
  args: {
    state: Readonly<TState>;
    workflowId: string;
    stepId: string;
    branchId: string;
  // Provider-specific function removed,
): AgentPolicyHook<TContext, any>[] {
***REMOVED***!policyHooks) {
  ***REMOVED***];
  // Provider-specific function removed

  return typeof policyHooks === 'function' ? policyHooks(args) : [...policyHooks];
// Provider-specific function removed

function createObserverStepEvent<TState extends object, TContext extends object>(args: {
  runId: string;
  workflowId: string;
  sharedState: SharedState<TState>;
  trace: WorkflowTraceRecord[];
  step: WorkflowStep<TState, TContext>;
// Provider-specific function removed): WorkflowStepObserverEvent<TState> {
  return {
    ...createObserverEvent(args),
    stepId: args.step.id,
    stepKind: args.step.kind,
    agentIds: args.step.agentIds,
  // Provider-specific function removed;
// Provider-specific function removed

function createObserverStepCompletedEvent<
  TState extends object,
  TContext extends object,
>(args: {
  runId: string;
  workflowId: string;
  sharedState: SharedState<TState>;
  trace: WorkflowTraceRecord[];
  step: WorkflowStep<TState, TContext>;
// Provider-specific function removed): WorkflowStepCompletedObserverEvent<TState> {
  const stepTrace = args.trace[args.trace.length - 1];
***REMOVED***!stepTrace) {
    throw new Error(`Missing trace record for completed step "${args.step.id// Provider-specific function removed".`);
  // Provider-specific function removed

  return {
    ...createObserverStepEvent(args),
    stepTrace: structuredClone(stepTrace),
  // Provider-specific function removed;
// Provider-specific function removed
