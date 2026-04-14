import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { CalendarDays, TrendingUp, MessageCircle, FileText, Clock, BookOpen, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import useAuthStore from '../../store/authStore'
import Card, { CardHeader, CardBody } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import { levelImageUrl, hideOnMissing } from '../../lib/levelImages'

export default function DashboardPage() {
  const { t } = useTranslation()
  const user = useAuthStore((s) => s.user)

  const { data, isLoading } = useQuery({
    queryKey: ['parent-dashboard'],
    queryFn: () => api.get('/dashboard').then((r) => r.data),
  })

  if (isLoading) return <PageLoader />

  const dashboard = data?.data || {}
  const children = dashboard.children || []
  const recentMessages = dashboard.recent_messages || []
  const nextSessions = dashboard.next_sessions || []

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

  return (
    <div className="p-6">
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('dashboard.greeting', { name: user?.name || 'Parent' })}
        </h1>
        <p className="text-sm text-gray-500 mt-1">{t('dashboard.title')}</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { to: '/schedule', icon: CalendarDays, label: t('dashboard.viewSchedule'), color: 'bg-blue-50 text-blue-600' },
          { to: '/progress', icon: TrendingUp, label: t('dashboard.viewProgress'), color: 'bg-green-50 text-green-600' },
          { to: '/messages', icon: MessageCircle, label: t('dashboard.sendMessage'), color: 'bg-purple-50 text-purple-600' },
          { to: '/documents', icon: FileText, label: t('dashboard.viewDocuments'), color: 'bg-orange-50 text-orange-600' },
        ].map(({ to, icon: Icon, label, color }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-gray-700 text-center">{label}</span>
          </Link>
        ))}
      </div>

      {/* Children Overview */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('dashboard.childOverview')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {children.map((child) => (
            <Card key={child.id}>
              <CardBody>
                <div className="flex items-start gap-4">
                  {(() => {
                    console.log("child program: " + child.program_id);
                    const url = levelImageUrl(child.program_id, child.level_number)
                    console.log("url: " . url);
                    return url ? (
                      <img
                        src={url}
                        alt={child.level_name}
                        onError={hideOnMissing}
                        className="w-16 h-16 object-contain flex-shrink-0 rounded-md bg-bb-orange-lt p-1"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-bb-orange-lt flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-bb-orange" />
                      </div>
                    )
                  })()}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900">{child.name}</h3>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{t('dashboard.currentLevel')}: <span className="font-medium text-gray-700">{child.level_name || '—'}</span></span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <CalendarDays className="w-3.5 h-3.5" />
                        <span>{t('dashboard.classGroup')}: <span className="font-medium text-gray-700">{child.group_name || '—'}</span></span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <User className="w-3.5 h-3.5" />
                        <span>{t('dashboard.instructor')}: <span className="font-medium text-gray-700">{child.instructor_name || '—'}</span></span>
                      </div>
                    </div>
                    {/* Mini progress */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>{t('dashboard.completedClasses')}</span>
                        <span className="font-medium text-gray-700">{child.completed_sessions || 0}/{child.total_sessions || 0}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-bb-green rounded-full h-2 transition-all"
                          style={{ width: `${child.total_sessions ? (child.completed_sessions / child.total_sessions) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
          {children.length === 0 && (
            <p className="text-sm text-gray-400 col-span-2">{t('common.noData')}</p>
          )}
        </div>
      </div>

      {/* Upcoming Classes & Recent Messages side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Classes */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-900">{t('dashboard.upcomingClasses')}</h2>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            {nextSessions.length === 0 ? (
              <div className="px-5 py-6 text-center text-sm text-gray-400">{t('common.noData')}</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {nextSessions.map((s) => (
                  <div key={s.id} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{s.student_name}</p>
                      <p className="text-xs text-gray-500">{s.group_name} &middot; {t('schedule.sessionNo')} {s.session_number}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">{fmtDate(s.scheduled_date)}</p>
                      <Badge status={s.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-gray-400" />
                <h2 className="text-sm font-semibold text-gray-900">{t('dashboard.recentMessages')}</h2>
              </div>
              <Link to="/messages" className="text-xs text-bb-blue hover:text-bb-blue-dark font-medium">
                {t('common.viewAll')}
              </Link>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            {recentMessages.length === 0 ? (
              <div className="px-5 py-6 text-center text-sm text-gray-400">{t('dashboard.noMessages')}</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {recentMessages.map((m) => (
                  <div key={m.id} className="px-5 py-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900">{m.from_name}</p>
                      <span className="text-xs text-gray-400">{fmtDate(m.created_at)}</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">{m.message}</p>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
