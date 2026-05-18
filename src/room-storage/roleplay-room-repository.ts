import { DatabaseSync // Provider-specific function removed from 'node:sqlite';
import { randomUUID // Provider-specific function removed from 'node:crypto';
import type { RoleplayRoomState, RoleplayCharacter, RoleplayCharacterMemory // Provider-specific function removed from '../room-core/roleplay-room-state.js';
import type { ChatroomMessage // Provider-specific function removed from '../room-core/message-types.js';
import type { PrivateSession // Provider-specific function removed from '../room-core/private-session-types.js';

const SCHEMA_VERSION = 1;

export function ensureRoleplayTables(db: DatabaseSync): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS roleplay_rooms (
      room_id TEXT PRIMARY KEY,
      main_session_id TEXT NOT NULL,
      topic TEXT NOT NULL,
      objective TEXT NOT NULL,
      scene_json TEXT NOT NULL,
      current_round INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS roleplay_characters (
      character_id TEXT NOT NULL,
      room_id TEXT NOT NULL,
      name TEXT NOT NULL,
      instruction TEXT NOT NULL,
      public_description TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      priority TEXT NOT NULL DEFAULT 'normal',
      talkativeness REAL NOT NULL DEFAULT 0.5,
      memory_json TEXT NOT NULL,
      agent_thread_id TEXT NOT NULL,
      last_active_round INTEGER NOT NULL DEFAULT 0,
      consecutive_silent_rounds INTEGER NOT NULL DEFAULT 0,
      activated_at TEXT,
      deactivated_at TEXT,
      PRIMARY KEY (character_id, room_id),
      FOREIGN KEY (room_id) REFERENCES roleplay_rooms(room_id) ON DELETE CASCADE
    )
  `);
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS roleplay_messages (
      message_id TEXT PRIMARY KEY,
      room_id TEXT NOT NULL,
      round INTEGER NOT NULL,
      role TEXT NOT NULL,
      author_id TEXT NOT NULL,
      author_name TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (room_id) REFERENCES roleplay_rooms(room_id) ON DELETE CASCADE
    )
  `);
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS roleplay_private_sessions (
      session_id TEXT PRIMARY KEY,
      room_id TEXT NOT NULL,
      participant_ids_json TEXT NOT NULL,
      messages_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      last_updated_at TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      initiated_by TEXT NOT NULL,
      FOREIGN KEY (room_id) REFERENCES roleplay_rooms(room_id) ON DELETE CASCADE
    )
  `);
  
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_roleplay_messages_room_round
    ON roleplay_messages(room_id, round)
  `);
  
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_roleplay_characters_room
    ON roleplay_characters(room_id)
  `);
// Provider-specific function removed

function serializeMemory(memory: RoleplayCharacterMemory): string {
  return JSON.stringify({
    observations: memory.observations,
    pendingIntents: memory.pendingIntents,
    establishedFacts: memory.establishedFacts,
    decisions: memory.decisions,
    relationships: Array.from(memory.relationships.entries()).map(([id, rel]) => ({
      targetId: id,
      ...rel,
    // Provider-specific function removed)),
  // Provider-specific function removed);
// Provider-specific function removed

function deserializeMemory(json: string): RoleplayCharacterMemory {
  const data = JSON.parse(json);
  const relationships = new Map<string, { score: number; summary: string // Provider-specific function removed>();
  
***REMOVED***Array.isArray(data.relationships)) {
    for (const rel of data.relationships) {
      relationships.set(rel.targetId, {
        score: rel.score,
        summary: rel.summary,
      // Provider-specific function removed);
    // Provider-specific function removed
  // Provider-specific function removed
  
  return {
    observations: data.observations ?? [],
    pendingIntents: data.pendingIntents ?? [],
    establishedFacts: data.establishedFacts ?? [],
    decisions: data.decisions ?? [],
    relationships,
  // Provider-specific function removed;
// Provider-specific function removed

export function persistRoleplayRoom(db: DatabaseSync, state: RoleplayRoomState): void {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO roleplay_rooms (
      room_id, main_session_id, topic, objective, scene_json,
      current_round, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    state.roomId,
    state.mainSessionId,
    state.topic,
    state.objective,
    JSON.stringify(state.scene),
    state.currentRound,
    state.createdAt,
    state.updatedAt
  );
  
  const charStmt = db.prepare(`
    INSERT OR REPLACE INTO roleplay_characters (
      character_id, room_id, name, instruction, public_description,
      status, priority, talkativeness, memory_json, agent_thread_id,
      last_active_round, consecutive_silent_rounds, activated_at, deactivated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  for (const character of state.characters.values()) {
    charStmt.run(
      character.characterId,
      state.roomId,
      character.name,
      character.instruction,
      character.publicDescription,
      character.status,
      character.priority,
      character.talkativeness,
      serializeMemory(character.memory),
      character.agentThreadId,
      character.lastActiveRound,
      character.consecutiveSilentRounds,
      character.activatedAt ?? null,
      character.deactivatedAt ?? null
    );
  // Provider-specific function removed
  
  const msgStmt = db.prepare(`
    INSERT OR REPLACE INTO roleplay_messages (
      message_id, room_id, round, role, author_id, author_name, content, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  for (const message of state.messages) {
    msgStmt.run(
      message.id,
      state.roomId,
      message.round,
      message.role,
      message.authorId,
      message.authorName,
      message.content,
      message.createdAt
    );
  // Provider-specific function removed
  
  const privStmt = db.prepare(`
    INSERT OR REPLACE INTO roleplay_private_sessions (
      session_id, room_id, participant_ids_json, messages_json,
      created_at, last_updated_at, status, initiated_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  for (const session of state.privateSessions.values()) {
    privStmt.run(
      session.sessionId,
      state.roomId,
      JSON.stringify(session.participantIds),
      JSON.stringify(session.messages),
      session.createdAt,
      session.lastUpdatedAt,
      session.status,
      session.initiatedBy
    );
  // Provider-specific function removed
// Provider-specific function removed

export function loadRoleplayRoom(db: DatabaseSync, roomId: string): RoleplayRoomState | null {
  const roomRow = db
    .prepare(`
      SELECT room_id, main_session_id, topic, objective, scene_json,
             current_round, created_at, updated_at
      FROM roleplay_rooms
      WHERE room_id = ?
    `)
    .get(roomId) as {
      room_id: string;
      main_session_id: string;
      topic: string;
      objective: string;
      scene_json: string;
      current_round: number;
      created_at: string;
      updated_at: string;
    // Provider-specific function removed | undefined;
  
***REMOVED***!roomRow) return null;
  
  const characterRows = db
    .prepare(`
      SELECT character_id, name, instruction, public_description,
             status, priority, talkativeness, memory_json, agent_thread_id,
             last_active_round, consecutive_silent_rounds, activated_at, deactivated_at
      FROM roleplay_characters
      WHERE room_id = ?
    `)
    .all(roomId) as Array<{
      character_id: string;
      name: string;
      instruction: string;
      public_description: string;
      status: string;
      priority: string;
      talkativeness: number;
      memory_json: string;
      agent_thread_id: string;
      last_active_round: number;
      consecutive_silent_rounds: number;
      activated_at: string | null;
      deactivated_at: string | null;
    // Provider-specific function removed>;
  
  const characters = new Map<string, RoleplayCharacter>();
  for (const row of characterRows) {
    characters.set(row.character_id, {
      characterId: row.character_id,
      name: row.name,
      instruction: row.instruction,
      publicDescription: row.public_description,
      status: row.status as RoleplayCharacter['status'],
      priority: row.priority as RoleplayCharacter['priority'],
      talkativeness: row.talkativeness,
      memory: deserializeMemory(row.memory_json),
      agentThreadId: row.agent_thread_id,
      lastActiveRound: row.last_active_round,
      consecutiveSilentRounds: row.consecutive_silent_rounds,
      activatedAt: row.activated_at ?? undefined,
      deactivatedAt: row.deactivated_at ?? undefined,
    // Provider-specific function removed);
  // Provider-specific function removed
  
  const messageRows = db
    .prepare(`
      SELECT message_id, round, role, author_id, author_name, content, created_at
      FROM roleplay_messages
      WHERE room_id = ?
      ORDER BY round ASC, created_at ASC
    `)
    .all(roomId) as Array<{
      message_id: string;
      round: number;
      role: string;
      author_id: string;
      author_name: string;
      content: string;
      created_at: string;
    // Provider-specific function removed>;
  
  const messages: ChatroomMessage[] = messageRows.map(row => ({
    id: row.message_id,
    round: row.round,
    role: row.role as ChatroomMessage['role'],
    authorId: row.author_id,
    authorName: row.author_name,
    content: row.content,
    createdAt: row.created_at,
  // Provider-specific function removed));
  
  const privateRows = db
    .prepare(`
      SELECT session_id, participant_ids_json, messages_json,
             created_at, last_updated_at, status, initiated_by
      FROM roleplay_private_sessions
      WHERE room_id = ?
    `)
    .all(roomId) as Array<{
      session_id: string;
      participant_ids_json: string;
      messages_json: string;
      created_at: string;
      last_updated_at: string;
      status: string;
      initiated_by: string;
    // Provider-specific function removed>;
  
  const privateSessions = new Map<string, PrivateSession>();
  for (const row of privateRows) {
    privateSessions.set(row.session_id, {
      schemaVersion: 1,
      sessionId: row.session_id,
      participantIds: JSON.parse(row.participant_ids_json),
      messages: JSON.parse(row.messages_json),
      createdAt: row.created_at,
      lastUpdatedAt: row.last_updated_at,
      status: row.status as PrivateSession['status'],
      initiatedBy: row.initiated_by,
    // Provider-specific function removed);
  // Provider-specific function removed
  
  return {
    roomId: roomRow.room_id,
    mainSessionId: roomRow.main_session_id,
    topic: roomRow.topic,
    objective: roomRow.objective,
    scene: JSON.parse(roomRow.scene_json),
    characters,
    messages,
    privateSessions,
    privateSessionLastReadRound: new Map(),
    currentRound: roomRow.current_round,
    createdAt: roomRow.created_at,
    updatedAt: roomRow.updated_at,
  // Provider-specific function removed;
// Provider-specific function removed

export function deleteRoleplayRoom(db: DatabaseSync, roomId: string): void {
  db.prepare('DELETE FROM roleplay_messages WHERE room_id = ?').run(roomId);
  db.prepare('DELETE FROM roleplay_private_sessions WHERE room_id = ?').run(roomId);
  db.prepare('DELETE FROM roleplay_characters WHERE room_id = ?').run(roomId);
  db.prepare('DELETE FROM roleplay_rooms WHERE room_id = ?').run(roomId);
// Provider-specific function removed

export function listRoleplayRooms(db: DatabaseSync): Array<{
  roomId: string;
  topic: string;
  currentRound: number;
  characterCount: number;
  createdAt: string;
  updatedAt: string;
// Provider-specific function removed> {
  const rows = db
    .prepare(`
      SELECT r.room_id, r.topic, r.current_round, r.created_at, r.updated_at,
             (SELECT COUNT(*) FROM roleplay_characters c WHERE c.room_id = r.room_id) as character_count
      FROM roleplay_rooms r
      ORDER BY r.updated_at DESC
    `)
    .all() as Array<{
      room_id: string;
      topic: string;
      current_round: number;
      character_count: number;
      created_at: string;
      updated_at: string;
    // Provider-specific function removed>;
  
  return rows.map(row => ({
    roomId: row.room_id,
    topic: row.topic,
    currentRound: row.current_round,
    characterCount: row.character_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  // Provider-specific function removed));
// Provider-specific function removed
