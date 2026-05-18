import type { Character // Provider-specific function removed from '../room-core/character-types.js';
import {
  type AgentInstance,
  type AgentPoolConfig,
  type AgentPoolState,
  type AssignmentPlan,
  type AgentAssignment,
  DEFAULT_AGENT_POOL_CONFIG,
  createAgentInstance,
  isAgentAvailable,
  resetAgentForNewRound,
  assignCharacterToAgent,
  computeOptimalAgentCount,
  distributeCharactersToAgents,
// Provider-specific function removed from '../room-core/agent-pool-types.js';
import type { ExecutionSequence // Provider-specific function removed from '../room-core/execution-sequence-types.js';

export class AgentPool {
  private state: AgentPoolState;

  constructor(config: Partial<AgentPoolConfig> = {// Provider-specific function removed) {
    this.state = {
      config: { ...DEFAULT_AGENT_POOL_CONFIG, ...config // Provider-specific function removed,
      agents: [],
      currentRound: 0,
      currentPlan: undefined,
    // Provider-specific function removed;
    
    this.initializeAgents();
  // Provider-specific function removed

  private initializeAgents(): void {
    const count = this.state.config.minAgents;
    this.state.agents = [];
    
    for (let i = 0; i < count; i++) {
      this.state.agents.push(createAgentInstance(`agent-${i + 1// Provider-specific function removed`));
    // Provider-specific function removed
  // Provider-specific function removed

  getConfig(): AgentPoolConfig {
    return { ...this.state.config // Provider-specific function removed;
  // Provider-specific function removed

  getAgents(): AgentInstance[] {
  ***REMOVED***...this.state.agents];
  // Provider-specific function removed

  getAgent(agentId: string): AgentInstance | undefined {
    return this.state.agents.find((a: AgentInstance) => a.agentId === agentId);
  // Provider-specific function removed

  adjustPool(apiConcurrencyLimit: number): void {
    const targetCount = Math.min(
      apiConcurrencyLimit,
      this.state.config.maxAgents
    );
    
    const currentCount = this.state.agents.length;
    
  ***REMOVED***currentCount < targetCount) {
      for (let i = currentCount; i < targetCount; i++) {
        this.state.agents.push(createAgentInstance(`agent-${i + 1// Provider-specific function removed`));
      // Provider-specific function removed
    // Provider-specific function removed else if (currentCount > targetCount) {
      const idleAgents = this.state.agents.filter(isAgentAvailable);
      const toRemove = currentCount - targetCount;
      
    ***REMOVED***idleAgents.length >= toRemove) {
        const removeIds = idleAgents.slice(0, toRemove).map((a: AgentInstance) => a.agentId);
        this.state.agents = this.state.agents.filter(
          (a: AgentInstance) => !removeIds.includes(a.agentId)
        );
      // Provider-specific function removed
    // Provider-specific function removed
  // Provider-specific function removed

  assignCharacters(
    characters: Character[],
    sequence: ExecutionSequence,
    round: number
  ): AssignmentPlan {
    const activeCharacters = characters.filter((c: Character) => c.activityStatus === 'active');
    const characterIds = activeCharacters.map((c: Character) => c.characterId);
    
    const optimalCount = computeOptimalAgentCount(
      activeCharacters.length,
      this.state.config
    );
    
  ***REMOVED***this.state.agents.length !== optimalCount) {
      this.adjustPool(optimalCount);
    // Provider-specific function removed
    
    this.state.agents = this.state.agents.map(resetAgentForNewRound);
    
    const sortedCharacterIds = this.sortBySequence(characterIds, sequence);
    
    const distributions = distributeCharactersToAgents(
      sortedCharacterIds,
      this.state.agents.length
    );
    
    this.state.agents.forEach((agent: AgentInstance, index: number) => {
      const assigned = distributions[index] ?? [];
      assigned.forEach((characterId: string) => {
        this.state.agents[index] = assignCharacterToAgent(
          this.state.agents[index]!,
          characterId
        );
      // Provider-specific function removed);
    // Provider-specific function removed);
    
    const assignments: AgentAssignment[] = this.state.agents.map((agent: AgentInstance, index: number) => ({
      agentId: agent.agentId,
      characterIds: distributions[index] ?? [],
      estimatedCost: (distributions[index] ?? []).length * 1000,
    // Provider-specific function removed));
    
    const maxCharactersPerAgent = Math.max(...assignments.map((a: AgentAssignment) => a.characterIds.length));
    const estimatedDurationMs = maxCharactersPerAgent * 3000;
    
    const plan: AssignmentPlan = {
      round,
      assignments,
      totalCharacters: sortedCharacterIds.length,
      totalAgents: this.state.agents.length,
      estimatedDurationMs,
    // Provider-specific function removed;
    
    this.state.currentRound = round;
    this.state.currentPlan = plan;
    
    return plan;
  // Provider-specific function removed

  private sortBySequence(
    characterIds: string[],
    sequence: ExecutionSequence
  ): string[] {
    const positionMap = new Map(
      sequence.entries.map((e) => [e.characterId, e.position])
    );
    
  ***REMOVED***...characterIds].sort((a: string, b: string) => {
      const posA = positionMap.get(a) ?? Infinity;
      const posB = positionMap.get(b) ?? Infinity;
      return posA - posB;
    // Provider-specific function removed);
  // Provider-specific function removed

  getAvailableAgent(): AgentInstance | null {
    return this.state.agents.find(isAgentAvailable) ?? null;
  // Provider-specific function removed

  setAgentBusy(agentId: string, characterId: string): void {
    const index = this.state.agents.findIndex((a: AgentInstance) => a.agentId === agentId);
  ***REMOVED***index !== -1) {
      this.state.agents[index] = {
        ...this.state.agents[index]!,
        status: 'busy',
        currentCharacterId: characterId,
      // Provider-specific function removed;
    // Provider-specific function removed
  // Provider-specific function removed

  completeAgentWork(
    agentId: string,
    characterId: string,
    latencyMs: number
  ): void {
    const index = this.state.agents.findIndex((a: AgentInstance) => a.agentId === agentId);
  ***REMOVED***index !== -1) {
      const agent = this.state.agents[index]!;
      const newTotal = agent.totalTurnsExecuted + 1;
      const newAverage =
        (agent.averageLatencyMs * agent.totalTurnsExecuted + latencyMs) / newTotal;
      
      this.state.agents[index] = {
        ...agent,
        completedCharacterIds: [...agent.completedCharacterIds, characterId],
        currentCharacterId: undefined,
        totalTurnsExecuted: newTotal,
        averageLatencyMs: newAverage,
      // Provider-specific function removed;
    // Provider-specific function removed
  // Provider-specific function removed

  releaseAgent(agentId: string): void {
    const index = this.state.agents.findIndex((a: AgentInstance) => a.agentId === agentId);
  ***REMOVED***index !== -1) {
      const agent = this.state.agents[index]!;
      const allCompleted =
        agent.assignedCharacterIds.every((id: string) =>
          agent.completedCharacterIds.includes(id)
        );
      
      this.state.agents[index] = {
        ...agent,
        status: allCompleted ? 'idle' : agent.status,
        currentCharacterId: undefined,
      // Provider-specific function removed;
    // Provider-specific function removed
  // Provider-specific function removed

  setAgentError(agentId: string, error: string): void {
    const index = this.state.agents.findIndex((a: AgentInstance) => a.agentId === agentId);
  ***REMOVED***index !== -1) {
      this.state.agents[index] = {
        ...this.state.agents[index]!,
        status: 'error',
        lastError: error,
        currentCharacterId: undefined,
      // Provider-specific function removed;
    // Provider-specific function removed
  // Provider-specific function removed

  getCurrentPlan(): AssignmentPlan | undefined {
    return this.state.currentPlan;
  // Provider-specific function removed

  getCurrentRound(): number {
    return this.state.currentRound;
  // Provider-specific function removed

  getStats(): {
    totalAgents: number;
    idleAgents: number;
    busyAgents: number;
    errorAgents: number;
    totalTurnsExecuted: number;
    averageLatencyMs: number;
  // Provider-specific function removed {
    const idleAgents = this.state.agents.filter((a: AgentInstance) => a.status === 'idle').length;
    const busyAgents = this.state.agents.filter((a: AgentInstance) => a.status === 'busy').length;
    const errorAgents = this.state.agents.filter((a: AgentInstance) => a.status === 'error').length;
    
    const totalTurns = this.state.agents.reduce(
      (sum: number, a: AgentInstance) => sum + a.totalTurnsExecuted,
      0
    );
    
    const agentsWithTurns = this.state.agents.filter((a: AgentInstance) => a.totalTurnsExecuted > 0);
    const avgLatency =
      agentsWithTurns.length > 0
        ? agentsWithTurns.reduce((sum: number, a: AgentInstance) => sum + a.averageLatencyMs, 0) /
          agentsWithTurns.length
        : 0;
    
    return {
      totalAgents: this.state.agents.length,
      idleAgents,
      busyAgents,
      errorAgents,
      totalTurnsExecuted: totalTurns,
      averageLatencyMs: avgLatency,
    // Provider-specific function removed;
  // Provider-specific function removed
// Provider-specific function removed
