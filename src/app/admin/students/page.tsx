import Link from "next/link";

export default function AdminStudentsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-900">Student Management</h1>
          <nav className="flex gap-4">
            <Link href="/admin" className="text-slate-600 hover:text-slate-900">Overview</Link>
            <Link href="/admin/questions" className="text-slate-600 hover:text-slate-900">Questions</Link>
            <Link href="/admin/papers" className="text-slate-600 hover:text-slate-900">Papers</Link>
            <Link href="/admin/students" className="text-slate-900 font-medium">Students</Link>
          </nav>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex gap-2">
            <input
              type="search"
              placeholder="Search students..."
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm w-64"
            />
          </div>
          <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800">
            + Import Students
          </button>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Student ID</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Name</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Email</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Exams Taken</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Average Score</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="px-6 py-4 text-slate-900">STU2024001</td>
                <td className="px-6 py-4 text-slate-900">John Smith</td>
                <td className="px-6 py-4 text-slate-600">john.smith@university.edu</td>
                <td className="px-6 py-4 text-slate-600">15</td>
                <td className="px-6 py-4 text-green-600 font-medium">92%</td>
                <td className="px-6 py-4">
                  <button className="text-slate-900 hover:underline mr-3">View</button>
                  <button className="text-slate-600 hover:underline mr-3">Reset</button>
                  <button className="text-red-600 hover:underline">Disable</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-slate-900">STU2024002</td>
                <td className="px-6 py-4 text-slate-900">Jane Doe</td>
                <td className="px-6 py-4 text-slate-600">jane.doe@university.edu</td>
                <td className="px-6 py-4 text-slate-600">12</td>
                <td className="px-6 py-4 text-green-600 font-medium">88%</td>
                <td className="px-6 py-4">
                  <button className="text-slate-900 hover:underline mr-3">View</button>
                  <button className="text-slate-600 hover:underline mr-3">Reset</button>
                  <button className="text-red-600 hover:underline">Disable</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-slate-900">STU2024003</td>
                <td className="px-6 py-4 text-slate-900">Mike Johnson</td>
                <td className="px-6 py-4 text-slate-600">mike.johnson@university.edu</td>
                <td className="px-6 py-4 text-slate-600">8</td>
                <td className="px-6 py-4 text-yellow-600 font-medium">75%</td>
                <td className="px-6 py-4">
                  <button className="text-slate-900 hover:underline mr-3">View</button>
                  <button className="text-slate-600 hover:underline mr-3">Reset</button>
                  <button className="text-red-600 hover:underline">Disable</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
