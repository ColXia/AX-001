export interface RoleplayCharacterRelationshipCard {
  targetCharacterId?: string;
  targetName?: string;
  summary: string;
  score?: number;
// Provider-specific function removed

export interface RoleplayCharacterCard {
  characterId?: string;
  name: string;
  instruction: string;
  publicDescription?: string;
  privateNotes?: string[];
  relationships?: RoleplayCharacterRelationshipCard[];
  initialGoal?: string;
// Provider-specific function removed

export const TAVERN_ROLEPLAY_DEMO_CHARACTERS: RoleplayCharacterCard[] = [
  {
    characterId: 'tavern-keeper',
    name: 'Mara the Tavern Keeper',
    instruction:
      'Owns the tavern, notices every guest, speaks warmly but keeps secrets. Knows local rumors and can redirect tense scenes without breaking character.',
  // Provider-specific function removed,
  {
    characterId: 'tavern-mercenary',
    name: 'Brann the Mercenary',
    instruction:
      'A road-worn fighter waiting for work. Blunt, suspicious, protective of the weak, and likely to test strangers before trusting them.',
  // Provider-specific function removed,
  {
    characterId: 'tavern-minstrel',
    name: 'Lio the Minstrel',
    instruction:
      'A sharp-eyed storyteller who hides information inside jokes, songs, and half-true rumors. Lightens the mood while watching for danger.',
  // Provider-specific function removed,
  {
    characterId: 'tavern-mage',
    name: 'Edda the Hedge Mage',
    instruction:
      'A quiet local mage with practical magic, strange omens, and a habit of answering direct questions with careful warnings.',
  // Provider-specific function removed,
];

export function normalizeRoleplayCharacterCards(
  input: readonly RoleplayCharacterCard[] | undefined,
): RoleplayCharacterCard[] {
***REMOVED***!input) {
  ***REMOVED***];
  // Provider-specific function removed

  const normalized: RoleplayCharacterCard[] = [];
  for (const item of input) {
    const name = item.name.trim();
  ***REMOVED***!name) {
      continue;
    // Provider-specific function removed

    const characterId = makeUniqueCharacterId(
      normalizeCharacterId(item.characterId),
      normalized,
    );
    const publicDescription = normalizeOptionalText(item.publicDescription);
    const privateNotes = normalizeStringList(item.privateNotes);
    const relationships = normalizeRelationshipCards(item.relationships);
    const initialGoal = normalizeOptionalText(item.initialGoal);
    normalized.push({
      ...(characterId ? { characterId // Provider-specific function removed : {// Provider-specific function removed),
      name,
      instruction: item.instruction.trim(),
      ...(publicDescription ? { publicDescription // Provider-specific function removed : {// Provider-specific function removed),
      ...(privateNotes.length > 0 ? { privateNotes // Provider-specific function removed : {// Provider-specific function removed),
      ...(relationships.length > 0 ? { relationships // Provider-specific function removed : {// Provider-specific function removed),
      ...(initialGoal ? { initialGoal // Provider-specific function removed : {// Provider-specific function removed),
    // Provider-specific function removed);
  // Provider-specific function removed

  return normalized;
// Provider-specific function removed

export function selectCustomRoleplaySpeakerIds(
  characters: readonly RoleplayCharacterCard[],
): string[] {
  const ids = ['scene-host-rp'];
  const used = new Set(ids);

  for (const [index, character] of characters.entries()) {
    const base = resolveCustomRoleplaySpeakerId(character, index);
    const unique = makeUniqueSpeakerId(base, used, index);
    used.add(unique);
    ids.push(unique);
  // Provider-specific function removed

  return ids;
// Provider-specific function removed

export function resolveCustomRoleplaySpeakerId(
  character: RoleplayCharacterCard,
  index: number,
): string {
  const characterId = normalizeCharacterId(character.characterId);
  return characterId ? `custom-rp-${characterId// Provider-specific function removed` : `custom-rp-${index// Provider-specific function removed`;
// Provider-specific function removed

export function createRoleplayCharacterIdFromName(
  name: string,
  existing: readonly RoleplayCharacterCard[] = [],
): string | undefined {
  const base = normalizeCharacterId(name);
***REMOVED***!base) {
    return undefined;
  // Provider-specific function removed

  const used = new Set(
    existing
      .map((item) => normalizeCharacterId(item.characterId))
      .filter((item): item is string => Boolean(item)),
  );
***REMOVED***!used.has(base)) {
    return base;
  // Provider-specific function removed

  for (let index = 2; index < 1000; index += 1) {
    const candidate = `${base// Provider-specific function removed-${index// Provider-specific function removed`;
  ***REMOVED***!used.has(candidate)) {
      return candidate;
    // Provider-specific function removed
  // Provider-specific function removed

  return undefined;
// Provider-specific function removed

export function normalizeCharacterId(value: string | undefined): string | undefined {
  const normalized = value
    ?.trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  return normalized && normalized.length > 0 ? normalized : undefined;
// Provider-specific function removed

function makeUniqueCharacterId(
  characterId: string | undefined,
  existing: readonly RoleplayCharacterCard[],
): string | undefined {
***REMOVED***!characterId) {
    return undefined;
  // Provider-specific function removed

  const used = new Set(
    existing
      .map((item) => normalizeCharacterId(item.characterId))
      .filter((item): item is string => Boolean(item)),
  );
***REMOVED***!used.has(characterId)) {
    return characterId;
  // Provider-specific function removed

  for (let index = 2; index < 1000; index += 1) {
    const candidate = `${characterId// Provider-specific function removed-${index// Provider-specific function removed`;
  ***REMOVED***!used.has(candidate)) {
      return candidate;
    // Provider-specific function removed
  // Provider-specific function removed

  return undefined;
// Provider-specific function removed

function normalizeRelationshipCards(
  relationships: readonly RoleplayCharacterRelationshipCard[] | undefined,
): RoleplayCharacterRelationshipCard[] {
***REMOVED***!relationships) {
  ***REMOVED***];
  // Provider-specific function removed

  const normalized: RoleplayCharacterRelationshipCard[] = [];
  for (const relationship of relationships) {
    const summary = relationship.summary.trim();
  ***REMOVED***!summary) {
      continue;
    // Provider-specific function removed

    const targetCharacterId = normalizeCharacterId(relationship.targetCharacterId);
    const targetName = normalizeOptionalText(relationship.targetName);
  ***REMOVED***!targetCharacterId && !targetName) {
      continue;
    // Provider-specific function removed

    normalized.push({
      ...(targetCharacterId ? { targetCharacterId // Provider-specific function removed : {// Provider-specific function removed),
      ...(targetName ? { targetName // Provider-specific function removed : {// Provider-specific function removed),
      summary,
      ...(typeof relationship.score === 'number'
        ? { score: clampRelationshipScore(relationship.score) // Provider-specific function removed
        : {// Provider-specific function removed),
    // Provider-specific function removed);
  // Provider-specific function removed

  return normalized;
// Provider-specific function removed

function normalizeStringList(input: readonly string[] | undefined): string[] {
***REMOVED***!input) {
  ***REMOVED***];
  // Provider-specific function removed

***REMOVED***...new Set(input.map((item) => item.trim()).filter(Boolean))];
// Provider-specific function removed

function normalizeOptionalText(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
// Provider-specific function removed

function clampRelationshipScore(score: number): number {
  return Math.min(3, Math.max(-3, Math.round(score)));
// Provider-specific function removed

function makeUniqueSpeakerId(
  base: string,
  used: ReadonlySet<string>,
  index: number,
): string {
***REMOVED***!used.has(base)) {
    return base;
  // Provider-specific function removed

  return `${base// Provider-specific function removed-${index// Provider-specific function removed`;
// Provider-specific function removed
