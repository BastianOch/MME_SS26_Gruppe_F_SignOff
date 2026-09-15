import { useState } from 'react'
import {
  FolderArchive,
  UploadCloud,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  Eye,
  Calendar,
  HardDrive
} from 'lucide-react'

function DocumentHistoryPage() {
  // Lets build some mock data to see if everything works properly 
  const initialDocuments = [
    {
      id: 1,
      name: 'Bachelorarbeit_Was_tue_ich_mit_meinem_Leben_?',
      chapter: 'Gesamtdokument (Kapitel 1-4)',
      version: 'v6.9',
      uploadedAt: '2026-06-12',
      size: '4.8 MB',
      status: 'review', // 'approved' | 'review' | 'changes_requested'
      reviewedBy: 'Meister Jürgen Propper',
      feedback: 'Fassen sie sich kürzer in ihren sinnfreien Aussagen',
    }
      {
      id: 2,
      name: 'Bachelorarbeit_Was_tue_ich_mit_meinem_Leben_V2',
      chapter: 'Kapitel 1: Stand der Lebens',
      version: 'v1.5',
      uploadedAt: '2028-06-01',
      size: '1.2 MB',
      status: 'approved',
      reviewedBy: 'Jonathan Apelt',
      feedback: 'FREIGEGEBN',
    },
  ]
  return (
    <main>
      <h1>Dokumentenhistorie</h1>
      <p>Hier wird später die Dokumentenhistorie angezeigt.</p>
    </main>
  )
}

export default DocumentHistoryPage