import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

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
              id: true,
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
  acceptInvite: protectedProcedure
    .input(
      z.object({ userId: z.string(), carId: z.string(), inviteId: z.string() })
    )
    .mutation(async ({ ctx, input }) => {
      const sharedCar = await ctx.prisma.userCar.create({
        data: {
          user: { connect: { id: input.userId } },
          car: { connect: { id: input.carId } },
        },
      });

      if (sharedCar) {
        try {
          const delInvite = await ctx.prisma.invite.delete({
            where: { id: input.inviteId },
          });
          return sharedCar;
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "error deleting the invite",
            cause: error,
          });
        }
      }
    }),
});
