import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  getVideoClassById,
  getVideoClassesByCategory,
  getUserPointsData,
  createOrUpdateUserPoints,
  getCommunityPosts,
  getCommunityPostById,
  createCommunityPost,
  getCommentsForPost,
  createCommunityComment,
  getUserAchievements,
  createUserAchievement,
  getUserNotifications,
  createUserNotification,
  markNotificationAsRead,
  getUserProfile
} from "../db";
import { invokeLLM } from "../_core/llm";

export const socialRouter = router({
  // Get video class details
  getVideoClass: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ input }) => {
      const videoClass = await getVideoClassById(input.id);
      if (!videoClass) return null;
      
      return {
        ...videoClass,
        targetAgeGroup: videoClass.targetAgeGroup ? JSON.parse(videoClass.targetAgeGroup) : []
      };
    }),

  // Get video classes by category
  getVideoClassesByCategory: publicProcedure
    .input(z.object({
      category: z.string(),
      limit: z.number().default(10),
    }))
    .query(async ({ input }) => {
      const classes = await getVideoClassesByCategory(input.category);
      
      return classes.slice(0, input.limit).map(vc => ({
        ...vc,
        targetAgeGroup: vc.targetAgeGroup ? JSON.parse(vc.targetAgeGroup) : []
      }));
    }),

  // Get user gamification stats
  getUserStats: protectedProcedure
    .query(async ({ ctx }) => {
      const pointsData = await getUserPointsData(ctx.user.id);
      const achievements = await getUserAchievements(ctx.user.id);
      
      return {
        points: pointsData || {
          totalPoints: 0,
          currentStreak: 0,
          longestStreak: 0,
          level: 1,
          rank: "Beginner"
        },
        achievements: achievements.length,
        badges: achievements
      };
    }),

  // Add points to user
  addPoints: protectedProcedure
    .input(z.object({
      points: z.number(),
      reason: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const current = await getUserPointsData(ctx.user.id);
      const currentPoints = parseInt(current?.totalPoints || "0");
      const newPoints = currentPoints + input.points;
      
      // Calculate level based on points (every 1000 points = 1 level)
      const newLevel = Math.floor(newPoints / 1000) + 1;
      
      // Determine rank
      let rank = "Beginner";
      if (newLevel >= 5) rank = "Bronze";
      if (newLevel >= 10) rank = "Silver";
      if (newLevel >= 20) rank = "Gold";
      if (newLevel >= 50) rank = "Platinum";
      
      await createOrUpdateUserPoints(ctx.user.id, {
        totalPoints: newPoints.toString(),
        level: newLevel.toString(),
        rank
      });
      
      return {
        success: true,
        newPoints,
        newLevel,
        rank
      };
    }),

  // Get community posts
  getCommunityPosts: publicProcedure
    .input(z.object({
      limit: z.number().default(10),
      offset: z.number().default(0),
    }))
    .query(async ({ input }) => {
      const posts = await getCommunityPosts(input.limit, input.offset);
      
      return posts.map(post => ({
        ...post,
        likes: parseInt(post.likes || "0"),
        comments: parseInt(post.comments || "0")
      }));
    }),

  // Get community post details with comments
  getCommunityPost: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ input }) => {
      const post = await getCommunityPostById(input.id);
      if (!post) return null;
      
      const comments = await getCommentsForPost(input.id);
      
      return {
        ...post,
        likes: parseInt(post.likes || "0"),
        comments: comments.map(c => ({
          ...c,
          likes: parseInt(c.likes || "0")
        }))
      };
    }),

  // Create community post
  createPost: protectedProcedure
    .input(z.object({
      content: z.string(),
      category: z.enum(["progress", "motivation", "question"]),
      imageUrl: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const postId = `post_${ctx.user.id}_${Date.now()}`;
      
      await createCommunityPost({
        id: postId,
        userId: ctx.user.id,
        content: input.content,
        category: input.category,
        imageUrl: input.imageUrl,
        likes: "0",
        comments: "0"
      });
      
      // Award points for creating a post
      await createUserNotification({
        id: `notif_${ctx.user.id}_${Date.now()}`,
        userId: ctx.user.id,
        type: "motivational",
        title: "Great job sharing!",
        message: "You earned 10 points for sharing your progress with the community!",
        isRead: false
      });
      
      return {
        success: true,
        postId
      };
    }),

  // Add comment to post
  addComment: protectedProcedure
    .input(z.object({
      postId: z.string(),
      content: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const commentId = `comment_${ctx.user.id}_${Date.now()}`;
      
      await createCommunityComment({
        id: commentId,
        postId: input.postId,
        userId: ctx.user.id,
        content: input.content,
        likes: "0"
      });
      
      return {
        success: true,
        commentId
      };
    }),

  // Get user notifications
  getNotifications: protectedProcedure
    .input(z.object({
      limit: z.number().default(10),
    }))
    .query(async ({ ctx, input }) => {
      const notifications = await getUserNotifications(ctx.user.id, input.limit);
      
      return notifications.map(n => ({
        ...n,
        isRead: n.isRead || false
      }));
    }),

  // Mark notification as read
  markAsRead: protectedProcedure
    .input(z.object({
      notificationId: z.string(),
    }))
    .mutation(async ({ input }) => {
      await markNotificationAsRead(input.notificationId);
      
      return {
        success: true
      };
    }),

  // Generate motivational notification based on user state
  generateMotivationalNotification: protectedProcedure
    .input(z.object({
      language: z.string().default("en"),
    }))
    .mutation(async ({ ctx, input }) => {
      const profile = await getUserProfile(ctx.user.id);
      
      const systemPrompt = `You are a motivational coach for HealthBuddy. Generate a short, personalized motivational notification.
User Age Group: ${profile?.ageGroup || "unknown"}
Gender: ${profile?.gender || "unknown"}

Create a notification that:
1. Is SHORT (1-2 sentences max)
2. Is encouraging and positive
3. Invites the user to take action
4. Is age-appropriate
Respond in ${input.language}.`;

      try {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: "Generate a motivational notification for me." }
          ]
        });

        const messageContent = response.choices[0]?.message?.content;
        const message = typeof messageContent === 'string' ? messageContent : "You've got this! Take a moment for yourself today.";

        await createUserNotification({
          id: `notif_${ctx.user.id}_${Date.now()}`,
          userId: ctx.user.id,
          type: "motivational",
          title: "Your Daily Motivation",
          message,
          isRead: false
        });

        return {
          success: true,
          message
        };
      } catch (error) {
        console.error("Motivational notification error:", error);
        return {
          success: false,
          error: "Service temporarily unavailable"
        };
      }
    }),

  // Unlock achievement
  unlockAchievement: protectedProcedure
    .input(z.object({
      badgeId: z.string(),
      badgeName: z.string(),
      badgeDescription: z.string(),
      badgeIcon: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const achievementId = `achievement_${ctx.user.id}_${input.badgeId}_${Date.now()}`;
      
      await createUserAchievement({
        id: achievementId,
        userId: ctx.user.id,
        badgeId: input.badgeId,
        badgeName: input.badgeName,
        badgeDescription: input.badgeDescription,
        badgeIcon: input.badgeIcon
      });

      // Create notification for achievement
      await createUserNotification({
        id: `notif_${ctx.user.id}_${Date.now()}`,
        userId: ctx.user.id,
        type: "achievement",
        title: `Achievement Unlocked: ${input.badgeName}`,
        message: input.badgeDescription,
        isRead: false
      });

      return {
        success: true,
        achievementId
      };
    }),
});

