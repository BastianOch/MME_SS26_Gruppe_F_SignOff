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
            {/* htmlFor="title" replaces the "for" in JavaScript and connects the label with the input field. */}
            {/* This is important for accessability since the purpose of the input is abundantly clear
            When the label is clicked the input field will automatically be focused */}
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              {/* Notice the *-Symbol as its a equired field */}
              Titel des Meetings *
            </label> <input
              type="text"
              id="title"
              // This is very important for REACT, since formData gets updated
              name="title"
              // "required" nudges the user to fill out6 the field. It also adds a red border to the input field
              required
              value={formData.title}
              // Every keystroke triggers the handleChange function, updating the formData in the progress!
              onChange={handleChange}
              placeholder="Tung Tung Sahur"
              // Pretty standard layout for the input fields with a few exceeptions:
              // w-full makes it so, that the input field takes up 100%  of the available width
              // focus:outline-none removes the default line when focused by the user!
              // focus:ring-2 focus:ring-blue-500 adds a nice blue ring around the input field when focused by the user
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Now lets build a 3-column-grid layout for Date, Time and Location
          Design wise the grids have a different appearance depending on the users device
          grid-cols is for standard desktop devices, while sm:fird-cols is used for smaller devices */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Datum *
              </label>
              <input
                // type="date" is a native HTML5 calendar input field allowing for a much more responsive user experience
                type="date"
                id="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Time */}
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                Uhrzeit *
              </label>
              <input
                type="time"
                id="time"
                name="time"
                required
                value={formData.time}
                onChange={handleChange}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Raum / Ort
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="z.B. PT 3.0.42 / Zoom"
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          {/* Attendees */}
          <div>
            <label htmlFor="attendees" className="block text-sm font-medium text-gray-700 mb-1">
              Teilnehmer
            </label>
            <input
              type="text"
              id="attendees"
              name="attendees"
              value={formData.attendees}
              onChange={handleChange}
              placeholder="z.B. Dr. Nils Hellwig, Max Mustermann"
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        {/* Next up: Inhalte und Vereinbarungen  */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>Inhalte & Vereinbarungen</span>
          </h2>
          {/* Next up: a quick little summary of everything relevant */}
          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
              Zusammenfassung *
            </label>
            <input
              type="text"
              id="summary"
              name="summary"
              required
              value={formData.summary}
              onChange={handleChange}
              placeholder=" Wir besprechen Thomas' Obsession mit Age of Empires"
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Next up: Relevant Notes (Textarea) */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notizen
            </label>
            {/* // TextArea is commonly used for bigger text inputs, f.e.: comments
        // rows defines the standardized height of the textarea */}
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              placeholder="z.B. Thomas ist ein absoluter Nerd und spielt Age of Empires 24/7"
              // resize-y allows the user to resize the textarea, but only vertically
              // This makes for a good design compromize 
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
          </div>
          {/* Next up: Todos */}
          <div>
            <label htmlFor="todos" className="block text-sm font-medium text-gray-700 mb-1">
              Vereinbarte Aufgaben & ToDos
            </label>
            <textarea
              id="todos"
              // Same as above, but this time for the todos field
              name="todos"
              rows={3}
              value={formData.todos}
              onChange={handleChange}
              placeholder="Thomas soll eine Präsentation über Age of Empires halten"
              // Same Layout as above, but this time for the todos field
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
          </div>
        </div>
        {/* Lets build our third card: Action button & release option
        Again we use flex-col and sm:flex-row to account for all devices */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Adding a checkbox to release the protocol directly */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              id="signDirectly"
              name="signDirectly"
              checked={formData.signDirectly}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-700">
              Direkt als signiert / freigegeben markieren
            </span>
          </label>
          {/* Save Button and Cancel Button */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Abbrechen: Takes you back to the overview without saving */}
            <Link
              to="/protokolle"
              className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors"
            >
              Abbrechen
            </Link>
            {/* Speichern: type="submit" triggers onSubmit={handleSubmit} meaning that the protocol gets saved */}
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Protokoll speichern</span>
            </button>
          </div>
        </div>
      </form >
    </main >
  )
}

export default NewProtocolPage