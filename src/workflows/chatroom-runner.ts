import { ExecutionAbortedError // Provider-specific function removed from '../core/execution-control.js';
import type { WorkflowCheckpointRecord // Provider-specific function removed from '../core/workflow-checkpoints.js';
import type {
  WorkflowExecuteOptions,
  WorkflowObserver,
  WorkflowResult,
  WorkflowRuntime,
// Provider-specific function removed from '../core/workflow.js';
import { createChatroomLiveObserver // Provider-specific function removed from './chatroom-live.js';
import {
  getLatestChatroomExecutionRun,
  persistChatroomExecutionRun,
  resolveRoomIdForExecutionRun,
// Provider-specific function removed from '../room-storage/execution-run-repository.js';
import {
  createChatroomRoom,
  getChatroomRoomRecord,
  loadChatroomRoomState,
// Provider-specific function removed from '../room-storage/room-repository.js';
import { markChatroomPendingMessageCompleted // Provider-specific function removed from '../room-storage/queue-repository.js';
import {
  buildChatroomCheckpointMetadata,
  parseChatroomCheckpointMetadata,
  type ChatroomCheckpointMetadata,
  type ChatroomExecutionMode,
// Provider-specific function removed from '../room-runtime/checkpoint-metadata.js';
import { executeWithRoomLease // Provider-specific function removed from '../room-runtime/room-lease.js';
import {
  combineWorkflowObservers,
  createCapturedWorkflowObserver as createCapturedChatroomObserver,
  createCapturedWorkflowRunState as createCapturedChatroomRunState,
  mergeWorkflowOptions,
  type CapturedWorkflowRunState,
// Provider-specific function removed from '../room-runtime/runtime-support.js';
import {
  continueChatroomWorkflow,
  createChatroomWorkflow,
  getNextChatroomRound,
  resolveChatroomParallelBatchSize,
  runChatroomWorkflow,
  type ChatroomState,
// Provider-specific function removed from './chatroom-discussion.js';
import type { ChatroomRoomTypeId // Provider-specific function removed from './chatroom-room-types.js';
import {
  type ChatroomRoomBlueprint,
  ensureChatroomRoomBlueprint,
// Provider-specific function removed from '../room-scenarios/room-blueprints.js';
import type { RoleplayCharacterCard // Provider-specific function removed from '../room-scenarios/roleplay/roleplay-characters.js';
import {
  loadChatroomState,
  saveChatroomArtifacts,
  type ChatroomArtifactPaths,
// Provider-specific function removed from './chatroom-storage.js';
import type { ChatroomAgentContext // Provider-specific function removed from './chatroom-types.js';

export interface ExecuteChatroomWorkflowInput {
  workflowRuntime: WorkflowRuntime<ChatroomState, ChatroomAgentContext>;
  topic?: string;
  objective?: string;
  constraints?: string[];
  roomType?: ChatroomRoomTypeId;
  roomBlueprint?: ChatroomRoomBlueprint;
  rounds?: number;
  speakerIds?: string[];
  parallelBatchSize?: number;
  roomId?: string;
  resumeRunId?: string;
  humanMessage?: string;
  humanAuthorName?: string;
  customCharacters?: RoleplayCharacterCard[];
  customRoleplayTemplates?: Map<string, import('./chatroom-roleplay-state.js').RoleplayCharacterTemplate>;
  maxReplyCharacters?: number;
  summaryEnabled?: boolean;
  workflowOptions?: WorkflowExecuteOptions<ChatroomState>;
// Provider-specific function removed

export interface ExecutedChatroomWorkflow {
  mode: ChatroomExecutionMode;
  roomId?: string;
  resumedFromRunId?: string;
  note?: string;
  artifactPaths: ChatroomArtifactPaths;
  result: WorkflowResult<ChatroomState>;
// Provider-specific function removed

type CapturedChatroomRunState = CapturedWorkflowRunState<ChatroomState>;

export async function executeChatroomWorkflow(
  input: ExecuteChatroomWorkflowInput,
): Promise<ExecutedChatroomWorkflow> {
***REMOVED***input.roomId && input.resumeRunId) {
    throw new Error('Use either roomId or resumeRunId, not both.');
  // Provider-specific function removed

***REMOVED***input.workflowOptions?.resumeCheckpointId && input.resumeRunId) {
    throw new Error('Use either resumeCheckpointId or resumeRunId, not both.');
  // Provider-specific function removed

***REMOVED***input.workflowOptions?.resumeCheckpointId) {
    return executeChatroomCheckpointResume(input, input.workflowOptions.resumeCheckpointId);
  // Provider-specific function removed

***REMOVED***input.roomId) {
    return executeWithRoomLease({
      roomId: input.roomId,
      holderLabel: `room-continue:${input.roomId// Provider-specific function removed`,
      run: async (leaseObserver) => {
        const previousState = loadChatroomRoomState(input.roomId!);
        const latestRun = getLatestChatroomExecutionRun(input.roomId!);
        const rounds = resolveRunnerRounds(previousState.roomBlueprint, input.rounds ?? 1);
        const speakerIds = [...previousState.speakerIds];
        const capturedRun = createCapturedChatroomRunState<ChatroomState>();
        const workflowOptions = mergeWorkflowOptions(input.workflowOptions, {
          observer: combineWorkflowObservers(
            createChatroomLiveObserver({
              roomId: input.roomId!,
              resumedFromRunId: latestRun?.executionRunId,
            // Provider-specific function removed),
            leaseObserver,
            createCapturedChatroomObserver(capturedRun),
            input.workflowOptions?.observer,
          ),
          checkpointMetadata: buildChatroomCheckpointMetadata({
            mode: 'room-continue',
            roomId: input.roomId!,
            roomType: previousState.roomType,
            roomBlueprintId: previousState.roomBlueprint?.blueprintId,
            scenarioTemplateId: previousState.roomBlueprint?.scenarioTemplateId,
            topic: previousState.topic,
            objective: previousState.objective,
            constraints: previousState.constraints,
            startRound: getNextChatroomRound(previousState.messages),
            rounds,
            speakerIds,
            parallelBatchSize: resolveChatroomParallelBatchSize(
              input.parallelBatchSize,
              speakerIds.length,
            ),
            baseMessageCount: previousState.messages.length,
            resumedFromRunId: latestRun?.executionRunId,
            humanAuthorName: normalizeOptionalString(input.humanAuthorName),
            humanMessage: normalizeOptionalString(input.humanMessage),
          // Provider-specific function removed),
        // Provider-specific function removed);
        let result: WorkflowResult<ChatroomState>;
        try {
          result = await continueChatroomWorkflow(
            input.workflowRuntime,
            previousState,
            {
              roomId: input.roomId!,
              additionalRounds: rounds,
              humanMessage: input.humanMessage,
              humanAuthorName: input.humanAuthorName,
              parallelBatchSize: input.parallelBatchSize,
            // Provider-specific function removed,
            workflowOptions,
          );
        // Provider-specific function removed catch (error) {
          persistFailedChatroomExecution({
            roomId: input.roomId!,
            rounds,
            baseMessageCount: previousState.messages.length,
            resumedFromRunId: latestRun?.executionRunId,
            humanAuthorName: input.humanAuthorName,
            humanMessage: input.humanMessage,
            capturedRun,
          // Provider-specific function removed);
          throw error;
        // Provider-specific function removed
        const artifactPaths = saveChatroomArtifacts(result, {
          roomId: input.roomId!,
          mainSessionId: resolveChatroomRoomMainSessionId(input.roomId!),
          executionRunId: result.runId,
          resumedFromRunId: latestRun?.executionRunId,
        // Provider-specific function removed);

        await persistChatroomExecutionRun({
          roomId: input.roomId!,
          rounds,
          baseMessageCount: previousState.messages.length,
          result,
          artifactDirectory: artifactPaths.directory,
          resumedFromRunId: latestRun?.executionRunId,
          humanAuthorName: input.humanAuthorName,
          humanMessage: input.humanMessage,
          runtime: input.workflowRuntime.runtime,
        // Provider-specific function removed);

        return {
          mode: 'room-continue' as const,
          roomId: input.roomId!,
          resumedFromRunId: latestRun?.executionRunId,
          artifactPaths,
          result,
        // Provider-specific function removed;
      // Provider-specific function removed,
    // Provider-specific function removed);
  // Provider-specific function removed

***REMOVED***input.resumeRunId) {
    const artifactState = loadChatroomState(input.resumeRunId);
    const linkedRoomId = resolveRoomIdForExecutionRun(input.resumeRunId);
    // When a linked SQLite room exists, prefer the current DB state over the
    // artifact snapshot to avoid rolling back messages from subsequent runs.
    const previousState = linkedRoomId
      ? loadChatroomRoomState(linkedRoomId)
      : artifactState;
    const note = linkedRoomId
      ? undefined
      : 'Legacy artifact resume mode: no linked SQLite room was found, so this continuation was not persisted to the room store.';
    const rounds = resolveRunnerRounds(previousState.roomBlueprint, input.rounds ?? 1);
    const speakerIds = [...previousState.speakerIds];
    const executeArtifactResume = async (
      leaseObserver?: WorkflowObserver<ChatroomState>,
    ): Promise<ExecutedChatroomWorkflow> => {
      const capturedRun = createCapturedChatroomRunState<ChatroomState>();
      const workflowOptions = mergeWorkflowOptions(input.workflowOptions, {
        observer: combineWorkflowObservers(
          linkedRoomId
            ? createChatroomLiveObserver({
                roomId: linkedRoomId,
                resumedFromRunId: input.resumeRunId,
                note,
              // Provider-specific function removed)
            : undefined,
          leaseObserver,
          createCapturedChatroomObserver(capturedRun),
          input.workflowOptions?.observer,
        ),
        checkpointMetadata: buildChatroomCheckpointMetadata({
          mode: 'artifact-resume',
          roomId: linkedRoomId ?? undefined,
          roomType: previousState.roomType,
          roomBlueprintId: previousState.roomBlueprint?.blueprintId,
          scenarioTemplateId: previousState.roomBlueprint?.scenarioTemplateId,
          topic: previousState.topic,
          objective: previousState.objective,
          constraints: previousState.constraints,
          startRound: getNextChatroomRound(previousState.messages),
          rounds,
          speakerIds,
          parallelBatchSize: resolveChatroomParallelBatchSize(
            input.parallelBatchSize,
            speakerIds.length,
          ),
          baseMessageCount: previousState.messages.length,
          resumedFromRunId: linkedRoomId ? input.resumeRunId : undefined,
          resumeRunId: input.resumeRunId,
          humanAuthorName: normalizeOptionalString(input.humanAuthorName),
          humanMessage: normalizeOptionalString(input.humanMessage),
        // Provider-specific function removed),
      // Provider-specific function removed);
      let result: WorkflowResult<ChatroomState>;
      try {
        result = await continueChatroomWorkflow(
          input.workflowRuntime,
          previousState,
          {
            roomId: linkedRoomId ?? undefined,
            additionalRounds: rounds,
            humanMessage: input.humanMessage,
            humanAuthorName: input.humanAuthorName,
            parallelBatchSize: input.parallelBatchSize,
          // Provider-specific function removed,
          workflowOptions,
        );
      // Provider-specific function removed catch (error) {
      ***REMOVED***linkedRoomId) {
          persistFailedChatroomExecution({
            roomId: linkedRoomId,
            rounds,
            baseMessageCount: previousState.messages.length,
            resumedFromRunId: input.resumeRunId,
            humanAuthorName: input.humanAuthorName,
            humanMessage: input.humanMessage,
            capturedRun,
          // Provider-specific function removed);
        // Provider-specific function removed
        throw error;
      // Provider-specific function removed
      const artifactPaths = saveChatroomArtifacts(result, {
        roomId: linkedRoomId ?? undefined,
        mainSessionId: linkedRoomId
          ? resolveChatroomRoomMainSessionId(linkedRoomId)
          : undefined,
        executionRunId: result.runId,
        resumedFromRunId: input.resumeRunId,
      // Provider-specific function removed);

    ***REMOVED***linkedRoomId) {
        await persistChatroomExecutionRun({
          roomId: linkedRoomId,
          rounds,
          baseMessageCount: previousState.messages.length,
          result,
          artifactDirectory: artifactPaths.directory,
          resumedFromRunId: input.resumeRunId,
          humanAuthorName: input.humanAuthorName,
          humanMessage: input.humanMessage,
          runtime: input.workflowRuntime.runtime,
        // Provider-specific function removed);
      // Provider-specific function removed

      return {
        mode: 'artifact-resume',
        roomId: linkedRoomId ?? undefined,
        resumedFromRunId: input.resumeRunId,
        artifactPaths,
        result,
        note,
      // Provider-specific function removed;
    // Provider-specific function removed;

  ***REMOVED***linkedRoomId) {
      return executeWithRoomLease({
        roomId: linkedRoomId,
        holderLabel: `artifact-resume:${linkedRoomId// Provider-specific function removed:${input.resumeRunId// Provider-specific function removed`,
        run: async (leaseObserver) => executeArtifactResume(leaseObserver),
      // Provider-specific function removed);
    // Provider-specific function removed

    return executeArtifactResume();
  // Provider-specific function removed

***REMOVED***!input.topic || !input.objective) {
    throw new Error('topic and objective are required when creating a new chatroom.');
  // Provider-specific function removed

  const roomBlueprint = ensureChatroomRoomBlueprint(input.roomBlueprint, {
    roomType: input.roomType,
    topic: input.topic,
    objective: input.objective,
    constraints: input.constraints,
    speakerIds: input.speakerIds,
    parallelBatchSize: input.parallelBatchSize,
    customCharacters: input.customCharacters,
    maxReplyCharacters: input.maxReplyCharacters,
    summaryEnabled: input.summaryEnabled,
  // Provider-specific function removed);
  const room = createChatroomRoom({
    roomBlueprint,
    roomType: roomBlueprint.roomType,
    topic: roomBlueprint.topic,
    objective: roomBlueprint.objective,
    constraints: roomBlueprint.constraints,
    speakerIds: roomBlueprint.speakerIds,
  // Provider-specific function removed);
  const rounds = resolveRunnerRounds(room.roomBlueprint ?? roomBlueprint, input.rounds ?? 2);
  const capturedRun = createCapturedChatroomRunState<ChatroomState>();
  const workflowOptions = mergeWorkflowOptions(input.workflowOptions, {
    observer: combineWorkflowObservers(
      createChatroomLiveObserver({
        roomId: room.roomId,
      // Provider-specific function removed),
      createCapturedChatroomObserver(capturedRun),
      input.workflowOptions?.observer,
    ),
    checkpointMetadata: buildChatroomCheckpointMetadata({
      mode: 'new-room',
      roomId: room.roomId,
      roomType: room.roomType,
      roomBlueprintId: room.roomBlueprint?.blueprintId ?? roomBlueprint.blueprintId,
      scenarioTemplateId:
        room.roomBlueprint?.scenarioTemplateId ?? roomBlueprint.scenarioTemplateId,
      topic: room.topic,
      objective: room.objective,
      constraints: room.constraints,
      startRound: 1,
      rounds,
      speakerIds: [...room.speakerIds],
      parallelBatchSize: resolveChatroomParallelBatchSize(
        input.parallelBatchSize,
        room.speakerIds.length,
      ),
      baseMessageCount: 0,
      // Provider-specific function removed),
  // Provider-specific function removed);
  let result: WorkflowResult<ChatroomState>;
  try {
    result = await runChatroomWorkflow(
      input.workflowRuntime,
      {
        roomId: room.roomId,
        topic: room.topic,
        objective: room.objective,
        roomBlueprint: room.roomBlueprint ?? roomBlueprint,
        rounds,
        parallelBatchSize: input.parallelBatchSize,
        customRoleplayTemplates: input.customRoleplayTemplates,
      // Provider-specific function removed,
      workflowOptions,
    );
  // Provider-specific function removed catch (error) {
    persistFailedChatroomExecution({
      roomId: room.roomId,
      rounds,
      baseMessageCount: 0,
      capturedRun,
    // Provider-specific function removed);
    throw error;
  // Provider-specific function removed
  const artifactPaths = saveChatroomArtifacts(result, {
    roomId: room.roomId,
    mainSessionId: room.mainSessionId,
    executionRunId: result.runId,
  // Provider-specific function removed);

  await persistChatroomExecutionRun({
    roomId: room.roomId,
    rounds,
    baseMessageCount: 0,
    result,
    artifactDirectory: artifactPaths.directory,
    runtime: input.workflowRuntime.runtime,
  // Provider-specific function removed);

  return {
    mode: 'new-room',
    roomId: room.roomId,
    artifactPaths,
    result,
  // Provider-specific function removed;
// Provider-specific function removed

async function executeChatroomCheckpointResume(
  input: ExecuteChatroomWorkflowInput,
  resumeCheckpointId: string,
): Promise<ExecutedChatroomWorkflow> {
  const checkpoint = loadChatroomCheckpointRecord(input, resumeCheckpointId);
  const metadata = parseChatroomCheckpointMetadata(checkpoint);
  const roomId = input.roomId ?? metadata.roomId;
***REMOVED***!roomId) {
    throw new Error(
      [
        `Checkpoint "${resumeCheckpointId// Provider-specific function removed" is missing room linkage metadata.`,
        'Only room-linked chatroom checkpoints can be resumed back into persisted room state.',
      ].join(' '),
    );
  // Provider-specific function removed
***REMOVED***metadata.roomId && input.roomId && metadata.roomId !== input.roomId) {
    throw new Error(
      `Checkpoint "${resumeCheckpointId// Provider-specific function removed" belongs to room "${metadata.roomId// Provider-specific function removed", not "${input.roomId// Provider-specific function removed".`,
    );
  // Provider-specific function removed

  return executeWithRoomLease({
    roomId,
    holderLabel: `checkpoint-resume:${roomId// Provider-specific function removed:${resumeCheckpointId// Provider-specific function removed`,
    run: async (leaseObserver) => {
      const checkpointResumeState = resolveCheckpointResumeState({
        roomId,
        checkpoint,
        metadata,
      // Provider-specific function removed);
      const checkpointNote = `Resuming ${checkpoint.status// Provider-specific function removed checkpoint ${checkpoint.checkpointId// Provider-specific function removed.`;
      const capturedRun = createCapturedChatroomRunState<ChatroomState>();
      const workflowOptions = mergeWorkflowOptions(input.workflowOptions, {
        observer: combineWorkflowObservers(
          createChatroomLiveObserver({
            roomId,
            resumedFromRunId: checkpointResumeState.resumedFromRunId,
            note: checkpointNote,
          // Provider-specific function removed),
          leaseObserver,
          createCapturedChatroomObserver(capturedRun),
          input.workflowOptions?.observer,
        ),
        checkpointMetadata: buildChatroomCheckpointMetadata({
          ...metadata,
          mode: 'checkpoint-resume',
          roomId,
          baseMessageCount: checkpointResumeState.baseMessageCount,
          resumedFromRunId: checkpointResumeState.resumedFromRunId,
        // Provider-specific function removed),
      // Provider-specific function removed);
      let result: WorkflowResult<ChatroomState>;
      try {
        result = await input.workflowRuntime.execute(
          createChatroomWorkflow({
            roomId,
            roomType: metadata.roomType,
            roomBlueprint: checkpoint.state.roomBlueprint,
            startRound: metadata.startRound,
            rounds: metadata.rounds,
            speakerIds: [...metadata.speakerIds],
            parallelBatchSize: metadata.parallelBatchSize,
            customCharacters: checkpoint.state.customCharacters,
            customRoleplayTemplates: checkpoint.state.customRoleplayTemplates,
            summaryEnabled: checkpoint.state.roomBlueprint?.runtimeConfig.summaryEnabled,
          // Provider-specific function removed),
          structuredClone(checkpoint.state),
          workflowOptions,
        );
      // Provider-specific function removed catch (error) {
        persistFailedChatroomExecution({
          roomId,
          rounds: metadata.rounds,
          baseMessageCount: checkpointResumeState.baseMessageCount,
          resumedFromRunId: checkpointResumeState.resumedFromRunId,
          humanAuthorName: metadata.humanAuthorName,
          humanMessage: metadata.humanMessage,
          capturedRun,
          traceStartIndex: checkpoint.trace.length,
        // Provider-specific function removed);
        throw error;
      // Provider-specific function removed
      const persistedResult = createCheckpointResumePersistedResult({
        result,
        traceStartIndex: checkpoint.trace.length,
      // Provider-specific function removed);
      const artifactPaths = saveChatroomArtifacts(persistedResult, {
        roomId,
        mainSessionId: resolveChatroomRoomMainSessionId(roomId),
        executionRunId: persistedResult.runId,
        resumedFromRunId: checkpointResumeState.resumedFromRunId,
      // Provider-specific function removed);

      await persistChatroomExecutionRun({
        roomId,
        rounds: metadata.rounds,
        baseMessageCount: checkpointResumeState.baseMessageCount,
        result: persistedResult,
        artifactDirectory: artifactPaths.directory,
        resumedFromRunId: checkpointResumeState.resumedFromRunId,
        humanAuthorName: metadata.humanAuthorName,
        humanMessage: metadata.humanMessage,
        runtime: input.workflowRuntime.runtime,
      // Provider-specific function removed);

    ***REMOVED***metadata.pendingMessageId) {
        markChatroomPendingMessageCompleted({
          pendingMessageId: metadata.pendingMessageId,
          processedExecutionRunId: persistedResult.runId,
        // Provider-specific function removed);
      // Provider-specific function removed

      return {
        mode: 'checkpoint-resume',
        roomId,
        resumedFromRunId: checkpointResumeState.resumedFromRunId,
        note: `Resumed ${checkpoint.status// Provider-specific function removed checkpoint ${checkpoint.checkpointId// Provider-specific function removed for room ${roomId// Provider-specific function removed.`,
        artifactPaths,
        result: persistedResult,
      // Provider-specific function removed;
    // Provider-specific function removed,
  // Provider-specific function removed);
// Provider-specific function removed

function resolveCheckpointResumeState(args: {
  roomId: string;
  checkpoint: WorkflowCheckpointRecord<ChatroomState>;
  metadata: ChatroomCheckpointMetadata;
// Provider-specific function removed): {
  baseMessageCount: number;
  resumedFromRunId?: string;
// Provider-specific function removed {
  const persistedState = loadChatroomRoomState(args.roomId);
  const checkpointMessageCount = args.checkpoint.state.messages.length;
  const persistedBlueprintId = persistedState.roomBlueprint?.blueprintId;
  const checkpointBlueprintId =
    args.checkpoint.state.roomBlueprint?.blueprintId ?? args.metadata.roomBlueprintId;
***REMOVED***persistedState.messages.length !== checkpointMessageCount) {
    throw new Error(
      [
        `Room "${args.roomId// Provider-specific function removed" diverged from checkpoint "${args.checkpoint.checkpointId// Provider-specific function removed".`,
        `Persisted room has ${persistedState.messages.length// Provider-specific function removed messages,`,
        `but the checkpoint expects ${checkpointMessageCount// Provider-specific function removed.`,
        'Resume into the current room state is blocked to avoid duplicating or skipping messages.',
      ].join(' '),
    );
  // Provider-specific function removed
***REMOVED***
    persistedBlueprintId &&
    checkpointBlueprintId &&
    persistedBlueprintId !== checkpointBlueprintId
***REMOVED***
    throw new Error(
      [
        `Room "${args.roomId// Provider-specific function removed" blueprint diverged from checkpoint "${args.checkpoint.checkpointId// Provider-specific function removed".`,
        `Persisted room uses blueprint "${persistedBlueprintId// Provider-specific function removed",`,
        `but the checkpoint expects "${checkpointBlueprintId// Provider-specific function removed".`,
      ].join(' '),
    );
  // Provider-specific function removed

  const resumedFromRunId =
    resolveRoomIdForExecutionRun(args.checkpoint.checkpointId) === args.roomId
      ? args.checkpoint.checkpointId
      : args.metadata.resumedFromRunId;

  return {
    baseMessageCount: checkpointMessageCount,
    resumedFromRunId,
  // Provider-specific function removed;
// Provider-specific function removed

function createCheckpointResumePersistedResult(args: {
  result: WorkflowResult<ChatroomState>;
  traceStartIndex: number;
// Provider-specific function removed): WorkflowResult<ChatroomState> {
  return {
    ...args.result,
    trace: args.result.trace.slice(args.traceStartIndex),
  // Provider-specific function removed;
// Provider-specific function removed

function loadChatroomCheckpointRecord(
  input: ExecuteChatroomWorkflowInput,
  checkpointId: string,
): WorkflowCheckpointRecord<ChatroomState> {
  const checkpointStore = input.workflowOptions?.checkpointStore;
***REMOVED***!checkpointStore) {
    throw new Error('resumeCheckpointId requires checkpointStore to be provided.');
  // Provider-specific function removed

  const checkpoint =
    checkpointStore.load(checkpointId, 'chatroom') ?? checkpointStore.load(checkpointId);
***REMOVED***!checkpoint) {
    throw new Error(`Checkpoint "${checkpointId// Provider-specific function removed" was not found for workflow "chatroom".`);
  // Provider-specific function removed
***REMOVED***checkpoint.workflowId !== 'chatroom') {
    throw new Error(
      `Checkpoint "${checkpointId// Provider-specific function removed" belongs to workflow "${checkpoint.workflowId// Provider-specific function removed", not "chatroom".`,
    );
  // Provider-specific function removed

  return checkpoint;
// Provider-specific function removed

function persistFailedChatroomExecution(args: {
  roomId: string;
  rounds: number;
  baseMessageCount: number;
  resumedFromRunId?: string;
  humanAuthorName?: string;
  humanMessage?: string;
  capturedRun: CapturedChatroomRunState;
  traceStartIndex?: number;
// Provider-specific function removed): void {
  const failedEvent = args.capturedRun.failedEvent;
***REMOVED***!failedEvent) {
    return;
  // Provider-specific function removed

  const partialResult: WorkflowResult<ChatroomState> = {
    runId: failedEvent.runId,
    workflowId: failedEvent.workflowId,
    stateVersion: failedEvent.stateVersion,
    state: failedEvent.state,
    trace: failedEvent.trace.slice(args.traceStartIndex ?? 0),
  // Provider-specific function removed;
  const artifactPaths = saveChatroomArtifacts(partialResult, {
    roomId: args.roomId,
    mainSessionId: resolveChatroomRoomMainSessionId(args.roomId),
    executionRunId: partialResult.runId,
    resumedFromRunId: args.resumedFromRunId,
  // Provider-specific function removed);

  persistChatroomExecutionRun({
    roomId: args.roomId,
    rounds: args.rounds,
    baseMessageCount: args.baseMessageCount,
    result: partialResult,
    status: classifyChatroomFailureStatus(failedEvent.error),
    errorText: formatChatroomFailureError(failedEvent.error),
    artifactDirectory: artifactPaths.directory,
    resumedFromRunId: args.resumedFromRunId,
    humanAuthorName: args.humanAuthorName,
    humanMessage: args.humanMessage,
  // Provider-specific function removed);
// Provider-specific function removed

function classifyChatroomFailureStatus(
  error: unknown,
): 'failed' | 'cancelled' {
  return error instanceof ExecutionAbortedError ? 'cancelled' : 'failed';
// Provider-specific function removed

function formatChatroomFailureError(error: unknown): string {
***REMOVED***error instanceof Error) {
    return error.stack ?? error.message;
  // Provider-specific function removed

  return String(error);
// Provider-specific function removed

function resolveChatroomRoomMainSessionId(roomId: string): string | undefined {
  return getChatroomRoomRecord(roomId)?.mainSessionId;
// Provider-specific function removed

function normalizeOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
// Provider-specific function removed

function resolveRunnerRounds(
  roomBlueprint: ChatroomRoomBlueprint | undefined,
  requestedRounds: number,
): number {
  return roomBlueprint?.scenarioTemplateId === 'interview_simulation' ? 1 : requestedRounds;
// Provider-specific function removed
