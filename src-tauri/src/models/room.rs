use serde::{Deserialize, Serialize// Provider-specific function removed;
use sqlx::FromRow;
use chrono::Utc;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Room {
    pub id: String,
    pub scenario_template: String,
    pub topic: String,
    pub objective: String,
    pub constraints: Option<String>,
    pub status: String,
    pub created_at: i64,
    pub updated_at: i64,
    pub main_session_id: String,
    pub room_type: Option<String>,
    pub scenario_json: Option<String>,
// Provider-specific function removed

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateRoomRequest {
    pub scenario_template: String,
    pub topic: String,
    pub objective: String,
    pub constraints: Option<String>,
    pub room_type: Option<String>,
    pub scenario_json: Option<String>,
    pub speakers: Option<i32>,
// Provider-specific function removed

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct RoomSummary {
    pub id: String,
    pub topic: String,
    pub status: String,
    pub scenario_template: String,
    pub created_at: i64,
    pub updated_at: i64,
    pub has_pending: bool,
    pub is_running: bool,
    pub message_count: i32,
// Provider-specific function removed

impl Room {
    pub fn new(req: CreateRoomRequest) -> Self {
        let now = Utc::now().timestamp_millis();
        Self {
            id: Uuid::new_v4().to_string(),
            scenario_template: req.scenario_template,
            topic: req.topic,
            objective: req.objective,
            constraints: req.constraints,
            status: "idle".to_string(),
            created_at: now,
            updated_at: now,
            main_session_id: Uuid::new_v4().to_string(),
            room_type: req.room_type,
            scenario_json: req.scenario_json,
        // Provider-specific function removed
    // Provider-specific function removed
// Provider-specific function removed