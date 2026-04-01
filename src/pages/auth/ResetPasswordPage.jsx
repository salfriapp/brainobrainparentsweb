import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useResetPassword } from '../../hooks/useAuth'

const schema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirmation: z.string(),
}).refine((d) => d.password === d.password_confirmation, {
  message: 'Passwords do not match',
  path: ['password_confirmation'],
})

export default function ResetPasswordPage() {
  const { t } = useTranslation()
  const [params] = useSearchParams()
  const reset = useResetPassword()
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data) => {
    reset.mutate({
      ...data,
      token: params.get('token'),
      email: params.get('email'),
    })
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">{t('auth.resetPasswordTitle')}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.newPassword')}</label>
          <input
            type="password"
            {...register('password')}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-bb-blue focus:border-bb-blue outline-none"
          />
          {errors.password && <p className="text-xs text-bb-red mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.confirmPassword')}</label>
          <input
            type="password"
            {...register('password_confirmation')}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-bb-blue focus:border-bb-blue outline-none"
          />
          {errors.password_confirmation && <p className="text-xs text-bb-red mt-1">{errors.password_confirmation.message}</p>}
        </div>

        <button
          type="submit"
          disabled={reset.isPending}
          className="w-full py-2.5 bg-bb-green text-white rounded-lg text-sm font-semibold hover:bg-bb-green-dark transition-colors disabled:opacity-50"
        >
          {reset.isPending ? t('common.loading') : t('auth.resetPassword')}
        </button>
      </form>
    </div>
  )
}
