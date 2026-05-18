import assert from 'node:assert/strict';

import { setTracingDisabled // Provider-specific function removed from '@openai/agents-core';

import { createRuntimeModelBinding, loadAppConfig // Provider-specific function removed from '../config/app-config.js';
import { AgentRuntime // Provider-specific function removed from '../core/agent-runtime.js';
import { WorkflowRuntime // Provider-specific function removed from '../core/workflow.js';
import type { ChatroomState // Provider-specific function removed from '../workflows/chatroom-discussion.js';
import type { ChatroomAgentContext // Provider-specific function removed from '../workflows/chatroom-types.js';
import { runInterviewPressureScenario // Provider-specific function removed from './interview-pressure-support.js';

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

  const result = await runInterviewPressureScenario({
    workflowRuntime,
    agentRuntime: runtime,
  // Provider-specific function removed);

  assert.equal(result.failedRunCount, 0, 'Interview regression should not produce failed runs.');
  assert.equal(
    result.latestRunStatus,
    'completed',
    'Latest interview run should be completed.',
  );
  assert.equal(
    result.extra.interviewStatus,
    'complete',
    'Interview final summary should reach complete status.',
  );
  assert.equal(
    result.extra.finalSummaryPresent,
    true,
    'Interview regression should persist a final summary.',
  );
  assert(
    result.latestArtifactDirectory,
    'Interview regression should produce an artifact directory.',
  );

  const requiredStages = [
    'interview-hr',
    'interview-technical',
    'interview-manager',
  ];
  for (const stage of requiredStages) {
    assert(
      result.extra.interviewerStagesSeen.includes(stage),
      `Expected interviewer stage "${stage// Provider-specific function removed" to appear in the transcript.`,
    );
  // Provider-specific function removed
  const observerSeen = result.extra.interviewerStagesSeen.includes('interview-observer');
***REMOVED***!observerSeen) {
    console.warn(
      '[interview regression] observer interviewer did not appear in this run; continuing because required core stages completed.',
    );
  // Provider-specific function removed

  console.log('Interview complete regression');
  console.log(`- Room: ${result.roomId// Provider-specific function removed`);
  console.log(`- Latest run status: ${result.latestRunStatus// Provider-specific function removed`);
  console.log(`- Completed runs: ${result.completedRunCount// Provider-specific function removed`);
  console.log(`- Failed runs: ${result.failedRunCount// Provider-specific function removed`);
  console.log(`- Agent turns: ${result.agentTurnCount// Provider-specific function removed`);
  console.log(`- Message count: ${result.messageCount// Provider-specific function removed`);
  console.log(`- Interview status: ${result.extra.interviewStatus// Provider-specific function removed`);
  console.log(`- Current stage: ${result.extra.currentStage ?? '-'// Provider-specific function removed`);
  console.log(`- Overall score: ${result.extra.overallScore ?? '-'// Provider-specific function removed`);
  console.log(`- Stages seen: ${result.extra.interviewerStagesSeen.join(', ')// Provider-specific function removed`);
  console.log(`- Observer seen: ${observerSeen ? 'yes' : 'no'// Provider-specific function removed`);
  console.log(`- Artifact dir: ${result.latestArtifactDirectory// Provider-specific function removed`);
  console.log('OK: interview pressure run reached complete status.');
// Provider-specific function removed

main().catch((error) => {
  console.error(error instanceof Error ? error.stack ?? error.message : String(error));
  process.exitCode = 1;
// Provider-specific function removed);
