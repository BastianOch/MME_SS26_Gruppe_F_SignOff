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
  return (
    <main>
      <h1>Profil</h1>
      <p>Hier wird später das Benutzerprofil angezeigt.</p>
    </main>
  )
}

export default ProfilePage