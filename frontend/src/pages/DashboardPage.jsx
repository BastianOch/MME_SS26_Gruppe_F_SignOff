import { Link } from 'react-router'
import { Calendar, MapPin, CheckSquare, FileText, checkCircle2, Circle, PlusCircle, Clock } from 'lucide-react'

function DashboardPage() {
  // MockDaten for the API Data, etc.
  const newMeeting = {
    title: 'Besprechungsmeeting A1',
    date: '1998-06-15',
    time: '14:00',
    location: 'H5',
    description: '5-step plan on how not to be a failure in life',
  }
  const openTaskCount = 67; // Mock data for open tasks count
  const mileStoneProgress = 69;

  const lastMeeting = {
    title: 'Besprechungsmeeting A1',
    date: '1998-06-15',
    protocolId: 1,
    location: 'H5',
    summary: 'Zusammenfassung des letzten Meetings'
  }
  // Milestones for the Roadmap
  const steps = [
    { label: 'Themenfindung', status: 'complete' },
    { label: 'Protokollierung', status: 'complete' },
    { label: 'Aufgabenverteilung', status: 'complete' },
    { label: 'Dokumentation', status: 'current' },
    { label: 'Abgabe', status: 'upcoming' },
  ]
  // hauptcontainer for the screen next to the sidebar with standardized padding
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