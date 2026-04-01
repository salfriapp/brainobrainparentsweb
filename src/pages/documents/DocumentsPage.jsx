import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FileText, Download, Eye, FileCheck, Receipt, MessageSquare, ClipboardList } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import Card, { CardHeader, CardBody } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { PageLoader } from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'

const tabs = [
  { key: 'contracts', icon: FileCheck },
  { key: 'invoices', icon: Receipt },
  { key: 'feedbackForms', icon: MessageSquare },
  { key: 'registrationForms', icon: ClipboardList },
]

export default function DocumentsPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('contracts')

  const { data, isLoading } = useQuery({
    queryKey: ['parent-documents'],
    queryFn: () => api.get('/documents').then((r) => r.data),
  })

  if (isLoading) return <PageLoader />

  const docs = data?.data || {}
  const contracts = docs.contracts || []
  const invoices = docs.invoices || []
  const feedbackForms = docs.feedback_forms || []
  const registrationForms = docs.registration_forms || []

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

  const handleDownload = (url) => {
    window.open(url, '_blank')
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('documents.title')}</h1>
        <p className="text-sm text-gray-500 mt-1">{t('documents.subtitle')}</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1">
        {tabs.map(({ key, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors flex-1 justify-center ${
              activeTab === key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{t(`documents.${key}`)}</span>
          </button>
        ))}
      </div>

      {/* Contracts */}
      {activeTab === 'contracts' && (
        <div className="space-y-3">
          {contracts.length === 0 ? (
            <Card><CardBody><EmptyState icon={FileCheck} title={t('documents.noContracts')} /></CardBody></Card>
          ) : contracts.map((c) => (
            <Card key={c.id}>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-900">{c.contract_number}</span>
                      <Badge status={c.status} />
                    </div>
                    <p className="text-xs text-gray-500">
                      {c.student_name} &middot; {c.program_name}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {t('documents.signedOn')}: {fmtDate(c.signed_at)} &middot; {t('documents.validUntil')}: {fmtDate(c.valid_until)}
                    </p>
                  </div>
                  {c.pdf_url && (
                    <button
                      onClick={() => handleDownload(c.pdf_url)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-bb-blue-lt text-bb-blue rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      PDF
                    </button>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Invoices */}
      {activeTab === 'invoices' && (
        <div className="space-y-3">
          {invoices.length === 0 ? (
            <Card><CardBody><EmptyState icon={Receipt} title={t('documents.noInvoices')} /></CardBody></Card>
          ) : invoices.map((inv) => (
            <Card key={inv.id}>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Receipt className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-900">{inv.invoice_number}</span>
                      <Badge status={inv.status} />
                    </div>
                    <p className="text-xs text-gray-500">
                      {t('documents.amount')}: {inv.amount} &euro; &middot; {t('documents.date')}: {fmtDate(inv.date)}
                    </p>
                  </div>
                  {inv.pdf_url && (
                    <button
                      onClick={() => handleDownload(inv.pdf_url)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-bb-blue-lt text-bb-blue rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      PDF
                    </button>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Feedback Forms */}
      {activeTab === 'feedbackForms' && (
        <div className="space-y-3">
          {feedbackForms.length === 0 ? (
            <Card><CardBody><EmptyState icon={MessageSquare} title={t('documents.noFeedback')} /></CardBody></Card>
          ) : feedbackForms.map((f) => (
            <Card key={f.id}>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{f.student_name}</p>
                    <p className="text-xs text-gray-500">
                      {t('documents.date')}: {fmtDate(f.submitted_at || f.created_at)}
                      {f.rating && <span> &middot; Rating: <span className="font-medium text-gray-700 capitalize">{f.rating}</span></span>}
                    </p>
                    {f.notes && <p className="text-xs text-gray-400 mt-1">{f.notes}</p>}
                  </div>
                  {f.pdf_url && (
                    <button
                      onClick={() => handleDownload(f.pdf_url)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-bb-blue-lt text-bb-blue rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors flex-shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {t('documents.viewPdf')}
                    </button>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Registration Forms */}
      {activeTab === 'registrationForms' && (
        <div className="space-y-3">
          {registrationForms.length === 0 ? (
            <Card><CardBody><EmptyState icon={ClipboardList} title={t('documents.noRegistration')} /></CardBody></Card>
          ) : registrationForms.map((r) => (
            <Card key={r.id}>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{r.student_name}</p>
                    <p className="text-xs text-gray-500">{t('documents.date')}: {fmtDate(r.created_at)}</p>
                  </div>
                  {r.pdf_url && (
                    <button
                      onClick={() => handleDownload(r.pdf_url)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-bb-blue-lt text-bb-blue rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {t('documents.viewPdf')}
                    </button>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
