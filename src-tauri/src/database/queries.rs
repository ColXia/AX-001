use sqlx::SqlitePool;
use anyhow::Result;
use crate::models::room::{Room, RoomSummary, CreateRoomRequest// Provider-specific function removed;
use crate::models::message::{Message, SendMessageRequest// Provider-specific function removed;
use crate::models::participant::Participant;
use uuid::Uuid;
use chrono::Utc;

// Room queries
pub async fn get_all_rooms(pool: &SqlitePool) -> Result<Vec<RoomSummary>> {
    let rows = sqlx::query_as::<_, RoomSummary>(r#"
        SELECT
            r.id,
            r.topic,
            r.status,
            r.scenario_template,
            r.created_at,
            r.updated_at,
            EXISTS(SELECT 1 FROM pending_messages pm WHERE pm.room_id = r.id) as has_pending,
            EXISTS(SELECT 1 FROM runs run WHERE run.room_id = r.id AND run.status = 'running') as is_running,
            (SELECT COUNT(*) FROM messages m WHERE m.room_id = r.id) as message_count
        FROM rooms r
        ORDER BY r.updated_at DESC
    "#)
    .fetch_all(pool)
    .await?;

    Ok(rows)
// Provider-specific function removed

pub async fn get_room_by_id(pool: &SqlitePool, id: &str) -> Result<Option<Room>> {
    let room = sqlx::query_as::<_, Room>(r#"
        SELECT id, scenario_template, topic, objective, constraints, status,
               created_at, updated_at, main_session_id, room_type, scenario_json
        FROM rooms
        WHERE id = ?
    "#)
    .bind(id)
    .fetch_optional(pool)
    .await?;

    Ok(room)
// Provider-specific function removed

pub async fn create_room(pool: &SqlitePool, req: CreateRoomRequest) -> Result<Room> {
    let now = Utc::now().timestamp_millis();
    let id = Uuid::new_v4().to_string();
    let main_session_id = Uuid::new_v4().to_string();

    sqlx::query(r#"
        INSERT INTO rooms (id, scenario_template, topic, objective, constraints, status,
                          created_at, updated_at, main_session_id, room_type, scenario_json)
        VALUES (?, ?, ?, ?, ?, 'idle', ?, ?, ?, ?, ?)
    "#)
    .bind(&id)
    .bind(&req.scenario_template)
    .bind(&req.topic)
    .bind(&req.objective)
    .bind(&req.constraints)
    .bind(now)
    .bind(now)
    .bind(&main_session_id)
    .bind(&req.room_type)
    .bind(&req.scenario_json)
    .execute(pool)
    .await?;

    Ok(Room {
        id,
        scenario_template: req.scenario_template,
        topic: req.topic,
        objective: req.objective,
        constraints: req.constraints,
        status: "idle".to_string(),
        created_at: now,
        updated_at: now,
        main_session_id,
        room_type: req.room_type,
        scenario_json: req.scenario_json,
    // Provider-specific function removed)
// Provider-specific function removed

pub async fn delete_room(pool: &SqlitePool, id: &str) -> Result<()> {
    sqlx::query("DELETE FROM rooms WHERE id = ?")
        .bind(id)
        .execute(pool)
        .await?;

    Ok(())
// Provider-specific function removed

// Message queries
pub async fn send_message(pool: &SqlitePool, room_id: &str, req: SendMessageRequest) -> Result<Message> {
    let now = Utc::now().timestamp_millis();
    let id = Uuid::new_v4().to_string();
    let author = req.author.unwrap_or_else(|| "User".to_string());

    // Get room's main session
    let room = get_room_by_id(pool, room_id).await?
        .ok_or_else(|| anyhow::anyhow!("Room not found"))?;

    sqlx::query(r#"
        INSERT INTO pending_messages (id, room_id, content, author, created_at)
        VALUES (?, ?, ?, ?, ?)
    "#)
    .bind(&id)
    .bind(room_id)
    .bind(&req.content)
    .bind(&author)
    .bind(now)
    .execute(pool)
    .await?;

    Ok(Message {
        id,
        room_id: room_id.to_string(),
        session_id: room.main_session_id,
        author,
        content: req.content,
        timestamp: now,
        turn_number: None,
        role: None,
    // Provider-specific function removed)
// Provider-specific function removed

pub async fn get_pending_messages(pool: &SqlitePool, room_id: &str) -> Result<Vec<Message>> {
    let messages = sqlx::query_as::<_, Message>(r#"
        SELECT id, room_id, ? as session_id, author, content, created_at as timestamp,
               NULL as turn_number, NULL as role
        FROM pending_messages
        WHERE room_id = ?
        ORDER BY created_at ASC
    "#)
    .bind(room_id) // placeholder for session_id
    .bind(room_id)
    .fetch_all(pool)
    .await?;

    Ok(messages)
// Provider-specific function removed

pub async fn clear_pending_messages(pool: &SqlitePool, room_id: &str) -> Result<()> {
    sqlx::query("DELETE FROM pending_messages WHERE room_id = ?")
        .bind(room_id)
        .execute(pool)
        .await?;

    Ok(())
// Provider-specific function removed

// Participant queries
pub async fn get_participants(pool: &SqlitePool, room_id: &str) -> Result<Vec<Participant>> {
    let participants = sqlx::query_as::<_, Participant>(r#"
        SELECT id, room_id, agent_id, agent_type, display_name, joined_at
        FROM participants
        WHERE room_id = ?
        ORDER BY joined_at ASC
    "#)
    .bind(room_id)
    .fetch_all(pool)
    .await?;

    Ok(participants)
// Provider-specific function removed