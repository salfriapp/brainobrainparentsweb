import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import useAuthStore from '../../store/authStore'

export default function ImpersonatePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const setAuth = useAuthStore((s) => s.setAuth)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const [error, setError] = useState(null)
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const token = searchParams.get('token')
    if (!token) {
      setError(t('auth.impersonateMissingToken'))
      return
    }

    clearAuth()
    localStorage.setItem('bb_parent_token', token)

    api.get('/auth/me')
      .then((res) => {
        setAuth(token, res.data?.data)
        navigate('/dashboard', { replace: true })
      })
      .catch(() => {
        localStorage.removeItem('bb_parent_token')
        clearAuth()
        setError(t('auth.impersonateFailed'))
      })
  }, [searchParams, setAuth, clearAuth, navigate, t])

  return (
    <div className="text-center py-8">
      {error ? (
        <>
          <h2 className="text-lg font-semibold text-red-600 mb-2">{t('auth.impersonateTitle')}</h2>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            type="button"
            onClick={() => navigate('/login', { replace: true })}
            className="px-4 py-2 bg-bb-green text-white rounded-lg text-sm font-semibold hover:bg-bb-green-dark transition-colors"
          >
            {t('auth.login')}
          </button>
        </>
      ) : (
        <>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('auth.impersonateTitle')}</h2>
          <p className="text-sm text-gray-500">{t('auth.impersonateLoading')}</p>
        </>
      )}
    </div>
  )
}
