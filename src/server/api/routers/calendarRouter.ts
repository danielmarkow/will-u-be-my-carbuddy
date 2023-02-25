import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

// date utilities and types
type Event = {
  id: number;
  name: string;
  time: string;
  datetime: string;
  href: string;
};

type Days = {
  date: string;
  isCurrentMonth?: boolean;
  isSelected?: boolean;
  isToday?: boolean;
  events: Array<Event>;
};

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
      const dateInCurrentMonth = isDateInCurrentMonth(newDate);
      const isToday = isDateToday(newDate);
      if (dateInCurrentMonth) {
        if (isToday) {
          // today is always selected
          days.push({
            date: newDate.toISOString().slice(0, 10),
            isCurrentMonth: true,
            // isSelected: true,
            isToday: true,
            events: [],
          });
        } else {
          days.push({
            date: newDate.toISOString().slice(0, 10),
            isCurrentMonth: true,
            events: [],
          });
        }
      } else {
        days.push({
          date: newDate.toISOString().slice(0, 10),
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
  console.log("generateCalendarMonths", startDate);
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

export const calendarRouter = createTRPCRouter({
  getCalendar: protectedProcedure.query(() => {
    // doing this here because react behaves weird
    return generateCalendarDates(firstDayOfMonth(2));
  }),
});
