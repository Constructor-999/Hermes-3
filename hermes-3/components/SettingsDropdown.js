import React, { useState } from 'react';

const SettingsDropdown = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark', !darkMode);
  };

  return (
    <div className="relative">
      <button className="bg-gray-200 dark:bg-gray-700 py-2 px-4 rounded-md">Settings</button>
      <div className="absolute bg-white dark:bg-gray-800 mt-2 p-4 rounded-md shadow-lg">
        <h4 className="dark:text-white">Appearance</h4>
        <div className="flex items-center mt-2">
          <label className="dark:text-gray-300 mr-2">Dark Mode</label>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={toggleDarkMode}
            className="form-checkbox"
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsDropdown;