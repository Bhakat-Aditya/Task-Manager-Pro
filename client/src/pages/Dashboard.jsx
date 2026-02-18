import { useAuth } from "../context/AuthContext";
import { DndContext, pointerWithin } from "@dnd-kit/core";
import { DraggableTask } from "../components/Calendar/DraggableTask";
import { DroppableDay } from "../components/Calendar/DroppableDay";
import { useTasks } from "../hooks/useTasks";
import { useCalendar } from "../hooks/useCalendar";

const Dashboard = () => {
  const { logout } = useAuth();
  const { tasks: libraryTasks, addTask } = useTasks();
  const { getEntriesByDate, addEntryToDate } = useCalendar();

  const toggleTheme = () => document.documentElement.classList.toggle("dark");

  // Generate a mock date for the current month based on the cell clicked/dropped
  // In a real app, you'd use a robust date library like date-fns
  const getFullDateFromDayNumber = (dayNum) => {
    const year = 2026;
    const month = 1; // 0-indexed, so 1 = February
    return new Date(Date.UTC(year, month, dayNum));
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    // Extract the MongoDB _id from the dragged blueprint task
    const blueprintId = active.data.current.task._id;

    // Extract the day number from the target dropzone ID (e.g., "day-15" -> 15)
    const targetDayNum = parseInt(over.id.split("-")[1], 10);

    const targetDate = getFullDateFromDayNumber(targetDayNum);

    // Call our custom hook to save it to the database
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
    <DndContext collisionDetection={pointerWithin} onDragEnd={handleDragEnd}>
      <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden">
        {/* LEFT PANEL */}
        <aside className="w-[30%] min-w-[320px] h-full border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col z-10">
          <header className="p-6 border-b flex justify-between items-center">
            <h1 className="text-2xl font-bold">Library</h1>
            <div className="flex gap-2">
              <button onClick={toggleTheme} className="p-2">
                🌓
              </button>
              <button onClick={logout} className="p-2 text-red-500">
                ⎋
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
            <button
              onClick={handleAddMockTask}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed rounded-xl hover:text-blue-600 hover:border-blue-500"
            >
              + Add Reusable Task
            </button>

            {/* Now mapping real data from MongoDB */}
            {libraryTasks.map((task) => (
              <DraggableTask key={task._id} task={task} />
            ))}
          </div>
        </aside>

        {/* RIGHT PANEL */}
        <main className="flex-1 flex flex-col">
          <header className="h-20 px-8 flex items-center justify-between border-b bg-white/50">
            <h2 className="text-2xl font-semibold">February 2026</h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              Share Calendar
            </button>
          </header>

          <div className="flex-1 p-6 overflow-hidden">
            <div className="h-full border rounded-2xl flex flex-col">
              <div className="grid grid-cols-7 border-b bg-gray-50">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="py-3 text-center text-xs font-semibold"
                    >
                      {day}
                    </div>
                  ),
                )}
              </div>

              <div className="flex-1 grid grid-cols-7 grid-rows-5">
                {Array.from({ length: 35 }).map((_, i) => {
                  const dateNum = (i % 28) + 1;
                  const dayId = `day-${dateNum}`;

                  // Fetch the specific entries for this date cell from our hook
                  const dayTasks = getEntriesByDate(dateNum).map((entry) => ({
                    ...entry,
                    title: entry.blueprintId?.title || "Unknown Task", // Map populated title
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
  );
};

export default Dashboard;
