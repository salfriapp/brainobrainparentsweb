import { Outlet } from 'react-router-dom'
import LanguageSwitcher from '../ui/LanguageSwitcher'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex flex-col items-center justify-center px-4">
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center mb-4">
          <img
            src="/brainobrain-logo.svg"
            alt="Brainobrain"
            className="w-35 h-35 drop-shadow-md"
          />
        </div>
        <h1 className="text-4xl font-extrabold text-[#2D7A2E] tracking-widest">
          BRAINOBRAIN
        </h1>
        <p className="text-[#F7941D] font-semibold mt-1 text-base tracking-wide">
          Parent Portal
        </p>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-orange-100 p-8">
        <div className="flex justify-end mb-4">
          <LanguageSwitcher className="bg-gray-100 text-gray-600 hover:bg-gray-200" />
        </div>
        <Outlet />
      </div>

      <p className="mt-6 text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Brainobrain. All rights reserved.
      </p>
    </div>
  )
}
