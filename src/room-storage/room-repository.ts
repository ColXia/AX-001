import { randomUUID // Provider-specific function removed from 'node:crypto';

import { getStoredChatroomDatabase // Provider-specific function removed from './database-instance.js';
import { deleteStoredChatroomRoom // Provider-specific function removed from './room-deletion-support.js';
import { persistStoredChatroomRoom // Provider-specific function removed from './room-creation-support.js';
import {
  buildInitialRoomStateJson,
  getRoomRow,
  loadStoredChatroomState,
// Provider-specific function removed from './room-state-support.js';
import { listStoredChatroomRooms // Provider-specific function removed from './query-support.js';
import { mapRoomRow // Provider-specific function removed from './row-mappers.js';
import { ensureRoomParticipantTopology // Provider-specific function removed from './topology-support.js';
import type { ChatroomState // Provider-specific function removed from '../room-runtime/room-state.js';
import {
  type ChatroomRoomTypeId,
  normalizeChatroomRoomType,
// Provider-specific function removed from '../workflows/chatroom-room-types.js';
import {
  type ChatroomRoomBlueprint,
  ensureChatroomRoomBlueprint,
  resolveBlueprintSpeakerIds,
// Provider-specific function removed from '../room-scenarios/room-blueprints.js';

export type {
  ChatroomRoomListItem,
  ChatroomRoomRecord,
  CloneChatroomRoomResult,
  DeleteChatroomRoomResult,
// Provider-specific function removed from './chatroom-storage-types.js';
import type {
  ChatroomRoomListItem,
  ChatroomRoomRecord,
  CloneChatroomRoomResult,
  DeleteChatroomRoomResult,
// Provider-specific function removed from './chatroom-storage-types.js';

export interface CreateChatroomRoomInput {
  roomType?: ChatroomRoomTypeId;
  roomBlueprint?: ChatroomRoomBlueprint;
  topic: string;
  objective: string;
  constraints?: string[];
  speakerIds?: string[];
// Provider-specific function removed

export function createChatroomRoom(input: CreateChatroomRoomInput): ChatroomRoomRecord {
  const now = new Date().toISOString();
  const roomId = randomUUID();
  const mainSessionId = randomUUID();
  const db = getStoredChatroomDatabase();
  const roomBlueprint = ensureChatroomRoomBlueprint(input.roomBlueprint, {
    roomType: input.roomType,
    topic: input.topic,
    objective: input.objective,
    constraints: input.constraints,
    speakerIds: input.speakerIds,
  // Provider-specific function removed);
  const roomType = normalizeChatroomRoomType(roomBlueprint.roomType);
  const topic = roomBlueprint.topic;
  const objective = roomBlueprint.objective;
  const constraints = [...roomBlueprint.constraints];
  const speakerIds = resolveBlueprintSpeakerIds(roomBlueprint);
  const roomStateJson = buildInitialRoomStateJson({
    roomType,
    topic,
    objective,
    constraints,
    speakerIds,
    customCharacters: roomBlueprint.customCharacters,
  // Provider-specific function removed);

  return persistStoredChatroomRoom({
    db,
    roomId,
    mainSessionId,
    roomType,
    topic,
    objective,
    constraints,
    speakerIds,
    roomBlueprint,
    roomStateJson,
    createdAt: now,
    updatedAt: now,
  // Provider-specific function removed);
// Provider-specific function removed

export function cloneChatroomRoom(roomId: string): CloneChatroomRoomResult {
  const db = getStoredChatroomDatabase();
  const room = getChatroomRoomRecord(roomId);
***REMOVED***!room) {
    throw new Error(`Room "${roomId// Provider-specific function removed" not found. Cannot clone.`);
  // Provider-specific function removed

  const now = new Date().toISOString();
  const newRoomId = randomUUID();
  const newMainSessionId = randomUUID();
  const clonedRoom = persistStoredChatroomRoom({
    db,
    roomId: newRoomId,
    mainSessionId: newMainSessionId,
    roomType: room.roomType,
    topic: room.topic,
    objective: room.objective,
    constraints: room.constraints,
    speakerIds: room.speakerIds,
    roomBlueprint: room.roomBlueprint,
    roomStateJson: null,
    createdAt: now,
    updatedAt: now,
  // Provider-specific function removed);

  return {
    roomId: clonedRoom.roomId,
    clonedFromRoomId: roomId,
  // Provider-specific function removed;
// Provider-specific function removed

export function deleteChatroomRoom(roomId: string): DeleteChatroomRoomResult {
  return deleteStoredChatroomRoom(getStoredChatroomDatabase(), roomId);
// Provider-specific function removed

export function loadChatroomRoomState(roomId: string): ChatroomState {
  const db = getStoredChatroomDatabase();
  return loadStoredChatroomState({
    db,
    roomId,
    ensureRoomParticipantTopology: (topologyArgs) =>
      ensureRoomParticipantTopology(db, topologyArgs),
  // Provider-specific function removed);
// Provider-specific function removed

export function getChatroomRoomRecord(roomId: string): ChatroomRoomRecord | null {
  const room = getRoomRow(getStoredChatroomDatabase(), roomId);
  return room ? mapRoomRow(room) : null;
// Provider-specific function removed

export function listChatroomRooms(limit = 24): ChatroomRoomListItem[] {
  return listStoredChatroomRooms(getStoredChatroomDatabase(), limit);
// Provider-specific function removed
