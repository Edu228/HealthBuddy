import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { 
  getUserProfile, 
  getUserHealthTracking, 
  getUserNutritionTracking,
  addAIConversation 
} from "../db";
import { invokeLLM } from "../_core/llm";

export const aiRouter = router({
  // Get personalized AI recommendation
  getRecommendation: protectedProcedure
    .input(z.object({
      topic: z.enum(["workout", "nutrition", "mental_health", "general"]),
      context: z.string().optional(),
      language: z.string().default("en"),
    }))
    .mutation(async ({ ctx, input }) => {
      const profile = await getUserProfile(ctx.user.id);
      const healthTracking = await getUserHealthTracking(ctx.user.id);

      let systemPrompt = `You are HealthBuddy, a compassionate and supportive AI health companion. 
Your role is to provide personalized health advice and motivation to users.

User Profile:
- Age Group: ${profile?.ageGroup || "unknown"}
- Gender: ${profile?.gender || "unknown"}
- Fitness Level: ${profile?.fitnessLevel || "unknown"}
- Health Goals: ${profile?.healthGoals ? JSON.parse(profile.healthGoals).join(", ") : "not specified"}
- Menopause Status: ${profile?.menopauseStatus || "not applicable"}

Important: Be encouraging, non-judgmental, and focus on sustainable habits. Never be manipulative or pushy.
Adapt your communication style to be appropriate for the user's age group.
Respond in ${input.language}.`;

      let userMessage = "";
      switch (input.topic) {
        case "workout":
          userMessage = `Based on my profile and recent activity, what workout would you recommend for me today? ${input.context ? `Additional context: ${input.context}` : ""}`;
          break;
        case "nutrition":
          userMessage = `Can you suggest a healthy meal plan for me based on my goals and preferences? ${input.context ? `Additional context: ${input.context}` : ""}`;
          break;
        case "mental_health":
          userMessage = `I'd like some advice on managing stress and improving my mental well-being. ${input.context ? `Additional context: ${input.context}` : ""}`;
          break;
        default:
          userMessage = input.context || "How can you help me improve my health today?";
      }

      try {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
          ]
        });

        const aiResponseContent = response.choices[0]?.message?.content;
        const aiResponse = typeof aiResponseContent === 'string' ? aiResponseContent : "I'm having trouble generating a response right now.";

        await addAIConversation({
          id: `conv_${ctx.user.id}_${Date.now()}`,
          userId: ctx.user.id,
          conversationId: `conv_${ctx.user.id}`,
          userMessage,
          aiResponse,
          context: JSON.stringify({
            topic: input.topic,
            timestamp: new Date().toISOString()
          })
        });

        return {
          success: true,
          response: aiResponse,
          topic: input.topic
        };
      } catch (error) {
        console.error("AI recommendation error:", error);
        return {
          success: false,
          response: "I'm sorry, I'm having trouble generating a recommendation right now. Please try again later.",
          error: "AI service temporarily unavailable"
        };
      }
    }),

  // Chat with AI
  chat: protectedProcedure
    .input(z.object({
      message: z.string(),
      conversationId: z.string().optional(),
      language: z.string().default("en"),
    }))
    .mutation(async ({ ctx, input }) => {
      const profile = await getUserProfile(ctx.user.id);
      const conversationId = input.conversationId || `conv_${ctx.user.id}_${Date.now()}`;

      const systemPrompt = `You are HealthBuddy, a warm, supportive AI health companion who acts like a best friend in health matters.
You provide personalized advice for fitness, nutrition, mental health, and overall wellness.

User Information:
- Age Group: ${profile?.ageGroup || "unknown"}
- Gender: ${profile?.gender || "unknown"}
- Fitness Level: ${profile?.fitnessLevel || "unknown"}

Guidelines:
1. Be empathetic and encouraging, never judgmental
2. Provide practical, actionable advice
3. Consider the user's age group and specific health concerns
4. Use natural, conversational language
5. Never be manipulative - focus on genuine health improvement
6. Respond in ${input.language}`;

      try {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: input.message }
          ]
        });

        const aiResponseContent = response.choices[0]?.message?.content;
        const aiResponse = typeof aiResponseContent === 'string' ? aiResponseContent : "I'm here to help. Can you tell me more?";

        await addAIConversation({
          id: `msg_${ctx.user.id}_${Date.now()}`,
          userId: ctx.user.id,
          conversationId,
          userMessage: input.message,
          aiResponse,
          context: JSON.stringify({
            timestamp: new Date().toISOString(),
            language: input.language
          })
        });

        return {
          success: true,
          response: aiResponse,
          conversationId
        };
      } catch (error) {
        console.error("Chat error:", error);
        return {
          success: false,
          response: "I'm sorry, I'm having trouble responding right now. Please try again.",
          error: "Chat service temporarily unavailable"
        };
      }
    }),

  // Get motivational message based on user state
  getMotivation: protectedProcedure
    .input(z.object({
      currentMood: z.enum(["very_sad", "sad", "neutral", "happy", "very_happy"]).optional(),
      language: z.string().default("en"),
    }))
    .mutation(async ({ ctx, input }) => {
      const profile = await getUserProfile(ctx.user.id);

      const systemPrompt = `You are HealthBuddy, providing a brief, personalized motivational message.
User Age Group: ${profile?.ageGroup || "unknown"}
Current Mood: ${input.currentMood || "unknown"}

Provide a SHORT (2-3 sentences), encouraging message that:
1. Acknowledges their current mood
2. Offers gentle motivation
3. Suggests a small, achievable action
4. Is age-appropriate and respectful
Respond in ${input.language}.`;

      try {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: "I need some motivation right now." }
          ]
        });

        const motivationalContent = response.choices[0]?.message?.content;
        const motivationalMessage = typeof motivationalContent === 'string' ? motivationalContent : "You've got this! Every small step counts.";

        return {
          success: true,
          message: motivationalMessage
        };
      } catch (error) {
        console.error("Motivation error:", error);
        return {
          success: false,
          message: "Remember, you're doing great! Keep taking care of yourself.",
          error: "Service temporarily unavailable"
        };
      }
    }),
});

