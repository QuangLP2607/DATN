import React, { useEffect,useState } from "react";
import classNames from "classnames/bind";
import styles from "./Calendar.module.scss";

import { Icon } from "@iconify/react/dist/iconify.js";

const cx = classNames.bind(styles);

export interface Event {
  start: number;
  duration: number;
  title: string;
  colorClass: "blue" | "yellow" | "green";
}

export interface EventWithDate extends Event {
  date: Date; // ngày diễn ra sự kiện
}

interface WeekDay {
  label: string;
  date: number;
  month: number;
  year: number;
  events: EventWithDate[];
  isToday: boolean;
}

interface MonthDay {
  date: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: EventWithDate[];
}

interface CalendarProps {
  events?: EventWithDate[];
}

const Calendar: React.FC<CalendarProps> = ({ events = [] }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [weekDays, setWeekDays] = useState<WeekDay[]>([]);
  const [monthDays, setMonthDays] = useState<MonthDay[]>([]);
  const [viewMode, setViewMode] = useState<"week" | "month">("week");

  const hours: number[] = Array.from({ length: 17 }, (_, i) => i + 6);

  const getStartOfWeek = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const generateWeekDays = (startDate: Date): WeekDay[] => {
    const days: WeekDay[] = [];
    const dayLabels = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const dayEvents = events.filter(
        (e) =>
          e.date.getFullYear() === date.getFullYear() &&
          e.date.getMonth() === date.getMonth() &&
          e.date.getDate() === date.getDate()
      );

      const currentDay = new Date(date);
      currentDay.setHours(0, 0, 0, 0);

      days.push({
        label: dayLabels[i],
        date: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        events: dayEvents,
        isToday: currentDay.getTime() === today.getTime(),
      });
    }

    return days;
  };

  const generateMonthDays = (date: Date): MonthDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days: MonthDay[] = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const prevMonth = month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const actualMonth = month === 0 ? 11 : prevMonth;

      days.push({
        date: day,
        month: actualMonth,
        year: prevYear,
        isCurrentMonth: false,
        isToday: false,
        events: [],
      });
    }

    // Current month days
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const currentDay = new Date(year, month, day);
      currentDay.setHours(0, 0, 0, 0);

      const dayEvents = events.filter(
        (e) =>
          e.date.getFullYear() === currentDay.getFullYear() &&
          e.date.getMonth() === currentDay.getMonth() &&
          e.date.getDate() === currentDay.getDate()
      );

      days.push({
        date: day,
        month,
        year,
        isCurrentMonth: true,
        isToday: currentDay.getTime() === today.getTime(),
        events: dayEvents,
      });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextMonth = month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      const actualMonth = month === 11 ? 0 : nextMonth;

      days.push({
        date: day,
        month: actualMonth,
        year: nextYear,
        isCurrentMonth: false,
        isToday: false,
        events: [],
      });
    }

    return days;
  };

  useEffect(() => {
    if (viewMode === "week") {
      const startOfWeek = getStartOfWeek(currentDate);
      setWeekDays(generateWeekDays(startOfWeek));
    } else {
      setMonthDays(generateMonthDays(currentDate));
    }
  }, [currentDate, viewMode, events]);

  const formatHour = (hour: number) =>
    hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`;

  const getEventStyle = (
    start: number,
    duration: number
  ): React.CSSProperties => {
    const startOffset = (start - 6) * 80;
    const height = duration * 80;
    return { top: `${startOffset}px`, height: `${height}px` };
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time);
    const minutes = Math.floor((time % 1) * 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  };

  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "week") newDate.setDate(currentDate.getDate() - 7);
    else newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "week") newDate.setDate(currentDate.getDate() + 7);
    else newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const goToToday = () => setCurrentDate(new Date());

  const getMonthYearDisplay = () => {
    if (viewMode === "month") {
      const month = currentDate.toLocaleString("default", { month: "long" });
      const year = currentDate.getFullYear();
      return `${month} ${year}`;
    }

    const startOfWeek = getStartOfWeek(currentDate);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const startMonth = startOfWeek.toLocaleString("default", { month: "long" });
    const endMonth = endOfWeek.toLocaleString("default", { month: "long" });
    const startYear = startOfWeek.getFullYear();
    const endYear = endOfWeek.getFullYear();

    if (startMonth === endMonth && startYear === endYear)
      return `${startMonth} ${startYear}`;
    if (startYear === endYear)
      return `${startMonth} - ${endMonth} ${startYear}`;
    return `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
  };

  const colorMap: { [key in Event["colorClass"]]: string } = {
    blue: "#4A90E2",
    yellow: "#FFA500",
    green: "#4CAF50",
  };

  return (
    <div className={cx("calendar")}>
      {/* Header */}
      <div className={cx("header")}>
        <div className={cx("header__nav")}>
          <button
            onClick={goToPrevious}
            className={cx("header__nav-btn", "left")}
          >
            <Icon icon="iconamoon:arrow-left-2-bold" />
          </button>
          <button
            onClick={goToToday}
            className={cx("header__nav-btn", "today")}
          >
            Today
          </button>
          <button onClick={goToNext} className={cx("header__nav-btn", "right")}>
            <Icon icon="iconamoon:arrow-right-2-bold" />
          </button>
        </div>
        <div className={cx("header__date")}>{getMonthYearDisplay()}</div>
        <div className={cx("header__mode")}>
          <button
            className={cx("header__mode-btn", { active: viewMode === "week" })}
            onClick={() => setViewMode("week")}
          >
            Week
          </button>
          <button
            className={cx("header__mode-btn", { active: viewMode === "month" })}
            onClick={() => setViewMode("month")}
          >
            Month
          </button>
        </div>
      </div>

      {/* Calendar Content */}
      {viewMode === "week" ? (
        <div className={cx("week-view")}>
          <div className={cx("week-days-header")}>
            <div></div>
            {weekDays.map((day, idx) => (
              <div key={idx} className={cx("day-cell")}>
                <div className={cx("day-label")}>{day.label}</div>
                <div className={cx("day-number", { today: day.isToday })}>
                  {day.date}
                </div>
              </div>
            ))}
          </div>
          <div className={cx("week-time-grid")}>
            <div className={cx("time-column")}>
              {hours.map((hour) => (
                <div key={hour} className={cx("time-cell")}>
                  {formatHour(hour)}
                </div>
              ))}
            </div>
            {weekDays.map((day, dayIdx) => (
              <div
                key={dayIdx}
                className={cx("day-column", { today: day.isToday })}
              >
                {hours.map((hour) => (
                  <div key={hour} className={cx("hour-cell")}></div>
                ))}
                {day.events.map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    className={cx("event")}
                    style={{
                      ...getEventStyle(event.start, event.duration),
                      backgroundColor: colorMap[event.colorClass],
                      borderLeft: `4px solid ${colorMap[event.colorClass]}`,
                    }}
                  >
                    <div className={cx("event-time")}>
                      {formatTime(event.start)} —{" "}
                      {formatTime(event.start + event.duration)}
                    </div>
                    <div className={cx("event-title")}>{event.title}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={cx("month-view")}>
          <div className={cx("month-days-header")}>
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
              <div key={day} className={cx("month-day-label")}>
                {day}
              </div>
            ))}
          </div>
          <div className={cx("month-grid")}>
            {monthDays.map((day, idx) => (
              <div
                key={idx}
                className={cx("month-day-cell", {
                  otherMonth: !day.isCurrentMonth,
                })}
              >
                <div className={cx("month-day-number", { today: day.isToday })}>
                  {day.date}
                </div>
                {day.events.map((event, eventIdx) => (
                  <div
                    key={eventIdx}
                    className={cx("month-event")}
                    style={{ backgroundColor: colorMap[event.colorClass] }}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
