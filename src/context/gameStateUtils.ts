export interface AnswerScoringConfig {
  correctAnswer: number;
  streakBonus: number;
  streakMax: number;
}

export interface AnswerStateSnapshot {
  lives: number;
  score: number;
  mana: number;
  streak: number;
  maxStreak: number;
  totalQuestionsAnswered: number;
  totalCorrect: number;
  currentLevelCorrect: number;
  currentLevelIncorrect: number;
}

export interface AnswerStateResult extends AnswerStateSnapshot {
  reachedZeroLives: boolean;
}

export const resolveAnswerState = (
  prev: AnswerStateSnapshot,
  isCorrect: boolean,
  scoring: AnswerScoringConfig
): AnswerStateResult => {
  if (isCorrect) {
    const nextStreak = prev.streak + 1;
    const streakBonus = Math.min(nextStreak * scoring.streakBonus, scoring.streakMax);

    return {
      ...prev,
      score: prev.score + scoring.correctAnswer + streakBonus,
      mana: prev.mana + 10,
      streak: nextStreak,
      maxStreak: Math.max(prev.maxStreak, nextStreak),
      totalQuestionsAnswered: prev.totalQuestionsAnswered + 1,
      totalCorrect: prev.totalCorrect + 1,
      currentLevelCorrect: prev.currentLevelCorrect + 1,
      reachedZeroLives: false
    };
  }

  const nextLives = Math.max(0, prev.lives - 1);

  return {
    ...prev,
    lives: nextLives,
    streak: 0,
    totalQuestionsAnswered: prev.totalQuestionsAnswered + 1,
    currentLevelIncorrect: prev.currentLevelIncorrect + 1,
    reachedZeroLives: nextLives === 0
  };
};
