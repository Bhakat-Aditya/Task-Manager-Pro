import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { DndContext, pointerWithin, DragOverlay } from "@dnd-kit/core";
import { DraggableTask } from "../components/Calendar/DraggableTask";
import { DroppableDay } from "../components/Calendar/DroppableDay";
import { ShareModal } from "../components/common/ShareModal";
import { ThemeToggle } from "../components/common/ThemeToggle";
import { TaskFormModal } from "../components/common/TaskFormModal";
import { ViewTaskModal } from "../components/common/ViewTaskModal";
import { DayViewModal } from "../components/Calendar/DayViewModal";
import { useTasks } from "../hooks/useTasks";
import { useCalendar } from "../hooks/useCalendar";

const Dashboard = () => {
  const { logout } = useAuth();
  const { tasks: libraryTasks, addTask, updateTask, deleteTask } = useTasks();
  const { getEntriesByDate, addEntryToDate, updateEntry, deleteEntry } =
    useCalendar();

  // Modal States
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  // Generic Task Modals State
  const [formModalConfig, setFormModalConfig] = useState({
    isOpen: false,
    type: null,
    initialData: null,
  });
  const [viewModalTask, setViewModalTask] = useState(null);
  const [activeDragTask, setActiveDragTask] = useState(null);

  const getFullDate = (dayNum) => new Date(Date.UTC(2026, 1, dayNum));

  // --- Drag & Drop ---
  const handleDragStart = (e) =>
    setActiveDragTask(
      e.active.data.current?.task || e.active.data.current?.entry,
    );

  const handleDragEnd = async (event) => {
    setActiveDragTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeType = active.data.current?.type;
    const targetDate = getFullDate(parseInt(over.id.split("-")[1], 10));

    if (activeType === "TaskBlueprint") {
      await addEntryToDate(
        active.data.current.task._id,
        targetDate,
        active.data.current.task.timeOfDay,
      );
    } else if (activeType === "CalendarEntry") {
      await updateEntry(active.data.current.entry._id, { date: targetDate });
    }
  };

  // --- Form Handlers ---
  const handleFormSubmit = async (data) => {
    if (formModalConfig.type === "library_create") {
      await addTask({
        title: data.title,
        defaultDescription: data.description,
        timeOfDay: data.timeOfDay,
      });
    } else if (formModalConfig.type === "library_edit") {
      await updateTask(formModalConfig.initialData._id, {
        title: data.title,
        defaultDescription: data.description,
        timeOfDay: data.timeOfDay,
      });
    } else if (formModalConfig.type === "day_create") {
      // Create a background blueprint, then add to calendar
      const newBlueprint = await addTask({
        title: data.title,
        defaultDescription: data.description,
        timeOfDay: data.timeOfDay,
      });
      await addEntryToDate(
        newBlueprint._id,
        getFullDate(selectedDay),
        data.timeOfDay,
      );
    } else if (formModalConfig.type === "day_edit") {
      await updateEntry(formModalConfig.initialData._id, {
        customDescription: data.description,
        timeOfDay: data.timeOfDay,
      });
      // Note: Updating title updates the global Blueprint
      await updateTask(formModalConfig.initialData.blueprintId._id, {
        title: data.title,
      });
    }
  };

  return (
    <>
      <DndContext
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex h-screen w-full bg-white dark:bg-[#0a0a0a] text-black dark:text-white overflow-hidden transition-colors duration-500">
          {/* LEFT PANEL */}
          <aside className="w-[30%] min-w-[300px] max-w-[380px] h-full border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#121212] flex flex-col z-10">
            <header className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-[#0a0a0a]">
              <h1 className="text-2xl font-black tracking-tighter">TaskFlow</h1>
              <div className="flex gap-2">
                <ThemeToggle />
                <button
                  onClick={logout}
                  className="p-2 text-gray-500 hover:text-red-500 bg-gray-100 dark:bg-gray-800 rounded-xl"
                >
                  ⎋
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 custom-scrollbar">
              <button
                onClick={() =>
                  setFormModalConfig({
                    isOpen: true,
                    type: "library_create",
                    initialData: null,
                  })
                }
                className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl font-semibold hover:border-black dark:hover:border-white transition-all"
              >
                + Add Reusable Task
              </button>

              <div className="space-y-3 mt-2">
                {libraryTasks.map((task) => (
                  <DraggableTask
                    key={task._id}
                    task={task}
                    onView={() => setViewModalTask(task)}
                    onEdit={() =>
                      setFormModalConfig({
                        isOpen: true,
                        type: "library_edit",
                        initialData: task,
                      })
                    }
                    onDelete={deleteTask}
                  />
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
                className="px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl font-semibold hover:opacity-80"
              >
                Share Calendar
              </button>
            </header>

            <div className="flex-1 p-6 overflow-hidden">
              <div className="h-full w-full border border-gray-200 dark:border-gray-800 rounded-2xl flex flex-col">
                <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#121212]">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="py-3 text-center text-xs font-bold text-gray-500 uppercase"
                      >
                        {day}
                      </div>
                    ),
                  )}
                </div>

                <div className="flex-1 grid grid-cols-7 grid-rows-5 h-full overflow-hidden">
                  {Array.from({ length: 35 }).map((_, i) => {
                    const dateNum = (i % 28) + 1;
                    const dayTasks = getEntriesByDate(dateNum).map((entry) => ({
                      ...entry,
                      title: entry.blueprintId?.title,
                    }));

                    return (
                      <DroppableDay
                        key={`day-${dateNum}`}
                        dateNum={dateNum}
                        tasks={dayTasks}
                        onClick={() => setSelectedDay(dateNum)} // Note: Changed to onDoubleClick inside DroppableDay component
                        onToggleComplete={(id, status) =>
                          updateEntry(id, { status })
                        }
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </main>
        </div>

        <DragOverlay dropAnimation={{ duration: 250 }}>
          {activeDragTask ? (
            <div className="p-4 bg-white dark:bg-[#1a1a1a] border border-blue-500 rounded-xl shadow-2xl opacity-90 scale-105 rotate-2">
              <h3 className="font-semibold">
                {activeDragTask.title || activeDragTask.blueprintId?.title}
              </h3>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Global Modals */}
      <TaskFormModal
        isOpen={formModalConfig.isOpen}
        initialData={formModalConfig.initialData}
        title={
          formModalConfig.type?.includes("day") ? "Day Task" : "Reusable Task"
        }
        onClose={() =>
          setFormModalConfig({ isOpen: false, type: null, initialData: null })
        }
        onSubmit={handleFormSubmit}
      />
      <ViewTaskModal
        isOpen={!!viewModalTask}
        task={viewModalTask}
        onClose={() => setViewModalTask(null)}
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
        onAddClick={() =>
          setFormModalConfig({
            isOpen: true,
            type: "day_create",
            initialData: null,
          })
        }
        onDelete={deleteEntry}
        onEdit={(task) =>
          setFormModalConfig({
            isOpen: true,
            type: "day_edit",
            initialData: task,
          })
        }
        onView={setViewModalTask}
        onToggleStatus={(id, status) => updateEntry(id, { status })}
      />
    </>
  );
};

export default Dashboard;
