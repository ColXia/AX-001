import { BaseApp // Provider-specific function removed from './base/base-app.js';

const app = new BaseApp();

// 初始化应用
app.init().catch(error => {
  console.error('Failed to initialize app:', error);
// Provider-specific function removed);

// 暴露到全局作用域供调试和内联事件使用
window.app = app;
