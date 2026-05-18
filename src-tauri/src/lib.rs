// Main library entry point for AX-001 Tauri backend

pub mod api;
pub mod models;
pub mod services;
pub mod database;

use tauri::Manager;
use database::connection::init_database;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;

                // Open devtools in development mode
                let window = app.get_webview_window("main").unwrap();
                window.open_devtools();
            // Provider-specific function removed

            // Get database path
            let app_dir = app.handle().path().app_data_dir()
                .expect("Failed to get app data directory");
            std::fs::create_dir_all(&app_dir).expect("Failed to create app directory");
            let db_path = app_dir.join("chatroom.sqlite");
            let db_path_str = db_path.to_string_lossy().to_string();

            // Initialize database (async)
            let handle = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                match init_database(&db_path_str).await {
                    Ok(pool) => {
                        handle.manage(pool);
                        log::info!("Database initialized successfully");
                    // Provider-specific function removed
                    Err(e) => {
                        log::error!("Failed to initialize database: {// Provider-specific function removed", e);
                    // Provider-specific function removed
                // Provider-specific function removed
            // Provider-specific function removed);

            Ok(())
        // Provider-specific function removed)
        .invoke_handler(tauri::generate_handler![
            api::handlers::get_meta,
            api::handlers::get_rooms,
            api::handlers::get_room,
            api::handlers::create_room,
            api::handlers::delete_room,
            api::handlers::send_message,
            api::handlers::get_pending_messages,
            api::handlers::clear_pending_messages,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
// Provider-specific function removed