import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { TrendingUp, Award, BookOpen } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import Card, { CardHeader, CardBody } from '../../components/ui/Card'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import ProgressJourney from '../../components/progress/ProgressJourney'
import { levelImageUrl, hideOnMissing } from '../../lib/levelImages'

export default function ProgressPage() {
  const { t } = useTranslation()
  const [selectedChild, setSelectedChild] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['parent-progress'],
    queryFn: () => api.get('/progress').then((r) => r.data),
  })

  if (isLoading) return <PageLoader />

  const progressData = data?.data || {}
  const children = progressData.children || []

  const activeChild = selectedChild
    ? children.find((c) => c.id === selectedChild)
    : children[0]

  // Calculate overall progress
  const calcOverall = (child) => {
    if (!child) return 0
    const totalLevels = child.levels?.length || 0
    const sessionsPerLevel = 12
    const totalSessions = totalLevels * sessionsPerLevel
    const completedLevels = (child.current_level_number || 1) - 1
    const completedSessions = completedLevels * sessionsPerLevel + (child.completed_sessions_current || 0)
    return totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('progress.title')}</h1>
        <p className="text-sm text-gray-500 mt-1">{t('progress.subtitle')}</p>
      </div>

      {/* Child Selector */}
      {children.length > 1 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('progress.selectChild')}</label>
          <div className="flex gap-2">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => setSelectedChild(child.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeChild?.id === child.id
                    ? 'bg-bb-green text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-bb-green'
                }`}
              >
                {child.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeChild && (
        <>
          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardBody>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t('progress.level')}</p>
                    <p className="text-lg font-bold text-gray-900">
                      {activeChild.current_level_number || 1} {t('progress.of')} {activeChild.levels?.length || 0}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t('progress.overallProgress')}</p>
                    <p className="text-lg font-bold text-gray-900">{calcOverall(activeChild)}%</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                    <Award className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t('dashboard.currentLevel')}</p>
                    <p className="text-lg font-bold text-gray-900">{activeChild.current_level_name || '—'}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Current level hero image + thumbnail strip */}
          {activeChild.program_id && (
            <Card className="mb-6">
              <CardBody>
                {(() => {
                  const currentUrl = levelImageUrl(activeChild.program_id, activeChild.current_level_number)
                  return currentUrl ? (
                    <div className="flex items-center justify-center mb-4">
                      <img
                        src={currentUrl}
                        alt={activeChild.current_level_name}
                        onError={hideOnMissing}
                        className="max-h-64 w-auto object-contain rounded-lg"
                      />
                    </div>
                  ) : null
                })()}

                <div className="flex gap-2 overflow-x-auto pb-2">
                  {(activeChild.levels || []).map((lvl) => {
                    const thumb = levelImageUrl(activeChild.program_id, lvl.level_number)
                    if (!thumb) return null
                    const isCurrent = lvl.level_number === activeChild.current_level_number
                    const isPast    = lvl.level_number <  activeChild.current_level_number
                    return (
                      <div
                        key={lvl.id}
                        title={lvl.level_name}
                        className={`flex-shrink-0 rounded-md p-1 border-2 transition-all ${
                          isCurrent
                            ? 'border-bb-orange shadow-md scale-105'
                            : isPast
                              ? 'border-bb-green opacity-70'
                              : 'border-gray-200 opacity-50 grayscale'
                        }`}
                      >
                        <img
                          src={thumb}
                          alt={lvl.level_name}
                          onError={hideOnMissing}
                          className="h-16 w-16 object-contain"
                        />
                        <p className="text-[10px] text-center text-gray-600 mt-1">
                          {lvl.level_name || `Level ${lvl.level_number}`}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </CardBody>
            </Card>
          )}

          {/* Visual Progress Journey */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gray-400" />
                <h2 className="text-sm font-semibold text-gray-900">
                  {activeChild.program_type === 'junior' ? 'Little Brainobrain (LBOB)' : 'Brainobrain (BOB)'} — {t('progress.title')}
                </h2>
              </div>
            </CardHeader>
            <CardBody>
              <ProgressJourney
                programType={activeChild.program_type || 'junior'}
                levels={activeChild.levels || []}
                currentLevelNumber={activeChild.current_level_number || 1}
                completedSessionsInCurrentLevel={activeChild.completed_sessions_current || 0}
              />
            </CardBody>
          </Card>

          {/* Legend */}
          <div className="mt-4 flex items-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-bb-green" />
              <span>{t('progress.completed')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-bb-orange" />
              <span>{t('progress.current')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-gray-200" />
              <span>{t('progress.upcoming')}</span>
            </div>
          </div>
        </>
      )}

      {children.length === 0 && (
        <Card>
          <CardBody>
            <p className="text-sm text-gray-400 text-center py-8">{t('common.noData')}</p>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
