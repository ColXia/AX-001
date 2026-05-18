import type {
  ChatroomRoomBehaviorId,
  ChatroomRoomTypeId,
// Provider-specific function removed from '../workflows/chatroom-room-types.js';
import type {
  RoleplaySceneState,
  RoleplaySpeakerRuntimeContext,
// Provider-specific function removed from '../workflows/chatroom-roleplay-state.js';
import type {
  ChatroomRoomBlueprint,
  RoomBlueprintGovernanceConfig,
// Provider-specific function removed from '../room-scenarios/room-blueprints.js';
import type { RoomRuntimeMode // Provider-specific function removed from '../workflows/room-runtime-mode.js';
import type {
  RoomParticipantSlot,
  RoomScenarioTemplateId,
// Provider-specific function removed from '../room-scenarios/scenario-templates.js';
import type { ChatroomInterviewInternalNote // Provider-specific function removed from '../workflows/chatroom-types.js';
import type {
  ChatroomAgentThreadMemoryState,
  ChatroomAgentThreadSummaryState,
// Provider-specific function removed from '../room-core/agent-thread-state.js';
import type { RoleplayCharacterCard // Provider-specific function removed from '../room-scenarios/roleplay/roleplay-characters.js';
import type { ChatroomMessage // Provider-specific function removed from '../room-core/message-types.js';
import type { ChatroomRoomAdminDirective // Provider-specific function removed from '../room-governance/room-admin-types.js';
import type { ChatroomHostDirective // Provider-specific function removed from '../room-governance/room-host-types.js';
import type { ChatroomRoomKernelDirective // Provider-specific function removed from '../room-governance/room-kernel-types.js';
import type { PrivateSessionMessage // Provider-specific function removed from '../room-core/private-session-types.js';

export interface ChatroomAgentContext {
  workflowId: string;
  stepId: string;
  roomId?: string;
  roomBlueprintId?: string;
  scenarioTemplateId?: RoomScenarioTemplateId;
  roomType: ChatroomRoomTypeId;
  roomBehavior: ChatroomRoomBehaviorId;
  roomRuntimeMode: RoomRuntimeMode;
  round: number;
  topic: string;
  objective: string;
  constraints: string[];
  roomParticipantSlots?: RoomParticipantSlot[];
  roomGovernance?: RoomBlueprintGovernanceConfig;
  roomKernelDirective?: ChatroomRoomKernelDirective;
  roomAdminDirective?: ChatroomRoomAdminDirective;
  roomHostDirective?: ChatroomHostDirective;
  speakerId: string;
  speakerName: string;
  speakerRole: string;
  speakerParticipantId?: string;
  speakerParticipantRoleLabel?: string;
  speakerIdentitySnapshot?: Record<string, unknown>;
  speakerThreadId?: string;
  speakerThreadStatus?: 'active' | 'paused' | 'errored';
  speakerThreadMemory?: ChatroomAgentThreadMemoryState;
  speakerThreadSummary?: ChatroomAgentThreadSummaryState;
  /** Per-agent read cursor: last main-session sequence number this agent has processed. */
  speakerThreadLastReadSequenceNo?: number;
  messageCount: number;
  recentMessages: ChatroomMessage[];
  relevantMessages: ChatroomMessage[];
  transcriptMessages: ChatroomMessage[];
  interviewInternalNotes?: ChatroomInterviewInternalNote[];
  roleplayScene?: RoleplaySceneState;
  roleplaySpeaker?: RoleplaySpeakerRuntimeContext;
  customCharacters?: RoleplayCharacterCard[];
  incomingPrivateMessages?: PrivateSessionMessage[];
  maxReplyCharacters: number;
  roomBlueprint?: ChatroomRoomBlueprint;
// Provider-specific function removed
