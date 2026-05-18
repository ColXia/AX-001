import { describe, it // Provider-specific function removed from 'node:test';
import assert from 'node:assert';
import {
  parsePrivateMessages,
  generatePrivateSessionId,
  isParticipantInSession,
  getUnreadPrivateMessages,
  type PrivateSession,
  type PrivateSessionMessage,
// Provider-specific function removed from './private-session-types.js';

describe('parsePrivateMessages', () => {
  it('extracts Chinese private message markers', () => {
    const output = '你好！【私语|张三:这是秘密消息】公开内容。';
    const result = parsePrivateMessages(output);
    
    assert.strictEqual(result.privateMessages.length, 1);
    const msg = result.privateMessages[0];
    assert.ok(msg);
    assert.strictEqual(msg.targetName, '张三');
    assert.strictEqual(msg.content, '这是秘密消息');
    assert.strictEqual(result.cleanOutput, '你好！公开内容。');
  // Provider-specific function removed);

  it('extracts English whisper markers', () => {
    const output = 'Hello!【whisper|John:this is a secret】public content.';
    const result = parsePrivateMessages(output);
    
    assert.strictEqual(result.privateMessages.length, 1);
    const msg = result.privateMessages[0];
    assert.ok(msg);
    assert.strictEqual(msg.targetName, 'John');
    assert.strictEqual(msg.content, 'this is a secret');
    assert.strictEqual(result.cleanOutput, 'Hello!public content.');
  // Provider-specific function removed);

  it('extracts multiple private messages', () => {
    const output = '【私语|张三:消息1】【私语|李四:消息2】公开内容';
    const result = parsePrivateMessages(output);
    
    assert.strictEqual(result.privateMessages.length, 2);
    const msg0 = result.privateMessages[0];
    const msg1 = result.privateMessages[1];
    assert.ok(msg0);
    assert.ok(msg1);
    assert.strictEqual(msg0.targetName, '张三');
    assert.strictEqual(msg1.targetName, '李四');
  // Provider-specific function removed);

  it('returns empty array when no markers found', () => {
    const output = '普通消息，没有私语标记';
    const result = parsePrivateMessages(output);
    
    assert.strictEqual(result.privateMessages.length, 0);
    assert.strictEqual(result.cleanOutput, output);
  // Provider-specific function removed);

  it('handles mixed content with private messages', () => {
    const output = '角色A说："你好！"【私语|角色B:小心那个人】然后继续公开对话。';
    const result = parsePrivateMessages(output);
    
    assert.strictEqual(result.privateMessages.length, 1);
    assert.ok(result.cleanOutput.includes('角色A说："你好！"'));
    assert.ok(result.cleanOutput.includes('然后继续公开对话。'));
    assert.ok(!result.cleanOutput.includes('【私语'));
  // Provider-specific function removed);
// Provider-specific function removed);

describe('generatePrivateSessionId', () => {
  it('generates sorted session id', () => {
    const id1 = generatePrivateSessionId(['alice', 'bob']);
    const id2 = generatePrivateSessionId(['bob', 'alice']);
    
    assert.strictEqual(id1, id2);
    assert.strictEqual(id1, 'private:alice:bob');
  // Provider-specific function removed);

  it('handles multiple participants', () => {
    const id = generatePrivateSessionId(['charlie', 'alice', 'bob']);
    assert.strictEqual(id, 'private:alice:bob:charlie');
  // Provider-specific function removed);
// Provider-specific function removed);

describe('isParticipantInSession', () => {
  const session: PrivateSession = {
    schemaVersion: 1,
    sessionId: 'private:alice:bob',
    participantIds: ['alice', 'bob'],
    messages: [],
    createdAt: '2024-01-01T00:00:00Z',
    lastUpdatedAt: '2024-01-01T00:00:00Z',
    status: 'active',
    initiatedBy: 'alice',
  // Provider-specific function removed;

  it('returns true for participant', () => {
    assert.strictEqual(isParticipantInSession('alice', session), true);
    assert.strictEqual(isParticipantInSession('bob', session), true);
  // Provider-specific function removed);

  it('returns false for non-participant', () => {
    assert.strictEqual(isParticipantInSession('charlie', session), false);
  // Provider-specific function removed);
// Provider-specific function removed);

describe('getUnreadPrivateMessages', () => {
  const messages: PrivateSessionMessage[] = [
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
    {
      messageId: 'msg3',
      speakerId: 'alice',
      speakerName: 'Alice',
      targetSpeakerId: 'bob',
      content: 'Secret message',
      createdAt: '2024-01-01T00:02:00Z',
      round: 3,
    // Provider-specific function removed,
  ];

  const session: PrivateSession = {
    schemaVersion: 1,
    sessionId: 'private:alice:bob',
    participantIds: ['alice', 'bob'],
    messages,
    createdAt: '2024-01-01T00:00:00Z',
    lastUpdatedAt: '2024-01-01T00:02:00Z',
    status: 'active',
    initiatedBy: 'alice',
  // Provider-specific function removed;

  it('returns unread messages for participant', () => {
    const unread = getUnreadPrivateMessages('bob', session, 1);
    assert.strictEqual(unread.length, 1);
    const msg = unread[0];
    assert.ok(msg);
    assert.strictEqual(msg.content, 'Secret message');
  // Provider-specific function removed);

  it('excludes own messages', () => {
    const unread = getUnreadPrivateMessages('alice', session, 0);
    assert.strictEqual(unread.length, 1);
    const msg = unread[0];
    assert.ok(msg);
    assert.strictEqual(msg.speakerId, 'bob');
  // Provider-specific function removed);

  it('returns empty array for non-participant', () => {
    const unread = getUnreadPrivateMessages('charlie', session, 0);
    assert.strictEqual(unread.length, 0);
  // Provider-specific function removed);

  it('returns all unread when lastReadRound is 0', () => {
    const unread = getUnreadPrivateMessages('bob', session, 0);
    assert.strictEqual(unread.length, 2);
  // Provider-specific function removed);
// Provider-specific function removed);
