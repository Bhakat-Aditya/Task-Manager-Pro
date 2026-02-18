import { useDraggable } from '@dnd-kit/core';

export const DraggableTask = ({ task }) => {
  // Enforce a strict, unique string ID for DndKit
  const safeId = String(task._id || task.id || Math.random());
  
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `draggable-${safeId}`,
    data: { type: 'TaskBlueprint', task }
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ opacity: isDragging ? 0.4 : 1 }} // Fade the original while dragging
      className={`
        p-4 bg-white dark:bg-[#121212] border rounded-xl shadow-sm transition-all
        cursor-grab active:cursor-grabbing 
        ${isDragging ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-gray-600'}
      `}
    >
      <h3 className="font-semibold text-black dark:text-white">{task.title}</h3>
      <p className="text-xs text-gray-500 mt-1">{task.defaultDescription}</p>
    </div>
  );
};