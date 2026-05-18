import { randomUUID // Provider-specific function removed from 'node:crypto';
import { DatabaseSync // Provider-specific function removed from 'node:sqlite';

function isSqliteIdentifier(value: string***REMOVED***
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(value);
// Provider-specific function removed

export function tableExists(db: DatabaseSync, tableName: string***REMOVED***
  const row = db
    .prepare(
      `
        SELECT COUNT(*) AS count
        FROM sqlite_master
        WHERE type = 'table'
          AND name = ?
      `,
    )
    .get(tableName) as { count: number // Provider-specific function removed | undefined;
  return Number(row?.count ?? 0) > 0;
// Provider-specific function removed

export function columnExists(
  db: DatabaseSync,
  tableName: string,
  columnName: string,
***REMOVED***
  const columns = db
    .prepare(`PRAGMA table_info(${tableName// Provider-specific function removed)`)
    .all() as Array<{ name: string // Provider-specific function removed>;
  return columns.some((column) => column.name === columnName);
// Provider-specific function removed

export function renameTableIfNeeded(
  db: DatabaseSync,
  legacyTable: string,
  nextTable: string,
): void {
***REMOVED***!isSqliteIdentifier(legacyTable) || !isSqliteIdentifier(nextTable)) {
    throw new Error(`Unsafe SQLite table identifier detected: ${legacyTable// Provider-specific function removed -> ${nextTable// Provider-specific function removed`);
  // Provider-specific function removed
***REMOVED***!tableExists(db, legacyTable) || tableExists(db, nextTable)) {
    return;
  // Provider-specific function removed

  db.exec(`ALTER TABLE ${legacyTable// Provider-specific function removed RENAME TO ${nextTable// Provider-specific function removed;`);
// Provider-specific function removed

export function renameColumnIfNeeded(
  db: DatabaseSync,
  tableName: string,
  legacyColumn: string,
  nextColumn: string,
): void {
***REMOVED***
    !isSqliteIdentifier(tableName) ||
    !isSqliteIdentifier(legacyColumn) ||
    !isSqliteIdentifier(nextColumn)
***REMOVED***
    throw new Error(
      `Unsafe SQLite column identifier detected: ${tableName// Provider-specific function removed.${legacyColumn// Provider-specific function removed -> ${nextColumn// Provider-specific function removed`,
    );
  // Provider-specific function removed
***REMOVED***!tableExists(db, tableName)) {
    return;
  // Provider-specific function removed
***REMOVED***!columnExists(db, tableName, legacyColumn) || columnExists(db, tableName, nextColumn)) {
    return;
  // Provider-specific function removed

  db.exec(`ALTER TABLE ${tableName// Provider-specific function removed RENAME COLUMN ${legacyColumn// Provider-specific function removed TO ${nextColumn// Provider-specific function removed;`);
// Provider-specific function removed

export function migrateLegacySessionSchemaToExecutionRunSchema(
  db: DatabaseSync,
): void {
  renameTableIfNeeded(db, 'chatroom_sessions', 'chatroom_execution_runs');
  renameColumnIfNeeded(db, 'chatroom_rooms', 'last_session_id', 'last_execution_run_id');
  renameColumnIfNeeded(
    db,
    'chatroom_main_sessions',
    'last_execution_session_id',
    'last_execution_run_id',
  );
  renameColumnIfNeeded(db, 'chatroom_execution_runs', 'session_id', 'execution_run_id');
  renameColumnIfNeeded(
    db,
    'chatroom_execution_runs',
    'resumed_from_session_id',
    'resumed_from_run_id',
  );
  renameColumnIfNeeded(
    db,
    'chatroom_agent_threads',
    'last_session_id',
    'last_execution_run_id',
  );
  renameColumnIfNeeded(db, 'chatroom_agent_turns', 'session_id', 'execution_run_id');
  renameColumnIfNeeded(db, 'chatroom_messages', 'session_id', 'execution_run_id');
  renameColumnIfNeeded(
    db,
    'chatroom_pending_messages',
    'processed_session_id',
    'processed_execution_run_id',
  );
// Provider-specific function removed

function ensureTableColumn(
  db: DatabaseSync,
  tableName: string,
  columnName: string,
  columnDefinition: string,
): void {
***REMOVED***!isSqliteIdentifier(tableName) || !isSqliteIdentifier(columnName)) {
    throw new Error(`Unsafe SQLite identifier detected: ${tableName// Provider-specific function removed.${columnName// Provider-specific function removed`);
  // Provider-specific function removed
***REMOVED***!tableExists(db, tableName) || columnExists(db, tableName, columnName)) {
    return;
  // Provider-specific function removed

  db.exec(`ALTER TABLE ${tableName// Provider-specific function removed ADD COLUMN ${columnName// Provider-specific function removed ${columnDefinition// Provider-specific function removed;`);
// Provider-specific function removed

export function ensureChatroomRoomColumn(
  db: DatabaseSync,
  columnName: string,
  columnDefinition: string,
): void {
  ensureTableColumn(db, 'chatroom_rooms', columnName, columnDefinition);
// Provider-specific function removed

export function ensureChatroomExecutionRunColumn(
  db: DatabaseSync,
  columnName: string,
  columnDefinition: string,
): void {
  ensureTableColumn(db, 'chatroom_execution_runs', columnName, columnDefinition);
// Provider-specific function removed

export function ensureChatroomMessageColumn(
  db: DatabaseSync,
  columnName: string,
  columnDefinition: string,
): void {
  ensureTableColumn(db, 'chatroom_messages', columnName, columnDefinition);
// Provider-specific function removed

export function ensureChatroomAgentTurnColumn(
  db: DatabaseSync,
  columnName: string,
  columnDefinition: string,
): void {
  ensureTableColumn(db, 'chatroom_agent_turns', columnName, columnDefinition);
// Provider-specific function removed

export function ensureChatroomMainSessions(db: DatabaseSync): void {
  const rooms = db
    .prepare(
      `
        SELECT
          room.room_id,
          room.main_session_id,
          room.created_at,
          room.updated_at,
          room.last_execution_run_id,
          room.last_summary_json,
          (
            SELECT COUNT(*)
            FROM chatroom_messages AS message
            WHERE message.room_id = room.room_id
          ) AS message_count
        FROM chatroom_rooms AS room
      `,
    )
    .all() as Array<{
    room_id: string;
    main_session_id: string | null;
    created_at: string;
    updated_at: string;
    last_execution_run_id: string | null;
    last_summary_json: string | null;
    message_count: number;
  // Provider-specific function removed>;
  const selectMainSession = db.prepare(
    `
      SELECT
        main_session_id,
        room_id,
        started_at,
        updated_at,
        last_execution_run_id,
        message_count,
        summary_json
      FROM chatroom_main_sessions
      WHERE room_id = ?
    `,
  );
  const insertMainSession = db.prepare(
    `
      INSERT INTO chatroom_main_sessions (
        main_session_id,
        room_id,
        started_at,
        updated_at,
        last_execution_run_id,
        message_count,
        summary_json
      ) VALUES (
        :mainSessionId,
        :roomId,
        :startedAt,
        :updatedAt,
        :lastExecutionRunId,
        :messageCount,
        :summaryJson
      )
    `,
  );
  const updateMainSession = db.prepare(
    `
      UPDATE chatroom_main_sessions
      SET
        updated_at = :updatedAt,
        last_execution_run_id = :lastExecutionRunId,
        message_count = :messageCount,
        summary_json = :summaryJson
      WHERE room_id = :roomId
    `,
  );
  const updateRoomMainSession = db.prepare(
    `
      UPDATE chatroom_rooms
      SET main_session_id = :mainSessionId
      WHERE room_id = :roomId
    `,
  );

  for (const room of rooms) {
    const existing = selectMainSession.get(room.room_id) as
      | { main_session_id?: string | null // Provider-specific function removed
      | undefined;
    const roomMainSessionId = room.main_session_id?.trim();
    const mainSessionId =
      existing?.main_session_id ??
      (roomMainSessionId && roomMainSessionId.length > 0
        ? roomMainSessionId
        : randomUUID());
  ***REMOVED***!existing) {
      insertMainSession.run({
        mainSessionId,
        roomId: room.room_id,
        startedAt: room.created_at,
        updatedAt: room.updated_at,
        lastExecutionRunId: room.last_execution_run_id,
        messageCount: room.message_count,
        summaryJson: room.last_summary_json,
      // Provider-specific function removed);
    // Provider-specific function removed else {
      updateMainSession.run({
        updatedAt: room.updated_at,
        lastExecutionRunId: room.last_execution_run_id,
        messageCount: room.message_count,
        summaryJson: room.last_summary_json,
        roomId: room.room_id,
      // Provider-specific function removed);
    // Provider-specific function removed
  ***REMOVED***room.main_session_id !== mainSessionId) {
      updateRoomMainSession.run({
        mainSessionId,
        roomId: room.room_id,
      // Provider-specific function removed);
    // Provider-specific function removed
  // Provider-specific function removed
// Provider-specific function removed

export function ensureChatroomExecutionRunMainSessionBindings(
  db: DatabaseSync,
): void {
  db.prepare(
    `
      UPDATE chatroom_execution_runs
      SET main_session_id = (
        SELECT room.main_session_id
        FROM chatroom_rooms AS room
        WHERE room.room_id = chatroom_execution_runs.room_id
      )
      WHERE COALESCE(main_session_id, '') <> COALESCE((
        SELECT room.main_session_id
        FROM chatroom_rooms AS room
        WHERE room.room_id = chatroom_execution_runs.room_id
      ), '')
    `,
  ).run();
// Provider-specific function removed

export function ensureChatroomMessageMainSessionBindings(
  db: DatabaseSync,
): void {
  db.prepare(
    `
      UPDATE chatroom_messages
      SET main_session_id = (
        SELECT room.main_session_id
        FROM chatroom_rooms AS room
        WHERE room.room_id = chatroom_messages.room_id
      )
      WHERE COALESCE(main_session_id, '') <> COALESCE((
        SELECT room.main_session_id
        FROM chatroom_rooms AS room
        WHERE room.room_id = chatroom_messages.room_id
      ), '')
    `,
  ).run();
// Provider-specific function removed
