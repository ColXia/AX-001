import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createChatroomRoomBlueprint,
  resolveDefaultScenarioMaxReplyCharacters,
// Provider-specific function removed from '../room-scenarios/room-blueprints.js';
import { planChatroomRoomScenario // Provider-specific function removed from '../room-scenarios/scenario-planner.js';

test('scenario-specific default max reply characters are applied in blueprints', () => {
  const projectBlueprint = createChatroomRoomBlueprint({
    scenarioTemplateId: 'project_development_discussion',
    topic: 'AX-001 project review',
    objective: 'Review the architecture plan and risks.',
  // Provider-specific function removed);
  const interviewBlueprint = createChatroomRoomBlueprint({
    scenarioTemplateId: 'interview_simulation',
    topic: 'Backend interview',
    objective: 'Run a realistic interview.',
  // Provider-specific function removed);
  const roleplayBlueprint = createChatroomRoomBlueprint({
    scenarioTemplateId: 'roleplay_scene',
    topic: 'Rainy station scene',
    objective: 'Keep the scene moving.',
  // Provider-specific function removed);

  assert.equal(
    projectBlueprint.runtimeConfig.maxReplyCharacters,
    resolveDefaultScenarioMaxReplyCharacters('project_development_discussion'),
  );
  assert.equal(
    interviewBlueprint.runtimeConfig.maxReplyCharacters,
    resolveDefaultScenarioMaxReplyCharacters('interview_simulation'),
  );
  assert.equal(
    roleplayBlueprint.runtimeConfig.maxReplyCharacters,
    resolveDefaultScenarioMaxReplyCharacters('roleplay_scene'),
  );
  assert.ok(
    projectBlueprint.runtimeConfig.maxReplyCharacters >
      interviewBlueprint.runtimeConfig.maxReplyCharacters,
  );
// Provider-specific function removed);

test('tavern roleplay demo uses stable role-card speaker ids', () => {
  const planned = planChatroomRoomScenario({
    scenarioTemplateId: 'tavern_roleplay_demo',
  // Provider-specific function removed);
  const blueprint = planned.blueprint;

  assert.equal(blueprint.scenarioTemplateId, 'tavern_roleplay_demo');
  assert.equal(blueprint.roomType, 'roleplay_scene');
  assert.ok(blueprint.speakerIds.includes('scene-host-rp'));
  assert.ok(blueprint.speakerIds.includes('custom-rp-tavern-keeper'));
  assert.ok(blueprint.speakerIds.includes('custom-rp-tavern-mercenary'));
  assert.ok(
    blueprint.participantSlots.some(
      (slot) =>
        slot.speakerId === 'custom-rp-tavern-keeper' &&
        slot.profileId === 'custom-rp-tavern-keeper',
    ),
  );
  assert.equal(blueprint.customCharacters?.[0]?.characterId, 'tavern-keeper');
  assert.match(planned.notes.join('\n'), /role-card/i);
// Provider-specific function removed);
