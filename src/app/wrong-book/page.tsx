import Link from "next/link";

export default function WrongBookPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-900">Wrong Book</h1>
          <nav className="flex gap-4">
            <Link href="/dashboard" className="text-slate-600 hover:text-slate-900">Dashboard</Link>
            <Link href="/papers" className="text-slate-600 hover:text-slate-900">Papers</Link>
            <Link href="/wrong-book" className="text-slate-900 font-medium">Wrong Book</Link>
          </nav>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Review Your Mistakes</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm">All</button>
            <button className="px-4 py-2 bg-white border border-slate-300 text-slate-600 rounded-lg text-sm hover:bg-slate-50">Algorithms</button>
            <button className="px-4 py-2 bg-white border border-slate-300 text-slate-600 rounded-lg text-sm hover:bg-slate-50">Database</button>
            <button className="px-4 py-2 bg-white border border-slate-300 text-slate-600 rounded-lg text-sm hover:bg-slate-50">Networking</button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm text-slate-500">Database Systems - Quiz 2</span>
              <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">Incorrect</span>
            </div>
            <h3 className="font-medium text-slate-900 mb-2">What is the primary purpose of indexing in a database?</h3>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-red-600">
                <span className="w-5 h-5 flex items-center justify-center border border-red-600 rounded">✗</span>
                <span>To reduce storage space</span>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <span className="w-5 h-5 flex items-center justify-center border border-green-600 rounded">✓</span>
                <span>To speed up data retrieval</span>
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600"><span className="font-medium">Explanation:</span> Indexes are data structures that improve the speed of data retrieval operations by providing quick access to rows in a database table.</p>
            </div>
            <button className="mt-4 text-sm text-slate-900 hover:underline">Practice Similar Questions →</button>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm text-slate-500">Algorithm Design - Midterm</span>
              <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">Incorrect</span>
            </div>
            <h3 className="font-medium text-slate-900 mb-2">What is the time complexity of binary search?</h3>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-red-600">
                <span className="w-5 h-5 flex items-center justify-center border border-red-600 rounded">✗</span>
                <span>O(n)</span>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <span className="w-5 h-5 flex items-center justify-center border border-green-600 rounded">✓</span>
                <span>O(log n)</span>
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600"><span className="font-medium">Explanation:</span> Binary search divides the search space in half with each comparison, resulting in logarithmic time complexity.</p>
            </div>
            <button className="mt-4 text-sm text-slate-900 hover:underline">Practice Similar Questions →</button>
          </div>
        </div>
      </main>
    </div>
  );
}
