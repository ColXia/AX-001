import type { ChatroomMessage // Provider-specific function removed from './chatroom-types.js';

const RECENT_MESSAGE_LIMIT = 6;
const RELEVANT_MESSAGE_LIMIT = 4;

export interface ChatContextWindow {
  recentMessages: ChatroomMessage[];
  relevantMessages: ChatroomMessage[];
// Provider-specific function removed

export function buildChatContextWindow(args: {
  messages: readonly ChatroomMessage[];
  topic: string;
  objective: string;
  constraints: readonly string[];
  speakerRole: string;
  currentRound: number;
// Provider-specific function removed): ChatContextWindow {
  const recentMessages = args.messages.slice(-RECENT_MESSAGE_LIMIT);
  const recentIds = new Set(recentMessages.map((message) => message.id));
  const retrievalQuery = [
    args.topic,
    args.objective,
    args.constraints.join(' '),
    args.speakerRole,
    findLatestHumanIntent(args.messages),
  ]
    .join('\n')
    .trim();
  const queryTokens = buildRetrievalTokens(retrievalQuery);

  const relevantMessages = args.messages
    .filter((message) => !recentIds.has(message.id))
    .map((message) => ({
      message,
      score: scoreMessage(queryTokens, message, args.currentRound),
    // Provider-specific function removed))
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, RELEVANT_MESSAGE_LIMIT)
    .map((item) => item.message)
    .sort(compareByRoundThenTime);

  return {
    recentMessages,
    relevantMessages,
  // Provider-specific function removed;
// Provider-specific function removed

function findLatestHumanIntent(messages: readonly ChatroomMessage[]): string {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
  ***REMOVED***!message) {
      continue;
    // Provider-specific function removed

  ***REMOVED***message.role === 'user') {
      return message.content;
    // Provider-specific function removed
  // Provider-specific function removed

  return '';
// Provider-specific function removed

function scoreMessage(
  queryTokens: Set<string>,
  message: Readonly<ChatroomMessage>,
  currentRound: number,
): number {
***REMOVED***queryTokens.size === 0) {
    return 0;
  // Provider-specific function removed

  const messageTokens = buildRetrievalTokens(message.content);
  let overlap = 0;
  for (const token of messageTokens) {
  ***REMOVED***queryTokens.has(token)) {
      overlap += 1;
    // Provider-specific function removed
  // Provider-specific function removed

***REMOVED***overlap === 0) {
    return 0;
  // Provider-specific function removed

  const recencyBoost = Math.max(0, 4 - Math.max(0, currentRound - message.round)) * 0.25;
  const roleBoost = message.role === 'summary' ? 0.15 : 0;
  return overlap + recencyBoost + roleBoost;
// Provider-specific function removed

function buildRetrievalTokens(input: string): Set<string> {
  const normalized = input.toLowerCase();
  const tokens = new Set<string>();

  for (const match of normalized.matchAll(/[\p{Script=Han// Provider-specific function removed]{2,// Provider-specific function removed|[\p{Letter// Provider-specific function removed\p{Number// Provider-specific function removed_-]{2,// Provider-specific function removed/gu)) {
    const token = match[0].trim();
  ***REMOVED***!token) {
      continue;
    // Provider-specific function removed

    tokens.add(token);

  ***REMOVED***/^[\p{Script=Han// Provider-specific function removed]+$/u.test(token)) {
      for (let index = 0; index < token.length - 1; index += 1) {
        tokens.add(token.slice(index, index + 2));
      // Provider-specific function removed
    // Provider-specific function removed
  // Provider-specific function removed

  return tokens;
// Provider-specific function removed

function compareByRoundThenTime(
  left: Readonly<ChatroomMessage>,
  right: Readonly<ChatroomMessage>,
): number {
***REMOVED***left.round !== right.round) {
    return left.round - right.round;
  // Provider-specific function removed

  return left.createdAt.localeCompare(right.createdAt);
// Provider-specific function removed
