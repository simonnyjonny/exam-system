import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-900">Student Dashboard</h1>
          <nav className="flex gap-4">
            <Link href="/dashboard" className="text-slate-600 hover:text-slate-900">Dashboard</Link>
            <Link href="/papers" className="text-slate-600 hover:text-slate-900">Papers</Link>
            <Link href="/wrong-book" className="text-slate-600 hover:text-slate-900">Wrong Book</Link>
            <Link href="/" className="text-slate-600 hover:text-slate-900">Logout</Link>
          </nav>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="text-sm font-medium text-slate-500">Available Exams</h3>
            <p className="text-3xl font-bold text-slate-900 mt-2">3</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="text-sm font-medium text-slate-500">Completed</h3>
            <p className="text-3xl font-bold text-slate-900 mt-2">12</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="text-sm font-medium text-slate-500">Average Score</h3>
            <p className="text-3xl font-bold text-slate-900 mt-2">85%</p>
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Available Exams</h2>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Subject</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Duration</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Status</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="px-6 py-4 text-slate-900">Introduction to Computer Science</td>
                  <td className="px-6 py-4 text-slate-600">60 min</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">Available</span></td>
                  <td className="px-6 py-4"><button className="text-slate-900 hover:underline">Start</button></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-slate-900">Data Structures</td>
                  <td className="px-6 py-4 text-slate-600">90 min</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">Available</span></td>
                  <td className="px-6 py-4"><button className="text-slate-900 hover:underline">Start</button></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-slate-900">Database Systems</td>
                  <td className="px-6 py-4 text-slate-600">75 min</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">Upcoming</span></td>
                  <td className="px-6 py-4"><button className="text-slate-400 cursor-not-allowed">Start</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
