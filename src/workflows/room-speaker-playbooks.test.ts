import assert from 'node:assert/strict';
import test from 'node:test';

import { createChatroomRoomBlueprint // Provider-specific function removed from '../room-scenarios/room-blueprints.js';
import {
  buildInterviewSpeakerExecutionPromptLines,
  buildInterviewTransitionPromptLines,
  buildRoomSpeakerExecutionPromptLines,
// Provider-specific function removed from '../room-scenarios/speaker-playbooks.js';

test('project discussion speaker playbook includes phase and decision focus', () => {
  const blueprint = createChatroomRoomBlueprint({
    scenarioTemplateId: 'project_development_discussion',
    roomType: 'expert_discussion',
    topic: '支付链路重构',
    objective: '在上线前确定缓存与发布方案',
    constraints: ['Decision focus: 缓存一致性, 发布策略'],
    metadata: {
      scenario: {
        projectName: 'AX-001',
        projectStage: 'planning',
        decisionFocus: ['缓存一致性', '发布策略'],
      // Provider-specific function removed,
    // Provider-specific function removed,
  // Provider-specific function removed);

  const lines = buildRoomSpeakerExecutionPromptLines({
    roomBlueprint: blueprint,
    round: 2,
    speakerName: '架构师',
    speakerRole: '负责把讨论压缩到可执行方案',
    currentPhaseLabel: '方案比较',
    currentPhaseObjective: '比较主要方案分支，找出真正影响决策的取舍点。',
  // Provider-specific function removed);

  const text = lines.join('\n');
  assert.match(text, /当前治理阶段：方案比较/);
  assert.match(text, /当前决策焦点：缓存一致性、发布策略/);
  assert.match(text, /每次发言优先推进一个最关键的决策、风险或落地动作/);
// Provider-specific function removed);

test('roleplay speaker playbook keeps the agent in scene and reacts to latest event', () => {
  const blueprint = createChatroomRoomBlueprint({
    scenarioTemplateId: 'roleplay_scene',
    roomType: 'roleplay_scene',
    topic: '雨夜车站对峙',
    objective: '把冲突推进到下一次转折',
    customCharacters: [
      { name: '林岚', instruction: '表面冷静，实际在隐瞒关键信息。' // Provider-specific function removed,
      { name: '沈砚', instruction: '带着怀疑逼近真相。' // Provider-specific function removed,
    ],
  // Provider-specific function removed);

  const lines = buildRoomSpeakerExecutionPromptLines({
    roomBlueprint: blueprint,
    round: 3,
    speakerName: '林岚',
    speakerRole: '在压力下维持表面镇定',
    currentPhaseLabel: '推进冲突',
    currentPhaseObjective: '推动关系变化与外部刺激，让剧情继续升温。',
    currentBeat: '站台对峙',
    latestEvent: '远处忽然传来列车进站广播，打断了原本的逼问。',
  // Provider-specific function removed);

  const text = lines.join('\n');
  assert.match(text, /当前剧情节拍：站台对峙/);
  assert.match(text, /最新场景刺激：远处忽然传来列车进站广播/);
  assert.match(text, /保持角色内发言/);
  assert.match(text, /不要替其他角色下结论/);
// Provider-specific function removed);

test('interview speaker playbook enforces same-interviewer follow-up depth', () => {
  const blueprint = createChatroomRoomBlueprint({
    scenarioTemplateId: 'interview_simulation',
    roomType: 'expert_discussion',
    topic: 'Backend Engineer',
    objective: 'Run a realistic backend interview.',
    metadata: {
      scenario: {
        targetRole: 'Backend Engineer',
        targetLevel: 'Senior',
        companyStyle: 'high bar',
      // Provider-specific function removed,
    // Provider-specific function removed,
  // Provider-specific function removed);

  const lines = buildInterviewSpeakerExecutionPromptLines({
    roomBlueprint: blueprint,
    speakerName: 'Technical Interviewer',
    stageLabel: '技术深挖',
    phase: 'technical_deep_dive',
    responseMode: 'new_question',
    continuityMode: 'same_interviewer_followup',
    currentPhaseLabel: '证据深挖',
    currentPhaseObjective: '围绕候选人已给出的经历追问可验证证据与关键权衡。',
  // Provider-specific function removed);

  const text = lines.join('\n');
  assert.match(text, /治理阶段：证据深挖/);
  assert.match(text, /延续你上一轮的问题链/);
  assert.match(text, /优先继续深挖实现细节、关键权衡、边界条件、失败案例和可验证结果/);
  assert.match(text, /下一问必须尽量引用候选人刚才回答中的一个具体事实、取舍或缺口/);
// Provider-specific function removed);

test('interview transition playbook tells handoff to pass signals and next gap', () => {
  const blueprint = createChatroomRoomBlueprint({
    scenarioTemplateId: 'interview_simulation',
    roomType: 'expert_discussion',
    topic: 'Product Manager',
    objective: 'Run a realistic PM interview.',
    metadata: {
      scenario: {
        targetRole: 'Product Manager',
        targetLevel: 'Mid-Level',
      // Provider-specific function removed,
    // Provider-specific function removed,
  // Provider-specific function removed);

  const lines = buildInterviewTransitionPromptLines({
    roomBlueprint: blueprint,
    nextStageLabel: '经理面',
    nextQuestionGoal: '验证候选人的优先级判断与跨团队推动能力。',
    currentPhaseLabel: '收束评估',
    currentPhaseObjective: '补最后缺口并准备进入面试总结。',
    transitionKind: 'handoff',
  // Provider-specific function removed);

  const text = lines.join('\n');
  assert.match(text, /下一阶段：经理面/);
  assert.match(text, /下一问目标：验证候选人的优先级判断与跨团队推动能力/);
  assert.match(text, /交接时要明确上一轮得到了什么信号、还缺什么证据/);
// Provider-specific function removed);
