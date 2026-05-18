import type { RoomAdminInterventionStyle // Provider-specific function removed from '../room-scenarios/room-blueprints.js';

export type ChatroomRoomAdminAction =
  | 'idle'
  | 'set_phase'
  | 'inject_event'
  | 'set_phase_and_event'
  | 'hold_interview'
  | 'skip_phase'
  | 'request_answer_retry'
  | 'complete_interview';

export interface ChatroomRoomAdminParticipantAddition {
  name: string;
  instruction: string;
// Provider-specific function removed

export interface ChatroomRoomAdminDirective {
  schemaVersion: 1;
  directiveId: string;
  createdAt: string;
  round: number;
  transcriptMessageCount: number;
  interventionStyle: RoomAdminInterventionStyle;
  action: ChatroomRoomAdminAction;
  visibility: 'hidden' | 'visible';
  phaseLabel: string;
  phaseObjective: string;
  eventLabel: string;
  eventMessage: string;
  targetSpeakerId: string;
  targetPromptMessageId: string;
  responseMode: 'new_question' | 'clarify';
  terminalStatus?: 'complete' | 'aborted';
  instruction: string;
  reason: string;
  participantAdditions: ChatroomRoomAdminParticipantAddition[];
// Provider-specific function removed

export interface ChatroomRoomAdminState {
  schemaVersion: 1;
  lastUpdatedAt: string;
  currentDirective?: ChatroomRoomAdminDirective;
  currentPhaseLabel?: string;
  currentPhaseObjective?: string;
  history: ChatroomRoomAdminDirective[];
// Provider-specific function removed
