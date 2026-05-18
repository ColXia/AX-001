import { describe, it // Provider-specific function removed from 'node:test';
import assert from 'node:assert';
import {
  processPrivateMessagesInOutput,
  addPrivateMessagesToState,
  getIncomingPrivateMessages,
  markPrivateMessagesAsRead,
// Provider-specific function removed from './private-session-manager.js';
import type { ChatroomState // Provider-specific function removed from './room-state.js';
import type { RoleplayCharacterCard // Provider-specific function removed from '../room-scenarios/roleplay/roleplay-characters.js';

describe('processPrivateMessagesInOutput', () => {
  const customCharacters: RoleplayCharacterCard[] = [
    {
      characterId: 'innkeeper',
      name: 'Mara',
      instruction: 'You are Mara the innkeeper.',
    // Provider-specific function removed,
    {
      characterId: 'guard',
      name: 'Captain John',
      instruction: 'You are Captain John the guard.',
    // Provider-specific function removed,
  ];

  const state: ChatroomState = {
    roomType: 'roleplay_scene',
    topic: 'Tavern scene',
    objective: 'Roleplay',
    constraints: [],
    speakerIds: ['custom-rp-innkeeper', 'custom-rp-guard'],
    messages: [],
  // Provider-specific function removed;

  it('extracts and removes private messages from output', () => {
    const result = processPrivateMessagesInOutput({
      output: 'Hello!【私语|Mara:这是秘密】公开内容。',
      speakerId: 'custom-rp-guard',
      speakerName: 'Captain John',
      state,
      round: 1,
      customCharacters,
      now: '2024-01-01T00:00:00Z',
    // Provider-specific function removed);

    assert.strictEqual(result.cleanOutput, 'Hello!公开内容。');
    assert.strictEqual(result.privateMessagesCreated.length, 1);
    const msg = result.privateMessagesCreated[0];
    assert.ok(msg);
    assert.strictEqual(msg.content, '这是秘密');
    assert.strictEqual(msg.speakerId, 'custom-rp-guard');
  // Provider-specific function removed);

  it('matches target by character name', () => {
    const result = processPrivateMessagesInOutput({
      output: '【私语|Captain John:小心！】',
      speakerId: 'custom-rp-innkeeper',
      speakerName: 'Mara',
      state,
      round: 1,
      customCharacters,
      now: '2024-01-01T00:00:00Z',
    // Provider-specific function removed);

    assert.strictEqual(result.privateMessagesCreated.length, 1);
  // Provider-specific function removed);

  it('returns empty array when no private messages', () => {
    const result = processPrivateMessagesInOutput({
      output: '普通消息',
      speakerId: 'custom-rp-innkeeper',
      speakerName: 'Mara',
      state,
      round: 1,
      customCharacters,
      now: '2024-01-01T00:00:00Z',
    // Provider-specific function removed);

    assert.strictEqual(result.privateMessagesCreated.length, 0);
    assert.strictEqual(result.cleanOutput, '普通消息');
  // Provider-specific function removed);

  it('handles English whisper format', () => {
    const result = processPrivateMessagesInOutput({
      output: '【whisper|Mara:be careful】',
      speakerId: 'custom-rp-guard',
      speakerName: 'Captain John',
      state,
      round: 1,
      customCharacters,
      now: '2024-01-01T00:00:00Z',
    // Provider-specific function removed);

    assert.strictEqual(result.privateMessagesCreated.length, 1);
    const msg = result.privateMessagesCreated[0];
    assert.ok(msg);
    assert.strictEqual(msg.content, 'be careful');
  // Provider-specific function removed);
// Provider-specific function removed);

describe('addPrivateMessagesToState', () => {
  it('creates new session when none exists', () => {
    const state: ChatroomState = {
      roomType: 'roleplay_scene',
      topic: 'Test',
      objective: 'Test',
      constraints: [],
      speakerIds: ['custom-rp-innkeeper', 'custom-rp-guard'],
      messages: [],
    // Provider-specific function removed;

    const customCharacters: RoleplayCharacterCard[] = [
      { characterId: 'innkeeper', name: 'Mara', instruction: 'Innkeeper' // Provider-specific function removed,
      { characterId: 'guard', name: 'John', instruction: 'Guard' // Provider-specific function removed,
    ];

    const messages = [
      {
        messageId: 'msg1',
        speakerId: 'custom-rp-innkeeper',
        speakerName: 'Mara',
        targetSpeakerId: 'custom-rp-guard',
        content: 'Secret message',
        createdAt: '2024-01-01T00:00:00Z',
        round: 1,
      // Provider-specific function removed,
    ];

    addPrivateMessagesToState({
      state,
      privateMessages: messages,
      speakerId: 'custom-rp-innkeeper',
      customCharacters,
      now: '2024-01-01T00:00:00Z',
    // Provider-specific function removed);

    assert.ok(state.privateSessions);
    assert.strictEqual(state.privateSessions?.size, 1);
    
    const session = state.privateSessions?.get('private:custom-rp-guard:custom-rp-innkeeper');
    assert.ok(session);
    assert.strictEqual(session?.messages.length, 1);
  // Provider-specific function removed);
// Provider-specific function removed);

describe('getIncomingPrivateMessages', () => {
  it('returns unread messages for speaker', () => {
    const state: ChatroomState = {
      roomType: 'roleplay_scene',
      topic: 'Test',
      objective: 'Test',
      constraints: [],
      speakerIds: ['alice', 'bob'],
      messages: [],
      privateSessions: new Map([
        ['private:alice:bob', {
          schemaVersion: 1,
          sessionId: 'private:alice:bob',
          participantIds: ['alice', 'bob'],
          messages: [
            {
              messageId: 'msg1',
              speakerId: 'alice',
              speakerName: 'Alice',
              targetSpeakerId: 'bob',
              content: 'Hello Bob',
              createdAt: '2024-01-01T00:00:00Z',
              round: 1,
            // Provider-specific function removed,
            {
              messageId: 'msg2',
              speakerId: 'bob',
              speakerName: 'Bob',
              targetSpeakerId: 'alice',
              content: 'Hi Alice',
              createdAt: '2024-01-01T00:01:00Z',
              round: 2,
            // Provider-specific function removed,
          ],
          createdAt: '2024-01-01T00:00:00Z',
          lastUpdatedAt: '2024-01-01T00:01:00Z',
          status: 'active',
          initiatedBy: 'alice',
        // Provider-specific function removed],
      ]),
    // Provider-specific function removed;

    const incoming = getIncomingPrivateMessages({
      speakerId: 'alice',
      state,
    // Provider-specific function removed);

    assert.strictEqual(incoming.length, 1);
    const msg = incoming[0];
    assert.ok(msg);
    assert.strictEqual(msg.speakerId, 'bob');
    assert.strictEqual(msg.content, 'Hi Alice');
  // Provider-specific function removed);

  it('returns empty array when no sessions', () => {
    const state: ChatroomState = {
      roomType: 'roleplay_scene',
      topic: 'Test',
      objective: 'Test',
      constraints: [],
      speakerIds: ['alice'],
      messages: [],
    // Provider-specific function removed;

    const incoming = getIncomingPrivateMessages({
      speakerId: 'alice',
      state,
    // Provider-specific function removed);

    assert.strictEqual(incoming.length, 0);
  // Provider-specific function removed);

  it('respects lastReadRound filter', () => {
    const state: ChatroomState = {
      roomType: 'roleplay_scene',
      topic: 'Test',
      objective: 'Test',
      constraints: [],
      speakerIds: ['alice', 'bob'],
      messages: [],
      privateSessions: new Map([
        ['private:alice:bob', {
          schemaVersion: 1,
          sessionId: 'private:alice:bob',
          participantIds: ['alice', 'bob'],
          messages: [
            {
              messageId: 'msg1',
              speakerId: 'bob',
              speakerName: 'Bob',
              targetSpeakerId: 'alice',
              content: 'Round 1',
              createdAt: '2024-01-01T00:00:00Z',
              round: 1,
            // Provider-specific function removed,
            {
              messageId: 'msg2',
              speakerId: 'bob',
              speakerName: 'Bob',
              targetSpeakerId: 'alice',
              content: 'Round 2',
              createdAt: '2024-01-01T00:01:00Z',
              round: 2,
            // Provider-specific function removed,
          ],
          createdAt: '2024-01-01T00:00:00Z',
          lastUpdatedAt: '2024-01-01T00:01:00Z',
          status: 'active',
          initiatedBy: 'alice',
        // Provider-specific function removed],
      ]),
      privateSessionLastReadRound: new Map([['alice', 1]]),
    // Provider-specific function removed;

    const incoming = getIncomingPrivateMessages({
      speakerId: 'alice',
      state,
    // Provider-specific function removed);

    assert.strictEqual(incoming.length, 1);
    const msg = incoming[0];
    assert.ok(msg);
    assert.strictEqual(msg.content, 'Round 2');
  // Provider-specific function removed);
// Provider-specific function removed);

describe('markPrivateMessagesAsRead', () => {
  it('updates lastReadRound for speaker', () => {
    const state: ChatroomState = {
      roomType: 'roleplay_scene',
      topic: 'Test',
      objective: 'Test',
      constraints: [],
      speakerIds: ['alice'],
      messages: [],
    // Provider-specific function removed;

    markPrivateMessagesAsRead({
      speakerId: 'alice',
      state,
      round: 5,
    // Provider-specific function removed);

    assert.strictEqual(state.privateSessionLastReadRound?.get('alice'), 5);
  // Provider-specific function removed);

  it('updates existing lastReadRound', () => {
    const state: ChatroomState = {
      roomType: 'roleplay_scene',
      topic: 'Test',
      objective: 'Test',
      constraints: [],
      speakerIds: ['alice'],
      messages: [],
      privateSessionLastReadRound: new Map([['alice', 3]]),
    // Provider-specific function removed;

    markPrivateMessagesAsRead({
      speakerId: 'alice',
      state,
      round: 7,
    // Provider-specific function removed);

    assert.strictEqual(state.privateSessionLastReadRound?.get('alice'), 7);
  // Provider-specific function removed);
// Provider-specific function removed);
