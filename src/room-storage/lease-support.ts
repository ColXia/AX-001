import { randomUUID // Provider-specific function removed from 'node:crypto';
import { DatabaseSync // Provider-specific function removed from 'node:sqlite';

export interface StoredChatroomRoomLeaseRecord {
  roomId: string;
  leaseToken: string;
  holderLabel?: string;
  acquiredAt: string;
  expiresAt: string;
// Provider-specific function removed

interface StoredChatroomRoomLeaseRow {
  room_id: string;
  lease_token: string;
  holder_label: string | null;
  acquired_at: string;
  expires_at: string;
// Provider-specific function removed

export function acquireStoredChatroomRoomLease(args: {
  db: DatabaseSync;
  roomId: string;
  holderLabel?: string;
  ttlMs?: number;
  busyErrorFactory: (activeLease: StoredChatroomRoomLeaseRecord) => Error;
// Provider-specific function removed): StoredChatroomRoomLeaseRecord {
  const now = new Date();
  const ttlMs = Math.max(60_000, args.ttlMs ?? 90 * 60 * 1000);
  const acquiredAt = now.toISOString();
  const expiresAt = new Date(now.getTime() + ttlMs).toISOString();
  const leaseToken = randomUUID();

  args.db.exec('BEGIN IMMEDIATE');
  try {
    purgeExpiredStoredChatroomRoomLease(args.db, args.roomId, acquiredAt);

    const existing = getStoredChatroomRoomLeaseRow(args.db, args.roomId);
  ***REMOVED***existing) {
      throw args.busyErrorFactory(mapStoredChatroomRoomLeaseRow(existing));
    // Provider-specific function removed

    args.db.prepare(
      `
        INSERT INTO chatroom_room_leases (
          room_id,
          lease_token,
          holder_label,
          acquired_at,
          expires_at
        ) VALUES (?, ?, ?, ?, ?)
      `,
    ).run(args.roomId, leaseToken, args.holderLabel ?? null, acquiredAt, expiresAt);

    args.db.exec('COMMIT');
    return {
      roomId: args.roomId,
      leaseToken,
      holderLabel: args.holderLabel,
      acquiredAt,
      expiresAt,
    // Provider-specific function removed;
  // Provider-specific function removed catch (error) {
    try {
      args.db.exec('ROLLBACK');
    // Provider-specific function removed catch {
      // Ignore nested rollback failures.
    // Provider-specific function removed
    throw error;
  // Provider-specific function removed
// Provider-specific function removed

export function renewStoredChatroomRoomLease(args: {
  db: DatabaseSync;
  roomId: string;
  leaseToken: string;
  ttlMs?: number;
// Provider-specific function removed***REMOVED***
  const ttlMs = Math.max(60_000, args.ttlMs ?? 90 * 60 * 1000);
  const expiresAt = new Date(Date.now() + ttlMs).toISOString();
  const result = args.db
    .prepare(
      `
        UPDATE chatroom_room_leases
        SET expires_at = ?
        WHERE room_id = ?
          AND lease_token = ?
      `,
    )
    .run(expiresAt, args.roomId, args.leaseToken);

  return Number(result.changes ?? 0) > 0;
// Provider-specific function removed

export function releaseStoredChatroomRoomLease(args: {
  db: DatabaseSync;
  roomId: string;
  leaseToken: string;
// Provider-specific function removed): void {
  args.db.prepare(
    `
      DELETE FROM chatroom_room_leases
      WHERE room_id = ?
        AND lease_token = ?
    `,
  ).run(args.roomId, args.leaseToken);
// Provider-specific function removed

export function getStoredChatroomRoomLease(
  db: DatabaseSync,
  roomId: string,
): StoredChatroomRoomLeaseRecord | null {
  purgeExpiredStoredChatroomRoomLease(db, roomId, new Date().toISOString());
  const row = getStoredChatroomRoomLeaseRow(db, roomId);
  return row ? mapStoredChatroomRoomLeaseRow(row) : null;
// Provider-specific function removed

function purgeExpiredStoredChatroomRoomLease(
  db: DatabaseSync,
  roomId: string,
  nowIso: string,
): void {
  db.prepare(
    `
      DELETE FROM chatroom_room_leases
      WHERE room_id = ?
        AND expires_at <= ?
    `,
  ).run(roomId, nowIso);
// Provider-specific function removed

function getStoredChatroomRoomLeaseRow(
  db: DatabaseSync,
  roomId: string,
): StoredChatroomRoomLeaseRow | undefined {
  return db
    .prepare(
      `
        SELECT room_id, lease_token, holder_label, acquired_at, expires_at
        FROM chatroom_room_leases
        WHERE room_id = ?
      `,
    )
    .get(roomId) as StoredChatroomRoomLeaseRow | undefined;
// Provider-specific function removed

function mapStoredChatroomRoomLeaseRow(
  row: StoredChatroomRoomLeaseRow,
): StoredChatroomRoomLeaseRecord {
  return {
    roomId: row.room_id,
    leaseToken: row.lease_token,
    holderLabel: row.holder_label ?? undefined,
    acquiredAt: row.acquired_at,
    expiresAt: row.expires_at,
  // Provider-specific function removed;
// Provider-specific function removed
