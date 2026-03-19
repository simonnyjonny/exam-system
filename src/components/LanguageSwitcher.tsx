'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
      title={language === 'zh' ? 'Switch to English' : '切换到中文'}
    >
      {language === 'zh' ? 'EN' : '中文'}
    </button>
  );
}
