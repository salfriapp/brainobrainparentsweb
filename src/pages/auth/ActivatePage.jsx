import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useTranslation } from 'react-i18next'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../lib/api'
import useAuthStore from '../../store/authStore'
import { PageLoader } from '../../components/ui/LoadingSpinner'

const schema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirmation: z.string(),
}).refine((d) => d.password === d.password_confirmation, {
  message: 'Passwords do not match',
  path: ['password_confirmation'],
})

export default function ActivatePage() {
  const { t } = useTranslation()
  const { token } = useParams()
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [invitation, setInvitation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    api.get(`/activate/${token}`)
      .then((res) => setInvitation(res.data.data))
      .catch(() => setError('Invalid or expired invitation link.'))
      .finally(() => setLoading(false))
  }, [token])

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      const res = await api.post(`/activate/${token}`, data)
      const { token: authToken, user } = res.data.data
      localStorage.setItem('bb_parent_token', authToken)
      setAuth(authToken, user)
      toast.success('Account activated successfully!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Activation failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <PageLoader />

  if (error) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Invitation Error</h2>
        <p className="text-sm text-gray-500">{error}</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Activate Your Account</h2>
      <p className="text-sm text-gray-500 mb-1">Welcome, <strong>{invitation?.name}</strong>!</p>
      <p className="text-sm text-gray-500 mb-6">Set your password to access the Parent Portal.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={invitation?.email || ''}
            disabled
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.newPassword')}</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-bb-blue focus:border-bb-blue outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-bb-red mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.confirmPassword')}</label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              {...register('password_confirmation')}
              className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-bb-blue focus:border-bb-blue outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password_confirmation && <p className="text-xs text-bb-red mt-1">{errors.password_confirmation.message}</p>}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 bg-bb-green text-white rounded-lg text-sm font-semibold hover:bg-bb-green-dark transition-colors disabled:opacity-50"
        >
          {submitting ? t('common.loading') : 'Activate & Login'}
        </button>
      </form>
    </div>
  )
}
