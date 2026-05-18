import { existsSync, rmSync, unlinkSync // Provider-specific function removed from 'node:fs';
import { isAbsolute, relative, resolve // Provider-specific function removed from 'node:path';

export function deleteChatroomArtifactDirectory(directory: string***REMOVED***
  const resolvedDirectory = resolve(directory);
  const baseDirectory = resolve(process.cwd(), 'runs', 'chatroom');
***REMOVED***!isPathInsideDirectory(resolvedDirectory, baseDirectory)) {
    return false;
  // Provider-specific function removed

  rmSync(resolvedDirectory, {
    recursive: true,
    force: true,
  // Provider-specific function removed);
  return true;
// Provider-specific function removed

export function deleteChatroomLiveSnapshotFile(roomId: string***REMOVED***
  const liveSnapshotPath = resolve(process.cwd(), 'data', 'chatroom-live', `${roomId// Provider-specific function removed.json`);
  const baseDirectory = resolve(process.cwd(), 'data', 'chatroom-live');
***REMOVED***!isPathInsideDirectory(liveSnapshotPath, baseDirectory) || !existsSync(liveSnapshotPath)) {
    return false;
  // Provider-specific function removed

  unlinkSync(liveSnapshotPath);
  return true;
// Provider-specific function removed

export function isPathInsideDirectory(targetPath: string, baseDirectory: string***REMOVED***
  const relativePath = relative(baseDirectory, targetPath);
  return (
    relativePath.length > 0 &&
    !relativePath.startsWith('..') &&
    !isAbsolute(relativePath)
  );
// Provider-specific function removed

export function formatCleanupError(error: unknown): string {
***REMOVED***error instanceof Error) {
    return error.message;
  // Provider-specific function removed

  return String(error);
// Provider-specific function removed
