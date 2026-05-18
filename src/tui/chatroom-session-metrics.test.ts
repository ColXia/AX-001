import assert from 'node:assert/strict';
import test from 'node:test';

import type { WorkflowTraceRecord // Provider-specific function removed from '../core/workflow.js';
import { aggregateStructuredOutputRecoveryStats // Provider-specific function removed from './chatroom-session-metrics.js';

function createStructuredTelemetry(
  finalPath: 'tool' | 'tool_retry' | 'text_fallback' | 'repair_fallback',
  overrides: Partial<{
    primaryAttempts: number;
    totalRunnerCalls: number;
    repairAttempts: number;
  // Provider-specific function removed> = {// Provider-specific function removed,
) {
  return {
    structuredOutput: {
      mode: 'tool' as const,
      finalPath,
      primaryAttempts: overrides.primaryAttempts ?? 1,
      totalRunnerCalls: overrides.totalRunnerCalls ?? 1,
      textFallbackAttempted: finalPath !== 'tool' && finalPath !== 'tool_retry',
      repairAttempts: overrides.repairAttempts ?? (finalPath === 'repair_fallback' ? 1 : 0),
      repairSource:
        finalPath === 'repair_fallback'
          ? ('text_fallback' as const)
          : undefined,
    // Provider-specific function removed,
  // Provider-specific function removed;
// Provider-specific function removed

test('aggregateStructuredOutputRecoveryStats counts agent/custom/parallel recovery paths', () => {
  const trace: WorkflowTraceRecord[] = [
    {
      stepId: 'summary',
      kind: 'agent',
      agentIds: ['summary'],
      startedAt: '2026-04-10T00:00:00.000Z',
      endedAt: '2026-04-10T00:00:01.000Z',
      telemetry: createStructuredTelemetry('tool'),
      status: 'completed',
    // Provider-specific function removed,
    {
      stepId: 'custom-interview',
      kind: 'custom',
      agentIds: ['interviewer'],
      startedAt: '2026-04-10T00:00:01.000Z',
      endedAt: '2026-04-10T00:00:02.000Z',
      output: [
        {
          profileId: 'interviewer',
          telemetry: createStructuredTelemetry('repair_fallback', {
            totalRunnerCalls: 3,
            repairAttempts: 1,
          // Provider-specific function removed),
          status: 'completed',
        // Provider-specific function removed,
      ],
      status: 'completed',
    // Provider-specific function removed,
    {
      stepId: 'parallel-panel',
      kind: 'parallel',
      agentIds: ['a', 'b'],
      startedAt: '2026-04-10T00:00:02.000Z',
      endedAt: '2026-04-10T00:00:03.000Z',
      output: [
        {
          branchId: 'a',
          profileId: 'critic',
          telemetry: createStructuredTelemetry('tool_retry', {
            primaryAttempts: 2,
            totalRunnerCalls: 2,
          // Provider-specific function removed),
          status: 'completed',
        // Provider-specific function removed,
        {
          branchId: 'b',
          profileId: 'planner',
          telemetry: createStructuredTelemetry('text_fallback', {
            totalRunnerCalls: 2,
          // Provider-specific function removed),
          status: 'completed',
        // Provider-specific function removed,
      ],
      status: 'completed',
    // Provider-specific function removed,
  ];

  assert.deepEqual(aggregateStructuredOutputRecoveryStats(trace), {
    structuredRuns: 4,
    directToolRuns: 1,
    toolRetryRuns: 1,
    textFallbackRuns: 1,
    repairFallbackRuns: 1,
    totalRunnerCalls: 8,
    totalPrimaryAttempts: 5,
    totalRepairAttempts: 1,
  // Provider-specific function removed);
// Provider-specific function removed);

test('aggregateStructuredOutputRecoveryStats ignores invalid or missing telemetry', () => {
  const trace: WorkflowTraceRecord[] = [
    {
      stepId: 'plain-agent',
      kind: 'agent',
      agentIds: ['plain'],
      startedAt: '2026-04-10T00:00:00.000Z',
      endedAt: '2026-04-10T00:00:01.000Z',
      telemetry: undefined,
      status: 'completed',
    // Provider-specific function removed,
    {
      stepId: 'custom',
      kind: 'custom',
      agentIds: ['speaker'],
      startedAt: '2026-04-10T00:00:01.000Z',
      endedAt: '2026-04-10T00:00:02.000Z',
      output: [
        {
          profileId: 'speaker',
          telemetry: {
            structuredOutput: {
              mode: 'native',
              finalPath: 'tool',
              primaryAttempts: 1,
              totalRunnerCalls: 1,
              repairAttempts: 0,
            // Provider-specific function removed,
          // Provider-specific function removed,
          status: 'completed',
        // Provider-specific function removed,
        {
          profileId: 'speaker-2',
          telemetry: {
            structuredOutput: {
              mode: 'tool',
              finalPath: 'unknown',
              primaryAttempts: 1,
              totalRunnerCalls: 1,
              repairAttempts: 0,
            // Provider-specific function removed,
          // Provider-specific function removed,
          status: 'completed',
        // Provider-specific function removed,
      ],
      status: 'completed',
    // Provider-specific function removed,
  ];

  assert.deepEqual(aggregateStructuredOutputRecoveryStats(trace), {
    structuredRuns: 0,
    directToolRuns: 0,
    toolRetryRuns: 0,
    textFallbackRuns: 0,
    repairFallbackRuns: 0,
    totalRunnerCalls: 0,
    totalPrimaryAttempts: 0,
    totalRepairAttempts: 0,
  // Provider-specific function removed);
// Provider-specific function removed);
