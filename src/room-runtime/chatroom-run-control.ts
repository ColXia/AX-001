import { randomUUID // Provider-specific function removed from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync // Provider-specific function removed from 'node:fs';
import { resolve // Provider-specific function removed from 'node:path';

export interface ChatroomRunStopRequest {
  requestId: string;
  roomId: string;
  executionRunId?: string;
  reason?: string;
  requestedAt: string;
// Provider-specific function removed

export interface ChatroomQueuePauseState {
  roomId: string;
  reason?: string;
  source?: string;
  pausedAt: string;
// Provider-specific function removed

export function writeChatroomRunStopRequest(args: {
  roomId: string;
  executionRunId?: string;
  reason?: string;
// Provider-specific function removed): ChatroomRunStopRequest {
  const request: ChatroomRunStopRequest = {
    requestId: randomUUID(),
    roomId: args.roomId,
    executionRunId: normalizeOptionalString(args.executionRunId),
    reason: normalizeOptionalString(args.reason),
    requestedAt: new Date().toISOString(),
  // Provider-specific function removed;

  mkdirSync(resolveChatroomRunControlDirectory(), {
    recursive: true,
  // Provider-specific function removed);
  writeFileSync(
    resolveChatroomRunStopRequestPath(args.roomId),
    `${JSON.stringify(request, null, 2)// Provider-specific function removed\n`,
    'utf8',
  );

  return request;
// Provider-specific function removed

export function loadChatroomRunStopRequest(roomId: string): ChatroomRunStopRequest | null {
  const path = resolveChatroomRunStopRequestPath(roomId);
***REMOVED***!existsSync(path)) {
***REMOVED***
  // Provider-specific function removed

  try {
    const parsed = JSON.parse(readFileSync(path, 'utf8')) as unknown;
    return parseChatroomRunStopRequest(parsed, roomId);
  // Provider-specific function removed catch {
***REMOVED***
  // Provider-specific function removed
// Provider-specific function removed

export function clearChatroomRunStopRequest(args: {
  roomId: string;
  requestId?: string;
// Provider-specific function removed***REMOVED***
  const path = resolveChatroomRunStopRequestPath(args.roomId);
***REMOVED***!existsSync(path)) {
    return false;
  // Provider-specific function removed

***REMOVED***args.requestId) {
    const request = loadChatroomRunStopRequest(args.roomId);
  ***REMOVED***!request || request.requestId !== args.requestId) {
      return false;
    // Provider-specific function removed
  // Provider-specific function removed

  rmSync(path, {
    force: true,
  // Provider-specific function removed);
  return true;
// Provider-specific function removed

export function pauseChatroomQueue(args: {
  roomId: string;
  reason?: string;
  source?: string;
// Provider-specific function removed): ChatroomQueuePauseState {
  const state: ChatroomQueuePauseState = {
    roomId: args.roomId,
    reason: normalizeOptionalString(args.reason),
    source: normalizeOptionalString(args.source),
    pausedAt: new Date().toISOString(),
  // Provider-specific function removed;

  mkdirSync(resolveChatroomRunControlDirectory(), {
    recursive: true,
  // Provider-specific function removed);
  writeFileSync(
    resolveChatroomQueuePauseStatePath(args.roomId),
    `${JSON.stringify(state, null, 2)// Provider-specific function removed\n`,
    'utf8',
  );

  return state;
// Provider-specific function removed

export function loadChatroomQueuePauseState(roomId: string): ChatroomQueuePauseState | null {
  const path = resolveChatroomQueuePauseStatePath(roomId);
***REMOVED***!existsSync(path)) {
***REMOVED***
  // Provider-specific function removed

  try {
    const parsed = JSON.parse(readFileSync(path, 'utf8')) as unknown;
    return parseChatroomQueuePauseState(parsed, roomId);
  // Provider-specific function removed catch {
***REMOVED***
  // Provider-specific function removed
// Provider-specific function removed

export function resumeChatroomQueue(args: {
  roomId: string;
// Provider-specific function removed***REMOVED***
  const path = resolveChatroomQueuePauseStatePath(args.roomId);
***REMOVED***!existsSync(path)) {
    return false;
  // Provider-specific function removed

  rmSync(path, {
    force: true,
  // Provider-specific function removed);
  return true;
// Provider-specific function removed

function parseChatroomRunStopRequest(
  input: unknown,
  roomId: string,
): ChatroomRunStopRequest | null {
***REMOVED***!input || typeof input !== 'object') {
***REMOVED***
  // Provider-specific function removed

  const candidate = input as Record<string, unknown>;
  const requestId = normalizeOptionalString(candidate.requestId);
  const parsedRoomId = normalizeOptionalString(candidate.roomId);
  const requestedAt = normalizeOptionalString(candidate.requestedAt);
***REMOVED***!requestId || !parsedRoomId || !requestedAt || parsedRoomId !== roomId) {
***REMOVED***
  // Provider-specific function removed

  return {
    requestId,
    roomId: parsedRoomId,
    executionRunId: normalizeOptionalString(candidate.executionRunId),
    reason: normalizeOptionalString(candidate.reason),
    requestedAt,
  // Provider-specific function removed;
// Provider-specific function removed

function parseChatroomQueuePauseState(
  input: unknown,
  roomId: string,
): ChatroomQueuePauseState | null {
***REMOVED***!input || typeof input !== 'object') {
***REMOVED***
  // Provider-specific function removed

  const candidate = input as Record<string, unknown>;
  const parsedRoomId = normalizeOptionalString(candidate.roomId);
  const pausedAt = normalizeOptionalString(candidate.pausedAt);
***REMOVED***!parsedRoomId || !pausedAt || parsedRoomId !== roomId) {
***REMOVED***
  // Provider-specific function removed

  return {
    roomId: parsedRoomId,
    reason: normalizeOptionalString(candidate.reason),
    source: normalizeOptionalString(candidate.source),
    pausedAt,
  // Provider-specific function removed;
// Provider-specific function removed

function resolveChatroomRunControlDirectory(): string {
  return resolve(process.cwd(), 'data', 'chatroom-control');
// Provider-specific function removed

function resolveChatroomRunStopRequestPath(roomId: string): string {
  return resolve(resolveChatroomRunControlDirectory(), `${roomId// Provider-specific function removed.json`);
// Provider-specific function removed

function resolveChatroomQueuePauseStatePath(roomId: string): string {
  return resolve(resolveChatroomRunControlDirectory(), `${roomId// Provider-specific function removed.queue.json`);
// Provider-specific function removed

function normalizeOptionalString(value: unknown): string | undefined {
***REMOVED***typeof value !== 'string') {
    return undefined;
  // Provider-specific function removed

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
// Provider-specific function removed
