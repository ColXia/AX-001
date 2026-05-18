
import { createServer, type IncomingMessage, type ServerResponse // Provider-specific function removed from 'node:http';
import { existsSync, readFileSync, readdirSync, statSync // Provider-specific function removed from 'node:fs';
import { extname, resolve // Provider-specific function removed from 'node:path';
import { fileURLToPath // Provider-specific function removed from 'node:url';

import { setTracingDisabled // Provider-specific function removed from '@openai/agents-core';

import {
  selectSpeakerIdsForPreset,
// Provider-specific function removed from '../agents/chatroom-profiles.js';
import { createRuntimeModelBinding, loadAppConfig // Provider-specific function removed from '../config/app-config.js';
import {
  explainProviderErrorMessage,
  getProviderWarning,
  type ProviderDescriptor,
// Provider-specific function removed from '../config/provider-diagnostics.js';
import { AgentRuntime // Provider-specific function removed from '../core/agent-runtime.js';
import { ExecutionAbortedError // Provider-specific function removed from '../core/execution-control.js';
import { FileWorkflowCheckpointStore // Provider-specific function removed from '../core/workflow-checkpoints.js';
import {
  WorkflowRuntime,
  type WorkflowExecuteOptions,
  type WorkflowObserver,
// Provider-specific function removed from '../core/workflow.js';
import {
  claimNextChatroomPendingMessage,
  cloneChatroomRoom,
  createChatroomRoom,
  deleteChatroomPendingMessages,
  deleteChatroomRoom,
  enqueueChatroomPendingMessage,
  getChatroomMainSession,
  getChatroomRoomLease,
  getChatroomRoomRecord,
  getLatestChatroomExecutionRun,
  isChatroomRoomBusyError,
  listChatroomAgentThreads,
  listChatroomAgentTurns,
  listChatroomExecutionRuns,
  listChatroomParticipants,
  listChatroomPendingMessages,
  listChatroomRooms,
  loadChatroomRoomState,
  markChatroomPendingMessageCompleted,
  markChatroomPendingMessageFailed,
  releaseChatroomPendingMessage,
  releaseChatroomRoomLease,
// Provider-specific function removed from '../room-app/room-service.js';
import type { ChatroomRoomListItem // Provider-specific function removed from '../room-storage/chatroom-storage-types.js';
import type { ChatroomState // Provider-specific function removed from '../room-runtime/room-state.js';
import {
  loadChatroomLiveSnapshot,
  subscribeChatroomLiveStream,
  type ChatroomLiveStreamEvent,
// Provider-specific function removed from '../room-runtime/chatroom-live.js';
import {
  DEFAULT_CHATROOM_ROOM_TYPE,
  getChatroomRoomTypeLabel,
  getChatroomRoomTypeShortLabel,
  listChatroomRoomTypes,
  parseChatroomRoomType,
  resolveChatroomRoomType,
// Provider-specific function removed from '../room-core/chatroom-room-types.js';
import {
  clearChatroomRunStopRequest,
  loadChatroomQueuePauseState,
  loadChatroomRunStopRequest,
  pauseChatroomQueue,
  resumeChatroomQueue,
  writeChatroomRunStopRequest,
// Provider-specific function removed from '../room-runtime/chatroom-run-control.js';
import {
  createCustomRoleplayTemplates,
// Provider-specific function removed from '../room-scenarios/roleplay/chatroom-roleplay-state.js';
import {
  executeRoomWorkflow as executeChatroomWorkflow,
// Provider-specific function removed from '../room-app/room-runtime-service.js';
import {
  listInterviewScoreTemplates,
// Provider-specific function removed from '../room-scenarios/interview/interview-score-templates.js';
import {
  ChatroomManualCreateValidationError,
  resolveChatroomManualCreatePlan,
// Provider-specific function removed from '../room-scenarios/chatroom-manual-create.js';
import type { ChatroomAgentContext // Provider-specific function removed from '../room-runtime/agent-context.js';
import {
  INTERVIEW_DEMO_ROOM_TITLE,
  createChatroomRoomBlueprintFromLegacyInput,
  formatRoomBlueprintGovernanceSummary,
  type ChatroomRoomBlueprint,
// Provider-specific function removed from '../room-scenarios/room-blueprints.js';
import { planChatroomRoomScenario // Provider-specific function removed from '../room-scenarios/scenario-planner.js';
import {
  advanceRoomPlanningWithPlatformAdmin,
  type PlatformAdminConversationState,
// Provider-specific function removed from '../room-app/room-platform-admin.js';
import {
  RoleplayRoomService,
  planCustomRoleplayRoom,
// Provider-specific function removed from '../room-app/roleplay-room-service.js';
import type { RoleplayCharacterCard // Provider-specific function removed from '../room-scenarios/roleplay/roleplay-characters.js';
import {
  DEFAULT_ROOM_RUNTIME_MODE,
  applyRoomRuntimeModeToBlueprint,
  getRoomRuntimeModeLabel,
  getRoomRuntimeModeShortLabel,
  listRoomRuntimeModes,
  resolveRoomRuntimeMode,
  resolveRoomRuntimeModeFromBlueprint,
  resolveRoomRuntimeModeFromMetadata,
  type RoomRuntimeMode,
// Provider-specific function removed from '../room-runtime/room-runtime-mode.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');
const STATIC_DIRECTORY = resolve(__dirname, '..', '..', 'web', 'chatroom');
const RUNS_DIRECTORY = resolve(__dirname, '..', '..', 'runs');
const DEFAULT_PORT = 3030;
const JSON_BODY_LIMIT_BYTES = 1_000_000;
const QUEUE_PUMP_INTERVAL_MS = 1_000;
const STOP_POLL_INTERVAL_MS = 350;
const ROOM_STREAM_KEEPALIVE_MS = 15_000;
const INTERVIEW_DEMO_TARGET_ROLE = '计算机类通用岗位（不预设方向）';
const INTERVIEW_DEMO_TARGET_LEVEL = '本科在读 / 应届';
const INTERVIEW_DEMO_FOCUS_AREAS = [
  '专业基础与问题分析',
  '项目或实习经历',
  '编程实现与调试能力',
  '学习速度与自我驱动',
  '沟通表达与协作意识',
];
const INTERVIEW_DEMO_ROOM_RETAIN_COUNT = 2;
const INTERVIEW_DEMO_AGGREGATE_REPORT_PREFIX = 'interview-demo-aggregate-report-';

interface ActiveChatroomRun {
  controller: AbortController;
  roomId?: string;
  executionRunId?: string;
  registeredAtMs: number;
  stopMonitor?: NodeJS.Timeout;
  lastSeenStopRequestId?: string;
// Provider-specific function removed

class HttpError extends Error {
  readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
  // Provider-specific function removed
// Provider-specific function removed

class ChatroomWebApp {
  private readonly agentRuntime: AgentRuntime;
  private readonly workflowRuntime: WorkflowRuntime<ChatroomState, ChatroomAgentContext>;
  private readonly checkpointStore = new FileWorkflowCheckpointStore<ChatroomState>();
  private readonly queueProcessingRooms = new Set<string>();
  private readonly activeRunsByExecutionRunId = new Map<string, ActiveChatroomRun>();
  private readonly activeRunsByRoomId = new Map<string, ActiveChatroomRun>();
  private readonly parallelBatchSize: number;
  private readonly providerDescriptor: ProviderDescriptor;
  private readonly providerWarning: string | null;
  private readonly queuePump?: NodeJS.Timeout;
  private readonly runtimeMode: RoomRuntimeMode;
  private configValid: boolean = true;
  private configError: string | null = null;

  constructor(args: {
    runtimeMode?: RoomRuntimeMode;
  // Provider-specific function removed = {// Provider-specific function removed) {
    try {
      const appConfig = loadAppConfig();
      setTracingDisabled(appConfig.runtime.tracingDisabled);

      this.parallelBatchSize = appConfig.runtime.chatroom.parallelBatchSize;
      this.runtimeMode = args.runtimeMode ?? DEFAULT_ROOM_RUNTIME_MODE;
      const runtimeModel = createRuntimeModelBinding(appConfig);
      this.providerDescriptor = {
        baseURL: appConfig.provider.baseURL,
        model: appConfig.provider.model,
      // Provider-specific function removed;
      this.providerWarning = getProviderWarning(this.providerDescriptor);
    ***REMOVED***this.providerWarning) {
        console.warn(`[provider warning] ${this.providerWarning// Provider-specific function removed`);
      // Provider-specific function removed
      this.agentRuntime = new AgentRuntime({
        model: runtimeModel.model,
        retryDefaults: appConfig.runtime.modelRetry,
        ...(runtimeModel.modelProvider ? { modelProvider: runtimeModel.modelProvider // Provider-specific function removed : {// Provider-specific function removed),
        tracingDisabled: appConfig.runtime.tracingDisabled,
        workflowName: appConfig.runtime.workflowName,
        structuredOutputMode: appConfig.provider.compatibility.structuredOutputMode,
        maxStructuredOutputRetries:
          appConfig.provider.compatibility.maxStructuredOutputRetries,
      // Provider-specific function removed);
      this.workflowRuntime = new WorkflowRuntime<ChatroomState, ChatroomAgentContext>(
        this.agentRuntime,
      );
    // Provider-specific function removed catch (error) {
      this.configValid = false;
      this.configError = error instanceof Error ? error.message : String(error);
      console.error(`[config error] ${this.configError// Provider-specific function removed`);
      this.parallelBatchSize = 4;
      this.runtimeMode = args.runtimeMode ?? DEFAULT_ROOM_RUNTIME_MODE;
      this.providerDescriptor = { baseURL: '', model: '' // Provider-specific function removed;
      this.providerWarning = null;
      this.agentRuntime = new AgentRuntime({// Provider-specific function removed);
      this.workflowRuntime = new WorkflowRuntime<ChatroomState, ChatroomAgentContext>(
        this.agentRuntime,
      );
    // Provider-specific function removed

  ***REMOVED***process.env.AX001_ENABLE_BACKGROUND_QUEUE_PUMP === '1') {
      this.queuePump = setInterval(() => {
        void this.pumpQueues();
      // Provider-specific function removed, QUEUE_PUMP_INTERVAL_MS);
      this.queuePump.unref?.();
    // Provider-specific function removed
  // Provider-specific function removed

  getMeta() {
    return {
      generatedAt: new Date().toISOString(),
      runtimeMode: this.runtimeMode,
      runtimeModeLabel: getRoomRuntimeModeLabel(this.runtimeMode),
      supportedRuntimeModes: listRoomRuntimeModes(),
      defaultRoomType: DEFAULT_CHATROOM_ROOM_TYPE,
      roomTypes: listChatroomRoomTypes().map((roomType) => ({
        id: roomType.id,
        label: getChatroomRoomTypeLabel(roomType.id),
        shortLabel: getChatroomRoomTypeShortLabel(roomType.id),
        recommendedSpeakerCount: roomType.recommendedSpeakerCount,
        minSpeakerCount: roomType.minSpeakerCount,
        maxSpeakerCount: roomType.maxSpeakerCount,
      // Provider-specific function removed)),
      interviewScoreTemplates: listInterviewScoreTemplates().map((template) => ({
        id: template.id,
        label: template.label,
      // Provider-specific function removed)),
      providerWarning: this.providerWarning,
      configValid: this.configValid,
      configError: this.configError,
    // Provider-specific function removed;
  // Provider-specific function removed

  getInterviewDemoAggregateReport(
    format: 'markdown' | 'json',
  ): Buffer | Record<string, unknown> {
    const reportFiles = this.resolveInterviewDemoAggregateReportFiles();
  ***REMOVED***!reportFiles) {
      throw new HttpError(
        404,
        'Interview demo aggregate report was not found. Run the aggregate report script first.',
      );
    // Provider-specific function removed

  ***REMOVED***format === 'markdown') {
    ***REMOVED***!reportFiles.markdownPath) {
        throw new HttpError(404, 'Interview demo aggregate markdown was not found.');
      // Provider-specific function removed
      return readFileSync(reportFiles.markdownPath);
    // Provider-specific function removed

  ***REMOVED***!reportFiles.jsonPath) {
      throw new HttpError(404, 'Interview demo aggregate JSON was not found.');
    // Provider-specific function removed

    return {
      ...parseJsonFile(reportFiles.jsonPath),
      markdownUrl: '/api/interview-demo/report?format=markdown',
      jsonUrl: '/api/interview-demo/report?format=json',
    // Provider-specific function removed;
  // Provider-specific function removed

  formatErrorMessage(error: unknown): string {
    const raw = error instanceof Error ? error.message : String(error);
    return explainProviderErrorMessage(raw, this.providerDescriptor);
  // Provider-specific function removed

  listRooms(limit = 48) {
    return {
      generatedAt: new Date().toISOString(),
      rooms: listChatroomRooms(limit).map((room) => this.buildRoomListOverview(room)),
    // Provider-specific function removed;
  // Provider-specific function removed

  getRoom(roomId: string) {
    const room = getChatroomRoomRecord(roomId);
  ***REMOVED***!room) {
      throw new HttpError(404, `Room "${roomId// Provider-specific function removed" was not found.`);
    // Provider-specific function removed

    this.recoverStaleProcessingMessages(roomId);
    const live = this.resolveEffectiveLiveSnapshot(roomId);
    const persistedState = loadChatroomRoomState(roomId);
    const preferLive = shouldPreferLiveSnapshot(room.lastExecutionRunId, live);
    const preferredState = preferLive ? live?.state ?? persistedState : persistedState;
    const stateSource = preferLive ? 'live' : 'persisted';
    const runs = listChatroomExecutionRuns(roomId, 16);
    const mainSession = getChatroomMainSession(roomId);
    const participants = listChatroomParticipants(roomId);
    const threads = listChatroomAgentThreads(roomId);
    const agentTurns = listChatroomAgentTurns(roomId, {
      limit: 48,
    // Provider-specific function removed);
    const pendingMessages = listChatroomPendingMessages(roomId, {
      limit: 24,
      statuses: ['pending', 'processing', 'failed'],
    // Provider-specific function removed);
    const queuePauseState = loadChatroomQueuePauseState(roomId);
    const latestRun = runs[0] ?? null;
    const resumableCheckpoint = this.findLatestResumableCheckpoint(roomId);
    const scenarioReport = this.buildScenarioReportOverview({
      roomId,
      artifactDirectory: latestRun?.artifactDirectory,
    // Provider-specific function removed);

  ***REMOVED***
      !queuePauseState &&
      !live &&
      pendingMessages.some((message) => message.status === 'pending')
  ***REMOVED***
      this.kickRoomQueue(roomId);
    // Provider-specific function removed

    return {
      generatedAt: new Date().toISOString(),
      runtimeMode: resolveRoomRuntimeModeFromBlueprint(room.roomBlueprint),
      room: {
        ...room,
        runtimeMode: resolveRoomRuntimeModeFromBlueprint(room.roomBlueprint),
        runtimeModeLabel: getRoomRuntimeModeLabel(
          resolveRoomRuntimeModeFromBlueprint(room.roomBlueprint),
        ),
        governanceSummary: room.roomBlueprint
          ? formatRoomBlueprintGovernanceSummary(room.roomBlueprint.governance)
          : '',
      // Provider-specific function removed,
      mainSession,
      overview: this.buildRoomOverview(roomId),
      stateSource,
      currentState: preferredState,
      live,
      latestRun,
      runs,
      participants,
      threads,
      agentTurns,
      pendingMessages,
      queuePaused: Boolean(queuePauseState),
      queuePauseReason: queuePauseState?.reason,
      queuePauseAt: queuePauseState?.pausedAt,
      resumableCheckpoint,
      scenarioReport,
    // Provider-specific function removed;
  // Provider-specific function removed

  getScenarioReportContent(
    roomId: string,
    format: 'markdown' | 'json',
  ): Buffer | Record<string, unknown> {
    assertRoomExists(roomId);
    const latestRun = getLatestChatroomExecutionRun(roomId) ?? null;
    const reportFiles = this.resolveScenarioReportFiles(latestRun?.artifactDirectory);
  ***REMOVED***!reportFiles) {
      throw new HttpError(404, 'Scenario report was not found for this room.');
    // Provider-specific function removed

  ***REMOVED***format === 'markdown') {
    ***REMOVED***!reportFiles.markdownPath) {
        throw new HttpError(404, 'Scenario report markdown was not found for this room.');
      // Provider-specific function removed
      return readFileSync(reportFiles.markdownPath);
    // Provider-specific function removed

  ***REMOVED***!reportFiles.jsonPath) {
      throw new HttpError(404, 'Scenario report JSON was not found for this room.');
    // Provider-specific function removed

    return parseJsonFile(reportFiles.jsonPath);
  // Provider-specific function removed

  async streamRoom(
    roomId: string,
    request: IncomingMessage,
    response: ServerResponse,
  ): Promise<void> {
    assertRoomExists(roomId);
    const initialPayload = this.getRoom(roomId);
    let closed = false;
    let keepAlive: NodeJS.Timeout | undefined;
    let unsubscribe: (() => void) | undefined;

    const cleanup = () => {
    ***REMOVED***closed) {
        return;
      // Provider-specific function removed
      closed = true;
    ***REMOVED***keepAlive) {
        clearInterval(keepAlive);
        keepAlive = undefined;
      // Provider-specific function removed
      unsubscribe?.();
      unsubscribe = undefined;
    // Provider-specific function removed;

    const writeEvent = (payload: {
      type: ChatroomLiveStreamEvent['type'];
      data: ReturnType<ChatroomWebApp['getRoom']>;
      observedAt?: string;
    // Provider-specific function removed) => {
    ***REMOVED***closed || response.writableEnded || response.destroyed) {
        cleanup();
        return;
      // Provider-specific function removed

      response.write(`data: ${JSON.stringify(payload)// Provider-specific function removed\n\n`);
    // Provider-specific function removed;

    const pushRoomEvent = (event: ChatroomLiveStreamEvent) => {
      try {
        writeEvent({
          type: event.type,
          data: this.getRoom(roomId),
          observedAt: event.snapshot.updatedAt,
        // Provider-specific function removed);
      // Provider-specific function removed catch {
        cleanup();
      ***REMOVED***!response.writableEnded && !response.destroyed) {
          response.end();
        // Provider-specific function removed
      // Provider-specific function removed
    // Provider-specific function removed;

    response.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-store',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    // Provider-specific function removed);
    response.flushHeaders?.();
    response.socket?.setKeepAlive(true);
    response.socket?.setNoDelay(true);

    writeEvent({
      type: 'snapshot',
      data: initialPayload,
      observedAt: initialPayload.generatedAt,
    // Provider-specific function removed);

    unsubscribe = subscribeChatroomLiveStream(roomId, pushRoomEvent);
    keepAlive = setInterval(() => {
    ***REMOVED***closed || response.writableEnded || response.destroyed) {
        cleanup();
        return;
      // Provider-specific function removed
      response.write(': ping\n\n');
    // Provider-specific function removed, ROOM_STREAM_KEEPALIVE_MS);
    keepAlive.unref?.();

    await new Promise<void>((resolvePromise) => {
      const close = () => {
        cleanup();
        resolvePromise();
      // Provider-specific function removed;
      request.once('close', close);
      response.once('close', close);
      response.once('finish', close);
    // Provider-specific function removed);
  // Provider-specific function removed

  private buildScenarioReportOverview(args: {
    roomId: string;
    artifactDirectory?: string;
  // Provider-specific function removed): Record<string, unknown> | null {
    const reportFiles = this.resolveScenarioReportFiles(args.artifactDirectory);
  ***REMOVED***!reportFiles) {
  ***REMOVED***
    // Provider-specific function removed

    const jsonPayload = reportFiles.jsonPath
      ? parseJsonFile(reportFiles.jsonPath)
      : {// Provider-specific function removed;
    const markdown = reportFiles.markdownPath
      ? readFileSync(reportFiles.markdownPath, 'utf8')
      : '';

    return {
      available: true,
      artifactDirectory: reportFiles.directory,
      artifactType: normalizeString(jsonPayload.artifactType) ?? null,
      scenarioLabel: normalizeString(jsonPayload.scenarioLabel) ?? null,
      generatedAt: normalizeString(jsonPayload.generatedAt) ?? null,
      interviewStatus: normalizeString(jsonPayload.interviewStatus) ?? null,
      currentStage: normalizeString(jsonPayload.currentStage) ?? null,
      overallScore:
        typeof jsonPayload.overallScore === 'number'
          ? jsonPayload.overallScore
          : null,
      markdownPreview: buildMarkdownPreview(markdown),
      markdownUrl: `/api/rooms/${encodeURIComponent(args.roomId)// Provider-specific function removed/scenario-report?format=markdown`,
      jsonUrl: `/api/rooms/${encodeURIComponent(args.roomId)// Provider-specific function removed/scenario-report?format=json`,
    // Provider-specific function removed;
  // Provider-specific function removed

  private resolveScenarioReportFiles(
    artifactDirectory: string | undefined,
  ): {
    directory: string;
    markdownPath?: string;
    jsonPath?: string;
  // Provider-specific function removed | null {
    const normalizedDirectory = normalizeString(artifactDirectory);
  ***REMOVED***!normalizedDirectory) {
  ***REMOVED***
    // Provider-specific function removed

    const directory = resolve(normalizedDirectory);
    const markdownPath = resolve(directory, 'scenario-report.md');
    const jsonPath = resolve(directory, 'scenario-report.json');
    const hasMarkdown = existsSync(markdownPath);
    const hasJson = existsSync(jsonPath);

  ***REMOVED***!hasMarkdown && !hasJson) {
  ***REMOVED***
    // Provider-specific function removed

    return {
      directory,
      markdownPath: hasMarkdown ? markdownPath : undefined,
      jsonPath: hasJson ? jsonPath : undefined,
    // Provider-specific function removed;
  // Provider-specific function removed

  private resolveInterviewDemoAggregateReportFiles(): {
    directory: string;
    markdownPath?: string;
    jsonPath?: string;
  // Provider-specific function removed | null {
    const latestMarkdownPath = resolve(
      RUNS_DIRECTORY,
      `${INTERVIEW_DEMO_AGGREGATE_REPORT_PREFIX// Provider-specific function removedlatest.md`,
    );
    const latestJsonPath = resolve(
      RUNS_DIRECTORY,
      `${INTERVIEW_DEMO_AGGREGATE_REPORT_PREFIX// Provider-specific function removedlatest.json`,
    );
    const hasLatestMarkdown = existsSync(latestMarkdownPath);
    const hasLatestJson = existsSync(latestJsonPath);

  ***REMOVED***hasLatestMarkdown || hasLatestJson) {
      return {
        directory: RUNS_DIRECTORY,
        markdownPath: hasLatestMarkdown ? latestMarkdownPath : undefined,
        jsonPath: hasLatestJson ? latestJsonPath : undefined,
      // Provider-specific function removed;
    // Provider-specific function removed

  ***REMOVED***!existsSync(RUNS_DIRECTORY)) {
  ***REMOVED***
    // Provider-specific function removed

    const groupedReports = new Map<
      string,
      {
        markdownPath?: string;
        jsonPath?: string;
        latestMtimeMs: number;
      // Provider-specific function removed
    >();

    for (const entryName of readdirSync(RUNS_DIRECTORY)) {
    ***REMOVED***!entryName.startsWith(INTERVIEW_DEMO_AGGREGATE_REPORT_PREFIX)) {
        continue;
      // Provider-specific function removed
    ***REMOVED***
        entryName === `${INTERVIEW_DEMO_AGGREGATE_REPORT_PREFIX// Provider-specific function removedlatest.md` ||
        entryName === `${INTERVIEW_DEMO_AGGREGATE_REPORT_PREFIX// Provider-specific function removedlatest.json`
    ***REMOVED***
        continue;
      // Provider-specific function removed

      const resolvedPath = resolve(RUNS_DIRECTORY, entryName);
      const extension = extname(resolvedPath).toLowerCase();
    ***REMOVED***extension !== '.md' && extension !== '.json') {
        continue;
      // Provider-specific function removed

      const baseName = entryName.slice(0, -extension.length);
      const current =
        groupedReports.get(baseName) ??
        {
          latestMtimeMs: 0,
        // Provider-specific function removed;
      const nextMtimeMs = statSync(resolvedPath).mtimeMs;
      current.latestMtimeMs = Math.max(current.latestMtimeMs, nextMtimeMs);
    ***REMOVED***extension === '.md') {
        current.markdownPath = resolvedPath;
      // Provider-specific function removed else {
        current.jsonPath = resolvedPath;
      // Provider-specific function removed
      groupedReports.set(baseName, current);
    // Provider-specific function removed

    const selected = [...groupedReports.values()]
      .sort((left, right) => right.latestMtimeMs - left.latestMtimeMs)
      .find((candidate) => candidate.markdownPath || candidate.jsonPath);

  ***REMOVED***!selected) {
  ***REMOVED***
    // Provider-specific function removed

    return {
      directory: RUNS_DIRECTORY,
      markdownPath: selected.markdownPath,
      jsonPath: selected.jsonPath,
    // Provider-specific function removed;
  // Provider-specific function removed

  async createRoom(input: unknown) {
    const payload = asRecord(input);
    const mode = normalizeString(payload.mode);
  ***REMOVED***mode === 'admin') {
      return this.createAdminRoom(payload);
    // Provider-specific function removed
  ***REMOVED***mode === 'custom_roleplay' || mode === 'roleplay') {
      return this.createCustomRoleplayRoom(payload);
    // Provider-specific function removed

    return this.createManualRoom(payload);
  // Provider-specific function removed

  private applyAppRuntimeMode(roomBlueprint: ChatroomRoomBlueprint): ChatroomRoomBlueprint {
    return applyRoomRuntimeModeToBlueprint(roomBlueprint, this.runtimeMode);
  // Provider-specific function removed

  async createInterviewDemoRoom(input: unknown) {
    const payload = asRecord(input);
    const candidateName = normalizeString(payload.candidateName) ?? 'Candidate';
    const targetRole = normalizeString(payload.targetRole) ?? INTERVIEW_DEMO_TARGET_ROLE;
    const roomTopic =
      normalizeString(payload.topic) ??
      `${targetRole// Provider-specific function removed interview demo`;
    const roomObjective =
      normalizeString(payload.objective) ??
      'Run a minimal live interview demo where the human user answers directly in the browser.';

    const planned = planChatroomRoomScenario({
      scenarioTemplateId: 'interview_simulation',
      title: INTERVIEW_DEMO_ROOM_TITLE,
      topic: roomTopic,
      objective: roomObjective,
      constraints: [
        'Use Simplified Chinese in the room.',
        'Keep the interview one-question-at-a-time.',
        'Assume the browser user is the live candidate.',
      ],
      runtimeConfig: {
        summaryEnabled: true,
        maxReplyCharacters: 1000,
      // Provider-specific function removed,
      interview: {
        candidateName,
        targetRole,
        targetLevel: INTERVIEW_DEMO_TARGET_LEVEL,
        candidateBackground: '候选人为计算机本科学生，正在浏览器中实时作答，用于 demo 验证。',
        companyStyle: 'structured follow-up',
        focusAreas: [...INTERVIEW_DEMO_FOCUS_AREAS],
        scoreTemplateId: 'general_professional',
      // Provider-specific function removed,
      metadata: {
        demoKind: 'interview-demo',
        createdFrom: 'chatroom-web',
        runtimeMode: this.runtimeMode,
      // Provider-specific function removed,
    // Provider-specific function removed);

    this.pruneInterviewDemoRooms({
      retainCount: Math.max(0, INTERVIEW_DEMO_ROOM_RETAIN_COUNT - 1),
    // Provider-specific function removed);

    const roomBlueprint = this.applyAppRuntimeMode(planned.blueprint);
    const room = createChatroomRoom({
      roomBlueprint,
      roomType: roomBlueprint.roomType,
      topic: roomBlueprint.topic,
      objective: roomBlueprint.objective,
      constraints: roomBlueprint.constraints,
      speakerIds: roomBlueprint.speakerIds,
    // Provider-specific function removed);

    this.bootstrapInterviewDemoRoom(room.roomId);

    return {
      status: 'created',
      roomId: room.roomId,
      note: `面试 demo 房间 ${shortId(room.roomId)// Provider-specific function removed 已创建，正在准备开场问题。`,
      targetRole,
      candidateName,
    // Provider-specific function removed;
  // Provider-specific function removed

  cloneRoom(roomId: string) {
    assertRoomExists(roomId);
    const result = cloneChatroomRoom(roomId);
    return {
      roomId: result.roomId,
      clonedFromRoomId: result.clonedFromRoomId,
      note: `房间已从 ${shortId(roomId)// Provider-specific function removed 克隆为 ${shortId(result.roomId)// Provider-specific function removed。`,
    // Provider-specific function removed;
  // Provider-specific function removed

  async deleteRoom(roomId: string) {
    const live = this.resolveEffectiveLiveSnapshot(roomId);
  ***REMOVED***live && (live.status === 'starting' || live.status === 'running')) {
      throw new HttpError(409, 'Cannot delete a room while it is still running.');
    // Provider-specific function removed

    const result = deleteChatroomRoom(roomId);
    return {
      deleted: result.existed,
      note: result.existed
        ? `Deleted room ${shortId(roomId)// Provider-specific function removed.`
        : `Room ${shortId(roomId)// Provider-specific function removed was already missing.`,
      result,
    // Provider-specific function removed;
  // Provider-specific function removed

  private bootstrapInterviewDemoRoom(roomId: string) {
    const timer = setTimeout(() => {
      void executeChatroomWorkflow({
        workflowRuntime: this.workflowRuntime,
        roomId,
        rounds: 1,
        workflowOptions: this.createControlledWorkflowOptions({
          roomId,
        // Provider-specific function removed),
      // Provider-specific function removed).catch((error) => {
        const message = error instanceof Error ? error.stack ?? error.message : String(error);
        console.error(`[interview-demo] failed to bootstrap room ${roomId// Provider-specific function removed: ${message// Provider-specific function removed`);
      // Provider-specific function removed);
    // Provider-specific function removed, 0);
    timer.unref?.();
  // Provider-specific function removed

  private pruneInterviewDemoRooms(args: {
    retainCount: number;
  // Provider-specific function removed) {
    const demoRooms = listChatroomRooms(256)
      .filter((room) => this.isInterviewDemoRoom(room))
      .sort((left, right) => Date.parse(left.createdAt) - Date.parse(right.createdAt));

    let removableCount = Math.max(0, demoRooms.length - args.retainCount);
    for (const room of demoRooms) {
    ***REMOVED***removableCount <= 0) {
        break;
      // Provider-specific function removed

      const live = this.resolveEffectiveLiveSnapshot(room.roomId);
    ***REMOVED***live && (live.status === 'starting' || live.status === 'running')) {
        continue;
      // Provider-specific function removed

      const result = deleteChatroomRoom(room.roomId);
    ***REMOVED***result.existed) {
        removableCount -= 1;
      // Provider-specific function removed
    // Provider-specific function removed

  ***REMOVED***removableCount > 0) {
      console.warn(
        `[interview-demo] wanted to retain ${args.retainCount// Provider-specific function removed rooms but ${removableCount// Provider-specific function removed old demo rooms could not be removed.`,
      );
    // Provider-specific function removed
  // Provider-specific function removed

  private isInterviewDemoRoom(room: {
    topic: string;
    roomBlueprint?: {
      title?: string;
      scenarioTemplateId?: string;
      metadata?: Record<string, unknown>;
    // Provider-specific function removed;
  // Provider-specific function removed) {
    return room.roomBlueprint?.title === INTERVIEW_DEMO_ROOM_TITLE &&
      room.roomBlueprint?.scenarioTemplateId === 'interview_simulation' &&
      resolveRoomRuntimeModeFromMetadata(room.roomBlueprint?.metadata) === this.runtimeMode &&
      /interview demo/i.test(room.topic);
  // Provider-specific function removed

  async enqueueRoomMessage(roomId: string, input: unknown) {
    assertRoomExists(roomId);
    const payload = asRecord(input);
    const authorName = normalizeString(payload.authorName) ?? 'User';
    const content = normalizeString(payload.content);
  ***REMOVED***!content) {
      throw new HttpError(400, '消息不能为空。');
    // Provider-specific function removed

    const pending = enqueueChatroomPendingMessage({
      roomId,
      authorName,
      content,
    // Provider-specific function removed);
    this.kickRoomQueue(roomId);

    return {
      note: `已收到 ${authorName// Provider-specific function removed 的消息。`,
      pendingMessage: pending,
    // Provider-specific function removed;
  // Provider-specific function removed

  async setRoomQueuePaused(roomId: string, input: unknown) {
    assertRoomExists(roomId);
    const payload = asRecord(input);
    const paused = Boolean(payload.paused);
  ***REMOVED***paused) {
      pauseChatroomQueue({
        roomId,
        source: 'web',
        reason: '已从 Web 控制台暂停队列。',
      // Provider-specific function removed);
      return {
        paused: true,
        note: `房间 ${shortId(roomId)// Provider-specific function removed 已暂停。`,
      // Provider-specific function removed;
    // Provider-specific function removed

    const resumed = resumeChatroomQueue({ roomId // Provider-specific function removed);
    this.kickRoomQueue(roomId);
    return {
      paused: false,
      note: resumed
        ? `房间 ${shortId(roomId)// Provider-specific function removed 已恢复。`
        : `房间 ${shortId(roomId)// Provider-specific function removed 当前可用。`,
    // Provider-specific function removed;
  // Provider-specific function removed

  async stopRoomRun(roomId: string, input: unknown) {
    assertRoomExists(roomId);
    const payload = asRecord(input);
    const executionRunId = normalizeString(payload.executionRunId);
    return this.requestStopActiveRun({ roomId, executionRunId // Provider-specific function removed);
  // Provider-specific function removed

  async clearRoomPendingMessages(roomId: string, input: unknown) {
    assertRoomExists(roomId);
    const payload = asRecord(input);
    const live = this.resolveEffectiveLiveSnapshot(roomId);
    const includeFailed = payload.includeFailed !== false;
    const includeProcessing = payload.includeProcessing === true;
    const statuses: Array<'pending' | 'failed' | 'processing'> = ['pending'];

  ***REMOVED***includeFailed) {
      statuses.push('failed');
    // Provider-specific function removed

  ***REMOVED***includeProcessing) {
    ***REMOVED***live && (live.status === 'starting' || live.status === 'running')) {
        throw new HttpError(
          409,
          '房间运行中，不能清空队列。',
        );
      // Provider-specific function removed
      statuses.push('processing');
    // Provider-specific function removed

    const deletedCount = deleteChatroomPendingMessages({
      roomId,
      statuses,
    // Provider-specific function removed);

    return {
      cleared: deletedCount,
      note:
        deletedCount > 0
          ? `已清理 ${deletedCount// Provider-specific function removed 条排队消息。`
          : `当前没有可清理的排队消息。`,
    // Provider-specific function removed;
  // Provider-specific function removed

  async resumeRoomCheckpoint(roomId: string, input: unknown) {
    assertRoomExists(roomId);
    const payload = asRecord(input);
    const checkpointId =
      normalizeString(payload.checkpointId) ??
      this.findLatestResumableCheckpoint(roomId)?.checkpointId;
  ***REMOVED***!checkpointId) {
      throw new HttpError(404, '当前没有可续跑的进度。');
    // Provider-specific function removed

    const checkpoint = this.findLatestResumableCheckpoint(roomId, { checkpointId // Provider-specific function removed);
  ***REMOVED***!checkpoint) {
      throw new HttpError(404, '当前进度不能续跑。');
    // Provider-specific function removed

    const executed = await executeChatroomWorkflow({
      workflowRuntime: this.workflowRuntime,
      roomId,
      parallelBatchSize: this.parallelBatchSize,
      workflowOptions: this.createControlledWorkflowOptions({
        roomId,
        resumeCheckpointId: checkpoint.checkpointId,
      // Provider-specific function removed),
    // Provider-specific function removed);

    return {
      note:
        executed.note ??
        `已从 ${shortId(checkpoint.checkpointId)// Provider-specific function removed 继续运行。`,
      roomId: executed.roomId,
      executionRunId: executed.result.runId,
      artifactDirectory: executed.artifactPaths.directory,
    // Provider-specific function removed;
  // Provider-specific function removed

  private async createManualRoom(payload: Record<string, unknown>) {
    const topic = normalizeString(payload.topic);
    const objective = normalizeString(payload.objective);
    const scoreTemplateId = normalizeString(payload.scoreTemplateId)?.toLowerCase();
    const scoreDimensions = normalizeStringList(payload.scoreDimensions);
    const roomType =
      parseChatroomRoomType(normalizeString(payload.roomType)) ?? DEFAULT_CHATROOM_ROOM_TYPE;
    const roomTypeSpec = resolveChatroomRoomType(roomType);
    const speakerCount = normalizePositiveInteger(payload.speakerCount) ??
      roomTypeSpec.recommendedSpeakerCount;

  ***REMOVED***!topic || !objective) {
      throw new HttpError(400, '请填写主题和目标。');
    // Provider-specific function removed

    let createPlan: ReturnType<typeof resolveChatroomManualCreatePlan>;
    try {
      createPlan = resolveChatroomManualCreatePlan({
        topic,
        objective,
        roomType,
        speakerCount,
        scoreTemplateId,
        scoreDimensions,
      // Provider-specific function removed);
    // Provider-specific function removed catch (error) {
    ***REMOVED***
        error instanceof ChatroomManualCreateValidationError &&
        error.code === 'invalid_score_template'
    ***REMOVED***
        throw new HttpError(
          400,
          `未知评分模板 "${String(error.details.scoreTemplateId ?? '')// Provider-specific function removed"。`,
        );
      // Provider-specific function removed
    ***REMOVED***
        error instanceof ChatroomManualCreateValidationError &&
        error.code === 'invalid_speaker_count'
    ***REMOVED***
        throw new HttpError(
          400,
          `人数需在 ${String(error.details.minSpeakerCount)// Provider-specific function removed-${String(error.details.maxSpeakerCount)// Provider-specific function removed 之间。`,
        );
      // Provider-specific function removed
      throw error;
    // Provider-specific function removed

  ***REMOVED***createPlan.mode === 'interview_scenario') {
      const roomBlueprint = this.applyAppRuntimeMode(createPlan.roomBlueprint);
      const customCharacters = roomBlueprint.customCharacters;
      const customRoleplayTemplates = customCharacters
        ? createCustomRoleplayTemplates(customCharacters)
        : undefined;
      const executed = await executeChatroomWorkflow({
        workflowRuntime: this.workflowRuntime,
        topic: roomBlueprint.topic,
        objective: roomBlueprint.objective,
        constraints: roomBlueprint.constraints,
        roomBlueprint,
        roomType: roomBlueprint.roomType,
        rounds: 1,
        speakerIds: roomBlueprint.speakerIds,
        parallelBatchSize:
          roomBlueprint.runtimeConfig.parallelBatchSize ?? this.parallelBatchSize,
        customCharacters,
        customRoleplayTemplates,
        maxReplyCharacters: roomBlueprint.runtimeConfig.maxReplyCharacters,
        summaryEnabled: roomBlueprint.runtimeConfig.summaryEnabled,
        workflowOptions: this.createControlledWorkflowOptions({// Provider-specific function removed),
      // Provider-specific function removed);

      const noteSuffix = createPlan.notes.join(' ');
      return {
        status: 'created',
        roomId: executed.roomId,
        note:
          executed.note ??
          (noteSuffix
            ? `房间 ${shortId(executed.roomId)// Provider-specific function removed 已创建。${noteSuffix// Provider-specific function removed`
            : `房间 ${shortId(executed.roomId)// Provider-specific function removed 已创建。`),
        artifactDirectory: executed.artifactPaths.directory,
      // Provider-specific function removed;
    // Provider-specific function removed

    const roomBlueprint = this.applyAppRuntimeMode(
      createChatroomRoomBlueprintFromLegacyInput({
        roomType: createPlan.roomType,
        topic,
        objective,
        speakerIds: selectSpeakerIdsForPreset(
          createPlan.roomTypeSpec.speakerPreset,
          createPlan.speakerCount,
        ),
        parallelBatchSize: this.parallelBatchSize,
        metadata: {
          createdFrom: 'manual-room-create',
        // Provider-specific function removed,
      // Provider-specific function removed),
    );
    const executed = await executeChatroomWorkflow({
      workflowRuntime: this.workflowRuntime,
      topic: roomBlueprint.topic,
      objective: roomBlueprint.objective,
      constraints: roomBlueprint.constraints,
      roomBlueprint,
      roomType: roomBlueprint.roomType,
      rounds: 1,
      speakerIds: roomBlueprint.speakerIds,
      parallelBatchSize: roomBlueprint.runtimeConfig.parallelBatchSize ?? this.parallelBatchSize,
      maxReplyCharacters: roomBlueprint.runtimeConfig.maxReplyCharacters,
      summaryEnabled: roomBlueprint.runtimeConfig.summaryEnabled,
      workflowOptions: this.createControlledWorkflowOptions({// Provider-specific function removed),
    // Provider-specific function removed);

    return {
      status: 'created',
      roomId: executed.roomId,
      note: executed.note ?? `房间 ${shortId(executed.roomId)// Provider-specific function removed 已创建。`,
      artifactDirectory: executed.artifactPaths.directory,
    // Provider-specific function removed;
  // Provider-specific function removed

  private async createCustomRoleplayRoom(payload: Record<string, unknown>) {
    const customCharacters = parseRoleplayCharacterCards(
      payload.customCharacters ?? payload.characters,
    );
  ***REMOVED***customCharacters.length === 0) {
      throw new HttpError(400, '请至少提供一个角色卡。');
    // Provider-specific function removed

    const topic = normalizeString(payload.topic);
    const objective = normalizeString(payload.objective);
  ***REMOVED***!topic || !objective) {
      throw new HttpError(400, '请提供主题和目标。');
    // Provider-specific function removed

    const scene = asRecord(payload.scene);
    const planned = planCustomRoleplayRoom({
      title: normalizeString(payload.title),
      topic,
      objective,
      constraints: normalizeStringList(payload.constraints),
      scene: {
        setting: normalizeString(scene.setting) ?? normalizeString(payload.setting),
        openingSituation:
          normalizeString(scene.openingSituation) ??
          normalizeString(payload.openingSituation),
        atmosphere: normalizeString(scene.atmosphere) ?? normalizeString(payload.atmosphere),
        userMode: parseRoleplayUserMode(scene.userMode ?? payload.userMode),
      // Provider-specific function removed,
customCharacters,
      runtimeConfig: {
        parallelBatchSize:
          normalizePositiveInteger(payload.parallelBatchSize) ?? this.parallelBatchSize,
        summaryEnabled:
          typeof payload.summaryEnabled === 'boolean' ? payload.summaryEnabled : true,
        maxReplyCharacters: normalizePositiveInteger(payload.maxReplyCharacters),
      // Provider-specific function removed,
    // Provider-specific function removed);
    const roomBlueprint = this.applyAppRuntimeMode(planned.blueprint);
    const blueprintCharacters = roomBlueprint.customCharacters;
    const customRoleplayTemplates = blueprintCharacters
      ? createCustomRoleplayTemplates(blueprintCharacters)
      : undefined;
    const rounds = normalizePositiveInteger(payload.rounds) ?? 1;

    const executed = await executeChatroomWorkflow({
      workflowRuntime: this.workflowRuntime,
      topic: roomBlueprint.topic,
      objective: roomBlueprint.objective,
      constraints: roomBlueprint.constraints,
      roomBlueprint,
      roomType: roomBlueprint.roomType,
      rounds,
      speakerIds: roomBlueprint.speakerIds,
      parallelBatchSize:
        roomBlueprint.runtimeConfig.parallelBatchSize ?? this.parallelBatchSize,
      customCharacters: blueprintCharacters,
      customRoleplayTemplates,
      maxReplyCharacters: roomBlueprint.runtimeConfig.maxReplyCharacters,
      summaryEnabled: roomBlueprint.runtimeConfig.summaryEnabled,
      workflowOptions: this.createControlledWorkflowOptions({// Provider-specific function removed),
    // Provider-specific function removed);

    return {
      status: 'created',
      roomId: executed.roomId,
      note:
        executed.note ??
        `角色扮演房间 ${shortId(executed.roomId)// Provider-specific function removed 已创建，角色数 ${customCharacters.length// Provider-specific function removed。`,
      artifactDirectory: executed.artifactPaths.directory,
    // Provider-specific function removed;
  // Provider-specific function removed

  private async createAdminRoom(payload: Record<string, unknown>) {
    const adminRequest = normalizeString(payload.adminRequest);
    const conversation = parsePlatformAdminConversation(payload.conversation);
  ***REMOVED***!adminRequest) {
      throw new HttpError(400, '请先描述你的需求。');
    // Provider-specific function removed

    const planning = await advanceRoomPlanningWithPlatformAdmin(
      this.agentRuntime,
      {
        conversation,
        userMessage: adminRequest,
        runtimeConfig: {
          parallelBatchSize: this.parallelBatchSize,
        // Provider-specific function removed,
      // Provider-specific function removed,
    );

  ***REMOVED***planning.status === 'needs_clarification') {
      return {
        status: 'needs_clarification',
        note: planning.summary,
        assistantMessage: planning.assistantMessage,
        followUpQuestions: planning.followUpQuestions,
        assumptions: planning.assumptions,
        conversation: planning.conversation,
        tentativeScenarioTemplateId: planning.tentativeScenarioTemplateId,
      // Provider-specific function removed;
    // Provider-specific function removed

    const roomBlueprint = this.applyAppRuntimeMode(planning.blueprint);
    const customCharacters = roomBlueprint.customCharacters;
    const customRoleplayTemplates = customCharacters
      ? createCustomRoleplayTemplates(customCharacters)
      : undefined;
    const executed = await executeChatroomWorkflow({
      workflowRuntime: this.workflowRuntime,
      topic: roomBlueprint.topic,
      objective: roomBlueprint.objective,
      constraints: roomBlueprint.constraints,
      roomBlueprint,
      roomType: roomBlueprint.roomType,
      rounds: 1,
      speakerIds: roomBlueprint.speakerIds,
      parallelBatchSize:
        roomBlueprint.runtimeConfig.parallelBatchSize ?? this.parallelBatchSize,
      customCharacters,
      customRoleplayTemplates,
      maxReplyCharacters: roomBlueprint.runtimeConfig.maxReplyCharacters,
      summaryEnabled: roomBlueprint.runtimeConfig.summaryEnabled,
      workflowOptions: this.createControlledWorkflowOptions({// Provider-specific function removed),
    // Provider-specific function removed);

    return {
      status: 'created',
      roomId: executed.roomId,
      note:
        executed.note ??
        `房间 ${shortId(executed.roomId)// Provider-specific function removed 已创建。`,
      artifactDirectory: executed.artifactPaths.directory,
    // Provider-specific function removed;
  // Provider-specific function removed

  private buildRoomOverview(roomId: string) {
    const room = getChatroomRoomRecord(roomId);
  ***REMOVED***!room) {
      throw new HttpError(404, `Room "${roomId// Provider-specific function removed" was not found.`);
    // Provider-specific function removed

    const live = this.resolveEffectiveLiveSnapshot(roomId);
    const mainSession = getChatroomMainSession(roomId);
    const latestRun = getLatestChatroomExecutionRun(roomId) ?? null;
    const queuePauseState = loadChatroomQueuePauseState(roomId);
    const checkpoint = this.findLatestResumableCheckpoint(roomId);
    const state = loadChatroomRoomState(roomId);
    const runtimeMode = resolveRoomRuntimeModeFromBlueprint(room.roomBlueprint);
    const status = resolveRoomStatus({
      live,
      latestRunStatus: latestRun?.status,
      queuePaused: Boolean(queuePauseState),
    // Provider-specific function removed);

    return {
      roomId: room.roomId,
      runtimeMode,
      runtimeModeLabel: getRoomRuntimeModeLabel(runtimeMode),
      runtimeModeShortLabel: getRoomRuntimeModeShortLabel(runtimeMode),
      roomType: room.roomType,
      roomTypeLabel: getChatroomRoomTypeLabel(room.roomType),
      roomTypeShortLabel: getChatroomRoomTypeShortLabel(room.roomType),
      mainSessionId: mainSession?.mainSessionId ?? room.mainSessionId ?? null,
      scenarioTemplateId: room.scenarioTemplateId,
      topic: room.topic,
      objective: room.objective,
      createdAt: room.createdAt,
      updatedAt: resolveRoomUpdatedAt(room.updatedAt, live?.updatedAt, latestRun?.endedAt),
      speakerCount: room.speakerIds.length,
      messageCount: mainSession?.messageCount ?? state.messages.length,
      runCount: listChatroomExecutionRuns(roomId, 64).length,
      latestRunStatus: latestRun?.status ?? null,
      latestExecutionRunId: latestRun?.executionRunId ?? null,
      liveStatus: live?.status ?? null,
      liveExecutionRunId: live?.executionRunId ?? null,
      queuePaused: Boolean(queuePauseState),
      queuePauseReason: queuePauseState?.reason,
      pendingCount: listChatroomPendingMessages(roomId, {
        limit: 32,
        statuses: ['pending', 'processing'],
      // Provider-specific function removed).length,
      resumableCheckpointId: checkpoint?.checkpointId ?? null,
      status,
      hasFinalSummary: Boolean(state.finalSummary),
      governanceSummary: room.roomBlueprint
        ? formatRoomBlueprintGovernanceSummary(room.roomBlueprint.governance)
        : '',
    // Provider-specific function removed;
  // Provider-specific function removed

  private buildRoomListOverview(room: ChatroomRoomListItem) {
    const runtimeMode = resolveRoomRuntimeModeFromBlueprint(room.roomBlueprint);

    return {
      roomId: room.roomId,
      runtimeMode,
      runtimeModeLabel: getRoomRuntimeModeLabel(runtimeMode),
      runtimeModeShortLabel: getRoomRuntimeModeShortLabel(runtimeMode),
      roomType: room.roomType,
      roomTypeLabel: getChatroomRoomTypeLabel(room.roomType),
      roomTypeShortLabel: getChatroomRoomTypeShortLabel(room.roomType),
      mainSessionId: room.mainSessionId ?? null,
      scenarioTemplateId: room.scenarioTemplateId,
      topic: room.topic,
      objective: room.objective,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
      speakerCount: room.speakerIds.length,
      messageCount: room.messageCount,
      runCount: room.runCount,
      latestRunStatus: null,
      latestExecutionRunId: room.lastExecutionRunId ?? null,
      liveStatus: null,
      liveExecutionRunId: null,
      queuePaused: false,
      queuePauseReason: undefined,
      pendingCount: 0,
      resumableCheckpointId: null,
      status: 'idle',
      hasFinalSummary: Boolean(room.lastSummaryPreview),
      governanceSummary: room.roomBlueprint
        ? formatRoomBlueprintGovernanceSummary(room.roomBlueprint.governance)
        : '',
    // Provider-specific function removed;
  // Provider-specific function removed

  private async pumpQueues(): Promise<void> {
    const rooms = listChatroomRooms(96);
    for (const room of rooms) {
      this.recoverStaleProcessingMessages(room.roomId);
      const pending = listChatroomPendingMessages(room.roomId, {
        limit: 1,
        statuses: ['pending'],
      // Provider-specific function removed);
    ***REMOVED***pending.length === 0) {
        continue;
      // Provider-specific function removed

      this.kickRoomQueue(room.roomId);
    // Provider-specific function removed
  // Provider-specific function removed

  private kickRoomQueue(roomId: string): void {
    void this.processQueuedChatroomMessage(roomId).catch(() => {
      // Queue failure is reflected in the persisted pending-message status.
    // Provider-specific function removed);
  // Provider-specific function removed

  private async processQueuedChatroomMessage(roomId: string): Promise<{
    status: 'busy' | 'empty' | 'paused' | 'processed' | 'cancelled' | 'failed';
    note?: string;
  // Provider-specific function removed> {
    this.recoverStaleProcessingMessages(roomId);

    const queuePauseState = loadChatroomQueuePauseState(roomId);
  ***REMOVED***queuePauseState) {
      return {
        status: 'paused',
        note:
          queuePauseState.reason ??
          'Room queue is paused. New messages stay queued until you resume the room.',
      // Provider-specific function removed;
    // Provider-specific function removed

  ***REMOVED***this.queueProcessingRooms.has(roomId)) {
      return {
        status: 'busy',
        note: 'Message queued. Agents will respond when the room is idle.',
      // Provider-specific function removed;
    // Provider-specific function removed

    const live = loadChatroomLiveSnapshot(roomId);
  ***REMOVED***live && (live.status === 'starting' || live.status === 'running')) {
      return {
        status: 'busy',
        note: 'Message queued. Agents will respond when the room is idle.',
      // Provider-specific function removed;
    // Provider-specific function removed

    const claimed = claimNextChatroomPendingMessage(roomId);
  ***REMOVED***!claimed) {
      return {
        status: 'empty',
      // Provider-specific function removed;
    // Provider-specific function removed

    this.queueProcessingRooms.add(roomId);
    try {
      const executed = await executeChatroomWorkflow({
        workflowRuntime: this.workflowRuntime,
        roomId,
        rounds: 1,
        humanMessage: claimed.content,
        humanAuthorName: claimed.authorName,
        parallelBatchSize: this.parallelBatchSize,
        workflowOptions: this.createControlledWorkflowOptions({
          roomId,
          checkpointMetadata: {
            pendingMessageId: claimed.pendingMessageId,
          // Provider-specific function removed,
        // Provider-specific function removed),
      // Provider-specific function removed);

      markChatroomPendingMessageCompleted({
        pendingMessageId: claimed.pendingMessageId,
        processedExecutionRunId: executed.result.runId,
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
        return {
          status: 'cancelled',
          note:
            'Queued message processing was stopped before the agents finished. The message was returned to the queue.',
        // Provider-specific function removed;
      // Provider-specific function removed

    ***REMOVED***isChatroomRoomBusyError(error)) {
        releaseChatroomPendingMessage({
          pendingMessageId: claimed.pendingMessageId,
        // Provider-specific function removed);
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
      return {
        status: 'failed',
        note: 'Queued message processing failed. The queued message was marked as failed.',
      // Provider-specific function removed;
    // Provider-specific function removed finally {
      this.queueProcessingRooms.delete(roomId);
    // Provider-specific function removed
  // Provider-specific function removed

  private createControlledWorkflowOptions(args: {
    roomId?: string;
    resumeCheckpointId?: string;
    checkpointMetadata?: Record<string, unknown>;
  // Provider-specific function removed): WorkflowExecuteOptions<ChatroomState> {
    const controller = new AbortController();

    return {
      observer: this.createTrackedObserver({
        controller,
        roomId: args.roomId,
      // Provider-specific function removed),
      signal: controller.signal,
      checkpointStore: this.checkpointStore,
      resumeCheckpointId: args.resumeCheckpointId,
      checkpointMetadata: buildChatroomCheckpointMetadata(
        args.roomId,
        args.checkpointMetadata,
      ),
    // Provider-specific function removed;
  // Provider-specific function removed

  private createTrackedObserver(args: {
    controller: AbortController;
    roomId?: string;
    observer?: WorkflowObserver<ChatroomState>;
  // Provider-specific function removed): WorkflowObserver<ChatroomState> {
    const activeRun: ActiveChatroomRun = {
      controller: args.controller,
      roomId: args.roomId,
      registeredAtMs: Date.now(),
    // Provider-specific function removed;
    activeRun.stopMonitor = this.startStopMonitor(activeRun);

    const cleanup = () => {
    ***REMOVED***activeRun.stopMonitor) {
        clearInterval(activeRun.stopMonitor);
        activeRun.stopMonitor = undefined;
      // Provider-specific function removed
    ***REMOVED***activeRun.executionRunId) {
        this.activeRunsByExecutionRunId.delete(activeRun.executionRunId);
      // Provider-specific function removed
    ***REMOVED***activeRun.roomId) {
        const tracked = this.activeRunsByRoomId.get(activeRun.roomId);
      ***REMOVED***tracked === activeRun) {
          this.activeRunsByRoomId.delete(activeRun.roomId);
        // Provider-specific function removed
      // Provider-specific function removed
    // Provider-specific function removed;

    return {
      onRunStarted: (event) => {
        activeRun.executionRunId = event.runId;
        this.activeRunsByExecutionRunId.set(event.runId, activeRun);
      ***REMOVED***activeRun.roomId) {
          this.activeRunsByRoomId.set(activeRun.roomId, activeRun);
        // Provider-specific function removed
        args.observer?.onRunStarted?.(event);
      // Provider-specific function removed,
      onStepStarted: (event) => {
        args.observer?.onStepStarted?.(event);
      // Provider-specific function removed,
      onStepCompleted: (event) => {
        args.observer?.onStepCompleted?.(event);
      // Provider-specific function removed,
      onRunCompleted: (event) => {
        try {
          args.observer?.onRunCompleted?.(event);
        // Provider-specific function removed finally {
          cleanup();
        // Provider-specific function removed
      // Provider-specific function removed,
      onRunFailed: (event) => {
        try {
          args.observer?.onRunFailed?.(event);
        // Provider-specific function removed finally {
          cleanup();
        // Provider-specific function removed
      // Provider-specific function removed,
    // Provider-specific function removed;
  // Provider-specific function removed

  private startStopMonitor(activeRun: ActiveChatroomRun): NodeJS.Timeout | undefined {
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
    // Provider-specific function removed, STOP_POLL_INTERVAL_MS);
    timer.unref?.();
    return timer;
  // Provider-specific function removed

  private async requestStopActiveRun(args: {
    roomId: string;
    executionRunId?: string;
  // Provider-specific function removed): Promise<{
    stopped: boolean;
    note?: string;
  // Provider-specific function removed> {
    const liveSnapshot = this.resolveEffectiveLiveSnapshot(args.roomId);
    const activeRun =
      (args.executionRunId
        ? this.activeRunsByExecutionRunId.get(args.executionRunId)
        : undefined) ??
      this.activeRunsByRoomId.get(args.roomId);
    const hasActiveRun =
      Boolean(activeRun) ||
      Boolean(
        liveSnapshot &&
        (liveSnapshot.status === 'starting' || liveSnapshot.status === 'running'),
      );

  ***REMOVED***hasActiveRun) {
      pauseChatroomQueue({
        roomId: args.roomId,
        source: 'stop',
        reason: '已发出停止请求，队列已暂停。',
      // Provider-specific function removed);
    // Provider-specific function removed

  ***REMOVED***!activeRun) {
    ***REMOVED***
        liveSnapshot &&
        (liveSnapshot.status === 'starting' || liveSnapshot.status === 'running')
    ***REMOVED***
        const targetId = args.executionRunId ?? liveSnapshot.executionRunId ?? args.roomId;
        writeChatroomRunStopRequest({
          roomId: args.roomId,
          executionRunId: args.executionRunId ?? liveSnapshot.executionRunId,
          reason: `Chatroom run "${targetId// Provider-specific function removed" was stopped by the operator.`,
        // Provider-specific function removed);
        return {
          stopped: true,
          note: `已请求停止 ${shortId(targetId)// Provider-specific function removed，房间队列已暂停。`,
        // Provider-specific function removed;
      // Provider-specific function removed

      return {
        stopped: false,
        note: args.executionRunId
          ? `运行 ${shortId(args.executionRunId)// Provider-specific function removed 当前未运行。`
          : `房间 ${shortId(args.roomId)// Provider-specific function removed 当前没有运行任务。`,
      // Provider-specific function removed;
    // Provider-specific function removed

  ***REMOVED***activeRun.controller.signal.aborted) {
      return {
        stopped: false,
        note: `已请求停止 ${shortId(activeRun.executionRunId ?? args.roomId)// Provider-specific function removed。`,
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
      note: `已请求停止 ${shortId(targetId)// Provider-specific function removed，房间队列已暂停。`,
    // Provider-specific function removed;
  // Provider-specific function removed

  private recoverStaleProcessingMessages(roomId: string): void {
  ***REMOVED***this.queueProcessingRooms.has(roomId) || this.activeRunsByRoomId.has(roomId)) {
      return;
    // Provider-specific function removed

    const live = this.resolveEffectiveLiveSnapshot(roomId);
  ***REMOVED***live && (live.status === 'starting' || live.status === 'running')) {
      return;
    // Provider-specific function removed

    const queuedMessages = listChatroomPendingMessages(roomId, {
      limit: 24,
      statuses: ['pending', 'processing'],
    // Provider-specific function removed);
  ***REMOVED***queuedMessages.length === 0) {
      return;
    // Provider-specific function removed

    const staleLease = getChatroomRoomLease(roomId);
  ***REMOVED***staleLease) {
      releaseChatroomRoomLease({
        roomId,
        leaseToken: staleLease.leaseToken,
      // Provider-specific function removed);
    // Provider-specific function removed

    const staleProcessingMessages = listChatroomPendingMessages(roomId, {
      limit: 24,
      statuses: ['processing'],
    // Provider-specific function removed);
    for (const message of staleProcessingMessages) {
      releaseChatroomPendingMessage({
        pendingMessageId: message.pendingMessageId,
      // Provider-specific function removed);
    // Provider-specific function removed
  // Provider-specific function removed

  private resolveEffectiveLiveSnapshot(roomId: string) {
    const live = loadChatroomLiveSnapshot(roomId);
  ***REMOVED***!live) {
  ***REMOVED***
    // Provider-specific function removed

  ***REMOVED***
      (live.status === 'starting' || live.status === 'running') &&
      !this.isLiveSnapshotActive(roomId, live.executionRunId)
  ***REMOVED***
  ***REMOVED***
    // Provider-specific function removed

    return live;
  // Provider-specific function removed

  private isLiveSnapshotActive(roomId: string, executionRunId?: string***REMOVED***
  ***REMOVED***executionRunId) {
      const trackedRun = this.activeRunsByExecutionRunId.get(executionRunId);
    ***REMOVED***trackedRun?.roomId === roomId) {
        return true;
      // Provider-specific function removed
    // Provider-specific function removed

    const trackedRoomRun = this.activeRunsByRoomId.get(roomId);
  ***REMOVED***!trackedRoomRun) {
      return false;
    // Provider-specific function removed

    return (
      !executionRunId ||
      !trackedRoomRun.executionRunId ||
      trackedRoomRun.executionRunId === executionRunId
    );
  // Provider-specific function removed

  private findLatestResumableCheckpoint(
    roomId: string,
    options: {
      checkpointId?: string;
    // Provider-specific function removed = {// Provider-specific function removed,
***REMOVED***
    const checkpoints = this.checkpointStore.list('chatroom', {
      metadata: { roomId // Provider-specific function removed,
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
// Provider-specific function removed

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const runtimeMode = resolveCliRuntimeMode(args);
  const app = new ChatroomWebApp({
    runtimeMode,
  // Provider-specific function removed);
  const port = resolvePort(args);

  const server = createServer(async (request, response) => {
    try {
      await routeRequest(app, request, response);
    // Provider-specific function removed catch (error) {
      handleRequestError(app, request, response, error);
    // Provider-specific function removed
  // Provider-specific function removed);

  await new Promise<void>((resolvePromise) => {
    server.listen(port, '127.0.0.1', () => {
      resolvePromise();
    // Provider-specific function removed);
  // Provider-specific function removed);

  console.log(
    `Room Platform Web UI listening on http://127.0.0.1:${port// Provider-specific function removed (${runtimeMode// Provider-specific function removed)`,
  );
// Provider-specific function removed

async function routeRequest(
  app: ChatroomWebApp,
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> {
  const method = request.method ?? 'GET';
  const url = new URL(request.url ?? '/', 'http://127.0.0.1');
  const pathname = url.pathname;
  const pathParts = pathname.split('/').filter(Boolean).map((part) => decodeURIComponent(part));

***REMOVED***pathname === '/api/meta' && method === 'GET') {
    respondJson(response, 200, app.getMeta());
    return;
  // Provider-specific function removed

***REMOVED***pathname === '/api/interview-demo/session' && method === 'POST') {
    const body = await readJsonBody(request);
    respondJson(response, 200, await app.createInterviewDemoRoom(body));
    return;
  // Provider-specific function removed

***REMOVED***pathname === '/api/interview-demo/report' && method === 'GET') {
    const format = url.searchParams.get('format') === 'markdown' ? 'markdown' : 'json';
    const payload = app.getInterviewDemoAggregateReport(format);
  ***REMOVED***format === 'markdown') {
      respondBinary(
        response,
        200,
        payload as Buffer,
        'text/markdown; charset=utf-8',
      );
    // Provider-specific function removed else {
      respondJson(response, 200, payload);
    // Provider-specific function removed
    return;
  // Provider-specific function removed

if (pathname === '/api/rooms' && method === 'GET') {
    const limit = normalizePositiveInteger(url.searchParams.get('limit')) ?? 48;
    respondJson(response, 200, app.listRooms(limit));
    return;
  // Provider-specific function removed

***REMOVED***pathname === '/api/rooms' && method === 'POST') {
    const body = await readJsonBody(request);
    respondJson(response, 200, await app.createRoom(body));
    return;
  // Provider-specific function removed

  // RoleplayRoom API endpoints
***REMOVED***pathname === '/api/roleplay-rooms' && method === 'GET') {
    const roleplayService = new RoleplayRoomService();
    respondJson(response, 200, {
      generatedAt: new Date().toISOString(),
      rooms: roleplayService.listRooms(),
    // Provider-specific function removed);
    return;
  // Provider-specific function removed

***REMOVED***pathname === '/api/roleplay-rooms' && method === 'POST') {
    const body = await readJsonBody(request);
    const roleplayService = new RoleplayRoomService();
    const state = roleplayService.createRoom(body as any);
    respondJson(response, 200, {
      roomId: state.roomId,
      topic: state.topic,
      characterCount: state.characters.size,
      currentRound: state.currentRound,
    // Provider-specific function removed);
    return;
  // Provider-specific function removed

***REMOVED***pathParts[0] === 'api' && pathParts[1] === 'roleplay-rooms' && pathParts[2]) {
    const roomId = pathParts[2];
    const roleplayService = new RoleplayRoomService();

  ***REMOVED***pathParts.length === 3 && method === 'GET') {
      const state = roleplayService.getRoom(roomId);
    ***REMOVED***!state) {
        throw new HttpError(404, `Roleplay room "${roomId// Provider-specific function removed" was not found.`);
      // Provider-specific function removed
      respondJson(response, 200, {
        roomId: state.roomId,
        topic: state.topic,
        objective: state.objective,
        scene: state.scene,
        characters: Array.from(state.characters.values()).map(c => ({
          characterId: c.characterId,
          name: c.name,
          status: c.status,
          priority: c.priority,
          talkativeness: c.talkativeness,
          lastActiveRound: c.lastActiveRound,
          consecutiveSilentRounds: c.consecutiveSilentRounds,
        // Provider-specific function removed)),
        messages: state.messages.slice(-50),
        currentRound: state.currentRound,
        createdAt: state.createdAt,
        updatedAt: state.updatedAt,
      // Provider-specific function removed);
      return;
    // Provider-specific function removed

  ***REMOVED***pathParts.length === 3 && method === 'DELETE') {
      roleplayService.deleteRoom(roomId);
      respondJson(response, 200, { deleted: true, roomId // Provider-specific function removed);
      return;
    // Provider-specific function removed

  ***REMOVED***pathParts[3] === 'execute' && method === 'POST') {
      const body = await readJsonBody(request);
      const rounds = (body as any)?.rounds ?? 1;
      const result = await roleplayService.executeRoom({
        roomId,
        rounds,
        config: (body as any)?.config,
      // Provider-specific function removed);
      respondJson(response, 200, {
        roomId: result.state.roomId,
        currentRound: result.state.currentRound,
        messageCount: result.messageCount,
        duration: result.duration,
      // Provider-specific function removed);
      return;
    // Provider-specific function removed

  ***REMOVED***pathParts[3] === 'continue' && method === 'POST') {
      const body = await readJsonBody(request);
      const additionalRounds = (body as any)?.additionalRounds ?? 1;
      const result = await roleplayService.continueRoom(roomId, additionalRounds);
      respondJson(response, 200, {
        roomId: result.state.roomId,
        currentRound: result.state.currentRound,
        newMessageCount: result.newMessageCount,
        duration: result.duration,
      // Provider-specific function removed);
      return;
    // Provider-specific function removed

  ***REMOVED***pathParts[3] === 'characters' && pathParts[4] && method === 'POST') {
      const body = await readJsonBody(request);
      const characterId = pathParts[4];
      const action = (body as any)?.action;
      
    ***REMOVED***action === 'activate') {
        roleplayService.activateCharacter(roomId, characterId);
        respondJson(response, 200, { activated: true, characterId // Provider-specific function removed);
      // Provider-specific function removed else if (action === 'deactivate') {
        roleplayService.deactivateCharacter(roomId, characterId);
        respondJson(response, 200, { deactivated: true, characterId // Provider-specific function removed);
      // Provider-specific function removed else {
        throw new HttpError(400, `Unknown action: ${action// Provider-specific function removed`);
      // Provider-specific function removed
      return;
    // Provider-specific function removed

  ***REMOVED***pathParts[3] === 'messages' && method === 'GET') {
      const limit = normalizePositiveInteger(url.searchParams.get('limit')) ?? 50;
      const messages = roleplayService.getMessages(roomId, limit);
      respondJson(response, 200, {
        roomId,
        messages,
        count: messages.length,
      // Provider-specific function removed);
      return;
    // Provider-specific function removed
  // Provider-specific function removed

***REMOVED***pathParts[0] === 'api' && pathParts[1] === 'rooms' && pathParts[2]) {
    const roomId = pathParts[2];

  ***REMOVED***pathParts.length === 3 && method === 'GET') {
      respondJson(response, 200, app.getRoom(roomId));
      return;
    // Provider-specific function removed

  ***REMOVED***pathParts[3] === 'stream' && pathParts.length === 4 && method === 'GET') {
      await app.streamRoom(roomId, request, response);
      return;
    // Provider-specific function removed

  ***REMOVED***pathParts[3] === 'scenario-report' && method === 'GET') {
      const format = url.searchParams.get('format') === 'markdown' ? 'markdown' : 'json';
      const payload = app.getScenarioReportContent(roomId, format);
    ***REMOVED***format === 'markdown') {
        respondBinary(
          response,
          200,
          payload as Buffer,
          'text/markdown; charset=utf-8',
        );
      // Provider-specific function removed else {
        respondJson(response, 200, payload);
      // Provider-specific function removed
      return;
    // Provider-specific function removed

  ***REMOVED***pathParts.length === 3 && method === 'DELETE') {
      respondJson(response, 200, await app.deleteRoom(roomId));
      return;
    // Provider-specific function removed

  ***REMOVED***pathParts[3] === 'messages' && method === 'POST') {
      const body = await readJsonBody(request);
      respondJson(response, 200, await app.enqueueRoomMessage(roomId, body));
      return;
    // Provider-specific function removed

  ***REMOVED***pathParts[3] === 'queue' && method === 'POST') {
      const body = await readJsonBody(request);
      respondJson(response, 200, await app.setRoomQueuePaused(roomId, body));
      return;
    // Provider-specific function removed

  ***REMOVED***pathParts[3] === 'stop' && method === 'POST') {
      const body = await readJsonBody(request);
      respondJson(response, 200, await app.stopRoomRun(roomId, body));
      return;
    // Provider-specific function removed

  ***REMOVED***pathParts[3] === 'pending' && pathParts[4] === 'clear' && method === 'POST') {
      const body = await readJsonBody(request);
      respondJson(response, 200, await app.clearRoomPendingMessages(roomId, body));
      return;
    // Provider-specific function removed

  ***REMOVED***pathParts[3] === 'resume-checkpoint' && method === 'POST') {
      const body = await readJsonBody(request);
      respondJson(response, 200, await app.resumeRoomCheckpoint(roomId, body));
      return;
    // Provider-specific function removed

  ***REMOVED***pathParts[3] === 'clone' && method === 'POST') {
      respondJson(response, 200, app.cloneRoom(roomId));
      return;
    // Provider-specific function removed
  // Provider-specific function removed

***REMOVED***method === 'GET') {
    serveStaticAsset(pathname, response);
    return;
  // Provider-specific function removed

  throw new HttpError(404, `Unknown route: ${method// Provider-specific function removed ${pathname// Provider-specific function removed`);
// Provider-specific function removed

function serveStaticAsset(pathname: string, response: ServerResponse): void {
  const relativePath = pathname === '/' ? '/main.html' : pathname;
  const resolvedPath = resolve(STATIC_DIRECTORY, `.${relativePath// Provider-specific function removed`);

***REMOVED***!resolvedPath.startsWith(STATIC_DIRECTORY)) {
    throw new HttpError(403, 'Forbidden path.');
  // Provider-specific function removed

  try {
    const content = readFileSync(resolvedPath);
    respondBinary(response, 200, content, resolveContentType(resolvedPath));
  // Provider-specific function removed catch {
  ***REMOVED***pathname !== '/' && pathname !== '/main.html') {
      const indexPath = resolve(STATIC_DIRECTORY, 'main.html');
      const content = readFileSync(indexPath);
      respondBinary(response, 200, content, 'text/html; charset=utf-8');
      return;
    // Provider-specific function removed
    throw new HttpError(404, `Static asset "${relativePath// Provider-specific function removed" was not found.`);
  // Provider-specific function removed
// Provider-specific function removed

async function readJsonBody(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  let totalBytes = 0;

  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    totalBytes += buffer.byteLength;
  ***REMOVED***totalBytes > JSON_BODY_LIMIT_BYTES) {
      throw new HttpError(413, 'Request body is too large.');
    // Provider-specific function removed
    chunks.push(buffer);
  // Provider-specific function removed

***REMOVED***chunks.length === 0) {
    return {// Provider-specific function removed;
  // Provider-specific function removed

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown;
  // Provider-specific function removed catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new HttpError(400, `Invalid JSON body: ${message// Provider-specific function removed`);
  // Provider-specific function removed
// Provider-specific function removed

function parseJsonFile(filePath: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(readFileSync(filePath, 'utf8')) as unknown;
    return asRecord(parsed);
  // Provider-specific function removed catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new HttpError(500, `Failed to read JSON file ${filePath// Provider-specific function removed: ${message// Provider-specific function removed`);
  // Provider-specific function removed
// Provider-specific function removed

function buildMarkdownPreview(markdown: string, limit = 1400): string {
  const normalized = markdown.trim();
***REMOVED***!normalized) {
    return '';
  // Provider-specific function removed

  return normalized.length <= limit
    ? normalized
    : `${normalized.slice(0, Math.max(0, limit - 3))// Provider-specific function removed...`;
// Provider-specific function removed

function respondJson(response: ServerResponse, statusCode: number, payload: unknown): void {
  const body = `${JSON.stringify(payload, null, 2)// Provider-specific function removed\n`;
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  // Provider-specific function removed);
  response.end(body);
// Provider-specific function removed

function respondBinary(
  response: ServerResponse,
  statusCode: number,
  payload: Buffer,
  contentType: string,
): void {
  response.writeHead(statusCode, {
    'Content-Type': contentType,
    'Cache-Control': 'no-store',
  // Provider-specific function removed);
  response.end(payload);
// Provider-specific function removed

function handleRequestError(
  app: ChatroomWebApp,
  request: IncomingMessage,
  response: ServerResponse,
  error: unknown,
): void {
  const statusCode = error instanceof HttpError ? error.statusCode : 500;
  const message = app.formatErrorMessage(error);
  const payload = {
    error: message,
    method: request.method ?? 'GET',
    path: request.url ?? '/',
  // Provider-specific function removed;

***REMOVED***(request.url ?? '').startsWith('/api/')) {
    respondJson(response, statusCode, payload);
    return;
  // Provider-specific function removed

  response.writeHead(statusCode, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store',
  // Provider-specific function removed);
  response.end(`${message// Provider-specific function removed\n`);
// Provider-specific function removed

function resolveContentType(filePath: string): string {
  switch (extname(filePath).toLowerCase()) {
    case '.html':
      return 'text/html; charset=utf-8';
    case '.css':
      return 'text/css; charset=utf-8';
    case '.js':
      return 'application/javascript; charset=utf-8';
    case '.json':
      return 'application/json; charset=utf-8';
    case '.svg':
      return 'image/svg+xml';
    default:
      return 'application/octet-stream';
  // Provider-specific function removed
// Provider-specific function removed

function resolvePort(args: readonly string[]): number {
  const fromEnv = normalizePositiveInteger(process.env.PORT);
***REMOVED***fromEnv) {
    return fromEnv;
  // Provider-specific function removed

  for (const arg of args) {
  ***REMOVED***arg.startsWith('--port=')) {
      return normalizePositiveInteger(arg.slice('--port='.length)) ?? DEFAULT_PORT;
    // Provider-specific function removed
  // Provider-specific function removed

  return DEFAULT_PORT;
// Provider-specific function removed

function resolveCliRuntimeMode(args: readonly string[]): RoomRuntimeMode {
  const fromEnv = process.env.CHATROOM_RUNTIME_MODE ?? process.env.ROOM_RUNTIME_MODE;
***REMOVED***fromEnv) {
    return resolveRoomRuntimeMode(fromEnv);
  // Provider-specific function removed

  for (const arg of args) {
  ***REMOVED***arg.startsWith('--runtime-mode=')) {
      return resolveRoomRuntimeMode(arg.slice('--runtime-mode='.length));
    // Provider-specific function removed
  ***REMOVED***arg.startsWith('--runtime=')) {
      return resolveRoomRuntimeMode(arg.slice('--runtime='.length));
    // Provider-specific function removed
  // Provider-specific function removed

  return DEFAULT_ROOM_RUNTIME_MODE;
// Provider-specific function removed

function resolveRoomStatus(args: {
  live: ReturnType<typeof loadChatroomLiveSnapshot>;
  latestRunStatus?: 'completed' | 'failed' | 'cancelled';
  queuePaused: boolean;
// Provider-specific function removed): string {
***REMOVED***args.live?.status === 'starting' || args.live?.status === 'running') {
    return args.live.status;
  // Provider-specific function removed
***REMOVED***args.queuePaused) {
    return 'paused';
  // Provider-specific function removed
***REMOVED***args.live?.status) {
    return args.live.status;
  // Provider-specific function removed
  return args.latestRunStatus ?? 'idle';
// Provider-specific function removed

function resolveRoomUpdatedAt(
  roomUpdatedAt: string,
  liveUpdatedAt?: string,
  latestRunEndedAt?: string,
): string {
***REMOVED***roomUpdatedAt, liveUpdatedAt, latestRunEndedAt]
    .filter((value): value is string => Boolean(value))
    .sort((left, right) => Date.parse(right) - Date.parse(left))[0] ?? roomUpdatedAt;
// Provider-specific function removed

function shouldPreferLiveSnapshot(
  lastExecutionRunId: string | undefined,
  live: ReturnType<typeof loadChatroomLiveSnapshot>,
***REMOVED***
***REMOVED***!live) {
    return false;
  // Provider-specific function removed
***REMOVED***live.status === 'starting' || live.status === 'running') {
    return true;
  // Provider-specific function removed
  return live.executionRunId !== lastExecutionRunId;
// Provider-specific function removed

function parsePlatformAdminConversation(
  input: unknown,
): PlatformAdminConversationState | undefined {
***REMOVED***!input || typeof input !== 'object' || Array.isArray(input)) {
    return undefined;
  // Provider-specific function removed

  const candidate = input as PlatformAdminConversationState;
  return candidate.version === 1 ? candidate : undefined;
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

function assertRoomExists(roomId: string): void {
***REMOVED***!getChatroomRoomRecord(roomId)) {
    throw new HttpError(404, `Room "${roomId// Provider-specific function removed" was not found.`);
  // Provider-specific function removed
// Provider-specific function removed

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {// Provider-specific function removed;
// Provider-specific function removed

function normalizeString(value: unknown): string | undefined {
***REMOVED***typeof value !== 'string') {
    return undefined;
  // Provider-specific function removed

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
// Provider-specific function removed

function normalizePositiveInteger(value: unknown): number | undefined {
***REMOVED***typeof value === 'number' && Number.isInteger(value) && value > 0) {
    return value;
  // Provider-specific function removed
***REMOVED***typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number.parseInt(value, 10);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
  // Provider-specific function removed

  return undefined;
// Provider-specific function removed

function normalizeStringList(value: unknown): string[] {
  const source =
    typeof value === 'string'
      ? value.split(/[,\n|;\uFF0C\uFF1B\u3001]/g)
      : Array.isArray(value)
        ? value
        : [];
  const unique = new Set<string>();
  for (const entry of source) {
  ***REMOVED***typeof entry !== 'string') {
      continue;
    // Provider-specific function removed
    const normalized = entry.trim();
  ***REMOVED***normalized.length > 0) {
      unique.add(normalized);
    // Provider-specific function removed
  // Provider-specific function removed
***REMOVED***...unique];
// Provider-specific function removed

function parseRoleplayCharacterCards(value: unknown): RoleplayCharacterCard[] {
***REMOVED***!Array.isArray(value)) {
  ***REMOVED***];
  // Provider-specific function removed

  const characters: RoleplayCharacterCard[] = [];
  for (const item of value) {
    const record = asRecord(item);
    const name = normalizeString(record.name);
  ***REMOVED***!name) {
      continue;
    // Provider-specific function removed

    characters.push({
      characterId: normalizeString(record.characterId),
      name,
      instruction: normalizeString(record.instruction) ?? '',
      publicDescription: normalizeString(record.publicDescription),
      privateNotes: normalizeStringList(record.privateNotes),
      relationships: parseRoleplayRelationshipCards(record.relationships),
      initialGoal: normalizeString(record.initialGoal),
    // Provider-specific function removed);
  // Provider-specific function removed

  return characters;
// Provider-specific function removed

function parseRoleplayRelationshipCards(
  value: unknown,
): NonNullable<RoleplayCharacterCard['relationships']> {
***REMOVED***!Array.isArray(value)) {
  ***REMOVED***];
  // Provider-specific function removed

  const relationships: NonNullable<RoleplayCharacterCard['relationships']> = [];
  for (const item of value) {
    const record = asRecord(item);
    const summary = normalizeString(record.summary);
  ***REMOVED***!summary) {
      continue;
    // Provider-specific function removed

    relationships.push({
      targetCharacterId: normalizeString(record.targetCharacterId),
      targetName: normalizeString(record.targetName),
      summary,
      score: normalizeRelationshipScore(record.score),
    // Provider-specific function removed);
  // Provider-specific function removed

  return relationships;
// Provider-specific function removed

function parseRoleplayUserMode(value: unknown): 'actor' | 'observer' | undefined {
  return value === 'actor' || value === 'observer' ? value : undefined;
// Provider-specific function removed

function normalizeRelationshipScore(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.min(3, Math.max(-3, Math.round(value)))
    : undefined;
// Provider-specific function removed

function shortId(value?: string): string {
***REMOVED***!value) {
    return '-';
  // Provider-specific function removed

  return value.length > 12 ? value.slice(0, 12) : value;
// Provider-specific function removed

main().catch((error) => {
  const message = error instanceof Error ? error.stack ?? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
// Provider-specific function removed);
