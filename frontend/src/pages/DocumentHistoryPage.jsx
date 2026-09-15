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
    },
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
  const [documents, setDocuments] = useState(initialDocuments)
  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-10 max-w-6xl">
      {/* Starting with the header with title and upload button */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
            <FolderArchive className="w-7 h-7 text-blue-700" />
            <span>Dokumentenhistorie & Sign-Offs</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Alle hochgeladenen Entwürfe, Versionsverläufe und offizielle Freigaben deiner Bachelorarbeit.
          </p>
        </div>
        {/* Upload Button */}
        {/* self-start & sm:self-auto once again helps with the layout on different devices */}
        <button
          onClick={() => console.log('Neues Dokument hochladen geklickt')}
          // inline-flex items-center gap-2 transformes the button into a flex-container and helps with the general layout
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors self-start sm:self-auto cursor-pointer"
        >
          {/* Upload-Icon 16 x 16 px */}
          <UploadCloud className="w-4 h-4" />
          <span>Dokument hochladen</span>
        </button>
      </header>
    </main>
  )
}

export default DocumentHistoryPage