import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Level } from '../data/gameData';
import { ProgressBar, Hearts, ScoreDisplay, AnswerButton, Feedback, AbilityButton } from '../components/GameComponents';

interface LevelScreenProps {
  level: Level;
  onComplete: () => void;
  onKnowledge: () => void;
}

export const LevelScreen: React.FC<LevelScreenProps> = ({ level, onComplete, onKnowledge }) => {
  const { state, answerQuestion, useAbility: activateAbility, getAbilityData } = useGame();
  const [currentProblem, setCurrentProblem] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [multiplierActive, setMultiplierActive] = useState(false);
  const [shieldActive, setShieldActive] = useState(false);

  const problem = level.problems[currentProblem];
  const isComplete = currentProblem >= level.problems.length;

  useEffect(() => {
    // Auto-enable multiplier hint could go here
  }, [state.mana, state.abilityUses.multiplier, multiplierActive]);

  const handleAnswer = (answer: number) => {
    if (feedback !== null) return;

    setSelectedAnswer(answer);
    const isCorrect = answer === problem.answer;

    if (isCorrect) {
      setFeedback('correct');
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
        answerQuestion(true);
      } else {
        setFeedback('incorrect');
        answerQuestion(false);
      }
    }

    setTimeout(() => {
      setFeedback(null);
      setSelectedAnswer(null);

      if (!isCorrect && state.lives <= 1 && !shieldActive) {
        return;
      }

      if (isCorrect || (!shieldActive && state.lives > 0)) {
        if (currentProblem < level.problems.length - 1) {
          setCurrentProblem(prev => prev + 1);
        } else {
          onComplete();
        }
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
          <div className="bg-white rounded-3xl p-8 shadow-xl text-center">
            <div className="text-6xl font-bold text-gray-800 mb-8">
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
          <div className="text-center text-purple-600 text-sm mt-2">
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
