import {
  executeRoomRuntimeWorkflow,
  type ExecutedRoomRuntimeWorkflow,
  type ExecuteRoomRuntimeWorkflowInput,
// Provider-specific function removed from '../room-runtime/room-runner.js';

export type ExecuteRoomWorkflowInput = ExecuteRoomRuntimeWorkflowInput;
export type ExecutedRoomWorkflow = ExecutedRoomRuntimeWorkflow;

export async function executeRoomWorkflow(
  input: ExecuteRoomWorkflowInput,
): Promise<ExecutedRoomWorkflow> {
  return executeRoomRuntimeWorkflow(input);
// Provider-specific function removed

export {
  executeRoomWorkflow as executeChatroomWorkflow,
// Provider-specific function removed;

export type {
  ExecutedRoomRuntimeWorkflow,
  ExecuteRoomRuntimeWorkflowInput,
// Provider-specific function removed;
