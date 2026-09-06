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
  const milestoneProgress = 69;

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
      {/* REIHE 1: Das 2er-Grid für Meeting & Aufgaben */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* KARTE 1: Nächstes Meeting */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>

          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Nächstes Meeting
            </p>
            <p className="text-lg font-bold text-gray-900 mt-1">
              {newMeeting.date}, {newMeeting.time}
            </p>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>Ort: {newMeeting.location}</span>
            </div>
          </div>
        </div>

        {/* KARTE 2: Offene Aufgaben */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Offene Aufgaben
            </p>
            <p className="text-4xl font-extrabold text-gray-900 mt-1">
              {openTaskCount}
            </p>
            <p className="text-sm text-blue-500 mt-1">
              Noch zu bearbeitende Aufgaben
            </p>
          </div>

          <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <CheckSquare className="w-6 h-6" />
          </div>
        </div>

      </div>
      {/* // For the grids AI was used to help figure out a proffessional locking layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* // Setting up a progress bar for tracking the milestone progress */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col">
          <div>
            {/* // Title for the progress bar */}
            {/* // Title design is based on a common design philosophy called the "Eyebrow" where small uppercase titels are placed upon bodies of information
            This serves as a sort of badge or pointer for the user information which makes the box as a whole more structured
            This contrast between little uppercase titles (label) and large and bold bodies of text (content) helps the user by highlighting their data */}
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Gesammelte Meilensteine!
            </p>
            <p className="text-sm font-medium text-gray-600 mt-3 text-right">{milestoneProgress}% von 100%</p>
            <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden border border-gray-200 mt-2">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${milestoneProgress}%` }}
              />
            </div>
          </div>
        </div>
        {/* Last Meeting */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Letztes Meeting
            </p>
            <p className="text-xl font-bold text-gray-900 mt-1">
              {lastMeeting.date}
            </p>
          </div>
          {/* //button for viewing the protocol */}
          <Link
            to="/protokolle"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-lg border border-gray-300 transition-colors flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-gray-600" />
            <span>Protokoll ansehen</span>
          </Link>
        </div>
      </div>
      {/* Roadmap detailing the "Meilenstein"-Progress
      The idea here is that using the .map() method to create stepper-lists */}
      {/* Every step such as current, complete, etc. gets checked using ternary operators linked to a specific action */}
      <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm mt-6">
        {/* Eyebrow Title of the following roadmap */}
        <p className="text-xs font-semibold text-gray-200 uppercase tracking-wider mb-4">
          Fortschritte
        </p>
        {/* Using a stepper-container for line positioning */}
        <div className="relative flex items-center justify-between">
          {/* Drawing a line at the absolute bottom -> z-0 */}
        <div className="absolute left-0 top-4 w-full h-1 bg-gray-300 z-0">

        </div>
        </div>
      </div>
    </main >
  )
}

export default DashboardPage