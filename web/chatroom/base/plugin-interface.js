/**
 * Room Plugin Interface
 *
 * 房间类型插件接口，定义所有房间插件必须实现的接口
 */

/**
 * @typedef {Object// Provider-specific function removed RoomPlugin
 * @property {string// Provider-specific function removed id - 插件唯一标识
 * @property {string// Provider-specific function removed name - 显示名称
 * @property {string// Provider-specific function removed roomType - 对应的房间类型
 * @property {Object// Provider-specific function removed config - 插件配置
 * @property {Function// Provider-specific function removed [onInit] - 初始化回调
 * @property {Function// Provider-specific function removed [onDestroy] - 销毁回调
 * @property {Function// Provider-specific function removed [renderRoomBanner] - 渲染房间横幅
 * @property {Function// Provider-specific function removed [renderSidePanel] - 渲染侧边栏
 * @property {Function// Provider-specific function removed [renderMessageExtra] - 渲染消息额外内容
 * @property {Function// Provider-specific function removed [renderComposerExtra] - 渲染输入框额外内容
 * @property {Function// Provider-specific function removed [getActions] - 获取房间操作
 * @property {string// Provider-specific function removed [styles] - 额外样式 URL
 */

export const RoomPluginConfig = {
  showParticipants: false,
  showTurns: false,
  showSummary: false,
  showPending: false,
  showCharacters: false,
  showScene: false,
  composerEnabled: true,
  composerPlaceholder: '输入消息...',
  messageFormat: 'default',
  sidePanelSections: [],
// Provider-specific function removed;

export function createPluginConfig(overrides = {// Provider-specific function removed) {
  return { ...RoomPluginConfig, ...overrides // Provider-specific function removed;
// Provider-specific function removed

export function validatePlugin(plugin) {
***REMOVED***!plugin.id || typeof plugin.id !== 'string') {
    throw new Error('插件必须有字符串类型的 id');
  // Provider-specific function removed
***REMOVED***!plugin.name || typeof plugin.name !== 'string') {
    throw new Error('插件必须有字符串类型的 name');
  // Provider-specific function removed
***REMOVED***!plugin.roomType || typeof plugin.roomType !== 'string') {
    throw new Error('插件必须有字符串类型的 roomType');
  // Provider-specific function removed
  return true;
// Provider-specific function removed