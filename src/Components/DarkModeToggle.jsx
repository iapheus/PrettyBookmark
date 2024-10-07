import React, { useEffect, useState } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';

function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  function handleClick() {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setIsDarkMode(!isDarkMode);
  }

  return (
    <button
      onClick={handleClick}
      className="text-gray-600 z-50 text-center dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
    >
      {isDarkMode ? <FiSun size={26} /> : <FiMoon size={26} />}
    </button>
  );
}

export default DarkModeToggle;
