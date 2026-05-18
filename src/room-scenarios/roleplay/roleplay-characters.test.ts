import assert from 'node:assert/strict';
import test from 'node:test';

import {
  normalizeRoleplayCharacterCards,
  selectCustomRoleplaySpeakerIds,
// Provider-specific function removed from './roleplay-characters.js';

test('roleplay character normalization keeps explicit ids unique', () => {
  const characters = normalizeRoleplayCharacterCards([
    {
      characterId: 'keeper',
      name: 'Mara',
      instruction: 'Keeps the tavern.',
    // Provider-specific function removed,
    {
      characterId: 'keeper',
      name: 'Mara Mirror',
      instruction: 'A duplicate identity that must not steal memory.',
    // Provider-specific function removed,
  ]);

  assert.equal(characters[0]?.characterId, 'keeper');
  assert.equal(characters[1]?.characterId, 'keeper-2');
  assert.deepEqual(selectCustomRoleplaySpeakerIds(characters), [
    'scene-host-rp',
    'custom-rp-keeper',
    'custom-rp-keeper-2',
  ]);
// Provider-specific function removed);

test('roleplay character normalization preserves extended role-card fields', () => {
  const characters = normalizeRoleplayCharacterCards([
    {
      characterId: 'guard',
      name: 'Captain Rook',
      instruction: 'Keeps order near the hearth.',
      publicDescription: 'An old guard with a dented helm.',
      privateNotes: ['Owes the tavern keeper a favor.', 'Owes the tavern keeper a favor.'],
      initialGoal: 'Find out why the stranger arrived during the storm.',
      relationships: [
        {
          targetCharacterId: 'keeper',
          summary: 'Trusts Mara but dislikes her secrets.',
          score: 7,
        // Provider-specific function removed,
      ],
    // Provider-specific function removed,
  ]);

  assert.equal(characters[0]?.publicDescription, 'An old guard with a dented helm.');
  assert.deepEqual(characters[0]?.privateNotes, ['Owes the tavern keeper a favor.']);
  assert.equal(
    characters[0]?.relationships?.[0]?.summary,
    'Trusts Mara but dislikes her secrets.',
  );
  assert.equal(characters[0]?.relationships?.[0]?.score, 3);
  assert.equal(
    characters[0]?.initialGoal,
    'Find out why the stranger arrived during the storm.',
  );
// Provider-specific function removed);
