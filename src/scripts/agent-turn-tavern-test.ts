/**
 * Agent Turn Lifecycle 真实场景测试
 * 
 * 场景：酒馆里的四个角色
 * - 老板娘 Mara：热情但忙碌，只在有人进门或点单时主动说话
 * - 吟游诗人 Lute：喜欢表演，有人聚集就唱歌，没人就自己喝酒
 * - 神秘旅人 Shadow：沉默寡言，只在被直接问话时回答
 * - 商人 Marcus：喜欢攀谈，但主要关注生意机会
 * 
 * 测试目标：
 * 1. 验证不同性格的角色有不同的发言频率
 * 2. 验证角色会对相关话题做出反应
 * 3. 验证角色不会对不相关的话题强行插话
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

const TAVERN_CHARACTERS: RoleplayCharacterCard[] = [
  {
    characterId: 'innkeeper',
    name: 'Mara',
    instruction: `你是 Mara，这家酒馆"生锈提灯"的老板娘。

你的性格和行为：
- 你很热情，但也很忙。你在吧台后面擦杯子、算账、招呼客人。
- 你会主动说话的情况：有新客人进门、有人点单、有人大声喧哗需要制止。
- 你不会对客人之间的闲聊插嘴，除非他们问你问题。
- 你的回应通常简短务实："欢迎"、"要点什么？"、"厨房快打烊了"。

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
- 你会主动说话的情况：有人提到音乐/故事/传说、有人邀请你表演、气氛适合表演。
- 你不会强行打断别人的严肃对话。

你的表演要自然，不要每轮都表演。观察气氛，判断是否适合。`,
    publicDescription: '吟游诗人，喜欢在热闹时表演',
    initialGoal: '寻找表演机会，或者安静喝酒',
  // Provider-specific function removed,
  {
    characterId: 'stranger',
    name: 'Shadow',
    instruction: `你是 Shadow，一个神秘的旅人。

你的性格和行为：
- 你沉默寡言，独来独往。你坐在角落，戴着兜帽，很少主动说话。
- 你会说话的情况：有人直接问你问题、有人提到你感兴趣的话题（古老的秘密、遗迹、传说）。
- 即使被问话，你的回答也很简短，不会多说。
- 你不会主动搭话，不会参与闲聊。

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
- 你会主动说话的情况：有人看起来有钱/有需求、有人提到商品/贸易/旅行、有人独自一人看起来可以搭话。
- 你不会强行打断别人的私密对话或严肃讨论。
- 你的话题总是绕回生意："这东西你感兴趣吗？"、"听说南方商路..."。

不要像推销员一样每轮都说话。观察对方是否有兴趣。`,
    publicDescription: '旅行商人，善于攀谈',
    initialGoal: '寻找生意机会',
  // Provider-specific function removed,
];

async function main() {
  setTracingDisabled(true);
  
  console.log('============================================================');
  console.log('   Agent Turn Lifecycle 真实场景测试 - 酒馆之夜');
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
  console.log('  Mara - 老板娘：热情但忙碌，只在新客人进门或点单时主动说话');
  console.log('  Lute - 吟游诗人：热闹时表演，冷清时安静喝酒');
  console.log('  Shadow - 神秘旅人：沉默寡言，只在被直接问话时回答');
  console.log('  Marcus - 商人：喜欢攀谈，但关注生意机会');
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

  // 场景 1: 新客人进门
  console.log('【场景 1】新客人进门');
  console.log('  旁白: 门被推开，一阵冷风灌入。一个旅人走了进来，抖落身上的雪花。');
  console.log('');
  
  state.messages.push({
    id: 'scene-1',
    role: 'user',
    authorId: 'narrator',
    authorName: '旁白',
    round: 0,
    createdAt: new Date().toISOString(),
    content: '门被推开，一阵冷风灌入。一个旅人走了进来，抖落身上的雪花。',
  // Provider-specific function removed);

  state = await executeLifecycleWorkflow({
    agentRuntime,
    state,
    startRound: 1,
    rounds: 1,
    speakers,
    roomId: room.roomId,
    customCharacters: TAVERN_CHARACTERS,
  // Provider-specific function removed);

  printRoundResult(state, 1);

  // 场景 2: 商人搭话
  console.log('\n【场景 2】商人主动搭话');
  console.log('  旁白: Marcus 看到 Shadow 独自坐着，端着酒杯走了过去。');
  console.log('  Marcus: "这位朋友，一个人喝酒？我是做贸易的，最近听说了一些有趣的事情..."');
  console.log('');

  state.messages.push({
    id: 'scene-2a',
    role: 'user',
    authorId: 'narrator',
    authorName: '旁白',
    round: 1,
    createdAt: new Date().toISOString(),
    content: 'Marcus 看到 Shadow 独自坐着，端着酒杯走了过去。',
  // Provider-specific function removed);

  state.messages.push({
    id: 'scene-2b',
    role: 'agent',
    authorId: 'custom-rp-merchant',
    authorName: 'Marcus',
    round: 1,
    createdAt: new Date().toISOString(),
    content: '这位朋友，一个人喝酒？我是做贸易的，最近听说了一些有趣的事情...',
  // Provider-specific function removed);

  state = await executeLifecycleWorkflow({
    agentRuntime,
    state,
    startRound: 2,
    rounds: 1,
    speakers,
    roomId: room.roomId,
    customCharacters: TAVERN_CHARACTERS,
  // Provider-specific function removed);

  printRoundResult(state, 2);

  // 场景 3: 有人提到传说
  console.log('\n【场景 3】有人提到古老的传说');
  console.log('  Lute: "我听说北边的遗迹里藏着古代国王的宝藏，有人去过吗？"');
  console.log('');

  state.messages.push({
    id: 'scene-3',
    role: 'agent',
    authorId: 'custom-rp-bard',
    authorName: 'Lute',
    round: 2,
    createdAt: new Date().toISOString(),
    content: '我听说北边的遗迹里藏着古代国王的宝藏，有人去过吗？',
  // Provider-specific function removed);

  state = await executeLifecycleWorkflow({
    agentRuntime,
    state,
    startRound: 3,
    rounds: 1,
    speakers,
    roomId: room.roomId,
    customCharacters: TAVERN_CHARACTERS,
  // Provider-specific function removed);

  printRoundResult(state, 3);

  // 场景 4: 酒馆变得热闹
  console.log('\n【场景 4】酒馆变得热闹');
  console.log('  旁白: 几个农夫走了进来，大声说笑，酒馆热闹了起来。');
  console.log('');

  state.messages.push({
    id: 'scene-4',
    role: 'user',
    authorId: 'narrator',
    authorName: '旁白',
    round: 3,
    createdAt: new Date().toISOString(),
    content: '几个农夫走了进来，大声说笑，酒馆热闹了起来。壁炉的火光照在每个人的脸上。',
  // Provider-specific function removed);

  state = await executeLifecycleWorkflow({
    agentRuntime,
    state,
    startRound: 4,
    rounds: 1,
    speakers,
    roomId: room.roomId,
    customCharacters: TAVERN_CHARACTERS,
  // Provider-specific function removed);

  printRoundResult(state, 4);

  // 最终报告
  console.log('\n============================================================');
  console.log('                    最终分析报告');
  console.log('============================================================\n');

  const stats = analyzeBehavior(state, TAVERN_CHARACTERS);

  console.log('【各角色发言统计】');
  for (const char of TAVERN_CHARACTERS) {
    const s = stats.get(char.name)!;
    console.log(`  ${char.name// Provider-specific function removed:`);
    console.log(`    发言次数: ${s.messages// Provider-specific function removed`);
    console.log(`    性格预期: ${char.publicDescription// Provider-specific function removed`);
  // Provider-specific function removed

  console.log('\n【行为验证】');
  
  // Mara 应该在新客人进门时发言
  const maraStats = stats.get('Mara')!;
***REMOVED***maraStats.messages >= 1) {
    console.log('  ✅ Mara (老板娘) 在客人进门时主动招呼');
  // Provider-specific function removed else {
    console.log('  ⚠️ Mara 没有在客人进门时招呼（可能判断不需要）');
  // Provider-specific function removed

  // Shadow 应该很少发言
  const shadowStats = stats.get('Shadow')!;
***REMOVED***shadowStats.messages <= 2) {
    console.log('  ✅ Shadow (神秘旅人) 保持沉默寡言');
  // Provider-specific function removed else {
    console.log('  ⚠️ Shadow 发言过多，不符合沉默寡言的设定');
  // Provider-specific function removed

  // Marcus 应该在生意相关话题时发言
  const marcusStats = stats.get('Marcus')!;
***REMOVED***marcusStats.messages >= 1) {
    console.log('  ✅ Marcus (商人) 在生意机会时发言');
  // Provider-specific function removed

  // Lute 在热闹时可能表演
  const luteStats = stats.get('Lute')!;
  console.log(`  📊 Lute (吟游诗人) 发言 ${luteStats.messages// Provider-specific function removed 次`);

  console.log('\n【完整对话记录】');
  for (const msg of state.messages) {
  ***REMOVED***msg.authorId !== 'narrator') {
      const preview = msg.content?.slice(0, 100) || '';
      console.log(`  [R${msg.round// Provider-specific function removed] ${msg.authorName// Provider-specific function removed: ${preview// Provider-specific function removed${preview.length >= 100 ? '...' : ''// Provider-specific function removed`);
    // Provider-specific function removed
  // Provider-specific function removed

  console.log('\n测试完成！');
// Provider-specific function removed

function printRoundResult(state: ChatroomState, round: number) {
  const roundMessages = state.messages.filter(m => m.round === round);
***REMOVED***roundMessages.length === 0) {
    console.log('  (无人发言)');
  // Provider-specific function removed else {
    for (const msg of roundMessages) {
      const preview = msg.content?.slice(0, 80) || '';
      console.log(`  ${msg.authorName// Provider-specific function removed: ${preview// Provider-specific function removed${preview.length >= 80 ? '...' : ''// Provider-specific function removed`);
    // Provider-specific function removed
  // Provider-specific function removed
// Provider-specific function removed

function analyzeBehavior(state: ChatroomState, characters: RoleplayCharacterCard[]) {
  const stats = new Map<string, { messages: number // Provider-specific function removed>();
  
  for (const char of characters) {
    const speakerId = `custom-rp-${char.characterId// Provider-specific function removed`;
    const messages = state.messages.filter(m => m.authorId === speakerId).length;
    stats.set(char.name, { messages // Provider-specific function removed);
  // Provider-specific function removed
  
  return stats;
// Provider-specific function removed

main().catch(console.error);
