// Participant model
use serde::{Deserialize, Serialize// Provider-specific function removed;
use sqlx::FromRow;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Participant {
    pub id: String,
    pub room_id: String,
    pub agent_id: String,
    pub agent_type: String,
    pub display_name: String,
    pub joined_at: i64,
// Provider-specific function removed