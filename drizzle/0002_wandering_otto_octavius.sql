CREATE TABLE `aiConversations` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`conversationId` varchar(64),
	`userMessage` text,
	`aiResponse` text,
	`context` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `aiConversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `healthTracking` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`date` timestamp DEFAULT (now()),
	`activityType` varchar(50),
	`duration` varchar(10),
	`calories` varchar(10),
	`mood` enum('very_sad','sad','neutral','happy','very_happy'),
	`energyLevel` enum('very_low','low','medium','high','very_high'),
	`sleepHours` varchar(5),
	`waterIntake` varchar(5),
	`notes` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `healthTracking_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `nutritionTracking` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`date` timestamp DEFAULT (now()),
	`mealType` enum('breakfast','lunch','dinner','snack'),
	`foodItems` text,
	`calories` varchar(10),
	`protein` varchar(10),
	`carbs` varchar(10),
	`fat` varchar(10),
	`notes` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `nutritionTracking_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userProfiles` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`ageGroup` enum('young','middle_age','senior'),
	`gender` enum('male','female','other'),
	`fitnessLevel` enum('beginner','intermediate','advanced'),
	`healthGoals` text,
	`preferences` text,
	`menstrualCycleLength` varchar(10),
	`menstrualCycleStartDate` timestamp,
	`menopauseStatus` enum('none','pre_menopause','menopause','post_menopause'),
	`allergies` text,
	`dietaryRestrictions` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `userProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `userProfiles_userId_unique` UNIQUE(`userId`)
);
