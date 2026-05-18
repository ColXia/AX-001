import assert from 'node:assert/strict';

import { setTracingDisabled // Provider-specific function removed from '@openai/agents-core';

import { createRuntimeModelBinding, loadAppConfig // Provider-specific function removed from '../config/app-config.js';
import { AgentRuntime // Provider-specific function removed from '../core/agent-runtime.js';
import { WorkflowRuntime // Provider-specific function removed from '../core/workflow.js';
import type { ChatroomState // Provider-specific function removed from '../workflows/chatroom-discussion.js';
import type { ChatroomAgentContext // Provider-specific function removed from '../workflows/chatroom-types.js';
import { runDiscussionPressureScenario // Provider-specific function removed from './discussion-pressure-support.js';

async function main(): Promise<void> {
  const appConfig = loadAppConfig();
  setTracingDisabled(appConfig.runtime.tracingDisabled);

  const runtimeModel = createRuntimeModelBinding(appConfig);
  const runtime = new AgentRuntime({
    model: runtimeModel.model,
    retryDefaults: appConfig.runtime.modelRetry,
    ...(runtimeModel.modelProvider ? { modelProvider: runtimeModel.modelProvider // Provider-specific function removed : {// Provider-specific function removed),
    tracingDisabled: appConfig.runtime.tracingDisabled,
    workflowName: appConfig.runtime.workflowName,
    structuredOutputMode: appConfig.provider.compatibility.structuredOutputMode,
    maxStructuredOutputRetries:
      appConfig.provider.compatibility.maxStructuredOutputRetries,
  // Provider-specific function removed);
  const workflowRuntime = new WorkflowRuntime<ChatroomState, ChatroomAgentContext>(runtime);

  const result = await runDiscussionPressureScenario({
    workflowRuntime,
  // Provider-specific function removed);

  assert.equal(result.failedRunCount, 0, 'Discussion regression should not produce failed runs.');
  assert.equal(
    result.latestRunStatus,
    'completed',
    'Latest discussion run should be completed.',
  );
  assert.equal(
    result.extra.finalSummaryPresent,
    true,
    'Discussion regression should persist a final summary.',
  );
  assert.equal(
    result.extra.summaryType,
    'analysis_like',
    'Discussion regression should produce an analysis-style summary.',
  );
  assert(
    result.latestArtifactDirectory,
    'Discussion regression should produce an artifact directory.',
  );
  assert(
    new Set(result.extra.recentAuthors).size >= 3,
    'Discussion regression should include several active speakers in the latest transcript window.',
  );

  console.log('Discussion complete regression');
  console.log(`- Room: ${result.roomId// Provider-specific function removed`);
  console.log(`- Latest run status: ${result.latestRunStatus// Provider-specific function removed`);
  console.log(`- Completed runs: ${result.completedRunCount// Provider-specific function removed`);
  console.log(`- Failed runs: ${result.failedRunCount// Provider-specific function removed`);
  console.log(`- Agent turns: ${result.agentTurnCount// Provider-specific function removed`);
  console.log(`- Message count: ${result.messageCount// Provider-specific function removed`);
  console.log(`- Summary type: ${result.extra.summaryType ?? '-'// Provider-specific function removed`);
  console.log(`- Recent authors: ${result.extra.recentAuthors.join(', ')// Provider-specific function removed`);
  console.log(`- Artifact dir: ${result.latestArtifactDirectory// Provider-specific function removed`);
  console.log('OK: discussion pressure run reached complete status.');
// Provider-specific function removed

main().catch((error) => {
  console.error(error instanceof Error ? error.stack ?? error.message : String(error));
  process.exitCode = 1;
// Provider-specific function removed);
