export const DayViewModal = ({
  isOpen,
  onClose,
  dateNum,
  tasks,
  onAddClick,
  onDelete,
  onEdit,
  onView,
  onToggleStatus,
}) => {
  if (!isOpen) return null;

  const timeSlots = ["Morning", "Noon", "Evening", "Night", "Any"];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-[#0f0f0f] rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mind-blowing Header */}
        <header className="relative px-8 py-6 bg-gradient-to-br from-blue-600 to-indigo-700 overflow-hidden">
          <div className="absolute inset-0 bg-white/10 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-blue-100 font-medium text-sm uppercase tracking-widest mb-1">
                Schedule
              </p>
              <h3 className="text-3xl font-black text-white tracking-tight">
                Feb {dateNum}, 2026
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition-colors"
            >
              ✕
            </button>
          </div>
        </header>

        <div className="p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar bg-gray-50 dark:bg-[#0f0f0f]">
          {/* SINGLE ADD TASK BUTTON */}
          <button
            onClick={onAddClick}
            className="w-full py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-bold rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors shadow-sm"
          >
            + Add Task to this Day
          </button>

          {/* Categorized Tasks */}
          <div className="space-y-6">
            {timeSlots.map((time) => {
              const slotTasks = tasks.filter(
                (t) => (t.timeOfDay || "Any") === time,
              );
              if (slotTasks.length === 0) return null;

              return (
                <div key={time} className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    {time}{" "}
                    <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800"></span>
                  </h4>

                  <div className="space-y-2">
                    {slotTasks.map((task) => (
                      <div
                        key={task._id}
                        className="group flex items-center justify-between p-3.5 bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all hover:border-blue-200 dark:hover:border-blue-900/50"
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              onToggleStatus(
                                task._id,
                                task.status === "completed"
                                  ? "pending"
                                  : "completed",
                              )
                            }
                            className={`w-5 h-5 rounded-full border-2 transition-colors flex justify-center items-center ${
                              task.status === "completed"
                                ? "bg-green-500 border-green-500"
                                : "border-gray-300 dark:border-gray-600"
                            }`}
                          >
                            {task.status === "completed" && (
                              <svg
                                className="w-3 h-3 text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                              >
                                <path d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                          <div>
                            <p
                              className={`font-semibold ${task.status === "completed" ? "text-gray-400 line-through" : "text-gray-900 dark:text-white"}`}
                            >
                              {task.title}
                            </p>
                          </div>
                        </div>

                        {/* Hover Action Buttons (Eye, Edit, Trash) */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onView(task)}
                            className="p-2 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                            title="View Details"
                          >
                            👁️
                          </button>
                          <button
                            onClick={() => onEdit(task)}
                            className="p-2 text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
                            title="Edit Task"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => onDelete(task._id)}
                            className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete Task"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
