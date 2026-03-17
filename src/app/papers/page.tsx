import Link from "next/link";

export default function PapersPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-900">Exam Papers</h1>
          <nav className="flex gap-4">
            <Link href="/dashboard" className="text-slate-600 hover:text-slate-900">Dashboard</Link>
            <Link href="/papers" className="text-slate-900 font-medium">Papers</Link>
            <Link href="/wrong-book" className="text-slate-600 hover:text-slate-900">Wrong Book</Link>
          </nav>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <h2 className="font-semibold text-slate-900">All Exam Papers</h2>
            <input
              type="search"
              placeholder="Search papers..."
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Title</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Questions</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Duration</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Score</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="px-6 py-4 text-slate-900">Introduction to Computer Science - Midterm</td>
                <td className="px-6 py-4 text-slate-600">50</td>
                <td className="px-6 py-4 text-slate-600">60 min</td>
                <td className="px-6 py-4 text-green-600 font-medium">95%</td>
                <td className="px-6 py-4"><button className="text-slate-900 hover:underline">Download</button></td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-slate-900">Data Structures - Final Exam</td>
                <td className="px-6 py-4 text-slate-600">40</td>
                <td className="px-6 py-4 text-slate-600">90 min</td>
                <td className="px-6 py-4 text-green-600 font-medium">88%</td>
                <td className="px-6 py-4"><button className="text-slate-900 hover:underline">Download</button></td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-slate-900">Algorithm Design - Quiz 3</td>
                <td className="px-6 py-4 text-slate-600">20</td>
                <td className="px-6 py-4 text-slate-600">45 min</td>
                <td className="px-6 py-4 text-red-600 font-medium">72%</td>
                <td className="px-6 py-4"><button className="text-slate-900 hover:underline">Download</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
