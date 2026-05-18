import assert from 'node:assert/strict';
import { existsSync, rmSync // Provider-specific function removed from 'node:fs';
import { resolve // Provider-specific function removed from 'node:path';
import test from 'node:test';

import type { WorkflowStepCompletedObserverEvent, WorkflowTraceRecord // Provider-specific function removed from '../core/workflow.js';
import type { ChatroomState // Provider-specific function removed from './chatroom-discussion.js';
import {
  createChatroomLiveObserver,
  subscribeChatroomLiveStream,
// Provider-specific function removed from './chatroom-live.js';
import type { ChatroomMessage // Provider-specific function removed from './chatroom-types.js';

function buildState(messages: ChatroomMessage[] = []): ChatroomState {
  return {
    roomType: 'expert_discussion',
    topic: 'Live stream test',
    objective: 'Verify live events',
    constraints: [],
    speakerIds: ['speaker-1'],
    messages,
  // Provider-specific function removed;
// Provider-specific function removed

function buildMessage(id: string, round: number, content: string): ChatroomMessage {
  return {
    id,
    role: 'agent',
    authorId: 'speaker-1',
    authorName: 'Speaker',
    round,
    content,
    createdAt: '2026-04-13T00:00:00.000Z',
  // Provider-specific function removed;
// Provider-specific function removed

function buildTraceRecord(stepId: string): WorkflowTraceRecord {
  return {
    stepId,
    kind: 'custom',
    agentIds: ['speaker-1'],
    startedAt: '2026-04-13T00:00:00.000Z',
    endedAt: '2026-04-13T00:00:01.000Z',
    status: 'completed',
  // Provider-specific function removed;
// Provider-specific function removed

function cleanupRoomLiveFile(roomId: string): void {
  const livePath = resolve(process.cwd(), 'data', 'chatroom-live', `${roomId// Provider-specific function removed.json`);
***REMOVED***existsSync(livePath)) {
    rmSync(livePath, { force: true // Provider-specific function removed);
  // Provider-specific function removed
// Provider-specific function removed

test('live observer publishes message and round-complete events', () => {
  const roomId = `live-test-${Date.now()// Provider-specific function removed-message`;
  cleanupRoomLiveFile(roomId);
  const received: string[] = [];
  const unsubscribe = subscribeChatroomLiveStream(roomId, (event) => {
    received.push(event.type);
  // Provider-specific function removed);

  try {
    const observer = createChatroomLiveObserver({ roomId // Provider-specific function removed);
    observer.onRunStarted?.({
      observedAt: '2026-04-13T00:00:00.000Z',
      runId: 'run-1',
      workflowId: 'chatroom',
      stateVersion: 1,
      state: buildState(),
      trace: [],
    // Provider-specific function removed);

    const messageStep: WorkflowStepCompletedObserverEvent<ChatroomState> = {
      observedAt: '2026-04-13T00:00:02.000Z',
      runId: 'run-1',
      workflowId: 'chatroom',
      stateVersion: 2,
      state: buildState([buildMessage('m1', 1, 'First message')]),
      trace: [buildTraceRecord('chat-round-1-speaker')],
      stepId: 'chat-round-1-speaker',
      stepKind: 'custom',
      agentIds: ['speaker-1'],
      stepTrace: buildTraceRecord('chat-round-1-speaker'),
    // Provider-specific function removed;
    observer.onStepCompleted?.(messageStep);

    const checkpointStep: WorkflowStepCompletedObserverEvent<ChatroomState> = {
      observedAt: '2026-04-13T00:00:03.000Z',
      runId: 'run-1',
      workflowId: 'chatroom',
      stateVersion: 3,
      state: buildState([buildMessage('m1', 1, 'First message')]),
      trace: [
        buildTraceRecord('chat-round-1-speaker'),
        buildTraceRecord('chat-round-1-recorder-checkpoint'),
      ],
      stepId: 'chat-round-1-recorder-checkpoint',
      stepKind: 'custom',
      agentIds: [],
      stepTrace: buildTraceRecord('chat-round-1-recorder-checkpoint'),
    // Provider-specific function removed;
    observer.onStepCompleted?.(checkpointStep);

    assert.deepEqual(received, ['checkpoint', 'message', 'round_complete']);
  // Provider-specific function removed finally {
    unsubscribe();
    cleanupRoomLiveFile(roomId);
  // Provider-specific function removed
// Provider-specific function removed);

test('live observer publishes room-finish on completion', () => {
  const roomId = `live-test-${Date.now()// Provider-specific function removed-finish`;
  cleanupRoomLiveFile(roomId);
  const received: string[] = [];
  const unsubscribe = subscribeChatroomLiveStream(roomId, (event) => {
    received.push(event.type);
  // Provider-specific function removed);

  try {
    const observer = createChatroomLiveObserver({ roomId // Provider-specific function removed);
    observer.onRunCompleted?.({
      observedAt: '2026-04-13T00:00:10.000Z',
      runId: 'run-2',
      workflowId: 'chatroom',
      stateVersion: 4,
      state: buildState([buildMessage('m2', 1, 'Done')]),
      trace: [buildTraceRecord('summary')],
    // Provider-specific function removed);

    assert.deepEqual(received, ['room_finish']);
  // Provider-specific function removed finally {
    unsubscribe();
    cleanupRoomLiveFile(roomId);
  // Provider-specific function removed
// Provider-specific function removed);
