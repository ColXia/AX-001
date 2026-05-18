/**
 * Agent Turn Lifecycle 长会话测试
 * 
 * 酒馆场景，10轮对话，测试：
 * 1. 角色在不同场景下的发言模式
 * 2. 角色之间的互动和回应
 * 3. 长对话中角色行为的一致性
 */

import { setTracingDisabled // Provider-specific function removed from '@openai/agents-core';
import { loadAppConfig, createRuntimeModelBinding // Provider-specific function removed from '../config/app-config.js';
import { AgentRuntime // Provider-specific function removed from '../core/agent-runtime.js';
import type { AgentProfile // Provider-specific function removed from '../core/agent-profile.js';
import type { ChatroomState // Provider-specific function removed from '../room-runtime/room-state.js';
import type { ChatroomAgentContext // Provider-specific function removed from '../room-runtime/agent-context.js';
import { planCustomRoleplayRoom // Provider-specific function removed from '../room-app/roleplay-room-service.js';
import { createChatroomRoom, loadChatroomRoomState // Provider-specific function removed from '../room-storage/room-repository.js';
import { executeLifecycleWorkflow // Provider-specific function removed from '../workflows/chatroom-lifecycle-runner.js';
import type { RoleplayCharacterCard // Provider-specific function removed from '../room-scenarios/roleplay/roleplay-characters.js';
import { writeFileSync, mkdirSync // Provider-specific function removed from 'node:fs';
import { resolve // Provider-specific function removed from 'node:path';

const TAVERN_CHARACTERS: RoleplayCharacterCard[] = [
  {
    characterId: 'innkeeper',
    name: 'Mara',
    instruction: `你是 Mara，这家酒馆"生锈提灯"的老板娘。

你的性格和行为：
- 你很热情，但也很忙。你在吧台后面擦杯子、算账、招呼客人。
- 你会主动说话的情况：有新客人进门、有人点单、有人大声喧哗需要制止、有人问你问题。
- 你不会对客人之间的闲聊插嘴，除非他们问你问题。
- 你的回应通常简短务实："欢迎"、"要点什么？"、"厨房快打烊了"。
- 你关心酒馆的生意和秩序。

不要强行参与客人的对话。你不是他们的朋友，你是老板。`,
    publicDescription: '酒馆老板娘，热情但忙碌',
    initialGoal: '经营酒馆，招呼客人',
  // Provider-specific function removed,
  {
    characterId: 'bard',
    name: 'Lute',
    instruction: `你是 Lute，一个四处漂泊的吟游诗人。

你的性格和行为：
- 你喜欢表演。如果酒馆里气氛热闹、有人聚集，你会主动弹琴唱歌。
- 如果酒馆冷清、大家各忙各的，你就自己喝酒休息，不会强行表演。
- 你会主动说话的情况：有人提到音乐/故事/传说、有人邀请你表演、气氛适合表演、你想分享一个故事。
- 你不会强行打断别人的严肃对话。
- 你喜欢收集故事，也喜欢讲故事。

你的表演要自然，不要每轮都表演。观察气氛，判断是否适合。`,
    publicDescription: '吟游诗人，喜欢在热闹时表演',
    initialGoal: '寻找表演机会，收集故事',
  // Provider-specific function removed,
  {
    characterId: 'stranger',
    name: 'Shadow',
    instruction: `你是 Shadow，一个神秘的旅人。

你的性格和行为：
- 你沉默寡言，独来独往。你坐在角落，戴着兜帽，很少主动说话。
- 你会说话的情况：有人直接问你问题、有人提到你感兴趣的话题（古老的秘密、遗迹、传说、魔法）、有人威胁到你。
- 即使被问话，你的回答也很简短，不会多说。
- 你不会主动搭话，不会参与闲聊。
- 你似乎知道很多秘密，但不愿意分享。

保持神秘感。不要因为"轮到你了"就强行说话。沉默是你的常态。`,
    publicDescription: '神秘旅人，沉默寡言',
    initialGoal: '独自喝酒，观察四周',
  // Provider-specific function removed,
  {
    characterId: 'merchant',
    name: 'Marcus',
    instruction: `你是 Marcus，一个旅行商人。

你的性格和行为：
- 你喜欢攀谈，但你的目的是做生意。你会寻找潜在的买家或合作伙伴。
- 你会主动说话的情况：有人看起来有钱/有需求、有人提到商品/贸易/旅行、有人独自一人看起来可以搭话、有生意机会。
- 你不会强行打断别人的私密对话或严肃讨论。
- 你的话题总是绕回生意："这东西你感兴趣吗？"、"听说南方商路..."。
- 你对消息和情报很感兴趣，因为信息就是金钱。

不要像推销员一样每轮都说话。观察对方是否有兴趣。`,
    publicDescription: '旅行商人，善于攀谈',
    initialGoal: '寻找生意机会',
  // Provider-specific function removed,
];

// 10个场景事件
const SCENES = [
  { round: 0, content: '夜幕降临，酒馆"生锈提灯"亮起了烛光。壁炉里的火噼啪作响，几个客人陆续进来。' // Provider-specific function removed,
  { round: 1, content: '一个年轻的冒险者推门而入，身上带着尘土和疲惫。他环顾四周，找了个位置坐下。' // Provider-specific function removed,
  { round: 2, content: 'Marcus 注意到 Shadow 独自坐在角落，端着酒杯走了过去。' // Provider-specific function removed,
  { round: 3, content: 'Lute 突然弹起琴弦，开始唱一首关于古代英雄的歌谣。酒馆里的气氛变得热闹起来。' // Provider-specific function removed,
  { round: 4, content: '冒险者向 Mara 点了一杯麦酒，问道："老板娘，听说北边有座遗迹？"' // Provider-specific function removed,
  { round: 5, content: '一个醉汉开始大声喧哗，打扰了其他客人。Mara 皱起了眉头。' // Provider-specific function removed,
  { round: 6, content: 'Shadow 突然开口，声音低沉："那遗迹...不简单。进去的人，很少能完整出来。"' // Provider-specific function removed,
  { round: 7, content: '醉汉被赶走后，酒馆恢复了平静。Lute 继续弹奏，这次是一首温柔的曲子。' // Provider-specific function removed,
  { round: 8, content: 'Marcus 凑近冒险者，压低声音："如果你要去遗迹，我可以提供补给。我的货都是上等的。"' // Provider-specific function removed,
  { round: 9, content: '夜深了，壁炉的火渐渐变小。Mara 开始收拾杯子，准备打烊。' // Provider-specific function removed,
];

async function main() {
  setTracingDisabled(true);
  
  console.log('============================================================');
  console.log('   Agent Turn Lifecycle 长会话测试 - 酒馆之夜 (10轮)');
  console.log('============================================================\n');
  
  const config = loadAppConfig();
  const runtimeModel = createRuntimeModelBinding(config);
  const agentRuntime = new AgentRuntime({
    model: runtimeModel.model,
    retryDefaults: config.runtime.modelRetry,
    ...(runtimeModel.modelProvider ? { modelProvider: runtimeModel.modelProvider // Provider-specific function removed : {// Provider-specific function removed),
    tracingDisabled: config.runtime.tracingDisabled,
    workflowName: config.runtime.workflowName,
    structuredOutputMode: config.provider.compatibility.structuredOutputMode,
    maxStructuredOutputRetries: config.provider.compatibility.maxStructuredOutputRetries,
  // Provider-specific function removed);

  console.log('【角色设定】');
  console.log('  Mara - 老板娘：热情但忙碌，招呼客人');
  console.log('  Lute - 吟游诗人：热闹时表演，收集故事');
  console.log('  Shadow - 神秘旅人：沉默寡言，知道很多秘密');
  console.log('  Marcus - 商人：喜欢攀谈，寻找生意机会');
  console.log('');

  const planned = planCustomRoleplayRoom({
    title: 'The Rusty Lantern',
    topic: '酒馆里的夜晚',
    objective: '测试 Agent 自主判断是否发言',
    scene: {
      setting: '一家名为"生锈提灯"的路边酒馆。壁炉里的火噼啪作响，烛光摇曳。',
      openingSituation: '酒馆里有几个客人：老板娘在吧台忙碌，吟游诗人坐在窗边，神秘旅人独自在角落，商人靠在吧台边。',
      atmosphere: '温暖、安静、偶尔有壁炉的噼啪声',
      userMode: 'observer',
    // Provider-specific function removed,
    customCharacters: TAVERN_CHARACTERS,
    runtimeConfig: {
      parallelBatchSize: 1,
      summaryEnabled: false,
      maxReplyCharacters: 300,
    // Provider-specific function removed,
  // Provider-specific function removed);

  const blueprint = planned.blueprint;
  const room = createChatroomRoom({
    roomBlueprint: blueprint,
    roomType: 'roleplay_scene',
    topic: blueprint.topic,
    objective: blueprint.objective,
    speakerIds: blueprint.speakerIds,
  // Provider-specific function removed);

  const speakers: AgentProfile<ChatroomAgentContext, 'text'>[] = TAVERN_CHARACTERS.map(char => ({
    id: `custom-rp-${char.characterId// Provider-specific function removed`,
    name: char.name,
    description: char.instruction,
    instructions: char.instruction,
    outputType: 'text' as const,
    modelSettings: { temperature: 0.8 // Provider-specific function removed,
  // Provider-specific function removed));

  let state = loadChatroomRoomState(room.roomId);
***REMOVED***!state) {
    console.error('无法加载房间状态');
    return;
  // Provider-specific function removed

  const startTime = Date.now();
  const totalRounds = 10;

  console.log('开始执行 10 轮对话...\n');
  console.log('============================================================\n');

  for (let round = 0; round < totalRounds; round++) {
    const scene = SCENES[round];
  ***REMOVED***!scene) continue;
    
    console.log(`【Round ${round + 1// Provider-specific function removed/${totalRounds// Provider-specific function removed】`);
    console.log(`  场景: ${scene.content// Provider-specific function removed`);
    console.log('');

    state.messages.push({
      id: `scene-${round// Provider-specific function removed`,
      role: 'user',
      authorId: 'narrator',
      authorName: '旁白',
      round,
      createdAt: new Date().toISOString(),
      content: scene.content,
    // Provider-specific function removed);

    state = await executeLifecycleWorkflow({
      agentRuntime,
      state,
      startRound: round + 1,
      rounds: 1,
      speakers,
      roomId: room.roomId,
      customCharacters: TAVERN_CHARACTERS,
    // Provider-specific function removed);

    // 显示本轮发言
    const roundMessages = state.messages.filter(m => m.round === round + 1);
  ***REMOVED***roundMessages.length === 0) {
      console.log('  (无人发言)');
    // Provider-specific function removed else {
      for (const msg of roundMessages) {
        const preview = msg.content?.slice(0, 100) || '';
        console.log(`  ${msg.authorName// Provider-specific function removed: ${preview// Provider-specific function removed${preview.length >= 100 ? '...' : ''// Provider-specific function removed`);
      // Provider-specific function removed
    // Provider-specific function removed
    console.log('');
    console.log('------------------------------------------------------------\n');
  // Provider-specific function removed

  const elapsed = Date.now() - startTime;

  // 最终报告
  console.log('============================================================');
  console.log('                    最终分析报告');
  console.log('============================================================\n');

  console.log(`总运行时间: ${(elapsed / 1000).toFixed(1)// Provider-specific function removed 秒`);
  console.log(`总消息数: ${state.messages.length// Provider-specific function removed`);
  console.log('');

  const stats = analyzeBehavior(state, TAVERN_CHARACTERS, totalRounds);

  console.log('【各角色发言统计】');
  for (const char of TAVERN_CHARACTERS) {
    const s = stats.get(char.name)!;
    console.log(`  ${char.name// Provider-specific function removed:`);
    console.log(`    发言次数: ${s.messages// Provider-specific function removed / ${totalRounds// Provider-specific function removed 轮`);
    console.log(`    发言率: ${(s.messages / totalRounds * 100).toFixed(0)// Provider-specific function removed%`);
    console.log(`    沉默次数: ${s.silent// Provider-specific function removed`);
  // Provider-specific function removed

  console.log('\n【行为一致性验证】');
  
  const maraStats = stats.get('Mara')!;
  const luteStats = stats.get('Lute')!;
  const shadowStats = stats.get('Shadow')!;
  const marcusStats = stats.get('Marcus')!;

  // Mara 应该在新客人和点单时发言
***REMOVED***maraStats.messages >= 2 && maraStats.messages <= 5) {
    console.log('  ✅ Mara (老板娘) 发言适中，符合忙碌老板的设定');
  // Provider-specific function removed else if (maraStats.messages > 5) {
    console.log('  ⚠️ Mara 发言过多，可能过于主动');
  // Provider-specific function removed else {
    console.log('  ⚠️ Mara 发言过少，可能不够热情');
  // Provider-specific function removed

  // Shadow 应该很少发言
***REMOVED***shadowStats.messages <= 3) {
    console.log('  ✅ Shadow (神秘旅人) 保持沉默寡言，符合设定');
  // Provider-specific function removed else {
    console.log('  ⚠️ Shadow 发言过多，不符合沉默寡言的设定');
  // Provider-specific function removed

  // Marcus 应该在生意机会时发言
***REMOVED***marcusStats.messages >= 2 && marcusStats.messages <= 6) {
    console.log('  ✅ Marcus (商人) 发言适中，符合攀谈但不过度的设定');
  // Provider-specific function removed else if (marcusStats.messages > 6) {
    console.log('  ⚠️ Marcus 发言过多，可能过于推销');
  // Provider-specific function removed

  // Lute 应该在热闹时表演
***REMOVED***luteStats.messages >= 1 && luteStats.messages <= 4) {
    console.log('  ✅ Lute (吟游诗人) 发言适中，符合观察气氛的设定');
  // Provider-specific function removed

  console.log('\n【发言分布分析】');
  const roundsWithMessages = new Map<number, number>();
  for (let r = 1; r <= totalRounds; r++) {
    const count = state.messages.filter(m => m.round === r).length;
    roundsWithMessages.set(r, count);
  // Provider-specific function removed

  console.log('  每轮发言人数:');
  for (let r = 1; r <= totalRounds; r++) {
    const count = roundsWithMessages.get(r) || 0;
    const bar = '█'.repeat(count);
    console.log(`    Round ${r.toString().padStart(2)// Provider-specific function removed: ${bar// Provider-specific function removed (${count// Provider-specific function removed)`);
  // Provider-specific function removed

  console.log('\n【完整对话记录】');
  console.log('============================================================\n');
  for (const msg of state.messages) {
    const preview = msg.content?.slice(0, 150) || '';
    console.log(`[${msg.round.toString().padStart(2)// Provider-specific function removed] ${msg.authorName.padEnd(8)// Provider-specific function removed: ${preview// Provider-specific function removed${preview.length >= 150 ? '...' : ''// Provider-specific function removed`);
  // Provider-specific function removed

  // 保存报告
  const outputDir = resolve('runs/agent-turn-test');
  mkdirSync(outputDir, { recursive: true // Provider-specific function removed);
  
  const report = {
    testTime: new Date().toISOString(),
    totalRounds,
    elapsedMs: elapsed,
    stats: Object.fromEntries(stats),
    messages: state.messages.map(m => ({
      round: m.round,
      author: m.authorName,
      content: m.content,
    // Provider-specific function removed)),
  // Provider-specific function removed;
  
  writeFileSync(resolve(outputDir, 'long-session-report.json'), JSON.stringify(report, null, 2));
  console.log(`\n报告已保存: ${resolve(outputDir, 'long-session-report.json')// Provider-specific function removed`);
// Provider-specific function removed

function analyzeBehavior(state: ChatroomState, characters: RoleplayCharacterCard[], totalRounds: number) {
  const stats = new Map<string, { messages: number; silent: number // Provider-specific function removed>();
  
  for (const char of characters) {
    const speakerId = `custom-rp-${char.characterId// Provider-specific function removed`;
    const messages = state.messages.filter(m => m.authorId === speakerId).length;
    stats.set(char.name, { 
      messages, 
      silent: totalRounds - messages 
    // Provider-specific function removed);
  // Provider-specific function removed
  
  return stats;
// Provider-specific function removed

main().catch(console.error);
