import Link from "next/link";

export default function AdminPapersPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-900">Paper Management</h1>
          <nav className="flex gap-4">
            <Link href="/admin" className="text-slate-600 hover:text-slate-900">Overview</Link>
            <Link href="/admin/questions" className="text-slate-600 hover:text-slate-900">Questions</Link>
            <Link href="/admin/papers" className="text-slate-900 font-medium">Papers</Link>
            <Link href="/admin/students" className="text-slate-600 hover:text-slate-900">Students</Link>
          </nav>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex gap-2">
            <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
              <option>All Status</option>
              <option>Draft</option>
              <option>Published</option>
              <option>Archived</option>
            </select>
          </div>
          <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800">
            + Create Paper
          </button>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Title</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Questions</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Duration</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Passing Score</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="px-6 py-4 text-slate-900">CS101 Midterm Exam</td>
                <td className="px-6 py-4 text-slate-600">50</td>
                <td className="px-6 py-4 text-slate-600">60 min</td>
                <td className="px-6 py-4 text-slate-600">60%</td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Published</span></td>
                <td className="px-6 py-4">
                  <button className="text-slate-900 hover:underline mr-3">Edit</button>
                  <button className="text-slate-600 hover:underline mr-3">Results</button>
                  <button className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-slate-900">CS201 Final Exam</td>
                <td className="px-6 py-4 text-slate-600">80</td>
                <td className="px-6 py-4 text-slate-600">120 min</td>
                <td className="px-6 py-4 text-slate-600">65%</td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Published</span></td>
                <td className="px-6 py-4">
                  <button className="text-slate-900 hover:underline mr-3">Edit</button>
                  <button className="text-slate-600 hover:underline mr-3">Results</button>
                  <button className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-slate-900">CS301 Quiz 5</td>
                <td className="px-6 py-4 text-slate-600">20</td>
                <td className="px-6 py-4 text-slate-600">30 min</td>
                <td className="px-6 py-4 text-slate-600">70%</td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs">Draft</span></td>
                <td className="px-6 py-4">
                  <button className="text-slate-900 hover:underline mr-3">Edit</button>
                  <button className="text-green-600 hover:underline">Publish</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
