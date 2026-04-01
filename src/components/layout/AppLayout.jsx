import { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  CalendarDays,
  MessageCircle,
  TrendingUp,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import useAuthStore from '../../store/authStore'
import { useLogout } from '../../hooks/useAuth'
import LanguageSwitcher from '../ui/LanguageSwitcher'

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()
  const { t } = useTranslation()

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    { to: '/documents', icon: FileText, label: t('nav.documents') },
    { to: '/schedule', icon: CalendarDays, label: t('nav.schedule') },
    { to: '/messages', icon: MessageCircle, label: t('nav.messages') },
    { to: '/progress', icon: TrendingUp, label: t('nav.progress') },
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#1a5e1a]">
        <img src="/brainobrain-logo.svg" alt="Brainobrain" className="w-10 h-10 flex-shrink-0" />
        <div>
          <span className="text-lg font-extrabold text-white leading-tight tracking-widest block">BRAINOBRAIN</span>
          <span className="text-xs text-[#a5d6a7] leading-tight block">Parent Portal</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#F7941D] text-white'
                  : 'text-green-100 hover:bg-[#1a5e1a] hover:text-white'
              }`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User + Language + Logout */}
      <div className="px-3 py-4 border-t border-[#1a5e1a]">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-[#F7941D] flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || 'P'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name || 'Parent'}</p>
            <p className="text-xs text-green-300 truncate">{user?.email || ''}</p>
          </div>
        </div>
        <div className="px-3 mb-1">
          <LanguageSwitcher className="text-green-100 hover:bg-[#1a5e1a] hover:text-white w-full justify-start" />
        </div>
        <button
          onClick={() => logout.mutate()}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-green-100 hover:bg-[#1a5e1a] hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {t('nav.logout')}
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-[#2D7A2E] flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative z-50 flex flex-col w-64 bg-[#2D7A2E]">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-green-200 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600 hover:text-gray-900">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <img src="/brainobrain-logo.svg" alt="Brainobrain" className="w-7 h-7" />
            <span className="font-bold text-[#2D7A2E] text-base tracking-widest">BRAINOBRAIN</span>
          </div>
          <LanguageSwitcher className="text-gray-600 hover:bg-gray-100 border border-gray-200" />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
