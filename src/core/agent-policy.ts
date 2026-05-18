import {
  ToolGuardrailFunctionOutputFactory,
  defineToolInputGuardrail,
  defineToolOutputGuardrail,
  type AgentOutputType,
  type FunctionCallItem,
  type Tool,
  type ToolInputGuardrailDefinition,
  type ToolOutputGuardrailDefinition,
// Provider-specific function removed from '@openai/agents-core';

import type { AgentProfile, ResolvedProfileOutput // Provider-specific function removed from './agent-profile.js';

export type AgentPolicyHookStage =
  | 'before_run'
  | 'after_run'
  | 'before_tool_call'
  | 'after_tool_call';

export type AgentPolicyEnforcement = 'soft' | 'hard';

export interface AgentPolicyDecision {
  action?: 'allow' | 'reject';
  enforcement?: AgentPolicyEnforcement;
  reason?: string;
  metadata?: unknown;
// Provider-specific function removed

export interface AgentBeforeRunPolicyArgs<
  TContext = unknown,
  TOutput extends AgentOutputType = AgentOutputType,
> {
  profile: AgentProfile<TContext, TOutput>;
  input: string;
  context?: TContext;
  maxTurns?: number;
  timeoutMs?: number;
// Provider-specific function removed

export interface AgentAfterRunPolicyArgs<
  TContext = unknown,
  TOutput extends AgentOutputType = AgentOutputType,
> extends AgentBeforeRunPolicyArgs<TContext, TOutput> {
  output: ResolvedProfileOutput<TOutput>;
  usage?: Record<string, unknown>;
// Provider-specific function removed

export interface AgentToolPolicyArgs<
  TContext = unknown,
  TOutput extends AgentOutputType = AgentOutputType,
> {
  profile: AgentProfile<TContext, TOutput>;
  context?: TContext;
  tool: Tool<TContext>;
  toolName: string;
  toolCall: FunctionCallItem;
// Provider-specific function removed

export interface AgentToolOutputPolicyArgs<
  TContext = unknown,
  TOutput extends AgentOutputType = AgentOutputType,
> extends AgentToolPolicyArgs<TContext, TOutput> {
  output: unknown;
// Provider-specific function removed

export interface AgentPolicyHook<
  TContext = unknown,
  TOutput extends AgentOutputType = AgentOutputType,
> {
  id: string;
  beforeRun?: (
    args: AgentBeforeRunPolicyArgs<TContext, TOutput>,
  ) => Promise<AgentPolicyDecision | void> | AgentPolicyDecision | void;
  afterRun?: (
    args: AgentAfterRunPolicyArgs<TContext, TOutput>,
  ) => Promise<AgentPolicyDecision | void> | AgentPolicyDecision | void;
  beforeToolCall?: (
    args: AgentToolPolicyArgs<TContext, TOutput>,
  ) => Promise<AgentPolicyDecision | void> | AgentPolicyDecision | void;
  afterToolCall?: (
    args: AgentToolOutputPolicyArgs<TContext, TOutput>,
  ) => Promise<AgentPolicyDecision | void> | AgentPolicyDecision | void;
// Provider-specific function removed

export class AgentPolicyViolationError extends Error {
  readonly hookId: string;
  readonly stage: AgentPolicyHookStage;
  readonly metadata?: unknown;

  constructor(args: {
    hookId: string;
    stage: AgentPolicyHookStage;
    reason?: string;
    metadata?: unknown;
  // Provider-specific function removed) {
    super(
      args.reason?.trim()
        ? args.reason.trim()
        : `Policy hook "${args.hookId// Provider-specific function removed" rejected the agent run at stage "${args.stage// Provider-specific function removed".`,
    );
    this.name = 'AgentPolicyViolationError';
    this.hookId = args.hookId;
    this.stage = args.stage;
    this.metadata = args.metadata;
  // Provider-specific function removed
// Provider-specific function removed

export interface BuiltToolPolicyGuardrails<TContext extends object> {
  input: ToolInputGuardrailDefinition<TContext>[];
  output: ToolOutputGuardrailDefinition<TContext>[];
// Provider-specific function removed

export function createAgentPolicyHook<
  TContext = unknown,
  TOutput extends AgentOutputType = AgentOutputType,
>(
  hook: AgentPolicyHook<TContext, TOutput>,
): AgentPolicyHook<TContext, TOutput> {
  return hook;
// Provider-specific function removed

export async function runAgentBeforePolicies<
  TContext = unknown,
  TOutput extends AgentOutputType = AgentOutputType,
>(
  hooks: readonly AgentPolicyHook<TContext, TOutput>[],
  args: AgentBeforeRunPolicyArgs<TContext, TOutput>,
): Promise<void> {
  for (const hook of hooks) {
    await enforcePolicyDecision(
      hook.id,
      'before_run',
      await hook.beforeRun?.(args),
    );
  // Provider-specific function removed
// Provider-specific function removed

export async function runAgentAfterPolicies<
  TContext = unknown,
  TOutput extends AgentOutputType = AgentOutputType,
>(
  hooks: readonly AgentPolicyHook<TContext, TOutput>[],
  args: AgentAfterRunPolicyArgs<TContext, TOutput>,
): Promise<void> {
  for (const hook of hooks) {
    await enforcePolicyDecision(
      hook.id,
      'after_run',
      await hook.afterRun?.(args),
    );
  // Provider-specific function removed
// Provider-specific function removed

export function buildToolPolicyGuardrails<
  TContext extends object,
  TOutput extends AgentOutputType,
>(
  profile: AgentProfile<TContext, TOutput>,
  hooks: readonly AgentPolicyHook<TContext, TOutput>[],
): BuiltToolPolicyGuardrails<TContext> {
  const input = hooks
    .filter((hook) => Boolean(hook.beforeToolCall))
    .map((hook) =>
      defineToolInputGuardrail<TContext>({
        name: `${hook.id// Provider-specific function removed:before_tool_call`,
        run: async (data) => {
          const decision = await hook.beforeToolCall?.({
            profile,
            context: data.context.context,
            tool: data.toolCall.type === 'function_call'
              ? data.agent.tools.find((tool) => tool.type === 'function' && tool.name === data.toolCall.name) ??
                ({ type: 'function', name: data.toolCall.name // Provider-specific function removed as Tool<TContext>)
              : ({ type: 'hosted_tool', name: data.toolCall.type // Provider-specific function removed as Tool<TContext>),
            toolName:
              data.toolCall.type === 'function_call' ? data.toolCall.name : data.toolCall.type,
            toolCall: data.toolCall,
          // Provider-specific function removed);
          return toToolGuardrailResult(decision);
        // Provider-specific function removed,
      // Provider-specific function removed),
    );
  const output = hooks
    .filter((hook) => Boolean(hook.afterToolCall))
    .map((hook) =>
      defineToolOutputGuardrail<TContext>({
        name: `${hook.id// Provider-specific function removed:after_tool_call`,
        run: async (data) => {
          const decision = await hook.afterToolCall?.({
            profile,
            context: data.context.context,
            tool: data.toolCall.type === 'function_call'
              ? data.agent.tools.find((tool) => tool.type === 'function' && tool.name === data.toolCall.name) ??
                ({ type: 'function', name: data.toolCall.name // Provider-specific function removed as Tool<TContext>)
              : ({ type: 'hosted_tool', name: data.toolCall.type // Provider-specific function removed as Tool<TContext>),
            toolName:
              data.toolCall.type === 'function_call' ? data.toolCall.name : data.toolCall.type,
            toolCall: data.toolCall,
            output: data.output,
          // Provider-specific function removed);
          return toToolGuardrailResult(decision);
        // Provider-specific function removed,
      // Provider-specific function removed),
    );

  return {
    input,
    output,
  // Provider-specific function removed;
// Provider-specific function removed

function toToolGuardrailResult(decision: AgentPolicyDecision | void) {
  const normalized = normalizePolicyDecision(decision);
***REMOVED***!normalized || normalized.action === 'allow') {
    return ToolGuardrailFunctionOutputFactory.allow(normalized?.metadata);
  // Provider-specific function removed

***REMOVED***normalized.enforcement === 'hard') {
    return ToolGuardrailFunctionOutputFactory.throwException(normalized.metadata);
  // Provider-specific function removed

  return ToolGuardrailFunctionOutputFactory.rejectContent(
    normalized.reason?.trim() || 'The requested tool action is not allowed by policy.',
    normalized.metadata,
  );
// Provider-specific function removed

async function enforcePolicyDecision(
  hookId: string,
  stage: AgentPolicyHookStage,
  decision: AgentPolicyDecision | void,
): Promise<void> {
  const normalized = normalizePolicyDecision(decision);
***REMOVED***!normalized || normalized.action === 'allow') {
    return;
  // Provider-specific function removed

  throw new AgentPolicyViolationError({
    hookId,
    stage,
    reason: normalized.reason,
    metadata: normalized.metadata,
  // Provider-specific function removed);
// Provider-specific function removed

function normalizePolicyDecision(
  decision: AgentPolicyDecision | void,
): AgentPolicyDecision | undefined {
***REMOVED***!decision) {
    return undefined;
  // Provider-specific function removed

  return {
    action: decision.action ?? 'allow',
    enforcement: decision.enforcement ?? 'soft',
    reason: decision.reason,
    metadata: decision.metadata,
  // Provider-specific function removed;
// Provider-specific function removed
