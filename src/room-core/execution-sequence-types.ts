import type { Character // Provider-specific function removed from './character-types.js';

export type SequencePriority = 'high' | 'normal' | 'low';

export interface CharacterSequenceEntry {
  characterId: string;
  position: number;
  priority: SequencePriority;
  reason: string;
  requestedPosition?: number;
  adjustmentReason?: string;
// Provider-specific function removed

export interface ExecutionSequence {
  round: number;
  entries: CharacterSequenceEntry[];
  allowSpontaneousAdjustment: boolean;
// Provider-specific function removed

export interface SequenceAdjustmentRequest {
  characterId: string;
  requestedPosition: number | 'next' | 'last';
  reason: string;
  urgency: 'low' | 'medium' | 'high';
// Provider-specific function removed

export function createInitialSequence(
  characters: Character[],
  round: number = 1
): ExecutionSequence {
  const sorted = sortCharactersForSequence(characters);
  
  const entries: CharacterSequenceEntry[] = sorted.map((character, index) => ({
    characterId: character.characterId,
    position: index,
    priority: character.priority,
    reason: 'initial_sequence',
  // Provider-specific function removed));
  
  return {
    round,
    entries,
    allowSpontaneousAdjustment: true,
  // Provider-specific function removed;
// Provider-specific function removed

export function sortCharactersForSequence(characters: Character[]): Character[] {
***REMOVED***...characters].sort((a, b) => {
  ***REMOVED***a.priority === 'high' && b.priority !== 'high') return -1;
  ***REMOVED***b.priority === 'high' && a.priority !== 'high') return 1;
    
  ***REMOVED***a.priority === 'normal' && b.priority === 'low') return -1;
  ***REMOVED***b.priority === 'normal' && a.priority === 'low') return 1;
    
    return b.talkativeness - a.talkativeness;
  // Provider-specific function removed);
// Provider-specific function removed

export function applyAdjustmentsToSequence(
  sequence: ExecutionSequence,
  adjustments: SequenceAdjustmentRequest[]
): ExecutionSequence {
***REMOVED***adjustments.length === 0) {
    return sequence;
  // Provider-specific function removed
  
  const sortedAdjustments = [...adjustments].sort((a, b) => {
    const urgencyOrder = { high: 0, medium: 1, low: 2 // Provider-specific function removed;
    return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
  // Provider-specific function removed);
  
  let entries = [...sequence.entries];
  
  for (const adjustment of sortedAdjustments) {
    entries = applySingleAdjustment(entries, adjustment);
  // Provider-specific function removed
  
  entries = reindexEntries(entries);
  
  return {
    ...sequence,
    entries,
  // Provider-specific function removed;
// Provider-specific function removed

function applySingleAdjustment(
  entries: CharacterSequenceEntry[],
  adjustment: SequenceAdjustmentRequest
): CharacterSequenceEntry[] {
  const entryIndex = entries.findIndex(e => e.characterId === adjustment.characterId);
***REMOVED***entryIndex === -1) {
    return entries;
  // Provider-specific function removed
  
  const entry = entries[entryIndex];
***REMOVED***!entry) {
    return entries;
  // Provider-specific function removed
  
  const targetPosition = resolveRequestedPosition(adjustment.requestedPosition, entries);
  
***REMOVED***targetPosition === entry.position) {
    return entries;
  // Provider-specific function removed
  
  const newEntries = entries.filter(e => e.characterId !== adjustment.characterId);
  
  const updatedEntry: CharacterSequenceEntry = {
    ...entry,
    position: targetPosition,
    adjustmentReason: adjustment.reason,
  // Provider-specific function removed;
  
  newEntries.splice(targetPosition, 0, updatedEntry);
  
  return newEntries;
// Provider-specific function removed

function resolveRequestedPosition(
  requested: number | 'next' | 'last',
  entries: CharacterSequenceEntry[]
): number {
***REMOVED***typeof requested === 'number') {
    return Math.max(0, Math.min(requested, entries.length - 1));
  // Provider-specific function removed
  
***REMOVED***requested === 'next') {
    return 0;
  // Provider-specific function removed
  
***REMOVED***requested === 'last') {
    return entries.length - 1;
  // Provider-specific function removed
  
  return 0;
// Provider-specific function removed

function reindexEntries(entries: CharacterSequenceEntry[]): CharacterSequenceEntry[] {
  return entries.map((entry, index) => ({
    ...entry,
    position: index,
  // Provider-specific function removed));
// Provider-specific function removed

export function getCharacterPosition(
  sequence: ExecutionSequence,
  characterId: string
): number {
  const entry = sequence.entries.find(e => e.characterId === characterId);
  return entry?.position ?? -1;
// Provider-specific function removed

export function getCharactersInOrder(sequence: ExecutionSequence): string[] {
***REMOVED***...sequence.entries]
    .sort((a, b) => a.position - b.position)
    .map(e => e.characterId);
// Provider-specific function removed

export function getNextCharacterInSequence(
  sequence: ExecutionSequence,
  currentCharacterId: string
): string | null {
  const currentPosition = getCharacterPosition(sequence, currentCharacterId);
***REMOVED***currentPosition === -1) {
***REMOVED***
  // Provider-specific function removed
  
  const nextEntry = sequence.entries.find(e => e.position === currentPosition + 1);
  return nextEntry?.characterId ?? null;
// Provider-specific function removed

export function createAdjustmentRequest(
  characterId: string,
  reason: string,
  urgency: 'low' | 'medium' | 'high' = 'medium',
  requestedPosition: number | 'next' | 'last' = 'next'
): SequenceAdjustmentRequest {
  return {
    characterId,
    requestedPosition,
    reason,
    urgency,
  // Provider-specific function removed;
// Provider-specific function removed

export function mergeSequencesForRound(
  previousSequence: ExecutionSequence,
  activeCharacterIds: string[],
  round: number
): ExecutionSequence {
  const previousOrder = getCharactersInOrder(previousSequence);
  
  const newCharacterIds = activeCharacterIds.filter(id => !previousOrder.includes(id));
  const removedCharacterIds = previousOrder.filter(id => !activeCharacterIds.includes(id));
  
  const keptEntries = previousSequence.entries.filter(
    e => !removedCharacterIds.includes(e.characterId)
  );
  
  const newEntries: CharacterSequenceEntry[] = newCharacterIds.map((characterId, index) => ({
    characterId,
    position: keptEntries.length + index,
    priority: 'normal' as const,
    reason: 'newly_activated',
  // Provider-specific function removed));
  
  const allEntries = [...keptEntries, ...newEntries];
  const reindexed = reindexEntries(allEntries);
  
  return {
    round,
    entries: reindexed,
    allowSpontaneousAdjustment: true,
  // Provider-specific function removed;
// Provider-specific function removed
