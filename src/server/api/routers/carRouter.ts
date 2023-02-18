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
});
