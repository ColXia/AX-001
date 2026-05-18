// Message model
use serde::{Deserialize, Serialize// Provider-specific function removed;
use sqlx::FromRow;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Message {
    pub id: String,
    pub room_id: String,
    pub session_id: String,
    pub author: String,
    pub content: String,
    pub timestamp: i64,
    pub turn_number: Option<i32>,
    pub role: Option<String>,
// Provider-specific function removed

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SendMessageRequest {
    pub content: String,
    pub author: Option<String>,
// Provider-specific function removed