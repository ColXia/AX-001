import {
  Agent,
  type Model,
  Runner,
  retryPolicies,
  tool,
  type AgentOutputType,
  type ModelSettings,
  type ModelProvider,
  type Tool,
  type Usage,
// Provider-specific function removed from '@openai/agents-core';
import { z, ZodType // Provider-specific function removed from 'zod';

import type {
  AgentInstructions,
  AgentProfile,
  ResolvedProfileOutput,
// Provider-specific function removed from './agent-profile.js';
import {
  AgentPolicyViolationError,
  buildToolPolicyGuardrails,
  runAgentAfterPolicies,
  runAgentBeforePolicies,
  type AgentPolicyHook,
// Provider-specific function removed from './agent-policy.js';
import {
  buildDynamicContextTools,
  renderDynamicContextProviderGuidance,
// Provider-specific function removed from './dynamic-context.js';
import { createExecutionSignal, throwIfAborted // Provider-specific function removed from './execution-control.js';

export type StructuredOutputMode = 'native' | 'tool';

export interface AgentRuntimeRetryBackoffDefaults {
  initialDelayMs?: number;
  maxDelayMs?: number;
  multiplier?: number;
  jitter?: boolean;
// Provider-specific function removed

export interface AgentRuntimeRetryDefaults {
  maxRetries?: number;
  useProviderSuggested?: boolean;
  retryNetworkErrors?: boolean;
  respectRetryAfter?: boolean;
  retryHttpStatuses?: number[];
  backoff?: AgentRuntimeRetryBackoffDefaults;
// Provider-specific function removed

export interface AgentRuntimeDefaults {
  model?: string | Model;
  modelSettings?: ModelSettings;
  retryDefaults?: AgentRuntimeRetryDefaults;
  modelProvider?: ModelProvider;
  tracingDisabled?: boolean;
  workflowName?: string;
  structuredOutputMode?: StructuredOutputMode;
  maxStructuredOutputRetries?: number;
  policyHooks?: AgentPolicyHook<any, any>[];
// Provider-specific function removed

export interface AgentRunOptions<
  TContext extends object,
  TOutput extends AgentOutputType = AgentOutputType,
> {
  context?: TContext;
  maxTurns?: number;
  signal?: AbortSignal;
  timeoutMs?: number;
  maxStructuredOutputRetries?: number;
  policyHooks?: AgentPolicyHook<TContext, TOutput>[];
// Provider-specific function removed

export interface AgentRunGuardrailSummary {
  input: Array<Record<string, unknown>>;
  output: Array<Record<string, unknown>>;
  toolInput: Array<Record<string, unknown>>;
  toolOutput: Array<Record<string, unknown>>;
// Provider-specific function removed

export interface StructuredOutputRunTelemetry {
  mode: 'tool';
  finalPath: 'tool' | 'tool_retry' | 'text_fallback' | 'repair_fallback';
  primaryAttempts: number;
  totalRunnerCalls: number;
  textFallbackAttempted: boolean;
  repairAttempts: number;
  repairSource?: 'primary' | 'text_fallback';
// Provider-specific function removed

export interface AgentRunTelemetry {
  structuredOutput?: StructuredOutputRunTelemetry;
// Provider-specific function removed

export interface AgentRunResult<TOutput extends AgentOutputType> {
  output: ResolvedProfileOutput<TOutput>;
  usage?: Record<string, unknown>;
  guardrails?: AgentRunGuardrailSummary;
  telemetry?: AgentRunTelemetry;
// Provider-specific function removed

interface PreparedAgentRun<TContext extends object, TOutput extends AgentOutputType> {
  agent: Agent<TContext, any>;
  structuredOutputMode?: StructuredOutputMode;
  maxStructuredOutputRetries: number;
  finalize: (finalOutput: unknown) => ResolvedProfileOutput<TOutput>;
  textOutputFallback?: {
    agent: Agent<TContext, 'text'>;
    finalize: (finalOutput: unknown) => ResolvedProfileOutput<TOutput>;
  // Provider-specific function removed;
  structuredOutputRepairFallback?: {
    agent: Agent<TContext, 'text'>;
    maxAttempts: number;
    buildInput: (args: {
      originalInput: string;
      failureMessage: string;
      invalidOutput: string;
    // Provider-specific function removed) => string;
    finalize: (finalOutput: unknown) => ResolvedProfileOutput<TOutput>;
  // Provider-specific function removed;
// Provider-specific function removed

interface StructuredOutputTelemetryState {
  primaryAttempts: number;
  textFallbackAttempted: boolean;
  repairAttempts: number;
  repairSource?: 'primary' | 'text_fallback';
// Provider-specific function removed

interface ChatroomOverlengthPolicyMetadata {
  reasonKind: 'chatroom_overlength';
  maxCharacters: number;
  actualCharacters: number;
// Provider-specific function removed

const MAX_POLICY_REWRITE_RETRIES = 2;

class StructuredOutputRetryableError extends Error {
  readonly rawOutput?: unknown;

  constructor(message: string, options?: { cause?: unknown; rawOutput?: unknown // Provider-specific function removed) {
    super(message, options);
    this.name = 'StructuredOutputRetryableError';
    this.rawOutput = options?.rawOutput;
  // Provider-specific function removed
// Provider-specific function removed

export class AgentRuntime {
  private readonly defaults: AgentRuntimeDefaults;
  private readonly runner: Runner;

  constructor(defaults: AgentRuntimeDefaults = {// Provider-specific function removed) {
    const retryDefaults = resolveRetryDefaults(defaults.retryDefaults);
    this.defaults = {
      ...defaults,
      retryDefaults,
      modelSettings: mergeModelSettings(undefined, defaults.modelSettings, retryDefaults),
    // Provider-specific function removed;

    this.runner = new Runner({
      ...(this.defaults.model ? { model: this.defaults.model // Provider-specific function removed : {// Provider-specific function removed),
      ...(this.defaults.modelSettings ? { modelSettings: this.defaults.modelSettings // Provider-specific function removed : {// Provider-specific function removed),
      ...(this.defaults.modelProvider ? { modelProvider: this.defaults.modelProvider // Provider-specific function removed : {// Provider-specific function removed),
      ...(this.defaults.tracingDisabled !== undefined
        ? { tracingDisabled: this.defaults.tracingDisabled // Provider-specific function removed
        : {// Provider-specific function removed),
      ...(this.defaults.workflowName ? { workflowName: this.defaults.workflowName // Provider-specific function removed : {// Provider-specific function removed),
    // Provider-specific function removed);
  // Provider-specific function removed

  async run<TContext extends object, TOutput extends AgentOutputType>(
    profile: AgentProfile<TContext, TOutput>,
    input: string,
    options: AgentRunOptions<TContext, TOutput> = {// Provider-specific function removed,
  ): Promise<ResolvedProfileOutput<TOutput>> {
    return (await this.runDetailed(profile, input, options)).output;
  // Provider-specific function removed

  async runDetailed<TContext extends object, TOutput extends AgentOutputType>(
    profile: AgentProfile<TContext, TOutput>,
    input: string,
    options: AgentRunOptions<TContext, TOutput> = {// Provider-specific function removed,
  ): Promise<AgentRunResult<TOutput>> {
    const policyHooks = resolveAgentPolicyHooks(
      this.defaults.policyHooks,
      profile.policyHooks,
      options.policyHooks,
    );
    const preparedRun = this.prepareRun(profile, policyHooks);
  ***REMOVED***options.maxStructuredOutputRetries !== undefined) {
      preparedRun.maxStructuredOutputRetries = Math.max(0, options.maxStructuredOutputRetries);
    // Provider-specific function removed
    const execution = createExecutionSignal({
      parentSignal: options.signal,
      timeoutMs: options.timeoutMs,
      scope: 'agent',
      targetId: profile.id,
      abortMessage: `Agent "${profile.id// Provider-specific function removed" run was aborted.`,
    // Provider-specific function removed);
    const runOptions = {
      ...(options.context ? { context: options.context // Provider-specific function removed : {// Provider-specific function removed),
      ...(options.maxTurns ? { maxTurns: options.maxTurns // Provider-specific function removed : {// Provider-specific function removed),
      ...(execution.signal ? { signal: execution.signal // Provider-specific function removed : {// Provider-specific function removed),
    // Provider-specific function removed;

    try {
      throwIfAborted(execution.signal, {
        scope: 'agent',
        targetId: profile.id,
        abortMessage: `Agent "${profile.id// Provider-specific function removed" run was aborted.`,
      // Provider-specific function removed);
      await runAgentBeforePolicies(policyHooks, {
        profile,
        input,
        context: options.context,
        maxTurns: options.maxTurns,
        timeoutMs: options.timeoutMs,
      // Provider-specific function removed);

      const structuredOutputTelemetry = createStructuredOutputTelemetryState(preparedRun);
      let runInput = input;
      let policyRewriteRetries = 0;
      let attempt = 0;
      while (true) {
        try {
        ***REMOVED***structuredOutputTelemetry) {
            structuredOutputTelemetry.primaryAttempts += 1;
          // Provider-specific function removed
          const result = await this.runner.run(preparedRun.agent, runInput, {
            ...runOptions,
          // Provider-specific function removed);

          throwIfAborted(execution.signal, {
            scope: 'agent',
            targetId: profile.id,
            abortMessage: `Agent "${profile.id// Provider-specific function removed" run was aborted.`,
          // Provider-specific function removed);

        ***REMOVED***result.finalOutput === undefined) {
            throw new StructuredOutputRetryableError(
              `Agent "${profile.id// Provider-specific function removed" completed without a final output.`,
            );
          // Provider-specific function removed

          const usage = serializeUsage(result.runContext.usage);
          const output = preparedRun.finalize(result.finalOutput);
          await runAgentAfterPolicies(policyHooks, {
            profile,
            input: runInput,
            context: options.context,
            maxTurns: options.maxTurns,
            timeoutMs: options.timeoutMs,
            output,
            usage,
          // Provider-specific function removed);

          return {
            output,
            usage,
            guardrails: serializeGuardrails(result),
            telemetry: buildAgentRunTelemetry(
              structuredOutputTelemetry,
              structuredOutputTelemetry?.primaryAttempts === 1 ? 'tool' : 'tool_retry',
            ),
          // Provider-specific function removed;
        // Provider-specific function removed catch (error) {
        ***REMOVED***execution.signal?.aborted) {
            throwIfAborted(execution.signal, {
              scope: 'agent',
              targetId: profile.id,
              abortMessage: `Agent "${profile.id// Provider-specific function removed" run was aborted.`,
            // Provider-specific function removed);
          // Provider-specific function removed

          const rewrittenInput = maybeBuildPolicyRetryInput({
            error,
            originalInput: input,
            retryCount: policyRewriteRetries,
          // Provider-specific function removed);
        ***REMOVED***rewrittenInput) {
            runInput = rewrittenInput;
            policyRewriteRetries += 1;
            continue;
          // Provider-specific function removed

        ***REMOVED***
            !(error instanceof StructuredOutputRetryableError) ||
            attempt >= preparedRun.maxStructuredOutputRetries
        ***REMOVED***
          ***REMOVED***
              error instanceof StructuredOutputRetryableError &&
              preparedRun.textOutputFallback
          ***REMOVED***
              try {
              ***REMOVED***structuredOutputTelemetry) {
                  structuredOutputTelemetry.textFallbackAttempted = true;
                // Provider-specific function removed
                const fallbackResult = await this.runner.run(
                  preparedRun.textOutputFallback.agent,
                  runInput,
                  {
                    ...runOptions,
                  // Provider-specific function removed,
                );

                throwIfAborted(execution.signal, {
                  scope: 'agent',
                  targetId: profile.id,
                  abortMessage: `Agent "${profile.id// Provider-specific function removed" run was aborted.`,
                // Provider-specific function removed);

              ***REMOVED***fallbackResult.finalOutput === undefined) {
                  throw new StructuredOutputRetryableError(
                    `Agent "${profile.id// Provider-specific function removed" completed without a final output during structured-output text fallback.`,
                  );
                // Provider-specific function removed

                const usage = serializeUsage(fallbackResult.runContext.usage);
                const output = preparedRun.textOutputFallback.finalize(
                  fallbackResult.finalOutput,
                );
                await runAgentAfterPolicies(policyHooks, {
                  profile,
                  input: runInput,
                  context: options.context,
                  maxTurns: options.maxTurns,
                  timeoutMs: options.timeoutMs,
                  output,
                  usage,
                // Provider-specific function removed);

                return {
                  output,
                  usage,
                  guardrails: serializeGuardrails(fallbackResult),
                  telemetry: buildAgentRunTelemetry(
                    structuredOutputTelemetry,
                    'text_fallback',
                  ),
                // Provider-specific function removed;
              // Provider-specific function removed catch (fallbackError) {
              ***REMOVED***execution.signal?.aborted) {
                  throwIfAborted(execution.signal, {
                    scope: 'agent',
                    targetId: profile.id,
                    abortMessage: `Agent "${profile.id// Provider-specific function removed" run was aborted.`,
                  // Provider-specific function removed);
                // Provider-specific function removed

              ***REMOVED***fallbackError instanceof StructuredOutputRetryableError) {
                  const repaired = await this.tryStructuredOutputRepair({
                    profile,
                    preparedRun,
                    input: runInput,
                    runOptions,
                    signal: execution.signal,
                    repairableError: fallbackError.rawOutput !== undefined
                      ? fallbackError
                      : error,
                    telemetry: structuredOutputTelemetry
                      ? {
                          state: structuredOutputTelemetry,
                          source: 'text_fallback',
                        // Provider-specific function removed
                      : undefined,
                  // Provider-specific function removed);
                ***REMOVED***repaired) {
                    await runAgentAfterPolicies(policyHooks, {
                      profile,
                      input: runInput,
                      context: options.context,
                      maxTurns: options.maxTurns,
                      timeoutMs: options.timeoutMs,
                      output: repaired.output,
                      usage: repaired.usage,
                    // Provider-specific function removed);

                    return repaired;
                  // Provider-specific function removed
                // Provider-specific function removed

              ***REMOVED***fallbackError instanceof StructuredOutputRetryableError) {
                  throw new Error(
                    [
                      `Agent "${profile.id// Provider-specific function removed" failed to produce valid structured output`,
                      `after ${attempt + 1// Provider-specific function removed tool attempt(s) and one text fallback attempt.`,
                      error.message,
                      fallbackError.message,
                    ].join(' '),
                    { cause: fallbackError // Provider-specific function removed,
                  );
                // Provider-specific function removed

                throw fallbackError;
              // Provider-specific function removed
            // Provider-specific function removed

          ***REMOVED***error instanceof StructuredOutputRetryableError) {
              const repaired = await this.tryStructuredOutputRepair({
                profile,
                preparedRun,
                input: runInput,
                runOptions,
                signal: execution.signal,
                repairableError: error,
                telemetry: structuredOutputTelemetry
                  ? {
                      state: structuredOutputTelemetry,
                      source: 'primary',
                    // Provider-specific function removed
                  : undefined,
              // Provider-specific function removed);
            ***REMOVED***repaired) {
                await runAgentAfterPolicies(policyHooks, {
                  profile,
                  input: runInput,
                  context: options.context,
                  maxTurns: options.maxTurns,
                  timeoutMs: options.timeoutMs,
                  output: repaired.output,
                  usage: repaired.usage,
                // Provider-specific function removed);

                return repaired;
              // Provider-specific function removed

              throw new Error(
                [
                  `Agent "${profile.id// Provider-specific function removed" failed to produce valid structured output`,
                  `after ${attempt + 1// Provider-specific function removed attempt(s).`,
                  error.message,
                ].join(' '),
                { cause: error // Provider-specific function removed,
              );
            // Provider-specific function removed

            throw error;
          // Provider-specific function removed

          attempt += 1;
        // Provider-specific function removed
      // Provider-specific function removed
    // Provider-specific function removed finally {
      execution.cleanup();
    // Provider-specific function removed
  // Provider-specific function removed

  buildAgent<TContext extends object, TOutput extends AgentOutputType>(
    profile: AgentProfile<TContext, TOutput>,
    policyHooks: readonly AgentPolicyHook<TContext, TOutput>[] = [],
  ): Agent<TContext, TOutput> {
    const modelSettings = resolveAgentModelSettings(
      this.defaults.modelSettings,
      profile.modelSettings,
      this.defaults.retryDefaults,
    );

    return new Agent<TContext, TOutput>({
      name: profile.name,
      instructions: this.createInstructionsResolver(profile),
      handoffDescription: profile.handoffDescription ?? profile.description,
      outputType: profile.outputType,
      ...(profile.model ?? this.defaults.model
        ? { model: profile.model ?? this.defaults.model // Provider-specific function removed
        : {// Provider-specific function removed),
      ...(modelSettings ? { modelSettings // Provider-specific function removed : {// Provider-specific function removed),
      tools: applyPolicyHooksToTools(resolveRawAgentTools(profile), profile, policyHooks),
      ...(profile.toolUseBehavior
        ? { toolUseBehavior: profile.toolUseBehavior // Provider-specific function removed
        : {// Provider-specific function removed),
    // Provider-specific function removed);
  // Provider-specific function removed

  private prepareRun<TContext extends object, TOutput extends AgentOutputType>(
    profile: AgentProfile<TContext, TOutput>,
    policyHooks: readonly AgentPolicyHook<TContext, TOutput>[] = [],
  ): PreparedAgentRun<TContext, TOutput> {
  ***REMOVED***this.shouldUseStructuredOutputToolMode(profile)) {
      return this.prepareStructuredOutputToolRun(
        profile as AgentProfile<TContext, Exclude<TOutput, 'text'>>,
        policyHooks as readonly AgentPolicyHook<TContext, Exclude<TOutput, 'text'>>[],
      );
    // Provider-specific function removed

    const agent = this.buildAgent(profile, policyHooks);
    return {
      agent,
      maxStructuredOutputRetries: 0,
      finalize: (finalOutput) => finalOutput as ResolvedProfileOutput<TOutput>,
    // Provider-specific function removed;
  // Provider-specific function removed

  private prepareStructuredOutputToolRun<
    TContext extends object,
    TOutput extends Exclude<AgentOutputType, 'text'>,
  >(
    profile: AgentProfile<TContext, TOutput>,
    policyHooks: readonly AgentPolicyHook<TContext, TOutput>[] = [],
  ): PreparedAgentRun<TContext, TOutput> {
    const toolName = createStructuredOutputToolName(profile.id);
    const modelSettings = resolveAgentModelSettings(
      this.defaults.modelSettings,
      profile.modelSettings,
      this.defaults.retryDefaults,
    );
    const repairModelSettings = {
      ...(modelSettings ?? {// Provider-specific function removed),
      temperature: 0,
    // Provider-specific function removed satisfies ModelSettings;
    const submitStructuredOutputTool = tool({
      name: toolName,
      description: [
        'Submit the final structured output for this agent.',
        'Call this tool exactly once when your answer is complete.',
        'Do not return plain text, markdown, or raw JSON outside the tool call.',
      ].join(' '),
      parameters: profile.outputType as never,
      strict: true,
      execute: (payload) => payload,
    // Provider-specific function removed);

    const agent = new Agent<TContext, 'text'>({
      name: profile.name,
      instructions: this.createInstructionsResolver(profile, [
        `Finish by calling the tool "${toolName// Provider-specific function removed" exactly once.`,
        'Do not send the final answer as plain text.',
        'If tool validation fails, correct the payload and call the tool again.',
      ]),
      handoffDescription: profile.handoffDescription ?? profile.description,
      outputType: 'text',
      ...(profile.model ?? this.defaults.model
        ? { model: profile.model ?? this.defaults.model // Provider-specific function removed
        : {// Provider-specific function removed),
      ...(modelSettings ? { modelSettings // Provider-specific function removed : {// Provider-specific function removed),
      tools: applyPolicyHooksToTools(
        [...resolveRawAgentTools(profile), submitStructuredOutputTool],
        profile,
        policyHooks,
      ),
      toolUseBehavior: {
        stopAtToolNames: [toolName],
      // Provider-specific function removed,
    // Provider-specific function removed);

    return {
      agent,
      structuredOutputMode: 'tool',
      maxStructuredOutputRetries: this.defaults.maxStructuredOutputRetries ?? 2,
      finalize: (finalOutput) =>
        parseStructuredOutput(
          profile.id,
          profile.outputType,
          finalOutput,
        ) as ResolvedProfileOutput<TOutput>,
      textOutputFallback: {
        agent: new Agent<TContext, 'text'>({
          name: profile.name,
          instructions: this.createInstructionsResolver(profile, [
            'If tool calling is unavailable or unreliable, return the final answer as raw JSON.',
            'Return JSON only with no markdown fences and no surrounding prose.',
            renderStructuredOutputSchemaGuidance(profile.outputType),
          ]),
          handoffDescription: profile.handoffDescription ?? profile.description,
          outputType: 'text',
          ...(profile.model ?? this.defaults.model
            ? { model: profile.model ?? this.defaults.model // Provider-specific function removed
            : {// Provider-specific function removed),
          ...(modelSettings ? { modelSettings // Provider-specific function removed : {// Provider-specific function removed),
          tools: applyPolicyHooksToTools(
            resolveRawAgentTools(profile),
            profile,
            policyHooks,
          ),
        // Provider-specific function removed),
        finalize: (finalOutput) =>
          parseStructuredOutput(
            profile.id,
            profile.outputType,
            finalOutput,
          ) as ResolvedProfileOutput<TOutput>,
      // Provider-specific function removed,
      structuredOutputRepairFallback: {
        agent: new Agent<TContext, 'text'>({
          name: `${profile.name// Provider-specific function removed JSON Repair`,
          instructions: [
            'You repair malformed model output into strict JSON that matches the required schema exactly.',
            'Return JSON only with no markdown fences and no surrounding prose.',
            'Preserve the original meaning, language, and evidence whenever possible.',
            'If a field is missing, infer conservatively from the malformed payload. When uncertain, choose the most conservative schema-valid value.',
            renderStructuredOutputSchemaGuidance(profile.outputType),
          ].join('\n\n'),
          outputType: 'text',
          ...(profile.model ?? this.defaults.model
            ? { model: profile.model ?? this.defaults.model // Provider-specific function removed
            : {// Provider-specific function removed),
          ...(repairModelSettings ? { modelSettings: repairModelSettings // Provider-specific function removed : {// Provider-specific function removed),
        // Provider-specific function removed),
        maxAttempts: 2,
        buildInput: ({ originalInput, failureMessage, invalidOutput // Provider-specific function removed) =>
          buildStructuredOutputRepairInput({
            originalInput,
            failureMessage,
            invalidOutput,
          // Provider-specific function removed),
        finalize: (finalOutput) =>
          parseStructuredOutput(
            profile.id,
            profile.outputType,
            finalOutput,
          ) as ResolvedProfileOutput<TOutput>,
      // Provider-specific function removed,
    // Provider-specific function removed;
  // Provider-specific function removed

  private async tryStructuredOutputRepair<
    TContext extends object,
    TOutput extends AgentOutputType,
  >(args: {
    profile: AgentProfile<TContext, TOutput>;
    preparedRun: PreparedAgentRun<TContext, TOutput>;
    input: string;
    runOptions: {
      context?: TContext;
      maxTurns?: number;
      signal?: AbortSignal;
    // Provider-specific function removed;
    signal?: AbortSignal;
    repairableError: StructuredOutputRetryableError;
    telemetry?: {
      state: StructuredOutputTelemetryState;
      source: 'primary' | 'text_fallback';
    // Provider-specific function removed;
  // Provider-specific function removed): Promise<AgentRunResult<TOutput> | null> {
    const repairFallback = args.preparedRun.structuredOutputRepairFallback;
    const invalidOutput = renderStructuredOutputRepairPayload(
      args.repairableError.rawOutput,
    );
  ***REMOVED***!repairFallback || !invalidOutput) {
  ***REMOVED***
    // Provider-specific function removed

    const repairInput = repairFallback.buildInput({
      originalInput: args.input,
      failureMessage: args.repairableError.message,
      invalidOutput,
    // Provider-specific function removed);

    let lastError: unknown;
    for (let attempt = 0; attempt < repairFallback.maxAttempts; attempt += 1) {
      try {
      ***REMOVED***args.telemetry) {
          args.telemetry.state.repairAttempts += 1;
          args.telemetry.state.repairSource = args.telemetry.source;
        // Provider-specific function removed
        const result = await this.runner.run(repairFallback.agent, repairInput, {
          ...args.runOptions,
          maxTurns: 1,
        // Provider-specific function removed);

        throwIfAborted(args.signal, {
          scope: 'agent',
          targetId: args.profile.id,
          abortMessage: `Agent "${args.profile.id// Provider-specific function removed" run was aborted.`,
        // Provider-specific function removed);

      ***REMOVED***result.finalOutput === undefined) {
          throw new StructuredOutputRetryableError(
            `Agent "${args.profile.id// Provider-specific function removed" completed without a final output during structured-output repair.`,
          );
        // Provider-specific function removed

        return {
          output: repairFallback.finalize(result.finalOutput),
          usage: serializeUsage(result.runContext.usage),
          guardrails: serializeGuardrails(result),
          telemetry: buildAgentRunTelemetry(
            args.telemetry?.state,
            'repair_fallback',
          ),
        // Provider-specific function removed;
      // Provider-specific function removed catch (error) {
      ***REMOVED***args.signal?.aborted) {
          throwIfAborted(args.signal, {
            scope: 'agent',
            targetId: args.profile.id,
            abortMessage: `Agent "${args.profile.id// Provider-specific function removed" run was aborted.`,
          // Provider-specific function removed);
        // Provider-specific function removed

        lastError = error;
      // Provider-specific function removed
    // Provider-specific function removed

  ***REMOVED***lastError instanceof StructuredOutputRetryableError) {
      throw new Error(
        [
          `Agent "${args.profile.id// Provider-specific function removed" could not repair malformed structured output.`,
          args.repairableError.message,
          lastError.message,
        ].join(' '),
        { cause: lastError // Provider-specific function removed,
      );
    // Provider-specific function removed

  ***REMOVED***lastError) {
      throw lastError;
    // Provider-specific function removed

***REMOVED***
  // Provider-specific function removed

  private shouldUseStructuredOutputToolMode<TContext extends object>(
    profile: AgentProfile<TContext, AgentOutputType>,
  ***REMOVED***
    return this.defaults.structuredOutputMode === 'tool' && profile.outputType !== 'text';
  // Provider-specific function removed

  private createInstructionsResolver<
    TContext extends object,
    TOutput extends AgentOutputType,
  >(
    profile: AgentProfile<TContext, TOutput>,
    additionalInstructions: string[] = [],
***REMOVED***
    return async (runContext: { context?: TContext // Provider-specific function removed) => {
      const baseInstructions = await renderBaseInstructions(
        profile.instructions,
        runContext.context,
      );
      const dynamicContextGuidance = renderDynamicContextProviderGuidance(
        profile.dynamicContextProviders,
      );
      const renderedContext = renderContextReaders(
        profile.contextReaders,
        runContext.context,
        profile.contextTokenBudget,
      );

    ***REMOVED***
        baseInstructions,
        ...additionalInstructions,
        dynamicContextGuidance,
        renderedContext,
      ]
        .map((section) => section?.trim())
        .filter((section): section is string => Boolean(section))
        .join('\n\n');
    // Provider-specific function removed;
  // Provider-specific function removed
// Provider-specific function removed

function createStructuredOutputToolName(profileId: string): string {
  const normalized = profileId
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

  return `submit_${normalized || 'agent'// Provider-specific function removed_output`;
// Provider-specific function removed

function parseStructuredOutput<TOutput extends Exclude<AgentOutputType, 'text'>>(
  profileId: string,
  outputType: TOutput,
  finalOutput: unknown,
): ResolvedProfileOutput<TOutput> {
  let parsed: unknown;
***REMOVED***typeof finalOutput === 'string') {
  ***REMOVED***finalOutput.trim().length === 0) {
      throw new StructuredOutputRetryableError(
        `Agent "${profileId// Provider-specific function removed" did not return a structured output payload.`,
        { rawOutput: finalOutput // Provider-specific function removed,
      );
    // Provider-specific function removed

    try {
      parsed = JSON.parse(normalizeStructuredOutputJsonText(finalOutput));
    // Provider-specific function removed catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new StructuredOutputRetryableError(
        `Agent "${profileId// Provider-specific function removed" returned invalid JSON for structured output: ${message// Provider-specific function removed`,
        { cause: error, rawOutput: finalOutput // Provider-specific function removed,
      );
    // Provider-specific function removed
  // Provider-specific function removed else if (finalOutput === undefined) {
    throw new StructuredOutputRetryableError(
      `Agent "${profileId// Provider-specific function removed" did not return a structured output payload.`,
    );
  // Provider-specific function removed else {
    parsed = finalOutput;
  // Provider-specific function removed

***REMOVED***outputType instanceof ZodType) {
    try {
      return outputType.parse(parsed) as ResolvedProfileOutput<TOutput>;
    // Provider-specific function removed catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new StructuredOutputRetryableError(
        `Agent "${profileId// Provider-specific function removed" returned structured output that failed schema validation: ${message// Provider-specific function removed`,
        { cause: error, rawOutput: finalOutput // Provider-specific function removed,
      );
    // Provider-specific function removed
  // Provider-specific function removed

  return parsed as ResolvedProfileOutput<TOutput>;
// Provider-specific function removed

function createStructuredOutputTelemetryState(
  preparedRun: PreparedAgentRun<any, any>,
): StructuredOutputTelemetryState | undefined {
***REMOVED***preparedRun.structuredOutputMode !== 'tool') {
    return undefined;
  // Provider-specific function removed

  return {
    primaryAttempts: 0,
    textFallbackAttempted: false,
    repairAttempts: 0,
  // Provider-specific function removed;
// Provider-specific function removed

function buildAgentRunTelemetry(
  structuredOutput: StructuredOutputTelemetryState | undefined,
  finalPath: StructuredOutputRunTelemetry['finalPath'],
): AgentRunTelemetry | undefined {
***REMOVED***!structuredOutput) {
    return undefined;
  // Provider-specific function removed

  return {
    structuredOutput: {
      mode: 'tool',
      finalPath,
      primaryAttempts: structuredOutput.primaryAttempts,
      totalRunnerCalls:
        structuredOutput.primaryAttempts +
        (structuredOutput.textFallbackAttempted ? 1 : 0) +
        structuredOutput.repairAttempts,
      textFallbackAttempted: structuredOutput.textFallbackAttempted,
      repairAttempts: structuredOutput.repairAttempts,
      repairSource: structuredOutput.repairSource,
    // Provider-specific function removed,
  // Provider-specific function removed;
// Provider-specific function removed

function normalizeStructuredOutputJsonText(finalOutput: string): string {
  const trimmed = stripMarkdownCodeFence(finalOutput.trim());
***REMOVED***trimmed.length === 0) {
    return trimmed;
  // Provider-specific function removed

  const extracted = extractJsonLikePayload(trimmed);
  return extracted ?? trimmed;
// Provider-specific function removed

function stripMarkdownCodeFence(value: string): string {
  const fencedMatch = value.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fencedMatch?.[1]?.trim() ?? value;
// Provider-specific function removed

function extractJsonLikePayload(value: string): string | undefined {
***REMOVED***startsWithJsonDelimiter(value)) {
    return value;
  // Provider-specific function removed

  const objectStart = value.indexOf('{');
  const objectEnd = value.lastIndexOf('// Provider-specific function removed');
***REMOVED***objectStart !== -1 && objectEnd > objectStart) {
    return value.slice(objectStart, objectEnd + 1);
  // Provider-specific function removed

  const arrayStart = value.indexOf('[');
  const arrayEnd = value.lastIndexOf(']');
***REMOVED***arrayStart !== -1 && arrayEnd > arrayStart) {
    return value.slice(arrayStart, arrayEnd + 1);
  // Provider-specific function removed

  return undefined;
// Provider-specific function removed

function startsWithJsonDelimiter(value: string***REMOVED***
  return value.startsWith('{') || value.startsWith('[');
// Provider-specific function removed

function renderStructuredOutputSchemaGuidance(
  outputType: Exclude<AgentOutputType, 'text'>,
): string {
***REMOVED***!(outputType instanceof ZodType)) {
    return 'The JSON response must match the expected structured output schema exactly.';
  // Provider-specific function removed

  try {
    const jsonSchema = z.toJSONSchema(outputType);
  ***REMOVED***
      'JSON schema:',
      JSON.stringify(jsonSchema, null, 2),
    ].join('\n');
  // Provider-specific function removed catch {
    return 'The JSON response must match the expected structured output schema exactly.';
  // Provider-specific function removed
// Provider-specific function removed

function buildStructuredOutputRepairInput(args: {
  originalInput: string;
  failureMessage: string;
  invalidOutput: string;
// Provider-specific function removed): string {
***REMOVED***
    'The previous model output was intended to be strict JSON, but it was malformed or schema-invalid.',
    `Original task:\n${args.originalInput// Provider-specific function removed`,
    `Failure:\n${args.failureMessage// Provider-specific function removed`,
    'Malformed output to repair:',
    '[MALFORMED OUTPUT START]',
    args.invalidOutput,
    '[MALFORMED OUTPUT END]',
    'Rewrite it as strict JSON that matches the schema exactly.',
    'Return JSON only.',
  ].join('\n\n');
// Provider-specific function removed

function renderStructuredOutputRepairPayload(value: unknown): string | undefined {
***REMOVED***typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  // Provider-specific function removed

***REMOVED***value === undefined) {
    return undefined;
  // Provider-specific function removed

  try {
    return JSON.stringify(value, null, 2);
  // Provider-specific function removed catch {
    return String(value);
  // Provider-specific function removed
// Provider-specific function removed

async function renderBaseInstructions<TContext>(
  instructions: AgentInstructions<TContext>,
  context?: TContext,
): Promise<string> {
***REMOVED***typeof instructions === 'function') {
    return instructions({ context // Provider-specific function removed);
  // Provider-specific function removed

  return instructions;
// Provider-specific function removed

function renderContextReaders<TContext>(
  contextReaders: AgentProfile<TContext>['contextReaders'],
  context?: TContext,
  tokenBudget?: number,
): string | undefined {
***REMOVED***!context || !contextReaders || contextReaders.length === 0) {
    return undefined;
  // Provider-specific function removed

  const sections = contextReaders
    .map((reader) => {
      const content = reader.render(context)?.trim();
    ***REMOVED***!content) {
        return undefined;
      // Provider-specific function removed

      return `[${reader.title// Provider-specific function removed]\n${content// Provider-specific function removed`;
    // Provider-specific function removed)
    .filter((section): section is string => Boolean(section));

***REMOVED***sections.length === 0) {
    return undefined;
  // Provider-specific function removed

  // If a token budget is set, truncate sections that exceed it.
***REMOVED***tokenBudget !== undefined && tokenBudget > 0) {
    const budgetedSections = applyContextTokenBudget(sections, tokenBudget);
  ***REMOVED***budgetedSections.length === 0) {
      return undefined;
    // Provider-specific function removed
  ***REMOVED***'Runtime context (read-only):', ...budgetedSections].join('\n\n');
  // Provider-specific function removed

***REMOVED***'Runtime context (read-only):', ...sections].join('\n\n');
// Provider-specific function removed

/**
 * Approximate character-to-token ratio for budget estimation.
 * Conservative: ~3 characters per token for mixed Chinese/English.
 */
const BUDGET_CHARS_PER_TOKEN = 3;

/**
 * Apply a token budget to rendered context sections.
 *
 * Keeps sections in priority order (first = highest priority).
 * If a single section exceeds the budget, it is truncated.
 * If the total exceeds the budget, lower-priority sections are dropped.
 */
function applyContextTokenBudget(
  sections: readonly string[],
  tokenBudget: number,
): string[] {
  const charBudget = tokenBudget * BUDGET_CHARS_PER_TOKEN;
  const result: string[] = [];
  let usedChars = 0;

  for (const section of sections) {
    const remainingChars = charBudget - usedChars;
  ***REMOVED***remainingChars <= 0) {
      break;
    // Provider-specific function removed

  ***REMOVED***section.length <= remainingChars) {
      result.push(section);
      usedChars += section.length + 2; // +2 for the \n\n separator
    // Provider-specific function removed else {
      // Truncate this section to fit the remaining budget.
      const truncated = section.slice(0, Math.max(0, remainingChars - 3)) + '...';
      result.push(truncated);
      usedChars = charBudget; // Budget is now fully consumed.
      break;
    // Provider-specific function removed
  // Provider-specific function removed

  return result;
// Provider-specific function removed

function resolveRawAgentTools<TContext extends object, TOutput extends AgentOutputType>(
  profile: AgentProfile<TContext, TOutput>,
) {
***REMOVED***
    ...(profile.tools ?? []),
    ...buildDynamicContextTools(profile.dynamicContextProviders),
  ];
// Provider-specific function removed

function applyPolicyHooksToTools<TContext extends object, TOutput extends AgentOutputType>(
  tools: readonly Tool<TContext>[],
  profile: AgentProfile<TContext, TOutput>,
  policyHooks: readonly AgentPolicyHook<TContext, TOutput>[],
): Tool<TContext>[] {
***REMOVED***policyHooks.length === 0) {
  ***REMOVED***...tools];
  // Provider-specific function removed

  const guardrails = buildToolPolicyGuardrails(profile, policyHooks);
***REMOVED***guardrails.input.length === 0 && guardrails.output.length === 0) {
  ***REMOVED***...tools];
  // Provider-specific function removed

  return tools.map((item) => {
  ***REMOVED***item.type !== 'function') {
      return item;
    // Provider-specific function removed

    return {
      ...item,
      inputGuardrails: [...(item.inputGuardrails ?? []), ...guardrails.input],
      outputGuardrails: [...(item.outputGuardrails ?? []), ...guardrails.output],
    // Provider-specific function removed;
  // Provider-specific function removed);
// Provider-specific function removed

function serializeUsage(usage: Usage | undefined): Record<string, unknown> | undefined {
***REMOVED***!usage) {
    return undefined;
  // Provider-specific function removed

  return {
    requests: usage.requests,
    inputTokens: usage.inputTokens,
    outputTokens: usage.outputTokens,
    totalTokens: usage.totalTokens,
    inputTokensDetails: usage.inputTokensDetails.map((entry) => ({ ...entry // Provider-specific function removed)),
    outputTokensDetails: usage.outputTokensDetails.map((entry) => ({ ...entry // Provider-specific function removed)),
    requestUsageEntries: usage.requestUsageEntries?.map((entry) => ({
      inputTokens: entry.inputTokens,
      outputTokens: entry.outputTokens,
      totalTokens: entry.totalTokens,
      inputTokensDetails: { ...entry.inputTokensDetails // Provider-specific function removed,
      outputTokensDetails: { ...entry.outputTokensDetails // Provider-specific function removed,
      endpoint: entry.endpoint,
    // Provider-specific function removed)),
  // Provider-specific function removed;
// Provider-specific function removed

function serializeGuardrails(result: {
  inputGuardrailResults: Array<{
    guardrail: {
      name: string;
      type: string;
    // Provider-specific function removed;
    output: {
      tripwireTriggered?: boolean;
      outputInfo?: unknown;
    // Provider-specific function removed;
  // Provider-specific function removed>;
  outputGuardrailResults: Array<{
    guardrail: {
      name: string;
      type: string;
    // Provider-specific function removed;
    output: {
      tripwireTriggered?: boolean;
      outputInfo?: unknown;
    // Provider-specific function removed;
  // Provider-specific function removed>;
  toolInputGuardrailResults: Array<{
    guardrail: {
      name: string;
      type: string;
    // Provider-specific function removed;
    output: {
      behavior?: unknown;
      outputInfo?: unknown;
    // Provider-specific function removed;
  // Provider-specific function removed>;
  toolOutputGuardrailResults: Array<{
    guardrail: {
      name: string;
      type: string;
    // Provider-specific function removed;
    output: {
      behavior?: unknown;
      outputInfo?: unknown;
    // Provider-specific function removed;
  // Provider-specific function removed>;
// Provider-specific function removed): AgentRunGuardrailSummary | undefined {
  const summary: AgentRunGuardrailSummary = {
    input: result.inputGuardrailResults.map((entry) => ({
      name: entry.guardrail.name,
      type: entry.guardrail.type,
      tripwireTriggered: entry.output.tripwireTriggered ?? false,
      outputInfo: entry.output.outputInfo,
    // Provider-specific function removed)),
    output: result.outputGuardrailResults.map((entry) => ({
      name: entry.guardrail.name,
      type: entry.guardrail.type,
      tripwireTriggered: entry.output.tripwireTriggered ?? false,
      outputInfo: entry.output.outputInfo,
    // Provider-specific function removed)),
    toolInput: result.toolInputGuardrailResults.map((entry) => ({
      name: entry.guardrail.name,
      type: entry.guardrail.type,
      behavior: entry.output.behavior,
      outputInfo: entry.output.outputInfo,
    // Provider-specific function removed)),
    toolOutput: result.toolOutputGuardrailResults.map((entry) => ({
      name: entry.guardrail.name,
      type: entry.guardrail.type,
      behavior: entry.output.behavior,
      outputInfo: entry.output.outputInfo,
    // Provider-specific function removed)),
  // Provider-specific function removed;

  return summary.input.length > 0 ||
    summary.output.length > 0 ||
    summary.toolInput.length > 0 ||
    summary.toolOutput.length > 0
    ? summary
    : undefined;
// Provider-specific function removed

function maybeBuildPolicyRetryInput(args: {
  error: unknown;
  originalInput: string;
  retryCount: number;
// Provider-specific function removed): string | undefined {
***REMOVED***
    !(args.error instanceof AgentPolicyViolationError) ||
    args.error.stage !== 'after_run' ||
    args.retryCount >= MAX_POLICY_REWRITE_RETRIES
***REMOVED***
    return undefined;
  // Provider-specific function removed

  const metadata = args.error.metadata;
***REMOVED***!isChatroomOverlengthPolicyMetadata(metadata)) {
    return undefined;
  // Provider-specific function removed

  const targetCharacters = Math.max(80, metadata.maxCharacters - 80);
***REMOVED***
    args.originalInput,
    '',
    'System correction:',
    `Your previous draft exceeded the room limit (${metadata.actualCharacters// Provider-specific function removed/${metadata.maxCharacters// Provider-specific function removed).`,
    `Rewrite the final room message so it stays under ${targetCharacters// Provider-specific function removed characters; the hard limit is ${metadata.maxCharacters// Provider-specific function removed.`,
    'Keep only the single most important conclusion, evidence, and next action.',
    'Prefer 2-4 compact sentences. Remove repeated setup, side notes, and long enumerations.',
    'Do not explain that you are shortening the reply. Return only the final room message.',
  ].join('\n');
// Provider-specific function removed

function isChatroomOverlengthPolicyMetadata(
  value: unknown,
): value is ChatroomOverlengthPolicyMetadata {
  return Boolean(
    value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      'reasonKind' in value &&
      (value as { reasonKind?: unknown // Provider-specific function removed).reasonKind === 'chatroom_overlength' &&
      'maxCharacters' in value &&
      typeof (value as { maxCharacters?: unknown // Provider-specific function removed).maxCharacters === 'number' &&
      'actualCharacters' in value &&
      typeof (value as { actualCharacters?: unknown // Provider-specific function removed).actualCharacters === 'number',
  );
// Provider-specific function removed

const coreDefaultRetryDefaults: Required<
  Omit<AgentRuntimeRetryDefaults, 'backoff' | 'retryHttpStatuses'>
> & {
  retryHttpStatuses: number[];
  backoff: Required<AgentRuntimeRetryBackoffDefaults>;
// Provider-specific function removed = {
  maxRetries: 3,
  useProviderSuggested: true,
  retryNetworkErrors: true,
  respectRetryAfter: true,
  retryHttpStatuses: [408, 409, 429, 500, 502, 503, 504],
  backoff: {
    initialDelayMs: 500,
    maxDelayMs: 4_000,
    multiplier: 2,
    jitter: true,
  // Provider-specific function removed,
// Provider-specific function removed;

function resolveAgentPolicyHooks<
  TContext extends object,
  TOutput extends AgentOutputType,
>(
  defaults: readonly AgentPolicyHook<any, any>[] | undefined,
  profileHooks: readonly AgentPolicyHook<TContext, TOutput>[] | undefined,
  runHooks: readonly AgentPolicyHook<TContext, TOutput>[] | undefined,
): AgentPolicyHook<TContext, TOutput>[] {
***REMOVED***
    ...((defaults as readonly AgentPolicyHook<TContext, TOutput>[] | undefined) ?? []),
    ...(profileHooks ?? []),
    ...(runHooks ?? []),
  ];
// Provider-specific function removed

function resolveAgentModelSettings(
  base?: ModelSettings,
  overrides?: ModelSettings,
  retryDefaults?: AgentRuntimeRetryDefaults,
): ModelSettings | undefined {
  return mergeModelSettings(base, overrides, retryDefaults);
// Provider-specific function removed

function mergeModelSettings(
  base?: ModelSettings,
  overrides?: ModelSettings,
  retryDefaults?: AgentRuntimeRetryDefaults,
): ModelSettings | undefined {
***REMOVED***!base && !overrides) {
    return buildCoreDefaultModelSettings(retryDefaults);
  // Provider-specific function removed

  const mergedRetry = mergeRetrySettings(base?.retry, overrides?.retry, retryDefaults);
  const merged = {
    ...base,
    ...overrides,
    ...(mergedRetry ? { retry: mergedRetry // Provider-specific function removed : {// Provider-specific function removed),
  // Provider-specific function removed;

  return Object.keys(merged).length > 0 ? merged : undefined;
// Provider-specific function removed

function mergeRetrySettings(
  base?: ModelSettings['retry'],
  overrides?: ModelSettings['retry'],
  retryDefaults?: AgentRuntimeRetryDefaults,
): NonNullable<ModelSettings['retry']> | undefined {
  const fallback = buildCoreRetrySettings(retryDefaults);
***REMOVED***!base && !overrides) {
    return fallback;
  // Provider-specific function removed

  return {
    ...fallback,
    ...base,
    ...overrides,
    backoff: {
      ...fallback.backoff,
      ...base?.backoff,
      ...overrides?.backoff,
    // Provider-specific function removed,
    policy:
      overrides?.policy ??
      base?.policy ??
      fallback.policy,
  // Provider-specific function removed;
// Provider-specific function removed

function buildCoreDefaultModelSettings(
  retryDefaults?: AgentRuntimeRetryDefaults,
): ModelSettings {
  return {
    retry: buildCoreRetrySettings(retryDefaults),
  // Provider-specific function removed;
// Provider-specific function removed

function buildCoreRetrySettings(
  retryDefaults?: AgentRuntimeRetryDefaults,
): NonNullable<ModelSettings['retry']> {
  const resolved = resolveRetryDefaults(retryDefaults);
  return {
    maxRetries: resolved.maxRetries,
    backoff: {
      ...resolved.backoff,
    // Provider-specific function removed,
    policy: buildRetryPolicy(resolved),
  // Provider-specific function removed;
// Provider-specific function removed

function resolveRetryDefaults(
  overrides?: AgentRuntimeRetryDefaults,
): Required<Omit<AgentRuntimeRetryDefaults, 'backoff' | 'retryHttpStatuses'>> & {
  retryHttpStatuses: number[];
  backoff: Required<AgentRuntimeRetryBackoffDefaults>;
// Provider-specific function removed {
  return {
    maxRetries: overrides?.maxRetries ?? coreDefaultRetryDefaults.maxRetries,
    useProviderSuggested:
      overrides?.useProviderSuggested ?? coreDefaultRetryDefaults.useProviderSuggested,
    retryNetworkErrors:
      overrides?.retryNetworkErrors ?? coreDefaultRetryDefaults.retryNetworkErrors,
    respectRetryAfter:
      overrides?.respectRetryAfter ?? coreDefaultRetryDefaults.respectRetryAfter,
    retryHttpStatuses:
      overrides?.retryHttpStatuses && overrides.retryHttpStatuses.length > 0
        ? [...new Set(overrides.retryHttpStatuses)]
        : [...coreDefaultRetryDefaults.retryHttpStatuses],
    backoff: {
      initialDelayMs:
        overrides?.backoff?.initialDelayMs ?? coreDefaultRetryDefaults.backoff.initialDelayMs,
      maxDelayMs:
        overrides?.backoff?.maxDelayMs ?? coreDefaultRetryDefaults.backoff.maxDelayMs,
      multiplier:
        overrides?.backoff?.multiplier ?? coreDefaultRetryDefaults.backoff.multiplier,
      jitter: overrides?.backoff?.jitter ?? coreDefaultRetryDefaults.backoff.jitter,
    // Provider-specific function removed,
  // Provider-specific function removed;
// Provider-specific function removed

function buildRetryPolicy(
  retryDefaults: ReturnType<typeof resolveRetryDefaults>,
) {
  const policies = [];

***REMOVED***retryDefaults.useProviderSuggested) {
    policies.push(retryPolicies.providerSuggested());
  // Provider-specific function removed
***REMOVED***retryDefaults.retryNetworkErrors) {
    policies.push(retryPolicies.networkError());
  // Provider-specific function removed
***REMOVED***retryDefaults.respectRetryAfter) {
    policies.push(retryPolicies.retryAfter());
  // Provider-specific function removed
***REMOVED***retryDefaults.retryHttpStatuses.length > 0) {
    policies.push(retryPolicies.httpStatus(retryDefaults.retryHttpStatuses));
  // Provider-specific function removed

  return policies.length > 0 ? retryPolicies.any(...policies) : retryPolicies.never();
// Provider-specific function removed
