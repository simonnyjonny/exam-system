import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-900">Admin Portal</h1>
          <nav className="flex gap-4">
            <Link href="/admin" className="text-slate-900 font-medium">Overview</Link>
            <Link href="/admin/questions" className="text-slate-600 hover:text-slate-900">Questions</Link>
            <Link href="/admin/papers" className="text-slate-600 hover:text-slate-900">Papers</Link>
            <Link href="/admin/students" className="text-slate-600 hover:text-slate-900">Students</Link>
            <Link href="/" className="text-slate-600 hover:text-slate-900">Logout</Link>
          </nav>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="text-sm font-medium text-slate-500">Total Questions</h3>
            <p className="text-3xl font-bold text-slate-900 mt-2">1,234</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="text-sm font-medium text-slate-500">Published Papers</h3>
            <p className="text-3xl font-bold text-slate-900 mt-2">45</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="text-sm font-medium text-slate-500">Active Students</h3>
            <p className="text-3xl font-bold text-slate-900 mt-2">567</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="text-sm font-medium text-slate-500">Submissions Today</h3>
            <p className="text-3xl font-bold text-slate-900 mt-2">89</p>
          </div>
        </div>
        
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Link href="/admin/questions" className="bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
            <h3 className="font-semibold text-slate-900">Manage Questions</h3>
            <p className="text-sm text-slate-500 mt-1">Add, edit, or remove questions from the bank</p>
          </Link>
          <Link href="/admin/papers" className="bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
            <h3 className="font-semibold text-slate-900">Manage Papers</h3>
            <p className="text-sm text-slate-500 mt-1">Create and publish exam papers</p>
          </Link>
          <Link href="/admin/students" className="bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
            <h3 className="font-semibold text-slate-900">Manage Students</h3>
            <p className="text-sm text-slate-500 mt-1">View and manage student accounts</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
