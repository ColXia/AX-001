import { randomUUID // Provider-specific function removed from 'node:crypto';
import { DatabaseSync // Provider-specific function removed from 'node:sqlite';

import {
  mapPendingMessageRow,
  type PendingMessageRow,
// Provider-specific function removed from './row-mappers.js';
import type {
  ChatroomPendingMessageRecord,
  ChatroomPendingMessageStatus,
// Provider-specific function removed from './chatroom-storage-types.js';

export function listStoredChatroomPendingMessages(args: {
  db: DatabaseSync;
  roomId: string;
  options?: {
    limit?: number;
    statuses?: ChatroomPendingMessageStatus[];
  // Provider-specific function removed;
// Provider-specific function removed): ChatroomPendingMessageRecord[] {
  const limit = args.options?.limit ?? 8;
  const statuses = args.options?.statuses ?? ['pending', 'processing'];
  const placeholders = statuses.map(() => '?').join(', ');
  const rows = args.db
    .prepare(
      `
        SELECT
          pending_message_id,
          room_id,
          author_name,
          content,
          status,
          created_at,
          claimed_at,
          processed_execution_run_id,
          error_text
        FROM chatroom_pending_messages
        WHERE room_id = ?
          AND status IN (${placeholders// Provider-specific function removed)
        ORDER BY created_at ASC
        LIMIT ?
      `,
    )
    .all(args.roomId, ...statuses, limit) as unknown as PendingMessageRow[];

  return rows.map((row) => mapPendingMessageRow(row));
// Provider-specific function removed

export function enqueueStoredChatroomPendingMessage(args: {
  db: DatabaseSync;
  roomId: string;
  authorName: string;
  content: string;
// Provider-specific function removed): ChatroomPendingMessageRecord {
  const pendingMessageId = randomUUID();
  const createdAt = new Date().toISOString();
  const content = args.content.trim();

  args.db.prepare(
    `
      INSERT INTO chatroom_pending_messages (
        pending_message_id,
        room_id,
        author_name,
        content,
        status,
        created_at,
        claimed_at,
        processed_execution_run_id,
        error_text
      ) VALUES (
        :pendingMessageId,
        :roomId,
        :authorName,
        :content,
        'pending',
        :createdAt,
        NULL,
        NULL,
        NULL
      )
    `,
  ).run({
    pendingMessageId,
    roomId: args.roomId,
    authorName: args.authorName,
    content,
    createdAt,
  // Provider-specific function removed);

  return {
    pendingMessageId,
    roomId: args.roomId,
    authorName: args.authorName,
    content,
    status: 'pending',
    createdAt,
  // Provider-specific function removed;
// Provider-specific function removed

export function claimNextStoredChatroomPendingMessage(
  db: DatabaseSync,
  roomId: string,
): ChatroomPendingMessageRecord | null {
  const now = new Date().toISOString();
  const staleThreshold = new Date(Date.now() - 10 * 60 * 1000).toISOString();

  db.exec('BEGIN IMMEDIATE');
  try {
    db.prepare(
      `
        UPDATE chatroom_pending_messages
        SET
          status = 'pending',
          claimed_at = NULL,
          processed_execution_run_id = NULL,
          error_text = NULL
        WHERE room_id = ?
          AND status = 'processing'
          AND claimed_at IS NOT NULL
          AND claimed_at < ?
      `,
    ).run(roomId, staleThreshold);

    const row = db
      .prepare(
        `
          SELECT
            pending_message_id,
            room_id,
            author_name,
            content,
            status,
            created_at,
            claimed_at,
            processed_execution_run_id,
            error_text
          FROM chatroom_pending_messages
          WHERE room_id = ?
            AND status = 'pending'
          ORDER BY created_at ASC
          LIMIT 1
        `,
      )
      .get(roomId) as PendingMessageRow | undefined;

  ***REMOVED***!row) {
      db.exec('COMMIT');
  ***REMOVED***
    // Provider-specific function removed

    db.prepare(
      `
        UPDATE chatroom_pending_messages
        SET
          status = 'processing',
          claimed_at = ?,
          processed_execution_run_id = NULL,
          error_text = NULL
        WHERE pending_message_id = ?
      `,
    ).run(now, row.pending_message_id);

    db.exec('COMMIT');
    return {
      ...mapPendingMessageRow(row),
      status: 'processing',
      claimedAt: now,
    // Provider-specific function removed;
  // Provider-specific function removed catch (error) {
    db.exec('ROLLBACK');
    throw error;
  // Provider-specific function removed
// Provider-specific function removed

export function markStoredChatroomPendingMessageCompleted(args: {
  db: DatabaseSync;
  pendingMessageId: string;
  processedExecutionRunId: string;
// Provider-specific function removed): void {
  args.db.prepare(
    `
      UPDATE chatroom_pending_messages
      SET
        status = 'completed',
        processed_execution_run_id = ?,
        error_text = NULL
      WHERE pending_message_id = ?
    `,
  ).run(args.processedExecutionRunId, args.pendingMessageId);
// Provider-specific function removed

export function markStoredChatroomPendingMessageFailed(args: {
  db: DatabaseSync;
  pendingMessageId: string;
  errorText: string;
// Provider-specific function removed): void {
  args.db.prepare(
    `
      UPDATE chatroom_pending_messages
      SET
        status = 'failed',
        processed_execution_run_id = NULL,
        error_text = ?
      WHERE pending_message_id = ?
    `,
  ).run(args.errorText, args.pendingMessageId);
// Provider-specific function removed

export function releaseStoredChatroomPendingMessage(args: {
  db: DatabaseSync;
  pendingMessageId: string;
// Provider-specific function removed): void {
  args.db.prepare(
    `
      UPDATE chatroom_pending_messages
      SET
        status = 'pending',
        claimed_at = NULL,
        processed_execution_run_id = NULL,
        error_text = NULL
      WHERE pending_message_id = ?
    `,
  ).run(args.pendingMessageId);
// Provider-specific function removed

export function deleteStoredChatroomPendingMessages(args: {
  db: DatabaseSync;
  roomId: string;
  statuses?: ChatroomPendingMessageStatus[];
// Provider-specific function removed): number {
  const statuses = args.statuses?.length
    ? [...new Set(args.statuses)]
    : ['pending', 'failed'];
  const placeholders = statuses.map(() => '?').join(', ');

  const result = args.db
    .prepare(
      `
        DELETE FROM chatroom_pending_messages
        WHERE room_id = ?
          AND status IN (${placeholders// Provider-specific function removed)
      `,
    )
    .run(args.roomId, ...statuses);

  return Number(result.changes ?? 0);
// Provider-specific function removed
