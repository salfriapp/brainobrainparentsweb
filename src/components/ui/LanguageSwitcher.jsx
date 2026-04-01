import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher({ className = '' }) {
  const { i18n } = useTranslation()
  const current = i18n.language?.startsWith('de') ? 'de' : 'en'

  const toggle = () => {
    const next = current === 'en' ? 'de' : 'en'
    i18n.changeLanguage(next)
  }

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${className}`}
      title="Switch language"
    >
      <span className="text-base leading-none">{current === 'en' ? '🇩🇪' : '🇬🇧'}</span>
      <span>{current === 'en' ? 'DE' : 'EN'}</span>
    </button>
  )
}
