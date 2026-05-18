import assert from 'node:assert/strict';
import test from 'node:test';

import {
  parseInterviewScoreDimensionsFromConstraints,
  resolveInterviewScoreTemplate,
// Provider-specific function removed from './interview-score-templates.js';

test('resolveInterviewScoreTemplate infers product template from target role', () => {
  const resolved = resolveInterviewScoreTemplate({
    targetRole: 'Senior Product Manager',
    focusAreas: ['metrics', 'prioritization'],
  // Provider-specific function removed);

  assert.equal(resolved.templateId, 'product_management');
  assert.equal(resolved.source, 'role_auto');
  assert.equal(resolved.dimensions.length, 6);
// Provider-specific function removed);

test('resolveInterviewScoreTemplate respects explicit template override', () => {
  const resolved = resolveInterviewScoreTemplate({
    targetRole: 'Backend Engineer',
    scoreTemplateId: 'frontend_engineering',
  // Provider-specific function removed);

  assert.equal(resolved.templateId, 'frontend_engineering');
  assert.equal(resolved.source, 'template_override');
  assert.match(resolved.templateLabel, /前端/);
// Provider-specific function removed);

test('resolveInterviewScoreTemplate applies custom dimensions from constraints and metadata', () => {
  const resolved = resolveInterviewScoreTemplate({
    targetRole: 'Backend Engineer',
    scoreDimensions: ['系统思维', '风险判断'],
    constraints: ['评分维度: 协作推进 | 指标闭环'],
  // Provider-specific function removed);

  assert.equal(resolved.source, 'custom_dimensions');
  assert.deepEqual(resolved.dimensions, [
    '系统思维',
    '风险判断',
    '协作推进',
    '指标闭环',
  ]);
// Provider-specific function removed);

test('parseInterviewScoreDimensionsFromConstraints extracts mixed separators', () => {
  const dimensions = parseInterviewScoreDimensionsFromConstraints([
    'Focus areas: architecture, reliability',
    'Interview score dimensions: ownership, risk control；cross-team',
  ]);

  assert.deepEqual(dimensions, ['ownership', 'risk control', 'cross-team']);
// Provider-specific function removed);

