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
  // Next we need to handle the form submission.
  // This function will be called when the user submits the form. It prevents the default form submission behavior, logs the form data to the console (for now), and then navigates back to the protocols page.
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Neues Protokoll wurde gespeichert:', formData)
    // AFter Saving the user is returned to the overview
    navigate('/protokolle')
  }

  return (
    // max-w-4xl here is very important to make sure that the form does not stretch too much on larger screens,
    // which would make it harder to read and fill out. The padding ensures that there is enough space around the content, making it more visually appealing and easier to interact with.
    <main className="flex-1 overflow-y-auto p-6 md:p-10 max-w-4xl">
      {/* Lets start of with a "zurück" button & the header */}
      <div className="mb-6">
        <Link to="/protokolle" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Zurück zur Übersicht</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900"> Neues Protokoll anlegen</h1>
        <p className="text-sm text-gray-500 mt-1">
          Neues Meeting Protokoll anlegen
        </p>
      </div>
      {/* Lets start building he basic form structure:
    We will use a form element to wrap all the input fields. Every input field has a label for easy access. 
    The form will of course have a submit button at the end. The Design as always is built using TailwindCSS classes */}
      {/* onSubmit={handleSubmit} handles the submission in the form when the User clicks the button.  */}
      {/* space-y-6 is a design game-changer here, as it adds a nice vertical spacing between the different sections of the form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>Allgemeine Informationen</span>
          </h2>
          {/* Meeting Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Titel des Meetings *
            </label> <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="z.B. Meeting 03: Feedback zu Kapitel 2"
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </form>.
    </main>
  )
}

export default NewProtocolPage