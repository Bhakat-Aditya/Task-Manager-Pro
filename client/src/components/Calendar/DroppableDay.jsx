import { useDroppable } from "@dnd-kit/core";
import { DraggableCalendarTask } from "./DraggableCalendarTask";

export const DroppableDay = ({
  dateNum,
  tasks,
  onClick,
  onToggleComplete,
  isPast,
}) => {
  // Hook must be called unconditionally
  const { isOver, setNodeRef } = useDroppable({
    id: dateNum ? `day-${dateNum}` : `empty-day`,
    data: { dateNum },
    disabled: !dateNum || isPast, // Prevent dropping onto past days or empty cells
  });

  // Render empty padding cells for the start/end of the month
  if (!dateNum) {
    return (
      <div
        ref={setNodeRef}
        className="h-full border-r border-b border-gray-200 dark:border-gray-800/40 bg-gray-50/50 dark:bg-[#0a0a0a]/50"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onClick(dateNum);
      }}
      className={`
        h-full border-r border-b border-gray-200 dark:border-gray-800/80 p-2 flex flex-col overflow-hidden transition-all duration-300 group cursor-pointer
        ${isPast ? "bg-gray-50/80 dark:bg-[#0c0c0c] opacity-90" : "bg-transparent hover:bg-gray-50 dark:hover:bg-[#111]"}
        ${isOver && !isPast ? "bg-blue-50/50 dark:bg-blue-900/20 ring-2 ring-inset ring-blue-500/50" : ""}
      `}
    >
      <div className="flex justify-between items-start mb-1">
        <span
          className={`
          text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full transition-all duration-300
          ${dateNum === new Date().getDate() && !isPast ? "bg-blue-600 text-white shadow-md shadow-blue-500/30" : "text-gray-400 dark:text-gray-600 group-hover:text-black dark:group-hover:text-white"}
        `}
        >
          {dateNum}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 w-full pr-1 custom-scrollbar">
        {tasks.map((task) => (
          <DraggableCalendarTask
            key={task._id}
            entry={task}
            onToggleComplete={onToggleComplete}
            isPast={isPast} // Pass flag down to disable dragging
          />
        ))}
      </div>
    </div>
  );
};
