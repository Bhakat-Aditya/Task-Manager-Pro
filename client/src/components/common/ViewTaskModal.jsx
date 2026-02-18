export const ViewTaskModal = ({ isOpen, onClose, task }) => {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
      <div className="w-full max-w-sm bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl p-6" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-black text-gray-900 dark:text-white">{task.title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>
        
        <div className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-semibold tracking-wide mb-4">
          ⏱ {task.timeOfDay || 'Any Time'}
        </div>

        <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-xl p-4 border border-gray-100 dark:border-gray-800">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</h4>
          <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">
            {task.defaultDescription || task.customDescription || 'No description provided.'}
          </p>
        </div>
      </div>
    </div>
  );
};