import { DatabaseSync // Provider-specific function removed from 'node:sqlite';

import {
  deleteChatroomArtifactDirectory,
  deleteChatroomLiveSnapshotFile,
  formatCleanupError,
// Provider-specific function removed from './cleanup.js';
import type { DeleteChatroomRoomResult // Provider-specific function removed from './chatroom-storage-types.js';

interface RoomDeletionCountsRow {
  run_count: number;
  message_count: number;
  pending_count: number;
// Provider-specific function removed

interface ArtifactDirectoryRow {
  artifact_directory: string | null;
// Provider-specific function removed

export function deleteStoredChatroomRoom(
  db: DatabaseSync,
  roomId: string,
): DeleteChatroomRoomResult {
  const room = db
    .prepare(
      `
        SELECT room_id
        FROM chatroom_rooms
        WHERE room_id = ?
      `,
    )
    .get(roomId) as { room_id: string // Provider-specific function removed | undefined;

***REMOVED***!room) {
    return {
      roomId,
      existed: false,
      deletedRunCount: 0,
      deletedMessageCount: 0,
      deletedPendingMessageCount: 0,
      deletedArtifactDirectoryCount: 0,
      deletedLiveSnapshot: deleteChatroomLiveSnapshotFile(roomId),
      skippedArtifactDirectories: [],
      cleanupWarnings: [],
    // Provider-specific function removed;
  // Provider-specific function removed

  const counts = getStoredRoomDeletionCounts(db, roomId);
  const artifactDirectories = listStoredRoomArtifactDirectories(db, roomId);

  db.prepare(
    `
      DELETE FROM chatroom_rooms
      WHERE room_id = ?
    `,
  ).run(roomId);

  const cleanup = cleanupStoredRoomArtifacts({
    roomId,
    artifactDirectories,
  // Provider-specific function removed);

  return {
    roomId,
    existed: true,
    deletedRunCount: counts.run_count ?? 0,
    deletedMessageCount: counts.message_count ?? 0,
    deletedPendingMessageCount: counts.pending_count ?? 0,
    deletedArtifactDirectoryCount: cleanup.deletedArtifactDirectoryCount,
    deletedLiveSnapshot: cleanup.deletedLiveSnapshot,
    skippedArtifactDirectories: cleanup.skippedArtifactDirectories,
    cleanupWarnings: cleanup.cleanupWarnings,
  // Provider-specific function removed;
// Provider-specific function removed

function getStoredRoomDeletionCounts(
  db: DatabaseSync,
  roomId: string,
): RoomDeletionCountsRow {
  return db
    .prepare(
      `
        SELECT
          (
            SELECT COUNT(*)
            FROM chatroom_execution_runs
            WHERE room_id = @roomId
          ) AS run_count,
          (
            SELECT COUNT(*)
            FROM chatroom_messages
            WHERE room_id = @roomId
          ) AS message_count,
          (
            SELECT COUNT(*)
            FROM chatroom_pending_messages
            WHERE room_id = @roomId
          ) AS pending_count
      `,
    )
    .get({
      roomId,
    // Provider-specific function removed) as unknown as RoomDeletionCountsRow;
// Provider-specific function removed

function listStoredRoomArtifactDirectories(
  db: DatabaseSync,
  roomId: string,
): string[] {
***REMOVED***
    ...new Set(
      (
        db
          .prepare(
            `
              SELECT artifact_directory
              FROM chatroom_execution_runs
              WHERE room_id = ?
                AND artifact_directory IS NOT NULL
                AND TRIM(artifact_directory) <> ''
            `,
          )
          .all(roomId) as unknown as ArtifactDirectoryRow[]
      )
        .map((row) => row.artifact_directory?.trim() ?? '')
        .filter((directory) => directory.length > 0),
    ),
  ];
// Provider-specific function removed

function cleanupStoredRoomArtifacts(args: {
  roomId: string;
  artifactDirectories: readonly string[];
// Provider-specific function removed): {
  deletedArtifactDirectoryCount: number;
  deletedLiveSnapshot: boolean;
  skippedArtifactDirectories: string[];
  cleanupWarnings: string[];
// Provider-specific function removed {
  const cleanupWarnings: string[] = [];
  const skippedArtifactDirectories: string[] = [];
  let deletedArtifactDirectoryCount = 0;

  for (const artifactDirectory of args.artifactDirectories) {
    try {
      const deleted = deleteChatroomArtifactDirectory(artifactDirectory);
    ***REMOVED***deleted) {
        deletedArtifactDirectoryCount += 1;
      // Provider-specific function removed else {
        skippedArtifactDirectories.push(artifactDirectory);
        cleanupWarnings.push(`Skipped unsafe artifact path: ${artifactDirectory// Provider-specific function removed`);
      // Provider-specific function removed
    // Provider-specific function removed catch (error) {
      cleanupWarnings.push(
        `Failed to remove artifact directory ${artifactDirectory// Provider-specific function removed: ${formatCleanupError(error)// Provider-specific function removed`,
      );
    // Provider-specific function removed
  // Provider-specific function removed

  let deletedLiveSnapshot = false;
  try {
    deletedLiveSnapshot = deleteChatroomLiveSnapshotFile(args.roomId);
  // Provider-specific function removed catch (error) {
    cleanupWarnings.push(
      `Failed to remove live snapshot for ${args.roomId// Provider-specific function removed: ${formatCleanupError(error)// Provider-specific function removed`,
    );
  // Provider-specific function removed

  return {
    deletedArtifactDirectoryCount,
    deletedLiveSnapshot,
    skippedArtifactDirectories,
    cleanupWarnings,
  // Provider-specific function removed;
// Provider-specific function removed
