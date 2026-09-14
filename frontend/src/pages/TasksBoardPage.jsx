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
  // filtering the tasks acoording to the active filter
  // ALL shows every single task but other than that just the ones with right status
  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === 'all') return true
    return task.status === activeFilter
  })
  // Now we add the logic to switch status between 'open' and 'completed'
  // Toggles task status between 'open' and 'completed' (Immutable State Update).
  // Uses .map() to find the matching taskId, flips its status via ternary operator,
  // and keeps all other tasks unchanged.
  const toggleTaskStatus = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            status: task.status === 'completed' ? 'open' : 'completed',
          }
        }
        return task
      }
      )
    )
  }
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
        </div>
        {/* Button: Neue Aufgabe anlegen */}
        <button
          onClick={() => console.log('Neue Aufgabe anlegen geklickt')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Neue Aufgabe</span>
        </button>
      </div>
      {/* Lets add a task List working in unsion with the filter */}
      <div className="space-y-3">

        {filteredTasks.length === 0 ? (
          // Starting of with an empty-state meaning there are no tasks in the filtered category
          <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500">
            <CheckCircle2 className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-medium">Keine Aufgaben in dieser Kategorie vorhanden.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id}
              className={`bg-white p-4 sm:p-5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm hover:border-gray-300 ${task.status === 'completed'
                ? 'border-gray-200 bg-gray-50/50 opacity-75'
                : 'border-gray-200'
                }`}
            >
              {/* Checkbox, Title and, last but not least, the META Infos */}
              <div className="flex items-start gap-3.5">
                {/* Lets add an interactive checkbox button */}
                <button type="button" on onClick={() => toggleTaskStatus(task.id)}
                  className="mt-0.5 shrink-0 cursor-pointer focus:outline-none"
                  title="Status ändern"
                >
                  {/* 3-State Icon rendering: 
    - completed: Green Checkmark
    - in_progress: Yellow Clock icon
    - open: Empty interactive checkbox square */}
                  {task.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 hover:text-green-700 transition-colors" />
                  ) : task.status === 'in_progress' ? (
                    <Clock className="w-5 h-5 text-yellow-600 hover:text-green-600 transition-colors" />
                  ) : (
                    <div className="w-5 h-5 rounded-md border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors" />
                  )}
                </button>
                <div>
                  {/* Task title */}
                  {/* Strike-through effect: line-through & text-gray-400 visually marks completed tasks */}
                  <h3
                    className={`text-sm font-semibold transition-all ${task.status === 'completed'
                      ? 'line-through text-gray-400'
                      : 'text-gray-900'
                      }`}
                  >
                    {task.title}
                  </h3>
                  {/* Meta-Information */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-1.5">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-gray-400" />
                      <span>{task.meeting}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>Fällig bis: {task.dueDate}</span>
                    </span>
                  </div>
                </div>
              </div>
              {/* 2. Right Side: Priority Badge */}
              {/* Priority Badges: Conditional color-coding (High = Red alert, Medium = Yellow, Low = Gray) */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                {task.priority === 'high' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Hohe Priorität
                  </span>
                ) : task.priority === 'medium' ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-yellow-50 text-yellow-800 border border-yellow-200">
                    Mittlere Priorität
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                    Niedrige Priorität
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </main >
  )
}

export default TasksBoardPage