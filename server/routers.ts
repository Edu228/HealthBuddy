import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { subscriptionRouter } from "./routers/subscription";
import { profileRouter } from "./routers/profile";
import { aiRouter } from "./routers/ai";
import { wellnessRouter } from "./routers/wellness";
import { socialRouter } from "./routers/social";
import { paymentRouter } from "./routers/payment";
import { supportRouter } from "./routers/support";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  subscription: subscriptionRouter,
  profile: profileRouter,
  ai: aiRouter,
  wellness: wellnessRouter,
  social: socialRouter,
  payment: paymentRouter,
  support: supportRouter,
});


export type AppRouter = typeof appRouter;
