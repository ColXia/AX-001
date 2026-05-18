// Modified room-actions.js using Tauri API adapter

export async function sendMessage(args) {
  const {
    roomId,
    content,
    author,
    showTransientHint,
    clearComposer,
    refreshSelectedRoom,
  // Provider-specific function removed = args;

  try {
    await window.AX001_API.sendMessage(roomId, content, author);
    clearComposer?.();
    showTransientHint?.('消息已发送', 2000);
    refreshSelectedRoom?.();
  // Provider-specific function removed catch (error) {
    showTransientHint?.('发送失败，请重试', 4000);
    throw error;
  // Provider-specific function removed
// Provider-specific function removed

export async function createRoom(args) {
  const {
    request,
    showTransientHint,
    navigateToRoom,
  // Provider-specific function removed = args;

  try {
    const room = await window.AX001_API.createRoom(request);
    showTransientHint?.('房间已创建', 2000);
    navigateToRoom?.(room.id);
    return room;
  // Provider-specific function removed catch (error) {
    showTransientHint?.('创建失败，请重试', 4000);
    throw error;
  // Provider-specific function removed
// Provider-specific function removed

export async function deleteRoom(args) {
  const {
    roomId,
    showTransientHint,
    navigateToRoomList,
  // Provider-specific function removed = args;

  try {
    await window.AX001_API.deleteRoom(roomId);
    showTransientHint?.('房间已删除', 2000);
    navigateToRoomList?.();
  // Provider-specific function removed catch (error) {
    showTransientHint?.('删除失败，请重试', 4000);
    throw error;
  // Provider-specific function removed
// Provider-specific function removed

export async function clearPendingMessages(args) {
  const {
    roomId,
    showTransientHint,
    refreshSelectedRoom,
  // Provider-specific function removed = args;

  try {
    await window.AX001_API.clearPendingMessages(roomId);
    showTransientHint?.('待处理消息已清空', 2000);
    refreshSelectedRoom?.();
  // Provider-specific function removed catch (error) {
    showTransientHint?.('清空失败，请重试', 4000);
    throw error;
  // Provider-specific function removed
// Provider-specific function removed

export async function toggleQueue(args) {
  const {
    roomId,
    paused,
    showTransientHint,
    refreshSelectedRoom,
  // Provider-specific function removed = args;

  try {
    await window.AX001_API.toggleQueue(roomId, paused);
    showTransientHint?.(paused ? '队列已暂停' : '队列已恢复', 2000);
    refreshSelectedRoom?.();
  // Provider-specific function removed catch (error) {
    showTransientHint?.('操作失败，请重试', 4000);
    throw error;
  // Provider-specific function removed
// Provider-specific function removed

export async function stopRun(args) {
  const {
    roomId,
    showTransientHint,
    refreshSelectedRoom,
  // Provider-specific function removed = args;

  try {
    await window.AX001_API.stopRun(roomId);
    showTransientHint?.('运行已停止', 2000);
    refreshSelectedRoom?.();
  // Provider-specific function removed catch (error) {
    showTransientHint?.('停止失败，请重试', 4000);
    throw error;
  // Provider-specific function removed
// Provider-specific function removed

export async function resumeCheckpoint(args) {
  const {
    roomId,
    checkpointRunId,
    showTransientHint,
    refreshSelectedRoom,
  // Provider-specific function removed = args;

  try {
    await window.AX001_API.resumeCheckpoint(roomId, checkpointRunId);
    showTransientHint?.('检查点已恢复', 2000);
    refreshSelectedRoom?.();
  // Provider-specific function removed catch (error) {
    showTransientHint?.('恢复失败，请重试', 4000);
    throw error;
  // Provider-specific function removed
// Provider-specific function removed