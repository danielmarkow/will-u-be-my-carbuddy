import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

type Event = {
  name: string;
  eventStartDate: Date;
  eventEndDate: Date;
  userId: string;
  daysId: string;
};

const exampleEvents: Array<Event> = [
  {
    name: "Auto gebucht",
    eventStartDate: new Date("2023-02-01T14:00"),
    eventEndDate: new Date("2023-02-01T15:30"),
    userId: "cleg4vmi30000e9zjgsfrspo2",
    daysId: "clekjyjqb0000e9e7p6vrwwwx",
  },
];

async function run() {
  const createEventContent = exampleEvents.map((e) => {
    return prisma.events.create({
      data: {
        name: e.name,
        eventStartDate: e.eventStartDate,
        eventEndDate: e.eventEndDate,
        user: {
          connect: { id: e.userId },
        },
        days: {
          connect: { id: e.daysId },
        },
      },
    });
  });
  const myEvents = await prisma.$transaction(createEventContent);
  console.log(myEvents);
}

run();
