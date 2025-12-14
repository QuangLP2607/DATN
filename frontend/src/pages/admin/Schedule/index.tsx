import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import type { EventWithDate } from "@/components/commons/Calnedar";
import Calendar from "@/components/commons/Calnedar";
import type { ApiSchedule } from "@/services/apiSchedule";
import scheduleApi from "@/services/apiSchedule";
import styles from "./Schedule.module.scss";

const cx = classNames.bind(styles);

function Schedule() {
  const [events, setEvents] = useState<EventWithDate[]>([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await scheduleApi.getAllSchedules();
        const data: ApiSchedule[] = res.data.data;

        const mappedEvents: EventWithDate[] = data.flatMap((cls) => {
          const startDate = new Date(cls.start_date);
          const endDate = new Date(cls.end_date);

          return cls.schedule.flatMap((s) => {
            const [startH, startM] = s.start_time.split(":").map(Number);
            const [endH, endM] = s.end_time.split(":").map(Number);

            const startDecimal = startH + startM / 60;
            const duration = endH + endM / 60 - startDecimal;

            const dayName = s.day_of_week.toLowerCase().trim();

            const dayIndexMap: Record<string, number> = {
              sunday: 0,
              sun: 0,
              monday: 1,
              mon: 1,
              tuesday: 2,
              tue: 2,
              wednesday: 3,
              wed: 3,
              thursday: 4,
              thu: 4,
              friday: 5,
              fri: 5,
              saturday: 6,
              sat: 6,
            };

            const dayOfWeek = dayIndexMap[dayName] ?? 0;

            const events: EventWithDate[] = [];

            const firstDayOfWeek = new Date(startDate);
            const startDayOfWeek = firstDayOfWeek.getDay();
            const daysToAdd = (dayOfWeek - startDayOfWeek + 7) % 7;

            firstDayOfWeek.setDate(startDate.getDate() + daysToAdd);
            firstDayOfWeek.setHours(0, 0, 0, 0);

            const eventDate = new Date(firstDayOfWeek);

            while (eventDate <= endDate) {
              events.push({
                start: startDecimal,
                duration,
                title: `${cls.class_name} - ${cls.course.name}`,
                colorClass: (["blue", "yellow", "green"] as const)[
                  Math.floor(Math.random() * 3)
                ],
                date: new Date(eventDate),
              });

              eventDate.setDate(eventDate.getDate() + 7);
            }

            return events;
          });
        });

        setEvents(mappedEvents);
      } catch (error) {
        console.error("Lỗi fetch lịch:", error);
      }
    };

    fetchSchedules();
  }, []);

  return (
    <div className={cx("schedule")}>
      <Calendar events={events} />
    </div>
  );
}

export default Schedule;
