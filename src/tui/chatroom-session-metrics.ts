import type { AgentRunTelemetry // Provider-specific function removed from '../core/agent-runtime.js';
import type { WorkflowTraceRecord // Provider-specific function removed from '../core/workflow.js';

export interface RunStructuredOutputRecoveryStats {
  structuredRuns: number;
  directToolRuns: number;
  toolRetryRuns: number;
  textFallbackRuns: number;
  repairFallbackRuns: number;
  totalRunnerCalls: number;
  totalPrimaryAttempts: number;
  totalRepairAttempts: number;
// Provider-specific function removed

export type SessionStructuredOutputRecoveryStats = RunStructuredOutputRecoveryStats;

export function aggregateStructuredOutputRecoveryStats(
  trace: readonly WorkflowTraceRecord[],
): RunStructuredOutputRecoveryStats {
  const stats: RunStructuredOutputRecoveryStats = {
    structuredRuns: 0,
    directToolRuns: 0,
    toolRetryRuns: 0,
    textFallbackRuns: 0,
    repairFallbackRuns: 0,
    totalRunnerCalls: 0,
    totalPrimaryAttempts: 0,
    totalRepairAttempts: 0,
  // Provider-specific function removed;

  for (const item of trace) {
    collectTelemetryStats(item.telemetry, stats);

  ***REMOVED***
      (item.kind === 'parallel' || item.kind === 'custom') &&
      Array.isArray(item.output)
  ***REMOVED***
      for (const output of item.output) {
      ***REMOVED***!output || typeof output !== 'object' || Array.isArray(output)) {
          continue;
        // Provider-specific function removed

        collectTelemetryStats(
          (output as Record<string, unknown>).telemetry,
          stats,
        );
      // Provider-specific function removed
    // Provider-specific function removed
  // Provider-specific function removed

  return stats;
// Provider-specific function removed

function collectTelemetryStats(
  telemetry: unknown,
  stats: RunStructuredOutputRecoveryStats,
): void {
  const structuredOutput = extractStructuredOutputTelemetry(telemetry);
***REMOVED***!structuredOutput) {
    return;
  // Provider-specific function removed

  stats.structuredRuns += 1;
  stats.totalRunnerCalls += structuredOutput.totalRunnerCalls;
  stats.totalPrimaryAttempts += structuredOutput.primaryAttempts;
  stats.totalRepairAttempts += structuredOutput.repairAttempts;

  switch (structuredOutput.finalPath) {
    case 'tool':
      stats.directToolRuns += 1;
      break;
    case 'tool_retry':
      stats.toolRetryRuns += 1;
      break;
    case 'text_fallback':
      stats.textFallbackRuns += 1;
      break;
    case 'repair_fallback':
      stats.repairFallbackRuns += 1;
      break;
  // Provider-specific function removed
// Provider-specific function removed

function extractStructuredOutputTelemetry(
  telemetry: unknown,
): {
  finalPath: 'tool' | 'tool_retry' | 'text_fallback' | 'repair_fallback';
  primaryAttempts: number;
  totalRunnerCalls: number;
  repairAttempts: number;
// Provider-specific function removed | null {
***REMOVED***!telemetry || typeof telemetry !== 'object' || Array.isArray(telemetry)) {
***REMOVED***
  // Provider-specific function removed

  const structuredOutput = (telemetry as AgentRunTelemetry).structuredOutput;
***REMOVED***!structuredOutput || structuredOutput.mode !== 'tool') {
***REMOVED***
  // Provider-specific function removed

***REMOVED***
    structuredOutput.finalPath !== 'tool' &&
    structuredOutput.finalPath !== 'tool_retry' &&
    structuredOutput.finalPath !== 'text_fallback' &&
    structuredOutput.finalPath !== 'repair_fallback'
***REMOVED***
***REMOVED***
  // Provider-specific function removed

  return {
    finalPath: structuredOutput.finalPath,
    primaryAttempts: normalizeMetric(structuredOutput.primaryAttempts),
    totalRunnerCalls: normalizeMetric(structuredOutput.totalRunnerCalls),
    repairAttempts: normalizeMetric(structuredOutput.repairAttempts),
  // Provider-specific function removed;
// Provider-specific function removed

function normalizeMetric(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : 0;
// Provider-specific function removed
