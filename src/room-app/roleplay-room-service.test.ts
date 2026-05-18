import { describe, it, beforeEach // Provider-specific function removed from 'node:test';
import assert from 'node:assert';
import { RoleplayRoomService // Provider-specific function removed from './roleplay-room-service.js';

describe('RoleplayRoomService', () => {
  let service: RoleplayRoomService;
  
  beforeEach(() => {
    service = new RoleplayRoomService();
  // Provider-specific function removed);
  
  describe('createRoom', () => {
    it('should create a roleplay room with characters', () => {
      const state = service.createRoom({
        topic: '西环酒馆',
        objective: '角色互动测试',
        scene: {
          setting: '一家老式酒馆',
          atmosphere: '温暖、安静',
        // Provider-specific function removed,
        characters: [
          {
            id: 'mara',
            name: '玛拉',
            instruction: '你是酒馆老板娘',
            publicDescription: '热情的老板娘',
            priority: 'high',
            talkativeness: 0.8,
            initialMemory: {
              observations: ['酒馆生意不错'],
              facts: ['经营酒馆15年'],
            // Provider-specific function removed,
            initialRelationships: [
              { targetId: 'shadow', score: 3, summary: '常客' // Provider-specific function removed,
            ],
          // Provider-specific function removed,
          {
            id: 'shadow',
            name: '影子',
            instruction: '你是神秘流浪者',
            publicDescription: '沉默寡言的神秘人',
            priority: 'low',
            talkativeness: 0.3,
          // Provider-specific function removed,
        ],
      // Provider-specific function removed);
      
      assert.ok(state.roomId);
      assert.strictEqual(state.topic, '西环酒馆');
      assert.strictEqual(state.characters.size, 2);
      assert.ok(state.characters.has('mara'));
      assert.ok(state.characters.has('shadow'));
    // Provider-specific function removed);
  // Provider-specific function removed);
  
  describe('getRoom', () => {
    it('should return null for non-existent room', () => {
      const state = service.getRoom('non-existent-id');
      assert.strictEqual(state, null);
    // Provider-specific function removed);
    
    it('should return room after creation', () => {
      const created = service.createRoom({
        topic: '测试房间',
        objective: '测试',
        scene: { setting: '测试场景', atmosphere: '测试' // Provider-specific function removed,
        characters: [
          { id: 'test', name: '测试', instruction: '测试', publicDescription: '测试' // Provider-specific function removed,
        ],
      // Provider-specific function removed);
      
      const loaded = service.getRoom(created.roomId);
      assert.ok(loaded);
      assert.strictEqual(loaded.roomId, created.roomId);
    // Provider-specific function removed);
  // Provider-specific function removed);
  
  describe('listRooms', () => {
    it('should list created rooms', () => {
      service.createRoom({
        topic: '房间A',
        objective: '测试A',
        scene: { setting: '场景A', atmosphere: '测试' // Provider-specific function removed,
        characters: [
          { id: 'a', name: 'A', instruction: 'A', publicDescription: 'A' // Provider-specific function removed,
        ],
      // Provider-specific function removed);
      
      service.createRoom({
        topic: '房间B',
        objective: '测试B',
        scene: { setting: '场景B', atmosphere: '测试' // Provider-specific function removed,
        characters: [
          { id: 'b', name: 'B', instruction: 'B', publicDescription: 'B' // Provider-specific function removed,
        ],
      // Provider-specific function removed);
      
      const rooms = service.listRooms();
      assert.ok(rooms.length >= 2);
    // Provider-specific function removed);
  // Provider-specific function removed);
  
  describe('character management', () => {
    it('should add character to room', () => {
      const state = service.createRoom({
        topic: '测试',
        objective: '测试',
        scene: { setting: '测试', atmosphere: '测试' // Provider-specific function removed,
        characters: [
          { id: 'existing', name: '已存在', instruction: '测试', publicDescription: '测试' // Provider-specific function removed,
        ],
      // Provider-specific function removed);
      
      const updated = service.addCharacter(state.roomId, {
        id: 'new',
        name: '新角色',
        instruction: '新角色',
        publicDescription: '新角色',
      // Provider-specific function removed);
      
      assert.ok(updated);
      assert.strictEqual(updated.characters.size, 2);
      assert.ok(updated.characters.has('new'));
    // Provider-specific function removed);
    
    it('should remove character from room', () => {
      const state = service.createRoom({
        topic: '测试',
        objective: '测试',
        scene: { setting: '测试', atmosphere: '测试' // Provider-specific function removed,
        characters: [
          { id: 'char1', name: '角色1', instruction: '测试', publicDescription: '测试' // Provider-specific function removed,
          { id: 'char2', name: '角色2', instruction: '测试', publicDescription: '测试' // Provider-specific function removed,
        ],
      // Provider-specific function removed);
      
      const updated = service.removeCharacter(state.roomId, 'char1');
      
      assert.ok(updated);
      assert.strictEqual(updated.characters.size, 1);
      assert.ok(!updated.characters.has('char1'));
    // Provider-specific function removed);
    
    it('should activate dormant character', () => {
      const state = service.createRoom({
        topic: '测试',
        objective: '测试',
        scene: { setting: '测试', atmosphere: '测试' // Provider-specific function removed,
        characters: [
          { id: 'dormant', name: '静默角色', instruction: '测试', publicDescription: '测试' // Provider-specific function removed,
        ],
      // Provider-specific function removed);
      
      state.characters.get('dormant')!.status = 'dormant';
      
      const activated = service.activateCharacter(state.roomId, 'dormant');
      
      assert.ok(activated);
      assert.strictEqual(activated.characters.get('dormant')?.status, 'active');
    // Provider-specific function removed);
    
    it('should deactivate active character', () => {
      const state = service.createRoom({
        topic: '测试',
        objective: '测试',
        scene: { setting: '测试', atmosphere: '测试' // Provider-specific function removed,
        characters: [
          { id: 'active', name: '活跃角色', instruction: '测试', publicDescription: '测试' // Provider-specific function removed,
        ],
      // Provider-specific function removed);
      
      const deactivated = service.deactivateCharacter(state.roomId, 'active');
      
      assert.ok(deactivated);
      assert.strictEqual(deactivated.characters.get('active')?.status, 'dormant');
    // Provider-specific function removed);
  // Provider-specific function removed);
  
  describe('deleteRoom', () => {
    it('should delete room', () => {
      const state = service.createRoom({
        topic: '待删除',
        objective: '测试',
        scene: { setting: '测试', atmosphere: '测试' // Provider-specific function removed,
        characters: [
          { id: 'test', name: '测试', instruction: '测试', publicDescription: '测试' // Provider-specific function removed,
        ],
      // Provider-specific function removed);
      
      service.deleteRoom(state.roomId);
      
      const loaded = service.getRoom(state.roomId);
      assert.strictEqual(loaded, null);
    // Provider-specific function removed);
  // Provider-specific function removed);
  
  describe('getMessages', () => {
    it('should return empty array for new room', () => {
      const state = service.createRoom({
        topic: '测试',
        objective: '测试',
        scene: { setting: '测试', atmosphere: '测试' // Provider-specific function removed,
        characters: [
          { id: 'test', name: '测试', instruction: '测试', publicDescription: '测试' // Provider-specific function removed,
        ],
      // Provider-specific function removed);
      
      const messages = service.getMessages(state.roomId);
      assert.strictEqual(messages.length, 0);
    // Provider-specific function removed);
  // Provider-specific function removed);
// Provider-specific function removed);
