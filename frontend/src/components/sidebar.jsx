import { NavLink } from 'react-router'
import { LayoutDashboard, FileText, CheckSquare, FolderArchive, FileSignature } from 'lucide-react'

// Function to determine the classes for the navigation links based on their active state
const linkClasses = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
    ? 'bg-blue-50 text-blue-700 font-semibold'
    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
  }`
// Sidebar component divided into three Sections: Header, Navigation and Profile
function Sidebar() {
  return (
    // Sidebar container with fixed width and full height in unison with design standards
    // The sidebar is styled with a white background, border, and flex layout for vertical stacking of its child elements
    // flex flex-col: This class makes the sidebar a flex container with a vertical layout, allowing its child elements to be stacked vertically.
    // shrink-0: This class prevents the sidebar from shrinking when the parent container is resized, ensuring it maintains its width.
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-gray-200 gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
          <FileSignature className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900 leading-tight">
            SignOff
          </h1>
          <p className="text-xs text-gray-400 font-medium">MME SS26 Gruppe F</p>
        </div>
      </div>
      {/* // Navigation section with links to different parts of the application */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        <NavLink to="/" end className={linkClasses}>
          <LayoutDashboard className="w-5 h-5 shrink-0" />
          <span>Dashboard</span>
        </NavLink>
        {/* // Protocol section */}
        <NavLink to="/protokolle" className={linkClasses}>
          <FileText className="w-5 h-5 shrink-0" />
          <span>Protokolle</span>
        </NavLink>
        {/* // Aufgaben section */}
        <NavLink to="/aufgaben" className={linkClasses}>
          <CheckSquare className="w-5 h-5 shrink-0" />
          <span className="flex-1 min-w-0">Aufgaben</span>
          {/* // Aufgaben counter for assignments that still need to be completed */}
          <span className="px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800" >
            {openTaskCount}
          </span>
        </NavLink>
        {/* // Dokumente section */}
        <NavLink to="/dokumente" className={linkClasses}>
          <FolderArchive className="w-5 h-5 shrink-0" />
          <span>Dokumente</span>
        </NavLink>
      </nav>
      {/* // Profile section */}
      <NavLink
        to="/profil"
        className="p-4 border-t border-gray-200 hover:bg-gray-50 transition-colors">
        <div className=" flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-semibold shrink-0" />
          <div className="flex items center gap-3">
            <p className="text-sm font-medium text-gray-800 truncate">
              Tung Tung Sahur
            </p>
            <p className="text-xs text-gray-500 truncate">
              Student
            </p>
          </div>
        </div>
      </NavLink>
    </aside>
  )
}
// Exporting the Sidebar component for use in other parts of the application
export default Sidebar