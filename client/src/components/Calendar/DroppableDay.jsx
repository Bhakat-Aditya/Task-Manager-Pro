import { useDroppable } from "@dnd-kit/core";
import { DraggableCalendarTask } from "./DraggableCalendarTask";

export const DroppableDay = ({ dateNum, tasks, onClick, onToggleComplete }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `day-${dateNum}`,
    data: { dateNum },
  });

  return (
    <div
      ref={setNodeRef}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onClick(dateNum);
      }}
      className={`
        h-full border-r border-b border-gray-200 dark:border-gray-800/80 p-2 flex flex-col overflow-hidden transition-all duration-300 group cursor-pointer
        ${isOver ? "bg-blue-50/50 dark:bg-blue-900/20 ring-2 ring-inset ring-blue-500/50" : "bg-transparent hover:bg-gray-50 dark:hover:bg-[#111]"}
      `}
    >
      <div className="flex justify-between items-start mb-1">
        <span
          className={`
          text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full transition-all duration-300
          ${dateNum === new Date().getDate() ? "bg-blue-600 text-white shadow-md shadow-blue-500/30" : "text-gray-400 dark:text-gray-600 group-hover:text-black dark:group-hover:text-white"}
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
          />
        ))}
      </div>
    </div>
  );
};
