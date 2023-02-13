import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const carRouter = createTRPCRouter({
  dashboard: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.car.findFirst({
        where: { ownerId: input.userId },
      });
    }),
});
