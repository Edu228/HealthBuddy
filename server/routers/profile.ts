import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  getUserProfile,
  createOrUpdateUserProfile,
  addHealthTracking,
  getUserHealthTracking,
  addNutritionTracking,
  getUserNutritionTracking,
  addAIConversation,
  getUserConversationHistory
} from "../db";

export const profileRouter = router({
  // Get user profile
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const profile = await getUserProfile(ctx.user.id);
    if (profile && profile.healthGoals) {
      profile.healthGoals = JSON.parse(profile.healthGoals);
    }
    if (profile && profile.preferences) {
      profile.preferences = JSON.parse(profile.preferences);
    }
    if (profile && profile.allergies) {
      profile.allergies = JSON.parse(profile.allergies);
    }
    if (profile && profile.dietaryRestrictions) {
      profile.dietaryRestrictions = JSON.parse(profile.dietaryRestrictions);
    }
    return profile;
  }),

  // Update user profile
  updateProfile: protectedProcedure
    .input(z.object({
      ageGroup: z.enum(["young", "middle_age", "senior"]).optional(),
      gender: z.enum(["male", "female", "other"]).optional(),
      fitnessLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
      healthGoals: z.array(z.string()).optional(),
      preferences: z.record(z.string(), z.any()).optional(),
      menstrualCycleLength: z.string().optional(),
      menstrualCycleStartDate: z.date().optional(),
      menopauseStatus: z.enum(["none", "pre_menopause", "menopause", "post_menopause"]).optional(),
      allergies: z.array(z.string()).optional(),
      dietaryRestrictions: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const profileData: any = { ...input };
      
      if (input.healthGoals) {
        profileData.healthGoals = JSON.stringify(input.healthGoals);
      }
      if (input.preferences) {
        profileData.preferences = JSON.stringify(input.preferences);
      }
      if (input.allergies) {
        profileData.allergies = JSON.stringify(input.allergies);
      }
      if (input.dietaryRestrictions) {
        profileData.dietaryRestrictions = JSON.stringify(input.dietaryRestrictions);
      }
      if (input.menstrualCycleStartDate) {
        profileData.menstrualCycleStartDate = input.menstrualCycleStartDate;
      }

      await createOrUpdateUserProfile(ctx.user.id, profileData);
      
      return { success: true, message: "Profile updated successfully" };
    }),

  // Add health tracking entry
  addHealthTracking: protectedProcedure
    .input(z.object({
      activityType: z.string(),
      duration: z.string().optional(),
      calories: z.string().optional(),
      mood: z.enum(["very_sad", "sad", "neutral", "happy", "very_happy"]).optional(),
      energyLevel: z.enum(["very_low", "low", "medium", "high", "very_high"]).optional(),
      sleepHours: z.string().optional(),
      waterIntake: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const trackingId = `health_${ctx.user.id}_${Date.now()}`;
      
      await addHealthTracking({
        id: trackingId,
        userId: ctx.user.id,
        activityType: input.activityType,
        duration: input.duration,
        calories: input.calories,
        mood: input.mood,
        energyLevel: input.energyLevel,
        sleepHours: input.sleepHours,
        waterIntake: input.waterIntake,
        notes: input.notes,
      });

      return { success: true, message: "Health tracking entry added" };
    }),

  // Get health tracking history
  getHealthTracking: protectedProcedure.query(async ({ ctx }) => {
    return await getUserHealthTracking(ctx.user.id);
  }),

  // Add nutrition tracking entry
  addNutritionTracking: protectedProcedure
    .input(z.object({
      mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
      foodItems: z.array(z.string()),
      calories: z.string().optional(),
      protein: z.string().optional(),
      carbs: z.string().optional(),
      fat: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const trackingId = `nutrition_${ctx.user.id}_${Date.now()}`;
      
      await addNutritionTracking({
        id: trackingId,
        userId: ctx.user.id,
        mealType: input.mealType,
        foodItems: JSON.stringify(input.foodItems),
        calories: input.calories,
        protein: input.protein,
        carbs: input.carbs,
        fat: input.fat,
        notes: input.notes,
      });

      return { success: true, message: "Nutrition tracking entry added" };
    }),

  // Get nutrition tracking history
  getNutritionTracking: protectedProcedure.query(async ({ ctx }) => {
    const tracking = await getUserNutritionTracking(ctx.user.id);
    return tracking.map(t => ({
      ...t,
      foodItems: t.foodItems ? JSON.parse(t.foodItems) : []
    }));
  }),

  // Add AI conversation
  addAIConversation: protectedProcedure
    .input(z.object({
      conversationId: z.string().optional(),
      userMessage: z.string(),
      aiResponse: z.string(),
      context: z.record(z.string(), z.any()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const messageId = `msg_${ctx.user.id}_${Date.now()}`;
      
      await addAIConversation({
        id: messageId,
        userId: ctx.user.id,
        conversationId: input.conversationId,
        userMessage: input.userMessage,
        aiResponse: input.aiResponse,
        context: input.context ? JSON.stringify(input.context) : undefined,
      });

      return { success: true, messageId };
    }),

  // Get conversation history
  getConversationHistory: protectedProcedure.query(async ({ ctx }) => {
    const history = await getUserConversationHistory(ctx.user.id, 50);
    return history.map(h => ({
      ...h,
      context: h.context ? JSON.parse(h.context) : undefined
    }));
  }),
});

