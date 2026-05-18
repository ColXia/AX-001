import test from 'node:test';
import assert from 'node:assert/strict';

import {
  resolveInterviewCandidateControlPlan,
  resolveInterviewInsufficientAnswerPlan,
  resolveInterviewStatusFromState,
  type InterviewAskPhase,
  type InterviewStageCounts,
// Provider-specific function removed from './interview-room-controller.js';
import type { ChatroomMessage // Provider-specific function removed from './chatroom-types.js';

function message(input: {
  id: string;
  role: ChatroomMessage['role'];
  authorId: string;
  authorName: string;
  round: number;
  content: string;
// Provider-specific function removed): ChatroomMessage {
  return {
    ...input,
    createdAt: '2026-04-13T00:00:00.000Z',
  // Provider-specific function removed;
// Provider-specific function removed

function resolveStageLabel(phase: InterviewAskPhase): string {
  return `stage:${phase// Provider-specific function removed`;
// Provider-specific function removed

const EMPTY_STAGE_COUNTS: InterviewStageCounts = {
  hr: 0,
  technical: 0,
  observer: 0,
  manager: 0,
// Provider-specific function removed;

test('controller keeps same interviewer when candidate asks to repeat a technical question', () => {
  const plan = resolveInterviewCandidateControlPlan({
    candidateReplyCount: 2,
    stageCounts: { ...EMPTY_STAGE_COUNTS, technical: 1 // Provider-specific function removed,
    latestCandidateTurnKind: 'repeat_request',
    latestQuestionMessage: message({
      id: 'a2',
      role: 'agent',
      authorId: 'interview-technical',
      authorName: 'Tech',
      round: 2,
      content: 'How did you guarantee cross-service consistency?',
    // Provider-specific function removed),
    resolveStageLabel,
  // Provider-specific function removed);

  assert.ok(plan);
  assert.equal(plan.kind, 'ask');
  assert.equal(plan.speakerId, 'interview-technical');
  assert.equal(plan.phase, 'technical_deep_dive');
  assert.equal(plan.responseMode, 'clarify');
  assert.equal(plan.stageLabel, 'stage:technical_deep_dive');
// Provider-specific function removed);

test('controller routes explicit candidate withdraw to complete', () => {
  const plan = resolveInterviewCandidateControlPlan({
    candidateReplyCount: 3,
    stageCounts: { ...EMPTY_STAGE_COUNTS, technical: 2 // Provider-specific function removed,
    latestCandidateTurnKind: 'withdraw_request',
    latestQuestionMessage: undefined,
    resolveStageLabel,
  // Provider-specific function removed);

  assert.deepEqual(plan, {
    kind: 'complete',
    reason: 'The candidate explicitly asked to end the interview, so the room should stop and move to synthesis.',
    terminalStatus: 'aborted',
  // Provider-specific function removed);
// Provider-specific function removed);

test('controller completes after the third identical candidate answer in a row', () => {
  const plan = resolveInterviewCandidateControlPlan({
    candidateReplyCount: 3,
    stageCounts: { ...EMPTY_STAGE_COUNTS, technical: 2 // Provider-specific function removed,
    latestCandidateTurnKind: 'repeated_answer',
    latestQuestionMessage: message({
      id: 'a3',
      role: 'agent',
      authorId: 'interview-technical',
      authorName: 'Tech',
      round: 3,
      content: 'Please answer with one concrete incident and the final result.',
    // Provider-specific function removed),
    repeatedAnswerCount: 2,
    resolveStageLabel,
  // Provider-specific function removed);

  assert.deepEqual(plan, {
    kind: 'complete',
    reason: 'The candidate has repeated the same answer enough times that the interview cannot make progress and should end.',
    terminalStatus: 'aborted',
  // Provider-specific function removed);
// Provider-specific function removed);

test('controller keeps manager round on insufficient manager answer coverage', () => {
  const plan = resolveInterviewInsufficientAnswerPlan({
    candidateReplyCount: 5,
    stageCounts: { ...EMPTY_STAGE_COUNTS, technical: 2, manager: 1 // Provider-specific function removed,
    latestCandidateTurn: {
      message: message({
        id: 'u5',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 5,
        content: 'I coordinated with a few teams.',
      // Provider-specific function removed),
      kind: 'answer',
    // Provider-specific function removed,
    latestQuestionMessage: message({
      id: 'a5',
      role: 'agent',
      authorId: 'interview-manager',
      authorName: 'Manager',
      round: 5,
      content: 'Tell me about a resource conflict you had to resolve.',
    // Provider-specific function removed),
    latestAnswerCoverage: {
      isAdequate: false,
      missingCategory: 'collaboration',
      followUpFocus: 'Please explain the conflict, your tradeoff, and the final alignment result.',
    // Provider-specific function removed,
    consecutiveInadequateAnswerCount: 1,
    resolveStageLabel,
  // Provider-specific function removed);

  assert.ok(plan);
  assert.equal(plan.kind, 'ask');
  assert.equal(plan.speakerId, 'interview-manager');
  assert.equal(plan.phase, 'manager_round');
  assert.equal(plan.responseMode, 'new_question');
  assert.equal(plan.stageLabel, 'stage:manager_round');
  assert.equal(plan.focus, 'Please explain the conflict, your tradeoff, and the final alignment result.');
// Provider-specific function removed);

test('controller stops forcing the same follow-up after two consecutive inadequate answers', () => {
  const plan = resolveInterviewInsufficientAnswerPlan({
    candidateReplyCount: 6,
    stageCounts: { ...EMPTY_STAGE_COUNTS, technical: 3, manager: 0 // Provider-specific function removed,
    latestCandidateTurn: {
      message: message({
        id: 'u6',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 6,
        content: 'I would keep learning and ask teammates for help.',
      // Provider-specific function removed),
      kind: 'answer',
    // Provider-specific function removed,
    latestQuestionMessage: message({
      id: 'a6',
      role: 'agent',
      authorId: 'interview-technical',
      authorName: 'Tech',
      round: 6,
      content: 'Please answer the last technical question directly and include your own diagnosis and result.',
    // Provider-specific function removed),
    latestAnswerCoverage: {
      isAdequate: false,
      missingCategory: 'direct_response',
      followUpFocus: 'Please answer the technical question directly before moving on.',
    // Provider-specific function removed,
    consecutiveInadequateAnswerCount: 2,
    resolveStageLabel,
  // Provider-specific function removed);

  assert.equal(plan, undefined);
// Provider-specific function removed);

test('controller does not force another hr wrap-up retry once the demo already has enough replies', () => {
  const plan = resolveInterviewInsufficientAnswerPlan({
    candidateReplyCount: 6,
    stageCounts: { ...EMPTY_STAGE_COUNTS, technical: 2, manager: 1, hr: 3 // Provider-specific function removed,
    latestCandidateTurn: {
      message: message({
        id: 'u6',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 6,
        content: 'I want to know what results matter most in the first three months, and I prefer backend roles with clear ownership.',
      // Provider-specific function removed),
      kind: 'answer',
    // Provider-specific function removed,
    latestQuestionMessage: message({
      id: 'a6',
      role: 'agent',
      authorId: 'interview-hr',
      authorName: 'HR',
      round: 6,
      content: 'Finally, why do you want this direction, and what kind of work would you most like to take on first?',
    // Provider-specific function removed),
    latestAnswerCoverage: {
      isAdequate: false,
      missingCategory: 'motivation',
      followUpFocus: 'Please answer your motivation directly before moving on.',
    // Provider-specific function removed,
    consecutiveInadequateAnswerCount: 1,
    resolveStageLabel,
  // Provider-specific function removed);

  assert.equal(plan, undefined);
// Provider-specific function removed);

test('resolveInterviewStatusFromState treats terminal phase as complete even when reply count is below heuristic floor', () => {
  const status = resolveInterviewStatusFromState({
    messages: [
      message({
        id: 'a1',
        role: 'agent',
        authorId: 'interview-hr',
        authorName: 'HR',
        round: 1,
        content: 'Please introduce yourself briefly.',
      // Provider-specific function removed),
      message({
        id: 'u1',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 1,
        content: 'I am a CS student focused on backend development.',
      // Provider-specific function removed),
      message({
        id: 'a2',
        role: 'agent',
        authorId: 'interview-technical',
        authorName: 'Tech',
        round: 2,
        content: 'Please answer with one real incident.',
      // Provider-specific function removed),
      message({
        id: 'u2',
        role: 'user',
        authorId: 'user',
        authorName: 'Candidate',
        round: 2,
        content: 'I am a CS student focused on backend development.',
      // Provider-specific function removed),
    ],
    interviewCurrentPhase: 'complete',
    interviewPendingCandidateReply: undefined,
  // Provider-specific function removed);

  assert.equal(status, 'complete');
// Provider-specific function removed);
