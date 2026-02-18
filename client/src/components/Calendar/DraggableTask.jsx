import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export const DraggableTask = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `library-${task.id}`, // Unique ID for the draggable item
    data: { type: 'TaskBlueprint', task } // Payload we send when dropped
  });

  const style = {
    // We only want to translate (move) the item, not distort it
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        p-4 bg-white dark:bg-gray-800 border rounded-xl shadow-sm transition-all
        cursor-grab active:cursor-grabbing 
        ${isDragging ? 'border-blue-500 opacity-80 z-50 ring-2 ring-blue-500/50' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'}
      `}
    >
      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{task.title}</h3>
      <p className="text-xs text-gray-500 mt-1">{task.defaultDescription}</p>
    </div>
  );
};