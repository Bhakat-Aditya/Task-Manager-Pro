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

  // --- Date & Navigation State ---
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // Modals & Selection State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [formModalConfig, setFormModalConfig] = useState({
    isOpen: false,
    type: null,
    initialData: null,
  });
  const [viewModalTask, setViewModalTask] = useState(null);
  const [activeDragTask, setActiveDragTask] = useState(null);

  // --- Calendar Math ---
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isPastDate = (year, month, day) => {
    const cellDate = new Date(year, month, day);
    const todayDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    return cellDate < todayDate;
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const totalCells = Math.ceil((daysInMonth + firstDayOfMonth) / 7) * 7;

  // Creates array of dates, prepending nulls for empty padding days
  const gridCells = Array.from({ length: totalCells }).map((_, i) => {
    const dayNum = i - firstDayOfMonth + 1;
    return dayNum > 0 && dayNum <= daysInMonth ? dayNum : null;
  });

  const getFullDate = (dayNum) =>
    new Date(Date.UTC(currentYear, currentMonth, dayNum));

  // --- Drag & Drop ---
  const handleDragStart = (e) =>
    setActiveDragTask(
      e.active.data.current?.task || e.active.data.current?.entry,
    );

  const handleDragEnd = async (event) => {
    setActiveDragTask(null);
    const { active, over } = event;
    if (!over) return;

    const targetDayNum = over.data.current?.dateNum;
    if (!targetDayNum) return; // Dropped on an empty padding cell

    const activeType = active.data.current?.type;
    const targetDate = getFullDate(targetDayNum);

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
              {/* Dynamic Month/Year Navigation */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <h2 className="text-2xl font-bold w-48 text-center">
                  {monthNames[currentMonth]} {currentYear}
                </h2>
                <button
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

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

                {/* Dynamic Grid Mapping */}
                <div
                  className={`flex-1 grid grid-cols-7 grid-rows-${totalCells / 7} h-full overflow-hidden`}
                >
                  {gridCells.map((dateNum, i) => {
                    if (!dateNum) {
                      return (
                        <DroppableDay
                          key={`empty-${i}`}
                          dateNum={null}
                          tasks={[]}
                          isPast={true}
                        />
                      );
                    }

                    const isPast = isPastDate(
                      currentYear,
                      currentMonth,
                      dateNum,
                    );
                    const dayTasks = getEntriesByDate(
                      currentYear,
                      currentMonth,
                      dateNum,
                    ).map((entry) => ({
                      ...entry,
                      title: entry.blueprintId?.title,
                    }));

                    return (
                      <DroppableDay
                        key={`day-${dateNum}`}
                        dateNum={dateNum}
                        tasks={dayTasks}
                        isPast={isPast}
                        onClick={() => setSelectedDay(dateNum)}
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
        dateNum={
          selectedDay
            ? `${monthNames[currentMonth]} ${selectedDay}, ${currentYear}`
            : ""
        }
        tasks={
          selectedDay
            ? getEntriesByDate(currentYear, currentMonth, selectedDay).map(
                (e) => ({ ...e, title: e.blueprintId?.title }),
              )
            : []
        }
        isPast={
          selectedDay
            ? isPastDate(currentYear, currentMonth, selectedDay)
            : false
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
