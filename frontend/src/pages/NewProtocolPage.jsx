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
    <main>
      <h1>Neues Meeting - Protokoll</h1>
      <p>Hier sollen später die Protokolle angelegt werden.</p>
    </main>
  )
}

export default NewProtocolPage