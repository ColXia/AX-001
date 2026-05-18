import { DatabaseSync // Provider-specific function removed from 'node:sqlite';

import { DEFAULT_CHATROOM_ROOM_TYPE // Provider-specific function removed from '../workflows/chatroom-room-types.js';
import { openInitializedChatroomDatabase // Provider-specific function removed from './database-bootstrap.js';

const legacySpeakerIds = ['moderator-chat', 'strategy-chat', 'risk-chat'];

let database: DatabaseSync | undefined;

export function getStoredChatroomDatabase(): DatabaseSync {
***REMOVED***database) {
    return database;
  // Provider-specific function removed

  database = openInitializedChatroomDatabase({
    rootDir: process.cwd(),
    legacySpeakerIds,
    defaultRoomType: DEFAULT_CHATROOM_ROOM_TYPE,
  // Provider-specific function removed);

  return database;
// Provider-specific function removed

export function resetStoredChatroomDatabaseForTests(): void {
  const active = database as (DatabaseSync & { close?: () => void // Provider-specific function removed) | undefined;
  active?.close?.();
  database = undefined;
// Provider-specific function removed
