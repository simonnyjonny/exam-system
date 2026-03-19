'use client';

import Link from "next/link";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useBilingual } from "@/contexts/BilingualContext";

export default function HomePage() {
  const { t } = useBilingual();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>
      <div className="text-center space-y-6 p-8">
        <h1 className="text-5xl font-bold text-slate-900">
          {t('在线考试系统', 'Online Exam System')}
        </h1>
        <p className="text-xl text-slate-600 max-w-md mx-auto">
          {t('大学综合考试平台', 'A comprehensive platform for university examinations')}
        </p>
        <div className="flex gap-4 justify-center pt-8">
          <Link
            href="/login"
            className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            {t('登录', 'Login')}
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-white text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            {t('控制台', 'Dashboard')}
          </Link>
        </div>
      </div>
    </div>
  );
}
