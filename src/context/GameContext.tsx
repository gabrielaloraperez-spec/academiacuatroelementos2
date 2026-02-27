import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { levels, abilities, SCORING, Level, Ability } from '../data/gameData';
import { resolveAnswerState } from './gameStateUtils';

interface LevelStats {
  correct: number;
  incorrect: number;
  accuracy: number;
  mastery: number;
}

interface GameState {
  currentLevel: number;
  lives: number;
  score: number;
  mana: number;
  streak: number;
  maxStreak: number;
  unlockedLevels: number[];
  abilityUses: { [key: string]: number };
  highScores: { [key: number]: number };
  isBossUnlocked: boolean;
  playerName: string;
  avatar: string;
  achievements: string[];
  knowledgeRoomsCompleted: number;
  levelStats: { [key: number]: LevelStats };
  operationMastery: { [key: string]: number };
  totalQuestionsAnswered: number;
  totalCorrect: number;
  currentLevelCorrect: number;
  currentLevelIncorrect: number;
  currentSubLevel: number;
}

interface GameContextType {
  state: GameState;
  startLevel: (levelId: number) => void;
  answerQuestion: (isCorrect: boolean, _isBoss?: boolean) => void;
  useAbility: (abilityId: string) => boolean;
  resetLevel: () => void;
  completeLevel: (levelId: number, wasPerfect: boolean) => void;
  completeBoss: (timeRemaining: number) => void;
  completeKnowledgeRoom: () => void;
  setPlayerInfo: (name: string, avatar: string) => void;
  getCurrentLevelData: () => Level | null;
  getAbilityData: (abilityId: string) => Ability | undefined;
  getLevelStats: (levelId: number) => LevelStats;
  getOverallProgress: () => { completed: number; total: number; percentage: number };
  getOperationMastery: (operation: string) => number;
  setCurrentSubLevel: (subLevel: number) => void;
  handleGameOver: () => void;
}

const initialState: GameState = {
  currentLevel: 0,
  lives: 3,
  score: 0,
  mana: 100,
  streak: 0,
  maxStreak: 0,
  unlockedLevels: [1],
  abilityUses: {
    shield: 3,
    recharge: 2,
    multiplier: 5,
    extratime: 3
  },
  highScores: {},
  isBossUnlocked: false,
  playerName: "",
  avatar: "",
  achievements: [],
  knowledgeRoomsCompleted: 0,
  levelStats: {},
  operationMastery: {
    addition: 0,
    subtraction: 0,
    multiplication: 0,
    division: 0
  },
  totalQuestionsAnswered: 0,
  totalCorrect: 0,
  currentLevelCorrect: 0,
  currentLevelIncorrect: 0,
  currentSubLevel: 1
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem('academiaGameState');
    return saved ? JSON.parse(saved) : initialState;
  });

  useEffect(() => {
    localStorage.setItem('academiaGameState', JSON.stringify(state));
  }, [state]);

  const checkAchievements = useCallback((newState: GameState) => {
    const newAchievements: string[] = [...newState.achievements];

    // First level completed
    if (newState.unlockedLevels.length >= 2 && !newAchievements.includes('first_level')) {
      newAchievements.push('first_level');
    }

    // Streak achievements
    if (newState.streak >= 5 && !newAchievements.includes('streak_5')) {
      newAchievements.push('streak_5');
    }
    if (newState.streak >= 10 && !newAchievements.includes('streak_10')) {
      newAchievements.push('streak_10');
    }

    // Knowledge rooms
    if (newState.knowledgeRoomsCompleted >= 4 && !newAchievements.includes('all_knowledge')) {
      newAchievements.push('all_knowledge');
    }

    // Boss completed
    if (!newState.isBossUnlocked && newState.unlockedLevels.includes(5) && !newAchievements.includes('boss_killer')) {
      newAchievements.push('boss_killer');
    }

    if (newAchievements.length > newState.achievements.length) {
      return { ...newState, achievements: newAchievements };
    }
    return newState;
  }, []);

  const startLevel = useCallback((levelId: number) => {
    setState(prev => ({
      ...prev,
      currentLevel: levelId,
      lives: 3,
      streak: 0,
      currentLevelCorrect: 0,
      currentLevelIncorrect: 0,
      currentSubLevel: 1
    }));
  }, []);

  const getGameOverState = useCallback((prev: GameState): GameState => {
    if (prev.currentSubLevel === 3) {
      return {
        ...prev,
        lives: 3,
        streak: 0,
        currentLevelCorrect: 0,
        currentLevelIncorrect: 0,
        currentSubLevel: 3
      };
    }

    if (prev.currentSubLevel === 2) {
      return {
        ...prev,
        lives: 3,
        streak: 0,
        currentLevelCorrect: 0,
        currentLevelIncorrect: 0,
        currentSubLevel: 2
      };
    }

    return {
      ...prev,
      lives: 3,
      streak: 0,
      currentLevel: 0,
      currentLevelCorrect: 0,
      currentLevelIncorrect: 0,
      currentSubLevel: 1
    };
  }, []);

  const answerQuestion = useCallback((isCorrect: boolean, _isBoss: boolean = false) => {
    setState(prev => {
      const answerResult = resolveAnswerState(prev, isCorrect, {
        correctAnswer: SCORING.CORRECT_ANSWER,
        streakBonus: SCORING.STREAK_BONUS,
        streakMax: SCORING.STREAK_MAX
      });

      if (answerResult.reachedZeroLives) {
        return getGameOverState(prev);
      }

      return checkAchievements({ ...prev, ...answerResult });
    });
  }, [checkAchievements, getGameOverState]);

  const useAbility = useCallback((abilityId: string): boolean => {
    let wasApplied = false;

    setState(prev => {
      const ability = abilities.find(a => a.id === abilityId);
      if (!ability) return prev;

      const currentUses = prev.abilityUses[abilityId] || 0;
      if (currentUses <= 0 || prev.mana < ability.cost) return prev;

      wasApplied = true;
      return {
        ...prev,
        mana: prev.mana - ability.cost,
        abilityUses: {
          ...prev.abilityUses,
          [abilityId]: prev.abilityUses[abilityId] - 1
        }
      };
    });

    return wasApplied;
  }, []);

  const resetLevel = useCallback(() => {
    setState(prev => ({
      ...prev,
      lives: 3,
      streak: 0,
      currentLevelCorrect: 0,
      currentLevelIncorrect: 0
    }));
  }, []);


  const handleGameOver = useCallback(() => {
    setState(prev => ({
      ...getGameOverState(prev)
    }));
  }, [getGameOverState]);

  const completeLevel = useCallback((levelId: number, wasPerfect: boolean = false) => {
    const level = levels.find(l => l.id === levelId);
    if (!level) return;

    setState(prev => {
      const total = prev.currentLevelCorrect + prev.currentLevelIncorrect;
      const accuracy = total > 0 ? Math.round((prev.currentLevelCorrect / total) * 100) : 0;
      const mastery = Math.min(100, accuracy + (wasPerfect ? 20 : 0));
      const newUnlockedLevels = [...new Set([...prev.unlockedLevels, levelId + 1])];

      // Unlock boss after level 4
      if (levelId === 4) {
        newUnlockedLevels.push(5);
      }

      const newHighScores = {
        ...prev.highScores,
        [levelId]: Math.max(prev.highScores[levelId] || 0, prev.score)
      };

      const newLevelStats = {
        ...prev.levelStats,
        [levelId]: {
          correct: prev.currentLevelCorrect,
          incorrect: prev.currentLevelIncorrect,
          accuracy,
          mastery
        }
      };

      const newOperationMastery = {
        ...prev.operationMastery,
        [level.operation]: Math.max(prev.operationMastery[level.operation] || 0, mastery)
      };

      const newAchievements = [...prev.achievements];

      // Perfect level achievement
      if (wasPerfect && !newAchievements.includes('perfect_level')) {
        newAchievements.push('perfect_level');
      }

      // Check for operation mastery achievements
      if (mastery >= 100) {
        if (level.operation === 'addition' && !newAchievements.includes('addition_master')) {
          newAchievements.push('addition_master');
        }
        if (level.operation === 'subtraction' && !newAchievements.includes('subtraction_master')) {
          newAchievements.push('subtraction_master');
        }
        if (level.operation === 'multiplication' && !newAchievements.includes('multiplication_master')) {
          newAchievements.push('multiplication_master');
        }
        if (level.operation === 'division' && !newAchievements.includes('division_master')) {
          newAchievements.push('division_master');
        }
      }

      const newState = {
        ...prev,
        unlockedLevels: newUnlockedLevels,
        highScores: newHighScores,
        levelStats: newLevelStats,
        operationMastery: newOperationMastery,
        currentLevel: 0,
        mana: prev.mana + 50,
        achievements: newAchievements,
        isBossUnlocked: levelId === 4
      };

      return newState;
    });
  }, []);

  const completeBoss = useCallback((timeRemaining: number = 0) => {
    setState(prev => {
      const newAchievements = [...prev.achievements];

      // Speed demon achievement
      if (timeRemaining >= 60 && !newAchievements.includes('speed_demon')) {
        newAchievements.push('speed_demon');
      }

      return {
        ...prev,
        isBossUnlocked: false,
        currentLevel: 0,
        score: prev.score + SCORING.BOSS_COMPLETE_BONUS + (prev.lives * SCORING.LIVES_BONUS),
        achievements: newAchievements
      };
    });
  }, []);

  const completeKnowledgeRoom = useCallback(() => {
    setState(prev => ({
      ...prev,
      knowledgeRoomsCompleted: prev.knowledgeRoomsCompleted + 1
    }));
  }, []);

  const setPlayerInfo = useCallback((name: string, avatar: string) => {
    setState(prev => ({
      ...prev,
      playerName: name,
      avatar
    }));
  }, []);

  const getCurrentLevelData = useCallback((): Level | null => {
    if (state.currentLevel === 0) return null;
    return levels.find(l => l.id === state.currentLevel) || null;
  }, [state.currentLevel]);

  const getAbilityData = useCallback((abilityId: string): Ability | undefined => {
    return abilities.find(a => a.id === abilityId);
  }, []);

  const getLevelStats = useCallback((levelId: number): LevelStats => {
    return state.levelStats[levelId] || { correct: 0, incorrect: 0, accuracy: 0, mastery: 0 };
  }, [state.levelStats]);

  const getOverallProgress = useCallback(() => {
    const completed = state.unlockedLevels.length - 1;
    const total = 4; // 4 main levels + boss
    const percentage = Math.round((completed / total) * 100);
    return { completed, total, percentage };
  }, [state.unlockedLevels]);

  const getOperationMastery = useCallback((operation: string): number => {
    return state.operationMastery[operation] || 0;
  }, [state.operationMastery]);

  const setCurrentSubLevel = useCallback((subLevel: number) => {
    setState(prev => ({
      ...prev,
      currentSubLevel: Math.max(1, Math.min(3, subLevel))
    }));
  }, []);

  const contextValue = useMemo(() => ({
    state,
    startLevel,
    answerQuestion,
    useAbility,
    resetLevel,
    completeLevel,
    completeBoss,
    completeKnowledgeRoom,
    setPlayerInfo,
    getCurrentLevelData,
    getAbilityData,
    getLevelStats,
    getOverallProgress,
    getOperationMastery,
    setCurrentSubLevel,
    handleGameOver
  }), [
    state,
    startLevel,
    answerQuestion,
    useAbility,
    resetLevel,
    completeLevel,
    completeBoss,
    completeKnowledgeRoom,
    setPlayerInfo,
    getCurrentLevelData,
    getAbilityData,
    getLevelStats,
    getOverallProgress,
    getOperationMastery,
    setCurrentSubLevel,
    handleGameOver
  ]);

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
