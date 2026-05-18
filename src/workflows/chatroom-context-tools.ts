import { z // Provider-specific function removed from 'zod';

import {
  buildDynamicContextTools,
  createDynamicContextProvider,
  type AgentDynamicContextSnapshot,
// Provider-specific function removed from '../core/dynamic-context.js';
import type { ChatroomLiveSnapshot // Provider-specific function removed from './chatroom-live.js';
import { loadChatroomLiveSnapshot // Provider-specific function removed from './chatroom-live.js';
import {
  listChatroomPendingMessages,
  type ChatroomPendingMessageRecord,
// Provider-specific function removed from '../room-storage/queue-repository.js';
import { loadChatroomRoomState // Provider-specific function removed from '../room-storage/room-repository.js';
import { formatChatTranscript, formatConstraints // Provider-specific function removed from './chatroom-format.js';
import {
  getRoleplaySpeakerRuntimeContext,
  rebuildRoleplaySceneState,
// Provider-specific function removed from './chatroom-roleplay-state.js';
import { resolveChatroomRoomType // Provider-specific function removed from './chatroom-room-types.js';
import { buildChatContextWindow // Provider-specific function removed from './chatroom-retrieval.js';
import type { ChatroomAgentContext, ChatroomMessage // Provider-specific function removed from './chatroom-types.js';
import type { ChatroomState // Provider-specific function removed from './chatroom-discussion.js';

export const refreshRoomContextInputSchema = z.object({
  focus: z
    .enum(['recent', 'relevant', 'latest_human_thread', 'full'])
    .default('recent'),
  maxMessages: z.number().int().min(1).max(12).default(6),
// Provider-specific function removed);

interface DynamicRoomSnapshot {
  source: 'live' | 'stored' | 'context';
  statusLabel: string;
  roomType: ChatroomAgentContext['roomType'];
  roomBehavior: ChatroomAgentContext['roomBehavior'];
  topic: string;
  objective: string;
  constraints: string[];
  messages: ChatroomMessage[];
  roleplayScene?: ChatroomState['roleplayScene'];
  pendingMessages: ChatroomPendingMessageRecord[];
// Provider-specific function removed

export const refreshRoomContextProvider = createDynamicContextProvider<
  ChatroomAgentContext,
  typeof refreshRoomContextInputSchema
>({
  id: 'refresh_room_context',
  title: 'Dynamic room context refresh',
  description:
    'Load the latest live room snapshot before replying when the shared room may have changed.',
  parameters: refreshRoomContextInputSchema,
  strict: true,
  load: async ({ input, context // Provider-specific function removed) => {
    const snapshot = resolveDynamicRoomSnapshot(context);
    const selectedMessages = selectMessagesForFocus(
      snapshot.messages,
      context,
      input.focus,
      input.maxMessages,
    );
    const relevantWindow = buildChatContextWindow({
      messages: snapshot.messages,
      topic: snapshot.topic,
      objective: snapshot.objective,
      constraints: snapshot.constraints,
      speakerRole: context.speakerRole,
      currentRound: context.round,
    // Provider-specific function removed);
    const pendingSummary =
      snapshot.pendingMessages.length > 0
        ? snapshot.pendingMessages
            .map((item) => `${item.authorName// Provider-specific function removed:${item.status// Provider-specific function removed`)
            .join(', ')
        : 'none';
    const roleplaySection = buildRoleplayRefreshSection(snapshot, context);
    const speakerThreadSection = buildSpeakerThreadSection(context);

    const result: AgentDynamicContextSnapshot = {
      title: 'Dynamic room context refresh',
      summary: [
        `Source: ${snapshot.statusLabel// Provider-specific function removed`,
        `Room: ${context.roomId ?? 'unbound'// Provider-specific function removed`,
        `Room type: ${context.roomType// Provider-specific function removed`,
        `Message count: ${snapshot.messages.length// Provider-specific function removed`,
        `Base message count: ${context.messageCount// Provider-specific function removed`,
        `New since prompt context: ${Math.max(0, snapshot.messages.length - context.messageCount)// Provider-specific function removed`,
        `Pending human messages: ${pendingSummary// Provider-specific function removed`,
      ].join('\n'),
      sections: [
        {
          title: 'Room goal',
          content: [
            `Topic: ${snapshot.topic// Provider-specific function removed`,
            `Objective: ${snapshot.objective// Provider-specific function removed`,
            'Constraints:',
            formatConstraints(snapshot.constraints),
          ].join('\n'),
        // Provider-specific function removed,
        {
          title: formatFocusLabel(input.focus),
          content: formatChatTranscript(selectedMessages, {
            emptyText: 'No messages are available for this focus.',
          // Provider-specific function removed),
        // Provider-specific function removed,
        {
          title: 'Extra signals',
          content: [
            `Recent window: ${relevantWindow.recentMessages.length// Provider-specific function removed`,
            `Relevant window: ${relevantWindow.relevantMessages.length// Provider-specific function removed`,
            relevantWindow.relevantMessages.length > 0
              ? formatChatTranscript(relevantWindow.relevantMessages, {
                  emptyText: 'No matched relevant history.',
                // Provider-specific function removed)
              : 'No matched relevant history.',
          ].join('\n'),
        // Provider-specific function removed,
      ],
    // Provider-specific function removed;

  ***REMOVED***roleplaySection) {
      result.sections?.splice(1, 0, roleplaySection);
    // Provider-specific function removed
  ***REMOVED***speakerThreadSection) {
      result.sections?.splice(roleplaySection ? 2 : 1, 0, speakerThreadSection);
    // Provider-specific function removed

    return result;
  // Provider-specific function removed,
// Provider-specific function removed);

/**
 * Dynamic context provider that lets an agent query a specific participant's
 * historical messages on a topic. Useful for understanding a particular
 * speaker's viewpoint or finding their prior statements.
 */
export const queryParticipantViewpointsInputSchema = z.object({
  participantNameOrId: z.string().describe('Display name or stable key of the participant to query.'),
  topicKeywords: z.string().describe('Keywords describing the topic or question to search for.'),
  maxMessages: z.number().int().min(1).max(8).default(4),
// Provider-specific function removed);

export const queryParticipantViewpointsProvider = createDynamicContextProvider<
  ChatroomAgentContext,
  typeof queryParticipantViewpointsInputSchema
>({
  id: 'query_participant_viewpoints',
  title: 'Query participant viewpoints',
  description:
    'Search a specific participant\'s historical messages for their viewpoint on a topic. Use when you need to understand or recall what a particular speaker has said.',
  parameters: queryParticipantViewpointsInputSchema,
  strict: true,
  load: ({ input, context // Provider-specific function removed) => {
    const messages = context.transcriptMessages;
    const query = input.participantNameOrId.toLowerCase();

    // Find messages by this participant (match by authorId or authorName).
    const participantMessages = messages.filter((message) => {
      const authorId = message.authorId.toLowerCase();
      const authorName = message.authorName.toLowerCase();
      return authorId === query || authorName === query
        || authorId.includes(query) || authorName.includes(query);
    // Provider-specific function removed);

  ***REMOVED***participantMessages.length === 0) {
      return {
        title: 'Participant viewpoint query',
        summary: `No messages found for participant "${input.participantNameOrId// Provider-specific function removed".`,
        sections: [],
      // Provider-specific function removed;
    // Provider-specific function removed

    // Score messages by keyword overlap with the topic.
    const keywordTokens = new Set(
      Array.from(input.topicKeywords.toLowerCase().matchAll(/[\p{Script=Han// Provider-specific function removed]{2,// Provider-specific function removed|[\p{Letter// Provider-specific function removed\p{Number// Provider-specific function removed_-]{2,// Provider-specific function removed/gu))
        .map((match) => match[0]),
    );

    const scored = participantMessages
      .map((message) => {
        const contentTokens = new Set(
          Array.from(message.content.toLowerCase().matchAll(/[\p{Script=Han// Provider-specific function removed]{2,// Provider-specific function removed|[\p{Letter// Provider-specific function removed\p{Number// Provider-specific function removed_-]{2,// Provider-specific function removed/gu))
            .map((match) => match[0]),
        );
        let overlap = 0;
        for (const token of contentTokens) {
        ***REMOVED***keywordTokens.has(token)) {
            overlap += 1;
          // Provider-specific function removed
        // Provider-specific function removed
        return { message, score: overlap // Provider-specific function removed;
      // Provider-specific function removed)
      .sort((left, right) => right.score - left.score)
      .slice(0, input.maxMessages);

    const sections = scored
      .filter((item) => item.message.content.trim().length > 0)
      .map((item) => ({
        title: `Round ${item.message.round// Provider-specific function removed (${item.message.createdAt// Provider-specific function removed)`,
        content: item.message.content,
      // Provider-specific function removed));

    return {
      title: `Viewpoints of "${input.participantNameOrId// Provider-specific function removed" on "${input.topicKeywords// Provider-specific function removed"`,
      summary: `Found ${participantMessages.length// Provider-specific function removed messages from this participant; showing top ${sections.length// Provider-specific function removed by relevance.`,
      sections,
    // Provider-specific function removed;
  // Provider-specific function removed,
// Provider-specific function removed);

export const refreshRoomContextTool = buildDynamicContextTools([
  refreshRoomContextProvider,
])[0]!;

function resolveDynamicRoomSnapshot(
  context: Readonly<ChatroomAgentContext>,
): DynamicRoomSnapshot {
  const fallback: DynamicRoomSnapshot = {
    source: 'context',
    statusLabel: 'current prompt context',
    roomType: context.roomType,
    roomBehavior: context.roomBehavior,
    topic: context.topic,
    objective: context.objective,
    constraints: [...context.constraints],
    messages: [...context.transcriptMessages],
    roleplayScene: context.roleplayScene,
    pendingMessages: [],
  // Provider-specific function removed;

***REMOVED***!context.roomId) {
    return fallback;
  // Provider-specific function removed

  const liveSnapshot = safeLoadLiveSnapshot(context.roomId);
  const storedState = safeLoadStoredState(context.roomId);
  const pendingMessages = safeLoadPendingMessages(context.roomId);

  const liveMessages = liveSnapshot?.state.messages.length ?? -1;
  const storedMessages = storedState?.messages.length ?? -1;

***REMOVED***liveSnapshot && liveMessages >= storedMessages && liveMessages >= fallback.messages.length) {
    return {
      source: 'live',
      statusLabel: `live snapshot (${liveSnapshot.status// Provider-specific function removed)`,
      roomType: liveSnapshot.state.roomType,
      roomBehavior: context.roomBehavior,
      topic: liveSnapshot.state.topic,
      objective: liveSnapshot.state.objective,
      constraints: [...liveSnapshot.state.constraints],
      messages: [...liveSnapshot.state.messages],
      roleplayScene: ensureRoleplaySceneState(liveSnapshot.state),
      pendingMessages,
    // Provider-specific function removed;
  // Provider-specific function removed

***REMOVED***storedState && storedMessages >= fallback.messages.length) {
    return {
      source: 'stored',
      statusLabel: 'SQLite room snapshot',
      roomType: storedState.roomType,
      roomBehavior: context.roomBehavior,
      topic: storedState.topic,
      objective: storedState.objective,
      constraints: [...storedState.constraints],
      messages: [...storedState.messages],
      roleplayScene: storedState.roleplayScene,
      pendingMessages,
    // Provider-specific function removed;
  // Provider-specific function removed

  return {
    ...fallback,
    pendingMessages,
  // Provider-specific function removed;
// Provider-specific function removed

function safeLoadLiveSnapshot(roomId: string): ChatroomLiveSnapshot | undefined {
  try {
    return loadChatroomLiveSnapshot(roomId) ?? undefined;
  // Provider-specific function removed catch {
    return undefined;
  // Provider-specific function removed
// Provider-specific function removed

function safeLoadStoredState(roomId: string): ChatroomState | undefined {
  try {
    return loadChatroomRoomState(roomId);
  // Provider-specific function removed catch {
    return undefined;
  // Provider-specific function removed
// Provider-specific function removed

function safeLoadPendingMessages(roomId: string): ChatroomPendingMessageRecord[] {
  try {
    return listChatroomPendingMessages(roomId, {
      limit: 6,
      statuses: ['pending', 'processing'],
    // Provider-specific function removed);
  // Provider-specific function removed catch {
  ***REMOVED***];
  // Provider-specific function removed
// Provider-specific function removed

function selectMessagesForFocus(
  messages: readonly ChatroomMessage[],
  context: Readonly<ChatroomAgentContext>,
  focus: z.infer<typeof refreshRoomContextInputSchema>['focus'],
  maxMessages: number,
): ChatroomMessage[] {
  switch (focus) {
    case 'relevant':
      return buildChatContextWindow({
        messages,
        topic: context.topic,
        objective: context.objective,
        constraints: context.constraints,
        speakerRole: context.speakerRole,
        currentRound: context.round,
      // Provider-specific function removed).relevantMessages;
    case 'latest_human_thread':
      return extractLatestHumanThread(messages, maxMessages);
    case 'full':
    ***REMOVED***...messages].slice(-maxMessages);
    case 'recent':
    default:
    ***REMOVED***...messages].slice(-maxMessages);
  // Provider-specific function removed
// Provider-specific function removed

function extractLatestHumanThread(
  messages: readonly ChatroomMessage[],
  maxMessages: number,
): ChatroomMessage[] {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
  ***REMOVED***message?.role !== 'user') {
      continue;
    // Provider-specific function removed

    return messages.slice(index, Math.min(messages.length, index + maxMessages));
  // Provider-specific function removed

***REMOVED***...messages].slice(-maxMessages);
// Provider-specific function removed

function formatFocusLabel(
  focus: z.infer<typeof refreshRoomContextInputSchema>['focus'],
): string {
  switch (focus) {
    case 'relevant':
      return 'Relevant history';
    case 'latest_human_thread':
      return 'Latest human thread';
    case 'full':
      return 'Full recent tail';
    case 'recent':
    default:
      return 'Recent messages';
  // Provider-specific function removed
// Provider-specific function removed

function ensureRoleplaySceneState(state: ChatroomState): ChatroomState['roleplayScene'] {
***REMOVED***resolveRoleplayBehaviorFromState(state) !== 'roleplay') {
    return undefined;
  // Provider-specific function removed

***REMOVED***state.messages.length === 0 && state.roleplayScene) {
    return state.roleplayScene;
  // Provider-specific function removed

  return rebuildRoleplaySceneState({
    topic: state.topic,
    objective: state.objective,
    constraints: state.constraints,
    speakerIds: state.speakerIds,
    messages: state.messages,
  // Provider-specific function removed);
// Provider-specific function removed

function buildRoleplayRefreshSection(
  snapshot: Readonly<DynamicRoomSnapshot>,
  context: Readonly<ChatroomAgentContext>,
): import('../core/dynamic-context.js').AgentDynamicContextSection | undefined {
***REMOVED***snapshot.roomBehavior !== 'roleplay' || !snapshot.roleplayScene) {
    return undefined;
  // Provider-specific function removed

  const speakerState = getRoleplaySpeakerRuntimeContext(
    snapshot.roleplayScene,
    context.speakerId,
  );

  return {
    title: 'Roleplay scene',
    content: [
      `Location: ${snapshot.roleplayScene.locationLabel// Provider-specific function removed`,
      `Atmosphere: ${snapshot.roleplayScene.atmosphere// Provider-specific function removed`,
      `Current beat: ${snapshot.roleplayScene.currentBeat// Provider-specific function removed`,
      `Latest event: ${snapshot.roleplayScene.latestEvent// Provider-specific function removed`,
      `Latest user intent: ${snapshot.roleplayScene.latestUserIntent ?? 'none'// Provider-specific function removed`,
      'Active threads:',
      formatConstraints(snapshot.roleplayScene.activeThreads),
      ...(speakerState
        ? [
            '',
            `Your public status: ${speakerState.publicStatus// Provider-specific function removed`,
            `Your current goal: ${speakerState.currentGoal// Provider-specific function removed`,
            'Your private notes:',
            formatConstraints(speakerState.privateNotes),
            'Your relationships:',
            formatConstraints(speakerState.relationships),
          ]
        : []),
    ].join('\n'),
  // Provider-specific function removed;
// Provider-specific function removed

function buildSpeakerThreadSection(
  context: Readonly<ChatroomAgentContext>,
): import('../core/dynamic-context.js').AgentDynamicContextSection | undefined {
***REMOVED***!context.speakerThreadMemory) {
    return undefined;
  // Provider-specific function removed

  return {
    title: 'Speaker thread memory',
    content: [
      `Participant: ${context.speakerName// Provider-specific function removed`,
      `Role label: ${context.speakerParticipantRoleLabel ?? context.speakerRole// Provider-specific function removed`,
      `Thread status: ${context.speakerThreadStatus ?? 'active'// Provider-specific function removed`,
      `Total messages: ${context.speakerThreadMemory.messageCount// Provider-specific function removed`,
      `Last round: ${context.speakerThreadMemory.lastRound// Provider-specific function removed`,
      `Last message at: ${context.speakerThreadMemory.lastMessageAt ?? 'none'// Provider-specific function removed`,
      `Latest excerpt: ${context.speakerThreadMemory.latestMessageExcerpt ?? 'none'// Provider-specific function removed`,
      'Recent self excerpts:',
      formatConstraints(context.speakerThreadMemory.recentMessageExcerpts),
    ].join('\n'),
  // Provider-specific function removed;
// Provider-specific function removed

function resolveRoleplayBehaviorFromState(
  state: Readonly<ChatroomState>,
): ChatroomAgentContext['roomBehavior'] {
  return resolveChatroomRoomType(state.roomType).behavior;
// Provider-specific function removed
