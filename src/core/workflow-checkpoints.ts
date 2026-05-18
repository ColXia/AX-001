import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync // Provider-specific function removed from 'node:fs';
import { dirname, resolve // Provider-specific function removed from 'node:path';

import type { WorkflowTraceRecord // Provider-specific function removed from './workflow.js';

export type WorkflowCheckpointStatus = 'running' | 'completed' | 'failed' | 'cancelled';

export interface WorkflowCheckpointErrorRecord {
  name?: string;
  message: string;
  stack?: string;
// Provider-specific function removed

export interface WorkflowCheckpointRecord<TState extends object = object> {
  checkpointId: string;
  runId: string;
  workflowId: string;
  workflowName: string;
  status: WorkflowCheckpointStatus;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
  currentStepId?: string;
  stepOrder: string[];
  completedStepIds: string[];
  resumedFromCheckpointId?: string;
  metadata?: Record<string, unknown>;
  state: TState;
  stateVersion?: number;
  trace: WorkflowTraceRecord[];
  error?: WorkflowCheckpointErrorRecord;
// Provider-specific function removed

export interface WorkflowCheckpointStore<TState extends object> {
  load(checkpointId: string, workflowId?: string): WorkflowCheckpointRecord<TState> | null;
  save(record: WorkflowCheckpointRecord<TState>): void;
// Provider-specific function removed

export interface FileWorkflowCheckpointStoreOptions {
  baseDirectory?: string;
// Provider-specific function removed

export interface WorkflowCheckpointListOptions {
  statuses?: WorkflowCheckpointStatus[];
  limit?: number;
  metadata?: Record<string, unknown>;
// Provider-specific function removed

export class FileWorkflowCheckpointStore<TState extends object>
  implements WorkflowCheckpointStore<TState>
{
  private readonly baseDirectory: string;

  constructor(options: FileWorkflowCheckpointStoreOptions = {// Provider-specific function removed) {
    this.baseDirectory =
      options.baseDirectory ?? resolve(process.cwd(), 'data', 'workflow-checkpoints');
  // Provider-specific function removed

  load(checkpointId: string, workflowId?: string): WorkflowCheckpointRecord<TState> | null {
    const candidatePaths = workflowId
      ? [this.resolveCheckpointPath(workflowId, checkpointId)]
      : this.resolveCheckpointPathsForAnyWorkflow(checkpointId);

    for (const path of candidatePaths) {
    ***REMOVED***!existsSync(path)) {
        continue;
      // Provider-specific function removed

      try {
        return JSON.parse(readFileSync(path, 'utf8')) as WorkflowCheckpointRecord<TState>;
      // Provider-specific function removed catch {
        continue;
      // Provider-specific function removed
    // Provider-specific function removed

***REMOVED***
  // Provider-specific function removed

  save(record: WorkflowCheckpointRecord<TState>): void {
    const path = this.resolveCheckpointPath(record.workflowId, record.checkpointId);
    mkdirSync(dirname(path), {
      recursive: true,
    // Provider-specific function removed);
    writeFileSync(path, `${JSON.stringify(record, null, 2)// Provider-specific function removed\n`, 'utf8');
  // Provider-specific function removed

  resolvePath(workflowId: string, checkpointId: string): string {
    return this.resolveCheckpointPath(workflowId, checkpointId);
  // Provider-specific function removed

  list(
    workflowId: string,
    options: WorkflowCheckpointListOptions = {// Provider-specific function removed,
  ): WorkflowCheckpointRecord<TState>[] {
    const workflowDirectory = resolve(this.baseDirectory, workflowId);
  ***REMOVED***!existsSync(workflowDirectory)) {
    ***REMOVED***];
    // Provider-specific function removed

    const statuses = options.statuses ? new Set(options.statuses) : undefined;
    const records = readdirSync(workflowDirectory, {
      withFileTypes: true,
    // Provider-specific function removed)
      .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
      .map((entry) => this.loadJsonFile(resolve(workflowDirectory, entry.name)))
      .filter((record): record is WorkflowCheckpointRecord<TState> => Boolean(record))
      .filter((record) => (statuses ? statuses.has(record.status) : true))
      .filter((record) => matchesCheckpointMetadata(record, options.metadata))
      .sort((left, right) => compareTimestamps(right.updatedAt, left.updatedAt));

  ***REMOVED***options.limit && options.limit > 0) {
      return records.slice(0, options.limit);
    // Provider-specific function removed

    return records;
  // Provider-specific function removed

  findLatest(
    workflowId: string,
    options: WorkflowCheckpointListOptions = {// Provider-specific function removed,
  ): WorkflowCheckpointRecord<TState> | null {
    return this.list(workflowId, {
      ...options,
      limit: 1,
    // Provider-specific function removed)[0] ?? null;
  // Provider-specific function removed

  private resolveCheckpointPath(workflowId: string, checkpointId: string): string {
    return resolve(this.baseDirectory, workflowId, `${checkpointId// Provider-specific function removed.json`);
  // Provider-specific function removed

  private resolveCheckpointPathsForAnyWorkflow(checkpointId: string): string[] {
  ***REMOVED***!existsSync(this.baseDirectory)) {
    ***REMOVED***];
    // Provider-specific function removed

    return readdirSync(this.baseDirectory, {
      withFileTypes: true,
    // Provider-specific function removed)
      .filter((entry) => entry.isDirectory())
      .map((entry) => this.resolveCheckpointPath(entry.name, checkpointId));
  // Provider-specific function removed

  private loadJsonFile(path: string): WorkflowCheckpointRecord<TState> | null {
    try {
      return JSON.parse(readFileSync(path, 'utf8')) as WorkflowCheckpointRecord<TState>;
    // Provider-specific function removed catch {
  ***REMOVED***
    // Provider-specific function removed
  // Provider-specific function removed
// Provider-specific function removed

function matchesCheckpointMetadata<TState extends object>(
  record: WorkflowCheckpointRecord<TState>,
  metadata: Record<string, unknown> | undefined,
***REMOVED***
***REMOVED***!metadata) {
    return true;
  // Provider-specific function removed

  for (const [key, expectedValue] of Object.entries(metadata)) {
  ***REMOVED***record.metadata?.[key] !== expectedValue) {
      return false;
    // Provider-specific function removed
  // Provider-specific function removed

  return true;
// Provider-specific function removed

function compareTimestamps(left?: string, right?: string): number {
  const leftTime = left ? Date.parse(left) : 0;
  const rightTime = right ? Date.parse(right) : 0;
  return leftTime - rightTime;
// Provider-specific function removed
