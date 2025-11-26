import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'

export default function Header() {
  const { t, i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh'
    i18n.changeLanguage(newLang)
  }

  return (
    <header className="glass sticky top-0 z-40 border-b border-apple-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-apple bg-gradient-to-br from-apple-blue to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-apple-gray-600">
                {t('app.title')}
              </h1>
              <p className="text-xs text-apple-gray-400 hidden sm:block">
                {t('app.subtitle')}
              </p>
            </div>
          </div>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 rounded-apple hover:bg-apple-gray-100 transition-apple"
          >
            <Globe className="w-4 h-4 text-apple-gray-500" />
            <span className="text-sm font-medium text-apple-gray-600">
              {i18n.language === 'zh' ? 'EN' : '中文'}
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
