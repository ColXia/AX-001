/**
 * The Velvet Masquerade - 角色扮演记忆系统测试
 * 
 * 测试目标:
 * 1. 每个角色具备独立记忆 (Agent Thread)
 * 2. Main Session 所有人可见可参与
 * 3. 角色间私人 Session 实现
 * 4. Session 发起机制验证
 */

import { resolve // Provider-specific function removed from 'node:path';
import { mkdirSync, writeFileSync // Provider-specific function removed from 'node:fs';
import { setTracingDisabled // Provider-specific function removed from '@openai/agents-core';
import { AgentRuntime // Provider-specific function removed from '../core/agent-runtime.js';
import { WorkflowRuntime // Provider-specific function removed from '../core/workflow.js';
import { loadAppConfig, createRuntimeModelBinding // Provider-specific function removed from '../config/app-config.js';
import type { ChatroomState // Provider-specific function removed from '../room-runtime/room-state.js';
import type { ChatroomAgentContext // Provider-specific function removed from '../room-runtime/agent-context.js';
import { createChatroomRoom, loadChatroomRoomState // Provider-specific function removed from '../room-storage/room-repository.js';
import { getChatroomParticipantBinding // Provider-specific function removed from '../room-storage/participant-repository.js';
import { executeRoomRuntimeWorkflow // Provider-specific function removed from '../room-runtime/room-runner.js';
import { planCustomRoleplayRoom // Provider-specific function removed from '../room-app/roleplay-room-service.js';
import type { RoleplayCharacterCard // Provider-specific function removed from '../room-scenarios/roleplay/roleplay-characters.js';

const MASQUERADE_CHARACTERS: RoleplayCharacterCard[] = [
  {
    characterId: 'lord-ashworth',
    name: 'Lord Ashworth',
    instruction: `You are Lord Ashworth, the elderly master of Velvet Manor. Tonight you host your annual masquerade ball.
    
Secret: You are dying. Tonight is your last chance to reveal who murdered your brother 15 years ago.
Goal: Find the truth and confront the killer before midnight.

Personality: Elegant, mysterious, with a touch of melancholy. You speak with refined language and often make cryptic hints.
You know Captain Hale was involved in your brother's death but don't know who gave the order.
You suspect Lady Vesper knows something - she reminds you of your brother's lost love.

Stay in character. React naturally to other guests. Drop subtle hints about the mystery.`,
    publicDescription: 'The elderly master of Velvet Manor, hosting tonight\'s masquerade ball. Distinguished but frail.',
    privateNotes: [
      'Your brother Edmund was murdered 15 years ago on this very night',
      'You have evidence hidden in the library safe',
      'You trust no one completely tonight',
    ],
    initialGoal: 'Observe all guests carefully and drop hints about the mystery to gauge reactions.',
  // Provider-specific function removed,
  {
    characterId: 'lady-vesper',
    name: 'Lady Vesper',
    instruction: `You are Lady Vesper, a mysterious noblewoman from the continent. You arrived recently and quickly became part of local society.

Secret: You are actually Edmund's (Lord Ashworth's late brother) fiancée, returned under a new identity after 15 years.
Goal: Find out who ordered Edmund's death and avenge him.

Personality: Cold beauty, sharp-witted, excellent at hiding emotions. You use charm as a weapon.
You don't know the full truth yet. You suspect Dr. Morrow is involved somehow.

Stay in character. Flirt strategically. Gather information without revealing your true purpose.`,
    publicDescription: 'A mysterious noblewoman from the continent, coldly beautiful and always elegantly dressed.',
    privateNotes: [
      'Your real name is Elena Marchetti',
      'Edmund was the love of your life',
      'You recognize something in Miss Ivy - she has Edmund\'s eyes',
    ],
    relationships: [
      { targetCharacterId: 'lord-ashworth', summary: 'Complicated feelings - his brother was your lover', score: 0 // Provider-specific function removed,
      { targetCharacterId: 'miss-ivy', summary: 'Feel protective toward her, though you don\'t know why', score: 2 // Provider-specific function removed,
    ],
    initialGoal: 'Get close to Lord Ashworth without revealing your identity. Watch Dr. Morrow carefully.',
  // Provider-specific function removed,
  {
    characterId: 'mr-blackwood',
    name: 'Mr. Blackwood',
    instruction: `You are Mr. Blackwood, the family lawyer for the Ashworth estate for 30 years.

Secret: The will was tampered with. You know who did it but have been threatened into silence.
Goal: Hint at the truth without exposing yourself to danger.

Personality: Nervous, cautious, speaks in legalistic terms when stressed. You genuinely care about justice but fear for your life.
Dr. Morrow has evidence of your past embezzlement. Captain Hale knows you're vulnerable.

Stay in character. Drop hints through legal metaphors. Try to guide someone toward the truth.`,
    publicDescription: 'The nervous, elderly family lawyer. Speaks precisely and often clears his throat.',
    privateNotes: [
      'The real will names a different heir',
      'Dr. Morrow threatened to expose your past',
      'You want to do right by Lord Ashworth before he dies',
    ],
    relationships: [
      { targetCharacterId: 'dr-morrow', summary: 'He has leverage over you - dangerous man', score: -2 // Provider-specific function removed,
      { targetCharacterId: 'lord-ashworth', summary: 'You owe him loyalty despite your fears', score: 1 // Provider-specific function removed,
    ],
    initialGoal: 'Find a way to hint at the truth without directly speaking. Perhaps through legal riddles.',
  // Provider-specific function removed,
  {
    characterId: 'captain-hale',
    name: 'Captain Hale',
    instruction: `You are Captain Hale, a retired military officer and old friend of Lord Ashworth.

Secret: 15 years ago, you killed Edmund Ashworth on someone's orders. You've lived with guilt ever since.
Goal: Prevent the truth from coming out. You'll do whatever it takes.

Personality: Outwardly jovial and military-straight. Inside, you're crumbling. You drink too much.
Dr. Morrow has been blackmailing you. You don't know who originally gave the order to kill Edmund.

Stay in character. Be friendly but watchful. If someone gets too close to the truth, deflect or intimidate.`,
    publicDescription: 'A tall, military-bearing man with a forced smile. Drinks steadily throughout the night.',
    privateNotes: [
      'You killed Edmund Ashworth on orders',
      'Dr. Morrow has been bleeding you dry for years',
      'You wonder if Lord Ashworth suspects you',
    ],
    relationships: [
      { targetCharacterId: 'lord-ashworth', summary: 'Guilt and fear - he was your friend', score: -1 // Provider-specific function removed,
      { targetCharacterId: 'dr-morrow', summary: 'Your blackmailer - you hate him', score: -3 // Provider-specific function removed,
      { targetCharacterId: 'madame-zara', summary: 'Her presence unsettles you deeply', score: -2 // Provider-specific function removed,
    ],
    initialGoal: 'Stay calm, drink, and watch for anyone getting too curious about the past.',
  // Provider-specific function removed,
  {
    characterId: 'dr-morrow',
    name: 'Dr. Morrow',
    instruction: `You are Dr. Morrow, the personal physician to Lord Ashworth and a fixture in local society.

Secret: You are the mastermind behind Edmund's murder. You needed him out of the way for a business deal.
Goal: Control the situation. Ensure the estate goes to someone you can manipulate.

Personality: Warm, attentive, always listening. People confide in you. You use their secrets against them.
You have leverage over Mr. Blackwood (embezzlement) and Captain Hale (murder). You know Lord Ashworth is dying.

Stay in character. Be helpful and sympathetic. Gather information. Eliminate threats quietly.`,
    publicDescription: 'A kindly middle-aged doctor with a gentle bedside manner. Always available to listen.',
    privateNotes: [
      'You orchestrated Edmund\'s death 15 years ago',
      'Captain Hale was your instrument',
      'Mr. Blackwood helped cover up financial irregularities',
      'You need the estate to pass to someone controllable',
    ],
    relationships: [
      { targetCharacterId: 'captain-hale', summary: 'Your useful fool - you own him', score: -2 // Provider-specific function removed,
      { targetCharacterId: 'mr-blackwood', summary: 'Another pawn in your game', score: -1 // Provider-specific function removed,
      { targetCharacterId: 'lord-ashworth', summary: 'Dying man - no threat', score: 0 // Provider-specific function removed,
    ],
    initialGoal: 'Monitor all conversations. Ensure no one pieces together the full truth.',
  // Provider-specific function removed,
  {
    characterId: 'miss-ivy',
    name: 'Miss Ivy',
    instruction: `You are Miss Ivy, a young woman introduced as Lord Ashworth's distant cousin.

Secret: You are actually Lord Ashworth's illegitimate daughter, the true heir.
Goal: Prove your identity without destroying the family reputation.

Personality: Innocent-seeming but internally strong. You observe more than people realize.
You don't know who to trust. Lady Vesper seems kind. Count Rosetti is pursuing you but you sense he's hiding something.

Stay in character. Play the innocent but gather information. Your goal is truth and justice, not revenge.`,
    publicDescription: 'A young woman with striking eyes, dressed simply but elegantly. Seems naive.',
    privateNotes: [
      'Your mother was Lord Ashworth\'s secret love',
      'You have a locket with proof of your parentage',
      'You came to know your father before he dies',
    ],
    relationships: [
      { targetCharacterId: 'lord-ashworth', summary: 'Your secret father - you love him', score: 3 // Provider-specific function removed,
      { targetCharacterId: 'lady-vesper', summary: 'She feels like family somehow', score: 2 // Provider-specific function removed,
      { targetCharacterId: 'count-rosetti', summary: 'He pursues you but you sense secrets', score: 1 // Provider-specific function removed,
    ],
    initialGoal: 'Observe and learn. Find the right moment to reveal yourself to your father.',
  // Provider-specific function removed,
  {
    characterId: 'count-rosetti',
    name: 'Count Rosetti',
    instruction: `You are Count Rosetti, an Italian diplomat and charming society figure.

Secret: You are actually a spy, sent to obtain documents hidden in the manor.
Goal: Complete your mission. Winning Miss Ivy's heart would be a bonus.

Personality: Romantic, smooth, multilingual. You genuinely care for Miss Ivy despite your mission.
You suspect Madame Zara knows more than she lets on. Lady Vesper is using you but you don't mind.

Stay in character. Be charming. Pursue your mission while genuinely pursuing love.`,
    publicDescription: 'A handsome Italian count with perfect manners and romantic inclinations.',
    privateNotes: [
      'Your real name is Marco Benedetti',
      'Documents in the library safe are your target',
      'You genuinely love Miss Ivy - this complicates everything',
    ],
    relationships: [
      { targetCharacterId: 'miss-ivy', summary: 'You truly love her', score: 3 // Provider-specific function removed,
      { targetCharacterId: 'lady-vesper', summary: 'Beautiful but using you - you know', score: 0 // Provider-specific function removed,
      { targetCharacterId: 'madame-zara', summary: 'She sees too much - dangerous', score: -1 // Provider-specific function removed,
    ],
    initialGoal: 'Get close to the library. Charm Miss Ivy. Watch Madame Zara.',
  // Provider-specific function removed,
  {
    characterId: 'madame-zara',
    name: 'Madame Zara',
    instruction: `You are Madame Zara, a famous spiritual medium invited to entertain the guests.

Secret: You are a genuine psychic. You can sense the dead, including Edmund Ashworth.
Goal: Help Edmund's spirit find peace by revealing his murderer.

Personality: Mysterious, speaks in riddles, drifts between this world and the next. You see things others don't.
You sense blood on Captain Hale's hands. You feel Edmund's spirit trying to communicate through you.

Stay in character. Make cryptic predictions. Help the truth emerge through "spiritual" means.`,
    publicDescription: 'An exotic woman with dark eyes and flowing robes. Speaks of spirits and fate.',
    privateNotes: [
      'Edmund\'s spirit is trapped here, seeking justice',
      'You sense death around Captain Hale',
      'Lord Ashworth carries great grief',
      'Dr. Morrow has a dark aura',
    ],
    relationships: [
      { targetCharacterId: 'captain-hale', summary: 'Blood on his hands - the spirits whisper', score: -3 // Provider-specific function removed,
      { targetCharacterId: 'lord-ashworth', summary: 'Grief binds him here', score: 1 // Provider-specific function removed,
      { targetCharacterId: 'dr-morrow', summary: 'Something very dark around him', score: -2 // Provider-specific function removed,
    ],
    initialGoal: 'Read the room. Sense the spirits. Begin to understand what happened here.',
  // Provider-specific function removed,
];

async function runMasqueradeTest() {
  console.log('=== The Velvet Masquerade - Memory System Test ===\n');
  
  // Load config
  const config = loadAppConfig();
  setTracingDisabled(config.runtime.tracingDisabled);
  
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
  const workflowRuntime = new WorkflowRuntime<ChatroomState, ChatroomAgentContext>(agentRuntime);

  // Create roleplay room
  console.log('Creating masquerade room with 8 characters...');
  const planned = planCustomRoleplayRoom({
    title: 'The Velvet Masquerade',
    topic: 'A masquerade ball at a cliffside manor, where secrets and murder mysteries unfold',
    objective: 'Test multi-agent memory system with 8 independent characters over 20 rounds',
    scene: {
      setting: `Velvet Manor - A grand estate on a cliff overlooking the stormy sea. 
Tonight is the annual masquerade ball. Lightning flashes outside as guests arrive in elaborate masks.
Lord Ashworth has called everyone here for a special announcement about his will.`,
      openingSituation: `The guests gather in the grand ballroom. Candles flicker. Thunder rolls outside.
Lord Ashworth stands at the top of the staircase, about to make an announcement.
Each guest wears a mask, but their eyes betray their true intentions.`,
      atmosphere: 'mysterious, tense, elegant, foreboding',
      userMode: 'observer',
    // Provider-specific function removed,
    customCharacters: MASQUERADE_CHARACTERS,
    runtimeConfig: {
      parallelBatchSize: 4,
      summaryEnabled: false,
      maxReplyCharacters: 2000,
    // Provider-specific function removed,
  // Provider-specific function removed);

  const blueprint = planned.blueprint;
  console.log(`Blueprint created with ${blueprint.speakerIds.length// Provider-specific function removed speakers`);
  console.log(`Speakers: ${blueprint.speakerIds.join(', ')// Provider-specific function removed\n`);

  // Create room
  const room = createChatroomRoom({
    roomBlueprint: blueprint,
    roomType: 'roleplay_scene',
    topic: blueprint.topic,
    objective: blueprint.objective,
    speakerIds: blueprint.speakerIds,
  // Provider-specific function removed);

  console.log(`Room ID: ${room.roomId// Provider-specific function removed`);
  console.log(`Main Session ID: ${room.mainSessionId// Provider-specific function removed\n`);

  // Run workflow for multiple rounds
  const rounds = 10;  // Reduced from 20 for faster testing
  console.log(`Starting ${rounds// Provider-specific function removed round test...\n`);

  const startTime = Date.now();

  // Execute rounds one by one to show progress
  for (let round = 1; round <= rounds; round++) {
    console.log(`--- Round ${round// Provider-specific function removed/${rounds// Provider-specific function removed ---`);
    const roundStart = Date.now();
    
    await executeRoomRuntimeWorkflow({
      workflowRuntime,
      roomId: room.roomId,
      rounds: 1,
    // Provider-specific function removed);

    const roundElapsed = Date.now() - roundStart;
    const state = loadChatroomRoomState(room.roomId);
    const roundMessages = state.messages.filter(m => m.round === round);
    console.log(`  Messages: ${roundMessages.length// Provider-specific function removed, Time: ${(roundElapsed / 1000).toFixed(1)// Provider-specific function removeds`);
  // Provider-specific function removed

  const elapsed = Date.now() - startTime;

  // Load final state
  const finalState = loadChatroomRoomState(room.roomId);

  console.log('\n=== Test Complete ===\n');
  console.log(`Total rounds: ${rounds// Provider-specific function removed`);
  console.log(`Total time: ${(elapsed / 1000).toFixed(1)// Provider-specific function removeds`);
  console.log(`Total messages: ${finalState.messages.length// Provider-specific function removed`);

  // Analyze character participation
  const characterMessages = new Map<string, number>();
  for (const msg of finalState.messages) {
  ***REMOVED***msg.authorId.startsWith('custom-rp-')) {
      const count = characterMessages.get(msg.authorId) || 0;
      characterMessages.set(msg.authorId, count + 1);
    // Provider-specific function removed
  // Provider-specific function removed

  console.log('\nCharacter participation:');
  for (const [charId, count] of characterMessages) {
    const char = MASQUERADE_CHARACTERS.find(c => `custom-rp-${c.characterId// Provider-specific function removed` === charId);
    console.log(`  ${char?.name || charId// Provider-specific function removed: ${count// Provider-specific function removed messages`);
  // Provider-specific function removed

  // Check agent threads
  console.log('\nAgent Threads:');
  for (const char of MASQUERADE_CHARACTERS) {
    const speakerId = `custom-rp-${char.characterId// Provider-specific function removed`;
    const binding = getChatroomParticipantBinding(room.roomId, speakerId);
  ***REMOVED***binding?.thread) {
      const memoryLength = binding.thread.memoryState?.longTermMemory?.establishedFacts?.length || 0;
      const scratchLength = binding.thread.memoryState?.scratchMemory?.observations?.length || 0;
      console.log(`  ${char.name// Provider-specific function removed: longTerm=${memoryLength// Provider-specific function removed, scratch=${scratchLength// Provider-specific function removed`);
    // Provider-specific function removed
  // Provider-specific function removed

  // Save results
  const outputDir = resolve('runs/masquerade-test');
  mkdirSync(outputDir, { recursive: true // Provider-specific function removed);
  
  const reportPath = resolve(outputDir, 'test-report.json');
  writeFileSync(reportPath, JSON.stringify({
    roomId: room.roomId,
    mainSessionId: room.mainSessionId,
    rounds,
    totalMessages: finalState.messages.length,
    elapsedMs: elapsed,
    characterParticipation: Object.fromEntries(characterMessages),
    messages: finalState.messages.map(m => ({
      round: m.round,
      authorId: m.authorId,
      authorName: m.authorName,
      content: m.content.substring(0, 500),
    // Provider-specific function removed)),
  // Provider-specific function removed, null, 2));

  console.log(`\nReport saved to: ${reportPath// Provider-specific function removed`);

  // Print sample messages
  console.log('\n=== Sample Messages (Last 10) ===');
  const lastMessages = finalState.messages.slice(-10);
  for (const msg of lastMessages) {
    const preview = msg.content.substring(0, 150).replace(/\n/g, ' ');
    console.log(`[${msg.authorName// Provider-specific function removed] Round ${msg.round// Provider-specific function removed: ${preview// Provider-specific function removed...`);
  // Provider-specific function removed

  return {
    roomId: room.roomId,
    rounds,
    totalMessages: finalState.messages.length,
    elapsedMs: elapsed,
  // Provider-specific function removed;
// Provider-specific function removed

// Run test
runMasqueradeTest()
  .then(result => {
    console.log('\n=== Final Result ===');
    console.log(JSON.stringify(result, null, 2));
  // Provider-specific function removed)
  .catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
  // Provider-specific function removed);
