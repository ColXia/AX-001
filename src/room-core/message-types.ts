export type ChatroomMessageRole = 'system' | 'user' | 'agent' | 'summary';

export interface ChatroomMessage {
  id: string;
  role: ChatroomMessageRole;
  authorId: string;
  authorName: string;
  participantId?: string;
  agentThreadId?: string;
  round: number;
  createdAt: string;
  content: string;
// Provider-specific function removed
