import { useState, useEffect } from 'react';

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains('dark')
  );

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove('dark');
      setIsDark(false);
    } else {
      root.classList.add('dark');
      setIsDark(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 overflow-hidden group focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      aria-label="Toggle Dark Mode"
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        {/* Sun Icon (Light Mode) */}
        <svg
          className={`absolute w-5 h-5 text-amber-500 transition-all duration-500 transform ${
            isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100 group-hover:rotate-45'
          }`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>

        {/* Moon Icon (Dark Mode) */}
        <svg
          className={`absolute w-5 h-5 text-blue-400 transition-all duration-500 transform ${
            isDark ? 'opacity-100 rotate-0 scale-100 group-hover:-rotate-12' : 'opacity-0 -rotate-90 scale-50'
          }`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </div>
    </button>
  );
};