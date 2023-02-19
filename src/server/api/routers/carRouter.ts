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
    .input(z.object({ carId: z.string() }))
    .query(({ ctx, input }) => {
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
                },
              },
            },
          },
        },
      });
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
});
