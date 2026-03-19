'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Language } from '@/lib/i18n';

interface BilingualContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (zh: string, en: string) => string;
}

const BilingualContext = createContext<BilingualContextType>({
  language: 'zh',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (zh) => zh,
});

const COOKIE_NAME = 'exam-lang';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, days: number = 365) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/`;
}

export function BilingualProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('zh');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = getCookie(COOKIE_NAME);
    if (saved === 'en' || saved === 'zh') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setCookie(COOKIE_NAME, lang);
  };

  const toggleLanguage = () => {
    const newLang = language === 'zh' ? 'en' : 'zh';
    setLanguage(newLang);
  };

  const t = (zh: string, en: string): string => {
    return language === 'zh' ? zh : en;
  };

  return (
    <BilingualContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </BilingualContext.Provider>
  );
}

export function useBilingual() {
  return useContext(BilingualContext);
}
