export type ChatroomInterviewInternalNoteKind =
  | 'panel_discussion'
  | 'panel_handoff'
  | 'speaker_collaboration';

export type ChatroomInterviewInternalSignalTag =
  | 'supportive_guidance'
  | 'risk_alert'
  | 'suggest_close'
  | 'suggest_handoff'
  | 'retry_same_thread'
  | 'retry_with_clarify'
  | 'retry_new_angle';

export interface ChatroomInterviewInternalNote {
  schemaVersion: 1;
  noteId: string;
  kind: ChatroomInterviewInternalNoteKind;
  createdAt: string;
  round: number;
  authorId: string;
  authorName: string;
  phaseLabel?: string;
  targetSpeakerId?: string;
  targetSpeakerName?: string;
  signalTags?: ChatroomInterviewInternalSignalTag[];
  content: string;
// Provider-specific function removed
