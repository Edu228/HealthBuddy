import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  getUserProfile,
  getUserHealthTracking,
  getWorkoutsByCategory,
  getWorkoutById,
  getMeditationsByCategory,
  getMeditationById,
  getNutritionPlanById,
  getNutritionPlansByDietaryType,
  getRecipeById
} from "../db";
import { invokeLLM } from "../_core/llm";

export const wellnessRouter = router({
  // Get recommended workouts based on user profile and current state
  getRecommendedWorkouts: protectedProcedure
    .input(z.object({
      category: z.string().optional(),
      limit: z.number().default(5),
    }))
    .query(async ({ ctx, input }) => {
      const profile = await getUserProfile(ctx.user.id);
      const healthTracking = await getUserHealthTracking(ctx.user.id);
      
      const lastEntry = healthTracking.length > 0 ? healthTracking[healthTracking.length - 1] : null;
      
      // Get workouts based on category or fitness level
      const workouts = await getWorkoutsByCategory(input.category || "cardio");
      
      // Filter based on fitness level and age group
      let filtered = workouts.filter(w => {
        if (profile?.fitnessLevel && w.difficulty !== profile.fitnessLevel) {
          return false;
        }
        return true;
      });

      // If user has low energy or sad mood, suggest gentler exercises
      if (lastEntry?.energyLevel === "very_low" || lastEntry?.energyLevel === "low") {
        filtered = filtered.filter(w => w.difficulty === "beginner");
      }

      // If user has high energy, suggest more intense workouts
      if (lastEntry?.energyLevel === "very_high" || lastEntry?.energyLevel === "high") {
        filtered = filtered.sort((a, b) => {
          const diffOrder = { beginner: 0, intermediate: 1, advanced: 2 };
          return (diffOrder[b.difficulty as keyof typeof diffOrder] || 0) - 
                 (diffOrder[a.difficulty as keyof typeof diffOrder] || 0);
        });
      }

      return filtered.slice(0, input.limit).map(w => ({
        ...w,
        equipment: w.equipment ? JSON.parse(w.equipment) : [],
        targetAgeGroup: w.targetAgeGroup ? JSON.parse(w.targetAgeGroup) : []
      }));
    }),

  // Get workout details
  getWorkout: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ input }) => {
      const workout = await getWorkoutById(input.id);
      if (!workout) return null;
      
      return {
        ...workout,
        equipment: workout.equipment ? JSON.parse(workout.equipment) : [],
        targetAgeGroup: workout.targetAgeGroup ? JSON.parse(workout.targetAgeGroup) : []
      };
    }),

  // Get recommended meditations based on user state
  getRecommendedMeditations: protectedProcedure
    .input(z.object({
      category: z.string().optional(),
      limit: z.number().default(5),
    }))
    .query(async ({ ctx, input }) => {
      const healthTracking = await getUserHealthTracking(ctx.user.id);
      const lastEntry = healthTracking.length > 0 ? healthTracking[healthTracking.length - 1] : null;
      
      // Determine meditation category based on user's mood and needs
      let meditationCategory = input.category;
      
      if (!meditationCategory) {
        if (lastEntry?.mood === "very_sad" || lastEntry?.mood === "sad") {
          meditationCategory = "stress";
        } else if (lastEntry?.energyLevel === "very_low") {
          meditationCategory = "sleep";
        } else {
          meditationCategory = "focus";
        }
      }

      const meditations = await getMeditationsByCategory(meditationCategory);
      
      return meditations.slice(0, input.limit).map(m => ({
        ...m,
        targetAgeGroup: m.targetAgeGroup ? JSON.parse(m.targetAgeGroup) : []
      }));
    }),

  // Get meditation details
  getMeditation: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ input }) => {
      const meditation = await getMeditationById(input.id);
      if (!meditation) return null;
      
      return {
        ...meditation,
        targetAgeGroup: meditation.targetAgeGroup ? JSON.parse(meditation.targetAgeGroup) : []
      };
    }),

  // Get nutrition plan recommendations
  getRecommendedNutritionPlan: protectedProcedure
    .input(z.object({
      dietaryType: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const profile = await getUserProfile(ctx.user.id);
      
      const dietaryType = input.dietaryType || "omnivore";
      const plans = await getNutritionPlansByDietaryType(dietaryType);
      
      if (plans.length === 0) return null;
      
      const plan = plans[0];
      return {
        ...plan,
        targetAgeGroup: plan.targetAgeGroup ? JSON.parse(plan.targetAgeGroup) : [],
        macroBreakdown: plan.macroBreakdown ? JSON.parse(plan.macroBreakdown) : {},
        meals: plan.meals ? JSON.parse(plan.meals) : []
      };
    }),

  // Get recipe details
  getRecipe: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ input }) => {
      const recipe = await getRecipeById(input.id);
      if (!recipe) return null;
      
      return {
        ...recipe,
        ingredients: recipe.ingredients ? JSON.parse(recipe.ingredients) : [],
        dietaryTags: recipe.dietaryTags ? JSON.parse(recipe.dietaryTags) : []
      };
    }),

  // Get personalized wellness advice
  getWellnessAdvice: protectedProcedure
    .input(z.object({
      topic: z.enum(["workout", "nutrition", "mental_health", "overall"]),
      language: z.string().default("en"),
    }))
    .mutation(async ({ ctx, input }) => {
      const profile = await getUserProfile(ctx.user.id);
      const healthTracking = await getUserHealthTracking(ctx.user.id);
      const lastEntry = healthTracking.length > 0 ? healthTracking[healthTracking.length - 1] : null;

      const systemPrompt = `You are a wellness advisor for HealthBuddy. Provide personalized advice based on the user's profile and current state.

User Profile:
- Age Group: ${profile?.ageGroup || "unknown"}
- Gender: ${profile?.gender || "unknown"}
- Fitness Level: ${profile?.fitnessLevel || "unknown"}
- Current Mood: ${lastEntry?.mood || "unknown"}
- Energy Level: ${lastEntry?.energyLevel || "unknown"}
- Menopause Status: ${profile?.menopauseStatus || "not applicable"}

Provide practical, encouraging advice that is age-appropriate and considers the user's current state.
Respond in ${input.language}.`;

      let userMessage = "";
      switch (input.topic) {
        case "workout":
          userMessage = "What type of workout would be best for me today given my current mood and energy level?";
          break;
        case "nutrition":
          userMessage = "What should I eat today to support my health goals and current energy levels?";
          break;
        case "mental_health":
          userMessage = "How can I improve my mental health and well-being today?";
          break;
        default:
          userMessage = "What wellness advice do you have for me today?";
      }

      try {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
          ]
        });

        const adviceContent = response.choices[0]?.message?.content;
        const advice = typeof adviceContent === 'string' ? adviceContent : "I recommend focusing on sustainable habits that work for you.";

        return {
          success: true,
          advice,
          topic: input.topic
        };
      } catch (error) {
        console.error("Wellness advice error:", error);
        return {
          success: false,
          advice: "Please try again later.",
          error: "Service temporarily unavailable"
        };
      }
    }),
});

