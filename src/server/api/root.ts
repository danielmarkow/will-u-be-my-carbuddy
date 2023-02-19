import { carRouter } from "./routers/carRouter";
import { inviteRouter } from "./routers/inviteRouter";
import { messagesRouter } from "./routers/messagesRouter";
import { createTRPCRouter } from "./trpc";
// import { exampleRouter } from "./routers/example";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  // example: exampleRouter,
  car: carRouter,
  messages: messagesRouter,
  invite: inviteRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
