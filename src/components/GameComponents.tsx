import React from 'react';

// Enhanced SVG Icons
const Icons = {
  heart: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  ),
  heartEmpty: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  lightning: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <path d="M5 13l4 4L19 7"/>
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <path d="M6 18L18 6M6 6l12 12"/>
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  ),
  trophy: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 15c-1.1 0-2-.9-2-2V8h4v5c0 1.1-.9 2-2 2zm-5 0c-1.1 0-2-.9-2-2V5h4v8c0 1.1-.9 2-2 2zm10 0c-1.1 0-2-.9-2-2V3h-2v10h4v-1c0-1.1-.9-2-2-2zM6 15c-1.1 0-2-.9-2-2V7H2v6c0 1.1.9 2 2 2h2z"/>
    </svg>
  ),
  fire: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 23c-4.97 0-9-3.58-9-8 0-2.52.86-4.77 2.22-6.47L7 6.4C5.26 8.48 4 11.3 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8c0-2.7-1.26-5.52-3.22-7.6l-1.22 2.13C16.14 10.23 17 12.48 17 15c0 4.42-4.03 8-9 8z"/>
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 6v6l4 2"/>
    </svg>
  ),
  chevronRight: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <path d="M9 18l6-6-6-6"/>
    </svg>
  ),
  hint: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 017 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/>
    </svg>
  ),
  crown: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
    </svg>
  ),
  book: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
    </svg>
  ),
  minus: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M19 13H5v-2h14v2z"/>
    </svg>
  ),
  multiply: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>
  ),
  divide: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M19 13H5v-2h14v2zM12 3v2m0 14v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"/>
    </svg>
  ),
  target: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
    </svg>
  ),
  medal: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-11h4v4h-4V9zm0 6h4v4h-4v-4z"/>
    </svg>
  )
};

interface ProgressBarProps {
  current: number;
  total: number;
  color?: string;
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  color = "#6366f1",
  showLabel = true
}) => {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color }}>
          <span>Progreso</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: color
          }}
        />
      </div>
    </div>
  );
};

interface HeartsProps {
  lives: number;
  maxLives?: number;
}

export const Hearts: React.FC<HeartsProps> = ({ lives, maxLives = 3 }) => {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: maxLives }).map((_, index) => (
        <div
          key={index}
          className={`w-7 h-7 transition-all duration-300 ${
            index < lives ? 'text-red-500' : 'text-gray-300'
          }`}
        >
          {index < lives ? Icons.heart : Icons.heartEmpty}
        </div>
      ))}
    </div>
  );
};

interface ManaBarProps {
  mana: number;
  maxMana?: number;
}

export const ManaBar: React.FC<ManaBarProps> = ({ mana, maxMana = 200 }) => {
  const percentage = Math.min((mana / maxMana) * 100, 100);

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs font-semibold mb-1.5 text-purple-700 uppercase tracking-wider">
        <span className="flex items-center gap-1">
          <div className="w-3 h-3 text-purple-500">{Icons.star}</div>
          Maná
        </span>
        <span>{mana}/{maxMana}</span>
      </div>
      <div className="w-full h-2.5 bg-purple-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${percentage}%`,
            backgroundColor: '#8b5cf6'
          }}
        />
      </div>
    </div>
  );
};

interface ScoreDisplayProps {
  score: number;
  streak?: number;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, streak = 0 }) => {
  return (
    <div className="text-right">
      <div className="text-xl font-bold text-amber-600">
        {score.toLocaleString()}
        <span className="text-xs font-normal text-amber-500 ml-1">pts</span>
      </div>
      {streak > 0 && (
        <div className="flex items-center justify-end gap-1.5 text-xs font-semibold text-orange-500">
          <div className="w-3.5 h-3.5">{Icons.fire}</div>
          <span>Racha: {streak}</span>
        </div>
      )}
    </div>
  );
};

interface AbilityButtonProps {
  id?: string;
  name: string;
  icon: React.ReactNode;
  cost: number;
  usesLeft: number;
  available: boolean;
  onClick: () => void;
  color?: string;
}

export const AbilityButton: React.FC<AbilityButtonProps> = ({
  id,
  name,
  icon,
  cost,
  usesLeft,
  available,
  onClick,
  color = '#8b5cf6'
}) => {
  return (
    <button
      id={id}
      onClick={onClick}
      disabled={!available}
      className={`
        flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200
        ${available
          ? 'bg-white border-2 border-purple-200 hover:border-purple-400 hover:scale-105 shadow-md active:scale-95'
          : 'bg-gray-50 border-2 border-gray-100 opacity-40 cursor-not-allowed'
        }
      `}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center mb-1"
        style={{
          backgroundColor: available ? color : '#e5e7eb',
          color: available ? 'white' : '#9ca3af'
        }}
      >
        {icon}
      </div>
      <span className="text-[10px] font-semibold text-gray-700">{name}</span>
      <span className="text-[9px]" style={{ color: available ? color : '#9ca3af' }}>
        {cost}
      </span>
      <span className="text-[9px] text-gray-400">x{usesLeft}</span>
    </button>
  );
};

interface AnswerButtonProps {
  value: number;
  onClick: () => void;
  disabled?: boolean;
}

export const AnswerButton: React.FC<AnswerButtonProps> = ({
  value,
  onClick,
  disabled = false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full py-4 px-6 rounded-xl text-xl font-bold transition-all duration-200 border-2
        ${disabled
          ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
          : 'bg-white border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 hover:scale-[1.02] shadow-md active:scale-95'
        }
      `}
    >
      {value}
    </button>
  );
};

interface FeedbackProps {
  type: 'correct' | 'incorrect' | null;
  message?: string;
}

export const Feedback: React.FC<FeedbackProps> = ({ type, message }) => {
  if (!type) return null;

  return (
    <div
      className={`
        fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
        px-8 py-5 rounded-2xl text-xl font-bold animate-bounce z-50 shadow-xl
        ${type === 'correct'
          ? 'bg-green-500 text-white'
          : 'bg-red-500 text-white'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <div className="w-7 h-7">
          {type === 'correct' ? Icons.check : Icons.x}
        </div>
        <span>{type === 'correct' ? '¡Correcto!' : 'Incorrecto'}</span>
      </div>
      {message && type === 'incorrect' && (
        <div className="text-sm font-normal mt-2 opacity-90">
          {message}
        </div>
      )}
    </div>
  );
};

interface HintDisplayProps {
  hint: string;
}

export const HintDisplay: React.FC<HintDisplayProps> = ({ hint }) => {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 animate-fade-in">
      <div className="flex items-start gap-2">
        <div className="w-5 h-5 text-amber-500 flex-shrink-0">{Icons.hint}</div>
        <p className="text-sm text-amber-800 font-medium">{hint}</p>
      </div>
    </div>
  );
};

interface LevelCardProps {
  level: {
    id: number;
    name: string;
    realm: string;
    operation: string;
    icon: React.ReactNode;
    color: string;
  };
  unlocked: boolean;
  completed: boolean;
  mastery?: number;
  highScore?: number;
  onClick: () => void;
}

export const LevelCard: React.FC<LevelCardProps> = ({
  level,
  unlocked,
  completed,
  mastery = 0,
  highScore,
  onClick
}) => {

  return (
    <button
      onClick={onClick}
      disabled={!unlocked}
      className={`
        w-full p-4 rounded-2xl border-2 transition-all duration-300 text-left
        ${unlocked
          ? 'bg-white hover:scale-[1.02] shadow-lg cursor-pointer'
          : 'bg-gray-50 cursor-not-allowed opacity-60'
        }
      `}
      style={{
        borderColor: unlocked ? level.color : '#e5e7eb'
      }}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center"
          style={{
            backgroundColor: unlocked ? `${level.color}15` : '#f3f4f6'
          }}
        >
          <div
            className="w-8 h-8"
            style={{ color: unlocked ? level.color : '#9ca3af' }}
          >
            {unlocked ? level.icon : Icons.lock}
          </div>
        </div>
        <div className="flex-1">
          <div
            className="font-bold text-base"
            style={{ color: unlocked ? level.color : '#9ca3af' }}
          >
            {level.name}
          </div>
          <div className="text-xs text-gray-500 mt-0.5 font-medium">
            {level.realm}
          </div>

          {unlocked && mastery > 0 && (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${mastery}%`,
                      backgroundColor: level.color
                    }}
                  />
                </div>
                <span className="text-[10px] font-bold" style={{ color: level.color }}>
                  {mastery}%
                </span>
              </div>
            </div>
          )}

          {completed && highScore !== undefined && (
            <div className="text-xs text-amber-600 mt-1.5 font-semibold flex items-center gap-1">
              <div className="w-3 h-3">{Icons.trophy}</div>
              Mejor: {highScore} pts
            </div>
          )}
        </div>
        <div className="text-right">
          {completed ? (
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center" style={{ color: '#22c55e' }}>
              {Icons.check}
            </div>
          ) : unlocked ? (
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center" style={{ color: '#9ca3af' }}>
              {Icons.chevronRight}
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center" style={{ color: '#9ca3af' }}>
              {Icons.lock}
            </div>
          )}
        </div>
      </div>
    </button>
  );
};

interface AchievementBadgeProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  id,
  name,
  description,
  icon,
  unlocked
}) => {
  return (
    <div
      id={id}
      className={`
        flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-300
        ${unlocked
          ? 'bg-amber-50 border-amber-300 shadow-md'
          : 'bg-gray-50 border-gray-200 opacity-50'
        }
      `}
    >
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
          unlocked ? 'bg-amber-400 text-white' : 'bg-gray-200 text-gray-400'
        }`}
      >
        {typeof icon === 'string' ? icon : icon}
      </div>
      <div className="flex-1">
        <div className={`font-bold text-sm ${unlocked ? 'text-amber-800' : 'text-gray-500'}`}>
          {name}
        </div>
        <div className={`text-xs ${unlocked ? 'text-amber-600' : 'text-gray-400'}`}>
          {description}
        </div>
      </div>
      {unlocked && (
        <div className="w-5 h-5 text-green-500">{Icons.check}</div>
      )}
    </div>
  );
};

interface MasteryIndicatorProps {
  operation: string;
  mastery: number;
  color: string;
}

export const MasteryIndicator: React.FC<MasteryIndicatorProps> = ({ operation, mastery, color }) => {
  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold"
        style={{ backgroundColor: `${color}15`, color }}
      >
        {operation.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1">
        <div className="text-xs text-gray-500 uppercase tracking-wide">Dominio</div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${mastery}%`,
                backgroundColor: color
              }}
            />
          </div>
          <span className="text-sm font-bold" style={{ color }}>{mastery}%</span>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color = '#6366f1' }) => {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-5 h-5" style={{ color }}>{icon}</div>
        <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
      </div>
      <div className="text-2xl font-bold" style={{ color }}>{value}</div>
    </div>
  );
};

// Re-export Icons
export { Icons };
