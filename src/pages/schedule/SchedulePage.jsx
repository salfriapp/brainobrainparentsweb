import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CalendarDays, Clock, MapPin, User, BookOpen, StickyNote } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import Card, { CardHeader, CardBody } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { PageLoader } from '../../components/ui/LoadingSpinner'

export default function SchedulePage() {
  const { t } = useTranslation()
  const [selectedChild, setSelectedChild] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['parent-schedule'],
    queryFn: () => api.get('/schedule').then((r) => r.data),
  })

  if (isLoading) return <PageLoader />

  const scheduleData = data?.data || {}
  const children = scheduleData.children || []

  // Auto-select first child
  const activeChild = selectedChild
    ? children.find((c) => c.id === selectedChild)
    : children[0]

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }) : '—'

  const statusColors = {
    completed: 'border-l-green-500 bg-green-50/30',
    scheduled: 'border-l-blue-400 bg-white',
    cancelled: 'border-l-red-400 bg-red-50/30',
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('schedule.title')}</h1>
        <p className="text-sm text-gray-500 mt-1">{t('schedule.subtitle')}</p>
      </div>

      {/* Child Selector */}
      {children.length > 1 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('schedule.selectChild')}</label>
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
          {/* Group Info Card */}
          <Card className="mb-6">
            <CardBody>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">{t('schedule.group')}</p>
                    <p className="text-sm font-semibold text-gray-900">{activeChild.group_name || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">{t('schedule.day')} / {t('schedule.time')}</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {activeChild.day_of_week || '—'} &middot; {activeChild.start_time || '—'}–{activeChild.end_time || '—'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">{t('schedule.level')}</p>
                    <p className="text-sm font-semibold text-gray-900">{activeChild.level_name || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">{t('dashboard.instructor')}</p>
                    <p className="text-sm font-semibold text-gray-900">{activeChild.instructor_name || '—'}</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Sessions List */}
          <div className="space-y-2">
            {(activeChild.sessions || []).length === 0 ? (
              <Card>
                <CardBody>
                  <p className="text-sm text-gray-400 text-center py-4">{t('schedule.noSessions')}</p>
                </CardBody>
              </Card>
            ) : (
              (activeChild.sessions || []).map((session) => (
                <div
                  key={session.id}
                  className={`border-l-4 rounded-lg shadow-sm border border-gray-100 ${statusColors[session.status] || 'bg-white border-l-gray-300'}`}
                >
                  <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                        {session.session_number}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {t('schedule.sessionNo')} {session.session_number}
                        </p>
                        <p className="text-xs text-gray-500">{fmtDate(session.scheduled_date)}</p>
                      </div>
                    </div>
                    <Badge status={session.status} label={t(`schedule.${session.status}`)} />
                  </div>

                  {session.notes && (
                    <div className="px-4 pb-3 border-t border-gray-100 pt-3">
                      <div className="flex items-start gap-2">
                        <StickyNote className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-gray-600 leading-relaxed">{session.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
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
