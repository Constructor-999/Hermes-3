import React, { useState, useEffect, useRef } from "react";
import { DateTime } from "luxon";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { auth } from "../modules/firebase";
import {
  hermesCSRFexpirationCheck,
  getHermesBDD,
  hermesSearch,
  getTimetable,
} from "../modules/hermesMisc";
import { getTodaySubjects } from "../components/utils";
import { HexColorPicker } from "react-colorful";
import { getUserData, setClassColor } from "../modules/userConfig";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

export default function Timetable() {
  const [timetable, setTimetable] = useState([]);
  const [popupClosed, setPopupClosed] = useState(true);
  const [loadingTimetable, setLoadingTimetable] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [downloadingBDD, setDownloadingBDD] = useState(false);
  const [popupColorPicker, setPopupColorPicker] = useState({
    closed: true,
    subject: "Info",
    initialColor: "#bb999c",
  });
  const { user, loading } = useAuth();
  const pageRef = useRef(null);
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(
    DateTime.now().setZone("UTC+2")
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [hermesExpiration, setHermesExpiration] = useState(0);
  const [isDayWeek, setDayWeek] = useState("week");
  const [dayOfWeek, setDayOfWeek] = useState(
    currentDate.weekdayShort.toLowerCase().slice(0, 3) === "sat" || "sun"
      ? "mon"
      : currentDate.weekdayShort.toLowerCase().slice(0, 3)
  );
  const [isClassColorOpen, setClassColorIsOpen] = useState(false);
  const [classColorDropdownHeight, setClassColorDropdownHeight] = useState(0);
  const classColorDropdownRef = useRef(null);
  const [todayClasses, setTodayClasses] = useState([]);
  const [calendarPickerHidden, setCalendarPickerHidden] = useState(true);

  const [isSearchRecommandationOpen, setIsSearchRecommandationOpen] =
    useState(false);
  const [
    searchRecommandationDropdownHeight,
    setSearchRecommandationDropdownHeight,
  ] = useState(0);
  const searchRecommandationDropdownRef = useRef(null);
  const [searchData, setSearchData] = useState([]);
  const [userData, setUserData] = useState({});
  const [timetableFound, setTimetableFound] = useState(true);
  const [stopIt429, setStopIt429] = useState(false);
  const getTimetableTimeout = useRef(null);
  const [currentTimetable, setCurrentTimetable] = useState("");

  const asyncHermesAPIcheck = async () => {
    if (hermesExpiration === 0) {
      const idToken = await user.getIdToken();
      const { is_expired, expiration_date } = await hermesCSRFexpirationCheck(
        idToken
      );
      if (is_expired) {
        try {
          await signOut(auth);
          router.push("/");
        } catch (error) {
          console.error("Error signing out: ", error);
        }
      } else {
        setHermesExpiration(expiration_date);
      }
    } else {
      if (hermesExpiration < Date.now()) {
        try {
          await signOut(auth);
          router.push("/");
        } catch (error) {
          console.error("Error signing out: ", error);
        }
      }
    }
  };

  const fetchUserData = async (user) => {
    const idToken = await user.getIdToken();
    const updatedClassColors = await getUserData(idToken);
    setUserData(updatedClassColors);
  };

  const setUserCustomClassColors = async (timeTable) => {
    let updatedClassColors = [];

    getTodaySubjects(timeTable).forEach((classColor) => {
      const classIndex = userData.class_colors.findIndex(
        (item) => item.subject == classColor.subject
      );
      if (classIndex != -1) {
        updatedClassColors.push({
          subject: userData.class_colors[classIndex].subject,
          color: userData.class_colors[classIndex].color,
        });
      } else {
        updatedClassColors.push({
          subject: classColor.subject,
          color: classColor.color,
        });
      }
    });
    setTodayClasses(updatedClassColors);
    setSearchData([]);
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (classColorDropdownRef.current) {
      setClassColorDropdownHeight(classColorDropdownRef.current.scrollHeight);
    }

    if (searchRecommandationDropdownRef.current) {
      setSearchRecommandationDropdownHeight(
        searchRecommandationDropdownRef.current.scrollHeight
      );
    }
  }, [
    classColorDropdownHeight,
    searchRecommandationDropdownHeight,
    user,
    searchData,
  ]);

  useEffect(() => {
    if (user) {
      const regex = /^(?!["\s]*$).+/;
      if (regex.test(searchTerm)) {
        setSearchData(hermesSearch(searchTerm, user));
        if (!isSearchRecommandationOpen) {
          setIsSearchRecommandationOpen(true);
        }
      } else {
        if (isSearchRecommandationOpen) {
          setIsSearchRecommandationOpen(false);
        }
      }
    }
  }, [searchTerm]);

  useEffect(() => {
    addEventListener("storage", () => {
      const hermesBDD = localStorage.getItem("HermesDB");
      if (
        hermesBDD == null ||
        hermesBDD == `{"error":"Too many requests. Please try again later."}`
      ) {
        setDownloadingBDD(true);
      } else {
        setDownloadingBDD(false);
      }
    });

    if (user) {
      clearTimeout(getTimetableTimeout.current);
      if (localStorage.getItem("HermesDB") == null) {
        getHermesBDD(user);
      }
    }
    if (user && JSON.stringify(userData) == "{}") asyncHermesAPIcheck();
    if (user && JSON.stringify(userData) == "{}") fetchUserData(user);

    if (JSON.stringify(userData) != "{}") {
      if (userData.hermes_id == "") {
        setIsNewUser(true);
      } else {
        handleFetchTimetable(userData.hermes_id);
      }
    }
  }, [user, userData]);

  useEffect(() => {
    if (user && JSON.stringify(userData) != "{}") {
      setUserCustomClassColors(timetable);
    }
  }, [timetable, userData]);

  if (loading || downloadingBDD) {
    return <div>Loading...</div>;
  }

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
  const bruhBlank = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  const displayBBDcategories = {
    maitre: "Maitres",
    eleve: "Élèves",
    salle: "Salles",
    klass_eleve: "Horaires des élèves de la classe",
    klass_maitre: "Horaires des maîtres de la classe",
    cours: "Horaires des maîtres du groupe",
    files: "Maîtes appartenant à la file",
  };

  const handleWeekNavigation = (direction) => {
    updateTimetable();
    const newDate =
      direction === "prev"
        ? currentDate.minus({ weeks: 1 })
        : currentDate.plus({ weeks: 1 });
    setCurrentDate(newDate);
  };

  const handleColorPickerPopup = (subject, initialColor) => {
    setPopupClosed(false);
    setPopupColorPicker({ closed: false, subject, initialColor });
  };

  const updateTimetable = () => {
    clearTimeout(getTimetableTimeout.current);
    getTimetableTimeout.current = setTimeout(() => {
      if (currentTimetable != "") {
        handleFetchTimetable(currentTimetable);
      }
    }, 1200);
  };

  const handleChangeDateFromCalendar = (newDate) => {
    if (calendarPickerHidden == false) {
      setCalendarPickerHidden(true);
    }
    setCurrentDate(newDate);
    updateTimetable();
  };
  const handleColorPickerPopupCancel = () => {
    setPopupClosed(true);
    handleSetClassColor(
      popupColorPicker.subject,
      popupColorPicker.initialColor
    );
    setPopupColorPicker({
      closed: true,
      subject: "Info",
      initialColor: "#bb999c",
    });
  };

  const handleClassColorSettingChange = async (subject, newColor) => {
    const status = await setClassColor(user, subject, newColor);
    if (status) {
      setPopupClosed(true);
      setPopupColorPicker({
        closed: true,
        subject: "Info",
        initialColor: "#bb999c",
      });
    } else {
      handleColorPickerPopupCancel();
    }
  };

  const handleSetClassColor = (subjectName, newColor) => {
    var updatedClassColors = [];
    todayClasses.forEach((classColor) => {
      if (classColor.subject == subjectName) {
        updatedClassColors.push({ subject: subjectName, color: newColor });
      } else {
        updatedClassColors.push(classColor);
      }
    });
    setTodayClasses(updatedClassColors);
  };

  const handleFetchTimetable = async (id) => {
    if (user) {
      if (currentTimetable != id) {
        setCurrentTimetable(id);
      }
      setLoadingTimetable(true);
      const fetchedTimetable = await getTimetable(
        user,
        id,
        currentDate.startOf("week").toFormat("dd-MM-yyyy"),
        isNewUser
      );
      if (fetchedTimetable != "404" && fetchedTimetable != "429") {
        setTimetableFound(true);
        setStopIt429(false);
        setLoadingTimetable(false);
        setTimetable(fetchedTimetable);
        setSearchTerm("");
      }
      if (fetchedTimetable == "404") {
        setTimetable([]);
        setStopIt429(false);
        setTimetableFound(false);
        setLoadingTimetable(false);
      }
      if (fetchedTimetable == "429") {
        setTimetable([]);
        setStopIt429(true);
        setTimetableFound(false);
        setLoadingTimetable(false);
        setSearchTerm("");
      }
      if (fetchedTimetable == "500") {
        setTimetable([]);
        setStopIt429(false);
        setTimetableFound(false);
        setLoadingTimetable(false);
      }
    }
  };

  return (
    <div ref={pageRef} className="relative h-screen w-screen">
      <div
        className="absolute w-screen h-screen z-10 bottom-0 left-0"
        hidden={popupClosed}
      >
        <div
          className="w-screen h-screen relative"
          hidden={popupColorPicker.closed}
        >
          <div className="absolute bottom-0 left-0 w-screen h-screen bg-black opacity-15 "></div>
          <div className="absolute bottom-0 left-0 flex items-center justify-center w-screen h-screen z-10">
            <div className="flex items-center flex-col w-[250px] h-fit rounded-2xl bg-[#3a506b]">
              <HexColorPicker
                className="mt-5"
                color={
                  todayClasses[
                    todayClasses.findIndex(
                      (item) => item.subject == popupColorPicker.subject
                    )
                  ]?.color
                }
                onChange={(color) =>
                  handleSetClassColor(popupColorPicker.subject, color)
                }
              />
              <div className="flex justify-between w-[200px] mb-5 mt-4">
                <button
                  className="h-fit w-fit text-center text-lg text-gray-200 font-semibold bg-red-600 py-1.5 px-3 rounded-xl"
                  onClick={() => handleColorPickerPopupCancel()}
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    handleClassColorSettingChange(
                      popupColorPicker.subject,
                      todayClasses[
                        todayClasses.findIndex(
                          (item) => item.subject == popupColorPicker.subject
                        )
                      ].color
                    )
                  }
                  className={`h-fit w-fit text-center text-lg font-semibold bg-green-600 text-gray-200 py-1.5 px-3 rounded-xl`}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 flex h-screen w-screen dark:bg-gray-700 bg-white z-0">
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
          <div className="relative">
            <button
              onClick={() => setClassColorIsOpen(!isClassColorOpen)}
              className="w-full bg-gray-700 text-gray-100 py-2 px-4 font-semibold rounded-lg flex justify-between items-center"
            >
              <span>Classes</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transition-transform duration-300 ${
                  isClassColorOpen ? "rotate-180" : "rotate-0"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              ref={classColorDropdownRef}
              className={`transition-all duration-500 ease-in-out overflow-hidden select-none`}
              style={{
                maxHeight: isClassColorOpen
                  ? `${classColorDropdownHeight}px`
                  : "0px",
              }}
            >
              <ul className="bg-gray-100 dark:bg-gray-800 mt-2 rounded-lg">
                {todayClasses.map((category, index) => (
                  <li key={index} className="h-fit">
                    <button
                      className="py-2 px-4 flex items-center hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg w-full"
                      onClick={() =>
                        handleColorPickerPopup(category.subject, category.color)
                      }
                    >
                      <span
                        className={`h-3 w-3 rounded-full mr-2`}
                        style={{ backgroundColor: category.color }}
                      ></span>
                      {category.subject}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="relative flex flex-col w-full">
          <div
            ref={searchRecommandationDropdownRef}
            className={`absolute top-0 left-0 ml-3 mt-[64px] rounded-lg min-w-40 z-30 transition-all duration-300 ease-in-out select-none
                        overflow-hidden border-indigo-600
                ${
                  isSearchRecommandationOpen &&
                  searchRecommandationDropdownHeight >
                    pageRef.current.scrollHeight
                    ? `overflow-y-auto`
                    : "overflow-hidden"
                }
                ${
                  isSearchRecommandationOpen
                    ? searchRecommandationDropdownHeight >
                      pageRef.current.scrollHeight
                      ? `max-h-[${
                          pageRef.current.scrollHeight * 0.8
                        }px] border-2`
                      : `max-h-[${searchRecommandationDropdownHeight}px] border-2`
                    : "max-h-0 border-0"
                }`}
            style={{
              maxHeight: isSearchRecommandationOpen
                ? searchRecommandationDropdownHeight >
                  pageRef.current.scrollHeight
                  ? `${pageRef.current.scrollHeight * 0.8}px`
                  : `${searchRecommandationDropdownHeight + 4}px`
                : "0px",
            }}
          >
            <ul className="bg-gray-100 dark:bg-[#2F3645] rounded-lg">
              {searchData.length == 0 ? (
                <div className="w-full h-fit">
                  <li className="h-fit">
                    <span className="py-2 px-4 flex items-center rounded-lg w-full font-bold text-lg">
                      No match
                    </span>
                  </li>
                </div>
              ) : (
                searchData.map((category, index_category) => (
                  <div className="w-full h-fit">
                    <li key={index_category} className="h-fit">
                      <span className="pt-2 pb-0 px-4 flex items-center rounded-lg w-full font-bold text-lg">
                        {displayBBDcategories[`${category.name}`]}
                      </span>
                    </li>
                    {category.data.map((human, index_human) => (
                      <li key={index_human} className="h-fit">
                        <button
                          className={`hover:bg-gray-200 dark:hover:bg-gray-600 py-1 px-4 flex items-center rounded-md w-full`}
                          onClick={() => handleFetchTimetable(human.id)}
                        >
                          {human.text}
                        </button>
                      </li>
                    ))}
                  </div>
                ))
              )}
            </ul>
          </div>
          <div
            className="absolute top-0 right-0 mt-[66px] mr-[276px] rounded-lg border-2 text-white border-indigo-600 dark:bg-gray-800 z-30"
            hidden={calendarPickerHidden}
          >
            <LocalizationProvider dateAdapter={AdapterLuxon}>
              <DateCalendar
                value={currentDate}
                onChange={(newDate) => handleChangeDateFromCalendar(newDate)}
                slotProps={{
                  day: {
                    sx: {
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "0.85em",
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </div>
          <div
            className={`h-[75px] dark:bg-gray-800 bg-gray-200 w-full flex items-center z-10`}
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center ml-3">
                <input
                  type="text"
                  placeholder="Search classes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-[260px] px-3 py-2 bg-gray-300 dark:bg-gray-600 border border-gray-500 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  onClick={() => setIsNewUser(true)}
                  className="ml-3 dark:bg-gray-600 bg-gray-300 dark:text-white text-gray-600 w-[40px] h-[40px] flex items-center justify-center rounded-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    viewBox="0 0 32 32"
                    className="w-8 h-8 fill-gray-100"
                  >
                    <path d="M 16 4 C 10.886719 4 6.617188 7.160156 4.875 11.625 L 6.71875 12.375 C 8.175781 8.640625 11.710938 6 16 6 C 19.242188 6 22.132813 7.589844 23.9375 10 L 20 10 L 20 12 L 27 12 L 27 5 L 25 5 L 25 8.09375 C 22.808594 5.582031 19.570313 4 16 4 Z M 25.28125 19.625 C 23.824219 23.359375 20.289063 26 16 26 C 12.722656 26 9.84375 24.386719 8.03125 22 L 12 22 L 12 20 L 5 20 L 5 27 L 7 27 L 7 23.90625 C 9.1875 26.386719 12.394531 28 16 28 C 21.113281 28 25.382813 24.839844 27.125 20.375 Z"></path>
                  </svg>
                </button>
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
                  <button
                    className="dark:bg-gray-600 bg-gray-300 dark:text-white text-gray-600 text-lg text-center font-bold px-6 py-2 rounded-lg min-w-[216px]"
                    onClick={() => {
                      setCalendarPickerHidden(!calendarPickerHidden);
                    }}
                  >
                    {currentDate.startOf("week").toFormat("DDD")}{" "}
                  </button>
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
            {JSON.stringify(timetable) != "[]" ? (
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
                <div className="relative w-full h-full mr-3">
                  <div
                    className={`absolute bottom-0 left-0 grid gap-2 select-none w-full h-full z-20
            ${isDayWeek === "day" ? "grid-cols-1" : "grid-cols-5"} h-full`}
                  >
                    {isDayWeek === "week"
                      ? timetable[0]?.map((_, columnIndex) => {
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
                                  key={`empty-${columnIndex}-${rowIndex}`}
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
                              !timetable[rowIndex + rowspan][columnIndex]
                                .blank &&
                              timetable[rowIndex + rowspan][columnIndex]
                                .lectures[0].subject === currentSubject &&
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
                                key={`merged-${columnIndex}-${rowIndex}-${rowspan}`}
                                className="w-full h-full flex flex-col rounded-xl items-center font-semibold"
                                style={{
                                  backgroundColor:
                                    todayClasses[
                                      todayClasses.findIndex(
                                        (classSubject) =>
                                          classSubject.subject ==
                                          period.lectures[0].subject
                                      )
                                    ]?.color,
                                  gridRow: `span ${rowspan}`,
                                  fontSize: "16.5px",
                                }}
                              >
                                <div className="h-full w-[calc(100%-20px)] flex justify-between items-start mt-[6px]">
                                  <span
                                    style={{ fontSize: "18.5px" }}
                                  >{`${period?.lectures[0].subject}`}</span>
                                  <span>{`${period?.lectures[0].className}`}</span>
                                </div>
                                <div className="w-[calc(100%-20px)] h-full flex justify-between items-end mb-[6px]">
                                  <span>{`${period?.lectures[0].teacher.name}`}</span>
                                  <span>{`${period?.lectures[0].room.join(
                                    ", "
                                  )}`}</span>
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
                                  key={`empty-${daysInWeek.findIndex(
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
                                key={`merge-${daysInWeek.findIndex(
                                  (item) => item.value === dayOfWeek
                                )}-${rowIndex}-${rowspan}`}
                                className="w-full h-full flex flex-col rounded-xl items-center text-base font-semibold"
                                style={{
                                  backgroundColor:
                                    todayClasses[
                                      todayClasses.findIndex(
                                        (classSubject) =>
                                          classSubject.subject ==
                                          period.lectures[0].subject
                                      )
                                    ]?.color,
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
                  <div className="absolute grid grid-cols-1 grid-rows-10 w-full h-full bottom-0 gap-2 left-0 z-10 items-center">
                    {bruhBlank.map((index) => (
                      <div className="w-full h-[calc(100%+5px)] dark:bg-gray-700 bg-white"></div>
                    ))}
                  </div>
                  <div className="absolute w-full h-full bottom-0 left-0 z-0 dark:bg-gray-500 bg-gray-300"></div>
                </div>
              </div>
            ) : (
              <div className="flex w-full h-full mr-3 justify-center items-center">
                {loadingTimetable ? (
                  <div className="flex items-center flex-col">
                    <img
                      src="/fish.gif"
                      className="rounded-3xl"
                      alt="FISH"
                    ></img>
                    <span className="mt-3 font-extrabold text-3xl dark:text-white text-black">
                      Loading Timetable
                    </span>
                  </div>
                ) : isNewUser ? (
                  <span className="font-extrabold text-4xl dark:text-white text-black">
                    If you are a new USER search yourself in the SEARCH BAR
                  </span>
                ) : timetableFound ? (
                  <span className="font-extrabold text-4xl dark:text-white text-black">
                    ...
                  </span>
                ) : stopIt429 ? (
                  <div className="flex items-center flex-col">
                    <img
                      src="/429-stop.gif"
                      className="rounded-3xl"
                      alt="Don't be stupid ... (429)"
                    ></img>
                    <span className="mt-3 font-extrabold text-3xl dark:text-white text-black">
                      Don't be stupid... (429)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center flex-col">
                    <img
                      src="/404-fine.gif"
                      className="rounded-3xl"
                      alt="404 ERROR"
                    ></img>
                    <span className="mt-3 font-extrabold text-3xl dark:text-white text-black">
                      Hmm... no timetable (404)
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
