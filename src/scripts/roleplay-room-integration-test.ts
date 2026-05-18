/**
 * RoleplayRoom 完整集成测试
 * 
 * 验证：
 * 1. 创建房间并持久化
 * 2. 执行多轮对话
 * 3. 加载房间并继续对话
 * 4. 角色状态更新
 */

import { RoleplayRoomService // Provider-specific function removed from '../room-app/roleplay-room-service.js';

async function runIntegrationTest() {
  console.log('=== RoleplayRoom 集成测试 ===\n');
  
  const service = new RoleplayRoomService();
  
  // 1. 创建房间
  console.log('1. 创建角色扮演房间...');
  const state = service.createRoom({
    topic: '西环酒馆',
    objective: '角色互动测试',
    scene: {
      setting: '一家位于城市西区的老式酒馆，木质地板踩上去会发出轻微的吱呀声。壁炉里的火光映照着琥珀色的酒杯。',
      atmosphere: '温暖、安静、偶尔有壁炉的噼啪声',
    // Provider-specific function removed,
    characters: [
      {
        id: 'mara',
        name: '玛拉',
        instruction: `你是玛拉，西环酒馆的老板娘。
- 40岁左右，风韵犹存，眼神锐利但嘴角常带微笑
- 热情但精明，善于察言观色
- 说话带着一点南方口音，喜欢用"亲爱的"称呼客人`,
        publicDescription: '酒馆老板娘，热情精明',
        priority: 'high',
        talkativeness: 0.8,
        initialMemory: {
          observations: ['酒馆今晚的生意不错'],
          facts: ['我在这里经营酒馆已经十五年了'],
        // Provider-specific function removed,
        initialRelationships: [
          { targetId: 'shadow', score: 3, summary: '常客，话不多但可靠' // Provider-specific function removed,
        ],
      // Provider-specific function removed,
      {
        id: 'shadow',
        name: '影子',
        instruction: `你是"影子"，一个神秘的流浪者。
- 年龄不详，总是穿着一件深灰色的斗篷
- 很少主动说话，但一旦开口往往一针见血
- 对他人的秘密有敏锐的直觉`,
        publicDescription: '神秘流浪者，沉默寡言',
        priority: 'low',
        talkativeness: 0.3,
        initialMemory: {
          observations: ['酒馆里的气氛有些微妙'],
          facts: ['我来自很远的地方'],
        // Provider-specific function removed,
      // Provider-specific function removed,
      {
        id: 'lily',
        name: '莉莉',
        instruction: `你是莉莉，酒馆的女招待。
- 19岁，活泼可爱，是玛拉的侄女
- 善于与人交流，记得每个常客的喜好
- 有时会过于热心`,
        publicDescription: '酒馆女招待，活泼可爱',
        priority: 'normal',
        talkativeness: 0.85,
        initialMemory: {
          observations: ['今晚客人好多啊！'],
          facts: ['我是玛拉阿姨的侄女'],
        // Provider-specific function removed,
        initialRelationships: [
          { targetId: 'mara', score: 5, summary: '我最亲爱的阿姨！' // Provider-specific function removed,
        ],
      // Provider-specific function removed,
    ],
  // Provider-specific function removed);
  
  console.log(`   房间ID: ${state.roomId// Provider-specific function removed`);
  console.log(`   角色数量: ${state.characters.size// Provider-specific function removed`);
  console.log(`   当前轮次: ${state.currentRound// Provider-specific function removed`);
  
  // 2. 执行对话
  console.log('\n2. 执行3轮对话...');
  const result = await service.executeRoom({
    roomId: state.roomId,
    rounds: 3,
    config: {
      maxConcurrency: 2,
      charactersPerAgent: 2,
    // Provider-specific function removed,
  // Provider-specific function removed);
  
  console.log(`   执行完成，耗时: ${(result.duration / 1000).toFixed(1)// Provider-specific function removed秒`);
  console.log(`   消息总数: ${result.messageCount// Provider-specific function removed`);
  
  // 3. 加载房间并验证持久化
  console.log('\n3. 验证持久化...');
  const loaded = service.getRoom(state.roomId);
  console.log(`   加载成功: ${loaded ? '是' : '否'// Provider-specific function removed`);
  console.log(`   消息数量: ${loaded?.messages.length ?? 0// Provider-specific function removed`);
  console.log(`   当前轮次: ${loaded?.currentRound ?? 0// Provider-specific function removed`);
  
  // 4. 显示对话摘要
  console.log('\n4. 对话摘要:');
***REMOVED***loaded) {
    for (const msg of loaded.messages.slice(-10)) {
      const content = msg.content.length > 60 
        ? msg.content.slice(0, 60) + '...' 
        : msg.content;
      console.log(`   [轮${msg.round// Provider-specific function removed] ${msg.authorName// Provider-specific function removed: ${content.replace(/\n/g, ' ')// Provider-specific function removed`);
    // Provider-specific function removed
  // Provider-specific function removed
  
  // 5. 角色状态统计
  console.log('\n5. 角色状态:');
***REMOVED***loaded) {
    for (const [id, char] of loaded.characters) {
      const msgCount = loaded.messages.filter(m => m.authorId === id).length;
      console.log(`   ${char.name// Provider-specific function removed: ${msgCount// Provider-specific function removed条消息, 连续沉默${char.consecutiveSilentRounds// Provider-specific function removed轮, 状态:${char.status// Provider-specific function removed`);
    // Provider-specific function removed
  // Provider-specific function removed
  
  // 6. 继续对话
  console.log('\n6. 继续执行2轮...');
  const continueResult = await service.continueRoom(state.roomId, 2);
  console.log(`   继续完成，耗时: ${(continueResult.duration / 1000).toFixed(1)// Provider-specific function removed秒`);
  console.log(`   新增消息: ${continueResult.newMessageCount// Provider-specific function removed`);
  
  // 7. 最终状态
  const finalState = service.getRoom(state.roomId);
  console.log('\n7. 最终状态:');
  console.log(`   总轮次: ${finalState?.currentRound// Provider-specific function removed`);
  console.log(`   总消息: ${finalState?.messages.length// Provider-specific function removed`);
  
  // 8. 列出所有房间
  console.log('\n8. 房间列表:');
  const rooms = service.listRooms();
  for (const room of rooms.slice(0, 5)) {
    console.log(`   ${room.topic// Provider-specific function removed - 轮次:${room.currentRound// Provider-specific function removed, 消息:${room.messageCount// Provider-specific function removed`);
  // Provider-specific function removed
  
  console.log('\n=== 测试完成 ===');
// Provider-specific function removed

runIntegrationTest().catch(console.error);
