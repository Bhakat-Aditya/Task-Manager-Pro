export const DayViewModal = ({ isOpen, onClose, dateNum, tasks, libraryTasks, onQuickAdd }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>
        
        <header className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
          <h3 className="text-xl font-bold dark:text-white">February {dateNum}, 2026</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
        </header>

        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Scheduled Tasks</h4>
          {tasks.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No tasks scheduled for this day.</p>
          ) : (
            <div className="space-y-2">
              {tasks.map((task, i) => (
                <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-gray-400"></div>
                  <span className="font-medium dark:text-gray-200">{task.title}</span>
                </div>
              ))}
            </div>
          )}

          <div className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-800">
             <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Add from Library</h4>
             <div className="flex flex-wrap gap-2">
               {libraryTasks.map(libTask => (
                 <button 
                   key={libTask._id}
                   onClick={() => onQuickAdd(libTask._id)}
                   className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors border border-blue-200 dark:border-blue-800"
                 >
                   + {libTask.title}
                 </button>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};