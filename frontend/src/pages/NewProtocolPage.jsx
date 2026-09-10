import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import {
  ArrowLeft,
  Save,
  Calendar,
  Clock,
  MapPin,
  Users,
  FileText,
  CheckSquare
} from 'lucide-react'

function NewProtocolPage() {
  const navigate = useNavigate()
  return (
    // max-w-4xl here is very important to make sure that the form does not stretch too much on larger screens, which would make it harder to read and fill out. The padding ensures that there is enough space around the content, making it more visually appealing and easier to interact with.
    <main className="flex-1 overflow-y-auto p-6 md:p-10 max-w-4xl">
      {/* Lets start of with a "zurück" button & the header */}
      <div classname="mb-6">
        <Link to="/protokolle" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Zurück zur Übersicht</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900"> Neues Protokoll anlegen</h1>
        <p className="text-sm text-gray-500 mt-1">
          Neues Meeting Protokoll anlegen
        </p>
      </div>

    </main>
  )
}

export default NewProtocolPage