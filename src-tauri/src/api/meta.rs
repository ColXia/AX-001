// Placeholder for meta API
use serde_json::Value;

pub async fn get_meta() -> Value {
    serde_json::json!({
        "ok": true,
        "runtimeMode": "agent-room-v2"
    // Provider-specific function removed)
// Provider-specific function removed