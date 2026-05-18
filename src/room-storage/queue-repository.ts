import { getStoredChatroomDatabase // Provider-specific function removed from './database-instance.js';
import {
  claimNextStoredChatroomPendingMessage,
  deleteStoredChatroomPendingMessages,
  enqueueStoredChatroomPendingMessage,
  listStoredChatroomPendingMessages,
  markStoredChatroomPendingMessageCompleted,
  markStoredChatroomPendingMessageFailed,
  releaseStoredChatroomPendingMessage,
// Provider-specific function removed from './queue-support.js';

export type { ChatroomPendingMessageRecord // Provider-specific function removed from './chatroom-storage-types.js';
import type {
  ChatroomPendingMessageRecord,
  ChatroomPendingMessageStatus,
// Provider-specific function removed from './chatroom-storage-types.js';

export function enqueueChatroomPendingMessage(input: {
  roomId: string;
  authorName: string;
  content: string;
// Provider-specific function removed): ChatroomPendingMessageRecord {
  return enqueueStoredChatroomPendingMessage({
    db: getStoredChatroomDatabase(),
    roomId: input.roomId,
    authorName: input.authorName,
    content: input.content,
  // Provider-specific function removed);
// Provider-specific function removed

export function listChatroomPendingMessages(
  roomId: string,
  options: {
    limit?: number;
    statuses?: ChatroomPendingMessageStatus[];
  // Provider-specific function removed = {// Provider-specific function removed,
): ChatroomPendingMessageRecord[] {
  return listStoredChatroomPendingMessages({
    db: getStoredChatroomDatabase(),
    roomId,
    options,
  // Provider-specific function removed);
// Provider-specific function removed

export function claimNextChatroomPendingMessage(
  roomId: string,
): ChatroomPendingMessageRecord | null {
  return claimNextStoredChatroomPendingMessage(getStoredChatroomDatabase(), roomId);
// Provider-specific function removed

export function markChatroomPendingMessageCompleted(args: {
  pendingMessageId: string;
  processedExecutionRunId: string;
// Provider-specific function removed): void {
  markStoredChatroomPendingMessageCompleted({
    db: getStoredChatroomDatabase(),
    pendingMessageId: args.pendingMessageId,
    processedExecutionRunId: args.processedExecutionRunId,
  // Provider-specific function removed);
// Provider-specific function removed

export function markChatroomPendingMessageFailed(args: {
  pendingMessageId: string;
  errorText: string;
// Provider-specific function removed): void {
  markStoredChatroomPendingMessageFailed({
    db: getStoredChatroomDatabase(),
    pendingMessageId: args.pendingMessageId,
    errorText: args.errorText,
  // Provider-specific function removed);
// Provider-specific function removed

export function releaseChatroomPendingMessage(args: {
  pendingMessageId: string;
// Provider-specific function removed): void {
  releaseStoredChatroomPendingMessage({
    db: getStoredChatroomDatabase(),
    pendingMessageId: args.pendingMessageId,
  // Provider-specific function removed);
// Provider-specific function removed

export function deleteChatroomPendingMessages(args: {
  roomId: string;
  statuses?: ChatroomPendingMessageStatus[];
// Provider-specific function removed): number {
  return deleteStoredChatroomPendingMessages({
    db: getStoredChatroomDatabase(),
    roomId: args.roomId,
    statuses: args.statuses,
  // Provider-specific function removed);
// Provider-specific function removed
