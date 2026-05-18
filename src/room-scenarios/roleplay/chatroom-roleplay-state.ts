import type { ChatroomMessage // Provider-specific function removed from '../../room-core/message-types.js';
import {
  normalizeRoleplayCharacterCards,
  resolveCustomRoleplaySpeakerId,
  selectCustomRoleplaySpeakerIds,
  type RoleplayCharacterCard,
// Provider-specific function removed from './roleplay-characters.js';

export interface RoleplayRelationshipState {
  targetSpeakerId: string;
  targetName: string;
  score: number;
  summary: string;
// Provider-specific function removed

export interface RoleplayCharacterState {
  speakerId: string;
  displayName: string;
  archetype: string;
  publicStatus: string;
  currentGoal: string;
  privateNotes: string[];
  relationships: RoleplayRelationshipState[];
// Provider-specific function removed

export interface RoleplaySceneState {
  locationLabel: string;
  atmosphere: string;
  currentBeat: string;
  latestEvent: string;
  latestUserIntent?: string;
  activeThreads: string[];
  cast: RoleplayCharacterState[];
// Provider-specific function removed

export interface RoleplaySpeakerRuntimeContext {
  publicStatus: string;
  currentGoal: string;
  privateNotes: string[];
  relationships: string[];
// Provider-specific function removed

export interface RoleplayCharacterTemplate {
  speakerId: string;
  displayName: string;
  archetype: string;
  publicStatus: string;
  currentGoal: string;
  privateNotes: string[];
  relationships: Array<{
    targetSpeakerId: string;
    summary: string;
    score: number;
  // Provider-specific function removed>;
// Provider-specific function removed

const relationshipMin = -3;
const relationshipMax = 3;
const maxPrivateNotes = 6;
const maxActiveThreads = 6;

const roleplayTemplates = new Map<string, RoleplayCharacterTemplate>([
  [
    'scene-host-rp',
    {
      speakerId: 'scene-host-rp',
      displayName: '场景主持',
      archetype: '环境推动者',
      publicStatus: '观察全场',
      currentGoal: '用环境与事件推动局面前进',
      privateNotes: ['注意控制节奏，不要夺走其他角色的戏份。'],
      relationships: [],
    // Provider-specific function removed,
  ],
  [
    'lin-lan-rp',
    {
      speakerId: 'lin-lan-rp',
      displayName: '林岚',
      archetype: '冷静带头人',
      publicStatus: '平静戒备',
      currentGoal: '先确认陌生人的来意，再决定是否介入',
      privateNotes: ['你习惯先护住局面，再问问题。'],
      relationships: [
        { targetSpeakerId: 'shen-yan-rp', summary: '信得过他的判断，但不喜欢他话里带刺。', score: 2 // Provider-specific function removed,
        { targetSpeakerId: 'a-jiu-rp', summary: '觉得他嘴碎，却承认他消息灵。', score: 1 // Provider-specific function removed,
        { targetSpeakerId: 'xu-tang-rp', summary: '会下意识照看她的情绪。', score: 2 // Provider-specific function removed,
      ],
    // Provider-specific function removed,
  ],
  [
    'shen-yan-rp',
    {
      speakerId: 'shen-yan-rp',
      displayName: '沈砚',
      archetype: '谨慎策士',
      publicStatus: '冷静审视',
      currentGoal: '确认信件与自己是否有关，并避免先暴露底牌',
      privateNotes: ['你最先盯的是漏洞、动机和代价。'],
      relationships: [
        { targetSpeakerId: 'lin-lan-rp', summary: '尊重她的判断，也知道她会替别人扛事。', score: 2 // Provider-specific function removed,
        { targetSpeakerId: 'a-jiu-rp', summary: '对他的轻佻半信半疑，但会听他消息。', score: 0 // Provider-specific function removed,
        { targetSpeakerId: 'xu-tang-rp', summary: '知道她看得出人心，所以很少在她面前说满话。', score: 1 // Provider-specific function removed,
      ],
    // Provider-specific function removed,
  ],
  [
    'a-jiu-rp',
    {
      speakerId: 'a-jiu-rp',
      displayName: '阿九',
      archetype: '机灵情报贩子',
      publicStatus: '看热闹但没走神',
      currentGoal: '先探口风，看这封信能换来什么情报',
      privateNotes: ['你习惯先把气氛盘活，再从缝里捞信息。'],
      relationships: [
        { targetSpeakerId: 'lin-lan-rp', summary: '怕她真翻脸，但也最爱拿她开半句玩笑。', score: 1 // Provider-specific function removed,
        { targetSpeakerId: 'shen-yan-rp', summary: '知道他难糊弄，所以总绕着试。', score: 0 // Provider-specific function removed,
        { targetSpeakerId: 'xu-tang-rp', summary: '嘴上爱逗她，真出事时会护着。', score: 2 // Provider-specific function removed,
      ],
    // Provider-specific function removed,
  ],
  [
    'xu-tang-rp',
    {
      speakerId: 'xu-tang-rp',
      displayName: '许棠',
      archetype: '敏感观察者',
      publicStatus: '安静留意',
      currentGoal: '弄清楚谁在紧张、谁在说谎，再决定站哪边',
      privateNotes: ['你最先感受到的是气氛变化，不是字面信息。'],
      relationships: [
        { targetSpeakerId: 'lin-lan-rp', summary: '对她有明显依赖，也信她会护住场面。', score: 2 // Provider-specific function removed,
        { targetSpeakerId: 'shen-yan-rp', summary: '知道他话少但心细，所以会认真听他每一句。', score: 1 // Provider-specific function removed,
        { targetSpeakerId: 'a-jiu-rp', summary: '嫌他聒噪，却也知道他会在关键时候接住人。', score: 1 // Provider-specific function removed,
      ],
    // Provider-specific function removed,
  ],
]);

export function createCustomRoleplayTemplates(
  characters: RoleplayCharacterCard[],
): Map<string, RoleplayCharacterTemplate> {
  const templates = new Map<string, RoleplayCharacterTemplate>();

  templates.set('scene-host-rp', roleplayTemplates.get('scene-host-rp')!);

  const normalizedCharacters = normalizeRoleplayCharacterCards(characters);
  const speakerIds = selectCustomRoleplaySpeakerIds(normalizedCharacters);
  for (const [index, character] of normalizedCharacters.entries()) {
    const speakerId = speakerIds[index + 1] ?? resolveCustomRoleplaySpeakerId(character, index);
    templates.set(speakerId, {
      speakerId,
      displayName: character.name,
      archetype: buildCustomCharacterArchetype(character),
      publicStatus: '在场观察',
      currentGoal: '根据角色设定行动',
      ...(character.publicDescription
        ? { publicStatus: buildCustomCharacterPublicStatus(character) // Provider-specific function removed
        : {// Provider-specific function removed),
      ...(character.initialGoal ? { currentGoal: character.initialGoal // Provider-specific function removed : {// Provider-specific function removed),
      privateNotes: buildCustomCharacterPrivateNotes(character),
      relationships: buildCustomCharacterRelationships({
        character,
        characterIndex: index,
        characters: normalizedCharacters,
        speakerIds,
      // Provider-specific function removed),
    // Provider-specific function removed);
  // Provider-specific function removed

  const customEntries = [...templates.entries()].filter(([id]) => id !== 'scene-host-rp');
  for (const [id, template] of customEntries) {
    const existingTargets = new Set(template.relationships.map((item) => item.targetSpeakerId));
    for (const [otherId] of customEntries) {
    ***REMOVED***id === otherId || existingTargets.has(otherId)) continue;
      template.relationships.push({
        targetSpeakerId: otherId,
        summary: '尚未建立明确关系',
        score: 0,
      // Provider-specific function removed);
    // Provider-specific function removed
  // Provider-specific function removed

  return templates;
// Provider-specific function removed

function buildCustomCharacterArchetype(character: RoleplayCharacterCard): string {
  return truncateLine(character.publicDescription ?? character.instruction, 48) || character.name;
// Provider-specific function removed

function buildCustomCharacterPublicStatus(character: RoleplayCharacterCard): string {
  return truncateLine(character.publicDescription ?? 'In scene and observing', 64);
// Provider-specific function removed

function buildCustomCharacterPrivateNotes(character: RoleplayCharacterCard): string[] {
  const notes = compactUnique([
    character.instruction,
    ...(character.publicDescription ? [`Public: ${character.publicDescription// Provider-specific function removed`] : []),
    ...(character.privateNotes ?? []),
  ]);

  return (notes.length > 0 ? notes : ['Stay in character and react to the live scene.']).slice(
    -maxPrivateNotes,
  );
// Provider-specific function removed

function buildCustomCharacterRelationships(args: {
  character: RoleplayCharacterCard;
  characterIndex: number;
  characters: readonly RoleplayCharacterCard[];
  speakerIds: readonly string[];
// Provider-specific function removed): RoleplayCharacterTemplate['relationships'] {
  const relationships: RoleplayCharacterTemplate['relationships'] = [];
  const seenTargets = new Set<string>();
  const characterIndexById = new Map<string, number>();
  const characterIndexByName = new Map<string, number>();

  for (const [index, character] of args.characters.entries()) {
  ***REMOVED***character.characterId) {
      characterIndexById.set(character.characterId, index);
    // Provider-specific function removed
    characterIndexByName.set(character.name.trim().toLowerCase(), index);
  // Provider-specific function removed

  for (const relationship of args.character.relationships ?? []) {
    const targetIndex =
      (relationship.targetCharacterId
        ? characterIndexById.get(relationship.targetCharacterId)
        : undefined) ??
      (relationship.targetName
        ? characterIndexByName.get(relationship.targetName.trim().toLowerCase())
        : undefined);
  ***REMOVED***targetIndex === undefined || targetIndex === args.characterIndex) {
      continue;
    // Provider-specific function removed

    const targetSpeakerId = args.speakerIds[targetIndex + 1];
  ***REMOVED***!targetSpeakerId || seenTargets.has(targetSpeakerId)) {
      continue;
    // Provider-specific function removed

    seenTargets.add(targetSpeakerId);
    relationships.push({
      targetSpeakerId,
      summary: relationship.summary,
      score: clamp(relationship.score ?? 0, relationshipMin, relationshipMax),
    // Provider-specific function removed);
  // Provider-specific function removed

  return relationships;
// Provider-specific function removed

export function createInitialRoleplaySceneState(args: {
  topic: string;
  objective: string;
  speakerIds: readonly string[];
  constraints: readonly string[];
  customTemplates?: Map<string, RoleplayCharacterTemplate>;
// Provider-specific function removed): RoleplaySceneState {
  const cast = args.speakerIds.map((speakerId) => createCharacterState(speakerId, args.customTemplates));

  return {
    locationLabel: args.topic,
    atmosphere: inferInitialAtmosphere(args.topic, args.objective),
    currentBeat: truncateLine(args.objective, 120),
    latestEvent: truncateLine(args.objective, 120),
    activeThreads: compactUnique([
      truncateLine(args.objective, 72),
      ...args.constraints.map((item) => truncateLine(item, 48)),
    ]).slice(0, maxActiveThreads),
    cast,
  // Provider-specific function removed;
// Provider-specific function removed

export function rebuildRoleplaySceneState(args: {
  topic: string;
  objective: string;
  speakerIds: readonly string[];
  constraints: readonly string[];
  messages: readonly ChatroomMessage[];
  customTemplates?: Map<string, RoleplayCharacterTemplate>;
// Provider-specific function removed): RoleplaySceneState {
  let scene = createInitialRoleplaySceneState({
    topic: args.topic,
    objective: args.objective,
    speakerIds: args.speakerIds,
    constraints: args.constraints,
    customTemplates: args.customTemplates,
  // Provider-specific function removed);

  for (const message of args.messages) {
    scene = updateRoleplaySceneState(scene, message) ?? scene;
  // Provider-specific function removed

  return scene;
// Provider-specific function removed

export function restoreRoleplaySceneState(input: unknown): RoleplaySceneState | undefined {
***REMOVED***!isRecord(input)) {
    return undefined;
  // Provider-specific function removed

  const locationLabel = asTrimmedString(input.locationLabel);
  const atmosphere = asTrimmedString(input.atmosphere);
  const currentBeat = asTrimmedString(input.currentBeat);
  const latestEvent = asTrimmedString(input.latestEvent);
  const activeThreads = asStringArray(input.activeThreads);
  const castInput = Array.isArray(input.cast) ? input.cast : [];
  const cast = castInput
    .map((item) => restoreCharacterState(item))
    .filter((item): item is RoleplayCharacterState => Boolean(item));

***REMOVED***!locationLabel || !atmosphere || !currentBeat || !latestEvent || cast.length === 0) {
    return undefined;
  // Provider-specific function removed

  return {
    locationLabel,
    atmosphere,
    currentBeat,
    latestEvent,
    latestUserIntent: asTrimmedString(input.latestUserIntent) ?? undefined,
    activeThreads: activeThreads.slice(0, maxActiveThreads),
    cast,
  // Provider-specific function removed;
// Provider-specific function removed

export function updateRoleplaySceneState(
  scene: RoleplaySceneState | undefined,
  message: Readonly<ChatroomMessage>,
): RoleplaySceneState | undefined {
***REMOVED***!scene) {
    return undefined;
  // Provider-specific function removed

***REMOVED***message.role === 'system' || message.round === 0) {
    return cloneScene(scene);
  // Provider-specific function removed

  const next = cloneScene(scene);
  const excerpt = extractMessageExcerpt(message.content, 120);
  next.latestEvent = excerpt;
  next.currentBeat = buildSceneBeat(message, excerpt);

***REMOVED***message.role === 'user') {
    next.latestUserIntent = excerpt;
    next.activeThreads = compactUnique([excerpt, ...next.activeThreads]).slice(0, maxActiveThreads);
    next.atmosphere = inferAtmosphereShift(message.content, next.atmosphere);
    return next;
  // Provider-specific function removed

***REMOVED***message.role !== 'agent') {
    return next;
  // Provider-specific function removed

  const speaker = next.cast.find((item) => item.speakerId === message.authorId);
***REMOVED***!speaker) {
    return next;
  // Provider-specific function removed

  speaker.publicStatus = inferPublicStatus(message.content, speaker.publicStatus);
  speaker.privateNotes = appendCappedNote(
    speaker.privateNotes,
    `R${message.round// Provider-specific function removed: ${extractMessageExcerpt(message.content, 96)// Provider-specific function removed`,
  );

  const relationshipDelta = inferRelationshipDelta(message.content);
  const mentionedTargets: string[] = [];
  const shiftedTargets: string[] = [];
  for (const relation of speaker.relationships) {
  ***REMOVED***!message.content.includes(relation.targetName)) {
      continue;
    // Provider-specific function removed

    mentionedTargets.push(relation.targetName);
  ***REMOVED***relationshipDelta === 0) {
      continue;
    // Provider-specific function removed

    relation.score = clamp(relation.score + relationshipDelta, relationshipMin, relationshipMax);
    relation.summary = summarizeRelationshipShift(relation.summary, relation.score);
    shiftedTargets.push(relation.targetName);
  // Provider-specific function removed

  speaker.currentGoal = inferCurrentGoal({
    speaker,
    scene: next,
    content: message.content,
    excerpt,
    relationshipDelta,
    shiftedTargets: shiftedTargets.length > 0 ? shiftedTargets : mentionedTargets,
  // Provider-specific function removed);
  next.atmosphere = inferAtmosphereShift(message.content, next.atmosphere);
  return next;
// Provider-specific function removed

export function getRoleplaySpeakerRuntimeContext(
  scene: RoleplaySceneState | undefined,
  speakerId: string,
): RoleplaySpeakerRuntimeContext | undefined {
***REMOVED***!scene) {
    return undefined;
  // Provider-specific function removed

  const speaker = scene.cast.find((item) => item.speakerId === speakerId);
***REMOVED***!speaker) {
    return undefined;
  // Provider-specific function removed

  return {
    publicStatus: speaker.publicStatus,
    currentGoal: speaker.currentGoal,
    privateNotes: speaker.privateNotes.slice(-4),
    relationships: speaker.relationships
      .map((item) => `${item.targetName// Provider-specific function removed(${formatRelationshipScore(item.score)// Provider-specific function removed): ${item.summary// Provider-specific function removed`)
      .slice(0, 6),
  // Provider-specific function removed;
// Provider-specific function removed

function createCharacterState(
  speakerId: string,
  customTemplates?: Map<string, RoleplayCharacterTemplate>,
): RoleplayCharacterState {
  const template = customTemplates?.get(speakerId) ?? roleplayTemplates.get(speakerId);
***REMOVED***!template) {
    return {
      speakerId,
      displayName: speakerId,
      archetype: '场景参与者',
      publicStatus: '在场观察',
      currentGoal: '先观察，再决定要不要插话',
      privateNotes: [],
      relationships: [],
    // Provider-specific function removed;
  // Provider-specific function removed

  return {
    speakerId: template.speakerId,
    displayName: template.displayName,
    archetype: template.archetype,
    publicStatus: template.publicStatus,
    currentGoal: template.currentGoal,
    privateNotes: [...template.privateNotes],
    relationships: template.relationships.map((item) => ({
      targetSpeakerId: item.targetSpeakerId,
      targetName: customTemplates?.get(item.targetSpeakerId)?.displayName ?? roleplayTemplates.get(item.targetSpeakerId)?.displayName ?? item.targetSpeakerId,
      score: clamp(item.score, relationshipMin, relationshipMax),
      summary: item.summary,
    // Provider-specific function removed)),
  // Provider-specific function removed;
// Provider-specific function removed

function restoreCharacterState(input: unknown): RoleplayCharacterState | undefined {
***REMOVED***!isRecord(input)) {
    return undefined;
  // Provider-specific function removed

  const speakerId = asTrimmedString(input.speakerId);
  const displayName = asTrimmedString(input.displayName);
  const archetype = asTrimmedString(input.archetype);
  const publicStatus = asTrimmedString(input.publicStatus);
  const currentGoal = asTrimmedString(input.currentGoal);
  const privateNotes = asStringArray(input.privateNotes).slice(-maxPrivateNotes);
  const relationshipsInput = Array.isArray(input.relationships) ? input.relationships : [];
  const relationships = relationshipsInput
    .map((item) => restoreRelationship(item))
    .filter((item): item is RoleplayRelationshipState => Boolean(item));

***REMOVED***!speakerId || !displayName || !archetype || !publicStatus || !currentGoal) {
    return undefined;
  // Provider-specific function removed

  return {
    speakerId,
    displayName,
    archetype,
    publicStatus,
    currentGoal,
    privateNotes,
    relationships,
  // Provider-specific function removed;
// Provider-specific function removed

function restoreRelationship(input: unknown): RoleplayRelationshipState | undefined {
***REMOVED***!isRecord(input)) {
    return undefined;
  // Provider-specific function removed

  const targetSpeakerId = asTrimmedString(input.targetSpeakerId);
  const targetName = asTrimmedString(input.targetName);
  const summary = asTrimmedString(input.summary);
  const score = typeof input.score === 'number' ? clamp(Math.round(input.score), relationshipMin, relationshipMax) : undefined;

***REMOVED***!targetSpeakerId || !targetName || !summary || score === undefined) {
    return undefined;
  // Provider-specific function removed

  return {
    targetSpeakerId,
    targetName,
    summary,
    score,
  // Provider-specific function removed;
// Provider-specific function removed

function buildSceneBeat(message: Readonly<ChatroomMessage>, excerpt: string): string {
***REMOVED***message.role === 'user') {
    return `用户插话：${excerpt// Provider-specific function removed`;
  // Provider-specific function removed

  return `${message.authorName// Provider-specific function removed推动了场景：${excerpt// Provider-specific function removed`;
// Provider-specific function removed

function inferInitialAtmosphere(topic: string, objective: string): string {
  const source = `${topic// Provider-specific function removed ${objective// Provider-specific function removed`;
***REMOVED***/(雨夜|深夜|旧信|陌生|追|逃|血|风|风暴|危险|警报|损毁|紧急|窒息|死亡|暗物质|太空|飞船|殖民)/.test(source)) {
    return '紧绷、压抑、危机四伏';
  // Provider-specific function removed

***REMOVED***/(雨|夜|冷|暗|雾|潮)/.test(source)) {
    return '潮湿、紧绷、带着试探';
  // Provider-specific function removed

  return '有人在观察，有人在等事情先开口';
// Provider-specific function removed

function inferPublicStatus(content: string, fallback: string): string {
***REMOVED***containsAny(content, ['笑', '眨', '打趣', '挑眉', '勾了勾', '嘴角'])) {
    return '带点玩味';
  // Provider-specific function removed
***REMOVED***containsAny(content, ['盯', '审视', '打量', '沉默', '停住', '皱眉', '凝视', '扫过'])) {
    return '戒备观察';
  // Provider-specific function removed
***REMOVED***containsAny(content, ['递', '请', '先坐', '毛巾', '靠近', '走过去', '伸手', '拉住'])) {
    return '主动接触';
  // Provider-specific function removed
***REMOVED***containsAny(content, ['压低声音', '放下', '收回', '不动声色', '攥紧', '咬', '忍'])) {
    return '压着情绪';
  // Provider-specific function removed
***REMOVED***containsAny(content, ['跑', '冲', '撞', '砸', '爆炸', '断裂', '警报', '震'])) {
    return '紧急行动';
  // Provider-specific function removed
***REMOVED***containsAny(content, ['告白', '喜欢', '爱', '抱', '吻', '牵手'])) {
    return '情感外露';
  // Provider-specific function removed

  return fallback;
// Provider-specific function removed

function inferAtmosphereShift(content: string, fallback: string): string {
***REMOVED***containsAny(content, ['闪电', '雷', '风雨', '冷', '震', '断裂', '爆炸', '坍缩', '警报', '黑暗'])) {
    return '空气骤然紧绷，危险正在逼近';
  // Provider-specific function removed
***REMOVED***containsAny(content, ['笑', '玩笑', '打赌', '轻松', '逗'])) {
    return '紧张里掺进了一点故作轻松的试探';
  // Provider-specific function removed
***REMOVED***containsAny(content, ['认得', '名字', '是谁', '秘密', '真相', '发现', '揭露'])) {
    return '某个被隐藏的东西浮出了水面';
  // Provider-specific function removed
***REMOVED***containsAny(content, ['告白', '喜欢', '爱', '心', '抱', '吻'])) {
    return '情感冲破了理智的防线';
  // Provider-specific function removed
***REMOVED***containsAny(content, ['背叛', '暗杀', '任务', '杀', '毒', '陷阱'])) {
    return '信任的裂缝正在扩大';
  // Provider-specific function removed

  return fallback;
// Provider-specific function removed

function inferRelationshipDelta(content: string): number {
  const positive = countMatches(content, ['递', '护', '帮', '信', '安抚', '先坐', '给你', '别急', '救', '拉住', '抱', '喜欢', '爱', '牵手', '靠近', '保护', '守护']);
  const negative = countMatches(content, ['质问', '怀疑', '盯', '逼问', '夺回', '冷笑', '威胁', '暗杀', '杀', '毒', '背叛', '欺骗', '推开', '逃', '躲']);

***REMOVED***positive === negative) {
    return 0;
  // Provider-specific function removed

  return positive > negative ? 1 : -1;
// Provider-specific function removed

function inferCurrentGoal(args: {
  speaker: RoleplayCharacterState;
  scene: RoleplaySceneState;
  content: string;
  excerpt: string;
  relationshipDelta: number;
  shiftedTargets: readonly string[];
// Provider-specific function removed): string {
  const explicitGoal = extractExplicitGoal(args.content);
***REMOVED***explicitGoal && !isSameGoal(explicitGoal, args.speaker.currentGoal)) {
    return explicitGoal;
  // Provider-specific function removed

  const relationshipGoal = inferRelationshipGoal(
    args.content,
    args.shiftedTargets,
    args.relationshipDelta,
  );
***REMOVED***relationshipGoal && !isSameGoal(relationshipGoal, args.speaker.currentGoal)) {
    return relationshipGoal;
  // Provider-specific function removed

***REMOVED***containsAny(args.content, ['确认', '查清', '弄清', '试探', '探口风', '真假', '底细', 'verify', 'confirm'])) {
    const subject = extractGoalSubject(args.scene.latestUserIntent ?? args.scene.activeThreads[0] ?? args.excerpt);
    const goal = subject ? truncateLine(`先确认${subject// Provider-specific function removed`, 28) : '先确认眼前线索是真是假';
    return isSameGoal(goal, args.speaker.currentGoal) ? args.speaker.currentGoal : goal;
  // Provider-specific function removed

***REMOVED***containsAny(args.content, ['真相', '秘密', '暴露', '露馅', '揭穿', '失控', '警报', '危险', '陷阱', 'truth', 'secret', 'alarm'])) {
    const goal = '先压住局面，别让真相提前失控';
    return isSameGoal(goal, args.speaker.currentGoal) ? args.speaker.currentGoal : goal;
  // Provider-specific function removed

***REMOVED***containsAny(args.content, ['护住', '保护', '掩护', '联手', '站我这边', '同路', 'protect', 'ally', 'trust'])) {
    const goal = '先稳住场面，确认谁愿意暂时同路';
    return isSameGoal(goal, args.speaker.currentGoal) ? args.speaker.currentGoal : goal;
  // Provider-specific function removed

  return args.speaker.currentGoal;
// Provider-specific function removed

function extractExplicitGoal(content: string): string | undefined {
  const excerpt = extractMessageExcerpt(content, 80);
  const patterns: Array<{ pattern: RegExp; prefix?: string // Provider-specific function removed> = [
    { pattern: /(?:我得先|我要先|得先|必须先|先)([^，。！？；,:]{2,28// Provider-specific function removed)/, prefix: '先' // Provider-specific function removed,
    { pattern: /(?:别让|不要让)([^，。！？；,:]{2,28// Provider-specific function removed)/, prefix: '别让' // Provider-specific function removed,
    { pattern: /(?:别|不要)([^，。！？；,:]{2,24// Provider-specific function removed)/, prefix: '别' // Provider-specific function removed,
  ];

  for (const { pattern, prefix // Provider-specific function removed of patterns) {
    const match = excerpt.match(pattern);
  ***REMOVED***!match?.[1]) {
      continue;
    // Provider-specific function removed

    const candidate = truncateLine(normalizeGoalClause(`${prefix ?? ''// Provider-specific function removed${match[1]// Provider-specific function removed`), 28);
  ***REMOVED***candidate && looksLikeGoal(candidate)) {
      return candidate;
    // Provider-specific function removed
  // Provider-specific function removed

  return undefined;
// Provider-specific function removed

function inferRelationshipGoal(
  content: string,
  shiftedTargets: readonly string[],
  relationshipDelta: number,
): string | undefined {
  const target = shiftedTargets[0];
***REMOVED***!target) {
    return undefined;
  // Provider-specific function removed

  const effectiveDelta =
    relationshipDelta !== 0
      ? relationshipDelta
      : containsAny(content, ['逼问', '怀疑', '审视', '盯', '冷笑', '威胁', 'question', 'suspect', 'threat'])
        ? -1
        : containsAny(content, ['护住', '帮', '掩护', '联手', '站我这边', '拉住', 'protect', 'ally', 'trust'])
          ? 1
          : 0;

***REMOVED***effectiveDelta === 0) {
    return undefined;
  // Provider-specific function removed

***REMOVED***
    effectiveDelta < 0 &&
    containsAny(content, ['逼问', '怀疑', '审视', '盯', '冷笑', '威胁', 'question', 'suspect', 'threat'])
***REMOVED***
    return truncateLine(`防着${target// Provider-specific function removed，别让对方继续逼近底牌`, 28);
  // Provider-specific function removed

***REMOVED***
    effectiveDelta > 0 &&
    containsAny(content, ['护住', '帮', '掩护', '联手', '站我这边', '拉住', 'protect', 'ally', 'trust'])
***REMOVED***
    return truncateLine(`稳住${target// Provider-specific function removed，看看能不能把对方拉到自己这边`, 28);
  // Provider-specific function removed

  return undefined;
// Provider-specific function removed

function summarizeRelationshipShift(summary: string, score: number): string {
  const suffix =
    score >= 2
      ? '此刻更愿意信任对方。'
      : score <= -2
        ? '此刻明显更提防对方。'
        : '此刻保持试探，不轻易摊牌。';

  return `${trimTrailingPunctuation(summary)// Provider-specific function removed ${suffix// Provider-specific function removed`.trim();
// Provider-specific function removed

function formatRelationshipScore(score: number): string {
  return score >= 2 ? '亲近' : score <= -2 ? '紧张' : score >= 1 ? '偏暖' : score <= -1 ? '偏冷' : '试探';
// Provider-specific function removed

function appendCappedNote(notes: readonly string[], nextNote: string): string[] {
  const trimmed = nextNote.trim();
***REMOVED***!trimmed) {
  ***REMOVED***...notes];
  // Provider-specific function removed

  const next = notes.filter((item) => item !== trimmed);
  next.push(trimmed);
  return next.slice(-maxPrivateNotes);
// Provider-specific function removed

function cloneScene(scene: RoleplaySceneState): RoleplaySceneState {
  return {
    locationLabel: scene.locationLabel,
    atmosphere: scene.atmosphere,
    currentBeat: scene.currentBeat,
    latestEvent: scene.latestEvent,
    latestUserIntent: scene.latestUserIntent,
    activeThreads: [...scene.activeThreads],
    cast: scene.cast.map((speaker) => ({
      speakerId: speaker.speakerId,
      displayName: speaker.displayName,
      archetype: speaker.archetype,
      publicStatus: speaker.publicStatus,
      currentGoal: speaker.currentGoal,
      privateNotes: [...speaker.privateNotes],
      relationships: speaker.relationships.map((item) => ({ ...item // Provider-specific function removed)),
    // Provider-specific function removed)),
  // Provider-specific function removed;
// Provider-specific function removed

function extractMessageExcerpt(content: string, maxLength: number): string {
  return truncateLine(
    content
      .replace(/\*\*/g, '')
      .replace(/[*_`>#-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim(),
    maxLength,
  );
// Provider-specific function removed

function truncateLine(value: string, maxLength: number): string {
  const trimmed = value.trim();
***REMOVED***trimmed.length <= maxLength) {
    return trimmed;
  // Provider-specific function removed

  return `${trimmed.slice(0, Math.max(0, maxLength - 1)).trimEnd()// Provider-specific function removed…`;
// Provider-specific function removed

function compactUnique(values: readonly string[]): string[] {
***REMOVED***...new Set(values.map((item) => item.trim()).filter(Boolean))];
// Provider-specific function removed

function normalizeGoalClause(value: string): string {
  return trimTrailingPunctuation(
    value
      .replace(/^(?:我|我们|现在|此刻|眼下|接下来|只是|只能)+/u, '')
      .replace(/\s+/g, ' ')
      .trim(),
  );
// Provider-specific function removed

function looksLikeGoal(value: string***REMOVED***
  return containsAny(value, [
    '确认',
    '查清',
    '弄清',
    '试探',
    '探口风',
    '稳住',
    '护住',
    '拉住',
    '盯住',
    '压住',
    '拖住',
    '避开',
    '离开',
    '脱身',
    '逼出',
    '判断',
    '守住',
    '别让',
    'protect',
    'verify',
    'confirm',
    'ally',
  ]);
// Provider-specific function removed

function extractGoalSubject(value: string): string | undefined {
  const excerpt = trimTrailingPunctuation(extractMessageExcerpt(value, 18));
  return excerpt || undefined;
// Provider-specific function removed

function containsAny(content: string, keywords: readonly string[]***REMOVED***
  return keywords.some((keyword) => content.includes(keyword));
// Provider-specific function removed

function countMatches(content: string, keywords: readonly string[]): number {
  return keywords.reduce((count, keyword) => count + (content.includes(keyword) ? 1 : 0), 0);
// Provider-specific function removed

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
// Provider-specific function removed

function trimTrailingPunctuation(value: string): string {
  return value.replace(/[。！!？?，,；;：:\s]+$/g, '');
// Provider-specific function removed

function isSameGoal(left: string, right: string***REMOVED***
  return normalizeComparableText(left) === normalizeComparableText(right);
// Provider-specific function removed

function normalizeComparableText(value: string): string {
  return value.replace(/[\s，。！？；,.:：]/g, '').trim().toLowerCase();
// Provider-specific function removed

function asTrimmedString(value: unknown): string | undefined {
***REMOVED***typeof value !== 'string') {
    return undefined;
  // Provider-specific function removed

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
// Provider-specific function removed

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.map((item) => (typeof item === 'string' ? item.trim() : '')).filter(Boolean)
    : [];
// Provider-specific function removed

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
// Provider-specific function removed
