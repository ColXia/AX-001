import type { Character // Provider-specific function removed from './character-types.js';

export type AgentStatus = 'idle' | 'busy' | 'error';

export interface AgentInstance {
  agentId: string;
  status: AgentStatus;
  assignedCharacterIds: string[];
  currentCharacterId?: string;
  completedCharacterIds: string[];
  totalTurnsExecuted: number;
  averageLatencyMs: number;
  lastError?: string;
  createdAt: string;
// Provider-specific function removed

export interface AgentPoolConfig {
  maxConcurrency: number;
  minAgents: number;
  maxAgents: number;
  charactersPerAgent: number;
// Provider-specific function removed

export interface AssignmentPlan {
  round: number;
  assignments: AgentAssignment[];
  totalCharacters: number;
  totalAgents: number;
  estimatedDurationMs: number;
// Provider-specific function removed

export interface AgentAssignment {
  agentId: string;
  characterIds: string[];
  estimatedCost: number;
// Provider-specific function removed

export interface AgentPoolState {
  config: AgentPoolConfig;
  agents: AgentInstance[];
  currentRound: number;
  currentPlan?: AssignmentPlan;
// Provider-specific function removed

export const DEFAULT_AGENT_POOL_CONFIG: AgentPoolConfig = {
  maxConcurrency: 4,
  minAgents: 1,
  maxAgents: 10,
  charactersPerAgent: 3,
// Provider-specific function removed;

export function createAgentInstance(agentId: string): AgentInstance {
  return {
    agentId,
    status: 'idle',
    assignedCharacterIds: [],
    currentCharacterId: undefined,
    completedCharacterIds: [],
    totalTurnsExecuted: 0,
    averageLatencyMs: 0,
    lastError: undefined,
    createdAt: new Date().toISOString(),
  // Provider-specific function removed;
// Provider-specific function removed

export function isAgentAvailable(agent: AgentInstance***REMOVED***
  return agent.status === 'idle';
// Provider-specific function removed

export function isAgentBusy(agent: AgentInstance***REMOVED***
  return agent.status === 'busy';
// Provider-specific function removed

export function resetAgentForNewRound(agent: AgentInstance): AgentInstance {
  return {
    ...agent,
    assignedCharacterIds: [],
    currentCharacterId: undefined,
    completedCharacterIds: [],
  // Provider-specific function removed;
// Provider-specific function removed

export function assignCharacterToAgent(
  agent: AgentInstance,
  characterId: string
): AgentInstance {
  return {
    ...agent,
    assignedCharacterIds: [...agent.assignedCharacterIds, characterId],
  // Provider-specific function removed;
// Provider-specific function removed

export function startAgentWork(
  agent: AgentInstance,
  characterId: string
): AgentInstance {
  return {
    ...agent,
    status: 'busy',
    currentCharacterId: characterId,
  // Provider-specific function removed;
// Provider-specific function removed

export function completeAgentWork(
  agent: AgentInstance,
  characterId: string,
  latencyMs: number
): AgentInstance {
  const newTotal = agent.totalTurnsExecuted + 1;
  const newAverage = 
    (agent.averageLatencyMs * agent.totalTurnsExecuted + latencyMs) / newTotal;
  
  return {
    ...agent,
    completedCharacterIds: [...agent.completedCharacterIds, characterId],
    currentCharacterId: undefined,
    totalTurnsExecuted: newTotal,
    averageLatencyMs: newAverage,
  // Provider-specific function removed;
// Provider-specific function removed

export function finishAgentRound(agent: AgentInstance): AgentInstance {
  const allCompleted = 
    agent.assignedCharacterIds.every(id => agent.completedCharacterIds.includes(id));
  
  return {
    ...agent,
    status: allCompleted ? 'idle' : agent.status,
    currentCharacterId: undefined,
  // Provider-specific function removed;
// Provider-specific function removed

export function setAgentError(agent: AgentInstance, error: string): AgentInstance {
  return {
    ...agent,
    status: 'error',
    lastError: error,
    currentCharacterId: undefined,
  // Provider-specific function removed;
// Provider-specific function removed

export function computeOptimalAgentCount(
  activeCharacterCount: number,
  config: AgentPoolConfig
): number {
  const byCharacters = Math.ceil(activeCharacterCount / config.charactersPerAgent);
  const byConcurrency = config.maxConcurrency;
  
  return Math.max(
    config.minAgents,
    Math.min(config.maxAgents, Math.min(byCharacters, byConcurrency))
  );
// Provider-specific function removed

export function distributeCharactersToAgents(
  characterIds: string[],
  agentCount: number
): string[][] {
***REMOVED***agentCount === 0) {
  ***REMOVED***];
  // Provider-specific function removed
  
  const result: string[][] = Array.from({ length: agentCount // Provider-specific function removed, () => []);
  
  characterIds.forEach((characterId, index) => {
    const agentIndex = index % agentCount;
    result[agentIndex]!.push(characterId);
  // Provider-specific function removed);
  
  return result;
// Provider-specific function removed

export function createAssignmentPlan(
  characters: Character[],
  agents: AgentInstance[],
  round: number
): AssignmentPlan {
  const activeCharacters = characters.filter(c => c.activityStatus === 'active');
  const characterIds = activeCharacters.map(c => c.characterId);
  
  const distributions = distributeCharactersToAgents(characterIds, agents.length);
  
  const assignments: AgentAssignment[] = agents.map((agent, index) => ({
    agentId: agent.agentId,
    characterIds: distributions[index] ?? [],
    estimatedCost: (distributions[index] ?? []).length * 1000,
  // Provider-specific function removed));
  
  const maxCharactersPerAgent = Math.max(...assignments.map(a => a.characterIds.length));
  const estimatedDurationMs = maxCharactersPerAgent * 3000;
  
  return {
    round,
    assignments,
    totalCharacters: characterIds.length,
    totalAgents: agents.length,
    estimatedDurationMs,
  // Provider-specific function removed;
// Provider-specific function removed
