import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

function ThemeToggle({ isDarkMode, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`fixed top-4 right-4 p-2 rounded-full shadow-lg transition-colors ${
        isDarkMode 
          ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
          : 'bg-white text-gray-700 hover:bg-gray-100'
      }`}
      aria-label="Toggle theme"
    >
      {isDarkMode ? (
        <SunIcon className="w-6 h-6" />
      ) : (
        <MoonIcon className="w-6 h-6" />
      )}
    </button>
  );
}

export default ThemeToggle; 