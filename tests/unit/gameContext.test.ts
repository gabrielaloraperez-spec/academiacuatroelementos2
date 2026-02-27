import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveAnswerState } from '../../src/context/gameStateUtils.ts';

const scoring = {
  correctAnswer: 100,
  streakBonus: 10,
  streakMax: 50
};

const baseState = {
  lives: 3,
  score: 0,
  mana: 100,
  streak: 0,
  maxStreak: 0,
  totalQuestionsAnswered: 0,
  totalCorrect: 0,
  currentLevelCorrect: 0,
  currentLevelIncorrect: 0
};

test('GameContext logic: correct answer increases score', () => {
  const next = resolveAnswerState(baseState, true, scoring);

  assert.equal(next.score, 110);
  assert.equal(next.totalCorrect, 1);
  assert.equal(next.currentLevelCorrect, 1);
  assert.equal(next.reachedZeroLives, false);
});

test('GameContext logic: streak increases on correct answers', () => {
  const first = resolveAnswerState(baseState, true, scoring);
  const second = resolveAnswerState(first, true, scoring);

  assert.equal(first.streak, 1);
  assert.equal(second.streak, 2);
  assert.equal(second.maxStreak, 2);
});

test('GameContext logic: lives decrease on incorrect answer', () => {
  const next = resolveAnswerState(baseState, false, scoring);

  assert.equal(next.lives, 2);
  assert.equal(next.streak, 0);
  assert.equal(next.currentLevelIncorrect, 1);
});
