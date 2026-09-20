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
      {/* Adding a hero Card: A big banner for the newest draft */}
      {/* documents.length > 0 && basically stops the app  from collapsing since this banner only gets shown if there is already a doucument there*/}
      {/* An empty Array would crash the App since documents[0].name would cause an Error */}
      {documents.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-6 rounded-2xl shadow-sm mb-8">
          {/* Upper row: Badge "Neuester Stand" & Sign-Off Status */}
          {/* Putting a little clock icon next to the "Entwurf Badge" -> rounded-full beeing the key ingredient to round the icon out */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-blue-100">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white w-fit shadow-xs">
              <Clock className="w-3.5 h-3.5" />
              Aktuellster Entwurf
            </span>
            {/* 3 way status badge for the mentor */}
            {/* Working with ternary operators to map a status to a badge, implementing this took quite a while */}
            <div className="flex items-center gap-2">
              {documents[0].status === 'approved' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Freigegeben durch {documents[0].reviewedBy}
                </span>
              ) : documents[0].status === 'changes_requested' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Überarbeitung erforderlich
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                  <Clock className="w-3.5 h-3.5" />
                  In Prüfung durch {documents[0].reviewedBy}
                </span>
              )}
            </div>
          </div>
          {/* In the middle quick actions and document details */}
          {/* Adding a a Document Icon to grab the users attention */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">
            <div className="flex items-start gap-3.5">
              {/* PDF / File-Icon Box */}
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">{documents[0].name}</h2>
                <p className="text-xs text-gray-600 mt-0.5">{documents[0].chapter}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-2">
                  <span>Version: <strong>{documents[0].version}</strong></span>
                  <span>Größe: {documents[0].size}</span>
                  <span>Hochgeladen am: {documents[0].uploadedAt}</span>
                </div>
              </div>
            </div>
            {/* Quick-Action Buttons (Download) */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                type="button"
                onClick={() => console.log('Vorschau:', documents[0].name)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg border border-gray-200 shadow-xs transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4 text-gray-500" />
                <span>Vorschau</span>
              </button>
              <button
                type="button"
                onClick={() => console.log('Download:', documents[0].name)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          </div>
          {/* Last Line: Feedback from the mentor */}
          {/* Same logic as above: This only gets rendered if there actually is a document */}
          {/* The Feedback changes its font to "italic" to highlight it */}
          {documents[0].feedback && (
            <div className="mt-5 p-3.5 bg-white/80 backdrop-blur-xs rounded-xl border border-blue-100 text-xs text-gray-700">
              <strong className="text-blue-900 font-semibold block mb-1">
                Letztes Feedback von {documents[0].reviewedBy}:
              </strong>
              <p className="italic text-gray-600">"{documents[0].feedback}"</p>
            </div>
          )}
        </div>
      )}

    </main >
  )
}

export default DocumentHistoryPage