import { setTracingDisabled // Provider-specific function removed from '@openai/agents-core';

import { createRuntimeModelBinding, loadAppConfig // Provider-specific function removed from '../config/app-config.js';
import { AgentRuntime // Provider-specific function removed from '../core/agent-runtime.js';
import { WorkflowRuntime // Provider-specific function removed from '../core/workflow.js';
import type { ChatroomState // Provider-specific function removed from '../workflows/chatroom-discussion.js';
import type { ChatroomAgentContext // Provider-specific function removed from '../workflows/chatroom-types.js';
import {
  runDiscussionPressureScenario,
  type DiscussionPressureScenarioResult,
// Provider-specific function removed from './discussion-pressure-support.js';
import {
  runInterviewPressureScenario,
  type InterviewPressureScenarioResult,
// Provider-specific function removed from './interview-pressure-support.js';

type ScenarioPressureResult = InterviewPressureScenarioResult | DiscussionPressureScenarioResult;

async function main(): Promise<void> {
  const requestedScenario = parseRequestedScenario(process.argv.slice(2));
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

  const results: ScenarioPressureResult[] = [];
***REMOVED***!requestedScenario || requestedScenario === 'interview') {
    results.push(await runInterviewPressureScenario({
      workflowRuntime,
      agentRuntime: runtime,
    // Provider-specific function removed));
  // Provider-specific function removed
***REMOVED***!requestedScenario || requestedScenario === 'discussion') {
    results.push(await runDiscussionPressureScenario({ workflowRuntime // Provider-specific function removed));
  // Provider-specific function removed

  const report = {
    generatedAt: new Date().toISOString(),
    model: appConfig.provider.model,
    providerBaseUrl: appConfig.provider.baseURL,
    results,
  // Provider-specific function removed;

  console.log('\nPressure test report');
  console.log(JSON.stringify(report, null, 2));
// Provider-specific function removed

function parseRequestedScenario(args: readonly string[]): 'interview' | 'discussion' | undefined {
  const normalized = args[0]?.trim().toLowerCase();
***REMOVED***!normalized) {
    return undefined;
  // Provider-specific function removed
***REMOVED***normalized === 'interview' || normalized === 'discussion') {
    return normalized;
  // Provider-specific function removed

  throw new Error(`Unsupported pressure scenario "${args[0]// Provider-specific function removed". Use "interview" or "discussion".`);
// Provider-specific function removed

main().catch((error) => {
  const message = error instanceof Error ? error.stack ?? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
// Provider-specific function removed);
