import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MessageCircle, Send, User, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import api from '../../lib/api'
import useAuthStore from '../../store/authStore'
import Card, { CardHeader, CardBody } from '../../components/ui/Card'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'

export default function MessagesPage() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)
  const [newMessage, setNewMessage] = useState('')
  const [subject, setSubject] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['parent-messages'],
    queryFn: () => api.get('/messages').then((r) => r.data),
  })

  const sendMutation = useMutation({
    mutationFn: (msg) => api.post('/messages', msg),
    onSuccess: () => {
      toast.success(t('messages.messageSent'))
      setNewMessage('')
      setSubject('')
      queryClient.invalidateQueries({ queryKey: ['parent-messages'] })
    },
    onError: (err) => toast.error(err.response?.data?.message || t('common.error')),
  })

  if (isLoading) return <PageLoader />

  const messagesData = data?.data || {}
  const messages = messagesData.messages || []
  const instructor = messagesData.instructor || {}

  const fmtDateTime = (d) => d ? new Date(d).toLocaleDateString('de-DE', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  }) : '—'

  const handleSend = () => {
    if (!newMessage.trim()) return
    sendMutation.mutate({ subject, message: newMessage })
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('messages.title')}</h1>
        <p className="text-sm text-gray-500 mt-1">{t('messages.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compose */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-gray-900">{t('messages.newMessage')}</h2>
            </CardHeader>
            <CardBody>
              {instructor.name && (
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-bb-green-lt flex items-center justify-center">
                    <User className="w-4 h-4 text-bb-green" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t('messages.to')}</p>
                    <p className="text-sm font-medium text-gray-900">{instructor.name}</p>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={t('messages.subject')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-bb-blue focus:border-bb-blue outline-none"
                />
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={t('messages.typeMessage')}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-bb-blue focus:border-bb-blue outline-none resize-none"
                />
                <button
                  onClick={handleSend}
                  disabled={sendMutation.isPending || !newMessage.trim()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-bb-green text-white rounded-lg text-sm font-semibold hover:bg-bb-green-dark transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {sendMutation.isPending ? t('common.loading') : t('messages.sendMessage')}
                </button>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Message List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-gray-900">{t('messages.title')}</h2>
            </CardHeader>
            <CardBody className="p-0">
              {messages.length === 0 ? (
                <div className="py-8">
                  <EmptyState icon={MessageCircle} title={t('messages.noMessages')} />
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {messages.map((msg) => {
                    const isFromParent = msg.direction === 'sent'
                    return (
                      <div key={msg.id} className="px-5 py-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isFromParent ? 'bg-bb-blue-lt' : 'bg-bb-green-lt'
                          }`}>
                            <User className={`w-4 h-4 ${isFromParent ? 'text-bb-blue' : 'text-bb-green'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium text-gray-900">
                                {isFromParent ? user?.name || 'You' : msg.from_name}
                              </p>
                              <div className="flex items-center gap-1 text-xs text-gray-400">
                                <Clock className="w-3 h-3" />
                                {fmtDateTime(msg.created_at)}
                              </div>
                            </div>
                            {msg.subject && (
                              <p className="text-xs font-semibold text-gray-700 mb-1">{msg.subject}</p>
                            )}
                            <p className="text-sm text-gray-600 whitespace-pre-line">{msg.message}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
