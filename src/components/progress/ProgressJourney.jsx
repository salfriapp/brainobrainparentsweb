import { useTranslation } from 'react-i18next'

/**
 * Progress Journey visualization
 *
 * LBOB (junior): 8 level stops, 12 sessions between each stop
 *   Visual: newborn baby → 6-year-old child
 *   Images: /assets/progress/lbob-stop-{1..8}.png  (level milestone images)
 *           /assets/progress/lbob-step-{1..12}.png  (session progress icons)
 *
 * BOB (senior): 10 level stops, 12 sessions between each stop
 *   Visual: 6-year-old child → grown teenager
 *   Images: /assets/progress/bob-stop-{1..10}.png
 *           /assets/progress/bob-step-{1..12}.png
 *
 * Completed = full color, Future = greyed out
 */

// Placeholder SVG icons for progress steps (replace with real images later)
function StepIcon({ index, completed, current }) {
  const size = 28
  const opacity = completed || current ? 1 : 0.25
  const fill = completed ? '#2D7A2E' : current ? '#F7941D' : '#d1d5db'

  return (
    <div
      className="flex items-center justify-center transition-all"
      style={{ opacity }}
      title={`Session ${index}`}
    >
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="12" fill={fill} />
        {completed && (
          <path d="M9 14l3 3 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        )}
        {current && (
          <circle cx="14" cy="14" r="4" fill="white" />
        )}
      </svg>
    </div>
  )
}

// Level stop milestone marker
function StopMarker({ levelNumber, levelName, completed, current }) {
  const opacity = completed || current ? 1 : 0.3
  const borderColor = completed ? 'border-bb-green' : current ? 'border-bb-orange' : 'border-gray-300'
  const bgColor = completed ? 'bg-bb-green-lt' : current ? 'bg-bb-orange-lt' : 'bg-gray-100'
  const textColor = completed ? 'text-bb-green' : current ? 'text-bb-orange' : 'text-gray-400'

  return (
    <div className="flex flex-col items-center" style={{ opacity }}>
      <div className={`w-14 h-14 rounded-full border-3 ${borderColor} ${bgColor} flex items-center justify-center transition-all`}>
        <span className={`text-xl font-bold ${textColor}`}>{levelNumber}</span>
      </div>
      <div className={`mt-1.5 text-center ${textColor}`}>
        <p className="text-[10px] font-bold leading-tight">{levelName || `L${levelNumber}`}</p>
        {completed && <span className="text-[9px]">✓</span>}
        {current && <span className="text-[9px] font-bold">●</span>}
      </div>
    </div>
  )
}

export default function ProgressJourney({ programType, levels, currentLevelNumber, completedSessionsInCurrentLevel }) {
  const { t } = useTranslation()
  const totalStops = levels.length
  const sessionsPerLevel = 12

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="min-w-[800px] px-4">
        {/* Journey Path */}
        {levels.map((level, levelIdx) => {
          const isCompleted = level.level_number < currentLevelNumber
          const isCurrent = level.level_number === currentLevelNumber
          const isFuture = level.level_number > currentLevelNumber

          return (
            <div key={level.id || levelIdx} className="mb-6">
              {/* Level stop marker */}
              <div className="flex items-center gap-2 mb-3">
                <StopMarker
                  levelNumber={level.level_number}
                  levelName={level.level_name}
                  completed={isCompleted}
                  current={isCurrent}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-sm font-semibold ${isCompleted ? 'text-bb-green' : isCurrent ? 'text-bb-orange' : 'text-gray-400'}`}>
                      {t('progress.level')} {level.level_number}: {level.level_name}
                    </span>
                    {isCompleted && (
                      <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">
                        {t('progress.completed')}
                      </span>
                    )}
                    {isCurrent && (
                      <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full font-medium">
                        {t('progress.current')}
                      </span>
                    )}
                  </div>

                  {/* Session progress dots */}
                  <div className="flex items-center gap-1 mt-2">
                    {Array.from({ length: sessionsPerLevel }).map((_, sessionIdx) => {
                      const sessionNum = sessionIdx + 1
                      let stepCompleted = false
                      let stepCurrent = false

                      if (isCompleted) {
                        stepCompleted = true
                      } else if (isCurrent) {
                        stepCompleted = sessionNum <= completedSessionsInCurrentLevel
                        stepCurrent = sessionNum === completedSessionsInCurrentLevel + 1
                      }

                      return (
                        <StepIcon
                          key={sessionIdx}
                          index={sessionNum}
                          completed={stepCompleted}
                          current={stepCurrent}
                        />
                      )
                    })}

                    {/* Progress text for current level */}
                    {isCurrent && (
                      <span className="ml-2 text-xs text-gray-500 font-medium whitespace-nowrap">
                        {completedSessionsInCurrentLevel}/{sessionsPerLevel} {t('progress.classesCompleted')}
                      </span>
                    )}
                  </div>

                  {/* Progress bar for this level */}
                  <div className="mt-2 w-full max-w-md">
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className={`rounded-full h-1.5 transition-all ${isCompleted ? 'bg-bb-green' : isCurrent ? 'bg-bb-orange' : 'bg-gray-200'}`}
                        style={{
                          width: isCompleted
                            ? '100%'
                            : isCurrent
                              ? `${(completedSessionsInCurrentLevel / sessionsPerLevel) * 100}%`
                              : '0%',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Final destination */}
        <div className="flex items-center gap-3 mt-2">
          <div className={`w-14 h-14 rounded-full border-3 flex items-center justify-center ${
            currentLevelNumber > totalStops
              ? 'border-bb-green bg-bb-green-lt'
              : 'border-gray-300 bg-gray-100 opacity-30'
          }`}>
            <span className="text-lg">🎓</span>
          </div>
          <span className={`text-sm font-bold ${currentLevelNumber > totalStops ? 'text-bb-green' : 'text-gray-400'}`}>
            {programType === 'junior' ? 'LBOB Graduate!' : 'BOB Graduate!'}
          </span>
        </div>
      </div>
    </div>
  )
}
