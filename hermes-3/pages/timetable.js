import React, { useState } from "react";
import { DateTime } from "luxon";

export default function Timetable() {
 

  const timePeriod = [
    { period: "P1", start: "08:20", end: "09:05" },
    { period: "P2", start: "09:10", end: "09:55" },
    { period: "P3", start: "10:00", end: "11:00" },
    { period: "P4", start: "11:05", end: "11:50" },
    { period: "P5", start: "11:55", end: "12:40" },
    { period: "P6", start: "12:45", end: "13:30" },
    { period: "P7", start: "13:35", end: "14:20" },
    { period: "P8", start: "14:30", end: "15:15" },
    { period: "P9", start: "15:20", end: "16:05" },
    { period: "P10", start: "16:05", end: "16:50" },
  ];

  const [colors, setColors] = useState({
    Math: "#3498db", // Blue
    English: "#e74c3c", // Red
    Physics: "#2ecc71", // Green
  });

  const [currentDate, setCurrentDate] = useState(
    DateTime.now().setZone("UTC+2")
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isDayWeek, setDayWeek] = useState("week");
  const [dayOfWeek, setDayOfWeek] = useState(
    currentDate.weekdayShort.toLowerCase().slice(0, 3) === "sat" || "sun"
      ? "mon"
      : currentDate.weekdayShort.toLowerCase().slice(0, 3)
  );

  const daysInWeek = [
    {
      label: "Mon",
      value: "mon",
      date: currentDate.startOf("week").day,
      month: currentDate.startOf("week").monthShort,
    },
    {
      label: "Tue",
      value: "tue",
      date: currentDate.startOf("week").day + 1,
      month: currentDate.startOf("week").monthShort,
    },
    {
      label: "Wed",
      value: "wed",
      date: currentDate.startOf("week").day + 2,
      month: currentDate.startOf("week").monthShort,
    },
    {
      label: "Thu",
      value: "thu",
      date: currentDate.startOf("week").day + 3,
      month: currentDate.startOf("week").monthShort,
    },
    {
      label: "Fri",
      value: "fri",
      date: currentDate.startOf("week").day + 4,
      month: currentDate.startOf("week").monthShort,
    },
  ];

  const dayWeekSwitch = [
    { label: "Day", value: "day" },
    { label: "Week", value: "week" },
  ];

  // Handle color change for class colors
  const handleColorChange = (className, newColor) => {
    setColors((prevColors) => ({
      ...prevColors,
      [className]: newColor,
    }));
  };

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
      <div className="relative flex flex-col w-full">
        <div
          className={`h-[75px] dark:bg-gray-800 bg-gray-200 w-full flex items-center z-10`}
        >
          <div className="flex w-full items-center justify-between">
            <div className="ml-3 w-[23%] min-w-40">
              <input
                type="text"
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full px-3 py-2 bg-gray-300 dark:bg-gray-600 border border-gray-500 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex items-center mr-3 select-none">
              <div className="flex items-center space-x-2 p-2 rounded-lg mr-3">
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
                  {currentDate.startOf("week").toFormat("DDD")}{" "}
                  {/* Shows the formatted date */}
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
                <div className="inline-flex items-center justify-center w-full rounded-md cursor-pointer dark:text-gray-100 text-center">
                  {dayWeekSwitch.map((dayWeekSwitch) => (
                    <button
                      key={dayWeekSwitch.value}
                      className={`px-4 py-2 z-10 w-1/2 text-center transition-colors duration-300 ${
                        isDayWeek === dayWeekSwitch.value
                          ? "dark:text-gray-100 text-gray-50 font-semibold"
                          : "dark:text-gray-400 text-gray-500"
                      }`}
                      onClick={() => setDayWeek(dayWeekSwitch.value)}
                    >
                      {dayWeekSwitch.label}
                    </button>
                  ))}

                  <div
                    className={`absolute h-10 w-[calc(50%-4px)] rounded-md dark:bg-gray-700 bg-gray-400 z-0 transition-transform duration-300 ease-in-out`}
                    style={{
                      transform: `translateX(${
                        isDayWeek === "day" ? "-50%" : "50%"
                      })`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`absolute flex justify-evenly items-center w-full h-fit select-none 
            ${
              isDayWeek === "day"
                ? "translate-y-[calc(100%)] mt-2"
                : "-translate-y-[8px] mt-0"
            }
            transition-transform duration-310 ease-in-out z-0`}
        >
          {daysInWeek.map((daysInWeek) => (
            <button
              key={daysInWeek.value}
              className={`flex flex-col items-center justify-center w-full mx-2 h-20 p-2 rounded-xl transition-colors duration-310 max-w-36
              ${
                dayOfWeek === daysInWeek.value
                  ? "dark:bg-gray-950 bg-gray-800"
                  : "dark:bg-gray-600 bg-gray-100"
              }`}
              onClick={() => setDayOfWeek(daysInWeek.value)}
              disabled={isDayWeek === "week" ? true : false}
            >
              <span
                className={`text-lg font-bold ${
                  dayOfWeek === daysInWeek.value
                    ? "dark:text-gray-200 text-gray-100"
                    : "dark:text-gray-900 text-gray-400"
                }`}
              >
                {daysInWeek.label}
              </span>

              <span
                className={`text-3xl font-bold ${
                  dayOfWeek === daysInWeek.value
                    ? "dark:text-gray-200 text-gray-100"
                    : "dark:text-gray-900 text-gray-400"
                }`}
              >
                {daysInWeek.date}
              </span>
            </button>
          ))}
        </div>
        <div
          className={`flex flex-col items-center my-3 transition-all ease-in-out select-none
            ${
              isDayWeek === "day"
                ? "h-[calc(91%-107px)] translate-y-[95px]"
                : "h-[91%]"
            }`}
        >
          {isDayWeek === "week" ? (
            <div className="flex justify-end h-fit w-[calc(100%-24px)]">
              <div
                className={`w-[calc(100%-80px)] grid gap-2 grid-cols-5  justify-items-stretch`}
              >
                {daysInWeek.map((dayInWeek) => (
                  <div className="h-fit w-full text-center mb-1">
                    <span className="text-xl font-bold text-gray-200">
                      {`${dayInWeek.label} ${dayInWeek.date} ${dayInWeek.month}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            ""
          )}

          <div className="flex items-center h-full w-full select-none">
            <div className={`grid gap-2 ml-3 grid-cols-1 h-full w-[85px]`}>
              {timePeriod.map((time) => (
                <div className="flex flex-row">
                  <div className="flex flex-col justify-center">
                    <span className="min-w-[32px] text-lg font-bold">{`${time.period}`}</span>
                  </div>
                  <div className="flex flex-col w-fit h-full justify-between text-left">
                    <span>{`${time.start}`}</span>
                    <span>{`${time.end}`}</span>
                  </div>
                </div>
              ))}
            </div>
            <div
              className={`grid gap-2 mr-3 w-full select-none
            ${isDayWeek === "day" ? "grid-cols-1" : "grid-cols-5"} h-full`}
            >
              {isDayWeek === "week"
                ? timetable[0].map((_, columnIndex) => {
                    let mergedColumns = [];

                    for (
                      let rowIndex = 0;
                      rowIndex < timetable.length;
                      rowIndex++
                    ) {
                      const period = timetable[rowIndex][columnIndex];

                      // If the period is blank, render an empty div
                      if (period.blank) {
                        mergedColumns.push(
                          <div
                            className="w-full h-full"
                            key={`${columnIndex}-${rowIndex}`}
                          ></div>
                        );
                        continue;
                      }

                      // Track consecutive periods with the same subject and room
                      let rowspan = 1;
                      const currentSubject = period.lectures[0].subject;
                      const currentRooms = period.lectures[0].room;

                      // Loop through the next rows to check if the same subject and room continue
                      while (
                        rowIndex + rowspan < timetable.length &&
                        !timetable[rowIndex + rowspan][columnIndex].blank &&
                        timetable[rowIndex + rowspan][columnIndex].lectures[0]
                          .subject === currentSubject &&
                        timetable[rowIndex + rowspan][
                          columnIndex
                        ].lectures[0].room.some((room) =>
                          currentRooms.includes(room)
                        )
                      ) {
                        rowspan++;
                      }

                      // Push the merged period into the array
                      mergedColumns.push(
                        <div
                          key={`${columnIndex}-${rowIndex}`}
                          className="w-full h-full flex flex-col rounded-xl items-center font-semibold"
                          style={{
                            backgroundColor: "#4287f5",
                            gridRow: `span ${rowspan}`,
                            fontSize: "16.5px",
                          }}
                        >
                          <div className="h-full w-[calc(100%-20px)] flex justify-between items-start mt-[6px]">
                            <span
                              style={{ fontSize: "18.5px" }}
                            >{`${period.lectures[0].subject}`}</span>
                            <span>{`${period.lectures[0].className}`}</span>
                          </div>
                          <div className="w-[calc(100%-20px)] h-full flex justify-between items-end mb-[6px]">
                            <span>{`${period.lectures[0].teacher.name}`}</span>
                            <span>{`${period.lectures[0].room.join(
                              ", "
                            )}`}</span>{" "}
                            {/* Join room array to display */}
                          </div>
                        </div>
                      );

                      // Skip the rows that were merged
                      rowIndex += rowspan - 1;
                    }

                    return (
                      <div
                        key={columnIndex}
                        className="grid grid-rows-[repeat(10,1fr)] gap-2"
                      >
                        {mergedColumns}
                      </div>
                    );
                  })
                : (() => {
                    let mergedPeriods = []; // To hold the merged periods for the selected column

                    for (
                      let rowIndex = 0;
                      rowIndex < timetable.length;
                      rowIndex++
                    ) {
                      const period =
                        timetable[rowIndex][
                          daysInWeek.findIndex(
                            (item) => item.value === dayOfWeek
                          )
                        ]; // Access the selected column

                      // If the period is blank, render an empty div
                      if (period.blank) {
                        mergedPeriods.push(
                          <div
                            className="w-full h-full"
                            key={`${daysInWeek.findIndex(
                              (item) => item.value === dayOfWeek
                            )}-${rowIndex}`}
                          ></div>
                        );
                        continue;
                      }

                      // Track consecutive periods with the same subject and room
                      let rowspan = 1;
                      const currentSubject = period.lectures[0].subject;
                      const currentRooms = period.lectures[0].room; // Convert room array to string for comparison

                      // Loop through the next rows to check if the same subject and room continue
                      while (
                        rowIndex + rowspan < timetable.length &&
                        !timetable[rowIndex + rowspan][
                          daysInWeek.findIndex(
                            (item) => item.value === dayOfWeek
                          )
                        ].blank && // Check in the selected column
                        timetable[rowIndex + rowspan][
                          daysInWeek.findIndex(
                            (item) => item.value === dayOfWeek
                          )
                        ].lectures[0].subject === currentSubject &&
                        timetable[rowIndex + rowspan][
                          daysInWeek.findIndex(
                            (item) => item.value === dayOfWeek
                          )
                        ].lectures[0].room.some((room) =>
                          currentRooms.includes(room)
                        )
                      ) {
                        rowspan++;
                      }

                      // Push the merged period into the array
                      mergedPeriods.push(
                        <div
                          key={`${daysInWeek.findIndex(
                            (item) => item.value === dayOfWeek
                          )}-${rowIndex}`}
                          className="w-full h-full flex flex-col rounded-xl items-center text-base font-semibold"
                          style={{
                            backgroundColor: "#4287f5",
                            gridRow: `span ${rowspan}`,
                          }}
                        >
                          <div className="h-full w-[calc(100%-20px)] flex justify-between items-start mt-[6px]">
                            <span>{`${period.lectures[0].subject}`}</span>
                            <span>{`${period.lectures[0].className}`}</span>
                          </div>
                          <div className="w-[calc(100%-20px)] h-full flex justify-between items-end mb-[6px]">
                            <span>{`${period.lectures[0].teacher.name}`}</span>
                            <span>{`${period.lectures[0].room.join(
                              ", "
                            )}`}</span>{" "}
                            {/* Join room array to display */}
                          </div>
                        </div>
                      );

                      // Skip the rows that were merged
                      rowIndex += rowspan - 1;
                    }

                    return (
                      <div className="grid grid-rows-[repeat(10,1fr)] gap-2">
                        {mergedPeriods}
                      </div>
                    );
                  })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
