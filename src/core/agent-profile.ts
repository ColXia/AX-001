import type {
  AgentOutputType,
  Model,
  ModelSettings,
  Tool,
  ToolUseBehavior,
// Provider-specific function removed from '@openai/agents-core';
import type { output as ZodOutput, ZodType // Provider-specific function removed from 'zod';

import type { AgentDynamicContextProvider // Provider-specific function removed from './dynamic-context.js';
import type { AgentPolicyHook // Provider-specific function removed from './agent-policy.js';

export interface AgentContextReader<TContext = unknown> {
  id: string;
  title: string;
  render: (context: TContext) => string | null | undefined;
// Provider-specific function removed

export type AgentInstructions<TContext = unknown> =
  | string
  | ((args: { context?: TContext // Provider-specific function removed) => string | Promise<string>);

export interface AgentProfile<TContext = unknown, TOutput extends AgentOutputType = AgentOutputType> {
  id: string;
  name: string;
  description: string;
  instructions: AgentInstructions<TContext>;
  handoffDescription?: string;
  outputType: TOutput;
  model?: string | Model;
  modelSettings?: ModelSettings;
  tools?: Tool<TContext>[];
  toolUseBehavior?: ToolUseBehavior;
  contextReaders?: AgentContextReader<TContext>[];
  dynamicContextProviders?: AgentDynamicContextProvider<TContext>[];
  policyHooks?: AgentPolicyHook<TContext, TOutput>[];
  /** Maximum estimated tokens for all context reader output combined. */
  contextTokenBudget?: number;
// Provider-specific function removed

export type ResolvedProfileOutput<TOutput extends AgentOutputType> = TOutput extends ZodType
  ? ZodOutput<TOutput>
  : TOutput extends 'text'
    ? string
    : unknown;

export type AgentProfileOverrides<
  TContext = unknown,
  TOutput extends AgentOutputType = AgentOutputType,
> = Omit<Partial<AgentProfile<TContext, TOutput>>, 'id'> & {
  id: string;
// Provider-specific function removed;

export function extendProfile<TContext, TOutput extends AgentOutputType>(
  base: AgentProfile<TContext, TOutput>,
  overrides: AgentProfileOverrides<TContext, TOutput>,
): AgentProfile<TContext, TOutput> {
  return {
    ...base,
    ...overrides,
    tools: overrides.tools ?? base.tools ?? [],
    contextReaders: overrides.contextReaders ?? base.contextReaders ?? [],
    dynamicContextProviders:
      overrides.dynamicContextProviders ?? base.dynamicContextProviders ?? [],
    policyHooks: overrides.policyHooks ?? base.policyHooks ?? [],
    modelSettings: {
      ...base.modelSettings,
      ...overrides.modelSettings,
    // Provider-specific function removed,
  // Provider-specific function removed;
// Provider-specific function removed
