import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { logout } = useAuth();

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 overflow-hidden">
      
      {/* LEFT PANEL (30%): Task Library */}
      <aside className="w-[30%] min-w-[320px] max-w-[400px] h-full border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
        
        {/* Sidebar Header */}
        <header className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Library</h1>
          <div className="flex gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Toggle Theme">
              🌓
            </button>
            <button onClick={logout} className="p-2 text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Logout">
              ⎋
            </button>
          </div>
        </header>

        {/* Task Library Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          <button className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-500 hover:text-blue-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all font-medium">
            <span className="text-xl">+</span> Add Reusable Task
          </button>

          {/* Placeholder for Draggable Tasks */}
          <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm cursor-grab">
            <h3 className="font-semibold">Workout</h3>
            <p className="text-xs text-gray-500 mt-1">Gym schedule task</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm cursor-grab">
            <h3 className="font-semibold">Review Code</h3>
            <p className="text-xs text-gray-500 mt-1">Check PRs on GitHub</p>
          </div>
        </div>
      </aside>

      {/* RIGHT PANEL (70%): Calendar View */}
      <main className="flex-1 h-full flex flex-col bg-gray-50/50 dark:bg-[#121212]">
        
        {/* Calendar Header */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <h2 className="text-2xl font-semibold">February 2026</h2>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
              Share Calendar
            </button>
          </div>
        </header>

        {/* Calendar Grid Container */}
        <div className="flex-1 p-6 overflow-hidden">
          <div className="h-full w-full border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 overflow-hidden flex flex-col">
            
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {day}
                </div>
              ))}
            </div>

            {/* The Grid Cells (Placeholders for now) */}
            <div className="flex-1 grid grid-cols-7 grid-rows-5">
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="border-r border-b border-gray-100 dark:border-gray-800/60 p-2 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors group">
                  <span className={`text-sm font-medium ${i === 18 ? 'bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-full' : 'text-gray-400 dark:text-gray-500'}`}>
                    {(i % 28) + 1}
                  </span>
                  {/* Droppable Area for Tasks */}
                  <div className="mt-2 min-h-[40px] w-full rounded-md group-hover:bg-blue-50/50 dark:group-hover:bg-blue-900/10 transition-colors"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Dashboard;