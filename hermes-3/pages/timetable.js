import React, { useState, useEffect, useRef } from "react";
import { DateTime } from "luxon";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { auth } from "../modules/firebase";
import { hermesCSRFexpirationCheck } from "../modules/hermesMisc";
import { getTodaySubjects } from "../components/utils";
import { HexColorPicker } from "react-colorful";
import { getClassColors, setClassColor } from "@/modules/userConfig";

export default function Timetable() {
  const timetable = [
    [
      {
        blank: true,
      },
      {
        blank: true,
      },
      {
        lectures: [
          {
            subject: "Maths st",
            className: "1M21S",
            teacher: {
              name: "Leu",
              profileUrl:
                "/maitres/annuaire/126d7383-362c-488f-ae05-e491a9ea3024/",
            },
            room: ["v134"],
          },
        ],
        blank: false,
      },
      {
        lectures: [
          {
            subject: "Musique",
            className: "1OSMU",
            teacher: {
              name: "Mar",
              profileUrl:
                "/maitres/annuaire/883a0fd6-9c4c-41e5-afdf-36c7d068f402/",
            },
            room: ["e201"],
          },
        ],
        blank: false,
      },
      {
        lectures: [
          {
            subject: "Maths st",
            className: "1M21S",
            teacher: {
              name: "Leu",
              profileUrl:
                "/maitres/annuaire/126d7383-362c-488f-ae05-e491a9ea3024/",
            },
            room: ["v134"],
          },
        ],
        blank: false,
      },
    ],
    [
      {
        lectures: [
          {
            subject: "Chimie",
            className: "1 M21",
            teacher: {
              name: "Rys",
              profileUrl:
                "/maitres/annuaire/4aa3c129-6c0d-405a-9d20-2a51fe52990c/",
            },
            room: ["b150"],
          },
        ],
        blank: false,
      },
      {
        lectures: [
          {
            subject: "Maths st",
            className: "1M21S",
            teacher: {
              name: "Leu",
              profileUrl:
                "/maitres/annuaire/126d7383-362c-488f-ae05-e491a9ea3024/",
            },
            room: ["v134"],
          },
        ],
        blank: false,
      },
      {
        lectures: [
          {
            subject: "Anglais",
            className: "1 M21",
            teacher: {
              name: "Bei",
              profileUrl:
                "/maitres/annuaire/074eed78-3aa0-4b97-811b-955aa5ba555e/",
            },
            room: ["v134"],
          },
        ],
        blank: false,
      },
      {
        lectures: [
          {
            subject: "Musique",
            className: "1OSMU",
            teacher: {
              name: "Mar",
              profileUrl:
                "/maitres/annuaire/883a0fd6-9c4c-41e5-afdf-36c7d068f402/",
            },
            room: ["a201", "e201"],
          },
        ],
        blank: false,
      },
      {
        lectures: [
          {
            subject: "Anglais",
            className: "1 M21",
            teacher: {
              name: "Bei",
              profileUrl:
                "/maitres/annuaire/074eed78-3aa0-4b97-811b-955aa5ba555e/",
            },
            room: ["v134"],
          },
        ],
        blank: false,
      },
    ],
    [
      {
        lectures: [
          {
            subject: "Français",
            className: "1 M21",
            teacher: {
              name: "Zin",
              profileUrl:
                "/maitres/annuaire/a5dcea08-474d-4e4e-8388-fdaab7d42102/",
            },
            room: ["v134"],
          },
        ],
        blank: false,
      },
      {
        lectures: [
          {
            subject: "Maths st",
            className: "1M21S",
            teacher: {
              name: "Leu",
              profileUrl:
                "/maitres/annuaire/126d7383-362c-488f-ae05-e491a9ea3024/",
            },
            room: ["v134"],
          },
        ],
        blank: false,
      },
      {
        lectures: [
          {
            subject: "Chimie",
            className: "1 M21",
            teacher: {
              name: "Rys",
              profileUrl:
                "/maitres/annuaire/4aa3c129-6c0d-405a-9d20-2a51fe52990c/",
            },
            room: ["b142"],
          },
          {
            subject: "Info",
            className: "1 M21",
            teacher: {
              name: "Dio",
              profileUrl:
                "/maitres/annuaire/8e0db23f-4779-4b02-9ddb-7a1fe319bcd9/",
            },
            room: ["v305"],
          },
          {
            subject: "Physique",
            className: "1 M21",
            teacher: {
              name: "Tal",
              profileUrl:
                "/maitres/annuaire/a83610a0-721d-4999-b096-fe7872c94fc5/",
            },
            room: ["v309"],
          },
        ],
        blank: false,
      },
      {
        lectures: [
          {
            subject: "Sports",
            className: "1 M21",
            teacher: {
              name: "Roh",
              profileUrl:
                "/maitres/annuaire/1c7787e6-94fd-4948-a901-95d659eec6ee/",
            },
            room: ["s118"],
          },
        ],
        blank: false,
      },
      {
        lectures: [
          {
            subject: "Anglais",
            className: "1 M21",
            teacher: {
              name: "Bei",
              profileUrl:
                "/maitres/annuaire/074eed78-3aa0-4b97-811b-955aa5ba555e/",
            },
            room: ["v134"],
          },
        ],
        blank: false,
      },
    ],
    [
      {
        lectures: [
          {
            subject: "Français",
            className: "1 M21",
            teacher: {
              name: "Zin",
              profileUrl:
                "/maitres/annuaire/a5dcea08-474d-4e4e-8388-fdaab7d42102/",
            },
            room: ["v134"],
          },
        ],
        blank: false,
      },
      {
        lectures: [
          {
            subject: "Français",
            className: "1 M21",
            teacher: {
              name: "Zin",
              profileUrl:
                "/maitres/annuaire/a5dcea08-474d-4e4e-8388-fdaab7d42102/",
            },
            room: ["v134"],
          },
        ],
        blank: false,
      },
      {
        lectures: [
          {
            subject: "Chimie",
            className: "1 M21",
            teacher: {
              name: "Rys",
              profileUrl:
                "/maitres/annuaire/4aa3c129-6c0d-405a-9d20-2a51fe52990c/",
            },
            room: ["b142"],
          },
          {
            subject: "Info",
            className: "1 M21",
            teacher: {
              name: "Dio",
              profileUrl:
                "/maitres/annuaire/8e0db23f-4779-4b02-9ddb-7a1fe319bcd9/",
            },
            room: ["v305"],
          },
          {
            subject: "Physique",
            className: "1 M21",
            teacher: {
              name: "Tal",
              profileUrl:
                "/maitres/annuaire/a83610a0-721d-4999-b096-fe7872c94fc5/",
            },
            room: ["v309"],
          },
        ],
        blank: false,
      },
      {
        lectures: [
          {
            subject: "Sports",
            className: "1 M21",
            teacher: {
              name: "Roh",
              profileUrl:
                "/maitres/annuaire/1c7787e6-94fd-4948-a901-95d659eec6ee/",
            },
            room: ["s118"],
          },
        ],
        blank: false,
      },
      {
        lectures: [
          {
            subject: "Allemand",
            className: "1 M21",
            teacher: {
              name: "Pfi",
              profileUrl:
                "/maitres/annuaire/fd4fc7a4-6e50-4dd7-ae4c-70eb0d5fa288/",
            },
            room: ["v134"],
          },
        ],
        blank: false,
      },
    ],
    [
      {
        blank: true,
      },
      {
        blank: true,
      },
      {
        lectures: [
          {
            subject: "Chimie",
            className: "1 M21",
            teacher: {
              name: "Rys",
              profileUrl:
                "/maitres/annuaire/4aa3c129-6c0d-405a-9d20-2a51fe52990c/",
            },
            room: ["b150"],
          },
        ],
        blank: false,
      },
      {
        lectures: [
          {
            subject: "Allemand",
            className: "1 M21",
            teacher: {
              name: "Pfi",
              profileUrl:
                "/maitres/annuaire/fd4fc7a4-6e50-4dd7-ae4c-70eb0d5fa288/",
            },
            room: ["v134"],
          },
        ],
        blank: false,
      },
      {
        blank: true,
      },
    ],
    [
      {
        lectures: [
          {
            subject: "Musique",
            className: "Atelier Rock",
            teacher: {
              name: "Noi",
              profileUrl:
                "/maitres/annuaire/871be27b-693f-4668-8133-e61b8980f9ec/",
            },
            room: ["e201"],
          },
        ],
        blank: false,
      },
      {
        lectures: [
          {
            subject: "Sports",
            className: "1 M21",
            teacher: {
              name: "Amm",
              profileUrl:
                "/maitres/annuaire/0fd3497e-9141-4618-852e-fed8b6ad6713/",
            },
            room: ["s117"],
          },
        ],
        blank: false,
      },
      {
        blank: true,
      },
      {
        blank: true,
      },
      {
        lectures: [
          {
            subject: "Info",
            className: "1 M21",
            teacher: {
              name: "Dio",
              profileUrl:
                "/maitres/annuaire/8e0db23f-4779-4b02-9ddb-7a1fe319bcd9/",
            },
            room: ["v134"],
          },
        ],
        blank: false,
      },
    ],
    [
      {
        lectures: [
          {
            subject: "Eco et droit",
            className: "1 M21",
            teacher: {
              name: "Kri",
              profileUrl:
                "/maitres/annuaire/6cf03a94-96c3-47b4-b20c-f59be257ab23/",
            },
            room: ["v134"],
          },
        ],
        blank: false,
      },
      {
        lectures: [
          {
            subject: "Anglais",
            className: "1 M21",
            teacher: {
              name: "Bei",
              profileUrl:
                "/maitres/annuaire/074eed78-3aa0-4b97-811b-955aa5ba555e/",
            },
            room: ["v134"],
          },
        ],
        blank: false,
      },
      {
        lectures: [
          {
            subject: "Allemand",
            className: "1 M21",
            teacher: {
              name: "Pfi",
              profileUrl:
                "/maitres/annuaire/fd4fc7a4-6e50-4dd7-ae4c-70eb0d5fa288/",
            },
            room: ["v134"],
          },
        ],
        blank: false,
      },
      {
        lectures: [
          {
            subject: "Physique",
            className: "1 M21",
            teacher: {
              name: "Tal",
              profileUrl:
                "/maitres/annuaire/a83610a0-721d-4999-b096-fe7872c94fc5/",
            },
            room: ["v308"],
          },
        ],
        blank: false,
      },
      {
        lectures: [
          {
            subject: "Français",
            className: "1 M21",
            teacher: {
              name: "Zin",
              profileUrl:
                "/maitres/annuaire/a5dcea08-474d-4e4e-8388-fdaab7d42102/",
            },
            room: ["v134"],
          },
        ],
        blank: false,
      },
    ],
    [
      {
        lectures: [
          {
            subject: "Eco et droit",
            className: "1 M21",
            teacher: {
              name: "Kri",
              profileUrl:
                "/maitres/annuaire/6cf03a94-96c3-47b4-b20c-f59be257ab23/",
            },
            room: ["v134"],
          },
        ],
        blank: false,
      },
      {
        lectures: [
          {
            subject: "Musique",
            className: "1OSMU",
            teacher: {
              name: "Noi",
              profileUrl:
                "/maitres/annuaire/871be27b-693f-4668-8133-e61b8980f9ec/",
            },
            room: ["a201", "e201"],
          },
        ],
        blank: false,
      },
      {
        lectures: [
          {
            subject: "Allemand",
            className: "1 M21",
            teacher: {
              name: "Pfi",
              profileUrl:
                "/maitres/annuaire/fd4fc7a4-6e50-4dd7-ae4c-70eb0d5fa288/",
            },
            room: ["v134"],
          },
        ],
        blank: false,
      },
      {
        lectures: [
          {
            subject: "Musique",
            className: "1 M21",
            teacher: {
              name: "Bic",
              profileUrl:
                "/maitres/annuaire/2e26af6b-3e89-49e8-8bb0-d7e5573189e9/",
            },
            room: ["a201", "e201"],
          },
        ],
        blank: false,
      },
      {
        lectures: [
          {
            subject: "Français",
            className: "1 M21",
            teacher: {
              name: "Zin",
              profileUrl:
                "/maitres/annuaire/a5dcea08-474d-4e4e-8388-fdaab7d42102/",
            },
            room: ["v134"],
          },
        ],
        blank: false,
      },
    ],
    [
      {
        lectures: [
          {
            subject: "Histoire",
            className: "1 M21",
            teacher: {
              name: "Zam",
              profileUrl:
                "/maitres/annuaire/b6952084-0acf-497c-a56f-7621c7ceac8e/",
            },
            room: ["v134"],
          },
        ],
        blank: false,
      },
      {
        lectures: [
          {
            subject: "Musique",
            className: "1OSMU",
            teacher: {
              name: "Noi",
              profileUrl:
                "/maitres/annuaire/871be27b-693f-4668-8133-e61b8980f9ec/",
            },
            room: ["a201", "e201"],
          },
        ],
        blank: false,
      },
      {
        blank: true,
      },
      {
        lectures: [
          {
            subject: "Musique",
            className: "1 M21",
            teacher: {
              name: "Bic",
              profileUrl:
                "/maitres/annuaire/2e26af6b-3e89-49e8-8bb0-d7e5573189e9/",
            },
            room: ["a201", "e201"],
          },
        ],
        blank: false,
      },
      {
        blank: true,
      },
    ],
    [
      {
        lectures: [
          {
            subject: "Histoire",
            className: "1 M21",
            teacher: {
              name: "Zam",
              profileUrl:
                "/maitres/annuaire/b6952084-0acf-497c-a56f-7621c7ceac8e/",
            },
            room: ["v134"],
          },
        ],
        blank: false,
      },
      {
        blank: true,
      },
      {
        blank: true,
      },
      {
        blank: true,
      },
      {
        blank: true,
      },
    ],
  ];
  const [popupClosed, setPopupClosed] = useState(true);
  const [popupColorPicker, setPopupColorPicker] = useState({
    closed: true,
    subject: "Info",
    initialColor: "#bb999c",
  });
  const { user, loading } = useAuth();
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
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownHeight, setDropdownHeight] = useState(0);
  const dropdownRef = useRef(null);

  const [todayClasses, setTodayClasses] = useState(getTodaySubjects(timetable));

  const asyncHermesAPIcheck = async () => {
    if (hermesExpiration === 0) {
      const idToken = await user.getIdToken();
      const { is_expired, expiration_date } = await hermesCSRFexpirationCheck(
        idToken
      );
      if (is_expired) {
        try {
          await signOut(auth); // Sign the user out
          router.push("/"); // Redirect to login page after logout
        } catch (error) {
          console.error("Error signing out: ", error);
        }
      } else {
        setHermesExpiration(expiration_date);
      }
    } else {
      if (hermesExpiration < Date.now()) {
        try {
          await signOut(auth); // Sign the user out
          router.push("/"); // Redirect to login page after logout
        } catch (error) {
          console.error("Error signing out: ", error);
        }
      }
    }
  };

  const setUserCustomClassColors = async (user) => {
    const idToken = await user.getIdToken();
    var updatedClassColors = await getClassColors(idToken);
    todayClasses.forEach((classColor) => {
      if (updatedClassColors.findIndex((item) => item.subject == classColor.subject) == -1) {
        updatedClassColors.push({ subject: classColor.subject, color: classColor.color })
      }
    });
    setTodayClasses(updatedClassColors);
    console.log(updatedClassColors);
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
    if (dropdownRef.current) {
      setDropdownHeight(dropdownRef.current.scrollHeight);
    }

    if (user) asyncHermesAPIcheck();
    if (user) setUserCustomClassColors(user);

  }, [user, loading, router, dropdownHeight]);

  if (loading) {
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

  const handleWeekNavigation = (direction) => {
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

  return (
    <div className="relative h-screen w-screen">
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
                  ].color
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
              onClick={() => setIsOpen(!isOpen)}
              className="w-full bg-gray-700 text-gray-100 py-2 px-4 font-semibold rounded-lg flex justify-between items-center"
            >
              <span>Classes</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : "rotate-0"
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
              ref={dropdownRef}
              className={`transition-all duration-500 ease-in-out overflow-hidden select-none ${
                isOpen ? `max-h-[${dropdownHeight}px]` : "max-h-0"
              }`}
              style={{ maxHeight: isOpen ? `${dropdownHeight}px` : "0px" }}
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
              <div className="relative w-full h-full mr-3">
                <div
                  className={`absolute bottom-0 left-0 grid gap-2 select-none w-full h-full z-20
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
                            !timetable[rowIndex + rowspan][columnIndex].blank &&
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
                                  ].color,
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
                                  ].color,
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
          </div>
        </div>
      </div>
    </div>
  );
}
