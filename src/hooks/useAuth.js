import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../lib/api'
import useAuthStore from '../store/authStore'

export function useLogin() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation({
    mutationFn: (credentials) => api.post('/auth/login', credentials),
    onSuccess: (res) => {
      const { token, user } = res.data.data
      localStorage.setItem('bb_parent_token', token)
      setAuth(token, user)
      navigate('/dashboard')
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Login failed')
    },
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data) => api.post('/auth/forgot-password', data),
    onSuccess: () => toast.success('Password reset link sent to your email'),
    onError: (err) => toast.error(err.response?.data?.message || 'Request failed'),
  })
}

export function useResetPassword() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data) => api.post('/auth/reset-password', data),
    onSuccess: () => {
      toast.success('Password reset successfully')
      navigate('/login')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Reset failed'),
  })
}

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => api.post('/auth/logout'),
    onSettled: () => {
      localStorage.removeItem('bb_parent_token')
      clearAuth()
      navigate('/login')
    },
  })
}
