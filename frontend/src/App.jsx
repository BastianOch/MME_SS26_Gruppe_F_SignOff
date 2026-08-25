import Sidebar from './components/Sidebar'
import DashboardPage from './pages/DashboardPage'

function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar />
      <DashboardPage />
    </div>
  )
}

export default App