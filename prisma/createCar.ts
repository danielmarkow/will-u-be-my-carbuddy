import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface Car {
  maker: string;
  model: string;
  licencePlate: string;
  ownerId: string;
}

const firstCar: Array<Car> = [
  // {
  //   maker: "Mercedes-Benz",
  //   model: "C-Klasse",
  //   licencePlate: "BSMD512",
  //   ownerId: "cle311pq10000e9d6r62qashr",
  // },
  {
    maker: "Volkswagen",
    model: "Golf",
    licencePlate: "BSMD513",
    ownerId: "cle311pq10000e9d6r62qashr",
  },
];

async function run() {
  const createCarContent = firstCar.map((car) =>
    prisma.car.create({
      data: {
        maker: car.maker,
        model: car.model,
        licencePlate: car.licencePlate,
        owner: {
          connect: {
            id: car.ownerId,
          },
        },
      },
    })
  );

  const myCars = await prisma.$transaction(createCarContent);
}

run().catch((error) => console.log(error));
