import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, rmSync // Provider-specific function removed from 'node:fs';
import { tmpdir // Provider-specific function removed from 'node:os';
import { join // Provider-specific function removed from 'node:path';
import { test // Provider-specific function removed from 'node:test';

import type { WorkflowResult // Provider-specific function removed from '../core/workflow.js';
import type { ChatroomState // Provider-specific function removed from './chatroom-discussion.js';
import { saveChatroomArtifacts // Provider-specific function removed from './chatroom-storage.js';
import {
  loadChatroomLiveSnapshot,
  writeChatroomLiveSnapshot,
// Provider-specific function removed from './chatroom-live.js';
import { createChatroomRoomBlueprint // Provider-specific function removed from '../room-scenarios/room-blueprints.js';
import {
  resetStoredChatroomDatabaseForTests as resetChatroomDatabaseForTests,
// Provider-specific function removed from '../room-storage/database-instance.js';
import {
  getLatestChatroomExecutionRun,
  persistChatroomExecutionRun,
// Provider-specific function removed from '../room-storage/execution-run-repository.js';
import { getChatroomMainSession // Provider-specific function removed from '../room-storage/main-session-repository.js';
import { listChatroomAgentTurns // Provider-specific function removed from '../room-storage/agent-thread-repository.js';
import {
  cloneChatroomRoom,
  createChatroomRoom,
  deleteChatroomRoom,
  getChatroomRoomRecord,
  loadChatroomRoomState,
// Provider-specific function removed from '../room-storage/room-repository.js';
import { listChatroomAgentThreads // Provider-specific function removed from '../room-storage/agent-thread-repository.js';
import { listChatroomParticipants // Provider-specific function removed from '../room-storage/participant-repository.js';
import {
  enqueueChatroomPendingMessage,
  listChatroomPendingMessages,
// Provider-specific function removed from '../room-storage/queue-repository.js';

test('room main session stays authoritative across execution run persistence', async (t) => {
  const originalCwd = process.cwd();
  const tempDir = mkdtempSync(join(tmpdir(), 'ax-001-main-session-'));

  t.after(() => {
    resetChatroomDatabaseForTests();
    process.chdir(originalCwd);
    rmSync(tempDir, { recursive: true, force: true // Provider-specific function removed);
  // Provider-specific function removed);

  process.chdir(tempDir);
  resetChatroomDatabaseForTests();

  const room = createChatroomRoom({
    roomType: 'expert_discussion',
    topic: 'Main session audit',
    objective: 'Verify session/run persistence semantics',
    speakerIds: ['moderator-chat', 'strategy-chat'],
  // Provider-specific function removed);

  const createdSession = getChatroomMainSession(room.roomId);
  assert.ok(createdSession);
  assert.equal(createdSession.mainSessionId, room.mainSessionId);
  assert.equal(createdSession.messageCount, 0);

  const baseState = loadChatroomRoomState(room.roomId);
  const nextState: ChatroomState = {
    ...baseState,
    messages: [
      ...baseState.messages,
      {
        id: 'msg-user-1',
        role: 'user',
        authorId: 'user',
        authorName: 'TestUser',
        round: 1,
        createdAt: '2026-04-12T10:00:00.000Z',
        content: '请继续围绕主 session 推进讨论。',
      // Provider-specific function removed,
    ],
  // Provider-specific function removed;
  const result: WorkflowResult<ChatroomState> = {
    runId: 'run-main-session-1',
    workflowId: 'chatroom-discussion',
    stateVersion: 1,
    state: nextState,
    trace: [],
  // Provider-specific function removed;

  const persistedRun = await persistChatroomExecutionRun({
    roomId: room.roomId,
    rounds: 1,
    baseMessageCount: baseState.messages.length,
    result,
    humanAuthorName: 'TestUser',
    humanMessage: '请继续围绕主 session 推进讨论。',
  // Provider-specific function removed);

  assert.equal(persistedRun.mainSessionId, room.mainSessionId);

  const updatedSession = getChatroomMainSession(room.roomId);
  assert.ok(updatedSession);
  assert.equal(updatedSession.mainSessionId, room.mainSessionId);
  assert.equal(updatedSession.lastExecutionRunId, result.runId);
  assert.equal(updatedSession.messageCount, 1);

  const latestRun = getLatestChatroomExecutionRun(room.roomId);
  assert.ok(latestRun);
  assert.equal(latestRun.mainSessionId, room.mainSessionId);

  const reloadedState = loadChatroomRoomState(room.roomId);
  assert.equal(reloadedState.messages.length, 1);
  assert.equal(reloadedState.messages[0]?.content, '请继续围绕主 session 推进讨论。');
// Provider-specific function removed);

test('artifact metadata keeps main session linkage alongside room and execution run ids', (t) => {
  const originalCwd = process.cwd();
  const tempDir = mkdtempSync(join(tmpdir(), 'ax-001-artifact-main-session-'));

  t.after(() => {
    process.chdir(originalCwd);
    rmSync(tempDir, { recursive: true, force: true // Provider-specific function removed);
  // Provider-specific function removed);

  process.chdir(tempDir);

  const result: WorkflowResult<ChatroomState> = {
    runId: 'run-artifact-main-session-1',
    workflowId: 'chatroom-discussion',
    stateVersion: 1,
    state: {
      roomType: 'expert_discussion',
      topic: 'Artifact metadata audit',
      objective: 'Ensure run artifacts carry main session linkage',
      constraints: [],
      speakerIds: ['moderator-chat'],
      messages: [],
    // Provider-specific function removed,
    trace: [],
  // Provider-specific function removed;

  const artifacts = saveChatroomArtifacts(result, {
    roomId: 'room-main-session-1',
    mainSessionId: 'main-session-1',
    executionRunId: result.runId,
  // Provider-specific function removed);

  const metadata = JSON.parse(readFileSync(artifacts.metadataPath, 'utf8')) as {
    roomId?: string | null;
    mainSessionId?: string | null;
    executionRunId?: string | null;
  // Provider-specific function removed;

  assert.equal(metadata.roomId, 'room-main-session-1');
  assert.equal(metadata.mainSessionId, 'main-session-1');
  assert.equal(metadata.executionRunId, result.runId);
// Provider-specific function removed);

test('cloned room gets a fresh main session and rebuilt participant topology', (t) => {
  const originalCwd = process.cwd();
  const tempDir = mkdtempSync(join(tmpdir(), 'ax-001-room-clone-'));

  t.after(() => {
    resetChatroomDatabaseForTests();
    process.chdir(originalCwd);
    rmSync(tempDir, { recursive: true, force: true // Provider-specific function removed);
  // Provider-specific function removed);

  process.chdir(tempDir);
  resetChatroomDatabaseForTests();

  const originalRoom = createChatroomRoom({
    roomType: 'expert_discussion',
    topic: 'Clone coverage',
    objective: 'Verify room clone bootstrap semantics',
    speakerIds: ['moderator-chat', 'strategy-chat'],
  // Provider-specific function removed);

  const cloneResult = cloneChatroomRoom(originalRoom.roomId);
  const clonedRoom = getChatroomRoomRecord(cloneResult.roomId);
  assert.ok(clonedRoom);
  assert.equal(cloneResult.clonedFromRoomId, originalRoom.roomId);
  assert.notEqual(clonedRoom.roomId, originalRoom.roomId);
  assert.notEqual(clonedRoom.mainSessionId, originalRoom.mainSessionId);
  assert.equal(clonedRoom.topic, originalRoom.topic);
  assert.equal(clonedRoom.objective, originalRoom.objective);
  assert.deepEqual(clonedRoom.speakerIds, originalRoom.speakerIds);

  const clonedSession = getChatroomMainSession(clonedRoom.roomId);
  assert.ok(clonedSession);
  assert.equal(clonedSession.mainSessionId, clonedRoom.mainSessionId);
  assert.equal(clonedSession.messageCount, 0);

  const clonedState = loadChatroomRoomState(clonedRoom.roomId);
  assert.equal(clonedState.messages.length, 0);

  const participants = listChatroomParticipants(clonedRoom.roomId);
  const threads = listChatroomAgentThreads(clonedRoom.roomId);
  assert.ok(participants.length >= 3);
  assert.ok(threads.length >= 2);
// Provider-specific function removed);

test('deleteChatroomRoom removes persisted rows and filesystem artifacts', async (t) => {
  const originalCwd = process.cwd();
  const tempDir = mkdtempSync(join(tmpdir(), 'ax-001-room-delete-'));

  t.after(() => {
    resetChatroomDatabaseForTests();
    process.chdir(originalCwd);
    rmSync(tempDir, { recursive: true, force: true // Provider-specific function removed);
  // Provider-specific function removed);

  process.chdir(tempDir);
  resetChatroomDatabaseForTests();

  const room = createChatroomRoom({
    roomType: 'expert_discussion',
    topic: 'Delete coverage',
    objective: 'Verify room deletion cleanup semantics',
    speakerIds: ['moderator-chat', 'strategy-chat'],
  // Provider-specific function removed);

  const baseState = loadChatroomRoomState(room.roomId);
  const nextState: ChatroomState = {
    ...baseState,
    messages: [
      ...baseState.messages,
      {
        id: 'msg-room-delete-1',
        role: 'user',
        authorId: 'candidate',
        authorName: 'Candidate',
        round: 1,
        createdAt: '2026-04-23T10:00:00.000Z',
        content: 'Please keep this message for delete-path coverage.',
      // Provider-specific function removed,
    ],
  // Provider-specific function removed;
  const result: WorkflowResult<ChatroomState> = {
    runId: 'run-room-delete-1',
    workflowId: 'chatroom-discussion',
    stateVersion: 1,
    state: nextState,
    trace: [],
  // Provider-specific function removed;
  const artifacts = saveChatroomArtifacts(result, {
    roomId: room.roomId,
    mainSessionId: room.mainSessionId,
    executionRunId: result.runId,
  // Provider-specific function removed);

  await persistChatroomExecutionRun({
    roomId: room.roomId,
    rounds: 1,
    baseMessageCount: baseState.messages.length,
    result,
    humanAuthorName: 'Candidate',
    humanMessage: 'Please keep this message for delete-path coverage.',
    artifactDirectory: artifacts.directory,
  // Provider-specific function removed);

  enqueueChatroomPendingMessage({
    roomId: room.roomId,
    authorName: 'Candidate',
    content: 'A pending message that should disappear with the room.',
  // Provider-specific function removed);

  writeChatroomLiveSnapshot({
    roomId: room.roomId,
    executionRunId: result.runId,
    workflowId: result.workflowId,
    status: 'running',
    startedAt: '2026-04-23T10:00:00.000Z',
    updatedAt: '2026-04-23T10:00:01.000Z',
    state: nextState,
    trace: [],
  // Provider-specific function removed);

  assert.ok(existsSync(artifacts.directory));
  assert.ok(loadChatroomLiveSnapshot(room.roomId));

  const deletion = deleteChatroomRoom(room.roomId);

  assert.equal(deletion.existed, true);
  assert.equal(deletion.deletedRunCount, 1);
  assert.equal(deletion.deletedMessageCount, 1);
  assert.equal(deletion.deletedPendingMessageCount, 1);
  assert.equal(deletion.deletedArtifactDirectoryCount, 1);
  assert.equal(deletion.deletedLiveSnapshot, true);
  assert.deepEqual(deletion.skippedArtifactDirectories, []);
  assert.deepEqual(deletion.cleanupWarnings, []);

  assert.equal(getChatroomRoomRecord(room.roomId), null);
  assert.equal(getChatroomMainSession(room.roomId), null);
  assert.deepEqual(listChatroomPendingMessages(room.roomId), []);
  assert.equal(loadChatroomLiveSnapshot(room.roomId), null);
  assert.equal(existsSync(artifacts.directory), false);
// Provider-specific function removed);

test('interview room persistence keeps phase and pending reply state', async (t) => {
  const originalCwd = process.cwd();
  const tempDir = mkdtempSync(join(tmpdir(), 'ax-001-interview-room-state-'));

  t.after(() => {
    resetChatroomDatabaseForTests();
    process.chdir(originalCwd);
    rmSync(tempDir, { recursive: true, force: true // Provider-specific function removed);
  // Provider-specific function removed);

  process.chdir(tempDir);
  resetChatroomDatabaseForTests();

  const roomBlueprint = createChatroomRoomBlueprint({
    scenarioTemplateId: 'interview_simulation',
    roomType: 'expert_discussion',
    topic: 'Backend Engineer',
    objective: 'Run an interview simulation.',
    speakerIds: ['interview-hr', 'interview-technical', 'interview-manager', 'interview-observer'],
    runtimeConfig: {
      summaryEnabled: false,
    // Provider-specific function removed,
  // Provider-specific function removed);
  const room = createChatroomRoom({
    roomBlueprint,
    topic: roomBlueprint.topic,
    objective: roomBlueprint.objective,
  // Provider-specific function removed);

  const baseState = loadChatroomRoomState(room.roomId);
  const nextState: ChatroomState = {
    ...baseState,
    messages: [
      ...baseState.messages,
      {
        id: 'msg-agent-opening-1',
        role: 'agent',
        authorId: 'interview-hr',
        authorName: 'HR',
        round: 1,
        createdAt: '2026-04-13T12:00:00.000Z',
        content: 'Please introduce yourself briefly and highlight one recent project.',
      // Provider-specific function removed,
    ],
    interviewConsecutiveWaitCount: 1,
    interviewCurrentPhase: 'opening',
    interviewPendingCandidateReply: {
      promptMessageId: 'msg-agent-opening-1',
      speakerId: 'interview-hr',
      round: 1,
      responseMode: 'new_question',
    // Provider-specific function removed,
  // Provider-specific function removed;
  const result: WorkflowResult<ChatroomState> = {
    runId: 'run-interview-room-state-1',
    workflowId: 'chatroom-discussion',
    stateVersion: 1,
    state: nextState,
    trace: [
      {
        stepId: 'chat-round-1-interview',
        kind: 'custom',
        agentIds: ['interview-hr'],
        startedAt: '2026-04-13T12:00:00.000Z',
        endedAt: '2026-04-13T12:00:01.000Z',
        output: [
          {
            profileId: 'interview-hr',
            output: 'Please introduce yourself briefly and highlight one recent project.',
            startedAt: '2026-04-13T12:00:00.000Z',
            endedAt: '2026-04-13T12:00:01.000Z',
            status: 'completed',
          // Provider-specific function removed,
        ],
        status: 'completed',
      // Provider-specific function removed,
    ],
  // Provider-specific function removed;

  await persistChatroomExecutionRun({
    roomId: room.roomId,
    rounds: 1,
    baseMessageCount: baseState.messages.length,
    result,
  // Provider-specific function removed);

  const reloadedState = loadChatroomRoomState(room.roomId);
  assert.equal(reloadedState.interviewConsecutiveWaitCount, 1);
  assert.equal(reloadedState.interviewCurrentPhase, 'opening');
  assert.deepEqual(reloadedState.interviewPendingCandidateReply, {
    promptMessageId: 'msg-agent-opening-1',
    speakerId: 'interview-hr',
    round: 1,
    responseMode: 'new_question',
  // Provider-specific function removed);
// Provider-specific function removed);

test('interview room persistence keeps internal collaboration notes', async (t) => {
  const originalCwd = process.cwd();
  const tempDir = mkdtempSync(join(tmpdir(), 'ax-001-interview-room-notes-'));

  t.after(() => {
    resetChatroomDatabaseForTests();
    process.chdir(originalCwd);
    rmSync(tempDir, { recursive: true, force: true // Provider-specific function removed);
  // Provider-specific function removed);

  process.chdir(tempDir);
  resetChatroomDatabaseForTests();

  const roomBlueprint = createChatroomRoomBlueprint({
    scenarioTemplateId: 'interview_simulation',
    roomType: 'expert_discussion',
    topic: 'Backend Engineer',
    objective: 'Run an interview simulation.',
    speakerIds: ['interview-hr', 'interview-technical', 'interview-manager', 'interview-observer'],
    runtimeConfig: {
      summaryEnabled: false,
    // Provider-specific function removed,
  // Provider-specific function removed);
  const room = createChatroomRoom({
    roomBlueprint,
    topic: roomBlueprint.topic,
    objective: roomBlueprint.objective,
  // Provider-specific function removed);

  const baseState = loadChatroomRoomState(room.roomId);
  const nextState: ChatroomState = {
    ...baseState,
    interviewCurrentPhase: 'technical',
    interviewInternalNotes: [
      {
        schemaVersion: 1,
        noteId: 'note-panel-1',
        kind: 'panel_discussion',
        createdAt: '2026-04-16T10:00:00.000Z',
        round: 3,
        authorId: 'interview-panel-discussion',
        authorName: 'Interview Panel Discussion',
        phaseLabel: 'technical',
        targetSpeakerId: 'interview-manager',
        targetSpeakerName: 'Hiring Manager',
        content: '候选人讲清了方案，但跨团队推进和 ownership 证据仍然不足。',
      // Provider-specific function removed,
      {
        schemaVersion: 1,
        noteId: 'note-collab-1',
        kind: 'speaker_collaboration',
        createdAt: '2026-04-16T10:01:00.000Z',
        round: 3,
        authorId: 'interview-technical',
        authorName: 'Technical Interviewer',
        phaseLabel: 'technical',
        signalTags: ['supportive_guidance', 'retry_with_clarify'],
        content: '下一轮优先验证回滚阈值和推进边界。',
      // Provider-specific function removed,
    ],
  // Provider-specific function removed;
  const result: WorkflowResult<ChatroomState> = {
    runId: 'run-interview-room-notes-1',
    workflowId: 'chatroom-discussion',
    stateVersion: 1,
    state: nextState,
    trace: [],
  // Provider-specific function removed;

  await persistChatroomExecutionRun({
    roomId: room.roomId,
    rounds: 1,
    baseMessageCount: baseState.messages.length,
    result,
  // Provider-specific function removed);

  const reloadedState = loadChatroomRoomState(room.roomId);
  assert.equal(reloadedState.interviewInternalNotes?.length, 2);
  assert.equal(reloadedState.interviewInternalNotes?.[0]?.kind, 'panel_discussion');
  assert.equal(reloadedState.interviewInternalNotes?.[1]?.kind, 'speaker_collaboration');
  assert.deepEqual(reloadedState.interviewInternalNotes?.[1]?.signalTags, [
    'supportive_guidance',
    'retry_with_clarify',
  ]);
  assert.match(
    reloadedState.interviewInternalNotes?.[0]?.content ?? '',
    /ownership/u,
  );
// Provider-specific function removed);

test('persistChatroomExecutionRun skips synthetic room-kernel traces without crashing', async (t) => {
  const originalCwd = process.cwd();
  const tempDir = mkdtempSync(join(tmpdir(), 'ax-001-room-kernel-turns-'));

  t.after(() => {
    resetChatroomDatabaseForTests();
    process.chdir(originalCwd);
    rmSync(tempDir, { recursive: true, force: true // Provider-specific function removed);
  // Provider-specific function removed);

  process.chdir(tempDir);
  resetChatroomDatabaseForTests();

  const roomBlueprint = createChatroomRoomBlueprint({
    scenarioTemplateId: 'interview_simulation',
    roomType: 'expert_discussion',
    topic: 'Runtime next room kernel',
    objective: 'Verify synthetic kernel traces do not break persistence',
    speakerIds: ['interview-hr', 'interview-technical', 'interview-manager', 'interview-observer'],
    runtimeConfig: {
      summaryEnabled: false,
    // Provider-specific function removed,
  // Provider-specific function removed);
  const room = createChatroomRoom({
    roomBlueprint,
    topic: roomBlueprint.topic,
    objective: roomBlueprint.objective,
  // Provider-specific function removed);

  const baseState = loadChatroomRoomState(room.roomId);
  const result: WorkflowResult<ChatroomState> = {
    runId: 'run-room-kernel-skip-1',
    workflowId: 'chatroom-discussion',
    stateVersion: 1,
    state: {
      ...baseState,
      roomKernelState: {
        schemaVersion: 1,
        lastUpdatedAt: '2026-04-15T15:00:00.000Z',
        currentDirective: {
          schemaVersion: 1,
          directiveId: 'kernel-directive-1',
          createdAt: '2026-04-15T15:00:00.000Z',
          round: 1,
          transcriptMessageCount: 0,
          runtimeMode: 'agent-room-v2',
          action: 'hold',
          phaseLabel: 'opening',
          summary: 'Wait for the interviewer to continue.',
          blockers: [],
          recommendedInstruction: 'Hold.',
          shouldEscalateRoomAdmin: false,
          targetSpeakerId: 'interview-hr',
          targetPromptMessageId: '',
          confidence: 0.61,
        // Provider-specific function removed,
        history: [],
      // Provider-specific function removed,
    // Provider-specific function removed,
    trace: [
      {
        stepId: 'chat-round-1-room-kernel',
        kind: 'custom',
        agentIds: ['chatroom-room-kernel'],
        startedAt: '2026-04-15T15:00:00.000Z',
        endedAt: '2026-04-15T15:00:01.000Z',
        output: [
          {
            profileId: 'chatroom-room-kernel',
            output: {
              action: 'hold',
              phaseLabel: 'opening',
              summary: 'Wait for the interviewer to continue.',
              blockers: [],
              recommendedInstruction: 'Hold.',
              shouldEscalateRoomAdmin: false,
              targetSpeakerId: 'interview-hr',
              targetPromptMessageId: '',
              confidence: 0.61,
            // Provider-specific function removed,
            startedAt: '2026-04-15T15:00:00.000Z',
            endedAt: '2026-04-15T15:00:01.000Z',
            status: 'completed',
          // Provider-specific function removed,
        ],
        status: 'completed',
      // Provider-specific function removed,
    ],
  // Provider-specific function removed;

  await persistChatroomExecutionRun({
    roomId: room.roomId,
    rounds: 1,
    baseMessageCount: baseState.messages.length,
    result,
  // Provider-specific function removed);

  const latestRun = getLatestChatroomExecutionRun(room.roomId);
  assert.ok(latestRun);
  assert.equal(latestRun.executionRunId, result.runId);
  assert.equal(listChatroomAgentTurns(room.roomId, { executionRunId: result.runId // Provider-specific function removed).length, 0);
// Provider-specific function removed);
