import { WorkflowRuntime // Provider-specific function removed from '../core/workflow.js';
import type { ChatroomState // Provider-specific function removed from '../workflows/chatroom-discussion.js';
import {
  listChatroomAgentTurns,
// Provider-specific function removed from '../room-storage/agent-thread-repository.js';
import {
  getLatestChatroomExecutionRun,
  listChatroomExecutionRuns,
// Provider-specific function removed from '../room-storage/execution-run-repository.js';
import {
  createChatroomRoom,
  loadChatroomRoomState,
// Provider-specific function removed from '../room-storage/room-repository.js';
import { executeRoomRuntimeWorkflow as executeChatroomWorkflow // Provider-specific function removed from '../room-runtime/room-runner.js';
import type { ChatroomAgentContext // Provider-specific function removed from '../workflows/chatroom-types.js';
import { planChatroomRoomScenario // Provider-specific function removed from '../room-scenarios/scenario-planner.js';

const WORKFLOW_STEP_MAX_ATTEMPTS = 4;

type DiscussionSummaryType = 'analysis_like' | 'roleplay_like';

export interface DiscussionPressureScenarioExtra {
  finalSummaryPresent: boolean;
  summaryType: DiscussionSummaryType | null;
  recentAuthors: string[];
// Provider-specific function removed

export interface DiscussionPressureScenarioResult {
  label: 'complex_discussion_room';
  roomId: string;
  scenarioTemplateId: string | undefined;
  speakerCount: number;
  workflowRunCount: number;
  completedRunCount: number;
  failedRunCount: number;
  agentTurnCount: number;
  messageCount: number;
  wallTimeMs: number;
  averageWallMsPerAgentTurn: number;
  connectionRetryCount: number;
  latestRunStatus: string | undefined;
  latestArtifactDirectory: string | undefined;
  extra: DiscussionPressureScenarioExtra;
// Provider-specific function removed

export async function runDiscussionPressureScenario(args: {
  workflowRuntime: WorkflowRuntime<ChatroomState, ChatroomAgentContext>;
// Provider-specific function removed): Promise<DiscussionPressureScenarioResult> {
  const planned = planChatroomRoomScenario({
    scenarioTemplateId: 'project_development_discussion',
    title: 'Project Discussion Pressure Room',
    topic:
      'Launch an AI coding collaboration platform for enterprise customers across compliance, billing, security, support, and delivery constraints',
    objective:
      'Drive a concrete launch plan with architecture, rollout risk controls, GTM tradeoffs, support load planning, compliance boundaries, and decision ownership.',
    constraints: [
      'Use Simplified Chinese in the room.',
      'Every speaker must contribute one concrete decision, risk, or action.',
      'Avoid generic slogans and keep the discussion anchored in launch constraints.',
    ],
    runtimeConfig: {
      summaryEnabled: true,
      parallelBatchSize: 4,
      maxReplyCharacters: 1600,
    // Provider-specific function removed,
    project: {
      projectName: 'AX Enterprise Launch',
      projectStage: 'planning',
      teamContext:
        'Cross-functional launch involving product, architecture, implementation, research, security, operations, and executive stakeholders.',
      decisionFocus: [
        'launch architecture',
        'security and compliance',
        'billing and finance risk',
        'customer support readiness',
        'rollout operations',
      ],
    // Provider-specific function removed,
    metadata: {
      scenario: {
        focusAreas: [
          'architecture',
          'rollout governance',
          'security',
          'support load',
          'commercial risk',
        ],
      // Provider-specific function removed,
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

  console.log(`\n[discussion] room=${room.roomId// Provider-specific function removed`);
  const startedAt = Date.now();
  const connectionRetryCount = await executeWorkflowStep(
    {
      workflowRuntime: args.workflowRuntime,
      roomId: room.roomId,
      rounds: 3,
    // Provider-specific function removed,
    'discussion:main',
  );

  const finalState = loadChatroomRoomState(room.roomId);
  const runs = listChatroomExecutionRuns(room.roomId, 16);
  const agentTurns = listChatroomAgentTurns(room.roomId, {
    limit: 512,
  // Provider-specific function removed);
  const latestRun = getLatestChatroomExecutionRun(room.roomId);
  const wallTimeMs = Date.now() - startedAt;

  return {
    label: 'complex_discussion_room',
    roomId: room.roomId,
    scenarioTemplateId: finalState.roomBlueprint?.scenarioTemplateId,
    speakerCount: finalState.speakerIds.length,
    workflowRunCount: 1,
    completedRunCount: runs.filter((run) => run.status === 'completed').length,
    failedRunCount: runs.filter((run) => run.status === 'failed').length,
    agentTurnCount: agentTurns.length,
    messageCount: finalState.messages.length,
    wallTimeMs,
    averageWallMsPerAgentTurn:
      agentTurns.length > 0 ? Math.round(wallTimeMs / agentTurns.length) : 0,
    connectionRetryCount,
    latestRunStatus: latestRun?.status,
    latestArtifactDirectory: latestRun?.artifactDirectory,
    extra: {
      finalSummaryPresent: Boolean(finalState.finalSummary),
      summaryType: detectDiscussionSummaryType(finalState.finalSummary),
      recentAuthors: finalState.messages.slice(-8).map((message) => message.authorName),
    // Provider-specific function removed,
  // Provider-specific function removed;
// Provider-specific function removed

async function executeWorkflowStep(
  input: Parameters<typeof executeChatroomWorkflow>[0],
  label: string,
): Promise<number> {
  let retryCount = 0;
  let lastError: unknown;

  for (let attempt = 1; attempt <= WORKFLOW_STEP_MAX_ATTEMPTS; attempt += 1) {
    try {
    ***REMOVED***attempt > 1) {
        console.log(`[retry] ${label// Provider-specific function removed attempt ${attempt// Provider-specific function removed/${WORKFLOW_STEP_MAX_ATTEMPTS// Provider-specific function removed`);
      // Provider-specific function removed
      await executeChatroomWorkflow(input);
      return retryCount;
    // Provider-specific function removed catch (error) {
      lastError = error;
    ***REMOVED***!isRetriableConnectionError(error) || attempt === WORKFLOW_STEP_MAX_ATTEMPTS) {
        throw error;
      // Provider-specific function removed
      retryCount += 1;
      await sleep(attempt * 2_000);
    // Provider-specific function removed
  // Provider-specific function removed

  throw lastError;
// Provider-specific function removed

function detectDiscussionSummaryType(finalSummary: ChatroomState['finalSummary']): DiscussionSummaryType | null {
***REMOVED***!finalSummary || typeof finalSummary !== 'object' || Array.isArray(finalSummary)) {
***REMOVED***
  // Provider-specific function removed

  return 'executiveSummary' in finalSummary ? 'analysis_like' : 'roleplay_like';
// Provider-specific function removed

function isRetriableConnectionError(error: unknown***REMOVED***
  const message = error instanceof Error ? error.message : String(error);
  return /Connection error|fetch failed|ECONNRESET|ETIMEDOUT|socket hang up/i.test(message);
// Provider-specific function removed

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  // Provider-specific function removed);
// Provider-specific function removed
