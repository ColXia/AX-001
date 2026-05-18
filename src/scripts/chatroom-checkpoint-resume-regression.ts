import assert from 'node:assert/strict';

import { setTracingDisabled // Provider-specific function removed from '@openai/agents-core';

import { createRuntimeModelBinding, loadAppConfig // Provider-specific function removed from '../config/app-config.js';
import { createAgentPolicyHook // Provider-specific function removed from '../core/agent-policy.js';
import { AgentRuntime // Provider-specific function removed from '../core/agent-runtime.js';
import { FileWorkflowCheckpointStore // Provider-specific function removed from '../core/workflow-checkpoints.js';
import { WorkflowRuntime // Provider-specific function removed from '../core/workflow.js';
import type { ChatroomState // Provider-specific function removed from '../workflows/chatroom-discussion.js';
import { listChatroomExecutionRuns // Provider-specific function removed from '../room-storage/execution-run-repository.js';
import {
  createChatroomRoom,
  loadChatroomRoomState,
// Provider-specific function removed from '../room-storage/room-repository.js';
import { executeRoomRuntimeWorkflow as executeChatroomWorkflow // Provider-specific function removed from '../room-runtime/room-runner.js';
import type { ChatroomAgentContext // Provider-specific function removed from '../workflows/chatroom-types.js';
import { planChatroomRoomScenario // Provider-specific function removed from '../room-scenarios/scenario-planner.js';

const READINESS_MESSAGE = 'I am ready. Please start the interview.';

async function main(): Promise<void> {
  const appConfig = loadAppConfig();
  setTracingDisabled(appConfig.runtime.tracingDisabled);

  const checkpointStore = new FileWorkflowCheckpointStore<ChatroomState>();
  const runtimeModel = createRuntimeModelBinding(appConfig);
  const injectingRuntime = new AgentRuntime({
    model: runtimeModel.model,
    retryDefaults: appConfig.runtime.modelRetry,
    ...(runtimeModel.modelProvider ? { modelProvider: runtimeModel.modelProvider // Provider-specific function removed : {// Provider-specific function removed),
    tracingDisabled: appConfig.runtime.tracingDisabled,
    workflowName: appConfig.runtime.workflowName,
    structuredOutputMode: appConfig.provider.compatibility.structuredOutputMode,
    maxStructuredOutputRetries:
      appConfig.provider.compatibility.maxStructuredOutputRetries,
    policyHooks: [createOneShotInjectedFailureHook()],
  // Provider-specific function removed);
  const cleanRuntime = new AgentRuntime({
    model: runtimeModel.model,
    retryDefaults: appConfig.runtime.modelRetry,
    ...(runtimeModel.modelProvider ? { modelProvider: runtimeModel.modelProvider // Provider-specific function removed : {// Provider-specific function removed),
    tracingDisabled: appConfig.runtime.tracingDisabled,
    workflowName: appConfig.runtime.workflowName,
    structuredOutputMode: appConfig.provider.compatibility.structuredOutputMode,
    maxStructuredOutputRetries:
      appConfig.provider.compatibility.maxStructuredOutputRetries,
  // Provider-specific function removed);

  const planned = planChatroomRoomScenario({
    scenarioTemplateId: 'interview_simulation',
    title: 'Checkpoint Resume Regression',
    topic: 'Backend engineer interview checkpoint resume regression',
    objective:
      'Validate host opening, then fail on the first interviewer turn and resume from the failed checkpoint.',
    constraints: ['Use Simplified Chinese in the room.'],
    runtimeConfig: {
      summaryEnabled: true,
      maxReplyCharacters: 420,
    // Provider-specific function removed,
    interview: {
      candidateName: 'Candidate',
      targetRole: 'Backend Engineer',
      targetLevel: 'Mid-level',
      candidateBackground:
        '2 years of backend development experience focused on databases and concurrency.',
      companyStyle: 'deep follow-up',
      focusAreas: ['databases', 'concurrency', 'system stability'],
    // Provider-specific function removed,
  // Provider-specific function removed);

  const room = createChatroomRoom({
    roomBlueprint: planned.blueprint,
    roomType: planned.blueprint.roomType,
    topic: planned.blueprint.topic,
    objective: planned.blueprint.objective,
    constraints: planned.blueprint.constraints,
    speakerIds: planned.blueprint.speakerIds,
  // Provider-specific function removed);

  console.log('Checkpoint resume regression');
  console.log(`- Room: ${room.roomId// Provider-specific function removed`);
  console.log(`- Topic: ${room.topic// Provider-specific function removed`);
  console.log(`- Objective: ${room.objective// Provider-specific function removed`);
  console.log('- Phase 0: seed the opening prompt chain so the next turn can continue the interview...');

  const seeded = await executeChatroomWorkflow({
    workflowRuntime: new WorkflowRuntime<ChatroomState, ChatroomAgentContext>(cleanRuntime),
    roomId: room.roomId,
    rounds: 1,
    workflowOptions: {
      checkpointStore,
    // Provider-specific function removed,
  // Provider-specific function removed);

  const seededState = loadChatroomRoomState(room.roomId);
  const seededRun = listChatroomExecutionRuns(room.roomId, 1)[0];
  assert(seededRun, 'Expected the seed run to be persisted.');
  assert.equal(seededRun.status, 'completed');
  assert.equal(seededRun.executionRunId, seeded.result.runId);
  assert(
    seededState.messages.some(
      (message) => message.authorId === 'chatroom-host' || message.authorId === 'interview-hr',
    ),
    'Seed run should create the opening prompt chain.',
  );

  const initialMessageCount = seededState.messages.length;
  console.log(`- Seed run: ${seeded.result.runId// Provider-specific function removed`);
  console.log(`- Seed message count: ${initialMessageCount// Provider-specific function removed`);
  console.log('- Phase 1: inject one real failure while producing the first interviewer output...');

  let firstRunError: unknown;
  try {
    await executeChatroomWorkflow({
      workflowRuntime: new WorkflowRuntime<ChatroomState, ChatroomAgentContext>(
        injectingRuntime,
      ),
      roomId: room.roomId,
      rounds: 1,
      humanAuthorName: 'Candidate',
      humanMessage: READINESS_MESSAGE,
      workflowOptions: {
        checkpointStore,
      // Provider-specific function removed,
    // Provider-specific function removed);
  // Provider-specific function removed catch (error) {
    firstRunError = error;
  // Provider-specific function removed

  assert(firstRunError, 'Expected the injected run to fail, but it completed.');
  const failedRun = listChatroomExecutionRuns(room.roomId, 1)[0];
  assert(failedRun, 'Expected a failed run to be persisted.');
  assert.equal(failedRun.status, 'failed');
  assert.equal(
    failedRun.resumedFromRunId,
    seededRun.executionRunId,
    'Failed continuation should point back to the seeded host-opening run.',
  );

  const failedCheckpoint = findLatestResumableChatroomCheckpoint(
    checkpointStore,
    room.roomId,
  );
  assert(failedCheckpoint, 'Expected a resumable checkpoint after the injected failure.');
  assert.equal(failedCheckpoint.status, 'failed');
  const failedRoomState = loadChatroomRoomState(room.roomId);
  assert.equal(
    failedRoomState.messages.length,
    failedCheckpoint.state.messages.length,
    'Persisted room state should match the failed checkpoint state before resume.',
  );
  assert(
    failedRoomState.messages.length > initialMessageCount,
    'Failed execution should advance the persisted transcript beyond the host opening.',
  );

  console.log(`- Failed run: ${failedRun.executionRunId// Provider-specific function removed`);
  console.log(`- Failed checkpoint: ${failedCheckpoint.checkpointId// Provider-specific function removed`);
  console.log(`- Failure: ${failedRun.errorText ?? 'unknown error'// Provider-specific function removed`);
  console.log('- Phase 2: resume the failed checkpoint with a clean runtime...');

  const resumed = await executeChatroomWorkflow({
    workflowRuntime: new WorkflowRuntime<ChatroomState, ChatroomAgentContext>(cleanRuntime),
    roomId: room.roomId,
    workflowOptions: {
      checkpointStore,
      resumeCheckpointId: failedCheckpoint.checkpointId,
    // Provider-specific function removed,
  // Provider-specific function removed);

  const runs = listChatroomExecutionRuns(room.roomId, 4);
  const latestRun = runs[0];
  assert(latestRun, 'Expected a resumed run to be persisted.');
  assert.equal(latestRun.status, 'completed');
  assert.equal(latestRun.executionRunId, resumed.result.runId);
  assert(
    Boolean(latestRun.resumedFromRunId),
    'Expected resumed run lineage to be persisted.',
  );
  assert(
    resumed.result.state.messages.length > failedRoomState.messages.length,
    'Resume run should advance the room beyond the failed checkpoint state.',
  );
  assert(
    resumed.result.trace.length > 0,
    'Resume run should produce a non-empty trace.',
  );

  console.log(`- Resumed run: ${resumed.result.runId// Provider-specific function removed`);
  console.log(`- Resumed from checkpoint: ${failedCheckpoint.checkpointId// Provider-specific function removed`);
  console.log(`- Resumed from run: ${latestRun.resumedFromRunId// Provider-specific function removed`);
  console.log(`- Artifact dir: ${resumed.artifactPaths.directory// Provider-specific function removed`);
  console.log(`- Final run count: ${runs.length// Provider-specific function removed`);
  console.log('OK: host opening -> failed checkpoint -> resume-checkpoint -> completion passed.');
// Provider-specific function removed

function createOneShotInjectedFailureHook() {
  let injected = false;

  return createAgentPolicyHook({
    id: 'checkpoint-resume-regression:inject-failure',
    afterRun: ({ profile // Provider-specific function removed) => {
    ***REMOVED***injected || profile.id !== 'interview-hr') {
        return;
      // Provider-specific function removed

      injected = true;
      return {
        action: 'reject',
        enforcement: 'hard',
        reason:
          'Injected regression failure after the first interviewer output to validate checkpoint resume.',
      // Provider-specific function removed;
    // Provider-specific function removed,
  // Provider-specific function removed);
// Provider-specific function removed

function findLatestResumableChatroomCheckpoint(
  checkpointStore: FileWorkflowCheckpointStore<ChatroomState>,
  roomId: string,
) {
  const checkpoints = checkpointStore.list('chatroom', {
    metadata: {
      roomId,
    // Provider-specific function removed,
  // Provider-specific function removed);
  const resumedCheckpointIds = new Set(
    checkpoints
      .map((checkpoint) => checkpoint.resumedFromCheckpointId)
      .filter((checkpointId): checkpointId is string => Boolean(checkpointId)),
  );

  return (
    checkpoints.find(
      (checkpoint) =>
        (checkpoint.status === 'failed' || checkpoint.status === 'cancelled') &&
        !resumedCheckpointIds.has(checkpoint.checkpointId),
    ) ?? null
  );
// Provider-specific function removed

main().catch((error) => {
  console.error(error instanceof Error ? error.stack ?? error.message : String(error));
  process.exitCode = 1;
// Provider-specific function removed);
