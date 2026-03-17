import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-5xl font-bold text-slate-900">Online Exam System</h1>
        <p className="text-xl text-slate-600 max-w-md mx-auto">
          A comprehensive platform for university examinations
        </p>
        <div className="flex gap-4 justify-center pt-8">
          <Link
            href="/login"
            className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-white text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
