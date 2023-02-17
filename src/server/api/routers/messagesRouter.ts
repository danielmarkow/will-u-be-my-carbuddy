import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const messagesRouter = createTRPCRouter({
  createMessage: protectedProcedure
    .input(
      z.object({
        carId: z.string(),
        userId: z.string(),
        topic: z.string(),
        message: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.carMessages.create({
        data: {
          message: input.message,
          topic: input.topic,
          userId: input.userId,
          carId: input.carId,
        },
      });
    }),
});
