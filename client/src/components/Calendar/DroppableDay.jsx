import { useDroppable } from '@dnd-kit/core';

export const DroppableDay = ({ dateNum, tasks, onClick }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `day-${dateNum}`,
    data: { dateNum }
  });

  return (
    <div 
      ref={setNodeRef}
      onClick={() => onClick(dateNum)}
      // h-full and overflow-hidden prevent the calendar from growing
      className={`
        h-full border-r border-b border-gray-200 dark:border-gray-800 p-2 flex flex-col overflow-hidden transition-all duration-300 group cursor-pointer
        ${isOver ? 'bg-blue-50/50 dark:bg-blue-900/20 ring-2 ring-inset ring-blue-500/50' : 'bg-white dark:bg-[#0a0a0a] hover:bg-gray-50 dark:hover:bg-[#121212]'}
      `}
    >
      <div className="flex justify-between items-start mb-1">
        <span className={`
          text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full transition-all duration-300
          ${dateNum === new Date().getDate() ? 'bg-blue-600 text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white'}
        `}>
          {dateNum}
        </span>
      </div>

      {/* flex-1 and overflow-y-auto lets tasks scroll inside the cell without expanding it */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 w-full pr-1 custom-scrollbar">
        {tasks.map((task, idx) => (
          <div 
            key={idx} 
            className="text-xs px-2 py-1.5 bg-gray-50 dark:bg-[#1a1a1a] text-black dark:text-white rounded-md border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-2 group/task"
          >
            {/* The clickable completion circle */}
            <button 
              onClick={(e) => {
                e.stopPropagation(); // Prevents opening the day modal when clicking complete
                // In a full app, you'd trigger a status update API here
              }}
              className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:bg-green-500 hover:border-green-500 transition-colors shrink-0"
            />
            <span className="truncate">{task.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};