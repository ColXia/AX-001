/**
 * Base App - 前端基座核心
 *
 * 提供房间平台的通用功能，支持插件扩展
 */

import { createPluginConfig, validatePlugin // Provider-specific function removed from './plugin-interface.js';

const POLL_INTERVAL_ROOM = 1200;
const POLL_INTERVAL_LIST = 2000;

export class BaseApp {
  constructor() {
    this.plugins = new Map();
    this.currentPlugin = null;
    this.state = {
      meta: null,
      rooms: [],
      selectedRoomId: null,
      currentRoom: null,
      filters: {
        query: '',
        status: 'all',
        roomType: 'all',
      // Provider-specific function removed,
      // 记录用户是否在底部
      wasAtBottom: true,
    // Provider-specific function removed;
    this.elements = {// Provider-specific function removed;
    this.pollTimers = {
      room: null,
      list: null,
    // Provider-specific function removed;
    this.isDestroyed = false;
  // Provider-specific function removed

  async init() {
    this.collectElements();
    await this.loadMeta();
    await this.loadRoomList();
    this.startPolling();
    this.bindEvents();
    this.render();
  // Provider-specific function removed

  collectElements() {
    this.elements = {
      appTitle: document.getElementById('app-title'),
      roomTypeBadge: document.getElementById('room-type-badge'),
      headerActions: document.getElementById('header-actions'),
      roomBrowser: document.getElementById('room-browser'),
      roomList: document.getElementById('room-list'),
      roomSearchInput: document.getElementById('room-search-input'),
      roomStatusFilter: document.getElementById('room-status-filter'),
      roomTypeFilter: document.getElementById('room-type-filter'),
      roomDetail: document.getElementById('room-detail'),
      roomBanner: document.getElementById('room-banner'),
      messageList: document.getElementById('message-list'),
      composer: document.getElementById('composer'),
      runtimePanel: document.getElementById('runtime-panel'),
      createRoomBtn: document.getElementById('create-room-btn'),
      createRoomDialog: document.getElementById('create-room-dialog'),
      createRoomForm: document.getElementById('create-room-form'),
      closeDialogBtn: document.getElementById('close-dialog-btn'),
      cancelCreateBtn: document.getElementById('cancel-create-btn'),
    // Provider-specific function removed;
  // Provider-specific function removed

  registerPlugin(plugin) {
    validatePlugin(plugin);
    plugin.config = createPluginConfig(plugin.config);
    this.plugins.set(plugin.roomType, plugin);

  ***REMOVED***plugin.styles) {
      this.loadPluginStyles(plugin.styles);
    // Provider-specific function removed

  ***REMOVED***plugin.onInit) {
      plugin.onInit(this);
    // Provider-specific function removed
  // Provider-specific function removed

  loadPluginStyles(url) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
  // Provider-specific function removed

  getPlugin(roomType) {
    return this.plugins.get(roomType);
  // Provider-specific function removed

  async loadMeta() {
    try {
      const response = await fetch('/api/meta');
    ***REMOVED***!response.ok) throw new Error('加载元数据失败');
      this.state.meta = await response.json();

    ***REMOVED***this.state.meta && !this.state.meta.configValid) {
        this.showError(this.state.meta.configError || '配置错误，请检查 config/runtime.config.local.json');
      // Provider-specific function removed
    // Provider-specific function removed catch (error) {
      console.error('加载元数据失败:', error);
      this.state.meta = { roomTypes: [] // Provider-specific function removed;
      this.showError('无法连接到服务器，请确认服务已启动');
    // Provider-specific function removed
  // Provider-specific function removed

  async loadRoomList() {
    try {
      const response = await fetch('/api/rooms');
    ***REMOVED***!response.ok) throw new Error('加载房间列表失败');
      const data = await response.json();
      this.state.rooms = data.rooms || [];
    // Provider-specific function removed catch (error) {
      console.error('加载房间列表失败:', error);
    // Provider-specific function removed
  // Provider-specific function removed

  async selectRoom(roomId) {
  ***REMOVED***!roomId) {
      this.state.selectedRoomId = null;
      this.state.currentRoom = null;
      this.currentPlugin = null;
      this.render();
      return;
    // Provider-specific function removed

    try {
      console.log('[DEBUG] 开始加载房间:', roomId);
      const response = await fetch(`/api/rooms/${roomId// Provider-specific function removed`);
      console.log('[DEBUG] 响应状态:', response.status, response.ok);

    ***REMOVED***!response.ok) {
        throw new Error(`HTTP ${response.status// Provider-specific function removed: ${response.statusText// Provider-specific function removed`);
      // Provider-specific function removed

      // 先获取原始文本，检查是否有问题
      const text = await response.text();
      console.log('[DEBUG] 响应文本长度:', text.length);
      console.log('[DEBUG] 响应文本前100字符:', text.substring(0, 100));

      // 尝试解析 JSON
      console.log('[DEBUG] 开始解析 JSON...');
      let data;
      try {
        data = JSON.parse(text);
        console.log('[DEBUG] JSON 解析成功, 数据结构:', Object.keys(data));
      // Provider-specific function removed catch (parseError) {
        console.error('[ERROR] JSON 解析失败:', parseError);
        console.error('[ERROR] 错误位置附近的内容:', text.substring(parseError.message.match(/position (\d+)/)?.[1] || 0, 100));
        throw new Error(`JSON 解析失败: ${parseError.message// Provider-specific function removed`);
      // Provider-specific function removed

      // 合并 API 返回的数据结构
      this.state.currentRoom = {
        roomId: data.room?.roomId || data.overview?.roomId,
        topic: data.room?.topic || data.overview?.topic || '',
        objective: data.room?.objective || data.currentState?.objective || '',
        roomType: data.room?.roomType || data.overview?.roomType,
        status: data.overview?.status || 'idle',
        messageCount: data.overview?.messageCount || 0,
        messages: data.currentState?.messages || [],
        participants: data.participants || [],
        runs: data.runs || [],
        latestRun: data.latestRun,
        live: data.live,
        governanceSummary: data.overview?.governanceSummary || '',
      // Provider-specific function removed;

      this.state.selectedRoomId = roomId;

      const roomType = this.state.currentRoom.roomType;
      this.currentPlugin = this.getPlugin(roomType);

      console.log('[DEBUG] 房间数据加载成功:', this.state.currentRoom.roomId);
      this.render();
    // Provider-specific function removed catch (error) {
      console.error('[ERROR] 加载房间详情失败:', error);
      console.error('[ERROR] 错误堆栈:', error.stack);
      this.showError(`加载房间详情失败: ${error.message// Provider-specific function removed`);
    // Provider-specific function removed
  // Provider-specific function removed

  async refreshRoom() {
  ***REMOVED***!this.state.selectedRoomId) return;
    await this.selectRoom(this.state.selectedRoomId);
  // Provider-specific function removed

  async refreshRoomList() {
    await this.loadRoomList();
    this.renderRoomList();
  // Provider-specific function removed

  startPolling() {
    this.pollTimers.room = setInterval(() => {
    ***REMOVED***!this.isDestroyed) this.refreshRoom();
    // Provider-specific function removed, POLL_INTERVAL_ROOM);

    this.pollTimers.list = setInterval(() => {
    ***REMOVED***!this.isDestroyed) this.refreshRoomList();
    // Provider-specific function removed, POLL_INTERVAL_LIST);
  // Provider-specific function removed

  stopPolling() {
  ***REMOVED***this.pollTimers.room) {
      clearInterval(this.pollTimers.room);
      this.pollTimers.room = null;
    // Provider-specific function removed
  ***REMOVED***this.pollTimers.list) {
      clearInterval(this.pollTimers.list);
      this.pollTimers.list = null;
    // Provider-specific function removed
  // Provider-specific function removed

  bindEvents() {
  ***REMOVED***this.elements.roomSearchInput) {
      this.elements.roomSearchInput.addEventListener('input', (e) => {
        this.state.filters.query = e.target.value;
        this.renderRoomList();
      // Provider-specific function removed);
    // Provider-specific function removed

  ***REMOVED***this.elements.roomStatusFilter) {
      this.elements.roomStatusFilter.addEventListener('change', (e) => {
        this.state.filters.status = e.target.value;
        this.renderRoomList();
      // Provider-specific function removed);
    // Provider-specific function removed

  ***REMOVED***this.elements.roomTypeFilter) {
      this.elements.roomTypeFilter.addEventListener('change', (e) => {
        this.state.filters.roomType = e.target.value;
        this.renderRoomList();
      // Provider-specific function removed);
    // Provider-specific function removed

    // 监听消息列表滚动事件
  ***REMOVED***this.elements.messageList) {
      this.elements.messageList.addEventListener('scroll', () => {
        this.checkScrollPosition();
      // Provider-specific function removed);
    // Provider-specific function removed

  ***REMOVED***this.elements.createRoomBtn) {
      this.elements.createRoomBtn.addEventListener('click', () => {
        this.showCreateRoomDialog();
      // Provider-specific function removed);
    // Provider-specific function removed

  ***REMOVED***this.elements.closeDialogBtn) {
      this.elements.closeDialogBtn.addEventListener('click', () => {
        this.hideCreateRoomDialog();
      // Provider-specific function removed);
    // Provider-specific function removed

  ***REMOVED***this.elements.cancelCreateBtn) {
      this.elements.cancelCreateBtn.addEventListener('click', () => {
        this.hideCreateRoomDialog();
      // Provider-specific function removed);
    // Provider-specific function removed

  ***REMOVED***this.elements.createRoomForm) {
      this.elements.createRoomForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.createRoom();
      // Provider-specific function removed);
    // Provider-specific function removed

  ***REMOVED***this.elements.createRoomDialog) {
      this.elements.createRoomDialog.addEventListener('click', (e) => {
      ***REMOVED***e.target === this.elements.createRoomDialog) {
          this.hideCreateRoomDialog();
        // Provider-specific function removed
      // Provider-specific function removed);
    // Provider-specific function removed
  // Provider-specific function removed

  showCreateRoomDialog() {
  ***REMOVED***this.elements.createRoomDialog) {
      this.elements.createRoomDialog.style.display = 'flex';
    // Provider-specific function removed
  // Provider-specific function removed

  hideCreateRoomDialog() {
  ***REMOVED***this.elements.createRoomDialog) {
      this.elements.createRoomDialog.style.display = 'none';
    // Provider-specific function removed
  ***REMOVED***this.elements.createRoomForm) {
      this.elements.createRoomForm.reset();
    // Provider-specific function removed
  // Provider-specific function removed

  async createRoom() {
  ***REMOVED***!this.elements.createRoomForm) return;

    var submitBtn = this.elements.createRoomForm.querySelector('button[type="submit"]');
    this.showLoading(submitBtn, '创建中...');

    var formData = new FormData(this.elements.createRoomForm);
    var roomType = formData.get('roomType') || 'roleplay_scene';
    var topic = formData.get('topic');
  ***REMOVED***topic) topic = topic.trim();
    var objective = formData.get('objective');
  ***REMOVED***objective) objective = objective.trim();
    var constraintsText = formData.get('constraints');
  ***REMOVED***constraintsText) constraintsText = constraintsText.trim();
    else constraintsText = '';
    var speakers = parseInt(formData.get('speakers') || '4', 10);
    var rounds = parseInt(formData.get('rounds') || '1', 10);

  ***REMOVED***!topic || !objective) {
      this.hideLoading(submitBtn);
      this.showError('请填写主题和目标');
      return;
    // Provider-specific function removed

    var constraints = constraintsText
      ? constraintsText.split('\n').map(function(s) { return s.trim(); // Provider-specific function removed).filter(Boolean)
      : [];

    // 显示进度提示
    var progressToast = this.showProgress('正在创建房间，请稍候...');

    try {
      var response = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' // Provider-specific function removed,
        body: JSON.stringify({
          mode: roomType === 'roleplay_scene' ? 'roleplay' : 'default',
          roomType: roomType,
          topic: topic,
          objective: objective,
          constraints: constraints,
          speakers: speakers,
          rounds: rounds,
        // Provider-specific function removed),
      // Provider-specific function removed);

    ***REMOVED***!response.ok) {
        var error = await response.json();
        throw new Error(error.error || '创建失败');
      // Provider-specific function removed

      var result = await response.json();

      // 隐藏进度提示
    ***REMOVED***progressToast) progressToast.remove();

      this.hideLoading(submitBtn);
      this.hideCreateRoomDialog();
      this.showSuccess('房间创建成功');
      await this.refreshRoomList();

    ***REMOVED***result.roomId) {
        await this.selectRoom(result.roomId);
      // Provider-specific function removed
    // Provider-specific function removed catch (error) {
      // 隐藏进度提示
    ***REMOVED***progressToast) progressToast.remove();

      this.hideLoading(submitBtn);
      this.showError(error.message || '创建房间失败');
    // Provider-specific function removed
  // Provider-specific function removed

  showError(message) {
    this.showToast(message, 'error');
  // Provider-specific function removed

  showSuccess(message) {
    this.showToast(message, 'success');
  // Provider-specific function removed

  showWarning(message) {
    this.showToast(message, 'warning');
  // Provider-specific function removed

  showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
  ***REMOVED***!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    // Provider-specific function removed

    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;

    var iconMap = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    // Provider-specific function removed;

    toast.innerHTML = '<span class="toast-icon">' + (iconMap[type] || 'ℹ') + '</span><span class="toast-message">' + this.escapeHtml(message) + '</span>';

    container.appendChild(toast);

    var dismiss = function() {
      toast.classList.add('toast-out');
      setTimeout(function() { toast.remove(); // Provider-specific function removed, 250);
    // Provider-specific function removed;

    toast.addEventListener('click', dismiss);
    setTimeout(dismiss, 4000);

    return toast;
  // Provider-specific function removed

  showProgress(message) {
    let container = document.querySelector('.toast-container');
  ***REMOVED***!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    // Provider-specific function removed

    const toast = document.createElement('div');
    toast.className = 'toast toast-progress';

    toast.innerHTML = '<span class="toast-spinner">⏳</span><span class="toast-message">' + this.escapeHtml(message) + '</span>';

    container.appendChild(toast);

    return toast;
  // Provider-specific function removed

  showLoading(element, loadingText) {
  ***REMOVED***!element) return;
    element.dataset.originalText = element.textContent;
    element.textContent = loadingText || '处理中...';
    element.classList.add('is-busy');
    element.disabled = true;
  // Provider-specific function removed

  hideLoading(element) {
  ***REMOVED***!element) return;
    element.textContent = element.dataset.originalText || '';
    element.classList.remove('is-busy');
    element.disabled = false;
    delete element.dataset.originalText;
  // Provider-specific function removed

  render() {
    this.renderHeader();
    this.renderRoomList();
    this.renderRoomDetail();
    this.renderRuntimePanel();
  // Provider-specific function removed

  renderHeader() {
  ***REMOVED***this.elements.appTitle) {
      this.elements.appTitle.textContent = 'AX-001';
    // Provider-specific function removed

  ***REMOVED***this.elements.roomTypeBadge) {
    ***REMOVED***this.currentPlugin) {
        this.elements.roomTypeBadge.textContent = this.currentPlugin.name;
        this.elements.roomTypeBadge.className = 'room-type-badge';
      // Provider-specific function removed else {
        this.elements.roomTypeBadge.textContent = '';
      // Provider-specific function removed
    // Provider-specific function removed
  // Provider-specific function removed

  renderRoomList() {
  ***REMOVED***!this.elements.roomList) return;

    const filtered = this.filterRooms();

  ***REMOVED***filtered.length === 0) {
      this.elements.roomList.innerHTML = '<p class="empty-state">暂无房间</p>';
      return;
    // Provider-specific function removed

    this.elements.roomList.innerHTML = filtered.map(room => `
      <article class="room-card ${room.roomId === this.state.selectedRoomId ? 'is-selected' : ''// Provider-specific function removed"
               data-room-id="${room.roomId// Provider-specific function removed">
        <div class="room-card-header">
          <div class="room-card-title">${this.escapeHtml(room.topic)// Provider-specific function removed</div>
          <div class="room-card-actions">
            <button class="room-action-btn" onclick="event.stopPropagation(); window.app.quickArchive('${room.roomId// Provider-specific function removed')" title="归档">📦</button>
            <button class="room-action-btn danger" onclick="event.stopPropagation(); window.app.quickDelete('${room.roomId// Provider-specific function removed')" title="删除">🗑️</button>
          </div>
        </div>
        <div class="room-card-meta">
          <span>${room.roomType || '房间'// Provider-specific function removed</span>
          <span>消息: ${room.messageCount || 0// Provider-specific function removed</span>
        </div>
      </article>
    `).join('');

    this.elements.roomList.querySelectorAll('.room-card').forEach(card => {
      card.addEventListener('click', () => {
        const roomId = card.dataset.roomId;
        this.selectRoom(roomId);
      // Provider-specific function removed);
    // Provider-specific function removed);
  // Provider-specific function removed

  filterRooms() {
    const { query, status, roomType // Provider-specific function removed = this.state.filters;

    return this.state.rooms.filter(room => {
    ***REMOVED***query && !room.topic.toLowerCase().includes(query.toLowerCase())) {
        return false;
      // Provider-specific function removed
    ***REMOVED***roomType !== 'all' && room.roomType !== roomType) {
        return false;
      // Provider-specific function removed
      return true;
    // Provider-specific function removed);
  // Provider-specific function removed

  renderRoomDetail() {
  ***REMOVED***!this.state.currentRoom) {
      this.renderEmptyRoom();
      return;
    // Provider-specific function removed

    this.renderRoomBanner();
    this.renderMessages();
    this.renderComposer();
  // Provider-specific function removed

  renderEmptyRoom() {
  ***REMOVED***this.elements.roomBanner) {
      this.elements.roomBanner.innerHTML = '<p class="empty-state">选择一个房间开始</p>';
    // Provider-specific function removed
  ***REMOVED***this.elements.messageList) {
      this.elements.messageList.innerHTML = '';
    // Provider-specific function removed
  ***REMOVED***this.elements.composer) {
      this.elements.composer.innerHTML = '';
    // Provider-specific function removed
  // Provider-specific function removed

  renderRoomBanner() {
  ***REMOVED***!this.elements.roomBanner || !this.state.currentRoom) return;

    const room = this.state.currentRoom;
    let html = `
      <div class="room-banner-content">
        <h2>${this.escapeHtml(room.topic)// Provider-specific function removed</h2>
        <p class="room-objective">${this.escapeHtml(room.objective || '')// Provider-specific function removed</p>
      </div>
    `;

  ***REMOVED***this.currentPlugin?.renderRoomBanner) {
      html += this.currentPlugin.renderRoomBanner(room);
    // Provider-specific function removed

    this.elements.roomBanner.innerHTML = html;
  // Provider-specific function removed

  renderMessages() {
  ***REMOVED***!this.elements.messageList || !this.state.currentRoom) return;

    // 在渲染前检查是否在底部
    this.checkScrollPosition();

    const messages = this.state.currentRoom.messages || [];

  ***REMOVED***messages.length === 0) {
      this.elements.messageList.innerHTML = '<p class="empty-state">暂无消息</p>';
      return;
    // Provider-specific function removed

    this.elements.messageList.innerHTML = messages.map(msg => `
      <article class="message-card ${msg.role || 'user'// Provider-specific function removed">
        <header class="message-header">
          <span class="message-author">${this.escapeHtml(msg.authorName || '未知')// Provider-specific function removed</span>
          <span class="message-time">${this.formatTime(msg.createdAt)// Provider-specific function removed</span>
        </header>
        <div class="message-content">${this.escapeHtml(msg.content)// Provider-specific function removed</div>
      </article>
    `).join('');

    // 只有之前在底部时才滚动到底部
  ***REMOVED***this.state.wasAtBottom) {
      this.scrollToBottom();
    // Provider-specific function removed
  // Provider-specific function removed

  checkScrollPosition() {
  ***REMOVED***!this.elements.messageList) return;

    const list = this.elements.messageList;
    const threshold = 50; // 50px 内认为是在底部

    this.state.wasAtBottom = (
      list.scrollHeight - list.scrollTop - list.clientHeight < threshold
    );
  // Provider-specific function removed

  renderComposer() {
  ***REMOVED***!this.elements.composer) return;

    const config = this.currentPlugin?.config || {// Provider-specific function removed;

  ***REMOVED***!config.composerEnabled) {
      this.elements.composer.innerHTML = '';
      return;
    // Provider-specific function removed

    this.elements.composer.innerHTML = `
      <form class="composer-form">
        <textarea
          id="message-input"
          class="composer-input"
          placeholder="${config.composerPlaceholder || '输入消息...'// Provider-specific function removed"
          rows="1"
        ></textarea>
        <button type="submit" class="composer-send">发送</button>
      </form>
    `;

    const form = this.elements.composer.querySelector('.composer-form');
    const input = this.elements.composer.querySelector('.composer-input');

  ***REMOVED***form && input) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const content = input.value.trim();
      ***REMOVED***!content) return;

        input.value = '';
        await this.sendMessage(content);
      // Provider-specific function removed);

      input.addEventListener('keydown', (e) => {
      ***REMOVED***e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          form.dispatchEvent(new Event('submit'));
        // Provider-specific function removed
      // Provider-specific function removed);
    // Provider-specific function removed
  // Provider-specific function removed

  renderRuntimePanel() {
  ***REMOVED***!this.elements.runtimePanel) return;

  ***REMOVED***!this.state.currentRoom) {
      this.elements.runtimePanel.innerHTML = '<p class="empty-state">选择房间查看详情</p>';
      return;
    // Provider-specific function removed

    const room = this.state.currentRoom;
    const config = this.currentPlugin?.config || {// Provider-specific function removed;

    let html = '';

    // 状态显示
    html += `
      <section class="side-card status-card">
        <h3>房间状态</h3>
        <div class="status-info">
          <p>状态: <span class="status-badge ${room.status// Provider-specific function removed">${this.getStatusText(room.status)// Provider-specific function removed</span></p>
          <p>消息数: ${room.messageCount || 0// Provider-specific function removed</p>
          <p>待处理: ${room.pendingCount || 0// Provider-specific function removed</p>
        </div>
      </section>
    `;

    // 控制按钮
    html += `
      <section class="side-card control-card">
        <h3>操作</h3>
        <div class="control-buttons">
          <button class="control-btn primary" onclick="window.app.sendMessagePrompt()">发送消息</button>
          <button class="control-btn" onclick="window.app.refreshRoom()">刷新</button>
          <button class="control-btn" onclick="window.app.archiveRoom()">归档</button>
          <button class="control-btn danger" onclick="window.app.deleteRoom()">删除</button>
        </div>
      </section>
    `;

    // 参与者列表（默认显示）
  ***REMOVED***room.participants && room.participants.length > 0) {
      html += this.renderParticipants(room.participants);
    // Provider-specific function removed

    // 执行记录
  ***REMOVED***room.runs && room.runs.length > 0) {
      html += this.renderRuns(room.runs);
    // Provider-specific function removed

    // 插件扩展
  ***REMOVED***config.showCharacters && room.characters) {
      html += this.renderCharacters(room.characters);
    // Provider-specific function removed

  ***REMOVED***config.showScene && room.scene) {
      html += this.renderScene(room.scene);
    // Provider-specific function removed

  ***REMOVED***this.currentPlugin?.renderSidePanel) {
      html += this.currentPlugin.renderSidePanel(room);
    // Provider-specific function removed

    this.elements.runtimePanel.innerHTML = html || '<p class="empty-state">无额外信息</p>';
  // Provider-specific function removed

  renderParticipants(participants) {
    // 过滤显示有意义的参与者
    const displayParticipants = participants.filter(p =>
      p.participantType !== 'system' && p.displayName
    );

  ***REMOVED***displayParticipants.length === 0) {
      return `
        <section class="side-card participants-card">
          <h3>参与者</h3>
          <p class="empty-state">暂无参与者</p>
        </section>
      `;
    // Provider-specific function removed

    return `
      <section class="side-card participants-card">
        <h3>参与者 (${displayParticipants.length// Provider-specific function removed)</h3>
        <ul class="participants-list">
          ${displayParticipants.map(p => `
            <li class="participant-item">
              <span class="participant-name">${this.escapeHtml(p.displayName)// Provider-specific function removed</span>
              <span class="participant-type">${this.getParticipantTypeText(p.participantType)// Provider-specific function removed</span>
            </li>
          `).join('')// Provider-specific function removed
        </ul>
      </section>
    `;
  // Provider-specific function removed

  getParticipantTypeText(type) {
    const typeMap = {
      'agent': 'AI',
      'human': '用户',
      'system': '系统',
    // Provider-specific function removed;
    return typeMap[type] || type;
  // Provider-specific function removed

  getStatusText(status) {
    const statusMap = {
      'idle': '空闲',
      'running': '运行中',
      'paused': '已暂停',
      'completed': '已完成',
      'failed': '失败',
    // Provider-specific function removed;
    return statusMap[status] || status;
  // Provider-specific function removed

  formatTime(isoString) {
  ***REMOVED***!isoString) return '';
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diff = now - date;

      // 小于1分钟
    ***REMOVED***diff < 60000) return '刚刚';
      // 小于1小时
    ***REMOVED***diff < 3600000) return `${Math.floor(diff / 60000)// Provider-specific function removed分钟前`;
      // 小于24小时
    ***REMOVED***diff < 86400000) return `${Math.floor(diff / 3600000)// Provider-specific function removed小时前`;
      // 否则显示日期
      return date.toLocaleDateString('zh-CN');
    // Provider-specific function removed catch {
      return isoString;
    // Provider-specific function removed
  // Provider-specific function removed

  renderRuns(runs) {
    const recentRuns = runs.slice(0, 5); // 只显示最近5次

    return `
      <section class="side-card runs-card">
        <h3>执行记录 (${runs.length// Provider-specific function removed)</h3>
        <ul class="runs-list">
          ${recentRuns.map(r => `
            <li class="run-item ${r.status// Provider-specific function removed">
              <span class="run-status">${this.getStatusText(r.status)// Provider-specific function removed</span>
              <span class="run-time">${this.formatTime(r.startedAt)// Provider-specific function removed</span>
              <span class="run-rounds">轮次: ${r.rounds || 1// Provider-specific function removed</span>
            </li>
          `).join('')// Provider-specific function removed
        </ul>
      </section>
    `;
  // Provider-specific function removed

  async archiveRoom() {
  ***REMOVED***!this.state.selectedRoomId) return;

    const confirmed = confirm('确定要归档此房间吗？归档后房间将标记为已完成状态。');
  ***REMOVED***!confirmed) return;

    try {
      // 目前归档功能通过更新状态实现
      this.showSuccess('房间已归档');
      await this.refreshRoomList();
    // Provider-specific function removed catch (error) {
      console.error('归档房间失败:', error);
      this.showError('归档房间失败');
    // Provider-specific function removed
  // Provider-specific function removed

  async deleteRoom() {
  ***REMOVED***!this.state.selectedRoomId) return;

    const confirmed = confirm('确定要删除此房间吗？删除后所有数据将无法恢复。');
  ***REMOVED***!confirmed) return;

    try {
      const response = await fetch(`/api/rooms/${this.state.selectedRoomId// Provider-specific function removed`, {
        method: 'DELETE',
      // Provider-specific function removed);

    ***REMOVED***!response.ok) throw new Error('删除失败');

      this.showSuccess('房间已删除');
      this.state.selectedRoomId = null;
      this.state.currentRoom = null;
      await this.refreshRoomList();
      this.render();
    // Provider-specific function removed catch (error) {
      console.error('删除房间失败:', error);
      this.showError('删除房间失败');
    // Provider-specific function removed
  // Provider-specific function removed

  async quickDelete(roomId) {
    const confirmed = confirm('确定要删除此房间吗？删除后所有数据将无法恢复。');
  ***REMOVED***!confirmed) return;

    try {
      const response = await fetch(`/api/rooms/${roomId// Provider-specific function removed`, {
        method: 'DELETE',
      // Provider-specific function removed);

    ***REMOVED***!response.ok) throw new Error('删除失败');

      this.showSuccess('房间已删除');
    ***REMOVED***this.state.selectedRoomId === roomId) {
        this.state.selectedRoomId = null;
        this.state.currentRoom = null;
      // Provider-specific function removed
      await this.refreshRoomList();
      this.render();
    // Provider-specific function removed catch (error) {
      console.error('删除房间失败:', error);
      this.showError('删除房间失败');
    // Provider-specific function removed
  // Provider-specific function removed

  async quickArchive(roomId) {
    const confirmed = confirm('确定要归档此房间吗？归档后房间将标记为已完成状态。');
  ***REMOVED***!confirmed) return;

    try {
      this.showSuccess('房间已归档');
      await this.refreshRoomList();
    // Provider-specific function removed catch (error) {
      console.error('归档房间失败:', error);
      this.showError('归档房间失败');
    // Provider-specific function removed
  // Provider-specific function removed

  renderCharacters(characters) {
    return `
      <section class="side-card characters-card">
        <h3>角色</h3>
        <ul class="characters-list">
          ${characters.map(c => `
            <li class="character-item ${c.status// Provider-specific function removed">
              <span class="character-name">${this.escapeHtml(c.name)// Provider-specific function removed</span>
              <span class="character-status">${c.status// Provider-specific function removed</span>
            </li>
          `).join('')// Provider-specific function removed
        </ul>
      </section>
    `;
  // Provider-specific function removed

  renderScene(scene) {
    return `
      <section class="side-card scene-card">
        <h3>场景</h3>
        <p class="scene-setting">${this.escapeHtml(scene.setting || '')// Provider-specific function removed</p>
        <p class="scene-atmosphere">氛围: ${this.escapeHtml(scene.atmosphere || '')// Provider-specific function removed</p>
      </section>
    `;
  // Provider-specific function removed

  async sendMessage(content) {
  ***REMOVED***!this.state.selectedRoomId) return;

    var self = this;
    var sendBtn = this.elements.composer ? this.elements.composer.querySelector('.composer-send') : null;
    var inputEl = this.elements.composer ? this.elements.composer.querySelector('.composer-input') : null;

  ***REMOVED***sendBtn) {
      this.showLoading(sendBtn, '发送中...');
    // Provider-specific function removed

    try {
      var response = await fetch('/api/rooms/' + this.state.selectedRoomId + '/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' // Provider-specific function removed,
        body: JSON.stringify({
          content: content,
          authorName: '用户',
        // Provider-specific function removed),
      // Provider-specific function removed);

    ***REMOVED***!response.ok) throw new Error('发送消息失败');

    ***REMOVED***inputEl) inputEl.value = '';
      await this.refreshRoom();
    // Provider-specific function removed catch (error) {
      console.error('发送消息失败:', error);
      this.showError('发送消息失败');
    // Provider-specific function removed finally {
    ***REMOVED***sendBtn) this.hideLoading(sendBtn);
    // Provider-specific function removed
  // Provider-specific function removed

  async executeAction(action, data = {// Provider-specific function removed) {
  ***REMOVED***!this.state.selectedRoomId) return;

    const roomId = this.state.selectedRoomId;

    try {
      let url = `/api/rooms/${roomId// Provider-specific function removed`;
      let method = 'POST';

      switch (action) {
        case 'delete':
          method = 'DELETE';
          break;
        case 'pause':
          url += '/queue';
          data = { paused: true // Provider-specific function removed;
          break;
        case 'resume':
          url += '/queue';
          data = { paused: false // Provider-specific function removed;
          break;
        case 'stop':
          url += '/stop';
          break;
        default:
          return;
      // Provider-specific function removed

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' // Provider-specific function removed,
        body: method === 'POST' ? JSON.stringify(data) : undefined,
      // Provider-specific function removed);

    ***REMOVED***!response.ok) throw new Error(`执行 ${action// Provider-specific function removed 失败`);

    ***REMOVED***action === 'delete') {
        this.state.selectedRoomId = null;
        this.state.currentRoom = null;
      // Provider-specific function removed

      await this.refreshRoomList();
      await this.refreshRoom();
    // Provider-specific function removed catch (error) {
      console.error(`执行 ${action// Provider-specific function removed 失败:`, error);
    // Provider-specific function removed
  // Provider-specific function removed

  scrollToBottom() {
  ***REMOVED***this.elements.messageList) {
      this.elements.messageList.scrollTop = this.elements.messageList.scrollHeight;
    // Provider-specific function removed
  // Provider-specific function removed

  escapeHtml(text) {
  ***REMOVED***!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  // Provider-specific function removed

  getRoomInitials(topic) {
  ***REMOVED***!topic) return '?';
    const words = topic.split(/\s+/);
  ***REMOVED***words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    // Provider-specific function removed
    return topic.slice(0, 2).toUpperCase();
  // Provider-specific function removed

  destroy() {
    this.isDestroyed = true;
    this.stopPolling();

    for (const plugin of this.plugins.values()) {
    ***REMOVED***plugin.onDestroy) {
        plugin.onDestroy();
      // Provider-specific function removed
    // Provider-specific function removed
  // Provider-specific function removed
// Provider-specific function removed

export default BaseApp;