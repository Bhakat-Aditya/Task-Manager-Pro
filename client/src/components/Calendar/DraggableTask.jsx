import { useDraggable } from "@dnd-kit/core";

export const DraggableTask = ({ task, onEdit, onDelete, onView }) => {
  const safeId = String(task._id || task.id);
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `draggable-${safeId}`,
    data: { type: "TaskBlueprint", task },
  });

  return (
    <div
      ref={setNodeRef}
      style={{ opacity: isDragging ? 0.4 : 1 }}
      className="group relative p-4 bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm transition-all hover:border-blue-300 dark:hover:border-gray-600"
    >
      <div
        {...listeners}
        {...attributes}
        className="cursor-grab active:cursor-grabbing pb-6"
      >
        <h3 className="font-semibold text-black dark:text-white">
          {task.title}
        </h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
          {task.defaultDescription}
        </p>
      </div>

      {/* Action Buttons (Visible on hover) */}
      <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onView(task)}
          className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-md hover:text-blue-500"
          title="View"
        >
          👁️
        </button>
        <button
          onClick={() => onEdit(task)}
          className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-md hover:text-yellow-500"
          title="Edit"
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-md hover:text-red-500"
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};
