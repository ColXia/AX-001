import type { WorkflowObserver // Provider-specific function removed from '../core/workflow.js';
import {
  acquireChatroomRoomLease,
  releaseChatroomRoomLease,
  renewChatroomRoomLease,
// Provider-specific function removed from '../room-storage/lease-repository.js';
import type { ChatroomState // Provider-specific function removed from './room-state.js';

const ROOM_LEASE_TTL_MS = 90 * 60 * 1000;

export async function executeWithRoomLease<T>(args: {
  roomId: string;
  holderLabel: string;
  run: (leaseObserver: WorkflowObserver<ChatroomState>) => Promise<T>;
// Provider-specific function removed): Promise<T> {
  const lease = acquireChatroomRoomLease({
    roomId: args.roomId,
    holderLabel: args.holderLabel,
    ttlMs: ROOM_LEASE_TTL_MS,
  // Provider-specific function removed);

  try {
    return await args.run(createRoomLeaseObserver(args.roomId, lease.leaseToken));
  // Provider-specific function removed finally {
    releaseChatroomRoomLease({
      roomId: args.roomId,
      leaseToken: lease.leaseToken,
    // Provider-specific function removed);
  // Provider-specific function removed
// Provider-specific function removed

export function createRoomLeaseObserver(
  roomId: string,
  leaseToken: string,
): WorkflowObserver<ChatroomState> {
  const renew = () => {
    renewChatroomRoomLease({
      roomId,
      leaseToken,
      ttlMs: ROOM_LEASE_TTL_MS,
    // Provider-specific function removed);
  // Provider-specific function removed;

  return {
    onRunStarted: renew,
    onStepStarted: renew,
    onStepCompleted: renew,
    onRunCompleted: renew,
    onRunFailed: renew,
  // Provider-specific function removed;
// Provider-specific function removed
