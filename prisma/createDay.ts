import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

type Day = {
  date: string;
  carId: string;
  userId: string;
};

const firstDay: Array<Day> = [
  {
    date: "2023-02-01",
    carId: "cleffoiu50005e912gjwktye1",
    userId: "cleg4vmi30000e9zjgsfrspo2",
  },
];

async function run() {
  const createDayContent = firstDay.map((day) =>
    prisma.days.create({
      data: {
        date: day.date,
        car: {
          connect: { id: day.carId },
        },
        user: {
          connect: { id: day.userId },
        },
      },
    })
  );

  const myDays = await prisma.$transaction(createDayContent);
  console.log(myDays);
}

run().catch((error) => console.log(error));
