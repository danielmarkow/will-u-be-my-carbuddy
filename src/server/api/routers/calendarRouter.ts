import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.extend(weekOfYear);

import type Days from "../../../types/daysEventsType";

type Months = {
  year: string;
  month: string;
};

const firstDayOfMonth = (offsetMonths: number): Date => {
  const date = new Date();
  console.log("date firstDayOfMonth", date.toISOString());
  date.setMonth(date.getMonth() - offsetMonths);
  date.setDate(1);
  // console.log("firstDayOfMonth", date);
  return date;
};

const isDateInCurrentMonth = (date: Date) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const year = date.getFullYear();
  const month = date.getMonth();

  return year === currentYear && month === currentMonth;
};

const isDateToday = (date: Date) => {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

// generates basis dates to fill the calendar
const generateCalendarDates = (date: Date): Array<Days> => {
  let days = [];
  for (let i = 0; i < 4; i++) {
    const month = date.getMonth();
    const year = date.getFullYear();
    let daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getDate();
    for (let j = 1; j <= daysInMonth; j++) {
      const newDate = new Date(Date.UTC(year, month, j));
      const calWeek = dayjs(newDate).week();
      const dateInCurrentMonth = isDateInCurrentMonth(newDate);
      const isToday = isDateToday(newDate);
      if (dateInCurrentMonth) {
        if (isToday) {
          // today is always selected
          days.push({
            date: newDate.toISOString().slice(0, 10),
            isCurrentMonth: true,
            // isSelected: true,
            calendarWeek: calWeek,
            isToday: true,
            events: [],
          });
        } else {
          days.push({
            date: newDate.toISOString().slice(0, 10),
            isCurrentMonth: true,
            calendarWeek: calWeek,
            events: [],
          });
        }
      } else {
        days.push({
          date: newDate.toISOString().slice(0, 10),
          calendarWeek: calWeek,
          events: [],
        });
      }
    }
    date.setMonth(month + 1);
  }
  return days;
};

const generateCalendarMonths = (startDate: Date): Array<Months> => {
  const yearMonthArray = [];
  // console.log("generateCalendarMonths", startDate);
  // iterate over the next 3 months
  for (let i = 0; i < 4; i++) {
    // get the year and month of the current iteration
    const year = startDate.getFullYear();
    const month = startDate.getMonth() + i;

    // handle wrapping around to the next year
    const wrappedYear = year + Math.floor((month - 1) / 12);
    const wrappedMonth = ((month - 1) % 12) + 1;

    // add the year and month to the array as an object
    yearMonthArray.push({
      year: wrappedYear.toString(),
      month: wrappedMonth.toString(),
    });
  }

  return yearMonthArray;
};

const generateCalendarWeeks = () => {
  const weeks = [];
  let date = dayjs().startOf("month"); // Get the start of the current month

  for (let i = 0; i < 12; i++) {
    // Loop through the next three months
    for (let j = 0; j < 4; j++) {
      // Loop through the four weeks in each month
      const week = {
        start: date.startOf("week").toDate(),
        end: date.endOf("week").toDate(),
        number: date.week(),
      };

      weeks.push(week); // Add the week object to the array
      date = date.add(1, "week"); // Add one week to the current date to start the next week
    }
    date = date.add(1, "month").startOf("month"); // Move to the first day of the next month
  }

  return weeks;
};

export const calendarRouter = createTRPCRouter({
  getCalendar: protectedProcedure
    .input(z.object({ carId: z.string() }))
    .query(async ({ ctx, input }) => {
      const events = await ctx.prisma.events.findMany({
        where: { carId: input.carId },
      });

      let rawDates = generateCalendarDates(firstDayOfMonth(2));

      let datesEvents = rawDates.map((obj) => {
        const eventData = events.filter(
          (e) => e.eventStartDate.toISOString().slice(0, 10) === obj.date
        );

        obj.events = eventData;

        return obj;
      });

      return datesEvents;
    }),
});
