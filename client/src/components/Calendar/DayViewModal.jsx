export const DayViewModal = ({
  isOpen,
  onClose,
  dateNum,
  tasks,
  libraryTasks,
  onQuickAdd,
  onDelete,
  onUpdate,
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

        <div className="p-6 overflow-y-auto flex-1 space-y-8 custom-scrollbar bg-gray-50 dark:bg-[#0f0f0f]">
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
                              onUpdate(task._id, {
                                status:
                                  task.status === "completed"
                                    ? "pending"
                                    : "completed",
                              })
                            }
                            className={`w-5 h-5 rounded-full border-2 transition-colors flex justify-center items-center ${task.status === "completed" ? "bg-green-500 border-green-500" : "border-gray-300 dark:border-gray-600"}`}
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
                            {task.customDescription && (
                              <p className="text-xs text-gray-500">
                                {task.customDescription}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onDelete(task._id)}
                            className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete Task"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Add Section */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
            <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
              Quick Add Template
            </h4>
            <div className="flex flex-wrap gap-2">
              {libraryTasks.map((libTask) => (
                <button
                  key={libTask._id}
                  onClick={() => onQuickAdd(libTask._id)}
                  className="px-4 py-2 text-sm font-medium bg-white dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 rounded-xl hover:text-blue-600 hover:border-blue-500 dark:hover:text-blue-400 transition-all shadow-sm border border-gray-200 dark:border-gray-800 hover:-translate-y-0.5"
                >
                  + {libTask.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
