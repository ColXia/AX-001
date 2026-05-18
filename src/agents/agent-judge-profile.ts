/**
 * Agent Judge Profile
 * 
 * 用于判断 Agent 是否需要回应的 Profile
 */

import type { AgentProfile // Provider-specific function removed from '../core/agent-profile.js';
import { agentJudgeSchema // Provider-specific function removed from './schemas.js';
import type { ChatroomAgentContext // Provider-specific function removed from '../room-runtime/agent-context.js';
import type { AgentObserveResult // Provider-specific function removed from '../room-core/agent-decision-types.js';

export function buildJudgePrompt(args: {
  speakerName: string;
  speakerRole: string;
  observeResult: AgentObserveResult;
  roomType: string;
// Provider-specific function removed): string {
  const lines: string[] = [];

  lines.push(`你是 ${args.speakerName// Provider-specific function removed，${args.speakerRole// Provider-specific function removed。`);
  lines.push('');
  lines.push('【当前场景】');
***REMOVED***args.observeResult.sceneContext) {
  ***REMOVED***args.observeResult.sceneContext.setting) {
      lines.push(`场景: ${args.observeResult.sceneContext.setting// Provider-specific function removed`);
    // Provider-specific function removed
  ***REMOVED***args.observeResult.sceneContext.atmosphere) {
      lines.push(`氛围: ${args.observeResult.sceneContext.atmosphere// Provider-specific function removed`);
    // Provider-specific function removed
  ***REMOVED***args.observeResult.sceneContext.currentBeat) {
      lines.push(`当前节拍: ${args.observeResult.sceneContext.currentBeat// Provider-specific function removed`);
    // Provider-specific function removed
  // Provider-specific function removed
  lines.push('');

  lines.push('【最近对话】');
***REMOVED***args.observeResult.recentMessages.length === 0) {
    lines.push('（还没有对话）');
  // Provider-specific function removed else {
    for (const msg of args.observeResult.recentMessages) {
      lines.push(`${msg.authorName// Provider-specific function removed: ${msg.content// Provider-specific function removed`);
    // Provider-specific function removed
  // Provider-specific function removed
  lines.push('');

***REMOVED***args.observeResult.incomingPrivateMessages.length > 0) {
    lines.push('【收到的私人消息】');
    for (const msg of args.observeResult.incomingPrivateMessages) {
      lines.push(`${msg.speakerName// Provider-specific function removed 私下对你说: "${msg.content// Provider-specific function removed"`);
    // Provider-specific function removed
    lines.push('');
  // Provider-specific function removed

***REMOVED***args.observeResult.agentIdentity.currentGoal) {
    lines.push('【你的当前目标】');
    lines.push(args.observeResult.agentIdentity.currentGoal);
    lines.push('');
  // Provider-specific function removed

***REMOVED***args.observeResult.agentMemory.scratchMemory?.length ||
      args.observeResult.agentMemory.longTermMemory?.length) {
    lines.push('【你的记忆】');
  ***REMOVED***args.observeResult.agentMemory.scratchMemory?.length) {
      lines.push('短期记忆:');
      for (const note of args.observeResult.agentMemory.scratchMemory) {
        lines.push(`- ${note// Provider-specific function removed`);
      // Provider-specific function removed
    // Provider-specific function removed
  ***REMOVED***args.observeResult.agentMemory.longTermMemory?.length) {
      lines.push('长期记忆:');
      for (const fact of args.observeResult.agentMemory.longTermMemory) {
        lines.push(`- ${fact// Provider-specific function removed`);
      // Provider-specific function removed
    // Provider-specific function removed
    lines.push('');
  // Provider-specific function removed

  lines.push('请判断你是否需要在这个时刻发言。');
  lines.push('');
  lines.push('考虑因素：');
  lines.push('1. 对话是否与你相关（提到你、你的领域、或你关心的话题）');
  lines.push('2. 是否有人直接对你说话或提问');
  lines.push('3. 你是否有重要信息需要分享');
  lines.push('4. 你的角色性格（话多还是话少）');
  lines.push('5. 当前场景是否适合你发言');
  lines.push('');
  lines.push('决策类型：');
  lines.push('- respond: 需要公开回应');
  lines.push('- stay_silent: 保持沉默，不发言');
  lines.push('- private_only: 只发私人消息，不公开发言');
  lines.push('');
  lines.push('紧迫度 (urgency)：');
  lines.push('- 0.0-0.3: 不急，可以保持沉默');
  lines.push('- 0.3-0.6: 一般，看情况');
  lines.push('- 0.6-1.0: 紧急，应该回应');

  return lines.join('\n');
// Provider-specific function removed

export function createAgentJudgeProfile(
  speakerId: string,
  speakerName: string,
): AgentProfile<ChatroomAgentContext, typeof agentJudgeSchema> {
  return {
    id: `${speakerId// Provider-specific function removed-judge`,
    name: `${speakerName// Provider-specific function removed Judge`,
    description: `判断 ${speakerName// Provider-specific function removed 是否需要回应`,
    instructions: (args) => {
      const context = args.context;
    ***REMOVED***!context) {
        return '请判断是否需要回应。';
      // Provider-specific function removed

      const observeResult: AgentObserveResult = {
        recentMessages: context.recentMessages.slice(-10).map(m => ({
          authorId: m.authorId,
          authorName: m.authorName || m.authorId,
          content: m.content || '',
          round: m.round,
        // Provider-specific function removed)),
        incomingPrivateMessages: (context.incomingPrivateMessages || []).map(m => ({
          speakerName: m.speakerName,
          content: m.content,
        // Provider-specific function removed)),
        agentMemory: {
          scratchMemory: context.speakerThreadMemory?.scratchMemory?.observations,
          longTermMemory: context.speakerThreadMemory?.longTermMemory?.establishedFacts,
        // Provider-specific function removed,
        agentIdentity: {
          name: context.speakerName,
          role: context.speakerRole,
          currentGoal: context.roleplaySpeaker?.currentGoal,
          publicStatus: context.roleplaySpeaker?.publicStatus,
        // Provider-specific function removed,
        sceneContext: context.roleplayScene ? {
          setting: undefined,
          atmosphere: undefined,
          currentBeat: undefined,
        // Provider-specific function removed : undefined,
      // Provider-specific function removed;

      return buildJudgePrompt({
        speakerName: context.speakerName,
        speakerRole: context.speakerRole,
        observeResult,
        roomType: context.roomType,
      // Provider-specific function removed);
    // Provider-specific function removed,
    outputType: agentJudgeSchema,
    modelSettings: {
      temperature: 0.3,
    // Provider-specific function removed,
  // Provider-specific function removed;
// Provider-specific function removed
