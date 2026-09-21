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
  // Calculates the remaining days before the deadline
  const deadlineDate = new Date(profileData.submissionDeadline)
  const today = new Date()
  const daysRemaining = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24))
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
      {/* Card 2: Mentoring and project*/}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>Bachelorarbeit & Betreuung</span>
          </h2>
          {/* Frist-Badge and Countdown */}
          {/* Dynamic Deadline Badge: Uses Math.ceil() calculation from above to show remaining days */}
          {/* Ternary condition checks if deadline is still in the future or already passed */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
            <Calendar className="w-3.5 h-3.5" />
            Noch {daysRemaining > 0 ? `${daysRemaining} Tage` : 'Abgegeben'}
          </span>
        </div>
        {/* Thesistitle*/}
        {/* Thesis Title Box: border-l-4 creates a prominent 4px blue accent border on the left */}
        {/* leading-relaxed provides optimal line-height for long multi-line thesis titles */}
        <div className="p-4 bg-blue-50/50 border-l-4 border-blue-600 rounded-r-xl">
          <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block mb-1">
            Offizieller Arbeitstitel
          </span>
          <p className="text-sm font-semibold text-gray-900 leading-relaxed">
            {profileData.thesisTitle}
          </p>
        </div>
        {/* Grid: Mentor, Starting date & due date */}
        {/* Responsive 3-Column Grid: Stacks vertically on mobile (grid-cols-1) and expands to 3 columns on tablet/desktop (sm:grid-cols-3) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Mentee */}
          <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-100">
            <span className="text-xs text-gray-500 block">Erstprüfer / Betreuer</span>
            <span className="text-sm font-semibold text-gray-900 mt-1 flex items-center gap-1.5">
              <User className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{profileData.supervisor}</span>
            </span>
          </div>

          {/* Login-Date */}
          <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-100">
            <span className="text-xs text-gray-500 block">Offizieller Beginn</span>
            <span className="text-sm font-semibold text-gray-900 mt-1 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
              <span>{profileData.startDate}</span>
            </span>
          </div>
          {/* Due date */}
          {/* Submission Deadline: Highlighted with text-red-600 & Calendar icon to signal urgency */}
          <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-100">
            <span className="text-xs text-gray-500 block">Abgabetermin</span>
            <span className="text-sm font-semibold text-red-600 mt-1 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-red-500 shrink-0" />
              <span>{profileData.submissionDeadline}</span>
            </span>
          </div>
        </div>
      </div>
      {/* Security & Passkey-Management */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span>Sicherheit & Authentifizierung</span>
          </h2>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Konto geschützt
          </span>
        </div>

        {/* Passkey-Section: (FIDO2 / WebAuthn) */}
        {/* FIDO2 / WebAuthn Section: Lists registered biometric hardware keys (e.g. Windows Hello, Touch ID) 
    allowing for modern, passwordless authentication */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-blue-600" />
                <span>Passkeys & Biometrie</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Passwortlose Anmeldung via Windows Hello, Touch ID oder FIDO2-Sicherheitsschlüssel.
              </p>
            </div>

            {/* Button: New Passkey */}
            <button
              type="button"
              onClick={() => console.log('Neuen Passkey registrieren geklickt')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Passkey hinzufügen</span>
            </button>
          </div>
          {/* Registrated Passkeys */}
          {/* Iterates over registered user passkeys, displaying device name, creation date and active status */}
          <div className="space-y-2">
            {profileData.passkeys.map((passkey) => (
              <div
                key={passkey.id}
                className="p-3.5 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-900 block">{passkey.name}</span>
                    <span className="text-xs text-gray-500">
                      Erstellt am {passkey.createdAt} • Zuletzt genutzt: {passkey.lastUsed}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                  Aktiv
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 2FA Toggle-Switch Sektion */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Zwei-Faktor-Authentifizierung (2FA)</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Zusätzlicher Schutz durch Einmal-Codes bei kritischen Aktionen (z.B. Meilenstein-Freigaben).
            </p>
          </div>
          {/* Pure Tailwind CSS Toggle Switch: 
    - onClick toggles twoFactorEnabled boolean in profileData state
    - Dynamic bg-blue-600 vs bg-gray-200 changes background color
    - translate-x-5 smoothly glides the white indicator circle to the right with 200ms ease-in-out transition */}
          {/* Interaktiver Toggle-Switch */}
          <button
            type="button"
            onClick={() =>
              setProfileData((prev) => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }))
            }
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${profileData.twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-200'
              }`}
          >
            {/* Der weiße Schalter-Kreis */}
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${profileData.twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
            />
          </button>
        </div>
      </div>
    </main >
  )
}

export default ProfilePage