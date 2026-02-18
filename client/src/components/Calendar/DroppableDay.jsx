import { useDroppable } from '@dnd-kit/core';

export const DroppableDay = ({ dateNum, tasks }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `day-${dateNum}`, // e.g., 'day-15'
    data: { dateNum }
  });

  return (
    <div 
      ref={setNodeRef}
      className={`
        border-r border-b border-gray-100 dark:border-gray-800/60 p-2 flex flex-col min-h-[100px] transition-colors group
        ${isOver ? 'bg-blue-50 dark:bg-blue-900/20 shadow-inner' : 'hover:bg-gray-50 dark:hover:bg-gray-800/30'}
      `}
    >
      {/* Date Number Badge */}
      <span className={`
        text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full transition-colors
        ${dateNum === new Date().getDate() ? 'bg-blue-600 text-white' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'}
      `}>
        {dateNum}
      </span>

      {/* Render Tasks placed on this day */}
      <div className="mt-2 flex-1 flex flex-col gap-1.5 w-full">
        {tasks.map((task, idx) => (
          <div 
            key={idx} 
            className="text-xs px-2 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded border border-gray-200 dark:border-gray-700 shadow-sm truncate flex items-center gap-2"
          >
            {/* Status toggle circle (UI only for now) */}
            <button className="w-3 h-3 rounded-full border border-gray-400 dark:border-gray-500 hover:border-green-500 shrink-0"></button>
            {task.title}
          </div>
        ))}
      </div>
    </div>
  );
};