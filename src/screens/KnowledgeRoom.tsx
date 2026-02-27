import React, { useState } from 'react';
import { Level } from '../data/gameData';

interface KnowledgeRoomProps {
  level: Level;
  onComplete: () => void;
}

export const KnowledgeRoom: React.FC<KnowledgeRoomProps> = ({ level, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const { knowledge } = level;
  const question = knowledge.miniQuestions[currentQuestion];

  const handleAnswer = (answerIndex: number) => {
    if (showResult) return;

    setSelectedAnswer(answerIndex);
    setShowResult(true);

    setTimeout(() => {
      if (currentQuestion < knowledge.miniQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        onComplete();
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen p-4 flex items-center justify-center" style={{ backgroundColor: level.bgColor }}>
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">📜</div>
          <h1 className="text-2xl font-bold" style={{ color: level.color }}>
            Sala del Conocimiento
          </h1>
          <p className="text-gray-600">{level.name}</p>
        </div>

        {/* Scroll Container */}
        <div className="bg-amber-50 rounded-3xl shadow-2xl overflow-hidden">
          {/* Parchment Effect */}
          <div className="bg-gradient-to-b from-amber-100 to-amber-200 p-6">
            {/* Title */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-amber-900" style={{ fontFamily: 'serif' }}>
                {knowledge.title}
              </h2>
            </div>

            {/* Content */}
            <div className="bg-white/80 rounded-2xl p-4 mb-6">
              <p className="text-gray-700 leading-relaxed text-sm">
                {knowledge.content}
              </p>
            </div>

            {/* Interactive Quiz */}
            <div className="mt-6">
              <div className="text-center mb-4">
                <span className="text-sm font-medium text-amber-700">
                  Pregunta {currentQuestion + 1} de {knowledge.miniQuestions.length}
                </span>
              </div>

              <div className="bg-amber-200 rounded-2xl p-4">
                <h3 className="font-bold text-amber-900 mb-4 text-center">
                  {question.question}
                </h3>

                <div className="space-y-2">
                  {question.options.map((option, index) => {
                    let buttonClass = "w-full p-3 rounded-xl font-medium transition-all duration-200 ";

                    if (showResult) {
                      if (index === question.correctAnswer) {
                        buttonClass += "bg-green-500 text-white";
                      } else if (index === selectedAnswer) {
                        buttonClass += "bg-red-400 text-white";
                      } else {
                        buttonClass += "bg-white/50 text-gray-600";
                      }
                    } else {
                      buttonClass += "bg-white hover:bg-amber-50 text-amber-900";
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        disabled={showResult}
                        className={buttonClass}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                {showResult && (
                  <div className="mt-4 text-center">
                    {selectedAnswer === question.correctAnswer ? (
                      <span className="text-green-600 font-bold">✅ ¡Correcto!</span>
                    ) : (
                      <span className="text-red-600 font-bold">
                        ❌ La respuesta era: {question.options[question.correctAnswer]}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          {!showResult && (
            <p>Responde correctamente para continuar</p>
          )}
        </div>
      </div>
    </div>
  );
};
