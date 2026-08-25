function DashboardPage() {
  return (
    <main className="flex-1 overflow-y-auto p-6">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Dashboard
        </h2>
      </header>

      <div className="border-4 border-dashed border-gray-200 rounded-xl h-96 flex items-center justify-center">
        <p className="text-gray-500">Main content</p>
      </div>
    </main>
  )
}

export default DashboardPage