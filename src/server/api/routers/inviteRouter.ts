import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const inviteRouter = createTRPCRouter({
  getInvite: publicProcedure
    .input(z.object({ inviteId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.invite.findFirst({
        // TODO exclude invite fields?
        // TODO delete invite after 30 days (stored proc?)
        where: { id: input.inviteId },
        include: {
          creator: {
            select: { name: true },
          },
          car: {
            select: {
              maker: true,
              model: true,
            },
          },
        },
      });
    }),
  createInvite: protectedProcedure
    .input(z.object({ userId: z.string(), carId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId, carId } = input;
      const invite = await ctx.prisma.invite.create({
        data: {
          creator: { connect: { id: userId } },
          car: { connect: { id: carId } },
        },
      });

      return invite.id;
    }),
});
