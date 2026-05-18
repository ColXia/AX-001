import { mkdirSync, readFileSync, writeFileSync // Provider-specific function removed from 'node:fs';
import { resolve // Provider-specific function removed from 'node:path';
import readline from 'node:readline';

import { ExecutionAbortedError // Provider-specific function removed from '../core/execution-control.js';
import { resolveChatroomSpeakerProfiles // Provider-specific function removed from '../agents/chatroom-profiles.js';
import type { ChatroomFinalSummary // Provider-specific function removed from '../agents/schemas.js';
import type {
  WorkflowObserver,
  WorkflowStepCompletedObserverEvent,
  WorkflowStepObserverEvent,
  WorkflowTraceRecord,
// Provider-specific function removed from '../core/workflow.js';
import {
  listChatroomAgentTurns,
// Provider-specific function removed from '../room-storage/agent-thread-repository.js';
import {
  listChatroomExecutionRuns,
  type ChatroomExecutionRunRecord,
// Provider-specific function removed from '../room-storage/execution-run-repository.js';
import {
  listChatroomPendingMessages,
  type ChatroomPendingMessageRecord,
// Provider-specific function removed from '../room-storage/queue-repository.js';
import {
  getChatroomRoomRecord,
  listChatroomRooms,
  loadChatroomRoomState,
  type ChatroomRoomListItem,
  type ChatroomRoomRecord,
// Provider-specific function removed from '../room-storage/room-repository.js';
import {
  loadChatroomLiveSnapshot,
  type ChatroomLiveSnapshot,
// Provider-specific function removed from '../workflows/chatroom-live.js';
import { loadChatroomQueuePauseState // Provider-specific function removed from '../workflows/chatroom-run-control.js';
import {
  DEFAULT_CHATROOM_ROOM_TYPE,
  getChatroomRoomTypeLabel,
  getChatroomRoomTypeShortLabel,
  listChatroomRoomTypes,
  type ChatroomRoomTypeId,
  resolveChatroomRoomType,
// Provider-specific function removed from '../workflows/chatroom-room-types.js';
import type { RoleplaySceneState // Provider-specific function removed from '../workflows/chatroom-roleplay-state.js';
import type { ChatroomState // Provider-specific function removed from '../workflows/chatroom-discussion.js';
import type { ChatroomMessage // Provider-specific function removed from '../workflows/chatroom-types.js';
import { formatRoomBlueprintGovernanceSummary // Provider-specific function removed from '../room-scenarios/room-blueprints.js';
import type { PlatformAdminConversationState // Provider-specific function removed from '../room-app/room-platform-admin.js';
import {
  aggregateStructuredOutputRecoveryStats,
  type RunStructuredOutputRecoveryStats,
// Provider-specific function removed from './chatroom-session-metrics.js';
import {
  INTERVIEW_SCORE_TEMPLATE_IDS,
  resolveInterviewScoreTemplateById,
// Provider-specific function removed from '../workflows/interview-score-templates.js';

type ScreenStatus = 'idle' | 'starting' | 'running' | 'completed' | 'failed' | 'cancelled';
type ScreenMode = 'browser' | 'room';
type BrowserFilterMode = 'active' | 'all' | 'archived' | 'hidden' | 'live';
type BrowserRoomTypeFilter = 'all' | ChatroomRoomTypeId;
type BrowserSortMode = 'updated' | 'created' | 'messages' | 'runs' | 'topic';
type BrowserCreateMode = 'manual' | 'admin';
type BrowserCreateField =
  | 'mode'
  | 'topic'
  | 'objective'
  | 'roomType'
  | 'speakers'
  | 'scoreTemplateId'
  | 'scoreDimensions'
  | 'adminRequest';

interface RoomFilterOption {
  authorId?: string;
  label: string;
  count: number;
// Provider-specific function removed

interface RoomBrowserEntry {
  room: ChatroomRoomListItem;
  live: ChatroomLiveSnapshot | null;
  latestRun: ChatroomExecutionRunRecord | null;
  latestRunRecoveryStats: RunStructuredOutputRecoveryStats;
  queuePaused: boolean;
  queuePauseReason?: string;
  queuePauseAt?: string;
// Provider-specific function removed

export interface ChatroomResumableCheckpointSummary {
  checkpointId: string;
  status: 'failed' | 'cancelled';
  updatedAt: string;
  currentStepId?: string;
// Provider-specific function removed

interface AgentStatusEntry {
  authorId: string;
  authorName: string;
  badge: string;
  role: ChatroomMessage['role'];
  messageCount: number;
  lastRound: number;
  lastAt?: string;
  statusLabel: string;
  isActive: boolean;
  isFiltered: boolean;
// Provider-specific function removed

interface ChatroomScreenModel {
  screenMode: ScreenMode;
  status: ScreenStatus;
  modeLabel: string;
  roomId?: string;
  executionRunId?: string;
  resumedFromRunId?: string;
  topic?: string;
  objective?: string;
  constraints: string[];
  messages: ChatroomMessage[];
  trace: WorkflowTraceRecord[];
  runs: ChatroomExecutionRunRecord[];
  pendingMessages: ChatroomPendingMessageRecord[];
  queuePaused: boolean;
  queuePauseReason?: string;
  queuePauseAt?: string;
  roomRecord?: ChatroomRoomRecord | null;
  roleplayScene?: RoleplaySceneState;
  finalSummary?: ChatroomFinalSummary;
  currentStepId?: string;
  currentAgentIds?: string[];
  note?: string;
  error?: string;
  updatedAt?: string;
  startedAt: string;
  completedAt?: string;
  scrollTop: number;
  autoScroll: boolean;
  filterAuthorId?: string;
  selectedRecentTurnIndex: number;
  recentTurnDetailOpen: boolean;
  recentTurnDetailScrollTop: number;
  composerFocused: boolean;
  draftMessage: string;
  submittingMessage: boolean;
  browserRooms: RoomBrowserEntry[];
  browserSelectedIndex: number;
  browserReadUpdatedAtByRoomId: Record<string, string>;
  browserUnreadRoomIds: string[];
  browserArchivedRoomIds: string[];
  browserHiddenRoomIds: string[];
  browserMarkedRoomIds: string[];
  browserHideTestRooms: boolean;
  browserFilterMode: BrowserFilterMode;
  browserRoomTypeFilter: BrowserRoomTypeFilter;
  browserSortMode: BrowserSortMode;
  browserSearchActive: boolean;
  browserSearchQuery: string;
  browserPendingDeleteRoomId?: string;
  browserActionNote?: string;
  browserActionError?: string;
  browserSelectedCheckpoint?: ChatroomResumableCheckpointSummary | null;
  browserCreateActive: boolean;
  browserCreateSubmitting: boolean;
  browserCreateMode: BrowserCreateMode;
  browserCreateField: BrowserCreateField;
  browserCreateTopic: string;
  browserCreateObjective: string;
  browserCreateRoomType: ChatroomRoomTypeId;
  browserCreateSpeakers: string;
  browserCreateScoreTemplateId: string;
  browserCreateScoreDimensions: string;
  browserCreateAdminRequest: string;
  browserCreateAdminConversation?: PlatformAdminConversationState;
  browserCreateAdminAssistantMessage?: string;
  browserCreateAdminFollowUpQuestions: string[];
  browserCreateAdminTentativeScenarioTemplateId?: string;
  browserCreateError?: string;
  browserCreateNote?: string;
// Provider-specific function removed

interface RecentTurnStatusEntry {
  profileId: string;
  displayName: string;
  stepId: string;
  branchId?: string;
  status: 'completed' | 'failed' | 'cancelled';
  startedAt?: string;
  endedAt?: string;
  inputPreview?: string;
  usage?: Record<string, unknown>;
  telemetry?: Record<string, unknown>;
  error?: string;
  output?: unknown;
// Provider-specific function removed

interface BrowserStateRecord {
  readUpdatedAtByRoomId: Record<string, string>;
  archivedRoomIds: string[];
  hiddenRoomIds: string[];
  hideTestRooms: boolean;
  filterMode: BrowserFilterMode;
  roomTypeFilter: BrowserRoomTypeFilter;
  sortMode: BrowserSortMode;
// Provider-specific function removed

interface TranscriptMessageAttention {
  isHuman: boolean;
  isFromYou: boolean;
  isLatestHuman: boolean;
  isReplyToLatestHuman: boolean;
  isDirectMention: boolean;
// Provider-specific function removed

interface TranscriptAttentionContext {
  latestHumanIndex: number;
  latestHumanMessage?: ChatroomMessage;
  mentionTokens: string[];
// Provider-specific function removed

interface RoomAttentionSnapshot {
  latestHumanMessage?: ChatroomMessage;
  repliesSinceLatestHuman: number;
  directMentionsSinceLatestHuman: number;
  latestReplyMessage?: ChatroomMessage;
  latestMentionMessage?: ChatroomMessage;
  pendingHumanMessageCount: number;
  pendingHumanAuthors: string[];
// Provider-specific function removed

export interface ChatroomTuiOptions {
  snapshot?: boolean;
  refreshMs?: number;
  plain?: boolean;
  defaultSpeakerCount?: number;
  defaultRoomType?: ChatroomRoomTypeId;
  submitMessage?: (args: {
    roomId: string;
    authorName: string;
    message: string;
  // Provider-specific function removed) => Promise<{
    note?: string;
  // Provider-specific function removed>;
  createRoom?: (args:
    | {
        mode: 'manual';
        topic: string;
        objective: string;
        roomType: ChatroomRoomTypeId;
        speakerCount: number;
        scoreTemplateId?: string;
        scoreDimensions?: string[];
      // Provider-specific function removed
    | {
        mode: 'admin';
        adminRequest: string;
        adminConversation?: PlatformAdminConversationState;
      // Provider-specific function removed) => Promise<{
    status: 'created' | 'needs_clarification';
    roomId?: string;
    note?: string;
    conversation?: PlatformAdminConversationState;
    assistantMessage?: string;
    followUpQuestions?: string[];
    tentativeScenarioTemplateId?: string;
  // Provider-specific function removed>;
  deleteRoom?: (roomId: string) => Promise<{
    note?: string;
  // Provider-specific function removed>;
  stopRun?: (args: {
    roomId: string;
    executionRunId?: string;
  // Provider-specific function removed) => Promise<{
    stopped: boolean;
    note?: string;
  // Provider-specific function removed>;
  setQueuePaused?: (args: {
    roomId: string;
    paused: boolean;
  // Provider-specific function removed) => Promise<{
    paused: boolean;
    note?: string;
  // Provider-specific function removed>;
  getLatestResumableCheckpoint?: (
    roomId: string,
  ) => ChatroomResumableCheckpointSummary | null;
  resumeCheckpoint?: (args: {
    roomId: string;
    checkpointId?: string;
  // Provider-specific function removed) => Promise<{
    checkpointId: string;
    note?: string;
  // Provider-specific function removed>;
// Provider-specific function removed

export interface ChatroomRoomSnapshot {
  room: ChatroomRoomRecord | null;
  state: ChatroomState | null;
  runs: ChatroomExecutionRunRecord[];
  live: ChatroomLiveSnapshot | null;
// Provider-specific function removed

export class ChatroomTui {
  private readonly interactive: boolean;
  private readonly snapshotMode: boolean;
  private readonly plainMode: boolean;
  private readonly refreshMs: number;
  private readonly defaultSpeakerCount: number;
  private readonly defaultRoomType: ChatroomRoomTypeId;
  private readonly submitMessage?: ChatroomTuiOptions['submitMessage'];
  private readonly createRoom?: ChatroomTuiOptions['createRoom'];
  private readonly deleteRoom?: ChatroomTuiOptions['deleteRoom'];
  private readonly stopRun?: ChatroomTuiOptions['stopRun'];
  private readonly setQueuePaused?: ChatroomTuiOptions['setQueuePaused'];
  private readonly getLatestResumableCheckpoint?: ChatroomTuiOptions['getLatestResumableCheckpoint'];
  private readonly resumeCheckpoint?: ChatroomTuiOptions['resumeCheckpoint'];
  private readonly model: ChatroomScreenModel;
  private pollTimer?: NodeJS.Timeout;
  private plainReadline?: readline.Interface;
  private closed = false;
  private lastRenderOutput = '';
  private lastRenderLines: string[] = [];
  private lastRenderWidth = 0;
  private lastRenderHeight = 0;
  private plainRoomId?: string;
  private plainPrintedMessageIds = new Set<string>();
  private plainLastStatusKey = '';
  private plainLastNote?: string;
  private plainLastError?: string;
  private plainDidPrintWelcome = false;
  private plainLastMessageAt?: string;
  private resolveClosed?: () => void;
  private readonly closedPromise: Promise<void>;
  private readonly boundCleanup = () => this.close();
  private readonly boundResize = () => this.render();
  private readonly boundSigint = () => this.close();
  private readonly boundPlainLine = (line: string) => {
    void this.handlePlainLine(line);
  // Provider-specific function removed;
  private readonly boundKeypress = (input: string, key: readline.Key) => {
  ***REMOVED***key.ctrl && key.name === 'c') {
      this.close();
      return;
    // Provider-specific function removed

  ***REMOVED***key.name === 'q' && !this.shouldTreatInputAsComposerText(input, key)) {
      this.close();
      return;
    // Provider-specific function removed

  ***REMOVED***this.model.screenMode === 'browser') {
      this.handleBrowserKeypress(input, key);
      return;
    // Provider-specific function removed

    this.handleRoomKeypress(input, key);
  // Provider-specific function removed;

  constructor(options: ChatroomTuiOptions = {// Provider-specific function removed) {
    const browserState = loadBrowserState();
    this.refreshMs = Math.max(200, options.refreshMs ?? 300);
    this.interactive = !options.snapshot && Boolean(process.stdout.isTTY && process.stdin.isTTY);
    this.snapshotMode = !this.interactive;
    this.plainMode = this.interactive && Boolean(options.plain);
    this.defaultSpeakerCount = clamp(options.defaultSpeakerCount ?? 12, 1, 18);
    this.defaultRoomType = options.defaultRoomType ?? DEFAULT_CHATROOM_ROOM_TYPE;
    this.submitMessage = options.submitMessage;
    this.createRoom = options.createRoom;
    this.deleteRoom = options.deleteRoom;
    this.stopRun = options.stopRun;
    this.setQueuePaused = options.setQueuePaused;
    this.getLatestResumableCheckpoint = options.getLatestResumableCheckpoint;
    this.resumeCheckpoint = options.resumeCheckpoint;
    this.model = {
      screenMode: 'browser',
      status: 'idle',
      modeLabel: 'Room browser',
      constraints: [],
      messages: [],
      trace: [],
      runs: [],
      pendingMessages: [],
      queuePaused: false,
      startedAt: new Date().toISOString(),
      scrollTop: 0,
      autoScroll: true,
      selectedRecentTurnIndex: 0,
      recentTurnDetailOpen: false,
      recentTurnDetailScrollTop: 0,
      composerFocused: false,
      draftMessage: '',
      submittingMessage: false,
      browserRooms: [],
      browserSelectedIndex: 0,
      browserReadUpdatedAtByRoomId: browserState.readUpdatedAtByRoomId,
      browserUnreadRoomIds: [],
      browserArchivedRoomIds: browserState.archivedRoomIds,
      browserHiddenRoomIds: browserState.hiddenRoomIds,
      browserMarkedRoomIds: [],
      browserHideTestRooms: browserState.hideTestRooms,
      browserFilterMode: browserState.filterMode,
      browserRoomTypeFilter: browserState.roomTypeFilter,
      browserSortMode: browserState.sortMode,
      browserSearchActive: false,
      browserSearchQuery: '',
      browserSelectedCheckpoint: null,
      browserCreateActive: false,
      browserCreateSubmitting: false,
      browserCreateMode: 'manual',
      browserCreateField: 'topic',
      browserCreateTopic: '',
      browserCreateObjective: '',
      browserCreateRoomType: this.defaultRoomType,
      browserCreateSpeakers: String(
        resolveCreateRoomTypeSpec(this.defaultRoomType).recommendedSpeakerCount,
      ),
      browserCreateScoreTemplateId: '',
      browserCreateScoreDimensions: '',
      browserCreateAdminRequest: '',
      browserCreateAdminConversation: undefined,
      browserCreateAdminAssistantMessage: undefined,
      browserCreateAdminFollowUpQuestions: [],
      browserCreateAdminTentativeScenarioTemplateId: undefined,
    // Provider-specific function removed;
    this.closedPromise = new Promise<void>((resolve) => {
      this.resolveClosed = resolve;
    // Provider-specific function removed);

  ***REMOVED***this.plainMode) {
      this.enterPlainMode();
    // Provider-specific function removed else if (this.interactive) {
      this.enterInteractiveMode();
    // Provider-specific function removed

    this.render();
  // Provider-specific function removed

  createWorkflowObserver(): WorkflowObserver<ChatroomState> {
    return {
      onRunStarted: (event) => {
        this.model.screenMode = 'room';
        this.model.status = 'starting';
        this.model.modeLabel = 'Live workflow';
        this.model.executionRunId = event.runId;
        this.model.topic = event.state.topic;
        this.model.objective = event.state.objective;
        this.model.constraints = [...event.state.constraints];
        this.model.messages = [...event.state.messages];
        this.model.roleplayScene = event.state.roleplayScene;
        this.model.trace = [...event.trace];
        this.model.finalSummary = event.state.finalSummary;
        this.model.updatedAt = event.observedAt;
        this.model.startedAt = event.observedAt;
        this.ensureValidFilter();
        this.syncRecentTurnSelection();
        this.render();
      // Provider-specific function removed,
      onStepStarted: (event) => this.applyStepStarted(event),
      onStepCompleted: (event) => this.applyStepCompleted(event),
      onRunCompleted: (event) => {
        this.model.screenMode = 'room';
        this.model.status = 'completed';
        this.model.messages = [...event.state.messages];
        this.model.roleplayScene = event.state.roleplayScene;
        this.model.trace = [...event.trace];
        this.model.finalSummary = event.state.finalSummary;
        this.model.updatedAt = event.observedAt;
        this.model.completedAt = event.observedAt;
        this.model.currentStepId = undefined;
        this.model.currentAgentIds = undefined;
        this.ensureValidFilter();
        this.syncRecentTurnSelection();
        this.render();
      // Provider-specific function removed,
      onRunFailed: (event) => {
        const cancelError =
          event.error instanceof ExecutionAbortedError ? event.error : undefined;
        const cancelled = Boolean(cancelError);
        this.model.screenMode = 'room';
        this.model.status = cancelled ? 'cancelled' : 'failed';
        this.model.messages = [...event.state.messages];
        this.model.roleplayScene = event.state.roleplayScene;
        this.model.trace = [...event.trace];
        this.model.updatedAt = event.observedAt;
        this.model.completedAt = event.observedAt;
        this.model.currentStepId = undefined;
        this.model.currentAgentIds = undefined;
        this.model.note = cancelError?.message ?? this.model.note;
        this.model.error = cancelled ? undefined : formatError(event.error);
        this.ensureValidFilter();
        this.syncRecentTurnSelection();
        this.render();
      // Provider-specific function removed,
    // Provider-specific function removed;
  // Provider-specific function removed

  isInteractive(***REMOVED***
    return this.interactive;
  // Provider-specific function removed

  getCurrentRoomId(): string | undefined {
    return this.model.screenMode === 'room' ? this.model.roomId : undefined;
  // Provider-specific function removed

  private shouldTreatInputAsComposerText(_input: string, _key: readline.Key***REMOVED***
    return (
      (this.model.screenMode === 'room' && this.model.composerFocused) ||
      (this.model.screenMode === 'browser' &&
        (this.model.browserCreateActive || this.model.browserSearchActive))
    );
  // Provider-specific function removed

  flushSnapshot(): void {
  ***REMOVED***!this.snapshotMode || this.lastRenderOutput.length === 0) {
      return;
    // Provider-specific function removed

    process.stdout.write(`${this.lastRenderOutput// Provider-specific function removed\n`);
  // Provider-specific function removed

  async attachRoomBrowser(refreshMs = 1_000): Promise<void> {
    this.clearPolling();
    this.model.screenMode = 'browser';
    this.model.modeLabel = 'Room browser';
    this.model.status = 'idle';
    this.model.roomId = undefined;
    this.model.executionRunId = undefined;
    this.model.resumedFromRunId = undefined;
    this.model.currentStepId = undefined;
    this.model.currentAgentIds = undefined;
    this.model.note = undefined;
    this.model.error = undefined;
    this.model.pendingMessages = [];
    this.model.queuePaused = false;
    this.model.queuePauseReason = undefined;
    this.model.queuePauseAt = undefined;
    this.model.roleplayScene = undefined;
    this.model.filterAuthorId = undefined;
    this.model.autoScroll = true;
    this.model.scrollTop = 0;
    this.model.selectedRecentTurnIndex = 0;
    this.model.recentTurnDetailOpen = false;
    this.model.recentTurnDetailScrollTop = 0;
    this.model.composerFocused = false;
    this.model.draftMessage = '';
    this.model.submittingMessage = false;
    this.model.browserSearchActive = false;
    this.model.browserSearchQuery = '';
    this.model.browserActionNote = undefined;
    this.model.browserActionError = undefined;
    this.model.browserSelectedCheckpoint = null;
    this.model.browserPendingDeleteRoomId = undefined;
    this.model.browserCreateActive = false;
    this.model.browserCreateSubmitting = false;
    this.model.browserCreateError = undefined;
    await this.refreshRoomBrowser();

  ***REMOVED***this.interactive) {
      this.startPolling(async () => {
        await this.refreshRoomBrowser();
      // Provider-specific function removed, refreshMs);
    // Provider-specific function removed
  // Provider-specific function removed

  async attachRoomWatcher(
    roomId: string,
    refreshMs = 1_000,
    options: {
      modeLabel?: string;
    // Provider-specific function removed = {// Provider-specific function removed,
  ): Promise<void> {
    this.clearPolling();
    this.model.screenMode = 'room';
    this.model.modeLabel = options.modeLabel ?? 'Room watcher';
  ***REMOVED***this.model.roomId !== roomId) {
      this.model.draftMessage = '';
      this.model.selectedRecentTurnIndex = 0;
      this.model.recentTurnDetailOpen = false;
      this.model.recentTurnDetailScrollTop = 0;
    // Provider-specific function removed
    this.model.composerFocused = false;
    this.model.submittingMessage = false;
    this.model.roomId = roomId;
    this.markBrowserRoomRead(roomId);
    await this.refreshFromRoom(roomId);

  ***REMOVED***this.interactive) {
      this.startPolling(async () => {
        await this.refreshFromRoom(roomId);
      // Provider-specific function removed, refreshMs);
    // Provider-specific function removed
  // Provider-specific function removed

  async refreshFromRoom(roomId: string): Promise<void> {
    const snapshot = loadChatroomRoomSnapshot(roomId);
    const preferredState = getPreferredRoomState(snapshot);
    const preferredTrace = getPreferredTrace(snapshot);
    const latestUpdatedAt = resolveRoomSnapshotUpdatedAt(snapshot) ?? new Date().toISOString();

    this.model.screenMode = 'room';
    this.model.roomId = roomId;
    this.model.roomRecord = snapshot.room;
    this.model.runs = snapshot.runs;
    this.model.pendingMessages = listChatroomPendingMessages(roomId, {
      limit: 5,
      statuses: ['pending', 'processing'],
    // Provider-specific function removed);
    const queuePauseState = loadChatroomQueuePauseState(roomId);
    this.model.queuePaused = Boolean(queuePauseState);
    this.model.queuePauseReason = queuePauseState?.reason;
    this.model.queuePauseAt = queuePauseState?.pausedAt;
    this.model.topic = preferredState?.topic ?? snapshot.room?.topic;
    this.model.objective = preferredState?.objective ?? snapshot.room?.objective;
    this.model.constraints = [...(preferredState?.constraints ?? snapshot.room?.constraints ?? [])];
    this.model.messages = [...(preferredState?.messages ?? [])];
    this.model.roleplayScene = preferredState?.roleplayScene;
    this.model.finalSummary = preferredState?.finalSummary;
    this.model.updatedAt = latestUpdatedAt;
    this.model.trace = preferredTrace;
    this.markBrowserRoomRead(roomId, latestUpdatedAt);

  ***REMOVED***snapshot.live && shouldPreferLiveSnapshot(snapshot)) {
      this.model.status = snapshot.live.status;
      this.model.executionRunId = snapshot.live.executionRunId;
      this.model.resumedFromRunId = snapshot.live.resumedFromRunId;
      this.model.currentStepId = snapshot.live.currentStepId;
      this.model.currentAgentIds = snapshot.live.currentAgentIds;
      this.model.error = snapshot.live.error;
      this.model.note = snapshot.live.note;
      this.model.completedAt = snapshot.live.completedAt;
      this.model.startedAt = snapshot.live.startedAt;
    // Provider-specific function removed else if (snapshot.runs[0]) {
      this.model.status = mapRunStatusToScreenStatus(snapshot.runs[0].status);
      this.model.executionRunId = snapshot.runs[0].executionRunId;
      this.model.resumedFromRunId = snapshot.runs[0].resumedFromRunId;
      this.model.currentStepId = undefined;
      this.model.currentAgentIds = undefined;
      this.model.error =
        snapshot.runs[0].status === 'failed' ? snapshot.runs[0].errorText : undefined;
      this.model.note = undefined;
      this.model.completedAt = snapshot.runs[0].endedAt;
      this.model.startedAt = snapshot.runs[0].startedAt;
    // Provider-specific function removed else {
      this.model.status = 'idle';
    // Provider-specific function removed

    this.ensureValidFilter();
    this.syncRecentTurnSelection();
    this.render();
  // Provider-specific function removed

  async markPersisted(args: {
    roomId?: string;
    resumedFromRunId?: string;
    note?: string;
  // Provider-specific function removed): Promise<void> {
    this.model.roomId = args.roomId ?? this.model.roomId;
    this.model.resumedFromRunId =
      args.resumedFromRunId ?? this.model.resumedFromRunId;
    this.model.note = args.note ?? this.model.note;
  ***REMOVED***args.roomId) {
      await this.refreshFromRoom(args.roomId);
      return;
    // Provider-specific function removed
    this.render();
  // Provider-specific function removed

  waitUntilClosed(): Promise<void> {
    return this.closedPromise;
  // Provider-specific function removed

  close(): void {
  ***REMOVED***this.closed) {
      return;
    // Provider-specific function removed

    this.closed = true;
    this.clearPolling();

  ***REMOVED***this.plainMode) {
      this.plainReadline?.off('line', this.boundPlainLine);
      this.plainReadline?.close();
      this.plainReadline = undefined;
      process.off('SIGINT', this.boundSigint);
      process.off('exit', this.boundCleanup);
    // Provider-specific function removed else if (this.interactive) {
      process.stdout.write('\x1b[?25h\x1b[?1049l');
      process.stdout.off('resize', this.boundResize);
      process.off('SIGINT', this.boundSigint);
      process.off('exit', this.boundCleanup);
    ***REMOVED***process.stdin.isTTY) {
        process.stdin.off('keypress', this.boundKeypress);
        process.stdin.setRawMode(false);
      // Provider-specific function removed
    // Provider-specific function removed

    this.lastRenderLines = [];
    this.lastRenderWidth = 0;
    this.lastRenderHeight = 0;
    this.plainPrintedMessageIds.clear();
    this.plainRoomId = undefined;
    this.plainLastStatusKey = '';
    this.plainDidPrintWelcome = false;
    this.plainLastMessageAt = undefined;

    this.resolveClosed?.();
  // Provider-specific function removed

  private async refreshRoomBrowser(): Promise<void> {
    const rooms = loadRoomBrowserEntries(24);
    const nextReadMap = { ...this.model.browserReadUpdatedAtByRoomId // Provider-specific function removed;
    const unreadRoomIds = new Set<string>();
    let didMutateReadMap = false;

    for (const entry of rooms) {
      const latestStamp = resolveBrowserEntryUpdatedAt(entry);
      const readStamp = nextReadMap[entry.room.roomId];
    ***REMOVED***!readStamp) {
        nextReadMap[entry.room.roomId] = latestStamp;
        didMutateReadMap = true;
        continue;
      // Provider-specific function removed

    ***REMOVED***compareTimestamps(readStamp, latestStamp) < 0) {
        unreadRoomIds.add(entry.room.roomId);
      // Provider-specific function removed
    // Provider-specific function removed

    for (const roomId of Object.keys(nextReadMap)) {
    ***REMOVED***!rooms.some((entry) => entry.room.roomId === roomId)) {
        delete nextReadMap[roomId];
        didMutateReadMap = true;
      // Provider-specific function removed
    // Provider-specific function removed

    const roomIds = new Set(rooms.map((entry) => entry.room.roomId));
    const nextArchivedRoomIds = this.model.browserArchivedRoomIds.filter((roomId) =>
      roomIds.has(roomId),
    );
    const nextHiddenRoomIds = this.model.browserHiddenRoomIds.filter((roomId) =>
      roomIds.has(roomId),
    );
    const nextMarkedRoomIds = this.model.browserMarkedRoomIds.filter((roomId) =>
      roomIds.has(roomId),
    );
    const didMutateMetaState =
      nextArchivedRoomIds.length !== this.model.browserArchivedRoomIds.length ||
      nextHiddenRoomIds.length !== this.model.browserHiddenRoomIds.length;
    const didMutateMarkedState =
      nextMarkedRoomIds.length !== this.model.browserMarkedRoomIds.length;

    this.model.browserRooms = rooms;
    this.model.browserReadUpdatedAtByRoomId = nextReadMap;
    this.model.browserUnreadRoomIds = [...unreadRoomIds];
    this.model.browserArchivedRoomIds = nextArchivedRoomIds;
    this.model.browserHiddenRoomIds = nextHiddenRoomIds;
    this.model.browserMarkedRoomIds = nextMarkedRoomIds;
  ***REMOVED***didMutateReadMap) {
      this.persistBrowserState();
    // Provider-specific function removed
  ***REMOVED***didMutateMetaState) {
      this.persistBrowserState();
    // Provider-specific function removed
  ***REMOVED***didMutateMarkedState && this.model.browserMarkedRoomIds.length === 0) {
      this.model.browserActionNote = 'Marked-room selection was cleared because rooms disappeared.';
    // Provider-specific function removed
    const visibleEntries = getVisibleBrowserEntries(this.model);
    this.model.browserSelectedIndex = clamp(
      this.model.browserSelectedIndex,
      0,
      Math.max(0, visibleEntries.length - 1),
    );
    this.model.updatedAt = resolveBrowserUpdatedAt(rooms);
    this.render();
  // Provider-specific function removed

  private handleBrowserKeypress(input: string, key: readline.Key): void {
  ***REMOVED***this.model.browserSearchActive) {
      this.handleBrowserSearchKeypress(input, key);
      return;
    // Provider-specific function removed

  ***REMOVED***this.model.browserCreateActive) {
      this.handleBrowserCreateKeypress(input, key);
      return;
    // Provider-specific function removed

  ***REMOVED***input === 'A') {
      this.applyMarkedBrowserRoomsArchived();
      return;
    // Provider-specific function removed

  ***REMOVED***input === 'X') {
      this.applyMarkedBrowserRoomsHidden();
      return;
    // Provider-specific function removed

  ***REMOVED***input === 'P') {
      void this.applyMarkedBrowserRoomsQueuePause();
      return;
    // Provider-specific function removed

    switch (key.name) {
      case 'up':
      case 'k':
        this.moveBrowserSelection(-1);
        return;
      case 'down':
      case 'j':
        this.moveBrowserSelection(1);
        return;
      case 'pageup':
        this.moveBrowserSelection(-6);
        return;
      case 'pagedown':
        this.moveBrowserSelection(6);
        return;
      case 'g':
        this.model.browserSelectedIndex = 0;
        this.clearBrowserPendingDelete();
        this.render();
        return;
      case 'G':
        this.model.browserSelectedIndex = Math.max(
          0,
          getVisibleBrowserEntries(this.model).length - 1,
        );
        this.clearBrowserPendingDelete();
        this.render();
        return;
      case 'return':
      case 'right':
      case 'l':
        void this.openSelectedRoom();
        return;
      case 'r':
        void this.refreshRoomBrowser();
        return;
      case 'n':
        this.startBrowserCreate();
        return;
      case 'space':
        this.toggleSelectedBrowserRoomMarked();
        return;
      case 'c':
        this.clearBrowserMarkedRooms();
        return;
      case 'f':
        this.cycleBrowserFilterMode(1);
        return;
      case 'v':
        this.cycleBrowserRoomTypeFilter(1);
        return;
      case 's':
        this.cycleBrowserSortMode(1);
        return;
      case 't':
        this.toggleBrowserHideTestRooms();
        return;
      case 'x':
        this.toggleSelectedBrowserRoomHidden();
        return;
      case 'z':
        this.toggleSelectedBrowserRoomArchived();
        return;
      case 'p':
        void this.toggleSelectedBrowserRoomQueuePause();
        return;
      case 'u':
        void this.resumeSelectedBrowserCheckpoint();
        return;
      case 'd':
        void this.requestOrDeleteSelectedBrowserRoom();
        return;
      default:
        break;
    // Provider-specific function removed

  ***REMOVED***key.sequence === '/') {
      this.startBrowserSearch();
      return;
    // Provider-specific function removed

    this.clearBrowserPendingDelete();
  // Provider-specific function removed

  private startBrowserCreate(): void {
    this.model.browserCreateActive = true;
    this.model.browserCreateSubmitting = false;
    this.model.browserCreateMode = 'manual';
    this.model.browserCreateField = 'mode';
    this.model.browserCreateTopic = '';
    this.model.browserCreateObjective = '';
    this.model.browserCreateRoomType = this.defaultRoomType;
    this.model.browserCreateSpeakers = String(
      resolveCreateRoomTypeSpec(this.defaultRoomType).recommendedSpeakerCount,
    );
    this.model.browserCreateScoreTemplateId = '';
    this.model.browserCreateScoreDimensions = '';
    this.model.browserCreateAdminRequest = '';
    this.model.browserCreateAdminConversation = undefined;
    this.model.browserCreateAdminAssistantMessage = undefined;
    this.model.browserCreateAdminFollowUpQuestions = [];
    this.model.browserCreateAdminTentativeScenarioTemplateId = undefined;
    this.model.browserCreateError = undefined;
    this.model.browserCreateNote =
      'Manual mode: input topic/objective, choose room type/speakers, and optionally set interview score template + dimensions.';
    this.model.browserActionNote = undefined;
    this.model.browserActionError = undefined;
    this.clearBrowserPendingDelete();
    this.render();
  // Provider-specific function removed

  private cancelBrowserCreate(): void {
    this.model.browserCreateActive = false;
    this.model.browserCreateSubmitting = false;
    this.model.browserCreateAdminConversation = undefined;
    this.model.browserCreateAdminAssistantMessage = undefined;
    this.model.browserCreateAdminFollowUpQuestions = [];
    this.model.browserCreateAdminTentativeScenarioTemplateId = undefined;
    this.model.browserCreateScoreTemplateId = '';
    this.model.browserCreateScoreDimensions = '';
    this.model.browserCreateError = undefined;
    this.model.browserCreateNote = undefined;
    this.render();
  // Provider-specific function removed

  private startBrowserSearch(): void {
    this.model.browserSearchActive = true;
    this.model.browserActionNote = 'Type to search rooms. Enter or Esc to stop searching.';
    this.model.browserActionError = undefined;
    this.clearBrowserPendingDelete();
    this.render();
  // Provider-specific function removed

  private finishBrowserSearch(): void {
    this.model.browserSearchActive = false;
    this.model.browserActionNote = this.model.browserSearchQuery.trim()
      ? `Search: ${this.model.browserSearchQuery.trim()// Provider-specific function removed`
      : 'Search cleared.';
    this.render();
  // Provider-specific function removed

  private handleBrowserSearchKeypress(input: string, key: readline.Key): void {
  ***REMOVED***key.ctrl && key.name === 'u') {
      this.model.browserSearchQuery = '';
      this.model.browserSelectedIndex = 0;
      this.render();
      return;
    // Provider-specific function removed

    switch (key.name) {
      case 'escape':
        this.finishBrowserSearch();
        return;
      case 'return':
      case 'enter':
        this.finishBrowserSearch();
        return;
      case 'backspace':
        this.model.browserSearchQuery = removeLastCharacter(this.model.browserSearchQuery);
        this.model.browserSelectedIndex = 0;
        this.render();
        return;
      default:
        break;
    // Provider-specific function removed

  ***REMOVED***isTextInputChunk(input, key)) {
      this.model.browserSearchQuery += input.replace(/\r?\n/g, ' ');
      this.model.browserSelectedIndex = 0;
      this.render();
    // Provider-specific function removed
  // Provider-specific function removed

  private handleBrowserCreateKeypress(input: string, key: readline.Key): void {
  ***REMOVED***key.ctrl && key.name === 'u') {
      this.clearBrowserCreateField();
      return;
    // Provider-specific function removed

    switch (key.name) {
      case 'escape':
        this.cancelBrowserCreate();
        return;
      case 'tab':
        this.cycleBrowserCreateField(1);
        return;
      case 'backtab':
        this.cycleBrowserCreateField(-1);
        return;
      case 'up':
        this.cycleBrowserCreateField(-1);
        return;
      case 'down':
        this.cycleBrowserCreateField(1);
        return;
      case 'left':
        this.adjustBrowserCreateSelector(-1);
        return;
      case 'right':
        this.adjustBrowserCreateSelector(1);
        return;
      case 'return':
      case 'enter':
        void this.submitBrowserCreate();
        return;
      case 'backspace':
        this.deleteBrowserCreateCharacter();
        return;
      case 'delete':
        return;
      default:
        break;
    // Provider-specific function removed

  ***REMOVED***isTextInputChunk(input, key)) {
      this.appendBrowserCreateInput(input);
    // Provider-specific function removed
  // Provider-specific function removed

  private cycleBrowserCreateField(delta: number): void {
    const fields = listBrowserCreateFields(this.model.browserCreateMode);
    const currentIndex = fields.indexOf(this.model.browserCreateField);
    const baseIndex = currentIndex >= 0 ? currentIndex : 0;
    const nextIndex = (baseIndex + delta + fields.length) % fields.length;
    this.model.browserCreateField = fields[nextIndex] ?? 'mode';
    this.render();
  // Provider-specific function removed

  private adjustBrowserCreateSelector(delta: number): void {
    switch (this.model.browserCreateField) {
      case 'mode':
        this.cycleBrowserCreateMode(delta);
        return;
      case 'roomType':
        this.cycleBrowserCreateRoomType(delta);
        return;
      default:
        return;
    // Provider-specific function removed
  // Provider-specific function removed

  private clearBrowserCreateField(): void {
    switch (this.model.browserCreateField) {
      case 'mode':
        this.setBrowserCreateMode('manual');
        break;
      case 'topic':
        this.model.browserCreateTopic = '';
        break;
      case 'objective':
        this.model.browserCreateObjective = '';
        break;
      case 'roomType':
        this.setBrowserCreateRoomType(this.defaultRoomType);
        break;
      case 'speakers':
        this.model.browserCreateSpeakers = '';
        break;
      case 'scoreTemplateId':
        this.model.browserCreateScoreTemplateId = '';
        break;
      case 'scoreDimensions':
        this.model.browserCreateScoreDimensions = '';
        break;
      case 'adminRequest':
        this.model.browserCreateAdminRequest = '';
        break;
    // Provider-specific function removed
    this.render();
  // Provider-specific function removed

  private appendBrowserCreateInput(input: string): void {
    const normalized = input.replace(/\r?\n/g, ' ');
  ***REMOVED***normalized.length === 0) {
      return;
    // Provider-specific function removed

    switch (this.model.browserCreateField) {
      case 'mode':
        return;
      case 'topic':
        this.model.browserCreateTopic += normalized;
        break;
      case 'objective':
        this.model.browserCreateObjective += normalized;
        break;
      case 'roomType':
        return;
      case 'speakers':
        this.model.browserCreateSpeakers += normalized.replace(/[^0-9]/g, '');
        break;
      case 'scoreTemplateId':
        this.model.browserCreateScoreTemplateId += normalized;
        break;
      case 'scoreDimensions':
        this.model.browserCreateScoreDimensions += normalized;
        break;
      case 'adminRequest':
        this.model.browserCreateAdminRequest += normalized;
        break;
    // Provider-specific function removed

    this.model.browserCreateError = undefined;
    this.model.browserCreateNote = undefined;
    this.render();
  // Provider-specific function removed

  private deleteBrowserCreateCharacter(): void {
    const deleteFrom = (value: string): string => {
      const characters = [...value];
      characters.pop();
      return characters.join('');
    // Provider-specific function removed;

    switch (this.model.browserCreateField) {
      case 'mode':
        return;
      case 'topic':
        this.model.browserCreateTopic = deleteFrom(this.model.browserCreateTopic);
        break;
      case 'objective':
        this.model.browserCreateObjective = deleteFrom(this.model.browserCreateObjective);
        break;
      case 'roomType':
        return;
      case 'speakers':
        this.model.browserCreateSpeakers = deleteFrom(this.model.browserCreateSpeakers);
        break;
      case 'scoreTemplateId':
        this.model.browserCreateScoreTemplateId = deleteFrom(
          this.model.browserCreateScoreTemplateId,
        );
        break;
      case 'scoreDimensions':
        this.model.browserCreateScoreDimensions = deleteFrom(
          this.model.browserCreateScoreDimensions,
        );
        break;
      case 'adminRequest':
        this.model.browserCreateAdminRequest = deleteFrom(
          this.model.browserCreateAdminRequest,
        );
        break;
    // Provider-specific function removed

    this.render();
  // Provider-specific function removed

  private cycleBrowserCreateMode(delta: number): void {
    const modes: BrowserCreateMode[] = ['manual', 'admin'];
    const currentIndex = modes.indexOf(this.model.browserCreateMode);
    const nextIndex = (Math.max(0, currentIndex) + delta + modes.length) % modes.length;
    this.setBrowserCreateMode(modes[nextIndex] ?? 'manual');
    this.render();
  // Provider-specific function removed

  private setBrowserCreateMode(mode: BrowserCreateMode): void {
    this.model.browserCreateMode = mode;
    this.model.browserCreateField = mode === 'admin' ? 'adminRequest' : 'topic';
    this.model.browserCreateAdminConversation = undefined;
    this.model.browserCreateAdminAssistantMessage = undefined;
    this.model.browserCreateAdminFollowUpQuestions = [];
    this.model.browserCreateAdminTentativeScenarioTemplateId = undefined;

    this.model.browserCreateError = undefined;
    this.model.browserCreateNote =
      mode === 'admin'
        ? 'Admin mode: write one brief and the platform admin will choose the scenario template and room setup.'
        : 'Manual mode: input topic/objective, choose room type and speakers, then optionally set interview score template and dimensions.';
  // Provider-specific function removed

  private cycleBrowserCreateRoomType(delta: number): void {
    const roomTypes = listChatroomRoomTypes();
    const currentIndex = roomTypes.findIndex(
      (roomType) => roomType.id === this.model.browserCreateRoomType,
    );
    const baseIndex = currentIndex >= 0 ? currentIndex : 0;
    const nextIndex = (baseIndex + delta + roomTypes.length) % roomTypes.length;
    const nextRoomType = roomTypes[nextIndex]?.id ?? this.defaultRoomType;
    this.setBrowserCreateRoomType(nextRoomType);
    this.render();
  // Provider-specific function removed

  private setBrowserCreateRoomType(roomType: ChatroomRoomTypeId): void {
    const previousSpec = resolveCreateRoomTypeSpec(this.model.browserCreateRoomType);
    const nextSpec = resolveCreateRoomTypeSpec(roomType);
    const parsedSpeakerCount = Number.parseInt(this.model.browserCreateSpeakers.trim(), 10);
    const shouldResetSpeakers =
      !Number.isInteger(parsedSpeakerCount) ||
      parsedSpeakerCount < nextSpec.minSpeakerCount ||
      parsedSpeakerCount > nextSpec.maxSpeakerCount ||
      parsedSpeakerCount === previousSpec.recommendedSpeakerCount;

    this.model.browserCreateRoomType = nextSpec.id;
  ***REMOVED***shouldResetSpeakers) {
      this.model.browserCreateSpeakers = String(nextSpec.recommendedSpeakerCount);
    // Provider-specific function removed

    this.model.browserCreateError = undefined;
    this.model.browserCreateNote = `Room type: ${nextSpec.label// Provider-specific function removed | Speakers ${nextSpec.minSpeakerCount// Provider-specific function removed-${nextSpec.maxSpeakerCount// Provider-specific function removed, recommended ${nextSpec.recommendedSpeakerCount// Provider-specific function removed.`;
  // Provider-specific function removed

  private async submitBrowserCreate(): Promise<void> {
  ***REMOVED***this.model.browserCreateSubmitting) {
      return;
    // Provider-specific function removed

  ***REMOVED***!this.createRoom) {
      this.model.browserCreateError = 'This TUI instance does not have createRoom support.';
      this.render();
      return;
    // Provider-specific function removed

    const shouldUseAdminMode =
      this.model.browserCreateMode === 'admin' ||
      this.model.browserCreateField === 'adminRequest' ||
      (
        this.model.browserCreateAdminRequest.trim().length > 0 &&
        !this.model.browserCreateTopic.trim() &&
        !this.model.browserCreateObjective.trim()
      );

  ***REMOVED***shouldUseAdminMode) {
      const adminRequest = this.model.browserCreateAdminRequest.trim();
    ***REMOVED***!adminRequest) {
        this.model.browserCreateError = 'Admin request is required in admin mode.';
        this.render();
        return;
      // Provider-specific function removed

      this.model.browserCreateSubmitting = true;
      this.model.browserCreateError = undefined;
      this.model.browserCreateNote = 'Planning room with platform admin...';
      this.render();

      try {
        const result = await this.createRoom({
          mode: 'admin',
          adminRequest,
          adminConversation: this.model.browserCreateAdminConversation,
        // Provider-specific function removed);
      ***REMOVED***result.status === 'needs_clarification') {
          this.applyBrowserCreateAdminClarification(result);
          return;
        // Provider-specific function removed

      ***REMOVED***!result.roomId) {
          throw new Error('Admin room creation finished without a roomId.');
        // Provider-specific function removed

        this.resetBrowserCreateStateAfterSuccess(result.note, result.roomId);
      // Provider-specific function removed catch (error) {
        this.model.browserCreateSubmitting = false;
        this.model.browserCreateError = formatError(error);
        this.render();
      // Provider-specific function removed
      return;
    // Provider-specific function removed

    const topic = this.model.browserCreateTopic.trim();
    const objective = this.model.browserCreateObjective.trim();
    const roomType = this.model.browserCreateRoomType;
    const rawScoreTemplateId = this.model.browserCreateScoreTemplateId.trim().toLowerCase();
    const scoreTemplateId = rawScoreTemplateId ? rawScoreTemplateId : undefined;
    const scoreDimensions = parseBrowserCreateScoreDimensions(
      this.model.browserCreateScoreDimensions,
    );
    const roomTypeSpec = resolveCreateRoomTypeSpec(roomType);
    const speakerCount = Number.parseInt(this.model.browserCreateSpeakers.trim(), 10);

  ***REMOVED***!topic || !objective) {
      this.model.browserCreateError = 'Topic and objective are both required.';
      this.render();
      return;
    // Provider-specific function removed

  ***REMOVED***
      !Number.isInteger(speakerCount) ||
      speakerCount < roomTypeSpec.minSpeakerCount ||
      speakerCount > roomTypeSpec.maxSpeakerCount
  ***REMOVED***
      this.model.browserCreateError = `Speakers must be within ${roomTypeSpec.minSpeakerCount// Provider-specific function removed-${roomTypeSpec.maxSpeakerCount// Provider-specific function removed for ${roomTypeSpec.id// Provider-specific function removed.`;
      this.render();
      return;
    // Provider-specific function removed

  ***REMOVED***scoreTemplateId && !resolveInterviewScoreTemplateById(scoreTemplateId)) {
      this.model.browserCreateError =
        `Unknown score template "${scoreTemplateId// Provider-specific function removed". Available: ${INTERVIEW_SCORE_TEMPLATE_IDS.join(', ')// Provider-specific function removed.`;
      this.render();
      return;
    // Provider-specific function removed

    this.model.browserCreateSubmitting = true;
    this.model.browserCreateError = undefined;
    this.model.browserCreateNote = 'Creating room...';
    this.render();

    try {
      const result = await this.createRoom({
        mode: 'manual',
        topic,
        objective,
        roomType,
        speakerCount,
        scoreTemplateId,
        scoreDimensions,
      // Provider-specific function removed);
    ***REMOVED***!result.roomId) {
        throw new Error('Room creation finished without a roomId.');
      // Provider-specific function removed
      this.resetBrowserCreateStateAfterSuccess(result.note, result.roomId);
    // Provider-specific function removed catch (error) {
      this.model.browserCreateSubmitting = false;
      this.model.browserCreateError = formatError(error);
      this.render();
    // Provider-specific function removed
  // Provider-specific function removed

  private applyBrowserCreateAdminClarification(result: {
    conversation?: PlatformAdminConversationState;
    note?: string;
    assistantMessage?: string;
    followUpQuestions?: string[];
    tentativeScenarioTemplateId?: string;
  // Provider-specific function removed): void {
    this.model.browserCreateSubmitting = false;
    this.model.browserCreateError = undefined;
    this.model.browserCreateAdminConversation = result.conversation;
    this.model.browserCreateAdminAssistantMessage = result.assistantMessage;
    this.model.browserCreateAdminFollowUpQuestions = [
      ...(result.followUpQuestions ?? []),
    ];
    this.model.browserCreateAdminTentativeScenarioTemplateId =
      result.tentativeScenarioTemplateId;
    this.model.browserCreateAdminRequest = '';
    this.model.browserCreateField = 'adminRequest';
    this.model.browserCreateNote =
      result.note ??
      'Platform admin needs one more reply before it can create the room.';
    this.render();
  // Provider-specific function removed

  private resetBrowserCreateStateAfterSuccess(
    note: string | undefined,
    roomId: string,
  ): void {
    this.model.browserCreateActive = false;
    this.model.browserCreateSubmitting = false;
    this.model.browserCreateMode = 'manual';
    this.model.browserCreateField = 'mode';
    this.model.browserCreateTopic = '';
    this.model.browserCreateObjective = '';
    this.model.browserCreateRoomType = this.defaultRoomType;
    this.model.browserCreateSpeakers = String(
      resolveCreateRoomTypeSpec(this.defaultRoomType).recommendedSpeakerCount,
    );
    this.model.browserCreateScoreTemplateId = '';
    this.model.browserCreateScoreDimensions = '';
    this.model.browserCreateAdminRequest = '';
    this.model.browserCreateAdminConversation = undefined;
    this.model.browserCreateAdminAssistantMessage = undefined;
    this.model.browserCreateAdminFollowUpQuestions = [];
    this.model.browserCreateAdminTentativeScenarioTemplateId = undefined;
    this.model.browserCreateNote = note ?? `Created room ${shortId(roomId)// Provider-specific function removed`;
    this.model.browserCreateError = undefined;
    this.model.browserActionNote = this.model.browserCreateNote;
  // Provider-specific function removed

  private cycleBrowserFilterMode(delta: number): void {
    const modes: BrowserFilterMode[] = ['active', 'all', 'archived', 'hidden', 'live'];
    const currentIndex = modes.indexOf(this.model.browserFilterMode);
    const nextIndex = (Math.max(0, currentIndex) + delta + modes.length) % modes.length;
    this.model.browserFilterMode = modes[nextIndex] ?? 'active';
    this.model.browserSelectedIndex = 0;
    this.model.browserActionNote = `Filter: ${formatBrowserFilterMode(this.model.browserFilterMode)// Provider-specific function removed`;
    this.clearBrowserPendingDelete();
    this.persistBrowserState();
    this.render();
  // Provider-specific function removed

  private cycleBrowserRoomTypeFilter(delta: number): void {
    const modes = listBrowserRoomTypeFilters();
    const currentIndex = modes.indexOf(this.model.browserRoomTypeFilter);
    const nextIndex = (Math.max(0, currentIndex) + delta + modes.length) % modes.length;
    this.model.browserRoomTypeFilter = modes[nextIndex] ?? 'all';
    this.model.browserSelectedIndex = 0;
    this.model.browserActionNote = `Room type: ${formatBrowserRoomTypeFilter(this.model.browserRoomTypeFilter)// Provider-specific function removed`;
    this.clearBrowserPendingDelete();
    this.persistBrowserState();
    this.render();
  // Provider-specific function removed

  private cycleBrowserSortMode(delta: number): void {
    const modes: BrowserSortMode[] = ['updated', 'created', 'messages', 'runs', 'topic'];
    const currentIndex = modes.indexOf(this.model.browserSortMode);
    const nextIndex = (Math.max(0, currentIndex) + delta + modes.length) % modes.length;
    this.model.browserSortMode = modes[nextIndex] ?? 'updated';
    this.model.browserSelectedIndex = 0;
    this.model.browserActionNote = `Sort: ${formatBrowserSortMode(this.model.browserSortMode)// Provider-specific function removed`;
    this.clearBrowserPendingDelete();
    this.persistBrowserState();
    this.render();
  // Provider-specific function removed

  private toggleBrowserHideTestRooms(): void {
    this.model.browserHideTestRooms = !this.model.browserHideTestRooms;
    this.model.browserSelectedIndex = 0;
    this.model.browserActionNote = this.model.browserHideTestRooms
      ? 'Test-like rooms are now hidden.'
      : 'Test-like rooms are visible again.';
    this.clearBrowserPendingDelete();
    this.persistBrowserState();
    this.render();
  // Provider-specific function removed

  private toggleSelectedBrowserRoomMarked(): void {
    const selected = this.getSelectedVisibleBrowserEntry();
  ***REMOVED***!selected) {
      return;
    // Provider-specific function removed

    const roomId = selected.room.roomId;
    const marked = this.model.browserMarkedRoomIds.includes(roomId);
    this.model.browserMarkedRoomIds = marked
      ? this.model.browserMarkedRoomIds.filter((item) => item !== roomId)
      : [...this.model.browserMarkedRoomIds, roomId];
    this.model.browserActionNote = marked
      ? `Unmarked ${shortId(roomId)// Provider-specific function removed.`
      : `Marked ${shortId(roomId)// Provider-specific function removed for batch actions.`;
    this.clearBrowserPendingDelete();
    this.render();
  // Provider-specific function removed

  private clearBrowserMarkedRooms(): void {
  ***REMOVED***this.model.browserMarkedRoomIds.length === 0) {
      this.model.browserActionNote = 'No marked rooms to clear.';
      this.render();
      return;
    // Provider-specific function removed

    this.model.browserMarkedRoomIds = [];
    this.model.browserActionNote = 'Cleared all marked rooms.';
    this.clearBrowserPendingDelete();
    this.render();
  // Provider-specific function removed

  private applyMarkedBrowserRoomsArchived(): void {
    const roomIds = this.getMarkedBrowserRoomIds();
  ***REMOVED***roomIds.length === 0) {
      this.model.browserActionNote = 'No marked rooms. Press Space to mark rooms first.';
      this.render();
      return;
    // Provider-specific function removed

    const shouldUnarchive = roomIds.every((roomId) =>
      this.model.browserArchivedRoomIds.includes(roomId),
    );
    const nextArchived = new Set(this.model.browserArchivedRoomIds);
    for (const roomId of roomIds) {
    ***REMOVED***shouldUnarchive) {
        nextArchived.delete(roomId);
      // Provider-specific function removed else {
        nextArchived.add(roomId);
      // Provider-specific function removed
    // Provider-specific function removed

    this.model.browserArchivedRoomIds = [...nextArchived];
    this.model.browserMarkedRoomIds = [];
    this.model.browserActionNote = shouldUnarchive
      ? `Unarchived ${roomIds.length// Provider-specific function removed marked rooms.`
      : `Archived ${roomIds.length// Provider-specific function removed marked rooms.`;
    this.model.browserSelectedIndex = clamp(
      this.model.browserSelectedIndex,
      0,
      Math.max(0, getVisibleBrowserEntries(this.model).length - 1),
    );
    this.clearBrowserPendingDelete();
    this.persistBrowserState();
    this.render();
  // Provider-specific function removed

  private applyMarkedBrowserRoomsHidden(): void {
    const roomIds = this.getMarkedBrowserRoomIds();
  ***REMOVED***roomIds.length === 0) {
      this.model.browserActionNote = 'No marked rooms. Press Space to mark rooms first.';
      this.render();
      return;
    // Provider-specific function removed

    const shouldUnhide = roomIds.every((roomId) =>
      this.model.browserHiddenRoomIds.includes(roomId),
    );
    const nextHidden = new Set(this.model.browserHiddenRoomIds);
    for (const roomId of roomIds) {
    ***REMOVED***shouldUnhide) {
        nextHidden.delete(roomId);
      // Provider-specific function removed else {
        nextHidden.add(roomId);
      // Provider-specific function removed
    // Provider-specific function removed

    this.model.browserHiddenRoomIds = [...nextHidden];
    this.model.browserMarkedRoomIds = [];
    this.model.browserActionNote = shouldUnhide
      ? `Unhid ${roomIds.length// Provider-specific function removed marked rooms.`
      : `Hid ${roomIds.length// Provider-specific function removed marked rooms.`;
    this.model.browserSelectedIndex = clamp(
      this.model.browserSelectedIndex,
      0,
      Math.max(0, getVisibleBrowserEntries(this.model).length - 1),
    );
    this.clearBrowserPendingDelete();
    this.persistBrowserState();
    this.render();
  // Provider-specific function removed

  private async applyMarkedBrowserRoomsQueuePause(): Promise<void> {
    const roomIds = this.getMarkedBrowserRoomIds();
  ***REMOVED***roomIds.length === 0) {
      this.model.browserActionNote = 'No marked rooms. Press Space to mark rooms first.';
      this.render();
      return;
    // Provider-specific function removed

  ***REMOVED***!this.setQueuePaused) {
      this.model.browserActionError = 'This TUI instance does not have queue pause support.';
      this.render();
      return;
    // Provider-specific function removed

    const entries = roomIds
      .map((roomId) => this.model.browserRooms.find((entry) => entry.room.roomId === roomId))
      .filter((entry): entry is RoomBrowserEntry => Boolean(entry));
    const shouldResume = entries.length > 0 && entries.every((entry) => entry.queuePaused);
    this.model.browserActionError = undefined;
    this.model.browserActionNote = shouldResume
      ? `Resuming ${entries.length// Provider-specific function removed marked rooms...`
      : `Pausing ${entries.length// Provider-specific function removed marked rooms...`;
    this.render();

    const results = await Promise.allSettled(
      entries.map(async (entry) => ({
        roomId: entry.room.roomId,
        result: await this.setQueuePaused!({
          roomId: entry.room.roomId,
          paused: !shouldResume,
        // Provider-specific function removed),
      // Provider-specific function removed)),
    );

    const succeededRoomIds: string[] = [];
    const failedMessages: string[] = [];
    for (const result of results) {
    ***REMOVED***result.status === 'fulfilled') {
        succeededRoomIds.push(result.value.roomId);
        continue;
      // Provider-specific function removed

      failedMessages.push(
        result.reason instanceof Error ? result.reason.message : String(result.reason),
      );
    // Provider-specific function removed

    this.model.browserMarkedRoomIds = failedMessages.length > 0
      ? roomIds.filter((roomId) => !succeededRoomIds.includes(roomId))
      : [];
    this.model.browserActionNote = shouldResume
      ? `Resumed ${succeededRoomIds.length// Provider-specific function removed/${roomIds.length// Provider-specific function removed marked rooms.`
      : `Paused ${succeededRoomIds.length// Provider-specific function removed/${roomIds.length// Provider-specific function removed marked rooms.`;
    this.model.browserActionError =
      failedMessages.length > 0 ? failedMessages.slice(0, 3).join(' | ') : undefined;
    this.model.browserSelectedIndex = clamp(
      this.model.browserSelectedIndex,
      0,
      Math.max(0, getVisibleBrowserEntries(this.model).length - 1),
    );
    this.clearBrowserPendingDelete();
    await this.refreshRoomBrowser();
  // Provider-specific function removed

  private toggleSelectedBrowserRoomArchived(): void {
    const selected = this.getSelectedVisibleBrowserEntry();
  ***REMOVED***!selected) {
      return;
    // Provider-specific function removed

    const roomId = selected.room.roomId;
    const archived = this.model.browserArchivedRoomIds.includes(roomId);
    this.model.browserArchivedRoomIds = archived
      ? this.model.browserArchivedRoomIds.filter((item) => item !== roomId)
      : [...this.model.browserArchivedRoomIds, roomId];
    this.model.browserMarkedRoomIds = this.model.browserMarkedRoomIds.filter(
      (item) => item !== roomId,
    );
    this.model.browserActionNote = archived
      ? `Unarchived ${shortId(roomId)// Provider-specific function removed.`
      : `Archived ${shortId(roomId)// Provider-specific function removed.`;
    this.model.browserSelectedIndex = clamp(
      this.model.browserSelectedIndex,
      0,
      Math.max(0, getVisibleBrowserEntries(this.model).length - 1),
    );
    this.clearBrowserPendingDelete();
    this.persistBrowserState();
    this.render();
  // Provider-specific function removed

  private toggleSelectedBrowserRoomHidden(): void {
    const selected = this.getSelectedVisibleBrowserEntry();
  ***REMOVED***!selected) {
      return;
    // Provider-specific function removed

    const roomId = selected.room.roomId;
    const hidden = this.model.browserHiddenRoomIds.includes(roomId);
    this.model.browserHiddenRoomIds = hidden
      ? this.model.browserHiddenRoomIds.filter((item) => item !== roomId)
      : [...this.model.browserHiddenRoomIds, roomId];
    this.model.browserMarkedRoomIds = this.model.browserMarkedRoomIds.filter(
      (item) => item !== roomId,
    );
    this.model.browserActionNote = hidden
      ? `Unhid ${shortId(roomId)// Provider-specific function removed.`
      : `Hid ${shortId(roomId)// Provider-specific function removed.`;
    this.model.browserSelectedIndex = clamp(
      this.model.browserSelectedIndex,
      0,
      Math.max(0, getVisibleBrowserEntries(this.model).length - 1),
    );
    this.clearBrowserPendingDelete();
    this.persistBrowserState();
    this.render();
  // Provider-specific function removed

  private async toggleSelectedBrowserRoomQueuePause(): Promise<void> {
    const selected = this.getSelectedVisibleBrowserEntry();
  ***REMOVED***!selected) {
      return;
    // Provider-specific function removed

  ***REMOVED***!this.setQueuePaused) {
      this.model.browserActionError = 'This TUI instance does not have queue pause support.';
      this.render();
      return;
    // Provider-specific function removed

    const roomId = selected.room.roomId;
    const nextPaused = !selected.queuePaused;
    this.model.browserActionError = undefined;
    this.model.browserActionNote = nextPaused
      ? `Pausing ${shortId(roomId)// Provider-specific function removed...`
      : `Resuming ${shortId(roomId)// Provider-specific function removed...`;
    this.render();

    try {
      const result = await this.setQueuePaused({
        roomId,
        paused: nextPaused,
      // Provider-specific function removed);
      this.model.browserMarkedRoomIds = this.model.browserMarkedRoomIds.filter(
        (item) => item !== roomId,
      );
      this.model.browserActionNote =
        result.note ??
        (nextPaused ? `Paused ${shortId(roomId)// Provider-specific function removed.` : `Resumed ${shortId(roomId)// Provider-specific function removed.`);
      this.clearBrowserPendingDelete();
      await this.refreshRoomBrowser();
    // Provider-specific function removed catch (error) {
      this.model.browserActionError = formatError(error);
      this.clearBrowserPendingDelete();
      this.render();
    // Provider-specific function removed
  // Provider-specific function removed

  private async resumeSelectedBrowserCheckpoint(): Promise<void> {
    const selected = this.getSelectedVisibleBrowserEntry();
  ***REMOVED***!selected) {
      return;
    // Provider-specific function removed

  ***REMOVED***!this.resumeCheckpoint) {
      this.model.browserActionError = 'This TUI instance does not have checkpoint resume support.';
      this.render();
      return;
    // Provider-specific function removed

    const checkpoint = this.model.browserSelectedCheckpoint;
  ***REMOVED***!checkpoint) {
      this.model.browserActionError = undefined;
      this.model.browserActionNote =
        `No failed or cancelled checkpoint is available for ${shortId(selected.room.roomId)// Provider-specific function removed.`;
      this.render();
      return;
    // Provider-specific function removed

    this.model.browserActionError = undefined;
    this.model.browserActionNote =
      `Resuming ${checkpoint.status// Provider-specific function removed checkpoint ${shortId(checkpoint.checkpointId)// Provider-specific function removed for ${shortId(selected.room.roomId)// Provider-specific function removed...`;
    this.render();

    try {
      const result = await this.resumeCheckpoint({
        roomId: selected.room.roomId,
        checkpointId: checkpoint.checkpointId,
      // Provider-specific function removed);
      this.model.browserMarkedRoomIds = this.model.browserMarkedRoomIds.filter(
        (item) => item !== selected.room.roomId,
      );
      this.model.browserActionNote =
        result.note ??
        `Resumed checkpoint ${shortId(result.checkpointId)// Provider-specific function removed for ${shortId(selected.room.roomId)// Provider-specific function removed.`;
      this.clearBrowserPendingDelete();
      await this.refreshRoomBrowser();
    // Provider-specific function removed catch (error) {
      this.model.browserActionError = formatError(error);
      this.clearBrowserPendingDelete();
      this.render();
    // Provider-specific function removed
  // Provider-specific function removed

  private async requestOrDeleteSelectedBrowserRoom(): Promise<void> {
    const selected = this.getSelectedVisibleBrowserEntry();
  ***REMOVED***!selected) {
      return;
    // Provider-specific function removed

    const roomId = selected.room.roomId;
  ***REMOVED***this.model.browserPendingDeleteRoomId !== roomId) {
      this.model.browserPendingDeleteRoomId = roomId;
      this.model.browserActionNote =
        `Press d again to permanently delete ${shortId(roomId)// Provider-specific function removed and its stored artifacts.`;
      this.render();
      return;
    // Provider-specific function removed

  ***REMOVED***!this.deleteRoom) {
      this.model.browserActionError = 'This TUI instance does not have deleteRoom support.';
      this.render();
      return;
    // Provider-specific function removed

    this.model.browserActionError = undefined;
    this.model.browserActionNote = `Deleting ${shortId(roomId)// Provider-specific function removed...`;
    this.render();

    try {
      const result = await this.deleteRoom(roomId);
      this.model.browserArchivedRoomIds = this.model.browserArchivedRoomIds.filter(
        (item) => item !== roomId,
      );
      this.model.browserHiddenRoomIds = this.model.browserHiddenRoomIds.filter(
        (item) => item !== roomId,
      );
      this.model.browserMarkedRoomIds = this.model.browserMarkedRoomIds.filter(
        (item) => item !== roomId,
      );
      delete this.model.browserReadUpdatedAtByRoomId[roomId];
      this.model.browserUnreadRoomIds = this.model.browserUnreadRoomIds.filter(
        (item) => item !== roomId,
      );
      this.model.browserActionNote = result.note ?? `Deleted ${shortId(roomId)// Provider-specific function removed.`;
      this.clearBrowserPendingDelete();
      this.persistBrowserState();
      await this.refreshRoomBrowser();
    // Provider-specific function removed catch (error) {
      this.model.browserActionError = formatError(error);
      this.clearBrowserPendingDelete();
      this.render();
    // Provider-specific function removed
  // Provider-specific function removed

  private clearBrowserPendingDelete(): void {
    this.model.browserPendingDeleteRoomId = undefined;
  // Provider-specific function removed

  private getMarkedBrowserRoomIds(): string[] {
    const knownRoomIds = new Set(this.model.browserRooms.map((entry) => entry.room.roomId));
  ***REMOVED***...new Set(this.model.browserMarkedRoomIds)].filter((roomId) =>
      knownRoomIds.has(roomId),
    );
  // Provider-specific function removed

  private handleRoomKeypress(input: string, key: readline.Key): void {
  ***REMOVED***this.model.recentTurnDetailOpen) {
      this.handleRecentTurnDetailKeypress(input, key);
      return;
    // Provider-specific function removed

  ***REMOVED***this.model.composerFocused) {
      this.handleComposerKeypress(input, key);
      return;
    // Provider-specific function removed

    switch (key.name) {
      case 'up':
      case 'k':
        this.scrollBy(-1);
        return;
      case 'down':
      case 'j':
        this.scrollBy(1);
        return;
      case 'pageup':
        this.scrollBy(-8);
        return;
      case 'pagedown':
        this.scrollBy(8);
        return;
      case 'g':
        this.model.autoScroll = false;
        this.model.scrollTop = 0;
        this.render();
        return;
      case 'G':
        this.model.autoScroll = true;
        this.render();
        return;
      case 'left':
      case 'h':
        this.cycleFilter(-1);
        return;
      case 'right':
      case 'l':
        this.cycleFilter(1);
        return;
      case 'escape':
        void this.returnToRoomBrowser();
        return;
      case 'b':
        void this.returnToRoomBrowser();
        return;
      case 'i':
      case 'm':
        this.focusComposer();
        return;
      case 'return':
      case 'o':
        this.openRecentTurnDetail();
        return;
      case 'r':
        void this.refreshCurrentRoom();
        return;
      case 's':
        void this.stopActiveRun();
        return;
      case 'p':
        void this.toggleQueuePause();
        return;
      default:
        break;
    // Provider-specific function removed

    switch (key.sequence) {
      case 'a':
        this.model.autoScroll = !this.model.autoScroll;
        this.render();
        return;
      case '0':
        this.model.filterAuthorId = undefined;
        this.model.scrollTop = 0;
        this.model.autoScroll = true;
        this.render();
        return;
      case '[':
        this.cycleRecentTurnSelection(-1);
        return;
      case ']':
        this.cycleRecentTurnSelection(1);
        return;
      default:
        break;
    // Provider-specific function removed
  // Provider-specific function removed

  private handleRecentTurnDetailKeypress(input: string, key: readline.Key): void {
    switch (key.name) {
      case 'up':
      case 'k':
        this.scrollRecentTurnDetail(-1);
        return;
      case 'down':
      case 'j':
        this.scrollRecentTurnDetail(1);
        return;
      case 'pageup':
        this.scrollRecentTurnDetail(-8);
        return;
      case 'pagedown':
        this.scrollRecentTurnDetail(8);
        return;
      case 'g':
        this.model.recentTurnDetailScrollTop = 0;
        this.render();
        return;
      case 'G':
        this.model.recentTurnDetailScrollTop = this.getRecentTurnDetailMaxScrollTop();
        this.render();
        return;
      case 'escape':
      case 'o':
        this.closeRecentTurnDetail();
        return;
      case 'left':
      case 'h':
        this.cycleRecentTurnSelection(-1, {
          resetDetailScrollTop: true,
        // Provider-specific function removed);
        return;
      case 'right':
      case 'l':
        this.cycleRecentTurnSelection(1, {
          resetDetailScrollTop: true,
        // Provider-specific function removed);
        return;
      case 'b':
        void this.returnToRoomBrowser();
        return;
      case 'i':
      case 'm':
        this.closeRecentTurnDetail();
        this.focusComposer();
        return;
      case 'r':
        void this.refreshCurrentRoom();
        return;
      case 's':
        void this.stopActiveRun();
        return;
      case 'p':
        void this.toggleQueuePause();
        return;
      default:
        break;
    // Provider-specific function removed

    switch (key.sequence) {
      case '[':
        this.cycleRecentTurnSelection(-1, {
          resetDetailScrollTop: true,
        // Provider-specific function removed);
        return;
      case ']':
        this.cycleRecentTurnSelection(1, {
          resetDetailScrollTop: true,
        // Provider-specific function removed);
        return;
      default:
        break;
    // Provider-specific function removed

  ***REMOVED***input === '\r' || input === '\n') {
      this.closeRecentTurnDetail();
    // Provider-specific function removed
  // Provider-specific function removed

  private handleComposerKeypress(input: string, key: readline.Key): void {
  ***REMOVED***key.ctrl && key.name === 'u') {
      this.model.draftMessage = '';
      this.render();
      return;
    // Provider-specific function removed

    switch (key.name) {
      case 'escape':
        this.model.composerFocused = false;
        this.render();
        return;
      case 'return':
      case 'enter':
        void this.submitDraftMessage();
        return;
      case 'backspace':
        this.deleteDraftCharacter();
        return;
      case 'delete':
        return;
      default:
        break;
    // Provider-specific function removed

  ***REMOVED***isTextInputChunk(input, key)) {
      this.appendDraftMessage(input);
    // Provider-specific function removed
  // Provider-specific function removed

  private async openSelectedRoom(): Promise<void> {
    const selected = this.getSelectedVisibleBrowserEntry();
  ***REMOVED***!selected) {
      return;
    // Provider-specific function removed

    this.markBrowserRoomRead(selected.room.roomId, resolveBrowserEntryUpdatedAt(selected));
    await this.attachRoomWatcher(selected.room.roomId, this.refreshMs, {
      modeLabel: 'Room watcher',
    // Provider-specific function removed);
  // Provider-specific function removed

  private async returnToRoomBrowser(): Promise<void> {
    const roomId = this.model.roomId;
    const updatedAt = this.model.updatedAt;

    await this.attachRoomBrowser(this.refreshMs);

  ***REMOVED***!roomId) {
      this.model.browserActionNote = 'Returned to the room browser.';
      this.render();
      return;
    // Provider-specific function removed

    const selectedEntry = this.model.browserRooms.find((entry) => entry.room.roomId === roomId);
  ***REMOVED***!selectedEntry) {
      this.model.browserActionNote =
        `Returned to the room browser. Room ${shortId(roomId)// Provider-specific function removed is no longer available.`;
      this.render();
      return;
    // Provider-specific function removed

    this.markBrowserRoomRead(roomId, updatedAt ?? resolveBrowserEntryUpdatedAt(selectedEntry));
    const visibleEntries = getVisibleBrowserEntries(this.model);
    const visibleIndex = visibleEntries.findIndex((entry) => entry.room.roomId === roomId);

  ***REMOVED***visibleIndex >= 0) {
      this.model.browserSelectedIndex = visibleIndex;
      this.model.browserActionNote =
        `Returned to the room browser. Selected room ${shortId(roomId)// Provider-specific function removed.`;
    // Provider-specific function removed else {
      this.model.browserActionNote =
        `Returned to the room browser. Room ${shortId(roomId)// Provider-specific function removed is hidden by the current filters.`;
    // Provider-specific function removed

    this.model.browserActionError = undefined;
    this.clearBrowserPendingDelete();
    this.render();
  // Provider-specific function removed

  private moveBrowserSelection(delta: number): void {
    const visibleEntries = getVisibleBrowserEntries(this.model);
    this.model.browserSelectedIndex = clamp(
      this.model.browserSelectedIndex + delta,
      0,
      Math.max(0, visibleEntries.length - 1),
    );
    this.clearBrowserPendingDelete();
    this.render();
  // Provider-specific function removed

  private markBrowserRoomRead(roomId: string, updatedAt?: string): void {
  ***REMOVED***!roomId) {
      return;
    // Provider-specific function removed

    const nextStamp = updatedAt ?? new Date().toISOString();
  ***REMOVED***this.model.browserReadUpdatedAtByRoomId[roomId] !== nextStamp) {
      this.model.browserReadUpdatedAtByRoomId[roomId] = nextStamp;
      this.persistBrowserState();
    // Provider-specific function removed
    this.model.browserUnreadRoomIds = this.model.browserUnreadRoomIds.filter(
      (item) => item !== roomId,
    );
  // Provider-specific function removed

  private persistBrowserState(): void {
    saveBrowserState({
      readUpdatedAtByRoomId: this.model.browserReadUpdatedAtByRoomId,
      archivedRoomIds: this.model.browserArchivedRoomIds,
      hiddenRoomIds: this.model.browserHiddenRoomIds,
      hideTestRooms: this.model.browserHideTestRooms,
      filterMode: this.model.browserFilterMode,
      roomTypeFilter: this.model.browserRoomTypeFilter,
      sortMode: this.model.browserSortMode,
    // Provider-specific function removed);
  // Provider-specific function removed

  private getSelectedVisibleBrowserEntry(): RoomBrowserEntry | undefined {
    const visibleEntries = getVisibleBrowserEntries(this.model);
    return visibleEntries[this.model.browserSelectedIndex];
  // Provider-specific function removed

  private cycleFilter(delta: number): void {
    const options = buildFilterOptions(this.model.messages);
  ***REMOVED***options.length <= 1) {
      this.model.filterAuthorId = undefined;
      this.render();
      return;
    // Provider-specific function removed

    const currentIndex = options.findIndex(
      (option) => option.authorId === this.model.filterAuthorId,
    );
    const baseIndex = currentIndex >= 0 ? currentIndex : 0;
    const nextIndex = (baseIndex + delta + options.length) % options.length;
    this.model.filterAuthorId = options[nextIndex]?.authorId;
    this.model.scrollTop = 0;
    this.model.autoScroll = true;
    this.render();
  // Provider-specific function removed

  private ensureValidFilter(): void {
    const options = buildFilterOptions(this.model.messages);
  ***REMOVED***!options.some((option) => option.authorId === this.model.filterAuthorId)) {
      this.model.filterAuthorId = undefined;
    // Provider-specific function removed
  // Provider-specific function removed

  private syncRecentTurnSelection(): void {
    const recentTurnCount = buildSidebarRecentTurnEntries(this.model).length;
    this.model.selectedRecentTurnIndex = clamp(
      this.model.selectedRecentTurnIndex,
      0,
      Math.max(0, recentTurnCount - 1),
    );
  ***REMOVED***recentTurnCount === 0) {
      this.model.recentTurnDetailOpen = false;
      this.model.recentTurnDetailScrollTop = 0;
      return;
    // Provider-specific function removed

    this.model.recentTurnDetailScrollTop = clamp(
      this.model.recentTurnDetailScrollTop,
      0,
      this.getRecentTurnDetailMaxScrollTop(),
    );
  // Provider-specific function removed

  private cycleRecentTurnSelection(
    delta: number,
    options: {
      resetDetailScrollTop?: boolean;
    // Provider-specific function removed = {// Provider-specific function removed,
  ): void {
    const recentTurns = buildSidebarRecentTurnEntries(this.model);
  ***REMOVED***recentTurns.length === 0) {
      this.model.note = 'No recent turns yet.';
      this.render();
      return;
    // Provider-specific function removed

    this.model.selectedRecentTurnIndex =
      (this.model.selectedRecentTurnIndex + delta + recentTurns.length) % recentTurns.length;
  ***REMOVED***options.resetDetailScrollTop) {
      this.model.recentTurnDetailScrollTop = 0;
    // Provider-specific function removed
    this.render();
  // Provider-specific function removed

  private openRecentTurnDetail(): void {
    const recentTurns = buildSidebarRecentTurnEntries(this.model);
  ***REMOVED***recentTurns.length === 0) {
      this.model.note = 'No recent turns yet.';
      this.render();
      return;
    // Provider-specific function removed

    this.model.recentTurnDetailOpen = true;
    this.model.recentTurnDetailScrollTop = 0;
    this.model.composerFocused = false;
    this.render();
  // Provider-specific function removed

  private closeRecentTurnDetail(): void {
  ***REMOVED***!this.model.recentTurnDetailOpen) {
      return;
    // Provider-specific function removed

    this.model.recentTurnDetailOpen = false;
    this.model.recentTurnDetailScrollTop = 0;
    this.render();
  // Provider-specific function removed

  private scrollRecentTurnDetail(delta: number): void {
  ***REMOVED***!this.model.recentTurnDetailOpen) {
      return;
    // Provider-specific function removed

    this.model.recentTurnDetailScrollTop = clamp(
      this.model.recentTurnDetailScrollTop + delta,
      0,
      this.getRecentTurnDetailMaxScrollTop(),
    );
    this.render();
  // Provider-specific function removed

  private getRecentTurnDetailMaxScrollTop(): number {
    const width = getViewportWidth(this.interactive);
    const height = getViewportHeight(this.interactive);
    return resolveRecentTurnDetailMaxScrollTop(this.model, width, height);
  // Provider-specific function removed

  private async refreshCurrentRoom(): Promise<void> {
  ***REMOVED***!this.model.roomId) {
      return;
    // Provider-specific function removed

    await this.refreshFromRoom(this.model.roomId);
  // Provider-specific function removed

  private async stopActiveRun(): Promise<void> {
  ***REMOVED***!this.model.roomId) {
      this.model.note = 'Open a room before trying to stop a run.';
      this.render();
      return;
    // Provider-specific function removed

  ***REMOVED***!isRoomRunActive(this.model.status)) {
      this.model.note = 'There is no active run to stop right now.';
      this.render();
      return;
    // Provider-specific function removed

  ***REMOVED***!this.stopRun) {
      this.model.note = 'This TUI instance does not have stop-run support.';
      this.render();
      return;
    // Provider-specific function removed

    try {
      const result = await this.stopRun({
        roomId: this.model.roomId,
        executionRunId: this.model.executionRunId,
      // Provider-specific function removed);
      this.model.error = undefined;
      this.model.note =
        result.note ??
        (result.stopped
          ? `Stop requested for run ${shortId(this.model.executionRunId)// Provider-specific function removed.`
          : 'Stop request could not be applied.');
    // Provider-specific function removed catch (error) {
      this.model.error = formatError(error);
    // Provider-specific function removed finally {
      this.render();
    // Provider-specific function removed
  // Provider-specific function removed

  private async toggleQueuePause(): Promise<void> {
  ***REMOVED***!this.model.roomId) {
      this.model.note = 'Open a room before changing queue pause state.';
      this.render();
      return;
    // Provider-specific function removed

  ***REMOVED***!this.setQueuePaused) {
      this.model.note = 'This TUI instance does not have queue pause support.';
      this.render();
      return;
    // Provider-specific function removed

    try {
      const nextPaused = !this.model.queuePaused;
      const result = await this.setQueuePaused({
        roomId: this.model.roomId,
        paused: nextPaused,
      // Provider-specific function removed);
      await this.refreshFromRoom(this.model.roomId);
      this.model.error = undefined;
      this.model.note =
        result.note ??
        (result.paused
          ? `Queue paused for room ${shortId(this.model.roomId)// Provider-specific function removed.`
          : `Queue resumed for room ${shortId(this.model.roomId)// Provider-specific function removed.`);
    // Provider-specific function removed catch (error) {
      this.model.error = formatError(error);
    // Provider-specific function removed finally {
      this.render();
    // Provider-specific function removed
  // Provider-specific function removed

  private focusComposer(): void {
  ***REMOVED***!this.interactive || !this.submitMessage || !this.model.roomId) {
      this.model.note = 'Open a room to send a message.';
      this.render();
      return;
    // Provider-specific function removed

    this.model.recentTurnDetailOpen = false;
    this.model.recentTurnDetailScrollTop = 0;
    this.model.composerFocused = true;
    this.render();
  // Provider-specific function removed

  private appendDraftMessage(input: string): void {
    const normalized = input.replace(/\r?\n/g, ' ');
  ***REMOVED***normalized.length === 0) {
      return;
    // Provider-specific function removed

    this.model.draftMessage += normalized;
    this.render();
  // Provider-specific function removed

  private deleteDraftCharacter(): void {
  ***REMOVED***this.model.draftMessage.length === 0) {
      this.render();
      return;
    // Provider-specific function removed

    const characters = [...this.model.draftMessage];
    characters.pop();
    this.model.draftMessage = characters.join('');
    this.render();
  // Provider-specific function removed

  private async submitDraftMessage(): Promise<void> {
  ***REMOVED***this.model.submittingMessage) {
      return;
    // Provider-specific function removed

  ***REMOVED***!this.interactive || !this.submitMessage || !this.model.roomId) {
      this.model.note = 'Open a room to send a message.';
      this.render();
      return;
    // Provider-specific function removed

    const message = this.model.draftMessage.trim();
  ***REMOVED***!message) {
      this.model.note = 'Type a message before sending.';
      this.render();
      return;
    // Provider-specific function removed

    this.model.submittingMessage = true;
    this.model.error = undefined;
    this.render();

    try {
      const result = await this.submitMessage({
        roomId: this.model.roomId,
        authorName: 'You',
        message,
      // Provider-specific function removed);
      await this.refreshFromRoom(this.model.roomId);
      this.model.note = result.note ?? 'Message queued.';
      this.model.draftMessage = '';
      this.model.composerFocused = true;
    // Provider-specific function removed catch (error) {
      this.model.error = formatError(error);
    // Provider-specific function removed finally {
      this.model.submittingMessage = false;
      this.render();
    // Provider-specific function removed
  // Provider-specific function removed
 
  private clearPolling(): void {
  ***REMOVED***!this.pollTimer) {
      return;
    // Provider-specific function removed

    clearInterval(this.pollTimer);
    this.pollTimer = undefined;
  // Provider-specific function removed

  private startPolling(callback: () => void | Promise<void>, refreshMs: number): void {
    this.clearPolling();
    this.pollTimer = setInterval(() => {
      void callback();
    // Provider-specific function removed, refreshMs);
  // Provider-specific function removed

  private enterPlainMode(): void {
    process.stdin.resume();
    this.plainReadline = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: 'You> ',
    // Provider-specific function removed);
    this.plainReadline.on('line', this.boundPlainLine);
    process.on('SIGINT', this.boundSigint);
    process.on('exit', this.boundCleanup);
  // Provider-specific function removed

  private enterInteractiveMode(): void {
    readline.emitKeypressEvents(process.stdin);
  ***REMOVED***process.stdin.isTTY) {
      process.stdin.setRawMode(true);
      process.stdin.resume();
    // Provider-specific function removed
    process.stdout.write('\x1b[?1049h\x1b[?25l');
    process.stdout.on('resize', this.boundResize);
    process.stdin.on('keypress', this.boundKeypress);
    process.on('SIGINT', this.boundSigint);
    process.on('exit', this.boundCleanup);
  // Provider-specific function removed

  private async handlePlainLine(line: string): Promise<void> {
    const trimmed = line.trim();
  ***REMOVED***trimmed.length === 0) {
      this.renderPlainPrompt();
      return;
    // Provider-specific function removed

  ***REMOVED***trimmed === '/quit' || trimmed === '/exit' || trimmed === '/q') {
      this.close();
      return;
    // Provider-specific function removed

  ***REMOVED***trimmed === '/help') {
      this.writePlainLines([
        '[help] Commands: /help | /status | /pause | /resume | /stop | /quit',
        '[help] 直接输入消息并回车即可发送。',
        '[help] 命令：/help | /status | /quit',
      ]);
      return;
    // Provider-specific function removed

  ***REMOVED***trimmed === '/status') {
      this.writePlainLines(buildPlainStatusLines(this.model));
      return;
    // Provider-specific function removed

  ***REMOVED***trimmed === '/stop') {
      await this.stopActiveRun();
      return;
    // Provider-specific function removed

  ***REMOVED***trimmed === '/pause') {
    ***REMOVED***!this.model.queuePaused) {
        await this.toggleQueuePause();
      // Provider-specific function removed else {
        this.model.note = 'Room queue is already paused.';
        this.render();
      // Provider-specific function removed
      return;
    // Provider-specific function removed

  ***REMOVED***trimmed === '/resume') {
    ***REMOVED***this.model.queuePaused) {
        await this.toggleQueuePause();
      // Provider-specific function removed else {
        this.model.note = 'Room queue is already active.';
        this.render();
      // Provider-specific function removed
      return;
    // Provider-specific function removed

  ***REMOVED***!this.submitMessage || !this.model.roomId) {
      this.writePlainLines(['[note] 当前没有打开房间，无法发送消息。']);
      return;
    // Provider-specific function removed

  ***REMOVED***this.model.submittingMessage) {
      this.writePlainLines(['[note] 消息正在发送中，请稍候。']);
      return;
    // Provider-specific function removed

    this.model.submittingMessage = true;
    this.model.error = undefined;
    this.render();

    try {
      const result = await this.submitMessage({
        roomId: this.model.roomId,
        authorName: 'You',
        message: trimmed,
      // Provider-specific function removed);
      await this.refreshFromRoom(this.model.roomId);
      this.model.note = result.note ?? 'Message queued.';
    // Provider-specific function removed catch (error) {
      this.model.error = formatError(error);
    // Provider-specific function removed finally {
      this.model.submittingMessage = false;
      this.render();
    // Provider-specific function removed
  // Provider-specific function removed

  private applyStepStarted(event: WorkflowStepObserverEvent<ChatroomState>): void {
    this.model.screenMode = 'room';
    this.model.status = 'running';
    this.model.currentStepId = event.stepId;
    this.model.currentAgentIds = event.agentIds;
    this.model.messages = [...event.state.messages];
    this.model.roleplayScene = event.state.roleplayScene;
    this.model.trace = [...event.trace];
    this.model.updatedAt = event.observedAt;
    this.ensureValidFilter();
    this.syncRecentTurnSelection();
    this.render();
  // Provider-specific function removed

  private applyStepCompleted(event: WorkflowStepCompletedObserverEvent<ChatroomState>): void {
    this.model.screenMode = 'room';
    this.model.status = 'running';
    this.model.currentStepId = event.stepId;
    this.model.currentAgentIds = event.agentIds;
    this.model.messages = [...event.state.messages];
    this.model.roleplayScene = event.state.roleplayScene;
    this.model.trace = [...event.trace];
    this.model.finalSummary = event.state.finalSummary;
    this.model.updatedAt = event.observedAt;
    this.ensureValidFilter();
    this.syncRecentTurnSelection();
    this.render();
  // Provider-specific function removed

  private scrollBy(delta: number): void {
    const width = getViewportWidth(this.interactive);
    const height = getViewportHeight(this.interactive);
    const layout = resolveRoomLayout(width, height);
    const transcriptHeight = layout.transcriptHeight;
    const transcriptLines = buildFullTranscriptLines(
      filterMessages(this.model.messages, this.model.filterAuthorId),
      layout.chatInnerWidth,
    );
    const maxScrollTop = Math.max(0, transcriptLines.length - transcriptHeight);
    this.model.autoScroll = false;
    this.model.scrollTop = clamp(this.model.scrollTop + delta, 0, maxScrollTop);
    this.render();
  // Provider-specific function removed

  private render(): void {
  ***REMOVED***this.closed) {
      return;
    // Provider-specific function removed

  ***REMOVED***this.model.screenMode === 'browser') {
      this.refreshSelectedBrowserCheckpoint();
    // Provider-specific function removed

  ***REMOVED***this.plainMode) {
    ***REMOVED***this.model.screenMode === 'room') {
        this.renderPlainRoom();
      // Provider-specific function removed
      return;
    // Provider-specific function removed

    const width = getViewportWidth(this.interactive);
    const height = getViewportHeight(this.interactive);
    const output =
      this.model.screenMode === 'browser'
        ? renderBrowserScreen(this.model, {
            width,
            height,
            useColor: this.interactive,
          // Provider-specific function removed)
        : renderRoomScreen(this.model, {
            width,
            height,
            useColor: this.interactive,
          // Provider-specific function removed);

  ***REMOVED***output === this.lastRenderOutput) {
      return;
    // Provider-specific function removed

    this.lastRenderOutput = output;

  ***REMOVED***this.interactive) {
      this.renderInteractiveOutput(output, width, height);
      return;
    // Provider-specific function removed
  // Provider-specific function removed

  private renderInteractiveOutput(output: string, width: number, height: number): void {
    const nextLines = output.split('\n');
    const previousLines =
      this.lastRenderWidth === width && this.lastRenderHeight === height ? this.lastRenderLines : [];
    const blankLine = ' '.repeat(width);

  ***REMOVED***previousLines.length === 0) {
      process.stdout.write(`\x1b[H${output// Provider-specific function removed`);
      this.lastRenderLines = nextLines;
      this.lastRenderWidth = width;
      this.lastRenderHeight = height;
      return;
    // Provider-specific function removed

    const totalLines = Math.max(previousLines.length, nextLines.length);
    let buffer = '';

    for (let index = 0; index < totalLines; index += 1) {
      const nextLine = nextLines[index] ?? blankLine;
      const previousLine = previousLines[index] ?? blankLine;
    ***REMOVED***nextLine === previousLine) {
        continue;
      // Provider-specific function removed

      buffer += `\x1b[${index + 1// Provider-specific function removed;1H${nextLine// Provider-specific function removed`;
    // Provider-specific function removed

  ***REMOVED***buffer.length > 0) {
      process.stdout.write(buffer);
    // Provider-specific function removed

    this.lastRenderLines = nextLines;
    this.lastRenderWidth = width;
    this.lastRenderHeight = height;
  // Provider-specific function removed

  private refreshSelectedBrowserCheckpoint(): void {
  ***REMOVED***!this.getLatestResumableCheckpoint) {
      this.model.browserSelectedCheckpoint = null;
      return;
    // Provider-specific function removed

    const selected = this.getSelectedVisibleBrowserEntry();
    this.model.browserSelectedCheckpoint = selected
      ? this.getLatestResumableCheckpoint(selected.room.roomId)
      : null;
  // Provider-specific function removed

  private renderPlainRoom(): void {
    const lines: string[] = [];
    const roomChanged = this.plainRoomId !== this.model.roomId;
  ***REMOVED***roomChanged) {
      this.plainRoomId = this.model.roomId;
      this.plainPrintedMessageIds.clear();
      this.plainLastStatusKey = '';
      this.plainLastNote = undefined;
      this.plainLastError = undefined;
      this.plainDidPrintWelcome = false;
      this.plainLastMessageAt = undefined;
    // Provider-specific function removed

  ***REMOVED***!this.plainDidPrintWelcome) {
      lines.push(...buildPlainWelcomeLines(this.model));
      this.plainDidPrintWelcome = true;
      const initialMessages = this.model.messages.slice(-Math.min(12, this.model.messages.length));
      const hiddenCount = Math.max(0, this.model.messages.length - initialMessages.length);
      const attentionContext = buildTranscriptAttentionContext(this.model.messages);
    ***REMOVED***hiddenCount > 0) {
        lines.push(`[history] 已省略更早的 ${hiddenCount// Provider-specific function removed 条消息`);
      // Provider-specific function removed
      for (const [offset, message] of initialMessages.entries()) {
        const index = Math.max(0, this.model.messages.length - initialMessages.length + offset);
        appendPlainRenderedMessage(
          lines,
          message,
          this.plainLastMessageAt,
          resolveTranscriptMessageAttention(message, index, attentionContext),
          true,
        );
        this.plainLastMessageAt = message.createdAt;
        this.plainPrintedMessageIds.add(message.id);
      // Provider-specific function removed
    // Provider-specific function removed else {
      const attentionContext = buildTranscriptAttentionContext(this.model.messages);
      for (const [index, message] of this.model.messages.entries()) {
      ***REMOVED***this.plainPrintedMessageIds.has(message.id)) {
          continue;
        // Provider-specific function removed

        appendPlainRenderedMessage(
          lines,
          message,
          this.plainLastMessageAt,
          resolveTranscriptMessageAttention(message, index, attentionContext),
          true,
        );
        this.plainLastMessageAt = message.createdAt;
        this.plainPrintedMessageIds.add(message.id);
      // Provider-specific function removed
    // Provider-specific function removed

    const statusKey = [
      this.model.status,
      this.model.queuePaused ? 'paused' : 'live',
      String(this.model.pendingMessages.length),
      this.model.currentStepId ?? '-',
      (this.model.currentAgentIds ?? []).join(','),
      this.model.executionRunId ?? '-',
    ].join('|');
  ***REMOVED***statusKey !== this.plainLastStatusKey) {
      lines.push(...buildPlainStatusLines(this.model));
      this.plainLastStatusKey = statusKey;
    // Provider-specific function removed

  ***REMOVED***this.model.note && this.model.note !== this.plainLastNote) {
      lines.push(`[note] ${this.model.note// Provider-specific function removed`);
      this.plainLastNote = this.model.note;
    // Provider-specific function removed

  ***REMOVED***this.model.error && this.model.error !== this.plainLastError) {
      lines.push(`[error] ${this.model.error// Provider-specific function removed`);
      this.plainLastError = this.model.error;
    // Provider-specific function removed

  ***REMOVED***lines.length > 0) {
      this.writePlainLines(lines);
    // Provider-specific function removed else {
      this.renderPlainPrompt();
    // Provider-specific function removed
  // Provider-specific function removed

  private writePlainLines(lines: readonly string[]): void {
  ***REMOVED***lines.length === 0) {
      this.renderPlainPrompt();
      return;
    // Provider-specific function removed

    const text = lines.join('\n');
  ***REMOVED***this.plainReadline) {
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
    // Provider-specific function removed
    process.stdout.write(`${text// Provider-specific function removed\n`);
    this.renderPlainPrompt();
  // Provider-specific function removed

  private renderPlainPrompt(): void {
    this.plainReadline?.prompt(true);
  // Provider-specific function removed
// Provider-specific function removed

export function loadChatroomRoomSnapshot(roomId: string): ChatroomRoomSnapshot {
  const room = getChatroomRoomRecord(roomId);
  return {
    room,
    state: room ? loadChatroomRoomState(roomId) : null,
    runs: listChatroomExecutionRuns(roomId, 6),
    live: loadChatroomLiveSnapshot(roomId),
  // Provider-specific function removed;
// Provider-specific function removed

function renderBrowserScreen(
  model: Readonly<ChatroomScreenModel>,
  viewport: {
    width: number;
    height: number;
    useColor: boolean;
  // Provider-specific function removed,
): string {
  const width = Math.max(60, viewport.width);
  const height = Math.max(24, viewport.height);
  const layout = resolveBrowserLayout(width, height);
  const visibleEntries = getVisibleBrowserEntries(model);
  const selectedEntry = visibleEntries[model.browserSelectedIndex];
  const listLines = buildRoomBrowserPanelLines(
    visibleEntries,
    model.browserSelectedIndex,
    layout.listInnerWidth,
    layout.contentHeight,
    model.browserUnreadRoomIds,
    model.browserArchivedRoomIds,
    model.browserHiddenRoomIds,
    model.browserMarkedRoomIds,
    model.browserSearchQuery,
  );
  const sidebarLines = model.browserCreateActive
    ? buildBrowserCreateLines(model, layout.sidebarInnerWidth, layout.contentHeight)
    : buildBrowserSidebarLines(
        model.browserRooms,
        visibleEntries,
        model.browserSelectedIndex,
        layout.sidebarInnerWidth,
        layout.contentHeight,
        model.browserUnreadRoomIds,
        model,
      );
  const boxedList = buildBoxPanel({
    title: 'Rooms',
    width: layout.listWidth,
    contentLines: listLines,
    useColor: viewport.useColor,
    variant: 'browser-list',
  // Provider-specific function removed);
  const boxedSidebar = buildBoxPanel({
    title: model.browserCreateActive ? 'Create Room' : 'Overview',
    width: layout.sidebarWidth,
    contentLines: sidebarLines,
    useColor: viewport.useColor,
    variant: model.browserCreateActive ? 'browser-create' : 'browser-sidebar',
  // Provider-specific function removed);
  const bodyLines = combineColumns(boxedList, boxedSidebar, layout.listWidth, layout.sidebarWidth);
  const browserInfoLines = [
    fitLine(width, buildBrowserTopLinePrimary(model)),
    fitLine(width, buildBrowserTopLineSecondary(model, selectedEntry)),
    fitLine(width, buildBrowserTopLineTags(model)),
  ].map((line, index) =>
    decorateInfoLine(line, viewport.useColor, index === 0 ? 'primary' : 'secondary'),
  );
  const operationLine = decorateHelpLine(
    fitLine(width, buildBrowserHelpLine(model)),
    viewport.useColor,
  );

***REMOVED***
    decorateHeaderLine(
      fitLine(width, `AX-001 Chatroom TUI | ${model.modeLabel// Provider-specific function removed | ${formatStatus(model.status)// Provider-specific function removed`),
      viewport.useColor,
    ),
    ...browserInfoLines,
    ...bodyLines,
    operationLine,
  ]
    .slice(0, height)
    .join('\n');
// Provider-specific function removed

function renderRoomScreen(
  model: Readonly<ChatroomScreenModel>,
  viewport: {
    width: number;
    height: number;
    useColor: boolean;
  // Provider-specific function removed,
): string {
  const width = Math.max(60, viewport.width);
  const height = Math.max(24, viewport.height);
***REMOVED***model.recentTurnDetailOpen) {
    return renderRecentTurnDetailScreen(model, {
      width,
      height,
      useColor: viewport.useColor,
    // Provider-specific function removed);
  // Provider-specific function removed

  const layout = resolveRoomLayout(width, height);
  const filteredMessages = filterMessages(model.messages, model.filterAuthorId);
  const filterOptions = buildFilterOptions(model.messages);
  const activeFilter = resolveActiveFilter(filterOptions, model.filterAuthorId);
  const transcriptView = model.autoScroll
    ? buildAutoTranscriptView(filteredMessages, layout.chatInnerWidth, layout.transcriptHeight)
    : buildManualTranscriptView(
        filteredMessages,
        layout.chatInnerWidth,
        layout.transcriptHeight,
        model.scrollTop,
      );
  const chatPaneLines = buildChatPaneLines(
    model,
    layout.chatInnerWidth,
    layout.contentHeight,
    transcriptView.lines,
  );
  const sidebarLines = buildSidebarLines(
    model,
    layout.sidebarInnerWidth,
    layout.contentHeight,
    transcriptView.visibleMessageCount,
    transcriptView.hiddenMessageCount,
    activeFilter,
    transcriptView.scrollTop,
    transcriptView.maxScrollTop,
  );

  const boxedChatPane = buildBoxPanel({
    title: 'Chat',
    width: layout.chatWidth,
    contentLines: chatPaneLines,
    useColor: viewport.useColor,
    variant: 'chat',
  // Provider-specific function removed);
  const boxedSidebar = buildBoxPanel({
    title: 'Status',
    width: layout.sidebarWidth,
    contentLines: sidebarLines,
    useColor: viewport.useColor,
    variant: 'sidebar',
  // Provider-specific function removed);

  const bodyLines = combineColumns(
    boxedChatPane,
    boxedSidebar,
    layout.chatWidth,
    layout.sidebarWidth,
  );

  const roomInfoLines = [
    fitLine(width, buildTopRoomLinePrimary(model)),
    fitLine(width, buildTopRoomLineSecondary(model, activeFilter, transcriptView)),
    fitLine(width, buildTopRoomLineTertiary(model)),
  ].map((line, index) =>
    decorateInfoLine(line, viewport.useColor, index === 0 ? 'primary' : 'secondary'),
  );

  const operationLine = decorateHelpLine(
    fitLine(width, buildOperationHelpLine(model)),
    viewport.useColor,
  );

***REMOVED***
    decorateHeaderLine(
      fitLine(width, `AX-001 Chatroom TUI | ${model.modeLabel// Provider-specific function removed | ${formatStatus(model.status)// Provider-specific function removed`),
      viewport.useColor,
    ),
    ...roomInfoLines,
    ...bodyLines,
    operationLine,
  ]
    .slice(0, height)
    .join('\n');
// Provider-specific function removed

function renderRecentTurnDetailScreen(
  model: Readonly<ChatroomScreenModel>,
  viewport: {
    width: number;
    height: number;
    useColor: boolean;
  // Provider-specific function removed,
): string {
  const width = Math.max(60, viewport.width);
  const height = Math.max(24, viewport.height);
  const recentTurns = buildRecentTurnStatusEntries(model);
  const selectedTurn =
    recentTurns[clamp(model.selectedRecentTurnIndex, 0, Math.max(0, recentTurns.length - 1))];
  const contentHeight = Math.max(8, height - 6);
  const detailLines = buildRecentTurnDetailPageLines(model, selectedTurn, Math.max(20, width - 2));
  const maxScrollTop = Math.max(0, detailLines.length - contentHeight);
  const scrollTop = clamp(model.recentTurnDetailScrollTop, 0, maxScrollTop);
  const visibleLines = detailLines.slice(scrollTop, scrollTop + contentHeight);
  const detailPanel = buildBoxPanel({
    title: selectedTurn
      ? `Turn Detail ${clamp(model.selectedRecentTurnIndex + 1, 1, recentTurns.length)// Provider-specific function removed/${recentTurns.length// Provider-specific function removed`
      : 'Turn Detail',
    width,
    contentLines: padLines(visibleLines, contentHeight, Math.max(4, width - 2)),
    useColor: viewport.useColor,
    variant: 'sidebar',
  // Provider-specific function removed);
  const infoLines = [
    fitLine(width, buildRecentTurnDetailTopLinePrimary(model, selectedTurn, recentTurns.length)),
    fitLine(width, buildRecentTurnDetailTopLineSecondary(model, selectedTurn, scrollTop, maxScrollTop)),
    fitLine(width, buildTopRoomLineTertiary(model)),
  ].map((line, index) =>
    decorateInfoLine(line, viewport.useColor, index === 0 ? 'primary' : 'secondary'),
  );
  const operationLine = decorateHelpLine(
    fitLine(width, buildOperationHelpLine(model)),
    viewport.useColor,
  );

***REMOVED***
    decorateHeaderLine(
      fitLine(width, `AX-001 Chatroom TUI | ${model.modeLabel// Provider-specific function removed | ${formatStatus(model.status)// Provider-specific function removed`),
      viewport.useColor,
    ),
    ...infoLines,
    ...detailPanel,
    operationLine,
  ]
    .slice(0, height)
    .join('\n');
// Provider-specific function removed

function buildBrowserTopLinePrimary(model: Readonly<ChatroomScreenModel>): string {
  const visibleEntries = getVisibleBrowserEntries(model);
  const selected =
    visibleEntries.length > 0
      ? `${clamp(model.browserSelectedIndex + 1, 1, visibleEntries.length)// Provider-specific function removed/${visibleEntries.length// Provider-specific function removed`
      : '-';
  const liveCount = model.browserRooms.filter((entry) => isBrowserRoomLive(entry)).length;
  const unreadCount = model.browserUnreadRoomIds.length;

***REMOVED***
    `Rooms: ${visibleEntries.length// Provider-specific function removed/${model.browserRooms.length// Provider-specific function removed`,
    `Selected: ${selected// Provider-specific function removed`,
    `Live: ${liveCount// Provider-specific function removed`,
    `Unread: ${unreadCount// Provider-specific function removed`,
    `Updated: ${formatTimestamp(model.updatedAt)// Provider-specific function removed`,
  ].join(' | ');
// Provider-specific function removed

function buildBrowserTopLineSecondary(
  model: Readonly<ChatroomScreenModel>,
  selectedEntry: RoomBrowserEntry | undefined,
): string {
***REMOVED***!selectedEntry) {
    return `Topic: - | Status: ${formatBrowserFilterMode(model.browserFilterMode)// Provider-specific function removed | Type: ${formatBrowserRoomTypeFilter(model.browserRoomTypeFilter)// Provider-specific function removed | Search: ${model.browserSearchQuery.trim() || '-'// Provider-specific function removed`;
  // Provider-specific function removed

***REMOVED***
    `Topic: ${truncateText(selectedEntry.room.topic, 28)// Provider-specific function removed`,
    `Type: ${buildBrowserRoomTypeDescriptor(selectedEntry.room.roomType)// Provider-specific function removed`,
    `Status: ${browserStatusLabel(selectedEntry)// Provider-specific function removed`,
    `Main: ${shortId(selectedEntry.room.mainSessionId)// Provider-specific function removed`,
    `Msgs: ${selectedEntry.room.messageCount// Provider-specific function removed`,
  ].join(' | ');
// Provider-specific function removed

function buildBrowserTopLineTags(model: Readonly<ChatroomScreenModel>): string {
  const query = model.browserSearchQuery.trim();
***REMOVED***
    'Tags:',
    `[F:${formatBrowserFilterMode(model.browserFilterMode)// Provider-specific function removed]`,
    `[T:${formatBrowserRoomTypeFilterTag(model.browserRoomTypeFilter)// Provider-specific function removed]`,
    `[S:${formatBrowserSortMode(model.browserSortMode)// Provider-specific function removed]`,
    `[Q:${query ? truncateText(query, 16) : '-'// Provider-specific function removed]`,
    `[TEST:${model.browserHideTestRooms ? 'hidden' : 'shown'// Provider-specific function removed]`,
    `[MK:${model.browserMarkedRoomIds.length// Provider-specific function removed]`,
return null;
// Provider-specific function removed

function buildRoomBrowserPanelLines(
  rooms: readonly RoomBrowserEntry[],
  selectedIndex: number,
  width: number,
  bodyHeight: number,
  unreadRoomIds: readonly string[],
  archivedRoomIds: readonly string[],
  hiddenRoomIds: readonly string[],
  markedRoomIds: readonly string[],
  searchQuery: string,
): string[] {
  const entryHeight = 6;
***REMOVED***rooms.length === 0) {
    return padLines(
      [
        fitLine(width, 'No visible rooms for the current browser status/type filters.'),
        fitLine(width, ''),
        fitLine(width, '> Try `/` to search, `f` for status, `v` for type, `t` for test rooms.'),
      ],
      bodyHeight,
      width,
    );
  // Provider-specific function removed

  const roomsPerPage = Math.max(1, Math.floor(bodyHeight / entryHeight));
  const window = resolveBrowserWindow(rooms.length, selectedIndex, roomsPerPage);
  const lines: string[] = [];
  for (let index = window.startIndex; index <= window.endIndex; index += 1) {
    const entry = rooms[index];
  ***REMOVED***!entry) {
      continue;
    // Provider-specific function removed

    const isSelected = index === clamp(selectedIndex, 0, rooms.length - 1);
    const titlePrefix = isSelected ? '[SEL]' : '     ';
    const detailPrefix = isSelected ? '> ' : '  ';
    const roomId = entry.room.roomId;
    const roomTypeBadge = resolveBrowserRoomTypeBadge(entry.room.roomType);
    const searchHits = getBrowserSearchHitFields(entry, searchQuery);
    const badgeBlock = `${buildBrowserBadgeBlock(
      entry,
      unreadRoomIds.includes(roomId),
      searchHits.length > 0,
    )// Provider-specific function removed${buildBrowserStateBadgeBlock(
      archivedRoomIds.includes(roomId),
      hiddenRoomIds.includes(roomId),
      markedRoomIds.includes(roomId),
    )// Provider-specific function removed`;
    const title =
      `${titlePrefix// Provider-specific function removed ${badgeBlock// Provider-specific function removed ${roomTypeBadge// Provider-specific function removed ` +
      `${String(index + 1).padStart(2, '0')// Provider-specific function removed ${truncateText(entry.room.topic, 28)// Provider-specific function removed`;
    const hasRunHit = searchHits.includes('run') || searchHits.includes('main');
    const metaPrefix =
      searchHits.includes('room') || hasRunHit
        ? `${detailPrefix// Provider-specific function removed[HIT] `
        : detailPrefix;
    const objectivePrefix = searchHits.includes('objective')
      ? `${detailPrefix// Provider-specific function removed[HIT] `
      : detailPrefix;
    const updatedPrefix = hasRunHit
      ? `${detailPrefix// Provider-specific function removed[HIT] `
      : detailPrefix;
    const meta =
      `${metaPrefix// Provider-specific function removedRoom ${shortId(entry.room.roomId)// Provider-specific function removed | ` +
      `Main ${shortId(entry.room.mainSessionId)// Provider-specific function removed | ` +
      `${entry.room.speakerIds.length// Provider-specific function removed agents | ${entry.room.messageCount// Provider-specific function removed msgs`;
    const objective = `${objectivePrefix// Provider-specific function removedGoal: ${truncateText(entry.room.objective, 38)// Provider-specific function removed`;
    const updated =
      `${updatedPrefix// Provider-specific function removedUpdated: ${formatTimestamp(entry.live?.updatedAt ?? entry.room.updatedAt)// Provider-specific function removed | ` +
      `Run ${shortId(entry.room.lastExecutionRunId)// Provider-specific function removed`;
    const runState = `${detailPrefix// Provider-specific function removedStatus: ${formatBrowserRunState(entry)// Provider-specific function removed`;

    lines.push(fitLine(width, title));
    lines.push(fitLine(width, meta));
    lines.push(fitLine(width, objective));
    lines.push(fitLine(width, updated));
    lines.push(fitLine(width, runState));
  ***REMOVED***index < window.endIndex) {
      lines.push(fitLine(width, ''));
    // Provider-specific function removed
  // Provider-specific function removed

  return padLines(lines, bodyHeight, width);
// Provider-specific function removed

function buildRoomLine(model: Readonly<ChatroomScreenModel>): string {
***REMOVED***
    `Room: ${shortId(model.roomId)// Provider-specific function removed`,
    `Main: ${shortId(model.roomRecord?.mainSessionId)// Provider-specific function removed`,
    `Type: ${getChatroomRoomTypeShortLabel(model.roomRecord?.roomType ?? DEFAULT_CHATROOM_ROOM_TYPE)// Provider-specific function removed`,
    `Run: ${shortId(model.executionRunId)// Provider-specific function removed`,
    `Resume: ${shortId(model.resumedFromRunId)// Provider-specific function removed`,
    `Agents: ${model.roomRecord?.speakerIds.length ?? estimateSpeakerCount(model)// Provider-specific function removed`,
  ].join(' | ');
// Provider-specific function removed

function resolveBrowserLayout(width: number, height: number): {
  bodyHeight: number;
  contentHeight: number;
  listWidth: number;
  listInnerWidth: number;
  sidebarWidth: number;
  sidebarInnerWidth: number;
// Provider-specific function removed {
  const topLines = 4;
  const bottomLines = 1;
  const bodyHeight = Math.max(10, height - topLines - bottomLines);
  const gapWidth = 1;
  const minListWidth = 32;
  const minSidebarWidth = 30;
  const maxSidebarWidth = Math.max(minSidebarWidth, width - minListWidth - gapWidth);
  const sidebarWidth = clamp(
    Math.floor(width * 0.34),
    minSidebarWidth,
    Math.min(44, maxSidebarWidth),
  );
  const listWidth = Math.max(minListWidth, width - sidebarWidth - gapWidth);
  const contentHeight = Math.max(6, bodyHeight - 2);

  return {
    bodyHeight,
    contentHeight,
    listWidth,
    listInnerWidth: Math.max(24, listWidth - 2),
    sidebarWidth,
    sidebarInnerWidth: Math.max(20, sidebarWidth - 2),
  // Provider-specific function removed;
// Provider-specific function removed

function resolveRoomLayout(width: number, height: number): {
  bodyHeight: number;
  contentHeight: number;
  chatWidth: number;
  chatInnerWidth: number;
  sidebarWidth: number;
  sidebarInnerWidth: number;
  transcriptHeight: number;
// Provider-specific function removed {
  const topLines = 4;
  const bottomLines = 1;
  const bodyHeight = Math.max(10, height - topLines - bottomLines);
  const gapWidth = 1;
  const minChatWidth = 28;
  const minSidebarWidth = 30;
  const maxSidebarWidth = Math.max(minSidebarWidth, width - minChatWidth - gapWidth);
  const sidebarWidth = clamp(
    Math.floor(width * 0.34),
    minSidebarWidth,
    Math.min(46, maxSidebarWidth),
  );
  const chatWidth = Math.max(minChatWidth, width - sidebarWidth - gapWidth);
  const contentHeight = Math.max(6, bodyHeight - 2);
  const chatInnerWidth = Math.max(24, chatWidth - 2);
  const sidebarInnerWidth = Math.max(18, sidebarWidth - 2);
  const transcriptHeight = Math.max(3, contentHeight - 3);

  return {
    bodyHeight,
    contentHeight,
    chatWidth,
    chatInnerWidth,
    sidebarWidth,
    sidebarInnerWidth,
    transcriptHeight,
  // Provider-specific function removed;
// Provider-specific function removed

function buildBrowserSidebarLines(
  allRooms: readonly RoomBrowserEntry[],
  visibleRooms: readonly RoomBrowserEntry[],
  selectedIndex: number,
  width: number,
  bodyHeight: number,
  unreadRoomIds: readonly string[],
  model: Readonly<ChatroomScreenModel>,
): string[] {
  const selectedEntry = visibleRooms[selectedIndex];
  const roomsPerPage = Math.max(1, Math.floor(bodyHeight / 5));
  const window = resolveBrowserWindow(visibleRooms.length, selectedIndex, roomsPerPage);
  const liveCount = allRooms.filter((entry) => isBrowserRoomLive(entry)).length;
  const pausedCount = allRooms.filter((entry) => entry.queuePaused).length;
  const idleCount = allRooms.filter((entry) => !isBrowserRoomLive(entry) && !entry.queuePaused).length;
  const unreadCount = unreadRoomIds.length;
  const totalRuns = allRooms.reduce((sum, entry) => sum + entry.room.runCount, 0);
  const totalMessages = allRooms.reduce((sum, entry) => sum + entry.room.messageCount, 0);
  const archivedCount = model.browserArchivedRoomIds.length;
  const hiddenCount = model.browserHiddenRoomIds.length;
  const markedCount = model.browserMarkedRoomIds.length;
  const lines = [
    fitLine(width, 'Browser status:'),
    fitLine(
      width,
      `Selected: ${selectedEntry ? `${clamp(selectedIndex + 1, 1, visibleRooms.length)// Provider-specific function removed/${visibleRooms.length// Provider-specific function removed` : '-'// Provider-specific function removed`,
    ),
    fitLine(
      width,
      `Window: ${visibleRooms.length > 0 ? `${window.startIndex + 1// Provider-specific function removed-${window.endIndex + 1// Provider-specific function removed` : '-'// Provider-specific function removed`,
    ),
    fitLine(width, `Visible: ${visibleRooms.length// Provider-specific function removed/${allRooms.length// Provider-specific function removed`),
    fitLine(
      width,
      `Live rooms: ${liveCount// Provider-specific function removed | Paused: ${pausedCount// Provider-specific function removed | Idle: ${idleCount// Provider-specific function removed`,
    ),
    fitLine(width, `Unread: ${unreadCount// Provider-specific function removed | Fresh: ${countFreshBrowserRooms(allRooms)// Provider-specific function removed`),
    fitLine(width, `Archived: ${archivedCount// Provider-specific function removed | Hidden: ${hiddenCount// Provider-specific function removed`),
    fitLine(width, `Marked: ${markedCount// Provider-specific function removed | Batch: ${markedCount > 0 ? 'ready' : 'idle'// Provider-specific function removed`),
    fitLine(width, `Exec runs: ${totalRuns// Provider-specific function removed | Main msgs: ${totalMessages// Provider-specific function removed`),
    fitLine(
      width,
      `Search: ${model.browserSearchQuery.trim() || '-'// Provider-specific function removed | Status: ${formatBrowserFilterMode(model.browserFilterMode)// Provider-specific function removed`,
    ),
    fitLine(
      width,
      `Type: ${formatBrowserRoomTypeFilter(model.browserRoomTypeFilter)// Provider-specific function removed | Test rooms: ${model.browserHideTestRooms ? 'hidden' : 'shown'// Provider-specific function removed`,
    ),
    fitLine(
      width,
      `Sort: ${formatBrowserSortMode(model.browserSortMode)// Provider-specific function removed | Use v to cycle room type`,
    ),
    fitLine(
      width,
      markedCount > 0
        ? 'Batch ops: P pause/resume | A archive | X hide | c clear'
        : 'Batch ops: Space mark room | u resume checkpoint | p pause/resume selected',
    ),
    ...(markedCount > 0
      ? [
          fitLine(width, ''),
          ...wrapLabeledSection(
            'Marked rooms',
            model.browserMarkedRoomIds.slice(0, 6).map((roomId) => shortId(roomId)).join(', '),
            width,
          ).map((line) => fitLine(width, line)),
        ]
      : []),
    fitLine(width, ''),
    ...buildBrowserSelectionLines(
      selectedEntry,
      width,
      unreadRoomIds.includes(selectedEntry?.room.roomId ?? ''),
      model,
    ),
  ];

***REMOVED***model.browserActionNote) {
    lines.push(fitLine(width, ''));
    lines.push(...wrapLabeledSection('Action', model.browserActionNote, width).map((line) => fitLine(width, line)));
  // Provider-specific function removed

***REMOVED***model.browserActionError) {
    lines.push(fitLine(width, ''));
    lines.push(...wrapLabeledSection('Error', model.browserActionError, width).map((line) => fitLine(width, line)));
  // Provider-specific function removed

  return padLines(lines, bodyHeight, width);
// Provider-specific function removed

function buildBrowserCreateLines(
  model: Readonly<ChatroomScreenModel>,
  width: number,
  bodyHeight: number,
): string[] {
  const roomTypeSpec = resolveCreateRoomTypeSpec(model.browserCreateRoomType);
  const hasAdminConversation = Boolean(model.browserCreateAdminConversation);
  const modeLabel = model.browserCreateField === 'mode' ? '[*] Mode' : '[ ] Mode';
  const topicLabel = model.browserCreateField === 'topic' ? '[*] Topic' : '[ ] Topic';
  const objectiveLabel =
    model.browserCreateField === 'objective' ? '[*] Objective' : '[ ] Objective';
  const roomTypeLabel =
    model.browserCreateField === 'roomType' ? '[*] Room Type' : '[ ] Room Type';
  const speakersLabel =
    model.browserCreateField === 'speakers' ? '[*] Speakers' : '[ ] Speakers';
  const scoreTemplateLabel =
    model.browserCreateField === 'scoreTemplateId'
      ? '[*] Score Template'
      : '[ ] Score Template';
  const scoreDimensionsLabel =
    model.browserCreateField === 'scoreDimensions'
      ? '[*] Score Dimensions'
      : '[ ] Score Dimensions';
  const adminRequestLabel =
    model.browserCreateField === 'adminRequest'
      ? hasAdminConversation
        ? '[*] Your Reply'
        : '[*] Admin Request'
      : hasAdminConversation
        ? '[ ] Your Reply'
        : '[ ] Admin Request';
  const speakerPreview =
    model.browserCreateSpeakers.trim() || String(roomTypeSpec.recommendedSpeakerCount);
  const scoreTemplatePreview =
    model.browserCreateScoreTemplateId.trim() || '(optional, leave empty to auto-select by role)';
  const scoreDimensionsPreview =
    model.browserCreateScoreDimensions.trim() ||
    '(optional, split by comma or | to force custom scoring dimensions)';
  const lines = [
    fitLine(width, 'New room:'),
    fitLine(width, modeLabel),
    fitLine(width, `  ${formatBrowserCreateModeLabel(model.browserCreateMode)// Provider-specific function removed`),
      ...wrapToWidth(
        model.browserCreateMode === 'admin'
          ? 'Platform admin will choose the scenario template, title, slots, and runtime defaults from your brief.'
          : 'Manual mode lets you set topic/objective/room type/speakers directly, with optional interview score template + dimensions.',
        Math.max(20, width - 2),
      ).map((line) => fitLine(width, `  ${line// Provider-specific function removed`)),
  ];

***REMOVED***model.browserCreateMode === 'admin') {
  ***REMOVED***model.browserCreateAdminTentativeScenarioTemplateId) {
      lines.push(fitLine(width, ''));
      lines.push(
        ...wrapLabeledSection(
          'Tentative scenario',
          model.browserCreateAdminTentativeScenarioTemplateId,
          width,
        ).map((line) => fitLine(width, line)),
      );
    // Provider-specific function removed

  ***REMOVED***model.browserCreateAdminAssistantMessage) {
      lines.push(fitLine(width, ''));
      lines.push(
        ...wrapLabeledSection(
          'Planner',
          model.browserCreateAdminAssistantMessage,
          width,
        ).map((line) => fitLine(width, line)),
      );
    // Provider-specific function removed

  ***REMOVED***model.browserCreateAdminFollowUpQuestions.length > 0) {
      lines.push(fitLine(width, 'Questions:'));
      for (const [index, question] of model.browserCreateAdminFollowUpQuestions.entries()) {
        lines.push(
          ...wrapToWidth(
            `${index + 1// Provider-specific function removed. ${question// Provider-specific function removed`,
            Math.max(20, width - 2),
          ).map((line) => fitLine(width, line)),
        );
      // Provider-specific function removed
    // Provider-specific function removed

    lines.push(
      fitLine(width, ''),
      fitLine(width, adminRequestLabel),
      ...wrapToWidth(
        model.browserCreateAdminRequest ||
          (hasAdminConversation
            ? '(reply to the platform admin; one message can answer all questions)'
            : '(describe the room you want the platform admin to create)'),
        Math.max(20, width - 2),
      ).map((line) => fitLine(width, `  ${line// Provider-specific function removed`)),
      fitLine(width, ''),
      fitLine(
        width,
        model.browserCreateSubmitting
          ? 'Submitting...'
          : hasAdminConversation
            ? 'Enter send reply | Tab next | Left/Right change mode | Esc cancel'
            : 'Enter create | Tab next | Left/Right change mode | Esc cancel',
      ),
    );
  // Provider-specific function removed else {
    lines.push(
      fitLine(width, ''),
      fitLine(width, topicLabel),
      ...wrapToWidth(
        model.browserCreateTopic || '(enter topic)',
        Math.max(20, width - 2),
      ).map((line) => fitLine(width, `  ${line// Provider-specific function removed`)),
      fitLine(width, ''),
      fitLine(width, objectiveLabel),
      ...wrapToWidth(
        model.browserCreateObjective || '(enter objective)',
        Math.max(20, width - 2),
      ).map((line) => fitLine(width, `  ${line// Provider-specific function removed`)),
      fitLine(width, ''),
      fitLine(width, roomTypeLabel),
      ...wrapToWidth(
        `${roomTypeSpec.label// Provider-specific function removed [${roomTypeSpec.id// Provider-specific function removed]`,
        Math.max(20, width - 2),
      ).map((line) => fitLine(width, `  ${line// Provider-specific function removed`)),
      ...wrapToWidth(
        `${roomTypeSpec.description// Provider-specific function removed`,
        Math.max(20, width - 2),
      ).map((line) => fitLine(width, `  ${line// Provider-specific function removed`)),
      fitLine(
        width,
        `  Behavior: ${roomTypeSpec.behavior// Provider-specific function removed | Summary: ${
          roomTypeSpec.summaryEnabled ? 'on' : 'off'
        // Provider-specific function removed`,
      ),
      fitLine(width, ''),
      fitLine(width, speakersLabel),
      fitLine(
        width,
        `  ${speakerPreview// Provider-specific function removed  (range ${roomTypeSpec.minSpeakerCount// Provider-specific function removed-${roomTypeSpec.maxSpeakerCount// Provider-specific function removed, recommended ${roomTypeSpec.recommendedSpeakerCount// Provider-specific function removed)`,
      ),
      fitLine(width, ''),
      fitLine(width, scoreTemplateLabel),
      ...wrapToWidth(
        `  ${scoreTemplatePreview// Provider-specific function removed`,
        Math.max(20, width - 2),
      ).map((line) => fitLine(width, line)),
      ...wrapToWidth(
        `  Available: ${INTERVIEW_SCORE_TEMPLATE_IDS.join(', ')// Provider-specific function removed`,
        Math.max(20, width - 2),
      ).map((line) => fitLine(width, line)),
      fitLine(width, ''),
      fitLine(width, scoreDimensionsLabel),
      ...wrapToWidth(
        `  ${scoreDimensionsPreview// Provider-specific function removed`,
        Math.max(20, width - 2),
      ).map((line) => fitLine(width, line)),
      fitLine(width, ''),
      fitLine(
        width,
        model.browserCreateSubmitting
          ? 'Submitting...'
          : 'Enter create | Tab next | Left/Right change mode/type | Esc cancel',
      ),
    );
  // Provider-specific function removed

***REMOVED***model.browserCreateNote) {
    lines.push(fitLine(width, ''));
    lines.push(
      ...wrapLabeledSection('Note', model.browserCreateNote, width).map((line) =>
        fitLine(width, line),
      ),
    );
  // Provider-specific function removed

***REMOVED***model.browserCreateError) {
    lines.push(fitLine(width, ''));
    lines.push(
      ...wrapLabeledSection('Error', model.browserCreateError, width).map((line) =>
        fitLine(width, line),
      ),
    );
  // Provider-specific function removed

  return padLines(lines, bodyHeight, width);
// Provider-specific function removed

function buildBrowserCreateLinesLegacy(
  model: Readonly<ChatroomScreenModel>,
  width: number,
  bodyHeight: number,
): string[] {
  const roomTypeSpec = resolveCreateRoomTypeSpec(model.browserCreateRoomType);
  const topicLabel = model.browserCreateField === 'topic' ? '[*] Topic' : '[ ] Topic';
  const objectiveLabel =
    model.browserCreateField === 'objective' ? '[*] Objective' : '[ ] Objective';
  const roomTypeLabel =
    model.browserCreateField === 'roomType' ? '[*] Room Type' : '[ ] Room Type';
  const speakersLabel =
    model.browserCreateField === 'speakers' ? '[*] Speakers' : '[ ] Speakers';
  const speakerPreview =
    model.browserCreateSpeakers.trim() || String(roomTypeSpec.recommendedSpeakerCount);
  const lines = [
    fitLine(width, 'New room:'),
    fitLine(width, topicLabel),
    ...wrapToWidth(
      model.browserCreateTopic || '(请输入 topic)',
      Math.max(20, width - 2),
    ).map((line) => fitLine(width, `  ${line// Provider-specific function removed`)),
    fitLine(width, ''),
    fitLine(width, objectiveLabel),
    ...wrapToWidth(
      model.browserCreateObjective || '(请输入 objective)',
      Math.max(20, width - 2),
    ).map((line) => fitLine(width, `  ${line// Provider-specific function removed`)),
    fitLine(width, ''),
    fitLine(width, roomTypeLabel),
    ...wrapToWidth(
      `${roomTypeSpec.label// Provider-specific function removed [${roomTypeSpec.id// Provider-specific function removed]`,
      Math.max(20, width - 2),
    ).map((line) => fitLine(width, `  ${line// Provider-specific function removed`)),
    ...wrapToWidth(
      `${roomTypeSpec.description// Provider-specific function removed`,
      Math.max(20, width - 2),
    ).map((line) => fitLine(width, `  ${line// Provider-specific function removed`)),
    fitLine(width, `  Behavior: ${roomTypeSpec.behavior// Provider-specific function removed | Summary: ${roomTypeSpec.summaryEnabled ? 'on' : 'off'// Provider-specific function removed`),
    fitLine(width, ''),
    fitLine(width, speakersLabel),
    fitLine(
      width,
      `  ${speakerPreview// Provider-specific function removed  (range ${roomTypeSpec.minSpeakerCount// Provider-specific function removed-${roomTypeSpec.maxSpeakerCount// Provider-specific function removed, recommended ${roomTypeSpec.recommendedSpeakerCount// Provider-specific function removed)`,
    ),
    fitLine(width, ''),
    fitLine(
      width,
      model.browserCreateSubmitting
        ? 'Submitting...'
        : 'Enter create | Tab next | Left/Right change type | Esc cancel',
    ),
  ];

***REMOVED***model.browserCreateNote) {
    lines.push(fitLine(width, ''));
    lines.push(...wrapLabeledSection('Note', model.browserCreateNote, width).map((line) => fitLine(width, line)));
  // Provider-specific function removed

***REMOVED***model.browserCreateError) {
    lines.push(fitLine(width, ''));
    lines.push(...wrapLabeledSection('Error', model.browserCreateError, width).map((line) => fitLine(width, line)));
  // Provider-specific function removed

  return padLines(lines, bodyHeight, width);
// Provider-specific function removed

function resolveCreateRoomTypeSpec(
  roomType: ChatroomRoomTypeId | string | undefined,
) {
  return resolveChatroomRoomType(roomType ?? DEFAULT_CHATROOM_ROOM_TYPE);
// Provider-specific function removed

function listBrowserCreateFields(mode: BrowserCreateMode): BrowserCreateField[] {
  return mode === 'admin'
    ? ['mode', 'adminRequest']
    : ['mode', 'topic', 'objective', 'roomType', 'speakers', 'scoreTemplateId', 'scoreDimensions'];
// Provider-specific function removed

function formatBrowserCreateModeLabel(mode: BrowserCreateMode): string {
  switch (mode) {
    case 'admin':
      return 'Platform admin planner';
    case 'manual':
    default:
      return 'Manual room setup';
  // Provider-specific function removed
// Provider-specific function removed

function extractChatroomFinalSummaryHeadline(
  summary: ChatroomScreenModel['finalSummary'] | undefined,
): string | undefined {
***REMOVED***!summary) {
    return undefined;
  // Provider-specific function removed

***REMOVED***'executiveSummary' in summary && typeof summary.executiveSummary === 'string') {
    return summary.executiveSummary;
  // Provider-specific function removed

***REMOVED***'narrativeSummary' in summary && typeof summary.narrativeSummary === 'string') {
    return summary.narrativeSummary;
  // Provider-specific function removed

  return undefined;
// Provider-specific function removed

function buildBrowserSelectionLines(
  entry: RoomBrowserEntry | undefined,
  width: number,
  unread: boolean,
  model?: Readonly<ChatroomScreenModel>,
): string[] {
***REMOVED***!entry) {
  ***REMOVED***
      fitLine(width, 'Selection:'),
      fitLine(width, '  -'),
      fitLine(width, ''),
      fitLine(width, 'Latest summary:'),
      fitLine(width, '  -'),
    ];
  // Provider-specific function removed

  const searchHits = getBrowserSearchHitFields(entry, model?.browserSearchQuery ?? '');
  const roomTypeSpec = resolveChatroomRoomType(entry.room.roomType);
  const lines = [
    fitLine(width, 'Selection:'),
    fitLine(
      width,
      `Status: ${buildBrowserBadgeBlock(entry, unread, searchHits.length > 0)// Provider-specific function removed${buildBrowserStateBadgeBlock(
        model?.browserArchivedRoomIds.includes(entry.room.roomId) ?? false,
        model?.browserHiddenRoomIds.includes(entry.room.roomId) ?? false,
        model?.browserMarkedRoomIds.includes(entry.room.roomId) ?? false,
      )// Provider-specific function removed ${browserStatusLabel(entry)// Provider-specific function removed`,
    ),
    fitLine(width, `Room: ${shortId(entry.room.roomId)// Provider-specific function removed`),
    fitLine(width, `Type: ${buildBrowserRoomTypeDescriptor(entry.room.roomType, 'full')// Provider-specific function removed`),
    fitLine(
      width,
      `Mode: ${roomTypeSpec.behavior// Provider-specific function removed | Summary: ${roomTypeSpec.summaryEnabled ? 'on' : 'off'// Provider-specific function removed`,
    ),
    fitLine(
      width,
      `Gov: ${formatRoomBlueprintGovernanceSummary(entry.room.roomBlueprint?.governance)// Provider-specific function removed`,
    ),
    fitLine(
      width,
      `Main: ${shortId(entry.room.mainSessionId)// Provider-specific function removed | Latest run: ${shortId(entry.room.lastExecutionRunId)// Provider-specific function removed`,
    ),
    fitLine(width, `Run state: ${formatBrowserRunState(entry)// Provider-specific function removed`),
    fitLine(
      width,
      `Recovery: ${formatRunRecoverySummary(entry.latestRunRecoveryStats)// Provider-specific function removed`,
    ),
    fitLine(
      width,
      `SO: ${formatRunStructuredSummary(entry.latestRunRecoveryStats)// Provider-specific function removed`,
    ),
    fitLine(width, `Agents: ${entry.room.speakerIds.length// Provider-specific function removed | Exec runs: ${entry.room.runCount// Provider-specific function removed`),
    fitLine(width, `Main msgs: ${entry.room.messageCount// Provider-specific function removed`),
    fitLine(width, `Queue: ${entry.queuePaused ? 'paused' : 'active'// Provider-specific function removed${entry.queuePauseAt ? ` | ${formatTimestamp(entry.queuePauseAt)// Provider-specific function removed` : ''// Provider-specific function removed`),
    ...(entry.queuePaused && entry.queuePauseReason
      ? [fitLine(width, `Pause note: ${truncateText(entry.queuePauseReason, Math.max(24, width - 12))// Provider-specific function removed`)]
      : []),
    fitLine(width, `Updated: ${formatTimestamp(entry.live?.updatedAt ?? entry.room.updatedAt)// Provider-specific function removed`),
    fitLine(
      width,
      model?.browserSelectedCheckpoint
        ? `Resume: ${model.browserSelectedCheckpoint.status// Provider-specific function removed ${shortId(model.browserSelectedCheckpoint.checkpointId)// Provider-specific function removed | ${formatTimestamp(model.browserSelectedCheckpoint.updatedAt)// Provider-specific function removed`
        : 'Resume: none',
    ),
    ...(model?.browserSelectedCheckpoint?.currentStepId
      ? [fitLine(width, `Resume step: ${model.browserSelectedCheckpoint.currentStepId// Provider-specific function removed`)]
      : []),
    ...(searchHits.length > 0
      ? [fitLine(width, `Hits: [HIT] ${searchHits.join(', ')// Provider-specific function removed`)]
      : []),
    ...(model?.browserMarkedRoomIds.includes(entry.room.roomId)
      ? [fitLine(width, 'Batch mark: [MK] selected for batch actions')]
      : []),
    fitLine(width, ''),
    ...wrapLabeledSection('Objective', entry.room.objective, width),
    fitLine(width, ''),
    ...wrapLabeledSection(
      'Latest summary',
      entry.room.lastSummaryPreview ?? '暂无总结预览。',
      width,
    ),
  ];

  return lines.map((line) => fitLine(width, line));
// Provider-specific function removed

function buildChatPaneLines(
  model: Readonly<ChatroomScreenModel>,
  width: number,
  bodyHeight: number,
  transcriptLines: readonly string[],
): string[] {
  const transcriptHeight = Math.max(1, bodyHeight - 3);
  const inputState = model.submittingMessage
    ? 'Input [sending]'
    : model.composerFocused
      ? 'Input [focused]'
      : 'Input [idle]';
  const roomInputHint = buildRoomInputHint(model);
  const helperLine = model.submittingMessage
    ? 'Sending to queue...'
    : model.error
      ? `Error: ${truncateText(model.error, 72)// Provider-specific function removed`
      : model.note
        ? `Note: ${truncateText(model.note, 72)// Provider-specific function removed`
        : model.composerFocused
          ? 'Enter send | Esc blur | Ctrl+U clear'
          : roomInputHint;

***REMOVED***
    ...padLines(transcriptLines, transcriptHeight, width),
    fitLine(width, inputState),
    fitLine(width, buildComposerInputLine(model, width)),
    fitLine(width, helperLine),
  ];
// Provider-specific function removed

function buildSidebarLines(
  model: Readonly<ChatroomScreenModel>,
  width: number,
  bodyHeight: number,
  visibleMessageCount: number,
  hiddenMessageCount: number,
  activeFilter: RoomFilterOption,
  scrollTop: number,
  maxScrollTop: number,
): string[] {
  const summaryLines = buildSidebarSummaryLines(
    model,
    width,
    visibleMessageCount,
    hiddenMessageCount,
    activeFilter,
    scrollTop,
    maxScrollTop,
  );
  const roleplayLines = buildRoleplaySceneLines(model, width);
  const alertLines = buildSidebarAlertLines(model, width);
  const expectedLines = buildExpectedAgentLines(model, width);
  const traceLines = buildSidebarTraceLines(model, width);
  const combined = [
    ...summaryLines,
    ...(roleplayLines.length > 0 ? [fitLine(width, ''), ...roleplayLines] : []),
    fitLine(width, ''),
    ...alertLines,
    fitLine(width, ''),
    ...expectedLines,
    fitLine(width, ''),
    ...traceLines,
  ];

  return padLines(combined, bodyHeight, width);
// Provider-specific function removed

function buildTopRoomLinePrimary(model: Readonly<ChatroomScreenModel>): string {
  const agentCount = model.roomRecord?.speakerIds.length ?? estimateSpeakerCount(model);
***REMOVED***
    `Room: ${shortId(model.roomId)// Provider-specific function removed`,
    `Type: ${getChatroomRoomTypeShortLabel(model.roomRecord?.roomType ?? DEFAULT_CHATROOM_ROOM_TYPE)// Provider-specific function removed`,
    `Run: ${shortId(model.executionRunId)// Provider-specific function removed`,
    `State: ${formatStatus(model.status)// Provider-specific function removed`,
    `Resume: ${shortId(model.resumedFromRunId)// Provider-specific function removed`,
    `Agents: ${agentCount// Provider-specific function removed`,
    `Queue: ${formatQueueMode(model)// Provider-specific function removed`,
    `Updated: ${formatTimestamp(model.updatedAt)// Provider-specific function removed`,
  ].join(' | ');
// Provider-specific function removed

function buildTopRoomLineSecondary(
  model: Readonly<ChatroomScreenModel>,
  activeFilter: RoomFilterOption,
  transcriptView: {
    scrollTop: number;
    maxScrollTop: number;
  // Provider-specific function removed,
): string {
***REMOVED***
    `Topic: ${model.topic ?? '-'// Provider-specific function removed`,
    `Objective: ${truncateText(model.objective ?? '-', 40)// Provider-specific function removed`,
    `Gov: ${truncateText(
      formatRoomBlueprintGovernanceSummary(model.roomRecord?.roomBlueprint?.governance),
      38,
    )// Provider-specific function removed`,
    `Filter: ${activeFilter.label// Provider-specific function removed`,
    `Scroll: ${model.autoScroll ? 'live' : `${transcriptView.scrollTop// Provider-specific function removed/${transcriptView.maxScrollTop// Provider-specific function removed`// Provider-specific function removed`,
  ].join(' | ');
// Provider-specific function removed

function buildTopRoomLineTertiary(model: Readonly<ChatroomScreenModel>): string {
  const attention = buildRoomAttentionSnapshot(model);
  const latestHuman = attention.latestHumanMessage
    ? `${attention.latestHumanMessage.authorName// Provider-specific function removed@${formatTimestamp(attention.latestHumanMessage.createdAt)// Provider-specific function removed`
    : 'none';
  const latestMention = attention.latestMentionMessage
    ? `${attention.latestMentionMessage.authorName// Provider-specific function removed@${formatTimestamp(attention.latestMentionMessage.createdAt)// Provider-specific function removed`
    : '-';

***REMOVED***
    `Human: ${latestHuman// Provider-specific function removed`,
    `Replies: ${attention.repliesSinceLatestHuman// Provider-specific function removed`,
    `Mentions: ${attention.directMentionsSinceLatestHuman// Provider-specific function removed`,
    `Pending: ${attention.pendingHumanMessageCount// Provider-specific function removed (${formatQueueMode(model)// Provider-specific function removed)`,
    `Latest ping: ${latestMention// Provider-specific function removed`,
  ].join(' | ');
// Provider-specific function removed

function buildRecentTurnDetailTopLinePrimary(
  model: Readonly<ChatroomScreenModel>,
  turn: Readonly<RecentTurnStatusEntry> | undefined,
  recentTurnCount: number,
): string {
***REMOVED***
    `Room: ${shortId(model.roomId)// Provider-specific function removed`,
    `Run: ${shortId(model.executionRunId)// Provider-specific function removed`,
    `State: ${formatStatus(model.status)// Provider-specific function removed`,
    `Turn: ${turn ? `${clamp(model.selectedRecentTurnIndex + 1, 1, recentTurnCount)// Provider-specific function removed/${recentTurnCount// Provider-specific function removed` : '-'// Provider-specific function removed`,
    `Agent: ${turn?.displayName ?? '-'// Provider-specific function removed`,
    `Status: ${turn ? formatTurnStatusTag(turn.status) : '-'// Provider-specific function removed`,
  ].join(' | ');
// Provider-specific function removed

function buildRecentTurnDetailTopLineSecondary(
  model: Readonly<ChatroomScreenModel>,
  turn: Readonly<RecentTurnStatusEntry> | undefined,
  scrollTop: number,
  maxScrollTop: number,
): string {
***REMOVED***
    `Step: ${shortStepId(turn?.stepId)// Provider-specific function removed`,
    `Branch: ${turn?.branchId ?? '-'// Provider-specific function removed`,
    `Started: ${formatTimestamp(turn?.startedAt)// Provider-specific function removed`,
    `Ended: ${formatTimestamp(turn?.endedAt)// Provider-specific function removed`,
    `Scroll: ${scrollTop// Provider-specific function removed/${maxScrollTop// Provider-specific function removed`,
    `Updated: ${formatTimestamp(model.updatedAt)// Provider-specific function removed`,
  ].join(' | ');
// Provider-specific function removed

function buildOperationHelpLine(model: Readonly<ChatroomScreenModel>): string {
***REMOVED***!process.stdout.isTTY || !process.stdin.isTTY) {
    return 'Ops: snapshot mode | b rooms | r refresh | q quit';
  // Provider-specific function removed

***REMOVED***model.recentTurnDetailOpen) {
    return isRoomRunActive(model.status)
      ? 'Ops: j/k scroll | PgUp/PgDn page | h/l or [/] turn | g/G top/btm | Enter/o close | m compose | p pause/resume | s stop | b rooms | r refresh | q quit'
      : 'Ops: j/k scroll | PgUp/PgDn page | h/l or [/] turn | g/G top/btm | Enter/o close | m compose | p pause/resume | b rooms | r refresh | q quit';
  // Provider-specific function removed

***REMOVED***model.submittingMessage) {
    return 'Ops: sending... | Esc blur | Ctrl+U clear | q quit';
  // Provider-specific function removed

***REMOVED***model.composerFocused) {
    return 'Ops: Enter send | Esc blur | Ctrl+U clear | q quit';
  // Provider-specific function removed

  return isRoomRunActive(model.status)
    ? 'Ops: j/k scroll | PgUp/PgDn page | h/l filter | [/] turns | Enter/o detail | 0 all | a auto | g top | G live | m compose | p pause/resume | s stop | Esc/b rooms | r refresh | q quit'
    : 'Ops: j/k scroll | PgUp/PgDn page | h/l filter | [/] turns | Enter/o detail | 0 all | a auto | g top | G live | m compose | p pause/resume | Esc/b rooms | r refresh | q quit';
// Provider-specific function removed

function buildRoomInputHint(model: Readonly<ChatroomScreenModel>): string {
***REMOVED***model.queuePaused) {
    return '[PAUSE] room queue paused | press p to resume';
  // Provider-specific function removed

  const attention = buildRoomAttentionSnapshot(model);
***REMOVED***attention.directMentionsSinceLatestHuman > 0) {
    const latestMention = attention.latestMentionMessage;
    const latestLabel = latestMention
      ? `${latestMention.authorName// Provider-specific function removed@${formatTimestamp(latestMention.createdAt)// Provider-specific function removed`
      : '-';
    return `[CALL] ${attention.directMentionsSinceLatestHuman// Provider-specific function removed mentions since latest human msg | ${latestLabel// Provider-specific function removed | press m to reply`;
  // Provider-specific function removed

***REMOVED***attention.repliesSinceLatestHuman > 0) {
    return `[RPLY] ${attention.repliesSinceLatestHuman// Provider-specific function removed agent replies after latest human msg | press m to continue`;
  // Provider-specific function removed

***REMOVED***attention.pendingHumanMessageCount > 0) {
    return `[WAIT] ${attention.pendingHumanMessageCount// Provider-specific function removed queued human messages | press m to draft another`;
  // Provider-specific function removed

  return 'Press m to focus input';
// Provider-specific function removed

function formatQueueMode(model: Readonly<ChatroomScreenModel>): string {
  return model.queuePaused ? 'paused' : 'active';
// Provider-specific function removed

function buildFullTranscriptLines(messages: readonly ChatroomMessage[], width: number): string[] {
***REMOVED***messages.length === 0) {
  ***REMOVED***fitLine(width, 'No messages for the current filter.')];
  // Provider-specific function removed

  return buildTranscriptBlocks(messages, width).flatMap((block) => block.lines);
// Provider-specific function removed

function buildManualTranscriptView(
  messages: readonly ChatroomMessage[],
  width: number,
  height: number,
  scrollTop: number,
): {
  lines: string[];
  visibleMessageCount: number;
  hiddenMessageCount: number;
  scrollTop: number;
  maxScrollTop: number;
// Provider-specific function removed {
***REMOVED***messages.length === 0) {
    return {
      lines: [fitLine(width, 'No messages for the current filter.')],
      visibleMessageCount: 0,
      hiddenMessageCount: 0,
      scrollTop: 0,
      maxScrollTop: 0,
    // Provider-specific function removed;
  // Provider-specific function removed

  const blocks = buildTranscriptBlocks(messages, width);
  const transcriptLines = blocks.flatMap((block) => block.lines);
  const maxScrollTop = Math.max(0, transcriptLines.length - height);
  const clampedScrollTop = clamp(scrollTop, 0, maxScrollTop);
  const lines = transcriptLines.slice(clampedScrollTop, clampedScrollTop + height);
  let visibleMessageCount = 0;
  let cursor = 0;

  for (const block of blocks) {
    const start = cursor;
    const end = cursor + block.lines.length;
  ***REMOVED***end > clampedScrollTop && start < clampedScrollTop + height) {
      visibleMessageCount += 1;
    // Provider-specific function removed
    cursor = end;
  // Provider-specific function removed

  return {
    lines,
    visibleMessageCount,
    hiddenMessageCount: Math.max(0, messages.length - visibleMessageCount),
    scrollTop: clampedScrollTop,
    maxScrollTop,
  // Provider-specific function removed;
// Provider-specific function removed

function buildAutoTranscriptView(
  messages: readonly ChatroomMessage[],
  width: number,
  height: number,
): {
  lines: string[];
  visibleMessageCount: number;
  hiddenMessageCount: number;
  scrollTop: number;
  maxScrollTop: number;
// Provider-specific function removed {
***REMOVED***messages.length === 0) {
    return {
      lines: [fitLine(width, 'No messages for the current filter.')],
      visibleMessageCount: 0,
      hiddenMessageCount: 0,
      scrollTop: 0,
      maxScrollTop: 0,
    // Provider-specific function removed;
  // Provider-specific function removed

  const bodyPreviewLines = Math.max(3, Math.floor(height / 6));
  const blocks = buildTranscriptBlocks(messages, width, {
    previewBodyLines: bodyPreviewLines,
  // Provider-specific function removed);
  const fullLineCount = buildFullTranscriptLines(messages, width).length;

  const visible: string[] = [];
  let remaining = height;
  let hiddenCount = 0;
  let visibleMessageCount = 0;

  for (let index = blocks.length - 1; index >= 0; index -= 1) {
    const block = blocks[index];
  ***REMOVED***!block) {
      continue;
    // Provider-specific function removed

  ***REMOVED***block.lines.length <= remaining) {
      visible.unshift(...block.lines);
      remaining -= block.lines.length;
      visibleMessageCount += 1;
      continue;
    // Provider-specific function removed

    hiddenCount = index + 1;
  ***REMOVED***visible.length === 0) {
      visible.unshift(...clipTranscriptBlock(block.lines, remaining, width));
      visibleMessageCount = 1;
      remaining = 0;
    // Provider-specific function removed
    break;
  // Provider-specific function removed

***REMOVED***hiddenCount > 0 && remaining > 0) {
    visible.unshift(fitLine(width, `... ${hiddenCount// Provider-specific function removed earlier messages hidden ...`));
  // Provider-specific function removed

  return {
    lines: visible.slice(0, height),
    visibleMessageCount,
    hiddenMessageCount: Math.max(0, messages.length - visibleMessageCount),
    scrollTop: Math.max(0, fullLineCount - height),
    maxScrollTop: Math.max(0, fullLineCount - height),
  // Provider-specific function removed;
// Provider-specific function removed

function buildTranscriptBlocks(
  messages: readonly ChatroomMessage[],
  width: number,
  options: {
    previewBodyLines?: number;
  // Provider-specific function removed = {// Provider-specific function removed,
): Array<{
  message: ChatroomMessage;
  lines: string[];
// Provider-specific function removed> {
  const attentionContext = buildTranscriptAttentionContext(messages);
  return messages.map((message, index) => ({
    message,
    lines: buildTranscriptBlockLines(
      message,
      width,
      resolveTranscriptMessageAttention(message, index, attentionContext),
      options,
    ),
  // Provider-specific function removed));
// Provider-specific function removed

function buildTranscriptBlockLines(
  message: Readonly<ChatroomMessage>,
  width: number,
  attention: TranscriptMessageAttention,
  options: {
    previewBodyLines?: number;
  // Provider-specific function removed = {// Provider-specific function removed,
): string[] {
  const contentWidth = Math.max(20, width - 4);
  const roundLabel = message.round > 0 ? `Round ${message.round// Provider-specific function removed` : 'Seed';
  const badge = getSpeakerBadge(message);
  const attentionTags = buildTranscriptAttentionTags(attention);
  const header = `[${badge// Provider-specific function removed]${attentionTags.length > 0 ? ` ${attentionTags.join('')// Provider-specific function removed` : ''// Provider-specific function removed ${message.authorName// Provider-specific function removed | ${roundLabel// Provider-specific function removed | ${formatTimestamp(message.createdAt)// Provider-specific function removed`;
  const lines: string[] = [];

  for (const line of wrapToWidth(header, contentWidth)) {
    lines.push(fitLine(width, `+ ${line// Provider-specific function removed`));
  // Provider-specific function removed

  const wrappedContent = wrapToWidth(message.content.trim() || '(empty)', contentWidth);
  const previewLimit = options.previewBodyLines;
  const bodyLines =
    previewLimit && wrappedContent.length > previewLimit
      ? [
          ...wrappedContent.slice(0, Math.max(1, previewLimit - 1)),
          `... (${wrappedContent.length - Math.max(1, previewLimit - 1)// Provider-specific function removed more lines)`,
        ]
      : wrappedContent;
  const bodyPrefix =
    attention.isDirectMention || attention.isReplyToLatestHuman
      ? '|! '
      : attention.isLatestHuman
        ? '|> '
        : '| ';

  for (const line of bodyLines) {
    lines.push(fitLine(width, `${bodyPrefix// Provider-specific function removed${line// Provider-specific function removed`));
  // Provider-specific function removed

  lines.push(fitLine(width, `+ ${'-'.repeat(Math.max(8, Math.min(contentWidth - 2, 18)))// Provider-specific function removed`));
  return lines;
// Provider-specific function removed

function buildTranscriptAttentionContext(
  messages: readonly ChatroomMessage[],
): TranscriptAttentionContext {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
  ***REMOVED***message?.role === 'user') {
      return {
        latestHumanIndex: index,
        latestHumanMessage: message,
        mentionTokens: buildHumanMentionTokens(message.authorName),
      // Provider-specific function removed;
    // Provider-specific function removed
  // Provider-specific function removed

  return {
    latestHumanIndex: -1,
    latestHumanMessage: undefined,
    mentionTokens: buildHumanMentionTokens(undefined),
  // Provider-specific function removed;
// Provider-specific function removed

function resolveTranscriptMessageAttention(
  message: Readonly<ChatroomMessage>,
  index: number,
  context: Readonly<TranscriptAttentionContext>,
): TranscriptMessageAttention {
  const isHuman = message.role === 'user';
  const isFromYou = message.authorName === 'You';
  const isLatestHuman = context.latestHumanIndex >= 0 && index === context.latestHumanIndex;
  const isReplyToLatestHuman =
    context.latestHumanIndex >= 0 &&
    index > context.latestHumanIndex &&
    (message.role === 'agent' || message.role === 'summary');
  const isDirectMention =
    isReplyToLatestHuman && doesMessageMentionHuman(message.content, context.mentionTokens);

  return {
    isHuman,
    isFromYou,
    isLatestHuman,
    isReplyToLatestHuman,
    isDirectMention,
  // Provider-specific function removed;
// Provider-specific function removed

function buildTranscriptAttentionTags(attention: Readonly<TranscriptMessageAttention>): string[] {
  const tags: string[] = [];
***REMOVED***attention.isHuman) {
    tags.push(attention.isFromYou ? '[YOU]' : '[USER]');
  // Provider-specific function removed
***REMOVED***attention.isLatestHuman) {
    tags.push('[LATEST]');
  // Provider-specific function removed
***REMOVED***attention.isReplyToLatestHuman) {
    tags.push('[RPLY]');
  // Provider-specific function removed
***REMOVED***attention.isDirectMention) {
    tags.push('[CALL]');
  // Provider-specific function removed
  return tags;
// Provider-specific function removed

function clipTranscriptBlock(block: readonly string[], height: number, width: number): string[] {
***REMOVED***height <= 0) {
  ***REMOVED***];
  // Provider-specific function removed

***REMOVED***block.length <= height) {
  ***REMOVED***...block];
  // Provider-specific function removed

***REMOVED***height === 1) {
  ***REMOVED***block[0] ?? fitLine(width, '')];
  // Provider-specific function removed

  const header = block[0] ?? fitLine(width, '');
  const separator = block[block.length - 1] ?? fitLine(width, '');
  const middleCapacity = Math.max(0, height - 3);
  const middle = middleCapacity > 0 ? block.slice(1, 1 + middleCapacity) : [];
  const clipped = [
    header,
    ...middle,
    fitLine(width, '| ... (message clipped)'),
  ];

***REMOVED***clipped.length < height) {
    clipped.push(separator);
  // Provider-specific function removed

  return clipped.slice(0, height);
// Provider-specific function removed

function buildSidebarSummaryLines(
  model: Readonly<ChatroomScreenModel>,
  width: number,
  visibleMessageCount: number,
  hiddenMessageCount: number,
  activeFilter: RoomFilterOption,
  scrollTop: number,
  maxScrollTop: number,
): string[] {
  const expectedAgentCount = model.roomRecord?.speakerIds.length ?? estimateSpeakerCount(model);
  const currentRound = resolveCurrentRound(model.messages);
  const repliedThisRound = countRoundAgents(model.messages, currentRound);
  const runningAgents = model.currentAgentIds?.length ?? 0;
  const recoveryStats = aggregateStructuredOutputRecoveryStats(model.trace);

***REMOVED***
    fitLine(width, `Round: ${buildRoundLabel(currentRound)// Provider-specific function removed`),
    fitLine(width, `Roster: ${repliedThisRound// Provider-specific function removed/${expectedAgentCount// Provider-specific function removed | Live: ${runningAgents// Provider-specific function removed`),
    fitLine(width, `Window: ${visibleMessageCount// Provider-specific function removed view | ${hiddenMessageCount// Provider-specific function removed hidden | ${model.messages.length// Provider-specific function removed main msgs`),
    fitLine(width, `Queue: ${formatQueueMode(model)// Provider-specific function removed | Pending: ${model.pendingMessages.length// Provider-specific function removed | Exec runs: ${model.runs.length// Provider-specific function removed`),
    fitLine(width, `Recovery: ${formatRunRecoverySummary(recoveryStats)// Provider-specific function removed`),
    fitLine(width, `SO: ${formatRunStructuredSummary(recoveryStats)// Provider-specific function removed`),
    fitLine(width, `Filter: ${activeFilter.label// Provider-specific function removed`),
    fitLine(width, `Scroll: ${model.autoScroll ? 'live' : `${scrollTop// Provider-specific function removed/${maxScrollTop// Provider-specific function removed`// Provider-specific function removed`),
    fitLine(width, `Current: ${formatCurrentAgents(model, buildAgentStatusEntries(model))// Provider-specific function removed`),
  ];
// Provider-specific function removed

function buildSidebarAlertLines(
  model: Readonly<ChatroomScreenModel>,
  width: number,
): string[] {
  const attention = buildRoomAttentionSnapshot(model);
  const lines = [fitLine(width, 'Alerts:')];

***REMOVED***!attention.latestHumanMessage) {
    lines.push(fitLine(width, 'Human: no human message yet'));
    lines.push(
      fitLine(
        width,
        `Queue: ${formatQueueMode(model)// Provider-specific function removed | Pending: ${attention.pendingHumanMessageCount// Provider-specific function removed`,
      ),
    );
    return lines;
  // Provider-specific function removed

  lines.push(
    fitLine(
      width,
      `Human: ${attention.latestHumanMessage.authorName// Provider-specific function removed @ ${formatTimestamp(attention.latestHumanMessage.createdAt)// Provider-specific function removed`,
    ),
  );
  lines.push(
    fitLine(
      width,
      `Replies: ${attention.repliesSinceLatestHuman// Provider-specific function removed | Mentions: ${attention.directMentionsSinceLatestHuman// Provider-specific function removed`,
    ),
  );
  lines.push(
    fitLine(
      width,
      `Queue: ${formatQueueMode(model)// Provider-specific function removed | Pending: ${attention.pendingHumanMessageCount// Provider-specific function removed | Queue by: ${attention.pendingHumanAuthors.join(', ') || '-'// Provider-specific function removed`,
    ),
  );

***REMOVED***attention.latestMentionMessage) {
    lines.push(
      fitLine(
        width,
        `[CALL] ${attention.latestMentionMessage.authorName// Provider-specific function removed @ ${formatTimestamp(attention.latestMentionMessage.createdAt)// Provider-specific function removed`,
      ),
    );
  // Provider-specific function removed else if (attention.latestReplyMessage) {
    lines.push(
      fitLine(
        width,
        `[RPLY] ${attention.latestReplyMessage.authorName// Provider-specific function removed @ ${formatTimestamp(attention.latestReplyMessage.createdAt)// Provider-specific function removed`,
      ),
    );
  // Provider-specific function removed

  return lines;
// Provider-specific function removed

function buildRoleplaySceneLines(
  model: Readonly<ChatroomScreenModel>,
  width: number,
): string[] {
***REMOVED***
    !model.roleplayScene &&
    resolveChatroomRoomType(model.roomRecord?.roomType ?? DEFAULT_CHATROOM_ROOM_TYPE).behavior !==
      'roleplay'
***REMOVED***
  ***REMOVED***];
  // Provider-specific function removed

  const scene = model.roleplayScene;
***REMOVED***!scene) {
  ***REMOVED***fitLine(width, 'Scene: waiting for roleplay state...')];
  // Provider-specific function removed

  const wrapLine = (value: string) =>
    wrapToWidth(value, Math.max(18, width)).map((line) => fitLine(width, line));
  const lines = [
    fitLine(width, 'Scene:'),
    ...wrapLine(`Beat: ${scene.currentBeat// Provider-specific function removed`),
    ...wrapLine(`Atmosphere: ${scene.atmosphere// Provider-specific function removed`),
    ...wrapLine(`Latest: ${scene.latestEvent// Provider-specific function removed`),
    ...wrapLine(`User intent: ${scene.latestUserIntent ?? '-'// Provider-specific function removed`),
    fitLine(width, 'Threads:'),
  ];

***REMOVED***scene.activeThreads.length === 0) {
    lines.push(fitLine(width, '  -'));
  // Provider-specific function removed else {
    for (const thread of scene.activeThreads.slice(0, 4)) {
      lines.push(...wrapLine(`  - ${thread// Provider-specific function removed`));
    // Provider-specific function removed
  // Provider-specific function removed

  lines.push(fitLine(width, 'Cast:'));
  for (const character of scene.cast.slice(0, 4)) {
    lines.push(...wrapLine(`  [${character.displayName// Provider-specific function removed] ${character.publicStatus// Provider-specific function removed | ${character.currentGoal// Provider-specific function removed`));
  // Provider-specific function removed

***REMOVED***scene.cast.length > 4) {
    lines.push(fitLine(width, `  + ${scene.cast.length - 4// Provider-specific function removed more`));
  // Provider-specific function removed

  return lines;
// Provider-specific function removed

function buildRoomAttentionSnapshot(
  model: Readonly<ChatroomScreenModel>,
): RoomAttentionSnapshot {
  const context = buildTranscriptAttentionContext(model.messages);
***REMOVED***!context.latestHumanMessage || context.latestHumanIndex < 0) {
    return {
      latestHumanMessage: undefined,
      repliesSinceLatestHuman: 0,
      directMentionsSinceLatestHuman: 0,
      latestReplyMessage: undefined,
      latestMentionMessage: undefined,
      pendingHumanMessageCount: model.pendingMessages.length,
      pendingHumanAuthors: [...new Set(model.pendingMessages.map((item) => item.authorName))],
    // Provider-specific function removed;
  // Provider-specific function removed

  let repliesSinceLatestHuman = 0;
  let directMentionsSinceLatestHuman = 0;
  let latestReplyMessage: ChatroomMessage | undefined;
  let latestMentionMessage: ChatroomMessage | undefined;

  for (let index = context.latestHumanIndex + 1; index < model.messages.length; index += 1) {
    const message = model.messages[index];
  ***REMOVED***!message || (message.role !== 'agent' && message.role !== 'summary')) {
      continue;
    // Provider-specific function removed

    repliesSinceLatestHuman += 1;
    latestReplyMessage = message;
  ***REMOVED***doesMessageMentionHuman(message.content, context.mentionTokens)) {
      directMentionsSinceLatestHuman += 1;
      latestMentionMessage = message;
    // Provider-specific function removed
  // Provider-specific function removed

  return {
    latestHumanMessage: context.latestHumanMessage,
    repliesSinceLatestHuman,
    directMentionsSinceLatestHuman,
    latestReplyMessage,
    latestMentionMessage,
    pendingHumanMessageCount: model.pendingMessages.length,
    pendingHumanAuthors: [...new Set(model.pendingMessages.map((item) => item.authorName))],
  // Provider-specific function removed;
// Provider-specific function removed

function buildHumanMentionTokens(authorName: string | undefined): string[] {
  const tokens = new Set<string>([
    'you',
    'your',
    'user',
    'human',
    'owner',
    '你',
    '您',
    '用户',
    '提问者',
    '发起人',
    '人类',
  ]);

  const normalizedName = authorName?.trim().toLowerCase();
***REMOVED***normalizedName && normalizedName !== 'you') {
    tokens.add(normalizedName);
    for (const part of normalizedName.split(/[^a-z0-9\u4e00-\u9fff]+/).filter(Boolean)) {
      tokens.add(part);
    // Provider-specific function removed
  // Provider-specific function removed

***REMOVED***...tokens];
// Provider-specific function removed

function doesMessageMentionHuman(content: string, mentionTokens: readonly string[]***REMOVED***
  const normalized = content.toLowerCase();
  return mentionTokens.some((token) => token.length > 0 && normalized.includes(token));
// Provider-specific function removed

function buildExpectedAgentLines(
  model: Readonly<ChatroomScreenModel>,
  width: number,
): string[] {
  const currentRound = resolveCurrentRound(model.messages);
  const participantEntries = buildAgentStatusEntries(model);
  const currentRoundAgentIds = new Set(
    model.messages
      .filter((message) => message.role === 'agent' && message.round === currentRound)
      .map((message) => message.authorId),
  );
  const expectedSpeakerIds =
    model.roomRecord?.speakerIds && model.roomRecord.speakerIds.length > 0
      ? model.roomRecord.speakerIds
      : participantEntries
          .filter((item) => item.role === 'agent')
          .map((item) => item.authorId);
  const expectedSpeakers = resolveExpectedSpeakers(expectedSpeakerIds);
  const lines = [fitLine(width, `Expected agents (${expectedSpeakers.length// Provider-specific function removed):`)];

  for (const speaker of expectedSpeakers) {
    const participant = participantEntries.find((item) => item.authorId === speaker.id);
    const isRunning = (model.currentAgentIds ?? []).includes(speaker.id);
    const spokeThisRound = currentRoundAgentIds.has(speaker.id);
    const statusTag = isRunning ? '[RUN]' : spokeThisRound ? '[OK]' : '[MIS]';
    const lastRound = participant ? `R${participant.lastRound// Provider-specific function removed` : '-';
    lines.push(
      fitLine(
        width,
        `${statusTag// Provider-specific function removed [${resolveSpeakerBadge({ role: 'agent', authorId: speaker.id, authorName: speaker.name // Provider-specific function removed)// Provider-specific function removed] ${speaker.name// Provider-specific function removed | ${lastRound// Provider-specific function removed`,
      ),
    );
  // Provider-specific function removed

  return lines;
// Provider-specific function removed

function buildSidebarTraceLines(
  model: Readonly<ChatroomScreenModel>,
  width: number,
): string[] {
  const latestRun = model.runs[0];
  const recentTurns = buildSidebarRecentTurnEntries(model);
  const selectedTurn =
    recentTurns[clamp(model.selectedRecentTurnIndex, 0, Math.max(0, recentTurns.length - 1))];
  const lines = [
    fitLine(width, `Step: ${shortStepId(model.currentStepId)// Provider-specific function removed`),
    fitLine(
      width,
      `Run: ${shortId(model.executionRunId)// Provider-specific function removed | State: ${formatStatus(model.status)// Provider-specific function removed`,
    ),
    fitLine(
      width,
      `Started: ${formatTimestamp(model.startedAt)// Provider-specific function removed | Updated: ${formatTimestamp(model.updatedAt)// Provider-specific function removed`,
    ),
    fitLine(width, `Resume: ${shortId(model.resumedFromRunId)// Provider-specific function removed`),
    fitLine(
      width,
      `Latest saved: ${
        latestRun
          ? `${formatRunStatus(latestRun.status)// Provider-specific function removed @ ${formatTimestamp(latestRun.endedAt)// Provider-specific function removed`
          : '-'
      // Provider-specific function removed`,
    ),
  ];

  lines.push(fitLine(width, `Selected turn: ${selectedTurn ? `${model.selectedRecentTurnIndex + 1// Provider-specific function removed/${recentTurns.length// Provider-specific function removed` : '-'// Provider-specific function removed`));
***REMOVED***!selectedTurn) {
    lines.push(fitLine(width, '  -'));
  // Provider-specific function removed else {
    lines.push(
      ...buildSelectedRecentTurnLines(selectedTurn, width).map((line) => fitLine(width, line)),
    );
  // Provider-specific function removed

  lines.push(fitLine(width, `Recent turns (${recentTurns.length// Provider-specific function removed):`));
***REMOVED***recentTurns.length === 0) {
    lines.push(fitLine(width, '  -'));
  // Provider-specific function removed else {
    for (const [index, turn] of recentTurns.entries()) {
      const prefix = index === model.selectedRecentTurnIndex ? '>' : ' ';
      lines.push(
        ...wrapToWidth(
          `${prefix// Provider-specific function removed ${formatTurnStatusTag(turn.status)// Provider-specific function removed ${turn.displayName// Provider-specific function removed ${formatTimestamp(turn.endedAt)// Provider-specific function removed ${turn.branchId ? `${turn.branchId// Provider-specific function removed ` : ''// Provider-specific function removed${shortStepId(turn.stepId)// Provider-specific function removed`,
          Math.max(16, width),
        ).map((line) => fitLine(width, line)),
      );
    // Provider-specific function removed
  // Provider-specific function removed

  lines.push(fitLine(width, 'Recent steps:'));
  const recentTrace = model.trace.slice(-3).reverse();

***REMOVED***recentTrace.length === 0) {
    lines.push(fitLine(width, '  -'));
  // Provider-specific function removed else {
    for (const item of recentTrace) {
      lines.push(
        ...wrapToWidth(
          `  ${formatTraceStatusTag(item.status)// Provider-specific function removed ${formatTimestamp(item.endedAt)// Provider-specific function removed ${shortStepId(item.stepId)// Provider-specific function removed ${formatDurationSeconds(item.startedAt, item.endedAt)// Provider-specific function removed`,
          Math.max(16, width),
        ).map((line) => fitLine(width, line)),
      );
    // Provider-specific function removed
  // Provider-specific function removed

  return lines;
// Provider-specific function removed

function buildSidebarRecentTurnEntries(
  model: Readonly<ChatroomScreenModel>,
): RecentTurnStatusEntry[] {
  return buildRecentTurnStatusEntries(model).slice(0, 5);
// Provider-specific function removed

function buildRecentTurnDetailPageLines(
  model: Readonly<ChatroomScreenModel>,
  turn: Readonly<RecentTurnStatusEntry> | undefined,
  width: number,
): string[] {
***REMOVED***!turn) {
  ***REMOVED***'No recent turn is selected.'];
  // Provider-specific function removed

  const lines: string[] = [];
  lines.push(
    ...wrapToWidth(
      `${formatTurnStatusTag(turn.status)// Provider-specific function removed ${turn.displayName// Provider-specific function removed | ${formatTimestamp(turn.startedAt)// Provider-specific function removed -> ${formatTimestamp(turn.endedAt)// Provider-specific function removed`,
      Math.max(20, width),
    ),
  );
  lines.push(
    ...wrapToWidth(
      `Room ${shortId(model.roomId)// Provider-specific function removed | Run ${shortId(model.executionRunId)// Provider-specific function removed | Step ${turn.stepId// Provider-specific function removed | Branch ${turn.branchId ?? '-'// Provider-specific function removed`,
      Math.max(20, width),
    ),
  );
  lines.push(
    ...wrapToWidth(
      `Usage summary: ${formatTurnUsageSummary(turn.usage)// Provider-specific function removed`,
      Math.max(20, width),
    ),
  );
  lines.push(
    ...wrapToWidth(
      `Runtime path: ${formatTurnTelemetrySummary(turn.telemetry)// Provider-specific function removed`,
      Math.max(20, width),
    ),
  );
  lines.push('');
  lines.push(
    ...wrapMultilineSection('Input preview', turn.inputPreview ?? '-', width),
  );
  lines.push('');
  lines.push(
    ...wrapMultilineSection('Usage detail', formatDetailRecord(turn.usage), width),
  );
  lines.push('');
  lines.push(
    ...wrapMultilineSection('Telemetry detail', formatDetailRecord(turn.telemetry), width),
  );
  lines.push('');
  lines.push(
    ...wrapMultilineSection('Raw output', formatDetailValue(turn.output), width),
  );

***REMOVED***turn.error) {
    lines.push('');
    lines.push(...wrapMultilineSection('Error', turn.error, width));
  // Provider-specific function removed

  return lines;
// Provider-specific function removed

function buildSelectedRecentTurnLines(
  turn: Readonly<RecentTurnStatusEntry>,
  width: number,
): string[] {
  const lines = wrapToWidth(
    `  ${formatTurnStatusTag(turn.status)// Provider-specific function removed ${turn.displayName// Provider-specific function removed ${formatTimestamp(turn.endedAt)// Provider-specific function removed`,
    Math.max(16, width),
  );

  lines.push(
    ...wrapToWidth(
      `  Meta: ${turn.branchId ? `${turn.branchId// Provider-specific function removed | ` : ''// Provider-specific function removed${shortStepId(turn.stepId)// Provider-specific function removed | started ${formatTimestamp(turn.startedAt)// Provider-specific function removed | ended ${formatTimestamp(turn.endedAt)// Provider-specific function removed`,
      Math.max(16, width),
    ),
  );
  lines.push(
    ...wrapToWidth(
      `  Usage: ${formatTurnUsageSummary(turn.usage)// Provider-specific function removed`,
      Math.max(16, width),
    ),
  );
  lines.push(
    ...wrapToWidth(
      `  Path: ${formatTurnTelemetrySummary(turn.telemetry)// Provider-specific function removed`,
      Math.max(16, width),
    ),
  );

***REMOVED***turn.inputPreview) {
    lines.push(
      ...wrapToWidth(`  Input: ${turn.inputPreview// Provider-specific function removed`, Math.max(16, width)),
    );
  // Provider-specific function removed

***REMOVED***turn.output !== undefined) {
    lines.push(
      ...wrapToWidth(
        `  Output: ${truncateText(formatDetailValue(turn.output), 120)// Provider-specific function removed`,
        Math.max(16, width),
      ),
    );
  // Provider-specific function removed

***REMOVED***turn.error) {
    lines.push(
      ...wrapToWidth(`  Error: ${turn.error// Provider-specific function removed`, Math.max(16, width)),
    );
  // Provider-specific function removed

  return lines;
// Provider-specific function removed

function buildRecentTurnStatusEntries(
  model: Readonly<ChatroomScreenModel>,
): RecentTurnStatusEntry[] {
  const entries: RecentTurnStatusEntry[] = [];

  for (const item of model.trace) {
  ***REMOVED***(item.kind === 'parallel' || item.kind === 'custom') && Array.isArray(item.output)) {
      const inputPreviewMap =
        item.kind === 'parallel'
          ? buildParallelTurnInputPreviewMap(item.inputPreview)
          : new Map<string, string>();
      for (const branch of item.output) {
        const record = asUnknownRecord(branch);
      ***REMOVED***!record) {
          continue;
        // Provider-specific function removed

        const profileId = typeof record.profileId === 'string' ? record.profileId : undefined;
      ***REMOVED***!profileId) {
          continue;
        // Provider-specific function removed

        entries.push({
          profileId,
          displayName: resolveTurnDisplayName(model, profileId),
          stepId: item.stepId,
          branchId: typeof record.branchId === 'string' ? record.branchId : undefined,
          status: normalizeTurnStatus(record.status),
          startedAt:
            typeof record.startedAt === 'string' ? record.startedAt : item.startedAt,
          endedAt:
            typeof record.endedAt === 'string' ? record.endedAt : item.endedAt,
          inputPreview:
            item.kind === 'parallel' && typeof record.branchId === 'string'
              ? inputPreviewMap.get(record.branchId)
              : item.inputPreview,
          usage: asUnknownRecord(record.usage),
          telemetry: asUnknownRecord(record.telemetry),
          error: typeof record.error === 'string' ? record.error : undefined,
          output: record.output,
        // Provider-specific function removed);
      // Provider-specific function removed
      continue;
    // Provider-specific function removed

  ***REMOVED***item.kind !== 'agent') {
      continue;
    // Provider-specific function removed

    const profileId = item.agentIds?.[0];
  ***REMOVED***!profileId) {
      continue;
    // Provider-specific function removed

    entries.push({
      profileId,
      displayName: resolveTurnDisplayName(model, profileId),
      stepId: item.stepId,
      status: normalizeTurnStatus(item.status),
      startedAt: item.startedAt,
      endedAt: item.endedAt,
      inputPreview: item.inputPreview,
      usage: asUnknownRecord(item.usage),
      telemetry: asUnknownRecord(item.telemetry),
      error: item.error,
      output: item.output,
    // Provider-specific function removed);
  // Provider-specific function removed

  return entries.slice(-8).reverse();
// Provider-specific function removed

function buildParallelTurnInputPreviewMap(inputPreview?: string): Map<string, string> {
  const map = new Map<string, string>();
***REMOVED***!inputPreview) {
    return map;
  // Provider-specific function removed

  for (const line of inputPreview.split('\n')) {
    const separatorIndex = line.indexOf(': ');
  ***REMOVED***separatorIndex <= 0) {
      continue;
    // Provider-specific function removed

    const branchId = line.slice(0, separatorIndex);
    const preview = line.slice(separatorIndex + 2).trim();
  ***REMOVED***!branchId || !preview) {
      continue;
    // Provider-specific function removed

    map.set(branchId, preview);
  // Provider-specific function removed

  return map;
// Provider-specific function removed

function resolveRecentTurnDetailMaxScrollTop(
  model: Readonly<ChatroomScreenModel>,
  width: number,
  height: number,
): number {
  const contentHeight = Math.max(8, height - 6);
  const recentTurns = buildRecentTurnStatusEntries(model);
  const turn =
    recentTurns[clamp(model.selectedRecentTurnIndex, 0, Math.max(0, recentTurns.length - 1))];
  const detailLines = buildRecentTurnDetailPageLines(model, turn, Math.max(20, width - 2));
  return Math.max(0, detailLines.length - contentHeight);
// Provider-specific function removed

function formatTurnUsageSummary(usage?: Record<string, unknown>): string {
***REMOVED***!usage) {
    return '-';
  // Provider-specific function removed

  const segments = [
    formatUsageMetric('req', usage.requests),
    formatUsageMetric('in', usage.inputTokens),
    formatUsageMetric('out', usage.outputTokens),
    formatUsageMetric('total', usage.totalTokens),
  ].filter((value): value is string => Boolean(value));

***REMOVED***segments.length > 0) {
    return segments.join(' | ');
  // Provider-specific function removed

  return truncateText(JSON.stringify(usage), 120);
// Provider-specific function removed

function formatRunRecoverySummary(
  stats: Readonly<RunStructuredOutputRecoveryStats>,
): string {
***REMOVED***stats.structuredRuns === 0) {
    return 'none';
  // Provider-specific function removed

***REMOVED***
    `retry${stats.toolRetryRuns// Provider-specific function removed`,
    `text${stats.textFallbackRuns// Provider-specific function removed`,
    `repair${stats.repairFallbackRuns// Provider-specific function removed`,
  ].join(' | ');
// Provider-specific function removed

function formatRunStructuredSummary(
  stats: Readonly<RunStructuredOutputRecoveryStats>,
): string {
***REMOVED***stats.structuredRuns === 0) {
    return 'none';
  // Provider-specific function removed

***REMOVED***
    `clean${stats.directToolRuns// Provider-specific function removed/${stats.structuredRuns// Provider-specific function removed`,
    `calls${stats.totalRunnerCalls// Provider-specific function removed`,
    `fix${stats.totalRepairAttempts// Provider-specific function removed`,
  ].join(' | ');
// Provider-specific function removed

function formatTurnTelemetrySummary(telemetry?: Record<string, unknown>): string {
***REMOVED***!telemetry) {
    return '-';
  // Provider-specific function removed

  const structuredOutput = asUnknownRecord(telemetry.structuredOutput);
***REMOVED***!structuredOutput) {
    return truncateText(JSON.stringify(telemetry), 120);
  // Provider-specific function removed

  const segments = [
    typeof structuredOutput.finalPath === 'string' ? structuredOutput.finalPath : undefined,
    typeof structuredOutput.primaryAttempts === 'number'
      ? `primary ${structuredOutput.primaryAttempts// Provider-specific function removed`
      : undefined,
    structuredOutput.textFallbackAttempted === true ? 'text fallback' : undefined,
    typeof structuredOutput.repairAttempts === 'number' &&
    structuredOutput.repairAttempts > 0
      ? `repair ${structuredOutput.repairAttempts// Provider-specific function removed`
      : undefined,
  ].filter((value): value is string => Boolean(value));

***REMOVED***segments.length > 0) {
    return segments.join(' | ');
  // Provider-specific function removed

  return truncateText(JSON.stringify(structuredOutput), 120);
// Provider-specific function removed

function formatUsageMetric(label: string, value: unknown): string | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? `${label// Provider-specific function removed ${value// Provider-specific function removed` : undefined;
// Provider-specific function removed

function asUnknownRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
// Provider-specific function removed

function wrapMultilineSection(label: string, value: string, width: number): string[] {
  const lines = [`${label// Provider-specific function removed:`];
  for (const rawLine of value.replace(/\r\n/g, '\n').split('\n')) {
    lines.push(
      ...wrapToWidth(rawLine.length > 0 ? rawLine : ' ', Math.max(20, width - 2)).map(
        (line) => `  ${line// Provider-specific function removed`,
      ),
    );
  // Provider-specific function removed
  return lines;
// Provider-specific function removed

function wrapPlainDetailSection(label: string, value: string, width: number): string[] {
  return wrapToWidth(value, Math.max(20, width)).map((line, index) =>
    index === 0 ? `[${label// Provider-specific function removed] ${line// Provider-specific function removed` : `[${label// Provider-specific function removed] ${line// Provider-specific function removed`,
  );
// Provider-specific function removed

function formatDetailRecord(value?: Record<string, unknown>): string {
  return value ? formatDetailValue(value) : '-';
// Provider-specific function removed

function formatDetailValue(value: unknown): string {
***REMOVED***value === undefined) {
    return '-';
  // Provider-specific function removed

***REMOVED***typeof value === 'string') {
    return value;
  // Provider-specific function removed

  try {
    return JSON.stringify(value, null, 2);
  // Provider-specific function removed catch {
    return String(value);
  // Provider-specific function removed
// Provider-specific function removed

function resolveTurnDisplayName(
  model: Readonly<ChatroomScreenModel>,
  profileId: string,
): string {
  for (let index = model.messages.length - 1; index >= 0; index -= 1) {
    const message = model.messages[index];
  ***REMOVED***message?.authorId === profileId && message.authorName.trim().length > 0) {
      return message.authorName;
    // Provider-specific function removed
  // Provider-specific function removed

***REMOVED***profileId === 'chatroom-summary') {
    return 'Summary';
  // Provider-specific function removed

  try {
    return resolveChatroomSpeakerProfiles([profileId])[0]?.name ?? humanizeSpeakerId(profileId);
  // Provider-specific function removed catch {
    return humanizeSpeakerId(profileId);
  // Provider-specific function removed
// Provider-specific function removed

function normalizeTurnStatus(
  value: unknown,
): 'completed' | 'failed' | 'cancelled' {
  return value === 'failed' || value === 'cancelled' ? value : 'completed';
// Provider-specific function removed

function formatTurnStatusTag(
  status: 'completed' | 'failed' | 'cancelled',
): string {
  switch (status) {
    case 'failed':
      return '[ERR]';
    case 'cancelled':
      return '[CAN]';
    case 'completed':
    default:
      return '[OK]';
  // Provider-specific function removed
// Provider-specific function removed

function formatTraceStatusTag(
  status: WorkflowTraceRecord['status'],
): string {
  switch (status) {
    case 'partial':
      return '[PAR]';
    default:
      return formatTurnStatusTag(normalizeTurnStatus(status));
  // Provider-specific function removed
// Provider-specific function removed

function formatRunStatus(
  status: ChatroomExecutionRunRecord['status'],
): string {
  switch (status) {
    case 'failed':
      return 'failed';
    case 'cancelled':
      return 'cancelled';
    case 'completed':
    default:
      return 'completed';
  // Provider-specific function removed
// Provider-specific function removed

function mapRunStatusToScreenStatus(
  status: ChatroomExecutionRunRecord['status'],
): ScreenStatus {
  return status;
// Provider-specific function removed

function resolveExpectedSpeakers(
  speakerIds: readonly string[],
): Array<{
  id: string;
  name: string;
// Provider-specific function removed> {
  try {
    return resolveChatroomSpeakerProfiles(speakerIds).map((profile) => ({
      id: profile.id,
      name: profile.name,
    // Provider-specific function removed));
  // Provider-specific function removed catch {
    return speakerIds.map((speakerId) => ({
      id: speakerId,
      name: humanizeSpeakerId(speakerId),
    // Provider-specific function removed));
  // Provider-specific function removed
// Provider-specific function removed

function humanizeSpeakerId(speakerId: string): string {
  return speakerId
    .replace(/-chat$/i, '')
    .split(/[^a-z0-9]+/i)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
// Provider-specific function removed

function buildStatusLines(model: Readonly<ChatroomScreenModel>, width: number): string[] {
  const lines: string[] = [];
  const participants = buildAgentStatusEntries(model);
  const recentTurns = buildRecentTurnStatusEntries(model).slice(0, 4);
  lines.push(
    `Started: ${formatTimestamp(model.startedAt)// Provider-specific function removed | Completed: ${formatTimestamp(model.completedAt)// Provider-specific function removed | Current agents: ${formatCurrentAgents(model, participants)// Provider-specific function removed`,
  );
  lines.push(
    `Run: ${shortId(model.executionRunId)// Provider-specific function removed | State: ${formatStatus(model.status)// Provider-specific function removed | Resume: ${shortId(model.resumedFromRunId)// Provider-specific function removed`,
  );

  lines.push(
    `Pending queue: ${
      model.pendingMessages.length > 0
        ? model.pendingMessages.map((item) => `${item.authorName// Provider-specific function removed:${item.status// Provider-specific function removed`).join(', ')
        : '-'
    // Provider-specific function removed`,
  );
  lines.push(
    `Queue mode: ${formatQueueMode(model)// Provider-specific function removed${
      model.queuePauseAt ? ` | paused at ${formatTimestamp(model.queuePauseAt)// Provider-specific function removed` : ''
    // Provider-specific function removed`,
  );

  lines.push(`Participants (${participants.length// Provider-specific function removed):`);
***REMOVED***participants.length === 0) {
    lines.push('  -');
  // Provider-specific function removed else {
    const visibleParticipants = participants.slice(0, 8);
    for (const item of visibleParticipants) {
      const prefix = item.isActive ? '*' : item.isFiltered ? '>' : ' ';
      lines.push(
        ...wrapToWidth(
          ` ${prefix// Provider-specific function removed [${item.badge// Provider-specific function removed] ${item.authorName// Provider-specific function removed [${item.statusLabel// Provider-specific function removed] role=${item.role// Provider-specific function removed msgs=${item.messageCount// Provider-specific function removed last=R${item.lastRound// Provider-specific function removed ${formatTimestamp(item.lastAt)// Provider-specific function removed`,
          Math.max(20, width - 2),
        ),
      );
    // Provider-specific function removed
  ***REMOVED***participants.length > visibleParticipants.length) {
      lines.push(`  + ${participants.length - visibleParticipants.length// Provider-specific function removed more participants`);
    // Provider-specific function removed
  // Provider-specific function removed

  const recentTrace = model.trace.slice(-3).reverse();
  lines.push('Recent steps:');
***REMOVED***recentTrace.length === 0) {
    lines.push('  -');
  // Provider-specific function removed else {
    for (const item of recentTrace) {
      const durationSeconds = formatDurationSeconds(item.startedAt, item.endedAt);
      lines.push(
        ...wrapToWidth(
          `  ${formatTraceStatusTag(item.status)// Provider-specific function removed ${formatTimestamp(item.endedAt)// Provider-specific function removed ${item.stepId// Provider-specific function removed [${item.kind// Provider-specific function removed] ${durationSeconds// Provider-specific function removed`,
          Math.max(20, width - 2),
        ),
      );
    // Provider-specific function removed
  // Provider-specific function removed

  lines.push('Recent turns:');
***REMOVED***recentTurns.length === 0) {
    lines.push('  -');
  // Provider-specific function removed else {
    for (const turn of recentTurns) {
      lines.push(
        ...wrapToWidth(
          `  ${formatTurnStatusTag(turn.status)// Provider-specific function removed ${turn.displayName// Provider-specific function removed ${formatTimestamp(turn.endedAt)// Provider-specific function removed ${turn.branchId ? `${turn.branchId// Provider-specific function removed ` : ''// Provider-specific function removed${turn.stepId// Provider-specific function removed`,
          Math.max(20, width - 2),
        ),
      );
    // Provider-specific function removed
  // Provider-specific function removed

  lines.push('Recent runs:');
***REMOVED***model.runs.length === 0) {
    lines.push('  -');
  // Provider-specific function removed else {
    for (const run of model.runs.slice(0, 2)) {
      lines.push(
        ...wrapToWidth(
          `  ${shortId(run.executionRunId)// Provider-specific function removed [${formatRunStatus(run.status)// Provider-specific function removed] msgs+${run.newMessageCount// Provider-specific function removed rounds=${run.rounds// Provider-specific function removed resume=${shortId(run.resumedFromRunId)// Provider-specific function removed`,
          Math.max(20, width - 2),
        ),
      );
    // Provider-specific function removed
  // Provider-specific function removed

***REMOVED***model.note) {
    lines.push(...wrapLabeledSection('Note', model.note, width));
  // Provider-specific function removed

***REMOVED***model.error) {
    lines.push(...wrapLabeledSection('Error', model.error, width));
  // Provider-specific function removed

  const finalSummaryHeadline = extractChatroomFinalSummaryHeadline(model.finalSummary);
***REMOVED***finalSummaryHeadline) {
    lines.push(...wrapLabeledSection('Summary', finalSummaryHeadline, width));
  // Provider-specific function removed

  return lines.map((line) => fitLine(width, line));
// Provider-specific function removed

function buildAgentStatusEntries(model: Readonly<ChatroomScreenModel>): AgentStatusEntry[] {
  const entries = new Map<string, AgentStatusEntry>();

  for (const message of model.messages) {
    const existing = entries.get(message.authorId);
  ***REMOVED***!existing) {
      entries.set(message.authorId, {
        authorId: message.authorId,
        authorName: message.authorName,
        badge: getSpeakerBadge(message),
        role: message.role,
        messageCount: 1,
        lastRound: message.round,
        lastAt: message.createdAt,
        statusLabel: deriveAgentStatusLabel(message.authorId, message.role, model.currentAgentIds),
        isActive: (model.currentAgentIds ?? []).includes(message.authorId),
        isFiltered: model.filterAuthorId === message.authorId,
      // Provider-specific function removed);
      continue;
    // Provider-specific function removed

    existing.messageCount += 1;
    existing.lastRound = Math.max(existing.lastRound, message.round);
    existing.lastAt = message.createdAt;
    existing.isActive =
      existing.isActive || (model.currentAgentIds ?? []).includes(message.authorId);
    existing.isFiltered = existing.isFiltered || model.filterAuthorId === message.authorId;
  ***REMOVED***message.role === 'summary') {
      existing.role = message.role;
    // Provider-specific function removed
  // Provider-specific function removed

***REMOVED***...entries.values()]
    .sort((left, right) => {
    ***REMOVED***left.isActive !== right.isActive) {
        return left.isActive ? -1 : 1;
      // Provider-specific function removed
      return compareTimestamps(right.lastAt, left.lastAt);
    // Provider-specific function removed)
    .map((entry) => ({
      ...entry,
      statusLabel: deriveAgentStatusLabel(entry.authorId, entry.role, model.currentAgentIds),
    // Provider-specific function removed));
// Provider-specific function removed

function deriveAgentStatusLabel(
  authorId: string,
  role: ChatroomMessage['role'],
  currentAgentIds: readonly string[] | undefined,
): string {
***REMOVED***(currentAgentIds ?? []).includes(authorId)) {
    return role === 'summary' ? 'summarizing' : 'running';
  // Provider-specific function removed

***REMOVED***role === 'system') {
    return 'system';
  // Provider-specific function removed

***REMOVED***role === 'user') {
    return 'human';
  // Provider-specific function removed

  return 'idle';
// Provider-specific function removed

function getSpeakerBadge(message: Readonly<ChatroomMessage>): string {
  return resolveSpeakerBadge({
    role: message.role,
    authorId: message.authorId,
    authorName: message.authorName,
  // Provider-specific function removed);
// Provider-specific function removed

function resolveSpeakerBadge(args: {
  role: ChatroomMessage['role'];
  authorId: string;
  authorName: string;
// Provider-specific function removed): string {
***REMOVED***args.role === 'system') {
    return 'SYS';
  // Provider-specific function removed

***REMOVED***args.role === 'summary') {
    return 'SUM';
  // Provider-specific function removed

***REMOVED***args.role === 'user') {
    return args.authorName === 'You' ? 'YOU' : 'USR';
  // Provider-specific function removed

  for (const [pattern, badge] of speakerBadgePatterns) {
  ***REMOVED***args.authorId.includes(pattern)) {
      return badge;
    // Provider-specific function removed
  // Provider-specific function removed

  return deriveBadgeFromName(args.authorName);
// Provider-specific function removed

const speakerBadgePatterns: ReadonlyArray<readonly [string, string]> = [
  ['moderator', 'MOD'],
  ['strategy', 'STR'],
  ['risk', 'RSK'],
  ['product', 'PRD'],
  ['research', 'RSH'],
  ['systems', 'ARC'],
  ['implementation', 'IMP'],
  ['ux', 'UXR'],
  ['data', 'DAT'],
  ['ops', 'OPS'],
  ['security', 'SEC'],
  ['qa', 'QAT'],
  ['finance', 'FIN'],
  ['customer', 'CUS'],
  ['platform', 'PLT'],
  ['growth', 'GRW'],
  ['compliance', 'CMP'],
  ['skeptic', 'DVL'],
];

function deriveBadgeFromName(name: string): string {
  const words = name
    .split(/[^A-Za-z0-9]+/)
    .map((part) => part.trim())
    .filter(Boolean);

***REMOVED***words.length === 0) {
    return 'AGT';
  // Provider-specific function removed

***REMOVED***words.length === 1) {
    return words[0]!.slice(0, 3).toUpperCase().padEnd(3, 'X');
  // Provider-specific function removed

  return words
    .slice(0, 3)
    .map((word) => word[0]!.toUpperCase())
    .join('')
    .padEnd(3, 'X')
    .slice(0, 3);
// Provider-specific function removed

function buildFilterOptions(messages: readonly ChatroomMessage[]): RoomFilterOption[] {
  const byAuthor = new Map<string, RoomFilterOption>();

  for (const message of messages) {
    const option = byAuthor.get(message.authorId);
  ***REMOVED***!option) {
      byAuthor.set(message.authorId, {
        authorId: message.authorId,
        label: `[${getSpeakerBadge(message)// Provider-specific function removed] ${message.authorName// Provider-specific function removed`,
        count: 1,
      // Provider-specific function removed);
      continue;
    // Provider-specific function removed

    option.count += 1;
  // Provider-specific function removed

***REMOVED***
    {
      authorId: undefined,
      label: 'All',
      count: messages.length,
    // Provider-specific function removed,
    ...[...byAuthor.values()],
  ];
// Provider-specific function removed

function resolveActiveFilter(
  options: readonly RoomFilterOption[],
  authorId: string | undefined,
): RoomFilterOption {
  return options.find((option) => option.authorId === authorId) ?? options[0] ?? {
    authorId: undefined,
    label: 'All',
    count: 0,
  // Provider-specific function removed;
// Provider-specific function removed

function filterMessages(
  messages: readonly ChatroomMessage[],
  authorId: string | undefined,
): ChatroomMessage[] {
***REMOVED***!authorId) {
  ***REMOVED***...messages];
  // Provider-specific function removed

  return messages.filter((message) => message.authorId === authorId);
// Provider-specific function removed

function wrapLabeledSection(label: string, value: string, width: number): string[] {
***REMOVED***
    `${label// Provider-specific function removed:`,
    ...wrapToWidth(value, Math.max(20, width - 2)).map((line) => `  ${line// Provider-specific function removed`),
  ];
// Provider-specific function removed

function padLines(lines: readonly string[], targetHeight: number, width: number): string[] {
  const visible = [...lines].slice(0, targetHeight);
  while (visible.length < targetHeight) {
    visible.push(' '.repeat(width));
  // Provider-specific function removed

  return visible.map((line) => fitLine(width, line));
// Provider-specific function removed

function buildBoxPanel(args: {
  title: string;
  width: number;
  contentLines: readonly string[];
  useColor: boolean;
  variant: 'chat' | 'sidebar' | 'browser-list' | 'browser-sidebar' | 'browser-create';
// Provider-specific function removed): string[] {
  const innerWidth = Math.max(4, args.width - 2);
  const titleLabel = ` ${sliceToWidth(args.title, Math.max(1, innerWidth - 2))// Provider-specific function removed `;
  const fillWidth = Math.max(0, innerWidth - stringWidth(titleLabel));
  const leftFill = Math.floor(fillWidth / 2);
  const rightFill = fillWidth - leftFill;
  const contentDecorator = resolvePanelContentDecorator(args.variant);

***REMOVED***
    [
      colorize(`╭${'─'.repeat(leftFill)// Provider-specific function removed`, ansiTheme.border, args.useColor),
      colorize(titleLabel, ansiTheme.title, args.useColor),
      colorize(`${'─'.repeat(rightFill)// Provider-specific function removed╮`, ansiTheme.border, args.useColor),
    ].join(''),
    ...args.contentLines.map((line) => {
      const fitted = fitLine(innerWidth, line);
      return `${colorize('│', ansiTheme.border, args.useColor)// Provider-specific function removed${contentDecorator(fitted, args.useColor)// Provider-specific function removed${colorize('│', ansiTheme.border, args.useColor)// Provider-specific function removed`;
    // Provider-specific function removed),
    colorize(`╰${'─'.repeat(innerWidth)// Provider-specific function removed╯`, ansiTheme.border, args.useColor),
  ];
// Provider-specific function removed

function resolvePanelContentDecorator(
  variant: 'chat' | 'sidebar' | 'browser-list' | 'browser-sidebar' | 'browser-create',
): (line: string, useColor: boolean) => string {
  switch (variant) {
    case 'chat':
      return decorateChatPaneLine;
    case 'sidebar':
      return decorateSidebarLine;
    case 'browser-list':
      return decorateBrowserListLine;
    case 'browser-sidebar':
      return decorateBrowserSidebarLine;
    case 'browser-create':
      return decorateBrowserCreateLine;
    default:
      return (line) => line;
  // Provider-specific function removed
// Provider-specific function removed

function combineColumns(
  leftLines: readonly string[],
  rightLines: readonly string[],
  leftWidth: number,
  rightWidth: number,
): string[] {
  const total = Math.max(leftLines.length, rightLines.length);
  const combined: string[] = [];

  for (let index = 0; index < total; index += 1) {
    const leftLine = leftLines[index] ?? ' '.repeat(leftWidth);
    const rightLine = rightLines[index] ?? ' '.repeat(rightWidth);
    combined.push(`${leftLine// Provider-specific function removed ${rightLine// Provider-specific function removed`);
  // Provider-specific function removed

  return combined;
// Provider-specific function removed

function fitLine(width: number, value: string): string {
  const sliced = sliceToWidth(value, width);
  const padding = Math.max(0, width - stringWidth(sliced));
  return `${sliced// Provider-specific function removed${' '.repeat(padding)// Provider-specific function removed`;
// Provider-specific function removed

function wrapToWidth(value: string, width: number): string[] {
  const normalized = value.replace(/\r\n/g, '\n').split('\n');
  const lines: string[] = [];

  for (const rawLine of normalized) {
  ***REMOVED***rawLine.length === 0) {
      lines.push('');
      continue;
    // Provider-specific function removed

    let current = '';
    for (const char of [...rawLine]) {
    ***REMOVED***stringWidth(current) + charWidth(char) > width) {
        lines.push(current);
        current = char;
      // Provider-specific function removed else {
        current += char;
      // Provider-specific function removed
    // Provider-specific function removed

  ***REMOVED***current.length > 0) {
      lines.push(current);
    // Provider-specific function removed
  // Provider-specific function removed

  return lines.length > 0 ? lines : [''];
// Provider-specific function removed

function sliceToWidth(value: string, width: number): string {
  let currentWidth = 0;
  let result = '';
  for (const char of [...value]) {
    const nextWidth = currentWidth + charWidth(char);
  ***REMOVED***nextWidth > width) {
      break;
    // Provider-specific function removed

    result += char;
    currentWidth = nextWidth;
  // Provider-specific function removed

  return result;
// Provider-specific function removed

function stringWidth(value: string): number {
  let total = 0;
  for (const char of [...value]) {
    total += charWidth(char);
  // Provider-specific function removed
  return total;
// Provider-specific function removed

function charWidth(char: string): number {
  const codePoint = char.codePointAt(0);
***REMOVED***codePoint === undefined) {
    return 0;
  // Provider-specific function removed

***REMOVED***codePoint <= 0x1f || (codePoint >= 0x7f && codePoint <= 0x9f)) {
    return 0;
  // Provider-specific function removed

***REMOVED***
    codePoint >= 0x1100 &&
    (
      codePoint <= 0x115f ||
      codePoint === 0x2329 ||
      codePoint === 0x232a ||
      (codePoint >= 0x2e80 && codePoint <= 0xa4cf && codePoint !== 0x303f) ||
      (codePoint >= 0xac00 && codePoint <= 0xd7a3) ||
      (codePoint >= 0xf900 && codePoint <= 0xfaff) ||
      (codePoint >= 0xfe10 && codePoint <= 0xfe19) ||
      (codePoint >= 0xfe30 && codePoint <= 0xfe6f) ||
      (codePoint >= 0xff00 && codePoint <= 0xff60) ||
      (codePoint >= 0xffe0 && codePoint <= 0xffe6)
    )
***REMOVED***
    return 2;
  // Provider-specific function removed

  return 1;
// Provider-specific function removed

const ansiTheme = {
  reset: '\x1b[0m',
  header: '\x1b[1;97;44m',
  border: '\x1b[38;5;240m',
  title: '\x1b[1;97m',
  dim: '\x1b[2;37m',
  roomInfoPrimary: '\x1b[1;36m',
  roomInfoSecondary: '\x1b[2;36m',
  inputIdle: '\x1b[38;5;81m',
  inputFocused: '\x1b[1;30;46m',
  inputSending: '\x1b[1;30;43m',
  ok: '\x1b[38;5;114m',
  running: '\x1b[1;30;42m',
  missing: '\x1b[1;30;41m',
  warning: '\x1b[1;33m',
  info: '\x1b[38;5;117m',
// Provider-specific function removed as const;

function colorize(text: string, colorCode: string, useColor: boolean): string {
  return useColor ? `${colorCode// Provider-specific function removed${text// Provider-specific function removed${ansiTheme.reset// Provider-specific function removed` : text;
// Provider-specific function removed

function decorateHeaderLine(line: string, useColor: boolean): string {
  return colorize(line, ansiTheme.header, useColor);
// Provider-specific function removed

function decorateInfoLine(
  line: string,
  useColor: boolean,
  variant: 'primary' | 'secondary',
): string {
  return colorize(
    line,
    variant === 'primary' ? ansiTheme.roomInfoPrimary : ansiTheme.roomInfoSecondary,
    useColor,
  );
// Provider-specific function removed

function decorateHelpLine(line: string, useColor: boolean): string {
  return colorize(line, ansiTheme.dim, useColor);
// Provider-specific function removed

function decorateChatPaneLine(line: string, useColor: boolean): string {
  const trimmed = line.trim();
***REMOVED***trimmed.startsWith('Input [')) {
  ***REMOVED***trimmed.includes('[sending]')) {
      return colorize(line, ansiTheme.inputSending, useColor);
    // Provider-specific function removed

  ***REMOVED***trimmed.includes('[focused]')) {
      return colorize(line, ansiTheme.inputFocused, useColor);
    // Provider-specific function removed

    return colorize(line, ansiTheme.inputIdle, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.startsWith('You> [sending]')) {
    return colorize(line, ansiTheme.inputSending, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.startsWith('You>')) {
    return colorize(line, ansiTheme.inputFocused, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.startsWith('Error:')) {
    return colorize(line, ansiTheme.missing, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.startsWith('Note:')) {
    return colorize(line, ansiTheme.info, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.includes('[CALL]')) {
    return colorize(line, ansiTheme.warning, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.includes('[RPLY]') || trimmed.includes('[LATEST]')) {
    return colorize(line, ansiTheme.info, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.includes('earlier messages hidden') || trimmed.includes('message clipped')) {
    return colorize(line, ansiTheme.warning, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.startsWith('+ [')) {
    return colorize(line, resolveTranscriptHeaderTone(trimmed), useColor);
  // Provider-specific function removed

***REMOVED***trimmed.startsWith('|!')) {
    return colorize(line, ansiTheme.warning, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.startsWith('|>')) {
    return colorize(line, ansiTheme.info, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.startsWith('|')) {
    return colorize(line, ansiTheme.dim, useColor);
  // Provider-specific function removed

  return line;
// Provider-specific function removed

function decorateBrowserListLine(line: string, useColor: boolean): string {
  const trimmed = line.trim();

***REMOVED***trimmed.startsWith('[SEL]') || trimmed.startsWith('> ')) {
    return colorize(line, ansiTheme.inputFocused, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.includes('[HID]')) {
    return colorize(line, ansiTheme.dim, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.includes('[ARC]')) {
    return colorize(line, ansiTheme.warning, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.includes('[MK]')) {
    return colorize(line, ansiTheme.title, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.includes('[HIT]')) {
    return colorize(line, ansiTheme.info, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.includes('[NEW]')) {
    return colorize(line, ansiTheme.ok, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.includes('[UPD]')) {
    return colorize(line, ansiTheme.info, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.includes('[RUN]')) {
    return colorize(line, ansiTheme.running, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.includes('[STA]')) {
    return colorize(line, ansiTheme.warning, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.includes('[IDL]')) {
    return colorize(line, ansiTheme.dim, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.includes('[EXP]')) {
    return colorize(line, ansiTheme.title, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.includes('[IDE]')) {
    return colorize(line, ansiTheme.info, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.includes('[RP]')) {
    return colorize(line, ansiTheme.warning, useColor);
  // Provider-specific function removed

  return line;
// Provider-specific function removed

function decorateSidebarLine(line: string, useColor: boolean): string {
  const trimmed = line.trim();
***REMOVED***trimmed.endsWith('):') || trimmed === 'Recent steps:' || trimmed === 'Alerts:') {
    return colorize(line, ansiTheme.title, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.includes('[MIS]')) {
    return colorize(line, ansiTheme.missing, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.includes('[RUN]')) {
    return colorize(line, ansiTheme.running, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.includes('[OK]')) {
    return colorize(line, ansiTheme.ok, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.startsWith('Current:') || trimmed.startsWith('Round:') || trimmed.startsWith('Roster:')) {
    return colorize(line, ansiTheme.info, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.startsWith('Human:') || trimmed.startsWith('Replies:') || trimmed.startsWith('Pending:')) {
    return colorize(line, ansiTheme.info, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.includes('[CALL]')) {
    return colorize(line, ansiTheme.warning, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.includes('[RPLY]')) {
    return colorize(line, ansiTheme.ok, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.startsWith('Window:') || trimmed.startsWith('Queue:') || trimmed.startsWith('Filter:')) {
    return colorize(line, ansiTheme.dim, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.startsWith('Step:') || trimmed.startsWith('Started:') || trimmed.startsWith('Resume:')) {
    return colorize(line, ansiTheme.dim, useColor);
  // Provider-specific function removed

  return line;
// Provider-specific function removed

function decorateBrowserSidebarLine(line: string, useColor: boolean): string {
  const trimmed = line.trim();

***REMOVED***
    trimmed === 'Browser status:' ||
    trimmed === 'Selection:' ||
    trimmed === 'Objective:' ||
    trimmed === 'Latest summary:' ||
    trimmed === 'Action:' ||
    trimmed === 'Marked rooms:'
***REMOVED***
    return colorize(line, ansiTheme.title, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.includes('[HID]')) {
    return colorize(line, ansiTheme.dim, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.includes('[ARC]')) {
    return colorize(line, ansiTheme.warning, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.includes('[MK]')) {
    return colorize(line, ansiTheme.title, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.includes('[HIT]')) {
    return colorize(line, ansiTheme.info, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.includes('[NEW]')) {
    return colorize(line, ansiTheme.ok, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.includes('[UPD]')) {
    return colorize(line, ansiTheme.info, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.includes('[RUN]')) {
    return colorize(line, ansiTheme.running, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.includes('[STA]')) {
    return colorize(line, ansiTheme.warning, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.includes('[EXP]')) {
    return colorize(line, ansiTheme.title, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.includes('[IDE]')) {
    return colorize(line, ansiTheme.info, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.includes('[RP]')) {
    return colorize(line, ansiTheme.warning, useColor);
  // Provider-specific function removed

***REMOVED***
    trimmed.startsWith('Selected:') ||
    trimmed.startsWith('Window:') ||
    trimmed.startsWith('Visible:') ||
    trimmed.startsWith('Live rooms:') ||
    trimmed.startsWith('Unread:') ||
    trimmed.startsWith('Marked:') ||
    trimmed.startsWith('Search:') ||
    trimmed.startsWith('Type:') ||
    trimmed.startsWith('Sort:') ||
    trimmed.startsWith('Batch ops:')
***REMOVED***
    return colorize(line, ansiTheme.info, useColor);
  // Provider-specific function removed

***REMOVED***
    trimmed.startsWith('Runs:') ||
    trimmed.startsWith('Status:') ||
    trimmed.startsWith('Room:') ||
    trimmed.startsWith('Last run:') ||
    trimmed.startsWith('Agents:') ||
    trimmed.startsWith('Messages:') ||
    trimmed.startsWith('Updated:') ||
    trimmed.startsWith('Archived:') ||
    trimmed.startsWith('Mode:')
***REMOVED***
    return colorize(line, ansiTheme.dim, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.startsWith('Error:')) {
    return colorize(line, ansiTheme.missing, useColor);
  // Provider-specific function removed

  return line;
// Provider-specific function removed

function decorateBrowserCreateLine(line: string, useColor: boolean): string {
  const trimmed = line.trim();

***REMOVED***
    trimmed === 'New room:' ||
    trimmed.startsWith('[*] Topic') ||
    trimmed.startsWith('[*] Objective') ||
    trimmed.startsWith('[*] Speakers')
***REMOVED***
    return colorize(line, ansiTheme.title, useColor);
  // Provider-specific function removed

***REMOVED***
    trimmed.startsWith('[ ] Topic') ||
    trimmed.startsWith('[ ] Objective') ||
    trimmed.startsWith('[ ] Speakers')
***REMOVED***
    return colorize(line, ansiTheme.dim, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.startsWith('Submitting...')) {
    return colorize(line, ansiTheme.running, useColor);
  // Provider-specific function removed

***REMOVED***trimmed.startsWith('Enter create')) {
    return colorize(line, ansiTheme.info, useColor);
  // Provider-specific function removed

***REMOVED***trimmed === 'Note:' || trimmed.startsWith('Error:')) {
    return trimmed.startsWith('Error:')
      ? colorize(line, ansiTheme.missing, useColor)
      : colorize(line, ansiTheme.info, useColor);
  // Provider-specific function removed

  return line;
// Provider-specific function removed

function resolveTranscriptHeaderTone(line: string): string {
***REMOVED***line.includes('[CALL]')) {
    return '\x1b[1;30;43m';
  // Provider-specific function removed

***REMOVED***line.includes('[RPLY]') || line.includes('[LATEST]')) {
    return '\x1b[1;36m';
  // Provider-specific function removed

***REMOVED***line.includes('[SUM]')) {
    return '\x1b[1;30;43m';
  // Provider-specific function removed

***REMOVED***line.includes('[YOU]')) {
    return '\x1b[1;30;46m';
  // Provider-specific function removed

***REMOVED***line.includes('[USR]')) {
    return '\x1b[1;36m';
  // Provider-specific function removed

***REMOVED***line.includes('[SYS]')) {
    return '\x1b[1;35m';
  // Provider-specific function removed

***REMOVED***line.includes('[MOD]')) {
    return '\x1b[1;94m';
  // Provider-specific function removed

***REMOVED***line.includes('[STR]')) {
    return '\x1b[1;92m';
  // Provider-specific function removed

***REMOVED***line.includes('[RSK]')) {
    return '\x1b[1;91m';
  // Provider-specific function removed

***REMOVED***line.includes('[PRD]')) {
    return '\x1b[1;95m';
  // Provider-specific function removed

***REMOVED***line.includes('[ARC]')) {
    return '\x1b[1;96m';
  // Provider-specific function removed

***REMOVED***line.includes('[IMP]')) {
    return '\x1b[1;93m';
  // Provider-specific function removed

  return '\x1b[1;97m';
// Provider-specific function removed

function shortId(value?: string): string {
***REMOVED***!value) {
    return '-';
  // Provider-specific function removed

  return value.length > 12 ? value.slice(0, 12) : value;
// Provider-specific function removed

function formatStatus(status: ScreenStatus): string {
  switch (status) {
    case 'starting':
      return 'STARTING';
    case 'running':
      return 'RUNNING';
    case 'cancelled':
      return 'CANCELLED';
    case 'completed':
      return 'COMPLETED';
    case 'failed':
      return 'FAILED';
    default:
      return 'IDLE';
  // Provider-specific function removed
// Provider-specific function removed

function isRoomRunActive(status: ScreenStatus***REMOVED***
  return status === 'starting' || status === 'running';
// Provider-specific function removed

function formatTimestamp(value?: string): string {
***REMOVED***!value) {
    return '-';
  // Provider-specific function removed

  const date = new Date(value);
***REMOVED***Number.isNaN(date.getTime())) {
    return value;
  // Provider-specific function removed

  return date.toLocaleTimeString('zh-CN', {
    hour12: false,
  // Provider-specific function removed);
// Provider-specific function removed

function formatDurationSeconds(startedAt: string, endedAt: string): string {
  const start = new Date(startedAt).getTime();
  const end = new Date(endedAt).getTime();
***REMOVED***!Number.isFinite(start) || !Number.isFinite(end)) {
    return '-';
  // Provider-specific function removed

  return `${((end - start) / 1000).toFixed(1)// Provider-specific function removeds`;
// Provider-specific function removed

function resolveRoomPanelHeights(totalHeight: number): {
  transcriptHeight: number;
  statusHeight: number;
// Provider-specific function removed {
  const fixedLines = 15;
  const minTranscriptHeight = totalHeight < 28 ? 5 : 8;
  const minStatusHeight = totalHeight < 28 ? 4 : 6;
  const available = Math.max(
    minTranscriptHeight + minStatusHeight,
    totalHeight - fixedLines,
  );
  const transcriptHeight = Math.max(
    minTranscriptHeight,
    Math.min(available - minStatusHeight, Math.floor(available * 0.58)),
  );
  const statusHeight = Math.max(minStatusHeight, available - transcriptHeight);

  return {
    transcriptHeight,
    statusHeight,
  // Provider-specific function removed;
// Provider-specific function removed

function buildComposerHelpLine(model: Readonly<ChatroomScreenModel>): string {
***REMOVED***!process.stdout.isTTY || !process.stdin.isTTY) {
    return 'Composer: snapshot mode | inline input disabled';
  // Provider-specific function removed

***REMOVED***model.submittingMessage) {
    return 'Composer: sending... | Enter disabled | Esc blur | Ctrl+U clear';
  // Provider-specific function removed

***REMOVED***model.composerFocused) {
    return 'Composer: focused | Enter send | Esc blur | Ctrl+U clear | q types normally';
  // Provider-specific function removed

  return isRoomRunActive(model.status)
    ? 'Composer: press m to focus | j/k scroll | h/l filter | a auto | s stop | b browser | q quit'
    : 'Composer: press m to focus | j/k scroll | h/l filter | a auto | b browser | q quit';
// Provider-specific function removed

function buildComposerInputLine(
  model: Readonly<ChatroomScreenModel>,
  width: number,
): string {
  const prefix = model.submittingMessage ? 'You> [sending] ' : 'You> ';
  const placeholder = model.composerFocused
    ? '_'
    : '(press m to chat with the room)';
  const value = model.draftMessage.length > 0 ? model.draftMessage : placeholder;
  const availableWidth = Math.max(10, width - stringWidth(prefix));
  return fitLine(width, `${prefix// Provider-specific function removed${clipTextToWidthFromEnd(value, availableWidth)// Provider-specific function removed`);
// Provider-specific function removed

function buildRoundLabel(round: number): string {
  return round > 0 ? `R${round// Provider-specific function removed` : 'Seed';
// Provider-specific function removed

function resolveCurrentRound(messages: readonly ChatroomMessage[]): number {
  let currentRound = 0;
  for (const message of messages) {
  ***REMOVED***message.role === 'agent' || message.role === 'user') {
      currentRound = Math.max(currentRound, message.round);
    // Provider-specific function removed
  // Provider-specific function removed

  return currentRound;
// Provider-specific function removed

function countRoundAgents(messages: readonly ChatroomMessage[], round: number): number {
***REMOVED***round <= 0) {
    return 0;
  // Provider-specific function removed

  return new Set(
    messages
      .filter((message) => message.role === 'agent' && message.round === round)
      .map((message) => message.authorId),
  ).size;
// Provider-specific function removed

function shortStepId(stepId?: string): string {
***REMOVED***!stepId) {
    return '-';
  // Provider-specific function removed

  return stepId.length > 24 ? `${stepId.slice(0, 24)// Provider-specific function removed...` : stepId;
// Provider-specific function removed

function clipTextToWidthFromEnd(value: string, width: number): string {
***REMOVED***width <= 0) {
    return '';
  // Provider-specific function removed

***REMOVED***stringWidth(value) <= width) {
    return value;
  // Provider-specific function removed

  const ellipsis = '...';
  const tailWidth = Math.max(0, width - stringWidth(ellipsis));
  const characters = [...value];
  let current = '';

  for (let index = characters.length - 1; index >= 0; index -= 1) {
    const char = characters[index] ?? '';
  ***REMOVED***stringWidth(current) + charWidth(char) > tailWidth) {
      break;
    // Provider-specific function removed

    current = `${char// Provider-specific function removed${current// Provider-specific function removed`;
  // Provider-specific function removed

  return `${ellipsis// Provider-specific function removed${current// Provider-specific function removed`;
// Provider-specific function removed

function isTextInputChunk(input: string, key: readline.Key***REMOVED***
***REMOVED***!input || key.ctrl || key.meta) {
    return false;
  // Provider-specific function removed

  const normalized = input.replace(/\r?\n/g, '');
***REMOVED***normalized.length === 0) {
    return false;
  // Provider-specific function removed

***REMOVED***...normalized].some((char) => charWidth(char) > 0);
// Provider-specific function removed

function buildBrowserHelpLine(model: Readonly<ChatroomScreenModel>): string {
***REMOVED***!process.stdout.isTTY || !process.stdin.isTTY) {
    return `Ops: snapshot mode | rooms ${model.browserRooms.length// Provider-specific function removed | Enter open | r refresh | f status | v type | q quit`;
  // Provider-specific function removed

***REMOVED***model.browserCreateActive) {
    return 'Ops: type text | Tab switch field | Left/Right change mode/type | Enter create | Ctrl+U clear field | Esc cancel';
  // Provider-specific function removed

***REMOVED***model.browserSearchActive) {
    return 'Ops: type search | Enter/Esc stop | Ctrl+U clear | f status | v type | s sort';
  // Provider-specific function removed

  return 'Ops: / search | f status | v type | Space mark | u resume | p queue | P batch-queue | A batch-archive | X batch-hide | c clear | x hide | z archive | d delete | n new';
// Provider-specific function removed

function buildBrowserBadgeBlock(
  entry: Readonly<RoomBrowserEntry>,
  unread: boolean,
  searchHit: boolean,
): string {
  const statusTag = resolveBrowserRoomStatusTag(entry);
  const badges = [statusTag];
***REMOVED***entry.queuePaused && statusTag !== '[PAU]') {
    badges.push('[PAU]');
  // Provider-specific function removed
***REMOVED***unread) {
    badges.push('[NEW]');
  // Provider-specific function removed
***REMOVED***isBrowserRoomFresh(entry) && !unread) {
    badges.push('[UPD]');
  // Provider-specific function removed
***REMOVED***isLikelyTestRoom(entry)) {
    badges.push('[TST]');
  // Provider-specific function removed
***REMOVED***searchHit) {
    badges.push('[HIT]');
  // Provider-specific function removed
  return badges.join('');
// Provider-specific function removed

function buildBrowserStateBadgeBlock(
  archived: boolean,
  hidden: boolean,
  marked = false,
): string {
  const badges: string[] = [];
***REMOVED***marked) {
    badges.push('[MK]');
  // Provider-specific function removed
***REMOVED***archived) {
    badges.push('[ARC]');
  // Provider-specific function removed
***REMOVED***hidden) {
    badges.push('[HID]');
  // Provider-specific function removed
***REMOVED***badges.length === 0) {
    badges.push('[ACT]');
  // Provider-specific function removed
  return badges.join('');
// Provider-specific function removed

function removeLastCharacter(value: string): string {
  const characters = [...value];
  characters.pop();
  return characters.join('');
// Provider-specific function removed

function resolveSelectedBrowserEntry(
  rooms: readonly RoomBrowserEntry[],
  selectedIndex: number,
): RoomBrowserEntry | undefined {
***REMOVED***rooms.length === 0) {
    return undefined;
  // Provider-specific function removed

  return rooms[clamp(selectedIndex, 0, rooms.length - 1)];
// Provider-specific function removed

function resolveBrowserWindow(
  roomCount: number,
  selectedIndex: number,
  roomsPerPage: number,
): {
  startIndex: number;
  endIndex: number;
// Provider-specific function removed {
***REMOVED***roomCount <= 0) {
    return {
      startIndex: 0,
      endIndex: -1,
    // Provider-specific function removed;
  // Provider-specific function removed

  const clampedSelected = clamp(selectedIndex, 0, roomCount - 1);
  const startIndex = clamp(
    clampedSelected - Math.floor(roomsPerPage / 2),
    0,
    Math.max(0, roomCount - roomsPerPage),
  );
  const endIndex = Math.min(roomCount - 1, startIndex + roomsPerPage - 1);

  return {
    startIndex,
    endIndex,
  // Provider-specific function removed;
// Provider-specific function removed

function isBrowserRoomLive(entry: Readonly<RoomBrowserEntry>***REMOVED***
  return entry.live?.status === 'starting' || entry.live?.status === 'running';
// Provider-specific function removed

function isBrowserRoomFresh(entry: Readonly<RoomBrowserEntry>***REMOVED***
  const updatedAt = resolveBrowserEntryUpdatedAt(entry);
  const updatedTime = new Date(updatedAt).getTime();
***REMOVED***!Number.isFinite(updatedTime)) {
    return false;
  // Provider-specific function removed

  return Date.now() - updatedTime <= 5 * 60 * 1000;
// Provider-specific function removed

function countFreshBrowserRooms(rooms: readonly RoomBrowserEntry[]): number {
  return rooms.filter((entry) => isBrowserRoomFresh(entry)).length;
// Provider-specific function removed

function resolveBrowserEntryUpdatedAt(entry: Readonly<RoomBrowserEntry>): string {
  return entry.live?.updatedAt ?? entry.room.updatedAt;
// Provider-specific function removed

function formatBrowserRunState(entry: Readonly<RoomBrowserEntry>): string {
***REMOVED***entry.live?.status) {
    return entry.live.status;
  // Provider-specific function removed

  return entry.latestRun ? formatRunStatus(entry.latestRun.status) : 'none';
// Provider-specific function removed

function resolveBrowserRoomStatusTag(entry: Readonly<RoomBrowserEntry>): string {
***REMOVED***entry.live?.status === 'starting') {
    return '[STA]';
  // Provider-specific function removed

***REMOVED***entry.live?.status === 'running') {
    return '[RUN]';
  // Provider-specific function removed

***REMOVED***entry.live?.status === 'failed' || entry.latestRun?.status === 'failed') {
    return '[ERR]';
  // Provider-specific function removed

***REMOVED***entry.live?.status === 'cancelled' || entry.latestRun?.status === 'cancelled') {
    return '[CAN]';
  // Provider-specific function removed

***REMOVED***entry.queuePaused) {
    return '[PAU]';
  // Provider-specific function removed

***REMOVED***entry.live?.status === 'completed' || entry.latestRun?.status === 'completed') {
    return '[OK]';
  // Provider-specific function removed

  return '[IDL]';
// Provider-specific function removed

function browserStatusLabel(entry: Readonly<RoomBrowserEntry>): string {
***REMOVED***entry.live?.status === 'starting') {
    return 'STARTING';
  // Provider-specific function removed

***REMOVED***entry.live?.status === 'running') {
    return 'RUNNING';
  // Provider-specific function removed

***REMOVED***entry.live?.status === 'failed' || entry.latestRun?.status === 'failed') {
    return 'FAILED';
  // Provider-specific function removed

***REMOVED***entry.live?.status === 'cancelled' || entry.latestRun?.status === 'cancelled') {
    return 'CANCELLED';
  // Provider-specific function removed

***REMOVED***entry.queuePaused) {
    return 'QUEUE PAUSED';
  // Provider-specific function removed

***REMOVED***entry.live?.status === 'completed' || entry.latestRun?.status === 'completed') {
    return 'COMPLETED';
  // Provider-specific function removed

  return 'IDLE';
// Provider-specific function removed

function getVisibleBrowserEntries(
  model: Readonly<ChatroomScreenModel>,
): RoomBrowserEntry[] {
***REMOVED***...model.browserRooms]
    .filter((entry) => matchesBrowserEntryFilter(entry, model))
    .filter((entry) => matchesBrowserRoomTypeFilter(entry, model.browserRoomTypeFilter))
    .filter((entry) => matchesBrowserSearch(entry, model.browserSearchQuery))
    .sort((left, right) => compareBrowserEntries(left, right, model.browserSortMode));
// Provider-specific function removed

function matchesBrowserEntryFilter(
  entry: Readonly<RoomBrowserEntry>,
  model: Readonly<ChatroomScreenModel>,
***REMOVED***
  const archived = model.browserArchivedRoomIds.includes(entry.room.roomId);
  const hidden = model.browserHiddenRoomIds.includes(entry.room.roomId);
  const live = isBrowserRoomLive(entry);
  const testLike = isLikelyTestRoom(entry);

***REMOVED***model.browserFilterMode === 'archived') {
    return archived;
  // Provider-specific function removed

***REMOVED***model.browserFilterMode === 'hidden') {
    return hidden;
  // Provider-specific function removed

***REMOVED***hidden) {
    return false;
  // Provider-specific function removed

***REMOVED***model.browserHideTestRooms && testLike) {
    return false;
  // Provider-specific function removed

  switch (model.browserFilterMode) {
    case 'active':
      return !archived;
    case 'live':
      return live;
    case 'all':
    default:
      return true;
  // Provider-specific function removed
// Provider-specific function removed

function matchesBrowserSearch(
  entry: Readonly<RoomBrowserEntry>,
  query: string,
***REMOVED***
  return query.trim().length === 0 || getBrowserSearchHitFields(entry, query).length > 0;
// Provider-specific function removed

function matchesBrowserRoomTypeFilter(
  entry: Readonly<RoomBrowserEntry>,
  roomTypeFilter: BrowserRoomTypeFilter,
***REMOVED***
  return roomTypeFilter === 'all' || entry.room.roomType === roomTypeFilter;
// Provider-specific function removed

function getBrowserSearchHitFields(
  entry: Readonly<RoomBrowserEntry>,
  query: string,
): string[] {
  const normalizedQuery = query.trim().toLowerCase();
***REMOVED***normalizedQuery.length === 0) {
  ***REMOVED***];
  // Provider-specific function removed

  const hits: string[] = [];
  const searchableFields: Array<readonly [string, string | undefined]> = [
    ['topic', entry.room.topic],
    ['objective', entry.room.objective],
    ['room', entry.room.roomId],
    ['main', entry.room.mainSessionId],
    ['run', entry.room.lastExecutionRunId],
    ['summary', entry.room.lastSummaryPreview],
  ];

  for (const [label, value] of searchableFields) {
  ***REMOVED***value?.toLowerCase().includes(normalizedQuery)) {
      hits.push(label);
    // Provider-specific function removed
  // Provider-specific function removed

  return hits;
// Provider-specific function removed

function compareBrowserEntries(
  left: Readonly<RoomBrowserEntry>,
  right: Readonly<RoomBrowserEntry>,
  sortMode: BrowserSortMode,
): number {
  switch (sortMode) {
    case 'created':
      return compareTimestamps(right.room.createdAt, left.room.createdAt);
    case 'messages':
      return right.room.messageCount - left.room.messageCount || compareTimestamps(right.room.updatedAt, left.room.updatedAt);
    case 'runs':
      return right.room.runCount - left.room.runCount || compareTimestamps(right.room.updatedAt, left.room.updatedAt);
    case 'topic':
      return left.room.topic.localeCompare(right.room.topic, 'zh-CN');
    case 'updated':
    default:
      return compareTimestamps(resolveBrowserEntryUpdatedAt(right), resolveBrowserEntryUpdatedAt(left));
  // Provider-specific function removed
// Provider-specific function removed

function isLikelyTestRoom(entry: Readonly<RoomBrowserEntry>***REMOVED***
  const haystack = `${entry.room.topic// Provider-specific function removed ${entry.room.objective// Provider-specific function removed ${entry.room.lastSummaryPreview ?? ''// Provider-specific function removed`.toLowerCase();
***REMOVED***
    'test',
    'validation',
    'verify',
    'smoke',
    'queue',
    '验证',
    '测试',
    '冒烟',
    '联通',
  ].some((token) => haystack.includes(token));
// Provider-specific function removed

function formatBrowserFilterMode(mode: BrowserFilterMode): string {
  switch (mode) {
    case 'active':
      return 'active';
    case 'all':
      return 'all';
    case 'archived':
      return 'archived';
    case 'hidden':
      return 'hidden';
    case 'live':
      return 'live';
    default:
      return mode;
  // Provider-specific function removed
// Provider-specific function removed

function formatBrowserRoomTypeFilter(mode: BrowserRoomTypeFilter): string {
  return mode === 'all' ? 'all' : buildBrowserRoomTypeDescriptor(mode, 'full');
// Provider-specific function removed

function formatBrowserRoomTypeFilterTag(mode: BrowserRoomTypeFilter): string {
  return mode === 'all' ? 'all' : resolveBrowserRoomTypeBadge(mode).slice(1, -1).trim();
// Provider-specific function removed

function formatBrowserSortMode(mode: BrowserSortMode): string {
  switch (mode) {
    case 'updated':
      return 'updated';
    case 'created':
      return 'created';
    case 'messages':
      return 'messages';
    case 'runs':
      return 'runs';
    case 'topic':
      return 'topic';
    default:
      return mode;
  // Provider-specific function removed
// Provider-specific function removed

function buildPlainWelcomeLines(model: Readonly<ChatroomScreenModel>): string[] {
***REMOVED***
    '',
    `=== AX-001 Plain Chat | ${model.topic ?? '-'// Provider-specific function removed ===`,
    `Room ${shortId(model.roomId)// Provider-specific function removed | Type ${getChatroomRoomTypeShortLabel(model.roomRecord?.roomType ?? DEFAULT_CHATROOM_ROOM_TYPE)// Provider-specific function removed | Run ${shortId(model.executionRunId)// Provider-specific function removed | Agents ${model.roomRecord?.speakerIds.length ?? estimateSpeakerCount(model)// Provider-specific function removed`,
    'Commands: /help | /status | /pause | /resume | /stop | /quit',
    '输入消息后直接回车发送；命令：/help | /status | /quit',
    '',
  ];
// Provider-specific function removed

function buildPlainStatusLines(model: Readonly<ChatroomScreenModel>): string[] {
  const participants = buildAgentStatusEntries(model);
  const attention = buildRoomAttentionSnapshot(model);
  const recentTurns = buildRecentTurnStatusEntries(model).slice(0, 3);
  const allRecentTurns = buildRecentTurnStatusEntries(model);
  const recoveryStats = aggregateStructuredOutputRecoveryStats(model.trace);
  const selectedTurn =
    allRecentTurns[clamp(model.selectedRecentTurnIndex, 0, Math.max(0, allRecentTurns.length - 1))];
  const plainWidth = Math.max(80, getViewportWidth(false) - 8);
  const lines = [
    `[status] ${formatStatus(model.status)// Provider-specific function removed | round ${buildRoundLabel(resolveCurrentRound(model.messages))// Provider-specific function removed | current ${formatCurrentAgents(model, participants)// Provider-specific function removed`,
    `[run] ${shortId(model.executionRunId)// Provider-specific function removed | latest=${model.runs[0] ? formatRunStatus(model.runs[0].status) : '-'// Provider-specific function removed | resume=${shortId(model.resumedFromRunId)// Provider-specific function removed`,
    `[recovery] ${formatRunRecoverySummary(recoveryStats)// Provider-specific function removed | so=${formatRunStructuredSummary(recoveryStats)// Provider-specific function removed`,
    `[room] type=${model.roomRecord?.roomType ?? DEFAULT_CHATROOM_ROOM_TYPE// Provider-specific function removed | topic=${model.topic ?? '-'// Provider-specific function removed | queue=${formatQueueMode(model)// Provider-specific function removed:${model.pendingMessages.length// Provider-specific function removed | messages=${model.messages.length// Provider-specific function removed`,
    `[focus] human=${attention.latestHumanMessage ? `${attention.latestHumanMessage.authorName// Provider-specific function removed@${formatTimestamp(attention.latestHumanMessage.createdAt)// Provider-specific function removed` : '-'// Provider-specific function removed | replies=${attention.repliesSinceLatestHuman// Provider-specific function removed | mentions=${attention.directMentionsSinceLatestHuman// Provider-specific function removed`,
  ];

***REMOVED***model.queuePaused) {
    lines.push(
      `[queue] paused${model.queuePauseAt ? ` @ ${formatTimestamp(model.queuePauseAt)// Provider-specific function removed` : ''// Provider-specific function removed${
        model.queuePauseReason ? ` | ${model.queuePauseReason// Provider-specific function removed` : ''
      // Provider-specific function removed`,
    );
  // Provider-specific function removed

  const typingAgents = formatCurrentAgents(model, participants);
***REMOVED***typingAgents !== '-') {
    lines.push(`[typing] ${typingAgents// Provider-specific function removed typing...`);
  // Provider-specific function removed

***REMOVED***recentTurns.length > 0) {
    lines.push(
      `[turns] ${recentTurns
        .map((turn) => `${turn.displayName// Provider-specific function removed:${formatTurnStatusTag(turn.status)// Provider-specific function removed`)
        .join(' | ')// Provider-specific function removed`,
    );
  // Provider-specific function removed

***REMOVED***selectedTurn) {
    lines.push(
      `[turn] ${clamp(model.selectedRecentTurnIndex + 1, 1, allRecentTurns.length)// Provider-specific function removed/${allRecentTurns.length// Provider-specific function removed ${formatTurnStatusTag(selectedTurn.status)// Provider-specific function removed ${selectedTurn.displayName// Provider-specific function removed | step=${selectedTurn.stepId// Provider-specific function removed | branch=${selectedTurn.branchId ?? '-'// Provider-specific function removed | ended=${formatTimestamp(selectedTurn.endedAt)// Provider-specific function removed`,
    );
    lines.push(
      ...wrapPlainDetailSection(
        'turn-meta',
        `started=${formatTimestamp(selectedTurn.startedAt)// Provider-specific function removed | usage=${formatTurnUsageSummary(selectedTurn.usage)// Provider-specific function removed`,
        plainWidth,
      ),
    );
    lines.push(
      ...wrapPlainDetailSection(
        'turn-input',
        selectedTurn.inputPreview ?? '-',
        plainWidth,
      ),
    );
    lines.push(
      ...wrapPlainDetailSection(
        'turn-output',
        truncateText(formatDetailValue(selectedTurn.output), 360),
        plainWidth,
      ),
    );
  ***REMOVED***selectedTurn.error) {
      lines.push(
        ...wrapPlainDetailSection(
          'turn-error',
          truncateText(selectedTurn.error, 360),
          plainWidth,
        ),
      );
    // Provider-specific function removed
  // Provider-specific function removed

  return lines;
// Provider-specific function removed

function formatPlainMessageLines(
  message: Readonly<ChatroomMessage>,
  attention: Readonly<TranscriptMessageAttention>,
  useColor: boolean,
): string[] {
  const roundLabel = message.round > 0 ? `R${message.round// Provider-specific function removed` : 'Seed';
  const roleLabel = formatPlainRoleLabel(message.role);
  const badge = message.authorName === 'You' ? 'YOU' : getSpeakerBadge(message);
  const attentionTags = buildTranscriptAttentionTags(attention);
  const prefixText = `[${formatTimestamp(message.createdAt)// Provider-specific function removed] [${badge// Provider-specific function removed]${attentionTags.length > 0 ? ` ${attentionTags.join('')// Provider-specific function removed` : ''// Provider-specific function removed ${message.authorName// Provider-specific function removed | ${roleLabel// Provider-specific function removed | ${roundLabel// Provider-specific function removed`;
  const prefix = colorizePlainMessagePrefix(prefixText, message, attention, useColor);
  const bodyLines = message.content
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => (line.length > 0 ? line : ' '));

  const bodyPrefix =
    attention.isDirectMention || attention.isReplyToLatestHuman
      ? '  ! '
      : attention.isLatestHuman
        ? '  > '
        : '  ';

***REMOVED***prefix, ...bodyLines.map((line) => `${bodyPrefix// Provider-specific function removed${line// Provider-specific function removed`), ''];
// Provider-specific function removed

function formatPlainRoleLabel(role: ChatroomMessage['role']): string {
  switch (role) {
    case 'system':
      return '系统';
    case 'user':
      return '用户';
    case 'summary':
      return '总结';
    default:
      return 'Agent';
  // Provider-specific function removed
// Provider-specific function removed

function appendPlainRenderedMessage(
  target: string[],
  message: Readonly<ChatroomMessage>,
  previousMessageAt: string | undefined,
  attention: Readonly<TranscriptMessageAttention>,
  useColor: boolean,
): void {
  const separator = buildPlainTimeSeparator(previousMessageAt, message.createdAt, useColor);
***REMOVED***separator) {
    target.push(separator);
  // Provider-specific function removed

  target.push(...formatPlainMessageLines(message, attention, useColor));
// Provider-specific function removed

function buildPlainTimeSeparator(
  previousMessageAt: string | undefined,
  currentMessageAt: string | undefined,
  useColor: boolean,
): string | undefined {
***REMOVED***!currentMessageAt) {
    return undefined;
  // Provider-specific function removed

  const current = new Date(currentMessageAt);
***REMOVED***Number.isNaN(current.getTime())) {
    return undefined;
  // Provider-specific function removed

***REMOVED***!previousMessageAt) {
    return colorize(
      `──── ${formatPlainSeparatorTimestamp(currentMessageAt)// Provider-specific function removed ────`,
      ansiTheme.border,
      useColor,
    );
  // Provider-specific function removed

  const previous = new Date(previousMessageAt);
***REMOVED***Number.isNaN(previous.getTime())) {
    return undefined;
  // Provider-specific function removed

  const isNewDay = current.toDateString() !== previous.toDateString();
  const hasGap = current.getTime() - previous.getTime() >= 5 * 60 * 1000;
***REMOVED***!isNewDay && !hasGap) {
    return undefined;
  // Provider-specific function removed

  return colorize(
    `──── ${formatPlainSeparatorTimestamp(currentMessageAt)// Provider-specific function removed ────`,
    ansiTheme.border,
    useColor,
  );
// Provider-specific function removed

function formatPlainSeparatorTimestamp(value: string): string {
  const date = new Date(value);
***REMOVED***Number.isNaN(date.getTime())) {
    return value;
  // Provider-specific function removed

  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  // Provider-specific function removed);
// Provider-specific function removed

function colorizePlainMessagePrefix(
  prefix: string,
  message: Readonly<ChatroomMessage>,
  attention: Readonly<TranscriptMessageAttention>,
  useColor: boolean,
): string {
***REMOVED***attention.isDirectMention) {
    return colorize(prefix, ansiTheme.warning, useColor);
  // Provider-specific function removed

***REMOVED***attention.isReplyToLatestHuman || attention.isLatestHuman) {
    return colorize(prefix, ansiTheme.info, useColor);
  // Provider-specific function removed

***REMOVED***message.authorName === 'You') {
    return colorize(prefix, ansiTheme.inputFocused, useColor);
  // Provider-specific function removed

***REMOVED***message.role === 'summary') {
    return colorize(prefix, ansiTheme.warning, useColor);
  // Provider-specific function removed

***REMOVED***message.role === 'system') {
    return colorize(prefix, ansiTheme.info, useColor);
  // Provider-specific function removed

  return colorize(prefix, resolveTranscriptHeaderTone(`[${getSpeakerBadge(message)// Provider-specific function removed]`), useColor);
// Provider-specific function removed

function getViewportWidth(interactive: boolean): number {
  return interactive ? (process.stdout.columns ?? 120) : 120;
// Provider-specific function removed

function getViewportHeight(interactive: boolean): number {
  return interactive ? (process.stdout.rows ?? 40) : 40;
// Provider-specific function removed

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
// Provider-specific function removed

function estimateSpeakerCount(model: Readonly<ChatroomScreenModel>): number {
  return new Set(
    model.messages
      .filter((message) => message.role === 'agent')
      .map((message) => message.authorId),
  ).size;
// Provider-specific function removed

function formatCurrentAgents(
  model: Readonly<ChatroomScreenModel>,
  participants: readonly AgentStatusEntry[],
): string {
  const currentAgentIds = model.currentAgentIds ?? [];
***REMOVED***currentAgentIds.length === 0) {
    return '-';
  // Provider-specific function removed

  return currentAgentIds
    .map((agentId) => {
      const participant = participants.find((item) => item.authorId === agentId);
    ***REMOVED***!participant) {
        return agentId;
      // Provider-specific function removed

      return `[${participant.badge// Provider-specific function removed] ${participant.authorName// Provider-specific function removed`;
    // Provider-specific function removed)
    .join(', ');
// Provider-specific function removed

function resolveBrowserUpdatedAt(rooms: readonly RoomBrowserEntry[]): string | undefined {
  const timestamps = rooms
    .map((entry) => entry.live?.updatedAt ?? entry.room.updatedAt)
    .filter((value): value is string => Boolean(value));

  return timestamps.sort(compareTimestamps).at(-1);
// Provider-specific function removed

function resolveRoomSnapshotUpdatedAt(snapshot: Readonly<ChatroomRoomSnapshot>): string | undefined {
  return (
    snapshot.live?.updatedAt ??
    snapshot.runs[0]?.endedAt ??
    snapshot.room?.updatedAt
  );
// Provider-specific function removed

function formatError(error: unknown): string {
***REMOVED***error instanceof Error) {
    return error.stack ?? error.message;
  // Provider-specific function removed

  return String(error);
// Provider-specific function removed

function loadLatestRunTrace(
  run?: ChatroomExecutionRunRecord,
): WorkflowTraceRecord[] {
***REMOVED***!run?.artifactDirectory) {
  ***REMOVED***];
  // Provider-specific function removed

  try {
    const raw = readFileSync(`${run.artifactDirectory// Provider-specific function removed/trace.json`, 'utf8');
    return JSON.parse(raw) as WorkflowTraceRecord[];
  // Provider-specific function removed catch {
  ***REMOVED***];
  // Provider-specific function removed
// Provider-specific function removed

function parseBrowserCreateScoreDimensions(input: string): string[] {
  const normalized = input.trim();
***REMOVED***!normalized) {
  ***REMOVED***];
  // Provider-specific function removed

  const unique = new Set<string>();
  for (const raw of normalized.split(/[,\n|;\uFF0C\uFF1B\u3001]/g)) {
    const value = raw.trim();
  ***REMOVED***value.length > 0) {
      unique.add(value);
    // Provider-specific function removed
  // Provider-specific function removed
***REMOVED***...unique];
// Provider-specific function removed

function shouldPreferLiveSnapshot(snapshot: ChatroomRoomSnapshot***REMOVED***
***REMOVED***!snapshot.live) {
    return false;
  // Provider-specific function removed

***REMOVED***snapshot.live.status === 'starting' || snapshot.live.status === 'running') {
    return true;
  // Provider-specific function removed

  return snapshot.live.executionRunId !== snapshot.room?.lastExecutionRunId;
// Provider-specific function removed

function getPreferredRoomState(snapshot: ChatroomRoomSnapshot): ChatroomState | null {
***REMOVED***snapshot.live && shouldPreferLiveSnapshot(snapshot)) {
    return snapshot.live.state;
  // Provider-specific function removed

  return snapshot.state;
// Provider-specific function removed

function getPreferredTrace(snapshot: ChatroomRoomSnapshot): WorkflowTraceRecord[] {
***REMOVED***snapshot.live && shouldPreferLiveSnapshot(snapshot)) {
    return snapshot.live.trace;
  // Provider-specific function removed

  return loadLatestRunTrace(snapshot.runs[0]);
// Provider-specific function removed

function loadRoomBrowserEntries(limit: number): RoomBrowserEntry[] {
  return listChatroomRooms(limit).map((room) => {
    const queuePauseState = loadChatroomQueuePauseState(room.roomId);
    const latestRun = listChatroomExecutionRuns(room.roomId, 1)[0] ?? null;
    return {
      room,
      live: loadChatroomLiveSnapshot(room.roomId),
      latestRun,
      latestRunRecoveryStats: aggregateStructuredOutputRecoveryStats(
        loadLatestRunTrace(latestRun ?? undefined),
      ),
      queuePaused: Boolean(queuePauseState),
      queuePauseReason: queuePauseState?.reason,
      queuePauseAt: queuePauseState?.pausedAt,
    // Provider-specific function removed;
  // Provider-specific function removed);
// Provider-specific function removed

function compareTimestamps(left?: string, right?: string): number {
  const leftTime = left ? new Date(left).getTime() : 0;
  const rightTime = right ? new Date(right).getTime() : 0;
  return leftTime - rightTime;
// Provider-specific function removed

function truncateText(value: string, limit: number): string {
  const normalized = value.replace(/\s+/g, ' ').trim();
***REMOVED***normalized.length <= limit) {
    return normalized;
  // Provider-specific function removed

  return `${normalized.slice(0, Math.max(0, limit - 3))// Provider-specific function removed...`;
// Provider-specific function removed

function loadBrowserState(): BrowserStateRecord {
  const defaults: BrowserStateRecord = {
    readUpdatedAtByRoomId: {// Provider-specific function removed,
    archivedRoomIds: [],
    hiddenRoomIds: [],
    hideTestRooms: false,
    filterMode: 'active',
    roomTypeFilter: 'all',
    sortMode: 'updated',
  // Provider-specific function removed;

  try {
    const raw = readFileSync(resolveBrowserStatePath(), 'utf8').replace(/^\uFEFF/, '');
    const parsed = JSON.parse(raw) as {
      readUpdatedAtByRoomId?: Record<string, unknown>;
      archivedRoomIds?: unknown;
        hiddenRoomIds?: unknown;
        hideTestRooms?: unknown;
        filterMode?: unknown;
        roomTypeFilter?: unknown;
        sortMode?: unknown;
      // Provider-specific function removed;
    const source = parsed.readUpdatedAtByRoomId ?? {// Provider-specific function removed;
    const readUpdatedAtByRoomId: Record<string, string> = {// Provider-specific function removed;

    for (const [roomId, updatedAt] of Object.entries(source)) {
    ***REMOVED***typeof updatedAt === 'string' && updatedAt.trim().length > 0) {
        readUpdatedAtByRoomId[roomId] = updatedAt;
      // Provider-specific function removed
    // Provider-specific function removed

    const archivedRoomIds = normalizeBrowserStateRoomIds(parsed.archivedRoomIds);
    const hiddenRoomIds = normalizeBrowserStateRoomIds(parsed.hiddenRoomIds);

    return {
      readUpdatedAtByRoomId,
      archivedRoomIds,
      hiddenRoomIds,
      hideTestRooms: typeof parsed.hideTestRooms === 'boolean' ? parsed.hideTestRooms : false,
      filterMode: isBrowserFilterMode(parsed.filterMode) ? parsed.filterMode : defaults.filterMode,
      roomTypeFilter: isBrowserRoomTypeFilter(parsed.roomTypeFilter)
        ? parsed.roomTypeFilter
        : defaults.roomTypeFilter,
      sortMode: isBrowserSortMode(parsed.sortMode) ? parsed.sortMode : defaults.sortMode,
    // Provider-specific function removed;
  // Provider-specific function removed catch {
    return defaults;
  // Provider-specific function removed
// Provider-specific function removed

function saveBrowserState(state: BrowserStateRecord): void {
  try {
    mkdirSync(resolve(process.cwd(), 'data'), {
      recursive: true,
    // Provider-specific function removed);
    writeFileSync(
      resolveBrowserStatePath(),
      JSON.stringify(
        {
          readUpdatedAtByRoomId: state.readUpdatedAtByRoomId,
          archivedRoomIds: [...new Set(state.archivedRoomIds)],
          hiddenRoomIds: [...new Set(state.hiddenRoomIds)],
          hideTestRooms: state.hideTestRooms,
          filterMode: state.filterMode,
          roomTypeFilter: state.roomTypeFilter,
          sortMode: state.sortMode,
        // Provider-specific function removed,
        null,
        2,
      ),
      'utf8',
    );
  // Provider-specific function removed catch {
    // Ignore persistence failures so the TUI stays usable even on readonly setups.
  // Provider-specific function removed
// Provider-specific function removed

function normalizeBrowserStateRoomIds(value: unknown): string[] {
***REMOVED***!Array.isArray(value)) {
  ***REMOVED***];
  // Provider-specific function removed

  const roomIds = value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

***REMOVED***...new Set(roomIds)];
// Provider-specific function removed

function isBrowserFilterMode(value: unknown): value is BrowserFilterMode {
  return (
    value === 'active' ||
    value === 'all' ||
    value === 'archived' ||
    value === 'hidden' ||
    value === 'live'
  );
// Provider-specific function removed

function isBrowserRoomTypeFilter(value: unknown): value is BrowserRoomTypeFilter {
  return value === 'all' || listChatroomRoomTypes().some((roomType) => roomType.id === value);
// Provider-specific function removed

function isBrowserSortMode(value: unknown): value is BrowserSortMode {
  return (
    value === 'updated' ||
    value === 'created' ||
    value === 'messages' ||
    value === 'runs' ||
    value === 'topic'
  );
// Provider-specific function removed

function resolveBrowserStatePath(): string {
  return resolve(process.cwd(), 'data', 'chatroom-browser-state.json');
// Provider-specific function removed

function listBrowserRoomTypeFilters(): BrowserRoomTypeFilter[] {
***REMOVED***'all', ...listChatroomRoomTypes().map((roomType) => roomType.id)];
// Provider-specific function removed

function resolveBrowserRoomTypeBadge(
  roomType: ChatroomRoomTypeId | string | undefined,
): string {
  switch (resolveChatroomRoomType(roomType).id) {
    case 'brainstorm_workshop':
      return '[IDE]';
    case 'roleplay_scene':
      return '[RP]';
    case 'expert_discussion':
    default:
      return '[EXP]';
  // Provider-specific function removed
// Provider-specific function removed

function buildBrowserRoomTypeDescriptor(
  roomType: ChatroomRoomTypeId | string | undefined,
  variant: 'short' | 'full' = 'short',
): string {
  const label =
    variant === 'full'
      ? getChatroomRoomTypeLabel(roomType)
      : getChatroomRoomTypeShortLabel(roomType);
  return `${resolveBrowserRoomTypeBadge(roomType)// Provider-specific function removed ${label// Provider-specific function removed`;
// Provider-specific function removed
