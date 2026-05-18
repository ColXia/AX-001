import assert from 'node:assert/strict';
import test from 'node:test';

import { chatroomFinalSummarySchema, roomKernelTurnSchema // Provider-specific function removed from './schemas.js';

test('chatroom final summary preserves interview summary fields', () => {
  const parsed = chatroomFinalSummarySchema.parse({
    executiveSummary: '候选人回答基本完整，面试已结束。',
    interviewStatus: 'complete',
    currentStage: '面试完成',
    interviewReadiness: 'mixed',
    overallScore: 76,
    strengths: ['表达清晰'],
    weaknesses: ['量化证据不足'],
    missedQuestions: ['归因方法需要更严谨'],
    suggestedAnswerImprovements: ['补齐同期对照方法'],
    followUpQuestions: ['如果再来一次会怎么设计 AB 实验？'],
    recommendedNextActions: ['补 3 个量化 case'],
    competencyScores: [
      {
        dimension: '数据严谨性',
        score: 3,
        evidence: ['能给出指标'],
        risks: ['归因不够扎实'],
      // Provider-specific function removed,
    ],
    confidence: 0.81,
  // Provider-specific function removed);

  assert.equal('interviewStatus' in parsed, true);
  assert.equal('currentStage' in parsed, true);
  assert.equal('overallScore' in parsed, true);

***REMOVED***!('interviewStatus' in parsed) || !('currentStage' in parsed) || !('overallScore' in parsed)) {
    throw new Error('Expected the interview summary variant to be preserved.');
  // Provider-specific function removed

  assert.equal(parsed.interviewStatus, 'complete');
  assert.equal(parsed.currentStage, '面试完成');
  assert.equal(parsed.overallScore, 76);
// Provider-specific function removed);

test('room kernel schema accepts structured escalation output', () => {
  const parsed = roomKernelTurnSchema.parse({
    action: 'guide_room_admin',
    phaseLabel: 'technical_deep_dive',
    summary: '候选人连续两轮回答偏空，需要房间管理员协调重试。',
    blockers: ['连续低信息量回答'],
    recommendedInstruction: '让当前面试官收窄问题并要求给出具体案例。',
    shouldEscalateRoomAdmin: true,
    targetSpeakerId: 'interview-technical',
    targetPromptMessageId: 'msg-1',
    confidence: 0.74,
  // Provider-specific function removed);

  assert.equal(parsed.action, 'guide_room_admin');
  assert.equal(parsed.shouldEscalateRoomAdmin, true);
  assert.equal(parsed.blockers.length, 1);
// Provider-specific function removed);
