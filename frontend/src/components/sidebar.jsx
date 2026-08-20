// Sidebar component
const Sidebar = () => {
    return (
        <aside classname="w-64 bg-white border-r border-gray-200 flex flex-col">
            <div classname="h-16 flex items-center px-6 border-b border-gray-200">
                <h1 classname="text-xl font-semibold text-gray-800">SignOff</h1>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-4">
                <a href="#" classname="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md">
                    <span classname="ml-3">Dashboard</span>
                </a>
                <a href="#" classname="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md">
                    <span classname="ml-3">Protokolle</span>
                </a>
                <a href="#" classname="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md">
                    <span classname="ml-3">Dokumente</span>
                </a>
            </nav>
            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-gray-800">Max Mustermann</p>
                        <p className="text-xs text-gray-500">Student</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default sidebar;