import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  createPaymentIntent,
  createOrGetCustomer,
  createSubscription,
  getSubscription,
  cancelSubscription,
} from "../stripe";
import { getDb } from "../db";
import { eq } from "drizzle-orm";
import { userSubscriptions } from "../../drizzle/schema";

export const paymentRouter = router({
  // Create payment intent for subscription
  createPaymentIntent: protectedProcedure
    .input(
      z.object({
        planId: z.string(),
        amount: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // Create or get Stripe customer
        const customer = await createOrGetCustomer(
          ctx.user.id,
          ctx.user.email || "",
          ctx.user.name || ""
        );

        // Create payment intent
        const paymentIntent = await createPaymentIntent(
          input.amount,
          "gbp",
          customer.id
        );

        return {
          clientSecret: paymentIntent.client_secret,
          customerId: customer.id,
          paymentIntentId: paymentIntent.id,
        };
      } catch (error) {
        console.error("Error creating payment intent:", error);
        throw error;
      }
    }),

  // Subscribe to a plan
  subscribe: protectedProcedure
    .input(
      z.object({
        planId: z.string(),
        paymentIntentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // Create or get Stripe customer
        const customer = await createOrGetCustomer(
          ctx.user.id,
          ctx.user.email || "",
          ctx.user.name || ""
        );

        // Create subscription
        const subscription = await createSubscription(
          customer.id,
          input.planId
        );

        // Save to database
        await db.insert(userSubscriptions).values({
          id: `sub_${Date.now()}`,
          userId: ctx.user.id,
          planId: input.planId,
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: customer.id,
          status: subscription.status as any,
          currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
          currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
          canceledAt: (subscription as any).canceled_at ? new Date((subscription as any).canceled_at * 1000) : null,
        });

        return {
          subscriptionId: subscription.id,
          status: subscription.status,
          clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
        };
      } catch (error) {
        console.error("Error subscribing:", error);
        throw error;
      }
    }),

  // Get current subscription
  getCurrentSubscription: protectedProcedure.query(async ({ ctx }) => {
    try {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const userSubscription = await db
        .select()
        .from(userSubscriptions)
        .where(eq(userSubscriptions.userId, ctx.user.id))
        .limit(1);

      if (userSubscription.length === 0) {
        return null;
      }

      const sub = userSubscription[0];

      // Get latest info from Stripe
      if (sub.stripeSubscriptionId) {
        const stripeSubscription = await getSubscription(sub.stripeSubscriptionId);
        return {
          id: sub.id,
          planId: sub.planId,
          status: stripeSubscription.status,
          currentPeriodStart: new Date((stripeSubscription as any).current_period_start * 1000),
          currentPeriodEnd: new Date((stripeSubscription as any).current_period_end * 1000),
          canceledAt: (stripeSubscription as any).canceled_at ? new Date((stripeSubscription as any).canceled_at * 1000) : null,
        };
      }

      return sub;
    } catch (error) {
      console.error("Error getting subscription:", error);
      return null;
    }
  }),

  // Cancel subscription
  cancelSubscription: protectedProcedure
    .input(z.object({ subscriptionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // Get subscription from DB
        const userSubscription = await db
          .select()
          .from(userSubscriptions)
          .where(eq(userSubscriptions.userId, ctx.user.id))
          .limit(1);

        if (userSubscription.length === 0) {
          throw new Error("Subscription not found");
        }

        const sub = userSubscription[0];

        // Cancel on Stripe
        if (sub.stripeSubscriptionId) {
          await cancelSubscription(sub.stripeSubscriptionId);
        }

        // Update in database
        await db
          .update(userSubscriptions)
          .set({
            status: "canceled",
            canceledAt: new Date(),
          })
          .where(eq(userSubscriptions.id, sub.id));

        return { success: true };
      } catch (error) {
        console.error("Error canceling subscription:", error);
        throw error;
      }
    }),
});

