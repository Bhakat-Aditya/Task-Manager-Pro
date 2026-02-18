import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { DndContext, pointerWithin, DragOverlay } from "@dnd-kit/core";
import { DraggableTask } from "../components/Calendar/DraggableTask";
import { DroppableDay } from "../components/Calendar/DroppableDay";
import { ShareModal } from "../components/common/ShareModal";
import { ThemeToggle } from "../components/common/ThemeToggle";
import { CreateTaskModal } from "../components/common/CreateTaskModal";
import { DayViewModal } from "../components/Calendar/DayViewModal";
import { useTasks } from "../hooks/useTasks";
import { useCalendar } from "../hooks/useCalendar";

const Dashboard = () => {
  const { logout } = useAuth();

  // Custom API Hooks
  const { tasks: libraryTasks, addTask } = useTasks();
  const { getEntriesByDate, addEntryToDate, updateEntry, deleteEntry } =
    useCalendar();

  // UI States
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  // Track the currently dragged task for the smooth floating overlay
  const [activeDragTask, setActiveDragTask] = useState(null);

  // Helper to generate correct Date object for saving
  const getFullDateFromDayNumber = (dayNum) => {
    return new Date(Date.UTC(2026, 1, dayNum)); // February 2026 (0-indexed month)
  };

  // Drag Start: Identify what is being dragged
  const handleDragStart = (event) => {
    const { active } = event;
    if (active.data.current.type === "TaskBlueprint") {
      setActiveDragTask(active.data.current.task);
    } else if (active.data.current.type === "CalendarEntry") {
      setActiveDragTask(active.data.current.entry);
    }
  };

  // Drag End: Drop logic for both Library Blueprints & Calendar Entries
  const handleDragEnd = async (event) => {
    setActiveDragTask(null); // Reset overlay
    const { active, over } = event;
    if (!over) return;

    const activeType = active.data.current?.type;
    const targetDayNum = parseInt(over.id.split("-")[1], 10);
    const targetDate = getFullDateFromDayNumber(targetDayNum);

    if (activeType === "TaskBlueprint") {
      // 1. Dragged from Left Library -> Create New Calendar Entry
      const blueprintId = active.data.current.task._id;
      const timeOfDay = active.data.current.task.timeOfDay || "Any";
      await addEntryToDate(blueprintId, targetDate, timeOfDay);
    } else if (activeType === "CalendarEntry") {
      // 2. Dragged from Calendar Day -> Move to Another Day
      const entryId = active.data.current.entry._id;
      const currentDayNum = new Date(
        active.data.current.entry.date,
      ).getUTCDate();

      // Only hit the API if they actually moved it to a different day
      if (currentDayNum !== targetDayNum) {
        await updateEntry(entryId, { date: targetDate });
      }
    }
  };

  // Handle clicking the completion circle on a task
  const handleToggleComplete = async (entryId, newStatus) => {
    await updateEntry(entryId, { status: newStatus });
  };

  // Handle adding a task from the Day View Modal directly
  const handleQuickAdd = async (blueprintId) => {
    if (!selectedDay) return;
    const targetDate = getFullDateFromDayNumber(selectedDay);
    // Find the library task to inherit its default time
    const libTask = libraryTasks.find((t) => t._id === blueprintId);
    await addEntryToDate(blueprintId, targetDate, libTask?.timeOfDay || "Any");
  };

  return (
    <>
      <DndContext
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* PURE WHITE/BLACK BACKGROUND */}
        <div className="flex h-screen w-full bg-white dark:bg-[#0a0a0a] text-black dark:text-white overflow-hidden transition-colors duration-500">
          {/* LEFT PANEL */}
          <aside className="w-[30%] min-w-[300px] max-w-[380px] h-full border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#121212] flex flex-col z-10">
            <header className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-[#0a0a0a]">
              <h1 className="text-2xl font-black tracking-tighter">TaskFlow</h1>
              <div className="flex gap-2 items-center">
                <ThemeToggle />
                <button
                  onClick={logout}
                  className="p-2 text-gray-500 hover:text-red-500 transition-colors bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                  title="Logout"
                >
                  ⎋
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 custom-scrollbar">
              <button
                onClick={() => setIsCreateTaskOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-all font-semibold"
              >
                + Add Reusable Task
              </button>

              <div className="space-y-3 mt-2">
                {libraryTasks.map((task) => (
                  <DraggableTask key={task._id} task={task} />
                ))}
              </div>
            </div>
          </aside>

          {/* RIGHT PANEL */}
          <main className="flex-1 h-full flex flex-col bg-white dark:bg-[#0a0a0a]">
            <header className="h-20 px-8 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl font-bold">February 2026</h2>
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl font-semibold hover:opacity-80 transition-opacity"
              >
                Share Calendar
              </button>
            </header>

            <div className="flex-1 p-6 overflow-hidden">
              <div className="h-full w-full border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden flex flex-col shadow-sm">
                {/* Header Row */}
                <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#121212]">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-widest"
                      >
                        {day}
                      </div>
                    ),
                  )}
                </div>

                {/* Calendar Grid */}
                <div className="flex-1 grid grid-cols-7 grid-rows-5 h-full overflow-hidden">
                  {Array.from({ length: 35 }).map((_, i) => {
                    const dateNum = (i % 28) + 1;
                    const dayTasks = getEntriesByDate(dateNum).map((entry) => ({
                      ...entry,
                      title: entry.blueprintId?.title || "Unknown Task", // Fallback for populated data
                    }));

                    return (
                      <DroppableDay
                        key={`day-${dateNum}`}
                        dateNum={dateNum}
                        tasks={dayTasks}
                        onClick={() => setSelectedDay(dateNum)}
                        onToggleComplete={handleToggleComplete} // Passed down to update status
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Smooth Drag Overlay (Floats above everything during drag) */}
        <DragOverlay
          dropAnimation={{
            duration: 250,
            easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
          }}
        >
          {activeDragTask ? (
            <div className="p-4 bg-white dark:bg-[#1a1a1a] border border-blue-500 rounded-xl shadow-2xl opacity-90 scale-105 rotate-2 cursor-grabbing">
              <h3 className="font-semibold text-black dark:text-white">
                {activeDragTask.title || activeDragTask.blueprintId?.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {activeDragTask.defaultDescription || activeDragTask.timeOfDay}
              </p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Modals */}
      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        onAdd={addTask}
      />
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
      <DayViewModal
        isOpen={!!selectedDay}
        onClose={() => setSelectedDay(null)}
        dateNum={selectedDay}
        tasks={
          selectedDay
            ? getEntriesByDate(selectedDay).map((e) => ({
                ...e,
                title: e.blueprintId?.title,
              }))
            : []
        }
        libraryTasks={libraryTasks}
        onQuickAdd={handleQuickAdd}
        onDelete={deleteEntry}
        onUpdate={updateEntry}
      />
    </>
  );
};

export default Dashboard;
