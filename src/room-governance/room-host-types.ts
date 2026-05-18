import type { RoomHostModerationStyle // Provider-specific function removed from '../room-scenarios/room-blueprints.js';

export type ChatroomHostDirectiveAction = 'idle' | 'guide' | 'intervene';
export type ChatroomHostDirectiveVisibility = 'hidden' | 'visible';

export interface ChatroomHostDirective {
  schemaVersion: 1;
  directiveId: string;
  createdAt: string;
  round: number;
  transcriptMessageCount: number;
  moderationStyle: RoomHostModerationStyle;
  action: ChatroomHostDirectiveAction;
  visibility: ChatroomHostDirectiveVisibility;
  headline: string;
  focus: string;
  instruction: string;
  reason: string;
// Provider-specific function removed

export interface ChatroomHostState {
  schemaVersion: 1;
  lastUpdatedAt: string;
  currentDirective?: ChatroomHostDirective;
  history: ChatroomHostDirective[];
// Provider-specific function removed
