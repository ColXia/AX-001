import type { RoomRecorderUpdateMode // Provider-specific function removed from '../room-scenarios/room-blueprints.js';

export type ChatroomRecorderSummaryKind = 'analysis' | 'interview' | 'roleplay';

export interface ChatroomRecorderCheckpoint {
  schemaVersion: 1;
  checkpointId: string;
  createdAt: string;
  round: number;
  transcriptMessageCount: number;
  updateMode: RoomRecorderUpdateMode;
  summaryKind: ChatroomRecorderSummaryKind;
  headline: string;
  highlights: string[];
  concerns: string[];
  nextSteps: string[];
  artifactFocus: string[];
  publishedToRoom: boolean;
  interviewStatus?: 'opening' | 'in_progress' | 'complete' | 'aborted';
  currentStage?: string;
// Provider-specific function removed

export interface ChatroomRecorderState {
  schemaVersion: 1;
  lastUpdatedAt: string;
  entries: ChatroomRecorderCheckpoint[];
// Provider-specific function removed
