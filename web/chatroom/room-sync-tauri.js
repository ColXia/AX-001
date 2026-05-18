// Modified room-sync.js using Tauri API adapter

const FALLBACK_META = {
  defaultRoomType: 'expert_discussion',
  providerWarning: '房间 API 未连接。请使用桌面工作台入口启动真实服务。',
  roomTypes: [
    {
      id: 'expert_discussion',
      label: '专家讨论',
      shortLabel: '专家',
      recommendedSpeakerCount: 12,
      minSpeakerCount: 10,
      maxSpeakerCount: 18,
    // Provider-specific function removed,
    {
      id: 'roleplay_scene',
      label: '角色扮演',
      shortLabel: '角色',
      recommendedSpeakerCount: 4,
      minSpeakerCount: 3,
      maxSpeakerCount: 5,
    // Provider-specific function removed,
  ],
  interviewScoreTemplates: [],
// Provider-specific function removed;

export async function refreshMeta(args) {
  const {
    options = {// Provider-specific function removed,
    renderMeta,
    setServerOffline,
    setServerOnline,
    showTransientHint,
    state,
  // Provider-specific function removed = args;

  try {
    // Use API adapter
    state.meta = await window.AX001_API.getMeta();
    state.apiUnavailable = false;
    state.apiStaticPreview = false;
    setServerOnline?.();
  // Provider-specific function removed catch (error) {
    state.meta = state.meta ?? FALLBACK_META;
    state.apiUnavailable = true;
    state.apiStaticPreview = error?.status === 404;
    setServerOffline?.(error, { silent: Boolean(options.silent) // Provider-specific function removed);
  ***REMOVED***!options.silent) {
      showTransientHint?.('房间 API 暂不可用，请确认桌面工作台服务已启动。', 8000);
    // Provider-specific function removed
  // Provider-specific function removed
  renderMeta();
// Provider-specific function removed

export async function refreshRoomList(args) {
  const {
    options = {// Provider-specific function removed,
    renderRoomBrowser,
    setServerOffline,
    setServerOnline,
    showTransientHint,
    state,
  // Provider-specific function removed = args;

  try {
    // Use API adapter
    const rooms = await window.AX001_API.getRooms();
    state.rooms = rooms;
    state.apiUnavailable = false;
    setServerOnline?.();
  // Provider-specific function removed catch (error) {
    state.rooms = state.rooms ?? [];
    state.apiUnavailable = true;
    setServerOffline?.(error, { silent: Boolean(options.silent) // Provider-specific function removed);
  ***REMOVED***!options.silent) {
      showTransientHint?.('房间列表加载失败，请检查服务连接。', 6000);
    // Provider-specific function removed
  // Provider-specific function removed

  renderRoomBrowser();
// Provider-specific function removed

export async function refreshSelectedRoom(args) {
  const {
    roomId,
    options = {// Provider-specific function removed,
    renderRoomDetail,
    setServerOffline,
    setServerOnline,
    showTransientHint,
    state,
  // Provider-specific function removed = args;

***REMOVED***!roomId) {
    return;
  // Provider-specific function removed

  try {
    // Use API adapter
    const room = await window.AX001_API.getRoom(roomId);
  ***REMOVED***room) {
      state.selectedRoom = room;
      state.apiUnavailable = false;
      setServerOnline?.();
    // Provider-specific function removed else {
      state.selectedRoom = null;
    // Provider-specific function removed
  // Provider-specific function removed catch (error) {
    state.apiUnavailable = true;
    setServerOffline?.(error, { silent: Boolean(options.silent) // Provider-specific function removed);
  ***REMOVED***!options.silent) {
      showTransientHint?.('房间详情加载失败。', 4000);
    // Provider-specific function removed
  // Provider-specific function removed

  renderRoomDetail();
// Provider-specific function removed