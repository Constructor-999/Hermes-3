import React, { useState } from "react";
import { DateTime } from "luxon";

export default function Timetable() {
  // Initial colors for classes
  const [colors, setColors] = useState({
    Math: "#3498db", // Blue
    English: "#e74c3c", // Red
    Physics: "#2ecc71", // Green
  });

  const [currentDate, setCurrentDate] = useState(DateTime.now());
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState("day"); // Default selection

  const options = [
    { label: "Day", value: "day" },
    { label: "Week", value: "week" },
  ];

  // Dummy timetable data for UI testing
  const timetableData = [
    { id: 1, className: "Math", teacher: "Mr. Smith", room: "V203" },
    { id: 2, className: "English", teacher: "Ms. Johnson", room: "B103" },
    { id: 3, className: "Physics", teacher: "Dr. Adams", room: "E213" },
  ];

  // Handle color change for class colors
  const handleColorChange = (className, newColor) => {
    setColors((prevColors) => ({
      ...prevColors,
      [className]: newColor,
    }));
  };

  // Handle week navigation (prev/next)
  const handleWeekNavigation = (direction) => {
    const newDate =
      direction === "prev"
        ? currentDate.minus({ weeks: 1 })
        : currentDate.plus({ weeks: 1 });
    setCurrentDate(newDate);
  };

  return (
    <div className="flex h-screen dark:bg-gray-700 bg-white">
      <div className="w-1/7 bg-gray-300 dark:bg-gray-900 p-4">
        <div className="flex justify-center mb-6">
          <div className="aspect-[209/126]">
            <img
              src="/login-icon.png"
              alt="Login Icon"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full">
        <div
          className={`h-[8%] dark:bg-gray-800 bg-gray-200 w-full flex items-center `}
        >
          <div className="flex w-full items-center justify-between">
            <div className="ml-3 w-[23%]">
              <input
                type="text"
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full px-3 py-2 bg-gray-300 dark:bg-gray-600 border border-gray-500 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex items-center mr-3">
              <div className="flex items-center space-x-2 p-2 rounded-lg mr-3">
                {/* Previous button */}
                <button
                  onClick={() => handleWeekNavigation("prev")}
                  className="dark:bg-gray-600 bg-gray-300 dark:text-white text-gray-600 h-[44px] w-[44px] flex items-center justify-center rounded-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <span className="dark:bg-gray-600 bg-gray-300 dark:text-white text-gray-600 text-lg text-center font-bold px-6 py-2 rounded-lg min-w-[216px]">
                  {currentDate.toFormat("DDD")} {/* Shows the formatted date */}
                </span>
                <button
                  onClick={() => handleWeekNavigation("next")}
                  className="dark:bg-gray-600 bg-gray-300 dark:text-white text-gray-600 h-[44px] w-[44px] flex items-center justify-center rounded-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
              <div className="relative dark:bg-gray-600 bg-gray-300 rounded-md w-48 p-1">
                {/* Button container */}
                <div className="inline-flex items-center justify-center w-full rounded-md cursor-pointer dark:text-gray-100 text-center">
                  {options.map((option) => (
                    <button
                      key={option.value}
                      className={`px-4 py-2 z-10 w-1/2 text-center transition-colors duration-300 ${
                        selected === option.value
                          ? "dark:text-gray-100 text-gray-50 font-semibold"
                          : "dark:text-gray-400 text-gray-500"
                      }`}
                      onClick={() => setSelected(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}

                  {/* Background sliding animation */}
                  <div
                    className={`absolute h-10 w-[calc(50%-4px)] rounded-md dark:bg-gray-700 bg-gray-400 z-0 transition-transform duration-300 ease-in-out`}
                    style={{
                      transform: `translateX(${
                        selected === "day" ? "-50%" : "50%"
                      })`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
