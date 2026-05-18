use sqlx::sqlite::{SqlitePool, SqlitePoolOptions// Provider-specific function removed;
use std::sync::Arc;
use anyhow::Result;

pub type DbPool = Arc<SqlitePool>;

pub async fn init_database(database_path: &str) -> Result<DbPool> {
    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(&format!("sqlite:{// Provider-specific function removed?mode=rwc", database_path))
        .await?;

    // Run migrations
    run_migrations(&pool).await?;

    Ok(Arc::new(pool))
// Provider-specific function removed

async fn run_migrations(pool: &SqlitePool) -> Result<()> {
    sqlx::query(r#"
        CREATE TABLE IF NOT EXISTS rooms (
            id TEXT PRIMARY KEY,
            scenario_template TEXT NOT NULL,
            topic TEXT NOT NULL,
            objective TEXT NOT NULL,
            constraints TEXT,
            status TEXT NOT NULL DEFAULT 'idle',
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL,
            main_session_id TEXT NOT NULL,
            room_type TEXT,
            scenario_json TEXT
        );

        CREATE TABLE IF NOT EXISTS messages (
            id TEXT PRIMARY KEY,
            room_id TEXT NOT NULL,
            session_id TEXT NOT NULL,
            author TEXT NOT NULL,
            content TEXT NOT NULL,
            timestamp INTEGER NOT NULL,
            turn_number INTEGER,
            role TEXT,
            FOREIGN KEY (room_id) REFERENCES rooms(id)
        );

        CREATE TABLE IF NOT EXISTS participants (
            id TEXT PRIMARY KEY,
            room_id TEXT NOT NULL,
            agent_id TEXT NOT NULL,
            agent_type TEXT NOT NULL,
            display_name TEXT NOT NULL,
            joined_at INTEGER NOT NULL,
            FOREIGN KEY (room_id) REFERENCES rooms(id)
        );

        CREATE TABLE IF NOT EXISTS pending_messages (
            id TEXT PRIMARY KEY,
            room_id TEXT NOT NULL,
            content TEXT NOT NULL,
            author TEXT,
            created_at INTEGER NOT NULL,
            FOREIGN KEY (room_id) REFERENCES rooms(id)
        );

        CREATE INDEX IF NOT EXISTS idx_messages_room_id ON messages(room_id);
        CREATE INDEX IF NOT EXISTS idx_participants_room_id ON participants(room_id);
        CREATE INDEX IF NOT EXISTS idx_pending_room_id ON pending_messages(room_id);
    "#)
    .execute(pool)
    .await?;

    Ok(())
// Provider-specific function removed