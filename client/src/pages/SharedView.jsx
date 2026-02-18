import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ThemeToggle } from "../components/common/ThemeToggle";

const SharedView = () => {
  const { token } = useParams();
  const [entries, setEntries] = useState([]);
  const [shareConfig, setShareConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Calendar Math (Defaulting to Feb 2026 for this specific view, or use current)
  const [currentMonth, setCurrentMonth] = useState(1); // Feb
  const [currentYear, setCurrentYear] = useState(2026);
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

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const totalCells = Math.ceil((daysInMonth + firstDayOfMonth) / 7) * 7;

  const gridCells = Array.from({ length: totalCells }).map((_, i) => {
    const dayNum = i - firstDayOfMonth + 1;
    return dayNum > 0 && dayNum <= daysInMonth ? dayNum : null;
  });

  useEffect(() => {
    const fetchSharedCalendar = async () => {
      try {
        const BASE_URL =
          import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const response = await axios.get(`${BASE_URL}/share/${token}`);

        setEntries(response.data.entries);
        setShareConfig({
          type: response.data.type,
          permission: response.data.permission,
        });
      } catch (err) {
        setError("Invalid, expired, or deactivated share link.");
      } finally {
        setLoading(false);
      }
    };

    fetchSharedCalendar();
  }, [token]);

  const getEntriesByDate = (year, month, dateNum) => {
    return entries.filter((entry) => {
      const d = new Date(entry.date);
      return (
        d.getUTCFullYear() === year &&
        d.getUTCMonth() === month &&
        d.getUTCDate() === dateNum
      );
    });
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center dark:text-white dark:bg-[#0a0a0a]">
        Loading Shared Calendar...
      </div>
    );

  if (error)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white space-y-4">
        <h2 className="text-2xl font-bold">Link Unavailable</h2>
        <p className="text-gray-500">{error}</p>
        <Link to="/" className="px-6 py-2 bg-blue-600 text-white rounded-lg">
          Go to TaskFlow
        </Link>
      </div>
    );

  return (
    <div className="flex flex-col h-screen w-full bg-white dark:bg-[#0a0a0a] text-black dark:text-white overflow-hidden transition-colors duration-500">
      {/* Header */}
      <header className="h-20 px-8 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-black tracking-tighter mr-8">
            TaskFlow{" "}
            <span className="text-sm text-gray-400 font-normal">
              Shared View
            </span>
          </h1>
          <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold uppercase tracking-wider">
            {shareConfig.type === "snapshot" ? "Static Snapshot" : "Live Sync"}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <h2 className="text-xl font-bold w-48 text-center">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <ThemeToggle />
          <Link
            to="/"
            className="text-sm font-semibold text-gray-500 hover:text-black dark:hover:text-white transition-colors"
          >
            Create your own
          </Link>
        </div>
      </header>

      {/* Calendar Grid */}
      <main className="flex-1 p-6 overflow-hidden bg-gray-50/50 dark:bg-[#0a0a0a]">
        <div className="h-full w-full max-w-7xl mx-auto border border-gray-200 dark:border-gray-800 rounded-2xl flex flex-col bg-white dark:bg-[#111] overflow-hidden shadow-xl">
          <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#121212]">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-widest"
              >
                {day}
              </div>
            ))}
          </div>

          <div
            className={`flex-1 grid grid-cols-7 grid-rows-${totalCells / 7} h-full overflow-hidden`}
          >
            {gridCells.map((dateNum, i) => {
              if (!dateNum) {
                return (
                  <div
                    key={`empty-${i}`}
                    className="h-full border-r border-b border-gray-200 dark:border-gray-800/40 bg-gray-50/50 dark:bg-[#0a0a0a]/50"
                  ></div>
                );
              }

              const dayTasks = getEntriesByDate(
                currentYear,
                currentMonth,
                dateNum,
              );

              return (
                <div
                  key={`day-${dateNum}`}
                  className="h-full border-r border-b border-gray-200 dark:border-gray-800/80 p-2 flex flex-col overflow-hidden transition-all duration-300"
                >
                  <span className="text-sm font-bold w-7 h-7 flex items-center justify-center text-gray-400 dark:text-gray-600 mb-1">
                    {dateNum}
                  </span>

                  <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 w-full pr-1 custom-scrollbar">
                    {dayTasks.map((task) => (
                      <div
                        key={task._id}
                        className="text-xs px-2 py-1.5 bg-gray-50 dark:bg-[#1a1a1a] text-black dark:text-white rounded-md border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-2"
                      >
                        <div
                          className={`w-3 h-3 rounded-full border-2 shrink-0 ${task.status === "completed" ? "bg-green-500 border-green-500" : "border-gray-300 dark:border-gray-600"}`}
                        />
                        <span
                          className={`truncate flex-1 ${task.status === "completed" ? "line-through opacity-60" : ""}`}
                        >
                          {task.title || task.blueprintId?.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SharedView;
