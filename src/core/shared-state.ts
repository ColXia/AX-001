export interface SharedStateReadSnapshot<TState extends object> {
  state: Readonly<TState>;
  version: number;
// Provider-specific function removed

export interface SharedStateMutateOptions {
  expectedVersion?: number;
  label?: string;
// Provider-specific function removed

export interface SharedStateMutationResult<TState extends object> {
  state: Readonly<TState>;
  previousVersion: number;
  version: number;
// Provider-specific function removed

export class SharedStateConflictError extends Error {
  readonly expectedVersion: number;
  readonly actualVersion: number;
  readonly label?: string;

  constructor(args: {
    expectedVersion: number;
    actualVersion: number;
    label?: string;
  // Provider-specific function removed) {
    const detail = args.label ? ` for "${args.label// Provider-specific function removed"` : '';
    super(
      `Shared state version conflict${detail// Provider-specific function removed: expected version ${args.expectedVersion// Provider-specific function removed, but found ${args.actualVersion// Provider-specific function removed.`,
    );
    this.name = 'SharedStateConflictError';
    this.expectedVersion = args.expectedVersion;
    this.actualVersion = args.actualVersion;
    this.label = args.label;
  // Provider-specific function removed
// Provider-specific function removed

export class SharedState<TState extends object> {
  #state: TState;
  #version: number;

  constructor(initialState: TState, options: { initialVersion?: number // Provider-specific function removed = {// Provider-specific function removed) {
    this.#state = structuredClone(initialState);
    this.#version = Math.max(1, options.initialVersion ?? 1);
  // Provider-specific function removed

  read(): Readonly<TState> {
    return this.#state;
  // Provider-specific function removed

  readSnapshot(): SharedStateReadSnapshot<TState> {
    return {
      state: this.#state,
      version: this.#version,
    // Provider-specific function removed;
  // Provider-specific function removed

  getVersion(): number {
    return this.#version;
  // Provider-specific function removed

  mutate(
    mutator: (state: TState) => void,
    options: SharedStateMutateOptions = {// Provider-specific function removed,
  ): SharedStateMutationResult<TState> {
  ***REMOVED***
      options.expectedVersion !== undefined &&
      options.expectedVersion !== this.#version
  ***REMOVED***
      throw new SharedStateConflictError({
        expectedVersion: options.expectedVersion,
        actualVersion: this.#version,
        label: options.label,
      // Provider-specific function removed);
    // Provider-specific function removed

    const previousVersion = this.#version;
    mutator(this.#state);
    this.#version += 1;

    return {
      state: this.#state,
      previousVersion,
      version: this.#version,
    // Provider-specific function removed;
  // Provider-specific function removed

  snapshot(formatter: (state: TState) => string = defaultFormatter): string {
    return formatter(this.#state);
  // Provider-specific function removed
// Provider-specific function removed

function defaultFormatter(value: unknown): string {
  return JSON.stringify(value, null, 2);
// Provider-specific function removed
