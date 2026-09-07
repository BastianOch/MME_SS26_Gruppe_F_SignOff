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
    </main >
  )
}

export default ProtocolsPage