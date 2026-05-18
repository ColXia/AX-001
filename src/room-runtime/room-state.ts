import type {
  ChatroomFinalSummary,
  InterviewSummary,
// Provider-specific function removed from '../agents/schemas.js';
import type { ChatroomRoomTypeId // Provider-specific function removed from '../workflows/chatroom-room-types.js';
import type {
  RoleplayCharacterTemplate,
  RoleplaySceneState,
// Provider-specific function removed from '../workflows/chatroom-roleplay-state.js';
import type { ChatroomRoomBlueprint // Provider-specific function removed from '../room-scenarios/room-blueprints.js';
import type { RoleplayCharacterCard // Provider-specific function removed from '../room-scenarios/roleplay/roleplay-characters.js';
import type {
  InterviewPendingCandidateReplyState,
  InterviewPhaseState,
// Provider-specific function removed from '../workflows/interview-room-controller.js';
import type { ChatroomInterviewInternalNote // Provider-specific function removed from '../workflows/chatroom-types.js';
import type { ChatroomMessage // Provider-specific function removed from '../room-core/message-types.js';
import type { ChatroomRoomAdminState // Provider-specific function removed from '../room-governance/room-admin-types.js';
import type { ChatroomHostState // Provider-specific function removed from '../room-governance/room-host-types.js';
import type { ChatroomRoomKernelState // Provider-specific function removed from '../room-governance/room-kernel-types.js';
import type { ChatroomRecorderState // Provider-specific function removed from '../room-governance/room-recorder-types.js';
import type { PrivateSession // Provider-specific function removed from '../room-core/private-session-types.js';

export interface ChatroomState {
  roomType: ChatroomRoomTypeId;
  scenarioTemplateId?: ChatroomRoomBlueprint['scenarioTemplateId'];
  /** Persistent runtime mode for this room session. Determines governance and kernel behavior. */
  runtimeMode?: string;
  roomBlueprint?: ChatroomRoomBlueprint;
  topic: string;
  objective: string;
  constraints: string[];
  speakerIds: string[];
  messages: ChatroomMessage[];
  roleplayScene?: RoleplaySceneState;
  customCharacters?: RoleplayCharacterCard[];
  customRoleplayTemplates?: Map<string, RoleplayCharacterTemplate>;
  finalSummary?: ChatroomFinalSummary;
  roomKernelState?: ChatroomRoomKernelState;
  roomAdminState?: ChatroomRoomAdminState;
  hostState?: ChatroomHostState;
  recorderState?: ChatroomRecorderState;
  maxReplyCharacters?: number;
  /** Tracks consecutive interview planner 'wait' results to detect stuck state. */
  interviewConsecutiveWaitCount?: number;
  /** Explicit interview phase marker. Once set, the planner must respect this
   *  as a hard constraint and cannot regress to an earlier phase. */
  interviewCurrentPhase?: InterviewPhaseState;
  /** Explicit interview pending-reply marker for strict one-question-at-a-time flow control. */
  interviewPendingCandidateReply?: InterviewPendingCandidateReplyState;
  /** Hidden collaboration notes shared across interviewer/admin/planner contexts. */
  interviewInternalNotes?: ChatroomInterviewInternalNote[];
  /** Explicit terminal marker for exceptional interview closure paths. */
  interviewTerminalStatus?: Extract<InterviewSummary['interviewStatus'], 'aborted'>;
  /** Private sessions between participants. Key is session ID. */
  privateSessions?: Map<string, PrivateSession>;
  /** Last read round for private sessions per speaker. Key is speakerId. */
  privateSessionLastReadRound?: Map<string, number>;
// Provider-specific function removed

export interface ChatroomRunInput {
  roomId?: string;
  roomType?: ChatroomRoomTypeId;
  roomBlueprint?: ChatroomRoomBlueprint;
  topic: string;
  objective: string;
  constraints?: string[];
  rounds?: number;
  speakerIds?: string[];
  parallelBatchSize?: number;
  customCharacters?: RoleplayCharacterCard[];
  customRoleplayTemplates?: Map<string, RoleplayCharacterTemplate>;
  maxReplyCharacters?: number;
  summaryEnabled?: boolean;
// Provider-specific function removed

export interface ChatroomResumeInput {
  roomId?: string;
  additionalRounds?: number;
  humanMessage?: string;
  humanAuthorName?: string;
  parallelBatchSize?: number;
// Provider-specific function removed

export interface ChatroomWorkflowDefinitionInput {
  roomId?: string;
  roomType: ChatroomRoomTypeId;
  roomBlueprint?: ChatroomRoomBlueprint;
  startRound: number;
  rounds: number;
  speakerIds: string[];
  parallelBatchSize?: number;
  customCharacters?: RoleplayCharacterCard[];
  customRoleplayTemplates?: Map<string, RoleplayCharacterTemplate>;
  summaryEnabled?: boolean;
// Provider-specific function removed
