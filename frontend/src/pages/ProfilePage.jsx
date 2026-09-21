import { useState } from 'react'
import {
  User,
  Mail,
  GraduationCap,
  Fingerprint,
  Key,
  ShieldCheck,
  Calendar,
  BookOpen,
  Save,
  CheckCircle2,
  Smartphone
} from 'lucide-react'

function ProfilePage() {
  // Central Profile-page hub including Profile, Data concerning recent work and last but not least security options
  // As always lets add some mock data first
  // Note that i added a passkey here this does not reflect the final project yet
  const [profileData, setProfileData] = useState({
    name: 'Thomas Straubi',
    email: 'bastian.och@stud.uni-regensburg.de',
    matriculationNumber: '2189402',
    studyProgram: 'Medieninformatik (B.Sc.)',
    thesisTitle: 'Akademisches Mentoring-Logbuch: Konzeption und Umsetzung eines webbasierten SignOff-Systems',
    supervisor: 'Dr. Nils Hellwig',
    startDate: '2024-04-01',
    submissionDeadline: '2029-09-30',
    twoFactorEnabled: true,
    passkeys: [
      { id: 1, name: 'Windows Hello (Laptop)', createdAt: '2024-04-05', lastUsed: '2024-04-05' },
    ],
  })
  // This niffty little equation takes the first Letters of the first- and surname
  // This makes up the avatar-badge in a dynamic way
  const userInitials = profileData.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
  return (
    // Setting up a basic layout structure
    // space-y-8 establishes a 32px gap between the different cards
    <main className="flex-1 overflow-y-auto p-6 md:p-10 max-w-5xl space-y-8">
      {/* Lets start with the header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
          <User className="w-7 h-7 text-blue-600" />
          <span>Profil & Einstellungen</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Profilverwaltung
        </p>
      </div>
      {/* Academic Data in overview*/}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3 mb-5 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-blue-600" />
          <span>Datenverwaltung</span>
        </h2>
        {/* Profile head with a dynamic Avatar-badge */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-gray-100">
          {/* Avatar-Circle using the equation from above!*/}
          <div className="w-16 h-16 rounded-full bg-blue-600 text-white text-xl font-bold flex items-center justify-center shrink-0 shadow-sm">
            {userInitials}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{profileData.name}</h3>
            <p className="text-sm text-gray-500">{profileData.studyProgram} • Universität Regensburg</p>
          </div>
        </div>
        {/* Grid for Marticulation number and Email*/}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
          {/* Marticulation number */}
          {/* Note that the Marticulation Number is once again in Mono-font to be more visible to the User  */}
          <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-100">
            <span className="text-xs text-gray-500 block">Matrikelnummer</span>
            <span className="text-sm font-semibold text-gray-900 font-mono mt-0.5 block">
              {profileData.matriculationNumber}
            </span>
          </div>
          {/* E-Mail */}
          <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-100">
            <span className="text-xs text-gray-500 block">E-Mail</span>
            {/* truncate takes long text elements like the Emails and cuts it off with ... */}
            <span className="text-sm font-semibold text-gray-900 mt-0.5 flex items-center gap-1.5 truncate">
              <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>{profileData.email}</span>
            </span>
          </div>
        </div>
      </div >
    </main >
  )
}

export default ProfilePage