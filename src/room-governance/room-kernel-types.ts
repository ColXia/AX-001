import type { RoomRuntimeMode // Provider-specific function removed from '../workflows/room-runtime-mode.js';

export type ChatroomRoomKernelAction =
  | 'observe'
  | 'guide_room_admin'
  | 'hold'
  | 'terminate_interview'
  | 'retry'
  | 'skip_phase'
  | 'advance_phase';

export interface ChatroomRoomKernelDirective {
  schemaVersion: 1;
  directiveId: string;
  createdAt: string;
  round: number;
  transcriptMessageCount: number;
  runtimeMode: RoomRuntimeMode;
  action: ChatroomRoomKernelAction;
  phaseLabel: string;
  summary: string;
  blockers: string[];
  recommendedInstruction: string;
  shouldEscalateRoomAdmin: boolean;
  targetSpeakerId: string;
  targetPromptMessageId: string;
  confidence: number;
// Provider-specific function removed

export interface ChatroomRoomKernelState {
  schemaVersion: 1;
  lastUpdatedAt: string;
  currentDirective?: ChatroomRoomKernelDirective;
  history: ChatroomRoomKernelDirective[];
// Provider-specific function removed
