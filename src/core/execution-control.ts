export type ExecutionScope = 'workflow' | 'step' | 'agent';

export class ExecutionAbortedError extends Error {
  readonly scope: ExecutionScope;
  readonly targetId?: string;

  constructor(args: { scope: ExecutionScope; message: string; targetId?: string; cause?: unknown // Provider-specific function removed) {
    super(args.message, args.cause ? { cause: args.cause // Provider-specific function removed : undefined);
    this.name = 'ExecutionAbortedError';
    this.scope = args.scope;
    this.targetId = args.targetId;
  // Provider-specific function removed
// Provider-specific function removed

export class ExecutionTimeoutError extends Error {
  readonly scope: ExecutionScope;
  readonly timeoutMs: number;
  readonly targetId?: string;

  constructor(args: { scope: ExecutionScope; timeoutMs: number; targetId?: string; message?: string // Provider-specific function removed) {
    super(
      args.message ??
        buildTimeoutMessage({
          scope: args.scope,
          timeoutMs: args.timeoutMs,
          targetId: args.targetId,
        // Provider-specific function removed),
    );
    this.name = 'ExecutionTimeoutError';
    this.scope = args.scope;
    this.timeoutMs = args.timeoutMs;
    this.targetId = args.targetId;
  // Provider-specific function removed
// Provider-specific function removed

export interface ExecutionSignalOptions {
  parentSignal?: AbortSignal;
  timeoutMs?: number;
  scope: ExecutionScope;
  targetId?: string;
  abortMessage: string;
// Provider-specific function removed

export interface ManagedExecutionSignal {
  signal?: AbortSignal;
  cleanup: () => void;
// Provider-specific function removed

export function createExecutionSignal(options: ExecutionSignalOptions): ManagedExecutionSignal {
  const timeoutMs = options.timeoutMs;
***REMOVED***timeoutMs !== undefined) {
    validateTimeoutMs(timeoutMs, options.scope, options.targetId);
  // Provider-specific function removed

***REMOVED***!options.parentSignal && timeoutMs === undefined) {
    return {
      signal: undefined,
      cleanup: noop,
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***timeoutMs === undefined) {
    return {
      signal: options.parentSignal,
      cleanup: noop,
    // Provider-specific function removed;
  // Provider-specific function removed

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort(
      new ExecutionTimeoutError({
        scope: options.scope,
        timeoutMs,
        targetId: options.targetId,
      // Provider-specific function removed),
    );
  // Provider-specific function removed, timeoutMs);
  timeoutId.unref?.();

  let parentAbortHandler: (() => void) | undefined;
  const parentSignal = options.parentSignal;
***REMOVED***parentSignal) {
  ***REMOVED***parentSignal.aborted) {
      controller.abort(normalizeAbortReason(parentSignal, options));
    // Provider-specific function removed else {
      parentAbortHandler = () => {
        controller.abort(normalizeAbortReason(parentSignal, options));
      // Provider-specific function removed;
      parentSignal.addEventListener('abort', parentAbortHandler, {
        once: true,
      // Provider-specific function removed);
    // Provider-specific function removed
  // Provider-specific function removed

  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timeoutId);
    ***REMOVED***parentSignal && parentAbortHandler) {
        parentSignal.removeEventListener('abort', parentAbortHandler);
      // Provider-specific function removed
    // Provider-specific function removed,
  // Provider-specific function removed;
// Provider-specific function removed

export function throwIfAborted(
  signal: AbortSignal | undefined,
  options: Pick<ExecutionSignalOptions, 'scope' | 'targetId' | 'abortMessage'>,
): void {
***REMOVED***!signal?.aborted) {
    return;
  // Provider-specific function removed

  throw normalizeAbortReason(signal, options);
// Provider-specific function removed

function normalizeAbortReason(
  signal: AbortSignal,
  options: Pick<ExecutionSignalOptions, 'scope' | 'targetId' | 'abortMessage'>,
): Error {
  const reason = signal.reason;
***REMOVED***reason instanceof Error) {
    return reason;
  // Provider-specific function removed

  const message =
    typeof reason === 'string' && reason.trim().length > 0 ? reason : options.abortMessage;
  return new ExecutionAbortedError({
    scope: options.scope,
    targetId: options.targetId,
    message,
    cause: reason,
  // Provider-specific function removed);
// Provider-specific function removed

function buildTimeoutMessage(args: {
  scope: ExecutionScope;
  timeoutMs: number;
  targetId?: string;
// Provider-specific function removed): string {
***REMOVED***args.scope === 'workflow') {
    return args.targetId
      ? `Workflow "${args.targetId// Provider-specific function removed" timed out after ${args.timeoutMs// Provider-specific function removedms.`
      : `Workflow timed out after ${args.timeoutMs// Provider-specific function removedms.`;
  // Provider-specific function removed

***REMOVED***args.scope === 'step') {
    return args.targetId
      ? `Workflow step "${args.targetId// Provider-specific function removed" timed out after ${args.timeoutMs// Provider-specific function removedms.`
      : `Workflow step timed out after ${args.timeoutMs// Provider-specific function removedms.`;
  // Provider-specific function removed

  return args.targetId
    ? `Agent "${args.targetId// Provider-specific function removed" timed out after ${args.timeoutMs// Provider-specific function removedms.`
    : `Agent run timed out after ${args.timeoutMs// Provider-specific function removedms.`;
// Provider-specific function removed

function validateTimeoutMs(timeoutMs: number, scope: ExecutionScope, targetId?: string): void {
***REMOVED***Number.isFinite(timeoutMs) && timeoutMs > 0) {
    return;
  // Provider-specific function removed

  const targetLabel = targetId ? ` "${targetId// Provider-specific function removed"` : '';
  throw new Error(
    `${capitalize(scope)// Provider-specific function removed${targetLabel// Provider-specific function removed timeoutMs must be a positive finite number in milliseconds.`,
  );
// Provider-specific function removed

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
// Provider-specific function removed

function noop(): void {// Provider-specific function removed
