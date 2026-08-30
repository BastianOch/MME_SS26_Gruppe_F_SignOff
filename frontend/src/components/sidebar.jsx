import { NavLink } from 'react-router'

const linkClasses = ({ isActive }) =>
  `flex items-center p-2 rounded-md ${
    isActive
      ? 'bg-gray-200 text-gray-900 font-medium'
      : 'text-gray-700 hover:bg-gray-100'
  }`

function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800">
          SignOff
        </h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-4">
        <NavLink to="/" end className={linkClasses}>
          Dashboard
        </NavLink>

        <NavLink to="/protokolle" className={linkClasses}>
          Protokolle
        </NavLink>

        <NavLink to="/aufgaben" className={linkClasses}>
          Aufgaben
        </NavLink>

        <NavLink to="/dokumente" className={linkClasses}>
          Dokumente
        </NavLink>
      </nav>

      <NavLink
        to="/profil"
        className="p-4 border-t border-gray-200 hover:bg-gray-100"
      >
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-300 rounded-full shrink-0" />

          <div className="ml-3">
            <p className="text-sm font-medium text-gray-800">
              Max Mustermann
            </p>
            <p className="text-xs text-gray-500">
              Student
            </p>
          </div>
        </div>
      </NavLink>
    </aside>
  )
}

export default Sidebar