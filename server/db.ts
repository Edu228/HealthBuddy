import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users,
  userSubscriptions,
  subscriptionPlans,
  paymentTransactions,
  InsertUserSubscription,
  InsertPaymentTransaction,
  userProfiles,
  healthTracking,
  nutritionTracking,
  aiConversations,
  InsertUserProfile,
  InsertHealthTracking,
  InsertNutritionTracking,
  InsertAIConversation,
  workoutLibrary,
  meditationLibrary,
  nutritionPlans,
  recipeLibrary,
  videoClasses,
  userPoints,
  InsertUserPoints,
  communityPosts,
  InsertCommunityPost,
  communityComments,
  InsertCommunityComment,
  userAchievements,
  InsertUserAchievement,
  userNotifications,
  InsertUserNotification
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      id: user.id,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role === undefined) {
      if (user.id === ENV.ownerId) {
        user.role = 'admin';
        values.role = 'admin';
        updateSet.role = 'admin';
      }
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Subscription queries
export async function getUserSubscription(userId: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db
    .select()
    .from(userSubscriptions)
    .where(eq(userSubscriptions.userId, userId))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function getSubscriptionPlan(planId: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db
    .select()
    .from(subscriptionPlans)
    .where(eq(subscriptionPlans.id, planId))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllSubscriptionPlans() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(subscriptionPlans);
}

export async function createUserSubscription(subscription: InsertUserSubscription) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(userSubscriptions).values(subscription);
}

export async function updateUserSubscription(
  subscriptionId: string,
  updates: Partial<InsertUserSubscription>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(userSubscriptions)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(userSubscriptions.id, subscriptionId));
}

export async function createPaymentTransaction(transaction: InsertPaymentTransaction) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(paymentTransactions).values(transaction);
}


// User profile queries
export async function getUserProfile(userId: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, userId))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function createOrUpdateUserProfile(userId: string, profile: Partial<InsertUserProfile>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existingProfile = await getUserProfile(userId);
  
  if (existingProfile) {
    await db
      .update(userProfiles)
      .set({ ...profile, updatedAt: new Date() })
      .where(eq(userProfiles.userId, userId));
  } else {
    const profileId = `profile_${userId}_${Date.now()}`;
    await db.insert(userProfiles).values({
      id: profileId,
      userId,
      ...profile
    });
  }
}

// Health tracking queries
export async function addHealthTracking(tracking: InsertHealthTracking) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(healthTracking).values(tracking);
}

export async function getUserHealthTracking(userId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(healthTracking)
    .where(eq(healthTracking.userId, userId))
    .orderBy((t) => t.date);
}

// Nutrition tracking queries
export async function addNutritionTracking(tracking: InsertNutritionTracking) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(nutritionTracking).values(tracking);
}

export async function getUserNutritionTracking(userId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(nutritionTracking)
    .where(eq(nutritionTracking.userId, userId))
    .orderBy((t) => t.date);
}

// AI conversation queries
export async function addAIConversation(conversation: InsertAIConversation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(aiConversations).values(conversation);
}

export async function getUserConversationHistory(userId: string, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(aiConversations)
    .where(eq(aiConversations.userId, userId))
    .orderBy((c) => c.createdAt)
    .limit(limit);
}



// Workout library queries
export async function getWorkoutsByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(workoutLibrary).where(eq(workoutLibrary.category, category));
}

export async function getWorkoutById(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(workoutLibrary).where(eq(workoutLibrary.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Meditation library queries
export async function getMeditationsByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(meditationLibrary).where(eq(meditationLibrary.category, category));
}

export async function getMeditationById(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(meditationLibrary).where(eq(meditationLibrary.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Nutrition plans queries
export async function getNutritionPlanById(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(nutritionPlans).where(eq(nutritionPlans.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getNutritionPlansByDietaryType(dietaryType: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(nutritionPlans).where(eq(nutritionPlans.dietaryType, dietaryType));
}

// Recipe library queries
export async function getRecipeById(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(recipeLibrary).where(eq(recipeLibrary.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getRecipesByTag(tag: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(recipeLibrary);
}

export async function getRecipesByCalories(minCalories: number, maxCalories: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(recipeLibrary);
}



// Video classes queries
export async function getVideoClassById(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(videoClasses).where(eq(videoClasses.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getVideoClassesByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(videoClasses).where(eq(videoClasses.category, category));
}

// User points queries
export async function getUserPointsData(userId: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(userPoints).where(eq(userPoints.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createOrUpdateUserPoints(userId: string, points: Partial<InsertUserPoints>) {
  const db = await getDb();
  if (!db) return;
  
  const existing = await getUserPointsData(userId);
  
  if (existing) {
    // Update existing
    await db.update(userPoints).set(points).where(eq(userPoints.userId, userId));
  } else {
    // Create new
    await db.insert(userPoints).values({
      id: `points_${userId}_${Date.now()}`,
      userId,
      ...points
    });
  }
}

// Community posts queries
export async function getCommunityPosts(limit: number = 10, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(communityPosts).limit(limit).offset(offset);
}

export async function getCommunityPostById(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(communityPosts).where(eq(communityPosts.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createCommunityPost(post: InsertCommunityPost) {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(communityPosts).values(post);
}

// Community comments queries
export async function getCommentsForPost(postId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(communityComments).where(eq(communityComments.postId, postId));
}

export async function createCommunityComment(comment: InsertCommunityComment) {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(communityComments).values(comment);
}

// User achievements queries
export async function getUserAchievements(userId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(userAchievements).where(eq(userAchievements.userId, userId));
}

export async function createUserAchievement(achievement: InsertUserAchievement) {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(userAchievements).values(achievement);
}

// User notifications queries
export async function getUserNotifications(userId: string, limit: number = 10) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(userNotifications).where(eq(userNotifications.userId, userId)).limit(limit);
}

export async function createUserNotification(notification: InsertUserNotification) {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(userNotifications).values(notification);
}

export async function markNotificationAsRead(notificationId: string) {
  const db = await getDb();
  if (!db) return;
  
  await db.update(userNotifications).set({ isRead: true }).where(eq(userNotifications.id, notificationId));
}

