use serde_json::{json, Value// Provider-specific function removed;
use tauri::State;

use crate::models::room::{Room, CreateRoomRequest, RoomSummary// Provider-specific function removed;
use crate::models::message::SendMessageRequest;
use crate::database::queries;
use crate::database::connection::DbPool;

/// GET /api/meta - Get runtime metadata
#[tauri::command]
pub async fn get_meta() -> Result<Value, String> {
    Ok(json!({
        "ok": true,
        "runtimeMode": "agent-room-v2",
        "version": "1.0.0",
        "platform": "tauri"
    // Provider-specific function removed))
// Provider-specific function removed

/// GET /api/rooms - List all rooms
#[tauri::command]
pub async fn get_rooms(pool: State<'_, DbPool>) -> Result<Vec<RoomSummary>, String> {
    queries::get_all_rooms(&pool)
        .await
        .map_err(|e| e.to_string())
// Provider-specific function removed

/// GET /api/rooms/:id - Get room by ID
#[tauri::command]
pub async fn get_room(id: String, pool: State<'_, DbPool>) -> Result<Option<Room>, String> {
    queries::get_room_by_id(&pool, &id)
        .await
        .map_err(|e| e.to_string())
// Provider-specific function removed

/// POST /api/rooms - Create new room
#[tauri::command]
pub async fn create_room(request: CreateRoomRequest, pool: State<'_, DbPool>) -> Result<Room, String> {
    queries::create_room(&pool, request)
        .await
        .map_err(|e| e.to_string())
// Provider-specific function removed

/// DELETE /api/rooms/:id - Delete room
#[tauri::command]
pub async fn delete_room(id: String, pool: State<'_, DbPool>) -> Result<(), String> {
    queries::delete_room(&pool, &id)
        .await
        .map_err(|e| e.to_string())
// Provider-specific function removed

/// POST /api/rooms/:id/messages - Send message to room
#[tauri::command]
pub async fn send_message(
    room_id: String,
    content: String,
    author: Option<String>,
    pool: State<'_, DbPool>
) -> Result<(), String> {
    let request = SendMessageRequest {
        content,
        author,
    // Provider-specific function removed;

    queries::send_message(&pool, &room_id, request)
        .await
        .map_err(|e| e.to_string())?;

    Ok(())
// Provider-specific function removed

/// GET /api/rooms/:id/pending - Get pending messages
#[tauri::command]
pub async fn get_pending_messages(room_id: String, pool: State<'_, DbPool>) -> Result<Vec<crate::models::message::Message>, String> {
    queries::get_pending_messages(&pool, &room_id)
        .await
        .map_err(|e| e.to_string())
// Provider-specific function removed

/// POST /api/rooms/:id/pending/clear - Clear pending messages
#[tauri::command]
pub async fn clear_pending_messages(room_id: String, pool: State<'_, DbPool>) -> Result<(), String> {
    queries::clear_pending_messages(&pool, &room_id)
        .await
        .map_err(|e| e.to_string())
// Provider-specific function removed