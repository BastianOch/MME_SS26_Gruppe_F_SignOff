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

  // State variables to hold the form data
  const [formData, setFormData] = useState({
    title: '',
    // Default to today's date
    date: new Date().toISOString().split('T')[0],
    time: '',
    location: '',
    attendees: '',
    summary: '',
    notes: '',
    todos: '',
    signDirectly: false,
  })
  // Universal function to handle changes in the form fields, updating the state accordingly. It checks the type of input (checkbox or text) and updates the corresponding state variable.
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }))
  }
  // Next we need to handle the form submission. This function will be called when the user submits the form. It prevents the default form submission behavior, logs the form data to the console (for now), and then navigates back to the protocols page.
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Neues Protokoll wurde gespeichert:', formData)
    // AFter Saving the user is returned to the overview
    navigate('/protokolle')
  }

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