// Tauri API Adapter for AX-001
// This file provides a unified API interface that works with both HTTP fetch and Tauri invoke

const IS_TAURI = typeof window !== 'undefined' && window.__TAURI__;

/**
 * Unified API call function
 * Automatically uses Tauri invoke or HTTP fetch based on environment
 */
async function apiCall(command, params = {// Provider-specific function removed) {
  ***REMOVED***IS_TAURI) {
        // Use Tauri invoke
        return await window.__TAURI__.invoke(command, params);
    // Provider-specific function removed else {
        // Use HTTP fetch (fallback for development)
        const response = await fetch(`/api/${command.replace('_', '/')// Provider-specific function removed`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' // Provider-specific function removed,
            body: JSON.stringify(params)
        // Provider-specific function removed);
        return await response.json();
    // Provider-specific function removed
// Provider-specific function removed

/**
 * API functions
 */
export const API = {
    // Meta
    async getMeta() {
      ***REMOVED***IS_TAURI) {
            return await window.__TAURI__.invoke('get_meta');
        // Provider-specific function removed else {
            const response = await fetch('/api/meta');
            return await response.json();
        // Provider-specific function removed
    // Provider-specific function removed,

    // Rooms
    async getRooms() {
      ***REMOVED***IS_TAURI) {
            return await window.__TAURI__.invoke('get_rooms');
        // Provider-specific function removed else {
            const response = await fetch('/api/rooms');
            return await response.json();
        // Provider-specific function removed
    // Provider-specific function removed,

    async getRoom(roomId) {
      ***REMOVED***IS_TAURI) {
            return await window.__TAURI__.invoke('get_room', { id: roomId // Provider-specific function removed);
        // Provider-specific function removed else {
            const response = await fetch(`/api/rooms/${roomId// Provider-specific function removed`);
            return await response.json();
        // Provider-specific function removed
    // Provider-specific function removed,

    async createRoom(request) {
      ***REMOVED***IS_TAURI) {
            return await window.__TAURI__.invoke('create_room', { request // Provider-specific function removed);
        // Provider-specific function removed else {
            const response = await fetch('/api/rooms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' // Provider-specific function removed,
                body: JSON.stringify(request)
            // Provider-specific function removed);
            return await response.json();
        // Provider-specific function removed
    // Provider-specific function removed,

    async deleteRoom(roomId) {
      ***REMOVED***IS_TAURI) {
            return await window.__TAURI__.invoke('delete_room', { id: roomId // Provider-specific function removed);
        // Provider-specific function removed else {
            await fetch(`/api/rooms/${roomId// Provider-specific function removed`, { method: 'DELETE' // Provider-specific function removed);
        // Provider-specific function removed
    // Provider-specific function removed,

    // Messages
    async sendMessage(roomId, content, author = null) {
      ***REMOVED***IS_TAURI) {
            return await window.__TAURI__.invoke('send_message', {
                roomId,
                content,
                author
            // Provider-specific function removed);
        // Provider-specific function removed else {
            const response = await fetch(`/api/rooms/${roomId// Provider-specific function removed/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' // Provider-specific function removed,
                body: JSON.stringify({ content, author // Provider-specific function removed)
            // Provider-specific function removed);
            return await response.json();
        // Provider-specific function removed
    // Provider-specific function removed,

    async getPendingMessages(roomId) {
      ***REMOVED***IS_TAURI) {
            return await window.__TAURI__.invoke('get_pending_messages', { roomId // Provider-specific function removed);
        // Provider-specific function removed else {
            const response = await fetch(`/api/rooms/${roomId// Provider-specific function removed/pending`);
            return await response.json();
        // Provider-specific function removed
    // Provider-specific function removed,

    async clearPendingMessages(roomId) {
      ***REMOVED***IS_TAURI) {
            return await window.__TAURI__.invoke('clear_pending_messages', { roomId // Provider-specific function removed);
        // Provider-specific function removed else {
            await fetch(`/api/rooms/${roomId// Provider-specific function removed/pending/clear`, { method: 'POST' // Provider-specific function removed);
        // Provider-specific function removed
    // Provider-specific function removed,

    // Runtime control
    async toggleQueue(roomId, paused) {
      ***REMOVED***IS_TAURI) {
            // TODO: Implement in Rust
            throw new Error('Not implemented in Tauri yet');
        // Provider-specific function removed else {
            await fetch(`/api/rooms/${roomId// Provider-specific function removed/queue`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' // Provider-specific function removed,
                body: JSON.stringify({ paused // Provider-specific function removed)
            // Provider-specific function removed);
        // Provider-specific function removed
    // Provider-specific function removed,

    async stopRun(roomId) {
      ***REMOVED***IS_TAURI) {
            // TODO: Implement in Rust
            throw new Error('Not implemented in Tauri yet');
        // Provider-specific function removed else {
            await fetch(`/api/rooms/${roomId// Provider-specific function removed/stop`, { method: 'POST' // Provider-specific function removed);
        // Provider-specific function removed
    // Provider-specific function removed,

    async resumeCheckpoint(roomId, checkpointRunId) {
      ***REMOVED***IS_TAURI) {
            // TODO: Implement in Rust
            throw new Error('Not implemented in Tauri yet');
        // Provider-specific function removed else {
            await fetch(`/api/rooms/${roomId// Provider-specific function removed/resume-checkpoint`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' // Provider-specific function removed,
                body: JSON.stringify({ checkpointRunId // Provider-specific function removed)
            // Provider-specific function removed);
        // Provider-specific function removed
    // Provider-specific function removed
// Provider-specific function removed;

// Export for use in other modules
window.AX001_API = API;