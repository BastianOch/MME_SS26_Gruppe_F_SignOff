import { Routes, Route } from 'react-router'
import Sidebar from './components/Sidebar'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import NewProtocolPage from './pages/NewProtocolPage'
import ProtocolsPage from './pages/ProtocolsPage'
import TasksBoardPage from './pages/TasksBoardPage'
import DocumentHistoryPage from './pages/DocumentHistoryPage'

function App() {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <Routes>
        <Route path="/" element={<DashboardPage />} />
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