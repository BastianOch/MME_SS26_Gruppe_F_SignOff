import { Routes, Route, useLocation } from 'react-router'
import Sidebar from './components/sidebar'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import NewProtocolPage from './pages/NewProtocolPage'
import ProtocolsPage from './pages/ProtocolsPage'
import TasksBoardPage from './pages/TasksBoardPage'
import DocumentHistoryPage from './pages/DocumentHistoryPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function App() {
const location = useLocation()

  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/register'

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {!isAuthPage && <Sidebar />}

      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profil" element={<ProfilePage />} />
        <Route path="/protokolle" element={<ProtocolsPage />} />
        <Route path="/protokolle/neu" element={<NewProtocolPage />} />
        <Route path="/aufgaben" element={<TasksBoardPage />} />
        <Route path="/dokumente" element={<DocumentHistoryPage />} />
      </Routes>
    </div>
  )
}

export default App