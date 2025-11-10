"use client";

import React from "react";

type DaySchedule = {
  enabled: boolean;
  startTime: string;
  endTime: string;
};

type ScheduleData = {
  [key: string]: DaySchedule;
};

type Props = {
  schedule: ScheduleData;
  onChange: (schedule: ScheduleData) => void;
};

const DAYS = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

// Generate time options in 15-minute intervals
const generateTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const hourStr = hour.toString().padStart(2, "0");
      const minuteStr = minute.toString().padStart(2, "0");
      const time24 = `${hourStr}:${minuteStr}`;

      // Convert to 12-hour format for display
      const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const ampm = hour < 12 ? "AM" : "PM";
      const display = `${hour12}:${minuteStr} ${ampm}`;

      times.push({ value: time24, label: display });
    }
  }
  return times;
};

const TIME_OPTIONS = generateTimeOptions();

function DayTimeSelector({ schedule, onChange }: Props) {
  const toggleDay = (dayKey: string) => {
    onChange({
      ...schedule,
      [dayKey]: {
        ...schedule[dayKey],
        enabled: !schedule[dayKey].enabled,
      },
    });
  };

  const updateTime = (
    dayKey: string,
    field: "startTime" | "endTime",
    value: string
  ) => {
    onChange({
      ...schedule,
      [dayKey]: {
        ...schedule[dayKey],
        [field]: value,
      },
    });
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        {DAYS.map((day) => {
          const daySchedule = schedule[day.key];
          return (
            <div
              key={day.key}
              className="flex items-center gap-4 border-b border-neutral-200 pb-4"
            >
              <div className="w-32 flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={daySchedule.enabled}
                  onChange={() => toggleDay(day.key)}
                  className="w-5 h-5 text-black border-neutral-300 rounded focus:ring-black cursor-pointer"
                />
                <label className="font-medium text-neutral-700">
                  {day.label}
                </label>
              </div>

              {daySchedule.enabled ? (
                <div className="flex-1 flex items-center gap-3">
                  <select
                    value={daySchedule.startTime}
                    onChange={(e) =>
                      updateTime(day.key, "startTime", e.target.value)
                    }
                    className="px-3 py-2 border-2 border-neutral-300 rounded-md focus:border-black outline-none transition"
                  >
                    {TIME_OPTIONS.map((time) => (
                      <option key={time.value} value={time.value}>
                        {time.label}
                      </option>
                    ))}
                  </select>
                  <span className="text-neutral-500">to</span>
                  <select
                    value={daySchedule.endTime}
                    onChange={(e) =>
                      updateTime(day.key, "endTime", e.target.value)
                    }
                    className="px-3 py-2 border-2 border-neutral-300 rounded-md focus:border-black outline-none transition"
                  >
                    {TIME_OPTIONS.map((time) => (
                      <option key={time.value} value={time.value}>
                        {time.label}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="flex-1 text-neutral-400 text-sm">
                  Unavailable
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DayTimeSelector;
