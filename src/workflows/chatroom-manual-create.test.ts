import assert from 'node:assert/strict';
import { test // Provider-specific function removed from 'node:test';

import {
  ChatroomManualCreateValidationError,
  resolveChatroomManualCreatePlan,
// Provider-specific function removed from './chatroom-manual-create.js';

test('resolveChatroomManualCreatePlan returns direct mode without scoring fields', () => {
  const plan = resolveChatroomManualCreatePlan({
    topic: 'Architecture review',
    objective: 'Discuss system design tradeoffs',
    roomType: 'expert_discussion',
    speakerCount: 12,
  // Provider-specific function removed);

  assert.equal(plan.mode, 'direct');
  assert.equal(plan.roomType, 'expert_discussion');
  assert.equal(plan.speakerCount, 12);
// Provider-specific function removed);

test('resolveChatroomManualCreatePlan switches to interview scenario when score template is provided', () => {
  const plan = resolveChatroomManualCreatePlan({
    topic: 'Backend interview',
    objective: 'Evaluate candidate depth',
    roomType: 'expert_discussion',
    speakerCount: 2,
    scoreTemplateId: 'backend_engineering',
  // Provider-specific function removed);

  assert.equal(plan.mode, 'interview_scenario');
  assert.equal(plan.roomBlueprint.scenarioTemplateId, 'interview_simulation');
  assert.equal(
    (plan.roomBlueprint.metadata?.scenario as { scoreTemplateId?: string // Provider-specific function removed)?.scoreTemplateId,
    'backend_engineering',
  );
// Provider-specific function removed);

test('resolveChatroomManualCreatePlan keeps custom score dimensions', () => {
  const plan = resolveChatroomManualCreatePlan({
    topic: 'Frontend interview',
    objective: 'Probe candidate fundamentals',
    roomType: 'expert_discussion',
    speakerCount: 2,
    scoreDimensions: [
      'System design',
      'Collaboration',
      'System design',
      '  ',
    ],
  // Provider-specific function removed);

  assert.equal(plan.mode, 'interview_scenario');
  assert.deepEqual(plan.scoreDimensions, ['System design', 'Collaboration']);
// Provider-specific function removed);

test('resolveChatroomManualCreatePlan validates score template id', () => {
  assert.throws(
    () =>
      resolveChatroomManualCreatePlan({
        topic: 'Interview',
        objective: 'Check invalid template handling',
        roomType: 'expert_discussion',
        speakerCount: 12,
        scoreTemplateId: 'unknown_template',
      // Provider-specific function removed),
    (error) => {
      assert.ok(error instanceof ChatroomManualCreateValidationError);
      assert.equal(error.code, 'invalid_score_template');
      return true;
    // Provider-specific function removed,
  );
// Provider-specific function removed);

test('resolveChatroomManualCreatePlan validates speaker range in direct mode only', () => {
  assert.throws(
    () =>
      resolveChatroomManualCreatePlan({
        topic: 'Discussion',
        objective: 'Direct mode should validate speakers',
        roomType: 'expert_discussion',
        speakerCount: 2,
      // Provider-specific function removed),
    (error) => {
      assert.ok(error instanceof ChatroomManualCreateValidationError);
      assert.equal(error.code, 'invalid_speaker_count');
      return true;
    // Provider-specific function removed,
  );

  const scenarioPlan = resolveChatroomManualCreatePlan({
    topic: 'Interview',
    objective: 'Scenario mode should own speaker setup',
    roomType: 'expert_discussion',
    speakerCount: 2,
    scoreTemplateId: 'backend_engineering',
  // Provider-specific function removed);
  assert.equal(scenarioPlan.mode, 'interview_scenario');
// Provider-specific function removed);
