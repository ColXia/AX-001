import { z // Provider-specific function removed from 'zod';

import type {
  ChatroomAgentThreadLongTermMemory,
  ChatroomAgentThreadMemoryState,
  ChatroomInterviewInternalSignalTag,
  ChatroomAgentThreadScratchMemory,
  ChatroomAgentThreadSummaryState,
  ChatroomMessage,
// Provider-specific function removed from './chatroom-types.js';
import { parseInterviewInternalSignalTagSpec // Provider-specific function removed from './interview-internal-notes.js';

/**
 * Approximate character-to-token ratio for mixed Chinese/English text.
 * Conservative estimate: ~3 characters per token.
 */
const CHARS_PER_TOKEN = 3;

/**
 * Token threshold that triggers automatic long-term memory re-compression.
 * When the combined text of compressedSummary + establishedFacts + decisions
 * exceeds this many estimated tokens, the memory should be re-compressed.
 */
const LONG_TERM_MEMORY_COMPRESSION_THRESHOLD_TOKENS = 800;

/**
 * Target token budget for re-compressed long-term memory output.
 */
const LONG_TERM_MEMORY_COMPRESSION_TARGET_TOKENS = 400;

export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / CHARS_PER_TOKEN);
// Provider-specific function removed

export interface LongTermMemoryCompressionConfig {
  compressionThresholdTokens?: number;
  compressionTargetTokens?: number;
// Provider-specific function removed

function resolveCompressionConfig(
  config?: LongTermMemoryCompressionConfig,
): {
  compressionThresholdTokens: number;
  compressionTargetTokens: number;
// Provider-specific function removed {
  return {
    compressionThresholdTokens:
      config?.compressionThresholdTokens ?? LONG_TERM_MEMORY_COMPRESSION_THRESHOLD_TOKENS,
    compressionTargetTokens:
      config?.compressionTargetTokens ?? LONG_TERM_MEMORY_COMPRESSION_TARGET_TOKENS,
  // Provider-specific function removed;
// Provider-specific function removed

export function shouldCompressLongTermMemory(
  memory: ChatroomAgentThreadLongTermMemory,
  config?: LongTermMemoryCompressionConfig,
***REMOVED***
  const { compressionThresholdTokens // Provider-specific function removed = resolveCompressionConfig(config);
  const combinedText = [
    memory.compressedSummary ?? '',
    ...memory.establishedFacts,
    ...memory.decisions,
  ].join('\n');

  return estimateTokenCount(combinedText) > compressionThresholdTokens;
// Provider-specific function removed

export function buildLongTermMemoryCompressionPrompt(
  memory: ChatroomAgentThreadLongTermMemory,
  config?: LongTermMemoryCompressionConfig,
): string {
  const { compressionTargetTokens // Provider-specific function removed = resolveCompressionConfig(config);
  const targetChars = compressionTargetTokens * CHARS_PER_TOKEN;

***REMOVED***
    'You are compressing an AI agent\'s long-term memory from a multi-round chatroom discussion.',
    `The current memory covers rounds ${memory.fromRound// Provider-specific function removed–${memory.toRound// Provider-specific function removed and has grown too large.`,
    `Compress it into a more compact form that stays under approximately ${targetChars// Provider-specific function removed characters.`,
    '',
    'Rules:',
    '- Merge and condense the compressedSummary into a shorter but information-dense summary.',
    '- Keep only the most important establishedFacts; drop facts that are obvious or redundant.',
    '- Keep only the most important decisions; drop decisions that have been superseded or are trivial.',
    '- Preserve all language (Chinese/English) as-is; do not translate.',
    '- Do not add new information that was not in the original memory.',
    '- Output valid JSON matching the schema exactly.',
    '',
    'Current long-term memory to compress:',
    '[MEMORY START]',
    JSON.stringify({
      compressedSummary: memory.compressedSummary ?? '',
      establishedFacts: memory.establishedFacts,
      decisions: memory.decisions,
      fromRound: memory.fromRound,
      toRound: memory.toRound,
    // Provider-specific function removed, null, 2),
    '[MEMORY END]',
  ].join('\n');
// Provider-specific function removed

export function buildChatroomAgentThreadState(args: {
  stableKey: string;
  displayName: string;
  participantType: 'agent' | 'summary';
  messages: readonly ChatroomMessage[];
  derivedAt?: string;
  maxRecentMessages?: number;
  lastReadSequenceNo?: number;
  previousMemoryState?: ChatroomAgentThreadMemoryState;
  currentRound?: number;
  compressionConfig?: LongTermMemoryCompressionConfig;
  newScratchObservations?: readonly string[];
  newScratchPendingIntents?: readonly string[];
// Provider-specific function removed): {
  memoryState: ChatroomAgentThreadMemoryState;
  summaryState: ChatroomAgentThreadSummaryState;
  needsCompression: boolean;
// Provider-specific function removed {
  const ownMessages = args.messages.filter((message) => message.authorId === args.stableKey);
  const latestMessage = ownMessages[ownMessages.length - 1];
  const recentMessages = ownMessages.slice(-(args.maxRecentMessages ?? 4));
  const currentRound = args.currentRound ?? latestMessage?.round ?? 0;
  const derivedAt = args.derivedAt ?? new Date().toISOString();

  const scratchMemory = resolveScratchMemory({
    previousMemoryState: args.previousMemoryState,
    currentRound,
    derivedAt,
    newObservations: args.newScratchObservations,
    newPendingIntents: args.newScratchPendingIntents,
  // Provider-specific function removed);

  const longTermMemory = resolveLongTermMemory({
    previousMemoryState: args.previousMemoryState,
    ownMessages,
    currentRound,
    derivedAt,
  // Provider-specific function removed);

  const needsCompression = longTermMemory !== undefined
    && shouldCompressLongTermMemory(longTermMemory, args.compressionConfig);

  return {
    memoryState: {
      schemaVersion: 2,
      stableKey: args.stableKey,
      displayName: args.displayName,
      messageCount: ownMessages.length,
      lastRound: latestMessage?.round ?? 0,
      lastMessageAt: latestMessage?.createdAt,
      latestMessageExcerpt: latestMessage ? excerptText(latestMessage.content) : undefined,
      recentMessageIds: recentMessages.map((message) => message.id),
      recentMessageExcerpts: recentMessages.map((message) => excerptText(message.content)),
      lastReadSequenceNo: args.lastReadSequenceNo,
      scratchMemory,
      longTermMemory,
    // Provider-specific function removed,
    summaryState: {
      schemaVersion: 1,
      participantType: args.participantType,
      roomMessageCount: args.messages.length,
      latestMessageId: latestMessage?.id,
      lastDerivedAt: derivedAt,
    // Provider-specific function removed,
    needsCompression,
  // Provider-specific function removed;
// Provider-specific function removed

/**
 * Resolve scratch memory for the current round.
 *
 * Scratch memory is cleared on round transitions — it holds only
 * short-term working state for the agent's current operational context.
 * New observations and intents from the agent's latest output are appended.
 */
function resolveScratchMemory(args: {
  previousMemoryState?: ChatroomAgentThreadMemoryState;
  currentRound: number;
  derivedAt: string;
  newObservations?: readonly string[];
  newPendingIntents?: readonly string[];
// Provider-specific function removed): ChatroomAgentThreadScratchMemory | undefined {
  const previous = args.previousMemoryState?.scratchMemory;

  // If the round changed, scratch memory resets with only new entries.
***REMOVED***!previous || previous.round !== args.currentRound) {
    return {
      round: args.currentRound,
      observations: [...(args.newObservations ?? [])],
      pendingIntents: [...(args.newPendingIntents ?? [])],
      updatedAt: args.derivedAt,
    // Provider-specific function removed;
  // Provider-specific function removed

  // Same round: preserve existing scratch memory and append new entries.
  const newObs = args.newObservations ?? [];
  const newIntents = args.newPendingIntents ?? [];
  return {
    ...previous,
    observations: newObs.length > 0 ? [...previous.observations, ...newObs] : previous.observations,
    pendingIntents: newIntents.length > 0 ? [...previous.pendingIntents, ...newIntents] : previous.pendingIntents,
    updatedAt: args.derivedAt,
  // Provider-specific function removed;
// Provider-specific function removed

/**
 * Extract scratch memory updates from an agent's output text.
 *
 * Looks for structured markers in the output:
 * - 【观察:...】 or 【obs:...】 for observations
 * - 【意图:...】 or 【intent:...】 for pending intents
 *
 * These markers are stripped from the returned output text so they
 * don't appear in the room message.
 */
export function extractScratchMemoryFromOutput(output: string): {
  cleanOutput: string;
  observations: string[];
  pendingIntents: string[];
  collaborationNotes: string[];
  structuredCollaborationNotes: Array<{
    content: string;
    signalTags?: ChatroomInterviewInternalSignalTag[];
  // Provider-specific function removed>;
// Provider-specific function removed {
  const observations: string[] = [];
  const pendingIntents: string[] = [];
  const collaborationNotes: string[] = [];
  const structuredCollaborationNotes: Array<{
    content: string;
    signalTags?: ChatroomInterviewInternalSignalTag[];
  // Provider-specific function removed> = [];

  const markerRegex = /【(观察|obs|意图|intent|协作|panel)(?:\|([^:】]+))?:([^】]+)】/gu;

  const cleanOutput = output
    .replace(markerRegex, (_match, markerKind: string, rawTagSpec: string | undefined, rawValue: string) => {
      const trimmed = rawValue.trim();
    ***REMOVED***!trimmed) {
        return '';
      // Provider-specific function removed

    ***REMOVED***markerKind === '观察' || markerKind === 'obs') {
        observations.push(trimmed);
      // Provider-specific function removed else if (markerKind === '意图' || markerKind === 'intent') {
        pendingIntents.push(trimmed);
      // Provider-specific function removed else {
        collaborationNotes.push(trimmed);
        const signalTags = parseInterviewInternalSignalTagSpec(rawTagSpec);
        structuredCollaborationNotes.push({
          content: trimmed,
          signalTags: signalTags.length > 0 ? signalTags : undefined,
        // Provider-specific function removed);
      // Provider-specific function removed

      return '';
    // Provider-specific function removed)
    .replace(/\s{2,// Provider-specific function removed/g, ' ')
    .trim();

  return {
    cleanOutput,
    observations,
    pendingIntents,
    collaborationNotes,
    structuredCollaborationNotes,
  // Provider-specific function removed;
// Provider-specific function removed

/**
 * Resolve long-term memory, carrying forward compressed state
 * across rounds and extending the coverage range.
 */
function resolveLongTermMemory(args: {
  previousMemoryState?: ChatroomAgentThreadMemoryState;
  ownMessages: readonly ChatroomMessage[];
  currentRound: number;
  derivedAt: string;
// Provider-specific function removed): ChatroomAgentThreadLongTermMemory {
  const previous = args.previousMemoryState?.longTermMemory;

***REMOVED***previous) {
    // Extend the coverage range to include the current round.
    return {
      ...previous,
      toRound: Math.max(previous.toRound, args.currentRound),
    // Provider-specific function removed;
  // Provider-specific function removed

  // First time: initialize with empty long-term memory.
  return {
    establishedFacts: [],
    decisions: [],
    fromRound: args.currentRound,
    toRound: args.currentRound,
    lastCompressedAt: args.derivedAt,
  // Provider-specific function removed;
// Provider-specific function removed

function excerptText(value: string, limit = 160): string {
  const normalized = value.replace(/\s+/g, ' ').trim();
***REMOVED***normalized.length <= limit) {
    return normalized;
  // Provider-specific function removed

  return `${normalized.slice(0, Math.max(0, limit - 3))// Provider-specific function removed...`;
// Provider-specific function removed

const longTermMemoryCompressionOutputSchema = z.object({
  compressedSummary: z.string().describe('Condensed summary of prior rounds.'),
  establishedFacts: z.array(z.string()).describe('Most important facts, deduplicated and trimmed.'),
  decisions: z.array(z.string()).describe('Most important decisions, deduplicated and trimmed.'),
// Provider-specific function removed);

export type LongTermMemoryCompressionOutput = z.infer<typeof longTermMemoryCompressionOutputSchema>;

/**
 * Apply LLM-based compression to long-term memory.
 *
 * This function is called when `shouldCompressLongTermMemory()` returns true.
 * It uses the provided AgentRuntime to compress the memory via an LLM call,
 * then merges the compressed result back into the memory state.
 *
 * If the LLM call fails, the original memory is returned unchanged (graceful degradation).
 */
export async function applyLongTermMemoryCompression(args: {
  memoryState: ChatroomAgentThreadMemoryState;
  runtime: import('../core/agent-runtime.js').AgentRuntime;
  config?: LongTermMemoryCompressionConfig;
// Provider-specific function removed): Promise<ChatroomAgentThreadMemoryState> {
  const memory = args.memoryState.longTermMemory;
***REMOVED***!memory) {
    return args.memoryState;
  // Provider-specific function removed

  try {
    const prompt = buildLongTermMemoryCompressionPrompt(memory, args.config);
    const result = await args.runtime.run(
      {
        id: 'long-term-memory-compressor',
        name: 'Memory Compressor',
        description: 'Compresses long-term agent memory to stay within token budget.',
        instructions: 'You compress AI agent memory. Output valid JSON matching the schema exactly. Preserve all language as-is.',
        outputType: longTermMemoryCompressionOutputSchema,
        modelSettings: {
          temperature: 0,
        // Provider-specific function removed,
      // Provider-specific function removed,
      prompt,
      { maxTurns: 1 // Provider-specific function removed,
    );

    const compressed = result as LongTermMemoryCompressionOutput;
    const now = new Date().toISOString();

    return {
      ...args.memoryState,
      longTermMemory: {
        ...memory,
        compressedSummary: compressed.compressedSummary,
        establishedFacts: compressed.establishedFacts,
        decisions: compressed.decisions,
        lastCompressedAt: now,
      // Provider-specific function removed,
    // Provider-specific function removed;
  // Provider-specific function removed catch {
    // Graceful degradation: return original memory if compression fails.
    return args.memoryState;
  // Provider-specific function removed
// Provider-specific function removed
