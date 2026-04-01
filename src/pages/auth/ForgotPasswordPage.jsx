import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useForgotPassword } from '../../hooks/useAuth'

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
})

export default function ForgotPasswordPage() {
  const { t } = useTranslation()
  const forgot = useForgotPassword()
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">{t('auth.forgotPasswordTitle')}</h2>
      <p className="text-sm text-gray-500 mb-6">{t('auth.forgotPasswordSubtitle')}</p>

      <form onSubmit={handleSubmit((data) => forgot.mutate(data))} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.email')}</label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-bb-blue focus:border-bb-blue outline-none"
          />
          {errors.email && <p className="text-xs text-bb-red mt-1">{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          disabled={forgot.isPending}
          className="w-full py-2.5 bg-bb-green text-white rounded-lg text-sm font-semibold hover:bg-bb-green-dark transition-colors disabled:opacity-50"
        >
          {forgot.isPending ? t('common.loading') : t('auth.sendResetLink')}
        </button>

        <div className="text-center">
          <Link to="/login" className="text-sm text-bb-blue hover:text-bb-blue-dark">
            {t('auth.backToLogin')}
          </Link>
        </div>
      </form>
    </div>
  )
}
