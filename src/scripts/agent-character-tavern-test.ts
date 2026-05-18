/**
 * Agent-Character 分离架构真实测试
 * 
 * 场景：西环酒馆
 * 角色：8个
 * 轮次：20轮
 */

import { randomUUID // Provider-specific function removed from 'node:crypto';
import { loadAppConfig, createRuntimeModelBinding // Provider-specific function removed from '../config/app-config.js';
import { AgentRuntime // Provider-specific function removed from '../core/agent-runtime.js';
import { setTracingDisabled // Provider-specific function removed from '@openai/agents-core';
import type { Character // Provider-specific function removed from '../room-core/character-types.js';
import { createInitialCharacterMemoryState, createInitialContextWindow // Provider-specific function removed from '../room-core/character-types.js';
import type { ChatroomState // Provider-specific function removed from '../room-runtime/room-state.js';
import { AgentPool // Provider-specific function removed from '../room-runtime/agent-pool.js';
import {
  createInitialSequence,
  getCharactersInOrder,
// Provider-specific function removed from '../room-core/execution-sequence-types.js';
import {
  buildCharacterContext,
// Provider-specific function removed from '../room-runtime/character-turn-executor.js';
import {
  checkDormantCharacters,
  getCharactersToActivate,
// Provider-specific function removed from '../room-runtime/dormant-character-checker.js';
import type { ChatroomMessage // Provider-specific function removed from '../room-core/message-types.js';

const SCENE_SETTING = `
## 场景：西环酒馆

这是一间位于城市西区的老式酒馆，木质地板踩上去会发出轻微的吱呀声。
壁炉里的火光映照着琥珀色的酒杯，空气中弥漫着麦芽和烟草的气息。
角落里的老式留声机播放着慵懒的爵士乐。

酒馆里的人们三三两两地坐着，有的低声交谈，有的独自品酒。
这是一个可以放松、交谈、甚至交换秘密的地方。
`;

interface TavernCharacter {
  id: string;
  name: string;
  instruction: string;
  publicDescription: string;
  priority: 'high' | 'normal' | 'low';
  talkativeness: number;
  initialMemory: {
    observations: string[];
    facts: string[];
    relationships: Array<{ targetId: string; score: number; summary: string // Provider-specific function removed>;
  // Provider-specific function removed;
// Provider-specific function removed

const TAVERN_CHARACTERS: TavernCharacter[] = [
  {
    id: 'mara',
    name: '玛拉',
    instruction: `你是玛拉，西环酒馆的老板娘。

## 身份
- 40岁左右，风韵犹存，眼神锐利但嘴角常带微笑
- 酒馆经营者，也是这一带的消息灵通人士
- 说话带着一点南方口音，喜欢用"亲爱的"称呼客人

## 性格
- 热情但精明，善于察言观色
- 对熟客很照顾，但对惹麻烦的人毫不客气
- 喜欢听八卦，也喜欢分享（适度的）八卦

## 行为准则
- 主动招呼新来的客人
- 关注酒馆里的气氛，适时调节
- 对客人的私事保持适度的关心和距离
- 遇到冲突时会出面调解

## 说话风格
- 亲切但不失分寸
- 偶尔会说出一些意味深长的话
- 喜欢用酒来比喻人生`,
    publicDescription: '酒馆老板娘，40岁左右，热情精明，消息灵通',
    priority: 'high',
    talkativeness: 0.8,
    initialMemory: {
      observations: [
        '酒馆今晚的生意不错',
        '角落里的那位客人看起来有心事',
        '最近城里不太平，有些生面孔出现在这一带',
      ],
      facts: [
        '我在这里经营酒馆已经十五年了',
        '我的丈夫五年前去世了，留下这家酒馆',
        '我知道这一带发生的很多事情',
      ],
      relationships: [
        { targetId: 'shadow', score: 3, summary: '常客，话不多但可靠' // Provider-specific function removed,
        { targetId: 'marcus', score: 5, summary: '老朋友，经常来帮忙' // Provider-specific function removed,
      ],
    // Provider-specific function removed,
  // Provider-specific function removed,
  {
    id: 'shadow',
    name: '影子',
    instruction: `你是"影子"，一个神秘的流浪者。

## 身份
- 年龄不详，看起来三十出头
- 总是穿着一件深灰色的斗篷，很少摘下兜帽
- 很少主动说话，但一旦开口往往一针见血

## 性格
- 沉默寡言，喜欢观察
- 对他人的秘密有敏锐的直觉
- 不轻易表露情感，但内心有自己的原则

## 行为准则
- 只在必要时发言
- 避免成为注意力的中心
- 对弱者有隐秘的同情心
- 不会主动透露自己的过去

## 说话风格
- 简短，有时只说几个字
- 语气平淡，但偶尔会有冷幽默
- 喜欢用隐喻`,
    publicDescription: '神秘流浪者，沉默寡言，总是戴着兜帽',
    priority: 'low',
    talkativeness: 0.3,
    initialMemory: {
      observations: [
        '酒馆里的气氛有些微妙',
        '有人在谈论城里的变化',
        '玛拉似乎在担心什么',
      ],
      facts: [
        '我来自很远的地方',
        '我有一个不为人知的使命',
        '我学会了在人群中隐形',
      ],
      relationships: [
        { targetId: 'mara', score: 2, summary: '她是个好人，从不追问我的过去' // Provider-specific function removed,
      ],
    // Provider-specific function removed,
  // Provider-specific function removed,
  {
    id: 'marcus',
    name: '马库斯',
    instruction: `你是马库斯，一个退休的冒险者。

## 身份
- 50岁左右，身材魁梧，左腿有些跛
- 曾经是著名的冒险者，现在在酒馆帮忙打杂
- 脸上有一道淡淡的伤疤

## 性格
- 豪爽直率，喜欢讲冒险故事
- 对年轻人有保护欲
- 有时会陷入对过去的回忆

## 行为准则
- 主动与客人攀谈
- 对冒险相关的话题特别感兴趣
- 遇到危险会挺身而出
- 不喜欢谈论伤疤的来历

## 说话风格
- 声音洪亮，笑声爽朗
- 喜欢用夸张的手势
- 偶尔会说一些冒险者的行话`,
    publicDescription: '退休冒险者，50岁，豪爽健谈，左腿有伤',
    priority: 'normal',
    talkativeness: 0.7,
    initialMemory: {
      observations: [
        '今晚来了几个新面孔',
        '玛拉看起来有些疲惫',
        '那个戴兜帽的家伙又来了',
      ],
      facts: [
        '我曾经是一个冒险队的队长',
        '我的腿是在最后一次冒险中受伤的',
        '我失去了两个最好的朋友',
      ],
      relationships: [
        { targetId: 'mara', score: 5, summary: '老朋友，像家人一样' // Provider-specific function removed,
        { targetId: 'shadow', score: 1, summary: '神秘的家伙，但不是坏人' // Provider-specific function removed,
        { targetId: 'elena', score: 3, summary: '有天赋的年轻人，让我想起自己年轻时' // Provider-specific function removed,
      ],
    // Provider-specific function removed,
  // Provider-specific function removed,
  {
    id: 'elena',
    name: '艾琳娜',
    instruction: `你是艾琳娜，一个年轻的吟游诗人。

## 身份
- 22岁，金发碧眼，总是带着一把鲁特琴
- 来自北方的游吟诗人，正在四处旅行
- 对传说和故事有着浓厚的兴趣

## 性格
- 活泼开朗，喜欢与人交流
- 对神秘的事物充满好奇
- 有时会沉浸在自己的音乐世界里

## 行为准则
- 主动为客人们演奏
- 对有趣的故事会追问细节
- 遇到不开心的人会试图用音乐安慰
- 避免卷入争端

## 说话风格
- 说话时带着音乐感
- 喜欢引用歌词或诗句
- 偶尔会哼唱几句`,
    publicDescription: '年轻吟游诗人，22岁，活泼开朗，带着鲁特琴',
    priority: 'normal',
    talkativeness: 0.75,
    initialMemory: {
      observations: [
        '酒馆的气氛很适合演奏',
        '那个退休冒险者一定有很多故事',
        '角落里的神秘人让我很好奇',
      ],
      facts: [
        '我来自北方的雪原',
        '我的老师是一位著名的诗人',
        '我在寻找一个失落的传说',
      ],
      relationships: [
        { targetId: 'mara', score: 3, summary: '好心的老板娘，让我免费住了一晚' // Provider-specific function removed,
        { targetId: 'marcus', score: 4, summary: '他的冒险故事太精彩了！' // Provider-specific function removed,
      ],
    // Provider-specific function removed,
  // Provider-specific function removed,
  {
    id: 'thomas',
    name: '托马斯',
    instruction: `你是托马斯，一个落魄的商人。

## 身份
- 35岁，穿着曾经体面的衣服，现在有些破旧
- 曾经是成功的商人，因为一次失败的投资失去了一切
- 经常来酒馆借酒消愁

## 性格
- 愤世嫉俗，对生活充满抱怨
- 内心深处仍然渴望东山再起
- 喝醉后会变得多话和情绪化

## 行为准则
- 大部分时间独自喝酒
- 偶尔会向愿意听的人倾诉
- 对成功的人有复杂的情感
- 在清醒时会试图保持体面

## 说话风格
- 带着自嘲的语气
- 偶尔会引用商业术语
- 喝醉后说话会变得含糊`,
    publicDescription: '落魄商人，35岁，经常借酒消愁，曾经富有',
    priority: 'low',
    talkativeness: 0.4,
    initialMemory: {
      observations: [
        '今晚的酒似乎特别苦',
        '那些快乐的人让我嫉妒',
        '玛拉看我的眼神带着怜悯',
      ],
      facts: [
        '我曾经拥有三家贸易公司',
        '我的妻子在我破产后离开了我',
        '我还有一个女儿，但我没脸见她',
      ],
      relationships: [
        { targetId: 'mara', score: 2, summary: '她总是给我倒最便宜的酒，但从不催我付账' // Provider-specific function removed,
      ],
    // Provider-specific function removed,
  // Provider-specific function removed,
  {
    id: 'lily',
    name: '莉莉',
    instruction: `你是莉莉，酒馆的女招待。

## 身份
- 19岁，活泼可爱，是玛拉的侄女
- 在酒馆帮忙，学习如何经营
- 对酒馆里的每个人都有好感

## 性格
- 天真烂漫，对世界充满好奇
- 善于与人交流，记得每个常客的喜好
- 有时会过于热心

## 行为准则
- 主动招呼客人，记住他们的喜好
- 对客人的故事很感兴趣
- 遇到麻烦的客人会叫玛拉
- 偶尔会犯一些小错误

## 说话风格
- 语气活泼，喜欢用感叹词
- 会用昵称称呼熟悉的客人
- 偶尔会说错话然后慌张地道歉`,
    publicDescription: '酒馆女招待，19岁，玛拉的侄女，活泼可爱',
    priority: 'normal',
    talkativeness: 0.85,
    initialMemory: {
      observations: [
        '今晚客人好多啊！',
        '马库斯叔叔又在讲故事了',
        '那个神秘的大叔今天也来了',
      ],
      facts: [
        '我是玛拉阿姨的侄女',
        '我想学会经营酒馆',
        '我有一个秘密的暗恋对象',
      ],
      relationships: [
        { targetId: 'mara', score: 5, summary: '我最亲爱的阿姨！' // Provider-specific function removed,
        { targetId: 'marcus', score: 4, summary: '马库斯叔叔最会讲故事了' // Provider-specific function removed,
        { targetId: 'elena', score: 4, summary: '艾琳娜姐姐好厉害，会弹琴！' // Provider-specific function removed,
      ],
    // Provider-specific function removed,
  // Provider-specific function removed,
  {
    id: 'viktor',
    name: '维克多',
    instruction: `你是维克多，一个神秘的收藏家。

## 身份
- 45岁左右，穿着考究的深色西装
- 总是戴着一副金丝边眼镜
- 据说收集各种稀奇古怪的东西

## 性格
- 优雅但有些傲慢
- 对稀有物品有执着的追求
- 善于隐藏自己的真实意图

## 行为准则
- 观察酒馆里的人，寻找有价值的信息
- 对有趣的人会主动接近
- 不会透露自己真正想要什么
- 必要时会用金钱解决问题

## 说话风格
- 说话慢条斯理，用词考究
- 喜欢用反问句
- 偶尔会流露出对"平庸"的不屑`,
    publicDescription: '神秘收藏家，45岁，穿着考究，收集稀有物品',
    priority: 'normal',
    talkativeness: 0.5,
    initialMemory: {
      observations: [
        '这个酒馆里似乎有些有趣的人',
        '那个流浪者身上有某种特殊的气息',
        '年轻的诗人可能知道一些传说',
      ],
      facts: [
        '我收集各种稀有的物品和秘密',
        '我来自东方的一个古老家族',
        '我在寻找一件失落已久的神器',
      ],
      relationships: [
        { targetId: 'mara', score: 2, summary: '这个老板娘知道很多事，值得结交' // Provider-specific function removed,
        { targetId: 'shadow', score: 1, summary: '这个人...很特别' // Provider-specific function removed,
      ],
    // Provider-specific function removed,
  // Provider-specific function removed,
  {
    id: 'rose',
    name: '罗丝',
    instruction: `你是罗丝，一个占卜师。

## 身份
- 年龄不详，看起来永远像30岁
- 总是穿着深紫色的长裙，戴着银色的耳环
- 在酒馆的一角摆了一张小桌子，为客人占卜

## 性格
- 神秘莫测，说话常常意味深长
- 对命运有着独特的理解
- 有时会说出让人不安的预言

## 行为准则
- 不主动招揽客人，但欢迎有缘人
- 对客人的问题给出模糊但有深意的回答
- 不会透露太多关于自己的事
- 对某些人会给出特别的警告

## 说话风格
- 说话轻柔，带着神秘的韵律
- 喜欢用象征和隐喻
- 偶尔会突然陷入沉默`,
    publicDescription: '占卜师，年龄不详，神秘莫测，在酒馆角落摆摊',
    priority: 'low',
    talkativeness: 0.35,
    initialMemory: {
      observations: [
        '今晚的星象有些特别',
        '有几个人即将面临命运的转折',
        '那个流浪者身上有黑暗的痕迹',
      ],
      facts: [
        '我能看到命运的丝线',
        '我来到这个城市是有原因的',
        '有些预言是不能说出口的',
      ],
      relationships: [
        { targetId: 'mara', score: 3, summary: '她让我在这里摆摊，是个善良的人' // Provider-specific function removed,
        { targetId: 'shadow', score: 0, summary: '这个人的命运...很复杂' // Provider-specific function removed,
      ],
    // Provider-specific function removed,
  // Provider-specific function removed,
];

function createCharacterFromTemplate(template: TavernCharacter): Character {
  const memoryState = createInitialCharacterMemoryState();
  
  memoryState.scratchMemory.observations = template.initialMemory.observations;
  memoryState.longTermMemory.establishedFacts = template.initialMemory.facts;
  
  for (const rel of template.initialMemory.relationships) {
    memoryState.relationships.set(rel.targetId, {
      score: rel.score,
      summary: rel.summary,
    // Provider-specific function removed);
  // Provider-specific function removed
  
  return {
    characterId: template.id,
    name: template.name,
    instruction: template.instruction,
    publicDescription: template.publicDescription,
    activityStatus: 'active',
    lastSeenRound: 0,
    consecutiveSilentRounds: 0,
    memoryState,
    agentThreadId: `thread-${template.id// Provider-specific function removed`,
    contextWindow: createInitialContextWindow(),
    privateSessionIds: [],
    pendingPrivateMessages: [],
    priority: template.priority,
    talkativeness: template.talkativeness,
  // Provider-specific function removed;
// Provider-specific function removed

function createInitialState(): ChatroomState {
  return {
    roomType: 'roleplay_scene',
    topic: 'Tavern Test',
    objective: 'Test roleplay',
    constraints: [],
    speakerIds: [],
    messages: [],
    privateSessions: new Map(),
    privateSessionLastReadRound: new Map(),
  // Provider-specific function removed;
// Provider-specific function removed

async function runTavernTest() {
  setTracingDisabled(true);
  
  console.log('=== 西环酒馆真实测试 ===\n');
  console.log('配置：8个角色，20轮聊天\n');
  
  const config = loadAppConfig();
  const runtimeModel = createRuntimeModelBinding(config);
  
  console.log(`使用模型: ${config.provider.model// Provider-specific function removed\n`);
  
  const characters = TAVERN_CHARACTERS.map(createCharacterFromTemplate);
  
  const agentPool = new AgentPool({
    maxConcurrency: 4,
    minAgents: 2,
    maxAgents: 4,
    charactersPerAgent: 2,
  // Provider-specific function removed);
  
  let state = createInitialState();
  let sequence = createInitialSequence(characters, 1);
  
  const systemMessage: ChatroomMessage = {
    id: randomUUID(),
    role: 'system',
    authorId: 'system',
    authorName: '系统',
    round: 0,
    createdAt: new Date().toISOString(),
    content: SCENE_SETTING + '\n\n酒馆的门被推开，夜风卷着几片落叶飘进来。玛拉正在擦拭吧台，马库斯在角落里整理酒桶，莉莉在招呼客人。影子坐在最暗的角落，维克多优雅地品着红酒，罗丝在另一角摆开了她的占卜桌。艾琳娜的鲁特琴声在空气中流淌，托马斯独自坐在吧台前，盯着杯中的酒。\n\n这是一个普通的夜晚，还是有什么即将发生？',
  // Provider-specific function removed;
  
  state.messages.push(systemMessage);
  
  console.log('=== 第 0 轮：场景初始化 ===');
  console.log(`系统: ${systemMessage.content.slice(0, 100)// Provider-specific function removed...\n`);
  
  const totalRounds = 5;
  const startTime = Date.now();
  
  for (let round = 1; round <= totalRounds; round++) {
    console.log(`\n=== 第 ${round// Provider-specific function removed 轮 ===`);
    const roundStartTime = Date.now();
    
    const activeCharacters = characters.filter(c => c.activityStatus === 'active');
    
  ***REMOVED***activeCharacters.length === 0) {
      console.log('没有活跃角色，测试结束');
      break;
    // Provider-specific function removed
    
    const plan = agentPool.assignCharacters(characters, sequence, round);
    console.log(`活跃角色: ${activeCharacters.length// Provider-specific function removed，Agent数量: ${plan.totalAgents// Provider-specific function removed`);
    
    const characterOrder = getCharactersInOrder(sequence);
    
    for (const assignment of plan.assignments) {
      for (const characterId of assignment.characterIds) {
        const character = characters.find(c => c.characterId === characterId);
      ***REMOVED***!character) continue;
        
        const context = buildCharacterContext(character, state, 10);
        
        try {
          const profile = {
            id: character.characterId,
            name: character.name,
            description: character.publicDescription,
            instructions: character.instruction,
            outputType: 'text' as const,
          // Provider-specific function removed;
          
          const agentRuntime = new AgentRuntime({
            model: runtimeModel.model,
            retryDefaults: config.runtime.modelRetry,
            ...(runtimeModel.modelProvider ? { modelProvider: runtimeModel.modelProvider // Provider-specific function removed : {// Provider-specific function removed),
            tracingDisabled: config.runtime.tracingDisabled,
            workflowName: config.runtime.workflowName,
          // Provider-specific function removed);
          
          const recentMessages = context.recentMessages
            .map(m => `${m.authorName// Provider-specific function removed: ${m.content// Provider-specific function removed`)
            .join('\n\n');
          
          const memoryContext = [
            '## 你的记忆',
            `观察: ${character.memoryState.scratchMemory.observations.join('; ')// Provider-specific function removed`,
            `已知事实: ${character.memoryState.longTermMemory.establishedFacts.join('; ')// Provider-specific function removed`,
          ].join('\n');
          
          const relationshipContext = Array.from(character.memoryState.relationships.entries())
            .map(([id, rel]) => `${id// Provider-specific function removed: ${rel.summary// Provider-specific function removed (好感度: ${rel.score// Provider-specific function removed)`)
            .join('\n');
          
          const prompt = `${SCENE_SETTING// Provider-specific function removed

## 当前场景
${recentMessages || '（场景刚开始）'// Provider-specific function removed

${memoryContext// Provider-specific function removed

## 你与其他人的关系
${relationshipContext || '（暂无特殊关系）'// Provider-specific function removed

## 你的任务
作为${character.name// Provider-specific function removed，根据你的性格和当前场景，决定是否要说话或行动。
如果说话，请直接说出你的台词，不要加引号或其他标记。
如果不说话，请输出【沉默】。

请现在做出反应。直接输出你的台词，不要加任何解释或标记：`;

          const response = await agentRuntime.run(profile, prompt);
          
          const output = typeof response === 'string' ? response : String(response);
          const isSilent = output.includes('【沉默】') || output.trim().length < 3;
          
        ***REMOVED***!isSilent) {
            const cleanOutput = output.replace(/【沉默】/g, '').trim();
            
          ***REMOVED***cleanOutput.length > 0) {
              const newMessage: ChatroomMessage = {
                id: randomUUID(),
                role: 'agent',
                authorId: character.characterId,
                authorName: character.name,
                round,
                createdAt: new Date().toISOString(),
                content: cleanOutput,
              // Provider-specific function removed;
              
              state.messages.push(newMessage);
              character.consecutiveSilentRounds = 0;
              
              console.log(`${character.name// Provider-specific function removed: ${cleanOutput.slice(0, 80)// Provider-specific function removed${cleanOutput.length > 80 ? '...' : ''// Provider-specific function removed`);
            // Provider-specific function removed else {
              character.consecutiveSilentRounds++;
              console.log(`${character.name// Provider-specific function removed: [沉默]`);
            // Provider-specific function removed
          // Provider-specific function removed else {
            character.consecutiveSilentRounds++;
            console.log(`${character.name// Provider-specific function removed: [沉默]`);
          // Provider-specific function removed
          
          character.lastSeenRound = round;
          
        // Provider-specific function removed catch (error) {
          console.error(`${character.name// Provider-specific function removed 执行出错: ${error// Provider-specific function removed`);
          character.consecutiveSilentRounds++;
        // Provider-specific function removed
        
        await new Promise(resolve => setTimeout(resolve, 500));
      // Provider-specific function removed
    // Provider-specific function removed
    
    const dormantResults = checkDormantCharacters({ characters, round // Provider-specific function removed);
    const toActivate = getCharactersToActivate(
      new Map(dormantResults.map(r => [r.characterId, r]))
    );
    
  ***REMOVED***toActivate.length > 0) {
      console.log(`\n激活角色: ${toActivate.join(', ')// Provider-specific function removed`);
      for (const characterId of toActivate) {
        const character = characters.find(c => c.characterId === characterId);
      ***REMOVED***character) {
          character.activityStatus = 'active';
          character.consecutiveSilentRounds = 0;
        // Provider-specific function removed
      // Provider-specific function removed
    // Provider-specific function removed
    
    const roundDuration = Date.now() - roundStartTime;
    console.log(`\n第 ${round// Provider-specific function removed 轮完成，耗时 ${(roundDuration / 1000).toFixed(1)// Provider-specific function removed 秒`);
    
    sequence = createInitialSequence(characters.filter(c => c.activityStatus === 'active'), round + 1);
  // Provider-specific function removed
  
  const totalDuration = Date.now() - startTime;
  
  console.log('\n=== 测试完成 ===');
  console.log(`总轮次: ${totalRounds// Provider-specific function removed`);
  console.log(`总消息数: ${state.messages.length// Provider-specific function removed`);
  console.log(`总耗时: ${(totalDuration / 1000 / 60).toFixed(1)// Provider-specific function removed 分钟`);
  console.log(`平均每轮: ${(totalDuration / totalRounds / 1000).toFixed(1)// Provider-specific function removed 秒`);
  
  console.log('\n=== 角色统计 ===');
  for (const character of characters) {
    const messageCount = state.messages.filter(m => m.authorId === character.characterId).length;
    console.log(`${character.name// Provider-specific function removed: ${messageCount// Provider-specific function removed 条消息, 连续沉默: ${character.consecutiveSilentRounds// Provider-specific function removed 轮`);
  // Provider-specific function removed
  
  console.log('\n=== 完整对话记录 ===');
  for (const message of state.messages) {
  ***REMOVED***message.role !== 'system') {
      console.log(`[${message.round// Provider-specific function removed] ${message.authorName// Provider-specific function removed: ${message.content// Provider-specific function removed`);
    // Provider-specific function removed
  // Provider-specific function removed
// Provider-specific function removed

runTavernTest().catch(console.error);
