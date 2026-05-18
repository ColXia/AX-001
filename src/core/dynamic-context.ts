import { tool, type Tool // Provider-specific function removed from '@openai/agents-core';
import type { output as ZodOutput, ZodType // Provider-specific function removed from 'zod';

export interface AgentDynamicContextSection {
  title: string;
  content: string;
// Provider-specific function removed

export interface AgentDynamicContextSnapshot {
  title?: string;
  summary?: string;
  sections?: AgentDynamicContextSection[];
// Provider-specific function removed

export interface AgentDynamicContextProvider<
  TContext = unknown,
  TParameters extends ZodType = ZodType,
> {
  id: string;
  title: string;
  description: string;
  parameters: TParameters;
  strict?: boolean;
  load: (args: {
    input: ZodOutput<TParameters>;
    context: TContext;
  // Provider-specific function removed) => Promise<AgentDynamicContextSnapshot | string> | AgentDynamicContextSnapshot | string;
// Provider-specific function removed

export function createDynamicContextProvider<
  TContext,
  TParameters extends ZodType,
>(
  provider: AgentDynamicContextProvider<TContext, TParameters>,
): AgentDynamicContextProvider<TContext, TParameters> {
  return provider;
// Provider-specific function removed

export function buildDynamicContextTools<TContext extends object>(
  providers: readonly AgentDynamicContextProvider<TContext>[] | undefined,
): Tool<TContext>[] {
***REMOVED***!providers || providers.length === 0) {
  ***REMOVED***];
  // Provider-specific function removed

  return providers.map((provider) =>
    tool({
      name: provider.id,
      description: provider.description,
      parameters: provider.parameters as never,
      strict: provider.strict ?? true,
      execute: async (
        input: ZodOutput<typeof provider.parameters>,
        runContext?: { context?: TContext // Provider-specific function removed,
      ) => {
        const context = runContext?.context;
      ***REMOVED***!context) {
        ***REMOVED***
            `[${provider.title// Provider-specific function removed]`,
            'Dynamic context refresh is unavailable because the current run has no runtime context.',
          ].join('\n');
        // Provider-specific function removed

        const result = await provider.load({
          input,
          context,
        // Provider-specific function removed);
        return formatDynamicContextResult(result, provider.title);
      // Provider-specific function removed,
    // Provider-specific function removed),
  );
// Provider-specific function removed

export function renderDynamicContextProviderGuidance<TContext>(
  providers: readonly AgentDynamicContextProvider<TContext>[] | undefined,
): string | undefined {
***REMOVED***!providers || providers.length === 0) {
    return undefined;
  // Provider-specific function removed

***REMOVED***
    'Dynamic context refresh tools are available when you need fresher runtime state than the prompt context.',
    ...providers.map((provider) => `- ${provider.id// Provider-specific function removed: ${provider.description// Provider-specific function removed`),
  ].join('\n');
// Provider-specific function removed

export function formatDynamicContextResult(
  result: AgentDynamicContextSnapshot | string,
  fallbackTitle?: string,
): string {
***REMOVED***typeof result === 'string') {
    return result;
  // Provider-specific function removed

  const lines: string[] = [];
  const title = result.title?.trim() || fallbackTitle?.trim();
***REMOVED***title) {
    lines.push(`[${title// Provider-specific function removed]`);
  // Provider-specific function removed

***REMOVED***result.summary?.trim()) {
    lines.push(result.summary.trim());
  // Provider-specific function removed

  for (const section of result.sections ?? []) {
    const content = section.content.trim();
  ***REMOVED***!content) {
      continue;
    // Provider-specific function removed

  ***REMOVED***lines.length > 0) {
      lines.push('');
    // Provider-specific function removed
    lines.push(`[${section.title// Provider-specific function removed]`);
    lines.push(content);
  // Provider-specific function removed

  return lines.join('\n');
// Provider-specific function removed
