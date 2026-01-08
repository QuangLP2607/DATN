import { useEffect, useMemo, useState } from "react";
import { useClass } from "@/hooks/useClass";
import scheduleApi, { type GetScheduleQuery } from "@/services/scheduleService";
import enrollmentApi from "@/services/enrollmentService";

import WeekMini from "./components/WeekMini";
import ClassList from "./components/ClassList";
import TodaySummary from "./components/TodaySummary";
import NextClassCard from "./components/NextClassCard";

import type { Class } from "@/interfaces/class";
import type { Schedule } from "@/interfaces/schedule";

import classNames from "classnames/bind";
import styles from "./Home.module.scss";

const cx = classNames.bind(styles);

const DAY_MAP: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

export default function Home() {
  const { classes } = useClass();

  const [classesWithCount, setClassesWithCount] = useState<
    (Class & { student_count: number })[]
  >([]);

  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const today = new Date().getDay();
  const [selectedDay, setSelectedDay] = useState(today);

  useEffect(() => {
    if (!classes?.length) return;

    const fetchEnrollments = async () => {
      const data: (Class & { student_count: number })[] = await Promise.all(
        classes.map(async (cls) => {
          const students = await enrollmentApi.searchByClass(cls.id);
          return { ...cls, student_count: students.length };
        })
      );
      setClassesWithCount(data);
    };

    fetchEnrollments();
  }, [classes]);

  useEffect(() => {
    if (!classes?.length) return;

    const fetchSchedules = async () => {
      const todayDate = new Date();
      const startOfWeek = new Date(todayDate);
      startOfWeek.setDate(todayDate.getDate() - todayDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const from = startOfWeek.toISOString().split("T")[0];
      const to = endOfWeek.toISOString().split("T")[0];

      const query: GetScheduleQuery = {
        from,
        to,
        class_id: classes.map((cls) => cls.id),
      };

      const data = await scheduleApi.search(query);
      const flatSchedules: Schedule[] = data.flatMap((cls) =>
        cls.schedules.map((s) => ({
          ...s,
          class_id: cls.id,
        }))
      );

      setSchedules(flatSchedules);
    };

    fetchSchedules();
  }, [classes]);

  const weekSchedules = useMemo(() => {
    const map: Record<number, Schedule[]> = {};
    schedules.forEach((s) => {
      const day = DAY_MAP[s.day_of_week];
      if (!map[day]) map[day] = [];
      map[day].push(s);
    });

    Object.values(map).forEach((arr) =>
      arr.sort((a, b) => a.start_time - b.start_time)
    );

    return map;
  }, [schedules]);

  return (
    <div className={cx("home-grid")}>
      {/* Main column */}
      <div className={cx("home-main")}>
        <NextClassCard schedules={weekSchedules[today] || []} />
        <ClassList classes={classesWithCount} />
      </div>

      {/* Sidebar column */}
      <aside className={cx("home-side")}>
        <TodaySummary today={today} schedules={weekSchedules[today] || []} />
        <WeekMini
          today={today}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          weekSchedules={weekSchedules}
        />
      </aside>
    </div>
  );
}
