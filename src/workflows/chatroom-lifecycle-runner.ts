/**
 * Chatroom Lifecycle Runner
 * 
 * 使用 Agent Turn Lifecycle 的执行器
 * 支持 Observe → Judge → Act → Update 模式
 */

import type { AgentProfile // Provider-specific function removed from '../core/agent-profile.js';
import type { AgentRuntime // Provider-specific function removed from '../core/agent-runtime.js';
import type { ChatroomState // Provider-specific function removed from '../room-runtime/room-state.js';
import type { ChatroomAgentContext // Provider-specific function removed from '../room-runtime/agent-context.js';
import { createChatroomContext // Provider-specific function removed from '../room-runtime/context-builders.js';
import {
  executeAgentTurnLifecycle,
  applyTurnResultToState,
// Provider-specific function removed from '../room-runtime/agent-turn-lifecycle.js';
import type { AgentTurnExecutionConfig // Provider-specific function removed from '../room-core/agent-decision-types.js';
import type { RoleplayCharacterCard // Provider-specific function removed from '../room-scenarios/roleplay/roleplay-characters.js';

export interface ExecuteLifecycleRoundInput {
  agentRuntime: AgentRuntime;
  state: ChatroomState;
  round: number;
  speakers: AgentProfile<ChatroomAgentContext, 'text'>[];
  roomId?: string;
  customCharacters?: RoleplayCharacterCard[];
  config?: Partial<AgentTurnExecutionConfig>;
// Provider-specific function removed

export async function executeLifecycleRound(
  input: ExecuteLifecycleRoundInput,
): Promise<ChatroomState> {
  const config: AgentTurnExecutionConfig = {
    mode: 'sequential',
    observationWindow: 10,
    silenceThreshold: 0.3,
    enableInternalNotes: true,
    ...input.config,
  // Provider-specific function removed;

  // 串行执行每个 speaker
  for (const speaker of input.speakers) {
    const context = createChatroomContext({
      state: input.state,
      workflowId: `lifecycle-round-${input.round// Provider-specific function removed`,
      stepId: `${speaker.id// Provider-specific function removed-turn`,
      round: input.round,
      roomId: input.roomId,
      speaker,
      transcriptMessages: input.state.messages,
    // Provider-specific function removed);

    const turnResult = await executeAgentTurnLifecycle({
      agentRuntime: input.agentRuntime,
      state: input.state,
      speakerProfile: speaker,
      speakerId: speaker.id,
      speakerName: context.speakerName,
      speakerRole: speaker.description,
      round: input.round,
      context,
      customCharacters: input.customCharacters,
      config,
    // Provider-specific function removed);

    applyTurnResultToState({
      state: input.state,
      turnResult,
      customCharacters: input.customCharacters,
    // Provider-specific function removed);
  // Provider-specific function removed

  return input.state;
// Provider-specific function removed

export interface ExecuteLifecycleWorkflowInput {
  agentRuntime: AgentRuntime;
  state: ChatroomState;
  startRound: number;
  rounds: number;
  speakers: AgentProfile<ChatroomAgentContext, 'text'>[];
  roomId?: string;
  customCharacters?: RoleplayCharacterCard[];
  config?: Partial<AgentTurnExecutionConfig>;
  onRoundComplete?: (round: number, state: ChatroomState) => void | Promise<void>;
// Provider-specific function removed

export async function executeLifecycleWorkflow(
  input: ExecuteLifecycleWorkflowInput,
): Promise<ChatroomState> {
  let state = input.state;

  for (let round = input.startRound; round < input.startRound + input.rounds; round++) {
    state = await executeLifecycleRound({
      agentRuntime: input.agentRuntime,
      state,
      round,
      speakers: input.speakers,
      roomId: input.roomId,
      customCharacters: input.customCharacters,
      config: input.config,
    // Provider-specific function removed);

  ***REMOVED***input.onRoundComplete) {
      await input.onRoundComplete(round, state);
    // Provider-specific function removed
  // Provider-specific function removed

  return state;
// Provider-specific function removed
