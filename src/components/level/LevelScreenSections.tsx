import React from 'react';
import { AnswerButton, AbilityButton, Feedback, HintDisplay } from '../GameComponents';
import { Ability, Problem } from '../../data/gameData';

interface QuestionDisplayProps {
  problem: Problem;
  showHint: boolean;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ problem, showHint }) => {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl text-center">
      {showHint && problem.hint && (
        <div className="mb-6">
          <HintDisplay hint={problem.hint} />
        </div>
      )}

      <div className="text-6xl font-bold text-gray-800 mb-8">
        {problem.question}
      </div>
    </div>
  );
};

interface AnswerOptionsProps {
  options: number[];
  disabled: boolean;
  onAnswer: (option: number) => void;
}

export const AnswerOptions: React.FC<AnswerOptionsProps> = ({ options, disabled, onAnswer }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      {options.map((option, index) => (
        <AnswerButton
          key={index}
          value={option}
          onClick={() => onAnswer(option)}
          disabled={disabled}
        />
      ))}
    </div>
  );
};

interface AbilityBarProps {
  abilities: string[];
  getAbilityData: (abilityId: string) => Ability | undefined;
  abilityUses: Record<string, number>;
  mana: number;
  onUseAbility: (abilityId: string) => void;
}

export const AbilityBar: React.FC<AbilityBarProps> = ({
  abilities,
  getAbilityData,
  abilityUses,
  mana,
  onUseAbility
}) => {
  return (
    <div className="p-4">
      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-4 gap-2">
          {abilities.map((abilityId) => {
            const ability = getAbilityData(abilityId);
            if (!ability) return null;
            return (
              <AbilityButton
                key={abilityId}
                id={abilityId}
                name={ability.name}
                icon={ability.icon}
                cost={ability.cost}
                usesLeft={abilityUses[abilityId]}
                available={mana >= ability.cost && abilityUses[abilityId] > 0}
                onClick={() => onUseAbility(abilityId)}
              />
            );
          })}
        </div>
        <div className="text-center text-purple-600 text-sm mt-2">
          💎 Maná disponible: {mana}
        </div>
      </div>
    </div>
  );
};

interface FeedbackOverlayProps {
  feedback: 'correct' | 'incorrect' | null;
  correctAnswer: number;
}

export const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({ feedback, correctAnswer }) => {
  if (!feedback) return null;

  return (
    <Feedback
      type={feedback}
      message={feedback === 'incorrect' ? `La respuesta era ${correctAnswer}` : undefined}
    />
  );
};
