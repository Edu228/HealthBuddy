import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { 
  getUserSubscription, 
  getSubscriptionPlan, 
  getAllSubscriptionPlans,
  createUserSubscription,
  updateUserSubscription,
  createPaymentTransaction
} from "../db";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";

const TRIAL_DAYS = 7;

export const subscriptionRouter = router({
  // Get all available subscription plans
  getPlans: publicProcedure.query(async () => {
    const plans = await getAllSubscriptionPlans();
    return plans.map(plan => ({
      ...plan,
      features: plan.features ? JSON.parse(plan.features) : []
    }));
  }),

  // Get current user's subscription status
  getMySubscription: protectedProcedure.query(async ({ ctx }) => {
    const subscription = await getUserSubscription(ctx.user.id);
    
    if (!subscription) {
      return null;
    }

    const plan = await getSubscriptionPlan(subscription.planId);
    
    return {
      ...subscription,
      plan: plan ? {
        ...plan,
        features: plan.features ? JSON.parse(plan.features) : []
      } : null,
      isActive: subscription.status === "active" || subscription.status === "trial",
      isTrialActive: subscription.status === "trial" && 
                     subscription.trialEndsAt && 
                     subscription.trialEndsAt > new Date(),
      daysLeftInTrial: subscription.status === "trial" && subscription.trialEndsAt
        ? Math.ceil((subscription.trialEndsAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : 0
    };
  }),

  // Initialize trial subscription for new user
  initializeTrial: protectedProcedure.mutation(async ({ ctx }) => {
    const existingSubscription = await getUserSubscription(ctx.user.id);
    
    if (existingSubscription) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User already has an active subscription"
      });
    }

    const basicPlan = await getSubscriptionPlan("plan_basic");
    if (!basicPlan) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Basic plan not found"
      });
    }

    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + TRIAL_DAYS);

    const subscriptionId = `sub_${ctx.user.id}_${Date.now()}`;

    await createUserSubscription({
      id: subscriptionId,
      userId: ctx.user.id,
      planId: basicPlan.id,
      status: "trial",
      trialEndsAt,
      currentPeriodStart: new Date(),
      currentPeriodEnd: trialEndsAt,
    });

    return {
      subscriptionId,
      status: "trial",
      trialEndsAt,
      daysRemaining: TRIAL_DAYS
    };
  }),

  // Upgrade subscription to a paid plan
  upgradeToPlan: protectedProcedure
    .input(z.object({
      planId: z.string(),
      paymentMethodId: z.string().optional() // Stripe payment method ID
    }))
    .mutation(async ({ ctx, input }) => {
      const currentSubscription = await getUserSubscription(ctx.user.id);
      const newPlan = await getSubscriptionPlan(input.planId);

      if (!newPlan) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Plan not found"
        });
      }

      // In a real implementation, this would integrate with Stripe
      // For now, we'll just update the subscription status
      
      const currentPeriodEnd = new Date();
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);

      if (currentSubscription) {
        // Update existing subscription
        await updateUserSubscription(currentSubscription.id, {
          planId: newPlan.id,
          status: "active",
          currentPeriodStart: new Date(),
          currentPeriodEnd,
          trialEndsAt: null,
        });
      } else {
        // Create new subscription
        const subscriptionId = `sub_${ctx.user.id}_${Date.now()}`;
        await createUserSubscription({
          id: subscriptionId,
          userId: ctx.user.id,
          planId: newPlan.id,
          status: "active",
          currentPeriodStart: new Date(),
          currentPeriodEnd,
        });
      }

      // Record payment transaction
      const transactionId = `txn_${ctx.user.id}_${Date.now()}`;
      await createPaymentTransaction({
        id: transactionId,
        userId: ctx.user.id,
        subscriptionId: currentSubscription?.id || `sub_${ctx.user.id}_${Date.now()}`,
        amount: newPlan.price,
        currency: newPlan.currency,
        status: "succeeded",
        paymentMethod: "stripe",
      });

      return {
        success: true,
        planId: newPlan.id,
        planName: newPlan.name,
        price: newPlan.price,
        message: `Successfully upgraded to ${newPlan.name}`
      };
    }),

  // Cancel subscription
  cancelSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    const subscription = await getUserSubscription(ctx.user.id);

    if (!subscription) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No active subscription found"
      });
    }

    await updateUserSubscription(subscription.id, {
      status: "canceled",
      canceledAt: new Date(),
    });

    return {
      success: true,
      message: "Subscription canceled successfully"
    };
  }),

  // Check if user has access to premium content
  hasAccessToContent: protectedProcedure
    .input(z.object({
      contentType: z.enum(["video", "meditation", "nutrition_plan", "advanced_ai", "exclusive"]),
      contentId: z.string().optional()
    }))
    .query(async ({ ctx, input }) => {
      const subscription = await getUserSubscription(ctx.user.id);

      if (!subscription) {
        return { hasAccess: false, reason: "No subscription found" };
      }

      // Trial users have access to everything
      if (subscription.status === "trial") {
        return { hasAccess: true, reason: "Trial user" };
      }

      // Active premium users have access to everything
      if (subscription.status === "active" && subscription.planId === "plan_premium") {
        return { hasAccess: true, reason: "Premium subscriber" };
      }

      // Basic plan users have limited access
      if (subscription.status === "active" && subscription.planId === "plan_basic") {
        // Basic plan has limited access to videos and meditations
        if (input.contentType === "video" || input.contentType === "meditation") {
          return { hasAccess: true, reason: "Basic plan includes limited content" };
        }
        if (input.contentType === "exclusive" || input.contentType === "advanced_ai") {
          return { hasAccess: false, reason: "Upgrade to Premium for this content" };
        }
        return { hasAccess: true, reason: "Basic plan access" };
      }

      return { hasAccess: false, reason: "Subscription expired or inactive" };
    }),
});

