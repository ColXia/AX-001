import type { AgentProfile // Provider-specific function removed from '../core/agent-profile.js';
import type {
  WorkflowExecuteOptions,
  WorkflowObserver,
  WorkflowObserverEvent,
  WorkflowRunFailedObserverEvent,
// Provider-specific function removed from '../core/workflow.js';
import type { ChatroomAgentContext // Provider-specific function removed from './agent-context.js';

export interface CapturedWorkflowRunState<TState extends object> {
  startedEvent?: WorkflowObserverEvent<TState>;
  failedEvent?: WorkflowRunFailedObserverEvent<TState>;
// Provider-specific function removed

export function chunkSpeakers(
  speakers: readonly AgentProfile<ChatroomAgentContext, 'text'>[],
  batchSize: number,
): Array<AgentProfile<ChatroomAgentContext, 'text'>[]> {
  const batches: Array<AgentProfile<ChatroomAgentContext, 'text'>[]> = [];
  for (let index = 0; index < speakers.length; index += batchSize) {
    batches.push(speakers.slice(index, index + batchSize));
  // Provider-specific function removed

  return batches;
// Provider-specific function removed

export function resolveChatroomParallelBatchSize(
  batchSize: number | undefined,
  speakerCount: number,
): number {
***REMOVED***!batchSize || batchSize < 1) {
    return Math.min(4, Math.max(1, speakerCount));
  // Provider-specific function removed

  return Math.min(Math.max(1, batchSize), Math.max(1, speakerCount));
// Provider-specific function removed

export function mergeWorkflowOptions<TState extends object>(
  base: WorkflowExecuteOptions<TState> | undefined,
  overrides: WorkflowExecuteOptions<TState>,
): WorkflowExecuteOptions<TState> {
  return {
    ...base,
    ...overrides,
    checkpointMetadata: mergeCheckpointMetadata(
      base?.checkpointMetadata,
      overrides.checkpointMetadata,
    ),
  // Provider-specific function removed;
// Provider-specific function removed

export function combineWorkflowObservers<TState extends object>(
  ...observers: Array<WorkflowObserver<TState> | undefined>
): WorkflowObserver<TState> | undefined {
  const activeObservers = observers.filter(
    (observer): observer is WorkflowObserver<TState> => Boolean(observer),
  );
***REMOVED***activeObservers.length === 0) {
    return undefined;
  // Provider-specific function removed

  return {
    onRunStarted: (event) => {
      for (const observer of activeObservers) {
        observer.onRunStarted?.(event);
      // Provider-specific function removed
    // Provider-specific function removed,
    onStepStarted: (event) => {
      for (const observer of activeObservers) {
        observer.onStepStarted?.(event);
      // Provider-specific function removed
    // Provider-specific function removed,
    onStepCompleted: (event) => {
      for (const observer of activeObservers) {
        observer.onStepCompleted?.(event);
      // Provider-specific function removed
    // Provider-specific function removed,
    onRunCompleted: (event) => {
      for (const observer of activeObservers) {
        observer.onRunCompleted?.(event);
      // Provider-specific function removed
    // Provider-specific function removed,
    onRunFailed: (event) => {
      for (const observer of activeObservers) {
        observer.onRunFailed?.(event);
      // Provider-specific function removed
    // Provider-specific function removed,
  // Provider-specific function removed;
// Provider-specific function removed

export function createCapturedWorkflowRunState<TState extends object>(): CapturedWorkflowRunState<TState> {
  return {// Provider-specific function removed;
// Provider-specific function removed

export function createCapturedWorkflowObserver<TState extends object>(
  capturedRun: CapturedWorkflowRunState<TState>,
): WorkflowObserver<TState> {
  return {
    onRunStarted: (event) => {
      capturedRun.startedEvent = event;
    // Provider-specific function removed,
    onRunFailed: (event) => {
      capturedRun.failedEvent = event;
    // Provider-specific function removed,
  // Provider-specific function removed;
// Provider-specific function removed

function mergeCheckpointMetadata(
  ...records: Array<Record<string, unknown> | undefined>
): Record<string, unknown> | undefined {
  const merged = Object.assign({// Provider-specific function removed, ...records.filter(Boolean));
  return Object.keys(merged).length > 0 ? merged : undefined;
// Provider-specific function removed
