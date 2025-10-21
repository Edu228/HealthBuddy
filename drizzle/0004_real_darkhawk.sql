CREATE TABLE `communityComments` (
	`id` varchar(64) NOT NULL,
	`postId` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`content` text,
	`likes` varchar(10) DEFAULT '0',
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `communityComments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `communityPosts` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`content` text,
	`imageUrl` varchar(500),
	`category` varchar(50),
	`likes` varchar(10) DEFAULT '0',
	`comments` varchar(10) DEFAULT '0',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `communityPosts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userAchievements` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`badgeId` varchar(64) NOT NULL,
	`badgeName` varchar(100),
	`badgeDescription` text,
	`badgeIcon` varchar(500),
	`unlockedAt` timestamp DEFAULT (now()),
	CONSTRAINT `userAchievements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userNotifications` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`type` varchar(50),
	`title` varchar(100),
	`message` text,
	`isRead` boolean DEFAULT false,
	`actionUrl` varchar(500),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `userNotifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userPoints` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`totalPoints` varchar(10) DEFAULT '0',
	`currentStreak` varchar(10) DEFAULT '0',
	`longestStreak` varchar(10) DEFAULT '0',
	`level` varchar(10) DEFAULT '1',
	`rank` varchar(50),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `userPoints_id` PRIMARY KEY(`id`),
	CONSTRAINT `userPoints_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `videoClasses` (
	`id` varchar(64) NOT NULL,
	`title` varchar(100) NOT NULL,
	`description` text,
	`category` varchar(50),
	`instructor` varchar(100),
	`duration` varchar(10),
	`difficulty` enum('beginner','intermediate','advanced'),
	`targetAgeGroup` varchar(100),
	`videoUrl` varchar(500),
	`thumbnailUrl` varchar(500),
	`isPremium` boolean DEFAULT false,
	`viewCount` varchar(10) DEFAULT '0',
	`rating` varchar(5),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `videoClasses_id` PRIMARY KEY(`id`)
);
