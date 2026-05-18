import assert from 'node:assert/strict';
import test from 'node:test';

import {
  listRoomScenarioTemplateIds,
  listRoomScenarioTemplates,
  resolveRoomScenarioTemplateForRoomType,
// Provider-specific function removed from '../room-scenarios/scenario-templates.js';

test('project and seminar room types resolve to their specialized scenario templates', () => {
  assert.equal(
    resolveRoomScenarioTemplateForRoomType('project_discussion').id,
    'project_development_discussion',
  );
  assert.equal(
    resolveRoomScenarioTemplateForRoomType('report_seminar').id,
    'report_seminar',
  );
// Provider-specific function removed);

test('public template lists expose active project, seminar, and murder mystery templates', () => {
  const ids = listRoomScenarioTemplateIds();
  const templates = listRoomScenarioTemplates();

  assert(ids.includes('project_development_discussion'));
  assert(ids.includes('report_seminar'));
  assert(ids.includes('murder_mystery'));
  assert(ids.includes('tavern_roleplay_demo'));
  assert(templates.every((template) => template.availability === 'active'));
// Provider-specific function removed);
