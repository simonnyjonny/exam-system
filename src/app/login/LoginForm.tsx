'use client';

import { useState } from 'react';
import { loginAction } from './actions';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useBilingual } from '@/contexts/BilingualContext';

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { language, t } = useBilingual();

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);

    const result = await loginAction(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>
      
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">{t('登录', 'Login')}</h1>
          <p className="text-slate-500 mt-2">
            {t('登录到您的账户', 'Sign in to your account')}
          </p>
        </div>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              {t('邮箱', 'Email')}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@university.edu"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              {t('密码', 'Password')}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">
                {t('用户名或密码错误', 'Invalid username or password')}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {loading ? t('登录中...', 'Signing in...') : t('登 录', 'Login')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            {t(
              '演示: admin@exam.com / admin123 或 student@exam.com / student123',
              'Demo: admin@exam.com / admin123 or student@exam.com / student123'
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
