import { useState } from 'react'
import {
  CheckSquare,
  Plus,
  Calendar,
  AlertCircle,
  Clock,
  CheckCircle2,
  Filter,
  Tag,
  ArrowRight
} from 'lucide-react'

function TasksBoardPage() {
  // First of all: Lets add some mock data 
  const initialTasks = [
    {
      id: 1,
      title: 'Reworking my identity ',
      status: 'open', // Open |in progress| completed
      priority: 'high',// 'high' | 'medium' | 'low'
      dueDate: '2024-06-15',
      meeting: 'Meeting 01: Grundlagen',
      assignedTo: 'Bastian Och',
    },
    {
      id: 2,
      title: 'Adjusting to my surroundings',
      status: 'in_progress',
      priority: 'high',
      dueDate: '2024-06-20',
      meeting: 'Meeting 02: Aufgabenverteilung',
      assignedTo: 'Bastian Och',
    }
  ]
  // State for the different tasks with a built in Filter!
  const [tasks, setTasks] = useState(initialTasks)
  const [activeFilter, setActiveFilter] = useState('all')
  // Finally adding a count for the header stats
  const totalCount = tasks.length
  const openCount = tasks.filter((t) => t.status === 'open').length
  const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length
  const completedCount = tasks.filter((t) => t.status === 'completed').length

  return (
    // 
    <main className="flex-1 overflow-y-auto p-6 md:p-10 max-w-6xl">
      {/* // Header with title & Stats */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex flex-items-center gap-2.5">
            <CheckSquare className="w-7 h-7 text-blue-600" />
            <span>Aufgaben</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Alle To-Dos und Meilensteinaufgaben
          </p>
        </div>
        {/* Next-up: Quick Stat Badges */}
        {/* This helps the User to quickly see what is already done and what still needs doing */}
        {/* The different Colors help highlight what still needs doing (yellow) and what is already done (green) */}
        {/* px-3 py-1.5 rounded-lg border gives everything a modern look by rounding everything out */}
        <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-semibold">
          {/* Gesamt-Badge (Neutral Grey) */}
          <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg border border-gray-200">
            Gesamt: {totalCount}
          </span>
          {/* Offen-Badge (Yellow)  */}
          <span className="px-3 py-1.5 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
            Offen: {openCount + inProgressCount}
          </span>
          {/* Erledigt-Badge (Green) */}
          <span className="px-3 py-1.5 bg-green-50 text-green-800 rounded-lg border border-green-200">
            Erledigt: {completedCount}
          </span>
        </div>
      </header>
      {/* Next up: A quick add button and a Filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* Filter-Tabs: Activating the activeFilter State*/}
        {/* So what happens here is that the currently active filter button is set to bg-blue-600 while the inactice ones are bg-white text-gray-600 */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {/* Tab: All */}
          {/* setActiveFilter gets changed on click */}
          {/* overflow-x-auto pb-1 sm:pb-0 is really importnat since it enables user with smartphone screens to scroll horizontally without destroying the layout */}
          <button onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${activeFilter === 'all'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
          >ALLE ({totalCount})
          </button>

          {/* Tab: Open */}
          <button
            onClick={() => setActiveFilter('open')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${activeFilter === 'open'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
          >
            Offen ({openCount})
          </button>
          {/* Tab: In Bearbeitung */}
          <button
            onClick={() => setActiveFilter('in_progress')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${activeFilter === 'in_progress'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
          >
            In Bearbeitung ({inProgressCount})
          </button>
          {/* Tab: Erledigt */}
          <button
            onClick={() => setActiveFilter('completed')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${activeFilter === 'completed'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
          >
            Erledigt ({completedCount})
          </button>

          {/* Button: Neue Aufgabe anlegen */}
          <button
            onClick={() => console.log('Neue Aufgabe anlegen geklickt')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Neue Aufgabe</span>
          </button>
        </div>
      </div>
    </main >
  )
}

export default TasksBoardPage