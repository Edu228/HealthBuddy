import { mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Subscription plans table
export const subscriptionPlans = mysqlTable("subscriptionPlans", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  price: varchar("price", { length: 20 }).notNull(), // Stored as string to avoid decimal precision issues
  currency: varchar("currency", { length: 3 }).default("GBP").notNull(),
  billingPeriod: mysqlEnum("billingPeriod", ["monthly", "yearly"]).default("monthly").notNull(),
  features: text("features"), // JSON string of features
  createdAt: timestamp("createdAt").defaultNow(),
});

export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = typeof subscriptionPlans.$inferInsert;

// User subscriptions table
export const userSubscriptions = mysqlTable("userSubscriptions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  planId: varchar("planId", { length: 64 }).notNull(),
  status: mysqlEnum("status", ["trial", "active", "canceled", "expired"]).default("trial").notNull(),
  trialEndsAt: timestamp("trialEndsAt"),
  currentPeriodStart: timestamp("currentPeriodStart").defaultNow(),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  canceledAt: timestamp("canceledAt"),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type InsertUserSubscription = typeof userSubscriptions.$inferInsert;

// Payment transactions table
export const paymentTransactions = mysqlTable("paymentTransactions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  subscriptionId: varchar("subscriptionId", { length: 64 }).notNull(),
  amount: varchar("amount", { length: 20 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("GBP").notNull(),
  status: mysqlEnum("status", ["pending", "succeeded", "failed", "refunded"]).default("pending").notNull(),
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type PaymentTransaction = typeof paymentTransactions.$inferSelect;
export type InsertPaymentTransaction = typeof paymentTransactions.$inferInsert;

// User profile table
export const userProfiles = mysqlTable("userProfiles", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull().unique(),
  ageGroup: mysqlEnum("ageGroup", ["young", "middle_age", "senior"]),
  gender: mysqlEnum("gender", ["male", "female", "other"]),
  fitnessLevel: mysqlEnum("fitnessLevel", ["beginner", "intermediate", "advanced"]),
  healthGoals: text("healthGoals"), // JSON array of goals
  preferences: text("preferences"), // JSON object with user preferences
  menstrualCycleLength: varchar("menstrualCycleLength", { length: 10 }), // In days
  menstrualCycleStartDate: timestamp("menstrualCycleStartDate"),
  menopauseStatus: mysqlEnum("menopauseStatus", ["none", "pre_menopause", "menopause", "post_menopause"]),
  allergies: text("allergies"), // JSON array
  dietaryRestrictions: text("dietaryRestrictions"), // JSON array
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;

// Health tracking table
export const healthTracking = mysqlTable("healthTracking", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  date: timestamp("date").defaultNow(),
  activityType: varchar("activityType", { length: 50 }), // e.g., "running", "yoga", "gym"
  duration: varchar("duration", { length: 10 }), // In minutes
  calories: varchar("calories", { length: 10 }),
  mood: mysqlEnum("mood", ["very_sad", "sad", "neutral", "happy", "very_happy"]),
  energyLevel: mysqlEnum("energyLevel", ["very_low", "low", "medium", "high", "very_high"]),
  sleepHours: varchar("sleepHours", { length: 5 }),
  waterIntake: varchar("waterIntake", { length: 5 }), // In liters
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type HealthTracking = typeof healthTracking.$inferSelect;
export type InsertHealthTracking = typeof healthTracking.$inferInsert;

// Nutrition tracking table
export const nutritionTracking = mysqlTable("nutritionTracking", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  date: timestamp("date").defaultNow(),
  mealType: mysqlEnum("mealType", ["breakfast", "lunch", "dinner", "snack"]),
  foodItems: text("foodItems"), // JSON array of food items
  calories: varchar("calories", { length: 10 }),
  protein: varchar("protein", { length: 10 }), // In grams
  carbs: varchar("carbs", { length: 10 }), // In grams
  fat: varchar("fat", { length: 10 }), // In grams
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type NutritionTracking = typeof nutritionTracking.$inferSelect;
export type InsertNutritionTracking = typeof nutritionTracking.$inferInsert;

// AI conversation history table
export const aiConversations = mysqlTable("aiConversations", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  conversationId: varchar("conversationId", { length: 64 }),
  userMessage: text("userMessage"),
  aiResponse: text("aiResponse"),
  context: text("context"), // JSON with context data
  createdAt: timestamp("createdAt").defaultNow(),
});

export type AIConversation = typeof aiConversations.$inferSelect;
export type InsertAIConversation = typeof aiConversations.$inferInsert;

// Workout library table
export const workoutLibrary = mysqlTable("workoutLibrary", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 50 }), // e.g., "cardio", "strength", "yoga", "stretching"
  duration: varchar("duration", { length: 10 }), // In minutes
  difficulty: mysqlEnum("difficulty", ["beginner", "intermediate", "advanced"]),
  targetAgeGroup: varchar("targetAgeGroup", { length: 100 }), // JSON array of age groups
  caloriesBurned: varchar("caloriesBurned", { length: 10 }),
  equipment: text("equipment"), // JSON array
  instructions: text("instructions"),
  videoUrl: varchar("videoUrl", { length: 500 }),
  imageUrl: varchar("imageUrl", { length: 500 }),
  isPremium: boolean("isPremium").default(false),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type WorkoutLibrary = typeof workoutLibrary.$inferSelect;
export type InsertWorkoutLibrary = typeof workoutLibrary.$inferInsert;

// Meditation library table
export const meditationLibrary = mysqlTable("meditationLibrary", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 50 }), // e.g., "stress", "sleep", "focus", "anxiety"
  duration: varchar("duration", { length: 10 }), // In minutes
  targetAgeGroup: varchar("targetAgeGroup", { length: 100 }), // JSON array
  audioUrl: varchar("audioUrl", { length: 500 }),
  imageUrl: varchar("imageUrl", { length: 500 }),
  instructor: varchar("instructor", { length: 100 }),
  isPremium: boolean("isPremium").default(false),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type MeditationLibrary = typeof meditationLibrary.$inferSelect;
export type InsertMeditationLibrary = typeof meditationLibrary.$inferInsert;

// Nutrition plans table
export const nutritionPlans = mysqlTable("nutritionPlans", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  targetAgeGroup: varchar("targetAgeGroup", { length: 100 }), // JSON array
  dietaryType: varchar("dietaryType", { length: 50 }), // e.g., "omnivore", "vegetarian", "vegan", "keto"
  calorieTarget: varchar("calorieTarget", { length: 10 }),
  macroBreakdown: text("macroBreakdown"), // JSON with protein, carbs, fat percentages
  meals: text("meals"), // JSON array of meal objects
  isPremium: boolean("isPremium").default(false),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type NutritionPlan = typeof nutritionPlans.$inferSelect;
export type InsertNutritionPlan = typeof nutritionPlans.$inferInsert;

// Recipe library table
export const recipeLibrary = mysqlTable("recipeLibrary", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  ingredients: text("ingredients"), // JSON array
  instructions: text("instructions"),
  prepTime: varchar("prepTime", { length: 10 }), // In minutes
  cookTime: varchar("cookTime", { length: 10 }), // In minutes
  servings: varchar("servings", { length: 5 }),
  calories: varchar("calories", { length: 10 }),
  protein: varchar("protein", { length: 10 }),
  carbs: varchar("carbs", { length: 10 }),
  fat: varchar("fat", { length: 10 }),
  dietaryTags: text("dietaryTags"), // JSON array
  imageUrl: varchar("imageUrl", { length: 500 }),
  isPremium: boolean("isPremium").default(false),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type RecipeLibrary = typeof recipeLibrary.$inferSelect;
export type InsertRecipeLibrary = typeof recipeLibrary.$inferInsert;

// Video classes table
export const videoClasses = mysqlTable("videoClasses", {
  id: varchar("id", { length: 64 }).primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 50 }), // e.g., "yoga", "hiit", "pilates", "dance"
  instructor: varchar("instructor", { length: 100 }),
  duration: varchar("duration", { length: 10 }), // In minutes
  difficulty: mysqlEnum("difficulty", ["beginner", "intermediate", "advanced"]),
  targetAgeGroup: varchar("targetAgeGroup", { length: 100 }), // JSON array
  videoUrl: varchar("videoUrl", { length: 500 }),
  thumbnailUrl: varchar("thumbnailUrl", { length: 500 }),
  isPremium: boolean("isPremium").default(false),
  viewCount: varchar("viewCount", { length: 10 }).default("0"),
  rating: varchar("rating", { length: 5 }),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type VideoClass = typeof videoClasses.$inferSelect;
export type InsertVideoClass = typeof videoClasses.$inferInsert;

// User achievements/badges table
export const userAchievements = mysqlTable("userAchievements", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  badgeId: varchar("badgeId", { length: 64 }).notNull(),
  badgeName: varchar("badgeName", { length: 100 }),
  badgeDescription: text("badgeDescription"),
  badgeIcon: varchar("badgeIcon", { length: 500 }),
  unlockedAt: timestamp("unlockedAt").defaultNow(),
});

export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = typeof userAchievements.$inferInsert;

// User points/gamification table
export const userPoints = mysqlTable("userPoints", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull().unique(),
  totalPoints: varchar("totalPoints", { length: 10 }).default("0"),
  currentStreak: varchar("currentStreak", { length: 10 }).default("0"), // Days
  longestStreak: varchar("longestStreak", { length: 10 }).default("0"), // Days
  level: varchar("level", { length: 10 }).default("1"),
  rank: varchar("rank", { length: 50 }), // e.g., "Bronze", "Silver", "Gold"
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type UserPoints = typeof userPoints.$inferSelect;
export type InsertUserPoints = typeof userPoints.$inferInsert;

// Community posts table
export const communityPosts = mysqlTable("communityPosts", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  content: text("content"),
  imageUrl: varchar("imageUrl", { length: 500 }),
  category: varchar("category", { length: 50 }), // e.g., "progress", "motivation", "question"
  likes: varchar("likes", { length: 10 }).default("0"),
  comments: varchar("comments", { length: 10 }).default("0"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type CommunityPost = typeof communityPosts.$inferSelect;
export type InsertCommunityPost = typeof communityPosts.$inferInsert;

// Community comments table
export const communityComments = mysqlTable("communityComments", {
  id: varchar("id", { length: 64 }).primaryKey(),
  postId: varchar("postId", { length: 64 }).notNull(),
  userId: varchar("userId", { length: 64 }).notNull(),
  content: text("content"),
  likes: varchar("likes", { length: 10 }).default("0"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type CommunityComment = typeof communityComments.$inferSelect;
export type InsertCommunityComment = typeof communityComments.$inferInsert;

// User notifications table
export const userNotifications = mysqlTable("userNotifications", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  type: varchar("type", { length: 50 }), // e.g., "reminder", "achievement", "social", "motivational"
  title: varchar("title", { length: 100 }),
  message: text("message"),
  isRead: boolean("isRead").default(false),
  actionUrl: varchar("actionUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type UserNotification = typeof userNotifications.$inferSelect;
export type InsertUserNotification = typeof userNotifications.$inferInsert;


// Support tickets table
export const supportTickets = mysqlTable("supportTickets", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  subject: varchar("subject", { length: 200 }).notNull(),
  category: mysqlEnum("category", ["technical", "billing", "subscription", "feature_request", "complaint", "other"]).notNull(),
  status: mysqlEnum("status", ["open", "in_progress", "resolved", "closed"]).default("open").notNull(),
  currentAgent: mysqlEnum("currentAgent", ["support", "supervisor", "manager"]).default("support").notNull(),
  rating: varchar("rating", { length: 1 }), // 1-5 rating
  feedback: text("feedback"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertSupportTicket = typeof supportTickets.$inferInsert;

// Support messages table
export const supportMessages = mysqlTable("supportMessages", {
  id: varchar("id", { length: 64 }).primaryKey(),
  ticketId: varchar("ticketId", { length: 64 }).notNull(),
  sender: mysqlEnum("sender", ["user", "agent"]).notNull(),
  message: text("message").notNull(),
  agent: mysqlEnum("agent", ["support", "supervisor", "manager"]),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type SupportMessage = typeof supportMessages.$inferSelect;
export type InsertSupportMessage = typeof supportMessages.$inferInsert;

