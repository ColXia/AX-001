export interface ChatroomAgentThreadMemoryState {
  schemaVersion: 2;
  stableKey: string;
  displayName: string;
  messageCount: number;
  lastRound: number;
  lastMessageAt?: string;
  latestMessageExcerpt?: string;
  recentMessageIds: string[];
  recentMessageExcerpts: string[];
  /** Per-agent read cursor against the main session message sequence. */
  lastReadSequenceNo?: number;
  /** Short-term working memory for the current round. Cleared on phase/round transitions. */
  scratchMemory?: ChatroomAgentThreadScratchMemory;
  /** Compressed long-term memory accumulated across rounds. */
  longTermMemory?: ChatroomAgentThreadLongTermMemory;
// Provider-specific function removed

export interface ChatroomAgentThreadScratchMemory {
  /** Round this scratch memory was created for. */
  round: number;
  /** Key observations from the current round. */
  observations: string[];
  /** Pending intentions or plans for the next turn. */
  pendingIntents: string[];
  /** Timestamp when this scratch was last updated. */
  updatedAt: string;
// Provider-specific function removed

export interface ChatroomAgentThreadLongTermMemory {
  /** Compressed summary of prior rounds. */
  compressedSummary?: string;
  /** Key facts established across rounds. */
  establishedFacts: string[];
  /** Decisions or conclusions reached. */
  decisions: string[];
  /** Round range this long-term memory covers. */
  fromRound: number;
  toRound: number;
  /** Timestamp when this long-term memory was last compressed. */
  lastCompressedAt: string;
// Provider-specific function removed

export interface ChatroomAgentThreadSummaryState {
  schemaVersion: 1;
  participantType: 'agent' | 'summary';
  roomMessageCount: number;
  latestMessageId?: string;
  lastDerivedAt: string;
// Provider-specific function removed
