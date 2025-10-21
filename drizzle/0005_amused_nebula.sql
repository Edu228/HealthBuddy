CREATE TABLE `supportMessages` (
	`id` varchar(64) NOT NULL,
	`ticketId` varchar(64) NOT NULL,
	`sender` enum('user','agent') NOT NULL,
	`message` text NOT NULL,
	`agent` enum('support','supervisor','manager'),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `supportMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `supportTickets` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`subject` varchar(200) NOT NULL,
	`category` enum('technical','billing','subscription','feature_request','complaint','other') NOT NULL,
	`status` enum('open','in_progress','resolved','closed') NOT NULL DEFAULT 'open',
	`currentAgent` enum('support','supervisor','manager') NOT NULL DEFAULT 'support',
	`rating` varchar(1),
	`feedback` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `supportTickets_id` PRIMARY KEY(`id`)
);
