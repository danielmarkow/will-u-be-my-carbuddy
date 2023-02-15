import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const messagesRouter = createTRPCRouter({
  createMessage: protectedProcedure
    .input(
      z.object({
        carId: z.string(),
        userId: z.string(),
        mtype: z.string(),
        message: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.carMessages.create({
        data: {
          message: input.message,
          type: input.mtype,
          userId: input.userId,
          carId: input.carId,
        },
      });
    }),
});
