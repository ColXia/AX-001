import { existsSync, mkdirSync, readFileSync, writeFileSync // Provider-specific function removed from 'node:fs';
import { resolve // Provider-specific function removed from 'node:path';

import type {
  WorkflowObserver,
  WorkflowObserverEvent,
  WorkflowRunFailedObserverEvent,
  WorkflowStepCompletedObserverEvent,
  WorkflowStepObserverEvent,
  WorkflowTraceRecord,
// Provider-specific function removed from '../core/workflow.js';
import { ExecutionAbortedError // Provider-specific function removed from '../core/execution-control.js';
import type { ChatroomState // Provider-specific function removed from './room-state.js';

export type ChatroomLiveStatus = 'starting' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface ChatroomLiveSnapshot {
  roomId: string;
  executionRunId: string;
  workflowId: string;
  status: ChatroomLiveStatus;
  resumedFromRunId?: string;
  currentStepId?: string;
  currentAgentIds?: string[];
  note?: string;
  error?: string;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
  state: ChatroomState;
  trace: WorkflowTraceRecord[];
// Provider-specific function removed

export type ChatroomLiveStreamEventType =
  | 'snapshot'
  | 'message'
  | 'round_complete'
  | 'room_finish'
  | 'checkpoint';

export interface ChatroomLiveStreamEvent {
  roomId: string;
  type: ChatroomLiveStreamEventType;
  snapshot: ChatroomLiveSnapshot;
// Provider-specific function removed

const liveStreamSubscribers = new Map<
  string,
  Set<(event: ChatroomLiveStreamEvent) => void>
>();

export function createChatroomLiveObserver(args: {
  roomId: string;
  resumedFromRunId?: string;
  note?: string;
// Provider-specific function removed): WorkflowObserver<ChatroomState> {
  let startedAt = new Date().toISOString();
  let lastSnapshot: ChatroomLiveSnapshot | null = loadChatroomLiveSnapshot(args.roomId);

  const writeAndPublish = (
    snapshot: ChatroomLiveSnapshot,
    eventType: ChatroomLiveStreamEventType,
  ) => {
    writeChatroomLiveSnapshot(snapshot);
    publishChatroomLiveStreamEvent({
      roomId: args.roomId,
      type: eventType,
      snapshot,
    // Provider-specific function removed);
    lastSnapshot = snapshot;
  // Provider-specific function removed;

  return {
    onRunStarted: (event) => {
      startedAt = event.observedAt;
      writeAndPublish({
        roomId: args.roomId,
        executionRunId: event.runId,
        workflowId: event.workflowId,
        status: 'starting',
        resumedFromRunId: args.resumedFromRunId,
        note: args.note,
        startedAt,
        updatedAt: event.observedAt,
        state: event.state,
        trace: event.trace,
      // Provider-specific function removed, 'checkpoint');
    // Provider-specific function removed,
    onStepStarted: (event) => {
      writeAndPublish(
        createSnapshotFromStepEvent(event, {
          roomId: args.roomId,
          resumedFromRunId: args.resumedFromRunId,
          note: args.note,
          status: 'running',
          startedAt,
        // Provider-specific function removed),
        'checkpoint',
      );
    // Provider-specific function removed,
    onStepCompleted: (event) => {
      const snapshot = createSnapshotFromStepCompletedEvent(event, {
          roomId: args.roomId,
          resumedFromRunId: args.resumedFromRunId,
          note: args.note,
          status: 'running',
          startedAt,
        // Provider-specific function removed);
      writeAndPublish(
        snapshot,
        resolveLiveStepCompletedEventType({
          previousSnapshot: lastSnapshot,
          snapshot,
          event,
        // Provider-specific function removed),
      );
    // Provider-specific function removed,
    onRunCompleted: (event) => {
      writeAndPublish({
        roomId: args.roomId,
        executionRunId: event.runId,
        workflowId: event.workflowId,
        status: 'completed',
        resumedFromRunId: args.resumedFromRunId,
        note: args.note,
        startedAt,
        updatedAt: event.observedAt,
        completedAt: event.observedAt,
        state: event.state,
        trace: event.trace,
      // Provider-specific function removed, 'room_finish');
    // Provider-specific function removed,
    onRunFailed: (event) => {
      const failure = classifyFailure(event.error);
      writeAndPublish({
        roomId: args.roomId,
        executionRunId: event.runId,
        workflowId: event.workflowId,
        status: failure.status,
        resumedFromRunId: args.resumedFromRunId,
        currentStepId: event.currentStepId,
        note: failure.note ?? args.note,
        error: failure.error,
        startedAt,
        updatedAt: event.observedAt,
        completedAt: event.observedAt,
        state: event.state,
        trace: event.trace,
      // Provider-specific function removed, 'room_finish');
    // Provider-specific function removed,
  // Provider-specific function removed;
// Provider-specific function removed

export function subscribeChatroomLiveStream(
  roomId: string,
  listener: (event: ChatroomLiveStreamEvent) => void,
): () => void {
  const listeners = liveStreamSubscribers.get(roomId) ?? new Set();
  listeners.add(listener);
  liveStreamSubscribers.set(roomId, listeners);

  return () => {
    const current = liveStreamSubscribers.get(roomId);
  ***REMOVED***!current) {
      return;
    // Provider-specific function removed
    current.delete(listener);
  ***REMOVED***current.size === 0) {
      liveStreamSubscribers.delete(roomId);
    // Provider-specific function removed
  // Provider-specific function removed;
// Provider-specific function removed

export function loadChatroomLiveSnapshot(roomId: string): ChatroomLiveSnapshot | null {
  const path = resolveLiveSnapshotPath(roomId);
***REMOVED***!existsSync(path)) {
***REMOVED***
  // Provider-specific function removed

  try {
    return JSON.parse(readFileSync(path, 'utf8')) as ChatroomLiveSnapshot;
  // Provider-specific function removed catch {
***REMOVED***
  // Provider-specific function removed
// Provider-specific function removed

export function writeChatroomLiveSnapshot(snapshot: ChatroomLiveSnapshot): void {
  const directory = resolve(process.cwd(), 'data', 'chatroom-live');
  mkdirSync(directory, { recursive: true // Provider-specific function removed);
  writeFileSync(
    resolveLiveSnapshotPath(snapshot.roomId),
    `${JSON.stringify(snapshot, null, 2)// Provider-specific function removed\n`,
    'utf8',
  );
// Provider-specific function removed

function publishChatroomLiveStreamEvent(event: ChatroomLiveStreamEvent): void {
  const listeners = liveStreamSubscribers.get(event.roomId);
***REMOVED***!listeners || listeners.size === 0) {
    return;
  // Provider-specific function removed

  for (const listener of listeners) {
    try {
      listener(event);
    // Provider-specific function removed catch {
      // Ignore subscriber failures so a bad stream consumer does not break live updates.
    // Provider-specific function removed
  // Provider-specific function removed
// Provider-specific function removed

function resolveLiveSnapshotPath(roomId: string): string {
  return resolve(process.cwd(), 'data', 'chatroom-live', `${roomId// Provider-specific function removed.json`);
// Provider-specific function removed

function createSnapshotFromStepEvent(
  event: WorkflowStepObserverEvent<ChatroomState>,
  args: {
    roomId: string;
    resumedFromRunId?: string;
    note?: string;
    status: ChatroomLiveStatus;
    startedAt: string;
  // Provider-specific function removed,
): ChatroomLiveSnapshot {
  return {
    roomId: args.roomId,
    executionRunId: event.runId,
    workflowId: event.workflowId,
    status: args.status,
    resumedFromRunId: args.resumedFromRunId,
    currentStepId: event.stepId,
    currentAgentIds: event.agentIds,
    note: args.note,
    startedAt: args.startedAt,
    updatedAt: event.observedAt,
    state: event.state,
    trace: event.trace,
  // Provider-specific function removed;
// Provider-specific function removed

function createSnapshotFromStepCompletedEvent(
  event: WorkflowStepCompletedObserverEvent<ChatroomState>,
  args: {
    roomId: string;
    resumedFromRunId?: string;
    note?: string;
    status: ChatroomLiveStatus;
    startedAt: string;
  // Provider-specific function removed,
): ChatroomLiveSnapshot {
  return {
    ...createSnapshotFromStepEvent(event, args),
    currentStepId: event.stepTrace.stepId,
    currentAgentIds: event.stepTrace.agentIds,
  // Provider-specific function removed;
// Provider-specific function removed

function resolveLiveStepCompletedEventType(args: {
  previousSnapshot: ChatroomLiveSnapshot | null;
  snapshot: ChatroomLiveSnapshot;
  event: WorkflowStepCompletedObserverEvent<ChatroomState>;
// Provider-specific function removed): ChatroomLiveStreamEventType {
***REMOVED***isRecorderCheckpointStep(args.event.stepTrace.stepId)) {
    return 'round_complete';
  // Provider-specific function removed

  const previousMessageCount = args.previousSnapshot?.state.messages.length ?? 0;
***REMOVED***args.snapshot.state.messages.length > previousMessageCount) {
    return 'message';
  // Provider-specific function removed

  return 'checkpoint';
// Provider-specific function removed

function isRecorderCheckpointStep(stepId: string***REMOVED***
  return stepId.endsWith('recorder-checkpoint');
// Provider-specific function removed

function formatError(event: WorkflowRunFailedObserverEvent<ChatroomState>): string {
  const error = event.error;
***REMOVED***error instanceof Error) {
    return error.stack ?? error.message;
  // Provider-specific function removed

  return String(error);
// Provider-specific function removed

function classifyFailure(error: unknown): {
  status: ChatroomLiveStatus;
  note?: string;
  error?: string;
// Provider-specific function removed {
***REMOVED***error instanceof ExecutionAbortedError) {
    return {
      status: 'cancelled',
      note: error.message,
    // Provider-specific function removed;
  // Provider-specific function removed

  return {
    status: 'failed',
    error: formatUnknownError(error),
  // Provider-specific function removed;
// Provider-specific function removed

function formatUnknownError(error: unknown): string {
***REMOVED***error instanceof Error) {
    return error.stack ?? error.message;
  // Provider-specific function removed

  return String(error);
// Provider-specific function removed
