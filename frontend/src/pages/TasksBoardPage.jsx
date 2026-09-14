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
    <main>
      <h1>Aufgaben-Board</h1>
      <p>Hier werden später die Aufgaben angezeigt.</p>
    </main>
  )
}

export default TasksBoardPage