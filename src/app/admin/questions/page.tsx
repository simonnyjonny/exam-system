import Link from "next/link";

export default function AdminQuestionsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-900">Question Management</h1>
          <nav className="flex gap-4">
            <Link href="/admin" className="text-slate-600 hover:text-slate-900">Overview</Link>
            <Link href="/admin/questions" className="text-slate-900 font-medium">Questions</Link>
            <Link href="/admin/papers" className="text-slate-600 hover:text-slate-900">Papers</Link>
            <Link href="/admin/students" className="text-slate-600 hover:text-slate-900">Students</Link>
          </nav>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex gap-2">
            <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
              <option>All Categories</option>
              <option>Computer Science</option>
              <option>Mathematics</option>
              <option>Physics</option>
            </select>
            <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
              <option>All Types</option>
              <option>Multiple Choice</option>
              <option>True/False</option>
              <option>Fill in Blank</option>
            </select>
            <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
              <option>All Difficulty</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
          <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800">
            + Add Question
          </button>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Question</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Category</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Type</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Difficulty</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Points</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="px-6 py-4 text-slate-900 max-w-md truncate">What is the time complexity of QuickSort in the average case?</td>
                <td className="px-6 py-4 text-slate-600">Algorithms</td>
                <td className="px-6 py-4 text-slate-600">Multiple Choice</td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">Medium</span></td>
                <td className="px-6 py-4 text-slate-600">5</td>
                <td className="px-6 py-4">
                  <button className="text-slate-900 hover:underline mr-3">Edit</button>
                  <button className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-slate-900 max-w-md truncate">SQL is a procedural programming language.</td>
                <td className="px-6 py-4 text-slate-600">Database</td>
                <td className="px-6 py-4 text-slate-600">True/False</td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Easy</span></td>
                <td className="px-6 py-4 text-slate-600">2</td>
                <td className="px-6 py-4">
                  <button className="text-slate-900 hover:underline mr-3">Edit</button>
                  <button className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-slate-900 max-w-md truncate">Explain the concept of recursion in programming.</td>
                <td className="px-6 py-4 text-slate-600">Programming</td>
                <td className="px-6 py-4 text-slate-600">Essay</td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">Hard</span></td>
                <td className="px-6 py-4 text-slate-600">10</td>
                <td className="px-6 py-4">
                  <button className="text-slate-900 hover:underline mr-3">Edit</button>
                  <button className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
