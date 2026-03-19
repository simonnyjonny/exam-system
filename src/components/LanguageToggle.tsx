'use client';

import { useBilingual } from '@/contexts/BilingualContext';

export function LanguageToggle() {
  const { language, toggleLanguage } = useBilingual();

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
    >
      {language === 'zh' ? 'EN' : '中文'}
    </button>
  );
}
