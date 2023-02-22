import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const carRouter = createTRPCRouter({
  dashboard: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.car.findMany({
        where: { ownerId: input.userId },
      });
    }),
  dashboardShared: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.userCar.findMany({
        where: { userId: input.userId },
        include: {
          car: true,
        },
      });
    }),
  messages: protectedProcedure
    .input(z.object({ carId: z.string(), userId: z.string() }))
    .query(async ({ ctx, input }) => {
      let validated = false;
      // check if user is owner
      const ownCar = await ctx.prisma.car.findFirst({
        where: { ownerId: input.userId, id: input.carId },
      });
      if (ownCar) {
        validated = true;
      } else {
        // check if user is co-owning
        const sharedCar = await ctx.prisma.userCar.findFirst({
          where: { userId: input.userId, carId: input.carId },
        });
        if (sharedCar) validated = true;
      }

      if (validated) {
        return ctx.prisma.car.findFirst({
          where: { id: input.carId },
          include: {
            CarMessages: {
              orderBy: {
                createdAt: "desc",
              },
              include: {
                user: {
                  select: {
                    name: true,
                    image: true,
                  },
                },
              },
            },
          },
        });
      } else {
        return null;
      }
    }),
  createCar: protectedProcedure
    .input(
      z.object({
        maker: z.string(),
        model: z.string(),
        licencePlate: z.string(),
        userId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { maker, model, licencePlate, userId } = input;
      input;
      return ctx.prisma.car.create({
        data: {
          maker,
          model,
          licencePlate,
          owner: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }),
  deleteCar: protectedProcedure
    .input(z.object({ carId: z.string().cuid() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.car.delete({
        where: { id: input.carId },
      });
    }),
});
