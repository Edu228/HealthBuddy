CREATE TABLE `meditationLibrary` (
	`id` varchar(64) NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`category` varchar(50),
	`duration` varchar(10),
	`targetAgeGroup` varchar(100),
	`audioUrl` varchar(500),
	`imageUrl` varchar(500),
	`instructor` varchar(100),
	`isPremium` boolean DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `meditationLibrary_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `nutritionPlans` (
	`id` varchar(64) NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`targetAgeGroup` varchar(100),
	`dietaryType` varchar(50),
	`calorieTarget` varchar(10),
	`macroBreakdown` text,
	`meals` text,
	`isPremium` boolean DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `nutritionPlans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `recipeLibrary` (
	`id` varchar(64) NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`ingredients` text,
	`instructions` text,
	`prepTime` varchar(10),
	`cookTime` varchar(10),
	`servings` varchar(5),
	`calories` varchar(10),
	`protein` varchar(10),
	`carbs` varchar(10),
	`fat` varchar(10),
	`dietaryTags` text,
	`imageUrl` varchar(500),
	`isPremium` boolean DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `recipeLibrary_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workoutLibrary` (
	`id` varchar(64) NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`category` varchar(50),
	`duration` varchar(10),
	`difficulty` enum('beginner','intermediate','advanced'),
	`targetAgeGroup` varchar(100),
	`caloriesBurned` varchar(10),
	`equipment` text,
	`instructions` text,
	`videoUrl` varchar(500),
	`imageUrl` varchar(500),
	`isPremium` boolean DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `workoutLibrary_id` PRIMARY KEY(`id`)
);
