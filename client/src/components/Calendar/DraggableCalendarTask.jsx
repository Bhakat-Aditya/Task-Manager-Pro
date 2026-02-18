import { useDraggable } from "@dnd-kit/core";

export const DraggableCalendarTask = ({ entry, onToggleComplete }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `entry-${entry._id}`,
    data: { type: "CalendarEntry", entry }, // Identifies this as an existing entry, not a library task
  });

  const isCompleted = entry.status === "completed";

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`
        text-xs px-2 py-1.5 rounded-md border shadow-sm flex items-center gap-2 group/task transition-all cursor-grab active:cursor-grabbing
        ${isDragging ? "opacity-30 scale-95" : "opacity-100 scale-100"}
        ${isCompleted ? "bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800 text-gray-500" : "bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-800 text-black dark:text-white hover:border-blue-300 dark:hover:border-blue-600"}
      `}
    >
      <button
        onPointerDown={(e) => e.stopPropagation()} // Prevents dragging when clicking the circle
        onClick={(e) => {
          e.stopPropagation();
          onToggleComplete(entry._id, isCompleted ? "pending" : "completed");
        }}
        className={`w-4 h-4 rounded-full border-2 flex shrink-0 items-center justify-center transition-colors
          ${isCompleted ? "bg-green-500 border-green-500" : "border-gray-300 dark:border-gray-600 hover:border-green-500"}
        `}
      >
        {isCompleted && (
          <svg
            className="w-2.5 h-2.5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </button>

      <span
        className={`truncate flex-1 ${isCompleted ? "line-through opacity-60" : ""}`}
      >
        {entry.title}
      </span>

      {/* Time Badge */}
      {entry.timeOfDay && entry.timeOfDay !== "Any" && (
        <span className="text-[9px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-gray-500 font-medium tracking-wide">
          {entry.timeOfDay.charAt(0)}
        </span>
      )}
    </div>
  );
};
