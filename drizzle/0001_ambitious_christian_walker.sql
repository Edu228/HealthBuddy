CREATE TABLE `paymentTransactions` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`subscriptionId` varchar(64) NOT NULL,
	`amount` varchar(20) NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'GBP',
	`status` enum('pending','succeeded','failed','refunded') NOT NULL DEFAULT 'pending',
	`paymentMethod` varchar(50),
	`stripePaymentIntentId` varchar(255),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `paymentTransactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptionPlans` (
	`id` varchar(64) NOT NULL,
	`name` varchar(100) NOT NULL,
	`price` varchar(20) NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'GBP',
	`billingPeriod` enum('monthly','yearly') NOT NULL DEFAULT 'monthly',
	`features` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `subscriptionPlans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userSubscriptions` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`planId` varchar(64) NOT NULL,
	`status` enum('trial','active','canceled','expired') NOT NULL DEFAULT 'trial',
	`trialEndsAt` timestamp,
	`currentPeriodStart` timestamp DEFAULT (now()),
	`currentPeriodEnd` timestamp,
	`canceledAt` timestamp,
	`stripeCustomerId` varchar(255),
	`stripeSubscriptionId` varchar(255),
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `userSubscriptions_id` PRIMARY KEY(`id`)
);
