import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Login</h1>
          <p className="text-slate-500 mt-2">Sign in to your account</p>
        </div>
        
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@university.edu"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-2 px-4 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Sign In
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <Link href="/dashboard" className="text-sm text-slate-600 hover:underline">
            Continue as Guest
          </Link>
        </div>
      </div>
    </div>
  );
}
