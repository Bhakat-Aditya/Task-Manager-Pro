import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { DndContext, pointerWithin } from "@dnd-kit/core";
import { DraggableTask } from "../components/Calendar/DraggableTask";
import { DroppableDay } from "../components/Calendar/DroppableDay";
import { ShareModal } from "../components/common/ShareModal";
import { useTasks } from "../hooks/useTasks";
import { useCalendar } from "../hooks/useCalendar";

const Dashboard = () => {
  const { logout } = useAuth();

  // Custom Data Hooks
  const { tasks: libraryTasks, addTask } = useTasks();
  const { getEntriesByDate, addEntryToDate } = useCalendar();

  // UI State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const toggleTheme = () => document.documentElement.classList.toggle("dark");

  // Generate a mock date for the current month based on the cell dropped
  // (In a full app, you would use a robust calendar state manager)
  const getFullDateFromDayNumber = (dayNum) => {
    const year = 2026;
    const month = 1; // 0-indexed, so 1 = February
    return new Date(Date.UTC(year, month, dayNum));
  };

  // Handle Drag & Drop events
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    // Extract the MongoDB _id from the dragged blueprint task
    const blueprintId = active.data.current.task._id;

    // Extract the day number from the target dropzone ID (e.g., "day-15" -> 15)
    const targetDayNum = parseInt(over.id.split("-")[1], 10);

    const targetDate = getFullDateFromDayNumber(targetDayNum);

    // Save to database
    await addEntryToDate(blueprintId, targetDate);
  };

  const handleAddMockTask = () => {
    addTask({
      title: "New Custom Task",
      defaultDescription: "Added from UI",
      color: "#10b981", // emerald-500
    });
  };

  return (
    <>
      <DndContext collisionDetection={pointerWithin} onDragEnd={handleDragEnd}>
        <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden transition-colors duration-300">
          {/* LEFT PANEL (30%): Task Library */}
          <aside className="w-[30%] min-w-[320px] max-w-[400px] h-full border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
            <header className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h1 className="text-2xl font-bold tracking-tight">Library</h1>
              <div className="flex gap-2">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="Toggle Theme"
                >
                  🌓
                </button>
                <button
                  onClick={logout}
                  className="p-2 text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="Logout"
                >
                  ⎋
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              <button
                onClick={handleAddMockTask}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-500 hover:text-blue-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all font-medium"
              >
                <span className="text-xl">+</span> Add Reusable Task
              </button>

              {/* Map real data from MongoDB */}
              {libraryTasks.map((task) => (
                <DraggableTask key={task._id} task={task} />
              ))}
            </div>
          </aside>

          {/* RIGHT PANEL (70%): Calendar View */}
          <main className="flex-1 h-full flex flex-col bg-gray-50/50 dark:bg-[#121212]">
            <header className="h-20 px-8 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
              <h2 className="text-2xl font-semibold">February 2026</h2>

              <button
                onClick={() => setIsShareModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
              >
                Share Calendar
              </button>
            </header>

            <div className="flex-1 p-6 overflow-hidden">
              <div className="h-full w-full border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 overflow-hidden flex flex-col shadow-sm">
                {/* Days of Week Header */}
                <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        {day}
                      </div>
                    ),
                  )}
                </div>

                {/* The 35 Calendar Cells */}
                <div className="flex-1 grid grid-cols-7 grid-rows-5">
                  {Array.from({ length: 35 }).map((_, i) => {
                    const dateNum = (i % 28) + 1;
                    const dayId = `day-${dateNum}`;

                    // Fetch the specific entries for this date cell from our hook
                    const dayTasks = getEntriesByDate(dateNum).map((entry) => ({
                      ...entry,
                      title: entry.blueprintId?.title || "Unknown Task", // Map populated title
                      color: entry.blueprintId?.color, // Map populated color
                    }));

                    return (
                      <DroppableDay
                        key={dayId}
                        dateNum={dateNum}
                        tasks={dayTasks}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </main>
        </div>
      </DndContext>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </>
  );
};

export default Dashboard;
