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
      {/* Grid for Meetings and assignments
      Different Layout for different screens
      gap-6 is used to create a 24px-distance between the different UI Elements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Next meeting*/}
        {/* Everything here creates a standardized white grid with a grey border
        flex items-start gap-4 puts the two chid elements next to each other with a 16px distance between them */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          {/* flex-1 makes it so that the textblock takes up the horizontal space of the screen */}
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

        {/* Next up: Offene AUfgaben */}
        {/* flex items-center justify-between: Creates two vertically centred boxes (Textblock and Icon- Badge) */}
        {/* The corresponding number for open-tasks is made big using text-4xl font-extrabold */}
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
          {/* This Link To=(...) creates a pathway to a new section without reloading the browser  */}
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
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-4">
          Fortschritte
        </p>
        {/* Using a stepper-container for line positioning */}
        <div className="relative flex items-center justify-between">
          {/* Drawing a line at the absolute bottom -> z-0 */}
          <div className="absolute left-0 top-4 w-full h-1 bg-gray-300 z-0" />
          {/* Using the data from the Array above we can organically generate the necessary steps */}
          {/* The steps.map method creates a new Element for every Array Member */}
          {steps.map((step, index) => (
            <div key={index}
              className="relative z-10 flex flex-col items-center bg-white px-2"
            >
              {/* Now assigning an icon to each state */}
              {/* Lets start with: complete: A green checkmark */}
              {step.status === 'complete' ? (
                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              ) : step.status === 'current' ? (
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs ring-4 ring-blue-100">
                  <Circle className="w-4 h-4 fill-white" />
                </div>
              ) : (<div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center border-2 border-white">
                <Circle className="w-5 h-5" />
              </div>
              )}
              <span
                className={`text-xs font-medium mt-2 text-center ${step.status === 'complete' || step.status === 'current'
                  ? 'text-gray-900 font-semibold'
                  : 'text-gray-400'
                  }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <Link
        to="/protokolle/neu"
        className="w-full py-4 bg-white hover:bg-blue-50 text-blue-600 hover:text-blue-700 text-base font-semibold rounded-xl border-2 border-dashed border-blue-300 hover:border-blue-500 flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer mt-6 block text-center"
      >
        {/* Plus-Icon next to the button text */}
        <PlusCircle className="w-5 h-5 shrink-0" />
        <span>Neues Meeting - Protokoll erstellen</span>
      </Link>
    </main >
  )
}

export default DashboardPage