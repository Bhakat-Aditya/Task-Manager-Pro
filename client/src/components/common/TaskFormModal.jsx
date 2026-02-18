import { useState, useEffect } from "react";

export const TaskFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  title = "Task",
}) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("Any");

  useEffect(() => {
    if (isOpen) {
      setTaskTitle(initialData?.title || "");
      setDescription(
        initialData?.defaultDescription || initialData?.customDescription || "",
      );
      setTimeOfDay(initialData?.timeOfDay || "Any");
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    onSubmit({ title: taskTitle, description, timeOfDay });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-6 dark:text-white">
          {initialData ? `Edit ${title}` : `New ${title}`}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">
              Title
            </label>
            <input
              autoFocus
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              required
              className="w-full mt-1.5 px-4 py-2.5 bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full mt-1.5 px-4 py-2.5 bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">
              Time of Day
            </label>
            <select
              value={timeOfDay}
              onChange={(e) => setTimeOfDay(e.target.value)}
              className="w-full mt-1.5 px-4 py-2.5 bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all appearance-none"
            >
              <option value="Any">Any Time</option>
              <option value="Morning">Morning</option>
              <option value="Noon">Noon</option>
              <option value="Evening">Evening</option>
              <option value="Night">Night</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-medium bg-black dark:bg-white text-white dark:text-black hover:opacity-80 transition-opacity"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
