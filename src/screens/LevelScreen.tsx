import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Level } from '../data/gameData';
import { ProgressBar, Hearts, ScoreDisplay } from '../components/GameComponents';
import { QuestionDisplay, AnswerOptions, AbilityBar, FeedbackOverlay } from '../components/level/LevelScreenSections';
import { CORRECT_ANSWER_POINTS, FEEDBACK_TIMEOUT_MS } from '../constants/gameConstants';

interface LevelScreenProps {
  level: Level;
  onComplete: () => void;
  onKnowledge: () => void;
}

export const LevelScreen: React.FC<LevelScreenProps> = ({ level, onComplete, onKnowledge }) => {
  const { state, answerQuestion, useAbility: activateAbility, getAbilityData, setCurrentSubLevel } = useGame();
  const [currentProblem, setCurrentProblem] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [pendingResolution, setPendingResolution] = useState<{
    isCorrect: boolean;
    shieldWasActive: boolean;
    livesBeforeAnswer: number;
    problemIndex: number;
    subLevelAtAnswer: number;
  } | null>(null);
  const [multiplierActive, setMultiplierActive] = useState(false);
  const [shieldActive, setShieldActive] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const problem = level.problems[currentProblem];
  const isComplete = currentProblem >= level.problems.length;
  const exercisesPerSubLevel = Math.ceil(level.problems.length / 3);

  useEffect(() => {
    // Auto-enable multiplier hint could go here
  }, [state.mana, state.abilityUses.multiplier, multiplierActive]);

  useEffect(() => {
    if (!pendingResolution) return;

    const timeoutId = window.setTimeout(() => {
      setFeedback(null);
      setShowHint(false);

      if (!pendingResolution.isCorrect && pendingResolution.livesBeforeAnswer <= 1 && !pendingResolution.shieldWasActive) {
        setPendingResolution(null);
        return;
      }

      if (pendingResolution.isCorrect || (!pendingResolution.shieldWasActive && pendingResolution.livesBeforeAnswer > 0)) {
        const answeredCount = pendingResolution.problemIndex + 1;
        const completedSubLevel = answeredCount % exercisesPerSubLevel === 0 || answeredCount === level.problems.length;

        if (completedSubLevel) {
          if (pendingResolution.subLevelAtAnswer < 3) {
            setCurrentSubLevel(pendingResolution.subLevelAtAnswer + 1);
          } else {
            setPendingResolution(null);
            onComplete();
            return;
          }
        }

        if (pendingResolution.problemIndex < level.problems.length - 1) {
          setCurrentProblem(prev => prev + 1);
        } else {
          onComplete();
        }
      }

      setPendingResolution(null);
    }, FEEDBACK_TIMEOUT_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [exercisesPerSubLevel, level.problems.length, onComplete, pendingResolution, setCurrentSubLevel]);

  const handleAnswer = (answer: number) => {
    if (feedback !== null) return;

    const isCorrect = answer === problem.answer;
    const shieldWasActive = shieldActive;
    const livesBeforeAnswer = state.lives;
    const effectiveCorrect = isCorrect || shieldWasActive;

    if (isCorrect) {
      setFeedback('correct');
      setShowHint(false);
      let points = CORRECT_ANSWER_POINTS;
      if (multiplierActive) {
        points *= 2;
        setMultiplierActive(false);
      }
      answerQuestion(true);
    } else {
      if (shieldActive) {
        setShieldActive(false);
        setFeedback('correct');
        setShowHint(false);
        answerQuestion(true);
      } else {
        setFeedback('incorrect');
        // Show hint after incorrect answer if available
        if (problem.hint) {
          setShowHint(true);
        }
        answerQuestion(false);
      }
    }

    setPendingResolution({
      isCorrect: effectiveCorrect,
      shieldWasActive,
      livesBeforeAnswer,
      problemIndex: currentProblem,
      subLevelAtAnswer: state.currentSubLevel
    });
  };

  const handleUseAbility = (abilityId: string) => {
    const success = activateAbility(abilityId);
    if (success) {
      if (abilityId === 'multiplier') {
        setMultiplierActive(true);
      } else if (abilityId === 'shield') {
        setShieldActive(true);
      }
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: level.bgColor }}>
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-2xl">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: level.color }}>
            ¡Nivel Completado!
          </h2>
          <p className="text-gray-600 mb-6">
            Has dominado las operaciones de {level.operation} en el {level.name}!
          </p>
          <div className="bg-amber-50 rounded-xl p-4 mb-6">
            <div className="text-amber-600 font-bold text-lg">
              +{state.score.toLocaleString()} puntos
            </div>
          </div>
          <button
            onClick={onKnowledge}
            className="w-full py-4 rounded-xl text-white font-bold text-lg"
            style={{ backgroundColor: level.color }}
          >
            📚 Entrar a la Sala del Conocimiento
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: level.bgColor }}>
      {/* Header */}
      <div className="p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{level.icon}</span>
              <span className="font-bold" style={{ color: level.color }}>
                {level.name}
              </span>
            </div>
            <Hearts lives={state.lives} />
          </div>

          <ProgressBar
            current={currentProblem + 1}
            total={level.problems.length}
            color={level.color}
          />

          <div className="flex justify-between items-center mt-4">
            <ScoreDisplay score={state.score} streak={state.streak} />
            <div className="text-sm font-medium" style={{ color: level.color }}>
              Pregunta {currentProblem + 1}/{level.problems.length}
            </div>
          </div>
        </div>
      </div>

      {/* Shield Indicator */}
      {shieldActive && (
        <div className="px-4 mb-2">
          <div className="max-w-md mx-auto bg-blue-100 border-2 border-blue-400 rounded-xl p-2 text-center">
            <span className="text-blue-600 font-bold">🛡️ Escudo Activo</span>
          </div>
        </div>
      )}

      {/* Multiplier Indicator */}
      {multiplierActive && (
        <div className="px-4 mb-2">
          <div className="max-w-md mx-auto bg-amber-100 border-2 border-amber-400 rounded-xl p-2 text-center">
            <span className="text-amber-600 font-bold">⭐ x2 Puntos Activado</span>
          </div>
        </div>
      )}

      {/* Question Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <QuestionDisplay
            problem={problem}
            showHint={showHint}
          />
          <AnswerOptions
            options={problem.options}
            disabled={feedback !== null}
            onAnswer={handleAnswer}
          />
        </div>
      </div>

      <AbilityBar
        abilities={['shield', 'recharge', 'multiplier', 'extratime']}
        getAbilityData={getAbilityData}
        abilityUses={state.abilityUses}
        mana={state.mana}
        onUseAbility={handleUseAbility}
      />

      <FeedbackOverlay
        feedback={feedback}
        correctAnswer={problem.answer}
      />
    </div>
  );
};
