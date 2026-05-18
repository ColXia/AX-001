import type { Character // Provider-specific function removed from '../room-core/character-types.js';
import type { PrivateSessionMessage // Provider-specific function removed from '../room-core/private-session-types.js';

export interface DormantCheckResult {
  characterId: string;
  shouldActivate: boolean;
  activationReason?: 'private_message' | 'scene_event' | 'host_command';
  reason?: string;
// Provider-specific function removed

export interface DormantCheckConfig {
  characters: Character[];
  round: number;
// Provider-specific function removed

export function checkDormantCharacters(
  config: DormantCheckConfig
): DormantCheckResult[] {
  const dormantCharacters = config.characters.filter(
    c => c.activityStatus === 'dormant'
  );
  
  return dormantCharacters.map(character =>
    checkSingleDormantCharacter(character, config.round)
  );
// Provider-specific function removed

export function checkSingleDormantCharacter(
  character: Character,
  round: number
): DormantCheckResult {
  const newMessages = character.pendingPrivateMessages.filter(
    m => m.round > character.lastSeenRound
  );
  
***REMOVED***newMessages.length === 0) {
    return {
      characterId: character.characterId,
      shouldActivate: false,
    // Provider-specific function removed;
  // Provider-specific function removed
  
  const ruleResult = checkActivationRules(character, newMessages);
  
***REMOVED***ruleResult !== 'uncertain') {
    return {
      characterId: character.characterId,
      shouldActivate: ruleResult === 'activate',
      activationReason: 'private_message',
      reason: ruleResult === 'activate' ? 'Rule-based activation' : undefined,
    // Provider-specific function removed;
  // Provider-specific function removed
  
  return {
    characterId: character.characterId,
    shouldActivate: false,
    reason: 'Uncertain - needs LLM judgment',
  // Provider-specific function removed;
// Provider-specific function removed

export function checkActivationRules(
  character: Character,
  messages: PrivateSessionMessage[]
): 'activate' | 'deactivate' | 'uncertain' {
  const content = messages.map(m => m.content).join(' ');
  
  const urgentKeywords = /紧急|危险|救命|快|重要|立刻|马上/;
***REMOVED***urgentKeywords.test(content)) {
    return 'activate';
  // Provider-specific function removed
  
  const inviteKeywords = /来|进来|一起|加入|出现|到场/;
***REMOVED***inviteKeywords.test(content)) {
    return 'activate';
  // Provider-specific function removed
  
  const namePattern = new RegExp(character.name, 'i');
***REMOVED***namePattern.test(content)) {
    return 'activate';
  // Provider-specific function removed
  
  const casualKeywords = /你好|在吗|怎么样|最近|还好/;
***REMOVED***casualKeywords.test(content)) {
    return 'deactivate';
  // Provider-specific function removed
  
  const ackKeywords = /好的|收到|明白|了解|嗯|哦/;
***REMOVED***ackKeywords.test(content)) {
    return 'deactivate';
  // Provider-specific function removed
  
  return 'uncertain';
// Provider-specific function removed

export function batchCheckDormantCharacters(
  characters: Character[],
  round: number
): Map<string, DormantCheckResult> {
  const results = new Map<string, DormantCheckResult>();
  
  for (const character of characters) {
  ***REMOVED***character.activityStatus === 'dormant') {
      const result = checkSingleDormantCharacter(character, round);
      results.set(character.characterId, result);
    // Provider-specific function removed
  // Provider-specific function removed
  
  return results;
// Provider-specific function removed

export function getCharactersToActivate(
  results: Map<string, DormantCheckResult>
): string[] {
  return Array.from(results.entries())
    .filter(([_, result]) => result.shouldActivate)
    .map(([characterId]) => characterId);
// Provider-specific function removed

export function getCharactersToKeepDormant(
  results: Map<string, DormantCheckResult>
): string[] {
  return Array.from(results.entries())
    .filter(([_, result]) => !result.shouldActivate)
    .map(([characterId]) => characterId);
// Provider-specific function removed

export function summarizeDormantCheckResults(
  results: DormantCheckResult[]
): {
  totalChecked: number;
  toActivate: number;
  toKeepDormant: number;
  uncertain: number;
// Provider-specific function removed {
  const toActivate = results.filter(r => r.shouldActivate).length;
  const uncertain = results.filter(
    r => !r.shouldActivate && r.reason === 'Uncertain - needs LLM judgment'
  ).length;
  const toKeepDormant = results.length - toActivate - uncertain;
  
  return {
    totalChecked: results.length,
    toActivate,
    toKeepDormant,
    uncertain,
  // Provider-specific function removed;
// Provider-specific function removed

export function shouldUseLightweightLLMCheck(
  character: Character,
  messages: PrivateSessionMessage[]
***REMOVED***
***REMOVED***messages.length === 0) {
    return false;
  // Provider-specific function removed
  
***REMOVED***messages.length > 5) {
    return true;
  // Provider-specific function removed
  
  const hasComplexContent = messages.some(m =>
    m.content.length > 100 || m.content.includes('?') || m.content.includes('？')
  );
  
  return hasComplexContent;
// Provider-specific function removed

export function createLightweightActivationPrompt(
  character: Character,
  messages: PrivateSessionMessage[]
): string {
  const messageSummary = messages
    .map((m: PrivateSessionMessage) => `[${m.speakerName// Provider-specific function removed]: ${m.content// Provider-specific function removed`)
    .join('\n');
  
  return `角色 ${character.name// Provider-specific function removed 收到以下私人消息：
${messageSummary// Provider-specific function removed

请判断：
1. 这些消息是否需要角色进入场景公开回应？
2. 如果需要，理由是什么？

输出格式：
{ "shouldActivate": boolean, "reason": string // Provider-specific function removed`;
// Provider-specific function removed