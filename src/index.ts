import { stdin as processStdin, stdout as processStdout // Provider-specific function removed from 'node:process';
import readline from 'node:readline/promises';
import { parseArgs // Provider-specific function removed from 'node:util';

import { setTracingDisabled // Provider-specific function removed from '@openai/agents-core';

import {
  selectSpeakerIdsForPreset,
  selectCustomRoleplaySpeakerIds,
// Provider-specific function removed from './agents/chatroom-profiles.js';
import type { WorkflowAgentContext // Provider-specific function removed from './agents/profiles.js';
import { createRuntimeModelBinding, loadAppConfig // Provider-specific function removed from './config/app-config.js';
import { AgentRuntime // Provider-specific function removed from './core/agent-runtime.js';
import { ExecutionAbortedError // Provider-specific function removed from './core/execution-control.js';
import { FileWorkflowCheckpointStore // Provider-specific function removed from './core/workflow-checkpoints.js';
import {
  WorkflowRuntime,
  type WorkflowExecuteOptions,
  type WorkflowObserver,
// Provider-specific function removed from './core/workflow.js';
import { ChatroomTui // Provider-specific function removed from './tui/chatroom-tui.js';
import {
  runDiscussionWorkflow,
  type DiscussionState,
// Provider-specific function removed from './workflows/discussion-analysis.js';
import {
  claimNextChatroomPendingMessage,
  deleteChatroomRoom,
  enqueueChatroomPendingMessage,
  getChatroomMainSession,
  isChatroomRoomBusyError,
  markChatroomPendingMessageCompleted,
  markChatroomPendingMessageFailed,
  releaseChatroomPendingMessage,
// Provider-specific function removed from './room-app/room-service.js';
import { formatChatTranscript // Provider-specific function removed from './workflows/chatroom-format.js';
import { loadChatroomLiveSnapshot // Provider-specific function removed from './workflows/chatroom-live.js';
import {
  DEFAULT_CHATROOM_ROOM_TYPE,
  listChatroomRoomTypes,
  parseChatroomRoomType,
  type ChatroomRoomTypeId,
  resolveChatroomRoomType,
// Provider-specific function removed from './workflows/chatroom-room-types.js';
import {
  clearChatroomRunStopRequest,
  loadChatroomQueuePauseState,
  loadChatroomRunStopRequest,
  pauseChatroomQueue,
  resumeChatroomQueue,
  writeChatroomRunStopRequest,
// Provider-specific function removed from './workflows/chatroom-run-control.js';
import {
  createCustomRoleplayTemplates,
// Provider-specific function removed from './workflows/chatroom-roleplay-state.js';
import type { ChatroomState // Provider-specific function removed from './workflows/chatroom-discussion.js';
import {
  executeRoomWorkflow as executeChatroomWorkflow,
  type ExecutedRoomWorkflow as ExecutedChatroomWorkflow,
// Provider-specific function removed from './room-app/room-runtime-service.js';
import type { ChatroomAgentContext // Provider-specific function removed from './workflows/chatroom-types.js';
import {
  resolveChatroomManualCreatePlan,
// Provider-specific function removed from './workflows/chatroom-manual-create.js';
import type { ChatroomRoomBlueprint // Provider-specific function removed from './room-scenarios/room-blueprints.js';
import { formatRoomBlueprintGovernanceSummary // Provider-specific function removed from './room-scenarios/room-blueprints.js';
import {
  advanceRoomPlanningWithPlatformAdmin,
  planRoomWithPlatformAdmin,
  type PlatformAdminRoomPlanningResult,
// Provider-specific function removed from './room-app/room-platform-admin.js';
import {
  planChatroomRoomScenario,
  type RoomScenarioPlanningInput,
// Provider-specific function removed from './room-scenarios/scenario-planner.js';
import { resolveInterviewScoreTemplateById // Provider-specific function removed from './workflows/interview-score-templates.js';
import {
  listRoomScenarioTemplateIds,
  parseRoomScenarioTemplateId,
// Provider-specific function removed from './room-scenarios/scenario-templates.js';
import type { RoleplayCharacterCard // Provider-specific function removed from './room-scenarios/roleplay/roleplay-characters.js';

async function main(): Promise<void> {
  const appConfig = loadAppConfig();
  setTracingDisabled(appConfig.runtime.tracingDisabled);

  const { positionals, values // Provider-specific function removed = parseArgs({
    args: process.argv.slice(2),
    options: {
      topic: {
        type: 'string',
      // Provider-specific function removed,
      objective: {
        type: 'string',
      // Provider-specific function removed,
      'room-type': {
        type: 'string',
      // Provider-specific function removed,
      constraints: {
        type: 'string',
      // Provider-specific function removed,
      resume: {
        type: 'string',
      // Provider-specific function removed,
      room: {
        type: 'string',
      // Provider-specific function removed,
      message: {
        type: 'string',
      // Provider-specific function removed,
      author: {
        type: 'string',
      // Provider-specific function removed,
      rounds: {
        type: 'string',
      // Provider-specific function removed,
      speakers: {
        type: 'string',
      // Provider-specific function removed,
      snapshot: {
        type: 'boolean',
      // Provider-specific function removed,
      plain: {
        type: 'boolean',
      // Provider-specific function removed,
      refresh: {
        type: 'string',
      // Provider-specific function removed,
      'resume-checkpoint': {
        type: 'string',
      // Provider-specific function removed,
      characters: {
        type: 'string',
      // Provider-specific function removed,
      'max-reply-length': {
        type: 'string',
      // Provider-specific function removed,
      summary: {
        type: 'boolean',
      // Provider-specific function removed,
      'scenario-template': {
        type: 'string',
      // Provider-specific function removed,
      'scenario-json': {
        type: 'string',
      // Provider-specific function removed,
      'admin-request': {
        type: 'string',
      // Provider-specific function removed,
    // Provider-specific function removed,
    allowPositionals: true,
  // Provider-specific function removed);

  const command = (positionals[0] ?? 'run') as 'run' | 'tui';
  const workflow = (positionals[1] ?? 'chatroom') as
    | 'chatroom'
    | 'discussion'
    | 'parallel';

***REMOVED***command !== 'run' && command !== 'tui') {
    printUsage();
    process.exitCode = 1;
    return;
  // Provider-specific function removed

***REMOVED***workflow !== 'chatroom' && workflow !== 'discussion' && workflow !== 'parallel') {
    throw new Error(
      `Unknown workflow "${workflow// Provider-specific function removed". Use "chatroom", "discussion", or "parallel".`,
    );
  // Provider-specific function removed

***REMOVED***command === 'tui' && workflow !== 'chatroom') {
    throw new Error('TUI mode currently supports only the "chatroom" workflow.');
  // Provider-specific function removed

***REMOVED***
    workflow !== 'chatroom' &&
    !values['resume-checkpoint'] &&
    (!values.topic || !values.objective)
***REMOVED***
    printUsage();
    process.exitCode = 1;
    return;
  // Provider-specific function removed

***REMOVED***workflow === 'chatroom') {
  ***REMOVED***command === 'tui' && values['admin-request']) {
      throw new Error(
        'TUI room creation via --admin-request is not wired yet. Use the run command for now.',
      );
    // Provider-specific function removed
  ***REMOVED***values.room && values.resume) {
      throw new Error('Use either --room or --resume for chatroom runs, not both.');
    // Provider-specific function removed
  ***REMOVED***values.resume && values['resume-checkpoint']) {
      throw new Error(
        'Use either --resume or --resume-checkpoint for chatroom runs, not both.',
      );
    // Provider-specific function removed
  ***REMOVED***values['admin-request'] && values['scenario-template']) {
      throw new Error(
        'Use either --admin-request or --scenario-template for chatroom runs, not both.',
      );
    // Provider-specific function removed
  ***REMOVED***values['admin-request'] && values['scenario-json']) {
      throw new Error(
        'Use either --admin-request or --scenario-json for chatroom runs, not both.',
      );
    // Provider-specific function removed
  ***REMOVED***!values['scenario-template'] && values['scenario-json']) {
      throw new Error('Use --scenario-json together with --scenario-template.');
    // Provider-specific function removed
  ***REMOVED***
      values['admin-request'] &&
      (values.topic ||
        values.objective ||
        values['room-type'] ||
        values.speakers ||
        values.characters)
  ***REMOVED***
      throw new Error(
        'When using --admin-request, do not also pass --topic, --objective, --room-type, --speakers, or --characters.',
      );
    // Provider-specific function removed

    const browserMode = shouldUseChatroomBrowserMode({
      command,
      room: values.room,
      resume: values.resume,
      resumeCheckpoint: values['resume-checkpoint'],
      topic: values.topic,
      objective: values.objective,
      message: values.message,
      rounds: values.rounds,
    // Provider-specific function removed);
    const watchMode = shouldUseChatroomWatchMode({
      command,
      room: values.room,
      resume: values.resume,
      resumeCheckpoint: values['resume-checkpoint'],
      topic: values.topic,
      objective: values.objective,
      message: values.message,
      rounds: values.rounds,
    // Provider-specific function removed);

  ***REMOVED***
      !browserMode &&
      !watchMode &&
      !values.room &&
      !values.resume &&
      !values['resume-checkpoint'] &&
      !values['admin-request'] &&
      !values['scenario-template'] &&
      (!values.topic || !values.objective)
  ***REMOVED***
      printUsage();
      process.exitCode = 1;
      return;
    // Provider-specific function removed
  // Provider-specific function removed

  const runtimeModel = createRuntimeModelBinding(appConfig);
  const agentRuntime = new AgentRuntime({
    model: runtimeModel.model,
    retryDefaults: appConfig.runtime.modelRetry,
    ...(runtimeModel.modelProvider ? { modelProvider: runtimeModel.modelProvider // Provider-specific function removed : {// Provider-specific function removed),
    tracingDisabled: appConfig.runtime.tracingDisabled,
    workflowName: appConfig.runtime.workflowName,
    structuredOutputMode: appConfig.provider.compatibility.structuredOutputMode,
    maxStructuredOutputRetries:
      appConfig.provider.compatibility.maxStructuredOutputRetries,
  // Provider-specific function removed);

  const sharedInput = {
    topic: values.topic ?? '',
    objective: values.objective ?? '',
    constraints: values.constraints
      ? values.constraints
          .split('|')
          .map((value) => value.trim())
          .filter(Boolean)
      : [],
  // Provider-specific function removed;
  const chatroomRounds = values.rounds
    ? parsePositiveInteger(values.rounds, 'rounds')
    : undefined;
  const refreshMs = values.refresh
    ? parsePositiveInteger(values.refresh, 'refresh')
    : 750;
  const humanMessage = normalizeOptionalString(values.message);
  const humanAuthorName = normalizeOptionalString(values.author);
  const maxReplyLength = values['max-reply-length']
    ? parsePositiveInteger(values['max-reply-length'], 'max-reply-length')
    : undefined;
  const chatroomParallelBatchSize = appConfig.runtime.chatroom.parallelBatchSize;
  const adminRequest = normalizeOptionalString(values['admin-request']);
  const requestedScenarioTemplate = parseScenarioTemplateOption(values['scenario-template']);
  const platformAdminPlan = adminRequest
    ? await resolvePlatformAdminPlanning(agentRuntime, {
        request: adminRequest,
        hardConstraints: sharedInput.constraints,
        runtimeConfig: {
          parallelBatchSize: chatroomParallelBatchSize,
          summaryEnabled: values.summary || undefined,
          maxReplyCharacters: maxReplyLength,
        // Provider-specific function removed,
      // Provider-specific function removed)
    : undefined;
  const scenarioPlan =
    platformAdminPlan?.plannedScenario ??
    (requestedScenarioTemplate
      ? planChatroomRoomScenario(
          buildCliRoomScenarioPlanningInput({
            scenarioTemplateId: requestedScenarioTemplate,
            sharedInput,
            scenarioJson: values['scenario-json'],
            characters: values.characters,
            maxReplyLength,
            summaryEnabled: values.summary || undefined,
            parallelBatchSize: chatroomParallelBatchSize,
          // Provider-specific function removed),
        )
      : undefined);
  const roomBlueprint = platformAdminPlan?.blueprint ?? scenarioPlan?.blueprint;
  const roomType = roomBlueprint?.roomType ??
    parseChatroomRoomType(values['room-type']) ??
    DEFAULT_CHATROOM_ROOM_TYPE;
  const roomTypeSpec = resolveChatroomRoomType(roomType);
  const defaultSpeakerCount =
    roomType === DEFAULT_CHATROOM_ROOM_TYPE
      ? appConfig.runtime.chatroom.speakerCount
      : roomTypeSpec.recommendedSpeakerCount;
  const chatroomSpeakerCount = roomBlueprint?.speakerIds.length ??
    (values.speakers
      ? parseChatroomSpeakerCount(values.speakers, roomTypeSpec)
      : defaultSpeakerCount);
  const customCharacters =
    roomBlueprint?.customCharacters ??
    (values.characters && roomType === 'roleplay_scene'
      ? parseCustomCharacters(values.characters)
      : undefined);
  const chatroomSpeakerIds = roomBlueprint?.speakerIds ??
    (customCharacters && roomType === 'roleplay_scene'
      ? selectCustomRoleplaySpeakerIds(customCharacters)
      : selectSpeakerIdsForPreset(
          roomTypeSpec.speakerPreset,
          chatroomSpeakerCount,
        ));
  const customRoleplayTemplates = customCharacters
    ? createCustomRoleplayTemplates(customCharacters)
    : undefined;
  const discussionCheckpointStore = new FileWorkflowCheckpointStore<DiscussionState>();
  const chatroomCheckpointStore = new FileWorkflowCheckpointStore<ChatroomState>();

***REMOVED***workflow === 'chatroom') {
    const workflowRuntime = new WorkflowRuntime<ChatroomState, ChatroomAgentContext>(
      agentRuntime,
    );

  ***REMOVED***command === 'tui') {
      await runChatroomTui({
        agentRuntime,
        workflowRuntime,
        topic: roomBlueprint?.topic ?? sharedInput.topic,
        objective: roomBlueprint?.objective ?? sharedInput.objective,
        constraints: roomBlueprint?.constraints ?? sharedInput.constraints,
        roomBlueprint,
        roomType,
        rounds: chatroomRounds,
        speakerIds: chatroomSpeakerIds,
        parallelBatchSize: chatroomParallelBatchSize,
        roomId: values.room,
        resumeRunId: values.resume,
        resumeCheckpointId: normalizeOptionalString(values['resume-checkpoint']),
        humanMessage,
        humanAuthorName,
        snapshot: values.snapshot,
        plain: values.plain,
        refreshMs,
        checkpointStore: chatroomCheckpointStore,
      // Provider-specific function removed);
      return;
    // Provider-specific function removed

  ***REMOVED***platformAdminPlan) {
      printPlatformAdminPlanningResult(platformAdminPlan);
    // Provider-specific function removed
  ***REMOVED***scenarioPlan?.notes.length) {
      printScenarioNotes(
        platformAdminPlan
          ? scenarioPlan.notes.filter(
              (note) => note !== `Platform admin chose scenario "${platformAdminPlan.adminPlan.scenarioTemplateId// Provider-specific function removed".`,
            )
          : scenarioPlan.notes,
      );
    // Provider-specific function removed

    const executed = await executeChatroomWorkflow({
      workflowRuntime,
      topic: roomBlueprint?.topic ?? sharedInput.topic,
      objective: roomBlueprint?.objective ?? sharedInput.objective,
      constraints: roomBlueprint?.constraints ?? sharedInput.constraints,
      roomBlueprint,
      roomType,
      rounds: chatroomRounds,
      speakerIds: chatroomSpeakerIds,
      parallelBatchSize: chatroomParallelBatchSize,
      customCharacters,
      customRoleplayTemplates,
      maxReplyCharacters: maxReplyLength,
      summaryEnabled: values.summary || undefined,
      roomId: values.room,
      resumeRunId: values.resume,
      humanMessage,
      humanAuthorName,
      workflowOptions: {
        checkpointStore: chatroomCheckpointStore,
        resumeCheckpointId: normalizeOptionalString(values['resume-checkpoint']),
        observer: createCliProgressObserver(),
      // Provider-specific function removed,
    // Provider-specific function removed);

    printChatroomResult(executed);
    return;
  // Provider-specific function removed

  const workflowRuntime = new WorkflowRuntime<DiscussionState, WorkflowAgentContext>(
    agentRuntime,
  );
  let discussionRunId: string | undefined;
  try {
    const result = await runDiscussionWorkflow(workflowRuntime, workflow, sharedInput, {
      checkpointStore: discussionCheckpointStore,
      resumeCheckpointId: normalizeOptionalString(values['resume-checkpoint']),
      checkpointMetadata: {
        workflow,
      // Provider-specific function removed,
      observer: {
        onRunStarted: (event) => {
          discussionRunId = event.runId;
        // Provider-specific function removed,
      // Provider-specific function removed,
    // Provider-specific function removed);
    printDiscussionResult(result.workflowId, result.runId, result.state.finalSummary, result.trace);
  // Provider-specific function removed catch (error) {
  ***REMOVED***discussionRunId) {
      console.error(`Checkpoint run ID: ${discussionRunId// Provider-specific function removed`);
      console.error(
        `Resume with: npm run workflow:${workflow// Provider-specific function removed -- --resume-checkpoint "${discussionRunId// Provider-specific function removed"`,
      );
    // Provider-specific function removed
    throw error;
  // Provider-specific function removed
// Provider-specific function removed

async function runChatroomTui(args: {
  agentRuntime: AgentRuntime;
  workflowRuntime: WorkflowRuntime<ChatroomState, ChatroomAgentContext>;
  topic?: string;
  objective?: string;
  constraints?: string[];
  roomBlueprint?: ChatroomRoomBlueprint;
  roomType?: ChatroomRoomTypeId;
  rounds?: number;
  speakerIds: string[];
  parallelBatchSize: number;
  roomId?: string;
  resumeRunId?: string;
  resumeCheckpointId?: string;
  humanMessage?: string;
  humanAuthorName?: string;
  snapshot?: boolean;
  plain?: boolean;
  refreshMs: number;
  checkpointStore: FileWorkflowCheckpointStore<ChatroomState>;
// Provider-specific function removed): Promise<void> {
  const browserMode = shouldUseChatroomBrowserMode({
    command: 'tui',
    room: args.roomId,
    resume: args.resumeRunId,
    resumeCheckpoint: args.resumeCheckpointId,
    topic: args.topic,
    objective: args.objective,
    message: args.humanMessage,
    rounds: args.rounds?.toString(),
  // Provider-specific function removed);
  const watchMode = shouldUseChatroomWatchMode({
    command: 'tui',
    room: args.roomId,
    resume: args.resumeRunId,
    resumeCheckpoint: args.resumeCheckpointId,
    topic: args.topic,
    objective: args.objective,
    message: args.humanMessage,
    rounds: args.rounds?.toString(),
  // Provider-specific function removed);
  const plainMode = Boolean(args.plain) && !args.snapshot && !browserMode;
  let tui!: ChatroomTui;
  tui = new ChatroomTui({
    snapshot: args.snapshot,
    plain: plainMode,
    refreshMs: args.refreshMs,
    defaultSpeakerCount: args.speakerIds.length,
    defaultRoomType: args.roomType ?? DEFAULT_CHATROOM_ROOM_TYPE,
    getLatestResumableCheckpoint: (roomId) => {
      const checkpoint = findLatestResumableChatroomCheckpoint(
        args.checkpointStore,
        roomId,
      );
      return checkpoint
        ? {
            checkpointId: checkpoint.checkpointId,
            status: checkpoint.status as 'failed' | 'cancelled',
            updatedAt: checkpoint.updatedAt,
            currentStepId: checkpoint.currentStepId,
          // Provider-specific function removed
        : null;
    // Provider-specific function removed,
    resumeCheckpoint: async ({ roomId, checkpointId // Provider-specific function removed) => {
    ***REMOVED***queueProcessingRooms.has(roomId)) {
        throw new Error(
          `Room ${shortId(roomId)// Provider-specific function removed is already processing a queued message in this process.`,
        );
      // Provider-specific function removed

      const live = loadChatroomLiveSnapshot(roomId);
    ***REMOVED***live && (live.status === 'starting' || live.status === 'running')) {
        throw new Error(
          `Room ${shortId(roomId)// Provider-specific function removed is already running execution run ${shortId(live.executionRunId)// Provider-specific function removed.`,
        );
      // Provider-specific function removed

      const checkpoint = findLatestResumableChatroomCheckpoint(args.checkpointStore, roomId, {
        checkpointId,
      // Provider-specific function removed);
    ***REMOVED***!checkpoint) {
        throw new Error(
          `No failed or cancelled checkpoint is available for room ${roomId// Provider-specific function removed.`,
        );
      // Provider-specific function removed

      const executed = await executeChatroomWorkflow({
        workflowRuntime: args.workflowRuntime,
        roomId,
        parallelBatchSize: args.parallelBatchSize,
        workflowOptions: createControlledChatroomWorkflowOptions({
          tui,
          roomId,
          checkpointStore: args.checkpointStore,
          resumeCheckpointId: checkpoint.checkpointId,
        // Provider-specific function removed),
      // Provider-specific function removed);

      await tui.markPersisted({
        roomId: executed.roomId,
        resumedFromRunId: executed.resumedFromRunId,
        note:
          executed.note ??
          `Resumed checkpoint ${checkpoint.checkpointId// Provider-specific function removed for room ${roomId// Provider-specific function removed.`,
      // Provider-specific function removed);

      return {
        checkpointId: checkpoint.checkpointId,
        note:
          executed.note ??
          `Resumed checkpoint ${checkpoint.checkpointId// Provider-specific function removed for room ${roomId// Provider-specific function removed.`,
      // Provider-specific function removed;
    // Provider-specific function removed,
    submitMessage: async ({ roomId, authorName, message // Provider-specific function removed) => {
      enqueueChatroomPendingMessage({
        roomId,
        authorName,
        content: message,
      // Provider-specific function removed);
      const result = await processQueuedChatroomMessage({
        workflowRuntime: args.workflowRuntime,
        tui,
        roomId,
        parallelBatchSize: args.parallelBatchSize,
        checkpointStore: args.checkpointStore,
      // Provider-specific function removed);

      return {
        note:
          result.note ?? 'Message queued. Agents will respond when the room is idle.',
      // Provider-specific function removed;
    // Provider-specific function removed,
    createRoom: async (createArgs) => {
    ***REMOVED***createArgs.mode === 'admin') {
        const planning = await advanceRoomPlanningWithPlatformAdmin(
          args.agentRuntime,
          {
            conversation: createArgs.adminConversation,
            userMessage: createArgs.adminRequest,
            runtimeConfig: {
              parallelBatchSize: args.parallelBatchSize,
            // Provider-specific function removed,
          // Provider-specific function removed,
        );
      ***REMOVED***planning.status === 'needs_clarification') {
          return {
            status: 'needs_clarification',
            note: planning.summary,
            conversation: planning.conversation,
            assistantMessage: planning.assistantMessage,
            followUpQuestions: planning.followUpQuestions,
            tentativeScenarioTemplateId: planning.tentativeScenarioTemplateId,
          // Provider-specific function removed;
        // Provider-specific function removed

        const roomBlueprint = planning.blueprint;
        const customCharacters = roomBlueprint.customCharacters;
        const customRoleplayTemplates = customCharacters
          ? createCustomRoleplayTemplates(customCharacters)
          : undefined;
        const executed = await executeChatroomWorkflow({
          workflowRuntime: args.workflowRuntime,
          topic: roomBlueprint.topic,
          objective: roomBlueprint.objective,
          constraints: roomBlueprint.constraints,
          roomBlueprint,
          roomType: roomBlueprint.roomType,
          rounds: args.rounds ?? 1,
          speakerIds: roomBlueprint.speakerIds,
          parallelBatchSize:
            roomBlueprint.runtimeConfig.parallelBatchSize ?? args.parallelBatchSize,
          customCharacters,
          customRoleplayTemplates,
          maxReplyCharacters: roomBlueprint.runtimeConfig.maxReplyCharacters,
          summaryEnabled: roomBlueprint.runtimeConfig.summaryEnabled,
          workflowOptions: createControlledChatroomWorkflowOptions({
            tui,
            checkpointStore: args.checkpointStore,
          // Provider-specific function removed),
        // Provider-specific function removed);

        const note =
          executed.note ??
          `Created room ${executed.roomId// Provider-specific function removed from admin plan: ${planning.adminPlan.scenarioTemplateId// Provider-specific function removed | ${roomBlueprint.title// Provider-specific function removed`;

        await tui.markPersisted({
          roomId: executed.roomId,
          resumedFromRunId: executed.resumedFromRunId,
          note,
        // Provider-specific function removed);

        return {
          status: 'created',
          roomId: executed.roomId ?? '',
          note,
        // Provider-specific function removed;
      // Provider-specific function removed

      const createPlan = resolveChatroomManualCreatePlan({
        topic: createArgs.topic,
        objective: createArgs.objective,
        roomType: createArgs.roomType,
        speakerCount: createArgs.speakerCount,
        scoreTemplateId: createArgs.scoreTemplateId,
        scoreDimensions: createArgs.scoreDimensions ?? [],
      // Provider-specific function removed);

    ***REMOVED***createPlan.mode === 'interview_scenario') {
        const roomBlueprint = createPlan.roomBlueprint;
        const planning = {
          notes: createPlan.notes,
        // Provider-specific function removed;
        const customCharacters = roomBlueprint.customCharacters;
        const customRoleplayTemplates = customCharacters
          ? createCustomRoleplayTemplates(customCharacters)
          : undefined;
        const executed = await executeChatroomWorkflow({
          workflowRuntime: args.workflowRuntime,
          topic: roomBlueprint.topic,
          objective: roomBlueprint.objective,
          constraints: roomBlueprint.constraints,
          roomBlueprint,
          roomType: roomBlueprint.roomType,
          rounds: args.rounds ?? 1,
          speakerIds: roomBlueprint.speakerIds,
          parallelBatchSize:
            roomBlueprint.runtimeConfig.parallelBatchSize ?? args.parallelBatchSize,
          customCharacters,
          customRoleplayTemplates,
          maxReplyCharacters: roomBlueprint.runtimeConfig.maxReplyCharacters,
          summaryEnabled: roomBlueprint.runtimeConfig.summaryEnabled,
          workflowOptions: createControlledChatroomWorkflowOptions({
            tui,
            checkpointStore: args.checkpointStore,
          // Provider-specific function removed),
        // Provider-specific function removed);
        const planningNote = planning.notes.join(' ');
        const note =
          executed.note ??
          [
            `Created room ${executed.roomId// Provider-specific function removed with interview scoring workflow.`,
            planningNote,
          ]
            .filter((item) => item.trim().length > 0)
            .join(' ');

        await tui.markPersisted({
          roomId: executed.roomId,
          resumedFromRunId: executed.resumedFromRunId,
          note,
        // Provider-specific function removed);

        return {
          status: 'created',
          roomId: executed.roomId ?? '',
          note,
        // Provider-specific function removed;
      // Provider-specific function removed

      const nextRoomType = createPlan.roomType;
      const nextRoomTypeSpec = createPlan.roomTypeSpec;

      const executed = await executeChatroomWorkflow({
        workflowRuntime: args.workflowRuntime,
        topic: createArgs.topic,
        objective: createArgs.objective,
        constraints: [],
        roomType: nextRoomType,
        rounds: args.rounds ?? 1,
        speakerIds: selectSpeakerIdsForPreset(
          nextRoomTypeSpec.speakerPreset,
          createPlan.speakerCount,
        ),
        parallelBatchSize: args.parallelBatchSize,
        workflowOptions: createControlledChatroomWorkflowOptions({
          tui,
          checkpointStore: args.checkpointStore,
        // Provider-specific function removed),
      // Provider-specific function removed);

      await tui.markPersisted({
        roomId: executed.roomId,
        resumedFromRunId: executed.resumedFromRunId,
        note: executed.note ?? `Created room ${executed.roomId// Provider-specific function removed.`,
      // Provider-specific function removed);

      return {
        status: 'created',
        roomId: executed.roomId ?? '',
        note: executed.note ?? `Created room ${executed.roomId// Provider-specific function removed.`,
      // Provider-specific function removed;
    // Provider-specific function removed,
    deleteRoom: async (roomId) => {
      const deleted = deleteChatroomRoom(roomId);
    ***REMOVED***!deleted.existed) {
        return {
          note: `Room ${roomId// Provider-specific function removed was already missing.`,
        // Provider-specific function removed;
      // Provider-specific function removed

      const cleanupBits = [
        `${deleted.deletedRunCount// Provider-specific function removed runs`,
        `${deleted.deletedMessageCount// Provider-specific function removed messages`,
        `${deleted.deletedPendingMessageCount// Provider-specific function removed queued`,
        `${deleted.deletedArtifactDirectoryCount// Provider-specific function removed artifact dirs`,
        deleted.deletedLiveSnapshot ? 'live snapshot removed' : 'no live snapshot',
      ];
      const note = [`Deleted room ${roomId// Provider-specific function removed.`, cleanupBits.join(' | ')];
    ***REMOVED***deleted.cleanupWarnings.length > 0) {
        note.push(`Warnings: ${deleted.cleanupWarnings.join(' ; ')// Provider-specific function removed`);
      // Provider-specific function removed

      return {
        note: note.join(' '),
      // Provider-specific function removed;
    // Provider-specific function removed,
    stopRun: async ({ roomId, executionRunId // Provider-specific function removed) =>
      requestStopActiveChatroomRun({
        roomId,
        executionRunId,
      // Provider-specific function removed),
    setQueuePaused: async ({ roomId, paused // Provider-specific function removed) => {
    ***REMOVED***paused) {
        pauseChatroomQueue({
          roomId,
          source: 'manual',
          reason: 'Room queue was paused by the operator.',
        // Provider-specific function removed);
        return {
          paused: true,
          note: `Queue paused for room ${shortId(roomId)// Provider-specific function removed. New messages stay queued until you resume.`,
        // Provider-specific function removed;
      // Provider-specific function removed

      const resumed = resumeChatroomQueue({
        roomId,
      // Provider-specific function removed);
      startQueuedChatroomProcessing({
        workflowRuntime: args.workflowRuntime,
        tui,
        roomId,
        parallelBatchSize: args.parallelBatchSize,
        checkpointStore: args.checkpointStore,
      // Provider-specific function removed);
      const resumeNote = resumed
        ? `Queue resumed for room ${shortId(roomId)// Provider-specific function removed.`
        : `Queue was already active for room ${shortId(roomId)// Provider-specific function removed.`;

      return {
        paused: false,
        note: `${resumeNote// Provider-specific function removed Queued messages will start processing in the background if the room is idle.`,
      // Provider-specific function removed;
    // Provider-specific function removed,
  // Provider-specific function removed);
  let queuePump: NodeJS.Timeout | undefined;
***REMOVED***!args.snapshot) {
    queuePump = setInterval(() => {
      const roomId = tui.getCurrentRoomId();
    ***REMOVED***!roomId) {
        return;
      // Provider-specific function removed

      void processQueuedChatroomMessage({
        workflowRuntime: args.workflowRuntime,
        tui,
        roomId,
        parallelBatchSize: args.parallelBatchSize,
        checkpointStore: args.checkpointStore,
      // Provider-specific function removed);
    // Provider-specific function removed, Math.max(500, args.refreshMs));
  // Provider-specific function removed

  try {

  ***REMOVED***browserMode) {
      await tui.attachRoomBrowser(args.refreshMs);
    ***REMOVED***!tui.isInteractive()) {
        tui.flushSnapshot();
        return;
      // Provider-specific function removed

      await tui.waitUntilClosed();
      return;
    // Provider-specific function removed

  ***REMOVED***watchMode) {
      await tui.attachRoomWatcher(args.roomId!, args.refreshMs);
    ***REMOVED***!tui.isInteractive()) {
        tui.flushSnapshot();
        return;
      // Provider-specific function removed

    ***REMOVED***!args.snapshot) {
        await tui.waitUntilClosed();
      // Provider-specific function removed
      return;
    // Provider-specific function removed

    let executed: ExecutedChatroomWorkflow;
    try {
      executed = await executeChatroomWorkflow({
        workflowRuntime: args.workflowRuntime,
        topic: args.topic,
        objective: args.objective,
        constraints: args.constraints,
        roomBlueprint: args.roomBlueprint,
        roomType: args.roomType,
        rounds: args.rounds,
        speakerIds: args.speakerIds,
        parallelBatchSize: args.parallelBatchSize,
        roomId: args.roomId,
        resumeRunId: args.resumeRunId,
        humanMessage: args.humanMessage,
        humanAuthorName: args.humanAuthorName,
        workflowOptions: createControlledChatroomWorkflowOptions({
          tui,
          roomId: args.roomId,
          checkpointStore: args.checkpointStore,
          resumeCheckpointId: args.resumeCheckpointId,
        // Provider-specific function removed),
      // Provider-specific function removed);
    // Provider-specific function removed catch (error) {
    ***REMOVED***error instanceof ExecutionAbortedError && tui.isInteractive()) {
        await tui.waitUntilClosed();
        return;
      // Provider-specific function removed

      throw error;
    // Provider-specific function removed

    await tui.markPersisted({
      roomId: executed.roomId,
      resumedFromRunId: executed.resumedFromRunId,
      note: executed.note,
    // Provider-specific function removed);

  ***REMOVED***!tui.isInteractive()) {
      tui.flushSnapshot();
      printTuiCloseout(executed);
      return;
    // Provider-specific function removed

  ***REMOVED***!args.snapshot) {
      await tui.waitUntilClosed();
    // Provider-specific function removed

    printTuiCloseout(executed);
  // Provider-specific function removed finally {
  ***REMOVED***queuePump) {
      clearInterval(queuePump);
    // Provider-specific function removed
    tui.close();
  // Provider-specific function removed
// Provider-specific function removed

async function resolvePlatformAdminPlanning(
  agentRuntime: AgentRuntime,
  input: {
    request: string;
    hardConstraints?: string[];
    runtimeConfig?: {
      parallelBatchSize?: number;
      summaryEnabled?: boolean;
      maxReplyCharacters?: number;
    // Provider-specific function removed;
  // Provider-specific function removed,
): Promise<PlatformAdminRoomPlanningResult> {
***REMOVED***!processStdin.isTTY || !processStdout.isTTY) {
    return planRoomWithPlatformAdmin(agentRuntime, input);
  // Provider-specific function removed

  let planning = await advanceRoomPlanningWithPlatformAdmin(agentRuntime, {
    userMessage: input.request,
    hardConstraints: input.hardConstraints,
    runtimeConfig: input.runtimeConfig,
  // Provider-specific function removed);
***REMOVED***planning.status === 'ready') {
    return {
      adminPlan: planning.adminPlan,
      blueprint: planning.blueprint,
      plannedScenario: planning.plannedScenario,
      usage: planning.usage,
    // Provider-specific function removed;
  // Provider-specific function removed

  const prompt = readline.createInterface({
    input: processStdin,
    output: processStdout,
  // Provider-specific function removed);

  try {
    while (planning.status === 'needs_clarification') {
      console.log('');
      console.log(`Platform admin: ${planning.assistantMessage// Provider-specific function removed`);
      for (const [index, question] of planning.followUpQuestions.entries()) {
        console.log(`  ${index + 1// Provider-specific function removed. ${question// Provider-specific function removed`);
      // Provider-specific function removed

      let reply = '';
      while (!reply) {
        reply = (await prompt.question('Your reply: ')).trim();
      // Provider-specific function removed

      planning = await advanceRoomPlanningWithPlatformAdmin(agentRuntime, {
        conversation: planning.conversation,
        userMessage: reply,
        runtimeConfig: input.runtimeConfig,
      // Provider-specific function removed);
    // Provider-specific function removed
  // Provider-specific function removed finally {
    prompt.close();
  // Provider-specific function removed

  return {
    adminPlan: planning.adminPlan,
    blueprint: planning.blueprint,
    plannedScenario: planning.plannedScenario,
    usage: planning.usage,
  // Provider-specific function removed;
// Provider-specific function removed

function printDiscussionResult(
  workflowId: string,
  runId: string,
  finalSummary: unknown,
  trace: unknown,
): void {
  console.log(`Workflow: ${workflowId// Provider-specific function removed`);
  console.log(`Run ID: ${runId// Provider-specific function removed`);
  console.log(`Checkpoint ID: ${runId// Provider-specific function removed`);
  console.log('');
  console.log('Final summary:');
  console.log(JSON.stringify(finalSummary ?? null, null, 2));
  console.log('');
  console.log('Trace:');
  console.log(JSON.stringify(trace, null, 2));
// Provider-specific function removed

function printPlatformAdminPlanningResult(
  planning: PlatformAdminRoomPlanningResult,
): void {
  console.log('Platform admin plan:');
  console.log(`- Summary: ${planning.adminPlan.summary// Provider-specific function removed`);
  console.log(`- Scenario: ${planning.adminPlan.scenarioTemplateId// Provider-specific function removed`);
  console.log(`- Room title: ${planning.blueprint.title// Provider-specific function removed`);
  console.log(`- Topic: ${planning.blueprint.topic// Provider-specific function removed`);
  console.log(`- Objective: ${planning.blueprint.objective// Provider-specific function removed`);
  console.log(
    `- Governance: ${formatRoomBlueprintGovernanceSummary(planning.blueprint.governance)// Provider-specific function removed`,
  );
***REMOVED***planning.adminPlan.assumptions.length > 0) {
    console.log(`- Assumptions: ${planning.adminPlan.assumptions.join(' | ')// Provider-specific function removed`);
  // Provider-specific function removed
***REMOVED***planning.adminPlan.followUpQuestions.length > 0) {
    console.log(`- Follow-up: ${planning.adminPlan.followUpQuestions.join(' | ')// Provider-specific function removed`);
  // Provider-specific function removed
  console.log('');
// Provider-specific function removed

function printScenarioNotes(notes: string[]): void {
***REMOVED***notes.length === 0) {
    return;
  // Provider-specific function removed

  console.log('Scenario notes:');
  for (const note of notes) {
    console.log(`- ${note// Provider-specific function removed`);
  // Provider-specific function removed
  console.log('');
// Provider-specific function removed

function printChatroomResult(executed: ExecutedChatroomWorkflow): void {
  const mainSession = executed.roomId ? getChatroomMainSession(executed.roomId) : null;

  console.log(`Workflow: ${executed.result.workflowId// Provider-specific function removed`);
***REMOVED***executed.roomId) {
    console.log(`Room ID: ${executed.roomId// Provider-specific function removed`);
  // Provider-specific function removed
***REMOVED***mainSession) {
    console.log(`Main Session ID: ${mainSession.mainSessionId// Provider-specific function removed`);
  // Provider-specific function removed
  console.log(`Room Type: ${executed.result.state.roomType ?? DEFAULT_CHATROOM_ROOM_TYPE// Provider-specific function removed`);
***REMOVED***executed.result.state.roomBlueprint?.governance) {
    console.log(
      `Governance: ${formatRoomBlueprintGovernanceSummary(executed.result.state.roomBlueprint.governance)// Provider-specific function removed`,
    );
  // Provider-specific function removed
  console.log(`Execution Run ID: ${executed.result.runId// Provider-specific function removed`);
  console.log(`Checkpoint ID: ${executed.result.runId// Provider-specific function removed`);
***REMOVED***executed.resumedFromRunId) {
    console.log(`Resumed From Run: ${executed.resumedFromRunId// Provider-specific function removed`);
  // Provider-specific function removed
***REMOVED***mainSession) {
    console.log(`Main Session Messages: ${mainSession.messageCount// Provider-specific function removed`);
  // Provider-specific function removed
***REMOVED***executed.note) {
    console.log(`Note: ${executed.note// Provider-specific function removed`);
  // Provider-specific function removed
  console.log('');
  console.log('Chatroom transcript:');
  console.log(formatChatTranscript(executed.result.state.messages));
  console.log('');
  console.log('Final summary:');
  console.log(JSON.stringify(executed.result.state.finalSummary ?? null, null, 2));
  console.log('');
  console.log(`Artifacts: ${executed.artifactPaths.directory// Provider-specific function removed`);
  printScenarioArtifactPaths(executed.artifactPaths);
  console.log('');
  console.log('Trace:');
  console.log(JSON.stringify(executed.result.trace, null, 2));
// Provider-specific function removed

function printTuiCloseout(executed: ExecutedChatroomWorkflow): void {
  console.log('');
  console.log('TUI run view closed.');
***REMOVED***executed.roomId) {
    console.log(`Room ID: ${executed.roomId// Provider-specific function removed`);
  // Provider-specific function removed
  console.log(`Room Type: ${executed.result.state.roomType ?? DEFAULT_CHATROOM_ROOM_TYPE// Provider-specific function removed`);
  console.log(`Execution Run ID: ${executed.result.runId// Provider-specific function removed`);
  console.log(`Artifacts: ${executed.artifactPaths.directory// Provider-specific function removed`);
  printScenarioArtifactPaths(executed.artifactPaths);
// Provider-specific function removed

function printScenarioArtifactPaths(artifactPaths: ExecutedChatroomWorkflow['artifactPaths']): void {
***REMOVED***artifactPaths.scenarioArtifactJsonPath) {
    console.log(`Scenario JSON: ${artifactPaths.scenarioArtifactJsonPath// Provider-specific function removed`);
  // Provider-specific function removed

***REMOVED***artifactPaths.scenarioArtifactMarkdownPath) {
    console.log(`Scenario Markdown: ${artifactPaths.scenarioArtifactMarkdownPath// Provider-specific function removed`);
  // Provider-specific function removed
// Provider-specific function removed

const queueProcessingRooms = new Set<string>();
const sharedChatroomStopPollMs = 350;

async function processQueuedChatroomMessage(args: {
  workflowRuntime: WorkflowRuntime<ChatroomState, ChatroomAgentContext>;
  tui: ChatroomTui;
  roomId: string;
  parallelBatchSize: number;
  checkpointStore: FileWorkflowCheckpointStore<ChatroomState>;
// Provider-specific function removed): Promise<{
  status: 'busy' | 'empty' | 'paused' | 'processed' | 'cancelled' | 'failed';
  note?: string;
// Provider-specific function removed> {
  const queuePauseState = loadChatroomQueuePauseState(args.roomId);
***REMOVED***queuePauseState) {
    return {
      status: 'paused',
      note:
        queuePauseState.reason ??
        'Room queue is paused. New messages stay queued until you resume the room.',
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***queueProcessingRooms.has(args.roomId)) {
    return {
      status: 'busy',
      note: 'Message queued. Agents will respond when the room is idle.',
    // Provider-specific function removed;
  // Provider-specific function removed

  const live = loadChatroomLiveSnapshot(args.roomId);
***REMOVED***live && (live.status === 'starting' || live.status === 'running')) {
    return {
      status: 'busy',
      note: 'Message queued. Agents will respond when the room is idle.',
    // Provider-specific function removed;
  // Provider-specific function removed

  const claimed = claimNextChatroomPendingMessage(args.roomId);
***REMOVED***!claimed) {
    return {
      status: 'empty',
    // Provider-specific function removed;
  // Provider-specific function removed

  queueProcessingRooms.add(args.roomId);
  try {
    const executed = await executeChatroomWorkflow({
      workflowRuntime: args.workflowRuntime,
      roomId: args.roomId,
      rounds: 1,
      humanMessage: claimed.content,
      humanAuthorName: claimed.authorName,
      parallelBatchSize: args.parallelBatchSize,
      workflowOptions: createControlledChatroomWorkflowOptions({
        tui: args.tui,
        roomId: args.roomId,
        checkpointStore: args.checkpointStore,
        checkpointMetadata: {
          pendingMessageId: claimed.pendingMessageId,
        // Provider-specific function removed,
      // Provider-specific function removed),
    // Provider-specific function removed);

    markChatroomPendingMessageCompleted({
      pendingMessageId: claimed.pendingMessageId,
      processedExecutionRunId: executed.result.runId,
    // Provider-specific function removed);

    await args.tui.markPersisted({
      roomId: executed.roomId,
      resumedFromRunId: executed.resumedFromRunId,
      note: `${claimed.authorName// Provider-specific function removed sent a message. Agents replied in run ${executed.result.runId// Provider-specific function removed.`,
    // Provider-specific function removed);
    return {
      status: 'processed',
      note: `${claimed.authorName// Provider-specific function removed sent a message. Agents replied in run ${executed.result.runId// Provider-specific function removed.`,
    // Provider-specific function removed;
  // Provider-specific function removed catch (error) {
  ***REMOVED***error instanceof ExecutionAbortedError) {
      releaseChatroomPendingMessage({
        pendingMessageId: claimed.pendingMessageId,
      // Provider-specific function removed);
      await args.tui.refreshFromRoom(args.roomId);
      return {
        status: 'cancelled',
        note:
          'Queued message processing was stopped before the agents finished. The message was returned to the room queue.',
      // Provider-specific function removed;
    // Provider-specific function removed

  ***REMOVED***isChatroomRoomBusyError(error)) {
      releaseChatroomPendingMessage({
        pendingMessageId: claimed.pendingMessageId,
      // Provider-specific function removed);
      await args.tui.refreshFromRoom(args.roomId);
      return {
        status: 'busy',
        note:
          'Queued message stayed pending because this room is already being processed by another active run.',
      // Provider-specific function removed;
    // Provider-specific function removed

    markChatroomPendingMessageFailed({
      pendingMessageId: claimed.pendingMessageId,
      errorText: error instanceof Error ? error.stack ?? error.message : String(error),
    // Provider-specific function removed);
    await args.tui.refreshFromRoom(args.roomId);
    return {
      status: 'failed',
      note: 'Queued message processing failed. The queued message was marked as failed.',
    // Provider-specific function removed;
  // Provider-specific function removed finally {
    queueProcessingRooms.delete(args.roomId);
  // Provider-specific function removed
// Provider-specific function removed

function startQueuedChatroomProcessing(args: {
  workflowRuntime: WorkflowRuntime<ChatroomState, ChatroomAgentContext>;
  tui: ChatroomTui;
  roomId: string;
  parallelBatchSize: number;
  checkpointStore: FileWorkflowCheckpointStore<ChatroomState>;
// Provider-specific function removed): void {
  void processQueuedChatroomMessage(args)
    .then(async (result) => {
    ***REMOVED***!result.note || result.status === 'processed') {
        return;
      // Provider-specific function removed

      await args.tui.markPersisted({
        roomId: args.roomId,
        note: result.note,
      // Provider-specific function removed);
    // Provider-specific function removed)
    .catch(async (error) => {
      await args.tui.markPersisted({
        roomId: args.roomId,
        note: `Queue processing trigger failed: ${
          error instanceof Error ? error.message : String(error)
        // Provider-specific function removed`,
      // Provider-specific function removed);
    // Provider-specific function removed);
// Provider-specific function removed

interface ActiveChatroomRun {
  controller: AbortController;
  roomId?: string;
  executionRunId?: string;
  registeredAtMs: number;
  stopMonitor?: NodeJS.Timeout;
  lastSeenStopRequestId?: string;
// Provider-specific function removed

const activeChatroomRunsByExecutionRunId = new Map<string, ActiveChatroomRun>();
const activeChatroomRunsByRoomId = new Map<string, ActiveChatroomRun>();

function createControlledChatroomWorkflowOptions(args: {
  tui: ChatroomTui;
  roomId?: string;
  checkpointStore: FileWorkflowCheckpointStore<ChatroomState>;
  resumeCheckpointId?: string;
  checkpointMetadata?: Record<string, unknown>;
// Provider-specific function removed): WorkflowExecuteOptions<ChatroomState> {
  const controller = new AbortController();
  const observer = createTrackedChatroomObserver({
    controller,
    observer: args.tui.createWorkflowObserver(),
    roomId: args.roomId,
  // Provider-specific function removed);

  return {
    observer,
    signal: controller.signal,
    checkpointStore: args.checkpointStore,
    resumeCheckpointId: args.resumeCheckpointId,
    checkpointMetadata: buildChatroomCheckpointMetadata(args.roomId, args.checkpointMetadata),
  // Provider-specific function removed;
// Provider-specific function removed

function createTrackedChatroomObserver(args: {
  controller: AbortController;
  observer: WorkflowObserver<ChatroomState>;
  roomId?: string;
// Provider-specific function removed): WorkflowObserver<ChatroomState> {
  const activeRun: ActiveChatroomRun = {
    controller: args.controller,
    roomId: args.roomId,
    registeredAtMs: Date.now(),
  // Provider-specific function removed;
  activeRun.stopMonitor = startChatroomStopMonitor(activeRun);

  const cleanup = () => {
  ***REMOVED***activeRun.stopMonitor) {
      clearInterval(activeRun.stopMonitor);
      activeRun.stopMonitor = undefined;
    // Provider-specific function removed

  ***REMOVED***activeRun.executionRunId) {
      activeChatroomRunsByExecutionRunId.delete(activeRun.executionRunId);
    // Provider-specific function removed

  ***REMOVED***activeRun.roomId) {
      const tracked = activeChatroomRunsByRoomId.get(activeRun.roomId);
    ***REMOVED***tracked === activeRun) {
        activeChatroomRunsByRoomId.delete(activeRun.roomId);
      // Provider-specific function removed
    // Provider-specific function removed
  // Provider-specific function removed;

  return {
    onRunStarted: (event) => {
      activeRun.executionRunId = event.runId;
      activeChatroomRunsByExecutionRunId.set(event.runId, activeRun);
    ***REMOVED***activeRun.roomId) {
        activeChatroomRunsByRoomId.set(activeRun.roomId, activeRun);
      // Provider-specific function removed
      args.observer.onRunStarted?.(event);
    // Provider-specific function removed,
    onStepStarted: (event) => {
      args.observer.onStepStarted?.(event);
    // Provider-specific function removed,
    onStepCompleted: (event) => {
      args.observer.onStepCompleted?.(event);
    // Provider-specific function removed,
    onRunCompleted: (event) => {
      try {
        args.observer.onRunCompleted?.(event);
      // Provider-specific function removed finally {
        cleanup();
      // Provider-specific function removed
    // Provider-specific function removed,
    onRunFailed: (event) => {
      try {
        args.observer.onRunFailed?.(event);
      // Provider-specific function removed finally {
        cleanup();
      // Provider-specific function removed
    // Provider-specific function removed,
  // Provider-specific function removed;
// Provider-specific function removed

function findLatestResumableChatroomCheckpoint(
  checkpointStore: FileWorkflowCheckpointStore<ChatroomState>,
  roomId: string,
  options: {
    checkpointId?: string;
  // Provider-specific function removed = {// Provider-specific function removed,
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
  const resumableCheckpoints = checkpoints.filter(
    (checkpoint) =>
      (checkpoint.status === 'failed' || checkpoint.status === 'cancelled') &&
      !resumedCheckpointIds.has(checkpoint.checkpointId),
  );

***REMOVED***options.checkpointId) {
    return (
      resumableCheckpoints.find(
        (checkpoint) => checkpoint.checkpointId === options.checkpointId,
      ) ?? null
    );
  // Provider-specific function removed

  return resumableCheckpoints[0] ?? null;
// Provider-specific function removed

function buildChatroomCheckpointMetadata(
  roomId: string | undefined,
  metadata: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
  const merged = {
    ...(metadata ?? {// Provider-specific function removed),
    ...(roomId ? { roomId // Provider-specific function removed : {// Provider-specific function removed),
  // Provider-specific function removed;
  return Object.keys(merged).length > 0 ? merged : undefined;
// Provider-specific function removed

function startChatroomStopMonitor(activeRun: ActiveChatroomRun): NodeJS.Timeout | undefined {
***REMOVED***!activeRun.roomId) {
    return undefined;
  // Provider-specific function removed

  const timer = setInterval(() => {
    const roomId = activeRun.roomId;
  ***REMOVED***!roomId || activeRun.controller.signal.aborted) {
      return;
    // Provider-specific function removed

    const request = loadChatroomRunStopRequest(roomId);
  ***REMOVED***!request || request.requestId === activeRun.lastSeenStopRequestId) {
      return;
    // Provider-specific function removed

    const requestedAtMs = Date.parse(request.requestedAt);
  ***REMOVED***Number.isFinite(requestedAtMs) && requestedAtMs < activeRun.registeredAtMs) {
      activeRun.lastSeenStopRequestId = request.requestId;
      return;
    // Provider-specific function removed

  ***REMOVED***
      request.executionRunId &&
      activeRun.executionRunId &&
      request.executionRunId !== activeRun.executionRunId
  ***REMOVED***
      activeRun.lastSeenStopRequestId = request.requestId;
      return;
    // Provider-specific function removed

  ***REMOVED***request.executionRunId && !activeRun.executionRunId) {
      return;
    // Provider-specific function removed

    activeRun.lastSeenStopRequestId = request.requestId;
    clearChatroomRunStopRequest({
      roomId,
      requestId: request.requestId,
    // Provider-specific function removed);

    const targetId = activeRun.executionRunId ?? request.executionRunId ?? roomId;
    activeRun.controller.abort(
      new ExecutionAbortedError({
        scope: 'workflow',
        targetId,
        message: request.reason ?? `Chatroom run "${targetId// Provider-specific function removed" was stopped by the operator.`,
      // Provider-specific function removed),
    );
  // Provider-specific function removed, sharedChatroomStopPollMs);
  timer.unref?.();
  return timer;
// Provider-specific function removed

async function requestStopActiveChatroomRun(args: {
  roomId: string;
  executionRunId?: string;
// Provider-specific function removed): Promise<{
  stopped: boolean;
  note?: string;
// Provider-specific function removed> {
  const liveSnapshot = loadChatroomLiveSnapshot(args.roomId);
  const activeRun =
    (args.executionRunId
      ? activeChatroomRunsByExecutionRunId.get(args.executionRunId)
      : undefined) ??
    activeChatroomRunsByRoomId.get(args.roomId);
  const hasActiveRun =
    Boolean(activeRun) ||
    Boolean(liveSnapshot && (liveSnapshot.status === 'starting' || liveSnapshot.status === 'running'));

***REMOVED***hasActiveRun) {
    pauseChatroomQueue({
      roomId: args.roomId,
      source: 'stop',
      reason: 'Room queue was paused because a stop request was issued.',
    // Provider-specific function removed);
  // Provider-specific function removed

***REMOVED***!activeRun) {
  ***REMOVED***liveSnapshot && (liveSnapshot.status === 'starting' || liveSnapshot.status === 'running')) {
      const targetId = args.executionRunId ?? liveSnapshot.executionRunId ?? args.roomId;
      writeChatroomRunStopRequest({
        roomId: args.roomId,
        executionRunId: args.executionRunId ?? liveSnapshot.executionRunId,
        reason: `Chatroom run "${targetId// Provider-specific function removed" was stopped by the operator.`,
      // Provider-specific function removed);
      return {
        stopped: true,
        note: `Stop requested for ${shortId(targetId)// Provider-specific function removed. Queue paused for the room; waiting for the active process to unwind...`,
      // Provider-specific function removed;
    // Provider-specific function removed

    return {
      stopped: false,
      note: args.executionRunId
        ? `Run ${shortId(args.executionRunId)// Provider-specific function removed is not active right now.`
        : `Room ${shortId(args.roomId)// Provider-specific function removed does not currently have an active run. The room queue is paused until you resume it.`,
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***activeRun.controller.signal.aborted) {
    return {
      stopped: false,
      note: `Stop has already been requested for ${shortId(activeRun.executionRunId ?? args.roomId)// Provider-specific function removed.`,
    // Provider-specific function removed;
  // Provider-specific function removed

  const targetId = activeRun.executionRunId ?? args.executionRunId ?? args.roomId;
  activeRun.controller.abort(
    new ExecutionAbortedError({
      scope: 'workflow',
      targetId,
      message: `Chatroom run "${targetId// Provider-specific function removed" was stopped by the operator.`,
    // Provider-specific function removed),
  );

  return {
    stopped: true,
    note: `Stop requested for ${shortId(targetId)// Provider-specific function removed. Queue paused for the room; waiting for the active model call to unwind...`,
  // Provider-specific function removed;
// Provider-specific function removed

function shortId(value?: string): string {
***REMOVED***!value) {
    return '-';
  // Provider-specific function removed

  return value.length > 12 ? value.slice(0, 12) : value;
// Provider-specific function removed

function printUsage(): void {
  console.log(
    [
      'Usage:',
      '  npm run workflow:chatroom -- --topic "your topic" --objective "your objective"',
      '  npm run workflow:chatroom -- --room "room-id" --message "follow-up from human" --rounds "1"',
      '  npm run workflow:chatroom -- --resume "previous-run-id" --message "follow-up from human" --rounds "1"',
      '  npm run workflow:chatroom -- --resume-checkpoint "checkpoint-id"',
      '  npm run workflow:chatroom -- --admin-request "Simulate a backend engineer interview for a 3-year candidate; focus on system design and databases"',
      '  npm run workflow:chatroom -- --scenario-template "tavern_roleplay_demo" --rounds "1"',
      '  npm run workflow:discussion -- --topic "your topic" --objective "your objective"',
      '  npm run workflow:parallel -- --topic "your topic" --objective "your objective"',
      '  npm run tui:chatroom',
      '  npm run tui:chatroom -- --topic "your topic" --objective "your objective"',
      '  npm run tui:chatroom -- --room "room-id"',
      '',
      'Optional:',
      '  --constraints "constraint A|constraint B|constraint C"',
      `  --room-type "${DEFAULT_CHATROOM_ROOM_TYPE// Provider-specific function removed"  (available: ${listRoomTypeIds()// Provider-specific function removed)`,
      '  --rounds "2"  (chatroom workflow only)',
      '  --room "room-id"  (chatroom workflow only)',
      '  --resume "run-id"  (chatroom workflow only)',
      '  --message "new human message"  (chatroom workflow only)',
      '  --author "User"  (chatroom workflow only)',
      '  --speakers "12"  (respect the selected room type\'s own min/max range)',
      '  --admin-request "..."  (let the platform admin choose a room template and configuration)',
      '  --characters "captain:ship commander|ai:onboard assistant"  (roleplay_scene only, pipe-separated name:instruction pairs; use id=name:instruction for stable character ids)',
      `  --scenario-template "interview_simulation"  (available: ${listRoomScenarioTemplateIds().join(', ')// Provider-specific function removed)`,
      '  --scenario-json "{\\"interview\\":{\\"targetRole\\":\\"Backend Engineer\\",\\"scoreTemplateId\\":\\"backend_engineering\\",\\"scoreDimensions\\":[\\"系统设计与架构取舍\\",\\"数据一致性与可靠性\\"]// Provider-specific function removed// Provider-specific function removed"  (JSON payload for scenario planning)',
      '  --max-reply-length "2000"  (override the max characters per agent reply)',
      '  --refresh "750"  (tui polling / redraw interval in ms)',
      '  --resume-checkpoint "run-id"  (chatroom / discussion / parallel checkpoint resume)',
      '  --snapshot  (render one static TUI frame and exit)',
      '  --plain  (room watcher uses plain terminal chat mode instead of boxed full-screen TUI)',
    ].join('\n'),
  );
// Provider-specific function removed

function parsePositiveInteger(value: string, name: string): number {
  const parsed = Number.parseInt(value, 10);
***REMOVED***!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Invalid ${name// Provider-specific function removed "${value// Provider-specific function removed". Expected a positive integer.`);
  // Provider-specific function removed

  return parsed;
// Provider-specific function removed

function parseChatroomSpeakerCount(
  value: string,
  roomTypeSpec: ReturnType<typeof resolveChatroomRoomType>,
): number {
  const parsed = parsePositiveInteger(value, 'speakers');
***REMOVED***parsed < roomTypeSpec.minSpeakerCount || parsed > roomTypeSpec.maxSpeakerCount) {
    throw new Error(
      `Invalid speakers "${value// Provider-specific function removed" for room type "${roomTypeSpec.id// Provider-specific function removed". Expected ${roomTypeSpec.minSpeakerCount// Provider-specific function removed-${roomTypeSpec.maxSpeakerCount// Provider-specific function removed.`,
    );
  // Provider-specific function removed

  return parsed;
// Provider-specific function removed

function normalizeOptionalString(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
// Provider-specific function removed

function parseCustomCharacters(value: string): RoleplayCharacterCard[] {
  return value
    .split('|')
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map((segment) => {
      const colonIndex = segment.indexOf(':');
    ***REMOVED***colonIndex === -1) {
        return { name: segment.trim(), instruction: '' // Provider-specific function removed;
      // Provider-specific function removed
      const header = segment.slice(0, colonIndex).trim();
      const equalsIndex = header.indexOf('=');
    ***REMOVED***equalsIndex > 0) {
        const characterId = header.slice(0, equalsIndex).trim();
        const name = header.slice(equalsIndex + 1).trim();
        return {
          characterId,
          name,
          instruction: segment.slice(colonIndex + 1).trim(),
        // Provider-specific function removed;
      // Provider-specific function removed
      return {
        name: header,
        instruction: segment.slice(colonIndex + 1).trim(),
      // Provider-specific function removed;
    // Provider-specific function removed)
    .filter((character) => character.name.length > 0);
// Provider-specific function removed

function parseScenarioTemplateOption(
  value: string | undefined,
): RoomScenarioPlanningInput['scenarioTemplateId'] | undefined {
***REMOVED***!value) {
    return undefined;
  // Provider-specific function removed

  const parsed = parseRoomScenarioTemplateId(value);
***REMOVED***!parsed) {
    throw new Error(
      `Invalid scenario-template "${value// Provider-specific function removed". Expected one of: ${listRoomScenarioTemplateIds().join(', ')// Provider-specific function removed.`,
    );
  // Provider-specific function removed

  return parsed;
// Provider-specific function removed

function buildCliRoomScenarioPlanningInput(args: {
  scenarioTemplateId: RoomScenarioPlanningInput['scenarioTemplateId'];
  sharedInput: {
    topic: string;
    objective: string;
    constraints: string[];
  // Provider-specific function removed;
  scenarioJson: string | undefined;
  characters: string | undefined;
  maxReplyLength: number | undefined;
  summaryEnabled: boolean | undefined;
  parallelBatchSize: number;
// Provider-specific function removed): RoomScenarioPlanningInput {
  const scenarioConfig = parseScenarioJsonRecord(args.scenarioJson);
  const scenarioInterview = asJsonRecord(scenarioConfig.interview);
  const scenarioProject = asJsonRecord(scenarioConfig.project);
  const scenarioReport = asJsonRecord(scenarioConfig.report);
  const scenarioMystery = asJsonRecord(scenarioConfig.mystery);
  const scenarioTavern = asJsonRecord(scenarioConfig.tavern);
  const customCharacters =
    args.characters
      ? parseCustomCharacters(args.characters)
      : parseCustomCharactersValue(scenarioConfig.customCharacters);
  const topic = args.sharedInput.topic || asOptionalString(scenarioConfig.topic);
  const objective = args.sharedInput.objective || asOptionalString(scenarioConfig.objective);
  const title = asOptionalString(scenarioConfig.title);
  const constraints =
    args.sharedInput.constraints.length > 0
      ? args.sharedInput.constraints
      : asStringArray(scenarioConfig.constraints);
  const metadata = asJsonRecord(scenarioConfig.metadata);
  const runtimeConfig = {
    parallelBatchSize: args.parallelBatchSize,
    summaryEnabled: args.summaryEnabled,
    maxReplyCharacters: args.maxReplyLength,
  // Provider-specific function removed;

  switch (args.scenarioTemplateId) {
    case 'interview_simulation':
      const scoreTemplateId = resolveInterviewScoreTemplateById(
        asOptionalString(scenarioInterview?.scoreTemplateId),
      )?.id;
      return {
        scenarioTemplateId: args.scenarioTemplateId,
        title,
        topic,
        objective,
        constraints,
        runtimeConfig,
        metadata,
        interview: {
          candidateName: asOptionalString(scenarioInterview?.candidateName),
          targetRole: asOptionalString(scenarioInterview?.targetRole),
          candidateBackground: asOptionalString(scenarioInterview?.candidateBackground),
          targetLevel: asOptionalString(scenarioInterview?.targetLevel),
          companyStyle: asOptionalString(scenarioInterview?.companyStyle),
          focusAreas: asStringArray(scenarioInterview?.focusAreas),
          scoreTemplateId,
          scoreDimensions: asStringArray(scenarioInterview?.scoreDimensions),
        // Provider-specific function removed,
      // Provider-specific function removed;
    case 'project_development_discussion':
      return {
        scenarioTemplateId: args.scenarioTemplateId,
        title,
        topic,
        objective,
        constraints,
        runtimeConfig,
        metadata,
        project: {
          projectName: asOptionalString(scenarioProject?.projectName),
          projectStage: asProjectStage(scenarioProject?.projectStage),
          teamContext: asOptionalString(scenarioProject?.teamContext),
          decisionFocus: asStringArray(scenarioProject?.decisionFocus),
        // Provider-specific function removed,
      // Provider-specific function removed;
    case 'report_seminar':
      return {
        scenarioTemplateId: args.scenarioTemplateId,
        title,
        topic,
        objective,
        constraints,
        runtimeConfig,
        metadata,
        report: {
          reportKind: asOptionalString(scenarioReport?.reportKind),
          presenterName: asOptionalString(scenarioReport?.presenterName),
          domain: asOptionalString(scenarioReport?.domain),
          reviewFocus: asStringArray(scenarioReport?.reviewFocus),
        // Provider-specific function removed,
      // Provider-specific function removed;
    case 'murder_mystery':
      return {
        scenarioTemplateId: args.scenarioTemplateId,
        title,
        topic,
        objective,
        constraints,
        runtimeConfig,
        metadata,
        customCharacters,
        mystery: {
          caseTitle: asOptionalString(scenarioMystery?.caseTitle),
          setting: asOptionalString(scenarioMystery?.setting),
          victimProfile: asOptionalString(scenarioMystery?.victimProfile),
          focusAreas: asStringArray(scenarioMystery?.focusAreas),
        // Provider-specific function removed,
      // Provider-specific function removed;
    case 'tavern_roleplay_demo':
      return {
        scenarioTemplateId: args.scenarioTemplateId,
        title,
        topic,
        objective,
        constraints,
        runtimeConfig,
        metadata,
        customCharacters,
        tavern: {
          tavernName: asOptionalString(scenarioTavern?.tavernName),
          setting: asOptionalString(scenarioTavern?.setting),
          openingSituation: asOptionalString(scenarioTavern?.openingSituation),
          atmosphere: asOptionalString(scenarioTavern?.atmosphere),
        // Provider-specific function removed,
      // Provider-specific function removed;
    case 'roleplay_scene':
      return {
        scenarioTemplateId: args.scenarioTemplateId,
        title,
        topic: topic ?? 'Roleplay Scene',
        objective: objective ?? 'Run a live roleplay room and keep the scene moving.',
        constraints,
        runtimeConfig,
        metadata,
        customCharacters,
        speakerIds: asStringArray(scenarioConfig.speakerIds),
      // Provider-specific function removed;
    case 'brainstorm_workshop':
    case 'expert_discussion':
      return {
        scenarioTemplateId: args.scenarioTemplateId,
        title,
        topic: topic ?? 'Scenario Room',
        objective: objective ?? 'Run a structured multi-agent discussion.',
        constraints,
        runtimeConfig,
        metadata,
        speakerIds: asStringArray(scenarioConfig.speakerIds),
      // Provider-specific function removed;
    case 'free_interview':
      return {
        scenarioTemplateId: args.scenarioTemplateId,
        title,
        topic: topic ?? 'Free Interview',
        objective: objective ?? 'Run a flexible interview with dynamically created interviewers.',
        constraints,
        runtimeConfig,
        metadata,
        interview: {
          candidateName: asOptionalString(scenarioInterview?.candidateName),
          targetRole: asOptionalString(scenarioInterview?.targetRole),
          candidateBackground: asOptionalString(scenarioInterview?.candidateBackground),
        // Provider-specific function removed,
      // Provider-specific function removed;
  // Provider-specific function removed
// Provider-specific function removed

function parseScenarioJsonRecord(value: string | undefined): Record<string, unknown> {
***REMOVED***!value) {
    return {// Provider-specific function removed;
  // Provider-specific function removed

  try {
    const parsed = JSON.parse(value) as unknown;
  ***REMOVED***!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('Scenario JSON must be a JSON object.');
    // Provider-specific function removed

    return parsed as Record<string, unknown>;
  // Provider-specific function removed catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid scenario-json value: ${message// Provider-specific function removed`);
  // Provider-specific function removed
// Provider-specific function removed

function asOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
// Provider-specific function removed

function asStringArray(value: unknown): string[] {
***REMOVED***!Array.isArray(value)) {
  ***REMOVED***];
  // Provider-specific function removed

  return dedupeStringArray(value);
// Provider-specific function removed

function dedupeStringArray(value: readonly unknown[]): string[] {
  const unique = new Set<string>();
  for (const item of value) {
  ***REMOVED***typeof item !== 'string') {
      continue;
    // Provider-specific function removed
    const normalized = item.trim();
  ***REMOVED***normalized.length > 0) {
      unique.add(normalized);
    // Provider-specific function removed
  // Provider-specific function removed
***REMOVED***...unique];
// Provider-specific function removed

function asJsonRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
// Provider-specific function removed

function parseCustomCharactersValue(
  value: unknown,
): RoleplayCharacterCard[] | undefined {
***REMOVED***!Array.isArray(value)) {
    return undefined;
  // Provider-specific function removed

  const parsed: RoleplayCharacterCard[] = [];
  for (const item of value) {
    const record = asJsonRecord(item);
    const name = asOptionalString(record?.name);
  ***REMOVED***!name) {
      continue;
    // Provider-specific function removed

    parsed.push({
      characterId: asOptionalString(record?.characterId),
      name,
      instruction: asOptionalString(record?.instruction) ?? '',
      publicDescription: asOptionalString(record?.publicDescription),
      privateNotes: asStringArray(record?.privateNotes),
      relationships: parseCustomCharacterRelationshipsValue(record?.relationships),
      initialGoal: asOptionalString(record?.initialGoal),
    // Provider-specific function removed);
  // Provider-specific function removed

  return parsed.length > 0 ? parsed : undefined;
// Provider-specific function removed

function parseCustomCharacterRelationshipsValue(
  value: unknown,
): NonNullable<RoleplayCharacterCard['relationships']> {
***REMOVED***!Array.isArray(value)) {
  ***REMOVED***];
  // Provider-specific function removed

  const relationships: NonNullable<RoleplayCharacterCard['relationships']> = [];
  for (const item of value) {
    const record = asJsonRecord(item);
    const summary = asOptionalString(record?.summary);
  ***REMOVED***!summary) {
      continue;
    // Provider-specific function removed

    relationships.push({
      targetCharacterId: asOptionalString(record?.targetCharacterId),
      targetName: asOptionalString(record?.targetName),
      summary,
      score: asRelationshipScore(record?.score),
    // Provider-specific function removed);
  // Provider-specific function removed

  return relationships;
// Provider-specific function removed

function asProjectStage(
  value: unknown,
): 'discovery' | 'planning' | 'implementation' | 'review' | undefined {
  return value === 'discovery' ||
    value === 'planning' ||
    value === 'implementation' ||
    value === 'review'
    ? value
    : undefined;
// Provider-specific function removed

function asRelationshipScore(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.min(3, Math.max(-3, Math.round(value)))
    : undefined;
// Provider-specific function removed

function listRoomTypeIds(): string {
  return listChatroomRoomTypes()
    .map((roomType) => roomType.id)
    .join(', ');
// Provider-specific function removed

function createCliProgressObserver(): WorkflowObserver<ChatroomState> {
  let currentRound = 0;
  let totalRounds = 0;
  let messageCount = 0;
  return {
    onRunStarted: () => {
      console.log('Chatroom run started...');
    // Provider-specific function removed,
    onStepStarted: (event) => {
      const stepId = event.stepId;
      const roundMatch = stepId.match(/chat-round-(\d+)/);
    ***REMOVED***roundMatch) {
        const round = Number.parseInt(roundMatch[1]!, 10);
      ***REMOVED***round !== currentRound) {
          currentRound = round;
          console.log(`--- Round ${currentRound// Provider-specific function removed ---`);
        // Provider-specific function removed
      // Provider-specific function removed
    // Provider-specific function removed,
    onStepCompleted: (event) => {
      messageCount = event.stateVersion;
      const stepId = event.stepId;
    ***REMOVED***stepId.startsWith('chat-round-')) {
        const messages = (event.state as ChatroomState).messages;
        const agentCount = messages.filter((m) => m.role === 'agent').length;
        console.log(`  Step "${stepId// Provider-specific function removed" done (${agentCount// Provider-specific function removed agent messages total)`);
      // Provider-specific function removed
    // Provider-specific function removed,
    onRunCompleted: () => {
      console.log(`Chatroom run completed.`);
    // Provider-specific function removed,
    onRunFailed: (event) => {
      const error = event.error;
      console.error(`Chatroom run failed: ${error instanceof Error ? error.message : String(error)// Provider-specific function removed`);
    // Provider-specific function removed,
  // Provider-specific function removed;
// Provider-specific function removed

function shouldUseChatroomWatchMode(args: {
  command: 'run' | 'tui';
  room?: string;
  resume?: string;
  resumeCheckpoint?: string;
  topic?: string;
  objective?: string;
  message?: string;
  rounds?: string;
// Provider-specific function removed***REMOVED***
  return (
    args.command === 'tui' &&
    Boolean(args.room) &&
    !args.resume &&
    !args.resumeCheckpoint &&
    !args.topic &&
    !args.objective &&
    !args.message &&
    !args.rounds
  );
// Provider-specific function removed

function shouldUseChatroomBrowserMode(args: {
  command: 'run' | 'tui';
  room?: string;
  resume?: string;
  resumeCheckpoint?: string;
  topic?: string;
  objective?: string;
  message?: string;
  rounds?: string;
// Provider-specific function removed***REMOVED***
  return (
    args.command === 'tui' &&
    !args.room &&
    !args.resume &&
    !args.resumeCheckpoint &&
    !args.topic &&
    !args.objective &&
    !args.message &&
    !args.rounds
  );
// Provider-specific function removed

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.stack ?? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
// Provider-specific function removed);
