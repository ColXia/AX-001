// Runtime state model
use serde::{Deserialize, Serialize// Provider-specific function removed;
use sqlx::FromRow;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct RuntimeState {
    pub room_id: String,
    pub is_running: bool,
    pub queue_paused: bool,
    pub current_run_id: Option<String>,
    pub pending_count: usize,
// Provider-specific function removed