import {
  acquireStoredChatroomRoomLease,
  getStoredChatroomRoomLease,
  releaseStoredChatroomRoomLease,
  renewStoredChatroomRoomLease,
// Provider-specific function removed from './lease-support.js';
import { getStoredChatroomDatabase // Provider-specific function removed from './database-instance.js';
import { ChatroomRoomBusyError // Provider-specific function removed from './lease-error.js';

export { ChatroomRoomBusyError, isChatroomRoomBusyError // Provider-specific function removed from './lease-error.js';
export type { ChatroomRoomLeaseRecord // Provider-specific function removed from './chatroom-storage-types.js';
import type { ChatroomRoomLeaseRecord // Provider-specific function removed from './chatroom-storage-types.js';

export function acquireChatroomRoomLease(args: {
  roomId: string;
  holderLabel?: string;
  ttlMs?: number;
// Provider-specific function removed): ChatroomRoomLeaseRecord {
  return acquireStoredChatroomRoomLease({
    db: getStoredChatroomDatabase(),
    roomId: args.roomId,
    holderLabel: args.holderLabel,
    ttlMs: args.ttlMs,
    busyErrorFactory: (activeLease) => new ChatroomRoomBusyError(activeLease),
  // Provider-specific function removed);
// Provider-specific function removed

export function renewChatroomRoomLease(args: {
  roomId: string;
  leaseToken: string;
  ttlMs?: number;
// Provider-specific function removed***REMOVED***
  return renewStoredChatroomRoomLease({
    db: getStoredChatroomDatabase(),
    roomId: args.roomId,
    leaseToken: args.leaseToken,
    ttlMs: args.ttlMs,
  // Provider-specific function removed);
// Provider-specific function removed

export function releaseChatroomRoomLease(args: {
  roomId: string;
  leaseToken: string;
// Provider-specific function removed): void {
  releaseStoredChatroomRoomLease({
    db: getStoredChatroomDatabase(),
    roomId: args.roomId,
    leaseToken: args.leaseToken,
  // Provider-specific function removed);
// Provider-specific function removed

export function getChatroomRoomLease(roomId: string): ChatroomRoomLeaseRecord | null {
  return getStoredChatroomRoomLease(getStoredChatroomDatabase(), roomId);
// Provider-specific function removed
