export interface Events {
  id: string;
  name: string | null;
  eventStartDate: Date;
  eventEndDate: Date;
  userId: string;
  carId: string;
  createdAt: Date;
  updatedAt: Date;
}

export default interface Days {
  date: string;
  isCurrentMonth?: boolean;
  calendarWeek: number;
  isSelected?: boolean;
  isToday?: boolean;
  events: Array<Events>;
}
