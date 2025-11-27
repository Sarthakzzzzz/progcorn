export default function Layout({ children, title = "ProgCorn" }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">ProgCorn</h1>
            <div className="flex space-x-6">
              <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
              <a href="/resources" className="text-gray-600 hover:text-gray-900">Resources</a>
              <a href="/contests" className="text-gray-600 hover:text-gray-900">Contests</a>
              <a href="/tools" className="text-gray-600 hover:text-gray-900">Tools</a>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">{title}</h2>
        {children}
      </main>
    </div>
  )
}