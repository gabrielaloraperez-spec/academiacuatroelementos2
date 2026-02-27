import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { bossProblems } from '../data/gameData';
import { ProgressBar, Hearts, ScoreDisplay, AnswerButton, Feedback, AbilityButton, HintDisplay } from '../components/GameComponents';
import { CORRECT_ANSWER_POINTS, FEEDBACK_TIMEOUT_MS } from '../constants/gameConstants';

interface BossScreenProps {
  onComplete: () => void;
  onGameOver: () => void;
}

const BOSS_TIME = 120; // seconds

export const BossScreen: React.FC<BossScreenProps> = ({ onComplete, onGameOver }) => {
  const { state, answerQuestion, useAbility: activateAbility, getAbilityData } = useGame();
  const [currentProblem, setCurrentProblem] = useState(0);
  const [timeLeft, setTimeLeft] = useState(BOSS_TIME);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [multiplierActive, setMultiplierActive] = useState(false);
  const [shieldActive, setShieldActive] = useState(false);
  const [timeFrozen, setTimeFrozen] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const problem = bossProblems[currentProblem];
  const isComplete = currentProblem >= bossProblems.length;

  // Timer
  useEffect(() => {
    if (timeFrozen || timeLeft <= 0 || isComplete) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeFrozen, timeLeft, isComplete, onGameOver]);

  // Unfreeze time after 5 seconds
  useEffect(() => {
    if (timeFrozen) {
      const timer = setTimeout(() => {
        setTimeFrozen(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [timeFrozen]);

  const handleAnswer = (answer: number) => {
    if (feedback !== null) return;

    const isCorrect = answer === problem.answer;

    if (isCorrect) {
      setFeedback('correct');
      setShowHint(false);
      let points = CORRECT_ANSWER_POINTS;
      if (multiplierActive) {
        points *= 2;
        setMultiplierActive(false);
      }
      answerQuestion(true, true);
    } else {
      if (shieldActive) {
        setShieldActive(false);
        setFeedback('correct');
        setShowHint(false);
        answerQuestion(true, true);
      } else {
        setFeedback('incorrect');
        // Show hint after incorrect answer if available
        if (problem.hint) {
          setShowHint(true);
        }
        answerQuestion(false, true);
      }
    }

    setTimeout(() => {
      setFeedback(null);
      setShowHint(false);

      if (currentProblem < bossProblems.length - 1) {
        setCurrentProblem(prev => prev + 1);
      } else {
        onComplete();
      }
    }, FEEDBACK_TIMEOUT_MS);
  };

  const handleUseAbility = (abilityId: string) => {
    const success = activateAbility(abilityId);
    if (success) {
      if (abilityId === 'multiplier') {
        setMultiplierActive(true);
      } else if (abilityId === 'shield') {
        setShieldActive(true);
      } else if (abilityId === 'extratime') {
        setTimeFrozen(true);
        setTimeLeft(prev => Math.min(prev + 5, BOSS_TIME));
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-red-900 via-purple-900 to-slate-900">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-2xl">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold text-amber-600 mb-2">
            ¡Has Derrotado al Jefe!
          </h2>
          <p className="text-gray-600 mb-6">
            ¡Felicidades! Has completado todos los reinos y dominado las matemáticas.
          </p>
          <div className="bg-amber-50 rounded-xl p-4 mb-6">
            <div className="text-amber-600 font-bold text-lg">
              Puntuación Final: {state.score.toLocaleString()}
            </div>
            <div className="text-gray-500 text-sm mt-1">
              ❤️ Vidas restantes: {state.lives}
            </div>
            <div className="text-gray-500 text-sm">
              ⏱️ Tiempo restante: {formatTime(timeLeft)}
            </div>
          </div>
          <button
            onClick={onComplete}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg"
          >
            🎮 Volver al Mapa
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-red-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl">👑</span>
              <span className="font-bold text-red-400">
                Torre del Tiempo
              </span>
            </div>
            <Hearts lives={state.lives} />
          </div>

          {/* Timer */}
          <div className={`text-center py-2 rounded-xl mb-4 ${timeLeft <= 30 ? 'bg-red-600' : 'bg-purple-800'}`}>
            <div className="text-white font-bold text-2xl">
              ⏱️ {formatTime(timeLeft)}
            </div>
            {timeFrozen && (
              <div className="text-cyan-300 text-sm font-bold">
                ⏸️ TIEMPO CONGELADO
              </div>
            )}
          </div>

          <ProgressBar
            current={currentProblem + 1}
            total={bossProblems.length}
            color="#ef4444"
          />

          <div className="flex justify-between items-center mt-4">
            <ScoreDisplay score={state.score} streak={state.streak} />
            <div className="text-sm font-medium text-red-400">
              Pregunta {currentProblem + 1}/{bossProblems.length}
            </div>
          </div>
        </div>
      </div>

      {/* Shield Indicator */}
      {shieldActive && (
        <div className="px-4 mb-2">
          <div className="max-w-md mx-auto bg-blue-900/50 border-2 border-blue-400 rounded-xl p-2 text-center">
            <span className="text-blue-400 font-bold">🛡️ Escudo Activo</span>
          </div>
        </div>
      )}

      {/* Multiplier Indicator */}
      {multiplierActive && (
        <div className="px-4 mb-2">
          <div className="max-w-md mx-auto bg-amber-900/50 border-2 border-amber-400 rounded-xl p-2 text-center">
            <span className="text-amber-400 font-bold">⭐ x2 Puntos Activado</span>
          </div>
        </div>
      )}

      {/* Question Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl text-center">
            {/* Hint Display */}
            {showHint && problem.hint && (
              <div className="mb-6">
                <HintDisplay hint={problem.hint} />
              </div>
            )}

            <div className="text-5xl font-bold text-gray-800 mb-8">
              {problem.question}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {problem.options.map((option, index) => (
                <AnswerButton
                  key={index}
                  value={option}
                  onClick={() => handleAnswer(option)}
                  disabled={feedback !== null}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Abilities */}
      <div className="p-4">
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-4 gap-2">
            {['shield', 'recharge', 'multiplier', 'extratime'].map((abilityId) => {
              const ability = getAbilityData(abilityId);
              if (!ability) return null;
              return (
                <AbilityButton
                  key={abilityId}
                  id={abilityId}
                  name={ability.name}
                  icon={ability.icon}
                  cost={ability.cost}
                  usesLeft={state.abilityUses[abilityId]}
                  available={state.mana >= ability.cost && state.abilityUses[abilityId] > 0}
                  onClick={() => handleUseAbility(abilityId)}
                />
              );
            })}
          </div>
          <div className="text-center text-purple-400 text-sm mt-2">
            💎 Maná disponible: {state.mana}
          </div>
        </div>
      </div>

      {/* Feedback Overlay */}
      {feedback && (
        <Feedback
          type={feedback}
          message={feedback === 'incorrect' ? `La respuesta era ${problem.answer}` : undefined}
        />
      )}
    </div>
  );
};
