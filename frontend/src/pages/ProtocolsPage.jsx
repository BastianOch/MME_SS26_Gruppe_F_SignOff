import { Link } from 'react-router'
import {
  Plus,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  Clock,
  FileText,
  ChevronRight,
} from 'lucide-react'

function ProtocolsPage() {
  // Creating an Array to hold the Data for later
  // This is a temporary solution until we have a backend to fetch the data from
  // This is compatible with the database -> JSON format
  const protocols = [
    {
      id: 1,
      title: 'Meeting 01: Grundlagen',
      date: '2024-06-01',
      time: '10:00',
      location: 'H5',
      summary: 'Besprechung der Grundlagen und Einführung in das Projekt',
      atendees: 'Tung Tung, Sahur Melanie, Thomas Straubinger',
      status: 'signed',
    },
    {
      id: 2,
      title: 'Meeting 02: Aufgabenverteilung',
      date: '2024-06-08',
      time: '10:00',
      location: 'H98',
      summary: 'Besprechung der Aufgabenverteilung',
      atendees: 'Tung Tung, Sahur Melanie, Thomas Straubinger',
      status: 'pending',
    }
  ]
  return (
    // Header: Title on the left side and buttons on the right
    // Main container for the page with padding and max width
    // flex enables the layout to takt up the remaining horizontal space
    // overflow-y-auto allows the content to scroll vertically if it exceeds the viewport height
    // p-6 md:p-10 adds padding to the container, with different values for small and medium screens
    <main className="flex-1 overflow-y-auto p-6 md:p-10 max-w-5xl">
      {/* // sm:flex-row enables Smartphones to view the header in a row layout, while larger screens will display it in a column layout */}
      {/* // gap-4 adds a 16px gap between the header elements, and mb-8 adds a 32px margin below the header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>

          {/* // This section handles the font layout to make the title big and easy to see while keeping the description smaller */}
          <h1 className="text-2xl font-bold text-gray-900">Meeting-Protokolle</h1>
          <p className="text-sm text-gray-500 mt-1">
            Übersicht über alle bisherigen Gespräche und Freigaben!
          </p>
        </div>
        {/* // Button to create a new Protocol, with a plus icon and a link to the new protocol page */}
        {/* // The button is styled in a standard-proffessional way with a blue background, white text, and rounded corners
      // self-start sm:self-auto ensures that the button is aligned to the start of the container on small screens and auto on larger screens */}
        <Link
          to="/protokolle/neu"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white
          text-sm font-semibold rounded-lg shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Neues Protokoll</span>
        </Link>
      </header>
      {/* Next up: The protocoll list which is rendered with the.map() method */}
      <div className="space-y-4">
        {protocols.map((protocol) => (
          <div
            key={protocol.id}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-gray-300 transition-all"
          >
            {/* Lets start with the header: Icon and Title go on the right and the status icon will be on the right side */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">{protocol.title}</h2>
              </div>
              {/* Now lets start setting up the status icon using a ternary operator
              Here is how it works: If the status is "signed", we will show a green checkmark, if it is "pending", we will show a yellow clock icon, and if it is "rejected", we will show a red cross icon */}
              {protocol.status === 'signed' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Signiert
                </span>
              ) : protocol.status === 'pending' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                  <Clock className="w-3.5 h-3.5" />
                  Ausstehend
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                  <XCircle className="w-3.5 h-3.5" />
                  Abgelehnt
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
export default ProtocolsPage