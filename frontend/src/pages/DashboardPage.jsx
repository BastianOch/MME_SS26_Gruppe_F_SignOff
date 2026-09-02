import { Link } from 'react-router'
import { Calendar, MapPin, CheckSquare, FileText, CheckCircle2, Circle, PlusCircle, Clock } from 'lucide-react'

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
    <main className="flex-1 overflow-y-auto p-6 md:p-10 max-w-5xl">
      {/* //Title */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h1>
      </header>

      <div className="space-y-6">
        {/* // Starting with the first row: Nächstes Meeting und Offene Aufgaben which is dvided into two rows */}
        {/* // First up: Nächstes Meeting */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start gap-4">
          {/* // Icon-Badge */}
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />

          </div>
        </div>
      </div>
      {/* // Next-Up: Offene Aufgaben */}

      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Offene Aufgaben
      </p>
      <p className="text-4xl font-extrabold text-gray-900 mt-1">
        {openTaskCount}
      </p>
      <p className="text-sm text-blue-500 mt-1">
        Noch zu bearbeitende Aufgaben
      </p>
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
        <CheckSquare className="w-6 h-6" />
      </div>
      {/* // For the grids AI was used to help figuring out a proffessional locking layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* // Setting up a progress bar for tracking the milestone progress */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col justify">
          <div>
            {/* // Title for the progress bar */}
            {/* // Title design is based on a common design philosophy called the "Eyebrow" where small uppercase titels are placed upon bodies of information
            // This serves as a sort of badge or pointer for the user information which makes the box as a whole more structured
            // This contrast between little uppercase titles (label) and large and bold bodies of text (content) helps the user by highlighting their data */}
            <p classname="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Gesammelte Meilensteine!
            </p>
            
          </div>
        </div>
      </div>

    </main >
  )
}

export default DashboardPage