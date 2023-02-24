import { useState } from "react";

export default function Calendar() {
  // helper functions
  // get first day of month x months ago
  const firstDayOfMonth = (offsetMonths: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() - offsetMonths);
    date.setDate(1);
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

  type Days = {
    date: string;
    isCurrentMonth?: boolean;
    isSelected?: boolean;
    events: Array<string>;
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
            days.push({
              date: newDate.toISOString().slice(0, 10),
              isCurrentMonth: true,
              isSelected: true,
              events: [],
            });
          }
          days.push({
            date: newDate.toISOString().slice(0, 10),
            isCurrentMonth: true,
            events: [],
          });
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

  const startDate = firstDayOfMonth(4);
  const initialDaysState = generateCalendarDates(startDate);

  const [days, setDays] = useState<Array<Days>>(initialDaysState);

  return (
    <>
      <p>Kalender</p>
      {JSON.stringify(days)}
    </>
  );
}
